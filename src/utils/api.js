// Dynamic API URL detection
const getApiUrl = () => {
  const hostname = window.location.hostname;
  const port = window.location.port;
  const protocol = window.location.protocol;
  
  // If it's localhost or an IP, use the same host with port 5000
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.match(/^\d+\.\d+\.\d+\.\d+$/)) {
    return `${protocol}//${hostname}:5000/api`;
  }
  
  // If it's an ngrok URL, use the same host (ngrok handles port forwarding)
  if (hostname.includes('ngrok')) {
    return `${protocol}//${hostname}/api`;
  }
  
  // Fallback
  return 'http://localhost:5000/api';
};

const API_URL = getApiUrl();

export async function loginUser(email, password) {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (response.ok) {
      return { success: true, token: data.token };
    } else {
      return { success: false, error: data.error };
    }
  } catch (err) {
    return { success: false, error: 'Network error' };
  }
}

export async function signupUser(email, password) {
  try {
    const response = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (response.ok) {
      return { success: true, token: data.token };
    } else {
      return { success: false, error: data.error };
    }
  } catch (err) {
    return { success: false, error: 'Network error' };
  }
}

export async function createRoom(roomName, host, videoUrl = null) {
  try {
    const response = await fetch(`${API_URL}/rooms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: roomName, host, videoUrl }),
    });
    const data = await response.json();
    if (response.ok) {
      return { success: true, roomCode: data.roomCode };
    } else {
      return { success: false, error: data.error };
    }
  } catch (error) {
    return { success: false, error: 'Network error' };
  }
}

export async function joinRoom(roomCode) {
  try {
    const response = await fetch(`${API_URL}/rooms/${roomCode}/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (response.ok) {
      return { success: true, room: data };
    } else {
      return { success: false, error: data.error };
    }
  } catch (error) {
    return { success: false, error: 'Network error' };
  }
}

export async function getRoomData(roomCode) {
  try {
    const response = await fetch(`${API_URL}/rooms/${roomCode}`);
    const data = await response.json();
    if (response.ok) {
      return { success: true, room: data };
    } else {
      return { success: false, error: data.error };
    }
  } catch (error) {
    return { success: false, error: 'Network error' };
  }
}
