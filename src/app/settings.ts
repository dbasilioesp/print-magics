import type { SourceFont } from '@/types'
import type { PDFDocument, PDFImage } from 'pdf-lib'

export const fontBaseSize = 11

export const FontSize = {
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
}

export const LineHeights = {
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
}

export class Settings {
  static instance: Settings
  public pdfDoc!: PDFDocument
  public sourceFont!: SourceFont
  public bgImage!: PDFImage

  constructor() {
    if (Settings.instance) {
      return Settings.instance
    }
    Settings.instance = this
  }

  config(pdfDoc: PDFDocument, sourceFont: SourceFont, bgImage?: PDFImage) {
    Settings.instance.pdfDoc = pdfDoc
    Settings.instance.sourceFont = sourceFont
    if (bgImage) Settings.instance.bgImage = bgImage
  }
}
