import { useEffect, useState } from "react"

type Student = {
  student_id: string
  name: string
  department: string
  year: string
  rfid_uid: string
}

type Attendance = {
  rfid_uid: string
  reader_id: string
  location_type: string
  timestamp: string
}

export default function Admin() {

  const [students, setStudents] = useState<Student[]>([])
  const [attendance, setAttendance] = useState<Attendance[]>([])

  useEffect(() => {

    fetch("http://localhost:8000/admin/students")
      .then(res => res.json())
      .then(data => setStudents(data))

    fetch("http://localhost:8000/admin/attendance")
      .then(res => res.json())
      .then(data => setAttendance(data))

  }, [])

  const resetAttendance = () => {

    fetch("http://localhost:8000/admin/reset-attendance", {
      method: "DELETE"
    }).then(() => {
      alert("Attendance Reset Successful")
      window.location.reload()
    })

  }

  return (

    <div className="p-8 bg-slate-50 min-h-screen">

      <h1 className="text-2xl font-bold text-slate-800 mb-6">
        Admin Control Panel
      </h1>

      <div className="grid md:grid-cols-2 gap-6">

        {/* Students */}
        <div className="bg-white rounded-xl shadow p-5">

          <h2 className="font-semibold text-lg mb-4">
            Registered Students
          </h2>

          <div className="max-h-80 overflow-y-auto">

            {students.map((s, i) => (

              <div key={i} className="border-b py-2 text-sm">

                <p className="font-medium">{s.name}</p>

                <p className="text-slate-500">
                  {s.student_id} • {s.department}
                </p>

              </div>

            ))}

          </div>

        </div>


        {/* Attendance */}
        <div className="bg-white rounded-xl shadow p-5">

          <h2 className="font-semibold text-lg mb-4">
            Attendance Logs
          </h2>

          <div className="max-h-80 overflow-y-auto">

            {attendance.map((a, i) => (

              <div key={i} className="border-b py-2 text-sm">

                <p className="font-medium">{a.rfid_uid}</p>

                <p className="text-slate-500">
                  {a.location_type} • {new Date(a.timestamp).toLocaleTimeString()}
                </p>

              </div>

            ))}

          </div>

        </div>

      </div>


      {/* Reset Button */}
      <button
        onClick={resetAttendance}
        className="mt-8 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg"
      >
        Reset Attendance
      </button>

    </div>

  )

}