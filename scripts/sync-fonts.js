import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const jobs = [
  {
    from: "node_modules/@fontsource/syne/files",
    to: "assets/fonts/syne",
    files: [
      "syne-latin-700-normal.woff2",
      "syne-latin-800-normal.woff2",
      "syne-latin-ext-700-normal.woff2",
    ],
  },
  {
    from: "node_modules/@fontsource/dm-sans/files",
    to: "assets/fonts/dm-sans",
    files: [
      "dm-sans-latin-400-normal.woff2",
      "dm-sans-latin-500-normal.woff2",
      "dm-sans-latin-700-normal.woff2",
      "dm-sans-latin-ext-400-normal.woff2",
      "dm-sans-latin-ext-500-normal.woff2",
      "dm-sans-latin-ext-700-normal.woff2",
    ],
  },
];

for (const job of jobs) {
  const destDir = join(root, job.to);
  mkdirSync(destDir, { recursive: true });
  for (const file of job.files) {
    copyFileSync(join(root, job.from, file), join(destDir, file));
    console.log(`synced ${job.to}/${file}`);
  }
}
