<template>
  <div class="canvas" ref="containerRef"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import * as zrender from 'zrender'

var containerRef = ref<HTMLDivElement | null>(null)

onMounted(() => {
  //初始化一个zrender实例
  var zr = zrender.init(containerRef.value, { renderer: 'svg' })

  var w = zr.getWidth()
  var h = zr.getHeight()
  
  //青色部分
  //创建一个带有文本样式的text对象
  var t1 = new zrender.Text({
    style: {
      text: '你好',
      align: 'center',
      verticalAlign: 'middle',
      fill: '#0ff',
      fontSize: 200,
      fontFamily: 'Lato',
      fontWeight: 'bolder',
      //位置
      x: w / 2 + 5,
      y: h / 2
    }
  })
  zr.add(t1)

  //白色部分
  var t2 = new zrender.Text({
    culling: true,
    style: {
      text: '你好',
      fontSize: 200,
      align: 'center',
      fill: '#fff',
      verticalAlign: 'middle',
      fontFamily: 'Lato',
      fontWeight: 'bolder',
      x: w / 2,
      y: h / 2
    }
  })
  zr.add(t2)

  //zrender.rect可以实现绘制矩形
  var lines: zrender.Rect[] = []
  for (var i = 0; i < 16; ++i) {
    var line = new zrender.Rect({
      //rect的属性
      shape: {
        //random生成0-1之间的数
        x: w * (Math.random() ),
        y: h * Math.random(),
        width: w * (Math.random()),
        height: Math.random() * 8
      },
      style: {
        fill: ['#ff0', '#f0f', '#0ff', '#00f'][Math.floor(Math.random() * 4)],
        blend: 'lighten',
        opacity: 0
      }
    })
    zr.add(line)
    lines.push(line)
  }

  setInterval(function () {
    if (Math.random() > 0.2) {
      t2.attr('style', {
        x: w / 2 + Math.random() * 50,
        y: h / 2
      })

      //生成变化的条纹
      for (var i = 0; i < lines.length; ++i) {
        //attr更新矩型属性
        lines[i].attr('shape', {
          x: w * Math.random(),
          y: h * Math.random(),
          width: w * Math.random(),
          height: Math.random() * 8
        })
        lines[i].attr('style', {
          opacity: 1
        })
      }
      
      //使条纹闪烁
      setTimeout(function () {
        t2.attr('style', {
          x: w / 2,
          y: h / 2
        })

        for (var i = 0; i < lines.length; ++i) {
          lines[i].attr('style', {
            //透明
            opacity: 0
          })
        }
      }, 100)
    }
  }, 500)
})
</script>

<style scoped>
.canvas {
  width: 100%;
  height: 360px;
  background-color: #333;
}
</style>
