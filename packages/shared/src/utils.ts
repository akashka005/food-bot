// =============================================================================
// Utility Functions — LPU SmartFood AI
// =============================================================================

import { type ApiResponse } from './types';

/**
 * Format currency in Indian Rupees
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format date to readable string
 */
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...options,
  }).format(d);
}

/**
 * Format time (HH:MM) to 12-hour format
 */
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const h = hours ?? 0;
  const m = minutes ?? 0;
  const period = h >= 12 ? 'PM' : 'AM';
  const displayHours = h % 12 || 12;
  return `${displayHours}:${m.toString().padStart(2, '0')} ${period}`;
}

/**
 * Format datetime to relative time (e.g., "2 minutes ago")
 */
export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  return formatDate(d);
}

/**
 * Generate a unique order number
 */
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

/**
 * Generate a unique invoice number
 */
export function generateInvoiceNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `INV-${timestamp}-${random}`;
}

/**
 * Generate a unique ticket number
 */
export function generateTicketNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `TKT-${timestamp}-${random}`;
}

/**
 * Create a success API response
 */
export function successResponse<T>(data: T, message?: string, meta?: object): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
    ...(meta && { meta: meta as ApiResponse<T>['meta'] }),
  };
}

/**
 * Create an error API response
 */
export function errorResponse(error: string, message?: string): ApiResponse {
  return {
    success: false,
    error,
    message: message ?? error,
  };
}

/**
 * Calculate estimated wait time based on queue info
 */
export function calculateEstimatedWait(
  queueLength: number,
  avgPrepTime: number,
  kitchenCapacity: number
): number {
  if (queueLength === 0) return 0;
  const ordersPerSlot = Math.ceil(kitchenCapacity / 2);
  const batchesNeeded = Math.ceil(queueLength / ordersPerSlot);
  return batchesNeeded * avgPrepTime;
}

/**
 * Calculate reward points for an order
 */
export function calculateRewardPoints(orderTotal: number): number {
  return Math.floor(orderTotal / 10);
}

/**
 * Slugify a string
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Truncate text
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 3)}...`;
}

/**
 * Check if a stall is currently open
 */
export function isStallOpen(openingTime: string, closingTime: string, status: string): boolean {
  if (status !== 'OPEN') return false;
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const [openH, openM] = openingTime.split(':').map(Number);
  const [closeH, closeM] = closingTime.split(':').map(Number);

  const openMinutes = (openH ?? 0) * 60 + (openM ?? 0);
  const closeMinutes = (closeH ?? 0) * 60 + (closeM ?? 0);

  return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
}

/**
 * Get queue load percentage
 */
export function getQueueLoadPercent(current: number, max: number): number {
  if (max === 0) return 0;
  return Math.min(100, Math.round((current / max) * 100));
}

/**
 * Get queue status label
 */
export function getQueueStatus(loadPercent: number): {
  label: string;
  color: string;
} {
  if (loadPercent < 30) return { label: 'Low', color: 'green' };
  if (loadPercent < 60) return { label: 'Moderate', color: 'yellow' };
  if (loadPercent < 85) return { label: 'Busy', color: 'orange' };
  return { label: 'Very Busy', color: 'red' };
}

/**
 * Parse pagination params from URL search params
 */
export function parsePagination(searchParams: URLSearchParams): {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
} {
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '20')));
  const sortBy = searchParams.get('sortBy') ?? undefined;
  const sortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc') ?? undefined;
  const search = searchParams.get('search') ?? undefined;
  return { page, limit, sortBy, sortOrder, search };
}

/**
 * Calculate tax amount
 */
export function calculateTax(subtotal: number, taxRate = 5): number {
  return Math.round((subtotal * taxRate) / 100 * 100) / 100;
}

/**
 * Mask phone number for display
 */
export function maskPhone(phone: string): string {
  if (!phone || phone.length < 4) return phone;
  return `${phone.slice(0, -4).replace(/\d/g, '*')}${phone.slice(-4)}`;
}

/**
 * Mask email for display
 */
export function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!local || !domain) return email;
  const visible = local.slice(0, 2);
  const masked = '*'.repeat(Math.max(0, local.length - 2));
  return `${visible}${masked}@${domain}`;
}

/**
 * Validate Indian phone number
 */
export function isValidIndianPhone(phone: string): boolean {
  return /^\+91\d{10}$/.test(phone);
}

/**
 * Get greeting based on time
 */
export function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  if (hour < 21) return 'Good Evening';
  return 'Good Night';
}

/**
 * Chunk array into batches
 */
export function chunkArray<T>(arr: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    chunks.push(arr.slice(i, i + chunkSize));
  }
  return chunks;
}

/**
 * Sleep / delay
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}
