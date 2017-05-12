#!/usr/bin/env bash

set -o nounset -o errexit

BUILD_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR=$(readlink -f "$BUILD_DIR/../")

cd ${PROJECT_DIR}/app-ui && npm run flow
