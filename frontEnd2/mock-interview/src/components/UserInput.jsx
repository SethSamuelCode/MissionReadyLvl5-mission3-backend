function UserInput({ userResponse, setUserResponse, handleSubmit }) {
  return (
    <div className="user-input-container">
      <input
        type="text"
        value={userResponse}
        onChange={(e) => setUserResponse(e.target.value)}
        placeholder="Type response here"
      />
      <button onClick={handleSubmit} className="submit-button">
        Send message
      </button>
    </div>
  )
}
export default UserInput
