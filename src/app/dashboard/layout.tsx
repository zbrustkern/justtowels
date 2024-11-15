import { RoleProtectedRoute } from '@/components/auth/role-protected-route';
import { DashboardLayout } from '@/components/layout/dashboard-layout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <RoleProtectedRoute allowedRoles={['admin', 'front_desk', 'housekeeping', 'maintenance']}>
        <DashboardLayout>{children}</DashboardLayout>
    </RoleProtectedRoute>
  );
}