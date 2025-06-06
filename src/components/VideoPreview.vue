<template>
  <div class="border pa-4 bg-surface" style="height: 80vh;">
    <h3>Preview</h3>
    <template v-if="player.selectedHighlights.length === 0">
      尚未選擇片段
      <v-skeleton-loader boilerplate type="image" class="ma-4" />
    </template>
    <template v-else>
      <div style="position: relative">
        <video
          ref="videoRef"
          width="100%"
          :src="videoUrl"
          class="video-player"
          @timeupdate="updateCurrentTime"
        >
          <source type="video/*" />
          The browser doesn't support HTML5 video.
        </video>
        <div
          v-if="currentSentence"
          class="position-absolute left-0 bottom-0 text-caption font-weight-400"
          style="translate: (-50%, 0%)"
        >
          {{ currentSentence.text }}
        </div>
      </div>
    </template>
    <Video-Timeline
      :currentTime="currentTime"
      :duration="videoRef?.duration || 0"
      :highlights="player.selectedHighlights"
      :clipDuration="5"
      @seek="onSeek"
    >
    </Video-Timeline>
    <div class="d-flex justify-space-evenly">
      <v-btn
        icon="mdi-chevron-double-left"
        @click="goToPrevious"
        variant="text"
      ></v-btn>
      <v-btn
        :icon="isPlaying ? 'mdi-pause' : 'mdi-play'"
        @click="togglePlayPause"
        variant="text"
      ></v-btn>
      <v-btn
        icon="mdi-chevron-double-right"
        @click="goToNext"
        variant="text"
      ></v-btn>
    </div>
  </div>
</template>
<style scoped>
.video-player {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  object-position: center;
  aspect-ratio: 16/9;
}
</style>
<script setup lang="ts">
import { ref, watch, watchEffect, defineProps } from "vue";
import { storeToRefs } from "pinia";
import { usePlayerStore } from "@/stores/player";

defineProps({
  videoUrl: {
    type: String,
  },
});

const player = usePlayerStore();
const { currentId } = storeToRefs(player);

const videoRef = ref(null);
const currentTime = ref(0);
const currentSentence = ref(null);
const isPlaying = ref(false);
const clipDuration = 5; // 每段播放 5 秒

const currentIndex = ref(0);

function togglePlayPause() {
  if (!videoRef.value) return;

  if (videoRef.value.paused) {
    videoRef.value.play();
    isPlaying.value = true;
  } else {
    videoRef.value.pause();
    isPlaying.value = false;
  }
}

// 跳轉到某一個 highlight
function goToHighlightById(id) {
  const index = player.selectedHighlights.findIndex((h) => h.id === id);
  if (index === -1) return;

  const target = player.selectedHighlights[index];
  currentIndex.value = index;

  if (videoRef.value) {
    videoRef.value.currentTime = target.time;
  }
}

// 跳轉上一段
function goToPrevious() {
  if (player.selectedHighlights.length === 0 || currentId.value == null) return;

  const index = player.selectedHighlights.findIndex(
    (h) => h.id === currentId.value
  );
  if (index === -1) return;

  const prevIndex =
    index === 0 ? player.selectedHighlights.length - 1 : index - 1;
  const prevHighlight = player.selectedHighlights[prevIndex];
  player.setCurrentId(prevHighlight.id);
}

// 跳轉下一段
function goToNext() {
  if (player.selectedHighlights.length === 0 || currentId.value == null) return;

  const index = player.selectedHighlights.findIndex(
    (h) => h.id === currentId.value
  );
  if (index === -1) return;

  const nextIndex = (index + 1) % player.selectedHighlights.length;
  const nextHighlight = player.selectedHighlights[nextIndex];
  player.setCurrentId(nextHighlight.id);
}

function updateCurrentTime() {
  if (!videoRef.value) return;

  const video = videoRef.value;
  currentTime.value = video.currentTime;

  const { selectedHighlights } = player;
  const duration = video.duration;
  const current = currentTime.value;

  if (!selectedHighlights.length) return;

  // 找出目前所在的 clip（時間落在其內）
  const match = selectedHighlights.find(
    (clip) => current >= clip.time && current < clip.time + clipDuration
  );

  if (match) {
    currentSentence.value = match;
    if (currentId.value !== match.id) {
      player.setCurrentId(match.id);
    }
  } else {
    currentSentence.value = null;
  }

  const currentClip = selectedHighlights.find((c) => c.id === currentId.value);
  if (!currentClip) return;

  const isLastClip =
    selectedHighlights.findIndex((c) => c.id === currentClip.id) ===
    selectedHighlights.length - 1;

  const isClipEnded = current >= currentClip.time + clipDuration;
  const isVideoEnded = current >= duration;

  // 播放下一段邏輯（clip 結束或影片結束）
  if (isClipEnded || (isLastClip && isVideoEnded)) {
    if (selectedHighlights.length === 1) {
      // 只有一段，重播這段
      video.currentTime = currentClip.time;
      videoRef.value.pause();
    } else {
      // 播放下一段（循環）
      const currentIdx = selectedHighlights.findIndex(
        (c) => c.id === currentClip.id
      );
      const nextIdx = (currentIdx + 1) % selectedHighlights.length;
      const nextClip = selectedHighlights[nextIdx];
      player.setCurrentId(nextClip.id);
      video.currentTime = nextClip.time;
    }
    isPlaying.value = false;
  }
}

// 取得目前播放時間對應的句子
watch(currentTime, (time) => {
  const index = player.selectedHighlights.findIndex(
    (clip) => time >= clip.time && time <= clip.time + clipDuration
  );
  if (index !== -1) {
    currentSentence.value = player.selectedHighlights[index];
    currentIndex.value = index;
  } else {
    currentSentence.value = null;
  }
});

watch(currentId, (id) => {
  goToHighlightById(id);
});

watchEffect(() => {
  const highlights = player.selectedHighlights;
  if (!videoRef.value) return;

  if (highlights.length === 0) {
    currentTime.value = 0;
    videoRef.value.pause();
    isPlaying.value = false;
    player.setCurrentId(0);
  } else if (
    highlights.length === 1 ||
    !highlights.some((h) => h.id === currentId.value)
  ) {
    player.setCurrentId(highlights[0].id);
    if (videoRef.value.paused) {
      videoRef.value.play();
      isPlaying.value = true;
    }
  }
});

function onSeek(time: number) {
  if (videoRef.value) {
    videoRef.value.currentTime = time;
  }
}
</script>
