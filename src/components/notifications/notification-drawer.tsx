'use client';

import { useNotifications } from '@/lib/hooks/useNotifications';
import { format } from 'date-fns';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { BellRing } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function NotificationDrawer() {
  const { notifications, unreadCount, markAsRead } = useNotifications();

  const handleNotificationClick = (notificationId: string) => {
    markAsRead(notificationId);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'request': return '🔔';
      case 'checkin': return '📥';
      case 'checkout': return '📤';
      case 'maintenance': return '🔧';
      default: return '📢';
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <BellRing className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border ${!notification.readAt ? 'bg-blue-50' : ''}`}
              onClick={() => handleNotificationClick(notification.id)}
            >
              <div className="flex gap-3">
                <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                <div className="flex-1">
                  <h4 className="font-medium">{notification.title}</h4>
                  <p className="text-sm text-gray-600">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {format(notification.createdAt, 'MMM d, h:mm a')}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {notifications.length === 0 && (
            <p className="text-center text-gray-500">No notifications</p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}