import { onMounted, onUpdated, onUnmounted, defineComponent, provide, computed, ref, watch, nextTick, createElementBlock, openBlock, Fragment, createCommentVNode, createElementVNode, renderSlot, normalizeClass, resolveComponent, renderList, createBlock, toDisplayString, inject, unref, createVNode } from 'vue';

const resolvedHeaders = [];
function getHeaders(range) {
  const headers = [
    ...document.querySelectorAll(
      ".VPDoc h1, .VPDoc h2, .VPDoc h3, .VPDoc h4, .VPDoc h5, .VPDoc h6"
    )
  ].filter((el) => el.id && el.hasChildNodes()).map((el) => {
    const level = Number(el.tagName[1]);
    return {
      element: el,
      title: serializeHeader(el),
      link: "#" + el.id,
      level
    };
  });
  return resolveHeaders(headers, range);
}
function serializeHeader(h) {
  let ret = "";
  for (const node of h.childNodes) {
    if (node.nodeType === 1) {
      if (node.classList.contains("VPBadge") || node.classList.contains("header-anchor") || node.classList.contains("ignore-header")) {
        continue;
      }
      ret += node.textContent;
    } else if (node.nodeType === 3) {
      ret += node.textContent;
    }
  }
  return ret.trim();
}
function resolveHeaders(headers, range) {
  if (range === false) {
    return [];
  }
  const levelsRange = (typeof range === "object" && !Array.isArray(range) ? range.level : range) || 2;
  const [high, low] = typeof levelsRange === "number" ? [levelsRange, levelsRange] : levelsRange === "deep" ? [2, 6] : levelsRange;
  return buildTree(headers, high, low);
}
function getScrollOffset() {
  let scrollOffset = document.querySelector("#app");
  let offset = 0;
  let padding = 24;
  if (typeof scrollOffset === "object" && "padding" in scrollOffset) {
    padding = scrollOffset.padding;
    scrollOffset = scrollOffset.selector;
  }
  if (typeof scrollOffset === "number") {
    offset = scrollOffset;
  } else if (typeof scrollOffset === "string") {
    offset = tryOffsetSelector(scrollOffset, padding);
  } else if (Array.isArray(scrollOffset)) {
    for (const selector of scrollOffset) {
      const res = tryOffsetSelector(selector, padding);
      if (res) {
        offset = res;
        break;
      }
    }
  }
  return offset;
}
function tryOffsetSelector(selector, padding) {
  const el = document.querySelector(selector);
  if (!el) return 0;
  const bot = el.getBoundingClientRect().bottom;
  if (bot < 0) return 0;
  return bot + padding;
}
function getAbsoluteTop(element) {
  let offsetTop = 0;
  while (element !== document.body) {
    if (element === null) {
      return NaN;
    }
    offsetTop += element.offsetTop;
    element = element.offsetParent;
  }
  return offsetTop;
}
function buildTree(data, min, max) {
  resolvedHeaders.length = 0;
  const result = [];
  const stack = [];
  data.forEach((item) => {
    const node = { ...item, children: [] };
    let parent = stack[stack.length - 1];
    while (parent && parent.level >= node.level) {
      stack.pop();
      parent = stack[stack.length - 1];
    }
    if (node.element.classList.contains("ignore-header") || parent && "shouldIgnore" in parent) {
      stack.push({ level: node.level, shouldIgnore: true });
      return;
    }
    if (node.level > max || node.level < min) return;
    resolvedHeaders.push({ element: node.element, link: node.link });
    if (parent) {
      parent.children.push(node);
    } else {
      result.push(node);
    }
    stack.push(node);
  });
  return result;
}
const timeoutIdMap = /* @__PURE__ */ new WeakMap();
function useCodeGroups(e) {
  const el = e.target;
  if (el.matches(".vp-code-group input")) {
    const group = el.parentElement?.parentElement;
    if (!group) return;
    const i = Array.from(group.querySelectorAll("input")).indexOf(el);
    if (i < 0) return;
    const blocks = group.querySelector(".blocks");
    if (!blocks) return;
    const current = Array.from(blocks.children).find(
      (child) => child.classList.contains("active")
    );
    if (!current) return;
    const next = blocks.children[i];
    if (!next || current === next) return;
    current.classList.remove("active");
    next.classList.add("active");
    const label = group?.querySelector(`label[for="${el.id}"]`);
    label?.scrollIntoView({ block: "nearest" });
  }
}
function useCopyCode(e) {
  const el = e.target;
  if (el.matches('div[class*="language-"] > button.copy')) {
    const parent = el.parentElement;
    const sibling = el.nextElementSibling?.nextElementSibling;
    if (!parent || !sibling) {
      return;
    }
    const isShell = /language-(shellscript|shell|bash|sh|zsh)/.test(
      parent.className
    );
    const ignoredNodes = [".vp-copy-ignore", ".diff.remove"];
    const clone = sibling.cloneNode(true);
    clone.querySelectorAll(ignoredNodes.join(",")).forEach((node) => node.remove());
    let text = clone.textContent || "";
    if (isShell) {
      text = text.replace(/^ *(\$|>) /gm, "").trim();
    }
    copyToClipboard(text).then(() => {
      el.classList.add("copied");
      clearTimeout(timeoutIdMap.get(el));
      const timeoutId = setTimeout(() => {
        el.classList.remove("copied");
        el.blur();
        timeoutIdMap.delete(el);
      }, 2e3);
      timeoutIdMap.set(el, timeoutId);
    });
  }
}
async function copyToClipboard(text) {
  try {
    return navigator.clipboard.writeText(text);
  } catch {
    const element = document.createElement("textarea");
    const previouslyFocusedElement = document.activeElement;
    element.value = text;
    element.setAttribute("readonly", "");
    element.style.contain = "strict";
    element.style.position = "absolute";
    element.style.left = "-9999px";
    element.style.fontSize = "12pt";
    const selection = document.getSelection();
    const originalRange = selection ? selection.rangeCount > 0 && selection.getRangeAt(0) : null;
    document.body.appendChild(element);
    element.select();
    element.selectionStart = 0;
    element.selectionEnd = text.length;
    document.execCommand("copy");
    document.body.removeChild(element);
    if (originalRange) {
      selection.removeAllRanges();
      selection.addRange(originalRange);
    }
    if (previouslyFocusedElement) {
      previouslyFocusedElement.focus();
    }
  }
}
function throttleAndDebounce(fn, delay) {
  let timeoutId;
  let called = false;
  return () => {
    if (timeoutId) clearTimeout(timeoutId);
    if (!called) {
      fn();
      (called = true) && setTimeout(() => called = false, delay);
    } else timeoutId = setTimeout(fn, delay);
  };
}
function useActiveAnchor(container, marker, vpProps) {
  const { isAsideEnabled } = vpProps;
  const scrollableElement = findScrollableElement(container.value);
  const onScroll = throttleAndDebounce(setActiveLink, 100);
  let prevActiveLink = null;
  onMounted(() => {
    requestAnimationFrame(setActiveLink);
    scrollableElement.addEventListener("scroll", onScroll);
  });
  onUpdated(() => {
    activateLink(location.hash);
  });
  onUnmounted(() => {
    scrollableElement.removeEventListener("scroll", onScroll);
  });
  function setActiveLink() {
    const scrollY = scrollableElement instanceof Window ? scrollableElement.scrollY : scrollableElement.scrollTop;
    const innerHeight = scrollableElement instanceof Window ? scrollableElement.innerHeight : scrollableElement.clientHeight;
    const offsetHeight = document.body.offsetHeight;
    const isBottom = Math.abs(scrollY + innerHeight - offsetHeight) < 1;
    const headers = resolvedHeaders.map(({ element, link }) => ({
      link,
      top: getAbsoluteTop(element)
    })).filter(({ top }) => !Number.isNaN(top)).sort((a, b) => a.top - b.top);
    if (!headers.length) {
      activateLink(null);
      return;
    }
    if (scrollY < 1) {
      activateLink(null);
      return;
    }
    if (isBottom) {
      activateLink(headers[headers.length - 1].link);
      return;
    }
    let activeLink = null;
    for (const { link, top } of headers) {
      if (top > scrollY + getScrollOffset() + 4) {
        break;
      }
      activeLink = link;
    }
    activateLink(activeLink);
  }
  function activateLink(hash) {
    if (prevActiveLink) {
      prevActiveLink.classList.remove("active");
    }
    if (hash == null) {
      prevActiveLink = null;
    } else {
      prevActiveLink = container.value.querySelector(
        `a[href="${decodeURIComponent(hash)}"]`
      );
    }
    const activeLink = prevActiveLink;
    if (activeLink) {
      activeLink.classList.add("active");
      marker.value.style.top = activeLink.offsetTop + 39 + "px";
      marker.value.style.opacity = "1";
    } else {
      marker.value.style.top = "33px";
      marker.value.style.opacity = "0";
    }
  }
}
function findScrollableElement(selectors) {
  const element = selectors instanceof HTMLElement ? selectors : document.querySelector(selectors);
  if (!element) {
    return window;
  }
  let currentElement = element;
  while (currentElement && currentElement !== document.body) {
    if (isScrollable(currentElement)) {
      return currentElement;
    }
    currentElement = currentElement.parentElement;
  }
  return window;
}
function isScrollable(element) {
  const computedStyle = window.getComputedStyle(element);
  const overflow = computedStyle.getPropertyValue("overflow");
  const overflowX = computedStyle.getPropertyValue("overflow-x");
  const overflowY = computedStyle.getPropertyValue("overflow-y");
  const isOverflowScrollable = overflow === "auto" || overflow === "scroll" || overflow === "overlay" || overflowX === "auto" || overflowX === "scroll" || overflowX === "overlay" || overflowY === "auto" || overflowY === "scroll" || overflowY === "overlay";
  const hasScrollableContent = element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
  return isOverflowScrollable && hasScrollableContent;
}

