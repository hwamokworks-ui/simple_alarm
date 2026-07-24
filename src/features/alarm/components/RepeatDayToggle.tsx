import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { DAY_LABELS } from "@/features/alarm/lib/alarm-utils"

export function RepeatDayToggle({
  value,
  onChange,
}: {
  value: number[]
  onChange: (days: number[]) => void
}) {
  return (
    <ToggleGroup
      type="multiple"
      value={value.map(String)}
      onValueChange={(v) => onChange(v.map(Number).sort((a, b) => a - b))}
      className="w-full"
    >
      {DAY_LABELS.map((label, i) => (
        <ToggleGroupItem
          key={i}
          value={String(i)}
          className="flex-1 hover:bg-ring hover:text-primary-foreground data-[state=on]:bg-ring data-[state=on]:text-primary-foreground"
        >
          {label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
