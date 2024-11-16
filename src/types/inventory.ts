// src/types/inventory.ts

export type InventoryCategory = 'toiletries' | 'cleaning' | 'linens' | 'amenities';
export type AdjustmentType = 'restock' | 'use' | 'waste' | 'adjustment';

export interface InventoryItem {
  id: string;
  name: string;
  category: InventoryCategory;
  currentStock: number;
  reorderPoint: number;
  unit: string;
  lastRestocked: Date;
  location: string;
  cost?: number;
  supplier?: string;
  notes?: string;
}

export interface StockAdjustment {
  id: string;
  itemId: string;
  type: AdjustmentType;
  quantity: number;
  timestamp: Date;
  adjustedBy: string;
  notes?: string;
  previousStock?: number;
  newStock?: number;
  cost?: number;
}

export interface InventoryAlert {
  id: string;
  itemId: string;
  type: 'low_stock' | 'expired' | 'overstock';
  message: string;
  createdAt: Date;
  isRead: boolean;
  severity: 'low' | 'medium' | 'high';
}

export interface InventoryReport {
  id: string;
  startDate: Date;
  endDate: Date;
  totalItems: number;
  lowStockItems: number;
  totalValue: number;
  adjustments: StockAdjustment[];
  generatedBy: string;
  generatedAt: Date;
}