import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Car, CarFilters } from '@/types'
import { carListData } from '@/pages/carlist/carData'

interface CarState {
  list: Car[]
  filteredList: Car[]
  filters: CarFilters
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  isLoading: boolean
  error: string | null
}

const initialState: CarState = {
  list: carListData,
  filteredList: carListData,
  filters: {
    search: '',
    carClass: 'all',
    transmission: 'all',
    seats: 'all',
    fuelType: 'all',
    doors: 'all',
    mileageLimit: 'all',
    fuelPolicy: 'all',
    rating: 'all',
  },
  pagination: {
    page: 1,
    limit: 10,
    total: carListData.length,
    totalPages: Math.ceil(carListData.length / 10),
  },
  isLoading: false,
  error: null,
}

const carSlice = createSlice({
  name: 'cars',
  initialState,
  reducers: {
    setCars: (state, action: PayloadAction<Car[]>) => {
      state.list = action.payload
      state.filteredList = action.payload
      state.pagination.total = action.payload.length
      state.pagination.totalPages = Math.ceil(
        action.payload.length / state.pagination.limit
      )
    },
    setFilters: (state, action: PayloadAction<Partial<CarFilters>>) => {
      state.filters = { ...state.filters, ...action.payload }
      
      // Apply filters
      let filtered = [...state.list]
      
      // Search filter
      if (state.filters.search) {
        const searchLower = state.filters.search.toLowerCase()
        filtered = filtered.filter(
          (car) =>
            car.name.toLowerCase().includes(searchLower) ||
            car.transmission.toLowerCase().includes(searchLower) ||
            car.description.toLowerCase().includes(searchLower)
        )
      }
      
      // Car class filter
      if (state.filters.carClass !== 'all') {
        filtered = filtered.filter((car) => car.carClass === state.filters.carClass)
      }
      
      // Transmission filter (array support)
      if (state.filters.transmission !== 'all') {
        if (Array.isArray(state.filters.transmission)) {
          filtered = filtered.filter((car) => 
            state.filters.transmission.includes(car.transmission)
          )
        } else {
          filtered = filtered.filter((car) => car.transmission === state.filters.transmission)
        }
      }
      
      // Seats filter
      if (state.filters.seats !== 'all' && Array.isArray(state.filters.seats)) {
        filtered = filtered.filter((car) => 
          state.filters.seats.includes(car.seats as any)
        )
      }
      
      // Fuel type filter
      if (state.filters.fuelType !== 'all' && Array.isArray(state.filters.fuelType)) {
        filtered = filtered.filter((car) => 
          car.fuelType && state.filters.fuelType.includes(car.fuelType as any)
        )
      }
      
      // Doors filter
      if (state.filters.doors !== 'all' && Array.isArray(state.filters.doors)) {
        filtered = filtered.filter((car) => 
          state.filters.doors.includes(car.doors as any)
        )
      }
      
      // Mileage limit filter
      if (state.filters.mileageLimit !== 'all' && Array.isArray(state.filters.mileageLimit)) {
        filtered = filtered.filter((car) => {
          if (!car.kilometers) return false
          return state.filters.mileageLimit.some((limit) => 
            car.kilometers?.includes(limit) || 
            (limit === 'Unlimited Mileage' && car.kilometers?.toLowerCase().includes('unlimited'))
          )
        })
      }
      
      // Fuel policy filter
      if (state.filters.fuelPolicy !== 'all' && Array.isArray(state.filters.fuelPolicy)) {
        filtered = filtered.filter((car) => 
          car.fuelPolicy && state.filters.fuelPolicy.includes(car.fuelPolicy as any)
        )
      }
      
      // Rating filter
      if (state.filters.rating !== 'all' && Array.isArray(state.filters.rating)) {
        filtered = filtered.filter((car) => {
          if (state.filters.rating.includes('Top Rated')) {
            return car.isTopRated === true || (car.rating && car.rating >= 4.5)
          }
          if (state.filters.rating.includes('Most Popular')) {
            return car.isMostPopular === true
          }
          return false
        })
      }
      
      state.filteredList = filtered
      state.pagination.total = filtered.length
      state.pagination.totalPages = Math.ceil(
        filtered.length / state.pagination.limit
      )
      state.pagination.page = 1
    },
    clearFilters: (state) => {
      state.filters = { 
        search: '', 
        carClass: 'all', 
        transmission: 'all',
        seats: 'all',
        fuelType: 'all',
        doors: 'all',
        mileageLimit: 'all',
        fuelPolicy: 'all',
        rating: 'all',
      }
      state.filteredList = state.list
      state.pagination.total = state.list.length
      state.pagination.totalPages = Math.ceil(
        state.list.length / state.pagination.limit
      )
      state.pagination.page = 1
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.pagination.limit = action.payload
      state.pagination.totalPages = Math.ceil(
        state.filteredList.length / action.payload
      )
      state.pagination.page = 1
    },
    addCar: (state, action: PayloadAction<Car>) => {
      state.list.unshift(action.payload)
      state.filteredList.unshift(action.payload)
      state.pagination.total = state.list.length
      state.pagination.totalPages = Math.ceil(
        state.list.length / state.pagination.limit
      )
    },
    updateCar: (state, action: PayloadAction<Car>) => {
      const index = state.list.findIndex((car) => car.id === action.payload.id)
      if (index !== -1) {
        state.list[index] = action.payload
      }
      const filteredIndex = state.filteredList.findIndex((car) => car.id === action.payload.id)
      if (filteredIndex !== -1) {
        state.filteredList[filteredIndex] = action.payload
      }
    },
    deleteCar: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter((car) => car.id !== action.payload)
      state.filteredList = state.filteredList.filter((car) => car.id !== action.payload)
      state.pagination.total = state.list.length
      state.pagination.totalPages = Math.ceil(
        state.list.length / state.pagination.limit
      )
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const {
  setCars,
  setFilters,
  clearFilters,
  setPage,
  setLimit,
  addCar,
  updateCar,
  deleteCar,
  setLoading,
  setError,
} = carSlice.actions

export default carSlice.reducer

