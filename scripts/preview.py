#!/usr/bin/env python3
"""Preview the site locally, the way Vercel serves it.

    python3 scripts/preview.py            # http://localhost:8765
    python3 scripts/preview.py --port 9000

Reads vercel.json, so pages get the same clean URLs (/v1 serves v1.html) and
headers, including the Content-Security-Policy. Paths that would be proxied to
the API in production answer with a JSON 404 instead; this previews the docs,
not the API. Python standard library only.
"""
import argparse
import functools
import http.server
import json
import os
import re

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), os.pardir)
PUBLIC = os.path.join(ROOT, "public")


def load_header_rules():
    with open(os.path.join(ROOT, "vercel.json")) as f:
        config = json.load(f)
    # The sources in vercel.json are written as plain regular expressions.
    return [(re.compile(f"^{rule['source']}$"), rule["headers"]) for rule in config.get("headers", [])]


class Handler(http.server.SimpleHTTPRequestHandler):
    header_rules = load_header_rules()

    def send_head(self):
        path = self.path.split("?", 1)[0].split("#", 1)[0]
        self._path = path
        if path != "/" and not path.endswith("/"):
            candidate = os.path.join(PUBLIC, path.lstrip("/"))
            if not os.path.isfile(candidate) and os.path.isfile(candidate + ".html"):
                self.path = path + ".html"  # cleanUrls
            elif not os.path.exists(candidate):
                body = b'{"error":{"code":"not_found","message":"Proxied to the API in production; not previewed locally."}}'
                self.send_response(404)
                self.send_header("Content-Type", "application/json")
                self.send_header("Content-Length", str(len(body)))
                self.end_headers()
                self.wfile.write(body)
                return None
        return super().send_head()

    def end_headers(self):
        for pattern, headers in self.header_rules:
            if pattern.match(getattr(self, "_path", self.path)):
                for header in headers:
                    if header["key"].lower() != "cache-control":
                        self.send_header(header["key"], header["value"])
        self.send_header("Cache-Control", "no-store")  # always show the latest edit
        super().end_headers()


def main():
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--port", type=int, default=8765)
    args = parser.parse_args()
    server = http.server.ThreadingHTTPServer(("127.0.0.1", args.port), functools.partial(Handler, directory=PUBLIC))
    print(f"Previewing on http://localhost:{args.port}  (Ctrl+C to stop)", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()
