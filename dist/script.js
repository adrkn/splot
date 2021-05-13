/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./style.css":
/*!*******************!*\
  !*** ./style.css ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./index.ts":
/*!******************!*\
  !*** ./index.ts ***!
  \******************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var splot_1 = __importDefault(__webpack_require__(/*! ./splot */ "./splot.ts"));
__webpack_require__(/*! @/style */ "./style.css");
function randomInt(range) {
    return Math.floor(Math.random() * range);
}
var i = 0;
var n = 1000000; // Имитируемое число объектов.
var palette = ['#FF00FF', '#800080', '#FF0000', '#800000', '#FFFF00', '#00FF00', '#008000', '#00FFFF', '#0000FF', '#000080'];
var plotWidth = 32000;
var plotHeight = 16000;
// Пример итерирующей функции. Итерации имитируются случайными выдачами. Почти также работает режим демо-данных.
function readNextObject() {
    if (i < n) {
        i++;
        return {
            x: randomInt(plotWidth),
            y: randomInt(plotHeight),
            shape: randomInt(3),
            color: randomInt(palette.length), // Индекс цвета в массиве цветов
        };
    }
    else
        return null; // Возвращаем null, когда объекты "закончились"
}
/** ======================================================================== **/
var scatterPlot = new splot_1.default('canvas1');
// Настройка экземпляра на режим вывода отладочной информации в консоль браузера.
// Другие примеры работы описаны в файле splot.js со строки 214.
scatterPlot.setup({
    iterationCallback: readNextObject,
    polygonPalette: palette,
    gridSize: {
        width: plotWidth,
        height: plotHeight,
    },
    debugMode: {
        isEnable: true,
    },
    demoMode: {
        isEnable: true,
    },
});
scatterPlot.run();


/***/ }),

/***/ "./splot.ts":
/*!******************!*\
  !*** ./splot.ts ***!
  \******************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
function isObject(val) {
    return (val instanceof Object) && (val.constructor === Object);
}
/**
 * Генерирует случайное целое число в диапазоне от 0 до заданного предела. Сам
 * предел в диапазон не входит: [0...range-1].
 *
 * @private
 * @param {number} range Верхний предел диапазона случайного выбора.
 * @return {number} Сгенерированное случайное число.
 */
