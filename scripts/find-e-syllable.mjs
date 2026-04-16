import fs from "node:fs";

const path = new URL("../frontend/src/translations.ts", import.meta.url);
const s = fs.readFileSync(path, "utf8");
const w = "\u1208\u1295\u120c\u122d"; // እን�� from missionText if wrong try search
const idx = s.indexOf("��ር��");
if (idx >= 0) {
  const word = s.slice(idx, idx + 4);
  for (const c of word) console.log(c, c.codePointAt(0).toString(16));
}
