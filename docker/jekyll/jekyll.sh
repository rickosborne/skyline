#!/usr/bin/env sh

JEKYLL_VERSION=3.8.6
SKYLINE_JEKYLL_NAME=skyline-jekyll-386
SKYLINE_JEKYLL_ID=$(docker ps -aq --filter name="${SKYLINE_JEKYLL_NAME}")
export JEKYLL_LOG_LEVEL=debug

if [ -z "${SKYLINE_JEKYLL_ID}" ] ; then
	docker run \
		--name "${SKYLINE_JEKYLL_NAME}" \
		--volume "$PWD:/srv/jekyll" \
		--publish 4000:4000 \
		-e JEKYLL_LOG_LEVEL="${JEKYLL_LOG_LEVEL}" \
		"jekyll/jekyll:${JEKYLL_VERSION}" \
		jekyll "$@"
else
	echo "Jekyll ID: ${SKYLINE_JEKYLL_ID}"
	docker start -ai "${SKYLINE_JEKYLL_ID}"
fi
