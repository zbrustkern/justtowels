'use client';

import { useState } from 'react';
import { useRooms } from '@/lib/hooks/useRooms';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckInDialog } from '@/components/rooms/check-in-dialog';

export function CheckInBoard() {
  const { rooms } = useRooms();
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [checkInDialogOpen, setCheckInDialogOpen] = useState(false);

  const vacantRooms = rooms.filter(room => room.status === 'vacant');
  const occupiedRooms = rooms.filter(room => room.status === 'occupied');

  return (
    <Tabs defaultValue="vacant" className="w-full">
      <TabsList>
        <TabsTrigger value="vacant">Available Rooms</TabsTrigger>
        <TabsTrigger value="occupied">Occupied Rooms</TabsTrigger>
      </TabsList>

      <TabsContent value="vacant">
        <Card>
          <CardHeader>
            <CardTitle>Available Rooms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vacantRooms.map(room => (
                <Card key={room.id} className="cursor-pointer hover:bg-gray-50" 
                  onClick={() => {
                    setSelectedRoom(room.id);
                    setCheckInDialogOpen(true);
                  }}>
                  <CardContent className="p-4">
                    <p className="font-medium">Room {room.number}</p>
                    <p className="text-sm text-gray-500 capitalize">{room.type}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="occupied">
        <Card>
          <CardHeader>
            <CardTitle>Occupied Rooms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {occupiedRooms.map(room => (
                <Card key={room.id}>
                  <CardContent className="p-4">
                    <p className="font-medium">Room {room.number}</p>
                    <p className="text-sm">{room.currentGuest?.name}</p>
                    <p className="text-sm text-gray-500">
                      Check-out: {room.currentGuest?.checkOut.toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {selectedRoom && (
        <CheckInDialog
          room={rooms.find(r => r.id === selectedRoom)!}
          open={checkInDialogOpen}
          onOpenChange={setCheckInDialogOpen}
        />
      )}
    </Tabs>
  );
}