"""
Seed script to add sample students and simulate RFID scans for testing.
Run with: python seed.py
Requires: backend running (uvicorn main:app), MongoDB running.
"""
import requests

API = "http://localhost:8000"

STUDENTS = [
{"student_id": "CSE-2021-043", "name": "Aarav Sharma", "department": "Computer Science", "year": "3rd Year", "rfid_uid": "04A1B2C3D4E5"},
{"student_id": "ECE-2022-118", "name": "Priya Verma", "department": "Electronics", "year": "2nd Year", "rfid_uid": "04B2C3D4E5F6"},
{"student_id": "ME-2020-057", "name": "Rahul Singh", "department": "Mechanical", "year": "4th Year", "rfid_uid": "04C3D4E5F6A7"},
{"student_id": "CIV-2023-021", "name": "Simran Kaur", "department": "Civil", "year": "1st Year", "rfid_uid": "04D4E5F6A7B8"},
{"student_id": "CSE-2022-066", "name": "Aditya Kumar", "department": "Computer Science", "year": "2nd Year", "rfid_uid": "04E5F6A7B8C9"},
{"student_id": "ECE-2021-052", "name": "Neha Gupta", "department": "Electronics", "year": "3rd Year", "rfid_uid": "04F6A7B8C9D0"},
{"student_id": "ME-2022-091", "name": "Karan Patel", "department": "Mechanical", "year": "2nd Year", "rfid_uid": "0411A2B3C4D5"},
{"student_id": "CIV-2021-034", "name": "Ananya Das", "department": "Civil", "year": "3rd Year", "rfid_uid": "0422B3C4D5E6"},
{"student_id": "CSE-2023-012", "name": "Rohit Mehta", "department": "Computer Science", "year": "1st Year", "rfid_uid": "0433C4D5E6F7"},
{"student_id": "ECE-2020-078", "name": "Sneha Iyer", "department": "Electronics", "year": "4th Year", "rfid_uid": "0444D5E6F7A8"}
]

def main():
    for s in STUDENTS:
        r = requests.post(f"{API}/students", json=s)
        if r.status_code in (200, 201):
            print(f"Registered: {s['name']}")
        elif r.status_code == 409:
            print(f"Already exists: {s['name']}")
        else:
            print(f"Error {r.status_code}: {s['name']} - {r.text}")

    # Simulate scans at different locations
    scans = [
        ("04A1B2C3D4E5", "gate-01", "gate"),
        ("04B2C3D4E5F6", "gate-01", "gate"),
        ("04C3D4E5F6A7", "classroom-A101", "classroom"),
        ("04D4E5F6A7B8", "library-01", "library"),
    ]
    for uid, reader_id, loc in scans:
        r = requests.post(f"{API}/rfid/scan", json={"uid": uid, "reader_id": reader_id, "location_type": loc})
        if r.status_code == 200:
            print(f"Scan recorded: {uid} @ {loc}")
        else:
            print(f"Scan failed {r.status_code}: {r.text}")

if __name__ == "__main__":
    main()
