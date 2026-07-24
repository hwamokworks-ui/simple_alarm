import { ModeToggle } from "@/components/mode-toggle"
import { AlarmForm } from "@/features/alarm/components/AlarmForm"
import { AlarmList } from "@/features/alarm/components/AlarmList"
import { RingingOverlay } from "@/features/alarm/components/RingingOverlay"
import { useAlarmApp } from "@/features/alarm/hooks/useAlarmApp"
import { pad } from "@/features/alarm/lib/alarm-utils"
import { NewsSection } from "@/features/news/components/NewsSection"
import { WeatherFooter } from "@/features/weather/components/WeatherFooter"

function App() {
  const {
    now,
    alarms,
    addAlarm,
    toggleAlarm,
    deleteAlarm,
    ringingAlarm,
    briefingItems,
    stopRinging,
    snooze,
  } = useAlarmApp()

  const clockLabel = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`

  return (
    <div
      className="flex min-h-screen justify-center bg-background bg-cover bg-fixed bg-center px-4 pt-6 pb-20"
      style={{ backgroundImage: "url(/images/luca-bravo-ESkw2ayO2As-unsplash.jpg)" }}
    >
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col gap-4 rounded-2xl border bg-card/90 p-4.5 backdrop-blur-md">
          <header className="relative text-center">
            <div className="absolute top-0 right-0">
              <ModeToggle />
            </div>
            <div className="mb-2 flex items-center justify-center gap-2">
              <svg
                className="shrink-0"
                viewBox="0 0 24 24"
                width="26"
                height="26"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="13" r="8" />
                <path d="M12 9v4l3 2" />
                <path d="M5 3 2 6" />
                <path d="M19 3l3 3" />
              </svg>
              <h1 className="text-2xl font-bold">간편 알람</h1>
            </div>
            <div className="text-6xl font-bold tabular-nums tracking-wide">
              {clockLabel}
            </div>
          </header>

          <AlarmForm onAdd={addAlarm} />
        </div>

        <div className="mb-7">
          <AlarmList alarms={alarms} onToggle={toggleAlarm} onDelete={deleteAlarm} />
        </div>

        <NewsSection />
      </div>

      <RingingOverlay
        alarm={ringingAlarm}
        briefingItems={briefingItems}
        onStop={stopRinging}
        onSnooze={snooze}
      />

      <WeatherFooter />
    </div>
  )
}

export default App
