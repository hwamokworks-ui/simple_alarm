import { useEffect, useState } from "react"

import { fetchWeather } from "@/features/weather/lib/weather-api"
import type { WeatherInfo } from "@/features/weather/types"

const REFRESH_INTERVAL_MS = 10 * 60 * 1000

export function useWeather() {
  const [weather, setWeather] = useState<WeatherInfo | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const data = await fetchWeather()
        if (!cancelled) {
          setWeather(data)
          setFailed(false)
        }
      } catch {
        if (!cancelled) setFailed(true)
      }
    }

    load()
    const id = window.setInterval(load, REFRESH_INTERVAL_MS)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [])

  return { weather, failed }
}
