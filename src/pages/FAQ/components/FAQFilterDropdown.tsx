import { FilterDropdown } from '@/components/common'
import type { SelectOption } from '@/types'
import type { FAQPosition } from '@/types'

const FAQ_POSITION_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'All Positions' },
  { value: 'top-left', label: 'Top Left' },
  { value: 'top-right', label: 'Top Right' },
  { value: 'bottom-left', label: 'Bottom Left' },
  { value: 'bottom-right', label: 'Bottom Right' },
]

interface FAQFilterDropdownProps {
  value: FAQPosition | 'all'
  onChange: (value: string) => void
}

export function FAQFilterDropdown({
  value,
  onChange,
}: FAQFilterDropdownProps) {
  return (
    <FilterDropdown
      value={value}
      options={FAQ_POSITION_OPTIONS}
      onChange={onChange}
      placeholder="Filter by position"
    />
  )
}

