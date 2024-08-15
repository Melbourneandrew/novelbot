const LOCAL_STORAGE_KEY = "request_history";
const MAX_HISTORY_LENGTH = 10;

export function addEntryToRequestHistory(entry: string) {
  let history = [];
  const storedHistory = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (storedHistory) {
    history = JSON.parse(storedHistory);
    if (history.length > MAX_HISTORY_LENGTH) {
      history.shift();
    }
  }
  history.push(entry);
  localStorage.setItem(
    LOCAL_STORAGE_KEY,
    JSON.stringify(history)
  );
}

export function getEntriesFromRequestHistory(): string[] {
  const storedHistory = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (storedHistory) {
    return JSON.parse(storedHistory);
  }
  return [];
}
