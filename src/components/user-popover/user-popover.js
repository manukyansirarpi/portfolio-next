'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';

import { config } from '@/config';
import { AuthStrategy } from '@/lib/auth/strategy';

import { SupabaseSignOut } from './supabase-sign-out';

export function UserPopover({ anchorEl, onClose, open }) {
  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      onClose={onClose}
      open={Boolean(open)}
      slotProps={{ paper: { sx: { width: '236px' } } }}
      sx={{ top: '15px' }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
    >
      <Box sx={{ p: 1 }}>{config.auth.strategy === AuthStrategy.SUPABASE ? <SupabaseSignOut /> : null}</Box>
    </Popover>
  );
}
