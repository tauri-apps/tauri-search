import { TAURI_BASE_URL } from "~/constants";
import { IProseModel } from "~/models/ProseModel";
import { MarkdownAst, ModelMapper } from "~/types";
import { sanitizeDocId } from "~/utils/sanitizeDocId";

function extractMatter(m: unknown) {
  switch (typeof m) {
    case "string":
      return m;
    case "object":
      return "content" in (m as Object) ? (m as { content: string }).content : undefined;

    default:
      return undefined;
  }
}

function extractSections(filepath: string) {
  const parts = filepath.split("/").filter((i) => i !== "docs");
  return {
    area: parts[0],
    parentSection: parts.length > 2 ? parts.slice(-2)[0] : undefined,
    section: parts.slice(-1)[0],
  };
}

/**
 * Map markdown AST to the appropriate document structure
 */
export const ProseMapper: ModelMapper<MarkdownAst, IProseModel> = (i) => {
  const { area, parentSection, section } = extractSections(i.filepath);
  return {
    id: sanitizeDocId(`prose_${i.filepath}_${i.filename}`),
    title:
      extractMatter(i.frontmatter?.title) ||
      extractMatter(i.h1.shift()) ||
      extractMatter(i.frontmatter?.sidebar_label) ||
      "",
    tags: i.frontmatter?.tags,

    area: i.frontmatter?.area || area,
    parentSection,
    section: i.frontmatter?.section || section,

    headings: i.h2.map((i) => extractMatter(i) as string),
    subHeadings: i.h3.map((i) => extractMatter(i) as string),

    code: i.programmingLanguages,
    text: i.text,

    url: `${TAURI_BASE_URL}/${i.filepath.replace("docs/", "").replace(/\d{2}-/, "")}/${i.filename.replace(".md", "")}`,
  };
};
