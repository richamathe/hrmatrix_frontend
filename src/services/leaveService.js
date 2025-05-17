import api from './api';
import notificationService from './notificationService';

// Mock data for leave balances and history
const mockLeaveData = {
  balances: {
    '1': { // Employee ID
      casual: { total: 12, used: 3, remaining: 9 },
      sick: { total: 10, used: 2, remaining: 8 },
      earned: { total: 15, used: 0, remaining: 15 },
      paternity: { total: 5, used: 0, remaining: 5 },
      maternity: { total: 0, used: 0, remaining: 0 }
    },
    '2': {
      casual: { total: 12, used: 5, remaining: 7 },
      sick: { total: 10, used: 1, remaining: 9 },
      earned: { total: 15, used: 3, remaining: 12 },
      paternity: { total: 0, used: 0, remaining: 0 },
      maternity: { total: 90, used: 0, remaining: 90 }
    }
  },
  requests: [
    {
      id: '1',
      employeeId: '1',
      employeeName: 'Alex Johnson',
      department: 'Engineering',
      leaveType: 'Casual Leave',
      fromDate: '2025-05-15',
      toDate: '2025-05-17',
      days: 3,
      reason: 'Family function',
      status: 'Approved',
      appliedOn: '2025-05-01',
      approvedBy: 'HR Manager',
      approvedOn: '2025-05-02',
      comments: 'Approved as requested'
    },
    {
      id: '2',
      employeeId: '1',
      employeeName: 'Alex Johnson',
      department: 'Engineering',
      leaveType: 'Sick Leave',
      fromDate: '2025-04-10',
      toDate: '2025-04-11',
      days: 2,
      reason: 'Not feeling well',
      status: 'Approved',
      appliedOn: '2025-04-09',
      approvedBy: 'HR Manager',
      approvedOn: '2025-04-09',
      comments: 'Get well soon'
    },
    {
      id: '3',
      employeeId: '1',
      employeeName: 'Alex Johnson',
      department: 'Engineering',
      leaveType: 'Casual Leave',
      fromDate: '2025-06-05',
      toDate: '2025-06-05',
      days: 1,
      reason: 'Personal work',
      status: 'Pending',
      appliedOn: '2025-05-25',
      approvedBy: '',
      approvedOn: '',
      comments: ''
    },
    {
      id: '4',
      employeeId: '2',
      employeeName: 'Sarah Miller',
      department: 'Design',
      leaveType: 'Casual Leave',
      fromDate: '2025-05-20',
      toDate: '2025-05-22',
      days: 3,
      reason: 'Vacation',
      status: 'Approved',
      appliedOn: '2025-05-10',
      approvedBy: 'HR Manager',
      approvedOn: '2025-05-11',
      comments: 'Enjoy your vacation'
    }
  ],
  holidays: [
    { name: 'New Year', date: '2025-01-01' },
    { name: 'Republic Day', date: '2025-01-26' },
    { name: 'Holi', date: '2025-03-14' },
    { name: 'Good Friday', date: '2025-04-18' },
    { name: 'Labor Day', date: '2025-05-01' },
    { name: 'Independence Day', date: '2025-08-15' },
    { name: 'Gandhi Jayanti', date: '2025-10-02' },
    { name: 'Diwali', date: '2025-11-12' },
    { name: 'Christmas', date: '2025-12-25' }
  ]
};

