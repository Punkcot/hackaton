/**
 * @file: app.js
 * @description: Основное приложение для 3D визуализации полетов
 * @dependencies: globe.js
 * @created: 2024-12-19
 */

class FlightVisualizationApp {
    constructor() {
        this.globe = null;
        this.cities = [];
        this.routes = [];
        this.isLoading = true;
        
        this.init();
    }

    async init() {
        console.log('Инициализация приложения');
        this.setupEventListeners();
        await this.loadData();
        this.setupGlobe();
        this.hideLoading();
    }

    setupEventListeners() {
        // Кнопки управления
        document.getElementById('toggleRoutes').addEventListener('click', () => {
            this.toggleRoutes();
        });
        
        document.getElementById('toggleCities').addEventListener('click', () => {
            this.toggleCities();
        });
        
        document.getElementById('resetView').addEventListener('click', () => {
            this.resetView();
        });

        // Мобильные кнопки
        document.getElementById('mobileToggle').addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        document.getElementById('mobileToggleRoutes').addEventListener('click', () => {
            this.toggleRoutes();
            this.toggleMobileMenu();
        });

        document.getElementById('mobileToggleCities').addEventListener('click', () => {
            this.toggleCities();
            this.toggleMobileMenu();
        });

        document.getElementById('mobileResetView').addEventListener('click', () => {
            this.resetView();
            this.toggleMobileMenu();
        });
    }

    async loadData() {
        try {
            console.log('Загрузка данных расписания');
            const response = await fetch('/api/cities');
            const data = await response.json();
            
            this.cities = this.processCities(data.cities);
            this.routes = data.routes;
            
            console.log('Загружено:', this.cities.length, 'городов,', this.routes.length, 'маршрутов');
            this.updateStats();
            
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
            this.showError('Ошибка загрузки данных');
        }
    }

    processCities(cityCodes) {
        // Маппинг кодов городов на координаты
        const cityMap = {
            'СУР': { lat: 61.25, lon: 73.42, name: 'Сургут' },
            'ТЮМ': { lat: 57.15, lon: 65.53, name: 'Тюмень' },
            'УФА': { lat: 54.74, lon: 55.97, name: 'Уфа' },
            'ЕКБ': { lat: 56.84, lon: 60.65, name: 'Екатеринбург' },
            'МОС': { lat: 55.75, lon: 37.62, name: 'Москва' },
            'СПБ': { lat: 59.93, lon: 30.34, name: 'Санкт-Петербург' },
            'DWC': { lat: 24.89, lon: 55.16, name: 'Дубай' },
            'IST': { lat: 41.26, lon: 28.74, name: 'Стамбул' }
        };

        return cityCodes.map(code => ({
            code,
            ...cityMap[code] || { lat: 0, lon: 0, name: code }
        })).filter(city => city.lat !== 0);
    }

    setupGlobe() {
        this.globe = new Globe3D('globeCanvas');
        this.globe.updateData(this.cities, this.routes);
    }

    toggleRoutes() {
        const button = document.getElementById('toggleRoutes');
        const isVisible = this.globe.routeLines.visible;
        this.globe.toggleRoutes(!isVisible);
        button.textContent = isVisible ? 'Показать маршруты' : 'Скрыть маршруты';
    }

    toggleCities() {
        const button = document.getElementById('toggleCities');
        const isVisible = this.globe.cityPoints.visible;
        this.globe.toggleCities(!isVisible);
        button.textContent = isVisible ? 'Показать города' : 'Скрыть города';
    }

    resetView() {
        this.globe.resetView();
    }

    toggleMobileMenu() {
        const menu = document.querySelector('.mobile-controls');
        menu.classList.toggle('active');
    }

    updateStats() {
        document.getElementById('totalFlights').textContent = this.routes.length;
        document.getElementById('totalCities').textContent = this.cities.length;
        document.getElementById('totalRoutes').textContent = this.routes.length;
    }

    hideLoading() {
        const loading = document.getElementById('loading');
        loading.style.display = 'none';
        this.isLoading = false;
    }

    showError(message) {
        const infoPanel = document.getElementById('infoPanel');
        infoPanel.innerHTML = `
            <div class="info-content">
                <h3>Ошибка</h3>
                <p style="color: var(--danger-color);">${message}</p>
            </div>
        `;
    }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    new FlightVisualizationApp();
});
