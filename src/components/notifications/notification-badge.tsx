'use client';

import { useNotifications } from '@/lib/hooks/useNotifications';
import { Badge } from '@/components/ui/badge';

interface NotificationBadgeProps {
  children: React.ReactNode;
}

export function NotificationBadge({ children }: NotificationBadgeProps) {
  const { unreadCount } = useNotifications();

  return (
    <div className="relative inline-flex">
      {children}
      {unreadCount > 0 && (
        <Badge 
          variant="destructive" 
          className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0"
        >
          {unreadCount}
        </Badge>
      )}
    </div>
  );
}
