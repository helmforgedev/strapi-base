export default ({ strapi }) => ({
  async index(ctx) {
    try {
      // Check database connection
      const knex = strapi.db.connection;
      await knex.raw('SELECT 1');

      ctx.body = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: 'connected',
      };
      ctx.status = 200;
    } catch (error: any) {
      ctx.body = {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error.message,
      };
      ctx.status = 503;
    }
  },
});
