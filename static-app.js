/**
 * @file: static-app.js
 * @description: Статическая версия приложения для GitHub Pages
 * @dependencies: three.js
 * @created: 2024-12-19
 */

// Данные городов Ютэйр
const cityCodes = {
    'СУР': { name: 'Сургут', lat: 61.25, lng: 73.4, country: 'Россия' },
    'ТЮМ': { name: 'Тюмень', lat: 57.15, lng: 65.53, country: 'Россия' },
    'УФА': { name: 'Уфа', lat: 54.73, lng: 55.95, country: 'Россия' },
    'ЕКБ': { name: 'Екатеринбург', lat: 56.84, lng: 60.61, country: 'Россия' },
    'МОС': { name: 'Москва', lat: 55.75, lng: 37.62, country: 'Россия' },
    'СПБ': { name: 'Санкт-Петербург', lat: 59.93, lng: 30.34, country: 'Россия' },
    'НОВ': { name: 'Новосибирск', lat: 55.01, lng: 82.93, country: 'Россия' },
    'КРА': { name: 'Красноярск', lat: 56.01, lng: 92.87, country: 'Россия' },
    'ИРК': { name: 'Иркутск', lat: 52.3, lng: 104.3, country: 'Россия' },
    'ВЛА': { name: 'Владивосток', lat: 43.11, lng: 131.87, country: 'Россия' },
    'КАЗ': { name: 'Казань', lat: 55.83, lng: 49.07, country: 'Россия' },
    'САМ': { name: 'Самара', lat: 53.2, lng: 50.15, country: 'Россия' },
    'ВОЛ': { name: 'Волгоград', lat: 48.7, lng: 44.52, country: 'Россия' },
    'РОС': { name: 'Ростов-на-Дону', lat: 47.23, lng: 39.7, country: 'Россия' },
    'КРАС': { name: 'Краснодар', lat: 45.04, lng: 38.98, country: 'Россия' },
    'СОЧ': { name: 'Сочи', lat: 43.59, lng: 39.72, country: 'Россия' }
};

// Примерные маршруты (в реальном приложении загружаются из API)
const sampleRoutes = [
    { from: 'СУР', to: 'ТЮМ', flightNumber: '101', days: [1,2,3,4,5,6,7] },
    { from: 'ТЮМ', to: 'СУР', flightNumber: '102', days: [1,2,3,4,5,6,7] },
    { from: 'СУР', to: 'УФА', flightNumber: '103', days: [1,2,3,4,5,6,7] },
    { from: 'УФА', to: 'СУР', flightNumber: '104', days: [1,2,3,4,5,6,7] },
    { from: 'УФА', to: 'ЕКБ', flightNumber: '105', days: [1,2,3,4,5,6,7] },
    { from: 'ЕКБ', to: 'УФА', flightNumber: '106', days: [1,2,3,4,5,6,7] },
    { from: 'ЕКБ', to: 'СУР', flightNumber: '107', days: [1,2,3,4,5,6,7] },
    { from: 'СУР', to: 'ЕКБ', flightNumber: '108', days: [1,2,3,4,5,6,7] },
    { from: 'МОС', to: 'СПБ', flightNumber: '201', days: [1,2,3,4,5,6,7] },
    { from: 'СПБ', to: 'МОС', flightNumber: '202', days: [1,2,3,4,5,6,7] },
    { from: 'МОС', to: 'ЕКБ', flightNumber: '203', days: [1,2,3,4,5,6,7] },
    { from: 'ЕКБ', to: 'МОС', flightNumber: '204', days: [1,2,3,4,5,6,7] },
    { from: 'НОВ', to: 'КРА', flightNumber: '301', days: [1,2,3,4,5,6,7] },
    { from: 'КРА', to: 'НОВ', flightNumber: '302', days: [1,2,3,4,5,6,7] },
    { from: 'ИРК', to: 'ВЛА', flightNumber: '401', days: [1,2,3,4,5,6,7] },
    { from: 'ВЛА', to: 'ИРК', flightNumber: '402', days: [1,2,3,4,5,6,7] }
];

class StaticFlightVisualizationApp {
    constructor() {
        this.globe = null;
        this.citiesData = Object.keys(cityCodes);
        this.routesData = sampleRoutes;
        this.selectedDays = [1, 2, 3, 4, 5, 6, 7];
        this.selectedCity = null;
        
        this.init();
    }
    
    async init() {
        console.log('🚀 Инициализация статического приложения...');
        
        // Создаем 3D глобус
        this.globe = new Globe3D('globe-container');
        
        // Добавляем города на карту
        this.addCitiesToGlobe();
        
        // Добавляем маршруты
        this.addRoutesToGlobe();
        
        // Настраиваем интерфейс
        this.setupUI();
        
        // Скрываем загрузку
        this.hideLoading();
        
        // Обновляем статистику
        this.updateStats();
        
        console.log('✅ Статическое приложение инициализировано');
    }
    
    addCitiesToGlobe() {
        console.log('🏙️ Добавление городов на карту...');
        
        this.citiesData.forEach(cityCode => {
            const cityInfo = cityCodes[cityCode];
            if (cityInfo) {
                this.globe.addCity({
                    name: cityInfo.name,
                    lat: cityInfo.lat,
                    lng: cityInfo.lng,
                    isUtair: true
                });
            }
        });
        
        // Добавляем столицы стран
        this.addCapitalCities();
    }
    
