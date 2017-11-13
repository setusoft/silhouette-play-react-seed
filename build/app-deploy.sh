#!/usr/bin/env bash

set -o nounset -o errexit

BUILD_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR=$(readlink -f "$BUILD_DIR/../")

PROJECT_NAME=${PROJECT_NAME:-""}
ENVIRONMENT_NAME=${ENVIRONMENT_NAME:-""}
APP_CONFIG=${APP_CONFIG:-"application.conf"}
APP_LOGGER=${APP_LOGGER:-"logback.xml"}
APP_PORT=${APP_PORT:-"9000"}
DEPLOYMENT_SSH_CONFIG="$BUILD_DIR/files/deployment.config"
DEPLOYMENT_KEY_FILE="$BUILD_DIR/files/deployment.key"
DEPLOYMENT_ENV_NAME=${ENVIRONMENT_NAME^^}
DEPLOYMENT_KEY_NAME="${DEPLOYMENT_ENV_NAME}_DEPLOYMENT_KEY"
DEPLOYMENT_KEY=${!DEPLOYMENT_KEY_NAME:-}
DEPLOYMENT_HOST=${DEPLOYMENT_HOST:-"localhost"}
DEPLOYMENT_USER=${DEPLOYMENT_USER:-"deployment"}
DEPLOYMENT_DIR="~/install/$PROJECT_NAME"
KEEP_FILES=5
INSTALL_FILE="app-install.sh"
INSTALL_CMD="$INSTALL_FILE -n=$PROJECT_NAME -e=$ENVIRONMENT_NAME -c=$APP_CONFIG -l=$APP_LOGGER -p=$APP_PORT -k=$KEEP_FILES"

RPM_FILE=$(find ${PROJECT_DIR}/target/rpm/RPMS/noarch/ -name "*.rpm" -print | head -n 1)

# Check if the deployment artifacts exists
if [ "$RPM_FILE" == "" ]; then
    echo "Cannot find the deployment artifacts!"
    exit 1
fi

# Check if deployment key can be determined for the current environment
if [ "$DEPLOYMENT_KEY" == "" ]; then
    echo "Cannot determine deployment key for environment: $ENVIRONMENT_NAME!"
    exit 1
fi

# Create the files directory if not exists
mkdir -p "$BUILD_DIR/files"

# Create the deployment key
printf "%s\n" "$DEPLOYMENT_KEY" > ${DEPLOYMENT_KEY_FILE}

# Create a SSH config to connect to the deployment host
printf "%s\n" \
    "Host $DEPLOYMENT_HOST" \
    "    HostName $DEPLOYMENT_HOST" \
    "    IdentityFile $DEPLOYMENT_KEY_FILE" \
    "    IdentitiesOnly yes" \
    "    StrictHostKeyChecking no" \
    "    UserKnownHostsFile=/dev/null" \
    > ${DEPLOYMENT_SSH_CONFIG}

# Set permissions for the private key
chmod 600 ${DEPLOYMENT_KEY_FILE}

# Create the remote deployment dir
ssh -F ${DEPLOYMENT_SSH_CONFIG} ${DEPLOYMENT_USER}@${DEPLOYMENT_HOST} "mkdir -p $DEPLOYMENT_DIR"

# Copy the artifacts to the deployment host
FILES_TO_DEPLOY="${RPM_FILE} ${BUILD_DIR}/${INSTALL_FILE}"
scp -F ${DEPLOYMENT_SSH_CONFIG} ${FILES_TO_DEPLOY} ${DEPLOYMENT_USER}@${DEPLOYMENT_HOST}:${DEPLOYMENT_DIR}

# Execute the install file
echo "Execute: $INSTALL_CMD"
ssh -F ${DEPLOYMENT_SSH_CONFIG} ${DEPLOYMENT_USER}@${DEPLOYMENT_HOST} "cd $DEPLOYMENT_DIR && bash $INSTALL_CMD"
