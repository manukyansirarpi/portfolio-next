'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ArrowLeft as ArrowLeftIcon } from '@phosphor-icons/react/dist/ssr/ArrowLeft';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { paths } from '@/paths';
import { createClient as createSupabaseClient } from '@/lib/supabase/client';

const schema = zod.object({
  email: zod.string().min(1, { message: 'E-mailadres is vereist.' }).email('Ongelding e-mailadres.'),
});

const defaultValues = { email: '' };

export function ResetPasswordForm() {
  const [supabaseClient] = React.useState(createSupabaseClient());

  const router = useRouter();

  const [isPending, setIsPending] = React.useState(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ defaultValues, resolver: zodResolver(schema) });

  const onSubmit = React.useCallback(
    async (values) => {
      setIsPending(true);

      const redirectToUrl = new URL(paths.auth.callback.pkce, window.location.origin);
      redirectToUrl.searchParams.set('next', paths.auth.updatePassword);

      const { error } = await supabaseClient.auth.resetPasswordForEmail(values.email, {
        redirectTo: redirectToUrl.href,
      });

      if (error) {
        setError('root', { type: 'server', message: error.message });
        setIsPending(false);
        return;
      }

      const searchParams = new URLSearchParams({ email: values.email });
      router.push(`${paths.auth.recoveryLinkSent}?${searchParams.toString()}`);
    },
    [supabaseClient, router, setError]
  );

  return (
    <>
      <Stack spacing={1.6}>
        <Typography sx={{ fontSize: '1.8rem' }} variant="h5">
          Wachtwoord vergeten
        </Typography>
        <Typography color="text.secondary" variant="body1">
          Wat is je e-mailadres? We sturen je zo snel mogelijk een link om een nieuw wachtwoord in te stellen.
        </Typography>
      </Stack>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Stack spacing={3.5}>
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <FormControl error={Boolean(errors.email)}>
                  <Typography variant="caption">E-mailadres</Typography>
                  <OutlinedInput
                    {...field}
                    sx={{
                      margin: '4px 0',
                      height: '48px',
                      backgroundColor: '#F6F5F7',
                    }}
                    type="email"
                  />
                  {errors.email ? (
                    <FormHelperText sx={{ margin: '0', fontWeight: '500' }}>{errors.email.message}</FormHelperText>
                  ) : null}
                </FormControl>
              )}
            />
            {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
            <Button disabled={isPending} size="large" sx={{ fontSize: '16px' }} type="submit" variant="contained">
              Verzenden
            </Button>
          </Stack>
          <Link component={RouterLink} href={paths.auth.signIn} sx={{ height: '48px' }} variant="button">
            <Button
              color="secondary"
              size="Large"
              sx={{ width: '100%', height: '48px' }}
              type="button"
              variant="outlined"
            >
              <ArrowLeftIcon fontSize="var(--icon-fontSize-md)" />
              <Typography sx={{ marginLeft: '10px' }}> Terug naar inloggen</Typography>
            </Button>
          </Link>
        </Stack>
      </form>
    </>
  );
}
