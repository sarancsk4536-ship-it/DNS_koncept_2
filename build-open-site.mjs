import { readFile, writeFile } from "node:fs/promises";

const files = {
  index: await readFile("index.html", "utf8"),
  styles: await readFile("styles.css", "utf8"),
  catalogData: await readFile("catalog-data.js", "utf8"),
  catalogStructure: await readFile("catalog-structure.js", "utf8"),
  typeCatalog: await readFile("type-catalog.js", "utf8"),
  app: await readFile("app.js", "utf8"),
};

const result = files.index
  .replace('<link rel="stylesheet" href="styles.css" />', `<style>${files.styles}</style>`)
  .replace('<script src="catalog-data.js"></script>', `<script>${files.catalogData}</script>`)
  .replace('<script src="catalog-structure.js"></script>', `<script>${files.catalogStructure}</script>`)
  .replace('<script src="type-catalog.js"></script>', `<script>${files.typeCatalog}</script>`)
  .replace('<script src="app.js"></script>', `<script>${files.app}</script>`);

await writeFile("OPEN-SITE.html", result);
