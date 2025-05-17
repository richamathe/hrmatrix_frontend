import React, { useState } from "react";
import Payslip from "./Payslip";

const Payroll = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Sample employee data
  const employees = [
    {
      id: "Emp-001",
      name: "Anthony Lewis",
      designation: "Finance",
      package: 50000,
      bonus: 5000,
      totalSalary: 55000,
      avatarLetter: "A",
    },
    {
      id: "Emp-002",
      name: "Brian Villalobos",
      designation: "Developer",
      package: 45000,
      bonus: 3000,
      totalSalary: 48000,
      avatarLetter: "B",
    },
    {
      id: "Emp-003",
      name: "Harvey Smith",
      designation: "Executive",
      package: 20000,
      bonus: 1000,
      totalSalary: 21000,
      avatarLetter: "H",
    },
  ];

  // Empty data for simulating the attendance page empty rows
  const emptyRows = [1, 2, 3, 4];

  return (
    <div className="p-6 bg-gray-50">
      {/* Employee Salary Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-medium text-gray-800">
            Employee Salary
          </h1>
          <div className="text-sm text-gray-500">/ HR / Employee Salary</div>
        </div>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded">
            Export
          </button>
          <button className="px-4 py-2 bg-orange-500 text-white rounded">
            Add Salary
          </button>
        </div>
      </div>

      {/* Content Card */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* Card Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-medium text-gray-700">
              Employee Salary List
              <span className="ml-2 text-sm text-gray-500">
                03/28/2025 - 04/03/2025
              </span>
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Designation</span>
            <span className="text-gray-600">Sort By : Last 7 Days</span>
          </div>
        </div>

        {/* Table Controls */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <span className="text-gray-600 mr-2">Row Per Page</span>
            <select
              className="border rounded px-2 py-1"
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(parseInt(e.target.value))}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
            <span className="ml-4 text-gray-600">Entries</span>
          </div>

          <div>
            <input
              type="text"
              placeholder="Search..."
              className="border rounded px-4 py-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Employee Salary Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 pl-4 text-left">Emp ID</th>
                <th className="p-3 text-left font-medium text-gray-600">
                  Name
                </th>
                <th className="p-3 text-left font-medium text-gray-600">
                  Designation
                </th>
                <th className="p-3 text-left font-medium text-gray-600">
                  Package
                </th>
                <th className="p-3 text-left font-medium text-gray-600">
                  Bonus
                </th>
                <th className="p-3 text-left font-medium text-gray-600">
                  Total Salary
                </th>
                <th className="p-3 text-left font-medium text-gray-600">
                  Payslip
                </th>
              </tr>
            </thead>

            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id} className="border-t border-gray-100">
                  <td className="p-4">{employee.id}</td>
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center mr-3">
                        {employee.avatarLetter}
                      </div>
                      <div className="font-medium">{employee.name}</div>
                    </div>
                  </td>
                  <td className="p-4">{employee.designation}</td>
                  <td className="p-4">${employee.package}</td>
                  <td className="p-4">${employee.bonus}</td>
                  <td className="p-4">${employee.totalSalary}</td>
                  <td className="p-4">
                    <button
                      className="px-3 py-1 bg-gray-800 text-white rounded text-sm"
                      onClick={() => setSelectedEmployee(employee)}
                    >
                      Generate Slip
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedEmployee && (
          <Payslip
            employee={selectedEmployee}
            onClose={() => setSelectedEmployee(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Payroll;
