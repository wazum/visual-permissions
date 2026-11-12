import { createDraft } from './draft.js'
import { initialise as fields } from './fields.js'
import { initialise as foot } from './foot.js'
import { createJudgement } from './judgement.js'
import { initialise as markCards } from './mark-card.js'
import { initialise as otherKinds } from './other-kinds.js'
import { initialise as pick } from './pick.js'
import { initialise as preview } from './preview.js'

export function initialise(signal: AbortSignal): void {
  const judgement = createJudgement()
  fields(judgement, signal)
  markCards(judgement, signal)

  const draft = createDraft()
  pick(draft, signal)
  foot(draft, signal)

  otherKinds(signal)
  preview(signal)
}
