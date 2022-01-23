import { TypescriptKind } from "~/enums";
import { TsAstTypeAlias, TypescriptBlock } from "~/types";

export function parseTypeAlias(mod: string, ta: TypescriptBlock): TsAstTypeAlias {
  return {
    kind: TypescriptKind.TypeAlias,
    name: ta.name,
    module: mod,
    comment: ta.comment,

    type: ta.type,
    fileName: ta.sources?.shift()?.fileName as string,
  };
}
