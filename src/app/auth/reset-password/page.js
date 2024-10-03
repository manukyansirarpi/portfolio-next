import * as React from 'react';

import { config } from '@/config';
import { AuthLayout } from '@/components/auth/auth-layout';
import { GuestGuard } from '@/components/auth/guest-guard';
import { ResetPasswordForm } from '@/components/auth/supabase/reset-password-form';

export const metadata = { title: `Reset password | Auth | ${config.site.name}` };

export default function Page() {
  return (
    <GuestGuard>
      <AuthLayout>
        <ResetPasswordForm />
      </AuthLayout>
    </GuestGuard>
  );
}
