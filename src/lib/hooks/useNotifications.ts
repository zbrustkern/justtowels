import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, limit, onSnapshot, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/auth-context';
import { Notification } from '@/types/notification';

export function useNotifications(limitCount = 50) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { userData } = useAuth();

  useEffect(() => {
    if (!userData?.role) return;

    const q = query(
      collection(db, 'notifications'),
      where('recipientRoles', 'array-contains', userData.role),
      where('propertyId', '==', userData.propertyId || ''),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        readAt: doc.data().readAt?.toDate(),
      })) as Notification[];
      
      setNotifications(notifs);
    });

    return () => unsubscribe();
  }, [userData?.role, userData?.propertyId, limitCount]);

  const markAsRead = async (notificationId: string) => {
    await updateDoc(doc(db, 'notifications', notificationId), {
      readAt: Timestamp.now()
    });
  };

  const unreadCount = notifications.filter(n => !n.readAt).length;

  return { notifications, unreadCount, markAsRead };
}