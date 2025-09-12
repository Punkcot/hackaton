#!/bin/bash

# Быстрый деплой на сервер
# Использование: ./quick-deploy.sh

SERVER="185.23.34.130"
APP_DIR="/var/www/hackaton2025.robot.ru.net"

echo "🚀 Быстрый деплой приложения..."

# Проверяем SSH доступ
echo "📡 Проверяем SSH доступ..."
if ! ssh -o ConnectTimeout=5 root@$SERVER "echo 'SSH OK'"; then
    echo "❌ SSH недоступен. Выполните настройку SSH ключей:"
    echo "1. Скопируйте публичный ключ на сервер:"
    echo "   cat ~/.ssh/id_ed25519.pub | ssh root@$SERVER 'cat >> ~/.ssh/authorized_keys'"
    echo "2. Повторите запуск скрипта"
    exit 1
fi

echo "✅ SSH доступ настроен"

# Создаем директорию и клонируем репозиторий
echo "📁 Настраиваем директорию приложения..."
ssh root@$SERVER "mkdir -p $APP_DIR && cd $APP_DIR && git clone https://github.com/Punkcot/hackaton.git . || git pull origin main"

# Устанавливаем зависимости
echo "📦 Устанавливаем зависимости..."
ssh root@$SERVER "cd $APP_DIR && npm install --production"

# Создаем простой systemd сервис
echo "⚙️ Создаем сервис..."
ssh root@$SERVER "cat > /etc/systemd/system/hackaton-app.service << 'EOF'
[Unit]
Description=Hackaton Flight Visualization App
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=$APP_DIR
ExecStart=/usr/bin/node src/server.js
Restart=always
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
EOF"

# Запускаем сервис
echo "🔄 Запускаем приложение..."
ssh root@$SERVER "systemctl daemon-reload && systemctl enable hackaton-app && systemctl restart hackaton-app"

# Настраиваем Nginx
echo "🌐 Настраиваем Nginx..."
ssh root@$SERVER "cat > /etc/nginx/sites-available/hackaton2025.robot.ru.net << 'EOF'
server {
    listen 80;
    server_name hackaton2025.robot.ru.net;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF"

# Активируем сайт
echo "🔗 Активируем сайт..."
ssh root@$SERVER "ln -sf /etc/nginx/sites-available/hackaton2025.robot.ru.net /etc/nginx/sites-enabled/ && nginx -t && systemctl reload nginx"

# Проверяем статус
echo "✅ Проверяем статус..."
ssh root@$SERVER "systemctl status hackaton-app --no-pager -l"

echo ""
echo "🎉 Деплой завершен!"
echo "🌐 Приложение должно быть доступно по адресу: http://hackaton2025.robot.ru.net/"
echo ""
echo "📋 Для настройки SSL выполните на сервере:"
echo "   certbot --nginx -d hackaton2025.robot.ru.net"
echo ""
echo "📊 Для проверки логов:"
echo "   ssh root@$SERVER 'journalctl -u hackaton-app -f'"
