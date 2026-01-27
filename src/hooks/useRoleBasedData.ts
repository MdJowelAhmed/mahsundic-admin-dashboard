import { useMemo } from 'react';
import { useAppSelector } from '@/redux/hooks';
import { UserRole } from '@/types/roles';

interface DataItem {
  businessId?: string;
  userId?: string;
  [key: string]: string | number | undefined;
}

/**
 * Hook to filter data based on user role
 * Admin sees all data, Business users see only their own data
 */
export const useRoleBasedData = <T extends DataItem>(data: T[]): T[] => {
  const { user } = useAppSelector((state) => state.auth);

  return useMemo(() => {
    if (!user) return [];

    // Admin sees everything
    if (user.role === UserRole.ADMIN) {
      return data;
    }

    // Business users see only their data
    if (user.role === UserRole.EMPLOYEE && user.businessId) {
      return data.filter(
        (item) => 
          item.businessId === user.businessId || 
          item.userId === user.id
      );
    }

    return [];
  }, [data, user]);
};

/**
 * Hook to check if current user is admin
 */
export const useIsAdmin = (): boolean => {
  const { user } = useAppSelector((state) => state.auth);
  return user?.role === UserRole.ADMIN;
};

/**
 * Hook to check if current user is business
 */
export const useIsBusiness = (): boolean => {
  const { user } = useAppSelector((state) => state.auth);
  return user?.role === UserRole.EMPLOYEE;
};

/**
 * Hook to get current user's business ID
 */
export const useBusinessId = (): string | undefined => {
  const { user } = useAppSelector((state) => state.auth);
  return user?.businessId;
};

/**
 * Hook to check if user can modify/delete an item
 */
export const useCanModifyItem = (item: DataItem): boolean => {
  const { user } = useAppSelector((state) => state.auth);

  if (!user) return false;

  // Admin can modify everything
  if (user.role === UserRole.ADMIN) return true;

  // Business users can only modify their own items
  if (user.role === UserRole.EMPLOYEE) {
    return item.businessId === user.businessId || item.userId === user.id;
  }

  return false;
};
