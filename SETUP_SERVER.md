# Настройка сервера для деплоя

## Шаг 1: Настройка SSH доступа

### На локальной машине:
```bash
# Показываем публичный ключ
cat ~/.ssh/id_ed25519.pub
```

### На сервере 185.23.34.130:
```bash
# Подключаемся по паролю (если есть)
ssh root@185.23.34.130

# Создаем директорию .ssh
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Добавляем публичный ключ (замените на ваш ключ)
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIDX7WKBgHgZEHm6knD14db/6yGkxKM6uvClbdrl5TYKm punkcot@github" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

# Устанавливаем необходимые пакеты
apt update
apt install -y nodejs npm nginx git certbot python3-certbot-nginx
```

## Шаг 2: Настройка DNS

В панели управления доменом robot.ru.net:
1. Создайте A-запись: `hackaton2025.robot.ru.net` → `185.23.34.130`
2. Дождитесь распространения DNS (5-15 минут)

## Шаг 3: Деплой приложения

### Вариант A: Автоматический деплой
```bash
# После настройки SSH
./quick-deploy.sh
```

### Вариант B: Ручной деплой
```bash
# Подключаемся к серверу
ssh root@185.23.34.130

# Создаем директорию приложения
mkdir -p /var/www/hackaton2025.robot.ru.net
cd /var/www/hackaton2025.robot.ru.net

# Клонируем репозиторий
git clone https://github.com/Punkcot/hackaton.git .

# Устанавливаем зависимости
npm install --production

# Создаем systemd сервис
cat > /etc/systemd/system/hackaton-app.service << 'EOF'
[Unit]
Description=Hackaton Flight Visualization App
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/var/www/hackaton2025.robot.ru.net
ExecStart=/usr/bin/node src/server.js
Restart=always
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
EOF

# Запускаем сервис
systemctl daemon-reload
systemctl enable hackaton-app
systemctl start hackaton-app

# Настраиваем Nginx
cat > /etc/nginx/sites-available/hackaton2025.robot.ru.net << 'EOF'
server {
    listen 80;
    server_name hackaton2025.robot.ru.net;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Активируем сайт
ln -sf /etc/nginx/sites-available/hackaton2025.robot.ru.net /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx

# Настраиваем SSL
certbot --nginx -d hackaton2025.robot.ru.net --non-interactive --agree-tos --email admin@robot.ru.net
```

## Шаг 4: Проверка

```bash
# Проверяем статус приложения
systemctl status hackaton-app

# Проверяем логи
journalctl -u hackaton-app -f

# Проверяем доступность
curl -I http://hackaton2025.robot.ru.net/
curl -I https://hackaton2025.robot.ru.net/
```

## Возможные проблемы

### 1. SSH недоступен
- Проверьте, что SSH ключ добавлен в ~/.ssh/authorized_keys на сервере
- Убедитесь, что SSH сервис запущен: `systemctl status ssh`

### 2. Домен не резолвится
- Проверьте DNS настройки в панели управления доменом
- Подождите 15-30 минут для распространения DNS

### 3. Приложение не запускается
- Проверьте логи: `journalctl -u hackaton-app -f`
- Убедитесь, что порт 3000 свободен: `netstat -tlnp | grep 3000`

### 4. Nginx ошибки
- Проверьте конфигурацию: `nginx -t`
- Проверьте логи: `tail -f /var/log/nginx/error.log`

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
