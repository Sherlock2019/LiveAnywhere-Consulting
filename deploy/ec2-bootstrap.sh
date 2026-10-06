#!/usr/bin/env bash
# Prepare a fresh Ubuntu EC2 host: Docker, Nginx proxying port 80 to the app,
# and swap on small instances so image builds do not run out of memory.
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")"

sudo apt-get update
sudo apt-get install -y ca-certificates curl git nginx
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker "$USER"

mem_mb="$(awk '/MemTotal/ {print int($2/1024)}' /proc/meminfo)"
if [ "$mem_mb" -lt 3800 ] && [ -z "$(swapon --noheadings)" ]; then
  sudo fallocate -l 2G /swapfile
  sudo chmod 600 /swapfile
  sudo mkswap /swapfile
  sudo swapon /swapfile
  echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab >/dev/null
fi

if [ ! -f /etc/nginx/sites-available/ran ]; then
  sed 's/relocate\.example\.com/_/' nginx.conf.example | sudo tee /etc/nginx/sites-available/ran >/dev/null
  sudo ln -sf /etc/nginx/sites-available/ran /etc/nginx/sites-enabled/ran
  sudo rm -f /etc/nginx/sites-enabled/default
fi
sudo nginx -t
sudo systemctl enable --now docker nginx
sudo systemctl reload nginx

echo "EC2 host is prepared. Log out and back in so Docker group membership takes effect, then run ./start.sh deploy"
