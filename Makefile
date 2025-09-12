# Makefile для управления Docker контейнерами

.PHONY: help build up down logs shell clean

# Переменные
IMAGE_NAME = hackaton-app
CONTAINER_NAME = hackaton-app
COMPOSE_FILE = docker-compose.yml

# Помощь
help: ## Показать справку
	@echo "Доступные команды:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Сборка образа
build: ## Собрать Docker образ
	@echo "Сборка Docker образа..."
	docker build -t $(IMAGE_NAME) .

# Запуск контейнеров
up: ## Запустить контейнеры
	@echo "Запуск контейнеров..."
	docker-compose -f $(COMPOSE_FILE) up -d

# Остановка контейнеров
down: ## Остановить контейнеры
	@echo "Остановка контейнеров..."
	docker-compose -f $(COMPOSE_FILE) down

# Просмотр логов
logs: ## Показать логи
	@echo "Просмотр логов..."
	docker-compose -f $(COMPOSE_FILE) logs -f

# Подключение к контейнеру
shell: ## Подключиться к контейнеру
	@echo "Подключение к контейнеру..."
	docker exec -it $(CONTAINER_NAME) /bin/sh

# Очистка
clean: ## Очистить неиспользуемые образы и контейнеры
	@echo "Очистка Docker..."
	docker system prune -f
	docker image prune -f

# Полная пересборка
rebuild: down clean build up ## Полная пересборка и запуск

# Проверка статуса
status: ## Проверить статус контейнеров
	@echo "Статус контейнеров:"
	docker-compose -f $(COMPOSE_FILE) ps

# Остановка и удаление всех контейнеров
stop-all: ## Остановить и удалить все контейнеры
	@echo "Остановка всех контейнеров..."
	docker stop $$(docker ps -aq) 2>/dev/null || true
	docker rm $$(docker ps -aq) 2>/dev/null || true
