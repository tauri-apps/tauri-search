import { TypescriptKind } from "~/enums";
import { TsAstEnumeration, TypescriptBlock } from "~/types";

export function parseEnumeration(mod: string, fn: TypescriptBlock): TsAstEnumeration {
  return {
    kind: TypescriptKind.Enumeration,
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
