import { readFile } from "fs/promises";
import { beforeAll } from "vitest";
import { describe, expect, it } from "vitest";
import { RUST_AST_FIXTURE } from "~/constants";

export interface IRustAst {
  root: string;
  /** semver string */
  crate_version: string;
  includes_private: boolean;
  index: any;
  paths: any;
  external_crates: any;
  format_version: number;
}

describe("parseRustAst()", () => {
  let ast: IRustAst;
  beforeAll(async () => {
    ast = JSON.parse(await readFile(RUST_AST_FIXTURE, "utf-8")) as IRustAst;
  });
  it("loaded fixture structure", () => {
    expect(typeof ast.format_version).toEqual("number");

    // crate_version is a semver string
    expect(typeof ast.crate_version).toEqual("string");
    expect(ast.crate_version.split(".")).toHaveLength(3);
  });
});
