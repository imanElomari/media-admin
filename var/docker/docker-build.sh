#!/bin/bash

set -o xtrace

docker rmi localhost/postiz || true
# allow build args to be passed via env or fallback to sensible defaults
BUILD_BRAND_TITLE="${BRAND_TITLE:-Postiz}"
BUILD_BRAND_LOGO="${BRAND_LOGO:-/postiz.svg}"

docker build \
	--target dist \
	-t localhost/postiz \
	-f Dockerfile.dev \
	--build-arg BRAND_TITLE="$BUILD_BRAND_TITLE" \
	--build-arg BRAND_LOGO="$BUILD_BRAND_LOGO" \
	.

docker build \
	--target devcontainer \
	-t localhost/postiz-devcontainer \
	-f Dockerfile.dev \
	--build-arg BRAND_TITLE="$BUILD_BRAND_TITLE" \
	--build-arg BRAND_LOGO="$BUILD_BRAND_LOGO" \
	.
