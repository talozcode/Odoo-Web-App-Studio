#!/usr/bin/env bash
# Restore the public demo database from its template. Runs nightly from
# root's crontab (see bootstrap.sh) and can be run by hand at any time.
set -euo pipefail

cd "$(dirname "$0")"
LOG=/var/log/odoo-demo-reset.log
exec >>"$LOG" 2>&1
echo "[$(date -Is)] reset start"

docker compose stop odoo

docker compose exec -T db psql -U odoo -d postgres -v ON_ERROR_STOP=1 -c \
  "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'odoo_demo';"
docker compose exec -T db dropdb -U odoo --if-exists odoo_demo
docker compose exec -T db createdb -U odoo -T odoo_demo_template odoo_demo

# The filestore (attachments, avatars) has to match the database it belongs to.
docker compose run --rm --no-deps --entrypoint sh odoo -c \
  'rm -rf /var/lib/odoo/filestore/odoo_demo && cp -a /var/lib/odoo/filestore/odoo_demo_template /var/lib/odoo/filestore/odoo_demo'

docker compose start odoo
echo "[$(date -Is)] reset done"
