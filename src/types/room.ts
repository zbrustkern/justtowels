export type RoomStatus = 'vacant' | 'occupied' | 'cleaning' | 'maintenance';
export type RoomType = 'standard' | 'deluxe' | 'suite';

export interface Room {
  id: string;
  number: string;
  type: RoomType;
  status: RoomStatus;
  floor: number;
  currentGuest?: {
    name: string;
    checkIn: Date;
    checkOut: Date;
  };
  lastCleaned?: Date;
  notes?: string;
}