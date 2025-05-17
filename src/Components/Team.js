//Attendance


import React, { useState } from "react";

const sampleMembers = [
  {
    id: 1,
    name: "Ravi Kumar",
    employeeId: "EMP001",
    department: "Development",
    checkIn: "09:00 AM",
    checkOut: "05:00 PM",
    shift: "Morning",
    day: "Monday",
    status: "Present",
  },
  {
    id: 2,
    name: "Neha Sharma",
    employeeId: "EMP002",
    department: "Design",
    checkIn: "10:00 AM",
    checkOut: "06:00 PM",
    shift: "Day",
    day: "Monday",
    status: "Late",
  },
  {
    id: 3,
    name: "Ankit Verma",
    employeeId: "EMP003",
    department: "HR",
    checkIn: "09:15 AM",
    checkOut: "05:15 PM",
    shift: "Morning",
    day: "Monday",
    status: "Present",
  },
];

const Team = () => {
  const [search, setSearch] = useState("");
  const [members] = useState(sampleMembers);

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.employeeId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h4 className="title">Today's Attendance</h4>

      <div className="d-flex justify-content-end mb-2">
        <input
          type="text"
          placeholder="Search by Name or Employee ID"
          className="form-control w-50"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="table-card">
        <div className="table-responsive mt-3" style={{ maxHeight: '480px', overflowY: 'auto' }}>
          <table className="table table-hover table-nowrap awe">
            <thead className="table-bg" style={{ position: 'sticky', top: '0', zIndex: '1' }}>
              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Employee ID</th>
                <th>Department</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Shift</th>
                <th>Day</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.length ? (
                filteredMembers.map((member, index) => (
                  <tr key={member.id}>
                    <td>{index + 1}</td>
                    <td>{member.name}</td>
                    <td>{member.employeeId}</td>
                    <td>{member.department}</td>
                    <td>{member.checkIn}</td>
                    <td>{member.checkOut}</td>
                    <td>{member.shift}</td>
                    <td>{member.day}</td>
                    <td>{member.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center">
                    No records found.
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

export default Team;
