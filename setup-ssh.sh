#!/bin/bash

# Скрипт для настройки SSH доступа к серверу
# Использование: ./setup-ssh.sh

SERVER="185.23.34.130"

echo "🔑 Настройка SSH доступа к серверу $SERVER"

# Показываем публичный ключ
echo "📋 Ваш публичный SSH ключ:"
echo "----------------------------------------"
cat ~/.ssh/id_ed25519.pub
echo "----------------------------------------"
echo ""

echo "📝 Инструкции:"
echo "1. Скопируйте ключ выше"
echo "2. Подключитесь к серверу по паролю:"
echo "   ssh root@$SERVER"
echo "3. Выполните на сервере:"
echo "   mkdir -p ~/.ssh"
echo "   chmod 700 ~/.ssh"
echo "   echo '$(cat ~/.ssh/id_ed25519.pub)' >> ~/.ssh/authorized_keys"
echo "   chmod 600 ~/.ssh/authorized_keys"
echo "   apt update && apt install -y nodejs npm nginx git certbot python3-certbot-nginx"
echo ""
echo "4. После настройки запустите: ./quick-deploy.sh"

# Пытаемся автоматически скопировать ключ
echo ""
echo "🔄 Пытаемся автоматически скопировать ключ..."
if ssh-copy-id -o ConnectTimeout=5 root@$SERVER 2>/dev/null; then
    echo "✅ SSH ключ успешно скопирован!"
    echo "🚀 Теперь можно запустить: ./quick-deploy.sh"
else
    echo "❌ Автоматическое копирование не удалось"
    echo "📋 Выполните ручную настройку по инструкциям выше"
fi
