#!/usr/bin/env bash
# Strip metadata from image files that are staged for commit, then re-stage them
# so the cleaned blobs are included in the commit (pre-commit runs before the index is frozen).

set -euo pipefail

while IFS= read -r f; do
  [[ -z "${f}" || ! -f "${f}" ]] && continue
  if echo "${f}" | grep -qiE '\.(jpe?g|png|gif)$'; then
    exiftool -all= -tagsfromfile @ -Orientation -overwrite_original "${f}"
    git add "${f}"
  fi
done < <(git diff --cached --name-only --diff-filter=ACM)
