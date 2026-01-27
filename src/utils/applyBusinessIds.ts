/**
 * Utility to add businessId to mock data for demo purposes
 * In production, this data would come from your API with businessId already included
 */

const businessProfiles = [
  { id: 'business-001', name: 'Premium Car Rentals' },
  { id: 'business-002', name: 'Luxury Auto Rentals' },
  { id: 'business-003', name: 'Economy Car Services' },
]

/**
 * Distributes items across businesses in a round-robin fashion
 */
export function applyBusinessIds<T extends { id: string }>(
  items: T[]
): (T & { businessId: string; businessName: string })[] {
  return items.map((item, index) => {
    const business = businessProfiles[index % businessProfiles.length]
    return {
      ...item,
      businessId: business.id,
      businessName: business.name,
    }
  })
}

export { businessProfiles }
