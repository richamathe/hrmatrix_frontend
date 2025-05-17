import api from './api';

// Mock data for attendance records
const mockAttendanceData = {
  records: [
    {
      id: '1',
      employee_id: '1',
      employee_name: 'Ravi Kumar',
      date: '2025-05-01',
      check_in: '09:00:00',
      check_out: '17:30:00',
      status: 'Present',
      department: 'Development'
    },
    {
      id: '2',
      employee_id: '1',
      employee_name: 'Ravi Kumar',
      date: '2025-05-02',
      check_in: '09:15:00',
      check_out: '17:45:00',
      status: 'Present',
      department: 'Development'
    },
    {
      id: '3',
      employee_id: '2',
      employee_name: 'Neha Sharma',
      date: '2025-05-01',
      check_in: '10:00:00',
      check_out: '18:00:00',
      status: 'Late',
      department: 'Design'
    },
    {
      id: '4',
      employee_id: '2',
      employee_name: 'Neha Sharma',
      date: '2025-05-02',
      check_in: '09:30:00',
      check_out: '17:30:00',
      status: 'Present',
      department: 'Design'
    },
    {
      id: '5',
      employee_id: '3',
      employee_name: 'Ankit Verma',
      date: '2025-05-01',
      check_in: '09:15:00',
      check_out: '17:15:00',
      status: 'Present',
      department: 'HR'
    }
  ],
  leaveRequests: [
    {
      id: '1',
      employee_id: '1',
      employee_name: 'Ravi Kumar',
      from_date: '2025-05-10',
      to_date: '2025-05-12',
      reason: 'Family function',
      status: 'Pending',
      department: 'Development',
      applied_on: '2025-05-05'
    },
    {
      id: '2',
      employee_id: '2',
      employee_name: 'Neha Sharma',
      from_date: '2025-05-15',
      to_date: '2025-05-16',
      reason: 'Medical appointment',
      status: 'Approved',
      department: 'Design',
      applied_on: '2025-05-03'
    }
  ]
};

// Helper function to format date as YYYY-MM-DD
const formatDate = (date) => {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

// Helper function to format time as HH:MM:SS
const formatTime = (date) => {
  const d = new Date(date);
  return d.toTimeString().split(' ')[0];
};

// Helper function to format time for display (12-hour format)
const formatTimeForDisplay = (timeString) => {
  if (!timeString) return '';
  const [hours, minutes] = timeString.split(':');
  const h = parseInt(hours, 10);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${minutes} ${period}`;
};

// Helper function to calculate working hours between check-in and check-out
const calculateWorkingHours = (checkInTime, checkOutTime) => {
  if (!checkInTime || !checkOutTime) return null;
  try {
    const [checkInHours, checkInMinutes, checkInSeconds] = checkInTime.split(':').map(Number);
    const [checkOutHours, checkOutMinutes, checkOutSeconds] = checkOutTime.split(':').map(Number);
    const today = new Date();
    const checkIn = new Date(today);
    checkIn.setHours(checkInHours, checkInMinutes, checkInSeconds);
    const checkOut = new Date(today);
    checkOut.setHours(checkOutHours, checkOutMinutes, checkOutSeconds);
    let diffMs = checkOut - checkIn;
    if (diffMs < 0) {
      diffMs += 24 * 60 * 60 * 1000;
    }
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return {
      hours: diffHours,
      minutes: diffMinutes,
      totalHours: diffHours + (diffMinutes / 60),
      formatted: `${diffHours}h ${diffMinutes}m`
    };
  } catch (error) {
    console.error('Error calculating working hours:', error);
    return null;
  }
};

// Attendance service
export const attendanceService = {
  // Employee: Check-in
  checkIn: async () => {
    return api.post('/attendance/checkin');
  },
  // Employee: Check-out
  checkOut: async () => {
    return api.post('/attendance/checkout');
  },
  // Employee: Get own attendance
  getEmployeeAttendance: async () => {
    return api.get('/attendance/my');
  },
  // HR: Get all attendance
  getAllAttendance: async (date, department, status) => {
    return api.get('/attendance', { params: { date, department, status } });
  },
  // Submit leave request
  submitLeaveRequest: async (leaveData) => {
    try {
      // In a real app, this would be an API call
      // const response = await api.post('/attendance/leave', leaveData);

      // For now, add to mock data
      const newLeaveRequest = {
        id: `${Date.now()}`,
        ...leaveData,
        status: 'Pending',
        applied_on: formatDate(new Date())
      };

      mockAttendanceData.leaveRequests.push(newLeaveRequest);

      return {
        data: {
          leaveRequest: newLeaveRequest,
          message: 'Leave request submitted successfully'
        }
      };
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Network error' };
    }
  },

  // Get leave requests for an employee
  getEmployeeLeaveRequests: async (employeeId) => {
    try {
      // In a real app, this would be an API call
      // const response = await api.get(`/attendance/leave/${employeeId}`);

      // For now, filter mock data
      const leaveRequests = mockAttendanceData.leaveRequests.filter(
        request => request.employee_id === employeeId
      );

      return { data: { leaveRequests } };
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Network error' };
    }
  },

  // Get all leave requests (HR only)
  getAllLeaveRequests: async (status) => {
    try {
      // In a real app, this would be an API call with filters
      // const response = await api.get('/attendance/leave', { params: { status } });

      // For now, filter mock data
      let leaveRequests = [...mockAttendanceData.leaveRequests];

      if (status) {
        leaveRequests = leaveRequests.filter(request => request.status === status);
      }

      return { data: { leaveRequests } };
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Network error' };
    }
  },

  // Update leave request status (HR only)
  updateLeaveRequestStatus: async (requestId, status) => {
    try {
      // In a real app, this would be an API call
      // const response = await api.put(`/attendance/leave/${requestId}`, { status });

      // For now, update mock data
      const requestIndex = mockAttendanceData.leaveRequests.findIndex(
        request => request.id === requestId
      );

      if (requestIndex >= 0) {
        mockAttendanceData.leaveRequests[requestIndex].status = status;

        return {
          data: {
            leaveRequest: mockAttendanceData.leaveRequests[requestIndex],
            message: `Leave request ${status.toLowerCase()}`
          }
        };
      } else {
        throw { message: 'Leave request not found' };
      }
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Network error' };
    }
  },

  // Helper functions
  formatTimeForDisplay,
  calculateWorkingHours
};
