import { en } from "~/stop-words";
import { IScrapeSelectorTargets } from "~/types";
import { createModel } from "~/utils/createModel";

export type IConsolidatedModel = Omit<
  IScrapeSelectorTargets,
  | "hierarchy_radio_lvl0"
  | "hierarchy_radio_lvl1"
  | "hierarchy_radio_lvl2"
  | "hierarchy_radio_lvl3"
  | "hierarchy_radio_lvl4"
  | "hierarchy_radio_lvl5"
> & {
  /**
   * top level sections in a document; in a Markdown doc this
   * would typically be an H2 tag
   */
  sections: string[] | null;
  /**
   * a subsection of the document; in a Markdown doc this would
   * typically be an H3 tag
   */
  sub_sections: string[] | null;

  kind?: string;

  area: string | null;
  /**
   * The source content/index which this document was derived from
   */
  from: "prose" | "api" | "repo";
  rank: number;

  /**
   * most useful for API documents where it has the clearest mapping but
   * we can sometimes report on this in other docs too
   */
  symbol: string | null;
  /**
   * A great mechanism for content authors to add words that should
   * be associated with the document in markdown (as frontmatter).
   * In repo's we can also add topics of the repo into this property.
   */
  tags: null | string[];
  /**
   * allows association of content to a particular programming language
   */
  language: string | null;
  /** the main body of text  */
  text: string | null;
};

export const ConsolidatedModel = createModel<IConsolidatedModel>("consolidated", (c) =>
  c
    .pk("objectID")
    .stopWords(en)
    .synonyms({
      ts: ["typescript", "javascript", "js"],
      js: ["typescript", "javascript", "js"],
      typescript: ["ts", "javascript", "js"],
      javascript: ["ts", "typescript", "js"],
      function: ["fn"],
      fn: ["function"],
      enum: ["enumeration"],
      enumeration: ["enum"],
    })
    .filterable("from", "language", "symbol")
    .searchable(
      "area",
      "symbol",
      "tags",
      "hierarchy_lvl0",
      "hierarchy_lvl1",
      "sections",
      "rank",
      "hierarchy_lvl2",
      "hierarchy_lvl3",
      "hierarchy_lvl4",
      "hierarchy_lvl5",
      "text",
      "kind",
      "sub_sections"
    )
    .rankingRules((r) =>
      r.words().typo().sort().attribute().proximity().ASC("rank").exactness()
    )
);
