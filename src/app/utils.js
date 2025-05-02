export function breakTextInLines(baseText, baseFont, maxWidth) {
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
    textWidth = baseFont.widthOfTextAtSize(temp, FONT_SIZES.BASE);

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
