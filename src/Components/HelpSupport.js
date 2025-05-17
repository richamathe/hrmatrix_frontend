// // HelpSupport.js
// import React, { useState } from "react";
// import { Card, Form, Button, Modal, ListGroup } from "react-bootstrap";
// import { useSelector, useDispatch } from "react-redux";
// import { toast } from "react-toastify";
// import { setSupportData } from "../redux/slices/authSlice";

// const HelpSupport = () => {
//   const dispatch = useDispatch();
//   const user = useSelector((state) => state.auth.user);
//   const supportData = useSelector((state) => state.auth.supportData);
//   const { role } = user;

//   const [message, setMessage] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [selectedMessage, setSelectedMessage] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (message.trim() === "") {
//       toast.error("Please enter a message");
//       return;
//     }
//     let payload = {
//       username: user.fullName,
//       message: message,
//       user: user.id,
//     };
//     dispatch(setSupportData(payload));
//     setMessage("");
//     toast.success(
//       `Your issue's solution will be shared with you via email very soon.`
//     );
//   };

//   const handleShowModal = (message) => {
//     setSelectedMessage(message);
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setSelectedMessage("");
//   };

//   return (
//     <Card className="p-3">
//       <h3>Help & Support</h3>
//       {role === "user" ? (
//         <>
//           <p>
//             For any assistance, please check our FAQs or contact us directly.
//           </p>
//           <Form onSubmit={handleSubmit}>
//             {/* <Form.Group controlId='formBasicEmail'>
//           <Form.Label>Email address</Form.Label>
//           <Form.Control type='email' placeholder='Enter email' />
//         </Form.Group> */}
//             <Form.Group controlId="formBasicMessage">
//               <Form.Label>Message</Form.Label>
//               <Form.Control
//                 as="textarea"
//                 rows={3}
//                 placeholder="Your message"
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//               />
//             </Form.Group>
//             <Button variant="primary" type="submit" className="mt-2">
//               Submit
//             </Button>
//           </Form>
//         </>
//       ) : (
//         <>
//           <div className="container mt-4">
//             {/* ListGroup to display the messages */}
//             <ListGroup>
//               {supportData?.map((item) => (
//                 <ListGroup.Item
//                   key={item.id}
//                   action
//                   onClick={() => handleShowModal(item.message)}
//                 >
//                   User: {item.username}, Message:{" "}
//                   {item.message.substring(0, 30)}
//                   ...
//                 </ListGroup.Item>
//               ))}
//             </ListGroup>

//             {/* Modal to display the selected message */}
//             <Modal show={showModal} onHide={handleCloseModal} centered>
//               <Modal.Header closeButton>
//                 <Modal.Title>Message Details</Modal.Title>
//               </Modal.Header>
//               <Modal.Body>{selectedMessage}</Modal.Body>
//               <Modal.Footer>
//                 <Button variant="secondary" onClick={handleCloseModal}>
//                   Close
//                 </Button>
//               </Modal.Footer>
//             </Modal>
//           </div>
//         </>
//       )}
//     </Card>
//   );
// };

// export default HelpSupport;
// HelpSupport.js
import React from "react";
import { Button } from "react-bootstrap";

const HelpSupport = () => {
  const messages = [
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
  ];

  const selectedMessage = messages[0]; // Simulating selected message

  return (
    <div className="help-support-container">
      {/* Sidebar */}
      <div className="help-sidebar">
        <h5>Filters</h5>
        <ul>
          <li className="active">All Messages</li>
          <li>Unread</li>
          <li>Resolved</li>
        </ul>
      </div>

      {/* Message List */}
      <div className="help-message-list">
        <h4>Inbox</h4>
        {messages.map((msg) => (
          <div className={`help-msg-card ${msg.status === "Unread" ? "unread" : ""}`} key={msg.id}>
            <h6>{msg.subject}</h6>
            <p>{msg.name} • {msg.time}</p>
          </div>
        ))}
      </div>

      {/* Message Details */}
      <div className="help-msg-detail">
        <h5>{selectedMessage.subject}</h5>
        <p><strong>From:</strong> {selectedMessage.name} ({selectedMessage.email})</p>
        <p>{selectedMessage.message}</p>
        <textarea className="reply-box" rows="4" placeholder="Write a reply..."></textarea>
        <Button className="mt-2 send-reply">Send Reply</Button>
      </div>
    </div>
  );
};

export default HelpSupport;
