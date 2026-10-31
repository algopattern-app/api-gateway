# api-gateway

Serves **https://api.algopattern.app**: the AlgoPattern public API and its docs.

- `/` is the documentation, built from [`public/openapi.yaml`](public/openapi.yaml) with
  Redocly at deploy time.
- `/openapi.yaml` is the spec itself.
- Everything else is proxied to the API's Supabase edge function (see
  [`vercel.json`](vercel.json)). Files in `public/` take precedence over the proxy.

This repo holds no API logic and no secrets. Token checks, rate limiting and every response
body live in the backend: the `api` edge function and the `api.v1_*` SQL functions.

## Changing the spec

The spec describes a published contract. Within `/v1`, changes are additive only (new fields
or endpoints), and they ship in the backend first, then here.

```bash
npm ci
npm run lint    # validate public/openapi.yaml
npm run build   # write public/index.html; open it to preview
```

Pushes to `main` deploy through Vercel.

## Issues

Open issues for bugs in the API or these docs, and for feature requests. Issues are public:
never paste a token. For anything about your own account, email
[algopattern.dev@gmail.com](mailto:algopattern.dev@gmail.com).
