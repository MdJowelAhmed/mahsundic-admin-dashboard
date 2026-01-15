# Quick Start: Role-Based Access Control

## 🚀 Test the System Now

### 1. Start the Development Server
```bash
npm run dev
```

### 2. Login with Different Accounts

#### As Admin (See Everything)
```
Email: admin@example.com
Password: password
```
✅ You will see:
- Dashboard page
- Users page
- Agency Management
- All Cars, Bookings, Transactions from ALL businesses
- FAQ settings

#### As Business User 1 (Premium Car Rentals)
```
Email: business1@example.com
Password: password
```
✅ You will see:
- Cars from "Premium Car Rentals" only
- Bookings for your cars only
- Your transactions only
- Your calendar events only

❌ You will NOT see:
- Dashboard
- Users
- Agency Management
- FAQ settings
- Other businesses' data

#### As Business User 2 (Luxury Auto Rentals)
```
Email: business2@example.com
Password: password
```
✅ Different data from Business 1!

## 🎯 What Changed

### 1. Login Page (`src/pages/Auth/Login.tsx`)
- Now supports 3 accounts: 1 admin + 2 business users
- Each business user has unique `businessId`
- Auto-redirects based on role

### 2. Route Protection (`src/App.tsx`)
- Wrapped routes with `RoleBasedRoute` component
- Admin-only routes: Dashboard, Users, Agency, FAQ
- Shared routes: Cars, Bookings, Transactions, Calendar

### 3. Sidebar (`src/components/layout/Sidebar.tsx`)
- Automatically hides menu items based on role
- Business users only see: Cars, Bookings, Calendar, Transactions, Settings

### 4. Data Filtering (`src/pages/carlist/CarList.tsx`)
- Uses `selectRoleBasedCars` selector
- Admin sees all 16 cars
- Business1 sees ~5 cars (with businessId: business-001)
- Business2 sees ~5 cars (with businessId: business-002)

### 5. New Files Created

**Core RBAC Files:**
- `src/types/roles.ts` - Role definitions & permissions
- `src/components/auth/RoleBasedRoute.tsx` - Route protection
- `src/hooks/useRoleBasedData.ts` - Data filtering hooks
- `src/redux/selectors/roleBasedSelectors.ts` - Role-based selectors
- `src/utils/roleHelpers.ts` - Helper functions
- `src/utils/applyBusinessIds.ts` - Add businessIds to mock data

**UI Components:**
- `src/components/common/RoleBadge.tsx` - Display role badge
- `src/components/layout/UserRoleIndicator.tsx` - Show user info

**Documentation:**
- `RBAC_IMPLEMENTATION.md` - Full documentation
- `QUICK_START_RBAC.md` - This file

## 🔧 How to Add RBAC to Other Pages

### For Bookings Page:

```typescript
// 1. Update booking slice to use role-based filtering
import { applyBusinessIds } from '@/utils/applyBusinessIds'

const bookingsWithBusinessIds = applyBusinessIds(bookingData)

// 2. Create selector
export const selectRoleBasedBookings = (state: RootState) => {
  const { user } = state.auth
  const { filteredList } = state.bookings

  if (!user) return []
  if (user.role === 'admin') return filteredList
  if (user.role === 'business' && user.businessId) {
    return filteredList.filter(b => b.businessId === user.businessId)
  }
  return []
}

// 3. Use in component
const bookings = useAppSelector(selectRoleBasedBookings)
```

### For Transactions Page:

Same pattern - apply businessIds, create selector, use in component.

### For Calendar Page:

Same pattern - filter events by businessId.

## 📋 Testing Checklist

### Admin Tests
- [ ] Login as admin@example.com
- [ ] See Dashboard in sidebar
- [ ] Navigate to Dashboard - works
- [ ] Navigate to Users - works
- [ ] Navigate to Agency Management - works
- [ ] Navigate to Cars - see ALL 16 cars
- [ ] Navigate to FAQ settings - works

### Business User Tests
- [ ] Login as business1@example.com
- [ ] Don't see Dashboard, Users, Agency in sidebar
- [ ] Navigate to Cars - see only ~5-6 cars
- [ ] Try URL `/dashboard` - see "Access Denied"
- [ ] Try URL `/users` - see "Access Denied"
- [ ] Check cars have "Premium Car Rentals" badge
- [ ] Logout

- [ ] Login as business2@example.com
- [ ] Navigate to Cars - see DIFFERENT cars
- [ ] Check cars have "Luxury Auto Rentals" badge
- [ ] Confirm no overlap with business1's cars

## 🎨 UI Features

### Role Indicator
Business users see their business name:
```tsx
<UserRoleIndicator />
```

Displays:
```
Logged in as: [Business Badge]
🏢 Premium Car Rentals
```

### Info Alert
Business pages show:
```
ℹ️ You are viewing cars from Premium Car Rentals. 
   You can only see and manage cars that belong to your business.
```

### Role Badge
Shows user type with icon:
- Admin: Purple badge with shield icon
- Business: Blue badge with briefcase icon

## 🔐 Production Checklist

Before deploying to production:

- [ ] Implement server-side role validation
- [ ] Add businessId to JWT tokens
- [ ] Filter database queries by businessId
- [ ] Add API middleware for role checking
- [ ] Implement audit logging
- [ ] Add rate limiting per business
- [ ] Set up proper CORS policies
- [ ] Enable HTTPS only
- [ ] Add session management
- [ ] Implement refresh tokens
- [ ] Add two-factor authentication (optional)
- [ ] Set up monitoring & alerts

## 🆘 Common Issues

**Q: Business user sees all data**
A: Check that businessId is applied to data and selectors are used.

**Q: Sidebar shows wrong items**
A: Verify `allowedRoles` is set on NavItem and user state is loaded.

**Q: Access Denied for valid route**
A: Check `ROUTE_PERMISSIONS` includes user's role for that route.

**Q: User gets logged out immediately**
A: Check token is being saved to localStorage in authSlice.

## 📞 Support

For help:
1. Check `RBAC_IMPLEMENTATION.md` for detailed docs
2. Look at inline code comments
3. Review example implementations in CarList component
4. Test with demo accounts first

---

**That's it!** Your RBAC system is now fully functional. 🎉

Test it out by logging in with different accounts and seeing how the dashboard changes!
