# PROJECT DESCRIPTION - Dating Techub

## 📋 PROJECT OVERVIEW

**Project Name:** Dating Techub  
**Application Type:** Web Application - Real-time Matching & Video Call Platform  
**Purpose:** A platform that connects users based on technology interests, enabling chat and direct video calls with real-time speech-to-text transcription and AI-powered conversation summarization.

---

## 🏗️ SYSTEM ARCHITECTURE

### **Frontend (Next.js 14 + TypeScript)**
- **Framework:** Next.js 14 with App Router
- **UI Framework:** React 18.2
- **Styling:** Tailwind CSS with Neobrutalism design system
- **Component Library:** Shadcn/ui (customizable components)
- **Real-time Communication:** Socket.io Client
- **State Management:** React Context API
- **WebRTC:** Native browser WebRTC API
- **Speech Recognition:** Web Speech API + MediaRecorder for audio transcription

### **Backend (Node.js + Express)**
- **Runtime:** Node.js
- **Framework:** Express.js
- **Real-time Server:** Socket.io Server
- **Port:** 3001 (default)

---

## 🎯 KEY FEATURES

### 1. **User Authentication & Onboarding**
- **Consent Modal:** Requires users to agree to terms before using the service
- **Login Modal:** 
  - Enter full name
  - Select account type (GitHub or LinkedIn)
  - Enter profile URL (GitHub/LinkedIn)
  - Multi-language support (Vietnamese/English)
- **Interest Selection Modal:**
  - Select multiple technology interests from categories:
    - Frontend: React, Vue.js, Angular, Next.js, TypeScript, JavaScript, Tailwind CSS, SASS/SCSS
    - Backend: Node.js, Python, Java, C#, .NET, PHP, Go, Ruby
    - Database: MySQL, PostgreSQL, MongoDB, Redis, Firebase, Supabase
    - Mobile: React Native, Flutter, Swift, Kotlin, Ionic
    - DevOps: Docker, Kubernetes, AWS, Azure, CI/CD, Git, Linux
    - Tools & Others: VS Code, GitHub, Figma, Jira, Agile, Scrum
  - Display selected count
  - Validation: Must select at least 1 interest

### 2. **Smart Matching System**
- **Matching Algorithm:**
  - Finds users with at least 1 common interest
  - Matching follows FIFO (First In First Out) order
  - Automatically creates matchId when match is found
  - Stores match information in activeMatches Map
- **Real-time Matching:**
  - Socket.io connection automatically when user logs in
  - Registers user to waiting list after selecting interests
  - Real-time notification when match is found
  - Displays matched user information and common interests

### 3. **Chat System**
- **Real-time Messaging:**
  - Send/receive text messages in real-time
  - Display timestamp for each message
  - UI distinguishes own messages from partner's
  - Auto-scroll to latest message
  - Responsive design for mobile and desktop

### 4. **WebRTC Video/Voice Call**
- **Call Types:**
  - Voice Call: Audio only
  - Video Call: Audio + Video
- **Call Flow:**
  1. User A initiates call → Creates WebRTC offer
  2. Backend forwards offer to User B
  3. User B receives incoming call notification
  4. User B can Accept or Reject
  5. If Accept: Creates answer and establishes peer connection
  6. Exchange ICE candidates to establish connection
  7. When both accept → Call active
- **Call Features:**
  - Mute/Unmute microphone
  - Turn on/off video (for video call)
  - End call
  - Display status: idle, calling, ringing, active, ended
  - Incoming call modal with caller information

### 5. **Real-time Speech-to-Text Transcription**
- **Automatic Transcription:**
  - Records audio from both local and remote streams during active calls
  - Uses Web Speech API for real-time local transcription
  - Falls back to MediaRecorder + API for remote audio transcription
  - Transcribes in 10-second chunks for optimal accuracy
  - Supports Vietnamese language (vi-VN)
- **Transcript Display:**
  - Real-time transcript panel showing conversation history
  - Distinguishes between "me" and "other" speaker
  - Timestamps for each transcript entry
  - Auto-scroll to latest transcript

### 6. **AI-Powered Conversation Summarization**
- **Summary Generation:**
  - One-click button to generate conversation summary
  - Uses AI to analyze entire conversation transcript
  - Provides concise summary of key discussion points
  - Displays summary in dedicated panel section

### 7. **User Interface & Experience**
- **Design System:**
  - Neobrutalism style with bold borders and vibrant colors
  - Neo-border-sm: Signature border style
  - Neo-blue-bg: Primary blue background color
  - Responsive and mobile-friendly
