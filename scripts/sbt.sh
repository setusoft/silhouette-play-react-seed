#!/usr/bin/env bash

set -o nounset -o errexit

SCRIPTS_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SBT_LAUNCHER_DIR=${SBT_LAUNCHER_DIR:-${HOME}/.sbt/launchers}

bash ${SCRIPTS_DIR}/sbt-runner.sh -sbt-launch-dir ${SBT_LAUNCHER_DIR} -jvm-opts project/build-jvm-opts "$@"
