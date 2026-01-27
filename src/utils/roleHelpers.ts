import { UserRole } from '@/types/roles';

/**
 * Add businessId to data items for demo purposes
 * In production, this would come from your API
 */
export const addBusinessIdToMockData = <T extends Record<string, any>>(
  data: T[],
  businessIdField: string = 'businessId'
): T[] => {
  const businessIds = ['business-001', 'business-002', 'business-003'];
  
  return data.map((item, index) => ({
    ...item,
    [businessIdField]: businessIds[index % businessIds.length],
  }));
};

/**
 * Filter data based on user role and business ID
 */
export const filterDataByRole = <T extends Record<string, any>>(
  data: T[],
  userRole: string,
  userBusinessId?: string,
  businessIdField: string = 'businessId'
): T[] => {
  // Admin sees all data
  if (userRole === UserRole.ADMIN) {
    return data;
  }

  // Business users see only their data
  if (userRole === UserRole.EMPLOYEE && userBusinessId) {
    return data.filter((item) => item[businessIdField] === userBusinessId);
  }

  return [];
};

/**
 * Check if user can access a specific item
 */
export const canAccessItem = (
  item: Record<string, any>,
  userRole: string,
  userBusinessId?: string,
  businessIdField: string = 'businessId'
): boolean => {
  if (userRole === UserRole.ADMIN) return true;
  
  if (userRole === UserRole.EMPLOYEE && userBusinessId) {
    return item[businessIdField] === userBusinessId;
  }

  return false;
};

/**
 * Get role badge color
 */
export const getRoleBadgeColor = (role: string): string => {
  switch (role) {
    case UserRole.ADMIN:
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    case UserRole.EMPLOYEE:
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  }
};

/**
 * Get role display name
 */
export const getRoleDisplayName = (role: string): string => {
  switch (role) {
    case UserRole.ADMIN:
      return 'Administrator';
    case UserRole.EMPLOYEE:
      return 'Business User';
    default:
      return 'Unknown Role';
  }
};
