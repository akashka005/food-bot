/**
 * Dynamic Wait Time Prediction Engine
 */
export function estimateWaitingTime(
  queueLength: number,
  kitchenCapacity: number,
  avgPrepTimeMinutes: number,
  vendorPerformanceFactor: number = 1.0,
  isRushHour: boolean = false
): { waitMinutes: number; confidence: number } {
  // If queue is empty, wait is just the average prep time
  if (queueLength === 0) {
    return {
      waitMinutes: Math.round(avgPrepTimeMinutes * vendorPerformanceFactor),
      confidence: 0.95,
    };
  }

  // How many batches of food need to be cooked before this order starts?
  // Capacity = concurrent orders handled by kitchen
  const batchesNeeded = Math.floor(queueLength / kitchenCapacity);
  
  let baseWait = (batchesNeeded * avgPrepTimeMinutes) + avgPrepTimeMinutes;
  
  // Apply vendor performance factor (e.g. 1.2 = 20% slower than average)
  baseWait = baseWait * vendorPerformanceFactor;
  
  // Apply rush hour penalty
  if (isRushHour) {
    baseWait = baseWait * 1.3;
  }

  const roundedWait = Math.round(baseWait);
  
  // Calculate confidence score based on queue length (longer queue = less confidence)
  let confidence = 0.9 - (queueLength * 0.01);
  if (isRushHour) confidence -= 0.1;
  
  // Bound confidence between 0.4 and 0.95
  confidence = Math.max(0.4, Math.min(0.95, confidence));

  return {
    waitMinutes: roundedWait,
    confidence: Number(confidence.toFixed(2)),
  };
}
