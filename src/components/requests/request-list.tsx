// src/components/requests/request-list.tsx
'use client';

import { ServiceRequest } from '@/types/request';
import { useRequests } from '@/lib/hooks/useRequests';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

const statusColors = {
  'pending': 'bg-yellow-100 text-yellow-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  'completed': 'bg-green-100 text-green-800',
};

export function RequestList() {
  const { requests, updateRequest } = useRequests();

  const handleStatusUpdate = async (request: ServiceRequest, newStatus: ServiceRequest['status']) => {
    await updateRequest(request.id, { status: newStatus });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Room</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Guest</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((request) => (
          <TableRow key={request.id}>
            <TableCell>{request.roomNumber}</TableCell>
            <TableCell className="capitalize">{request.type}</TableCell>
            <TableCell>
              <Badge variant="outline" className={statusColors[request.status]}>
                {request.status}
              </Badge>
            </TableCell>
            <TableCell>{request.guestName}</TableCell>
            <TableCell>{formatDistanceToNow(request.createdAt)} ago</TableCell>
            <TableCell>
              {request.status === 'pending' && (
                <Button
                  size="sm"
                  onClick={() => handleStatusUpdate(request, 'in-progress')}
                >
                  Start
                </Button>
              )}
              {request.status === 'in-progress' && (
                <Button
                  size="sm"
                  onClick={() => handleStatusUpdate(request, 'completed')}
                >
                  Complete
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
