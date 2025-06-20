import { degrees, PDFDocument, PDFFont, PDFPage, rgb } from 'pdf-lib'
import type { LibraryMagic, Magia, SourceFont } from '@/types'
import { FontSize, LineHeights, Settings } from '../settings'
import { breakTextInLines, loadFont } from './utils'

export async function drawLayoutBasic(pdfDoc: PDFDocument, library: LibraryMagic[]) {
  let baseFont, boldFont

  try {
    const fontGothamBlack = await loadFont('Gotham-Black.otf')
    const fontGaramond = await loadFont('EBGaramond-Regular.ttf')

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
  settings.config(pdfDoc, sourceFont)

  const copyLibrary = library.map((item) => {
    return {
      ...item,
      selecteds: item.selecteds.map((magic) => ({ ...magic })),
    }
  })

  drawPage(copyLibrary)
}

function drawPage(library: LibraryMagic[]) {
  const { pdfDoc } = new Settings()
  const page = pdfDoc.addPage()

  drawBrand(page)

  for (let i = 0; i < library.length; i++) {
    const nivel = library[i]

    if (nivel.selecteds.length > 0) {
      drawNivel(page, nivel)
    }

    for (let j = 0; j < nivel.selecteds.length; j++) {
      const jumpPage = drawMagic(page, nivel.selecteds, j)

      if (jumpPage) {
        nivel.selecteds = nivel.selecteds.slice(j)
        if (nivel.selecteds.length > 0) {
          drawPage(library.slice(i))
        }
        return
      }
    }

    nivel.selecteds = []
  }
}

function drawBrand(page: PDFPage) {
  const { sourceFont } = new Settings()

  const { height } = page.getSize()

  page.moveTo(40, height - 40)
  page.drawText('Pergaminhos de Salazar', {
    font: sourceFont.bold,
    size: FontSize.base,
    lineHeight: LineHeights.base,
    color: rgb(0, 0.53, 0.71),
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

function drawMagic(page: PDFPage, magics: Magia[], index: number) {
  const { width } = page.getSize()
  const { sourceFont } = new Settings()

  const magia = magics[index]

  const head =
    `T.Conj: ${magia.TempoConj} | ` +
    `Alcance: ${magia.Alcance} | ` +
    `Componentes: ${magia.Componentes} | ` +
    `Duração: ${magia.Duracao}`

  const maxWidth = width - 10 - 8 * FontSize.base
  const prepText = breakTextInLines(magia.Descricao, sourceFont.base, maxWidth)

  const linesHeight = prepText.lines * FontSize.base
  const measureHeight = linesHeight + FontSize.title2 * 3

  if (page.getPosition().y - measureHeight < 50) {
    return true
  }

  // Title
  page.drawText(magia.Titulo, {
    font: sourceFont.bold,
    size: FontSize.title5,
    lineHeight: LineHeights.title5,
  })
  page.moveDown(LineHeights.title5)

  // Head
  page.drawText(head, {
    font: sourceFont.bold,
    size: FontSize.small,
    lineHeight: LineHeights.small,
  })
  page.moveDown(LineHeights.small * 2)

  // Description
  page.drawText(prepText.text, {
    font: sourceFont.base,
    size: FontSize.base,
    lineHeight: LineHeights.base,
  })
  page.moveDown(LineHeights.base * prepText.lines)

  // Material
  if (magia.Material) {
    page.moveDown(LineHeights.small)

    const prefix = 'Material: '
    const paddRight = sourceFont.base.widthOfTextAtSize(prefix, FontSize.base) + 2

    page.drawText(prefix, {
      font: sourceFont.bold,
      size: FontSize.small,
      lineHeight: LineHeights.small,
    })
    page.moveRight(paddRight)
    page.drawText(magia.Material, {
      font: sourceFont.base,
      size: FontSize.base,
      lineHeight: LineHeights.small,
    })
    page.moveLeft(paddRight)

    page.moveDown(FontSize.small)
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
