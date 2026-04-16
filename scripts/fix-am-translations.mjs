import fs from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const pathTs = new URL("../frontend/src/translations.ts", import.meta.url);
const pathNewBg = new URL("./am-background-new.txt", import.meta.url);

let s = fs.readFileSync(pathTs, "utf8");
const newVal = fs.readFileSync(pathNewBg, "utf8").replace(/\r?\n$/, "");

const am = s.indexOf("\n  am: {");
const sw = s.indexOf("\n  sw: {", am);
if (am < 0 || sw < 0) {
  console.error("am/sw block not found");
  process.exit(1);
}

const head = s.slice(0, am);
let block = s.slice(am, sw);
const tail = s.slice(sw);

const aboutIdx = block.indexOf("about:");
const mk = '      backgroundText: "';
const i = block.indexOf(mk, aboutIdx);
if (i < 0) {
  console.error("backgroundText not found in am");
  process.exit(1);
}
const start = i + mk.length;
const end = block.indexOf('",\n      description:', start);
if (end < 0) {
  console.error("end of backgroundText not found");
  process.exit(1);
}

block = block.slice(0, start) + newVal + block.slice(end);

block = block.replace(
  'navUsers: "ተ��ት�����ርች"',
  'navUsers: "ተ��������ች"',
);
block = block.replace('navRoles: "ምን��ች"', 'navRoles:���ች"');
block = block.replace(
  'navPermissions:�ች"',
  'navPermissions:���ች"',
);

fs.writeFileSync(pathTs, head + block + tail);
console.log("am backgroundText + admin nav fixed");
