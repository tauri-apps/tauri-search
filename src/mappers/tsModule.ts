import { TAURI_JS_DOCS_URL } from "~/constants";
import { ApiModel } from "~/models/api";
import { TsAstModule } from "~/types";
import { createMapper } from "~/utils/createMapper";

/**
 * Maps a **Typescript Module** to the Meilisearch documents for that module.
 */
export const tsModule = createMapper<TsAstModule, ApiModel>("tsModule", (i) => {
  return {
    id: `module_${i.name}`,
    language: "typescript",
    kind: i.kind,
    module: i.name,
    name: i.name,
    fileName: i.fileName,
    comments: i.comment?.text || i.comment?.shortText,
    tags: i.comment?.tags?.map(
      (t) =>
        `<span class="tag">@${t.tag}:</span> <span class="tag-description">${t?.text}</span>`
    ),
    url: `${TAURI_JS_DOCS_URL}/modules/${i.name}`,
  };
});
