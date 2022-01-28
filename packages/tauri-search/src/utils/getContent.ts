import axios from "axios";
import { readFile } from "fs/promises";

export type IGetContentFallback =
  | { file: string; url?: undefined }
  | { url: string; file?: undefined };
export type IGetContentOptions = IGetContentFallback | {};

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
    if (config?.file) {
      content = await readFile(config.file, { encoding: "utf-8" });
    } else if (config?.url) {
      content = (await axios.get(config.url)).data;
    } else {
      throw new Error(`No content reference passed in!`);
    }

    return content;
  };
