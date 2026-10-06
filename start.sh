#!/usr/bin/env bash
# Launcher for Relocate Anywhere Network.
#
#   ./start.sh            dev server (next dev) with local setup
#   ./start.sh prod       production build + next start
#   ./start.sh docker     full stack via docker compose (app + db), foreground
#   ./start.sh deploy     server/EC2 deploy: generate secrets, compose up -d, health check
#   ./start.sh stop       stop compose stack and the dev database container
#
# Extra arguments are passed through, e.g. ./start.sh dev -p 4000
# deploy honours SITE_URL (public URL) and APP_PORT (host port, default 3000).

set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")"

MODE="${1:-dev}"
[ $# -gt 0 ] && shift

DEV_DB_CONTAINER="ran-dev-db"

log() { printf '\033[1;36m==>\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33mwarning:\033[0m %s\n' "$*" >&2; }
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

# True when DATABASE_URL accepts a connection with its credentials.
db_ok() {
  node --input-type=module -e '
    import pg from "pg";
    const client = new pg.Client({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 3000 });
    try { await client.connect(); await client.end(); } catch { process.exit(1); }
  ' 2>/dev/null
}

# Make sure the database in DATABASE_URL accepts our credentials. If it points
# at localhost and does not (nothing listening, or another PostgreSQL owns the
# port), run a throwaway Postgres container and point DATABASE_URL at it.
ensure_db() {
  [ -n "${DATABASE_URL:-}" ] || die "DATABASE_URL is not set in .env"

  local re='^(postgres(ql)?)://([^:]+):([^@]+)@([^:/]+)(:([0-9]+))?/([^?]+)(.*)$'
  [[ "$DATABASE_URL" =~ $re ]] || die "Could not parse DATABASE_URL"
  local scheme="${BASH_REMATCH[1]}" user="${BASH_REMATCH[3]}" pass="${BASH_REMATCH[4]}"
  local host="${BASH_REMATCH[5]}" port="${BASH_REMATCH[7]:-5432}"
  local name="${BASH_REMATCH[8]}" query="${BASH_REMATCH[9]}"

  db_ok && return 0

  case "$host" in
    localhost|127.0.0.1) ;;
    *) die "Database at $host:$port is unreachable or rejected the credentials in DATABASE_URL" ;;
  esac
  command -v docker >/dev/null \
    || die "No usable PostgreSQL at $host:$port and Docker is not available to start one"

  local db_port
  if docker ps -a --format '{{.Names}}' | grep -qx "$DEV_DB_CONTAINER"; then
    log "Starting existing database container $DEV_DB_CONTAINER"
    docker start "$DEV_DB_CONTAINER" >/dev/null
    db_port="$(docker port "$DEV_DB_CONTAINER" 5432/tcp | head -n1)"
    db_port="${db_port##*:}"
  else
    db_port="$port"
    while port_open 127.0.0.1 "$db_port"; do db_port=$((db_port + 1)); done
    [ "$db_port" = "$port" ] \
      || log "Port $port belongs to another PostgreSQL that rejected DATABASE_URL; using $db_port"
    log "Starting PostgreSQL in Docker ($DEV_DB_CONTAINER on port $db_port)"
    docker run -d --name "$DEV_DB_CONTAINER" \
      -e POSTGRES_DB="$name" -e POSTGRES_USER="$user" -e POSTGRES_PASSWORD="$pass" \
      -p "127.0.0.1:$db_port:5432" \
      -v ran_dev_postgres:/var/lib/postgresql/data \
      postgres:17-alpine >/dev/null
  fi

  # Exported values win over .env for both Prisma (dotenv) and Next.js.
  export DATABASE_URL="$scheme://$user:$pass@127.0.0.1:$db_port/$name$query"

  log "Waiting for the database"
  for _ in $(seq 1 30); do
    db_ok && return 0
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

