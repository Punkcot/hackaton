#!/bin/bash

# Скрипт деплоя на сервер 185.23.34.130
# Использование: ./deploy.sh

set -e

SERVER="185.23.34.130"
USER="root"
APP_DIR="/var/www/hackaton2025.robot.ru.net"
REPO_URL="https://github.com/Punkcot/hackaton.git"

echo "🚀 Начинаем деплой приложения на сервер $SERVER"

# Проверяем подключение к серверу
echo "📡 Проверяем подключение к серверу..."
if ! ssh -o ConnectTimeout=10 $USER@$SERVER "echo 'Подключение успешно'"; then
    echo "❌ Не удается подключиться к серверу $SERVER"
    echo "Убедитесь, что:"
    echo "1. SSH ключ добавлен на сервер"
    echo "2. Сервер доступен по адресу $SERVER"
    echo "3. Пользователь $USER имеет права доступа"
    exit 1
fi

echo "✅ Подключение к серверу установлено"

# Создаем директорию приложения на сервере
echo "📁 Создаем директорию приложения..."
ssh $USER@$SERVER "mkdir -p $APP_DIR"

# Клонируем/обновляем репозиторий
echo "📥 Клонируем репозиторий..."
ssh $USER@$SERVER "cd $APP_DIR && if [ -d .git ]; then git pull origin main; else git clone $REPO_URL .; fi"

# Устанавливаем зависимости
echo "📦 Устанавливаем зависимости..."
ssh $USER@$SERVER "cd $APP_DIR && npm install --production"

# Создаем systemd сервис
echo "⚙️ Настраиваем systemd сервис..."
ssh $USER@$SERVER "cat > /etc/systemd/system/hackaton-app.service << 'EOF'
[Unit]
Description=Hackaton Flight Visualization App
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=$APP_DIR
ExecStart=/usr/bin/node src/server.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
EOF"

# Перезагружаем systemd и запускаем сервис
echo "🔄 Перезагружаем systemd и запускаем сервис..."
ssh $USER@$SERVER "systemctl daemon-reload && systemctl enable hackaton-app && systemctl restart hackaton-app"

# Настраиваем Nginx
echo "🌐 Настраиваем Nginx..."
ssh $USER@$SERVER "cat > /etc/nginx/sites-available/hackaton2025.robot.ru.net << 'EOF'
server {
    listen 80;
    server_name hackaton2025.robot.ru.net;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF"

# Активируем сайт
echo "🔗 Активируем сайт в Nginx..."
ssh $USER@$SERVER "ln -sf /etc/nginx/sites-available/hackaton2025.robot.ru.net /etc/nginx/sites-enabled/ && nginx -t && systemctl reload nginx"

# Настраиваем SSL с Let's Encrypt
echo "🔒 Настраиваем SSL сертификат..."
ssh $USER@$SERVER "if ! command -v certbot &> /dev/null; then apt update && apt install -y certbot python3-certbot-nginx; fi"
ssh $USER@$SERVER "certbot --nginx -d hackaton2025.robot.ru.net --non-interactive --agree-tos --email admin@robot.ru.net"

# Проверяем статус
echo "✅ Проверяем статус приложения..."
ssh $USER@$SERVER "systemctl status hackaton-app --no-pager"

echo "🎉 Деплой завершен!"
echo "🌐 Приложение доступно по адресу: https://hackaton2025.robot.ru.net/"
