import axios from "axios";
import { join } from "node:path";
import { GITHUB_API_BASE } from "~/constants";
import { GithubContentsReq, GithubContentsResp } from "~/types";
import { getEnv } from "~/utils/getEnv";

const DEFAULT: GithubContentsReq = {
  owner: "tauri-apps",
  path: "docs",
  repo: "tauri",
  ref: "dev",
};

export interface IDocsSitemapFile {
  name: string;
  size: number;
  sha: string;
  download_url: string;
}

export interface IDocsSitemap {
  dir: string;
  files: IDocsSitemapFile[];
  children: IDocsSitemap[];
}

async function getDirectory(o: GithubContentsReq) {
  const { github_token, github_user } = getEnv();

  const url = `${GITHUB_API_BASE}/repos/${o.owner}/${o.repo}/contents/${o.path}?ref=${o.ref}`;
  try {
    const res = await axios.get<GithubContentsResp>(url, {
      httpAgent: "Tauri Search",
      ...(github_token && github_user
        ? { auth: { username: github_user, password: github_token } }
        : {}),
    });
    if (res.status < 299) {
      return res;
    } else {
      throw new Error(
        `The attempt to call Github's "contents" API failed [${res.status}, ${url}]: ${res.statusText}`
      );
    }
  } catch (err) {
    throw new Error(
      `The attempt to call Github's "contents" API failed [${url}]: ${
        (err as Error).message
      }`
    );
  }
}

function reduceClutter(
  dir: string,
  resp: GithubContentsResp
): [files: IDocsSitemap["files"], children: string[]] {
  if (!Array.isArray(resp)) {
    resp = [resp];
  }
  const files: IDocsSitemap["files"] = resp
    .filter((i) => i.type === "file" && i.name.endsWith(".md"))
    .map((f) => ({
      name: f.name,
      size: f.size,
      sha: f.sha,
      download_url: f.download_url as string,
    }));

  const children = resp.filter((i) => i.type === "dir").map((d) => d.name);

  return [files, children];
}

/**
 * Uses Github API to build a sitemap of markdown files for a given repo
 */
export async function refreshSitemap(options: Partial<GithubContentsReq> = DEFAULT) {
  const o = { ...DEFAULT, ...options };
  const [files, children] = reduceClutter(o.path, (await getDirectory(o)).data);
  const sitemap: IDocsSitemap = {
    dir: o.path,
    files,
    children: [],
  };
  if (children.length > 0) {
    const waitFor: Promise<IDocsSitemap>[] = [];
    for (const child of children) {
      const p = join(o.path, `/${child}`);
      const mo = { ...o, path: p };
      waitFor.push(refreshSitemap(mo));
    }
    const resolved = await Promise.all(waitFor);
    sitemap.children = resolved;
  }

  return sitemap;
}
