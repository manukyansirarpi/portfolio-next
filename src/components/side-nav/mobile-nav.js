import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import { List as ListIcon } from '@phosphor-icons/react/dist/ssr/List';

import { SideNav } from './side-nav';

export function MobileNav() {
  const [open, setOpenNav] = React.useState(false);

  return (
    <Box
      component="header"
      sx={{
        '--MainNav-background': 'var(--mui-palette-background-default)',
        bgcolor: 'var(--MainNav-background)',
        width: '100%',
        zIndex: 'var(--MainNav-zIndex)',
        display: { lg: 'none' },
      }}
    >
      <IconButton
        onClick={() => {
          setOpenNav(true);
        }}
      >
        <ListIcon />
      </IconButton>
      <Drawer
        PaperProps={{
          sx: {
            backgroundColor: 'var(--mui-palette-background-highlight)',
            backgroundImage: `url('/assets/bg.png')`,
            maxWidth: '100%',
            width: 'var(--MobileNav-width)',
            zIndex: 'var(--MobileNav-zIndex)',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
          },
        }}
        onClose={() => {
          setOpenNav(false);
        }}
        open={open}
      >
        <SideNav
          onClose={() => {
            setOpenNav(false);
          }}
        />
      </Drawer>
    </Box>
  );
}
