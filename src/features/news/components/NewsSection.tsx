import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { NewsCard } from "@/features/news/components/NewsCard"
import { useNews } from "@/features/news/hooks/useNews"

export function NewsSection() {
  const { items, loading, loadNews } = useNews()

  return (
    <Card className="bg-card/90 backdrop-blur-md">
      <CardHeader>
        <h2 className="text-sm text-muted-foreground">최신 뉴스</h2>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Button className="h-12 w-full text-base" onClick={loadNews}>
          뉴스 불러오기
        </Button>
        {loading && (
          <p className="py-5 text-center text-muted-foreground">불러오는 중...</p>
        )}
        {!loading && items.map((item, i) => <NewsCard key={i} item={item} />)}
      </CardContent>
    </Card>
  )
}
