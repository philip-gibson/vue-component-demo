<script lang="ts" setup>
  import BaseCard from '@/components/BaseCard.vue'
  import InputDateRange from '@/components/InputDateRange.vue'
  import InputCheckbox from '@/components/InputCheckbox.vue'
  import InputText from '@/components/InputText.vue'
  import LayoutBackground from '@/layouts/LayoutBackground.vue'
  import LayoutInputs from '@/layouts/LayoutInputs.vue'

  const someSelected = true
</script>

<template>
  <LayoutBackground>
    <LayoutInputs>
      <template #header>
        <h1 class="typography-2xl font-bold">Form Validation and Custom Inputs</h1>
      </template>
      <template #main>
        <BaseCard shadow border rounded>
          <InputText id="fullName" name="fullName" placeholder="Full name" validate-on-keypress>
            <template #label>Full Name</template>
          </InputText>
          <InputCheckbox id="selectAll" :indeterminate="someSelected" class="p-[1rem] pl-[3.5rem]" name="selectAll" />
          <InputDateRange name="reportingPeriod">
            <template #label>Reporting period</template>
          </InputDateRange>
        </BaseCard>
      </template>
    </LayoutInputs>
  </LayoutBackground>
</template>
