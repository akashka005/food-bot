import { z } from 'zod';

// =============================================================================
// Auth Validators
// =============================================================================

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['STUDENT', 'VENDOR', 'ADMIN', 'SUPER_ADMIN']).default('STUDENT'),
  rememberMe: z.boolean().optional().default(false),
});

export const studentRegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  registrationNumber: z
    .string()
    .regex(/^\d{8}$/, 'Registration number must be 8 digits'),
  phone: z
    .string()
    .regex(/^(?:\+91)?\d{10}$/, 'Phone must be 10 digits')
    .optional(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase letter')
    .regex(/[a-z]/, 'Must contain lowercase letter')
    .regex(/[0-9]/, 'Must contain number'),
  confirmPassword: z.string(),
  department: z.string().optional(),
  course: z.string().optional(),
  year: z.number().min(1).max(6).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.enum(['STUDENT', 'VENDOR', 'ADMIN', 'SUPER_ADMIN']).default('STUDENT'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase letter')
    .regex(/[a-z]/, 'Must contain lowercase letter')
    .regex(/[0-9]/, 'Must contain number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase letter')
    .regex(/[a-z]/, 'Must contain lowercase letter')
    .regex(/[0-9]/, 'Must contain number'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// =============================================================================
// Student Validators
// =============================================================================

export const updateStudentProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z.string().regex(/^\+91\d{10}$/).optional().nullable(),
  department: z.string().optional().nullable(),
  course: z.string().optional().nullable(),
  year: z.number().min(1).max(6).optional().nullable(),
  preferredLanguage: z.enum(['en', 'hi', 'pa']).optional(),
  dietaryPreference: z.enum(['VEG', 'NON_VEG', 'JAIN', 'VEGAN']).optional().nullable(),
  profilePicture: z.string().url().optional().nullable(),
});

// =============================================================================
// Menu Validators
// =============================================================================

export const createMenuItemSchema = z.object({
  stallId: z.string().uuid(),
  categoryId: z.string().uuid().optional(),
  name: z.string().min(2).max(200),
  description: z.string().max(1000).optional(),
  image: z.string().url().optional(),
  price: z.number().positive('Price must be positive'),
  discountedPrice: z.number().positive().optional(),
  discountPercent: z.number().min(0).max(100).optional(),
  mealCategory: z.enum(['BREAKFAST', 'LUNCH', 'DINNER', 'SNACKS', 'BEVERAGES', 'DESSERTS', 'SPECIALS']),
  dietaryType: z.enum(['VEG', 'NON_VEG', 'JAIN', 'VEGAN']).default('VEG'),
  preparationTime: z.number().positive().default(10),
  calories: z.number().positive().optional(),
  ingredients: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  isSpecial: z.boolean().default(false),
  sortOrder: z.number().default(0),
});

export const updateMenuItemSchema = createMenuItemSchema.partial().omit({ stallId: true });

// =============================================================================
// Order Validators
// =============================================================================

export const createOrderSchema = z.object({
  stallId: z.string().uuid('Invalid stall ID'),
  pickupSlotId: z.string().uuid().optional(),
  items: z
    .array(
      z.object({
        menuItemId: z.string().uuid('Invalid menu item ID'),
        quantity: z.number().int().positive('Quantity must be positive').max(10),
        specialRequest: z.string().max(500).optional(),
      })
    )
    .min(1, 'At least one item is required')
    .max(20, 'Maximum 20 items per order'),
  specialInstructions: z.string().max(500).optional(),
  paymentMethod: z.enum(['UPI', 'CREDIT_CARD', 'DEBIT_CARD', 'WALLET', 'CASH', 'MOCK']).default('MOCK'),
  couponCode: z.string().optional(),
  rewardPointsToUse: z.number().int().min(0).optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['ACCEPTED', 'PREPARING', 'READY', 'COLLECTED', 'COMPLETED', 'CANCELLED', 'REJECTED']),
  notes: z.string().optional(),
  estimatedReadyTime: z.string().datetime().optional(),
});

export const cancelOrderSchema = z.object({
  reason: z.string().min(10, 'Please provide a reason').max(500),
});

// =============================================================================
// Food Stall Validators
// =============================================================================

