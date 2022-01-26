import { readFile } from "fs/promises";
import xxhash from "xxhash-wasm";
import matter from "gray-matter";
import smd from "simple-markdown";

export function isHeading(something: string): something is "h1" | "h2" | "h3" {
  return ["h1", "h2", "h3"].includes(something);
}

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

/**
 * Takes in a list of files and parses them in three ways:
 *
 * 1. uses the `greymatter` library to extract
 *    - all frontmatter data
 *    - the MD content with the frontmatter extracted
 * 2. uses the `simple-markdown` parser to detect:
 *    - H1 through H3 tags
 *    - `hasCodeBlock` boolean flag and array of `programmingLanguages` if there are
 *    - `otherTags` just a list of tag names found (but no content provided)
 * 3. finally it will also add the `filepath` and `filename` along with a content `hash`
 * which can be used detect whether content has changed
 */
export async function markdownParser(files: string[]) {
  // const { h32 } = await xxhash();

  const tokens: MarkdownAst[] = [];
  for (const f of files) {
    try {
      const { filename, filepath } = splitFile(f);
      const content = await readFile(f, { encoding: "utf-8" });
      // const hash = h32(content);
      // TODO: turn hashing back on once figure out why Vite is throwing a compiler error
      const hash = 42;
      const { data: frontmatter, content: text } = matter(content);
      const { h1, h2, h3, hasCodeBlock, programmingLanguages, otherSymbols } =
        simpleParse(f, content);
      tokens.push({
        filename,
        filepath,
        hash,
        frontmatter,
        text,
        h1,
        h2,
        h3,
        hasCodeBlock,
        programmingLanguages,
        otherSymbols,
      });
    } catch (err) {
      err.message = `Problem parsing file ${f}: ${err.message}`;
      throw err;
    }
  }
  return tokens;
}

function splitFile(f: string) {
  const parts = f.split("/");
  return {
    filename: parts[parts.length - 1],
    filepath: parts.slice(0, parts.length - 1).join("/"),
  };
}

function simpleParse(f: string, content: string) {
  const ast = smd.defaultBlockParse(content);
  const headings = {
    h1: [] as { content: string; type: string }[],
    h2: [] as { content: string; type: string }[],
    h3: [] as { content: string; type: string }[],
  };
  const otherSymbols = new Set<string>();
  let hasCodeBlock = false;
  const programmingLanguages = new Set<string>();

  const extract = (nodeArray: smd.SingleASTNode[]) => {
    if (!Array.isArray(nodeArray)) {
      console.log("not an array", nodeArray);
      return;
    }
    for (const node of nodeArray) {
      switch (node.type) {
        case "heading":
          const tag = `h${Number(node.level)}`;
          if (isHeading(tag)) {
            // the object content appears to be wrapped in an array of length 1
            // it is possible that in some edge cases the array length is greater
            if (Array.isArray(node.content)) {
              headings[tag].push(node.content[0] as { content: string; type: string });
              if (node.content.length > 1) {
                console.warn(
                  `A heading tag in "${f}" was found which accumulated ${
                    node.content.length
                  } content elements in a single entry; only expected 1: ${node.content
                    .map((n) => n.type)
                    .join(", ")}`
                );
              }
            } else {
              console.warn(
                `The file ${f} got a headings tag that wasn't wrapped in an array element; this wasn't expected.`
              );
            }
          } else {
            otherSymbols.add(tag);
          }
          break;
        case "codeBlock":
          hasCodeBlock = true;
          programmingLanguages.add(node.lang);
          break;

        default:
          otherSymbols.add(node.type);
      }

      if (node.content) {
        for (const child of node.content) {
          if (Array.isArray(child)) {
            extract(child);
          }
        }
      }
    }
  };
  extract(ast);

  return {
    ...headings,
    hasCodeBlock,
    programmingLanguages: Array.from(programmingLanguages),
    otherSymbols: Array.from(otherSymbols),
  };
}
