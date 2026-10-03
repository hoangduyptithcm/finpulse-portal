FROM python:3.10-slim

# Thiết lập thư mục làm việc
WORKDIR /app

# Cài đặt các gói hệ thống cần thiết (ffmpeg, libsndfile, git, espeak-ng)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    git \
    ffmpeg \
    libsndfile1 \
    espeak-ng \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Cài đặt PyTorch và torchaudio trước (tương thích cả CPU & GPU, đa kiến trúc x86_64 & arm64)
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir torch torchaudio

# Sao chép mã nguồn Kokoro-Vietnamese và file requirements
COPY Kokoro-Vietnamese ./Kokoro-Vietnamese
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Sao chép mã nguồn ứng dụng
COPY app.py .

# Cấu hình biến môi trường
ENV PYTHONUNBUFFERED=1
ENV PORT=8880
ENV DEFAULT_VOICE=diem_trinh
ENV DEVICE=cpu

# Mở cổng 8880
EXPOSE 8880

# Chạy ứng dụng FastAPI với Uvicorn
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8880", "--workers", "1"]
