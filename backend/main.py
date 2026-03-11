from datetime import datetime, timedelta, timezone
from typing import Annotated, Literal, Optional

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from bson import ObjectId
import os


# -----------------------------
# DATABASE CONFIG
# -----------------------------

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "smart_campus")

client = AsyncIOMotorClient(MONGODB_URI)
db = client[MONGO_DB_NAME]


async def get_db():
    return db


DbDep = Annotated[AsyncIOMotorDatabase, Depends(get_db)]


# -----------------------------
# APP CONFIG
# -----------------------------

app = FastAPI(title="Smart Campus RFID Attendance API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------------
# UTILITY
# -----------------------------

def _serialize_student(doc: dict) -> dict:
    doc = dict(doc)
    if "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc


def _today_range():
    now = datetime.now(timezone.utc)
    start = datetime(now.year, now.month, now.day, tzinfo=timezone.utc)
    end = start + timedelta(days=1)
    return start, end


# -----------------------------
# MODELS
# -----------------------------

class StudentCreate(BaseModel):
    student_id: str
    name: str
    department: str
    year: str
    rfid_uid: str


class StudentPublic(BaseModel):
    id: str = Field(alias="_id")
    student_id: str
    name: str
    department: str
    year: str
    rfid_uid: str

    model_config = {"populate_by_name": True}


LocationType = Literal["classroom", "workshop", "library", "gate"]


class RFIDScanRequest(BaseModel):
    uid: str
    reader_id: str
    location_type: LocationType


class RFIDScanResponse(BaseModel):
    student: StudentPublic
    recorded_at: datetime
    location_type: LocationType
    reader_id: str


class AnalyticsSummary(BaseModel):
    total_students: int
    present_today: int
    absent_today: int
    attendance_today_percent: float


class WeeklyPoint(BaseModel):
    day: str
    value: float


class DepartmentStat(BaseModel):
    name: str
    value: float


class AnalyticsPayload(BaseModel):
    summary: AnalyticsSummary
    weekly_trend: list[WeeklyPoint]
    departments: list[DepartmentStat]


class RecentSwipeItem(BaseModel):
    id: str
    name: str
    student_id: str
    department: str
    year: str
    time_in: str
    location_type: str


# -----------------------------
# HEALTH CHECK
# -----------------------------

@app.get("/")
async def health():
    return {"status": "ok"}


# -----------------------------
# STUDENT APIs
# -----------------------------

@app.post("/students", response_model=StudentPublic, status_code=201)
async def register_student(student: StudentCreate, db: DbDep):

    existing = await db.students.find_one(
        {"$or": [{"student_id": student.student_id}, {"rfid_uid": student.rfid_uid}]}
    )

    if existing:
        raise HTTPException(409, "Student already exists")

    doc = {
        "student_id": student.student_id,
        "name": student.name,
        "department": student.department,
        "year": student.year,
        "rfid_uid": student.rfid_uid,
        "created_at": datetime.now(timezone.utc),
    }

    result = await db.students.insert_one(doc)

    created = await db.students.find_one({"_id": result.inserted_id})

    return StudentPublic(**_serialize_student(created))


@app.get("/students", response_model=list[StudentPublic])
async def get_students(db: DbDep):

    students = []
    cursor = db.students.find()

    async for doc in cursor:
        students.append(StudentPublic(**_serialize_student(doc)))

    return students


# -----------------------------
# RFID SCAN
# -----------------------------

async def _find_student_by_uid(db, uid):

    return await db.students.find_one({"rfid_uid": uid})


@app.post("/rfid/scan", response_model=RFIDScanResponse)
async def handle_rfid_scan(payload: RFIDScanRequest, db: DbDep):

    student = await _find_student_by_uid(db, payload.uid)

    if not student:
        raise HTTPException(404, "RFID not registered")

    now = datetime.now(timezone.utc)

    attendance_doc = {
        "student_id": student["_id"],
        "rfid_uid": payload.uid,
        "reader_id": payload.reader_id,
        "location_type": payload.location_type,
        "timestamp": now,
    }

    await db.attendance_events.insert_one(attendance_doc)

    return RFIDScanResponse(
        student=StudentPublic(**_serialize_student(student)),
        recorded_at=now,
        location_type=payload.location_type,
        reader_id=payload.reader_id,
    )


# -----------------------------
# ANALYTICS SUMMARY
# -----------------------------

@app.get("/analytics/summary", response_model=AnalyticsPayload)
async def analytics_summary(db: DbDep):

    start_today, end_today = _today_range()

    total_students = await db.students.count_documents({})

    # UNIQUE PRESENT STUDENTS
    pipeline = [
        {
            "$match": {
                "timestamp": {"$gte": start_today, "$lt": end_today}
            }
        },
        {
            "$group": {"_id": "$student_id"}
        }
    ]

    present_students = await db.attendance_events.aggregate(pipeline).to_list(None)

    present_today = len(present_students)

    absent_today = max(total_students - present_today, 0)

    percent = (
        round((present_today / total_students) * 100, 1)
        if total_students > 0
        else 0
    )

    # WEEKLY TREND
    weekly = []

    for i in range(4, -1, -1):

        day_start = start_today - timedelta(days=i)
        day_end = day_start + timedelta(days=1)

        pipeline = [
            {"$match": {"timestamp": {"$gte": day_start, "$lt": day_end}}},
            {"$group": {"_id": "$student_id"}},
        ]

        res = await db.attendance_events.aggregate(pipeline).to_list(None)

        value = (
            round((len(res) / total_students) * 100, 1)
            if total_students > 0
            else 0
        )

        weekly.append(
            WeeklyPoint(
                day=day_start.strftime("%a"),
                value=value,
            )
        )

    # DEPARTMENT STATS
    pipeline_dept = [
        {
            "$match": {
                "timestamp": {"$gte": start_today, "$lt": end_today}
            }
        },
        {
            "$lookup": {
                "from": "students",
                "localField": "student_id",
                "foreignField": "_id",
                "as": "student",
            }
        },
        {"$unwind": "$student"},
        {
            "$group": {
                "_id": "$student.department",
                "present": {"$addToSet": "$student._id"},
            }
        },
    ]

    dept_docs = await db.attendance_events.aggregate(pipeline_dept).to_list(None)

    departments = []

    for doc in dept_docs:

        total_dept = await db.students.count_documents(
            {"department": doc["_id"]}
        )

        value = (
            round((len(doc["present"]) / total_dept) * 100, 1)
            if total_dept > 0
            else 0
        )

        departments.append(
            DepartmentStat(
                name=doc["_id"],
                value=value,
            )
        )

    summary = AnalyticsSummary(
        total_students=total_students,
        present_today=present_today,
        absent_today=absent_today,
        attendance_today_percent=percent,
    )

    return AnalyticsPayload(
        summary=summary,
        weekly_trend=weekly,
        departments=departments,
    )


# -----------------------------
# RECENT SWIPES
# -----------------------------

@app.get("/analytics/recent-swipes", response_model=list[RecentSwipeItem])
async def recent_swipes(db: DbDep, limit: int = 20):

    pipeline = [
        {"$sort": {"timestamp": -1}},
        {"$limit": limit},
        {
            "$lookup": {
                "from": "students",
                "localField": "student_id",
                "foreignField": "_id",
                "as": "student",
            }
        },
        {"$unwind": "$student"},
        {
            "$project": {
                "id": {"$toString": "$_id"},
                "name": "$student.name",
                "student_id": "$student.student_id",
                "department": "$student.department",
                "year": "$student.year",
                "time_in": {
                    "$dateToString": {
                        "format": "%H:%M",
                        "date": "$timestamp",
                        "timezone": "UTC",
                    }
                },
                "location_type": "$location_type",
            }
        },
    ]

    docs = await db.attendance_events.aggregate(pipeline).to_list(limit)

    return [RecentSwipeItem(**d) for d in docs]


# -----------------------------
# RUN SERVER
# -----------------------------

if __name__ == "__main__":

    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )