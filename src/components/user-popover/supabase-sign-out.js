'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';

import { logger } from '@/lib/default-logger';
import { createClient as createSupabaseClient } from '@/lib/supabase/client';
import { toast } from '@/components/toaster';

export function SupabaseSignOut() {
  const [supabaseClient] = React.useState(createSupabaseClient());

  const handleSignOut = React.useCallback(async () => {
    try {
      const { error } = await supabaseClient.auth.signOut();

      if (error) {
        logger.error('Sign out error', error);
        toast.error('Something went wrong, unable to sign out');
      } else {
        // UserProvider will handle Router refresh
        // After refresh, GuestGuard will handle the redirect
      }
    } catch (err) {
      logger.error('Sign out error', err);
      toast.error('Something went wrong, unable to sign out');
    }
  }, [supabaseClient]);

  return (
    <MenuItem component="div" onClick={handleSignOut}>
      <Stack alignItems="center" direction="row" spacing={2}>
        <Box alt="settings" component="img" height={14} src="/assets/checkout.svg" width={14} />
        Uitloggen
      </Stack>
    </MenuItem>
  );
}
