import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { type Program } from '@/components/types'

export const useProgramsStore = defineStore('programs', () => {
  const programs = ref<Program[]>()

  const selectOptionPrograms = computed(() => {
    return programs.value?.map((program: Program) => ({ label: program.name, ulid: program.ulid })) ?? []
  })


  function $reset() {
    programs.value = undefined
  }

  return {
    selectOptionPrograms,
    programs,
    $reset,
  }
})
