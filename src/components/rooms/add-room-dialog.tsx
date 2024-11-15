'use client';

import { useState } from 'react';
import { useRooms } from '@/lib/hooks/useRooms';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Room, RoomType } from '@/types/room';

export function AddRoomDialog() {
  const [open, setOpen] = useState(false);
  const { addRoom } = useRooms();
  const [formData, setFormData] = useState<Omit<Room, 'id'>>({
    number: '',
    type: 'standard',
    status: 'vacant',
    floor: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addRoom(formData);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Room</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Room</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Room Number"
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: e.target.value })}
              required
            />
          </div>
          <div>
            <Input
              type="number"
              placeholder="Floor"
              value={formData.floor}
              onChange={(e) => setFormData({ ...formData, floor: parseInt(e.target.value) })}
              required
            />
          </div>
          <div>
            <Select
              value={formData.type}
              onValueChange={(value: RoomType) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Room Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="deluxe">Deluxe</SelectItem>
                <SelectItem value="suite">Suite</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">Add Room</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
