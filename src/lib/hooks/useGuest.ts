'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Guest } from '@/types/guest';

export function useGuest(email: string) {
  const [guest, setGuest] = useState<Guest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuest = async () => {
      const q = query(
        collection(db, 'guests'),
        where('email', '==', email)
      );
      
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        setGuest({
          id: doc.id,
          ...doc.data(),
          checkIn: doc.data().checkIn.toDate(),
          checkOut: doc.data().checkOut.toDate(),
        } as Guest);
      }
      setLoading(false);
    };

    fetchGuest();
  }, [email]);

  return { guest, loading };
}