import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, BookOpen, Clock, Download, ExternalLink } from 'lucide-react';

const StudentCourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/courses');
        const found = res.data.find(c => c._id === id);
        setCourse(found);
        
        const assignRes = await axios.get(`http://localhost:5000/api/assignments/course/${id}`);
        setAssignments(assignRes.data);

        const subRes = await axios.get('http://localhost:5000/api/submissions/my');
        setSubmissions(subRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDetails();
  }, [id]);

  if (!course) return <div className="glass card">Loading...</div>;

  return (
    <div className="animate-fade">
      <header style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{course.title}</h2>
        <p style={{ color: 'var(--text-muted)' }}>Instructor: {course.instructor.name}</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
        {/* Materials List */}
        <div>
          <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={20} color="var(--primary)" /> Learning Materials
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {course.materials.length === 0 ? <p className="glass" style={{ padding: '20px' }}>No notes available yet.</p> : 
              course.materials.map((m, i) => (
                <div key={i} className="glass card" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ padding: '8px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px' }}>
                      <FileText size={20} color="var(--primary)" />
                    </div>
                    <div>
                      <div style={{ fontWeight: '600' }}>{m.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Type: {m.type.toUpperCase()}</div>
                    </div>
                  </div>
                  <button className="btn glass" onClick={() => window.open(m.url, '_blank')}><Download size={16} /> View</button>
                </div>
              ))
            }
          </div>
        </div>

        {/* Assignments List */}
        <div>
          <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={20} color="var(--accent)" /> Active Tests & Tasks
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {assignments.length === 0 ? <p className="glass" style={{ padding: '20px' }}>No tests assigned.</p> : 
              assignments.map((a, i) => (
                <div key={i} className="glass card" style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontWeight: '600' }}>{a.title}</span>
                    <span style={{ fontSize: '0.75rem', padding: '4px 8px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '4px' }}>
                      Due: {new Date(a.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>{a.description}</p>
                  {submissions.some(s => s.assignment?._id === a._id || s.assignment === a._id) ? (
                    <button className="btn glass" style={{ width: '100%', fontSize: '0.85rem', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)' }} disabled>
                      ✓ Completed
                    </button>
                  ) : (
                    <button 
                      className="btn btn-primary" 
                      style={{ width: '100%', fontSize: '0.85rem' }}
                      onClick={() => navigate(`/dashboard/test/${a._id}`)}
                    >
                      Attempt Test
                    </button>
                  )}
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCourseDetail;
