<template>
    <div class="border pa-4">
        <h3>Preview</h3>
        <template v-if="player.selectedHighlights.length === 0">
            尚未選擇片段
            <v-skeleton-loader
              boilerplate
              type="image"
              class="ma-4"
            />
        </template>
        <template v-else>
            <div style="position: relative;">
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
                <div v-if="currentSentence" style="position: absolute; left: 0; bottom: 0; translate: (-50%, 0%); font-size: 10px; font-weight: 300;">
                   {{ currentSentence.text }}
                </div> 
            </div>
            <Video-Timeline
                :currentTime="currentTime"
                :duration="videoRef?.duration || 0"
                :highlights="player.selectedHighlights"
                :clipDuration="5" 
                @seek="onSeek" >
            </Video-Timeline>
            <v-btn icon="mdi-chevron-double-left" @click="goToPrevious"></v-btn>
            <v-btn :icon="isPlaying ? 'mdi-pause' : 'mdi-play'" @click="togglePlayPause"></v-btn>
            <v-btn icon="mdi-chevron-double-right" @click="goToNext"></v-btn>
            <!-- <p>⏱ 當前播放時間：{{ currentTime }} 秒</p> -->
        </template>
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
import { ref, watch, watchEffect, onMounted, onUnmounted, defineProps } from 'vue'
import { storeToRefs } from 'pinia'
import { usePlayerStore } from '@/stores/player'

defineProps({
    videoUrl: {
        type: String
    }
})

const player = usePlayerStore()
const { currentId } = storeToRefs(player)

const videoRef = ref(null)
const currentTime = ref(0)
const currentSentence = ref(null)
const isPlaying = ref(false)
const clipDuration = 5 // 每段播放 5 秒

const currentIndex = ref(0)

function togglePlayPause() {
  if (!videoRef.value) return

  if (videoRef.value.paused) {
    videoRef.value.play()
    isPlaying.value = true
  } else {
    videoRef.value.pause()
    isPlaying.value = false
  }
}

// 跳轉到某一個 highlight
function goToHighlightById(id) {
    const index = player.selectedHighlights.findIndex(h => h.id === id)
    if (index === -1) return

    const target = player.selectedHighlights[index]
    currentIndex.value = index

    if (videoRef.value) {
        videoRef.value.currentTime = target.time
    }
}

// 跳轉上一段
function goToPrevious() {
    if (player.selectedHighlights.length === 0 || currentId.value == null) return

    const index = player.selectedHighlights.findIndex(h => h.id === currentId.value)
    if (index === -1) return

    const prevIndex = index === 0 ? player.selectedHighlights.length - 1 : index - 1
    const prevHighlight = player.selectedHighlights[prevIndex]
    player.setCurrentId(prevHighlight.id)
}

// 跳轉下一段
function goToNext() {
    if (player.selectedHighlights.length === 0 || currentId.value == null) return

    const index = player.selectedHighlights.findIndex(h => h.id === currentId.value)
    if (index === -1) return

    const nextIndex = (index + 1) % player.selectedHighlights.length
    const nextHighlight = player.selectedHighlights[nextIndex]
    player.setCurrentId(nextHighlight.id)
}

function updateCurrentTime() {
    if (!videoRef.value) return

    currentTime.value = videoRef.value.currentTime

    const match = player.selectedHighlights.find(
        (clip) =>
        currentTime.value >= clip.time &&
        currentTime.value < clip.time + clipDuration
    )

    if (match) {
        currentSentence.value = match
        if (currentId.value !== match.id) {
            player.setCurrentId(match.id)
        }
    } else {
        currentSentence.value = null
    }

    // 若超過 clip 時間，播放下一段
    const currentClip = player.selectedHighlights.find(c => c.id === currentId.value)
    if (currentClip && currentTime.value >= currentClip.time + clipDuration) {
        const currentIdx = player.selectedHighlights.findIndex(c => c.id === currentId.value)
        const nextIdx = (currentIdx + 1) % player.selectedHighlights.length
        const nextClip = player.selectedHighlights[nextIdx]
        if(currentIdx === nextIdx){
            videoRef.value.currentTime = currentClip.time
        } else{
            player.setCurrentId(nextClip.id)
        }
    }
}

// 取得目前播放時間對應的句子
watch(currentTime, (time) => {
  const index = player.selectedHighlights.findIndex(
    (clip) => time >= clip.time && time <= clip.time + clipDuration
  )
  if (index !== -1) {
    currentSentence.value = player.selectedHighlights[index]
    currentIndex.value = index
  } else {
    currentSentence.value = null
  }
})

watch(currentId, (id) =>{
    goToHighlightById(id)
})

watchEffect(() => {
  const highlights = player.selectedHighlights
  if (!videoRef.value) return

  if (highlights.length === 0) {
    currentTime.value = null
    videoRef.value.pause()
    isPlaying.value = false
    player.setCurrentId(null)
  } else if (highlights.length === 1 || !highlights.some(h => h.id === currentId.value)) {
    player.setCurrentId(highlights[0].id)
  }
})

function onSeek(time: number) {
  if (videoRef.value) {
    videoRef.value.currentTime = time
  }
}

</script>
