# Cách lấy IP Address của máy tính

## Windows

### Cách 1: Sử dụng Command Prompt
1. Mở Command Prompt (cmd)
2. Gõ lệnh:
```bash
ipconfig
```
3. Tìm dòng **"IPv4 Address"** trong phần **"Wireless LAN adapter Wi-Fi"** hoặc **"Ethernet adapter"**
   - Ví dụ: `192.168.1.100`

### Cách 2: Sử dụng PowerShell
```powershell
Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.InterfaceAlias -like "*Wi-Fi*" -or $_.InterfaceAlias -like "*Ethernet*"}
```

## Mac

### Cách 1: Sử dụng Terminal
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

### Cách 2: System Preferences
1. System Preferences > Network
2. Chọn WiFi hoặc Ethernet
3. Xem IP address hiển thị

## Linux

```bash
ip addr show
# hoặc
hostname -I
```

## Lưu ý:
- IP address thường có dạng: `192.168.x.x` hoặc `10.0.x.x`
- Đảm bảo bạn lấy IP của interface đang kết nối WiFi/Ethernet, không phải `127.0.0.1` (localhost)
- IP address có thể thay đổi mỗi lần kết nối lại WiFi

