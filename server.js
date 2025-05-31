// npm i dotenv morgan express cors

// ------------------ SETUP AND INSTALL ----------------- //

require("dotenv").config(); // Load environment variables from .env
const express = require("express"); // Express web server
const app = express();
const cors = require("cors"); // CORS middleware
const PORT = process.env.SERVER_LISTEN_PORT; // Port from environment
const assert = require("node:assert/strict"); // Assertion utility for debugging

const { GoogleGenAI } = require("@google/genai");
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const { v7: uuidv7 } = require("uuid");

// --------------------- MIDDLEWARES -------------------- //

const morgan = require("morgan"); // HTTP request logger
app.use(morgan("dev")); // Log requests to console
app.use(express.json({ limit: "10MB" })); // Parse JSON bodies up to 10MB.

// Configure CORS to allow only specific origins
const corsConfigs = {
  origin: (incomingOrigin, allowedAccess) => {
    // Allow localhost (any port) and production domain
    const allowedOrigins = [/^http:\/\/localhost/,/^http:\/\/127\.0\.0\.1:\d+/,/^http:\/\/192\.168\.0\.\d{1,3}/];
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

// ChatSession class manages a single AI chat session
class ChatSession {
  constructor(jobTitle) {
    // AI configuration for the chat session
    const aiConfig = {
      responseMimeType: "text/plain",
      systemInstruction: [
        {
          text: `you are a ${jobTitle} and you have to work this into every line `,
        },
      ],
    };

    this.lastContact = Date.now(); // Track last contact time
    // Create a new chat session with Gemini AI
    this._session = ai.chats.create({
      model: MODEL_NAME,
      config: aiConfig,
    });

    // console.log("SESSION CREATION:",this._session)
  }

  // Send a message to the AI and return the response
  async sendMessage(userMessage) {
    this.lastContact = Date.now();
    return await this._session.sendMessage({ message: userMessage });
  }

}

const chatSessions = new Map(); // Stores chat sessions by uuid

const TIME_DELAY_IN_MS=1800000 //30mins
// const TIME_DELAY_IN_MS = 10000;
function cleanUpOldChats() {
  if (!chatSessions.size) {
    console.log("no chats to clear")
    return;
  }
  chatSessions.forEach((chatSession, uuid) => {
    // console.log(chatSession.lastContact," ",Date.now() -TIME_DELAY_IN_MS)
    if (chatSession.lastContact < Date.now() - TIME_DELAY_IN_MS) {
      chatSessions.delete(uuid);
      console.log("cleared chat: ", uuid);
    }
  });
}

setInterval(cleanUpOldChats,TIME_DELAY_IN_MS)

// ----------------------- ROUTES ----------------------- //

app.get("/api/uuid", (req, resp) => {
  resp.send({uuid:uuidv7()});
});

// Chat endpoint: handles chat messages from clients
app.post("/api/chat", async (req, resp) => {
  // Check for empty payload
  if(!req.body){
    resp.status(400).send("please dont sent empty payloads")
    return
  }
  // Check for missing UUID
  if(!req.body.uuid){
    resp.status(400).send("please include a UUID")
    return
  }

  // Extract user input, job, and uuid from request body (default to empty string if missing)
  const userInput = req.body.userInput? req.body.userInput:"";
  const job = req.body.job?req.body.job:"";
  const uuid = req.body.uuid;

  // Create a new chat session if one doesn't exist for this uuid
  if (!chatSessions.has(uuid)) {
    chatSessions.set(uuid, new ChatSession(job));
  }

  const currentChatSession = chatSessions.get(uuid);
  // Log the incoming message
  console.log(uuid, ">", userInput);
  // Send the message to the AI and get the response
  const AiResponse = await currentChatSession._session.sendMessage({ message: userInput });
  // Log the AI's response
  console.log(uuid, "<", AiResponse.text);

  // Send the AI's response back to the client
  resp.send({response:AiResponse.text});
});

// Test endpoint for direct AI model call (not chat session)
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

  // Log and send the AI's response
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
