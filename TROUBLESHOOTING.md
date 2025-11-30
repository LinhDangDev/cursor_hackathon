# Troubleshooting - Kết nối từ điện thoại

## Vấn đề: Không thể kết nối từ điện thoại dù cùng WiFi

### Bước 1: Kiểm tra Frontend có chạy trên 0.0.0.0

Đảm bảo bạn chạy:
```bash
cd frontend
npm run dev
```

KHÔNG chạy `npm run dev:local` (chỉ chạy trên localhost)

### Bước 2: Kiểm tra Windows Firewall

**Cách 1: Tắt tạm thời để test**
1. Mở Windows Defender Firewall
2. Tắt Firewall tạm thời (chỉ để test)
3. Thử kết nối lại từ điện thoại

**Cách 2: Thêm exception cho Node.js**
1. Mở Windows Defender Firewall
2. Advanced Settings
3. Inbound Rules > New Rule
4. Chọn "Port" > Next
5. TCP > Specific local ports: `3000,3001` > Next
6. Allow the connection > Next
7. Check all profiles > Next
8. Name: "Node.js Dev Server" > Finish

### Bước 3: Kiểm tra Backend có chạy không

Đảm bảo backend đang chạy:
```bash
cd backend
node server.js
```

Kiểm tra xem có log "Server running on port 3001" không

### Bước 4: Kiểm tra từ máy tính

Mở trình duyệt trên máy tính và truy cập:
- `http://192.168.38.27:3000` - Frontend
- `http://192.168.38.27:3001` - Backend (sẽ không có giao diện nhưng không báo lỗi)

Nếu không truy cập được từ chính máy tính, có thể là:
- Next.js chưa chạy trên 0.0.0.0
- Port bị chặn

### Bước 5: Kiểm tra .env.local

Tạo file `frontend/.env.local`:
```env
NEXT_PUBLIC_SOCKET_URL=http://192.168.38.27:3001
```

Sau đó restart frontend:
```bash
# Dừng frontend (Ctrl+C)
cd frontend
npm run dev
```

### Bước 6: Kiểm tra từ điện thoại

1. Đảm bảo điện thoại và laptop cùng WiFi
2. Mở trình duyệt trên điện thoại
3. Truy cập: `http://192.168.38.27:3000`
4. Mở Developer Tools (nếu có) để xem lỗi

### Bước 7: Test kết nối

**Từ điện thoại, mở terminal hoặc browser console và test:**

```javascript
// Test socket connection
fetch('http://192.168.38.27:3001')
  .then(r => console.log('Backend OK'))
  .catch(e => console.error('Backend Error:', e))
```

### Bước 8: Kiểm tra Network

**Ping test từ điện thoại:**
- Nếu có terminal trên điện thoại: `ping 192.168.38.27`
- Hoặc dùng app network scanner

### Các lỗi thường gặp:

1. **"ERR_CONNECTION_REFUSED"**
   - Firewall đang chặn
   - Server chưa chạy
   - Chạy sai script (dev:local thay vì dev)

2. **"ERR_CONNECTION_TIMED_OUT"**
   - Không cùng mạng
   - IP address sai
   - Router chặn

3. **Socket không kết nối**
   - Kiểm tra NEXT_PUBLIC_SOCKET_URL trong .env.local
   - Kiểm tra backend có chạy không
   - Kiểm tra CORS trong backend

### Quick Fix Commands:

```bash
# 1. Kiểm tra port có đang được sử dụng
netstat -ano | findstr :3000
netstat -ano | findstr :3001

# 2. Kill process nếu cần
taskkill /PID <PID_NUMBER> /F

# 3. Restart cả hai server
# Terminal 1
cd backend && node server.js

# Terminal 2  
cd frontend && npm run dev
```

