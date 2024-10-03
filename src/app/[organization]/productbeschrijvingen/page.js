import * as React from 'react';

import { config } from '@/config';
import DocumentsTable from '@/components/documents/documents-table';

export const metadata = { title: `Productbeschrijvingen | ${config.site.name}` };

export default async function Page() {
  return <DocumentsTable />;
}
