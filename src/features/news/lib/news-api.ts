import { SUPABASE_ANON_KEY, SUPABASE_NEWS_FUNCTION_URL } from "@/config/env"
import type { NewsResponse } from "@/features/news/types"

const NEWS_FETCH_TIMEOUT_MS = 8000

export async function fetchRecentNews(
  keyword: string,
  count = 5,
): Promise<NewsResponse> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), NEWS_FETCH_TIMEOUT_MS)

  try {
    const res = await fetch(SUPABASE_NEWS_FUNCTION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        apikey: SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ keyword }),
      signal: controller.signal,
    })
    const data: NewsResponse = await res.json()
    if (Array.isArray(data.items)) {
      data.items = data.items.slice(0, count)
    }
    return data
  } finally {
    clearTimeout(timeoutId)
  }
}
