const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export type AnalyticsSummary = {
  total_students: number
  present_today: number
  absent_today: number
  attendance_today_percent: number
}

export type WeeklyPoint = {
  day: string
  value: number
}

export type DepartmentStat = {
  name: string
  value: number
}

export type AnalyticsPayload = {
  summary: AnalyticsSummary
  weekly_trend: WeeklyPoint[]
  departments: DepartmentStat[]
}

export type RecentSwipeItem = {
  id: string
  name: string
  student_id: string
  department: string
  year: string
  time_in: string
  location_type: string
}

export async function fetchAnalytics(): Promise<AnalyticsPayload> {
  const res = await fetch(`${API_BASE}/analytics/summary`)
  if (!res.ok) throw new Error(`Analytics failed: ${res.status}`)
  return res.json()
}

export async function fetchRecentSwipes(): Promise<RecentSwipeItem[]> {
  const res = await fetch(`${API_BASE}/analytics/recent-swipes?limit=20`)
  if (!res.ok) throw new Error(`Recent swipes failed: ${res.status}`)
  return res.json()
}
