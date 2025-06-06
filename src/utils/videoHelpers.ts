import type { Ref } from 'vue'
import type { Highlight } from '@/types'

/** 根據 ID 尋找片段 */
export function findClipById(highlights: Highlight[], id: number | null) {
  return id ? highlights.find(h => h.id === id) ?? null : null
}

/** 根據時間尋找當下應該顯示的片段 */
export function findCurrentClip(highlights: Highlight[], time: number, duration: number) {
  return highlights.find(h => time >= h.time && time < h.time + duration) ?? null
}

/** 根據 ID 找出索引位置 */
export function findClipIndex(highlights: Highlight[], id: number) {
  return highlights.findIndex(h => h.id === id)
}

/** 取得下一段的索引（循環） */
export function getNextIndex(currentIndex: number, total: number) {
  return (currentIndex + 1) % total
}

/** 取得上一段的索引（循環） */
export function getPreviousIndex(currentIndex: number, total: number) {
  return currentIndex <= 0 ? total - 1 : currentIndex - 1
}

/** 判斷片段是否播放完 */
export function isClipEnded(currentTime: number, clipStart: number, clipDuration: number) {
  return currentTime >= clipStart + clipDuration
}

/** 判斷是否為最後一個片段 */
export function isLastClip(index: number, total: number) {
  return index === total - 1
}

/** 判斷影片是否播完 */
export function isVideoEnded(currentTime: number, videoDuration: number) {
  return currentTime >= videoDuration
}

/** 取得影片 */
export function getVideo(videoRef: Ref<HTMLVideoElement | null>): HTMLVideoElement | null {
  return videoRef.value
}

/** 判斷影片是否播完 */
export function seekToTime(video: HTMLVideoElement | null, time: number) {
  if (video) video.currentTime = time
}

/** 開始播放影片 */
export function playVideo(video: HTMLVideoElement | null, isPlaying: Ref<boolean>) {
  if (video) {
    video.play()
    isPlaying.value = true
  }
}

/** 暫停播放影片 */
export function pauseVideo(video: HTMLVideoElement | null, isPlaying: Ref<boolean>) {
  if (video) {
    video.pause()
    isPlaying.value = false
  }
}