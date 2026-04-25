import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const data = [
  { name: 'Week 1', score: 65, avg: 50 },
  { name: 'Week 2', score: 72, avg: 52 },
  { name: 'Week 3', score: 68, avg: 55 },
  { name: 'Week 4', score: 85, avg: 58 },
  { name: 'Week 5', score: 92, avg: 60 },
  { name: 'Week 6', score: 88, avg: 62 },
];

const Stats = () => {
  return (
    <div className="animate-fade">
      <h3 style={{ marginBottom: '24px' }}>Performance Analytics</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        <div className="glass card" style={{ height: '400px' }}>
          <h4 style={{ marginBottom: '20px', color: 'var(--text-muted)' }}>Learning Progress Over Time</h4>
          <ResponsiveContainer width="100%" height="80%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
              <YAxis stroke="var(--text-muted)" fontSize={12} />
              <Tooltip 
                contentStyle={{ background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
                itemStyle={{ color: 'white' }}
              />
              <Area type="monotone" dataKey="score" stroke="var(--primary)" fillOpacity={1} fill="url(#colorScore)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass card" style={{ height: '400px' }}>
          <h4 style={{ marginBottom: '20px', color: 'var(--text-muted)' }}>Class Average Comparison</h4>
          <ResponsiveContainer width="100%" height="80%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
              <YAxis stroke="var(--text-muted)" fontSize={12} />
              <Tooltip 
                contentStyle={{ background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
                itemStyle={{ color: 'white' }}
              />
              <Line type="monotone" dataKey="score" stroke="var(--primary)" strokeWidth={3} dot={{ r: 6 }} />
              <Line type="monotone" dataKey="avg" stroke="var(--accent)" strokeWidth={2} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass card">
        <h4 style={{ marginBottom: '20px' }}>Subject Wise Mastery</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px' }}>
          {[
            { label: 'React JS', value: 92, color: 'var(--primary)' },
            { label: 'Node.js', value: 78, color: 'var(--accent)' },
            { label: 'MongoDB', value: 85, color: '#a855f7' },
            { label: 'UI/UX Design', value: 64, color: '#f59e0b' }
          ].map((item, i) => (
            <div key={i} style={{ flex: 1, minWidth: '150px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                <span>{item.label}</span>
                <span>{item.value}%</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${item.value}%`, height: '100%', background: item.color, borderRadius: '4px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stats;
