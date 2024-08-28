import { defineStore } from 'pinia'
import { ref } from 'vue'

//开发模式？
export const useEnvStore = defineStore('env', () => {
  const debug = ref(false)
  function toggle() {
    debug.value = !debug.value
  }

  return { debug, toggle }
})
