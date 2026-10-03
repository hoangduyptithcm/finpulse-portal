#!/usr/bin/env bash
# ==============================================================================
# Script cài đặt Kokoro-Vietnamese AI TTS chạy dạng Linux Systemd Service (Không dùng Docker)
# Hỗ trợ: Ubuntu 20.04 / 22.04 / 24.04, Debian 11 / 12
# ==============================================================================

set -e

# Kiểm tra quyền root
if [ "$EUID" -ne 0 ]; then
  echo "❌ Vui lòng chạy script này với quyền root hoặc sudo: sudo bash setup-vps.sh"
  exit 1
fi

APP_DIR="/opt/kokoro-tts"
SERVICE_NAME="kokoro-tts"

echo "🚀 [1/6] Cập nhật hệ thống và cài đặt các thư viện hệ thống cần thiết..."
apt-get update -qq
apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    python3-venv \
    build-essential \
    ffmpeg \
    libsndfile1 \
    espeak-ng \
    git \
    curl

echo "📁 [2/6] Thiết lập thư mục ứng dụng tại $APP_DIR..."
mkdir -p "$APP_DIR"
mkdir -p "$APP_DIR/cache"

# Nếu chạy script từ thư mục chứa mã nguồn, copy sang $APP_DIR nếu chưa ở đó
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ "$SCRIPT_DIR" != "$APP_DIR" ]; then
  echo "📦 Đang đồng bộ file từ $SCRIPT_DIR sang $APP_DIR..."
  cp -rf "$SCRIPT_DIR"/app.py "$APP_DIR"/
  cp -rf "$SCRIPT_DIR"/requirements.txt "$APP_DIR"/
  cp -rf "$SCRIPT_DIR"/kokoro-tts.service "$APP_DIR"/
  cp -rf "$SCRIPT_DIR"/Kokoro-Vietnamese "$APP_DIR"/
fi

cd "$APP_DIR"

echo "🐍 [3/6] Tạo môi trường Python Virtualenv..."
if [ ! -d "venv" ]; then
  python3 -m venv venv
fi

source venv/bin/activate
pip install --upgrade pip

echo "⚡ [4/6] Cài đặt PyTorch và các thư viện AI..."
# Kiểm tra GPU NVIDIA nếu có
if command -v nvidia-smi &> /dev/null; then
  echo "🟢 Phát hiện NVIDIA GPU! Cài đặt PyTorch hỗ trợ CUDA..."
  pip install torch torchaudio
  DEVICE="cuda"
else
  echo "⚪ Chạy trên CPU. Cài đặt PyTorch CPU..."
  pip install torch torchaudio --index-url https://download.pytorch.org/whl/cpu || pip install torch torchaudio
  DEVICE="cpu"
fi

echo "📦 Cài đặt các gói phụ thuộc từ requirements.txt..."
pip install -r requirements.txt

echo "⚙️ [5/6] Cấu hình và kích hoạt Systemd Service ($SERVICE_NAME)..."
# Cập nhật DEVICE trong file service nếu có GPU
sed -i "s/Environment=\"DEVICE=.*\"/Environment=\"DEVICE=$DEVICE\"/" kokoro-tts.service
cp kokoro-tts.service /etc/systemd/system/

systemctl daemon-reload
systemctl enable "$SERVICE_NAME"
systemctl restart "$SERVICE_NAME"

echo "⏳ Đang đợi service khởi động..."
sleep 4

echo "🔍 [6/6] Kiểm tra trạng thái service..."
if systemctl is-active --quiet "$SERVICE_NAME"; then
  echo "✅ Service $SERVICE_NAME đang chạy (Active)!"
  curl -s http://localhost:8880/health | grep "healthy" && echo "✅ API Test Healthcheck thành công!" || echo "⚠️ Service đang tải model lên RAM..."
else
  echo "❌ Service chưa khởi động thành công. Xem log bằng lệnh: journalctl -u $SERVICE_NAME -n 50 --no-pager"
  exit 1
fi

echo ""
echo "=========================================================================="
echo "🎉 HOÀN TẤT CÀI ĐẶT KOKORO-VIETNAMESE TTS TRÊN VPS (SYSTEMD SERVICE)!"
echo "=========================================================================="
echo "📍 Thư mục ứng dụng: $APP_DIR"
echo "🌐 API Endpoint:    http://<IP_VPS>:8880/api/tts"
echo "🛠️ Các lệnh quản trị:"
echo "   - Xem log trực tiếp:  sudo journalctl -u $SERVICE_NAME -f"
echo "   - Khởi động lại:      sudo systemctl restart $SERVICE_NAME"
echo "   - Dừng service:       sudo systemctl stop $SERVICE_NAME"
echo "   - Kiểm tra trạng thái: sudo systemctl status $SERVICE_NAME"
echo "=========================================================================="
