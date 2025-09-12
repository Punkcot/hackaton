# Инструкция по деплою на сервер

## Предварительные требования

### 1. Настройка SSH доступа к серверу

**На локальной машине:**
```bash
# Генерируем SSH ключ (если еще не создан)
ssh-keygen -t ed25519 -C "deploy@hackaton2025"

# Копируем публичный ключ
cat ~/.ssh/id_ed25519.pub
```

**На сервере 185.23.34.130:**
```bash
# Подключаемся к серверу (по паролю)
ssh root@185.23.34.130

# Создаем директорию .ssh
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Добавляем публичный ключ
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIDX7WKBgHgZEHm6knD14db/6yGkxKM6uvClbdrl5TYKm punkcot@github" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

# Устанавливаем необходимые пакеты
apt update
apt install -y nodejs npm nginx git certbot python3-certbot-nginx
```

### 2. Настройка домена

**В панели управления доменом robot.ru.net:**
1. Создайте A-запись: `hackaton2025.robot.ru.net` → `185.23.34.130`
2. Дождитесь распространения DNS (5-15 минут)

## Деплой приложения

### Автоматический деплой

```bash
# Запускаем скрипт деплоя
./deploy.sh
```

### Ручной деплой

```bash
# 1. Подключаемся к серверу
ssh root@185.23.34.130

# 2. Создаем директорию приложения
mkdir -p /var/www/hackaton2025.robot.ru.net
cd /var/www/hackaton2025.robot.ru.net

# 3. Клонируем репозиторий
git clone https://github.com/Punkcot/hackaton.git .

# 4. Устанавливаем зависимости
npm install --production

# 5. Создаем systemd сервис
cat > /etc/systemd/system/hackaton-app.service << 'EOF'
[Unit]
Description=Hackaton Flight Visualization App
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/hackaton2025.robot.ru.net
ExecStart=/usr/bin/node src/server.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
EOF

# 6. Запускаем сервис
systemctl daemon-reload
systemctl enable hackaton-app
systemctl start hackaton-app

# 7. Настраиваем Nginx
cat > /etc/nginx/sites-available/hackaton2025.robot.ru.net << 'EOF'
server {
    listen 80;
    server_name hackaton2025.robot.ru.net;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# 8. Активируем сайт
ln -sf /etc/nginx/sites-available/hackaton2025.robot.ru.net /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx

# 9. Настраиваем SSL
certbot --nginx -d hackaton2025.robot.ru.net --non-interactive --agree-tos --email admin@robot.ru.net
```

## Проверка деплоя

```bash
# Проверяем статус приложения
systemctl status hackaton-app

# Проверяем логи
journalctl -u hackaton-app -f

# Проверяем доступность
curl -I https://hackaton2025.robot.ru.net/
```

## Обновление приложения

```bash
# Подключаемся к серверу
ssh root@185.23.34.130

# Переходим в директорию приложения
cd /var/www/hackaton2025.robot.ru.net

# Обновляем код
git pull origin main

# Перезапускаем приложение
systemctl restart hackaton-app
```

## Структура файлов на сервере

```
/var/www/hackaton2025.robot.ru.net/
├── src/
│   ├── server.js
│   └── public/
│       ├── index.html
│       ├── styles.css
│       ├── globe.js
│       └── app.js
├── schedule.json
├── package.json
├── Dockerfile
└── docker-compose.yml
```

## Мониторинг

```bash
# Статус сервисов
systemctl status hackaton-app nginx

# Логи приложения
journalctl -u hackaton-app -f

# Логи Nginx
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Использование ресурсов
htop
df -h
```

## Безопасность

1. **Firewall:**
```bash
ufw allow 22
ufw allow 80
ufw allow 443
ufw enable
```

2. **Автоматическое обновление SSL:**
```bash
crontab -e
# Добавить строку:
0 12 * * * /usr/bin/certbot renew --quiet
```

3. **Резервное копирование:**
```bash
# Создаем бэкап
tar -czf /backup/hackaton-$(date +%Y%m%d).tar.gz /var/www/hackaton2025.robot.ru.net/
```
