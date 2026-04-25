import React, { useState } from 'react';
import { Shield, User, Edit, Trash2, Mail } from 'lucide-react';

const users = [
  { id: 1, name: 'Alice Johnson', email: 'alice@student.com', role: 'student', status: 'active' },
  { id: 2, name: 'Dr. Bob Smith', email: 'bob@instructor.com', role: 'instructor', status: 'active' },
  { id: 3, name: 'Charlie Dave', email: 'charlie@student.com', role: 'student', status: 'pending' },
  { id: 4, name: 'Eve Brown', email: 'eve@instructor.com', role: 'instructor', status: 'active' },
];

const AdminPanel = () => {
  return (
    <div className="animate-fade">
      <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Shield color="var(--primary)" /> User Moderation
      </h3>

      <div className="glass" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--glass-border)' }}>
              <th style={{ padding: '16px' }}>User</th>
              <th style={{ padding: '16px' }}>Role</th>
              <th style={{ padding: '16px' }}>Status</th>
              <th style={{ padding: '16px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <User size={16} />
                    </div>
                    <div>
                      <div style={{ fontWeight: '500' }}>{u.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{u.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px' }}>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    padding: '4px 8px', 
                    borderRadius: '12px', 
                    background: u.role === 'instructor' ? 'rgba(168, 85, 247, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                    color: u.role === 'instructor' ? '#a855f7' : 'var(--primary)'
                  }}>
                    {u.role.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: '16px' }}>
                   <span style={{ 
                    fontSize: '0.75rem', 
                    color: u.status === 'active' ? '#22c55e' : '#f59e0b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: u.status === 'active' ? '#22c55e' : '#f59e0b' }} />
                    {u.status}
                  </span>
                </td>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn" style={{ padding: '8px', background: 'transparent' }}><Edit size={16} color="var(--text-muted)" /></button>
                    <button className="btn" style={{ padding: '8px', background: 'transparent' }}><Mail size={16} color="var(--text-muted)" /></button>
                    <button className="btn" style={{ padding: '8px', background: 'transparent' }}><Trash2 size={16} color="#ef4444" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;
