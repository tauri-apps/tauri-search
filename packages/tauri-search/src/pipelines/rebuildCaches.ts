import { refreshProse, refreshRepos, refreshTypescript } from ".";

export async function rebuildCaches() {
  let prose: [string, number] = ["", 0];
  let repos: [string, number] = ["", 0];
  let typescript: [string, number] = ["", 0];
  await Promise.all([
    refreshProse().then((c) => (prose = [c.cacheFile as string, c.docs?.length || 0])),
    refreshRepos().then((c) => (repos = [c.cacheFile as string, c.docs?.length || 0])),
    refreshTypescript().then(
      (c) => (typescript = [c.cacheFile as string, c.docs?.length || 0])
    ),
  ]);

  return { prose, repos, typescript };
}
