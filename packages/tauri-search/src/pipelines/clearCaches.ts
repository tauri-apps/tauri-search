import fg from "fast-glob";
import { rm } from "fs/promises";

/**
 * clears all cache files from the `src/generated` directory
 */
export async function clearCaches() {
  const files = await fg("src/generated/**/*.json");
  for (const f of files) {
    await rm(f);
  }
  return files;
}
