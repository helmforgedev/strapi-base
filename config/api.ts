export default ({ env }) => ({
  rest: {
    defaultLimit: env.int('API_REST_DEFAULT_LIMIT', 25),
    maxLimit: env.int('API_REST_MAX_LIMIT', 100),
    withCount: true,
  },
});
