import * as React from 'react';
import RouterLink from 'next/link';
import { usePathname } from 'next/navigation';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { isNavItemActive } from '@/lib/is-nav-item-active';

import Icon from '../nav-icons';

export function NavItem({ href, icon, title, onClose }) {
  const pathname = usePathname();

  const active = isNavItemActive({ href, pathname });
  return (
    <Box
      component="li"
      onClick={() => {
        onClose?.();
      }}
      sx={{ userSelect: 'none' }}
    >
      <Box
        component={RouterLink}
        href={href}
        sx={{
          alignItems: 'center',
          borderRadius: 0.5,
          color: 'var(--mui-palette-neutral-300)',
          cursor: 'pointer',
          display: 'flex',
          flex: '0 0 auto',
          gap: 1,
          p: '8px 16px',
          position: 'relative',
          textDecoration: 'none',
          whiteSpace: 'nowrap',
          ...(active && {
            bgcolor: 'var(--mui-palette-primary-main)',
            color: 'var(--mui-palette-primary-contrastText)',
          }),
        }}
      >
        <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'center', flex: '0 0 auto' }}>
          <Stack alignItems="center" direction="row" justifyContent="center" spacing={1.5}>
            <Icon active={active} type={icon} />
            <Typography
              component="span"
              sx={{ color: 'inherit', fontSize: '0.875rem', fontWeight: 500, lineHeight: '28px' }}
            >
              {title}
            </Typography>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
