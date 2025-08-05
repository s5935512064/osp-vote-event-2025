export const wrapText = (
  text: string,
  maxWidth: number,
  fontSize: number
): string[] => {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = words[0] || "";

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const testLine = `${currentLine} ${word}`;
    const testWidth = testLine.length * (fontSize * 0.6);

    if (testWidth < maxWidth) {
      currentLine = testLine;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
};

export const createFileDownload = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const calculateFontSize = (
  baseFontSize: number,
  elementSize: { width: number; height: number },
  referenceSize: { width: number; height: number }
): number => {
  // คำนวณ scale factor จาก element size
  const widthRatio = elementSize.width / referenceSize.width;
  const heightRatio = elementSize.height / referenceSize.height;
  const scale = Math.min(widthRatio, heightRatio);

  // ปรับ font size ตาม scale แต่มี min และ max
  const scaledFontSize = baseFontSize * scale;
  const minFontSize = 12;
  const maxFontSize = 72;

  return Math.max(minFontSize, Math.min(maxFontSize, scaledFontSize));
};
