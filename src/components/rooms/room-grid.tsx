'use client';

import { useState } from 'react';
import { useRooms } from '@/lib/hooks/useRooms';
import { RoomFilters } from './room-filters';
import { RoomCard } from './room-card';
import { RoomDetails } from './room-details';
import { CheckInDialog, CheckOutDialog } from './room-actions';
import { Room, RoomStatus, RoomType } from '@/types/room';
import { Button } from '@/components/ui/button';
import { Grid, List } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { notifyCheckIn, notifyCheckOut } from '@/lib/services/notification';

export function RoomGrid() {
  const { rooms, loading, updateRoom } = useRooms();
  const { userData } = useAuth();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState({
    status: 'all' as RoomStatus | 'all',
    type: 'all' as RoomType | 'all',
    floor: 'all',
    search: '',
  });
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isCheckOutOpen, setIsCheckOutOpen] = useState(false);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredRooms = rooms.filter(room => {
    if (filters.status !== 'all' && room.status !== filters.status) return false;
    if (filters.type !== 'all' && room.type !== filters.type) return false;
    if (filters.floor !== 'all' && room.floor !== parseInt(filters.floor)) return false;
    if (filters.search && !room.number.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  const handleStatusUpdate = async (roomId: string, status: Room['status']) => {
    await updateRoom(roomId, {
      status,
      lastCleaned: status === 'vacant' ? new Date() : undefined
    });
  };

  const handleCheckIn = async (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (room) {
      setSelectedRoom(room);
      setIsCheckInOpen(true);
    }
  };

  const handleCheckOut = async (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (room) {
      setSelectedRoom(room);
      setIsCheckOutOpen(true);
    }
  };

  const handleCheckInSubmit = async (guestData: { name: string; checkIn: Date; checkOut: Date }) => {
    if (selectedRoom && userData?.propertyId) {
      await updateRoom(selectedRoom.id, {
        status: 'occupied',
        currentGuest: guestData
      });
      await notifyCheckIn(selectedRoom, guestData.name, userData.propertyId);
    }
  };

  const handleCheckOutSubmit = async () => {
    if (selectedRoom && userData?.propertyId) {
      await updateRoom(selectedRoom.id, {
        status: 'cleaning',
        currentGuest: undefined
      });
      await notifyCheckOut(selectedRoom, userData.propertyId);
    }
  };

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleViewDetails = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (room) {
      setSelectedRoom(room);
      setIsDetailsOpen(true);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <RoomFilters filters={filters} onFilterChange={handleFilterChange} />

      <div className={
        viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          : "space-y-4"
      }>
        {filteredRooms.map(room => (
          <RoomCard
            key={room.id}
            room={room}
            onStatusUpdate={handleStatusUpdate}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>

      {selectedRoom && (
        <>
          <CheckInDialog
            room={selectedRoom}
            open={isCheckInOpen}
            onOpenChange={setIsCheckInOpen}
            onCheckIn={handleCheckInSubmit}
          />
          <CheckOutDialog
            room={selectedRoom}
            open={isCheckOutOpen}
            onOpenChange={setIsCheckOutOpen}
            onCheckOut={handleCheckOutSubmit}
          />
          <RoomDetails
            room={selectedRoom}
            open={isDetailsOpen}
            onOpenChange={setIsDetailsOpen}
          />
        </>
      )}
    </div>
  );
}