import React from "react";

const Payslip = ({ employee, onClose }) => {
  if (!employee) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4 py-8">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
          title="Close"
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Employee Payslip</h2>
          <p className="text-sm text-gray-500">Generated on {new Date().toLocaleDateString()}</p>
        </div>

        {/* Employee Info */}
        <div className="space-y-4 text-gray-700 text-sm sm:text-base">
          <div className="flex justify-between">
            <span className="font-medium">Emp ID</span>
            <span>{employee.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Name</span>
            <span>{employee.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Designation</span>
            <span>{employee.designation}</span>
          </div>
        </div>

        <hr className="my-5" />

        {/* Salary Info */}
        <div className="space-y-4 text-gray-700 text-sm sm:text-base">
          <div className="flex justify-between">
            <span className="font-medium">Base Package</span>
            <span>${employee.package.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Bonus</span>
            <span>${employee.bonus.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-lg font-semibold text-gray-900 border-t pt-4">
            <span>Total Salary</span>
            <span>${employee.totalSalary.toLocaleString()}</span>
          </div>
        </div>

        {/* Footer Button */}
        <div className="mt-6 text-right">
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payslip;
