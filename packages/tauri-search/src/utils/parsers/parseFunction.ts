import { TypescriptKind } from "~/enums";
import { TsAstFunction, TypescriptBlock } from "~/types";

export function parseFunction(mod: string, fn: TypescriptBlock): TsAstFunction {
  return {
    kind: TypescriptKind.Function,
    name: fn.name,
    module: mod,
    comment: fn.comment,
    type: fn.type,
    signature:
      fn.signatures?.map((s) => ({
        name: s.name,
        kind: s.kindString,
        comment: s.comment,
        type: s.type,
      })) || [],
    fileName: fn.sources?.shift()?.fileName as string,
  };
}
