#!/bin/bash
set -e

docker stop backend-1 || true
docker rm backend-1 || true

docker build --no-cache -t backend .

docker stop backend-1 || true
docker rm backend-1 || true

docker run -d -p 4000:4000 --name backend-1 backend
