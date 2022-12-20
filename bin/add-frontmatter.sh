#!/bin/bash

find notes -name '*.md' -print0 | while read -d $'\0' file
do

  if grep -q '^---$' "$file"; then
    if ! grep -q '^title:' "$file"; then
      echo "$file has frontend block but no title."
      # has frontmatter but no title
      filename=$(basename "$file")
      sed -i '' "1s/^---$/---\\
title: ${filename%.md}/" "$file"
    # else
      # has frontmatter and title
    fi
  else
    if [[ -z $(grep '[^[:space:]]' "$file") ]]; then
      echo "$file is empty. removed."
      rm "$file"
    else
      # has no frontmatter
      echo "$file has no frontend block."
      filename=$(basename "$file")
      sed -i '' "1i\\
---\\
title: ${filename%.md}\\
tags: []\\
---\\
\\
" "$file"
    fi
  fi
done