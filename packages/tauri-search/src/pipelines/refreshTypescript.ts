import { parseTypescriptAst } from "~/ast/parseTypescriptAst";
import { TypescriptMapper } from "~/mappers";
import { CacheKind, getCache } from "~/utils/getCache";
import { getEnv, IEnv } from "~/utils/getEnv";
import { getRepoFile } from "~/utils/github/getRepoFile";
import { writeCacheFile } from "~/utils/writeCacheFile";
import { IApiModel, TypescriptBlock } from "..";

/**
 * Refreshes the document cache
 */
export async function refreshTypescript(options: Partial<IEnv> = {}) {
  const { org, repo, branch } = { ...getEnv(), ...options };
  const { cacheFile } = await getCache(CacheKind.typescriptDocs, {
    ...getEnv(),
    ...options,
  });
  const ast = (await getRepoFile(
    `${org}/${repo}`,
    "docs/api/js/js-api.json",
    branch
  )) as TypescriptBlock;

  const simplified = await parseTypescriptAst(ast);

  const docs: IApiModel[] = simplified.symbols.map((i) => TypescriptMapper(i));

  await writeCacheFile(cacheFile, docs);

  return { docs, cacheFile, repo: `${org}/${repo}@${branch}` };
}
