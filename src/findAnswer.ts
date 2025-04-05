import Fuse from "fuse.js";
import { QNA_DATA } from "./qna";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export interface QAResult {
  question: string;
  answer: string;
}

// Initialize Fuse with tighter match threshold
const fuse = new Fuse(QNA_DATA, {
  keys: ["question"],
  threshold: 0.3, // smaller = stricter
  includeScore: true,
});

export const findAnswersFromText = (text: string): QAResult[] => {
  const lines = text
    .split(/\n|\.|\?|!/g)
    .map((line) => line.trim())
    .filter((line) => line.length > 10);

  const found: QAResult[] = [];

  const alreadyMatched = new Set<string>();

  for (const line of lines) {
    const [match] = fuse.search(line);
    if (
      match &&
      match.score !== undefined &&
      match.score < 0.3 &&
      !alreadyMatched.has(match.item.question)
    ) {
      found.push({
        question: match.item.question,
        answer: match.item.answer,
      });
      alreadyMatched.add(match.item.question);
    }
  }

  return found;
};

// export const getAnswerFromAI = async (question: string): Promise<string> => {
//   try {
//     const apiKey = process.env.OPENAI_API_KEY;
//     if (!apiKey) {
//       throw new Error("OpenAI API key not configured");
//     }

//     // Simple rate limiting - wait at least 1 second between requests
//     await new Promise((resolve) => setTimeout(resolve, 1000));

//     const response = await axios.post(
//       "https://api.openai.com/v1/chat/completions",
//       {
//         model: "gpt-3.5-turbo",
//         messages: [{ role: "user", content: question }],
//         max_tokens: 150,
//         temperature: 0.7,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${apiKey}`,
//           "Content-Type": "application/json",
//         },
//         timeout: 10000, // 10 second timeout
//       }
//     );

//     return (
//       response.data.choices[0]?.message?.content?.trim() ||
//       "No answer received from AI"
//     );
//   } catch (error) {
//     console.error("OpenAI API Error:", error);

//     if (axios.isAxiosError(error)) {
//       if (error.response?.status === 429) {
//         return "API rate limit exceeded - please wait before asking more questions";
//       }
//       if (error.response?.status === 401) {
//         return "Invalid API key - please check your configuration";
//       }
//     }

//     return "Sorry, I couldn't get an answer to that question right now.";
//   }
// };

// const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// export const getAnswerFromOpenApiAI = async (question: string): Promise<string> => {
//   const apiKey = process.env.OPENAI_API_KEY;
//   if (!apiKey) throw new Error("OpenAI API key not configured");

//   let retries = 3;

//   while (retries > 0) {
//     try {
//       const response = await axios.post(
//         "https://api.openai.com/v1/chat/completions",
//         {
//           model: "gpt-3.5-turbo",
//           messages: [{ role: "user", content: question }],
//           max_tokens: 150,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${apiKey}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       return (
//         response.data.choices[0]?.message?.content?.trim() ||
//         "No answer received"
//       );
//     } catch (error: any) {
//       if (error.response?.status === 429) {
//         console.warn("Rate limited, retrying in 20s...");
//         await delay(20000); // wait before retrying
//         retries--;
//       } else {
//         console.error("API Error:", error.response?.data || error);
//         break;
//       }
//     }
//   }

//   return "Sorry, I'm rate limited or something went wrong. Try again later.";
// };

export const getAnswerFromGroqAI = async (
  question: string
): Promise<string> => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ API key not configured");

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-70b-8192", // Still best available free model
        messages: [
          // {
          //   role: "system",
          //   content:
          //     "You are an assistant that answers concisely. Keep answers under 150 characters and avoid any unnecessary details.",
          // },
          {
            role: "user",
            content: question,
          },
        ],
        // max_tokens: , // ⬅️ ~150 characters or less
        temperature: 0.7, // Slight creativity, but not too random
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    return (
      response.data.choices[0]?.message?.content?.trim() || "No answer received"
    );
  } catch (error: any) {
    console.error("Groq API Error:", error.response?.data || error);
    return "Sorry, Groq failed. Try again later.";
  }
};
