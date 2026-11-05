import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { attributes } from '#src/platform/contract.js'
import { onFormReady } from '#src/surfaces/record-form/form.js'
import { initialise } from '#src/surfaces/record-form/surface.js'

const anchor = (doc: Document, token: string): HTMLElement => {
  const element = doc.createElement('div')
  element.setAttribute(attributes.token, token)

  return element
}

const formDocument = (): Document => {
  const frame = document.createElement('iframe')
  frame.id = 'typo3-contentIframe'
  document.body.append(frame)

  const inner = frame.contentDocument
  if (inner === null) {
    throw new Error('the frame has no document')
  }

  return inner
}

describe('the form engine surface', () => {
  let listening: AbortController
  let reported: number[]

  beforeEach(() => {
    listening = new AbortController()
    reported = []
    document.body.replaceChildren()
    onFormReady(({ fields }) => reported.push(fields.length), listening.signal)
  })

  afterEach(() => {
    listening.abort()
  })

  it('hands over the fields of a module the backend has loaded', () => {
    const inner = formDocument()
    inner.body.append(anchor(inner, 'pages:title'))

    initialise(document, listening.signal)

    expect(reported).toStrictEqual([1])
  })

  it('hands over a module without fields, and no field with it', () => {
    formDocument()

    initialise(document, listening.signal)

    expect(reported).toStrictEqual([0])
  })

  it('hands them over again when the backend loads another module', () => {
    const inner = formDocument()
    inner.body.append(anchor(inner, 'pages:title'))
    initialise(document, listening.signal)

    inner.body.append(anchor(inner, 'pages:layout'))
    document.dispatchEvent(new Event('typo3-module-loaded'))

    expect(reported).toStrictEqual([1, 2])
  })

  it('hands over an inline child that arrives later', async () => {
    const inner = formDocument()
    inner.body.append(anchor(inner, 'tt_content:image'))
    initialise(document, listening.signal)

    inner.body.append(anchor(inner, 'sys_file_reference:title'))

    await vi.waitFor(() => {
      expect(reported).toStrictEqual([1, 2])
    })
  })

  // Swapping one field for another does not change the count
  it('hands over a field that took the place of another', async () => {
    const inner = formDocument()
    const replaced = anchor(inner, 'pages:title')
    inner.body.append(replaced)
    initialise(document, listening.signal)

    replaced.replaceWith(anchor(inner, 'pages:slug'))

    await vi.waitFor(() => {
      expect(reported).toStrictEqual([1, 1])
    })
  })

  it('hands over the first field of a form that arrived with none', async () => {
    const inner = formDocument()
    initialise(document, listening.signal)

    inner.body.append(anchor(inner, 'tt_content:header'))

    await vi.waitFor(() => {
      expect(reported).toStrictEqual([0, 1])
    })
  })

  it('says nothing without a module on screen', () => {
    initialise(document, listening.signal)

    expect(reported).toStrictEqual([])
  })
})
