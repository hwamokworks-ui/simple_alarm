import { useEffect, useState } from "react"

import { saveAlarmsToAppsScript } from "@/features/alarm/lib/alarm-remote-save"
import type { Alarm } from "@/features/alarm/types"

type SaveStatus = "idle" | "saving" | "success" | "error"

const SUCCESS_MESSAGE_DURATION_MS = 3000

export function useSaveAlarms() {
  const [status, setStatus] = useState<SaveStatus>("idle")

  useEffect(() => {
    if (status !== "success") return
    const id = window.setTimeout(() => setStatus("idle"), SUCCESS_MESSAGE_DURATION_MS)
    return () => clearTimeout(id)
  }, [status])

  async function saveNow(alarms: Alarm[]) {
    setStatus("saving")
    try {
      await saveAlarmsToAppsScript(alarms)
      setStatus("success")
    } catch {
      setStatus("error")
    }
  }

  return { status, saveNow }
}
