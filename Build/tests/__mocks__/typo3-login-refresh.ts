let asked = 0

export function sessionChecks(): number {
  return asked
}

export function forgetSessionChecks(): void {
  asked = 0
}

export default {
  checkActiveSession: async (): Promise<void> => {
    asked += 1

    return Promise.resolve()
  },
}
