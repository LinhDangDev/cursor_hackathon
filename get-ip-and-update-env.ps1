# Script để tự động lấy IP và cập nhật .env.local

Write-Host "=== Tự động cập nhật IP cho Mobile Hotspot ===" -ForegroundColor Cyan
Write-Host ""

# Lấy IP address của WiFi adapter
$wifiIP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {
    $_.InterfaceAlias -like "*Wi-Fi*" -or 
    $_.InterfaceAlias -like "*Wireless*" -or
    $_.InterfaceAlias -like "*WLAN*"
} | Where-Object { $_.IPAddress -notlike "169.254.*" } | Select-Object -First 1).IPAddress

if (-not $wifiIP) {
    # Nếu không tìm thấy WiFi, lấy IP đầu tiên không phải localhost
    $wifiIP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {
        $_.IPAddress -notlike "127.*" -and 
        $_.IPAddress -notlike "169.254.*" -and
        $_.IPAddress -notlike "172.24.*" -and
        $_.IPAddress -notlike "172.23.*"
    } | Select-Object -First 1).IPAddress
}

if ($wifiIP) {
    Write-Host "✓ Tìm thấy IP address: $wifiIP" -ForegroundColor Green
    Write-Host ""
    
    # Tạo hoặc cập nhật .env.local
    $envPath = "frontend\.env.local"
    $envContent = "NEXT_PUBLIC_SOCKET_URL=http://$wifiIP:3001"
    
    Set-Content -Path $envPath -Value $envContent -Force
    Write-Host "✓ Đã cập nhật file frontend\.env.local" -ForegroundColor Green
    Write-Host "  Nội dung: $envContent" -ForegroundColor Gray
    Write-Host ""
    
    Write-Host "=== Hướng dẫn ===" -ForegroundColor Cyan
    Write-Host "1. Khởi động lại frontend server:" -ForegroundColor White
    Write-Host "   cd frontend" -ForegroundColor Yellow
    Write-Host "   npm run dev" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "2. Truy cập từ điện thoại:" -ForegroundColor White
    Write-Host "   http://$wifiIP:3000" -ForegroundColor Green
    Write-Host ""
    Write-Host "3. Đảm bảo cả laptop và điện thoại:" -ForegroundColor White
    Write-Host "   - Cùng kết nối vào mobile hotspot" -ForegroundColor Gray
    Write-Host "   - Backend đang chạy (cd backend && node server.js)" -ForegroundColor Gray
    Write-Host ""
} else {
    Write-Host "✗ Không tìm thấy IP address" -ForegroundColor Red
    Write-Host ""
    Write-Host "Hãy chạy lệnh sau để xem IP:" -ForegroundColor Yellow
    Write-Host "ipconfig" -ForegroundColor White
    Write-Host ""
    Write-Host "Sau đó tạo file frontend\.env.local với nội dung:" -ForegroundColor Yellow
    Write-Host "NEXT_PUBLIC_SOCKET_URL=http://YOUR_IP:3001" -ForegroundColor White
}

