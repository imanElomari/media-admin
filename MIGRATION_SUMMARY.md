# Docker Setup Migration Summary

## What Changed

This repository has been updated from a **multi-image Docker setup** to a **single-image, multi-container setup** with runtime environment configuration.

## Before (Old Setup)

❌ **Three separate image builds:**
```yaml
postiz-atlasimex:
  build:
    args:
      BRAND_TITLE: "Atlasimex Media"
      BRAND_LOGO: "/branding/atlasimex.png"

postiz-promax:
  build:
    args:
      BRAND_TITLE: "Promax Media"
      BRAND_LOGO: "/branding/promax.png"

postiz-x6drinks:
  build:
    args:
      BRAND_TITLE: "X6Drinks Media"
      BRAND_LOGO: "/branding/x6drinks.png"
```

**Problems:**
- Built the same codebase 3 times
- Slow build process
- Large disk space usage
- Branding baked into images at build time
- Required rebuild to change branding

## After (New Setup)

✅ **Single image, three containers:**
```yaml
postiz-atlasimex:
  build: # Only builds once
    context: .
    dockerfile: Dockerfile.dev
  image: postiz-app:latest
  env_file:
    - .env.atlasimex

postiz-promax:
  image: postiz-app:latest  # Reuses the image
  env_file:
    - .env.promax

postiz-x6drinks:
  image: postiz-app:latest  # Reuses the image
  env_file:
    - .env.x6drinks
```

**Benefits:**
- Single image build (3x faster)
- Reduced disk space
- Runtime configuration via env files
- No rebuild needed to change branding
- Easier maintenance

## Key Changes

### 1. Dockerfile.dev
**Removed:**
```dockerfile
ARG BRAND_TITLE
ARG BRAND_LOGO
ENV NEXT_PUBLIC_BRAND_TITLE=$BRAND_TITLE
ENV NEXT_PUBLIC_BRAND_LOGO=$BRAND_LOGO
```

The Docker image is now built without any brand-specific values.

### 2. docker-compose.dev.yaml
**Changed:**
- Only `postiz-atlasimex` has a `build` section
- All three services reference `image: postiz-app:latest`
- Each service loads branding from its respective `.env.xxxxx` file
- Removed all `build.args` sections

### 3. Environment Files
Each `.env.xxxxx` file now contains runtime branding:

```bash
NEXT_PUBLIC_BRAND_TITLE="Your Brand Name"
NEXT_PUBLIC_BRAND_LOGO="/path/to/your/logo.png"
```

## How to Use

### Build and Start All Services
```bash
docker compose -f docker-compose.dev.yaml up -d
```

This will:
1. Build `postiz-app:latest` image once
2. Start all three branded instances
3. Each instance loads its config from its `.env.xxxxx` file

### Update Branding
1. Edit the branding variables in the respective `.env.xxxxx` file
2. Restart the container:
   ```bash
   docker compose -f docker-compose.dev.yaml restart postiz-atlasimex
   ```

No rebuild needed! 🎉

### Rebuild the Image (for code changes)
```bash
docker compose -f docker-compose.dev.yaml build
docker compose -f docker-compose.dev.yaml up -d
```

## Validation

A validation script is included to verify the setup:

```bash
./scripts/validate-docker-setup.sh
```

This checks:
- All required files exist
- Docker Compose syntax is valid
- All services use the same image
- Only one service builds the image
- Environment files contain branding variables

## Documentation

- **[DOCKER_SETUP.md](DOCKER_SETUP.md)** - Comprehensive Docker setup guide
- **[CUSTOMIZING_PAGE_TITLES.md](CUSTOMIZING_PAGE_TITLES.md)** - Branding customization guide
- **scripts/validate-docker-setup.sh** - Setup validation script

## Migration Checklist for Existing Deployments

If you're updating an existing deployment:

- [ ] Pull the latest changes
- [ ] Review the new docker-compose.dev.yaml
- [ ] Ensure all `.env.xxxxx` files have branding variables
- [ ] Run validation script: `./scripts/validate-docker-setup.sh`
- [ ] Remove old images: `docker image prune -a`
- [ ] Build new image: `docker compose -f docker-compose.dev.yaml build`
- [ ] Start containers: `docker compose -f docker-compose.dev.yaml up -d`
- [ ] Verify each instance loads its branding correctly

## Technical Details

### Why This Works with Next.js

Next.js normally requires `NEXT_PUBLIC_*` variables at build time. However, this setup works because:

1. **Server Components**: The branding variables are read in Next.js server components (layout.tsx)
2. **Runtime Evaluation**: Server components evaluate at request time, not build time
3. **React Context**: Values are passed to the client through React context
4. **SSR**: Each request reads fresh values from the environment

This allows runtime configuration while maintaining the benefits of Next.js SSR.

## Troubleshooting

### Branding Not Appearing
1. Check the `.env.xxxxx` file contains the branding variables
2. Restart the container: `docker compose -f docker-compose.dev.yaml restart <service>`
3. Check container logs: `docker compose -f docker-compose.dev.yaml logs <service>`

### Build Issues
1. Ensure only `postiz-atlasimex` has a build section
2. Run validation: `./scripts/validate-docker-setup.sh`
3. Clean build: `docker compose -f docker-compose.dev.yaml build --no-cache`

### Container Won't Start
1. Check Docker Compose syntax: `docker compose -f docker-compose.dev.yaml config`
2. Verify env file exists: `ls -la .env.*`
3. Check logs: `docker compose -f docker-compose.dev.yaml logs`

## Questions?

See the documentation:
- [DOCKER_SETUP.md](DOCKER_SETUP.md) - Complete Docker guide
- [CUSTOMIZING_PAGE_TITLES.md](CUSTOMIZING_PAGE_TITLES.md) - Branding guide

Or run the validation script:
```bash
./scripts/validate-docker-setup.sh
```
