export type NotificationType = 'request' | 'checkin' | 'checkout' | 'maintenance' | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: Date;
  readAt?: Date;
  recipientRoles: string[];
  propertyId: string;
  relatedId?: string; // ID of related request/room/etc
}