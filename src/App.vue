<script setup>
import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import truques from "./magias/truques";
import nivel1 from "./magias/nivel1";
import { ref, computed } from "vue";
import MagicList from "./components/MagicList.vue";
import InputSelect from "./components/Select.vue";

const selectedMagics = ref([]);
const selectedClass = ref("");
const classes = [
  // "Barbáro",
  "Bardo",
  "Bruxa",
  "Clériga",
  "Druida",
  "Feiticeira",
  // "Guerreiro",
  "Ladino",
  "Paladina",
  "Patrulheiro",
  "Mago",
  // "Monge",
];
const classOptions = [
  { label: "Todas classes", value: "-" },
  ...classes.map((item) => ({ label: item, value: item })),
];

const FONT_SIZES = {
  MINOR: 10,
  BASE: 12,
  TITLE: 18,
};

async function generatePDF() {
  if (selectedMagics.value.length == 0) {
    alert("Selecione as magias primeiro!");
    return;
  }

  const fontGothamBlack = await fetch("/fonts/Gotham-Black.otf").then((res) =>
    res.arrayBuffer()
  );
  const fontGaramond = await fetch("/fonts/EBGaramond-Regular.ttf").then(
    (res) => res.arrayBuffer()
  );

  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  const baseFont = await pdfDoc.embedFont(fontGaramond);
  const baseFontBold = await pdfDoc.embedFont(fontGothamBlack);

  const page = pdfDoc.addPage();

  const FontSet = {
    Title: {
      font: baseFontBold,
      size: FONT_SIZES.TITLE,
    },
    Base: {
      font: baseFont,
      size: FONT_SIZES.BASE,
      lineHeight: FONT_SIZES.BASE * 1.1,
    },
    Minor: {
      font: baseFontBold,
      lineHeight: FONT_SIZES.BASE * 1.1,
      size: FONT_SIZES.MINOR,
    },
  };

  const magicsFiltered = [
    ...truques.filter((i) => selectedMagics.value.includes(i.Titulo)),
    ...nivel1.filter((i) => selectedMagics.value.includes(i.Titulo)),
  ];

  drawPDF(page, pdfDoc, magicsFiltered, FontSet);

  const pdfBytes = await pdfDoc.save();
  var bytes = new Uint8Array(pdfBytes); // pass your byte response to this constructor
  var blob = new Blob([bytes], { type: "application/pdf" }); // change resultByte to bytes

  var link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.target = "__blank";
  link.download = "Magias.pdf";
  link.click();
}

function breakTextInLines(baseText, baseFont, maxWidth) {
  const parts = baseText.split(" ");
  let lines = 1;

  let bufferText = "";
  let finalText = "";
  let textWidth = 0;

  for (const part of parts) {
    const breakLines = (part.match(/\n/g) || []).length;

    if (breakLines) {
      lines += breakLines;
      finalText += bufferText + part;
      bufferText = " ";
      continue;
    }

    const temp = bufferText + part;
    textWidth = baseFont.widthOfTextAtSize(temp, FONT_SIZES.BASE);

    if (textWidth < maxWidth) {
      bufferText += part + " ";
    } else {
      lines += 1;
      finalText += bufferText + "\n";
      bufferText = part + " ";
    }
  }

  finalText += bufferText;

  return { text: finalText, lines };
}

