import { render } from '@solidjs/testing-library'
import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest'
import defineGetter from '@element-solid/test-utils/define-getter'
import makeScroll from '@element-solid/test-utils/make-scroll'
import { sleep } from '@element-solid/utils'
import Affix from '../src'

let clientHeightRestore: () => void

const AXIOM = 'Rem is the best girl'
beforeAll(() => {
  clientHeightRestore = defineGetter(
    window.HTMLElement.prototype,
    'clientHeight',
    1000,
    0
  )
})

afterAll(() => {
  clientHeightRestore()
})

describe('Affix', () => {
  test('render test', async () => {
    const { queryByText, container } = render(() => <Affix>{AXIOM}</Affix>)
    expect(queryByText(AXIOM)).not.toBeNull()
    const mockAffixRect = vi
      .spyOn(container.querySelector('.el-affix')!, 'getBoundingClientRect')
      .mockReturnValue({
        height: 40,
        width: 1000,
        top: -100,
        bottom: -80,
      } as DOMRect)
    const mockDocumentRect = vi
      .spyOn(document.documentElement, 'getBoundingClientRect')
      .mockReturnValue({
        height: 200,
        width: 1000,
        top: 0,
        bottom: 200,
      } as DOMRect)
    await sleep(0)
    expect(container.querySelector('.el-affix--fixed')).toBeNull()
    await makeScroll(document.documentElement, 'scrollTop', 200)
    expect(container.querySelector('.el-affix--fixed')).not.toBeNull()
    mockAffixRect.mockRestore()
    mockDocumentRect.mockRestore()
  })
})
