import axios, { AxiosRequestConfig } from "axios";

export async function getUrl<T = unknown>(url: string, options: AxiosRequestConfig = {}) {
  const res = await axios.get<T>(url, options).catch((err) => {
    if (axios.isAxiosError(err) && err.response) {
      throw new Error(
        `\nProblems requesting the URL[${err.response.status}]: ${url}\n  - message: ${err.response.data?.message}`
      );
    } else {
      throw new Error(
        `\nProblems requesting the URL [${err?.status || " "}]: ${url}\n -  message: ${
          err.message
        }`
      );
    }
  });

  return res.data;
}
