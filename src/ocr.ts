// src/ocr.ts

import Tesseract from "tesseract.js";

export const extractTextFromImage = async (
  imagePath: string
): Promise<string> => {
  const result = await Tesseract.recognize(imagePath, "eng");
  const text = result.data.text;
  return text.trim().replace(/\s+/g, " ");
};
