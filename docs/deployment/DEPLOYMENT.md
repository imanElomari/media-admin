# SSH Deployment Guide

This guide explains how to set up automated deployment to your server via SSH using GitHub Actions.

## Overview

The deployment workflow automatically:
1. Builds your application when code is pushed to `main` or `production` branches
2. Connects to your remote server via SSH
3. Syncs the codebase using rsync
4. Installs dependencies and builds the application
5. Restarts the Supervisor service to apply changes
6. Reports deployment status back to GitHub Actions

## Prerequisites

### On Your Server

1. **Install required software:**
   ```bash
   # Install Node.js 22.12.0
   curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install pnpm
   sudo npm install -g pnpm@10.6.1

   # Install Supervisor
   sudo apt-get update
   sudo apt-get install -y supervisor

   # Install rsync (if not already installed)
   sudo apt-get install -y rsync
   ```

2. **Setup SSH access:**
   ```bash
   # Generate SSH key pair on your local machine (not on the server)
   ssh-keygen -t ed25519 -C "github-deploy" -f ~/.ssh/github_deploy_key

   # Copy the public key to your server
   ssh-copy-id -i ~/.ssh/github_deploy_key.pub your-user@your-server
   ```

3. **Configure Supervisor:**
   
   Copy the `supervisor.conf` file from this directory to your server:
   ```bash
   sudo cp docs/deployment/supervisor.conf /etc/supervisor/conf.d/postiz.conf
   ```

   Edit the file to match your setup:
   ```bash
   sudo nano /etc/supervisor/conf.d/postiz.conf
   ```

   Update these values:
   - `directory=/path/to/your/deployment` - Change to your actual deployment path
   - `user=www-data` - Change to your deployment user if different
   - Environment variables in the `environment=` lines

   Reload Supervisor:
   ```bash
   sudo supervisorctl reread
   sudo supervisorctl update
   ```

4. **Grant sudo permissions for Supervisor (optional but recommended):**
   
   Create a sudoers file to allow your deployment user to restart Supervisor without password:
   ```bash
   sudo visudo -f /etc/sudoers.d/deploy-supervisor
   ```

   Add this line (replace `your-user` with your deployment username):
   ```
   your-user ALL=(ALL) NOPASSWD: /usr/bin/supervisorctl restart postiz*, /usr/bin/supervisorctl start postiz*, /usr/bin/supervisorctl stop postiz*, /usr/bin/supervisorctl status postiz*
   ```

   Save and exit. Test with:
   ```bash
   sudo supervisorctl status
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
| `SUPERVISOR_SERVICE_NAME` | Name of the Supervisor service group | `postiz:*` or `postiz` |

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
- Installs dependencies on remote server
- Generates Prisma client on remote server
- Builds applications on remote server
- Restarts Supervisor service
- Checks service status
- Reports deployment status

## Deployment Status

After deployment completes, you'll see a summary in the GitHub Actions interface showing:
- ✅ Deployment Successful or ❌ Deployment Failed
- Server hostname
- Service status
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

### Supervisor Issues

Check Supervisor logs:
```bash
# Check service status
sudo supervisorctl status postiz:*

# View logs
sudo tail -f /var/log/supervisor/postiz-backend.log
sudo tail -f /var/log/supervisor/postiz-backend-error.log

# Restart manually
sudo supervisorctl restart postiz:*
```

### Build Issues on Server

Check for:
- Sufficient disk space: `df -h`
- Sufficient memory: `free -h`
- Node.js version: `node --version` (should be 22.12.0)
- pnpm version: `pnpm --version` (should be 10.6.1)

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
3. **Limit sudo access** - Only grant necessary Supervisor permissions
4. **Use firewall rules** - Restrict SSH access to known IPs if possible
5. **Rotate SSH keys regularly** - Update deployment keys periodically
6. **Monitor logs** - Set up log monitoring and alerting
7. **Keep secrets secure** - Never commit `.env` or private keys to git

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

### Using PM2 Instead of Supervisor

If you prefer PM2 over Supervisor, modify the deployment step to use PM2 commands:
```bash
# Instead of supervisorctl
pm2 restart all
pm2 status
```

## Support

For issues or questions:
1. Check the [main README](../../README.md)
2. Review GitHub Actions logs for detailed error messages
3. Check server logs in `/var/log/supervisor/`
4. Open an issue on GitHub

## License

See the [LICENSE](../../LICENSE) file in the root directory.
