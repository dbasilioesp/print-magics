import { PDFDocument } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'
import type { LibraryMagic, Magia } from '@/types'
// import { drawLayoutBasic } from './layouts/layout-basic'
import { drawLayoutBasicColumn } from './layouts/layout-basic-column'

export async function generatePDF(library: LibraryMagic[]) {
  const pdfDoc = await PDFDocument.create()
  pdfDoc.registerFontkit(fontkit)

  // await drawLayoutBasic(pdfDoc, library)
  await drawLayoutBasicColumn(pdfDoc, library)

  const pdfBytes = await pdfDoc.save()
  var bytes = new Uint8Array(pdfBytes) // pass your byte response to this constructor
  var blob = new Blob([bytes], { type: 'application/pdf' }) // change resultByte to bytes

  // var link = document.createElement("a");
  // link.href = window.URL.createObjectURL(blob);
  // link.target = "__blank";
  // link.download = "Magias.pdf";
  // link.click();

  return window.URL.createObjectURL(blob)
}
