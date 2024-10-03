'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z as zod } from 'zod';

import { createClient } from '@/lib/supabase/client';
import { useUser } from '@/hooks/use-user';

const schema = zod.object({
  name: zod.string().min(1, 'Naam mag niet leeg zijn').max(255),
});

const defaultValues = {
  name: '',
};

export function AddBrand({ onClose, open = false }) {
  const supabase = createClient();
  const { user } = useUser();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({ defaultValues, resolver: zodResolver(schema) });

  const handleCreateBrand = async (formData) => {
    const { error } = await supabase
      .from('brands')
      .insert({ name: formData.name, organization_id: user.organizationId })
      .select();

    if (error) {
      toast.error('Merk opslaan mislukt');
    } else {
      toast.success('Merk succesvol opgeslagen');
      setValue('name', '');
      onClose();
    }
  };

  return (
    <Dialog
      PaperProps={{
        style: {
          borderRadius: '16px',
          padding: '44px',
          maxWidth: '488px',
        },
      }}
      fullWidth
      maxWidth="xs"
      onClose={onClose}
      open={open}
    >
      <form onSubmit={handleSubmit(handleCreateBrand)}>
        <Stack spacing={3}>
          <Stack spacing={2} sx={{ marginBottom: '16px' }}>
            <Typography sx={{ fontSize: '28px' }} variant="h3">
              Merk toevoegen
            </Typography>
            <Typography color="text.secondary" variant="body1">
              Voer een merknaam in en upload optioneel een logo.
            </Typography>
          </Stack>
          <Stack direction="row" spacing={2}>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <FormControl error={Boolean(errors.name)} fullWidth>
                  <InputLabel sx={{ fontSize: '12px' }}>Merknaam</InputLabel>
                  <OutlinedInput
                    {...field}
                    sx={{
                      margin: '4px 0',
                      height: '48px',
                      backgroundColor: '#F6F5F7',
                      borderRadius: '4px',
                      outlineColor: 'coral',
                    }}
                  />
                  {errors.name ? <FormHelperText>{errors.name.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Button color="secondary" onClick={onClose} size="large" type="button" variant="outlined">
              Annuleren
            </Button>
            <Button size="large" type="submit" variant="contained">
              Toevoegen
            </Button>
          </Stack>
        </Stack>
      </form>
    </Dialog>
  );
}
