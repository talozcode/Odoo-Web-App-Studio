# Demo Odoo for odoowebapps.com

A real Odoo 18 Community instance that the site's demos read from and write
to. Runs on one Oracle Cloud Always Free Ampere A1 VM in Docker: Postgres 16,
Odoo 18, Caddy for HTTPS. The public database is restored from a template
every night at 03:00, so anything a visitor does disappears within a day.

## Status: not deployed (23 September 2026)

The site ships without this. Every demo reads the bundled snapshot of Odoo's
own demo dataset and labels itself "snapshot" on screen, which is the
supported path in `src/lib/odoo/demo-source.ts`, not a degraded one. Nothing
on the site claims a live instance.

The blocker is Oracle capacity, not this stack. 133 launch attempts over 17
hours all returned "Out of host capacity" for `VM.Standard.A1.Flex` at both
2 OCPU/12 GB and 1 OCPU/6 GB. The tenancy's home region `ap-singapore-1` has
exactly one availability domain, and Always Free instances can only be
created in the home region, so there is no other target to retry against and
no amount of retrying changes the odds. Do not restart a retry loop expecting
a different result.

To pick this up later, one of:

- Upgrade the Oracle tenancy to Pay As You Go. Always Free A1 (4 OCPU /
  24 GB total) stays free on a PAYG account, and PAYG tenancies are given
  priority for A1 capacity. Likely, not guaranteed.
- Run it on any other small VPS (2 vCPU / 4 GB is enough). This compose
  stack has no Oracle-specific parts; only step 1 and 2 below change.

Once a host exists, follow the owner steps, then set the five Vercel env
vars and confirm the readouts on the homepage flip from "snapshot" to
"live Odoo 18".

## Owner steps

1. Provide a host: shape `VM.Standard.A1.Flex`, 2 OCPU, 12 GB, Ubuntu 24.04
   (aarch64) on Oracle, or any VPS with 2 vCPU and 4 GB. See the status note
   above before assuming Oracle Always Free can supply one.
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

- installs Docker, accepts 80/443 on the host firewall (22 is already open)
- writes `/opt/odoo-demo/.env` with random Postgres and Odoo master passwords and renders `odoo.conf` from `odoo.conf.template` with the master password filled in
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
  `/web/database/*` returns 404. The Odoo master password is set (not the
  image default) and lives only in `/opt/odoo-demo/.env` and `odoo.conf` on
  the VM.
- `api-demo` has no admin rights. The site's only write is a server action
  that creates sale orders tagged `client_order_ref = odoowebapps-demo`,
  rate limited per visitor.
- The nightly reset is the hard backstop for anything else.
