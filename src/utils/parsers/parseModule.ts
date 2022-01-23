import { TypescriptKind } from "~/enums";
import { TsAstModule, TypescriptBlock } from "~/types";
import { parseClass } from "./parseClass";
import { parseEnumeration } from "./parseEnumeration";
import { parseFunction } from "./parseFunction";
import { parseInterface } from "./parseInterface";
import { parseReference } from "./parseReference";
import { parseTypeAlias } from "./parseTypeAlias";

export function parseModule(mod: TypescriptBlock) {
  const modDefn: TsAstModule = {
    kind: TypescriptKind.Namespace,
    name: mod.name,
    fileName: mod.sources?.shift()?.fileName,
    comment: mod.comment,
    interfaces: [],
    classes: [],
    variables: [],
    typeAliases: [],
    enums: [],
    functions: [],
    references: [],
    other: [],
  };
  for (const i of mod.children || []) {
    switch (i.kindString) {
      case TypescriptKind.Enumeration:
        modDefn.enums.push(parseEnumeration(mod, i));
        break;
      case TypescriptKind.Function:
        modDefn.functions.push(parseFunction(mod.name, i));
        break;
      case TypescriptKind.Interface:
        modDefn.interfaces.push(parseInterface(mod.name, i));
        break;
      case TypescriptKind.Class:
        modDefn.classes.push(parseClass(mod.name, i));
        break;
      case TypescriptKind.Variable:
        modDefn.variables.push(i);
        break;
      case TypescriptKind.TypeAlias:
        modDefn.typeAliases.push(parseTypeAlias(mod.name, i));
        break;
      case TypescriptKind.Reference:
        modDefn.references.push(parseReference(mod.name, i));
        break;

      default:
        modDefn.other.push(i);
    }
  }

  return modDefn;
}
