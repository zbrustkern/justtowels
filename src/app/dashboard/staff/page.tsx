'use client';

import { StaffTable } from '@/components/staff/staff-table';
import { AddStaffDialog } from '@/components/staff/add-staff-dialog';
import { useStaff } from '@/lib/hooks/useStaff';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function StaffPage() {
  const { staff } = useStaff();

  const staffStats = {
    total: staff.length,
    active: staff.filter(s => s.status === 'active').length,
    housekeeping: staff.filter(s => s.role === 'housekeeping').length,
    frontDesk: staff.filter(s => s.role === 'front_desk').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Staff Management</h1>
        <AddStaffDialog />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{staffStats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{staffStats.active}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Housekeeping</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{staffStats.housekeeping}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Front Desk</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{staffStats.frontDesk}</p>
          </CardContent>
        </Card>
      </div>

      <StaffTable />
    </div>
  );
}