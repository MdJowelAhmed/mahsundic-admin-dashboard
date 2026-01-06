import React, { useState } from 'react'
import CalendarView, { type CalendarBooking } from './components/CalendarView'

// Pickup calendar data with varied dates and times
const pickupBookings: CalendarBooking[] = [
  // Day 0 - Multiple bookings at same time
  {
    id: 'DK-12345',
    dayIndex: 0,
    time: '8:00 AM',
    car: 'Toyota Corolla',
    plate: 'DK-12345',
    client: 'Michael Don',
  },
  {
    id: 'DK-12346',
    dayIndex: 0,
    time: '8:00 AM',
    car: 'Honda Civic',
    plate: 'DK-12346',
    client: 'Sarah Johnson',
  },
  {
    id: 'DK-12347',
    dayIndex: 0,
    time: '8:00 AM',
    car: 'BMW X5',
    plate: 'DK-12347',
    client: 'John Smith',
  },
  {
    id: 'DK-12348',
    dayIndex: 0,
    time: '2:00 PM',
    car: 'Mercedes C-Class',
    plate: 'DK-12348',
    client: 'Emma Wilson',
  },
  {
    id: 'DK-12349',
    dayIndex: 0,
    time: '2:00 PM',
    car: 'Audi A4',
    plate: 'DK-12349',
    client: 'David Brown',
  },
  // Day 1
  {
    id: 'DK-22345',
    dayIndex: 1,
    time: '9:00 AM',
    car: 'Ford Mustang',
    plate: 'DK-22345',
    client: 'Lisa Anderson',
  },
  {
    id: 'DK-22346',
    dayIndex: 1,
    time: '11:00 AM',
    car: 'Tesla Model 3',
    plate: 'DK-22346',
    client: 'Robert Taylor',
  },
  {
    id: 'DK-22347',
    dayIndex: 1,
    time: '3:00 PM',
    car: 'Nissan Altima',
    plate: 'DK-22347',
    client: 'Maria Garcia',
  },
  {
    id: 'DK-22348',
    dayIndex: 1,
    time: '3:00 PM',
    car: 'Hyundai Elantra',
    plate: 'DK-22348',
    client: 'James Martinez',
  },
  {
    id: 'DK-22349',
    dayIndex: 1,
    time: '3:00 PM',
    car: 'Chevrolet Camaro',
    plate: 'DK-22349',
    client: 'Patricia Lee',
  },
  // Day 2
  {
    id: 'DK-32345',
    dayIndex: 2,
    time: '10:00 AM',
    car: 'Volkswagen Jetta',
    plate: 'DK-32345',
    client: 'William Harris',
  },
  {
    id: 'DK-32346',
    dayIndex: 2,
    time: '1:00 PM',
    car: 'Subaru Impreza',
    plate: 'DK-32346',
    client: 'Jennifer Clark',
  },
  {
    id: 'DK-32347',
    dayIndex: 2,
    time: '5:00 PM',
    car: 'Mazda CX-5',
    plate: 'DK-32347',
    client: 'Richard Lewis',
  },
  // Day 3
  {
    id: 'DK-42345',
    dayIndex: 3,
    time: '7:00 AM',
    car: 'Kia Optima',
    plate: 'DK-42345',
    client: 'Susan Walker',
  },
  {
    id: 'DK-42346',
    dayIndex: 3,
    time: '12:00 PM',
    car: 'Jeep Wrangler',
    plate: 'DK-42346',
    client: 'Joseph Hall',
  },
  {
    id: 'DK-42347',
    dayIndex: 3,
    time: '12:00 PM',
    car: 'Toyota RAV4',
    plate: 'DK-42347',
    client: 'Nancy Allen',
  },
  {
    id: 'DK-42348',
    dayIndex: 3,
    time: '4:00 PM',
    car: 'Honda CR-V',
    plate: 'DK-42348',
    client: 'Thomas Young',
  },
  // Day 4
  {
    id: 'DK-52345',
    dayIndex: 4,
    time: '6:00 AM',
    car: 'Ford F-150',
    plate: 'DK-52345',
    client: 'Karen King',
  },
  {
    id: 'DK-52346',
    dayIndex: 4,
    time: '9:00 AM',
    car: 'Ram 1500',
    plate: 'DK-52346',
    client: 'Christopher Wright',
  },
  // Day 5
  {
    id: 'DK-62345',
    dayIndex: 5,
    time: '8:00 AM',
    car: 'GMC Sierra',
    plate: 'DK-62345',
    client: 'Betty Lopez',
  },
  {
    id: 'DK-62346',
    dayIndex: 5,
    time: '2:00 PM',
    car: 'Chevrolet Silverado',
    plate: 'DK-62346',
    client: 'Daniel Hill',
  },
  {
    id: 'DK-62347',
    dayIndex: 5,
    time: '2:00 PM',
    car: 'Toyota Tundra',
    plate: 'DK-62347',
    client: 'Dorothy Green',
  },
  // Day 6
  {
    id: 'DK-72345',
    dayIndex: 6,
    time: '10:00 AM',
    car: 'Nissan Frontier',
    plate: 'DK-72345',
    client: 'Matthew Adams',
  },
  {
    id: 'DK-72346',
    dayIndex: 6,
    time: '6:00 PM',
    car: 'Honda Pilot',
    plate: 'DK-72346',
    client: 'Sharon Baker',
  },
  // Day 7
  {
    id: 'DK-82345',
    dayIndex: 7,
    time: '11:00 AM',
    car: 'Toyota Highlander',
    plate: 'DK-82345',
    client: 'Anthony Nelson',
  },
  {
    id: 'DK-82346',
    dayIndex: 7,
    time: '11:00 AM',
    car: 'Ford Explorer',
    plate: 'DK-82346',
    client: 'Michelle Carter',
  },
  {
    id: 'DK-82347',
    dayIndex: 7,
    time: '11:00 AM',
    car: 'Chevrolet Tahoe',
    plate: 'DK-82347',
    client: 'Mark Mitchell',
  },
  // Day 8
  {
    id: 'DK-92345',
    dayIndex: 8,
    time: '1:00 PM',
    car: 'GMC Yukon',
    plate: 'DK-92345',
    client: 'Laura Perez',
  },
  // Day 9
  {
    id: 'DK-A2345',
    dayIndex: 9,
    time: '9:00 AM',
    car: 'Cadillac Escalade',
    plate: 'DK-A2345',
    client: 'Steven Roberts',
  },
  {
    id: 'DK-A2346',
    dayIndex: 9,
    time: '9:00 AM',
    car: 'Lincoln Navigator',
    plate: 'DK-A2346',
    client: 'Donna Turner',
  },
  {
    id: 'DK-A2348',
    dayIndex: 9,
    time: '02:00 AM',
    car: 'Lincoln Navigator',
    plate: 'DK-A2346',
    client: 'Donna Turner',
  },
]

