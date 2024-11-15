'use client';

import { useAuth } from '@/context/auth-context';
import { HousekeepingTaskBoard } from '@/components/staff/housekeeping/task-board';
import { CheckInBoard } from '@/components/staff/front-desk/check-in-board';


export default function DashboardPage() {
  const { userData } = useAuth();

  if (userData?.role === 'housekeeping') {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Housekeeping Dashboard</h1>
        <HousekeepingTaskBoard />
      </div>
    );
  }

  if (userData?.role === 'front_desk') {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Front Desk Dashboard</h1>
        <CheckInBoard />
      </div>
    );
  }

  // Admin sees both
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Hotel Overview</h1>
      
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Front Desk</h2>
        <CheckInBoard />
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Housekeeping</h2>
        <HousekeepingTaskBoard />
      </div>
    </div>
  );
}