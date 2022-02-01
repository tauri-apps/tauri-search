import axios from "axios";

export interface LinkExists {
  url: string;
  ok: true;
  code: number;
}
export interface LinkMissing {
  url: string;
  ok: false;
  code: number;
  error: string;
}

export async function linkExists(url: string) {
  try {
    const res = await axios.head(url, { timeout: 3000 });
    return { url, ok: true, code: res.status } as LinkExists;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return {
        url,
        ok: false,
        code: err.response?.status || -1,
        error: err.response?.data?.message || err.response?.statusText,
      } as LinkMissing;
    }

    return { url, ok: false, code: -1, error: (err as Error).message } as LinkMissing;
  }
}
