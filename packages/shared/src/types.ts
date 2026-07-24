// =============================================================================
// Shared Types — LPU SmartFood AI
// =============================================================================

export type UserRole = 'STUDENT' | 'VENDOR' | 'ADMIN' | 'SUPER_ADMIN';

export type DietaryType = 'VEG' | 'NON_VEG' | 'JAIN' | 'VEGAN';

export type OrderStatus =
  | 'PLACED'
  | 'ACCEPTED'
  | 'PREPARING'
  | 'READY'
  | 'COLLECTED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REJECTED'
  | 'EXPIRED';

export type PaymentStatus =
  | 'PENDING'
  | 'PAID'
  | 'FAILED'
  | 'REFUNDED'
  | 'PARTIALLY_REFUNDED';

export type PaymentMethod = 'UPI' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'WALLET' | 'CASH' | 'MOCK';

export type StallStatus = 'OPEN' | 'CLOSED' | 'PAUSED' | 'MAINTENANCE';

export type MenuItemStatus = 'AVAILABLE' | 'UNAVAILABLE' | 'OUT_OF_STOCK' | 'PAUSED';

export type MealCategory =
  | 'BREAKFAST'
  | 'LUNCH'
  | 'DINNER'
  | 'SNACKS'
  | 'BEVERAGES'
  | 'DESSERTS'
  | 'SPECIALS';

// API Response wrapper
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface ApiError {
  success: false;
  error: string;
  message: string;
  statusCode: number;
  details?: Record<string, unknown>;
}

// Pagination
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Auth types
export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  name: string;
  iat?: number;
  exp?: number;
}

export interface AuthSession {
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    profilePicture?: string | null;
  };
  token: string;
  refreshToken: string;
  expiresAt: string;
}

// Student types
export interface StudentProfile {
  id: string;
  registrationNumber: string;
  name: string;
  email: string;
  phone?: string | null;
  profilePicture?: string | null;
  department?: string | null;
  course?: string | null;
  year?: number | null;
  preferredLanguage: string;
  dietaryPreference?: DietaryType | null;
  walletBalance: number;
  rewardPoints: number;
  status: string;
  emailVerified: boolean;
  createdAt: string;
}

// Stall types
export interface FoodStallSummary {
  id: string;
  name: string;
  description?: string | null;
  category: string;
  location: string;
  images: string[];
  openingTime: string;
  closingTime: string;
  status: StallStatus;
  averagePrepTime: number;
  currentQueueLength: number;
  rating: number;
  totalReviews: number;
  isVerified: boolean;
  vendor: {
    id: string;
    businessName: string;
  };
}

// Menu types
export interface MenuItemSummary {
  id: string;
  name: string;
  description?: string | null;
  image?: string | null;
  price: number;
  discountedPrice?: number | null;
  discountPercent?: number | null;
  mealCategory: MealCategory;
  dietaryType: DietaryType;
  status: MenuItemStatus;
  preparationTime: number;
  calories?: number | null;
  ingredients: string[];
  tags: string[];
  isSpecial: boolean;
  popularityScore: number;
  rating: number;
  totalReviews: number;
  stall: {
    id: string;
    name: string;
    status: StallStatus;
  };
}

// Order types
export interface OrderSummary {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  estimatedReadyTime?: string | null;
  estimatedWaitMinutes?: number | null;
  queuePosition?: number | null;
  isWhatsAppOrder: boolean;
  stall: {
    id: string;
    name: string;
  };
  items: {
    id: string;
    menuItemName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  pickupSlot?: {
    startTime: string;
    endTime: string;
    date: string;
  } | null;
  createdAt: string;
}

// Cart types
export interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  specialRequest?: string;
  dietaryType: DietaryType;
  preparationTime: number;
}

export interface Cart {
  stallId: string;
  stallName: string;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  total: number;
}

// Queue types
export interface QueueInfo {
  stallId: string;
  stallName: string;
  currentQueueLength: number;
  estimatedWaitMinutes: number;
  kitchenLoad: number;
  confidence: number;
  isOpen: boolean;
}

// Recommendation types
export interface RecommendationItem {
  menuItemId: string;
  name: string;
  image?: string;
  price: number;
  dietaryType: DietaryType;
  rating: number;
  preparationTime: number;
  stallName: string;
  stallId: string;
  score: number;
  reason: string;
  category: string;
}

// WhatsApp / Chat types
export interface ChatMessageData {
  role: 'user' | 'assistant' | 'system';
  content: string;
  type: 'text' | 'image' | 'voice' | 'button' | 'list';
  metadata?: Record<string, unknown>;
  timestamp: string;
}

export interface ConversationContext {
  studentId: string;
  whatsappPhone: string;
  currentIntent?: string;
  cartItems?: CartItem[];
  selectedStallId?: string;
  preferredPickupTime?: string;
  conversationHistory: ChatMessageData[];
  lastOrderId?: string;
}

// Analytics types
export interface DashboardMetrics {
  totalRevenue: number;
  totalOrders: number;
  totalStudents: number;
  activeVendors: number;
  avgWaitTime: number;
  peakHour: number;
  revenueGrowth: number;
  orderGrowth: number;
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

// Notification types
export interface NotificationData {
  id: string;
  type: string;
  channel: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  createdAt: string;
}
