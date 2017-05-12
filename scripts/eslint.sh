#!/usr/bin/env bash

set -o nounset -o errexit

SCRIPTS_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR=$(readlink -f "$SCRIPTS_DIR/../")

cd ${PROJECT_DIR}/app-ui && npm run lint --silent $@
