import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

function BasePage({ children, title = '', subtitle = '' }) {
  return (
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
        borderRadius: '16px',
        bgcolor: 'var(--mui-palette-background-default)',
        margin: '14px',
        height: '98vh',
        overflow: 'hidden',
      }}
    >
      <Container component="main" disableGutters maxWidth={false} sx={{ height: '100vh', overflow: 'auto' }}>
        <Stack sx={{ height: '100%' }}>
          <Stack spacing={1.5} sx={{ padding: '24px 40px 20px', backgroundColor: '#F6F5F7', borderRadius: '16px' }}>
            <Typography sx={{ fontSize: '28px', lineHeight: '36px' }} variant="h4">
              {title}
            </Typography>
            <Typography sx={{ fontSize: '15px', lineHeight: '23px' }} variant="body1">
              {subtitle}
            </Typography>
          </Stack>
          {children}
        </Stack>
      </Container>
    </Box>
  );
}

export default BasePage;
