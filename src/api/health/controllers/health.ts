export default {
  check: async (ctx) => {
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
    } catch (error) {
      ctx.status = 503;
      ctx.body = {
        status: 'error',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        error: error.message,
      };
    }
  },
};
