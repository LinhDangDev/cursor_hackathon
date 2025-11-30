# Backend Server

Backend server cho ứng dụng Dating Techub matching và WebRTC signaling.

## Cài đặt

```bash
npm install
```

## Chạy server

```bash
# Development mode (với nodemon)
npm run dev

# Production mode
npm start
```

Server sẽ chạy trên port 3001 (hoặc port được chỉ định trong biến môi trường PORT).

## API Endpoints

Server sử dụng Socket.io cho real-time communication:

### Socket Events

#### Client -> Server:
- `register`: Đăng ký user và tìm match
  ```javascript
  socket.emit('register', {
    userId: string,
    userData: { hoTen, githubOrLinkedIn, type },
    interests: string[]
  })
  ```

- `call-offer`: Gửi WebRTC offer
- `call-answer`: Gửi WebRTC answer
- `ice-candidate`: Gửi ICE candidate
- `call-accept`: Chấp nhận cuộc gọi
- `call-reject`: Từ chối cuộc gọi
- `end-call`: Kết thúc cuộc gọi
- `send-message`: Gửi tin nhắn

#### Server -> Client:
- `matched`: Thông báo đã tìm thấy match
- `waiting`: Đang chờ tìm match
- `call-offer`: Nhận offer từ user khác
- `call-answer`: Nhận answer
- `ice-candidate`: Nhận ICE candidate
- `call-accepted`: Cuộc gọi được chấp nhận
- `call-rejected`: Cuộc gọi bị từ chối
- `call-ended`: Cuộc gọi đã kết thúc
- `new-message`: Nhận tin nhắn mới
- `partner-disconnected`: Partner đã ngắt kết nối

## Matching Logic

Server sẽ match users dựa trên:
- Có ít nhất 1 interest chung
- User đầu tiên trong waiting list sẽ được match với user tiếp theo có interest chung

