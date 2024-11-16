'use client';

import { RoomManagement } from '@/components/rooms/room-management';
import { RoleProtectedRoute } from '@/components/auth/role-protected-route';

export default function RoomsPage() {
  return (
    <RoleProtectedRoute allowedRoles={['admin', 'manager', 'front_desk']}>
      <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Room Management</h2>
            <p className="text-muted-foreground">
              Manage all rooms and their current status
            </p>
          </div>
        </div>
        <RoomManagement />
      </div>
    </RoleProtectedRoute>
  );
}