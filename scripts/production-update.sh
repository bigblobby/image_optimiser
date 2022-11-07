#!/bin/bash

SECONDS=0

# Step 1 - git pull
echo "Step 1 of 3: Pulling files from git"
git pull

# Step 2 - update docker images
echo "Step 2 of 3: Updating docker images and running containers"
docker compose -f docker-compose-prod.yml up --build -d

# Step 3 - remove dangling images
echo "Step 3 of 3: Cleaning up dead docker images"
docker images -f "dangling=true" -q
if [[ $? = 0 ]]; then
    echo "NOTICE: No dangling images to remove."
else
    # shellcheck disable=SC2046
    docker rmi $(docker images -f "dangling=true" -q)
    echo "Success: All dangling images removed."
fi

duration=$SECONDS
# Finished
echo "Finished in ${duration} seconds."
