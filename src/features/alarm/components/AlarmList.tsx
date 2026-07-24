import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { AlarmListItem } from "@/features/alarm/components/AlarmListItem"
import { SaveAlarmsButton } from "@/features/alarm/components/SaveAlarmsButton"
import type { Alarm } from "@/features/alarm/types"

export function AlarmList({
  alarms,
  onToggle,
  onDelete,
}: {
  alarms: Alarm[]
  onToggle: (id: string, enabled: boolean) => void
  onDelete: (id: string) => void
}) {
  return (
    <Card className="bg-card/90 backdrop-blur-md">
      <CardHeader>
        <h2 className="text-sm text-muted-foreground">등록된 알람</h2>
      </CardHeader>
      <CardContent className="flex flex-col gap-2.5">
        {alarms.length === 0 ? (
          <p className="py-7 text-center text-muted-foreground">
            등록된 알람이 없습니다.
          </p>
        ) : (
          <ul className="flex flex-col gap-2.5">
            {alarms.map((alarm) => (
              <AlarmListItem
                key={alarm.id}
                alarm={alarm}
                onToggle={onToggle}
                onDelete={onDelete}
              />
            ))}
          </ul>
        )}
        <SaveAlarmsButton alarms={alarms} />
      </CardContent>
    </Card>
  )
}
