import React, { useEffect, useRef } from 'react'

const ChatWindow = ({ chatHistory }) => {
  const chatEndRef = useRef(null) //reference to scroll to the bottom of the chat

  //Auto-scrolls to the bottom of the chat when new messages are added
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [chatHistory]) //reruns when chatHistory changes

  return (
    <div className="chat-window">
      {/* loops through all chat messages to display them 1 by 1 */}
      {chatHistory.map((entry, index) => (
        <div
          key={index}
          className={`chat-message ${entry.role === 'user' ? 'user' : 'ai'}`}
        >
          {/* Distinguishes between user and AI */}
          <strong>
            {entry.role === 'user' ? 'You' : 'AI Interviewer'} :{' '}
          </strong>{' '}
          <span>{entry.text}</span>
        </div>
      ))}
      {/* dummy div used to scroll to the bottom of the chat */}
      <div ref={chatEndRef} />
    </div>
  )
}
export default ChatWindow
