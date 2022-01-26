/**
 * A type utility which takes an _input_ data structure (aka, Markdown, AST, etc.) and allows
 * mapping that input into an valid document model for MeiliSearch.
 *
 * ```ts
 * const mapper: ModelMapper<MarkdownAst, {title: string, kind: string}> = i => {
 *    title: i.title,
 *    kind: "markdown"
 * }
 * ```
 */
export type ModelMapper<TInput extends Record<string, any>, TOutput extends {}> = (
  i: TInput
) => {
  [K in keyof TOutput]: TOutput[K];
};
