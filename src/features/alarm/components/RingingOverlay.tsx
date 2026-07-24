import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { NewsBriefing } from "@/features/news/components/NewsBriefing"
import type { NewsItem } from "@/features/news/types"
import type { Alarm } from "@/features/alarm/types"

export function RingingOverlay({
  alarm,
  briefingItems,
  onStop,
  onSnooze,
}: {
  alarm: Alarm | null
  briefingItems: NewsItem[]
  onStop: () => void
  onSnooze: () => void
}) {
  return (
    <AlertDialog open={!!alarm}>
      <AlertDialogContent
        onEscapeKeyDown={(e: KeyboardEvent) => e.preventDefault()}
        className="max-w-xs sm:max-w-sm"
      >
        <AlertDialogHeader>
          <div className="text-4xl">🔔</div>
          <AlertDialogTitle className="text-3xl tabular-nums">
            {alarm?.time}
          </AlertDialogTitle>
          <AlertDialogDescription className="min-h-[1.2em]">
            {alarm?.label}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <NewsBriefing items={briefingItems} />

        <AlertDialogFooter className="flex-col sm:flex-col">
          <AlertDialogAction variant="secondary" onClick={onSnooze}>
            5분 후 다시 알림
          </AlertDialogAction>
          <AlertDialogAction variant="destructive" onClick={onStop}>
            끄기
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
