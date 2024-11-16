// src/app/dashboard/layout.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { Hotel, Users, BellRing, LogOut, Menu, Bed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NotificationDrawer } from '@/components/notifications/notification-drawer';
import { RoleProtectedRoute } from '@/components/auth/role-protected-route';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleProtectedRoute allowedRoles={['admin', 'front_desk', 'housekeeping', 'maintenance']}>
      <DashboardContent>{children}</DashboardContent>
    </RoleProtectedRoute>
  );
}

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { signOut, userData } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        className="lg:hidden fixed top-4 left-4 z-20"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Sidebar */}
      <aside className={`w-64 bg-white shadow-sm ${isSidebarOpen ? '' : 'hidden lg:block'}`}>
        <div className="h-full flex flex-col">
          <div className="p-4">
            <h2 className="text-xl font-bold">Just Towels</h2>
            <NotificationDrawer />
          </div>
          
          <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard" className="flex items-center p-2 text-gray-700 rounded hover:bg-gray-100">
                <Hotel className="w-5 h-5 mr-3" />
                Overview
              </Link>
              <Link href="/dashboard/rooms" className="flex items-center p-2 text-gray-700 rounded hover:bg-gray-100">
                <Bed className="w-5 h-5 mr-3" />
                Rooms
              </Link>
              <Link href="/dashboard/requests" className="flex items-center p-2 text-gray-700 rounded hover:bg-gray-100">
                <BellRing className="w-5 h-5 mr-3" />
                Requests
              </Link>
            {(userData?.role === 'admin' || userData?.role === 'housekeeping') && (
              <Link href="/dashboard/housekeeping" className="flex items-center p-2 text-gray-700 rounded hover:bg-gray-100">
                <Bed className="w-5 h-5 mr-3" />
                Housekeeping
              </Link>
            )}
            {userData?.role === 'admin' && (
              <Link href="/dashboard/staff" className="flex items-center p-2 text-gray-700 rounded hover:bg-gray-100">
                <Users className="w-5 h-5 mr-3" />
                Staff
              </Link>
            )}
          </nav>

          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className="w-full flex items-center justify-center"
              onClick={() => signOut()}
            >
              <LogOut className="w-5 h-5 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}