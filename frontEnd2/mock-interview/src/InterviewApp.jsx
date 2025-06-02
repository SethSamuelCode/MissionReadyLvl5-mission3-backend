import { useState } from 'react'
import Logo from './components/LogoHeader.jsx'
import JobTitleInput from './components/JobTitleInput.jsx'

function InterviewApp() {
  const [jobTitle, setJobTitle] = useState('')

  return (
    <div className="app-container">
      <Logo />
      <JobTitleInput jobTitle={jobTitle} setJobTitle={setJobTitle} />
    </div>
  )
}
export default InterviewApp
