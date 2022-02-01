import { TAURI_JS_DOCS_URL } from "~/constants";
import { TypescriptKind } from "~/enums";
import { IApiModel } from "~/models/ApiModel";
import { ModelMapper, TypescriptSymbol } from "~/types";
import { sanitizeDocId } from "~/utils/sanitizeDocId";

function symbolToUrl(module: string, kind: TypescriptKind, symbol: string) {
  switch (kind) {
    case TypescriptKind.Class:
      return `${TAURI_JS_DOCS_URL}/classes/${module}.${symbol}`;
    default:
      return `${TAURI_JS_DOCS_URL}/modules/${module}#${symbol}`;
  }
}

function symbolToDeclaration(i: TypescriptSymbol) {
  switch (i.kind) {
    case TypescriptKind.Reference:
      return `type ${i.name} = {\n\t${i.children?.map((s) => s.name).join(",\n\t")}\n}`;
    case TypescriptKind.Enumeration:
      return `enum ${i.name} {\n\t${i.children?.map((s) => s.name).join(",\n\t")}\n}`;
    case TypescriptKind.Class:
      return `Class ${i.name} {\n\t${i.children?.map((s) => s.name).join(",\n\t")}\n}`;
    case TypescriptKind.Interface:
      return `interface ${i.name} {\n\t${i.children
        ?.map((s) => s.name)
        .join(",\n\t")}\n}`;
    case TypescriptKind.Namespace:
      return `Module ${i.name}`;
    case TypescriptKind.Function:
      // TODO: see if we can get this filled in
      const returnType = "";
      const parameters = i.signatures?.map((s) => `${s.name}: ${s.type.name}`).join(", ");
      return `function ${i.name}(${parameters})${returnType} { ... }`;

    default:
      return `${i.kind} ${i.name}`;
  }
}

/**
 * Maps a Typescript symbol definition to an API document modeled as `IApiModel`
 */
export const TypescriptMapper: ModelMapper<TypescriptSymbol, IApiModel> = (i) => ({
  id: sanitizeDocId(`ts_${i.module}_${i.kind}_${i.name}`),
  name: i.name,
  kind: i.kind,
  module: i.module,
  language: "typescript",
  type: i.type,

  commentTags: i?.commentTags,
  comment: i.comment,

  // Type Specific
  declaration: symbolToDeclaration(i),
  url: symbolToUrl(i.module, i.kind, i.name),
});
