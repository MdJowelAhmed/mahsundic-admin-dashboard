import React from 'react'
import { Search, Plus } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { setPeriod, setViewRange } from '@/redux/slices/calendarSlice'
import type { CalendarDay, CalendarPeriod, CalendarViewRange } from '@/types'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export interface CalendarBooking {
  id: string
  dayIndex: number
  time: string
  car: string
  plate: string
  client: string
}

// Generate 24 hours time slots (every 1 hour)
const generateTimeSlots = (): string[] => {
  const slots: string[] = []
  const hours = 24

  for (let hour = 0; hour < hours; hour++) {
    const date = new Date()
    date.setHours(hour, 0, 0, 0)
    const timeString = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
    slots.push(timeString)
  }

  return slots
}

const timeSlots: string[] = generateTimeSlots()

// Helper function to slice client name if more than 10 characters
const truncateName = (name: string, maxLength: number = 10): string => {
  if (name.length <= maxLength) return name
  return name.slice(0, maxLength) + '...'
}

interface CalendarViewProps {
  bookings: CalendarBooking[]
  searchValue: string
  onSearchChange: (value: string) => void
}

const viewOptions: { label: string; range: CalendarViewRange; period?: CalendarPeriod }[] = [
  { label: '10 days', range: 10 },
  { label: '15 days', range: 15 },
  { label: '30 days', range: 30 },
  { label: 'Prev 30 days', range: 30, period: 'previous' },
]

