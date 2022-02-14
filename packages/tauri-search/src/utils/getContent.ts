import axios from "axios";
import { readFile } from "fs/promises";
import { getRepoFile } from "./github/getRepoFile";

export type FileSource = { file: string; url?: undefined; repo?: undefined };
export type UrlSource = { url: string; file?: undefined; repo?: undefined };
export type RepoSource = {
  url?: undefined;
  file?: undefined;
  repo: `${string}/${string}`;
  filepath: string;
  branch?: string;
};

export type IGetContentFallback = FileSource | UrlSource | RepoSource;
export type IGetContentOptions = IGetContentFallback | {};

export function isRepoSource(source: IGetContentFallback): source is RepoSource {
  return "repo" in source && "branch" in source;
}

export function isFileSource(source: IGetContentFallback): source is FileSource {
  return "file" in source;
}

export function isUrlSource(source: IGetContentFallback): source is UrlSource {
  return "url" in source;
}

/**
 * **getContent**
 *
 * Utility which allows for setting a fallback location and then exposing a
 * consumer facing function which allows a user to choose from a file or network
 * based location for content.
 *
 * Note: the first caller who sets up this higher-order function gets to choose
 * the expected "type" of the content
 */
export const getContent =
  (fallback: IGetContentFallback) =>
  async (options: IGetContentOptions = {}): Promise<string> => {
    const config =
      Object.keys(options).length > 0 ? (options as IGetContentFallback) : fallback;
    let content: string;
    if (isFileSource(config)) {
      content = await readFile(config.file, { encoding: "utf-8" });
    } else if (isUrlSource(config)) {
      content = (await axios.get(config.url)).data;
    } else if (isRepoSource(config)) {
      content = (await getRepoFile(
        config.repo,
        config.filepath,
        config.branch
      )) as string;
    } else {
      throw new Error(`No content reference passed in!`);
    }

    return content;
  };
