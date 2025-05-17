// FileManagement.js
import React, { useState } from 'react';
import { Card, Button, Form } from 'react-bootstrap';

const FileManagement = () => {
  const [files, setFiles] = useState([]);

  const handleFileUpload = (e) => {
    const uploadedFiles = Array.from(e.target.files);
    setFiles([...files, ...uploadedFiles]);
  };

  return (
    <Card className="p-3">
      <h3>File Management</h3>
      <Form.File
        id="custom-file"
        label="Upload files"
        multiple
        onChange={handleFileUpload}
      />
      <div className="mt-3">
        {files?.map((file, index) => (
          <p key={index}>{file.name}</p>
        ))}
      </div>
    </Card>
  );
};

export default FileManagement;
