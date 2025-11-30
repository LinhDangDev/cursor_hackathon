# Dating Techub - Real-time Matching & Video Chat Platform

A modern hackathon project featuring real-time user matching, WebRTC video/audio calls, speech-to-text transcription, and AI-powered conversation summarization.

## 🚀 Features

- **Real-time Matching**: Intelligent matching algorithm based on user interests
- **WebRTC Communication**: High-quality video and audio calls between matched users
- **Speech-to-Text**: Real-time transcription using Groq Whisper API
- **AI Summarization**: Automatic conversation summaries using Google Gemini
- **Modern UI**: Built with Next.js 14, TypeScript, and Tailwind CSS
- **Real-time Updates**: Socket.io for instant messaging and notifications

## 📋 Prerequisites

- Node.js 18+ and npm
- Groq API key (for speech-to-text)
- Google Gemini API key (for conversation summarization)

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/LinhDangDev/cursor_hackathon.git
cd cursor_hackathon
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=3001
HOST=0.0.0.0
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
GROQ_API_KEY=your_groq_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

## 🏃 Running the Application

### Start Backend Server

```bash
cd backend
npm run dev
```

The backend server will run on `http://localhost:3001`

### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:3000`

For network access (mobile hotspot):

```bash
npm run dev
# or
npm run dev:local  # for localhost only
```

## 📁 Project Structure

```
cursor_hackathon/
├── backend/
│   ├── server.js          # Express + Socket.io server
│   ├── package.json
│   └── .env               # Backend environment variables
├── frontend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── speech-to-text/  # Groq Whisper API integration
│   │   │   └── summarize/       # Gemini API integration
│   │   ├── chat/                # Main chat interface
│   │   └── components/          # React components
│   ├── components/              # Shared components
│   ├── contexts/                # React contexts (Auth, Socket, etc.)
│   └── lib/                     # Utilities and helpers
└── README.md
```

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
- `PORT`: Server port (default: 3001)
- `HOST`: Server host (default: 0.0.0.0)

**Frontend (.env.local)**
- `NEXT_PUBLIC_SOCKET_URL`: Backend Socket.io URL
- `GROQ_API_KEY`: Groq API key for speech-to-text
- `GEMINI_API_KEY`: Google Gemini API key for summarization

## 🎯 Key Technologies

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, Socket.io
- **APIs**: Groq (Whisper), Google Gemini
- **Real-time**: WebRTC, Socket.io
- **UI Components**: Radix UI, Lucide Icons

## 📝 API Endpoints

### Backend (Socket.io Events)

- `register`: Register user and start matching
- `matched`: Receive match notification
- `call-offer`: Send WebRTC offer
- `call-answer`: Send WebRTC answer
- `ice-candidate`: Exchange ICE candidates
- `send-message`: Send text message
- `send-transcript`: Send speech transcript

### Frontend API Routes

- `POST /api/speech-to-text`: Convert audio to text (Groq)
- `POST /api/summarize`: Generate conversation summary (Gemini)

## 🔒 Security Notes

- Never commit API keys or `.env` files
- Use environment variables for all sensitive data
- Ensure `.env` and `.env.local` are in `.gitignore`

## 🤝 Contributing

This is a hackathon project. Feel free to fork and improve!

## 📄 License

MIT License - feel free to use this project for learning and development.

## 👨‍💻 Author

Built for Cursor Hackathon by LinhDangDev

---

**Note**: This project was created for a hackathon. For production use, consider adding authentication, database persistence, and additional security measures.
