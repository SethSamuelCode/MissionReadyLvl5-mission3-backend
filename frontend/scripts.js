"use strict";
console.log("hello world");

const conversationArea = document.querySelector("#convoDisplayArea");
const userInputForm = document.querySelector("#userInputForm");
const userTextInputArea = document.querySelector("#userInput");
const jobDescriptionInput = document.querySelector("#jobDescription");
userInputForm.addEventListener("submit", sendToAI);

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
      uuid: 44332,
      job: jobDescriptionInput.value,
      userInput: userInput,
    }),
  };
  const userInputElement = document.createElement("p");
  userInputElement.classList.add("userInputBubble");
  userInputElement.classList.add("bubble");
  userInputElement.insertAdjacentText("afterbegin", userInput);
  conversationArea.append(userInputElement);

  const aiResponse = await fetch("http://localhost:4000/api/chat", fetchOptions);
  const aiText = await aiResponse.json();
  console.log(aiText.response);

  const aiResponseElement = document.createElement("p");
  aiResponseElement.classList.add("aiResponseBubble");
  aiResponseElement.classList.add("bubble");
  aiResponseElement.insertAdjacentText("afterbegin", aiText.response);
  conversationArea.append(aiResponseElement);
}
