export interface Alarm {
  id: string
  time: string
  label: string
  days: number[]
  enabled: boolean
  lastTriggeredKey: string | null
}
