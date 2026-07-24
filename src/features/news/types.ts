export interface NewsItem {
  title: string
  description: string
  link: string
  pubDate: string
}

export interface NewsResponse {
  items?: NewsItem[]
  error?: string
}
