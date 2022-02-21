/* eslint-disable no-console */
import { getContent } from "~/utils/getContent";
import { TsDocProject, TypescriptBlock, TypescriptSymbol } from "~/types";
import { TypescriptKind } from "~/enums";

const fixtureContent = getContent({ file: "test/fixtures/tsdoc.json" });

function parseModule(mod: TypescriptBlock) {
  const modDefn: TypescriptSymbol = {
    kind: TypescriptKind.Namespace,
    name: mod.name,
    module: mod.name,
    type: mod.type,
    fileName: mod.sources?.shift()?.fileName || "UNKNOWN",
    comment: mod?.comment?.text || mod?.comment?.text,
    commentTags: mod?.comment?.tags,
  };
  const symbols: TypescriptSymbol[] = [modDefn];

  for (const i of mod.children || []) {
    symbols.push({
      kind: i.kindString,
      name: i.name,
      module: mod.name,
      comment: i?.comment?.text || i?.comment?.text,
      commentTags: i?.comment?.tags,
      type: i.type,
      fileName: i.sources?.shift()?.fileName || "UNKNOWN",
      signatures: i.signatures?.map((s) => ({
        name: s.name,
        kind: s.kindString,
        comment: s.comment,
        type: s.type,
      })),
      children: i.children,
    });
  }

  return symbols;
}

/**
 * Converts the output of TSDoc's JSON format (tree-like AST) and converts
 * to a simple list in a more compact format which aligns better with mapping to
 * search indexes.
 *
 * The AST Tree received as input broadly fits the format:
 * - Project -- 1:M --> Modules
 * - Modules -- 1:M --> Symbols
 * - Symbols may have children too which represents details of the symbol (e.g., params, props, etc)
 *
 * @param source if not specified will use historically factual fixture data, if a URL it will load over network, if a file then will load over file system
 */
export async function parseTypescriptAst(
  // AST Project
  content?: TypescriptBlock
): Promise<TsDocProject> {
  const ast = content ? content : (JSON.parse(await fixtureContent()) as TypescriptBlock);

  /**
   * The top level "project" isn't probably worth putting into the index,
   * but instead we'll start at the modules level.
   */
  const project: TsDocProject = {
    project: ast.name,
    comment: ast.comment,
    symbols: [],
  };

  for (const mod of ast.children || []) {
    project.symbols.push(...parseModule(mod));
  }

  return project;
}
