'use client';

import * as React from 'react';
import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CaretDown as CaretDownIcon } from '@phosphor-icons/react/dist/ssr/CaretDown';

import { createClient } from '@/lib/supabase/client';
import { usePopover } from '@/hooks/use-popover';
import { useUser } from '@/hooks/use-user';

import { WorkspacesPopover } from './workspaces-popover';

export function WorkspacesSwitch() {
  const supabase = createClient();
  const { user } = useUser();

  const [selectedBrand, setSelectedBrand] = React.useState(null);
  const popover = usePopover();

  useEffect(() => {
    fetchSelectedBrand();
  }, []);

  async function fetchSelectedBrand() {
    const { data } = await supabase
      .from('brands')
      .select('*')
      .eq('organization_id', user?.organizationId)
      .eq('is_selected', true);
    setSelectedBrand(data[0]);
  }

  const handleClose = () => {
    fetchSelectedBrand();
    popover.handleClose();
  };

  return (
    <React.Fragment>
      <Stack
        direction="row"
        onClick={popover.handleOpen}
        ref={popover.anchorRef}
        spacing={2}
        sx={{
          alignItems: 'center',
          border: '1px solid var(--mui-palette-neutral-800)',
          borderRadius: '4px',
          cursor: 'pointer',
          p: '8px',
          bgcolor: 'rgba(255, 255, 255, 0.04)',
        }}
      >
        {/*<Box alt="logo" component="img" height={30} src="/assets/logo.svg" width={30} />*/}

        <Box sx={{ flex: '1 1 auto' }}>
          <Typography color="var(--mui-palette-common-white)" variant="caption">
            {selectedBrand?.name}
          </Typography>
        </Box>
        <CaretDownIcon color="var(--mui-palette-neutral-400)" fontSize="var(--icon-fontSize-sm)" />
      </Stack>
      <WorkspacesPopover
        anchorEl={popover.anchorRef.current}
        onChange={popover.handleClose}
        onClose={handleClose}
        open={popover.open}
      />
    </React.Fragment>
  );
}
