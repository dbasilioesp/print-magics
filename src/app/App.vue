<script setup>
import "@/assets/styles/style.css";

import MagicList from "@/components/MagicList.vue";
import InputSelect from "@/components/Select.vue";
import Sidebar from "@/components/Sidebar.vue";
import { useMagic, rpgClasses, schools } from "@/app/useMagic";
import { useTemplateRef } from "vue";
import { generatePDF } from "@/app/pdf";

const magicsSidebar = useTemplateRef("magicsSidebar");

const { selectedMagics, selectedClass, selectedSchool, allMagics } = useMagic();

const classOptions = [
  { label: "Todas classes", value: "-" },
  ...rpgClasses.map((item) => ({ label: item, value: item })),
];

const schoolOptions = [
  { label: "Todas escolas", value: "-" },
  ...schools.map((item) => ({ label: item, value: item })),
];

const clearList = () => {
  selectedMagics.value = [];
};

const handlePDF = () => {
  if (selectedMagics.value.length == 0) {
    alert("Selecione as magias primeiro!");
    return;
  }

  const magics = allMagics.value.map((item) => item.selecteds).flat();

  generatePDF(magics);
};
</script>

<template>
  <div class="magicsGrid">
    <section class="article">
      <h1>Magias</h1>

      <div>
        <div class="page__filterPanel">
          <InputSelect
            v-model="selectedClass"
            :items="classOptions"
            placeholder="Filtrar por classe"
          />

          <InputSelect
            v-model="selectedSchool"
            :items="schoolOptions"
            placeholder="Filtrar por escola"
          />

          <button type="button" class="button" @click="handlePDF">
            Gerar PDF
          </button>
          <button
            type="button"
            class="page__buttonSelecteds button isOutline"
            @click="magicsSidebar.showModal()"
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
              v-for="magicNivel in allMagics"
              :key="magicNivel.label"
            />
          </div>
        </div>
      </div>
    </section>

    <Sidebar
      :selectedMagics="selectedMagics"
      :magics="allMagics"
      @clear="clearList"
    />
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
