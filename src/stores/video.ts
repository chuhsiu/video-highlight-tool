import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useVideoStore = defineStore('video', () => {
  const videoUrl = ref<string | null>(null)
  const videoDuration = ref<number>(0)

  function setVideoInfo(url: string, duration: number) {
    videoUrl.value = url
    videoDuration.value = duration
  }

  function resetVideo() {
    videoUrl.value = null
    videoDuration.value = 0
  }

  return {
    videoUrl,
    videoDuration,
    setVideoInfo,
    resetVideo
  }
})