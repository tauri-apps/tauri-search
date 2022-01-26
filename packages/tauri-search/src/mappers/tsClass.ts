import { TAURI_JS_DOCS_URL } from "~/constants";
import { ApiModel } from "~/models/api";
import { TsAstClass } from "~/types";
import { createMapper } from "~/utils/createMapper";

/**
 * Maps a **Typescript Module** to the Meilisearch documents for that module.
 */
export const tsClass = createMapper<TsAstClass, ApiModel>("tsClass", (i) => ({
  id: `module_${i.module}_class_${i.name}`,
  language: "typescript",
  kind: i.kind,
  name: i.name,
  fileName: i.fileName,
  module: i.module,
  comment: i.comment?.text || i.comment?.shortText,
  tags: i.comment?.tags
    ? i.comment?.tags?.map(
        (t) =>
          `<span class="tag">@${t.tag}:</span> <span class="tag-description">${t?.text}</span>`
      )
    : undefined,
  parameters: i.properties.map((s) => ({
    name: s.name,
    kind: s.kind,
    type: s.type.name,
    comment: s.comment?.text || s.comment?.shortText,
  })),
  declaration: `Class ${i.name} {\n\t${i.properties
    ?.map((s) => `s.name`)
    .join(",\n\t")}\n}`,
  url: `${TAURI_JS_DOCS_URL}/classes/${i.module}.${i.name}`,
}));
