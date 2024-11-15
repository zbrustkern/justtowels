'use client';

import { useState } from 'react';
import { Room } from '@/types/room';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/auth-context';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { addDays } from 'date-fns';
import { notifyCheckIn, notifyCheckOut } from '@/lib/services/notification';

interface CheckInDialogProps {
  room: Room;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCheckIn: (guestData: { name: string; checkIn: Date; checkOut: Date }) => Promise<void>;
}

export function CheckInDialog({ room, open, onOpenChange, onCheckIn }: CheckInDialogProps) {
  const [guestName, setGuestName] = useState('');
  const [checkIn, setCheckIn] = useState(new Date().toISOString().split('T')[0]);
  const [checkOut, setCheckOut] = useState(addDays(new Date(), 1).toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const { userData } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const guestData = {
        name: guestName,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut)
      };
      await onCheckIn(guestData);
      if (userData?.propertyId) {
        await notifyCheckIn(room, guestName, userData.propertyId);
      }
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Check In - Room {room.number}</DialogTitle>
          <DialogDescription>Enter guest details to complete check-in</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Guest Name"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Check In</label>
              <Input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Check Out</label>
              <Input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Processing...' : 'Complete Check In'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface CheckOutDialogProps {
  room: Room;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCheckOut: () => Promise<void>;
}

export function CheckOutDialog({ room, open, onOpenChange, onCheckOut }: CheckOutDialogProps) {
  const [loading, setLoading] = useState(false);
  const { userData } = useAuth();

  const handleCheckOut = async () => {
    setLoading(true);
    try {
      await onCheckOut();
      if (userData?.propertyId) {
        await notifyCheckOut(room, userData.propertyId);
      }
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Check Out</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to check out {room.currentGuest?.name} from Room {room.number}?
            The room will be marked for cleaning.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={loading} onClick={handleCheckOut}>
            {loading ? 'Processing...' : 'Confirm Check Out'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}