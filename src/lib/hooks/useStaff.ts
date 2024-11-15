'use client';

import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc, updateDoc, doc, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { StaffMember } from '@/types/staff';
import { Timestamp } from 'firebase/firestore';


export function useStaff() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'staff'), orderBy('name'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const staffData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        startDate: doc.data().startDate.toDate(),
        shifts: doc.data().shifts?.map((shift: { start: Timestamp; end: Timestamp }) => ({
          start: shift.start.toDate(),
          end: shift.end.toDate()
        }))
      })) as StaffMember[];
      
      setStaff(staffData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addStaffMember = async (member: Omit<StaffMember, 'id'>) => {
    await addDoc(collection(db, 'staff'), member);
  };

  const updateStaffMember = async (id: string, updates: Partial<StaffMember>) => {
    await updateDoc(doc(db, 'staff', id), updates);
  };

  return { staff, loading, addStaffMember, updateStaffMember };
}