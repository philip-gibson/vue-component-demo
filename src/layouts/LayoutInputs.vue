<template>
  <div class="flex flex-col h-full w-full">
    <div class="w-full h-[8rem] flex justify-center items-center">
      <slot name="header" />
    </div>
    <div class="mx-[6rem]">
      <slot name="main" />
    </div>
  </div>
</template>