function randomInt(range) {
    return Math.floor(Math.random() * range);
}
var SPlot = /** @class */ (function () {
    /**
     * Создает экземпляр класса, инициализирует настройки.
     *
     * @remarks
     * Если канвас с заданным идентификатором не найден - генерируется ошибка. Настройки могут быть заданы как в
     * конструкторе, так и в методе {@link setup}. Однако в любом случае настройки должны быть заданы до запуска рендера.
     *
     * @param canvasId - Идентификатор канваса, на котором будет рисоваться график.
     * @param options - Пользовательские настройки экземпляра.
     */
    function SPlot(canvasId, options) {
        this.polygonPalette = [
            '#FF00FF', '#800080', '#FF0000', '#800000', '#FFFF00',
            '#00FF00', '#008000', '#00FFFF', '#0000FF', '#000080'
        ];
        this.gridSize = {
            width: 32000,
            height: 16000
        };
        this.polygonSize = 20;
        this.circleApproxLevel = 12;
        this.debugMode = {
            isEnable: false,
            output: 'console'
        };
        this.demoMode = {
            isEnable: false,
            amount: 1000000,
            /**
             * По умолчанию в режиме демо-данных будут поровну отображаться
             * полигоны всех возможных форм. Соответствующие значения shapeQuota
             * инициализируются при регистрации функций создания форм (ниже по коду).
             */
            shapeQuota: [],
            index: 0
        };
        this.forceRun = false;
        this.maxAmountOfPolygons = 1000000000;
        this.bgColor = '#ffffff';
        this.rulesColor = '#c0c0c0';
        this.camera = {
            x: this.gridSize.width / 2,
            y: this.gridSize.height / 2,
            zoom: 1
        };
        this.webGlSettings = {
            alpha: false,
            depth: false,
            stencil: false,
            antialias: false,
            premultipliedAlpha: false,
            preserveDrawingBuffer: false,
            powerPreference: 'high-performance',
            failIfMajorPerformanceCaveat: false,
            desynchronized: false
        };
        this.variables = {};
        this._vertexShaderCodeTemplate = 'attribute vec2 a_position;\n' +
            'attribute float a_color;\n' +
            'uniform mat3 u_matrix;\n' +
            'varying vec3 v_color;\n' +
            'void main() {\n' +
            '  gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0.0, 1.0);\n' +
            '  SET-VERTEX-COLOR-CODE' +
            '}\n';
        this.fragmentShaderCodeTemplate = 'precision lowp float;\n' +
            'varying vec3 v_color;\n' +
            'void main() {\n' +
            '  gl_FragColor = vec4(v_color.rgb, 1.0);\n' +
            '}\n';
        this.amountOfPolygons = 0;
        this.debugStyle = 'font-weight: bold; color: #ffffff;';
        this.USEFUL_CONSTS = [];
        this.isRunning = false;
        this.transormation = {
            matrix: [],
            startInvMatrix: [],
            startCameraX: 0,
            startCameraY: 0,
            startPosX: 0,
            startPosY: 0
        };
        this.maxAmountOfVertexPerPolygonGroup = 32768 - (this.circleApproxLevel + 1);
        this.buffers = {
            vertexBuffers: [],
            colorBuffers: [],
            indexBuffers: [],
            amountOfGLVertices: [],
            amountOfShapes: [],
            amountOfBufferGroups: 0,
            amountOfTotalVertices: 0,
            amountOfTotalGLVertices: 0,
            sizeInBytes: [0, 0, 0]
        };
        this.shapes = [];
        // Сохранение ссылки на экземпляр класса. Позволяет внешим событиям получать доступ к полям и методам экземпляра.
        SPlot.instances[canvasId] = this;
        if (document.getElementById(canvasId)) {
            this.canvas = document.getElementById(canvasId);
        }
        else {
            throw new Error('Канвас с идентификатором "#' + canvasId + '" не найден!');
        }
        /**
         * Регистрация трех базовых форм полигонов (треугольники, квадраты и круги). Наличие этих форм в указанном порядке
         * является обязательным для корректной работы приложения. Другие формы могут регистрироватья в любом количестве, в
         * любой последовательности.
         */
        this.registerShape(this.getVerticesOfTriangle, 'Треугольник');
        this.registerShape(this.getVerticesOfSquare, 'Квадрат');
        this.registerShape(this.getVerticesOfCircle, 'Круг');
        // Если переданы настройки, то они применяются.
        if (options) {
            this.setOptions(options);
            //  Если запрошен форсированный запуск, то инициализируются все необходимые для рендера параметры.
            if (this.forceRun) {
                this.setup(options);
            }
        }
    }
    /**
     * Создает контекст рендеринга WebGL и устанавливает корректный размер области просмотра.
     */
    SPlot.prototype.createGl = function () {
        this.gl = this.canvas.getContext('webgl', this.webGlSettings);
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    };
    /**
     * Регистрирует новую форму полигонов. Регистрация означает возможность в дальнейшем отображать на графике полигоны данной формы.
     *
     * @param polygonCalc - Функция вычисления координат вершин полигона данной формы.
     * @param polygonName - Название формы полигона.
     * @returns Индекс новой формы, по которому задается ее отображение на графике.
     */
    SPlot.prototype.registerShape = function (polygonCalc, polygonName) {
        // Добавление формы в массив форм.
        this.shapes.push({
            calc: polygonCalc,
            name: polygonName
        });
        // Добавление формы в массив частот появления в демо-режиме.
        this.demoMode.shapeQuota.push(1);
        // Полученный индекс формы в массиве форм.
        return this.shapes.length - 1;
    };
    /**
     * Устанавливает необходимые для рендера параметры экземпляра и WebGL.
     *
     * @param options - Пользовательские настройки экземпляра.
     */
    SPlot.prototype.setup = function (options) {
        // Применение пользовательских настроек.
        this.setOptions(options);
        // Создание контекста рендеринга.
        this.createGl();
        // Вывод отладочной информации.
        if (this.debugMode.isEnable) {
            this.reportMainInfo(options);
        }
        // Обнуление счетчика полигонов.
        this.amountOfPolygons = 0;
        // Обнуление технического счетчика режима демо-данных
        this.demoMode.index = 0;
        // Обнуление счетчиков числа использования различных форм полигонов.
        for (var i = 0; i < this.shapes.length; i++) {
            this.buffers.amountOfShapes[i] = 0;
        }
        /**
         * Предельное количество вершин в группе полигонов зависит от параметра
         * circleApproxLevel, который мог быть изменен пользовательскими настройками.
         */
        this.maxAmountOfVertexPerPolygonGroup = 32768 - (this.circleApproxLevel + 1);
        // Инициализация вспомогательных констант.
        this.setUsefulConstants();
        // Установка цвета очистки рендеринга
        var _a = this.convertColor(this.bgColor), r = _a[0], g = _a[1], b = _a[2];
        this.gl.clearColor(r, g, b, 0.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        /**
         * Подготовка кодов шейдеров. В код вершинного шейдера вставляется код выбора цвета вершин. Код фрагментного
         * шейдера используется без изменений.
         */
        var vertexShaderCode = this._vertexShaderCodeTemplate.replace('SET-VERTEX-COLOR-CODE', this.genShaderColorCode());
        var fragmentShaderCode = this.fragmentShaderCodeTemplate;
        // Создание шейдеров WebGL.
        var vertexShader = this.createWebGlShader('VERTEX_SHADER', vertexShaderCode);
        var fragmentShader = this.createWebGlShader('FRAGMENT_SHADER', fragmentShaderCode);
        // Создание программы WebGL.
        this.createWebGlProgram(vertexShader, fragmentShader);
        // Установка связей переменных приложения с программой WebGl.
        this.setWebGlVariable('attribute', 'a_position');
        this.setWebGlVariable('attribute', 'a_color');
        this.setWebGlVariable('uniform', 'u_matrix');
        // Вычисление данных обо всех полигонах и заполнение ими буферов WebGL.
        this.createWbGlBuffers();
        // Если необходимо, то рендеринг запускается сразу после установки параметров экземпляра.
        if (this.forceRun) {
            this.run();
        }
    };
    /**
     * Применяет пользовательские настройки экземпляра.
     *
     * @param options - Пользовательские настройки экземпляра.
     */
    SPlot.prototype.setOptions = function (options) {
        /**
         * Копирование пользовательских настроек в соответсвующие поля экземпляра. Копируются только те из них, которым
         * имеются соответствующие эквиваленты в полях экземпляра. Копируется также первый уровень вложенных настроек.
         */
        for (var option in options) {
            if (!this.hasOwnProperty(option))
                continue;
            if (isObject(options[option]) && isObject(this[option])) {
                for (var nestedOption in options[option]) {
                    if (this[option].hasOwnProperty(nestedOption)) {
                        this[option][nestedOption] = options[option][nestedOption];
                    }
                }
            }
            else {
                this[option] = options[option];
            }
        }
        /**
         * Если пользователь задает размер плоскости, но при этом на задает начальное положение области просмотра, то
         * область просмотра помещается в центр заданной плоскости.
         */
        if (options.hasOwnProperty('gridSize') && !options.hasOwnProperty('camera')) {
            this.camera = {
                x: this.gridSize.width / 2,
                y: this.gridSize.height / 2,
                zoom: 1
            };
        }
        /**
         * Если запрошен демо-режим, то для итерирования объектов будет использоваться внутренний имитирующий итерирование
         * метод. При этом внешняя функция итерирования использована не будет.
         */
        if (this.demoMode.isEnable) {
            this.iterationCallback = this.demoIterationCallback;
        }
    };
    /**
     * Вычисляет набор вспомогательных констант {@link USEFUL_CONSTS}, хранящих результаты алгебраических и
     * тригонометрических вычислений, используемых в расчетах вершин полигонов и матриц трансформации.
     *
     * @remarks
     * Такие константы позволяют вынести затратные для процессора операции за пределы многократно используемых функций
     * увеличивая производительность приложения на этапах подготовки данных и рендеринга.
     */
    SPlot.prototype.setUsefulConstants = function () {
        // Константы, зависящие от размера полигона.
        this.USEFUL_CONSTS[0] = this.polygonSize / 2;
        this.USEFUL_CONSTS[1] = this.USEFUL_CONSTS[0] / Math.cos(Math.PI / 6);
        this.USEFUL_CONSTS[2] = this.USEFUL_CONSTS[0] * Math.tan(Math.PI / 6);
        // Константы, зависящие от степени детализации круга и размера полигона.
        this.USEFUL_CONSTS[3] = new Float32Array(this.circleApproxLevel);
        this.USEFUL_CONSTS[4] = new Float32Array(this.circleApproxLevel);
        for (var i = 0; i < this.circleApproxLevel; i++) {
            var angle = 2 * Math.PI * i / this.circleApproxLevel;
            this.USEFUL_CONSTS[3][i] = this.USEFUL_CONSTS[0] * Math.cos(angle);
            this.USEFUL_CONSTS[4][i] = this.USEFUL_CONSTS[0] * Math.sin(angle);
        }
        // Константы, зависящие от размера канваса.
        this.USEFUL_CONSTS[5] = 2 / this.canvas.width;
        this.USEFUL_CONSTS[6] = 2 / this.canvas.height;
        this.USEFUL_CONSTS[7] = 2 / this.canvas.clientWidth;
        this.USEFUL_CONSTS[8] = -2 / this.canvas.clientHeight;
        this.USEFUL_CONSTS[9] = this.canvas.getBoundingClientRect().left;
        this.USEFUL_CONSTS[10] = this.canvas.getBoundingClientRect().top;
    };
    /**
     * Создает шейдер WebGL.
     *
     * @param shaderType Тип шейдера.
     * @param shaderCode Код шейдера на языке GLSL.
     * @returns Созданный объект шейдера.
     */
    SPlot.prototype.createWebGlShader = function (shaderType, shaderCode) {
        // Создание, привязка кода и компиляция шейдера.
        var shader = this.gl.createShader(this.gl[shaderType]);
        this.gl.shaderSource(shader, shaderCode);
        this.gl.compileShader(shader);
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            throw new Error('Ошибка компиляции шейдера [' + shaderType + ']. ' + this.gl.getShaderInfoLog(shader));
        }
        // Вывод отладочной информации.
        if (this.debugMode.isEnable) {
            console.group('%cСоздан шейдер [' + shaderType + ']', this.debugStyle);
            {
                console.log(shaderCode);
            }
            console.groupEnd();
        }
        return shader;
    };
    /**
     * Создает программу WebGL.
     *
     * @param {WebGLShader} vertexShader Вершинный шейдер.
     * @param {WebGLShader} fragmentShader Фрагментный шейдер.
     */
    SPlot.prototype.createWebGlProgram = function (vertexShader, fragmentShader) {
        this.gpuProgram = this.gl.createProgram();
        this.gl.attachShader(this.gpuProgram, vertexShader);
        this.gl.attachShader(this.gpuProgram, fragmentShader);
        this.gl.linkProgram(this.gpuProgram);
        if (!this.gl.getProgramParameter(this.gpuProgram, this.gl.LINK_STATUS)) {
            throw new Error('Ошибка создания программы WebGL. ' + this.gl.getProgramInfoLog(this.gpuProgram));
        }
        this.gl.useProgram(this.gpuProgram);
    };
    /**
     * Устанавливает связь переменной приложения с программой WebGl.
     *
     * @param varType Тип переменной.
     * @param varName Имя переменной.
     */
    SPlot.prototype.setWebGlVariable = function (varType, varName) {
        if (varType === 'uniform') {
            this.variables[varName] = this.gl.getUniformLocation(this.gpuProgram, varName);
        }
        else if (varType === 'attribute') {
            this.variables[varName] = this.gl.getAttribLocation(this.gpuProgram, varName);
        }
    };
    /**
     * Создает и заполняет данными обо всех полигонах буферы WebGL.
     */
    SPlot.prototype.createWbGlBuffers = function () {
        // Вывод отладочной информации.
        if (this.debugMode.isEnable) {
            console.log('%cЗапущен процесс загрузки данных [' + this.getCurrentTime() + ']...', this.debugStyle);
            // Запуск консольного таймера, измеряющего длительность процесса загрузки данных в видеопамять.
            console.time('Длительность');
        }
        var polygonGroup;
        // Итерирование групп полигонов.
        while (polygonGroup = this.createPolygonGroup()) {
            // Создание и заполнение буферов данными о текущей группе полигонов.
            this.addWbGlBuffer(this.buffers.vertexBuffers, 'ARRAY_BUFFER', new Float32Array(polygonGroup.vertices), 0);
            this.addWbGlBuffer(this.buffers.colorBuffers, 'ARRAY_BUFFER', new Uint8Array(polygonGroup.colors), 1);
            this.addWbGlBuffer(this.buffers.indexBuffers, 'ELEMENT_ARRAY_BUFFER', new Uint16Array(polygonGroup.indices), 2);
            // Счетчик количества буферов.
            this.buffers.amountOfBufferGroups++;
            // Счетчик количества вершин GL-треугольников текущей группы буферов.
            this.buffers.amountOfGLVertices.push(polygonGroup.amountOfGLVertices);
            // Счетчик общего количества вершин GL-треугольников.
            this.buffers.amountOfTotalGLVertices += polygonGroup.amountOfGLVertices;
        }
        // Вывод отладочной информации.
        if (this.debugMode.isEnable) {
            this.reportAboutObjectReading();
        }
    };
    /**
     * Считывает данные об исходных объектах и формирует соответсвующую этим объектам группу полигонов.
     *
     * @remarks
     * Группа формируется с учетом технического ограничения на количество вершин в группе и лимита на общее количество
     * полигонов на канвасе.
     *
     * @returns Созданная группа полигонов или null, если формирование всех групп полигонов завершилось.
     */
    SPlot.prototype.createPolygonGroup = function () {
        var polygonGroup = {
            vertices: [],
            indices: [],
            colors: [],
            amountOfVertices: 0,
            amountOfGLVertices: 0
        };
        var polygon;
        /**
         * Если количество полигонов канваса достигло допустимого максимума, то дальнейшая обработка исходных объектов
         * приостанавливается - формирование групп полигонов завершается возвратом значения null (симуляция достижения
         * последнего обрабатываемого исходного объекта).
         */
        if (this.amountOfPolygons >= this.maxAmountOfPolygons)
            return null;
        // Итерирование исходных объектов.
        while (polygon = this.iterationCallback()) {
            // Добавление в группу полигонов нового полигона.
            this.addPolygon(polygonGroup, polygon);
            // Счетчик числа применений каждой из форм полигонов.
            this.buffers.amountOfShapes[polygon.shape]++;
            // Счетчик общего количество полигонов.
            this.amountOfPolygons++;
            /**
             * Если количество полигонов канваса достигло допустимого максимума, то дальнейшая обработка исходных объектов
             * приостанавливается - формирование групп полигонов завершается возвратом значения null (симуляция достижения
             * последнего обрабатываемого исходного объекта).
             */
            if (this.amountOfPolygons >= this.maxAmountOfPolygons)
                break;
            /**
             * Если общее количество всех вершин в группе полигонов превысило техническое ограничение, то группа полигонов
             * считается сформированной и итерирование исходных объектов приостанавливается.
             */
            if (polygonGroup.amountOfVertices >= this.maxAmountOfVertexPerPolygonGroup)
                break;
        }
        // Счетчик общего количества вершин всех вершинных буферов.
        this.buffers.amountOfTotalVertices += polygonGroup.amountOfVertices;
        // Если группа полигонов непустая, то возвращаем ее. Если пустая - возвращаем null.
        return (polygonGroup.amountOfVertices > 0) ? polygonGroup : null;
    };
    /**
     * Создает в массиве буферов WebGL новый буфер и записывает в него переданные данные.
     *
     * @param buffers - Массив буферов WebGL, в который будет добавлен создаваемый буфер.
     * @param type - Тип создаваемого буфера.
     * @param data - Данные в виде типизированного массива для записи в создаваемый буфер.
     * @param key - Ключ (индекс), идентифицирующий тип буфера (для вершин, для цветов, для индексов). Используется для
     *     раздельного подсчета памяти, занимаемой каждым типом буфера.
     */
    SPlot.prototype.addWbGlBuffer = function (buffers, type, data, key) {
        // Определение индекса нового элемента в массиве буферов WebGL.
        var index = this.buffers.amountOfBufferGroups;
        // Создание и заполнение данными нового буфера.
        buffers[index] = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl[type], buffers[index]);
        this.gl.bufferData(this.gl[type], data, this.gl.STATIC_DRAW);
        // Счетчик памяти, занимаемой буферами данных (раздельно по каждому типу буферов)
        this.buffers.sizeInBytes[key] += data.length * data.BYTES_PER_ELEMENT;
    };
    /**
     * Вычисляет координаты вершин полигона треугольной формы.
     *
     * @param x - Положение центра полигона на оси абсцисс.
     * @param y - Положение центра полигона на оси ординат.
     * @param consts - Набор вспомогательных констант, используемых для вычисления вершин.
     * @returns Данные о вершинах полигона.
     */
    SPlot.prototype.getVerticesOfTriangle = function (x, y, consts) {
        var _a = [x - consts[0], y + consts[2]], x1 = _a[0], y1 = _a[1];
        var _b = [x, y - consts[1]], x2 = _b[0], y2 = _b[1];
        var _c = [x + consts[0], y + consts[2]], x3 = _c[0], y3 = _c[1];
        var vertices = {
            values: [x1, y1, x2, y2, x3, y3],
            indices: [0, 1, 2]
        };
        return vertices;
    };
    /**
     * Вычисляет координаты вершин полигона квадратной формы.
     *
     * @param x - Положение центра полигона на оси абсцисс.
     * @param y - Положение центра полигона на оси ординат.
     * @param consts - Набор вспомогательных констант, используемых для вычисления вершин.
     * @returns Данные о вершинах полигона.
     */
    SPlot.prototype.getVerticesOfSquare = function (x, y, consts) {
        var _a = [x - consts[0], y - consts[0]], x1 = _a[0], y1 = _a[1];
        var _b = [x + consts[0], y + consts[0]], x2 = _b[0], y2 = _b[1];
        var vertices = {
            values: [x1, y1, x2, y1, x2, y2, x1, y2],
            indices: [0, 1, 2, 0, 2, 3]
        };
        return vertices;
    };
    /**
     * Вычисляет координаты вершин полигона круглой формы.
     *
     * @param x - Положение центра полигона на оси абсцисс.
     * @param y - Положение центра полигона на оси ординат.
     * @param consts - Набор вспомогательных констант, используемых для вычисления вершин.
     * @returns Данные о вершинах полигона.
     */
    SPlot.prototype.getVerticesOfCircle = function (x, y, consts) {
        // Занесение в набор вершин центра круга.
        var vertices = {
            values: [x, y],
            indices: []
        };
        // Добавление апроксимирующих окружность круга вершин.
        for (var i = 0; i < consts[3].length; i++) {
            vertices.values.push(x + consts[3][i], y + consts[4][i]);
            vertices.indices.push(0, i + 1, i + 2);
        }
        /**
         * Последняя вершина последнего GL-треугольника заменяется на первую апроксимирующую
         * окружность круга вершину, замыкая апроксимирущий круг полигон.
         */
        vertices.indices[vertices.indices.length - 1] = 1;
        return vertices;
    };
    /**
     * Создает и добавляет в группу полигонов новый полигон.
     *
     * @param polygonGroup - Группа полигонов, в которую происходит добавление.
     * @param polygon - Информация о добавляемом полигоне.
     */
    SPlot.prototype.addPolygon = function (polygonGroup, polygon) {
        var _a, _b;
        /**
         * В зависимости от формы полигона и координат его центра вызывается соответсвующая функция нахождения координат его
         * вершин.
         */
        var vertices = this.shapes[polygon.shape].calc(polygon.x, polygon.y, this.USEFUL_CONSTS);
        // Количество вершин - это количество пар чисел в массиве вершин.
        var amountOfVertices = Math.trunc(vertices.values.length / 2);
        // Нахождение индекса первой добавляемой в группу полигонов вершины.
        var indexOfLastVertex = polygonGroup.amountOfVertices;
        /**
         * Номера индексов вершин - относительные. Для вычисления абсолютных индексов необходимо прибавить к относительным
         * индексам индекс первой добавляемой в группу полигонов вершины.
         */
        for (var i = 0; i < vertices.indices.length; i++) {
            vertices.indices[i] += indexOfLastVertex;
        }
        /**
         * Добавление в группу полигонов индексов вершин нового полигона и подсчет общего количества вершин GL-треугольников
         * в группе.
         */
        (_a = polygonGroup.indices).push.apply(_a, vertices.indices);
        polygonGroup.amountOfGLVertices += vertices.indices.length;
        // Добавление в группу полигонов вершин нового полигона и подсчет общего количества вершин в группе.
        (_b = polygonGroup.vertices).push.apply(_b, vertices.values);
        polygonGroup.amountOfVertices += amountOfVertices;
        // Добавление цветов вершин - по одному цвету на каждую вершину.
        for (var i = 0; i < amountOfVertices; i++) {
            polygonGroup.colors.push(polygon.color);
        }
    };
    /**
     * Выводит базовую часть отладочной информации.
     *
     * @param options - Пользовательские настройки экземпляра.
     */
    SPlot.prototype.reportMainInfo = function (options) {
        console.log('%cВключен режим отладки ' + this.constructor.name + ' [#' + this.canvas.id + ']', this.debugStyle + ' background-color: #cc0000;');
        if (this.demoMode.isEnable) {
            console.log('%cВключен демонстрационный режим данных', this.debugStyle);
        }
        console.group('%cПредупреждение', this.debugStyle);
        {
            console.dir('Открытая консоль браузера и другие активные средства контроля разработки существенно снижают производительность высоконагруженных приложений. Для объективного анализа производительности все подобные средства должны быть отключены, а консоль браузера закрыта. Некоторые данные отладочной информации в зависимости от используемого браузера могут не отображаться или отображаться некорректно. Средство отладки протестировано в браузере Google Chrome v.90');
        }
        console.groupEnd();
        console.group('%cВидеосистема', this.debugStyle);
        {
            var ext = this.gl.getExtension('WEBGL_debug_renderer_info');
            var graphicsCardName = (ext) ? this.gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : '[неизвестно]';
            console.log('Графическая карта: ' + graphicsCardName);
            console.log('Версия GL: ' + this.gl.getParameter(this.gl.VERSION));
        }
        console.groupEnd();
        console.group('%cНастройка параметров экземпляра', this.debugStyle);
        {
            console.dir(this);
            console.log('Заданы параметры:\n', JSON.stringify(options, null, ' '));
            console.log('Канвас: #' + this.canvas.id);
            console.log('Размер канваса: ' + this.canvas.width + ' x ' + this.canvas.height + ' px');
            console.log('Размер плоскости: ' + this.gridSize.width + ' x ' + this.gridSize.height + ' px');
            console.log('Размер полигона: ' + this.polygonSize + ' px');
            console.log('Апроксимация окружности: ' + this.circleApproxLevel + ' углов');
            console.log('Функция перебора: ' + this.iterationCallback.name);
        }
        console.groupEnd();
    };
    /**
     * Выводит в консоль отладочную информацию о загрузке данных в видеопамять.
     */
    SPlot.prototype.reportAboutObjectReading = function () {
        console.group('%cЗагрузка данных завершена [' + this.getCurrentTime() + ']', this.debugStyle);
        {
            console.timeEnd('Длительность');
            console.log('Результат: ' +
                ((this.amountOfPolygons >= this.maxAmountOfPolygons) ? 'достигнут заданный лимит (' +
                    this.maxAmountOfPolygons.toLocaleString() + ')' : 'обработаны все объекты'));
            console.group('Кол-во объектов: ' + this.amountOfPolygons.toLocaleString());
            {
                for (var i = 0; i < this.shapes.length; i++) {
                    var shapeCapction = this.shapes[i].name;
                    var shapeAmount = this.buffers.amountOfShapes[i];
                    console.log(shapeCapction + ': ' + shapeAmount.toLocaleString() +
                        ' [~' + Math.round(100 * shapeAmount / this.amountOfPolygons) + '%]');
                }
                console.log('Палитра: ' + this.polygonPalette.length + ' цветов');
            }
            console.groupEnd();
            var bytesUsedByBuffers = this.buffers.sizeInBytes[0] + this.buffers.sizeInBytes[1] + this.buffers.sizeInBytes[2];
            console.group('Занято видеопамяти: ' + (bytesUsedByBuffers / 1000000).toFixed(2).toLocaleString() + ' МБ');
            {
                console.log('Буферы вершин: ' +
                    (this.buffers.sizeInBytes[0] / 1000000).toFixed(2).toLocaleString() + ' МБ' +
                    ' [~' + Math.round(100 * this.buffers.sizeInBytes[0] / bytesUsedByBuffers) + '%]');
                console.log('Буферы цветов: '
                    + (this.buffers.sizeInBytes[1] / 1000000).toFixed(2).toLocaleString() + ' МБ' +
                    ' [~' + Math.round(100 * this.buffers.sizeInBytes[1] / bytesUsedByBuffers) + '%]');
                console.log('Буферы индексов: '
                    + (this.buffers.sizeInBytes[2] / 1000000).toFixed(2).toLocaleString() + ' МБ' +
                    ' [~' + Math.round(100 * this.buffers.sizeInBytes[2] / bytesUsedByBuffers) + '%]');
            }
            console.groupEnd();
            console.log('Кол-во групп буферов: ' + this.buffers.amountOfBufferGroups.toLocaleString());
            console.log('Кол-во GL-треугольников: ' + (this.buffers.amountOfTotalGLVertices / 3).toLocaleString());
            console.log('Кол-во вершин: ' + this.buffers.amountOfTotalVertices.toLocaleString());
        }
        console.groupEnd();
    };
    /**
     * Создает дополнение к коду на языке GLSL.
     *
     * @remarks
     * В дальнейшем созданный код будет встроен в код вершинного шейдера для задания цвета вершины в зависимости от
     * индекса цвета, присвоенного этой вершине. Т.к. шейдер не позволяет использовать в качестве индексов переменные -
     * для задания цвета используется перебор цветовых индексов.
     *
     * @returns Код на языке GLSL.
     */
    SPlot.prototype.genShaderColorCode = function () {
        // Временное добавление в палитру цветов вершин цвета направляющих.
        this.polygonPalette.push(this.rulesColor);
        var code = '';
        for (var i = 0; i < this.polygonPalette.length; i++) {
            // Получение цвета в нужном формате.
            var _a = this.convertColor(this.polygonPalette[i]), r = _a[0], g = _a[1], b = _a[2];
            // Формировние строк GLSL-кода проверки индекса цвета.
            code += ((i === 0) ? '' : '  else ') + 'if (a_color == ' + i + '.0) v_color = vec3(' +
                r.toString().slice(0, 9) + ',' +
                g.toString().slice(0, 9) + ',' +
                b.toString().slice(0, 9) + ');\n';
        }
        // Удаление из палитры вершин временно добавленного цвета направляющих.
        this.polygonPalette.pop();
        return code;
    };
    /**
     * Конвертирует цвет из HEX-представления в представление цвета для GLSL-кода (RGB с диапазонами значений от 0 до 1).
     *
     * @param hexColor - Цвет в HEX-формате.
     * @returns Массив из трех чисел в диапазоне от 0 до 1.
     */
    SPlot.prototype.convertColor = function (hexColor) {
        var k = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor);
        var _a = [parseInt(k[1], 16) / 255, parseInt(k[2], 16) / 255, parseInt(k[3], 16) / 255], r = _a[0], g = _a[1], b = _a[2];
        return [r, g, b];
    };
    /**
     * Вычисляет текущее время.
     *
     * @returns Строковая форматированная запись текущего времени.
     */
    SPlot.prototype.getCurrentTime = function () {
        var today = new Date();
        var time = ((today.getHours() < 10 ? '0' : '') + today.getHours()) + ":" +
            ((today.getMinutes() < 10 ? '0' : '') + today.getMinutes()) + ":" +
            ((today.getSeconds() < 10 ? '0' : '') + today.getSeconds());
        return time;
    };
    /**
     * Обновляет матрицу трансформации.
     *
     * @remarks
     * Существует два варианта вызова метода - из другого метода экземпляра ({@link render}) и из обработчика события мыши
     * ({@link handleMouseWheel}). Во втором варианте использование объекта this невозможно. Для универсальности вызова
     * метода - в него всегда явно необходимо передавать ссылку на экземпляр класса.
     *
     * @param $this - Экземпляр класса, чью матрицу трансформации необходимо обновить.
     */
    SPlot.prototype.updateTransMatrix = function ($this) {
        var t1 = $this.camera.zoom * $this.USEFUL_CONSTS[5];
        var t2 = $this.camera.zoom * $this.USEFUL_CONSTS[6];
        $this.transormation.matrix = [
            t1, 0, 0, 0, -t2, 0, -$this.camera.x * t1 - 1, $this.camera.y * t2 + 1, 1
        ];
    };
    /**
     * Реагирует на движение мыши/трекпада в момент, когда ее/его клавиша удерживается нажатой.
     *
     * @remerks
     * Метод перемещает область видимости на плоскости вместе с движением мыши/трекпада. Вычисления внутри события сделаны
     * максимально производительными в ущерб читабельности логики действий. Во внешнем обработчике событий объект this
     * недоступен поэтому доступ к экземпляру класса реализуется через статический массив всех созданных экземпляров
     * класса и идентификатора канваса, выступающего индексом в этом массиве.
     *
     * @param event - Событие мыши/трекпада.
     */
    SPlot.prototype.handleMouseMove = function (event) {
        // Получение доступа к объекту this.
        var $this = SPlot.instances[event.target.id];
        $this.camera.x = $this.transormation.startCameraX + $this.transormation.startPosX -
            ((event.clientX - $this.USEFUL_CONSTS[9]) * $this.USEFUL_CONSTS[7] - 1) * $this.transormation.startInvMatrix[0] -
            $this.transormation.startInvMatrix[6];
        $this.camera.y = $this.transormation.startCameraY + $this.transormation.startPosY -
            ((event.clientY - $this.USEFUL_CONSTS[10]) * $this.USEFUL_CONSTS[8] + 1) * $this.transormation.startInvMatrix[4] -
            $this.transormation.startInvMatrix[7];
        // Рендеринг с обновленными параметрами трансформации.
        $this.render();
    };
    /**
     * Реагирует на нажатие клавиши мыши/трекпада.
     *
     * @remerks
     * В момент нажатия и удержания клавиши запускается анализ движения мыши/трекпада (с зажатой клавишей). Вычисления
     * внутри события сделаны максимально производительными в ущерб читабельности логики действий. Во внешнем обработчике
     * событий объект this недоступен поэтому доступ к экземпляру класса реализуется через статический массив всех
     * созданных экземпляров класса и идентификатора канваса, выступающего индексом в этом массиве.
     *
     * @param event - Событие мыши/трекпада.
     */
    SPlot.prototype.handleMouseDown = function (event) {
        event.preventDefault();
        // Получение доступа к объекту this.
        var $this = SPlot.instances[event.target.id];
        // Сразу после начала удержания клавиши запускется "прослушка" событий движения и отжатия клавиши.
        event.target.addEventListener('mousemove', $this.handleMouseMove);
        event.target.addEventListener('mouseup', $this.handleMouseUp);
        $this.transormation.startInvMatrix = [
            1 / $this.transormation.matrix[0], 0, 0, 0, 1 / $this.transormation.matrix[4],
            0, -$this.transormation.matrix[6] / $this.transormation.matrix[0],
            -$this.transormation.matrix[7] / $this.transormation.matrix[4], 1
        ];
        $this.transormation.startCameraX = $this.camera.x;
        $this.transormation.startCameraY = $this.camera.y;
        $this.transormation.startPosX =
            ((event.clientX - $this.USEFUL_CONSTS[9]) * $this.USEFUL_CONSTS[7] - 1) *
                $this.transormation.startInvMatrix[0] + $this.transormation.startInvMatrix[6];
        $this.transormation.startPosY =
            ((event.clientY - $this.USEFUL_CONSTS[10]) * $this.USEFUL_CONSTS[8] + 1) *
                $this.transormation.startInvMatrix[4] + $this.transormation.startInvMatrix[7];
    };
    /**
     * Реагирует на отжатие клавиши мыши/трекпада.
     *
     * @remerks
     * В момент отжатия клавиши анализ движения мыши/трекпада с зажатой клавишей прекращается. Вычисления внутри события
     * сделаны максимально производительными в ущерб читабельности логики действий. Во внешнем обработчике событий объект
     * this недоступен поэтому доступ к экземпляру класса реализуется через статический массив всех созданных экземпляров
     * класса и идентификатора канваса, выступающего индексом в этом массиве.
     *
     * @param event - Событие мыши/трекпада.
     */
    SPlot.prototype.handleMouseUp = function (event) {
        // Получение доступа к объекту this.
        var $this = SPlot.instances[event.target.id];
        // Сразу после отжатия клавиши "прослушка" событий движения и отжатия клавиши прекращаются.
        event.target.removeEventListener('mousemove', $this.handleMouseMove);
        event.target.removeEventListener('mouseup', $this.handleMouseUp);
    };
    /**
     * Реагирует на зумирование мыши/трекпада.
     *
     * @remerks
     * В момент зумирования мыши/трекпада происходит зумирование координатной плоскости. Вычисления внутри события
     * сделаны максимально производительными в ущерб читабельности логики действий. Во внешнем обработчике событий объект
     * this недоступен поэтому доступ к экземпляру класса реализуется через статический массив всех созданных экземпляров
     * класса и идентификатора канваса, выступающего индексом в этом массиве.
     *
     * @param event - Событие мыши/трекпада.
     */
    SPlot.prototype.handleMouseWheel = function (event) {
        event.preventDefault();
        // Получение доступа к объекту this.
        var $this = SPlot.instances[event.target.id];
        var clipX = (event.clientX - $this.USEFUL_CONSTS[9]) * $this.USEFUL_CONSTS[7] - 1;
        var clipY = (event.clientY - $this.USEFUL_CONSTS[10]) * $this.USEFUL_CONSTS[8] + 1;
        var preZoomX = (clipX - $this.transormation.matrix[6]) / $this.transormation.matrix[0];
        var preZoomY = (clipY - $this.transormation.matrix[7]) / $this.transormation.matrix[4];
        var newZoom = $this.camera.zoom * Math.pow(2, event.deltaY * -0.01);
        $this.camera.zoom = Math.max(0.002, Math.min(200, newZoom));
        $this.updateTransMatrix($this);
        var postZoomX = (clipX - $this.transormation.matrix[6]) / $this.transormation.matrix[0];
        var postZoomY = (clipY - $this.transormation.matrix[7]) / $this.transormation.matrix[4];
        $this.camera.x += (preZoomX - postZoomX);
        $this.camera.y += (preZoomY - postZoomY);
        // Рендеринг с обновленными параметрами трансформации.
        $this.render();
    };
    /**
     * Производит рендеринг графика в соответствии с текущими параметрами трансформации.
     */
    SPlot.prototype.render = function () {
        // Очистка объекта рендеринга WebGL.
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        // Обновление матрицы трансформации.
        this.updateTransMatrix(this);
        // Привязка матрицы трансформации к переменной шейдера.
        this.gl.uniformMatrix3fv(this.variables['u_matrix'], false, this.transormation.matrix);
        // Итерирование и рендеринг групп буферов WebGL.
        for (var i = 0; i < this.buffers.amountOfBufferGroups; i++) {
            // Установка текущего буфера вершин и его привязка к переменной шейдера.
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.vertexBuffers[i]);
            this.gl.enableVertexAttribArray(this.variables['a_position']);
            this.gl.vertexAttribPointer(this.variables['a_position'], 2, this.gl.FLOAT, false, 0, 0);
            // Установка текущего буфера цветов вершин и его привязка к переменной шейдера.
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.colorBuffers[i]);
            this.gl.enableVertexAttribArray(this.variables['a_color']);
            this.gl.vertexAttribPointer(this.variables['a_color'], 1, this.gl.UNSIGNED_BYTE, false, 0, 0);
            // Установка текущего буфера индексов вершин.
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffers.indexBuffers[i]);
            // Рендеринг текущей группы буферов.
            this.gl.drawElements(this.gl.TRIANGLES, this.buffers.amountOfGLVertices[i], this.gl.UNSIGNED_SHORT, 0);
        }
    };
    /**
     * Случайным образом возвращает один из индексов числового одномерного массива. Несмотря на случайность каждого
     * конкретного вызова функции, индексы возвращаются с предопределенной частотой. Частота "выпаданий" индексов задается
     * соответствующими значениями элементов.
     *
     * @remarks
     * Пример: На массиве [3, 2, 5] функция будет возвращать индекс 0 с частотой = 3/(3+2+5) = 3/10, индекс 1 с частотой =
     * 2/(3+2+5) = 2/10, индекс 2 с частотой = 5/(3+2+5) = 5/10.
     *
     * @param arr - Числовой одномерный массив, индексы которого будут возвращаться с предопределенной частотой.
     * @returns Случайный индекс из массива arr.
     */
    SPlot.prototype.randomQuotaIndex = function (arr) {
        var a = [];
        a[0] = arr[0];
        for (var i = 1; i < arr.length; i++) {
            a[i] = a[i - 1] + arr[i];
        }
        var lastIndex = a.length - 1;
        var r = Math.floor((Math.random() * a[lastIndex])) + 1;
        var l = 0;
        var h = lastIndex;
        while (l < h) {
            var m = l + ((h - l) >> 1);
            (r > a[m]) ? (l = m + 1) : (h = m);
        }
        return (a[l] >= r) ? l : -1;
    };
    /**
     * Метод имитации итерирования исходных объектов. При каждом новом вызове возвращает информацию о полигоне со случаным
     * положением, случайной формой и случайным цветом.
     *
     * @returns Информация о полигоне или null, если перебор исходных объектов закончился.
     */
    SPlot.prototype.demoIterationCallback = function () {
        if (this.demoMode.index < this.demoMode.amount) {
            this.demoMode.index++;
            return {
                x: randomInt(this.gridSize.width),
                y: randomInt(this.gridSize.height),
                shape: this.randomQuotaIndex(this.demoMode.shapeQuota),
                color: randomInt(this.polygonPalette.length)
            };
        }
        else
            return null;
    };
    /**
     * Запускает рендеринг и "прослушку" событий мыши на канвасе.
     *
     * @public
     */
    SPlot.prototype.run = function () {
        if (!this.isRunning) {
            this.canvas.addEventListener('mousedown', this.handleMouseDown);
            this.canvas.addEventListener('wheel', this.handleMouseWheel);
            this.render();
            this.isRunning = true;
        }
        // Вывод отладочной информации.
        if (this.debugMode.isEnable) {
            console.log('%cРендеринг запущен', this.debugStyle);
        }
    };
    /**
     * Останавливает рендеринг и "прослушку" событий мыши на канвасе.
     *
     * @public
     * @param {boolean} clear Признак неообходимости вместе с остановкой рендеринга
     *     очистить канвас. Значение true очищает канвас, значение false - не очищает.
     *     По умолчанию очистка не происходит.
     */
    SPlot.prototype.stop = function (clear) {
        if (clear === void 0) { clear = false; }
        if (this.isRunning) {
            this.canvas.removeEventListener('mousedown', this.handleMouseDown);
            this.canvas.removeEventListener('wheel', this.handleMouseWheel);
            this.canvas.removeEventListener('mousemove', this.handleMouseMove);
            this.canvas.removeEventListener('mouseup', this.handleMouseUp);
            if (clear) {
                this.clear();
            }
            this.isRunning = false;
        }
        // Вывод отладочной информации.
        if (this.debugMode.isEnable) {
            console.log('%cРендеринг остановлен', this.debugStyle);
        }
    };
    /**
     * Очищает канвас, закрашивая его в фоновый цвет.
     *
     * @public
     */
    SPlot.prototype.clear = function () {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        // Вывод отладочной информации.
        if (this.debugMode.isEnable) {
            console.log('%cКонтекст рендеринга очищен [' + this.bgColor + ']', this.debugStyle);
        }
    };
    SPlot.instances = {};
    return SPlot;
}());
exports.default = SPlot;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./index.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zdHlsZS5jc3M/YzRkMiIsIndlYnBhY2s6Ly8vLi9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9zcGxvdC50cyIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svc3RhcnR1cCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0FDQUEsZ0ZBQTJCO0FBQzNCLGtEQUFnQjtBQUVoQixTQUFTLFNBQVMsQ0FBQyxLQUFhO0lBQzlCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsS0FBSyxDQUFDO0FBQzFDLENBQUM7QUFFRCxJQUFJLENBQUMsR0FBRyxDQUFDO0FBQ1QsSUFBSSxDQUFDLEdBQUcsT0FBUyxFQUFFLDhCQUE4QjtBQUNqRCxJQUFJLE9BQU8sR0FBRyxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQztBQUM1SCxJQUFJLFNBQVMsR0FBRyxLQUFNO0FBQ3RCLElBQUksVUFBVSxHQUFHLEtBQU07QUFFdkIsZ0hBQWdIO0FBQ2hILFNBQVMsY0FBYztJQUNyQixJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDVCxDQUFDLEVBQUU7UUFDSCxPQUFPO1lBQ0wsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxTQUFTLENBQUM7WUFDdkIsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxVQUFVLENBQUM7WUFDeEIsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDbkIsS0FBSyxFQUFFLFNBQVMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUcsZ0NBQWdDO1NBQ3BFO0tBQ0Y7O1FB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OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQSxzREFBc0Qsa0JBQWtCO1dBQ3hFO1dBQ0EsK0NBQStDLGNBQWM7V0FDN0QsRTs7Ozs7VUNOQTtVQUNBO1VBQ0E7VUFDQSIsImZpbGUiOiJzY3JpcHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCJpbXBvcnQgU1Bsb3QgZnJvbSAnLi9zcGxvdCdcbmltcG9ydCAnQC9zdHlsZSdcblxuZnVuY3Rpb24gcmFuZG9tSW50KHJhbmdlOiBudW1iZXIpIHtcbiAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHJhbmdlKVxufVxuXG5sZXQgaSA9IDBcbmxldCBuID0gMV8wMDBfMDAwICAvLyDQmNC80LjRgtC40YDRg9C10LzQvtC1INGH0LjRgdC70L4g0L7QsdGK0LXQutGC0L7Qsi5cbmxldCBwYWxldHRlID0gWycjRkYwMEZGJywgJyM4MDAwODAnLCAnI0ZGMDAwMCcsICcjODAwMDAwJywgJyNGRkZGMDAnLCAnIzAwRkYwMCcsICcjMDA4MDAwJywgJyMwMEZGRkYnLCAnIzAwMDBGRicsICcjMDAwMDgwJ11cbmxldCBwbG90V2lkdGggPSAzMl8wMDBcbmxldCBwbG90SGVpZ2h0ID0gMTZfMDAwXG5cbi8vINCf0YDQuNC80LXRgCDQuNGC0LXRgNC40YDRg9GO0YnQtdC5INGE0YPQvdC60YbQuNC4LiDQmNGC0LXRgNCw0YbQuNC4INC40LzQuNGC0LjRgNGD0Y7RgtGB0Y8g0YHQu9GD0YfQsNC50L3Ri9C80Lgg0LLRi9C00LDRh9Cw0LzQuC4g0J/QvtGH0YLQuCDRgtCw0LrQttC1INGA0LDQsdC+0YLQsNC10YIg0YDQtdC20LjQvCDQtNC10LzQvi3QtNCw0L3QvdGL0YUuXG5mdW5jdGlvbiByZWFkTmV4dE9iamVjdCgpIHtcbiAgaWYgKGkgPCBuKSB7XG4gICAgaSsrXG4gICAgcmV0dXJuIHtcbiAgICAgIHg6IHJhbmRvbUludChwbG90V2lkdGgpLFxuICAgICAgeTogcmFuZG9tSW50KHBsb3RIZWlnaHQpLFxuICAgICAgc2hhcGU6IHJhbmRvbUludCgzKSwgICAgICAgICAgICAgICAvLyAwIC0g0YLRgNC10YPQs9C+0LvRjNC90LjQuiwgMSAtINC60LLQsNC00YDQsNGCLCAyIC0g0LrRgNGD0LNcbiAgICAgIGNvbG9yOiByYW5kb21JbnQocGFsZXR0ZS5sZW5ndGgpLCAgLy8g0JjQvdC00LXQutGBINGG0LLQtdGC0LAg0LIg0LzQsNGB0YHQuNCy0LUg0YbQstC10YLQvtCyXG4gICAgfVxuICB9XG4gIGVsc2VcbiAgICByZXR1cm4gbnVsbCAgLy8g0JLQvtC30LLRgNCw0YnQsNC10LwgbnVsbCwg0LrQvtCz0LTQsCDQvtCx0YrQtdC60YLRiyBcItC30LDQutC+0L3Rh9C40LvQuNGB0YxcIlxufVxuXG4vKiogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICoqL1xuXG5sZXQgc2NhdHRlclBsb3QgPSBuZXcgU1Bsb3QoJ2NhbnZhczEnKVxuXG4vLyDQndCw0YHRgtGA0L7QudC60LAg0Y3QutC30LXQvNC/0LvRj9GA0LAg0L3QsCDRgNC10LbQuNC8INCy0YvQstC+0LTQsCDQvtGC0LvQsNC00L7Rh9C90L7QuSDQuNC90YTQvtGA0LzQsNGG0LjQuCDQsiDQutC+0L3RgdC+0LvRjCDQsdGA0LDRg9C30LXRgNCwLlxuLy8g0JTRgNGD0LPQuNC1INC/0YDQuNC80LXRgNGLINGA0LDQsdC+0YLRiyDQvtC/0LjRgdCw0L3RiyDQsiDRhNCw0LnQu9C1IHNwbG90LmpzINGB0L4g0YHRgtGA0L7QutC4IDIxNC5cbnNjYXR0ZXJQbG90LnNldHVwKHtcbiAgaXRlcmF0aW9uQ2FsbGJhY2s6IHJlYWROZXh0T2JqZWN0LFxuICBwb2x5Z29uUGFsZXR0ZTogcGFsZXR0ZSxcbiAgZ3JpZFNpemU6IHtcbiAgICB3aWR0aDogcGxvdFdpZHRoLFxuICAgIGhlaWdodDogcGxvdEhlaWdodCxcbiAgfSxcbiAgZGVidWdNb2RlOiB7XG4gICAgaXNFbmFibGU6IHRydWUsXG4gIH0sXG4gIGRlbW9Nb2RlOiB7XG4gICAgaXNFbmFibGU6IHRydWUsXG4gIH0sXG59KVxuXG5zY2F0dGVyUGxvdC5ydW4oKVxuIiwiXG5mdW5jdGlvbiBpc09iamVjdCh2YWw6IGFueSkge1xuICByZXR1cm4gKHZhbCBpbnN0YW5jZW9mIE9iamVjdCkgJiYgKHZhbC5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0KVxufVxuXG4vKipcbiAqINCT0LXQvdC10YDQuNGA0YPQtdGCINGB0LvRg9GH0LDQudC90L7QtSDRhtC10LvQvtC1INGH0LjRgdC70L4g0LIg0LTQuNCw0L/QsNC30L7QvdC1INC+0YIgMCDQtNC+INC30LDQtNCw0L3QvdC+0LPQviDQv9GA0LXQtNC10LvQsC4g0KHQsNC8XG4gKiDQv9GA0LXQtNC10Lsg0LIg0LTQuNCw0L/QsNC30L7QvSDQvdC1INCy0YXQvtC00LjRgjogWzAuLi5yYW5nZS0xXS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtudW1iZXJ9IHJhbmdlINCS0LXRgNGF0L3QuNC5INC/0YDQtdC00LXQuyDQtNC40LDQv9Cw0LfQvtC90LAg0YHQu9GD0YfQsNC50L3QvtCz0L4g0LLRi9Cx0L7RgNCwLlxuICogQHJldHVybiB7bnVtYmVyfSDQodCz0LXQvdC10YDQuNGA0L7QstCw0L3QvdC+0LUg0YHQu9GD0YfQsNC50L3QvtC1INGH0LjRgdC70L4uXG4gKi9cbmZ1bmN0aW9uIHJhbmRvbUludChyYW5nZTogbnVtYmVyKSB7XG4gIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiByYW5nZSk7XG59XG5cbnR5cGUgU1Bsb3RDYWxjU2hhcGVGdW5jID0gKHg6IG51bWJlciwgeTogbnVtYmVyLCBjb25zdHM6IEFycmF5PGFueT4pID0+IFNQbG90UG9seWdvblZlcnRpY2VzXG5cbi8qKlxuICog0KbQstC10YIg0LIgSEVYLdGE0L7RgNC80LDRgtC1LlxuICovXG50eXBlIEhFWENvbG9yID0gc3RyaW5nXG5cbi8qKlxuICog0KTRg9C90LrRhtC40Y8g0LjRgtC10YDQuNGA0L7QstCw0L3QuNGPINC80LDRgdGB0LjQstCwINC40YHRhdC+0LTQvdGL0YUg0L7QsdGK0LXQutGC0L7Qsi4g0JrQsNC20LTRi9C5INCy0YvQt9C+0LIg0YLQsNC60L7QuSDRhNGD0L3QutGG0LjQuFxuICog0LTQvtC70LbQtdC9INCy0L7Qt9Cy0YDQsNGJ0LDRgtGMINC40L3RhNC+0YDQvNCw0YbQuNGOINC+0LEg0L7Rh9C10YDQtdC00L3QvtC8INC/0L7Qu9C40LPQvtC90LUsINC60L7RgtC+0YDRi9C5INC90LXQvtCx0YXQvtC00LjQvNC+XG4gKiDQvtGC0L7QsdGA0LDQt9C40YLRjCAo0LXQs9C+INC60L7QvtGA0LTQuNC90LDRgtGLLCDRhNC+0YDQvNGDINC4INGG0LLQtdGCKS4g0JrQvtCz0LTQsCDQuNGB0YXQvtC00L3Ri9C1INC+0LHRitC10LrRgtGLINC30LDQutC+0L3Rh9Cw0YLRgdGPXG4gKiDRhNGD0L3QutGG0LjRjyDQtNC+0LvQttC90LAg0LLQtdGA0L3Rg9GC0YwgbnVsbC5cbiAqL1xudHlwZSBTUGxvdEl0ZXJhdGlvbkZ1bmN0aW9uID0gKCkgPT4gU1Bsb3RQb2x5Z29uIHwgbnVsbFxuXG50eXBlIFNQbG90RGVidWdPdXRwdXQgPSAnY29uc29sZScgfCAnZG9jdW1lbnQnIHwgJ2ZpbGUnXG5cbnR5cGUgV2ViR2xTaGFkZXJUeXBlID0gJ1ZFUlRFWF9TSEFERVInIHwgJ0ZSQUdNRU5UX1NIQURFUidcblxudHlwZSBXZWJHbEJ1ZmZlclR5cGUgPSAnQVJSQVlfQlVGRkVSJyB8ICdFTEVNRU5UX0FSUkFZX0JVRkZFUidcblxudHlwZSBXZWJHbFZhcmlhYmxlVHlwZSA9ICd1bmlmb3JtJyB8ICdhdHRyaWJ1dGUnXG5cbnR5cGUgVHlwZWRBcnJheSA9IEludDhBcnJheSB8IEludDE2QXJyYXkgfCBJbnQzMkFycmF5IHwgVWludDhBcnJheSB8IFVpbnQxNkFycmF5IHwgVWludDMyQXJyYXkgfCBGbG9hdDMyQXJyYXkgfCBGbG9hdDY0QXJyYXlcblxudHlwZSBTUGxvdFdlYkdsVmFyaWFibGVzID0ge1xuICBuYW1lOiBzdHJpbmcsXG4gIHR5cGU6IFdlYkdsVmFyaWFibGVUeXBlLFxuICB2YWx1ZTogV2ViR0xVbmlmb3JtTG9jYXRpb24gfCBHTGludFxufVxuXG5pbnRlcmZhY2UgU1Bsb3RPcHRpb25zIHtcbiAgaXRlcmF0aW9uQ2FsbGJhY2s/OiBTUGxvdEl0ZXJhdGlvbkZ1bmN0aW9uLFxuICBwb2x5Z29uUGFsZXR0ZT86IEhFWENvbG9yW10sXG4gIGdyaWRTaXplPzogU1Bsb3RHcmlkU2l6ZSxcbiAgcG9seWdvblNpemU/OiBudW1iZXIsXG4gIGNpcmNsZUFwcHJveExldmVsPzogbnVtYmVyLFxuICBkZWJ1Z01vZGU/OiBTUGxvdERlYnVnTW9kZSxcbiAgZGVtb01vZGU/OiBTUGxvdERlbW9Nb2RlLFxuICBmb3JjZVJ1bj86IGJvb2xlYW4sXG4gIG1heEFtb3VudE9mUG9seWdvbnM/OiBudW1iZXIsXG4gIGJnQ29sb3I/OiBIRVhDb2xvcixcbiAgcnVsZXNDb2xvcj86IEhFWENvbG9yLFxuICBjYW1lcmE/OiBTUGxvdENhbWVyYSxcbiAgd2ViR2xTZXR0aW5ncz86IFdlYkdMQ29udGV4dEF0dHJpYnV0ZXNcbn1cblxuaW50ZXJmYWNlIFNQbG90UG9seWdvbiB7XG4gIHg6IG51bWJlcixcbiAgeTogbnVtYmVyLFxuICBzaGFwZTogbnVtYmVyLFxuICBjb2xvcjogbnVtYmVyXG59XG5cbmludGVyZmFjZSBTUGxvdEdyaWRTaXplIHtcbiAgd2lkdGg6IG51bWJlcixcbiAgaGVpZ2h0OiBudW1iZXJcbn1cblxuaW50ZXJmYWNlIFNQbG90RGVidWdNb2RlIHtcbiAgaXNFbmFibGU/OiBib29sZWFuLFxuICBvdXRwdXQ/OiBTUGxvdERlYnVnT3V0cHV0XG59XG5cbmludGVyZmFjZSBTUGxvdERlbW9Nb2RlIHtcbiAgaXNFbmFibGU/OiBib29sZWFuLFxuICBhbW91bnQ/OiBudW1iZXIsXG4gIHNoYXBlUXVvdGE/OiBudW1iZXJbXSxcbiAgaW5kZXg/OiBudW1iZXJcbn1cblxuaW50ZXJmYWNlIFNQbG90Q2FtZXJhIHtcbiAgeDogbnVtYmVyLFxuICB5OiBudW1iZXIsXG4gIHpvb206IG51bWJlclxufVxuXG5pbnRlcmZhY2UgU1Bsb3RUcmFuc2Zvcm1hdGlvbiB7XG4gIG1hdHJpeDogbnVtYmVyW10sXG4gIHN0YXJ0SW52TWF0cml4OiBudW1iZXJbXSxcbiAgc3RhcnRDYW1lcmFYOiBudW1iZXIsXG4gIHN0YXJ0Q2FtZXJhWTogbnVtYmVyLFxuICBzdGFydFBvc1g6IG51bWJlcixcbiAgc3RhcnRQb3NZOiBudW1iZXJcbn1cblxuaW50ZXJmYWNlIFNQbG90QnVmZmVycyB7XG4gIHZlcnRleEJ1ZmZlcnM6IFdlYkdMQnVmZmVyW10sXG4gIGNvbG9yQnVmZmVyczogV2ViR0xCdWZmZXJbXSxcbiAgaW5kZXhCdWZmZXJzOiBXZWJHTEJ1ZmZlcltdLFxuICBhbW91bnRPZkdMVmVydGljZXM6IG51bWJlcltdLFxuICBhbW91bnRPZlNoYXBlczogbnVtYmVyW10sXG4gIGFtb3VudE9mQnVmZmVyR3JvdXBzOiBudW1iZXIsXG4gIGFtb3VudE9mVG90YWxWZXJ0aWNlczogbnVtYmVyLFxuICBhbW91bnRPZlRvdGFsR0xWZXJ0aWNlczogbnVtYmVyLFxuICBzaXplSW5CeXRlczogbnVtYmVyW11cbn1cblxuaW50ZXJmYWNlIFNQbG90UG9seWdvbkdyb3VwIHtcbiAgdmVydGljZXM6IG51bWJlcltdLFxuICBpbmRpY2VzOiBudW1iZXJbXSxcbiAgY29sb3JzOiBudW1iZXJbXSxcbiAgYW1vdW50T2ZWZXJ0aWNlczogbnVtYmVyLFxuICBhbW91bnRPZkdMVmVydGljZXM6IG51bWJlclxufVxuXG5pbnRlcmZhY2UgU1Bsb3RQb2x5Z29uVmVydGljZXMge1xuICB2YWx1ZXM6IG51bWJlcltdLFxuICBpbmRpY2VzOiBudW1iZXJbXVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTUGxvdCB7XG5cbiAgcHVibGljIHN0YXRpYyBpbnN0YW5jZXM6IHsgW2tleTogc3RyaW5nXTogU1Bsb3QgfSA9IHt9XG5cbiAgcHVibGljIGl0ZXJhdGlvbkNhbGxiYWNrPzogU1Bsb3RJdGVyYXRpb25GdW5jdGlvblxuXG4gIHB1YmxpYyBwb2x5Z29uUGFsZXR0ZTogSEVYQ29sb3JbXSA9IFtcbiAgICAnI0ZGMDBGRicsICcjODAwMDgwJywgJyNGRjAwMDAnLCAnIzgwMDAwMCcsICcjRkZGRjAwJyxcbiAgICAnIzAwRkYwMCcsICcjMDA4MDAwJywgJyMwMEZGRkYnLCAnIzAwMDBGRicsICcjMDAwMDgwJ1xuICBdXG5cbiAgcHVibGljIGdyaWRTaXplOiBTUGxvdEdyaWRTaXplID0ge1xuICAgIHdpZHRoOiAzMl8wMDAsXG4gICAgaGVpZ2h0OiAxNl8wMDBcbiAgfVxuXG4gIHB1YmxpYyBwb2x5Z29uU2l6ZTogbnVtYmVyID0gMjBcblxuICBwdWJsaWMgY2lyY2xlQXBwcm94TGV2ZWw6IG51bWJlciA9IDEyXG5cbiAgcHVibGljIGRlYnVnTW9kZTogU1Bsb3REZWJ1Z01vZGUgPSB7XG4gICAgaXNFbmFibGU6IGZhbHNlLFxuICAgIG91dHB1dDogJ2NvbnNvbGUnXG4gIH1cblxuICBwdWJsaWMgZGVtb01vZGU6IFNQbG90RGVtb01vZGUgPSB7XG4gICAgaXNFbmFibGU6IGZhbHNlLFxuICAgIGFtb3VudDogMV8wMDBfMDAwLFxuICAgIC8qKlxuICAgICAqINCf0L4g0YPQvNC+0LvRh9Cw0L3QuNGOINCyINGA0LXQttC40LzQtSDQtNC10LzQvi3QtNCw0L3QvdGL0YUg0LHRg9C00YPRgiDQv9C+0YDQvtCy0L3RgyDQvtGC0L7QsdGA0LDQttCw0YLRjNGB0Y9cbiAgICAgKiDQv9C+0LvQuNCz0L7QvdGLINCy0YHQtdGFINCy0L7Qt9C80L7QttC90YvRhSDRhNC+0YDQvC4g0KHQvtC+0YLQstC10YLRgdGC0LLRg9GO0YnQuNC1INC30L3QsNGH0LXQvdC40Y8gc2hhcGVRdW90YVxuICAgICAqINC40L3QuNGG0LjQsNC70LjQt9C40YDRg9GO0YLRgdGPINC/0YDQuCDRgNC10LPQuNGB0YLRgNCw0YbQuNC4INGE0YPQvdC60YbQuNC5INGB0L7Qt9C00LDQvdC40Y8g0YTQvtGA0LwgKNC90LjQttC1INC/0L4g0LrQvtC00YMpLlxuICAgICAqL1xuICAgIHNoYXBlUXVvdGE6IFtdLFxuICAgIGluZGV4OiAwXG4gIH1cblxuICBwdWJsaWMgZm9yY2VSdW46IGJvb2xlYW4gPSBmYWxzZVxuXG4gIHB1YmxpYyBtYXhBbW91bnRPZlBvbHlnb25zOiBudW1iZXIgPSAxXzAwMF8wMDBfMDAwXG5cbiAgcHVibGljIGJnQ29sb3I6IEhFWENvbG9yID0gJyNmZmZmZmYnXG5cbiAgcHVibGljIHJ1bGVzQ29sb3I6IEhFWENvbG9yID0gJyNjMGMwYzAnXG5cbiAgcHVibGljIGNhbWVyYTogU1Bsb3RDYW1lcmEgPSB7XG4gICAgeDogdGhpcy5ncmlkU2l6ZS53aWR0aCAvIDIsXG4gICAgeTogdGhpcy5ncmlkU2l6ZS5oZWlnaHQgLyAyLFxuICAgIHpvb206IDFcbiAgfVxuXG4gIHB1YmxpYyB3ZWJHbFNldHRpbmdzOiBXZWJHTENvbnRleHRBdHRyaWJ1dGVzID0ge1xuICAgIGFscGhhOiBmYWxzZSxcbiAgICBkZXB0aDogZmFsc2UsXG4gICAgc3RlbmNpbDogZmFsc2UsXG4gICAgYW50aWFsaWFzOiBmYWxzZSxcbiAgICBwcmVtdWx0aXBsaWVkQWxwaGE6IGZhbHNlLFxuICAgIHByZXNlcnZlRHJhd2luZ0J1ZmZlcjogZmFsc2UsXG4gICAgcG93ZXJQcmVmZXJlbmNlOiAnaGlnaC1wZXJmb3JtYW5jZScsXG4gICAgZmFpbElmTWFqb3JQZXJmb3JtYW5jZUNhdmVhdDogZmFsc2UsXG4gICAgZGVzeW5jaHJvbml6ZWQ6IGZhbHNlXG4gIH1cblxuICBwcm90ZWN0ZWQgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudFxuXG4gIHByb3RlY3RlZCBnbCE6IFdlYkdMUmVuZGVyaW5nQ29udGV4dFxuXG4gIHByb3RlY3RlZCB2YXJpYWJsZXM6IHsgW2tleTogc3RyaW5nXTogYW55IH0gPSB7fVxuXG4gIHByb3RlY3RlZCBfdmVydGV4U2hhZGVyQ29kZVRlbXBsYXRlOiBzdHJpbmcgPVxuICAgICdhdHRyaWJ1dGUgdmVjMiBhX3Bvc2l0aW9uO1xcbicgK1xuICAgICdhdHRyaWJ1dGUgZmxvYXQgYV9jb2xvcjtcXG4nICtcbiAgICAndW5pZm9ybSBtYXQzIHVfbWF0cml4O1xcbicgK1xuICAgICd2YXJ5aW5nIHZlYzMgdl9jb2xvcjtcXG4nICtcbiAgICAndm9pZCBtYWluKCkge1xcbicgK1xuICAgICcgIGdsX1Bvc2l0aW9uID0gdmVjNCgodV9tYXRyaXggKiB2ZWMzKGFfcG9zaXRpb24sIDEpKS54eSwgMC4wLCAxLjApO1xcbicgK1xuICAgICcgIFNFVC1WRVJURVgtQ09MT1ItQ09ERScgK1xuICAgICd9XFxuJ1xuXG4gIHByb3RlY3RlZCBmcmFnbWVudFNoYWRlckNvZGVUZW1wbGF0ZTogc3RyaW5nID1cbiAgICAncHJlY2lzaW9uIGxvd3AgZmxvYXQ7XFxuJyArXG4gICAgJ3ZhcnlpbmcgdmVjMyB2X2NvbG9yO1xcbicgK1xuICAgICd2b2lkIG1haW4oKSB7XFxuJyArXG4gICAgJyAgZ2xfRnJhZ0NvbG9yID0gdmVjNCh2X2NvbG9yLnJnYiwgMS4wKTtcXG4nICtcbiAgICAnfVxcbidcblxuICBwcm90ZWN0ZWQgYW1vdW50T2ZQb2x5Z29uczogbnVtYmVyID0gMFxuXG4gIHByb3RlY3RlZCBkZWJ1Z1N0eWxlOiBzdHJpbmcgPSAnZm9udC13ZWlnaHQ6IGJvbGQ7IGNvbG9yOiAjZmZmZmZmOydcblxuICBwcm90ZWN0ZWQgVVNFRlVMX0NPTlNUUzogYW55W10gPSBbXVxuXG4gIHByb3RlY3RlZCBpc1J1bm5pbmc6IGJvb2xlYW4gPSBmYWxzZVxuXG4gIHByb3RlY3RlZCB0cmFuc29ybWF0aW9uOiBTUGxvdFRyYW5zZm9ybWF0aW9uID0ge1xuICAgIG1hdHJpeDogW10sXG4gICAgc3RhcnRJbnZNYXRyaXg6IFtdLFxuICAgIHN0YXJ0Q2FtZXJhWDogMCxcbiAgICBzdGFydENhbWVyYVk6IDAsXG4gICAgc3RhcnRQb3NYOiAwLFxuICAgIHN0YXJ0UG9zWTogMFxuICB9XG5cbiAgcHJvdGVjdGVkIG1heEFtb3VudE9mVmVydGV4UGVyUG9seWdvbkdyb3VwOiBudW1iZXIgPSAzMjc2OCAtICh0aGlzLmNpcmNsZUFwcHJveExldmVsICsgMSk7XG5cbiAgcHJvdGVjdGVkIGJ1ZmZlcnM6IFNQbG90QnVmZmVycyA9IHtcbiAgICB2ZXJ0ZXhCdWZmZXJzOiBbXSxcbiAgICBjb2xvckJ1ZmZlcnM6IFtdLFxuICAgIGluZGV4QnVmZmVyczogW10sXG4gICAgYW1vdW50T2ZHTFZlcnRpY2VzOiBbXSxcbiAgICBhbW91bnRPZlNoYXBlczogW10sXG4gICAgYW1vdW50T2ZCdWZmZXJHcm91cHM6IDAsXG4gICAgYW1vdW50T2ZUb3RhbFZlcnRpY2VzOiAwLFxuICAgIGFtb3VudE9mVG90YWxHTFZlcnRpY2VzOiAwLFxuICAgIHNpemVJbkJ5dGVzOiBbMCwgMCwgMF1cbiAgfVxuXG4gIHByb3RlY3RlZCBzaGFwZXM6IHtjYWxjOiBTUGxvdENhbGNTaGFwZUZ1bmMsIG5hbWU6IHN0cmluZ31bXSA9IFtdXG5cbiAgcHJvdGVjdGVkIGdwdVByb2dyYW0hOiBXZWJHTFByb2dyYW1cblxuICAvKipcbiAgICog0KHQvtC30LTQsNC10YIg0Y3QutC30LXQvNC/0LvRj9GAINC60LvQsNGB0YHQsCwg0LjQvdC40YbQuNCw0LvQuNC30LjRgNGD0LXRgiDQvdCw0YHRgtGA0L7QudC60LguXG4gICAqXG4gICAqIEByZW1hcmtzXG4gICAqINCV0YHQu9C4INC60LDQvdCy0LDRgSDRgSDQt9Cw0LTQsNC90L3Ri9C8INC40LTQtdC90YLQuNGE0LjQutCw0YLQvtGA0L7QvCDQvdC1INC90LDQudC00LXQvSAtINCz0LXQvdC10YDQuNGA0YPQtdGC0YHRjyDQvtGI0LjQsdC60LAuINCd0LDRgdGC0YDQvtC50LrQuCDQvNC+0LPRg9GCINCx0YvRgtGMINC30LDQtNCw0L3RiyDQutCw0Log0LJcbiAgICog0LrQvtC90YHRgtGA0YPQutGC0L7RgNC1LCDRgtCw0Log0Lgg0LIg0LzQtdGC0L7QtNC1IHtAbGluayBzZXR1cH0uINCe0LTQvdCw0LrQviDQsiDQu9GO0LHQvtC8INGB0LvRg9GH0LDQtSDQvdCw0YHRgtGA0L7QudC60Lgg0LTQvtC70LbQvdGLINCx0YvRgtGMINC30LDQtNCw0L3RiyDQtNC+INC30LDQv9GD0YHQutCwINGA0LXQvdC00LXRgNCwLlxuICAgKlxuICAgKiBAcGFyYW0gY2FudmFzSWQgLSDQmNC00LXQvdGC0LjRhNC40LrQsNGC0L7RgCDQutCw0L3QstCw0YHQsCwg0L3QsCDQutC+0YLQvtGA0L7QvCDQsdGD0LTQtdGCINGA0LjRgdC+0LLQsNGC0YzRgdGPINCz0YDQsNGE0LjQui5cbiAgICogQHBhcmFtIG9wdGlvbnMgLSDQn9C+0LvRjNC30L7QstCw0YLQtdC70YzRgdC60LjQtSDQvdCw0YHRgtGA0L7QudC60Lgg0Y3QutC30LXQvNC/0LvRj9GA0LAuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihjYW52YXNJZDogc3RyaW5nLCBvcHRpb25zPzogU1Bsb3RPcHRpb25zKSB7XG5cbiAgICAvLyDQodC+0YXRgNCw0L3QtdC90LjQtSDRgdGB0YvQu9C60Lgg0L3QsCDRjdC60LfQtdC80L/Qu9GP0YAg0LrQu9Cw0YHRgdCwLiDQn9C+0LfQstC+0LvRj9C10YIg0LLQvdC10YjQuNC8INGB0L7QsdGL0YLQuNGP0Lwg0L/QvtC70YPRh9Cw0YLRjCDQtNC+0YHRgtGD0L8g0Log0L/QvtC70Y/QvCDQuCDQvNC10YLQvtC00LDQvCDRjdC60LfQtdC80L/Qu9GP0YDQsC5cbiAgICBTUGxvdC5pbnN0YW5jZXNbY2FudmFzSWRdID0gdGhpc1xuXG4gICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNhbnZhc0lkKSkge1xuICAgICAgdGhpcy5jYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChjYW52YXNJZCkgYXMgSFRNTENhbnZhc0VsZW1lbnRcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCfQmtCw0L3QstCw0YEg0YEg0LjQtNC10L3RgtC40YTQuNC60LDRgtC+0YDQvtC8IFwiIycgKyBjYW52YXNJZCArIMKgJ1wiINC90LUg0L3QsNC50LTQtdC9IScpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog0KDQtdCz0LjRgdGC0YDQsNGG0LjRjyDRgtGA0LXRhSDQsdCw0LfQvtCy0YvRhSDRhNC+0YDQvCDQv9C+0LvQuNCz0L7QvdC+0LIgKNGC0YDQtdGD0LPQvtC70YzQvdC40LrQuCwg0LrQstCw0LTRgNCw0YLRiyDQuCDQutGA0YPQs9C4KS4g0J3QsNC70LjRh9C40LUg0Y3RgtC40YUg0YTQvtGA0Lwg0LIg0YPQutCw0LfQsNC90L3QvtC8INC/0L7RgNGP0LTQutC1XG4gICAgICog0Y/QstC70Y/QtdGC0YHRjyDQvtCx0Y/Qt9Cw0YLQtdC70YzQvdGL0Lwg0LTQu9GPINC60L7RgNGA0LXQutGC0L3QvtC5INGA0LDQsdC+0YLRiyDQv9GA0LjQu9C+0LbQtdC90LjRjy4g0JTRgNGD0LPQuNC1INGE0L7RgNC80Ysg0LzQvtCz0YPRgiDRgNC10LPQuNGB0YLRgNC40YDQvtCy0LDRgtGM0Y8g0LIg0LvRjtCx0L7QvCDQutC+0LvQuNGH0LXRgdGC0LLQtSwg0LJcbiAgICAgKiDQu9GO0LHQvtC5INC/0L7RgdC70LXQtNC+0LLQsNGC0LXQu9GM0L3QvtGB0YLQuC5cbiAgICAgKi9cbiAgICB0aGlzLnJlZ2lzdGVyU2hhcGUodGhpcy5nZXRWZXJ0aWNlc09mVHJpYW5nbGUsICfQotGA0LXRg9Cz0L7Qu9GM0L3QuNC6JylcbiAgICB0aGlzLnJlZ2lzdGVyU2hhcGUodGhpcy5nZXRWZXJ0aWNlc09mU3F1YXJlLCAn0JrQstCw0LTRgNCw0YInKVxuICAgIHRoaXMucmVnaXN0ZXJTaGFwZSh0aGlzLmdldFZlcnRpY2VzT2ZDaXJjbGUsICfQmtGA0YPQsycpXG5cbiAgICAvLyDQldGB0LvQuCDQv9C10YDQtdC00LDQvdGLINC90LDRgdGC0YDQvtC50LrQuCwg0YLQviDQvtC90Lgg0L/RgNC40LzQtdC90Y/RjtGC0YHRjy5cbiAgICBpZiAob3B0aW9ucykge1xuICAgICAgdGhpcy5zZXRPcHRpb25zKG9wdGlvbnMpXG5cbiAgICAgIC8vICDQldGB0LvQuCDQt9Cw0L/RgNC+0YjQtdC9INGE0L7RgNGB0LjRgNC+0LLQsNC90L3Ri9C5INC30LDQv9GD0YHQuiwg0YLQviDQuNC90LjRhtC40LDQu9C40LfQuNGA0YPRjtGC0YHRjyDQstGB0LUg0L3QtdC+0LHRhdC+0LTQuNC80YvQtSDQtNC70Y8g0YDQtdC90LTQtdGA0LAg0L/QsNGA0LDQvNC10YLRgNGLLlxuICAgICAgaWYgKHRoaXMuZm9yY2VSdW4pIHtcbiAgICAgICAgdGhpcy5zZXR1cChvcHRpb25zKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDQodC+0LfQtNCw0LXRgiDQutC+0L3RgtC10LrRgdGCINGA0LXQvdC00LXRgNC40L3Qs9CwIFdlYkdMINC4INGD0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdGCINC60L7RgNGA0LXQutGC0L3Ri9C5INGA0LDQt9C80LXRgCDQvtCx0LvQsNGB0YLQuCDQv9GA0L7RgdC80L7RgtGA0LAuXG4gICAqL1xuICBwcm90ZWN0ZWQgY3JlYXRlR2woKTogdm9pZCB7XG5cbiAgICB0aGlzLmdsID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnd2ViZ2wnLCB0aGlzLndlYkdsU2V0dGluZ3MpIGFzIFdlYkdMUmVuZGVyaW5nQ29udGV4dFxuXG4gICAgdGhpcy5jYW52YXMud2lkdGggPSB0aGlzLmNhbnZhcy5jbGllbnRXaWR0aFxuICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IHRoaXMuY2FudmFzLmNsaWVudEhlaWdodFxuXG4gICAgdGhpcy5nbC52aWV3cG9ydCgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KVxuICB9XG5cbiAgLyoqXG4gICAqINCg0LXQs9C40YHRgtGA0LjRgNGD0LXRgiDQvdC+0LLRg9GOINGE0L7RgNC80YMg0L/QvtC70LjQs9C+0L3QvtCyLiDQoNC10LPQuNGB0YLRgNCw0YbQuNGPINC+0LfQvdCw0YfQsNC10YIg0LLQvtC30LzQvtC20L3QvtGB0YLRjCDQsiDQtNCw0LvRjNC90LXQudGI0LXQvCDQvtGC0L7QsdGA0LDQttCw0YLRjCDQvdCwINCz0YDQsNGE0LjQutC1INC/0L7Qu9C40LPQvtC90Ysg0LTQsNC90L3QvtC5INGE0L7RgNC80YsuXG4gICAqXG4gICAqIEBwYXJhbSBwb2x5Z29uQ2FsYyAtINCk0YPQvdC60YbQuNGPINCy0YvRh9C40YHQu9C10L3QuNGPINC60L7QvtGA0LTQuNC90LDRgiDQstC10YDRiNC40L0g0L/QvtC70LjQs9C+0L3QsCDQtNCw0L3QvdC+0Lkg0YTQvtGA0LzRiy5cbiAgICogQHBhcmFtIHBvbHlnb25OYW1lIC0g0J3QsNC30LLQsNC90LjQtSDRhNC+0YDQvNGLINC/0L7Qu9C40LPQvtC90LAuXG4gICAqIEByZXR1cm5zINCY0L3QtNC10LrRgSDQvdC+0LLQvtC5INGE0L7RgNC80YssINC/0L4g0LrQvtGC0L7RgNC+0LzRgyDQt9Cw0LTQsNC10YLRgdGPINC10LUg0L7RgtC+0LHRgNCw0LbQtdC90LjQtSDQvdCwINCz0YDQsNGE0LjQutC1LlxuICAgKi9cbiAgcHVibGljIHJlZ2lzdGVyU2hhcGUocG9seWdvbkNhbGM6IFNQbG90Q2FsY1NoYXBlRnVuYywgcG9seWdvbk5hbWU6IHN0cmluZyk6IG51bWJlciB7XG5cbiAgICAvLyDQlNC+0LHQsNCy0LvQtdC90LjQtSDRhNC+0YDQvNGLINCyINC80LDRgdGB0LjQsiDRhNC+0YDQvC5cbiAgICB0aGlzLnNoYXBlcy5wdXNoKHtcbiAgICAgIGNhbGM6IHBvbHlnb25DYWxjLFxuICAgICAgbmFtZTogcG9seWdvbk5hbWVcbiAgICB9KVxuXG4gICAgLy8g0JTQvtCx0LDQstC70LXQvdC40LUg0YTQvtGA0LzRiyDQsiDQvNCw0YHRgdC40LIg0YfQsNGB0YLQvtGCINC/0L7Rj9Cy0LvQtdC90LjRjyDQsiDQtNC10LzQvi3RgNC10LbQuNC80LUuXG4gICAgdGhpcy5kZW1vTW9kZS5zaGFwZVF1b3RhIS5wdXNoKDEpXG5cbiAgICAvLyDQn9C+0LvRg9GH0LXQvdC90YvQuSDQuNC90LTQtdC60YEg0YTQvtGA0LzRiyDQsiDQvNCw0YHRgdC40LLQtSDRhNC+0YDQvC5cbiAgICByZXR1cm4gdGhpcy5zaGFwZXMubGVuZ3RoIC0gMVxuICB9XG5cbiAgLyoqXG4gICAqINCj0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdGCINC90LXQvtCx0YXQvtC00LjQvNGL0LUg0LTQu9GPINGA0LXQvdC00LXRgNCwINC/0LDRgNCw0LzQtdGC0YDRiyDRjdC60LfQtdC80L/Qu9GP0YDQsCDQuCBXZWJHTC5cbiAgICpcbiAgICogQHBhcmFtIG9wdGlvbnMgLSDQn9C+0LvRjNC30L7QstCw0YLQtdC70YzRgdC60LjQtSDQvdCw0YHRgtGA0L7QudC60Lgg0Y3QutC30LXQvNC/0LvRj9GA0LAuXG4gICAqL1xuICBwdWJsaWMgc2V0dXAob3B0aW9uczogU1Bsb3RPcHRpb25zKTogdm9pZCB7XG5cbiAgICAvLyDQn9GA0LjQvNC10L3QtdC90LjQtSDQv9C+0LvRjNC30L7QstCw0YLQtdC70YzRgdC60LjRhSDQvdCw0YHRgtGA0L7QtdC6LlxuICAgIHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKVxuXG4gICAgLy8g0KHQvtC30LTQsNC90LjQtSDQutC+0L3RgtC10LrRgdGC0LAg0YDQtdC90LTQtdGA0LjQvdCz0LAuXG4gICAgdGhpcy5jcmVhdGVHbCgpXG5cbiAgICAvLyDQktGL0LLQvtC0INC+0YLQu9Cw0LTQvtGH0L3QvtC5INC40L3RhNC+0YDQvNCw0YbQuNC4LlxuICAgIGlmICh0aGlzLmRlYnVnTW9kZS5pc0VuYWJsZSkge1xuICAgICAgdGhpcy5yZXBvcnRNYWluSW5mbyhvcHRpb25zKVxuICAgIH1cblxuICAgIC8vINCe0LHQvdGD0LvQtdC90LjQtSDRgdGH0LXRgtGH0LjQutCwINC/0L7Qu9C40LPQvtC90L7Qsi5cbiAgICB0aGlzLmFtb3VudE9mUG9seWdvbnMgPSAwXG5cbiAgICAvLyDQntCx0L3Rg9C70LXQvdC40LUg0YLQtdGF0L3QuNGH0LXRgdC60L7Qs9C+INGB0YfQtdGC0YfQuNC60LAg0YDQtdC20LjQvNCwINC00LXQvNC+LdC00LDQvdC90YvRhVxuICAgIHRoaXMuZGVtb01vZGUuaW5kZXggPSAwXG5cbiAgICAvLyDQntCx0L3Rg9C70LXQvdC40LUg0YHRh9C10YLRh9C40LrQvtCyINGH0LjRgdC70LAg0LjRgdC/0L7Qu9GM0LfQvtCy0LDQvdC40Y8g0YDQsNC30LvQuNGH0L3Ri9GFINGE0L7RgNC8INC/0L7Qu9C40LPQvtC90L7Qsi5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc2hhcGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0aGlzLmJ1ZmZlcnMuYW1vdW50T2ZTaGFwZXNbaV0gPSAwXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog0J/RgNC10LTQtdC70YzQvdC+0LUg0LrQvtC70LjRh9C10YHRgtCy0L4g0LLQtdGA0YjQuNC9INCyINCz0YDRg9C/0L/QtSDQv9C+0LvQuNCz0L7QvdC+0LIg0LfQsNCy0LjRgdC40YIg0L7RgiDQv9Cw0YDQsNC80LXRgtGA0LBcbiAgICAgKiBjaXJjbGVBcHByb3hMZXZlbCwg0LrQvtGC0L7RgNGL0Lkg0LzQvtCzINCx0YvRgtGMINC40LfQvNC10L3QtdC9INC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjNGB0LrQuNC80Lgg0L3QsNGB0YLRgNC+0LnQutCw0LzQuC5cbiAgICAgKi9cbiAgICB0aGlzLm1heEFtb3VudE9mVmVydGV4UGVyUG9seWdvbkdyb3VwID0gMzI3NjggLSAodGhpcy5jaXJjbGVBcHByb3hMZXZlbCArIDEpXG5cbiAgICAvLyDQmNC90LjRhtC40LDQu9C40LfQsNGG0LjRjyDQstGB0L/QvtC80L7Qs9Cw0YLQtdC70YzQvdGL0YUg0LrQvtC90YHRgtCw0L3Rgi5cbiAgICB0aGlzLnNldFVzZWZ1bENvbnN0YW50cygpXG5cbiAgICAvLyDQo9GB0YLQsNC90L7QstC60LAg0YbQstC10YLQsCDQvtGH0LjRgdGC0LrQuCDRgNC10L3QtNC10YDQuNC90LPQsFxuICAgIGxldCBbciwgZywgYl0gPSB0aGlzLmNvbnZlcnRDb2xvcih0aGlzLmJnQ29sb3IpXG4gICAgdGhpcy5nbC5jbGVhckNvbG9yKHIsIGcsIGIsIDAuMClcbiAgICB0aGlzLmdsLmNsZWFyKHRoaXMuZ2wuQ09MT1JfQlVGRkVSX0JJVClcblxuICAgIC8qKlxuICAgICAqINCf0L7QtNCz0L7RgtC+0LLQutCwINC60L7QtNC+0LIg0YjQtdC50LTQtdGA0L7Qsi4g0JIg0LrQvtC0INCy0LXRgNGI0LjQvdC90L7Qs9C+INGI0LXQudC00LXRgNCwINCy0YHRgtCw0LLQu9GP0LXRgtGB0Y8g0LrQvtC0INCy0YvQsdC+0YDQsCDRhtCy0LXRgtCwINCy0LXRgNGI0LjQvS4g0JrQvtC0INGE0YDQsNCz0LzQtdC90YLQvdC+0LPQvlxuICAgICAqINGI0LXQudC00LXRgNCwINC40YHQv9C+0LvRjNC30YPQtdGC0YHRjyDQsdC10Lcg0LjQt9C80LXQvdC10L3QuNC5LlxuICAgICAqL1xuICAgIGxldCB2ZXJ0ZXhTaGFkZXJDb2RlID0gdGhpcy5fdmVydGV4U2hhZGVyQ29kZVRlbXBsYXRlLnJlcGxhY2UoJ1NFVC1WRVJURVgtQ09MT1ItQ09ERScsIHRoaXMuZ2VuU2hhZGVyQ29sb3JDb2RlKCkpXG4gICAgbGV0IGZyYWdtZW50U2hhZGVyQ29kZSA9IHRoaXMuZnJhZ21lbnRTaGFkZXJDb2RlVGVtcGxhdGVcblxuICAgIC8vINCh0L7Qt9C00LDQvdC40LUg0YjQtdC50LTQtdGA0L7QsiBXZWJHTC5cbiAgICBsZXQgdmVydGV4U2hhZGVyID0gdGhpcy5jcmVhdGVXZWJHbFNoYWRlcignVkVSVEVYX1NIQURFUicsIHZlcnRleFNoYWRlckNvZGUpXG4gICAgbGV0IGZyYWdtZW50U2hhZGVyID0gdGhpcy5jcmVhdGVXZWJHbFNoYWRlcignRlJBR01FTlRfU0hBREVSJywgZnJhZ21lbnRTaGFkZXJDb2RlKVxuXG4gICAgLy8g0KHQvtC30LTQsNC90LjQtSDQv9GA0L7Qs9GA0LDQvNC80YsgV2ViR0wuXG4gICAgdGhpcy5jcmVhdGVXZWJHbFByb2dyYW0odmVydGV4U2hhZGVyLCBmcmFnbWVudFNoYWRlcilcblxuICAgIC8vINCj0YHRgtCw0L3QvtCy0LrQsCDRgdCy0Y/Qt9C10Lkg0L/QtdGA0LXQvNC10L3QvdGL0YUg0L/RgNC40LvQvtC20LXQvdC40Y8g0YEg0L/RgNC+0LPRgNCw0LzQvNC+0LkgV2ViR2wuXG4gICAgdGhpcy5zZXRXZWJHbFZhcmlhYmxlKCdhdHRyaWJ1dGUnLCAnYV9wb3NpdGlvbicpXG4gICAgdGhpcy5zZXRXZWJHbFZhcmlhYmxlKCdhdHRyaWJ1dGUnLCAnYV9jb2xvcicpXG4gICAgdGhpcy5zZXRXZWJHbFZhcmlhYmxlKCd1bmlmb3JtJywgJ3VfbWF0cml4JylcblxuICAgIC8vINCS0YvRh9C40YHQu9C10L3QuNC1INC00LDQvdC90YvRhSDQvtCx0L4g0LLRgdC10YUg0L/QvtC70LjQs9C+0L3QsNGFINC4INC30LDQv9C+0LvQvdC10L3QuNC1INC40LzQuCDQsdGD0YTQtdGA0L7QsiBXZWJHTC5cbiAgICB0aGlzLmNyZWF0ZVdiR2xCdWZmZXJzKClcblxuICAgIC8vINCV0YHQu9C4INC90LXQvtCx0YXQvtC00LjQvNC+LCDRgtC+INGA0LXQvdC00LXRgNC40L3QsyDQt9Cw0L/Rg9GB0LrQsNC10YLRgdGPINGB0YDQsNC30YMg0L/QvtGB0LvQtSDRg9GB0YLQsNC90L7QstC60Lgg0L/QsNGA0LDQvNC10YLRgNC+0LIg0Y3QutC30LXQvNC/0LvRj9GA0LAuXG4gICAgaWYgKHRoaXMuZm9yY2VSdW4pIHtcbiAgICAgIHRoaXMucnVuKClcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICog0J/RgNC40LzQtdC90Y/QtdGCINC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjNGB0LrQuNC1INC90LDRgdGC0YDQvtC50LrQuCDRjdC60LfQtdC80L/Qu9GP0YDQsC5cbiAgICpcbiAgICogQHBhcmFtIG9wdGlvbnMgLSDQn9C+0LvRjNC30L7QstCw0YLQtdC70YzRgdC60LjQtSDQvdCw0YHRgtGA0L7QudC60Lgg0Y3QutC30LXQvNC/0LvRj9GA0LAuXG4gICAqL1xuICBwcm90ZWN0ZWQgc2V0T3B0aW9ucyhvcHRpb25zOiBTUGxvdE9wdGlvbnMpOiB2b2lkIHtcblxuICAgIC8qKlxuICAgICAqINCa0L7Qv9C40YDQvtCy0LDQvdC40LUg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GM0YHQutC40YUg0L3QsNGB0YLRgNC+0LXQuiDQsiDRgdC+0L7RgtCy0LXRgtGB0LLRg9GO0YnQuNC1INC/0L7Qu9GPINGN0LrQt9C10LzQv9C70Y/RgNCwLiDQmtC+0L/QuNGA0YPRjtGC0YHRjyDRgtC+0LvRjNC60L4g0YLQtSDQuNC3INC90LjRhSwg0LrQvtGC0L7RgNGL0LxcbiAgICAgKiDQuNC80LXRjtGC0YHRjyDRgdC+0L7RgtCy0LXRgtGB0YLQstGD0Y7RidC40LUg0Y3QutCy0LjQstCw0LvQtdC90YLRiyDQsiDQv9C+0LvRj9GFINGN0LrQt9C10LzQv9C70Y/RgNCwLiDQmtC+0L/QuNGA0YPQtdGC0YHRjyDRgtCw0LrQttC1INC/0LXRgNCy0YvQuSDRg9GA0L7QstC10L3RjCDQstC70L7QttC10L3QvdGL0YUg0L3QsNGB0YLRgNC+0LXQui5cbiAgICAgKi9cbiAgICBmb3IgKGxldCBvcHRpb24gaW4gb3B0aW9ucykge1xuXG4gICAgICBpZiAoIXRoaXMuaGFzT3duUHJvcGVydHkob3B0aW9uKSkgY29udGludWVcblxuICAgICAgaWYgKGlzT2JqZWN0KChvcHRpb25zIGFzIGFueSlbb3B0aW9uXSkgJiYgaXNPYmplY3QoKHRoaXMgYXMgYW55KVtvcHRpb25dKSApIHtcbiAgICAgICAgZm9yIChsZXQgbmVzdGVkT3B0aW9uIGluIChvcHRpb25zIGFzIGFueSlbb3B0aW9uXSkge1xuICAgICAgICAgIGlmICgodGhpcyBhcyBhbnkpW29wdGlvbl0uaGFzT3duUHJvcGVydHkobmVzdGVkT3B0aW9uKSkge1xuICAgICAgICAgICAgKHRoaXMgYXMgYW55KVtvcHRpb25dW25lc3RlZE9wdGlvbl0gPSAob3B0aW9ucyBhcyBhbnkpW29wdGlvbl1bbmVzdGVkT3B0aW9uXVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgKHRoaXMgYXMgYW55KVtvcHRpb25dID0gKG9wdGlvbnMgYXMgYW55KVtvcHRpb25dXG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog0JXRgdC70Lgg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GMINC30LDQtNCw0LXRgiDRgNCw0LfQvNC10YAg0L/Qu9C+0YHQutC+0YHRgtC4LCDQvdC+INC/0YDQuCDRjdGC0L7QvCDQvdCwINC30LDQtNCw0LXRgiDQvdCw0YfQsNC70YzQvdC+0LUg0L/QvtC70L7QttC10L3QuNC1INC+0LHQu9Cw0YHRgtC4INC/0YDQvtGB0LzQvtGC0YDQsCwg0YLQvlxuICAgICAqINC+0LHQu9Cw0YHRgtGMINC/0YDQvtGB0LzQvtGC0YDQsCDQv9C+0LzQtdGJ0LDQtdGC0YHRjyDQsiDRhtC10L3RgtGAINC30LDQtNCw0L3QvdC+0Lkg0L/Qu9C+0YHQutC+0YHRgtC4LlxuICAgICAqL1xuICAgIGlmIChvcHRpb25zLmhhc093blByb3BlcnR5KCdncmlkU2l6ZScpICYmICFvcHRpb25zLmhhc093blByb3BlcnR5KCdjYW1lcmEnKSkge1xuICAgICAgdGhpcy5jYW1lcmEgPSB7XG4gICAgICAgIHg6IHRoaXMuZ3JpZFNpemUud2lkdGggLyAyLFxuICAgICAgICB5OiB0aGlzLmdyaWRTaXplLmhlaWdodCAvIDIsXG4gICAgICAgIHpvb206IDFcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDQldGB0LvQuCDQt9Cw0L/RgNC+0YjQtdC9INC00LXQvNC+LdGA0LXQttC40LwsINGC0L4g0LTQu9GPINC40YLQtdGA0LjRgNC+0LLQsNC90LjRjyDQvtCx0YrQtdC60YLQvtCyINCx0YPQtNC10YIg0LjRgdC/0L7Qu9GM0LfQvtCy0LDRgtGM0YHRjyDQstC90YPRgtGA0LXQvdC90LjQuSDQuNC80LjRgtC40YDRg9GO0YnQuNC5INC40YLQtdGA0LjRgNC+0LLQsNC90LjQtVxuICAgICAqINC80LXRgtC+0LQuINCf0YDQuCDRjdGC0L7QvCDQstC90LXRiNC90Y/RjyDRhNGD0L3QutGG0LjRjyDQuNGC0LXRgNC40YDQvtCy0LDQvdC40Y8g0LjRgdC/0L7Qu9GM0LfQvtCy0LDQvdCwINC90LUg0LHRg9C00LXRgi5cbiAgICAgKi9cbiAgICBpZiAodGhpcy5kZW1vTW9kZS5pc0VuYWJsZSkge1xuICAgICAgdGhpcy5pdGVyYXRpb25DYWxsYmFjayA9IHRoaXMuZGVtb0l0ZXJhdGlvbkNhbGxiYWNrXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqINCS0YvRh9C40YHQu9GP0LXRgiDQvdCw0LHQvtGAINCy0YHQv9C+0LzQvtCz0LDRgtC10LvRjNC90YvRhSDQutC+0L3RgdGC0LDQvdGCIHtAbGluayBVU0VGVUxfQ09OU1RTfSwg0YXRgNCw0L3Rj9GJ0LjRhSDRgNC10LfRg9C70YzRgtCw0YLRiyDQsNC70LPQtdCx0YDQsNC40YfQtdGB0LrQuNGFINC4XG4gICAqINGC0YDQuNCz0L7QvdC+0LzQtdGC0YDQuNGH0LXRgdC60LjRhSDQstGL0YfQuNGB0LvQtdC90LjQuSwg0LjRgdC/0L7Qu9GM0LfRg9C10LzRi9GFINCyINGA0LDRgdGH0LXRgtCw0YUg0LLQtdGA0YjQuNC9INC/0L7Qu9C40LPQvtC90L7QsiDQuCDQvNCw0YLRgNC40YYg0YLRgNCw0L3RgdGE0L7RgNC80LDRhtC40LguXG4gICAqXG4gICAqIEByZW1hcmtzXG4gICAqINCi0LDQutC40LUg0LrQvtC90YHRgtCw0L3RgtGLINC/0L7Qt9Cy0L7Qu9GP0Y7RgiDQstGL0L3QtdGB0YLQuCDQt9Cw0YLRgNCw0YLQvdGL0LUg0LTQu9GPINC/0YDQvtGG0LXRgdGB0L7RgNCwINC+0L/QtdGA0LDRhtC40Lgg0LfQsCDQv9GA0LXQtNC10LvRiyDQvNC90L7Qs9C+0LrRgNCw0YLQvdC+INC40YHQv9C+0LvRjNC30YPQtdC80YvRhSDRhNGD0L3QutGG0LjQuVxuICAgKiDRg9Cy0LXQu9C40YfQuNCy0LDRjyDQv9GA0L7QuNC30LLQvtC00LjRgtC10LvRjNC90L7RgdGC0Ywg0L/RgNC40LvQvtC20LXQvdC40Y8g0L3QsCDRjdGC0LDQv9Cw0YUg0L/QvtC00LPQvtGC0L7QstC60Lgg0LTQsNC90L3Ri9GFINC4INGA0LXQvdC00LXRgNC40L3Qs9CwLlxuICAgKi9cbiAgcHJvdGVjdGVkIHNldFVzZWZ1bENvbnN0YW50cygpOiB2b2lkIHtcblxuICAgIC8vINCa0L7QvdGB0YLQsNC90YLRiywg0LfQsNCy0LjRgdGP0YnQuNC1INC+0YIg0YDQsNC30LzQtdGA0LAg0L/QvtC70LjQs9C+0L3QsC5cbiAgICB0aGlzLlVTRUZVTF9DT05TVFNbMF0gPSB0aGlzLnBvbHlnb25TaXplIC8gMlxuICAgIHRoaXMuVVNFRlVMX0NPTlNUU1sxXSA9IHRoaXMuVVNFRlVMX0NPTlNUU1swXSAvIE1hdGguY29zKE1hdGguUEkgLyA2KVxuICAgIHRoaXMuVVNFRlVMX0NPTlNUU1syXSA9IHRoaXMuVVNFRlVMX0NPTlNUU1swXSAqIE1hdGgudGFuKE1hdGguUEkgLyA2KVxuXG4gICAgLy8g0JrQvtC90YHRgtCw0L3RgtGLLCDQt9Cw0LLQuNGB0Y/RidC40LUg0L7RgiDRgdGC0LXQv9C10L3QuCDQtNC10YLQsNC70LjQt9Cw0YbQuNC4INC60YDRg9Cz0LAg0Lgg0YDQsNC30LzQtdGA0LAg0L/QvtC70LjQs9C+0L3QsC5cbiAgICB0aGlzLlVTRUZVTF9DT05TVFNbM10gPSBuZXcgRmxvYXQzMkFycmF5KHRoaXMuY2lyY2xlQXBwcm94TGV2ZWwpXG4gICAgdGhpcy5VU0VGVUxfQ09OU1RTWzRdID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLmNpcmNsZUFwcHJveExldmVsKVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNpcmNsZUFwcHJveExldmVsOyBpKyspIHtcbiAgICAgIGNvbnN0IGFuZ2xlID0gMiAqIE1hdGguUEkgKiBpIC8gdGhpcy5jaXJjbGVBcHByb3hMZXZlbFxuICAgICAgdGhpcy5VU0VGVUxfQ09OU1RTWzNdW2ldID0gdGhpcy5VU0VGVUxfQ09OU1RTWzBdICogTWF0aC5jb3MoYW5nbGUpXG4gICAgICB0aGlzLlVTRUZVTF9DT05TVFNbNF1baV0gPSB0aGlzLlVTRUZVTF9DT05TVFNbMF0gKiBNYXRoLnNpbihhbmdsZSlcbiAgICB9XG5cbiAgICAvLyDQmtC+0L3RgdGC0LDQvdGC0YssINC30LDQstC40YHRj9GJ0LjQtSDQvtGCINGA0LDQt9C80LXRgNCwINC60LDQvdCy0LDRgdCwLlxuICAgIHRoaXMuVVNFRlVMX0NPTlNUU1s1XSA9IDIgLyB0aGlzLmNhbnZhcy53aWR0aFxuICAgIHRoaXMuVVNFRlVMX0NPTlNUU1s2XSA9IDIgLyB0aGlzLmNhbnZhcy5oZWlnaHRcbiAgICB0aGlzLlVTRUZVTF9DT05TVFNbN10gPSAyIC8gdGhpcy5jYW52YXMuY2xpZW50V2lkdGhcbiAgICB0aGlzLlVTRUZVTF9DT05TVFNbOF0gPSAtMiAvIHRoaXMuY2FudmFzLmNsaWVudEhlaWdodFxuICAgIHRoaXMuVVNFRlVMX0NPTlNUU1s5XSA9IHRoaXMuY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnRcbiAgICB0aGlzLlVTRUZVTF9DT05TVFNbMTBdID0gdGhpcy5jYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wXG4gIH1cblxuICAvKipcbiAgICog0KHQvtC30LTQsNC10YIg0YjQtdC50LTQtdGAIFdlYkdMLlxuICAgKlxuICAgKiBAcGFyYW0gc2hhZGVyVHlwZSDQotC40L8g0YjQtdC50LTQtdGA0LAuXG4gICAqIEBwYXJhbSBzaGFkZXJDb2RlINCa0L7QtCDRiNC10LnQtNC10YDQsCDQvdCwINGP0LfRi9C60LUgR0xTTC5cbiAgICogQHJldHVybnMg0KHQvtC30LTQsNC90L3Ri9C5INC+0LHRitC10LrRgiDRiNC10LnQtNC10YDQsC5cbiAgICovXG4gIHByb3RlY3RlZCBjcmVhdGVXZWJHbFNoYWRlcihzaGFkZXJUeXBlOiBXZWJHbFNoYWRlclR5cGUsIHNoYWRlckNvZGU6IHN0cmluZyk6IFdlYkdMU2hhZGVyIHtcblxuICAgIC8vINCh0L7Qt9C00LDQvdC40LUsINC/0YDQuNCy0Y/Qt9C60LAg0LrQvtC00LAg0Lgg0LrQvtC80L/QuNC70Y/RhtC40Y8g0YjQtdC50LTQtdGA0LAuXG4gICAgY29uc3Qgc2hhZGVyID0gdGhpcy5nbC5jcmVhdGVTaGFkZXIodGhpcy5nbFtzaGFkZXJUeXBlXSkgYXMgV2ViR0xTaGFkZXJcbiAgICB0aGlzLmdsLnNoYWRlclNvdXJjZShzaGFkZXIsIHNoYWRlckNvZGUpXG4gICAgdGhpcy5nbC5jb21waWxlU2hhZGVyKHNoYWRlcilcblxuICAgIGlmICghdGhpcy5nbC5nZXRTaGFkZXJQYXJhbWV0ZXIoc2hhZGVyLCB0aGlzLmdsLkNPTVBJTEVfU1RBVFVTKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCfQntGI0LjQsdC60LAg0LrQvtC80L/QuNC70Y/RhtC40Lgg0YjQtdC50LTQtdGA0LAgWycgKyBzaGFkZXJUeXBlICsgJ10uICcgKyB0aGlzLmdsLmdldFNoYWRlckluZm9Mb2coc2hhZGVyKSlcbiAgICB9XG5cbiAgICAvLyDQktGL0LLQvtC0INC+0YLQu9Cw0LTQvtGH0L3QvtC5INC40L3RhNC+0YDQvNCw0YbQuNC4LlxuICAgIGlmICh0aGlzLmRlYnVnTW9kZS5pc0VuYWJsZSkge1xuICAgICAgY29uc29sZS5ncm91cCgnJWPQodC+0LfQtNCw0L0g0YjQtdC50LTQtdGAIFsnICsgc2hhZGVyVHlwZSArICddJywgdGhpcy5kZWJ1Z1N0eWxlKVxuICAgICAge1xuICAgICAgICBjb25zb2xlLmxvZyhzaGFkZXJDb2RlKVxuICAgICAgfVxuICAgICAgY29uc29sZS5ncm91cEVuZCgpXG4gICAgfVxuXG4gICAgcmV0dXJuIHNoYWRlclxuICB9XG5cbiAgLyoqXG4gICAqINCh0L7Qt9C00LDQtdGCINC/0YDQvtCz0YDQsNC80LzRgyBXZWJHTC5cbiAgICpcbiAgICogQHBhcmFtIHtXZWJHTFNoYWRlcn0gdmVydGV4U2hhZGVyINCS0LXRgNGI0LjQvdC90YvQuSDRiNC10LnQtNC10YAuXG4gICAqIEBwYXJhbSB7V2ViR0xTaGFkZXJ9IGZyYWdtZW50U2hhZGVyINCk0YDQsNCz0LzQtdC90YLQvdGL0Lkg0YjQtdC50LTQtdGALlxuICAgKi9cbiAgcHJvdGVjdGVkIGNyZWF0ZVdlYkdsUHJvZ3JhbSh2ZXJ0ZXhTaGFkZXI6IFdlYkdMU2hhZGVyLCBmcmFnbWVudFNoYWRlcjogV2ViR0xTaGFkZXIpOiB2b2lkIHtcblxuICAgIHRoaXMuZ3B1UHJvZ3JhbSA9IHRoaXMuZ2wuY3JlYXRlUHJvZ3JhbSgpIGFzIFdlYkdMUHJvZ3JhbVxuXG4gICAgdGhpcy5nbC5hdHRhY2hTaGFkZXIodGhpcy5ncHVQcm9ncmFtLCB2ZXJ0ZXhTaGFkZXIpXG4gICAgdGhpcy5nbC5hdHRhY2hTaGFkZXIodGhpcy5ncHVQcm9ncmFtLCBmcmFnbWVudFNoYWRlcilcbiAgICB0aGlzLmdsLmxpbmtQcm9ncmFtKHRoaXMuZ3B1UHJvZ3JhbSlcblxuICAgIGlmICghdGhpcy5nbC5nZXRQcm9ncmFtUGFyYW1ldGVyKHRoaXMuZ3B1UHJvZ3JhbSwgdGhpcy5nbC5MSU5LX1NUQVRVUykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcign0J7RiNC40LHQutCwINGB0L7Qt9C00LDQvdC40Y8g0L/RgNC+0LPRgNCw0LzQvNGLIFdlYkdMLiAnICsgdGhpcy5nbC5nZXRQcm9ncmFtSW5mb0xvZyh0aGlzLmdwdVByb2dyYW0pKVxuICAgIH1cblxuICAgIHRoaXMuZ2wudXNlUHJvZ3JhbSh0aGlzLmdwdVByb2dyYW0pXG4gIH1cblxuICAvKipcbiAgICog0KPRgdGC0LDQvdCw0LLQu9C40LLQsNC10YIg0YHQstGP0LfRjCDQv9C10YDQtdC80LXQvdC90L7QuSDQv9GA0LjQu9C+0LbQtdC90LjRjyDRgSDQv9GA0L7Qs9GA0LDQvNC80L7QuSBXZWJHbC5cbiAgICpcbiAgICogQHBhcmFtIHZhclR5cGUg0KLQuNC/INC/0LXRgNC10LzQtdC90L3QvtC5LlxuICAgKiBAcGFyYW0gdmFyTmFtZSDQmNC80Y8g0L/QtdGA0LXQvNC10L3QvdC+0LkuXG4gICAqL1xuICBwcm90ZWN0ZWQgc2V0V2ViR2xWYXJpYWJsZSh2YXJUeXBlOiBXZWJHbFZhcmlhYmxlVHlwZSwgdmFyTmFtZTogc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKHZhclR5cGUgPT09ICd1bmlmb3JtJykge1xuICAgICAgdGhpcy52YXJpYWJsZXNbdmFyTmFtZV0gPSB0aGlzLmdsLmdldFVuaWZvcm1Mb2NhdGlvbih0aGlzLmdwdVByb2dyYW0sIHZhck5hbWUpXG4gICAgfSBlbHNlIGlmICh2YXJUeXBlID09PSAnYXR0cmlidXRlJykge1xuICAgICAgdGhpcy52YXJpYWJsZXNbdmFyTmFtZV0gPSB0aGlzLmdsLmdldEF0dHJpYkxvY2F0aW9uKHRoaXMuZ3B1UHJvZ3JhbSwgdmFyTmFtZSlcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICog0KHQvtC30LTQsNC10YIg0Lgg0LfQsNC/0L7Qu9C90Y/QtdGCINC00LDQvdC90YvQvNC4INC+0LHQviDQstGB0LXRhSDQv9C+0LvQuNCz0L7QvdCw0YUg0LHRg9GE0LXRgNGLIFdlYkdMLlxuICAgKi9cbiAgcHJvdGVjdGVkIGNyZWF0ZVdiR2xCdWZmZXJzKCk6IHZvaWQge1xuXG4gICAgLy8g0JLRi9Cy0L7QtCDQvtGC0LvQsNC00L7Rh9C90L7QuSDQuNC90YTQvtGA0LzQsNGG0LjQuC5cbiAgICBpZiAodGhpcy5kZWJ1Z01vZGUuaXNFbmFibGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKCclY9CX0LDQv9GD0YnQtdC9INC/0YDQvtGG0LXRgdGBINC30LDQs9GA0YPQt9C60Lgg0LTQsNC90L3Ri9GFIFsnICsgdGhpcy5nZXRDdXJyZW50VGltZSgpICsgJ10uLi4nLCB0aGlzLmRlYnVnU3R5bGUpXG5cbiAgICAgIC8vINCX0LDQv9GD0YHQuiDQutC+0L3RgdC+0LvRjNC90L7Qs9C+INGC0LDQudC80LXRgNCwLCDQuNC30LzQtdGA0Y/RjtGJ0LXQs9C+INC00LvQuNGC0LXQu9GM0L3QvtGB0YLRjCDQv9GA0L7RhtC10YHRgdCwINC30LDQs9GA0YPQt9C60Lgg0LTQsNC90L3Ri9GFINCyINCy0LjQtNC10L7Qv9Cw0LzRj9GC0YwuXG4gICAgICBjb25zb2xlLnRpbWUoJ9CU0LvQuNGC0LXQu9GM0L3QvtGB0YLRjCcpXG4gICAgfVxuXG4gICAgbGV0IHBvbHlnb25Hcm91cDogU1Bsb3RQb2x5Z29uR3JvdXAgfCBudWxsXG5cbiAgICAvLyDQmNGC0LXRgNC40YDQvtCy0LDQvdC40LUg0LPRgNGD0L/QvyDQv9C+0LvQuNCz0L7QvdC+0LIuXG4gICAgd2hpbGUgKHBvbHlnb25Hcm91cCA9IHRoaXMuY3JlYXRlUG9seWdvbkdyb3VwKCkpIHtcblxuICAgICAgLy8g0KHQvtC30LTQsNC90LjQtSDQuCDQt9Cw0L/QvtC70L3QtdC90LjQtSDQsdGD0YTQtdGA0L7QsiDQtNCw0L3QvdGL0LzQuCDQviDRgtC10LrRg9GJ0LXQuSDQs9GA0YPQv9C/0LUg0L/QvtC70LjQs9C+0L3QvtCyLlxuICAgICAgdGhpcy5hZGRXYkdsQnVmZmVyKHRoaXMuYnVmZmVycy52ZXJ0ZXhCdWZmZXJzLCAnQVJSQVlfQlVGRkVSJywgbmV3IEZsb2F0MzJBcnJheShwb2x5Z29uR3JvdXAudmVydGljZXMpLCAwKVxuICAgICAgdGhpcy5hZGRXYkdsQnVmZmVyKHRoaXMuYnVmZmVycy5jb2xvckJ1ZmZlcnMsICdBUlJBWV9CVUZGRVInLCBuZXcgVWludDhBcnJheShwb2x5Z29uR3JvdXAuY29sb3JzKSwgMSlcbiAgICAgIHRoaXMuYWRkV2JHbEJ1ZmZlcih0aGlzLmJ1ZmZlcnMuaW5kZXhCdWZmZXJzLCAnRUxFTUVOVF9BUlJBWV9CVUZGRVInLCBuZXcgVWludDE2QXJyYXkocG9seWdvbkdyb3VwLmluZGljZXMpLCAyKVxuXG4gICAgICAvLyDQodGH0LXRgtGH0LjQuiDQutC+0LvQuNGH0LXRgdGC0LLQsCDQsdGD0YTQtdGA0L7Qsi5cbiAgICAgIHRoaXMuYnVmZmVycy5hbW91bnRPZkJ1ZmZlckdyb3VwcysrXG5cbiAgICAgIC8vINCh0YfQtdGC0YfQuNC6INC60L7Qu9C40YfQtdGB0YLQstCwINCy0LXRgNGI0LjQvSBHTC3RgtGA0LXRg9Cz0L7Qu9GM0L3QuNC60L7QsiDRgtC10LrRg9GJ0LXQuSDQs9GA0YPQv9C/0Ysg0LHRg9GE0LXRgNC+0LIuXG4gICAgICB0aGlzLmJ1ZmZlcnMuYW1vdW50T2ZHTFZlcnRpY2VzLnB1c2gocG9seWdvbkdyb3VwLmFtb3VudE9mR0xWZXJ0aWNlcylcblxuICAgICAgLy8g0KHRh9C10YLRh9C40Log0L7QsdGJ0LXQs9C+INC60L7Qu9C40YfQtdGB0YLQstCwINCy0LXRgNGI0LjQvSBHTC3RgtGA0LXRg9Cz0L7Qu9GM0L3QuNC60L7Qsi5cbiAgICAgIHRoaXMuYnVmZmVycy5hbW91bnRPZlRvdGFsR0xWZXJ0aWNlcyArPSBwb2x5Z29uR3JvdXAuYW1vdW50T2ZHTFZlcnRpY2VzXG4gICAgfVxuXG4gICAgLy8g0JLRi9Cy0L7QtCDQvtGC0LvQsNC00L7Rh9C90L7QuSDQuNC90YTQvtGA0LzQsNGG0LjQuC5cbiAgICBpZiAodGhpcy5kZWJ1Z01vZGUuaXNFbmFibGUpIHtcbiAgICAgIHRoaXMucmVwb3J0QWJvdXRPYmplY3RSZWFkaW5nKClcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICog0KHRh9C40YLRi9Cy0LDQtdGCINC00LDQvdC90YvQtSDQvtCxINC40YHRhdC+0LTQvdGL0YUg0L7QsdGK0LXQutGC0LDRhSDQuCDRhNC+0YDQvNC40YDRg9C10YIg0YHQvtC+0YLQstC10YLRgdCy0YPRjtGJ0YPRjiDRjdGC0LjQvCDQvtCx0YrQtdC60YLQsNC8INCz0YDRg9C/0L/RgyDQv9C+0LvQuNCz0L7QvdC+0LIuXG4gICAqXG4gICAqIEByZW1hcmtzXG4gICAqINCT0YDRg9C/0L/QsCDRhNC+0YDQvNC40YDRg9C10YLRgdGPINGBINGD0YfQtdGC0L7QvCDRgtC10YXQvdC40YfQtdGB0LrQvtCz0L4g0L7Qs9GA0LDQvdC40YfQtdC90LjRjyDQvdCwINC60L7Qu9C40YfQtdGB0YLQstC+INCy0LXRgNGI0LjQvSDQsiDQs9GA0YPQv9C/0LUg0Lgg0LvQuNC80LjRgtCwINC90LAg0L7QsdGJ0LXQtSDQutC+0LvQuNGH0LXRgdGC0LLQvlxuICAgKiDQv9C+0LvQuNCz0L7QvdC+0LIg0L3QsCDQutCw0L3QstCw0YHQtS5cbiAgICpcbiAgICogQHJldHVybnMg0KHQvtC30LTQsNC90L3QsNGPINCz0YDRg9C/0L/QsCDQv9C+0LvQuNCz0L7QvdC+0LIg0LjQu9C4IG51bGwsINC10YHQu9C4INGE0L7RgNC80LjRgNC+0LLQsNC90LjQtSDQstGB0LXRhSDQs9GA0YPQv9C/INC/0L7Qu9C40LPQvtC90L7QsiDQt9Cw0LLQtdGA0YjQuNC70L7RgdGMLlxuICAgKi9cbiAgcHJvdGVjdGVkIGNyZWF0ZVBvbHlnb25Hcm91cCgpOiBTUGxvdFBvbHlnb25Hcm91cCB8IG51bGwge1xuXG4gICAgbGV0IHBvbHlnb25Hcm91cDogU1Bsb3RQb2x5Z29uR3JvdXAgPSB7XG4gICAgICB2ZXJ0aWNlczogW10sXG4gICAgICBpbmRpY2VzOiBbXSxcbiAgICAgIGNvbG9yczogW10sXG4gICAgICBhbW91bnRPZlZlcnRpY2VzOiAwLFxuICAgICAgYW1vdW50T2ZHTFZlcnRpY2VzOiAwXG4gICAgfVxuXG4gICAgbGV0IHBvbHlnb246IFNQbG90UG9seWdvbiB8IG51bGxcblxuICAgIC8qKlxuICAgICAqINCV0YHQu9C4INC60L7Qu9C40YfQtdGB0YLQstC+INC/0L7Qu9C40LPQvtC90L7QsiDQutCw0L3QstCw0YHQsCDQtNC+0YHRgtC40LPQu9C+INC00L7Qv9GD0YHRgtC40LzQvtCz0L4g0LzQsNC60YHQuNC80YPQvNCwLCDRgtC+INC00LDQu9GM0L3QtdC50YjQsNGPINC+0LHRgNCw0LHQvtGC0LrQsCDQuNGB0YXQvtC00L3Ri9GFINC+0LHRitC10LrRgtC+0LJcbiAgICAgKiDQv9GA0LjQvtGB0YLQsNC90LDQstC70LjQstCw0LXRgtGB0Y8gLSDRhNC+0YDQvNC40YDQvtCy0LDQvdC40LUg0LPRgNGD0L/QvyDQv9C+0LvQuNCz0L7QvdC+0LIg0LfQsNCy0LXRgNGI0LDQtdGC0YHRjyDQstC+0LfQstGA0LDRgtC+0Lwg0LfQvdCw0YfQtdC90LjRjyBudWxsICjRgdC40LzRg9C70Y/RhtC40Y8g0LTQvtGB0YLQuNC20LXQvdC40Y9cbiAgICAgKiDQv9C+0YHQu9C10LTQvdC10LPQviDQvtCx0YDQsNCx0LDRgtGL0LLQsNC10LzQvtCz0L4g0LjRgdGF0L7QtNC90L7Qs9C+INC+0LHRitC10LrRgtCwKS5cbiAgICAgKi9cbiAgICBpZiAodGhpcy5hbW91bnRPZlBvbHlnb25zID49IHRoaXMubWF4QW1vdW50T2ZQb2x5Z29ucykgcmV0dXJuIG51bGxcblxuICAgIC8vINCY0YLQtdGA0LjRgNC+0LLQsNC90LjQtSDQuNGB0YXQvtC00L3Ri9GFINC+0LHRitC10LrRgtC+0LIuXG4gICAgd2hpbGUgKHBvbHlnb24gPSB0aGlzLml0ZXJhdGlvbkNhbGxiYWNrISgpKSB7XG5cbiAgICAgIC8vINCU0L7QsdCw0LLQu9C10L3QuNC1INCyINCz0YDRg9C/0L/RgyDQv9C+0LvQuNCz0L7QvdC+0LIg0L3QvtCy0L7Qs9C+INC/0L7Qu9C40LPQvtC90LAuXG4gICAgICB0aGlzLmFkZFBvbHlnb24ocG9seWdvbkdyb3VwLCBwb2x5Z29uKVxuXG4gICAgICAvLyDQodGH0LXRgtGH0LjQuiDRh9C40YHQu9CwINC/0YDQuNC80LXQvdC10L3QuNC5INC60LDQttC00L7QuSDQuNC3INGE0L7RgNC8INC/0L7Qu9C40LPQvtC90L7Qsi5cbiAgICAgIHRoaXMuYnVmZmVycy5hbW91bnRPZlNoYXBlc1twb2x5Z29uLnNoYXBlXSsrXG5cbiAgICAgIC8vINCh0YfQtdGC0YfQuNC6INC+0LHRidC10LPQviDQutC+0LvQuNGH0LXRgdGC0LLQviDQv9C+0LvQuNCz0L7QvdC+0LIuXG4gICAgICB0aGlzLmFtb3VudE9mUG9seWdvbnMrK1xuXG4gICAgICAvKipcbiAgICAgICAqINCV0YHQu9C4INC60L7Qu9C40YfQtdGB0YLQstC+INC/0L7Qu9C40LPQvtC90L7QsiDQutCw0L3QstCw0YHQsCDQtNC+0YHRgtC40LPQu9C+INC00L7Qv9GD0YHRgtC40LzQvtCz0L4g0LzQsNC60YHQuNC80YPQvNCwLCDRgtC+INC00LDQu9GM0L3QtdC50YjQsNGPINC+0LHRgNCw0LHQvtGC0LrQsCDQuNGB0YXQvtC00L3Ri9GFINC+0LHRitC10LrRgtC+0LJcbiAgICAgICAqINC/0YDQuNC+0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdGC0YHRjyAtINGE0L7RgNC80LjRgNC+0LLQsNC90LjQtSDQs9GA0YPQv9C/INC/0L7Qu9C40LPQvtC90L7QsiDQt9Cw0LLQtdGA0YjQsNC10YLRgdGPINCy0L7Qt9Cy0YDQsNGC0L7QvCDQt9C90LDRh9C10L3QuNGPIG51bGwgKNGB0LjQvNGD0LvRj9GG0LjRjyDQtNC+0YHRgtC40LbQtdC90LjRj1xuICAgICAgICog0L/QvtGB0LvQtdC00L3QtdCz0L4g0L7QsdGA0LDQsdCw0YLRi9Cy0LDQtdC80L7Qs9C+INC40YHRhdC+0LTQvdC+0LPQviDQvtCx0YrQtdC60YLQsCkuXG4gICAgICAgKi9cbiAgICAgIGlmICh0aGlzLmFtb3VudE9mUG9seWdvbnMgPj0gdGhpcy5tYXhBbW91bnRPZlBvbHlnb25zKSBicmVha1xuXG4gICAgICAvKipcbiAgICAgICAqINCV0YHQu9C4INC+0LHRidC10LUg0LrQvtC70LjRh9C10YHRgtCy0L4g0LLRgdC10YUg0LLQtdGA0YjQuNC9INCyINCz0YDRg9C/0L/QtSDQv9C+0LvQuNCz0L7QvdC+0LIg0L/RgNC10LLRi9GB0LjQu9C+INGC0LXRhdC90LjRh9C10YHQutC+0LUg0L7Qs9GA0LDQvdC40YfQtdC90LjQtSwg0YLQviDQs9GA0YPQv9C/0LAg0L/QvtC70LjQs9C+0L3QvtCyXG4gICAgICAgKiDRgdGH0LjRgtCw0LXRgtGB0Y8g0YHRhNC+0YDQvNC40YDQvtCy0LDQvdC90L7QuSDQuCDQuNGC0LXRgNC40YDQvtCy0LDQvdC40LUg0LjRgdGF0L7QtNC90YvRhSDQvtCx0YrQtdC60YLQvtCyINC/0YDQuNC+0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdGC0YHRjy5cbiAgICAgICAqL1xuICAgICAgaWYgKHBvbHlnb25Hcm91cC5hbW91bnRPZlZlcnRpY2VzID49IHRoaXMubWF4QW1vdW50T2ZWZXJ0ZXhQZXJQb2x5Z29uR3JvdXApIGJyZWFrXG4gICAgfVxuXG4gICAgLy8g0KHRh9C10YLRh9C40Log0L7QsdGJ0LXQs9C+INC60L7Qu9C40YfQtdGB0YLQstCwINCy0LXRgNGI0LjQvSDQstGB0LXRhSDQstC10YDRiNC40L3QvdGL0YUg0LHRg9GE0LXRgNC+0LIuXG4gICAgdGhpcy5idWZmZXJzLmFtb3VudE9mVG90YWxWZXJ0aWNlcyArPSBwb2x5Z29uR3JvdXAuYW1vdW50T2ZWZXJ0aWNlc1xuXG4gICAgLy8g0JXRgdC70Lgg0LPRgNGD0L/Qv9CwINC/0L7Qu9C40LPQvtC90L7QsiDQvdC10L/Rg9GB0YLQsNGPLCDRgtC+INCy0L7Qt9Cy0YDQsNGJ0LDQtdC8INC10LUuINCV0YHQu9C4INC/0YPRgdGC0LDRjyAtINCy0L7Qt9Cy0YDQsNGJ0LDQtdC8IG51bGwuXG4gICAgcmV0dXJuIChwb2x5Z29uR3JvdXAuYW1vdW50T2ZWZXJ0aWNlcyA+IDApID8gcG9seWdvbkdyb3VwIDogbnVsbFxuICB9XG5cbiAgLyoqXG4gICAqINCh0L7Qt9C00LDQtdGCINCyINC80LDRgdGB0LjQstC1INCx0YPRhNC10YDQvtCyIFdlYkdMINC90L7QstGL0Lkg0LHRg9GE0LXRgCDQuCDQt9Cw0L/QuNGB0YvQstCw0LXRgiDQsiDQvdC10LPQviDQv9C10YDQtdC00LDQvdC90YvQtSDQtNCw0L3QvdGL0LUuXG4gICAqXG4gICAqIEBwYXJhbSBidWZmZXJzIC0g0JzQsNGB0YHQuNCyINCx0YPRhNC10YDQvtCyIFdlYkdMLCDQsiDQutC+0YLQvtGA0YvQuSDQsdGD0LTQtdGCINC00L7QsdCw0LLQu9C10L0g0YHQvtC30LTQsNCy0LDQtdC80YvQuSDQsdGD0YTQtdGALlxuICAgKiBAcGFyYW0gdHlwZSAtINCi0LjQvyDRgdC+0LfQtNCw0LLQsNC10LzQvtCz0L4g0LHRg9GE0LXRgNCwLlxuICAgKiBAcGFyYW0gZGF0YSAtINCU0LDQvdC90YvQtSDQsiDQstC40LTQtSDRgtC40L/QuNC30LjRgNC+0LLQsNC90L3QvtCz0L4g0LzQsNGB0YHQuNCy0LAg0LTQu9GPINC30LDQv9C40YHQuCDQsiDRgdC+0LfQtNCw0LLQsNC10LzRi9C5INCx0YPRhNC10YAuXG4gICAqIEBwYXJhbSBrZXkgLSDQmtC70Y7RhyAo0LjQvdC00LXQutGBKSwg0LjQtNC10L3RgtC40YTQuNGG0LjRgNGD0Y7RidC40Lkg0YLQuNC/INCx0YPRhNC10YDQsCAo0LTQu9GPINCy0LXRgNGI0LjQvSwg0LTQu9GPINGG0LLQtdGC0L7Qsiwg0LTQu9GPINC40L3QtNC10LrRgdC+0LIpLiDQmNGB0L/QvtC70YzQt9GD0LXRgtGB0Y8g0LTQu9GPXG4gICAqICAgICDRgNCw0LfQtNC10LvRjNC90L7Qs9C+INC/0L7QtNGB0YfQtdGC0LAg0L/QsNC80Y/RgtC4LCDQt9Cw0L3QuNC80LDQtdC80L7QuSDQutCw0LbQtNGL0Lwg0YLQuNC/0L7QvCDQsdGD0YTQtdGA0LAuXG4gICAqL1xuICBwcm90ZWN0ZWQgYWRkV2JHbEJ1ZmZlcihidWZmZXJzOiBXZWJHTEJ1ZmZlcltdLCB0eXBlOiBXZWJHbEJ1ZmZlclR5cGUsIGRhdGE6IFR5cGVkQXJyYXksIGtleTogbnVtYmVyKTogdm9pZCB7XG5cbiAgICAvLyDQntC/0YDQtdC00LXQu9C10L3QuNC1INC40L3QtNC10LrRgdCwINC90L7QstC+0LPQviDRjdC70LXQvNC10L3RgtCwINCyINC80LDRgdGB0LjQstC1INCx0YPRhNC10YDQvtCyIFdlYkdMLlxuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5idWZmZXJzLmFtb3VudE9mQnVmZmVyR3JvdXBzXG5cbiAgICAvLyDQodC+0LfQtNCw0L3QuNC1INC4INC30LDQv9C+0LvQvdC10L3QuNC1INC00LDQvdC90YvQvNC4INC90L7QstC+0LPQviDQsdGD0YTQtdGA0LAuXG4gICAgYnVmZmVyc1tpbmRleF0gPSB0aGlzLmdsLmNyZWF0ZUJ1ZmZlcigpIVxuICAgIHRoaXMuZ2wuYmluZEJ1ZmZlcih0aGlzLmdsW3R5cGVdLCBidWZmZXJzW2luZGV4XSlcbiAgICB0aGlzLmdsLmJ1ZmZlckRhdGEodGhpcy5nbFt0eXBlXSwgZGF0YSwgdGhpcy5nbC5TVEFUSUNfRFJBVylcblxuICAgIC8vINCh0YfQtdGC0YfQuNC6INC/0LDQvNGP0YLQuCwg0LfQsNC90LjQvNCw0LXQvNC+0Lkg0LHRg9GE0LXRgNCw0LzQuCDQtNCw0L3QvdGL0YUgKNGA0LDQt9C00LXQu9GM0L3QviDQv9C+INC60LDQttC00L7QvNGDINGC0LjQv9GDINCx0YPRhNC10YDQvtCyKVxuICAgIHRoaXMuYnVmZmVycy5zaXplSW5CeXRlc1trZXldICs9IGRhdGEubGVuZ3RoICogZGF0YS5CWVRFU19QRVJfRUxFTUVOVFxuICB9XG5cbiAgLyoqXG4gICAqINCS0YvRh9C40YHQu9GP0LXRgiDQutC+0L7RgNC00LjQvdCw0YLRiyDQstC10YDRiNC40L0g0L/QvtC70LjQs9C+0L3QsCDRgtGA0LXRg9Cz0L7Qu9GM0L3QvtC5INGE0L7RgNC80YsuXG4gICAqXG4gICAqIEBwYXJhbSB4IC0g0J/QvtC70L7QttC10L3QuNC1INGG0LXQvdGC0YDQsCDQv9C+0LvQuNCz0L7QvdCwINC90LAg0L7RgdC4INCw0LHRgdGG0LjRgdGBLlxuICAgKiBAcGFyYW0geSAtINCf0L7Qu9C+0LbQtdC90LjQtSDRhtC10L3RgtGA0LAg0L/QvtC70LjQs9C+0L3QsCDQvdCwINC+0YHQuCDQvtGA0LTQuNC90LDRgi5cbiAgICogQHBhcmFtIGNvbnN0cyAtINCd0LDQsdC+0YAg0LLRgdC/0L7QvNC+0LPQsNGC0LXQu9GM0L3Ri9GFINC60L7QvdGB0YLQsNC90YIsINC40YHQv9C+0LvRjNC30YPQtdC80YvRhSDQtNC70Y8g0LLRi9GH0LjRgdC70LXQvdC40Y8g0LLQtdGA0YjQuNC9LlxuICAgKiBAcmV0dXJucyDQlNCw0L3QvdGL0LUg0L4g0LLQtdGA0YjQuNC90LDRhSDQv9C+0LvQuNCz0L7QvdCwLlxuICAgKi9cbiAgcHJvdGVjdGVkIGdldFZlcnRpY2VzT2ZUcmlhbmdsZSh4OiBudW1iZXIsIHk6IG51bWJlciwgY29uc3RzOiBhbnlbXSk6IFNQbG90UG9seWdvblZlcnRpY2VzIHtcblxuICAgIGNvbnN0IFt4MSwgeTFdID0gW3ggLSBjb25zdHNbMF0sIHkgKyBjb25zdHNbMl1dXG4gICAgY29uc3QgW3gyLCB5Ml0gPSBbeCwgeSAtIGNvbnN0c1sxXV1cbiAgICBjb25zdCBbeDMsIHkzXSA9IFt4ICsgY29uc3RzWzBdLCB5ICsgY29uc3RzWzJdXVxuXG4gICAgY29uc3QgdmVydGljZXMgPSB7XG4gICAgICB2YWx1ZXM6IFt4MSwgeTEsIHgyLCB5MiwgeDMsIHkzXSxcbiAgICAgIGluZGljZXM6IFswLCAxLCAyXVxuICAgIH1cblxuICAgIHJldHVybiB2ZXJ0aWNlc1xuICB9XG5cbiAgLyoqXG4gICAqINCS0YvRh9C40YHQu9GP0LXRgiDQutC+0L7RgNC00LjQvdCw0YLRiyDQstC10YDRiNC40L0g0L/QvtC70LjQs9C+0L3QsCDQutCy0LDQtNGA0LDRgtC90L7QuSDRhNC+0YDQvNGLLlxuICAgKlxuICAgKiBAcGFyYW0geCAtINCf0L7Qu9C+0LbQtdC90LjQtSDRhtC10L3RgtGA0LAg0L/QvtC70LjQs9C+0L3QsCDQvdCwINC+0YHQuCDQsNCx0YHRhtC40YHRgS5cbiAgICogQHBhcmFtIHkgLSDQn9C+0LvQvtC20LXQvdC40LUg0YbQtdC90YLRgNCwINC/0L7Qu9C40LPQvtC90LAg0L3QsCDQvtGB0Lgg0L7RgNC00LjQvdCw0YIuXG4gICAqIEBwYXJhbSBjb25zdHMgLSDQndCw0LHQvtGAINCy0YHQv9C+0LzQvtCz0LDRgtC10LvRjNC90YvRhSDQutC+0L3RgdGC0LDQvdGCLCDQuNGB0L/QvtC70YzQt9GD0LXQvNGL0YUg0LTQu9GPINCy0YvRh9C40YHQu9C10L3QuNGPINCy0LXRgNGI0LjQvS5cbiAgICogQHJldHVybnMg0JTQsNC90L3Ri9C1INC+INCy0LXRgNGI0LjQvdCw0YUg0L/QvtC70LjQs9C+0L3QsC5cbiAgICovXG4gIHByb3RlY3RlZCBnZXRWZXJ0aWNlc09mU3F1YXJlKHg6IG51bWJlciwgeTogbnVtYmVyLCBjb25zdHM6IGFueVtdKTogU1Bsb3RQb2x5Z29uVmVydGljZXMge1xuXG4gICAgY29uc3QgW3gxLCB5MV0gPSBbeCAtIGNvbnN0c1swXSwgeSAtIGNvbnN0c1swXV1cbiAgICBjb25zdCBbeDIsIHkyXSA9IFt4ICsgY29uc3RzWzBdLCB5ICsgY29uc3RzWzBdXVxuXG4gICAgY29uc3QgdmVydGljZXMgPSB7XG4gICAgICB2YWx1ZXM6IFt4MSwgeTEsIHgyLCB5MSwgeDIsIHkyLCB4MSwgeTJdLFxuICAgICAgaW5kaWNlczogWzAsIDEsIDIsIDAsIDIsIDNdXG4gICAgfVxuXG4gICAgcmV0dXJuIHZlcnRpY2VzXG4gIH1cblxuICAvKipcbiAgICog0JLRi9GH0LjRgdC70Y/QtdGCINC60L7QvtGA0LTQuNC90LDRgtGLINCy0LXRgNGI0LjQvSDQv9C+0LvQuNCz0L7QvdCwINC60YDRg9Cz0LvQvtC5INGE0L7RgNC80YsuXG4gICAqXG4gICAqIEBwYXJhbSB4IC0g0J/QvtC70L7QttC10L3QuNC1INGG0LXQvdGC0YDQsCDQv9C+0LvQuNCz0L7QvdCwINC90LAg0L7RgdC4INCw0LHRgdGG0LjRgdGBLlxuICAgKiBAcGFyYW0geSAtINCf0L7Qu9C+0LbQtdC90LjQtSDRhtC10L3RgtGA0LAg0L/QvtC70LjQs9C+0L3QsCDQvdCwINC+0YHQuCDQvtGA0LTQuNC90LDRgi5cbiAgICogQHBhcmFtIGNvbnN0cyAtINCd0LDQsdC+0YAg0LLRgdC/0L7QvNC+0LPQsNGC0LXQu9GM0L3Ri9GFINC60L7QvdGB0YLQsNC90YIsINC40YHQv9C+0LvRjNC30YPQtdC80YvRhSDQtNC70Y8g0LLRi9GH0LjRgdC70LXQvdC40Y8g0LLQtdGA0YjQuNC9LlxuICAgKiBAcmV0dXJucyDQlNCw0L3QvdGL0LUg0L4g0LLQtdGA0YjQuNC90LDRhSDQv9C+0LvQuNCz0L7QvdCwLlxuICAgKi9cbiAgcHJvdGVjdGVkIGdldFZlcnRpY2VzT2ZDaXJjbGUoeDogbnVtYmVyLCB5OiBudW1iZXIsIGNvbnN0czogYW55W10pOiBTUGxvdFBvbHlnb25WZXJ0aWNlcyB7XG5cbiAgICAvLyDQl9Cw0L3QtdGB0LXQvdC40LUg0LIg0L3QsNCx0L7RgCDQstC10YDRiNC40L0g0YbQtdC90YLRgNCwINC60YDRg9Cz0LAuXG4gICAgY29uc3QgdmVydGljZXM6IFNQbG90UG9seWdvblZlcnRpY2VzID0ge1xuICAgICAgdmFsdWVzOiBbeCwgeV0sXG4gICAgICBpbmRpY2VzOiBbXVxuICAgIH1cblxuICAgIC8vINCU0L7QsdCw0LLQu9C10L3QuNC1INCw0L/RgNC+0LrRgdC40LzQuNGA0YPRjtGJ0LjRhSDQvtC60YDRg9C20L3QvtGB0YLRjCDQutGA0YPQs9CwINCy0LXRgNGI0LjQvS5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbnN0c1szXS5sZW5ndGg7IGkrKykge1xuICAgICAgdmVydGljZXMudmFsdWVzLnB1c2goeCArIGNvbnN0c1szXVtpXSwgeSArIGNvbnN0c1s0XVtpXSlcbiAgICAgIHZlcnRpY2VzLmluZGljZXMucHVzaCgwLCBpICsgMSwgaSArIDIpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog0J/QvtGB0LvQtdC00L3Rj9GPINCy0LXRgNGI0LjQvdCwINC/0L7RgdC70LXQtNC90LXQs9C+IEdMLdGC0YDQtdGD0LPQvtC70YzQvdC40LrQsCDQt9Cw0LzQtdC90Y/QtdGC0YHRjyDQvdCwINC/0LXRgNCy0YPRjiDQsNC/0YDQvtC60YHQuNC80LjRgNGD0Y7RidGD0Y5cbiAgICAgKiDQvtC60YDRg9C20L3QvtGB0YLRjCDQutGA0YPQs9CwINCy0LXRgNGI0LjQvdGDLCDQt9Cw0LzRi9C60LDRjyDQsNC/0YDQvtC60YHQuNC80LjRgNGD0YnQuNC5INC60YDRg9CzINC/0L7Qu9C40LPQvtC9LlxuICAgICAqL1xuICAgIHZlcnRpY2VzLmluZGljZXNbdmVydGljZXMuaW5kaWNlcy5sZW5ndGggLSAxXSA9IDFcblxuICAgIHJldHVybiB2ZXJ0aWNlc1xuICB9XG5cbiAgLyoqXG4gICAqINCh0L7Qt9C00LDQtdGCINC4INC00L7QsdCw0LLQu9GP0LXRgiDQsiDQs9GA0YPQv9C/0YMg0L/QvtC70LjQs9C+0L3QvtCyINC90L7QstGL0Lkg0L/QvtC70LjQs9C+0L0uXG4gICAqXG4gICAqIEBwYXJhbSBwb2x5Z29uR3JvdXAgLSDQk9GA0YPQv9C/0LAg0L/QvtC70LjQs9C+0L3QvtCyLCDQsiDQutC+0YLQvtGA0YPRjiDQv9GA0L7QuNGB0YXQvtC00LjRgiDQtNC+0LHQsNCy0LvQtdC90LjQtS5cbiAgICogQHBhcmFtIHBvbHlnb24gLSDQmNC90YTQvtGA0LzQsNGG0LjRjyDQviDQtNC+0LHQsNCy0LvRj9C10LzQvtC8INC/0L7Qu9C40LPQvtC90LUuXG4gICAqL1xuICBwcm90ZWN0ZWQgYWRkUG9seWdvbihwb2x5Z29uR3JvdXA6IFNQbG90UG9seWdvbkdyb3VwLCBwb2x5Z29uOiBTUGxvdFBvbHlnb24pOiB2b2lkIHtcblxuICAgIC8qKlxuICAgICAqINCSINC30LDQstC40YHQuNC80L7RgdGC0Lgg0L7RgiDRhNC+0YDQvNGLINC/0L7Qu9C40LPQvtC90LAg0Lgg0LrQvtC+0YDQtNC40L3QsNGCINC10LPQviDRhtC10L3RgtGA0LAg0LLRi9C30YvQstCw0LXRgtGB0Y8g0YHQvtC+0YLQstC10YLRgdCy0YPRjtGJ0LDRjyDRhNGD0L3QutGG0LjRjyDQvdCw0YXQvtC20LTQtdC90LjRjyDQutC+0L7RgNC00LjQvdCw0YIg0LXQs9C+XG4gICAgICog0LLQtdGA0YjQuNC9LlxuICAgICAqL1xuICAgIGNvbnN0IHZlcnRpY2VzID0gdGhpcy5zaGFwZXNbcG9seWdvbi5zaGFwZV0uY2FsYyhcbiAgICAgIHBvbHlnb24ueCwgcG9seWdvbi55LCB0aGlzLlVTRUZVTF9DT05TVFNcbiAgICApXG5cbiAgICAvLyDQmtC+0LvQuNGH0LXRgdGC0LLQviDQstC10YDRiNC40L0gLSDRjdGC0L4g0LrQvtC70LjRh9C10YHRgtCy0L4g0L/QsNGAINGH0LjRgdC10Lsg0LIg0LzQsNGB0YHQuNCy0LUg0LLQtdGA0YjQuNC9LlxuICAgIGNvbnN0IGFtb3VudE9mVmVydGljZXMgPSBNYXRoLnRydW5jKHZlcnRpY2VzLnZhbHVlcy5sZW5ndGggLyAyKVxuXG4gICAgLy8g0J3QsNGF0L7QttC00LXQvdC40LUg0LjQvdC00LXQutGB0LAg0L/QtdGA0LLQvtC5INC00L7QsdCw0LLQu9GP0LXQvNC+0Lkg0LIg0LPRgNGD0L/Qv9GDINC/0L7Qu9C40LPQvtC90L7QsiDQstC10YDRiNC40L3Riy5cbiAgICBjb25zdCBpbmRleE9mTGFzdFZlcnRleCA9IHBvbHlnb25Hcm91cC5hbW91bnRPZlZlcnRpY2VzXG5cbiAgICAvKipcbiAgICAgKiDQndC+0LzQtdGA0LAg0LjQvdC00LXQutGB0L7QsiDQstC10YDRiNC40L0gLSDQvtGC0L3QvtGB0LjRgtC10LvRjNC90YvQtS4g0JTQu9GPINCy0YvRh9C40YHQu9C10L3QuNGPINCw0LHRgdC+0LvRjtGC0L3Ri9GFINC40L3QtNC10LrRgdC+0LIg0L3QtdC+0LHRhdC+0LTQuNC80L4g0L/RgNC40LHQsNCy0LjRgtGMINC6INC+0YLQvdC+0YHQuNGC0LXQu9GM0L3Ri9C8XG4gICAgICog0LjQvdC00LXQutGB0LDQvCDQuNC90LTQtdC60YEg0L/QtdGA0LLQvtC5INC00L7QsdCw0LLQu9GP0LXQvNC+0Lkg0LIg0LPRgNGD0L/Qv9GDINC/0L7Qu9C40LPQvtC90L7QsiDQstC10YDRiNC40L3Riy5cbiAgICAgKi9cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZlcnRpY2VzLmluZGljZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZlcnRpY2VzLmluZGljZXNbaV0gKz0gaW5kZXhPZkxhc3RWZXJ0ZXhcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDQlNC+0LHQsNCy0LvQtdC90LjQtSDQsiDQs9GA0YPQv9C/0YMg0L/QvtC70LjQs9C+0L3QvtCyINC40L3QtNC10LrRgdC+0LIg0LLQtdGA0YjQuNC9INC90L7QstC+0LPQviDQv9C+0LvQuNCz0L7QvdCwINC4INC/0L7QtNGB0YfQtdGCINC+0LHRidC10LPQviDQutC+0LvQuNGH0LXRgdGC0LLQsCDQstC10YDRiNC40L0gR0wt0YLRgNC10YPQs9C+0LvRjNC90LjQutC+0LJcbiAgICAgKiDQsiDQs9GA0YPQv9C/0LUuXG4gICAgICovXG4gICAgcG9seWdvbkdyb3VwLmluZGljZXMucHVzaCguLi52ZXJ0aWNlcy5pbmRpY2VzKVxuICAgIHBvbHlnb25Hcm91cC5hbW91bnRPZkdMVmVydGljZXMgKz0gdmVydGljZXMuaW5kaWNlcy5sZW5ndGhcblxuICAgIC8vINCU0L7QsdCw0LLQu9C10L3QuNC1INCyINCz0YDRg9C/0L/RgyDQv9C+0LvQuNCz0L7QvdC+0LIg0LLQtdGA0YjQuNC9INC90L7QstC+0LPQviDQv9C+0LvQuNCz0L7QvdCwINC4INC/0L7QtNGB0YfQtdGCINC+0LHRidC10LPQviDQutC+0LvQuNGH0LXRgdGC0LLQsCDQstC10YDRiNC40L0g0LIg0LPRgNGD0L/Qv9C1LlxuICAgIHBvbHlnb25Hcm91cC52ZXJ0aWNlcy5wdXNoKC4uLnZlcnRpY2VzLnZhbHVlcylcbiAgICBwb2x5Z29uR3JvdXAuYW1vdW50T2ZWZXJ0aWNlcyArPSBhbW91bnRPZlZlcnRpY2VzXG5cbiAgICAvLyDQlNC+0LHQsNCy0LvQtdC90LjQtSDRhtCy0LXRgtC+0LIg0LLQtdGA0YjQuNC9IC0g0L/QviDQvtC00L3QvtC80YMg0YbQstC10YLRgyDQvdCwINC60LDQttC00YPRjiDQstC10YDRiNC40L3Rgy5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFtb3VudE9mVmVydGljZXM7IGkrKykge1xuICAgICAgcG9seWdvbkdyb3VwLmNvbG9ycy5wdXNoKHBvbHlnb24uY29sb3IpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqINCS0YvQstC+0LTQuNGCINCx0LDQt9C+0LLRg9GOINGH0LDRgdGC0Ywg0L7RgtC70LDQtNC+0YfQvdC+0Lkg0LjQvdGE0L7RgNC80LDRhtC40LguXG4gICAqXG4gICAqIEBwYXJhbSBvcHRpb25zIC0g0J/QvtC70YzQt9C+0LLQsNGC0LXQu9GM0YHQutC40LUg0L3QsNGB0YLRgNC+0LnQutC4INGN0LrQt9C10LzQv9C70Y/RgNCwLlxuICAgKi9cbiAgcHJvdGVjdGVkIHJlcG9ydE1haW5JbmZvKG9wdGlvbnM6IFNQbG90T3B0aW9ucyk6IHZvaWQge1xuXG4gICAgY29uc29sZS5sb2coJyVj0JLQutC70Y7Rh9C10L0g0YDQtdC20LjQvCDQvtGC0LvQsNC00LrQuCAnICsgdGhpcy5jb25zdHJ1Y3Rvci5uYW1lICsgJyBbIycgKyB0aGlzLmNhbnZhcy5pZCArICddJyxcbiAgICAgIHRoaXMuZGVidWdTdHlsZSArICcgYmFja2dyb3VuZC1jb2xvcjogI2NjMDAwMDsnKVxuXG4gICAgaWYgKHRoaXMuZGVtb01vZGUuaXNFbmFibGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKCclY9CS0LrQu9GO0YfQtdC9INC00LXQvNC+0L3RgdGC0YDQsNGG0LjQvtC90L3Ri9C5INGA0LXQttC40Lwg0LTQsNC90L3Ri9GFJywgdGhpcy5kZWJ1Z1N0eWxlKVxuICAgIH1cblxuICAgIGNvbnNvbGUuZ3JvdXAoJyVj0J/RgNC10LTRg9C/0YDQtdC20LTQtdC90LjQtScsIHRoaXMuZGVidWdTdHlsZSlcbiAgICB7XG4gICAgICBjb25zb2xlLmRpcign0J7RgtC60YDRi9GC0LDRjyDQutC+0L3RgdC+0LvRjCDQsdGA0LDRg9C30LXRgNCwINC4INC00YDRg9Cz0LjQtSDQsNC60YLQuNCy0L3Ri9C1INGB0YDQtdC00YHRgtCy0LAg0LrQvtC90YLRgNC+0LvRjyDRgNCw0LfRgNCw0LHQvtGC0LrQuCDRgdGD0YnQtdGB0YLQstC10L3QvdC+INGB0L3QuNC20LDRjtGCINC/0YDQvtC40LfQstC+0LTQuNGC0LXQu9GM0L3QvtGB0YLRjCDQstGL0YHQvtC60L7QvdCw0LPRgNGD0LbQtdC90L3Ri9GFINC/0YDQuNC70L7QttC10L3QuNC5LiDQlNC70Y8g0L7QsdGK0LXQutGC0LjQstC90L7Qs9C+INCw0L3QsNC70LjQt9CwINC/0YDQvtC40LfQstC+0LTQuNGC0LXQu9GM0L3QvtGB0YLQuCDQstGB0LUg0L/QvtC00L7QsdC90YvQtSDRgdGA0LXQtNGB0YLQstCwINC00L7Qu9C20L3RiyDQsdGL0YLRjCDQvtGC0LrQu9GO0YfQtdC90YssINCwINC60L7QvdGB0L7Qu9GMINCx0YDQsNGD0LfQtdGA0LAg0LfQsNC60YDRi9GC0LAuINCd0LXQutC+0YLQvtGA0YvQtSDQtNCw0L3QvdGL0LUg0L7RgtC70LDQtNC+0YfQvdC+0Lkg0LjQvdGE0L7RgNC80LDRhtC40Lgg0LIg0LfQsNCy0LjRgdC40LzQvtGB0YLQuCDQvtGCINC40YHQv9C+0LvRjNC30YPQtdC80L7Qs9C+INCx0YDQsNGD0LfQtdGA0LAg0LzQvtCz0YPRgiDQvdC1INC+0YLQvtCx0YDQsNC20LDRgtGM0YHRjyDQuNC70Lgg0L7RgtC+0LHRgNCw0LbQsNGC0YzRgdGPINC90LXQutC+0YDRgNC10LrRgtC90L4uINCh0YDQtdC00YHRgtCy0L4g0L7RgtC70LDQtNC60Lgg0L/RgNC+0YLQtdGB0YLQuNGA0L7QstCw0L3QviDQsiDQsdGA0LDRg9C30LXRgNC1IEdvb2dsZSBDaHJvbWUgdi45MCcpXG4gICAgfVxuICAgIGNvbnNvbGUuZ3JvdXBFbmQoKVxuXG4gICAgY29uc29sZS5ncm91cCgnJWPQktC40LTQtdC+0YHQuNGB0YLQtdC80LAnLCB0aGlzLmRlYnVnU3R5bGUpXG4gICAge1xuICAgICAgbGV0IGV4dCA9IHRoaXMuZ2wuZ2V0RXh0ZW5zaW9uKCdXRUJHTF9kZWJ1Z19yZW5kZXJlcl9pbmZvJylcbiAgICAgIGxldCBncmFwaGljc0NhcmROYW1lID0gKGV4dCkgPyB0aGlzLmdsLmdldFBhcmFtZXRlcihleHQuVU5NQVNLRURfUkVOREVSRVJfV0VCR0wpIDogJ1vQvdC10LjQt9Cy0LXRgdGC0L3Qvl0nXG4gICAgICBjb25zb2xlLmxvZygn0JPRgNCw0YTQuNGH0LXRgdC60LDRjyDQutCw0YDRgtCwOiAnICsgZ3JhcGhpY3NDYXJkTmFtZSlcbiAgICAgIGNvbnNvbGUubG9nKCfQktC10YDRgdC40Y8gR0w6ICcgKyB0aGlzLmdsLmdldFBhcmFtZXRlcih0aGlzLmdsLlZFUlNJT04pKVxuICAgIH1cbiAgICBjb25zb2xlLmdyb3VwRW5kKClcblxuICAgIGNvbnNvbGUuZ3JvdXAoJyVj0J3QsNGB0YLRgNC+0LnQutCwINC/0LDRgNCw0LzQtdGC0YDQvtCyINGN0LrQt9C10LzQv9C70Y/RgNCwJywgdGhpcy5kZWJ1Z1N0eWxlKVxuICAgIHtcbiAgICAgIGNvbnNvbGUuZGlyKHRoaXMpXG4gICAgICBjb25zb2xlLmxvZygn0JfQsNC00LDQvdGLINC/0LDRgNCw0LzQtdGC0YDRizpcXG4nLCBKU09OLnN0cmluZ2lmeShvcHRpb25zLCBudWxsLCAnICcpKVxuICAgICAgY29uc29sZS5sb2coJ9Ca0LDQvdCy0LDRgTogIycgKyB0aGlzLmNhbnZhcy5pZClcbiAgICAgIGNvbnNvbGUubG9nKCfQoNCw0LfQvNC10YAg0LrQsNC90LLQsNGB0LA6ICcgKyB0aGlzLmNhbnZhcy53aWR0aCArICcgeCAnICsgdGhpcy5jYW52YXMuaGVpZ2h0ICsgJyBweCcpXG4gICAgICBjb25zb2xlLmxvZygn0KDQsNC30LzQtdGAINC/0LvQvtGB0LrQvtGB0YLQuDogJyArIHRoaXMuZ3JpZFNpemUud2lkdGggKyAnIHggJyArIHRoaXMuZ3JpZFNpemUuaGVpZ2h0ICsgJyBweCcpXG4gICAgICBjb25zb2xlLmxvZygn0KDQsNC30LzQtdGAINC/0L7Qu9C40LPQvtC90LA6ICcgKyB0aGlzLnBvbHlnb25TaXplICsgJyBweCcpXG4gICAgICBjb25zb2xlLmxvZygn0JDQv9GA0L7QutGB0LjQvNCw0YbQuNGPINC+0LrRgNGD0LbQvdC+0YHRgtC4OiAnICsgdGhpcy5jaXJjbGVBcHByb3hMZXZlbCArICcg0YPQs9C70L7QsicpXG4gICAgICBjb25zb2xlLmxvZygn0KTRg9C90LrRhtC40Y8g0L/QtdGA0LXQsdC+0YDQsDogJyArIHRoaXMuaXRlcmF0aW9uQ2FsbGJhY2shLm5hbWUpXG4gICAgfVxuICAgIGNvbnNvbGUuZ3JvdXBFbmQoKVxuICB9XG5cbiAgLyoqXG4gICAqINCS0YvQstC+0LTQuNGCINCyINC60L7QvdGB0L7Qu9GMINC+0YLQu9Cw0LTQvtGH0L3Rg9GOINC40L3RhNC+0YDQvNCw0YbQuNGOINC+INC30LDQs9GA0YPQt9C60LUg0LTQsNC90L3Ri9GFINCyINCy0LjQtNC10L7Qv9Cw0LzRj9GC0YwuXG4gICAqL1xuICBwcm90ZWN0ZWQgcmVwb3J0QWJvdXRPYmplY3RSZWFkaW5nKCk6IHZvaWQge1xuXG4gICAgY29uc29sZS5ncm91cCgnJWPQl9Cw0LPRgNGD0LfQutCwINC00LDQvdC90YvRhSDQt9Cw0LLQtdGA0YjQtdC90LAgWycgKyB0aGlzLmdldEN1cnJlbnRUaW1lKCkgKyAnXScsIHRoaXMuZGVidWdTdHlsZSlcbiAgICB7XG4gICAgICBjb25zb2xlLnRpbWVFbmQoJ9CU0LvQuNGC0LXQu9GM0L3QvtGB0YLRjCcpXG5cbiAgICAgIGNvbnNvbGUubG9nKCfQoNC10LfRg9C70YzRgtCw0YI6ICcgK1xuICAgICAgICAoKHRoaXMuYW1vdW50T2ZQb2x5Z29ucyA+PSB0aGlzLm1heEFtb3VudE9mUG9seWdvbnMpID8gJ9C00L7RgdGC0LjQs9C90YPRgiDQt9Cw0LTQsNC90L3Ri9C5INC70LjQvNC40YIgKCcgK1xuICAgICAgICAgIHRoaXMubWF4QW1vdW50T2ZQb2x5Z29ucy50b0xvY2FsZVN0cmluZygpICsgJyknIDogJ9C+0LHRgNCw0LHQvtGC0LDQvdGLINCy0YHQtSDQvtCx0YrQtdC60YLRiycpKVxuXG4gICAgICBjb25zb2xlLmdyb3VwKCfQmtC+0Lst0LLQviDQvtCx0YrQtdC60YLQvtCyOiAnICsgdGhpcy5hbW91bnRPZlBvbHlnb25zLnRvTG9jYWxlU3RyaW5nKCkpXG4gICAgICB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zaGFwZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBjb25zdCBzaGFwZUNhcGN0aW9uID0gdGhpcy5zaGFwZXNbaV0ubmFtZVxuICAgICAgICAgIGNvbnN0IHNoYXBlQW1vdW50ID0gdGhpcy5idWZmZXJzLmFtb3VudE9mU2hhcGVzW2ldXG4gICAgICAgICAgY29uc29sZS5sb2coc2hhcGVDYXBjdGlvbiArICc6ICcgKyBzaGFwZUFtb3VudC50b0xvY2FsZVN0cmluZygpICtcbiAgICAgICAgICAgICcgW34nICsgTWF0aC5yb3VuZCgxMDAgKiBzaGFwZUFtb3VudCAvIHRoaXMuYW1vdW50T2ZQb2x5Z29ucykgKyAnJV0nKVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc29sZS5sb2coJ9Cf0LDQu9C40YLRgNCwOiAnICsgdGhpcy5wb2x5Z29uUGFsZXR0ZS5sZW5ndGggKyAnINGG0LLQtdGC0L7QsicpXG4gICAgICB9XG4gICAgICBjb25zb2xlLmdyb3VwRW5kKClcblxuICAgICAgbGV0IGJ5dGVzVXNlZEJ5QnVmZmVycyA9IHRoaXMuYnVmZmVycy5zaXplSW5CeXRlc1swXSArIHRoaXMuYnVmZmVycy5zaXplSW5CeXRlc1sxXSArIHRoaXMuYnVmZmVycy5zaXplSW5CeXRlc1syXVxuXG4gICAgICBjb25zb2xlLmdyb3VwKCfQl9Cw0L3Rj9GC0L4g0LLQuNC00LXQvtC/0LDQvNGP0YLQuDogJyArIChieXRlc1VzZWRCeUJ1ZmZlcnMgLyAxMDAwMDAwKS50b0ZpeGVkKDIpLnRvTG9jYWxlU3RyaW5nKCkgKyAnINCc0JEnKVxuICAgICAge1xuICAgICAgICBjb25zb2xlLmxvZygn0JHRg9GE0LXRgNGLINCy0LXRgNGI0LjQvTogJyArXG4gICAgICAgICAgKHRoaXMuYnVmZmVycy5zaXplSW5CeXRlc1swXSAvIDEwMDAwMDApLnRvRml4ZWQoMikudG9Mb2NhbGVTdHJpbmcoKSArICcg0JzQkScgK1xuICAgICAgICAgICcgW34nICsgTWF0aC5yb3VuZCgxMDAgKiB0aGlzLmJ1ZmZlcnMuc2l6ZUluQnl0ZXNbMF0gLyBieXRlc1VzZWRCeUJ1ZmZlcnMpICsgJyVdJylcblxuICAgICAgICBjb25zb2xlLmxvZygn0JHRg9GE0LXRgNGLINGG0LLQtdGC0L7QsjogJ1xuICAgICAgICAgICsgKHRoaXMuYnVmZmVycy5zaXplSW5CeXRlc1sxXSAvIDEwMDAwMDApLnRvRml4ZWQoMikudG9Mb2NhbGVTdHJpbmcoKSArICcg0JzQkScgK1xuICAgICAgICAgICcgW34nICsgTWF0aC5yb3VuZCgxMDAgKiB0aGlzLmJ1ZmZlcnMuc2l6ZUluQnl0ZXNbMV0gLyBieXRlc1VzZWRCeUJ1ZmZlcnMpICsgJyVdJylcblxuICAgICAgICBjb25zb2xlLmxvZygn0JHRg9GE0LXRgNGLINC40L3QtNC10LrRgdC+0LI6ICdcbiAgICAgICAgICArICh0aGlzLmJ1ZmZlcnMuc2l6ZUluQnl0ZXNbMl0gLyAxMDAwMDAwKS50b0ZpeGVkKDIpLnRvTG9jYWxlU3RyaW5nKCkgKyAnINCc0JEnICtcbiAgICAgICAgICAnIFt+JyArIE1hdGgucm91bmQoMTAwICogdGhpcy5idWZmZXJzLnNpemVJbkJ5dGVzWzJdIC8gYnl0ZXNVc2VkQnlCdWZmZXJzKSArICclXScpXG4gICAgICB9XG4gICAgICBjb25zb2xlLmdyb3VwRW5kKClcblxuICAgICAgY29uc29sZS5sb2coJ9Ca0L7Quy3QstC+INCz0YDRg9C/0L8g0LHRg9GE0LXRgNC+0LI6ICcgKyB0aGlzLmJ1ZmZlcnMuYW1vdW50T2ZCdWZmZXJHcm91cHMudG9Mb2NhbGVTdHJpbmcoKSlcbiAgICAgIGNvbnNvbGUubG9nKCfQmtC+0Lst0LLQviBHTC3RgtGA0LXRg9Cz0L7Qu9GM0L3QuNC60L7QsjogJyArICh0aGlzLmJ1ZmZlcnMuYW1vdW50T2ZUb3RhbEdMVmVydGljZXMgLyAzKS50b0xvY2FsZVN0cmluZygpKVxuICAgICAgY29uc29sZS5sb2coJ9Ca0L7Quy3QstC+INCy0LXRgNGI0LjQvTogJyArIHRoaXMuYnVmZmVycy5hbW91bnRPZlRvdGFsVmVydGljZXMudG9Mb2NhbGVTdHJpbmcoKSlcbiAgICB9XG4gICAgY29uc29sZS5ncm91cEVuZCgpXG4gIH1cblxuICAvKipcbiAgICog0KHQvtC30LTQsNC10YIg0LTQvtC/0L7Qu9C90LXQvdC40LUg0Log0LrQvtC00YMg0L3QsCDRj9C30YvQutC1IEdMU0wuXG4gICAqXG4gICAqIEByZW1hcmtzXG4gICAqINCSINC00LDQu9GM0L3QtdC50YjQtdC8INGB0L7Qt9C00LDQvdC90YvQuSDQutC+0LQg0LHRg9C00LXRgiDQstGB0YLRgNC+0LXQvSDQsiDQutC+0LQg0LLQtdGA0YjQuNC90L3QvtCz0L4g0YjQtdC50LTQtdGA0LAg0LTQu9GPINC30LDQtNCw0L3QuNGPINGG0LLQtdGC0LAg0LLQtdGA0YjQuNC90Ysg0LIg0LfQsNCy0LjRgdC40LzQvtGB0YLQuCDQvtGCXG4gICAqINC40L3QtNC10LrRgdCwINGG0LLQtdGC0LAsINC/0YDQuNGB0LLQvtC10L3QvdC+0LPQviDRjdGC0L7QuSDQstC10YDRiNC40L3QtS4g0KIu0LouINGI0LXQudC00LXRgCDQvdC1INC/0L7Qt9Cy0L7Qu9GP0LXRgiDQuNGB0L/QvtC70YzQt9C+0LLQsNGC0Ywg0LIg0LrQsNGH0LXRgdGC0LLQtSDQuNC90LTQtdC60YHQvtCyINC/0LXRgNC10LzQtdC90L3Ri9C1IC1cbiAgICog0LTQu9GPINC30LDQtNCw0L3QuNGPINGG0LLQtdGC0LAg0LjRgdC/0L7Qu9GM0LfRg9C10YLRgdGPINC/0LXRgNC10LHQvtGAINGG0LLQtdGC0L7QstGL0YUg0LjQvdC00LXQutGB0L7Qsi5cbiAgICpcbiAgICogQHJldHVybnMg0JrQvtC0INC90LAg0Y/Qt9GL0LrQtSBHTFNMLlxuICAgKi9cbiAgcHJvdGVjdGVkIGdlblNoYWRlckNvbG9yQ29kZSgpOiBzdHJpbmcge1xuXG4gICAgLy8g0JLRgNC10LzQtdC90L3QvtC1INC00L7QsdCw0LLQu9C10L3QuNC1INCyINC/0LDQu9C40YLRgNGDINGG0LLQtdGC0L7QsiDQstC10YDRiNC40L0g0YbQstC10YLQsCDQvdCw0L/RgNCw0LLQu9GP0Y7RidC40YUuXG4gICAgdGhpcy5wb2x5Z29uUGFsZXR0ZS5wdXNoKHRoaXMucnVsZXNDb2xvcilcblxuICAgIGxldCBjb2RlOiBzdHJpbmcgPSAnJ1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBvbHlnb25QYWxldHRlLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgIC8vINCf0L7Qu9GD0YfQtdC90LjQtSDRhtCy0LXRgtCwINCyINC90YPQttC90L7QvCDRhNC+0YDQvNCw0YLQtS5cbiAgICAgIGxldCBbciwgZywgYl0gPSB0aGlzLmNvbnZlcnRDb2xvcih0aGlzLnBvbHlnb25QYWxldHRlW2ldKVxuXG4gICAgICAvLyDQpNC+0YDQvNC40YDQvtCy0L3QuNC1INGB0YLRgNC+0LogR0xTTC3QutC+0LTQsCDQv9GA0L7QstC10YDQutC4INC40L3QtNC10LrRgdCwINGG0LLQtdGC0LAuXG4gICAgICBjb2RlICs9ICgoaSA9PT0gMCkgPyAnJyA6ICcgIGVsc2UgJykgKyAnaWYgKGFfY29sb3IgPT0gJyArIGkgKyAnLjApIHZfY29sb3IgPSB2ZWMzKCcgK1xuICAgICAgICByLnRvU3RyaW5nKCkuc2xpY2UoMCwgOSkgKyAnLCcgK1xuICAgICAgICBnLnRvU3RyaW5nKCkuc2xpY2UoMCwgOSkgKyAnLCcgK1xuICAgICAgICBiLnRvU3RyaW5nKCkuc2xpY2UoMCwgOSkgKyAnKTtcXG4nXG4gICAgfVxuXG4gICAgLy8g0KPQtNCw0LvQtdC90LjQtSDQuNC3INC/0LDQu9C40YLRgNGLINCy0LXRgNGI0LjQvSDQstGA0LXQvNC10L3QvdC+INC00L7QsdCw0LLQu9C10L3QvdC+0LPQviDRhtCy0LXRgtCwINC90LDQv9GA0LDQstC70Y/RjtGJ0LjRhS5cbiAgICB0aGlzLnBvbHlnb25QYWxldHRlLnBvcCgpXG5cbiAgICByZXR1cm4gY29kZVxuICB9XG5cbiAgLyoqXG4gICAqINCa0L7QvdCy0LXRgNGC0LjRgNGD0LXRgiDRhtCy0LXRgiDQuNC3IEhFWC3Qv9GA0LXQtNGB0YLQsNCy0LvQtdC90LjRjyDQsiDQv9GA0LXQtNGB0YLQsNCy0LvQtdC90LjQtSDRhtCy0LXRgtCwINC00LvRjyBHTFNMLdC60L7QtNCwIChSR0Ig0YEg0LTQuNCw0L/QsNC30L7QvdCw0LzQuCDQt9C90LDRh9C10L3QuNC5INC+0YIgMCDQtNC+IDEpLlxuICAgKlxuICAgKiBAcGFyYW0gaGV4Q29sb3IgLSDQptCy0LXRgiDQsiBIRVgt0YTQvtGA0LzQsNGC0LUuXG4gICAqIEByZXR1cm5zINCc0LDRgdGB0LjQsiDQuNC3INGC0YDQtdGFINGH0LjRgdC10Lsg0LIg0LTQuNCw0L/QsNC30L7QvdC1INC+0YIgMCDQtNC+IDEuXG4gICAqL1xuICBwcm90ZWN0ZWQgY29udmVydENvbG9yKGhleENvbG9yOiBIRVhDb2xvcik6IG51bWJlcltdIHtcblxuICAgIGxldCBrID0gL14jPyhbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KSQvaS5leGVjKGhleENvbG9yKVxuICAgIGxldCBbciwgZywgYl0gPSBbcGFyc2VJbnQoayFbMV0sIDE2KSAvIDI1NSwgcGFyc2VJbnQoayFbMl0sIDE2KSAvIDI1NSwgcGFyc2VJbnQoayFbM10sIDE2KSAvIDI1NV1cblxuICAgIHJldHVybiBbciwgZywgYl1cbiAgfVxuXG4gIC8qKlxuICAgKiDQktGL0YfQuNGB0LvRj9C10YIg0YLQtdC60YPRidC10LUg0LLRgNC10LzRjy5cbiAgICpcbiAgICogQHJldHVybnMg0KHRgtGA0L7QutC+0LLQsNGPINGE0L7RgNC80LDRgtC40YDQvtCy0LDQvdC90LDRjyDQt9Cw0L/QuNGB0Ywg0YLQtdC60YPRidC10LPQviDQstGA0LXQvNC10L3QuC5cbiAgICovXG4gIHByb3RlY3RlZCBnZXRDdXJyZW50VGltZSgpOiBzdHJpbmcge1xuXG4gICAgbGV0IHRvZGF5ID0gbmV3IERhdGUoKTtcblxuICAgIGxldCB0aW1lID1cbiAgICAgICgodG9kYXkuZ2V0SG91cnMoKSA8IDEwID8gJzAnIDogJycpICsgdG9kYXkuZ2V0SG91cnMoKSkgKyBcIjpcIiArXG4gICAgICAoKHRvZGF5LmdldE1pbnV0ZXMoKSA8IDEwID8gJzAnIDogJycpICsgdG9kYXkuZ2V0TWludXRlcygpKSArIFwiOlwiICtcbiAgICAgICgodG9kYXkuZ2V0U2Vjb25kcygpIDwgMTAgPyAnMCcgOiAnJykgKyB0b2RheS5nZXRTZWNvbmRzKCkpXG5cbiAgICByZXR1cm4gdGltZVxuICB9XG5cbiAgLyoqXG4gICAqINCe0LHQvdC+0LLQu9GP0LXRgiDQvNCw0YLRgNC40YbRgyDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuC5cbiAgICpcbiAgICogQHJlbWFya3NcbiAgICog0KHRg9GJ0LXRgdGC0LLRg9C10YIg0LTQstCwINCy0LDRgNC40LDQvdGC0LAg0LLRi9C30L7QstCwINC80LXRgtC+0LTQsCAtINC40Lcg0LTRgNGD0LPQvtCz0L4g0LzQtdGC0L7QtNCwINGN0LrQt9C10LzQv9C70Y/RgNCwICh7QGxpbmsgcmVuZGVyfSkg0Lgg0LjQtyDQvtCx0YDQsNCx0L7RgtGH0LjQutCwINGB0L7QsdGL0YLQuNGPINC80YvRiNC4XG4gICAqICh7QGxpbmsgaGFuZGxlTW91c2VXaGVlbH0pLiDQktC+INCy0YLQvtGA0L7QvCDQstCw0YDQuNCw0L3RgtC1INC40YHQv9C+0LvRjNC30L7QstCw0L3QuNC1INC+0LHRitC10LrRgtCwIHRoaXMg0L3QtdCy0L7Qt9C80L7QttC90L4uINCU0LvRjyDRg9C90LjQstC10YDRgdCw0LvRjNC90L7RgdGC0Lgg0LLRi9C30L7QstCwXG4gICAqINC80LXRgtC+0LTQsCAtINCyINC90LXQs9C+INCy0YHQtdCz0LTQsCDRj9Cy0L3QviDQvdC10L7QsdGF0L7QtNC40LzQviDQv9C10YDQtdC00LDQstCw0YLRjCDRgdGB0YvQu9C60YMg0L3QsCDRjdC60LfQtdC80L/Qu9GP0YAg0LrQu9Cw0YHRgdCwLlxuICAgKlxuICAgKiBAcGFyYW0gJHRoaXMgLSDQrdC60LfQtdC80L/Qu9GP0YAg0LrQu9Cw0YHRgdCwLCDRh9GM0Y4g0LzQsNGC0YDQuNGG0YMg0YLRgNCw0L3RgdGE0L7RgNC80LDRhtC40Lgg0L3QtdC+0LHRhdC+0LTQuNC80L4g0L7QsdC90L7QstC40YLRjC5cbiAgICovXG4gIHByb3RlY3RlZCB1cGRhdGVUcmFuc01hdHJpeCgkdGhpczogU1Bsb3QpOiB2b2lkIHtcblxuICAgIGNvbnN0IHQxID0gJHRoaXMuY2FtZXJhLnpvb20gKiAkdGhpcy5VU0VGVUxfQ09OU1RTWzVdXG4gICAgY29uc3QgdDIgPSAkdGhpcy5jYW1lcmEuem9vbSAqICR0aGlzLlVTRUZVTF9DT05TVFNbNl1cblxuICAgICR0aGlzLnRyYW5zb3JtYXRpb24ubWF0cml4ID0gW1xuICAgICAgdDEsIDAsIDAsIDAsIC10MiwgMCwgLSR0aGlzLmNhbWVyYS54ICogdDEgLSAxLCAkdGhpcy5jYW1lcmEueSAqIHQyICsgMSwgMVxuICAgIF1cbiAgfVxuXG4gIC8qKlxuICAgKiDQoNC10LDQs9C40YDRg9C10YIg0L3QsCDQtNCy0LjQttC10L3QuNC1INC80YvRiNC4L9GC0YDQtdC60L/QsNC00LAg0LIg0LzQvtC80LXQvdGCLCDQutC+0LPQtNCwINC10LUv0LXQs9C+INC60LvQsNCy0LjRiNCwINGD0LTQtdGA0LbQuNCy0LDQtdGC0YHRjyDQvdCw0LbQsNGC0L7QuS5cbiAgICpcbiAgICogQHJlbWVya3NcbiAgICog0JzQtdGC0L7QtCDQv9C10YDQtdC80LXRidCw0LXRgiDQvtCx0LvQsNGB0YLRjCDQstC40LTQuNC80L7RgdGC0Lgg0L3QsCDQv9C70L7RgdC60L7RgdGC0Lgg0LLQvNC10YHRgtC1INGBINC00LLQuNC20LXQvdC40LXQvCDQvNGL0YjQuC/RgtGA0LXQutC/0LDQtNCwLiDQktGL0YfQuNGB0LvQtdC90LjRjyDQstC90YPRgtGA0Lgg0YHQvtCx0YvRgtC40Y8g0YHQtNC10LvQsNC90YtcbiAgICog0LzQsNC60YHQuNC80LDQu9GM0L3QviDQv9GA0L7QuNC30LLQvtC00LjRgtC10LvRjNC90YvQvNC4INCyINGD0YnQtdGA0LEg0YfQuNGC0LDQsdC10LvRjNC90L7RgdGC0Lgg0LvQvtCz0LjQutC4INC00LXQudGB0YLQstC40LkuINCS0L4g0LLQvdC10YjQvdC10Lwg0L7QsdGA0LDQsdC+0YLRh9C40LrQtSDRgdC+0LHRi9GC0LjQuSDQvtCx0YrQtdC60YIgdGhpc1xuICAgKiDQvdC10LTQvtGB0YLRg9C/0LXQvSDQv9C+0Y3RgtC+0LzRgyDQtNC+0YHRgtGD0L8g0Log0Y3QutC30LXQvNC/0LvRj9GA0YMg0LrQu9Cw0YHRgdCwINGA0LXQsNC70LjQt9GD0LXRgtGB0Y8g0YfQtdGA0LXQtyDRgdGC0LDRgtC40YfQtdGB0LrQuNC5INC80LDRgdGB0LjQsiDQstGB0LXRhSDRgdC+0LfQtNCw0L3QvdGL0YUg0Y3QutC30LXQvNC/0LvRj9GA0L7QslxuICAgKiDQutC70LDRgdGB0LAg0Lgg0LjQtNC10L3RgtC40YTQuNC60LDRgtC+0YDQsCDQutCw0L3QstCw0YHQsCwg0LLRi9GB0YLRg9C/0LDRjtGJ0LXQs9C+INC40L3QtNC10LrRgdC+0Lwg0LIg0Y3RgtC+0Lwg0LzQsNGB0YHQuNCy0LUuXG4gICAqXG4gICAqIEBwYXJhbSBldmVudCAtINCh0L7QsdGL0YLQuNC1INC80YvRiNC4L9GC0YDQtdC60L/QsNC00LAuXG4gICAqL1xuICBwcm90ZWN0ZWQgaGFuZGxlTW91c2VNb3ZlKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG5cbiAgICAvLyDQn9C+0LvRg9GH0LXQvdC40LUg0LTQvtGB0YLRg9C/0LAg0Log0L7QsdGK0LXQutGC0YMgdGhpcy5cbiAgICBjb25zdCAkdGhpcyA9IFNQbG90Lmluc3RhbmNlc1sgKGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudCkuaWQgXVxuXG4gICAgJHRoaXMuY2FtZXJhLnggPSAkdGhpcy50cmFuc29ybWF0aW9uLnN0YXJ0Q2FtZXJhWCArICR0aGlzLnRyYW5zb3JtYXRpb24uc3RhcnRQb3NYIC1cbiAgICAgICgoZXZlbnQuY2xpZW50WCAtICR0aGlzLlVTRUZVTF9DT05TVFNbOV0pICogJHRoaXMuVVNFRlVMX0NPTlNUU1s3XSAtIDEpICogJHRoaXMudHJhbnNvcm1hdGlvbi5zdGFydEludk1hdHJpeFswXSAtXG4gICAgICAkdGhpcy50cmFuc29ybWF0aW9uLnN0YXJ0SW52TWF0cml4WzZdXG5cbiAgICAkdGhpcy5jYW1lcmEueSA9ICR0aGlzLnRyYW5zb3JtYXRpb24uc3RhcnRDYW1lcmFZICsgJHRoaXMudHJhbnNvcm1hdGlvbi5zdGFydFBvc1kgLVxuICAgICAgKChldmVudC5jbGllbnRZIC0gJHRoaXMuVVNFRlVMX0NPTlNUU1sxMF0pICogJHRoaXMuVVNFRlVMX0NPTlNUU1s4XSArIDEpICogJHRoaXMudHJhbnNvcm1hdGlvbi5zdGFydEludk1hdHJpeFs0XSAtXG4gICAgICAkdGhpcy50cmFuc29ybWF0aW9uLnN0YXJ0SW52TWF0cml4WzddXG5cbiAgICAvLyDQoNC10L3QtNC10YDQuNC90LMg0YEg0L7QsdC90L7QstC70LXQvdC90YvQvNC4INC/0LDRgNCw0LzQtdGC0YDQsNC80Lgg0YLRgNCw0L3RgdGE0L7RgNC80LDRhtC40LguXG4gICAgJHRoaXMucmVuZGVyKClcbiAgfVxuXG4gIC8qKlxuICAgKiDQoNC10LDQs9C40YDRg9C10YIg0L3QsCDQvdCw0LbQsNGC0LjQtSDQutC70LDQstC40YjQuCDQvNGL0YjQuC/RgtGA0LXQutC/0LDQtNCwLlxuICAgKlxuICAgKiBAcmVtZXJrc1xuICAgKiDQkiDQvNC+0LzQtdC90YIg0L3QsNC20LDRgtC40Y8g0Lgg0YPQtNC10YDQttCw0L3QuNGPINC60LvQsNCy0LjRiNC4INC30LDQv9GD0YHQutCw0LXRgtGB0Y8g0LDQvdCw0LvQuNC3INC00LLQuNC20LXQvdC40Y8g0LzRi9GI0Lgv0YLRgNC10LrQv9Cw0LTQsCAo0YEg0LfQsNC20LDRgtC+0Lkg0LrQu9Cw0LLQuNGI0LXQuSkuINCS0YvRh9C40YHQu9C10L3QuNGPXG4gICAqINCy0L3Rg9GC0YDQuCDRgdC+0LHRi9GC0LjRjyDRgdC00LXQu9Cw0L3RiyDQvNCw0LrRgdC40LzQsNC70YzQvdC+INC/0YDQvtC40LfQstC+0LTQuNGC0LXQu9GM0L3Ri9C80Lgg0LIg0YPRidC10YDQsSDRh9C40YLQsNCx0LXQu9GM0L3QvtGB0YLQuCDQu9C+0LPQuNC60Lgg0LTQtdC50YHRgtCy0LjQuS4g0JLQviDQstC90LXRiNC90LXQvCDQvtCx0YDQsNCx0L7RgtGH0LjQutC1XG4gICAqINGB0L7QsdGL0YLQuNC5INC+0LHRitC10LrRgiB0aGlzINC90LXQtNC+0YHRgtGD0L/QtdC9INC/0L7RjdGC0L7QvNGDINC00L7RgdGC0YPQvyDQuiDRjdC60LfQtdC80L/Qu9GP0YDRgyDQutC70LDRgdGB0LAg0YDQtdCw0LvQuNC30YPQtdGC0YHRjyDRh9C10YDQtdC3INGB0YLQsNGC0LjRh9C10YHQutC40Lkg0LzQsNGB0YHQuNCyINCy0YHQtdGFXG4gICAqINGB0L7Qt9C00LDQvdC90YvRhSDRjdC60LfQtdC80L/Qu9GP0YDQvtCyINC60LvQsNGB0YHQsCDQuCDQuNC00LXQvdGC0LjRhNC40LrQsNGC0L7RgNCwINC60LDQvdCy0LDRgdCwLCDQstGL0YHRgtGD0L/QsNGO0YnQtdCz0L4g0LjQvdC00LXQutGB0L7QvCDQsiDRjdGC0L7QvCDQvNCw0YHRgdC40LLQtS5cbiAgICpcbiAgICogQHBhcmFtIGV2ZW50IC0g0KHQvtCx0YvRgtC40LUg0LzRi9GI0Lgv0YLRgNC10LrQv9Cw0LTQsC5cbiAgICovXG4gIHByb3RlY3RlZCBoYW5kbGVNb3VzZURvd24oZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcblxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcblxuICAgIC8vINCf0L7Qu9GD0YfQtdC90LjQtSDQtNC+0YHRgtGD0L/QsCDQuiDQvtCx0YrQtdC60YLRgyB0aGlzLlxuICAgIGNvbnN0ICR0aGlzID0gU1Bsb3QuaW5zdGFuY2VzWyhldmVudC50YXJnZXQgYXMgSFRNTEVsZW1lbnQpLmlkXVxuXG4gICAgLy8g0KHRgNCw0LfRgyDQv9C+0YHQu9C1INC90LDRh9Cw0LvQsCDRg9C00LXRgNC20LDQvdC40Y8g0LrQu9Cw0LLQuNGI0Lgg0LfQsNC/0YPRgdC60LXRgtGB0Y8gXCLQv9GA0L7RgdC70YPRiNC60LBcIiDRgdC+0LHRi9GC0LjQuSDQtNCy0LjQttC10L3QuNGPINC4INC+0YLQttCw0YLQuNGPINC60LvQsNCy0LjRiNC4LlxuICAgIGV2ZW50LnRhcmdldCEuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgJHRoaXMuaGFuZGxlTW91c2VNb3ZlIGFzIEV2ZW50TGlzdGVuZXIpXG4gICAgZXZlbnQudGFyZ2V0IS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgJHRoaXMuaGFuZGxlTW91c2VVcCBhcyBFdmVudExpc3RlbmVyKVxuXG4gICAgJHRoaXMudHJhbnNvcm1hdGlvbi5zdGFydEludk1hdHJpeCA9IFtcbiAgICAgIDEgLyAkdGhpcy50cmFuc29ybWF0aW9uLm1hdHJpeFswXSwgMCwgMCwgMCwgMSAvICR0aGlzLnRyYW5zb3JtYXRpb24ubWF0cml4WzRdLFxuICAgICAgMCwgLSR0aGlzLnRyYW5zb3JtYXRpb24ubWF0cml4WzZdIC8gJHRoaXMudHJhbnNvcm1hdGlvbi5tYXRyaXhbMF0sXG4gICAgICAtJHRoaXMudHJhbnNvcm1hdGlvbi5tYXRyaXhbN10gLyAkdGhpcy50cmFuc29ybWF0aW9uLm1hdHJpeFs0XSwgMVxuICAgIF07XG5cbiAgICAkdGhpcy50cmFuc29ybWF0aW9uLnN0YXJ0Q2FtZXJhWCA9ICR0aGlzLmNhbWVyYS54XG4gICAgJHRoaXMudHJhbnNvcm1hdGlvbi5zdGFydENhbWVyYVkgPSAkdGhpcy5jYW1lcmEueVxuXG4gICAgJHRoaXMudHJhbnNvcm1hdGlvbi5zdGFydFBvc1ggPVxuICAgICAgKChldmVudC5jbGllbnRYIC0gJHRoaXMuVVNFRlVMX0NPTlNUU1s5XSkgKiAkdGhpcy5VU0VGVUxfQ09OU1RTWzddIC0gMSkgKlxuICAgICAgJHRoaXMudHJhbnNvcm1hdGlvbi5zdGFydEludk1hdHJpeFswXSArICR0aGlzLnRyYW5zb3JtYXRpb24uc3RhcnRJbnZNYXRyaXhbNl1cblxuICAgICR0aGlzLnRyYW5zb3JtYXRpb24uc3RhcnRQb3NZID1cbiAgICAgICgoZXZlbnQuY2xpZW50WSAtICR0aGlzLlVTRUZVTF9DT05TVFNbMTBdKSAqICR0aGlzLlVTRUZVTF9DT05TVFNbOF0gKyAxKSAqXG4gICAgICAkdGhpcy50cmFuc29ybWF0aW9uLnN0YXJ0SW52TWF0cml4WzRdICsgJHRoaXMudHJhbnNvcm1hdGlvbi5zdGFydEludk1hdHJpeFs3XVxuICB9XG5cbiAgLyoqXG4gICAqINCg0LXQsNCz0LjRgNGD0LXRgiDQvdCwINC+0YLQttCw0YLQuNC1INC60LvQsNCy0LjRiNC4INC80YvRiNC4L9GC0YDQtdC60L/QsNC00LAuXG4gICAqXG4gICAqIEByZW1lcmtzXG4gICAqINCSINC80L7QvNC10L3RgiDQvtGC0LbQsNGC0LjRjyDQutC70LDQstC40YjQuCDQsNC90LDQu9C40Lcg0LTQstC40LbQtdC90LjRjyDQvNGL0YjQuC/RgtGA0LXQutC/0LDQtNCwINGBINC30LDQttCw0YLQvtC5INC60LvQsNCy0LjRiNC10Lkg0L/RgNC10LrRgNCw0YnQsNC10YLRgdGPLiDQktGL0YfQuNGB0LvQtdC90LjRjyDQstC90YPRgtGA0Lgg0YHQvtCx0YvRgtC40Y9cbiAgICog0YHQtNC10LvQsNC90Ysg0LzQsNC60YHQuNC80LDQu9GM0L3QviDQv9GA0L7QuNC30LLQvtC00LjRgtC10LvRjNC90YvQvNC4INCyINGD0YnQtdGA0LEg0YfQuNGC0LDQsdC10LvRjNC90L7RgdGC0Lgg0LvQvtCz0LjQutC4INC00LXQudGB0YLQstC40LkuINCS0L4g0LLQvdC10YjQvdC10Lwg0L7QsdGA0LDQsdC+0YLRh9C40LrQtSDRgdC+0LHRi9GC0LjQuSDQvtCx0YrQtdC60YJcbiAgICogdGhpcyDQvdC10LTQvtGB0YLRg9C/0LXQvSDQv9C+0Y3RgtC+0LzRgyDQtNC+0YHRgtGD0L8g0Log0Y3QutC30LXQvNC/0LvRj9GA0YMg0LrQu9Cw0YHRgdCwINGA0LXQsNC70LjQt9GD0LXRgtGB0Y8g0YfQtdGA0LXQtyDRgdGC0LDRgtC40YfQtdGB0LrQuNC5INC80LDRgdGB0LjQsiDQstGB0LXRhSDRgdC+0LfQtNCw0L3QvdGL0YUg0Y3QutC30LXQvNC/0LvRj9GA0L7QslxuICAgKiDQutC70LDRgdGB0LAg0Lgg0LjQtNC10L3RgtC40YTQuNC60LDRgtC+0YDQsCDQutCw0L3QstCw0YHQsCwg0LLRi9GB0YLRg9C/0LDRjtGJ0LXQs9C+INC40L3QtNC10LrRgdC+0Lwg0LIg0Y3RgtC+0Lwg0LzQsNGB0YHQuNCy0LUuXG4gICAqXG4gICAqIEBwYXJhbSBldmVudCAtINCh0L7QsdGL0YLQuNC1INC80YvRiNC4L9GC0YDQtdC60L/QsNC00LAuXG4gICAqL1xuICBwcm90ZWN0ZWQgaGFuZGxlTW91c2VVcChldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuXG4gICAgLy8g0J/QvtC70YPRh9C10L3QuNC1INC00L7RgdGC0YPQv9CwINC6INC+0LHRitC10LrRgtGDIHRoaXMuXG4gICAgY29uc3QgJHRoaXMgPSBTUGxvdC5pbnN0YW5jZXNbKGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudCkuaWRdXG5cbiAgICAvLyDQodGA0LDQt9GDINC/0L7RgdC70LUg0L7RgtC20LDRgtC40Y8g0LrQu9Cw0LLQuNGI0LggXCLQv9GA0L7RgdC70YPRiNC60LBcIiDRgdC+0LHRi9GC0LjQuSDQtNCy0LjQttC10L3QuNGPINC4INC+0YLQttCw0YLQuNGPINC60LvQsNCy0LjRiNC4INC/0YDQtdC60YDQsNGJ0LDRjtGC0YHRjy5cbiAgICBldmVudC50YXJnZXQhLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsICR0aGlzLmhhbmRsZU1vdXNlTW92ZSBhcyBFdmVudExpc3RlbmVyKVxuICAgIGV2ZW50LnRhcmdldCEucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsICR0aGlzLmhhbmRsZU1vdXNlVXAgYXMgRXZlbnRMaXN0ZW5lcilcbiAgfVxuXG4gIC8qKlxuICAgKiDQoNC10LDQs9C40YDRg9C10YIg0L3QsCDQt9GD0LzQuNGA0L7QstCw0L3QuNC1INC80YvRiNC4L9GC0YDQtdC60L/QsNC00LAuXG4gICAqXG4gICAqIEByZW1lcmtzXG4gICAqINCSINC80L7QvNC10L3RgiDQt9GD0LzQuNGA0L7QstCw0L3QuNGPINC80YvRiNC4L9GC0YDQtdC60L/QsNC00LAg0L/RgNC+0LjRgdGF0L7QtNC40YIg0LfRg9C80LjRgNC+0LLQsNC90LjQtSDQutC+0L7RgNC00LjQvdCw0YLQvdC+0Lkg0L/Qu9C+0YHQutC+0YHRgtC4LiDQktGL0YfQuNGB0LvQtdC90LjRjyDQstC90YPRgtGA0Lgg0YHQvtCx0YvRgtC40Y9cbiAgICog0YHQtNC10LvQsNC90Ysg0LzQsNC60YHQuNC80LDQu9GM0L3QviDQv9GA0L7QuNC30LLQvtC00LjRgtC10LvRjNC90YvQvNC4INCyINGD0YnQtdGA0LEg0YfQuNGC0LDQsdC10LvRjNC90L7RgdGC0Lgg0LvQvtCz0LjQutC4INC00LXQudGB0YLQstC40LkuINCS0L4g0LLQvdC10YjQvdC10Lwg0L7QsdGA0LDQsdC+0YLRh9C40LrQtSDRgdC+0LHRi9GC0LjQuSDQvtCx0YrQtdC60YJcbiAgICogdGhpcyDQvdC10LTQvtGB0YLRg9C/0LXQvSDQv9C+0Y3RgtC+0LzRgyDQtNC+0YHRgtGD0L8g0Log0Y3QutC30LXQvNC/0LvRj9GA0YMg0LrQu9Cw0YHRgdCwINGA0LXQsNC70LjQt9GD0LXRgtGB0Y8g0YfQtdGA0LXQtyDRgdGC0LDRgtC40YfQtdGB0LrQuNC5INC80LDRgdGB0LjQsiDQstGB0LXRhSDRgdC+0LfQtNCw0L3QvdGL0YUg0Y3QutC30LXQvNC/0LvRj9GA0L7QslxuICAgKiDQutC70LDRgdGB0LAg0Lgg0LjQtNC10L3RgtC40YTQuNC60LDRgtC+0YDQsCDQutCw0L3QstCw0YHQsCwg0LLRi9GB0YLRg9C/0LDRjtGJ0LXQs9C+INC40L3QtNC10LrRgdC+0Lwg0LIg0Y3RgtC+0Lwg0LzQsNGB0YHQuNCy0LUuXG4gICAqXG4gICAqIEBwYXJhbSBldmVudCAtINCh0L7QsdGL0YLQuNC1INC80YvRiNC4L9GC0YDQtdC60L/QsNC00LAuXG4gICAqL1xuICBwcm90ZWN0ZWQgaGFuZGxlTW91c2VXaGVlbChldmVudDogV2hlZWxFdmVudCk6IHZvaWQge1xuXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuXG4gICAgLy8g0J/QvtC70YPRh9C10L3QuNC1INC00L7RgdGC0YPQv9CwINC6INC+0LHRitC10LrRgtGDIHRoaXMuXG4gICAgY29uc3QgJHRoaXMgPSBTUGxvdC5pbnN0YW5jZXNbKGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudCkuaWRdXG5cbiAgICBjb25zdCBjbGlwWCA9IChldmVudC5jbGllbnRYIC0gJHRoaXMuVVNFRlVMX0NPTlNUU1s5XSkgKiAkdGhpcy5VU0VGVUxfQ09OU1RTWzddIC0gMVxuICAgIGNvbnN0IGNsaXBZID0gKGV2ZW50LmNsaWVudFkgLSAkdGhpcy5VU0VGVUxfQ09OU1RTWzEwXSkgKiAkdGhpcy5VU0VGVUxfQ09OU1RTWzhdICsgMVxuXG4gICAgY29uc3QgcHJlWm9vbVggPSAoY2xpcFggLSAkdGhpcy50cmFuc29ybWF0aW9uLm1hdHJpeFs2XSkgLyAkdGhpcy50cmFuc29ybWF0aW9uLm1hdHJpeFswXVxuICAgIGNvbnN0IHByZVpvb21ZID0gKGNsaXBZIC0gJHRoaXMudHJhbnNvcm1hdGlvbi5tYXRyaXhbN10pIC8gJHRoaXMudHJhbnNvcm1hdGlvbi5tYXRyaXhbNF1cblxuICAgIGNvbnN0IG5ld1pvb20gPSAkdGhpcy5jYW1lcmEuem9vbSAqIE1hdGgucG93KDIsIGV2ZW50LmRlbHRhWSAqIC0wLjAxKVxuICAgICR0aGlzLmNhbWVyYS56b29tID0gTWF0aC5tYXgoMC4wMDIsIE1hdGgubWluKDIwMCwgbmV3Wm9vbSkpXG5cbiAgICAkdGhpcy51cGRhdGVUcmFuc01hdHJpeCgkdGhpcylcblxuICAgIGNvbnN0IHBvc3Rab29tWCA9IChjbGlwWCAtICR0aGlzLnRyYW5zb3JtYXRpb24ubWF0cml4WzZdKSAvICR0aGlzLnRyYW5zb3JtYXRpb24ubWF0cml4WzBdXG4gICAgY29uc3QgcG9zdFpvb21ZID0gKGNsaXBZIC0gJHRoaXMudHJhbnNvcm1hdGlvbi5tYXRyaXhbN10pIC8gJHRoaXMudHJhbnNvcm1hdGlvbi5tYXRyaXhbNF1cblxuICAgICR0aGlzLmNhbWVyYS54ICs9IChwcmVab29tWCAtIHBvc3Rab29tWClcbiAgICAkdGhpcy5jYW1lcmEueSArPSAocHJlWm9vbVkgLSBwb3N0Wm9vbVkpXG5cbiAgICAvLyDQoNC10L3QtNC10YDQuNC90LMg0YEg0L7QsdC90L7QstC70LXQvdC90YvQvNC4INC/0LDRgNCw0LzQtdGC0YDQsNC80Lgg0YLRgNCw0L3RgdGE0L7RgNC80LDRhtC40LguXG4gICAgJHRoaXMucmVuZGVyKClcbiAgfVxuXG4gIC8qKlxuICAgKiDQn9GA0L7QuNC30LLQvtC00LjRgiDRgNC10L3QtNC10YDQuNC90LMg0LPRgNCw0YTQuNC60LAg0LIg0YHQvtC+0YLQstC10YLRgdGC0LLQuNC4INGBINGC0LXQutGD0YnQuNC80Lgg0L/QsNGA0LDQvNC10YLRgNCw0LzQuCDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuC5cbiAgICovXG4gIHByb3RlY3RlZCByZW5kZXIoKTogdm9pZCB7XG5cbiAgICAvLyDQntGH0LjRgdGC0LrQsCDQvtCx0YrQtdC60YLQsCDRgNC10L3QtNC10YDQuNC90LPQsCBXZWJHTC5cbiAgICB0aGlzLmdsLmNsZWFyKHRoaXMuZ2wuQ09MT1JfQlVGRkVSX0JJVClcblxuICAgIC8vINCe0LHQvdC+0LLQu9C10L3QuNC1INC80LDRgtGA0LjRhtGLINGC0YDQsNC90YHRhNC+0YDQvNCw0YbQuNC4LlxuICAgIHRoaXMudXBkYXRlVHJhbnNNYXRyaXgodGhpcylcblxuICAgIC8vINCf0YDQuNCy0Y/Qt9C60LAg0LzQsNGC0YDQuNGG0Ysg0YLRgNCw0L3RgdGE0L7RgNC80LDRhtC40Lgg0Log0L/QtdGA0LXQvNC10L3QvdC+0Lkg0YjQtdC50LTQtdGA0LAuXG4gICAgdGhpcy5nbC51bmlmb3JtTWF0cml4M2Z2KHRoaXMudmFyaWFibGVzWyd1X21hdHJpeCddLCBmYWxzZSwgdGhpcy50cmFuc29ybWF0aW9uLm1hdHJpeClcblxuICAgIC8vINCY0YLQtdGA0LjRgNC+0LLQsNC90LjQtSDQuCDRgNC10L3QtNC10YDQuNC90LMg0LPRgNGD0L/QvyDQsdGD0YTQtdGA0L7QsiBXZWJHTC5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYnVmZmVycy5hbW91bnRPZkJ1ZmZlckdyb3VwczsgaSsrKSB7XG5cbiAgICAgIC8vINCj0YHRgtCw0L3QvtCy0LrQsCDRgtC10LrRg9GJ0LXQs9C+INCx0YPRhNC10YDQsCDQstC10YDRiNC40L0g0Lgg0LXQs9C+INC/0YDQuNCy0Y/Qt9C60LAg0Log0L/QtdGA0LXQvNC10L3QvdC+0Lkg0YjQtdC50LTQtdGA0LAuXG4gICAgICB0aGlzLmdsLmJpbmRCdWZmZXIodGhpcy5nbC5BUlJBWV9CVUZGRVIsIHRoaXMuYnVmZmVycy52ZXJ0ZXhCdWZmZXJzW2ldKVxuICAgICAgdGhpcy5nbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheSh0aGlzLnZhcmlhYmxlc1snYV9wb3NpdGlvbiddKVxuICAgICAgdGhpcy5nbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKHRoaXMudmFyaWFibGVzWydhX3Bvc2l0aW9uJ10sIDIsIHRoaXMuZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKVxuXG4gICAgICAvLyDQo9GB0YLQsNC90L7QstC60LAg0YLQtdC60YPRidC10LPQviDQsdGD0YTQtdGA0LAg0YbQstC10YLQvtCyINCy0LXRgNGI0LjQvSDQuCDQtdCz0L4g0L/RgNC40LLRj9C30LrQsCDQuiDQv9C10YDQtdC80LXQvdC90L7QuSDRiNC10LnQtNC10YDQsC5cbiAgICAgIHRoaXMuZ2wuYmluZEJ1ZmZlcih0aGlzLmdsLkFSUkFZX0JVRkZFUiwgdGhpcy5idWZmZXJzLmNvbG9yQnVmZmVyc1tpXSlcbiAgICAgIHRoaXMuZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkodGhpcy52YXJpYWJsZXNbJ2FfY29sb3InXSlcbiAgICAgIHRoaXMuZ2wudmVydGV4QXR0cmliUG9pbnRlcih0aGlzLnZhcmlhYmxlc1snYV9jb2xvciddLCAxLCB0aGlzLmdsLlVOU0lHTkVEX0JZVEUsIGZhbHNlLCAwLCAwKVxuXG4gICAgICAvLyDQo9GB0YLQsNC90L7QstC60LAg0YLQtdC60YPRidC10LPQviDQsdGD0YTQtdGA0LAg0LjQvdC00LXQutGB0L7QsiDQstC10YDRiNC40L0uXG4gICAgICB0aGlzLmdsLmJpbmRCdWZmZXIodGhpcy5nbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgdGhpcy5idWZmZXJzLmluZGV4QnVmZmVyc1tpXSlcblxuICAgICAgLy8g0KDQtdC90LTQtdGA0LjQvdCzINGC0LXQutGD0YnQtdC5INCz0YDRg9C/0L/RiyDQsdGD0YTQtdGA0L7Qsi5cbiAgICAgIHRoaXMuZ2wuZHJhd0VsZW1lbnRzKHRoaXMuZ2wuVFJJQU5HTEVTLCB0aGlzLmJ1ZmZlcnMuYW1vdW50T2ZHTFZlcnRpY2VzW2ldLFxuICAgICAgICB0aGlzLmdsLlVOU0lHTkVEX1NIT1JULCAwKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDQodC70YPRh9Cw0LnQvdGL0Lwg0L7QsdGA0LDQt9C+0Lwg0LLQvtC30LLRgNCw0YnQsNC10YIg0L7QtNC40L0g0LjQtyDQuNC90LTQtdC60YHQvtCyINGH0LjRgdC70L7QstC+0LPQviDQvtC00L3QvtC80LXRgNC90L7Qs9C+INC80LDRgdGB0LjQstCwLiDQndC10YHQvNC+0YLRgNGPINC90LAg0YHQu9GD0YfQsNC50L3QvtGB0YLRjCDQutCw0LbQtNC+0LPQvlxuICAgKiDQutC+0L3QutGA0LXRgtC90L7Qs9C+INCy0YvQt9C+0LLQsCDRhNGD0L3QutGG0LjQuCwg0LjQvdC00LXQutGB0Ysg0LLQvtC30LLRgNCw0YnQsNGO0YLRgdGPINGBINC/0YDQtdC00L7Qv9GA0LXQtNC10LvQtdC90L3QvtC5INGH0LDRgdGC0L7RgtC+0LkuINCn0LDRgdGC0L7RgtCwIFwi0LLRi9C/0LDQtNCw0L3QuNC5XCIg0LjQvdC00LXQutGB0L7QsiDQt9Cw0LTQsNC10YLRgdGPXG4gICAqINGB0L7QvtGC0LLQtdGC0YHRgtCy0YPRjtGJ0LjQvNC4INC30L3QsNGH0LXQvdC40Y/QvNC4INGN0LvQtdC80LXQvdGC0L7Qsi5cbiAgICpcbiAgICogQHJlbWFya3NcbiAgICog0J/RgNC40LzQtdGAOiDQndCwINC80LDRgdGB0LjQstC1IFszLCAyLCA1XSDRhNGD0L3QutGG0LjRjyDQsdGD0LTQtdGCINCy0L7Qt9Cy0YDQsNGJ0LDRgtGMINC40L3QtNC10LrRgSAwINGBINGH0LDRgdGC0L7RgtC+0LkgPSAzLygzKzIrNSkgPSAzLzEwLCDQuNC90LTQtdC60YEgMSDRgSDRh9Cw0YHRgtC+0YLQvtC5ID1cbiAgICogMi8oMysyKzUpID0gMi8xMCwg0LjQvdC00LXQutGBIDIg0YEg0YfQsNGB0YLQvtGC0L7QuSA9IDUvKDMrMis1KSA9IDUvMTAuXG4gICAqXG4gICAqIEBwYXJhbSBhcnIgLSDQp9C40YHQu9C+0LLQvtC5INC+0LTQvdC+0LzQtdGA0L3Ri9C5INC80LDRgdGB0LjQsiwg0LjQvdC00LXQutGB0Ysg0LrQvtGC0L7RgNC+0LPQviDQsdGD0LTRg9GCINCy0L7Qt9Cy0YDQsNGJ0LDRgtGM0YHRjyDRgSDQv9GA0LXQtNC+0L/RgNC10LTQtdC70LXQvdC90L7QuSDRh9Cw0YHRgtC+0YLQvtC5LlxuICAgKiBAcmV0dXJucyDQodC70YPRh9Cw0LnQvdGL0Lkg0LjQvdC00LXQutGBINC40Lcg0LzQsNGB0YHQuNCy0LAgYXJyLlxuICAgKi9cbiAgcHJvdGVjdGVkIHJhbmRvbVF1b3RhSW5kZXgoYXJyOiBudW1iZXJbXSk6IG51bWJlciB7XG5cbiAgICBsZXQgYTogbnVtYmVyW10gPSBbXVxuICAgIGFbMF0gPSBhcnJbMF1cblxuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICBhW2ldID0gYVtpIC0gMV0gKyBhcnJbaV1cbiAgICB9XG5cbiAgICBjb25zdCBsYXN0SW5kZXg6IG51bWJlciA9IGEubGVuZ3RoIC0gMVxuXG4gICAgbGV0IHI6IG51bWJlciA9IE1hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkgKiBhW2xhc3RJbmRleF0pKSArIDFcbiAgICBsZXQgbDogbnVtYmVyID0gMFxuICAgIGxldCBoOiBudW1iZXIgPSBsYXN0SW5kZXhcblxuICAgIHdoaWxlIChsIDwgaCkge1xuICAgICAgY29uc3QgbTogbnVtYmVyID0gbCArICgoaCAtIGwpID4+IDEpO1xuICAgICAgKHIgPiBhW21dKSA/IChsID0gbSArIDEpIDogKGggPSBtKVxuICAgIH1cblxuICAgIHJldHVybiAoYVtsXSA+PSByKSA/IGwgOiAtMVxuICB9XG5cbiAgLyoqXG4gICAqINCc0LXRgtC+0LQg0LjQvNC40YLQsNGG0LjQuCDQuNGC0LXRgNC40YDQvtCy0LDQvdC40Y8g0LjRgdGF0L7QtNC90YvRhSDQvtCx0YrQtdC60YLQvtCyLiDQn9GA0Lgg0LrQsNC20LTQvtC8INC90L7QstC+0Lwg0LLRi9C30L7QstC1INCy0L7Qt9Cy0YDQsNGJ0LDQtdGCINC40L3RhNC+0YDQvNCw0YbQuNGOINC+INC/0L7Qu9C40LPQvtC90LUg0YHQviDRgdC70YPRh9Cw0L3Ri9C8XG4gICAqINC/0L7Qu9C+0LbQtdC90LjQtdC8LCDRgdC70YPRh9Cw0LnQvdC+0Lkg0YTQvtGA0LzQvtC5INC4INGB0LvRg9GH0LDQudC90YvQvCDRhtCy0LXRgtC+0LwuXG4gICAqXG4gICAqIEByZXR1cm5zINCY0L3RhNC+0YDQvNCw0YbQuNGPINC+INC/0L7Qu9C40LPQvtC90LUg0LjQu9C4IG51bGwsINC10YHQu9C4INC/0LXRgNC10LHQvtGAINC40YHRhdC+0LTQvdGL0YUg0L7QsdGK0LXQutGC0L7QsiDQt9Cw0LrQvtC90YfQuNC70YHRjy5cbiAgICovXG4gIHByb3RlY3RlZCBkZW1vSXRlcmF0aW9uQ2FsbGJhY2soKTogU1Bsb3RQb2x5Z29uIHwgbnVsbCB7XG4gICAgaWYgKHRoaXMuZGVtb01vZGUuaW5kZXghIDwgdGhpcy5kZW1vTW9kZS5hbW91bnQhKSB7XG4gICAgICB0aGlzLmRlbW9Nb2RlLmluZGV4ISArKztcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHg6IHJhbmRvbUludCh0aGlzLmdyaWRTaXplLndpZHRoKSxcbiAgICAgICAgeTogcmFuZG9tSW50KHRoaXMuZ3JpZFNpemUuaGVpZ2h0KSxcbiAgICAgICAgc2hhcGU6IHRoaXMucmFuZG9tUXVvdGFJbmRleCh0aGlzLmRlbW9Nb2RlLnNoYXBlUXVvdGEhKSxcbiAgICAgICAgY29sb3I6IHJhbmRvbUludCh0aGlzLnBvbHlnb25QYWxldHRlLmxlbmd0aClcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZVxuICAgICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvKipcbiAgICog0JfQsNC/0YPRgdC60LDQtdGCINGA0LXQvdC00LXRgNC40L3QsyDQuCBcItC/0YDQvtGB0LvRg9GI0LrRg1wiINGB0L7QsdGL0YLQuNC5INC80YvRiNC4INC90LAg0LrQsNC90LLQsNGB0LUuXG4gICAqXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIHJ1bigpIHtcbiAgICBpZiAoIXRoaXMuaXNSdW5uaW5nKSB7XG5cbiAgICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMuaGFuZGxlTW91c2VEb3duKTtcbiAgICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ3doZWVsJywgdGhpcy5oYW5kbGVNb3VzZVdoZWVsKTtcblxuICAgICAgdGhpcy5yZW5kZXIoKTtcblxuICAgICAgdGhpcy5pc1J1bm5pbmcgPSB0cnVlO1xuICAgIH1cblxuICAgIC8vINCS0YvQstC+0LQg0L7RgtC70LDQtNC+0YfQvdC+0Lkg0LjQvdGE0L7RgNC80LDRhtC40LguXG4gICAgaWYgKHRoaXMuZGVidWdNb2RlLmlzRW5hYmxlKSB7XG4gICAgICBjb25zb2xlLmxvZygnJWPQoNC10L3QtNC10YDQuNC90LMg0LfQsNC/0YPRidC10L0nLCB0aGlzLmRlYnVnU3R5bGUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDQntGB0YLQsNC90LDQstC70LjQstCw0LXRgiDRgNC10L3QtNC10YDQuNC90LMg0LggXCLQv9GA0L7RgdC70YPRiNC60YNcIiDRgdC+0LHRi9GC0LjQuSDQvNGL0YjQuCDQvdCwINC60LDQvdCy0LDRgdC1LlxuICAgKlxuICAgKiBAcHVibGljXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gY2xlYXIg0J/RgNC40LfQvdCw0Log0L3QtdC+0L7QsdGF0L7QtNC40LzQvtGB0YLQuCDQstC80LXRgdGC0LUg0YEg0L7RgdGC0LDQvdC+0LLQutC+0Lkg0YDQtdC90LTQtdGA0LjQvdCz0LBcbiAgICogICAgINC+0YfQuNGB0YLQuNGC0Ywg0LrQsNC90LLQsNGBLiDQl9C90LDRh9C10L3QuNC1IHRydWUg0L7Rh9C40YnQsNC10YIg0LrQsNC90LLQsNGBLCDQt9C90LDRh9C10L3QuNC1IGZhbHNlIC0g0L3QtSDQvtGH0LjRidCw0LXRgi5cbiAgICogICAgINCf0L4g0YPQvNC+0LvRh9Cw0L3QuNGOINC+0YfQuNGB0YLQutCwINC90LUg0L/RgNC+0LjRgdGF0L7QtNC40YIuXG4gICAqL1xuICBzdG9wKGNsZWFyID0gZmFsc2UpIHtcblxuICAgIGlmICh0aGlzLmlzUnVubmluZykge1xuXG4gICAgICB0aGlzLmNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLmhhbmRsZU1vdXNlRG93bik7XG4gICAgICB0aGlzLmNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKCd3aGVlbCcsIHRoaXMuaGFuZGxlTW91c2VXaGVlbCk7XG4gICAgICB0aGlzLmNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLmhhbmRsZU1vdXNlTW92ZSk7XG4gICAgICB0aGlzLmNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5oYW5kbGVNb3VzZVVwKTtcblxuICAgICAgaWYgKGNsZWFyKSB7XG4gICAgICAgIHRoaXMuY2xlYXIoKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5pc1J1bm5pbmcgPSBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyDQktGL0LLQvtC0INC+0YLQu9Cw0LTQvtGH0L3QvtC5INC40L3RhNC+0YDQvNCw0YbQuNC4LlxuICAgIGlmICh0aGlzLmRlYnVnTW9kZS5pc0VuYWJsZSkge1xuICAgICAgY29uc29sZS5sb2coJyVj0KDQtdC90LTQtdGA0LjQvdCzINC+0YHRgtCw0L3QvtCy0LvQtdC9JywgdGhpcy5kZWJ1Z1N0eWxlKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICog0J7Rh9C40YnQsNC10YIg0LrQsNC90LLQsNGBLCDQt9Cw0LrRgNCw0YjQuNCy0LDRjyDQtdCz0L4g0LIg0YTQvtC90L7QstGL0Lkg0YbQstC10YIuXG4gICAqXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIGNsZWFyKCkge1xuXG4gICAgdGhpcy5nbC5jbGVhcih0aGlzLmdsLkNPTE9SX0JVRkZFUl9CSVQpO1xuXG4gICAgLy8g0JLRi9Cy0L7QtCDQvtGC0LvQsNC00L7Rh9C90L7QuSDQuNC90YTQvtGA0LzQsNGG0LjQuC5cbiAgICBpZiAodGhpcy5kZWJ1Z01vZGUuaXNFbmFibGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKCclY9Ca0L7QvdGC0LXQutGB0YIg0YDQtdC90LTQtdGA0LjQvdCz0LAg0L7Rh9C40YnQtdC9IFsnICsgdGhpcy5iZ0NvbG9yICsgJ10nLCB0aGlzLmRlYnVnU3R5bGUpO1xuICAgIH1cbiAgfVxufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vaW5kZXgudHNcIik7XG4iXSwic291cmNlUm9vdCI6IiJ9