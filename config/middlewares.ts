export default ({ env }) => [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            'market-assets.strapi.io',
            ...(env('UPLOAD_PROVIDER') === 'aws-s3' && env('S3_BASE_URL')
              ? [env('S3_BASE_URL')]
              : []),
            ...(env('UPLOAD_PROVIDER') === 'cloudinary'
              ? ['https://res.cloudinary.com']
              : []),
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'market-assets.strapi.io',
            ...(env('UPLOAD_PROVIDER') === 'aws-s3' && env('S3_BASE_URL')
              ? [env('S3_BASE_URL')]
              : []),
            ...(env('UPLOAD_PROVIDER') === 'cloudinary'
              ? ['https://res.cloudinary.com']
              : []),
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  {
    name: 'strapi::body',
    config: {
      jsonLimit: env('BODY_PARSER_JSON_LIMIT', '1mb'),
      formLimit: env('BODY_PARSER_FORM_LIMIT', '56kb'),
      textLimit: env('BODY_PARSER_TEXT_LIMIT', '1mb'),
    },
  },
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