// Return calendar data with varied dates and times
const returnBookings: CalendarBooking[] = [
  // Day 0
  {
    id: 'RT-12345',
    dayIndex: 0,
    time: '10:00 AM',
    car: 'Toyota Corolla',
    plate: 'DK-12345',
    client: 'Michael Don',
  },
  {
    id: 'RT-12346',
    dayIndex: 0,
    time: '4:00 PM',
    car: 'Honda Civic',
    plate: 'DK-12346',
    client: 'Sarah Johnson',
  },
  // Day 1
  {
    id: 'RT-22345',
    dayIndex: 1,
    time: '11:00 AM',
    car: 'BMW X5',
    plate: 'DK-12347',
    client: 'John Smith',
  },
  {
    id: 'RT-22346',
    dayIndex: 1,
    time: '5:00 PM',
    car: 'Mercedes C-Class',
    plate: 'DK-12348',
    client: 'Emma Wilson',
  },
  {
    id: 'RT-22347',
    dayIndex: 1,
    time: '5:00 PM',
    car: 'Audi A4',
    plate: 'DK-12349',
    client: 'David Brown',
  },
  // Day 2
  {
    id: 'RT-32345',
    dayIndex: 2,
    time: '12:00 PM',
    car: 'Ford Mustang',
    plate: 'DK-22345',
    client: 'Lisa Anderson',
  },
  // Day 3
  {
    id: 'RT-42345',
    dayIndex: 3,
    time: '2:00 PM',
    car: 'Tesla Model 3',
    plate: 'DK-22346',
    client: 'Robert Taylor',
  },
  {
    id: 'RT-42346',
    dayIndex: 3,
    time: '6:00 PM',
    car: 'Nissan Altima',
    plate: 'DK-22347',
    client: 'Maria Garcia',
  },
  // Day 4
  {
    id: 'RT-52345',
    dayIndex: 4,
    time: '3:00 PM',
    car: 'Volkswagen Jetta',
    plate: 'DK-32345',
    client: 'William Harris',
  },
  // Day 5
  {
    id: 'RT-62345',
    dayIndex: 5,
    time: '1:00 PM',
    car: 'Subaru Impreza',
    plate: 'DK-32346',
    client: 'Jennifer Clark',
  },
  {
    id: 'RT-62346',
    dayIndex: 5,
    time: '1:00 PM',
    car: 'Mazda CX-5',
    plate: 'DK-32347',
    client: 'Richard Lewis',
  },
  // Day 6
  {
    id: 'RT-72345',
    dayIndex: 6,
    time: '9:00 AM',
    car: 'Kia Optima',
    plate: 'DK-42345',
    client: 'Susan Walker',
  },
  // Day 7
  {
    id: 'RT-82345',
    dayIndex: 7,
    time: '12:00 PM',
    car: 'Jeep Wrangler',
    plate: 'DK-42346',
    client: 'Joseph Hall',
  },
  {
    id: 'RT-82346',
    dayIndex: 7,
    time: '12:00 PM',
    car: 'Toyota RAV4',
    plate: 'DK-42347',
    client: 'Nancy Allen',
  },
  {
    id: 'RT-82347',
    dayIndex: 7,
    time: '12:00 PM',
    car: 'Honda CR-V',
    plate: 'DK-42348',
    client: 'Thomas Young',
  },
  // Day 8
  {
    id: 'RT-92345',
    dayIndex: 8,
    time: '7:00 AM',
    car: 'Ford F-150',
    plate: 'DK-52345',
    client: 'Karen King',
  },
  // Day 9
  {
    id: 'RT-A2345',
    dayIndex: 9,
    time: '8:00 AM',
    car: 'Ram 1500',
    plate: 'DK-52346',
    client: 'Christopher Wright',
  },
]

