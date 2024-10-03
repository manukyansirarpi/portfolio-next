import * as React from 'react';
import Stack from '@mui/material/Stack';

import { neonBlue } from '@/styles/theme/colors';

function Generated() {
  return (
    <Stack
      alignItems="center"
      direction="row"
      justifyContent="center"
      spacing={2}
      sx={{
        backgroundColor: neonBlue['100'],
        paddingX: 3,
        borderRadius: '15px',
        color: neonBlue['950'],
        width: '200px',
      }}
    >
      <img alt="open" height="25" src="/assets/icon-spark-neon-blue.svg" width="25" />
      <div>Gegenereerd</div>
    </Stack>
  );
}

export default Generated;
