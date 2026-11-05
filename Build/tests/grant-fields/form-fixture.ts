import { attributes } from '#src/platform/contract.js'
import { formReady } from '#src/surfaces/record-form/form.js'

export const row = (token: string, verdict: string, inside = ''): string => `
  <div class="form-group">
    <fieldset class="vperm-anchor" ${attributes.token}="${token}" ${attributes.verdict}="${verdict}" ${attributes.inside}="${inside}">
      <label class="form-label">${token}</label>
      <input type="text" inert>
    </fieldset>
  </div>`

// Core draws a record of another table inside the field that holds it, anchors within an anchor
export const around = (markup: string, token: string, verdict: string): string => `
  <div class="form-group">
    <fieldset class="vperm-anchor" ${attributes.token}="${token}" ${attributes.verdict}="${verdict}">
      <label class="form-label">${token}</label>
      <div class="form-irre-object">${markup}</div>
    </fieldset>
  </div>`

export const drawForm = (...rows: string[]): void => {
  document.body.innerHTML = `
    <form name="editform">
      <div class="tab-content">
        <div class="tab-pane" id="general">
          <fieldset class="form-section">${rows.join('')}</fieldset>
        </div>
      </div>
    </form>`

  formReady({ doc: document, fields: [...document.querySelectorAll(`[${attributes.token}]`)] })
}
