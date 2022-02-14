import { describe, expect, it, beforeAll } from "vitest";
import { parseTypescriptAst } from "~/ast/parseTypescriptAst";
import { TypescriptKind } from "~/enums";
import type { Expect, Equal } from "@type-challenges/utils";
import { TsDocProject, TypescriptBlock, TypescriptSymbol } from "~/types";
import { getRepoFile } from "~/utils/github/getRepoFile";
import { getEnv } from "~/utils/getEnv/esm/getEnv";

let prj: TsDocProject;

describe.only("typescriptParser() - AST to List", () => {
  beforeAll(async () => {
    const { org, repo } = getEnv();
    const content = (await getRepoFile(
      `${org}/${repo}`,
      "docs/api/js/js-api.json"
    )) as TypescriptBlock;
    prj = await parseTypescriptAst(content);
  });
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

  it.todo("calling parser with a URL loads data over network", async () => {
    // const ts = await parseTypescriptAst({
    //   url: "https://raw.githubusercontent.com/tauri-search/test/fixtures/tsdoc.json",
    // });
    // expect(ts.project).toBe("@tauri-apps/api");
    // expect(ts.comment.shortText).toBe(
    //   "The Tauri API allows you to interface with the backend layer."
    // );
    // expect(Array.isArray(ts.symbols)).toBeTruthy();
    // expect(ts.symbols.filter((i) => i.kind === TypescriptKind.Namespace).length).toBe(16);
  });

  // HL Structural Tests

  it("all items in the list have a 'module' property to indicate ownership", async () => {
    expect(prj.symbols.every((i) => i.module && i.module.length > 0));
  });
  it("type information for each item is correctly set as 'ITypescriptSymbol'", async () => {
    type Received = typeof prj;

    type cases = [
      Expect<Equal<Received, TsDocProject>>,
      Expect<Equal<Received["symbols"], TypescriptSymbol[]>>
    ];
    const cases: cases = [true, true];
    expect(cases).toBeTruthy();
  });

  // Specific "Depth Charge" Tests (using fixtures)
  // 1. symbol existance tests
  const modules = [
    "app",
    "cli",
    "clipboard",
    "dialog",
    "event",
    "fs",
    "globalShortcut",
    "http",
    "notification",
    "os",
    "path",
    "process",
    "shell",
    "tauri",
    "updater",
    "window",
  ];

  it("found at least as many top level modules as was statically known in test", () => {
    const foundModules = Array.from(new Set(prj.symbols.map((i) => i.module)));

    expect(
      foundModules.length,
      `the modules found were: ${foundModules.join(", ")}`
    ).toBeGreaterThanOrEqual(modules.length);
  });

  it("all top level modules found", async () => {
    const foundModules = Array.from(new Set(prj.symbols.map((i) => i.module)));

    for (const f of modules) {
      expect(foundModules.includes(f), `module "${f}" was not found!`).toBeTruthy();
    }
  });

  const expectedSymbols = [
    {
      m: "notification",
      s: ["isPermissionGranted", "requestPermission", "sendNotification", "Permission"],
    },
    {
      m: "http",
      s: ["FetchOptions", "HttpVerb", "Part", "RequestOptions", "fetch", "getClient"],
    },
    {
      m: "clipboard",
      s: ["readText", "writeText"],
    },
  ];

  for (const s of expectedSymbols) {
    it(`Module "${s.m}" has all expected symbols: ${s.s.join(", ")}`, () => {
      const found = prj.symbols.filter((i) => i.module === s.m).map((i) => i.name);
      for (const lookFor of s.s) {
        expect(
          found.includes(lookFor),
          `expected module ${s.m} to have the symbol "${s.s}"`
        ).toBeTruthy();
      }
    });
  }
});
