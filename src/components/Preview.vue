<script setup lang="ts">
import { useTemplateRef, watch } from "vue";

interface Props {
  data: string;
}

defineProps<Props>();
const preview = useTemplateRef("preview");
const model = defineModel<boolean>();

watch(model, () => {
  if (model.value) {
    preview.value?.showModal();
  } else {
    preview.value?.close();
  }
});

const handleClose = () => {
  preview.value?.close();
  setTimeout(() => {
    model.value = false;
  }, 500);
};
</script>

<template>
  <dialog id="pdfPreview" ref="preview" class="preview" @close="handleClose">
    <object class="pdf" :data="data" width="100%" height="100%"></object>
  </dialog>
</template>

<style>
.preview {
  margin: auto;
  border: 0;
  border-radius: 4px;
  width: calc(100% - 80px);
  height: calc(100vh - 40px);
  margin: auto;
  padding: 10px 20px 20px;
  box-shadow: var(--lightDropShadow);
  transition: opacity 0.5s ease-in-out, translate 0.5s ease-in-out,
    rotate 0.5s ease-in-out, overlay 0.5s allow-discrete,
    display 0.5s allow-discrete;

  /* Close state */
  opacity: 0;
  translate: 0 50%;

  /* Idle State */
  &[open] {
    opacity: 1;
    translate: 0 0;
  }

  &::backdrop {
    transition: display 0.5s allow-discrete, overlay 0.5s allow-discrete,
      background-color 0.5s;
    background-color: hsl(0 0 0 / 0);
  }

  &[open]::backdrop {
    background-color: hsl(0 0 0 / 50%);
  }
}

@starting-style {
  /* Start State */
  .preview {
    &[open] {
      opacity: 0;
      translate: 0 50%;
    }

    &::backdrop {
      background-color: hsl(0 0 0 / 50%);
    }
  }
}
</style>