// Helper function to format date as YYYY-MM-DD
const formatDate = (date) => {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

// Helper function to calculate number of days between two dates
const calculateDays = (fromDate, toDate) => {
  const start = new Date(fromDate);
  const end = new Date(toDate);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

// Leave service
export const leaveService = {
  // Request leave (employee)
  requestLeave: async (leaveData) => {
    return api.post('/leave', leaveData);
  },
  // Get own leaves (employee)
  getMyLeaves: async () => {
    return api.get('/leave/my');
  },
  // Get own leave balance (employee)
  getMyLeaveBalance: async () => {
    return api.get('/leave/my-balance');
  },
  // Get all leaves (HR)
  getAllLeaves: async () => {
    return api.get('/leave/all');
  },
  // Approve/Reject leave (HR)
  updateLeaveStatus: async (leaveId, status) => {
    return api.put(`/leave/${leaveId}`, { status });
  },
  // Get leave balances for an employee
  getLeaveBalances: async (employeeId) => {
    try {
      // In a real app, this would be an API call
      // const response = await api.get(`/leave/balances/${employeeId}`);

      // For now, use mock data
      const balances = mockLeaveData.balances[employeeId] || {
        casual: { total: 12, used: 0, remaining: 12 },
        sick: { total: 10, used: 0, remaining: 10 },
        earned: { total: 15, used: 0, remaining: 15 },
        paternity: { total: 5, used: 0, remaining: 5 },
        maternity: { total: 0, used: 0, remaining: 0 }
      };

      return { data: { balances } };
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Network error' };
    }
  },

  // Get leave requests for an employee
  getLeaveRequests: async (employeeId) => {
    try {
      // In a real app, this would be an API call
      // const response = await api.get(`/leave/requests/${employeeId}`);

      // For now, filter mock data
      const requests = mockLeaveData.requests.filter(
        request => request.employeeId === employeeId
      );

      return { data: { requests } };
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Network error' };
    }
  },

  // Get all leave requests (HR only)
  getAllLeaveRequests: async (filters = {}) => {
    try {
      // In a real app, this would be an API call with filters
      // const response = await api.get('/leave/requests', { params: filters });

      // For now, filter mock data
      let requests = [...mockLeaveData.requests];

      // Apply filters
      if (filters.employeeId) {
        requests = requests.filter(request => request.employeeId === filters.employeeId);
      }

      if (filters.status) {
        requests = requests.filter(request => request.status === filters.status);
      }

      if (filters.fromDate) {
        requests = requests.filter(request => request.fromDate >= filters.fromDate);
      }

      if (filters.toDate) {
        requests = requests.filter(request => request.toDate <= filters.toDate);
      }

      if (filters.department) {
        requests = requests.filter(request => request.department === filters.department);
      }

      return { data: { requests } };
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Network error' };
    }
  },

  // Submit a leave request
  submitLeaveRequest: async (requestData) => {
    try {
      // In a real app, this would be an API call
      // const response = await api.post('/leave/requests', requestData);

      // Calculate days if not provided
      if (!requestData.days) {
        requestData.days = calculateDays(requestData.fromDate, requestData.toDate);
      }

      // For now, add to mock data
      const newRequest = {
        id: `${Date.now()}`,
        status: 'Pending',
        appliedOn: formatDate(new Date()),
        approvedBy: '',
        approvedOn: '',
        comments: '',
        ...requestData
      };

      mockLeaveData.requests.push(newRequest);

      // Update leave balance
      const employeeId = requestData.employeeId;
      const leaveType = requestData.leaveType.toLowerCase().includes('casual') ? 'casual' :
                        requestData.leaveType.toLowerCase().includes('sick') ? 'sick' :
                        requestData.leaveType.toLowerCase().includes('earned') ? 'earned' :
                        requestData.leaveType.toLowerCase().includes('paternity') ? 'paternity' :
                        requestData.leaveType.toLowerCase().includes('maternity') ? 'maternity' : 'casual';

      // Only update balance if employee exists in mock data
      if (mockLeaveData.balances[employeeId]) {
        // Don't update balance for pending requests
      }

      return {
        data: {
          request: newRequest,
          message: 'Leave request submitted successfully'
        }
      };
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Network error' };
    }
  },

  // Update leave request status (HR only)
  updateLeaveRequestStatus: async (requestId, status, comments = '') => {
    try {
      // In a real app, this would be an API call
      // const response = await api.put(`/leave/requests/${requestId}`, { status, comments });

      // For now, update mock data
      const requestIndex = mockLeaveData.requests.findIndex(
        request => request.id === requestId
      );

      if (requestIndex >= 0) {
        const request = mockLeaveData.requests[requestIndex];

        // Update request
        const updatedRequest = {
          ...request,
          status,
          approvedBy: 'HR Manager',
          approvedOn: formatDate(new Date()),
          comments
        };

        mockLeaveData.requests[requestIndex] = updatedRequest;

        // Update leave balance if approved
        if (status === 'Approved') {
          const employeeId = request.employeeId;
          const leaveType = request.leaveType.toLowerCase().includes('casual') ? 'casual' :
                          request.leaveType.toLowerCase().includes('sick') ? 'sick' :
                          request.leaveType.toLowerCase().includes('earned') ? 'earned' :
                          request.leaveType.toLowerCase().includes('paternity') ? 'paternity' :
                          request.leaveType.toLowerCase().includes('maternity') ? 'maternity' : 'casual';

          // Only update balance if employee exists in mock data
          if (mockLeaveData.balances[employeeId] && mockLeaveData.balances[employeeId][leaveType]) {
            mockLeaveData.balances[employeeId][leaveType].used += request.days;
            mockLeaveData.balances[employeeId][leaveType].remaining =
              mockLeaveData.balances[employeeId][leaveType].total -
              mockLeaveData.balances[employeeId][leaveType].used;
          }
        }

        // Send notification to employee
        try {
          await notificationService.addLeaveStatusNotification(
            updatedRequest,
            status,
            comments
          );
        } catch (notificationError) {
          console.error('Failed to send notification:', notificationError);
          // Continue with the process even if notification fails
        }

        return {
          data: {
            request: updatedRequest,
            message: `Leave request ${status.toLowerCase()} successfully`
          }
        };
      } else {
        throw { message: 'Leave request not found' };
      }
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Network error' };
    }
  },

  // Get holidays
  getHolidays: async (year) => {
    try {
      // In a real app, this would be an API call
      // const response = await api.get(`/leave/holidays?year=${year}`);

      // For now, use mock data
      const holidays = [...mockLeaveData.holidays];

      // Filter by year if provided
      if (year) {
        const yearStr = year.toString();
        return { data: { holidays: holidays.filter(h => h.date.startsWith(yearStr)) } };
      }

      return { data: { holidays } };
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Network error' };
    }
  },
  formatDate,
  calculateDays
};
