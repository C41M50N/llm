import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createAI } from "../src/index";

const ai = createAI({
  providers: {
    google: () => createGoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY }),
  },
  models: {
    "google/gemini-2.5-flash-lite": { provider: "google", id: "gemini-2.5-pro" },
  },
});

async function main() {
  const { data } = await ai.generate({
    model: "google/gemini-2.5-flash-lite",
    prompt: "Tell me a joke about programming.",
  });
  console.log(data);
}

main();
