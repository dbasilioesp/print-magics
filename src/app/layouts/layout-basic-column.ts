import { degrees, PDFDocument, PDFFont, PDFPage, rgb, type PDFPageDrawTextOptions } from 'pdf-lib'
import type { LibraryMagic, Magia, SourceFont } from '@/types'
import { FontSize, LineHeights, Settings } from '../settings'
import { breakTextInLines, loadFont } from './utils'
import BG from '@/assets/bg6.jpg'

let maxWidth = 0
const OFFSET = 40

type Styles = Partial<PDFPageDrawTextOptions> & {
  font: PDFFont
  lineHeight: number
}

export async function drawLayoutBasicColumn(pdfDoc: PDFDocument, library: LibraryMagic[]) {
  let baseFont, boldFont, bgImage

  try {
    const fontGothamBlack = await loadFont('Gotham-Black.otf')
    const fontGaramond = await loadFont('EBGaramond-Regular.ttf')

    const blob = await fetch(BG).then((res) => res.blob())
    const image = await blob.arrayBuffer()

    bgImage = await pdfDoc.embedJpg(image)
    baseFont = await pdfDoc.embedFont(fontGaramond)
    boldFont = await pdfDoc.embedFont(fontGothamBlack)
  } catch (error) {
    console.error('Erro ao carregar as fontes.')
    throw error
  }

  const sourceFont: SourceFont = {
    bold: boldFont,
    base: baseFont,
  }

  const settings = new Settings()
  settings.config(pdfDoc, sourceFont, bgImage)

  const copyLibrary = library.map((item) => {
    return {
      ...item,
      selecteds: item.selecteds.map((magic) => ({ ...magic })),
    }
  })

  drawPage(copyLibrary)
}

async function drawPage(library: LibraryMagic[]) {
  const { pdfDoc, bgImage } = new Settings()
  const page = pdfDoc.addPage()
  const { width, height } = page.getSize()
  maxWidth = width / 2 - 10 - 8 * FontSize.base

  // page.drawImage(bgImage, {
  //   x: -60,
  //   width,
  //   height,
  // })

  drawBrand(page)

  for (let i = 0; i < library.length; i++) {
    const nivel = library[i]

    if (nivel.selecteds.length > 0) {
      drawNivel(page, nivel)
    }

    for (let j = 0; j < nivel.selecteds.length; j++) {
      const jumpPage = drawMagic(page, nivel.selecteds, j)

      // if (jumpPage) {
      //   nivel.selecteds = nivel.selecteds.slice(j)
      //   if (nivel.selecteds.length > 0) {
      //     drawPage(library.slice(i))
      //   }
      //   return
      // }
    }

    nivel.selecteds = []
  }
}

function drawBrand(page: PDFPage) {
  const { sourceFont } = new Settings()

  const { height } = page.getSize()

  page.moveTo(OFFSET, height - OFFSET)
  page.drawText('Pergaminhos de Salazar', {
    font: sourceFont.bold,
    size: FontSize.base,
    lineHeight: LineHeights.base,
    // color: rgb(0, 0.53, 0.71),
  })

  page.moveDown(30)
}

function drawNivel(page: PDFPage, nivel: LibraryMagic) {
  const { sourceFont } = new Settings()

  page.drawText(nivel.title, {
    font: sourceFont.bold,
    size: FontSize.title2,
    lineHeight: LineHeights.title2,
    color: rgb(0.2, 0.53, 0.71),
  })
  page.moveDown(30)
}

function drawText(text: string, page: PDFPage, styles: Styles) {
  const noodle = breakTextInLines(text, styles.font, maxWidth)

  page.drawText(noodle.text, styles)
  page.moveDown(styles.lineHeight * noodle.lines)
}

function drawMagic(page: PDFPage, magics: Magia[], index: number) {
  console.log(magics[index].Titulo, page.getY())
  const { sourceFont } = new Settings()

  const magia = magics[index]

  // if (page.getPosition().y - measureHeight < 50) {
  //   return true
  // }

  // Title
  page.drawText(magia.Titulo, {
    font: sourceFont.bold,
    size: FontSize.title5,
    lineHeight: LineHeights.title5,
  })
  page.moveDown(LineHeights.title5)

  const head = [
    `T. Conjuração: ${magia.TempoConj}`,
    `Alcance: ${magia.Alcance}`,
    `Componentes: ${magia.Componentes}`,
    `Duração: ${magia.Duracao}`,
  ]

  for (const item of head) {
    drawText(item, page, {
      font: sourceFont.bold,
      size: FontSize.small,
      lineHeight: LineHeights.small,
    })
  }
  page.moveDown(LineHeights.small)

  // Description
  drawText(magia.Descricao, page, {
    font: sourceFont.base,
    size: FontSize.base,
    lineHeight: LineHeights.base,
  })
  page.moveDown(LineHeights.base)

  // Material
  if (magia.Material) {
    drawText('Material: ' + magia.Material, page, {
      font: sourceFont.base,
      size: FontSize.base,
      lineHeight: LineHeights.small,
    })
    // page.moveDown(LineHeights.small)

    // const prefix = 'Material: '
    // const paddRight = sourceFont.base.widthOfTextAtSize(prefix, FontSize.base) + 2

    // page.drawText(prefix, {
    //   font: sourceFont.bold,
    //   size: FontSize.small,
    //   lineHeight: LineHeights.small,
    // })
    // page.moveRight(paddRight)
    // page.drawText(magia.Material, {
    //   font: sourceFont.base,
    //   size: FontSize.base,
    //   lineHeight: LineHeights.small,
    // })
    // page.moveLeft(paddRight)

    // page.moveDown(FontSize.small)
  }

  // Escola
  const pos = page.getPosition()
  page.drawText(magia.Escola.toUpperCase(), {
    font: sourceFont.bold,
    size: FontSize.small,
    lineHeight: LineHeights.small,
    rotate: degrees(90),
    opacity: 0.5,
    x: pos.x - 10,
    y: pos.y + (magia.Material ? 10 : 16),
  })

  page.moveDown(FontSize.title5 * 2)
}
