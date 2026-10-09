export const processed: unknown[] = []

export function forgetItems(): void {
  processed.length = 0
}

export class JavaScriptItemProcessor {
  processItems(items: unknown[]): void {
    processed.push(...items)
  }
}
