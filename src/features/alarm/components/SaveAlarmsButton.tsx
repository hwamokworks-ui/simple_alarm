import { Button } from "@/components/ui/button"
import { useSaveAlarms } from "@/features/alarm/hooks/useSaveAlarms"
import type { Alarm } from "@/features/alarm/types"

export function SaveAlarmsButton({ alarms }: { alarms: Alarm[] }) {
  const { status, savedAt, saveNow } = useSaveAlarms()

  const statusText =
    status === "saving"
      ? "저장 중..."
      : status === "success"
        ? `저장되었습니다 (${savedAt})`
        : status === "error"
          ? "저장에 실패했습니다"
          : null

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="secondary"
        className="h-12 w-full text-base"
        disabled={status === "saving"}
        onClick={() => saveNow(alarms)}
      >
        등록된 알림 저장
      </Button>
      {statusText && (
        <p className="text-center text-sm text-muted-foreground">{statusText}</p>
      )}
    </div>
  )
}
