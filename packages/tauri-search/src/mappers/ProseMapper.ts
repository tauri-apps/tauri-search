import { TAURI_BASE_URL } from "~/constants";
import { IProseModel } from "~/models/ProseModel";
import { MarkdownAst } from "~/types/markdown";
import { ModelMapper } from "../types";

/**
 * Map markdown AST to the appropriate document structure
 */
export const ProseMapper: ModelMapper<MarkdownAst, IProseModel> = (i) => ({
  id: `prose_${i.filepath.replace("/", "_")}_${i.filename}`,
  title: i.frontmatter.title || i.h1.shift() || "UNKNOWN",
  tags: i.frontmatter.tags as string[],
  category: i.frontmatter.section as string,
  sections: i.h2.map((i) => i.content),
  subSections: i.h3.map((i) => i.content),
  code: i.programmingLanguages,
  text: i.text,
  url: `${TAURI_BASE_URL}/docs/${i.filepath}/${i.filename.replace(".md", "")}`,
});
