#!/usr/bin/env bash

set -o nounset -o errexit

BUILD_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SCRIPTS_DIR=$(readlink -f "$BUILD_DIR/../scripts/")

#bash ${SCRIPTS_DIR}/sbt.sh clean rpm:packageBin
bash ${SCRIPTS_DIR}/sbt.sh clean debian:packageBin
