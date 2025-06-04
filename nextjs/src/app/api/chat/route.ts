import { NextRequest, NextResponse } from 'next/server';
const { GoogleGenAI } = require("@google/genai");
import { v7 as uuidv7 } from 'uuid';

// Ensure the API key is loaded from environment
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error('Missing GEMINI_API_KEY environment variable');
}

// Global chat sessions storage
const chatSessions = new Map<string, any>();
const TIME_DELAY_IN_MS = 1800000; // 30 mins

class ChatSession {
  private _session: any;
  public lastContact: number;

  constructor(jobTitle: string) {
    const aiConfig = {
      responseMimeType: 'text/plain',
      temperature: 1,
      topP: 0.9,
      systemInstruction: [
        {
          text: `You are a hiring manager responsible for hiring the next ${jobTitle} into the company. You will start by saying " welcome to the interview, Tell me about yourself". You will then ask questions to find out if the applicant is knowledgeable about their role. Ask questions about both hard and soft skills. You cannot ask questions about the person's sex, gender, relationship status, religious beliefs, skin color, race, ethnic background, disability, medical history, age, political ideologies, employment status or if they have children. After 6-8 questions give the interviewee a review of how they did and give them detailed tips and tricks for how they could do better. You should ask questions one at a time. You may ask follow up questions if you so wish.`,
        },
      ],
    };

    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    this.lastContact = Date.now();
    this._session = ai.chat.create({
      model: 'gemini-2.0-flash-001',
      config: aiConfig,
    });
  }

  async sendMessage(userMessage: string) {
    this.lastContact = Date.now();
    return await this._session.sendMessage({ message: userMessage });
  }
}

function cleanUpOldChats() {
  for (const [uuid, chatSession] of chatSessions.entries()) {
    if (chatSession.lastContact < Date.now() - TIME_DELAY_IN_MS) {
      chatSessions.delete(uuid);
      console.log('cleared chat: ', uuid);
    }
  }
}

// Run cleanup every 30 minutes
setInterval(cleanUpOldChats, TIME_DELAY_IN_MS);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate request body
    if (!body) {
      return NextResponse.json({ error: 'Please do not send empty payloads' }, { status: 400 });
    }

    const userInput = body.userInput || '';
    const job = body.job || '';
    const uuid = body.uuid || uuidv7();

    // Create or retrieve chat session
    if (!chatSessions.has(uuid)) {
      chatSessions.set(uuid, new ChatSession(job));
    }

    const currentChatSession = chatSessions.get(uuid);
    
    // Send message and get response
    const aiResponse = await currentChatSession.sendMessage({ message: userInput });

    // Log for debugging
    console.log(uuid, '>', userInput);
    console.log(uuid, '<', aiResponse.text);

    return NextResponse.json({ 
      response: aiResponse.text,
      uuid 
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ uuid: uuidv7() });
}
