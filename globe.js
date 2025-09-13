/**
 * @file: globe.js
 * @description: 3D модель земного шара с интерактивным управлением
 * @dependencies: three.js
 * @created: 2024-12-19
 */

class Globe3D {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.globe = null;
        this.cities = [];
        this.routes = [];
        this.selectedCity = null;
        this.animationId = null;
        
        // Настройки
        this.settings = {
            globeRadius: 2,
            citySize: 0.02,
            routeHeight: 0.3,
            animationSpeed: 0.005,
            zoomSpeed: 0.1,
            rotationSpeed: 0.002
        };
        
        this.init();
    }
    
    init() {
        console.log('🌍 Инициализация 3D глобуса...');
        this.createScene();
        this.createCamera();
        this.createRenderer();
        this.createGlobe();
        this.setupControls();
        this.setupLighting();
        this.animate();
        
        // Обработка изменения размера окна
        window.addEventListener('resize', () => this.onWindowResize());
    }
    
    createScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000011);
        
        // Добавляем звездное поле
        this.createStarField();
    }
    
    createStarField() {
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 1000;
        const starPositions = new Float32Array(starCount * 3);
        
        for (let i = 0; i < starCount; i++) {
            const i3 = i * 3;
            starPositions[i3] = (Math.random() - 0.5) * 2000;
            starPositions[i3 + 1] = (Math.random() - 0.5) * 2000;
            starPositions[i3 + 2] = (Math.random() - 0.5) * 2000;
        }
        
        starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        
        const starMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 2,
            transparent: true,
            opacity: 0.8
        });
        
        const stars = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(stars);
    }
    
    createCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.container.clientWidth / this.container.clientHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 0, 5);
    }
    
    createRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('globe-canvas'),
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }
    
    createGlobe() {
        // Создаем группу для глобуса
        this.globe = new THREE.Group();
        
        // Создаем геометрию сферы
        const geometry = new THREE.SphereGeometry(this.settings.globeRadius, 64, 32);
        
        // Создаем материал с текстурой Земли
        const material = new THREE.MeshPhongMaterial({
            map: this.createEarthTexture(),
            bumpMap: this.createBumpTexture(),
            bumpScale: 0.1,
            shininess: 0
        });
        
        const earthMesh = new THREE.Mesh(geometry, material);
        earthMesh.castShadow = true;
        earthMesh.receiveShadow = true;
        
        this.globe.add(earthMesh);
        
        // Добавляем атмосферу
        this.createAtmosphere();
        
        this.scene.add(this.globe);
    }
    
    createEarthTexture() {
        // Создаем простую текстуру Земли
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        // Градиент для океанов
        const gradient = ctx.createLinearGradient(0, 0, 0, 512);
        gradient.addColorStop(0, '#1e3a8a');
        gradient.addColorStop(0.5, '#3b82f6');
        gradient.addColorStop(1, '#1e40af');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1024, 512);
        
        // Добавляем континенты
        this.drawContinents(ctx);
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        
        return texture;
    }
    
    drawContinents(ctx) {
        ctx.fillStyle = '#22c55e';
        
        // Упрощенные континенты
        const continents = [
            { x: 150, y: 100, w: 200, h: 300 }, // Северная Америка
            { x: 400, y: 80, w: 150, h: 200 },  // Европа
            { x: 500, y: 120, w: 200, h: 250 }, // Азия
            { x: 200, y: 350, w: 100, h: 100 }, // Южная Америка
            { x: 450, y: 350, w: 150, h: 120 }, // Африка
            { x: 700, y: 400, w: 100, h: 80 }   // Австралия
        ];
        
        continents.forEach(continent => {
            ctx.fillRect(continent.x, continent.y, continent.w, continent.h);
        });
    }
    
    createBumpTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        // Создаем шум для рельефа
        const imageData = ctx.createImageData(1024, 512);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            const noise = Math.random() * 255;
            data[i] = noise;     // R
            data[i + 1] = noise; // G
            data[i + 2] = noise; // B
            data[i + 3] = 255;   // A
        }
        
        ctx.putImageData(imageData, 0, 0);
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        
        return texture;
    }
    
    createAtmosphere() {
        const atmosphereGeometry = new THREE.SphereGeometry(
            this.settings.globeRadius * 1.02, 
            64, 
            32
        );
        
        const atmosphereMaterial = new THREE.MeshPhongMaterial({
            color: 0x4fc3f7,
            transparent: true,
            opacity: 0.1,
            side: THREE.BackSide
        });
        
        const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        this.globe.add(atmosphere);
    }
    
    setupLighting() {
        // Основной свет
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(ambientLight);
        
        // Направленный свет (солнце)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 3, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);
        
        // Точечный свет для подсветки
        const pointLight = new THREE.PointLight(0x4fc3f7, 0.5, 100);
        pointLight.position.set(-5, 0, 5);
        this.scene.add(pointLight);
    }
    
    setupControls() {
        let isMouseDown = false;
        let mouseX = 0;
        let mouseY = 0;
        let targetRotationX = 0;
        let targetRotationY = 0;
        let rotationX = 0;
        let rotationY = 0;
        
        // Обработка мыши
        this.container.addEventListener('mousedown', (event) => {
            isMouseDown = true;
            mouseX = event.clientX;
            mouseY = event.clientY;
        });
        
        this.container.addEventListener('mousemove', (event) => {
            if (!isMouseDown) return;
            
            const deltaX = event.clientX - mouseX;
            const deltaY = event.clientY - mouseY;
            
            targetRotationY += deltaX * 0.01;
            targetRotationX += deltaY * 0.01;
            
            mouseX = event.clientX;
            mouseY = event.clientY;
        });
        
        this.container.addEventListener('mouseup', () => {
            isMouseDown = false;
        });
        
        this.container.addEventListener('wheel', (event) => {
            event.preventDefault();
            const delta = event.deltaY;
            const scale = delta > 0 ? 1 + this.settings.zoomSpeed : 1 - this.settings.zoomSpeed;
            this.camera.position.multiplyScalar(scale);
            
            // Ограничиваем масштаб
            const distance = this.camera.position.length();
            if (distance < 3) this.camera.position.normalize().multiplyScalar(3);
            if (distance > 15) this.camera.position.normalize().multiplyScalar(15);
        });
        
        // Плавная интерполяция вращения
        const updateRotation = () => {
            rotationX += (targetRotationX - rotationX) * 0.1;
            rotationY += (targetRotationY - rotationY) * 0.1;
            
            this.globe.rotation.x = rotationX;
            this.globe.rotation.y = rotationY;
            
            requestAnimationFrame(updateRotation);
        };
        updateRotation();
    }
    
    addCity(cityData) {
        const { name, lat, lng, isUtair } = cityData;
        
        // Конвертируем координаты в 3D позицию
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lng + 180) * (Math.PI / 180);
        
        const x = this.settings.globeRadius * Math.sin(phi) * Math.cos(theta);
        const y = this.settings.globeRadius * Math.cos(phi);
        const z = this.settings.globeRadius * Math.sin(phi) * Math.sin(theta);
        
        // Создаем геометрию города
        const geometry = new THREE.SphereGeometry(
            isUtair ? this.settings.citySize * 2 : this.settings.citySize,
            16,
            16
        );
        
        const material = new THREE.MeshPhongMaterial({
            color: isUtair ? 0xff6b35 : 0x666666,
            emissive: isUtair ? 0x220000 : 0x000000,
            transparent: true,
            opacity: isUtair ? 0.9 : 0.6
        });
        
        const cityMesh = new THREE.Mesh(geometry, material);
        cityMesh.position.set(x, y, z);
        cityMesh.userData = { name, isUtair, lat, lng };
        
        // Добавляем свечение для городов Ютэйр
        if (isUtair) {
            const glowGeometry = new THREE.SphereGeometry(
                this.settings.citySize * 3,
                16,
                16
            );
            const glowMaterial = new THREE.MeshPhongMaterial({
                color: 0xff6b35,
                transparent: true,
                opacity: 0.2,
                side: THREE.BackSide
            });
            const glow = new THREE.Mesh(glowGeometry, glowMaterial);
            cityMesh.add(glow);
        }
        
        this.globe.add(cityMesh);
        this.cities.push(cityMesh);
        
        return cityMesh;
    }
    
    addRoute(routeData) {
        const { from, to, fromCoords, toCoords } = routeData;
        
        // Создаем дугу между городами
        const curve = this.createArcCurve(fromCoords, toCoords);
        
        const geometry = new THREE.TubeGeometry(curve, 64, 0.005, 8, false);
        const material = new THREE.MeshPhongMaterial({
            color: 0x4fc3f7,
            transparent: true,
            opacity: 0.6,
            emissive: 0x001122
        });
        
        const routeMesh = new THREE.Mesh(geometry, material);
        routeMesh.userData = { from, to, routeData };
        
        this.globe.add(routeMesh);
        this.routes.push(routeMesh);
        
        return routeMesh;
    }
    
    createArcCurve(fromCoords, toCoords) {
        const start = this.coordsToVector3(fromCoords);
        const end = this.coordsToVector3(toCoords);
        
        // Создаем контрольную точку для дуги
        const mid = new THREE.Vector3()
            .addVectors(start, end)
            .normalize()
            .multiplyScalar(this.settings.globeRadius + this.settings.routeHeight);
        
        return new THREE.QuadraticBezierCurve3(start, mid, end);
    }
    
    coordsToVector3(coords) {
        const { lat, lng } = coords;
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lng + 180) * (Math.PI / 180);
        
        return new THREE.Vector3(
            this.settings.globeRadius * Math.sin(phi) * Math.cos(theta),
            this.settings.globeRadius * Math.cos(phi),
            this.settings.globeRadius * Math.sin(phi) * Math.sin(theta)
        );
    }
    
    highlightCity(cityName) {
        // Плавная анимация сброса выделения
        this.cities.forEach(city => {
            this.animateCityScale(city, 1);
            city.material.opacity = city.userData.isUtair ? 0.9 : 0.6;
        });
        
        this.routes.forEach(route => {
            this.animateRouteOpacity(route, 0.2);
        });
        
        // Выделяем выбранный город с анимацией
        const city = this.cities.find(c => c.userData.name === cityName);
        if (city) {
            city.material.opacity = 1;
            this.animateCityScale(city, 1.8);
            
            // Подсвечиваем связанные маршруты с анимацией
            this.routes.forEach(route => {
                if (route.userData.from === cityName || route.userData.to === cityName) {
                    this.animateRouteOpacity(route, 0.9);
                }
            });
        }
    }
    
    animateCityScale(city, targetScale) {
        const startScale = city.scale.x;
        const duration = 300; // мс
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = this.easeOutCubic(progress);
            
            const currentScale = startScale + (targetScale - startScale) * easeProgress;
            city.scale.setScalar(currentScale);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }
    
    animateRouteOpacity(route, targetOpacity) {
        const startOpacity = route.material.opacity;
        const duration = 200; // мс
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = this.easeOutCubic(progress);
            
            route.material.opacity = startOpacity + (targetOpacity - startOpacity) * easeProgress;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }
    
    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }
    
    filterByDays(selectedDays) {
        this.routes.forEach(route => {
            const routeDays = route.userData.routeData.days;
            const hasSelectedDay = routeDays.some(day => selectedDays.includes(day));
            
            const targetOpacity = hasSelectedDay ? 0.6 : 0.1;
            const targetVisible = hasSelectedDay;
            
            // Плавная анимация изменения видимости
            this.animateRouteOpacity(route, targetOpacity);
            
            // Задержка для плавного скрытия
            if (!hasSelectedDay) {
                setTimeout(() => {
                    route.visible = false;
                }, 200);
            } else {
                route.visible = true;
            }
        });
    }
    
    onWindowResize() {
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }
    
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        // Медленное вращение глобуса
        this.globe.rotation.y += this.settings.rotationSpeed;
        
        // Анимация пульсации городов Ютэйр
        this.animateCityPulse();
        
        // Анимация маршрутов
        this.animateRoutes();
        
        this.renderer.render(this.scene, this.camera);
    }
    
    animateCityPulse() {
        const time = Date.now() * 0.001;
        
        this.cities.forEach(city => {
            if (city.userData.isUtair) {
                const pulse = Math.sin(time * 2 + city.position.x) * 0.1 + 1;
                city.scale.setScalar(pulse);
            }
        });
    }
    
    animateRoutes() {
        const time = Date.now() * 0.0005;
        
        this.routes.forEach(route => {
            if (route.visible) {
                // Пульсация маршрутов
                const pulse = Math.sin(time + route.position.x) * 0.1 + 0.9;
                route.material.opacity = Math.max(0.1, route.material.opacity * pulse);
            }
        });
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        this.scene.clear();
        this.renderer.dispose();
    }
}

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Globe3D;
}
