import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../../../config';
import { useParams } from 'react-router-dom';
import { FileText, Plus, BookOpen, Clock } from 'lucide-react';

const InstructorCourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [file, setFile] = useState(null);
  
  const [showMaterialForm, setShowMaterialForm] = useState(false);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  
  const [newMaterial, setNewMaterial] = useState({ title: '', type: 'pdf' });
  const [newAssignment, setNewAssignment] = useState({ title: '', description: '', dueDate: '', course: id });

  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/courses`);
      const found = res.data.find(c => c._id === id);
      setCourse(found);
      setMaterials(found.materials || []);
      
      const assignRes = await axios.get(`${API_URL}/api/assignments/course/${id}`);
      setAssignments(assignRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddMaterial = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', newMaterial.title);
    formData.append('type', newMaterial.type);
    if (file) formData.append('file', file);

    try {
      await axios.post(`${API_URL}/api/courses/${id}/materials/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setShowMaterialForm(false);
      setFile(null);
      setNewMaterial({ title: '', type: 'pdf' });
      fetchCourseDetails();
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding material');
    }
  };

  const [assignFile, setAssignFile] = useState(null);

  const handleAddAssignment = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', newAssignment.title);
    formData.append('description', newAssignment.description);
    formData.append('dueDate', newAssignment.dueDate);
    formData.append('course', id);
    if (assignFile) formData.append('file', assignFile);

    try {
      await axios.post(`${API_URL}/api/assignments`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setShowAssignmentForm(false);
      setAssignFile(null);
      setNewAssignment({ title: '', description: '', dueDate: '', course: id });
      fetchCourseDetails();
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding assignment');
    }
  };

  if (!course) return <div className="glass card">Loading...</div>;

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.8rem' }}>Manage: {course.title}</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-primary" onClick={() => setShowMaterialForm(true)}><Plus size={18} /> Add Note</button>
          <button className="btn glass" onClick={() => setShowAssignmentForm(true)}><Plus size={18} /> Assign Test</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Materials List */}
        <div className="glass card">
          <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={20} color="var(--primary)" /> Course Materials
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {materials.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No materials uploaded yet.</p> : 
              materials.map((m, i) => (
                <div key={i} className="glass" style={{ padding: '12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{m.title}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{m.type.toUpperCase()}</span>
                </div>
              ))
            }
          </div>
        </div>

        {/* Assignments List */}
        <div className="glass card">
          <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={20} color="var(--accent)" /> Assigned Tests
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {assignments.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No tests assigned yet.</p> : 
              assignments.map((a, i) => (
                <div key={i} className="glass" style={{ padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontWeight: '600' }}>{a.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Due: {new Date(a.dueDate).toLocaleDateString()}</div>
                </div>
              ))
            }
          </div>
        </div>
      </div>

      {/* Material Form Modal */}
      {showMaterialForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="glass card" style={{ width: '100%', maxWidth: '400px' }}>
            <h3 style={{ marginBottom: '20px' }}>Add New Material</h3>
            <form onSubmit={handleAddMaterial}>
              <input 
                placeholder="Title" 
                style={{ marginBottom: '12px' }} 
                value={newMaterial.title}
                onChange={e => setNewMaterial({...newMaterial, title: e.target.value})}
                required 
              />
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Choose PDF/Voice File</label>
                <input 
                  type="file" 
                  onChange={e => setFile(e.target.files[0])}
                  required
                />
              </div>
              <select 
                style={{ marginBottom: '20px' }}
                value={newMaterial.type}
                onChange={e => setNewMaterial({...newMaterial, type: e.target.value})}
              >
                <option value="pdf">PDF Note</option>
                <option value="voice">Voice Resource</option>
                <option value="video">Video Lecture</option>
              </select>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Submit</button>
                <button type="button" className="btn glass" style={{ flex: 1 }} onClick={() => setShowMaterialForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assignment Form Modal */}
      {showAssignmentForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="glass card" style={{ width: '100%', maxWidth: '400px' }}>
            <h3 style={{ marginBottom: '20px' }}>Assign New Test</h3>
            <form onSubmit={handleAddAssignment}>
              <input 
                placeholder="Test Title" 
                style={{ marginBottom: '12px' }} 
                value={newAssignment.title}
                onChange={e => setNewAssignment({...newAssignment, title: e.target.value})}
                required 
              />
              <textarea 
                placeholder="Instructions" 
                style={{ marginBottom: '12px', height: '100px' }} 
                value={newAssignment.description}
                onChange={e => setNewAssignment({...newAssignment, description: e.target.value})}
                required
              />
              <input 
                type="date" 
                style={{ marginBottom: '12px' }} 
                value={newAssignment.dueDate}
                onChange={e => setNewAssignment({...newAssignment, dueDate: e.target.value})}
                required
              />
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Question Paper / Resource (PDF)</label>
                <input 
                  type="file" 
                  onChange={e => setAssignFile(e.target.files[0])}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Assign</button>
                <button type="button" className="btn glass" style={{ flex: 1 }} onClick={() => setShowAssignmentForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorCourseDetail;
