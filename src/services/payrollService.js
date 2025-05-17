import api from './api';

const payrollService = {
  // Trigger payroll calculation for a month/year
  calculatePayroll: async ({ month, year, bonus = 0 }) => {
    const response = await api.post('/payroll/calculate', { month, year, bonus });
    return response.data;
  },

  // List payrolls (optionally filter by month/year/user)
  getPayrolls: async (params = {}) => {
    const response = await api.get('/payroll', { params });
    return response.data;
  },

  // Get payroll by ID
  getPayrollById: async (id) => {
    const response = await api.get(`/payroll/${id}`);
    return response.data;
  },

  // Generate payslip for a payroll
  generatePayslip: async (payrollId) => {
    const response = await api.post(`/payroll/${payrollId}/payslip`);
    return response.data;
  },

  // (Optional) Get payslip by ID (if you add a GET endpoint for payslip)
  // getPayslipById: async (id) => {
  //   const response = await api.get(`/payslip/${id}`);
  //   return response.data;
  // },
};

export default payrollService; 