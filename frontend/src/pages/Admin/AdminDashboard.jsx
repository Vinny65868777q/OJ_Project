import React from 'react';
import './AdminDashboard.css';
import {useNavigate} from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();


  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
       <div className="admin-logo">
        <img src="/assets/Logo.png" alt="JudgeX" />
        </div>
        <button onClick={() => navigate('/admin/add-problem')}><i className="fas fa-plus"></i> Add Problem</button>
        <button onClick={() => navigate('/admin/manage-problems')}><i className="fas fa-tasks"></i> Manage Problems</button>
        <button onClick={() => navigate('/admin/createContest')}><i className="fas fa-upload"></i> Add Contest</button>
        <button onClick={() => navigate('/login')}><i className="fas fa-power-off"></i> Logout</button>
      </aside>
      
        <main className="dashboard-content">
        <div className="admin-header">
          <h1>Welcome, Admin!</h1>
          <img src="/assets/Admin_Avatar.png" alt="Admin Avatar" className="admin-avatar" />
        </div>

        <div className="action-buttons">
          <button onClick={() => navigate('/admin/add-problem')}>Add New Problem</button>
          <button onClick={() => navigate('/admin/manage-problems')}>Problem List</button>
          <button onClick={() => navigate('/admin/createContest')}>Add Contest</button>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;



