import fs from "node:fs";
import { fileURLToPath } from "node:url";

const path = fileURLToPath(new URL("../frontend/src/translations.ts", import.meta.url));
const s = fs.readFileSync(path, "utf8");
const a = s.indexOf("\n  am: {");
const w = s.indexOf("\n  sw: {", a);
const b = s.slice(a, w);
const x = b.indexOf("backgroundText:");
const line = b.slice(x).split("\n")[0];
const q = line.indexOf('"');
const r = line.lastIndexOf('"');
const val = line.slice(q + 1, r);
const idx = val.indexOf("።");
const idx2 = val.indexOf("።", idx + 1);
const seg = val.slice(idx + 1, idx2 + 1);
console.log(seg);
console.log(
  [...seg].map((c) => "U+" + c.codePointAt(0).toString(16).toUpperCase()).join(" "),
);
