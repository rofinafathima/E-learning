import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
// ... rest of imports
import { 
  LayoutDashboard, 
  BookOpen, 
  CheckSquare, 
  BarChart3, 
  Bell, 
  Settings, 
  LogOut,
  Search,
  PlusCircle,
  Library
} from 'lucide-react';
import CourseList from './components/CourseList';
import Stats from './components/Stats';
import Notifications from './components/Notifications';
import AdminPanel from '../Admin/AdminPanel';
import InstructorCourseDetail from './components/InstructorCourseDetail';
import StudentCourseDetail from './components/StudentCourseDetail';
import AssignmentList from './components/AssignmentList';
import TutorialList from './components/TutorialList';
import TestSubmission from './components/TestSubmission';

const SidebarItem = ({ icon: Icon, label, path, active }) => (
  <Link 
    to={path} 
    style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '12px', 
      padding: '12px 16px', 
      textDecoration: 'none', 
      color: active ? 'white' : 'var(--text-muted)',
      background: active ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
      borderRadius: '8px',
      marginBottom: '4px',
      transition: 'all 0.2s ease',
      borderLeft: active ? '3px solid var(--primary)' : '3px solid transparent'
    }}
  >
    <Icon size={20} strokeWidth={active ? 2.5 : 2} />
    <span style={{ fontWeight: active ? '600' : '400' }}>{label}</span>
  </Link>
);

const Dashboard = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [newCourse, setNewCourse] = useState({ title: '', description: '' });

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/courses', newCourse);
      setShowCourseModal(false);
      setNewCourse({ title: '', description: '' });
      window.location.reload(); // Refresh to show new course
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating course');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* ... Sidebar ... */}
      <aside className="glass" style={{ width: '260px', padding: '24px', margin: '16px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '8px', background: 'var(--primary)', borderRadius: '12px' }}>
            <BookOpen color="white" />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>EduElevate</span>
        </div>

        <nav style={{ flex: 1 }}>
          <SidebarItem icon={LayoutDashboard} label="Overview" path="/dashboard" active={location.pathname === '/dashboard'} />
          <SidebarItem icon={BookOpen} label="My Courses" path="/dashboard/courses" active={location.pathname.includes('/courses')} />
          <SidebarItem icon={Library} label="Tutorials" path="/dashboard/tutorials" active={location.pathname.includes('/tutorials')} />
          <SidebarItem icon={CheckSquare} label="Assignments" path="/dashboard/assignments" active={location.pathname.includes('/assignments')} />
          <SidebarItem icon={BarChart3} label="Progress" path="/dashboard/progress" active={location.pathname.includes('/progress')} />
          <SidebarItem icon={Bell} label="Notifications" path="/dashboard/notifications" active={location.pathname.includes('/notifications')} />
          
          {user?.role === 'admin' && (
            <>
              <div style={{ height: '1px', background: 'var(--glass-border)', margin: '20px 0' }} />
              <SidebarItem icon={Settings} label="Admin Panel" path="/dashboard/admin" active={location.pathname.includes('/admin')} />
            </>
          )}
        </nav>

        <button 
          onClick={logout}
          className="btn glass" 
          style={{ width: '100%', marginTop: 'auto', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#f87171' }}
        >
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '32px 40px 32px 20px', overflowY: 'auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>Hello, {user?.name} 👋</h2>
            <p style={{ color: 'var(--text-muted)' }}>Ready to {user?.role === 'student' ? 'learn something new' : 'manage your classes'} today?</p>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div className="glass" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Search size={18} color="var(--text-muted)" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                style={{ background: 'transparent', border: 'none', padding: '0', width: '200px' }}
              />
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(45deg, #6366f1, #22d3ee)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>
              {user?.name.charAt(0)}
            </div>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<Overview user={user} />} />
          <Route path="/courses" element={<CourseList />} />
          <Route path="/assignments" element={<AssignmentList />} />
          <Route path="/tutorials" element={<TutorialList />} />
          <Route path="/test/:assignmentId" element={<TestSubmission />} />
          <Route path="/progress" element={<Stats />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route 
            path="/courses/:id" 
            element={user?.role === 'instructor' ? <InstructorCourseDetail /> : <StudentCourseDetail />} 
          />
        </Routes>
      </main>
    </div>
  );
};

const Overview = ({ user }) => {
  const [stats, setStats] = useState({ courses: 0, assignments: 0 });
  const [recentCourses, setRecentCourses] = useState([]);
  const [deadlines, setDeadlines] = useState([]);

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        const courseRes = await axios.get('http://localhost:5000/api/courses');
        const myCourses = courseRes.data.filter(c => 
          user.role === 'instructor' ? c.instructor._id === user.id : c.students.includes(user.id)
        );
        
        // Fetch all assignments for all my courses
        let allAssignments = [];
        for (const course of myCourses) {
          const assignRes = await axios.get(`http://localhost:5000/api/assignments/course/${course._id}`);
          allAssignments = [...allAssignments, ...assignRes.data];
        }

        setStats({
          courses: myCourses.length,
          assignments: allAssignments.length
        });
        setRecentCourses(myCourses.slice(0, 1));
        setDeadlines(allAssignments.slice(0, 3)); // show first 3 deadlines globally
      } catch (err) {
        console.error(err);
      }
    };
    fetchOverviewData();
  }, [user]);

  return (
    <div className="animate-fade">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        <div className="glass card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ padding: '16px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '16px' }}>
            <BookOpen color="var(--primary)" size={32} />
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{user.role === 'instructor' ? 'Created Courses' : 'Enrolled Courses'}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.courses}</div>
          </div>
        </div>
        <div className="glass card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ padding: '16px', background: 'rgba(34, 211, 238, 0.1)', borderRadius: '16px' }}>
            <CheckSquare color="var(--accent)" size={32} />
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{user.role === 'instructor' ? 'Total Tests Assigned' : 'My Assignments'}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.assignments}</div>
          </div>
        </div>
        <div className="glass card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ padding: '16px', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '16px' }}>
            <BarChart3 color="#a855f7" size={32} />
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Overall Progress</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{user.role === 'instructor' ? 'N/A' : '75%'}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div className="glass card">
          <h3 style={{ marginBottom: '20px' }}>{user.role === 'instructor' ? 'My Recent Courses' : 'Continue Learning'}</h3>
          {recentCourses.length > 0 ? (
            <div className="glass" style={{ padding: '20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ width: '60px', height: '60px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <BookOpen size={24} color="var(--primary)" />
                </div>
                <div>
                  <div style={{ fontWeight: '600' }}>{recentCourses[0].title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{recentCourses[0].description}</div>
                </div>
              </div>
              <Link to={`/dashboard/courses/${recentCourses[0]._id}`} className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>Open</Link>
            </div>
          ) : (
             <p style={{ color: 'var(--text-muted)' }}>No courses found.</p>
          )}
        </div>
        <div className="glass card">
          <h3 style={{ marginBottom: '20px' }}>Upcoming Deadlines</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {deadlines.length > 0 ? deadlines.map((d, i) => (
              <div key={i} style={{ padding: '12px', borderLeft: '4px solid #f59e0b', background: 'rgba(245, 158, 11, 0.05)', borderRadius: '4px' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>{d.title}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Next: {new Date(d.dueDate).toLocaleDateString()}</div>
              </div>
            )) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No pending deadlines.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
