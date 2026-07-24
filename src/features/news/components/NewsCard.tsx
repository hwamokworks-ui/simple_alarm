import {
  buildPubDateLabel,
  stripHtmlTags,
} from "@/features/news/lib/news-format"
import type { NewsItem } from "@/features/news/types"

export function NewsCard({ item }: { item: NewsItem }) {
  return (
    <article className="rounded-xl border bg-background p-4">
      <h3 className="mb-1.5 text-[1.02rem] leading-snug font-bold">
        {stripHtmlTags(item.title)}
      </h3>
      <p className="mb-2.5 text-[0.88rem] leading-relaxed text-muted-foreground">
        {stripHtmlTags(item.description)}
      </p>
      <div className="flex items-center justify-between gap-2.5 text-[0.78rem] text-muted-foreground">
        <span className="tabular-nums">{buildPubDateLabel(item.pubDate)}</span>
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold whitespace-nowrap text-primary hover:underline"
        >
          원문보기
        </a>
      </div>
    </article>
  )
}
