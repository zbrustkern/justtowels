'use client';

import { useRooms } from '@/lib/hooks/useRooms';
import { useRequests } from '@/lib/hooks/useRequests';
import { notifyRoomCleaned } from '@/lib/services/notification';
import { useAuth } from '@/context/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function HousekeepingTaskBoard() {
  const { userData } = useAuth();
  const { rooms, updateRoom } = useRooms();
  const { requests } = useRequests();

  const cleaningRooms = rooms.filter(room => room.status === 'cleaning');
  const towelRequests = requests.filter(
    request => request.status === 'pending' && request.type === 'towels'
  );

  const handleCompleteTask = async (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    await updateRoom(roomId, {
      status: 'vacant',
      lastCleaned: new Date()
    });
    if (userData?.propertyId && room) {
      await notifyRoomCleaned(room, userData.propertyId);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Rooms to Clean</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cleaningRooms.map(room => (
              <div key={room.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Room {room.number}</p>
                  <p className="text-sm text-gray-500">
                    Last Cleaned: {room.lastCleaned ? new Date(room.lastCleaned).toLocaleDateString() : 'Never'}
                  </p>
                </div>
                <Button onClick={() => handleCompleteTask(room.id)}>
                  Mark Clean
                </Button>
              </div>
            ))}
            {cleaningRooms.length === 0 && (
              <p className="text-center text-gray-500">No rooms need cleaning</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Towel Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {towelRequests.map(request => (
              <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Room {request.roomNumber}</p>
                  <p className="text-sm text-gray-500">
                    Guest: {request.guestName}
                  </p>
                  {request.description && (
                    <p className="text-sm mt-1">{request.description}</p>
                  )}
                </div>
                <Badge>Pending</Badge>
              </div>
            ))}
            {towelRequests.length === 0 && (
              <p className="text-center text-gray-500">No pending towel requests</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}