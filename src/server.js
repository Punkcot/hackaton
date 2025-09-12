/**
 * @file: server.js
 * @description: Express сервер для 3D визуализации полетов
 * @dependencies: express, cors, helmet
 * @created: 2024-12-19
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"]
    }
  }
}));

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Загрузка данных расписания
let scheduleData = null;
try {
  const schedulePath = path.join(__dirname, '..', 'schedule.json');
  const scheduleRaw = fs.readFileSync(schedulePath, 'utf8');
  scheduleData = JSON.parse(scheduleRaw);
  console.log('✅ Данные расписания загружены успешно');
} catch (error) {
  console.error('❌ Ошибка загрузки расписания:', error.message);
}

// API для получения данных расписания
app.get('/api/schedule', (req, res) => {
  if (!scheduleData) {
    return res.status(500).json({ error: 'Данные расписания недоступны' });
  }
  res.json(scheduleData);
});

// API для получения уникальных городов
app.get('/api/cities', (req, res) => {
  if (!scheduleData) {
    return res.status(500).json({ error: 'Данные расписания недоступны' });
  }

  const cities = new Set();
  const routes = [];

  scheduleData.response.flight.forEach(flight => {
    if (flight.period && Array.isArray(flight.period)) {
      flight.period.forEach(period => {
        if (period.segment && Array.isArray(period.segment)) {
          period.segment.forEach(segment => {
            if (segment.city) {
              cities.add(segment.city);
            }
          });
          
          // Создаем маршруты
          for (let i = 0; i < period.segment.length - 1; i++) {
            const from = period.segment[i].city;
            const to = period.segment[i + 1].city;
            if (from && to) {
              routes.push({
                from,
                to,
                flightNumber: flight['@num'],
                frequency: period['@freq'],
                days: period['@freq'].split('').map(day => parseInt(day))
              });
            }
          }
        }
      });
    } else if (flight.period && flight.period.segment) {
      // Обработка случая с одним периодом
      flight.period.segment.forEach(segment => {
        if (segment.city) {
          cities.add(segment.city);
        }
      });
      
      // Создаем маршруты
      for (let i = 0; i < flight.period.segment.length - 1; i++) {
        const from = flight.period.segment[i].city;
        const to = flight.period.segment[i + 1].city;
        if (from && to) {
          routes.push({
            from,
            to,
            flightNumber: flight['@num'],
            frequency: flight.period['@freq'],
            days: flight.period['@freq'].split('').map(day => parseInt(day))
          });
        }
      }
    }
  });

  res.json({
    cities: Array.from(cities),
    routes: routes
  });
});

// Главная страница
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
  console.log(`🌐 Откройте http://localhost:${PORT} в браузере`);
});
