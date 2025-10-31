<script setup lang="ts">
import {
  computed,
  provide,
  onMounted,
  onUnmounted,
  watch,
  nextTick,
  ref
} from 'vue'
// import { useLayout } from '../composables/layout'
// import VPDocAside from './VPDocAside.vue'
// import VPDocFooter from './VPDocFooter.vue'
import type { ORange } from './outline'
import { useCodeGroups, useCopyCode } from './outline'

const props = withDefaults(
  defineProps<{
    externalLinkIcon?: boolean
    hasSidebar?: boolean
    hasAside?: boolean
    leftAside?: boolean
    hasLocalNav?: boolean
    title?: string
    range?: ORange
    content: string
    asidePaddingTop?: boolean
  }>(),
  {
    asidePaddingTop: true
  }
)

provide('vpProps', props)

const pageName = computed(() => {
  // return route.path.replace(/[./]+/g, '_').replace(/_html$/, '')
  return window.location.pathname.replace(/[./]+/g, '_').replace(/_html$/, '')
})

onMounted(() => {
  window.addEventListener('click', useCodeGroups)
  window.addEventListener('click', useCopyCode)
})

onUnmounted(() => {
  window.removeEventListener('click', useCodeGroups)
  window.removeEventListener('click', useCopyCode)
})

const showAside = ref(false)

watch(
  () => props.content,
  () => {
    nextTick(() => {
      if (props.hasAside) {
        showAside.value = true
      }
    })
  }
)
</script>

<template>
  <!-- 
    :class="{ 'has-sidebar': hasSidebar, 'has-aside': hasAside }" -->
  <div class="VPDoc">
    <slot name="doc-top" />
    <div class="container">
      <!-- :class="{ 'left-aside': leftAside }" -->
      <div v-if="hasAside" class="aside">
        <div class="aside-curtain" />
        <div
          class="aside-container"
          :class="{ 'aside-container__paddding-top': asidePaddingTop }"
        >
          <div class="aside-content">
            <!-- <VPDocAside v-if="showAside"></VPDocAside> -->
            <slot v-if="showAside" name="doc-aside" />
          </div>
        </div>
      </div>

      <div class="content">
        <div class="content-container">
          <slot name="doc-before" />
          <main class="main">
            <!-- <Content
              class="vp-doc"
              :class="[
                pageName,
                theme.externalLinkIcon && 'external-link-icon-enabled'
              ]"
            /> -->
            <div
              class="vp-doc"
              :class="[
                pageName,
                props.externalLinkIcon && 'external-link-icon-enabled'
              ]"
            >
              <div v-html="content"></div>
            </div>
          </main>
          <!-- <VPDocFooter>
            <template #doc-footer-before
              ><slot name="doc-footer-before"
            /></template>
          </VPDocFooter> -->
          <!-- <slot name="doc-after" /> -->
        </div>
      </div>
    </div>
  </div>
</template>

<style src="../styles/index.css"></style>
<style scoped>
.VPDoc {
  padding: 32px 24px 96px;
  width: 100%;
}

@media (min-width: 768px) {
  .VPDoc {
    padding: 48px 32px 128px;
  }
}

@media (min-width: 960px) {
  .VPDoc {
    padding: 48px 32px 0;
  }

  /* .VPDoc:not(.has-sidebar) .container {
    display: flex;
    justify-content: center;
    max-width: 992px;
  }

  .VPDoc:not(.has-sidebar) .content {
    max-width: 752px;
  } */
}

@media (min-width: 1280px) {
  .VPDoc .container {
    display: flex;
    justify-content: center;
  }

  .VPDoc .aside {
    display: block;
  }
}

@media (min-width: 1440px) {
  /* .VPDoc:not(.has-sidebar) .content {
    max-width: 784px;
  }

  .VPDoc:not(.has-sidebar) .container {
    max-width: 1104px;
  } */
}

.container {
  margin: 0 auto;
  width: 100%;
}

.aside {
  position: relative;
  display: none;
  order: 2;
  flex-grow: 1;
  padding-left: 32px;
  width: 100%;
  max-width: 256px;
}

.left-aside {
  order: 1;
  padding-left: unset;
  padding-right: 32px;
}

.aside-container {
  position: fixed;
  top: 0;
  width: 224px;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  scrollbar-width: none;
}

.aside-container__paddding-top {
  padding-top: calc(
    var(--vp-nav-height) + var(--vp-layout-top-height, 0px) +
      var(--vp-doc-top-height, 0px) + 48px
  );
}

.aside-container::-webkit-scrollbar {
  display: none;
}

.aside-curtain {
  position: absolute;
  bottom: 0;
  z-index: 10;
  width: 224px;
  height: 32px;
  background: linear-gradient(transparent, var(--vp-c-bg) 70%);
  pointer-events: none;
}

.aside-content {
  display: flex;
  flex-direction: column;
  min-height: calc(
    100vh - (var(--vp-nav-height) + var(--vp-layout-top-height, 0px) + 48px)
  );
  padding-bottom: 32px;
}

.content {
  position: relative;
  margin: 0 auto;
  width: 100%;
}

@media (min-width: 960px) {
  .content {
    padding: 0 32px 128px;
  }
}

@media (min-width: 1280px) {
  .content {
    order: 1;
    margin: 0;
    min-width: 640px;
  }
}

.content-container {
  margin: 0 auto;
}

/* .VPDoc.has-aside .content-container {
  max-width: 688px;
} */
</style>
