import { useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RepeatDayToggle } from "@/features/alarm/components/RepeatDayToggle"
import { TimePicker } from "@/features/alarm/components/TimePicker"

export function AlarmForm({
  onAdd,
}: {
  onAdd: (time: string, label: string, days: number[]) => void
}) {
  const [time, setTime] = useState("")
  const [label, setLabel] = useState("")
  const [days, setDays] = useState<number[]>([])
  const timeTriggerRef = useRef<HTMLButtonElement>(null)

  function handleAdd() {
    if (!time) {
      timeTriggerRef.current?.focus()
      return
    }
    onAdd(time, label.trim(), days)
    setTime("")
    setLabel("")
    setDays([])
  }

  return (
    <div className="flex flex-col gap-3">
      <TimePicker ref={timeTriggerRef} value={time} onChange={setTime} />
      <Input
        type="text"
        placeholder="라벨 (선택)"
        maxLength={20}
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        className="h-12 bg-background text-base dark:bg-background"
      />
      <RepeatDayToggle value={days} onChange={setDays} />
      <Button onClick={handleAdd} className="h-12 w-full text-base hover:bg-ring">
        알람 추가
      </Button>
    </div>
  )
}
