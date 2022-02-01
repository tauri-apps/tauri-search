import { config } from "dotenv";
import { writeFile } from "fs/promises";
import { parseTypescriptAst } from "~/ast/parseTypescriptAst";
import { TS_AST_CACHE, TS_DOCS_CACHE } from "~/constants";
import { TypescriptMapper } from "~/mappers";
import { IApiModel } from "..";

export async function refreshTypescript(repo: string, branch: string) {
  const prod = { repo, branch, filepath: "ts-api.json" };
  config();

  const ast =
    process.env.NODE_ENV === "production"
      ? await parseTypescriptAst(prod)
      : await parseTypescriptAst();

  await writeFile(TS_AST_CACHE, JSON.stringify(ast));
  let docs: IApiModel[] = [];
  for (const i of ast.symbols) {
    docs.push(TypescriptMapper(i));
  }
  await writeFile(TS_DOCS_CACHE, JSON.stringify(docs));

  return docs;
}
