'use client';

import { notifyCheckOut } from '@/lib/services/notification';
import { useAuth } from '@/context/auth-context';
import { useState } from 'react';
import { Room } from '@/types/room';
import { useRooms } from '@/lib/hooks/useRooms';
import { Button } from '@/components/ui/button';
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
import { CheckInDialog } from './check-in-dialog';

interface RoomActionsProps {
  room: Room;
}

export function RoomActions({ room }: RoomActionsProps) {
  const { userData } = useAuth();
  const { updateRoom } = useRooms();
  const [checkInDialogOpen, setCheckInDialogOpen] = useState(false);
  const [checkOutDialogOpen, setCheckOutDialogOpen] = useState(false);

  const handleCheckOut = async () => {
    await updateRoom(room.id, {
      status: 'cleaning',
      currentGuest: undefined
    });
    if (userData?.propertyId) {
      await notifyCheckOut(room, userData.propertyId);
    }
    setCheckOutDialogOpen(false);
  };

  return (
    <div className="space-x-2">
      {room.status === 'vacant' && (
        <Button size="sm" onClick={() => setCheckInDialogOpen(true)}>
          Check In
        </Button>
      )}

      {room.status === 'occupied' && (
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setCheckOutDialogOpen(true)}
        >
          Check Out
        </Button>
      )}

      <CheckInDialog
        room={room}
        open={checkInDialogOpen}
        onOpenChange={setCheckInDialogOpen}
      />

      <AlertDialog open={checkOutDialogOpen} onOpenChange={setCheckOutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Check Out</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to check out {room.currentGuest?.name} from Room {room.number}?
              The room will be marked for cleaning.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleCheckOut}>Check Out</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}