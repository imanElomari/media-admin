# Quick Start: SSH Deployment with Docker Compose

Get your automated deployment up and running in 5 minutes!

## Step 1: Server Setup (5 minutes)

```bash
# Connect to your server
ssh your-user@your-server

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose plugin
sudo apt-get install -y docker-compose-plugin

# Install rsync
sudo apt-get install -y rsync

# Verify installations
docker --version
docker compose version

# Create deployment directory
sudo mkdir -p /var/www/postiz
sudo chown $USER:$USER /var/www/postiz

# Log out and back in for group changes to take effect
exit
```

## Step 2: SSH Key Setup (2 minutes)

```bash
# On your local machine, generate SSH key
ssh-keygen -t ed25519 -C "github-deploy" -f ~/.ssh/github_deploy_key

# Copy public key to server
ssh-copy-id -i ~/.ssh/github_deploy_key.pub your-user@your-server

# Test connection
ssh -i ~/.ssh/github_deploy_key your-user@your-server "echo 'Success!'"

# Display private key (you'll need this for GitHub Secrets)
cat ~/.ssh/github_deploy_key
```

## Step 3: Server Environment Setup (3 minutes)

```bash
# SSH to your server
ssh your-user@your-server

# Navigate to deployment directory
cd /var/www/postiz

# Create .env file
nano .env
```

Add your environment variables:
```env
# Database
DATABASE_URL=postgresql://media_admin:admin1234!@postiz-postgres:5432/media_db

# Redis
REDIS_URL=redis://postiz-redis:6379

# Application
NODE_ENV=production
NEXT_PUBLIC_VERSION=1.0.0

# Add your other required variables here
```

Save and exit (Ctrl+X, Y, Enter).

## Step 4: GitHub Secrets Setup (3 minutes)

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add each:

| Secret Name | Value | Example |
|-------------|-------|---------|
| `SSH_HOST` | Your server IP or domain | `192.168.1.100` |
| `SSH_PORT` | SSH port | `22` |
| `SSH_USER` | SSH username | `deploy` |
| `SSH_PRIVATE_KEY` | Private key contents | Copy from `cat ~/.ssh/github_deploy_key` |
| `DEPLOY_PATH` | Deployment path | `/var/www/postiz` |

**Important:** For `SSH_PRIVATE_KEY`, copy the ENTIRE key including:
```
-----BEGIN OPENSSH PRIVATE KEY-----
...
-----END OPENSSH PRIVATE KEY-----
```

## Step 5: Choose Docker Compose Configuration (1 minute)

On your server, choose which docker-compose file to use:

### Option A: Production (Single Instance)
```bash
cd /var/www/postiz
ln -sf docker-compose.prod.yaml docker-compose.yaml
```

### Option B: Development/Multi-Instance
```bash
cd /var/www/postiz
ln -sf docker-compose.dev.yaml docker-compose.yaml
```

## Step 6: Test Deployment (2 minutes)

1. Go to GitHub → **Actions** → **Deploy to Server via SSH**
2. Click **Run workflow**
3. Select your branch
4. Click **Run workflow**

Watch the deployment progress in GitHub Actions!

## Verify Deployment

After deployment completes:

```bash
# SSH to your server
ssh your-user@your-server

# Check services
cd /var/www/postiz
docker compose ps

# View logs
docker compose logs -f

# Check specific service
docker compose logs postiz-app
```

Expected output:
```
NAME                IMAGE               STATUS
postiz-postgres     postgres:17-alpine  Up X minutes (healthy)
postiz-redis        redis:7.2           Up X minutes (healthy)
postiz-app          postiz-app:latest   Up X minutes (healthy)
```

## Automatic Deployments

From now on, deployments happen automatically when you push to `main` or `production`:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

GitHub Actions will:
1. ✅ Build your application
2. ✅ Connect to your server
3. ✅ Sync the code
4. ✅ Rebuild Docker images
5. ✅ Restart services
6. ✅ Report status

## Troubleshooting

### SSH Connection Failed
```bash
# Test connection manually
ssh -i ~/.ssh/github_deploy_key your-user@your-server

# Check key permissions
chmod 600 ~/.ssh/github_deploy_key
```

### Docker Permission Denied
```bash
# Add user to docker group
sudo usermod -aG docker $USER

# Log out and back in
exit
```

### Services Not Starting
```bash
# Check logs
docker compose logs

# Check disk space
df -h

# Check memory
free -h

# Rebuild
docker compose up -d --build
```

### Environment Variables Missing
```bash
# Check .env file exists
cat /var/www/postiz/.env

# Verify variables are set
docker compose config
```

## Next Steps

- 📖 Read the [Complete Deployment Guide](DEPLOYMENT.md)
- 🔐 Review [Security Best Practices](DEPLOYMENT.md#security-best-practices)
- 📝 Check [GitHub Secrets Reference](SECRETS.md)
- 🐳 Customize [docker-compose.prod.yaml](../../docker-compose.prod.yaml)

## Support

- Check GitHub Actions logs for detailed errors
- Run `docker compose logs` on your server
- Open an issue on GitHub with error details

## Summary

✅ Server ready with Docker and Docker Compose  
✅ SSH keys configured  
✅ GitHub Secrets set  
✅ Environment file created  
✅ Deployment working  

**Total Setup Time:** ~15 minutes

Happy deploying! 🚀
