// import { useAppSelector } from '@/redux/hooks'
// import { RoleBadge } from '@/components/common/RoleBadge'
// import { Building } from 'lucide-react'

// export function UserRoleIndicator() {
//   const { user } = useAppSelector((state) => state.auth)

//   if (!user) return null

//   return (
//     <div className="flex flex-col gap-1 px-3 py-2 bg-muted/50 rounded-lg border">
//       <div className="flex items-center justify-between gap-2">
//         <span className="text-xs text-muted-foreground">Logged in as:</span>
//         <RoleBadge role={user.role} />
//       </div>
      
//       {user.role === UserRole.BUSINESS && user.businessName && (
//         <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 pt-1 border-t">
//           <Building className="h-3 w-3" />
//           <span className="truncate">{user.businessName}</span>
//         </div>
//       )}
//     </div>
//   )
// }
