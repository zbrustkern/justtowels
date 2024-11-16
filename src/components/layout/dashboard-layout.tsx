'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { Hotel, Users, BellRing, LogOut, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NotificationDrawer } from '@/components/notifications/notification-drawer';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { signOut, userData } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden fixed top-4 left-4 z-50"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </Button>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-[240px] bg-white shadow-sm
          transform transition-transform duration-200 ease-in-out
          lg:transform-none
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Just Towels</h2>
            <NotificationDrawer />
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <Link
              href="/dashboard"
              className="flex items-center p-2 text-gray-700 rounded hover:bg-gray-100"
              onClick={() => setIsSidebarOpen(false)}
            >
              <Hotel className="w-5 h-5 mr-3" />
              Property
            </Link>
            <Link
              href="/dashboard/requests"
              className="flex items-center p-2 text-gray-700 rounded hover:bg-gray-100"
              onClick={() => setIsSidebarOpen(false)}
            >
              <BellRing className="w-5 h-5 mr-3" />
              Requests
            </Link>
            {userData?.role === 'admin' && (
              <Link
                href="/dashboard/staff"
                className="flex items-center p-2 text-gray-700 rounded hover:bg-gray-100"
                onClick={() => setIsSidebarOpen(false)}
              >
                <Users className="w-5 h-5 mr-3" />
                Staff
              </Link>
            )}
          </nav>

          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className="w-full flex items-center justify-center"
              onClick={() => {
                setIsSidebarOpen(false);
                signOut();
              }}
            >
              <LogOut className="w-5 h-5 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-[240px]">
        <div className="p-4 md:p-6 pt-16 lg:pt-6 max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}