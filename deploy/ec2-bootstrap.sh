#!/usr/bin/env bash
set -euo pipefail

sudo apt-get update
sudo apt-get install -y ca-certificates curl nginx
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker "$USER"
sudo systemctl enable --now docker nginx

echo "EC2 host is prepared. Reconnect so Docker group membership takes effect, then follow README.md."
