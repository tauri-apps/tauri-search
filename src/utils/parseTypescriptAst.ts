import { readFile } from "node:fs/promises";
import { TypescriptApi, TypescriptBlock } from "~/types";
import { parseModule } from "./parsers/parseModule";

async function fetchTsDoc() {
  // TODO: once the `tauri` repo is producing a `tsdoc.json` file on Netlify we need to fetch it here
  return undefined;
}

async function getContent(source?: string) {
  return JSON.parse(
    await readFile(source || (await fetchTsDoc()) || "test/fixtures/tsdoc.json", "utf-8")
  ) as TypescriptBlock;
}

/**
 * Converts the output of TSDOC's JSON format and converts to a more compact format which aligns
 * better with the search indexing.
 *
 * @param source you can specify a source file, otherwise it will use what's on the `tauri` repo
 */
export async function parseTypescriptAst(source?: string): Promise<TypescriptApi> {
  const content = await getContent();
  const project: TypescriptApi = {
    project: content.name,
    comment: content.comment,
    modules: [],
  };

  for (const mod of content.children || []) {
    if (mod.kindString === "Namespace") {
      project.modules.push(parseModule(mod));
    } else {
      console.error(
        `Detected a "${mod.kindString}" node at the root level; we would expect only Namespace/module definitions at the root level`
      );
    }
  }
  return project;
}
