<template>
  <div class="h-full w-full">
    <div class="flex h-[4rem] bg-white p-4">
      <div class="flex items-center gap-2">
        <slot name="actions-top-left"></slot>
      </div>
      <div class="flex grow justify-end gap-4">
        <slot name="actions-top-right"></slot>
      </div>
    </div>
    <div class="flex h-[4rem] border-b border-t border-gray-200 bg-white">
      <div class="flex w-[17.75rem] items-center justify-between p-4">
        <slot name="clear-filters"></slot>
      </div>
      <div class="flex grow items-center justify-end gap-4 px-4">
        <slot name="search-sort"></slot>
      </div>
    </div>

    <div class="flex h-[calc(100%-8rem)] overflow-hidden">
      <!-- filters -->
      <div
        class="flex w-[17.75rem] shrink-0 flex-col overflow-y-auto bg-white pl-4 pr-1"
        style="scrollbar-gutter: stable">
        <slot name="filters"></slot>
      </div>
      <!-- main -->
      <div class="flex min-h-0 grow flex-col">
        <template v-if="$slots['filter-params']">
          <div class="flex w-full flex-col border-b border-gray-200 bg-white p-4">
            <slot name="filter-params"></slot>
          </div>
        </template>
        <div class="flex min-h-0 flex-1 flex-col overflow-y-auto border-l border-gray-100 p-4">
          <!-- zero-state -->
          <template v-if="$slots['zero-state']">
            <div class="flex h-full w-full flex-col items-start justify-start">
              <slot name="zero-state"></slot>
            </div>
          </template>
          <!-- stories -->
          <template v-if="$slots['stories']">
            <div class="pb-6">
              <slot name="stories"></slot>
            </div>
          </template>
          <!-- no filtered stories -->
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
