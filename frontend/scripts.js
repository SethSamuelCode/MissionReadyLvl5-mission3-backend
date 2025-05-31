"use strict"
console.log("hello world");

const textArea = document.querySelector("#convoDisplayArea")
const userInputForm = document.querySelector("#userInputForm")
const userTextInputArea = document.querySelector("#userInput")
const jobDescriptionInput = document.querySelector("#jobDescription")
userInputForm.addEventListener("submit",sendToAI)

async function sendToAI(e){
    e.preventDefault()
    const userInput= userTextInputArea.value;
    console.log(userInput)
    userTextInputArea.value=""

    const fetchOptions ={
        method: 'post',
            headers: {
        'Content-Type': 'application/json'
    },
      body: JSON.stringify({
        uuid:44332,
        job:jobDescriptionInput.value,
        userInput:userInput
      })  
    }


    const aiResponse= await fetch("http://localhost:4000/api/chat",fetchOptions)
    const aiText = await aiResponse.json()
    console.log(aiText.response)


}