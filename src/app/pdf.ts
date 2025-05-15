import { degrees, PDFDocument, PDFFont, PDFPage } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import type { Magia } from "@/types";

type SourceFont = {
  base: PDFFont;
  bold: PDFFont;
};

const fontBaseSize = 12;

const FontSize = {
  xtiny: fontBaseSize * 0.55,
  tiny: fontBaseSize * 0.65,
  small: fontBaseSize * 0.75,
  base: fontBaseSize,
  title6: fontBaseSize * 1.1,
  title5: fontBaseSize * 1.2,
  title4: fontBaseSize * 1.44,
  title3: fontBaseSize * 1.7,
  title2: fontBaseSize * 2,
  title1: fontBaseSize * 2.4,
};

const LineHeights = {
  xtiny: FontSize.xtiny * 1.1,
  tiny: FontSize.tiny * 1.1,
  small: FontSize.small * 1.2,
  base: FontSize.base * 1.1,
  title6: FontSize.title6 * 1.1,
  title5: FontSize.title5 * 1.1,
  title4: FontSize.title4 * 1.1,
  title3: FontSize.title3 * 1.1,
  title2: FontSize.title2 * 1.1,
  title1: FontSize.title1 * 1.1,
};

function breakTextInLines(
  baseText: string,
  baseFont: PDFFont,
  maxWidth: number
) {
  const words = baseText.split(" ");
  let lines = 1;

  let bufferLine = "";
  let finalText = "";
  let textWidth = 0;

  for (const word of words) {
    const breakLines = (word.match(/\n/g) || []).length;

    if (breakLines) {
      lines += breakLines;
      finalText += bufferLine + word;
      bufferLine = " ";
      continue;
    }

    const temp = bufferLine + word;
    textWidth = baseFont.widthOfTextAtSize(temp, FontSize.base);

    if (textWidth < maxWidth) {
      bufferLine += word + " ";
    } else {
      lines += 1;
      finalText += bufferLine + "\n";
      bufferLine = word + " ";
    }
  }

  finalText += bufferLine;

  return { text: finalText, lines };
}

function drawPDF(
  page: PDFPage,
  pdfDoc: PDFDocument,
  magics: Magia[],
  sourceFont: SourceFont
) {
  const { width, height } = page.getSize();

  const fourLines = 4 * FontSize.base;

  page.moveTo(40, height - fourLines);

  for (let index = 0; index < magics.length; index++) {
    const magia = magics[index];

    const head =
      `T.Conj: ${magia.TempoConj} | ` +
      `Alcance: ${magia.Alcance} | ` +
      `Componentes: ${magia.Componentes} | ` +
      `Duração: ${magia.Duracao}`;

    const maxWidth = width - 10 - 8 * FontSize.base;
    const prepText = breakTextInLines(
      magia.Descricao,
      sourceFont.base,
      maxWidth
    );

    const linesHeight = prepText.lines * FontSize.base;
    const measureHeight = linesHeight + FontSize.title2 * 3;

    if (page.getPosition().y - measureHeight < 50) {
      const newPage = pdfDoc.addPage();
      const newMagias = magics.slice(index);

      if (newMagias.length > 0) {
        drawPDF(newPage, pdfDoc, newMagias, sourceFont);
      }
      return;
    }

    // Title
    page.drawText(magia.Titulo, {
      font: sourceFont.bold,
      size: FontSize.title4,
      lineHeight: LineHeights.title4,
    });
    page.moveDown(LineHeights.title4);

    // Head
    page.drawText(head, {
      font: sourceFont.bold,
      size: FontSize.small,
      lineHeight: LineHeights.small,
    });
    page.moveDown(LineHeights.small * 2);

    // Description
    page.drawText(prepText.text, {
      font: sourceFont.base,
      size: FontSize.base,
      lineHeight: LineHeights.base,
    });
    page.moveDown(LineHeights.base * prepText.lines);

    // Material
    if (magia.Material) {
      page.moveDown(LineHeights.small);

      const prefix = "Material: ";
      const paddRight =
        sourceFont.base.widthOfTextAtSize(prefix, FontSize.base) + 2;

      page.drawText(prefix, {
        font: sourceFont.bold,
        size: FontSize.small,
        lineHeight: LineHeights.small,
      });
      page.moveRight(paddRight);
      page.drawText(magia.Material, {
        font: sourceFont.base,
        size: FontSize.base,
        lineHeight: LineHeights.small,
      });
      page.moveLeft(paddRight);

      page.moveDown(FontSize.small);
    }

    // Escola
    const pos = page.getPosition();
    page.drawText(magia.Escola.toUpperCase(), {
      font: sourceFont.bold,
      size: FontSize.small,
      lineHeight: LineHeights.small,
      rotate: degrees(90),
      opacity: 0.5,
      x: pos.x - 10,
      y: pos.y + (magia.Material ? 10 : 16),
    });

    page.moveDown(FontSize.title5 * 2);
  }
}

async function loadFont(path: string) {
  const res = await fetch(`/fonts/${path}`);
  return res.arrayBuffer();
}

export async function generatePDF(magics: Magia[]) {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);
  let baseFont, boldFont;

  try {
    const fontGothamBlack = await loadFont("Gotham-Black.otf");
    const fontGaramond = await loadFont("EBGaramond-Regular.ttf");

    baseFont = await pdfDoc.embedFont(fontGaramond);
    boldFont = await pdfDoc.embedFont(fontGothamBlack);
  } catch (error) {
    console.error("Erro ao carregar as fontes.");
    throw error;
  }

  const page = pdfDoc.addPage();

  const fonts: SourceFont = {
    bold: boldFont,
    base: baseFont,
  };

  drawPDF(page, pdfDoc, magics, fonts);

  const pdfBytes = await pdfDoc.save();
  var bytes = new Uint8Array(pdfBytes); // pass your byte response to this constructor
  var blob = new Blob([bytes], { type: "application/pdf" }); // change resultByte to bytes

  // var link = document.createElement("a");
  // link.href = window.URL.createObjectURL(blob);
  // link.target = "__blank";
  // link.download = "Magias.pdf";
  // link.click();

  return window.URL.createObjectURL(blob);
}
