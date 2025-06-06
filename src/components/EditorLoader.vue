<template>
  <v-container>
    <v-row>
      <v-col 
        cols="12"
        md="6"
        :order="isMobile ? 2 : 1"
      >
        <Highlight-Editor :sections="sections" />
      </v-col>
      <v-col
        class="mb-5 scroll-y-auto"
        cols="12"
        md="6"
        :order="isMobile ? 1 : 2"
      >
        <Video-Preview :videoUrl="videoUrl" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useVideoStore } from "@/stores/video";
import { usePlayerStore } from "@/stores/player";
import { fetchSections } from "@/services/fetchers";
import { type Section } from "@/types";
import { useDisplay } from 'vuetify'

const { xs, sm } = useDisplay()
const isMobile = computed(() => xs.value || sm.value)

const router = useRouter();
const player = usePlayerStore();
const video = useVideoStore();
const { videoUrl } = storeToRefs(video);

const sections = ref<Section[]>([]);

onMounted(async () => {
  if (video.videoDuration === 0) {
    video.resetVideo();
    router.push("/");
    return;
  }

  try {
    sections.value = await fetchSections(video.videoDuration);
  } catch (error) {
    console.error("Failed to fetchSections:", error);
  }
});

onUnmounted(() => {
  video.resetVideo();
  player.resetHighlights();
  player.setCurrentId(0);
});
</script>
