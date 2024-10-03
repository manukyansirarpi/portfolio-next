import { paths } from '@/paths';

export const NavItems = [
  { key: 'dashboards', title: 'Dashboard', href: paths.dashboard.overview, icon: 'dashboard' },
  { key: 'notificaties', title: 'Notificaties', href: paths.dashboard.notificaties, icon: 'bell' },
  { key: 'products', title: 'Productbeschrijvingen', href: paths.dashboard.products, icon: 'products' },
  { key: 'brands', title: 'Merkbeschrijvingen', href: paths.dashboard.brands, icon: 'brands' },
  { key: 'newitems', title: 'Nieuwsberichten', href: paths.dashboard.newitems, icon: 'email' },
  { key: 'cloudsuite', title: 'Cloudsuite', href: paths.dashboard.cloudsuite, icon: 'cloudsuite' },
  { key: 'files', title: 'Bestanden', href: paths.dashboard.files, icon: 'files' },
];
