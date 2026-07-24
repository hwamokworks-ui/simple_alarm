import { useState } from "react"

import { fetchRecentNews } from "@/features/news/lib/news-api"
import type { NewsItem } from "@/features/news/types"

export function useNews() {
  const [items, setItems] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(false)

  async function loadNews() {
    setLoading(true)
    try {
      const data = await fetchRecentNews("속보")
      setItems(data.items ?? [])
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  return { items, loading, loadNews }
}
