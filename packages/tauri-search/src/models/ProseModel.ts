import { en } from "~/stop-words";
import { createModel } from "~/utils/createModel";

export interface IProseModel {
  id: string;
  /** comes from frontmatter or the H1 tag; ideally frontmatter */
  title: string;
  /** taken from frontmatter, it allows authors to bring in words which relate to the content */
  tags?: string[];
  /** the broad area in the documentation this doc sits */
  category?: string;
  /** the sections of a document; represented as an H2 */
  sections?: string[];
  /** the sub-sections of a document; represented as an H3 */
  subSections?: string[];
  /** the programming languages which have code examples in this document */
  code?: string[];

  text: string;
  url: `https://${string}`;
}

export const ProseModel = createModel<IProseModel>("prose", (c) =>
  c //
    .stopWords(en)
    .synonyms({
      ts: ["typescript", "javascript", "js"],
      js: ["typescript", "javascript", "js"],
      typescript: ["ts", "javascript", "js"],
      javascript: ["ts", "typescript", "js"],
    })
);
