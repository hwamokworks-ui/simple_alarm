import { useEffect, useRef, useState } from "react"

import type { Alarm } from "@/features/alarm/types"
import { pad } from "@/features/alarm/lib/alarm-utils"

type OnDue = (alarm: Alarm, minuteKey: string) => void

/**
 * setInterval은 마운트 시 한 번만 생성되고(빈 deps) 절대 재생성되지 않는다.
 * alarms/onDue는 ref로만 참조해 인터벌이 알람 추가/삭제 때마다 재생성되지 않게 한다.
 * onDue는 인터벌 콜백 안에서 동기적으로 호출되므로, 그 첫 줄에서 startBeep()을
 * 호출하면 React 렌더/커밋 스케줄링과 무관하게 즉시 비프음이 시작된다(실패 허용 원칙).
 */
export function useAlarmClock(alarms: Alarm[], onDue: OnDue) {
  const [now, setNow] = useState(() => new Date())
  const alarmsRef = useRef(alarms)
  const onDueRef = useRef(onDue)
  const lastCheckedRef = useRef<string | null>(null)
  const ringingRef = useRef(false)

  useEffect(() => {
    alarmsRef.current = alarms
  }, [alarms])

  useEffect(() => {
    onDueRef.current = onDue
  }, [onDue])

  useEffect(() => {
    const id = window.setInterval(() => {
      const current = new Date()
      setNow(current)

      const hh = pad(current.getHours())
      const mm = pad(current.getMinutes())
      const currentTime = `${hh}:${mm}`
      const minuteKey = `${current.getFullYear()}-${current.getMonth()}-${current.getDate()}-${hh}-${mm}`

      if (minuteKey === lastCheckedRef.current) return
      lastCheckedRef.current = minuteKey

      if (ringingRef.current) return

      const hit = alarmsRef.current.find(
        (a) =>
          a.enabled &&
          a.time === currentTime &&
          (a.days.length === 0 || a.days.includes(current.getDay())) &&
          a.lastTriggeredKey !== minuteKey,
      )

      if (hit) {
        ringingRef.current = true
        onDueRef.current(hit, minuteKey)
      }
    }, 1000)

    return () => clearInterval(id)
  }, [])

  function clearRinging() {
    ringingRef.current = false
  }

  return { now, clearRinging }
}
