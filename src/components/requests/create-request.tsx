// src/components/requests/create-request.tsx
'use client';

import { RequestType } from '@/types/request';
import { useState } from 'react';
import { useRequests } from '@/lib/hooks/useRequests';
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
import { Textarea } from '@/components/ui/textarea';
import { notifyNewRequest } from '@/lib/services/notification';
import { useAuth } from '@/context/auth-context';

export function CreateRequest() {
  const { userData } = useAuth();
  const [open, setOpen] = useState(false);
  const { createRequest } = useRequests();
  const [formData, setFormData] = useState<{
    roomNumber: string;
    type: RequestType;
    description: string;
    guestName: string;
  }>({
    roomNumber: '',
    type: 'towels',
    description: '',
    guestName: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const request = await createRequest({
      ...formData,
      status: 'pending',
    });
    if (userData?.propertyId) {
      await notifyNewRequest(request, userData.propertyId);
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>New Request</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Service Request</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Room Number"
              value={formData.roomNumber}
              onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
              required
            />
          </div>
          <div>
            <Select
              value={formData.type}
              onValueChange={(value: RequestType) => setFormData({ ...formData, type: value })}            >
              <SelectTrigger>
                <SelectValue placeholder="Request Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="towels">Towels</SelectItem>
                <SelectItem value="cleaning">Cleaning</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="amenities">Amenities</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Input
              placeholder="Guest Name"
              value={formData.guestName}
              onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
            />
          </div>
          <div>
            <Textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <Button type="submit" className="w-full">Create Request</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}