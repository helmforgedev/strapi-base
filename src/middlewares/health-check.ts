export default () => {
  return async (ctx: any, next: any) => {
    if (ctx.request.url === '/_health' && ctx.request.method === 'GET') {
      try {
        // Test database connection
        await strapi.db.connection.raw('SELECT 1');

        ctx.status = 200;
        ctx.body = {
          status: 'ok',
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
          database: 'connected',
          version: strapi.config.info.strapi,
        };
      } catch (error: any) {
        ctx.status = 503;
        ctx.body = {
          status: 'error',
          timestamp: new Date().toISOString(),
          database: 'disconnected',
          error: error.message,
        };
      }
      return;
    }

    await next();
  };
};
