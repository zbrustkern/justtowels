// src/app/dashboard/housekeeping/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Housekeeping',
  description: 'Housekeeping management system',
};

export default function HousekeepingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}