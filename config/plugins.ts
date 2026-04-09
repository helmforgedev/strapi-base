export default ({ env }) => {
  const config: any = {};

  // GraphQL Plugin
  config.graphql = {
    enabled: true,
    config: {
      endpoint: env('GRAPHQL_ENDPOINT', '/graphql'),
      playgroundAlways: env.bool('GRAPHQL_PLAYGROUND_ENABLED', false),
      apolloServer: {
        introspection: env.bool('GRAPHQL_INTROSPECTION', false),
        playground: env.bool('GRAPHQL_PLAYGROUND_ENABLED', false),
      },
      maxDepth: env.int('GRAPHQL_MAX_DEPTH', 10),
      maxComplexity: env.int('GRAPHQL_MAX_COMPLEXITY', 1000),
      apolloSandbox: env.bool('GRAPHQL_APOLLO_SANDBOX', false),
    },
  };

  // Email Provider
  const emailProvider = env('EMAIL_PROVIDER', 'none');

  if (emailProvider === 'smtp') {
    config.email = {
      config: {
        provider: 'nodemailer',
        providerOptions: {
          host: env('SMTP_HOST'),
          port: env.int('SMTP_PORT', 587),
          auth: {
            user: env('SMTP_USERNAME'),
            pass: env('SMTP_PASSWORD'),
          },
          secure: env.bool('SMTP_SECURE', false),
          requireTLS: env.bool('SMTP_REQUIRE_TLS', true),
          ignoreTLS: env.bool('SMTP_IGNORE_TLS', false),
        },
        settings: {
          defaultFrom: env('EMAIL_DEFAULT_FROM', 'noreply@example.com'),
          defaultReplyTo: env('EMAIL_DEFAULT_REPLY_TO', ''),
        },
      },
    };
  } else if (emailProvider === 'sendgrid') {
    config.email = {
      config: {
        provider: 'sendgrid',
        providerOptions: {
          apiKey: env('SENDGRID_API_KEY'),
        },
        settings: {
          defaultFrom: env('EMAIL_DEFAULT_FROM', 'noreply@example.com'),
          defaultReplyTo: env('EMAIL_DEFAULT_REPLY_TO', ''),
        },
      },
    };
  }

  // Upload Provider
  const uploadProvider = env('UPLOAD_PROVIDER', 'local');

  if (uploadProvider === 'aws-s3') {
    config.upload = {
      config: {
        provider: 'aws-s3',
        providerOptions: {
          baseUrl: env('S3_BASE_URL', ''),
          rootPath: env('S3_PREFIX', ''),
          s3Options: {
            credentials: {
              accessKeyId: env('S3_ACCESS_KEY_ID'),
              secretAccessKey: env('S3_SECRET_ACCESS_KEY'),
            },
            region: env('S3_REGION', 'us-east-1'),
            endpoint: env('S3_ENDPOINT', ''),
            params: {
              ACL: env('S3_ACL', 'private'),
              Bucket: env('S3_BUCKET'),
              ...(env('S3_PARAMS') ? JSON.parse(env('S3_PARAMS')) : {}),
            },
          },
        },
      },
    };
  } else if (uploadProvider === 'cloudinary') {
    config.upload = {
      config: {
        provider: 'cloudinary',
        providerOptions: {
          cloud_name: env('CLOUDINARY_CLOUD_NAME'),
          api_key: env('CLOUDINARY_API_KEY'),
          api_secret: env('CLOUDINARY_API_SECRET'),
        },
      },
    };
  }

  // Documentation Plugin
  config.documentation = {
    enabled: env.bool('DOCUMENTATION_ENABLED', false),
  };

  // Users Permissions Plugin
  config['users-permissions'] = {
    enabled: true,
    config: {
      jwt: {
        secret: env('JWT_SECRET'),
        expiresIn: env('JWT_EXPIRATION', '7d'),
      },
    },
  };

  // Sentry Plugin (optional)
  if (env('SENTRY_DSN')) {
    config.sentry = {
      enabled: true,
      config: {
        dsn: env('SENTRY_DSN'),
        environment: env('NODE_ENV', 'production'),
        tracesSampleRate: env.float('SENTRY_TRACES_SAMPLE_RATE', 0.1),
      },
    };
  }

  return config;
};
