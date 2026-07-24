// =============================================================================
// Constants — LPU SmartFood AI
// =============================================================================

export const APP_NAME = 'LPU SmartFood AI';
export const APP_TAGLINE = 'AI Powered WhatsApp Food Pre-Booking Platform';
export const APP_URL = process.env['NEXT_PUBLIC_APP_URL'] ?? 'http://localhost:3000';

// Auth
export const JWT_EXPIRES_IN = '7d';
export const REFRESH_TOKEN_EXPIRES_IN = '30d';
export const REMEMBER_ME_EXPIRES_IN = '30d';
export const OTP_EXPIRES_MINUTES = 10;
export const PASSWORD_RESET_EXPIRES_MINUTES = 30;

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// Order limits
export const MAX_ITEMS_PER_ORDER = 20;
export const MAX_QUANTITY_PER_ITEM = 10;
export const CANCELLATION_WINDOW_MINUTES = 5;
export const QR_CODE_EXPIRY_MINUTES = 30;

// Rewards
export const REWARD_POINTS_PER_10_RUPEES = 1;
export const REWARD_POINT_VALUE_RUPEES = 0.1; // 1 point = ₹0.10

// Queue
export const DEFAULT_KITCHEN_CAPACITY = 10;
export const DEFAULT_MAX_QUEUE = 50;
export const QUEUE_REFRESH_INTERVAL_SECONDS = 30;

// Cache TTL (seconds)
export const CACHE_TTL = {
  MENU: 300,         // 5 minutes
  STALLS: 60,        // 1 minute
  QUEUE: 15,         // 15 seconds
  RECOMMENDATIONS: 300,  // 5 minutes
  ANALYTICS: 300,    // 5 minutes
  USER_PROFILE: 60,  // 1 minute
  FAQ: 3600,         // 1 hour
} as const;

// Redis Keys
export const REDIS_KEYS = {
  queue: (stallId: string) => `queue:${stallId}`,
  menuCache: (stallId: string) => `menu:${stallId}`,
  recommendations: (studentId: string) => `recs:${studentId}`,
  rateLimit: (ip: string) => `ratelimit:${ip}`,
  session: (token: string) => `session:${token}`,
  conversationContext: (phone: string) => `conv:${phone}`,
  popularFoods: () => 'popular:foods',
  leaderboard: () => 'rewards:leaderboard',
} as const;

// Status labels
export const ORDER_STATUS_LABELS: Record<string, string> = {
  PLACED: 'Order Placed',
  ACCEPTED: 'Accepted',
  PREPARING: 'Preparing',
  READY: 'Ready for Pickup',
  COLLECTED: 'Collected',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  REJECTED: 'Rejected',
  EXPIRED: 'Expired',
};

export const ORDER_STATUS_COLORS: Record<string, string> = {
  PLACED: 'blue',
  ACCEPTED: 'indigo',
  PREPARING: 'amber',
  READY: 'green',
  COLLECTED: 'teal',
  COMPLETED: 'emerald',
  CANCELLED: 'red',
  REJECTED: 'red',
  EXPIRED: 'gray',
};

export const STALL_CATEGORY_LABELS: Record<string, string> = {
  NORTH_INDIAN: 'North Indian',
  SOUTH_INDIAN: 'South Indian',
  CHINESE: 'Chinese',
  CONTINENTAL: 'Continental',
  FAST_FOOD: 'Fast Food',
  BEVERAGES: 'Beverages',
  SNACKS: 'Snacks',
  DESSERTS: 'Desserts',
  HEALTHY: 'Healthy',
  MIXED: 'Mixed Cuisine',
};

export const MEAL_CATEGORY_LABELS: Record<string, string> = {
  BREAKFAST: 'Breakfast',
  LUNCH: 'Lunch',
  DINNER: 'Dinner',
  SNACKS: 'Snacks',
  BEVERAGES: 'Beverages',
  DESSERTS: 'Desserts',
  SPECIALS: 'Today\'s Specials',
};

export const DIETARY_TYPE_LABELS: Record<string, string> = {
  VEG: 'Veg',
  NON_VEG: 'Non-Veg',
  JAIN: 'Jain',
  VEGAN: 'Vegan',
};

export const DIETARY_TYPE_COLORS: Record<string, string> = {
  VEG: '#22c55e',
  NON_VEG: '#ef4444',
  JAIN: '#f59e0b',
  VEGAN: '#10b981',
};

// Supported Languages
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
] as const;

export type SupportedLanguage = 'en' | 'hi' | 'pa';

// LLM Providers
export const LLM_PROVIDERS = ['groq', 'openai', 'gemini', 'anthropic'] as const;
export type LLMProvider = (typeof LLM_PROVIDERS)[number];

// WhatsApp modes
export const WHATSAPP_MODES = ['simulator', 'live'] as const;
export type WhatsAppMode = (typeof WHATSAPP_MODES)[number];

// Intent types
export const CHAT_INTENTS = [
  'GREETING',
  'BROWSE_MENU',
  'RECOMMEND_FOOD',
  'SEARCH_FOOD',
  'ORDER_FOOD',
  'MODIFY_ORDER',
  'CANCEL_ORDER',
  'TRACK_ORDER',
  'REPEAT_ORDER',
  'CHECK_WAIT_TIME',
  'FIND_OPEN_STALL',
  'PICKUP_SLOT',
  'OPERATING_HOURS',
  'PAYMENT_QUESTION',
  'REFUND_QUESTION',
  'FEEDBACK',
  'COMPLAINT',
  'FAQ',
  'UNKNOWN',
] as const;

export type ChatIntent = (typeof CHAT_INTENTS)[number];

// HTTP Status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// Error codes
export const ERROR_CODES = {
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',
  ACCOUNT_SUSPENDED: 'ACCOUNT_SUSPENDED',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TOKEN_INVALID: 'TOKEN_INVALID',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  STALL_CLOSED: 'STALL_CLOSED',
  ITEM_UNAVAILABLE: 'ITEM_UNAVAILABLE',
  SLOT_FULL: 'SLOT_FULL',
  INSUFFICIENT_WALLET_BALANCE: 'INSUFFICIENT_WALLET_BALANCE',
  ORDER_CANNOT_BE_CANCELLED: 'ORDER_CANNOT_BE_CANCELLED',
  DUPLICATE_ORDER: 'DUPLICATE_ORDER',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  PAYMENT_FAILED: 'PAYMENT_FAILED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
