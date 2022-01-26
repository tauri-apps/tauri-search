import { ModelMapper } from "~/types";

/**
 * Provides a simple API surface for mapping between two types
 */
export type Mapper<TInput extends {}, TOutput extends {}> = {
  name: Readonly<string>;
  props: Readonly<ModelMapper<TInput, TOutput>>;
  map: <I extends TInput | TInput[]>(
    input: I
  ) => I extends TInput[] ? TOutput[] : TOutput;
};

/**
 * Facilitates the mapping from one data type to another.
 *
 * ```ts
 * export default createMapper<Input, Output>("my-mapper", i => {
 *    foo: i.bar,
 *    static: 42
 * })
 * ```
 */
export const createMapper = <TInput extends {}, TOutput extends {}>(
  name: string,
  props: ModelMapper<TInput, TOutput>
): Mapper<TInput, TOutput> => {
  return {
    name,
    props,
    map(input: TInput | TInput[]) {
      return (
        Array.isArray(input)
          ? (input.map((i) => props(i)) as TOutput[])
          : (props(input) as TOutput)
      ) as typeof input extends TInput[] ? TOutput[] : TOutput;
    },
  };
};
