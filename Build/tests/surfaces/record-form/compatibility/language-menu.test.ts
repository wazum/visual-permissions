import { beforeEach, describe, expect, it } from 'vitest'
import {
  backToOlderLanguageMenu, besideOlderLanguageMenu, withOlderLanguageMenu,
} from '#src/surfaces/record-form/compatibility/language-menu.js'

const languages = '.form-group:has(> select[name="_langSelector"])'

const show = (): Element => {
  const menu = document.querySelector('.show')
  if (menu === null) {
    throw new Error('no menu in the document')
  }

  return menu
}

describe('the language menu 13.4 draws above the buttons', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="module-docheader">
        <div class="module-docheader-bar-navigation"><div class="home">
          <div class="form-group"><select name="_langSelector"></select></div>
        </div></div>
        <div class="btn-toolbar"><div class="show"></div><a class="last"></a></div>
      </div>`
  })

  it('stands beside the ways to read the form while the form is ours', () => {
    besideOlderLanguageMenu(document, show())

    expect(show().nextElementSibling?.matches(languages)).toBe(true)
  })

  it('goes back where core put it once the form is core\'s again', () => {
    besideOlderLanguageMenu(document, show())
    besideOlderLanguageMenu(document, show())

    backToOlderLanguageMenu(document)

    expect(document.querySelector(`.home > ${languages}`)).not.toBeNull()
  })

  it('stands where it is when it was never moved', () => {
    backToOlderLanguageMenu(document)

    expect(document.querySelector(`.home > ${languages}`)).not.toBeNull()
  })

  it('counts the language menu among the controls the form keeps', () => {
    expect(document.querySelector(languages)?.matches(withOlderLanguageMenu('.show'))).toBe(true)
  })
})
