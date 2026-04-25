import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import { BookOpen, FileText, Download, ExternalLink, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const TutorialList = () => {
  const [tutorials, setTutorials] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTutorials = async () => {
      try {
        const courseRes = await axios.get('http://localhost:5000/api/courses');
        const myCourses = courseRes.data.filter(c => 
          user.role === 'instructor' ? c.instructor._id === user.id : c.students.includes(user.id)
        );
        
        let allTutorials = [];
        for (const course of myCourses) {
          const withCourse = (course.materials || []).map(m => ({ ...m, courseTitle: course.title, courseId: course._id }));
          allTutorials = [...allTutorials, ...withCourse];
        }
        setTutorials(allTutorials);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTutorials();
  }, [user]);

  return (
    <div className="animate-fade">
      <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>
        {user.role === 'instructor' ? 'Manage Tutorials' : 'Learning Tutorials'}
      </h3>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
        Access your study materials, lecture notes, and video tutorials.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {tutorials.length === 0 ? (
          <div className="glass card" style={{ gridColumn: '1/-1', textAlign: 'center' }}>
            No tutorials available.
          </div>
        ) : tutorials.map((t, i) => (
          <div key={i} className="glass card" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ 
              padding: '12px', 
              background: t.type === 'video' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(99, 102, 241, 0.1)', 
              borderRadius: '12px' 
            }}>
              {t.type === 'video' ? <PlayCircle color="#ef4444" size={24} /> : <FileText color="var(--primary)" size={24} />}
            </div>
            
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 'bold', marginBottom: '4px' }}>
                {t.courseTitle}
              </div>
              <h4 style={{ fontSize: '1rem', marginBottom: '8px' }}>{t.title}</h4>
              <div style={{ display: 'flex', gap: '8px' }}>
                <a href={t.url} target="_blank" rel="noreferrer" className="btn glass" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
                   View Resource
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TutorialList;
