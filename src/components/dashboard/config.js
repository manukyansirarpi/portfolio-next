export const layoutConfig = (organizationName) => ({
  navItems: [
    { key: 'dashboard', title: 'Dashboard', href: `/${organizationName}`, icon: 'dashboard' },
    { key: 'notifications', title: 'Notificaties', href: `/${organizationName}/notificaties`, icon: 'bell' },
    {
      key: 'product',
      title: 'Productbeschrijvingen',
      href: `/${organizationName}/productbeschrijvingen`,
      icon: 'products',
    },
    { key: 'brand', title: 'Merkbeschrijvingen', href: `/${organizationName}/merkbeschrijvingen`, icon: 'brands' },
    { key: 'news', title: 'Nieuwsberichten', href: `/${organizationName}/nieuwsberichten`, icon: 'email' },
    { key: 'cloudsuite', title: 'Cloudsuite', href: `/${organizationName}/cloudsuite`, icon: 'cloudsuite' },
    { key: 'files', title: 'Bestanden', href: `/${organizationName}/bestanden`, icon: 'files' },
  ],
});
