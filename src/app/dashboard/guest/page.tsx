'use client';

import { GuestPortal } from '@/components/guest/guest-portal';
import { RoleProtectedRoute } from '@/components/auth/role-protected-route';

export default function GuestPage() {
  return (
    <RoleProtectedRoute allowedRoles={['guest']} redirectTo="/dashboard">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Guest Services</h1>
        <GuestPortal />
      </div>
    </RoleProtectedRoute>
  );
}