import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, Info, AlertTriangle, CheckCircle } from 'lucide-react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/notifications');
        setNotifications(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotifications();
  }, []);

  return (
    <div className="animate-fade">
      <h3 style={{ marginBottom: '24px' }}>Notifications</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {notifications.length === 0 ? (
          <p className="glass" style={{ padding: '20px', textAlign: 'center' }}>No new notifications.</p>
        ) : notifications.map((notif) => (
          <div key={notif._id} className="glass card" style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', opacity: notif.read ? 0.6 : 1 }}>
            <div style={{ 
              padding: '12px', 
              borderRadius: '12px',
              background: notif.type === 'warning' ? 'rgba(245, 158, 11, 0.1)' : notif.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(59, 130, 246, 0.1)'
            }}>
              {notif.type === 'warning' ? <AlertTriangle color="#f59e0b" /> : notif.type === 'success' ? <CheckCircle color="#22c55e" /> : <Info color="#3b82f6" />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <h4 style={{ fontSize: '1rem' }}>{notif.title}</h4>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(notif.createdAt).toLocaleDateString()}</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{notif.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
