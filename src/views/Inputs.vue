<script lang="ts" setup>
  import InputDateRange from '@/components/InputDateRange.vue'
  import InputCheckbox from '@/components/InputCheckbox.vue'
  import InputText from '@/components/InputText.vue'

  const someSelected = true
</script>

<template>
  <div class="m-[6rem] p-[1rem] border border-slate-300">
    <InputText id="fullName" name="fullName" placeholder="Full name" validate-on-keypress>
      <template #label>Full Name</template>
    </InputText>
    <InputCheckbox id="selectAll" :indeterminate="someSelected" class="p-[1rem] pl-[3.5rem]" name="selectAll" />
    <InputDateRange name="reportingPeriod">
      <template #label>Reporting period</template>
    </InputDateRange>
  </div>
</template>
