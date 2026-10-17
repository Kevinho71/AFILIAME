/**
 * Post-build para GitHub Pages:
 * 1. Copia index.html como 404.html para que las rutas profundas
 *    (/AFILIAME/oferta/powerfit, etc.) carguen la SPA en lugar de un 404.
 * 2. Deja .nojekyll para que Pages no procese el resultado con Jekyll.
 */
import fs from "node:fs";
import path from "node:path";

const dist = path.resolve("dist");

if (!fs.existsSync(dist)) {
  console.error("[pages] no existe dist/, corre el build primero");
  process.exit(1);
}

const index = fs.readFileSync(path.join(dist, "index.html"), "utf8");
fs.writeFileSync(path.join(dist, "404.html"), index, "utf8");
fs.writeFileSync(path.join(dist, ".nojekyll"), "", "utf8");

console.log("[pages] 404.html y .nojekyll generados en dist/");
