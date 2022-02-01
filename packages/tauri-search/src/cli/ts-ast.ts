#!/usr/bin/env node
// summarizes results from the `parseTypescriptAst()` function and returns to stdout

import { parseTypescriptAst } from "~/ast/parseTypescriptAst";

(async () => {
  const ast = await parseTypescriptAst();
  console.log(JSON.stringify(ast));
})();
