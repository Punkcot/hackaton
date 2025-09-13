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
    'ХАБ': { name: 'Хабаровск', lat: 48.48, lng: 135.08, country: 'Россия' },
    'БЛА': { name: 'Благовещенск', lat: 50.26, lng: 127.54, country: 'Россия' },
    'ЯКУ': { name: 'Якутск', lat: 62.03, lng: 129.73, country: 'Россия' },
    'МАГ': { name: 'Магадан', lat: 59.57, lng: 150.8, country: 'Россия' },
    'ПЕТР': { name: 'Петропавловск-Камчатский', lat: 53.02, lng: 158.65, country: 'Россия' },
    'ЮЖНО': { name: 'Южно-Сахалинск', lat: 46.96, lng: 142.73, country: 'Россия' },
    'АБА': { name: 'Абакан', lat: 53.72, lng: 91.44, country: 'Россия' },
    'КЕМ': { name: 'Кемерово', lat: 55.35, lng: 86.08, country: 'Россия' },
    'ТОМ': { name: 'Томск', lat: 56.5, lng: 84.97, country: 'Россия' },
    'БАР': { name: 'Барнаул', lat: 53.36, lng: 83.76, country: 'Россия' },
    'ОМС': { name: 'Омск', lat: 54.99, lng: 73.37, country: 'Россия' },
    'ЧЕЛ': { name: 'Челябинск', lat: 55.16, lng: 61.4, country: 'Россия' },
    'МАГН': { name: 'Магнитогорск', lat: 53.42, lng: 59.05, country: 'Россия' },
    'ОРЕН': { name: 'Оренбург', lat: 51.77, lng: 55.1, country: 'Россия' },
    'ПЕРМ': { name: 'Пермь', lat: 58.01, lng: 56.25, country: 'Россия' },
    'ИЖЕВ': { name: 'Ижевск', lat: 56.85, lng: 53.21, country: 'Россия' },
    'УДМ': { name: 'Удмуртск', lat: 56.85, lng: 53.21, country: 'Россия' },
    'ЧЕЛЯ': { name: 'Челябинск', lat: 55.16, lng: 61.4, country: 'Россия' },
    'КУРГ': { name: 'Курган', lat: 55.44, lng: 65.34, country: 'Россия' },
    'ТЮМЕ': { name: 'Тюмень', lat: 57.15, lng: 65.53, country: 'Россия' },
    'СУРГ': { name: 'Сургут', lat: 61.25, lng: 73.4, country: 'Россия' },
    'ХАНТ': { name: 'Ханты-Мансийск', lat: 61.0, lng: 69.0, country: 'Россия' },
    'САЛЕ': { name: 'Салехард', lat: 66.53, lng: 66.6, country: 'Россия' },
    'НОРИ': { name: 'Норильск', lat: 69.35, lng: 88.2, country: 'Россия' },
    'ДУД': { name: 'Дудинка', lat: 69.41, lng: 86.18, country: 'Россия' },
    'АНАД': { name: 'Анадырь', lat: 64.73, lng: 177.51, country: 'Россия' }
};

