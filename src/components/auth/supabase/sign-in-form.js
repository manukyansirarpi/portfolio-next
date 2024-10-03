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
import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
import { EyeSlash as EyeSlashIcon } from '@phosphor-icons/react/dist/ssr/EyeSlash';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { paths } from '@/paths';
import { createClient as createSupabaseClient } from '@/lib/supabase/client';

const schema = zod.object({
  email: zod.string().min(1, { message: 'E-mailadres is vereist.' }).email('Ongelding e-mailadres.'),
  password: zod.string().min(1, { message: 'Wachtwoord is vereist.' }),
});

const defaultValues = { email: '', password: '' };

export function SignInForm() {
  const [supabaseClient] = React.useState(createSupabaseClient());

  const router = useRouter();

  const [showPassword, setShowPassword] = React.useState();

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

      const { error } = await supabaseClient.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        if (error.message.includes('Email not confirmed')) {
          // You should resend the verification email.
          // For the sake of simplicity, we will just redirect to the confirmation page.
          const searchParams = new URLSearchParams({ email: values.email });
          router.push(`${paths.auth.signUpConfirm}?${searchParams.toString()}`);
        } else {
          setError('root', { type: 'server', message: error.message });
          setIsPending(false);
        }
      } else {
        // UserProvider will handle Router refresh
        // After refresh, GuestGuard will handle the redirect
      }
    },
    [supabaseClient, router, setError]
  );

  return (
    <>
      <Stack spacing={1.6}>
        <Typography sx={{ fontSize: '1.8rem' }} variant="h5">
          Inloggen
        </Typography>
        <Typography color="text.secondary" variant="body1">
          Voer je e-mailadres en wachtwoord in om in te loggen.
        </Typography>
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <Stack spacing={2}>
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
                      borderRadius: '4px',
                    }}
                    type="email"
                  />
                  {errors.email ? (
                    <FormHelperText sx={{ margin: '0', fontWeight: '500' }}>{errors.email.message}</FormHelperText>
                  ) : null}
                </FormControl>
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <FormControl error={Boolean(errors.password)}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="caption">Wachtwoord</Typography>
                    <Link
                      component={RouterLink}
                      href={paths.auth.resetPassword}
                      sx={{ fontSize: '0.75rem' }}
                      variant="subtitle2"
                    >
                      Wachtwoord vergeten?
                    </Link>
                  </Stack>
                  <OutlinedInput
                    {...field}
                    endAdornment={
                      showPassword ? (
                        <EyeIcon
                          cursor="pointer"
                          fontSize="var(--icon-fontSize-md)"
                          onClick={() => {
                            setShowPassword(false);
                          }}
                        />
                      ) : (
                        <EyeSlashIcon
                          cursor="pointer"
                          fontSize="var(--icon-fontSize-md)"
                          onClick={() => {
                            setShowPassword(true);
                          }}
                        />
                      )
                    }
                    label="Password"
                    sx={{
                      margin: '4px 0',
                      height: '48px',
                      backgroundColor: '#F6F5F7',
                      borderRadius: '4px',
                    }}
                    type={showPassword ? 'text' : 'password'}
                  />
                  {errors.password ? (
                    <FormHelperText sx={{ margin: '0', fontWeight: '500' }}>{errors.password.message}</FormHelperText>
                  ) : null}
                </FormControl>
              )}
            />
          </Stack>
          {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
          <Button
            disabled={isPending}
            size="large"
            sx={{ borderRadius: '4px', fontSize: '16px' }}
            type="submit"
            variant="contained"
          >
            Inloggen
          </Button>
        </Stack>
      </form>
    </>
  );
}
