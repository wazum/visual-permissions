import type { ChainStep, Permissions } from '../platform/transport.js'

// What the form was last judged by: the fields slice asks, a mark reads
export interface Judgement {
  givenBy(token: string): readonly ChainStep[]
  take(permissions: Permissions): void
}

export function createJudgement(): Judgement {
  // Stryker disable next-line ArrayDeclaration: a mark asks only once the form was judged
  let chain: readonly ChainStep[] = []
  let givenBy: Permissions['scopes']['fields']['givenBy'] = {}

  return {
    givenBy: token => chain.filter(step => givenBy[token]?.includes(step.groupId)),
    take: permissions => {
      chain = permissions.chain
      givenBy = permissions.scopes.fields.givenBy
    },
  }
}
