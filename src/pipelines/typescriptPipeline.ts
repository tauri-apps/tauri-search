import api from "~/models/api";
import {
  tsClass,
  tsFunction,
  tsModule,
  tsTypeAlias,
  tsReference,
  tsInterface,
} from "~/mappers";
import { parseTypescriptAst } from "~/utils/parseTypescriptAst";
import { MsAddOrReplace } from "~/types";
import { tsVariable } from "~/mappers/tsVariable";
import { tsEnumeration } from "~/mappers/tsEnumeration";

/**
 * Will iterate over each Typescript _module_ and all of the
 * modules symbols and use the `addOrUpdate` call to ensure
 * the index is fully up-to-date.
 */
export async function typescriptPipeline() {
  // get AST from output of TSDoc's JSON option
  const ast = await parseTypescriptAst();
  const model = await api;

  const waitFor: Promise<MsAddOrReplace>[] = [];

  for (const mod of ast.modules) {
    // map AST model to the Document Model and add/update in MeiliSearch
    waitFor.push(model.query.addOrReplaceDoc(tsModule.map(mod)));
    // functions
    for (const fn of mod.functions) {
      waitFor.push(model.query.addOrReplaceDoc(tsFunction.map(fn)));
    }
    // classes
    for (const c of mod.classes) {
      waitFor.push(model.query.addOrReplaceDoc(tsClass.map(c)));
    }
    // interfaces
    for (const i of mod.interfaces) {
      waitFor.push(model.query.addOrReplaceDoc(tsInterface.map(i)));
    }

    // variables
    for (const v of mod.variables) {
      waitFor.push(model.query.addOrReplaceDoc(tsVariable.map(v)));
    }

    // enumerations
    for (const e of mod.enums) {
      waitFor.push(model.query.addOrReplaceDoc(tsEnumeration.map(e)));
    }

    // type-aliases
    for (const ta of mod.typeAliases) {
      waitFor.push(model.query.addOrReplaceDoc(tsTypeAlias.map(ta)));
    }
    // references
    for (const ref of mod.references) {
      waitFor.push(model.query.addOrReplaceDoc(tsReference.map(ref)));
    }
  }

  const results = await Promise.all(waitFor);
  console.log(results.map((i) => `${i?.indexUid}: ${i?.status}`));
}
