import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, Clock, BookOpen, AlertCircle, FileText, Download } from 'lucide-react';

const TestSubmission = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [file, setFile] = useState(null);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/assignments/all`);
        const found = res.data.find(a => a._id === assignmentId);
        setAssignment(found);
      } catch (err) {
        setAssignment({ title: 'Loading...', description: 'Please wait...' });
      }
    };
    fetchAssignment();
  }, [assignmentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('assignment', assignmentId);
    formData.append('content', content);
    if (file) formData.append('file', file);

    try {
      await axios.post('http://localhost:5000/api/submissions', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Assignment submitted successfully!');
      navigate('/dashboard/assignments');
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting assignment');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!assignment) return <div className="glass card">Loading test details...</div>;

  return (
    <div className="animate-fade" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="glass card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>{assignment.title}</h2>
          <div style={{ padding: '8px 16px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '8px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={16} /> Due Date: {new Date(assignment.dueDate).toLocaleDateString()}
          </div>
        </div>
        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '20px' }}>{assignment.description}</p>
        
        {assignment.fileUrl && (
          <div style={{ padding: '16px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <FileText color="var(--primary)" />
              <span style={{ fontWeight: '500' }}>Question Paper / Resource</span>
            </div>
            <a href={assignment.fileUrl} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">
              <Download size={16} /> Download PDF
            </a>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="glass card">
        <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BookOpen size={20} color="var(--primary)" /> Your Submission
        </h3>
        <textarea 
          placeholder="Type your summary or notes here..." 
          style={{ width: '100%', minHeight: '150px', marginBottom: '20px', resize: 'vertical' }}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Upload your solution (PDF/Images)</label>
          <input 
            type="file" 
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
        
        <div style={{ background: 'rgba(59, 130, 246, 0.05)', padding: '16px', borderRadius: '8px', marginBottom: '20px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <AlertCircle size={20} color="#3b82f6" style={{ marginTop: '2px' }} />
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Once submitted, you cannot edit your response. Please ensure your solution is complete before clicking submit.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ flex: 2, justifyContent: 'center' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : <><Send size={18} /> Submit Assessment</>}
          </button>
          <button 
            type="button" 
            className="btn glass" 
            style={{ flex: 1, justifyContent: 'center' }}
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TestSubmission;
