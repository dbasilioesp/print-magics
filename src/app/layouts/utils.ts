import type { PDFFont } from 'pdf-lib'
import { FontSize } from '../settings'

export async function loadFont(path: string) {
  const res = await fetch(`/fonts/${path}`)
  return res.arrayBuffer()
}

export function breakTextInLines(baseText: string, baseFont: PDFFont, maxWidth: number) {
  const words = baseText.split(' ')
  let lines = 1

  let bufferLine = ''
  let finalText = ''
  let textWidth = 0

  for (const word of words) {
    const breakLines = (word.match(/\n/g) || []).length

    if (breakLines) {
      lines += breakLines
      finalText += bufferLine + word
      bufferLine = ' '
      continue
    }

    const temp = bufferLine + word
    textWidth = baseFont.widthOfTextAtSize(temp, FontSize.base)

    if (textWidth < maxWidth) {
      bufferLine += word + ' '
    } else {
      lines += 1
      finalText += bufferLine + '\n'
      bufferLine = word + ' '
    }
  }

  finalText += bufferLine

  return { text: finalText, lines }
}
