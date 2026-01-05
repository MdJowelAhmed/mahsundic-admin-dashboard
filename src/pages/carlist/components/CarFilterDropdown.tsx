import { useState } from 'react'
import { Filter, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { carClassFilterOptions } from '../carData'
import { cn } from '@/utils/cn'
import type { CarClass } from '@/types'

interface CarFilterDropdownProps {
  value: CarClass | 'all'
  onChange: (value: CarClass | 'all') => void
  className?: string
}

export function CarFilterDropdown({ value, onChange, className }: CarFilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'bg-orange-500 hover:bg-orange-600 text-white border-orange-500',
            'flex items-center gap-2',
            className
          )}
        >
          <Filter className="h-4 w-4" />
          Filter
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {carClassFilterOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => {
              onChange(option.value as CarClass | 'all')
              setIsOpen(false)
            }}
            className={cn(
              'cursor-pointer',
              value === option.value && 'bg-gray-100 font-semibold'
            )}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

