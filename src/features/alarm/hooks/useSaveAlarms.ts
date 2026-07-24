import { useState } from "react"

import { saveAlarmsToAppsScript } from "@/features/alarm/lib/alarm-remote-save"
import { pad } from "@/features/alarm/lib/alarm-utils"
import type { Alarm } from "@/features/alarm/types"

type SaveStatus = "idle" | "saving" | "success" | "error"

export function useSaveAlarms() {
  const [status, setStatus] = useState<SaveStatus>("idle")
  const [savedAt, setSavedAt] = useState<string | null>(null)

  async function saveNow(alarms: Alarm[]) {
    setStatus("saving")
    try {
      await saveAlarmsToAppsScript(alarms)
      const now = new Date()
      setSavedAt(`${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`)
      setStatus("success")
    } catch {
      setStatus("error")
    }
  }

  return { status, savedAt, saveNow }
}
