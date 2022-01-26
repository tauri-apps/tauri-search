import { TAURI_JS_DOCS_URL } from "~/constants";
import { ApiModel } from "~/models/api";
import { TsAstTypeAlias } from "~/types";
import { createMapper } from "~/utils/createMapper";

/**
 * Maps a **Typescript Type Alias** to the Meilisearch documents for that module.
 */
export const tsTypeAlias = createMapper<TsAstTypeAlias, ApiModel>("tsTypeAlias", (i) => ({
  id: `module_${i.module}_type-alias_${i.name}`,
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

  // declaration: `Type ${i.name} = {\n\t${i.properties
  //   .map((s) => `s.name`)
  //   .join(",\n\t")}\n}`,
  url: `${TAURI_JS_DOCS_URL}/modules/${i.module}#${i.name}`,
}));
