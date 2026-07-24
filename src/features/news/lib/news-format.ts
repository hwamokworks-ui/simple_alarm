import type { NewsItem } from "@/features/news/types"

const BRIEFING_ORDINALS = [
  "첫번째",
  "두번째",
  "세번째",
  "네번째",
  "다섯번째",
  "여섯번째",
  "일곱번째",
  "여덟번째",
  "아홉번째",
  "열번째",
]

export function stripHtmlTags(str: string) {
  return str.replace(/<[^>]*>/g, "")
}

export function buildPubDateLabel(pubDate: string) {
  const date = new Date(pubDate)
  if (Number.isNaN(date.getTime())) return pubDate
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function buildBriefingText(items: NewsItem[]) {
  return items
    .map((item, i) => {
      const ordinal = BRIEFING_ORDINALS[i] || `${i + 1}번째`
      return `${ordinal} 뉴스, ${stripHtmlTags(item.title)}.`
    })
    .join(" ")
}