const CalendarView: React.FC<CalendarViewProps> = ({ bookings, searchValue, onSearchChange }) => {
  const dispatch = useAppDispatch()
  const { days, viewRange, period } = useAppSelector((state) => state.calendar)

  const getBookingForCell = (dayIndex: number, time: string) => {
    let filtered = bookings.filter(
      (booking) => booking.dayIndex === dayIndex && booking.time === time
    )

    // Apply search filter
    if (searchValue.trim()) {
      const searchLower = searchValue.toLowerCase()
      filtered = filtered.filter(
        (booking) =>
          booking.client.toLowerCase().includes(searchLower) ||
          booking.car.toLowerCase().includes(searchLower) ||
          booking.id.toLowerCase().includes(searchLower) ||
          booking.plate.toLowerCase().includes(searchLower)
      )
    }

    return filtered
  }

  const handleViewChange = (option: (typeof viewOptions)[number]) => {
    if (option.period === 'previous') {
      dispatch(setPeriod('previous'))
    } else {
      dispatch(setViewRange(option.range))
    }
  }

  const isActiveOption = (option: (typeof viewOptions)[number]) => {
    if (option.period === 'previous') {
      return period === 'previous'
    }
    return period === 'current' && viewRange === option.range
  }

  return (
    <div className="space-y-4">
      {/* Top Controls */}
      <div className="flex items-center justify-between gap-4">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Search client name & car etc."
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-10 w-full rounded-full border border-[#E5E7EB] bg-white pl-9 pr-3 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:border-[#21A366] focus:outline-none focus:ring-1 focus:ring-[#21A366]"
            />
          </div>
        </div>

        {/* View options: 10 / 15 / 30 / previous 30 days */}
        <div className="inline-flex rounded-full bg-[#F3F4F6] p-1">
          {viewOptions.map((option) => (
            <button
              key={option.label}
              type="button"
              onClick={() => handleViewChange(option)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${
                isActiveOption(option)
                  ? 'bg-[#F6BB06] text-white shadow-sm'
                  : 'text-[#6B7280] hover:text-[#111827]'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">
        <div className="overflow-x-auto">
          {/* Header Row */}
          <div
            className="grid border-b border-[#E5E7EB] bg-[#F9FAFB] text-xs font-semibold text-[#6B7280] w-max"
            style={{
              gridTemplateColumns: `100px repeat(${days.length}, minmax(140px, 1fr))`,
            }}
          >
            <div className="flex items-center justify-center border-r border-[#E5E7EB] py-3 sticky left-0 z-10 bg-[#F9FAFB]">
              GMT+0
            </div>
            {days.map((day: CalendarDay) => (
              <div
                key={day.date}
                className="flex flex-col items-center justify-center border-r border-[#E5E7EB] py-3"
              >
                <span className="uppercase tracking-wide text-[11px] text-[#9CA3AF]">
                  {day.label}
                </span>
                <span className="mt-1 text-base font-semibold text-[#111827]">
                  {day.dayNumber.toString().padStart(2, '0')}
                </span>
              </div>
            ))}
          </div>

          {/* Time Rows */}
          <div>
            {timeSlots.map((time) => (
              <div
                key={time}
                className="grid border-b border-[#E5E7EB] last:border-b-0 w-max"
                style={{
                  gridTemplateColumns: `100px repeat(${days.length}, minmax(140px, 1fr))`,
                }}
              >
                {/* Time column */}
                <div className="flex items-start justify-center border-r border-[#E5E7EB] bg-[#F9FAFB] px-2 py-4 text-xs font-medium text-[#6B7280] sticky left-0 z-10">
                  {time}
                </div>

                {/* Day columns */}
                {days.map((day: CalendarDay, dayIndex: number) => {
                  const cellBookings = getBookingForCell(dayIndex, time)
                  const bookingCount = cellBookings.length
                  const hasMoreBookings = bookingCount > 1
                  const remainingCount = bookingCount - 1

                  return (
                    <div
                      key={day.date + time}
                      className="relative border-r border-[#E5E7EB] p-1"
                    >
                      {/* Show only first booking */}
                      {bookingCount > 0 && (
                        <div className="flex flex-col gap-1 rounded-md bg-[#E0F2FE] px-2 py-2 text-[11px] text-[#1F2937] shadow-sm">
                          <div className="flex items-center justify-between text-[10px] text-[#2563EB]">
                            <span>{cellBookings[0].time}</span>
                            <span className="font-semibold">{cellBookings[0].id}</span>
                          </div>
                          <div className="text-[11px] font-semibold text-[#111827]">
                            {cellBookings[0].car}
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-[#4B5563]">
                            <span title={cellBookings[0].client}>
                              {truncateName(cellBookings[0].client, 10)}
                            </span>
                            <span>{cellBookings[0].plate}</span>
                          </div>
                        </div>
                      )}

                      {/* +X badge in corner for multiple bookings */}
                      {hasMoreBookings && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="absolute top-2 right-2 flex items-center justify-center w-5 h-5 rounded-full bg-[#2563EB] text-white text-[9px] font-bold shadow-md cursor-pointer hover:bg-[#1d4ed8] transition-colors z-20">
                              <Plus className="h-2.5 w-2.5" />
                              <span>{remainingCount}</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent
                            side="right"
                            className="max-w-xs p-3 bg-white border border-[#E5E7EB] shadow-lg z-50"
                          >
                            <div className="space-y-2">
                              <div className="text-xs font-semibold text-[#111827] mb-2">
                                {remainingCount} More Booking{remainingCount > 1 ? 's' : ''}
                              </div>
                              {cellBookings.slice(1).map((booking) => (
                                <div
                                  key={booking.id}
                                  className="flex flex-col gap-1 rounded-md bg-[#F0F9FF] px-2 py-2 text-[11px] border border-[#E0F2FE]"
                                >
                                  <div className="flex items-center justify-between text-[10px] text-[#2563EB]">
                                    <span>{booking.time}</span>
                                    <span className="font-semibold">{booking.id}</span>
                                  </div>
                                  <div className="text-[11px] font-semibold text-[#111827]">
                                    {booking.car}
                                  </div>
                                  <div className="flex items-center justify-between text-[10px] text-[#4B5563]">
                                    <span title={booking.client}>
                                      {truncateName(booking.client, 10)}
                                    </span>
                                    <span>{booking.plate}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CalendarView

