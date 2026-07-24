import { OrderSummary } from '@smartfood/shared';

export interface PriorityOrder extends OrderSummary {
  priorityScore: number;
}

/**
 * Min-Heap implementation for Priority Queue
 */
export class OrderMinHeap {
  private heap: PriorityOrder[] = [];

  constructor(orders: PriorityOrder[] = []) {
    this.heap = [];
    orders.forEach((order) => this.insert(order));
  }

  private getParentIndex(i: number): number {
    return Math.floor((i - 1) / 2);
  }

  private getLeftChildIndex(i: number): number {
    return 2 * i + 1;
  }

  private getRightChildIndex(i: number): number {
    return 2 * i + 2;
  }

  private swap(i: number, j: number): void {
    const temp = this.heap[i];
    if (temp && this.heap[j]) {
      this.heap[i] = this.heap[j]!;
      this.heap[j] = temp;
    }
  }

  private siftUp(i: number): void {
    let current = i;
    while (
      current > 0 &&
      this.heap[current]!.priorityScore < this.heap[this.getParentIndex(current)]!.priorityScore
    ) {
      this.swap(current, this.getParentIndex(current));
      current = this.getParentIndex(current);
    }
  }

  private siftDown(i: number): void {
    let current = i;
    const left = this.getLeftChildIndex(i);
    const right = this.getRightChildIndex(i);

    if (
      left < this.heap.length &&
      this.heap[left]!.priorityScore < this.heap[current]!.priorityScore
    ) {
      current = left;
    }

    if (
      right < this.heap.length &&
      this.heap[right]!.priorityScore < this.heap[current]!.priorityScore
    ) {
      current = right;
    }

    if (current !== i) {
      this.swap(i, current);
      this.siftDown(current);
    }
  }

  public insert(order: PriorityOrder): void {
    this.heap.push(order);
    this.siftUp(this.heap.length - 1);
  }

  public extractMin(): PriorityOrder | null {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop() ?? null;

    const root = this.heap[0];
    const last = this.heap.pop();
    if (last) {
      this.heap[0] = last;
      this.siftDown(0);
    }

    return root ?? null;
  }

  public peek(): PriorityOrder | null {
    return this.heap.length > 0 ? (this.heap[0] ?? null) : null;
  }

  public size(): number {
    return this.heap.length;
  }

  public getArray(): PriorityOrder[] {
    return [...this.heap];
  }
}
