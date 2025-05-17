import React, { useState } from "react";

const HelpSupport = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      subject: "Issue with payslip",
      status: "Unread",
      time: "10:15 AM",
      message: "Hi HR, I didn't receive my payslip for last month...",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      subject: "Leave balance clarification",
      status: "Resolved",
      time: "Yesterday",
      message: "Can you please clarify my leave balance?",
    },
  ]);

  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState("");

  const handleSelectMessage = (message) => {
    setSelectedMessage(message);
    if (message.status === "Unread") {
      // Mark as read
      setMessages(
        messages.map((msg) =>
          msg.id === message.id ? { ...msg, status: "Read" } : msg
        )
      );
    }
  };

  const handleReply = () => {
    if (!replyText.trim()) return;
    
    // In a real app, this would send the reply to the backend
    alert(`Reply sent to ${selectedMessage.name}: ${replyText}`);
    
    // Mark as resolved
    setMessages(
      messages.map((msg) =>
        msg.id === selectedMessage.id ? { ...msg, status: "Resolved" } : msg
      )
    );
    
    setReplyText("");
  };

  const handleFilter = (filter) => {
    // Filter messages based on status
    console.log(`Filtering by: ${filter}`);
    // This would filter the messages in a real app
  };

  return (
    <div className="container-fluid p-0">
      <div className="row g-0">
        {/* Sidebar */}
        <div className="col-md-3 border-end">
          <div className="p-3 bg-light">
            <h4 className="mb-3">Help & Support</h4>
            <div className="list-group">
              <button 
                className="list-group-item list-group-item-action active"
                onClick={() => handleFilter("all")}
              >
                All Messages
              </button>
              <button 
                className="list-group-item list-group-item-action"
                onClick={() => handleFilter("unread")}
              >
                Unread
              </button>
              <button 
                className="list-group-item list-group-item-action"
                onClick={() => handleFilter("resolved")}
              >
                Resolved
              </button>
            </div>
          </div>
        </div>
        
        {/* Message List */}
        <div className="col-md-3 border-end">
          <div className="p-3">
            <h5 className="mb-3">Inbox</h5>
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`card mb-2 ${message.status === "Unread" ? "border-primary" : ""}`}
                onClick={() => handleSelectMessage(message)}
                style={{ cursor: "pointer" }}
              >
                <div className="card-body py-2 px-3">
                  <h6 className="card-title mb-1">
                    {message.subject}
                    {message.status === "Unread" && (
                      <span className="badge bg-primary float-end">New</span>
                    )}
                  </h6>
                  <p className="card-text small text-muted mb-0">
                    {message.name} • {message.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Message Content */}
        <div className="col-md-6">
          {selectedMessage ? (
            <div className="p-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5>{selectedMessage.subject}</h5>
                <span className={`badge ${selectedMessage.status === "Resolved" ? "bg-success" : "bg-secondary"}`}>
                  {selectedMessage.status}
                </span>
              </div>
              
              <div className="card mb-3">
                <div className="card-body">
                  <div className="d-flex justify-content-between mb-2">
                    <div>
                      <strong>{selectedMessage.name}</strong> ({selectedMessage.email})
                    </div>
                    <small className="text-muted">{selectedMessage.time}</small>
                  </div>
                  <p>{selectedMessage.message}</p>
                </div>
              </div>
              
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title">Reply</h6>
                  <textarea 
                    className="form-control mb-3" 
                    rows="4"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply here..."
                  ></textarea>
                  <button 
                    className="btn btn-primary"
                    onClick={handleReply}
                  >
                    Send Reply
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="d-flex justify-content-center align-items-center h-100 text-muted">
              Select a message to view
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;
