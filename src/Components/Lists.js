// leave management

import React, { useState, useEffect } from "react";

const Lists = () => {
  const [leaveRequests, setLeaveRequests] = useState([
    {
      id: 1,
      empId: "EMP001",
      name: "Richa Mathe",
      applDate: "2025-04-10",
      status: "Pending",
      leaveFrom: "2025-04-16",
      leaveTo: "2025-04-18",
      leaveType: "Casual Leave",
      remark: "Attending family function",
    },
    {
      id: 2,
      empId: "EMP002",
      name: "Amit Jain",
      applDate: "2025-04-08",
      status: "Approved",
      leaveFrom: "2025-04-12",
      leaveTo: "2025-04-13",
      leaveType: "Sick Leave",
      remark: "Medical check-up",
    },
    {
      id: 3,
      empId: "EMP003",
      name: "Pratham Sharma",
      applDate: "2025-04-05",
      status: "Rejected",
      leaveFrom: "2025-04-09",
      leaveTo: "2025-04-10",
      leaveType: "Emergency Leave",
      remark: "Personal issue",
    },
  ]);

  const [newRequest, setNewRequest] = useState({
    empId: "",
    name: "",
    applDate: "",
    leaveFrom: "",
    leaveTo: "",
    leaveType: "",
    remark: "",
    status: "Pending",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRequest({ ...newRequest, [name]: value });
  };

  const handleAddRequest = () => {
    if (
      newRequest.empId &&
      newRequest.name &&
      newRequest.applDate &&
      newRequest.leaveFrom &&
      newRequest.leaveTo &&
      newRequest.leaveType
    ) {
      const newId = leaveRequests.length + 1;
      setLeaveRequests([...leaveRequests, { ...newRequest, id: newId }]);
      setNewRequest({
        empId: "",
        name: "",
        applDate: "",
        leaveFrom: "",
        leaveTo: "",
        leaveType: "",
        remark: "",
        status: "Pending",
      });
    } else {
      alert("Please fill all required fields");
    }
  };


  const handleStatusChange = (id, newStatus) => {
    setLeaveRequests(
      leaveRequests.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );
  };

  return (
    <div>
      <h4 className="title px-3 mb-3">All Leave Requests</h4>

      {/* Add New Leave Form */}
      <div className="px-3 mb-4">
        <div className="row g-2">
          <input
            type="text"
            name="empId"
            placeholder="Employee ID"
            className="form-control col"
            value={newRequest.empId}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="form-control col"
            value={newRequest.name}
            onChange={handleInputChange}
          />
          <input
            type="date"
            name="applDate"
            className="form-control col"
            value={newRequest.applDate}
            onChange={handleInputChange}
          />
          <input
            type="date"
            name="leaveFrom"
            className="form-control col"
            value={newRequest.leaveFrom}
            onChange={handleInputChange}
          />
          <input
            type="date"
            name="leaveTo"
            className="form-control col"
            value={newRequest.leaveTo}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="leaveType"
            placeholder="Leave Type"
            className="form-control col"
            value={newRequest.leaveType}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="remark"
            placeholder="Remark"
            className="form-control col"
            value={newRequest.remark}
            onChange={handleInputChange}
          />
          <button className="btn btn-success col" onClick={handleAddRequest}>
            Add Leave
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-card">
        <div
          className="table-responsive"
          style={{ maxHeight: "455px", overflowY: "auto", margin: "0 15px" }}
        >
          <table className="table table-hover table-nowrap">
            <thead className="thead-light" style={{ position: "sticky", top: 0, zIndex: 1 }}>
              <tr>
                <th>Emp ID</th>
                <th>Name</th>
                <th>Appl Date</th>
                <th>Status</th>
                <th>Leave From</th>
                <th>Leave To</th>
                <th>Leave Type</th>
                <th>Remark</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests.map((row) => (
                <tr key={row.id}>
                  <td>{row.empId}</td>
                  <td>{row.name}</td>
                  <td>{row.applDate}</td>
                  <td>{row.status}</td>
                  <td>{row.leaveFrom}</td>
                  <td>{row.leaveTo}</td>
                  <td>{row.leaveType}</td>
                  <td>{row.remark}</td>
                  <td>
                    {row.status === "Pending" ? (
                     <div className="d-flex gap-2">
                     <button
                       className="btn btn-success btn-sm"
                       onClick={() => handleStatusChange(row.id, "Approved")}
                     >
                       Approve
                     </button>
                     <button
                       className="btn btn-danger btn-sm"
                       onClick={() => handleStatusChange(row.id, "Rejected")}
                     >
                       Reject
                     </button>
                   </div>
                   
                    ) : (
                      <span className="text-muted">—</span>
                    )}
               
                  </td>
                </tr>
              ))}
              {leaveRequests.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center">
                    No leave requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Lists;
