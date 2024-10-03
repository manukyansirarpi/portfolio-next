'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Alert from '@mui/material/Alert';

import { createClient as createSupabaseClient } from '@/lib/supabase/client';
import { useUser } from '@/hooks/use-user';

export function GuestGuard({ children }) {
  const router = useRouter();
  const [supabaseClient] = React.useState(createSupabaseClient());
  const { user, error, isLoading } = useUser();
  const [isChecking, setIsChecking] = React.useState(true);

  const checkPermissions = async () => {
    if (isLoading) {
      return;
    }

    if (error) {
      setIsChecking(false);
      return;
    }

    if (user) {
      supabaseClient
        .from('users')
        .select('id, firstname, lastname, organizations(name)')
        .eq('supabase_auth_id', user.id)
        .single()
        .then((response) => {
          const organizationName = response.data.organizations.name.toLowerCase();
          router.replace(`/${organizationName}`);
        });
      return;
    }

    setIsChecking(false);
  };

  React.useEffect(() => {
    checkPermissions().catch(() => {
      // noop
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Expected
  }, [user, error, isLoading]);

  if (isChecking) {
    return null;
  }

  if (error) {
    return <Alert color="error">{error}</Alert>;
  }

  return <React.Fragment>{children}</React.Fragment>;
}
