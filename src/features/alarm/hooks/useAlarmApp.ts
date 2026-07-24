import { useEffect, useRef, useState } from "react"

import { useAlarms } from "@/features/alarm/hooks/useAlarms"
import { useAlarmClock } from "@/features/alarm/hooks/useAlarmClock"
import { useBeep } from "@/features/alarm/hooks/useBeep"
import type { Alarm } from "@/features/alarm/types"
import { fetchRecentNews } from "@/features/news/lib/news-api"
import { buildBriefingText } from "@/features/news/lib/news-format"
import { speakBriefing, stopBriefing } from "@/features/news/lib/tts"
import type { NewsItem } from "@/features/news/types"

export function useAlarmApp() {
  const { alarms, addAlarm, toggleAlarm, deleteAlarm, addSnooze, markTriggered } =
    useAlarms()
  const { startBeep, stopBeep, unlockAudioContext } = useBeep()
  const [ringingAlarm, setRingingAlarm] = useState<Alarm | null>(null)
  const [briefingItems, setBriefingItems] = useState<NewsItem[]>([])

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }
  }, [])

  const unlockAudioContextRef = useRef(unlockAudioContext)
  useEffect(() => {
    unlockAudioContextRef.current = unlockAudioContext
  })

  useEffect(() => {
    const unlock = () => {
      if (unlockAudioContextRef.current()) {
        speakBriefing(" ")
      }
    }
    document.addEventListener("click", unlock, { once: true })
    document.addEventListener("keydown", unlock, { once: true })
    document.addEventListener("touchstart", unlock, { once: true })
    return () => {
      document.removeEventListener("click", unlock)
      document.removeEventListener("keydown", unlock)
      document.removeEventListener("touchstart", unlock)
    }
  }, [])

  async function playNewsBriefing() {
    try {
      const data = await fetchRecentNews("속보", 3)
      const items = data.items ?? []
      setBriefingItems(items)
      speakBriefing(buildBriefingText(items))
    } catch {
      /* 뉴스 브리핑 실패는 알람 소리 재생에 영향을 주지 않는다 */
    }
  }

  function handleDue(alarm: Alarm, minuteKey: string) {
    // 동기 호출: 비프음이 다른 어떤 async 작업(뉴스 조회 등)도 거치지 않고 즉시 시작된다.
    startBeep()
    setRingingAlarm(alarm)

    if ("Notification" in window && Notification.permission === "granted") {
      try {
        new Notification("알람", {
          body: alarm.label || `${alarm.time} 알람이 울리고 있습니다.`,
        })
      } catch {
        /* ignore */
      }
    }

    markTriggered(alarm.id, minuteKey)
    void playNewsBriefing()
  }

  const { now, clearRinging } = useAlarmClock(alarms, handleDue)

  function stopRinging() {
    stopBeep()
    stopBriefing()
    setRingingAlarm(null)
    setBriefingItems([])
    clearRinging()
  }

  function snooze() {
    stopBeep()
    stopBriefing()
    addSnooze(
      ringingAlarm
        ? ringingAlarm.label
          ? `${ringingAlarm.label} (스누즈)`
          : "스누즈"
        : "스누즈",
    )
    setRingingAlarm(null)
    setBriefingItems([])
    clearRinging()
  }

  return {
    now,
    alarms,
    addAlarm,
    toggleAlarm,
    deleteAlarm,
    ringingAlarm,
    briefingItems,
    stopRinging,
    snooze,
  }
}
