/**
 * 13.4 calls the list of records by an older name, which names nothing on 14.3. Delete this
 * with 13.4 support, and the calls that add it.
 */
export const withOlderNames = (modules: readonly string[]): readonly string[] => [...modules, 'web_list']
