/* eslint-disable no-console */
import process from "node:process";
import { parseTypescriptAst } from "~/ast/parseTypescriptAst";
import { TypescriptMapper } from "~/mappers/TypescriptMapper";

(async () => {
  const symbols = (await parseTypescriptAst()).symbols;

  const find = process.argv[2];
  const found = symbols.find((i) => i.name === find);
  if (found) {
    console.log({
      symbol: find,
      ast: found,
      doc: TypescriptMapper(found),
    });
  } else {
    console.error(`Didn't find the symbol ${find}!`);
  }
})();
