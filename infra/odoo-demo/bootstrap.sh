#!/usr/bin/env bash
# One-shot setup of the demo Odoo on a fresh Ubuntu 24.04 host (written for
# an Oracle Cloud Always Free Ampere A1 instance). Idempotent enough to
# re-run after a partial failure. Run as root:
#
#   sudo bash bootstrap.sh
#
# When it finishes it prints the four values to put in Vercel.
set -euo pipefail

DOMAIN="demo-odoo.odoowebapps.com"
TARGET=/opt/odoo-demo
MODULES="base,sale_management,sale_margin,stock,purchase,mrp,account"

if [[ $EUID -ne 0 ]]; then
  echo "run as root" >&2
  exit 1
fi

SRC="$(cd "$(dirname "$0")" && pwd)"

echo "== packages"
apt-get update -qq
apt-get install -y -qq ca-certificates curl >/dev/null
if ! command -v docker >/dev/null; then
  curl -fsSL https://get.docker.com | sh
fi

echo "== host firewall"
# Oracle's Ubuntu image ships iptables rules that reject everything but 22
# on INPUT. Docker's published ports are DNATed and pass through FORWARD, so
# they work regardless, but accept 80/443 on INPUT too so nothing depends on
# that detail. The VCN security list is the real gate; see README.
# ufw is deliberately not used: it fights both Oracle's rules and Docker's.
for port in 80 443; do
  iptables -C INPUT -p tcp --dport "$port" -m conntrack --ctstate NEW -j ACCEPT 2>/dev/null ||
    iptables -I INPUT 1 -p tcp --dport "$port" -m conntrack --ctstate NEW -j ACCEPT
done
netfilter-persistent save >/dev/null 2>&1 || true

echo "== files -> $TARGET"
mkdir -p "$TARGET"
cp "$SRC"/docker-compose.yml "$SRC"/Caddyfile "$SRC"/reset-demo.sh "$TARGET"/
chmod +x "$TARGET"/reset-demo.sh
cd "$TARGET"

if [[ ! -f .env ]]; then
  cat >.env <<EOF
POSTGRES_PASSWORD=$(openssl rand -hex 24)
ODOO_ADMIN_PASSWD=$(openssl rand -hex 24)
EOF
  chmod 600 .env
fi
# shellcheck disable=SC1091
source .env

# The official image does not read a master-password variable; it has to be
# in the config file. Render it here so the secret never lives in git.
sed "s/__ADMIN_PASSWD__/$ODOO_ADMIN_PASSWD/" "$SRC"/odoo.conf.template >odoo.conf
chmod 600 odoo.conf

echo "== database"
docker compose up -d db
until docker compose exec -T db pg_isready -U odoo -d postgres >/dev/null 2>&1; do sleep 2; done

if ! docker compose exec -T db psql -U odoo -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='odoo_demo_template'" | grep -q 1; then
  echo "== initialising odoo_demo_template with demo data ($MODULES)"
  docker compose run --rm -T odoo -- -d odoo_demo_template -i "$MODULES" --stop-after-init
fi

echo "== api-demo user and key"
# odoo shell executes piped stdin when it is not a tty. The key is printed on
# one line and everything else (logs) goes to stderr.
API_KEY=$( { docker compose run --rm -T odoo -- shell -d odoo_demo_template --no-http 2>/dev/null <<'PY' || true; } | sed -n 's/^API_KEY=//p'
Users = env['res.users']
user = Users.search([('login', '=', 'api-demo')], limit=1)
if not user:
    groups = [env.ref(x).id for x in [
        'base.group_user',
        'sales_team.group_sale_salesman',
        'stock.group_stock_user',
        'purchase.group_purchase_user',
        'account.group_account_readonly',
    ]]
    user = Users.create({
        'name': 'API demo',
        'login': 'api-demo',
        'email': 'api-demo@odoowebapps.com',
        'groups_id': [(6, 0, groups)],
    })
env['res.users.apikeys'].search([('user_id', '=', user.id)]).unlink()
key = env['res.users.apikeys'].with_user(user)._generate('rpc', 'odoowebapps.com demo', False)
env.cr.commit()
print('API_KEY=' + key)
PY
)
if [[ -z "$API_KEY" ]]; then
  echo "failed to create the API key" >&2
  exit 1
fi

echo "== snapshot template -> odoo_demo"
docker compose stop odoo >/dev/null 2>&1 || true
docker compose exec -T db psql -U odoo -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname='odoo_demo';" >/dev/null
docker compose exec -T db dropdb -U odoo --if-exists odoo_demo
docker compose exec -T db createdb -U odoo -T odoo_demo_template odoo_demo
docker compose run --rm --no-deps -T --entrypoint sh odoo -c \
  'rm -rf /var/lib/odoo/filestore/odoo_demo && cp -a /var/lib/odoo/filestore/odoo_demo_template /var/lib/odoo/filestore/odoo_demo'

echo "== up"
docker compose up -d

echo "== nightly reset at 03:00"
( crontab -l 2>/dev/null | grep -v reset-demo.sh; echo "0 3 * * * $TARGET/reset-demo.sh" ) | crontab -

cat <<EOF

Done. Point DNS at this host (A record, DNS only, no proxy):
  $DOMAIN -> $(curl -s https://api.ipify.org || echo '<public ip>')

Vercel environment (production + preview):
  ODOO_DEMO_URL=https://$DOMAIN
  ODOO_DEMO_DB=odoo_demo
  ODOO_DEMO_LOGIN=api-demo
  ODOO_DEMO_API_KEY=$API_KEY
  DEMO_WRITES_ENABLED=1

Odoo master password is in $TARGET/.env (ODOO_ADMIN_PASSWD). The admin
login is admin / admin until you change it; do that first.
EOF
