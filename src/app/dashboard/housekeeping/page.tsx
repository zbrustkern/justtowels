// src/app/dashboard/housekeeping/page.tsx
import { Metadata } from 'next';
import HousekeepingDashboard from '@/components/staff/housekeeping/housekeeping-dashboard';
import HousekeepingInventory from '@/components/staff/housekeeping/housekeeping-inventory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const metadata: Metadata = {
  title: 'Housekeeping Management',
  description: 'Manage housekeeping tasks and inventory',
};

export default function HousekeepingPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Housekeeping</h2>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="space-y-4">
          <HousekeepingDashboard />
        </TabsContent>
        <TabsContent value="inventory" className="space-y-4">
          <HousekeepingInventory />
        </TabsContent>
      </Tabs>
    </div>
  );
}