import * as React from 'react';
import RouterLink from 'next/link';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ArrowLeft as ArrowLeftIcon } from '@phosphor-icons/react/dist/ssr/ArrowLeft';

import { config } from '@/config';
import { paths } from '@/paths';
import { AuthLayout } from '@/components/auth/auth-layout';
import { GuestGuard } from '@/components/auth/guest-guard';

export const metadata = { title: `Recovery link sent | Auth | ${config.site.name}` };

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
        <Stack spacing={1.6}>
          <Typography sx={{ fontSize: '1.8rem' }} variant="h5">
            Link verstuurd
          </Typography>

          <Typography color="text.secondary" variant="body1">
            We hebben je een e-mail gestuurd met daarin een persoonlijke link. Via deze link kun je een nieuw wachtwoord
            opgeven.
          </Typography>
        </Stack>
        <Link component={RouterLink} href={paths.auth.signIn} sx={{ height: '48px' }} variant="button">
          <Button size="Large" sx={{ width: '100%', height: '48px' }} type="button" variant="contained">
            <ArrowLeftIcon fontSize="var(--icon-fontSize-md)" />
            <Typography sx={{ marginLeft: '10px' }}>Terug naar inloggen</Typography>
          </Button>
        </Link>
      </AuthLayout>
    </GuestGuard>
  );
}
