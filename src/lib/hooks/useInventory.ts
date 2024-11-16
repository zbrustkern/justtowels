// src/lib/hooks/useInventory.ts

import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  doc,
  updateDoc,
  addDoc,
  serverTimestamp,
  getDocs
} from 'firebase/firestore';
import { db } from '@/lib/firebase-client';
import { useAuth } from '@/context/auth-context';
import type { 
  InventoryItem, 
  StockAdjustment,
  AdjustmentType 
} from '@/types/inventory';

export function useInventory() {
  const { userData } = useAuth();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userData?.propertyId) return;

    setLoading(true);
    const inventoryRef = collection(db, 'properties', userData.propertyId, 'inventory');
    const inventoryQuery = query(inventoryRef, orderBy('name'));

    const unsubscribe = onSnapshot(
      inventoryQuery,
      (snapshot) => {
        const items: InventoryItem[] = [];
        snapshot.forEach((doc) => {
          items.push({
            id: doc.id,
            ...doc.data() as Omit<InventoryItem, 'id'>
          });
        });
        setInventory(items);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching inventory:', error);
        setError('Failed to load inventory');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userData?.propertyId]);

  // Add a new inventory item
  const addInventoryItem = async (item: Omit<InventoryItem, 'id' | 'lastRestocked'>) => {
    if (!userData?.propertyId) return;

    try {
      const itemRef = collection(db, 'properties', userData.propertyId, 'inventory');
      await addDoc(itemRef, {
        ...item,
        lastRestocked: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error adding inventory item:', error);
      throw error;
    }
  };

  // Update an existing inventory item
  const updateInventoryItem = async (id: string, updates: Partial<InventoryItem>) => {
    if (!userData?.propertyId) return;

    try {
      const itemRef = doc(db, 'properties', userData.propertyId, 'inventory', id);
      await updateDoc(itemRef, updates);
    } catch (error) {
      console.error('Error updating inventory item:', error);
      throw error;
    }
  };

  // Record a stock adjustment
  const recordAdjustment = async (
    itemId: string,
    type: AdjustmentType,
    quantity: number,
    notes?: string
  ) => {
    if (!userData?.propertyId) return;

    try {
      // Get current item data
      const itemRef = doc(db, 'properties', userData.propertyId, 'inventory', itemId);
      const itemSnap = await getDocs(query(collection(db, 'properties', userData.propertyId, 'inventory'), where('id', '==', itemId)));
      const item = itemSnap.docs[0].data() as InventoryItem;

      // Calculate new stock level
      const previousStock = item.currentStock;
      const newStock = type === 'restock' 
        ? previousStock + quantity
        : previousStock - quantity;

      // Update item stock
      await updateDoc(itemRef, {
        currentStock: newStock,
        lastRestocked: type === 'restock' ? serverTimestamp() : item.lastRestocked
      });

      // Record adjustment
      const adjustmentRef = collection(db, 'properties', userData.propertyId, 'inventory-adjustments');
      await addDoc(adjustmentRef, {
        itemId,
        type,
        quantity,
        timestamp: serverTimestamp(),
        adjustedBy: userData.name,
        notes,
        previousStock,
        newStock
      });

      // Check if we need to create any alerts
      if (newStock <= item.reorderPoint) {
        const alertRef = collection(db, 'properties', userData.propertyId, 'inventory-alerts');
        await addDoc(alertRef, {
          itemId,
          type: 'low_stock',
          message: `${item.name} is running low (${newStock} ${item.unit} remaining)`,
          createdAt: serverTimestamp(),
          isRead: false,
          severity: newStock <= item.reorderPoint / 2 ? 'high' : 'medium'
        });
      }
    } catch (error) {
      console.error('Error recording adjustment:', error);
      throw error;
    }
  };

  // Get recent adjustments for an item
  const getItemAdjustments = async (itemId: string) => {
    if (!userData?.propertyId) return [];

    try {
      const adjustmentsRef = collection(db, 'properties', userData.propertyId, 'inventory-adjustments');
      const adjustmentsQuery = query(
        adjustmentsRef,
        where('itemId', '==', itemId),
        orderBy('timestamp', 'desc'),
      );

      const snapshot = await getDocs(adjustmentsQuery);
      const adjustments: StockAdjustment[] = [];
      snapshot.forEach((doc) => {
        adjustments.push({
          id: doc.id,
          ...doc.data() as Omit<StockAdjustment, 'id'>
        });
      });

      return adjustments;
    } catch (error) {
      console.error('Error fetching adjustments:', error);
      throw error;
    }
  };

  return {
    inventory,
    loading,
    error,
    addInventoryItem,
    updateInventoryItem,
    recordAdjustment,
    getItemAdjustments,
  };
}