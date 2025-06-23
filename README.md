# QuickChat - Chat Application

QuickChat is a real-time chatting app where users can:
- 💬 Chat with other users
- 📤 Share image files in chat
- 🖼️ Update their profile picture
- 🎨 Choose from 30+ UI color themes
- 🟢 See online status of users

---

## 🚀 Tech Stack

**Frontend**
- ReactJS
- Tailwind CSS
- Zustand (state management)
- Axios
- Socket.io-client
- Moment
- DaisyUI

**Backend**
- Node.js
- Express.js
- MongoDB
- Socket.IO
- Multer (file uploads)
- Cloudinary (image storage)

---

## 📦 Installation

### 1️⃣ Clone the repo
```bash
git clone https://github.com/krrish2906/Chat_Application
cd Chat_App
```

### 2️⃣ Install dependencies
```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

### 3️⃣ Setup environment variables
Create a `.env` file in your `backend/` folder with:
```
MONGODB_URI=your_mongo_connection_string
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
JWT_SECRET=your_jwt_secret
```

### 4️⃣ Run the app
```bash
# Start backend server
cd backend
npm run dev

# Start frontend app
cd ../frontend
npm start
```

---

## 🌐 API Overview

### 🔑 **User Routes**
| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/v1/user/signup` | Register a new user |
| POST | `/api/v1/user/login` | Login user |
| POST | `/api/v1/user/logout` | Logout user |
| PATCH | `/api/v1/user/profile/update` | Update user profile picture (protected) |
| GET | `/api/v1/user/auth/verify` | Verify user authentication (protected) |
| GET | `/api/v1/users` | Get list of users for sidebar (protected) |
| GET | `/api/v1/user` | Fetch logged-in user data (protected) |

---

### 💬 **Message Routes**
| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/v1/messages/:id` | Get chat messages with a user (protected) |
| POST | `/api/v1/send/:id` | Send a message (with optional image) (protected) |

---

## 📌 Features

✅ Real-time chat using Socket.IO  
✅ Share images in messages  
✅ Update profile pictures (Cloudinary)  
✅ 30+ DaisyUI themes  
✅ Online user status tracking  

---