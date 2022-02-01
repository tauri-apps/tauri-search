import { Type } from "~/enums";
import { IApiModel, IConsolidatedModel, IProseModel, IRepoModel } from "~/models";
import { DocumentProperty, NumericLiteral, StringLiteral } from "./apis";

export function isStringLiteral(prop: DocumentProperty): prop is StringLiteral {
  return prop.type === Type.StringLiteral;
}

export function isNumericLiteral(prop: DocumentProperty): prop is NumericLiteral {
  return prop.type === Type.StringLiteral;
}

export function isProseDocument(doc: unknown): doc is IProseModel {
  return (
    typeof doc === "object" &&
    "id" in (doc as Object) &&
    (doc as any)?.id.startsWith("prose_")
  );
}

export function isApiDocument(doc: unknown): doc is IApiModel {
  return (
    typeof doc === "object" &&
    "id" in (doc as Object) &&
    ((doc as any)?.id.startsWith("ts_") || (doc as any)?.id.startsWith("rs_"))
  );
}

export function isRepoDocument(doc: unknown): doc is IRepoModel {
  return (
    typeof doc === "object" &&
    "id" in (doc as Object) &&
    (doc as any)?.id.startsWith("github_")
  );
}

export function isConsolidatedDocument(doc: unknown): doc is IConsolidatedModel {
  return typeof doc === "object" && "lvl0" in (doc as Object);
}
