import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { LitElement, html } from 'lit'

const installed = (name: string): unknown => JSON.parse(
  readFileSync(resolve(process.cwd(), 'node_modules', name, 'package.json'), 'utf8'),
)

describe('lit', () => {
  it.each([
    ['lit-html', '3.2.0'],
    ['lit-element', '4.1.0'],
    ['@lit/reactive-element', '2.0.4'],
  ])('runs the %s the backend ships, so a test runs what a browser runs', (name, version) => {
    expect(installed(name)).toMatchObject({ version })
  })

  it('renders into the light dom, the way core does', () => {
    class Probe extends LitElement {
      override createRenderRoot(): HTMLElement { return this }
      override render(): unknown { return html`<p>here</p>` }
    }
    customElements.define('vperm-lit-probe', Probe)

    const probe = document.createElement('vperm-lit-probe')
    document.body.append(probe)

    expect(probe.shadowRoot).toBeNull()
  })
})
