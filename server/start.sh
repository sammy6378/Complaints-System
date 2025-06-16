#!/bin/bash

echo "📦 Select environment:"
echo "1) development"
echo "2) production"
read -p "Enter choice [1 or 2]: " ENV_CHOICE

case $ENV_CHOICE in
  1)
    ENV_FILE=".env.development"
    ;;
  2)
    ENV_FILE=".env.production"
    ;;
  *)
    echo "❌ Invalid environment choice."
    exit 1
    ;;
esac

echo ""
echo "🛠️  Select Docker operation:"
echo "1) Build"
echo "2) Start"
echo "3) Down"
echo "4) Rebuild (no cache)"
read -p "Enter choice [1-4]: " CMD_CHOICE

case $CMD_CHOICE in
  1)
    echo "🔧 Building with $ENV_FILE..."
    docker-compose --env-file $ENV_FILE build
    ;;
  2)
    echo "🚀 Starting with $ENV_FILE..."
    docker-compose --env-file $ENV_FILE up
    ;;
  3)
    echo "🧹 Stopping and removing containers..."
    docker-compose --env-file $ENV_FILE down
    ;;
  4)
    echo "♻️  Rebuilding with no cache using $ENV_FILE..."
    docker-compose --env-file $ENV_FILE build --no-cache
    docker-compose --env-file $ENV_FILE up
    ;;
  *)
    echo "❌ Invalid command choice."
    exit 1
    ;;
esac
