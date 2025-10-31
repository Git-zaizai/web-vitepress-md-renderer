<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { createMarkdownRenderer } from '../src/markdown/markdown'
import VPDoc from '../src/components/VPDoc/VPDoc.vue'
import VPDocAside from '../src/components/VPDoc/VPDocAside.vue'
import { customAlphabet } from 'nanoid'
console.log(`🚀 ~ customAlphabet:`, customAlphabet)
const test = async () => {
  const test = await fetch('markdown.md')
  return await test.text()
}
const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz', 10)
let marker = nanoid()

const content = ref('')
const scrollt = ref<HTMLElement>()

let md
onMounted(async () => {
  md = await createMarkdownRenderer()
  let mdContent = await test()
  // content.value = await md.renderAsync(mdContent, {
  //   path: '/',
  //   relativePath: '/',
  //   cleanUrls: true,
  //   includes: ['/'],
  //   realPath: '/',
  //   localeIndex: '/'
  // })
  content.value = await md.renderAsync(mdContent)
})
</script>

<template>
  <div>{{ marker }}</div>
  <div ref="scrollt">
    <div class="view">
      <VPDoc :content="content" hasAside>
        <template #doc-aside>
          <VPDocAside />
        </template>
      </VPDoc>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.view {
  // width: 80vw;
  // height: 90vh;
  // overflow: auto;
}
</style>
