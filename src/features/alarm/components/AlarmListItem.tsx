import { Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { formatMeta } from "@/features/alarm/lib/alarm-utils"
import type { Alarm } from "@/features/alarm/types"

export function AlarmListItem({
  alarm,
  onToggle,
  onDelete,
}: {
  alarm: Alarm
  onToggle: (id: string, enabled: boolean) => void
  onDelete: (id: string) => void
}) {
  return (
    <li
      className={`flex items-center justify-between gap-3 rounded-xl border bg-background px-4 py-3.5 ${alarm.enabled ? "" : "opacity-75"}`}
    >
      <div className="flex min-w-0 flex-col gap-1">
        <div className="text-2xl font-bold tabular-nums">{alarm.time}</div>
        <div className="overflow-hidden text-ellipsis whitespace-nowrap text-sm text-muted-foreground">
          {formatMeta(alarm)}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2.5">
        <Switch
          checked={alarm.enabled}
          onCheckedChange={(checked) => onToggle(alarm.id, checked)}
        />
        <Button
          variant="ghost"
          size="icon"
          aria-label="알람 삭제"
          onClick={() => onDelete(alarm.id)}
        >
          <Trash2 />
        </Button>
      </div>
    </li>
  )
}
