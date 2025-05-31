"use strict";

// console.log("hello world");

const BACKEND_SERVER = "http://localhost:4000";

// Get references to DOM elements
const conversationArea = document.querySelector("#convoDisplayArea");
const userInputForm = document.querySelector("#userInputForm");
const userTextInputArea = document.querySelector("#userInput");
const jobDescriptionInput = document.querySelector("#jobDescription");
const sendButton = document.querySelector("#sendButton");
userInputForm.addEventListener("submit", sendToAI); // Attach form submit handler

// Object to hold the session UUID
const SESSION_UUID = {}
getUUID(SESSION_UUID) // Fetch and set the session UUID on page load
// console.log("UUID: ",SESSION_UUID)

// Fetch a new UUID from the backend and store it in SESSION_UUID
async function getUUID (SESSION_UUID) {
    console.log("running")
  const uuidResp = await fetch(`${BACKEND_SERVER}/api/uuid`);
  const uuidFromServer = await uuidResp.json();
  sendButton.removeAttribute("disabled") // Enable send button after UUID is fetched
  console.log(uuidFromServer)
  SESSION_UUID.value= uuidFromServer.uuid; // Store UUID in SESSION_UUID object
//   console.log("UUID2",SESSION_UUID)
  Object.freeze(SESSION_UUID) // Prevent further changes to SESSION_UUID
};

// Handle form submission: send user input and job description to backend, display conversation
async function sendToAI(e) {
  e.preventDefault();
  const userInput = userTextInputArea.value;
  console.log(userInput);
  userTextInputArea.value = "";

  // Prepare fetch options for POST request
  const fetchOptions = {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      uuid: SESSION_UUID.value, // Use the stored UUID
      job: jobDescriptionInput.value,
      userInput: userInput,
    }),
  };
  // Display user's message in the conversation area
  const userInputElement = document.createElement("p");
  userInputElement.classList.add("userInputBubble");
  userInputElement.classList.add("bubble");
  userInputElement.insertAdjacentText("afterbegin", userInput);
  conversationArea.append(userInputElement);

  // Send request to backend and display AI's response
  const aiResponse = await fetch(`${BACKEND_SERVER}/api/chat`, fetchOptions);
  const aiText = await aiResponse.json();
  console.log(aiText.response);

  const aiResponseElement = document.createElement("p");
  aiResponseElement.classList.add("aiResponseBubble");
  aiResponseElement.classList.add("bubble");
  aiResponseElement.insertAdjacentText("afterbegin", aiText.response);
  conversationArea.append(aiResponseElement);
}
