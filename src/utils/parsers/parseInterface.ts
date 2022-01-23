import { TypescriptKind } from "~/enums";
import { TsAstInterface, TypescriptBlock } from "~/types";

export function parseInterface(mod: string, i: TypescriptBlock): TsAstInterface {
  return {
    kind: TypescriptKind.Interface,
    name: i.name,
    module: mod,
    comment: i.comment,
    type: i.type,
    fileName: i.sources?.shift()?.fileName as string,
    properties:
      i.children?.map((c) => ({
        name: c.name,
        kind: c.kindString,
        comment: c.comment,
        type: c.type,
      })) || [],
  };
}
