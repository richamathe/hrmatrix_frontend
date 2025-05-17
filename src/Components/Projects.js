import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useSelector, useDispatch } from "react-redux";
import Select from "react-select";

import { projectTypes } from "../Utils/SelectOptions";

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  const [employees, setEmployees] = useState([]);

  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);

  const [newProject, setNewProject] = useState({
    name: "",
    designation: "",
    mobile: "",
    email: "",
    gender: "",
    birth: "",
    password: "",
    joining: "",
  });
  const fetchEmployeesFromStorage = () => {
    const stored = JSON.parse(localStorage.getItem("employees")) || [];
    setEmployees(stored);
    setFilteredEmployees(stored);
  };
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = employees.filter(
      (emp) =>
        emp.name.toLowerCase().includes(value) ||
        emp.mobile.toLowerCase().includes(value)
    );

    setFilteredEmployees(filtered);
  };

  useEffect(() => {
    fetchEmployeesFromStorage();
  }, []);

  const handleClose = () => {
    setShow(false);
    setIsEditing(false);
    setNewProject({
      name: "",
      designation: "",
      mobile: "",
      email: "",
      gender: "",
      birth: "",
      password: "",
      joining: "",
    });
    setCurrentProject(null);
  };

  const handleShow = () => {
    setShow(true);
  };

  const handleEdit = (project) => {
    setCurrentProject(project);
    setNewProject({
      name: project.name,
      designation: project.designation,
      mobile: project.mobile,
      email: project.email,
      gender: project.gender,
      birth: project.birth,
      address: project.password,
      joining: project.joining,
    });
    setIsEditing(true);
    setShow(true);
  };

  const handleAddOrEdit = () => {
    if (
      !newProject.name ||
      !newProject.designation ||
      !newProject.mobile ||
      !newProject.email ||
      !newProject.gender ||
      !newProject.birth ||
      !newProject.password ||
      !newProject.joining
    ) {
      toast.warn("Please fill in all required fields.");
      return;
    }

    let employees = JSON.parse(localStorage.getItem("employees")) || [];

    if (isEditing) {
      const updatedEmployees = employees.map((emp) =>
        emp.id === currentProject.id
          ? { ...currentProject, ...newProject }
          : emp
      );
      localStorage.setItem("employees", JSON.stringify(updatedEmployees));
      toast.success("Employee updated successfully.");
    } else {
      const newEmployee = { ...newProject, id: Date.now() };
      employees.push(newEmployee);
      localStorage.setItem("employees", JSON.stringify(employees));
      toast.success("Employee added successfully.");
    }

    handleClose();
    fetchEmployeesFromStorage(); // To re-render
  };

  return (
    <>
      <div>
        <h4 className="title px-4">All Employees</h4>
      </div>

      {/* Modal for Add/Edit Employee */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditing ? "Edit Employee" : "Add Employee"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            placeholder="Name"
            value={newProject.name}
            onChange={(e) =>
              setNewProject({ ...newProject, name: e.target.value })
            }
            className="form-control mb-2"
          />

          <Select
            placeholder="Designation"
            options={projectTypes}
            value={projectTypes.find(
              (option) => option.value === newProject.designation
            )}
            onChange={(option) =>
              setNewProject({ ...newProject, designation: option.value })
            }
            className="mb-2"
          />

          <input
            type="text"
            placeholder="Mobile No."
            value={newProject.mobile}
            onChange={(e) =>
              setNewProject({ ...newProject, mobile: e.target.value })
            }
            className="form-control mb-2"
          />

          <input
            type="email"
            placeholder="Email"
            value={newProject.email}
            onChange={(e) =>
              setNewProject({ ...newProject, email: e.target.value })
            }
            className="form-control mb-2"
          />

          <Select
            placeholder="Gender"
            options={[
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
            ]}
            value={{ value: newProject.gender, label: newProject.gender }}
            onChange={(option) =>
              setNewProject({ ...newProject, gender: option.value })
            }
            className="mb-2"
          />

          <input
            type="date"
            placeholder="Birth Date"
            value={newProject.birth}
            onChange={(e) =>
              setNewProject({ ...newProject, birth: e.target.value })
            }
            className="form-control mb-2"
          />

          <input
            type="text"
            placeholder="Address"
            value={newProject.address}
            onChange={(e) =>
              setNewProject({ ...newProject, address: e.target.value })
            }
            className="form-control mb-2"
          />

          <input
            type="date"
            placeholder="Joining Date"
            value={newProject.joining}
            onChange={(e) =>
              setNewProject({ ...newProject, joining: e.target.value })
            }
            className="form-control mb-2"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary close-btn" onClick={handleClose}>
            Close
          </Button>
          <Button className="bg-info view-btn" onClick={handleAddOrEdit}>
            {isEditing ? "Save Changes" : "Add Employee"}
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="table-card">
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3 px-3">
            <input
              type="text"
              placeholder="Search by Name or Mobile"
              value={searchTerm}
              onChange={handleSearch}
              className="form-control w-42 mx-3"
            />
            <Button onClick={handleShow} className="add-user-button bg-info">
              Add Employees
            </Button>
          </div>
        </div>

        <div className="table-responsive mt-3">
          <table className="table table-hover table-nowrap">
            <thead className="thead-light">
              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Designation</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>Gender</th>
                <th>DOB</th>
                <th>Password</th>
                <th>Joining Date</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length ? (
                filteredEmployees.map((emp, index) => (
                  <tr key={emp.id}>
                    <td>{index + 1}</td>
                    <td>{emp.name}</td>
                    <td>{emp.designation}</td>
                    <td>{emp.mobile}</td>
                    <td>{emp.email}</td>
                    <td>{emp.gender}</td>
                    <td>{emp.birth}</td>
                    <td>{emp.password}</td>
                    <td>{emp.joining}</td>
                    <td className="text-end">
                      <Button
                        onClick={() => handleEdit(emp)}
                        className="btn bg-info btn-sm view-btn"
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="text-center">
                    No Employees Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Projects;
