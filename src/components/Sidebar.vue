<script setup lang="ts">
import type { LibraryMagic } from '@/types'
import { useTemplateRef, watch } from 'vue'
import { FiX } from 'vue-icons-plus/fi'

type Props = {
  magics: LibraryMagic[]
  selectedMagics: string[]
}

defineOptions({ name: 'Sidebar' })

defineProps<Props>()

defineEmits(['clear'])

const isOpened = defineModel({ required: true })
const dialog = useTemplateRef('magicsSidebar')

watch(isOpened, () => {
  if (isOpened.value) {
    dialog.value?.showModal()
  } else {
    dialog.value?.close()
  }
})

const close = () => {
  isOpened.value = false
}
</script>

<template>
  <dialog id="magicsSidebar" class="magicsSidebar" ref="magicsSidebar" @close="close">
    <button class="magicsSidebar__buttonClose" type="button" @click="close">
      <FiX />
    </button>
    <div class="magicsSidebar__wrap">
      <h2>Selecionados:</h2>

      <Transition mode="out-in" style="--easing: ease-in-out; --timing: 0.25s">
        <div style="color: gray" v-if="selectedMagics.length === 0">Nenhuma magia selecionada.</div>

        <div class="magicsSidebar__wrapIn" v-else>
          <div>
            <button type="button" class="button isSmall isOption" @click="$emit('clear')">
              Limpar lista
            </button>
          </div>

          <template v-for="magicNivel in magics" :key="magicNivel.title">
            <div v-if="magicNivel.selecteds.length > 0">
              <h3>{{ magicNivel.title }}</h3>
              <div v-for="magic in magicNivel.selecteds" :key="magic.Titulo">
                {{ magic.Titulo }}
              </div>
            </div>
          </template>
        </div>
      </Transition>
    </div>
  </dialog>
</template>

<style scoped>
.magicsSidebar {
  border-radius: 4px;
  background-color: #2a3140;
  color: white;
  max-height: 600px;
  padding: 10px 2px 0 10px;

  h2 {
    margin-inline: 0;
    margin-block: 4px;
  }

  &[open] {
    left: 50%;
    top: 50%;
    translate: -50% -50%;
    height: 100%;
    max-width: 400px;
    width: 100%;
    padding: 16px 2px 0 20px;

    @media (max-width: 420px) {
      max-width: 100%;
      max-height: 100%;
      width: calc(100% - 60px);
      height: calc(100% - 60px);
    }
  }

  @media (min-width: 601px) {
    display: flex;
    position: fixed;
    right: 0;
    width: 300px;
    left: auto;
    top: 0;
    height: 100vh;
    max-height: unset;
    padding: 20px;
    border-left: 8px solid var(--textGrey);
    border-top: 0;
    border-bottom: 0;
  }
}

.magicsSidebar__wrap {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-bottom: 10px;
  width: 100%;

  overflow: auto;
  /* max-height: 100%; */
  scrollbar-width: thin;
  scrollbar-color: white #2a3140;
}

.magicsSidebar__wrapIn {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.magicsSidebar__buttonClose {
  position: absolute;
  right: 10px;
  top: 10px;
  background-color: none;
  border: 0;
  display: none;
  border-radius: 4px;
  width: 24px;
  height: 24px;
  padding: 0;
}

.magicsSidebar[open] .magicsSidebar__buttonClose {
  display: block;
}
</style>
