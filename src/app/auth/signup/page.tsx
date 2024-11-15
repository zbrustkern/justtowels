// src/app/auth/signup/page.tsx
'use client';

import dynamic from 'next/dynamic';

const SignUpForm = dynamic(() => import('@/components/auth/signup-form'), {
  ssr: false,
});

export default function SignUpPage() {
  return <SignUpForm />;
}