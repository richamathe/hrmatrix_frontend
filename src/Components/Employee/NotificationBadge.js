import React, { useState, useEffect } from 'react';
import { Badge } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import notificationService from '../../services/notificationService';

const NotificationBadge = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const user = useSelector((state) => state.auth.user);
  const employeeId = user?.id || '1'; // Default to '1' for demo purposes

  useEffect(() => {
    // Initial fetch of unread count
    const fetchUnreadCount = async () => {
      try {
        const count = await notificationService.getUnreadCount(employeeId);
        setUnreadCount(count);
      } catch (error) {
        console.error('Error fetching unread count:', error);
      }
    };

    fetchUnreadCount();

    // Subscribe to notification updates
    const unsubscribe = notificationService.subscribe((newNotification) => {
      if (newNotification.employeeId === employeeId) {
        setUnreadCount(prev => prev + 1);
      }
    });

    // Refresh count every minute
    const intervalId = setInterval(fetchUnreadCount, 60000);

    return () => {
      unsubscribe();
      clearInterval(intervalId);
    };
  }, [employeeId]);

  if (unreadCount === 0) {
    return null;
  }

  return (
    <Badge 
      bg="danger" 
      pill 
      className="position-absolute top-0 end-0 translate-middle"
      style={{ fontSize: '0.6rem', padding: '0.25rem 0.4rem' }}
    >
      {unreadCount > 9 ? '9+' : unreadCount}
    </Badge>
  );
};

export default NotificationBadge;
