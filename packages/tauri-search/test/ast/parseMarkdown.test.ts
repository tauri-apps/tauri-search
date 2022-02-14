import { describe, expect, it } from "vitest";
import { parseMarkdown } from "../../src/ast/parseMarkdown";

describe("markdownParser()", () => {
  describe("Fixture tests", async () => {
    const files = [
      "get-started/intro.md",
      "guides/updater.md",
      "guides/cli.md", //
    ].map((i) => `test/fixtures/prose/${i}`);

    const fileMeta = await parseMarkdown({ files });
    const expectations: Record<
      string,
      {
        h1?: string[];
        h2: string[];
        h3: string[];
        programmingLanguages: string[];
        frontmatter: Record<string, any>;
      }
    > = {
      "cli.md": {
        h1: [],
        h2: [
          "Adding Arguments",
          "Reading the matches",
          "Subcommands",
          "Complete Documentation",
        ],
        h3: [
          "Positional Arguments",
          "Named Arguments",
          "Flag Arguments",
          "Rust",
          "Javascript",
        ],
        programmingLanguages: ["rust", "js", "json", "bash"],
        frontmatter: { title: "Make your own CLI" },
      },
      "updater.md": {
        h1: ["Configuration", "Server Support", "Bundler (Artifacts)", "Signing updates"],
        h2: [
          "Update Requests",
          "Built-in dialog",
          "Javascript API",
          "Events",
          "Update Server JSON Format",
          "Update File JSON Format",
          "macOS",
          "Windows",
          "Linux",
        ],
        h3: [
          "Initialize updater and check if a new version is available",
          "Rust",
          "Javascript",
          "Listen New Update Available",
          "Rust",
          "Javascript",
          "Emit Install and Download",
          "Rust",
          "Javascript",
          "Listen Install Progress",
          "Rust",
          "Javascript",
        ],
        programmingLanguages: ["json", "js", "rust", "none", "bash"],
        frontmatter: {},
      },
      "intro.md": {
        h1: [],
        h2: ["Steps"],
        h3: ["Setting up Your Environment"],
        programmingLanguages: [],
        frontmatter: { title: "Introduction", pagination_next: null },
      },
    };

    for (const f of fileMeta) {
      it(`Hx: ${f.filepath}/${f.filename}`, async () => {
        for (const h2 of expectations[f.filename]["h2"]) {
          expect(f.h2.every((i) => h2.includes(i.content)));
        }
        for (const h3 of expectations[f.filename]["h3"]) {
          expect(f.h2.every((i) => h3.includes(i.content)));
        }
      });
      it(`Prog Lang: ${f.filepath}/${f.filename}`, async () => {
        // expect(
        //   f.programmingLanguages.length,
        //   `We expect programming languages to include: ${expectations[f.filename][
        //     "programmingLanguages"
        //   ].join(", ")} but instead got: ${f.programmingLanguages.join(", ")}`
        // ).toBe(expectations[f.filename]["programmingLanguages"].length);
        const expectedLangs = expectations[f.filename]["programmingLanguages"];
        expect(
          f.programmingLanguages.every((i) => expectedLangs.includes(i)),
          `found: ${f.programmingLanguages.join(
            ", "
          )} but but expected every member of [${expectations[f.filename][
            "programmingLanguages"
          ].join(", ")}]`
        ).toBeTruthy();
      });
      it(`Frontmatter:: ${f.filepath}/${f.filename}`, async () => {
        for (const key of Object.keys(expectations[f.filename]["frontmatter"] || {})) {
          expect(f.frontmatter[key]).toBe(expectations[f.filename]["frontmatter"][key]);
        }
      });
    }
  });
});
