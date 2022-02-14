/* eslint-disable no-console */
/* eslint-disable no-use-before-define */
import { readFile } from "fs/promises";
// import xxhash from "xxhash-wasm";
import matter from "gray-matter";
import { convert } from "html-to-text";
import smd from "simple-markdown-2";
import { ITauriFrontmatter, MarkdownAst } from "~/types/markdown";

export function isHeading(something: string): something is "h1" | "h2" | "h3" {
  return ["h1", "h2", "h3"].includes(something);
}

/**
 * Checks that frontmatter content is in the right form
 */
function validateFrontmatter(f: string, matter: Record<string, any>) {
  const typedMatter = { ...matter } as ITauriFrontmatter;
  if (matter?.title && typeof matter.title !== "string") {
    console.error(
      `The frontmatter for "title" property needs to be a string but was a "${typeof matter.title}" in file ${f}.`
    );
    typedMatter.title = "UNKNOWN";
  }

  if (matter?.tags && Array.isArray(matter.tags)) {
    console.error(
      `The frontmatter for "tags" property needs to be an array of strings but was detected as "${typeof matter.title}" in file ${f}.`
    );
    typedMatter.tags = [];
  }
  if (matter?.category && typeof matter.category !== "string") {
    console.error(
      `The frontmatter for "category" property needs to be a string but was a "${typeof matter.title}" in file ${f}.`
    );
    typedMatter.category = undefined;
  }

  return typedMatter;
}

function isLocalFiles(input: MarkdownInput): input is { files: string[] } {
  return "files" in input;
}
// function isContentWithFile(input: ParseMarkdown):

export type MarkdownInput = { files: string[] } | { content: string; file: string };

function parseContent(f: string, content: string) {
  // const hash = h32(content);
  // TODO: turn hashing back on once figure out why Vite is throwing a compiler error
  const hash = 42;
  const { data: frontmatter, content: text } = matter(content);
  const { h1, h2, h3, hasCodeBlock, programmingLanguages, otherSymbols } = simpleParse(
    f,
    content
  );
  const { filename, filepath } = splitFile(f);

  return {
    filename,
    filepath,
    hash,
    frontmatter: validateFrontmatter(f, frontmatter),
    text: convert(text),
    h1,
    h2,
    h3,
    hasCodeBlock,
    programmingLanguages,
    otherSymbols,
  } as MarkdownAst;
}

/**
 * Takes in either list of files (in filesystem) or the content of a markdown along with it's filename
 * and parses it in three ways:
 *
 * 1. uses the `graymatter` library to extract
 *    - all frontmatter data
 *    - the MD content with the frontmatter extracted
 * 2. uses the `simple-markdown` parser to detect:
 *    - H1 through H3 tags
 *    - `hasCodeBlock` boolean flag and array of `programmingLanguages` if there are
 *    - `otherTags` just a list of tag names found (but no content provided)
 * 3. finally it will also add the `filepath` and `filename` along with a content `hash`
 * which can be used detect whether content has changed
 */
export async function parseMarkdown<T extends MarkdownInput>(input: T) {
  let ast: MarkdownAst | MarkdownAst[];
  if (isLocalFiles(input)) {
    const tokens: MarkdownAst[] = [];
    for (const f of input.files) {
      try {
        const content = await readFile(f, { encoding: "utf-8" });
        tokens.push(parseContent(f, content));
      } catch (err) {
        (err as Error).message = `Problem parsing file ${f}: ${(err as Error).message}`;
        throw err;
      }
    }
    ast = tokens;
  } else {
    ast = parseContent(input.file, input.content);
  }

  return ast as T extends { files: string[] } ? MarkdownAst[] : MarkdownAst;
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
                // console.error(
                //   `A heading tag in "${f}" was found which accumulated ${
                //     node.content.length
                //   } content elements in a single entry; only expected 1: ${node.content
                //     .map((n) => n.type)
                //     .join(", ")}`
                // );
              }
            } else {
              console.error(
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

        case "paragraph":
          if (Array.isArray(node.content)) {
            extract(node.content);
          }
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
