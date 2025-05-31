"use strict";

// console.log("hello world");

const BACKEND_SERVER = "http://localhost:4000";

const conversationArea = document.querySelector("#convoDisplayArea");
const userInputForm = document.querySelector("#userInputForm");
const userTextInputArea = document.querySelector("#userInput");
const jobDescriptionInput = document.querySelector("#jobDescription");
const sendButton = document.querySelector("#sendButton");
userInputForm.addEventListener("submit", sendToAI);

const SESSION_UUID = {}
getUUID(SESSION_UUID)
// console.log("UUID: ",SESSION_UUID)

async function getUUID (SESSION_UUID) {
    console.log("running")
  const uuidResp = await fetch(`${BACKEND_SERVER}/api/uuid`);
  const uuidFromServer = await uuidResp.json();
  sendButton.removeAttribute("disabled")
  console.log(uuidFromServer)
  SESSION_UUID.value= uuidFromServer.uuid;
//   console.log("UUID2",SESSION_UUID)
  Object.freeze(SESSION_UUID)
};
async function sendToAI(e) {
  e.preventDefault();
  const userInput = userTextInputArea.value;
  console.log(userInput);
  userTextInputArea.value = "";

  const fetchOptions = {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      uuid: SESSION_UUID.value,
      job: jobDescriptionInput.value,
      userInput: userInput,
    }),
  };
  const userInputElement = document.createElement("p");
  userInputElement.classList.add("userInputBubble");
  userInputElement.classList.add("bubble");
  userInputElement.insertAdjacentText("afterbegin", userInput);
  conversationArea.append(userInputElement);

  const aiResponse = await fetch(`${BACKEND_SERVER}/api/chat`, fetchOptions);
  const aiText = await aiResponse.json();
  console.log(aiText.response);

  const aiResponseElement = document.createElement("p");
  aiResponseElement.classList.add("aiResponseBubble");
  aiResponseElement.classList.add("bubble");
  aiResponseElement.insertAdjacentText("afterbegin", aiText.response);
  conversationArea.append(aiResponseElement);
}
