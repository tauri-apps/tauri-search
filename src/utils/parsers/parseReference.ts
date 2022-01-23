import { TypescriptKind } from "~/enums";
import { TsAstReference, TypescriptBlock } from "~/types";

export function parseReference(mod: string, i: TypescriptBlock): TsAstReference {
  return {
    kind: TypescriptKind.Reference,
    name: i.name,
    module: mod,
    comment: i.comment,
    type: i.type,
    target: i.target,
    fileName: i.sources?.shift()?.fileName as string,
    children: i?.children || [],
  };
}
