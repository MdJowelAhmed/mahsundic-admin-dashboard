import { RootState } from '../store'
import { UserRole } from '@/types/roles'
import { Car } from '@/types'

/**
 * Selector to get cars filtered by user role
 * Admin sees all cars, Business users see only their cars
 */
export const selectRoleBasedCars = (state: RootState): Car[] => {
  const { user } = state.auth
  const { filteredList } = state.cars

  if (!user) return []

  // Admin sees all cars
  if (user.role === UserRole.ADMIN) {
    return filteredList
  }

  // Business users see only their cars
  if (user.role === UserRole.EMPLOYEE && user.businessId) {
    return filteredList.filter((car) => car.businessId === user.businessId)
  }

  return []
}

/**
 * Selector to get paginated cars based on role
 */
export const selectPaginatedRoleBasedCars = (state: RootState): Car[] => {
  const roleBasedCars = selectRoleBasedCars(state)
  const { pagination } = state.cars
  
  const startIndex = (pagination.page - 1) * pagination.limit
  return roleBasedCars.slice(startIndex, startIndex + pagination.limit)
}

/**
 * Selector to get total count of role-based filtered cars
 */
export const selectRoleBasedCarsCount = (state: RootState): number => {
  return selectRoleBasedCars(state).length
}

/**
 * Selector to calculate total pages for role-based filtered cars
 */
export const selectRoleBasedTotalPages = (state: RootState): number => {
  const count = selectRoleBasedCarsCount(state)
  const { limit } = state.cars.pagination
  return Math.ceil(count / limit)
}

/**
 * Check if user can modify a specific item
 */
export const selectCanModifyItem = (state: RootState, itemBusinessId?: string): boolean => {
  const { user } = state.auth

  if (!user) return false

  // Admin can modify everything
  if (user.role === UserRole.ADMIN) return true

  // Business users can only modify their own items
  if (user.role === UserRole.EMPLOYEE && user.businessId) {
    return itemBusinessId === user.businessId
  }

  return false
}
