// app/admin/settings/page.tsx
import { Metadata } from 'next';
import { SettingsDashboard } from '@/components/settings/settings-dashboard';

export const metadata: Metadata = {
  title: 'Settings | Just Towels',
  description: 'Hotel management system settings and configuration',
};

export default function SettingsPage() {
  return (
    <div className="container py-6">
      <SettingsDashboard />
    </div>
  );
}