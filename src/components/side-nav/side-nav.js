import * as React from 'react';
import RouterLink from 'next/link';
import { Divider } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { paths } from '@/paths';
import { usePopover } from '@/hooks/use-popover';
import { useUser } from '@/hooks/use-user';
import { layoutConfig } from '@/components/dashboard/config';

import { UserPopover } from '../user-popover/user-popover';
import { WorkspacesSwitch } from '../workspaces/workspaces-switch';
import { NavItem } from './nav-item';

export function SideNav({ onClose = null }) {
  const { user } = useUser();

  const organizationName = user?.organizationName;
  const items = layoutConfig(organizationName).navItems;

  const popover = usePopover();

  const renderNavItems = React.useMemo(() => {
    return items.map((item, i) => (
      <React.Fragment key={item.key || i}>
        {(i === 2 || i === 5) && <Divider sx={{ margin: '4px 0 8px', borderColor: 'rgba(255, 255, 255, 0.4)' }} />}
        <NavItem href={item.href} icon={item.icon} onClose={onClose} title={item.title} />
      </React.Fragment>
    ));
  }, [items]);

  return (
    <>
      <Stack spacing={3} sx={{ padding: '14px 16px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: '4px 8px' }}>
          <Stack alignItems="center" direction="row" justifyContent="center" spacing={2}>
            <Box component={RouterLink} href={paths.home} sx={{ display: 'inline-flex' }}>
              <Box alt="logo" component="img" height={40} src="/assets/logo.svg" width={40} />
            </Box>
            <Typography
              sx={{ fontSize: '14px', fontWeight: 700, color: 'var(--mui-palette-common-white)' }}
              variant="caption"
            >
              QSTA
            </Typography>
          </Stack>
          <Box
            alt="settings"
            component="img"
            height={20}
            onClick={popover.handleOpen}
            ref={popover.anchorRef}
            src="/assets/logo-settings-icon.svg"
            width={20}
          />
          <UserPopover anchorEl={popover.anchorRef.current} onClose={popover.handleClose} open={popover.open} />
        </Box>
        <WorkspacesSwitch />
      </Stack>
      <Box component="nav">
        <Stack component="ul" spacing={1.2} sx={{ listStyle: 'none', m: 2, p: 0 }}>
          {renderNavItems}
        </Stack>
      </Box>
    </>
  );
}
