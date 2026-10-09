import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { formReady } from '#src/surfaces/record-form/form.js'
import { on } from '#src/platform/bus.js'
import { attributes, classes } from '#src/platform/contract.js'
import { activate, deactivate, pickArea, selectGroup, turnTo } from '#src/platform/session.js'
import { initialise } from '#src/allow-values/choose.js'
import { dialog, press } from '../__mocks__/typo3-modal.js'
import { forget, holdNextWrite, refuseNextRead, refuseNextWrite, reply, sent } from '../__mocks__/typo3-ajax-request.js'
import { forgetNotices, notices } from '../__mocks__/typo3-notification.js'

const contentTypes = {
  title: 'The page content types the group "%s" may use',
  groups: [
    {
      label: 'Typical page content',
      values: [
        { value: 'text', label: 'Regular Text Element', icon: 'content-text' },
        { value: 'textmedia', label: 'Text & Media', icon: 'mimetypes-x-content-text-media' },
      ],
    },
  ],
}

const beside = `[${attributes.token}='tt_content:CType'] + button`

const pageTypes = {
  title: 'The page types the group "%s" may create',
  groups: [{ label: 'Page types', values: [{ value: '254', label: 'Folder', icon: 'apps-pagetree-folder-default' }] }],
}

const field = (token: string, allows: string, choices: object = contentTypes): string => `
  <div class="form-group">
    <fieldset class="vperm-anchor" ${attributes.token}="${token}" ${attributes.allows}="${allows}"
      ${attributes.choices}="${JSON.stringify(choices).replaceAll('"', '&quot;')}">
      <label class="form-label">${token}</label>
      <div class="formengine-field-item"><select></select></div>
    </fieldset>
  </div>`

const drawForm = (...fields: string[]): void => {
  document.body.innerHTML = `
    <div ${attributes.groups}='{"7":{"title":"Aliquam","disabled":false,"inherits":[]}}'></div>
    <form name="editform"><div class="form-section">${fields.join('')}</div></form>`

  TYPO3.lang = {
    'allowedValues.choose.CType': 'Choose page content types',
    'platform.cancel': 'Cancel',
    'platform.doAdd': 'Add',
    'platform.doApply': 'Apply',
    'platform.from': 'from a subgroup',
    'platform.going': '%s waiting to be taken away',
    'platform.waiting': '%s waiting to be added',  }

  formReady({ doc: document, fields: [...document.querySelectorAll(`[${attributes.token}]`)] })
}

const boxNamed = (name: string): HTMLInputElement => {
  const box = [...dialog()?.querySelectorAll('label') ?? []]
    .find(label => label.textContent.trim() === name)
    ?.querySelector('input')
  if (box === null || box === undefined) {
    throw new Error(`no box named ${name}`)
  }

  return box
}

const applyButton = (): HTMLButtonElement | null => dialog()?.querySelector('button[name="apply"]') ?? null

const waiting = (): string | undefined => dialog()?.querySelector(`.${classes.faceWaiting}`)?.textContent

const ticked = (): string[] => [...dialog()?.querySelectorAll('label:has(input:checked)') ?? []]
  .map(box => box.textContent.trim())

