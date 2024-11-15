import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { NotificationType } from '@/types/notification';
import { Room } from '@/types/room';
import { ServiceRequest } from '@/types/request';

export const createNotification = async ({
  type,
  title,
  message,
  recipientRoles,
  propertyId,
  relatedId
}: {
  type: NotificationType;
  title: string;
  message: string;
  recipientRoles: string[];
  propertyId: string;
  relatedId?: string;
}) => {
  await addDoc(collection(db, 'notifications'), {
    type,
    title,
    message,
    recipientRoles,
    propertyId,
    relatedId,
    createdAt: Timestamp.now(),
    readAt: null
  });
};

export const notifyNewRequest = async (request: ServiceRequest, propertyId: string) => {
  await createNotification({
    type: 'request',
    title: 'New Service Request',
    message: `Room ${request.roomNumber} requested ${request.type}`,
    recipientRoles: ['housekeeping', 'front_desk'],
    propertyId,
    relatedId: request.id
  });
};

export const notifyCheckIn = async (room: Room, guestName: string, propertyId: string) => {
  await createNotification({
    type: 'checkin',
    title: 'New Check-In',
    message: `${guestName} checked into Room ${room.number}`,
    recipientRoles: ['front_desk', 'housekeeping'],
    propertyId,
    relatedId: room.id
  });
};

export const notifyCheckOut = async (room: Room, propertyId: string) => {
  await createNotification({
    type: 'checkout',
    title: 'Room Ready for Cleaning',
    message: `Room ${room.number} has been checked out and needs cleaning`,
    recipientRoles: ['housekeeping'],
    propertyId,
    relatedId: room.id
  });
};

export const notifyRoomCleaned = async (room: Room, propertyId: string) => {
  await createNotification({
    type: 'maintenance',
    title: 'Room Cleaned',
    message: `Room ${room.number} has been cleaned and is ready for guests`,
    recipientRoles: ['front_desk'],
    propertyId,
    relatedId: room.id
  });
};