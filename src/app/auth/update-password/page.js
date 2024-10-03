import * as React from 'react';

import { config } from '@/config';
import { AuthGuard } from '@/components/auth/auth-guard';
import { AuthLayout } from '@/components/auth/auth-layout';
import { UpdatePasswordForm } from '@/components/auth/supabase/update-password-form';

export const metadata = { title: `Update password | Auth | ${config.site.name}` };

export default function Page() {
  return (
    <AuthGuard>
      <AuthLayout>
        <UpdatePasswordForm />
      </AuthLayout>
    </AuthGuard>
  );
}
