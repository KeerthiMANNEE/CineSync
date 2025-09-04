import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="dashboard-container">
        <h2>Please log in to access your dashboard.</h2>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h2>Welcome to CineSync!</h2>
      <div style={{ margin: '2rem 0', display: 'flex', gap: '3rem', justifyContent: 'center' }}>
        <button
          onClick={() => navigate('/create-room')}
          style={{
            fontSize: '1.5rem',
            padding: '1.2rem 2.5rem',
            borderRadius: '32px',
            background: 'linear-gradient(90deg, #ff512f 0%, #dd2476 100%)',
            color: '#fff',
            fontWeight: '700',
            border: 'none',
            boxShadow: '0 4px 16px rgba(221,36,118,0.12)',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
        >
          Create Room
        </button>
        <button
          onClick={() => navigate('/join-room')}
          style={{
            fontSize: '1.5rem',
            padding: '1.2rem 2.5rem',
            borderRadius: '32px',
            background: 'linear-gradient(90deg, #dd2476 0%, #ff512f 100%)',
            color: '#fff',
            fontWeight: '700',
            border: 'none',
            boxShadow: '0 4px 16px rgba(255,80,130,0.12)',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
        >
          Join Room
        </button>
        {/* Add more options like Open Room, Profile, etc. */}
      </div>
      <button onClick={logout} style={{ marginTop: '2rem', background: '#ff512f', color: '#fff', borderRadius: '8px', padding: '0.7rem 1.5rem', fontWeight: '600', border: 'none', cursor: 'pointer' }}>Logout</button>
    </div>
  );
};

export default Dashboard;
