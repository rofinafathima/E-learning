import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../../../config';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { BookOpen, Users, Clock, ArrowUpRight, ExternalLink, PlusCircle } from 'lucide-react';

const CourseList = ({ setShowCourseModal }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/courses`);
      setCourses(res.data);
    } catch (err) {
      console.error(err);
      // Mock data if backend is not running
      setCourses([
        { _id: '1', title: 'Modern React Architecture', description: 'Master hook-based state management and design patterns.', instructor: { name: 'Dr. Sarah Wilson' }, students: [], createdAt: new Date() },
        { _id: '2', title: 'Complete Node.js Guide', description: 'Build scalable APIs with Express and MongoDB.', instructor: { name: 'Prof. James Bond' }, students: [], createdAt: new Date() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (id) => {
    try {
      await axios.post(`${API_URL}/api/courses/${id}/enroll`);
      alert('Successfully enrolled!');
      fetchCourses();
    } catch (err) {
      alert(err.response?.data?.message || 'Error enrolling');
    }
  };

  const isEnrolled = (course) => course.students.includes(user.id);
  const isInstructor = (course) => course.instructor._id === user.id;

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h3 style={{ fontSize: '1.5rem' }}>{user.role === 'instructor' ? 'My Courses' : 'Browse Courses'}</h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {user.role === 'instructor' && (
          <div 
            className="glass card" 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: '16px', 
              border: '2px dashed var(--glass-border)',
              cursor: 'pointer',
              minHeight: '300px'
            }}
            onClick={() => setShowCourseModal(true)}
          >
            <div style={{ padding: '20px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '50%' }}>
              <PlusCircle size={40} color="var(--primary)" />
            </div>
            <div style={{ textAlign: 'center' }}>
              <h4 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>Create New Course</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Add a new class for your students</p>
            </div>
          </div>
        )}
        {courses.map((course) => (
          <div key={course._id} className="glass card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: '160px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', marginBottom: '16px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(45deg, var(--primary), var(--accent))', opacity: 0.1 }} />
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <BookOpen size={48} color="var(--primary)" opacity={0.5} />
              </div>
            </div>
            
            <h4 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>{course.title}</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px', flex: 1 }}>
              {course.description}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Users size={14} /> {course.students.length} Students
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={14} /> 12 Weeks
              </div>
            </div>

            <hr style={{ border: 'none', height: '1px', background: 'var(--glass-border)', margin: '16px 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{course.instructor.name}</span>
              
              {user.role === 'student' && !isEnrolled(course) ? (
                <button className="btn btn-primary" style={{ padding: '6px 16px', fontSize: '0.85rem' }} onClick={() => handleEnroll(course._id)}>
                  Enroll <ArrowUpRight size={14} />
                </button>
              ) : (
                <button className="btn glass" style={{ padding: '6px 16px', fontSize: '0.85rem' }} onClick={() => navigate(`/dashboard/courses/${course._id}`)}>
                  View <ExternalLink size={14} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseList;
