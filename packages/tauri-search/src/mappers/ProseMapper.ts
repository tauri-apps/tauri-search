import { TAURI_BASE_URL } from "~/constants";
import { IProseModel } from "~/models/ProseModel";
import { MarkdownAst, ModelMapper } from "~/types";
import { sanitizeDocId } from "~/utils/sanitizeDocId";

/**
 * Map markdown AST to the appropriate document structure
 */
export const ProseMapper: ModelMapper<MarkdownAst, IProseModel> = (i) => ({
  id: sanitizeDocId(`prose_${i.filepath}_${i.filename}`),
  title:
    typeof i.frontmatter.title === "object" && "content" in i.frontmatter.title
      ? i.frontmatter.title?.content
      : i.frontmatter.title || i.h1.shift() || "UNKNOWN",
  tags: i.frontmatter.tags as string[],
  category: i.frontmatter.section as string,
  sections: i.h2.map((i) => i.content),
  subSections: i.h3.map((i) => i.content),
  code: i.programmingLanguages,
  text: i.text,
  url: `${TAURI_BASE_URL}/${i.filepath}/${i.filename.replace(".md", "")}`,
});
