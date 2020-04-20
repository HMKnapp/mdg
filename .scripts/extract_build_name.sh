#!/bin/bash

BUILD_NAME="<undefined>"
if [[ "$GITHUB_EVENT_NAME" == "push" ]]; then
  BUILD_NAME="${GITHUB_REF#refs/heads/}"
else
  PR="$(echo ${GITHUB_REF} | cut -d'/' -f3)"
  BUILD_NAME="pr${PR}"
fi

echo "$BUILD_NAME"
