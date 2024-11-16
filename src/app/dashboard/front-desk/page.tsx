'use client';

import { RoleProtectedRoute } from '@/components/auth/role-protected-route';
import { CheckInBoard } from '@/components/staff/front-desk/check-in-board';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRooms } from '@/lib/hooks/useRooms';
import { Badge } from '@/components/ui/badge';
import { UserCheck, UserX, Loader2, Users } from 'lucide-react';

export default function FrontDeskPage() {
  const { rooms } = useRooms();

  // Calculate stats
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter(room => room.status === 'occupied').length;
  const expectedCheckouts = rooms.filter(room => {
    if (room.currentGuest && room.status === 'occupied') {
      const checkoutDate = new Date(room.currentGuest.checkOut);
      const today = new Date();
      return (
        checkoutDate.getDate() === today.getDate() &&
        checkoutDate.getMonth() === today.getMonth() &&
        checkoutDate.getFullYear() === today.getFullYear()
      );
    }
    return false;
  }).length;

  return (
    <RoleProtectedRoute allowedRoles={['admin', 'manager', 'front_desk']}>
      <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Front Desk</h2>
          <p className="text-muted-foreground">
            Manage check-ins, check-outs, and guest services
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Rooms
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRooms}</div>
              <p className="text-xs text-muted-foreground">
                {occupiedRooms} occupied
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Expected Checkouts
              </CardTitle>
              <UserX className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{expectedCheckouts}</div>
              <p className="text-xs text-muted-foreground">
                Today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Occupancy Rate
              </CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalRooms ? Math.round((occupiedRooms / totalRooms) * 100) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                Current occupancy
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Status
              </CardTitle>
              <Loader2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  {rooms.filter(r => r.status === 'vacant').length} Available
                </Badge>
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                  {rooms.filter(r => r.status === 'cleaning').length} Cleaning
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="checkin" className="space-y-4">
          <TabsList>
            <TabsTrigger value="checkin">Check In/Out Board</TabsTrigger>
            <TabsTrigger value="today">Today&apos;s Schedule</TabsTrigger>
          </TabsList>
          <TabsContent value="checkin">
            <Card>
              <CardHeader>
                <CardTitle>Check In/Out Management</CardTitle>
                <CardDescription>
                  Manage guest arrivals and departures
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CheckInBoard />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="today">
            <Card>
              <CardHeader>
                <CardTitle>Today&apos;s Schedule</CardTitle>
                <CardDescription>
                  Expected arrivals and departures for today
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Today's schedule content */}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </RoleProtectedRoute>
  );
}