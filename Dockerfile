# Многоэтапная сборка для универсального проекта
FROM node:18-alpine AS base

# Установка системных зависимостей
RUN apk add --no-cache \
    python3 \
    py3-pip \
    git \
    curl \
    && rm -rf /var/cache/apk/*

# Создание рабочей директории
WORKDIR /app

# Копирование файлов зависимостей
COPY package*.json ./
COPY requirements*.txt ./
COPY Pipfile* ./
COPY Cargo.toml ./
COPY pom.xml ./
COPY go.mod ./

# Установка зависимостей (если есть)
RUN if [ -f package.json ]; then npm ci --only=production; fi
RUN if [ -f requirements.txt ]; then pip3 install --no-cache-dir -r requirements.txt; fi
RUN if [ -f Pipfile ]; then pip3 install --no-cache-dir pipenv && pipenv install --system --deploy; fi
RUN if [ -f Cargo.toml ]; then curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y && source ~/.cargo/env && cargo build --release; fi
RUN if [ -f pom.xml ]; then curl -fsSL https://get.sdkman.io | bash && source ~/.sdkman/bin/sdkman-init.sh && sdk install java && sdk install maven && mvn clean package -DskipTests; fi
RUN if [ -f go.mod ]; then go mod download && go build -o main .; fi

# Этап сборки
FROM base AS builder

# Копирование исходного кода
COPY src/ ./src/
COPY tests/ ./tests/
COPY . .

# Сборка проекта
RUN if [ -f package.json ]; then npm run build; fi
RUN if [ -f requirements.txt ]; then python3 -m compileall .; fi
RUN if [ -f Cargo.toml ]; then source ~/.cargo/env && cargo build --release; fi
RUN if [ -f pom.xml ]; then source ~/.sdkman/bin/sdkman-init.sh && mvn clean package -DskipTests; fi
RUN if [ -f go.mod ]; then go build -o main .; fi

# Финальный этап
FROM node:18-alpine AS production

# Установка только необходимых зависимостей
RUN apk add --no-cache \
    python3 \
    py3-pip \
    && rm -rf /var/cache/apk/*

# Создание пользователя для безопасности
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Создание рабочей директории
WORKDIR /app

# Копирование собранного приложения
COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nextjs:nodejs /app/build ./build
COPY --from=builder --chown=nextjs:nodejs /app/target/release ./target/release
COPY --from=builder --chown=nextjs:nodejs /app/target/*.jar ./target/
COPY --from=builder --chown=nextjs:nodejs /app/main ./main
COPY --from=builder --chown=nextjs:nodejs /app/src ./src
COPY --from=builder --chown=nextjs:nodejs /app/package*.json ./
COPY --from=builder --chown=nextjs:nodejs /app/requirements*.txt ./

# Установка production зависимостей
RUN if [ -f package.json ]; then npm ci --only=production && npm cache clean --force; fi
RUN if [ -f requirements.txt ]; then pip3 install --no-cache-dir -r requirements.txt; fi

# Переключение на пользователя
USER nextjs

# Открытие порта
EXPOSE 3000
EXPOSE 8080
EXPOSE 5000

# Переменные окружения
ENV NODE_ENV=production
ENV PORT=3000
ENV PYTHONUNBUFFERED=1

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:${PORT:-3000}/health || exit 1

# Команда запуска
CMD if [ -f package.json ]; then \
        if [ -f dist/index.js ]; then node dist/index.js; \
        elif [ -f build/index.js ]; then node build/index.js; \
        else npm start; fi; \
    elif [ -f requirements.txt ]; then \
        python3 -m src.main; \
    elif [ -f target/*.jar ]; then \
        java -jar target/*.jar; \
    elif [ -f main ]; then \
        ./main; \
    else \
        echo "No application found to run"; \
        exit 1; \
    fi