- **Context Management:**
  - **AuthContext:** Manages authentication state, stores in localStorage
  - **SocketContext:** Manages Socket.io connection and match state
  - **ModalContext:** Manages state of modals (consent, login, interests, matching)
  - **LanguageContext:** Multi-language support (vi/en)
  - **ThemeContext:** Theme management (if applicable)
- **Navigation:**
  - Navbar with menu navigation
  - Routing with Next.js App Router
  - Protected routes (chat page only shows when matched)

---

## 🔄 USER FLOW

### **Flow 1: Onboarding & Matching**
```
1. User visits homepage
   ↓
2. Consent Modal displays → User agrees
   ↓
3. Login Modal displays → User enters information (name, GitHub/LinkedIn URL)
   ↓
4. Interest Selection Modal → User selects interests
   ↓
5. Backend finds match based on common interests
   ↓
6. If match found → Navigate to Chat page
   ↓
7. If no match yet → Display "Finding suitable person..."
```

### **Flow 2: Chat & Call**
```
1. User enters Chat page (already matched)
   ↓
2. Display matched user information and common interests
   ↓
3. User can:
   - Send text messages
   - Start Voice Call
   - Start Video Call
   ↓
4. If incoming call:
   - Display notification modal
   - User can Accept or Reject
   ↓
5. When call active:
   - Voice: Display UI with controls (mute, end)
   - Video: Display 2 video streams (local + remote)
   - Can toggle mute/video
   - Automatic speech-to-text transcription starts
   - Transcript panel displays real-time conversation
   ↓
6. After call:
   - User can generate AI summary of conversation
   - View full transcript history
```

---

## 📡 SOCKET.IO EVENTS

### **Client → Server:**
- `register`: Register user and find match
  ```javascript
  {
    userId: string,
    userData: { hoTen, githubOrLinkedIn, type },
    interests: string[]
  }
  ```
- `call-offer`: Send WebRTC offer
- `call-answer`: Send WebRTC answer
- `ice-candidate`: Send ICE candidate
- `call-accept`: Accept call
- `call-reject`: Reject call
- `end-call`: End call
- `send-message`: Send message
- `send-transcript`: Send transcript to partner

### **Server → Client:**
- `matched`: Notify match found
- `waiting`: Waiting to find match
- `call-offer`: Receive offer from other user
- `call-answer`: Receive answer
- `ice-candidate`: Receive ICE candidate
- `call-accepted`: Call accepted
- `call-rejected`: Call rejected
- `call-ended`: Call ended
- `new-message`: Receive new message
- `new-transcript`: Receive new transcript from partner
- `partner-disconnected`: Partner disconnected

---

## 🗂️ DIRECTORY STRUCTURE

### **Frontend:**
```
frontend/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── speech-to-text/ # Speech-to-text API
│   │   └── summarize/     # Summarization API
│   ├── chat/              # Chat page
│   ├── components/         # Page-specific components
│   ├── docs/              # Documentation pages
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/             # Reusable components
│   ├── ui/                # UI components (shadcn/ui)
│   ├── ConsentModal.tsx
│   ├── InterestSelectionModal.tsx
│   ├── LoginModal.tsx
│   ├── MatchingModal.tsx
│   ├── SpeechRecorder.tsx # Speech-to-text component
│   ├── SummaryPanel.tsx   # Transcript & summary panel
│   └── navbar.tsx
├── contexts/              # React Contexts
│   ├── AuthContext.tsx
│   ├── LanguageContext.tsx
│   ├── ModalContext.tsx
│   ├── SocketContext.tsx
│   └── ThemeContext.tsx
└── lib/                   # Utilities
    ├── i18n/              # Translations
    └── utils.ts
```

### **Backend:**
```
backend/
├── server.js              # Main server file
├── package.json
└── README.md
```

---

## 🛠️ TECHNOLOGY STACK

### **Frontend Dependencies:**
- `next`: 14.0.0
- `react`: 18.2.0
- `react-dom`: 18.2.0
- `socket.io-client`: 4.8.1
- `tailwindcss`: 3.3.5
- `typescript`: 5.2.2
- `lucide-react`: Icons
- `@radix-ui/react-slot`: UI primitives

### **Backend Dependencies:**
- `express`: 4.18.2
- `socket.io`: 4.5.4
- `cors`: 2.8.5
- `nodemon`: 3.0.1 (dev)

### **AI/ML Services:**
- Speech-to-text API (for audio transcription)
- AI summarization service (for conversation summaries)

---

## 🎨 DESIGN HIGHLIGHTS

