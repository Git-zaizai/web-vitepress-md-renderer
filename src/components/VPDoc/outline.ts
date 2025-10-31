// import { onMounted, onUnmounted, onUpdated, type Ref } from 'vue'

export interface Outline {
  level?: number | [number, number] | 'deep'
  label?: string
}

export type ORange = Outline | Outline['level'] | false

export interface Header {
  /**
   * The level of the header
   *
   * `1` to `6` for `<h1>` to `<h6>`
   */
  level: number
  /**
   * The title of the header
   */
  title: string
  /**
   * The slug of the header
   *
   * Typically the `id` attr of the header anchor
   */
  slug: string
  /**
   * Link of the header
   *
   * Typically using `#${slug}` as the anchor hash
   */
  link: string
  /**
   * The children of the header
   */
  children: Header[]
}

// cached list of anchor elements from resolveHeaders
const resolvedHeaders: { element: HTMLHeadElement; link: string }[] = []

export type MenuItem = Omit<Header, 'slug' | 'children'> & {
  element: HTMLHeadElement
  children?: MenuItem[]
}

/***
 * {
  headerTree: MenuItem[]
  resolvedHeaders: { element: HTMLHeadElement; link: string }[]
} 
 */
export function getHeaders(range?: ORange): MenuItem[] {
  const headers = [
    ...document.querySelectorAll(
      '.VPDoc h1, .VPDoc h2, .VPDoc h3, .VPDoc h4, .VPDoc h5, .VPDoc h6'
    )
  ]
    .filter((el) => el.id && el.hasChildNodes())
    .map((el) => {
      const level = Number(el.tagName[1])
      return {
        element: el as HTMLHeadElement,
        title: serializeHeader(el),
        link: '#' + el.id,
        level
      }
    })

  return resolveHeaders(headers, range)
  // let headerTree = buildTree(headers, 1, 6)
  // return { headerTree, resolvedHeaders: resolvedHeaders }
}

function serializeHeader(h: Element): string {
  let ret = ''
  for (const node of h.childNodes) {
    if (node.nodeType === 1) {
      if (
        (node as Element).classList.contains('VPBadge') ||
        (node as Element).classList.contains('header-anchor') ||
        (node as Element).classList.contains('ignore-header')
      ) {
        continue
      }
      ret += node.textContent
    } else if (node.nodeType === 3) {
      ret += node.textContent
    }
  }
  return ret.trim()
}

export function resolveHeaders(
  headers: MenuItem[],
  range?: ORange
): MenuItem[] {
  if (range === false) {
    return []
  }

  const levelsRange =
    (typeof range === 'object' && !Array.isArray(range)
      ? range.level
      : range) || 2

  const [high, low]: [number, number] =
    typeof levelsRange === 'number'
      ? [levelsRange, levelsRange]
      : levelsRange === 'deep'
      ? [2, 6]
      : levelsRange

  return buildTree(headers, high, low)
}

export function getScrollOffset() {
  // let scrollOffset = siteDataRef.value.scrollOffset

  let scrollOffset: any = document.querySelector('#app')
  let offset = 0
  let padding = 24
  if (typeof scrollOffset === 'object' && 'padding' in scrollOffset) {
    padding = scrollOffset.padding as number
    scrollOffset = scrollOffset.selector
  }
  if (typeof scrollOffset === 'number') {
    offset = scrollOffset
  } else if (typeof scrollOffset === 'string') {
    offset = tryOffsetSelector(scrollOffset, padding)
  } else if (Array.isArray(scrollOffset)) {
    for (const selector of scrollOffset) {
      const res = tryOffsetSelector(selector, padding)
      if (res) {
        offset = res
        break
      }
    }
  }

  return offset
}

function tryOffsetSelector(selector: string, padding: number): number {
  const el = document.querySelector(selector)
  if (!el) return 0
  const bot = el.getBoundingClientRect().bottom
  if (bot < 0) return 0
  return bot + padding
}

export function getAbsoluteTop(element: HTMLElement): number {
  let offsetTop = 0
  while (element !== document.body) {
    if (element === null) {
      // child element is:
      // - not attached to the DOM (display: none)
      // - set to fixed position (not scrollable)
      // - body or html element (null offsetParent)
      return NaN
    }
    offsetTop += element.offsetTop
    element = element.offsetParent as HTMLElement
  }
  return offsetTop
}

