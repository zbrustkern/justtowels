'use client';

import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc, updateDoc, doc, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase-client';
import { Room } from '@/types/room';

export function useRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'rooms'), orderBy('number'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const roomData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        lastCleaned: doc.data().lastCleaned?.toDate(),
        currentGuest: doc.data().currentGuest ? {
          ...doc.data().currentGuest,
          checkIn: doc.data().currentGuest.checkIn.toDate(),
          checkOut: doc.data().currentGuest.checkOut.toDate(),
        } : undefined,
      })) as Room[];
      
      setRooms(roomData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateRoom = async (id: string, updates: Partial<Room>) => {
    await updateDoc(doc(db, 'rooms', id), updates);
  };

  const addRoom = async (room: Omit<Room, 'id'>) => {
    await addDoc(collection(db, 'rooms'), room);
  };

  return { rooms, loading, updateRoom, addRoom };
}