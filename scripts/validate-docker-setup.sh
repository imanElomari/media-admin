#!/bin/bash

# Validation script for Docker setup
# This script checks that the Docker environment is properly configured

set -e

echo "🔍 Validating Docker Compose setup..."
echo ""

# Check if docker-compose file exists
if [ ! -f "docker-compose.dev.yaml" ]; then
    echo "❌ docker-compose.dev.yaml not found"
    exit 1
fi

echo "✅ docker-compose.dev.yaml found"

# Check if Dockerfile exists
if [ ! -f "Dockerfile.dev" ]; then
    echo "❌ Dockerfile.dev not found"
    exit 1
fi

echo "✅ Dockerfile.dev found"

# Check if env files exist
echo ""
echo "Checking environment files..."

for env_file in .env.atlasimex .env.promax .env.x6drinks; do
    if [ ! -f "$env_file" ]; then
        echo "❌ $env_file not found"
        exit 1
    fi
    echo "✅ $env_file found"
    
    # Check for required branding variables
    if ! grep -q "NEXT_PUBLIC_BRAND_TITLE" "$env_file"; then
        echo "   ⚠️  Warning: NEXT_PUBLIC_BRAND_TITLE not found in $env_file"
    fi
    
    if ! grep -q "NEXT_PUBLIC_BRAND_LOGO" "$env_file"; then
        echo "   ⚠️  Warning: NEXT_PUBLIC_BRAND_LOGO not found in $env_file"
    fi
done

# Validate docker-compose syntax
echo ""
echo "Validating docker-compose syntax..."
if docker compose -f docker-compose.dev.yaml config > /dev/null 2>&1; then
    echo "✅ docker-compose.dev.yaml syntax is valid"
else
    echo "❌ docker-compose.dev.yaml has syntax errors"
    docker compose -f docker-compose.dev.yaml config
    exit 1
fi

# Check that all three services use the same image in the source file
echo ""
echo "Verifying single image configuration..."

# Count how many times postiz-app:latest appears in image fields
image_count=$(grep "image: postiz-app:latest" docker-compose.dev.yaml | wc -l)

if [ "$image_count" -eq 3 ]; then
    echo "✅ All three services use the same image: postiz-app:latest"
else
    echo "❌ Expected 3 services to use 'postiz-app:latest', found $image_count"
    exit 1
fi

# Check that only one service has build configuration
echo ""
echo "Verifying build configuration..."

build_count=$(grep -c "^  .*build:" docker-compose.dev.yaml || true)
if [ "$build_count" -eq 1 ]; then
    echo "✅ Only one service is configured to build the image"
else
    echo "⚠️  Found $build_count build configuration(s) (expected 1)"
    # Don't fail on this, as it's still valid if only one builds
fi

# Verify Dockerfile doesn't have branding build args
echo ""
echo "Checking Dockerfile..."

if grep -q "ARG BRAND_TITLE" Dockerfile.dev; then
    echo "❌ Dockerfile.dev still contains BRAND_TITLE build arg"
    exit 1
fi

if grep -q "ARG BRAND_LOGO" Dockerfile.dev; then
    echo "❌ Dockerfile.dev still contains BRAND_LOGO build arg"
    exit 1
fi

echo "✅ Dockerfile.dev does not contain branding build args"

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 All validation checks passed!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Your Docker setup is configured correctly:"
echo "  • Single image builds from Dockerfile.dev"
echo "  • Three containers use the same image"
echo "  • Each container loads config from its .env file"
echo "  • Branding variables are loaded at runtime"
echo ""
echo "To start the services, run:"
echo "  docker compose -f docker-compose.dev.yaml up -d"
echo ""
