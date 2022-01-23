#!/usr/local/bin

docker volume inspect search_db | npx jq ".[0].Mountpoint"