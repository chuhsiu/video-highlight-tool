<template>
  <v-container>
    <v-row>
      <v-col>
        <v-file-upload
          v-model=videoFile
          accept="video/*" 
          @change="handleUpload"
          clearable 
          density="comfortable" 
          variant="comfortable">
        </v-file-upload>
      </v-col>
        <v-col >
        <div class="border pa-4 bg-surface">
          <h3>Preview</h3>
          <video v-if="videoPreviewUrl"
            :src="videoPreviewUrl"
            class="video-player mt-4"
            controls>
            <source type="video/*"/>
                The browser doesn't support HTML5 video.
          </video>
          <template v-else>
            <p class="mt-2 text-grey-darken-3">No video now.</p>
            <v-skeleton-loader
              boilerplate
              type="image"
              class="my-4"
            />
          </template>
        </div>
      </v-col>
    </v-row>
    <v-row v-if="videoPreviewUrl" class="d-flex justify-center">
      <v-btn @click="goToEdit" color="success">
          Generate
        </v-btn>
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
  const file = e.target.files[0]
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
