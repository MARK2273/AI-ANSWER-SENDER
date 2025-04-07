🧠 AI Screenshot Assistant
A productivity tool that helps you take screenshots, extract text from selected regions, and get AI-generated answers instantly via SMS.

Press a key → Take screenshot → Select area → Get AI answer via SMS

📦 Prerequisites
Before running the app, install and collect the following:

🔧 Requirements
✅ Node.js

✅ Live Server Extension for VS Code

🔐 Required API Keys
Key Description
ACCOUNT_SID Twilio Account SID
AUTH_TOKEN Twilio Auth Token
MESSAGE_SID Twilio Messaging SID
TO_NUMBER Your phone number (E.164 format)
GROQ_API_KEY API Key for GROQ AI
🌐 DevTunnel Links
You must start DevTunnels for:

🔵 Port 5500 → Frontend (set to public)

🟢 Port 3001 → Backend (set to public)

After tunneling, copy both URLs and use them in the .env file

🛠️ Setup Instructions

1. 📁 Clone the Project
   bash
   Copy
   Edit
   git clone <your-repo-url>
   cd <project-folder>
2. 📄 Configure .env
   Rename .env.example to .env

Fill in all required credentials and URLs:

env
Copy
Edit
ACCOUNT_SID=your_twilio_sid
AUTH_TOKEN=your_twilio_auth_token
MESSAGE_SID=your_twilio_msg_sid
TO_NUMBER=your_verified_number
GROQ_API_KEY=your_groq_api_key
FRONTEND_BASE_URL=https://your-devtunnel-frontend-url.dev.tunnels.ms
BACKEND_BASE_URL=https://your-devtunnel-backend-url.dev.tunnels.ms 3. 🌐 Start Frontend (Live Server)
Open public/index.html

Click "Go Live" from the bottom-right corner in VS Code

Your frontend will now be hosted on port 5500

4. 🚀 Start Backend
   bash
   Copy
   Edit
   npm run prod
   This will:

Start the Express server on port 3001

Enable global keyboard listeners

🧪 How to Use
✅ Option 1: Recommended Mode
Press F6 — Takes a full-screen screenshot

You’ll receive a link via SMS

Open the link in browser → Select the area of interest

Click "Submit" to save selected coordinates

Press F8 — Takes a new screenshot, crops it to selected area

Sends the image to AI → AI processes it and sends you an answer via SMS

🧩 Option 2: Manual Screenshot Mode
Not recommended unless needed for advanced use

Press F7 — Starts a background service

Take a screenshot manually using PrintScrn

Select the region → It gets saved to /Screenshot/manual/

Image is sent to AI → AI replies with an answer via SMS

📌 Make sure to change the default screenshot save path of your OS to Screenshot/manual/ folder

🧰 Scripts & Commands
Command What it Does
npm run prod Starts the backend in production mode
npm run dev Starts backend in dev mode (if needed)
ts-node src/port-forward.ts (Optional) Starts DevTunnel via code
💡 Notes
Pressing F6, F7, or F8 are keyboard global events; they work while app is running

All images and coordinates are saved locally

You can find and edit the crop logic in public/index.html and backend logic in server.ts

💬 Troubleshooting
Issue Fix
❌ SMS not sent Check Twilio credentials in .env
❌ AI not responding Check GROQ_API_KEY is correct
❌ Screenshot not working Try running app as Admin / check permissions
❌ CORS error Ensure DevTunnel URLs are correct and public
❌ PrintScrn not triggering in Mode 2 OS screenshot settings might need update
