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
import { ref, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useVideoStore } from "@/stores/video";
import { usePlayerStore } from "@/stores/player";
import { fetchSections } from "@/services/fetchers";

const router = useRouter();
const player = usePlayerStore();
const video = useVideoStore();
const { videoUrl } = storeToRefs(video);

if (video.videoDuration == 0) {
  video.resetVideo();
  router.push("/");
}
const sections = ref(await fetchSections(video.videoDuration));

onUnmounted(() => {
  video.resetVideo();
  player.resetHighlights();
  player.setCurrentId(0);
});
</script>
