/**
 * Dating Techub Backend Server
 * Real-time matching and WebRTC signaling server
 *
 * Features:
 * - User matching based on interests
 * - WebRTC signaling (offer/answer/ICE candidates)
 * - Real-time messaging and transcript sharing
 */

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// In-memory storage for users and matches
// TODO: Consider using Redis or database for production
const waitingUsers = new Map(); // userId -> { userData, interests, socketId }
const activeMatches = new Map(); // matchId -> { user1, user2, socketId1, socketId2, commonInterests }

/**
 * Find a matching user based on common interests
 * @param {string} userId - Current user ID
 * @param {string[]} interests - User's interests
 * @returns {Object|null} Match object or null if no match found
 */
function findMatch(userId, interests) {
  for (const [otherUserId, otherUser] of waitingUsers.entries()) {
    if (otherUserId === userId) continue;

    // Kiểm tra xem có interests chung không
    const commonInterests = interests.filter(interest =>
      otherUser.interests.includes(interest)
    );

    // Nếu có ít nhất 1 interest chung, match
    if (commonInterests.length > 0) {
      return {
        matchId: `${userId}_${otherUserId}_${Date.now()}`,
        matchedUser: otherUser,
        matchedUserId: otherUserId,
        commonInterests
      };
    }
  }
  return null;
}

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log(`[${new Date().toISOString()}] User connected: ${socket.id}`);

  /**
   * Register user and start matching process
   * Event: 'register'
   * Data: { userId, userData, interests }
   */
  socket.on('register', (data) => {
    const { userId, userData, interests } = data;
    console.log('User registered:', userId, interests);

    // Lưu user vào waiting list
    waitingUsers.set(userId, {
      userData,
      interests,
      socketId: socket.id
    });

    // Tìm match
    const match = findMatch(userId, interests);

    if (match) {
      // Xóa cả hai user khỏi waiting list
      waitingUsers.delete(userId);
      waitingUsers.delete(match.matchedUserId);

      // Tạo match
      activeMatches.set(match.matchId, {
        user1: { userId, userData, socketId: socket.id },
        user2: {
          userId: match.matchedUserId,
          userData: match.matchedUser.userData,
          socketId: match.matchedUser.socketId
        },
        commonInterests: match.commonInterests
      });

      // Gửi thông báo match cho cả hai user
      io.to(socket.id).emit('matched', {
        matchId: match.matchId,
        matchedUser: match.matchedUser.userData,
        commonInterests: match.commonInterests
      });

      io.to(match.matchedUser.socketId).emit('matched', {
        matchId: match.matchId,
        matchedUser: userData,
        commonInterests: match.commonInterests
      });

      console.log('Match created:', match.matchId);
    } else {
      // Chưa có match, thông báo đang tìm
      socket.emit('waiting', { message: 'Đang tìm người phù hợp...' });
    }
  });

  /**
   * WebRTC Signaling - Handle call offer
   * Event: 'call-offer'
   * Data: { matchId, offer, callType }
   */
  socket.on('call-offer', (data) => {
    const { matchId, offer, callType } = data;
    const match = activeMatches.get(matchId);

    if (match) {
      const targetSocketId = match.user1.socketId === socket.id
        ? match.user2.socketId
        : match.user1.socketId;

      io.to(targetSocketId).emit('call-offer', {
        matchId,
        offer,
        callType,
        from: match.user1.socketId === socket.id ? match.user1.userData : match.user2.userData
      });
    }
  });

  /**
   * WebRTC Signaling - Handle call answer
   * Event: 'call-answer'
   * Data: { matchId, answer }
   */
  socket.on('call-answer', (data) => {
    const { matchId, answer } = data;
    const match = activeMatches.get(matchId);

    if (match) {
      const targetSocketId = match.user1.socketId === socket.id
        ? match.user2.socketId
        : match.user1.socketId;

      io.to(targetSocketId).emit('call-answer', {
        matchId,
        answer
      });
    }
  });

  /**
   * WebRTC Signaling - Handle ICE candidate
   * Event: 'ice-candidate'
   * Data: { matchId, candidate }
   */
  socket.on('ice-candidate', (data) => {
    const { matchId, candidate } = data;
    const match = activeMatches.get(matchId);

    if (match) {
      const targetSocketId = match.user1.socketId === socket.id
        ? match.user2.socketId
        : match.user1.socketId;

      io.to(targetSocketId).emit('ice-candidate', {
        matchId,
        candidate
      });
    }
  });

  // Call acceptance/rejection
  socket.on('call-accept', (data) => {
    const { matchId } = data;
    const match = activeMatches.get(matchId);

    if (match) {
      const targetSocketId = match.user1.socketId === socket.id
        ? match.user2.socketId
        : match.user1.socketId;

      io.to(targetSocketId).emit('call-accepted', {
        matchId
      });
    }
  });

  socket.on('call-reject', (data) => {
    const { matchId } = data;
    const match = activeMatches.get(matchId);

    if (match) {
      const targetSocketId = match.user1.socketId === socket.id
        ? match.user2.socketId
        : match.user1.socketId;

      io.to(targetSocketId).emit('call-rejected', {
        matchId
      });
    }
  });

  // End call
  socket.on('end-call', (data) => {
    const { matchId } = data;
    const match = activeMatches.get(matchId);

    if (match) {
      const targetSocketId = match.user1.socketId === socket.id
        ? match.user2.socketId
        : match.user1.socketId;

      io.to(targetSocketId).emit('call-ended', {
        matchId
      });
    }
  });

  // Send message
  socket.on('send-message', (data) => {
    const { matchId, message } = data;
    const match = activeMatches.get(matchId);

    if (match) {
      const targetSocketId = match.user1.socketId === socket.id
        ? match.user2.socketId
        : match.user1.socketId;

      io.to(targetSocketId).emit('new-message', {
        matchId,
        message,
        from: match.user1.socketId === socket.id ? match.user1.userData : match.user2.userData
      });
    }
  });

  // Send transcript
  socket.on('send-transcript', (data) => {
    const { matchId, transcript, speaker } = data;
    const match = activeMatches.get(matchId);

    if (match) {
      const targetSocketId = match.user1.socketId === socket.id
        ? match.user2.socketId
        : match.user1.socketId;

      // Send to the other user with reversed speaker label
      io.to(targetSocketId).emit('new-transcript', {
        matchId,
        transcript,
        speaker: speaker === 'me' ? 'other' : 'me',
        from: match.user1.socketId === socket.id ? match.user1.userData : match.user2.userData
      });
    }
  });

  /**
   * Handle user disconnect
   * Clean up waiting users and active matches
   */
  socket.on('disconnect', () => {
    console.log(`[${new Date().toISOString()}] User disconnected: ${socket.id}`);

    // Xóa user khỏi waiting list nếu có
    for (const [userId, user] of waitingUsers.entries()) {
      if (user.socketId === socket.id) {
        waitingUsers.delete(userId);
        break;
      }
    }

    // Xóa match nếu có
    for (const [matchId, match] of activeMatches.entries()) {
      if (match.user1.socketId === socket.id || match.user2.socketId === socket.id) {
        const otherSocketId = match.user1.socketId === socket.id
          ? match.user2.socketId
          : match.user1.socketId;

        io.to(otherSocketId).emit('partner-disconnected', { matchId });
        activeMatches.delete(matchId);
        break;
      }
    }
  });
});

// Start server
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';

server.listen(PORT, HOST, () => {
  console.log('='.repeat(50));
  console.log(`🚀 Dating Techub Backend Server`);
  console.log(`📍 Server running on http://${HOST}:${PORT}`);
  console.log(`🌐 Accessible from network on port ${PORT}`);
  console.log(`⏰ Started at ${new Date().toISOString()}`);
  console.log('='.repeat(50));
});
