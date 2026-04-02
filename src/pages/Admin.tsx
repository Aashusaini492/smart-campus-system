const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

import { useEffect, useState } from 'react'

type Student = {
  id: string
  student_id: string
  name: string
  department: string
  year: string
  rfid_uid: string
}

type Attendance = {
  id: string
  student_id: string
  name: string
  department: string
  year: string
  location_type: string
  time_in: string
}

export default function Admin() {
  const [students, setStudents] = useState<Student[]>([])
  const [attendance, setAttendance] = useState<Attendance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [resetting, setResetting] = useState(false)

  const loadData = async () => {
    try {
      setError(null)
      setLoading(true)

      const [studentsRes, attendanceRes] = await Promise.all([
        fetch(`${API_BASE}/admin/students`),
        fetch(`${API_BASE}/admin/attendance?limit=100`),
      ])

      if (!studentsRes.ok) {
        throw new Error(`Failed to load students (${studentsRes.status})`)
      }
      if (!attendanceRes.ok) {
        throw new Error(`Failed to load attendance (${attendanceRes.status})`)
      }

      const [studentsData, attendanceData] = await Promise.all([
        studentsRes.json(),
        attendanceRes.json(),
      ])

      setStudents(studentsData)
      setAttendance(attendanceData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load admin data')
      setStudents([])
      setAttendance([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const resetAttendance = async () => {
    if (!window.confirm('Reset all attendance logs?')) {
      return
    }

    try {
      setResetting(true)
      setError(null)
      const res = await fetch(`${API_BASE}/admin/reset-attendance`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        throw new Error(`Reset failed (${res.status})`)
      }
      await loadData()
      alert('Attendance reset successful')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to reset attendance')
    } finally {
      setResetting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            Admin Control
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">
            Smart Campus Admin Panel
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage registered students and attendance logs from the backend.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={loadData}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Refresh data
          </button>
          <button
            type="button"
            onClick={resetAttendance}
            disabled={resetting}
            className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:bg-rose-300"
          >
            {resetting ? 'Resetting…' : 'Reset attendance'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                Students
              </p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">
                Registered students
              </h2>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
              {loading ? 'Loading…' : `${students.length} registered`}
            </span>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-100">
            <div className="grid grid-cols-[1.2fr_1fr_1fr_1fr] bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:grid-cols-4">
              <span>Name</span>
              <span>Student ID</span>
              <span className="hidden sm:inline">Department</span>
              <span className="hidden lg:inline">Year</span>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {students.length > 0 ? (
                students.map((student) => (
                  <div
                    key={student.id}
                    className="grid grid-cols-[1.2fr_1fr_1fr_1fr] gap-4 border-t border-slate-100 px-4 py-4 text-sm text-slate-700 sm:grid-cols-4"
                  >
                    <span className="font-medium text-slate-900">{student.name}</span>
                    <span>{student.student_id}</span>
                    <span className="hidden sm:inline">{student.department}</span>
                    <span className="hidden lg:inline">{student.year}</span>
                  </div>
                ))
              ) : (
                <div className="rounded-b-3xl bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
                  {loading ? 'Loading students…' : 'No students available yet.'}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                Attendance
              </p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">
                Latest swipe logs
              </h2>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
              {loading ? 'Loading…' : `${attendance.length} records`}
            </span>
          </div>

          <div className="space-y-3">
            {attendance.length > 0 ? (
              attendance.map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-3xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-700"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="font-medium text-slate-900">{entry.name}</p>
                      <p className="text-xs text-slate-500">{entry.student_id} · {entry.department}</p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
                      {entry.time_in}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-slate-600">Location: {entry.location_type}</p>
                </div>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                {loading ? 'Loading attendance logs…' : 'No attendance records found.'}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
