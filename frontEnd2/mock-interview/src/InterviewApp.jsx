import { useState } from 'react'
import Logo from './components/LogoHeader.jsx'
import JobTitleInput from './components/JobTitleInput.jsx'
import StartButton from './components/StartButton.jsx'
import UserInput from './components/UserInput.jsx'
import ChatWindow from './components/ChatWindow.jsx'

function InterviewApp() {
  const [jobTitle, setJobTitle] = useState('')
  const [userResponse, setUserResponse] = useState('')
  const [chatHistory, setChatHistory] = useState([])
  const [uuid, setUuid] = useState('')

  const handleStart = async () => {
    if (!jobTitle.trim()) {
      alert('Please enter a job title')
      return
    }
    try {
      // Send user input to the backend to start the interview
      const uuidResp = await fetch('http://localhost:3000/api/uuid')
      const uuidData = await uuidResp.json()
      setUuid(uuidData.uuid) // Stores the UUID for the session

      const chatResp = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userInput: 'start interview',
          job: jobTitle,
          uuid: uuidData.uuid,
        }),
      })
      const chatData = await chatResp.json()
      setChatHistory([{ role: 'ai', text: chatData.response }]) //AI response
    } catch (error) {
      console.error('Error starting interview:', error)
      alert('Failed to start interview. Please try again.')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!userResponse.trim()) {
      alert('Please enter a response')
      return
    }
    try {
      // Send user response to the backend
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userInput: userResponse,
          job: jobTitle,
          uuid: uuid,
        }),
      })
      const data = await response.json()
      // Update chat history with user response and AI response
      setChatHistory((prev) => [
        ...prev,
        { role: 'user', text: userResponse },
        { role: 'ai', text: data.response },
      ])

      setUserResponse('') // Clears user input after submission
    } catch (error) {
      console.error('Error sending response:', error)
      alert('Failed to send response. Please try again.')
    }
  }

  return (
    <div className="app-container">
      <Logo />
      <JobTitleInput jobTitle={jobTitle} setJobTitle={setJobTitle} />

      {<StartButton onClick={handleStart} />}
      {
        <UserInput
          userResponse={userResponse}
          setUserResponse={setUserResponse}
          handleSubmit={handleSubmit}
          chatHistory={chatHistory}
          setChatHistory={setChatHistory}
        />
      }
      <ChatWindow chatHistory={chatHistory} />
    </div>
  )
}
export default InterviewApp
