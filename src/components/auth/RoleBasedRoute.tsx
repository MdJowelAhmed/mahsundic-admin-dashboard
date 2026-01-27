import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/redux/hooks';
import { UserRole, hasRouteAccess } from '@/types/roles';

interface RoleBasedRouteProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  redirectTo?: string;
}

export const RoleBasedRoute = ({ 
  children, 
  allowedRoles,
  // redirectTo = '/dashboard'
}: RoleBasedRouteProps) => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const location = useLocation();

  // 🔍 Console log for debugging
  console.log('🛡️ RoleBasedRoute Debug:');
  console.log('Current Path:', location.pathname);
  console.log('User:', user);
  console.log('User Role:', user?.role);
  console.log('Allowed Roles:', allowedRoles);
  console.log('User Role as UserRole:', user?.role as UserRole);

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  const hasAccess = allowedRoles.includes(user.role as UserRole);
  console.log('Has Access:', hasAccess);

  if (!hasAccess) {
    console.log('❌ Access denied, redirecting based on role')
    // Redirect Admin and Employee to /cars
    if (user.role === UserRole.ADMIN || user.role === UserRole.EMPLOYEE) {
      console.log('📍 Redirecting Admin/Employee to /cars')
      return <Navigate to="/cars" replace />;
    }
    
    // Redirect Super Admin to dashboard
    console.log('📍 Redirecting Super Admin to /dashboard')
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Helper component for checking route access
interface RouteGuardProps {
  children: ReactNode;
}

export const RouteGuard = ({ children }: RouteGuardProps) => {
  const { user } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  const hasAccess = hasRouteAccess(user.role, location.pathname);

  if (!hasAccess) {
    // Redirect Admin and Employee to /cars
    if (user.role === UserRole.ADMIN || user.role === UserRole.EMPLOYEE) {
      return <Navigate to="/cars" replace />;
    }
    // Redirect Super Admin to dashboard
    if (user.role === UserRole.SUPER_ADMIN) {
      return <Navigate to="/dashboard" replace />;
    }

    
    // Redirect Super Admin to dashboard
    return <Navigate to="/cars" replace />;
  }

  return <>{children}</>;
};
