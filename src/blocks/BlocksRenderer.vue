<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { dropHandlers, type DropResult, smoothDnD } from 'smooth-dnd'
import { toRaw } from 'vue'

import { SmoothDndContainer } from '@/components/SmoothDnd/SmoothDndContainer'
import { SmoothDndDraggable } from '@/components/SmoothDnd/SmoothDndDraggable'
import { useAppEditorStore } from '@/stores/appEditor'
import { arrayMove } from '@/utils/array'

import BlockRenderer from './BlockRenderer.vue'

smoothDnD.dropHandler = dropHandlers.reactDropHandler().handler

// const props = defineProps<{
//   type: BlockType
// }>()
const appEditorStore = useAppEditorStore()

const { blocks } = storeToRefs(appEditorStore)
const { updateBlocks } = appEditorStore

//写成箭头函数可以避免this绑定问题，不能作为构造函数使得意图更加明显
const applyDrag = <T extends any[]>(arr: T, dragResult: DropResult) => {
  //此处为smoothdnd的部分
  /*
  *removedIndex: 被拖动的项目在原始列表中的索引，若为被移出则removedIndex可能为-1或者null
  *addedIndex 表示被拖动的项目在目标列表中插入的位置。
  *payload 是被拖动项目的数据。
  */
  const { removedIndex, addedIndex, payload } = dragResult
  
  //arr即是blocks
  const result = [...arr]

  // 没做操作
  if (addedIndex === null) return result

  // 添加
  if (addedIndex !== null && removedIndex === null) {
    result.splice(addedIndex, 0, {
      id: `${Math.random()}`,
      ...payload
    })
  }

  // 移动
  if (addedIndex !== null && removedIndex !== null) {
    return arrayMove(result, removedIndex, addedIndex)
  }

  return result
}

</script>

<template>
  <!-- group-name可拖动元素可以在具有相同组名的容器间移动 -->
   <!--drag-handle-selector=".handle"， 用于选择开启拖动的css选择器，若不指定，则该标签内任何组件都可拖动 -->
  <smooth-dnd-container
    drag-handle-selector=".handle"
    group-name="blocks"
    orientation="vertical"
    tag="div"
    class="renderer-dnd-container"
    @drop="updateBlocks(applyDrag(toRaw(blocks), $event))"
  >
    <smooth-dnd-draggable v-for="(block, i) in blocks" :key="block.id">
      <BlockRenderer :block="block" :i="i" />
    </smooth-dnd-draggable>
  </smooth-dnd-container>
</template>

<style scoped>
.renderer-dnd-container {
  width: 100%;
}
.block-wrapper {
  position: relative;
  display: flex;
  width: 100%;
  margin-top: 16px;
  padding: 6px 4px;
  border-radius: 8px;
  background-color: var(--color-white);
  transition: box-shadow 0.2s ease-in-out;
}

.block {
  position: relative;
  z-index: 1;
}

.block-wrapper-indicator {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  border-radius: 8px;
  pointer-events: none;
  user-select: none;
}

.block-wrapper-indicator.shown {
  border: 1px dashed var(--color-gray-300);
}

.block-wrapper-indicator.selected {
  border: 1px solid var(--color-primary);
}

.block-toolbar {
  display: flex;
  align-items: center;
  position: absolute;
  left: 0;
  top: -36px;
  z-index: 1;
  padding: 4px 8px;
  gap: 4px;
  background-color: var(--color-black);
  border-radius: 6px;
  pointer-events: visible;
}

.block-toolbar-item {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 22px;
  height: 22px;
  border-radius: 4px;
  color: var(--color-white);
  cursor: pointer;
}

.block-toolbar-item:nth-of-type(1) {
  cursor: grab;
}

.block-toolbar-item:hover {
  background-color: var(--color-gray-800);
  transition: all 0.2s ease-in-out;
}

.block-wrapper.debug:hover .block-wrapper-senior {
  border-style: solid;
  transition: box-shadow 0.2s ease-in-out;
}
</style>

<style lang="css">
.smooth-dnd-draggable-wrapper {
  overflow: visible !important;
}
</style>
