'use client'

import React, { useState } from 'react';
import { useRooms } from '@/lib/hooks/useRooms';
import { useRequests } from '@/lib/hooks/useRequests';
import { useAuth } from '@/context/auth-context';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import type { Room } from '@/types/room';

const HousekeepingDashboard = () => {
  const { rooms, updateRoom } = useRooms();
  const { requests } = useRequests();
  const { userData } = useAuth();
  const [selectedFloor, setSelectedFloor] = useState<string>('all');

  // Filter rooms by status and floor
  const cleaningRooms = rooms.filter(room => 
    room.status === 'cleaning' &&
    (selectedFloor === 'all' || room.floor.toString() === selectedFloor)
  );

  const vacantRooms = rooms.filter(room => 
    room.status === 'vacant' &&
    (selectedFloor === 'all' || room.floor.toString() === selectedFloor)
  );

  const priorityRooms = rooms.filter(room => {
    const hasRequest = requests.some(
      req => req.roomNumber === room.number && 
      req.type === 'cleaning' && 
      req.status === 'pending'
    );
    return hasRequest && (selectedFloor === 'all' || room.floor.toString() === selectedFloor);
  });

  // Get unique floors for filter
  const floors = [...new Set(rooms.map(room => room.floor))].sort((a, b) => a - b);

  const handleCompleteRoom = async (roomId: string) => {
    await updateRoom(roomId, {
      status: 'vacant',
      lastCleaned: new Date()
    });
  };

  const getRoomPriorityLevel = (room: Room) => {
    if (room.status === 'cleaning') {
      const timeSinceCheckout = room.lastCleaned ? 
        Date.now() - new Date(room.lastCleaned).getTime() : 
        Infinity;
      return timeSinceCheckout > 3600000 ? 'high' : 'medium';
    }
    return 'low';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Housekeeping Dashboard</h2>
        <Select value={selectedFloor} onValueChange={setSelectedFloor}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Select floor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Floors</SelectItem>
            {floors.map((floor) => (
              <SelectItem key={floor} value={floor.toString()}>
                Floor {floor}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Rooms to Clean
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cleaningRooms.length}</div>
            <p className="text-xs text-muted-foreground">
              {priorityRooms.length} high priority
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Today
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {vacantRooms.filter(room => 
                room.lastCleaned && 
                new Date(room.lastCleaned).toDateString() === new Date().toDateString()
              ).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Time
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32m</div>
            <p className="text-xs text-muted-foreground">
              Per room today
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="cleaning" className="space-y-4">
        <TabsList>
          <TabsTrigger value="cleaning">Needs Cleaning</TabsTrigger>
          <TabsTrigger value="priority">Priority Rooms</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value="cleaning" className="space-y-4">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Room</TableHead>
                  <TableHead>Floor</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Last Cleaned</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cleaningRooms.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell className="font-medium">{room.number}</TableCell>
                    <TableCell>{room.floor}</TableCell>
                    <TableCell className="capitalize">{room.type}</TableCell>
                    <TableCell>
                      {room.lastCleaned ? format(room.lastCleaned, 'MMM d, h:mm a') : 'Never'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        getRoomPriorityLevel(room) === 'high' ? 'destructive' :
                        getRoomPriorityLevel(room) === 'medium' ? 'default' :
                        'secondary'
                      }>
                        {getRoomPriorityLevel(room)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCompleteRoom(room.id)}
                      >
                        Mark Complete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="priority">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Room</TableHead>
                  <TableHead>Floor</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Request Time</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {priorityRooms.map((room) => {
                  const request = requests.find(
                    req => req.roomNumber === room.number && 
                    req.type === 'cleaning'
                  );
                  return (
                    <TableRow key={room.id}>
                      <TableCell className="font-medium">{room.number}</TableCell>
                      <TableCell>{room.floor}</TableCell>
                      <TableCell className="capitalize">{room.type}</TableCell>
                      <TableCell>
                        {request && format(request.createdAt, 'MMM d, h:mm a')}
                      </TableCell>
                      <TableCell>{request?.description || '-'}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCompleteRoom(room.id)}
                        >
                          Mark Complete
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Room</TableHead>
                  <TableHead>Floor</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Completed At</TableHead>
                  <TableHead>Cleaned By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vacantRooms
                  .filter(room => room.lastCleaned)
                  .sort((a, b) => 
                    new Date(b.lastCleaned!).getTime() - new Date(a.lastCleaned!).getTime()
                  )
                  .map((room) => (
                    <TableRow key={room.id}>
                      <TableCell className="font-medium">{room.number}</TableCell>
                      <TableCell>{room.floor}</TableCell>
                      <TableCell className="capitalize">{room.type}</TableCell>
                      <TableCell>
                        {room.lastCleaned && format(room.lastCleaned, 'MMM d, h:mm a')}
                      </TableCell>
                      <TableCell>{userData?.name || 'Staff'}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HousekeepingDashboard;