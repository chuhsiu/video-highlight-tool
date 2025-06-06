<template>
  <v-container>
    <v-row>
      <v-col>
        <Highlight-Editor :sections="sections" />
      </v-col>
      <v-col>
        <Video-Preview :videoUrl="videoUrl" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useVideoStore } from "@/stores/video";
import { usePlayerStore } from "@/stores/player";
import { fetchSections } from "@/services/fetchers";
import { type Section } from "@/types"

const router = useRouter();
const player = usePlayerStore();
const video = useVideoStore();
const { videoUrl } = storeToRefs(video);

const sections = ref<Section[]>([])

onMounted(async () => {
  if (video.videoDuration === 0) {
    video.resetVideo()
    router.push('/')
    return
  }

  try {
    sections.value = await fetchSections(video.videoDuration)
  } catch (error) {
    console.error('Failed to fetchSections:', error)
  }
})

onUnmounted(() => {
  video.resetVideo();
  player.resetHighlights();
  player.setCurrentId(0);
});
</script>