const _hoisted_1$3 = { class: "VPDoc" };
const _hoisted_2$1 = { class: "container" };
const _hoisted_3 = {
  key: 0,
  class: "aside"
};
const _hoisted_4 = { class: "aside-content" };
const _hoisted_5 = { class: "content" };
const _hoisted_6 = { class: "content-container" };
const _hoisted_7 = { class: "main" };
const _hoisted_8 = ["innerHTML"];
var _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "VPDoc",
  props: {
    externalLinkIcon: { type: Boolean, required: false },
    hasSidebar: { type: Boolean, required: false },
    hasAside: { type: Boolean, required: false },
    leftAside: { type: Boolean, required: false },
    hasLocalNav: { type: Boolean, required: false },
    title: { type: String, required: false },
    range: { type: [Object, Number, Array, String, Boolean], required: false },
    content: { type: String, required: true },
    asidePaddingTop: { type: Boolean, required: false, default: true }
  },
  setup(__props) {
    const props = __props;
    provide("vpProps", props);
    const pageName = computed(() => {
      return window.location.pathname.replace(/[./]+/g, "_").replace(/_html$/, "");
    });
    onMounted(() => {
      window.addEventListener("click", useCodeGroups);
      window.addEventListener("click", useCopyCode);
    });
    onUnmounted(() => {
      window.removeEventListener("click", useCodeGroups);
      window.removeEventListener("click", useCopyCode);
    });
    const showAside = ref(false);
    watch(
      () => props.content,
      () => {
        nextTick(() => {
          if (props.hasAside) {
            showAside.value = true;
          }
        });
      }
    );
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(
        Fragment,
        null,
        [
          createCommentVNode(` 
    :class="{ 'has-sidebar': hasSidebar, 'has-aside': hasAside }" `),
          createElementVNode("div", _hoisted_1$3, [
            renderSlot(_ctx.$slots, "doc-top", {}, void 0, true),
            createElementVNode("div", _hoisted_2$1, [
              createCommentVNode(` :class="{ 'left-aside': leftAside }" `),
              __props.hasAside ? (openBlock(), createElementBlock("div", _hoisted_3, [
                _cache[0] || (_cache[0] = createElementVNode(
                  "div",
                  { class: "aside-curtain" },
                  null,
                  -1
                  /* CACHED */
                )),
                createElementVNode(
                  "div",
                  {
                    class: normalizeClass(["aside-container", { "aside-container__paddding-top": __props.asidePaddingTop }])
                  },
                  [
                    createElementVNode("div", _hoisted_4, [
                      createCommentVNode(' <VPDocAside v-if="showAside"></VPDocAside> '),
                      showAside.value ? renderSlot(_ctx.$slots, "doc-aside", { key: 0 }, void 0, true) : createCommentVNode("v-if", true)
                    ])
                  ],
                  2
                  /* CLASS */
                )
              ])) : createCommentVNode("v-if", true),
              createElementVNode("div", _hoisted_5, [
                createElementVNode("div", _hoisted_6, [
                  renderSlot(_ctx.$slots, "doc-before", {}, void 0, true),
                  createElementVNode("main", _hoisted_7, [
                    createCommentVNode(` <Content
              class="vp-doc"
              :class="[
                pageName,
                theme.externalLinkIcon && 'external-link-icon-enabled'
              ]"
            /> `),
                    createElementVNode(
                      "div",
                      {
                        class: normalizeClass(["vp-doc", [
                          pageName.value,
                          props.externalLinkIcon && "external-link-icon-enabled"
                        ]])
                      },
                      [
                        createElementVNode("div", { innerHTML: __props.content }, null, 8, _hoisted_8)
                      ],
                      2
                      /* CLASS */
                    )
                  ]),
                  createCommentVNode(' <VPDocFooter>\n            <template #doc-footer-before\n              ><slot name="doc-footer-before"\n            /></template>\n          </VPDocFooter> '),
                  createCommentVNode(' <slot name="doc-after" /> ')
                ])
              ])
            ])
          ])
        ],
        2112
        /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
      );
    };
  }
});

