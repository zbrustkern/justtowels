// src/app/auth/signin/page.tsx
'use client';

import dynamic from 'next/dynamic';

const SignInForm = dynamic(() => import('@/components/auth/sign-in-form'), {
  ssr: false,
});

export default function SignInPage() {
  return <SignInForm />;
}