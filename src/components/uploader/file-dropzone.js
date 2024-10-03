'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useDropzone } from 'react-dropzone';

export function FileDropzone({ caption, ...props }) {
  const { getRootProps, getInputProps } = useDropzone(props);
  caption;
  return (
    <Box
      sx={{
        alignItems: 'center',
        cursor: 'pointer',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        outline: 'none',
      }}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <Button size="Large" variant="contained">
        Selecteer bestanden
      </Button>
    </Box>
  );
}
