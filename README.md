# 🎥 Pulse Video Streaming App

A Full-Stack Video Streaming Application capable of uploading, processing, and streaming videos using HTTP Range Requests (Chunked Streaming).

## 🚀 Features
- **Video Upload:** Upload videos securely to the server.
- **AI Simulation:** Automated content moderation (Mock AI) to flag or approve videos.
- **Adaptive Streaming:** Implemented **HTTP Range Requests** for buffer-free streaming.
- **Real-Time Updates:** Socket.io used for live status updates (Pending -> Safe).
- **Security:** JWT Authentication & MongoDB Cloud (Atlas) Integration.

## 🛠 Tech Stack
- **Frontend:** React.js, Vite
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas (Cloud)
- **Real-Time:** Socket.io
- **Storage:** Local Server Storage (Multer)

## 🏃‍♂️ How to Run locally
1. Clone the repo.
2. Install dependencies:
   ```bash
   cd backend && npm install
   cd frontend && npm install