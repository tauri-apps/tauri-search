import { TypescriptKind } from "~/enums";
import { TsAstVariable, TypescriptBlock } from "~/types";

export function parseVariable(mod: string, v: TypescriptBlock): TsAstVariable {
  return {
    kind: TypescriptKind.Variable,
    name: v.name,
    module: mod,
    comment: v.comment,
    type: v.type,
    defaultValue: v.defaultValue,
    fileName: v.sources?.shift()?.fileName as string,
  };
}
