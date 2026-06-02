// Dev-only Vite plugin: accepts POST /__arrange/save { talk, order } and rewrites
// src/talks/<talk>/order.yaml. `apply: "serve"` means it never exists in the build,
// so the deployed site has no write surface.

import type { Plugin } from "vite";
import { resolve } from "path";
import { writeFileSync } from "fs";
import yaml from "js-yaml";

export function arrangePlugin(): Plugin {
  return {
    name: "deck-arrange",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/__arrange/save", (req, res) => {
        if (req.method !== "POST") { res.statusCode = 405; res.end(); return; }
        let body = "";
        req.on("data", (c) => (body += c));
        req.on("end", () => {
          try {
            const { talk, order } = JSON.parse(body || "{}");
            if (!/^[a-z0-9-]+$/i.test(talk ?? "")) throw new Error("invalid talk id");
            if (!Array.isArray(order) || !order.every((s) => typeof s === "string")) throw new Error("invalid order");
            const file = resolve(process.cwd(), "src/talks", talk, "order.yaml");
            writeFileSync(file, yaml.dump(order), "utf8");
            res.statusCode = 200;
            res.setHeader("content-type", "application/json");
            res.end(JSON.stringify({ ok: true }));
          } catch (e) {
            res.statusCode = 400;
            res.end(JSON.stringify({ ok: false, error: String(e) }));
          }
        });
      });
    },
  };
}
