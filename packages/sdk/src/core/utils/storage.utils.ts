export function setSessionStorageItem(key: string, value: string): void {
  sessionStorage.setItem(key, value);
}

export function getSessionStorageItem(key: string): string | null {
  const storedValue = sessionStorage.getItem(key);
  if (storedValue) {
    return storedValue;
  }
  return null;
}

export function removeSessionStorageItem(key: string): void {
  sessionStorage.removeItem(key);
}
