'use client';

import dynamic from 'next/dynamic';

const ResetPasswordForm = dynamic(() => import('@/components/auth/reset-password-form'), {
  ssr: false,
});

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}