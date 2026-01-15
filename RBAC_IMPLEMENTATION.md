# Role-Based Access Control (RBAC) Implementation Guide

## Overview

This dashboard implements a comprehensive Role-Based Access Control (RBAC) system supporting two user types:
- **Admin**: Full access to all features and data
- **Business**: Limited access to only their own business data

## User Roles

### Admin Role
- Can access ALL pages and features
- Views ALL data from all businesses
- Can manage: Dashboard, Users, Agency Management, FAQ
- Can view and modify all cars, bookings, transactions, and calendar events

### Business Role  
- Limited access to specific pages only
- Views ONLY data related to their business
- Cannot access: Dashboard, Users, Agency Management, FAQ
- Can view and modify only their own: Cars, Bookings, Transactions, Calendar events

## Demo Credentials

### Admin Account
```
Email: admin@example.com
Password: password
```

### Business Account 1 (Premium Car Rentals)
```
Email: business1@example.com
Password: password
Business ID: business-001
```

### Business Account 2 (Luxury Auto Rentals)
```
Email: business2@example.com
Password: password
Business ID: business-002
```

## Architecture

### 1. Type Definitions (`src/types/roles.ts`)

```typescript
export enum UserRole {
  ADMIN = 'admin',
  BUSINESS = 'business',
}

// Route permissions map
export const ROUTE_PERMISSIONS: Record<string, UserRole[]>
```

### 2. Route Protection (`src/components/auth/RoleBasedRoute.tsx`)

Wraps routes to enforce role-based access:

```tsx
<Route 
  path="dashboard" 
  element={
    <RoleBasedRoute allowedRoles={[UserRole.ADMIN]}>
      <Dashboard />
    </RoleBasedRoute>
  } 
/>
```

### 3. Data Filtering

#### Hooks (`src/hooks/useRoleBasedData.ts`)
- `useRoleBasedData<T>()` - Filters data array based on user role
- `useIsAdmin()` - Returns true if current user is admin
- `useIsBusiness()` - Returns true if current user is business
- `useBusinessId()` - Returns current user's business ID
- `useCanModifyItem()` - Checks if user can modify specific item

#### Selectors (`src/redux/selectors/roleBasedSelectors.ts`)
- `selectRoleBasedCars` - Gets cars filtered by user role
- `selectPaginatedRoleBasedCars` - Gets paginated cars by role
- `selectRoleBasedCarsCount` - Total count of role-filtered cars
- `selectRoleBasedTotalPages` - Total pages for role-filtered data
- `selectCanModifyItem` - Permission check for item modification

### 4. Sidebar Navigation (`src/components/layout/Sidebar.tsx`)

Navigation items are automatically filtered based on user role:

```typescript
const filteredNavItems = navItems.filter((item) => {
  if (!item.allowedRoles) return true // No restriction
  if (!user) return false
  return item.allowedRoles.includes(user.role as UserRole)
})
```

## Page Access Control

### Admin Only Pages
- `/dashboard` - Dashboard analytics
- `/users` - User management
- `/agency-management` - Agency management
- `/settings/faq` - FAQ management

### Shared Pages (Role-Based Data Filtering)
- `/cars` - Car list (filtered by businessId)
- `/booking-management` - Bookings (filtered by businessId)
- `/transactions-history` - Transactions (filtered by businessId)
- `/calender` - Calendar events (filtered by businessId)

### Accessible to All
- `/settings/profile` - Profile settings
- `/settings/password` - Password change
- `/settings/terms` - Terms & conditions
- `/settings/privacy` - Privacy policy

## Implementation Examples

### Example 1: Protecting a Route

```tsx
import { RoleBasedRoute } from '@/components/auth/RoleBasedRoute'
import { UserRole } from '@/types/roles'

<Route 
  path="admin-only-page" 
  element={
    <RoleBasedRoute allowedRoles={[UserRole.ADMIN]}>
      <AdminOnlyPage />
    </RoleBasedRoute>
  } 
/>
```

### Example 2: Filtering Data in a Component

```tsx
import { useAppSelector } from '@/redux/hooks'
import { selectRoleBasedCars } from '@/redux/selectors/roleBasedSelectors'

function CarList() {
  // Automatically filtered based on user role
  const cars = useAppSelector(selectRoleBasedCars)
  
  return (
    <div>
      {cars.map(car => (
        <CarCard key={car.id} car={car} />
      ))}
    </div>
  )
}
```

### Example 3: Conditional Rendering Based on Role

```tsx
import { useIsAdmin, useIsBusiness } from '@/hooks/useRoleBasedData'

function MyComponent() {
  const isAdmin = useIsAdmin()
  const isBusiness = useIsBusiness()
  
  return (
    <div>
      {isAdmin && <AdminControls />}
      {isBusiness && <BusinessInfo />}
    </div>
  )
}
```

### Example 4: Checking Item Modification Permission

```tsx
import { useCanModifyItem } from '@/hooks/useRoleBasedData'

function CarCard({ car }) {
  const canModify = useCanModifyItem(car)
  
  return (
    <div>
      <h3>{car.name}</h3>
      {canModify && (
        <div>
          <Button onClick={() => handleEdit(car)}>Edit</Button>
          <Button onClick={() => handleDelete(car)}>Delete</Button>
        </div>
      )}
    </div>
  )
}
```

## Data Structure

All shared data models include these fields for role-based filtering:

```typescript
interface SharedDataModel {
  id: string
  // ... other fields
  businessId?: string     // For filtering business user data
  businessName?: string   // For display purposes
}
```

### Updated Models
- `Car` - Added businessId and businessName
- `Booking` - Added businessId and businessName
- `Transaction` - Added businessId and businessName

## Adding New Protected Routes

### Step 1: Update Route Permissions

