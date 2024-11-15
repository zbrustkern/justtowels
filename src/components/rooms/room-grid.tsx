'use client';

import { Room } from '@/types/room';
import { useRooms } from '@/lib/hooks/useRooms';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { RoomActions } from './room-actions';


const statusColors = {
  'vacant': 'bg-green-100 text-green-800',
  'occupied': 'bg-blue-100 text-blue-800',
  'cleaning': 'bg-yellow-100 text-yellow-800',
  'maintenance': 'bg-red-100 text-red-800',
};

export function RoomGrid() {
  const { rooms, updateRoom } = useRooms();

  const handleStatusUpdate = async (room: Room, newStatus: Room['status']) => {
    await updateRoom(room.id, { 
      status: newStatus,
      lastCleaned: newStatus === 'vacant' ? new Date() : room.lastCleaned
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {rooms.map((room) => (
        <Card key={room.id} className="relative">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle>Room {room.number}</CardTitle>
              <Badge variant="outline" className={statusColors[room.status]}>
                {room.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-gray-500">Floor {room.floor}</p>
            <p className="text-sm text-gray-500 capitalize">Type: {room.type}</p>
            {room.currentGuest && (
              <div className="space-y-1">
                <p className="text-sm font-medium">Guest: {room.currentGuest.name}</p>
                <p className="text-xs text-gray-500">
                  Check-in: {format(room.currentGuest.checkIn, 'MMM d, yyyy')}
                </p>
                <p className="text-xs text-gray-500">
                  Check-out: {format(room.currentGuest.checkOut, 'MMM d, yyyy')}
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="space-x-2">
          <RoomActions room={room} />
            {room.status === 'occupied' && (
              <Button size="sm" onClick={() => handleStatusUpdate(room, 'cleaning')}>
                Mark for Cleaning
              </Button>
            )}
            {room.status === 'cleaning' && (
              <Button size="sm" onClick={() => handleStatusUpdate(room, 'vacant')}>
                Mark Clean
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}