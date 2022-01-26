import { describe, expect, it } from "vitest";
import { parseTypescriptAst } from "~/ast/parseTypescriptAst";
import { TypescriptKind } from "~/enums";

describe("typescriptParser() - AST to List", () => {
  // Initiation Tests

  it("calling parser without parameters defaults to fixture data", async () => {
    const ts = await parseTypescriptAst();
    expect(ts.project).toBe("@tauri-apps/api");
    expect(ts.comment.shortText).toBe(
      "The Tauri API allows you to interface with the backend layer."
    );
    expect(Array.isArray(ts.symbols)).toBeTruthy();
    expect(ts.symbols.filter((i) => i.kind === TypescriptKind.Namespace).length).toBe(16);
  });

  it("calling parser with a filename loads data from file", async () => {
    const ts = await parseTypescriptAst({ file: "test/fixtures/tsdoc.json" });
    expect(ts.project).toBe("@tauri-apps/api");
    expect(ts.comment.shortText).toBe(
      "The Tauri API allows you to interface with the backend layer."
    );
    expect(Array.isArray(ts.symbols)).toBeTruthy();
    expect(ts.symbols.filter((i) => i.kind === TypescriptKind.Namespace).length).toBe(16);
  });

  it.todo("calling parser with a URL loads data over network", async () => {
    const ts = await parseTypescriptAst({
      url: "https://raw.githubusercontent.com/tauri-search/test/fixtures/tsdoc.json",
    });
    expect(ts.project).toBe("@tauri-apps/api");
    expect(ts.comment.shortText).toBe(
      "The Tauri API allows you to interface with the backend layer."
    );
    expect(Array.isArray(ts.symbols)).toBeTruthy();
    expect(ts.symbols.filter((i) => i.kind === TypescriptKind.Namespace).length).toBe(16);
  });

  // HL Structural Tests

  it.todo("parsed data comes back as a list", () => {});
  it.todo("all items in the list have a tag 'module' to indicate ownership", () => {});
  it.todo("type information for each item is correctly set as 'ITypescriptSymbol'");

  // Specific "Depth Charge" Tests (using fixtures)
});
