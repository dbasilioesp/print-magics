import { ref, computed } from "vue";
import { breakTextInLines } from "./utils";
import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import truques from "@/magias/truques";
import nivel1 from "@/magias/nivel1";

const FONT_SIZES = {
  MINOR: 10,
  BASE: 12,
  TITLE: 18,
};

const rpgClasses = [
  "Bardo",
  "Bruxa",
  "Clériga",
  "Druida",
  "Feiticeira",
  "Ladino",
  "Paladina",
  "Patrulheiro",
  "Mago",
];

export function useMagicPDF() {
  const selectedMagics = ref([]);
  const selectedClass = ref("");

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

  function drawPDF(page, pdfDoc, magics, FontSet) {
    const { width, height } = page.getSize();

    const fourLines = 4 * FONT_SIZES.BASE;

    page.moveTo(40, height - fourLines);

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

  return {
    selectedClass,
    selectedMagics,
    rpgClasses,
    allMagics,
    generatePDF,
  };
}