    addCapitalCities() {
        const capitals = [
            { name: 'Астана', lat: 51.18, lng: 71.45, country: 'Казахстан' },
            { name: 'Бишкек', lat: 42.87, lng: 74.59, country: 'Кыргызстан' },
            { name: 'Ташкент', lat: 41.31, lng: 69.24, country: 'Узбекистан' },
            { name: 'Душанбе', lat: 38.54, lng: 68.78, country: 'Таджикистан' },
            { name: 'Ашхабад', lat: 37.95, lng: 58.38, country: 'Туркменистан' },
            { name: 'Баку', lat: 40.41, lng: 49.87, country: 'Азербайджан' },
            { name: 'Ереван', lat: 40.18, lng: 44.51, country: 'Армения' },
            { name: 'Тбилиси', lat: 41.72, lng: 44.78, country: 'Грузия' },
            { name: 'Минск', lat: 53.9, lng: 27.57, country: 'Беларусь' },
            { name: 'Киев', lat: 50.45, lng: 30.52, country: 'Украина' }
        ];
        
        capitals.forEach(capital => {
            this.globe.addCity({
                name: capital.name,
                lat: capital.lat,
                lng: capital.lng,
                isUtair: false
            });
        });
    }
    
    addRoutesToGlobe() {
        console.log('✈️ Добавление маршрутов...');
        
        this.routesData.forEach(route => {
            const fromCity = cityCodes[route.from];
            const toCity = cityCodes[route.to];
            
            if (fromCity && toCity) {
                this.globe.addRoute({
                    from: fromCity.name,
                    to: toCity.name,
                    fromCoords: { lat: fromCity.lat, lng: fromCity.lng },
                    toCoords: { lat: toCity.lat, lng: toCity.lng },
                    ...route
                });
            }
        });
    }
    
    setupUI() {
        // Переключатель панели фильтров
        const toggleBtn = document.getElementById('toggle-filters');
        const filterPanel = document.getElementById('filter-panel');
        
        toggleBtn.addEventListener('click', () => {
            filterPanel.classList.toggle('collapsed');
            toggleBtn.textContent = filterPanel.classList.contains('collapsed') ? '+' : '−';
        });
        
        // Фильтры по дням недели
        const dayCheckboxes = document.querySelectorAll('.day-checkbox input');
        dayCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateDayFilters();
            });
        });
        
        // Обработка наведения на города
        this.setupCityHover();
    }
    
    updateDayFilters() {
        const selectedDays = [];
        const dayCheckboxes = document.querySelectorAll('.day-checkbox input:checked');
        
        dayCheckboxes.forEach(checkbox => {
            selectedDays.push(parseInt(checkbox.dataset.day));
        });
        
        this.selectedDays = selectedDays;
        this.globe.filterByDays(selectedDays);
        
        console.log('📅 Фильтр по дням обновлен:', selectedDays);
    }
    
    setupCityHover() {
        const canvas = document.getElementById('globe-canvas');
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        
        canvas.addEventListener('mousemove', (event) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            
            raycaster.setFromCamera(mouse, this.globe.camera);
            const intersects = raycaster.intersectObjects(this.globe.cities);
            
            if (intersects.length > 0) {
                const city = intersects[0].object;
                this.highlightCity(city.userData.name);
                this.showCityInfo(city.userData);
            } else {
                this.hideCityInfo();
            }
        });
    }
    
    highlightCity(cityName) {
        this.globe.highlightCity(cityName);
        this.selectedCity = cityName;
    }
    
    showCityInfo(cityData) {
        const infoPanel = document.getElementById('info-panel');
        const cityName = document.getElementById('city-name');
        const cityInfo = document.getElementById('city-info');
        
        cityName.textContent = cityData.name;
        
        // Находим маршруты для этого города
        const cityRoutes = this.routesData.filter(route => 
            route.from === cityData.name || route.to === cityData.name
        );
        
        let infoHTML = `<p><strong>Страна:</strong> ${cityData.country || 'Россия'}</p>`;
        infoHTML += `<p><strong>Координаты:</strong> ${cityData.lat.toFixed(2)}°, ${cityData.lng.toFixed(2)}°</p>`;
        
        if (cityRoutes.length > 0) {
            infoHTML += `<p><strong>Маршруты:</strong> ${cityRoutes.length}</p>`;
            infoHTML += '<ul>';
            cityRoutes.forEach(route => {
                const direction = route.from === cityData.name ? '→' : '←';
                const destination = route.from === cityData.name ? route.to : route.from;
                infoHTML += `<li>${direction} ${destination} (рейс ${route.flightNumber})</li>`;
            });
            infoHTML += '</ul>';
        }
        
        cityInfo.innerHTML = infoHTML;
        infoPanel.classList.add('visible');
    }
    
    hideCityInfo() {
        const infoPanel = document.getElementById('info-panel');
        infoPanel.classList.remove('visible');
        this.selectedCity = null;
    }
    
    updateStats() {
        document.getElementById('cities-count').textContent = this.citiesData.length;
        document.getElementById('routes-count').textContent = this.routesData.length;
    }
    
    hideLoading() {
        const loading = document.getElementById('loading');
        loading.style.display = 'none';
    }
}

// Запуск статического приложения при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌍 Запуск статического приложения визуализации полетов...');
    
    // Ждем загрузки Three.js
    if (typeof THREE === 'undefined') {
        console.log('⏳ Ожидание загрузки Three.js...');
        const checkThree = setInterval(() => {
            if (typeof THREE !== 'undefined') {
                clearInterval(checkThree);
                console.log('✅ Three.js загружен');
                new StaticFlightVisualizationApp();
            }
        }, 100);
    } else {
        new StaticFlightVisualizationApp();
    }
});
