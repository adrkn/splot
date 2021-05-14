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
/**
 * Проверяет является ли переменная экземпляром какого-либоо класса.
 *
 * @param val - Проверяемая переменная.
 * @returns Результат проверки.
 */
function isObject(obj) {
    return (Object.prototype.toString.call(obj) === '[object Object]');
}
/**
 * Возвращает случайное целое число в диапазоне: [0...range-1].
 *
 * @param range - Верхний предел диапазона случайного выбора.
 * @returns Случайное число.
 */
function randomInt(range) {
    return Math.floor(Math.random() * range);
}
/**
 * Преобразует объект в строку JSON. Имеет отличие от стандартной функции JSON.stringify - поля объекта, имеющие
 * значения функций не пропускаются, а преобразуются в название функции.
 *
 * @param obj - Целевой объект.
 * @returns Строка JSON, отображающая объект.
 */
function jsonStringify(obj) {
    return JSON.stringify(obj, function (key, value) {
        return (typeof value === 'function') ? value.name : value;
    }, ' ');
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
        // Функция по умолчанию для итерирования объектов не задается.
        this.iterationCallback = undefined;
        // Цветовая палитра полигонов по умолчанию.
        this.polygonPalette = [
            '#FF00FF', '#800080', '#FF0000', '#800000', '#FFFF00',
            '#00FF00', '#008000', '#00FFFF', '#0000FF', '#000080'
        ];
        // Размер координатной плоскости по умолчанию.
        this.gridSize = {
            width: 32000,
            height: 16000
        };
        // Размер полигона по умолчанию.
        this.polygonSize = 20;
        // Степень детализации круга по умолчанию.
        this.circleApproxLevel = 12;
        // Параметры режима отладки по умолчанию.
        this.debugMode = {
            isEnable: false,
            output: 'console',
            headerStyle: 'font-weight: bold; color: #ffffff; background-color: #cc0000;',
            groupStyle: 'font-weight: bold; color: #ffffff;'
        };
        // Параметры режима демострационных данных по умолчанию.
        this.demoMode = {
            isEnable: false,
            amount: 1000000,
            /**
             * По умолчанию в режиме демо-данных будут поровну отображаться полигоны всех возможных форм. Соответствующие
             * значения массива инициализируются при регистрации функций создания форм методом {@link registerShape}.
             */
            shapeQuota: [],
            index: 0
        };
        // Признак по умолчанию форсированного запуска рендера.
        this.forceRun = false;
        /**
         * По умолчанию искусственного ограничения на количество отображаемых полигонов нет (за счет задания большого заведомо
         * недостижимого порогового числа).
         */
        this.maxAmountOfPolygons = 1000000000;
        // Фоновый цвет по умолчанию для канваса.
        this.bgColor = '#ffffff';
        // Цвет по умолчанию для направляющих.
        this.rulesColor = '#c0c0c0';
        // По умолчанию область просмотра устанавливается в центр координатной плооскости.
        this.camera = {
            x: this.gridSize.width / 2,
            y: this.gridSize.height / 2,
            zoom: 1
        };
        /**
         * По умолчанию настройки контекста рендеринга WebGL максимизируют производительность графической системы. Специальных
         * пользовательских предустановок не требуется, однако приложение позволяет экспериментировать с настройками графики.
         */
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
        // Признак активного процесса рендера. Доступен пользователю приложения только для чтения.
        this.isRunning = false;
        // Переменные для связи приложения с программой WebGL.
        this.variables = {};
        /**
         * Шаблон GLSL-кода для вершинного шейдера. Содержит специальную вставку "SET-VERTEX-COLOR-CODE", которая перед
         * созданием шейдера заменяется на GLSL-код выбора цвета вершин.
         */
        this._vertexShaderCodeTemplate = 'attribute vec2 a_position;\n' +
            'attribute float a_color;\n' +
            'uniform mat3 u_matrix;\n' +
            'varying vec3 v_color;\n' +
            'void main() {\n' +
            '  gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0.0, 1.0);\n' +
            '  SET-VERTEX-COLOR-CODE' +
            '}\n';
        // Шаблон GLSL-кода для фрагментного шейдера.
        this.fragmentShaderCodeTemplate = 'precision lowp float;\n' +
            'varying vec3 v_color;\n' +
            'void main() {\n' +
            '  gl_FragColor = vec4(v_color.rgb, 1.0);\n' +
            '}\n';
        // Счетчик числа обработанных полигонов.
        this.amountOfPolygons = 0;
        /**
         *   Набор вспомогательных констант, используемых в часто повторяющихся вычислениях. Рассчитывается и задается в
         *   методе {@link setUsefulConstants}.
         */
        this.USEFUL_CONSTS = [];
        // Техническая информация, используемая приложением для расчета трансформаций.
        this.transormation = {
            matrix: [],
            startInvMatrix: [],
            startCameraX: 0,
            startCameraY: 0,
            startPosX: 0,
            startPosY: 0
        };
        /**
         * Максимальное возможное количество вершин в группе полигонов, которое еще допускает добавление одного самого
         * многовершинного полигона. Это количество имеет объективное техническое ограничение, т.к. функция
         * {@link drawElements} не позволяет корректно принимать больше 65536 индексов (32768 вершин).
         */
        this.maxAmountOfVertexPerPolygonGroup = 32768 - (this.circleApproxLevel + 1);
        // Информация о буферах, хранящих данные для видеопамяти.
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
        /**
         * Информация о возможных формах полигонов.
         * Каждая форма представляется функцией, вычисляющей ее вершины и названием формы.
         * Для указания формы полигонов в приложении используются числовые индексы в данном массиве.
         */
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
            console.group('%cСоздан шейдер [' + shaderType + ']', this.debugMode.groupStyle);
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
            console.log('%cЗапущен процесс загрузки данных [' + this.getCurrentTime() + ']...', this.debugMode.groupStyle);
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
     * Тип функции: {@link SPlotCalcShapeFunc}
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
     * Тип функции: {@link SPlotCalcShapeFunc}
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
     * Тип функции: {@link SPlotCalcShapeFunc}
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
        console.log('%cВключен режим отладки ' + this.constructor.name + ' на объекте [#' + this.canvas.id + ']', this.debugMode.headerStyle);
        if (this.demoMode.isEnable) {
            console.log('%cВключен демонстрационный режим данных', this.debugMode.groupStyle);
        }
        console.group('%cПредупреждение', this.debugMode.groupStyle);
        {
            console.dir('Открытая консоль браузера и другие активные средства контроля разработки существенно снижают производительность высоконагруженных приложений. Для объективного анализа производительности все подобные средства должны быть отключены, а консоль браузера закрыта. Некоторые данные отладочной информации в зависимости от используемого браузера могут не отображаться или отображаться некорректно. Средство отладки протестировано в браузере Google Chrome v.90');
        }
        console.groupEnd();
        console.group('%cВидеосистема', this.debugMode.groupStyle);
        {
            var ext = this.gl.getExtension('WEBGL_debug_renderer_info');
            var graphicsCardName = (ext) ? this.gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : '[неизвестно]';
            console.log('Графическая карта: ' + graphicsCardName);
            console.log('Версия GL: ' + this.gl.getParameter(this.gl.VERSION));
        }
        console.groupEnd();
        console.group('%cНастройка параметров экземпляра', this.debugMode.groupStyle);
        {
            console.dir(this);
            console.log('Пользовательские настройки:\n', jsonStringify(options));
            console.log('Канвас: #' + this.canvas.id);
            console.log('Размер канваса: ' + this.canvas.width + ' x ' + this.canvas.height + ' px');
            console.log('Размер плоскости: ' + this.gridSize.width + ' x ' + this.gridSize.height + ' px');
            console.log('Размер полигона: ' + this.polygonSize + ' px');
            console.log('Апроксимация окружности: ' + this.circleApproxLevel + ' углов');
            /**
             * @todo Обработать этот вывод в зависимости от типа получения данных о полигонах. Ввести типы - заданная функция
             * итерирования, демо-итерирование, переданный массив данных.
             */
            if (this.demoMode.isEnable) {
                console.log('Способ получения данных: ' + 'демонстрационная функция итерирования');
            }
            else {
                console.log('Способ получения данных: ' + 'пользовательская функция итерирования');
            }
        }
        console.groupEnd();
    };
    /**
     * Выводит в консоль отладочную информацию о загрузке данных в видеопамять.
     */
    SPlot.prototype.reportAboutObjectReading = function () {
        console.group('%cЗагрузка данных завершена [' + this.getCurrentTime() + ']', this.debugMode.groupStyle);
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
                console.log('Кол-во цветов в палитре: ' + this.polygonPalette.length);
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
     * Запускает рендеринг и "прослушку" событий мыши/трекпада на канвасе.
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
            console.log('%cРендеринг запущен', this.debugMode.groupStyle);
        }
    };
    /**
     * Останавливает рендеринг и "прослушку" событий мыши/трекпада на канвасе.
     *
     * @param clear - Признак неообходимости вместе с остановкой рендеринга очистить канвас. Значение true очищает канвас,
     * значение false - оставляет его неочищенным. По умолчанию очистка не происходит.
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
            console.log('%cРендеринг остановлен', this.debugMode.groupStyle);
        }
    };
    /**
     * Очищает канвас, закрашивая его в фоновый цвет.
     */
    SPlot.prototype.clear = function () {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        // Вывод отладочной информации.
        if (this.debugMode.isEnable) {
            console.log('%cКонтекст рендеринга очищен [' + this.bgColor + ']', this.debugMode.groupStyle);
        }
    };
    /**
     * Массив класса, содержащий ссылки на все созданные экземпляры класса. Индексами массива выступают идентификаторы
     * канвасов экземпляров. Используется для доступа к полям и методам экземпляра из тела внешних обрабочиков событий
     * мыши/трекпада.
     */
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zdHlsZS5jc3M/YzRkMiIsIndlYnBhY2s6Ly8vLi9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9zcGxvdC50cyIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svc3RhcnR1cCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0FDQUEsZ0ZBQTJCO0FBQzNCLGtEQUFnQjtBQUVoQixTQUFTLFNBQVMsQ0FBQyxLQUFhO0lBQzlCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsS0FBSyxDQUFDO0FBQzFDLENBQUM7QUFFRCxJQUFJLENBQUMsR0FBRyxDQUFDO0FBQ1QsSUFBSSxDQUFDLEdBQUcsT0FBUyxFQUFFLDhCQUE4QjtBQUNqRCxJQUFJLE9BQU8sR0FBRyxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQztBQUM1SCxJQUFJLFNBQVMsR0FBRyxLQUFNO0FBQ3RCLElBQUksVUFBVSxHQUFHLEtBQU07QUFFdkIsZ0hBQWdIO0FBQ2hILFNBQVMsY0FBYztJQUNyQixJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDVCxDQUFDLEVBQUU7UUFDSCxPQUFPO1lBQ0wsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxTQUFTLENBQUM7WUFDdkIsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxVQUFVLENBQUM7WUFDeEIsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDbkIsS0FBSyxFQUFFLFNBQVMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUcsZ0NBQWdDO1NBQ3BFO0tBQ0Y7O1FB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LENBQUMsYUFBYSxDQUFDO1lBRTlELElBQUksS0FBSyxFQUFFO2dCQUNULElBQUksQ0FBQyxLQUFLLEVBQUU7YUFDYjtZQUVELElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSztTQUN2QjtRQUVELCtCQUErQjtRQUMvQixJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFO1lBQzNCLE9BQU8sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUM7U0FDakU7SUFDSCxDQUFDO0lBRUQ7O09BRUc7SUFDSSxxQkFBSyxHQUFaO1FBRUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBRXhDLCtCQUErQjtRQUMvQixJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFO1lBQzNCLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0NBQWdDLEdBQUcsSUFBSSxDQUFDLE9BQU8sR0FBRyxHQUFHLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUMvRjtJQUNILENBQUM7SUF4cENEOzs7O09BSUc7SUFDVyxlQUFTLEdBQTZCLEVBQUU7SUFvcEN4RCxZQUFDO0NBQUE7a0JBM3BDb0IsS0FBSzs7Ozs7OztVQ2pTMUI7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0Esc0RBQXNELGtCQUFrQjtXQUN4RTtXQUNBLCtDQUErQyxjQUFjO1dBQzdELEU7Ozs7O1VDTkE7VUFDQTtVQUNBO1VBQ0EiLCJmaWxlIjoic2NyaXB0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiaW1wb3J0IFNQbG90IGZyb20gJy4vc3Bsb3QnXG5pbXBvcnQgJ0Avc3R5bGUnXG5cbmZ1bmN0aW9uIHJhbmRvbUludChyYW5nZTogbnVtYmVyKSB7XG4gIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiByYW5nZSlcbn1cblxubGV0IGkgPSAwXG5sZXQgbiA9IDFfMDAwXzAwMCAgLy8g0JjQvNC40YLQuNGA0YPQtdC80L7QtSDRh9C40YHQu9C+INC+0LHRitC10LrRgtC+0LIuXG5sZXQgcGFsZXR0ZSA9IFsnI0ZGMDBGRicsICcjODAwMDgwJywgJyNGRjAwMDAnLCAnIzgwMDAwMCcsICcjRkZGRjAwJywgJyMwMEZGMDAnLCAnIzAwODAwMCcsICcjMDBGRkZGJywgJyMwMDAwRkYnLCAnIzAwMDA4MCddXG5sZXQgcGxvdFdpZHRoID0gMzJfMDAwXG5sZXQgcGxvdEhlaWdodCA9IDE2XzAwMFxuXG4vLyDQn9GA0LjQvNC10YAg0LjRgtC10YDQuNGA0YPRjtGJ0LXQuSDRhNGD0L3QutGG0LjQuC4g0JjRgtC10YDQsNGG0LjQuCDQuNC80LjRgtC40YDRg9GO0YLRgdGPINGB0LvRg9GH0LDQudC90YvQvNC4INCy0YvQtNCw0YfQsNC80LguINCf0L7Rh9GC0Lgg0YLQsNC60LbQtSDRgNCw0LHQvtGC0LDQtdGCINGA0LXQttC40Lwg0LTQtdC80L4t0LTQsNC90L3Ri9GFLlxuZnVuY3Rpb24gcmVhZE5leHRPYmplY3QoKSB7XG4gIGlmIChpIDwgbikge1xuICAgIGkrK1xuICAgIHJldHVybiB7XG4gICAgICB4OiByYW5kb21JbnQocGxvdFdpZHRoKSxcbiAgICAgIHk6IHJhbmRvbUludChwbG90SGVpZ2h0KSxcbiAgICAgIHNoYXBlOiByYW5kb21JbnQoMyksICAgICAgICAgICAgICAgLy8gMCAtINGC0YDQtdGD0LPQvtC70YzQvdC40LosIDEgLSDQutCy0LDQtNGA0LDRgiwgMiAtINC60YDRg9CzXG4gICAgICBjb2xvcjogcmFuZG9tSW50KHBhbGV0dGUubGVuZ3RoKSwgIC8vINCY0L3QtNC10LrRgSDRhtCy0LXRgtCwINCyINC80LDRgdGB0LjQstC1INGG0LLQtdGC0L7QslxuICAgIH1cbiAgfVxuICBlbHNlXG4gICAgcmV0dXJuIG51bGwgIC8vINCS0L7Qt9Cy0YDQsNGJ0LDQtdC8IG51bGwsINC60L7Qs9C00LAg0L7QsdGK0LXQutGC0YsgXCLQt9Cw0LrQvtC90YfQuNC70LjRgdGMXCJcbn1cblxuLyoqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqKi9cblxubGV0IHNjYXR0ZXJQbG90ID0gbmV3IFNQbG90KCdjYW52YXMxJylcblxuLy8g0J3QsNGB0YLRgNC+0LnQutCwINGN0LrQt9C10LzQv9C70Y/RgNCwINC90LAg0YDQtdC20LjQvCDQstGL0LLQvtC00LAg0L7RgtC70LDQtNC+0YfQvdC+0Lkg0LjQvdGE0L7RgNC80LDRhtC40Lgg0LIg0LrQvtC90YHQvtC70Ywg0LHRgNCw0YPQt9C10YDQsC5cbi8vINCU0YDRg9Cz0LjQtSDQv9GA0LjQvNC10YDRiyDRgNCw0LHQvtGC0Ysg0L7Qv9C40YHQsNC90Ysg0LIg0YTQsNC50LvQtSBzcGxvdC5qcyDRgdC+INGB0YLRgNC+0LrQuCAyMTQuXG5zY2F0dGVyUGxvdC5zZXR1cCh7XG4gIGl0ZXJhdGlvbkNhbGxiYWNrOiByZWFkTmV4dE9iamVjdCxcbiAgcG9seWdvblBhbGV0dGU6IHBhbGV0dGUsXG4gIGdyaWRTaXplOiB7XG4gICAgd2lkdGg6IHBsb3RXaWR0aCxcbiAgICBoZWlnaHQ6IHBsb3RIZWlnaHQsXG4gIH0sXG4gIGRlYnVnTW9kZToge1xuICAgIGlzRW5hYmxlOiB0cnVlLFxuICB9LFxuICBkZW1vTW9kZToge1xuICAgIGlzRW5hYmxlOiB0cnVlLFxuICB9LFxufSlcblxuc2NhdHRlclBsb3QucnVuKClcbiIsIlxuLyoqXG4gKiDQn9GA0L7QstC10YDRj9C10YIg0Y/QstC70Y/QtdGC0YHRjyDQu9C4INC/0LXRgNC10LzQtdC90L3QsNGPINGN0LrQt9C10LzQv9C70Y/RgNC+0Lwg0LrQsNC60L7Qs9C+LdC70LjQsdC+0L4g0LrQu9Cw0YHRgdCwLlxuICpcbiAqIEBwYXJhbSB2YWwgLSDQn9GA0L7QstC10YDRj9C10LzQsNGPINC/0LXRgNC10LzQtdC90L3QsNGPLlxuICogQHJldHVybnMg0KDQtdC30YPQu9GM0YLQsNGCINC/0YDQvtCy0LXRgNC60LguXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KG9iajogYW55KTogYm9vbGVhbiB7XG4gIHJldHVybiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IE9iamVjdF0nKVxufVxuXG4vKipcbiAqINCS0L7Qt9Cy0YDQsNGJ0LDQtdGCINGB0LvRg9GH0LDQudC90L7QtSDRhtC10LvQvtC1INGH0LjRgdC70L4g0LIg0LTQuNCw0L/QsNC30L7QvdC1OiBbMC4uLnJhbmdlLTFdLlxuICpcbiAqIEBwYXJhbSByYW5nZSAtINCS0LXRgNGF0L3QuNC5INC/0YDQtdC00LXQuyDQtNC40LDQv9Cw0LfQvtC90LAg0YHQu9GD0YfQsNC50L3QvtCz0L4g0LLRi9Cx0L7RgNCwLlxuICogQHJldHVybnMg0KHQu9GD0YfQsNC50L3QvtC1INGH0LjRgdC70L4uXG4gKi9cbmZ1bmN0aW9uIHJhbmRvbUludChyYW5nZTogbnVtYmVyKTogbnVtYmVyIHtcbiAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHJhbmdlKVxufVxuXG4vKipcbiAqINCf0YDQtdC+0LHRgNCw0LfRg9C10YIg0L7QsdGK0LXQutGCINCyINGB0YLRgNC+0LrRgyBKU09OLiDQmNC80LXQtdGCINC+0YLQu9C40YfQuNC1INC+0YIg0YHRgtCw0L3QtNCw0YDRgtC90L7QuSDRhNGD0L3QutGG0LjQuCBKU09OLnN0cmluZ2lmeSAtINC/0L7Qu9GPINC+0LHRitC10LrRgtCwLCDQuNC80LXRjtGJ0LjQtVxuICog0LfQvdCw0YfQtdC90LjRjyDRhNGD0L3QutGG0LjQuSDQvdC1INC/0YDQvtC/0YPRgdC60LDRjtGC0YHRjywg0LAg0L/RgNC10L7QsdGA0LDQt9GD0Y7RgtGB0Y8g0LIg0L3QsNC30LLQsNC90LjQtSDRhNGD0L3QutGG0LjQuC5cbiAqXG4gKiBAcGFyYW0gb2JqIC0g0KbQtdC70LXQstC+0Lkg0L7QsdGK0LXQutGCLlxuICogQHJldHVybnMg0KHRgtGA0L7QutCwIEpTT04sINC+0YLQvtCx0YDQsNC20LDRjtGJ0LDRjyDQvtCx0YrQtdC60YIuXG4gKi9cbmZ1bmN0aW9uIGpzb25TdHJpbmdpZnkob2JqOiBhbnkpOiBzdHJpbmcge1xuICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoXG4gICAgb2JqLFxuICAgIGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgICByZXR1cm4gKHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJykgPyB2YWx1ZS5uYW1lIDogdmFsdWVcbiAgICB9LFxuICAgICcgJ1xuICApXG59XG5cbi8qKlxuICog0KLQuNC/INGE0YPQvdC60YbQuNC4LCDQstGL0YfQuNGB0LvRj9GO0YnQtdC5INC60L7QvtGA0LTQuNC90LDRgtGLINCy0LXRgNGI0LjQvSDQv9C+0LvQuNCz0L7QvdCwINC+0L/RgNC10LTQtdC70LXQvdC90L7QuSDRhNC+0YDQvNGLLlxuICpcbiAqIEBwYXJhbSB4IC0g0J/QvtC70L7QttC10L3QuNC1INGG0LXQvdGC0YDQsCDQv9C+0LvQuNCz0L7QvdCwINC90LAg0L7RgdC4INCw0LHRgdGG0LjRgdGBLlxuICogQHBhcmFtIHkgLSDQn9C+0LvQvtC20LXQvdC40LUg0YbQtdC90YLRgNCwINC/0L7Qu9C40LPQvtC90LAg0L3QsCDQvtGB0Lgg0L7RgNC00LjQvdCw0YIuXG4gKiBAcGFyYW0gY29uc3RzIC0g0J3QsNCx0L7RgCDQstGB0L/QvtC80L7Qs9Cw0YLQtdC70YzQvdGL0YUg0LrQvtC90YHRgtCw0L3Rgiwg0LjRgdC/0L7Qu9GM0LfRg9C10LzRi9GFINC00LvRjyDQstGL0YfQuNGB0LvQtdC90LjRjyDQstC10YDRiNC40L0uXG4gKiBAcmV0dXJucyDQlNCw0L3QvdGL0LUg0L4g0LLQtdGA0YjQuNC90LDRhSDQv9C+0LvQuNCz0L7QvdCwLlxuICovXG50eXBlIFNQbG90Q2FsY1NoYXBlRnVuYyA9ICh4OiBudW1iZXIsIHk6IG51bWJlciwgY29uc3RzOiBBcnJheTxhbnk+KSA9PiBTUGxvdFBvbHlnb25WZXJ0aWNlc1xuXG4vKipcbiAqINCi0LjQvyDRhtCy0LXRgtCwINCyIEhFWC3RhNC+0YDQvNCw0YLQtSAoXCIjZmZmZmZmXCIpLlxuICovXG50eXBlIEhFWENvbG9yID0gc3RyaW5nXG5cbi8qKlxuICog0KLQuNC/INGE0YPQvdC60YbQuNC4INC40YLQtdGA0LjRgNC+0LLQsNC90LjRjyDQvNCw0YHRgdC40LLQsCDQuNGB0YXQvtC00L3Ri9GFINC+0LHRitC10LrRgtC+0LIuINCa0LDQttC00YvQuSDQstGL0LfQvtCyINGC0LDQutC+0Lkg0YTRg9C90LrRhtC40Lgg0LTQvtC70LbQtdC9INCy0L7Qt9Cy0YDQsNGJ0LDRgtGMINC40L3RhNC+0YDQvNCw0YbQuNGOINC+0LFcbiAqINC+0YfQtdGA0LXQtNC90L7QvCDQv9C+0LvQuNCz0L7QvdC1LCDQutC+0YLQvtGA0YvQuSDQvdC10L7QsdGF0L7QtNC40LzQviDQvtGC0L7QsdGA0LDQt9C40YLRjCAo0LXQs9C+INC60L7QvtGA0LTQuNC90LDRgtGLLCDRhNC+0YDQvNGDINC4INGG0LLQtdGCKS4g0JrQvtCz0LTQsCDQuNGB0YXQvtC00L3Ri9C1INC+0LHRitC10LrRgtGLINC30LDQutC+0L3Rh9Cw0YLRgdGPXG4gKiDRhNGD0L3QutGG0LjRjyDQtNC+0LvQttC90LAg0LLQtdGA0L3Rg9GC0YwgbnVsbC5cbiAqL1xudHlwZSBTUGxvdEl0ZXJhdGlvbkZ1bmN0aW9uID0gKCkgPT4gU1Bsb3RQb2x5Z29uIHwgbnVsbFxuXG4vKipcbiAqINCi0LjQvyDQvNC10YHRgtCwINCy0YvQstC+0LTQsCDRgdC40YHRgtC10LzQvdC+0Lkg0LjQvdGE0L7RgNC80LDRhtC40Lgg0L/RgNC4INCw0LrRgtC40LLQuNGA0L7QstCw0L3QvdC+0Lwg0YDQtdC20LjQvNC1INC+0YLQu9Cw0LTQutC4INC/0YDQuNC70L7QttC10L3QuNGPLlxuICog0JfQvdCw0YfQtdC90LjQtSBcImNvbnNvbGVcIiDRg9GB0YLQsNC90LDQstC70LjQstCw0LXRgiDQsiDQutCw0YfQtdGB0YLQstC1INC80LXRgdGC0LAg0LLRi9Cy0L7QtNCwINC60L7QvdGB0L7Qu9GMINCx0YDQsNGD0LfQtdGA0LAuXG4gKlxuICogQHRvZG8g0JTQvtCx0LDQstC40YLRjCDQvNC10YHRgtC+INCy0YvQstC+0LTQsCAtIEhUTUwg0LTQvtC60YPQvNC10L3RgiAo0LfQvdCw0YfQtdC90LjQtSBcImRvY3VtZW50XCIpXG4gKiBAdG9kbyDQlNC+0LHQsNCy0LjRgtGMINC80LXRgdGC0L4g0LLRi9Cy0L7QtNCwIC0g0YTQsNC50LsgKNC30L3QsNGH0LXQvdC40LUgXCJmaWxlXCIpXG4gKi9cbnR5cGUgU1Bsb3REZWJ1Z091dHB1dCA9ICdjb25zb2xlJ1xuXG4vKipcbiAqINCi0LjQvyDRiNC10LnQtNC10YDQsCBXZWJHTC5cbiAqINCX0L3QsNGH0LXQvdC40LUgXCJWRVJURVhfU0hBREVSXCIg0LfQsNC00LDQtdGCINCy0LXRgNGI0LjQvdC90YvQuSDRiNC10LnQtNC10YAuXG4gKiDQl9C90LDRh9C10L3QuNC1IFwiRlJBR01FTlRfU0hBREVSXCIg0LfQsNC00LDQtdGCINGE0YDQsNCz0LzQtdC90YLQvdGL0Lkg0YjQtdC50LTQtdGALlxuICovXG50eXBlIFdlYkdsU2hhZGVyVHlwZSA9ICdWRVJURVhfU0hBREVSJyB8ICdGUkFHTUVOVF9TSEFERVInXG5cbi8qKlxuICog0KLQuNC/INCx0YPRhNC10YDQsCBXZWJHTC5cbiAqINCX0L3QsNGH0LXQvdC40LUgXCJBUlJBWV9CVUZGRVJcIiDQt9Cw0LTQsNC10YIg0LHRg9GE0LXRgCDRgdC+0LTQtdGA0LbQsNGJ0LjQuSDQstC10YDRiNC40L3QvdGL0LUg0LDRgtGA0LjQsdGD0YLRiy5cbiAqINCX0L3QsNGH0LXQvdC40LUgXCJFTEVNRU5UX0FSUkFZX0JVRkZFUlwiINC30LDQtNCw0LXRgiDQsdGD0YTQtdGAINC40YHQv9C+0LvRjNC30YPRjtGJ0LjQudGB0Y8g0LTQu9GPINC40L3QtNC10LrRgdC40YDQvtCy0LDQvdC40Y8g0Y3Qu9C10LzQtdC90YLQvtCyLlxuICovXG50eXBlIFdlYkdsQnVmZmVyVHlwZSA9ICdBUlJBWV9CVUZGRVInIHwgJ0VMRU1FTlRfQVJSQVlfQlVGRkVSJ1xuXG4vKipcbiAqINCi0LjQvyDQv9C10YDQtdC80LXQvdC90L7QuSBXZWJHTC5cbiAqINCX0L3QsNGH0LXQvdC40LUgXCJ1bmlmb3JtXCIg0LfQsNC00LDQtdGCINC+0LHRidGD0Y4g0LTQu9GPINCy0YHQtdGFINCy0LXRgNGI0LjQvdC90YvRhSDRiNC10LnQtNC10YDQvtCyINC/0LXRgNC10LzQtdC90L3Rg9GOLlxuICog0JfQvdCw0YfQtdC90LjQtSBcImF0dHJpYnV0ZVwiINC30LDQtNCw0LXRgiDRg9C90LjQutCw0LvRjNC90YPRjiDQv9C10YDQtdC80LXQvdC90YPRjiDQtNC70Y8g0LrQsNC20LTQvtCz0L4g0LLQtdGA0YjQuNC90L3QvtCz0L4g0YjQtdC50LTQtdGA0LAuXG4gKiDQl9C90LDRh9C10L3QuNC1IFwidmFyeWluZ1wiINC30LDQtNCw0LXRgiDRg9C90LjQutCw0LvRjNC90YPRjiDQv9C10YDQtdC80LXQvdC90YPRjiDRgSDQvtCx0YnQtdC5INC+0LHQu9Cw0YHRgtGM0Y4g0LLQuNC00LjQvNC+0YHRgtC4INC00LvRjyDQstC10YDRiNC40L3QvdC+0LPQviDQuCDRhNGA0LDQs9C80LXQvdGC0L3QvtCz0L4g0YjQtdC50LTQtdGA0L7Qsi5cbiAqL1xudHlwZSBXZWJHbFZhcmlhYmxlVHlwZSA9ICd1bmlmb3JtJyB8ICdhdHRyaWJ1dGUnIHwgJ3ZhcnlpbmcnXG5cbi8qKlxuICog0KLQuNC/INC80LDRgdGB0LjQstCwINC00LDQvdC90YvRhSwg0LfQsNC90LjQvNCw0Y7RidC40YUg0LIg0L/QsNC80Y/RgtC4INC90LXQv9GA0LXRgNGL0LLQvdGL0Lkg0L7QsdGK0LXQvC5cbiAqL1xudHlwZSBUeXBlZEFycmF5ID0gSW50OEFycmF5IHwgSW50MTZBcnJheSB8IEludDMyQXJyYXkgfCBVaW50OEFycmF5IHxcbiAgVWludDE2QXJyYXkgfCBVaW50MzJBcnJheSB8IEZsb2F0MzJBcnJheSB8IEZsb2F0NjRBcnJheVxuXG4vKipcbiAqINCi0LjQvyDQtNC70Y8g0L3QsNGB0YLRgNC+0LXQuiDQv9GA0LjQu9C+0LbQtdC90LjRjy5cbiAqXG4gKiBAcGFyYW0gaXRlcmF0aW9uQ2FsbGJhY2sgLSDQpNGD0L3QutGG0LjRjyDQuNGC0LXRgNC40YDQvtCy0LDQvdC40Y8g0LjRgdGF0L7QtNC90YvRhSDQvtCx0YrQtdC60YLQvtCyLlxuICogQHBhcmFtIHBvbHlnb25QYWxldHRlIC0g0KbQstC10YLQvtCy0LDRjyDQv9Cw0LvQuNGC0YDQsCDQv9C+0LvQuNCz0L7QvdC+0LIuXG4gKiBAcGFyYW0gZ3JpZFNpemUgLSDQoNCw0LfQvNC10YAg0LrQvtC+0YDQtNC40L3QsNGC0L3QvtC5INC/0LvQvtGB0LrQvtGB0YLQuCDQsiDQv9C40LrRgdC10LvRj9GFLlxuICogQHBhcmFtIHBvbHlnb25TaXplIC0g0KDQsNC30LzQtdGAINC/0L7Qu9C40LPQvtC90LAg0L3QsCDQs9GA0LDRhNC40LrQtSDQsiDQv9C40LrRgdC10LvRj9GFICjRgdGC0L7RgNC+0L3QsCDQtNC70Y8g0LrQstCw0LTRgNCw0YLQsCwg0LTQuNCw0LzQtdGC0YAg0LTQu9GPINC60YDRg9Cz0LAg0Lgg0YIu0L8uKVxuICogQHBhcmFtIGNpcmNsZUFwcHJveExldmVsIC0g0KHRgtC10L/QtdC90Ywg0LTQtdGC0LDQu9C40LfQsNGG0LjQuCDQutGA0YPQs9CwIC0g0LrQvtC70LjRh9C10YHRgtCy0L4g0YPQs9C70L7QsiDQv9C+0LvQuNCz0L7QvdCwLCDQsNC/0YDQvtC60YHQuNC80LjRgNGD0Y7RidC10LPQviDQvtC60YDRg9C20L3QvtGB0YLRjCDQutGA0YPQs9CwLlxuICogQHBhcmFtIGRlYnVnTW9kZSAtINCf0LDRgNCw0LzQtdGC0YDRiyDRgNC10LbQuNC80LAg0L7RgtC70LDQtNC60Lgg0L/RgNC40LvQvtC20LXQvdC40Y8uXG4gKiBAcGFyYW0gZGVtb01vZGUgLSDQn9Cw0YDQsNC80LXRgtGA0Ysg0YDQtdC20LjQvNCwINC40YHQv9C+0LvRjNC30L7QstCw0L3QuNGPINC00LXQvNC+0L3RgdGC0YDQsNGG0LjQvtC90L3Ri9GFINC00LDQvdC90YvRhS5cbiAqIEBwYXJhbSBmb3JjZVJ1biAtINCf0YDQuNC30L3QsNC6INGC0L7Qs9C+LCDRh9GC0L4g0YDQtdC90LTQtdGA0LjQvdCzINC90LXQvtCx0YXQvtC00LjQvNC+INC90LDRh9Cw0YLRjCDRgdGA0LDQt9GDINC/0L7RgdC70LUg0LfQsNC00LDQvdC40Y8g0L3QsNGB0YLRgNC+0LXQuiDRjdC60LfQtdC80L/Qu9GP0YDQsCAo0L/QviDRg9C80L7Qu9GH0LDQvdC40Y5cbiAqICAgICDRgNC10L3QtNC10YDQuNC90LMg0LfQsNC/0YPRgdC60LDQtdGC0YHRjyDRgtC+0LvRjNC60L4g0L/QvtGB0LvQtSDQstGL0LfQvtCy0LAg0LzQtdGC0L7QtNCwIHN0YXJ0KS5cbiAqIEBwYXJhbSBtYXhBbW91bnRPZlBvbHlnb25zIC0g0JjRgdC60YPRgdGB0YLQstC10L3QvdC+0LUg0L7Qs9GA0LDQvdC40YfQtdC90LjQtSDQutC+0LvQuNGH0LXRgdGC0LLQsCDQvtGC0L7QsdGA0LDQttCw0LXQvNGL0YUg0L/QvtC70LjQs9C+0L3QvtCyLiDQn9GA0Lgg0LTQvtGB0YLQuNC20LXQvdC40Lgg0Y3RgtC+0LPQviDRh9C40YHQu9CwXG4gKiAgICAg0LjRgtC10YDQuNGA0L7QstCw0L3QuNC1INC40YHRhdC+0LTQvdGL0YUg0L7QsdGK0LXQutGC0L7QsiDQv9GA0LXRgNGL0LLQsNC10YLRgdGPLCDQtNCw0LbQtSDQtdGB0LvQuCDQvtCx0YDQsNCx0L7RgtCw0L3RiyDQvdC1INCy0YHQtSDQvtCx0YrQtdC60YLRiy5cbiAqIEBwYXJhbSBiZ0NvbG9yIC0g0KTQvtC90L7QstGL0Lkg0YbQstC10YIg0LrQsNC90LLQsNGB0LAuXG4gKiBAcGFyYW0gcnVsZXNDb2xvciAtINCm0LLQtdGCINC90LDQv9GA0LDQstC70Y/RjtGJ0LjRhS5cbiAqIEBwYXJhbSBjYW1lcmEgLSDQn9C+0LvQvtC20LXQvdC40LUg0LrQvtC+0YDQtNC40L3QsNGC0L3QvtC5INC/0LvQvtGB0LrQvtGB0YLQuCDQsiDQvtCx0LvQsNGB0YLQuCDQv9GA0L7RgdC80L7RgtGA0LAuXG4gKiBAcGFyYW0gd2ViR2xTZXR0aW5ncyAtINCY0L3QuNGG0LjQsNC70LjQt9C40YDRg9GO0YnQuNC1INC90LDRgdGC0YDQvtC50LrQuCDQutC+0L3RgtC10LrRgdGC0LAg0YDQtdC90LTQtdGA0LjQvdCz0LAgV2ViR0wuXG4gKi9cbmludGVyZmFjZSBTUGxvdE9wdGlvbnMge1xuICBpdGVyYXRpb25DYWxsYmFjaz86IFNQbG90SXRlcmF0aW9uRnVuY3Rpb24sXG4gIHBvbHlnb25QYWxldHRlPzogSEVYQ29sb3JbXSxcbiAgZ3JpZFNpemU/OiBTUGxvdEdyaWRTaXplLFxuICBwb2x5Z29uU2l6ZT86IG51bWJlcixcbiAgY2lyY2xlQXBwcm94TGV2ZWw/OiBudW1iZXIsXG4gIGRlYnVnTW9kZT86IFNQbG90RGVidWdNb2RlLFxuICBkZW1vTW9kZT86IFNQbG90RGVtb01vZGUsXG4gIGZvcmNlUnVuPzogYm9vbGVhbixcbiAgbWF4QW1vdW50T2ZQb2x5Z29ucz86IG51bWJlcixcbiAgYmdDb2xvcj86IEhFWENvbG9yLFxuICBydWxlc0NvbG9yPzogSEVYQ29sb3IsXG4gIGNhbWVyYT86IFNQbG90Q2FtZXJhLFxuICB3ZWJHbFNldHRpbmdzPzogV2ViR0xDb250ZXh0QXR0cmlidXRlc1xufVxuXG4vKipcbiAqINCi0LjQvyDQtNC70Y8g0LjQvdGE0L7RgNC80LDRhtC40Lgg0L4g0L/QvtC70LjQs9C+0L3QtS4g0KHQvtC00LXRgNC20LjRgiDQtNCw0L3QvdGL0LUsINC90LXQvtCx0YXQvtC00LjQvNGL0LUg0LTQu9GPINC00L7QsdCw0LLQu9C10L3QuNGPINC/0L7Qu9C40LPQvtC90LAg0LIg0LPRgNGD0L/Qv9GDINC/0L7Qu9C40LPQvtC90L7Qsi4g0J/QvtC70LjQs9C+0L0gLSDRjdGC0L5cbiAqINGB0L/Qu9C+0YjQvdCw0Y8g0YTQuNCz0YPRgNCwINC90LAg0LrQvtC+0YDQtNC40L3QsNGC0L3QvtC5INC/0LvQvtGB0LrQvtGB0YLQuCwg0L7QtNC90L7Qt9C90LDRh9C90L4g0L/RgNC10LTRgdGC0LDQstC70Y/RjtGJ0LDRjyDQvtC00LjQvSDQuNGB0YXQvtC00L3Ri9C5INC+0LHRitC10LrRgi5cbiAqXG4gKiBAcGFyYW0geCAtINCa0L7QvtGA0LTQuNC90LDRgtCwINGG0LXQvdGC0YDQsCDQv9C+0LvQuNCz0L7QvdCwINC90LAg0L7RgdC4INCw0LHRgdGG0LjRgdGBLiDQnNC+0LbQtdGCINCx0YvRgtGMINC60LDQuiDRhtC10LvRi9C8LCDRgtCw0Log0Lgg0LLQtdGJ0LXRgdGC0LLQtdC90L3Ri9C8INGH0LjRgdC70L7QvC5cbiAqIEBwYXJhbSB5IC0g0JrQvtC+0YDQtNC40L3QsNGC0LAg0YbQtdC90YLRgNCwINC/0L7Qu9C40LPQvtC90LAg0L3QsCDQvtGB0Lgg0L7RgNC00LjQvdCw0YIuINCc0L7QttC10YIg0LHRi9GC0Ywg0LrQsNC6INGG0LXQu9GL0LwsINGC0LDQuiDQuCDQstC10YnQtdGB0YLQstC10L3QvdGL0Lwg0YfQuNGB0LvQvtC8LlxuICogQHBhcmFtIHNoYXBlIC0g0KTQvtGA0LzQsCDQv9C+0LvQuNCz0L7QvdCwLiDQpNC+0YDQvNCwIC0g0Y3RgtC+INC40L3QtNC10LrRgSDQsiDQvNCw0YHRgdC40LLQtSDRhNC+0YDQvCB7QGxpbmsgc2hhcGVzfS4g0J7RgdC90L7QstC90YvQtSDRhNC+0YDQvNGLOiAwIC0g0YLRgNC10YPQs9C+0LvRjNC90LjQuiwgMSAtXG4gKiAgICAg0LrQstCw0LTRgNCw0YIsIDIgLSDQutGA0YPQsy5cbiAqIEBwYXJhbSBjb2xvciAtINCm0LLQtdGCINC/0L7Qu9C40LPQvtC90LAuINCm0LLQtdGCIC0g0Y3RgtC+INC40L3QtNC10LrRgSDQsiDQtNC40LDQv9Cw0LfQvtC90LUg0L7RgiAwINC00L4gMjU1LCDQv9GA0LXQtNGB0YLQsNCy0LvRj9GO0YnQuNC5INGB0L7QsdC+0Lkg0LjQvdC00LXQutGBINGG0LLQtdGC0LAg0LJcbiAqICAgICDQv9GA0LXQtNC+0L/RgNC10LTQtdC70LXQvdC90L7QvCDQvNCw0YHRgdC40LLQtSDRhtCy0LXRgtC+0LIge0BsaW5rIHBvbHlnb25QYWxldHRlfS5cbiAqL1xuaW50ZXJmYWNlIFNQbG90UG9seWdvbiB7XG4gIHg6IG51bWJlcixcbiAgeTogbnVtYmVyLFxuICBzaGFwZTogbnVtYmVyLFxuICBjb2xvcjogbnVtYmVyXG59XG5cbi8qKlxuICog0KLQuNC/INC00LvRjyDRgNCw0LfQvNC10YDQsCDQutC+0L7RgNC00LjQvdCw0YLQvdC+0Lkg0L/Qu9C+0YHQutC+0YHRgtC4LlxuICpcbiAqIEBwYXJhbSB3aWR0aCAtINCo0LjRgNC40L3QsCDQutC+0L7RgNC00LjQvdCw0YLQvdC+0Lkg0L/Qu9C+0YHQutC+0YHRgtC4INCyINC/0LjQutGB0LXQu9GP0YUuXG4gKiBAcGFyYW0gaGVpZ2h0IC0g0JLRi9GB0L7RgtCwINC60L7QvtGA0LTQuNC90LDRgtC90L7QvtC5INC/0LvQvtGB0LrQvtGB0YLQuCDQsiDQv9C40LrRgdC10LvRj9GFLlxuICovXG5pbnRlcmZhY2UgU1Bsb3RHcmlkU2l6ZSB7XG4gIHdpZHRoOiBudW1iZXIsXG4gIGhlaWdodDogbnVtYmVyXG59XG5cbi8qKlxuICog0KLQuNC/INC00LvRjyDQv9Cw0YDQsNC80LXRgtGA0L7QsiDRgNC10LbQuNC80LAg0L7RgtC70LDQtNC60LguXG4gKlxuICogQHBhcmFtIGlzRW5hYmxlIC0g0J/RgNC40LfQvdCw0Log0LLQutC70Y7Rh9C10L3QuNGPINC+0YLQu9Cw0LTQvtGH0L3QvtCz0L4g0YDQtdC20LjQvNCwLlxuICogQHBhcmFtIG91dHB1dCAtINCc0LXRgdGC0L4g0LLRi9Cy0L7QtNCwINC+0YLQu9Cw0LTQvtGH0L3QvtC5INC40L3RhNC+0YDQvNCw0YbQuNC4LlxuICogQHBhcmFtIGhlYWRlclN0eWxlIC0g0KHRgtC40LvRjCDQtNC70Y8g0LfQsNCz0L7Qu9C+0LLQutCwINCy0YHQtdCz0L4g0L7RgtC70LDQtNC+0YfQvdC+0LPQviDQsdC70L7QutCwLlxuICogQHBhcmFtIGdyb3VwU3R5bGUgLSDQodGC0LjQu9GMINC00LvRjyDQt9Cw0LPQvtC70L7QstC60LAg0LPRgNGD0L/Qv9C40YDQvtCy0LrQuCDQvtGC0LvQsNC00L7Rh9C90YvRhSDQtNCw0L3QvdGL0YUuXG4gKi9cbmludGVyZmFjZSBTUGxvdERlYnVnTW9kZSB7XG4gIGlzRW5hYmxlPzogYm9vbGVhbixcbiAgb3V0cHV0PzogU1Bsb3REZWJ1Z091dHB1dCxcbiAgaGVhZGVyU3R5bGU/OiBzdHJpbmcsXG4gIGdyb3VwU3R5bGU/OiBzdHJpbmdcbn1cblxuLyoqXG4gKiDQotC40L8g0LTQu9GPINC/0LDRgNCw0LzQtdGC0YDQvtCyINGA0LXQttC40LzQsCDQvtGC0L7QsdGA0LDQttC10L3QuNGPINC00LXQvNC+0L3RgdGC0YDQsNGG0LjQvtC90L3Ri9GFINC00LDQvdC90YvRhS5cbiAqXG4gKiBAcGFyYW0gaXNFbmFibGUgLSDQn9GA0LjQt9C90LDQuiDQstC60LvRjtGH0LXQvdC40Y8g0LTQtdC80L4t0YDQtdC20LjQvNCwLiDQkiDRjdGC0L7QvCDRgNC10LbQuNC80LUg0L/RgNC40LvQvtC20LXQvdC40LUg0LLQvNC10YHRgtC+INCy0L3QtdGI0L3QtdC5INGE0YPQvdC60YbQuNC4INC40YLQtdGA0LjRgNC+0LLQsNC90LjRj1xuICogICAgINC40YHRhdC+0LTQvdGL0YUg0L7QsdGK0LXQutGC0L7QsiDQuNGB0L/QvtC70YzQt9GD0LXRgiDQstC90YPRgtGA0LXQvdC90LjQuSDQvNC10YLQvtC0LCDQuNC80LjRgtC40YDRg9GO0YnQuNC5INC40YLQtdGA0LjRgNC+0LLQsNC90LjQtS5cbiAqIEBwYXJhbSBhbW91bnQgLSDQmtC+0LvQuNGH0LXRgdGC0LLQviDQuNC80LjRgtC40YDRg9C10LzRi9GFINC40YHRhdC+0LTQvdGL0YUg0L7QsdGK0LXQutGC0L7Qsi5cbiAqIEBwYXJhbSBzaGFwZVF1b3RhIC0g0KfQsNGB0YLQvtGC0LAg0L/QvtGP0LLQu9C10L3QuNGPINCyINC40YLQtdGA0LjRgNC+0LLQsNC90LjQuCDRgNCw0LfQu9C40YfQvdGL0YUg0YTQvtGA0Lwg0L/QvtC70LjQs9C+0L3QvtCyIC0g0YLRgNC10YPQs9C+0LvRjNC90LjQutC+0LJbMF0sINC60LLQsNC00YDQsNGC0L7QslsxXSxcbiAqICAgICDQutGA0YPQs9C+0LJbMl0g0Lgg0YIu0LQuINCf0YDQuNC80LXRgDog0LzQsNGB0YHQuNCyIFszLCAyLCA1XSDQvtC30L3QsNGH0LDQtdGCLCDRh9GC0L4g0YfQsNGB0YLQvtGC0LAg0L/QvtGP0LLQu9C10L3QuNGPINGC0YDQtdGD0LPQvtC70YzQvdC40LrQvtCyID0gMy8oMysyKzUpID0gMy8xMCxcbiAqICAgICDRh9Cw0YHRgtC+0YLQsCDQv9C+0Y/QstC70LXQvdC40Y8g0LrQstCw0LTRgNCw0YLQvtCyID0gMi8oMysyKzUpID0gMi8xMCwg0YfQsNGB0YLQvtGC0LAg0L/QvtGP0LLQu9C10L3QuNGPINC60YDRg9Cz0L7QsiA9IDUvKDMrMis1KSA9IDUvMTAuXG4gKiBAcGFyYW0gaW5kZXggLSDQn9Cw0YDQsNC80LXRgtGAINC40YHQv9C+0LvRjNC30YPQtdC80YvQuSDQtNC70Y8g0LjQvNC40YLQsNGG0LjQuCDQuNGC0LXRgNC40YDQvtCy0LDQvdC40Y8uINCX0LDQtNCw0L3QuNGPINC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjNGB0LrQvtCz0L4g0LfQvdCw0YfQtdC90LjRjyDQvdC1INGC0YDQtdCx0YPQtdGCLlxuICovXG5pbnRlcmZhY2UgU1Bsb3REZW1vTW9kZSB7XG4gIGlzRW5hYmxlPzogYm9vbGVhbixcbiAgYW1vdW50PzogbnVtYmVyLFxuICBzaGFwZVF1b3RhPzogbnVtYmVyW10sXG4gIGluZGV4PzogbnVtYmVyXG59XG5cbi8qKlxuICog0KLQuNC/INC00LvRjyDQv9C+0LvQvtC20LXQvdC40Y8g0LrQvtC+0YDQtNC40L3QsNGC0L3QvtC5INC/0LvQvtGB0LrQvtGB0YLQuCDQsiDQvtCx0LvQsNGB0YLQuCDQv9GA0L7RgdC80L7RgtGA0LAuXG4gKlxuICogQHBhcmFtIHggLSDQmtC+0L7RgNC00LjQvdCw0YLQsCDQs9GA0LDRhNC40LrQsCDQvdCwINC+0YHQuCDQsNCx0YHRhtC40YHRgS5cbiAqIEBwYXJhbSB5IC0g0JrQvtC+0YDQtNC40L3QsNGC0LAg0LPRgNCw0YTQuNC60LAg0L3QsCDQvtGB0Lgg0L7RgNC00LjQvdCw0YIuXG4gKiBAcGFyYW0gem9vbSAtINCh0YLQtdC/0LXQvdGMIFwi0L/RgNC40LHQu9C40LbQtdC90LjRj1wiINC90LDQsdC70Y7QtNCw0YLQtdC70Y8g0Log0LPRgNCw0YTQuNC60YMgKNC80LDRgdGI0YLQsNCxINC60L7QvtC00YDQuNC90LDRgtC90L7QuSDQv9C70L7RgdC60L7RgdGC0Lgg0LIg0L7QsdC70LDRgdGC0Lgg0L/RgNC+0YHQvNC+0YLRgNCwKS5cbiAqL1xuaW50ZXJmYWNlIFNQbG90Q2FtZXJhIHtcbiAgeDogbnVtYmVyLFxuICB5OiBudW1iZXIsXG4gIHpvb206IG51bWJlclxufVxuXG4vKipcbiAqINCi0LjQvyDQtNC70Y8g0YLRgNCw0L3RgdGE0L7RgNC80LDRhtC40LguINCh0L7QtNC10YDQttC40YIg0LLRgdGOINGC0LXRhdC90LjRh9C10YHQutGD0Y4g0LjQvdGE0L7RgNC80LDRhtC40Y4sINC90LXQvtCx0YXQvtC00LjQvNGD0Y4g0LTQu9GPINGA0LDRgdGB0YfQtdGC0LAg0YLQtdC60YPRidC10LPQviDQv9C+0LvQvtC20LXQvdC40Y8g0LrQvtC+0YDQtNC40L3QsNGC0L3QvtC5XG4gKiDQv9C70L7RgdC60L7RgdGC0Lgg0LIg0L7QsdC70LDRgdGC0Lgg0L/RgNC+0YHQvNC+0YLRgNCwINCy0L4g0LLRgNC10LzRjyDRgdC+0LHRi9GC0LjQuSDQv9C10YDQtdC80LXRidC10L3QuNGPINC4INC30YPQvNC40YDQvtCy0LDQvdC40Y8g0LrQsNC90LLQsNGB0LAuXG4gKlxuICogQHBhcmFtIG1hdHJpeCAtINCe0YHQvdC+0LLQvdCw0Y8g0LzQsNGC0YDQuNGG0LAg0YLRgNCw0L3RgdGE0L7RgNC80LDRhtC40LggM3gzINCyINCy0LjQtNC1INC+0LTQvdC+0LzQtdGA0L3QvtCz0L4g0LzQsNGB0YHQuNCy0LAg0LjQtyA5INGN0LvQtdC80LXQvdGC0L7Qsi5cbiAqIEBwYXJhbSBzdGFydEludk1hdHJpeCAtINCS0YHQv9C+0LzQvtCz0LDRgtC10LvRjNC90LDRjyDQvNCw0YLRgNC40YbQsCDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuC5cbiAqIEBwYXJhbSBzdGFydENhbWVyYVggLSDQktGB0L/QvtC80L7Qs9Cw0YLQtdC70YzQvdCw0Y8g0YLQvtGH0LrQsCDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuC5cbiAqIEBwYXJhbSBzdGFydENhbWVyYVkgLSDQktGB0L/QvtC80L7Qs9Cw0YLQtdC70YzQvdCw0Y8g0YLQvtGH0LrQsCDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuC5cbiAqIEBwYXJhbSBzdGFydFBvc1ggLSDQktGB0L/QvtC80L7Qs9Cw0YLQtdC70YzQvdCw0Y8g0YLQvtGH0LrQsCDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuC5cbiAqIEBwYXJhbSBzdGFydFBvc1kgLSDQktGB0L/QvtC80L7Qs9Cw0YLQtdC70YzQvdCw0Y8g0YLQvtGH0LrQsCDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuC5cbiAqL1xuaW50ZXJmYWNlIFNQbG90VHJhbnNmb3JtYXRpb24ge1xuICBtYXRyaXg6IG51bWJlcltdLFxuICBzdGFydEludk1hdHJpeDogbnVtYmVyW10sXG4gIHN0YXJ0Q2FtZXJhWDogbnVtYmVyLFxuICBzdGFydENhbWVyYVk6IG51bWJlcixcbiAgc3RhcnRQb3NYOiBudW1iZXIsXG4gIHN0YXJ0UG9zWTogbnVtYmVyXG59XG5cbi8qKlxuICog0KLQuNC/INC00LvRjyDQuNC90YTQvtGA0LzQsNGG0LjQuCDQviDQsdGD0YTQtdGA0LDRhSwg0YTQvtGA0LzQuNGA0YPRjtGJ0LjRhSDQtNCw0L3QvdGL0LUg0LTQu9GPINC30LDQs9GA0YPQt9C60Lgg0LIg0LLQuNC00LXQvtC/0LDQvNGP0YLRjC5cbiAqXG4gKiBAcGFyYW0gdmVydGV4QnVmZmVycyAtINCc0LDRgdGB0LjQsiDQsdGD0YTQtdGA0L7QsiDRgSDQuNC90YTQvtGA0LzQsNGG0LjQtdC5INC+INCy0LXRgNGI0LjQvdCw0YUg0L/QvtC70LjQs9C+0L3QvtCyLlxuICogQHBhcmFtIGNvbG9yQnVmZmVycyAtINCc0LDRgdGB0LjQsiDQsdGD0YTQtdGA0L7QsiDRgSDQuNC90YTQvtGA0LzQsNGG0LjQtdC5INC+INGG0LLQtdGC0LDRhSDQstC10YDRiNC40L0g0L/QvtC70LjQs9C+0L3QvtCyLlxuICogQHBhcmFtIGluZGV4QnVmZmVycyAtINCc0LDRgdGB0LjQsiDQsdGD0YTQtdGA0L7QsiDRgSDQuNC90LTQtdC60YHQsNC80Lgg0LLQtdGA0YjQuNC9INC/0L7Qu9C40LPQvtC90L7Qsi5cbiAqIEBwYXJhbSBhbW91bnRPZkJ1ZmZlckdyb3VwcyAtINCa0L7Qu9C40YfQtdGB0YLQstC+INCx0YPRhNC10YDQvdGL0YUg0LPRgNGD0L/QvyDQsiDQvNCw0YHRgdC40LLQtS4g0JLRgdC1INGD0LrQsNC30LDQvdC90YvQtSDQstGL0YjQtSDQvNCw0YHRgdC40LLRiyDQsdGD0YTQtdGA0L7QsiDRgdC+0LTQtdGA0LbQsNGCXG4gKiAgICAg0L7QtNC40L3QsNC60L7QstC+0LUg0LrQvtC70LjRh9C10YHRgtCy0L4g0LHRg9GE0LXRgNC+0LIuXG4gKiBAcGFyYW0gYW1vdW50T2ZHTFZlcnRpY2VzIC0g0JrQvtC70LjRh9C10YHRgtCy0L4g0LLQtdGA0YjQuNC9LCDQvtCx0YDQsNC30YPRjtGJ0LjRhSBHTC3RgtGA0LXRg9Cz0L7Qu9GM0L3QuNC60Lgg0LrQsNC20LTQvtCz0L4g0LLQtdGA0YjQuNC90L3QvtCz0L4g0LHRg9GE0LXRgNCwLlxuICogQHBhcmFtIGFtb3VudE9mU2hhcGVzIC0g0JrQvtC70LjRh9C10YHRgtCy0L4g0L/QvtC70LjQs9C+0L3QvtCyINC60LDQttC00L7QuSDRhNC+0YDQvNGLICjRgdC60L7Qu9GM0LrQviDRgtGA0LXRg9Cz0L7Qu9GM0L3QuNC60L7Qsiwg0LrQstCw0LTRgNCw0YLQvtCyLCDQutGA0YPQs9C+0LIg0Lgg0YIu0LQuKS5cbiAqIEBwYXJhbSBhbW91bnRPZlRvdGFsVmVydGljZXMgLSDQntCx0YnQtdC1INC60L7Qu9C40YfQtdGB0YLQstC+INCy0LXRgNGI0LjQvSDQstGB0LXRhSDQstC10YDRiNC40L3QvdGL0YUg0LHRg9GE0LXRgNC+0LIgKHZlcnRleEJ1ZmZlcnMpLlxuICogQHBhcmFtIGFtb3VudE9mVG90YWxHTFZlcnRpY2VzIC0g0J7QsdGJ0LXQtSDQutC+0LvQuNGH0LXRgdGC0LLQviDQstC10YDRiNC40L0g0LLRgdC10YUg0LjQvdC00LXQutGB0L3Ri9GFINCx0YPRhNC10YDQvtCyIChpbmRleEJ1ZmZlcnMpLlxuICogQHBhcmFtIHNpemVJbkJ5dGVzIC0g0KDQsNC30LzQtdGA0Ysg0LHRg9GE0LXRgNC+0LIg0LrQsNC20LTQvtCz0L4g0YLQuNC/0LAgKNC00LvRjyDQstC10YDRiNC40L0sINC00LvRjyDRhtCy0LXRgtC+0LIsINC00LvRjyDQuNC90LTQtdC60YHQvtCyKSDQsiDQsdCw0LnRgtCw0YUuXG4gKi9cbmludGVyZmFjZSBTUGxvdEJ1ZmZlcnMge1xuICB2ZXJ0ZXhCdWZmZXJzOiBXZWJHTEJ1ZmZlcltdLFxuICBjb2xvckJ1ZmZlcnM6IFdlYkdMQnVmZmVyW10sXG4gIGluZGV4QnVmZmVyczogV2ViR0xCdWZmZXJbXSxcbiAgYW1vdW50T2ZCdWZmZXJHcm91cHM6IG51bWJlcixcbiAgYW1vdW50T2ZHTFZlcnRpY2VzOiBudW1iZXJbXSxcbiAgYW1vdW50T2ZTaGFwZXM6IG51bWJlcltdLFxuICBhbW91bnRPZlRvdGFsVmVydGljZXM6IG51bWJlcixcbiAgYW1vdW50T2ZUb3RhbEdMVmVydGljZXM6IG51bWJlcixcbiAgc2l6ZUluQnl0ZXM6IG51bWJlcltdXG59XG5cbi8qKlxuICog0KLQuNC/INC00LvRjyDQuNC90YTQvtGA0LzQsNGG0LjQuCDQviDQs9GA0YPQv9C/0LUg0L/QvtC70LjQs9C+0L3QvtCyLCDQutC+0YLQvtGA0YPRjiDQvNC+0LbQvdC+INC+0YLQvtCx0YDQsNC30LjRgtGMINC90LAg0LrQsNC90LLQsNGB0LUg0LfQsCDQvtC00LjQvSDQstGL0LfQvtCyINGE0YPQvdC60YbQuNC4IHtAbGluayBkcmF3RWxlbWVudHN9LlxuICpcbiAqIEBwYXJhbSB2ZXJ0aWNlcyAtINCc0LDRgdGB0LjQsiDQstC10YDRiNC40L0g0LLRgdC10YUg0L/QvtC70LjQs9C+0L3QvtCyINCz0YDRg9C/0L/Riy4g0JrQsNC20LTQsNGPINCy0LXRgNGI0LjQvdCwIC0g0Y3RgtC+INC/0LDRgNCwINGH0LjRgdC10LsgKNC60L7QvtGA0LTQuNC90LDRgtGLINCy0LXRgNGI0LjQvdGLINC90LBcbiAqICAgICDQv9C70L7RgdC60L7RgdGC0LgpLiDQmtC+0L7RgNC00LjQvdCw0YLRiyDQvNC+0LPRg9GCINCx0YvRgtGMINC60LDQuiDRhtC10LvRi9C80LgsINGC0LDQuiDQuCDQstC10YnQtdGB0YLQstC10L3QvdGL0LzQuCDRh9C40YHQu9Cw0LzQuC5cbiAqIEBwYXJhbSBpbmRpY2VzIC0g0JzQsNGB0YHQuNCyINC40L3QtNC10LrRgdC+0LIg0LLQtdGA0YjQuNC9INC/0L7Qu9C40LPQvtC90L7QsiDQs9GA0YPQv9C/0YsuINCa0LDQttC00YvQuSDQuNC90LTQtdC60YEgLSDRjdGC0L4g0L3QvtC80LXRgCDQstC10YDRiNC40L3RiyDQsiDQvNCw0YHRgdC40LLQtSDQstC10YDRiNC40L0uINCY0L3QtNC10LrRgdGLXG4gKiAgICAg0L7Qv9C40YHRi9Cy0LDRjtGCINCy0YHQtSBHTC3RgtGA0LXRg9Cz0L7Qu9GM0L3QuNC60LgsINC40Lcg0LrQvtGC0L7RgNGL0YUg0YHQvtGB0YLQvtGP0YIg0L/QvtC70LjQs9C+0L3RiyDQs9GA0YPQv9C/0YssINGCLtC+LiDQutCw0LbQtNCw0Y8g0YLRgNC+0LnQutCwINC40L3QtNC10LrRgdC+0LIg0LrQvtC00LjRgNGD0LXRgiDQvtC00LjQvVxuICogICAgIEdMLdGC0YDQtdGD0LPQvtC70YzQvdC40LouINCY0L3QtNC10LrRgdGLIC0g0Y3RgtC+INGG0LXQu9GL0LUg0YfQuNGB0LvQsCDQsiDQtNC40LDQv9Cw0LfQvtC90LUg0L7RgiAwINC00L4gNjU1MzUsINGH0YLQviDQvdCw0LrQu9Cw0LTRi9Cy0LDQtdGCINC+0LPRgNCw0L3QuNGH0LXQvdC40LUg0L3QsCDQvNCw0LrRgdC40LzQsNC70YzQvdC+0LVcbiAqICAgICDQutC+0LvQuNGH0LXRgdGC0LLQviDQstC10YDRiNC40L0sINGF0YDQsNC90LjQvNGL0YUg0LIg0LPRgNGD0L/Qv9C1INC/0L7Qu9C40LPQvtC90L7QsiAo0L3QtSDQsdC+0LvQtdC1IDMyNzY4INGI0YLRg9C6KS5cbiAqIEBwYXJhbSBjb2xvcnMgLSDQnNCw0YHRgdC40LIg0YbQstC10YLQvtCyINCy0LXRgNGI0LjQvSDQv9C+0LvQuNCz0L7QvdC+0LIg0LPRgNGD0L/Qv9GLLiDQmtCw0LbQtNC+0LUg0YfQuNGB0LvQviDQt9Cw0LTQsNC10YIg0YbQstC10YIg0L7QtNC90L7QuSDQstC10YDRiNC40L3RiyDQsiDQvNCw0YHRgdC40LLQtSDQstC10YDRiNC40L0uINCn0YLQvtCx0YtcbiAqICAgICDQv9C+0LvQuNCz0L7QvSDQsdGL0Lsg0YHQv9C70L7RiNC90L7Qs9C+INC+0LTQvdC+0YDQvtC00L3QvtCz0L4g0YbQstC10YLQsCDQvdC10L7QsdGF0L7QtNC40LzQviDRh9GC0L7QsdGLINCy0YHQtSDQstC10YDRiNC40L3RiyDQv9C+0LvQuNCz0L7QvdCwINC40LzQtdC70Lgg0L7QtNC40L3QsNC60L7QstGL0Lkg0YbQstC10YIuINCm0LLQtdGCIC0g0Y3RgtC+XG4gKiAgICAg0YbQtdC70L7QtSDRh9C40YHQu9C+INCyINC00LjQsNC/0LDQt9C+0L3QtSDQvtGCIDAg0LTQviAyNTUsINC/0YDQtdC00YHRgtCw0LLQu9GP0Y7RidC10LUg0YHQvtCx0L7QuSDQuNC90LTQtdC60YEg0YbQstC10YLQsCDQsiDQv9GA0LXQtNC+0L/RgNC10LTQtdC70LXQvdC90L7QvCDQvNCw0YHRgdC40LLQtSDRhtCy0LXRgtC+0LIuXG4gKiBAcGFyYW0gYW1vdW50T2ZWZXJ0aWNlcyAtINCa0L7Qu9C40YfQtdGB0YLQstC+INCy0YHQtdGFINCy0LXRgNGI0LjQvSDQsiDQs9GA0YPQv9C/0LUg0L/QvtC70LjQs9C+0L3QvtCyLlxuICogQHBhcmFtIGFtb3VudE9mR0xWZXJ0aWNlcyAtINCa0L7Qu9C40YfQtdGB0YLQstC+INCy0LXRgNGI0LjQvSDQstGB0LXRhSBHTC3RgtGA0LXRg9Cz0L7Qu9GM0L3QuNC60L7QsiDQsiDQs9GA0YPQv9C/0LUg0L/QvtC70LjQs9C+0L3QvtCyLlxuICovXG5pbnRlcmZhY2UgU1Bsb3RQb2x5Z29uR3JvdXAge1xuICB2ZXJ0aWNlczogbnVtYmVyW10sXG4gIGluZGljZXM6IG51bWJlcltdLFxuICBjb2xvcnM6IG51bWJlcltdLFxuICBhbW91bnRPZlZlcnRpY2VzOiBudW1iZXIsXG4gIGFtb3VudE9mR0xWZXJ0aWNlczogbnVtYmVyXG59XG5cbi8qKlxuICog0KLQuNC/INC00LvRjyDQuNC90YTQvtGA0LzQsNGG0LjQuCDQviDQstC10YDRiNC40L3QsNGFINC/0L7Qu9C40LPQvtC90LAuXG4gKlxuICogQHBhcmFtIHZlcnRpY2VzIC0g0JzQsNGB0YHQuNCyINCy0YHQtdGFINCy0LXRgNGI0LjQvSDQv9C+0LvQuNCz0L7QvdCwLiDQmtCw0LbQtNCw0Y8g0LLQtdGA0YjQuNC90LAgLSDRjdGC0L4g0L/QsNGA0LAg0YfQuNGB0LXQuyAo0LrQvtC+0YDQtNC40L3QsNGC0Ysg0LLQtdGA0YjQuNC90Ysg0L3QsFxuICogICAgINC/0LvQvtGB0LrQvtGB0YLQuCkuINCa0L7QvtGA0LTQuNC90LDRgtGLINC80L7Qs9GD0YIg0LHRi9GC0Ywg0LrQsNC6INGG0LXQu9GL0LzQuCwg0YLQsNC6INC4INCy0LXRidC10YHRgtCy0LXQvdC90YvQvNC4INGH0LjRgdC70LDQvNC4LlxuICogQHBhcmFtIGluZGljZXMgLSDQnNCw0YHRgdC40LIg0LjQvdC00LXQutGB0L7QsiDQstC10YDRiNC40L0g0L/QvtC70LjQs9C+0L3QsC4g0JrQsNC20LTRi9C5INC40L3QtNC10LrRgSAtINGN0YLQviDQvdC+0LzQtdGAINCy0LXRgNGI0LjQvdGLINCyINC80LDRgdGB0LjQstC1INCy0LXRgNGI0LjQvS4g0JjQvdC00LXQutGB0YtcbiAqICAgICDQvtC/0LjRgdGL0LLQsNGO0YIg0LLRgdC1IEdMLdGC0YDQtdGD0LPQvtC70YzQvdC40LrQuCwg0LjQtyDQutC+0YLQvtGA0YvRhSDRgdC+0YHRgtC+0LjRgiDQv9C+0LvQuNCz0L7QvS5cbiAqL1xuaW50ZXJmYWNlIFNQbG90UG9seWdvblZlcnRpY2VzIHtcbiAgdmFsdWVzOiBudW1iZXJbXSxcbiAgaW5kaWNlczogbnVtYmVyW11cbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU1Bsb3Qge1xuXG4gIC8qKlxuICAgKiDQnNCw0YHRgdC40LIg0LrQu9Cw0YHRgdCwLCDRgdC+0LTQtdGA0LbQsNGJ0LjQuSDRgdGB0YvQu9C60Lgg0L3QsCDQstGB0LUg0YHQvtC30LTQsNC90L3Ri9C1INGN0LrQt9C10LzQv9C70Y/RgNGLINC60LvQsNGB0YHQsC4g0JjQvdC00LXQutGB0LDQvNC4INC80LDRgdGB0LjQstCwINCy0YvRgdGC0YPQv9Cw0Y7RgiDQuNC00LXQvdGC0LjRhNC40LrQsNGC0L7RgNGLXG4gICAqINC60LDQvdCy0LDRgdC+0LIg0Y3QutC30LXQvNC/0LvRj9GA0L7Qsi4g0JjRgdC/0L7Qu9GM0LfRg9C10YLRgdGPINC00LvRjyDQtNC+0YHRgtGD0L/QsCDQuiDQv9C+0LvRj9C8INC4INC80LXRgtC+0LTQsNC8INGN0LrQt9C10LzQv9C70Y/RgNCwINC40Lcg0YLQtdC70LAg0LLQvdC10YjQvdC40YUg0L7QsdGA0LDQsdC+0YfQuNC60L7QsiDRgdC+0LHRi9GC0LjQuVxuICAgKiDQvNGL0YjQuC/RgtGA0LXQutC/0LDQtNCwLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBpbnN0YW5jZXM6IHsgW2tleTogc3RyaW5nXTogU1Bsb3QgfSA9IHt9XG5cbiAgLy8g0KTRg9C90LrRhtC40Y8g0L/QviDRg9C80L7Qu9GH0LDQvdC40Y4g0LTQu9GPINC40YLQtdGA0LjRgNC+0LLQsNC90LjRjyDQvtCx0YrQtdC60YLQvtCyINC90LUg0LfQsNC00LDQtdGC0YHRjy5cbiAgcHVibGljIGl0ZXJhdGlvbkNhbGxiYWNrOiBTUGxvdEl0ZXJhdGlvbkZ1bmN0aW9uIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkXG5cbiAgLy8g0KbQstC10YLQvtCy0LDRjyDQv9Cw0LvQuNGC0YDQsCDQv9C+0LvQuNCz0L7QvdC+0LIg0L/QviDRg9C80L7Qu9GH0LDQvdC40Y4uXG4gIHB1YmxpYyBwb2x5Z29uUGFsZXR0ZTogSEVYQ29sb3JbXSA9IFtcbiAgICAnI0ZGMDBGRicsICcjODAwMDgwJywgJyNGRjAwMDAnLCAnIzgwMDAwMCcsICcjRkZGRjAwJyxcbiAgICAnIzAwRkYwMCcsICcjMDA4MDAwJywgJyMwMEZGRkYnLCAnIzAwMDBGRicsICcjMDAwMDgwJ1xuICBdXG5cbiAgLy8g0KDQsNC30LzQtdGAINC60L7QvtGA0LTQuNC90LDRgtC90L7QuSDQv9C70L7RgdC60L7RgdGC0Lgg0L/QviDRg9C80L7Qu9GH0LDQvdC40Y4uXG4gIHB1YmxpYyBncmlkU2l6ZTogU1Bsb3RHcmlkU2l6ZSA9IHtcbiAgICB3aWR0aDogMzJfMDAwLFxuICAgIGhlaWdodDogMTZfMDAwXG4gIH1cblxuICAvLyDQoNCw0LfQvNC10YAg0L/QvtC70LjQs9C+0L3QsCDQv9C+INGD0LzQvtC70YfQsNC90LjRji5cbiAgcHVibGljIHBvbHlnb25TaXplOiBudW1iZXIgPSAyMFxuXG4gIC8vINCh0YLQtdC/0LXQvdGMINC00LXRgtCw0LvQuNC30LDRhtC40Lgg0LrRgNGD0LPQsCDQv9C+INGD0LzQvtC70YfQsNC90LjRji5cbiAgcHVibGljIGNpcmNsZUFwcHJveExldmVsOiBudW1iZXIgPSAxMlxuXG4gIC8vINCf0LDRgNCw0LzQtdGC0YDRiyDRgNC10LbQuNC80LAg0L7RgtC70LDQtNC60Lgg0L/QviDRg9C80L7Qu9GH0LDQvdC40Y4uXG4gIHB1YmxpYyBkZWJ1Z01vZGU6IFNQbG90RGVidWdNb2RlID0ge1xuICAgIGlzRW5hYmxlOiBmYWxzZSxcbiAgICBvdXRwdXQ6ICdjb25zb2xlJyxcbiAgICBoZWFkZXJTdHlsZTogJ2ZvbnQtd2VpZ2h0OiBib2xkOyBjb2xvcjogI2ZmZmZmZjsgYmFja2dyb3VuZC1jb2xvcjogI2NjMDAwMDsnLFxuICAgIGdyb3VwU3R5bGU6ICdmb250LXdlaWdodDogYm9sZDsgY29sb3I6ICNmZmZmZmY7J1xuICB9XG5cbiAgLy8g0J/QsNGA0LDQvNC10YLRgNGLINGA0LXQttC40LzQsCDQtNC10LzQvtGB0YLRgNCw0YbQuNC+0L3QvdGL0YUg0LTQsNC90L3Ri9GFINC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOLlxuICBwdWJsaWMgZGVtb01vZGU6IFNQbG90RGVtb01vZGUgPSB7XG4gICAgaXNFbmFibGU6IGZhbHNlLFxuICAgIGFtb3VudDogMV8wMDBfMDAwLFxuICAgIC8qKlxuICAgICAqINCf0L4g0YPQvNC+0LvRh9Cw0L3QuNGOINCyINGA0LXQttC40LzQtSDQtNC10LzQvi3QtNCw0L3QvdGL0YUg0LHRg9C00YPRgiDQv9C+0YDQvtCy0L3RgyDQvtGC0L7QsdGA0LDQttCw0YLRjNGB0Y8g0L/QvtC70LjQs9C+0L3RiyDQstGB0LXRhSDQstC+0LfQvNC+0LbQvdGL0YUg0YTQvtGA0LwuINCh0L7QvtGC0LLQtdGC0YHRgtCy0YPRjtGJ0LjQtVxuICAgICAqINC30L3QsNGH0LXQvdC40Y8g0LzQsNGB0YHQuNCy0LAg0LjQvdC40YbQuNCw0LvQuNC30LjRgNGD0Y7RgtGB0Y8g0L/RgNC4INGA0LXQs9C40YHRgtGA0LDRhtC40Lgg0YTRg9C90LrRhtC40Lkg0YHQvtC30LTQsNC90LjRjyDRhNC+0YDQvCDQvNC10YLQvtC00L7QvCB7QGxpbmsgcmVnaXN0ZXJTaGFwZX0uXG4gICAgICovXG4gICAgc2hhcGVRdW90YTogW10sXG4gICAgaW5kZXg6IDBcbiAgfVxuXG4gIC8vINCf0YDQuNC30L3QsNC6INC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOINGE0L7RgNGB0LjRgNC+0LLQsNC90L3QvtCz0L4g0LfQsNC/0YPRgdC60LAg0YDQtdC90LTQtdGA0LAuXG4gIHB1YmxpYyBmb3JjZVJ1bjogYm9vbGVhbiA9IGZhbHNlXG5cbiAgLyoqXG4gICAqINCf0L4g0YPQvNC+0LvRh9Cw0L3QuNGOINC40YHQutGD0YHRgdGC0LLQtdC90L3QvtCz0L4g0L7Qs9GA0LDQvdC40YfQtdC90LjRjyDQvdCwINC60L7Qu9C40YfQtdGB0YLQstC+INC+0YLQvtCx0YDQsNC20LDQtdC80YvRhSDQv9C+0LvQuNCz0L7QvdC+0LIg0L3QtdGCICjQt9CwINGB0YfQtdGCINC30LDQtNCw0L3QuNGPINCx0L7Qu9GM0YjQvtCz0L4g0LfQsNCy0LXQtNC+0LzQvlxuICAgKiDQvdC10LTQvtGB0YLQuNC20LjQvNC+0LPQviDQv9C+0YDQvtCz0L7QstC+0LPQviDRh9C40YHQu9CwKS5cbiAgICovXG4gIHB1YmxpYyBtYXhBbW91bnRPZlBvbHlnb25zOiBudW1iZXIgPSAxXzAwMF8wMDBfMDAwXG5cbiAgLy8g0KTQvtC90L7QstGL0Lkg0YbQstC10YIg0L/QviDRg9C80L7Qu9GH0LDQvdC40Y4g0LTQu9GPINC60LDQvdCy0LDRgdCwLlxuICBwdWJsaWMgYmdDb2xvcjogSEVYQ29sb3IgPSAnI2ZmZmZmZidcblxuICAvLyDQptCy0LXRgiDQv9C+INGD0LzQvtC70YfQsNC90LjRjiDQtNC70Y8g0L3QsNC/0YDQsNCy0LvRj9GO0YnQuNGFLlxuICBwdWJsaWMgcnVsZXNDb2xvcjogSEVYQ29sb3IgPSAnI2MwYzBjMCdcblxuICAvLyDQn9C+INGD0LzQvtC70YfQsNC90LjRjiDQvtCx0LvQsNGB0YLRjCDQv9GA0L7RgdC80L7RgtGA0LAg0YPRgdGC0LDQvdCw0LLQu9C40LLQsNC10YLRgdGPINCyINGG0LXQvdGC0YAg0LrQvtC+0YDQtNC40L3QsNGC0L3QvtC5INC/0LvQvtC+0YHQutC+0YHRgtC4LlxuICBwdWJsaWMgY2FtZXJhOiBTUGxvdENhbWVyYSA9IHtcbiAgICB4OiB0aGlzLmdyaWRTaXplLndpZHRoIC8gMixcbiAgICB5OiB0aGlzLmdyaWRTaXplLmhlaWdodCAvIDIsXG4gICAgem9vbTogMVxuICB9XG5cbiAgLyoqXG4gICAqINCf0L4g0YPQvNC+0LvRh9Cw0L3QuNGOINC90LDRgdGC0YDQvtC50LrQuCDQutC+0L3RgtC10LrRgdGC0LAg0YDQtdC90LTQtdGA0LjQvdCz0LAgV2ViR0wg0LzQsNC60YHQuNC80LjQt9C40YDRg9GO0YIg0L/RgNC+0LjQt9Cy0L7QtNC40YLQtdC70YzQvdC+0YHRgtGMINCz0YDQsNGE0LjRh9C10YHQutC+0Lkg0YHQuNGB0YLQtdC80YsuINCh0L/QtdGG0LjQsNC70YzQvdGL0YVcbiAgICog0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GM0YHQutC40YUg0L/RgNC10LTRg9GB0YLQsNC90L7QstC+0Log0L3QtSDRgtGA0LXQsdGD0LXRgtGB0Y8sINC+0LTQvdCw0LrQviDQv9GA0LjQu9C+0LbQtdC90LjQtSDQv9C+0LfQstC+0LvRj9C10YIg0Y3QutGB0L/QtdGA0LjQvNC10L3RgtC40YDQvtCy0LDRgtGMINGBINC90LDRgdGC0YDQvtC50LrQsNC80Lgg0LPRgNCw0YTQuNC60LguXG4gICAqL1xuICBwdWJsaWMgd2ViR2xTZXR0aW5nczogV2ViR0xDb250ZXh0QXR0cmlidXRlcyA9IHtcbiAgICBhbHBoYTogZmFsc2UsXG4gICAgZGVwdGg6IGZhbHNlLFxuICAgIHN0ZW5jaWw6IGZhbHNlLFxuICAgIGFudGlhbGlhczogZmFsc2UsXG4gICAgcHJlbXVsdGlwbGllZEFscGhhOiBmYWxzZSxcbiAgICBwcmVzZXJ2ZURyYXdpbmdCdWZmZXI6IGZhbHNlLFxuICAgIHBvd2VyUHJlZmVyZW5jZTogJ2hpZ2gtcGVyZm9ybWFuY2UnLFxuICAgIGZhaWxJZk1ham9yUGVyZm9ybWFuY2VDYXZlYXQ6IGZhbHNlLFxuICAgIGRlc3luY2hyb25pemVkOiBmYWxzZVxuICB9XG5cbiAgLy8g0J/RgNC40LfQvdCw0Log0LDQutGC0LjQstC90L7Qs9C+INC/0YDQvtGG0LXRgdGB0LAg0YDQtdC90LTQtdGA0LAuINCU0L7RgdGC0YPQv9C10L0g0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GOINC/0YDQuNC70L7QttC10L3QuNGPINGC0L7Qu9GM0LrQviDQtNC70Y8g0YfRgtC10L3QuNGPLlxuICBwdWJsaWMgaXNSdW5uaW5nOiBib29sZWFuID0gZmFsc2VcblxuICAvLyDQntCx0YrQtdC60YIg0LrQsNC90LLQsNGB0LAuXG4gIHByb3RlY3RlZCByZWFkb25seSBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50XG5cbiAgLy8g0J7QsdGK0LXQutGCINC60L7QvdGC0LXQutGB0YLQsCDRgNC10L3QtNC10YDQuNC90LPQsCBXZWJHTC5cbiAgcHJvdGVjdGVkIGdsITogV2ViR0xSZW5kZXJpbmdDb250ZXh0XG5cbiAgLy8g0J7QsdGK0LXQutGCINC/0YDQvtCz0YDQsNC80LzRiyBXZWJHTC5cbiAgcHJvdGVjdGVkIGdwdVByb2dyYW0hOiBXZWJHTFByb2dyYW1cblxuICAvLyDQn9C10YDQtdC80LXQvdC90YvQtSDQtNC70Y8g0YHQstGP0LfQuCDQv9GA0LjQu9C+0LbQtdC90LjRjyDRgSDQv9GA0L7Qs9GA0LDQvNC80L7QuSBXZWJHTC5cbiAgcHJvdGVjdGVkIHZhcmlhYmxlczogeyBba2V5OiBzdHJpbmddOiBhbnkgfSA9IHt9XG5cbiAgLyoqXG4gICAqINCo0LDQsdC70L7QvSBHTFNMLdC60L7QtNCwINC00LvRjyDQstC10YDRiNC40L3QvdC+0LPQviDRiNC10LnQtNC10YDQsC4g0KHQvtC00LXRgNC20LjRgiDRgdC/0LXRhtC40LDQu9GM0L3Rg9GOINCy0YHRgtCw0LLQutGDIFwiU0VULVZFUlRFWC1DT0xPUi1DT0RFXCIsINC60L7RgtC+0YDQsNGPINC/0LXRgNC10LRcbiAgICog0YHQvtC30LTQsNC90LjQtdC8INGI0LXQudC00LXRgNCwINC30LDQvNC10L3Rj9C10YLRgdGPINC90LAgR0xTTC3QutC+0LQg0LLRi9Cx0L7RgNCwINGG0LLQtdGC0LAg0LLQtdGA0YjQuNC9LlxuICAgKi9cbiAgcHJvdGVjdGVkIHJlYWRvbmx5IF92ZXJ0ZXhTaGFkZXJDb2RlVGVtcGxhdGU6IHN0cmluZyA9XG4gICAgJ2F0dHJpYnV0ZSB2ZWMyIGFfcG9zaXRpb247XFxuJyArXG4gICAgJ2F0dHJpYnV0ZSBmbG9hdCBhX2NvbG9yO1xcbicgK1xuICAgICd1bmlmb3JtIG1hdDMgdV9tYXRyaXg7XFxuJyArXG4gICAgJ3ZhcnlpbmcgdmVjMyB2X2NvbG9yO1xcbicgK1xuICAgICd2b2lkIG1haW4oKSB7XFxuJyArXG4gICAgJyAgZ2xfUG9zaXRpb24gPSB2ZWM0KCh1X21hdHJpeCAqIHZlYzMoYV9wb3NpdGlvbiwgMSkpLnh5LCAwLjAsIDEuMCk7XFxuJyArXG4gICAgJyAgU0VULVZFUlRFWC1DT0xPUi1DT0RFJyArXG4gICAgJ31cXG4nXG5cbiAgLy8g0KjQsNCx0LvQvtC9IEdMU0wt0LrQvtC00LAg0LTQu9GPINGE0YDQsNCz0LzQtdC90YLQvdC+0LPQviDRiNC10LnQtNC10YDQsC5cbiAgcHJvdGVjdGVkIHJlYWRvbmx5IGZyYWdtZW50U2hhZGVyQ29kZVRlbXBsYXRlOiBzdHJpbmcgPVxuICAgICdwcmVjaXNpb24gbG93cCBmbG9hdDtcXG4nICtcbiAgICAndmFyeWluZyB2ZWMzIHZfY29sb3I7XFxuJyArXG4gICAgJ3ZvaWQgbWFpbigpIHtcXG4nICtcbiAgICAnICBnbF9GcmFnQ29sb3IgPSB2ZWM0KHZfY29sb3IucmdiLCAxLjApO1xcbicgK1xuICAgICd9XFxuJ1xuXG4gIC8vINCh0YfQtdGC0YfQuNC6INGH0LjRgdC70LAg0L7QsdGA0LDQsdC+0YLQsNC90L3Ri9GFINC/0L7Qu9C40LPQvtC90L7Qsi5cbiAgcHJvdGVjdGVkIGFtb3VudE9mUG9seWdvbnM6IG51bWJlciA9IDBcblxuICAvKipcbiAgICogICDQndCw0LHQvtGAINCy0YHQv9C+0LzQvtCz0LDRgtC10LvRjNC90YvRhSDQutC+0L3RgdGC0LDQvdGCLCDQuNGB0L/QvtC70YzQt9GD0LXQvNGL0YUg0LIg0YfQsNGB0YLQviDQv9C+0LLRgtC+0YDRj9GO0YnQuNGF0YHRjyDQstGL0YfQuNGB0LvQtdC90LjRj9GFLiDQoNCw0YHRgdGH0LjRgtGL0LLQsNC10YLRgdGPINC4INC30LDQtNCw0LXRgtGB0Y8g0LJcbiAgICogICDQvNC10YLQvtC00LUge0BsaW5rIHNldFVzZWZ1bENvbnN0YW50c30uXG4gICAqL1xuICBwcm90ZWN0ZWQgVVNFRlVMX0NPTlNUUzogYW55W10gPSBbXVxuXG4gIC8vINCi0LXRhdC90LjRh9C10YHQutCw0Y8g0LjQvdGE0L7RgNC80LDRhtC40Y8sINC40YHQv9C+0LvRjNC30YPQtdC80LDRjyDQv9GA0LjQu9C+0LbQtdC90LjQtdC8INC00LvRjyDRgNCw0YHRh9C10YLQsCDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuS5cbiAgcHJvdGVjdGVkIHRyYW5zb3JtYXRpb246IFNQbG90VHJhbnNmb3JtYXRpb24gPSB7XG4gICAgbWF0cml4OiBbXSxcbiAgICBzdGFydEludk1hdHJpeDogW10sXG4gICAgc3RhcnRDYW1lcmFYOiAwLFxuICAgIHN0YXJ0Q2FtZXJhWTogMCxcbiAgICBzdGFydFBvc1g6IDAsXG4gICAgc3RhcnRQb3NZOiAwXG4gIH1cblxuICAvKipcbiAgICog0JzQsNC60YHQuNC80LDQu9GM0L3QvtC1INCy0L7Qt9C80L7QttC90L7QtSDQutC+0LvQuNGH0LXRgdGC0LLQviDQstC10YDRiNC40L0g0LIg0LPRgNGD0L/Qv9C1INC/0L7Qu9C40LPQvtC90L7Qsiwg0LrQvtGC0L7RgNC+0LUg0LXRidC1INC00L7Qv9GD0YHQutCw0LXRgiDQtNC+0LHQsNCy0LvQtdC90LjQtSDQvtC00L3QvtCz0L4g0YHQsNC80L7Qs9C+XG4gICAqINC80L3QvtCz0L7QstC10YDRiNC40L3QvdC+0LPQviDQv9C+0LvQuNCz0L7QvdCwLiDQrdGC0L4g0LrQvtC70LjRh9C10YHRgtCy0L4g0LjQvNC10LXRgiDQvtCx0YrQtdC60YLQuNCy0L3QvtC1INGC0LXRhdC90LjRh9C10YHQutC+0LUg0L7Qs9GA0LDQvdC40YfQtdC90LjQtSwg0YIu0LouINGE0YPQvdC60YbQuNGPXG4gICAqIHtAbGluayBkcmF3RWxlbWVudHN9INC90LUg0L/QvtC30LLQvtC70Y/QtdGCINC60L7RgNGA0LXQutGC0L3QviDQv9GA0LjQvdC40LzQsNGC0Ywg0LHQvtC70YzRiNC1IDY1NTM2INC40L3QtNC10LrRgdC+0LIgKDMyNzY4INCy0LXRgNGI0LjQvSkuXG4gICAqL1xuICBwcm90ZWN0ZWQgbWF4QW1vdW50T2ZWZXJ0ZXhQZXJQb2x5Z29uR3JvdXA6IG51bWJlciA9IDMyNzY4IC0gKHRoaXMuY2lyY2xlQXBwcm94TGV2ZWwgKyAxKTtcblxuICAvLyDQmNC90YTQvtGA0LzQsNGG0LjRjyDQviDQsdGD0YTQtdGA0LDRhSwg0YXRgNCw0L3Rj9GJ0LjRhSDQtNCw0L3QvdGL0LUg0LTQu9GPINCy0LjQtNC10L7Qv9Cw0LzRj9GC0LguXG4gIHByb3RlY3RlZCBidWZmZXJzOiBTUGxvdEJ1ZmZlcnMgPSB7XG4gICAgdmVydGV4QnVmZmVyczogW10sXG4gICAgY29sb3JCdWZmZXJzOiBbXSxcbiAgICBpbmRleEJ1ZmZlcnM6IFtdLFxuICAgIGFtb3VudE9mR0xWZXJ0aWNlczogW10sXG4gICAgYW1vdW50T2ZTaGFwZXM6IFtdLFxuICAgIGFtb3VudE9mQnVmZmVyR3JvdXBzOiAwLFxuICAgIGFtb3VudE9mVG90YWxWZXJ0aWNlczogMCxcbiAgICBhbW91bnRPZlRvdGFsR0xWZXJ0aWNlczogMCxcbiAgICBzaXplSW5CeXRlczogWzAsIDAsIDBdXG4gIH1cblxuICAvKipcbiAgICog0JjQvdGE0L7RgNC80LDRhtC40Y8g0L4g0LLQvtC30LzQvtC20L3Ri9GFINGE0L7RgNC80LDRhSDQv9C+0LvQuNCz0L7QvdC+0LIuXG4gICAqINCa0LDQttC00LDRjyDRhNC+0YDQvNCwINC/0YDQtdC00YHRgtCw0LLQu9GP0LXRgtGB0Y8g0YTRg9C90LrRhtC40LXQuSwg0LLRi9GH0LjRgdC70Y/RjtGJ0LXQuSDQtdC1INCy0LXRgNGI0LjQvdGLINC4INC90LDQt9Cy0LDQvdC40LXQvCDRhNC+0YDQvNGLLlxuICAgKiDQlNC70Y8g0YPQutCw0LfQsNC90LjRjyDRhNC+0YDQvNGLINC/0L7Qu9C40LPQvtC90L7QsiDQsiDQv9GA0LjQu9C+0LbQtdC90LjQuCDQuNGB0L/QvtC70YzQt9GD0Y7RgtGB0Y8g0YfQuNGB0LvQvtCy0YvQtSDQuNC90LTQtdC60YHRiyDQsiDQtNCw0L3QvdC+0Lwg0LzQsNGB0YHQuNCy0LUuXG4gICAqL1xuICBwcm90ZWN0ZWQgc2hhcGVzOiB7Y2FsYzogU1Bsb3RDYWxjU2hhcGVGdW5jLCBuYW1lOiBzdHJpbmd9W10gPSBbXVxuXG4gIC8qKlxuICAgKiDQodC+0LfQtNCw0LXRgiDRjdC60LfQtdC80L/Qu9GP0YAg0LrQu9Cw0YHRgdCwLCDQuNC90LjRhtC40LDQu9C40LfQuNGA0YPQtdGCINC90LDRgdGC0YDQvtC50LrQuC5cbiAgICpcbiAgICogQHJlbWFya3NcbiAgICog0JXRgdC70Lgg0LrQsNC90LLQsNGBINGBINC30LDQtNCw0L3QvdGL0Lwg0LjQtNC10L3RgtC40YTQuNC60LDRgtC+0YDQvtC8INC90LUg0L3QsNC50LTQtdC9IC0g0LPQtdC90LXRgNC40YDRg9C10YLRgdGPINC+0YjQuNCx0LrQsC4g0J3QsNGB0YLRgNC+0LnQutC4INC80L7Qs9GD0YIg0LHRi9GC0Ywg0LfQsNC00LDQvdGLINC60LDQuiDQslxuICAgKiDQutC+0L3RgdGC0YDRg9C60YLQvtGA0LUsINGC0LDQuiDQuCDQsiDQvNC10YLQvtC00LUge0BsaW5rIHNldHVwfS4g0J7QtNC90LDQutC+INCyINC70Y7QsdC+0Lwg0YHQu9GD0YfQsNC1INC90LDRgdGC0YDQvtC50LrQuCDQtNC+0LvQttC90Ysg0LHRi9GC0Ywg0LfQsNC00LDQvdGLINC00L4g0LfQsNC/0YPRgdC60LAg0YDQtdC90LTQtdGA0LAuXG4gICAqXG4gICAqIEBwYXJhbSBjYW52YXNJZCAtINCY0LTQtdC90YLQuNGE0LjQutCw0YLQvtGAINC60LDQvdCy0LDRgdCwLCDQvdCwINC60L7RgtC+0YDQvtC8INCx0YPQtNC10YIg0YDQuNGB0L7QstCw0YLRjNGB0Y8g0LPRgNCw0YTQuNC6LlxuICAgKiBAcGFyYW0gb3B0aW9ucyAtINCf0L7Qu9GM0LfQvtCy0LDRgtC10LvRjNGB0LrQuNC1INC90LDRgdGC0YDQvtC50LrQuCDRjdC60LfQtdC80L/Qu9GP0YDQsC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGNhbnZhc0lkOiBzdHJpbmcsIG9wdGlvbnM/OiBTUGxvdE9wdGlvbnMpIHtcblxuICAgIC8vINCh0L7RhdGA0LDQvdC10L3QuNC1INGB0YHRi9C70LrQuCDQvdCwINGN0LrQt9C10LzQv9C70Y/RgCDQutC70LDRgdGB0LAuINCf0L7Qt9Cy0L7Qu9GP0LXRgiDQstC90LXRiNC40Lwg0YHQvtCx0YvRgtC40Y/QvCDQv9C+0LvRg9GH0LDRgtGMINC00L7RgdGC0YPQvyDQuiDQv9C+0LvRj9C8INC4INC80LXRgtC+0LTQsNC8INGN0LrQt9C10LzQv9C70Y/RgNCwLlxuICAgIFNQbG90Lmluc3RhbmNlc1tjYW52YXNJZF0gPSB0aGlzXG5cbiAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY2FudmFzSWQpKSB7XG4gICAgICB0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNhbnZhc0lkKSBhcyBIVE1MQ2FudmFzRWxlbWVudFxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ9Ca0LDQvdCy0LDRgSDRgSDQuNC00LXQvdGC0LjRhNC40LrQsNGC0L7RgNC+0LwgXCIjJyArIGNhbnZhc0lkICsgwqAnXCIg0L3QtSDQvdCw0LnQtNC10L0hJylcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDQoNC10LPQuNGB0YLRgNCw0YbQuNGPINGC0YDQtdGFINCx0LDQt9C+0LLRi9GFINGE0L7RgNC8INC/0L7Qu9C40LPQvtC90L7QsiAo0YLRgNC10YPQs9C+0LvRjNC90LjQutC4LCDQutCy0LDQtNGA0LDRgtGLINC4INC60YDRg9Cz0LgpLiDQndCw0LvQuNGH0LjQtSDRjdGC0LjRhSDRhNC+0YDQvCDQsiDRg9C60LDQt9Cw0L3QvdC+0Lwg0L/QvtGA0Y/QtNC60LVcbiAgICAgKiDRj9Cy0LvRj9C10YLRgdGPINC+0LHRj9C30LDRgtC10LvRjNC90YvQvCDQtNC70Y8g0LrQvtGA0YDQtdC60YLQvdC+0Lkg0YDQsNCx0L7RgtGLINC/0YDQuNC70L7QttC10L3QuNGPLiDQlNGA0YPQs9C40LUg0YTQvtGA0LzRiyDQvNC+0LPRg9GCINGA0LXQs9C40YHRgtGA0LjRgNC+0LLQsNGC0YzRjyDQsiDQu9GO0LHQvtC8INC60L7Qu9C40YfQtdGB0YLQstC1LCDQslxuICAgICAqINC70Y7QsdC+0Lkg0L/QvtGB0LvQtdC00L7QstCw0YLQtdC70YzQvdC+0YHRgtC4LlxuICAgICAqL1xuICAgIHRoaXMucmVnaXN0ZXJTaGFwZSh0aGlzLmdldFZlcnRpY2VzT2ZUcmlhbmdsZSwgJ9Ci0YDQtdGD0LPQvtC70YzQvdC40LonKVxuICAgIHRoaXMucmVnaXN0ZXJTaGFwZSh0aGlzLmdldFZlcnRpY2VzT2ZTcXVhcmUsICfQmtCy0LDQtNGA0LDRgicpXG4gICAgdGhpcy5yZWdpc3RlclNoYXBlKHRoaXMuZ2V0VmVydGljZXNPZkNpcmNsZSwgJ9Ca0YDRg9CzJylcblxuICAgIC8vINCV0YHQu9C4INC/0LXRgNC10LTQsNC90Ysg0L3QsNGB0YLRgNC+0LnQutC4LCDRgtC+INC+0L3QuCDQv9GA0LjQvNC10L3Rj9GO0YLRgdGPLlxuICAgIGlmIChvcHRpb25zKSB7XG4gICAgICB0aGlzLnNldE9wdGlvbnMob3B0aW9ucylcblxuICAgICAgLy8gINCV0YHQu9C4INC30LDQv9GA0L7RiNC10L0g0YTQvtGA0YHQuNGA0L7QstCw0L3QvdGL0Lkg0LfQsNC/0YPRgdC6LCDRgtC+INC40L3QuNGG0LjQsNC70LjQt9C40YDRg9GO0YLRgdGPINCy0YHQtSDQvdC10L7QsdGF0L7QtNC40LzRi9C1INC00LvRjyDRgNC10L3QtNC10YDQsCDQv9Cw0YDQsNC80LXRgtGA0YsuXG4gICAgICBpZiAodGhpcy5mb3JjZVJ1bikge1xuICAgICAgICB0aGlzLnNldHVwKG9wdGlvbnMpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqINCh0L7Qt9C00LDQtdGCINC60L7QvdGC0LXQutGB0YIg0YDQtdC90LTQtdGA0LjQvdCz0LAgV2ViR0wg0Lgg0YPRgdGC0LDQvdCw0LLQu9C40LLQsNC10YIg0LrQvtGA0YDQtdC60YLQvdGL0Lkg0YDQsNC30LzQtdGAINC+0LHQu9Cw0YHRgtC4INC/0YDQvtGB0LzQvtGC0YDQsC5cbiAgICovXG4gIHByb3RlY3RlZCBjcmVhdGVHbCgpOiB2b2lkIHtcblxuICAgIHRoaXMuZ2wgPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCd3ZWJnbCcsIHRoaXMud2ViR2xTZXR0aW5ncykgYXMgV2ViR0xSZW5kZXJpbmdDb250ZXh0XG5cbiAgICB0aGlzLmNhbnZhcy53aWR0aCA9IHRoaXMuY2FudmFzLmNsaWVudFdpZHRoXG4gICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gdGhpcy5jYW52YXMuY2xpZW50SGVpZ2h0XG5cbiAgICB0aGlzLmdsLnZpZXdwb3J0KDAsIDAsIHRoaXMuY2FudmFzLndpZHRoLCB0aGlzLmNhbnZhcy5oZWlnaHQpXG4gIH1cblxuICAvKipcbiAgICog0KDQtdCz0LjRgdGC0YDQuNGA0YPQtdGCINC90L7QstGD0Y4g0YTQvtGA0LzRgyDQv9C+0LvQuNCz0L7QvdC+0LIuINCg0LXQs9C40YHRgtGA0LDRhtC40Y8g0L7Qt9C90LDRh9Cw0LXRgiDQstC+0LfQvNC+0LbQvdC+0YHRgtGMINCyINC00LDQu9GM0L3QtdC50YjQtdC8INC+0YLQvtCx0YDQsNC20LDRgtGMINC90LAg0LPRgNCw0YTQuNC60LUg0L/QvtC70LjQs9C+0L3RiyDQtNCw0L3QvdC+0Lkg0YTQvtGA0LzRiy5cbiAgICpcbiAgICogQHBhcmFtIHBvbHlnb25DYWxjIC0g0KTRg9C90LrRhtC40Y8g0LLRi9GH0LjRgdC70LXQvdC40Y8g0LrQvtC+0YDQtNC40L3QsNGCINCy0LXRgNGI0LjQvSDQv9C+0LvQuNCz0L7QvdCwINC00LDQvdC90L7QuSDRhNC+0YDQvNGLLlxuICAgKiBAcGFyYW0gcG9seWdvbk5hbWUgLSDQndCw0LfQstCw0L3QuNC1INGE0L7RgNC80Ysg0L/QvtC70LjQs9C+0L3QsC5cbiAgICogQHJldHVybnMg0JjQvdC00LXQutGBINC90L7QstC+0Lkg0YTQvtGA0LzRiywg0L/QviDQutC+0YLQvtGA0L7QvNGDINC30LDQtNCw0LXRgtGB0Y8g0LXQtSDQvtGC0L7QsdGA0LDQttC10L3QuNC1INC90LAg0LPRgNCw0YTQuNC60LUuXG4gICAqL1xuICBwdWJsaWMgcmVnaXN0ZXJTaGFwZShwb2x5Z29uQ2FsYzogU1Bsb3RDYWxjU2hhcGVGdW5jLCBwb2x5Z29uTmFtZTogc3RyaW5nKTogbnVtYmVyIHtcblxuICAgIC8vINCU0L7QsdCw0LLQu9C10L3QuNC1INGE0L7RgNC80Ysg0LIg0LzQsNGB0YHQuNCyINGE0L7RgNC8LlxuICAgIHRoaXMuc2hhcGVzLnB1c2goe1xuICAgICAgY2FsYzogcG9seWdvbkNhbGMsXG4gICAgICBuYW1lOiBwb2x5Z29uTmFtZVxuICAgIH0pXG5cbiAgICAvLyDQlNC+0LHQsNCy0LvQtdC90LjQtSDRhNC+0YDQvNGLINCyINC80LDRgdGB0LjQsiDRh9Cw0YHRgtC+0YIg0L/QvtGP0LLQu9C10L3QuNGPINCyINC00LXQvNC+LdGA0LXQttC40LzQtS5cbiAgICB0aGlzLmRlbW9Nb2RlLnNoYXBlUXVvdGEhLnB1c2goMSlcblxuICAgIC8vINCf0L7Qu9GD0YfQtdC90L3Ri9C5INC40L3QtNC10LrRgSDRhNC+0YDQvNGLINCyINC80LDRgdGB0LjQstC1INGE0L7RgNC8LlxuICAgIHJldHVybiB0aGlzLnNoYXBlcy5sZW5ndGggLSAxXG4gIH1cblxuICAvKipcbiAgICog0KPRgdGC0LDQvdCw0LLQu9C40LLQsNC10YIg0L3QtdC+0LHRhdC+0LTQuNC80YvQtSDQtNC70Y8g0YDQtdC90LTQtdGA0LAg0L/QsNGA0LDQvNC10YLRgNGLINGN0LrQt9C10LzQv9C70Y/RgNCwINC4IFdlYkdMLlxuICAgKlxuICAgKiBAcGFyYW0gb3B0aW9ucyAtINCf0L7Qu9GM0LfQvtCy0LDRgtC10LvRjNGB0LrQuNC1INC90LDRgdGC0YDQvtC50LrQuCDRjdC60LfQtdC80L/Qu9GP0YDQsC5cbiAgICovXG4gIHB1YmxpYyBzZXR1cChvcHRpb25zOiBTUGxvdE9wdGlvbnMpOiB2b2lkIHtcblxuICAgIC8vINCf0YDQuNC80LXQvdC10L3QuNC1INC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjNGB0LrQuNGFINC90LDRgdGC0YDQvtC10LouXG4gICAgdGhpcy5zZXRPcHRpb25zKG9wdGlvbnMpXG5cbiAgICAvLyDQodC+0LfQtNCw0L3QuNC1INC60L7QvdGC0LXQutGB0YLQsCDRgNC10L3QtNC10YDQuNC90LPQsC5cbiAgICB0aGlzLmNyZWF0ZUdsKClcblxuICAgIC8vINCS0YvQstC+0LQg0L7RgtC70LDQtNC+0YfQvdC+0Lkg0LjQvdGE0L7RgNC80LDRhtC40LguXG4gICAgaWYgKHRoaXMuZGVidWdNb2RlLmlzRW5hYmxlKSB7XG4gICAgICB0aGlzLnJlcG9ydE1haW5JbmZvKG9wdGlvbnMpXG4gICAgfVxuXG4gICAgLy8g0J7QsdC90YPQu9C10L3QuNC1INGB0YfQtdGC0YfQuNC60LAg0L/QvtC70LjQs9C+0L3QvtCyLlxuICAgIHRoaXMuYW1vdW50T2ZQb2x5Z29ucyA9IDBcblxuICAgIC8vINCe0LHQvdGD0LvQtdC90LjQtSDRgtC10YXQvdC40YfQtdGB0LrQvtCz0L4g0YHRh9C10YLRh9C40LrQsCDRgNC10LbQuNC80LAg0LTQtdC80L4t0LTQsNC90L3Ri9GFXG4gICAgdGhpcy5kZW1vTW9kZS5pbmRleCA9IDBcblxuICAgIC8vINCe0LHQvdGD0LvQtdC90LjQtSDRgdGH0LXRgtGH0LjQutC+0LIg0YfQuNGB0LvQsCDQuNGB0L/QvtC70YzQt9C+0LLQsNC90LjRjyDRgNCw0LfQu9C40YfQvdGL0YUg0YTQvtGA0Lwg0L/QvtC70LjQs9C+0L3QvtCyLlxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zaGFwZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRoaXMuYnVmZmVycy5hbW91bnRPZlNoYXBlc1tpXSA9IDBcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDQn9GA0LXQtNC10LvRjNC90L7QtSDQutC+0LvQuNGH0LXRgdGC0LLQviDQstC10YDRiNC40L0g0LIg0LPRgNGD0L/Qv9C1INC/0L7Qu9C40LPQvtC90L7QsiDQt9Cw0LLQuNGB0LjRgiDQvtGCINC/0LDRgNCw0LzQtdGC0YDQsFxuICAgICAqIGNpcmNsZUFwcHJveExldmVsLCDQutC+0YLQvtGA0YvQuSDQvNC+0LMg0LHRi9GC0Ywg0LjQt9C80LXQvdC10L0g0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GM0YHQutC40LzQuCDQvdCw0YHRgtGA0L7QudC60LDQvNC4LlxuICAgICAqL1xuICAgIHRoaXMubWF4QW1vdW50T2ZWZXJ0ZXhQZXJQb2x5Z29uR3JvdXAgPSAzMjc2OCAtICh0aGlzLmNpcmNsZUFwcHJveExldmVsICsgMSlcblxuICAgIC8vINCY0L3QuNGG0LjQsNC70LjQt9Cw0YbQuNGPINCy0YHQv9C+0LzQvtCz0LDRgtC10LvRjNC90YvRhSDQutC+0L3RgdGC0LDQvdGCLlxuICAgIHRoaXMuc2V0VXNlZnVsQ29uc3RhbnRzKClcblxuICAgIC8vINCj0YHRgtCw0L3QvtCy0LrQsCDRhtCy0LXRgtCwINC+0YfQuNGB0YLQutC4INGA0LXQvdC00LXRgNC40L3Qs9CwXG4gICAgbGV0IFtyLCBnLCBiXSA9IHRoaXMuY29udmVydENvbG9yKHRoaXMuYmdDb2xvcilcbiAgICB0aGlzLmdsLmNsZWFyQ29sb3IociwgZywgYiwgMC4wKVxuICAgIHRoaXMuZ2wuY2xlYXIodGhpcy5nbC5DT0xPUl9CVUZGRVJfQklUKVxuXG4gICAgLyoqXG4gICAgICog0J/QvtC00LPQvtGC0L7QstC60LAg0LrQvtC00L7QsiDRiNC10LnQtNC10YDQvtCyLiDQkiDQutC+0LQg0LLQtdGA0YjQuNC90L3QvtCz0L4g0YjQtdC50LTQtdGA0LAg0LLRgdGC0LDQstC70Y/QtdGC0YHRjyDQutC+0LQg0LLRi9Cx0L7RgNCwINGG0LLQtdGC0LAg0LLQtdGA0YjQuNC9LiDQmtC+0LQg0YTRgNCw0LPQvNC10L3RgtC90L7Qs9C+XG4gICAgICog0YjQtdC50LTQtdGA0LAg0LjRgdC/0L7Qu9GM0LfRg9C10YLRgdGPINCx0LXQtyDQuNC30LzQtdC90LXQvdC40LkuXG4gICAgICovXG4gICAgbGV0IHZlcnRleFNoYWRlckNvZGUgPSB0aGlzLl92ZXJ0ZXhTaGFkZXJDb2RlVGVtcGxhdGUucmVwbGFjZSgnU0VULVZFUlRFWC1DT0xPUi1DT0RFJywgdGhpcy5nZW5TaGFkZXJDb2xvckNvZGUoKSlcbiAgICBsZXQgZnJhZ21lbnRTaGFkZXJDb2RlID0gdGhpcy5mcmFnbWVudFNoYWRlckNvZGVUZW1wbGF0ZVxuXG4gICAgLy8g0KHQvtC30LTQsNC90LjQtSDRiNC10LnQtNC10YDQvtCyIFdlYkdMLlxuICAgIGxldCB2ZXJ0ZXhTaGFkZXIgPSB0aGlzLmNyZWF0ZVdlYkdsU2hhZGVyKCdWRVJURVhfU0hBREVSJywgdmVydGV4U2hhZGVyQ29kZSlcbiAgICBsZXQgZnJhZ21lbnRTaGFkZXIgPSB0aGlzLmNyZWF0ZVdlYkdsU2hhZGVyKCdGUkFHTUVOVF9TSEFERVInLCBmcmFnbWVudFNoYWRlckNvZGUpXG5cbiAgICAvLyDQodC+0LfQtNCw0L3QuNC1INC/0YDQvtCz0YDQsNC80LzRiyBXZWJHTC5cbiAgICB0aGlzLmNyZWF0ZVdlYkdsUHJvZ3JhbSh2ZXJ0ZXhTaGFkZXIsIGZyYWdtZW50U2hhZGVyKVxuXG4gICAgLy8g0KPRgdGC0LDQvdC+0LLQutCwINGB0LLRj9C30LXQuSDQv9C10YDQtdC80LXQvdC90YvRhSDQv9GA0LjQu9C+0LbQtdC90LjRjyDRgSDQv9GA0L7Qs9GA0LDQvNC80L7QuSBXZWJHbC5cbiAgICB0aGlzLnNldFdlYkdsVmFyaWFibGUoJ2F0dHJpYnV0ZScsICdhX3Bvc2l0aW9uJylcbiAgICB0aGlzLnNldFdlYkdsVmFyaWFibGUoJ2F0dHJpYnV0ZScsICdhX2NvbG9yJylcbiAgICB0aGlzLnNldFdlYkdsVmFyaWFibGUoJ3VuaWZvcm0nLCAndV9tYXRyaXgnKVxuXG4gICAgLy8g0JLRi9GH0LjRgdC70LXQvdC40LUg0LTQsNC90L3Ri9GFINC+0LHQviDQstGB0LXRhSDQv9C+0LvQuNCz0L7QvdCw0YUg0Lgg0LfQsNC/0L7Qu9C90LXQvdC40LUg0LjQvNC4INCx0YPRhNC10YDQvtCyIFdlYkdMLlxuICAgIHRoaXMuY3JlYXRlV2JHbEJ1ZmZlcnMoKVxuXG4gICAgLy8g0JXRgdC70Lgg0L3QtdC+0LHRhdC+0LTQuNC80L4sINGC0L4g0YDQtdC90LTQtdGA0LjQvdCzINC30LDQv9GD0YHQutCw0LXRgtGB0Y8g0YHRgNCw0LfRgyDQv9C+0YHQu9C1INGD0YHRgtCw0L3QvtCy0LrQuCDQv9Cw0YDQsNC80LXRgtGA0L7QsiDRjdC60LfQtdC80L/Qu9GP0YDQsC5cbiAgICBpZiAodGhpcy5mb3JjZVJ1bikge1xuICAgICAgdGhpcy5ydW4oKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDQn9GA0LjQvNC10L3Rj9C10YIg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GM0YHQutC40LUg0L3QsNGB0YLRgNC+0LnQutC4INGN0LrQt9C10LzQv9C70Y/RgNCwLlxuICAgKlxuICAgKiBAcGFyYW0gb3B0aW9ucyAtINCf0L7Qu9GM0LfQvtCy0LDRgtC10LvRjNGB0LrQuNC1INC90LDRgdGC0YDQvtC50LrQuCDRjdC60LfQtdC80L/Qu9GP0YDQsC5cbiAgICovXG4gIHByb3RlY3RlZCBzZXRPcHRpb25zKG9wdGlvbnM6IFNQbG90T3B0aW9ucyk6IHZvaWQge1xuXG4gICAgLyoqXG4gICAgICog0JrQvtC/0LjRgNC+0LLQsNC90LjQtSDQv9C+0LvRjNC30L7QstCw0YLQtdC70YzRgdC60LjRhSDQvdCw0YHRgtGA0L7QtdC6INCyINGB0L7QvtGC0LLQtdGC0YHQstGD0Y7RidC40LUg0L/QvtC70Y8g0Y3QutC30LXQvNC/0LvRj9GA0LAuINCa0L7Qv9C40YDRg9GO0YLRgdGPINGC0L7Qu9GM0LrQviDRgtC1INC40Lcg0L3QuNGFLCDQutC+0YLQvtGA0YvQvFxuICAgICAqINC40LzQtdGO0YLRgdGPINGB0L7QvtGC0LLQtdGC0YHRgtCy0YPRjtGJ0LjQtSDRjdC60LLQuNCy0LDQu9C10L3RgtGLINCyINC/0L7Qu9GP0YUg0Y3QutC30LXQvNC/0LvRj9GA0LAuINCa0L7Qv9C40YDRg9C10YLRgdGPINGC0LDQutC20LUg0L/QtdGA0LLRi9C5INGD0YDQvtCy0LXQvdGMINCy0LvQvtC20LXQvdC90YvRhSDQvdCw0YHRgtGA0L7QtdC6LlxuICAgICAqL1xuICAgIGZvciAobGV0IG9wdGlvbiBpbiBvcHRpb25zKSB7XG5cbiAgICAgIGlmICghdGhpcy5oYXNPd25Qcm9wZXJ0eShvcHRpb24pKSBjb250aW51ZVxuXG4gICAgICBpZiAoaXNPYmplY3QoKG9wdGlvbnMgYXMgYW55KVtvcHRpb25dKSAmJiBpc09iamVjdCgodGhpcyBhcyBhbnkpW29wdGlvbl0pICkge1xuICAgICAgICBmb3IgKGxldCBuZXN0ZWRPcHRpb24gaW4gKG9wdGlvbnMgYXMgYW55KVtvcHRpb25dKSB7XG4gICAgICAgICAgaWYgKCh0aGlzIGFzIGFueSlbb3B0aW9uXS5oYXNPd25Qcm9wZXJ0eShuZXN0ZWRPcHRpb24pKSB7XG4gICAgICAgICAgICAodGhpcyBhcyBhbnkpW29wdGlvbl1bbmVzdGVkT3B0aW9uXSA9IChvcHRpb25zIGFzIGFueSlbb3B0aW9uXVtuZXN0ZWRPcHRpb25dXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAodGhpcyBhcyBhbnkpW29wdGlvbl0gPSAob3B0aW9ucyBhcyBhbnkpW29wdGlvbl1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDQldGB0LvQuCDQv9C+0LvRjNC30L7QstCw0YLQtdC70Ywg0LfQsNC00LDQtdGCINGA0LDQt9C80LXRgCDQv9C70L7RgdC60L7RgdGC0LgsINC90L4g0L/RgNC4INGN0YLQvtC8INC90LAg0LfQsNC00LDQtdGCINC90LDRh9Cw0LvRjNC90L7QtSDQv9C+0LvQvtC20LXQvdC40LUg0L7QsdC70LDRgdGC0Lgg0L/RgNC+0YHQvNC+0YLRgNCwLCDRgtC+XG4gICAgICog0L7QsdC70LDRgdGC0Ywg0L/RgNC+0YHQvNC+0YLRgNCwINC/0L7QvNC10YnQsNC10YLRgdGPINCyINGG0LXQvdGC0YAg0LfQsNC00LDQvdC90L7QuSDQv9C70L7RgdC60L7RgdGC0LguXG4gICAgICovXG4gICAgaWYgKG9wdGlvbnMuaGFzT3duUHJvcGVydHkoJ2dyaWRTaXplJykgJiYgIW9wdGlvbnMuaGFzT3duUHJvcGVydHkoJ2NhbWVyYScpKSB7XG4gICAgICB0aGlzLmNhbWVyYSA9IHtcbiAgICAgICAgeDogdGhpcy5ncmlkU2l6ZS53aWR0aCAvIDIsXG4gICAgICAgIHk6IHRoaXMuZ3JpZFNpemUuaGVpZ2h0IC8gMixcbiAgICAgICAgem9vbTogMVxuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqINCV0YHQu9C4INC30LDQv9GA0L7RiNC10L0g0LTQtdC80L4t0YDQtdC20LjQvCwg0YLQviDQtNC70Y8g0LjRgtC10YDQuNGA0L7QstCw0L3QuNGPINC+0LHRitC10LrRgtC+0LIg0LHRg9C00LXRgiDQuNGB0L/QvtC70YzQt9C+0LLQsNGC0YzRgdGPINCy0L3Rg9GC0YDQtdC90L3QuNC5INC40LzQuNGC0LjRgNGD0Y7RidC40Lkg0LjRgtC10YDQuNGA0L7QstCw0L3QuNC1XG4gICAgICog0LzQtdGC0L7QtC4g0J/RgNC4INGN0YLQvtC8INCy0L3QtdGI0L3Rj9GPINGE0YPQvdC60YbQuNGPINC40YLQtdGA0LjRgNC+0LLQsNC90LjRjyDQuNGB0L/QvtC70YzQt9C+0LLQsNC90LAg0L3QtSDQsdGD0LTQtdGCLlxuICAgICAqL1xuICAgIGlmICh0aGlzLmRlbW9Nb2RlLmlzRW5hYmxlKSB7XG4gICAgICB0aGlzLml0ZXJhdGlvbkNhbGxiYWNrID0gdGhpcy5kZW1vSXRlcmF0aW9uQ2FsbGJhY2tcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICog0JLRi9GH0LjRgdC70Y/QtdGCINC90LDQsdC+0YAg0LLRgdC/0L7QvNC+0LPQsNGC0LXQu9GM0L3Ri9GFINC60L7QvdGB0YLQsNC90YIge0BsaW5rIFVTRUZVTF9DT05TVFN9LCDRhdGA0LDQvdGP0YnQuNGFINGA0LXQt9GD0LvRjNGC0LDRgtGLINCw0LvQs9C10LHRgNCw0LjRh9C10YHQutC40YUg0LhcbiAgICog0YLRgNC40LPQvtC90L7QvNC10YLRgNC40YfQtdGB0LrQuNGFINCy0YvRh9C40YHQu9C10L3QuNC5LCDQuNGB0L/QvtC70YzQt9GD0LXQvNGL0YUg0LIg0YDQsNGB0YfQtdGC0LDRhSDQstC10YDRiNC40L0g0L/QvtC70LjQs9C+0L3QvtCyINC4INC80LDRgtGA0LjRhiDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuC5cbiAgICpcbiAgICogQHJlbWFya3NcbiAgICog0KLQsNC60LjQtSDQutC+0L3RgdGC0LDQvdGC0Ysg0L/QvtC30LLQvtC70Y/RjtGCINCy0YvQvdC10YHRgtC4INC30LDRgtGA0LDRgtC90YvQtSDQtNC70Y8g0L/RgNC+0YbQtdGB0YHQvtGA0LAg0L7Qv9C10YDQsNGG0LjQuCDQt9CwINC/0YDQtdC00LXQu9GLINC80L3QvtCz0L7QutGA0LDRgtC90L4g0LjRgdC/0L7Qu9GM0LfRg9C10LzRi9GFINGE0YPQvdC60YbQuNC5XG4gICAqINGD0LLQtdC70LjRh9C40LLQsNGPINC/0YDQvtC40LfQstC+0LTQuNGC0LXQu9GM0L3QvtGB0YLRjCDQv9GA0LjQu9C+0LbQtdC90LjRjyDQvdCwINGN0YLQsNC/0LDRhSDQv9C+0LTQs9C+0YLQvtCy0LrQuCDQtNCw0L3QvdGL0YUg0Lgg0YDQtdC90LTQtdGA0LjQvdCz0LAuXG4gICAqL1xuICBwcm90ZWN0ZWQgc2V0VXNlZnVsQ29uc3RhbnRzKCk6IHZvaWQge1xuXG4gICAgLy8g0JrQvtC90YHRgtCw0L3RgtGLLCDQt9Cw0LLQuNGB0Y/RidC40LUg0L7RgiDRgNCw0LfQvNC10YDQsCDQv9C+0LvQuNCz0L7QvdCwLlxuICAgIHRoaXMuVVNFRlVMX0NPTlNUU1swXSA9IHRoaXMucG9seWdvblNpemUgLyAyXG4gICAgdGhpcy5VU0VGVUxfQ09OU1RTWzFdID0gdGhpcy5VU0VGVUxfQ09OU1RTWzBdIC8gTWF0aC5jb3MoTWF0aC5QSSAvIDYpXG4gICAgdGhpcy5VU0VGVUxfQ09OU1RTWzJdID0gdGhpcy5VU0VGVUxfQ09OU1RTWzBdICogTWF0aC50YW4oTWF0aC5QSSAvIDYpXG5cbiAgICAvLyDQmtC+0L3RgdGC0LDQvdGC0YssINC30LDQstC40YHRj9GJ0LjQtSDQvtGCINGB0YLQtdC/0LXQvdC4INC00LXRgtCw0LvQuNC30LDRhtC40Lgg0LrRgNGD0LPQsCDQuCDRgNCw0LfQvNC10YDQsCDQv9C+0LvQuNCz0L7QvdCwLlxuICAgIHRoaXMuVVNFRlVMX0NPTlNUU1szXSA9IG5ldyBGbG9hdDMyQXJyYXkodGhpcy5jaXJjbGVBcHByb3hMZXZlbClcbiAgICB0aGlzLlVTRUZVTF9DT05TVFNbNF0gPSBuZXcgRmxvYXQzMkFycmF5KHRoaXMuY2lyY2xlQXBwcm94TGV2ZWwpXG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2lyY2xlQXBwcm94TGV2ZWw7IGkrKykge1xuICAgICAgY29uc3QgYW5nbGUgPSAyICogTWF0aC5QSSAqIGkgLyB0aGlzLmNpcmNsZUFwcHJveExldmVsXG4gICAgICB0aGlzLlVTRUZVTF9DT05TVFNbM11baV0gPSB0aGlzLlVTRUZVTF9DT05TVFNbMF0gKiBNYXRoLmNvcyhhbmdsZSlcbiAgICAgIHRoaXMuVVNFRlVMX0NPTlNUU1s0XVtpXSA9IHRoaXMuVVNFRlVMX0NPTlNUU1swXSAqIE1hdGguc2luKGFuZ2xlKVxuICAgIH1cblxuICAgIC8vINCa0L7QvdGB0YLQsNC90YLRiywg0LfQsNCy0LjRgdGP0YnQuNC1INC+0YIg0YDQsNC30LzQtdGA0LAg0LrQsNC90LLQsNGB0LAuXG4gICAgdGhpcy5VU0VGVUxfQ09OU1RTWzVdID0gMiAvIHRoaXMuY2FudmFzLndpZHRoXG4gICAgdGhpcy5VU0VGVUxfQ09OU1RTWzZdID0gMiAvIHRoaXMuY2FudmFzLmhlaWdodFxuICAgIHRoaXMuVVNFRlVMX0NPTlNUU1s3XSA9IDIgLyB0aGlzLmNhbnZhcy5jbGllbnRXaWR0aFxuICAgIHRoaXMuVVNFRlVMX0NPTlNUU1s4XSA9IC0yIC8gdGhpcy5jYW52YXMuY2xpZW50SGVpZ2h0XG4gICAgdGhpcy5VU0VGVUxfQ09OU1RTWzldID0gdGhpcy5jYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdFxuICAgIHRoaXMuVVNFRlVMX0NPTlNUU1sxMF0gPSB0aGlzLmNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3BcbiAgfVxuXG4gIC8qKlxuICAgKiDQodC+0LfQtNCw0LXRgiDRiNC10LnQtNC10YAgV2ViR0wuXG4gICAqXG4gICAqIEBwYXJhbSBzaGFkZXJUeXBlINCi0LjQvyDRiNC10LnQtNC10YDQsC5cbiAgICogQHBhcmFtIHNoYWRlckNvZGUg0JrQvtC0INGI0LXQudC00LXRgNCwINC90LAg0Y/Qt9GL0LrQtSBHTFNMLlxuICAgKiBAcmV0dXJucyDQodC+0LfQtNCw0L3QvdGL0Lkg0L7QsdGK0LXQutGCINGI0LXQudC00LXRgNCwLlxuICAgKi9cbiAgcHJvdGVjdGVkIGNyZWF0ZVdlYkdsU2hhZGVyKHNoYWRlclR5cGU6IFdlYkdsU2hhZGVyVHlwZSwgc2hhZGVyQ29kZTogc3RyaW5nKTogV2ViR0xTaGFkZXIge1xuXG4gICAgLy8g0KHQvtC30LTQsNC90LjQtSwg0L/RgNC40LLRj9C30LrQsCDQutC+0LTQsCDQuCDQutC+0LzQv9C40LvRj9GG0LjRjyDRiNC10LnQtNC10YDQsC5cbiAgICBjb25zdCBzaGFkZXIgPSB0aGlzLmdsLmNyZWF0ZVNoYWRlcih0aGlzLmdsW3NoYWRlclR5cGVdKSBhcyBXZWJHTFNoYWRlclxuICAgIHRoaXMuZ2wuc2hhZGVyU291cmNlKHNoYWRlciwgc2hhZGVyQ29kZSlcbiAgICB0aGlzLmdsLmNvbXBpbGVTaGFkZXIoc2hhZGVyKVxuXG4gICAgaWYgKCF0aGlzLmdsLmdldFNoYWRlclBhcmFtZXRlcihzaGFkZXIsIHRoaXMuZ2wuQ09NUElMRV9TVEFUVVMpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ9Ce0YjQuNCx0LrQsCDQutC+0LzQv9C40LvRj9GG0LjQuCDRiNC10LnQtNC10YDQsCBbJyArIHNoYWRlclR5cGUgKyAnXS4gJyArIHRoaXMuZ2wuZ2V0U2hhZGVySW5mb0xvZyhzaGFkZXIpKVxuICAgIH1cblxuICAgIC8vINCS0YvQstC+0LQg0L7RgtC70LDQtNC+0YfQvdC+0Lkg0LjQvdGE0L7RgNC80LDRhtC40LguXG4gICAgaWYgKHRoaXMuZGVidWdNb2RlLmlzRW5hYmxlKSB7XG4gICAgICBjb25zb2xlLmdyb3VwKCclY9Ch0L7Qt9C00LDQvSDRiNC10LnQtNC10YAgWycgKyBzaGFkZXJUeXBlICsgJ10nLCB0aGlzLmRlYnVnTW9kZS5ncm91cFN0eWxlKVxuICAgICAge1xuICAgICAgICBjb25zb2xlLmxvZyhzaGFkZXJDb2RlKVxuICAgICAgfVxuICAgICAgY29uc29sZS5ncm91cEVuZCgpXG4gICAgfVxuXG4gICAgcmV0dXJuIHNoYWRlclxuICB9XG5cbiAgLyoqXG4gICAqINCh0L7Qt9C00LDQtdGCINC/0YDQvtCz0YDQsNC80LzRgyBXZWJHTC5cbiAgICpcbiAgICogQHBhcmFtIHtXZWJHTFNoYWRlcn0gdmVydGV4U2hhZGVyINCS0LXRgNGI0LjQvdC90YvQuSDRiNC10LnQtNC10YAuXG4gICAqIEBwYXJhbSB7V2ViR0xTaGFkZXJ9IGZyYWdtZW50U2hhZGVyINCk0YDQsNCz0LzQtdC90YLQvdGL0Lkg0YjQtdC50LTQtdGALlxuICAgKi9cbiAgcHJvdGVjdGVkIGNyZWF0ZVdlYkdsUHJvZ3JhbSh2ZXJ0ZXhTaGFkZXI6IFdlYkdMU2hhZGVyLCBmcmFnbWVudFNoYWRlcjogV2ViR0xTaGFkZXIpOiB2b2lkIHtcblxuICAgIHRoaXMuZ3B1UHJvZ3JhbSA9IHRoaXMuZ2wuY3JlYXRlUHJvZ3JhbSgpIGFzIFdlYkdMUHJvZ3JhbVxuXG4gICAgdGhpcy5nbC5hdHRhY2hTaGFkZXIodGhpcy5ncHVQcm9ncmFtLCB2ZXJ0ZXhTaGFkZXIpXG4gICAgdGhpcy5nbC5hdHRhY2hTaGFkZXIodGhpcy5ncHVQcm9ncmFtLCBmcmFnbWVudFNoYWRlcilcbiAgICB0aGlzLmdsLmxpbmtQcm9ncmFtKHRoaXMuZ3B1UHJvZ3JhbSlcblxuICAgIGlmICghdGhpcy5nbC5nZXRQcm9ncmFtUGFyYW1ldGVyKHRoaXMuZ3B1UHJvZ3JhbSwgdGhpcy5nbC5MSU5LX1NUQVRVUykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcign0J7RiNC40LHQutCwINGB0L7Qt9C00LDQvdC40Y8g0L/RgNC+0LPRgNCw0LzQvNGLIFdlYkdMLiAnICsgdGhpcy5nbC5nZXRQcm9ncmFtSW5mb0xvZyh0aGlzLmdwdVByb2dyYW0pKVxuICAgIH1cblxuICAgIHRoaXMuZ2wudXNlUHJvZ3JhbSh0aGlzLmdwdVByb2dyYW0pXG4gIH1cblxuICAvKipcbiAgICog0KPRgdGC0LDQvdCw0LLQu9C40LLQsNC10YIg0YHQstGP0LfRjCDQv9C10YDQtdC80LXQvdC90L7QuSDQv9GA0LjQu9C+0LbQtdC90LjRjyDRgSDQv9GA0L7Qs9GA0LDQvNC80L7QuSBXZWJHbC5cbiAgICpcbiAgICogQHBhcmFtIHZhclR5cGUg0KLQuNC/INC/0LXRgNC10LzQtdC90L3QvtC5LlxuICAgKiBAcGFyYW0gdmFyTmFtZSDQmNC80Y8g0L/QtdGA0LXQvNC10L3QvdC+0LkuXG4gICAqL1xuICBwcm90ZWN0ZWQgc2V0V2ViR2xWYXJpYWJsZSh2YXJUeXBlOiBXZWJHbFZhcmlhYmxlVHlwZSwgdmFyTmFtZTogc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKHZhclR5cGUgPT09ICd1bmlmb3JtJykge1xuICAgICAgdGhpcy52YXJpYWJsZXNbdmFyTmFtZV0gPSB0aGlzLmdsLmdldFVuaWZvcm1Mb2NhdGlvbih0aGlzLmdwdVByb2dyYW0sIHZhck5hbWUpXG4gICAgfSBlbHNlIGlmICh2YXJUeXBlID09PSAnYXR0cmlidXRlJykge1xuICAgICAgdGhpcy52YXJpYWJsZXNbdmFyTmFtZV0gPSB0aGlzLmdsLmdldEF0dHJpYkxvY2F0aW9uKHRoaXMuZ3B1UHJvZ3JhbSwgdmFyTmFtZSlcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICog0KHQvtC30LTQsNC10YIg0Lgg0LfQsNC/0L7Qu9C90Y/QtdGCINC00LDQvdC90YvQvNC4INC+0LHQviDQstGB0LXRhSDQv9C+0LvQuNCz0L7QvdCw0YUg0LHRg9GE0LXRgNGLIFdlYkdMLlxuICAgKi9cbiAgcHJvdGVjdGVkIGNyZWF0ZVdiR2xCdWZmZXJzKCk6IHZvaWQge1xuXG4gICAgLy8g0JLRi9Cy0L7QtCDQvtGC0LvQsNC00L7Rh9C90L7QuSDQuNC90YTQvtGA0LzQsNGG0LjQuC5cbiAgICBpZiAodGhpcy5kZWJ1Z01vZGUuaXNFbmFibGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKCclY9CX0LDQv9GD0YnQtdC9INC/0YDQvtGG0LXRgdGBINC30LDQs9GA0YPQt9C60Lgg0LTQsNC90L3Ri9GFIFsnICsgdGhpcy5nZXRDdXJyZW50VGltZSgpICsgJ10uLi4nLCB0aGlzLmRlYnVnTW9kZS5ncm91cFN0eWxlKVxuXG4gICAgICAvLyDQl9Cw0L/Rg9GB0Log0LrQvtC90YHQvtC70YzQvdC+0LPQviDRgtCw0LnQvNC10YDQsCwg0LjQt9C80LXRgNGP0Y7RidC10LPQviDQtNC70LjRgtC10LvRjNC90L7RgdGC0Ywg0L/RgNC+0YbQtdGB0YHQsCDQt9Cw0LPRgNGD0LfQutC4INC00LDQvdC90YvRhSDQsiDQstC40LTQtdC+0L/QsNC80Y/RgtGMLlxuICAgICAgY29uc29sZS50aW1lKCfQlNC70LjRgtC10LvRjNC90L7RgdGC0YwnKVxuICAgIH1cblxuICAgIGxldCBwb2x5Z29uR3JvdXA6IFNQbG90UG9seWdvbkdyb3VwIHwgbnVsbFxuXG4gICAgLy8g0JjRgtC10YDQuNGA0L7QstCw0L3QuNC1INCz0YDRg9C/0L8g0L/QvtC70LjQs9C+0L3QvtCyLlxuICAgIHdoaWxlIChwb2x5Z29uR3JvdXAgPSB0aGlzLmNyZWF0ZVBvbHlnb25Hcm91cCgpKSB7XG5cbiAgICAgIC8vINCh0L7Qt9C00LDQvdC40LUg0Lgg0LfQsNC/0L7Qu9C90LXQvdC40LUg0LHRg9GE0LXRgNC+0LIg0LTQsNC90L3Ri9C80Lgg0L4g0YLQtdC60YPRidC10Lkg0LPRgNGD0L/Qv9C1INC/0L7Qu9C40LPQvtC90L7Qsi5cbiAgICAgIHRoaXMuYWRkV2JHbEJ1ZmZlcih0aGlzLmJ1ZmZlcnMudmVydGV4QnVmZmVycywgJ0FSUkFZX0JVRkZFUicsIG5ldyBGbG9hdDMyQXJyYXkocG9seWdvbkdyb3VwLnZlcnRpY2VzKSwgMClcbiAgICAgIHRoaXMuYWRkV2JHbEJ1ZmZlcih0aGlzLmJ1ZmZlcnMuY29sb3JCdWZmZXJzLCAnQVJSQVlfQlVGRkVSJywgbmV3IFVpbnQ4QXJyYXkocG9seWdvbkdyb3VwLmNvbG9ycyksIDEpXG4gICAgICB0aGlzLmFkZFdiR2xCdWZmZXIodGhpcy5idWZmZXJzLmluZGV4QnVmZmVycywgJ0VMRU1FTlRfQVJSQVlfQlVGRkVSJywgbmV3IFVpbnQxNkFycmF5KHBvbHlnb25Hcm91cC5pbmRpY2VzKSwgMilcblxuICAgICAgLy8g0KHRh9C10YLRh9C40Log0LrQvtC70LjRh9C10YHRgtCy0LAg0LHRg9GE0LXRgNC+0LIuXG4gICAgICB0aGlzLmJ1ZmZlcnMuYW1vdW50T2ZCdWZmZXJHcm91cHMrK1xuXG4gICAgICAvLyDQodGH0LXRgtGH0LjQuiDQutC+0LvQuNGH0LXRgdGC0LLQsCDQstC10YDRiNC40L0gR0wt0YLRgNC10YPQs9C+0LvRjNC90LjQutC+0LIg0YLQtdC60YPRidC10Lkg0LPRgNGD0L/Qv9GLINCx0YPRhNC10YDQvtCyLlxuICAgICAgdGhpcy5idWZmZXJzLmFtb3VudE9mR0xWZXJ0aWNlcy5wdXNoKHBvbHlnb25Hcm91cC5hbW91bnRPZkdMVmVydGljZXMpXG5cbiAgICAgIC8vINCh0YfQtdGC0YfQuNC6INC+0LHRidC10LPQviDQutC+0LvQuNGH0LXRgdGC0LLQsCDQstC10YDRiNC40L0gR0wt0YLRgNC10YPQs9C+0LvRjNC90LjQutC+0LIuXG4gICAgICB0aGlzLmJ1ZmZlcnMuYW1vdW50T2ZUb3RhbEdMVmVydGljZXMgKz0gcG9seWdvbkdyb3VwLmFtb3VudE9mR0xWZXJ0aWNlc1xuICAgIH1cblxuICAgIC8vINCS0YvQstC+0LQg0L7RgtC70LDQtNC+0YfQvdC+0Lkg0LjQvdGE0L7RgNC80LDRhtC40LguXG4gICAgaWYgKHRoaXMuZGVidWdNb2RlLmlzRW5hYmxlKSB7XG4gICAgICB0aGlzLnJlcG9ydEFib3V0T2JqZWN0UmVhZGluZygpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqINCh0YfQuNGC0YvQstCw0LXRgiDQtNCw0L3QvdGL0LUg0L7QsSDQuNGB0YXQvtC00L3Ri9GFINC+0LHRitC10LrRgtCw0YUg0Lgg0YTQvtGA0LzQuNGA0YPQtdGCINGB0L7QvtGC0LLQtdGC0YHQstGD0Y7RidGD0Y4g0Y3RgtC40Lwg0L7QsdGK0LXQutGC0LDQvCDQs9GA0YPQv9C/0YMg0L/QvtC70LjQs9C+0L3QvtCyLlxuICAgKlxuICAgKiBAcmVtYXJrc1xuICAgKiDQk9GA0YPQv9C/0LAg0YTQvtGA0LzQuNGA0YPQtdGC0YHRjyDRgSDRg9GH0LXRgtC+0Lwg0YLQtdGF0L3QuNGH0LXRgdC60L7Qs9C+INC+0LPRgNCw0L3QuNGH0LXQvdC40Y8g0L3QsCDQutC+0LvQuNGH0LXRgdGC0LLQviDQstC10YDRiNC40L0g0LIg0LPRgNGD0L/Qv9C1INC4INC70LjQvNC40YLQsCDQvdCwINC+0LHRidC10LUg0LrQvtC70LjRh9C10YHRgtCy0L5cbiAgICog0L/QvtC70LjQs9C+0L3QvtCyINC90LAg0LrQsNC90LLQsNGB0LUuXG4gICAqXG4gICAqIEByZXR1cm5zINCh0L7Qt9C00LDQvdC90LDRjyDQs9GA0YPQv9C/0LAg0L/QvtC70LjQs9C+0L3QvtCyINC40LvQuCBudWxsLCDQtdGB0LvQuCDRhNC+0YDQvNC40YDQvtCy0LDQvdC40LUg0LLRgdC10YUg0LPRgNGD0L/QvyDQv9C+0LvQuNCz0L7QvdC+0LIg0LfQsNCy0LXRgNGI0LjQu9C+0YHRjC5cbiAgICovXG4gIHByb3RlY3RlZCBjcmVhdGVQb2x5Z29uR3JvdXAoKTogU1Bsb3RQb2x5Z29uR3JvdXAgfCBudWxsIHtcblxuICAgIGxldCBwb2x5Z29uR3JvdXA6IFNQbG90UG9seWdvbkdyb3VwID0ge1xuICAgICAgdmVydGljZXM6IFtdLFxuICAgICAgaW5kaWNlczogW10sXG4gICAgICBjb2xvcnM6IFtdLFxuICAgICAgYW1vdW50T2ZWZXJ0aWNlczogMCxcbiAgICAgIGFtb3VudE9mR0xWZXJ0aWNlczogMFxuICAgIH1cblxuICAgIGxldCBwb2x5Z29uOiBTUGxvdFBvbHlnb24gfCBudWxsXG5cbiAgICAvKipcbiAgICAgKiDQldGB0LvQuCDQutC+0LvQuNGH0LXRgdGC0LLQviDQv9C+0LvQuNCz0L7QvdC+0LIg0LrQsNC90LLQsNGB0LAg0LTQvtGB0YLQuNCz0LvQviDQtNC+0L/Rg9GB0YLQuNC80L7Qs9C+INC80LDQutGB0LjQvNGD0LzQsCwg0YLQviDQtNCw0LvRjNC90LXQudGI0LDRjyDQvtCx0YDQsNCx0L7RgtC60LAg0LjRgdGF0L7QtNC90YvRhSDQvtCx0YrQtdC60YLQvtCyXG4gICAgICog0L/RgNC40L7RgdGC0LDQvdCw0LLQu9C40LLQsNC10YLRgdGPIC0g0YTQvtGA0LzQuNGA0L7QstCw0L3QuNC1INCz0YDRg9C/0L8g0L/QvtC70LjQs9C+0L3QvtCyINC30LDQstC10YDRiNCw0LXRgtGB0Y8g0LLQvtC30LLRgNCw0YLQvtC8INC30L3QsNGH0LXQvdC40Y8gbnVsbCAo0YHQuNC80YPQu9GP0YbQuNGPINC00L7RgdGC0LjQttC10L3QuNGPXG4gICAgICog0L/QvtGB0LvQtdC00L3QtdCz0L4g0L7QsdGA0LDQsdCw0YLRi9Cy0LDQtdC80L7Qs9C+INC40YHRhdC+0LTQvdC+0LPQviDQvtCx0YrQtdC60YLQsCkuXG4gICAgICovXG4gICAgaWYgKHRoaXMuYW1vdW50T2ZQb2x5Z29ucyA+PSB0aGlzLm1heEFtb3VudE9mUG9seWdvbnMpIHJldHVybiBudWxsXG5cbiAgICAvLyDQmNGC0LXRgNC40YDQvtCy0LDQvdC40LUg0LjRgdGF0L7QtNC90YvRhSDQvtCx0YrQtdC60YLQvtCyLlxuICAgIHdoaWxlIChwb2x5Z29uID0gdGhpcy5pdGVyYXRpb25DYWxsYmFjayEoKSkge1xuXG4gICAgICAvLyDQlNC+0LHQsNCy0LvQtdC90LjQtSDQsiDQs9GA0YPQv9C/0YMg0L/QvtC70LjQs9C+0L3QvtCyINC90L7QstC+0LPQviDQv9C+0LvQuNCz0L7QvdCwLlxuICAgICAgdGhpcy5hZGRQb2x5Z29uKHBvbHlnb25Hcm91cCwgcG9seWdvbilcblxuICAgICAgLy8g0KHRh9C10YLRh9C40Log0YfQuNGB0LvQsCDQv9GA0LjQvNC10L3QtdC90LjQuSDQutCw0LbQtNC+0Lkg0LjQtyDRhNC+0YDQvCDQv9C+0LvQuNCz0L7QvdC+0LIuXG4gICAgICB0aGlzLmJ1ZmZlcnMuYW1vdW50T2ZTaGFwZXNbcG9seWdvbi5zaGFwZV0rK1xuXG4gICAgICAvLyDQodGH0LXRgtGH0LjQuiDQvtCx0YnQtdCz0L4g0LrQvtC70LjRh9C10YHRgtCy0L4g0L/QvtC70LjQs9C+0L3QvtCyLlxuICAgICAgdGhpcy5hbW91bnRPZlBvbHlnb25zKytcblxuICAgICAgLyoqXG4gICAgICAgKiDQldGB0LvQuCDQutC+0LvQuNGH0LXRgdGC0LLQviDQv9C+0LvQuNCz0L7QvdC+0LIg0LrQsNC90LLQsNGB0LAg0LTQvtGB0YLQuNCz0LvQviDQtNC+0L/Rg9GB0YLQuNC80L7Qs9C+INC80LDQutGB0LjQvNGD0LzQsCwg0YLQviDQtNCw0LvRjNC90LXQudGI0LDRjyDQvtCx0YDQsNCx0L7RgtC60LAg0LjRgdGF0L7QtNC90YvRhSDQvtCx0YrQtdC60YLQvtCyXG4gICAgICAgKiDQv9GA0LjQvtGB0YLQsNC90LDQstC70LjQstCw0LXRgtGB0Y8gLSDRhNC+0YDQvNC40YDQvtCy0LDQvdC40LUg0LPRgNGD0L/QvyDQv9C+0LvQuNCz0L7QvdC+0LIg0LfQsNCy0LXRgNGI0LDQtdGC0YHRjyDQstC+0LfQstGA0LDRgtC+0Lwg0LfQvdCw0YfQtdC90LjRjyBudWxsICjRgdC40LzRg9C70Y/RhtC40Y8g0LTQvtGB0YLQuNC20LXQvdC40Y9cbiAgICAgICAqINC/0L7RgdC70LXQtNC90LXQs9C+INC+0LHRgNCw0LHQsNGC0YvQstCw0LXQvNC+0LPQviDQuNGB0YXQvtC00L3QvtCz0L4g0L7QsdGK0LXQutGC0LApLlxuICAgICAgICovXG4gICAgICBpZiAodGhpcy5hbW91bnRPZlBvbHlnb25zID49IHRoaXMubWF4QW1vdW50T2ZQb2x5Z29ucykgYnJlYWtcblxuICAgICAgLyoqXG4gICAgICAgKiDQldGB0LvQuCDQvtCx0YnQtdC1INC60L7Qu9C40YfQtdGB0YLQstC+INCy0YHQtdGFINCy0LXRgNGI0LjQvSDQsiDQs9GA0YPQv9C/0LUg0L/QvtC70LjQs9C+0L3QvtCyINC/0YDQtdCy0YvRgdC40LvQviDRgtC10YXQvdC40YfQtdGB0LrQvtC1INC+0LPRgNCw0L3QuNGH0LXQvdC40LUsINGC0L4g0LPRgNGD0L/Qv9CwINC/0L7Qu9C40LPQvtC90L7QslxuICAgICAgICog0YHRh9C40YLQsNC10YLRgdGPINGB0YTQvtGA0LzQuNGA0L7QstCw0L3QvdC+0Lkg0Lgg0LjRgtC10YDQuNGA0L7QstCw0L3QuNC1INC40YHRhdC+0LTQvdGL0YUg0L7QsdGK0LXQutGC0L7QsiDQv9GA0LjQvtGB0YLQsNC90LDQstC70LjQstCw0LXRgtGB0Y8uXG4gICAgICAgKi9cbiAgICAgIGlmIChwb2x5Z29uR3JvdXAuYW1vdW50T2ZWZXJ0aWNlcyA+PSB0aGlzLm1heEFtb3VudE9mVmVydGV4UGVyUG9seWdvbkdyb3VwKSBicmVha1xuICAgIH1cblxuICAgIC8vINCh0YfQtdGC0YfQuNC6INC+0LHRidC10LPQviDQutC+0LvQuNGH0LXRgdGC0LLQsCDQstC10YDRiNC40L0g0LLRgdC10YUg0LLQtdGA0YjQuNC90L3Ri9GFINCx0YPRhNC10YDQvtCyLlxuICAgIHRoaXMuYnVmZmVycy5hbW91bnRPZlRvdGFsVmVydGljZXMgKz0gcG9seWdvbkdyb3VwLmFtb3VudE9mVmVydGljZXNcblxuICAgIC8vINCV0YHQu9C4INCz0YDRg9C/0L/QsCDQv9C+0LvQuNCz0L7QvdC+0LIg0L3QtdC/0YPRgdGC0LDRjywg0YLQviDQstC+0LfQstGA0LDRidCw0LXQvCDQtdC1LiDQldGB0LvQuCDQv9GD0YHRgtCw0Y8gLSDQstC+0LfQstGA0LDRidCw0LXQvCBudWxsLlxuICAgIHJldHVybiAocG9seWdvbkdyb3VwLmFtb3VudE9mVmVydGljZXMgPiAwKSA/IHBvbHlnb25Hcm91cCA6IG51bGxcbiAgfVxuXG4gIC8qKlxuICAgKiDQodC+0LfQtNCw0LXRgiDQsiDQvNCw0YHRgdC40LLQtSDQsdGD0YTQtdGA0L7QsiBXZWJHTCDQvdC+0LLRi9C5INCx0YPRhNC10YAg0Lgg0LfQsNC/0LjRgdGL0LLQsNC10YIg0LIg0L3QtdCz0L4g0L/QtdGA0LXQtNCw0L3QvdGL0LUg0LTQsNC90L3Ri9C1LlxuICAgKlxuICAgKiBAcGFyYW0gYnVmZmVycyAtINCc0LDRgdGB0LjQsiDQsdGD0YTQtdGA0L7QsiBXZWJHTCwg0LIg0LrQvtGC0L7RgNGL0Lkg0LHRg9C00LXRgiDQtNC+0LHQsNCy0LvQtdC9INGB0L7Qt9C00LDQstCw0LXQvNGL0Lkg0LHRg9GE0LXRgC5cbiAgICogQHBhcmFtIHR5cGUgLSDQotC40L8g0YHQvtC30LTQsNCy0LDQtdC80L7Qs9C+INCx0YPRhNC10YDQsC5cbiAgICogQHBhcmFtIGRhdGEgLSDQlNCw0L3QvdGL0LUg0LIg0LLQuNC00LUg0YLQuNC/0LjQt9C40YDQvtCy0LDQvdC90L7Qs9C+INC80LDRgdGB0LjQstCwINC00LvRjyDQt9Cw0L/QuNGB0Lgg0LIg0YHQvtC30LTQsNCy0LDQtdC80YvQuSDQsdGD0YTQtdGALlxuICAgKiBAcGFyYW0ga2V5IC0g0JrQu9GO0YcgKNC40L3QtNC10LrRgSksINC40LTQtdC90YLQuNGE0LjRhtC40YDRg9GO0YnQuNC5INGC0LjQvyDQsdGD0YTQtdGA0LAgKNC00LvRjyDQstC10YDRiNC40L0sINC00LvRjyDRhtCy0LXRgtC+0LIsINC00LvRjyDQuNC90LTQtdC60YHQvtCyKS4g0JjRgdC/0L7Qu9GM0LfRg9C10YLRgdGPINC00LvRj1xuICAgKiAgICAg0YDQsNC30LTQtdC70YzQvdC+0LPQviDQv9C+0LTRgdGH0LXRgtCwINC/0LDQvNGP0YLQuCwg0LfQsNC90LjQvNCw0LXQvNC+0Lkg0LrQsNC20LTRi9C8INGC0LjQv9C+0Lwg0LHRg9GE0LXRgNCwLlxuICAgKi9cbiAgcHJvdGVjdGVkIGFkZFdiR2xCdWZmZXIoYnVmZmVyczogV2ViR0xCdWZmZXJbXSwgdHlwZTogV2ViR2xCdWZmZXJUeXBlLCBkYXRhOiBUeXBlZEFycmF5LCBrZXk6IG51bWJlcik6IHZvaWQge1xuXG4gICAgLy8g0J7Qv9GA0LXQtNC10LvQtdC90LjQtSDQuNC90LTQtdC60YHQsCDQvdC+0LLQvtCz0L4g0Y3Qu9C10LzQtdC90YLQsCDQsiDQvNCw0YHRgdC40LLQtSDQsdGD0YTQtdGA0L7QsiBXZWJHTC5cbiAgICBjb25zdCBpbmRleCA9IHRoaXMuYnVmZmVycy5hbW91bnRPZkJ1ZmZlckdyb3Vwc1xuXG4gICAgLy8g0KHQvtC30LTQsNC90LjQtSDQuCDQt9Cw0L/QvtC70L3QtdC90LjQtSDQtNCw0L3QvdGL0LzQuCDQvdC+0LLQvtCz0L4g0LHRg9GE0LXRgNCwLlxuICAgIGJ1ZmZlcnNbaW5kZXhdID0gdGhpcy5nbC5jcmVhdGVCdWZmZXIoKSFcbiAgICB0aGlzLmdsLmJpbmRCdWZmZXIodGhpcy5nbFt0eXBlXSwgYnVmZmVyc1tpbmRleF0pXG4gICAgdGhpcy5nbC5idWZmZXJEYXRhKHRoaXMuZ2xbdHlwZV0sIGRhdGEsIHRoaXMuZ2wuU1RBVElDX0RSQVcpXG5cbiAgICAvLyDQodGH0LXRgtGH0LjQuiDQv9Cw0LzRj9GC0LgsINC30LDQvdC40LzQsNC10LzQvtC5INCx0YPRhNC10YDQsNC80Lgg0LTQsNC90L3Ri9GFICjRgNCw0LfQtNC10LvRjNC90L4g0L/QviDQutCw0LbQtNC+0LzRgyDRgtC40L/RgyDQsdGD0YTQtdGA0L7QsilcbiAgICB0aGlzLmJ1ZmZlcnMuc2l6ZUluQnl0ZXNba2V5XSArPSBkYXRhLmxlbmd0aCAqIGRhdGEuQllURVNfUEVSX0VMRU1FTlRcbiAgfVxuXG4gIC8qKlxuICAgKiDQktGL0YfQuNGB0LvRj9C10YIg0LrQvtC+0YDQtNC40L3QsNGC0Ysg0LLQtdGA0YjQuNC9INC/0L7Qu9C40LPQvtC90LAg0YLRgNC10YPQs9C+0LvRjNC90L7QuSDRhNC+0YDQvNGLLlxuICAgKiDQotC40L8g0YTRg9C90LrRhtC40Lg6IHtAbGluayBTUGxvdENhbGNTaGFwZUZ1bmN9XG4gICAqXG4gICAqIEBwYXJhbSB4IC0g0J/QvtC70L7QttC10L3QuNC1INGG0LXQvdGC0YDQsCDQv9C+0LvQuNCz0L7QvdCwINC90LAg0L7RgdC4INCw0LHRgdGG0LjRgdGBLlxuICAgKiBAcGFyYW0geSAtINCf0L7Qu9C+0LbQtdC90LjQtSDRhtC10L3RgtGA0LAg0L/QvtC70LjQs9C+0L3QsCDQvdCwINC+0YHQuCDQvtGA0LTQuNC90LDRgi5cbiAgICogQHBhcmFtIGNvbnN0cyAtINCd0LDQsdC+0YAg0LLRgdC/0L7QvNC+0LPQsNGC0LXQu9GM0L3Ri9GFINC60L7QvdGB0YLQsNC90YIsINC40YHQv9C+0LvRjNC30YPQtdC80YvRhSDQtNC70Y8g0LLRi9GH0LjRgdC70LXQvdC40Y8g0LLQtdGA0YjQuNC9LlxuICAgKiBAcmV0dXJucyDQlNCw0L3QvdGL0LUg0L4g0LLQtdGA0YjQuNC90LDRhSDQv9C+0LvQuNCz0L7QvdCwLlxuICAgKi9cbiAgcHJvdGVjdGVkIGdldFZlcnRpY2VzT2ZUcmlhbmdsZSh4OiBudW1iZXIsIHk6IG51bWJlciwgY29uc3RzOiBhbnlbXSk6IFNQbG90UG9seWdvblZlcnRpY2VzIHtcblxuICAgIGNvbnN0IFt4MSwgeTFdID0gW3ggLSBjb25zdHNbMF0sIHkgKyBjb25zdHNbMl1dXG4gICAgY29uc3QgW3gyLCB5Ml0gPSBbeCwgeSAtIGNvbnN0c1sxXV1cbiAgICBjb25zdCBbeDMsIHkzXSA9IFt4ICsgY29uc3RzWzBdLCB5ICsgY29uc3RzWzJdXVxuXG4gICAgY29uc3QgdmVydGljZXMgPSB7XG4gICAgICB2YWx1ZXM6IFt4MSwgeTEsIHgyLCB5MiwgeDMsIHkzXSxcbiAgICAgIGluZGljZXM6IFswLCAxLCAyXVxuICAgIH1cblxuICAgIHJldHVybiB2ZXJ0aWNlc1xuICB9XG5cbiAgLyoqXG4gICAqINCS0YvRh9C40YHQu9GP0LXRgiDQutC+0L7RgNC00LjQvdCw0YLRiyDQstC10YDRiNC40L0g0L/QvtC70LjQs9C+0L3QsCDQutCy0LDQtNGA0LDRgtC90L7QuSDRhNC+0YDQvNGLLlxuICAgKiDQotC40L8g0YTRg9C90LrRhtC40Lg6IHtAbGluayBTUGxvdENhbGNTaGFwZUZ1bmN9XG4gICAqXG4gICAqIEBwYXJhbSB4IC0g0J/QvtC70L7QttC10L3QuNC1INGG0LXQvdGC0YDQsCDQv9C+0LvQuNCz0L7QvdCwINC90LAg0L7RgdC4INCw0LHRgdGG0LjRgdGBLlxuICAgKiBAcGFyYW0geSAtINCf0L7Qu9C+0LbQtdC90LjQtSDRhtC10L3RgtGA0LAg0L/QvtC70LjQs9C+0L3QsCDQvdCwINC+0YHQuCDQvtGA0LTQuNC90LDRgi5cbiAgICogQHBhcmFtIGNvbnN0cyAtINCd0LDQsdC+0YAg0LLRgdC/0L7QvNC+0LPQsNGC0LXQu9GM0L3Ri9GFINC60L7QvdGB0YLQsNC90YIsINC40YHQv9C+0LvRjNC30YPQtdC80YvRhSDQtNC70Y8g0LLRi9GH0LjRgdC70LXQvdC40Y8g0LLQtdGA0YjQuNC9LlxuICAgKiBAcmV0dXJucyDQlNCw0L3QvdGL0LUg0L4g0LLQtdGA0YjQuNC90LDRhSDQv9C+0LvQuNCz0L7QvdCwLlxuICAgKi9cbiAgcHJvdGVjdGVkIGdldFZlcnRpY2VzT2ZTcXVhcmUoeDogbnVtYmVyLCB5OiBudW1iZXIsIGNvbnN0czogYW55W10pOiBTUGxvdFBvbHlnb25WZXJ0aWNlcyB7XG5cbiAgICBjb25zdCBbeDEsIHkxXSA9IFt4IC0gY29uc3RzWzBdLCB5IC0gY29uc3RzWzBdXVxuICAgIGNvbnN0IFt4MiwgeTJdID0gW3ggKyBjb25zdHNbMF0sIHkgKyBjb25zdHNbMF1dXG5cbiAgICBjb25zdCB2ZXJ0aWNlcyA9IHtcbiAgICAgIHZhbHVlczogW3gxLCB5MSwgeDIsIHkxLCB4MiwgeTIsIHgxLCB5Ml0sXG4gICAgICBpbmRpY2VzOiBbMCwgMSwgMiwgMCwgMiwgM11cbiAgICB9XG5cbiAgICByZXR1cm4gdmVydGljZXNcbiAgfVxuXG4gIC8qKlxuICAgKiDQktGL0YfQuNGB0LvRj9C10YIg0LrQvtC+0YDQtNC40L3QsNGC0Ysg0LLQtdGA0YjQuNC9INC/0L7Qu9C40LPQvtC90LAg0LrRgNGD0LPQu9C+0Lkg0YTQvtGA0LzRiy5cbiAgICog0KLQuNC/INGE0YPQvdC60YbQuNC4OiB7QGxpbmsgU1Bsb3RDYWxjU2hhcGVGdW5jfVxuICAgKlxuICAgKiBAcGFyYW0geCAtINCf0L7Qu9C+0LbQtdC90LjQtSDRhtC10L3RgtGA0LAg0L/QvtC70LjQs9C+0L3QsCDQvdCwINC+0YHQuCDQsNCx0YHRhtC40YHRgS5cbiAgICogQHBhcmFtIHkgLSDQn9C+0LvQvtC20LXQvdC40LUg0YbQtdC90YLRgNCwINC/0L7Qu9C40LPQvtC90LAg0L3QsCDQvtGB0Lgg0L7RgNC00LjQvdCw0YIuXG4gICAqIEBwYXJhbSBjb25zdHMgLSDQndCw0LHQvtGAINCy0YHQv9C+0LzQvtCz0LDRgtC10LvRjNC90YvRhSDQutC+0L3RgdGC0LDQvdGCLCDQuNGB0L/QvtC70YzQt9GD0LXQvNGL0YUg0LTQu9GPINCy0YvRh9C40YHQu9C10L3QuNGPINCy0LXRgNGI0LjQvS5cbiAgICogQHJldHVybnMg0JTQsNC90L3Ri9C1INC+INCy0LXRgNGI0LjQvdCw0YUg0L/QvtC70LjQs9C+0L3QsC5cbiAgICovXG4gIHByb3RlY3RlZCBnZXRWZXJ0aWNlc09mQ2lyY2xlKHg6IG51bWJlciwgeTogbnVtYmVyLCBjb25zdHM6IGFueVtdKTogU1Bsb3RQb2x5Z29uVmVydGljZXMge1xuXG4gICAgLy8g0JfQsNC90LXRgdC10L3QuNC1INCyINC90LDQsdC+0YAg0LLQtdGA0YjQuNC9INGG0LXQvdGC0YDQsCDQutGA0YPQs9CwLlxuICAgIGNvbnN0IHZlcnRpY2VzOiBTUGxvdFBvbHlnb25WZXJ0aWNlcyA9IHtcbiAgICAgIHZhbHVlczogW3gsIHldLFxuICAgICAgaW5kaWNlczogW11cbiAgICB9XG5cbiAgICAvLyDQlNC+0LHQsNCy0LvQtdC90LjQtSDQsNC/0YDQvtC60YHQuNC80LjRgNGD0Y7RidC40YUg0L7QutGA0YPQttC90L7RgdGC0Ywg0LrRgNGD0LPQsCDQstC10YDRiNC40L0uXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb25zdHNbM10ubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZlcnRpY2VzLnZhbHVlcy5wdXNoKHggKyBjb25zdHNbM11baV0sIHkgKyBjb25zdHNbNF1baV0pXG4gICAgICB2ZXJ0aWNlcy5pbmRpY2VzLnB1c2goMCwgaSArIDEsIGkgKyAyKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqINCf0L7RgdC70LXQtNC90Y/RjyDQstC10YDRiNC40L3QsCDQv9C+0YHQu9C10LTQvdC10LPQviBHTC3RgtGA0LXRg9Cz0L7Qu9GM0L3QuNC60LAg0LfQsNC80LXQvdGP0LXRgtGB0Y8g0L3QsCDQv9C10YDQstGD0Y4g0LDQv9GA0L7QutGB0LjQvNC40YDRg9GO0YnRg9GOXG4gICAgICog0L7QutGA0YPQttC90L7RgdGC0Ywg0LrRgNGD0LPQsCDQstC10YDRiNC40L3Rgywg0LfQsNC80YvQutCw0Y8g0LDQv9GA0L7QutGB0LjQvNC40YDRg9GJ0LjQuSDQutGA0YPQsyDQv9C+0LvQuNCz0L7QvS5cbiAgICAgKi9cbiAgICB2ZXJ0aWNlcy5pbmRpY2VzW3ZlcnRpY2VzLmluZGljZXMubGVuZ3RoIC0gMV0gPSAxXG5cbiAgICByZXR1cm4gdmVydGljZXNcbiAgfVxuXG4gIC8qKlxuICAgKiDQodC+0LfQtNCw0LXRgiDQuCDQtNC+0LHQsNCy0LvRj9C10YIg0LIg0LPRgNGD0L/Qv9GDINC/0L7Qu9C40LPQvtC90L7QsiDQvdC+0LLRi9C5INC/0L7Qu9C40LPQvtC9LlxuICAgKlxuICAgKiBAcGFyYW0gcG9seWdvbkdyb3VwIC0g0JPRgNGD0L/Qv9CwINC/0L7Qu9C40LPQvtC90L7Qsiwg0LIg0LrQvtGC0L7RgNGD0Y4g0L/RgNC+0LjRgdGF0L7QtNC40YIg0LTQvtCx0LDQstC70LXQvdC40LUuXG4gICAqIEBwYXJhbSBwb2x5Z29uIC0g0JjQvdGE0L7RgNC80LDRhtC40Y8g0L4g0LTQvtCx0LDQstC70Y/QtdC80L7QvCDQv9C+0LvQuNCz0L7QvdC1LlxuICAgKi9cbiAgcHJvdGVjdGVkIGFkZFBvbHlnb24ocG9seWdvbkdyb3VwOiBTUGxvdFBvbHlnb25Hcm91cCwgcG9seWdvbjogU1Bsb3RQb2x5Z29uKTogdm9pZCB7XG5cbiAgICAvKipcbiAgICAgKiDQkiDQt9Cw0LLQuNGB0LjQvNC+0YHRgtC4INC+0YIg0YTQvtGA0LzRiyDQv9C+0LvQuNCz0L7QvdCwINC4INC60L7QvtGA0LTQuNC90LDRgiDQtdCz0L4g0YbQtdC90YLRgNCwINCy0YvQt9GL0LLQsNC10YLRgdGPINGB0L7QvtGC0LLQtdGC0YHQstGD0Y7RidCw0Y8g0YTRg9C90LrRhtC40Y8g0L3QsNGF0L7QttC00LXQvdC40Y8g0LrQvtC+0YDQtNC40L3QsNGCINC10LPQvlxuICAgICAqINCy0LXRgNGI0LjQvS5cbiAgICAgKi9cbiAgICBjb25zdCB2ZXJ0aWNlcyA9IHRoaXMuc2hhcGVzW3BvbHlnb24uc2hhcGVdLmNhbGMoXG4gICAgICBwb2x5Z29uLngsIHBvbHlnb24ueSwgdGhpcy5VU0VGVUxfQ09OU1RTXG4gICAgKVxuXG4gICAgLy8g0JrQvtC70LjRh9C10YHRgtCy0L4g0LLQtdGA0YjQuNC9IC0g0Y3RgtC+INC60L7Qu9C40YfQtdGB0YLQstC+INC/0LDRgCDRh9C40YHQtdC7INCyINC80LDRgdGB0LjQstC1INCy0LXRgNGI0LjQvS5cbiAgICBjb25zdCBhbW91bnRPZlZlcnRpY2VzID0gTWF0aC50cnVuYyh2ZXJ0aWNlcy52YWx1ZXMubGVuZ3RoIC8gMilcblxuICAgIC8vINCd0LDRhdC+0LbQtNC10L3QuNC1INC40L3QtNC10LrRgdCwINC/0LXRgNCy0L7QuSDQtNC+0LHQsNCy0LvRj9C10LzQvtC5INCyINCz0YDRg9C/0L/RgyDQv9C+0LvQuNCz0L7QvdC+0LIg0LLQtdGA0YjQuNC90YsuXG4gICAgY29uc3QgaW5kZXhPZkxhc3RWZXJ0ZXggPSBwb2x5Z29uR3JvdXAuYW1vdW50T2ZWZXJ0aWNlc1xuXG4gICAgLyoqXG4gICAgICog0J3QvtC80LXRgNCwINC40L3QtNC10LrRgdC+0LIg0LLQtdGA0YjQuNC9IC0g0L7RgtC90L7RgdC40YLQtdC70YzQvdGL0LUuINCU0LvRjyDQstGL0YfQuNGB0LvQtdC90LjRjyDQsNCx0YHQvtC70Y7RgtC90YvRhSDQuNC90LTQtdC60YHQvtCyINC90LXQvtCx0YXQvtC00LjQvNC+INC/0YDQuNCx0LDQstC40YLRjCDQuiDQvtGC0L3QvtGB0LjRgtC10LvRjNC90YvQvFxuICAgICAqINC40L3QtNC10LrRgdCw0Lwg0LjQvdC00LXQutGBINC/0LXRgNCy0L7QuSDQtNC+0LHQsNCy0LvRj9C10LzQvtC5INCyINCz0YDRg9C/0L/RgyDQv9C+0LvQuNCz0L7QvdC+0LIg0LLQtdGA0YjQuNC90YsuXG4gICAgICovXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2ZXJ0aWNlcy5pbmRpY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2ZXJ0aWNlcy5pbmRpY2VzW2ldICs9IGluZGV4T2ZMYXN0VmVydGV4XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog0JTQvtCx0LDQstC70LXQvdC40LUg0LIg0LPRgNGD0L/Qv9GDINC/0L7Qu9C40LPQvtC90L7QsiDQuNC90LTQtdC60YHQvtCyINCy0LXRgNGI0LjQvSDQvdC+0LLQvtCz0L4g0L/QvtC70LjQs9C+0L3QsCDQuCDQv9C+0LTRgdGH0LXRgiDQvtCx0YnQtdCz0L4g0LrQvtC70LjRh9C10YHRgtCy0LAg0LLQtdGA0YjQuNC9IEdMLdGC0YDQtdGD0LPQvtC70YzQvdC40LrQvtCyXG4gICAgICog0LIg0LPRgNGD0L/Qv9C1LlxuICAgICAqL1xuICAgIHBvbHlnb25Hcm91cC5pbmRpY2VzLnB1c2goLi4udmVydGljZXMuaW5kaWNlcylcbiAgICBwb2x5Z29uR3JvdXAuYW1vdW50T2ZHTFZlcnRpY2VzICs9IHZlcnRpY2VzLmluZGljZXMubGVuZ3RoXG5cbiAgICAvLyDQlNC+0LHQsNCy0LvQtdC90LjQtSDQsiDQs9GA0YPQv9C/0YMg0L/QvtC70LjQs9C+0L3QvtCyINCy0LXRgNGI0LjQvSDQvdC+0LLQvtCz0L4g0L/QvtC70LjQs9C+0L3QsCDQuCDQv9C+0LTRgdGH0LXRgiDQvtCx0YnQtdCz0L4g0LrQvtC70LjRh9C10YHRgtCy0LAg0LLQtdGA0YjQuNC9INCyINCz0YDRg9C/0L/QtS5cbiAgICBwb2x5Z29uR3JvdXAudmVydGljZXMucHVzaCguLi52ZXJ0aWNlcy52YWx1ZXMpXG4gICAgcG9seWdvbkdyb3VwLmFtb3VudE9mVmVydGljZXMgKz0gYW1vdW50T2ZWZXJ0aWNlc1xuXG4gICAgLy8g0JTQvtCx0LDQstC70LXQvdC40LUg0YbQstC10YLQvtCyINCy0LXRgNGI0LjQvSAtINC/0L4g0L7QtNC90L7QvNGDINGG0LLQtdGC0YMg0L3QsCDQutCw0LbQtNGD0Y4g0LLQtdGA0YjQuNC90YMuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhbW91bnRPZlZlcnRpY2VzOyBpKyspIHtcbiAgICAgIHBvbHlnb25Hcm91cC5jb2xvcnMucHVzaChwb2x5Z29uLmNvbG9yKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDQktGL0LLQvtC00LjRgiDQsdCw0LfQvtCy0YPRjiDRh9Cw0YHRgtGMINC+0YLQu9Cw0LTQvtGH0L3QvtC5INC40L3RhNC+0YDQvNCw0YbQuNC4LlxuICAgKlxuICAgKiBAcGFyYW0gb3B0aW9ucyAtINCf0L7Qu9GM0LfQvtCy0LDRgtC10LvRjNGB0LrQuNC1INC90LDRgdGC0YDQvtC50LrQuCDRjdC60LfQtdC80L/Qu9GP0YDQsC5cbiAgICovXG4gIHByb3RlY3RlZCByZXBvcnRNYWluSW5mbyhvcHRpb25zOiBTUGxvdE9wdGlvbnMpOiB2b2lkIHtcblxuICAgIGNvbnNvbGUubG9nKCclY9CS0LrQu9GO0YfQtdC9INGA0LXQttC40Lwg0L7RgtC70LDQtNC60LggJyArIHRoaXMuY29uc3RydWN0b3IubmFtZSArICcg0L3QsCDQvtCx0YrQtdC60YLQtSBbIycgKyB0aGlzLmNhbnZhcy5pZCArICddJyxcbiAgICAgIHRoaXMuZGVidWdNb2RlLmhlYWRlclN0eWxlKVxuXG4gICAgaWYgKHRoaXMuZGVtb01vZGUuaXNFbmFibGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKCclY9CS0LrQu9GO0YfQtdC9INC00LXQvNC+0L3RgdGC0YDQsNGG0LjQvtC90L3Ri9C5INGA0LXQttC40Lwg0LTQsNC90L3Ri9GFJywgdGhpcy5kZWJ1Z01vZGUuZ3JvdXBTdHlsZSlcbiAgICB9XG5cbiAgICBjb25zb2xlLmdyb3VwKCclY9Cf0YDQtdC00YPQv9GA0LXQttC00LXQvdC40LUnLCB0aGlzLmRlYnVnTW9kZS5ncm91cFN0eWxlKVxuICAgIHtcbiAgICAgIGNvbnNvbGUuZGlyKCfQntGC0LrRgNGL0YLQsNGPINC60L7QvdGB0L7Qu9GMINCx0YDQsNGD0LfQtdGA0LAg0Lgg0LTRgNGD0LPQuNC1INCw0LrRgtC40LLQvdGL0LUg0YHRgNC10LTRgdGC0LLQsCDQutC+0L3RgtGA0L7Qu9GPINGA0LDQt9GA0LDQsdC+0YLQutC4INGB0YPRidC10YHRgtCy0LXQvdC90L4g0YHQvdC40LbQsNGO0YIg0L/RgNC+0LjQt9Cy0L7QtNC40YLQtdC70YzQvdC+0YHRgtGMINCy0YvRgdC+0LrQvtC90LDQs9GA0YPQttC10L3QvdGL0YUg0L/RgNC40LvQvtC20LXQvdC40LkuINCU0LvRjyDQvtCx0YrQtdC60YLQuNCy0L3QvtCz0L4g0LDQvdCw0LvQuNC30LAg0L/RgNC+0LjQt9Cy0L7QtNC40YLQtdC70YzQvdC+0YHRgtC4INCy0YHQtSDQv9C+0LTQvtCx0L3Ri9C1INGB0YDQtdC00YHRgtCy0LAg0LTQvtC70LbQvdGLINCx0YvRgtGMINC+0YLQutC70Y7Rh9C10L3Riywg0LAg0LrQvtC90YHQvtC70Ywg0LHRgNCw0YPQt9C10YDQsCDQt9Cw0LrRgNGL0YLQsC4g0J3QtdC60L7RgtC+0YDRi9C1INC00LDQvdC90YvQtSDQvtGC0LvQsNC00L7Rh9C90L7QuSDQuNC90YTQvtGA0LzQsNGG0LjQuCDQsiDQt9Cw0LLQuNGB0LjQvNC+0YHRgtC4INC+0YIg0LjRgdC/0L7Qu9GM0LfRg9C10LzQvtCz0L4g0LHRgNCw0YPQt9C10YDQsCDQvNC+0LPRg9GCINC90LUg0L7RgtC+0LHRgNCw0LbQsNGC0YzRgdGPINC40LvQuCDQvtGC0L7QsdGA0LDQttCw0YLRjNGB0Y8g0L3QtdC60L7RgNGA0LXQutGC0L3Qvi4g0KHRgNC10LTRgdGC0LLQviDQvtGC0LvQsNC00LrQuCDQv9GA0L7RgtC10YHRgtC40YDQvtCy0LDQvdC+INCyINCx0YDQsNGD0LfQtdGA0LUgR29vZ2xlIENocm9tZSB2LjkwJylcbiAgICB9XG4gICAgY29uc29sZS5ncm91cEVuZCgpXG5cbiAgICBjb25zb2xlLmdyb3VwKCclY9CS0LjQtNC10L7RgdC40YHRgtC10LzQsCcsIHRoaXMuZGVidWdNb2RlLmdyb3VwU3R5bGUpXG4gICAge1xuICAgICAgbGV0IGV4dCA9IHRoaXMuZ2wuZ2V0RXh0ZW5zaW9uKCdXRUJHTF9kZWJ1Z19yZW5kZXJlcl9pbmZvJylcbiAgICAgIGxldCBncmFwaGljc0NhcmROYW1lID0gKGV4dCkgPyB0aGlzLmdsLmdldFBhcmFtZXRlcihleHQuVU5NQVNLRURfUkVOREVSRVJfV0VCR0wpIDogJ1vQvdC10LjQt9Cy0LXRgdGC0L3Qvl0nXG4gICAgICBjb25zb2xlLmxvZygn0JPRgNCw0YTQuNGH0LXRgdC60LDRjyDQutCw0YDRgtCwOiAnICsgZ3JhcGhpY3NDYXJkTmFtZSlcbiAgICAgIGNvbnNvbGUubG9nKCfQktC10YDRgdC40Y8gR0w6ICcgKyB0aGlzLmdsLmdldFBhcmFtZXRlcih0aGlzLmdsLlZFUlNJT04pKVxuICAgIH1cbiAgICBjb25zb2xlLmdyb3VwRW5kKClcblxuICAgIGNvbnNvbGUuZ3JvdXAoJyVj0J3QsNGB0YLRgNC+0LnQutCwINC/0LDRgNCw0LzQtdGC0YDQvtCyINGN0LrQt9C10LzQv9C70Y/RgNCwJywgdGhpcy5kZWJ1Z01vZGUuZ3JvdXBTdHlsZSlcbiAgICB7XG4gICAgICBjb25zb2xlLmRpcih0aGlzKVxuICAgICAgY29uc29sZS5sb2coJ9Cf0L7Qu9GM0LfQvtCy0LDRgtC10LvRjNGB0LrQuNC1INC90LDRgdGC0YDQvtC50LrQuDpcXG4nLCBqc29uU3RyaW5naWZ5KG9wdGlvbnMpKVxuICAgICAgY29uc29sZS5sb2coJ9Ca0LDQvdCy0LDRgTogIycgKyB0aGlzLmNhbnZhcy5pZClcbiAgICAgIGNvbnNvbGUubG9nKCfQoNCw0LfQvNC10YAg0LrQsNC90LLQsNGB0LA6ICcgKyB0aGlzLmNhbnZhcy53aWR0aCArICcgeCAnICsgdGhpcy5jYW52YXMuaGVpZ2h0ICsgJyBweCcpXG4gICAgICBjb25zb2xlLmxvZygn0KDQsNC30LzQtdGAINC/0LvQvtGB0LrQvtGB0YLQuDogJyArIHRoaXMuZ3JpZFNpemUud2lkdGggKyAnIHggJyArIHRoaXMuZ3JpZFNpemUuaGVpZ2h0ICsgJyBweCcpXG4gICAgICBjb25zb2xlLmxvZygn0KDQsNC30LzQtdGAINC/0L7Qu9C40LPQvtC90LA6ICcgKyB0aGlzLnBvbHlnb25TaXplICsgJyBweCcpXG4gICAgICBjb25zb2xlLmxvZygn0JDQv9GA0L7QutGB0LjQvNCw0YbQuNGPINC+0LrRgNGD0LbQvdC+0YHRgtC4OiAnICsgdGhpcy5jaXJjbGVBcHByb3hMZXZlbCArICcg0YPQs9C70L7QsicpXG5cbiAgICAgIC8qKlxuICAgICAgICogQHRvZG8g0J7QsdGA0LDQsdC+0YLQsNGC0Ywg0Y3RgtC+0YIg0LLRi9Cy0L7QtCDQsiDQt9Cw0LLQuNGB0LjQvNC+0YHRgtC4INC+0YIg0YLQuNC/0LAg0L/QvtC70YPRh9C10L3QuNGPINC00LDQvdC90YvRhSDQviDQv9C+0LvQuNCz0L7QvdCw0YUuINCS0LLQtdGB0YLQuCDRgtC40L/RiyAtINC30LDQtNCw0L3QvdCw0Y8g0YTRg9C90LrRhtC40Y9cbiAgICAgICAqINC40YLQtdGA0LjRgNC+0LLQsNC90LjRjywg0LTQtdC80L4t0LjRgtC10YDQuNGA0L7QstCw0L3QuNC1LCDQv9C10YDQtdC00LDQvdC90YvQuSDQvNCw0YHRgdC40LIg0LTQsNC90L3Ri9GFLlxuICAgICAgICovXG4gICAgICBpZiAodGhpcy5kZW1vTW9kZS5pc0VuYWJsZSkge1xuICAgICAgICBjb25zb2xlLmxvZygn0KHQv9C+0YHQvtCxINC/0L7Qu9GD0YfQtdC90LjRjyDQtNCw0L3QvdGL0YU6ICcgKyAn0LTQtdC80L7QvdGB0YLRgNCw0YbQuNC+0L3QvdCw0Y8g0YTRg9C90LrRhtC40Y8g0LjRgtC10YDQuNGA0L7QstCw0L3QuNGPJylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCfQodC/0L7RgdC+0LEg0L/QvtC70YPRh9C10L3QuNGPINC00LDQvdC90YvRhTogJyArICfQv9C+0LvRjNC30L7QstCw0YLQtdC70YzRgdC60LDRjyDRhNGD0L3QutGG0LjRjyDQuNGC0LXRgNC40YDQvtCy0LDQvdC40Y8nKVxuICAgICAgfVxuICAgIH1cbiAgICBjb25zb2xlLmdyb3VwRW5kKClcbiAgfVxuXG4gIC8qKlxuICAgKiDQktGL0LLQvtC00LjRgiDQsiDQutC+0L3RgdC+0LvRjCDQvtGC0LvQsNC00L7Rh9C90YPRjiDQuNC90YTQvtGA0LzQsNGG0LjRjiDQviDQt9Cw0LPRgNGD0LfQutC1INC00LDQvdC90YvRhSDQsiDQstC40LTQtdC+0L/QsNC80Y/RgtGMLlxuICAgKi9cbiAgcHJvdGVjdGVkIHJlcG9ydEFib3V0T2JqZWN0UmVhZGluZygpOiB2b2lkIHtcblxuICAgIGNvbnNvbGUuZ3JvdXAoJyVj0JfQsNCz0YDRg9C30LrQsCDQtNCw0L3QvdGL0YUg0LfQsNCy0LXRgNGI0LXQvdCwIFsnICsgdGhpcy5nZXRDdXJyZW50VGltZSgpICsgJ10nLCB0aGlzLmRlYnVnTW9kZS5ncm91cFN0eWxlKVxuICAgIHtcbiAgICAgIGNvbnNvbGUudGltZUVuZCgn0JTQu9C40YLQtdC70YzQvdC+0YHRgtGMJylcblxuICAgICAgY29uc29sZS5sb2coJ9Cg0LXQt9GD0LvRjNGC0LDRgjogJyArXG4gICAgICAgICgodGhpcy5hbW91bnRPZlBvbHlnb25zID49IHRoaXMubWF4QW1vdW50T2ZQb2x5Z29ucykgPyAn0LTQvtGB0YLQuNCz0L3Rg9GCINC30LDQtNCw0L3QvdGL0Lkg0LvQuNC80LjRgiAoJyArXG4gICAgICAgICAgdGhpcy5tYXhBbW91bnRPZlBvbHlnb25zLnRvTG9jYWxlU3RyaW5nKCkgKyAnKScgOiAn0L7QsdGA0LDQsdC+0YLQsNC90Ysg0LLRgdC1INC+0LHRitC10LrRgtGLJykpXG5cbiAgICAgIGNvbnNvbGUuZ3JvdXAoJ9Ca0L7Quy3QstC+INC+0LHRitC10LrRgtC+0LI6ICcgKyB0aGlzLmFtb3VudE9mUG9seWdvbnMudG9Mb2NhbGVTdHJpbmcoKSlcbiAgICAgIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnNoYXBlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGNvbnN0IHNoYXBlQ2FwY3Rpb24gPSB0aGlzLnNoYXBlc1tpXS5uYW1lXG4gICAgICAgICAgY29uc3Qgc2hhcGVBbW91bnQgPSB0aGlzLmJ1ZmZlcnMuYW1vdW50T2ZTaGFwZXNbaV1cbiAgICAgICAgICBjb25zb2xlLmxvZyhzaGFwZUNhcGN0aW9uICsgJzogJyArIHNoYXBlQW1vdW50LnRvTG9jYWxlU3RyaW5nKCkgK1xuICAgICAgICAgICAgJyBbficgKyBNYXRoLnJvdW5kKDEwMCAqIHNoYXBlQW1vdW50IC8gdGhpcy5hbW91bnRPZlBvbHlnb25zKSArICclXScpXG4gICAgICAgIH1cblxuICAgICAgICBjb25zb2xlLmxvZygn0JrQvtC7LdCy0L4g0YbQstC10YLQvtCyINCyINC/0LDQu9C40YLRgNC1OiAnICsgdGhpcy5wb2x5Z29uUGFsZXR0ZS5sZW5ndGgpXG4gICAgICB9XG4gICAgICBjb25zb2xlLmdyb3VwRW5kKClcblxuICAgICAgbGV0IGJ5dGVzVXNlZEJ5QnVmZmVycyA9IHRoaXMuYnVmZmVycy5zaXplSW5CeXRlc1swXSArIHRoaXMuYnVmZmVycy5zaXplSW5CeXRlc1sxXSArIHRoaXMuYnVmZmVycy5zaXplSW5CeXRlc1syXVxuXG4gICAgICBjb25zb2xlLmdyb3VwKCfQl9Cw0L3Rj9GC0L4g0LLQuNC00LXQvtC/0LDQvNGP0YLQuDogJyArIChieXRlc1VzZWRCeUJ1ZmZlcnMgLyAxMDAwMDAwKS50b0ZpeGVkKDIpLnRvTG9jYWxlU3RyaW5nKCkgKyAnINCc0JEnKVxuICAgICAge1xuICAgICAgICBjb25zb2xlLmxvZygn0JHRg9GE0LXRgNGLINCy0LXRgNGI0LjQvTogJyArXG4gICAgICAgICAgKHRoaXMuYnVmZmVycy5zaXplSW5CeXRlc1swXSAvIDEwMDAwMDApLnRvRml4ZWQoMikudG9Mb2NhbGVTdHJpbmcoKSArICcg0JzQkScgK1xuICAgICAgICAgICcgW34nICsgTWF0aC5yb3VuZCgxMDAgKiB0aGlzLmJ1ZmZlcnMuc2l6ZUluQnl0ZXNbMF0gLyBieXRlc1VzZWRCeUJ1ZmZlcnMpICsgJyVdJylcblxuICAgICAgICBjb25zb2xlLmxvZygn0JHRg9GE0LXRgNGLINGG0LLQtdGC0L7QsjogJ1xuICAgICAgICAgICsgKHRoaXMuYnVmZmVycy5zaXplSW5CeXRlc1sxXSAvIDEwMDAwMDApLnRvRml4ZWQoMikudG9Mb2NhbGVTdHJpbmcoKSArICcg0JzQkScgK1xuICAgICAgICAgICcgW34nICsgTWF0aC5yb3VuZCgxMDAgKiB0aGlzLmJ1ZmZlcnMuc2l6ZUluQnl0ZXNbMV0gLyBieXRlc1VzZWRCeUJ1ZmZlcnMpICsgJyVdJylcblxuICAgICAgICBjb25zb2xlLmxvZygn0JHRg9GE0LXRgNGLINC40L3QtNC10LrRgdC+0LI6ICdcbiAgICAgICAgICArICh0aGlzLmJ1ZmZlcnMuc2l6ZUluQnl0ZXNbMl0gLyAxMDAwMDAwKS50b0ZpeGVkKDIpLnRvTG9jYWxlU3RyaW5nKCkgKyAnINCc0JEnICtcbiAgICAgICAgICAnIFt+JyArIE1hdGgucm91bmQoMTAwICogdGhpcy5idWZmZXJzLnNpemVJbkJ5dGVzWzJdIC8gYnl0ZXNVc2VkQnlCdWZmZXJzKSArICclXScpXG4gICAgICB9XG4gICAgICBjb25zb2xlLmdyb3VwRW5kKClcblxuICAgICAgY29uc29sZS5sb2coJ9Ca0L7Quy3QstC+INCz0YDRg9C/0L8g0LHRg9GE0LXRgNC+0LI6ICcgKyB0aGlzLmJ1ZmZlcnMuYW1vdW50T2ZCdWZmZXJHcm91cHMudG9Mb2NhbGVTdHJpbmcoKSlcbiAgICAgIGNvbnNvbGUubG9nKCfQmtC+0Lst0LLQviBHTC3RgtGA0LXRg9Cz0L7Qu9GM0L3QuNC60L7QsjogJyArICh0aGlzLmJ1ZmZlcnMuYW1vdW50T2ZUb3RhbEdMVmVydGljZXMgLyAzKS50b0xvY2FsZVN0cmluZygpKVxuICAgICAgY29uc29sZS5sb2coJ9Ca0L7Quy3QstC+INCy0LXRgNGI0LjQvTogJyArIHRoaXMuYnVmZmVycy5hbW91bnRPZlRvdGFsVmVydGljZXMudG9Mb2NhbGVTdHJpbmcoKSlcbiAgICB9XG4gICAgY29uc29sZS5ncm91cEVuZCgpXG4gIH1cblxuICAvKipcbiAgICog0KHQvtC30LTQsNC10YIg0LTQvtC/0L7Qu9C90LXQvdC40LUg0Log0LrQvtC00YMg0L3QsCDRj9C30YvQutC1IEdMU0wuXG4gICAqXG4gICAqIEByZW1hcmtzXG4gICAqINCSINC00LDQu9GM0L3QtdC50YjQtdC8INGB0L7Qt9C00LDQvdC90YvQuSDQutC+0LQg0LHRg9C00LXRgiDQstGB0YLRgNC+0LXQvSDQsiDQutC+0LQg0LLQtdGA0YjQuNC90L3QvtCz0L4g0YjQtdC50LTQtdGA0LAg0LTQu9GPINC30LDQtNCw0L3QuNGPINGG0LLQtdGC0LAg0LLQtdGA0YjQuNC90Ysg0LIg0LfQsNCy0LjRgdC40LzQvtGB0YLQuCDQvtGCXG4gICAqINC40L3QtNC10LrRgdCwINGG0LLQtdGC0LAsINC/0YDQuNGB0LLQvtC10L3QvdC+0LPQviDRjdGC0L7QuSDQstC10YDRiNC40L3QtS4g0KIu0LouINGI0LXQudC00LXRgCDQvdC1INC/0L7Qt9Cy0L7Qu9GP0LXRgiDQuNGB0L/QvtC70YzQt9C+0LLQsNGC0Ywg0LIg0LrQsNGH0LXRgdGC0LLQtSDQuNC90LTQtdC60YHQvtCyINC/0LXRgNC10LzQtdC90L3Ri9C1IC1cbiAgICog0LTQu9GPINC30LDQtNCw0L3QuNGPINGG0LLQtdGC0LAg0LjRgdC/0L7Qu9GM0LfRg9C10YLRgdGPINC/0LXRgNC10LHQvtGAINGG0LLQtdGC0L7QstGL0YUg0LjQvdC00LXQutGB0L7Qsi5cbiAgICpcbiAgICogQHJldHVybnMg0JrQvtC0INC90LAg0Y/Qt9GL0LrQtSBHTFNMLlxuICAgKi9cbiAgcHJvdGVjdGVkIGdlblNoYWRlckNvbG9yQ29kZSgpOiBzdHJpbmcge1xuXG4gICAgLy8g0JLRgNC10LzQtdC90L3QvtC1INC00L7QsdCw0LLQu9C10L3QuNC1INCyINC/0LDQu9C40YLRgNGDINGG0LLQtdGC0L7QsiDQstC10YDRiNC40L0g0YbQstC10YLQsCDQvdCw0L/RgNCw0LLQu9GP0Y7RidC40YUuXG4gICAgdGhpcy5wb2x5Z29uUGFsZXR0ZS5wdXNoKHRoaXMucnVsZXNDb2xvcilcblxuICAgIGxldCBjb2RlOiBzdHJpbmcgPSAnJ1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBvbHlnb25QYWxldHRlLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgIC8vINCf0L7Qu9GD0YfQtdC90LjQtSDRhtCy0LXRgtCwINCyINC90YPQttC90L7QvCDRhNC+0YDQvNCw0YLQtS5cbiAgICAgIGxldCBbciwgZywgYl0gPSB0aGlzLmNvbnZlcnRDb2xvcih0aGlzLnBvbHlnb25QYWxldHRlW2ldKVxuXG4gICAgICAvLyDQpNC+0YDQvNC40YDQvtCy0L3QuNC1INGB0YLRgNC+0LogR0xTTC3QutC+0LTQsCDQv9GA0L7QstC10YDQutC4INC40L3QtNC10LrRgdCwINGG0LLQtdGC0LAuXG4gICAgICBjb2RlICs9ICgoaSA9PT0gMCkgPyAnJyA6ICcgIGVsc2UgJykgKyAnaWYgKGFfY29sb3IgPT0gJyArIGkgKyAnLjApIHZfY29sb3IgPSB2ZWMzKCcgK1xuICAgICAgICByLnRvU3RyaW5nKCkuc2xpY2UoMCwgOSkgKyAnLCcgK1xuICAgICAgICBnLnRvU3RyaW5nKCkuc2xpY2UoMCwgOSkgKyAnLCcgK1xuICAgICAgICBiLnRvU3RyaW5nKCkuc2xpY2UoMCwgOSkgKyAnKTtcXG4nXG4gICAgfVxuXG4gICAgLy8g0KPQtNCw0LvQtdC90LjQtSDQuNC3INC/0LDQu9C40YLRgNGLINCy0LXRgNGI0LjQvSDQstGA0LXQvNC10L3QvdC+INC00L7QsdCw0LLQu9C10L3QvdC+0LPQviDRhtCy0LXRgtCwINC90LDQv9GA0LDQstC70Y/RjtGJ0LjRhS5cbiAgICB0aGlzLnBvbHlnb25QYWxldHRlLnBvcCgpXG5cbiAgICByZXR1cm4gY29kZVxuICB9XG5cbiAgLyoqXG4gICAqINCa0L7QvdCy0LXRgNGC0LjRgNGD0LXRgiDRhtCy0LXRgiDQuNC3IEhFWC3Qv9GA0LXQtNGB0YLQsNCy0LvQtdC90LjRjyDQsiDQv9GA0LXQtNGB0YLQsNCy0LvQtdC90LjQtSDRhtCy0LXRgtCwINC00LvRjyBHTFNMLdC60L7QtNCwIChSR0Ig0YEg0LTQuNCw0L/QsNC30L7QvdCw0LzQuCDQt9C90LDRh9C10L3QuNC5INC+0YIgMCDQtNC+IDEpLlxuICAgKlxuICAgKiBAcGFyYW0gaGV4Q29sb3IgLSDQptCy0LXRgiDQsiBIRVgt0YTQvtGA0LzQsNGC0LUuXG4gICAqIEByZXR1cm5zINCc0LDRgdGB0LjQsiDQuNC3INGC0YDQtdGFINGH0LjRgdC10Lsg0LIg0LTQuNCw0L/QsNC30L7QvdC1INC+0YIgMCDQtNC+IDEuXG4gICAqL1xuICBwcm90ZWN0ZWQgY29udmVydENvbG9yKGhleENvbG9yOiBIRVhDb2xvcik6IG51bWJlcltdIHtcblxuICAgIGxldCBrID0gL14jPyhbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KSQvaS5leGVjKGhleENvbG9yKVxuICAgIGxldCBbciwgZywgYl0gPSBbcGFyc2VJbnQoayFbMV0sIDE2KSAvIDI1NSwgcGFyc2VJbnQoayFbMl0sIDE2KSAvIDI1NSwgcGFyc2VJbnQoayFbM10sIDE2KSAvIDI1NV1cblxuICAgIHJldHVybiBbciwgZywgYl1cbiAgfVxuXG4gIC8qKlxuICAgKiDQktGL0YfQuNGB0LvRj9C10YIg0YLQtdC60YPRidC10LUg0LLRgNC10LzRjy5cbiAgICpcbiAgICogQHJldHVybnMg0KHRgtGA0L7QutC+0LLQsNGPINGE0L7RgNC80LDRgtC40YDQvtCy0LDQvdC90LDRjyDQt9Cw0L/QuNGB0Ywg0YLQtdC60YPRidC10LPQviDQstGA0LXQvNC10L3QuC5cbiAgICovXG4gIHByb3RlY3RlZCBnZXRDdXJyZW50VGltZSgpOiBzdHJpbmcge1xuXG4gICAgbGV0IHRvZGF5ID0gbmV3IERhdGUoKTtcblxuICAgIGxldCB0aW1lID1cbiAgICAgICgodG9kYXkuZ2V0SG91cnMoKSA8IDEwID8gJzAnIDogJycpICsgdG9kYXkuZ2V0SG91cnMoKSkgKyBcIjpcIiArXG4gICAgICAoKHRvZGF5LmdldE1pbnV0ZXMoKSA8IDEwID8gJzAnIDogJycpICsgdG9kYXkuZ2V0TWludXRlcygpKSArIFwiOlwiICtcbiAgICAgICgodG9kYXkuZ2V0U2Vjb25kcygpIDwgMTAgPyAnMCcgOiAnJykgKyB0b2RheS5nZXRTZWNvbmRzKCkpXG5cbiAgICByZXR1cm4gdGltZVxuICB9XG5cbiAgLyoqXG4gICAqINCe0LHQvdC+0LLQu9GP0LXRgiDQvNCw0YLRgNC40YbRgyDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuC5cbiAgICpcbiAgICogQHJlbWFya3NcbiAgICog0KHRg9GJ0LXRgdGC0LLRg9C10YIg0LTQstCwINCy0LDRgNC40LDQvdGC0LAg0LLRi9C30L7QstCwINC80LXRgtC+0LTQsCAtINC40Lcg0LTRgNGD0LPQvtCz0L4g0LzQtdGC0L7QtNCwINGN0LrQt9C10LzQv9C70Y/RgNCwICh7QGxpbmsgcmVuZGVyfSkg0Lgg0LjQtyDQvtCx0YDQsNCx0L7RgtGH0LjQutCwINGB0L7QsdGL0YLQuNGPINC80YvRiNC4XG4gICAqICh7QGxpbmsgaGFuZGxlTW91c2VXaGVlbH0pLiDQktC+INCy0YLQvtGA0L7QvCDQstCw0YDQuNCw0L3RgtC1INC40YHQv9C+0LvRjNC30L7QstCw0L3QuNC1INC+0LHRitC10LrRgtCwIHRoaXMg0L3QtdCy0L7Qt9C80L7QttC90L4uINCU0LvRjyDRg9C90LjQstC10YDRgdCw0LvRjNC90L7RgdGC0Lgg0LLRi9C30L7QstCwXG4gICAqINC80LXRgtC+0LTQsCAtINCyINC90LXQs9C+INCy0YHQtdCz0LTQsCDRj9Cy0L3QviDQvdC10L7QsdGF0L7QtNC40LzQviDQv9C10YDQtdC00LDQstCw0YLRjCDRgdGB0YvQu9C60YMg0L3QsCDRjdC60LfQtdC80L/Qu9GP0YAg0LrQu9Cw0YHRgdCwLlxuICAgKlxuICAgKiBAcGFyYW0gJHRoaXMgLSDQrdC60LfQtdC80L/Qu9GP0YAg0LrQu9Cw0YHRgdCwLCDRh9GM0Y4g0LzQsNGC0YDQuNGG0YMg0YLRgNCw0L3RgdGE0L7RgNC80LDRhtC40Lgg0L3QtdC+0LHRhdC+0LTQuNC80L4g0L7QsdC90L7QstC40YLRjC5cbiAgICovXG4gIHByb3RlY3RlZCB1cGRhdGVUcmFuc01hdHJpeCgkdGhpczogU1Bsb3QpOiB2b2lkIHtcblxuICAgIGNvbnN0IHQxID0gJHRoaXMuY2FtZXJhLnpvb20gKiAkdGhpcy5VU0VGVUxfQ09OU1RTWzVdXG4gICAgY29uc3QgdDIgPSAkdGhpcy5jYW1lcmEuem9vbSAqICR0aGlzLlVTRUZVTF9DT05TVFNbNl1cblxuICAgICR0aGlzLnRyYW5zb3JtYXRpb24ubWF0cml4ID0gW1xuICAgICAgdDEsIDAsIDAsIDAsIC10MiwgMCwgLSR0aGlzLmNhbWVyYS54ICogdDEgLSAxLCAkdGhpcy5jYW1lcmEueSAqIHQyICsgMSwgMVxuICAgIF1cbiAgfVxuXG4gIC8qKlxuICAgKiDQoNC10LDQs9C40YDRg9C10YIg0L3QsCDQtNCy0LjQttC10L3QuNC1INC80YvRiNC4L9GC0YDQtdC60L/QsNC00LAg0LIg0LzQvtC80LXQvdGCLCDQutC+0LPQtNCwINC10LUv0LXQs9C+INC60LvQsNCy0LjRiNCwINGD0LTQtdGA0LbQuNCy0LDQtdGC0YHRjyDQvdCw0LbQsNGC0L7QuS5cbiAgICpcbiAgICogQHJlbWVya3NcbiAgICog0JzQtdGC0L7QtCDQv9C10YDQtdC80LXRidCw0LXRgiDQvtCx0LvQsNGB0YLRjCDQstC40LTQuNC80L7RgdGC0Lgg0L3QsCDQv9C70L7RgdC60L7RgdGC0Lgg0LLQvNC10YHRgtC1INGBINC00LLQuNC20LXQvdC40LXQvCDQvNGL0YjQuC/RgtGA0LXQutC/0LDQtNCwLiDQktGL0YfQuNGB0LvQtdC90LjRjyDQstC90YPRgtGA0Lgg0YHQvtCx0YvRgtC40Y8g0YHQtNC10LvQsNC90YtcbiAgICog0LzQsNC60YHQuNC80LDQu9GM0L3QviDQv9GA0L7QuNC30LLQvtC00LjRgtC10LvRjNC90YvQvNC4INCyINGD0YnQtdGA0LEg0YfQuNGC0LDQsdC10LvRjNC90L7RgdGC0Lgg0LvQvtCz0LjQutC4INC00LXQudGB0YLQstC40LkuINCS0L4g0LLQvdC10YjQvdC10Lwg0L7QsdGA0LDQsdC+0YLRh9C40LrQtSDRgdC+0LHRi9GC0LjQuSDQvtCx0YrQtdC60YIgdGhpc1xuICAgKiDQvdC10LTQvtGB0YLRg9C/0LXQvSDQv9C+0Y3RgtC+0LzRgyDQtNC+0YHRgtGD0L8g0Log0Y3QutC30LXQvNC/0LvRj9GA0YMg0LrQu9Cw0YHRgdCwINGA0LXQsNC70LjQt9GD0LXRgtGB0Y8g0YfQtdGA0LXQtyDRgdGC0LDRgtC40YfQtdGB0LrQuNC5INC80LDRgdGB0LjQsiDQstGB0LXRhSDRgdC+0LfQtNCw0L3QvdGL0YUg0Y3QutC30LXQvNC/0LvRj9GA0L7QslxuICAgKiDQutC70LDRgdGB0LAg0Lgg0LjQtNC10L3RgtC40YTQuNC60LDRgtC+0YDQsCDQutCw0L3QstCw0YHQsCwg0LLRi9GB0YLRg9C/0LDRjtGJ0LXQs9C+INC40L3QtNC10LrRgdC+0Lwg0LIg0Y3RgtC+0Lwg0LzQsNGB0YHQuNCy0LUuXG4gICAqXG4gICAqIEBwYXJhbSBldmVudCAtINCh0L7QsdGL0YLQuNC1INC80YvRiNC4L9GC0YDQtdC60L/QsNC00LAuXG4gICAqL1xuICBwcm90ZWN0ZWQgaGFuZGxlTW91c2VNb3ZlKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG5cbiAgICAvLyDQn9C+0LvRg9GH0LXQvdC40LUg0LTQvtGB0YLRg9C/0LAg0Log0L7QsdGK0LXQutGC0YMgdGhpcy5cbiAgICBjb25zdCAkdGhpcyA9IFNQbG90Lmluc3RhbmNlc1sgKGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudCkuaWQgXVxuXG4gICAgJHRoaXMuY2FtZXJhLnggPSAkdGhpcy50cmFuc29ybWF0aW9uLnN0YXJ0Q2FtZXJhWCArICR0aGlzLnRyYW5zb3JtYXRpb24uc3RhcnRQb3NYIC1cbiAgICAgICgoZXZlbnQuY2xpZW50WCAtICR0aGlzLlVTRUZVTF9DT05TVFNbOV0pICogJHRoaXMuVVNFRlVMX0NPTlNUU1s3XSAtIDEpICogJHRoaXMudHJhbnNvcm1hdGlvbi5zdGFydEludk1hdHJpeFswXSAtXG4gICAgICAkdGhpcy50cmFuc29ybWF0aW9uLnN0YXJ0SW52TWF0cml4WzZdXG5cbiAgICAkdGhpcy5jYW1lcmEueSA9ICR0aGlzLnRyYW5zb3JtYXRpb24uc3RhcnRDYW1lcmFZICsgJHRoaXMudHJhbnNvcm1hdGlvbi5zdGFydFBvc1kgLVxuICAgICAgKChldmVudC5jbGllbnRZIC0gJHRoaXMuVVNFRlVMX0NPTlNUU1sxMF0pICogJHRoaXMuVVNFRlVMX0NPTlNUU1s4XSArIDEpICogJHRoaXMudHJhbnNvcm1hdGlvbi5zdGFydEludk1hdHJpeFs0XSAtXG4gICAgICAkdGhpcy50cmFuc29ybWF0aW9uLnN0YXJ0SW52TWF0cml4WzddXG5cbiAgICAvLyDQoNC10L3QtNC10YDQuNC90LMg0YEg0L7QsdC90L7QstC70LXQvdC90YvQvNC4INC/0LDRgNCw0LzQtdGC0YDQsNC80Lgg0YLRgNCw0L3RgdGE0L7RgNC80LDRhtC40LguXG4gICAgJHRoaXMucmVuZGVyKClcbiAgfVxuXG4gIC8qKlxuICAgKiDQoNC10LDQs9C40YDRg9C10YIg0L3QsCDQvdCw0LbQsNGC0LjQtSDQutC70LDQstC40YjQuCDQvNGL0YjQuC/RgtGA0LXQutC/0LDQtNCwLlxuICAgKlxuICAgKiBAcmVtZXJrc1xuICAgKiDQkiDQvNC+0LzQtdC90YIg0L3QsNC20LDRgtC40Y8g0Lgg0YPQtNC10YDQttCw0L3QuNGPINC60LvQsNCy0LjRiNC4INC30LDQv9GD0YHQutCw0LXRgtGB0Y8g0LDQvdCw0LvQuNC3INC00LLQuNC20LXQvdC40Y8g0LzRi9GI0Lgv0YLRgNC10LrQv9Cw0LTQsCAo0YEg0LfQsNC20LDRgtC+0Lkg0LrQu9Cw0LLQuNGI0LXQuSkuINCS0YvRh9C40YHQu9C10L3QuNGPXG4gICAqINCy0L3Rg9GC0YDQuCDRgdC+0LHRi9GC0LjRjyDRgdC00LXQu9Cw0L3RiyDQvNCw0LrRgdC40LzQsNC70YzQvdC+INC/0YDQvtC40LfQstC+0LTQuNGC0LXQu9GM0L3Ri9C80Lgg0LIg0YPRidC10YDQsSDRh9C40YLQsNCx0LXQu9GM0L3QvtGB0YLQuCDQu9C+0LPQuNC60Lgg0LTQtdC50YHRgtCy0LjQuS4g0JLQviDQstC90LXRiNC90LXQvCDQvtCx0YDQsNCx0L7RgtGH0LjQutC1XG4gICAqINGB0L7QsdGL0YLQuNC5INC+0LHRitC10LrRgiB0aGlzINC90LXQtNC+0YHRgtGD0L/QtdC9INC/0L7RjdGC0L7QvNGDINC00L7RgdGC0YPQvyDQuiDRjdC60LfQtdC80L/Qu9GP0YDRgyDQutC70LDRgdGB0LAg0YDQtdCw0LvQuNC30YPQtdGC0YHRjyDRh9C10YDQtdC3INGB0YLQsNGC0LjRh9C10YHQutC40Lkg0LzQsNGB0YHQuNCyINCy0YHQtdGFXG4gICAqINGB0L7Qt9C00LDQvdC90YvRhSDRjdC60LfQtdC80L/Qu9GP0YDQvtCyINC60LvQsNGB0YHQsCDQuCDQuNC00LXQvdGC0LjRhNC40LrQsNGC0L7RgNCwINC60LDQvdCy0LDRgdCwLCDQstGL0YHRgtGD0L/QsNGO0YnQtdCz0L4g0LjQvdC00LXQutGB0L7QvCDQsiDRjdGC0L7QvCDQvNCw0YHRgdC40LLQtS5cbiAgICpcbiAgICogQHBhcmFtIGV2ZW50IC0g0KHQvtCx0YvRgtC40LUg0LzRi9GI0Lgv0YLRgNC10LrQv9Cw0LTQsC5cbiAgICovXG4gIHByb3RlY3RlZCBoYW5kbGVNb3VzZURvd24oZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcblxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcblxuICAgIC8vINCf0L7Qu9GD0YfQtdC90LjQtSDQtNC+0YHRgtGD0L/QsCDQuiDQvtCx0YrQtdC60YLRgyB0aGlzLlxuICAgIGNvbnN0ICR0aGlzID0gU1Bsb3QuaW5zdGFuY2VzWyhldmVudC50YXJnZXQgYXMgSFRNTEVsZW1lbnQpLmlkXVxuXG4gICAgLy8g0KHRgNCw0LfRgyDQv9C+0YHQu9C1INC90LDRh9Cw0LvQsCDRg9C00LXRgNC20LDQvdC40Y8g0LrQu9Cw0LLQuNGI0Lgg0LfQsNC/0YPRgdC60LXRgtGB0Y8gXCLQv9GA0L7RgdC70YPRiNC60LBcIiDRgdC+0LHRi9GC0LjQuSDQtNCy0LjQttC10L3QuNGPINC4INC+0YLQttCw0YLQuNGPINC60LvQsNCy0LjRiNC4LlxuICAgIGV2ZW50LnRhcmdldCEuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgJHRoaXMuaGFuZGxlTW91c2VNb3ZlIGFzIEV2ZW50TGlzdGVuZXIpXG4gICAgZXZlbnQudGFyZ2V0IS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgJHRoaXMuaGFuZGxlTW91c2VVcCBhcyBFdmVudExpc3RlbmVyKVxuXG4gICAgJHRoaXMudHJhbnNvcm1hdGlvbi5zdGFydEludk1hdHJpeCA9IFtcbiAgICAgIDEgLyAkdGhpcy50cmFuc29ybWF0aW9uLm1hdHJpeFswXSwgMCwgMCwgMCwgMSAvICR0aGlzLnRyYW5zb3JtYXRpb24ubWF0cml4WzRdLFxuICAgICAgMCwgLSR0aGlzLnRyYW5zb3JtYXRpb24ubWF0cml4WzZdIC8gJHRoaXMudHJhbnNvcm1hdGlvbi5tYXRyaXhbMF0sXG4gICAgICAtJHRoaXMudHJhbnNvcm1hdGlvbi5tYXRyaXhbN10gLyAkdGhpcy50cmFuc29ybWF0aW9uLm1hdHJpeFs0XSwgMVxuICAgIF07XG5cbiAgICAkdGhpcy50cmFuc29ybWF0aW9uLnN0YXJ0Q2FtZXJhWCA9ICR0aGlzLmNhbWVyYS54XG4gICAgJHRoaXMudHJhbnNvcm1hdGlvbi5zdGFydENhbWVyYVkgPSAkdGhpcy5jYW1lcmEueVxuXG4gICAgJHRoaXMudHJhbnNvcm1hdGlvbi5zdGFydFBvc1ggPVxuICAgICAgKChldmVudC5jbGllbnRYIC0gJHRoaXMuVVNFRlVMX0NPTlNUU1s5XSkgKiAkdGhpcy5VU0VGVUxfQ09OU1RTWzddIC0gMSkgKlxuICAgICAgJHRoaXMudHJhbnNvcm1hdGlvbi5zdGFydEludk1hdHJpeFswXSArICR0aGlzLnRyYW5zb3JtYXRpb24uc3RhcnRJbnZNYXRyaXhbNl1cblxuICAgICR0aGlzLnRyYW5zb3JtYXRpb24uc3RhcnRQb3NZID1cbiAgICAgICgoZXZlbnQuY2xpZW50WSAtICR0aGlzLlVTRUZVTF9DT05TVFNbMTBdKSAqICR0aGlzLlVTRUZVTF9DT05TVFNbOF0gKyAxKSAqXG4gICAgICAkdGhpcy50cmFuc29ybWF0aW9uLnN0YXJ0SW52TWF0cml4WzRdICsgJHRoaXMudHJhbnNvcm1hdGlvbi5zdGFydEludk1hdHJpeFs3XVxuICB9XG5cbiAgLyoqXG4gICAqINCg0LXQsNCz0LjRgNGD0LXRgiDQvdCwINC+0YLQttCw0YLQuNC1INC60LvQsNCy0LjRiNC4INC80YvRiNC4L9GC0YDQtdC60L/QsNC00LAuXG4gICAqXG4gICAqIEByZW1lcmtzXG4gICAqINCSINC80L7QvNC10L3RgiDQvtGC0LbQsNGC0LjRjyDQutC70LDQstC40YjQuCDQsNC90LDQu9C40Lcg0LTQstC40LbQtdC90LjRjyDQvNGL0YjQuC/RgtGA0LXQutC/0LDQtNCwINGBINC30LDQttCw0YLQvtC5INC60LvQsNCy0LjRiNC10Lkg0L/RgNC10LrRgNCw0YnQsNC10YLRgdGPLiDQktGL0YfQuNGB0LvQtdC90LjRjyDQstC90YPRgtGA0Lgg0YHQvtCx0YvRgtC40Y9cbiAgICog0YHQtNC10LvQsNC90Ysg0LzQsNC60YHQuNC80LDQu9GM0L3QviDQv9GA0L7QuNC30LLQvtC00LjRgtC10LvRjNC90YvQvNC4INCyINGD0YnQtdGA0LEg0YfQuNGC0LDQsdC10LvRjNC90L7RgdGC0Lgg0LvQvtCz0LjQutC4INC00LXQudGB0YLQstC40LkuINCS0L4g0LLQvdC10YjQvdC10Lwg0L7QsdGA0LDQsdC+0YLRh9C40LrQtSDRgdC+0LHRi9GC0LjQuSDQvtCx0YrQtdC60YJcbiAgICogdGhpcyDQvdC10LTQvtGB0YLRg9C/0LXQvSDQv9C+0Y3RgtC+0LzRgyDQtNC+0YHRgtGD0L8g0Log0Y3QutC30LXQvNC/0LvRj9GA0YMg0LrQu9Cw0YHRgdCwINGA0LXQsNC70LjQt9GD0LXRgtGB0Y8g0YfQtdGA0LXQtyDRgdGC0LDRgtC40YfQtdGB0LrQuNC5INC80LDRgdGB0LjQsiDQstGB0LXRhSDRgdC+0LfQtNCw0L3QvdGL0YUg0Y3QutC30LXQvNC/0LvRj9GA0L7QslxuICAgKiDQutC70LDRgdGB0LAg0Lgg0LjQtNC10L3RgtC40YTQuNC60LDRgtC+0YDQsCDQutCw0L3QstCw0YHQsCwg0LLRi9GB0YLRg9C/0LDRjtGJ0LXQs9C+INC40L3QtNC10LrRgdC+0Lwg0LIg0Y3RgtC+0Lwg0LzQsNGB0YHQuNCy0LUuXG4gICAqXG4gICAqIEBwYXJhbSBldmVudCAtINCh0L7QsdGL0YLQuNC1INC80YvRiNC4L9GC0YDQtdC60L/QsNC00LAuXG4gICAqL1xuICBwcm90ZWN0ZWQgaGFuZGxlTW91c2VVcChldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuXG4gICAgLy8g0J/QvtC70YPRh9C10L3QuNC1INC00L7RgdGC0YPQv9CwINC6INC+0LHRitC10LrRgtGDIHRoaXMuXG4gICAgY29uc3QgJHRoaXMgPSBTUGxvdC5pbnN0YW5jZXNbKGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudCkuaWRdXG5cbiAgICAvLyDQodGA0LDQt9GDINC/0L7RgdC70LUg0L7RgtC20LDRgtC40Y8g0LrQu9Cw0LLQuNGI0LggXCLQv9GA0L7RgdC70YPRiNC60LBcIiDRgdC+0LHRi9GC0LjQuSDQtNCy0LjQttC10L3QuNGPINC4INC+0YLQttCw0YLQuNGPINC60LvQsNCy0LjRiNC4INC/0YDQtdC60YDQsNGJ0LDRjtGC0YHRjy5cbiAgICBldmVudC50YXJnZXQhLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsICR0aGlzLmhhbmRsZU1vdXNlTW92ZSBhcyBFdmVudExpc3RlbmVyKVxuICAgIGV2ZW50LnRhcmdldCEucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsICR0aGlzLmhhbmRsZU1vdXNlVXAgYXMgRXZlbnRMaXN0ZW5lcilcbiAgfVxuXG4gIC8qKlxuICAgKiDQoNC10LDQs9C40YDRg9C10YIg0L3QsCDQt9GD0LzQuNGA0L7QstCw0L3QuNC1INC80YvRiNC4L9GC0YDQtdC60L/QsNC00LAuXG4gICAqXG4gICAqIEByZW1lcmtzXG4gICAqINCSINC80L7QvNC10L3RgiDQt9GD0LzQuNGA0L7QstCw0L3QuNGPINC80YvRiNC4L9GC0YDQtdC60L/QsNC00LAg0L/RgNC+0LjRgdGF0L7QtNC40YIg0LfRg9C80LjRgNC+0LLQsNC90LjQtSDQutC+0L7RgNC00LjQvdCw0YLQvdC+0Lkg0L/Qu9C+0YHQutC+0YHRgtC4LiDQktGL0YfQuNGB0LvQtdC90LjRjyDQstC90YPRgtGA0Lgg0YHQvtCx0YvRgtC40Y9cbiAgICog0YHQtNC10LvQsNC90Ysg0LzQsNC60YHQuNC80LDQu9GM0L3QviDQv9GA0L7QuNC30LLQvtC00LjRgtC10LvRjNC90YvQvNC4INCyINGD0YnQtdGA0LEg0YfQuNGC0LDQsdC10LvRjNC90L7RgdGC0Lgg0LvQvtCz0LjQutC4INC00LXQudGB0YLQstC40LkuINCS0L4g0LLQvdC10YjQvdC10Lwg0L7QsdGA0LDQsdC+0YLRh9C40LrQtSDRgdC+0LHRi9GC0LjQuSDQvtCx0YrQtdC60YJcbiAgICogdGhpcyDQvdC10LTQvtGB0YLRg9C/0LXQvSDQv9C+0Y3RgtC+0LzRgyDQtNC+0YHRgtGD0L8g0Log0Y3QutC30LXQvNC/0LvRj9GA0YMg0LrQu9Cw0YHRgdCwINGA0LXQsNC70LjQt9GD0LXRgtGB0Y8g0YfQtdGA0LXQtyDRgdGC0LDRgtC40YfQtdGB0LrQuNC5INC80LDRgdGB0LjQsiDQstGB0LXRhSDRgdC+0LfQtNCw0L3QvdGL0YUg0Y3QutC30LXQvNC/0LvRj9GA0L7QslxuICAgKiDQutC70LDRgdGB0LAg0Lgg0LjQtNC10L3RgtC40YTQuNC60LDRgtC+0YDQsCDQutCw0L3QstCw0YHQsCwg0LLRi9GB0YLRg9C/0LDRjtGJ0LXQs9C+INC40L3QtNC10LrRgdC+0Lwg0LIg0Y3RgtC+0Lwg0LzQsNGB0YHQuNCy0LUuXG4gICAqXG4gICAqIEBwYXJhbSBldmVudCAtINCh0L7QsdGL0YLQuNC1INC80YvRiNC4L9GC0YDQtdC60L/QsNC00LAuXG4gICAqL1xuICBwcm90ZWN0ZWQgaGFuZGxlTW91c2VXaGVlbChldmVudDogV2hlZWxFdmVudCk6IHZvaWQge1xuXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuXG4gICAgLy8g0J/QvtC70YPRh9C10L3QuNC1INC00L7RgdGC0YPQv9CwINC6INC+0LHRitC10LrRgtGDIHRoaXMuXG4gICAgY29uc3QgJHRoaXMgPSBTUGxvdC5pbnN0YW5jZXNbKGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudCkuaWRdXG5cbiAgICBjb25zdCBjbGlwWCA9IChldmVudC5jbGllbnRYIC0gJHRoaXMuVVNFRlVMX0NPTlNUU1s5XSkgKiAkdGhpcy5VU0VGVUxfQ09OU1RTWzddIC0gMVxuICAgIGNvbnN0IGNsaXBZID0gKGV2ZW50LmNsaWVudFkgLSAkdGhpcy5VU0VGVUxfQ09OU1RTWzEwXSkgKiAkdGhpcy5VU0VGVUxfQ09OU1RTWzhdICsgMVxuXG4gICAgY29uc3QgcHJlWm9vbVggPSAoY2xpcFggLSAkdGhpcy50cmFuc29ybWF0aW9uLm1hdHJpeFs2XSkgLyAkdGhpcy50cmFuc29ybWF0aW9uLm1hdHJpeFswXVxuICAgIGNvbnN0IHByZVpvb21ZID0gKGNsaXBZIC0gJHRoaXMudHJhbnNvcm1hdGlvbi5tYXRyaXhbN10pIC8gJHRoaXMudHJhbnNvcm1hdGlvbi5tYXRyaXhbNF1cblxuICAgIGNvbnN0IG5ld1pvb20gPSAkdGhpcy5jYW1lcmEuem9vbSAqIE1hdGgucG93KDIsIGV2ZW50LmRlbHRhWSAqIC0wLjAxKVxuICAgICR0aGlzLmNhbWVyYS56b29tID0gTWF0aC5tYXgoMC4wMDIsIE1hdGgubWluKDIwMCwgbmV3Wm9vbSkpXG5cbiAgICAkdGhpcy51cGRhdGVUcmFuc01hdHJpeCgkdGhpcylcblxuICAgIGNvbnN0IHBvc3Rab29tWCA9IChjbGlwWCAtICR0aGlzLnRyYW5zb3JtYXRpb24ubWF0cml4WzZdKSAvICR0aGlzLnRyYW5zb3JtYXRpb24ubWF0cml4WzBdXG4gICAgY29uc3QgcG9zdFpvb21ZID0gKGNsaXBZIC0gJHRoaXMudHJhbnNvcm1hdGlvbi5tYXRyaXhbN10pIC8gJHRoaXMudHJhbnNvcm1hdGlvbi5tYXRyaXhbNF1cblxuICAgICR0aGlzLmNhbWVyYS54ICs9IChwcmVab29tWCAtIHBvc3Rab29tWClcbiAgICAkdGhpcy5jYW1lcmEueSArPSAocHJlWm9vbVkgLSBwb3N0Wm9vbVkpXG5cbiAgICAvLyDQoNC10L3QtNC10YDQuNC90LMg0YEg0L7QsdC90L7QstC70LXQvdC90YvQvNC4INC/0LDRgNCw0LzQtdGC0YDQsNC80Lgg0YLRgNCw0L3RgdGE0L7RgNC80LDRhtC40LguXG4gICAgJHRoaXMucmVuZGVyKClcbiAgfVxuXG4gIC8qKlxuICAgKiDQn9GA0L7QuNC30LLQvtC00LjRgiDRgNC10L3QtNC10YDQuNC90LMg0LPRgNCw0YTQuNC60LAg0LIg0YHQvtC+0YLQstC10YLRgdGC0LLQuNC4INGBINGC0LXQutGD0YnQuNC80Lgg0L/QsNGA0LDQvNC10YLRgNCw0LzQuCDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuC5cbiAgICovXG4gIHByb3RlY3RlZCByZW5kZXIoKTogdm9pZCB7XG5cbiAgICAvLyDQntGH0LjRgdGC0LrQsCDQvtCx0YrQtdC60YLQsCDRgNC10L3QtNC10YDQuNC90LPQsCBXZWJHTC5cbiAgICB0aGlzLmdsLmNsZWFyKHRoaXMuZ2wuQ09MT1JfQlVGRkVSX0JJVClcblxuICAgIC8vINCe0LHQvdC+0LLQu9C10L3QuNC1INC80LDRgtGA0LjRhtGLINGC0YDQsNC90YHRhNC+0YDQvNCw0YbQuNC4LlxuICAgIHRoaXMudXBkYXRlVHJhbnNNYXRyaXgodGhpcylcblxuICAgIC8vINCf0YDQuNCy0Y/Qt9C60LAg0LzQsNGC0YDQuNGG0Ysg0YLRgNCw0L3RgdGE0L7RgNC80LDRhtC40Lgg0Log0L/QtdGA0LXQvNC10L3QvdC+0Lkg0YjQtdC50LTQtdGA0LAuXG4gICAgdGhpcy5nbC51bmlmb3JtTWF0cml4M2Z2KHRoaXMudmFyaWFibGVzWyd1X21hdHJpeCddLCBmYWxzZSwgdGhpcy50cmFuc29ybWF0aW9uLm1hdHJpeClcblxuICAgIC8vINCY0YLQtdGA0LjRgNC+0LLQsNC90LjQtSDQuCDRgNC10L3QtNC10YDQuNC90LMg0LPRgNGD0L/QvyDQsdGD0YTQtdGA0L7QsiBXZWJHTC5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYnVmZmVycy5hbW91bnRPZkJ1ZmZlckdyb3VwczsgaSsrKSB7XG5cbiAgICAgIC8vINCj0YHRgtCw0L3QvtCy0LrQsCDRgtC10LrRg9GJ0LXQs9C+INCx0YPRhNC10YDQsCDQstC10YDRiNC40L0g0Lgg0LXQs9C+INC/0YDQuNCy0Y/Qt9C60LAg0Log0L/QtdGA0LXQvNC10L3QvdC+0Lkg0YjQtdC50LTQtdGA0LAuXG4gICAgICB0aGlzLmdsLmJpbmRCdWZmZXIodGhpcy5nbC5BUlJBWV9CVUZGRVIsIHRoaXMuYnVmZmVycy52ZXJ0ZXhCdWZmZXJzW2ldKVxuICAgICAgdGhpcy5nbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheSh0aGlzLnZhcmlhYmxlc1snYV9wb3NpdGlvbiddKVxuICAgICAgdGhpcy5nbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKHRoaXMudmFyaWFibGVzWydhX3Bvc2l0aW9uJ10sIDIsIHRoaXMuZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKVxuXG4gICAgICAvLyDQo9GB0YLQsNC90L7QstC60LAg0YLQtdC60YPRidC10LPQviDQsdGD0YTQtdGA0LAg0YbQstC10YLQvtCyINCy0LXRgNGI0LjQvSDQuCDQtdCz0L4g0L/RgNC40LLRj9C30LrQsCDQuiDQv9C10YDQtdC80LXQvdC90L7QuSDRiNC10LnQtNC10YDQsC5cbiAgICAgIHRoaXMuZ2wuYmluZEJ1ZmZlcih0aGlzLmdsLkFSUkFZX0JVRkZFUiwgdGhpcy5idWZmZXJzLmNvbG9yQnVmZmVyc1tpXSlcbiAgICAgIHRoaXMuZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkodGhpcy52YXJpYWJsZXNbJ2FfY29sb3InXSlcbiAgICAgIHRoaXMuZ2wudmVydGV4QXR0cmliUG9pbnRlcih0aGlzLnZhcmlhYmxlc1snYV9jb2xvciddLCAxLCB0aGlzLmdsLlVOU0lHTkVEX0JZVEUsIGZhbHNlLCAwLCAwKVxuXG4gICAgICAvLyDQo9GB0YLQsNC90L7QstC60LAg0YLQtdC60YPRidC10LPQviDQsdGD0YTQtdGA0LAg0LjQvdC00LXQutGB0L7QsiDQstC10YDRiNC40L0uXG4gICAgICB0aGlzLmdsLmJpbmRCdWZmZXIodGhpcy5nbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgdGhpcy5idWZmZXJzLmluZGV4QnVmZmVyc1tpXSlcblxuICAgICAgLy8g0KDQtdC90LTQtdGA0LjQvdCzINGC0LXQutGD0YnQtdC5INCz0YDRg9C/0L/RiyDQsdGD0YTQtdGA0L7Qsi5cbiAgICAgIHRoaXMuZ2wuZHJhd0VsZW1lbnRzKHRoaXMuZ2wuVFJJQU5HTEVTLCB0aGlzLmJ1ZmZlcnMuYW1vdW50T2ZHTFZlcnRpY2VzW2ldLFxuICAgICAgICB0aGlzLmdsLlVOU0lHTkVEX1NIT1JULCAwKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDQodC70YPRh9Cw0LnQvdGL0Lwg0L7QsdGA0LDQt9C+0Lwg0LLQvtC30LLRgNCw0YnQsNC10YIg0L7QtNC40L0g0LjQtyDQuNC90LTQtdC60YHQvtCyINGH0LjRgdC70L7QstC+0LPQviDQvtC00L3QvtC80LXRgNC90L7Qs9C+INC80LDRgdGB0LjQstCwLiDQndC10YHQvNC+0YLRgNGPINC90LAg0YHQu9GD0YfQsNC50L3QvtGB0YLRjCDQutCw0LbQtNC+0LPQvlxuICAgKiDQutC+0L3QutGA0LXRgtC90L7Qs9C+INCy0YvQt9C+0LLQsCDRhNGD0L3QutGG0LjQuCwg0LjQvdC00LXQutGB0Ysg0LLQvtC30LLRgNCw0YnQsNGO0YLRgdGPINGBINC/0YDQtdC00L7Qv9GA0LXQtNC10LvQtdC90L3QvtC5INGH0LDRgdGC0L7RgtC+0LkuINCn0LDRgdGC0L7RgtCwIFwi0LLRi9C/0LDQtNCw0L3QuNC5XCIg0LjQvdC00LXQutGB0L7QsiDQt9Cw0LTQsNC10YLRgdGPXG4gICAqINGB0L7QvtGC0LLQtdGC0YHRgtCy0YPRjtGJ0LjQvNC4INC30L3QsNGH0LXQvdC40Y/QvNC4INGN0LvQtdC80LXQvdGC0L7Qsi5cbiAgICpcbiAgICogQHJlbWFya3NcbiAgICog0J/RgNC40LzQtdGAOiDQndCwINC80LDRgdGB0LjQstC1IFszLCAyLCA1XSDRhNGD0L3QutGG0LjRjyDQsdGD0LTQtdGCINCy0L7Qt9Cy0YDQsNGJ0LDRgtGMINC40L3QtNC10LrRgSAwINGBINGH0LDRgdGC0L7RgtC+0LkgPSAzLygzKzIrNSkgPSAzLzEwLCDQuNC90LTQtdC60YEgMSDRgSDRh9Cw0YHRgtC+0YLQvtC5ID1cbiAgICogMi8oMysyKzUpID0gMi8xMCwg0LjQvdC00LXQutGBIDIg0YEg0YfQsNGB0YLQvtGC0L7QuSA9IDUvKDMrMis1KSA9IDUvMTAuXG4gICAqXG4gICAqIEBwYXJhbSBhcnIgLSDQp9C40YHQu9C+0LLQvtC5INC+0LTQvdC+0LzQtdGA0L3Ri9C5INC80LDRgdGB0LjQsiwg0LjQvdC00LXQutGB0Ysg0LrQvtGC0L7RgNC+0LPQviDQsdGD0LTRg9GCINCy0L7Qt9Cy0YDQsNGJ0LDRgtGM0YHRjyDRgSDQv9GA0LXQtNC+0L/RgNC10LTQtdC70LXQvdC90L7QuSDRh9Cw0YHRgtC+0YLQvtC5LlxuICAgKiBAcmV0dXJucyDQodC70YPRh9Cw0LnQvdGL0Lkg0LjQvdC00LXQutGBINC40Lcg0LzQsNGB0YHQuNCy0LAgYXJyLlxuICAgKi9cbiAgcHJvdGVjdGVkIHJhbmRvbVF1b3RhSW5kZXgoYXJyOiBudW1iZXJbXSk6IG51bWJlciB7XG5cbiAgICBsZXQgYTogbnVtYmVyW10gPSBbXVxuICAgIGFbMF0gPSBhcnJbMF1cblxuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICBhW2ldID0gYVtpIC0gMV0gKyBhcnJbaV1cbiAgICB9XG5cbiAgICBjb25zdCBsYXN0SW5kZXg6IG51bWJlciA9IGEubGVuZ3RoIC0gMVxuXG4gICAgbGV0IHI6IG51bWJlciA9IE1hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkgKiBhW2xhc3RJbmRleF0pKSArIDFcbiAgICBsZXQgbDogbnVtYmVyID0gMFxuICAgIGxldCBoOiBudW1iZXIgPSBsYXN0SW5kZXhcblxuICAgIHdoaWxlIChsIDwgaCkge1xuICAgICAgY29uc3QgbTogbnVtYmVyID0gbCArICgoaCAtIGwpID4+IDEpO1xuICAgICAgKHIgPiBhW21dKSA/IChsID0gbSArIDEpIDogKGggPSBtKVxuICAgIH1cblxuICAgIHJldHVybiAoYVtsXSA+PSByKSA/IGwgOiAtMVxuICB9XG5cbiAgLyoqXG4gICAqINCc0LXRgtC+0LQg0LjQvNC40YLQsNGG0LjQuCDQuNGC0LXRgNC40YDQvtCy0LDQvdC40Y8g0LjRgdGF0L7QtNC90YvRhSDQvtCx0YrQtdC60YLQvtCyLiDQn9GA0Lgg0LrQsNC20LTQvtC8INC90L7QstC+0Lwg0LLRi9C30L7QstC1INCy0L7Qt9Cy0YDQsNGJ0LDQtdGCINC40L3RhNC+0YDQvNCw0YbQuNGOINC+INC/0L7Qu9C40LPQvtC90LUg0YHQviDRgdC70YPRh9Cw0L3Ri9C8XG4gICAqINC/0L7Qu9C+0LbQtdC90LjQtdC8LCDRgdC70YPRh9Cw0LnQvdC+0Lkg0YTQvtGA0LzQvtC5INC4INGB0LvRg9GH0LDQudC90YvQvCDRhtCy0LXRgtC+0LwuXG4gICAqXG4gICAqIEByZXR1cm5zINCY0L3RhNC+0YDQvNCw0YbQuNGPINC+INC/0L7Qu9C40LPQvtC90LUg0LjQu9C4IG51bGwsINC10YHQu9C4INC/0LXRgNC10LHQvtGAINC40YHRhdC+0LTQvdGL0YUg0L7QsdGK0LXQutGC0L7QsiDQt9Cw0LrQvtC90YfQuNC70YHRjy5cbiAgICovXG4gIHByb3RlY3RlZCBkZW1vSXRlcmF0aW9uQ2FsbGJhY2soKTogU1Bsb3RQb2x5Z29uIHwgbnVsbCB7XG4gICAgaWYgKHRoaXMuZGVtb01vZGUuaW5kZXghIDwgdGhpcy5kZW1vTW9kZS5hbW91bnQhKSB7XG4gICAgICB0aGlzLmRlbW9Nb2RlLmluZGV4ISArKztcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHg6IHJhbmRvbUludCh0aGlzLmdyaWRTaXplLndpZHRoKSxcbiAgICAgICAgeTogcmFuZG9tSW50KHRoaXMuZ3JpZFNpemUuaGVpZ2h0KSxcbiAgICAgICAgc2hhcGU6IHRoaXMucmFuZG9tUXVvdGFJbmRleCh0aGlzLmRlbW9Nb2RlLnNoYXBlUXVvdGEhKSxcbiAgICAgICAgY29sb3I6IHJhbmRvbUludCh0aGlzLnBvbHlnb25QYWxldHRlLmxlbmd0aClcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZVxuICAgICAgcmV0dXJuIG51bGxcbiAgfVxuXG4gIC8qKlxuICAgKiDQl9Cw0L/Rg9GB0LrQsNC10YIg0YDQtdC90LTQtdGA0LjQvdCzINC4IFwi0L/RgNC+0YHQu9GD0YjQutGDXCIg0YHQvtCx0YvRgtC40Lkg0LzRi9GI0Lgv0YLRgNC10LrQv9Cw0LTQsCDQvdCwINC60LDQvdCy0LDRgdC1LlxuICAgKi9cbiAgcHVibGljIHJ1bigpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuaXNSdW5uaW5nKSB7XG5cbiAgICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMuaGFuZGxlTW91c2VEb3duKVxuICAgICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignd2hlZWwnLCB0aGlzLmhhbmRsZU1vdXNlV2hlZWwpXG5cbiAgICAgIHRoaXMucmVuZGVyKClcblxuICAgICAgdGhpcy5pc1J1bm5pbmcgPSB0cnVlXG4gICAgfVxuXG4gICAgLy8g0JLRi9Cy0L7QtCDQvtGC0LvQsNC00L7Rh9C90L7QuSDQuNC90YTQvtGA0LzQsNGG0LjQuC5cbiAgICBpZiAodGhpcy5kZWJ1Z01vZGUuaXNFbmFibGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKCclY9Cg0LXQvdC00LXRgNC40L3QsyDQt9Cw0L/Rg9GJ0LXQvScsIHRoaXMuZGVidWdNb2RlLmdyb3VwU3R5bGUpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqINCe0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdGCINGA0LXQvdC00LXRgNC40L3QsyDQuCBcItC/0YDQvtGB0LvRg9GI0LrRg1wiINGB0L7QsdGL0YLQuNC5INC80YvRiNC4L9GC0YDQtdC60L/QsNC00LAg0L3QsCDQutCw0L3QstCw0YHQtS5cbiAgICpcbiAgICogQHBhcmFtIGNsZWFyIC0g0J/RgNC40LfQvdCw0Log0L3QtdC+0L7QsdGF0L7QtNC40LzQvtGB0YLQuCDQstC80LXRgdGC0LUg0YEg0L7RgdGC0LDQvdC+0LLQutC+0Lkg0YDQtdC90LTQtdGA0LjQvdCz0LAg0L7Rh9C40YHRgtC40YLRjCDQutCw0L3QstCw0YEuINCX0L3QsNGH0LXQvdC40LUgdHJ1ZSDQvtGH0LjRidCw0LXRgiDQutCw0L3QstCw0YEsXG4gICAqINC30L3QsNGH0LXQvdC40LUgZmFsc2UgLSDQvtGB0YLQsNCy0LvRj9C10YIg0LXQs9C+INC90LXQvtGH0LjRidC10L3QvdGL0LwuINCf0L4g0YPQvNC+0LvRh9Cw0L3QuNGOINC+0YfQuNGB0YLQutCwINC90LUg0L/RgNC+0LjRgdGF0L7QtNC40YIuXG4gICAqL1xuICBwdWJsaWMgc3RvcChjbGVhcjogYm9vbGVhbiA9IGZhbHNlKTogdm9pZCB7XG5cbiAgICBpZiAodGhpcy5pc1J1bm5pbmcpIHtcblxuICAgICAgdGhpcy5jYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5oYW5kbGVNb3VzZURvd24pXG4gICAgICB0aGlzLmNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKCd3aGVlbCcsIHRoaXMuaGFuZGxlTW91c2VXaGVlbClcbiAgICAgIHRoaXMuY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMuaGFuZGxlTW91c2VNb3ZlKVxuICAgICAgdGhpcy5jYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuaGFuZGxlTW91c2VVcClcblxuICAgICAgaWYgKGNsZWFyKSB7XG4gICAgICAgIHRoaXMuY2xlYXIoKVxuICAgICAgfVxuXG4gICAgICB0aGlzLmlzUnVubmluZyA9IGZhbHNlXG4gICAgfVxuXG4gICAgLy8g0JLRi9Cy0L7QtCDQvtGC0LvQsNC00L7Rh9C90L7QuSDQuNC90YTQvtGA0LzQsNGG0LjQuC5cbiAgICBpZiAodGhpcy5kZWJ1Z01vZGUuaXNFbmFibGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKCclY9Cg0LXQvdC00LXRgNC40L3QsyDQvtGB0YLQsNC90L7QstC70LXQvScsIHRoaXMuZGVidWdNb2RlLmdyb3VwU3R5bGUpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqINCe0YfQuNGJ0LDQtdGCINC60LDQvdCy0LDRgSwg0LfQsNC60YDQsNGI0LjQstCw0Y8g0LXQs9C+INCyINGE0L7QvdC+0LLRi9C5INGG0LLQtdGCLlxuICAgKi9cbiAgcHVibGljIGNsZWFyKCk6IHZvaWQge1xuXG4gICAgdGhpcy5nbC5jbGVhcih0aGlzLmdsLkNPTE9SX0JVRkZFUl9CSVQpO1xuXG4gICAgLy8g0JLRi9Cy0L7QtCDQvtGC0LvQsNC00L7Rh9C90L7QuSDQuNC90YTQvtGA0LzQsNGG0LjQuC5cbiAgICBpZiAodGhpcy5kZWJ1Z01vZGUuaXNFbmFibGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKCclY9Ca0L7QvdGC0LXQutGB0YIg0YDQtdC90LTQtdGA0LjQvdCz0LAg0L7Rh9C40YnQtdC9IFsnICsgdGhpcy5iZ0NvbG9yICsgJ10nLCB0aGlzLmRlYnVnTW9kZS5ncm91cFN0eWxlKTtcbiAgICB9XG4gIH1cbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL2luZGV4LnRzXCIpO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==