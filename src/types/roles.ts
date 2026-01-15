// Role definitions
export enum UserRole {
  ADMIN = 'admin',
  BUSINESS = 'business',
}

// Route permissions
export interface RoutePermission {
  path: string;
  allowedRoles: UserRole[];
  description?: string;
}

// Define which routes each role can access
export const ROUTE_PERMISSIONS: Record<string, UserRole[]> = {
  // Admin only routes
  '/dashboard': [UserRole.ADMIN],
  '/users': [UserRole.ADMIN],
  '/agency-management': [UserRole.ADMIN],
  '/settings/faq': [UserRole.ADMIN],
  
  // Shared routes (both can access but with filtered data)
  '/transactions-history': [UserRole.ADMIN, UserRole.BUSINESS],
  '/cars': [UserRole.ADMIN, UserRole.BUSINESS],
  '/booking-management': [UserRole.ADMIN, UserRole.BUSINESS],
  '/calender': [UserRole.ADMIN, UserRole.BUSINESS],
  
  // Settings - accessible to both
  '/settings/profile': [UserRole.ADMIN, UserRole.BUSINESS],
  '/settings/password': [UserRole.ADMIN, UserRole.BUSINESS],
};

// Helper function to check if user has access to a route
export const hasRouteAccess = (userRole: string, routePath: string): boolean => {
  // Check exact match first
  if (ROUTE_PERMISSIONS[routePath]) {
    return ROUTE_PERMISSIONS[routePath].includes(userRole as UserRole);
  }
  
  // Check for partial matches (e.g., /users/123 should match /users)
  const matchingRoute = Object.keys(ROUTE_PERMISSIONS).find(route => 
    routePath.startsWith(route)
  );
  
  if (matchingRoute) {
    return ROUTE_PERMISSIONS[matchingRoute].includes(userRole as UserRole);
  }
  
  // Default: deny access if no permission defined
  return false;
};

// Helper to check if route should show filtered data
export const shouldFilterData = (userRole: string, routePath: string): boolean => {
  const sharedRoutes = [
    '/transactions-history',
    '/cars',
    '/booking-management',
    '/calender',
  ];
  
  return userRole === UserRole.BUSINESS && 
         sharedRoutes.some(route => routePath.startsWith(route));
};
