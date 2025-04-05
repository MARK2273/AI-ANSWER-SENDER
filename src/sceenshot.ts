import screenshot from "screenshot-desktop";
import sharp from "sharp";
import { extractTextFromImage } from "./ocr";
import { findAnswersFromText, getAnswerFromGroqAI } from "./findAnswer";
import { sendSMS } from "./whatsapp";

const REGION = { left: 500, top: 300, width: 800, height: 300 };

export const takeScreenshotAndProcess = async () => {
  try {
    const fullImgPath = `./full-screenshot-${Date.now()}.png`;
    const croppedImgPath = `./cropped-screenshot-${Date.now()}.png`;

    await screenshot({ filename: fullImgPath });

    await sharp(fullImgPath)
      .extract({ ...REGION })
      .toFile(croppedImgPath);

    const text = await extractTextFromImage(croppedImgPath);
    console.log("Extracted Text:", text);

    // const answers = await getAnswerFromAI(text);
    const answers = await getAnswerFromGroqAI(text);
    console.log("AI Answers:", answers);

    // ✅ Send result to WhatsApp
    await sendSMS(`🧠 Found Answers:\n\n${answers}`);
  } catch (err) {
    console.error("Error:", err);
    // await sendSMS("An error occurred while processing the screenshot.");
  }
};