// Примерные маршруты (в реальном приложении загружаются из API)
const sampleRoutes = [
    // Основные маршруты Сургут
    { from: 'СУР', to: 'ТЮМ', flightNumber: '101', days: [1,2,3,4,5,6,7] },
    { from: 'ТЮМ', to: 'СУР', flightNumber: '102', days: [1,2,3,4,5,6,7] },
    { from: 'СУР', to: 'УФА', flightNumber: '103', days: [1,2,3,4,5,6,7] },
    { from: 'УФА', to: 'СУР', flightNumber: '104', days: [1,2,3,4,5,6,7] },
    { from: 'СУР', to: 'ЕКБ', flightNumber: '105', days: [1,2,3,4,5,6,7] },
    { from: 'ЕКБ', to: 'СУР', flightNumber: '106', days: [1,2,3,4,5,6,7] },
    
    // Маршруты Уфа-Екатеринбург
    { from: 'УФА', to: 'ЕКБ', flightNumber: '107', days: [1,2,3,4,5,6,7] },
    { from: 'ЕКБ', to: 'УФА', flightNumber: '108', days: [1,2,3,4,5,6,7] },
    
    // Московские маршруты
    { from: 'МОС', to: 'СПБ', flightNumber: '201', days: [1,2,3,4,5,6,7] },
    { from: 'СПБ', to: 'МОС', flightNumber: '202', days: [1,2,3,4,5,6,7] },
    { from: 'МОС', to: 'ЕКБ', flightNumber: '203', days: [1,2,3,4,5,6,7] },
    { from: 'ЕКБ', to: 'МОС', flightNumber: '204', days: [1,2,3,4,5,6,7] },
    { from: 'МОС', to: 'УФА', flightNumber: '205', days: [1,2,3,4,5,6,7] },
    { from: 'УФА', to: 'МОС', flightNumber: '206', days: [1,2,3,4,5,6,7] },
    { from: 'МОС', to: 'СУР', flightNumber: '207', days: [1,2,3,4,5,6,7] },
    { from: 'СУР', to: 'МОС', flightNumber: '208', days: [1,2,3,4,5,6,7] },
    
    // Сибирские маршруты
    { from: 'НОВ', to: 'КРА', flightNumber: '301', days: [1,2,3,4,5,6,7] },
    { from: 'КРА', to: 'НОВ', flightNumber: '302', days: [1,2,3,4,5,6,7] },
    { from: 'НОВ', to: 'ИРК', flightNumber: '303', days: [1,2,3,4,5,6,7] },
    { from: 'ИРК', to: 'НОВ', flightNumber: '304', days: [1,2,3,4,5,6,7] },
    { from: 'ИРК', to: 'ВЛА', flightNumber: '305', days: [1,2,3,4,5,6,7] },
    { from: 'ВЛА', to: 'ИРК', flightNumber: '306', days: [1,2,3,4,5,6,7] },
    { from: 'КРА', to: 'ИРК', flightNumber: '307', days: [1,2,3,4,5,6,7] },
    { from: 'ИРК', to: 'КРА', flightNumber: '308', days: [1,2,3,4,5,6,7] },
    
    // Дальневосточные маршруты
    { from: 'ВЛА', to: 'ХАБ', flightNumber: '401', days: [1,2,3,4,5,6,7] },
    { from: 'ХАБ', to: 'ВЛА', flightNumber: '402', days: [1,2,3,4,5,6,7] },
    { from: 'ВЛА', to: 'ЯКУ', flightNumber: '403', days: [1,2,3,4,5,6,7] },
    { from: 'ЯКУ', to: 'ВЛА', flightNumber: '404', days: [1,2,3,4,5,6,7] },
    { from: 'ХАБ', to: 'МАГ', flightNumber: '405', days: [1,2,3,4,5,6,7] },
    { from: 'МАГ', to: 'ХАБ', flightNumber: '406', days: [1,2,3,4,5,6,7] },
    
    // Уральские маршруты
    { from: 'ЕКБ', to: 'ЧЕЛ', flightNumber: '501', days: [1,2,3,4,5,6,7] },
    { from: 'ЧЕЛ', to: 'ЕКБ', flightNumber: '502', days: [1,2,3,4,5,6,7] },
    { from: 'ЕКБ', to: 'ПЕРМ', flightNumber: '503', days: [1,2,3,4,5,6,7] },
    { from: 'ПЕРМ', to: 'ЕКБ', flightNumber: '504', days: [1,2,3,4,5,6,7] },
    { from: 'УФА', to: 'ЧЕЛ', flightNumber: '505', days: [1,2,3,4,5,6,7] },
    { from: 'ЧЕЛ', to: 'УФА', flightNumber: '506', days: [1,2,3,4,5,6,7] },
    
    // Поволжские маршруты
    { from: 'КАЗ', to: 'САМ', flightNumber: '601', days: [1,2,3,4,5,6,7] },
    { from: 'САМ', to: 'КАЗ', flightNumber: '602', days: [1,2,3,4,5,6,7] },
    { from: 'КАЗ', to: 'УФА', flightNumber: '603', days: [1,2,3,4,5,6,7] },
    { from: 'УФА', to: 'КАЗ', flightNumber: '604', days: [1,2,3,4,5,6,7] },
    { from: 'САМ', to: 'ВОЛ', flightNumber: '605', days: [1,2,3,4,5,6,7] },
    { from: 'ВОЛ', to: 'САМ', flightNumber: '606', days: [1,2,3,4,5,6,7] },
    
    // Южные маршруты
    { from: 'РОС', to: 'КРАС', flightNumber: '701', days: [1,2,3,4,5,6,7] },
    { from: 'КРАС', to: 'РОС', flightNumber: '702', days: [1,2,3,4,5,6,7] },
    { from: 'КРАС', to: 'СОЧ', flightNumber: '703', days: [1,2,3,4,5,6,7] },
    { from: 'СОЧ', to: 'КРАС', flightNumber: '704', days: [1,2,3,4,5,6,7] },
    { from: 'РОС', to: 'МАХ', flightNumber: '705', days: [1,2,3,4,5,6,7] },
    { from: 'МАХ', to: 'РОС', flightNumber: '706', days: [1,2,3,4,5,6,7] },
    
    // Центральные маршруты
    { from: 'МОС', to: 'ВОРО', flightNumber: '801', days: [1,2,3,4,5,6,7] },
    { from: 'ВОРО', to: 'МОС', flightNumber: '802', days: [1,2,3,4,5,6,7] },
    { from: 'МОС', to: 'ТУЛ', flightNumber: '803', days: [1,2,3,4,5,6,7] },
    { from: 'ТУЛ', to: 'МОС', flightNumber: '804', days: [1,2,3,4,5,6,7] },
    { from: 'МОС', to: 'РЯЗ', flightNumber: '805', days: [1,2,3,4,5,6,7] },
    { from: 'РЯЗ', to: 'МОС', flightNumber: '806', days: [1,2,3,4,5,6,7] },
    
    // Северные маршруты
    { from: 'СПБ', to: 'МУРМ', flightNumber: '901', days: [1,2,3,4,5,6,7] },
    { from: 'МУРМ', to: 'СПБ', flightNumber: '902', days: [1,2,3,4,5,6,7] },
    { from: 'СПБ', to: 'АРХ', flightNumber: '903', days: [1,2,3,4,5,6,7] },
    { from: 'АРХ', to: 'СПБ', flightNumber: '904', days: [1,2,3,4,5,6,7] },
    { from: 'СПБ', to: 'КАЛИ', flightNumber: '905', days: [1,2,3,4,5,6,7] },
    { from: 'КАЛИ', to: 'СПБ', flightNumber: '906', days: [1,2,3,4,5,6,7] }
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
    const checkThreeJS = () => {
        if (typeof THREE !== 'undefined') {
            console.log('✅ Three.js загружен');
            new StaticFlightVisualizationApp();
        } else {
            console.log('⏳ Ожидание загрузки Three.js...');
            setTimeout(checkThreeJS, 100);
        }
    };
    
    checkThreeJS();
});
