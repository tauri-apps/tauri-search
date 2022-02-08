import { parseTypescriptAst } from "~/ast/parseTypescriptAst";
import { TypescriptMapper } from "~/mappers";
import { CacheKind, getCache } from "~/utils/getCache";
import { getEnv } from "~/utils/getEnv/esm/getEnv";
import { getRepoFile } from "~/utils/github/getRepoFile";
import { writeCacheFile } from "~/utils/writeCacheFile";
import { TypescriptBlock, IEnv } from "~/types";
import { IApiModel } from "~/models";

/**
 * Refreshes the document cache
 */
export async function refreshTypescript(options: Partial<IEnv> = {}) {
  const { org, repo, branch, tsAstPath } = { ...getEnv(), ...options };
  const { cacheFile } = await getCache(CacheKind.typescriptDocs, {
    ...getEnv(),
    ...options,
  });
  const ast = (await getRepoFile(`${org}/${repo}`, tsAstPath, branch)) as TypescriptBlock;

  const simplified = await parseTypescriptAst(ast);

  const docs: IApiModel[] = simplified.symbols.map((i) => TypescriptMapper(i));

  await writeCacheFile(cacheFile, docs);

  return { docs, cacheFile, repo: `${org}/${repo}@${branch}` };
}
