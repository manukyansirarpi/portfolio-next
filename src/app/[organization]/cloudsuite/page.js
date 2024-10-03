import * as React from 'react';

import { config } from '@/config';
import BasePage from '@/components/page/base-page';

export const metadata = { title: `Cloudsuite | ${config.site.name}` };

export default function Page() {
  return <BasePage subtitle="" title="Cloudsuite" />;
}
