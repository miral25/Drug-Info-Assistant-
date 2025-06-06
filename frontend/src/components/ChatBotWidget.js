import React, { useState, useRef, useEffect } from 'react';
import fieldDescriptions from '../data/fieldDescriptions';
import '../styles/ChatBotWidget.css';

function ChatBotWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);

  const toggleWidget = () => {
    setOpen(!open);
    setInput('');
    setMessages([]); // Clear chat history on close (optional)
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const question = input.trim();
    const key = question.toLowerCase().replace(/\s+/g, '_');
    const answer = fieldDescriptions[key] || "Sorry, I don't have a description for that field.";

    setMessages((prev) => [
      ...prev,
      { from: 'user', text: question },
      { from: 'bot', text: answer },
    ]);
    setInput('');
  };

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="chatbot-container">
      {open ? (
        <div className="chatbot-box shadow">
          <div className="chatbot-header d-flex justify-content-between align-items-center">
            <strong>💬 Drug Info Assistant</strong>
            <button onClick={toggleWidget} className="btn-close btn-sm"></button>
          </div>

          <div className="chatbot-body">
            <div className="chatbot-history">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`chat-message ${msg.from === 'user' ? 'user' : 'bot'}`}
                >
                  {msg.text}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            <form onSubmit={handleSubmit} className="d-flex gap-2 mt-2">
              <input
                type="text"
                className="form-control"
                placeholder="Enter a field name..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button type="submit" className="btn btn-primary">Ask</button>
            </form>
          </div>
        </div>
      ) : (
        <button className="chatbot-toggle-btn" onClick={toggleWidget}>
          💬 Help
        </button>
      )}
    </div>
  );
}

export default ChatBotWidget;
