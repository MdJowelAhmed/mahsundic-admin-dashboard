import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/redux/hooks';
import { UserRole, hasRouteAccess } from '@/types/roles';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RoleBasedRouteProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  redirectTo?: string;
}

export const RoleBasedRoute = ({ 
  children, 
  allowedRoles,
  redirectTo = '/dashboard'
}: RoleBasedRouteProps) => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  const hasAccess = allowedRoles.includes(user.role as UserRole);

  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        <Alert className="max-w-lg border-destructive/50 bg-destructive/10">
          <ShieldAlert className="h-5 w-5 text-destructive" />
          <AlertTitle className="text-lg font-semibold">Access Denied</AlertTitle>
          <AlertDescription className="mt-2 space-y-4">
            <p className="text-sm">
              You don't have permission to access this page. This area is restricted to {allowedRoles.join(', ')} users only.
            </p>
            <Button 
              onClick={() => window.history.back()} 
              variant="outline"
              className="w-full"
            >
              Go Back
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
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
    // Redirect business users to their default page
    if (user.role === UserRole.BUSINESS) {
      return <Navigate to="/cars" replace />;
    }
    
    // Redirect to dashboard for others
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
