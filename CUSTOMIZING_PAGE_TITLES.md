# Customizing Page Titles

This document explains how to customize the application name that appears in page titles (browser tabs) using the `NEXT_PUBLIC_BRAND_TITLE` environment variable.

## Overview

By default, the application displays either "Postiz" or "Gitroom" in page titles based on the `IS_GENERAL` environment variable. You can now override this with a custom application name.

## Usage

### Option 1: Docker Compose (Recommended)

Set the `BRAND_TITLE` build argument in your docker-compose file:

```yaml
services:
  your-service:
    build:
      context: .
      dockerfile: Dockerfile.dev
      args:
        BRAND_TITLE: "My Custom App Name"
        BRAND_LOGO: "branding/my-logo.png"
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

You can then set the `BRAND_TITLE` environment variable when running docker compose:

```bash
BRAND_TITLE="My Custom App" docker compose up
```

### Option 2: Environment Variable

Set the `NEXT_PUBLIC_BRAND_TITLE` environment variable before building:

```bash
export NEXT_PUBLIC_BRAND_TITLE="My Custom App Name"
pnpm run build
```

### Option 3: .env file

Add to your `.env` file:

```env
NEXT_PUBLIC_BRAND_TITLE="My Custom App Name"
```

## Examples

When `NEXT_PUBLIC_BRAND_TITLE="Acme Corp"` is set:

- Login page: "Acme Corp Login"
- Calendar page: "Acme Corp Calendar"
- Settings page: "Acme Corp Settings"
- Analytics page: "Acme Corp Analytics"

## Fallback Behavior

If `NEXT_PUBLIC_BRAND_TITLE` is not set, the application falls back to the original behavior:
- If `IS_GENERAL=true`: Uses "Postiz"
- If `IS_GENERAL=false` or not set: Uses "Gitroom"

## Technical Details

The page title is determined by the `getAppName()` helper function located at:
`libraries/helpers/src/utils/get.app.name.ts`

This function is used in the metadata exports of all page components throughout the frontend application.
