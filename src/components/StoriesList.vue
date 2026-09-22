<script lang="ts" setup>
  import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
  import IconSpinner from '@primeicons/vue/spinner'
  import StoryCard from '@/components/StoryCard.vue'
  import { useStoriesStore } from '@/stores/stories'

  const storiesStore = useStoriesStore()
  const sentinel = ref<HTMLElement | null>(null)
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && storiesStore.hasMore && !storiesStore.loadingMore) {
          storiesStore.loadMore()
        }
      },
      { rootMargin: '200px' }
    )
  })

  watch(sentinel, (newSentinel, oldSentinel) => {
    if (observer && oldSentinel) {
      observer.unobserve(oldSentinel)
    }

    if (observer && newSentinel) {
      observer.observe(newSentinel)
    }
  })

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
    }
  })

  const filteredStoriesCount = computed(() =>
    storiesStore.filteredStoriesCount === 1 ? '1 story' : `${storiesStore.filteredStoriesCount} stories`
  )
</script>

<template>
  <p class="typography-sm pb-4 leading-[1.5rem] text-gray-600">{{ filteredStoriesCount }}</p>
  <div class="grid grid-cols-2 content-start gap-4 xl:grid-cols-3 2xl:grid-cols-4">
    <StoryCard v-for="story in storiesStore.stories" :key="story.ulid" :story="story" />
  </div>
  <div
    v-if="storiesStore.hasMore"
    ref="sentinel"
    class="flex h-[96px] flex-col items-center justify-center text-center">
    <IconSpinner v-if="storiesStore.loadingMore" />
    <p v-else class="text-xs text-gray-400">Scroll for more</p>
  </div>
</template>
