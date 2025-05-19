import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Projects = ({ role, userName }) => {
  const navigate = useNavigate();
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const projects = useSelector((state) => state.project.projects);

  const filteredProjects = projects?.filter((project) => {
    const leadName = project?.lead?.split(" ")[0]?.toLowerCase();
    if (leadName === userName) return true;
  });

  const employees = [
    {
      id: 1,
      name: "Jack",
      mobile: "+1 555-123-4567",
      email: "beond@example.com",
      gender: "Non-binary",
      joiningDate: "05-06-2019",
    },
    {
      id: 2,
      name: "Jane Smith",
      mobile: "+1 222-333-4444",
      email: "jane.smith@example.com",
      gender: "Female",
      joiningDate: "20-04-2018",
    },
    {
      id: 3,
      name: "Alex Johnson",
      mobile: "+1 777-888-9999",
      email: "alex.johnson@example.com",
      gender: "Male",
      joiningDate: "17-08-2022",
    },
  ];

  const handleView = (employee) => {
    setSelectedEmployee(employee);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEmployee(null);
  };

  return (
    <div>
      {/* <div className="px-3">
        <h5 className="table-title">Overview</h5>
      </div>
      <div className="table-responsive">
        <table className="table table-hover table-sm table-bordered mb-0">
          <thead className="table-bg">
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Mobile</th>
              <th>Email</th>
              <th>Gender</th>
              <th>Joining Date</th>
              <th className="text-end">Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.length > 0 ? (
              employees.map((employee, index) => (
                <tr key={employee.id}>
                  <td>{index + 1}</td>
                  <td>{employee.name}</td>
                  <td>{employee.mobile}</td>
                  <td>{employee.email}</td>
                  <td>{employee.gender}</td>
                  <td>{employee.joiningDate}</td>
                  <td className="text-end">
                    <Button
                      // variant="info"
                      size="sm"
                      onClick={() => handleView(employee)}
                      className="text-white"
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">No Record Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && selectedEmployee && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-3">
              <div className="modal-header">
                <h5 className="modal-title">{selectedEmployee.name}</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <p><strong>Email:</strong> {selectedEmployee.email}</p>
                <p><strong>Mobile:</strong> {selectedEmployee.mobile}</p>
                <p><strong>Gender:</strong> {selectedEmployee.gender}</p>
                <p><strong>Joining Date:</strong> {selectedEmployee.joiningDate}</p>
              </div>
              <div className="modal-footer">
                <Button variant="secondary" onClick={closeModal}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default Projects;
