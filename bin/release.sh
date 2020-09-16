#!/bin/sh
set -eu

readonly CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "$CURRENT_BRANCH Version: $(yarn version)"
if [ "$CURRENT_BRANCH" != main ]; then
  echo "You must be on 'main' branch to publish a release, aborting..."
  exit 1
fi

if ! git diff-index --quiet HEAD --; then
  echo "Working tree is not clean, aborting..."
  exit 1
fi

rm -rf node_modules/ dist/

if ! yarn; then
  echo "Failed to install modules first-pass, aborting..."
  exit 1
fi

if ! yarn run build; then
  echo "Failed to build dist files first-pass, aborting..."
  exit 1
fi

if ! yarn test; then
  echo "Tests failed first-pass, aborting..."
  exit 1
fi

if ! yarn run changelog:unreleased; then
  echo "Failed to update changelog:unreleased, aborting..."
  exit 1
fi

# Only update the package.json version
# We need to update changelog before tagging
# And publishing.

if ! yarn run changelog; then
  echo "Failed to update changelog, aborting..."
  exit 1
fi

if ! yarn; then
  echo "Failed to install modules second-pass, aborting..."
  exit 1
fi

if ! yarn run build; then
  echo "Failed to build dist files second-pass, aborting..."
  exit 1
fi

if ! yarn test; then
  echo "Tests failed second-pass, aborting..."
  exit 1
fi

# Gives user a chance to review and eventually abort.
git add --patch
readonly PACKAGE_VERSION=$(yarn version)
git commit --message="chore(prerelease): changelog from previous version: v${PACKAGE_VERSION}"

git push origin HEAD

# git push --tags
yarn semantic-version

echo "Previous Version: $PACKAGE_VERSION"
echo "Current Version: $(yarn version)"
echo "Pushed package to npm, and also pushed tag to git repository."
