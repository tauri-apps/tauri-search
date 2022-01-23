#!/usr/bin/env node
// summarizes results from the `parseTypescriptAst()` function and returns to stdout

import { parseTypescriptAst } from "~/utils/parseTypescriptAst";

(async () => {
  const ast = await parseTypescriptAst();
  const overview = ast.modules.map((m) => ({
    module: m.name,
    fns: m.functions?.map((f) => f.name),
    interfaces: m.interfaces?.map((f) => f.name),
    typeAliases: m.typeAliases?.map((t) => t.name),
    classes: m.classes?.map((c) => c.name),
    variables: m.variables?.map((v) => v.name),
    references: m.references?.map((v) => v.name),
    other: m.other.map((o) => `${o.name} [${o.kindString}]`),
  }));

  console.log(JSON.stringify(overview));
})();
