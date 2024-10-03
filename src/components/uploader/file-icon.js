import * as React from 'react';
import Box from '@mui/material/Box';

const icons = {
  jpeg: '/assets/icon-jpg.svg',
  jpg: '/assets/icon-jpg.svg',
  pdf: '/assets/icon-pdf.svg',
  docx: '/assets/icon-docx.svg',
  doc: '/assets/icon-docx.svg',
  png: '/assets/icon-png.svg',
};

export function FileIcon({ extension }) {
  let icon;
  if (!extension) {
    icon = '/assets/icon.svg';
  } else {
    icon = icons[extension] ?? '/assets/icon.svg';
  }

  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'inline-flex',
        flex: '0 0 auto',
        justifyContent: 'center',
        width: '40px',
        height: '40px',
        backgroundColor: 'var(--mui-palette-neutral-50)',
      }}
    >
      <Box alt="File" component="img" src={icon} sx={{ height: '70%', width: '70%' }} />
    </Box>
  );
}
