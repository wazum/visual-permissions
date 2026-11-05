const keyPrefix = 't3-'

export default {
  get(key: string): string | null {
    return localStorage.getItem(keyPrefix + key)
  },

  set(key: string, value: string): void {
    localStorage.setItem(keyPrefix + key, value)
  },

  unset(key: string): void {
    localStorage.removeItem(keyPrefix + key)
  },

  isset(key: string): boolean {
    return localStorage.getItem(keyPrefix + key) !== null
  },
}
