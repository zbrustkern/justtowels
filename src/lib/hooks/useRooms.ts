import { useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  doc, 
  updateDoc, 
  addDoc, 
  query, 
  where,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase-client';
import { Room, RoomStatus, MaintenanceRecord } from '@/types/room';
import { useAuth } from '@/context/auth-context';

export function useRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const { userData } = useAuth();

  useEffect(() => {
    if (!userData?.propertyId) return;

    // Query rooms for the current property
    const roomsQuery = query(
      collection(db, 'rooms'),
      where('propertyId', '==', userData.propertyId)
    );

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(roomsQuery, (snapshot) => {
      // First convert the raw data to Room objects
      const updatedRooms = snapshot.docs.map(doc => {
        const data = doc.data();
        // Convert Firestore Timestamps to Dates
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
          lastCleaned: data.lastCleaned?.toDate(),
          lastOccupied: data.lastOccupied?.toDate(),
          currentGuest: data.currentGuest ? {
            ...data.currentGuest,
            checkIn: data.currentGuest.checkIn?.toDate(),
            checkOut: data.currentGuest.checkOut?.toDate(),
          } : null,
          maintenanceHistory: data.maintenanceHistory?.map((record: { date: Timestamp; type: string; notes: string }): MaintenanceRecord => ({
            ...record,
            date: record.date?.toDate(),
          })),
        } as Room;
      });

      // Process any automatic status transitions
      const processedRooms: Room[] = updatedRooms.map(room => {
        // Check if occupied room's checkout date has passed
        if (
          room.status === 'occupied' &&
          room.currentGuest &&
          new Date(room.currentGuest.checkOut) < new Date()
        ) {
          // Create processed room with updated status
          const processedRoom: Room = {
            ...room,
            status: 'cleaning' as RoomStatus,
            currentGuest: null,
            lastOccupied: new Date(),
          };

          // Automatically update in Firestore
          updateDoc(doc(db, 'rooms', room.id), {
            status: 'cleaning',
            currentGuest: null,
            lastOccupied: new Date()
          });

          // Create cleaning task
          addDoc(collection(db, 'cleaning-tasks'), {
            roomId: room.id,
            roomNumber: room.number,
            status: 'pending',
            createdAt: new Date(),
            priority: 'high',
            type: 'checkout',
            notes: `Checkout cleaning for room ${room.number}`
          });

          return processedRoom;
        }

        // Check if room has been in cleaning status for over 24 hours
        if (
          room.status === 'cleaning' &&
          room.lastOccupied &&
          (new Date().getTime() - room.lastOccupied.getTime()) > 24 * 60 * 60 * 1000
        ) {
          // Alert staff about delayed cleaning
          addDoc(collection(db, 'notifications'), {
            type: 'maintenance',
            title: 'Cleaning Delay Alert',
            message: `Room ${room.number} has been in cleaning status for over 24 hours`,
            createdAt: new Date(),
            recipientRoles: ['housekeeping', 'manager'],
            propertyId: userData.propertyId,
            relatedId: room.id
          });
        }

        return room;
      });

      setRooms(processedRooms);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userData?.propertyId]);

  const updateRoom = async (roomId: string, updates: Partial<Room>) => {
    if (!userData?.propertyId) return;

    const roomRef = doc(db, 'rooms', roomId);
    
    // Additional automation logic for status changes
    if (updates.status === 'cleaning') {
      // Create cleaning task when room status changes to cleaning
      await addDoc(collection(db, 'cleaning-tasks'), {
        roomId,
        roomNumber: rooms.find(r => r.id === roomId)?.number,
        status: 'pending',
        createdAt: new Date(),
        priority: 'high',
        type: updates.currentGuest ? 'checkout' : 'routine',
        notes: `Cleaning required for room ${rooms.find(r => r.id === roomId)?.number}`
      });
    }

    // Create maintenance record for maintenance status
    if (updates.status === 'maintenance') {
      await addDoc(collection(db, 'maintenance-records'), {
        roomId,
        type: 'inspection',
        status: 'scheduled',
        description: 'Room placed in maintenance status',
        scheduledDate: new Date(),
        priority: 'medium',
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    // Update the room document
    return updateDoc(roomRef, {
      ...updates,
      updatedAt: new Date()
    });
  };

  const addRoom = async (roomData: Omit<Room, 'id'>) => {
    if (!userData?.propertyId) return;

    return addDoc(collection(db, 'rooms'), {
      ...roomData,
      propertyId: userData.propertyId,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  };

  return {
    rooms,
    loading,
    updateRoom,
    addRoom
  };
}