import { capitalize, createLookup } from "native-dash";
import { TypescriptKind } from "~/enums";
import { IConsolidatedModel, IApiModel } from "~/models";
import { ModelMapper } from "~/types";
import { IndexRank } from "../ConsolidatedMapper";

export type Symbol = "Namespace" | "Function" | "Enumeration";
const shorten = createLookup<TypescriptKind, String>(
  {
    Namespace: "Module",
    Function: "Fn",
    Enumeration: "Enum",
    "Call Signature": "Fn",
    Class: "Class",
    Reference: "Ref",
    "Type alias": "Type",
    "Type literal": "Type",
    "Type parameter": "Type",
    "Enumeration member": "Enum Member",
    Interface: "Interface",
    Parameter: "Parameter",
    Project: "Project",
    Property: "Prop",
    Variable: "Var",
  },
  (v) => v as String
);

export const ApiToConsolidated: ModelMapper<IApiModel, IConsolidatedModel> = (i) => ({
  objectID: i.id,
  from: "api",
  rank: IndexRank.repo,

  sections: null,
  sub_sections: null,

  symbol: i.name,
  kind: i.kind,
  area: i.module,
  language: i.language,

  tags: i.tags || [],
  text: i.comment?.trim()?.slice(0, 40) || "",

  // compatibility props
  content: i.declaration || null,
  hierarchy_lvl0: "API Docs",
  hierarchy_lvl1: i.name,
  hierarchy_lvl2:
    i.module !== i.name
      ? `${capitalize(i.language.slice(0, 1))}S  ⇢  Module[ ${i.module} ]  ⇢  ${shorten(
          i.kind
        )}[ ${i.name} ]`
      : `${capitalize(i.language.slice(0, 1))}S  ⇢  ${shorten(i.kind)}[ ${i.name} ]`,
  hierarchy_lvl3: null,
  hierarchy_lvl4: null,
  hierarchy_lvl5: null,
  hierarchy_lvl6: null,

  url: i.url,
});
