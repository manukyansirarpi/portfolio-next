'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import GlobalStyles from '@mui/material/GlobalStyles';

import { MobileNav } from './side-nav/mobile-nav';
import { SideNav } from './side-nav/side-nav';

export function MainLayout({ children }) {
  return (
    <React.Fragment>
      <GlobalStyles
        styles={{
          body: {
            '--MainNav-height': '56px',
            '--MainNav-zIndex': 1000,
            '--SideNav-width': '280px',
            '--SideNav-zIndex': 1100,
            '--MobileNav-width': '320px',
            '--MobileNav-zIndex': 1100,
          },
        }}
      />
      <Box
        sx={{
          backgroundColor: 'var(--mui-palette-background-highlight)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          minHeight: '100%',
        }}
      >
        <Box
          sx={{
            // display: 'flex',
            flexDirection: 'column',
            height: '100%',
            display: { xs: 'none', lg: 'flex' },
            left: 0,
            position: 'fixed',
            top: 0,
            width: 'var(--SideNav-width)',
            zIndex: 'var(--SideNav-zIndex)',
          }}
        >
          <SideNav />
        </Box>

        <Box
          id="main-layout"
          sx={{
            display: 'flex',
            flex: '1 1 auto',
            flexDirection: 'column',
            pl: { lg: 'var(--SideNav-width)' },
          }}
        >
          <MobileNav />
          <Box
            component="main"
            sx={{
              '--Content-margin': '0 auto',
              '--Content-maxWidth': 'var(--maxWidth-xl)',
              '--Content-paddingX': '24px',
              '--Content-paddingY': { xs: '24px', lg: '64px' },
              '--Content-padding': 'var(--Content-paddingY) var(--Content-paddingX)',
              '--Content-width': '100%',
              display: 'flex',
              flex: '1 1 auto',
              flexDirection: 'column',
              borderRadius: '5px',
              bgcolor: 'var(--mui-palette-background-default)',
              margin: '14px',
              height: '98vh',
              overflow: 'auto',
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </React.Fragment>
  );
}
