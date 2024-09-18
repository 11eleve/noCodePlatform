<script setup lang="ts">
import BlocksRenderer from '@/blocks/BlocksRenderer.vue';
import bus from '@/utils/mitt';
import html2pdf from 'html2pdf.js'

function download() {
  // 获取指定的HTML元素
  const element = document.getElementById("layout-wrapper");
  if (!element) {
    console.error("Element not found");
    return;
  }
  // 使用 html2pdf 生成 PDF
  const opt = {
    useCORS: true,
    margin: 0.5,         // PDF的页边距
    filename: 'document.pdf',  // 保存的文件名
    image: { type: 'jpeg', quality: 2 },  // 图片类型和质量
    html2canvas: { scale: 2 },  // html2canvas 选项，缩放比例
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }  // jsPDF 选项，页面格式为 A4 纵向
  };
  // 使用 html2pdf 将 HTML 元素转换为 PDF
  html2pdf().set(opt).from(element).save();
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
