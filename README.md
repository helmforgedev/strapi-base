# Strapi Base

Production-ready Strapi base image with full plugin support for HelmForge charts.

## Features

- ✅ **Strapi 5.42.0** — Latest stable version
- ✅ **Multi-database support** — SQLite, PostgreSQL, MySQL
- ✅ **Upload providers** — Local, AWS S3, Cloudinary
- ✅ **Email providers** — SMTP, SendGrid
- ✅ **GraphQL plugin** — Built-in with configurable settings
- ✅ **Health check endpoint** — `/_health` for Kubernetes probes
- ✅ **Security hardened** — Non-root user, minimal image, security updates
- ✅ **Multi-arch support** — linux/amd64, linux/arm64
- ✅ **Signed images** — Cosign keyless signing
- ✅ **SBOM included** — Software Bill of Materials

## Quick Start

### Docker

```bash
# Pull image
docker pull docker.io/helmforge/strapi-base:latest

# Run with SQLite (development)
docker run -p 1337:1337 \
  -e APP_KEYS="$(openssl rand -base64 32)" \
  -e API_TOKEN_SALT="$(openssl rand -base64 16)" \
  -e ADMIN_JWT_SECRET="$(openssl rand -base64 32)" \
  -e JWT_SECRET="$(openssl rand -base64 32)" \
  -e TRANSFER_TOKEN_SALT="$(openssl rand -base64 16)" \
  docker.io/helmforge/strapi-base:latest
```

### Kubernetes with Helm

```bash
# Add HelmForge repository
helm repo add helmforge https://repo.helmforge.dev

# Install Strapi
helm install strapi helmforge/strapi \
  --set image.repository=docker.io/helmforge/strapi-base \
  --set image.tag=1.0.0
```

## Environment Variables

See [.env.example](.env.example) for all available configuration options.

### Required Secrets

Generate with:
```bash
openssl rand -base64 32  # APP_KEYS, secrets
openssl rand -base64 16  # Salts
```

### Database Support

- **SQLite** — Default, single replica only
- **PostgreSQL** — Production, multi-replica ready
- **MySQL** — Production, multi-replica ready

### Upload Providers

- **local** — Single replica only
- **aws-s3** — Multi-replica ready (S3, MinIO, R2, Backblaze)
- **cloudinary** — Multi-replica ready

### Email Providers

- **smtp** — Any SMTP server
- **sendgrid** — SendGrid API

## Health Check

Endpoint: `/_health`

```bash
curl http://localhost:1337/_health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2026-04-09T18:30:00.000Z",
  "uptime": 123.456,
  "database": "connected"
}
```

## Building from Source

```bash
git clone https://github.com/helmforgedev/strapi-base
cd strapi-base
npm ci
npm run build
docker build -t strapi-base:dev .
```

## Multi-Replica Deployments

⚠️ **Requirements for replicas > 1**:
- External database (PostgreSQL or MySQL)
- S3-compatible or Cloudinary uploads
- Do NOT use SQLite or local file uploads

## Plugins Included

- GraphQL API
- Documentation
- i18n
- Users & Permissions
- Cloud integration
- Sentry error tracking

## Security

- Non-root user (UID/GID: 1000)
- Minimal Alpine Linux 3.22
- Security updates applied
- Images signed with Cosign
- SBOM included

## What's Included

- **Strapi**: 5.42.0 (latest stable)
- **Node.js**: 22.14.0 LTS  
- **Alpine**: 3.22
- **Core Plugins**: users-permissions, cloud, GraphQL, Sentry
- **Upload Providers**: AWS S3, Cloudinary
- **Email Providers**: SMTP (Nodemailer), SendGrid
- **Databases**: SQLite, PostgreSQL, MySQL

## CI/CD

Automated release workflow requires GitHub secrets configured at repository settings.

Docker Hub credentials needed for image publishing.

## Support

- **Chart Docs**: https://helmforge.dev/docs/charts/strapi
- **Strapi Docs**: https://docs.strapi.io
- **Issues**: https://github.com/helmforgedev/strapi-base/issues

## License

MIT License - see [LICENSE](LICENSE)

---

**Maintained by**: [HelmForge Team](https://helmforge.dev)