require_docker() {
  command -v docker >/dev/null || die "Docker is required for this mode (on EC2: run deploy/ec2-bootstrap.sh)"
  docker compose version >/dev/null 2>&1 || die "The Docker Compose plugin is required"
  docker info >/dev/null 2>&1 \
    || die "Cannot reach the Docker daemon. After deploy/ec2-bootstrap.sh, log out and back in so the docker group applies."
}

rand_hex() { head -c "$1" /dev/urandom | od -An -tx1 | tr -d ' \n'; }

set_env_var() {
  if grep -q "^$1=" .env; then
    sed -i "s|^$1=.*|$1=\"$2\"|" .env
  else
    printf '%s="%s"\n' "$1" "$2" >> .env
  fi
}

# Public IPv4 from EC2 instance metadata (IMDSv2); empty when not on EC2.
ec2_public_ip() {
  command -v curl >/dev/null || return 0
  local token
  token="$(curl -fs -m 2 -X PUT http://169.254.169.254/latest/api/token \
    -H 'X-aws-ec2-metadata-token-ttl-seconds: 60' 2>/dev/null)" || return 0
  curl -fs -m 2 -H "X-aws-ec2-metadata-token: $token" \
    http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || true
}

# First deploy: write .env with generated secrets and the public URL.
ensure_deploy_env() {
  if [ -f .env ]; then
    grep -q '^AUTH_SECRET="\?replace-with' .env \
      && warn ".env still has the placeholder AUTH_SECRET; replace it before exposing this server"
    [ -z "${SITE_URL:-}" ] || set_env_var NEXT_PUBLIC_SITE_URL "$SITE_URL"
    return 0
  fi

  cp .env.example .env
  chmod 600 .env
  set_env_var AUTH_SECRET "$(rand_hex 32)"
  # An existing data volume was initialised with the old password; keep it.
  if docker volume ls -q | grep -q '_ran_postgres$'; then
    warn "Existing database volume found; not generating a new POSTGRES_PASSWORD"
  else
    set_env_var POSTGRES_PASSWORD "$(rand_hex 16)"
  fi

  local site="${SITE_URL:-}" ip
  if [ -z "$site" ]; then
    ip="$(ec2_public_ip)"
    [ -z "$ip" ] || site="http://$ip"
  fi
  [ -z "$site" ] || set_env_var NEXT_PUBLIC_SITE_URL "$site"
  log "Created .env with generated secrets${site:+ (site URL: $site)}"
}

http_ok() {
  if command -v curl >/dev/null; then
    curl -fsS -m 5 -o /dev/null "http://127.0.0.1:$1/" 2>/dev/null
  else
    port_open 127.0.0.1 "$1"
  fi
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
    require_docker
    ensure_env
    log "Starting app + database with docker compose on http://localhost:3000"
    exec docker compose up --build "$@"
    ;;
  deploy)
    require_docker
    ensure_deploy_env
    load_env
    port="${APP_PORT:-3000}"
    log "Building and starting containers (first build takes a few minutes)"
    docker compose up -d --build "$@"
    log "Waiting for the app on port $port"
    for _ in $(seq 1 90); do
      if http_ok "$port"; then
        log "App is up: http://127.0.0.1:$port${NEXT_PUBLIC_SITE_URL:+ (public: $NEXT_PUBLIC_SITE_URL)}"
        exit 0
      fi
      sleep 2
    done
    docker compose logs --tail 40 app >&2 || true
    die "App did not respond on port $port"
    ;;
  stop)
    require_docker
    docker compose down
    if docker ps --format '{{.Names}}' | grep -qx "$DEV_DB_CONTAINER"; then
      docker stop "$DEV_DB_CONTAINER" >/dev/null
      log "Stopped $DEV_DB_CONTAINER"
    fi
    ;;
  -h|--help|help)
    sed -n '2,11p' "$0" | sed 's/^# \{0,1\}//'
    ;;
  *)
    die "Unknown mode '$MODE' (use: dev, prod, docker, deploy, stop)"
    ;;
esac
