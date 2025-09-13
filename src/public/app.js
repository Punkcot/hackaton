/**
 * @file: app.js
 * @description: Основное приложение для 3D визуализации полетов Ютэйр
 * @dependencies: globe.js, three.js
 * @created: 2024-12-19
 */

class FlightVisualizationApp {
    constructor() {
        this.globe = null;
        this.citiesData = [];
        this.routesData = [];
        this.selectedDays = [1, 2, 3, 4, 5, 6, 7]; // Все дни по умолчанию
        this.selectedCity = null;
        
        // Коды городов Ютэйр с координатами
        this.cityCodes = {
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
            'КРА': { name: 'Краснодар', lat: 45.04, lng: 38.98, country: 'Россия' },
            'СОЧ': { name: 'Сочи', lat: 43.59, lng: 39.72, country: 'Россия' },
            'МАХ': { name: 'Махачкала', lat: 42.98, lng: 47.5, country: 'Россия' },
            'ГРО': { name: 'Грозный', lat: 43.31, lng: 45.69, country: 'Россия' },
            'НАЛ': { name: 'Нальчик', lat: 43.48, lng: 43.61, country: 'Россия' },
            'ЭЛИ': { name: 'Элиста', lat: 46.31, lng: 44.26, country: 'Россия' },
            'АСТ': { name: 'Астрахань', lat: 46.35, lng: 48.04, country: 'Россия' },
            'САР': { name: 'Саратов', lat: 51.54, lng: 46.0, country: 'Россия' },
            'ПЕН': { name: 'Пенза', lat: 53.2, lng: 45.0, country: 'Россия' },
            'ТАМ': { name: 'Тамбов', lat: 52.73, lng: 41.44, country: 'Россия' },
            'ВОРО': { name: 'Воронеж', lat: 51.67, lng: 39.18, country: 'Россия' },
            'ЛИП': { name: 'Липецк', lat: 52.61, lng: 39.59, country: 'Россия' },
            'ТУЛ': { name: 'Тула', lat: 54.2, lng: 37.62, country: 'Россия' },
            'КАЛ': { name: 'Калуга', lat: 54.53, lng: 36.28, country: 'Россия' },
            'СМО': { name: 'Смоленск', lat: 54.78, lng: 32.04, country: 'Россия' },
            'БРЯ': { name: 'Брянск', lat: 53.25, lng: 34.37, country: 'Россия' },
            'КУР': { name: 'Курск', lat: 51.74, lng: 36.19, country: 'Россия' },
            'БЕЛ': { name: 'Белгород', lat: 50.6, lng: 36.58, country: 'Россия' },
            'ОРЛ': { name: 'Орел', lat: 52.97, lng: 36.07, country: 'Россия' },
            'ТВЕР': { name: 'Тверь', lat: 56.86, lng: 35.9, country: 'Россия' },
            'ЯРО': { name: 'Ярославль', lat: 57.63, lng: 39.87, country: 'Россия' },
            'ИВА': { name: 'Иваново', lat: 57.0, lng: 40.97, country: 'Россия' },
            'КОС': { name: 'Кострома', lat: 57.77, lng: 40.93, country: 'Россия' },
            'ВЛАД': { name: 'Владимир', lat: 56.13, lng: 40.41, country: 'Россия' },
            'РЯЗ': { name: 'Рязань', lat: 54.63, lng: 39.74, country: 'Россия' },
            'ТАМБ': { name: 'Тамбов', lat: 52.73, lng: 41.44, country: 'Россия' },
            'МУР': { name: 'Муром', lat: 55.57, lng: 42.05, country: 'Россия' },
            'НИЖ': { name: 'Нижний Новгород', lat: 56.33, lng: 44.0, country: 'Россия' },
            'ЧЕБ': { name: 'Чебоксары', lat: 56.13, lng: 47.25, country: 'Россия' },
            'ЙОШ': { name: 'Йошкар-Ола', lat: 56.63, lng: 47.9, country: 'Россия' },
            'КИР': { name: 'Киров', lat: 58.6, lng: 49.66, country: 'Россия' },
            'СЫК': { name: 'Сыктывкар', lat: 61.67, lng: 50.81, country: 'Россия' },
            'АРХ': { name: 'Архангельск', lat: 64.54, lng: 40.54, country: 'Россия' },
            'ВОЛО': { name: 'Вологда', lat: 59.22, lng: 39.88, country: 'Россия' },
            'ЧЕРЕ': { name: 'Череповец', lat: 59.13, lng: 37.9, country: 'Россия' },
            'ПЕТ': { name: 'Петрозаводск', lat: 61.79, lng: 34.35, country: 'Россия' },
            'МУРМ': { name: 'Мурманск', lat: 68.97, lng: 33.08, country: 'Россия' },
            'КАЛИ': { name: 'Калининград', lat: 54.71, lng: 20.51, country: 'Россия' },
            'ПСК': { name: 'Псков', lat: 57.81, lng: 28.33, country: 'Россия' },
            'ВЕЛ': { name: 'Великий Новгород', lat: 58.52, lng: 31.27, country: 'Россия' },
            'ТВЕ': { name: 'Тверь', lat: 56.86, lng: 35.9, country: 'Россия' },
            'РЯЗА': { name: 'Рязань', lat: 54.63, lng: 39.74, country: 'Россия' },
            'ТАМБО': { name: 'Тамбов', lat: 52.73, lng: 41.44, country: 'Россия' },
            'ВОРОН': { name: 'Воронеж', lat: 51.67, lng: 39.18, country: 'Россия' },
            'ЛИПЕ': { name: 'Липецк', lat: 52.61, lng: 39.59, country: 'Россия' },
            'ТУЛА': { name: 'Тула', lat: 54.2, lng: 37.62, country: 'Россия' },
            'КАЛУ': { name: 'Калуга', lat: 54.53, lng: 36.28, country: 'Россия' },
            'СМОЛ': { name: 'Смоленск', lat: 54.78, lng: 32.04, country: 'Россия' },
            'БРЯН': { name: 'Брянск', lat: 53.25, lng: 34.37, country: 'Россия' },
            'КУРС': { name: 'Курск', lat: 51.74, lng: 36.19, country: 'Россия' },
            'БЕЛГ': { name: 'Белгород', lat: 50.6, lng: 36.58, country: 'Россия' },
            'ОРЕЛ': { name: 'Орел', lat: 52.97, lng: 36.07, country: 'Россия' },
            'ТВЕРЬ': { name: 'Тверь', lat: 56.86, lng: 35.9, country: 'Россия' },
            'ЯРОС': { name: 'Ярославль', lat: 57.63, lng: 39.87, country: 'Россия' },
            'ИВАНО': { name: 'Иваново', lat: 57.0, lng: 40.97, country: 'Россия' },
            'КОСТ': { name: 'Кострома', lat: 57.77, lng: 40.93, country: 'Россия' },
            'ВЛАДИ': { name: 'Владимир', lat: 56.13, lng: 40.41, country: 'Россия' },
            'РЯЗАН': { name: 'Рязань', lat: 54.63, lng: 39.74, country: 'Россия' },
            'ТАМБОВ': { name: 'Тамбов', lat: 52.73, lng: 41.44, country: 'Россия' },
            'МУРОМ': { name: 'Муром', lat: 55.57, lng: 42.05, country: 'Россия' },
            'НИЖНИ': { name: 'Нижний Новгород', lat: 56.33, lng: 44.0, country: 'Россия' },
            'ЧЕБОК': { name: 'Чебоксары', lat: 56.13, lng: 47.25, country: 'Россия' },
            'ЙОШКА': { name: 'Йошкар-Ола', lat: 56.63, lng: 47.9, country: 'Россия' },
            'КИРОВ': { name: 'Киров', lat: 58.6, lng: 49.66, country: 'Россия' },
            'СЫКТЫ': { name: 'Сыктывкар', lat: 61.67, lng: 50.81, country: 'Россия' },
            'АРХАН': { name: 'Архангельск', lat: 64.54, lng: 40.54, country: 'Россия' },
            'ВОЛОГ': { name: 'Вологда', lat: 59.22, lng: 39.88, country: 'Россия' },
            'ЧЕРЕП': { name: 'Череповец', lat: 59.13, lng: 37.9, country: 'Россия' },
            'ПЕТРО': { name: 'Петрозаводск', lat: 61.79, lng: 34.35, country: 'Россия' },
            'МУРМА': { name: 'Мурманск', lat: 68.97, lng: 33.08, country: 'Россия' },
            'КАЛИН': { name: 'Калининград', lat: 54.71, lng: 20.51, country: 'Россия' },
            'ПСКОВ': { name: 'Псков', lat: 57.81, lng: 28.33, country: 'Россия' },
            'ВЕЛИК': { name: 'Великий Новгород', lat: 58.52, lng: 31.27, country: 'Россия' }
        };
        
        this.init();
    }
    
