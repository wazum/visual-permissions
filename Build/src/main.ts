import { initialise as markBody } from './platform/body.js'
import { initialise as headerControls } from './surfaces/toolbar/controls.js'
import { initialise as selectGroup } from './pick-a-group/select.js'
import { initialise as fields } from './grant-fields/fields.js'
import { createDraft } from './grant-fields/draft.js'
import { createJudgement } from './grant-fields/judgement.js'
import { initialise as pickFields } from './grant-fields/pick.js'
import { initialise as fieldsFoot } from './grant-fields/foot.js'
import { initialise as markCards } from './grant-fields/mark-card.js'
import { initialise as otherKinds } from './grant-fields/other-kinds.js'
import { initialise as frameArea } from './pick-an-area/frame.js'
import { initialise as lockForm } from './surfaces/record-form/lock.js'
import { initialise as modules } from './grant-modules/modules.js'
import { initialise as tableGates } from './grant-tables/gate.js'
import { initialise as tablesPreview } from './grant-tables/preview.js'
import { initialise as chooseValues } from './allow-values/choose.js'
import { initialise as fieldsPreview } from './grant-fields/preview.js'
import { initialise as mounts } from './mount-branches/mount-branches.js'
import { initialise as tabBar } from './pick-an-area/tab-bar.js'
import { initialise as keepAreasOpen } from './pick-an-area/areas.js'
import { initialise as keepTreeOpenIn13 } from './pick-an-area/compatibility/folded-tree.js'
import { initialise as landing } from './pick-an-area/landing.js'
import { initialise as docheaderNames } from './surfaces/record-form/compatibility/docheader.js'
import { initialise as formDocheaderNames } from './surfaces/record-form/compatibility/form-docheader.js'
import { initialise as tabNames } from './surfaces/record-form/compatibility/tabs.js'
import { initialise as unfoldRecordsIn13 } from './surfaces/record-form/compatibility/unfold-13.js'
import { initialise as otherPermissions } from './edit-other-permissions/panel.js'
import { initialise as header } from './surfaces/record-form/header.js'
import { initialise as formEngine } from './surfaces/record-form/surface.js'
import { initialise as newContent } from './surfaces/page-module/new-content.js'
import { initialise as redrawRecords } from './surfaces/record-list/redraw.js'
import { initialise as closeForm } from './surfaces/record-form/close.js'
import { initialise as showMenu } from './surfaces/record-form/show-menu.js'
import { initialise as shortcut } from './switch-the-mode/shortcut.js'
import { initialise as toggleVisualMode } from './switch-the-mode/toggle.js'
import { initialise as unfoldRecords } from './surfaces/record-form/unfold.js'
import { initialise as leaveUser } from './view-as-user/leave.js'
import { reopenDocument } from './view-as-user/reopen-document.js'
import { keepWrappers, slideIn } from './view-as-user/slide.js'
import { initialise as viewAsUser } from './view-as-user/switch.js'

function start(): void {
  // A document the backend shows in its frame can have been written in a session that has
  // since changed hands; only the page around the frames is ours to run in.
  if (window.top !== window) {
    return
  }

  const backend = new AbortController()

  // Must run first: the CSS of every other part needs the attributes it sets on the body
  markBody(backend.signal)

  headerControls(document, backend.signal)
  toggleVisualMode(document, backend.signal)
  selectGroup(document, backend.signal)
  // 13.4's tabs and form header take their 14.3 names before any scope reads the form
  tabNames(backend.signal)
  formDocheaderNames(backend.signal)
  const judgement = createJudgement()
  fields(judgement, backend.signal)
  const draft = createDraft()
  pickFields(draft, backend.signal)
  fieldsFoot(draft, backend.signal)
  markCards(judgement, backend.signal)
  otherKinds(backend.signal)
  modules(document, backend.signal)
  mounts(document, backend.signal)
  tableGates(backend.signal)
  tablesPreview(backend.signal)
  chooseValues(backend.signal)
  fieldsPreview(backend.signal)
  keepAreasOpen(document, backend.signal)
  newContent(document, backend.signal)
  redrawRecords(document, backend.signal)
  keepTreeOpenIn13(document, backend.signal)
  landing(document, backend.signal)
  frameArea(document, backend.signal)
  tabBar(document, backend.signal)
  otherPermissions(document, backend.signal)
  docheaderNames(document, backend.signal)
  lockForm(document, backend.signal)
  closeForm(document, backend.signal)
  header(document, backend.signal)
  showMenu(backend.signal)
  unfoldRecords(backend.signal)
  unfoldRecordsIn13(backend.signal)
  formEngine(document, backend.signal)
  const leaving = viewAsUser(document, backend.signal)
  leaveUser(document, backend.signal)

  // Admin screen must outlive this page; a screen nobody asked for is not shown.
  if (leaving) {
    keepWrappers(document)
  } else {
    reopenDocument(document)
    slideIn(document)
  }
  shortcut(document)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start, { once: true })
} else {
  start()
}
