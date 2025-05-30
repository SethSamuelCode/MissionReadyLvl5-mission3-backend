// npm i dotenv morgan express cors

// ------------------ SETUP AND INSTALL ----------------- //

require("dotenv").config(); // Load environment variables from .env
const express = require("express"); // Express web server
const app = express();
const cors = require("cors"); // CORS middleware
const PORT = process.env.SERVER_LISTEN_PORT; // Port from environment
const assert = require("node:assert/strict"); // Assertion utility for debugging

const { GoogleGenAI, Chat, Models } = require("@google/genai");
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// --------------------- MIDDLEWARES -------------------- //

const morgan = require("morgan"); // HTTP request logger
const send = require("send");
app.use(morgan("dev")); // Log requests to console
app.use(express.json({ limit: "10MB" })); // Parse JSON bodies up to 10MB.

// Configure CORS to allow only specific origins
const corsConfigs = {
  origin: (incomingOrigin, allowedAccess) => {
    // Allow localhost (any port) and production domain
    const allowedOrigins = [/^http:\/\/localhost:\d+$/];
    // Allow requests with no origin (e.g., curl, server-to-server)
    if (!incomingOrigin || allowedOrigins.some((testOrigin) => testOrigin.test(incomingOrigin))) {
      allowedAccess(null, true); // Allow
    } else {
      allowedAccess(null, false); // Deny
    }
  },
};
app.use(cors(corsConfigs)); // Apply CORS policy

// ---------------------- FUNCTIONS --------------------- //

// ----------------------- DEFINES ---------------------- //

const MODEL_NAME = "gemini-2.0-flash-001";

class ChatSession {
  constructor() {

    const aiConfig = {
      responseMimeType: "text/plain",
      systemInstruction: [
        {
          text: `you are a bird and you have to work "caw caw" into every line `,
        },
      ],
    };

    this.lastContact = new Date();
    this._session = ai.chats.create({
      model: MODEL_NAME
    });
    console.log(this._session)
  }


  async sendMessage(userMessage){
    return await this._session.sendMessage({message:userMessage})

  }

  get session() {
    this.lastContact = new Date();
    return this._session;
  }


}

const chatSessions = new Map();
// ----------------------- ROUTES ----------------------- //

app.post("/api/chat", async (req, resp) => {
  const userInput = req.body.userInput;
  const job = req.body.job;
  const uuid = req.body.uuid;

  if (!chatSessions.has(uuid)) {
    chatSessions.set(uuid, new ChatSession());
  }

  const userChatSession =  chatSessions.get(uuid)
  console.log("from MAP: ",userChatSession)
  const responseFromAi = await userChatSession.sendMessage({ message: userInput });
  resp.send(responseFromAi.text)
});

app.post("/api/aiTest", async (req, resp) => {
  const userInput = req.body.userInput;

  const AiResponse = await ai.models.generateContent({
    model: "gemini-2.0-flash-001",
    config: {
      responseMimeType: "text/plain",
      systemInstruction: [
        {
          text: `you are a bird and you have to work "caw caw" into every line `,
        },
      ],
    },
    contents: userInput,
  });

  console.log(AiResponse.candidates[0].content.parts[0].text);
  resp.send(AiResponse.candidates[0].content.parts[0].text);
});

// Health check/test GET endpoint
app.get("/test", (req, resp) => {
  resp.status(200).json({ status: "success", data: "youve hit /test" });
});

// Test POST endpoint to echo received data
app.post("/postTest", (req, resp) => {
  console.log(req.body);
  resp.status(200).json({ status: "success", data: req.body });
});

// Start the Express server

app
  .listen(PORT, () => {
    console.log(`server is listening at http://localhost:${PORT}`);
  })
  .on("error", (error) => {
    console.log("server error !!!!", error);
  });
