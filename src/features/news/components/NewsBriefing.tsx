import { stripHtmlTags } from "@/features/news/lib/news-format"
import type { NewsItem } from "@/features/news/types"

export function NewsBriefing({ items }: { items: NewsItem[] }) {
  if (items.length === 0) return null

  return (
    <div className="flex flex-col gap-2 text-left">
      {items.map((item, i) => (
        <article key={i} className="rounded-lg border bg-background px-3.5 py-2.5">
          <h3 className="text-sm font-bold leading-snug">
            {i + 1}. {stripHtmlTags(item.title)}
          </h3>
        </article>
      ))}
    </div>
  )
}
