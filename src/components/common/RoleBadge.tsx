import { Badge } from '@/components/ui/badge'
import { Shield, Briefcase } from 'lucide-react'
import { cn } from '@/utils/cn'

interface RoleBadgeProps {
  role: string
  className?: string
  showIcon?: boolean
}

export function RoleBadge({ role, className, showIcon = true }: RoleBadgeProps) {
  const isAdmin = role === 'admin'
  
  return (
    <Badge
      variant={isAdmin ? 'default' : 'secondary'}
      className={cn(
        'gap-1',
        isAdmin 
          ? 'bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-200' 
          : 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200',
        className
      )}
    >
      {showIcon && (
        isAdmin ? (
          <Shield className="h-3 w-3" />
        ) : (
          <Briefcase className="h-3 w-3" />
        )
      )}
      {isAdmin ? 'Admin' : 'Business'}
    </Badge>
  )
}
