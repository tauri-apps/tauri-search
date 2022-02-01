import { TypescriptKind } from "~/enums";

export interface TsType {
  type: "intrinsic" | "literal" | "array" | "union" | "reflection" | "reference";
  types?: TsType[];
  name?: string;
  typeArguments?: TsType[];
  elementType?: TsType;
  declaration?: any;
}

export interface TsComment {
  shortText?: string;
  text?: string;
  tags?: { tag: string; text: string }[];
}

export interface TypescriptBlock {
  id: number;
  name: string;
  originalName?: string;
  kind: number;
  target?: number;
  kindString: TypescriptKind;
  flags: {};
  comment: TsComment;
  type: TsType;
  defaultValue?: any;
  signatures?: TypescriptBlock[];
  children?: TypescriptBlock[];
  sources?: { fileName: string; line: number; character: number }[];
  groups?: { title: string; kind: number; children: number[] }[];
}

/**
 * An Interface definition
 */
export interface TsAstInterface {
  kind: TypescriptKind.Interface;
  name: string;
  module: string;
  comment: TsComment;
  type: TsType;
  properties: { name: string; kind: TypescriptKind; comment: TsComment; type: TsType }[];
  fileName: string;
}

export interface TsAstReference {
  kind: TypescriptKind.Reference;
  name: string;
  module: string;
  comment: TsComment;
  type: TsType;
  target?: number;
  fileName: string;
  children: TypescriptBlock[];
}

/**
 * A function definition
 */
export interface TsAstFunction {
  /** the module the function belongs to */
  module: string;
  kind: TypescriptKind.Function;
  name: string;
  originalName?: string;
  comment: TsComment;
  type: TsType;
  signature: { name: string; kind: TypescriptKind; comment: TsComment; type: TsType }[];
  fileName: string;
}

export interface TsAstClass {
  kind: TypescriptKind.Class;
  name: string;
  module: string;
  comment: TsComment;
  type: TsType;
  properties: { name: string; kind: TypescriptKind; comment: TsComment; type: TsType }[];
  fileName: string;
}

export interface TsAstEnumeration {
  kind: TypescriptKind.Enumeration;
  name: string;
  module: string;
  comment: TsComment;
  type: TsType;
  properties: { name: string; kind: TypescriptKind; comment: TsComment; type: TsType }[];
  fileName: string;
}

export interface TsAstTypeAlias {
  kind: TypescriptKind.TypeAlias;
  name: string;
  module: string;
  comment: TsComment;
  type: TsType;
  defaultValue: any;
  fileName: string;
}

export interface TsAstVariable {
  kind: TypescriptKind.Variable;
  name: string;
  module: string;
  comment: TsComment;
  defaultValue?: any;
  type: TsType;
  fileName: string;
}

/**
 * A module/namespace is a top level container of any project and contains
 * references to all the symbols associated with a given module.
 */
export type TypescriptSymbol = {
  kind: TypescriptKind;
  name: string;
  module: string;
  type: TsType;
  fileName: string;
  comment?: string;
  commentTags?: TsComment["tags"];
  signatures?: { name: string; kind: string; comment: TsComment; type: TsType }[];
  children?: TypescriptBlock[];
};

/**
 * Project level AST structure organized by modules
 */
export interface TsDocProject {
  project: string;
  comment: TsComment;
  symbols: TypescriptSymbol[];
}
