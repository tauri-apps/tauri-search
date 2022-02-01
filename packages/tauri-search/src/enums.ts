export enum TypescriptKind {
  Project = "Project",
  Namespace = "Namespace",
  Function = "Function",
  CallSignature = "Call Signature",
  Property = "Property",
  Interface = "Interface",
  Parameter = "Parameter",
  TypeAlias = "Type alias",
  TypeLiteral = "Type literal",
  TypeParameter = "Type parameter",
  Enumeration = "Enumeration",
  EnumerationMember = "Enumeration member",
  Class = "Class",
  Variable = "Variable",
  Reference = "Reference",
}

export enum Type {
  Undefined = "undefined",
  String = "string",
  Url = "`http:${string}`",
  Number = "number",
  Boolean = "boolean",
  StringLiteral = "string-literal",
  NumericLiteral = "numeric-literal",
}
