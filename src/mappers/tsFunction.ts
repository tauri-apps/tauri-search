import { TAURI_JS_DOCS_URL } from "~/constants";
import { ApiModel } from "~/models/api";
import { TsAstFunction } from "~/types";
import { createMapper } from "~/utils/createMapper";

/**
 * Maps a **Typescript Module** to the Meilisearch documents for that module.
 */
export const tsFunction = createMapper<TsAstFunction, ApiModel>("tsFunction", (i) => ({
  id: `module_${i.module}_function_${i.name}`,
  language: "typescript",
  kind: i.kind,
  name: i.name,
  fileName: i.fileName,
  module: i.module,
  comment: i.comment?.text || i.comment?.shortText,
  tags: i.comment?.tags?.map(
    (t) =>
      `<span class="tag">@${t.tag}:</span> <span class="tag-description">${t?.text}</span>`
  ),
  parameters: i.signature.map((s) => ({
    name: s.name,
    kind: s.kind,
    type: s.type.name,
    comment: s.comment?.text || s.comment?.shortText,
  })),
  declaration: `function ${i.name}(${i.signature.map((s) => `s.name`).join(", ")})`,
  url: `${TAURI_JS_DOCS_URL}/modules/${i.module}#${i.name}`,
}));