    async init() {
        console.log('🚀 Инициализация приложения...');
        
        // Создаем 3D глобус
        this.globe = new Globe3D('globe-container');
        
        // Загружаем данные
        await this.loadData();
        
        // Настраиваем интерфейс
        this.setupUI();
        
        // Скрываем загрузку
        this.hideLoading();
        
        console.log('✅ Приложение инициализировано');
    }
    
    async loadData() {
        try {
            console.log('📡 Загрузка данных расписания...');
            
            const response = await fetch('/api/cities');
            const data = await response.json();
            
            this.citiesData = data.cities;
            this.routesData = data.routes;
            
            console.log(`✅ Загружено ${this.citiesData.length} городов и ${this.routesData.length} маршрутов`);
            
            // Добавляем города на карту
            this.addCitiesToGlobe();
            
            // Добавляем маршруты
            this.addRoutesToGlobe();
            
            // Обновляем статистику
            this.updateStats();
            
        } catch (error) {
            console.error('❌ Ошибка загрузки данных:', error);
            this.showError('Ошибка загрузки данных расписания');
        }
    }
    
    addCitiesToGlobe() {
        console.log('🏙️ Добавление городов на карту...');
        
        this.citiesData.forEach(cityCode => {
            const cityInfo = this.cityCodes[cityCode];
            if (cityInfo) {
                this.globe.addCity({
                    name: cityInfo.name,
                    lat: cityInfo.lat,
                    lng: cityInfo.lng,
                    isUtair: true
                });
            }
        });
        
        // Добавляем столицы стран, куда летает Ютэйр
        this.addCapitalCities();
    }
    
