'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
import { EyeSlash as EyeSlashIcon } from '@phosphor-icons/react/dist/ssr/EyeSlash';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { paths } from '@/paths';
import { createClient as createSupabaseClient } from '@/lib/supabase/client';

const schema = zod
  .object({
    password: zod.string().min(8, { message: 'Er is geen wachtwoord ingevuld.' }),
    confirmPassword: zod.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Dit wachtwoord heeft minder dan 8 tekens.',
    path: ['confirmPassword'],
  });

const defaultValues = { password: '', confirmPassword: '' };

export function UpdatePasswordForm() {
  const [supabaseClient] = React.useState(createSupabaseClient());
  const [showPassword, setShowPassword] = React.useState();
  const [showConfirmPassword, setShowConfirmPassword] = React.useState();

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

      const { error } = await supabaseClient.auth.updateUser({ password: values.password });

      if (error) {
        setError('root', { type: 'server', message: error.message });
        setIsPending(false);
        return;
      }

      router.push(paths.dashboard.overview);
    },
    [supabaseClient, router, setError]
  );

  return (
    <>
      <Stack spacing={1.6}>
        <Typography sx={{ fontSize: '1.8rem' }} variant="h5">
          Nieuw wachtwoord
        </Typography>
        <Typography color="text.secondary" variant="body1">
          Voer een nieuw wachtwoord in en sla op.
        </Typography>
      </Stack>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <FormControl error={Boolean(errors.password)}>
                <Typography variant="caption">Nieuw wachtwoord</Typography>
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
                ) : (
                  <Typography variant="body2">Kies een wachtwoord van minstens 8 tekens.</Typography>
                )}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field }) => (
              <FormControl error={Boolean(errors.confirmPassword)}>
                <Typography variant="caption">Herhaal nieuw wachtwoord</Typography>
                <OutlinedInput
                  {...field}
                  endAdornment={
                    showConfirmPassword ? (
                      <EyeIcon
                        cursor="pointer"
                        fontSize="var(--icon-fontSize-md)"
                        onClick={() => {
                          setShowConfirmPassword(false);
                        }}
                      />
                    ) : (
                      <EyeSlashIcon
                        cursor="pointer"
                        fontSize="var(--icon-fontSize-md)"
                        onClick={() => {
                          setShowConfirmPassword(true);
                        }}
                      />
                    )
                  }
                  sx={{
                    margin: '4px 0',
                    height: '48px',
                    backgroundColor: '#F6F5F7',
                    borderRadius: '4px',
                  }}
                  type={showConfirmPassword ? 'text' : 'password'}
                />
                {errors.confirmPassword ? <FormHelperText>{errors.confirmPassword.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
          <Button disabled={isPending} type="submit" variant="contained">
            Wachtwoord opslaan
          </Button>
        </Stack>
      </form>
    </>
  );
}
