# Docker Setup Guide

## Overview

This project uses a single Docker image to run multiple branded instances of the Postiz application. Each instance loads its configuration from a separate environment file at runtime.

## Architecture

- **Single Image**: One Docker image (`postiz-app:latest`) is built from `Dockerfile.dev`
- **Multiple Containers**: Three containers run from the same image:
  - `postiz-atlasimex` - Atlasimex Media instance
  - `postiz-promax` - Promax Media instance
  - `postiz-x6drinks` - X6Drinks Media instance
- **Runtime Configuration**: Each container loads its environment variables from its respective `.env.xxxxx` file

## Environment Files

Each instance has its own environment file with instance-specific configuration:

- `.env.atlasimex` - Configuration for Atlasimex Media
- `.env.promax` - Configuration for Promax Media
- `.env.x6drinks` - Configuration for X6Drinks Media

### Required Environment Variables

Each environment file must include:

```bash
# URLs
MAIN_URL=https://your-domain.com
FRONTEND_URL=https://your-domain.com
NEXT_PUBLIC_BACKEND_URL=https://your-domain.com/api
BACKEND_INTERNAL_URL=http://container-name:5000

# Database & Redis
DATABASE_URL="postgresql://media_admin:admin1234!@postiz-postgres:5432/media_db"
REDIS_URL="redis://postiz-redis:6379"

# Security
JWT_SECRET="your-secure-jwt-secret"

# Branding (loaded at runtime)
BRAND_TITLE="Your Brand Name"
BRAND_LOGO="/path/to/your/logo.png"
NEXT_PUBLIC_BRAND_TITLE="Your Brand Name"
NEXT_PUBLIC_BRAND_LOGO="/path/to/your/logo.png"

# Storage
STORAGE_PROVIDER=cloudflare
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_ACCESS_KEY=your-access-key
CLOUDFLARE_SECRET_ACCESS_KEY=your-secret-key
CLOUDFLARE_BUCKETNAME=your-bucket-name
CLOUDFLARE_BUCKET_URL=https://your-bucket-url
CLOUDFLARE_REGION=auto

# Other settings
IS_GENERAL="true"
DISABLE_REGISTRATION="false"
NOT_SECURED=false
```

## Usage

### Build and Start All Services

```bash
docker compose -f docker-compose.dev.yaml up -d
```

This will:
1. Build the `postiz-app:latest` image (once)
2. Start all three branded instances
3. Each instance will load its configuration from its respective `.env` file

### Start Specific Instance

```bash
docker compose -f docker-compose.dev.yaml up -d postiz-atlasimex
```

### View Logs

```bash
# All instances
docker compose -f docker-compose.dev.yaml logs -f

# Specific instance
docker compose -f docker-compose.dev.yaml logs -f postiz-atlasimex
```

### Rebuild Image

If you make code changes and need to rebuild:

```bash
docker compose -f docker-compose.dev.yaml build
docker compose -f docker-compose.dev.yaml up -d
```

### Stop Services

```bash
docker compose -f docker-compose.dev.yaml down
```

## How Branding Works

The branding system uses runtime environment variables:

1. **Build Time**: The Docker image is built without any brand-specific values
2. **Runtime**: Each container loads `NEXT_PUBLIC_BRAND_TITLE` and `NEXT_PUBLIC_BRAND_LOGO` from its `.env` file
3. **Server-Side Rendering**: Next.js reads these variables on the server during each request
4. **Client Delivery**: The values are passed to the client through React context

This approach allows:
- Single image for all instances
- Easy brand customization per instance
- No rebuild needed to change branding

## Reverse Proxy

Caddy is configured to route traffic to each instance:

- `mediaadmin.atlasimex.es` → `postiz-atlasimex:5000`
- `mediaadmin.promaxdrinks.com` → `postiz-promax:5000`
- `mediaadmin.x6drinks.com` → `postiz-x6drinks:5000`

## Troubleshooting

### Image Not Found

If you see "image not found" errors, ensure the first service (postiz-atlasimex) builds the image:

```bash
docker compose -f docker-compose.dev.yaml build postiz-atlasimex
```

### Branding Not Applied

1. Check that your `.env.xxxxx` file contains the branding variables
2. Verify the container is loading the correct env file
3. Restart the container: `docker compose -f docker-compose.dev.yaml restart postiz-atlasimex`

### Database Connection Issues

Ensure the `DATABASE_URL` in your env file points to `postiz-postgres:5432` (the container name, not localhost)

## Adding a New Instance

To add a new branded instance:

1. Create a new `.env.newbrand` file with all required variables
2. Add a new service in `docker-compose.dev.yaml`:

```yaml
  postiz-newbrand:
    image: postiz-app:latest
    container_name: postiz-newbrand
    restart: always
    env_file:
      - .env.newbrand
    networks:
      - postiz-network
    depends_on:
      - postiz-postgres
      - postiz-redis
```

3. Add routing in `Caddyfile`:

```
newbrand.example.com {
    reverse_proxy postiz-newbrand:5000
}
```

4. Start the new instance:

```bash
docker compose -f docker-compose.dev.yaml up -d postiz-newbrand
```
