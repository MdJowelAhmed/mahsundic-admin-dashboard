import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import type { CarFilters } from '@/types'

interface CarFilterSidebarProps {
  filters: CarFilters
  onFilterChange: (filters: Partial<CarFilters>) => void
  onClearFilters: () => void
}

interface FilterSectionProps {
  title: string
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
}

function FilterSection({ title, isOpen, onToggle, children }: FilterSectionProps) {
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-3 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-medium text-gray-900">{title}</span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        )}
      </button>
      {isOpen && <div className="pb-3 space-y-2">{children}</div>}
    </div>
  )
}

const seatsOptions = [
  { value: 2, label: '2 Seats' },
  { value: 4, label: '4 Seats' },
  { value: 5, label: '5 Seats' },
  { value: 7, label: '7 Seats' },
  { value: 9, label: '9 Seats' },
]

const transmissionOptions = [
  { value: 'Automatic', label: 'Automatic' },
  { value: 'Manual', label: 'Manual' },
]

const fuelTypeOptions = [
  { value: 'Petrol', label: 'Petrol' },
  { value: 'Diesel', label: 'Diesel' },
  { value: 'Electric', label: 'Electric' },
  { value: 'Hybrid', label: 'Hybrid' },
]

const doorsOptions = [
  { value: 2, label: '2 Doors' },
  { value: 4, label: '4 Doors' },
  { value: 5, label: '5 Doors' },
]

const mileageLimitOptions = [
  { value: 'Unlimited Mileage', label: 'Unlimited Mileage' },
  { value: '200km (per day limit)', label: '200km (per day limit)' },
  { value: '400km (per day limit)', label: '400km (per day limit)' },
  { value: '500km (per day limit)', label: '500km (per day limit)' },
]

const fuelPolicyOptions = [
  { value: 'Full to Full', label: 'Full to Full' },
  { value: 'Full to Empty', label: 'Full to Empty' },
  { value: 'Pre-paid', label: 'Pre-paid' },
  { value: 'Same to Same', label: 'Same to Same' },
  { value: 'Fair', label: 'Fair' },
]

const ratingOptions = [
  { value: 'Top Rated', label: 'Top Rated' },
  { value: 'Most Popular', label: 'Most Popular' },
]

export function CarFilterSidebar({
  filters,
  onFilterChange,
  onClearFilters,
}: CarFilterSidebarProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    seats: true,
    transmission: true,
    fuelType: true,
    doors: true,
    mileageLimit: true,
    fuelPolicy: true,
    rating: true,
  })

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const handleCheckboxChange = (
    filterKey: keyof CarFilters,
    value: string | number,
    checked: boolean
  ) => {
    const currentFilter = filters[filterKey]
    
    if (currentFilter === 'all') {
      onFilterChange({ [filterKey]: checked ? [value] : 'all' } as Partial<CarFilters>)
    } else if (Array.isArray(currentFilter)) {
      if (checked) {
        onFilterChange({ [filterKey]: [...currentFilter, value] } as Partial<CarFilters>)
      } else {
        const newFilter = currentFilter.filter((item) => item !== value)
        onFilterChange({
          [filterKey]: newFilter.length === 0 ? 'all' : newFilter,
        } as Partial<CarFilters>)
      }
    }
  }

  const isChecked = (filterKey: keyof CarFilters, value: string | number): boolean => {
    const currentFilter = filters[filterKey]
    if (currentFilter === 'all') return false
    if (Array.isArray(currentFilter)) {
      return (currentFilter as (string | number)[]).includes(value)
    }
    return currentFilter === value
  }

  return (
    <Card className="w-64 h-fit sticky top-4 bg-white border-gray-200 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-gray-900">
            Filters
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-7 text-xs text-gray-600 hover:text-gray-900"
          >
            Clear All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-0">
          {/* Number of Seats */}
          <FilterSection
            title="Number of Seats"
            isOpen={openSections.seats}
            onToggle={() => toggleSection('seats')}
          >
            {seatsOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 rounded cursor-pointer"
              >
                <Checkbox
                  checked={isChecked('seats', option.value)}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange('seats', option.value, checked as boolean)
                  }
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </FilterSection>

          {/* Transmission */}
          <FilterSection
            title="Transmission"
            isOpen={openSections.transmission}
            onToggle={() => toggleSection('transmission')}
          >
            {transmissionOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 rounded cursor-pointer"
              >
                <Checkbox
                  checked={isChecked('transmission', option.value)}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange('transmission', option.value, checked as boolean)
                  }
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </FilterSection>

          {/* Fuel Type */}
          <FilterSection
            title="Fuel Type"
            isOpen={openSections.fuelType}
            onToggle={() => toggleSection('fuelType')}
          >
            {fuelTypeOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 rounded cursor-pointer"
              >
                <Checkbox
                  checked={isChecked('fuelType', option.value)}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange('fuelType', option.value, checked as boolean)
                  }
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </FilterSection>

          {/* Number of Doors */}
          <FilterSection
            title="Number of Doors"
            isOpen={openSections.doors}
            onToggle={() => toggleSection('doors')}
          >
            {doorsOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 rounded cursor-pointer"
              >
                <Checkbox
                  checked={isChecked('doors', option.value)}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange('doors', option.value, checked as boolean)
                  }
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </FilterSection>

          {/* Mileage Limit */}
          <FilterSection
            title="Mileage Limit"
            isOpen={openSections.mileageLimit}
            onToggle={() => toggleSection('mileageLimit')}
          >
            {mileageLimitOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 rounded cursor-pointer"
              >
                <Checkbox
                  checked={isChecked('mileageLimit', option.value)}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange('mileageLimit', option.value, checked as boolean)
                  }
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </FilterSection>

          {/* Fuel Policy */}
          <FilterSection
            title="Fuel Policy"
            isOpen={openSections.fuelPolicy}
            onToggle={() => toggleSection('fuelPolicy')}
          >
            {fuelPolicyOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 rounded cursor-pointer"
              >
                <Checkbox
                  checked={isChecked('fuelPolicy', option.value)}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange('fuelPolicy', option.value, checked as boolean)
                  }
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </FilterSection>

          {/* Rating & Popularity */}
          <FilterSection
            title="Rating & Popularity"
            isOpen={openSections.rating}
            onToggle={() => toggleSection('rating')}
          >
            {ratingOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 rounded cursor-pointer"
              >
                <Checkbox
                  checked={isChecked('rating', option.value)}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange('rating', option.value, checked as boolean)
                  }
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </FilterSection>
        </div>
      </CardContent>
    </Card>
  )
}

