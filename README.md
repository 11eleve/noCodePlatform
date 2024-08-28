## 无代码编辑平台

### 1. 项目介绍
无代码允许开发人员低成本通过拖拉拽的方式快速构建企业内部系统或落地页。
可视化平台允许数据分析人员通过拖拉拽的方式快速组建仪表盘或数据分析大盘，其在企业运营方面发挥重要作用。

##### 编排
- 微内核思想：操作的是DSL（json树），f(state)->view 
  - 组合和渲染层隔离
  - render runtime(渲染引擎sdk) + dsl(json) = 页面
- 事件：DND拖拽、Mouse Event

- #### Vue 项目基础架构设计，基于 Vite、Pinia、Vue-Router
技术选型
- 包管理：pnpm
- 工程化相关
  - vite
  - lint-staged
  - cspell
  - commitizen
  - cz-git
  - husky
  - zx
  - tsno
- lint规范：
  - commitlint；
  - stylelint；
  - prettier；
  - eslint；
  - editorconfig;
- Vue CLI、Vue3
- Pinia
- Vue-Router
- 拖拽库：基于原生的 smooth-dnd 封装用于 Vue3 的拖拽组件
- 表单校验：vee-validate，https://vee-validate.logaretm.com/v4/
- 流程编排：@vue-flow/core，https://vueflow.dev/
- 图表：echarts

##### 核心能力
- 可视化配置面板
- 具有可拓展能力：组件、模板、逻辑复用
- 生命周期管理：开发管理、页面管理、部署管理

### 3. 核心部分：对smooth-dnd进行封装

位置：src/component/SmoothDnd

smooth-dnd分为container与draggable两部分
 直接搜索smooth-dnd

使用：

```html
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
```

- container：

  - drag-handle-selector：*用于选择开启拖动的css选择器，若不指定，则该标签内任何组件都可拖动*

    ```html
    //此代码为BlockRenderer中控制移动的部分
    <div class="block-toolbar-item handle">
              <drag />
    </div>
    ```

  - group-name：*可拖动元素可以在具有相同组名的容器间移动*

#### 3.1 Draggable

```js
import { constants } from 'smooth-dnd'
import { defineComponent, h } from 'vue'

import { getTagProps, validateTagProp } from './utils'

export const SmoothDndDraggable = defineComponent({
  name: 'SmoothDndDraggable',
  props: {
    tag: {
      //检验tag是否合法
      validator: validateTagProp,
      default: 'div'
    }
  },
  render: function () {
    //wrap child
    const tagProps = getTagProps(this, constants.wrapperClass)
    //返回一个虚拟节点， tagProps.value表示要创建的标签， Object.assign为标签添加相关属性，this.$slots渲染默认插槽的内容
    return h(tagProps.value, Object.assign({}, tagProps.props), this.$slots?.default?.())
  }
})
```

这段代码返回了一个组件，他的标签是由传入的参数决定，默认为div

#### 3.2 Container

```js
//负责处理拖放事件的处理器
smoothDnD.dropHandler = dropHandlers.reactDropHandler().handler
smoothDnD.wrapChild = false

//拖放事件类型，自定义
type EventKey = 'drag-start' | 'drag-end' | 'drop' | 'drag-enter' | 'drag-leave' | 'drop-ready'

//映射到事件名，这里的键是vue组件对应的属性
const eventEmitterMap: Record<EventKey, string> = {
  'drag-start': 'onDragStart',
  'drag-end': 'onDragEnd',
  drop: 'onDrop',
  'drag-enter': 'onDragEnter',
  'drag-leave': 'onDragLeave',
  'drop-ready': 'onDropReady'
}

export const SmoothDndContainer = defineComponent({
  name: 'SmoothDndContainer',
  setup() {
    return {
      //初始化一个container
      //container用来创建和管理一个可拖拽和放置的容器
      container: null as SmoothDnD | null
    }
  },
  mounted() {
    // emit events
    //将传进的所有参数传递给options
    const options: any = Object.assign({}, this.$props)
    for (const key in eventEmitterMap) {
      //key为EventKey类型
      const eventKey = key as EventKey
      //通过eventEmitterMap[eventKey]找到对应的事件名称
      options[eventEmitterMap[eventKey]] = (props: any) => {
        //当使用时会触发对应名称的事件，即将触发事件的函数放在options里面
        //例如在BlocksRenderer中drop触发时会调用相应函数
        this.$emit(eventKey, props)
      }
    }
    //this.$ref.container用于访问ref的container
    //目的是获取到dom元素
    const containerElement = this.$refs.container || this.$el
    //配置拖放容器，这里options被使用，应该是底层会调用options内存放的函数
    this.container = smoothDnD(containerElement, options)
  },
  unmounted() {
    //卸载
    if (this.container) {
      try {
        this.container.dispose()
      } catch {
        // ignore
      }
    }
  },
  //声明会触发的事件
  emits: ['drop', 'drag-start', 'drag-end', 'drag-enter', 'drag-leave', 'drop-ready'],
  //配置参数，参考smooth-dnd参数
  props: {
    orientation: { type: String, default: 'vertical' },
    removeOnDropOut: { type: Boolean, default: false },
    autoScrollEnabled: { type: Boolean, default: true },
    animationDuration: { type: Number, default: 250 },
    behaviour: String,
    groupName: String,
    dragHandleSelector: String,
    nonDragAreaSelector: String,
    lockAxis: String,
    dragClass: String,
    dropClass: String,
    dragBeginDelay: Number,
    getChildPayload: Function,
    shouldAnimateDrop: Function,
    shouldAcceptDrop: Function,
    getGhostParent: Function,
    dropPlaceholder: [Object, Boolean],
    tag: {
      validator: validateTagProp,
      default: 'div'
    }
  },
  //渲染标签，默认div
  render() {
    const tagProps = getTagProps(this)
    return h(
      tagProps.value,
      Object.assign({}, { ref: 'container' }, tagProps.props),
      this.$slots.default?.()
    )
  }
})
```

例如触发drop事件后，对应blocksRenderer中的applyDarg

```html
组件
<smooth-dnd-container
    drag-handle-selector=".handle"
    group-name="blocks"
    orientation="vertical"
    tag="div"
    class="renderer-dnd-container"
    //此处
    //此处为smooth-dnd中的属性，drop为组件提供的钩子，在drop时触发
    //这里的toRaw是把blocks变成不具备响应式的对象，因可能无法处理响应式对象，因此变为原始对象，
    //这里的$event为拖拽时产生的参数，smoothdnd需要获取并对其进行处理，smoothdnd内部处理？应该
    @drop="updateBlocks(applyDrag(toRaw(blocks), $event))"
 >
```

```js
//对应js
const applyDrag = <T extends any[]>(arr: T, dragResult: DropResult) => {
  //此处为smoothdnd的部分
  /*
  *removedIndex: 被拖动的项目在原始列表中的索引，若为被移出则removedIndex可能为-1或者null
  *addedIndex 表示被拖动的项目在目标列表中插入的位置。
  *这些位置信息都是从event中解析出来的
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
        //随机生成id
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
```

#### 3.3 相关utils：getTagProps，validateTagProp

##### 3.3.1 getTagProps

用于生成标签相关属性，处理标签类型的字符串或者对象

##### 3.3.2 validateTagProp

验证传出的tag参数是否是合法的html标签

### 4. 不足

#### 4.1 物料种类不够丰富

#### 4.2 物料设计不够灵活，仍是写死的状态

#### 4.3 未实现发布，开发者模式功能

#### 4.4 点击组件出现的选中框占据整行，移动与删除会被遮挡（调整z-index）

