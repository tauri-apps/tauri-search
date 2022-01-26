import { MeiliSearchApi } from "../MeiliSearchApi";

/** adds implementation for the API endpoints of MeiliSearch */
export function meiliApi<TDoc extends {}>(idx: string) {
  const { endpoints } = MeiliSearchApi(idx);
  return endpoints;
}
