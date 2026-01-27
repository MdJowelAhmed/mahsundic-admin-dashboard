# Apply RBAC to Other Shared Pages

This guide shows how to apply the same role-based data filtering pattern to Bookings, Transactions, and Calendar pages.

## 📋 Overview

These pages need role-based filtering:
1. ✅ **Cars** - Already implemented (see `src/pages/carlist/CarList.tsx`)
2. ⏳ **Bookings** - Follow instructions below
3. ⏳ **Transactions** - Follow instructions below  
4. ⏳ **Calendar** - Follow instructions below

## 🚗 Bookings Management

### Step 1: Update Booking Data

```typescript
// src/pages/Booking/bookingData.ts
import { applyBusinessIds } from '@/utils/applyBusinessIds'

// At the end of the file, wrap your export:
export const bookingsData = applyBusinessIds([
  // ... your existing booking objects
])
```

### Step 2: Update Booking Slice

```typescript
// src/redux/slices/bookingSlice.ts (if it exists)
// OR update the component state management

import { applyBusinessIds } from '@/utils/applyBusinessIds'

// Apply businessIds when initializing data
const bookingsWithBusinessIds = applyBusinessIds(bookingData)
```

### Step 3: Create Booking Selectors

```typescript
// src/redux/selectors/bookingSelectors.ts
import { RootState } from '../store'
import { UserRole } from '@/types/roles'
import { Booking } from '@/types'

export const selectRoleBasedBookings = (state: RootState): Booking[] => {
  const { user } = state.auth
  // Replace with your actual booking state path
  const bookings = state.bookings?.list || [] 

  if (!user) return []

  if (user.role === UserRole.ADMIN) {
    return bookings
  }

  if (user.role === UserRole.BUSINESS && user.businessId) {
    return bookings.filter((booking) => booking.businessId === user.businessId)
  }

  return []
}

export const selectPaginatedRoleBasedBookings = (state: RootState): Booking[] => {
  const roleBasedBookings = selectRoleBasedBookings(state)
  // Add pagination logic here if needed
  return roleBasedBookings
}
```

### Step 4: Update Booking Component

```typescript
// src/pages/Booking/BookingManagement.tsx
import { useAppSelector } from '@/redux/hooks'
import { selectRoleBasedBookings } from '@/redux/selectors/bookingSelectors'
import { useIsBusiness } from '@/hooks/useRoleBasedData'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Info } from 'lucide-react'

function BookingManagement() {
  const bookings = useAppSelector(selectRoleBasedBookings)
  const isBusiness = useIsBusiness()
  const { user } = useAppSelector((state) => state.auth)

  return (
    <div className="space-y-6">
      {/* Business User Info Alert */}
      {isBusiness && user && (
        <Alert className="bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            You are viewing bookings from <strong>{user.businessName}</strong>. 
            You can only see and manage bookings for your business.
          </AlertDescription>
        </Alert>
      )}

      {/* Rest of your component */}
      <BookingTable bookings={bookings} />
    </div>
  )
}
```

## 💳 Transactions History

### Step 1: Update Transaction Data

```typescript
// src/pages/transictions-history/transactionData.ts
import { applyBusinessIds } from '@/utils/applyBusinessIds'

export const transactionsData = applyBusinessIds([
  // ... your existing transaction objects
])
```

### Step 2: Create Transaction Selectors

```typescript
// src/redux/selectors/transactionSelectors.ts
import { RootState } from '../store'
import { UserRole } from '@/types/roles'
import { Transaction } from '@/types'

export const selectRoleBasedTransactions = (state: RootState): Transaction[] => {
  const { user } = state.auth
  const transactions = state.transactions?.list || []

  if (!user) return []

  if (user.role === UserRole.ADMIN) {
    return transactions
  }

  if (user.role === UserRole.BUSINESS && user.businessId) {
    return transactions.filter((tx) => tx.businessId === user.businessId)
  }

  return []
}

export const selectRoleBasedTransactionsStats = (state: RootState) => {
  const transactions = selectRoleBasedTransactions(state)
  
  return {
    total: transactions.length,
    completed: transactions.filter(t => t.status === 'Completed').length,
    pending: transactions.filter(t => t.status === 'Pending').length,
    failed: transactions.filter(t => t.status === 'Failed').length,
    totalAmount: transactions.reduce((sum, t) => sum + t.amount, 0),
  }
}
```

### Step 3: Update Transaction Component

