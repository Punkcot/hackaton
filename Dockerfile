# Dockerfile для 3D визуализации полетов Ютэйр
FROM node:18-alpine

# Установка системных зависимостей
RUN apk add --no-cache \
    curl \
    && rm -rf /var/cache/apk/*

# Создание рабочей директории
WORKDIR /app

# Копирование package.json и package-lock.json
COPY package*.json ./

# Установка зависимостей
RUN npm ci --only=production && npm cache clean --force

# Копирование исходного кода
COPY src/ ./src/
COPY schedule.json ./

# Создание пользователя для безопасности
RUN addgroup -g 1001 -S nodejs && \
    adduser -S appuser -u 1001

# Изменение владельца файлов
RUN chown -R appuser:nodejs /app

# Переключение на пользователя
USER appuser

# Открытие порта
EXPOSE 3000

# Переменные окружения
ENV NODE_ENV=production
ENV PORT=3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/api/cities || exit 1

# Команда запуска
CMD ["node", "src/server.js"]