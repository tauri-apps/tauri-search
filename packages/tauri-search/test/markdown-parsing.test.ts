import { readFileSync } from "fs";
import matter from "gray-matter";
import smd from "simple-markdown";
import { describe, expect, it } from "vitest";

export function isHeading(something: string): something is "h1" | "h2" | "h3" {
  return ["h1", "h2", "h3"].includes(something);
}

const contributorGuide = () =>
  readFileSync("test/fixtures/prose/guides/contributor-guide.md", "utf-8");

describe("markdown parsing tools", () => {
  it("frontmatter extracted by greymatter", () => {
    const output = matter(contributorGuide());
    expect(Object.keys(output.data)).toContain("title");
  });

  it("simple-markdown extracts heading tags", () => {
    const ast = smd.defaultBlockParse(contributorGuide());
    const headings = {
      h1: [] as any[],
      h2: [] as any[],
      h3: [] as any[],
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
              headings[tag].push(node.content[0]);
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

    console.log("h1", headings.h1);
    console.log("h2", headings.h2);
    console.log("h3", headings.h3);
    console.log(otherSymbols);
    console.log(hasCodeBlock, programmingLanguages);
  });
});
