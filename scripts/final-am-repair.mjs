import fs from "node:fs";

const path = new URL("../frontend/src/translations.ts", import.meta.url);
let s = fs.readFileSync(path, "utf8");

const am = s.indexOf("\n  am: {");
const sw = s.indexOf("\n  sw: {");
const block = s.slice(am, sw);
const hook = String.fromCodePoint(0x1206, 0x1293, 0x1208, 0x127d, 0x1362, 0x20);
const rel = block.indexOf(hook);
if (rel < 0) {
  console.error("Amharic hook not found in am block");
  process.exit(1);
}
const p = am + rel;
const g = s.indexOf(" \u1260 Global Transit", p);
if (g < 0) {
  console.error("Global anchor not found");
  process.exit(1);
}
const start = p + hook.length;
const end = g;
const replacement =
  String.fromCodePoint(0x1260, 0x120d, 0x120d, 0x1206) +
  " " +
  String.fromCodePoint(0x1261, 0x1305, 0x1295, 0x1295) +
  " " +
  String.fromCodePoint(0x1208, 0x1295, 0x130d, 0x130b) +
  " " +
  String.fromCodePoint(0x1260, 0x12f0, 0x1295, 0x1260, 0x129b) +
  " " +
  String.fromCodePoint(0x1208, 0x122d, 0x12a8, 0x1273) +
  " " +
  String.fromCodePoint(0x120b, 0x12ed) +
  " " +
  String.fromCodePoint(0x12e8, 0x1270, 0x1230, 0x1290, 0x1228, 0x122e, 0x122b) +
  " " +
  String.fromCodePoint(0x12e8, 0x1200, 0x1308, 0x120d, 0x130d, 0x120e, 0x1275) +
  " " +
  String.fromCodePoint(0x1263, 0x1205, 0x120d) +
  " " +
  String.fromCodePoint(0x1260);

s = s.slice(0, start) + replacement + s.slice(end);

const badExp = String.fromCodePoint(
  0x1260,
  0x130d,
  0x130b,
  0x130b,
  0x20,
  0x1270,
  0x130d,
  0x130b,
  0x122a,
  0x20,
  0x1235,
  0x122d,
  0x1363,
);
const goodExp = String.fromCodePoint(
  0x1260,
  0x120d,
  0x120d,
  0x1206,
  0x20,
  0x121d,
  0x120b,
  0x130b,
  0x1363,
);
if (s.includes(badExp)) s = s.replace(badExp, goodExp);

const navOld0 = String.fromCodePoint(
  0x1270,
  0x1228,
  0x122b,
  0x120d,
  0x120b,
  0x130d,
  0x130d,
  0x122d,
  0x122b,
);
const navNew0 = String.fromCodePoint(
  0x1270,
  0x1228,
  0x1275,
  0x120b,
  0x130d,
  0x122d,
  0x127d,
);
s = s.replace(`navUsers: "${navOld0}"`, `navUsers: "${navNew0}"`);

const navOld1 = String.fromCodePoint(0x121d, 0x1295, 0x120b, 0x122b);
const navNew1 = String.fromCodePoint(0x121d, 0x1295, 0x120b, 0x127d);
s = s.replace(`navRoles: "${navOld1}"`, `navRoles: "${navNew1}"`);

const navOld2 = String.fromCodePoint(
  0x130d,
  0x1273,
  0x120b,
  0x120b,
  0x120e,
  0x122b,
);
const navNew2 = String.fromCodePoint(
  0x130d,
  0x1273,
  0x120b,
  0x120e,
  0x127d,
);
s = s.replace(`navPermissions: "${navOld2}"`, `navPermissions: "${navNew2}"`);

fs.writeFileSync(path, s);
console.log("final-am-repair: done");
