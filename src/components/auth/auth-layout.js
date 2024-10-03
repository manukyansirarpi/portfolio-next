import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { DynamicLogo } from '@/components/logo';

export function AuthLayout({ children }) {
  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        backgroundImage: `url('/assets/bg.png')`,
        backgroundColor: 'var(--mui-palette-background-highlight)',
        justifyContent: 'center',
        minHeight: '100vh',
        width: '100%',
        p: 3,
      }}
    >
      <Card
        sx={{
          width: '488px',
          padding: '40px',
          borderRadius: '16px',
          backgroundColor: 'var(--mui-palette-common-white)',
        }}
      >
        <Stack spacing={5}>
          <Stack direction="row" justifyContent="center" spacing={1}>
            <DynamicLogo colorDark="light" colorLight="dark" height={32} width={30} />
            <Typography
              sx={{ color: 'var(--mui-palette-background-highlight)', fontWeight: 700, fontSize: '1.33rem' }}
              variant="h5"
            >
              Content Generator
            </Typography>
          </Stack>
          {children}
        </Stack>
      </Card>
    </Box>
  );
}