function buildTree(data: MenuItem[], min: number, max: number): MenuItem[] {
  resolvedHeaders.length = 0

  const result: MenuItem[] = []
  const stack: (MenuItem | { level: number; shouldIgnore: true })[] = []

  data.forEach((item) => {
    const node: any = { ...item, children: [] }
    let parent: any = stack[stack.length - 1]

    while (parent && parent.level >= node.level) {
      stack.pop()
      parent = stack[stack.length - 1]
    }

    if (
      node.element.classList.contains('ignore-header') ||
      (parent && 'shouldIgnore' in parent)
    ) {
      stack.push({ level: node.level, shouldIgnore: true })
      return
    }

    if (node.level > max || node.level < min) return
    resolvedHeaders.push({ element: node.element, link: node.link })

    if (parent) {
      parent.children.push(node)
    } else {
      result.push(node)
    }

    stack.push(node)
  })

  return result
}

const timeoutIdMap: WeakMap<HTMLElement, any> = new WeakMap()

export function useCodeGroups(e: any) {
  const el = e.target as HTMLInputElement

  if (el.matches('.vp-code-group input')) {
    // input <- .tabs <- .vp-code-group
    const group = el.parentElement?.parentElement
    if (!group) return

    const i = Array.from(group.querySelectorAll('input')).indexOf(el)
    if (i < 0) return

    const blocks = group.querySelector('.blocks')
    if (!blocks) return

    const current = Array.from(blocks.children).find((child) =>
      child.classList.contains('active')
    )
    if (!current) return

    const next = blocks.children[i]
    if (!next || current === next) return

    current.classList.remove('active')
    next.classList.add('active')

    const label = group?.querySelector(`label[for="${el.id}"]`)
    label?.scrollIntoView({ block: 'nearest' })
  }
}

export function useCopyCode(e: any) {
  const el = e.target as HTMLElement
  if (el.matches('div[class*="language-"] > button.copy')) {
    const parent = el.parentElement
    const sibling = el.nextElementSibling?.nextElementSibling
    if (!parent || !sibling) {
      return
    }

    const isShell = /language-(shellscript|shell|bash|sh|zsh)/.test(
      parent.className
    )

    const ignoredNodes = ['.vp-copy-ignore', '.diff.remove']

    // Clone the node and remove the ignored nodes
    const clone = sibling.cloneNode(true) as HTMLElement
    clone
      .querySelectorAll(ignoredNodes.join(','))
      .forEach((node) => node.remove())

    let text = clone.textContent || ''

    if (isShell) {
      text = text.replace(/^ *(\$|>) /gm, '').trim()
    }

    copyToClipboard(text).then(() => {
      el.classList.add('copied')
      clearTimeout(timeoutIdMap.get(el))
      const timeoutId = setTimeout(() => {
        el.classList.remove('copied')
        el.blur()
        timeoutIdMap.delete(el)
      }, 2000)
      timeoutIdMap.set(el, timeoutId)
    })
  }
}

async function copyToClipboard(text: string) {
  try {
    return navigator.clipboard.writeText(text)
  } catch {
    const element = document.createElement('textarea')
    const previouslyFocusedElement = document.activeElement

    element.value = text

    // Prevent keyboard from showing on mobile
    element.setAttribute('readonly', '')

    element.style.contain = 'strict'
    element.style.position = 'absolute'
    element.style.left = '-9999px'
    element.style.fontSize = '12pt' // Prevent zooming on iOS

    const selection = document.getSelection()
    const originalRange = selection
      ? selection.rangeCount > 0 && selection.getRangeAt(0)
      : null

    document.body.appendChild(element)
    element.select()

    // Explicit selection workaround for iOS
    element.selectionStart = 0
    element.selectionEnd = text.length

    document.execCommand('copy')
    document.body.removeChild(element)

    if (originalRange) {
      selection!.removeAllRanges() // originalRange can't be truthy when selection is falsy
      selection!.addRange(originalRange)
    }

    // Get the focus back on the previously focused element, if any
    if (previouslyFocusedElement) {
      ;(previouslyFocusedElement as HTMLElement).focus()
    }
  }
}

export function throttleAndDebounce(fn: () => void, delay: number): () => void {
  let timeoutId: any
  let called = false

  return () => {
    if (timeoutId) clearTimeout(timeoutId)

    if (!called) {
      fn()
      ;(called = true) && setTimeout(() => (called = false), delay)
    } else timeoutId = setTimeout(fn, delay)
  }
}

import { onMounted, onUnmounted, onUpdated, type Ref } from 'vue'

