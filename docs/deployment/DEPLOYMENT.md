# SSH Deployment Guide with Docker Compose

This guide explains how to set up automated deployment to your server via SSH using GitHub Actions and Docker Compose.

## Overview

The deployment workflow automatically:
1. Builds your application when code is pushed to `main` or `production` branches
2. Connects to your remote server via SSH
3. Syncs the codebase using rsync
4. Builds Docker images on the remote server
5. Restarts Docker Compose services to apply changes
6. Reports deployment status back to GitHub Actions

## Prerequisites

### On Your Server

1. **Install required software:**
   ```bash
   # Update system
   sudo apt-get update

   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   
   # Add your user to docker group (to run docker without sudo)
   sudo usermod -aG docker $USER
   
   # Install Docker Compose (if not already included)
   sudo apt-get install -y docker-compose-plugin

   # Install rsync (if not already installed)
   sudo apt-get install -y rsync
   
   # Verify installations
   docker --version
   docker compose version
   ```

2. **Setup SSH access:**
   ```bash
   # Generate SSH key pair on your local machine (not on the server)
   ssh-keygen -t ed25519 -C "github-deploy" -f ~/.ssh/github_deploy_key

   # Copy the public key to your server
   ssh-copy-id -i ~/.ssh/github_deploy_key.pub your-user@your-server
   ```

3. **Setup deployment directory:**
   ```bash
   # Create deployment directory
   sudo mkdir -p /var/www/postiz
   sudo chown $USER:$USER /var/www/postiz
   cd /var/www/postiz
   ```

4. **Setup environment file:**
   
   Create a `.env` file in your deployment directory with your production settings:
   ```bash
   cd /var/www/postiz
   nano .env
   ```

   Add your environment variables (see `.env.example` for reference):
   ```env
   # Database
   DATABASE_URL=postgresql://media_admin:admin1234!@postiz-postgres:5432/media_db
   
   # Redis
   REDIS_URL=redis://postiz-redis:6379
   
   # Add other required environment variables
   NODE_ENV=production
   NEXT_PUBLIC_VERSION=1.0.0
   # ... etc
   ```

5. **Choose the right docker-compose file:**
   
   For production deployment, use `docker-compose.prod.yaml` or customize it:
   ```bash
   # Option 1: Use production compose file
   ln -sf docker-compose.prod.yaml docker-compose.yaml
   
   # Option 2: Use the dev compose file with multiple instances
   ln -sf docker-compose.dev.yaml docker-compose.yaml
   ```

## GitHub Secrets Configuration

Add the following secrets to your GitHub repository:

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add each of the following:

### Required Secrets

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `SSH_HOST` | Remote server hostname or IP address | `your-server.com` or `192.168.1.100` |
| `SSH_PORT` | SSH port (defaults to 22 if not set) | `22` |
| `SSH_USER` | SSH username for deployment | `deploy` or `ubuntu` |
| `SSH_PRIVATE_KEY` | SSH private key for authentication | Contents of `~/.ssh/github_deploy_key` |
| `DEPLOY_PATH` | Target deployment path on remote server | `/var/www/postiz` |

### Setting SSH_PRIVATE_KEY

To add your private key:
```bash
# Display your private key
cat ~/.ssh/github_deploy_key
```

Copy the entire output (including `-----BEGIN OPENSSH PRIVATE KEY-----` and `-----END OPENSSH PRIVATE KEY-----`) and paste it as the value for `SSH_PRIVATE_KEY` secret in GitHub.

## Usage

### Automatic Deployment

The workflow triggers automatically when you push to `main` or `production` branches:

```bash
git add .
git commit -m "Deploy new features"
git push origin main
```

### Manual Deployment

You can also trigger deployment manually:

1. Go to your repository on GitHub
2. Navigate to **Actions** → **Deploy to Server via SSH**
3. Click **Run workflow**
4. Select the branch and click **Run workflow**

## Workflow Details

### Build Job
- Checks out the code
- Sets up Node.js and pnpm
- Installs dependencies
- Generates Prisma client
- Builds all applications (backend, frontend, workers, cron)

