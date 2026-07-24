import type { WeatherInfo } from "@/features/weather/types"

const WEATHER_LAT = 37.5665
const WEATHER_LON = 126.978
const WEATHER_LOCATION_NAME = "서울"
// OpenWeatherMap 키는 클라이언트에서 직접 쓰도록 설계된 공개형 API 키로, 루트 CLAUDE.md의
// 네이버 API 키(Client ID/Secret) 프론트엔드 금지 규칙 대상이 아니다. 기존 script.js와 동일하게 유지.
const WEATHER_API_KEY = "ba218008287000c04ccb04830d695f48"
const WEATHER_FETCH_TIMEOUT_MS = 8000

function describeWeather(id: number) {
  if (id >= 200 && id < 300) return "천둥번개"
  if (id >= 300 && id < 400) return "이슬비"
  if (id >= 500 && id < 600) return "비"
  if (id >= 600 && id < 700) return "눈"
  if (id >= 700 && id < 800) return "안개"
  if (id === 800) return "맑음"
  if (id === 801) return "구름 조금"
  if (id === 802 || id === 803) return "구름 많음"
  if (id === 804) return "흐림"
  return ""
}

export async function fetchWeather(): Promise<WeatherInfo> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), WEATHER_FETCH_TIMEOUT_MS)

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${WEATHER_LAT}&lon=${WEATHER_LON}&appid=${WEATHER_API_KEY}&units=metric`
    const res = await fetch(url, { signal: controller.signal })
    if (!res.ok) throw new Error("weather request failed")
    const data = await res.json()

    const weather = data.weather?.[0]
    const desc = weather ? describeWeather(weather.id) : ""

    return {
      tempLabel: `${WEATHER_LOCATION_NAME} ${Math.round(data.main.temp)}°C${desc ? ` · ${desc}` : ""}`,
      iconUrl: weather?.icon
        ? `https://openweathermap.org/img/wn/${weather.icon}@2x.png`
        : null,
      iconAlt: desc,
    }
  } finally {
    clearTimeout(timeoutId)
  }
}