```typescript
// src/pages/transictions-history/TransactionsHistory.tsx
import { useAppSelector } from '@/redux/hooks'
import { selectRoleBasedTransactions, selectRoleBasedTransactionsStats } from '@/redux/selectors/transactionSelectors'
import { useIsBusiness } from '@/hooks/useRoleBasedData'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Info } from 'lucide-react'

function TransactionsHistory() {
  const transactions = useAppSelector(selectRoleBasedTransactions)
  const stats = useAppSelector(selectRoleBasedTransactionsStats)
  const isBusiness = useIsBusiness()
  const { user } = useAppSelector((state) => state.auth)

  return (
    <div className="space-y-6">
      {/* Business User Info Alert */}
      {isBusiness && user && (
        <Alert className="bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            You are viewing transactions from <strong>{user.businessName}</strong>. 
            You can only see transactions related to your business.
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Transactions" value={stats.total} />
        <StatCard title="Completed" value={stats.completed} />
        <StatCard title="Pending" value={stats.pending} />
        <StatCard title="Total Amount" value={`$${stats.totalAmount.toFixed(2)}`} />
      </div>

      {/* Transaction Table */}
      <TransactionTable transactions={transactions} />
    </div>
  )
}
```

## 📅 Calendar Events

### Step 1: Add businessId to Calendar Events

If your calendar shows bookings, they already have businessIds. If you have separate calendar events:

```typescript
// src/pages/calender/calendarData.ts (if exists)
import { applyBusinessIds } from '@/utils/applyBusinessIds'

interface CalendarEvent {
  id: string
  title: string
  date: string
  type: 'booking' | 'maintenance' | 'other'
  businessId?: string
  businessName?: string
  // ... other fields
}

export const calendarEvents = applyBusinessIds<CalendarEvent>([
  // ... your events
])
```

### Step 2: Create Calendar Selectors

```typescript
// src/redux/selectors/calendarSelectors.ts
import { RootState } from '../store'
import { UserRole } from '@/types/roles'

export const selectRoleBasedCalendarEvents = (state: RootState) => {
  const { user } = state.auth
  const events = state.calendar?.events || []

  if (!user) return []

  if (user.role === UserRole.ADMIN) {
    return events
  }

  if (user.role === UserRole.BUSINESS && user.businessId) {
    return events.filter((event) => event.businessId === user.businessId)
  }

  return []
}
```

### Step 3: Update Calendar Component

```typescript
// src/pages/calender/Calender.tsx
import { useAppSelector } from '@/redux/hooks'
import { selectRoleBasedCalendarEvents } from '@/redux/selectors/calendarSelectors'
import { useIsBusiness } from '@/hooks/useRoleBasedData'

function Calender() {
  const events = useAppSelector(selectRoleBasedCalendarEvents)
  const isBusiness = useIsBusiness()
  const { user } = useAppSelector((state) => state.auth)

  return (
    <div className="space-y-6">
      {/* Business User Info Alert */}
      {isBusiness && user && (
        <Alert className="bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            You are viewing calendar events from <strong>{user.businessName}</strong>.
          </AlertDescription>
        </Alert>
      )}

      {/* Calendar UI */}
      <CalendarView events={events} />
    </div>
  )
}
```

## 🎯 Common Pattern Summary

For ANY shared page, follow this pattern:

### 1. Data Layer
```typescript
import { applyBusinessIds } from '@/utils/applyBusinessIds'
const dataWithBusinessIds = applyBusinessIds(originalData)
```

### 2. Selector Layer
```typescript
export const selectRoleBasedData = (state: RootState) => {
  const { user } = state.auth
  const data = state.yourSlice.data

  if (!user) return []
  if (user.role === UserRole.ADMIN) return data
  if (user.role === UserRole.BUSINESS && user.businessId) {
    return data.filter(item => item.businessId === user.businessId)
  }
  return []
}
```

### 3. Component Layer
```typescript
function YourComponent() {
  const data = useAppSelector(selectRoleBasedData)
  const isBusiness = useIsBusiness()
  const { user } = useAppSelector((state) => state.auth)

  return (
    <>
      {isBusiness && user && <BusinessUserAlert businessName={user.businessName} />}
      <YourDataDisplay data={data} />
    </>
  )
}
```

## 🔄 Alternative: If Not Using Redux

If a page doesn't use Redux, use the hook directly:

