import { Type } from "~/enums";
import {
  DocumentProperty,
  ModelPropsApi,
  NumberProp,
  NumericLiteral,
  StringLiteral,
  StringProp,
} from "~/types/apis";
import { propCharacteristics } from "./propCharacteristics";

export const propsApi = (
  update: <T extends Partial<DocumentProperty>>(s: T) => void
): ModelPropsApi => {
  return {
    string: <T extends string[]>(...literals: T) => {
      const state =
        literals && literals.length > 0
          ? ({
              type: Type.StringLiteral,
              literals,
              flags: [],
            } as StringLiteral)
          : ({ type: Type.String, flags: [] } as StringProp);

      // update state in case no flags set
      update(literals ? { type: Type.StringLiteral, literals } : { type: Type.String });

      return propCharacteristics(update);
    },
    number: <T extends number[]>(...literals: T) => {
      update(literals ? { type: Type.NumericLiteral, literals } : { type: Type.String });

      return propCharacteristics(update);
    },
    url: () => {
      update({ type: Type.Url });
      return propCharacteristics(update);
    },
    boolean: () => {
      update({ type: Type.Boolean });
      return propCharacteristics(update);
    },
  };
};
