import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../../../config';
import { useAuth } from '../../../context/AuthContext';
import { CheckSquare, Clock, Calendar, ArrowRight, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const AssignmentList = () => {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const courseRes = await axios.get(`${API_URL}/api/courses`);
        const myCourses = courseRes.data.filter(c => 
          user.role === 'instructor' ? c.instructor._id === user.id : c.students.includes(user.id)
        );
        
        let allAssignments = [];
        for (const course of myCourses) {
          const assignRes = await axios.get(`${API_URL}/api/assignments/course/${course._id}`);
          const withCourse = assignRes.data.map(a => ({ ...a, courseTitle: course.title }));
          allAssignments = [...allAssignments, ...withCourse];
        }
        setAssignments(allAssignments);

        // Fetch submissions
        if (user.role === 'student') {
          const subRes = await axios.get(`${API_URL}/api/submissions/my`);
          setSubmissions(subRes.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchAssignments();
  }, [user]);

  return (
    <div className="animate-fade">
      <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>
        {user.role === 'instructor' ? 'Manage Assignments' : 'My Assignments'}
      </h3>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
        {user.role === 'instructor' ? 'Review and manage all tests you have assigned' : 'Track and attempt your upcoming tests'}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
        {assignments.length === 0 ? (
          <div className="glass card" style={{ gridColumn: '1/-1', textAlign: 'center' }}>
            No assignments found.
          </div>
        ) : assignments.map((a) => (
          <div key={a._id} className="glass card" style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 'bold' }}>
              {a.courseTitle}
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{ padding: '12px', background: 'rgba(34, 211, 238, 0.1)', borderRadius: '12px' }}>
                <CheckSquare color="var(--accent)" />
              </div>
              <h4 style={{ fontSize: '1.1rem' }}>{a.title}</h4>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px', minHeight: '40px' }}>
              {a.description}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                <Calendar size={14} /> {new Date(a.dueDate).toLocaleDateString()}
              </div>
              {user.role === 'student' ? (
                submissions.some(s => s.assignment?._id === a._id || s.assignment === a._id) ? (
                  <button className="btn glass" style={{ color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)' }} disabled>
                    ✓ Completed
                  </button>
                ) : (
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => navigate(`/dashboard/test/${a._id}`)}
                  >
                    Attempt Test
                  </button>
                )
              ) : (
                <Link 
                  to={`/dashboard/courses/${a.course}`} 
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem' }}
                >
                  Go to Course <ArrowRight size={16} />
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssignmentList;
