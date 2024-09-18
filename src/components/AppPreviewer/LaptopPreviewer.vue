<script setup lang="ts">
import BlocksRenderer from '@/blocks/BlocksRenderer.vue';
import bus from '@/utils/mitt';
import html2pdf from 'html2pdf.js'

function download() {
  // 获取指定的HTML元素
  const element = document.getElementById("layout-wrapper");
  // console.log('this is dom')
  // console.log(element?.outerHTML)
  const blob = new Blob([element?.outerHTML || ''], { type: 'text/html' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'page.html';
  link.click();
}

bus.on('downloadPDF', () => {
  download();
})

</script>

<template>
  <div class="layout-runner-content-wrapper tiny-scrollbar">
    <div class="layout-runner-content-header">
      <div class="layout-runner-content-navigator"></div>
      <div class="layout-runner-content-title">Byelide</div>
    </div>
    <div class="layout-runner-content" id="layout-wrapper">
      <BlocksRenderer />
    </div>
  </div>
</template>

<style scoped>
.layout-runner-content-wrapper {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: auto;
}

.layout-runner-content-header {
  position: sticky;
  top: 0;
  z-index: 2;
}

.layout-runner-content-navigator {
  height: 56px;
  font-size: var(--font-size-normal);
  align-items: center;
  padding: 0 16px;
  background-color: var(--color-primary);
  border-bottom: 1px solid rgb(31 41 55 / 8%);
}

.layout-runner-content-title {
  display: flex;
  align-items: center;
  padding: 0 90px;
  height: 90px;
  font-size: 24px;
  font-weight: var(--font-weight-bolder);
  color: var(--color-white);
  background-color: var(--color-primary);
}

.layout-runner-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 90px;
}
</style>
