'use client';

import { StaffMember } from '@/types/staff';
import { useStaff } from '@/lib/hooks/useStaff';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export function StaffTable() {
  const { staff, updateStaffMember } = useStaff();

  const handleStatusToggle = async (member: StaffMember) => {
    await updateStaffMember(member.id, {
      status: member.status === 'active' ? 'inactive' : 'active'
    });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Start Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {staff.map((member) => (
          <TableRow key={member.id}>
            <TableCell className="font-medium">{member.name}</TableCell>
            <TableCell className="capitalize">{member.role.replace('_', ' ')}</TableCell>
            <TableCell>{member.email}</TableCell>
            <TableCell>{member.phone || '-'}</TableCell>
            <TableCell>{format(member.startDate, 'MMM d, yyyy')}</TableCell>
            <TableCell>
              <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                {member.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleStatusToggle(member)}>
                    Toggle Status
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}