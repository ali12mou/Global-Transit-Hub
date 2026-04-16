import fs from "node:fs";

const path = new URL("../frontend/src/translations.ts", import.meta.url);
let s = fs.readFileSync(path, "utf8");

const am0 = s.indexOf("\n  am: {");
const sw0 = s.indexOf("\n  sw: {");
const amBlock = s.slice(am0, sw0);
const missionLine = amBlock.split("\n").find((l) => l.includes("missionText:"));
if (!missionLine) {
  console.error("missionText line missing in am block");
  process.exit(1);
}
const q1 = missionLine.indexOf('"');
const q2 = missionLine.indexOf('"', q1 + 1);
const missionStr = missionLine.slice(q1 + 1, q2);
const words = missionStr.split(/\s+/);
const innaWord = words[1];
if (!innaWord) {
  console.error("Could not parse missionText words");
  process.exit(1);
}
const iSyllable = innaWord.codePointAt(0);

const badMiddle = String.fromCodePoint(
  0x1208, 0x122d, 0x120b, 0x1273, 0x1206, 0x20, 0x120b, 0x1265, 0x20, 0x1218, 0x1270, 0x1230, 0x1295, 0x1228,
  0x122e, 0x122b, 0x20, 0x1218, 0x120d, 0x120d, 0x120d, 0x120d, 0x1295, 0x130d, 0x120d,
);

const goodMiddle = String.fromCodePoint(
  iSyllable,
  0x122d,
  0x12a8,
  0x1273,
  0x20,
  0x120b,
  0x12ed,
  0x20,
  0x12e8,
  0x1270,
  0x1230,
  0x1290,
  0x1228,
  0x122e,
  0x122b,
  0x20,
  0x12e8,
  0x1200,
  0x1308,
  0x120d,
  0x130d,
  0x120e,
  0x1275,
  0x20,
  0x1263,
  0x1205,
  0x120d,
);

if (!s.includes(badMiddle)) {
  console.error("badMiddle not found");
  process.exit(1);
}
s = s.replace(badMiddle, goodMiddle);
console.log("Fixed backgroundText (satisfaction / service culture phrase)");

const badExpert = "\u1260\u130d\u130b\u130b \u1270\u130d\u130b\u122a \u1235\u122d\u1363";
const goodExpert = "\u1260\u120d\u120d\u1206 \u121d\u120b\u130b\u1363";
if (s.includes(badExpert)) {
  s = s.replace(badExpert, goodExpert);
  console.log("Fixed expertise phrase");
}

const navPairs = [
  ["\u1270\u1228\u122b\u120d\u120b\u130d\u130d\u122d\u122b", "\u1270\u1228\u1275\u120b\u130d\u122d\u127d"],
  ["\u121d\u1295\u120b\u122b", "\u121d\u1295\u120b\u127d"],
  ["\u130d\u1273\u120b\u120b\u120e\u122b", "\u130d\u1273\u120b\u120e\u127d"],
];
const keys = ["navUsers", "navRoles", "navPermissions"];
for (let k = 0; k <3; k++) {
  const oldL = `${keys[k]}: "${navPairs[k][0]}"`;
  const newL = `${keys[k]}: "${navPairs[k][1]}"`;
  if (s.includes(oldL)) {
    s = s.replace(oldL, newL);
    console.log("fixed", keys[k]);
  }
}

fs.writeFileSync(path, s);
console.log("translations.ts repaired");
