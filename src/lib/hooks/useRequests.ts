'use client';

import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc, updateDoc, doc, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ServiceRequest } from '@/types/request';

export function useRequests() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'requests'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const requestData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as ServiceRequest[];
      
      setRequests(requestData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const createRequest = async (request: Omit<ServiceRequest, 'id' | 'createdAt' | 'updatedAt'>) => {
    const docRef = await addDoc(collection(db, 'requests'), {
      ...request,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return {
      id: docRef.id,
      ...request,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  };

  const updateRequest = async (id: string, updates: Partial<ServiceRequest>) => {
    await updateDoc(doc(db, 'requests', id), {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  };

  return { requests, loading, createRequest, updateRequest };
}