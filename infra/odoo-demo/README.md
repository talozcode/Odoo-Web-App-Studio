# Demo Odoo for odoowebapps.com

A real Odoo 18 Community instance that the site's demos read from and write
to. Runs on one Oracle Cloud Always Free Ampere A1 VM in Docker: Postgres 16,
Odoo 18, Caddy for HTTPS. The public database is restored from a template
every night at 03:00, so anything a visitor does disappears within a day.

## Owner steps

1. Create an Oracle Cloud account (Always Free). In the console create a
   Compute instance: shape `VM.Standard.A1.Flex`, 2 OCPU, 12 GB, image
   Ubuntu 24.04 (aarch64). If you get "Out of host capacity", retry later
   or pick another availability domain in the same region.
2. In the instance's VCN, Security List, add ingress rules for TCP 80 and
   443 from 0.0.0.0/0 (22 is already there).
3. Copy this directory to the VM and run it:

   ```sh
   scp -r infra/odoo-demo ubuntu@<ip>:~/
   ssh ubuntu@<ip> sudo bash ~/odoo-demo/bootstrap.sh
   ```

   The script prints the values to put in Vercel at the end. Keep them
   somewhere safe; they are not stored anywhere else.
4. Add the Cloudflare A record `demo-odoo` pointing at the VM's public IP,
   DNS only (grey cloud). Caddy fetches its certificate on the first
   request once DNS resolves.
5. Log in to https://demo-odoo.odoowebapps.com as `admin` / `admin` and
   change the admin password. Then rebuild the template so the change
   sticks across resets:

   ```sh
   cd /opt/odoo-demo
   docker compose stop odoo
   docker compose exec -T db dropdb -U odoo odoo_demo_template
   docker compose exec -T db createdb -U odoo -T odoo_demo odoo_demo_template
   docker compose start odoo
   ```

## What bootstrap.sh does

- installs Docker and ufw, opens 22/80/443 only
- writes `/opt/odoo-demo/.env` with random Postgres and Odoo master passwords
- creates `odoo_demo_template` with `base, sale_management, sale_margin,
  stock, purchase, mrp, account` and Odoo's demo data
- creates the `api-demo` user (Sales, Inventory, Purchase user; Accounting
  read-only) and generates its API key
- copies the template to `odoo_demo`, the only database Odoo serves
- installs the nightly `reset-demo.sh` cron

## Checks

```sh
curl -s https://demo-odoo.odoowebapps.com/jsonrpc \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","method":"call","params":{"service":"common","method":"version","args":[]}}'
# expect "server_version": "18.0"

sudo /opt/odoo-demo/reset-demo.sh && tail -3 /var/log/odoo-demo-reset.log
```

From the site repo, regenerate the bundled snapshot from the live instance:

```sh
ODOO_DEMO_URL=... ODOO_DEMO_DB=odoo_demo ODOO_DEMO_LOGIN=api-demo ODOO_DEMO_API_KEY=... \
  node scripts/odoo-snapshot.mjs
```

## Limits and safety

- 8069 and 8072 are never published; Caddy is the only entry point and
  `/web/database/*` returns 404.
- `api-demo` has no admin rights. The site's server actions only create
  sale orders tagged `client_order_ref = odoowebapps-demo` and mark move
  lines picked, and they are rate limited per visitor.
- The nightly reset is the hard backstop for anything else.
