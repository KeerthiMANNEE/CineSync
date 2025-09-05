# 🎬 CineSync - Watch Movies Together Online

<div align="center">
  <img src="logo.png" alt="CineSync Logo" width="200" height="200">
  
  **Synchronize your movie watching experience with friends and family in real-time!**
  
  [![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
  [![Socket.IO](https://img.shields.io/badge/Socket.IO-4.7.2-orange.svg)](https://socket.io/)
  [![Express](https://img.shields.io/badge/Express-4.18.2-lightgrey.svg)](https://expressjs.com/)
</div>

## ✨ Features

- 🎥 **Real-time Video Synchronization** - Watch movies together with perfect sync
- 💬 **Live Chat** - Discuss the movie while watching
- 📱 **Cross-Device Support** - Works on desktop, tablet, and mobile
- 🌐 **Network Access** - Share with friends on your local network
- 🔐 **User Authentication** - Secure login and room management
- 📤 **Video Upload** - Upload your own movies (up to 200MB)
- 🎮 **Room Controls** - Play, pause, and seek together
- 👥 **Multi-User Support** - Multiple people can join the same room

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/KeerthiMANNEE/CineSync.git
   cd CineSync/Cine/CineSync
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd server
   npm install
   cd ..
   ```

3. **Start the backend server**
   ```bash
   # Terminal 1 - Backend
   cd server
   node socketServer.js
   ```

4. **Start the frontend**
   ```bash
   # Terminal 2 - Frontend (from project root)
   npm start
   ```

5. **Access the application**
   - **Local**: http://localhost:3000
   - **Network**: http://192.168.1.10:3000 (replace with your IP)

## 📖 How to Use

### 1. Create an Account
- Sign up with your email and password
- Login to access room features

### 2. Create a Movie Room
- Click "Create Room" 
- Enter a room name
- Upload a video file (optional)
- Get your unique room code

### 3. Join a Room
- Enter the room code shared by your friend
- Start watching together!

### 4. Watch Together
- **Play/Pause**: Synced across all users
- **Seek**: Jump to any part of the video together
- **Chat**: Discuss the movie in real-time

## 🌐 Network Access

### Local Network
To allow friends on your WiFi to join:

```bash
# Start frontend with network access
npm start -- --host 0.0.0.0
```

Share this URL: `http://[YOUR_IP]:3000`

### Internet Access (via ngrok)

1. **Install ngrok**: https://ngrok.com/download

2. **Expose backend**:
   ```bash
   ngrok http 5000
   ```

3. **Expose frontend** (optional):
   ```bash
   ngrok http 3000
   ```

4. **Share the ngrok URL** with friends anywhere in the world!

## 🛠️ Tech Stack

### Frontend
- **React 18** - User interface
- **React Router** - Navigation
- **Socket.IO Client** - Real-time communication
- **Context API** - State management

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **Socket.IO** - WebSocket communication
- **Multer** - File upload handling
- **JWT** - Authentication
- **CORS** - Cross-origin support

## 📁 Project Structure

```
CineSync/
├── src/
│   ├── components/         # Reusable components
│   ├── pages/             # Main pages
│   │   ├── Home.jsx       # Landing page
│   │   ├── Login.jsx      # Authentication
│   │   ├── CreateRoom.jsx # Room creation
│   │   └── Room.jsx       # Main movie room
│   ├── context/           # React context
│   └── utils/             # API and socket utilities
├── server/
│   ├── socketServer.js    # Main server file
│   ├── rooms.js          # Room management
│   └── uploads/          # Video storage
└── public/
    └── logo.png          # App logo
```

## 🎮 Controls

| Action | Effect |
|--------|--------|
| **Play/Pause** | Syncs video playback for all users |
| **Seek** | Jumps to timestamp for everyone |
| **Chat** | Send messages to all room members |
| **Upload** | Add video files to rooms |

## 🔧 Configuration

### Supported Video Formats
- MP4, WebM, OGG, AVI, MOV, MKV
- Maximum file size: 200MB

### Network Configuration
Update `server/socketServer.js` to change your network IP:
```javascript
const LOCAL_IP = '192.168.1.10'; // Your WiFi IP
```

## 🐛 Troubleshooting

### Connection Issues
- Ensure both frontend and backend are running
- Check firewall settings for port 3000 and 5000
- Verify your network IP in the configuration

### Video Upload Issues
- Check file format (must be video)
- Ensure file size < 200MB
- Verify uploads folder permissions

### Socket Disconnection
- Check browser console for connection errors
- Ensure backend server is running on correct port
- Try refreshing the page

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Socket.IO for real-time communication
- React team for the amazing framework
- Express.js for the robust backend
- All contributors and testers

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/KeerthiMANNEE">Keerthi MANNEE</a>
  
  **⭐ Star this repo if you like CineSync!**
</div>
