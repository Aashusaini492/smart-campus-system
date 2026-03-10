import './index.css'

type AttendanceSummary = {
  totalStudents: number
  presentToday: number
  absentToday: number
  averageAttendance: number
}

type AttendanceRecord = {
  id: number
  name: string
  rollNo: string
  department: string
  year: string
  timeIn: string
  status: 'Present' | 'Late' | 'Absent'
}

const summary: AttendanceSummary = {
  totalStudents: 0,
  presentToday: 0,
  absentToday: 0,
  averageAttendance: 0,
}

const recentSwipes: AttendanceRecord[] = []

const weeklyAttendance: { day: string; value: number }[] = []

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-72 flex-shrink-0 border-r border-slate-200 bg-white/80 px-6 pb-8 pt-6 shadow-sm backdrop-blur lg:flex lg:flex-col">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <span className="text-lg font-semibold">SC</span>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Smart Campus
              </p>
              <p className="text-sm font-semibold text-slate-900">
                RFID Attendance
              </p>
            </div>
          </div>

          <nav className="space-y-1 text-sm font-medium text-slate-500">
            <p className="px-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Overview
            </p>
            <button className="flex w-full items-center justify-between rounded-lg bg-indigo-50 px-3 py-2 text-indigo-700">
              <span className="flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-indigo-100 text-xs">
                  📊
                </span>
                Dashboard
              </span>
              <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs">
                Live
              </span>
            </button>

            <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 hover:bg-slate-50">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-xs">
                🎓
              </span>
              Students
            </button>
            <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 hover:bg-slate-50">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-xs">
                🏛️
              </span>
              Departments
            </button>
            <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 hover:bg-slate-50">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-xs">
                📅
              </span>
              Timetable
            </button>

            <p className="mt-4 px-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              System
            </p>
            <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 hover:bg-slate-50">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-xs">
                📡
              </span>
              RFID Readers
            </button>
            <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 hover:bg-slate-50">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-xs">
                ⚙️
              </span>
              Settings
            </button>
          </nav>

          <div className="mt-auto rounded-xl bg-slate-900 px-4 py-4 text-xs text-slate-100">
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-300">
              System status
            </p>
            <p className="mb-2 text-sm font-medium">All RFID gateways online</p>
            <p className="text-[11px] text-slate-300">
              12 devices connected · Last sync 2 mins ago
            </p>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex min-h-screen flex-1 flex-col">
          {/* Top bar */}
          <header className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-lg shadow-sm lg:hidden">
                ☰
              </button>
              <div>
                <h1 className="text-base font-semibold text-slate-900 sm:text-lg">
                  Campus Attendance Overview
                </h1>
                <p className="text-xs text-slate-500 sm:text-sm">
                  Live RFID check-ins · {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-500 sm:flex">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Live sync enabled
              </div>
              <button className="hidden rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm sm:inline-flex">
                Export report
              </button>
              <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1 shadow-sm">
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-sky-400" />
                <div className="hidden text-xs sm:block">
                  <p className="font-semibold text-slate-900">Admin</p>
                  <p className="text-[11px] text-slate-500">Attendance Control</p>
                </div>
              </div>
            </div>
          </header>

          {/* Dashboard content */}
          <main className="flex-1 px-4 pb-6 pt-4 sm:px-6 lg:px-8 lg:pt-6">
            {/* Summary cards */}
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Total Enrolled
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  {summary.totalStudents ? summary.totalStudents.toLocaleString() : '—'}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {summary.totalStudents
                    ? 'Across all departments & years'
                    : 'No enrollment data yet'}
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 shadow-sm">
                <p className="text-xs font-medium uppercase tracking-wide text-emerald-600">
                  Present Today
                </p>
                <p className="mt-2 text-2xl font-semibold text-emerald-900">
                  {summary.presentToday ? summary.presentToday.toLocaleString() : '—'}
                </p>
                <p className="mt-1 text-xs text-emerald-700">
                  {summary.presentToday && summary.totalStudents
                    ? `${((summary.presentToday / summary.totalStudents) * 100).toFixed(1)}% of students on campus`
                    : 'Waiting for first RFID scans'}
                </p>
              </div>

              <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4 shadow-sm">
                <p className="text-xs font-medium uppercase tracking-wide text-rose-600">
                  Absent / Not Scanned
                </p>
                <p className="mt-2 text-2xl font-semibold text-rose-900">
                  {summary.absentToday ? summary.absentToday.toLocaleString() : '—'}
                </p>
                <p className="mt-1 text-xs text-rose-700">
                  {summary.absentToday
                    ? 'Includes students without valid RFID events'
                    : 'Calculated once check-ins begin'}
                </p>
              </div>

              <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4 shadow-sm">
                <p className="text-xs font-medium uppercase tracking-wide text-indigo-600">
                  Average Attendance
                </p>
                <div className="mt-2 flex items-baseline gap-2">
                  <p className="text-2xl font-semibold text-indigo-900">
                    {summary.averageAttendance ? `${summary.averageAttendance.toFixed(1)}%` : '—'}
                  </p>
                  {summary.averageAttendance ? (
                    <span className="rounded-full bg-white/80 px-2 py-0.5 text-[11px] font-medium text-emerald-600">
                      +2.4% vs last week
                    </span>
                  ) : (
                    <span className="rounded-full bg-white/80 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                      No historical data
                    </span>
                  )}
                </div>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-indigo-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-sky-400"
                    style={{ width: `${summary.averageAttendance || 0}%` }}
                  />
                </div>
              </div>
            </section>

            {/* Charts & details */}
            <section className="mt-6 grid gap-4 xl:grid-cols-3">
              {/* Weekly attendance trend */}
              <div className="xl:col-span-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Weekly trend
                      </p>
                      <p className="text-sm font-semibold text-slate-900">
                        Attendance by day
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="inline-flex h-2 w-2 rounded-full bg-indigo-500" />
                      Current week
                    </div>
                  </div>

                  {weeklyAttendance.length > 0 ? (
                    <>
                      <div className="mt-4 h-40 sm:h-44">
                        <div className="flex h-full items-end gap-3 sm:gap-4">
                          {weeklyAttendance.map((point) => (
                            <div
                              key={point.day}
                              className="flex flex-1 flex-col items-center justify-end gap-2"
                            >
                              <div className="relative flex w-full flex-1 items-end rounded-full bg-slate-50">
                                <div
                                  className="relative w-full rounded-full bg-gradient-to-t from-indigo-500 to-sky-400"
                                  style={{ height: `${point.value}%` }}
                                >
                                  <span className="absolute inset-x-0 -top-6 mx-auto w-max rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-medium text-slate-50 shadow-sm">
                                    {point.value}%
                                  </span>
                                </div>
                              </div>
                              <span className="text-[11px] font-medium text-slate-500">
                                {point.day}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 grid gap-3 text-xs text-slate-600 sm:grid-cols-3">
                        <div className="rounded-xl bg-slate-50 px-3 py-2">
                          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                            Peak day
                          </p>
                          <p className="mt-1 text-sm font-semibold text-slate-900">
                            Wednesday · 95%
                          </p>
                        </div>
                        <div className="rounded-xl bg-slate-50 px-3 py-2">
                          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                            Lowest day
                          </p>
                          <p className="mt-1 text-sm font-semibold text-slate-900">
                            Tuesday · 88%
                          </p>
                        </div>
                        <div className="rounded-xl bg-slate-50 px-3 py-2">
                          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                            Morning compliance
                          </p>
                          <p className="mt-1 text-sm font-semibold text-slate-900">
                            89% before 9:15 AM
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-8 text-center text-xs text-slate-500">
                      <p className="text-sm font-medium text-slate-700">
                        No weekly attendance data yet
                      </p>
                      <p className="mt-1 max-w-sm">
                        Historical charts will appear here once students start scanning their RFID cards at
                        campus entry points.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Department snapshot */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Departments
                    </p>
                    <p className="text-sm font-semibold text-slate-900">
                      Snapshot by stream
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">
                    Today
                  </span>
                </div>

                <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-3 py-4 text-xs text-slate-500">
                  <p className="text-sm font-semibold text-slate-700">
                    No department-wise attendance data
                  </p>
                  <p className="mt-1">
                    Once RFID devices are active, this panel will break down attendance percentages for each
                    department and year.
                  </p>
                </div>
              </div>
            </section>

            {/* Recent activity table */}
            <section className="mt-6">
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 sm:px-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Live feed
                    </p>
                    <p className="text-sm font-semibold text-slate-900">
                      Recent RFID swipes
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <select className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option>Today</option>
                      <option>Last 7 days</option>
                      <option>Last 30 days</option>
                    </select>
                    <select className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option>All departments</option>
                      <option>Computer Science</option>
                      <option>Electronics</option>
                      <option>Mechanical</option>
                      <option>Civil</option>
                    </select>
                  </div>
                </div>

                {recentSwipes.length > 0 ? (
                  <>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-slate-200 text-sm">
                        <thead className="bg-slate-50">
                          <tr>
                            <th className="whitespace-nowrap px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Student
                            </th>
                            <th className="whitespace-nowrap px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Department / Year
                            </th>
                            <th className="hidden whitespace-nowrap px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 md:table-cell">
                              Roll No
                            </th>
                            <th className="whitespace-nowrap px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Time In
                            </th>
                            <th className="whitespace-nowrap px-4 py-2 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          {recentSwipes.map((record) => (
                            <tr key={record.id} className="hover:bg-slate-50/60">
                              <td className="whitespace-nowrap px-4 py-3">
                                <div className="flex items-center gap-3">
                                  <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-sky-400" />
                                  <div>
                                    <p className="text-sm font-medium text-slate-900">
                                      {record.name}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                      {record.department}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-600">
                                <p>{record.department}</p>
                                <p className="text-[11px] text-slate-500">{record.year}</p>
                              </td>
                              <td className="hidden whitespace-nowrap px-4 py-3 text-xs text-slate-600 md:table-cell">
                                {record.rollNo}
                              </td>
                              <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-700">
                                {record.timeIn}
                              </td>
                              <td className="whitespace-nowrap px-4 py-3 text-right">
                                <span
                                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                                    record.status === 'Present'
                                      ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100'
                                      : record.status === 'Late'
                                        ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-100'
                                        : 'bg-rose-50 text-rose-700 ring-1 ring-rose-100'
                                  }`}
                                >
                                  {record.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 text-xs text-slate-500 sm:flex-row sm:px-5">
                      <p>
                        Showing <span className="font-medium">{recentSwipes.length}</span> latest
                        records
                      </p>
                      <div className="flex items-center gap-2">
                        <button className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm">
                          View full log
                        </button>
                        <button className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                          Configure alerts
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center px-6 py-10 text-center text-xs text-slate-500">
                    <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-lg">
                      📡
                    </div>
                    <p className="text-sm font-semibold text-slate-700">
                      No RFID swipes received yet
                    </p>
                    <p className="mt-1 max-w-sm">
                      As soon as students start tapping their RFID cards at campus gates or classroom
                      readers, the latest activity will appear in this live feed.
                    </p>
                  </div>
                )}
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}

export default App
