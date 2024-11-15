import { Timestamp } from 'firebase/firestore';
import { UserRole } from '@/context/auth-context';

export type AuthorizedSettingsRole = Extract<UserRole, 'admin' | 'manager'>;

export interface HotelSettings {
  name: string;
  address: string;
  phone: string;
  email: string;
  checkInTime: string;
  checkOutTime: string;
  enableAutoAssignment: boolean;
  enableGuestNotifications: boolean;
  enableMaintenanceAlerts: boolean;
  maxMaintenanceRequestsPerDay: number;
  cleaningBuffer: number;
  maintenanceStaffEmail: string;
  housekeepingStaffEmail: string;
}

// Type for data as it exists in Firestore
export interface FirestoreSettingsData extends Omit<HotelSettings, never> {
  updatedAt: Date | Timestamp;
}

// Type for data when reading from Firestore
export interface FirestoreSettingsDoc extends Omit<HotelSettings, never> {
  updatedAt: Timestamp;
}