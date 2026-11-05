import type { ChainStep, Permissions } from '../platform/transport.js'

// What the form was last judged by: the fields slice asks, a mark reads
export interface Judgement {
  allowedBy(token: string): readonly ChainStep[]
  take(permissions: Permissions): void
}

export function createJudgement(): Judgement {
  // Stryker disable next-line ArrayDeclaration: a mark asks only once the form was judged
  let chain: readonly ChainStep[] = []
  let allowedBy: Permissions['scopes']['fields']['allowedBy'] = {}

  return {
    allowedBy: token => chain.filter(step => allowedBy[token]?.includes(step.groupId)),
    take: permissions => {
      chain = permissions.chain
      allowedBy = permissions.scopes.fields.allowedBy
    },
  }
}
