import { mkdir, writeFile } from "fs/promises";
import { dirname, join } from "path";

/**
 * Writes a "generated file" to disk while ensuring that the recursive path to the file
 * exists.
 */
export async function writeCacheFile(file: string, data: any) {
  const content = typeof data === "string" ? data : JSON.stringify(data);
  const dir = join(process.cwd(), dirname(file));

  try {
    await mkdir(dir, { recursive: true });
    return writeFile(file, content, "utf-8");
  } catch (err) {
    throw new Error(
      `Problem creating directory "${dir}" so that a generated file could be placed into this driectory: ${
        (err as Error).message
      }`
    );
  }
}
