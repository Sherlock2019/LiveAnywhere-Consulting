#!/usr/bin/env bash
# Launcher for Relocate Anywhere Network.
#
#   ./start.sh            dev server (next dev) with local setup
#   ./start.sh prod       production build + next start
#   ./start.sh docker     full stack via docker compose (app + db)
#   ./start.sh stop       stop compose stack and the dev database container
#
# Extra arguments are passed through, e.g. ./start.sh dev -p 4000

set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")"

MODE="${1:-dev}"
[ $# -gt 0 ] && shift

DEV_DB_CONTAINER="ran-dev-db"

log() { printf '\033[1;36m==>\033[0m %s\n' "$*"; }
die() { printf '\033[1;31merror:\033[0m %s\n' "$*" >&2; exit 1; }

ensure_env() {
  if [ ! -f .env ]; then
    cp .env.example .env
    log "Created .env from .env.example (replace the placeholder secrets before deploying)"
  fi
}

load_env() {
  set -a
  # shellcheck disable=SC1091
  . ./.env
  set +a
}

check_node() {
  command -v node >/dev/null || die "Node.js 20.9+ is required but 'node' was not found"
  node -e 'const [a,b]=process.versions.node.split(".").map(Number);process.exit(a>20||(a===20&&b>=9)?0:1)' \
    || die "Node.js 20.9+ is required (found $(node -v))"
}

install_deps() {
  if [ ! -d node_modules ] || [ package-lock.json -nt node_modules/.package-lock.json ]; then
    log "Installing dependencies"
    npm install
  fi
}

port_open() { (exec 3<>"/dev/tcp/$1/$2") 2>/dev/null; }

# Make sure the database in DATABASE_URL is reachable. If it points at
# localhost and nothing is listening, start a throwaway Postgres container
# with matching credentials.
ensure_db() {
  [ -n "${DATABASE_URL:-}" ] || die "DATABASE_URL is not set in .env"

  local re='^postgres(ql)?://([^:]+):([^@]+)@([^:/]+)(:([0-9]+))?/([^?]+)'
  [[ "$DATABASE_URL" =~ $re ]] || die "Could not parse DATABASE_URL"
  local user="${BASH_REMATCH[2]}" pass="${BASH_REMATCH[3]}" host="${BASH_REMATCH[4]}"
  local port="${BASH_REMATCH[6]:-5432}" name="${BASH_REMATCH[7]}"

  port_open "$host" "$port" && return 0

  case "$host" in
    localhost|127.0.0.1) ;;
    *) die "Database at $host:$port is not reachable" ;;
  esac
  command -v docker >/dev/null \
    || die "PostgreSQL is not running on $host:$port and Docker is not available to start one"

  if docker ps -a --format '{{.Names}}' | grep -qx "$DEV_DB_CONTAINER"; then
    log "Starting existing database container $DEV_DB_CONTAINER"
    docker start "$DEV_DB_CONTAINER" >/dev/null
  else
    log "Starting PostgreSQL in Docker ($DEV_DB_CONTAINER on port $port)"
    docker run -d --name "$DEV_DB_CONTAINER" \
      -e POSTGRES_DB="$name" -e POSTGRES_USER="$user" -e POSTGRES_PASSWORD="$pass" \
      -p "127.0.0.1:$port:5432" \
      -v ran_dev_postgres:/var/lib/postgresql/data \
      postgres:17-alpine >/dev/null
  fi

  log "Waiting for the database"
  for _ in $(seq 1 30); do
    docker exec "$DEV_DB_CONTAINER" pg_isready -U "$user" -d "$name" >/dev/null 2>&1 && return 0
    sleep 1
  done
  die "Database did not become ready (see: docker logs $DEV_DB_CONTAINER)"
}

prepare() {
  check_node
  ensure_env
  load_env
  install_deps
  ensure_db
  log "Generating Prisma client"
  npm run --silent db:generate
  log "Applying migrations"
  npm run --silent db:migrate
  log "Seeding demo data"
  npm run --silent db:seed
}

case "$MODE" in
  dev)
    prepare
    log "Starting dev server on http://localhost:3000"
    exec npm run dev -- "$@"
    ;;
  prod)
    prepare
    log "Building"
    npm run build
    log "Starting production server on http://localhost:3000"
    exec npm run start -- "$@"
    ;;
  docker)
    command -v docker >/dev/null || die "Docker is required for this mode"
    ensure_env
    log "Starting app + database with docker compose on http://localhost:3000"
    exec docker compose up --build "$@"
    ;;
  stop)
    command -v docker >/dev/null || die "Docker is required for this mode"
    docker compose down
    if docker ps --format '{{.Names}}' | grep -qx "$DEV_DB_CONTAINER"; then
      docker stop "$DEV_DB_CONTAINER" >/dev/null
      log "Stopped $DEV_DB_CONTAINER"
    fi
    ;;
  -h|--help|help)
    sed -n '2,9p' "$0" | sed 's/^# \{0,1\}//'
    ;;
  *)
    die "Unknown mode '$MODE' (use: dev, prod, docker, stop)"
    ;;
esac
