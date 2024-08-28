<script setup lang="ts">
import 'vue-json-pretty/lib/styles.css'

import { computed } from 'vue'

import { blocksBaseMeta } from '@/constants/blocksBaseMeta'
import { useAppEditorStore } from '@/stores/appEditor'
import type { BlockInfo } from '@/types/block'

import ChartSetting from './ChartSetting.vue'
import QuoteSetting from './QuoteSetting.vue'
import SchemaExporter from './SchemaExporter.vue'

const appEditorStore = useAppEditorStore()

//将blocks按照<id, block>存入Map中
const blocksMap = computed(() => {
  const { blocks } = appEditorStore
  return blocks.reduce<Record<string, (typeof blocks)[0]>>((acc, cur) => {
    acc[cur.id] = cur
    return acc
  }, {})
})

//判断当前选中的组件，获取该组件的值
const currentBlockInfo = computed(() => {
  if (!appEditorStore.currentBlockId) return null
  return blocksMap.value[appEditorStore.currentBlockId]
})

const blockSetting = computed(() => {
  //quote有内容，chart有不同图片
  switch (currentBlockInfo.value?.type) {
    case 'quote': {
      return QuoteSetting
    }
    case 'chart': {
      return ChartSetting
    }
    default:
      return ''
  }
})
</script>

<template>
  <div class="app-right-panel-wrapper">
    <template v-if="currentBlockInfo">
      <div class="app-right-panel-header">
        {{ blocksBaseMeta[currentBlockInfo.type].label }}
      </div>
      <div class="app-right-panel-content">
        <!-- 策略模式渲染 is-->
        <component
          :is="blockSetting"
          :blockInfo="currentBlockInfo"
          @change="(block: BlockInfo) => appEditorStore.updateBlock(block.id, block)"
        />
        <SchemaExporter :currentBlockInfo="currentBlockInfo" />
      </div>
    </template>
  </div>
</template>

<style scoped>
.app-right-panel-wrapper {
  position: relative;
  z-index: 4;
  width: var(--panel-width);
  height: 100%;
  box-shadow: var(--color-gray-300) 1px 0 0;
}

.app-right-panel-header {
  font-size: var(--font-size-normal);
  font-weight: var(--font-weight-bolder);
  height: 44px;
  line-height: 44px;
  padding: 0 16px 0 20px;
}

.app-right-panel-content {
  padding: 0 16px 0 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
