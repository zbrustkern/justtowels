'use client';

import { useAuth } from '@/context/auth-context';
import type { UserRole } from '@/context/auth-context';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  redirectTo?: string;
}

export function RoleProtectedRoute({ 
  children, 
  allowedRoles,
  redirectTo = '/auth/signin'
}: RoleProtectedRouteProps) {
  const { user, userData, loading, hasPermission } = useAuth();

  useEffect(() => {
    if (!loading && (!user || !hasPermission(allowedRoles))) {
      redirect(redirectTo);
    }
  }, [user, userData, loading, allowedRoles, redirectTo, hasPermission]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return hasPermission(allowedRoles) ? <>{children}</> : null;
}