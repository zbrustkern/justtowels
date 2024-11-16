'use client';

import { Room } from '@/types/room';
import { useRequests } from '@/lib/hooks/useRequests';
import { useMaintenance } from '@/lib/hooks/useMaintenance';
import { useState } from 'react';
import { format } from 'date-fns';
import { MaintenanceForm } from '@/components/maintenance/maintenance-form';
import { MaintenanceList } from '@/components/maintenance/maintenance-list';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MaintenanceRecord } from '@/types/maintenance';

interface RoomDetailsProps {
  room: Room;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RoomDetails({ room, open, onOpenChange }: RoomDetailsProps) {
  const { requests } = useRequests();
  const { records: maintenanceRecords, updateMaintenanceRecord, addMaintenanceRecord } = useMaintenance(room.id);
  const [isAddingMaintenance, setIsAddingMaintenance] = useState(false);

  // Filter requests for this room
  const roomRequests = requests.filter(request => request.roomNumber === room.number);

  const handleMaintenanceStatusUpdate = async (record: MaintenanceRecord, newStatus: MaintenanceRecord['status']) => {
    await updateMaintenanceRecord(record.id, {
      status: newStatus,
      completedDate: newStatus === 'completed' ? new Date() : undefined
    });
  };

  const handleMaintenanceSubmit = async (formData: Omit<MaintenanceRecord, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    await addMaintenanceRecord({
      ...formData,
      status: 'scheduled'
    });
    setIsAddingMaintenance(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[100vh] md:h-[80vh] p-0">
        <DialogHeader className="p-4 md:p-6 pb-2 md:pb-4">
          <DialogTitle className="text-xl md:text-2xl">Room {room.number} Details</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="info" className="h-[calc(100%-4rem)]">
          <TabsList className="px-4 md:px-6">
            <TabsTrigger value="info" className="flex-1 md:flex-none">Room Info</TabsTrigger>
            <TabsTrigger value="history" className="flex-1 md:flex-none">Requests</TabsTrigger>
            <TabsTrigger value="maintenance" className="flex-1 md:flex-none">Maintenance</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[calc(80vh-8rem)] mt-2">
            <TabsContent value="info" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Room Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Status</p>
                      <Badge variant="outline" className="mt-1">
                        {room.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Type</p>
                      <p className="text-sm capitalize">{room.type}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Floor</p>
                      <p className="text-sm">{room.floor}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Last Cleaned</p>
                      <p className="text-sm">
                        {room.lastCleaned 
                          ? format(room.lastCleaned, 'MMM d, yyyy h:mm a')
                          : 'Not recorded'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {room.currentGuest && (
                <Card>
                  <CardHeader>
                    <CardTitle>Current Guest</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Name</p>
                        <p className="text-sm">{room.currentGuest.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Check In</p>
                        <p className="text-sm">
                          {format(room.currentGuest.checkIn, 'MMM d, yyyy')}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Check Out</p>
                        <p className="text-sm">
                          {format(room.currentGuest.checkOut, 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Service Request History</CardTitle>
                  <CardDescription>Recent service requests for this room</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {roomRequests.map((request) => (
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
                        <Badge variant="outline">
                          {request.status}
                        </Badge>
                      </div>
                    ))}
                    {roomRequests.length === 0 && (
                      <p className="text-center text-gray-500">No service requests found</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="maintenance" className="space-y-4">
              <MaintenanceList 
                records={maintenanceRecords} 
                onStatusUpdate={handleMaintenanceStatusUpdate}
              />
              {!isAddingMaintenance ? (
                <Button onClick={() => setIsAddingMaintenance(true)}>
                  Schedule Maintenance
                </Button>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Schedule Maintenance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MaintenanceForm
                      roomId={room.id}
                      onSubmit={handleMaintenanceSubmit}
                      onCancel={() => setIsAddingMaintenance(false)}
                    />
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}