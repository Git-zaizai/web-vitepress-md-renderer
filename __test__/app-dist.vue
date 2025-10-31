<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { createMarkdownRenderer, disposeMdItInstance } from '../dist/esm/index'
import { VPDocView, VPDocAside } from '../dist/esm/components'
import '../dist/esm/components/index.css'

const test = async () => {
  const test = await fetch('markdown.md')
  return await test.text()
}
const content = ref('')
const scrollt = ref<HTMLElement>()

let md
onMounted(async () => {
  md = await createMarkdownRenderer()
  let mdContent = await test()
  content.value = await md.renderAsync(mdContent)
})
</script>

<template>
  <div>
    <VPDocView :content="content" hasAside>
        <template #doc-aside>
          <VPDocAside />
        </template>
    </VPDocView>
  </div>
</template>

<style lang="scss" scoped></style>