- **Neobrutalism Style:**
  - Bold, thick borders (neo-border-sm)
  - High contrast colors
  - Geometric shapes
  - Bold typography
  - Vibrant color palette (neo-blue-bg)
  
- **Responsive Design:**
  - Mobile-first approach
  - Breakpoints: sm, md, lg, xl
  - Flexible grid layouts
  
- **Accessibility:**
  - Semantic HTML
  - Keyboard navigation support
  - Screen reader friendly

---

## 🚀 DEPLOYMENT & CONFIGURATION

### **Environment Variables:**
- Frontend: `NEXT_PUBLIC_SOCKET_URL=http://localhost:3001`
- Backend: `PORT=3001` (optional)

### **Running the Project:**
```bash
# Backend
cd backend
npm install
npm run dev  # Development with nodemon
npm start   # Production

# Frontend
cd frontend
npm install
npm run dev  # Development
npm run build && npm start  # Production
```

---

## 📊 DATA STRUCTURES

### **User Data:**
```typescript
{
  hoTen: string
  githubOrLinkedIn: string
  type: 'github' | 'linkedin'
  token?: string
}
```

### **Match Data:**
```typescript
{
  matchId: string
  user1: { userId, userData, socketId }
  user2: { userId, userData, socketId }
  commonInterests: string[]
}
```

### **Message Data:**
```typescript
{
  id: string
  text: string
  sender: 'me' | 'other'
  timestamp: Date
}
```

### **Transcript Data:**
```typescript
{
  id: string
  text: string
  timestamp: Date
  speaker: 'me' | 'other'
}
```

---

## 🔐 SECURITY CONSIDERATIONS

- Token-based authentication (localStorage)
- Socket.io connection validation
- WebRTC peer connection security
- CORS configuration
- Input validation
- Audio data privacy (transcription only, no storage)

---

## 🎯 USE CASES

1. **Developer Networking:** Connect developers with shared technology interests
2. **Tech Mentorship:** Find mentors or mentees in technology fields
3. **Project Collaboration:** Find partners for technology projects
4. **Learning & Discussion:** Discuss technology through chat and video calls with automatic transcription
5. **Meeting Documentation:** Automatically transcribe and summarize technical discussions

---

## 📈 FUTURE ENHANCEMENTS (Potential)

- Database integration (MongoDB/PostgreSQL)
- User profiles and history
- Group matching
- Screen sharing in video call
- File sharing in chat
- Push notifications
- Analytics and reporting
- Admin dashboard
- Export transcripts and summaries
- Multi-language transcription support
- Real-time translation

---

## 📝 NOTES FOR SLIDE CREATION

### **Slide 1: Title Slide**
- Project Name: Dating Techub
- Tagline: "Connect developers through technology interests"

### **Slide 2: Problem Statement**
- Developers struggle to find people with similar interests
- Need platform for networking and collaboration
- Difficult to document and review technical conversations

### **Slide 3: Solution Overview**
- Real-time matching based on interests
- Integrated chat and video call
- Modern UI/UX with Neobrutalism design
- Automatic speech-to-text transcription
- AI-powered conversation summarization

### **Slide 4: Key Features**
- Smart Matching Algorithm
- Real-time Chat
- WebRTC Video/Voice Call
- Real-time Speech-to-Text Transcription
- AI Conversation Summarization
- Multi-language Support
- Responsive Design

### **Slide 5: Technology Stack**
- Frontend: Next.js, React, TypeScript, Tailwind CSS
- Backend: Node.js, Express, Socket.io
- Real-time: WebRTC, Socket.io
- AI: Speech-to-text API, Summarization API
- Design: Neobrutalism, Shadcn/ui

### **Slide 6: Architecture Diagram**
- Frontend ↔ Socket.io ↔ Backend
- WebRTC Peer-to-Peer connection
- Matching algorithm flow
- Speech-to-text processing pipeline

### **Slide 7: User Flow**
- Onboarding → Matching → Chat → Call → Transcription → Summary

### **Slide 8: Demo Screenshots**
- Home page
- Login/Interest selection
- Chat interface
- Video call interface
- Transcript panel
- Summary generation

### **Slide 9: Technical Highlights**
- Real-time matching algorithm
- WebRTC implementation
- Socket.io event handling
- Context-based state management
- Speech-to-text integration
- AI summarization

### **Slide 10: Future Roadmap**
- Database integration
- Enhanced features
- Scalability improvements
- Advanced AI features

---

**Created by:** AI Assistant  
**Date:** 2024  
**Purpose:** Project description document for slide presentation
