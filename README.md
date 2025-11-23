# Media Admin / Postiz

A comprehensive social media management platform built with Node.js, Next.js, and NestJS.

## Features

- Social media post scheduling and management
- Multi-platform support
- Analytics and insights
- Content calendar
- Team collaboration

## Getting Started

### Prerequisites

- Node.js 22.12.0 or higher
- pnpm 10.6.1
- PostgreSQL
- Redis

### Installation

```bash
# Install dependencies
pnpm install

# Generate Prisma client
pnpm run prisma-generate

# Setup database
pnpm run prisma-db-push

# Run development environment
pnpm run dev
```

### Building for Production

```bash
# Build all applications
pnpm run build

# Start production services
pnpm run pm2
```

## Deployment

### Automated SSH Deployment with Docker Compose

This project includes automated deployment to remote servers via SSH using GitHub Actions and Docker Compose.

**Quick Start:**
1. Set up your server with Docker and Docker Compose
2. Configure GitHub Secrets (SSH credentials, deploy path)
3. Push to `main` or `production` branch
4. Automatic deployment triggers and reports status

**Quick Start:** See [Quick Start Guide](docs/deployment/QUICKSTART.md) (15 minutes)  
**Full Documentation:** See [Complete Deployment Guide](docs/deployment/DEPLOYMENT.md)

**Required GitHub Secrets:**
- `SSH_HOST` - Remote server hostname/IP
- `SSH_PORT` - SSH port (default: 22)
- `SSH_USER` - SSH username
- `SSH_PRIVATE_KEY` - SSH private key
- `DEPLOY_PATH` - Target path on server

**Deployment Process:**
1. Build verification in GitHub Actions
2. SSH connection to remote server
3. Codebase sync via rsync
4. Docker Compose build and restart
5. Health check verification
6. Deployment status report

For detailed setup instructions, see:
- [Complete Deployment Guide](docs/deployment/DEPLOYMENT.md)
- [GitHub Secrets Reference](docs/deployment/SECRETS.md)
- [Production Docker Compose](docker-compose.prod.yaml)

## Project Structure

```
.
├── apps/
│   ├── backend/       # NestJS backend API
│   ├── frontend/      # Next.js frontend
│   ├── workers/       # Background workers
│   ├── cron/          # Scheduled jobs
│   └── extension/     # Browser extension
├── libraries/         # Shared libraries
└── docs/
    └── deployment/    # Deployment documentation
```

## Development

```bash
# Run specific app in dev mode
pnpm --filter ./apps/backend run dev
pnpm --filter ./apps/frontend run dev
pnpm --filter ./apps/workers run dev
pnpm --filter ./apps/cron run dev

# Build specific app
pnpm run build:backend
pnpm run build:frontend
pnpm run build:workers
pnpm run build:cron
```

## Testing

```bash
# Run tests
pnpm test
```

## License

AGPL-3.0

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.
