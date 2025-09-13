/**
 * @file: globe.js
 * @description: 3D модель земного шара с визуализацией полетов
 * @dependencies: three.js
 * @created: 2024-12-19
 */

class Globe3D {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.globe = null;
        this.routes = [];
        this.cities = [];
        this.animationId = null;
        
        this.init();
    }

    init() {
        console.log('Инициализация 3D сцены');
        this.setupScene();
        this.setupCamera();
        this.setupRenderer();
        this.setupControls();
        this.createGlobe();
        this.setupLighting();
        this.animate();
        this.setupResize();
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0a0a);
    }

    setupCamera() {
        const aspect = this.canvas.clientWidth / this.canvas.clientHeight;
        this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        this.camera.position.set(0, 0, 3);
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    setupControls() {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.enableZoom = true;
        this.controls.enablePan = false;
        this.controls.minDistance = 1.5;
        this.controls.maxDistance = 5;
    }

    createGlobe() {
        console.log('Создание 3D модели Земли');
        
        // Создаем группу для глобуса
        this.globe = new THREE.Group();
        
        // Сфера Земли
        const earthGeometry = new THREE.SphereGeometry(1, 64, 32);
        const earthMaterial = new THREE.MeshPhongMaterial({
            color: 0x2563eb,
            transparent: true,
            opacity: 0.8
        });
        const earth = new THREE.Mesh(earthGeometry, earthMaterial);
        earth.castShadow = true;
        earth.receiveShadow = true;
        this.globe.add(earth);
        
        // Атмосфера
        const atmosphereGeometry = new THREE.SphereGeometry(1.05, 64, 32);
        const atmosphereMaterial = new THREE.MeshPhongMaterial({
            color: 0x87ceeb,
            transparent: true,
            opacity: 0.1,
            side: THREE.BackSide
        });
        const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        this.globe.add(atmosphere);
        
        // Добавляем текстуру Земли (упрощенная версия)
        this.addEarthTexture(earth);
        
        // Добавляем континенты
        this.addContinents();
        
        this.scene.add(this.globe);
    }

    addEarthTexture(earth) {
        // Создаем простую текстуру Земли
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        // Градиент для океанов
        const gradient = ctx.createLinearGradient(0, 0, 0, 512);
        gradient.addColorStop(0, '#1e40af');
        gradient.addColorStop(0.5, '#2563eb');
        gradient.addColorStop(1, '#1e3a8a');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1024, 512);
        
        // Добавляем континенты (упрощенные формы)
        ctx.fillStyle = '#16a34a';
        this.drawSimplifiedContinents(ctx);
        
        const texture = new THREE.CanvasTexture(canvas);
        earth.material.map = texture;
        earth.material.needsUpdate = true;
    }

    drawSimplifiedContinents(ctx) {
        // Северная Америка
        ctx.beginPath();
        ctx.ellipse(200, 150, 80, 120, 0, 0, 2 * Math.PI);
        ctx.fill();
        
        // Южная Америка
        ctx.beginPath();
        ctx.ellipse(250, 300, 60, 150, 0, 0, 2 * Math.PI);
        ctx.fill();
        
        // Европа
        ctx.beginPath();
        ctx.ellipse(500, 120, 100, 80, 0, 0, 2 * Math.PI);
        ctx.fill();
        
        // Африка
        ctx.beginPath();
        ctx.ellipse(520, 250, 80, 180, 0, 0, 2 * Math.PI);
        ctx.fill();
        
        // Азия
        ctx.beginPath();
        ctx.ellipse(700, 140, 150, 100, 0, 0, 2 * Math.PI);
        ctx.fill();
        
        // Австралия
        ctx.beginPath();
        ctx.ellipse(800, 350, 60, 40, 0, 0, 2 * Math.PI);
        ctx.fill();
    }

    addContinents() {
        // Добавляем точки для городов (будут обновлены при загрузке данных)
        this.cityPoints = new THREE.Group();
        this.globe.add(this.cityPoints);
        
        // Добавляем линии для маршрутов
        this.routeLines = new THREE.Group();
        this.globe.add(this.routeLines);
    }

    setupLighting() {
        // Основной свет
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        
        // Направленный свет (солнце)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 3, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);
        
        // Точечный свет для атмосферы
        const pointLight = new THREE.PointLight(0x87ceeb, 0.3, 10);
        pointLight.position.set(0, 0, 2);
        this.scene.add(pointLight);
    }

    // Конвертация географических координат в 3D координаты
    latLonToVector3(lat, lon, radius = 1.02) {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);
        
        return new THREE.Vector3(
            -(radius * Math.sin(phi) * Math.cos(theta)),
            radius * Math.cos(phi),
            radius * Math.sin(phi) * Math.sin(theta)
        );
    }

    // Добавление города на глобус
    addCity(cityCode, lat, lon, name) {
        const position = this.latLonToVector3(lat, lon);
        
        // Создаем точку города
        const geometry = new THREE.SphereGeometry(0.02, 16, 16);
        const material = new THREE.MeshPhongMaterial({
            color: 0xf59e0b,
            emissive: 0x222222
        });
        const cityPoint = new THREE.Mesh(geometry, material);
        cityPoint.position.copy(position);
        cityPoint.userData = { cityCode, name, lat, lon };
        
        // Добавляем свечение
        const glowGeometry = new THREE.SphereGeometry(0.04, 16, 16);
        const glowMaterial = new THREE.MeshPhongMaterial({
            color: 0xf59e0b,
            transparent: true,
            opacity: 0.3
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.copy(position);
        
        this.cityPoints.add(cityPoint);
        this.cityPoints.add(glow);
        
        // Добавляем текст (упрощенная версия)
        this.addCityLabel(position, name);
    }

    addCityLabel(position, name) {
        // Создаем простой текстовый спрайт
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 128;
        canvas.height = 32;
        
        context.fillStyle = 'rgba(0, 0, 0, 0.8)';
        context.fillRect(0, 0, 128, 32);
        
        context.fillStyle = 'white';
        context.font = '12px Arial';
        context.textAlign = 'center';
        context.fillText(name, 64, 20);
        
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(material);
        sprite.position.copy(position);
        sprite.position.multiplyScalar(1.1);
        sprite.scale.set(0.2, 0.1, 1);
        
        this.cityPoints.add(sprite);
    }

    // Добавление маршрута
    addRoute(fromLat, fromLon, toLat, toLon, color = 0x10b981) {
        const start = this.latLonToVector3(fromLat, fromLon);
        const end = this.latLonToVector3(toLat, toLon);
        
        // Создаем кривую для маршрута
        const curve = new THREE.QuadraticBezierCurve3(
            start,
            new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5).normalize().multiplyScalar(1.1),
            end
        );
        
        const geometry = new THREE.TubeGeometry(curve, 64, 0.005, 8, false);
        const material = new THREE.MeshPhongMaterial({
            color: color,
            transparent: true,
            opacity: 0.8
        });
        const route = new THREE.Mesh(geometry, material);
        
        this.routeLines.add(route);
    }

    // Обновление данных
    updateData(cities, routes) {
        console.log('Обновление данных на глобусе:', cities.length, 'городов,', routes.length, 'маршрутов');
        
        // Очищаем предыдущие данные
        this.clearData();
        
        // Добавляем города
        cities.forEach(city => {
            this.addCity(city.code, city.lat, city.lon, city.name);
        });
        
        // Добавляем маршруты
        routes.forEach(route => {
            const fromCity = cities.find(c => c.code === route.from);
            const toCity = cities.find(c => c.code === route.to);
            if (fromCity && toCity) {
                this.addRoute(fromCity.lat, fromCity.lon, toCity.lat, toCity.lon);
            }
        });
    }

    clearData() {
        // Очищаем города
        while (this.cityPoints.children.length > 0) {
            this.cityPoints.remove(this.cityPoints.children[0]);
        }
        
        // Очищаем маршруты
        while (this.routeLines.children.length > 0) {
            this.routeLines.remove(this.routeLines.children[0]);
        }
    }

    // Анимация
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
        
        // Медленное вращение глобуса
        if (this.globe) {
            this.globe.rotation.y += 0.001;
        }
    }

    // Обработка изменения размера
    setupResize() {
        window.addEventListener('resize', () => {
            const width = this.canvas.clientWidth;
            const height = this.canvas.clientHeight;
            
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height);
        });
    }

    // Показать/скрыть маршруты
    toggleRoutes(visible) {
        this.routeLines.visible = visible;
    }

    // Показать/скрыть города
    toggleCities(visible) {
        this.cityPoints.visible = visible;
    }

    // Сброс вида
    resetView() {
        this.camera.position.set(0, 0, 3);
        this.controls.reset();
    }

    // Очистка ресурсов
    dispose() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.renderer.dispose();
    }
}