var _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};

var VPDoc = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-26483eba"]]);

const _hoisted_1$2 = ["href", "title"];
var _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "VPDocOutlineItem",
  props: {
    headers: { type: Array, required: true },
    root: { type: Boolean, required: false }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      const _component_VPDocOutlineItem = resolveComponent("VPDocOutlineItem", true);
      return openBlock(), createElementBlock(
        "ul",
        {
          class: normalizeClass(["VPDocOutlineItem", __props.root ? "root" : "nested"])
        },
        [
          (openBlock(true), createElementBlock(
            Fragment,
            null,
            renderList(__props.headers, ({ children, link, title }) => {
              return openBlock(), createElementBlock("li", null, [
                createElementVNode("a", {
                  class: "outline-link",
                  href: link,
                  title
                }, toDisplayString(title), 9, _hoisted_1$2),
                children?.length ? (openBlock(), createBlock(_component_VPDocOutlineItem, {
                  key: 0,
                  headers: children
                }, null, 8, ["headers"])) : createCommentVNode("v-if", true)
              ]);
            }),
            256
            /* UNKEYED_FRAGMENT */
          ))
        ],
        2
        /* CLASS */
      );
    };
  }
});

var VPDocOutlineItem = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-2039eabd"]]);

const _hoisted_1$1 = { class: "content" };
const _hoisted_2 = {
  "aria-level": "2",
  class: "outline-title",
  id: "doc-outline-aria-label",
  role: "heading"
};
var _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "VPDocAsideOutline",
  setup(__props) {
    const vpProps = inject("vpProps");
    const container = ref();
    const marker = ref();
    const headers = getHeaders(vpProps.range ? vpProps.range : [1, 6]);
    useActiveAnchor(container, marker, vpProps);
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(
        "nav",
        {
          "aria-labelledby": "doc-outline-aria-label",
          class: normalizeClass(["VPDocAsideOutline", { "has-outline": unref(vpProps).hasAside }]),
          ref_key: "container",
          ref: container
        },
        [
          createElementVNode("div", _hoisted_1$1, [
            createElementVNode(
              "div",
              {
                class: "outline-marker",
                ref_key: "marker",
                ref: marker
              },
              null,
              512
              /* NEED_PATCH */
            ),
            createElementVNode(
              "div",
              _hoisted_2,
              toDisplayString(unref(vpProps).title || "\u672C\u9875\u5BFC\u822A"),
              1
              /* TEXT */
            ),
            createVNode(VPDocOutlineItem, {
              headers: unref(headers),
              root: true
            }, null, 8, ["headers"])
          ])
        ],
        2
        /* CLASS */
      );
    };
  }
});

var VPDocAsideOutline = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-6384624a"]]);

const _hoisted_1 = { class: "VPDocAside" };
var _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "VPDocAside",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createVNode(VPDocAsideOutline)
      ]);
    };
  }
});

var VPDocAside = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-60ca5610"]]);

export { VPDocAside, VPDoc as VPDocView };
