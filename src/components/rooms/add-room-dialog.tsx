import { useState } from 'react';
import { useRooms } from '@/lib/hooks/useRooms';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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

interface AddRoomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddRoomDialog({ open, onOpenChange }: AddRoomDialogProps) {
  const { addRoom } = useRooms();
  const [formData, setFormData] = useState<Omit<Room, 'id'>>({
    number: '',
    type: 'standard',
    status: 'vacant',
    floor: 1,
    currentGuest: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    amenities: [],
    maxOccupancy: 2,
    maintenanceHistory: [],
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addRoom({
      ...formData,
      // Update timestamps at submission time
      createdAt: new Date(),
      updatedAt: new Date()
    });
    onOpenChange(false);
  };

  const handleMaxOccupancyChange = (value: string) => {
    const maxOccupancy = parseInt(value);
    if (!isNaN(maxOccupancy) && maxOccupancy > 0) {
      setFormData(prev => ({ ...prev, maxOccupancy }));
    }
  };

  const handleAmenitiesChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: value.split(',').map(item => item.trim()).filter(Boolean)
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Room</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Room Number"
              value={formData.number}
              onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
              required
            />
          </div>
          <div>
            <Input
              type="number"
              placeholder="Floor"
              value={formData.floor}
              onChange={(e) => setFormData(prev => ({ ...prev, floor: parseInt(e.target.value) }))}
              required
            />
          </div>
          <div>
            <Select
              value={formData.type}
              onValueChange={(value: RoomType) => setFormData(prev => ({ ...prev, type: value }))}
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
          <div>
            <Input
              type="number"
              placeholder="Maximum Occupancy"
              value={formData.maxOccupancy}
              onChange={(e) => handleMaxOccupancyChange(e.target.value)}
              required
            />
          </div>
          <div>
            <Input
              placeholder="Amenities (comma-separated)"
              value={formData.amenities?.join(', ')}
              onChange={(e) => handleAmenitiesChange(e.target.value)}
            />
          </div>
          <div>
            <Input
              placeholder="Notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            />
          </div>
          <Button type="submit" className="w-full">Add Room</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}