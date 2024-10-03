import * as React from 'react';

import { config } from '@/config';
import BasePage from '@/components/page/base-page';

export const metadata = { title: `Nieuwberichten | ${config.site.name}` };

export default function Page() {
  return <BasePage subtitle="" title="Nieuwsberichten" />;
}
