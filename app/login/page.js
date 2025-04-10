'use client';

export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import LoginForm from '../components/login/LoginForm.jsx';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center py-10">Loading login...</div>}>
      <LoginForm />
    </Suspense>
  );
}
