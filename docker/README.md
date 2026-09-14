# Docker Setup for SignFlow

For local development with Docker, run:

```bash
docker compose -f docker/development/compose.yml up -d
```

This starts the required infrastructure services:
- **PostgreSQL Database** (port 54320)
- **Redis** (port 63790)
- **Gotenberg** PDF conversion engine (port 3005)
- **Inbucket** local test mailserver (Web UI on port 9000, SMTP on port 2500)
- **MinIO** local S3-compatible object storage (ports 9001-9002)

Refer to the root [README.md](../README.md) for full setup instructions.
