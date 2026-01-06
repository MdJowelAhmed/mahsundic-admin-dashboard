import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { CalendarDay, CalendarPeriod, CalendarViewRange } from '@/types'

interface CalendarState {
  viewRange: CalendarViewRange
  period: CalendarPeriod
  startDate: string // ISO string for the first day in the range
  days: CalendarDay[]
}

const toISODate = (date: Date) => date.toISOString().split('T')[0]

const generateDays = (start: Date, totalDays: number): CalendarDay[] => {
  const days: CalendarDay[] = []
  const current = new Date(start)

  for (let i = 0; i < totalDays; i++) {
    const date = new Date(current)
    const label = date.toLocaleDateString(undefined, { weekday: 'short' })
    const dayNumber = date.getDate()

    days.push({
      date: toISODate(date),
      label,
      dayNumber,
    })

    current.setDate(current.getDate() + 1)
  }

  return days
}

const buildInitialState = (): CalendarState => {
  const today = new Date()
  const startDate = toISODate(today)

  return {
    viewRange: 10,
    period: 'current',
    startDate,
    days: generateDays(today, 10),
  }
}

const recalculateDays = (state: CalendarState) => {
  const today = new Date()
  const baseDate = new Date(today)

  if (state.period === 'previous') {
    // Previous 30 days from today
    baseDate.setDate(baseDate.getDate() - 30)
  }

  state.startDate = toISODate(baseDate)
  state.days = generateDays(baseDate, state.viewRange)
}

const initialState: CalendarState = buildInitialState()

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setViewRange: (state, action: PayloadAction<CalendarViewRange>) => {
      state.viewRange = action.payload
      // If user switches to anything other than 30 days, reset to current period
      if (action.payload !== 30 && state.period === 'previous') {
        state.period = 'current'
      }
      recalculateDays(state)
    },
    setPeriod: (state, action: PayloadAction<CalendarPeriod>) => {
      state.period = action.payload
      // Period only matters for 30 day view, force to 30
      if (action.payload === 'previous') {
        state.viewRange = 30
      }
      recalculateDays(state)
    },
    goToToday: (state) => {
      state.period = 'current'
      recalculateDays(state)
    },
  },
})

export const { setViewRange, setPeriod, goToToday } = calendarSlice.actions

export default calendarSlice.reducer


