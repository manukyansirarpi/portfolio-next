'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { Box, Stack } from '@mui/material';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Check as CheckIcon } from '@phosphor-icons/react/dist/ssr/Check';
import { PencilSimpleLine as PencilSimpleLineIcon } from '@phosphor-icons/react/dist/ssr/PencilSimpleLine';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';

import { createClient } from '@/lib/supabase/client';
import { useDialog } from '@/hooks/use-dialog';
import { useUser } from '@/hooks/use-user';
import { AddBrand } from '@/components/dialogs/add-brand';

export function WorkspacesPopover({ anchorEl, onClose, open = false }) {
  const supabase = createClient();
  const { user } = useUser();

  const addBrandDialog = useDialog();

  const [hoveredIndex, setHoveredIndex] = React.useState(null);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    async function fetchBrands() {
      const { data } = await supabase
        .from('brands')
        .select('*')
        .eq('organization_id', user?.organizationId)
        .order('name');
      setBrands(data);
    }

    fetchBrands();
  }, [open]);

  const handleMouseEnter = (index) => setHoveredIndex(index);
  const handleMouseLeave = () => setHoveredIndex(null);

  const handleClick = async (brandId) => {
    await supabase.from('brands').update({ is_selected: false }).eq('organization_id', user?.organizationId);

    await supabase.from('brands').update({ is_selected: true }).eq('id', brandId);

    onClose();
  };

  return (
    <React.Fragment>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        onClose={onClose}
        open={open}
        slotProps={{ paper: { sx: { width: '320px', border: 'none', gap: '10px' } } }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        {brands?.map((brand, index) => (
          <MenuItem
            key={brand.id}
            onClick={() => handleClick(brand.id)}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            sx={{ padding: '8px 16px', justifyContent: 'space-between', fontSize: '14px' }}
          >
            <Stack alignItems="center" direction="row" spacing={1}>
              {brand.is_selected ? (
                <ListItemAvatar>
                  <CheckIcon fontSize="var(--Icon-fontSize)" />
                </ListItemAvatar>
              ) : null}

              {/*<ListItemAvatar>*/}
              {/*  <Avatar src="/assets/logo.svg" sx={{ '--Avatar-size': '32px' }} variant="rounded" />*/}
              {/*</ListItemAvatar>*/}
              {brand.name}
            </Stack>

            {hoveredIndex === index && (
              <Box
                sx={{
                  border: '1px solid var(--mui-palette-neutral-200)',
                  width: '32px',
                  height: '32px',
                  borderRadius: '4px',
                  padding: '8px',
                }}
              >
                <PencilSimpleLineIcon fontSize="16px" />
              </Box>
            )}
          </MenuItem>
        ))}
        <MenuItem
          key="add-new-brand"
          onClick={addBrandDialog.handleOpen}
          sx={{
            justifyContent: 'center',
            border: '1px solid var(--mui-palette-neutral-200)',
            borderRadius: '4px',
            padding: '7px',
            gap: '6px',
          }}
        >
          <PlusIcon fontSize="var(--Icon-fontSize)" />
          Merk toevoegen
        </MenuItem>
      </Menu>
      <AddBrand onClose={addBrandDialog.handleClose} open={addBrandDialog.open} />
    </React.Fragment>
  );
}
