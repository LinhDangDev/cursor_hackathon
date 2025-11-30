# Quick Start - Mobile Hotspot

## Khi dùng Mobile Hotspot, làm theo các bước sau:

### Bước 1: Kết nối laptop vào mobile hotspot

1. Bật mobile hotspot trên điện thoại
2. Kết nối laptop vào hotspot đó

### Bước 2: Chạy script tự động (PowerShell)

```powershell
.\get-ip-and-update-env.ps1
```

Script sẽ tự động:
- Tìm IP address của laptop
- Cập nhật file `frontend/.env.local`

### Bước 3: Hoặc làm thủ công

**Lấy IP address:**
```bash
ipconfig
```
Tìm IP address (thường là `192.168.43.x` hoặc `192.168.137.x`)

**Tạo file `frontend/.env.local`:**
```env
NEXT_PUBLIC_SOCKET_URL=http://YOUR_IP:3001
```
Thay `YOUR_IP` bằng IP bạn vừa tìm được

### Bước 4: Khởi động servers

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
- Mở trình duyệt: `http://YOUR_IP:3000`

**Từ điện thoại:**
- Mở trình duyệt: `http://YOUR_IP:3000` (cùng IP)

### Bước 6: Test matching

1. Đăng nhập trên cả hai thiết bị
2. Chọn interests trên cả hai
3. Đợi matching

## Lưu ý quan trọng:

1. **Cùng mạng:** Cả laptop và điện thoại phải cùng kết nối vào mobile hotspot
2. **IP thay đổi:** Mỗi lần kết nối lại hotspot, IP có thể thay đổi → Chạy lại script
3. **Firewall:** Đảm bảo firewall cho phép port 3000 và 3001
4. **Backend:** Backend phải chạy trước khi frontend

## Troubleshooting:

**Không matching được:**
- Kiểm tra console trên cả hai thiết bị
- Xem socket có kết nối không (log "Socket connected")
- Kiểm tra `NEXT_PUBLIC_SOCKET_URL` có đúng không
- Đảm bảo cả hai đều đã register với interests

**Socket không kết nối:**
- Kiểm tra backend có chạy không
- Kiểm tra IP trong `.env.local` có đúng không
- Thử truy cập `http://YOUR_IP:3001` từ điện thoại (không có UI nhưng không báo lỗi)

