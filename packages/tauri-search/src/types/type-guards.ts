import { Type } from "~/enums";
import { DocumentProperty, NumericLiteral, StringLiteral } from "./apis";

export function isStringLiteral(prop: DocumentProperty): prop is StringLiteral {
  return prop.type === Type.StringLiteral;
}

export function isNumericLiteral(prop: DocumentProperty): prop is NumericLiteral {
  return prop.type === Type.StringLiteral;
}
