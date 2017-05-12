#!/usr/bin/env bash

set -o nounset -o errexit

SCRIPTS_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

bash ${SCRIPTS_DIR}/sbt.sh scalastyle test:scalastyle
