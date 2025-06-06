import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

export const usePlayerStore = defineStore('player', () => {
    const currentId = ref<number | null>(null)

    function setCurrentId(id: number) {
      currentId.value = id
    }

    const selectedHighlights = reactive<{ id: number; text: string; time: number }[]>([])

    function addHighlight(highlight: { id: number; text: string; time: number }) {
      const exists = selectedHighlights.some((item) => item.id === highlight.id)
      if (!exists) {
        selectedHighlights.push(highlight)
        selectedHighlights.sort((a, b) => a.time - b.time)
      }
    }
  
    function removeHighlight(id: number) {
      const index = selectedHighlights.findIndex((item) => item.id === id)
      if (index >= 0) {
        selectedHighlights.splice(index, 1)
      }
    }
    function resetHighlights(){
      selectedHighlights.splice(0, selectedHighlights.length)
    }

    return {
      currentId,
      setCurrentId,
      selectedHighlights,
      resetHighlights,
      addHighlight,
      removeHighlight,
    }
  })