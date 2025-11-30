# Frontend - Dating Techub

Ứng dụng frontend cho hệ thống matching và video call.

## Cài đặt

```bash
npm install
```

## Chạy ứng dụng

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

## Cấu hình

Tạo file `.env.local` với nội dung:

```
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

## Flow hoạt động

1. **User truy cập trang** → Hiển thị Consent Modal
2. **User đồng ý** → Hiển thị Login Modal
3. **User điền thông tin** → Hiển thị Interest Selection Modal
4. **User chọn sở thích** → Đăng ký với backend để tìm match
5. **Backend tìm thấy match** (có ít nhất 1 interest chung) → Chuyển sang trang Chat
6. **Trong Chat**:
   - User có thể gửi tin nhắn
   - User có thể gọi voice/video
   - User khác sẽ nhận thông báo và có thể chấp nhận/từ chối
   - Khi cả hai chấp nhận, WebRTC connection được thiết lập

## WebRTC

Ứng dụng sử dụng WebRTC cho browser-to-browser calling:
- Signaling được xử lý qua Socket.io
- STUN server: `stun:stun.l.google.com:19302`
- Hỗ trợ cả voice và video call