function drawPDF(page, pdfDoc, magics, FontSet) {
  const { width, height } = page.getSize();

  page.moveTo(40, height - 4 * FONT_SIZES.BASE);

  for (let index = 0; index < magics.length; index++) {
    const magia = magics[index];

    const head =
      `T.Conj: ${magia.TempoConj} | ` +
      `Alcance: ${magia.Alcance} | ` +
      `Componentes: ${magia.Componentes} | ` +
      `Duração: ${magia.Duracao}`;

    const maxWidth = width - 10 - 8 * FONT_SIZES.BASE;
    const prepText = breakTextInLines(
      magia.Descricao,
      FontSet.Base.font,
      maxWidth
    );

    // #region NEW PAGE
    const linesHeight = prepText.lines * FONT_SIZES.BASE;
    const measureHeight = linesHeight + FONT_SIZES.TITLE * 3;

    if (page.getPosition().y - measureHeight < 50) {
      const newPage = pdfDoc.addPage();
      const newMagias = magics.slice(index);

      if (newMagias.length > 0) {
        drawPDF(newPage, pdfDoc, newMagias, FontSet);
      }
      return;
    }
    // #endregion

    // Title
    page.drawText(magia.Titulo, FontSet.Title);
    page.moveDown(FONT_SIZES.TITLE);

    // Head
    page.drawText(head, FontSet.Minor);
    page.moveDown(FONT_SIZES.BASE * 1.5);

    // Description
    page.drawText(prepText.text, FontSet.Base);
    page.moveDown((prepText.lines + 1) * FONT_SIZES.BASE);

    // Material
    if (magia.Material) {
      const prefix = "Material: ";
      const paddRight =
        FontSet.Base.font.widthOfTextAtSize(prefix, FONT_SIZES.BASE) + 6;
      page.drawText(prefix, { ...FontSet.Minor, font: FontSet.Title.font });
      page.moveRight(paddRight);
      page.drawText(magia.Material, FontSet.Base);
      page.moveLeft(paddRight);

      page.moveDown(FONT_SIZES.MINOR);
    }

    // Escola
    const pos = page.getPosition();
    page.drawText(magia.Escola.toUpperCase(), {
      ...FontSet.Minor,
      rotate: degrees(90),
      opacity: 0.5,
      x: pos.x - 10,
      y: pos.y + (magia.Material ? 10 : 16),
    });

    page.moveDown(FONT_SIZES.TITLE * 2);
  }
}

const allMagics = computed(() => {
  let truquesFil = truques;
  let nivel1Fil = nivel1;

  if (selectedClass.value && selectedClass.value != "-") {
    const fnFilter = (i) => i.Classes.includes(selectedClass.value);
    truquesFil = truques.filter(fnFilter);
    nivel1Fil = nivel1.filter(fnFilter);
  }

  const fnSelected = (i) => selectedMagics.value.includes(i.Titulo);

  return [
    {
      title: "Truques",
      magics: truquesFil,
      selecteds: truques.filter(fnSelected),
    },
    {
      title: "Nivel 1°",
      magics: nivel1Fil,
      selecteds: nivel1.filter(fnSelected),
    },
  ];
});
</script>

<template>
  <section class="article">
    <h1>Magias</h1>

    <div>
      <div class="page__filterPanel">
        <InputSelect
          v-model="selectedClass"
          :items="classOptions"
          placeholder="Filtrar por classe"
        />
        <button type="button" class="button" @click="generatePDF">
          Gerar PDF
        </button>
        <button
          type="button"
          class="page__buttonSelecteds button isOutline"
          onclick="magicsSidebar.showModal()"
        >
          Ver Selecionados
        </button>
      </div>

      <div class="magicsGrid">
        <div class="magicsList">
          <MagicList
            :label="magicNivel.title"
            v-model="selectedMagics"
            :magics="magicNivel.magics"
            v-for="magicNivel in allMagics"
            :key="magicNivel.label"
          />
        </div>

        <dialog id="magicsSidebar" class="magicsSidebar">
          <!-- <button
            class="magicsSidebar__buttonClose"
            type="button"
            onclick="magicsSidebar.close()"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button> -->
          <div class="magicsSidebar__wrap">
            <h2>Selecionados:</h2>
            <template v-for="magicNivel in allMagics" :key="magicNivel.label">
              <div v-if="magicNivel.selecteds.length > 0">
                <h3>{{ magicNivel.title }}</h3>
                <div v-for="magic in magicNivel.selecteds" :key="magic.Titulo">
                  {{ magic.Titulo }}
                </div>
              </div>
            </template>
          </div>
        </dialog>
      </div>
    </div>
  </section>
</template>

<style scoped>
.article {
  max-width: 1280px;
  width: 100%;
  margin-inline: auto;
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

.magicsGrid {
  display: grid;
  grid-template-columns: 1fr 250px;
  gap: 20px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
}

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
    position: static;
    display: flex;
    width: 100%;
    height: 100%;
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

.magicsSidebar__buttonClose {
  position: absolute;
  right: 10px;
  top: 10px;
  background-color: none;
  border: 0;
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
