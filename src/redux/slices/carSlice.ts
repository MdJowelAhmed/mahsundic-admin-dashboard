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
      
      // Transmission filter
      if (state.filters.transmission !== 'all') {
        filtered = filtered.filter((car) => car.transmission === state.filters.transmission)
      }
      
      state.filteredList = filtered
      state.pagination.total = filtered.length
      state.pagination.totalPages = Math.ceil(
        filtered.length / state.pagination.limit
      )
      state.pagination.page = 1
    },
    clearFilters: (state) => {
      state.filters = { search: '', carClass: 'all', transmission: 'all' }
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

