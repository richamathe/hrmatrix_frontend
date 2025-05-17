import React, { useState, useEffect } from 'react';
import { Bell, Calendar, DollarSign, CheckCircle, Clock, X, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';
import { Spinner } from 'react-bootstrap';
import notificationService from '../../services/notificationService';
import { useSelector } from 'react-redux';
import themeColors from '../../theme/colors';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const employeeId = user?.id || '1'; // Default to '1' for demo purposes

  // Load notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const data = await notificationService.getNotifications(employeeId);
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        toast.error('Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    // Subscribe to notification updates
    const unsubscribe = notificationService.subscribe((newNotification) => {
      if (newNotification.employeeId === employeeId) {
        setNotifications(prev => [newNotification, ...prev]);
        toast.info(`New notification: ${newNotification.title}`);
      }
    });

    return () => unsubscribe();
  }, [employeeId]);

  // Refresh notifications
  const refreshNotifications = async () => {
    try {
      setRefreshing(true);
      const data = await notificationService.getNotifications(employeeId);
      setNotifications(data);
      toast.success('Notifications refreshed');
    } catch (error) {
      console.error('Error refreshing notifications:', error);
      toast.error('Failed to refresh notifications');
    } finally {
      setRefreshing(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(
        notifications.map(notification =>
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to update notification');
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead(employeeId);
      setNotifications(
        notifications.map(notification => ({ ...notification, read: true }))
      );
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Failed to update notifications');
    }
  };

  // Delete notification
  const deleteNotification = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications(
        notifications.filter(notification => notification.id !== id)
      );
      toast.success('Notification deleted');
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today, ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday, ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ', ' +
             date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  // Get icon based on notification type
  const getIcon = (type) => {
    switch (type) {
      case 'leave':
        return <Calendar className="text-green-500" size={20} />;
      case 'payroll':
        return <DollarSign className="text-blue-500" size={20} />;
      case 'attendance':
        return <Clock className="text-orange-500" size={20} />;
      default:
        return <Bell className="text-gray-500" size={20} />;
    }
  };

  // Count unread notifications
  const unreadCount = notifications.filter(notification => !notification.read).length;

  return (
    <div className="space-y-6">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold" style={{
          color: themeColors.primary,
          padding: '5px 0',
          fontWeight: 600
        }}>Notifications</h2>
        <div className="d-flex align-items-center gap-2">
          <button
            onClick={refreshNotifications}
            className="btn btn-sm me-2"
            disabled={refreshing}
            style={{
              background: 'white',
              border: `1px solid ${themeColors.border}`,
              color: themeColors.secondary,
              display: 'flex',
              alignItems: 'center',
              padding: '6px 12px',
              borderRadius: '4px',
              transition: 'all 0.2s ease'
            }}
          >
            {refreshing ? (
              <Spinner animation="border" size="sm" className="me-1" style={{ color: themeColors.secondary }} />
            ) : (
              <RefreshCw size={16} className="me-1" />
            )}
            Refresh
          </button>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="btn btn-sm"
              style={{
                background: themeColors.light,
                border: `1px solid ${themeColors.border}`,
                color: themeColors.primary,
                display: 'flex',
                alignItems: 'center',
                padding: '6px 12px',
                borderRadius: '4px',
                transition: 'all 0.2s ease'
              }}
            >
              <CheckCircle size={16} className="me-1" />
              Mark all as read
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="d-flex justify-content-center align-items-center py-5">
          <Spinner animation="border" style={{ color: themeColors.secondary }} />
        </div>
      ) : (
        <div style={{
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e9ecef',
          overflow: 'hidden'
        }}>
          {notifications.length > 0 ? (
            <div style={{ borderTop: '1px solid #e9ecef' }}>
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  style={{
                    padding: '16px',
                    borderBottom: '1px solid #e9ecef',
                    background: !notification.read ? themeColors.light : 'white',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = themeColors.lightBg;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = !notification.read ? themeColors.light : 'white';
                  }}
                >
                  <div className="d-flex gap-3">
                    <div className="mt-1" style={{
                      background: themeColors.light,
                      padding: '8px',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {React.cloneElement(getIcon(notification.type), { color: themeColors.secondary })}
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between">
                        <h5 style={{
                          marginBottom: '4px',
                          fontWeight: !notification.read ? '600' : '500',
                          color: !notification.read ? themeColors.primary : themeColors.darkText
                        }}>
                          {notification.title}
                        </h5>
                        <div className="d-flex align-items-center gap-2">
                          <span style={{ color: themeColors.lightText, fontSize: '0.85rem' }}>
                            {formatDate(notification.date)}
                          </span>
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              padding: '0',
                              color: '#dc3545',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            title="Delete notification"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                      <p style={{ color: themeColors.lightText, marginBottom: '4px' }}>{notification.message}</p>
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: '0',
                            color: themeColors.secondary,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '0.85rem',
                            fontWeight: '500'
                          }}
                        >
                          <CheckCircle size={14} style={{ marginRight: '4px' }} /> Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <Bell size={48} style={{ margin: '0 auto 16px', color: themeColors.lightText }} />
              <h4 style={{ marginBottom: '4px', color: themeColors.darkText, fontWeight: '500' }}>No Notifications</h4>
              <p style={{ color: themeColors.lightText }}>You're all caught up!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;
