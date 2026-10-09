// A browser told to keep no site data throws at every touch of the tab's storage, and no
// note is worth losing the switch over.
export function writeNote(key: string, value: string): void {
  try {
    sessionStorage.setItem(key, value)
  } catch {
  }
}

export function readNote(key: string): string | null {
  try {
    return sessionStorage.getItem(key)
  } catch {
    return null
  }
}

export function dropNote(key: string): void {
  try {
    sessionStorage.removeItem(key)
  } catch {
  }
}
