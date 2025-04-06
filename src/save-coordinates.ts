// // server.ts or server.js
// import express from "express";
// import fs from "fs";
// import path from "path";
// import cors from "cors";

// const app = express();
// const PORT = 3001;

// app.use(
//   cors({
//     origin: "*", // Replace with your frontend URL like "http://localhost:5500" in production
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type"],
//   })
// );
// app.use(express.json());

// const COORDINATES_FILE = path.resolve("coordinates.json");

// app.post("/save-coordinates", (req: any, res: any) => {
//   const { x, y, width, height } = req.body;

//   if (
//     typeof x !== "number" ||
//     typeof y !== "number" ||
//     typeof width !== "number" ||
//     typeof height !== "number"
//   ) {
//     return res.status(400).json({ message: "Invalid coordinates" });
//   }

//   const data = { x, y, width, height };
//   fs.writeFileSync(COORDINATES_FILE, JSON.stringify(data, null, 2));
//   console.log("✅ Coordinates saved:", data);

//   res.json({ message: "Coordinates saved successfully" });
// });

// app.get("/get-coordinates", (req: any, res: any) => {
//   try {
//     const data = fs.readFileSync(COORDINATES_FILE, "utf-8");
//     const coords = JSON.parse(data);
//     res.json(coords);
//   } catch (err) {
//     console.error("❌ Failed to read coordinates.json:", err);
//     res.status(500).json({ message: "Failed to read coordinates" });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`🚀 Server running at http://localhost:${PORT}`);
// });

import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";

const app = express();
const PORT = 3001;

// ✅ CORS configuration
app.use(
  cors({
    origin: "*", // Replace with your frontend URL like "http://localhost:5500" in production
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

// ✅ Serve static files like screenshot.png
app.use(express.static(path.resolve("./")));

const COORDINATES_FILE = path.resolve("coordinates.json");

app.post("/save-coordinates", (req: any, res: any) => {
  const { x, y, width, height } = req.body;

  if (
    typeof x !== "number" ||
    typeof y !== "number" ||
    typeof width !== "number" ||
    typeof height !== "number"
  ) {
    return res.status(400).json({ message: "Invalid coordinates" });
  }

  const data = { x, y, width, height };
  fs.writeFileSync(COORDINATES_FILE, JSON.stringify(data, null, 2));
  console.log("✅ Coordinates saved:", data);

  res.json({ message: "Coordinates saved successfully" });
});

app.get("/get-coordinates", (req: any, res: any) => {
  try {
    const data = fs.readFileSync(COORDINATES_FILE, "utf-8");
    const coords = JSON.parse(data);
    res.json(coords);
  } catch (err) {
    console.error("❌ Failed to read coordinates.json:", err);
    res.status(500).json({ message: "Failed to read coordinates" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
