# Настройка GitHub Pages

## Проблема
GitHub Pages не активирован для репозитория.

## Решение

### Шаг 1: Активация GitHub Pages
1. Перейдите в настройки репозитория: https://github.com/Punkcot/hackaton/settings/pages
2. В разделе "Source" выберите "Deploy from a branch"
3. Выберите ветку "main" и папку "/ (root)"
4. Нажмите "Save"

### Шаг 2: Ожидание развертывания
- GitHub Pages может занять 5-10 минут для первого развертывания
- Проверьте статус в разделе "Actions" репозитория

### Шаг 3: Проверка работы
После активации страницы будут доступны по адресам:
- https://punkcot.github.io/hackaton/ (главная)
- https://punkcot.github.io/hackaton/test.html (тест)
- https://punkcot.github.io/hackaton/simple.html (простая версия)

## Альтернативное решение

Если GitHub Pages не работает, можно использовать:

### Netlify
1. Перейдите на https://netlify.com
2. Подключите GitHub репозиторий
3. Настройте автоматическое развертывание

### Vercel
1. Перейдите на https://vercel.com
2. Импортируйте GitHub репозиторий
3. Настройте развертывание

### GitHub Codespaces
1. Откройте репозиторий в Codespaces
2. Запустите локальный сервер
3. Используйте порт-форвардинг

## Структура файлов
```
hackaton/
├── index.html          # Главная страница
├── test.html           # Тестовая страница
├── simple.html         # Простая 3D версия
├── .nojekyll          # Отключение Jekyll
├── 404.html           # Страница ошибки
└── GITHUB_PAGES_SETUP.md
```

## Проверка статуса
```bash
# Проверка доступности
curl -I https://punkcot.github.io/hackaton/

# Ожидаемый ответ: HTTP/2 200
```
