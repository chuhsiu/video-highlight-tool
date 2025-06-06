<template>
    <div ref="containerRef" class="border pa-4 bg-surface overflow-y-auto" 
    :style="{ maxHeight: isMobile ? '25vh' : '80vh' }">
        <h3>Transcript</h3>
        <div v-for="(section, index) in sections" :key="index">
            <h4 class="py-2">{{ section.title }}</h4>
            <ul>
                <li
                v-for="(highlight, i) in section.highlights"
                :key="i"
                :ref="el => registerHighlightRef(highlight.id, el)"
                @click="toggleSelection(highlight)"
                :class="{
                    'bg-blue-darken-3' : highlight.id === currentId,
                    'text-grey-lighten-2': isSelected(highlight) && highlight.id === currentId,
                    'text-blue-lighten-1': isSelected(highlight) && highlight.id !== currentId,
                    'border-primary': isSelected(highlight),
                    'bg-grey-darken-2' : highlight.id !== currentId
                }"
                class="border-md rounded-lg ma-2 pa-2"
                >
                <strong>{{ highlight.time }}s</strong> - {{ highlight.text }}
                </li>
            </ul>
            <v-divider></v-divider>
        </div>
    </div>
</template>
<style scoped>

li {
    list-style: none;
    cursor: pointer;
}
</style>
<script setup lang="ts">
import { ref, watch, onMounted, nextTick, defineProps, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { usePlayerStore } from "@/stores/player"
import { useDisplay } from 'vuetify'

const { xs, sm } = useDisplay()
const isMobile = computed(() => xs.value || sm.value)

const player = usePlayerStore()
const { currentId, selectedHighlights } = storeToRefs(player)

defineProps({
    sections: {
        type: Array
    }
})

function toggleSelection(highlight: { id: number; text: string; time: number }) {
    const exists = selectedHighlights.value.some(item => item.id === highlight.id)
    if (exists) {
        player.removeHighlight(highlight.id)
    } else {
        player.addHighlight(highlight)
    }
}

function isSelected(highlight: { id: number; text: string; time: number }) {
    return selectedHighlights.value.some(item => item.id === highlight.id)
  
}

// DOM refs
const containerRef = ref<HTMLElement | null>(null)
const highlightRefs = new Map<number, HTMLElement>()

function registerHighlightRef(id: number, el: Element | null) {
  if (el instanceof HTMLElement) {
    highlightRefs.set(id, el)
  }
}

// 滾動到中間
function scrollToCurrent() {
  nextTick(() => {
    const el = highlightRefs.get(currentId.value!)
    if (el) {
      el.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
    }
  })
}

watch(currentId, () => {
  if (currentId.value != null) {
    scrollToCurrent()
  }
})

</script>