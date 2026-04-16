import fs from "node:fs";

const path = new URL("../frontend/src/translations.ts", import.meta.url);
let s = fs.readFileSync(path, "utf8");

const am = s.indexOf("\n  am: {");
const sw = s.indexOf("\n  sw: {");
const block = s.slice(am, sw);
const bgKey = "backgroundText: \"";
const i = block.indexOf(bgKey);
if (i < 0) {
  console.error("backgroundText not found in am");
  process.exit(1);
}
const startVal = i + bgKey.length;
const endVal = block.indexOf("\",\n      description:", startVal);
if (endVal < 0) {
  console.error("end of backgroundText not found");
  process.exit(1);
}
const val = block.slice(startVal, endVal);
const split = val.split(" \u1260 Global Transit");
if (split.length !== 2) {
  console.error("expected single Global Transit split");
  process.exit(1);
}
const before = split[0];
const after = split[1];
const mark = String.fromCodePoint(0x1206, 0x1293, 0x1208, 0x127d, 0x1362);
const hookPos = before.lastIndexOf(mark);
if (hookPos < 0) {
  console.error("����ለች። not found");
  process.exit(1);
}
const head = before.slice(0, hookPos + mark.length);
const goodMid =
  " " +
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

const newVal = head + goodMid + " \u1260 Global Transit" + after;
const newBlock = block.slice(0, startVal) + newVal + block.slice(endVal);
s = s.slice(0, am) + newBlock + s.slice(sw);

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
const am2 = s.indexOf("\n  am: {");
const sw2 = s.indexOf("\n  sw: {");
let block2 = s.slice(am2, sw2);
block2 = block2.replace(`navUsers: "${navOld0}"`, `navUsers: "${navNew0}"`);
const navOld1 = String.fromCodePoint(0x121d, 0x1295, 0x120b, 0x122b);
const navNew1 = String.fromCodePoint(0x121d, 0x1295, 0x120b, 0x127d);
block2 = block2.replace(`navRoles: "${navOld1}"`, `navRoles: "${navNew1}"`);
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
block2 = block2.replace(`navPermissions: "${navOld2}"`, `navPermissions: "${navNew2}"`);
s = s.slice(0, am2) + block2 + s.slice(sw2);

fs.writeFileSync(path, s);
console.log("Amharic about.backgroundText + admin nav restored");
