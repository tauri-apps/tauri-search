import { TypescriptKind } from "~/enums";
import { en } from "~/stop-words";
import { createModel } from "~/utils/createModel";
import { TsComment } from "..";

export interface IApiModel {
  id: string;
  language: "rust" | "typescript";
  /** the name of the Symbol */
  name: string;

  /**
   * The symbol's type (aka, Interface, Function, etc.)
   *
   * Note: at the top level this can be a module too
   */
  kind: TypescriptKind;
  /**
   * The module which contains the given symbol
   *
   * Note: this will be the same as "name" when processing a Module document
   */
  module: string;
  /**
   * a textual representation of the symbol
   */
  declaration?: string;

  tags?: string[];

  comment?: string;
  commentTags?: TsComment["tags"];

  parameters?: { name: string; type?: string; comment?: string; kind: TypescriptKind }[];

  url: string;
}

export const ApiModel = createModel<IApiModel>("api", (c) =>
  c //
    .stopWords(en)
    .filterable("language", "kind", "module", "tags")
);
