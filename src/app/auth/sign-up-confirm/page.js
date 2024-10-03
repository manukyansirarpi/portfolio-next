import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { config } from '@/config';
import { AuthLayout } from '@/components/auth/auth-layout';
import { GuestGuard } from '@/components/auth/guest-guard';
import { SignUpResendButton } from '@/components/auth/supabase/sign-up-resend-button';

export const metadata = { title: `Sign up confirm | Auth | ${config.site.name}` };

export default function Page({ searchParams }) {
  const { email } = searchParams;

  if (!email) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert color="error">Email is required</Alert>
      </Box>
    );
  }

  return (
    <GuestGuard>
      <AuthLayout>
        <Typography variant="h5">Confirm your email</Typography>
        <Typography>
          We&apos;ve sent a verification email to{' '}
          <Typography component="span" variant="subtitle1">
            &quot;{email}&quot;
          </Typography>
          .
        </Typography>
        <SignUpResendButton email={email}>Resend</SignUpResendButton>
      </AuthLayout>
    </GuestGuard>
  );
}
