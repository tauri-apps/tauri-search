import { TypescriptKind } from "~/enums";
import { TsAstClass, TypescriptBlock } from "~/types";

export function parseClass(mod: string, fn: TypescriptBlock): TsAstClass {
  return {
    kind: TypescriptKind.Class,
    name: fn.name,
    module: mod,
    comment: fn.comment,
    type: fn.type,
    properties:
      fn.signatures?.map((s) => ({
        name: s.name,
        kind: s.kindString,
        comment: s.comment,
        type: s.type,
      })) || [],
    fileName: fn.sources?.shift()?.fileName as string,
  };
}
