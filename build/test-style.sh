#!/usr/bin/env bash

set -o nounset -o errexit

BUILD_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SCRIPTS_DIR=$(readlink -f "$BUILD_DIR/../scripts/")
ERROR=false

# NOTE: echo "q" is needed because SBT prompts the user for input on encountering a build file
# with failure (either resolution or compilation); the "q" makes SBT quit.
ERRORS=$(echo -e "q\n" \
  | bash ${SCRIPTS_DIR}/scalastyle.sh \
  | awk '{if($1~/error/)print}' \
)
if test ! -z "$ERRORS"; then
  echo ""
  echo "================="
  echo "ERROR: Scalastyle"
  echo "================="
  echo "The code is not styled according to the project's standards."
  echo "Scalastyle checks failed at following occurrences:"
  echo "=================================================="
  echo "$ERRORS"
  echo "=================================================="
  echo "To perform this same validation on your environment, run 'build/test-style.sh'."
  echo "To fix, format your sources based on the suggestions, before submitting a pull request."
  echo "After correcting, please squash your commits (eg, use 'git commit --amend') before updating your pull request."
  ERROR=true
else
  echo "Scalastyle checks passed."
fi

# NOTE: we must redirect the output from stdout into a file, otherwise NPM throws a segfault
ESLINT_OUTPUT=/tmp/eslint.${RANDOM}
bash ${SCRIPTS_DIR}/eslint.sh --quit > ${ESLINT_OUTPUT} 2> /dev/null || true
ERRORS=$(cat ${ESLINT_OUTPUT})
if test ! -z "$ERRORS"; then
  echo ""
  echo "============="
  echo "ERROR: Eslint"
  echo "============="
  echo "The code is not styled according to the project's standards."
  echo "Eslint checks failed at following occurrences:"
  echo "=================================================="
  echo "$ERRORS"
  echo "=================================================="
  echo "To perform this same validation on your environment, run 'build/test-style.sh'."
  echo "To fix, format your sources based on the suggestions, before submitting a pull request."
  echo "After correcting, please squash your commits (eg, use 'git commit --amend') before updating your pull request."
  ERROR=true
else
  echo "Eslint checks passed."
fi

if [ ${ERROR} = true ]; then
  exit 1
fi
