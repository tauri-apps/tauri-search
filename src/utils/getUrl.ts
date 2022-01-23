import { env } from "process";

export function getUrl(offset: string = "") {
  const host = env.HOST || "localhost";
  const port = env.PORT || "7700";
  const protocol =
    env.PROTO || host === "localhost" || host.startsWith("192.") ? "http://" : "https://";
  const url = env.URL ? env.URL : `${protocol}${host}:${port}/`;
  if (offset.startsWith("/")) {
    offset = offset.slice(1);
  }
  return url.endsWith("/") ? `${url}${offset}` : `${url}/${offset}`;
}
