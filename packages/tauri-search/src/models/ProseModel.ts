import { en } from "~/stop-words";
import { createModel } from "~/utils/createModel";

export interface IProseModel {
  id: string;
  /** comes from frontmatter or the H1 tag; ideally frontmatter */
  title: string;
  /** taken from frontmatter, it allows authors to bring in words which relate to the content */
  tags?: string[];

  /** the broad area in the documentation this doc sits */
  area?: string;

  /**
   * for cases where there is a level between the top level "area" and
   * the more specific "section" this document resides in
   */
  parentSection?: string;

  /** the more specific section the documentionat is in */
  section?: string;

  /** the sections of a document; represented as an H2 */
  headings?: string[];
  /** the sub-sections of a document; represented as an H3 */
  subHeadings?: string[];
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
