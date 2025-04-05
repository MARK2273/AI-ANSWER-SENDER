import fs from "fs";
import path from "path";
import { extractTextFromImage } from "./ocr";
import { getAnswerFromGroqAI } from "./findAnswer";
import { sendSMS } from "./whatsapp";

const SCREENSHOT_DIR = path.resolve("./screenshots");
const processedFiles = new Set<string>();

const isImage = (filename: string) => /\.(png|jpg|jpeg)$/i.test(filename);

const processImage = async (filePath: string) => {
  try {
    console.log(`📸 Processing image: ${filePath}`);
    const text = await extractTextFromImage(filePath);
    console.log("📝 Extracted Text:", text);

    const answer = await getAnswerFromGroqAI(text);
    console.log("🤖 AI Answer:", answer);

    await sendSMS(`🧠 Answer:\n\n${answer}`);
  } catch (err) {
    console.error("❌ Error processing image:", err);
  }
};

const watchScreenshotFolder = () => {
  console.log(`👀 Watching folder: ${SCREENSHOT_DIR}`);

  fs.watch(SCREENSHOT_DIR, (eventType, filename) => {
    if (!filename || !isImage(filename)) return;

    const fullPath = path.join(SCREENSHOT_DIR, filename);

    // Wait briefly to make sure file is fully written
    setTimeout(() => {
      if (!processedFiles.has(filename)) {
        processedFiles.add(filename);
        processImage(fullPath);
      }
    }, 1000);
  });
};

watchScreenshotFolder();
