<template>
  <div class="border pa-4 bg-surface">
    <h3>Preview</h3>
    <template v-if="player.selectedHighlights.length === 0">
      <p class="text-grey-darken-3">Please select a highlight!</p>
      <v-skeleton-loader boilerplate type="image" class="mt-4 mb-8" />
    </template>
    <template v-else>
      <div class="relative">
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
          class="position-absolute left-0 text-caption font-weight-400"
          style="translate: (-50%, 0%); bottom: 3px;"
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
import { type Highlight } from "@/types";
import { storeToRefs } from "pinia";
import { usePlayerStore } from "@/stores/player";
import {
  findClipById,
  findCurrentClip,
  findClipIndex,
  getNextIndex,
  getPreviousIndex,
  isClipEnded,
  isVideoEnded,
  getVideo,
  seekToTime,
  playVideo,
  pauseVideo,
} from "@/utils/videoHelpers";

defineProps({
  videoUrl: {
    type: String,
  },
});

const player = usePlayerStore();
const { currentId } = storeToRefs(player);

const videoRef = ref(null);
const currentTime = ref(0);
const currentSentence = ref<Highlight | null>(null);
const isPlaying = ref(false);
const clipDuration = 5; // 每段播放 5 秒
const currentIndex = ref(0);

function play() {
  playVideo(getVideo(videoRef), isPlaying);
}

function pause() {
  pauseVideo(getVideo(videoRef), isPlaying);
}

function togglePlayPause() {
  const video = getVideo(videoRef);
  if (!video) return;
  video.paused ? play() : pause();
}

function goToHighlightById(id: number) {
  const index = player.selectedHighlights.findIndex((h) => h.id === id);
  if (index === -1) return;
  currentIndex.value = index;
  seekToTime(getVideo(videoRef), player.selectedHighlights[index].time);
}

function goToPrevious() {
  const { selectedHighlights } = player;
  if (!selectedHighlights.length || player.currentId == null) return;

  const index = findClipIndex(selectedHighlights, player.currentId);
  const prevIndex = getPreviousIndex(index, selectedHighlights.length);
  player.setCurrentId(selectedHighlights[prevIndex].id);
}

function goToNext() {
  const { selectedHighlights } = player;
  if (!selectedHighlights.length || player.currentId == null) return;

  const index = findClipIndex(selectedHighlights, player.currentId);
  const nextIndex = getNextIndex(index, selectedHighlights.length);
  player.setCurrentId(selectedHighlights[nextIndex].id);
}

function updateCurrentTime() {
  const video = getVideo(videoRef);
  if (!video) return;

  currentTime.value = video.currentTime;
  const match = findCurrentClip(
    player.selectedHighlights,
    currentTime.value,
    clipDuration
  );

  if (match) {
    currentSentence.value = match;
    if (player.currentId !== match.id) {
      player.setCurrentId(match.id);
    }
  } else {
    currentSentence.value = null;
  }

  const currentClip = findClipById(player.selectedHighlights, player.currentId);
  if (!currentClip) return;

  const isLastClip =
    findClipIndex(player.selectedHighlights, currentClip.id) ===
    player.selectedHighlights.length - 1;

  const clipEnded = isClipEnded(
    currentTime.value,
    currentClip.time,
    clipDuration
  );
  const videoEnded = isVideoEnded(currentTime.value, video.duration);

  if (clipEnded || (isLastClip && videoEnded)) {
    const currentIdx = findClipIndex(player.selectedHighlights, currentClip.id);
    const nextIdx = getNextIndex(currentIdx, player.selectedHighlights.length);
    const nextClip = player.selectedHighlights[nextIdx];
    player.setCurrentId(nextClip.id);
    seekToTime(video, nextClip.time);
    play();
  }
}

watch(currentTime, (time) => {
  const clip = findCurrentClip(player.selectedHighlights, time, clipDuration);
  currentSentence.value = clip;
  currentIndex.value = clip
    ? findClipIndex(player.selectedHighlights, clip.id)
    : 0;
});

watch(
  () => player.currentId,
  (id) => {
    if (id != null) goToHighlightById(id);
  }
);

watchEffect(() => {
  const highlights = player.selectedHighlights;
  const video = getVideo(videoRef);
  if (!video) return;

  if (!highlights.length) {
    currentTime.value = 0;
    pause();
    player.setCurrentId(0);
  } else if (
    highlights.length === 1 ||
    !highlights.some((h) => h.id === player.currentId)
  ) {
    player.setCurrentId(highlights[0].id);
    if (video.paused) play();
  }
});

function onSeek(time: number) {
  seekToTime(getVideo(videoRef), time);
}
</script>
