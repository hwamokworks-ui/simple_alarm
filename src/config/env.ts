// Supabase anon key와 함수 URL은 루트 CLAUDE.md의 "네이버 API 키 프론트엔드 금지" 규칙 대상이 아니다.
// 둘 다 Supabase 설계상 클라이언트에 공개되어도 되는 값이며(RLS/서버사이드 시크릿으로 실제 네이버 키를 보호),
// .env로 재정의하지 않아도 아래 기본값으로 기존과 동일하게 동작한다.
export const SUPABASE_NEWS_FUNCTION_URL =
  import.meta.env.VITE_SUPABASE_NEWS_FUNCTION_URL ||
  "https://xmekmgfwzbxuanqtthhz.supabase.co/functions/v1/naver-news"

export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtZWttZ2Z3emJ4dWFucXR0aGh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2NTYzNjEsImV4cCI6MjA5OTIzMjM2MX0.D7VgdC83IhUFRNYWQV9c7313ESLHAh20PenaFPxFZY0"
