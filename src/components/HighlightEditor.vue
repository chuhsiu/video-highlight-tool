<template>
    <div class="border pa-4">
        <h3>Editor</h3>
        <v-list 
            v-model:selected="selectedHighlights"
            select-strategy="leaf"
        >
            <v-list-subheader v-for="(section, index) in sections" :key="index">
                {{ section.title }}

                <v-list-item
                    v-for="(highlight, i) in section.highlights"
                    :key="i"
                    :value="highlight"
                    :color="highlight.id === currentId ? 'primary' : ''"
                >
                    <span class="text-primary"><strong>{{ highlight.time }}s</strong></span> - {{ highlight.text }}

                    <template #prepend="{ isSelected, select }">
                        <v-list-item-action
                            :model-value="isSelected"
                            @update:model-value="select"
                        />
                    </template>
                </v-list-item>
                <v-divider></v-divider>
            </v-list-subheader>
        </v-list>
    </div>
     <!-- <div v-for="(section, index) in sections" :key="index">
        <h2>{{ section.title }}</h2>
        <ul>
            <li
            v-for="(highlight, i) in section.highlights"
            :key="i"
            @click="toggleSelection(highlight)"
            :class="{
                'bg-red-darken-4' : highlight.id === currentId,
                'text-blue-darken-4': isSelected(highlight)
            }"
            >
            <strong>{{ highlight.time }}s</strong> - {{ highlight.text }}
            </li>
        </ul>
     </div> -->
     
      <h3>已選擇的句子摘要：</h3>
      <ul>
        <li v-for="(item, idx) in selectedHighlights" :key="idx">
          <strong>{{ item.time }}s</strong> - {{ item.text }}
        </li>
      </ul>
      <p>目前 ID：{{ currentId }}</p>
</template>
<script setup lang="ts">
import { ref, watch, computed, defineProps } from 'vue'
import { storeToRefs } from 'pinia'
import { usePlayerStore } from "@/stores/player"

const player = usePlayerStore()
const { currentId, selectedHighlights } = storeToRefs(player)

defineProps({
    sections: {
        type: Array
    }
})

watch(selectedHighlights, (highlight) =>{
    player.setHighlights(highlight)
})


// function toggleSelection(highlight: { id: number; text: string; time: number }) {
//     const exists = selectedHighlights.value.some(item => item.id === highlight.id)
//     if (exists) {
//         player.removeHighlight(highlight.id)
//     } else {
//         player.addHighlight(highlight)
//     }
// }

// function isSelected(highlight: { id: number; text: string; time: number }) {
//     return selectedHighlights.value.some(item => item.id === highlight.id)
  
// }


</script>