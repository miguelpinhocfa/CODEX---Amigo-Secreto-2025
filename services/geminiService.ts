import { GoogleGenAI, ChatSession } from "@google/genai";
import { INITIAL_SYSTEM_PROMPT } from '../constants';

let chatSession: ChatSession | null = null;

export const initializeChat = async (): Promise<void> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: INITIAL_SYSTEM_PROMPT,
        temperature: 0.8,
      },
    });
    chatSession = chat;
  } catch (error) {
    console.error("Failed to initialize Gemini chat:", error);
    throw error;
  }
};

export const sendMessageToOracle = async (message: string): Promise<string> => {
  if (!chatSession) {
    await initializeChat();
  }

  if (!chatSession) {
    return "Erro de conexão com o Oráculo Digital. Verifique sua chave API.";
  }

  try {
    const result = await chatSession.sendMessage({ message });
    return result.text || "...";
  } catch (error) {
    console.error("Error sending message:", error);
    return "O espírito natalino está interferindo no sinal... tente novamente.";
  }
};
