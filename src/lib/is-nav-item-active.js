export function isNavItemActive({ href, pathname }) {
  if (!href) {
    return false;
  }

  return pathname === href;
}
