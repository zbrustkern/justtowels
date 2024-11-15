'use client';

import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  addDoc, 
  updateDoc, 
  doc, 
  Timestamp,
  onSnapshot,
  DocumentData,
  QuerySnapshot 
} from 'firebase/firestore';
import { db } from '@/lib/firebase-client';
import { MaintenanceRecord } from '@/types/maintenance';

export function useMaintenance(roomId?: string) {
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = roomId
      ? query(
          collection(db, 'maintenance'),
          where('roomId', '==', roomId),
          orderBy('scheduledDate', 'desc')
        )
      : query(
          collection(db, 'maintenance'),
          orderBy('scheduledDate', 'desc')
        );

    const unsubscribe = onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
      const maintenanceData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        scheduledDate: doc.data().scheduledDate.toDate(),
        completedDate: doc.data().completedDate?.toDate(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
      })) as MaintenanceRecord[];

      setRecords(maintenanceData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [roomId]);

  const addMaintenanceRecord = async (record: Omit<MaintenanceRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
    const docRef = await addDoc(collection(db, 'maintenance'), {
      ...record,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      scheduledDate: Timestamp.fromDate(record.scheduledDate),
      completedDate: record.completedDate ? Timestamp.fromDate(record.completedDate) : null,
    });
    return docRef.id;
  };

  const updateMaintenanceRecord = async (id: string, updates: Partial<MaintenanceRecord>) => {
    interface FirestoreUpdateData {
      [key: string]: string | number | boolean | Timestamp | null | undefined;
      updatedAt?: Timestamp;
      scheduledDate?: Timestamp;
      completedDate?: Timestamp;
    }
  
    // Convert the updates object to Firestore-compatible format
    const convertToFirestoreData = (updates: Partial<MaintenanceRecord>): FirestoreUpdateData => {
      const converted: FirestoreUpdateData = {};
      
      Object.entries(updates).forEach(([key, value]) => {
        if (value instanceof Date) {
          converted[key] = Timestamp.fromDate(value);
        } else {
          converted[key] = value;
        }
      });
  
      return converted;
    };
  
    const updateData: FirestoreUpdateData = {
      ...convertToFirestoreData(updates),
      updatedAt: Timestamp.now()
    };
  
    if (updates.scheduledDate) {
      updateData.scheduledDate = Timestamp.fromDate(updates.scheduledDate);
    }
    if (updates.completedDate) {
      updateData.completedDate = Timestamp.fromDate(updates.completedDate);
    }
  
    await updateDoc(doc(db, 'maintenance', id), updateData);
  };

  return {
    records,
    loading,
    addMaintenanceRecord,
    updateMaintenanceRecord,
  };
}