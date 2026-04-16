import fs from "node:fs";

const path = new URL("../frontend/src/translations.ts", import.meta.url);
const s = fs.readFileSync(path, "utf8");
const am = s.indexOf("\n  am: {");
const sw = s.indexOf("\n  sw: {");
const bg = s.slice(am, sw);
const needle = "\u1260\u12f0\u1295\u1260\u129b ";
const i = bg.indexOf(needle);
const frag = bg.slice(i, i + 90);
for (let k = 0; k < frag.length; k++) {
  const c = frag[k];
  if (c === "\n") break;
  process.stdout.write(c + "=" + c.codePointAt(0).toString(16) + " ");
}
process.stdout.write("\n");
