import * as React from 'react';

import { AuthGuard } from '@/components/auth/auth-guard';

export default function Page() {
  return <AuthGuard />;
}
