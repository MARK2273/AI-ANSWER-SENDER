import { GlobalKeyboardListener } from "node-global-key-listener";
import { takeScreenshotAndProcess } from "./sceenshot";

const keyboard = new GlobalKeyboardListener();

keyboard.addListener((e) => {
  if (e.state === "DOWN" && e.name === "F8") {
    console.log("F8 Pressed: Taking screenshot...");
    takeScreenshotAndProcess();
  }
});

console.log("Listening for F8 key press...");
