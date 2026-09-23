<script lang="ts" setup>
  import Card from 'primevue/card'
  import Checkbox from 'primevue/checkbox'
  import { computed, useCssModule } from 'vue'
  import StarFill from '@primeicons/vue/star-fill'
  import { useEventsStore } from '@/stores/events'
  import { RATINGS, type Event } from '@/components/types'
  import EventTags from '@/components/EventTags.vue'
  import { formatDate } from '@/utils/formatDate'

  const props = defineProps<{
    event: Event
  }>()

  const eventsStore = useEventsStore()

  const classes = useCssModule()

  const isSelected = computed(() => eventsStore.selectedEventIds.includes(props.event.ulid))

  const contentPlain = computed(
    () => `<pre class="${classes['content-plain']}">${props.event.contentPlain}</pre>`,
  )

  const rating = computed(() =>
    RATINGS.find((item) => item.value === props.event.rating),
  )

  const starCount = computed(() =>
    props.event.rating === 'none'
      ? 0
      : RATINGS.findIndex((item) => item.value === props.event.rating),
  )

  const handleClickCard = async () => {
    try {
      eventsStore.currentEvent = undefined
      // await eventsStore.fetchEvent(props.event.ulid)
      eventsStore.showEventCardExpanded = true
    } catch (error) {
      console.error('Error editing event:', error)
    }
  }
</script>

<template>
  <Card
    :pt="{
      body: '!p-8 max-h-[22rem]',
      content: 'p-0',
      root: isSelected ? '!shadow-none' : '',
    }"
    :class="[
      'group/eventCard flex-auto transition-colors duration-300 ease-out hover:cursor-pointer',
      isSelected ? 'bg-blue-50 ring-2 ring-blue-400' : 'bg-white hover:bg-blue-25',
    ]"
    @click="handleClickCard">
    <template #content>
      <div class="flex h-[16.5rem] flex-col justify-start">
        <div class="flex items-center justify-between">
          <div class="flex items-center justify-start gap-[0.25rem]" :aria-label="rating?.label">
            <template v-if="starCount > 0">
              <StarFill
                v-for="star in starCount"
                :key="star"
                size="14"
                color="var(--p-amber-400)" />
            </template>
            <p v-else class="typography-sm !leading-[1.125rem] text-gray-400 italic">Not Rated</p>
          </div>
          <Checkbox
            v-model="eventsStore.selectedEventIds"
            :input-id="event.ulid"
            :value="event.ulid"
            :class="[
              'transition-opacity duration-300 ease-out',
              isSelected
                ? 'opacity-100'
                : 'opacity-0 group-hover/eventCard:opacity-100',
            ]"
            @click.stop />
        </div>
        <div class="h-[4rem]">
          <h3
            v-if="event.title"
            class="typography-lg !leading-[1.5rem] line-clamp-2 font-semibold text-gray-900 mt-[0.75rem]"
            :title="event.title">
            {{ event.title }}
          </h3>
        </div>

        <div class="mt-[0.25rem] mb-[0.75rem]">
          <p class="typography-xs leading-[1rem] text-gray-500">
            {{ formatDate(event.eventDate, 'MMM DD, YYYY') }}
          </p>
        </div>

        <div class="grow mb-[0.25rem]" v-html="contentPlain"></div>

        <EventTags :eventTypes="event.eventTypes" />
      </div>
    </template>
  </Card>
</template>

<style module>
  .content-plain {
    overflow: hidden;
    overflow-wrap: break-word;
    text-wrap: wrap;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    line-clamp: 5;
    -webkit-line-clamp: 5;
    color: #6b7280;
    font-family: Inter, Arial, sans-serif;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5rem;
  }
</style>