```typescript
// src/types/roles.ts
export const ROUTE_PERMISSIONS: Record<string, UserRole[]> = {
  // ... existing routes
  '/new-route': [UserRole.ADMIN], // Admin only
  // OR
  '/shared-route': [UserRole.ADMIN, UserRole.BUSINESS], // Both
}
```

### Step 2: Add Route with Protection

```tsx
// src/App.tsx
<Route 
  path="new-route" 
  element={
    <RoleBasedRoute allowedRoles={[UserRole.ADMIN]}>
      <NewPage />
    </RoleBasedRoute>
  } 
/>
```

### Step 3: Add to Sidebar Navigation (Optional)

```tsx
// src/components/layout/Sidebar.tsx
const navItems: NavItem[] = [
  // ... existing items
  {
    title: 'New Feature',
    href: '/new-route',
    icon: SomeIcon,
    allowedRoles: [UserRole.ADMIN],
  },
]
```

## Adding Role-Based Data Filtering to New Pages

### Step 1: Add businessId to Data Model

```typescript
// Update your type definition
export interface YourDataModel {
  id: string
  // ... other fields
  businessId?: string
  businessName?: string
}
```

### Step 2: Apply businessIds to Mock Data

```typescript
// In your data file
import { applyBusinessIds } from '@/utils/applyBusinessIds'

export const yourData = applyBusinessIds([
  { id: '1', name: 'Item 1', /* ... */ },
  { id: '2', name: 'Item 2', /* ... */ },
])
```

### Step 3: Create Selector (if using Redux)

```typescript
// src/redux/selectors/yourSelectors.ts
export const selectRoleBasedYourData = (state: RootState) => {
  const { user } = state.auth
  const { filteredList } = state.yourSlice

  if (!user) return []
  if (user.role === UserRole.ADMIN) return filteredList
  if (user.role === UserRole.BUSINESS && user.businessId) {
    return filteredList.filter(item => item.businessId === user.businessId)
  }
  return []
}
```

### Step 4: Use in Component

```typescript
import { useAppSelector } from '@/redux/hooks'
import { selectRoleBasedYourData } from '@/redux/selectors/yourSelectors'

function YourComponent() {
  const data = useAppSelector(selectRoleBasedYourData)
  // data is automatically filtered based on user role
}
```

## UI Components

### Role Badge

Display user's role with an icon:

```tsx
import { RoleBadge } from '@/components/common/RoleBadge'

<RoleBadge role={user.role} />
```

### User Role Indicator

Shows current user info and business name (if applicable):

```tsx
import { UserRoleIndicator } from '@/components/layout/UserRoleIndicator'

<UserRoleIndicator />
```

## Security Considerations

### Frontend Protection
- Routes are protected with `RoleBasedRoute` component
- Sidebar automatically hides unauthorized menu items
- Data is filtered based on user role before rendering

### Backend Requirements (Production)
⚠️ **Important**: Frontend protection is NOT sufficient for production!

You MUST implement server-side authorization:

1. **API Endpoints**: Validate user role and businessId on every request
2. **Data Queries**: Filter database queries by businessId for business users
3. **JWT Tokens**: Include role and businessId in authentication tokens
4. **Middleware**: Implement role-checking middleware for protected routes
5. **Audit Logging**: Log all access attempts for security monitoring

Example backend middleware (Node.js/Express):

```javascript
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    const userRole = req.user.role
    
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        error: 'Access denied' 
      })
    }
    
    next()
  }
}

// Usage
app.get('/api/admin/users', requireRole('admin'), getUsersController)
```

## Testing the RBAC System

### Test Case 1: Admin Access
1. Login with admin credentials
2. Verify all menu items are visible
3. Navigate to Dashboard, Users, Agency Management
4. Verify you see ALL data from all businesses

### Test Case 2: Business User Access
1. Login with business1 credentials
2. Verify limited menu items (no Dashboard, Users, Agency, FAQ)
3. Navigate to Cars page
4. Verify you ONLY see cars from "Premium Car Rentals" (business-001)
5. Try to access `/dashboard` directly - should show "Access Denied"

### Test Case 3: Business User Isolation
1. Login with business1 credentials, note the cars displayed
2. Logout and login with business2 credentials
3. Navigate to Cars page
4. Verify you see DIFFERENT cars (from "Luxury Auto Rentals")
5. Confirm no overlap in data between businesses

## Troubleshooting

### Issue: Business user sees all data
**Solution**: Ensure businessId is applied to your data and selectors are used properly.

### Issue: Sidebar items not filtering
**Solution**: Check that `allowedRoles` is set on NavItem and user is loaded in Redux state.

### Issue: Route protection not working
**Solution**: Verify route is wrapped with `RoleBasedRoute` and user is authenticated.

### Issue: Page shows "Access Denied" for authorized user
**Solution**: Check `ROUTE_PERMISSIONS` in `src/types/roles.ts` includes the user's role.

## Future Enhancements

Potential additions to the RBAC system:

1. **Permissions System**: Granular permissions beyond roles
2. **Team Management**: Multiple users per business
3. **Role Hierarchy**: Super admin, admin, manager, viewer, etc.
4. **Custom Permissions**: Per-user permission overrides
5. **Audit Trail**: Log all actions for compliance
6. **Session Management**: Active session tracking
7. **Two-Factor Authentication**: Additional security layer
8. **API Key Management**: For third-party integrations

## Summary

This RBAC implementation provides:
- ✅ Two-tier role system (Admin & Business)
- ✅ Route-level protection
- ✅ Automatic sidebar filtering
- ✅ Data filtering by businessId
- ✅ Reusable hooks and selectors
- ✅ Type-safe with TypeScript
- ✅ Easy to extend with new roles/permissions

For questions or issues, refer to the inline code comments or create an issue in the repository.
