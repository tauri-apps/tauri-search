import { TypescriptKind } from "~/enums";
import { TypescriptSymbol, TypescriptBlock } from "~/types";

export function parseModule(mod: TypescriptBlock) {
  const modDefn: TypescriptSymbol = {
    kind: TypescriptKind.Namespace,
    name: mod.name,
    module: mod.name,
    type: mod.type,
    fileName: mod.sources?.shift()?.fileName,
    comment: mod.comment,
    children: [],
  };
  const symbols: TypescriptSymbol[] = [modDefn];

  for (const i of mod.children || []) {
    symbols.push({
      kind: i.kindString,
      name: i.name,
      module: mod.name,
      comment: i.comment,
      type: i.type,
      fileName: i.sources?.shift()?.fileName || "",
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
