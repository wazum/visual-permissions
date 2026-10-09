export interface Notice {
  readonly kind: string
  readonly title: string
  readonly message: string | undefined
}

export const notices: Notice[] = []

export function forgetNotices(): void {
  notices.length = 0
}

const Notification = {
  success: (title: string, message?: string): void => {
    notices.push({ kind: 'success', title, message })
  },
  error: (title: string, message?: string): void => {
    notices.push({ kind: 'error', title, message })
  },
}

export default Notification
