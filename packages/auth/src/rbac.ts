import type { UserRole } from '@smartfood/shared';

// Define granular permissions
export const PERMISSIONS = {
  // Students
  STUDENT_READ: 'student:read',
  STUDENT_WRITE: 'student:write',
  
  // Vendors
  VENDOR_READ: 'vendor:read',
  VENDOR_WRITE: 'vendor:write',
  
  // Orders
  ORDER_READ: 'order:read',
  ORDER_WRITE: 'order:write',
  
  // Menu
  MENU_READ: 'menu:read',
  MENU_WRITE: 'menu:write',
  
  // General Admin
  ANNOUNCEMENT_WRITE: 'announcement:write',
  ANALYTICS_READ: 'analytics:read',
  
  // Super Admin
  ALL: '*',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

// Map roles to their default permissions
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  STUDENT: [
    PERMISSIONS.STUDENT_READ,
    PERMISSIONS.STUDENT_WRITE,
    PERMISSIONS.ORDER_READ,
    PERMISSIONS.ORDER_WRITE,
    PERMISSIONS.MENU_READ,
  ],
  VENDOR: [
    PERMISSIONS.VENDOR_READ,
    PERMISSIONS.VENDOR_WRITE,
    PERMISSIONS.ORDER_READ,
    PERMISSIONS.ORDER_WRITE,
    PERMISSIONS.MENU_READ,
    PERMISSIONS.MENU_WRITE,
    PERMISSIONS.ANALYTICS_READ,
  ],
  ADMIN: [
    PERMISSIONS.STUDENT_READ,
    PERMISSIONS.STUDENT_WRITE,
    PERMISSIONS.VENDOR_READ,
    PERMISSIONS.VENDOR_WRITE,
    PERMISSIONS.ORDER_READ,
    PERMISSIONS.MENU_READ,
    PERMISSIONS.ANNOUNCEMENT_WRITE,
    PERMISSIONS.ANALYTICS_READ,
  ],
  SUPER_ADMIN: [PERMISSIONS.ALL],
};

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: UserRole, permission: Permission, userSpecificPermissions: string[] = []): boolean {
  if (role === 'SUPER_ADMIN' || userSpecificPermissions.includes(PERMISSIONS.ALL)) {
    return true;
  }
  
  const basePermissions = ROLE_PERMISSIONS[role];
  return basePermissions.includes(permission) || userSpecificPermissions.includes(permission);
}
