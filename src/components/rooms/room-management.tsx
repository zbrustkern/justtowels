import React, { useState } from 'react';
import { useRooms } from '@/lib/hooks/useRooms';
import { AddRoomDialog } from './add-room-dialog';
import { RoomCard } from './room-card';
import { RoomFilters } from './room-filters';
import { RoomDetails } from './room-details';
import { CheckInDialog, CheckOutDialog } from './room-actions';
import { Room, RoomStatus, RoomType } from '@/types/room';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,  
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, Bed, Users, Brush } from 'lucide-react';

export function RoomManagement() {
  const { rooms, updateRoom } = useRooms();
  const [filters, setFilters] = useState({
    status: 'all' as RoomStatus | 'all',
    type: 'all' as RoomType | 'all',
    floor: 'all',
    search: '',
  });
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isCheckOutOpen, setIsCheckOutOpen] = useState(false);
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);

  // Filter rooms based on current filters
  const filteredRooms = rooms.filter(room => {
    if (filters.status !== 'all' && room.status !== filters.status) return false;
    if (filters.type !== 'all' && room.type !== filters.type) return false;
    if (filters.floor !== 'all' && room.floor !== parseInt(filters.floor)) return false;
    if (filters.search && !room.number.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  // Group rooms by status for dashboard view
  const vacantRooms = rooms.filter(room => room.status === 'vacant');
  const occupiedRooms = rooms.filter(room => room.status === 'occupied');
  const cleaningRooms = rooms.filter(room => room.status === 'cleaning');
  const maintenanceRooms = rooms.filter(room => room.status === 'maintenance');

  // Room stats
  const stats = {
    total: rooms.length,
    occupied: occupiedRooms.length,
    vacant: vacantRooms.length,
    cleaning: cleaningRooms.length,
    maintenance: maintenanceRooms.length,
    occupancyRate: rooms.length ? Math.round((occupiedRooms.length / rooms.length) * 100) : 0
  };

  const handleCheckIn = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (room) {
      setSelectedRoom(room);
      setIsCheckInOpen(true);
    }
  };

  const handleCheckOut = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (room) {
      setSelectedRoom(room);
      setIsCheckOutOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Occupancy Rate: {stats.occupancyRate}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupied</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.occupied}</div>
            <p className="text-xs text-muted-foreground">
              Available: {stats.vacant}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cleaning</CardTitle>
            <Brush className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.cleaning}</div>
          </CardContent>
        </Card>
        <Card className="flex items-center justify-center">
          <Button 
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setIsAddRoomOpen(true)}
          >
            <PlusCircle className="h-4 w-4" />
            Add New Room
          </Button>
        </Card>
      </div>

      {/* Room Management Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Rooms</TabsTrigger>
          <TabsTrigger value="occupied">Occupied</TabsTrigger>
          <TabsTrigger value="vacant">Vacant</TabsTrigger>
          <TabsTrigger value="cleaning">Cleaning</TabsTrigger>
        </TabsList>

        <div className="flex items-center gap-4">
          <RoomFilters filters={filters} onFilterChange={(key, value) => 
            setFilters(prev => ({ ...prev, [key]: value }))
          } />
        </div>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredRooms.map(room => (
              <RoomCard
                key={room.id}
                room={room}
                onCheckIn={handleCheckIn}
                onCheckOut={handleCheckOut}
                onStatusUpdate={(roomId, status) => updateRoom(roomId, { status })}
                onViewDetails={(roomId) => setSelectedRoom(rooms.find(r => r.id === roomId) || null)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="occupied" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {occupiedRooms.map(room => (
              <RoomCard
                key={room.id}
                room={room}
                onCheckIn={handleCheckIn}
                onCheckOut={handleCheckOut}
                onStatusUpdate={(roomId, status) => updateRoom(roomId, { status })}
                onViewDetails={(roomId) => setSelectedRoom(rooms.find(r => r.id === roomId) || null)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="vacant" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {vacantRooms.map(room => (
              <RoomCard
                key={room.id}
                room={room}
                onCheckIn={handleCheckIn}
                onCheckOut={handleCheckOut}
                onStatusUpdate={(roomId, status) => updateRoom(roomId, { status })}
                onViewDetails={(roomId) => setSelectedRoom(rooms.find(r => r.id === roomId) || null)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="cleaning" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {cleaningRooms.map(room => (
              <RoomCard
                key={room.id}
                room={room}
                onCheckIn={handleCheckIn}
                onCheckOut={handleCheckOut}
                onStatusUpdate={(roomId, status) => updateRoom(roomId, { status })}
                onViewDetails={(roomId) => setSelectedRoom(rooms.find(r => r.id === roomId) || null)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <AddRoomDialog 
        open={isAddRoomOpen} 
        onOpenChange={setIsAddRoomOpen} 
      />
      
      {selectedRoom && (
        <>
          <CheckInDialog
            room={selectedRoom}
            open={isCheckInOpen}
            onOpenChange={setIsCheckInOpen}
            onCheckIn={async (guestData) => {
              await updateRoom(selectedRoom.id, {
                status: 'occupied',
                currentGuest: guestData
              });
            }}
          />
          <CheckOutDialog
            room={selectedRoom}
            open={isCheckOutOpen}
            onOpenChange={setIsCheckOutOpen}
            onCheckOut={async () => {
              await updateRoom(selectedRoom.id, {
                status: 'cleaning',
                currentGuest: undefined
              });
            }}
          />
          <RoomDetails
            room={selectedRoom}
            open={selectedRoom !== null}
            onOpenChange={(open) => !open && setSelectedRoom(null)}
          />
        </>
      )}
    </div>
  );
}