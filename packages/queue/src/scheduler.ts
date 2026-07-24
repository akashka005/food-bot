import { OrderSummary } from '@smartfood/shared';
import { OrderMinHeap, PriorityOrder } from './heap';

/**
 * Weighted Priority Scheduling Algorithm
 * Higher priority score = processed first (lower number in MinHeap)
 * 
 * Factors:
 * 1. Time since placed (older = higher priority)
 * 2. Preparation time (Shortest Job First element)
 * 3. Pickup slot proximity (Earliest Pickup First)
 */
export function calculatePriorityScore(
  order: OrderSummary,
  avgPrepTimeMinutes: number
): number {
  const now = new Date().getTime();
  const placedTime = new Date(order.createdAt).getTime();
  const minutesSincePlaced = Math.floor((now - placedTime) / 60000);

  // 1. Time weight (Negative, since older orders should have lower score/higher priority)
  const timeWeight = -(minutesSincePlaced * 2);

  // 2. Shortest Job First (SJF) component
  // We approximate job size using item count * average prep time
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const estimatedPrepMinutes = totalItems > 3 ? avgPrepTimeMinutes * 1.5 : avgPrepTimeMinutes;
  const sjfWeight = estimatedPrepMinutes;

  // 3. Earliest Pickup First
  let pickupWeight = 0;
  if (order.pickupSlot && order.pickupSlot.startTime) {
    // Basic conversion of HH:MM to minutes today
    const [hours, minutes] = order.pickupSlot.startTime.split(':').map(Number);
    const pickupMinutesToday = (hours || 0) * 60 + (minutes || 0);
    
    const currentNow = new Date();
    const currentMinutesToday = currentNow.getHours() * 60 + currentNow.getMinutes();
    
    const minutesToPickup = pickupMinutesToday - currentMinutesToday;
    
    // If pickup is very soon or passed, drastically lower the score (increase priority)
    if (minutesToPickup < 15) {
      pickupWeight = -50;
    } else if (minutesToPickup < 30) {
      pickupWeight = -20;
    } else {
      pickupWeight = minutesToPickup; 
    }
  }

  return timeWeight + sjfWeight + pickupWeight;
}

/**
 * Optimize the current queue using Min-Heap
 */
export function optimizeQueue(
  orders: OrderSummary[],
  avgPrepTimeMinutes: number
): PriorityOrder[] {
  const heap = new OrderMinHeap();

  orders.forEach((order) => {
    const score = calculatePriorityScore(order, avgPrepTimeMinutes);
    heap.insert({ ...order, priorityScore: score });
  });

  const sortedQueue: PriorityOrder[] = [];
  while (heap.size() > 0) {
    const min = heap.extractMin();
    if (min) {
      sortedQueue.push(min);
    }
  }

  // Add updated queue positions
  return sortedQueue.map((order, index) => ({
    ...order,
    queuePosition: index + 1,
  }));
}