    addCapitalCities() {
        const capitals = [
            { name: 'Москва', lat: 55.75, lng: 37.62, country: 'Россия' },
            { name: 'Астана', lat: 51.18, lng: 71.45, country: 'Казахстан' },
            { name: 'Бишкек', lat: 42.87, lng: 74.59, country: 'Кыргызстан' },
            { name: 'Ташкент', lat: 41.31, lng: 69.24, country: 'Узбекистан' },
            { name: 'Душанбе', lat: 38.54, lng: 68.78, country: 'Таджикистан' },
            { name: 'Ашхабад', lat: 37.95, lng: 58.38, country: 'Туркменистан' },
            { name: 'Баку', lat: 40.41, lng: 49.87, country: 'Азербайджан' },
            { name: 'Ереван', lat: 40.18, lng: 44.51, country: 'Армения' },
            { name: 'Тбилиси', lat: 41.72, lng: 44.78, country: 'Грузия' },
            { name: 'Минск', lat: 53.9, lng: 27.57, country: 'Беларусь' },
            { name: 'Киев', lat: 50.45, lng: 30.52, country: 'Украина' },
            { name: 'Кишинев', lat: 47.01, lng: 28.86, country: 'Молдова' }
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
            const fromCity = this.cityCodes[route.from];
            const toCity = this.cityCodes[route.to];
            
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
        // Добавляем обработчики для городов
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
    
    showError(message) {
        const loading = document.getElementById('loading');
        loading.innerHTML = `
            <div class="error">
                <h3>❌ Ошибка</h3>
                <p>${message}</p>
            </div>
        `;
    }
}

// Запуск приложения при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌍 Запуск приложения визуализации полетов...');
    new FlightVisualizationApp();
});




