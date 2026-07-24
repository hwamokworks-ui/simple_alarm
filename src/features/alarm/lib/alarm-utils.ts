import type { Alarm } from "@/features/alarm/types"

export const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"]

export function pad(n: number) {
  return String(n).padStart(2, "0")
}

export function uid() {
  return "a" + Math.random().toString(36).slice(2, 10)
}

export function sortAlarms(alarms: Alarm[]) {
  return [...alarms].sort((a, b) => a.time.localeCompare(b.time))
}

export function formatMeta(alarm: Alarm) {
  if (alarm.days.length === 0) {
    return alarm.label ? `${alarm.label} · 한 번만` : "한 번만"
  }
  const days = alarm.days.map((d) => DAY_LABELS[d]).join(" ")
  return alarm.label ? `${alarm.label} · ${days}` : days
}
