export type RoomStatus = 'vacant' | 'occupied' | 'cleaning' | 'maintenance';
export type RoomType = 'standard' | 'deluxe' | 'suite';

export interface MaintenanceRecord {
  date: Date;
  type: string;
  notes: string;
}

export interface Room {
  id: string;
  number: string;
  type: RoomType;
  status: RoomStatus;
  floor: number;
  currentGuest: {
    name: string;
    checkIn: Date;
    checkOut: Date;
  } | null | undefined;
  lastCleaned?: Date;
  lastOccupied?: Date;
  notes?: string;
  propertyId?: string;
  createdAt: Date;
  updatedAt: Date;
  maintenanceHistory?: MaintenanceRecord[];
  amenities?: string[];
  maxOccupancy?: number;
}