#!/usr/bin/env bash

set -o nounset -o errexit

INSTALL_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
INSTALL_FILE=$(basename "${BASH_SOURCE[0]}")

ARTIFACT=$(cd ${INSTALL_DIR} && ls -t *.rpm *.deb 2> /dev/null | head -1)
NUMBER_REGEX='^[0-9]+$'

fullName() {
    BASE_NAME=$(basename $1)
    echo "${BASE_NAME%.*}"
}

isRpm() {
    [[ $1 == *".rpm" ]]
}

isDeb() {
    [[ $1 == *".deb" ]]
}

# Allow to upgrade SNAPSHOT packages with the same version, all other packages which are installed in the same version
# will be discarded. Packages with different version will be upgraded and new packages will be installed.
#
# @param $1 The complete file name.
# @param $2 The package name.
installRpm() {
    FULL_NAME=$(fullName $1)
    INSTALL_STATE=$(rpm -qa | grep ${FULL_NAME} &> /dev/null; echo $? || true)
    if [ ${INSTALL_STATE} -eq 0 ]; then
        if [[ ${FULL_NAME} == *"SNAPSHOT"* ]]; then
            echo "SNAPSHOT package ${FULL_NAME} already exists; force upgrade ..." >&2
            sudo rpm -Uvh --force $1
            echo "Successfully upgraded ${FULL_NAME}" >&2
        else
            echo "NON-SNAPSHOT package ${FULL_NAME} already exists in the same version; please increase the version and try again" >&2
            exit 1
        fi
    else
        echo "Start installation or upgrade of $2 ..." >&2
        sudo rpm -Uvh $1
        echo "Successfully installed/upgraded $2" >&2
    fi
}

# Installs or upgrades the package.
#
# TODO: Implement same functionality as for RPM packages
#
# @param $1 The complete file name.
# @param $2 The package name.
installDeb() {
    echo "Start installation or upgrade of $2 ..." >&2
    sudo apt -y --reinstall install $1
    echo "Successfully installed/upgraded $2" >&2
}

# Parse command line arguments
# http://stackoverflow.com/questions/192249/how-do-i-parse-command-line-arguments-in-bash
for i in "$@"
do
case ${i} in
    -n=*|--name=*)
    NAME="${i#*=}"
    shift
    ;;
    -e=*|--environment=*)
    ENVIRONMENT="${i#*=}"
    shift
    ;;
    -c=*|--config=*)
    CONFIG="${i#*=}"
    shift
    ;;
    -l=*|--logger=*)
    LOGGER="${i#*=}"
    shift
    ;;
    -p=*|--port=*)
    PORT="${i#*=}"
    shift
    ;;
    -k=*|--keepfiles=*)
    KEEP_FILES="${i#*=}"
    shift
    ;;
    *)
    echo "Unknown option $i"
    exit 1
    ;;
esac
done
if [[ -z ${NAME} ]]; then
    echo "Option -n must be defined with a valid package name"
    exit 1
elif [[ -z ${ENVIRONMENT} ]]; then
    echo "Option -e must be defined with a valid environment"
    exit 1
elif [[ -z ${CONFIG} ]]; then
    echo "Option -c must be defined with a valid config file"
    exit 1
elif [[ -z ${LOGGER} ]]; then
    echo "Option -l must be defined with a valid logger file"
    exit 1
elif ! [[ ${PORT} =~ $NUMBER_REGEX ]]; then
    echo "Option -p must be defined with a valid port number"
    exit 1
elif ! [[ ${KEEP_FILES} =~ $NUMBER_REGEX ]]; then
    echo "Option -k must be defined with a valid number"
    exit 1
fi

# Stop application if running
START_STATE=$(systemctl is-active ${NAME}.service || true)
if [ "$START_STATE" == "active" ]; then
    echo "Stop service ${NAME}.service"
    sudo systemctl stop ${NAME}.service
fi

# Install or upgrade package
if isRpm ${ARTIFACT}; then
    installRpm ${ARTIFACT} ${NAME}
elif isDeb ${ARTIFACT}; then
    installDeb ${ARTIFACT} ${NAME}
else
    echo "Cannot install unsupported file: $ARTIFACT"
    exit 1
fi

# Apply the environment specific values
# http://unix.stackexchange.com/a/112024
sudo sed -i "s/__APP_CONFIG__/$CONFIG/g; s/__APP_LOGGER__/$LOGGER/g; s/__APP_PORT__/$PORT/g" "/etc/default/$NAME"

# Register systemd service
echo "Register service ${NAME}.service"
sudo systemctl enable ${NAME}.service

# Start application
echo "Start service ${NAME}.service"
sudo systemctl start ${NAME}.service

# Fail the build if application is not running
START_STATE=$(systemctl is-active ${NAME}.service || true)
if [ "$START_STATE" != "active" ]; then
    echo "Service fails with state: $START_STATE"
    exit 1
fi

# Cleanup the deployment dir; keep only the last n files; keeps also the install file
echo "Cleanup ${INSTALL_DIR}"
cd ${INSTALL_DIR} && ls -t -I ${INSTALL_FILE} | tail -n +$((KEEP_FILES + 1)) | xargs rm -f --
