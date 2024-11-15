'use client';

import { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { useGuest } from '@/lib/hooks/useGuest';
import { useRequests } from '@/lib/hooks/useRequests';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RequestType } from '@/types/request';

export function GuestPortal() {
  const { user } = useAuth();
  const { guest } = useGuest(user?.email || '');
  const { requests, createRequest } = useRequests();
  const [newRequest, setNewRequest] = useState({
    type: 'towels' as RequestType,
    description: '',
  });

  const guestRequests = requests.filter(request => 
    request.roomNumber === guest?.roomNumber
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (guest) {
      await createRequest({
        ...newRequest,
        roomNumber: guest.roomNumber,
        status: 'pending',
        guestName: guest.name,
      });
      setNewRequest({ type: 'towels', description: '' });
    }
  };

  if (!guest) {
    return (
      <div className="text-center">
        <h2 className="text-xl font-semibold">No active reservation found</h2>
        <p className="text-gray-500">Please contact the front desk for assistance.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Stay</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><strong>Room:</strong> {guest.roomNumber}</p>
          <p><strong>Check In:</strong> {format(guest.checkIn, 'MMM d, yyyy')}</p>
          <p><strong>Check Out:</strong> {format(guest.checkOut, 'MMM d, yyyy')}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Request Service</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Select
              value={newRequest.type}
              onValueChange={(value: RequestType) => 
                setNewRequest({ ...newRequest, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="towels">Fresh Towels</SelectItem>
                <SelectItem value="cleaning">Room Cleaning</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="amenities">Additional Amenities</SelectItem>
              </SelectContent>
            </Select>
            <Textarea
              placeholder="Additional details..."
              value={newRequest.description}
              onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
            />
            <Button type="submit">Submit Request</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {guestRequests.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <p className="font-medium capitalize">{request.type}</p>
                  <p className="text-sm text-gray-500">
                    {format(request.createdAt, 'MMM d, h:mm a')}
                  </p>
                  {request.description && (
                    <p className="text-sm mt-1">{request.description}</p>
                  )}
                </div>
                <Badge variant="outline" className={
                  request.status === 'completed' ? 'bg-green-100' :
                  request.status === 'in-progress' ? 'bg-blue-100' :
                  'bg-yellow-100'
                }>
                  {request.status}
                </Badge>
              </div>
            ))}
            {guestRequests.length === 0 && (
              <p className="text-center text-gray-500">No requests yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}