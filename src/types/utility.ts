import { TupleToUnion } from "inferred-types";
import { Type } from "~/enums";
import { DocumentProperty } from "./apis";

export type LookupType<T extends DocumentProperty> = T["type"] extends Type.Boolean
  ? Boolean
  : T["type"] extends Type.String
  ? string
  : T["type"] extends Type.Number
  ? number
  : T["type"] extends Type.NumericLiteral
  ? TupleToUnion<T["literals"]>
  : T["type"] extends Type.StringLiteral
  ? TupleToUnion<T["literals"]>
  : "shit!";
