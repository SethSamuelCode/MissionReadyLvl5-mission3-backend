import { useState, useEffect } from 'react'
import Logo from './components/LogoHeader.jsx'
import JobTitleInput from './components/JobTitleInput.jsx'
import StartButton from './components/StartButton.jsx'
import UserInput from './components/UserInput.jsx'

function InterviewApp() {
  const [jobTitle, setJobTitle] = useState('')
  const [userResponse, setUserResponse] = useState('')

  const handleStart = async () => {
    if (!jobTitle.trim()) return alert('Please enter a job title')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    //API call to send user input
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
        />
      }
    </div>
  )
}
export default InterviewApp
