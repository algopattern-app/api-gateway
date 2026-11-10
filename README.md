# api-gateway

Serves **https://api.algopattern.app**: the AlgoPattern public API's documentation, and a
proxy to the API itself. It's a static site on Vercel with no build step.

| Path | What |
|---|---|
| `/` | The guide: [`public/index.html`](public/index.html), styled by `site.css`, with `docs.js` for the sidebar |
| `/v1` | The endpoint reference: [`public/v1.html`](public/v1.html), rendered by [Scalar](https://github.com/scalar/scalar) from the spec, configured in `reference.js` |
| `/sitemap.xml` | Public documentation sitemap: `/` and `/v1` only |
| `/robots.txt` | Advertises the documentation sitemap to crawlers |
| `/openapi.yaml` | The spec: [`public/openapi.yaml`](public/openapi.yaml) |
| everything else | Proxied to the API's Supabase edge function (see [`vercel.json`](vercel.json)) |

Files in `public/` take precedence over the proxy, so `/v1` is the reference page while
`/v1/me` and the other endpoints reach the API.

This repo holds no API logic and no secrets. Token checks, rate limiting and every response
body live in the backend: the `api` edge function and the `api.v1_*` SQL functions.

## Previewing locally

```bash
python3 scripts/preview.py
```

Then open http://localhost:8765. The script needs only Python 3 and serves `public/` the way
Vercel does: `/v1` serves `v1.html`, and the headers from `vercel.json` apply, including the
Content-Security-Policy. Edits show on reload. API paths such as `/v1/me` answer with a JSON
404 locally, since in production Vercel proxies them to the API.

Once the repo is connected to Vercel, every pull request also gets a preview deployment.

## Sitemap

`public/sitemap.xml` lists only the public guide and endpoint reference, not authenticated
API endpoints. Update its `lastmod` timestamps when the corresponding documentation changes
(including `openapi.yaml` or `reference.js` for `/v1`). Use the date of the content change,
not the deployment date. Add or remove entries when public documentation routes change.

## Changing the spec

The spec describes a published contract. Within `/v1`, changes are additive only (new fields
or endpoints), and they ship in the backend first, then here. The guide in `index.html` is
written by hand; update it when a change affects what it says.

## Scalar

Scalar is vendored, not loaded from a CDN, so the docs never run code from a third-party
server. The bundle is `public/vendor/scalar/<version>/standalone.js` (MIT, licence alongside).

| Version | SHA-256 of `standalone.js` |
|---|---|
| 1.74.0 | `ea680608a3edc8fc3a27d6259d99ae8884d7061ee0149b166c01b45edb17bb73` |

To update, pick a release at least two weeks old, then:

```bash
V=x.y.z
npm pack @scalar/api-reference@$V && tar -xzf scalar-api-reference-$V.tgz
mkdir -p public/vendor/scalar/$V
cp package/dist/browser/standalone.js public/vendor/scalar/$V/
curl -sfL -o public/vendor/scalar/$V/LICENSE https://raw.githubusercontent.com/scalar/scalar/main/LICENSE
shasum -a 256 public/vendor/scalar/$V/standalone.js   # record it in the table above
rm -rf package scalar-api-reference-$V.tgz
```

Point `v1.html` at the new folder and delete the old one. The folder name carries the
version because `/vendor/*` is cached for a year.

`reference.js` turns off everything that would send data elsewhere: Scalar's request proxy,
telemetry and AI agent. It also hides Scalar's test client and its promotional "Generate SDK"
buttons; those have no option, so `customCss` hides them by class, which a Scalar update
could rename. Check `/v1` after updating. The pages' Content-Security-Policy (in `vercel.json`) only allows
scripts from this site and requests to this site.

## Issues

Open issues for bugs in the API or these docs, and for feature requests. Issues are public:
never paste a token. For anything about your own account, email
[algopattern.dev@gmail.com](mailto:algopattern.dev@gmail.com).
