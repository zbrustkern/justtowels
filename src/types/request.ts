// src/types/request.ts
export type RequestStatus = 'pending' | 'in-progress' | 'completed';

export type RequestType = 'towels' | 'cleaning' | 'maintenance' | 'amenities';

export interface ServiceRequest {
  id: string;
  roomNumber: string;
  type: RequestType;
  status: RequestStatus;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string;
  guestName?: string;
}