### Deploy Job (runs only if build succeeds)
- Sets up SSH connection
- Syncs codebase to remote server (excludes: .git, node_modules, dist, .env, uploads, var)
- Builds Docker images on remote server
- Stops existing containers
- Starts new containers with Docker Compose
- Checks service health status
- Reports deployment status

## Deployment Status

After deployment completes, you'll see a summary in the GitHub Actions interface showing:
- ✅ Deployment Successful or ❌ Deployment Failed
- Server hostname
- Services status (e.g., 5/5 running)
- Deployment timestamp

## Troubleshooting

### SSH Connection Issues

If SSH connection fails:
```bash
# Test SSH connection manually
ssh -i ~/.ssh/github_deploy_key -p 22 your-user@your-server

# Check SSH key permissions
chmod 600 ~/.ssh/github_deploy_key
chmod 644 ~/.ssh/github_deploy_key.pub
```

### Docker Compose Issues

Check Docker Compose logs:
```bash
# Check service status
cd /var/www/postiz
docker compose ps

# View logs for all services
docker compose logs

# View logs for specific service
docker compose logs postiz-app
docker compose logs postiz-postgres
docker compose logs postiz-redis

# Restart manually
docker compose restart

# Rebuild and restart
docker compose up -d --build
```

### Build Issues on Server

Check for:
- Sufficient disk space: `df -h` (Docker images can be large)
- Sufficient memory: `free -h` (building requires memory)
- Docker version: `docker --version`
- Docker Compose version: `docker compose version`
- Docker service running: `sudo systemctl status docker`

### Deployment Hanging

If deployment hangs during rsync or SSH commands:
- Check network connectivity between GitHub Actions and your server
- Verify firewall rules allow SSH connections
- Increase timeout in workflow if needed

## Environment Variables

Don't forget to set up your `.env` file on the server with all required environment variables. The deployment workflow excludes `.env` files to prevent overwriting your server configuration.

Example `.env` setup on server:
```bash
cd /var/www/postiz
cp .env.example .env
nano .env
# Add your production environment variables
```

## Security Best Practices

1. **Use a dedicated deployment user** - Don't deploy as root
2. **Restrict SSH key permissions** - Use `chmod 600` on private keys
3. **Add user to docker group** - `sudo usermod -aG docker $USER` to run Docker without sudo
4. **Use firewall rules** - Restrict SSH access to known IPs if possible
5. **Rotate SSH keys regularly** - Update deployment keys periodically
6. **Monitor logs** - Set up log monitoring and alerting with Docker Compose logs
7. **Keep secrets secure** - Never commit `.env` or private keys to git
8. **Secure Docker socket** - Ensure proper permissions on `/var/run/docker.sock`

## Advanced Configuration

### Deploy to Multiple Servers

To deploy to multiple servers, you can:
1. Create separate workflows for each environment (staging, production)
2. Use different GitHub environments with different secrets
3. Modify the workflow to deploy to multiple servers in parallel

### Custom Build Commands

Edit the workflow file (`.github/workflows/deploy-ssh.yml`) to customize:
- Build commands
- Pre/post deployment scripts
- Environment variables
- Deployment paths

### Using Different Docker Compose Files

You can customize which docker-compose file to use:

1. **Single instance (production):** Use `docker-compose.prod.yaml`
   ```bash
   ln -sf docker-compose.prod.yaml docker-compose.yaml
   ```

2. **Multiple instances (dev/multi-tenant):** Use `docker-compose.dev.yaml`
   ```bash
   ln -sf docker-compose.dev.yaml docker-compose.yaml
   ```

3. **Custom setup:** Create your own `docker-compose.yaml` based on your needs

## Support

For issues or questions:
1. Check the [main README](../../README.md)
2. Review GitHub Actions logs for detailed error messages
3. Check Docker Compose logs: `docker compose logs -f`
4. Inspect service status: `docker compose ps`
5. Open an issue on GitHub

## License

See the [LICENSE](../../LICENSE) file in the root directory.
