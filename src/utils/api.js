// Handles REST API calls for authentication and rooms

export async function loginUser(email, password) {
  try {
    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new Error('Login failed');
    const data = await response.json();
    return data.token; // expects { token: '...' }
  } catch (err) {
    return null;
  }
}

export async function signupUser(email, password) {
  try {
    const response = await fetch('http://localhost:5000/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new Error('Signup failed');
    const data = await response.json();
    return data.token;
  } catch (err) {
    return null;
  }
}


export async function createRoom(roomName, host) {
  try {
    const response = await fetch('http://localhost:5000/api/rooms/create-room', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ roomName, host }),
    });
    if (!response.ok) throw new Error('Room creation failed');
    const data = await response.json();
    return data.roomCode;
  } catch (err) {
    return null;
  }
}

export async function joinRoom(roomCode) {
  try {
    const response = await fetch('http://localhost:5000/api/rooms/join-room', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ roomCode }),
    });
    if (!response.ok) throw new Error('Join room failed');
    const data = await response.json();
    return data.room;
  } catch (err) {
    return null;
  }
}
