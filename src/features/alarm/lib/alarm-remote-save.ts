import { APPS_SCRIPT_URL } from "@/config/env"
import type { Alarm } from "@/features/alarm/types"

export async function saveAlarmsToAppsScript(alarms: Alarm[]) {
  const res = await fetch(APPS_SCRIPT_URL, {
    method: "POST",
    // CORS 프리플라이트를 피하기 위해 simple request로 취급되는 text/plain으로 보낸다.
    // Apps Script 쪽에서 요청 본문 문자열을 JSON.parse로 직접 해석한다.
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify({ alarms }),
  })

  const data = await res.json()
  if (data.result !== "success") {
    throw new Error("저장에 실패했습니다")
  }
}
