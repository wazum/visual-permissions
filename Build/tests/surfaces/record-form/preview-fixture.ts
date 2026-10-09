import { attributes } from '#src/platform/contract.js'
import { drawPreview } from '#src/surfaces/record-form/preview.js'

export const groupForm = (
  doc: Document,
  tables: Readonly<Record<string, string>> = {},
  named: Readonly<Record<string, string>> = {},
): void => { drawPreview(doc, { tables, named }) }

// The server names the field that holds each one it draws, and nothing for the record's own
export const row = (token: string, verdict: string, inside = ''): string => `
  <div class="form-group">
    <fieldset class="vperm-anchor" ${attributes.token}="${token}" ${attributes.verdict}="${verdict}"
      ${attributes.inside}="${inside}">
      <label class="form-label">${token}</label>
      <input type="text">
    </fieldset>
  </div>`

export const drawForm = (...rows: string[]): void => {
  document.body.innerHTML = `
    <form name="editform"><div class="typo3-TCEforms">
      <ul class="nav nav-tabs">
        <li class="nav-item">
          <button class="nav-link" data-typo3-tab="#general">General</button>
        </li>
      </ul>
      <div class="tab-content">
        <div class="tab-pane" id="general">
          <fieldset class="form-section">${rows.join('')}</fieldset>
        </div>
      </div>
    </div></form>`
}

export const formWithTwoTabs = (first: string, second: string): void => {
  document.body.innerHTML = `
    <form name="editform"><div class="typo3-TCEforms">
      <ul class="nav nav-tabs">
        <li class="nav-item">
          <button class="nav-link active" data-typo3-tab="#general">General</button>
        </li>
        <li class="nav-item">
          <button class="nav-link" data-typo3-tab="#media">Media</button>
        </li>
      </ul>
      <div class="tab-content">
        <div class="tab-pane active" id="general"><fieldset class="form-section">${first}</fieldset></div>
        <div class="tab-pane" id="media"><fieldset class="form-section">${second}</fieldset></div>
      </div>
    </div></form>`

  // The browser's own tabs answer a press by turning the panes over
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      document.querySelectorAll('.nav-link, .tab-pane')
        .forEach(part => { part.classList.remove('active') })
      link.classList.add('active')
      document.querySelector(link.getAttribute("data-typo3-tab") ?? '')?.classList.add('active')
    })
  })
}

// A field of a child table holds the record that carries it, and core draws that record whole
export const childRecord = (named: string, ...rows: string[]): string => `
  <div class="form-irre-object panel">
    <div class="panel-heading">${named}</div>
    <div class="panel-collapse">
      <div class="tab-content">
        <fieldset class="form-section">${rows.join('')}</fieldset>
      </div>
    </div>
  </div>`

// The server names the field itself, and every record it holds points back at that name
const nameOf = (token: string): string => token.replace(':', '-82-')

export const fieldHolding = (token: string, verdict: string, inside: string): string => `
  <div class="form-group">
    <fieldset class="vperm-anchor" ${attributes.token}="${token}" ${attributes.verdict}="${verdict}"
      ${attributes.field}="${nameOf(token)}" ${attributes.inside}="">
      <label class="form-label">${token}</label>
      ${inside.replaceAll(`${attributes.inside}=""`, `${attributes.inside}="${nameOf(token)}"`)}
    </fieldset>
  </div>`

export const onScreen = (): string[] =>
  [...document.querySelectorAll(`[${attributes.token}]`)]
    .filter(field => field.closest('[hidden]') === null)
    .map(field => field.getAttribute(attributes.token) ?? '')

export const recordsOnScreen = (): string[] =>
  [...document.querySelectorAll('.form-irre-object')]
    .filter(record => record.closest('[hidden]') === null)
    .map(record => record.querySelector('.panel-heading')?.textContent ?? '')

export const backendSays = (): void => {
  TYPO3.lang = {
    'grantFields.recordNoFields': 'The group may edit "%s", but no field of this record yet',
    'recordForm.add': 'Assign permissions',
    'grantTables.missing': 'The group may not edit records of this kind',
    'grantTables.adminOnly': 'Only administrators may edit records of this kind',
    'grantTables.give': 'Grant "%s"',
    'grantTables.gone': 'This is empty for the group: it may not edit "%s"',
  }
}
