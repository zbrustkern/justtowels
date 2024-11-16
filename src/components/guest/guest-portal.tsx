import React, { useState } from 'react';
import { useGuest } from '@/lib/hooks/useGuest';
import { useRequests } from '@/lib/hooks/useRequests';
import { useAuth } from '@/context/auth-context';
import { format } from 'date-fns';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Clock, 
  CalendarDays, 
  BellRing, 
  Plus,
  ClipboardCheck,
  MapPin,
  BedDouble,
  User
} from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { RequestType, ServiceRequest } from '@/types/request';
import { RequestDetailDialog } from './request-detail-dialog';

export function GuestPortal() {
  const { user } = useAuth();
  const { guest } = useGuest(user?.email || '');
  const { requests, createRequest } = useRequests();
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [newRequest, setNewRequest] = useState({
    type: 'towels' as RequestType,
    description: '',
  });

  const guestRequests = requests.filter(request => 
    request.roomNumber === guest?.roomNumber
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const handleQuickRequest = async (type: RequestType) => {
    if (guest) {
      await createRequest({
        type,
        roomNumber: guest.roomNumber,
        status: 'pending',
        guestName: guest.name,
      });
    }
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (guest) {
      await createRequest({
        ...newRequest,
        roomNumber: guest.roomNumber,
        status: 'pending',
        guestName: guest.name,
      });
      setIsRequestDialogOpen(false);
      setNewRequest({ type: 'towels', description: '' });
    }
  };

  if (!guest) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Welcome</CardTitle>
            <CardDescription className="text-center">
              No active reservation found. Please contact the front desk for assistance.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 pb-24 md:pb-4">
      {/* Stay Overview Card */}
      <Card className="relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-primary/10 to-transparent" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Welcome, {guest.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center gap-4">
            <BedDouble className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Room {guest.roomNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <CalendarDays className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Check-in</p>
              <p className="font-medium">{format(guest.checkIn, 'MMM d, yyyy')}</p>
            </div>
            <div className="mx-2 h-8 w-px bg-border" />
            <div>
              <p className="text-sm text-muted-foreground">Check-out</p>
              <p className="font-medium">{format(guest.checkOut, 'MMM d, yyyy')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Button
          variant="outline"
          className="flex h-24 flex-col items-center justify-center gap-2"
          onClick={() => handleQuickRequest('towels')}
        >
          <ClipboardCheck className="h-6 w-6" />
          <span className="text-xs">Request Towels</span>
        </Button>
        <Button
          variant="outline"
          className="flex h-24 flex-col items-center justify-center gap-2"
          onClick={() => handleQuickRequest('cleaning')}
        >
          <BedDouble className="h-6 w-6" />
          <span className="text-xs">Housekeeping</span>
        </Button>
        <Button
          variant="outline"
          className="flex h-24 flex-col items-center justify-center gap-2"
          onClick={() => handleQuickRequest('maintenance')}
        >
          <MapPin className="h-6 w-6" />
          <span className="text-xs">Maintenance</span>
        </Button>
        <Button
          variant="outline"
          className="flex h-24 flex-col items-center justify-center gap-2"
          onClick={() => handleQuickRequest('amenities')}
        >
          <Plus className="h-6 w-6" />
          <span className="text-xs">Amenities</span>
        </Button>
      </div>

      {/* Recent Requests */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BellRing className="h-5 w-5" />
            Recent Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {guestRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between rounded-lg border p-4 cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedRequest(request)}
                >
                  <div className="space-y-1">
                    <p className="font-medium capitalize">{request.type}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{format(request.createdAt, 'MMM d, h:mm a')}</span>
                    </div>
                    {request.description && (
                      <p className="text-sm mt-1">{request.description}</p>
                    )}
                  </div>
                  <Badge className={getStatusColor(request.status)}>
                    {request.status}
                  </Badge>
                </div>
              ))}
              {guestRequests.length === 0 && (
                <p className="text-center text-sm text-muted-foreground">
                  No recent requests
                </p>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Fixed Bottom Action Bar for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-background p-4 md:hidden">
        <Button 
          className="w-full" 
          onClick={() => setIsRequestDialogOpen(true)}
        >
          New Request
        </Button>
      </div>

      {/* New Request Dialog */}
      <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Service Request</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitRequest} className="space-y-4">
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
            <Button type="submit" className="w-full">Submit Request</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Request Detail Dialog */}
      {selectedRequest && (
        <RequestDetailDialog
          request={selectedRequest}
          open={selectedRequest !== null}
          onOpenChange={(open) => !open && setSelectedRequest(null)}
        />
      )}
    </div>
  );
}