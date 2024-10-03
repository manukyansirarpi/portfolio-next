export const paths = {
  home: '/',
  auth: {
    callback: { implicit: '/auth/callback/implicit', pkce: '/auth/callback/pkce' },
    signIn: '/auth/sign-in',
    signUp: '/auth/sign-up',
    signUpConfirm: '/auth/sign-up-confirm',
    resetPassword: '/auth/reset-password',
    recoveryLinkSent: '/auth/recovery-link-sent',
    updatePassword: '/auth/update-password',
  },
  dashboard: '/dashboard',
  notifications: '/notificaties',
  product_descriptions: '/productbeschrijvingen',
  brand_descriptions: '/merkbeschrijvingen',
  news_articles: '/nieuwsberichten',
  cloudsuite: '/cloudsuite',
  bestanden: '/bestanden',
  notAuthorized: '/errors/not-authorized',
  notFound: '/errors/not-found',
  internalServerError: '/errors/internal-server-error',
};
