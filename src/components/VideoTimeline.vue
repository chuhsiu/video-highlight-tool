<template>
  <div class="timeline-wrapper" @click="onBarClick($event)">
    <div class="timeline bar">
      <div
        v-for="highlight in highlights"
        :key="highlight.id"
        class="timeline marker bg-primary"
        :style="{
          left: getPercentage(highlight.time) + '%',
          width: getClipWidth(highlight.time) + '%',
        }"
      ></div>
    </div>
    <div
      class="timeline indicator bg-error"
      :style="{ left: progressPercentage + '%' }"
    ></div>
    <div class="timeline-info">
      <span>{{ formatTime(currentTime) }}</span>
      <span>{{ formatTime(duration) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineEmits, defineProps } from "vue";

const props = defineProps<{
  currentTime: number;
  duration: number;
  highlights: { id: number; time: number; text: string }[];
  clipDuration: number;
}>();

const emit = defineEmits<{
  (e: "seek", time: number): void;
}>();

const progressPercentage = computed(() => {
  if (!props.duration) return 0;
  return (props.currentTime / props.duration) * 100;
});

function formatTime(sec: number) {
  const minutes = Math.floor(sec / 60);
  const seconds = Math.floor(sec % 60);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
}
function getPercentage(time: number) {
  return props.duration ? (time / props.duration) * 100 : 0;
}

function getClipWidth(time?: number) {
  if (!props.duration) return 0;
  const width = (props.clipDuration / props.duration) * 100;
  const left = time !== undefined ? getPercentage(time) : 0;
  return Math.min(width, 100 - left);
}

function onBarClick(event: MouseEvent) {
  const bar = event.currentTarget as HTMLElement;
  const rect = bar.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const ratio = clickX / rect.width;
  const newTime = props.duration * ratio;
  emit("seek", newTime);
}
</script>

<style scoped>
.timeline-wrapper {
  margin-top: 12px;
  user-select: none;
  cursor: pointer;
}
.timeline {
  height: 20px;
  border-radius: 2px;
}
.timeline.bar {
  position: relative;
  background: #b9b9b9;
}

.timeline.indicator {
  position: relative;
  top: -20px;
  width: 4px;
  border: 1px solid;
  border-radius: 0px;
  transform: translateX(-50%);
  transition: left 0.2s;
}

.timeline.marker {
  position: absolute;
  top: -20px;
  transform: translate(0%, 100%);
  pointer-events: none;
}
.timeline-info {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  margin-top: 4px;
  color: #555;
}
</style>
