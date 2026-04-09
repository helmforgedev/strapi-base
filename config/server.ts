export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: env('URL', ''),
  app: {
    keys: env.array('APP_KEYS', []),
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
  admin: {
    path: env('ADMIN_PATH', '/admin'),
    autoOpen: env.bool('ADMIN_AUTO_OPEN', false),
    auth: {
      secret: env('ADMIN_JWT_SECRET'),
      expiresIn: env('ADMIN_JWT_EXPIRATION', '7d'),
    },
    rateLimit: {
      enabled: env.bool('ADMIN_RATE_LIMIT_ENABLED', true),
      max: env.int('ADMIN_RATE_LIMIT_MAX', 5),
      timeWindow: env.int('ADMIN_RATE_LIMIT_TIME_WINDOW', 900000),
    },
    forgotPassword: {
      enabled: env.bool('ADMIN_FORGOT_PASSWORD_ENABLED', true),
    },
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  flags: {
    nps: env.bool('FLAG_NPS', false),
    promoteEE: env.bool('FLAG_PROMOTE_EE', false),
  },
});
