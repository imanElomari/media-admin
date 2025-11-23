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

### Automated SSH Deployment

This project includes automated deployment to remote servers via SSH using GitHub Actions and Supervisor.

**Quick Start:**
1. Set up your server with Node.js, pnpm, and Supervisor
2. Configure GitHub Secrets (SSH credentials, deploy path)
3. Push to `main` or `production` branch
4. Automatic deployment triggers and reports status

**Full Documentation:** See [Deployment Guide](docs/deployment/DEPLOYMENT.md)

**Required GitHub Secrets:**
- `SSH_HOST` - Remote server hostname/IP
- `SSH_PORT` - SSH port (default: 22)
- `SSH_USER` - SSH username
- `SSH_PRIVATE_KEY` - SSH private key
- `DEPLOY_PATH` - Target path on server
- `SUPERVISOR_SERVICE_NAME` - Supervisor service name

For detailed setup instructions, see:
- [Complete Deployment Guide](docs/deployment/DEPLOYMENT.md)
- [GitHub Secrets Reference](docs/deployment/SECRETS.md)
- [Supervisor Configuration](docs/deployment/supervisor.conf)

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
