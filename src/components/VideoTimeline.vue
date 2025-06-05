<!-- components/VideoTimeline.vue -->
<template>
    <div class="timeline-wrapper" @click="onBarClick($event)">
      <div class="timeline-bar">
        <!-- <div class="timeline-progress" :style="{ width: progressPercentage + '%' }"></div> -->
        <div
        v-for="highlight in highlights"
        :key="highlight.id"
        class="timeline-marker"
        :style="{
          left: getPercentage(highlight.time) + '%',
          width: getClipWidth() + '%'
        }"
      ></div>
      </div>
      <div class="timeline-indicator" :style="{ left: progressPercentage + '%' }"></div>
      <div class="timeline-info">
        <span>{{ formatTime(currentTime) }}</span>
        <span>{{ formatTime(duration) }}</span>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed, defineEmits, defineProps } from 'vue'
  
  const props = defineProps<{
    currentTime: number
    duration: number
    highlights: { id: number; time: number; text: string }[]
    clipDuration: number
  }>()
  
  const emit = defineEmits<{
    (e: 'seek', time: number): void
  }>()
  
  const progressPercentage = computed(() => {
    if (!props.duration) return 0
    return (props.currentTime / props.duration) * 100
  })
  
  function formatTime(sec: number) {
    const minutes = Math.floor(sec / 60)
    const seconds = Math.floor(sec % 60)
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }
  function getPercentage(time: number) {
  return props.duration ? (time / props.duration) * 100 : 0
}

function getClipWidth() {
  return props.duration ? (props.clipDuration / props.duration) * 100 : 0
}

  
  function onBarClick(event: MouseEvent) {
    const bar = event.currentTarget as HTMLElement
    const rect = bar.getBoundingClientRect()
    const clickX = event.clientX - rect.left
    const ratio = clickX / rect.width
    const newTime = props.duration * ratio
    emit('seek', newTime)
  }
  </script>
  
  <style scoped>
  .timeline-wrapper {
    margin-top: 12px;
    user-select: none;
    cursor: pointer;
  }
  .timeline-bar {
    height: 8px;
    background: #ccc;
    position: relative;
  }
  /* .timeline-progress {
    height: 100%;
  } */
  .timeline-indicator {
    position: relative;
    top: -8px;
    width: 4px;
    border-right: 5px transparent;
    height: 8px;
    background-color: red;
    transform: translateX(-50%);
    transition: left 0.2s;
  }

.timeline-marker {
  position: absolute;
  top: -8px;
  height: 8px;
  background-color: #0d47a1;
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
  