const Calender: React.FC = () => {
  const [activeView, setActiveView] = useState<'pickup' | 'return'>('pickup')
  const [searchValue, setSearchValue] = useState('')

  const currentBookings = activeView === 'pickup' ? pickupBookings : returnBookings

  return (
    <div className="space-y-4">
      {/* Pickup / Return toggle */}
      <div className="flex items-center gap-6">
        <button
          onClick={() => setActiveView('pickup')}
          className={`flex items-center gap-2 text-sm font-medium transition-colors ${
            activeView === 'pickup'
              ? 'text-[#21A366]'
              : 'text-[#9CA3AF] hover:text-[#6B7280]'
          }`}
        >
          <span
            className={`inline-flex h-4 w-4 items-center justify-center rounded-full border ${
              activeView === 'pickup'
                ? 'border-[#21A366]'
                : 'border-[#D1D5DB]'
            }`}
          >
            {activeView === 'pickup' && (
              <span className="h-2 w-2 rounded-full bg-[#21A366]" />
            )}
          </span>
          Pickup
        </button>
        <button
          onClick={() => setActiveView('return')}
          className={`flex items-center gap-2 text-sm font-medium transition-colors ${
            activeView === 'return'
              ? 'text-[#21A366]'
              : 'text-[#9CA3AF] hover:text-[#6B7280]'
          }`}
        >
          <span
            className={`inline-flex h-4 w-4 items-center justify-center rounded-full border ${
              activeView === 'return'
                ? 'border-[#21A366]'
                : 'border-[#D1D5DB]'
            }`}
          >
            {activeView === 'return' && (
              <span className="h-2 w-2 rounded-full bg-[#21A366]" />
            )}
          </span>
          Return
        </button>
      </div>

      {/* Reusable Calendar View */}
      <CalendarView
        bookings={currentBookings}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
      />
    </div>
  )
}

export default Calender