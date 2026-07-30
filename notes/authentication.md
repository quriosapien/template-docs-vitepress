# Adding an auth layer to this docs site (reference notes)

This template ships with **no authentication by default** — it's meant to stay a
generic, lightweight starting point. If a project built from this template
needs to restrict access, use this file as a starting point instead of
re-researching from scratch.

## Why client-side "auth" doesn't work here

`vitepress build` produces static HTML/JS. Anything purely client-side — a
login screen added to the theme, a JS check before rendering a page — is
cosmetic only: the built page content already ships in the static bundle and
is fetchable directly, login screen or not. Real access control has to happen
**in front of** the static files (network/edge/server layer), not inside the
Vue app.

## Decision factors

Pick an approach based on:

1. **Where this will be hosted** — the best option differs a lot by platform.
2. **How strong the protection needs to be**:
   - *Soft gate* (shared password) — quick, deters casual visitors, not
     cryptographically secure.
   - *Real per-user login* — proper access control (Google/GitHub/company
     IdP), enforced before a request ever reaches page content.
   - *Network-level restriction* — IP allowlist / VPN only, no login UI.

## Recommended default for this template: Cloudflare Pages + Cloudflare Access

If you haven't already committed to a hosting platform, this is the lowest-effort
way to get **real per-user SSO with zero application code**:

### Hosting — Cloudflare Pages

- Connect this repo to Cloudflare Pages via its Git integration (dashboard-only,
  no files needed in the repo). Cloudflare has an official VitePress framework
  preset that auto-fills the build command (`npm run docs:build`) and output
  directory (`.vitepress/dist`).
- Every push to the default branch auto-builds and deploys; PRs get preview URLs.
- Free for static hosting — unlimited bandwidth/requests, generous free
  build-minutes allowance.
- Note: as of 2026 Cloudflare's default recommendation for *brand-new* projects
  is "Workers with static assets" (its newer unified model, useful if you'll add
  backend/API logic later). Pages has no sunset date and is still the simplest
  path for a pure static docs site — switch to Workers only if you outgrow it.

### Auth — Cloudflare Access

- Once the site is on a Cloudflare-managed domain, turn on Access for it in
  Zero Trust → Access → Applications — a dashboard toggle, not a code change.
- Connect an identity provider (Google Workspace, GitHub, Okta, Azure AD, or
  Cloudflare's own one-time-PIN email login) and write a policy (e.g. "email
  domain ends in `@yourcompany.com`"). Access is deny-by-default.
- **Flow:** unauthenticated request → Cloudflare edge redirects to the IdP login
  → IdP redirects back → Access evaluates your policy → on success, Cloudflare
  issues a signed `CF_Authorization` JWT cookie (paired with a `CF_Binding`
  cookie that prevents the auth cookie from being replayed if stolen) → request
  is proxied to your Pages origin. Subsequent requests just present the cookie
  until the session duration expires.
- This enforcement happens **at Cloudflare's edge**, before your static HTML is
  served — a real security boundary, not a client-side veneer.
- Free for up to 50 users; $7/user/month pay-as-you-go beyond that with no cap.

This combination is called out as the default *because* no hosting platform was
decided yet for this template and it requires the least ongoing maintenance —
not because it's the only correct choice. See the next section for other
platforms and the self-hosted worked example for when Cloudflare isn't an option.

## Options by hosting platform

The table below covers the platforms evaluated in this project so far — it is
**not exhaustive**. Plenty of other static hosts exist (GitHub Pages, GitLab
Pages, AWS Amplify / S3+CloudFront, Azure Static Web Apps, Firebase Hosting,
Render, Fly.io, and others), each with their own auth story. Apply the same
[decision factors](#decision-factors) above to whichever platform you actually
land on — hosting platform and auth mechanism are a joint decision, not two
independent ones.

| Hosting | Options |
|---|---|
| **Cloudflare Pages** | Cloudflare Access (free tier) — edge-level email OTP or SSO login, minimal setup, no app code changes. See the recommended-default section above for the full flow. |
| **Netlify** | Paid Password Protection add-on, Netlify Identity, or a custom Netlify Edge Function that checks a session before serving content. |
| **Vercel** | Built-in Password Protection (Pro plan), or custom Vercel Middleware that validates a session/JWT before letting the request through. |
| **Self-hosted (nginx/Docker)** | `nginx auth_basic` for a quick shared-password gate, or **oauth2-proxy** in front of the static file server for real per-user SSO (Google, GitHub, or any generic OIDC provider) without writing custom auth code. |
| **Anything else** (GitHub/GitLab Pages, S3+CloudFront, Firebase, etc.) | These typically don't have a built-in access-control layer — pair them with an edge/CDN-level auth product (e.g. a CloudFront Function + Lambda@Edge for AWS) or fall back to a reverse-proxy pattern like the self-hosted one below. |

## Worked example: self-hosted + real SSO (Google Workspace)

For a self-hosted deployment needing real per-user login, the standard,
low-maintenance pattern is a two-container stack:

- **`docs`** — nginx serving the VitePress static build (`.vitepress/dist`),
  built via a multi-stage Dockerfile (Node build stage → nginx runtime
  stage). Not exposed to the host directly.
- **`oauth2-proxy`** ([quay.io/oauth2-proxy/oauth2-proxy](https://github.com/oauth2-proxy/oauth2-proxy))
  — sits in front, configured with `--provider=google` and
  `--upstream=http://docs:80/`. This is the container actually exposed to
  the host/internet. Unauthenticated requests get redirected to Google
  login; only authenticated requests get proxied through to `docs`.

Orchestrated with a `docker-compose.yml` defining both services, plus an
`.env` (never committed) with:

- `OAUTH2_PROXY_CLIENT_ID` / `OAUTH2_PROXY_CLIENT_SECRET` — from a Google
  OAuth 2.0 Client ID (Google Cloud Console)
- `OAUTH2_PROXY_COOKIE_SECRET` — random 32-byte secret, e.g.
  `openssl rand -base64 32 | tr -- '+/' '-_'`
- `OAUTH2_PROXY_EMAIL_DOMAINS` — restricts login to your Workspace domain(s)
- `OAUTH2_PROXY_REDIRECT_URL` — e.g. `http://localhost:4180/oauth2/callback`
- `OAUTH2_PROXY_COOKIE_SECURE` — `false` for local/plain-HTTP, `true` once
  served over HTTPS

**TLS note:** for a real production domain, put a TLS-terminating reverse
proxy or load balancer (Caddy, Traefik, or the platform's own LB) in front of
`oauth2-proxy` and set `OAUTH2_PROXY_COOKIE_SECURE=true`. Certificate
management is environment-specific and intentionally not part of this
template.

The same pattern works with `--provider=github` or `--provider=oidc` (for
Okta, Auth0, Azure AD, Keycloak, etc.) if Google Workspace isn't the right
IdP for a given project — swap the provider flag and the corresponding
client id/secret.

## Status

Nothing in this file is wired up in the template by default. It's reference
material only, captured so a future implementer (human or agent) can pick an
approach quickly instead of re-deriving these options.
