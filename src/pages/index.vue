<template>
  <v-container>
    <v-row>
      <v-col>
        <v-file-upload
          v-model=videoFile
          accept="video/*" 
          @change="handleUpload"
          clearable 
          density="compact" 
          variant="compact">
        </v-file-upload>
        <v-btn v-if="videoPreviewUrl" @click="goToEdit">
          Generate
        </v-btn>
      </v-col>
        <v-col >
        <div class="border pa-4">
          <h3>Preview</h3>
          <video v-if="videoPreviewUrl"
            :src="videoPreviewUrl"
            class="video-player"
            controls>
            <source type="video/*"/>
                The browser doesn't support HTML5 video.
          </video>
          <template v-else>
            <v-skeleton-loader
              boilerplate
              type="image"
              class="ma-4"
            />
          </template>
        </div>
      </v-col>
    </v-row>
  </v-container>

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
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useVideoStore } from '@/stores/video'

const videoStore = useVideoStore()
const router = useRouter()

const videoFile = ref<File | null>(null)
const videoPreviewUrl = ref<string | null>(null)

function handleUpload(e){
  const file = event.target.files[0]
  if (!file) return

  videoFile.value = file
  const url = URL.createObjectURL(file)
  videoPreviewUrl.value = url

  const tempVideo = document.createElement('video')
  tempVideo.preload = 'metadata'
  tempVideo.src = url

  tempVideo.onloadedmetadata = async () => {
    const duration = tempVideo.duration
    videoStore.setVideoInfo(url, duration)
  }
}

watch(videoFile, (newVal) => {
  if (!newVal) {
    videoStore.resetVideo()
    videoPreviewUrl.value = null
  }
}, {deep: true})

function goToEdit() {
  router.push('/edit')
}
</script>
