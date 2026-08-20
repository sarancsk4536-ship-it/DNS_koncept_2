import { readFile, writeFile } from "node:fs/promises";

const files = {
  index: await readFile("index.html", "utf8"),
  styles: await readFile("styles.css", "utf8"),
  catalogData: await readFile("catalog-data.js", "utf8"),
  catalogStructure: await readFile("catalog-structure.js", "utf8"),
  typeCatalog: await readFile("type-catalog.js", "utf8"),
  app: await readFile("app.js", "utf8"),
};

let result = files.index
  .replace(/<link rel="stylesheet" href="styles\.css[^"]*" \/>/, `<style>${files.styles}</style>`)
  .replace(/\s*<script defer src="bootstrap\.js[^"]*"><\/script>/, "");

const payload = [
  `<script>${files.catalogData}</script>`,
  `<script>${files.catalogStructure}</script>`,
  `<script>${files.typeCatalog}</script>`,
  `<script>${files.app}</script>`,
].join("\n");

result = result.replace("</body>", `${payload}\n</body>`);
await writeFile("OPEN-SITE.html", result);
