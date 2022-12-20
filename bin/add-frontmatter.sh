#!/bin/bash

# USAGE: find notes -name '*.md' | ./bin/add-frontmatter.sh

# add title in given file.
# given file must have frontmatter block.
add_title_to() {
  echo "[update] $1"
  filename=$(basename "$1")

  sed -i '' "1s/^---$/---\\
title: ${filename%.md}/" "$1"
}

# create frontmatter block in given file.
# given file must have no frontmatter block.
create_frontmatter_at() {
  echo "[updated] $1"
  filename=$(basename "$1")
  sed -i '' "1i\\
---\\
title: ${filename%.md}\\
tags: []\\
---\\
\\
" "$1"
}

# remove given file
# given file must be empty.
remove_empty() {
  echo "[removed] $1"
  rm $1
}

while read file
do
  if grep -q '^---$' "$file"; then
    if ! grep -q '^title:' "$file"; then
      # has frontmatter but no title
      add_title_to $file
    # else
      # has frontmatter and title
    fi
  else
    if [[ -z $(grep '[^[:space:]]' "$file") ]]; then
      remove_empty $file
    else
      create_frontmatter_at $file
    fi
  fi
done

