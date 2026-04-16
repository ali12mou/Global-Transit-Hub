import fs from "node:fs";

const path = new URL("../frontend/src/translations.ts", import.meta.url);
let s = fs.readFileSync(path, "utf8");

const junk =
  /\u1260\u12f0\u1295\u1260\u129b [\uac00-\ud7af]+\u1295 \u12e8\u1273\u1270\u1240 \u1235\u122b \u1263\u1205\u120d \u121e\u12f4\u120d \u1260/;
const fixed =
  "\u1260\u12f0\u1295\u1260\u129b \u1208\u122d\u120b\u1273\u1206 \u120b\u1265 \u1218\u1270\u1230\u1295\u1228\u122e\u122b \u1218\u120d\u120d\u120d\u120d\u1295\u130d\u120d \u1260";

if (!junk.test(s)) {
  console.error("Amharic–Hangul segment not found");
  process.exit(1);
}
junk.lastIndex = 0;
s = s.replace(junk, fixed);

const badExpert =
  /\u1260\u130d\u130b\u130b \u1270\u130d\u130b\u122a \u1235\u122d\u1363/;
if (badExpert.test(s)) {
  s = s.replace(
    badExpert,
    "\u1260\u120d\u120d\u1206 \u121d\u120b\u130b\u1363",
  );
  console.log("Fixed Amharic expertise phrase");
}

const amStart = s.indexOf("\n  am: {");
const swStart = s.indexOf("\n  sw: {");
if (amStart < 0 || swStart < 0) {
  console.error("Could not locate am/sw blocks");
  process.exit(1);
}
let amBlock = s.slice(amStart, swStart);
const m = amBlock.match(/      settingsBody: "[^"]+"/);
if (!m) {
  console.error("settingsBody line not found in am block");
  process.exit(1);
}
const line = m[0];
if (amBlock.includes("navUsers:")) {
  console.log("Amharic admin nav keys already present");
} else {
  const newLine = line.replace(
    /"$/,
    '",\n      navUsers: "\u1270\u1228\u1275\u120b\u130d\u122d\u127d",\n      navRoles: "\u121d\u1295\u120b\u127d",\n      navPermissions: "\u130d\u1273\u120b\u120e\u127d"',
  );
  amBlock = amBlock.replace(line, newLine);
  s = s.slice(0, amStart) + amBlock + s.slice(swStart);
  console.log("Added Amharic admin nav keys");
}

fs.writeFileSync(path, s);
console.log("translations.ts updated");
