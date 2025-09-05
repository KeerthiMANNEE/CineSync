import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { createRoom } from '../utils/api';

const CreateRoom = () => {
  const [roomName, setRoomName] = useState('');
  const [movieFile, setMovieFile] = useState(null);
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const { user, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  // Debug user state
  useEffect(() => {
    console.log('CreateRoom - User state:', user);
    console.log('CreateRoom - Loading state:', isLoading);
  }, [user, isLoading]);

  // Dynamic upload URL
  const getUploadUrl = () => {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.match(/^\d+\.\d+\.\d+\.\d+$/)) {
      return `${protocol}//${hostname}:5000/api/upload-video`;
    }
    
    if (hostname.includes('ngrok')) {
      return `${protocol}//${hostname}/api/upload-video`;
    }
    
    return 'http://localhost:5000/api/upload-video';
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setMovieFile(null);
      return;
    }
    
    // Check file type on frontend too
    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov', 'video/quicktime'];
    const allowedExtensions = ['.mp4', '.webm', '.ogg', '.avi', '.mov', '.mkv'];
    
    const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
    const isTypeAllowed = allowedTypes.includes(file.type) || allowedExtensions.includes(fileExtension);
    
    if (!isTypeAllowed) {
      setMessage(`Invalid file type: ${file.type || 'unknown'}. Please select a video file (.mp4, .webm, .ogg, .avi, .mov, .mkv)`);
      e.target.value = ''; // Clear the input
      return;
    }
    
    if (file.size > 200 * 1024 * 1024) { // 200MB
      setMessage('File too large. Maximum size is 200MB.');
      e.target.value = ''; // Clear the input
      return;
    }
    
    setMessage(''); // Clear any previous error
    setMovieFile(file);
    console.log('File selected:', {
      name: file.name,
      type: file.type,
      size: `${(file.size / 1024 / 1024).toFixed(2)}MB`
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Form submitted with user:', user);
    
    if (!roomName.trim()) {
      setMessage('Please enter a room name');
      return;
    }
    
    // Better user check
    if (!user || !user.email) {
      console.error('User not found:', user);
      setMessage('Please log in first');
      return;
    }

    setIsUploading(true);
    setMessage('');
    
    try {
      let videoUrl = null;
      
      // Upload video if selected
      if (movieFile) {
        setMessage(`Uploading video: ${movieFile.name} (${(movieFile.size / 1024 / 1024).toFixed(2)}MB)...`);
        
        console.log('File details:', {
          name: movieFile.name,
          type: movieFile.type,
          size: movieFile.size
        });
        
        const formData = new FormData();
        formData.append('video', movieFile);
        
        console.log('Uploading to:', getUploadUrl());
        
        const uploadResponse = await fetch(getUploadUrl(), {
          method: 'POST',
          body: formData,
        });
        
        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json().catch(() => ({ error: 'Upload failed' }));
          console.error('Upload failed:', errorData);
          throw new Error(errorData.error || 'Video upload failed');
        }
        
        const uploadData = await uploadResponse.json();
        videoUrl = uploadData.videoUrl;
        setMessage('Video uploaded successfully! Creating room...');
        console.log('Upload successful:', uploadData);
      }
      
      // Create room
      console.log('Creating room with user:', user.email);
      const result = await createRoom(roomName, user.email, videoUrl);
      
      if (result.success) {
        setMessage(`Room created successfully! Code: ${result.roomCode}`);
        setTimeout(() => {
          navigate(`/room/${result.roomCode}`);
        }, 2000);
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error creating room:', error);
      setMessage(`Failed to create room: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div style={{ 
        padding: '40px', 
        maxWidth: '500px', 
        margin: '0 auto',
        background: '#1a1a1a',
        color: '#fff',
        borderRadius: '10px',
        marginTop: '50px',
        textAlign: 'center'
      }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  // Show login prompt if no user
  if (!user) {
    return (
      <div style={{ 
        padding: '40px', 
        maxWidth: '500px', 
        margin: '0 auto',
        background: '#1a1a1a',
        color: '#fff',
        borderRadius: '10px',
        marginTop: '50px',
        textAlign: 'center'
      }}>
        <h2>Please Log In</h2>
        <p>You need to be logged in to create a room.</p>
        <button 
          onClick={() => navigate('/login')}
          style={{
            padding: '12px 24px',
            backgroundColor: '#4caf50',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '40px', 
      maxWidth: '500px', 
      margin: '0 auto',
      background: '#1a1a1a',
      color: '#fff',
      borderRadius: '10px',
      marginTop: '50px'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Create a New Room</h2>
      <p style={{ textAlign: 'center', marginBottom: '20px', color: '#888' }}>
        Logged in as: {user.email}
      </p>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Room Name:
          </label>
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Enter room name"
            disabled={isUploading}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#333',
              color: '#fff',
              fontSize: '16px'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Movie File (Optional):
          </label>
          <input
            type="file"
            accept="video/*,.mp4,.webm,.ogg,.avi,.mov,.mkv"
            onChange={handleFileChange}
            disabled={isUploading}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#333',
              color: '#fff',
              fontSize: '16px'
            }}
          />
          {movieFile && (
            <p style={{ marginTop: '8px', fontSize: '14px', color: '#888' }}>
              Selected: {movieFile.name} ({(movieFile.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>
        
        <button
          type="submit"
          disabled={isUploading || !roomName.trim()}
          style={{
            width: '100%',
            padding: '15px',
            backgroundColor: isUploading ? '#666' : '#4caf50',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: isUploading ? 'not-allowed' : 'pointer'
          }}
        >
          {isUploading ? 'Creating Room...' : 'Create Room'}
        </button>
      </form>
      
      {message && (
        <div style={{
          marginTop: '20px',
          padding: '12px',
          backgroundColor: message.includes('Error') || message.includes('Failed') ? '#f44336' : '#4caf50',
          borderRadius: '6px',
          textAlign: 'center'
        }}>
          {message}
        </div>
      )}
    </div>
  );
};

export default CreateRoom;
