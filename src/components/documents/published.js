import * as React from 'react';
import Stack from '@mui/material/Stack';

import { neonBlue } from '@/styles/theme/colors';

function Published() {
  return (
    <Stack
      alignItems="center"
      direction="row"
      spacing={1}
      sx={{
        backgroundColor: neonBlue['100'],
        paddingX: 1,
        width: '200px',
        borderRadius: '15px',
        color: neonBlue['950'],
      }}
    >
      <img alt="open" height="25" src="/assets/icon-spark-neon-blue.svg" width="25" />
      <>Gepubliceerd</>
    </Stack>
  );
}

export default Published;
