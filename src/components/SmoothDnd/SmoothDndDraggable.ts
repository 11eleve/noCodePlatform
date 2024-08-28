import { constants } from 'smooth-dnd'
import { defineComponent, h } from 'vue'

import { getTagProps, validateTagProp } from './utils'

export const SmoothDndDraggable = defineComponent({
  //组件名称
  name: 'SmoothDndDraggable',
  props: {
    tag: {
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
