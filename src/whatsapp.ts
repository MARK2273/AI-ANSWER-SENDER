import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const messagingServiceSid = process.env.MESSAGE_SID;
const to = process.env.TO_NUMBER;

if (!accountSid || !authToken || !messagingServiceSid || !to) {
  throw new Error(
    "Please set ACCOUNT_SID, AUTH_TOKEN, MESSAGE_SID, and TO_NUMBER in your environment variables."
  );
}

const client = twilio(accountSid, authToken);

export const sendSMS = async (body: string) => {
  try {
    const message = await client.messages.create({
      to,
      messagingServiceSid,
      body,
    });

    console.log("SMS sent! SID:", message.sid);
  } catch (error) {
    console.error("Failed to send SMS:", error);
  }
};
