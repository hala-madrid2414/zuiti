import { cp, mkdir, readdir, rm, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);
const rootDir = path.resolve(currentDir, "..");
const sourceDir = path.join(rootDir, "demo", "src");
const outputDir = path.join(rootDir, "demo", "dist");

async function getDirectorySize(targetDir) {
  const entries = await readdir(targetDir, { withFileTypes: true });
  let totalSize = 0;

  for (const entry of entries) {
    const fullPath = path.join(targetDir, entry.name);
    if (entry.isDirectory()) {
      totalSize += await getDirectorySize(fullPath);
      continue;
    }

    const fileStat = await stat(fullPath);
    totalSize += fileStat.size;
  }

  return totalSize;
}

async function main() {
  await rm(outputDir, { recursive: true, force: true });
  await mkdir(outputDir, { recursive: true });
  await cp(sourceDir, outputDir, { recursive: true });

  const sizeInBytes = await getDirectorySize(outputDir);
  const sizeInKb = (sizeInBytes / 1024).toFixed(2);

  console.log(`Offline demo built to ${outputDir}`);
  console.log(`Package size: ${sizeInKb} KB`);
}

main().catch((error) => {
  console.error("Failed to build offline demo.");
  console.error(error);
  process.exitCode = 1;
});
