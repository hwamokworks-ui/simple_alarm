import { useWeather } from "@/features/weather/hooks/useWeather"

export function WeatherFooter() {
  const { weather, failed } = useWeather()

  return (
    <footer className="fixed inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-black/55 px-4 py-3 text-lg font-bold text-white backdrop-blur-sm">
      {weather?.iconUrl && (
        <img
          src={weather.iconUrl}
          alt={weather.iconAlt}
          className="size-11 drop-shadow-md"
        />
      )}
      <span>
        {failed
          ? "기온 정보를 불러올 수 없습니다."
          : (weather?.tempLabel ?? "기온 불러오는 중...")}
      </span>
    </footer>
  )
}
