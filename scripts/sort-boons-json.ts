import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

type BoonEntry = {
  name: string;
};

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const boonsPath = join(root, "src/lib/data/hades2/boons.json");

const boons = JSON.parse(readFileSync(boonsPath, "utf8")) as Record<
  string,
  BoonEntry
>;

const sorted = Object.fromEntries(
  Object.entries(boons).sort(([keyA, a], [keyB, b]) => {
    const byName = a.name.localeCompare(b.name, undefined, {
      sensitivity: "base",
    });
    return byName !== 0 ? byName : keyA.localeCompare(keyB);
  }),
);

const output = `${JSON.stringify(sorted, null, 2)}\n`;

if (output !== readFileSync(boonsPath, "utf8")) {
  writeFileSync(boonsPath, output);
  console.log("Sorted boons.json alphabetically by name.");
}
