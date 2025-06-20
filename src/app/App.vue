<script setup lang="ts">
import '@/assets/styles/style.css'

import MagicList from '@/components/MagicList.vue'
import InputSelect from '@/components/Select.vue'
import Sidebar from '@/components/Sidebar.vue'
import DialogPDFPreview from '@/components/DialogPDFPreview.vue'
import { useMagic } from '@/app/useMagic'
import { ref } from 'vue'
import { generatePDF } from '@/app/pdf'
import { Escolas, RpgClasses, type Magia } from '@/types'

const previewOpened = ref(false)
const sidebarOpened = ref(false)

const { selectedMagics, selectedClass, selectedSchool, library } = useMagic()
const pdfData = ref('')

const classOptions = [
  { label: 'Todas classes', value: '-' },
  ...RpgClasses.map((item: string) => ({ label: item, value: item })),
]

const schoolOptions = [
  { label: 'Todas escolas', value: '-' },
  ...Escolas.map((item: string) => ({ label: item, value: item })),
]

const clearList = () => {
  selectedMagics.value = []
}

const handlePDF = async () => {
  if (selectedMagics.value.length == 0) {
    alert('Selecione as magias primeiro!')
    return
  }

  // const magics = library.value.map((item) => item.selecteds).flat()

  pdfData.value = await generatePDF(library.value)
  previewOpened.value = true
}

const selectAll = (nivel: { magics: Magia[] }) => {
  const set = new Set<string>()

  nivel.magics.forEach((magia: Magia) => set.add(magia.Titulo))
  selectedMagics.value.forEach((titulo: string) => set.add(titulo))

  selectedMagics.value = [...set]
}

const clearAll = (nivel: { magics: Magia[] }) => {
  const titles = nivel.magics.map((magia) => magia.Titulo)

  selectedMagics.value = selectedMagics.value.filter((titulo: string) => !titles.includes(titulo))
}

selectedMagics.value.push(library.value[0].magics[0].Titulo)
selectedMagics.value.push(library.value[0].magics[1].Titulo)
selectedMagics.value.push(library.value[0].magics[2].Titulo)
selectedMagics.value.push(library.value[0].magics[3].Titulo)
selectedMagics.value.push(library.value[0].magics[4].Titulo)
</script>

<template>
  <div class="magicsGrid">
    <section class="article">
      <h1>Magias</h1>

      <DialogPDFPreview :data="pdfData" v-model="previewOpened" />

      <div>
        <div class="page__filterPanel">
          <InputSelect
            v-model="selectedClass"
            name="class"
            :items="classOptions"
            placeholder="Filtrar por classe"
          />

          <InputSelect
            v-model="selectedSchool"
            name="school"
            :items="schoolOptions"
            placeholder="Filtrar por escola"
          />

          <button type="button" class="button" @click="handlePDF">Gerar PDF</button>
          <button
            type="button"
            class="page__buttonSelecteds button isOutline"
            @click="sidebarOpened = true"
          >
            Ver Selecionados
          </button>
        </div>

        <div>
          <div class="magicsList">
            <MagicList
              :label="magicNivel.title"
              v-model="selectedMagics"
              :magics="magicNivel.magics"
              v-for="magicNivel in library"
              :key="magicNivel.title"
              @all="selectAll(magicNivel)"
              @clear="clearAll(magicNivel)"
            />
          </div>
        </div>
      </div>
    </section>

    <Sidebar :selectedMagics :library v-model="sidebarOpened" @clear="clearList" />
  </div>
</template>

<style scoped>
.magicsGrid {
  display: grid;
  justify-content: center;
  grid-template-columns: 1fr 300px;
  gap: 40px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
}

.article {
  padding-inline: 20px;
  max-width: 980px;
  width: 100%;
  margin-inline: auto;
  padding-top: 20px;
  padding-bottom: 100px;
  overflow: hidden;
}

.page__filterPanel {
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;

  select {
    width: auto;
  }
}

.page__buttonSelecteds {
  @media (min-width: 601px) {
    display: none;
  }
}

.debug {
  position: fixed;
  z-index: 1;
  left: 20px;
  bottom: 40px;
  width: 600px;
  font-size: 11px;

  text-overflow: ellipsis;
  overflow: auto;
  height: 100px;
  background-color: white;
  border-radius: 4px;
  padding: 10px;
}
</style>
