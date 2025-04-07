import fs from "fs";
import path from "path";
import screenshot from "screenshot-desktop";
import sharp from "sharp";
import { GlobalKeyboardListener } from "node-global-key-listener";
import { extractTextFromImage } from "./ocr";
import { getAnswerFromGroqAI } from "./findAnswer";
import { sendSMS } from "./whatsapp";

// 🔍 Define folders
const AUTO_SCREENSHOT_DIR = path.resolve("./screenshots/auto");
const MANUAL_SCREENSHOT_DIR = path.resolve("./screenshots/manual");

const processedFiles = new Set<string>();

fs.mkdirSync(AUTO_SCREENSHOT_DIR, { recursive: true });
fs.mkdirSync(MANUAL_SCREENSHOT_DIR, { recursive: true });

// -------------------- 🧠 Utility Functions --------------------

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

// -------------------- 📂 Folder Watcher (F7) --------------------

let isWatching = false;

const watchManualScreenshotFolder = () => {
  if (isWatching) {
    console.log("🔁 Already watching manual folder.");
    return;
  }

  console.log(`👀 Watching folder: ${MANUAL_SCREENSHOT_DIR} for new snips...`);
  isWatching = true;

  fs.watch(MANUAL_SCREENSHOT_DIR, (eventType, filename) => {
    if (!filename || !isImage(filename)) return;

    const fullPath = path.join(MANUAL_SCREENSHOT_DIR, filename);

    setTimeout(() => {
      if (!processedFiles.has(filename)) {
        processedFiles.add(filename);
        processImage(fullPath);
      }
    }, 1000);
  });
};

// -------------------- 📸 Predefined Screenshot (F8) --------------------

const COORDINATES_FILE = path.resolve("coordinates.json");

const getDynamicRegion = (): {
  left: number;
  top: number;
  width: number;
  height: number;
} => {
  try {
    const data = fs.readFileSync(COORDINATES_FILE, "utf-8");
    const coords = JSON.parse(data);
    return {
      left: Math.round(coords.x),
      top: Math.round(coords.y),
      width: Math.round(coords.width),
      height: Math.round(coords.height),
    };
  } catch (err) {
    console.error("❌ Failed to read coordinates.json. Using default region.");
    return { left: 0, top: 0, width: 500, height: 300 };
  }
};

const region = getDynamicRegion();

const takeScreenshotAndProcess = async () => {
  try {
    const timestamp = Date.now();
    const fullImgPath = path.join(AUTO_SCREENSHOT_DIR, `full-${timestamp}.png`);
    const croppedImgPath = path.join(
      AUTO_SCREENSHOT_DIR,
      `cropped-${timestamp}.png`
    );

    await screenshot({ filename: fullImgPath });

    await sharp(fullImgPath).extract(region).toFile(croppedImgPath);

    await processImage(croppedImgPath);
  } catch (err) {
    console.error("Error in predefined screenshot:", err);
    // await sendSMS("⚠️ Error while taking a predefined screenshot.");
  }
};

// -------------------- 🎹 Keyboard Listener --------------------

const keyboard = new GlobalKeyboardListener();

keyboard.addListener((e) => {
  if (e.state === "DOWN") {
    if (e.name === "F8") {
      console.log("🖱️ F8 Pressed: Taking predefined region screenshot...");
      takeScreenshotAndProcess();
    }

    if (e.name === "F7") {
      console.log("🖱️ F7 Pressed: Start watching for manual screenshots...");
      watchManualScreenshotFolder();
    }

    if (e.name === "F6") {
      console.log(
        "🖱️ F6 Pressed: Taking full screenshot and saving as screenshot.png..."
      );
      const screenshotPath = path.resolve("screenshot.png");

      screenshot({ filename: screenshotPath })
        .then(async () => {
          console.log(`✅ Screenshot saved at: ${screenshotPath}`);

          const frontendUrl = "frontend-url"; // Replace with your actual frontend URL
          // Send link via SMS
          await sendSMS(`📸 Screenshot available at:\n${frontendUrl}`);
        })
        .catch((err) => {
          console.error("❌ Error saving screenshot:", err);
          // Optionally notify failure
          // await sendSMS("⚠️ Failed to take screenshot.");
        });
    }
  }
});

console.log("🧠 Ready! Press F8 for auto-screenshot OR F7 for manual snips.");
