import * as React from 'react';
import Stack from '@mui/material/Stack';

import { neonBlue } from '@/styles/theme/colors';

function NotGenerated() {
  return (
    <Stack
      alignItems="center"
      direction="row"
      spacing={1}
      sx={{
        backgroundColor: neonBlue['100'],
        paddingX: 1,
        borderRadius: '15px',
        color: neonBlue['950'],
        width: '200px',
      }}
    >
      <img alt="open" height="25" src="/assets/icon-spark-neon-blue.svg" width="25" />
      <>Niet gegenereerd</>
    </Stack>
  );
}

export default NotGenerated;
