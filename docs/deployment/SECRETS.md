# GitHub Secrets Quick Reference

This file provides a quick reference for setting up the required GitHub Secrets for SSH deployment.

## Required Secrets

### SSH_HOST
**Description:** Remote server hostname or IP address  
**Example:** `your-server.com` or `192.168.1.100`  
**How to get:** Your server's public IP or domain name

### SSH_PORT
**Description:** SSH port number  
**Default:** `22`  
**Example:** `22` or `2222`  
**How to get:** Check your server's SSH configuration (`/etc/ssh/sshd_config`)

### SSH_USER
**Description:** SSH username for deployment  
**Example:** `deploy`, `ubuntu`, `www-data`  
**How to get:** The user you created on your server for deployments

### SSH_PRIVATE_KEY
**Description:** SSH private key for authentication  
**Format:** Full private key including headers  
**How to get:**
```bash
# Generate a new SSH key pair
ssh-keygen -t ed25519 -C "github-deploy" -f ~/.ssh/github_deploy_key

# Display the private key (copy all of this)
cat ~/.ssh/github_deploy_key

# Add the public key to your server
ssh-copy-id -i ~/.ssh/github_deploy_key.pub your-user@your-server
```

**Important:** Copy the entire output including:
```
-----BEGIN OPENSSH PRIVATE KEY-----
...
-----END OPENSSH PRIVATE KEY-----
```

### DEPLOY_PATH
**Description:** Target deployment path on remote server  
**Example:** `/var/www/postiz`, `/home/deploy/app`, `/opt/postiz`  
**How to get:** Choose where you want to deploy on your server

**Setup on server:**
```bash
# Create deployment directory
sudo mkdir -p /var/www/postiz
sudo chown your-user:your-user /var/www/postiz
```



## Quick Setup Checklist

- [ ] Generate SSH key pair
- [ ] Copy public key to server
- [ ] Create deployment directory on server
- [ ] Install Docker and Docker Compose
- [ ] Setup environment file (.env) on server
- [ ] Choose and link appropriate docker-compose file
- [ ] Test SSH connection manually
- [ ] Add all secrets to GitHub repository
- [ ] Test deployment with manual workflow trigger

## Testing Your Setup

After adding all secrets, test the configuration:

1. **Test SSH connection locally:**
```bash
ssh -i ~/.ssh/github_deploy_key your-user@your-server "echo 'Connection successful'"
```

2. **Test Docker access:**
```bash
ssh -i ~/.ssh/github_deploy_key your-user@your-server "docker ps && docker compose version"
```

3. **Trigger manual deployment:**
   - Go to GitHub Actions → Deploy to Server via SSH
   - Click "Run workflow"
   - Monitor the execution

## Common Issues

### Private Key Format
❌ Wrong: Copying key without headers  
✅ Correct: Include `-----BEGIN OPENSSH PRIVATE KEY-----` and `-----END OPENSSH PRIVATE KEY-----`

### Path Issues
❌ Wrong: Using relative paths like `./deploy` or `~/app`  
✅ Correct: Using absolute paths like `/var/www/postiz`

### Permissions
❌ Wrong: SSH key with wrong permissions (644, 755)  
✅ Correct: SSH key with 600 permissions on server



## Security Notes

1. **Never commit private keys** - Only add them as GitHub Secrets
2. **Use dedicated deployment user** - Don't use root or personal accounts
3. **Restrict SSH key** - Use `authorized_keys` options to limit key usage if needed
   - Ensure deployment user is in the `docker` group to run Docker commands
   - Consider using SSH key restrictions for specific commands only
4. **Rotate keys regularly** - Update deployment keys every few months
5. **Monitor access logs** - Check `/var/log/auth.log` for suspicious activity

## Updating Secrets

To update a secret:
1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click on the secret name
3. Click **Update secret**
4. Enter new value and save

## See Also

- [Full Deployment Guide](DEPLOYMENT.md) - Complete setup instructions
- [Production Docker Compose](../../docker-compose.prod.yaml) - Production configuration
- [Main README](../../README.md) - Project documentation
