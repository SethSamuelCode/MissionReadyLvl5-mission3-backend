function JobTitleInput({ JobTitle, setJobTitle }) {
  return (
    <div className="job-title-container">
      <label>Job Title:</label>
      <input
        type="text"
        value={JobTitle}
        onChange={(e) => setJobTitle(e.target.value)}
        placeholder="Enter your job title"
      />
    </div>
  )
}
export default JobTitleInput
