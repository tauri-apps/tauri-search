import { describe, expect, it } from "vitest";
import smd from "simple-markdown-2";

// TODO: come back and see if we can monkey patch in improved rules or possibly look for a different parser
/**
 * the default rules from simple-markdown aren't picking up all languages in code blocks.
 */
describe.skip("markdown tools", () => {
  it("json code block detected when presented in normal fashion", () => {
    const content = `
# Example
This is an example

\`\`\`json
{
  "foo": "bar"
}
\`\`\`
`;
    const parser = smd.defaultBlockParse;
    const tree = parser(content);
    const codeBlocks = tree.filter((i) => i.lang === "json");
    console.log(JSON.stringify(tree, null, 2));
    expect(codeBlocks.length).toBe(1);
  });

  it("json code block detected when it immediately following a heading tag ", () => {
    const content = `
# Example
\`\`\`json
{
  "foo": "bar"
}
\`\`\`
`;
    const parser = smd.defaultBlockParse;
    const tree = parser(content);
    const codeBlocks = tree.filter((i) => i.lang === "json");
    console.log(JSON.stringify(tree, null, 2));

    expect(codeBlocks.length).toBe(1);
  });

  it("json code block detected when there is syntax to right of language", () => {
    const content = `
# Example
\`\`\`json title=src-tauri/tauri.conf.json:tauri.cli
{
  "foo": "bar"
}
\`\`\`
`;
    const parser = smd.defaultBlockParse;
    const tree = parser(content);
    const inlineCode = tree.filter((i) => i.type === "text");
    console.log(JSON.stringify(tree, null, 2));

    expect(inlineCode.length).toBe(1);
  });

  it("json code block detected when there is syntax to right of language", () => {
    const content = `
    Add this in tauri.conf.json
    \`\`\`json
    "updater": {
        "active": true,
        "endpoints": [
            "https://releases.myapp.com/{{target}}/{{current_version}}"
        ],
        "dialog": true,
        "pubkey": ""
    }
    \`\`\`
`;
    const parser = smd.defaultBlockParse;
    const tree = parser(content);
    const inlineCode = tree.filter((i) => i.type === "text");
    console.log(JSON.stringify(tree, null, 2));

    expect(inlineCode.length).toBe(1);
  });
});
