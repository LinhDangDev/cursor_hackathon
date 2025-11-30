# Hướng dẫn kết nối điện thoại với Frontend

## Cách 1: Sử dụng mạng local (WiFi cùng mạng)

### Bước 1: Tìm IP address của máy tính

**Windows:**
```bash
ipconfig
```
Tìm dòng "IPv4 Address" (ví dụ: 192.168.1.100)

**Mac/Linux:**
```bash
ifconfig
# hoặc
ip addr
```
Tìm IP address của interface WiFi (thường là wlan0 hoặc en0)

### Bước 2: Cập nhật biến môi trường

Tạo file `.env.local` trong thư mục `frontend/`:

```env
NEXT_PUBLIC_SOCKET_URL=http://YOUR_IP_ADDRESS:3001
```

Thay `YOUR_IP_ADDRESS` bằng IP address bạn vừa tìm được (ví dụ: `192.168.1.100`)

### Bước 3: Khởi động server

**Backend:**
```bash
cd backend
node server.js
```

**Frontend:**
```bash
cd frontend
npm run dev
```

### Bước 4: Truy cập từ điện thoại

1. Đảm bảo điện thoại và máy tính cùng kết nối vào **cùng một mạng WiFi**
2. Mở trình duyệt trên điện thoại
3. Truy cập: `http://YOUR_IP_ADDRESS:3000`
   - Ví dụ: `http://192.168.1.100:3000`

## Cách 2: Sử dụng ngrok (cho mạng khác nhau)

### Bước 1: Cài đặt ngrok

Tải ngrok từ: https://ngrok.com/download

### Bước 2: Khởi động ngrok

```bash
# Terminal 1: Backend
cd backend
node server.js

# Terminal 2: Frontend
cd frontend
npm run dev

# Terminal 3: Ngrok cho Backend
ngrok http 3001

# Terminal 4: Ngrok cho Frontend
ngrok http 3000
```

### Bước 3: Cập nhật biến môi trường

Lấy URL từ ngrok (ví dụ: `https://abc123.ngrok.io`)

Tạo file `.env.local` trong `frontend/`:
```env
NEXT_PUBLIC_SOCKET_URL=https://YOUR_NGROK_BACKEND_URL
```

### Bước 4: Truy cập từ điện thoại

Truy cập URL ngrok của frontend trên điện thoại (ví dụ: `https://xyz789.ngrok.io`)

## Cách 3: Sử dụng Mobile Hotspot

1. Bật Mobile Hotspot trên điện thoại
2. Kết nối máy tính vào hotspot đó
3. Lấy IP address của máy tính khi kết nối vào hotspot
4. Làm theo Cách 1 với IP address mới

## Lưu ý quan trọng:

1. **Firewall**: Đảm bảo firewall cho phép kết nối trên port 3000 và 3001
   - Windows: Mở Windows Defender Firewall và thêm exception cho Node.js
   - Mac: System Preferences > Security & Privacy > Firewall

2. **CORS**: Backend đã được cấu hình để cho phép CORS từ mọi origin

3. **HTTPS**: Nếu cần HTTPS (cho camera/microphone trên một số trình duyệt), sử dụng ngrok hoặc deploy lên server có SSL

4. **Kiểm tra kết nối**: 
   - Đảm bảo cả frontend và backend đều chạy
   - Kiểm tra console trên điện thoại để xem có lỗi kết nối không

## Troubleshooting:

- **Không kết nối được**: Kiểm tra IP address có đúng không, cả hai thiết bị có cùng mạng không
- **Socket không kết nối**: Kiểm tra `NEXT_PUBLIC_SOCKET_URL` trong `.env.local` có đúng không
- **Camera/Microphone không hoạt động**: Một số trình duyệt yêu cầu HTTPS, sử dụng ngrok

