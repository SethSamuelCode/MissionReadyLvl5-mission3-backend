import { useState } from 'react'
import Logo from './components/LogoHeader.jsx'
import JobTitleInput from './components/JobTitleInput.jsx'
import StartButton from './components/StartButton.jsx'

function InterviewApp() {
  const [jobTitle, setJobTitle] = useState('')

  const handleStart = async () => {
    if (!jobTitle.trim()) return alert('Please enter a job title')
  }

  return (
    <div className="app-container">
      <Logo />
      <JobTitleInput jobTitle={jobTitle} setJobTitle={setJobTitle} />
      {<StartButton onClick={handleStart} />}
    </div>
  )
}
export default InterviewApp
