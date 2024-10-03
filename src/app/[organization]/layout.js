import * as React from 'react';

import { AuthGuard } from '@/components/auth/auth-guard';
import { MainLayout } from '@/components/main-layout';

export default function Layout({ children }) {
  return (
    <AuthGuard>
      <MainLayout>{children}</MainLayout>
    </AuthGuard>
  );
}
