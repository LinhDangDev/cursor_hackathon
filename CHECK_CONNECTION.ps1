# PowerShell script to check and fix connection issues

Write-Host "=== Kiểm tra kết nối từ điện thoại ===" -ForegroundColor Cyan
Write-Host ""

# Check if ports are listening
Write-Host "1. Kiểm tra port 3000 và 3001..." -ForegroundColor Yellow
$port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
$port3001 = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue

if ($port3000) {
    Write-Host "   ✓ Port 3000 đang được sử dụng" -ForegroundColor Green
} else {
    Write-Host "   ✗ Port 3000 không có process nào" -ForegroundColor Red
    Write-Host "     → Hãy chạy: cd frontend && npm run dev" -ForegroundColor Yellow
}

if ($port3001) {
    Write-Host "   ✓ Port 3001 đang được sử dụng" -ForegroundColor Green
} else {
    Write-Host "   ✗ Port 3001 không có process nào" -ForegroundColor Red
    Write-Host "     → Hãy chạy: cd backend && node server.js" -ForegroundColor Yellow
}

Write-Host ""

# Check firewall rules
Write-Host "2. Kiểm tra Firewall rules..." -ForegroundColor Yellow
$fw3000 = Get-NetFirewallRule -DisplayName "*3000*" -ErrorAction SilentlyContinue
$fw3001 = Get-NetFirewallRule -DisplayName "*3001*" -ErrorAction SilentlyContinue

if ($fw3000) {
    Write-Host "   ✓ Có firewall rule cho port 3000" -ForegroundColor Green
} else {
    Write-Host "   ✗ Chưa có firewall rule cho port 3000" -ForegroundColor Red
    Write-Host "     → Đang tạo firewall rule..." -ForegroundColor Yellow
    New-NetFirewallRule -DisplayName "Node.js Dev Port 3000" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow -ErrorAction SilentlyContinue
    Write-Host "     ✓ Đã tạo firewall rule cho port 3000" -ForegroundColor Green
}

if ($fw3001) {
    Write-Host "   ✓ Có firewall rule cho port 3001" -ForegroundColor Green
} else {
    Write-Host "   ✗ Chưa có firewall rule cho port 3001" -ForegroundColor Red
    Write-Host "     → Đang tạo firewall rule..." -ForegroundColor Yellow
    New-NetFirewallRule -DisplayName "Node.js Dev Port 3001" -Direction Inbound -LocalPort 3001 -Protocol TCP -Action Allow -ErrorAction SilentlyContinue
    Write-Host "     ✓ Đã tạo firewall rule cho port 3001" -ForegroundColor Green
}

Write-Host ""

# Check .env.local
Write-Host "3. Kiểm tra file .env.local..." -ForegroundColor Yellow
if (Test-Path "frontend\.env.local") {
    $envContent = Get-Content "frontend\.env.local"
    if ($envContent -match "192.168.38.27") {
        Write-Host "   ✓ File .env.local có đúng IP address" -ForegroundColor Green
    } else {
        Write-Host "   ⚠ File .env.local tồn tại nhưng IP có thể sai" -ForegroundColor Yellow
        Write-Host "     Nội dung:" -ForegroundColor Gray
        $envContent | ForEach-Object { Write-Host "     $_" -ForegroundColor Gray }
    }
} else {
    Write-Host "   ✗ File .env.local không tồn tại" -ForegroundColor Red
    Write-Host "     → Đang tạo file..." -ForegroundColor Yellow
    Set-Content -Path "frontend\.env.local" -Value "NEXT_PUBLIC_SOCKET_URL=http://192.168.38.27:3001"
    Write-Host "     ✓ Đã tạo file .env.local" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== Kết quả ===" -ForegroundColor Cyan
Write-Host "IP Address của bạn: 192.168.38.27" -ForegroundColor White
Write-Host ""
Write-Host "Truy cập từ điện thoại:" -ForegroundColor White
Write-Host "  Frontend: http://192.168.38.27:3000" -ForegroundColor Green
Write-Host "  Backend:  http://192.168.38.27:3001" -ForegroundColor Green
Write-Host ""
Write-Host "Lưu ý:" -ForegroundColor Yellow
Write-Host "  - Đảm bảo cả frontend và backend đang chạy" -ForegroundColor White
Write-Host "  - Đảm bảo điện thoại và laptop cùng WiFi" -ForegroundColor White
Write-Host "  - Nếu vẫn không được, xem file QUICK_FIX.md" -ForegroundColor White

