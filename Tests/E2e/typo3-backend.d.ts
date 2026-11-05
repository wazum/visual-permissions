declare module '@typo3/backend/storage/persistent.js' {
  const Persistent: {
    get(key: string): unknown
    set(key: string, value: unknown): Promise<unknown>
  }

  export default Persistent
}
