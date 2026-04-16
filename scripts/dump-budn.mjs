import fs from "node:fs";

const s = fs.readFileSync(
  new URL("../frontend/src/translations.ts", import.meta.url),
  "utf8",
);
const i = s.indexOf� ");
const w = s.slice(i + 5, i + 5 + 10);
for (const c of w.slice(0, 4)) {
  console.log(c, c.codePointAt(0).toString(16));
}