describe('choosing the values a group may use', () => {
  let listening: AbortController

  const openChoice = async (): Promise<void> => {
    initialise(listening.signal)
    drawForm(field('tt_content:CType', 'fieldValues'))
    activate()
    pickArea('fields')
    turnTo('pick')
    document.querySelector<HTMLElement>(`.${classes.allowChoose}`)?.click()
    await vi.waitFor(() => {
      expect(dialog()?.querySelector('input')).toBeTruthy()
    })
  }

  beforeEach(() => {
    forget()
    reply({ scopes: { fieldValues: { targets: {} } } })
    forgetNotices()
    deactivate()
    selectGroup(7)
    listening = new AbortController()
  })

  afterEach(() => {
    listening.abort()
    deactivate()
    dialog()?.remove()
  })

  it('offers to choose the page content types at the type of a content element', () => {
    initialise(listening.signal)
    drawForm(field('tt_content:CType', 'fieldValues'))

    activate()
    pickArea('fields')
    turnTo('pick')

    expect(document.querySelector(beside)?.textContent).toBe('Choose page content types')
  })

  it('names the dialog after what the group may use', async () => {
    await openChoice()

    expect(dialog()?.querySelector('.modal-title')?.textContent).toBe('The page content types the group "Aliquam" may use')
  })

  it('lists every value of the field as a box to tick', async () => {
    await openChoice()

    expect([...dialog()?.querySelectorAll('label:has(input[type="checkbox"])') ?? []].map(box => box.textContent.trim()))
      .toStrictEqual(['Regular Text Element', 'Text & Media'])
  })

  it('ticks a value the group may use', async () => {
    reply({ scopes: { fieldValues: { targets: { 'tt_content:CType:textmedia': 'allowed' } } } })

    await openChoice()

    expect(ticked()).toStrictEqual(['Text & Media'])
  })

  it('keeps a value the group gets from a subgroup ticked, and out of reach', async () => {
    reply({ scopes: { fieldValues: { targets: { 'tt_content:CType:textmedia': 'inherited' } } } })

    await openChoice()

    expect([boxNamed('Text & Media').checked, boxNamed('Text & Media').disabled]).toStrictEqual([true, true])
  })

  it('says on a box that a subgroup gives its value', async () => {
    reply({ scopes: { fieldValues: { targets: { 'tt_content:CType:textmedia': 'inherited' } } } })

    await openChoice()

    expect(dialog()?.querySelector(`.${classes.allowChoices}`)?.getAttribute('style'))
      .toContain('--vperm-inherited-note: "from a subgroup"')
  })

  it('opens no dialog when the permissions cannot be read', async () => {
    refuseNextRead()
    initialise(listening.signal)
    drawForm(field('tt_content:CType', 'fieldValues'))
    activate()
    pickArea('fields')
    turnTo('pick')

    document.querySelector<HTMLElement>(`.${classes.allowChoose}`)?.click()

    await vi.waitFor(() => {
      expect(notices).toHaveLength(1)
    })
    expect(dialog()).toBeNull()
  })

  it('says a value that was ticked is waiting to be added', async () => {
    await openChoice()

    boxNamed('Text & Media').click()

    expect(waiting()).toBe('1 waiting to be added')
    expect(applyButton()?.textContent).toBe('Apply')
  })

  it('sends the values that were ticked to be added', async () => {
    await openChoice()
    boxNamed('Text & Media').click()

    await press('apply')

    await vi.waitFor(() => {
      expect(sent).toContainEqual({
        url: '/typo3/ajax/visual_permissions_allow_values',
        body: { group: 7, operations: [{ value: 'tt_content:CType:textmedia', grant: true }] },
      })
    })
  })

  it('sends the values once while the first press is still unanswered', async () => {
    await openChoice()
    boxNamed('Text & Media').click()
    const letGo = holdNextWrite()

    await press('apply')
    await press('apply')
    letGo()
    await new Promise(settled => { setTimeout(settled, 0) })

    expect(sent.filter(({ url }) => url.endsWith('allow_values'))).toHaveLength(1)
  })

  it('ticks a page type the group may create', async () => {
    reply({ scopes: { pageTypes: { targets: { 254: 'inherited' } } } })
    initialise(listening.signal)
    drawForm(field('pages:doktype', 'pageTypes', pageTypes))
    activate()
    pickArea('fields')
    turnTo('pick')

    document.querySelector<HTMLElement>(`.${classes.allowChoose}`)?.click()

    await vi.waitFor(() => {
      expect(ticked()).toStrictEqual(['Folder'])
    })
  })

  it('sends the page types that were ticked to the list of page types', async () => {
    reply({ scopes: { pageTypes: { targets: {} } } })
    initialise(listening.signal)
    drawForm(field('pages:doktype', 'pageTypes', pageTypes))
    activate()
    pickArea('fields')
    turnTo('pick')
    document.querySelector<HTMLElement>(`.${classes.allowChoose}`)?.click()
    await vi.waitFor(() => {
      expect(dialog()?.querySelector('input')).toBeTruthy()
    })
    boxNamed('Folder').click()

    await press('apply')

    await vi.waitFor(() => {
      expect(sent).toContainEqual({
        url: '/typo3/ajax/visual_permissions_allow_page_types',
        body: { group: 7, operations: [{ value: '254', grant: true }] },
      })
    })
  })

  it('closes the dialog once the values are written', async () => {
    await openChoice()
    boxNamed('Text & Media').click()

    await press('apply')

    await vi.waitFor(() => {
      expect(dialog()).toBeNull()
    })
  })

  it('closes without writing anything when cancelled', async () => {
    await openChoice()
    boxNamed('Text & Media').click()

    await press('cancel')

    expect(dialog()).toBeNull()
    expect(sent).toHaveLength(0)
  })

  it('names the write before anything is marked', async () => {
    await openChoice()

    expect([...dialog()?.querySelectorAll('.modal-footer button') ?? []].map(button => button.textContent))
      .toStrictEqual(['Cancel', 'Apply'])
  })

  it('keeps the dialog open when the values were not written', async () => {
    const heard: unknown[] = []
    on('permissions-written', told => { heard.push(told) }, listening.signal)
    await openChoice()
    boxNamed('Text & Media').click()
    refuseNextWrite()

    await press('apply')

    await vi.waitFor(() => {
      expect(sent).toHaveLength(1)
    })
    await new Promise(resolve => { setTimeout(resolve, 0) })
    expect(dialog()).not.toBeNull()
    expect(heard).toHaveLength(0)
  })

  it('says a value that was unticked is waiting to be taken away', async () => {
    reply({ scopes: { fieldValues: { targets: { 'tt_content:CType:text': 'allowed' } } } })
    await openChoice()

    boxNamed('Regular Text Element').click()

    expect(waiting()).toBe('1 waiting to be taken away')
    expect(applyButton()?.textContent).toBe('Apply')
  })

  it('says both when values are added and taken away', async () => {
    reply({ scopes: { fieldValues: { targets: { 'tt_content:CType:text': 'allowed' } } } })
    await openChoice()

    boxNamed('Regular Text Element').click()
    boxNamed('Text & Media').click()

    expect(waiting()).toBe('1 waiting to be added\n1 waiting to be taken away')
    expect(applyButton()?.textContent).toBe('Apply')
  })

  it('says what is waiting in front of the buttons', async () => {
    await openChoice()

    boxNamed('Text & Media').click()

    await vi.waitFor(() => {
      expect(dialog()?.querySelector('.modal-footer > :first-child')?.textContent).toBe('1 waiting to be added')
    })
  })

  it('says nothing is waiting when the dialog opens', async () => {
    await openChoice()

    expect(waiting()).toBe('')
  })

  it('says nothing is waiting once every box says what the group has again', async () => {
    await openChoice()
    boxNamed('Text & Media').click()

    boxNamed('Text & Media').click()

    expect(waiting()).toBe('')
  })

  it('offers nothing to write while every box says what the group has', async () => {
    await openChoice()

    await vi.waitFor(() => {
      expect(applyButton()?.disabled).toBe(true)
    })
  })

  it('offers the write once a box no longer says what the group has', async () => {
    await openChoice()
    await vi.waitFor(() => {
      expect(applyButton()?.disabled).toBe(true)
    })

    boxNamed('Text & Media').click()

    await vi.waitFor(() => {
      expect(applyButton()?.disabled).toBe(false)
    })
  })

  it('tells everyone the permissions were written', async () => {
    const heard: unknown[] = []
    on('permissions-written', told => { heard.push(told) }, listening.signal)
    await openChoice()
    boxNamed('Text & Media').click()

    await press('apply')

    await vi.waitFor(() => {
      expect(heard).toHaveLength(1)
    })
  })

  it('offers the choice on a form drawn after the side was turned', () => {
    initialise(listening.signal)
    activate()
    pickArea('fields')
    turnTo('pick')

    drawForm(field('tt_content:CType', 'fieldValues'))

    expect(document.querySelectorAll(beside)).toHaveLength(1)
  })

  it('offers no choice on the side that shows what the group has', () => {
    initialise(listening.signal)
    drawForm(field('tt_content:CType', 'fieldValues'))

    activate()
    pickArea('fields')
    turnTo('pick')
    turnTo('preview')

    expect(document.querySelectorAll(beside)).toHaveLength(0)
  })

  it('takes the choice away when the permissions are hidden', () => {
    initialise(listening.signal)
    drawForm(field('tt_content:CType', 'fieldValues'))

    activate()
    pickArea('fields')
    turnTo('pick')
    deactivate()

    expect(document.querySelectorAll(beside)).toHaveLength(0)
  })

  it('offers one button at a field however often the form is drawn again', () => {
    initialise(listening.signal)
    drawForm(field('tt_content:CType', 'fieldValues'))

    activate()
    pickArea('fields')
    turnTo('pick')
    turnTo('pick')

    expect(document.querySelectorAll(`.${classes.allowChoose}`)).toHaveLength(1)
  })
})
