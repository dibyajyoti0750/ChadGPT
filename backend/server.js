import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const ai = new GoogleGenAI({});

const chat = ai.chats.create({
  model: "gemini-2.5-flash",
  history: [],
});

async function send() {
  const response1 = await chat.sendMessage({
    message: "I have two dogs in my house",
  });
  console.log("response 1: ", response1.text);

  const response2 = await chat.sendMessage({
    message: "How many paws are in the house",
  });
  console.log("response 2: ", response2.text);
}

await send();
