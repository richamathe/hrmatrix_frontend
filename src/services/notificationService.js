// Mock storage for notifications
let notifications = [
  {
    id: 1,
    employeeId: '1',
    type: 'leave',
    title: 'Leave Request Approved',
    message: 'Your leave request for May 15-17 has been approved.',
    date: '2025-04-28T09:30:00',
    read: false
  },
  {
    id: 2,
    employeeId: '1',
    type: 'payroll',
    title: 'Salary Credited',
    message: 'Your salary for April 2025 has been credited to your account.',
    date: '2025-04-25T14:15:00',
    read: false
  },
  {
    id: 3,
    employeeId: '1',
    type: 'attendance',
    title: 'Attendance Reminder',
    message: 'You have been late 2 times this month. Please ensure punctuality.',
    date: '2025-04-20T08:45:00',
    read: true
  },
  {
    id: 4,
    employeeId: '2',
    type: 'general',
    title: 'Company Holiday',
    message: 'Reminder: The office will be closed on May 1st for Labor Day.',
    date: '2025-04-15T11:20:00',
    read: true
  },
  {
    id: 5,
    employeeId: '2',
    type: 'leave',
    title: 'Leave Balance Update',
    message: 'Your annual leave balance has been updated. You have 14 days remaining.',
    date: '2025-04-10T16:05:00',
    read: true
  }
];

// Event listeners for notification updates
const listeners = [];

// Helper function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Notification service
const notificationService = {
  // Get notifications for an employee
  getNotifications: async (employeeId) => {
    // Simulate API delay
    await delay(300);
    
    // Return notifications for the employee
    return notifications.filter(notification => notification.employeeId === employeeId);
  },
  
  // Add a new notification
  addNotification: async (notification) => {
    // Simulate API delay
    await delay(300);
    
    // Generate a new ID
    const newId = Math.max(...notifications.map(n => n.id), 0) + 1;
    
    // Create the new notification
    const newNotification = {
      id: newId,
      date: new Date().toISOString(),
      read: false,
      ...notification
    };
    
    // Add to notifications
    notifications = [newNotification, ...notifications];
    
    // Notify listeners
    listeners.forEach(listener => listener(newNotification));
    
    return newNotification;
  },
  
  // Mark notification as read
  markAsRead: async (notificationId) => {
    // Simulate API delay
    await delay(200);
    
    // Find and update the notification
    notifications = notifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, read: true } 
        : notification
    );
    
    return { success: true };
  },
  
  // Mark all notifications as read for an employee
  markAllAsRead: async (employeeId) => {
    // Simulate API delay
    await delay(300);
    
    // Update all notifications for the employee
    notifications = notifications.map(notification => 
      notification.employeeId === employeeId 
        ? { ...notification, read: true } 
        : notification
    );
    
    return { success: true };
  },
  
  // Delete a notification
  deleteNotification: async (notificationId) => {
    // Simulate API delay
    await delay(200);
    
    // Remove the notification
    notifications = notifications.filter(notification => notification.id !== notificationId);
    
    return { success: true };
  },
  
  // Add a leave status notification
  addLeaveStatusNotification: async (leaveRequest, status, comments) => {
    // Determine notification details based on status
    let title, message;
    
    if (status === 'Approved') {
      title = 'Leave Request Approved';
      message = `Your leave request for ${formatDateRange(leaveRequest.fromDate, leaveRequest.toDate)} has been approved.`;
      if (comments) {
        message += ` Comments: ${comments}`;
      }
    } else if (status === 'Rejected') {
      title = 'Leave Request Rejected';
      message = `Your leave request for ${formatDateRange(leaveRequest.fromDate, leaveRequest.toDate)} has been rejected.`;
      if (comments) {
        message += ` Reason: ${comments}`;
      }
    }
    
    // Create and add the notification
    return await notificationService.addNotification({
      employeeId: leaveRequest.employeeId,
      type: 'leave',
      title,
      message
    });
  },
  
  // Subscribe to notification updates
  subscribe: (callback) => {
    listeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = listeners.indexOf(callback);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    };
  },
  
  // Get unread notification count for an employee
  getUnreadCount: async (employeeId) => {
    // Simulate API delay
    await delay(100);
    
    // Count unread notifications
    return notifications.filter(
      notification => notification.employeeId === employeeId && !notification.read
    ).length;
  }
};

// Helper function to format date range
const formatDateRange = (fromDate, toDate) => {
  try {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    
    // Check if dates are valid
    if (isNaN(from.getTime()) || isNaN(to.getTime())) {
      return 'the requested period';
    }
    
    // Format dates
    const fromStr = from.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const toStr = to.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    // If same date, return single date
    if (fromStr === toStr) {
      return fromStr;
    }
    
    // Return date range
    return `${fromStr} to ${toStr}`;
  } catch (error) {
    return 'the requested period';
  }
};

export default notificationService;
