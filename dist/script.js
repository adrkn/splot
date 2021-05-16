/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./style.css":
/*!*******************!*\
  !*** ./style.css ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./index.ts":
/*!******************!*\
  !*** ./index.ts ***!
  \******************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
            shape: 1,
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
        isEnable: false,
    },
});
scatterPlot.run();


/***/ }),

/***/ "./splot.ts":
/*!******************!*\
  !*** ./splot.ts ***!
  \******************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
// @ts-ignore
var m3_1 = __importDefault(__webpack_require__(/*! ./m3 */ "./m3.js"));
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
            powerPreference: 'low-power',
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
        this.vertexShaderCodeTemplate = 'attribute vec2 a_position;\n' +
            'attribute float a_color;\n' +
            'uniform mat3 u_matrix;\n' +
            'varying vec3 v_color;\n' +
            'void main() {\n' +
            '  gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0.0, 1.0);\n' +
            '  gl_PointSize = 1.0;\n' +
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
            viewProjectionMat: [],
            startInvViewProjMat: [],
            startCamera: { x: 0, y: 0, zoom: 1 },
            startPos: [],
            startClipPos: [],
            startMousePos: []
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
        var vertexShaderCode = this.vertexShaderCodeTemplate.replace('SET-VERTEX-COLOR-CODE', this.genShaderColorCode());
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
             * @todo Обработать этот вывод в зависимости от способа получения данных о полигонах. Ввести типы - заданная
             * функция итерирования, демо-итерирование, переданный массив данных.
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
     * =====================================================================================================================
     */
    /**
     *
     */
    SPlot.prototype.makeCameraMatrix = function ($this) {
        var zoomScale = 1 / $this.camera.zoom;
        var cameraMat = m3_1.default.identity();
        cameraMat = m3_1.default.translate(cameraMat, $this.camera.x, $this.camera.y);
        cameraMat = m3_1.default.scale(cameraMat, zoomScale, zoomScale);
        return cameraMat;
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
    SPlot.prototype.updateViewProjection = function ($this) {
        var projectionMat = m3_1.default.projection($this.gl.canvas.width, $this.gl.canvas.height);
        var cameraMat = $this.makeCameraMatrix($this);
        var viewMat = m3_1.default.inverse(cameraMat);
        $this.transormation.viewProjectionMat = m3_1.default.multiply(projectionMat, viewMat);
    };
    /**
     *
     */
    SPlot.prototype.getClipSpaceMousePosition = function (event) {
        var $this = SPlot.instances[event.target.id];
        // get canvas relative css position
        var rect = $this.canvas.getBoundingClientRect();
        var cssX = event.clientX - rect.left;
        var cssY = event.clientY - rect.top;
        // get normalized 0 to 1 position across and down canvas
        var normalizedX = cssX / $this.canvas.clientWidth;
        var normalizedY = cssY / $this.canvas.clientHeight;
        // convert to clip space
        var clipX = normalizedX * 2 - 1;
        var clipY = normalizedY * -2 + 1;
        return [clipX, clipY];
    };
    /**
     *
     */
    SPlot.prototype.moveCamera = function (event) {
        var $this = SPlot.instances[event.target.id];
        var pos = m3_1.default.transformPoint($this.transormation.startInvViewProjMat, $this.getClipSpaceMousePosition(event));
        $this.camera.x =
            $this.transormation.startCamera.x + $this.transormation.startPos[0] - pos[0];
        $this.camera.y =
            $this.transormation.startCamera.y + $this.transormation.startPos[1] - pos[1];
        $this.render();
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
        var $this = SPlot.instances[event.target.id];
        $this.moveCamera(event);
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
        var $this = SPlot.instances[event.target.id];
        $this.render();
        event.target.removeEventListener('mousemove', $this.handleMouseMove);
        event.target.removeEventListener('mouseup', $this.handleMouseUp);
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
        var $this = SPlot.instances[event.target.id];
        event.preventDefault();
        $this.canvas.addEventListener('mousemove', $this.handleMouseMove);
        $this.canvas.addEventListener('mouseup', $this.handleMouseUp);
        $this.transormation.startInvViewProjMat = m3_1.default.inverse($this.transormation.viewProjectionMat);
        $this.transormation.startCamera = Object.assign({}, $this.camera);
        $this.transormation.startClipPos = $this.getClipSpaceMousePosition(event);
        $this.transormation.startPos = m3_1.default.transformPoint($this.transormation.startInvViewProjMat, $this.transormation.startClipPos);
        $this.transormation.startMousePos = [event.clientX, event.clientY];
        $this.render();
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
    SPlot.prototype.handleMouseWheel_original = function (event) {
        var $this = SPlot.instances[event.target.id];
        event.preventDefault();
        var _a = $this.getClipSpaceMousePosition(event), clipX = _a[0], clipY = _a[1];
        // position before zooming
        var _b = m3_1.default.transformPoint(m3_1.default.inverse($this.transormation.viewProjectionMat), [clipX, clipY]), preZoomX = _b[0], preZoomY = _b[1];
        // multiply the wheel movement by the current zoom level, so we zoom less when zoomed in and more when zoomed out
        var newZoom = $this.camera.zoom * Math.pow(2, event.deltaY * -0.01);
        $this.camera.zoom = Math.max(0.002, Math.min(200, newZoom));
        $this.updateViewProjection($this);
        // position after zooming
        var _c = m3_1.default.transformPoint(m3_1.default.inverse($this.transormation.viewProjectionMat), [clipX, clipY]), postZoomX = _c[0], postZoomY = _c[1];
        // camera needs to be moved the difference of before and after
        $this.camera.x += preZoomX - postZoomX;
        $this.camera.y += preZoomY - postZoomY;
        $this.render();
    };
    /**
     *
     */
    SPlot.prototype.handleMouseWheel = function (event) {
        var $this = SPlot.instances[event.target.id];
        event.preventDefault();
        var _a = $this.getClipSpaceMousePosition(event), clipX = _a[0], clipY = _a[1];
        // position before zooming
        var _b = m3_1.default.transformPoint(m3_1.default.inverse($this.transormation.viewProjectionMat), [clipX, clipY]), preZoomX = _b[0], preZoomY = _b[1];
        // multiply the wheel movement by the current zoom level, so we zoom less when zoomed in and more when zoomed out
        var newZoom = $this.camera.zoom * Math.pow(2, event.deltaY * -0.01);
        $this.camera.zoom = Math.max(0.002, Math.min(200, newZoom));
        // This is --- $this.updateViewProjection($this);
        var projectionMat = m3_1.default.projection($this.gl.canvas.width, $this.gl.canvas.height);
        // This is --- const cameraMat = $this.makeCameraMatrix($this);
        var zoomScale = 1 / $this.camera.zoom;
        var cameraMat = m3_1.default.identity();
        cameraMat = m3_1.default.translate(cameraMat, $this.camera.x, $this.camera.y);
        cameraMat = m3_1.default.scale(cameraMat, zoomScale, zoomScale);
        var viewMat = m3_1.default.inverse(cameraMat);
        $this.transormation.viewProjectionMat = m3_1.default.multiply(projectionMat, viewMat);
        // position after zooming
        var _c = m3_1.default.transformPoint(m3_1.default.inverse($this.transormation.viewProjectionMat), [clipX, clipY]), postZoomX = _c[0], postZoomY = _c[1];
        // camera needs to be moved the difference of before and after
        $this.camera.x += preZoomX - postZoomX;
        $this.camera.y += preZoomY - postZoomY;
        $this.render();
    };
    /**
     * =====================================================================================================================
     */
    /**
     * Производит рендеринг графика в соответствии с текущими параметрами трансформации.
     */
    SPlot.prototype.render = function () {
        // Очистка объекта рендеринга WebGL.
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        // Обновление матрицы трансформации.
        this.updateViewProjection(this);
        // Привязка матрицы трансформации к переменной шейдера.
        this.gl.uniformMatrix3fv(this.variables['u_matrix'], false, this.transormation.viewProjectionMat);
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
            this.gl.drawElements(this.gl.POINTS, this.buffers.amountOfGLVertices[i], this.gl.UNSIGNED_SHORT, 0);
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


/***/ }),

/***/ "./m3.js":
/*!***************!*\
  !*** ./m3.js ***!
  \***************/
/***/ (function(module, exports) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
 * Copyright 2021 GFXFundamentals.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of GFXFundamentals. nor the names of his
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * Various 2d math functions.
 *
 * @module webgl-2d-math
 */
(function(root, factory) {  // eslint-disable-line
  if (true) {
    // AMD. Register as an anonymous module.
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
}(this, function() {
  "use strict";

  /**
   * An array or typed array with 9 values.
   * @typedef {number[]|TypedArray} Matrix3
   * @memberOf module:webgl-2d-math
   */

  /**
   * Takes two Matrix3s, a and b, and computes the product in the order
   * that pre-composes b with a.  In other words, the matrix returned will
   * @param {module:webgl-2d-math.Matrix3} a A matrix.
   * @param {module:webgl-2d-math.Matrix3} b A matrix.
   * @return {module:webgl-2d-math.Matrix3} the result.
   * @memberOf module:webgl-2d-math
   */
  function multiply(a, b) {
    var a00 = a[0 * 3 + 0];
    var a01 = a[0 * 3 + 1];
    var a02 = a[0 * 3 + 2];
    var a10 = a[1 * 3 + 0];
    var a11 = a[1 * 3 + 1];
    var a12 = a[1 * 3 + 2];
    var a20 = a[2 * 3 + 0];
    var a21 = a[2 * 3 + 1];
    var a22 = a[2 * 3 + 2];
    var b00 = b[0 * 3 + 0];
    var b01 = b[0 * 3 + 1];
    var b02 = b[0 * 3 + 2];
    var b10 = b[1 * 3 + 0];
    var b11 = b[1 * 3 + 1];
    var b12 = b[1 * 3 + 2];
    var b20 = b[2 * 3 + 0];
    var b21 = b[2 * 3 + 1];
    var b22 = b[2 * 3 + 2];

    return [
      b00 * a00 + b01 * a10 + b02 * a20,
      b00 * a01 + b01 * a11 + b02 * a21,
      b00 * a02 + b01 * a12 + b02 * a22,
      b10 * a00 + b11 * a10 + b12 * a20,
      b10 * a01 + b11 * a11 + b12 * a21,
      b10 * a02 + b11 * a12 + b12 * a22,
      b20 * a00 + b21 * a10 + b22 * a20,
      b20 * a01 + b21 * a11 + b22 * a21,
      b20 * a02 + b21 * a12 + b22 * a22,
    ];
  }


  /**
   * Creates a 3x3 identity matrix
   * @return {module:webgl2-2d-math.Matrix3} an identity matrix
   */
  function identity() {
    return [
      1, 0, 0,
      0, 1, 0,
      0, 0, 1,
    ];
  }

  /**
   * Creates a 2D projection matrix
   * @param {number} width width in pixels
   * @param {number} height height in pixels
   * @return {module:webgl-2d-math.Matrix3} a projection matrix that converts from pixels to clipspace with Y = 0 at the top.
   * @memberOf module:webgl-2d-math
   */
  function projection(width, height) {
    // Note: This matrix flips the Y axis so 0 is at the top.
    return [
      2 / width, 0, 0,
      0, -2 / height, 0,
      -1, 1, 1,
    ];
  }

  /**
   * Multiplies by a 2D projection matrix
   * @param {module:webgl-2d-math.Matrix3} the matrix to be multiplied
   * @param {number} width width in pixels
   * @param {number} height height in pixels
   * @return {module:webgl-2d-math.Matrix3} the result
   * @memberOf module:webgl-2d-math
   */
  function project(m, width, height) {
    return multiply(m, projection(width, height));
  }

  /**
   * Creates a 2D translation matrix
   * @param {number} tx amount to translate in x
   * @param {number} ty amount to translate in y
   * @return {module:webgl-2d-math.Matrix3} a translation matrix that translates by tx and ty.
   * @memberOf module:webgl-2d-math
   */
  function translation(tx, ty) {
    return [
      1, 0, 0,
      0, 1, 0,
      tx, ty, 1,
    ];
  }

  /**
   * Multiplies by a 2D translation matrix
   * @param {module:webgl-2d-math.Matrix3} the matrix to be multiplied
   * @param {number} tx amount to translate in x
   * @param {number} ty amount to translate in y
   * @return {module:webgl-2d-math.Matrix3} the result
   * @memberOf module:webgl-2d-math
   */
  function translate(m, tx, ty) {
    return multiply(m, translation(tx, ty));
  }

  /**
   * Creates a 2D rotation matrix
   * @param {number} angleInRadians amount to rotate in radians
   * @return {module:webgl-2d-math.Matrix3} a rotation matrix that rotates by angleInRadians
   * @memberOf module:webgl-2d-math
   */
  function rotation(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);
    return [
      c, -s, 0,
      s, c, 0,
      0, 0, 1,
    ];
  }

  /**
   * Multiplies by a 2D rotation matrix
   * @param {module:webgl-2d-math.Matrix3} the matrix to be multiplied
   * @param {number} angleInRadians amount to rotate in radians
   * @return {module:webgl-2d-math.Matrix3} the result
   * @memberOf module:webgl-2d-math
   */
  function rotate(m, angleInRadians) {
    return multiply(m, rotation(angleInRadians));
  }

  /**
   * Creates a 2D scaling matrix
   * @param {number} sx amount to scale in x
   * @param {number} sy amount to scale in y
   * @return {module:webgl-2d-math.Matrix3} a scale matrix that scales by sx and sy.
   * @memberOf module:webgl-2d-math
   */
  function scaling(sx, sy) {
    return [
      sx, 0, 0,
      0, sy, 0,
      0, 0, 1,
    ];
  }

  /**
   * Multiplies by a 2D scaling matrix
   * @param {module:webgl-2d-math.Matrix3} the matrix to be multiplied
   * @param {number} sx amount to scale in x
   * @param {number} sy amount to scale in y
   * @return {module:webgl-2d-math.Matrix3} the result
   * @memberOf module:webgl-2d-math
   */
  function scale(m, sx, sy) {
    return multiply(m, scaling(sx, sy));
  }

  function dot(x1, y1, x2, y2) {
    return x1 * x2 + y1 * y2;
  }

  function distance(x1, y1, x2, y2) {
    var dx = x1 - x2;
    var dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function normalize(x, y) {
    var l = distance(0, 0, x, y);
    if (l > 0.00001) {
      return [x / l, y / l];
    } else {
      return [0, 0];
    }
  }

  // i = incident
  // n = normal
  function reflect(ix, iy, nx, ny) {
    // I - 2.0 * dot(N, I) * N.
    var d = dot(nx, ny, ix, iy);
    return [
      ix - 2 * d * nx,
      iy - 2 * d * ny,
    ];
  }

  function radToDeg(r) {
    return r * 180 / Math.PI;
  }

  function degToRad(d) {
    return d * Math.PI / 180;
  }

  function transformPoint(m, v) {
    var v0 = v[0];
    var v1 = v[1];
    var d = v0 * m[0 * 3 + 2] + v1 * m[1 * 3 + 2] + m[2 * 3 + 2];
    return [
      (v0 * m[0 * 3 + 0] + v1 * m[1 * 3 + 0] + m[2 * 3 + 0]) / d,
      (v0 * m[0 * 3 + 1] + v1 * m[1 * 3 + 1] + m[2 * 3 + 1]) / d,
    ];
  }

  function inverse(m) {
    var t00 = m[1 * 3 + 1] * m[2 * 3 + 2] - m[1 * 3 + 2] * m[2 * 3 + 1];
    var t10 = m[0 * 3 + 1] * m[2 * 3 + 2] - m[0 * 3 + 2] * m[2 * 3 + 1];
    var t20 = m[0 * 3 + 1] * m[1 * 3 + 2] - m[0 * 3 + 2] * m[1 * 3 + 1];
    var d = 1.0 / (m[0 * 3 + 0] * t00 - m[1 * 3 + 0] * t10 + m[2 * 3 + 0] * t20);
    return [
       d * t00, -d * t10, d * t20,
      -d * (m[1 * 3 + 0] * m[2 * 3 + 2] - m[1 * 3 + 2] * m[2 * 3 + 0]),
       d * (m[0 * 3 + 0] * m[2 * 3 + 2] - m[0 * 3 + 2] * m[2 * 3 + 0]),
      -d * (m[0 * 3 + 0] * m[1 * 3 + 2] - m[0 * 3 + 2] * m[1 * 3 + 0]),
       d * (m[1 * 3 + 0] * m[2 * 3 + 1] - m[1 * 3 + 1] * m[2 * 3 + 0]),
      -d * (m[0 * 3 + 0] * m[2 * 3 + 1] - m[0 * 3 + 1] * m[2 * 3 + 0]),
       d * (m[0 * 3 + 0] * m[1 * 3 + 1] - m[0 * 3 + 1] * m[1 * 3 + 0]),
    ];
  }

  return {
    degToRad: degToRad,
    distance: distance,
    dot: dot,
    identity: identity,
    inverse: inverse,
    multiply: multiply,
    normalize: normalize,
    projection: projection,
    radToDeg: radToDeg,
    reflect: reflect,
    rotation: rotation,
    rotate: rotate,
    scaling: scaling,
    scale: scale,
    transformPoint: transformPoint,
    translation: translation,
    translate: translate,
    project: project,
  };

}));



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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zdHlsZS5jc3M/YzRkMiIsIndlYnBhY2s6Ly8vLi9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9zcGxvdC50cyIsIndlYnBhY2s6Ly8vLi9tMy5qcyIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svc3RhcnR1cCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7OztBQ0FBLGdGQUEyQjtBQUMzQixrREFBZ0I7QUFFaEIsU0FBUyxTQUFTLENBQUMsS0FBYTtJQUM5QixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEtBQUssQ0FBQztBQUMxQyxDQUFDO0FBRUQsSUFBSSxDQUFDLEdBQUcsQ0FBQztBQUNULElBQUksQ0FBQyxHQUFHLE9BQVMsRUFBRSw4QkFBOEI7QUFDakQsSUFBSSxPQUFPLEdBQUcsQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUM7QUFDNUgsSUFBSSxTQUFTLEdBQUcsS0FBTTtBQUN0QixJQUFJLFVBQVUsR0FBRyxLQUFNO0FBRXZCLGdIQUFnSDtBQUNoSCxTQUFTLGNBQWM7SUFDckIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQ1QsQ0FBQyxFQUFFO1FBQ0gsT0FBTztZQUNMLENBQUMsRUFBRSxTQUFTLENBQUMsU0FBUyxDQUFDO1lBQ3ZCLENBQUMsRUFBRSxTQUFTLENBQUMsVUFBVSxDQUFDO1lBQ3hCLEtBQUssRUFBRSxDQUFDO1lBQ1IsS0FBSyxFQUFFLFNBQVMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUcsZ0NBQWdDO1NBQ3BFO0tB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T0FBTztBQUNwQixjQUFjLDZCQUE2QjtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWEsNkJBQTZCO0FBQzFDLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEIsY0FBYyw2QkFBNkI7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsQ0FBQzs7Ozs7Ozs7VUM3U0Q7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0Esc0RBQXNELGtCQUFrQjtXQUN4RTtXQUNBLCtDQUErQyxjQUFjO1dBQzdELEU7Ozs7O1VDTkE7VUFDQTtVQUNBO1VBQ0EiLCJmaWxlIjoic2NyaXB0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiaW1wb3J0IFNQbG90IGZyb20gJy4vc3Bsb3QnXG5pbXBvcnQgJ0Avc3R5bGUnXG5cbmZ1bmN0aW9uIHJhbmRvbUludChyYW5nZTogbnVtYmVyKSB7XG4gIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiByYW5nZSlcbn1cblxubGV0IGkgPSAwXG5sZXQgbiA9IDFfMDAwXzAwMCAgLy8g0JjQvNC40YLQuNGA0YPQtdC80L7QtSDRh9C40YHQu9C+INC+0LHRitC10LrRgtC+0LIuXG5sZXQgcGFsZXR0ZSA9IFsnI0ZGMDBGRicsICcjODAwMDgwJywgJyNGRjAwMDAnLCAnIzgwMDAwMCcsICcjRkZGRjAwJywgJyMwMEZGMDAnLCAnIzAwODAwMCcsICcjMDBGRkZGJywgJyMwMDAwRkYnLCAnIzAwMDA4MCddXG5sZXQgcGxvdFdpZHRoID0gMzJfMDAwXG5sZXQgcGxvdEhlaWdodCA9IDE2XzAwMFxuXG4vLyDQn9GA0LjQvNC10YAg0LjRgtC10YDQuNGA0YPRjtGJ0LXQuSDRhNGD0L3QutGG0LjQuC4g0JjRgtC10YDQsNGG0LjQuCDQuNC80LjRgtC40YDRg9GO0YLRgdGPINGB0LvRg9GH0LDQudC90YvQvNC4INCy0YvQtNCw0YfQsNC80LguINCf0L7Rh9GC0Lgg0YLQsNC60LbQtSDRgNCw0LHQvtGC0LDQtdGCINGA0LXQttC40Lwg0LTQtdC80L4t0LTQsNC90L3Ri9GFLlxuZnVuY3Rpb24gcmVhZE5leHRPYmplY3QoKSB7XG4gIGlmIChpIDwgbikge1xuICAgIGkrK1xuICAgIHJldHVybiB7XG4gICAgICB4OiByYW5kb21JbnQocGxvdFdpZHRoKSxcbiAgICAgIHk6IHJhbmRvbUludChwbG90SGVpZ2h0KSxcbiAgICAgIHNoYXBlOiAxLCAgICAgICAgICAgICAgIC8vIDAgLSDRgtGA0LXRg9Cz0L7Qu9GM0L3QuNC6LCAxIC0g0LrQstCw0LTRgNCw0YIsIDIgLSDQutGA0YPQs1xuICAgICAgY29sb3I6IHJhbmRvbUludChwYWxldHRlLmxlbmd0aCksICAvLyDQmNC90LTQtdC60YEg0YbQstC10YLQsCDQsiDQvNCw0YHRgdC40LLQtSDRhtCy0LXRgtC+0LJcbiAgICB9XG4gIH1cbiAgZWxzZVxuICAgIHJldHVybiBudWxsICAvLyDQktC+0LfQstGA0LDRidCw0LXQvCBudWxsLCDQutC+0LPQtNCwINC+0LHRitC10LrRgtGLIFwi0LfQsNC60L7QvdGH0LjQu9C40YHRjFwiXG59XG5cbi8qKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKiovXG5cbmxldCBzY2F0dGVyUGxvdCA9IG5ldyBTUGxvdCgnY2FudmFzMScpXG5cbi8vINCd0LDRgdGC0YDQvtC50LrQsCDRjdC60LfQtdC80L/Qu9GP0YDQsCDQvdCwINGA0LXQttC40Lwg0LLRi9Cy0L7QtNCwINC+0YLQu9Cw0LTQvtGH0L3QvtC5INC40L3RhNC+0YDQvNCw0YbQuNC4INCyINC60L7QvdGB0L7Qu9GMINCx0YDQsNGD0LfQtdGA0LAuXG4vLyDQlNGA0YPQs9C40LUg0L/RgNC40LzQtdGA0Ysg0YDQsNCx0L7RgtGLINC+0L/QuNGB0LDQvdGLINCyINGE0LDQudC70LUgc3Bsb3QuanMg0YHQviDRgdGC0YDQvtC60LggMjE0Llxuc2NhdHRlclBsb3Quc2V0dXAoe1xuICBpdGVyYXRpb25DYWxsYmFjazogcmVhZE5leHRPYmplY3QsXG4gIHBvbHlnb25QYWxldHRlOiBwYWxldHRlLFxuICBncmlkU2l6ZToge1xuICAgIHdpZHRoOiBwbG90V2lkdGgsXG4gICAgaGVpZ2h0OiBwbG90SGVpZ2h0LFxuICB9LFxuICBkZWJ1Z01vZGU6IHtcbiAgICBpc0VuYWJsZTogdHJ1ZSxcbiAgfSxcbiAgZGVtb01vZGU6IHtcbiAgICBpc0VuYWJsZTogZmFsc2UsXG4gIH0sXG59KVxuXG5zY2F0dGVyUGxvdC5ydW4oKVxuIiwiLy8gQHRzLWlnbm9yZVxuaW1wb3J0IG0zIGZyb20gJy4vbTMnXG5cbi8qKlxuICog0J/RgNC+0LLQtdGA0Y/QtdGCINGP0LLQu9GP0LXRgtGB0Y8g0LvQuCDQv9C10YDQtdC80LXQvdC90LDRjyDRjdC60LfQtdC80L/Qu9GP0YDQvtC8INC60LDQutC+0LPQvi3Qu9C40LHQvtC+INC60LvQsNGB0YHQsC5cbiAqXG4gKiBAcGFyYW0gdmFsIC0g0J/RgNC+0LLQtdGA0Y/QtdC80LDRjyDQv9C10YDQtdC80LXQvdC90LDRjy5cbiAqIEByZXR1cm5zINCg0LXQt9GD0LvRjNGC0LDRgiDQv9GA0L7QstC10YDQutC4LlxuICovXG5mdW5jdGlvbiBpc09iamVjdChvYmo6IGFueSk6IGJvb2xlYW4ge1xuICByZXR1cm4gKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBPYmplY3RdJylcbn1cblxuLyoqXG4gKiDQktC+0LfQstGA0LDRidCw0LXRgiDRgdC70YPRh9Cw0LnQvdC+0LUg0YbQtdC70L7QtSDRh9C40YHQu9C+INCyINC00LjQsNC/0LDQt9C+0L3QtTogWzAuLi5yYW5nZS0xXS5cbiAqXG4gKiBAcGFyYW0gcmFuZ2UgLSDQktC10YDRhdC90LjQuSDQv9GA0LXQtNC10Lsg0LTQuNCw0L/QsNC30L7QvdCwINGB0LvRg9GH0LDQudC90L7Qs9C+INCy0YvQsdC+0YDQsC5cbiAqIEByZXR1cm5zINCh0LvRg9GH0LDQudC90L7QtSDRh9C40YHQu9C+LlxuICovXG5mdW5jdGlvbiByYW5kb21JbnQocmFuZ2U6IG51bWJlcik6IG51bWJlciB7XG4gIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiByYW5nZSlcbn1cblxuLyoqXG4gKiDQn9GA0LXQvtCx0YDQsNC30YPQtdGCINC+0LHRitC10LrRgiDQsiDRgdGC0YDQvtC60YMgSlNPTi4g0JjQvNC10LXRgiDQvtGC0LvQuNGH0LjQtSDQvtGCINGB0YLQsNC90LTQsNGA0YLQvdC+0Lkg0YTRg9C90LrRhtC40LggSlNPTi5zdHJpbmdpZnkgLSDQv9C+0LvRjyDQvtCx0YrQtdC60YLQsCwg0LjQvNC10Y7RidC40LVcbiAqINC30L3QsNGH0LXQvdC40Y8g0YTRg9C90LrRhtC40Lkg0L3QtSDQv9GA0L7Qv9GD0YHQutCw0Y7RgtGB0Y8sINCwINC/0YDQtdC+0LHRgNCw0LfRg9GO0YLRgdGPINCyINC90LDQt9Cy0LDQvdC40LUg0YTRg9C90LrRhtC40LguXG4gKlxuICogQHBhcmFtIG9iaiAtINCm0LXQu9C10LLQvtC5INC+0LHRitC10LrRgi5cbiAqIEByZXR1cm5zINCh0YLRgNC+0LrQsCBKU09OLCDQvtGC0L7QsdGA0LDQttCw0Y7RidCw0Y8g0L7QsdGK0LXQutGCLlxuICovXG5mdW5jdGlvbiBqc29uU3RyaW5naWZ5KG9iajogYW55KTogc3RyaW5nIHtcbiAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KFxuICAgIG9iaixcbiAgICBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgcmV0dXJuICh0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpID8gdmFsdWUubmFtZSA6IHZhbHVlXG4gICAgfSxcbiAgICAnICdcbiAgKVxufVxuXG4vKipcbiAqINCi0LjQvyDRhNGD0L3QutGG0LjQuCwg0LLRi9GH0LjRgdC70Y/RjtGJ0LXQuSDQutC+0L7RgNC00LjQvdCw0YLRiyDQstC10YDRiNC40L0g0L/QvtC70LjQs9C+0L3QsCDQvtC/0YDQtdC00LXQu9C10L3QvdC+0Lkg0YTQvtGA0LzRiy5cbiAqXG4gKiBAcGFyYW0geCAtINCf0L7Qu9C+0LbQtdC90LjQtSDRhtC10L3RgtGA0LAg0L/QvtC70LjQs9C+0L3QsCDQvdCwINC+0YHQuCDQsNCx0YHRhtC40YHRgS5cbiAqIEBwYXJhbSB5IC0g0J/QvtC70L7QttC10L3QuNC1INGG0LXQvdGC0YDQsCDQv9C+0LvQuNCz0L7QvdCwINC90LAg0L7RgdC4INC+0YDQtNC40L3QsNGCLlxuICogQHBhcmFtIGNvbnN0cyAtINCd0LDQsdC+0YAg0LLRgdC/0L7QvNC+0LPQsNGC0LXQu9GM0L3Ri9GFINC60L7QvdGB0YLQsNC90YIsINC40YHQv9C+0LvRjNC30YPQtdC80YvRhSDQtNC70Y8g0LLRi9GH0LjRgdC70LXQvdC40Y8g0LLQtdGA0YjQuNC9LlxuICogQHJldHVybnMg0JTQsNC90L3Ri9C1INC+INCy0LXRgNGI0LjQvdCw0YUg0L/QvtC70LjQs9C+0L3QsC5cbiAqL1xudHlwZSBTUGxvdENhbGNTaGFwZUZ1bmMgPSAoeDogbnVtYmVyLCB5OiBudW1iZXIsIGNvbnN0czogQXJyYXk8YW55PikgPT4gU1Bsb3RQb2x5Z29uVmVydGljZXNcblxuLyoqXG4gKiDQotC40L8g0YbQstC10YLQsCDQsiBIRVgt0YTQvtGA0LzQsNGC0LUgKFwiI2ZmZmZmZlwiKS5cbiAqL1xudHlwZSBIRVhDb2xvciA9IHN0cmluZ1xuXG4vKipcbiAqINCi0LjQvyDRhNGD0L3QutGG0LjQuCDQuNGC0LXRgNC40YDQvtCy0LDQvdC40Y8g0LzQsNGB0YHQuNCy0LAg0LjRgdGF0L7QtNC90YvRhSDQvtCx0YrQtdC60YLQvtCyLiDQmtCw0LbQtNGL0Lkg0LLRi9C30L7QsiDRgtCw0LrQvtC5INGE0YPQvdC60YbQuNC4INC00L7Qu9C20LXQvSDQstC+0LfQstGA0LDRidCw0YLRjCDQuNC90YTQvtGA0LzQsNGG0LjRjiDQvtCxXG4gKiDQvtGH0LXRgNC10LTQvdC+0Lwg0L/QvtC70LjQs9C+0L3QtSwg0LrQvtGC0L7RgNGL0Lkg0L3QtdC+0LHRhdC+0LTQuNC80L4g0L7RgtC+0LHRgNCw0LfQuNGC0YwgKNC10LPQviDQutC+0L7RgNC00LjQvdCw0YLRiywg0YTQvtGA0LzRgyDQuCDRhtCy0LXRgikuINCa0L7Qs9C00LAg0LjRgdGF0L7QtNC90YvQtSDQvtCx0YrQtdC60YLRiyDQt9Cw0LrQvtC90YfQsNGC0YHRj1xuICog0YTRg9C90LrRhtC40Y8g0LTQvtC70LbQvdCwINCy0LXRgNC90YPRgtGMIG51bGwuXG4gKi9cbnR5cGUgU1Bsb3RJdGVyYXRpb25GdW5jdGlvbiA9ICgpID0+IFNQbG90UG9seWdvbiB8IG51bGxcblxuLyoqXG4gKiDQotC40L8g0LzQtdGB0YLQsCDQstGL0LLQvtC00LAg0YHQuNGB0YLQtdC80L3QvtC5INC40L3RhNC+0YDQvNCw0YbQuNC4INC/0YDQuCDQsNC60YLQuNCy0LjRgNC+0LLQsNC90L3QvtC8INGA0LXQttC40LzQtSDQvtGC0LvQsNC00LrQuCDQv9GA0LjQu9C+0LbQtdC90LjRjy5cbiAqINCX0L3QsNGH0LXQvdC40LUgXCJjb25zb2xlXCIg0YPRgdGC0LDQvdCw0LLQu9C40LLQsNC10YIg0LIg0LrQsNGH0LXRgdGC0LLQtSDQvNC10YHRgtCwINCy0YvQstC+0LTQsCDQutC+0L3RgdC+0LvRjCDQsdGA0LDRg9C30LXRgNCwLlxuICpcbiAqIEB0b2RvINCU0L7QsdCw0LLQuNGC0Ywg0LzQtdGB0YLQviDQstGL0LLQvtC00LAgLSBIVE1MINC00L7QutGD0LzQtdC90YIgKNC30L3QsNGH0LXQvdC40LUgXCJkb2N1bWVudFwiKVxuICogQHRvZG8g0JTQvtCx0LDQstC40YLRjCDQvNC10YHRgtC+INCy0YvQstC+0LTQsCAtINGE0LDQudC7ICjQt9C90LDRh9C10L3QuNC1IFwiZmlsZVwiKVxuICovXG50eXBlIFNQbG90RGVidWdPdXRwdXQgPSAnY29uc29sZSdcblxuLyoqXG4gKiDQotC40L8g0YjQtdC50LTQtdGA0LAgV2ViR0wuXG4gKiDQl9C90LDRh9C10L3QuNC1IFwiVkVSVEVYX1NIQURFUlwiINC30LDQtNCw0LXRgiDQstC10YDRiNC40L3QvdGL0Lkg0YjQtdC50LTQtdGALlxuICog0JfQvdCw0YfQtdC90LjQtSBcIkZSQUdNRU5UX1NIQURFUlwiINC30LDQtNCw0LXRgiDRhNGA0LDQs9C80LXQvdGC0L3Ri9C5INGI0LXQudC00LXRgC5cbiAqL1xudHlwZSBXZWJHbFNoYWRlclR5cGUgPSAnVkVSVEVYX1NIQURFUicgfCAnRlJBR01FTlRfU0hBREVSJ1xuXG4vKipcbiAqINCi0LjQvyDQsdGD0YTQtdGA0LAgV2ViR0wuXG4gKiDQl9C90LDRh9C10L3QuNC1IFwiQVJSQVlfQlVGRkVSXCIg0LfQsNC00LDQtdGCINCx0YPRhNC10YAg0YHQvtC00LXRgNC20LDRidC40Lkg0LLQtdGA0YjQuNC90L3Ri9C1INCw0YLRgNC40LHRg9GC0YsuXG4gKiDQl9C90LDRh9C10L3QuNC1IFwiRUxFTUVOVF9BUlJBWV9CVUZGRVJcIiDQt9Cw0LTQsNC10YIg0LHRg9GE0LXRgCDQuNGB0L/QvtC70YzQt9GD0Y7RidC40LnRgdGPINC00LvRjyDQuNC90LTQtdC60YHQuNGA0L7QstCw0L3QuNGPINGN0LvQtdC80LXQvdGC0L7Qsi5cbiAqL1xudHlwZSBXZWJHbEJ1ZmZlclR5cGUgPSAnQVJSQVlfQlVGRkVSJyB8ICdFTEVNRU5UX0FSUkFZX0JVRkZFUidcblxuLyoqXG4gKiDQotC40L8g0L/QtdGA0LXQvNC10L3QvdC+0LkgV2ViR0wuXG4gKiDQl9C90LDRh9C10L3QuNC1IFwidW5pZm9ybVwiINC30LDQtNCw0LXRgiDQvtCx0YnRg9GOINC00LvRjyDQstGB0LXRhSDQstC10YDRiNC40L3QvdGL0YUg0YjQtdC50LTQtdGA0L7QsiDQv9C10YDQtdC80LXQvdC90YPRji5cbiAqINCX0L3QsNGH0LXQvdC40LUgXCJhdHRyaWJ1dGVcIiDQt9Cw0LTQsNC10YIg0YPQvdC40LrQsNC70YzQvdGD0Y4g0L/QtdGA0LXQvNC10L3QvdGD0Y4g0LTQu9GPINC60LDQttC00L7Qs9C+INCy0LXRgNGI0LjQvdC90L7Qs9C+INGI0LXQudC00LXRgNCwLlxuICog0JfQvdCw0YfQtdC90LjQtSBcInZhcnlpbmdcIiDQt9Cw0LTQsNC10YIg0YPQvdC40LrQsNC70YzQvdGD0Y4g0L/QtdGA0LXQvNC10L3QvdGD0Y4g0YEg0L7QsdGJ0LXQuSDQvtCx0LvQsNGB0YLRjNGOINCy0LjQtNC40LzQvtGB0YLQuCDQtNC70Y8g0LLQtdGA0YjQuNC90L3QvtCz0L4g0Lgg0YTRgNCw0LPQvNC10L3RgtC90L7Qs9C+INGI0LXQudC00LXRgNC+0LIuXG4gKi9cbnR5cGUgV2ViR2xWYXJpYWJsZVR5cGUgPSAndW5pZm9ybScgfCAnYXR0cmlidXRlJyB8ICd2YXJ5aW5nJ1xuXG4vKipcbiAqINCi0LjQvyDQvNCw0YHRgdC40LLQsCDQtNCw0L3QvdGL0YUsINC30LDQvdC40LzQsNGO0YnQuNGFINCyINC/0LDQvNGP0YLQuCDQvdC10L/RgNC10YDRi9Cy0L3Ri9C5INC+0LHRitC10LwuXG4gKi9cbnR5cGUgVHlwZWRBcnJheSA9IEludDhBcnJheSB8IEludDE2QXJyYXkgfCBJbnQzMkFycmF5IHwgVWludDhBcnJheSB8XG4gIFVpbnQxNkFycmF5IHwgVWludDMyQXJyYXkgfCBGbG9hdDMyQXJyYXkgfCBGbG9hdDY0QXJyYXlcblxuLyoqXG4gKiDQotC40L8g0LTQu9GPINC90LDRgdGC0YDQvtC10Log0L/RgNC40LvQvtC20LXQvdC40Y8uXG4gKlxuICogQHBhcmFtIGl0ZXJhdGlvbkNhbGxiYWNrIC0g0KTRg9C90LrRhtC40Y8g0LjRgtC10YDQuNGA0L7QstCw0L3QuNGPINC40YHRhdC+0LTQvdGL0YUg0L7QsdGK0LXQutGC0L7Qsi5cbiAqIEBwYXJhbSBwb2x5Z29uUGFsZXR0ZSAtINCm0LLQtdGC0L7QstCw0Y8g0L/QsNC70LjRgtGA0LAg0L/QvtC70LjQs9C+0L3QvtCyLlxuICogQHBhcmFtIGdyaWRTaXplIC0g0KDQsNC30LzQtdGAINC60L7QvtGA0LTQuNC90LDRgtC90L7QuSDQv9C70L7RgdC60L7RgdGC0Lgg0LIg0L/QuNC60YHQtdC70Y/RhS5cbiAqIEBwYXJhbSBwb2x5Z29uU2l6ZSAtINCg0LDQt9C80LXRgCDQv9C+0LvQuNCz0L7QvdCwINC90LAg0LPRgNCw0YTQuNC60LUg0LIg0L/QuNC60YHQtdC70Y/RhSAo0YHRgtC+0YDQvtC90LAg0LTQu9GPINC60LLQsNC00YDQsNGC0LAsINC00LjQsNC80LXRgtGAINC00LvRjyDQutGA0YPQs9CwINC4INGCLtC/LilcbiAqIEBwYXJhbSBjaXJjbGVBcHByb3hMZXZlbCAtINCh0YLQtdC/0LXQvdGMINC00LXRgtCw0LvQuNC30LDRhtC40Lgg0LrRgNGD0LPQsCAtINC60L7Qu9C40YfQtdGB0YLQstC+INGD0LPQu9C+0LIg0L/QvtC70LjQs9C+0L3QsCwg0LDQv9GA0L7QutGB0LjQvNC40YDRg9GO0YnQtdCz0L4g0L7QutGA0YPQttC90L7RgdGC0Ywg0LrRgNGD0LPQsC5cbiAqIEBwYXJhbSBkZWJ1Z01vZGUgLSDQn9Cw0YDQsNC80LXRgtGA0Ysg0YDQtdC20LjQvNCwINC+0YLQu9Cw0LTQutC4INC/0YDQuNC70L7QttC10L3QuNGPLlxuICogQHBhcmFtIGRlbW9Nb2RlIC0g0J/QsNGA0LDQvNC10YLRgNGLINGA0LXQttC40LzQsCDQuNGB0L/QvtC70YzQt9C+0LLQsNC90LjRjyDQtNC10LzQvtC90YHRgtGA0LDRhtC40L7QvdC90YvRhSDQtNCw0L3QvdGL0YUuXG4gKiBAcGFyYW0gZm9yY2VSdW4gLSDQn9GA0LjQt9C90LDQuiDRgtC+0LPQviwg0YfRgtC+INGA0LXQvdC00LXRgNC40L3QsyDQvdC10L7QsdGF0L7QtNC40LzQviDQvdCw0YfQsNGC0Ywg0YHRgNCw0LfRgyDQv9C+0YHQu9C1INC30LDQtNCw0L3QuNGPINC90LDRgdGC0YDQvtC10Log0Y3QutC30LXQvNC/0LvRj9GA0LAgKNC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOXG4gKiAgICAg0YDQtdC90LTQtdGA0LjQvdCzINC30LDQv9GD0YHQutCw0LXRgtGB0Y8g0YLQvtC70YzQutC+INC/0L7RgdC70LUg0LLRi9C30L7QstCwINC80LXRgtC+0LTQsCBzdGFydCkuXG4gKiBAcGFyYW0gbWF4QW1vdW50T2ZQb2x5Z29ucyAtINCY0YHQutGD0YHRgdGC0LLQtdC90L3QvtC1INC+0LPRgNCw0L3QuNGH0LXQvdC40LUg0LrQvtC70LjRh9C10YHRgtCy0LAg0L7RgtC+0LHRgNCw0LbQsNC10LzRi9GFINC/0L7Qu9C40LPQvtC90L7Qsi4g0J/RgNC4INC00L7RgdGC0LjQttC10L3QuNC4INGN0YLQvtCz0L4g0YfQuNGB0LvQsFxuICogICAgINC40YLQtdGA0LjRgNC+0LLQsNC90LjQtSDQuNGB0YXQvtC00L3Ri9GFINC+0LHRitC10LrRgtC+0LIg0L/RgNC10YDRi9Cy0LDQtdGC0YHRjywg0LTQsNC20LUg0LXRgdC70Lgg0L7QsdGA0LDQsdC+0YLQsNC90Ysg0L3QtSDQstGB0LUg0L7QsdGK0LXQutGC0YsuXG4gKiBAcGFyYW0gYmdDb2xvciAtINCk0L7QvdC+0LLRi9C5INGG0LLQtdGCINC60LDQvdCy0LDRgdCwLlxuICogQHBhcmFtIHJ1bGVzQ29sb3IgLSDQptCy0LXRgiDQvdCw0L/RgNCw0LLQu9GP0Y7RidC40YUuXG4gKiBAcGFyYW0gY2FtZXJhIC0g0J/QvtC70L7QttC10L3QuNC1INC60L7QvtGA0LTQuNC90LDRgtC90L7QuSDQv9C70L7RgdC60L7RgdGC0Lgg0LIg0L7QsdC70LDRgdGC0Lgg0L/RgNC+0YHQvNC+0YLRgNCwLlxuICogQHBhcmFtIHdlYkdsU2V0dGluZ3MgLSDQmNC90LjRhtC40LDQu9C40LfQuNGA0YPRjtGJ0LjQtSDQvdCw0YHRgtGA0L7QudC60Lgg0LrQvtC90YLQtdC60YHRgtCwINGA0LXQvdC00LXRgNC40L3Qs9CwIFdlYkdMLlxuICovXG5pbnRlcmZhY2UgU1Bsb3RPcHRpb25zIHtcbiAgaXRlcmF0aW9uQ2FsbGJhY2s/OiBTUGxvdEl0ZXJhdGlvbkZ1bmN0aW9uLFxuICBwb2x5Z29uUGFsZXR0ZT86IEhFWENvbG9yW10sXG4gIGdyaWRTaXplPzogU1Bsb3RHcmlkU2l6ZSxcbiAgcG9seWdvblNpemU/OiBudW1iZXIsXG4gIGNpcmNsZUFwcHJveExldmVsPzogbnVtYmVyLFxuICBkZWJ1Z01vZGU/OiBTUGxvdERlYnVnTW9kZSxcbiAgZGVtb01vZGU/OiBTUGxvdERlbW9Nb2RlLFxuICBmb3JjZVJ1bj86IGJvb2xlYW4sXG4gIG1heEFtb3VudE9mUG9seWdvbnM/OiBudW1iZXIsXG4gIGJnQ29sb3I/OiBIRVhDb2xvcixcbiAgcnVsZXNDb2xvcj86IEhFWENvbG9yLFxuICBjYW1lcmE/OiBTUGxvdENhbWVyYSxcbiAgd2ViR2xTZXR0aW5ncz86IFdlYkdMQ29udGV4dEF0dHJpYnV0ZXNcbn1cblxuLyoqXG4gKiDQotC40L8g0LTQu9GPINC40L3RhNC+0YDQvNCw0YbQuNC4INC+INC/0L7Qu9C40LPQvtC90LUuINCh0L7QtNC10YDQttC40YIg0LTQsNC90L3Ri9C1LCDQvdC10L7QsdGF0L7QtNC40LzRi9C1INC00LvRjyDQtNC+0LHQsNCy0LvQtdC90LjRjyDQv9C+0LvQuNCz0L7QvdCwINCyINCz0YDRg9C/0L/RgyDQv9C+0LvQuNCz0L7QvdC+0LIuINCf0L7Qu9C40LPQvtC9IC0g0Y3RgtC+XG4gKiDRgdC/0LvQvtGI0L3QsNGPINGE0LjQs9GD0YDQsCDQvdCwINC60L7QvtGA0LTQuNC90LDRgtC90L7QuSDQv9C70L7RgdC60L7RgdGC0LgsINC+0LTQvdC+0LfQvdCw0YfQvdC+INC/0YDQtdC00YHRgtCw0LLQu9GP0Y7RidCw0Y8g0L7QtNC40L0g0LjRgdGF0L7QtNC90YvQuSDQvtCx0YrQtdC60YIuXG4gKlxuICogQHBhcmFtIHggLSDQmtC+0L7RgNC00LjQvdCw0YLQsCDRhtC10L3RgtGA0LAg0L/QvtC70LjQs9C+0L3QsCDQvdCwINC+0YHQuCDQsNCx0YHRhtC40YHRgS4g0JzQvtC20LXRgiDQsdGL0YLRjCDQutCw0Log0YbQtdC70YvQvCwg0YLQsNC6INC4INCy0LXRidC10YHRgtCy0LXQvdC90YvQvCDRh9C40YHQu9C+0LwuXG4gKiBAcGFyYW0geSAtINCa0L7QvtGA0LTQuNC90LDRgtCwINGG0LXQvdGC0YDQsCDQv9C+0LvQuNCz0L7QvdCwINC90LAg0L7RgdC4INC+0YDQtNC40L3QsNGCLiDQnNC+0LbQtdGCINCx0YvRgtGMINC60LDQuiDRhtC10LvRi9C8LCDRgtCw0Log0Lgg0LLQtdGJ0LXRgdGC0LLQtdC90L3Ri9C8INGH0LjRgdC70L7QvC5cbiAqIEBwYXJhbSBzaGFwZSAtINCk0L7RgNC80LAg0L/QvtC70LjQs9C+0L3QsC4g0KTQvtGA0LzQsCAtINGN0YLQviDQuNC90LTQtdC60YEg0LIg0LzQsNGB0YHQuNCy0LUg0YTQvtGA0Lwge0BsaW5rIHNoYXBlc30uINCe0YHQvdC+0LLQvdGL0LUg0YTQvtGA0LzRizogMCAtINGC0YDQtdGD0LPQvtC70YzQvdC40LosIDEgLVxuICogICAgINC60LLQsNC00YDQsNGCLCAyIC0g0LrRgNGD0LMuXG4gKiBAcGFyYW0gY29sb3IgLSDQptCy0LXRgiDQv9C+0LvQuNCz0L7QvdCwLiDQptCy0LXRgiAtINGN0YLQviDQuNC90LTQtdC60YEg0LIg0LTQuNCw0L/QsNC30L7QvdC1INC+0YIgMCDQtNC+IDI1NSwg0L/RgNC10LTRgdGC0LDQstC70Y/RjtGJ0LjQuSDRgdC+0LHQvtC5INC40L3QtNC10LrRgSDRhtCy0LXRgtCwINCyXG4gKiAgICAg0L/RgNC10LTQvtC/0YDQtdC00LXQu9C10L3QvdC+0Lwg0LzQsNGB0YHQuNCy0LUg0YbQstC10YLQvtCyIHtAbGluayBwb2x5Z29uUGFsZXR0ZX0uXG4gKi9cbmludGVyZmFjZSBTUGxvdFBvbHlnb24ge1xuICB4OiBudW1iZXIsXG4gIHk6IG51bWJlcixcbiAgc2hhcGU6IG51bWJlcixcbiAgY29sb3I6IG51bWJlclxufVxuXG4vKipcbiAqINCi0LjQvyDQtNC70Y8g0YDQsNC30LzQtdGA0LAg0LrQvtC+0YDQtNC40L3QsNGC0L3QvtC5INC/0LvQvtGB0LrQvtGB0YLQuC5cbiAqXG4gKiBAcGFyYW0gd2lkdGggLSDQqNC40YDQuNC90LAg0LrQvtC+0YDQtNC40L3QsNGC0L3QvtC5INC/0LvQvtGB0LrQvtGB0YLQuCDQsiDQv9C40LrRgdC10LvRj9GFLlxuICogQHBhcmFtIGhlaWdodCAtINCS0YvRgdC+0YLQsCDQutC+0L7RgNC00LjQvdCw0YLQvdC+0L7QuSDQv9C70L7RgdC60L7RgdGC0Lgg0LIg0L/QuNC60YHQtdC70Y/RhS5cbiAqL1xuaW50ZXJmYWNlIFNQbG90R3JpZFNpemUge1xuICB3aWR0aDogbnVtYmVyLFxuICBoZWlnaHQ6IG51bWJlclxufVxuXG4vKipcbiAqINCi0LjQvyDQtNC70Y8g0L/QsNGA0LDQvNC10YLRgNC+0LIg0YDQtdC20LjQvNCwINC+0YLQu9Cw0LTQutC4LlxuICpcbiAqIEBwYXJhbSBpc0VuYWJsZSAtINCf0YDQuNC30L3QsNC6INCy0LrQu9GO0YfQtdC90LjRjyDQvtGC0LvQsNC00L7Rh9C90L7Qs9C+INGA0LXQttC40LzQsC5cbiAqIEBwYXJhbSBvdXRwdXQgLSDQnNC10YHRgtC+INCy0YvQstC+0LTQsCDQvtGC0LvQsNC00L7Rh9C90L7QuSDQuNC90YTQvtGA0LzQsNGG0LjQuC5cbiAqIEBwYXJhbSBoZWFkZXJTdHlsZSAtINCh0YLQuNC70Ywg0LTQu9GPINC30LDQs9C+0LvQvtCy0LrQsCDQstGB0LXQs9C+INC+0YLQu9Cw0LTQvtGH0L3QvtCz0L4g0LHQu9C+0LrQsC5cbiAqIEBwYXJhbSBncm91cFN0eWxlIC0g0KHRgtC40LvRjCDQtNC70Y8g0LfQsNCz0L7Qu9C+0LLQutCwINCz0YDRg9C/0L/QuNGA0L7QstC60Lgg0L7RgtC70LDQtNC+0YfQvdGL0YUg0LTQsNC90L3Ri9GFLlxuICovXG5pbnRlcmZhY2UgU1Bsb3REZWJ1Z01vZGUge1xuICBpc0VuYWJsZT86IGJvb2xlYW4sXG4gIG91dHB1dD86IFNQbG90RGVidWdPdXRwdXQsXG4gIGhlYWRlclN0eWxlPzogc3RyaW5nLFxuICBncm91cFN0eWxlPzogc3RyaW5nXG59XG5cbi8qKlxuICog0KLQuNC/INC00LvRjyDQv9Cw0YDQsNC80LXRgtGA0L7QsiDRgNC10LbQuNC80LAg0L7RgtC+0LHRgNCw0LbQtdC90LjRjyDQtNC10LzQvtC90YHRgtGA0LDRhtC40L7QvdC90YvRhSDQtNCw0L3QvdGL0YUuXG4gKlxuICogQHBhcmFtIGlzRW5hYmxlIC0g0J/RgNC40LfQvdCw0Log0LLQutC70Y7Rh9C10L3QuNGPINC00LXQvNC+LdGA0LXQttC40LzQsC4g0JIg0Y3RgtC+0Lwg0YDQtdC20LjQvNC1INC/0YDQuNC70L7QttC10L3QuNC1INCy0LzQtdGB0YLQviDQstC90LXRiNC90LXQuSDRhNGD0L3QutGG0LjQuCDQuNGC0LXRgNC40YDQvtCy0LDQvdC40Y9cbiAqICAgICDQuNGB0YXQvtC00L3Ri9GFINC+0LHRitC10LrRgtC+0LIg0LjRgdC/0L7Qu9GM0LfRg9C10YIg0LLQvdGD0YLRgNC10L3QvdC40Lkg0LzQtdGC0L7QtCwg0LjQvNC40YLQuNGA0YPRjtGJ0LjQuSDQuNGC0LXRgNC40YDQvtCy0LDQvdC40LUuXG4gKiBAcGFyYW0gYW1vdW50IC0g0JrQvtC70LjRh9C10YHRgtCy0L4g0LjQvNC40YLQuNGA0YPQtdC80YvRhSDQuNGB0YXQvtC00L3Ri9GFINC+0LHRitC10LrRgtC+0LIuXG4gKiBAcGFyYW0gc2hhcGVRdW90YSAtINCn0LDRgdGC0L7RgtCwINC/0L7Rj9Cy0LvQtdC90LjRjyDQsiDQuNGC0LXRgNC40YDQvtCy0LDQvdC40Lgg0YDQsNC30LvQuNGH0L3Ri9GFINGE0L7RgNC8INC/0L7Qu9C40LPQvtC90L7QsiAtINGC0YDQtdGD0LPQvtC70YzQvdC40LrQvtCyWzBdLCDQutCy0LDQtNGA0LDRgtC+0LJbMV0sXG4gKiAgICAg0LrRgNGD0LPQvtCyWzJdINC4INGCLtC0LiDQn9GA0LjQvNC10YA6INC80LDRgdGB0LjQsiBbMywgMiwgNV0g0L7Qt9C90LDRh9Cw0LXRgiwg0YfRgtC+INGH0LDRgdGC0L7RgtCwINC/0L7Rj9Cy0LvQtdC90LjRjyDRgtGA0LXRg9Cz0L7Qu9GM0L3QuNC60L7QsiA9IDMvKDMrMis1KSA9IDMvMTAsXG4gKiAgICAg0YfQsNGB0YLQvtGC0LAg0L/QvtGP0LLQu9C10L3QuNGPINC60LLQsNC00YDQsNGC0L7QsiA9IDIvKDMrMis1KSA9IDIvMTAsINGH0LDRgdGC0L7RgtCwINC/0L7Rj9Cy0LvQtdC90LjRjyDQutGA0YPQs9C+0LIgPSA1LygzKzIrNSkgPSA1LzEwLlxuICogQHBhcmFtIGluZGV4IC0g0J/QsNGA0LDQvNC10YLRgCDQuNGB0L/QvtC70YzQt9GD0LXQvNGL0Lkg0LTQu9GPINC40LzQuNGC0LDRhtC40Lgg0LjRgtC10YDQuNGA0L7QstCw0L3QuNGPLiDQl9Cw0LTQsNC90LjRjyDQv9C+0LvRjNC30L7QstCw0YLQtdC70YzRgdC60L7Qs9C+INC30L3QsNGH0LXQvdC40Y8g0L3QtSDRgtGA0LXQsdGD0LXRgi5cbiAqL1xuaW50ZXJmYWNlIFNQbG90RGVtb01vZGUge1xuICBpc0VuYWJsZT86IGJvb2xlYW4sXG4gIGFtb3VudD86IG51bWJlcixcbiAgc2hhcGVRdW90YT86IG51bWJlcltdLFxuICBpbmRleD86IG51bWJlclxufVxuXG4vKipcbiAqINCi0LjQvyDQtNC70Y8g0L/QvtC70L7QttC10L3QuNGPINC60L7QvtGA0LTQuNC90LDRgtC90L7QuSDQv9C70L7RgdC60L7RgdGC0Lgg0LIg0L7QsdC70LDRgdGC0Lgg0L/RgNC+0YHQvNC+0YLRgNCwLlxuICpcbiAqIEBwYXJhbSB4IC0g0JrQvtC+0YDQtNC40L3QsNGC0LAg0LPRgNCw0YTQuNC60LAg0L3QsCDQvtGB0Lgg0LDQsdGB0YbQuNGB0YEuXG4gKiBAcGFyYW0geSAtINCa0L7QvtGA0LTQuNC90LDRgtCwINCz0YDQsNGE0LjQutCwINC90LAg0L7RgdC4INC+0YDQtNC40L3QsNGCLlxuICogQHBhcmFtIHpvb20gLSDQodGC0LXQv9C10L3RjCBcItC/0YDQuNCx0LvQuNC20LXQvdC40Y9cIiDQvdCw0LHQu9GO0LTQsNGC0LXQu9GPINC6INCz0YDQsNGE0LjQutGDICjQvNCw0YHRiNGC0LDQsSDQutC+0L7QtNGA0LjQvdCw0YLQvdC+0Lkg0L/Qu9C+0YHQutC+0YHRgtC4INCyINC+0LHQu9Cw0YHRgtC4INC/0YDQvtGB0LzQvtGC0YDQsCkuXG4gKi9cbmludGVyZmFjZSBTUGxvdENhbWVyYSB7XG4gIHg/OiBudW1iZXIsXG4gIHk/OiBudW1iZXIsXG4gIHpvb20/OiBudW1iZXJcbn1cblxuXG5cblxuLyoqXG4gKiDQotC40L8g0LTQu9GPINGC0YDQsNC90YHRhNC+0YDQvNCw0YbQuNC4LiDQodC+0LTQtdGA0LbQuNGCINCy0YHRjiDRgtC10YXQvdC40YfQtdGB0LrRg9GOINC40L3RhNC+0YDQvNCw0YbQuNGOLCDQvdC10L7QsdGF0L7QtNC40LzRg9GOINC00LvRjyDRgNCw0YHRgdGH0LXRgtCwINGC0LXQutGD0YnQtdCz0L4g0L/QvtC70L7QttC10L3QuNGPINC60L7QvtGA0LTQuNC90LDRgtC90L7QuVxuICog0L/Qu9C+0YHQutC+0YHRgtC4INCyINC+0LHQu9Cw0YHRgtC4INC/0YDQvtGB0LzQvtGC0YDQsCDQstC+INCy0YDQtdC80Y8g0YHQvtCx0YvRgtC40Lkg0L/QtdGA0LXQvNC10YnQtdC90LjRjyDQuCDQt9GD0LzQuNGA0L7QstCw0L3QuNGPINC60LDQvdCy0LDRgdCwLlxuICpcbiAqIEBwYXJhbSB2aWV3UHJvamVjdGlvbk1hdCAtINCe0YHQvdC+0LLQvdCw0Y8g0LzQsNGC0YDQuNGG0LAg0YLRgNCw0L3RgdGE0L7RgNC80LDRhtC40LggM3gzINCyINCy0LjQtNC1INC+0LTQvdC+0LzQtdGA0L3QvtCz0L4g0LzQsNGB0YHQuNCy0LAg0LjQtyA5INGN0LvQtdC80LXQvdGC0L7Qsi5cbiAqIEBwYXJhbSBzdGFydEludlZpZXdQcm9qTWF0IC0g0JLRgdC/0L7QvNC+0LPQsNGC0LXQu9GM0L3QsNGPINC80LDRgtGA0LjRhtCwINGC0YDQsNC90YHRhNC+0YDQvNCw0YbQuNC4LlxuICogQHBhcmFtIHN0YXJ0Q2FtZXJhWCAtINCS0YHQv9C+0LzQvtCz0LDRgtC10LvRjNC90LDRjyDRgtC+0YfQutCwINGC0YDQsNC90YHRhNC+0YDQvNCw0YbQuNC4LlxuICogQHBhcmFtIHN0YXJ0Q2FtZXJhWSAtINCS0YHQv9C+0LzQvtCz0LDRgtC10LvRjNC90LDRjyDRgtC+0YfQutCwINGC0YDQsNC90YHRhNC+0YDQvNCw0YbQuNC4LlxuICogQHBhcmFtIHN0YXJ0UG9zWCAtINCS0YHQv9C+0LzQvtCz0LDRgtC10LvRjNC90LDRjyDRgtC+0YfQutCwINGC0YDQsNC90YHRhNC+0YDQvNCw0YbQuNC4LlxuICogQHBhcmFtIHN0YXJ0UG9zWSAtINCS0YHQv9C+0LzQvtCz0LDRgtC10LvRjNC90LDRjyDRgtC+0YfQutCwINGC0YDQsNC90YHRhNC+0YDQvNCw0YbQuNC4LlxuICovXG5pbnRlcmZhY2UgU1Bsb3RUcmFuc2Zvcm1hdGlvbiB7XG4gIHZpZXdQcm9qZWN0aW9uTWF0OiBudW1iZXJbXSxcbiAgc3RhcnRJbnZWaWV3UHJvak1hdDogbnVtYmVyW10sXG4gIHN0YXJ0Q2FtZXJhOiBTUGxvdENhbWVyYSxcbiAgc3RhcnRQb3M6IG51bWJlcltdLFxuICBzdGFydENsaXBQb3M6IG51bWJlcltdLFxuICBzdGFydE1vdXNlUG9zOiBudW1iZXJbXVxufVxuXG5cblxuXG4vKipcbiAqINCi0LjQvyDQtNC70Y8g0LjQvdGE0L7RgNC80LDRhtC40Lgg0L4g0LHRg9GE0LXRgNCw0YUsINGE0L7RgNC80LjRgNGD0Y7RidC40YUg0LTQsNC90L3Ri9C1INC00LvRjyDQt9Cw0LPRgNGD0LfQutC4INCyINCy0LjQtNC10L7Qv9Cw0LzRj9GC0YwuXG4gKlxuICogQHBhcmFtIHZlcnRleEJ1ZmZlcnMgLSDQnNCw0YHRgdC40LIg0LHRg9GE0LXRgNC+0LIg0YEg0LjQvdGE0L7RgNC80LDRhtC40LXQuSDQviDQstC10YDRiNC40L3QsNGFINC/0L7Qu9C40LPQvtC90L7Qsi5cbiAqIEBwYXJhbSBjb2xvckJ1ZmZlcnMgLSDQnNCw0YHRgdC40LIg0LHRg9GE0LXRgNC+0LIg0YEg0LjQvdGE0L7RgNC80LDRhtC40LXQuSDQviDRhtCy0LXRgtCw0YUg0LLQtdGA0YjQuNC9INC/0L7Qu9C40LPQvtC90L7Qsi5cbiAqIEBwYXJhbSBpbmRleEJ1ZmZlcnMgLSDQnNCw0YHRgdC40LIg0LHRg9GE0LXRgNC+0LIg0YEg0LjQvdC00LXQutGB0LDQvNC4INCy0LXRgNGI0LjQvSDQv9C+0LvQuNCz0L7QvdC+0LIuXG4gKiBAcGFyYW0gYW1vdW50T2ZCdWZmZXJHcm91cHMgLSDQmtC+0LvQuNGH0LXRgdGC0LLQviDQsdGD0YTQtdGA0L3Ri9GFINCz0YDRg9C/0L8g0LIg0LzQsNGB0YHQuNCy0LUuINCS0YHQtSDRg9C60LDQt9Cw0L3QvdGL0LUg0LLRi9GI0LUg0LzQsNGB0YHQuNCy0Ysg0LHRg9GE0LXRgNC+0LIg0YHQvtC00LXRgNC20LDRglxuICogICAgINC+0LTQuNC90LDQutC+0LLQvtC1INC60L7Qu9C40YfQtdGB0YLQstC+INCx0YPRhNC10YDQvtCyLlxuICogQHBhcmFtIGFtb3VudE9mR0xWZXJ0aWNlcyAtINCa0L7Qu9C40YfQtdGB0YLQstC+INCy0LXRgNGI0LjQvSwg0L7QsdGA0LDQt9GD0Y7RidC40YUgR0wt0YLRgNC10YPQs9C+0LvRjNC90LjQutC4INC60LDQttC00L7Qs9C+INCy0LXRgNGI0LjQvdC90L7Qs9C+INCx0YPRhNC10YDQsC5cbiAqIEBwYXJhbSBhbW91bnRPZlNoYXBlcyAtINCa0L7Qu9C40YfQtdGB0YLQstC+INC/0L7Qu9C40LPQvtC90L7QsiDQutCw0LbQtNC+0Lkg0YTQvtGA0LzRiyAo0YHQutC+0LvRjNC60L4g0YLRgNC10YPQs9C+0LvRjNC90LjQutC+0LIsINC60LLQsNC00YDQsNGC0L7Qsiwg0LrRgNGD0LPQvtCyINC4INGCLtC0LikuXG4gKiBAcGFyYW0gYW1vdW50T2ZUb3RhbFZlcnRpY2VzIC0g0J7QsdGJ0LXQtSDQutC+0LvQuNGH0LXRgdGC0LLQviDQstC10YDRiNC40L0g0LLRgdC10YUg0LLQtdGA0YjQuNC90L3Ri9GFINCx0YPRhNC10YDQvtCyICh2ZXJ0ZXhCdWZmZXJzKS5cbiAqIEBwYXJhbSBhbW91bnRPZlRvdGFsR0xWZXJ0aWNlcyAtINCe0LHRidC10LUg0LrQvtC70LjRh9C10YHRgtCy0L4g0LLQtdGA0YjQuNC9INCy0YHQtdGFINC40L3QtNC10LrRgdC90YvRhSDQsdGD0YTQtdGA0L7QsiAoaW5kZXhCdWZmZXJzKS5cbiAqIEBwYXJhbSBzaXplSW5CeXRlcyAtINCg0LDQt9C80LXRgNGLINCx0YPRhNC10YDQvtCyINC60LDQttC00L7Qs9C+INGC0LjQv9CwICjQtNC70Y8g0LLQtdGA0YjQuNC9LCDQtNC70Y8g0YbQstC10YLQvtCyLCDQtNC70Y8g0LjQvdC00LXQutGB0L7Qsikg0LIg0LHQsNC50YLQsNGFLlxuICovXG5pbnRlcmZhY2UgU1Bsb3RCdWZmZXJzIHtcbiAgdmVydGV4QnVmZmVyczogV2ViR0xCdWZmZXJbXSxcbiAgY29sb3JCdWZmZXJzOiBXZWJHTEJ1ZmZlcltdLFxuICBpbmRleEJ1ZmZlcnM6IFdlYkdMQnVmZmVyW10sXG4gIGFtb3VudE9mQnVmZmVyR3JvdXBzOiBudW1iZXIsXG4gIGFtb3VudE9mR0xWZXJ0aWNlczogbnVtYmVyW10sXG4gIGFtb3VudE9mU2hhcGVzOiBudW1iZXJbXSxcbiAgYW1vdW50T2ZUb3RhbFZlcnRpY2VzOiBudW1iZXIsXG4gIGFtb3VudE9mVG90YWxHTFZlcnRpY2VzOiBudW1iZXIsXG4gIHNpemVJbkJ5dGVzOiBudW1iZXJbXVxufVxuXG4vKipcbiAqINCi0LjQvyDQtNC70Y8g0LjQvdGE0L7RgNC80LDRhtC40Lgg0L4g0LPRgNGD0L/Qv9C1INC/0L7Qu9C40LPQvtC90L7Qsiwg0LrQvtGC0L7RgNGD0Y4g0LzQvtC20L3QviDQvtGC0L7QsdGA0LDQt9C40YLRjCDQvdCwINC60LDQvdCy0LDRgdC1INC30LAg0L7QtNC40L0g0LLRi9C30L7QsiDRhNGD0L3QutGG0LjQuCB7QGxpbmsgZHJhd0VsZW1lbnRzfS5cbiAqXG4gKiBAcGFyYW0gdmVydGljZXMgLSDQnNCw0YHRgdC40LIg0LLQtdGA0YjQuNC9INCy0YHQtdGFINC/0L7Qu9C40LPQvtC90L7QsiDQs9GA0YPQv9C/0YsuINCa0LDQttC00LDRjyDQstC10YDRiNC40L3QsCAtINGN0YLQviDQv9Cw0YDQsCDRh9C40YHQtdC7ICjQutC+0L7RgNC00LjQvdCw0YLRiyDQstC10YDRiNC40L3RiyDQvdCwXG4gKiAgICAg0L/Qu9C+0YHQutC+0YHRgtC4KS4g0JrQvtC+0YDQtNC40L3QsNGC0Ysg0LzQvtCz0YPRgiDQsdGL0YLRjCDQutCw0Log0YbQtdC70YvQvNC4LCDRgtCw0Log0Lgg0LLQtdGJ0LXRgdGC0LLQtdC90L3Ri9C80Lgg0YfQuNGB0LvQsNC80LguXG4gKiBAcGFyYW0gaW5kaWNlcyAtINCc0LDRgdGB0LjQsiDQuNC90LTQtdC60YHQvtCyINCy0LXRgNGI0LjQvSDQv9C+0LvQuNCz0L7QvdC+0LIg0LPRgNGD0L/Qv9GLLiDQmtCw0LbQtNGL0Lkg0LjQvdC00LXQutGBIC0g0Y3RgtC+INC90L7QvNC10YAg0LLQtdGA0YjQuNC90Ysg0LIg0LzQsNGB0YHQuNCy0LUg0LLQtdGA0YjQuNC9LiDQmNC90LTQtdC60YHRi1xuICogICAgINC+0L/QuNGB0YvQstCw0Y7RgiDQstGB0LUgR0wt0YLRgNC10YPQs9C+0LvRjNC90LjQutC4LCDQuNC3INC60L7RgtC+0YDRi9GFINGB0L7RgdGC0L7Rj9GCINC/0L7Qu9C40LPQvtC90Ysg0LPRgNGD0L/Qv9GLLCDRgi7Qvi4g0LrQsNC20LTQsNGPINGC0YDQvtC50LrQsCDQuNC90LTQtdC60YHQvtCyINC60L7QtNC40YDRg9C10YIg0L7QtNC40L1cbiAqICAgICBHTC3RgtGA0LXRg9Cz0L7Qu9GM0L3QuNC6LiDQmNC90LTQtdC60YHRiyAtINGN0YLQviDRhtC10LvRi9C1INGH0LjRgdC70LAg0LIg0LTQuNCw0L/QsNC30L7QvdC1INC+0YIgMCDQtNC+IDY1NTM1LCDRh9GC0L4g0L3QsNC60LvQsNC00YvQstCw0LXRgiDQvtCz0YDQsNC90LjRh9C10L3QuNC1INC90LAg0LzQsNC60YHQuNC80LDQu9GM0L3QvtC1XG4gKiAgICAg0LrQvtC70LjRh9C10YHRgtCy0L4g0LLQtdGA0YjQuNC9LCDRhdGA0LDQvdC40LzRi9GFINCyINCz0YDRg9C/0L/QtSDQv9C+0LvQuNCz0L7QvdC+0LIgKNC90LUg0LHQvtC70LXQtSAzMjc2OCDRiNGC0YPQuikuXG4gKiBAcGFyYW0gY29sb3JzIC0g0JzQsNGB0YHQuNCyINGG0LLQtdGC0L7QsiDQstC10YDRiNC40L0g0L/QvtC70LjQs9C+0L3QvtCyINCz0YDRg9C/0L/Riy4g0JrQsNC20LTQvtC1INGH0LjRgdC70L4g0LfQsNC00LDQtdGCINGG0LLQtdGCINC+0LTQvdC+0Lkg0LLQtdGA0YjQuNC90Ysg0LIg0LzQsNGB0YHQuNCy0LUg0LLQtdGA0YjQuNC9LiDQp9GC0L7QsdGLXG4gKiAgICAg0L/QvtC70LjQs9C+0L0g0LHRi9C7INGB0L/Qu9C+0YjQvdC+0LPQviDQvtC00L3QvtGA0L7QtNC90L7Qs9C+INGG0LLQtdGC0LAg0L3QtdC+0LHRhdC+0LTQuNC80L4g0YfRgtC+0LHRiyDQstGB0LUg0LLQtdGA0YjQuNC90Ysg0L/QvtC70LjQs9C+0L3QsCDQuNC80LXQu9C4INC+0LTQuNC90LDQutC+0LLRi9C5INGG0LLQtdGCLiDQptCy0LXRgiAtINGN0YLQvlxuICogICAgINGG0LXQu9C+0LUg0YfQuNGB0LvQviDQsiDQtNC40LDQv9Cw0LfQvtC90LUg0L7RgiAwINC00L4gMjU1LCDQv9GA0LXQtNGB0YLQsNCy0LvRj9GO0YnQtdC1INGB0L7QsdC+0Lkg0LjQvdC00LXQutGBINGG0LLQtdGC0LAg0LIg0L/RgNC10LTQvtC/0YDQtdC00LXQu9C10L3QvdC+0Lwg0LzQsNGB0YHQuNCy0LUg0YbQstC10YLQvtCyLlxuICogQHBhcmFtIGFtb3VudE9mVmVydGljZXMgLSDQmtC+0LvQuNGH0LXRgdGC0LLQviDQstGB0LXRhSDQstC10YDRiNC40L0g0LIg0LPRgNGD0L/Qv9C1INC/0L7Qu9C40LPQvtC90L7Qsi5cbiAqIEBwYXJhbSBhbW91bnRPZkdMVmVydGljZXMgLSDQmtC+0LvQuNGH0LXRgdGC0LLQviDQstC10YDRiNC40L0g0LLRgdC10YUgR0wt0YLRgNC10YPQs9C+0LvRjNC90LjQutC+0LIg0LIg0LPRgNGD0L/Qv9C1INC/0L7Qu9C40LPQvtC90L7Qsi5cbiAqL1xuaW50ZXJmYWNlIFNQbG90UG9seWdvbkdyb3VwIHtcbiAgdmVydGljZXM6IG51bWJlcltdLFxuICBpbmRpY2VzOiBudW1iZXJbXSxcbiAgY29sb3JzOiBudW1iZXJbXSxcbiAgYW1vdW50T2ZWZXJ0aWNlczogbnVtYmVyLFxuICBhbW91bnRPZkdMVmVydGljZXM6IG51bWJlclxufVxuXG4vKipcbiAqINCi0LjQvyDQtNC70Y8g0LjQvdGE0L7RgNC80LDRhtC40Lgg0L4g0LLQtdGA0YjQuNC90LDRhSDQv9C+0LvQuNCz0L7QvdCwLlxuICpcbiAqIEBwYXJhbSB2ZXJ0aWNlcyAtINCc0LDRgdGB0LjQsiDQstGB0LXRhSDQstC10YDRiNC40L0g0L/QvtC70LjQs9C+0L3QsC4g0JrQsNC20LTQsNGPINCy0LXRgNGI0LjQvdCwIC0g0Y3RgtC+INC/0LDRgNCwINGH0LjRgdC10LsgKNC60L7QvtGA0LTQuNC90LDRgtGLINCy0LXRgNGI0LjQvdGLINC90LBcbiAqICAgICDQv9C70L7RgdC60L7RgdGC0LgpLiDQmtC+0L7RgNC00LjQvdCw0YLRiyDQvNC+0LPRg9GCINCx0YvRgtGMINC60LDQuiDRhtC10LvRi9C80LgsINGC0LDQuiDQuCDQstC10YnQtdGB0YLQstC10L3QvdGL0LzQuCDRh9C40YHQu9Cw0LzQuC5cbiAqIEBwYXJhbSBpbmRpY2VzIC0g0JzQsNGB0YHQuNCyINC40L3QtNC10LrRgdC+0LIg0LLQtdGA0YjQuNC9INC/0L7Qu9C40LPQvtC90LAuINCa0LDQttC00YvQuSDQuNC90LTQtdC60YEgLSDRjdGC0L4g0L3QvtC80LXRgCDQstC10YDRiNC40L3RiyDQsiDQvNCw0YHRgdC40LLQtSDQstC10YDRiNC40L0uINCY0L3QtNC10LrRgdGLXG4gKiAgICAg0L7Qv9C40YHRi9Cy0LDRjtGCINCy0YHQtSBHTC3RgtGA0LXRg9Cz0L7Qu9GM0L3QuNC60LgsINC40Lcg0LrQvtGC0L7RgNGL0YUg0YHQvtGB0YLQvtC40YIg0L/QvtC70LjQs9C+0L0uXG4gKi9cbmludGVyZmFjZSBTUGxvdFBvbHlnb25WZXJ0aWNlcyB7XG4gIHZhbHVlczogbnVtYmVyW10sXG4gIGluZGljZXM6IG51bWJlcltdXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNQbG90IHtcblxuICAvKipcbiAgICog0JzQsNGB0YHQuNCyINC60LvQsNGB0YHQsCwg0YHQvtC00LXRgNC20LDRidC40Lkg0YHRgdGL0LvQutC4INC90LAg0LLRgdC1INGB0L7Qt9C00LDQvdC90YvQtSDRjdC60LfQtdC80L/Qu9GP0YDRiyDQutC70LDRgdGB0LAuINCY0L3QtNC10LrRgdCw0LzQuCDQvNCw0YHRgdC40LLQsCDQstGL0YHRgtGD0L/QsNGO0YIg0LjQtNC10L3RgtC40YTQuNC60LDRgtC+0YDRi1xuICAgKiDQutCw0L3QstCw0YHQvtCyINGN0LrQt9C10LzQv9C70Y/RgNC+0LIuINCY0YHQv9C+0LvRjNC30YPQtdGC0YHRjyDQtNC70Y8g0LTQvtGB0YLRg9C/0LAg0Log0L/QvtC70Y/QvCDQuCDQvNC10YLQvtC00LDQvCDRjdC60LfQtdC80L/Qu9GP0YDQsCDQuNC3INGC0LXQu9CwINCy0L3QtdGI0L3QuNGFINC+0LHRgNCw0LHQvtGH0LjQutC+0LIg0YHQvtCx0YvRgtC40LlcbiAgICog0LzRi9GI0Lgv0YLRgNC10LrQv9Cw0LTQsC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgaW5zdGFuY2VzOiB7IFtrZXk6IHN0cmluZ106IFNQbG90IH0gPSB7fVxuXG4gIC8vINCk0YPQvdC60YbQuNGPINC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOINC00LvRjyDQuNGC0LXRgNC40YDQvtCy0LDQvdC40Y8g0L7QsdGK0LXQutGC0L7QsiDQvdC1INC30LDQtNCw0LXRgtGB0Y8uXG4gIHB1YmxpYyBpdGVyYXRpb25DYWxsYmFjazogU1Bsb3RJdGVyYXRpb25GdW5jdGlvbiB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZFxuXG4gIC8vINCm0LLQtdGC0L7QstCw0Y8g0L/QsNC70LjRgtGA0LAg0L/QvtC70LjQs9C+0L3QvtCyINC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOLlxuICBwdWJsaWMgcG9seWdvblBhbGV0dGU6IEhFWENvbG9yW10gPSBbXG4gICAgJyNGRjAwRkYnLCAnIzgwMDA4MCcsICcjRkYwMDAwJywgJyM4MDAwMDAnLCAnI0ZGRkYwMCcsXG4gICAgJyMwMEZGMDAnLCAnIzAwODAwMCcsICcjMDBGRkZGJywgJyMwMDAwRkYnLCAnIzAwMDA4MCdcbiAgXVxuXG4gIC8vINCg0LDQt9C80LXRgCDQutC+0L7RgNC00LjQvdCw0YLQvdC+0Lkg0L/Qu9C+0YHQutC+0YHRgtC4INC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOLlxuICBwdWJsaWMgZ3JpZFNpemU6IFNQbG90R3JpZFNpemUgPSB7XG4gICAgd2lkdGg6IDMyXzAwMCxcbiAgICBoZWlnaHQ6IDE2XzAwMFxuICB9XG5cbiAgLy8g0KDQsNC30LzQtdGAINC/0L7Qu9C40LPQvtC90LAg0L/QviDRg9C80L7Qu9GH0LDQvdC40Y4uXG4gIHB1YmxpYyBwb2x5Z29uU2l6ZTogbnVtYmVyID0gMjBcblxuICAvLyDQodGC0LXQv9C10L3RjCDQtNC10YLQsNC70LjQt9Cw0YbQuNC4INC60YDRg9Cz0LAg0L/QviDRg9C80L7Qu9GH0LDQvdC40Y4uXG4gIHB1YmxpYyBjaXJjbGVBcHByb3hMZXZlbDogbnVtYmVyID0gMTJcblxuICAvLyDQn9Cw0YDQsNC80LXRgtGA0Ysg0YDQtdC20LjQvNCwINC+0YLQu9Cw0LTQutC4INC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOLlxuICBwdWJsaWMgZGVidWdNb2RlOiBTUGxvdERlYnVnTW9kZSA9IHtcbiAgICBpc0VuYWJsZTogZmFsc2UsXG4gICAgb3V0cHV0OiAnY29uc29sZScsXG4gICAgaGVhZGVyU3R5bGU6ICdmb250LXdlaWdodDogYm9sZDsgY29sb3I6ICNmZmZmZmY7IGJhY2tncm91bmQtY29sb3I6ICNjYzAwMDA7JyxcbiAgICBncm91cFN0eWxlOiAnZm9udC13ZWlnaHQ6IGJvbGQ7IGNvbG9yOiAjZmZmZmZmOydcbiAgfVxuXG4gIC8vINCf0LDRgNCw0LzQtdGC0YDRiyDRgNC10LbQuNC80LAg0LTQtdC80L7RgdGC0YDQsNGG0LjQvtC90L3Ri9GFINC00LDQvdC90YvRhSDQv9C+INGD0LzQvtC70YfQsNC90LjRji5cbiAgcHVibGljIGRlbW9Nb2RlOiBTUGxvdERlbW9Nb2RlID0ge1xuICAgIGlzRW5hYmxlOiBmYWxzZSxcbiAgICBhbW91bnQ6IDFfMDAwXzAwMCxcbiAgICAvKipcbiAgICAgKiDQn9C+INGD0LzQvtC70YfQsNC90LjRjiDQsiDRgNC10LbQuNC80LUg0LTQtdC80L4t0LTQsNC90L3Ri9GFINCx0YPQtNGD0YIg0L/QvtGA0L7QstC90YMg0L7RgtC+0LHRgNCw0LbQsNGC0YzRgdGPINC/0L7Qu9C40LPQvtC90Ysg0LLRgdC10YUg0LLQvtC30LzQvtC20L3Ri9GFINGE0L7RgNC8LiDQodC+0L7RgtCy0LXRgtGB0YLQstGD0Y7RidC40LVcbiAgICAgKiDQt9C90LDRh9C10L3QuNGPINC80LDRgdGB0LjQstCwINC40L3QuNGG0LjQsNC70LjQt9C40YDRg9GO0YLRgdGPINC/0YDQuCDRgNC10LPQuNGB0YLRgNCw0YbQuNC4INGE0YPQvdC60YbQuNC5INGB0L7Qt9C00LDQvdC40Y8g0YTQvtGA0Lwg0LzQtdGC0L7QtNC+0Lwge0BsaW5rIHJlZ2lzdGVyU2hhcGV9LlxuICAgICAqL1xuICAgIHNoYXBlUXVvdGE6IFtdLFxuICAgIGluZGV4OiAwXG4gIH1cblxuICAvLyDQn9GA0LjQt9C90LDQuiDQv9C+INGD0LzQvtC70YfQsNC90LjRjiDRhNC+0YDRgdC40YDQvtCy0LDQvdC90L7Qs9C+INC30LDQv9GD0YHQutCwINGA0LXQvdC00LXRgNCwLlxuICBwdWJsaWMgZm9yY2VSdW46IGJvb2xlYW4gPSBmYWxzZVxuXG4gIC8qKlxuICAgKiDQn9C+INGD0LzQvtC70YfQsNC90LjRjiDQuNGB0LrRg9GB0YHRgtCy0LXQvdC90L7Qs9C+INC+0LPRgNCw0L3QuNGH0LXQvdC40Y8g0L3QsCDQutC+0LvQuNGH0LXRgdGC0LLQviDQvtGC0L7QsdGA0LDQttCw0LXQvNGL0YUg0L/QvtC70LjQs9C+0L3QvtCyINC90LXRgiAo0LfQsCDRgdGH0LXRgiDQt9Cw0LTQsNC90LjRjyDQsdC+0LvRjNGI0L7Qs9C+INC30LDQstC10LTQvtC80L5cbiAgICog0L3QtdC00L7RgdGC0LjQttC40LzQvtCz0L4g0L/QvtGA0L7Qs9C+0LLQvtCz0L4g0YfQuNGB0LvQsCkuXG4gICAqL1xuICBwdWJsaWMgbWF4QW1vdW50T2ZQb2x5Z29uczogbnVtYmVyID0gMV8wMDBfMDAwXzAwMFxuXG4gIC8vINCk0L7QvdC+0LLRi9C5INGG0LLQtdGCINC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOINC00LvRjyDQutCw0L3QstCw0YHQsC5cbiAgcHVibGljIGJnQ29sb3I6IEhFWENvbG9yID0gJyNmZmZmZmYnXG5cbiAgLy8g0KbQstC10YIg0L/QviDRg9C80L7Qu9GH0LDQvdC40Y4g0LTQu9GPINC90LDQv9GA0LDQstC70Y/RjtGJ0LjRhS5cbiAgcHVibGljIHJ1bGVzQ29sb3I6IEhFWENvbG9yID0gJyNjMGMwYzAnXG5cbiAgLy8g0J/QviDRg9C80L7Qu9GH0LDQvdC40Y4g0L7QsdC70LDRgdGC0Ywg0L/RgNC+0YHQvNC+0YLRgNCwINGD0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdGC0YHRjyDQsiDRhtC10L3RgtGAINC60L7QvtGA0LTQuNC90LDRgtC90L7QuSDQv9C70L7QvtGB0LrQvtGB0YLQuC5cbiAgcHVibGljIGNhbWVyYTogU1Bsb3RDYW1lcmEgPSB7XG4gICAgeDogdGhpcy5ncmlkU2l6ZS53aWR0aCAvIDIsXG4gICAgeTogdGhpcy5ncmlkU2l6ZS5oZWlnaHQgLyAyLFxuICAgIHpvb206IDFcbiAgfVxuXG4gIC8qKlxuICAgKiDQn9C+INGD0LzQvtC70YfQsNC90LjRjiDQvdCw0YHRgtGA0L7QudC60Lgg0LrQvtC90YLQtdC60YHRgtCwINGA0LXQvdC00LXRgNC40L3Qs9CwIFdlYkdMINC80LDQutGB0LjQvNC40LfQuNGA0YPRjtGCINC/0YDQvtC40LfQstC+0LTQuNGC0LXQu9GM0L3QvtGB0YLRjCDQs9GA0LDRhNC40YfQtdGB0LrQvtC5INGB0LjRgdGC0LXQvNGLLiDQodC/0LXRhtC40LDQu9GM0L3Ri9GFXG4gICAqINC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjNGB0LrQuNGFINC/0YDQtdC00YPRgdGC0LDQvdC+0LLQvtC6INC90LUg0YLRgNC10LHRg9C10YLRgdGPLCDQvtC00L3QsNC60L4g0L/RgNC40LvQvtC20LXQvdC40LUg0L/QvtC30LLQvtC70Y/QtdGCINGN0LrRgdC/0LXRgNC40LzQtdC90YLQuNGA0L7QstCw0YLRjCDRgSDQvdCw0YHRgtGA0L7QudC60LDQvNC4INCz0YDQsNGE0LjQutC4LlxuICAgKi9cbiAgcHVibGljIHdlYkdsU2V0dGluZ3M6IFdlYkdMQ29udGV4dEF0dHJpYnV0ZXMgPSB7XG4gICAgYWxwaGE6IGZhbHNlLFxuICAgIGRlcHRoOiBmYWxzZSxcbiAgICBzdGVuY2lsOiBmYWxzZSxcbiAgICBhbnRpYWxpYXM6IGZhbHNlLFxuICAgIHByZW11bHRpcGxpZWRBbHBoYTogZmFsc2UsXG4gICAgcHJlc2VydmVEcmF3aW5nQnVmZmVyOiBmYWxzZSxcbiAgICBwb3dlclByZWZlcmVuY2U6ICdsb3ctcG93ZXInLFxuICAgIGZhaWxJZk1ham9yUGVyZm9ybWFuY2VDYXZlYXQ6IGZhbHNlLFxuICAgIGRlc3luY2hyb25pemVkOiBmYWxzZVxuICB9XG5cbiAgLy8g0J/RgNC40LfQvdCw0Log0LDQutGC0LjQstC90L7Qs9C+INC/0YDQvtGG0LXRgdGB0LAg0YDQtdC90LTQtdGA0LAuINCU0L7RgdGC0YPQv9C10L0g0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GOINC/0YDQuNC70L7QttC10L3QuNGPINGC0L7Qu9GM0LrQviDQtNC70Y8g0YfRgtC10L3QuNGPLlxuICBwdWJsaWMgaXNSdW5uaW5nOiBib29sZWFuID0gZmFsc2VcblxuICAvLyDQntCx0YrQtdC60YIg0LrQsNC90LLQsNGB0LAuXG4gIHByb3RlY3RlZCByZWFkb25seSBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50XG5cbiAgLy8g0J7QsdGK0LXQutGCINC60L7QvdGC0LXQutGB0YLQsCDRgNC10L3QtNC10YDQuNC90LPQsCBXZWJHTC5cbiAgcHJvdGVjdGVkIGdsITogV2ViR0xSZW5kZXJpbmdDb250ZXh0XG5cbiAgLy8g0J7QsdGK0LXQutGCINC/0YDQvtCz0YDQsNC80LzRiyBXZWJHTC5cbiAgcHJvdGVjdGVkIGdwdVByb2dyYW0hOiBXZWJHTFByb2dyYW1cblxuICAvLyDQn9C10YDQtdC80LXQvdC90YvQtSDQtNC70Y8g0YHQstGP0LfQuCDQv9GA0LjQu9C+0LbQtdC90LjRjyDRgSDQv9GA0L7Qs9GA0LDQvNC80L7QuSBXZWJHTC5cbiAgcHJvdGVjdGVkIHZhcmlhYmxlczogeyBba2V5OiBzdHJpbmddOiBhbnkgfSA9IHt9XG5cbiAgLyoqXG4gICAqINCo0LDQsdC70L7QvSBHTFNMLdC60L7QtNCwINC00LvRjyDQstC10YDRiNC40L3QvdC+0LPQviDRiNC10LnQtNC10YDQsC4g0KHQvtC00LXRgNC20LjRgiDRgdC/0LXRhtC40LDQu9GM0L3Rg9GOINCy0YHRgtCw0LLQutGDIFwiU0VULVZFUlRFWC1DT0xPUi1DT0RFXCIsINC60L7RgtC+0YDQsNGPINC/0LXRgNC10LRcbiAgICog0YHQvtC30LTQsNC90LjQtdC8INGI0LXQudC00LXRgNCwINC30LDQvNC10L3Rj9C10YLRgdGPINC90LAgR0xTTC3QutC+0LQg0LLRi9Cx0L7RgNCwINGG0LLQtdGC0LAg0LLQtdGA0YjQuNC9LlxuICAgKi9cbiAgcHJvdGVjdGVkIHJlYWRvbmx5IHZlcnRleFNoYWRlckNvZGVUZW1wbGF0ZTogc3RyaW5nID1cbiAgICAnYXR0cmlidXRlIHZlYzIgYV9wb3NpdGlvbjtcXG4nICtcbiAgICAnYXR0cmlidXRlIGZsb2F0IGFfY29sb3I7XFxuJyArXG4gICAgJ3VuaWZvcm0gbWF0MyB1X21hdHJpeDtcXG4nICtcbiAgICAndmFyeWluZyB2ZWMzIHZfY29sb3I7XFxuJyArXG4gICAgJ3ZvaWQgbWFpbigpIHtcXG4nICtcbiAgICAnICBnbF9Qb3NpdGlvbiA9IHZlYzQoKHVfbWF0cml4ICogdmVjMyhhX3Bvc2l0aW9uLCAxKSkueHksIDAuMCwgMS4wKTtcXG4nICtcbiAgICAnICBnbF9Qb2ludFNpemUgPSAxLjA7XFxuJyArXG4gICAgJyAgU0VULVZFUlRFWC1DT0xPUi1DT0RFJyArXG4gICAgJ31cXG4nXG5cbiAgLy8g0KjQsNCx0LvQvtC9IEdMU0wt0LrQvtC00LAg0LTQu9GPINGE0YDQsNCz0LzQtdC90YLQvdC+0LPQviDRiNC10LnQtNC10YDQsC5cbiAgcHJvdGVjdGVkIHJlYWRvbmx5IGZyYWdtZW50U2hhZGVyQ29kZVRlbXBsYXRlOiBzdHJpbmcgPVxuICAgICdwcmVjaXNpb24gbG93cCBmbG9hdDtcXG4nICtcbiAgICAndmFyeWluZyB2ZWMzIHZfY29sb3I7XFxuJyArXG4gICAgJ3ZvaWQgbWFpbigpIHtcXG4nICtcbiAgICAnICBnbF9GcmFnQ29sb3IgPSB2ZWM0KHZfY29sb3IucmdiLCAxLjApO1xcbicgK1xuICAgICd9XFxuJ1xuXG4gIC8vINCh0YfQtdGC0YfQuNC6INGH0LjRgdC70LAg0L7QsdGA0LDQsdC+0YLQsNC90L3Ri9GFINC/0L7Qu9C40LPQvtC90L7Qsi5cbiAgcHJvdGVjdGVkIGFtb3VudE9mUG9seWdvbnM6IG51bWJlciA9IDBcblxuICAvKipcbiAgICogICDQndCw0LHQvtGAINCy0YHQv9C+0LzQvtCz0LDRgtC10LvRjNC90YvRhSDQutC+0L3RgdGC0LDQvdGCLCDQuNGB0L/QvtC70YzQt9GD0LXQvNGL0YUg0LIg0YfQsNGB0YLQviDQv9C+0LLRgtC+0YDRj9GO0YnQuNGF0YHRjyDQstGL0YfQuNGB0LvQtdC90LjRj9GFLiDQoNCw0YHRgdGH0LjRgtGL0LLQsNC10YLRgdGPINC4INC30LDQtNCw0LXRgtGB0Y8g0LJcbiAgICogICDQvNC10YLQvtC00LUge0BsaW5rIHNldFVzZWZ1bENvbnN0YW50c30uXG4gICAqL1xuICBwcm90ZWN0ZWQgVVNFRlVMX0NPTlNUUzogYW55W10gPSBbXVxuXG4gIC8vINCi0LXRhdC90LjRh9C10YHQutCw0Y8g0LjQvdGE0L7RgNC80LDRhtC40Y8sINC40YHQv9C+0LvRjNC30YPQtdC80LDRjyDQv9GA0LjQu9C+0LbQtdC90LjQtdC8INC00LvRjyDRgNCw0YHRh9C10YLQsCDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuS5cbiAgcHJvdGVjdGVkIHRyYW5zb3JtYXRpb246IFNQbG90VHJhbnNmb3JtYXRpb24gPSB7XG4gICAgdmlld1Byb2plY3Rpb25NYXQ6IFtdLFxuICAgIHN0YXJ0SW52Vmlld1Byb2pNYXQ6IFtdLFxuICAgIHN0YXJ0Q2FtZXJhOiB7eDowLCB5OjAsIHpvb206IDF9LFxuICAgIHN0YXJ0UG9zOiBbXSxcbiAgICBzdGFydENsaXBQb3M6IFtdLFxuICAgIHN0YXJ0TW91c2VQb3M6IFtdXG4gIH1cblxuICAvKipcbiAgICog0JzQsNC60YHQuNC80LDQu9GM0L3QvtC1INCy0L7Qt9C80L7QttC90L7QtSDQutC+0LvQuNGH0LXRgdGC0LLQviDQstC10YDRiNC40L0g0LIg0LPRgNGD0L/Qv9C1INC/0L7Qu9C40LPQvtC90L7Qsiwg0LrQvtGC0L7RgNC+0LUg0LXRidC1INC00L7Qv9GD0YHQutCw0LXRgiDQtNC+0LHQsNCy0LvQtdC90LjQtSDQvtC00L3QvtCz0L4g0YHQsNC80L7Qs9C+XG4gICAqINC80L3QvtCz0L7QstC10YDRiNC40L3QvdC+0LPQviDQv9C+0LvQuNCz0L7QvdCwLiDQrdGC0L4g0LrQvtC70LjRh9C10YHRgtCy0L4g0LjQvNC10LXRgiDQvtCx0YrQtdC60YLQuNCy0L3QvtC1INGC0LXRhdC90LjRh9C10YHQutC+0LUg0L7Qs9GA0LDQvdC40YfQtdC90LjQtSwg0YIu0LouINGE0YPQvdC60YbQuNGPXG4gICAqIHtAbGluayBkcmF3RWxlbWVudHN9INC90LUg0L/QvtC30LLQvtC70Y/QtdGCINC60L7RgNGA0LXQutGC0L3QviDQv9GA0LjQvdC40LzQsNGC0Ywg0LHQvtC70YzRiNC1IDY1NTM2INC40L3QtNC10LrRgdC+0LIgKDMyNzY4INCy0LXRgNGI0LjQvSkuXG4gICAqL1xuICBwcm90ZWN0ZWQgbWF4QW1vdW50T2ZWZXJ0ZXhQZXJQb2x5Z29uR3JvdXA6IG51bWJlciA9IDMyNzY4IC0gKHRoaXMuY2lyY2xlQXBwcm94TGV2ZWwgKyAxKTtcblxuICAvLyDQmNC90YTQvtGA0LzQsNGG0LjRjyDQviDQsdGD0YTQtdGA0LDRhSwg0YXRgNCw0L3Rj9GJ0LjRhSDQtNCw0L3QvdGL0LUg0LTQu9GPINCy0LjQtNC10L7Qv9Cw0LzRj9GC0LguXG4gIHByb3RlY3RlZCBidWZmZXJzOiBTUGxvdEJ1ZmZlcnMgPSB7XG4gICAgdmVydGV4QnVmZmVyczogW10sXG4gICAgY29sb3JCdWZmZXJzOiBbXSxcbiAgICBpbmRleEJ1ZmZlcnM6IFtdLFxuICAgIGFtb3VudE9mR0xWZXJ0aWNlczogW10sXG4gICAgYW1vdW50T2ZTaGFwZXM6IFtdLFxuICAgIGFtb3VudE9mQnVmZmVyR3JvdXBzOiAwLFxuICAgIGFtb3VudE9mVG90YWxWZXJ0aWNlczogMCxcbiAgICBhbW91bnRPZlRvdGFsR0xWZXJ0aWNlczogMCxcbiAgICBzaXplSW5CeXRlczogWzAsIDAsIDBdXG4gIH1cblxuICAvKipcbiAgICog0JjQvdGE0L7RgNC80LDRhtC40Y8g0L4g0LLQvtC30LzQvtC20L3Ri9GFINGE0L7RgNC80LDRhSDQv9C+0LvQuNCz0L7QvdC+0LIuXG4gICAqINCa0LDQttC00LDRjyDRhNC+0YDQvNCwINC/0YDQtdC00YHRgtCw0LLQu9GP0LXRgtGB0Y8g0YTRg9C90LrRhtC40LXQuSwg0LLRi9GH0LjRgdC70Y/RjtGJ0LXQuSDQtdC1INCy0LXRgNGI0LjQvdGLINC4INC90LDQt9Cy0LDQvdC40LXQvCDRhNC+0YDQvNGLLlxuICAgKiDQlNC70Y8g0YPQutCw0LfQsNC90LjRjyDRhNC+0YDQvNGLINC/0L7Qu9C40LPQvtC90L7QsiDQsiDQv9GA0LjQu9C+0LbQtdC90LjQuCDQuNGB0L/QvtC70YzQt9GD0Y7RgtGB0Y8g0YfQuNGB0LvQvtCy0YvQtSDQuNC90LTQtdC60YHRiyDQsiDQtNCw0L3QvdC+0Lwg0LzQsNGB0YHQuNCy0LUuXG4gICAqL1xuICBwcm90ZWN0ZWQgc2hhcGVzOiB7Y2FsYzogU1Bsb3RDYWxjU2hhcGVGdW5jLCBuYW1lOiBzdHJpbmd9W10gPSBbXVxuXG4gIC8qKlxuICAgKiDQodC+0LfQtNCw0LXRgiDRjdC60LfQtdC80L/Qu9GP0YAg0LrQu9Cw0YHRgdCwLCDQuNC90LjRhtC40LDQu9C40LfQuNGA0YPQtdGCINC90LDRgdGC0YDQvtC50LrQuC5cbiAgICpcbiAgICogQHJlbWFya3NcbiAgICog0JXRgdC70Lgg0LrQsNC90LLQsNGBINGBINC30LDQtNCw0L3QvdGL0Lwg0LjQtNC10L3RgtC40YTQuNC60LDRgtC+0YDQvtC8INC90LUg0L3QsNC50LTQtdC9IC0g0LPQtdC90LXRgNC40YDRg9C10YLRgdGPINC+0YjQuNCx0LrQsC4g0J3QsNGB0YLRgNC+0LnQutC4INC80L7Qs9GD0YIg0LHRi9GC0Ywg0LfQsNC00LDQvdGLINC60LDQuiDQslxuICAgKiDQutC+0L3RgdGC0YDRg9C60YLQvtGA0LUsINGC0LDQuiDQuCDQsiDQvNC10YLQvtC00LUge0BsaW5rIHNldHVwfS4g0J7QtNC90LDQutC+INCyINC70Y7QsdC+0Lwg0YHQu9GD0YfQsNC1INC90LDRgdGC0YDQvtC50LrQuCDQtNC+0LvQttC90Ysg0LHRi9GC0Ywg0LfQsNC00LDQvdGLINC00L4g0LfQsNC/0YPRgdC60LAg0YDQtdC90LTQtdGA0LAuXG4gICAqXG4gICAqIEBwYXJhbSBjYW52YXNJZCAtINCY0LTQtdC90YLQuNGE0LjQutCw0YLQvtGAINC60LDQvdCy0LDRgdCwLCDQvdCwINC60L7RgtC+0YDQvtC8INCx0YPQtNC10YIg0YDQuNGB0L7QstCw0YLRjNGB0Y8g0LPRgNCw0YTQuNC6LlxuICAgKiBAcGFyYW0gb3B0aW9ucyAtINCf0L7Qu9GM0LfQvtCy0LDRgtC10LvRjNGB0LrQuNC1INC90LDRgdGC0YDQvtC50LrQuCDRjdC60LfQtdC80L/Qu9GP0YDQsC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGNhbnZhc0lkOiBzdHJpbmcsIG9wdGlvbnM/OiBTUGxvdE9wdGlvbnMpIHtcblxuICAgIC8vINCh0L7RhdGA0LDQvdC10L3QuNC1INGB0YHRi9C70LrQuCDQvdCwINGN0LrQt9C10LzQv9C70Y/RgCDQutC70LDRgdGB0LAuINCf0L7Qt9Cy0L7Qu9GP0LXRgiDQstC90LXRiNC40Lwg0YHQvtCx0YvRgtC40Y/QvCDQv9C+0LvRg9GH0LDRgtGMINC00L7RgdGC0YPQvyDQuiDQv9C+0LvRj9C8INC4INC80LXRgtC+0LTQsNC8INGN0LrQt9C10LzQv9C70Y/RgNCwLlxuICAgIFNQbG90Lmluc3RhbmNlc1tjYW52YXNJZF0gPSB0aGlzXG5cbiAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY2FudmFzSWQpKSB7XG4gICAgICB0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNhbnZhc0lkKSBhcyBIVE1MQ2FudmFzRWxlbWVudFxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ9Ca0LDQvdCy0LDRgSDRgSDQuNC00LXQvdGC0LjRhNC40LrQsNGC0L7RgNC+0LwgXCIjJyArIGNhbnZhc0lkICsgwqAnXCIg0L3QtSDQvdCw0LnQtNC10L0hJylcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDQoNC10LPQuNGB0YLRgNCw0YbQuNGPINGC0YDQtdGFINCx0LDQt9C+0LLRi9GFINGE0L7RgNC8INC/0L7Qu9C40LPQvtC90L7QsiAo0YLRgNC10YPQs9C+0LvRjNC90LjQutC4LCDQutCy0LDQtNGA0LDRgtGLINC4INC60YDRg9Cz0LgpLiDQndCw0LvQuNGH0LjQtSDRjdGC0LjRhSDRhNC+0YDQvCDQsiDRg9C60LDQt9Cw0L3QvdC+0Lwg0L/QvtGA0Y/QtNC60LVcbiAgICAgKiDRj9Cy0LvRj9C10YLRgdGPINC+0LHRj9C30LDRgtC10LvRjNC90YvQvCDQtNC70Y8g0LrQvtGA0YDQtdC60YLQvdC+0Lkg0YDQsNCx0L7RgtGLINC/0YDQuNC70L7QttC10L3QuNGPLiDQlNGA0YPQs9C40LUg0YTQvtGA0LzRiyDQvNC+0LPRg9GCINGA0LXQs9C40YHRgtGA0LjRgNC+0LLQsNGC0YzRjyDQsiDQu9GO0LHQvtC8INC60L7Qu9C40YfQtdGB0YLQstC1LCDQslxuICAgICAqINC70Y7QsdC+0Lkg0L/QvtGB0LvQtdC00L7QstCw0YLQtdC70YzQvdC+0YHRgtC4LlxuICAgICAqL1xuICAgIHRoaXMucmVnaXN0ZXJTaGFwZSh0aGlzLmdldFZlcnRpY2VzT2ZUcmlhbmdsZSwgJ9Ci0YDQtdGD0LPQvtC70YzQvdC40LonKVxuICAgIHRoaXMucmVnaXN0ZXJTaGFwZSh0aGlzLmdldFZlcnRpY2VzT2ZTcXVhcmUsICfQmtCy0LDQtNGA0LDRgicpXG4gICAgdGhpcy5yZWdpc3RlclNoYXBlKHRoaXMuZ2V0VmVydGljZXNPZkNpcmNsZSwgJ9Ca0YDRg9CzJylcblxuICAgIC8vINCV0YHQu9C4INC/0LXRgNC10LTQsNC90Ysg0L3QsNGB0YLRgNC+0LnQutC4LCDRgtC+INC+0L3QuCDQv9GA0LjQvNC10L3Rj9GO0YLRgdGPLlxuICAgIGlmIChvcHRpb25zKSB7XG4gICAgICB0aGlzLnNldE9wdGlvbnMob3B0aW9ucylcblxuICAgICAgLy8gINCV0YHQu9C4INC30LDQv9GA0L7RiNC10L0g0YTQvtGA0YHQuNGA0L7QstCw0L3QvdGL0Lkg0LfQsNC/0YPRgdC6LCDRgtC+INC40L3QuNGG0LjQsNC70LjQt9C40YDRg9GO0YLRgdGPINCy0YHQtSDQvdC10L7QsdGF0L7QtNC40LzRi9C1INC00LvRjyDRgNC10L3QtNC10YDQsCDQv9Cw0YDQsNC80LXRgtGA0YsuXG4gICAgICBpZiAodGhpcy5mb3JjZVJ1bikge1xuICAgICAgICB0aGlzLnNldHVwKG9wdGlvbnMpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqINCh0L7Qt9C00LDQtdGCINC60L7QvdGC0LXQutGB0YIg0YDQtdC90LTQtdGA0LjQvdCz0LAgV2ViR0wg0Lgg0YPRgdGC0LDQvdCw0LLQu9C40LLQsNC10YIg0LrQvtGA0YDQtdC60YLQvdGL0Lkg0YDQsNC30LzQtdGAINC+0LHQu9Cw0YHRgtC4INC/0YDQvtGB0LzQvtGC0YDQsC5cbiAgICovXG4gIHByb3RlY3RlZCBjcmVhdGVHbCgpOiB2b2lkIHtcblxuICAgIHRoaXMuZ2wgPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCd3ZWJnbCcsIHRoaXMud2ViR2xTZXR0aW5ncykgYXMgV2ViR0xSZW5kZXJpbmdDb250ZXh0XG5cbiAgICB0aGlzLmNhbnZhcy53aWR0aCA9IHRoaXMuY2FudmFzLmNsaWVudFdpZHRoXG4gICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gdGhpcy5jYW52YXMuY2xpZW50SGVpZ2h0XG5cbiAgICB0aGlzLmdsLnZpZXdwb3J0KDAsIDAsIHRoaXMuY2FudmFzLndpZHRoLCB0aGlzLmNhbnZhcy5oZWlnaHQpXG4gIH1cblxuICAvKipcbiAgICog0KDQtdCz0LjRgdGC0YDQuNGA0YPQtdGCINC90L7QstGD0Y4g0YTQvtGA0LzRgyDQv9C+0LvQuNCz0L7QvdC+0LIuINCg0LXQs9C40YHRgtGA0LDRhtC40Y8g0L7Qt9C90LDRh9Cw0LXRgiDQstC+0LfQvNC+0LbQvdC+0YHRgtGMINCyINC00LDQu9GM0L3QtdC50YjQtdC8INC+0YLQvtCx0YDQsNC20LDRgtGMINC90LAg0LPRgNCw0YTQuNC60LUg0L/QvtC70LjQs9C+0L3RiyDQtNCw0L3QvdC+0Lkg0YTQvtGA0LzRiy5cbiAgICpcbiAgICogQHBhcmFtIHBvbHlnb25DYWxjIC0g0KTRg9C90LrRhtC40Y8g0LLRi9GH0LjRgdC70LXQvdC40Y8g0LrQvtC+0YDQtNC40L3QsNGCINCy0LXRgNGI0LjQvSDQv9C+0LvQuNCz0L7QvdCwINC00LDQvdC90L7QuSDRhNC+0YDQvNGLLlxuICAgKiBAcGFyYW0gcG9seWdvbk5hbWUgLSDQndCw0LfQstCw0L3QuNC1INGE0L7RgNC80Ysg0L/QvtC70LjQs9C+0L3QsC5cbiAgICogQHJldHVybnMg0JjQvdC00LXQutGBINC90L7QstC+0Lkg0YTQvtGA0LzRiywg0L/QviDQutC+0YLQvtGA0L7QvNGDINC30LDQtNCw0LXRgtGB0Y8g0LXQtSDQvtGC0L7QsdGA0LDQttC10L3QuNC1INC90LAg0LPRgNCw0YTQuNC60LUuXG4gICAqL1xuICBwdWJsaWMgcmVnaXN0ZXJTaGFwZShwb2x5Z29uQ2FsYzogU1Bsb3RDYWxjU2hhcGVGdW5jLCBwb2x5Z29uTmFtZTogc3RyaW5nKTogbnVtYmVyIHtcblxuICAgIC8vINCU0L7QsdCw0LLQu9C10L3QuNC1INGE0L7RgNC80Ysg0LIg0LzQsNGB0YHQuNCyINGE0L7RgNC8LlxuICAgIHRoaXMuc2hhcGVzLnB1c2goe1xuICAgICAgY2FsYzogcG9seWdvbkNhbGMsXG4gICAgICBuYW1lOiBwb2x5Z29uTmFtZVxuICAgIH0pXG5cbiAgICAvLyDQlNC+0LHQsNCy0LvQtdC90LjQtSDRhNC+0YDQvNGLINCyINC80LDRgdGB0LjQsiDRh9Cw0YHRgtC+0YIg0L/QvtGP0LLQu9C10L3QuNGPINCyINC00LXQvNC+LdGA0LXQttC40LzQtS5cbiAgICB0aGlzLmRlbW9Nb2RlLnNoYXBlUXVvdGEhLnB1c2goMSlcblxuICAgIC8vINCf0L7Qu9GD0YfQtdC90L3Ri9C5INC40L3QtNC10LrRgSDRhNC+0YDQvNGLINCyINC80LDRgdGB0LjQstC1INGE0L7RgNC8LlxuICAgIHJldHVybiB0aGlzLnNoYXBlcy5sZW5ndGggLSAxXG4gIH1cblxuICAvKipcbiAgICog0KPRgdGC0LDQvdCw0LLQu9C40LLQsNC10YIg0L3QtdC+0LHRhdC+0LTQuNC80YvQtSDQtNC70Y8g0YDQtdC90LTQtdGA0LAg0L/QsNGA0LDQvNC10YLRgNGLINGN0LrQt9C10LzQv9C70Y/RgNCwINC4IFdlYkdMLlxuICAgKlxuICAgKiBAcGFyYW0gb3B0aW9ucyAtINCf0L7Qu9GM0LfQvtCy0LDRgtC10LvRjNGB0LrQuNC1INC90LDRgdGC0YDQvtC50LrQuCDRjdC60LfQtdC80L/Qu9GP0YDQsC5cbiAgICovXG4gIHB1YmxpYyBzZXR1cChvcHRpb25zOiBTUGxvdE9wdGlvbnMpOiB2b2lkIHtcblxuICAgIC8vINCf0YDQuNC80LXQvdC10L3QuNC1INC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjNGB0LrQuNGFINC90LDRgdGC0YDQvtC10LouXG4gICAgdGhpcy5zZXRPcHRpb25zKG9wdGlvbnMpXG5cbiAgICAvLyDQodC+0LfQtNCw0L3QuNC1INC60L7QvdGC0LXQutGB0YLQsCDRgNC10L3QtNC10YDQuNC90LPQsC5cbiAgICB0aGlzLmNyZWF0ZUdsKClcblxuICAgIC8vINCS0YvQstC+0LQg0L7RgtC70LDQtNC+0YfQvdC+0Lkg0LjQvdGE0L7RgNC80LDRhtC40LguXG4gICAgaWYgKHRoaXMuZGVidWdNb2RlLmlzRW5hYmxlKSB7XG4gICAgICB0aGlzLnJlcG9ydE1haW5JbmZvKG9wdGlvbnMpXG4gICAgfVxuXG4gICAgLy8g0J7QsdC90YPQu9C10L3QuNC1INGB0YfQtdGC0YfQuNC60LAg0L/QvtC70LjQs9C+0L3QvtCyLlxuICAgIHRoaXMuYW1vdW50T2ZQb2x5Z29ucyA9IDBcblxuICAgIC8vINCe0LHQvdGD0LvQtdC90LjQtSDRgtC10YXQvdC40YfQtdGB0LrQvtCz0L4g0YHRh9C10YLRh9C40LrQsCDRgNC10LbQuNC80LAg0LTQtdC80L4t0LTQsNC90L3Ri9GFXG4gICAgdGhpcy5kZW1vTW9kZS5pbmRleCA9IDBcblxuICAgIC8vINCe0LHQvdGD0LvQtdC90LjQtSDRgdGH0LXRgtGH0LjQutC+0LIg0YfQuNGB0LvQsCDQuNGB0L/QvtC70YzQt9C+0LLQsNC90LjRjyDRgNCw0LfQu9C40YfQvdGL0YUg0YTQvtGA0Lwg0L/QvtC70LjQs9C+0L3QvtCyLlxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zaGFwZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRoaXMuYnVmZmVycy5hbW91bnRPZlNoYXBlc1tpXSA9IDBcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDQn9GA0LXQtNC10LvRjNC90L7QtSDQutC+0LvQuNGH0LXRgdGC0LLQviDQstC10YDRiNC40L0g0LIg0LPRgNGD0L/Qv9C1INC/0L7Qu9C40LPQvtC90L7QsiDQt9Cw0LLQuNGB0LjRgiDQvtGCINC/0LDRgNCw0LzQtdGC0YDQsFxuICAgICAqIGNpcmNsZUFwcHJveExldmVsLCDQutC+0YLQvtGA0YvQuSDQvNC+0LMg0LHRi9GC0Ywg0LjQt9C80LXQvdC10L0g0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GM0YHQutC40LzQuCDQvdCw0YHRgtGA0L7QudC60LDQvNC4LlxuICAgICAqL1xuICAgIHRoaXMubWF4QW1vdW50T2ZWZXJ0ZXhQZXJQb2x5Z29uR3JvdXAgPSAzMjc2OCAtICh0aGlzLmNpcmNsZUFwcHJveExldmVsICsgMSlcblxuICAgIC8vINCY0L3QuNGG0LjQsNC70LjQt9Cw0YbQuNGPINCy0YHQv9C+0LzQvtCz0LDRgtC10LvRjNC90YvRhSDQutC+0L3RgdGC0LDQvdGCLlxuICAgIHRoaXMuc2V0VXNlZnVsQ29uc3RhbnRzKClcblxuICAgIC8vINCj0YHRgtCw0L3QvtCy0LrQsCDRhtCy0LXRgtCwINC+0YfQuNGB0YLQutC4INGA0LXQvdC00LXRgNC40L3Qs9CwXG4gICAgbGV0IFtyLCBnLCBiXSA9IHRoaXMuY29udmVydENvbG9yKHRoaXMuYmdDb2xvcilcbiAgICB0aGlzLmdsLmNsZWFyQ29sb3IociwgZywgYiwgMC4wKVxuICAgIHRoaXMuZ2wuY2xlYXIodGhpcy5nbC5DT0xPUl9CVUZGRVJfQklUKVxuXG4gICAgLyoqXG4gICAgICog0J/QvtC00LPQvtGC0L7QstC60LAg0LrQvtC00L7QsiDRiNC10LnQtNC10YDQvtCyLiDQkiDQutC+0LQg0LLQtdGA0YjQuNC90L3QvtCz0L4g0YjQtdC50LTQtdGA0LAg0LLRgdGC0LDQstC70Y/QtdGC0YHRjyDQutC+0LQg0LLRi9Cx0L7RgNCwINGG0LLQtdGC0LAg0LLQtdGA0YjQuNC9LiDQmtC+0LQg0YTRgNCw0LPQvNC10L3RgtC90L7Qs9C+XG4gICAgICog0YjQtdC50LTQtdGA0LAg0LjRgdC/0L7Qu9GM0LfRg9C10YLRgdGPINCx0LXQtyDQuNC30LzQtdC90LXQvdC40LkuXG4gICAgICovXG4gICAgbGV0IHZlcnRleFNoYWRlckNvZGUgPSB0aGlzLnZlcnRleFNoYWRlckNvZGVUZW1wbGF0ZS5yZXBsYWNlKCdTRVQtVkVSVEVYLUNPTE9SLUNPREUnLCB0aGlzLmdlblNoYWRlckNvbG9yQ29kZSgpKVxuICAgIGxldCBmcmFnbWVudFNoYWRlckNvZGUgPSB0aGlzLmZyYWdtZW50U2hhZGVyQ29kZVRlbXBsYXRlXG5cbiAgICAvLyDQodC+0LfQtNCw0L3QuNC1INGI0LXQudC00LXRgNC+0LIgV2ViR0wuXG4gICAgbGV0IHZlcnRleFNoYWRlciA9IHRoaXMuY3JlYXRlV2ViR2xTaGFkZXIoJ1ZFUlRFWF9TSEFERVInLCB2ZXJ0ZXhTaGFkZXJDb2RlKVxuICAgIGxldCBmcmFnbWVudFNoYWRlciA9IHRoaXMuY3JlYXRlV2ViR2xTaGFkZXIoJ0ZSQUdNRU5UX1NIQURFUicsIGZyYWdtZW50U2hhZGVyQ29kZSlcblxuICAgIC8vINCh0L7Qt9C00LDQvdC40LUg0L/RgNC+0LPRgNCw0LzQvNGLIFdlYkdMLlxuICAgIHRoaXMuY3JlYXRlV2ViR2xQcm9ncmFtKHZlcnRleFNoYWRlciwgZnJhZ21lbnRTaGFkZXIpXG5cbiAgICAvLyDQo9GB0YLQsNC90L7QstC60LAg0YHQstGP0LfQtdC5INC/0LXRgNC10LzQtdC90L3Ri9GFINC/0YDQuNC70L7QttC10L3QuNGPINGBINC/0YDQvtCz0YDQsNC80LzQvtC5IFdlYkdsLlxuICAgIHRoaXMuc2V0V2ViR2xWYXJpYWJsZSgnYXR0cmlidXRlJywgJ2FfcG9zaXRpb24nKVxuICAgIHRoaXMuc2V0V2ViR2xWYXJpYWJsZSgnYXR0cmlidXRlJywgJ2FfY29sb3InKVxuICAgIHRoaXMuc2V0V2ViR2xWYXJpYWJsZSgndW5pZm9ybScsICd1X21hdHJpeCcpXG5cbiAgICAvLyDQktGL0YfQuNGB0LvQtdC90LjQtSDQtNCw0L3QvdGL0YUg0L7QsdC+INCy0YHQtdGFINC/0L7Qu9C40LPQvtC90LDRhSDQuCDQt9Cw0L/QvtC70L3QtdC90LjQtSDQuNC80Lgg0LHRg9GE0LXRgNC+0LIgV2ViR0wuXG4gICAgdGhpcy5jcmVhdGVXYkdsQnVmZmVycygpXG5cbiAgICAvLyDQldGB0LvQuCDQvdC10L7QsdGF0L7QtNC40LzQviwg0YLQviDRgNC10L3QtNC10YDQuNC90LMg0LfQsNC/0YPRgdC60LDQtdGC0YHRjyDRgdGA0LDQt9GDINC/0L7RgdC70LUg0YPRgdGC0LDQvdC+0LLQutC4INC/0LDRgNCw0LzQtdGC0YDQvtCyINGN0LrQt9C10LzQv9C70Y/RgNCwLlxuICAgIGlmICh0aGlzLmZvcmNlUnVuKSB7XG4gICAgICB0aGlzLnJ1bigpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqINCf0YDQuNC80LXQvdGP0LXRgiDQv9C+0LvRjNC30L7QstCw0YLQtdC70YzRgdC60LjQtSDQvdCw0YHRgtGA0L7QudC60Lgg0Y3QutC30LXQvNC/0LvRj9GA0LAuXG4gICAqXG4gICAqIEBwYXJhbSBvcHRpb25zIC0g0J/QvtC70YzQt9C+0LLQsNGC0LXQu9GM0YHQutC40LUg0L3QsNGB0YLRgNC+0LnQutC4INGN0LrQt9C10LzQv9C70Y/RgNCwLlxuICAgKi9cbiAgcHJvdGVjdGVkIHNldE9wdGlvbnMob3B0aW9uczogU1Bsb3RPcHRpb25zKTogdm9pZCB7XG5cbiAgICAvKipcbiAgICAgKiDQmtC+0L/QuNGA0L7QstCw0L3QuNC1INC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjNGB0LrQuNGFINC90LDRgdGC0YDQvtC10Log0LIg0YHQvtC+0YLQstC10YLRgdCy0YPRjtGJ0LjQtSDQv9C+0LvRjyDRjdC60LfQtdC80L/Qu9GP0YDQsC4g0JrQvtC/0LjRgNGD0Y7RgtGB0Y8g0YLQvtC70YzQutC+INGC0LUg0LjQtyDQvdC40YUsINC60L7RgtC+0YDRi9C8XG4gICAgICog0LjQvNC10Y7RgtGB0Y8g0YHQvtC+0YLQstC10YLRgdGC0LLRg9GO0YnQuNC1INGN0LrQstC40LLQsNC70LXQvdGC0Ysg0LIg0L/QvtC70Y/RhSDRjdC60LfQtdC80L/Qu9GP0YDQsC4g0JrQvtC/0LjRgNGD0LXRgtGB0Y8g0YLQsNC60LbQtSDQv9C10YDQstGL0Lkg0YPRgNC+0LLQtdC90Ywg0LLQu9C+0LbQtdC90L3Ri9GFINC90LDRgdGC0YDQvtC10LouXG4gICAgICovXG4gICAgZm9yIChsZXQgb3B0aW9uIGluIG9wdGlvbnMpIHtcblxuICAgICAgaWYgKCF0aGlzLmhhc093blByb3BlcnR5KG9wdGlvbikpIGNvbnRpbnVlXG5cbiAgICAgIGlmIChpc09iamVjdCgob3B0aW9ucyBhcyBhbnkpW29wdGlvbl0pICYmIGlzT2JqZWN0KCh0aGlzIGFzIGFueSlbb3B0aW9uXSkgKSB7XG4gICAgICAgIGZvciAobGV0IG5lc3RlZE9wdGlvbiBpbiAob3B0aW9ucyBhcyBhbnkpW29wdGlvbl0pIHtcbiAgICAgICAgICBpZiAoKHRoaXMgYXMgYW55KVtvcHRpb25dLmhhc093blByb3BlcnR5KG5lc3RlZE9wdGlvbikpIHtcbiAgICAgICAgICAgICh0aGlzIGFzIGFueSlbb3B0aW9uXVtuZXN0ZWRPcHRpb25dID0gKG9wdGlvbnMgYXMgYW55KVtvcHRpb25dW25lc3RlZE9wdGlvbl1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICh0aGlzIGFzIGFueSlbb3B0aW9uXSA9IChvcHRpb25zIGFzIGFueSlbb3B0aW9uXVxuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqINCV0YHQu9C4INC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjCDQt9Cw0LTQsNC10YIg0YDQsNC30LzQtdGAINC/0LvQvtGB0LrQvtGB0YLQuCwg0L3QviDQv9GA0Lgg0Y3RgtC+0Lwg0L3QsCDQt9Cw0LTQsNC10YIg0L3QsNGH0LDQu9GM0L3QvtC1INC/0L7Qu9C+0LbQtdC90LjQtSDQvtCx0LvQsNGB0YLQuCDQv9GA0L7RgdC80L7RgtGA0LAsINGC0L5cbiAgICAgKiDQvtCx0LvQsNGB0YLRjCDQv9GA0L7RgdC80L7RgtGA0LAg0L/QvtC80LXRidCw0LXRgtGB0Y8g0LIg0YbQtdC90YLRgCDQt9Cw0LTQsNC90L3QvtC5INC/0LvQvtGB0LrQvtGB0YLQuC5cbiAgICAgKi9cbiAgICBpZiAob3B0aW9ucy5oYXNPd25Qcm9wZXJ0eSgnZ3JpZFNpemUnKSAmJiAhb3B0aW9ucy5oYXNPd25Qcm9wZXJ0eSgnY2FtZXJhJykpIHtcbiAgICAgIHRoaXMuY2FtZXJhID0ge1xuICAgICAgICB4OiB0aGlzLmdyaWRTaXplLndpZHRoIC8gMixcbiAgICAgICAgeTogdGhpcy5ncmlkU2l6ZS5oZWlnaHQgLyAyLFxuICAgICAgICB6b29tOiAxXG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog0JXRgdC70Lgg0LfQsNC/0YDQvtGI0LXQvSDQtNC10LzQvi3RgNC10LbQuNC8LCDRgtC+INC00LvRjyDQuNGC0LXRgNC40YDQvtCy0LDQvdC40Y8g0L7QsdGK0LXQutGC0L7QsiDQsdGD0LTQtdGCINC40YHQv9C+0LvRjNC30L7QstCw0YLRjNGB0Y8g0LLQvdGD0YLRgNC10L3QvdC40Lkg0LjQvNC40YLQuNGA0YPRjtGJ0LjQuSDQuNGC0LXRgNC40YDQvtCy0LDQvdC40LVcbiAgICAgKiDQvNC10YLQvtC0LiDQn9GA0Lgg0Y3RgtC+0Lwg0LLQvdC10YjQvdGP0Y8g0YTRg9C90LrRhtC40Y8g0LjRgtC10YDQuNGA0L7QstCw0L3QuNGPINC40YHQv9C+0LvRjNC30L7QstCw0L3QsCDQvdC1INCx0YPQtNC10YIuXG4gICAgICovXG4gICAgaWYgKHRoaXMuZGVtb01vZGUuaXNFbmFibGUpIHtcbiAgICAgIHRoaXMuaXRlcmF0aW9uQ2FsbGJhY2sgPSB0aGlzLmRlbW9JdGVyYXRpb25DYWxsYmFja1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDQktGL0YfQuNGB0LvRj9C10YIg0L3QsNCx0L7RgCDQstGB0L/QvtC80L7Qs9Cw0YLQtdC70YzQvdGL0YUg0LrQvtC90YHRgtCw0L3RgiB7QGxpbmsgVVNFRlVMX0NPTlNUU30sINGF0YDQsNC90Y/RidC40YUg0YDQtdC30YPQu9GM0YLQsNGC0Ysg0LDQu9Cz0LXQsdGA0LDQuNGH0LXRgdC60LjRhSDQuFxuICAgKiDRgtGA0LjQs9C+0L3QvtC80LXRgtGA0LjRh9C10YHQutC40YUg0LLRi9GH0LjRgdC70LXQvdC40LksINC40YHQv9C+0LvRjNC30YPQtdC80YvRhSDQsiDRgNCw0YHRh9C10YLQsNGFINCy0LXRgNGI0LjQvSDQv9C+0LvQuNCz0L7QvdC+0LIg0Lgg0LzQsNGC0YDQuNGGINGC0YDQsNC90YHRhNC+0YDQvNCw0YbQuNC4LlxuICAgKlxuICAgKiBAcmVtYXJrc1xuICAgKiDQotCw0LrQuNC1INC60L7QvdGB0YLQsNC90YLRiyDQv9C+0LfQstC+0LvRj9GO0YIg0LLRi9C90LXRgdGC0Lgg0LfQsNGC0YDQsNGC0L3Ri9C1INC00LvRjyDQv9GA0L7RhtC10YHRgdC+0YDQsCDQvtC/0LXRgNCw0YbQuNC4INC30LAg0L/RgNC10LTQtdC70Ysg0LzQvdC+0LPQvtC60YDQsNGC0L3QviDQuNGB0L/QvtC70YzQt9GD0LXQvNGL0YUg0YTRg9C90LrRhtC40LlcbiAgICog0YPQstC10LvQuNGH0LjQstCw0Y8g0L/RgNC+0LjQt9Cy0L7QtNC40YLQtdC70YzQvdC+0YHRgtGMINC/0YDQuNC70L7QttC10L3QuNGPINC90LAg0Y3RgtCw0L/QsNGFINC/0L7QtNCz0L7RgtC+0LLQutC4INC00LDQvdC90YvRhSDQuCDRgNC10L3QtNC10YDQuNC90LPQsC5cbiAgICovXG4gIHByb3RlY3RlZCBzZXRVc2VmdWxDb25zdGFudHMoKTogdm9pZCB7XG5cbiAgICAvLyDQmtC+0L3RgdGC0LDQvdGC0YssINC30LDQstC40YHRj9GJ0LjQtSDQvtGCINGA0LDQt9C80LXRgNCwINC/0L7Qu9C40LPQvtC90LAuXG4gICAgdGhpcy5VU0VGVUxfQ09OU1RTWzBdID0gdGhpcy5wb2x5Z29uU2l6ZSAvIDJcbiAgICB0aGlzLlVTRUZVTF9DT05TVFNbMV0gPSB0aGlzLlVTRUZVTF9DT05TVFNbMF0gLyBNYXRoLmNvcyhNYXRoLlBJIC8gNilcbiAgICB0aGlzLlVTRUZVTF9DT05TVFNbMl0gPSB0aGlzLlVTRUZVTF9DT05TVFNbMF0gKiBNYXRoLnRhbihNYXRoLlBJIC8gNilcblxuICAgIC8vINCa0L7QvdGB0YLQsNC90YLRiywg0LfQsNCy0LjRgdGP0YnQuNC1INC+0YIg0YHRgtC10L/QtdC90Lgg0LTQtdGC0LDQu9C40LfQsNGG0LjQuCDQutGA0YPQs9CwINC4INGA0LDQt9C80LXRgNCwINC/0L7Qu9C40LPQvtC90LAuXG4gICAgdGhpcy5VU0VGVUxfQ09OU1RTWzNdID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLmNpcmNsZUFwcHJveExldmVsKVxuICAgIHRoaXMuVVNFRlVMX0NPTlNUU1s0XSA9IG5ldyBGbG9hdDMyQXJyYXkodGhpcy5jaXJjbGVBcHByb3hMZXZlbClcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jaXJjbGVBcHByb3hMZXZlbDsgaSsrKSB7XG4gICAgICBjb25zdCBhbmdsZSA9IDIgKiBNYXRoLlBJICogaSAvIHRoaXMuY2lyY2xlQXBwcm94TGV2ZWxcbiAgICAgIHRoaXMuVVNFRlVMX0NPTlNUU1szXVtpXSA9IHRoaXMuVVNFRlVMX0NPTlNUU1swXSAqIE1hdGguY29zKGFuZ2xlKVxuICAgICAgdGhpcy5VU0VGVUxfQ09OU1RTWzRdW2ldID0gdGhpcy5VU0VGVUxfQ09OU1RTWzBdICogTWF0aC5zaW4oYW5nbGUpXG4gICAgfVxuXG4gICAgLy8g0JrQvtC90YHRgtCw0L3RgtGLLCDQt9Cw0LLQuNGB0Y/RidC40LUg0L7RgiDRgNCw0LfQvNC10YDQsCDQutCw0L3QstCw0YHQsC5cbiAgICB0aGlzLlVTRUZVTF9DT05TVFNbNV0gPSAyIC8gdGhpcy5jYW52YXMud2lkdGhcbiAgICB0aGlzLlVTRUZVTF9DT05TVFNbNl0gPSAyIC8gdGhpcy5jYW52YXMuaGVpZ2h0XG4gICAgdGhpcy5VU0VGVUxfQ09OU1RTWzddID0gMiAvIHRoaXMuY2FudmFzLmNsaWVudFdpZHRoXG4gICAgdGhpcy5VU0VGVUxfQ09OU1RTWzhdID0gLTIgLyB0aGlzLmNhbnZhcy5jbGllbnRIZWlnaHRcbiAgICB0aGlzLlVTRUZVTF9DT05TVFNbOV0gPSB0aGlzLmNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0XG4gICAgdGhpcy5VU0VGVUxfQ09OU1RTWzEwXSA9IHRoaXMuY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcFxuICB9XG5cbiAgLyoqXG4gICAqINCh0L7Qt9C00LDQtdGCINGI0LXQudC00LXRgCBXZWJHTC5cbiAgICpcbiAgICogQHBhcmFtIHNoYWRlclR5cGUg0KLQuNC/INGI0LXQudC00LXRgNCwLlxuICAgKiBAcGFyYW0gc2hhZGVyQ29kZSDQmtC+0LQg0YjQtdC50LTQtdGA0LAg0L3QsCDRj9C30YvQutC1IEdMU0wuXG4gICAqIEByZXR1cm5zINCh0L7Qt9C00LDQvdC90YvQuSDQvtCx0YrQtdC60YIg0YjQtdC50LTQtdGA0LAuXG4gICAqL1xuICBwcm90ZWN0ZWQgY3JlYXRlV2ViR2xTaGFkZXIoc2hhZGVyVHlwZTogV2ViR2xTaGFkZXJUeXBlLCBzaGFkZXJDb2RlOiBzdHJpbmcpOiBXZWJHTFNoYWRlciB7XG5cbiAgICAvLyDQodC+0LfQtNCw0L3QuNC1LCDQv9GA0LjQstGP0LfQutCwINC60L7QtNCwINC4INC60L7QvNC/0LjQu9GP0YbQuNGPINGI0LXQudC00LXRgNCwLlxuICAgIGNvbnN0IHNoYWRlciA9IHRoaXMuZ2wuY3JlYXRlU2hhZGVyKHRoaXMuZ2xbc2hhZGVyVHlwZV0pIGFzIFdlYkdMU2hhZGVyXG4gICAgdGhpcy5nbC5zaGFkZXJTb3VyY2Uoc2hhZGVyLCBzaGFkZXJDb2RlKVxuICAgIHRoaXMuZ2wuY29tcGlsZVNoYWRlcihzaGFkZXIpXG5cbiAgICBpZiAoIXRoaXMuZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKHNoYWRlciwgdGhpcy5nbC5DT01QSUxFX1NUQVRVUykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcign0J7RiNC40LHQutCwINC60L7QvNC/0LjQu9GP0YbQuNC4INGI0LXQudC00LXRgNCwIFsnICsgc2hhZGVyVHlwZSArICddLiAnICsgdGhpcy5nbC5nZXRTaGFkZXJJbmZvTG9nKHNoYWRlcikpXG4gICAgfVxuXG4gICAgLy8g0JLRi9Cy0L7QtCDQvtGC0LvQsNC00L7Rh9C90L7QuSDQuNC90YTQvtGA0LzQsNGG0LjQuC5cbiAgICBpZiAodGhpcy5kZWJ1Z01vZGUuaXNFbmFibGUpIHtcbiAgICAgIGNvbnNvbGUuZ3JvdXAoJyVj0KHQvtC30LTQsNC9INGI0LXQudC00LXRgCBbJyArIHNoYWRlclR5cGUgKyAnXScsIHRoaXMuZGVidWdNb2RlLmdyb3VwU3R5bGUpXG4gICAgICB7XG4gICAgICAgIGNvbnNvbGUubG9nKHNoYWRlckNvZGUpXG4gICAgICB9XG4gICAgICBjb25zb2xlLmdyb3VwRW5kKClcbiAgICB9XG5cbiAgICByZXR1cm4gc2hhZGVyXG4gIH1cblxuICAvKipcbiAgICog0KHQvtC30LTQsNC10YIg0L/RgNC+0LPRgNCw0LzQvNGDIFdlYkdMLlxuICAgKlxuICAgKiBAcGFyYW0ge1dlYkdMU2hhZGVyfSB2ZXJ0ZXhTaGFkZXIg0JLQtdGA0YjQuNC90L3Ri9C5INGI0LXQudC00LXRgC5cbiAgICogQHBhcmFtIHtXZWJHTFNoYWRlcn0gZnJhZ21lbnRTaGFkZXIg0KTRgNCw0LPQvNC10L3RgtC90YvQuSDRiNC10LnQtNC10YAuXG4gICAqL1xuICBwcm90ZWN0ZWQgY3JlYXRlV2ViR2xQcm9ncmFtKHZlcnRleFNoYWRlcjogV2ViR0xTaGFkZXIsIGZyYWdtZW50U2hhZGVyOiBXZWJHTFNoYWRlcik6IHZvaWQge1xuXG4gICAgdGhpcy5ncHVQcm9ncmFtID0gdGhpcy5nbC5jcmVhdGVQcm9ncmFtKCkgYXMgV2ViR0xQcm9ncmFtXG5cbiAgICB0aGlzLmdsLmF0dGFjaFNoYWRlcih0aGlzLmdwdVByb2dyYW0sIHZlcnRleFNoYWRlcilcbiAgICB0aGlzLmdsLmF0dGFjaFNoYWRlcih0aGlzLmdwdVByb2dyYW0sIGZyYWdtZW50U2hhZGVyKVxuICAgIHRoaXMuZ2wubGlua1Byb2dyYW0odGhpcy5ncHVQcm9ncmFtKVxuXG4gICAgaWYgKCF0aGlzLmdsLmdldFByb2dyYW1QYXJhbWV0ZXIodGhpcy5ncHVQcm9ncmFtLCB0aGlzLmdsLkxJTktfU1RBVFVTKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCfQntGI0LjQsdC60LAg0YHQvtC30LTQsNC90LjRjyDQv9GA0L7Qs9GA0LDQvNC80YsgV2ViR0wuICcgKyB0aGlzLmdsLmdldFByb2dyYW1JbmZvTG9nKHRoaXMuZ3B1UHJvZ3JhbSkpXG4gICAgfVxuXG4gICAgdGhpcy5nbC51c2VQcm9ncmFtKHRoaXMuZ3B1UHJvZ3JhbSlcbiAgfVxuXG4gIC8qKlxuICAgKiDQo9GB0YLQsNC90LDQstC70LjQstCw0LXRgiDRgdCy0Y/Qt9GMINC/0LXRgNC10LzQtdC90L3QvtC5INC/0YDQuNC70L7QttC10L3QuNGPINGBINC/0YDQvtCz0YDQsNC80LzQvtC5IFdlYkdsLlxuICAgKlxuICAgKiBAcGFyYW0gdmFyVHlwZSDQotC40L8g0L/QtdGA0LXQvNC10L3QvdC+0LkuXG4gICAqIEBwYXJhbSB2YXJOYW1lINCY0LzRjyDQv9C10YDQtdC80LXQvdC90L7QuS5cbiAgICovXG4gIHByb3RlY3RlZCBzZXRXZWJHbFZhcmlhYmxlKHZhclR5cGU6IFdlYkdsVmFyaWFibGVUeXBlLCB2YXJOYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAodmFyVHlwZSA9PT0gJ3VuaWZvcm0nKSB7XG4gICAgICB0aGlzLnZhcmlhYmxlc1t2YXJOYW1lXSA9IHRoaXMuZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHRoaXMuZ3B1UHJvZ3JhbSwgdmFyTmFtZSlcbiAgICB9IGVsc2UgaWYgKHZhclR5cGUgPT09ICdhdHRyaWJ1dGUnKSB7XG4gICAgICB0aGlzLnZhcmlhYmxlc1t2YXJOYW1lXSA9IHRoaXMuZ2wuZ2V0QXR0cmliTG9jYXRpb24odGhpcy5ncHVQcm9ncmFtLCB2YXJOYW1lKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDQodC+0LfQtNCw0LXRgiDQuCDQt9Cw0L/QvtC70L3Rj9C10YIg0LTQsNC90L3Ri9C80Lgg0L7QsdC+INCy0YHQtdGFINC/0L7Qu9C40LPQvtC90LDRhSDQsdGD0YTQtdGA0YsgV2ViR0wuXG4gICAqL1xuICBwcm90ZWN0ZWQgY3JlYXRlV2JHbEJ1ZmZlcnMoKTogdm9pZCB7XG5cbiAgICAvLyDQktGL0LLQvtC0INC+0YLQu9Cw0LTQvtGH0L3QvtC5INC40L3RhNC+0YDQvNCw0YbQuNC4LlxuICAgIGlmICh0aGlzLmRlYnVnTW9kZS5pc0VuYWJsZSkge1xuICAgICAgY29uc29sZS5sb2coJyVj0JfQsNC/0YPRidC10L0g0L/RgNC+0YbQtdGB0YEg0LfQsNCz0YDRg9C30LrQuCDQtNCw0L3QvdGL0YUgWycgKyB0aGlzLmdldEN1cnJlbnRUaW1lKCkgKyAnXS4uLicsIHRoaXMuZGVidWdNb2RlLmdyb3VwU3R5bGUpXG5cbiAgICAgIC8vINCX0LDQv9GD0YHQuiDQutC+0L3RgdC+0LvRjNC90L7Qs9C+INGC0LDQudC80LXRgNCwLCDQuNC30LzQtdGA0Y/RjtGJ0LXQs9C+INC00LvQuNGC0LXQu9GM0L3QvtGB0YLRjCDQv9GA0L7RhtC10YHRgdCwINC30LDQs9GA0YPQt9C60Lgg0LTQsNC90L3Ri9GFINCyINCy0LjQtNC10L7Qv9Cw0LzRj9GC0YwuXG4gICAgICBjb25zb2xlLnRpbWUoJ9CU0LvQuNGC0LXQu9GM0L3QvtGB0YLRjCcpXG4gICAgfVxuXG4gICAgbGV0IHBvbHlnb25Hcm91cDogU1Bsb3RQb2x5Z29uR3JvdXAgfCBudWxsXG5cbiAgICAvLyDQmNGC0LXRgNC40YDQvtCy0LDQvdC40LUg0LPRgNGD0L/QvyDQv9C+0LvQuNCz0L7QvdC+0LIuXG4gICAgd2hpbGUgKHBvbHlnb25Hcm91cCA9IHRoaXMuY3JlYXRlUG9seWdvbkdyb3VwKCkpIHtcblxuICAgICAgLy8g0KHQvtC30LTQsNC90LjQtSDQuCDQt9Cw0L/QvtC70L3QtdC90LjQtSDQsdGD0YTQtdGA0L7QsiDQtNCw0L3QvdGL0LzQuCDQviDRgtC10LrRg9GJ0LXQuSDQs9GA0YPQv9C/0LUg0L/QvtC70LjQs9C+0L3QvtCyLlxuICAgICAgdGhpcy5hZGRXYkdsQnVmZmVyKHRoaXMuYnVmZmVycy52ZXJ0ZXhCdWZmZXJzLCAnQVJSQVlfQlVGRkVSJywgbmV3IEZsb2F0MzJBcnJheShwb2x5Z29uR3JvdXAudmVydGljZXMpLCAwKVxuICAgICAgdGhpcy5hZGRXYkdsQnVmZmVyKHRoaXMuYnVmZmVycy5jb2xvckJ1ZmZlcnMsICdBUlJBWV9CVUZGRVInLCBuZXcgVWludDhBcnJheShwb2x5Z29uR3JvdXAuY29sb3JzKSwgMSlcbiAgICAgIHRoaXMuYWRkV2JHbEJ1ZmZlcih0aGlzLmJ1ZmZlcnMuaW5kZXhCdWZmZXJzLCAnRUxFTUVOVF9BUlJBWV9CVUZGRVInLCBuZXcgVWludDE2QXJyYXkocG9seWdvbkdyb3VwLmluZGljZXMpLCAyKVxuXG4gICAgICAvLyDQodGH0LXRgtGH0LjQuiDQutC+0LvQuNGH0LXRgdGC0LLQsCDQsdGD0YTQtdGA0L7Qsi5cbiAgICAgIHRoaXMuYnVmZmVycy5hbW91bnRPZkJ1ZmZlckdyb3VwcysrXG5cbiAgICAgIC8vINCh0YfQtdGC0YfQuNC6INC60L7Qu9C40YfQtdGB0YLQstCwINCy0LXRgNGI0LjQvSBHTC3RgtGA0LXRg9Cz0L7Qu9GM0L3QuNC60L7QsiDRgtC10LrRg9GJ0LXQuSDQs9GA0YPQv9C/0Ysg0LHRg9GE0LXRgNC+0LIuXG4gICAgICB0aGlzLmJ1ZmZlcnMuYW1vdW50T2ZHTFZlcnRpY2VzLnB1c2gocG9seWdvbkdyb3VwLmFtb3VudE9mR0xWZXJ0aWNlcylcblxuICAgICAgLy8g0KHRh9C10YLRh9C40Log0L7QsdGJ0LXQs9C+INC60L7Qu9C40YfQtdGB0YLQstCwINCy0LXRgNGI0LjQvSBHTC3RgtGA0LXRg9Cz0L7Qu9GM0L3QuNC60L7Qsi5cbiAgICAgIHRoaXMuYnVmZmVycy5hbW91bnRPZlRvdGFsR0xWZXJ0aWNlcyArPSBwb2x5Z29uR3JvdXAuYW1vdW50T2ZHTFZlcnRpY2VzXG4gICAgfVxuXG4gICAgLy8g0JLRi9Cy0L7QtCDQvtGC0LvQsNC00L7Rh9C90L7QuSDQuNC90YTQvtGA0LzQsNGG0LjQuC5cbiAgICBpZiAodGhpcy5kZWJ1Z01vZGUuaXNFbmFibGUpIHtcbiAgICAgIHRoaXMucmVwb3J0QWJvdXRPYmplY3RSZWFkaW5nKClcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICog0KHRh9C40YLRi9Cy0LDQtdGCINC00LDQvdC90YvQtSDQvtCxINC40YHRhdC+0LTQvdGL0YUg0L7QsdGK0LXQutGC0LDRhSDQuCDRhNC+0YDQvNC40YDRg9C10YIg0YHQvtC+0YLQstC10YLRgdCy0YPRjtGJ0YPRjiDRjdGC0LjQvCDQvtCx0YrQtdC60YLQsNC8INCz0YDRg9C/0L/RgyDQv9C+0LvQuNCz0L7QvdC+0LIuXG4gICAqXG4gICAqIEByZW1hcmtzXG4gICAqINCT0YDRg9C/0L/QsCDRhNC+0YDQvNC40YDRg9C10YLRgdGPINGBINGD0YfQtdGC0L7QvCDRgtC10YXQvdC40YfQtdGB0LrQvtCz0L4g0L7Qs9GA0LDQvdC40YfQtdC90LjRjyDQvdCwINC60L7Qu9C40YfQtdGB0YLQstC+INCy0LXRgNGI0LjQvSDQsiDQs9GA0YPQv9C/0LUg0Lgg0LvQuNC80LjRgtCwINC90LAg0L7QsdGJ0LXQtSDQutC+0LvQuNGH0LXRgdGC0LLQvlxuICAgKiDQv9C+0LvQuNCz0L7QvdC+0LIg0L3QsCDQutCw0L3QstCw0YHQtS5cbiAgICpcbiAgICogQHJldHVybnMg0KHQvtC30LTQsNC90L3QsNGPINCz0YDRg9C/0L/QsCDQv9C+0LvQuNCz0L7QvdC+0LIg0LjQu9C4IG51bGwsINC10YHQu9C4INGE0L7RgNC80LjRgNC+0LLQsNC90LjQtSDQstGB0LXRhSDQs9GA0YPQv9C/INC/0L7Qu9C40LPQvtC90L7QsiDQt9Cw0LLQtdGA0YjQuNC70L7RgdGMLlxuICAgKi9cbiAgcHJvdGVjdGVkIGNyZWF0ZVBvbHlnb25Hcm91cCgpOiBTUGxvdFBvbHlnb25Hcm91cCB8IG51bGwge1xuXG4gICAgbGV0IHBvbHlnb25Hcm91cDogU1Bsb3RQb2x5Z29uR3JvdXAgPSB7XG4gICAgICB2ZXJ0aWNlczogW10sXG4gICAgICBpbmRpY2VzOiBbXSxcbiAgICAgIGNvbG9yczogW10sXG4gICAgICBhbW91bnRPZlZlcnRpY2VzOiAwLFxuICAgICAgYW1vdW50T2ZHTFZlcnRpY2VzOiAwXG4gICAgfVxuXG4gICAgbGV0IHBvbHlnb246IFNQbG90UG9seWdvbiB8IG51bGxcblxuICAgIC8qKlxuICAgICAqINCV0YHQu9C4INC60L7Qu9C40YfQtdGB0YLQstC+INC/0L7Qu9C40LPQvtC90L7QsiDQutCw0L3QstCw0YHQsCDQtNC+0YHRgtC40LPQu9C+INC00L7Qv9GD0YHRgtC40LzQvtCz0L4g0LzQsNC60YHQuNC80YPQvNCwLCDRgtC+INC00LDQu9GM0L3QtdC50YjQsNGPINC+0LHRgNCw0LHQvtGC0LrQsCDQuNGB0YXQvtC00L3Ri9GFINC+0LHRitC10LrRgtC+0LJcbiAgICAgKiDQv9GA0LjQvtGB0YLQsNC90LDQstC70LjQstCw0LXRgtGB0Y8gLSDRhNC+0YDQvNC40YDQvtCy0LDQvdC40LUg0LPRgNGD0L/QvyDQv9C+0LvQuNCz0L7QvdC+0LIg0LfQsNCy0LXRgNGI0LDQtdGC0YHRjyDQstC+0LfQstGA0LDRgtC+0Lwg0LfQvdCw0YfQtdC90LjRjyBudWxsICjRgdC40LzRg9C70Y/RhtC40Y8g0LTQvtGB0YLQuNC20LXQvdC40Y9cbiAgICAgKiDQv9C+0YHQu9C10LTQvdC10LPQviDQvtCx0YDQsNCx0LDRgtGL0LLQsNC10LzQvtCz0L4g0LjRgdGF0L7QtNC90L7Qs9C+INC+0LHRitC10LrRgtCwKS5cbiAgICAgKi9cbiAgICBpZiAodGhpcy5hbW91bnRPZlBvbHlnb25zID49IHRoaXMubWF4QW1vdW50T2ZQb2x5Z29ucykgcmV0dXJuIG51bGxcblxuICAgIC8vINCY0YLQtdGA0LjRgNC+0LLQsNC90LjQtSDQuNGB0YXQvtC00L3Ri9GFINC+0LHRitC10LrRgtC+0LIuXG4gICAgd2hpbGUgKHBvbHlnb24gPSB0aGlzLml0ZXJhdGlvbkNhbGxiYWNrISgpKSB7XG5cbiAgICAgIC8vINCU0L7QsdCw0LLQu9C10L3QuNC1INCyINCz0YDRg9C/0L/RgyDQv9C+0LvQuNCz0L7QvdC+0LIg0L3QvtCy0L7Qs9C+INC/0L7Qu9C40LPQvtC90LAuXG4gICAgICB0aGlzLmFkZFBvbHlnb24ocG9seWdvbkdyb3VwLCBwb2x5Z29uKVxuXG4gICAgICAvLyDQodGH0LXRgtGH0LjQuiDRh9C40YHQu9CwINC/0YDQuNC80LXQvdC10L3QuNC5INC60LDQttC00L7QuSDQuNC3INGE0L7RgNC8INC/0L7Qu9C40LPQvtC90L7Qsi5cbiAgICAgIHRoaXMuYnVmZmVycy5hbW91bnRPZlNoYXBlc1twb2x5Z29uLnNoYXBlXSsrXG5cbiAgICAgIC8vINCh0YfQtdGC0YfQuNC6INC+0LHRidC10LPQviDQutC+0LvQuNGH0LXRgdGC0LLQviDQv9C+0LvQuNCz0L7QvdC+0LIuXG4gICAgICB0aGlzLmFtb3VudE9mUG9seWdvbnMrK1xuXG4gICAgICAvKipcbiAgICAgICAqINCV0YHQu9C4INC60L7Qu9C40YfQtdGB0YLQstC+INC/0L7Qu9C40LPQvtC90L7QsiDQutCw0L3QstCw0YHQsCDQtNC+0YHRgtC40LPQu9C+INC00L7Qv9GD0YHRgtC40LzQvtCz0L4g0LzQsNC60YHQuNC80YPQvNCwLCDRgtC+INC00LDQu9GM0L3QtdC50YjQsNGPINC+0LHRgNCw0LHQvtGC0LrQsCDQuNGB0YXQvtC00L3Ri9GFINC+0LHRitC10LrRgtC+0LJcbiAgICAgICAqINC/0YDQuNC+0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdGC0YHRjyAtINGE0L7RgNC80LjRgNC+0LLQsNC90LjQtSDQs9GA0YPQv9C/INC/0L7Qu9C40LPQvtC90L7QsiDQt9Cw0LLQtdGA0YjQsNC10YLRgdGPINCy0L7Qt9Cy0YDQsNGC0L7QvCDQt9C90LDRh9C10L3QuNGPIG51bGwgKNGB0LjQvNGD0LvRj9GG0LjRjyDQtNC+0YHRgtC40LbQtdC90LjRj1xuICAgICAgICog0L/QvtGB0LvQtdC00L3QtdCz0L4g0L7QsdGA0LDQsdCw0YLRi9Cy0LDQtdC80L7Qs9C+INC40YHRhdC+0LTQvdC+0LPQviDQvtCx0YrQtdC60YLQsCkuXG4gICAgICAgKi9cbiAgICAgIGlmICh0aGlzLmFtb3VudE9mUG9seWdvbnMgPj0gdGhpcy5tYXhBbW91bnRPZlBvbHlnb25zKSBicmVha1xuXG4gICAgICAvKipcbiAgICAgICAqINCV0YHQu9C4INC+0LHRidC10LUg0LrQvtC70LjRh9C10YHRgtCy0L4g0LLRgdC10YUg0LLQtdGA0YjQuNC9INCyINCz0YDRg9C/0L/QtSDQv9C+0LvQuNCz0L7QvdC+0LIg0L/RgNC10LLRi9GB0LjQu9C+INGC0LXRhdC90LjRh9C10YHQutC+0LUg0L7Qs9GA0LDQvdC40YfQtdC90LjQtSwg0YLQviDQs9GA0YPQv9C/0LAg0L/QvtC70LjQs9C+0L3QvtCyXG4gICAgICAgKiDRgdGH0LjRgtCw0LXRgtGB0Y8g0YHRhNC+0YDQvNC40YDQvtCy0LDQvdC90L7QuSDQuCDQuNGC0LXRgNC40YDQvtCy0LDQvdC40LUg0LjRgdGF0L7QtNC90YvRhSDQvtCx0YrQtdC60YLQvtCyINC/0YDQuNC+0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdGC0YHRjy5cbiAgICAgICAqL1xuICAgICAgaWYgKHBvbHlnb25Hcm91cC5hbW91bnRPZlZlcnRpY2VzID49IHRoaXMubWF4QW1vdW50T2ZWZXJ0ZXhQZXJQb2x5Z29uR3JvdXApIGJyZWFrXG4gICAgfVxuXG4gICAgLy8g0KHRh9C10YLRh9C40Log0L7QsdGJ0LXQs9C+INC60L7Qu9C40YfQtdGB0YLQstCwINCy0LXRgNGI0LjQvSDQstGB0LXRhSDQstC10YDRiNC40L3QvdGL0YUg0LHRg9GE0LXRgNC+0LIuXG4gICAgdGhpcy5idWZmZXJzLmFtb3VudE9mVG90YWxWZXJ0aWNlcyArPSBwb2x5Z29uR3JvdXAuYW1vdW50T2ZWZXJ0aWNlc1xuXG4gICAgLy8g0JXRgdC70Lgg0LPRgNGD0L/Qv9CwINC/0L7Qu9C40LPQvtC90L7QsiDQvdC10L/Rg9GB0YLQsNGPLCDRgtC+INCy0L7Qt9Cy0YDQsNGJ0LDQtdC8INC10LUuINCV0YHQu9C4INC/0YPRgdGC0LDRjyAtINCy0L7Qt9Cy0YDQsNGJ0LDQtdC8IG51bGwuXG4gICAgcmV0dXJuIChwb2x5Z29uR3JvdXAuYW1vdW50T2ZWZXJ0aWNlcyA+IDApID8gcG9seWdvbkdyb3VwIDogbnVsbFxuICB9XG5cbiAgLyoqXG4gICAqINCh0L7Qt9C00LDQtdGCINCyINC80LDRgdGB0LjQstC1INCx0YPRhNC10YDQvtCyIFdlYkdMINC90L7QstGL0Lkg0LHRg9GE0LXRgCDQuCDQt9Cw0L/QuNGB0YvQstCw0LXRgiDQsiDQvdC10LPQviDQv9C10YDQtdC00LDQvdC90YvQtSDQtNCw0L3QvdGL0LUuXG4gICAqXG4gICAqIEBwYXJhbSBidWZmZXJzIC0g0JzQsNGB0YHQuNCyINCx0YPRhNC10YDQvtCyIFdlYkdMLCDQsiDQutC+0YLQvtGA0YvQuSDQsdGD0LTQtdGCINC00L7QsdCw0LLQu9C10L0g0YHQvtC30LTQsNCy0LDQtdC80YvQuSDQsdGD0YTQtdGALlxuICAgKiBAcGFyYW0gdHlwZSAtINCi0LjQvyDRgdC+0LfQtNCw0LLQsNC10LzQvtCz0L4g0LHRg9GE0LXRgNCwLlxuICAgKiBAcGFyYW0gZGF0YSAtINCU0LDQvdC90YvQtSDQsiDQstC40LTQtSDRgtC40L/QuNC30LjRgNC+0LLQsNC90L3QvtCz0L4g0LzQsNGB0YHQuNCy0LAg0LTQu9GPINC30LDQv9C40YHQuCDQsiDRgdC+0LfQtNCw0LLQsNC10LzRi9C5INCx0YPRhNC10YAuXG4gICAqIEBwYXJhbSBrZXkgLSDQmtC70Y7RhyAo0LjQvdC00LXQutGBKSwg0LjQtNC10L3RgtC40YTQuNGG0LjRgNGD0Y7RidC40Lkg0YLQuNC/INCx0YPRhNC10YDQsCAo0LTQu9GPINCy0LXRgNGI0LjQvSwg0LTQu9GPINGG0LLQtdGC0L7Qsiwg0LTQu9GPINC40L3QtNC10LrRgdC+0LIpLiDQmNGB0L/QvtC70YzQt9GD0LXRgtGB0Y8g0LTQu9GPXG4gICAqICAgICDRgNCw0LfQtNC10LvRjNC90L7Qs9C+INC/0L7QtNGB0YfQtdGC0LAg0L/QsNC80Y/RgtC4LCDQt9Cw0L3QuNC80LDQtdC80L7QuSDQutCw0LbQtNGL0Lwg0YLQuNC/0L7QvCDQsdGD0YTQtdGA0LAuXG4gICAqL1xuICBwcm90ZWN0ZWQgYWRkV2JHbEJ1ZmZlcihidWZmZXJzOiBXZWJHTEJ1ZmZlcltdLCB0eXBlOiBXZWJHbEJ1ZmZlclR5cGUsIGRhdGE6IFR5cGVkQXJyYXksIGtleTogbnVtYmVyKTogdm9pZCB7XG5cbiAgICAvLyDQntC/0YDQtdC00LXQu9C10L3QuNC1INC40L3QtNC10LrRgdCwINC90L7QstC+0LPQviDRjdC70LXQvNC10L3RgtCwINCyINC80LDRgdGB0LjQstC1INCx0YPRhNC10YDQvtCyIFdlYkdMLlxuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5idWZmZXJzLmFtb3VudE9mQnVmZmVyR3JvdXBzXG5cbiAgICAvLyDQodC+0LfQtNCw0L3QuNC1INC4INC30LDQv9C+0LvQvdC10L3QuNC1INC00LDQvdC90YvQvNC4INC90L7QstC+0LPQviDQsdGD0YTQtdGA0LAuXG4gICAgYnVmZmVyc1tpbmRleF0gPSB0aGlzLmdsLmNyZWF0ZUJ1ZmZlcigpIVxuICAgIHRoaXMuZ2wuYmluZEJ1ZmZlcih0aGlzLmdsW3R5cGVdLCBidWZmZXJzW2luZGV4XSlcbiAgICB0aGlzLmdsLmJ1ZmZlckRhdGEodGhpcy5nbFt0eXBlXSwgZGF0YSwgdGhpcy5nbC5TVEFUSUNfRFJBVylcblxuICAgIC8vINCh0YfQtdGC0YfQuNC6INC/0LDQvNGP0YLQuCwg0LfQsNC90LjQvNCw0LXQvNC+0Lkg0LHRg9GE0LXRgNCw0LzQuCDQtNCw0L3QvdGL0YUgKNGA0LDQt9C00LXQu9GM0L3QviDQv9C+INC60LDQttC00L7QvNGDINGC0LjQv9GDINCx0YPRhNC10YDQvtCyKVxuICAgIHRoaXMuYnVmZmVycy5zaXplSW5CeXRlc1trZXldICs9IGRhdGEubGVuZ3RoICogZGF0YS5CWVRFU19QRVJfRUxFTUVOVFxuICB9XG5cbiAgLyoqXG4gICAqINCS0YvRh9C40YHQu9GP0LXRgiDQutC+0L7RgNC00LjQvdCw0YLRiyDQstC10YDRiNC40L0g0L/QvtC70LjQs9C+0L3QsCDRgtGA0LXRg9Cz0L7Qu9GM0L3QvtC5INGE0L7RgNC80YsuXG4gICAqINCi0LjQvyDRhNGD0L3QutGG0LjQuDoge0BsaW5rIFNQbG90Q2FsY1NoYXBlRnVuY31cbiAgICpcbiAgICogQHBhcmFtIHggLSDQn9C+0LvQvtC20LXQvdC40LUg0YbQtdC90YLRgNCwINC/0L7Qu9C40LPQvtC90LAg0L3QsCDQvtGB0Lgg0LDQsdGB0YbQuNGB0YEuXG4gICAqIEBwYXJhbSB5IC0g0J/QvtC70L7QttC10L3QuNC1INGG0LXQvdGC0YDQsCDQv9C+0LvQuNCz0L7QvdCwINC90LAg0L7RgdC4INC+0YDQtNC40L3QsNGCLlxuICAgKiBAcGFyYW0gY29uc3RzIC0g0J3QsNCx0L7RgCDQstGB0L/QvtC80L7Qs9Cw0YLQtdC70YzQvdGL0YUg0LrQvtC90YHRgtCw0L3Rgiwg0LjRgdC/0L7Qu9GM0LfRg9C10LzRi9GFINC00LvRjyDQstGL0YfQuNGB0LvQtdC90LjRjyDQstC10YDRiNC40L0uXG4gICAqIEByZXR1cm5zINCU0LDQvdC90YvQtSDQviDQstC10YDRiNC40L3QsNGFINC/0L7Qu9C40LPQvtC90LAuXG4gICAqL1xuICBwcm90ZWN0ZWQgZ2V0VmVydGljZXNPZlRyaWFuZ2xlKHg6IG51bWJlciwgeTogbnVtYmVyLCBjb25zdHM6IGFueVtdKTogU1Bsb3RQb2x5Z29uVmVydGljZXMge1xuXG4gICAgY29uc3QgW3gxLCB5MV0gPSBbeCAtIGNvbnN0c1swXSwgeSArIGNvbnN0c1syXV1cbiAgICBjb25zdCBbeDIsIHkyXSA9IFt4LCB5IC0gY29uc3RzWzFdXVxuICAgIGNvbnN0IFt4MywgeTNdID0gW3ggKyBjb25zdHNbMF0sIHkgKyBjb25zdHNbMl1dXG5cbiAgICBjb25zdCB2ZXJ0aWNlcyA9IHtcbiAgICAgIHZhbHVlczogW3gxLCB5MSwgeDIsIHkyLCB4MywgeTNdLFxuICAgICAgaW5kaWNlczogWzAsIDEsIDJdXG4gICAgfVxuXG4gICAgcmV0dXJuIHZlcnRpY2VzXG4gIH1cblxuICAvKipcbiAgICog0JLRi9GH0LjRgdC70Y/QtdGCINC60L7QvtGA0LTQuNC90LDRgtGLINCy0LXRgNGI0LjQvSDQv9C+0LvQuNCz0L7QvdCwINC60LLQsNC00YDQsNGC0L3QvtC5INGE0L7RgNC80YsuXG4gICAqINCi0LjQvyDRhNGD0L3QutGG0LjQuDoge0BsaW5rIFNQbG90Q2FsY1NoYXBlRnVuY31cbiAgICpcbiAgICogQHBhcmFtIHggLSDQn9C+0LvQvtC20LXQvdC40LUg0YbQtdC90YLRgNCwINC/0L7Qu9C40LPQvtC90LAg0L3QsCDQvtGB0Lgg0LDQsdGB0YbQuNGB0YEuXG4gICAqIEBwYXJhbSB5IC0g0J/QvtC70L7QttC10L3QuNC1INGG0LXQvdGC0YDQsCDQv9C+0LvQuNCz0L7QvdCwINC90LAg0L7RgdC4INC+0YDQtNC40L3QsNGCLlxuICAgKiBAcGFyYW0gY29uc3RzIC0g0J3QsNCx0L7RgCDQstGB0L/QvtC80L7Qs9Cw0YLQtdC70YzQvdGL0YUg0LrQvtC90YHRgtCw0L3Rgiwg0LjRgdC/0L7Qu9GM0LfRg9C10LzRi9GFINC00LvRjyDQstGL0YfQuNGB0LvQtdC90LjRjyDQstC10YDRiNC40L0uXG4gICAqIEByZXR1cm5zINCU0LDQvdC90YvQtSDQviDQstC10YDRiNC40L3QsNGFINC/0L7Qu9C40LPQvtC90LAuXG4gICAqL1xuICBwcm90ZWN0ZWQgZ2V0VmVydGljZXNPZlNxdWFyZSh4OiBudW1iZXIsIHk6IG51bWJlciwgY29uc3RzOiBhbnlbXSk6IFNQbG90UG9seWdvblZlcnRpY2VzIHtcblxuICAgIGNvbnN0IFt4MSwgeTFdID0gW3ggLSBjb25zdHNbMF0sIHkgLSBjb25zdHNbMF1dXG4gICAgY29uc3QgW3gyLCB5Ml0gPSBbeCArIGNvbnN0c1swXSwgeSArIGNvbnN0c1swXV1cblxuICAgIGNvbnN0IHZlcnRpY2VzID0ge1xuICAgICAgdmFsdWVzOiBbeDEsIHkxLCB4MiwgeTEsIHgyLCB5MiwgeDEsIHkyXSxcbiAgICAgIGluZGljZXM6IFswLCAxLCAyLCAwLCAyLCAzXVxuICAgIH1cblxuICAgIHJldHVybiB2ZXJ0aWNlc1xuICB9XG5cbiAgLyoqXG4gICAqINCS0YvRh9C40YHQu9GP0LXRgiDQutC+0L7RgNC00LjQvdCw0YLRiyDQstC10YDRiNC40L0g0L/QvtC70LjQs9C+0L3QsCDQutGA0YPQs9C70L7QuSDRhNC+0YDQvNGLLlxuICAgKiDQotC40L8g0YTRg9C90LrRhtC40Lg6IHtAbGluayBTUGxvdENhbGNTaGFwZUZ1bmN9XG4gICAqXG4gICAqIEBwYXJhbSB4IC0g0J/QvtC70L7QttC10L3QuNC1INGG0LXQvdGC0YDQsCDQv9C+0LvQuNCz0L7QvdCwINC90LAg0L7RgdC4INCw0LHRgdGG0LjRgdGBLlxuICAgKiBAcGFyYW0geSAtINCf0L7Qu9C+0LbQtdC90LjQtSDRhtC10L3RgtGA0LAg0L/QvtC70LjQs9C+0L3QsCDQvdCwINC+0YHQuCDQvtGA0LTQuNC90LDRgi5cbiAgICogQHBhcmFtIGNvbnN0cyAtINCd0LDQsdC+0YAg0LLRgdC/0L7QvNC+0LPQsNGC0LXQu9GM0L3Ri9GFINC60L7QvdGB0YLQsNC90YIsINC40YHQv9C+0LvRjNC30YPQtdC80YvRhSDQtNC70Y8g0LLRi9GH0LjRgdC70LXQvdC40Y8g0LLQtdGA0YjQuNC9LlxuICAgKiBAcmV0dXJucyDQlNCw0L3QvdGL0LUg0L4g0LLQtdGA0YjQuNC90LDRhSDQv9C+0LvQuNCz0L7QvdCwLlxuICAgKi9cbiAgcHJvdGVjdGVkIGdldFZlcnRpY2VzT2ZDaXJjbGUoeDogbnVtYmVyLCB5OiBudW1iZXIsIGNvbnN0czogYW55W10pOiBTUGxvdFBvbHlnb25WZXJ0aWNlcyB7XG5cbiAgICAvLyDQl9Cw0L3QtdGB0LXQvdC40LUg0LIg0L3QsNCx0L7RgCDQstC10YDRiNC40L0g0YbQtdC90YLRgNCwINC60YDRg9Cz0LAuXG4gICAgY29uc3QgdmVydGljZXM6IFNQbG90UG9seWdvblZlcnRpY2VzID0ge1xuICAgICAgdmFsdWVzOiBbeCwgeV0sXG4gICAgICBpbmRpY2VzOiBbXVxuICAgIH1cblxuICAgIC8vINCU0L7QsdCw0LLQu9C10L3QuNC1INCw0L/RgNC+0LrRgdC40LzQuNGA0YPRjtGJ0LjRhSDQvtC60YDRg9C20L3QvtGB0YLRjCDQutGA0YPQs9CwINCy0LXRgNGI0LjQvS5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbnN0c1szXS5sZW5ndGg7IGkrKykge1xuICAgICAgdmVydGljZXMudmFsdWVzLnB1c2goeCArIGNvbnN0c1szXVtpXSwgeSArIGNvbnN0c1s0XVtpXSlcbiAgICAgIHZlcnRpY2VzLmluZGljZXMucHVzaCgwLCBpICsgMSwgaSArIDIpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog0J/QvtGB0LvQtdC00L3Rj9GPINCy0LXRgNGI0LjQvdCwINC/0L7RgdC70LXQtNC90LXQs9C+IEdMLdGC0YDQtdGD0LPQvtC70YzQvdC40LrQsCDQt9Cw0LzQtdC90Y/QtdGC0YHRjyDQvdCwINC/0LXRgNCy0YPRjiDQsNC/0YDQvtC60YHQuNC80LjRgNGD0Y7RidGD0Y5cbiAgICAgKiDQvtC60YDRg9C20L3QvtGB0YLRjCDQutGA0YPQs9CwINCy0LXRgNGI0LjQvdGDLCDQt9Cw0LzRi9C60LDRjyDQsNC/0YDQvtC60YHQuNC80LjRgNGD0YnQuNC5INC60YDRg9CzINC/0L7Qu9C40LPQvtC9LlxuICAgICAqL1xuICAgIHZlcnRpY2VzLmluZGljZXNbdmVydGljZXMuaW5kaWNlcy5sZW5ndGggLSAxXSA9IDFcblxuICAgIHJldHVybiB2ZXJ0aWNlc1xuICB9XG5cbiAgLyoqXG4gICAqINCh0L7Qt9C00LDQtdGCINC4INC00L7QsdCw0LLQu9GP0LXRgiDQsiDQs9GA0YPQv9C/0YMg0L/QvtC70LjQs9C+0L3QvtCyINC90L7QstGL0Lkg0L/QvtC70LjQs9C+0L0uXG4gICAqXG4gICAqIEBwYXJhbSBwb2x5Z29uR3JvdXAgLSDQk9GA0YPQv9C/0LAg0L/QvtC70LjQs9C+0L3QvtCyLCDQsiDQutC+0YLQvtGA0YPRjiDQv9GA0L7QuNGB0YXQvtC00LjRgiDQtNC+0LHQsNCy0LvQtdC90LjQtS5cbiAgICogQHBhcmFtIHBvbHlnb24gLSDQmNC90YTQvtGA0LzQsNGG0LjRjyDQviDQtNC+0LHQsNCy0LvRj9C10LzQvtC8INC/0L7Qu9C40LPQvtC90LUuXG4gICAqL1xuICBwcm90ZWN0ZWQgYWRkUG9seWdvbihwb2x5Z29uR3JvdXA6IFNQbG90UG9seWdvbkdyb3VwLCBwb2x5Z29uOiBTUGxvdFBvbHlnb24pOiB2b2lkIHtcblxuICAgIC8qKlxuICAgICAqINCSINC30LDQstC40YHQuNC80L7RgdGC0Lgg0L7RgiDRhNC+0YDQvNGLINC/0L7Qu9C40LPQvtC90LAg0Lgg0LrQvtC+0YDQtNC40L3QsNGCINC10LPQviDRhtC10L3RgtGA0LAg0LLRi9C30YvQstCw0LXRgtGB0Y8g0YHQvtC+0YLQstC10YLRgdCy0YPRjtGJ0LDRjyDRhNGD0L3QutGG0LjRjyDQvdCw0YXQvtC20LTQtdC90LjRjyDQutC+0L7RgNC00LjQvdCw0YIg0LXQs9C+XG4gICAgICog0LLQtdGA0YjQuNC9LlxuICAgICAqL1xuICAgIGNvbnN0IHZlcnRpY2VzID0gdGhpcy5zaGFwZXNbcG9seWdvbi5zaGFwZV0uY2FsYyhcbiAgICAgIHBvbHlnb24ueCwgcG9seWdvbi55LCB0aGlzLlVTRUZVTF9DT05TVFNcbiAgICApXG5cbiAgICAvLyDQmtC+0LvQuNGH0LXRgdGC0LLQviDQstC10YDRiNC40L0gLSDRjdGC0L4g0LrQvtC70LjRh9C10YHRgtCy0L4g0L/QsNGAINGH0LjRgdC10Lsg0LIg0LzQsNGB0YHQuNCy0LUg0LLQtdGA0YjQuNC9LlxuICAgIGNvbnN0IGFtb3VudE9mVmVydGljZXMgPSBNYXRoLnRydW5jKHZlcnRpY2VzLnZhbHVlcy5sZW5ndGggLyAyKVxuXG4gICAgLy8g0J3QsNGF0L7QttC00LXQvdC40LUg0LjQvdC00LXQutGB0LAg0L/QtdGA0LLQvtC5INC00L7QsdCw0LLQu9GP0LXQvNC+0Lkg0LIg0LPRgNGD0L/Qv9GDINC/0L7Qu9C40LPQvtC90L7QsiDQstC10YDRiNC40L3Riy5cbiAgICBjb25zdCBpbmRleE9mTGFzdFZlcnRleCA9IHBvbHlnb25Hcm91cC5hbW91bnRPZlZlcnRpY2VzXG5cbiAgICAvKipcbiAgICAgKiDQndC+0LzQtdGA0LAg0LjQvdC00LXQutGB0L7QsiDQstC10YDRiNC40L0gLSDQvtGC0L3QvtGB0LjRgtC10LvRjNC90YvQtS4g0JTQu9GPINCy0YvRh9C40YHQu9C10L3QuNGPINCw0LHRgdC+0LvRjtGC0L3Ri9GFINC40L3QtNC10LrRgdC+0LIg0L3QtdC+0LHRhdC+0LTQuNC80L4g0L/RgNC40LHQsNCy0LjRgtGMINC6INC+0YLQvdC+0YHQuNGC0LXQu9GM0L3Ri9C8XG4gICAgICog0LjQvdC00LXQutGB0LDQvCDQuNC90LTQtdC60YEg0L/QtdGA0LLQvtC5INC00L7QsdCw0LLQu9GP0LXQvNC+0Lkg0LIg0LPRgNGD0L/Qv9GDINC/0L7Qu9C40LPQvtC90L7QsiDQstC10YDRiNC40L3Riy5cbiAgICAgKi9cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZlcnRpY2VzLmluZGljZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZlcnRpY2VzLmluZGljZXNbaV0gKz0gaW5kZXhPZkxhc3RWZXJ0ZXhcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDQlNC+0LHQsNCy0LvQtdC90LjQtSDQsiDQs9GA0YPQv9C/0YMg0L/QvtC70LjQs9C+0L3QvtCyINC40L3QtNC10LrRgdC+0LIg0LLQtdGA0YjQuNC9INC90L7QstC+0LPQviDQv9C+0LvQuNCz0L7QvdCwINC4INC/0L7QtNGB0YfQtdGCINC+0LHRidC10LPQviDQutC+0LvQuNGH0LXRgdGC0LLQsCDQstC10YDRiNC40L0gR0wt0YLRgNC10YPQs9C+0LvRjNC90LjQutC+0LJcbiAgICAgKiDQsiDQs9GA0YPQv9C/0LUuXG4gICAgICovXG4gICAgcG9seWdvbkdyb3VwLmluZGljZXMucHVzaCguLi52ZXJ0aWNlcy5pbmRpY2VzKVxuICAgIHBvbHlnb25Hcm91cC5hbW91bnRPZkdMVmVydGljZXMgKz0gdmVydGljZXMuaW5kaWNlcy5sZW5ndGhcblxuICAgIC8vINCU0L7QsdCw0LLQu9C10L3QuNC1INCyINCz0YDRg9C/0L/RgyDQv9C+0LvQuNCz0L7QvdC+0LIg0LLQtdGA0YjQuNC9INC90L7QstC+0LPQviDQv9C+0LvQuNCz0L7QvdCwINC4INC/0L7QtNGB0YfQtdGCINC+0LHRidC10LPQviDQutC+0LvQuNGH0LXRgdGC0LLQsCDQstC10YDRiNC40L0g0LIg0LPRgNGD0L/Qv9C1LlxuICAgIHBvbHlnb25Hcm91cC52ZXJ0aWNlcy5wdXNoKC4uLnZlcnRpY2VzLnZhbHVlcylcbiAgICBwb2x5Z29uR3JvdXAuYW1vdW50T2ZWZXJ0aWNlcyArPSBhbW91bnRPZlZlcnRpY2VzXG5cbiAgICAvLyDQlNC+0LHQsNCy0LvQtdC90LjQtSDRhtCy0LXRgtC+0LIg0LLQtdGA0YjQuNC9IC0g0L/QviDQvtC00L3QvtC80YMg0YbQstC10YLRgyDQvdCwINC60LDQttC00YPRjiDQstC10YDRiNC40L3Rgy5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFtb3VudE9mVmVydGljZXM7IGkrKykge1xuICAgICAgcG9seWdvbkdyb3VwLmNvbG9ycy5wdXNoKHBvbHlnb24uY29sb3IpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqINCS0YvQstC+0LTQuNGCINCx0LDQt9C+0LLRg9GOINGH0LDRgdGC0Ywg0L7RgtC70LDQtNC+0YfQvdC+0Lkg0LjQvdGE0L7RgNC80LDRhtC40LguXG4gICAqXG4gICAqIEBwYXJhbSBvcHRpb25zIC0g0J/QvtC70YzQt9C+0LLQsNGC0LXQu9GM0YHQutC40LUg0L3QsNGB0YLRgNC+0LnQutC4INGN0LrQt9C10LzQv9C70Y/RgNCwLlxuICAgKi9cbiAgcHJvdGVjdGVkIHJlcG9ydE1haW5JbmZvKG9wdGlvbnM6IFNQbG90T3B0aW9ucyk6IHZvaWQge1xuXG4gICAgY29uc29sZS5sb2coJyVj0JLQutC70Y7Rh9C10L0g0YDQtdC20LjQvCDQvtGC0LvQsNC00LrQuCAnICsgdGhpcy5jb25zdHJ1Y3Rvci5uYW1lICsgJyDQvdCwINC+0LHRitC10LrRgtC1IFsjJyArIHRoaXMuY2FudmFzLmlkICsgJ10nLFxuICAgICAgdGhpcy5kZWJ1Z01vZGUuaGVhZGVyU3R5bGUpXG5cbiAgICBpZiAodGhpcy5kZW1vTW9kZS5pc0VuYWJsZSkge1xuICAgICAgY29uc29sZS5sb2coJyVj0JLQutC70Y7Rh9C10L0g0LTQtdC80L7QvdGB0YLRgNCw0YbQuNC+0L3QvdGL0Lkg0YDQtdC20LjQvCDQtNCw0L3QvdGL0YUnLCB0aGlzLmRlYnVnTW9kZS5ncm91cFN0eWxlKVxuICAgIH1cblxuICAgIGNvbnNvbGUuZ3JvdXAoJyVj0J/RgNC10LTRg9C/0YDQtdC20LTQtdC90LjQtScsIHRoaXMuZGVidWdNb2RlLmdyb3VwU3R5bGUpXG4gICAge1xuICAgICAgY29uc29sZS5kaXIoJ9Ce0YLQutGA0YvRgtCw0Y8g0LrQvtC90YHQvtC70Ywg0LHRgNCw0YPQt9C10YDQsCDQuCDQtNGA0YPQs9C40LUg0LDQutGC0LjQstC90YvQtSDRgdGA0LXQtNGB0YLQstCwINC60L7QvdGC0YDQvtC70Y8g0YDQsNC30YDQsNCx0L7RgtC60Lgg0YHRg9GJ0LXRgdGC0LLQtdC90L3QviDRgdC90LjQttCw0Y7RgiDQv9GA0L7QuNC30LLQvtC00LjRgtC10LvRjNC90L7RgdGC0Ywg0LLRi9GB0L7QutC+0L3QsNCz0YDRg9C20LXQvdC90YvRhSDQv9GA0LjQu9C+0LbQtdC90LjQuS4g0JTQu9GPINC+0LHRitC10LrRgtC40LLQvdC+0LPQviDQsNC90LDQu9C40LfQsCDQv9GA0L7QuNC30LLQvtC00LjRgtC10LvRjNC90L7RgdGC0Lgg0LLRgdC1INC/0L7QtNC+0LHQvdGL0LUg0YHRgNC10LTRgdGC0LLQsCDQtNC+0LvQttC90Ysg0LHRi9GC0Ywg0L7RgtC60LvRjtGH0LXQvdGLLCDQsCDQutC+0L3RgdC+0LvRjCDQsdGA0LDRg9C30LXRgNCwINC30LDQutGA0YvRgtCwLiDQndC10LrQvtGC0L7RgNGL0LUg0LTQsNC90L3Ri9C1INC+0YLQu9Cw0LTQvtGH0L3QvtC5INC40L3RhNC+0YDQvNCw0YbQuNC4INCyINC30LDQstC40YHQuNC80L7RgdGC0Lgg0L7RgiDQuNGB0L/QvtC70YzQt9GD0LXQvNC+0LPQviDQsdGA0LDRg9C30LXRgNCwINC80L7Qs9GD0YIg0L3QtSDQvtGC0L7QsdGA0LDQttCw0YLRjNGB0Y8g0LjQu9C4INC+0YLQvtCx0YDQsNC20LDRgtGM0YHRjyDQvdC10LrQvtGA0YDQtdC60YLQvdC+LiDQodGA0LXQtNGB0YLQstC+INC+0YLQu9Cw0LTQutC4INC/0YDQvtGC0LXRgdGC0LjRgNC+0LLQsNC90L4g0LIg0LHRgNCw0YPQt9C10YDQtSBHb29nbGUgQ2hyb21lIHYuOTAnKVxuICAgIH1cbiAgICBjb25zb2xlLmdyb3VwRW5kKClcblxuICAgIGNvbnNvbGUuZ3JvdXAoJyVj0JLQuNC00LXQvtGB0LjRgdGC0LXQvNCwJywgdGhpcy5kZWJ1Z01vZGUuZ3JvdXBTdHlsZSlcbiAgICB7XG4gICAgICBsZXQgZXh0ID0gdGhpcy5nbC5nZXRFeHRlbnNpb24oJ1dFQkdMX2RlYnVnX3JlbmRlcmVyX2luZm8nKVxuICAgICAgbGV0IGdyYXBoaWNzQ2FyZE5hbWUgPSAoZXh0KSA/IHRoaXMuZ2wuZ2V0UGFyYW1ldGVyKGV4dC5VTk1BU0tFRF9SRU5ERVJFUl9XRUJHTCkgOiAnW9C90LXQuNC30LLQtdGB0YLQvdC+XSdcbiAgICAgIGNvbnNvbGUubG9nKCfQk9GA0LDRhNC40YfQtdGB0LrQsNGPINC60LDRgNGC0LA6ICcgKyBncmFwaGljc0NhcmROYW1lKVxuICAgICAgY29uc29sZS5sb2coJ9CS0LXRgNGB0LjRjyBHTDogJyArIHRoaXMuZ2wuZ2V0UGFyYW1ldGVyKHRoaXMuZ2wuVkVSU0lPTikpXG4gICAgfVxuICAgIGNvbnNvbGUuZ3JvdXBFbmQoKVxuXG4gICAgY29uc29sZS5ncm91cCgnJWPQndCw0YHRgtGA0L7QudC60LAg0L/QsNGA0LDQvNC10YLRgNC+0LIg0Y3QutC30LXQvNC/0LvRj9GA0LAnLCB0aGlzLmRlYnVnTW9kZS5ncm91cFN0eWxlKVxuICAgIHtcbiAgICAgIGNvbnNvbGUuZGlyKHRoaXMpXG4gICAgICBjb25zb2xlLmxvZygn0J/QvtC70YzQt9C+0LLQsNGC0LXQu9GM0YHQutC40LUg0L3QsNGB0YLRgNC+0LnQutC4OlxcbicsIGpzb25TdHJpbmdpZnkob3B0aW9ucykpXG4gICAgICBjb25zb2xlLmxvZygn0JrQsNC90LLQsNGBOiAjJyArIHRoaXMuY2FudmFzLmlkKVxuICAgICAgY29uc29sZS5sb2coJ9Cg0LDQt9C80LXRgCDQutCw0L3QstCw0YHQsDogJyArIHRoaXMuY2FudmFzLndpZHRoICsgJyB4ICcgKyB0aGlzLmNhbnZhcy5oZWlnaHQgKyAnIHB4JylcbiAgICAgIGNvbnNvbGUubG9nKCfQoNCw0LfQvNC10YAg0L/Qu9C+0YHQutC+0YHRgtC4OiAnICsgdGhpcy5ncmlkU2l6ZS53aWR0aCArICcgeCAnICsgdGhpcy5ncmlkU2l6ZS5oZWlnaHQgKyAnIHB4JylcbiAgICAgIGNvbnNvbGUubG9nKCfQoNCw0LfQvNC10YAg0L/QvtC70LjQs9C+0L3QsDogJyArIHRoaXMucG9seWdvblNpemUgKyAnIHB4JylcbiAgICAgIGNvbnNvbGUubG9nKCfQkNC/0YDQvtC60YHQuNC80LDRhtC40Y8g0L7QutGA0YPQttC90L7RgdGC0Lg6ICcgKyB0aGlzLmNpcmNsZUFwcHJveExldmVsICsgJyDRg9Cz0LvQvtCyJylcblxuICAgICAgLyoqXG4gICAgICAgKiBAdG9kbyDQntCx0YDQsNCx0L7RgtCw0YLRjCDRjdGC0L7RgiDQstGL0LLQvtC0INCyINC30LDQstC40YHQuNC80L7RgdGC0Lgg0L7RgiDRgdC/0L7RgdC+0LHQsCDQv9C+0LvRg9GH0LXQvdC40Y8g0LTQsNC90L3Ri9GFINC+INC/0L7Qu9C40LPQvtC90LDRhS4g0JLQstC10YHRgtC4INGC0LjQv9GLIC0g0LfQsNC00LDQvdC90LDRj1xuICAgICAgICog0YTRg9C90LrRhtC40Y8g0LjRgtC10YDQuNGA0L7QstCw0L3QuNGPLCDQtNC10LzQvi3QuNGC0LXRgNC40YDQvtCy0LDQvdC40LUsINC/0LXRgNC10LTQsNC90L3Ri9C5INC80LDRgdGB0LjQsiDQtNCw0L3QvdGL0YUuXG4gICAgICAgKi9cbiAgICAgIGlmICh0aGlzLmRlbW9Nb2RlLmlzRW5hYmxlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCfQodC/0L7RgdC+0LEg0L/QvtC70YPRh9C10L3QuNGPINC00LDQvdC90YvRhTogJyArICfQtNC10LzQvtC90YHRgtGA0LDRhtC40L7QvdC90LDRjyDRhNGD0L3QutGG0LjRjyDQuNGC0LXRgNC40YDQvtCy0LDQvdC40Y8nKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5sb2coJ9Ch0L/QvtGB0L7QsSDQv9C+0LvRg9GH0LXQvdC40Y8g0LTQsNC90L3Ri9GFOiAnICsgJ9C/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjNGB0LrQsNGPINGE0YPQvdC60YbQuNGPINC40YLQtdGA0LjRgNC+0LLQsNC90LjRjycpXG4gICAgICB9XG4gICAgfVxuICAgIGNvbnNvbGUuZ3JvdXBFbmQoKVxuICB9XG5cbiAgLyoqXG4gICAqINCS0YvQstC+0LTQuNGCINCyINC60L7QvdGB0L7Qu9GMINC+0YLQu9Cw0LTQvtGH0L3Rg9GOINC40L3RhNC+0YDQvNCw0YbQuNGOINC+INC30LDQs9GA0YPQt9C60LUg0LTQsNC90L3Ri9GFINCyINCy0LjQtNC10L7Qv9Cw0LzRj9GC0YwuXG4gICAqL1xuICBwcm90ZWN0ZWQgcmVwb3J0QWJvdXRPYmplY3RSZWFkaW5nKCk6IHZvaWQge1xuXG4gICAgY29uc29sZS5ncm91cCgnJWPQl9Cw0LPRgNGD0LfQutCwINC00LDQvdC90YvRhSDQt9Cw0LLQtdGA0YjQtdC90LAgWycgKyB0aGlzLmdldEN1cnJlbnRUaW1lKCkgKyAnXScsIHRoaXMuZGVidWdNb2RlLmdyb3VwU3R5bGUpXG4gICAge1xuICAgICAgY29uc29sZS50aW1lRW5kKCfQlNC70LjRgtC10LvRjNC90L7RgdGC0YwnKVxuXG4gICAgICBjb25zb2xlLmxvZygn0KDQtdC30YPQu9GM0YLQsNGCOiAnICtcbiAgICAgICAgKCh0aGlzLmFtb3VudE9mUG9seWdvbnMgPj0gdGhpcy5tYXhBbW91bnRPZlBvbHlnb25zKSA/ICfQtNC+0YHRgtC40LPQvdGD0YIg0LfQsNC00LDQvdC90YvQuSDQu9C40LzQuNGCICgnICtcbiAgICAgICAgICB0aGlzLm1heEFtb3VudE9mUG9seWdvbnMudG9Mb2NhbGVTdHJpbmcoKSArICcpJyA6ICfQvtCx0YDQsNCx0L7RgtCw0L3RiyDQstGB0LUg0L7QsdGK0LXQutGC0YsnKSlcblxuICAgICAgY29uc29sZS5ncm91cCgn0JrQvtC7LdCy0L4g0L7QsdGK0LXQutGC0L7QsjogJyArIHRoaXMuYW1vdW50T2ZQb2x5Z29ucy50b0xvY2FsZVN0cmluZygpKVxuICAgICAge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc2hhcGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgY29uc3Qgc2hhcGVDYXBjdGlvbiA9IHRoaXMuc2hhcGVzW2ldLm5hbWVcbiAgICAgICAgICBjb25zdCBzaGFwZUFtb3VudCA9IHRoaXMuYnVmZmVycy5hbW91bnRPZlNoYXBlc1tpXVxuICAgICAgICAgIGNvbnNvbGUubG9nKHNoYXBlQ2FwY3Rpb24gKyAnOiAnICsgc2hhcGVBbW91bnQudG9Mb2NhbGVTdHJpbmcoKSArXG4gICAgICAgICAgICAnIFt+JyArIE1hdGgucm91bmQoMTAwICogc2hhcGVBbW91bnQgLyB0aGlzLmFtb3VudE9mUG9seWdvbnMpICsgJyVdJylcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnNvbGUubG9nKCfQmtC+0Lst0LLQviDRhtCy0LXRgtC+0LIg0LIg0L/QsNC70LjRgtGA0LU6ICcgKyB0aGlzLnBvbHlnb25QYWxldHRlLmxlbmd0aClcbiAgICAgIH1cbiAgICAgIGNvbnNvbGUuZ3JvdXBFbmQoKVxuXG4gICAgICBsZXQgYnl0ZXNVc2VkQnlCdWZmZXJzID0gdGhpcy5idWZmZXJzLnNpemVJbkJ5dGVzWzBdICsgdGhpcy5idWZmZXJzLnNpemVJbkJ5dGVzWzFdICsgdGhpcy5idWZmZXJzLnNpemVJbkJ5dGVzWzJdXG5cbiAgICAgIGNvbnNvbGUuZ3JvdXAoJ9CX0LDQvdGP0YLQviDQstC40LTQtdC+0L/QsNC80Y/RgtC4OiAnICsgKGJ5dGVzVXNlZEJ5QnVmZmVycyAvIDEwMDAwMDApLnRvRml4ZWQoMikudG9Mb2NhbGVTdHJpbmcoKSArICcg0JzQkScpXG4gICAgICB7XG4gICAgICAgIGNvbnNvbGUubG9nKCfQkdGD0YTQtdGA0Ysg0LLQtdGA0YjQuNC9OiAnICtcbiAgICAgICAgICAodGhpcy5idWZmZXJzLnNpemVJbkJ5dGVzWzBdIC8gMTAwMDAwMCkudG9GaXhlZCgyKS50b0xvY2FsZVN0cmluZygpICsgJyDQnNCRJyArXG4gICAgICAgICAgJyBbficgKyBNYXRoLnJvdW5kKDEwMCAqIHRoaXMuYnVmZmVycy5zaXplSW5CeXRlc1swXSAvIGJ5dGVzVXNlZEJ5QnVmZmVycykgKyAnJV0nKVxuXG4gICAgICAgIGNvbnNvbGUubG9nKCfQkdGD0YTQtdGA0Ysg0YbQstC10YLQvtCyOiAnXG4gICAgICAgICAgKyAodGhpcy5idWZmZXJzLnNpemVJbkJ5dGVzWzFdIC8gMTAwMDAwMCkudG9GaXhlZCgyKS50b0xvY2FsZVN0cmluZygpICsgJyDQnNCRJyArXG4gICAgICAgICAgJyBbficgKyBNYXRoLnJvdW5kKDEwMCAqIHRoaXMuYnVmZmVycy5zaXplSW5CeXRlc1sxXSAvIGJ5dGVzVXNlZEJ5QnVmZmVycykgKyAnJV0nKVxuXG4gICAgICAgIGNvbnNvbGUubG9nKCfQkdGD0YTQtdGA0Ysg0LjQvdC00LXQutGB0L7QsjogJ1xuICAgICAgICAgICsgKHRoaXMuYnVmZmVycy5zaXplSW5CeXRlc1syXSAvIDEwMDAwMDApLnRvRml4ZWQoMikudG9Mb2NhbGVTdHJpbmcoKSArICcg0JzQkScgK1xuICAgICAgICAgICcgW34nICsgTWF0aC5yb3VuZCgxMDAgKiB0aGlzLmJ1ZmZlcnMuc2l6ZUluQnl0ZXNbMl0gLyBieXRlc1VzZWRCeUJ1ZmZlcnMpICsgJyVdJylcbiAgICAgIH1cbiAgICAgIGNvbnNvbGUuZ3JvdXBFbmQoKVxuXG4gICAgICBjb25zb2xlLmxvZygn0JrQvtC7LdCy0L4g0LPRgNGD0L/QvyDQsdGD0YTQtdGA0L7QsjogJyArIHRoaXMuYnVmZmVycy5hbW91bnRPZkJ1ZmZlckdyb3Vwcy50b0xvY2FsZVN0cmluZygpKVxuICAgICAgY29uc29sZS5sb2coJ9Ca0L7Quy3QstC+IEdMLdGC0YDQtdGD0LPQvtC70YzQvdC40LrQvtCyOiAnICsgKHRoaXMuYnVmZmVycy5hbW91bnRPZlRvdGFsR0xWZXJ0aWNlcyAvIDMpLnRvTG9jYWxlU3RyaW5nKCkpXG4gICAgICBjb25zb2xlLmxvZygn0JrQvtC7LdCy0L4g0LLQtdGA0YjQuNC9OiAnICsgdGhpcy5idWZmZXJzLmFtb3VudE9mVG90YWxWZXJ0aWNlcy50b0xvY2FsZVN0cmluZygpKVxuICAgIH1cbiAgICBjb25zb2xlLmdyb3VwRW5kKClcbiAgfVxuXG4gIC8qKlxuICAgKiDQodC+0LfQtNCw0LXRgiDQtNC+0L/QvtC70L3QtdC90LjQtSDQuiDQutC+0LTRgyDQvdCwINGP0LfRi9C60LUgR0xTTC5cbiAgICpcbiAgICogQHJlbWFya3NcbiAgICog0JIg0LTQsNC70YzQvdC10LnRiNC10Lwg0YHQvtC30LTQsNC90L3Ri9C5INC60L7QtCDQsdGD0LTQtdGCINCy0YHRgtGA0L7QtdC9INCyINC60L7QtCDQstC10YDRiNC40L3QvdC+0LPQviDRiNC10LnQtNC10YDQsCDQtNC70Y8g0LfQsNC00LDQvdC40Y8g0YbQstC10YLQsCDQstC10YDRiNC40L3RiyDQsiDQt9Cw0LLQuNGB0LjQvNC+0YHRgtC4INC+0YJcbiAgICog0LjQvdC00LXQutGB0LAg0YbQstC10YLQsCwg0L/RgNC40YHQstC+0LXQvdC90L7Qs9C+INGN0YLQvtC5INCy0LXRgNGI0LjQvdC1LiDQoi7Qui4g0YjQtdC50LTQtdGAINC90LUg0L/QvtC30LLQvtC70Y/QtdGCINC40YHQv9C+0LvRjNC30L7QstCw0YLRjCDQsiDQutCw0YfQtdGB0YLQstC1INC40L3QtNC10LrRgdC+0LIg0L/QtdGA0LXQvNC10L3QvdGL0LUgLVxuICAgKiDQtNC70Y8g0LfQsNC00LDQvdC40Y8g0YbQstC10YLQsCDQuNGB0L/QvtC70YzQt9GD0LXRgtGB0Y8g0L/QtdGA0LXQsdC+0YAg0YbQstC10YLQvtCy0YvRhSDQuNC90LTQtdC60YHQvtCyLlxuICAgKlxuICAgKiBAcmV0dXJucyDQmtC+0LQg0L3QsCDRj9C30YvQutC1IEdMU0wuXG4gICAqL1xuICBwcm90ZWN0ZWQgZ2VuU2hhZGVyQ29sb3JDb2RlKCk6IHN0cmluZyB7XG5cbiAgICAvLyDQktGA0LXQvNC10L3QvdC+0LUg0LTQvtCx0LDQstC70LXQvdC40LUg0LIg0L/QsNC70LjRgtGA0YMg0YbQstC10YLQvtCyINCy0LXRgNGI0LjQvSDRhtCy0LXRgtCwINC90LDQv9GA0LDQstC70Y/RjtGJ0LjRhS5cbiAgICB0aGlzLnBvbHlnb25QYWxldHRlLnB1c2godGhpcy5ydWxlc0NvbG9yKVxuXG4gICAgbGV0IGNvZGU6IHN0cmluZyA9ICcnXG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucG9seWdvblBhbGV0dGUubGVuZ3RoOyBpKyspIHtcblxuICAgICAgLy8g0J/QvtC70YPRh9C10L3QuNC1INGG0LLQtdGC0LAg0LIg0L3Rg9C20L3QvtC8INGE0L7RgNC80LDRgtC1LlxuICAgICAgbGV0IFtyLCBnLCBiXSA9IHRoaXMuY29udmVydENvbG9yKHRoaXMucG9seWdvblBhbGV0dGVbaV0pXG5cbiAgICAgIC8vINCk0L7RgNC80LjRgNC+0LLQvdC40LUg0YHRgtGA0L7QuiBHTFNMLdC60L7QtNCwINC/0YDQvtCy0LXRgNC60Lgg0LjQvdC00LXQutGB0LAg0YbQstC10YLQsC5cbiAgICAgIGNvZGUgKz0gKChpID09PSAwKSA/ICcnIDogJyAgZWxzZSAnKSArICdpZiAoYV9jb2xvciA9PSAnICsgaSArICcuMCkgdl9jb2xvciA9IHZlYzMoJyArXG4gICAgICAgIHIudG9TdHJpbmcoKS5zbGljZSgwLCA5KSArICcsJyArXG4gICAgICAgIGcudG9TdHJpbmcoKS5zbGljZSgwLCA5KSArICcsJyArXG4gICAgICAgIGIudG9TdHJpbmcoKS5zbGljZSgwLCA5KSArICcpO1xcbidcbiAgICB9XG5cbiAgICAvLyDQo9C00LDQu9C10L3QuNC1INC40Lcg0L/QsNC70LjRgtGA0Ysg0LLQtdGA0YjQuNC9INCy0YDQtdC80LXQvdC90L4g0LTQvtCx0LDQstC70LXQvdC90L7Qs9C+INGG0LLQtdGC0LAg0L3QsNC/0YDQsNCy0LvRj9GO0YnQuNGFLlxuICAgIHRoaXMucG9seWdvblBhbGV0dGUucG9wKClcblxuICAgIHJldHVybiBjb2RlXG4gIH1cblxuICAvKipcbiAgICog0JrQvtC90LLQtdGA0YLQuNGA0YPQtdGCINGG0LLQtdGCINC40LcgSEVYLdC/0YDQtdC00YHRgtCw0LLQu9C10L3QuNGPINCyINC/0YDQtdC00YHRgtCw0LLQu9C10L3QuNC1INGG0LLQtdGC0LAg0LTQu9GPIEdMU0wt0LrQvtC00LAgKFJHQiDRgSDQtNC40LDQv9Cw0LfQvtC90LDQvNC4INC30L3QsNGH0LXQvdC40Lkg0L7RgiAwINC00L4gMSkuXG4gICAqXG4gICAqIEBwYXJhbSBoZXhDb2xvciAtINCm0LLQtdGCINCyIEhFWC3RhNC+0YDQvNCw0YLQtS5cbiAgICogQHJldHVybnMg0JzQsNGB0YHQuNCyINC40Lcg0YLRgNC10YUg0YfQuNGB0LXQuyDQsiDQtNC40LDQv9Cw0LfQvtC90LUg0L7RgiAwINC00L4gMS5cbiAgICovXG4gIHByb3RlY3RlZCBjb252ZXJ0Q29sb3IoaGV4Q29sb3I6IEhFWENvbG9yKTogbnVtYmVyW10ge1xuXG4gICAgbGV0IGsgPSAvXiM/KFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pJC9pLmV4ZWMoaGV4Q29sb3IpXG4gICAgbGV0IFtyLCBnLCBiXSA9IFtwYXJzZUludChrIVsxXSwgMTYpIC8gMjU1LCBwYXJzZUludChrIVsyXSwgMTYpIC8gMjU1LCBwYXJzZUludChrIVszXSwgMTYpIC8gMjU1XVxuXG4gICAgcmV0dXJuIFtyLCBnLCBiXVxuICB9XG5cbiAgLyoqXG4gICAqINCS0YvRh9C40YHQu9GP0LXRgiDRgtC10LrRg9GJ0LXQtSDQstGA0LXQvNGPLlxuICAgKlxuICAgKiBAcmV0dXJucyDQodGC0YDQvtC60L7QstCw0Y8g0YTQvtGA0LzQsNGC0LjRgNC+0LLQsNC90L3QsNGPINC30LDQv9C40YHRjCDRgtC10LrRg9GJ0LXQs9C+INCy0YDQtdC80LXQvdC4LlxuICAgKi9cbiAgcHJvdGVjdGVkIGdldEN1cnJlbnRUaW1lKCk6IHN0cmluZyB7XG5cbiAgICBsZXQgdG9kYXkgPSBuZXcgRGF0ZSgpO1xuXG4gICAgbGV0IHRpbWUgPVxuICAgICAgKCh0b2RheS5nZXRIb3VycygpIDwgMTAgPyAnMCcgOiAnJykgKyB0b2RheS5nZXRIb3VycygpKSArIFwiOlwiICtcbiAgICAgICgodG9kYXkuZ2V0TWludXRlcygpIDwgMTAgPyAnMCcgOiAnJykgKyB0b2RheS5nZXRNaW51dGVzKCkpICsgXCI6XCIgK1xuICAgICAgKCh0b2RheS5nZXRTZWNvbmRzKCkgPCAxMCA/ICcwJyA6ICcnKSArIHRvZGF5LmdldFNlY29uZHMoKSlcblxuICAgIHJldHVybiB0aW1lXG4gIH1cblxuLyoqXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG4gIC8qKlxuICAgKlxuICAgKi9cbiAgcHJvdGVjdGVkIG1ha2VDYW1lcmFNYXRyaXgoJHRoaXM6IFNQbG90KSB7XG5cbiAgICBjb25zdCB6b29tU2NhbGUgPSAxIC8gJHRoaXMuY2FtZXJhLnpvb20hO1xuXG4gICAgbGV0IGNhbWVyYU1hdCA9IG0zLmlkZW50aXR5KCk7XG4gICAgY2FtZXJhTWF0ID0gbTMudHJhbnNsYXRlKGNhbWVyYU1hdCwgJHRoaXMuY2FtZXJhLngsICR0aGlzLmNhbWVyYS55KTtcbiAgICBjYW1lcmFNYXQgPSBtMy5zY2FsZShjYW1lcmFNYXQsIHpvb21TY2FsZSwgem9vbVNjYWxlKTtcblxuICAgIHJldHVybiBjYW1lcmFNYXQ7XG4gIH1cblxuICAvKipcbiAgICog0J7QsdC90L7QstC70Y/QtdGCINC80LDRgtGA0LjRhtGDINGC0YDQsNC90YHRhNC+0YDQvNCw0YbQuNC4LlxuICAgKlxuICAgKiBAcmVtYXJrc1xuICAgKiDQodGD0YnQtdGB0YLQstGD0LXRgiDQtNCy0LAg0LLQsNGA0LjQsNC90YLQsCDQstGL0LfQvtCy0LAg0LzQtdGC0L7QtNCwIC0g0LjQtyDQtNGA0YPQs9C+0LPQviDQvNC10YLQvtC00LAg0Y3QutC30LXQvNC/0LvRj9GA0LAgKHtAbGluayByZW5kZXJ9KSDQuCDQuNC3INC+0LHRgNCw0LHQvtGC0YfQuNC60LAg0YHQvtCx0YvRgtC40Y8g0LzRi9GI0LhcbiAgICogKHtAbGluayBoYW5kbGVNb3VzZVdoZWVsfSkuINCS0L4g0LLRgtC+0YDQvtC8INCy0LDRgNC40LDQvdGC0LUg0LjRgdC/0L7Qu9GM0LfQvtCy0LDQvdC40LUg0L7QsdGK0LXQutGC0LAgdGhpcyDQvdC10LLQvtC30LzQvtC20L3Qvi4g0JTQu9GPINGD0L3QuNCy0LXRgNGB0LDQu9GM0L3QvtGB0YLQuCDQstGL0LfQvtCy0LBcbiAgICog0LzQtdGC0L7QtNCwIC0g0LIg0L3QtdCz0L4g0LLRgdC10LPQtNCwINGP0LLQvdC+INC90LXQvtCx0YXQvtC00LjQvNC+INC/0LXRgNC10LTQsNCy0LDRgtGMINGB0YHRi9C70LrRgyDQvdCwINGN0LrQt9C10LzQv9C70Y/RgCDQutC70LDRgdGB0LAuXG4gICAqXG4gICAqIEBwYXJhbSAkdGhpcyAtINCt0LrQt9C10LzQv9C70Y/RgCDQutC70LDRgdGB0LAsINGH0YzRjiDQvNCw0YLRgNC40YbRgyDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuCDQvdC10L7QsdGF0L7QtNC40LzQviDQvtCx0L3QvtCy0LjRgtGMLlxuICAgKi9cbiAgcHJvdGVjdGVkIHVwZGF0ZVZpZXdQcm9qZWN0aW9uKCR0aGlzOiBTUGxvdCk6IHZvaWQge1xuXG4gICAgY29uc3QgcHJvamVjdGlvbk1hdCA9IG0zLnByb2plY3Rpb24oJHRoaXMuZ2wuY2FudmFzLndpZHRoLCAkdGhpcy5nbC5jYW52YXMuaGVpZ2h0KTtcbiAgICBjb25zdCBjYW1lcmFNYXQgPSAkdGhpcy5tYWtlQ2FtZXJhTWF0cml4KCR0aGlzKTtcbiAgICBsZXQgdmlld01hdCA9IG0zLmludmVyc2UoY2FtZXJhTWF0KTtcbiAgICAkdGhpcy50cmFuc29ybWF0aW9uLnZpZXdQcm9qZWN0aW9uTWF0ID0gbTMubXVsdGlwbHkocHJvamVjdGlvbk1hdCwgdmlld01hdCk7XG4gIH1cblxuICAvKipcbiAgICpcbiAgICovXG4gIHByb3RlY3RlZCBnZXRDbGlwU3BhY2VNb3VzZVBvc2l0aW9uKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG5cbiAgICBjb25zdCAkdGhpcyA9IFNQbG90Lmluc3RhbmNlc1soZXZlbnQudGFyZ2V0IGFzIEhUTUxFbGVtZW50KS5pZF1cblxuICAgIC8vIGdldCBjYW52YXMgcmVsYXRpdmUgY3NzIHBvc2l0aW9uXG4gICAgY29uc3QgcmVjdCA9ICR0aGlzLmNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBjc3NYID0gZXZlbnQuY2xpZW50WCAtIHJlY3QubGVmdDtcbiAgICBjb25zdCBjc3NZID0gZXZlbnQuY2xpZW50WSAtIHJlY3QudG9wO1xuXG4gICAgLy8gZ2V0IG5vcm1hbGl6ZWQgMCB0byAxIHBvc2l0aW9uIGFjcm9zcyBhbmQgZG93biBjYW52YXNcbiAgICBjb25zdCBub3JtYWxpemVkWCA9IGNzc1ggLyAkdGhpcy5jYW52YXMuY2xpZW50V2lkdGg7XG4gICAgY29uc3Qgbm9ybWFsaXplZFkgPSBjc3NZIC8gJHRoaXMuY2FudmFzLmNsaWVudEhlaWdodDtcblxuICAgIC8vIGNvbnZlcnQgdG8gY2xpcCBzcGFjZVxuICAgIGNvbnN0IGNsaXBYID0gbm9ybWFsaXplZFggKiAyIC0gMTtcbiAgICBjb25zdCBjbGlwWSA9IG5vcm1hbGl6ZWRZICogLTIgKyAxO1xuXG4gICAgcmV0dXJuIFtjbGlwWCwgY2xpcFldO1xuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqL1xuICBwcm90ZWN0ZWQgbW92ZUNhbWVyYShldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuXG4gICAgY29uc3QgJHRoaXMgPSBTUGxvdC5pbnN0YW5jZXNbKGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudCkuaWRdXG5cbiAgICBjb25zdCBwb3MgPSBtMy50cmFuc2Zvcm1Qb2ludChcbiAgICAgICR0aGlzLnRyYW5zb3JtYXRpb24uc3RhcnRJbnZWaWV3UHJvak1hdCxcbiAgICAgICR0aGlzLmdldENsaXBTcGFjZU1vdXNlUG9zaXRpb24oZXZlbnQpXG4gICAgKTtcblxuICAgICR0aGlzLmNhbWVyYS54ID1cbiAgICAgICR0aGlzLnRyYW5zb3JtYXRpb24uc3RhcnRDYW1lcmEueCEgKyAkdGhpcy50cmFuc29ybWF0aW9uLnN0YXJ0UG9zWzBdIC0gcG9zWzBdO1xuXG4gICAgJHRoaXMuY2FtZXJhLnkgPVxuICAgICAgJHRoaXMudHJhbnNvcm1hdGlvbi5zdGFydENhbWVyYS55ISArICR0aGlzLnRyYW5zb3JtYXRpb24uc3RhcnRQb3NbMV0gLSBwb3NbMV07XG5cbiAgICAkdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDQoNC10LDQs9C40YDRg9C10YIg0L3QsCDQtNCy0LjQttC10L3QuNC1INC80YvRiNC4L9GC0YDQtdC60L/QsNC00LAg0LIg0LzQvtC80LXQvdGCLCDQutC+0LPQtNCwINC10LUv0LXQs9C+INC60LvQsNCy0LjRiNCwINGD0LTQtdGA0LbQuNCy0LDQtdGC0YHRjyDQvdCw0LbQsNGC0L7QuS5cbiAgICpcbiAgICogQHJlbWVya3NcbiAgICog0JzQtdGC0L7QtCDQv9C10YDQtdC80LXRidCw0LXRgiDQvtCx0LvQsNGB0YLRjCDQstC40LTQuNC80L7RgdGC0Lgg0L3QsCDQv9C70L7RgdC60L7RgdGC0Lgg0LLQvNC10YHRgtC1INGBINC00LLQuNC20LXQvdC40LXQvCDQvNGL0YjQuC/RgtGA0LXQutC/0LDQtNCwLiDQktGL0YfQuNGB0LvQtdC90LjRjyDQstC90YPRgtGA0Lgg0YHQvtCx0YvRgtC40Y8g0YHQtNC10LvQsNC90YtcbiAgICog0LzQsNC60YHQuNC80LDQu9GM0L3QviDQv9GA0L7QuNC30LLQvtC00LjRgtC10LvRjNC90YvQvNC4INCyINGD0YnQtdGA0LEg0YfQuNGC0LDQsdC10LvRjNC90L7RgdGC0Lgg0LvQvtCz0LjQutC4INC00LXQudGB0YLQstC40LkuINCS0L4g0LLQvdC10YjQvdC10Lwg0L7QsdGA0LDQsdC+0YLRh9C40LrQtSDRgdC+0LHRi9GC0LjQuSDQvtCx0YrQtdC60YIgdGhpc1xuICAgKiDQvdC10LTQvtGB0YLRg9C/0LXQvSDQv9C+0Y3RgtC+0LzRgyDQtNC+0YHRgtGD0L8g0Log0Y3QutC30LXQvNC/0LvRj9GA0YMg0LrQu9Cw0YHRgdCwINGA0LXQsNC70LjQt9GD0LXRgtGB0Y8g0YfQtdGA0LXQtyDRgdGC0LDRgtC40YfQtdGB0LrQuNC5INC80LDRgdGB0LjQsiDQstGB0LXRhSDRgdC+0LfQtNCw0L3QvdGL0YUg0Y3QutC30LXQvNC/0LvRj9GA0L7QslxuICAgKiDQutC70LDRgdGB0LAg0Lgg0LjQtNC10L3RgtC40YTQuNC60LDRgtC+0YDQsCDQutCw0L3QstCw0YHQsCwg0LLRi9GB0YLRg9C/0LDRjtGJ0LXQs9C+INC40L3QtNC10LrRgdC+0Lwg0LIg0Y3RgtC+0Lwg0LzQsNGB0YHQuNCy0LUuXG4gICAqXG4gICAqIEBwYXJhbSBldmVudCAtINCh0L7QsdGL0YLQuNC1INC80YvRiNC4L9GC0YDQtdC60L/QsNC00LAuXG4gICAqL1xuICBwcm90ZWN0ZWQgaGFuZGxlTW91c2VNb3ZlKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG4gICAgY29uc3QgJHRoaXMgPSBTUGxvdC5pbnN0YW5jZXNbKGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudCkuaWRdXG4gICAgJHRoaXMubW92ZUNhbWVyYShldmVudCk7XG4gIH1cblxuICAvKipcbiAgICog0KDQtdCw0LPQuNGA0YPQtdGCINC90LAg0L7RgtC20LDRgtC40LUg0LrQu9Cw0LLQuNGI0Lgg0LzRi9GI0Lgv0YLRgNC10LrQv9Cw0LTQsC5cbiAgICpcbiAgICogQHJlbWVya3NcbiAgICog0JIg0LzQvtC80LXQvdGCINC+0YLQttCw0YLQuNGPINC60LvQsNCy0LjRiNC4INCw0L3QsNC70LjQtyDQtNCy0LjQttC10L3QuNGPINC80YvRiNC4L9GC0YDQtdC60L/QsNC00LAg0YEg0LfQsNC20LDRgtC+0Lkg0LrQu9Cw0LLQuNGI0LXQuSDQv9GA0LXQutGA0LDRidCw0LXRgtGB0Y8uINCS0YvRh9C40YHQu9C10L3QuNGPINCy0L3Rg9GC0YDQuCDRgdC+0LHRi9GC0LjRj1xuICAgKiDRgdC00LXQu9Cw0L3RiyDQvNCw0LrRgdC40LzQsNC70YzQvdC+INC/0YDQvtC40LfQstC+0LTQuNGC0LXQu9GM0L3Ri9C80Lgg0LIg0YPRidC10YDQsSDRh9C40YLQsNCx0LXQu9GM0L3QvtGB0YLQuCDQu9C+0LPQuNC60Lgg0LTQtdC50YHRgtCy0LjQuS4g0JLQviDQstC90LXRiNC90LXQvCDQvtCx0YDQsNCx0L7RgtGH0LjQutC1INGB0L7QsdGL0YLQuNC5INC+0LHRitC10LrRglxuICAgKiB0aGlzINC90LXQtNC+0YHRgtGD0L/QtdC9INC/0L7RjdGC0L7QvNGDINC00L7RgdGC0YPQvyDQuiDRjdC60LfQtdC80L/Qu9GP0YDRgyDQutC70LDRgdGB0LAg0YDQtdCw0LvQuNC30YPQtdGC0YHRjyDRh9C10YDQtdC3INGB0YLQsNGC0LjRh9C10YHQutC40Lkg0LzQsNGB0YHQuNCyINCy0YHQtdGFINGB0L7Qt9C00LDQvdC90YvRhSDRjdC60LfQtdC80L/Qu9GP0YDQvtCyXG4gICAqINC60LvQsNGB0YHQsCDQuCDQuNC00LXQvdGC0LjRhNC40LrQsNGC0L7RgNCwINC60LDQvdCy0LDRgdCwLCDQstGL0YHRgtGD0L/QsNGO0YnQtdCz0L4g0LjQvdC00LXQutGB0L7QvCDQsiDRjdGC0L7QvCDQvNCw0YHRgdC40LLQtS5cbiAgICpcbiAgICogQHBhcmFtIGV2ZW50IC0g0KHQvtCx0YvRgtC40LUg0LzRi9GI0Lgv0YLRgNC10LrQv9Cw0LTQsC5cbiAgICovXG4gIHByb3RlY3RlZCBoYW5kbGVNb3VzZVVwKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG4gICAgY29uc3QgJHRoaXMgPSBTUGxvdC5pbnN0YW5jZXNbKGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudCkuaWRdXG4gICAgJHRoaXMucmVuZGVyKCk7XG4gICAgZXZlbnQudGFyZ2V0IS5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCAkdGhpcy5oYW5kbGVNb3VzZU1vdmUgYXMgRXZlbnRMaXN0ZW5lcik7XG4gICAgZXZlbnQudGFyZ2V0IS5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgJHRoaXMuaGFuZGxlTW91c2VVcCBhcyBFdmVudExpc3RlbmVyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDQoNC10LDQs9C40YDRg9C10YIg0L3QsCDQvdCw0LbQsNGC0LjQtSDQutC70LDQstC40YjQuCDQvNGL0YjQuC/RgtGA0LXQutC/0LDQtNCwLlxuICAgKlxuICAgKiBAcmVtZXJrc1xuICAgKiDQkiDQvNC+0LzQtdC90YIg0L3QsNC20LDRgtC40Y8g0Lgg0YPQtNC10YDQttCw0L3QuNGPINC60LvQsNCy0LjRiNC4INC30LDQv9GD0YHQutCw0LXRgtGB0Y8g0LDQvdCw0LvQuNC3INC00LLQuNC20LXQvdC40Y8g0LzRi9GI0Lgv0YLRgNC10LrQv9Cw0LTQsCAo0YEg0LfQsNC20LDRgtC+0Lkg0LrQu9Cw0LLQuNGI0LXQuSkuINCS0YvRh9C40YHQu9C10L3QuNGPXG4gICAqINCy0L3Rg9GC0YDQuCDRgdC+0LHRi9GC0LjRjyDRgdC00LXQu9Cw0L3RiyDQvNCw0LrRgdC40LzQsNC70YzQvdC+INC/0YDQvtC40LfQstC+0LTQuNGC0LXQu9GM0L3Ri9C80Lgg0LIg0YPRidC10YDQsSDRh9C40YLQsNCx0LXQu9GM0L3QvtGB0YLQuCDQu9C+0LPQuNC60Lgg0LTQtdC50YHRgtCy0LjQuS4g0JLQviDQstC90LXRiNC90LXQvCDQvtCx0YDQsNCx0L7RgtGH0LjQutC1XG4gICAqINGB0L7QsdGL0YLQuNC5INC+0LHRitC10LrRgiB0aGlzINC90LXQtNC+0YHRgtGD0L/QtdC9INC/0L7RjdGC0L7QvNGDINC00L7RgdGC0YPQvyDQuiDRjdC60LfQtdC80L/Qu9GP0YDRgyDQutC70LDRgdGB0LAg0YDQtdCw0LvQuNC30YPQtdGC0YHRjyDRh9C10YDQtdC3INGB0YLQsNGC0LjRh9C10YHQutC40Lkg0LzQsNGB0YHQuNCyINCy0YHQtdGFXG4gICAqINGB0L7Qt9C00LDQvdC90YvRhSDRjdC60LfQtdC80L/Qu9GP0YDQvtCyINC60LvQsNGB0YHQsCDQuCDQuNC00LXQvdGC0LjRhNC40LrQsNGC0L7RgNCwINC60LDQvdCy0LDRgdCwLCDQstGL0YHRgtGD0L/QsNGO0YnQtdCz0L4g0LjQvdC00LXQutGB0L7QvCDQsiDRjdGC0L7QvCDQvNCw0YHRgdC40LLQtS5cbiAgICpcbiAgICogQHBhcmFtIGV2ZW50IC0g0KHQvtCx0YvRgtC40LUg0LzRi9GI0Lgv0YLRgNC10LrQv9Cw0LTQsC5cbiAgICovXG4gIHByb3RlY3RlZCBoYW5kbGVNb3VzZURvd24oZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICBjb25zdCAkdGhpcyA9IFNQbG90Lmluc3RhbmNlc1soZXZlbnQudGFyZ2V0IGFzIEhUTUxFbGVtZW50KS5pZF1cblxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgJHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsICR0aGlzLmhhbmRsZU1vdXNlTW92ZSBhcyBFdmVudExpc3RlbmVyKTtcbiAgICAkdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsICR0aGlzLmhhbmRsZU1vdXNlVXAgYXMgRXZlbnRMaXN0ZW5lcik7XG5cbiAgICAkdGhpcy50cmFuc29ybWF0aW9uLnN0YXJ0SW52Vmlld1Byb2pNYXQgPSBtMy5pbnZlcnNlKCR0aGlzLnRyYW5zb3JtYXRpb24udmlld1Byb2plY3Rpb25NYXQpO1xuICAgICR0aGlzLnRyYW5zb3JtYXRpb24uc3RhcnRDYW1lcmEgPSBPYmplY3QuYXNzaWduKHt9LCAkdGhpcy5jYW1lcmEpO1xuICAgICR0aGlzLnRyYW5zb3JtYXRpb24uc3RhcnRDbGlwUG9zID0gJHRoaXMuZ2V0Q2xpcFNwYWNlTW91c2VQb3NpdGlvbihldmVudCk7XG4gICAgJHRoaXMudHJhbnNvcm1hdGlvbi5zdGFydFBvcyA9IG0zLnRyYW5zZm9ybVBvaW50KCR0aGlzLnRyYW5zb3JtYXRpb24uc3RhcnRJbnZWaWV3UHJvak1hdCwgJHRoaXMudHJhbnNvcm1hdGlvbi5zdGFydENsaXBQb3MpO1xuICAgICR0aGlzLnRyYW5zb3JtYXRpb24uc3RhcnRNb3VzZVBvcyA9IFtldmVudC5jbGllbnRYLCBldmVudC5jbGllbnRZXTtcblxuICAgICR0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgLyoqXG4gICAqINCg0LXQsNCz0LjRgNGD0LXRgiDQvdCwINC30YPQvNC40YDQvtCy0LDQvdC40LUg0LzRi9GI0Lgv0YLRgNC10LrQv9Cw0LTQsC5cbiAgICpcbiAgICogQHJlbWVya3NcbiAgICog0JIg0LzQvtC80LXQvdGCINC30YPQvNC40YDQvtCy0LDQvdC40Y8g0LzRi9GI0Lgv0YLRgNC10LrQv9Cw0LTQsCDQv9GA0L7QuNGB0YXQvtC00LjRgiDQt9GD0LzQuNGA0L7QstCw0L3QuNC1INC60L7QvtGA0LTQuNC90LDRgtC90L7QuSDQv9C70L7RgdC60L7RgdGC0LguINCS0YvRh9C40YHQu9C10L3QuNGPINCy0L3Rg9GC0YDQuCDRgdC+0LHRi9GC0LjRj1xuICAgKiDRgdC00LXQu9Cw0L3RiyDQvNCw0LrRgdC40LzQsNC70YzQvdC+INC/0YDQvtC40LfQstC+0LTQuNGC0LXQu9GM0L3Ri9C80Lgg0LIg0YPRidC10YDQsSDRh9C40YLQsNCx0LXQu9GM0L3QvtGB0YLQuCDQu9C+0LPQuNC60Lgg0LTQtdC50YHRgtCy0LjQuS4g0JLQviDQstC90LXRiNC90LXQvCDQvtCx0YDQsNCx0L7RgtGH0LjQutC1INGB0L7QsdGL0YLQuNC5INC+0LHRitC10LrRglxuICAgKiB0aGlzINC90LXQtNC+0YHRgtGD0L/QtdC9INC/0L7RjdGC0L7QvNGDINC00L7RgdGC0YPQvyDQuiDRjdC60LfQtdC80L/Qu9GP0YDRgyDQutC70LDRgdGB0LAg0YDQtdCw0LvQuNC30YPQtdGC0YHRjyDRh9C10YDQtdC3INGB0YLQsNGC0LjRh9C10YHQutC40Lkg0LzQsNGB0YHQuNCyINCy0YHQtdGFINGB0L7Qt9C00LDQvdC90YvRhSDRjdC60LfQtdC80L/Qu9GP0YDQvtCyXG4gICAqINC60LvQsNGB0YHQsCDQuCDQuNC00LXQvdGC0LjRhNC40LrQsNGC0L7RgNCwINC60LDQvdCy0LDRgdCwLCDQstGL0YHRgtGD0L/QsNGO0YnQtdCz0L4g0LjQvdC00LXQutGB0L7QvCDQsiDRjdGC0L7QvCDQvNCw0YHRgdC40LLQtS5cbiAgICpcbiAgICogQHBhcmFtIGV2ZW50IC0g0KHQvtCx0YvRgtC40LUg0LzRi9GI0Lgv0YLRgNC10LrQv9Cw0LTQsC5cbiAgICovXG4gIHByb3RlY3RlZCBoYW5kbGVNb3VzZVdoZWVsX29yaWdpbmFsKGV2ZW50OiBXaGVlbEV2ZW50KTogdm9pZCB7XG4gICAgY29uc3QgJHRoaXMgPSBTUGxvdC5pbnN0YW5jZXNbKGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudCkuaWRdXG5cbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNvbnN0IFtjbGlwWCwgY2xpcFldID0gJHRoaXMuZ2V0Q2xpcFNwYWNlTW91c2VQb3NpdGlvbihldmVudCk7XG5cbiAgICAvLyBwb3NpdGlvbiBiZWZvcmUgem9vbWluZ1xuICAgIGNvbnN0IFtwcmVab29tWCwgcHJlWm9vbVldID0gbTMudHJhbnNmb3JtUG9pbnQobTMuaW52ZXJzZSgkdGhpcy50cmFuc29ybWF0aW9uLnZpZXdQcm9qZWN0aW9uTWF0KSwgW2NsaXBYLCBjbGlwWV0pO1xuXG4gICAgLy8gbXVsdGlwbHkgdGhlIHdoZWVsIG1vdmVtZW50IGJ5IHRoZSBjdXJyZW50IHpvb20gbGV2ZWwsIHNvIHdlIHpvb20gbGVzcyB3aGVuIHpvb21lZCBpbiBhbmQgbW9yZSB3aGVuIHpvb21lZCBvdXRcbiAgICBjb25zdCBuZXdab29tID0gJHRoaXMuY2FtZXJhLnpvb20hICogTWF0aC5wb3coMiwgZXZlbnQuZGVsdGFZICogLTAuMDEpO1xuICAgICR0aGlzLmNhbWVyYS56b29tID0gTWF0aC5tYXgoMC4wMDIsIE1hdGgubWluKDIwMCwgbmV3Wm9vbSkpO1xuXG4gICAgJHRoaXMudXBkYXRlVmlld1Byb2plY3Rpb24oJHRoaXMpO1xuXG4gICAgLy8gcG9zaXRpb24gYWZ0ZXIgem9vbWluZ1xuICAgIGNvbnN0IFtwb3N0Wm9vbVgsIHBvc3Rab29tWV0gPSBtMy50cmFuc2Zvcm1Qb2ludChtMy5pbnZlcnNlKCR0aGlzLnRyYW5zb3JtYXRpb24udmlld1Byb2plY3Rpb25NYXQpLCBbY2xpcFgsIGNsaXBZXSk7XG5cbiAgICAvLyBjYW1lcmEgbmVlZHMgdG8gYmUgbW92ZWQgdGhlIGRpZmZlcmVuY2Ugb2YgYmVmb3JlIGFuZCBhZnRlclxuICAgICR0aGlzLmNhbWVyYS54ISArPSBwcmVab29tWCAtIHBvc3Rab29tWDtcbiAgICAkdGhpcy5jYW1lcmEueSEgKz0gcHJlWm9vbVkgLSBwb3N0Wm9vbVk7XG5cbiAgICAkdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKi9cbiAgcHJvdGVjdGVkIGhhbmRsZU1vdXNlV2hlZWwoZXZlbnQ6IFdoZWVsRXZlbnQpOiB2b2lkIHtcbiAgICBjb25zdCAkdGhpcyA9IFNQbG90Lmluc3RhbmNlc1soZXZlbnQudGFyZ2V0IGFzIEhUTUxFbGVtZW50KS5pZF1cblxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc3QgW2NsaXBYLCBjbGlwWV0gPSAkdGhpcy5nZXRDbGlwU3BhY2VNb3VzZVBvc2l0aW9uKGV2ZW50KTtcblxuICAgIC8vIHBvc2l0aW9uIGJlZm9yZSB6b29taW5nXG4gICAgY29uc3QgW3ByZVpvb21YLCBwcmVab29tWV0gPSBtMy50cmFuc2Zvcm1Qb2ludChcbiAgICAgIG0zLmludmVyc2UoJHRoaXMudHJhbnNvcm1hdGlvbi52aWV3UHJvamVjdGlvbk1hdCksXG4gICAgICBbY2xpcFgsIGNsaXBZXVxuICAgICk7XG5cbiAgICAvLyBtdWx0aXBseSB0aGUgd2hlZWwgbW92ZW1lbnQgYnkgdGhlIGN1cnJlbnQgem9vbSBsZXZlbCwgc28gd2Ugem9vbSBsZXNzIHdoZW4gem9vbWVkIGluIGFuZCBtb3JlIHdoZW4gem9vbWVkIG91dFxuICAgIGNvbnN0IG5ld1pvb20gPSAkdGhpcy5jYW1lcmEuem9vbSEgKiBNYXRoLnBvdygyLCBldmVudC5kZWx0YVkgKiAtMC4wMSk7XG4gICAgJHRoaXMuY2FtZXJhLnpvb20gPSBNYXRoLm1heCgwLjAwMiwgTWF0aC5taW4oMjAwLCBuZXdab29tKSk7XG5cblxuXG5cbiAgICAvLyBUaGlzIGlzIC0tLSAkdGhpcy51cGRhdGVWaWV3UHJvamVjdGlvbigkdGhpcyk7XG4gICAgY29uc3QgcHJvamVjdGlvbk1hdCA9IG0zLnByb2plY3Rpb24oJHRoaXMuZ2wuY2FudmFzLndpZHRoLCAkdGhpcy5nbC5jYW52YXMuaGVpZ2h0KTtcblxuICAgICAgLy8gVGhpcyBpcyAtLS0gY29uc3QgY2FtZXJhTWF0ID0gJHRoaXMubWFrZUNhbWVyYU1hdHJpeCgkdGhpcyk7XG4gICAgICBjb25zdCB6b29tU2NhbGUgPSAxIC8gJHRoaXMuY2FtZXJhLnpvb207XG4gICAgICBsZXQgY2FtZXJhTWF0ID0gbTMuaWRlbnRpdHkoKTtcbiAgICAgIGNhbWVyYU1hdCA9IG0zLnRyYW5zbGF0ZShjYW1lcmFNYXQsICR0aGlzLmNhbWVyYS54LCAkdGhpcy5jYW1lcmEueSk7XG4gICAgICBjYW1lcmFNYXQgPSBtMy5zY2FsZShjYW1lcmFNYXQsIHpvb21TY2FsZSwgem9vbVNjYWxlKTtcblxuICAgIGxldCB2aWV3TWF0ID0gbTMuaW52ZXJzZShjYW1lcmFNYXQpO1xuICAgICR0aGlzLnRyYW5zb3JtYXRpb24udmlld1Byb2plY3Rpb25NYXQgPSBtMy5tdWx0aXBseShwcm9qZWN0aW9uTWF0LCB2aWV3TWF0KTtcblxuXG5cblxuICAgIC8vIHBvc2l0aW9uIGFmdGVyIHpvb21pbmdcbiAgICBjb25zdCBbcG9zdFpvb21YLCBwb3N0Wm9vbVldID0gbTMudHJhbnNmb3JtUG9pbnQobTMuaW52ZXJzZSgkdGhpcy50cmFuc29ybWF0aW9uLnZpZXdQcm9qZWN0aW9uTWF0KSwgW2NsaXBYLCBjbGlwWV0pO1xuXG4gICAgLy8gY2FtZXJhIG5lZWRzIHRvIGJlIG1vdmVkIHRoZSBkaWZmZXJlbmNlIG9mIGJlZm9yZSBhbmQgYWZ0ZXJcbiAgICAkdGhpcy5jYW1lcmEueCEgKz0gcHJlWm9vbVggLSBwb3N0Wm9vbVg7XG4gICAgJHRoaXMuY2FtZXJhLnkhICs9IHByZVpvb21ZIC0gcG9zdFpvb21ZO1xuXG4gICAgJHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICAvKipcbiAgICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAqL1xuXG4gIC8qKlxuICAgKiDQn9GA0L7QuNC30LLQvtC00LjRgiDRgNC10L3QtNC10YDQuNC90LMg0LPRgNCw0YTQuNC60LAg0LIg0YHQvtC+0YLQstC10YLRgdGC0LLQuNC4INGBINGC0LXQutGD0YnQuNC80Lgg0L/QsNGA0LDQvNC10YLRgNCw0LzQuCDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuC5cbiAgICovXG4gIHByb3RlY3RlZCByZW5kZXIoKTogdm9pZCB7XG5cbiAgICAvLyDQntGH0LjRgdGC0LrQsCDQvtCx0YrQtdC60YLQsCDRgNC10L3QtNC10YDQuNC90LPQsCBXZWJHTC5cbiAgICB0aGlzLmdsLmNsZWFyKHRoaXMuZ2wuQ09MT1JfQlVGRkVSX0JJVClcblxuICAgIC8vINCe0LHQvdC+0LLQu9C10L3QuNC1INC80LDRgtGA0LjRhtGLINGC0YDQsNC90YHRhNC+0YDQvNCw0YbQuNC4LlxuICAgIHRoaXMudXBkYXRlVmlld1Byb2plY3Rpb24odGhpcylcblxuICAgIC8vINCf0YDQuNCy0Y/Qt9C60LAg0LzQsNGC0YDQuNGG0Ysg0YLRgNCw0L3RgdGE0L7RgNC80LDRhtC40Lgg0Log0L/QtdGA0LXQvNC10L3QvdC+0Lkg0YjQtdC50LTQtdGA0LAuXG4gICAgdGhpcy5nbC51bmlmb3JtTWF0cml4M2Z2KHRoaXMudmFyaWFibGVzWyd1X21hdHJpeCddLCBmYWxzZSwgdGhpcy50cmFuc29ybWF0aW9uLnZpZXdQcm9qZWN0aW9uTWF0KVxuXG4gICAgLy8g0JjRgtC10YDQuNGA0L7QstCw0L3QuNC1INC4INGA0LXQvdC00LXRgNC40L3QsyDQs9GA0YPQv9C/INCx0YPRhNC10YDQvtCyIFdlYkdMLlxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5idWZmZXJzLmFtb3VudE9mQnVmZmVyR3JvdXBzOyBpKyspIHtcblxuICAgICAgLy8g0KPRgdGC0LDQvdC+0LLQutCwINGC0LXQutGD0YnQtdCz0L4g0LHRg9GE0LXRgNCwINCy0LXRgNGI0LjQvSDQuCDQtdCz0L4g0L/RgNC40LLRj9C30LrQsCDQuiDQv9C10YDQtdC80LXQvdC90L7QuSDRiNC10LnQtNC10YDQsC5cbiAgICAgIHRoaXMuZ2wuYmluZEJ1ZmZlcih0aGlzLmdsLkFSUkFZX0JVRkZFUiwgdGhpcy5idWZmZXJzLnZlcnRleEJ1ZmZlcnNbaV0pXG4gICAgICB0aGlzLmdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KHRoaXMudmFyaWFibGVzWydhX3Bvc2l0aW9uJ10pXG4gICAgICB0aGlzLmdsLnZlcnRleEF0dHJpYlBvaW50ZXIodGhpcy52YXJpYWJsZXNbJ2FfcG9zaXRpb24nXSwgMiwgdGhpcy5nbC5GTE9BVCwgZmFsc2UsIDAsIDApXG5cbiAgICAgIC8vINCj0YHRgtCw0L3QvtCy0LrQsCDRgtC10LrRg9GJ0LXQs9C+INCx0YPRhNC10YDQsCDRhtCy0LXRgtC+0LIg0LLQtdGA0YjQuNC9INC4INC10LPQviDQv9GA0LjQstGP0LfQutCwINC6INC/0LXRgNC10LzQtdC90L3QvtC5INGI0LXQudC00LXRgNCwLlxuICAgICAgdGhpcy5nbC5iaW5kQnVmZmVyKHRoaXMuZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLmJ1ZmZlcnMuY29sb3JCdWZmZXJzW2ldKVxuICAgICAgdGhpcy5nbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheSh0aGlzLnZhcmlhYmxlc1snYV9jb2xvciddKVxuICAgICAgdGhpcy5nbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKHRoaXMudmFyaWFibGVzWydhX2NvbG9yJ10sIDEsIHRoaXMuZ2wuVU5TSUdORURfQllURSwgZmFsc2UsIDAsIDApXG5cbiAgICAgIC8vINCj0YHRgtCw0L3QvtCy0LrQsCDRgtC10LrRg9GJ0LXQs9C+INCx0YPRhNC10YDQsCDQuNC90LTQtdC60YHQvtCyINCy0LXRgNGI0LjQvS5cbiAgICAgIHRoaXMuZ2wuYmluZEJ1ZmZlcih0aGlzLmdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCB0aGlzLmJ1ZmZlcnMuaW5kZXhCdWZmZXJzW2ldKVxuXG4gICAgICAvLyDQoNC10L3QtNC10YDQuNC90LMg0YLQtdC60YPRidC10Lkg0LPRgNGD0L/Qv9GLINCx0YPRhNC10YDQvtCyLlxuICAgICAgdGhpcy5nbC5kcmF3RWxlbWVudHModGhpcy5nbC5QT0lOVFMsIHRoaXMuYnVmZmVycy5hbW91bnRPZkdMVmVydGljZXNbaV0sIHRoaXMuZ2wuVU5TSUdORURfU0hPUlQsIDApXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqINCh0LvRg9GH0LDQudC90YvQvCDQvtCx0YDQsNC30L7QvCDQstC+0LfQstGA0LDRidCw0LXRgiDQvtC00LjQvSDQuNC3INC40L3QtNC10LrRgdC+0LIg0YfQuNGB0LvQvtCy0L7Qs9C+INC+0LTQvdC+0LzQtdGA0L3QvtCz0L4g0LzQsNGB0YHQuNCy0LAuINCd0LXRgdC80L7RgtGA0Y8g0L3QsCDRgdC70YPRh9Cw0LnQvdC+0YHRgtGMINC60LDQttC00L7Qs9C+XG4gICAqINC60L7QvdC60YDQtdGC0L3QvtCz0L4g0LLRi9C30L7QstCwINGE0YPQvdC60YbQuNC4LCDQuNC90LTQtdC60YHRiyDQstC+0LfQstGA0LDRidCw0Y7RgtGB0Y8g0YEg0L/RgNC10LTQvtC/0YDQtdC00LXQu9C10L3QvdC+0Lkg0YfQsNGB0YLQvtGC0L7QuS4g0KfQsNGB0YLQvtGC0LAgXCLQstGL0L/QsNC00LDQvdC40LlcIiDQuNC90LTQtdC60YHQvtCyINC30LDQtNCw0LXRgtGB0Y9cbiAgICog0YHQvtC+0YLQstC10YLRgdGC0LLRg9GO0YnQuNC80Lgg0LfQvdCw0YfQtdC90LjRj9C80Lgg0Y3Qu9C10LzQtdC90YLQvtCyLlxuICAgKlxuICAgKiBAcmVtYXJrc1xuICAgKiDQn9GA0LjQvNC10YA6INCd0LAg0LzQsNGB0YHQuNCy0LUgWzMsIDIsIDVdINGE0YPQvdC60YbQuNGPINCx0YPQtNC10YIg0LLQvtC30LLRgNCw0YnQsNGC0Ywg0LjQvdC00LXQutGBIDAg0YEg0YfQsNGB0YLQvtGC0L7QuSA9IDMvKDMrMis1KSA9IDMvMTAsINC40L3QtNC10LrRgSAxINGBINGH0LDRgdGC0L7RgtC+0LkgPVxuICAgKiAyLygzKzIrNSkgPSAyLzEwLCDQuNC90LTQtdC60YEgMiDRgSDRh9Cw0YHRgtC+0YLQvtC5ID0gNS8oMysyKzUpID0gNS8xMC5cbiAgICpcbiAgICogQHBhcmFtIGFyciAtINCn0LjRgdC70L7QstC+0Lkg0L7QtNC90L7QvNC10YDQvdGL0Lkg0LzQsNGB0YHQuNCyLCDQuNC90LTQtdC60YHRiyDQutC+0YLQvtGA0L7Qs9C+INCx0YPQtNGD0YIg0LLQvtC30LLRgNCw0YnQsNGC0YzRgdGPINGBINC/0YDQtdC00L7Qv9GA0LXQtNC10LvQtdC90L3QvtC5INGH0LDRgdGC0L7RgtC+0LkuXG4gICAqIEByZXR1cm5zINCh0LvRg9GH0LDQudC90YvQuSDQuNC90LTQtdC60YEg0LjQtyDQvNCw0YHRgdC40LLQsCBhcnIuXG4gICAqL1xuICBwcm90ZWN0ZWQgcmFuZG9tUXVvdGFJbmRleChhcnI6IG51bWJlcltdKTogbnVtYmVyIHtcblxuICAgIGxldCBhOiBudW1iZXJbXSA9IFtdXG4gICAgYVswXSA9IGFyclswXVxuXG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgIGFbaV0gPSBhW2kgLSAxXSArIGFycltpXVxuICAgIH1cblxuICAgIGNvbnN0IGxhc3RJbmRleDogbnVtYmVyID0gYS5sZW5ndGggLSAxXG5cbiAgICBsZXQgcjogbnVtYmVyID0gTWF0aC5mbG9vcigoTWF0aC5yYW5kb20oKSAqIGFbbGFzdEluZGV4XSkpICsgMVxuICAgIGxldCBsOiBudW1iZXIgPSAwXG4gICAgbGV0IGg6IG51bWJlciA9IGxhc3RJbmRleFxuXG4gICAgd2hpbGUgKGwgPCBoKSB7XG4gICAgICBjb25zdCBtOiBudW1iZXIgPSBsICsgKChoIC0gbCkgPj4gMSk7XG4gICAgICAociA+IGFbbV0pID8gKGwgPSBtICsgMSkgOiAoaCA9IG0pXG4gICAgfVxuXG4gICAgcmV0dXJuIChhW2xdID49IHIpID8gbCA6IC0xXG4gIH1cblxuICAvKipcbiAgICog0JzQtdGC0L7QtCDQuNC80LjRgtCw0YbQuNC4INC40YLQtdGA0LjRgNC+0LLQsNC90LjRjyDQuNGB0YXQvtC00L3Ri9GFINC+0LHRitC10LrRgtC+0LIuINCf0YDQuCDQutCw0LbQtNC+0Lwg0L3QvtCy0L7QvCDQstGL0LfQvtCy0LUg0LLQvtC30LLRgNCw0YnQsNC10YIg0LjQvdGE0L7RgNC80LDRhtC40Y4g0L4g0L/QvtC70LjQs9C+0L3QtSDRgdC+INGB0LvRg9GH0LDQvdGL0LxcbiAgICog0L/QvtC70L7QttC10L3QuNC10LwsINGB0LvRg9GH0LDQudC90L7QuSDRhNC+0YDQvNC+0Lkg0Lgg0YHQu9GD0YfQsNC50L3Ri9C8INGG0LLQtdGC0L7QvC5cbiAgICpcbiAgICogQHJldHVybnMg0JjQvdGE0L7RgNC80LDRhtC40Y8g0L4g0L/QvtC70LjQs9C+0L3QtSDQuNC70LggbnVsbCwg0LXRgdC70Lgg0L/QtdGA0LXQsdC+0YAg0LjRgdGF0L7QtNC90YvRhSDQvtCx0YrQtdC60YLQvtCyINC30LDQutC+0L3Rh9C40LvRgdGPLlxuICAgKi9cbiAgcHJvdGVjdGVkIGRlbW9JdGVyYXRpb25DYWxsYmFjaygpOiBTUGxvdFBvbHlnb24gfCBudWxsIHtcbiAgICBpZiAodGhpcy5kZW1vTW9kZS5pbmRleCEgPCB0aGlzLmRlbW9Nb2RlLmFtb3VudCEpIHtcbiAgICAgIHRoaXMuZGVtb01vZGUuaW5kZXghICsrO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgeDogcmFuZG9tSW50KHRoaXMuZ3JpZFNpemUud2lkdGgpLFxuICAgICAgICB5OiByYW5kb21JbnQodGhpcy5ncmlkU2l6ZS5oZWlnaHQpLFxuICAgICAgICBzaGFwZTogdGhpcy5yYW5kb21RdW90YUluZGV4KHRoaXMuZGVtb01vZGUuc2hhcGVRdW90YSEpLFxuICAgICAgICBjb2xvcjogcmFuZG9tSW50KHRoaXMucG9seWdvblBhbGV0dGUubGVuZ3RoKVxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlXG4gICAgICByZXR1cm4gbnVsbFxuICB9XG5cbiAgLyoqXG4gICAqINCX0LDQv9GD0YHQutCw0LXRgiDRgNC10L3QtNC10YDQuNC90LMg0LggXCLQv9GA0L7RgdC70YPRiNC60YNcIiDRgdC+0LHRi9GC0LjQuSDQvNGL0YjQuC/RgtGA0LXQutC/0LDQtNCwINC90LAg0LrQsNC90LLQsNGB0LUuXG4gICAqL1xuICBwdWJsaWMgcnVuKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5pc1J1bm5pbmcpIHtcblxuICAgICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5oYW5kbGVNb3VzZURvd24pXG4gICAgICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCd3aGVlbCcsIHRoaXMuaGFuZGxlTW91c2VXaGVlbClcblxuICAgICAgdGhpcy5yZW5kZXIoKVxuXG4gICAgICB0aGlzLmlzUnVubmluZyA9IHRydWVcbiAgICB9XG5cbiAgICAvLyDQktGL0LLQvtC0INC+0YLQu9Cw0LTQvtGH0L3QvtC5INC40L3RhNC+0YDQvNCw0YbQuNC4LlxuICAgIGlmICh0aGlzLmRlYnVnTW9kZS5pc0VuYWJsZSkge1xuICAgICAgY29uc29sZS5sb2coJyVj0KDQtdC90LTQtdGA0LjQvdCzINC30LDQv9GD0YnQtdC9JywgdGhpcy5kZWJ1Z01vZGUuZ3JvdXBTdHlsZSlcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICog0J7RgdGC0LDQvdCw0LLQu9C40LLQsNC10YIg0YDQtdC90LTQtdGA0LjQvdCzINC4IFwi0L/RgNC+0YHQu9GD0YjQutGDXCIg0YHQvtCx0YvRgtC40Lkg0LzRi9GI0Lgv0YLRgNC10LrQv9Cw0LTQsCDQvdCwINC60LDQvdCy0LDRgdC1LlxuICAgKlxuICAgKiBAcGFyYW0gY2xlYXIgLSDQn9GA0LjQt9C90LDQuiDQvdC10L7QvtCx0YXQvtC00LjQvNC+0YHRgtC4INCy0LzQtdGB0YLQtSDRgSDQvtGB0YLQsNC90L7QstC60L7QuSDRgNC10L3QtNC10YDQuNC90LPQsCDQvtGH0LjRgdGC0LjRgtGMINC60LDQvdCy0LDRgS4g0JfQvdCw0YfQtdC90LjQtSB0cnVlINC+0YfQuNGJ0LDQtdGCINC60LDQvdCy0LDRgSxcbiAgICog0LfQvdCw0YfQtdC90LjQtSBmYWxzZSAtINC+0YHRgtCw0LLQu9GP0LXRgiDQtdCz0L4g0L3QtdC+0YfQuNGJ0LXQvdC90YvQvC4g0J/QviDRg9C80L7Qu9GH0LDQvdC40Y4g0L7Rh9C40YHRgtC60LAg0L3QtSDQv9GA0L7QuNGB0YXQvtC00LjRgi5cbiAgICovXG4gIHB1YmxpYyBzdG9wKGNsZWFyOiBib29sZWFuID0gZmFsc2UpOiB2b2lkIHtcblxuICAgIGlmICh0aGlzLmlzUnVubmluZykge1xuXG4gICAgICB0aGlzLmNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLmhhbmRsZU1vdXNlRG93bilcbiAgICAgIHRoaXMuY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3doZWVsJywgdGhpcy5oYW5kbGVNb3VzZVdoZWVsKVxuICAgICAgdGhpcy5jYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5oYW5kbGVNb3VzZU1vdmUpXG4gICAgICB0aGlzLmNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5oYW5kbGVNb3VzZVVwKVxuXG4gICAgICBpZiAoY2xlYXIpIHtcbiAgICAgICAgdGhpcy5jbGVhcigpXG4gICAgICB9XG5cbiAgICAgIHRoaXMuaXNSdW5uaW5nID0gZmFsc2VcbiAgICB9XG5cbiAgICAvLyDQktGL0LLQvtC0INC+0YLQu9Cw0LTQvtGH0L3QvtC5INC40L3RhNC+0YDQvNCw0YbQuNC4LlxuICAgIGlmICh0aGlzLmRlYnVnTW9kZS5pc0VuYWJsZSkge1xuICAgICAgY29uc29sZS5sb2coJyVj0KDQtdC90LTQtdGA0LjQvdCzINC+0YHRgtCw0L3QvtCy0LvQtdC9JywgdGhpcy5kZWJ1Z01vZGUuZ3JvdXBTdHlsZSlcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICog0J7Rh9C40YnQsNC10YIg0LrQsNC90LLQsNGBLCDQt9Cw0LrRgNCw0YjQuNCy0LDRjyDQtdCz0L4g0LIg0YTQvtC90L7QstGL0Lkg0YbQstC10YIuXG4gICAqL1xuICBwdWJsaWMgY2xlYXIoKTogdm9pZCB7XG5cbiAgICB0aGlzLmdsLmNsZWFyKHRoaXMuZ2wuQ09MT1JfQlVGRkVSX0JJVCk7XG5cbiAgICAvLyDQktGL0LLQvtC0INC+0YLQu9Cw0LTQvtGH0L3QvtC5INC40L3RhNC+0YDQvNCw0YbQuNC4LlxuICAgIGlmICh0aGlzLmRlYnVnTW9kZS5pc0VuYWJsZSkge1xuICAgICAgY29uc29sZS5sb2coJyVj0JrQvtC90YLQtdC60YHRgiDRgNC10L3QtNC10YDQuNC90LPQsCDQvtGH0LjRidC10L0gWycgKyB0aGlzLmJnQ29sb3IgKyAnXScsIHRoaXMuZGVidWdNb2RlLmdyb3VwU3R5bGUpO1xuICAgIH1cbiAgfVxufVxuIiwiLypcbiAqIENvcHlyaWdodCAyMDIxIEdGWEZ1bmRhbWVudGFscy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogUmVkaXN0cmlidXRpb24gYW5kIHVzZSBpbiBzb3VyY2UgYW5kIGJpbmFyeSBmb3Jtcywgd2l0aCBvciB3aXRob3V0XG4gKiBtb2RpZmljYXRpb24sIGFyZSBwZXJtaXR0ZWQgcHJvdmlkZWQgdGhhdCB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnMgYXJlXG4gKiBtZXQ6XG4gKlxuICogICAgICogUmVkaXN0cmlidXRpb25zIG9mIHNvdXJjZSBjb2RlIG11c3QgcmV0YWluIHRoZSBhYm92ZSBjb3B5cmlnaHRcbiAqIG5vdGljZSwgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lci5cbiAqICAgICAqIFJlZGlzdHJpYnV0aW9ucyBpbiBiaW5hcnkgZm9ybSBtdXN0IHJlcHJvZHVjZSB0aGUgYWJvdmVcbiAqIGNvcHlyaWdodCBub3RpY2UsIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXJcbiAqIGluIHRoZSBkb2N1bWVudGF0aW9uIGFuZC9vciBvdGhlciBtYXRlcmlhbHMgcHJvdmlkZWQgd2l0aCB0aGVcbiAqIGRpc3RyaWJ1dGlvbi5cbiAqICAgICAqIE5laXRoZXIgdGhlIG5hbWUgb2YgR0ZYRnVuZGFtZW50YWxzLiBub3IgdGhlIG5hbWVzIG9mIGhpc1xuICogY29udHJpYnV0b3JzIG1heSBiZSB1c2VkIHRvIGVuZG9yc2Ugb3IgcHJvbW90ZSBwcm9kdWN0cyBkZXJpdmVkIGZyb21cbiAqIHRoaXMgc29mdHdhcmUgd2l0aG91dCBzcGVjaWZpYyBwcmlvciB3cml0dGVuIHBlcm1pc3Npb24uXG4gKlxuICogVEhJUyBTT0ZUV0FSRSBJUyBQUk9WSURFRCBCWSBUSEUgQ09QWVJJR0hUIEhPTERFUlMgQU5EIENPTlRSSUJVVE9SU1xuICogXCJBUyBJU1wiIEFORCBBTlkgRVhQUkVTUyBPUiBJTVBMSUVEIFdBUlJBTlRJRVMsIElOQ0xVRElORywgQlVUIE5PVFxuICogTElNSVRFRCBUTywgVEhFIElNUExJRUQgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFkgQU5EIEZJVE5FU1MgRk9SXG4gKiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBUkUgRElTQ0xBSU1FRC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIENPUFlSSUdIVFxuICogT1dORVIgT1IgQ09OVFJJQlVUT1JTIEJFIExJQUJMRSBGT1IgQU5ZIERJUkVDVCwgSU5ESVJFQ1QsIElOQ0lERU5UQUwsXG4gKiBTUEVDSUFMLCBFWEVNUExBUlksIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyAoSU5DTFVESU5HLCBCVVQgTk9UXG4gKiBMSU1JVEVEIFRPLCBQUk9DVVJFTUVOVCBPRiBTVUJTVElUVVRFIEdPT0RTIE9SIFNFUlZJQ0VTOyBMT1NTIE9GIFVTRSxcbiAqIERBVEEsIE9SIFBST0ZJVFM7IE9SIEJVU0lORVNTIElOVEVSUlVQVElPTikgSE9XRVZFUiBDQVVTRUQgQU5EIE9OIEFOWVxuICogVEhFT1JZIE9GIExJQUJJTElUWSwgV0hFVEhFUiBJTiBDT05UUkFDVCwgU1RSSUNUIExJQUJJTElUWSwgT1IgVE9SVFxuICogKElOQ0xVRElORyBORUdMSUdFTkNFIE9SIE9USEVSV0lTRSkgQVJJU0lORyBJTiBBTlkgV0FZIE9VVCBPRiBUSEUgVVNFXG4gKiBPRiBUSElTIFNPRlRXQVJFLCBFVkVOIElGIEFEVklTRUQgT0YgVEhFIFBPU1NJQklMSVRZIE9GIFNVQ0ggREFNQUdFLlxuICovXG5cbi8qKlxuICogVmFyaW91cyAyZCBtYXRoIGZ1bmN0aW9ucy5cbiAqXG4gKiBAbW9kdWxlIHdlYmdsLTJkLW1hdGhcbiAqL1xuKGZ1bmN0aW9uKHJvb3QsIGZhY3RvcnkpIHsgIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIC8vIEFNRC4gUmVnaXN0ZXIgYXMgYW4gYW5vbnltb3VzIG1vZHVsZS5cbiAgICBkZWZpbmUoW10sIGZhY3RvcnkpO1xuICB9IGVsc2Uge1xuICAgIC8vIEJyb3dzZXIgZ2xvYmFsc1xuICAgIHJvb3QubTMgPSBmYWN0b3J5KCk7XG4gIH1cbn0odGhpcywgZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIC8qKlxuICAgKiBBbiBhcnJheSBvciB0eXBlZCBhcnJheSB3aXRoIDkgdmFsdWVzLlxuICAgKiBAdHlwZWRlZiB7bnVtYmVyW118VHlwZWRBcnJheX0gTWF0cml4M1xuICAgKiBAbWVtYmVyT2YgbW9kdWxlOndlYmdsLTJkLW1hdGhcbiAgICovXG5cbiAgLyoqXG4gICAqIFRha2VzIHR3byBNYXRyaXgzcywgYSBhbmQgYiwgYW5kIGNvbXB1dGVzIHRoZSBwcm9kdWN0IGluIHRoZSBvcmRlclxuICAgKiB0aGF0IHByZS1jb21wb3NlcyBiIHdpdGggYS4gIEluIG90aGVyIHdvcmRzLCB0aGUgbWF0cml4IHJldHVybmVkIHdpbGxcbiAgICogQHBhcmFtIHttb2R1bGU6d2ViZ2wtMmQtbWF0aC5NYXRyaXgzfSBhIEEgbWF0cml4LlxuICAgKiBAcGFyYW0ge21vZHVsZTp3ZWJnbC0yZC1tYXRoLk1hdHJpeDN9IGIgQSBtYXRyaXguXG4gICAqIEByZXR1cm4ge21vZHVsZTp3ZWJnbC0yZC1tYXRoLk1hdHJpeDN9IHRoZSByZXN1bHQuXG4gICAqIEBtZW1iZXJPZiBtb2R1bGU6d2ViZ2wtMmQtbWF0aFxuICAgKi9cbiAgZnVuY3Rpb24gbXVsdGlwbHkoYSwgYikge1xuICAgIHZhciBhMDAgPSBhWzAgKiAzICsgMF07XG4gICAgdmFyIGEwMSA9IGFbMCAqIDMgKyAxXTtcbiAgICB2YXIgYTAyID0gYVswICogMyArIDJdO1xuICAgIHZhciBhMTAgPSBhWzEgKiAzICsgMF07XG4gICAgdmFyIGExMSA9IGFbMSAqIDMgKyAxXTtcbiAgICB2YXIgYTEyID0gYVsxICogMyArIDJdO1xuICAgIHZhciBhMjAgPSBhWzIgKiAzICsgMF07XG4gICAgdmFyIGEyMSA9IGFbMiAqIDMgKyAxXTtcbiAgICB2YXIgYTIyID0gYVsyICogMyArIDJdO1xuICAgIHZhciBiMDAgPSBiWzAgKiAzICsgMF07XG4gICAgdmFyIGIwMSA9IGJbMCAqIDMgKyAxXTtcbiAgICB2YXIgYjAyID0gYlswICogMyArIDJdO1xuICAgIHZhciBiMTAgPSBiWzEgKiAzICsgMF07XG4gICAgdmFyIGIxMSA9IGJbMSAqIDMgKyAxXTtcbiAgICB2YXIgYjEyID0gYlsxICogMyArIDJdO1xuICAgIHZhciBiMjAgPSBiWzIgKiAzICsgMF07XG4gICAgdmFyIGIyMSA9IGJbMiAqIDMgKyAxXTtcbiAgICB2YXIgYjIyID0gYlsyICogMyArIDJdO1xuXG4gICAgcmV0dXJuIFtcbiAgICAgIGIwMCAqIGEwMCArIGIwMSAqIGExMCArIGIwMiAqIGEyMCxcbiAgICAgIGIwMCAqIGEwMSArIGIwMSAqIGExMSArIGIwMiAqIGEyMSxcbiAgICAgIGIwMCAqIGEwMiArIGIwMSAqIGExMiArIGIwMiAqIGEyMixcbiAgICAgIGIxMCAqIGEwMCArIGIxMSAqIGExMCArIGIxMiAqIGEyMCxcbiAgICAgIGIxMCAqIGEwMSArIGIxMSAqIGExMSArIGIxMiAqIGEyMSxcbiAgICAgIGIxMCAqIGEwMiArIGIxMSAqIGExMiArIGIxMiAqIGEyMixcbiAgICAgIGIyMCAqIGEwMCArIGIyMSAqIGExMCArIGIyMiAqIGEyMCxcbiAgICAgIGIyMCAqIGEwMSArIGIyMSAqIGExMSArIGIyMiAqIGEyMSxcbiAgICAgIGIyMCAqIGEwMiArIGIyMSAqIGExMiArIGIyMiAqIGEyMixcbiAgICBdO1xuICB9XG5cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIDN4MyBpZGVudGl0eSBtYXRyaXhcbiAgICogQHJldHVybiB7bW9kdWxlOndlYmdsMi0yZC1tYXRoLk1hdHJpeDN9IGFuIGlkZW50aXR5IG1hdHJpeFxuICAgKi9cbiAgZnVuY3Rpb24gaWRlbnRpdHkoKSB7XG4gICAgcmV0dXJuIFtcbiAgICAgIDEsIDAsIDAsXG4gICAgICAwLCAxLCAwLFxuICAgICAgMCwgMCwgMSxcbiAgICBdO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSAyRCBwcm9qZWN0aW9uIG1hdHJpeFxuICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGggd2lkdGggaW4gcGl4ZWxzXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHQgaGVpZ2h0IGluIHBpeGVsc1xuICAgKiBAcmV0dXJuIHttb2R1bGU6d2ViZ2wtMmQtbWF0aC5NYXRyaXgzfSBhIHByb2plY3Rpb24gbWF0cml4IHRoYXQgY29udmVydHMgZnJvbSBwaXhlbHMgdG8gY2xpcHNwYWNlIHdpdGggWSA9IDAgYXQgdGhlIHRvcC5cbiAgICogQG1lbWJlck9mIG1vZHVsZTp3ZWJnbC0yZC1tYXRoXG4gICAqL1xuICBmdW5jdGlvbiBwcm9qZWN0aW9uKHdpZHRoLCBoZWlnaHQpIHtcbiAgICAvLyBOb3RlOiBUaGlzIG1hdHJpeCBmbGlwcyB0aGUgWSBheGlzIHNvIDAgaXMgYXQgdGhlIHRvcC5cbiAgICByZXR1cm4gW1xuICAgICAgMiAvIHdpZHRoLCAwLCAwLFxuICAgICAgMCwgLTIgLyBoZWlnaHQsIDAsXG4gICAgICAtMSwgMSwgMSxcbiAgICBdO1xuICB9XG5cbiAgLyoqXG4gICAqIE11bHRpcGxpZXMgYnkgYSAyRCBwcm9qZWN0aW9uIG1hdHJpeFxuICAgKiBAcGFyYW0ge21vZHVsZTp3ZWJnbC0yZC1tYXRoLk1hdHJpeDN9IHRoZSBtYXRyaXggdG8gYmUgbXVsdGlwbGllZFxuICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGggd2lkdGggaW4gcGl4ZWxzXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHQgaGVpZ2h0IGluIHBpeGVsc1xuICAgKiBAcmV0dXJuIHttb2R1bGU6d2ViZ2wtMmQtbWF0aC5NYXRyaXgzfSB0aGUgcmVzdWx0XG4gICAqIEBtZW1iZXJPZiBtb2R1bGU6d2ViZ2wtMmQtbWF0aFxuICAgKi9cbiAgZnVuY3Rpb24gcHJvamVjdChtLCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgcmV0dXJuIG11bHRpcGx5KG0sIHByb2plY3Rpb24od2lkdGgsIGhlaWdodCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSAyRCB0cmFuc2xhdGlvbiBtYXRyaXhcbiAgICogQHBhcmFtIHtudW1iZXJ9IHR4IGFtb3VudCB0byB0cmFuc2xhdGUgaW4geFxuICAgKiBAcGFyYW0ge251bWJlcn0gdHkgYW1vdW50IHRvIHRyYW5zbGF0ZSBpbiB5XG4gICAqIEByZXR1cm4ge21vZHVsZTp3ZWJnbC0yZC1tYXRoLk1hdHJpeDN9IGEgdHJhbnNsYXRpb24gbWF0cml4IHRoYXQgdHJhbnNsYXRlcyBieSB0eCBhbmQgdHkuXG4gICAqIEBtZW1iZXJPZiBtb2R1bGU6d2ViZ2wtMmQtbWF0aFxuICAgKi9cbiAgZnVuY3Rpb24gdHJhbnNsYXRpb24odHgsIHR5KSB7XG4gICAgcmV0dXJuIFtcbiAgICAgIDEsIDAsIDAsXG4gICAgICAwLCAxLCAwLFxuICAgICAgdHgsIHR5LCAxLFxuICAgIF07XG4gIH1cblxuICAvKipcbiAgICogTXVsdGlwbGllcyBieSBhIDJEIHRyYW5zbGF0aW9uIG1hdHJpeFxuICAgKiBAcGFyYW0ge21vZHVsZTp3ZWJnbC0yZC1tYXRoLk1hdHJpeDN9IHRoZSBtYXRyaXggdG8gYmUgbXVsdGlwbGllZFxuICAgKiBAcGFyYW0ge251bWJlcn0gdHggYW1vdW50IHRvIHRyYW5zbGF0ZSBpbiB4XG4gICAqIEBwYXJhbSB7bnVtYmVyfSB0eSBhbW91bnQgdG8gdHJhbnNsYXRlIGluIHlcbiAgICogQHJldHVybiB7bW9kdWxlOndlYmdsLTJkLW1hdGguTWF0cml4M30gdGhlIHJlc3VsdFxuICAgKiBAbWVtYmVyT2YgbW9kdWxlOndlYmdsLTJkLW1hdGhcbiAgICovXG4gIGZ1bmN0aW9uIHRyYW5zbGF0ZShtLCB0eCwgdHkpIHtcbiAgICByZXR1cm4gbXVsdGlwbHkobSwgdHJhbnNsYXRpb24odHgsIHR5KSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIDJEIHJvdGF0aW9uIG1hdHJpeFxuICAgKiBAcGFyYW0ge251bWJlcn0gYW5nbGVJblJhZGlhbnMgYW1vdW50IHRvIHJvdGF0ZSBpbiByYWRpYW5zXG4gICAqIEByZXR1cm4ge21vZHVsZTp3ZWJnbC0yZC1tYXRoLk1hdHJpeDN9IGEgcm90YXRpb24gbWF0cml4IHRoYXQgcm90YXRlcyBieSBhbmdsZUluUmFkaWFuc1xuICAgKiBAbWVtYmVyT2YgbW9kdWxlOndlYmdsLTJkLW1hdGhcbiAgICovXG4gIGZ1bmN0aW9uIHJvdGF0aW9uKGFuZ2xlSW5SYWRpYW5zKSB7XG4gICAgdmFyIGMgPSBNYXRoLmNvcyhhbmdsZUluUmFkaWFucyk7XG4gICAgdmFyIHMgPSBNYXRoLnNpbihhbmdsZUluUmFkaWFucyk7XG4gICAgcmV0dXJuIFtcbiAgICAgIGMsIC1zLCAwLFxuICAgICAgcywgYywgMCxcbiAgICAgIDAsIDAsIDEsXG4gICAgXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNdWx0aXBsaWVzIGJ5IGEgMkQgcm90YXRpb24gbWF0cml4XG4gICAqIEBwYXJhbSB7bW9kdWxlOndlYmdsLTJkLW1hdGguTWF0cml4M30gdGhlIG1hdHJpeCB0byBiZSBtdWx0aXBsaWVkXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBhbmdsZUluUmFkaWFucyBhbW91bnQgdG8gcm90YXRlIGluIHJhZGlhbnNcbiAgICogQHJldHVybiB7bW9kdWxlOndlYmdsLTJkLW1hdGguTWF0cml4M30gdGhlIHJlc3VsdFxuICAgKiBAbWVtYmVyT2YgbW9kdWxlOndlYmdsLTJkLW1hdGhcbiAgICovXG4gIGZ1bmN0aW9uIHJvdGF0ZShtLCBhbmdsZUluUmFkaWFucykge1xuICAgIHJldHVybiBtdWx0aXBseShtLCByb3RhdGlvbihhbmdsZUluUmFkaWFucykpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSAyRCBzY2FsaW5nIG1hdHJpeFxuICAgKiBAcGFyYW0ge251bWJlcn0gc3ggYW1vdW50IHRvIHNjYWxlIGluIHhcbiAgICogQHBhcmFtIHtudW1iZXJ9IHN5IGFtb3VudCB0byBzY2FsZSBpbiB5XG4gICAqIEByZXR1cm4ge21vZHVsZTp3ZWJnbC0yZC1tYXRoLk1hdHJpeDN9IGEgc2NhbGUgbWF0cml4IHRoYXQgc2NhbGVzIGJ5IHN4IGFuZCBzeS5cbiAgICogQG1lbWJlck9mIG1vZHVsZTp3ZWJnbC0yZC1tYXRoXG4gICAqL1xuICBmdW5jdGlvbiBzY2FsaW5nKHN4LCBzeSkge1xuICAgIHJldHVybiBbXG4gICAgICBzeCwgMCwgMCxcbiAgICAgIDAsIHN5LCAwLFxuICAgICAgMCwgMCwgMSxcbiAgICBdO1xuICB9XG5cbiAgLyoqXG4gICAqIE11bHRpcGxpZXMgYnkgYSAyRCBzY2FsaW5nIG1hdHJpeFxuICAgKiBAcGFyYW0ge21vZHVsZTp3ZWJnbC0yZC1tYXRoLk1hdHJpeDN9IHRoZSBtYXRyaXggdG8gYmUgbXVsdGlwbGllZFxuICAgKiBAcGFyYW0ge251bWJlcn0gc3ggYW1vdW50IHRvIHNjYWxlIGluIHhcbiAgICogQHBhcmFtIHtudW1iZXJ9IHN5IGFtb3VudCB0byBzY2FsZSBpbiB5XG4gICAqIEByZXR1cm4ge21vZHVsZTp3ZWJnbC0yZC1tYXRoLk1hdHJpeDN9IHRoZSByZXN1bHRcbiAgICogQG1lbWJlck9mIG1vZHVsZTp3ZWJnbC0yZC1tYXRoXG4gICAqL1xuICBmdW5jdGlvbiBzY2FsZShtLCBzeCwgc3kpIHtcbiAgICByZXR1cm4gbXVsdGlwbHkobSwgc2NhbGluZyhzeCwgc3kpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRvdCh4MSwgeTEsIHgyLCB5Mikge1xuICAgIHJldHVybiB4MSAqIHgyICsgeTEgKiB5MjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRpc3RhbmNlKHgxLCB5MSwgeDIsIHkyKSB7XG4gICAgdmFyIGR4ID0geDEgLSB4MjtcbiAgICB2YXIgZHkgPSB5MSAtIHkyO1xuICAgIHJldHVybiBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xuICB9XG5cbiAgZnVuY3Rpb24gbm9ybWFsaXplKHgsIHkpIHtcbiAgICB2YXIgbCA9IGRpc3RhbmNlKDAsIDAsIHgsIHkpO1xuICAgIGlmIChsID4gMC4wMDAwMSkge1xuICAgICAgcmV0dXJuIFt4IC8gbCwgeSAvIGxdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gWzAsIDBdO1xuICAgIH1cbiAgfVxuXG4gIC8vIGkgPSBpbmNpZGVudFxuICAvLyBuID0gbm9ybWFsXG4gIGZ1bmN0aW9uIHJlZmxlY3QoaXgsIGl5LCBueCwgbnkpIHtcbiAgICAvLyBJIC0gMi4wICogZG90KE4sIEkpICogTi5cbiAgICB2YXIgZCA9IGRvdChueCwgbnksIGl4LCBpeSk7XG4gICAgcmV0dXJuIFtcbiAgICAgIGl4IC0gMiAqIGQgKiBueCxcbiAgICAgIGl5IC0gMiAqIGQgKiBueSxcbiAgICBdO1xuICB9XG5cbiAgZnVuY3Rpb24gcmFkVG9EZWcocikge1xuICAgIHJldHVybiByICogMTgwIC8gTWF0aC5QSTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRlZ1RvUmFkKGQpIHtcbiAgICByZXR1cm4gZCAqIE1hdGguUEkgLyAxODA7XG4gIH1cblxuICBmdW5jdGlvbiB0cmFuc2Zvcm1Qb2ludChtLCB2KSB7XG4gICAgdmFyIHYwID0gdlswXTtcbiAgICB2YXIgdjEgPSB2WzFdO1xuICAgIHZhciBkID0gdjAgKiBtWzAgKiAzICsgMl0gKyB2MSAqIG1bMSAqIDMgKyAyXSArIG1bMiAqIDMgKyAyXTtcbiAgICByZXR1cm4gW1xuICAgICAgKHYwICogbVswICogMyArIDBdICsgdjEgKiBtWzEgKiAzICsgMF0gKyBtWzIgKiAzICsgMF0pIC8gZCxcbiAgICAgICh2MCAqIG1bMCAqIDMgKyAxXSArIHYxICogbVsxICogMyArIDFdICsgbVsyICogMyArIDFdKSAvIGQsXG4gICAgXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGludmVyc2UobSkge1xuICAgIHZhciB0MDAgPSBtWzEgKiAzICsgMV0gKiBtWzIgKiAzICsgMl0gLSBtWzEgKiAzICsgMl0gKiBtWzIgKiAzICsgMV07XG4gICAgdmFyIHQxMCA9IG1bMCAqIDMgKyAxXSAqIG1bMiAqIDMgKyAyXSAtIG1bMCAqIDMgKyAyXSAqIG1bMiAqIDMgKyAxXTtcbiAgICB2YXIgdDIwID0gbVswICogMyArIDFdICogbVsxICogMyArIDJdIC0gbVswICogMyArIDJdICogbVsxICogMyArIDFdO1xuICAgIHZhciBkID0gMS4wIC8gKG1bMCAqIDMgKyAwXSAqIHQwMCAtIG1bMSAqIDMgKyAwXSAqIHQxMCArIG1bMiAqIDMgKyAwXSAqIHQyMCk7XG4gICAgcmV0dXJuIFtcbiAgICAgICBkICogdDAwLCAtZCAqIHQxMCwgZCAqIHQyMCxcbiAgICAgIC1kICogKG1bMSAqIDMgKyAwXSAqIG1bMiAqIDMgKyAyXSAtIG1bMSAqIDMgKyAyXSAqIG1bMiAqIDMgKyAwXSksXG4gICAgICAgZCAqIChtWzAgKiAzICsgMF0gKiBtWzIgKiAzICsgMl0gLSBtWzAgKiAzICsgMl0gKiBtWzIgKiAzICsgMF0pLFxuICAgICAgLWQgKiAobVswICogMyArIDBdICogbVsxICogMyArIDJdIC0gbVswICogMyArIDJdICogbVsxICogMyArIDBdKSxcbiAgICAgICBkICogKG1bMSAqIDMgKyAwXSAqIG1bMiAqIDMgKyAxXSAtIG1bMSAqIDMgKyAxXSAqIG1bMiAqIDMgKyAwXSksXG4gICAgICAtZCAqIChtWzAgKiAzICsgMF0gKiBtWzIgKiAzICsgMV0gLSBtWzAgKiAzICsgMV0gKiBtWzIgKiAzICsgMF0pLFxuICAgICAgIGQgKiAobVswICogMyArIDBdICogbVsxICogMyArIDFdIC0gbVswICogMyArIDFdICogbVsxICogMyArIDBdKSxcbiAgICBdO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBkZWdUb1JhZDogZGVnVG9SYWQsXG4gICAgZGlzdGFuY2U6IGRpc3RhbmNlLFxuICAgIGRvdDogZG90LFxuICAgIGlkZW50aXR5OiBpZGVudGl0eSxcbiAgICBpbnZlcnNlOiBpbnZlcnNlLFxuICAgIG11bHRpcGx5OiBtdWx0aXBseSxcbiAgICBub3JtYWxpemU6IG5vcm1hbGl6ZSxcbiAgICBwcm9qZWN0aW9uOiBwcm9qZWN0aW9uLFxuICAgIHJhZFRvRGVnOiByYWRUb0RlZyxcbiAgICByZWZsZWN0OiByZWZsZWN0LFxuICAgIHJvdGF0aW9uOiByb3RhdGlvbixcbiAgICByb3RhdGU6IHJvdGF0ZSxcbiAgICBzY2FsaW5nOiBzY2FsaW5nLFxuICAgIHNjYWxlOiBzY2FsZSxcbiAgICB0cmFuc2Zvcm1Qb2ludDogdHJhbnNmb3JtUG9pbnQsXG4gICAgdHJhbnNsYXRpb246IHRyYW5zbGF0aW9uLFxuICAgIHRyYW5zbGF0ZTogdHJhbnNsYXRlLFxuICAgIHByb2plY3Q6IHByb2plY3QsXG4gIH07XG5cbn0pKTtcblxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vaW5kZXgudHNcIik7XG4iXSwic291cmNlUm9vdCI6IiJ9