export function useActiveAnchor(
  container: Ref<HTMLElement>,
  marker: Ref<HTMLElement>,
  vpProps: any
): void {
  const { isAsideEnabled } = vpProps

  const scrollableElement = findScrollableElement(container.value)
  const onScroll = throttleAndDebounce(setActiveLink, 100)

  let prevActiveLink: HTMLAnchorElement | null = null

  onMounted(() => {
    requestAnimationFrame(setActiveLink)
    scrollableElement.addEventListener('scroll', onScroll)
  })

  onUpdated(() => {
    // sidebar update means a route change
    activateLink(location.hash)
  })

  onUnmounted(() => {
    scrollableElement.removeEventListener('scroll', onScroll)
  })

  function setActiveLink() {
    // if (!isAsideEnabled.value) {
    //   return
    // }

    const scrollY =
      scrollableElement instanceof Window
        ? scrollableElement.scrollY
        : scrollableElement.scrollTop

    const innerHeight =
      scrollableElement instanceof Window
        ? scrollableElement.innerHeight
        : scrollableElement.clientHeight

    const offsetHeight = document.body.offsetHeight
    const isBottom = Math.abs(scrollY + innerHeight - offsetHeight) < 1

    // resolvedHeaders may be repositioned, hidden or fix positioned
    const headers = resolvedHeaders
      .map(({ element, link }) => ({
        link,
        top: getAbsoluteTop(element)
      }))
      .filter(({ top }) => !Number.isNaN(top))
      .sort((a, b) => a.top - b.top)

    // no headers available for active link
    if (!headers.length) {
      activateLink(null)
      return
    }

    // page top
    if (scrollY < 1) {
      activateLink(null)
      return
    }

    // page bottom - highlight last link
    if (isBottom) {
      activateLink(headers[headers.length - 1].link)
      return
    }

    // find the last header above the top of viewport
    let activeLink: string | null = null
    for (const { link, top } of headers) {
      if (top > scrollY + getScrollOffset() + 4) {
        break
      }
      activeLink = link
    }
    activateLink(activeLink)
  }

  function activateLink(hash: string | null) {
    if (prevActiveLink) {
      prevActiveLink.classList.remove('active')
    }

    if (hash == null) {
      prevActiveLink = null
    } else {
      prevActiveLink = container.value.querySelector(
        `a[href="${decodeURIComponent(hash)}"]`
      )
    }

    const activeLink = prevActiveLink

    if (activeLink) {
      activeLink.classList.add('active')
      marker.value.style.top = activeLink.offsetTop + 39 + 'px'
      marker.value.style.opacity = '1'
    } else {
      marker.value.style.top = '33px'
      marker.value.style.opacity = '0'
    }
  }
}

/**
 * 从指定类名的元素开始向上查找可滚动元素
 * @param className 要查找的元素类名
 * @returns 找到的可滚动元素或null（如果未找到）
 */
export function findScrollableElement<K extends keyof HTMLElementTagNameMap>(
  selectors: K | HTMLElement
): HTMLElement | Window {
  // 根据类名获取元素
  const element =
    selectors instanceof HTMLElement
      ? selectors
      : document.querySelector(selectors)

  // 如果元素不存在，返回null
  if (!element) {
    return window
  }

  // 从当前元素开始向上遍历DOM树
  let currentElement: HTMLElement | null = element as HTMLElement

  while (currentElement && currentElement !== document.body) {
    // 检查元素是否可滚动
    if (isScrollable(currentElement)) {
      return currentElement
    }

    // 移动到父元素
    currentElement = currentElement.parentElement
  }

  // 检查body元素是否可滚动（作为最后的选择）
  return window
}

/**
 * 检查元素是否可滚动
 * @param element 要检查的DOM元素
 * @returns 元素是否可滚动
 */
function isScrollable(element: HTMLElement): boolean {
  // 获取计算样式
  const computedStyle = window.getComputedStyle(element)

  // 检查overflow相关样式
  const overflow = computedStyle.getPropertyValue('overflow')
  const overflowX = computedStyle.getPropertyValue('overflow-x')
  const overflowY = computedStyle.getPropertyValue('overflow-y')

  const isOverflowScrollable =
    overflow === 'auto' ||
    overflow === 'scroll' ||
    overflow === 'overlay' ||
    overflowX === 'auto' ||
    overflowX === 'scroll' ||
    overflowX === 'overlay' ||
    overflowY === 'auto' ||
    overflowY === 'scroll' ||
    overflowY === 'overlay'

  // 检查是否有滚动内容
  const hasScrollableContent =
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth

  // 只有当元素有滚动样式并且有滚动内容时，才认为它是可滚动的
  return isOverflowScrollable && hasScrollableContent
}
