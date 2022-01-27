export type MarkdownAst = {
  filename: string;
  filepath: string;
  /** the full text of the markdown content */
  text: string;
  /** a hash indicating the current state of the document */
  hash: number;
  /** a key-value dictionary of frontmatter variables */
  frontmatter: Record<string, any>;
  h1: { content: string; type: string }[];
  h2: { content: string; type: string }[];
  h3: { content: string; type: string }[];
  /** boolean flag indicating whether there was a code block */
  hasCodeBlock: boolean;
  /** if there were code blocks, this will list the languages found */
  programmingLanguages: string[];
  /** other symbols found in the markdown that weren't specifically expressed */
  otherSymbols: string[];
};

export interface ITauriFrontmatter {
  title?: string;
  category?: string;
  tags?: string[];
}
