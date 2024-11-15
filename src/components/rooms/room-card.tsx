'use client';

import { Room } from '@/types/room';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Clock, User, Bed, ClipboardList } from 'lucide-react';

interface RoomCardProps {
  room: Room;
  onStatusUpdate: (roomId: string, status: Room['status']) => void;
  onCheckIn: (roomId: string) => void;
  onCheckOut: (roomId: string) => void;
  onViewDetails: (roomId: string) => void;
}

const statusColors = {
  vacant: 'bg-green-100 text-green-800',
  occupied: 'bg-blue-100 text-blue-800',
  cleaning: 'bg-yellow-100 text-yellow-800',
  maintenance: 'bg-red-100 text-red-800',
};

export function RoomCard({ 
  room, 
  onStatusUpdate, 
  onCheckIn, 
  onCheckOut,
  onViewDetails 
}: RoomCardProps) {
  return (
    <Card className="relative">
      <CardHeader className="flex flex-row justify-between items-start pb-2">
        <div>
          <h3 className="text-lg font-bold">Room {room.number}</h3>
          <p className="text-sm text-gray-500 capitalize">{room.type}</p>
        </div>
        <Badge variant="outline" className={statusColors[room.status]}>
          {room.status}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-2">
        {room.currentGuest && (
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-sm">
              <User className="h-4 w-4" />
              <span>{room.currentGuest.name}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Until {format(room.currentGuest.checkOut, 'MMM d')}</span>
            </div>
          </div>
        )}
        
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Bed className="h-4 w-4" />
          <span>Floor {room.floor}</span>
        </div>
        
        {room.lastCleaned && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="flex items-center space-x-2 text-sm text-gray-500">
                <ClipboardList className="h-4 w-4" />
                <span>Last cleaned</span>
              </TooltipTrigger>
              <TooltipContent>
                <p>{format(room.lastCleaned, 'MMM d, h:mm a')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </CardContent>
      <CardFooter className="gap-2">
        {room.status === 'vacant' && (
          <Button size="sm" onClick={() => onCheckIn(room.id)}>
            Check In
          </Button>
        )}
        {room.status === 'occupied' && (
          <Button size="sm" variant="secondary" onClick={() => onCheckOut(room.id)}>
            Check Out
          </Button>
        )}
        {room.status === 'cleaning' && (
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onStatusUpdate(room.id, 'vacant')}
          >
            Mark Clean
          </Button>
        )}
        <Button 
          size="sm" 
          variant="ghost"
          onClick={() => onViewDetails(room.id)}
        >
          Details
        </Button>
      </CardFooter>
    </Card>
  );
}