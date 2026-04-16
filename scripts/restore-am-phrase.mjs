import fs from "node:fs";

const path = new URL("../frontend/src/translations.ts", import.meta.url);
let s = fs.readFileSync(path, "utf8");

const bad =
  "\u1260\u120d\u120d\u1206\u1206 \u1261\u130d\u1305\u1295\u1295 \u120c\u1295\u130d\u130d\u130b \u1260\u12f0\u1295\u1260\u129b \u120c\u122d\u1208\u1273\u1206 \u120b\u12ed \u12e8\u1270\u1230\u1290\u1228\u122e\u122b \u12e8\u1200\u1308\u120d\u130d\u120e\u1275 \u1263\u1205\u120d \u1260 \u1260";
const good =
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

if (!s.includes(bad)) {
  console.error("bad phrase not found");
  process.exit(1);
}
s = s.replace(bad, good);

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
console.log("restored");
