# Customizing Branding (Page Titles and Logo)

This document explains how to customize the application name that appears in page titles (browser tabs) and the logo shown in the UI using environment variables.

## Overview

By default, the application displays either "Postiz" or "Gitroom" in page titles and uses the corresponding logo based on the `IS_GENERAL` environment variable. You can now override both with custom branding.

## Usage

### Option 1: Docker Compose (Recommended)

Set the `BRAND_TITLE` and `BRAND_LOGO` build arguments in your docker-compose file:

```yaml
services:
  your-service:
    build:
      context: .
      dockerfile: Dockerfile.dev
      args:
        BRAND_TITLE: "My Custom App Name"
        BRAND_LOGO: "/path/to/your/logo.svg"
```

Example from the project's `docker-compose.dev.yaml`:

```yaml
postiz-atlasimex:
  build:
    context: .
    dockerfile: Dockerfile.dev
    args:
      BRAND_TITLE: "${BRAND_TITLE:-Atlasimex Media}"
      BRAND_LOGO: "${BRAND_LOGO:-branding/atlasimex.png}"
```

You can then set both environment variables when running docker compose:

```bash
BRAND_TITLE="My Custom App" BRAND_LOGO="/my-logo.svg" docker compose up
```

### Option 2: Environment Variables

Set the environment variables before building:

```bash
export NEXT_PUBLIC_BRAND_TITLE="My Custom App Name"
export NEXT_PUBLIC_BRAND_LOGO="/path/to/your/logo.svg"
pnpm run build
```

### Option 3: .env file

Add to your `.env` file:

```env
NEXT_PUBLIC_BRAND_TITLE="My Custom App Name"
NEXT_PUBLIC_BRAND_LOGO="/path/to/your/logo.svg"
```

## Examples

### Page Titles

When `NEXT_PUBLIC_BRAND_TITLE="Acme Corp"` is set:

- Login page: "Acme Corp Login"
- Calendar page: "Acme Corp Calendar"
- Settings page: "Acme Corp Settings"
- Analytics page: "Acme Corp Analytics"

### Logo

When `NEXT_PUBLIC_BRAND_LOGO="/acme-logo.svg"` is set:
- The logo at `/acme-logo.svg` will be displayed throughout the UI
- Logo path should be relative to the `public` directory
- Supports both local files and absolute URLs

## Fallback Behavior

If custom branding is not set, the application falls back to the original behavior:

**Page Titles:**
- If `IS_GENERAL=true`: Uses "Postiz"
- If `IS_GENERAL=false` or not set: Uses "Gitroom"

**Logo:**
- If `IS_GENERAL=true`: Uses "/postiz.svg"
- If `IS_GENERAL=false` or not set: Uses "/logo.svg"

## Technical Details

**Page Titles:**
- Determined by the `getAppName()` helper function at `libraries/helpers/src/utils/get.app.name.ts`
- Used in metadata exports of all page components

**Logo:**
- Determined by the `getAppLogo()` helper function at `libraries/helpers/src/utils/get.app.logo.ts`
- Available in both server-side (via helper) and client-side (via VariableContext) components
- Used in navigation, auth pages, and preview pages
