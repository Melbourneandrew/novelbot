import { addEntryToRequestHistory } from "./request-history";
export async function Fetch(
  input: URL | RequestInfo,
  init?: RequestInit | undefined
): Promise<Response> {
  addEntryToRequestHistory(JSON.stringify({ input, init }));
  const res = await fetch(input, init);
  if (res.status === 401) {
    window.location.href = "/login";
  }
  return res;
}
