import type { SmoothDnD } from 'smooth-dnd'
import { dropHandlers, smoothDnD } from 'smooth-dnd'
import { defineComponent, h } from 'vue'

import { getTagProps, validateTagProp } from './utils'

//负责处理拖放事件的处理器
smoothDnD.dropHandler = dropHandlers.reactDropHandler().handler
smoothDnD.wrapChild = false

//拖放事件类型
type EventKey = 'drag-start' | 'drag-end' | 'drop' | 'drag-enter' | 'drag-leave' | 'drop-ready'

//映射到事件名
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
        //当使用时会触发对应名称的事件
        //例如在BlocksRenderer中drop触发时会调用相应函数
        this.$emit(eventKey, props)
      }
    }
    //this.$ref.container用于访问ref的container
    //目的是获取到dom元素
    const containerElement = this.$refs.container || this.$el
    //配置拖放容器,这里options被使用，应该是底层会调用options内存放的函数
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
  render() {
    const tagProps = getTagProps(this)
    return h(
      tagProps.value,
      Object.assign({}, { ref: 'container' }, tagProps.props),
      this.$slots.default?.()
    )
  }
})
