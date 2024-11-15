'use client';

import { useState } from 'react';
import { Room } from '@/types/room';
import { useRooms } from '@/lib/hooks/useRooms';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { notifyCheckIn } from '@/lib/services/notification';
import { useAuth } from '@/context/auth-context';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { addDays } from 'date-fns';

interface CheckInDialogProps {
  room: Room;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CheckInDialog({ room, open, onOpenChange }: CheckInDialogProps) {
  const { userData } = useAuth();
  const { updateRoom } = useRooms();
  const [guestName, setGuestName] = useState('');
  const [checkIn, setCheckIn] = useState(new Date().toISOString().split('T')[0]);
  const [checkOut, setCheckOut] = useState(addDays(new Date(), 1).toISOString().split('T')[0]);

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateRoom(room.id, {
      status: 'occupied',
      currentGuest: {
        name: guestName,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut)
      }
    });
    if (userData?.propertyId) {
      await notifyCheckIn(room, guestName, userData.propertyId);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Check In - Room {room.number}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Guest Name"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm">Check In</label>
              <Input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm">Check Out</label>
              <Input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full">Check In Guest</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}