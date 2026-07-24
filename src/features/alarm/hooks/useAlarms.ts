import { useEffect, useState } from "react"

import type { Alarm } from "@/features/alarm/types"
import { sortAlarms, uid } from "@/features/alarm/lib/alarm-utils"

const STORAGE_KEY = "simple-alarm.alarms"

function loadAlarms(): Alarm[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function useAlarms() {
  const [alarms, setAlarms] = useState<Alarm[]>(loadAlarms)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(alarms))
  }, [alarms])

  function addAlarm(time: string, label: string, days: number[]) {
    const alarm: Alarm = {
      id: uid(),
      time,
      label,
      days: [...days].sort(),
      enabled: true,
      lastTriggeredKey: null,
    }
    setAlarms((prev) => sortAlarms([...prev, alarm]))
  }

  function toggleAlarm(id: string, enabled: boolean) {
    setAlarms((prev) => prev.map((a) => (a.id === id ? { ...a, enabled } : a)))
  }

  function deleteAlarm(id: string) {
    setAlarms((prev) => prev.filter((a) => a.id !== id))
  }

  function addSnooze(label: string) {
    const snoozeTime = new Date(Date.now() + 5 * 60 * 1000)
    const pad = (n: number) => String(n).padStart(2, "0")
    const snoozed: Alarm = {
      id: uid(),
      time: `${pad(snoozeTime.getHours())}:${pad(snoozeTime.getMinutes())}`,
      label,
      days: [],
      enabled: true,
      lastTriggeredKey: null,
    }
    setAlarms((prev) => sortAlarms([...prev, snoozed]))
  }

  function markTriggered(id: string, minuteKey: string) {
    setAlarms((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              lastTriggeredKey: minuteKey,
              enabled: a.days.length === 0 ? false : a.enabled,
            }
          : a,
      ),
    )
  }

  return { alarms, addAlarm, toggleAlarm, deleteAlarm, addSnooze, markTriggered }
}