export const createFoodStallSchema = z.object({
  name: z.string().min(2).max(200),
  description: z.string().max(1000).optional(),
  category: z.enum(['NORTH_INDIAN', 'SOUTH_INDIAN', 'CHINESE', 'CONTINENTAL', 'FAST_FOOD', 'BEVERAGES', 'SNACKS', 'DESSERTS', 'HEALTHY', 'MIXED']).default('MIXED'),
  location: z.string().min(2).max(500),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  openingTime: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format'),
  closingTime: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format'),
  operatingDays: z.array(z.string()).default(['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']),
  averagePrepTime: z.number().positive().default(15),
  kitchenCapacity: z.number().positive().default(10),
  maxQueueCapacity: z.number().positive().default(50),
});

export const updateFoodStallSchema = createFoodStallSchema.partial();

// =============================================================================
// Review Validators
// =============================================================================

export const createReviewSchema = z.object({
  stallId: z.string().uuid(),
  menuItemId: z.string().uuid().optional(),
  orderId: z.string().uuid().optional(),
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
  comment: z.string().max(1000).optional(),
  images: z.array(z.string().url()).max(5).default([]),
});

// =============================================================================
// Support Ticket Validators
// =============================================================================

export const createSupportTicketSchema = z.object({
  subject: z.string().min(5).max(200),
  description: z.string().min(20).max(2000),
  category: z.enum(['general', 'order', 'payment', 'vendor', 'technical', 'complaint']).default('general'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
});

// =============================================================================
// Announcement Validators
// =============================================================================

export const createAnnouncementSchema = z.object({
  title: z.string().min(5).max(200),
  content: z.string().min(10).max(5000),
  target: z.enum(['STUDENTS', 'VENDORS', 'EVERYONE']).default('EVERYONE'),
  status: z.enum(['DRAFT', 'SCHEDULED', 'PUBLISHED']).default('DRAFT'),
  scheduledAt: z.string().datetime().optional(),
  imageUrl: z.string().url().optional(),
  isPinned: z.boolean().default(false),
});

// =============================================================================
// Notification Validators
// =============================================================================

export const updateNotificationPrefsSchema = z.object({
  whatsapp: z.boolean(),
  email: z.boolean(),
  push: z.boolean(),
});

// =============================================================================
// Pickup Slot Validators
// =============================================================================

export const createPickupSlotSchema = z.object({
  stallId: z.string().uuid(),
  date: z.string().date(),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  maxOrders: z.number().positive().default(20),
});

// =============================================================================
// WhatsApp / Chat Validators
// =============================================================================

export const sendMessageSchema = z.object({
  message: z.string().min(1).max(4096),
  studentPhone: z.string().optional(),
});

export const webhookVerifySchema = z.object({
  'hub.mode': z.literal('subscribe'),
  'hub.verify_token': z.string(),
  'hub.challenge': z.string(),
});

// =============================================================================
// Inventory Validators
// =============================================================================

export const createInventorySchema = z.object({
  stallId: z.string().uuid(),
  menuItemId: z.string().uuid().optional(),
  ingredientName: z.string().min(2).max(200),
  unit: z.string().min(1).max(50),
  currentStock: z.number().min(0),
  reorderLevel: z.number().min(0),
  maxStock: z.number().positive(),
  costPerUnit: z.number().positive(),
  supplierName: z.string().optional(),
  expiryDate: z.string().datetime().optional(),
});

// Type exports
export type LoginInput = z.infer<typeof loginSchema>;
export type StudentRegisterInput = z.infer<typeof studentRegisterSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type UpdateStudentProfileInput = z.infer<typeof updateStudentProfileSchema>;
export type CreateMenuItemInput = z.infer<typeof createMenuItemSchema>;
export type UpdateMenuItemInput = z.infer<typeof updateMenuItemSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type CancelOrderInput = z.infer<typeof cancelOrderSchema>;
export type CreateFoodStallInput = z.infer<typeof createFoodStallSchema>;
export type UpdateFoodStallInput = z.infer<typeof updateFoodStallSchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type CreateSupportTicketInput = z.infer<typeof createSupportTicketSchema>;
export type CreateAnnouncementInput = z.infer<typeof createAnnouncementSchema>;
export type CreateInventoryInput = z.infer<typeof createInventorySchema>;
