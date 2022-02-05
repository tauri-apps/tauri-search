import { mkdir, writeFile } from "fs/promises";
import { dirname } from "path";

export async function writeGeneratedFile(file: string, data: any) {
  const content = typeof data === "string" ? data : JSON.stringify(data);
  const dir = dirname(file);

  try {
    await mkdir(dir, { recursive: true });
  } catch(err) {
    throw new Error(`Problem creating directory "${dir}" so that a generated file could be placed into this driectory: ${(err as Error).message}`);
  }

  return writeFile(file, content, "utf-8");
}
