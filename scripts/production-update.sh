#!/bin/bash

echo "Step 1 of 3: Pulling files from git"
git pull
echo "Step 2 of 3: Updating docker images and running containers"
docker-compose -f docker-compose-prod.yml up --build -d
echo "Step 3 of 3: Cleaning up dead docker images"
# shellcheck disable=SC2046
docker rmi $(docker images -f "dangling=true" -q)
echo "Finished"
