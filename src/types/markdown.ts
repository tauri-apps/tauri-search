export type MarkdownAst = {
  // File info

  filename: string;
  path: string;
  lastUpdated: number;
  createdAt: number;

  title?: string;
  tags?: string[];

  h1: string;
  h2: string[];
  h3: string[];
};
