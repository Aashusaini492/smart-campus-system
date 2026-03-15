"""
Advanced seed script for Smart Campus RFID system.

Features:
- Generate 100 students automatically
- Register students via API
- Simulate RFID scans
- Random attendance distribution
- Good for analytics testing

Run:
python seed.py

Requirements:
Backend running (uvicorn main:app)
MongoDB running
"""

import requests
import random
import time

API = "http://localhost:8000"

DEPARTMENTS = [
    "Computer Science",
    "Information Technology",
    "Electronics",
    "Mechanical",
]

YEARS = [
    "1st Year",
    "2nd Year",
    "3rd Year",
    "4th Year",
]

FIRST_NAMES = [
    "Aarav","Rahul","Priya","Neha","Anjali","Karan","Simran",
    "Rohit","Aman","Vikas","Isha","Aditya","Riya","Arjun"
]

LAST_NAMES = [
    "Sharma","Singh","Verma","Gupta","Patel","Kumar","Mehta",
    "Kaur","Yadav","Joshi"
]


def random_name():
    return f"{random.choice(FIRST_NAMES)} {random.choice(LAST_NAMES)}"


def generate_students(n=30):
    students = []

    for i in range(1, n + 1):

        student = {
            "student_id": f"CAMPUS-{1000+i}",
            "name": random_name(),
            "department": random.choice(DEPARTMENTS),
            "year": random.choice(YEARS),
            "rfid_uid": f"RFID-{1000+i}",
        }

        students.append(student)

    return students


def register_students(students):

    print("Registering students...")

    for s in students:

        r = requests.post(f"{API}/students", json=s)

        if r.status_code in (200, 201):
            print(f"Registered: {s['name']}")

        elif r.status_code == 409:
            print(f"Already exists: {s['name']}")

        else:
            print(f"Error {r.status_code}: {r.text}")


def simulate_attendance(students):

    print("\nSimulating RFID scans...")

    present_students = random.sample(students, int(len(students) * 0.7))

    for s in present_students:

        payload = {
            "uid": s["rfid_uid"],
            "reader_id": random.choice(["gate-01", "MATLAB_READER_1"]),
            "location_type": random.choice(["gate", "classroom"])
        }

        r = requests.post(f"{API}/rfid/scan", json=payload)

        if r.status_code == 200:
            print(f"Attendance marked: {s['name']}")
        else:
            print(f"Scan failed {r.status_code}: {r.text}")

        time.sleep(0.2)


def main():

    students = generate_students(15)

    register_students(students)

    simulate_attendance(students)

    print("\nSeed completed.")
    print("Check analytics at:")
    print("http://localhost:8000/analytics/summary")
    print("http://localhost:8000/analytics/recent-swipes")


if __name__ == "__main__":
    main()