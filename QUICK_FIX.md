# Quick Fix - Kết nối từ điện thoại (IP: 192.168.38.27)

## Các bước khắc phục nhanh:

### 1. Tạo file `.env.local` trong thư mục `frontend/`

Tạo file `frontend/.env.local` với nội dung:
```env
NEXT_PUBLIC_SOCKET_URL=http://192.168.38.27:3001
```

### 2. Mở Windows Firewall cho port 3000 và 3001

**Cách nhanh nhất (PowerShell as Administrator):**
```powershell
New-NetFirewallRule -DisplayName "Node.js Dev Port 3000" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "Node.js Dev Port 3001" -Direction Inbound -LocalPort 3001 -Protocol TCP -Action Allow
```

**Hoặc thủ công:**
1. Mở Windows Defender Firewall
2. Advanced Settings
3. Inbound Rules > New Rule
4. Port > TCP > Specific ports: `3000,3001`
5. Allow connection
6. Apply to all profiles
7. Name: "Node.js Dev"

### 3. Khởi động lại servers

**Terminal 1 - Backend:**
```bash
cd backend
node server.js
```
Kiểm tra log: `Server running on port 3001`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Kiểm tra log: `- Local: http://localhost:3000`
Kiểm tra log: `- Network: http://192.168.38.27:3000` (quan trọng!)

### 4. Test từ máy tính trước

Mở trình duyệt trên máy tính:
- `http://192.168.38.27:3000` - Phải load được
- `http://192.168.38.27:3001` - Không báo lỗi (backend không có UI)

Nếu không load được từ chính máy tính → Vấn đề là Next.js chưa bind đúng

### 5. Test từ điện thoại

1. Đảm bảo điện thoại và laptop cùng WiFi
2. Mở trình duyệt trên điện thoại
3. Truy cập: `http://192.168.38.27:3000`

### 6. Kiểm tra kết nối

**Từ điện thoại, mở Developer Console (nếu có) và kiểm tra:**
- Có lỗi CORS không?
- Socket có kết nối không?
- Có lỗi network không?

## Nếu vẫn không được:

### Option A: Tắt Firewall tạm thời (chỉ để test)
1. Windows Security > Firewall & network protection
2. Tắt tạm thời cho Private network
3. Test lại từ điện thoại
4. Nếu được → Vấn đề là Firewall, mở port như bước 2

### Option B: Kiểm tra Next.js có chạy trên 0.0.0.0 không

Khi chạy `npm run dev`, phải thấy:
```
- Local:        http://localhost:3000
- Network:      http://192.168.38.27:3000
```

Nếu chỉ thấy Local → Chạy sai script, dùng `npm run dev` (không phải `dev:local`)

### Option C: Kiểm tra port có bị chiếm không

```bash
netstat -ano | findstr :3000
netstat -ano | findstr :3001
```

Nếu có process khác đang dùng → Kill process đó

### Option D: Sử dụng ngrok (nếu vẫn không được)

```bash
# Terminal 1: Backend
cd backend
node server.js

# Terminal 2: Frontend  
cd frontend
npm run dev

# Terminal 3: Ngrok Backend
ngrok http 3001

# Terminal 4: Ngrok Frontend
ngrok http 3000
```

Lấy URL từ ngrok và cập nhật `.env.local`:
```env
NEXT_PUBLIC_SOCKET_URL=https://your-backend-ngrok-url.ngrok.io
```

Truy cập frontend qua ngrok URL trên điện thoại.

