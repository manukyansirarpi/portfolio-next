import * as React from 'react';

import '@/styles/global.css';

import { config } from '@/config';
import { applyDefaultSettings } from '@/lib/settings/apply-default-settings';
import { getSettings as getPersistedSettings } from '@/lib/settings/get-settings';
import { UserProvider } from '@/contexts/auth/user-context';
import { SettingsProvider } from '@/contexts/settings';
import { Analytics } from '@/components/analytics';
import { ThemeProvider } from '@/components/theme-provider/theme-provider';
import { Toaster } from '@/components/toaster';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: config.site.themeColor,
};

export default async function Layout({ children }) {
  const settings = applyDefaultSettings(await getPersistedSettings());

  return (
    <html data-mui-color-scheme={settings.colorScheme} lang="en">
      <body>
        <Analytics>
          <UserProvider>
            <SettingsProvider settings={settings}>
              <ThemeProvider>
                {children}
                <Toaster closeButton expand position="bottom-right" richColors />
              </ThemeProvider>
            </SettingsProvider>
          </UserProvider>
        </Analytics>
      </body>
    </html>
  );
}
