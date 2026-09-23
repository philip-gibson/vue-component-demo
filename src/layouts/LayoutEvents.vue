<template>
  <div class="h-full w-full">
    <div class="flex h-[4rem] bg-white dark:bg-black p-[1rem]">
      <div class="flex items-center gap-[0.5rem]">
        <slot name="actions-top-left"></slot>
      </div>
      <div class="flex grow justify-end gap-[1rem]">
        <slot name="actions-top-right"></slot>
      </div>
    </div>
    <div class="flex h-[4rem] border-b border-t border-gray-200 bg-white dark:bg-gray-800">
      <div class="flex w-[17.75rem] items-center justify-between p-[1rem]">
        <slot name="clear-filters"></slot>
      </div>
      <div class="flex grow items-center justify-end gap-[1rem] px-[1rem]">
        <slot name="search-sort"></slot>
      </div>
    </div>

    <div class="flex h-[calc(100%-8rem)] overflow-hidden">
      <!-- filters -->
      <div
        class="flex w-[17.75rem] shrink-0 flex-col overflow-y-auto bg-white pl-[1rem] pr-[0.5rem] dark:bg-gray-800"
        style="scrollbar-gutter: stable; scrollbar-width: none; -ms-overflow-style: none;">
        <slot name="filters"></slot>
      </div>
      <!-- main -->
      <div class="flex min-h-0 grow flex-col">
        <template v-if="$slots['filter-params']">
          <div class="flex w-full flex-col border-b border-gray-200 bg-white dark:bg-gray-800 p-[1rem]">
            <slot name="filter-params"></slot>
          </div>
        </template>
        <div class="flex min-h-0 flex-1 flex-col overflow-y-auto border-l border-gray-100 p-[1rem]">
          <!-- zero-state -->
          <template v-if="$slots['zero-state']">
            <div class="flex h-full w-full flex-col items-start justify-start">
              <slot name="zero-state"></slot>
            </div>
          </template>
          <!-- events -->
          <template v-if="$slots['events']">
            <div class="pb-[1.5rem]">
              <slot name="events"></slot>
            </div>
          </template>
          <!-- no filtered events -->
          <template v-if="$slots['no-search-results']">
            <div class="flex h-full w-full flex-col items-center justify-start">
              <slot name="no-search-results"></slot>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
