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

function addEntryToRequestHistory(entry: string) {
  let history = [];
  const storedHistory = localStorage.getItem("request_history");
  if (storedHistory) {
    history = JSON.parse(storedHistory);
    if (history.length > 10) {
      history.shift();
    }
  }
  history.push(entry);
  localStorage.setItem("request_history", JSON.stringify(history));
}
