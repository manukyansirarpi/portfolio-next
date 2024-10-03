import * as React from 'react';

import { config } from '@/config';
import { AuthLayout } from '@/components/auth/auth-layout';
import { GuestGuard } from '@/components/auth/guest-guard';
import { SignInForm } from '@/components/auth/supabase/sign-in-form';

export const metadata = { title: `Sign in | Auth | ${config.site.name}` };

export default function Page() {
  return (
    <GuestGuard>
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </GuestGuard>
  );
}
