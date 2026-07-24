import { forwardRef } from "react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"))
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"))

// shadcn SelectTrigger의 기본 높이는 `data-[size=default]:h-8`로 고정돼 있어 평범한
// `h-full`로는 덮어써지지 않는다(같은 data- 조건을 명시해야 우선순위가 이긴다). 그 결과
// 32px짜리 트리거가 48px 컨테이너 안에서 위쪽으로 붙어버려 중앙 정렬이 깨졌던 것을 수정.
// 호버 색상은 라벨 인풋 테두리의 포커스 색상(--ring)과 동일하게 맞춘다.
const triggerClass =
  "h-full data-[size=default]:h-full flex-1 items-center justify-center gap-0 rounded-none border-none bg-transparent px-2 text-2xl font-bold tabular-nums shadow-none hover:bg-ring focus-visible:ring-0 [&>svg]:hidden dark:bg-transparent dark:hover:bg-ring"

// 6개 항목 높이(44px * 6)만 보이고 나머지는 스크롤되도록 고정. 스크롤 위/아래 버튼은
// Radix가 항목 자리를 나눠 쓰기 때문에 숨기고, 휠/터치/키보드 스크롤에 맡긴다.
// 배경은 '등록된 알람' 카드와 동일한 투명도(90%) + 블러로 맞춘다.
const contentClass =
  "min-w-16 max-h-[264px]! bg-card/90 backdrop-blur-md [&_[data-slot=select-scroll-up-button]]:hidden [&_[data-slot=select-scroll-down-button]]:hidden"

// 목록 항목 호버 색상도 동일한 --ring 색으로 맞추고, 항목 높이도 좀 더 넉넉하게.
const itemClass =
  "justify-center py-2.5 pr-1.5 pl-1.5 text-base focus:bg-ring focus:text-primary-foreground"

export const TimePicker = forwardRef<
  HTMLButtonElement,
  { value: string; onChange: (time: string) => void }
>(function TimePicker({ value, onChange }, ref) {
  const [hh, mm] = value.split(":")

  return (
    <div className="flex h-12 justify-center overflow-hidden rounded-lg border border-input bg-background dark:bg-background">
      <Select value={hh} onValueChange={(h) => onChange(`${h}:${mm || "00"}`)}>
        <SelectTrigger ref={ref} className={triggerClass}>
          <SelectValue placeholder="--" />
        </SelectTrigger>
        <SelectContent position="popper" sideOffset={4} className={contentClass}>
          {HOURS.map((h) => (
            <SelectItem key={h} value={h} className={itemClass}>
              {h}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className="flex items-center text-2xl font-bold text-muted-foreground">
        :
      </span>
      <Select value={mm} onValueChange={(m) => onChange(`${hh || "00"}:${m}`)}>
        <SelectTrigger className={triggerClass}>
          <SelectValue placeholder="--" />
        </SelectTrigger>
        <SelectContent position="popper" sideOffset={4} className={contentClass}>
          {MINUTES.map((m) => (
            <SelectItem key={m} value={m} className={itemClass}>
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
})
