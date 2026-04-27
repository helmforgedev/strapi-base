# Strapi Base

Production-ready Strapi 5.42.0 base image for HelmForge charts.

## Features

- ✅ **Strapi 5.42.0** — Latest stable
- ✅ **Node.js 22 Alpine** — LTS base
- ✅ **Multi-database** — SQLite, PostgreSQL, MySQL
- ✅ **Multi-arch** — linux/amd64, linux/arm64
- ✅ **Security hardened** — Non-root, minimal Alpine
- ✅ **Health check** — `/_health` endpoint
- ✅ **Signed** — Cosign keyless signing
- ✅ **SBOM** — Software Bill of Materials included

## Quick Start

### Docker

```bash
docker pull helmforge/strapi-base:latest

docker run -p 1337:1337 \
  -e APP_KEYS="key1,key2,key3,key4" \
  -e API_TOKEN_SALT="your-salt" \
  -e ADMIN_JWT_SECRET="your-secret" \
  -e JWT_SECRET="your-secret" \
  -e TRANSFER_TOKEN_SALT="your-salt" \
  helmforge/strapi-base:latest
```

### Docker Compose

```bash
docker-compose up -d
```

Access:
- Admin panel: http://localhost:1337/admin
- API: http://localhost:1337/api
- Adminer (DB): http://localhost:9090

### Kubernetes

```bash
helm repo add helmforge https://repo.helmforge.dev
helm install strapi helmforge/strapi
```

## Development vs Production

**Development** (Content-Type Builder enabled):
```bash
docker run -e NODE_ENV=development helmforge/strapi-base:latest
```

**Production** (optimized, schema fixed):
```bash
docker run -e NODE_ENV=production helmforge/strapi-base:latest
```

## Environment Variables

See [.env.example](.env.example) for all configuration options.

### Required
- `APP_KEYS` - Session keys (comma-separated, 4 keys minimum)
- `API_TOKEN_SALT` - API token salt
- `ADMIN_JWT_SECRET` - Admin JWT secret
- `JWT_SECRET` - User JWT secret
- `TRANSFER_TOKEN_SALT` - Transfer token salt

### Database (PostgreSQL)
- `DATABASE_CLIENT=postgres`
- `DATABASE_HOST` - Database host
- `DATABASE_PORT=5432`
- `DATABASE_NAME` - Database name
- `DATABASE_USERNAME` - Database user
- `DATABASE_PASSWORD` - Database password
- `DATABASE_POOL_MIN=0` - Important for Docker!

## Health Check

```bash
curl http://localhost:1337/_health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2026-04-10T02:00:00.000Z",
  "uptime": 123.45,
  "database": "connected",
  "version": "5.42.0"
}
```

## Building

```bash
# Development
docker build -t strapi-base:dev .

# Production
docker build -t strapi-base:prod -f Dockerfile.prod .
```

## Built With

- [strapi-community/strapi-tool-dockerize](https://github.com/strapi-community/strapi-tool-dockerize)
- GitHub Actions for CI/CD
- Cosign for image signing
- Syft for SBOM generation
- Trivy for vulnerability scanning

## Documentation

- Chart: https://helmforge.dev/docs/charts/strapi
- Strapi: https://docs.strapi.io

## License

Apache-2.0