```typescript
import { useRoleBasedData } from '@/hooks/useRoleBasedData'
import { applyBusinessIds } from '@/utils/applyBusinessIds'
import { yourData } from './yourData'

function YourComponent() {
  // Apply businessIds to data
  const dataWithBusinessIds = useMemo(() => 
    applyBusinessIds(yourData), 
    []
  )
  
  // Filter based on role
  const filteredData = useRoleBasedData(dataWithBusinessIds)

  return <YourDisplay data={filteredData} />
}
```

## ✅ Validation Checklist

After implementing, verify:

- [ ] Admin sees ALL data
- [ ] Business1 sees only their data
- [ ] Business2 sees different data than Business1
- [ ] No data overlap between businesses
- [ ] Info alert shows for business users
- [ ] Counts/stats reflect filtered data
- [ ] Pagination works with filtered data
- [ ] Search works with filtered data
- [ ] Edit/Delete only available for own items

## 🔒 Action Permissions

To restrict edit/delete actions for business users:

```typescript
import { useCanModifyItem } from '@/hooks/useRoleBasedData'

function DataRow({ item }) {
  const canModify = useCanModifyItem(item)

  return (
    <tr>
      <td>{item.name}</td>
      <td>
        {canModify ? (
          <>
            <Button onClick={() => handleEdit(item)}>Edit</Button>
            <Button onClick={() => handleDelete(item)}>Delete</Button>
          </>
        ) : (
          <Badge>View Only</Badge>
        )}
      </td>
    </tr>
  )
}
```

## 🎨 UI Enhancements

### Show Business Name in Tables

```typescript
import { useIsAdmin } from '@/hooks/useRoleBasedData'

function DataTable({ data }) {
  const isAdmin = useIsAdmin()

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          {isAdmin && <th>Business</th>}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map(item => (
          <tr key={item.id}>
            <td>{item.name}</td>
            {isAdmin && <td>{item.businessName}</td>}
            <td>...</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

### Filter by Business (Admin Only)

```typescript
function AdminBusinessFilter() {
  const isAdmin = useIsAdmin()
  const [selectedBusiness, setSelectedBusiness] = useState('all')

  if (!isAdmin) return null

  return (
    <Select value={selectedBusiness} onValueChange={setSelectedBusiness}>
      <SelectTrigger>
        <SelectValue placeholder="All Businesses" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Businesses</SelectItem>
        <SelectItem value="business-001">Premium Car Rentals</SelectItem>
        <SelectItem value="business-002">Luxury Auto Rentals</SelectItem>
        <SelectItem value="business-003">Economy Car Services</SelectItem>
      </SelectContent>
    </Select>
  )
}
```

## 📊 Example: Complete Booking Implementation

```typescript
// src/pages/Booking/BookingManagement.tsx
import { useMemo, useState } from 'react'
import { useAppSelector } from '@/redux/hooks'
import { useIsBusiness, useIsAdmin } from '@/hooks/useRoleBasedData'
import { useRoleBasedData } from '@/hooks/useRoleBasedData'
import { applyBusinessIds } from '@/utils/applyBusinessIds'
import { bookingData } from './bookingData'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Info } from 'lucide-react'

export default function BookingManagement() {
  const { user } = useAppSelector((state) => state.auth)
  const isBusiness = useIsBusiness()
  const isAdmin = useIsAdmin()
  
  // Apply businessIds to data
  const bookingsWithBusinessIds = useMemo(() => 
    applyBusinessIds(bookingData), 
    []
  )
  
  // Filter based on role
  const filteredBookings = useRoleBasedData(bookingsWithBusinessIds)
  
  // Calculate stats from filtered data
  const stats = useMemo(() => ({
    total: filteredBookings.length,
    upcoming: filteredBookings.filter(b => b.status === 'Upcoming').length,
    running: filteredBookings.filter(b => b.status === 'Running').length,
    completed: filteredBookings.filter(b => b.status === 'Completed').length,
  }), [filteredBookings])

  return (
    <div className="space-y-6">
      {/* Business User Alert */}
      {isBusiness && user && (
        <Alert className="bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            You are viewing bookings from <strong>{user.businessName}</strong>. 
            You can only see and manage bookings for your business.
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <BookingStatCard title="Total Bookings" value={stats.total} />
        <BookingStatCard title="Upcoming" value={stats.upcoming} />
        <BookingStatCard title="Running" value={stats.running} />
        <BookingStatCard title="Completed" value={stats.completed} />
      </div>

      {/* Booking Table */}
      <BookingTable 
        bookings={filteredBookings} 
        showBusinessColumn={isAdmin}
      />
    </div>
  )
}
```

That's it! Follow this pattern for all shared pages. 🎉
