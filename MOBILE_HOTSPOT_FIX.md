# Fix: Matching không hoạt động khi dùng Mobile Hotspot

## Vấn đề:
- Điện thoại phát mạng (mobile hotspot)
- Laptop kết nối vào hotspot
- Truy cập được web nhưng không matching được

## Nguyên nhân:
Khi dùng mobile hotspot, IP address của laptop sẽ khác. Cần cập nhật IP trong `.env.local`

## Giải pháp:

### Bước 1: Lấy IP address mới của laptop

Khi laptop đã kết nối vào mobile hotspot, chạy:
```bash
ipconfig
```

Tìm IP address mới (thường là `192.168.43.x` hoặc `192.168.137.x`)

Ví dụ: `192.168.43.100`

### Bước 2: Cập nhật .env.local

Cập nhật file `frontend/.env.local` với IP mới:
```env
NEXT_PUBLIC_SOCKET_URL=http://192.168.43.100:3001
```

**Lưu ý:** Thay `192.168.43.100` bằng IP thực tế của bạn

### Bước 3: Đảm bảo Backend accessible từ điện thoại

Backend cần chạy trên `0.0.0.0` để có thể truy cập từ điện thoại.

Kiểm tra file `backend/server.js` - đảm bảo server listen trên tất cả interfaces.

### Bước 4: Khởi động lại servers

**Terminal 1 - Backend:**
```bash
cd backend
node server.js
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Bước 5: Truy cập từ cả hai thiết bị

**Từ laptop:**
- `http://192.168.43.100:3000` (hoặc IP của laptop)

**Từ điện thoại:**
- `http://192.168.43.100:3000` (cùng IP của laptop)

### Bước 6: Kiểm tra Socket connection

Mở Developer Console trên cả hai thiết bị và kiểm tra:
- Socket có kết nối không?
- Có lỗi CORS không?
- Có lỗi network không?

## Giải pháp thay thế: Sử dụng ngrok

Nếu vẫn không được, dùng ngrok để tạo public URL:

### Bước 1: Cài ngrok
Tải từ: https://ngrok.com/download

### Bước 2: Chạy ngrok
```bash
# Terminal 1: Backend
cd backend
node server.js

# Terminal 2: Ngrok Backend
ngrok http 3001

# Terminal 3: Frontend
cd frontend
npm run dev

# Terminal 4: Ngrok Frontend  
ngrok http 3000
```

### Bước 3: Cập nhật .env.local
Lấy URL từ ngrok backend (ví dụ: `https://abc123.ngrok.io`)

Cập nhật `frontend/.env.local`:
```env
NEXT_PUBLIC_SOCKET_URL=https://abc123.ngrok.io
```

### Bước 4: Truy cập
- Laptop: URL ngrok frontend
- Điện thoại: URL ngrok frontend (cùng URL)

## Troubleshooting:

1. **Socket không kết nối:**
   - Kiểm tra `NEXT_PUBLIC_SOCKET_URL` có đúng không
   - Kiểm tra backend có chạy không
   - Kiểm tra console có lỗi không

2. **Matching không hoạt động:**
   - Đảm bảo cả hai đều đăng nhập
   - Đảm bảo cả hai đều chọn interests
   - Kiểm tra socket connection trên cả hai

3. **Network error:**
   - Thử tắt firewall tạm thời
   - Kiểm tra mobile hotspot có cho phép device-to-device communication không

