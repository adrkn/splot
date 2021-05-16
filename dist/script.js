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
var n = 100000; // Имитируемое число объектов.
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
            shape: 0,
            color: randomInt(palette.length), // Индекс цвета в массиве цветов
        };
    }
    else
        return null; // Возвращаем null, когда объекты "закончились"
}
var objects = [
    { x: 350, y: 150, shape: 1, color: 1 },
    { x: 450, y: 150, shape: 1, color: 2 },
    { x: 350, y: 250, shape: 1, color: 3 },
    { x: 450, y: 250, shape: 1, color: 4 },
];
var j = -1;
function readNextObject2() {
    if (j < objects.length) {
        j++;
        return objects[j];
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
    polygonSize: 1,
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
            '  gl_PointSize = 1.0 * a_color;\n' +
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zdHlsZS5jc3M/YzRkMiIsIndlYnBhY2s6Ly8vLi9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9zcGxvdC50cyIsIndlYnBhY2s6Ly8vLi9tMy5qcyIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svc3RhcnR1cCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7OztBQ0FBLGdGQUEyQjtBQUMzQixrREFBZ0I7QUFFaEIsU0FBUyxTQUFTLENBQUMsS0FBYTtJQUM5QixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEtBQUssQ0FBQztBQUMxQyxDQUFDO0FBRUQsSUFBSSxDQUFDLEdBQUcsQ0FBQztBQUNULElBQUksQ0FBQyxHQUFHLE1BQU8sRUFBRSw4QkFBOEI7QUFDL0MsSUFBSSxPQUFPLEdBQUcsQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUM7QUFDNUgsSUFBSSxTQUFTLEdBQUcsS0FBTTtBQUN0QixJQUFJLFVBQVUsR0FBRyxLQUFNO0FBRXZCLGdIQUFnSDtBQUNoSCxTQUFTLGNBQWM7SUFDckIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQ1QsQ0FBQyxFQUFFO1FBQ0gsT0FBTztZQUNMLENBQUMsRUFBRSxTQUFTLENBQUMsU0FBUyxDQUFDO1lBQ3ZCLENBQUMsRUFBRSxTQUFTLENBQUMsVUFBVSxDQUFDO1lBQ3hCLEtBQUssRUFBRSxDQUFDO1lBQ1IsS0FBSyxFQUFFLFNBQVMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUcsZ0NBQWdDO1NBQ3BFO0tB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M0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWEsNkJBQTZCO0FBQzFDLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEIsY0FBYyw2QkFBNkI7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQixjQUFjLDZCQUE2QjtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWEsNkJBQTZCO0FBQzFDLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEIsY0FBYyw2QkFBNkI7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCLGNBQWMsNkJBQTZCO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWEsNkJBQTZCO0FBQzFDLGFBQWEsT0FBTztBQUNwQixjQUFjLDZCQUE2QjtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhLE9BQU87QUFDcEIsYUFBYSxPQUFPO0FBQ3BCLGNBQWMsNkJBQTZCO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYSw2QkFBNkI7QUFDMUMsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQixjQUFjLDZCQUE2QjtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxDQUFDOzs7Ozs7OztVQzdTRDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQSxzREFBc0Qsa0JBQWtCO1dBQ3hFO1dBQ0EsK0NBQStDLGNBQWM7V0FDN0QsRTs7Ozs7VUNOQTtVQUNBO1VBQ0E7VUFDQSIsImZpbGUiOiJzY3JpcHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCJpbXBvcnQgU1Bsb3QgZnJvbSAnLi9zcGxvdCdcbmltcG9ydCAnQC9zdHlsZSdcblxuZnVuY3Rpb24gcmFuZG9tSW50KHJhbmdlOiBudW1iZXIpIHtcbiAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHJhbmdlKVxufVxuXG5sZXQgaSA9IDBcbmxldCBuID0gMTAwXzAwMCAgLy8g0JjQvNC40YLQuNGA0YPQtdC80L7QtSDRh9C40YHQu9C+INC+0LHRitC10LrRgtC+0LIuXG5sZXQgcGFsZXR0ZSA9IFsnI0ZGMDBGRicsICcjODAwMDgwJywgJyNGRjAwMDAnLCAnIzgwMDAwMCcsICcjRkZGRjAwJywgJyMwMEZGMDAnLCAnIzAwODAwMCcsICcjMDBGRkZGJywgJyMwMDAwRkYnLCAnIzAwMDA4MCddXG5sZXQgcGxvdFdpZHRoID0gMzJfMDAwXG5sZXQgcGxvdEhlaWdodCA9IDE2XzAwMFxuXG4vLyDQn9GA0LjQvNC10YAg0LjRgtC10YDQuNGA0YPRjtGJ0LXQuSDRhNGD0L3QutGG0LjQuC4g0JjRgtC10YDQsNGG0LjQuCDQuNC80LjRgtC40YDRg9GO0YLRgdGPINGB0LvRg9GH0LDQudC90YvQvNC4INCy0YvQtNCw0YfQsNC80LguINCf0L7Rh9GC0Lgg0YLQsNC60LbQtSDRgNCw0LHQvtGC0LDQtdGCINGA0LXQttC40Lwg0LTQtdC80L4t0LTQsNC90L3Ri9GFLlxuZnVuY3Rpb24gcmVhZE5leHRPYmplY3QoKSB7XG4gIGlmIChpIDwgbikge1xuICAgIGkrK1xuICAgIHJldHVybiB7XG4gICAgICB4OiByYW5kb21JbnQocGxvdFdpZHRoKSxcbiAgICAgIHk6IHJhbmRvbUludChwbG90SGVpZ2h0KSxcbiAgICAgIHNoYXBlOiAwLCAgICAgICAgICAgICAgIC8vIDAgLSDRgtGA0LXRg9Cz0L7Qu9GM0L3QuNC6LCAxIC0g0LrQstCw0LTRgNCw0YIsIDIgLSDQutGA0YPQs1xuICAgICAgY29sb3I6IHJhbmRvbUludChwYWxldHRlLmxlbmd0aCksICAvLyDQmNC90LTQtdC60YEg0YbQstC10YLQsCDQsiDQvNCw0YHRgdC40LLQtSDRhtCy0LXRgtC+0LJcbiAgICB9XG4gIH1cbiAgZWxzZVxuICAgIHJldHVybiBudWxsICAvLyDQktC+0LfQstGA0LDRidCw0LXQvCBudWxsLCDQutC+0LPQtNCwINC+0LHRitC10LrRgtGLIFwi0LfQsNC60L7QvdGH0LjQu9C40YHRjFwiXG59XG5cblxubGV0IG9iamVjdHMgPSBbXG4gIHsgeDogMzUwLCB5OiAxNTAsIHNoYXBlOiAxLCBjb2xvcjogMSB9LFxuICB7IHg6IDQ1MCwgeTogMTUwLCBzaGFwZTogMSwgY29sb3I6IDIgfSxcbiAgeyB4OiAzNTAsIHk6IDI1MCwgc2hhcGU6IDEsIGNvbG9yOiAzIH0sXG4gIHsgeDogNDUwLCB5OiAyNTAsIHNoYXBlOiAxLCBjb2xvcjogNCB9LFxuXVxuXG5sZXQgaiA9IC0xXG5cbmZ1bmN0aW9uIHJlYWROZXh0T2JqZWN0MigpIHtcbiAgaWYgKGogPCBvYmplY3RzLmxlbmd0aCkge1xuICAgIGorK1xuICAgIHJldHVybiBvYmplY3RzW2pdXG4gIH1cbiAgZWxzZVxuICAgIHJldHVybiBudWxsICAvLyDQktC+0LfQstGA0LDRidCw0LXQvCBudWxsLCDQutC+0LPQtNCwINC+0LHRitC10LrRgtGLIFwi0LfQsNC60L7QvdGH0LjQu9C40YHRjFwiXG59XG5cbi8qKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKiovXG5cbmxldCBzY2F0dGVyUGxvdCA9IG5ldyBTUGxvdCgnY2FudmFzMScpXG5cbi8vINCd0LDRgdGC0YDQvtC50LrQsCDRjdC60LfQtdC80L/Qu9GP0YDQsCDQvdCwINGA0LXQttC40Lwg0LLRi9Cy0L7QtNCwINC+0YLQu9Cw0LTQvtGH0L3QvtC5INC40L3RhNC+0YDQvNCw0YbQuNC4INCyINC60L7QvdGB0L7Qu9GMINCx0YDQsNGD0LfQtdGA0LAuXG4vLyDQlNGA0YPQs9C40LUg0L/RgNC40LzQtdGA0Ysg0YDQsNCx0L7RgtGLINC+0L/QuNGB0LDQvdGLINCyINGE0LDQudC70LUgc3Bsb3QuanMg0YHQviDRgdGC0YDQvtC60LggMjE0Llxuc2NhdHRlclBsb3Quc2V0dXAoe1xuICBpdGVyYXRpb25DYWxsYmFjazogcmVhZE5leHRPYmplY3QsXG4gIHBvbHlnb25QYWxldHRlOiBwYWxldHRlLFxuICBwb2x5Z29uU2l6ZTogMSxcbiAgZ3JpZFNpemU6IHtcbiAgICB3aWR0aDogcGxvdFdpZHRoLFxuICAgIGhlaWdodDogcGxvdEhlaWdodCxcbiAgfSxcbiAgZGVidWdNb2RlOiB7XG4gICAgaXNFbmFibGU6IHRydWUsXG4gIH0sXG4gIGRlbW9Nb2RlOiB7XG4gICAgaXNFbmFibGU6IGZhbHNlLFxuICB9LFxufSlcblxuc2NhdHRlclBsb3QucnVuKClcbiIsIi8vIEB0cy1pZ25vcmVcbmltcG9ydCBtMyBmcm9tICcuL20zJ1xuXG4vKipcbiAqINCf0YDQvtCy0LXRgNGP0LXRgiDRj9Cy0LvRj9C10YLRgdGPINC70Lgg0L/QtdGA0LXQvNC10L3QvdCw0Y8g0Y3QutC30LXQvNC/0LvRj9GA0L7QvCDQutCw0LrQvtCz0L4t0LvQuNCx0L7QviDQutC70LDRgdGB0LAuXG4gKlxuICogQHBhcmFtIHZhbCAtINCf0YDQvtCy0LXRgNGP0LXQvNCw0Y8g0L/QtdGA0LXQvNC10L3QvdCw0Y8uXG4gKiBAcmV0dXJucyDQoNC10LfRg9C70YzRgtCw0YIg0L/RgNC+0LLQtdGA0LrQuC5cbiAqL1xuZnVuY3Rpb24gaXNPYmplY3Qob2JqOiBhbnkpOiBib29sZWFuIHtcbiAgcmV0dXJuIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgT2JqZWN0XScpXG59XG5cbi8qKlxuICog0JLQvtC30LLRgNCw0YnQsNC10YIg0YHQu9GD0YfQsNC50L3QvtC1INGG0LXQu9C+0LUg0YfQuNGB0LvQviDQsiDQtNC40LDQv9Cw0LfQvtC90LU6IFswLi4ucmFuZ2UtMV0uXG4gKlxuICogQHBhcmFtIHJhbmdlIC0g0JLQtdGA0YXQvdC40Lkg0L/RgNC10LTQtdC7INC00LjQsNC/0LDQt9C+0L3QsCDRgdC70YPRh9Cw0LnQvdC+0LPQviDQstGL0LHQvtGA0LAuXG4gKiBAcmV0dXJucyDQodC70YPRh9Cw0LnQvdC+0LUg0YfQuNGB0LvQvi5cbiAqL1xuZnVuY3Rpb24gcmFuZG9tSW50KHJhbmdlOiBudW1iZXIpOiBudW1iZXIge1xuICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcmFuZ2UpXG59XG5cbi8qKlxuICog0J/RgNC10L7QsdGA0LDQt9GD0LXRgiDQvtCx0YrQtdC60YIg0LIg0YHRgtGA0L7QutGDIEpTT04uINCY0LzQtdC10YIg0L7RgtC70LjRh9C40LUg0L7RgiDRgdGC0LDQvdC00LDRgNGC0L3QvtC5INGE0YPQvdC60YbQuNC4IEpTT04uc3RyaW5naWZ5IC0g0L/QvtC70Y8g0L7QsdGK0LXQutGC0LAsINC40LzQtdGO0YnQuNC1XG4gKiDQt9C90LDRh9C10L3QuNGPINGE0YPQvdC60YbQuNC5INC90LUg0L/RgNC+0L/Rg9GB0LrQsNGO0YLRgdGPLCDQsCDQv9GA0LXQvtCx0YDQsNC30YPRjtGC0YHRjyDQsiDQvdCw0LfQstCw0L3QuNC1INGE0YPQvdC60YbQuNC4LlxuICpcbiAqIEBwYXJhbSBvYmogLSDQptC10LvQtdCy0L7QuSDQvtCx0YrQtdC60YIuXG4gKiBAcmV0dXJucyDQodGC0YDQvtC60LAgSlNPTiwg0L7RgtC+0LHRgNCw0LbQsNGO0YnQsNGPINC+0LHRitC10LrRgi5cbiAqL1xuZnVuY3Rpb24ganNvblN0cmluZ2lmeShvYmo6IGFueSk6IHN0cmluZyB7XG4gIHJldHVybiBKU09OLnN0cmluZ2lmeShcbiAgICBvYmosXG4gICAgZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICAgIHJldHVybiAodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKSA/IHZhbHVlLm5hbWUgOiB2YWx1ZVxuICAgIH0sXG4gICAgJyAnXG4gIClcbn1cblxuLyoqXG4gKiDQotC40L8g0YTRg9C90LrRhtC40LgsINCy0YvRh9C40YHQu9GP0Y7RidC10Lkg0LrQvtC+0YDQtNC40L3QsNGC0Ysg0LLQtdGA0YjQuNC9INC/0L7Qu9C40LPQvtC90LAg0L7Qv9GA0LXQtNC10LvQtdC90L3QvtC5INGE0L7RgNC80YsuXG4gKlxuICogQHBhcmFtIHggLSDQn9C+0LvQvtC20LXQvdC40LUg0YbQtdC90YLRgNCwINC/0L7Qu9C40LPQvtC90LAg0L3QsCDQvtGB0Lgg0LDQsdGB0YbQuNGB0YEuXG4gKiBAcGFyYW0geSAtINCf0L7Qu9C+0LbQtdC90LjQtSDRhtC10L3RgtGA0LAg0L/QvtC70LjQs9C+0L3QsCDQvdCwINC+0YHQuCDQvtGA0LTQuNC90LDRgi5cbiAqIEBwYXJhbSBjb25zdHMgLSDQndCw0LHQvtGAINCy0YHQv9C+0LzQvtCz0LDRgtC10LvRjNC90YvRhSDQutC+0L3RgdGC0LDQvdGCLCDQuNGB0L/QvtC70YzQt9GD0LXQvNGL0YUg0LTQu9GPINCy0YvRh9C40YHQu9C10L3QuNGPINCy0LXRgNGI0LjQvS5cbiAqIEByZXR1cm5zINCU0LDQvdC90YvQtSDQviDQstC10YDRiNC40L3QsNGFINC/0L7Qu9C40LPQvtC90LAuXG4gKi9cbnR5cGUgU1Bsb3RDYWxjU2hhcGVGdW5jID0gKHg6IG51bWJlciwgeTogbnVtYmVyLCBjb25zdHM6IEFycmF5PGFueT4pID0+IFNQbG90UG9seWdvblZlcnRpY2VzXG5cbi8qKlxuICog0KLQuNC/INGG0LLQtdGC0LAg0LIgSEVYLdGE0L7RgNC80LDRgtC1IChcIiNmZmZmZmZcIikuXG4gKi9cbnR5cGUgSEVYQ29sb3IgPSBzdHJpbmdcblxuLyoqXG4gKiDQotC40L8g0YTRg9C90LrRhtC40Lgg0LjRgtC10YDQuNGA0L7QstCw0L3QuNGPINC80LDRgdGB0LjQstCwINC40YHRhdC+0LTQvdGL0YUg0L7QsdGK0LXQutGC0L7Qsi4g0JrQsNC20LTRi9C5INCy0YvQt9C+0LIg0YLQsNC60L7QuSDRhNGD0L3QutGG0LjQuCDQtNC+0LvQttC10L0g0LLQvtC30LLRgNCw0YnQsNGC0Ywg0LjQvdGE0L7RgNC80LDRhtC40Y4g0L7QsVxuICog0L7Rh9C10YDQtdC00L3QvtC8INC/0L7Qu9C40LPQvtC90LUsINC60L7RgtC+0YDRi9C5INC90LXQvtCx0YXQvtC00LjQvNC+INC+0YLQvtCx0YDQsNC30LjRgtGMICjQtdCz0L4g0LrQvtC+0YDQtNC40L3QsNGC0YssINGE0L7RgNC80YMg0Lgg0YbQstC10YIpLiDQmtC+0LPQtNCwINC40YHRhdC+0LTQvdGL0LUg0L7QsdGK0LXQutGC0Ysg0LfQsNC60L7QvdGH0LDRgtGB0Y9cbiAqINGE0YPQvdC60YbQuNGPINC00L7Qu9C20L3QsCDQstC10YDQvdGD0YLRjCBudWxsLlxuICovXG50eXBlIFNQbG90SXRlcmF0aW9uRnVuY3Rpb24gPSAoKSA9PiBTUGxvdFBvbHlnb24gfCBudWxsXG5cbi8qKlxuICog0KLQuNC/INC80LXRgdGC0LAg0LLRi9Cy0L7QtNCwINGB0LjRgdGC0LXQvNC90L7QuSDQuNC90YTQvtGA0LzQsNGG0LjQuCDQv9GA0Lgg0LDQutGC0LjQstC40YDQvtCy0LDQvdC90L7QvCDRgNC10LbQuNC80LUg0L7RgtC70LDQtNC60Lgg0L/RgNC40LvQvtC20LXQvdC40Y8uXG4gKiDQl9C90LDRh9C10L3QuNC1IFwiY29uc29sZVwiINGD0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdGCINCyINC60LDRh9C10YHRgtCy0LUg0LzQtdGB0YLQsCDQstGL0LLQvtC00LAg0LrQvtC90YHQvtC70Ywg0LHRgNCw0YPQt9C10YDQsC5cbiAqXG4gKiBAdG9kbyDQlNC+0LHQsNCy0LjRgtGMINC80LXRgdGC0L4g0LLRi9Cy0L7QtNCwIC0gSFRNTCDQtNC+0LrRg9C80LXQvdGCICjQt9C90LDRh9C10L3QuNC1IFwiZG9jdW1lbnRcIilcbiAqIEB0b2RvINCU0L7QsdCw0LLQuNGC0Ywg0LzQtdGB0YLQviDQstGL0LLQvtC00LAgLSDRhNCw0LnQuyAo0LfQvdCw0YfQtdC90LjQtSBcImZpbGVcIilcbiAqL1xudHlwZSBTUGxvdERlYnVnT3V0cHV0ID0gJ2NvbnNvbGUnXG5cbi8qKlxuICog0KLQuNC/INGI0LXQudC00LXRgNCwIFdlYkdMLlxuICog0JfQvdCw0YfQtdC90LjQtSBcIlZFUlRFWF9TSEFERVJcIiDQt9Cw0LTQsNC10YIg0LLQtdGA0YjQuNC90L3Ri9C5INGI0LXQudC00LXRgC5cbiAqINCX0L3QsNGH0LXQvdC40LUgXCJGUkFHTUVOVF9TSEFERVJcIiDQt9Cw0LTQsNC10YIg0YTRgNCw0LPQvNC10L3RgtC90YvQuSDRiNC10LnQtNC10YAuXG4gKi9cbnR5cGUgV2ViR2xTaGFkZXJUeXBlID0gJ1ZFUlRFWF9TSEFERVInIHwgJ0ZSQUdNRU5UX1NIQURFUidcblxuLyoqXG4gKiDQotC40L8g0LHRg9GE0LXRgNCwIFdlYkdMLlxuICog0JfQvdCw0YfQtdC90LjQtSBcIkFSUkFZX0JVRkZFUlwiINC30LDQtNCw0LXRgiDQsdGD0YTQtdGAINGB0L7QtNC10YDQttCw0YnQuNC5INCy0LXRgNGI0LjQvdC90YvQtSDQsNGC0YDQuNCx0YPRgtGLLlxuICog0JfQvdCw0YfQtdC90LjQtSBcIkVMRU1FTlRfQVJSQVlfQlVGRkVSXCIg0LfQsNC00LDQtdGCINCx0YPRhNC10YAg0LjRgdC/0L7Qu9GM0LfRg9GO0YnQuNC50YHRjyDQtNC70Y8g0LjQvdC00LXQutGB0LjRgNC+0LLQsNC90LjRjyDRjdC70LXQvNC10L3RgtC+0LIuXG4gKi9cbnR5cGUgV2ViR2xCdWZmZXJUeXBlID0gJ0FSUkFZX0JVRkZFUicgfCAnRUxFTUVOVF9BUlJBWV9CVUZGRVInXG5cbi8qKlxuICog0KLQuNC/INC/0LXRgNC10LzQtdC90L3QvtC5IFdlYkdMLlxuICog0JfQvdCw0YfQtdC90LjQtSBcInVuaWZvcm1cIiDQt9Cw0LTQsNC10YIg0L7QsdGJ0YPRjiDQtNC70Y8g0LLRgdC10YUg0LLQtdGA0YjQuNC90L3Ri9GFINGI0LXQudC00LXRgNC+0LIg0L/QtdGA0LXQvNC10L3QvdGD0Y4uXG4gKiDQl9C90LDRh9C10L3QuNC1IFwiYXR0cmlidXRlXCIg0LfQsNC00LDQtdGCINGD0L3QuNC60LDQu9GM0L3Rg9GOINC/0LXRgNC10LzQtdC90L3Rg9GOINC00LvRjyDQutCw0LbQtNC+0LPQviDQstC10YDRiNC40L3QvdC+0LPQviDRiNC10LnQtNC10YDQsC5cbiAqINCX0L3QsNGH0LXQvdC40LUgXCJ2YXJ5aW5nXCIg0LfQsNC00LDQtdGCINGD0L3QuNC60LDQu9GM0L3Rg9GOINC/0LXRgNC10LzQtdC90L3Rg9GOINGBINC+0LHRidC10Lkg0L7QsdC70LDRgdGC0YzRjiDQstC40LTQuNC80L7RgdGC0Lgg0LTQu9GPINCy0LXRgNGI0LjQvdC90L7Qs9C+INC4INGE0YDQsNCz0LzQtdC90YLQvdC+0LPQviDRiNC10LnQtNC10YDQvtCyLlxuICovXG50eXBlIFdlYkdsVmFyaWFibGVUeXBlID0gJ3VuaWZvcm0nIHwgJ2F0dHJpYnV0ZScgfCAndmFyeWluZydcblxuLyoqXG4gKiDQotC40L8g0LzQsNGB0YHQuNCy0LAg0LTQsNC90L3Ri9GFLCDQt9Cw0L3QuNC80LDRjtGJ0LjRhSDQsiDQv9Cw0LzRj9GC0Lgg0L3QtdC/0YDQtdGA0YvQstC90YvQuSDQvtCx0YrQtdC8LlxuICovXG50eXBlIFR5cGVkQXJyYXkgPSBJbnQ4QXJyYXkgfCBJbnQxNkFycmF5IHwgSW50MzJBcnJheSB8IFVpbnQ4QXJyYXkgfFxuICBVaW50MTZBcnJheSB8IFVpbnQzMkFycmF5IHwgRmxvYXQzMkFycmF5IHwgRmxvYXQ2NEFycmF5XG5cbi8qKlxuICog0KLQuNC/INC00LvRjyDQvdCw0YHRgtGA0L7QtdC6INC/0YDQuNC70L7QttC10L3QuNGPLlxuICpcbiAqIEBwYXJhbSBpdGVyYXRpb25DYWxsYmFjayAtINCk0YPQvdC60YbQuNGPINC40YLQtdGA0LjRgNC+0LLQsNC90LjRjyDQuNGB0YXQvtC00L3Ri9GFINC+0LHRitC10LrRgtC+0LIuXG4gKiBAcGFyYW0gcG9seWdvblBhbGV0dGUgLSDQptCy0LXRgtC+0LLQsNGPINC/0LDQu9C40YLRgNCwINC/0L7Qu9C40LPQvtC90L7Qsi5cbiAqIEBwYXJhbSBncmlkU2l6ZSAtINCg0LDQt9C80LXRgCDQutC+0L7RgNC00LjQvdCw0YLQvdC+0Lkg0L/Qu9C+0YHQutC+0YHRgtC4INCyINC/0LjQutGB0LXQu9GP0YUuXG4gKiBAcGFyYW0gcG9seWdvblNpemUgLSDQoNCw0LfQvNC10YAg0L/QvtC70LjQs9C+0L3QsCDQvdCwINCz0YDQsNGE0LjQutC1INCyINC/0LjQutGB0LXQu9GP0YUgKNGB0YLQvtGA0L7QvdCwINC00LvRjyDQutCy0LDQtNGA0LDRgtCwLCDQtNC40LDQvNC10YLRgCDQtNC70Y8g0LrRgNGD0LPQsCDQuCDRgi7Qvy4pXG4gKiBAcGFyYW0gY2lyY2xlQXBwcm94TGV2ZWwgLSDQodGC0LXQv9C10L3RjCDQtNC10YLQsNC70LjQt9Cw0YbQuNC4INC60YDRg9Cz0LAgLSDQutC+0LvQuNGH0LXRgdGC0LLQviDRg9Cz0LvQvtCyINC/0L7Qu9C40LPQvtC90LAsINCw0L/RgNC+0LrRgdC40LzQuNGA0YPRjtGJ0LXQs9C+INC+0LrRgNGD0LbQvdC+0YHRgtGMINC60YDRg9Cz0LAuXG4gKiBAcGFyYW0gZGVidWdNb2RlIC0g0J/QsNGA0LDQvNC10YLRgNGLINGA0LXQttC40LzQsCDQvtGC0LvQsNC00LrQuCDQv9GA0LjQu9C+0LbQtdC90LjRjy5cbiAqIEBwYXJhbSBkZW1vTW9kZSAtINCf0LDRgNCw0LzQtdGC0YDRiyDRgNC10LbQuNC80LAg0LjRgdC/0L7Qu9GM0LfQvtCy0LDQvdC40Y8g0LTQtdC80L7QvdGB0YLRgNCw0YbQuNC+0L3QvdGL0YUg0LTQsNC90L3Ri9GFLlxuICogQHBhcmFtIGZvcmNlUnVuIC0g0J/RgNC40LfQvdCw0Log0YLQvtCz0L4sINGH0YLQviDRgNC10L3QtNC10YDQuNC90LMg0L3QtdC+0LHRhdC+0LTQuNC80L4g0L3QsNGH0LDRgtGMINGB0YDQsNC30YMg0L/QvtGB0LvQtSDQt9Cw0LTQsNC90LjRjyDQvdCw0YHRgtGA0L7QtdC6INGN0LrQt9C10LzQv9C70Y/RgNCwICjQv9C+INGD0LzQvtC70YfQsNC90LjRjlxuICogICAgINGA0LXQvdC00LXRgNC40L3QsyDQt9Cw0L/Rg9GB0LrQsNC10YLRgdGPINGC0L7Qu9GM0LrQviDQv9C+0YHQu9C1INCy0YvQt9C+0LLQsCDQvNC10YLQvtC00LAgc3RhcnQpLlxuICogQHBhcmFtIG1heEFtb3VudE9mUG9seWdvbnMgLSDQmNGB0LrRg9GB0YHRgtCy0LXQvdC90L7QtSDQvtCz0YDQsNC90LjRh9C10L3QuNC1INC60L7Qu9C40YfQtdGB0YLQstCwINC+0YLQvtCx0YDQsNC20LDQtdC80YvRhSDQv9C+0LvQuNCz0L7QvdC+0LIuINCf0YDQuCDQtNC+0YHRgtC40LbQtdC90LjQuCDRjdGC0L7Qs9C+INGH0LjRgdC70LBcbiAqICAgICDQuNGC0LXRgNC40YDQvtCy0LDQvdC40LUg0LjRgdGF0L7QtNC90YvRhSDQvtCx0YrQtdC60YLQvtCyINC/0YDQtdGA0YvQstCw0LXRgtGB0Y8sINC00LDQttC1INC10YHQu9C4INC+0LHRgNCw0LHQvtGC0LDQvdGLINC90LUg0LLRgdC1INC+0LHRitC10LrRgtGLLlxuICogQHBhcmFtIGJnQ29sb3IgLSDQpNC+0L3QvtCy0YvQuSDRhtCy0LXRgiDQutCw0L3QstCw0YHQsC5cbiAqIEBwYXJhbSBydWxlc0NvbG9yIC0g0KbQstC10YIg0L3QsNC/0YDQsNCy0LvRj9GO0YnQuNGFLlxuICogQHBhcmFtIGNhbWVyYSAtINCf0L7Qu9C+0LbQtdC90LjQtSDQutC+0L7RgNC00LjQvdCw0YLQvdC+0Lkg0L/Qu9C+0YHQutC+0YHRgtC4INCyINC+0LHQu9Cw0YHRgtC4INC/0YDQvtGB0LzQvtGC0YDQsC5cbiAqIEBwYXJhbSB3ZWJHbFNldHRpbmdzIC0g0JjQvdC40YbQuNCw0LvQuNC30LjRgNGD0Y7RidC40LUg0L3QsNGB0YLRgNC+0LnQutC4INC60L7QvdGC0LXQutGB0YLQsCDRgNC10L3QtNC10YDQuNC90LPQsCBXZWJHTC5cbiAqL1xuaW50ZXJmYWNlIFNQbG90T3B0aW9ucyB7XG4gIGl0ZXJhdGlvbkNhbGxiYWNrPzogU1Bsb3RJdGVyYXRpb25GdW5jdGlvbixcbiAgcG9seWdvblBhbGV0dGU/OiBIRVhDb2xvcltdLFxuICBncmlkU2l6ZT86IFNQbG90R3JpZFNpemUsXG4gIHBvbHlnb25TaXplPzogbnVtYmVyLFxuICBjaXJjbGVBcHByb3hMZXZlbD86IG51bWJlcixcbiAgZGVidWdNb2RlPzogU1Bsb3REZWJ1Z01vZGUsXG4gIGRlbW9Nb2RlPzogU1Bsb3REZW1vTW9kZSxcbiAgZm9yY2VSdW4/OiBib29sZWFuLFxuICBtYXhBbW91bnRPZlBvbHlnb25zPzogbnVtYmVyLFxuICBiZ0NvbG9yPzogSEVYQ29sb3IsXG4gIHJ1bGVzQ29sb3I/OiBIRVhDb2xvcixcbiAgY2FtZXJhPzogU1Bsb3RDYW1lcmEsXG4gIHdlYkdsU2V0dGluZ3M/OiBXZWJHTENvbnRleHRBdHRyaWJ1dGVzXG59XG5cbi8qKlxuICog0KLQuNC/INC00LvRjyDQuNC90YTQvtGA0LzQsNGG0LjQuCDQviDQv9C+0LvQuNCz0L7QvdC1LiDQodC+0LTQtdGA0LbQuNGCINC00LDQvdC90YvQtSwg0L3QtdC+0LHRhdC+0LTQuNC80YvQtSDQtNC70Y8g0LTQvtCx0LDQstC70LXQvdC40Y8g0L/QvtC70LjQs9C+0L3QsCDQsiDQs9GA0YPQv9C/0YMg0L/QvtC70LjQs9C+0L3QvtCyLiDQn9C+0LvQuNCz0L7QvSAtINGN0YLQvlxuICog0YHQv9C70L7RiNC90LDRjyDRhNC40LPRg9GA0LAg0L3QsCDQutC+0L7RgNC00LjQvdCw0YLQvdC+0Lkg0L/Qu9C+0YHQutC+0YHRgtC4LCDQvtC00L3QvtC30L3QsNGH0L3QviDQv9GA0LXQtNGB0YLQsNCy0LvRj9GO0YnQsNGPINC+0LTQuNC9INC40YHRhdC+0LTQvdGL0Lkg0L7QsdGK0LXQutGCLlxuICpcbiAqIEBwYXJhbSB4IC0g0JrQvtC+0YDQtNC40L3QsNGC0LAg0YbQtdC90YLRgNCwINC/0L7Qu9C40LPQvtC90LAg0L3QsCDQvtGB0Lgg0LDQsdGB0YbQuNGB0YEuINCc0L7QttC10YIg0LHRi9GC0Ywg0LrQsNC6INGG0LXQu9GL0LwsINGC0LDQuiDQuCDQstC10YnQtdGB0YLQstC10L3QvdGL0Lwg0YfQuNGB0LvQvtC8LlxuICogQHBhcmFtIHkgLSDQmtC+0L7RgNC00LjQvdCw0YLQsCDRhtC10L3RgtGA0LAg0L/QvtC70LjQs9C+0L3QsCDQvdCwINC+0YHQuCDQvtGA0LTQuNC90LDRgi4g0JzQvtC20LXRgiDQsdGL0YLRjCDQutCw0Log0YbQtdC70YvQvCwg0YLQsNC6INC4INCy0LXRidC10YHRgtCy0LXQvdC90YvQvCDRh9C40YHQu9C+0LwuXG4gKiBAcGFyYW0gc2hhcGUgLSDQpNC+0YDQvNCwINC/0L7Qu9C40LPQvtC90LAuINCk0L7RgNC80LAgLSDRjdGC0L4g0LjQvdC00LXQutGBINCyINC80LDRgdGB0LjQstC1INGE0L7RgNC8IHtAbGluayBzaGFwZXN9LiDQntGB0L3QvtCy0L3Ri9C1INGE0L7RgNC80Ys6IDAgLSDRgtGA0LXRg9Cz0L7Qu9GM0L3QuNC6LCAxIC1cbiAqICAgICDQutCy0LDQtNGA0LDRgiwgMiAtINC60YDRg9CzLlxuICogQHBhcmFtIGNvbG9yIC0g0KbQstC10YIg0L/QvtC70LjQs9C+0L3QsC4g0KbQstC10YIgLSDRjdGC0L4g0LjQvdC00LXQutGBINCyINC00LjQsNC/0LDQt9C+0L3QtSDQvtGCIDAg0LTQviAyNTUsINC/0YDQtdC00YHRgtCw0LLQu9GP0Y7RidC40Lkg0YHQvtCx0L7QuSDQuNC90LTQtdC60YEg0YbQstC10YLQsCDQslxuICogICAgINC/0YDQtdC00L7Qv9GA0LXQtNC10LvQtdC90L3QvtC8INC80LDRgdGB0LjQstC1INGG0LLQtdGC0L7QsiB7QGxpbmsgcG9seWdvblBhbGV0dGV9LlxuICovXG5pbnRlcmZhY2UgU1Bsb3RQb2x5Z29uIHtcbiAgeDogbnVtYmVyLFxuICB5OiBudW1iZXIsXG4gIHNoYXBlOiBudW1iZXIsXG4gIGNvbG9yOiBudW1iZXJcbn1cblxuLyoqXG4gKiDQotC40L8g0LTQu9GPINGA0LDQt9C80LXRgNCwINC60L7QvtGA0LTQuNC90LDRgtC90L7QuSDQv9C70L7RgdC60L7RgdGC0LguXG4gKlxuICogQHBhcmFtIHdpZHRoIC0g0KjQuNGA0LjQvdCwINC60L7QvtGA0LTQuNC90LDRgtC90L7QuSDQv9C70L7RgdC60L7RgdGC0Lgg0LIg0L/QuNC60YHQtdC70Y/RhS5cbiAqIEBwYXJhbSBoZWlnaHQgLSDQktGL0YHQvtGC0LAg0LrQvtC+0YDQtNC40L3QsNGC0L3QvtC+0Lkg0L/Qu9C+0YHQutC+0YHRgtC4INCyINC/0LjQutGB0LXQu9GP0YUuXG4gKi9cbmludGVyZmFjZSBTUGxvdEdyaWRTaXplIHtcbiAgd2lkdGg6IG51bWJlcixcbiAgaGVpZ2h0OiBudW1iZXJcbn1cblxuLyoqXG4gKiDQotC40L8g0LTQu9GPINC/0LDRgNCw0LzQtdGC0YDQvtCyINGA0LXQttC40LzQsCDQvtGC0LvQsNC00LrQuC5cbiAqXG4gKiBAcGFyYW0gaXNFbmFibGUgLSDQn9GA0LjQt9C90LDQuiDQstC60LvRjtGH0LXQvdC40Y8g0L7RgtC70LDQtNC+0YfQvdC+0LPQviDRgNC10LbQuNC80LAuXG4gKiBAcGFyYW0gb3V0cHV0IC0g0JzQtdGB0YLQviDQstGL0LLQvtC00LAg0L7RgtC70LDQtNC+0YfQvdC+0Lkg0LjQvdGE0L7RgNC80LDRhtC40LguXG4gKiBAcGFyYW0gaGVhZGVyU3R5bGUgLSDQodGC0LjQu9GMINC00LvRjyDQt9Cw0LPQvtC70L7QstC60LAg0LLRgdC10LPQviDQvtGC0LvQsNC00L7Rh9C90L7Qs9C+INCx0LvQvtC60LAuXG4gKiBAcGFyYW0gZ3JvdXBTdHlsZSAtINCh0YLQuNC70Ywg0LTQu9GPINC30LDQs9C+0LvQvtCy0LrQsCDQs9GA0YPQv9C/0LjRgNC+0LLQutC4INC+0YLQu9Cw0LTQvtGH0L3Ri9GFINC00LDQvdC90YvRhS5cbiAqL1xuaW50ZXJmYWNlIFNQbG90RGVidWdNb2RlIHtcbiAgaXNFbmFibGU/OiBib29sZWFuLFxuICBvdXRwdXQ/OiBTUGxvdERlYnVnT3V0cHV0LFxuICBoZWFkZXJTdHlsZT86IHN0cmluZyxcbiAgZ3JvdXBTdHlsZT86IHN0cmluZ1xufVxuXG4vKipcbiAqINCi0LjQvyDQtNC70Y8g0L/QsNGA0LDQvNC10YLRgNC+0LIg0YDQtdC20LjQvNCwINC+0YLQvtCx0YDQsNC20LXQvdC40Y8g0LTQtdC80L7QvdGB0YLRgNCw0YbQuNC+0L3QvdGL0YUg0LTQsNC90L3Ri9GFLlxuICpcbiAqIEBwYXJhbSBpc0VuYWJsZSAtINCf0YDQuNC30L3QsNC6INCy0LrQu9GO0YfQtdC90LjRjyDQtNC10LzQvi3RgNC10LbQuNC80LAuINCSINGN0YLQvtC8INGA0LXQttC40LzQtSDQv9GA0LjQu9C+0LbQtdC90LjQtSDQstC80LXRgdGC0L4g0LLQvdC10YjQvdC10Lkg0YTRg9C90LrRhtC40Lgg0LjRgtC10YDQuNGA0L7QstCw0L3QuNGPXG4gKiAgICAg0LjRgdGF0L7QtNC90YvRhSDQvtCx0YrQtdC60YLQvtCyINC40YHQv9C+0LvRjNC30YPQtdGCINCy0L3Rg9GC0YDQtdC90L3QuNC5INC80LXRgtC+0LQsINC40LzQuNGC0LjRgNGD0Y7RidC40Lkg0LjRgtC10YDQuNGA0L7QstCw0L3QuNC1LlxuICogQHBhcmFtIGFtb3VudCAtINCa0L7Qu9C40YfQtdGB0YLQstC+INC40LzQuNGC0LjRgNGD0LXQvNGL0YUg0LjRgdGF0L7QtNC90YvRhSDQvtCx0YrQtdC60YLQvtCyLlxuICogQHBhcmFtIHNoYXBlUXVvdGEgLSDQp9Cw0YHRgtC+0YLQsCDQv9C+0Y/QstC70LXQvdC40Y8g0LIg0LjRgtC10YDQuNGA0L7QstCw0L3QuNC4INGA0LDQt9C70LjRh9C90YvRhSDRhNC+0YDQvCDQv9C+0LvQuNCz0L7QvdC+0LIgLSDRgtGA0LXRg9Cz0L7Qu9GM0L3QuNC60L7QslswXSwg0LrQstCw0LTRgNCw0YLQvtCyWzFdLFxuICogICAgINC60YDRg9Cz0L7QslsyXSDQuCDRgi7QtC4g0J/RgNC40LzQtdGAOiDQvNCw0YHRgdC40LIgWzMsIDIsIDVdINC+0LfQvdCw0YfQsNC10YIsINGH0YLQviDRh9Cw0YHRgtC+0YLQsCDQv9C+0Y/QstC70LXQvdC40Y8g0YLRgNC10YPQs9C+0LvRjNC90LjQutC+0LIgPSAzLygzKzIrNSkgPSAzLzEwLFxuICogICAgINGH0LDRgdGC0L7RgtCwINC/0L7Rj9Cy0LvQtdC90LjRjyDQutCy0LDQtNGA0LDRgtC+0LIgPSAyLygzKzIrNSkgPSAyLzEwLCDRh9Cw0YHRgtC+0YLQsCDQv9C+0Y/QstC70LXQvdC40Y8g0LrRgNGD0LPQvtCyID0gNS8oMysyKzUpID0gNS8xMC5cbiAqIEBwYXJhbSBpbmRleCAtINCf0LDRgNCw0LzQtdGC0YAg0LjRgdC/0L7Qu9GM0LfRg9C10LzRi9C5INC00LvRjyDQuNC80LjRgtCw0YbQuNC4INC40YLQtdGA0LjRgNC+0LLQsNC90LjRjy4g0JfQsNC00LDQvdC40Y8g0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GM0YHQutC+0LPQviDQt9C90LDRh9C10L3QuNGPINC90LUg0YLRgNC10LHRg9C10YIuXG4gKi9cbmludGVyZmFjZSBTUGxvdERlbW9Nb2RlIHtcbiAgaXNFbmFibGU/OiBib29sZWFuLFxuICBhbW91bnQ/OiBudW1iZXIsXG4gIHNoYXBlUXVvdGE/OiBudW1iZXJbXSxcbiAgaW5kZXg/OiBudW1iZXJcbn1cblxuLyoqXG4gKiDQotC40L8g0LTQu9GPINC/0L7Qu9C+0LbQtdC90LjRjyDQutC+0L7RgNC00LjQvdCw0YLQvdC+0Lkg0L/Qu9C+0YHQutC+0YHRgtC4INCyINC+0LHQu9Cw0YHRgtC4INC/0YDQvtGB0LzQvtGC0YDQsC5cbiAqXG4gKiBAcGFyYW0geCAtINCa0L7QvtGA0LTQuNC90LDRgtCwINCz0YDQsNGE0LjQutCwINC90LAg0L7RgdC4INCw0LHRgdGG0LjRgdGBLlxuICogQHBhcmFtIHkgLSDQmtC+0L7RgNC00LjQvdCw0YLQsCDQs9GA0LDRhNC40LrQsCDQvdCwINC+0YHQuCDQvtGA0LTQuNC90LDRgi5cbiAqIEBwYXJhbSB6b29tIC0g0KHRgtC10L/QtdC90YwgXCLQv9GA0LjQsdC70LjQttC10L3QuNGPXCIg0L3QsNCx0LvRjtC00LDRgtC10LvRjyDQuiDQs9GA0LDRhNC40LrRgyAo0LzQsNGB0YjRgtCw0LEg0LrQvtC+0LTRgNC40L3QsNGC0L3QvtC5INC/0LvQvtGB0LrQvtGB0YLQuCDQsiDQvtCx0LvQsNGB0YLQuCDQv9GA0L7RgdC80L7RgtGA0LApLlxuICovXG5pbnRlcmZhY2UgU1Bsb3RDYW1lcmEge1xuICB4PzogbnVtYmVyLFxuICB5PzogbnVtYmVyLFxuICB6b29tPzogbnVtYmVyXG59XG5cblxuXG5cbi8qKlxuICog0KLQuNC/INC00LvRjyDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuC4g0KHQvtC00LXRgNC20LjRgiDQstGB0Y4g0YLQtdGF0L3QuNGH0LXRgdC60YPRjiDQuNC90YTQvtGA0LzQsNGG0LjRjiwg0L3QtdC+0LHRhdC+0LTQuNC80YPRjiDQtNC70Y8g0YDQsNGB0YHRh9C10YLQsCDRgtC10LrRg9GJ0LXQs9C+INC/0L7Qu9C+0LbQtdC90LjRjyDQutC+0L7RgNC00LjQvdCw0YLQvdC+0LlcbiAqINC/0LvQvtGB0LrQvtGB0YLQuCDQsiDQvtCx0LvQsNGB0YLQuCDQv9GA0L7RgdC80L7RgtGA0LAg0LLQviDQstGA0LXQvNGPINGB0L7QsdGL0YLQuNC5INC/0LXRgNC10LzQtdGJ0LXQvdC40Y8g0Lgg0LfRg9C80LjRgNC+0LLQsNC90LjRjyDQutCw0L3QstCw0YHQsC5cbiAqXG4gKiBAcGFyYW0gdmlld1Byb2plY3Rpb25NYXQgLSDQntGB0L3QvtCy0L3QsNGPINC80LDRgtGA0LjRhtCwINGC0YDQsNC90YHRhNC+0YDQvNCw0YbQuNC4IDN4MyDQsiDQstC40LTQtSDQvtC00L3QvtC80LXRgNC90L7Qs9C+INC80LDRgdGB0LjQstCwINC40LcgOSDRjdC70LXQvNC10L3RgtC+0LIuXG4gKiBAcGFyYW0gc3RhcnRJbnZWaWV3UHJvak1hdCAtINCS0YHQv9C+0LzQvtCz0LDRgtC10LvRjNC90LDRjyDQvNCw0YLRgNC40YbQsCDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuC5cbiAqIEBwYXJhbSBzdGFydENhbWVyYVggLSDQktGB0L/QvtC80L7Qs9Cw0YLQtdC70YzQvdCw0Y8g0YLQvtGH0LrQsCDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuC5cbiAqIEBwYXJhbSBzdGFydENhbWVyYVkgLSDQktGB0L/QvtC80L7Qs9Cw0YLQtdC70YzQvdCw0Y8g0YLQvtGH0LrQsCDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuC5cbiAqIEBwYXJhbSBzdGFydFBvc1ggLSDQktGB0L/QvtC80L7Qs9Cw0YLQtdC70YzQvdCw0Y8g0YLQvtGH0LrQsCDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuC5cbiAqIEBwYXJhbSBzdGFydFBvc1kgLSDQktGB0L/QvtC80L7Qs9Cw0YLQtdC70YzQvdCw0Y8g0YLQvtGH0LrQsCDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuC5cbiAqL1xuaW50ZXJmYWNlIFNQbG90VHJhbnNmb3JtYXRpb24ge1xuICB2aWV3UHJvamVjdGlvbk1hdDogbnVtYmVyW10sXG4gIHN0YXJ0SW52Vmlld1Byb2pNYXQ6IG51bWJlcltdLFxuICBzdGFydENhbWVyYTogU1Bsb3RDYW1lcmEsXG4gIHN0YXJ0UG9zOiBudW1iZXJbXSxcbiAgc3RhcnRDbGlwUG9zOiBudW1iZXJbXSxcbiAgc3RhcnRNb3VzZVBvczogbnVtYmVyW11cbn1cblxuXG5cblxuLyoqXG4gKiDQotC40L8g0LTQu9GPINC40L3RhNC+0YDQvNCw0YbQuNC4INC+INCx0YPRhNC10YDQsNGFLCDRhNC+0YDQvNC40YDRg9GO0YnQuNGFINC00LDQvdC90YvQtSDQtNC70Y8g0LfQsNCz0YDRg9C30LrQuCDQsiDQstC40LTQtdC+0L/QsNC80Y/RgtGMLlxuICpcbiAqIEBwYXJhbSB2ZXJ0ZXhCdWZmZXJzIC0g0JzQsNGB0YHQuNCyINCx0YPRhNC10YDQvtCyINGBINC40L3RhNC+0YDQvNCw0YbQuNC10Lkg0L4g0LLQtdGA0YjQuNC90LDRhSDQv9C+0LvQuNCz0L7QvdC+0LIuXG4gKiBAcGFyYW0gY29sb3JCdWZmZXJzIC0g0JzQsNGB0YHQuNCyINCx0YPRhNC10YDQvtCyINGBINC40L3RhNC+0YDQvNCw0YbQuNC10Lkg0L4g0YbQstC10YLQsNGFINCy0LXRgNGI0LjQvSDQv9C+0LvQuNCz0L7QvdC+0LIuXG4gKiBAcGFyYW0gaW5kZXhCdWZmZXJzIC0g0JzQsNGB0YHQuNCyINCx0YPRhNC10YDQvtCyINGBINC40L3QtNC10LrRgdCw0LzQuCDQstC10YDRiNC40L0g0L/QvtC70LjQs9C+0L3QvtCyLlxuICogQHBhcmFtIGFtb3VudE9mQnVmZmVyR3JvdXBzIC0g0JrQvtC70LjRh9C10YHRgtCy0L4g0LHRg9GE0LXRgNC90YvRhSDQs9GA0YPQv9C/INCyINC80LDRgdGB0LjQstC1LiDQktGB0LUg0YPQutCw0LfQsNC90L3Ri9C1INCy0YvRiNC1INC80LDRgdGB0LjQstGLINCx0YPRhNC10YDQvtCyINGB0L7QtNC10YDQttCw0YJcbiAqICAgICDQvtC00LjQvdCw0LrQvtCy0L7QtSDQutC+0LvQuNGH0LXRgdGC0LLQviDQsdGD0YTQtdGA0L7Qsi5cbiAqIEBwYXJhbSBhbW91bnRPZkdMVmVydGljZXMgLSDQmtC+0LvQuNGH0LXRgdGC0LLQviDQstC10YDRiNC40L0sINC+0LHRgNCw0LfRg9GO0YnQuNGFIEdMLdGC0YDQtdGD0LPQvtC70YzQvdC40LrQuCDQutCw0LbQtNC+0LPQviDQstC10YDRiNC40L3QvdC+0LPQviDQsdGD0YTQtdGA0LAuXG4gKiBAcGFyYW0gYW1vdW50T2ZTaGFwZXMgLSDQmtC+0LvQuNGH0LXRgdGC0LLQviDQv9C+0LvQuNCz0L7QvdC+0LIg0LrQsNC20LTQvtC5INGE0L7RgNC80YsgKNGB0LrQvtC70YzQutC+INGC0YDQtdGD0LPQvtC70YzQvdC40LrQvtCyLCDQutCy0LDQtNGA0LDRgtC+0LIsINC60YDRg9Cz0L7QsiDQuCDRgi7QtC4pLlxuICogQHBhcmFtIGFtb3VudE9mVG90YWxWZXJ0aWNlcyAtINCe0LHRidC10LUg0LrQvtC70LjRh9C10YHRgtCy0L4g0LLQtdGA0YjQuNC9INCy0YHQtdGFINCy0LXRgNGI0LjQvdC90YvRhSDQsdGD0YTQtdGA0L7QsiAodmVydGV4QnVmZmVycykuXG4gKiBAcGFyYW0gYW1vdW50T2ZUb3RhbEdMVmVydGljZXMgLSDQntCx0YnQtdC1INC60L7Qu9C40YfQtdGB0YLQstC+INCy0LXRgNGI0LjQvSDQstGB0LXRhSDQuNC90LTQtdC60YHQvdGL0YUg0LHRg9GE0LXRgNC+0LIgKGluZGV4QnVmZmVycykuXG4gKiBAcGFyYW0gc2l6ZUluQnl0ZXMgLSDQoNCw0LfQvNC10YDRiyDQsdGD0YTQtdGA0L7QsiDQutCw0LbQtNC+0LPQviDRgtC40L/QsCAo0LTQu9GPINCy0LXRgNGI0LjQvSwg0LTQu9GPINGG0LLQtdGC0L7Qsiwg0LTQu9GPINC40L3QtNC10LrRgdC+0LIpINCyINCx0LDQudGC0LDRhS5cbiAqL1xuaW50ZXJmYWNlIFNQbG90QnVmZmVycyB7XG4gIHZlcnRleEJ1ZmZlcnM6IFdlYkdMQnVmZmVyW10sXG4gIGNvbG9yQnVmZmVyczogV2ViR0xCdWZmZXJbXSxcbiAgaW5kZXhCdWZmZXJzOiBXZWJHTEJ1ZmZlcltdLFxuICBhbW91bnRPZkJ1ZmZlckdyb3VwczogbnVtYmVyLFxuICBhbW91bnRPZkdMVmVydGljZXM6IG51bWJlcltdLFxuICBhbW91bnRPZlNoYXBlczogbnVtYmVyW10sXG4gIGFtb3VudE9mVG90YWxWZXJ0aWNlczogbnVtYmVyLFxuICBhbW91bnRPZlRvdGFsR0xWZXJ0aWNlczogbnVtYmVyLFxuICBzaXplSW5CeXRlczogbnVtYmVyW11cbn1cblxuLyoqXG4gKiDQotC40L8g0LTQu9GPINC40L3RhNC+0YDQvNCw0YbQuNC4INC+INCz0YDRg9C/0L/QtSDQv9C+0LvQuNCz0L7QvdC+0LIsINC60L7RgtC+0YDRg9GOINC80L7QttC90L4g0L7RgtC+0LHRgNCw0LfQuNGC0Ywg0L3QsCDQutCw0L3QstCw0YHQtSDQt9CwINC+0LTQuNC9INCy0YvQt9C+0LIg0YTRg9C90LrRhtC40Lgge0BsaW5rIGRyYXdFbGVtZW50c30uXG4gKlxuICogQHBhcmFtIHZlcnRpY2VzIC0g0JzQsNGB0YHQuNCyINCy0LXRgNGI0LjQvSDQstGB0LXRhSDQv9C+0LvQuNCz0L7QvdC+0LIg0LPRgNGD0L/Qv9GLLiDQmtCw0LbQtNCw0Y8g0LLQtdGA0YjQuNC90LAgLSDRjdGC0L4g0L/QsNGA0LAg0YfQuNGB0LXQuyAo0LrQvtC+0YDQtNC40L3QsNGC0Ysg0LLQtdGA0YjQuNC90Ysg0L3QsFxuICogICAgINC/0LvQvtGB0LrQvtGB0YLQuCkuINCa0L7QvtGA0LTQuNC90LDRgtGLINC80L7Qs9GD0YIg0LHRi9GC0Ywg0LrQsNC6INGG0LXQu9GL0LzQuCwg0YLQsNC6INC4INCy0LXRidC10YHRgtCy0LXQvdC90YvQvNC4INGH0LjRgdC70LDQvNC4LlxuICogQHBhcmFtIGluZGljZXMgLSDQnNCw0YHRgdC40LIg0LjQvdC00LXQutGB0L7QsiDQstC10YDRiNC40L0g0L/QvtC70LjQs9C+0L3QvtCyINCz0YDRg9C/0L/Riy4g0JrQsNC20LTRi9C5INC40L3QtNC10LrRgSAtINGN0YLQviDQvdC+0LzQtdGAINCy0LXRgNGI0LjQvdGLINCyINC80LDRgdGB0LjQstC1INCy0LXRgNGI0LjQvS4g0JjQvdC00LXQutGB0YtcbiAqICAgICDQvtC/0LjRgdGL0LLQsNGO0YIg0LLRgdC1IEdMLdGC0YDQtdGD0LPQvtC70YzQvdC40LrQuCwg0LjQtyDQutC+0YLQvtGA0YvRhSDRgdC+0YHRgtC+0Y/RgiDQv9C+0LvQuNCz0L7QvdGLINCz0YDRg9C/0L/Riywg0YIu0L4uINC60LDQttC00LDRjyDRgtGA0L7QudC60LAg0LjQvdC00LXQutGB0L7QsiDQutC+0LTQuNGA0YPQtdGCINC+0LTQuNC9XG4gKiAgICAgR0wt0YLRgNC10YPQs9C+0LvRjNC90LjQui4g0JjQvdC00LXQutGB0YsgLSDRjdGC0L4g0YbQtdC70YvQtSDRh9C40YHQu9CwINCyINC00LjQsNC/0LDQt9C+0L3QtSDQvtGCIDAg0LTQviA2NTUzNSwg0YfRgtC+INC90LDQutC70LDQtNGL0LLQsNC10YIg0L7Qs9GA0LDQvdC40YfQtdC90LjQtSDQvdCwINC80LDQutGB0LjQvNCw0LvRjNC90L7QtVxuICogICAgINC60L7Qu9C40YfQtdGB0YLQstC+INCy0LXRgNGI0LjQvSwg0YXRgNCw0L3QuNC80YvRhSDQsiDQs9GA0YPQv9C/0LUg0L/QvtC70LjQs9C+0L3QvtCyICjQvdC1INCx0L7Qu9C10LUgMzI3Njgg0YjRgtGD0LopLlxuICogQHBhcmFtIGNvbG9ycyAtINCc0LDRgdGB0LjQsiDRhtCy0LXRgtC+0LIg0LLQtdGA0YjQuNC9INC/0L7Qu9C40LPQvtC90L7QsiDQs9GA0YPQv9C/0YsuINCa0LDQttC00L7QtSDRh9C40YHQu9C+INC30LDQtNCw0LXRgiDRhtCy0LXRgiDQvtC00L3QvtC5INCy0LXRgNGI0LjQvdGLINCyINC80LDRgdGB0LjQstC1INCy0LXRgNGI0LjQvS4g0KfRgtC+0LHRi1xuICogICAgINC/0L7Qu9C40LPQvtC9INCx0YvQuyDRgdC/0LvQvtGI0L3QvtCz0L4g0L7QtNC90L7RgNC+0LTQvdC+0LPQviDRhtCy0LXRgtCwINC90LXQvtCx0YXQvtC00LjQvNC+INGH0YLQvtCx0Ysg0LLRgdC1INCy0LXRgNGI0LjQvdGLINC/0L7Qu9C40LPQvtC90LAg0LjQvNC10LvQuCDQvtC00LjQvdCw0LrQvtCy0YvQuSDRhtCy0LXRgi4g0KbQstC10YIgLSDRjdGC0L5cbiAqICAgICDRhtC10LvQvtC1INGH0LjRgdC70L4g0LIg0LTQuNCw0L/QsNC30L7QvdC1INC+0YIgMCDQtNC+IDI1NSwg0L/RgNC10LTRgdGC0LDQstC70Y/RjtGJ0LXQtSDRgdC+0LHQvtC5INC40L3QtNC10LrRgSDRhtCy0LXRgtCwINCyINC/0YDQtdC00L7Qv9GA0LXQtNC10LvQtdC90L3QvtC8INC80LDRgdGB0LjQstC1INGG0LLQtdGC0L7Qsi5cbiAqIEBwYXJhbSBhbW91bnRPZlZlcnRpY2VzIC0g0JrQvtC70LjRh9C10YHRgtCy0L4g0LLRgdC10YUg0LLQtdGA0YjQuNC9INCyINCz0YDRg9C/0L/QtSDQv9C+0LvQuNCz0L7QvdC+0LIuXG4gKiBAcGFyYW0gYW1vdW50T2ZHTFZlcnRpY2VzIC0g0JrQvtC70LjRh9C10YHRgtCy0L4g0LLQtdGA0YjQuNC9INCy0YHQtdGFIEdMLdGC0YDQtdGD0LPQvtC70YzQvdC40LrQvtCyINCyINCz0YDRg9C/0L/QtSDQv9C+0LvQuNCz0L7QvdC+0LIuXG4gKi9cbmludGVyZmFjZSBTUGxvdFBvbHlnb25Hcm91cCB7XG4gIHZlcnRpY2VzOiBudW1iZXJbXSxcbiAgaW5kaWNlczogbnVtYmVyW10sXG4gIGNvbG9yczogbnVtYmVyW10sXG4gIGFtb3VudE9mVmVydGljZXM6IG51bWJlcixcbiAgYW1vdW50T2ZHTFZlcnRpY2VzOiBudW1iZXJcbn1cblxuLyoqXG4gKiDQotC40L8g0LTQu9GPINC40L3RhNC+0YDQvNCw0YbQuNC4INC+INCy0LXRgNGI0LjQvdCw0YUg0L/QvtC70LjQs9C+0L3QsC5cbiAqXG4gKiBAcGFyYW0gdmVydGljZXMgLSDQnNCw0YHRgdC40LIg0LLRgdC10YUg0LLQtdGA0YjQuNC9INC/0L7Qu9C40LPQvtC90LAuINCa0LDQttC00LDRjyDQstC10YDRiNC40L3QsCAtINGN0YLQviDQv9Cw0YDQsCDRh9C40YHQtdC7ICjQutC+0L7RgNC00LjQvdCw0YLRiyDQstC10YDRiNC40L3RiyDQvdCwXG4gKiAgICAg0L/Qu9C+0YHQutC+0YHRgtC4KS4g0JrQvtC+0YDQtNC40L3QsNGC0Ysg0LzQvtCz0YPRgiDQsdGL0YLRjCDQutCw0Log0YbQtdC70YvQvNC4LCDRgtCw0Log0Lgg0LLQtdGJ0LXRgdGC0LLQtdC90L3Ri9C80Lgg0YfQuNGB0LvQsNC80LguXG4gKiBAcGFyYW0gaW5kaWNlcyAtINCc0LDRgdGB0LjQsiDQuNC90LTQtdC60YHQvtCyINCy0LXRgNGI0LjQvSDQv9C+0LvQuNCz0L7QvdCwLiDQmtCw0LbQtNGL0Lkg0LjQvdC00LXQutGBIC0g0Y3RgtC+INC90L7QvNC10YAg0LLQtdGA0YjQuNC90Ysg0LIg0LzQsNGB0YHQuNCy0LUg0LLQtdGA0YjQuNC9LiDQmNC90LTQtdC60YHRi1xuICogICAgINC+0L/QuNGB0YvQstCw0Y7RgiDQstGB0LUgR0wt0YLRgNC10YPQs9C+0LvRjNC90LjQutC4LCDQuNC3INC60L7RgtC+0YDRi9GFINGB0L7RgdGC0L7QuNGCINC/0L7Qu9C40LPQvtC9LlxuICovXG5pbnRlcmZhY2UgU1Bsb3RQb2x5Z29uVmVydGljZXMge1xuICB2YWx1ZXM6IG51bWJlcltdLFxuICBpbmRpY2VzOiBudW1iZXJbXVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTUGxvdCB7XG5cbiAgLyoqXG4gICAqINCc0LDRgdGB0LjQsiDQutC70LDRgdGB0LAsINGB0L7QtNC10YDQttCw0YnQuNC5INGB0YHRi9C70LrQuCDQvdCwINCy0YHQtSDRgdC+0LfQtNCw0L3QvdGL0LUg0Y3QutC30LXQvNC/0LvRj9GA0Ysg0LrQu9Cw0YHRgdCwLiDQmNC90LTQtdC60YHQsNC80Lgg0LzQsNGB0YHQuNCy0LAg0LLRi9GB0YLRg9C/0LDRjtGCINC40LTQtdC90YLQuNGE0LjQutCw0YLQvtGA0YtcbiAgICog0LrQsNC90LLQsNGB0L7QsiDRjdC60LfQtdC80L/Qu9GP0YDQvtCyLiDQmNGB0L/QvtC70YzQt9GD0LXRgtGB0Y8g0LTQu9GPINC00L7RgdGC0YPQv9CwINC6INC/0L7Qu9GP0Lwg0Lgg0LzQtdGC0L7QtNCw0Lwg0Y3QutC30LXQvNC/0LvRj9GA0LAg0LjQtyDRgtC10LvQsCDQstC90LXRiNC90LjRhSDQvtCx0YDQsNCx0L7Rh9C40LrQvtCyINGB0L7QsdGL0YLQuNC5XG4gICAqINC80YvRiNC4L9GC0YDQtdC60L/QsNC00LAuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGluc3RhbmNlczogeyBba2V5OiBzdHJpbmddOiBTUGxvdCB9ID0ge31cblxuICAvLyDQpNGD0L3QutGG0LjRjyDQv9C+INGD0LzQvtC70YfQsNC90LjRjiDQtNC70Y8g0LjRgtC10YDQuNGA0L7QstCw0L3QuNGPINC+0LHRitC10LrRgtC+0LIg0L3QtSDQt9Cw0LTQsNC10YLRgdGPLlxuICBwdWJsaWMgaXRlcmF0aW9uQ2FsbGJhY2s6IFNQbG90SXRlcmF0aW9uRnVuY3Rpb24gfCB1bmRlZmluZWQgPSB1bmRlZmluZWRcblxuICAvLyDQptCy0LXRgtC+0LLQsNGPINC/0LDQu9C40YLRgNCwINC/0L7Qu9C40LPQvtC90L7QsiDQv9C+INGD0LzQvtC70YfQsNC90LjRji5cbiAgcHVibGljIHBvbHlnb25QYWxldHRlOiBIRVhDb2xvcltdID0gW1xuICAgICcjRkYwMEZGJywgJyM4MDAwODAnLCAnI0ZGMDAwMCcsICcjODAwMDAwJywgJyNGRkZGMDAnLFxuICAgICcjMDBGRjAwJywgJyMwMDgwMDAnLCAnIzAwRkZGRicsICcjMDAwMEZGJywgJyMwMDAwODAnXG4gIF1cblxuICAvLyDQoNCw0LfQvNC10YAg0LrQvtC+0YDQtNC40L3QsNGC0L3QvtC5INC/0LvQvtGB0LrQvtGB0YLQuCDQv9C+INGD0LzQvtC70YfQsNC90LjRji5cbiAgcHVibGljIGdyaWRTaXplOiBTUGxvdEdyaWRTaXplID0ge1xuICAgIHdpZHRoOiAzMl8wMDAsXG4gICAgaGVpZ2h0OiAxNl8wMDBcbiAgfVxuXG4gIC8vINCg0LDQt9C80LXRgCDQv9C+0LvQuNCz0L7QvdCwINC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOLlxuICBwdWJsaWMgcG9seWdvblNpemU6IG51bWJlciA9IDIwXG5cbiAgLy8g0KHRgtC10L/QtdC90Ywg0LTQtdGC0LDQu9C40LfQsNGG0LjQuCDQutGA0YPQs9CwINC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOLlxuICBwdWJsaWMgY2lyY2xlQXBwcm94TGV2ZWw6IG51bWJlciA9IDEyXG5cbiAgLy8g0J/QsNGA0LDQvNC10YLRgNGLINGA0LXQttC40LzQsCDQvtGC0LvQsNC00LrQuCDQv9C+INGD0LzQvtC70YfQsNC90LjRji5cbiAgcHVibGljIGRlYnVnTW9kZTogU1Bsb3REZWJ1Z01vZGUgPSB7XG4gICAgaXNFbmFibGU6IGZhbHNlLFxuICAgIG91dHB1dDogJ2NvbnNvbGUnLFxuICAgIGhlYWRlclN0eWxlOiAnZm9udC13ZWlnaHQ6IGJvbGQ7IGNvbG9yOiAjZmZmZmZmOyBiYWNrZ3JvdW5kLWNvbG9yOiAjY2MwMDAwOycsXG4gICAgZ3JvdXBTdHlsZTogJ2ZvbnQtd2VpZ2h0OiBib2xkOyBjb2xvcjogI2ZmZmZmZjsnXG4gIH1cblxuICAvLyDQn9Cw0YDQsNC80LXRgtGA0Ysg0YDQtdC20LjQvNCwINC00LXQvNC+0YHRgtGA0LDRhtC40L7QvdC90YvRhSDQtNCw0L3QvdGL0YUg0L/QviDRg9C80L7Qu9GH0LDQvdC40Y4uXG4gIHB1YmxpYyBkZW1vTW9kZTogU1Bsb3REZW1vTW9kZSA9IHtcbiAgICBpc0VuYWJsZTogZmFsc2UsXG4gICAgYW1vdW50OiAxXzAwMF8wMDAsXG4gICAgLyoqXG4gICAgICog0J/QviDRg9C80L7Qu9GH0LDQvdC40Y4g0LIg0YDQtdC20LjQvNC1INC00LXQvNC+LdC00LDQvdC90YvRhSDQsdGD0LTRg9GCINC/0L7RgNC+0LLQvdGDINC+0YLQvtCx0YDQsNC20LDRgtGM0YHRjyDQv9C+0LvQuNCz0L7QvdGLINCy0YHQtdGFINCy0L7Qt9C80L7QttC90YvRhSDRhNC+0YDQvC4g0KHQvtC+0YLQstC10YLRgdGC0LLRg9GO0YnQuNC1XG4gICAgICog0LfQvdCw0YfQtdC90LjRjyDQvNCw0YHRgdC40LLQsCDQuNC90LjRhtC40LDQu9C40LfQuNGA0YPRjtGC0YHRjyDQv9GA0Lgg0YDQtdCz0LjRgdGC0YDQsNGG0LjQuCDRhNGD0L3QutGG0LjQuSDRgdC+0LfQtNCw0L3QuNGPINGE0L7RgNC8INC80LXRgtC+0LTQvtC8IHtAbGluayByZWdpc3RlclNoYXBlfS5cbiAgICAgKi9cbiAgICBzaGFwZVF1b3RhOiBbXSxcbiAgICBpbmRleDogMFxuICB9XG5cbiAgLy8g0J/RgNC40LfQvdCw0Log0L/QviDRg9C80L7Qu9GH0LDQvdC40Y4g0YTQvtGA0YHQuNGA0L7QstCw0L3QvdC+0LPQviDQt9Cw0L/Rg9GB0LrQsCDRgNC10L3QtNC10YDQsC5cbiAgcHVibGljIGZvcmNlUnVuOiBib29sZWFuID0gZmFsc2VcblxuICAvKipcbiAgICog0J/QviDRg9C80L7Qu9GH0LDQvdC40Y4g0LjRgdC60YPRgdGB0YLQstC10L3QvdC+0LPQviDQvtCz0YDQsNC90LjRh9C10L3QuNGPINC90LAg0LrQvtC70LjRh9C10YHRgtCy0L4g0L7RgtC+0LHRgNCw0LbQsNC10LzRi9GFINC/0L7Qu9C40LPQvtC90L7QsiDQvdC10YIgKNC30LAg0YHRh9C10YIg0LfQsNC00LDQvdC40Y8g0LHQvtC70YzRiNC+0LPQviDQt9Cw0LLQtdC00L7QvNC+XG4gICAqINC90LXQtNC+0YHRgtC40LbQuNC80L7Qs9C+INC/0L7RgNC+0LPQvtCy0L7Qs9C+INGH0LjRgdC70LApLlxuICAgKi9cbiAgcHVibGljIG1heEFtb3VudE9mUG9seWdvbnM6IG51bWJlciA9IDFfMDAwXzAwMF8wMDBcblxuICAvLyDQpNC+0L3QvtCy0YvQuSDRhtCy0LXRgiDQv9C+INGD0LzQvtC70YfQsNC90LjRjiDQtNC70Y8g0LrQsNC90LLQsNGB0LAuXG4gIHB1YmxpYyBiZ0NvbG9yOiBIRVhDb2xvciA9ICcjZmZmZmZmJ1xuXG4gIC8vINCm0LLQtdGCINC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOINC00LvRjyDQvdCw0L/RgNCw0LLQu9GP0Y7RidC40YUuXG4gIHB1YmxpYyBydWxlc0NvbG9yOiBIRVhDb2xvciA9ICcjYzBjMGMwJ1xuXG4gIC8vINCf0L4g0YPQvNC+0LvRh9Cw0L3QuNGOINC+0LHQu9Cw0YHRgtGMINC/0YDQvtGB0LzQvtGC0YDQsCDRg9GB0YLQsNC90LDQstC70LjQstCw0LXRgtGB0Y8g0LIg0YbQtdC90YLRgCDQutC+0L7RgNC00LjQvdCw0YLQvdC+0Lkg0L/Qu9C+0L7RgdC60L7RgdGC0LguXG4gIHB1YmxpYyBjYW1lcmE6IFNQbG90Q2FtZXJhID0ge1xuICAgIHg6IHRoaXMuZ3JpZFNpemUud2lkdGggLyAyLFxuICAgIHk6IHRoaXMuZ3JpZFNpemUuaGVpZ2h0IC8gMixcbiAgICB6b29tOiAxXG4gIH1cblxuICAvKipcbiAgICog0J/QviDRg9C80L7Qu9GH0LDQvdC40Y4g0L3QsNGB0YLRgNC+0LnQutC4INC60L7QvdGC0LXQutGB0YLQsCDRgNC10L3QtNC10YDQuNC90LPQsCBXZWJHTCDQvNCw0LrRgdC40LzQuNC30LjRgNGD0Y7RgiDQv9GA0L7QuNC30LLQvtC00LjRgtC10LvRjNC90L7RgdGC0Ywg0LPRgNCw0YTQuNGH0LXRgdC60L7QuSDRgdC40YHRgtC10LzRiy4g0KHQv9C10YbQuNCw0LvRjNC90YvRhVxuICAgKiDQv9C+0LvRjNC30L7QstCw0YLQtdC70YzRgdC60LjRhSDQv9GA0LXQtNGD0YHRgtCw0L3QvtCy0L7QuiDQvdC1INGC0YDQtdCx0YPQtdGC0YHRjywg0L7QtNC90LDQutC+INC/0YDQuNC70L7QttC10L3QuNC1INC/0L7Qt9Cy0L7Qu9GP0LXRgiDRjdC60YHQv9C10YDQuNC80LXQvdGC0LjRgNC+0LLQsNGC0Ywg0YEg0L3QsNGB0YLRgNC+0LnQutCw0LzQuCDQs9GA0LDRhNC40LrQuC5cbiAgICovXG4gIHB1YmxpYyB3ZWJHbFNldHRpbmdzOiBXZWJHTENvbnRleHRBdHRyaWJ1dGVzID0ge1xuICAgIGFscGhhOiBmYWxzZSxcbiAgICBkZXB0aDogZmFsc2UsXG4gICAgc3RlbmNpbDogZmFsc2UsXG4gICAgYW50aWFsaWFzOiBmYWxzZSxcbiAgICBwcmVtdWx0aXBsaWVkQWxwaGE6IGZhbHNlLFxuICAgIHByZXNlcnZlRHJhd2luZ0J1ZmZlcjogZmFsc2UsXG4gICAgcG93ZXJQcmVmZXJlbmNlOiAnbG93LXBvd2VyJyxcbiAgICBmYWlsSWZNYWpvclBlcmZvcm1hbmNlQ2F2ZWF0OiBmYWxzZSxcbiAgICBkZXN5bmNocm9uaXplZDogZmFsc2VcbiAgfVxuXG4gIC8vINCf0YDQuNC30L3QsNC6INCw0LrRgtC40LLQvdC+0LPQviDQv9GA0L7RhtC10YHRgdCwINGA0LXQvdC00LXRgNCwLiDQlNC+0YHRgtGD0L/QtdC9INC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjiDQv9GA0LjQu9C+0LbQtdC90LjRjyDRgtC+0LvRjNC60L4g0LTQu9GPINGH0YLQtdC90LjRjy5cbiAgcHVibGljIGlzUnVubmluZzogYm9vbGVhbiA9IGZhbHNlXG5cbiAgLy8g0J7QsdGK0LXQutGCINC60LDQvdCy0LDRgdCwLlxuICBwcm90ZWN0ZWQgcmVhZG9ubHkgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudFxuXG4gIC8vINCe0LHRitC10LrRgiDQutC+0L3RgtC10LrRgdGC0LAg0YDQtdC90LTQtdGA0LjQvdCz0LAgV2ViR0wuXG4gIHByb3RlY3RlZCBnbCE6IFdlYkdMUmVuZGVyaW5nQ29udGV4dFxuXG4gIC8vINCe0LHRitC10LrRgiDQv9GA0L7Qs9GA0LDQvNC80YsgV2ViR0wuXG4gIHByb3RlY3RlZCBncHVQcm9ncmFtITogV2ViR0xQcm9ncmFtXG5cbiAgLy8g0J/QtdGA0LXQvNC10L3QvdGL0LUg0LTQu9GPINGB0LLRj9C30Lgg0L/RgNC40LvQvtC20LXQvdC40Y8g0YEg0L/RgNC+0LPRgNCw0LzQvNC+0LkgV2ViR0wuXG4gIHByb3RlY3RlZCB2YXJpYWJsZXM6IHsgW2tleTogc3RyaW5nXTogYW55IH0gPSB7fVxuXG4gIC8qKlxuICAgKiDQqNCw0LHQu9C+0L0gR0xTTC3QutC+0LTQsCDQtNC70Y8g0LLQtdGA0YjQuNC90L3QvtCz0L4g0YjQtdC50LTQtdGA0LAuINCh0L7QtNC10YDQttC40YIg0YHQv9C10YbQuNCw0LvRjNC90YPRjiDQstGB0YLQsNCy0LrRgyBcIlNFVC1WRVJURVgtQ09MT1ItQ09ERVwiLCDQutC+0YLQvtGA0LDRjyDQv9C10YDQtdC0XG4gICAqINGB0L7Qt9C00LDQvdC40LXQvCDRiNC10LnQtNC10YDQsCDQt9Cw0LzQtdC90Y/QtdGC0YHRjyDQvdCwIEdMU0wt0LrQvtC0INCy0YvQsdC+0YDQsCDRhtCy0LXRgtCwINCy0LXRgNGI0LjQvS5cbiAgICovXG4gIHByb3RlY3RlZCByZWFkb25seSB2ZXJ0ZXhTaGFkZXJDb2RlVGVtcGxhdGU6IHN0cmluZyA9XG4gICAgJ2F0dHJpYnV0ZSB2ZWMyIGFfcG9zaXRpb247XFxuJyArXG4gICAgJ2F0dHJpYnV0ZSBmbG9hdCBhX2NvbG9yO1xcbicgK1xuICAgICd1bmlmb3JtIG1hdDMgdV9tYXRyaXg7XFxuJyArXG4gICAgJ3ZhcnlpbmcgdmVjMyB2X2NvbG9yO1xcbicgK1xuICAgICd2b2lkIG1haW4oKSB7XFxuJyArXG4gICAgJyAgZ2xfUG9zaXRpb24gPSB2ZWM0KCh1X21hdHJpeCAqIHZlYzMoYV9wb3NpdGlvbiwgMSkpLnh5LCAwLjAsIDEuMCk7XFxuJyArXG4gICAgJyAgZ2xfUG9pbnRTaXplID0gMS4wICogYV9jb2xvcjtcXG4nICtcbiAgICAnICBTRVQtVkVSVEVYLUNPTE9SLUNPREUnICtcbiAgICAnfVxcbidcblxuICAvLyDQqNCw0LHQu9C+0L0gR0xTTC3QutC+0LTQsCDQtNC70Y8g0YTRgNCw0LPQvNC10L3RgtC90L7Qs9C+INGI0LXQudC00LXRgNCwLlxuICBwcm90ZWN0ZWQgcmVhZG9ubHkgZnJhZ21lbnRTaGFkZXJDb2RlVGVtcGxhdGU6IHN0cmluZyA9XG4gICAgJ3ByZWNpc2lvbiBsb3dwIGZsb2F0O1xcbicgK1xuICAgICd2YXJ5aW5nIHZlYzMgdl9jb2xvcjtcXG4nICtcbiAgICAndm9pZCBtYWluKCkge1xcbicgK1xuICAgICcgIGdsX0ZyYWdDb2xvciA9IHZlYzQodl9jb2xvci5yZ2IsIDEuMCk7XFxuJyArXG4gICAgJ31cXG4nXG5cbiAgLy8g0KHRh9C10YLRh9C40Log0YfQuNGB0LvQsCDQvtCx0YDQsNCx0L7RgtCw0L3QvdGL0YUg0L/QvtC70LjQs9C+0L3QvtCyLlxuICBwcm90ZWN0ZWQgYW1vdW50T2ZQb2x5Z29uczogbnVtYmVyID0gMFxuXG4gIC8qKlxuICAgKiAgINCd0LDQsdC+0YAg0LLRgdC/0L7QvNC+0LPQsNGC0LXQu9GM0L3Ri9GFINC60L7QvdGB0YLQsNC90YIsINC40YHQv9C+0LvRjNC30YPQtdC80YvRhSDQsiDRh9Cw0YHRgtC+INC/0L7QstGC0L7RgNGP0Y7RidC40YXRgdGPINCy0YvRh9C40YHQu9C10L3QuNGP0YUuINCg0LDRgdGB0YfQuNGC0YvQstCw0LXRgtGB0Y8g0Lgg0LfQsNC00LDQtdGC0YHRjyDQslxuICAgKiAgINC80LXRgtC+0LTQtSB7QGxpbmsgc2V0VXNlZnVsQ29uc3RhbnRzfS5cbiAgICovXG4gIHByb3RlY3RlZCBVU0VGVUxfQ09OU1RTOiBhbnlbXSA9IFtdXG5cbiAgLy8g0KLQtdGF0L3QuNGH0LXRgdC60LDRjyDQuNC90YTQvtGA0LzQsNGG0LjRjywg0LjRgdC/0L7Qu9GM0LfRg9C10LzQsNGPINC/0YDQuNC70L7QttC10L3QuNC10Lwg0LTQu9GPINGA0LDRgdGH0LXRgtCwINGC0YDQsNC90YHRhNC+0YDQvNCw0YbQuNC5LlxuICBwcm90ZWN0ZWQgdHJhbnNvcm1hdGlvbjogU1Bsb3RUcmFuc2Zvcm1hdGlvbiA9IHtcbiAgICB2aWV3UHJvamVjdGlvbk1hdDogW10sXG4gICAgc3RhcnRJbnZWaWV3UHJvak1hdDogW10sXG4gICAgc3RhcnRDYW1lcmE6IHt4OjAsIHk6MCwgem9vbTogMX0sXG4gICAgc3RhcnRQb3M6IFtdLFxuICAgIHN0YXJ0Q2xpcFBvczogW10sXG4gICAgc3RhcnRNb3VzZVBvczogW11cbiAgfVxuXG4gIC8qKlxuICAgKiDQnNCw0LrRgdC40LzQsNC70YzQvdC+0LUg0LLQvtC30LzQvtC20L3QvtC1INC60L7Qu9C40YfQtdGB0YLQstC+INCy0LXRgNGI0LjQvSDQsiDQs9GA0YPQv9C/0LUg0L/QvtC70LjQs9C+0L3QvtCyLCDQutC+0YLQvtGA0L7QtSDQtdGJ0LUg0LTQvtC/0YPRgdC60LDQtdGCINC00L7QsdCw0LLQu9C10L3QuNC1INC+0LTQvdC+0LPQviDRgdCw0LzQvtCz0L5cbiAgICog0LzQvdC+0LPQvtCy0LXRgNGI0LjQvdC90L7Qs9C+INC/0L7Qu9C40LPQvtC90LAuINCt0YLQviDQutC+0LvQuNGH0LXRgdGC0LLQviDQuNC80LXQtdGCINC+0LHRitC10LrRgtC40LLQvdC+0LUg0YLQtdGF0L3QuNGH0LXRgdC60L7QtSDQvtCz0YDQsNC90LjRh9C10L3QuNC1LCDRgi7Qui4g0YTRg9C90LrRhtC40Y9cbiAgICoge0BsaW5rIGRyYXdFbGVtZW50c30g0L3QtSDQv9C+0LfQstC+0LvRj9C10YIg0LrQvtGA0YDQtdC60YLQvdC+INC/0YDQuNC90LjQvNCw0YLRjCDQsdC+0LvRjNGI0LUgNjU1MzYg0LjQvdC00LXQutGB0L7QsiAoMzI3Njgg0LLQtdGA0YjQuNC9KS5cbiAgICovXG4gIHByb3RlY3RlZCBtYXhBbW91bnRPZlZlcnRleFBlclBvbHlnb25Hcm91cDogbnVtYmVyID0gMzI3NjggLSAodGhpcy5jaXJjbGVBcHByb3hMZXZlbCArIDEpO1xuXG4gIC8vINCY0L3RhNC+0YDQvNCw0YbQuNGPINC+INCx0YPRhNC10YDQsNGFLCDRhdGA0LDQvdGP0YnQuNGFINC00LDQvdC90YvQtSDQtNC70Y8g0LLQuNC00LXQvtC/0LDQvNGP0YLQuC5cbiAgcHJvdGVjdGVkIGJ1ZmZlcnM6IFNQbG90QnVmZmVycyA9IHtcbiAgICB2ZXJ0ZXhCdWZmZXJzOiBbXSxcbiAgICBjb2xvckJ1ZmZlcnM6IFtdLFxuICAgIGluZGV4QnVmZmVyczogW10sXG4gICAgYW1vdW50T2ZHTFZlcnRpY2VzOiBbXSxcbiAgICBhbW91bnRPZlNoYXBlczogW10sXG4gICAgYW1vdW50T2ZCdWZmZXJHcm91cHM6IDAsXG4gICAgYW1vdW50T2ZUb3RhbFZlcnRpY2VzOiAwLFxuICAgIGFtb3VudE9mVG90YWxHTFZlcnRpY2VzOiAwLFxuICAgIHNpemVJbkJ5dGVzOiBbMCwgMCwgMF1cbiAgfVxuXG4gIC8qKlxuICAgKiDQmNC90YTQvtGA0LzQsNGG0LjRjyDQviDQstC+0LfQvNC+0LbQvdGL0YUg0YTQvtGA0LzQsNGFINC/0L7Qu9C40LPQvtC90L7Qsi5cbiAgICog0JrQsNC20LTQsNGPINGE0L7RgNC80LAg0L/RgNC10LTRgdGC0LDQstC70Y/QtdGC0YHRjyDRhNGD0L3QutGG0LjQtdC5LCDQstGL0YfQuNGB0LvRj9GO0YnQtdC5INC10LUg0LLQtdGA0YjQuNC90Ysg0Lgg0L3QsNC30LLQsNC90LjQtdC8INGE0L7RgNC80YsuXG4gICAqINCU0LvRjyDRg9C60LDQt9Cw0L3QuNGPINGE0L7RgNC80Ysg0L/QvtC70LjQs9C+0L3QvtCyINCyINC/0YDQuNC70L7QttC10L3QuNC4INC40YHQv9C+0LvRjNC30YPRjtGC0YHRjyDRh9C40YHQu9C+0LLRi9C1INC40L3QtNC10LrRgdGLINCyINC00LDQvdC90L7QvCDQvNCw0YHRgdC40LLQtS5cbiAgICovXG4gIHByb3RlY3RlZCBzaGFwZXM6IHtjYWxjOiBTUGxvdENhbGNTaGFwZUZ1bmMsIG5hbWU6IHN0cmluZ31bXSA9IFtdXG5cbiAgLyoqXG4gICAqINCh0L7Qt9C00LDQtdGCINGN0LrQt9C10LzQv9C70Y/RgCDQutC70LDRgdGB0LAsINC40L3QuNGG0LjQsNC70LjQt9C40YDRg9C10YIg0L3QsNGB0YLRgNC+0LnQutC4LlxuICAgKlxuICAgKiBAcmVtYXJrc1xuICAgKiDQldGB0LvQuCDQutCw0L3QstCw0YEg0YEg0LfQsNC00LDQvdC90YvQvCDQuNC00LXQvdGC0LjRhNC40LrQsNGC0L7RgNC+0Lwg0L3QtSDQvdCw0LnQtNC10L0gLSDQs9C10L3QtdGA0LjRgNGD0LXRgtGB0Y8g0L7RiNC40LHQutCwLiDQndCw0YHRgtGA0L7QudC60Lgg0LzQvtCz0YPRgiDQsdGL0YLRjCDQt9Cw0LTQsNC90Ysg0LrQsNC6INCyXG4gICAqINC60L7QvdGB0YLRgNGD0LrRgtC+0YDQtSwg0YLQsNC6INC4INCyINC80LXRgtC+0LTQtSB7QGxpbmsgc2V0dXB9LiDQntC00L3QsNC60L4g0LIg0LvRjtCx0L7QvCDRgdC70YPRh9Cw0LUg0L3QsNGB0YLRgNC+0LnQutC4INC00L7Qu9C20L3RiyDQsdGL0YLRjCDQt9Cw0LTQsNC90Ysg0LTQviDQt9Cw0L/Rg9GB0LrQsCDRgNC10L3QtNC10YDQsC5cbiAgICpcbiAgICogQHBhcmFtIGNhbnZhc0lkIC0g0JjQtNC10L3RgtC40YTQuNC60LDRgtC+0YAg0LrQsNC90LLQsNGB0LAsINC90LAg0LrQvtGC0L7RgNC+0Lwg0LHRg9C00LXRgiDRgNC40YHQvtCy0LDRgtGM0YHRjyDQs9GA0LDRhNC40LouXG4gICAqIEBwYXJhbSBvcHRpb25zIC0g0J/QvtC70YzQt9C+0LLQsNGC0LXQu9GM0YHQutC40LUg0L3QsNGB0YLRgNC+0LnQutC4INGN0LrQt9C10LzQv9C70Y/RgNCwLlxuICAgKi9cbiAgY29uc3RydWN0b3IoY2FudmFzSWQ6IHN0cmluZywgb3B0aW9ucz86IFNQbG90T3B0aW9ucykge1xuXG4gICAgLy8g0KHQvtGF0YDQsNC90LXQvdC40LUg0YHRgdGL0LvQutC4INC90LAg0Y3QutC30LXQvNC/0LvRj9GAINC60LvQsNGB0YHQsC4g0J/QvtC30LLQvtC70Y/QtdGCINCy0L3QtdGI0LjQvCDRgdC+0LHRi9GC0LjRj9C8INC/0L7Qu9GD0YfQsNGC0Ywg0LTQvtGB0YLRg9C/INC6INC/0L7Qu9GP0Lwg0Lgg0LzQtdGC0L7QtNCw0Lwg0Y3QutC30LXQvNC/0LvRj9GA0LAuXG4gICAgU1Bsb3QuaW5zdGFuY2VzW2NhbnZhc0lkXSA9IHRoaXNcblxuICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChjYW52YXNJZCkpIHtcbiAgICAgIHRoaXMuY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY2FudmFzSWQpIGFzIEhUTUxDYW52YXNFbGVtZW50XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcign0JrQsNC90LLQsNGBINGBINC40LTQtdC90YLQuNGE0LjQutCw0YLQvtGA0L7QvCBcIiMnICsgY2FudmFzSWQgKyDCoCdcIiDQvdC1INC90LDQudC00LXQvSEnKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqINCg0LXQs9C40YHRgtGA0LDRhtC40Y8g0YLRgNC10YUg0LHQsNC30L7QstGL0YUg0YTQvtGA0Lwg0L/QvtC70LjQs9C+0L3QvtCyICjRgtGA0LXRg9Cz0L7Qu9GM0L3QuNC60LgsINC60LLQsNC00YDQsNGC0Ysg0Lgg0LrRgNGD0LPQuCkuINCd0LDQu9C40YfQuNC1INGN0YLQuNGFINGE0L7RgNC8INCyINGD0LrQsNC30LDQvdC90L7QvCDQv9C+0YDRj9C00LrQtVxuICAgICAqINGP0LLQu9GP0LXRgtGB0Y8g0L7QsdGP0LfQsNGC0LXQu9GM0L3Ri9C8INC00LvRjyDQutC+0YDRgNC10LrRgtC90L7QuSDRgNCw0LHQvtGC0Ysg0L/RgNC40LvQvtC20LXQvdC40Y8uINCU0YDRg9Cz0LjQtSDRhNC+0YDQvNGLINC80L7Qs9GD0YIg0YDQtdCz0LjRgdGC0YDQuNGA0L7QstCw0YLRjNGPINCyINC70Y7QsdC+0Lwg0LrQvtC70LjRh9C10YHRgtCy0LUsINCyXG4gICAgICog0LvRjtCx0L7QuSDQv9C+0YHQu9C10LTQvtCy0LDRgtC10LvRjNC90L7RgdGC0LguXG4gICAgICovXG4gICAgdGhpcy5yZWdpc3RlclNoYXBlKHRoaXMuZ2V0VmVydGljZXNPZlRyaWFuZ2xlLCAn0KLRgNC10YPQs9C+0LvRjNC90LjQuicpXG4gICAgdGhpcy5yZWdpc3RlclNoYXBlKHRoaXMuZ2V0VmVydGljZXNPZlNxdWFyZSwgJ9Ca0LLQsNC00YDQsNGCJylcbiAgICB0aGlzLnJlZ2lzdGVyU2hhcGUodGhpcy5nZXRWZXJ0aWNlc09mQ2lyY2xlLCAn0JrRgNGD0LMnKVxuXG4gICAgLy8g0JXRgdC70Lgg0L/QtdGA0LXQtNCw0L3RiyDQvdCw0YHRgtGA0L7QudC60LgsINGC0L4g0L7QvdC4INC/0YDQuNC80LXQvdGP0Y7RgtGB0Y8uXG4gICAgaWYgKG9wdGlvbnMpIHtcbiAgICAgIHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKVxuXG4gICAgICAvLyAg0JXRgdC70Lgg0LfQsNC/0YDQvtGI0LXQvSDRhNC+0YDRgdC40YDQvtCy0LDQvdC90YvQuSDQt9Cw0L/Rg9GB0LosINGC0L4g0LjQvdC40YbQuNCw0LvQuNC30LjRgNGD0Y7RgtGB0Y8g0LLRgdC1INC90LXQvtCx0YXQvtC00LjQvNGL0LUg0LTQu9GPINGA0LXQvdC00LXRgNCwINC/0LDRgNCw0LzQtdGC0YDRiy5cbiAgICAgIGlmICh0aGlzLmZvcmNlUnVuKSB7XG4gICAgICAgIHRoaXMuc2V0dXAob3B0aW9ucylcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICog0KHQvtC30LTQsNC10YIg0LrQvtC90YLQtdC60YHRgiDRgNC10L3QtNC10YDQuNC90LPQsCBXZWJHTCDQuCDRg9GB0YLQsNC90LDQstC70LjQstCw0LXRgiDQutC+0YDRgNC10LrRgtC90YvQuSDRgNCw0LfQvNC10YAg0L7QsdC70LDRgdGC0Lgg0L/RgNC+0YHQvNC+0YLRgNCwLlxuICAgKi9cbiAgcHJvdGVjdGVkIGNyZWF0ZUdsKCk6IHZvaWQge1xuXG4gICAgdGhpcy5nbCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJ3dlYmdsJywgdGhpcy53ZWJHbFNldHRpbmdzKSBhcyBXZWJHTFJlbmRlcmluZ0NvbnRleHRcblxuICAgIHRoaXMuY2FudmFzLndpZHRoID0gdGhpcy5jYW52YXMuY2xpZW50V2lkdGhcbiAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSB0aGlzLmNhbnZhcy5jbGllbnRIZWlnaHRcblxuICAgIHRoaXMuZ2wudmlld3BvcnQoMCwgMCwgdGhpcy5jYW52YXMud2lkdGgsIHRoaXMuY2FudmFzLmhlaWdodClcbiAgfVxuXG4gIC8qKlxuICAgKiDQoNC10LPQuNGB0YLRgNC40YDRg9C10YIg0L3QvtCy0YPRjiDRhNC+0YDQvNGDINC/0L7Qu9C40LPQvtC90L7Qsi4g0KDQtdCz0LjRgdGC0YDQsNGG0LjRjyDQvtC30L3QsNGH0LDQtdGCINCy0L7Qt9C80L7QttC90L7RgdGC0Ywg0LIg0LTQsNC70YzQvdC10LnRiNC10Lwg0L7RgtC+0LHRgNCw0LbQsNGC0Ywg0L3QsCDQs9GA0LDRhNC40LrQtSDQv9C+0LvQuNCz0L7QvdGLINC00LDQvdC90L7QuSDRhNC+0YDQvNGLLlxuICAgKlxuICAgKiBAcGFyYW0gcG9seWdvbkNhbGMgLSDQpNGD0L3QutGG0LjRjyDQstGL0YfQuNGB0LvQtdC90LjRjyDQutC+0L7RgNC00LjQvdCw0YIg0LLQtdGA0YjQuNC9INC/0L7Qu9C40LPQvtC90LAg0LTQsNC90L3QvtC5INGE0L7RgNC80YsuXG4gICAqIEBwYXJhbSBwb2x5Z29uTmFtZSAtINCd0LDQt9Cy0LDQvdC40LUg0YTQvtGA0LzRiyDQv9C+0LvQuNCz0L7QvdCwLlxuICAgKiBAcmV0dXJucyDQmNC90LTQtdC60YEg0L3QvtCy0L7QuSDRhNC+0YDQvNGLLCDQv9C+INC60L7RgtC+0YDQvtC80YMg0LfQsNC00LDQtdGC0YHRjyDQtdC1INC+0YLQvtCx0YDQsNC20LXQvdC40LUg0L3QsCDQs9GA0LDRhNC40LrQtS5cbiAgICovXG4gIHB1YmxpYyByZWdpc3RlclNoYXBlKHBvbHlnb25DYWxjOiBTUGxvdENhbGNTaGFwZUZ1bmMsIHBvbHlnb25OYW1lOiBzdHJpbmcpOiBudW1iZXIge1xuXG4gICAgLy8g0JTQvtCx0LDQstC70LXQvdC40LUg0YTQvtGA0LzRiyDQsiDQvNCw0YHRgdC40LIg0YTQvtGA0LwuXG4gICAgdGhpcy5zaGFwZXMucHVzaCh7XG4gICAgICBjYWxjOiBwb2x5Z29uQ2FsYyxcbiAgICAgIG5hbWU6IHBvbHlnb25OYW1lXG4gICAgfSlcblxuICAgIC8vINCU0L7QsdCw0LLQu9C10L3QuNC1INGE0L7RgNC80Ysg0LIg0LzQsNGB0YHQuNCyINGH0LDRgdGC0L7RgiDQv9C+0Y/QstC70LXQvdC40Y8g0LIg0LTQtdC80L4t0YDQtdC20LjQvNC1LlxuICAgIHRoaXMuZGVtb01vZGUuc2hhcGVRdW90YSEucHVzaCgxKVxuXG4gICAgLy8g0J/QvtC70YPRh9C10L3QvdGL0Lkg0LjQvdC00LXQutGBINGE0L7RgNC80Ysg0LIg0LzQsNGB0YHQuNCy0LUg0YTQvtGA0LwuXG4gICAgcmV0dXJuIHRoaXMuc2hhcGVzLmxlbmd0aCAtIDFcbiAgfVxuXG4gIC8qKlxuICAgKiDQo9GB0YLQsNC90LDQstC70LjQstCw0LXRgiDQvdC10L7QsdGF0L7QtNC40LzRi9C1INC00LvRjyDRgNC10L3QtNC10YDQsCDQv9Cw0YDQsNC80LXRgtGA0Ysg0Y3QutC30LXQvNC/0LvRj9GA0LAg0LggV2ViR0wuXG4gICAqXG4gICAqIEBwYXJhbSBvcHRpb25zIC0g0J/QvtC70YzQt9C+0LLQsNGC0LXQu9GM0YHQutC40LUg0L3QsNGB0YLRgNC+0LnQutC4INGN0LrQt9C10LzQv9C70Y/RgNCwLlxuICAgKi9cbiAgcHVibGljIHNldHVwKG9wdGlvbnM6IFNQbG90T3B0aW9ucyk6IHZvaWQge1xuXG4gICAgLy8g0J/RgNC40LzQtdC90LXQvdC40LUg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GM0YHQutC40YUg0L3QsNGB0YLRgNC+0LXQui5cbiAgICB0aGlzLnNldE9wdGlvbnMob3B0aW9ucylcblxuICAgIC8vINCh0L7Qt9C00LDQvdC40LUg0LrQvtC90YLQtdC60YHRgtCwINGA0LXQvdC00LXRgNC40L3Qs9CwLlxuICAgIHRoaXMuY3JlYXRlR2woKVxuXG4gICAgLy8g0JLRi9Cy0L7QtCDQvtGC0LvQsNC00L7Rh9C90L7QuSDQuNC90YTQvtGA0LzQsNGG0LjQuC5cbiAgICBpZiAodGhpcy5kZWJ1Z01vZGUuaXNFbmFibGUpIHtcbiAgICAgIHRoaXMucmVwb3J0TWFpbkluZm8ob3B0aW9ucylcbiAgICB9XG5cbiAgICAvLyDQntCx0L3Rg9C70LXQvdC40LUg0YHRh9C10YLRh9C40LrQsCDQv9C+0LvQuNCz0L7QvdC+0LIuXG4gICAgdGhpcy5hbW91bnRPZlBvbHlnb25zID0gMFxuXG4gICAgLy8g0J7QsdC90YPQu9C10L3QuNC1INGC0LXRhdC90LjRh9C10YHQutC+0LPQviDRgdGH0LXRgtGH0LjQutCwINGA0LXQttC40LzQsCDQtNC10LzQvi3QtNCw0L3QvdGL0YVcbiAgICB0aGlzLmRlbW9Nb2RlLmluZGV4ID0gMFxuXG4gICAgLy8g0J7QsdC90YPQu9C10L3QuNC1INGB0YfQtdGC0YfQuNC60L7QsiDRh9C40YHQu9CwINC40YHQv9C+0LvRjNC30L7QstCw0L3QuNGPINGA0LDQt9C70LjRh9C90YvRhSDRhNC+0YDQvCDQv9C+0LvQuNCz0L7QvdC+0LIuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnNoYXBlcy5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy5idWZmZXJzLmFtb3VudE9mU2hhcGVzW2ldID0gMFxuICAgIH1cblxuICAgIC8qKlxuICAgICAqINCf0YDQtdC00LXQu9GM0L3QvtC1INC60L7Qu9C40YfQtdGB0YLQstC+INCy0LXRgNGI0LjQvSDQsiDQs9GA0YPQv9C/0LUg0L/QvtC70LjQs9C+0L3QvtCyINC30LDQstC40YHQuNGCINC+0YIg0L/QsNGA0LDQvNC10YLRgNCwXG4gICAgICogY2lyY2xlQXBwcm94TGV2ZWwsINC60L7RgtC+0YDRi9C5INC80L7QsyDQsdGL0YLRjCDQuNC30LzQtdC90LXQvSDQv9C+0LvRjNC30L7QstCw0YLQtdC70YzRgdC60LjQvNC4INC90LDRgdGC0YDQvtC50LrQsNC80LguXG4gICAgICovXG4gICAgdGhpcy5tYXhBbW91bnRPZlZlcnRleFBlclBvbHlnb25Hcm91cCA9IDMyNzY4IC0gKHRoaXMuY2lyY2xlQXBwcm94TGV2ZWwgKyAxKVxuXG4gICAgLy8g0JjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y8g0LLRgdC/0L7QvNC+0LPQsNGC0LXQu9GM0L3Ri9GFINC60L7QvdGB0YLQsNC90YIuXG4gICAgdGhpcy5zZXRVc2VmdWxDb25zdGFudHMoKVxuXG4gICAgLy8g0KPRgdGC0LDQvdC+0LLQutCwINGG0LLQtdGC0LAg0L7Rh9C40YHRgtC60Lgg0YDQtdC90LTQtdGA0LjQvdCz0LBcbiAgICBsZXQgW3IsIGcsIGJdID0gdGhpcy5jb252ZXJ0Q29sb3IodGhpcy5iZ0NvbG9yKVxuICAgIHRoaXMuZ2wuY2xlYXJDb2xvcihyLCBnLCBiLCAwLjApXG4gICAgdGhpcy5nbC5jbGVhcih0aGlzLmdsLkNPTE9SX0JVRkZFUl9CSVQpXG5cbiAgICAvKipcbiAgICAgKiDQn9C+0LTQs9C+0YLQvtCy0LrQsCDQutC+0LTQvtCyINGI0LXQudC00LXRgNC+0LIuINCSINC60L7QtCDQstC10YDRiNC40L3QvdC+0LPQviDRiNC10LnQtNC10YDQsCDQstGB0YLQsNCy0LvRj9C10YLRgdGPINC60L7QtCDQstGL0LHQvtGA0LAg0YbQstC10YLQsCDQstC10YDRiNC40L0uINCa0L7QtCDRhNGA0LDQs9C80LXQvdGC0L3QvtCz0L5cbiAgICAgKiDRiNC10LnQtNC10YDQsCDQuNGB0L/QvtC70YzQt9GD0LXRgtGB0Y8g0LHQtdC3INC40LfQvNC10L3QtdC90LjQuS5cbiAgICAgKi9cbiAgICBsZXQgdmVydGV4U2hhZGVyQ29kZSA9IHRoaXMudmVydGV4U2hhZGVyQ29kZVRlbXBsYXRlLnJlcGxhY2UoJ1NFVC1WRVJURVgtQ09MT1ItQ09ERScsIHRoaXMuZ2VuU2hhZGVyQ29sb3JDb2RlKCkpXG4gICAgbGV0IGZyYWdtZW50U2hhZGVyQ29kZSA9IHRoaXMuZnJhZ21lbnRTaGFkZXJDb2RlVGVtcGxhdGVcblxuICAgIC8vINCh0L7Qt9C00LDQvdC40LUg0YjQtdC50LTQtdGA0L7QsiBXZWJHTC5cbiAgICBsZXQgdmVydGV4U2hhZGVyID0gdGhpcy5jcmVhdGVXZWJHbFNoYWRlcignVkVSVEVYX1NIQURFUicsIHZlcnRleFNoYWRlckNvZGUpXG4gICAgbGV0IGZyYWdtZW50U2hhZGVyID0gdGhpcy5jcmVhdGVXZWJHbFNoYWRlcignRlJBR01FTlRfU0hBREVSJywgZnJhZ21lbnRTaGFkZXJDb2RlKVxuXG4gICAgLy8g0KHQvtC30LTQsNC90LjQtSDQv9GA0L7Qs9GA0LDQvNC80YsgV2ViR0wuXG4gICAgdGhpcy5jcmVhdGVXZWJHbFByb2dyYW0odmVydGV4U2hhZGVyLCBmcmFnbWVudFNoYWRlcilcblxuICAgIC8vINCj0YHRgtCw0L3QvtCy0LrQsCDRgdCy0Y/Qt9C10Lkg0L/QtdGA0LXQvNC10L3QvdGL0YUg0L/RgNC40LvQvtC20LXQvdC40Y8g0YEg0L/RgNC+0LPRgNCw0LzQvNC+0LkgV2ViR2wuXG4gICAgdGhpcy5zZXRXZWJHbFZhcmlhYmxlKCdhdHRyaWJ1dGUnLCAnYV9wb3NpdGlvbicpXG4gICAgdGhpcy5zZXRXZWJHbFZhcmlhYmxlKCdhdHRyaWJ1dGUnLCAnYV9jb2xvcicpXG4gICAgdGhpcy5zZXRXZWJHbFZhcmlhYmxlKCd1bmlmb3JtJywgJ3VfbWF0cml4JylcblxuICAgIC8vINCS0YvRh9C40YHQu9C10L3QuNC1INC00LDQvdC90YvRhSDQvtCx0L4g0LLRgdC10YUg0L/QvtC70LjQs9C+0L3QsNGFINC4INC30LDQv9C+0LvQvdC10L3QuNC1INC40LzQuCDQsdGD0YTQtdGA0L7QsiBXZWJHTC5cbiAgICB0aGlzLmNyZWF0ZVdiR2xCdWZmZXJzKClcblxuICAgIC8vINCV0YHQu9C4INC90LXQvtCx0YXQvtC00LjQvNC+LCDRgtC+INGA0LXQvdC00LXRgNC40L3QsyDQt9Cw0L/Rg9GB0LrQsNC10YLRgdGPINGB0YDQsNC30YMg0L/QvtGB0LvQtSDRg9GB0YLQsNC90L7QstC60Lgg0L/QsNGA0LDQvNC10YLRgNC+0LIg0Y3QutC30LXQvNC/0LvRj9GA0LAuXG4gICAgaWYgKHRoaXMuZm9yY2VSdW4pIHtcbiAgICAgIHRoaXMucnVuKClcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICog0J/RgNC40LzQtdC90Y/QtdGCINC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjNGB0LrQuNC1INC90LDRgdGC0YDQvtC50LrQuCDRjdC60LfQtdC80L/Qu9GP0YDQsC5cbiAgICpcbiAgICogQHBhcmFtIG9wdGlvbnMgLSDQn9C+0LvRjNC30L7QstCw0YLQtdC70YzRgdC60LjQtSDQvdCw0YHRgtGA0L7QudC60Lgg0Y3QutC30LXQvNC/0LvRj9GA0LAuXG4gICAqL1xuICBwcm90ZWN0ZWQgc2V0T3B0aW9ucyhvcHRpb25zOiBTUGxvdE9wdGlvbnMpOiB2b2lkIHtcblxuICAgIC8qKlxuICAgICAqINCa0L7Qv9C40YDQvtCy0LDQvdC40LUg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GM0YHQutC40YUg0L3QsNGB0YLRgNC+0LXQuiDQsiDRgdC+0L7RgtCy0LXRgtGB0LLRg9GO0YnQuNC1INC/0L7Qu9GPINGN0LrQt9C10LzQv9C70Y/RgNCwLiDQmtC+0L/QuNGA0YPRjtGC0YHRjyDRgtC+0LvRjNC60L4g0YLQtSDQuNC3INC90LjRhSwg0LrQvtGC0L7RgNGL0LxcbiAgICAgKiDQuNC80LXRjtGC0YHRjyDRgdC+0L7RgtCy0LXRgtGB0YLQstGD0Y7RidC40LUg0Y3QutCy0LjQstCw0LvQtdC90YLRiyDQsiDQv9C+0LvRj9GFINGN0LrQt9C10LzQv9C70Y/RgNCwLiDQmtC+0L/QuNGA0YPQtdGC0YHRjyDRgtCw0LrQttC1INC/0LXRgNCy0YvQuSDRg9GA0L7QstC10L3RjCDQstC70L7QttC10L3QvdGL0YUg0L3QsNGB0YLRgNC+0LXQui5cbiAgICAgKi9cbiAgICBmb3IgKGxldCBvcHRpb24gaW4gb3B0aW9ucykge1xuXG4gICAgICBpZiAoIXRoaXMuaGFzT3duUHJvcGVydHkob3B0aW9uKSkgY29udGludWVcblxuICAgICAgaWYgKGlzT2JqZWN0KChvcHRpb25zIGFzIGFueSlbb3B0aW9uXSkgJiYgaXNPYmplY3QoKHRoaXMgYXMgYW55KVtvcHRpb25dKSApIHtcbiAgICAgICAgZm9yIChsZXQgbmVzdGVkT3B0aW9uIGluIChvcHRpb25zIGFzIGFueSlbb3B0aW9uXSkge1xuICAgICAgICAgIGlmICgodGhpcyBhcyBhbnkpW29wdGlvbl0uaGFzT3duUHJvcGVydHkobmVzdGVkT3B0aW9uKSkge1xuICAgICAgICAgICAgKHRoaXMgYXMgYW55KVtvcHRpb25dW25lc3RlZE9wdGlvbl0gPSAob3B0aW9ucyBhcyBhbnkpW29wdGlvbl1bbmVzdGVkT3B0aW9uXVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgKHRoaXMgYXMgYW55KVtvcHRpb25dID0gKG9wdGlvbnMgYXMgYW55KVtvcHRpb25dXG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog0JXRgdC70Lgg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GMINC30LDQtNCw0LXRgiDRgNCw0LfQvNC10YAg0L/Qu9C+0YHQutC+0YHRgtC4LCDQvdC+INC/0YDQuCDRjdGC0L7QvCDQvdCwINC30LDQtNCw0LXRgiDQvdCw0YfQsNC70YzQvdC+0LUg0L/QvtC70L7QttC10L3QuNC1INC+0LHQu9Cw0YHRgtC4INC/0YDQvtGB0LzQvtGC0YDQsCwg0YLQvlxuICAgICAqINC+0LHQu9Cw0YHRgtGMINC/0YDQvtGB0LzQvtGC0YDQsCDQv9C+0LzQtdGJ0LDQtdGC0YHRjyDQsiDRhtC10L3RgtGAINC30LDQtNCw0L3QvdC+0Lkg0L/Qu9C+0YHQutC+0YHRgtC4LlxuICAgICAqL1xuICAgIGlmIChvcHRpb25zLmhhc093blByb3BlcnR5KCdncmlkU2l6ZScpICYmICFvcHRpb25zLmhhc093blByb3BlcnR5KCdjYW1lcmEnKSkge1xuICAgICAgdGhpcy5jYW1lcmEgPSB7XG4gICAgICAgIHg6IHRoaXMuZ3JpZFNpemUud2lkdGggLyAyLFxuICAgICAgICB5OiB0aGlzLmdyaWRTaXplLmhlaWdodCAvIDIsXG4gICAgICAgIHpvb206IDFcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDQldGB0LvQuCDQt9Cw0L/RgNC+0YjQtdC9INC00LXQvNC+LdGA0LXQttC40LwsINGC0L4g0LTQu9GPINC40YLQtdGA0LjRgNC+0LLQsNC90LjRjyDQvtCx0YrQtdC60YLQvtCyINCx0YPQtNC10YIg0LjRgdC/0L7Qu9GM0LfQvtCy0LDRgtGM0YHRjyDQstC90YPRgtGA0LXQvdC90LjQuSDQuNC80LjRgtC40YDRg9GO0YnQuNC5INC40YLQtdGA0LjRgNC+0LLQsNC90LjQtVxuICAgICAqINC80LXRgtC+0LQuINCf0YDQuCDRjdGC0L7QvCDQstC90LXRiNC90Y/RjyDRhNGD0L3QutGG0LjRjyDQuNGC0LXRgNC40YDQvtCy0LDQvdC40Y8g0LjRgdC/0L7Qu9GM0LfQvtCy0LDQvdCwINC90LUg0LHRg9C00LXRgi5cbiAgICAgKi9cbiAgICBpZiAodGhpcy5kZW1vTW9kZS5pc0VuYWJsZSkge1xuICAgICAgdGhpcy5pdGVyYXRpb25DYWxsYmFjayA9IHRoaXMuZGVtb0l0ZXJhdGlvbkNhbGxiYWNrXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqINCS0YvRh9C40YHQu9GP0LXRgiDQvdCw0LHQvtGAINCy0YHQv9C+0LzQvtCz0LDRgtC10LvRjNC90YvRhSDQutC+0L3RgdGC0LDQvdGCIHtAbGluayBVU0VGVUxfQ09OU1RTfSwg0YXRgNCw0L3Rj9GJ0LjRhSDRgNC10LfRg9C70YzRgtCw0YLRiyDQsNC70LPQtdCx0YDQsNC40YfQtdGB0LrQuNGFINC4XG4gICAqINGC0YDQuNCz0L7QvdC+0LzQtdGC0YDQuNGH0LXRgdC60LjRhSDQstGL0YfQuNGB0LvQtdC90LjQuSwg0LjRgdC/0L7Qu9GM0LfRg9C10LzRi9GFINCyINGA0LDRgdGH0LXRgtCw0YUg0LLQtdGA0YjQuNC9INC/0L7Qu9C40LPQvtC90L7QsiDQuCDQvNCw0YLRgNC40YYg0YLRgNCw0L3RgdGE0L7RgNC80LDRhtC40LguXG4gICAqXG4gICAqIEByZW1hcmtzXG4gICAqINCi0LDQutC40LUg0LrQvtC90YHRgtCw0L3RgtGLINC/0L7Qt9Cy0L7Qu9GP0Y7RgiDQstGL0L3QtdGB0YLQuCDQt9Cw0YLRgNCw0YLQvdGL0LUg0LTQu9GPINC/0YDQvtGG0LXRgdGB0L7RgNCwINC+0L/QtdGA0LDRhtC40Lgg0LfQsCDQv9GA0LXQtNC10LvRiyDQvNC90L7Qs9C+0LrRgNCw0YLQvdC+INC40YHQv9C+0LvRjNC30YPQtdC80YvRhSDRhNGD0L3QutGG0LjQuVxuICAgKiDRg9Cy0LXQu9C40YfQuNCy0LDRjyDQv9GA0L7QuNC30LLQvtC00LjRgtC10LvRjNC90L7RgdGC0Ywg0L/RgNC40LvQvtC20LXQvdC40Y8g0L3QsCDRjdGC0LDQv9Cw0YUg0L/QvtC00LPQvtGC0L7QstC60Lgg0LTQsNC90L3Ri9GFINC4INGA0LXQvdC00LXRgNC40L3Qs9CwLlxuICAgKi9cbiAgcHJvdGVjdGVkIHNldFVzZWZ1bENvbnN0YW50cygpOiB2b2lkIHtcblxuICAgIC8vINCa0L7QvdGB0YLQsNC90YLRiywg0LfQsNCy0LjRgdGP0YnQuNC1INC+0YIg0YDQsNC30LzQtdGA0LAg0L/QvtC70LjQs9C+0L3QsC5cbiAgICB0aGlzLlVTRUZVTF9DT05TVFNbMF0gPSB0aGlzLnBvbHlnb25TaXplIC8gMlxuICAgIHRoaXMuVVNFRlVMX0NPTlNUU1sxXSA9IHRoaXMuVVNFRlVMX0NPTlNUU1swXSAvIE1hdGguY29zKE1hdGguUEkgLyA2KVxuICAgIHRoaXMuVVNFRlVMX0NPTlNUU1syXSA9IHRoaXMuVVNFRlVMX0NPTlNUU1swXSAqIE1hdGgudGFuKE1hdGguUEkgLyA2KVxuXG4gICAgLy8g0JrQvtC90YHRgtCw0L3RgtGLLCDQt9Cw0LLQuNGB0Y/RidC40LUg0L7RgiDRgdGC0LXQv9C10L3QuCDQtNC10YLQsNC70LjQt9Cw0YbQuNC4INC60YDRg9Cz0LAg0Lgg0YDQsNC30LzQtdGA0LAg0L/QvtC70LjQs9C+0L3QsC5cbiAgICB0aGlzLlVTRUZVTF9DT05TVFNbM10gPSBuZXcgRmxvYXQzMkFycmF5KHRoaXMuY2lyY2xlQXBwcm94TGV2ZWwpXG4gICAgdGhpcy5VU0VGVUxfQ09OU1RTWzRdID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLmNpcmNsZUFwcHJveExldmVsKVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNpcmNsZUFwcHJveExldmVsOyBpKyspIHtcbiAgICAgIGNvbnN0IGFuZ2xlID0gMiAqIE1hdGguUEkgKiBpIC8gdGhpcy5jaXJjbGVBcHByb3hMZXZlbFxuICAgICAgdGhpcy5VU0VGVUxfQ09OU1RTWzNdW2ldID0gdGhpcy5VU0VGVUxfQ09OU1RTWzBdICogTWF0aC5jb3MoYW5nbGUpXG4gICAgICB0aGlzLlVTRUZVTF9DT05TVFNbNF1baV0gPSB0aGlzLlVTRUZVTF9DT05TVFNbMF0gKiBNYXRoLnNpbihhbmdsZSlcbiAgICB9XG5cbiAgICAvLyDQmtC+0L3RgdGC0LDQvdGC0YssINC30LDQstC40YHRj9GJ0LjQtSDQvtGCINGA0LDQt9C80LXRgNCwINC60LDQvdCy0LDRgdCwLlxuICAgIHRoaXMuVVNFRlVMX0NPTlNUU1s1XSA9IDIgLyB0aGlzLmNhbnZhcy53aWR0aFxuICAgIHRoaXMuVVNFRlVMX0NPTlNUU1s2XSA9IDIgLyB0aGlzLmNhbnZhcy5oZWlnaHRcbiAgICB0aGlzLlVTRUZVTF9DT05TVFNbN10gPSAyIC8gdGhpcy5jYW52YXMuY2xpZW50V2lkdGhcbiAgICB0aGlzLlVTRUZVTF9DT05TVFNbOF0gPSAtMiAvIHRoaXMuY2FudmFzLmNsaWVudEhlaWdodFxuICAgIHRoaXMuVVNFRlVMX0NPTlNUU1s5XSA9IHRoaXMuY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnRcbiAgICB0aGlzLlVTRUZVTF9DT05TVFNbMTBdID0gdGhpcy5jYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wXG4gIH1cblxuICAvKipcbiAgICog0KHQvtC30LTQsNC10YIg0YjQtdC50LTQtdGAIFdlYkdMLlxuICAgKlxuICAgKiBAcGFyYW0gc2hhZGVyVHlwZSDQotC40L8g0YjQtdC50LTQtdGA0LAuXG4gICAqIEBwYXJhbSBzaGFkZXJDb2RlINCa0L7QtCDRiNC10LnQtNC10YDQsCDQvdCwINGP0LfRi9C60LUgR0xTTC5cbiAgICogQHJldHVybnMg0KHQvtC30LTQsNC90L3Ri9C5INC+0LHRitC10LrRgiDRiNC10LnQtNC10YDQsC5cbiAgICovXG4gIHByb3RlY3RlZCBjcmVhdGVXZWJHbFNoYWRlcihzaGFkZXJUeXBlOiBXZWJHbFNoYWRlclR5cGUsIHNoYWRlckNvZGU6IHN0cmluZyk6IFdlYkdMU2hhZGVyIHtcblxuICAgIC8vINCh0L7Qt9C00LDQvdC40LUsINC/0YDQuNCy0Y/Qt9C60LAg0LrQvtC00LAg0Lgg0LrQvtC80L/QuNC70Y/RhtC40Y8g0YjQtdC50LTQtdGA0LAuXG4gICAgY29uc3Qgc2hhZGVyID0gdGhpcy5nbC5jcmVhdGVTaGFkZXIodGhpcy5nbFtzaGFkZXJUeXBlXSkgYXMgV2ViR0xTaGFkZXJcbiAgICB0aGlzLmdsLnNoYWRlclNvdXJjZShzaGFkZXIsIHNoYWRlckNvZGUpXG4gICAgdGhpcy5nbC5jb21waWxlU2hhZGVyKHNoYWRlcilcblxuICAgIGlmICghdGhpcy5nbC5nZXRTaGFkZXJQYXJhbWV0ZXIoc2hhZGVyLCB0aGlzLmdsLkNPTVBJTEVfU1RBVFVTKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCfQntGI0LjQsdC60LAg0LrQvtC80L/QuNC70Y/RhtC40Lgg0YjQtdC50LTQtdGA0LAgWycgKyBzaGFkZXJUeXBlICsgJ10uICcgKyB0aGlzLmdsLmdldFNoYWRlckluZm9Mb2coc2hhZGVyKSlcbiAgICB9XG5cbiAgICAvLyDQktGL0LLQvtC0INC+0YLQu9Cw0LTQvtGH0L3QvtC5INC40L3RhNC+0YDQvNCw0YbQuNC4LlxuICAgIGlmICh0aGlzLmRlYnVnTW9kZS5pc0VuYWJsZSkge1xuICAgICAgY29uc29sZS5ncm91cCgnJWPQodC+0LfQtNCw0L0g0YjQtdC50LTQtdGAIFsnICsgc2hhZGVyVHlwZSArICddJywgdGhpcy5kZWJ1Z01vZGUuZ3JvdXBTdHlsZSlcbiAgICAgIHtcbiAgICAgICAgY29uc29sZS5sb2coc2hhZGVyQ29kZSlcbiAgICAgIH1cbiAgICAgIGNvbnNvbGUuZ3JvdXBFbmQoKVxuICAgIH1cblxuICAgIHJldHVybiBzaGFkZXJcbiAgfVxuXG4gIC8qKlxuICAgKiDQodC+0LfQtNCw0LXRgiDQv9GA0L7Qs9GA0LDQvNC80YMgV2ViR0wuXG4gICAqXG4gICAqIEBwYXJhbSB7V2ViR0xTaGFkZXJ9IHZlcnRleFNoYWRlciDQktC10YDRiNC40L3QvdGL0Lkg0YjQtdC50LTQtdGALlxuICAgKiBAcGFyYW0ge1dlYkdMU2hhZGVyfSBmcmFnbWVudFNoYWRlciDQpNGA0LDQs9C80LXQvdGC0L3Ri9C5INGI0LXQudC00LXRgC5cbiAgICovXG4gIHByb3RlY3RlZCBjcmVhdGVXZWJHbFByb2dyYW0odmVydGV4U2hhZGVyOiBXZWJHTFNoYWRlciwgZnJhZ21lbnRTaGFkZXI6IFdlYkdMU2hhZGVyKTogdm9pZCB7XG5cbiAgICB0aGlzLmdwdVByb2dyYW0gPSB0aGlzLmdsLmNyZWF0ZVByb2dyYW0oKSBhcyBXZWJHTFByb2dyYW1cblxuICAgIHRoaXMuZ2wuYXR0YWNoU2hhZGVyKHRoaXMuZ3B1UHJvZ3JhbSwgdmVydGV4U2hhZGVyKVxuICAgIHRoaXMuZ2wuYXR0YWNoU2hhZGVyKHRoaXMuZ3B1UHJvZ3JhbSwgZnJhZ21lbnRTaGFkZXIpXG4gICAgdGhpcy5nbC5saW5rUHJvZ3JhbSh0aGlzLmdwdVByb2dyYW0pXG5cbiAgICBpZiAoIXRoaXMuZ2wuZ2V0UHJvZ3JhbVBhcmFtZXRlcih0aGlzLmdwdVByb2dyYW0sIHRoaXMuZ2wuTElOS19TVEFUVVMpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ9Ce0YjQuNCx0LrQsCDRgdC+0LfQtNCw0L3QuNGPINC/0YDQvtCz0YDQsNC80LzRiyBXZWJHTC4gJyArIHRoaXMuZ2wuZ2V0UHJvZ3JhbUluZm9Mb2codGhpcy5ncHVQcm9ncmFtKSlcbiAgICB9XG5cbiAgICB0aGlzLmdsLnVzZVByb2dyYW0odGhpcy5ncHVQcm9ncmFtKVxuICB9XG5cbiAgLyoqXG4gICAqINCj0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdGCINGB0LLRj9C30Ywg0L/QtdGA0LXQvNC10L3QvdC+0Lkg0L/RgNC40LvQvtC20LXQvdC40Y8g0YEg0L/RgNC+0LPRgNCw0LzQvNC+0LkgV2ViR2wuXG4gICAqXG4gICAqIEBwYXJhbSB2YXJUeXBlINCi0LjQvyDQv9C10YDQtdC80LXQvdC90L7QuS5cbiAgICogQHBhcmFtIHZhck5hbWUg0JjQvNGPINC/0LXRgNC10LzQtdC90L3QvtC5LlxuICAgKi9cbiAgcHJvdGVjdGVkIHNldFdlYkdsVmFyaWFibGUodmFyVHlwZTogV2ViR2xWYXJpYWJsZVR5cGUsIHZhck5hbWU6IHN0cmluZyk6IHZvaWQge1xuICAgIGlmICh2YXJUeXBlID09PSAndW5pZm9ybScpIHtcbiAgICAgIHRoaXMudmFyaWFibGVzW3Zhck5hbWVdID0gdGhpcy5nbC5nZXRVbmlmb3JtTG9jYXRpb24odGhpcy5ncHVQcm9ncmFtLCB2YXJOYW1lKVxuICAgIH0gZWxzZSBpZiAodmFyVHlwZSA9PT0gJ2F0dHJpYnV0ZScpIHtcbiAgICAgIHRoaXMudmFyaWFibGVzW3Zhck5hbWVdID0gdGhpcy5nbC5nZXRBdHRyaWJMb2NhdGlvbih0aGlzLmdwdVByb2dyYW0sIHZhck5hbWUpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqINCh0L7Qt9C00LDQtdGCINC4INC30LDQv9C+0LvQvdGP0LXRgiDQtNCw0L3QvdGL0LzQuCDQvtCx0L4g0LLRgdC10YUg0L/QvtC70LjQs9C+0L3QsNGFINCx0YPRhNC10YDRiyBXZWJHTC5cbiAgICovXG4gIHByb3RlY3RlZCBjcmVhdGVXYkdsQnVmZmVycygpOiB2b2lkIHtcblxuICAgIC8vINCS0YvQstC+0LQg0L7RgtC70LDQtNC+0YfQvdC+0Lkg0LjQvdGE0L7RgNC80LDRhtC40LguXG4gICAgaWYgKHRoaXMuZGVidWdNb2RlLmlzRW5hYmxlKSB7XG4gICAgICBjb25zb2xlLmxvZygnJWPQl9Cw0L/Rg9GJ0LXQvSDQv9GA0L7RhtC10YHRgSDQt9Cw0LPRgNGD0LfQutC4INC00LDQvdC90YvRhSBbJyArIHRoaXMuZ2V0Q3VycmVudFRpbWUoKSArICddLi4uJywgdGhpcy5kZWJ1Z01vZGUuZ3JvdXBTdHlsZSlcblxuICAgICAgLy8g0JfQsNC/0YPRgdC6INC60L7QvdGB0L7Qu9GM0L3QvtCz0L4g0YLQsNC50LzQtdGA0LAsINC40LfQvNC10YDRj9GO0YnQtdCz0L4g0LTQu9C40YLQtdC70YzQvdC+0YHRgtGMINC/0YDQvtGG0LXRgdGB0LAg0LfQsNCz0YDRg9C30LrQuCDQtNCw0L3QvdGL0YUg0LIg0LLQuNC00LXQvtC/0LDQvNGP0YLRjC5cbiAgICAgIGNvbnNvbGUudGltZSgn0JTQu9C40YLQtdC70YzQvdC+0YHRgtGMJylcbiAgICB9XG5cbiAgICBsZXQgcG9seWdvbkdyb3VwOiBTUGxvdFBvbHlnb25Hcm91cCB8IG51bGxcblxuICAgIC8vINCY0YLQtdGA0LjRgNC+0LLQsNC90LjQtSDQs9GA0YPQv9C/INC/0L7Qu9C40LPQvtC90L7Qsi5cbiAgICB3aGlsZSAocG9seWdvbkdyb3VwID0gdGhpcy5jcmVhdGVQb2x5Z29uR3JvdXAoKSkge1xuXG4gICAgICAvLyDQodC+0LfQtNCw0L3QuNC1INC4INC30LDQv9C+0LvQvdC10L3QuNC1INCx0YPRhNC10YDQvtCyINC00LDQvdC90YvQvNC4INC+INGC0LXQutGD0YnQtdC5INCz0YDRg9C/0L/QtSDQv9C+0LvQuNCz0L7QvdC+0LIuXG4gICAgICB0aGlzLmFkZFdiR2xCdWZmZXIodGhpcy5idWZmZXJzLnZlcnRleEJ1ZmZlcnMsICdBUlJBWV9CVUZGRVInLCBuZXcgRmxvYXQzMkFycmF5KHBvbHlnb25Hcm91cC52ZXJ0aWNlcyksIDApXG4gICAgICB0aGlzLmFkZFdiR2xCdWZmZXIodGhpcy5idWZmZXJzLmNvbG9yQnVmZmVycywgJ0FSUkFZX0JVRkZFUicsIG5ldyBVaW50OEFycmF5KHBvbHlnb25Hcm91cC5jb2xvcnMpLCAxKVxuICAgICAgdGhpcy5hZGRXYkdsQnVmZmVyKHRoaXMuYnVmZmVycy5pbmRleEJ1ZmZlcnMsICdFTEVNRU5UX0FSUkFZX0JVRkZFUicsIG5ldyBVaW50MTZBcnJheShwb2x5Z29uR3JvdXAuaW5kaWNlcyksIDIpXG5cbiAgICAgIC8vINCh0YfQtdGC0YfQuNC6INC60L7Qu9C40YfQtdGB0YLQstCwINCx0YPRhNC10YDQvtCyLlxuICAgICAgdGhpcy5idWZmZXJzLmFtb3VudE9mQnVmZmVyR3JvdXBzKytcblxuICAgICAgLy8g0KHRh9C10YLRh9C40Log0LrQvtC70LjRh9C10YHRgtCy0LAg0LLQtdGA0YjQuNC9IEdMLdGC0YDQtdGD0LPQvtC70YzQvdC40LrQvtCyINGC0LXQutGD0YnQtdC5INCz0YDRg9C/0L/RiyDQsdGD0YTQtdGA0L7Qsi5cbiAgICAgIHRoaXMuYnVmZmVycy5hbW91bnRPZkdMVmVydGljZXMucHVzaChwb2x5Z29uR3JvdXAuYW1vdW50T2ZHTFZlcnRpY2VzKVxuXG4gICAgICAvLyDQodGH0LXRgtGH0LjQuiDQvtCx0YnQtdCz0L4g0LrQvtC70LjRh9C10YHRgtCy0LAg0LLQtdGA0YjQuNC9IEdMLdGC0YDQtdGD0LPQvtC70YzQvdC40LrQvtCyLlxuICAgICAgdGhpcy5idWZmZXJzLmFtb3VudE9mVG90YWxHTFZlcnRpY2VzICs9IHBvbHlnb25Hcm91cC5hbW91bnRPZkdMVmVydGljZXNcbiAgICB9XG5cbiAgICAvLyDQktGL0LLQvtC0INC+0YLQu9Cw0LTQvtGH0L3QvtC5INC40L3RhNC+0YDQvNCw0YbQuNC4LlxuICAgIGlmICh0aGlzLmRlYnVnTW9kZS5pc0VuYWJsZSkge1xuICAgICAgdGhpcy5yZXBvcnRBYm91dE9iamVjdFJlYWRpbmcoKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDQodGH0LjRgtGL0LLQsNC10YIg0LTQsNC90L3Ri9C1INC+0LEg0LjRgdGF0L7QtNC90YvRhSDQvtCx0YrQtdC60YLQsNGFINC4INGE0L7RgNC80LjRgNGD0LXRgiDRgdC+0L7RgtCy0LXRgtGB0LLRg9GO0YnRg9GOINGN0YLQuNC8INC+0LHRitC10LrRgtCw0Lwg0LPRgNGD0L/Qv9GDINC/0L7Qu9C40LPQvtC90L7Qsi5cbiAgICpcbiAgICogQHJlbWFya3NcbiAgICog0JPRgNGD0L/Qv9CwINGE0L7RgNC80LjRgNGD0LXRgtGB0Y8g0YEg0YPRh9C10YLQvtC8INGC0LXRhdC90LjRh9C10YHQutC+0LPQviDQvtCz0YDQsNC90LjRh9C10L3QuNGPINC90LAg0LrQvtC70LjRh9C10YHRgtCy0L4g0LLQtdGA0YjQuNC9INCyINCz0YDRg9C/0L/QtSDQuCDQu9C40LzQuNGC0LAg0L3QsCDQvtCx0YnQtdC1INC60L7Qu9C40YfQtdGB0YLQstC+XG4gICAqINC/0L7Qu9C40LPQvtC90L7QsiDQvdCwINC60LDQvdCy0LDRgdC1LlxuICAgKlxuICAgKiBAcmV0dXJucyDQodC+0LfQtNCw0L3QvdCw0Y8g0LPRgNGD0L/Qv9CwINC/0L7Qu9C40LPQvtC90L7QsiDQuNC70LggbnVsbCwg0LXRgdC70Lgg0YTQvtGA0LzQuNGA0L7QstCw0L3QuNC1INCy0YHQtdGFINCz0YDRg9C/0L8g0L/QvtC70LjQs9C+0L3QvtCyINC30LDQstC10YDRiNC40LvQvtGB0YwuXG4gICAqL1xuICBwcm90ZWN0ZWQgY3JlYXRlUG9seWdvbkdyb3VwKCk6IFNQbG90UG9seWdvbkdyb3VwIHwgbnVsbCB7XG5cbiAgICBsZXQgcG9seWdvbkdyb3VwOiBTUGxvdFBvbHlnb25Hcm91cCA9IHtcbiAgICAgIHZlcnRpY2VzOiBbXSxcbiAgICAgIGluZGljZXM6IFtdLFxuICAgICAgY29sb3JzOiBbXSxcbiAgICAgIGFtb3VudE9mVmVydGljZXM6IDAsXG4gICAgICBhbW91bnRPZkdMVmVydGljZXM6IDBcbiAgICB9XG5cbiAgICBsZXQgcG9seWdvbjogU1Bsb3RQb2x5Z29uIHwgbnVsbFxuXG4gICAgLyoqXG4gICAgICog0JXRgdC70Lgg0LrQvtC70LjRh9C10YHRgtCy0L4g0L/QvtC70LjQs9C+0L3QvtCyINC60LDQvdCy0LDRgdCwINC00L7RgdGC0LjQs9C70L4g0LTQvtC/0YPRgdGC0LjQvNC+0LPQviDQvNCw0LrRgdC40LzRg9C80LAsINGC0L4g0LTQsNC70YzQvdC10LnRiNCw0Y8g0L7QsdGA0LDQsdC+0YLQutCwINC40YHRhdC+0LTQvdGL0YUg0L7QsdGK0LXQutGC0L7QslxuICAgICAqINC/0YDQuNC+0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdGC0YHRjyAtINGE0L7RgNC80LjRgNC+0LLQsNC90LjQtSDQs9GA0YPQv9C/INC/0L7Qu9C40LPQvtC90L7QsiDQt9Cw0LLQtdGA0YjQsNC10YLRgdGPINCy0L7Qt9Cy0YDQsNGC0L7QvCDQt9C90LDRh9C10L3QuNGPIG51bGwgKNGB0LjQvNGD0LvRj9GG0LjRjyDQtNC+0YHRgtC40LbQtdC90LjRj1xuICAgICAqINC/0L7RgdC70LXQtNC90LXQs9C+INC+0LHRgNCw0LHQsNGC0YvQstCw0LXQvNC+0LPQviDQuNGB0YXQvtC00L3QvtCz0L4g0L7QsdGK0LXQutGC0LApLlxuICAgICAqL1xuICAgIGlmICh0aGlzLmFtb3VudE9mUG9seWdvbnMgPj0gdGhpcy5tYXhBbW91bnRPZlBvbHlnb25zKSByZXR1cm4gbnVsbFxuXG4gICAgLy8g0JjRgtC10YDQuNGA0L7QstCw0L3QuNC1INC40YHRhdC+0LTQvdGL0YUg0L7QsdGK0LXQutGC0L7Qsi5cbiAgICB3aGlsZSAocG9seWdvbiA9IHRoaXMuaXRlcmF0aW9uQ2FsbGJhY2shKCkpIHtcblxuICAgICAgLy8g0JTQvtCx0LDQstC70LXQvdC40LUg0LIg0LPRgNGD0L/Qv9GDINC/0L7Qu9C40LPQvtC90L7QsiDQvdC+0LLQvtCz0L4g0L/QvtC70LjQs9C+0L3QsC5cbiAgICAgIHRoaXMuYWRkUG9seWdvbihwb2x5Z29uR3JvdXAsIHBvbHlnb24pXG5cbiAgICAgIC8vINCh0YfQtdGC0YfQuNC6INGH0LjRgdC70LAg0L/RgNC40LzQtdC90LXQvdC40Lkg0LrQsNC20LTQvtC5INC40Lcg0YTQvtGA0Lwg0L/QvtC70LjQs9C+0L3QvtCyLlxuICAgICAgdGhpcy5idWZmZXJzLmFtb3VudE9mU2hhcGVzW3BvbHlnb24uc2hhcGVdKytcblxuICAgICAgLy8g0KHRh9C10YLRh9C40Log0L7QsdGJ0LXQs9C+INC60L7Qu9C40YfQtdGB0YLQstC+INC/0L7Qu9C40LPQvtC90L7Qsi5cbiAgICAgIHRoaXMuYW1vdW50T2ZQb2x5Z29ucysrXG5cbiAgICAgIC8qKlxuICAgICAgICog0JXRgdC70Lgg0LrQvtC70LjRh9C10YHRgtCy0L4g0L/QvtC70LjQs9C+0L3QvtCyINC60LDQvdCy0LDRgdCwINC00L7RgdGC0LjQs9C70L4g0LTQvtC/0YPRgdGC0LjQvNC+0LPQviDQvNCw0LrRgdC40LzRg9C80LAsINGC0L4g0LTQsNC70YzQvdC10LnRiNCw0Y8g0L7QsdGA0LDQsdC+0YLQutCwINC40YHRhdC+0LTQvdGL0YUg0L7QsdGK0LXQutGC0L7QslxuICAgICAgICog0L/RgNC40L7RgdGC0LDQvdCw0LLQu9C40LLQsNC10YLRgdGPIC0g0YTQvtGA0LzQuNGA0L7QstCw0L3QuNC1INCz0YDRg9C/0L8g0L/QvtC70LjQs9C+0L3QvtCyINC30LDQstC10YDRiNCw0LXRgtGB0Y8g0LLQvtC30LLRgNCw0YLQvtC8INC30L3QsNGH0LXQvdC40Y8gbnVsbCAo0YHQuNC80YPQu9GP0YbQuNGPINC00L7RgdGC0LjQttC10L3QuNGPXG4gICAgICAgKiDQv9C+0YHQu9C10LTQvdC10LPQviDQvtCx0YDQsNCx0LDRgtGL0LLQsNC10LzQvtCz0L4g0LjRgdGF0L7QtNC90L7Qs9C+INC+0LHRitC10LrRgtCwKS5cbiAgICAgICAqL1xuICAgICAgaWYgKHRoaXMuYW1vdW50T2ZQb2x5Z29ucyA+PSB0aGlzLm1heEFtb3VudE9mUG9seWdvbnMpIGJyZWFrXG5cbiAgICAgIC8qKlxuICAgICAgICog0JXRgdC70Lgg0L7QsdGJ0LXQtSDQutC+0LvQuNGH0LXRgdGC0LLQviDQstGB0LXRhSDQstC10YDRiNC40L0g0LIg0LPRgNGD0L/Qv9C1INC/0L7Qu9C40LPQvtC90L7QsiDQv9GA0LXQstGL0YHQuNC70L4g0YLQtdGF0L3QuNGH0LXRgdC60L7QtSDQvtCz0YDQsNC90LjRh9C10L3QuNC1LCDRgtC+INCz0YDRg9C/0L/QsCDQv9C+0LvQuNCz0L7QvdC+0LJcbiAgICAgICAqINGB0YfQuNGC0LDQtdGC0YHRjyDRgdGE0L7RgNC80LjRgNC+0LLQsNC90L3QvtC5INC4INC40YLQtdGA0LjRgNC+0LLQsNC90LjQtSDQuNGB0YXQvtC00L3Ri9GFINC+0LHRitC10LrRgtC+0LIg0L/RgNC40L7RgdGC0LDQvdCw0LLQu9C40LLQsNC10YLRgdGPLlxuICAgICAgICovXG4gICAgICBpZiAocG9seWdvbkdyb3VwLmFtb3VudE9mVmVydGljZXMgPj0gdGhpcy5tYXhBbW91bnRPZlZlcnRleFBlclBvbHlnb25Hcm91cCkgYnJlYWtcbiAgICB9XG5cbiAgICAvLyDQodGH0LXRgtGH0LjQuiDQvtCx0YnQtdCz0L4g0LrQvtC70LjRh9C10YHRgtCy0LAg0LLQtdGA0YjQuNC9INCy0YHQtdGFINCy0LXRgNGI0LjQvdC90YvRhSDQsdGD0YTQtdGA0L7Qsi5cbiAgICB0aGlzLmJ1ZmZlcnMuYW1vdW50T2ZUb3RhbFZlcnRpY2VzICs9IHBvbHlnb25Hcm91cC5hbW91bnRPZlZlcnRpY2VzXG5cbiAgICAvLyDQldGB0LvQuCDQs9GA0YPQv9C/0LAg0L/QvtC70LjQs9C+0L3QvtCyINC90LXQv9GD0YHRgtCw0Y8sINGC0L4g0LLQvtC30LLRgNCw0YnQsNC10Lwg0LXQtS4g0JXRgdC70Lgg0L/Rg9GB0YLQsNGPIC0g0LLQvtC30LLRgNCw0YnQsNC10LwgbnVsbC5cbiAgICByZXR1cm4gKHBvbHlnb25Hcm91cC5hbW91bnRPZlZlcnRpY2VzID4gMCkgPyBwb2x5Z29uR3JvdXAgOiBudWxsXG4gIH1cblxuICAvKipcbiAgICog0KHQvtC30LTQsNC10YIg0LIg0LzQsNGB0YHQuNCy0LUg0LHRg9GE0LXRgNC+0LIgV2ViR0wg0L3QvtCy0YvQuSDQsdGD0YTQtdGAINC4INC30LDQv9C40YHRi9Cy0LDQtdGCINCyINC90LXQs9C+INC/0LXRgNC10LTQsNC90L3Ri9C1INC00LDQvdC90YvQtS5cbiAgICpcbiAgICogQHBhcmFtIGJ1ZmZlcnMgLSDQnNCw0YHRgdC40LIg0LHRg9GE0LXRgNC+0LIgV2ViR0wsINCyINC60L7RgtC+0YDRi9C5INCx0YPQtNC10YIg0LTQvtCx0LDQstC70LXQvSDRgdC+0LfQtNCw0LLQsNC10LzRi9C5INCx0YPRhNC10YAuXG4gICAqIEBwYXJhbSB0eXBlIC0g0KLQuNC/INGB0L7Qt9C00LDQstCw0LXQvNC+0LPQviDQsdGD0YTQtdGA0LAuXG4gICAqIEBwYXJhbSBkYXRhIC0g0JTQsNC90L3Ri9C1INCyINCy0LjQtNC1INGC0LjQv9C40LfQuNGA0L7QstCw0L3QvdC+0LPQviDQvNCw0YHRgdC40LLQsCDQtNC70Y8g0LfQsNC/0LjRgdC4INCyINGB0L7Qt9C00LDQstCw0LXQvNGL0Lkg0LHRg9GE0LXRgC5cbiAgICogQHBhcmFtIGtleSAtINCa0LvRjtGHICjQuNC90LTQtdC60YEpLCDQuNC00LXQvdGC0LjRhNC40YbQuNGA0YPRjtGJ0LjQuSDRgtC40L8g0LHRg9GE0LXRgNCwICjQtNC70Y8g0LLQtdGA0YjQuNC9LCDQtNC70Y8g0YbQstC10YLQvtCyLCDQtNC70Y8g0LjQvdC00LXQutGB0L7QsikuINCY0YHQv9C+0LvRjNC30YPQtdGC0YHRjyDQtNC70Y9cbiAgICogICAgINGA0LDQt9C00LXQu9GM0L3QvtCz0L4g0L/QvtC00YHRh9C10YLQsCDQv9Cw0LzRj9GC0LgsINC30LDQvdC40LzQsNC10LzQvtC5INC60LDQttC00YvQvCDRgtC40L/QvtC8INCx0YPRhNC10YDQsC5cbiAgICovXG4gIHByb3RlY3RlZCBhZGRXYkdsQnVmZmVyKGJ1ZmZlcnM6IFdlYkdMQnVmZmVyW10sIHR5cGU6IFdlYkdsQnVmZmVyVHlwZSwgZGF0YTogVHlwZWRBcnJheSwga2V5OiBudW1iZXIpOiB2b2lkIHtcblxuICAgIC8vINCe0L/RgNC10LTQtdC70LXQvdC40LUg0LjQvdC00LXQutGB0LAg0L3QvtCy0L7Qs9C+INGN0LvQtdC80LXQvdGC0LAg0LIg0LzQsNGB0YHQuNCy0LUg0LHRg9GE0LXRgNC+0LIgV2ViR0wuXG4gICAgY29uc3QgaW5kZXggPSB0aGlzLmJ1ZmZlcnMuYW1vdW50T2ZCdWZmZXJHcm91cHNcblxuICAgIC8vINCh0L7Qt9C00LDQvdC40LUg0Lgg0LfQsNC/0L7Qu9C90LXQvdC40LUg0LTQsNC90L3Ri9C80Lgg0L3QvtCy0L7Qs9C+INCx0YPRhNC10YDQsC5cbiAgICBidWZmZXJzW2luZGV4XSA9IHRoaXMuZ2wuY3JlYXRlQnVmZmVyKCkhXG4gICAgdGhpcy5nbC5iaW5kQnVmZmVyKHRoaXMuZ2xbdHlwZV0sIGJ1ZmZlcnNbaW5kZXhdKVxuICAgIHRoaXMuZ2wuYnVmZmVyRGF0YSh0aGlzLmdsW3R5cGVdLCBkYXRhLCB0aGlzLmdsLlNUQVRJQ19EUkFXKVxuXG4gICAgLy8g0KHRh9C10YLRh9C40Log0L/QsNC80Y/RgtC4LCDQt9Cw0L3QuNC80LDQtdC80L7QuSDQsdGD0YTQtdGA0LDQvNC4INC00LDQvdC90YvRhSAo0YDQsNC30LTQtdC70YzQvdC+INC/0L4g0LrQsNC20LTQvtC80YMg0YLQuNC/0YMg0LHRg9GE0LXRgNC+0LIpXG4gICAgdGhpcy5idWZmZXJzLnNpemVJbkJ5dGVzW2tleV0gKz0gZGF0YS5sZW5ndGggKiBkYXRhLkJZVEVTX1BFUl9FTEVNRU5UXG4gIH1cblxuICAvKipcbiAgICog0JLRi9GH0LjRgdC70Y/QtdGCINC60L7QvtGA0LTQuNC90LDRgtGLINCy0LXRgNGI0LjQvSDQv9C+0LvQuNCz0L7QvdCwINGC0YDQtdGD0LPQvtC70YzQvdC+0Lkg0YTQvtGA0LzRiy5cbiAgICog0KLQuNC/INGE0YPQvdC60YbQuNC4OiB7QGxpbmsgU1Bsb3RDYWxjU2hhcGVGdW5jfVxuICAgKlxuICAgKiBAcGFyYW0geCAtINCf0L7Qu9C+0LbQtdC90LjQtSDRhtC10L3RgtGA0LAg0L/QvtC70LjQs9C+0L3QsCDQvdCwINC+0YHQuCDQsNCx0YHRhtC40YHRgS5cbiAgICogQHBhcmFtIHkgLSDQn9C+0LvQvtC20LXQvdC40LUg0YbQtdC90YLRgNCwINC/0L7Qu9C40LPQvtC90LAg0L3QsCDQvtGB0Lgg0L7RgNC00LjQvdCw0YIuXG4gICAqIEBwYXJhbSBjb25zdHMgLSDQndCw0LHQvtGAINCy0YHQv9C+0LzQvtCz0LDRgtC10LvRjNC90YvRhSDQutC+0L3RgdGC0LDQvdGCLCDQuNGB0L/QvtC70YzQt9GD0LXQvNGL0YUg0LTQu9GPINCy0YvRh9C40YHQu9C10L3QuNGPINCy0LXRgNGI0LjQvS5cbiAgICogQHJldHVybnMg0JTQsNC90L3Ri9C1INC+INCy0LXRgNGI0LjQvdCw0YUg0L/QvtC70LjQs9C+0L3QsC5cbiAgICovXG4gIHByb3RlY3RlZCBnZXRWZXJ0aWNlc09mVHJpYW5nbGUoeDogbnVtYmVyLCB5OiBudW1iZXIsIGNvbnN0czogYW55W10pOiBTUGxvdFBvbHlnb25WZXJ0aWNlcyB7XG5cbiAgICBjb25zdCBbeDEsIHkxXSA9IFt4IC0gY29uc3RzWzBdLCB5ICsgY29uc3RzWzJdXVxuICAgIGNvbnN0IFt4MiwgeTJdID0gW3gsIHkgLSBjb25zdHNbMV1dXG4gICAgY29uc3QgW3gzLCB5M10gPSBbeCArIGNvbnN0c1swXSwgeSArIGNvbnN0c1syXV1cblxuICAgIGNvbnN0IHZlcnRpY2VzID0ge1xuICAgICAgdmFsdWVzOiBbeDEsIHkxLCB4MiwgeTIsIHgzLCB5M10sXG4gICAgICBpbmRpY2VzOiBbMCwgMSwgMl1cbiAgICB9XG5cbiAgICByZXR1cm4gdmVydGljZXNcbiAgfVxuXG4gIC8qKlxuICAgKiDQktGL0YfQuNGB0LvRj9C10YIg0LrQvtC+0YDQtNC40L3QsNGC0Ysg0LLQtdGA0YjQuNC9INC/0L7Qu9C40LPQvtC90LAg0LrQstCw0LTRgNCw0YLQvdC+0Lkg0YTQvtGA0LzRiy5cbiAgICog0KLQuNC/INGE0YPQvdC60YbQuNC4OiB7QGxpbmsgU1Bsb3RDYWxjU2hhcGVGdW5jfVxuICAgKlxuICAgKiBAcGFyYW0geCAtINCf0L7Qu9C+0LbQtdC90LjQtSDRhtC10L3RgtGA0LAg0L/QvtC70LjQs9C+0L3QsCDQvdCwINC+0YHQuCDQsNCx0YHRhtC40YHRgS5cbiAgICogQHBhcmFtIHkgLSDQn9C+0LvQvtC20LXQvdC40LUg0YbQtdC90YLRgNCwINC/0L7Qu9C40LPQvtC90LAg0L3QsCDQvtGB0Lgg0L7RgNC00LjQvdCw0YIuXG4gICAqIEBwYXJhbSBjb25zdHMgLSDQndCw0LHQvtGAINCy0YHQv9C+0LzQvtCz0LDRgtC10LvRjNC90YvRhSDQutC+0L3RgdGC0LDQvdGCLCDQuNGB0L/QvtC70YzQt9GD0LXQvNGL0YUg0LTQu9GPINCy0YvRh9C40YHQu9C10L3QuNGPINCy0LXRgNGI0LjQvS5cbiAgICogQHJldHVybnMg0JTQsNC90L3Ri9C1INC+INCy0LXRgNGI0LjQvdCw0YUg0L/QvtC70LjQs9C+0L3QsC5cbiAgICovXG4gIHByb3RlY3RlZCBnZXRWZXJ0aWNlc09mU3F1YXJlKHg6IG51bWJlciwgeTogbnVtYmVyLCBjb25zdHM6IGFueVtdKTogU1Bsb3RQb2x5Z29uVmVydGljZXMge1xuXG4gICAgY29uc3QgW3gxLCB5MV0gPSBbeCAtIGNvbnN0c1swXSwgeSAtIGNvbnN0c1swXV1cbiAgICBjb25zdCBbeDIsIHkyXSA9IFt4ICsgY29uc3RzWzBdLCB5ICsgY29uc3RzWzBdXVxuXG4gICAgY29uc3QgdmVydGljZXMgPSB7XG4gICAgICB2YWx1ZXM6IFt4MSwgeTEsIHgyLCB5MSwgeDIsIHkyLCB4MSwgeTJdLFxuICAgICAgaW5kaWNlczogWzAsIDEsIDIsIDAsIDIsIDNdXG4gICAgfVxuXG4gICAgcmV0dXJuIHZlcnRpY2VzXG4gIH1cblxuICAvKipcbiAgICog0JLRi9GH0LjRgdC70Y/QtdGCINC60L7QvtGA0LTQuNC90LDRgtGLINCy0LXRgNGI0LjQvSDQv9C+0LvQuNCz0L7QvdCwINC60YDRg9Cz0LvQvtC5INGE0L7RgNC80YsuXG4gICAqINCi0LjQvyDRhNGD0L3QutGG0LjQuDoge0BsaW5rIFNQbG90Q2FsY1NoYXBlRnVuY31cbiAgICpcbiAgICogQHBhcmFtIHggLSDQn9C+0LvQvtC20LXQvdC40LUg0YbQtdC90YLRgNCwINC/0L7Qu9C40LPQvtC90LAg0L3QsCDQvtGB0Lgg0LDQsdGB0YbQuNGB0YEuXG4gICAqIEBwYXJhbSB5IC0g0J/QvtC70L7QttC10L3QuNC1INGG0LXQvdGC0YDQsCDQv9C+0LvQuNCz0L7QvdCwINC90LAg0L7RgdC4INC+0YDQtNC40L3QsNGCLlxuICAgKiBAcGFyYW0gY29uc3RzIC0g0J3QsNCx0L7RgCDQstGB0L/QvtC80L7Qs9Cw0YLQtdC70YzQvdGL0YUg0LrQvtC90YHRgtCw0L3Rgiwg0LjRgdC/0L7Qu9GM0LfRg9C10LzRi9GFINC00LvRjyDQstGL0YfQuNGB0LvQtdC90LjRjyDQstC10YDRiNC40L0uXG4gICAqIEByZXR1cm5zINCU0LDQvdC90YvQtSDQviDQstC10YDRiNC40L3QsNGFINC/0L7Qu9C40LPQvtC90LAuXG4gICAqL1xuICBwcm90ZWN0ZWQgZ2V0VmVydGljZXNPZkNpcmNsZSh4OiBudW1iZXIsIHk6IG51bWJlciwgY29uc3RzOiBhbnlbXSk6IFNQbG90UG9seWdvblZlcnRpY2VzIHtcblxuICAgIC8vINCX0LDQvdC10YHQtdC90LjQtSDQsiDQvdCw0LHQvtGAINCy0LXRgNGI0LjQvSDRhtC10L3RgtGA0LAg0LrRgNGD0LPQsC5cbiAgICBjb25zdCB2ZXJ0aWNlczogU1Bsb3RQb2x5Z29uVmVydGljZXMgPSB7XG4gICAgICB2YWx1ZXM6IFt4LCB5XSxcbiAgICAgIGluZGljZXM6IFtdXG4gICAgfVxuXG4gICAgLy8g0JTQvtCx0LDQstC70LXQvdC40LUg0LDQv9GA0L7QutGB0LjQvNC40YDRg9GO0YnQuNGFINC+0LrRgNGD0LbQvdC+0YHRgtGMINC60YDRg9Cz0LAg0LLQtdGA0YjQuNC9LlxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29uc3RzWzNdLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2ZXJ0aWNlcy52YWx1ZXMucHVzaCh4ICsgY29uc3RzWzNdW2ldLCB5ICsgY29uc3RzWzRdW2ldKVxuICAgICAgdmVydGljZXMuaW5kaWNlcy5wdXNoKDAsIGkgKyAxLCBpICsgMilcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDQn9C+0YHQu9C10LTQvdGP0Y8g0LLQtdGA0YjQuNC90LAg0L/QvtGB0LvQtdC00L3QtdCz0L4gR0wt0YLRgNC10YPQs9C+0LvRjNC90LjQutCwINC30LDQvNC10L3Rj9C10YLRgdGPINC90LAg0L/QtdGA0LLRg9GOINCw0L/RgNC+0LrRgdC40LzQuNGA0YPRjtGJ0YPRjlxuICAgICAqINC+0LrRgNGD0LbQvdC+0YHRgtGMINC60YDRg9Cz0LAg0LLQtdGA0YjQuNC90YMsINC30LDQvNGL0LrQsNGPINCw0L/RgNC+0LrRgdC40LzQuNGA0YPRidC40Lkg0LrRgNGD0LMg0L/QvtC70LjQs9C+0L0uXG4gICAgICovXG4gICAgdmVydGljZXMuaW5kaWNlc1t2ZXJ0aWNlcy5pbmRpY2VzLmxlbmd0aCAtIDFdID0gMVxuXG4gICAgcmV0dXJuIHZlcnRpY2VzXG4gIH1cblxuICAvKipcbiAgICog0KHQvtC30LTQsNC10YIg0Lgg0LTQvtCx0LDQstC70Y/QtdGCINCyINCz0YDRg9C/0L/RgyDQv9C+0LvQuNCz0L7QvdC+0LIg0L3QvtCy0YvQuSDQv9C+0LvQuNCz0L7QvS5cbiAgICpcbiAgICogQHBhcmFtIHBvbHlnb25Hcm91cCAtINCT0YDRg9C/0L/QsCDQv9C+0LvQuNCz0L7QvdC+0LIsINCyINC60L7RgtC+0YDRg9GOINC/0YDQvtC40YHRhdC+0LTQuNGCINC00L7QsdCw0LLQu9C10L3QuNC1LlxuICAgKiBAcGFyYW0gcG9seWdvbiAtINCY0L3RhNC+0YDQvNCw0YbQuNGPINC+INC00L7QsdCw0LLQu9GP0LXQvNC+0Lwg0L/QvtC70LjQs9C+0L3QtS5cbiAgICovXG4gIHByb3RlY3RlZCBhZGRQb2x5Z29uKHBvbHlnb25Hcm91cDogU1Bsb3RQb2x5Z29uR3JvdXAsIHBvbHlnb246IFNQbG90UG9seWdvbik6IHZvaWQge1xuXG4gICAgLyoqXG4gICAgICog0JIg0LfQsNCy0LjRgdC40LzQvtGB0YLQuCDQvtGCINGE0L7RgNC80Ysg0L/QvtC70LjQs9C+0L3QsCDQuCDQutC+0L7RgNC00LjQvdCw0YIg0LXQs9C+INGG0LXQvdGC0YDQsCDQstGL0LfRi9Cy0LDQtdGC0YHRjyDRgdC+0L7RgtCy0LXRgtGB0LLRg9GO0YnQsNGPINGE0YPQvdC60YbQuNGPINC90LDRhdC+0LbQtNC10L3QuNGPINC60L7QvtGA0LTQuNC90LDRgiDQtdCz0L5cbiAgICAgKiDQstC10YDRiNC40L0uXG4gICAgICovXG4gICAgY29uc3QgdmVydGljZXMgPSB0aGlzLnNoYXBlc1twb2x5Z29uLnNoYXBlXS5jYWxjKFxuICAgICAgcG9seWdvbi54LCBwb2x5Z29uLnksIHRoaXMuVVNFRlVMX0NPTlNUU1xuICAgIClcblxuICAgIC8vINCa0L7Qu9C40YfQtdGB0YLQstC+INCy0LXRgNGI0LjQvSAtINGN0YLQviDQutC+0LvQuNGH0LXRgdGC0LLQviDQv9Cw0YAg0YfQuNGB0LXQuyDQsiDQvNCw0YHRgdC40LLQtSDQstC10YDRiNC40L0uXG4gICAgY29uc3QgYW1vdW50T2ZWZXJ0aWNlcyA9IE1hdGgudHJ1bmModmVydGljZXMudmFsdWVzLmxlbmd0aCAvIDIpXG5cbiAgICAvLyDQndCw0YXQvtC20LTQtdC90LjQtSDQuNC90LTQtdC60YHQsCDQv9C10YDQstC+0Lkg0LTQvtCx0LDQstC70Y/QtdC80L7QuSDQsiDQs9GA0YPQv9C/0YMg0L/QvtC70LjQs9C+0L3QvtCyINCy0LXRgNGI0LjQvdGLLlxuICAgIGNvbnN0IGluZGV4T2ZMYXN0VmVydGV4ID0gcG9seWdvbkdyb3VwLmFtb3VudE9mVmVydGljZXNcblxuICAgIC8qKlxuICAgICAqINCd0L7QvNC10YDQsCDQuNC90LTQtdC60YHQvtCyINCy0LXRgNGI0LjQvSAtINC+0YLQvdC+0YHQuNGC0LXQu9GM0L3Ri9C1LiDQlNC70Y8g0LLRi9GH0LjRgdC70LXQvdC40Y8g0LDQsdGB0L7Qu9GO0YLQvdGL0YUg0LjQvdC00LXQutGB0L7QsiDQvdC10L7QsdGF0L7QtNC40LzQviDQv9GA0LjQsdCw0LLQuNGC0Ywg0Log0L7RgtC90L7RgdC40YLQtdC70YzQvdGL0LxcbiAgICAgKiDQuNC90LTQtdC60YHQsNC8INC40L3QtNC10LrRgSDQv9C10YDQstC+0Lkg0LTQvtCx0LDQstC70Y/QtdC80L7QuSDQsiDQs9GA0YPQv9C/0YMg0L/QvtC70LjQs9C+0L3QvtCyINCy0LXRgNGI0LjQvdGLLlxuICAgICAqL1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmVydGljZXMuaW5kaWNlcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmVydGljZXMuaW5kaWNlc1tpXSArPSBpbmRleE9mTGFzdFZlcnRleFxuICAgIH1cblxuICAgIC8qKlxuICAgICAqINCU0L7QsdCw0LLQu9C10L3QuNC1INCyINCz0YDRg9C/0L/RgyDQv9C+0LvQuNCz0L7QvdC+0LIg0LjQvdC00LXQutGB0L7QsiDQstC10YDRiNC40L0g0L3QvtCy0L7Qs9C+INC/0L7Qu9C40LPQvtC90LAg0Lgg0L/QvtC00YHRh9C10YIg0L7QsdGJ0LXQs9C+INC60L7Qu9C40YfQtdGB0YLQstCwINCy0LXRgNGI0LjQvSBHTC3RgtGA0LXRg9Cz0L7Qu9GM0L3QuNC60L7QslxuICAgICAqINCyINCz0YDRg9C/0L/QtS5cbiAgICAgKi9cbiAgICBwb2x5Z29uR3JvdXAuaW5kaWNlcy5wdXNoKC4uLnZlcnRpY2VzLmluZGljZXMpXG4gICAgcG9seWdvbkdyb3VwLmFtb3VudE9mR0xWZXJ0aWNlcyArPSB2ZXJ0aWNlcy5pbmRpY2VzLmxlbmd0aFxuXG4gICAgLy8g0JTQvtCx0LDQstC70LXQvdC40LUg0LIg0LPRgNGD0L/Qv9GDINC/0L7Qu9C40LPQvtC90L7QsiDQstC10YDRiNC40L0g0L3QvtCy0L7Qs9C+INC/0L7Qu9C40LPQvtC90LAg0Lgg0L/QvtC00YHRh9C10YIg0L7QsdGJ0LXQs9C+INC60L7Qu9C40YfQtdGB0YLQstCwINCy0LXRgNGI0LjQvSDQsiDQs9GA0YPQv9C/0LUuXG4gICAgcG9seWdvbkdyb3VwLnZlcnRpY2VzLnB1c2goLi4udmVydGljZXMudmFsdWVzKVxuICAgIHBvbHlnb25Hcm91cC5hbW91bnRPZlZlcnRpY2VzICs9IGFtb3VudE9mVmVydGljZXNcblxuICAgIC8vINCU0L7QsdCw0LLQu9C10L3QuNC1INGG0LLQtdGC0L7QsiDQstC10YDRiNC40L0gLSDQv9C+INC+0LTQvdC+0LzRgyDRhtCy0LXRgtGDINC90LAg0LrQsNC20LTRg9GOINCy0LXRgNGI0LjQvdGDLlxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYW1vdW50T2ZWZXJ0aWNlczsgaSsrKSB7XG4gICAgICBwb2x5Z29uR3JvdXAuY29sb3JzLnB1c2gocG9seWdvbi5jb2xvcilcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICog0JLRi9Cy0L7QtNC40YIg0LHQsNC30L7QstGD0Y4g0YfQsNGB0YLRjCDQvtGC0LvQsNC00L7Rh9C90L7QuSDQuNC90YTQvtGA0LzQsNGG0LjQuC5cbiAgICpcbiAgICogQHBhcmFtIG9wdGlvbnMgLSDQn9C+0LvRjNC30L7QstCw0YLQtdC70YzRgdC60LjQtSDQvdCw0YHRgtGA0L7QudC60Lgg0Y3QutC30LXQvNC/0LvRj9GA0LAuXG4gICAqL1xuICBwcm90ZWN0ZWQgcmVwb3J0TWFpbkluZm8ob3B0aW9uczogU1Bsb3RPcHRpb25zKTogdm9pZCB7XG5cbiAgICBjb25zb2xlLmxvZygnJWPQktC60LvRjtGH0LXQvSDRgNC10LbQuNC8INC+0YLQu9Cw0LTQutC4ICcgKyB0aGlzLmNvbnN0cnVjdG9yLm5hbWUgKyAnINC90LAg0L7QsdGK0LXQutGC0LUgWyMnICsgdGhpcy5jYW52YXMuaWQgKyAnXScsXG4gICAgICB0aGlzLmRlYnVnTW9kZS5oZWFkZXJTdHlsZSlcblxuICAgIGlmICh0aGlzLmRlbW9Nb2RlLmlzRW5hYmxlKSB7XG4gICAgICBjb25zb2xlLmxvZygnJWPQktC60LvRjtGH0LXQvSDQtNC10LzQvtC90YHRgtGA0LDRhtC40L7QvdC90YvQuSDRgNC10LbQuNC8INC00LDQvdC90YvRhScsIHRoaXMuZGVidWdNb2RlLmdyb3VwU3R5bGUpXG4gICAgfVxuXG4gICAgY29uc29sZS5ncm91cCgnJWPQn9GA0LXQtNGD0L/RgNC10LbQtNC10L3QuNC1JywgdGhpcy5kZWJ1Z01vZGUuZ3JvdXBTdHlsZSlcbiAgICB7XG4gICAgICBjb25zb2xlLmRpcign0J7RgtC60YDRi9GC0LDRjyDQutC+0L3RgdC+0LvRjCDQsdGA0LDRg9C30LXRgNCwINC4INC00YDRg9Cz0LjQtSDQsNC60YLQuNCy0L3Ri9C1INGB0YDQtdC00YHRgtCy0LAg0LrQvtC90YLRgNC+0LvRjyDRgNCw0LfRgNCw0LHQvtGC0LrQuCDRgdGD0YnQtdGB0YLQstC10L3QvdC+INGB0L3QuNC20LDRjtGCINC/0YDQvtC40LfQstC+0LTQuNGC0LXQu9GM0L3QvtGB0YLRjCDQstGL0YHQvtC60L7QvdCw0LPRgNGD0LbQtdC90L3Ri9GFINC/0YDQuNC70L7QttC10L3QuNC5LiDQlNC70Y8g0L7QsdGK0LXQutGC0LjQstC90L7Qs9C+INCw0L3QsNC70LjQt9CwINC/0YDQvtC40LfQstC+0LTQuNGC0LXQu9GM0L3QvtGB0YLQuCDQstGB0LUg0L/QvtC00L7QsdC90YvQtSDRgdGA0LXQtNGB0YLQstCwINC00L7Qu9C20L3RiyDQsdGL0YLRjCDQvtGC0LrQu9GO0YfQtdC90YssINCwINC60L7QvdGB0L7Qu9GMINCx0YDQsNGD0LfQtdGA0LAg0LfQsNC60YDRi9GC0LAuINCd0LXQutC+0YLQvtGA0YvQtSDQtNCw0L3QvdGL0LUg0L7RgtC70LDQtNC+0YfQvdC+0Lkg0LjQvdGE0L7RgNC80LDRhtC40Lgg0LIg0LfQsNCy0LjRgdC40LzQvtGB0YLQuCDQvtGCINC40YHQv9C+0LvRjNC30YPQtdC80L7Qs9C+INCx0YDQsNGD0LfQtdGA0LAg0LzQvtCz0YPRgiDQvdC1INC+0YLQvtCx0YDQsNC20LDRgtGM0YHRjyDQuNC70Lgg0L7RgtC+0LHRgNCw0LbQsNGC0YzRgdGPINC90LXQutC+0YDRgNC10LrRgtC90L4uINCh0YDQtdC00YHRgtCy0L4g0L7RgtC70LDQtNC60Lgg0L/RgNC+0YLQtdGB0YLQuNGA0L7QstCw0L3QviDQsiDQsdGA0LDRg9C30LXRgNC1IEdvb2dsZSBDaHJvbWUgdi45MCcpXG4gICAgfVxuICAgIGNvbnNvbGUuZ3JvdXBFbmQoKVxuXG4gICAgY29uc29sZS5ncm91cCgnJWPQktC40LTQtdC+0YHQuNGB0YLQtdC80LAnLCB0aGlzLmRlYnVnTW9kZS5ncm91cFN0eWxlKVxuICAgIHtcbiAgICAgIGxldCBleHQgPSB0aGlzLmdsLmdldEV4dGVuc2lvbignV0VCR0xfZGVidWdfcmVuZGVyZXJfaW5mbycpXG4gICAgICBsZXQgZ3JhcGhpY3NDYXJkTmFtZSA9IChleHQpID8gdGhpcy5nbC5nZXRQYXJhbWV0ZXIoZXh0LlVOTUFTS0VEX1JFTkRFUkVSX1dFQkdMKSA6ICdb0L3QtdC40LfQstC10YHRgtC90L5dJ1xuICAgICAgY29uc29sZS5sb2coJ9CT0YDQsNGE0LjRh9C10YHQutCw0Y8g0LrQsNGA0YLQsDogJyArIGdyYXBoaWNzQ2FyZE5hbWUpXG4gICAgICBjb25zb2xlLmxvZygn0JLQtdGA0YHQuNGPIEdMOiAnICsgdGhpcy5nbC5nZXRQYXJhbWV0ZXIodGhpcy5nbC5WRVJTSU9OKSlcbiAgICB9XG4gICAgY29uc29sZS5ncm91cEVuZCgpXG5cbiAgICBjb25zb2xlLmdyb3VwKCclY9Cd0LDRgdGC0YDQvtC50LrQsCDQv9Cw0YDQsNC80LXRgtGA0L7QsiDRjdC60LfQtdC80L/Qu9GP0YDQsCcsIHRoaXMuZGVidWdNb2RlLmdyb3VwU3R5bGUpXG4gICAge1xuICAgICAgY29uc29sZS5kaXIodGhpcylcbiAgICAgIGNvbnNvbGUubG9nKCfQn9C+0LvRjNC30L7QstCw0YLQtdC70YzRgdC60LjQtSDQvdCw0YHRgtGA0L7QudC60Lg6XFxuJywganNvblN0cmluZ2lmeShvcHRpb25zKSlcbiAgICAgIGNvbnNvbGUubG9nKCfQmtCw0L3QstCw0YE6ICMnICsgdGhpcy5jYW52YXMuaWQpXG4gICAgICBjb25zb2xlLmxvZygn0KDQsNC30LzQtdGAINC60LDQvdCy0LDRgdCwOiAnICsgdGhpcy5jYW52YXMud2lkdGggKyAnIHggJyArIHRoaXMuY2FudmFzLmhlaWdodCArICcgcHgnKVxuICAgICAgY29uc29sZS5sb2coJ9Cg0LDQt9C80LXRgCDQv9C70L7RgdC60L7RgdGC0Lg6ICcgKyB0aGlzLmdyaWRTaXplLndpZHRoICsgJyB4ICcgKyB0aGlzLmdyaWRTaXplLmhlaWdodCArICcgcHgnKVxuICAgICAgY29uc29sZS5sb2coJ9Cg0LDQt9C80LXRgCDQv9C+0LvQuNCz0L7QvdCwOiAnICsgdGhpcy5wb2x5Z29uU2l6ZSArICcgcHgnKVxuICAgICAgY29uc29sZS5sb2coJ9CQ0L/RgNC+0LrRgdC40LzQsNGG0LjRjyDQvtC60YDRg9C20L3QvtGB0YLQuDogJyArIHRoaXMuY2lyY2xlQXBwcm94TGV2ZWwgKyAnINGD0LPQu9C+0LInKVxuXG4gICAgICAvKipcbiAgICAgICAqIEB0b2RvINCe0LHRgNCw0LHQvtGC0LDRgtGMINGN0YLQvtGCINCy0YvQstC+0LQg0LIg0LfQsNCy0LjRgdC40LzQvtGB0YLQuCDQvtGCINGB0L/QvtGB0L7QsdCwINC/0L7Qu9GD0YfQtdC90LjRjyDQtNCw0L3QvdGL0YUg0L4g0L/QvtC70LjQs9C+0L3QsNGFLiDQktCy0LXRgdGC0Lgg0YLQuNC/0YsgLSDQt9Cw0LTQsNC90L3QsNGPXG4gICAgICAgKiDRhNGD0L3QutGG0LjRjyDQuNGC0LXRgNC40YDQvtCy0LDQvdC40Y8sINC00LXQvNC+LdC40YLQtdGA0LjRgNC+0LLQsNC90LjQtSwg0L/QtdGA0LXQtNCw0L3QvdGL0Lkg0LzQsNGB0YHQuNCyINC00LDQvdC90YvRhS5cbiAgICAgICAqL1xuICAgICAgaWYgKHRoaXMuZGVtb01vZGUuaXNFbmFibGUpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ9Ch0L/QvtGB0L7QsSDQv9C+0LvRg9GH0LXQvdC40Y8g0LTQsNC90L3Ri9GFOiAnICsgJ9C00LXQvNC+0L3RgdGC0YDQsNGG0LjQvtC90L3QsNGPINGE0YPQvdC60YbQuNGPINC40YLQtdGA0LjRgNC+0LLQsNC90LjRjycpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmxvZygn0KHQv9C+0YHQvtCxINC/0L7Qu9GD0YfQtdC90LjRjyDQtNCw0L3QvdGL0YU6ICcgKyAn0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GM0YHQutCw0Y8g0YTRg9C90LrRhtC40Y8g0LjRgtC10YDQuNGA0L7QstCw0L3QuNGPJylcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc29sZS5ncm91cEVuZCgpXG4gIH1cblxuICAvKipcbiAgICog0JLRi9Cy0L7QtNC40YIg0LIg0LrQvtC90YHQvtC70Ywg0L7RgtC70LDQtNC+0YfQvdGD0Y4g0LjQvdGE0L7RgNC80LDRhtC40Y4g0L4g0LfQsNCz0YDRg9C30LrQtSDQtNCw0L3QvdGL0YUg0LIg0LLQuNC00LXQvtC/0LDQvNGP0YLRjC5cbiAgICovXG4gIHByb3RlY3RlZCByZXBvcnRBYm91dE9iamVjdFJlYWRpbmcoKTogdm9pZCB7XG5cbiAgICBjb25zb2xlLmdyb3VwKCclY9CX0LDQs9GA0YPQt9C60LAg0LTQsNC90L3Ri9GFINC30LDQstC10YDRiNC10L3QsCBbJyArIHRoaXMuZ2V0Q3VycmVudFRpbWUoKSArICddJywgdGhpcy5kZWJ1Z01vZGUuZ3JvdXBTdHlsZSlcbiAgICB7XG4gICAgICBjb25zb2xlLnRpbWVFbmQoJ9CU0LvQuNGC0LXQu9GM0L3QvtGB0YLRjCcpXG5cbiAgICAgIGNvbnNvbGUubG9nKCfQoNC10LfRg9C70YzRgtCw0YI6ICcgK1xuICAgICAgICAoKHRoaXMuYW1vdW50T2ZQb2x5Z29ucyA+PSB0aGlzLm1heEFtb3VudE9mUG9seWdvbnMpID8gJ9C00L7RgdGC0LjQs9C90YPRgiDQt9Cw0LTQsNC90L3Ri9C5INC70LjQvNC40YIgKCcgK1xuICAgICAgICAgIHRoaXMubWF4QW1vdW50T2ZQb2x5Z29ucy50b0xvY2FsZVN0cmluZygpICsgJyknIDogJ9C+0LHRgNCw0LHQvtGC0LDQvdGLINCy0YHQtSDQvtCx0YrQtdC60YLRiycpKVxuXG4gICAgICBjb25zb2xlLmdyb3VwKCfQmtC+0Lst0LLQviDQvtCx0YrQtdC60YLQvtCyOiAnICsgdGhpcy5hbW91bnRPZlBvbHlnb25zLnRvTG9jYWxlU3RyaW5nKCkpXG4gICAgICB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zaGFwZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBjb25zdCBzaGFwZUNhcGN0aW9uID0gdGhpcy5zaGFwZXNbaV0ubmFtZVxuICAgICAgICAgIGNvbnN0IHNoYXBlQW1vdW50ID0gdGhpcy5idWZmZXJzLmFtb3VudE9mU2hhcGVzW2ldXG4gICAgICAgICAgY29uc29sZS5sb2coc2hhcGVDYXBjdGlvbiArICc6ICcgKyBzaGFwZUFtb3VudC50b0xvY2FsZVN0cmluZygpICtcbiAgICAgICAgICAgICcgW34nICsgTWF0aC5yb3VuZCgxMDAgKiBzaGFwZUFtb3VudCAvIHRoaXMuYW1vdW50T2ZQb2x5Z29ucykgKyAnJV0nKVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc29sZS5sb2coJ9Ca0L7Quy3QstC+INGG0LLQtdGC0L7QsiDQsiDQv9Cw0LvQuNGC0YDQtTogJyArIHRoaXMucG9seWdvblBhbGV0dGUubGVuZ3RoKVxuICAgICAgfVxuICAgICAgY29uc29sZS5ncm91cEVuZCgpXG5cbiAgICAgIGxldCBieXRlc1VzZWRCeUJ1ZmZlcnMgPSB0aGlzLmJ1ZmZlcnMuc2l6ZUluQnl0ZXNbMF0gKyB0aGlzLmJ1ZmZlcnMuc2l6ZUluQnl0ZXNbMV0gKyB0aGlzLmJ1ZmZlcnMuc2l6ZUluQnl0ZXNbMl1cblxuICAgICAgY29uc29sZS5ncm91cCgn0JfQsNC90Y/RgtC+INCy0LjQtNC10L7Qv9Cw0LzRj9GC0Lg6ICcgKyAoYnl0ZXNVc2VkQnlCdWZmZXJzIC8gMTAwMDAwMCkudG9GaXhlZCgyKS50b0xvY2FsZVN0cmluZygpICsgJyDQnNCRJylcbiAgICAgIHtcbiAgICAgICAgY29uc29sZS5sb2coJ9CR0YPRhNC10YDRiyDQstC10YDRiNC40L06ICcgK1xuICAgICAgICAgICh0aGlzLmJ1ZmZlcnMuc2l6ZUluQnl0ZXNbMF0gLyAxMDAwMDAwKS50b0ZpeGVkKDIpLnRvTG9jYWxlU3RyaW5nKCkgKyAnINCc0JEnICtcbiAgICAgICAgICAnIFt+JyArIE1hdGgucm91bmQoMTAwICogdGhpcy5idWZmZXJzLnNpemVJbkJ5dGVzWzBdIC8gYnl0ZXNVc2VkQnlCdWZmZXJzKSArICclXScpXG5cbiAgICAgICAgY29uc29sZS5sb2coJ9CR0YPRhNC10YDRiyDRhtCy0LXRgtC+0LI6ICdcbiAgICAgICAgICArICh0aGlzLmJ1ZmZlcnMuc2l6ZUluQnl0ZXNbMV0gLyAxMDAwMDAwKS50b0ZpeGVkKDIpLnRvTG9jYWxlU3RyaW5nKCkgKyAnINCc0JEnICtcbiAgICAgICAgICAnIFt+JyArIE1hdGgucm91bmQoMTAwICogdGhpcy5idWZmZXJzLnNpemVJbkJ5dGVzWzFdIC8gYnl0ZXNVc2VkQnlCdWZmZXJzKSArICclXScpXG5cbiAgICAgICAgY29uc29sZS5sb2coJ9CR0YPRhNC10YDRiyDQuNC90LTQtdC60YHQvtCyOiAnXG4gICAgICAgICAgKyAodGhpcy5idWZmZXJzLnNpemVJbkJ5dGVzWzJdIC8gMTAwMDAwMCkudG9GaXhlZCgyKS50b0xvY2FsZVN0cmluZygpICsgJyDQnNCRJyArXG4gICAgICAgICAgJyBbficgKyBNYXRoLnJvdW5kKDEwMCAqIHRoaXMuYnVmZmVycy5zaXplSW5CeXRlc1syXSAvIGJ5dGVzVXNlZEJ5QnVmZmVycykgKyAnJV0nKVxuICAgICAgfVxuICAgICAgY29uc29sZS5ncm91cEVuZCgpXG5cbiAgICAgIGNvbnNvbGUubG9nKCfQmtC+0Lst0LLQviDQs9GA0YPQv9C/INCx0YPRhNC10YDQvtCyOiAnICsgdGhpcy5idWZmZXJzLmFtb3VudE9mQnVmZmVyR3JvdXBzLnRvTG9jYWxlU3RyaW5nKCkpXG4gICAgICBjb25zb2xlLmxvZygn0JrQvtC7LdCy0L4gR0wt0YLRgNC10YPQs9C+0LvRjNC90LjQutC+0LI6ICcgKyAodGhpcy5idWZmZXJzLmFtb3VudE9mVG90YWxHTFZlcnRpY2VzIC8gMykudG9Mb2NhbGVTdHJpbmcoKSlcbiAgICAgIGNvbnNvbGUubG9nKCfQmtC+0Lst0LLQviDQstC10YDRiNC40L06ICcgKyB0aGlzLmJ1ZmZlcnMuYW1vdW50T2ZUb3RhbFZlcnRpY2VzLnRvTG9jYWxlU3RyaW5nKCkpXG4gICAgfVxuICAgIGNvbnNvbGUuZ3JvdXBFbmQoKVxuICB9XG5cbiAgLyoqXG4gICAqINCh0L7Qt9C00LDQtdGCINC00L7Qv9C+0LvQvdC10L3QuNC1INC6INC60L7QtNGDINC90LAg0Y/Qt9GL0LrQtSBHTFNMLlxuICAgKlxuICAgKiBAcmVtYXJrc1xuICAgKiDQkiDQtNCw0LvRjNC90LXQudGI0LXQvCDRgdC+0LfQtNCw0L3QvdGL0Lkg0LrQvtC0INCx0YPQtNC10YIg0LLRgdGC0YDQvtC10L0g0LIg0LrQvtC0INCy0LXRgNGI0LjQvdC90L7Qs9C+INGI0LXQudC00LXRgNCwINC00LvRjyDQt9Cw0LTQsNC90LjRjyDRhtCy0LXRgtCwINCy0LXRgNGI0LjQvdGLINCyINC30LDQstC40YHQuNC80L7RgdGC0Lgg0L7RglxuICAgKiDQuNC90LTQtdC60YHQsCDRhtCy0LXRgtCwLCDQv9GA0LjRgdCy0L7QtdC90L3QvtCz0L4g0Y3RgtC+0Lkg0LLQtdGA0YjQuNC90LUuINCiLtC6LiDRiNC10LnQtNC10YAg0L3QtSDQv9C+0LfQstC+0LvRj9C10YIg0LjRgdC/0L7Qu9GM0LfQvtCy0LDRgtGMINCyINC60LDRh9C10YHRgtCy0LUg0LjQvdC00LXQutGB0L7QsiDQv9C10YDQtdC80LXQvdC90YvQtSAtXG4gICAqINC00LvRjyDQt9Cw0LTQsNC90LjRjyDRhtCy0LXRgtCwINC40YHQv9C+0LvRjNC30YPQtdGC0YHRjyDQv9C10YDQtdCx0L7RgCDRhtCy0LXRgtC+0LLRi9GFINC40L3QtNC10LrRgdC+0LIuXG4gICAqXG4gICAqIEByZXR1cm5zINCa0L7QtCDQvdCwINGP0LfRi9C60LUgR0xTTC5cbiAgICovXG4gIHByb3RlY3RlZCBnZW5TaGFkZXJDb2xvckNvZGUoKTogc3RyaW5nIHtcblxuICAgIC8vINCS0YDQtdC80LXQvdC90L7QtSDQtNC+0LHQsNCy0LvQtdC90LjQtSDQsiDQv9Cw0LvQuNGC0YDRgyDRhtCy0LXRgtC+0LIg0LLQtdGA0YjQuNC9INGG0LLQtdGC0LAg0L3QsNC/0YDQsNCy0LvRj9GO0YnQuNGFLlxuICAgIHRoaXMucG9seWdvblBhbGV0dGUucHVzaCh0aGlzLnJ1bGVzQ29sb3IpXG5cbiAgICBsZXQgY29kZTogc3RyaW5nID0gJydcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wb2x5Z29uUGFsZXR0ZS5sZW5ndGg7IGkrKykge1xuXG4gICAgICAvLyDQn9C+0LvRg9GH0LXQvdC40LUg0YbQstC10YLQsCDQsiDQvdGD0LbQvdC+0Lwg0YTQvtGA0LzQsNGC0LUuXG4gICAgICBsZXQgW3IsIGcsIGJdID0gdGhpcy5jb252ZXJ0Q29sb3IodGhpcy5wb2x5Z29uUGFsZXR0ZVtpXSlcblxuICAgICAgLy8g0KTQvtGA0LzQuNGA0L7QstC90LjQtSDRgdGC0YDQvtC6IEdMU0wt0LrQvtC00LAg0L/RgNC+0LLQtdGA0LrQuCDQuNC90LTQtdC60YHQsCDRhtCy0LXRgtCwLlxuICAgICAgY29kZSArPSAoKGkgPT09IDApID8gJycgOiAnICBlbHNlICcpICsgJ2lmIChhX2NvbG9yID09ICcgKyBpICsgJy4wKSB2X2NvbG9yID0gdmVjMygnICtcbiAgICAgICAgci50b1N0cmluZygpLnNsaWNlKDAsIDkpICsgJywnICtcbiAgICAgICAgZy50b1N0cmluZygpLnNsaWNlKDAsIDkpICsgJywnICtcbiAgICAgICAgYi50b1N0cmluZygpLnNsaWNlKDAsIDkpICsgJyk7XFxuJ1xuICAgIH1cblxuICAgIC8vINCj0LTQsNC70LXQvdC40LUg0LjQtyDQv9Cw0LvQuNGC0YDRiyDQstC10YDRiNC40L0g0LLRgNC10LzQtdC90L3QviDQtNC+0LHQsNCy0LvQtdC90L3QvtCz0L4g0YbQstC10YLQsCDQvdCw0L/RgNCw0LLQu9GP0Y7RidC40YUuXG4gICAgdGhpcy5wb2x5Z29uUGFsZXR0ZS5wb3AoKVxuXG4gICAgcmV0dXJuIGNvZGVcbiAgfVxuXG4gIC8qKlxuICAgKiDQmtC+0L3QstC10YDRgtC40YDRg9C10YIg0YbQstC10YIg0LjQtyBIRVgt0L/RgNC10LTRgdGC0LDQstC70LXQvdC40Y8g0LIg0L/RgNC10LTRgdGC0LDQstC70LXQvdC40LUg0YbQstC10YLQsCDQtNC70Y8gR0xTTC3QutC+0LTQsCAoUkdCINGBINC00LjQsNC/0LDQt9C+0L3QsNC80Lgg0LfQvdCw0YfQtdC90LjQuSDQvtGCIDAg0LTQviAxKS5cbiAgICpcbiAgICogQHBhcmFtIGhleENvbG9yIC0g0KbQstC10YIg0LIgSEVYLdGE0L7RgNC80LDRgtC1LlxuICAgKiBAcmV0dXJucyDQnNCw0YHRgdC40LIg0LjQtyDRgtGA0LXRhSDRh9C40YHQtdC7INCyINC00LjQsNC/0LDQt9C+0L3QtSDQvtGCIDAg0LTQviAxLlxuICAgKi9cbiAgcHJvdGVjdGVkIGNvbnZlcnRDb2xvcihoZXhDb2xvcjogSEVYQ29sb3IpOiBudW1iZXJbXSB7XG5cbiAgICBsZXQgayA9IC9eIz8oW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkkL2kuZXhlYyhoZXhDb2xvcilcbiAgICBsZXQgW3IsIGcsIGJdID0gW3BhcnNlSW50KGshWzFdLCAxNikgLyAyNTUsIHBhcnNlSW50KGshWzJdLCAxNikgLyAyNTUsIHBhcnNlSW50KGshWzNdLCAxNikgLyAyNTVdXG5cbiAgICByZXR1cm4gW3IsIGcsIGJdXG4gIH1cblxuICAvKipcbiAgICog0JLRi9GH0LjRgdC70Y/QtdGCINGC0LXQutGD0YnQtdC1INCy0YDQtdC80Y8uXG4gICAqXG4gICAqIEByZXR1cm5zINCh0YLRgNC+0LrQvtCy0LDRjyDRhNC+0YDQvNCw0YLQuNGA0L7QstCw0L3QvdCw0Y8g0LfQsNC/0LjRgdGMINGC0LXQutGD0YnQtdCz0L4g0LLRgNC10LzQtdC90LguXG4gICAqL1xuICBwcm90ZWN0ZWQgZ2V0Q3VycmVudFRpbWUoKTogc3RyaW5nIHtcblxuICAgIGxldCB0b2RheSA9IG5ldyBEYXRlKCk7XG5cbiAgICBsZXQgdGltZSA9XG4gICAgICAoKHRvZGF5LmdldEhvdXJzKCkgPCAxMCA/ICcwJyA6ICcnKSArIHRvZGF5LmdldEhvdXJzKCkpICsgXCI6XCIgK1xuICAgICAgKCh0b2RheS5nZXRNaW51dGVzKCkgPCAxMCA/ICcwJyA6ICcnKSArIHRvZGF5LmdldE1pbnV0ZXMoKSkgKyBcIjpcIiArXG4gICAgICAoKHRvZGF5LmdldFNlY29uZHMoKSA8IDEwID8gJzAnIDogJycpICsgdG9kYXkuZ2V0U2Vjb25kcygpKVxuXG4gICAgcmV0dXJuIHRpbWVcbiAgfVxuXG4vKipcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbiAgLyoqXG4gICAqXG4gICAqL1xuICBwcm90ZWN0ZWQgbWFrZUNhbWVyYU1hdHJpeCgkdGhpczogU1Bsb3QpIHtcblxuICAgIGNvbnN0IHpvb21TY2FsZSA9IDEgLyAkdGhpcy5jYW1lcmEuem9vbSE7XG5cbiAgICBsZXQgY2FtZXJhTWF0ID0gbTMuaWRlbnRpdHkoKTtcbiAgICBjYW1lcmFNYXQgPSBtMy50cmFuc2xhdGUoY2FtZXJhTWF0LCAkdGhpcy5jYW1lcmEueCwgJHRoaXMuY2FtZXJhLnkpO1xuICAgIGNhbWVyYU1hdCA9IG0zLnNjYWxlKGNhbWVyYU1hdCwgem9vbVNjYWxlLCB6b29tU2NhbGUpO1xuXG4gICAgcmV0dXJuIGNhbWVyYU1hdDtcbiAgfVxuXG4gIC8qKlxuICAgKiDQntCx0L3QvtCy0LvRj9C10YIg0LzQsNGC0YDQuNGG0YMg0YLRgNCw0L3RgdGE0L7RgNC80LDRhtC40LguXG4gICAqXG4gICAqIEByZW1hcmtzXG4gICAqINCh0YPRidC10YHRgtCy0YPQtdGCINC00LLQsCDQstCw0YDQuNCw0L3RgtCwINCy0YvQt9C+0LLQsCDQvNC10YLQvtC00LAgLSDQuNC3INC00YDRg9Cz0L7Qs9C+INC80LXRgtC+0LTQsCDRjdC60LfQtdC80L/Qu9GP0YDQsCAoe0BsaW5rIHJlbmRlcn0pINC4INC40Lcg0L7QsdGA0LDQsdC+0YLRh9C40LrQsCDRgdC+0LHRi9GC0LjRjyDQvNGL0YjQuFxuICAgKiAoe0BsaW5rIGhhbmRsZU1vdXNlV2hlZWx9KS4g0JLQviDQstGC0L7RgNC+0Lwg0LLQsNGA0LjQsNC90YLQtSDQuNGB0L/QvtC70YzQt9C+0LLQsNC90LjQtSDQvtCx0YrQtdC60YLQsCB0aGlzINC90LXQstC+0LfQvNC+0LbQvdC+LiDQlNC70Y8g0YPQvdC40LLQtdGA0YHQsNC70YzQvdC+0YHRgtC4INCy0YvQt9C+0LLQsFxuICAgKiDQvNC10YLQvtC00LAgLSDQsiDQvdC10LPQviDQstGB0LXQs9C00LAg0Y/QstC90L4g0L3QtdC+0LHRhdC+0LTQuNC80L4g0L/QtdGA0LXQtNCw0LLQsNGC0Ywg0YHRgdGL0LvQutGDINC90LAg0Y3QutC30LXQvNC/0LvRj9GAINC60LvQsNGB0YHQsC5cbiAgICpcbiAgICogQHBhcmFtICR0aGlzIC0g0K3QutC30LXQvNC/0LvRj9GAINC60LvQsNGB0YHQsCwg0YfRjNGOINC80LDRgtGA0LjRhtGDINGC0YDQsNC90YHRhNC+0YDQvNCw0YbQuNC4INC90LXQvtCx0YXQvtC00LjQvNC+INC+0LHQvdC+0LLQuNGC0YwuXG4gICAqL1xuICBwcm90ZWN0ZWQgdXBkYXRlVmlld1Byb2plY3Rpb24oJHRoaXM6IFNQbG90KTogdm9pZCB7XG5cbiAgICBjb25zdCBwcm9qZWN0aW9uTWF0ID0gbTMucHJvamVjdGlvbigkdGhpcy5nbC5jYW52YXMud2lkdGgsICR0aGlzLmdsLmNhbnZhcy5oZWlnaHQpO1xuICAgIGNvbnN0IGNhbWVyYU1hdCA9ICR0aGlzLm1ha2VDYW1lcmFNYXRyaXgoJHRoaXMpO1xuICAgIGxldCB2aWV3TWF0ID0gbTMuaW52ZXJzZShjYW1lcmFNYXQpO1xuICAgICR0aGlzLnRyYW5zb3JtYXRpb24udmlld1Byb2plY3Rpb25NYXQgPSBtMy5tdWx0aXBseShwcm9qZWN0aW9uTWF0LCB2aWV3TWF0KTtcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKi9cbiAgcHJvdGVjdGVkIGdldENsaXBTcGFjZU1vdXNlUG9zaXRpb24oZXZlbnQ6IE1vdXNlRXZlbnQpIHtcblxuICAgIGNvbnN0ICR0aGlzID0gU1Bsb3QuaW5zdGFuY2VzWyhldmVudC50YXJnZXQgYXMgSFRNTEVsZW1lbnQpLmlkXVxuXG4gICAgLy8gZ2V0IGNhbnZhcyByZWxhdGl2ZSBjc3MgcG9zaXRpb25cbiAgICBjb25zdCByZWN0ID0gJHRoaXMuY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IGNzc1ggPSBldmVudC5jbGllbnRYIC0gcmVjdC5sZWZ0O1xuICAgIGNvbnN0IGNzc1kgPSBldmVudC5jbGllbnRZIC0gcmVjdC50b3A7XG5cbiAgICAvLyBnZXQgbm9ybWFsaXplZCAwIHRvIDEgcG9zaXRpb24gYWNyb3NzIGFuZCBkb3duIGNhbnZhc1xuICAgIGNvbnN0IG5vcm1hbGl6ZWRYID0gY3NzWCAvICR0aGlzLmNhbnZhcy5jbGllbnRXaWR0aDtcbiAgICBjb25zdCBub3JtYWxpemVkWSA9IGNzc1kgLyAkdGhpcy5jYW52YXMuY2xpZW50SGVpZ2h0O1xuXG4gICAgLy8gY29udmVydCB0byBjbGlwIHNwYWNlXG4gICAgY29uc3QgY2xpcFggPSBub3JtYWxpemVkWCAqIDIgLSAxO1xuICAgIGNvbnN0IGNsaXBZID0gbm9ybWFsaXplZFkgKiAtMiArIDE7XG5cbiAgICByZXR1cm4gW2NsaXBYLCBjbGlwWV07XG4gIH1cblxuICAvKipcbiAgICpcbiAgICovXG4gIHByb3RlY3RlZCBtb3ZlQ2FtZXJhKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG5cbiAgICBjb25zdCAkdGhpcyA9IFNQbG90Lmluc3RhbmNlc1soZXZlbnQudGFyZ2V0IGFzIEhUTUxFbGVtZW50KS5pZF1cblxuICAgIGNvbnN0IHBvcyA9IG0zLnRyYW5zZm9ybVBvaW50KFxuICAgICAgJHRoaXMudHJhbnNvcm1hdGlvbi5zdGFydEludlZpZXdQcm9qTWF0LFxuICAgICAgJHRoaXMuZ2V0Q2xpcFNwYWNlTW91c2VQb3NpdGlvbihldmVudClcbiAgICApO1xuXG4gICAgJHRoaXMuY2FtZXJhLnggPVxuICAgICAgJHRoaXMudHJhbnNvcm1hdGlvbi5zdGFydENhbWVyYS54ISArICR0aGlzLnRyYW5zb3JtYXRpb24uc3RhcnRQb3NbMF0gLSBwb3NbMF07XG5cbiAgICAkdGhpcy5jYW1lcmEueSA9XG4gICAgICAkdGhpcy50cmFuc29ybWF0aW9uLnN0YXJ0Q2FtZXJhLnkhICsgJHRoaXMudHJhbnNvcm1hdGlvbi5zdGFydFBvc1sxXSAtIHBvc1sxXTtcblxuICAgICR0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgLyoqXG4gICAqINCg0LXQsNCz0LjRgNGD0LXRgiDQvdCwINC00LLQuNC20LXQvdC40LUg0LzRi9GI0Lgv0YLRgNC10LrQv9Cw0LTQsCDQsiDQvNC+0LzQtdC90YIsINC60L7Qs9C00LAg0LXQtS/QtdCz0L4g0LrQu9Cw0LLQuNGI0LAg0YPQtNC10YDQttC40LLQsNC10YLRgdGPINC90LDQttCw0YLQvtC5LlxuICAgKlxuICAgKiBAcmVtZXJrc1xuICAgKiDQnNC10YLQvtC0INC/0LXRgNC10LzQtdGJ0LDQtdGCINC+0LHQu9Cw0YHRgtGMINCy0LjQtNC40LzQvtGB0YLQuCDQvdCwINC/0LvQvtGB0LrQvtGB0YLQuCDQstC80LXRgdGC0LUg0YEg0LTQstC40LbQtdC90LjQtdC8INC80YvRiNC4L9GC0YDQtdC60L/QsNC00LAuINCS0YvRh9C40YHQu9C10L3QuNGPINCy0L3Rg9GC0YDQuCDRgdC+0LHRi9GC0LjRjyDRgdC00LXQu9Cw0L3Ri1xuICAgKiDQvNCw0LrRgdC40LzQsNC70YzQvdC+INC/0YDQvtC40LfQstC+0LTQuNGC0LXQu9GM0L3Ri9C80Lgg0LIg0YPRidC10YDQsSDRh9C40YLQsNCx0LXQu9GM0L3QvtGB0YLQuCDQu9C+0LPQuNC60Lgg0LTQtdC50YHRgtCy0LjQuS4g0JLQviDQstC90LXRiNC90LXQvCDQvtCx0YDQsNCx0L7RgtGH0LjQutC1INGB0L7QsdGL0YLQuNC5INC+0LHRitC10LrRgiB0aGlzXG4gICAqINC90LXQtNC+0YHRgtGD0L/QtdC9INC/0L7RjdGC0L7QvNGDINC00L7RgdGC0YPQvyDQuiDRjdC60LfQtdC80L/Qu9GP0YDRgyDQutC70LDRgdGB0LAg0YDQtdCw0LvQuNC30YPQtdGC0YHRjyDRh9C10YDQtdC3INGB0YLQsNGC0LjRh9C10YHQutC40Lkg0LzQsNGB0YHQuNCyINCy0YHQtdGFINGB0L7Qt9C00LDQvdC90YvRhSDRjdC60LfQtdC80L/Qu9GP0YDQvtCyXG4gICAqINC60LvQsNGB0YHQsCDQuCDQuNC00LXQvdGC0LjRhNC40LrQsNGC0L7RgNCwINC60LDQvdCy0LDRgdCwLCDQstGL0YHRgtGD0L/QsNGO0YnQtdCz0L4g0LjQvdC00LXQutGB0L7QvCDQsiDRjdGC0L7QvCDQvNCw0YHRgdC40LLQtS5cbiAgICpcbiAgICogQHBhcmFtIGV2ZW50IC0g0KHQvtCx0YvRgtC40LUg0LzRi9GI0Lgv0YLRgNC10LrQv9Cw0LTQsC5cbiAgICovXG4gIHByb3RlY3RlZCBoYW5kbGVNb3VzZU1vdmUoZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICBjb25zdCAkdGhpcyA9IFNQbG90Lmluc3RhbmNlc1soZXZlbnQudGFyZ2V0IGFzIEhUTUxFbGVtZW50KS5pZF1cbiAgICAkdGhpcy5tb3ZlQ2FtZXJhKGV2ZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiDQoNC10LDQs9C40YDRg9C10YIg0L3QsCDQvtGC0LbQsNGC0LjQtSDQutC70LDQstC40YjQuCDQvNGL0YjQuC/RgtGA0LXQutC/0LDQtNCwLlxuICAgKlxuICAgKiBAcmVtZXJrc1xuICAgKiDQkiDQvNC+0LzQtdC90YIg0L7RgtC20LDRgtC40Y8g0LrQu9Cw0LLQuNGI0Lgg0LDQvdCw0LvQuNC3INC00LLQuNC20LXQvdC40Y8g0LzRi9GI0Lgv0YLRgNC10LrQv9Cw0LTQsCDRgSDQt9Cw0LbQsNGC0L7QuSDQutC70LDQstC40YjQtdC5INC/0YDQtdC60YDQsNGJ0LDQtdGC0YHRjy4g0JLRi9GH0LjRgdC70LXQvdC40Y8g0LLQvdGD0YLRgNC4INGB0L7QsdGL0YLQuNGPXG4gICAqINGB0LTQtdC70LDQvdGLINC80LDQutGB0LjQvNCw0LvRjNC90L4g0L/RgNC+0LjQt9Cy0L7QtNC40YLQtdC70YzQvdGL0LzQuCDQsiDRg9GJ0LXRgNCxINGH0LjRgtCw0LHQtdC70YzQvdC+0YHRgtC4INC70L7Qs9C40LrQuCDQtNC10LnRgdGC0LLQuNC5LiDQktC+INCy0L3QtdGI0L3QtdC8INC+0LHRgNCw0LHQvtGC0YfQuNC60LUg0YHQvtCx0YvRgtC40Lkg0L7QsdGK0LXQutGCXG4gICAqIHRoaXMg0L3QtdC00L7RgdGC0YPQv9C10L0g0L/QvtGN0YLQvtC80YMg0LTQvtGB0YLRg9C/INC6INGN0LrQt9C10LzQv9C70Y/RgNGDINC60LvQsNGB0YHQsCDRgNC10LDQu9C40LfRg9C10YLRgdGPINGH0LXRgNC10Lcg0YHRgtCw0YLQuNGH0LXRgdC60LjQuSDQvNCw0YHRgdC40LIg0LLRgdC10YUg0YHQvtC30LTQsNC90L3Ri9GFINGN0LrQt9C10LzQv9C70Y/RgNC+0LJcbiAgICog0LrQu9Cw0YHRgdCwINC4INC40LTQtdC90YLQuNGE0LjQutCw0YLQvtGA0LAg0LrQsNC90LLQsNGB0LAsINCy0YvRgdGC0YPQv9Cw0Y7RidC10LPQviDQuNC90LTQtdC60YHQvtC8INCyINGN0YLQvtC8INC80LDRgdGB0LjQstC1LlxuICAgKlxuICAgKiBAcGFyYW0gZXZlbnQgLSDQodC+0LHRi9GC0LjQtSDQvNGL0YjQuC/RgtGA0LXQutC/0LDQtNCwLlxuICAgKi9cbiAgcHJvdGVjdGVkIGhhbmRsZU1vdXNlVXAoZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICBjb25zdCAkdGhpcyA9IFNQbG90Lmluc3RhbmNlc1soZXZlbnQudGFyZ2V0IGFzIEhUTUxFbGVtZW50KS5pZF1cbiAgICAkdGhpcy5yZW5kZXIoKTtcbiAgICBldmVudC50YXJnZXQhLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsICR0aGlzLmhhbmRsZU1vdXNlTW92ZSBhcyBFdmVudExpc3RlbmVyKTtcbiAgICBldmVudC50YXJnZXQhLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCAkdGhpcy5oYW5kbGVNb3VzZVVwIGFzIEV2ZW50TGlzdGVuZXIpO1xuICB9XG5cbiAgLyoqXG4gICAqINCg0LXQsNCz0LjRgNGD0LXRgiDQvdCwINC90LDQttCw0YLQuNC1INC60LvQsNCy0LjRiNC4INC80YvRiNC4L9GC0YDQtdC60L/QsNC00LAuXG4gICAqXG4gICAqIEByZW1lcmtzXG4gICAqINCSINC80L7QvNC10L3RgiDQvdCw0LbQsNGC0LjRjyDQuCDRg9C00LXRgNC20LDQvdC40Y8g0LrQu9Cw0LLQuNGI0Lgg0LfQsNC/0YPRgdC60LDQtdGC0YHRjyDQsNC90LDQu9C40Lcg0LTQstC40LbQtdC90LjRjyDQvNGL0YjQuC/RgtGA0LXQutC/0LDQtNCwICjRgSDQt9Cw0LbQsNGC0L7QuSDQutC70LDQstC40YjQtdC5KS4g0JLRi9GH0LjRgdC70LXQvdC40Y9cbiAgICog0LLQvdGD0YLRgNC4INGB0L7QsdGL0YLQuNGPINGB0LTQtdC70LDQvdGLINC80LDQutGB0LjQvNCw0LvRjNC90L4g0L/RgNC+0LjQt9Cy0L7QtNC40YLQtdC70YzQvdGL0LzQuCDQsiDRg9GJ0LXRgNCxINGH0LjRgtCw0LHQtdC70YzQvdC+0YHRgtC4INC70L7Qs9C40LrQuCDQtNC10LnRgdGC0LLQuNC5LiDQktC+INCy0L3QtdGI0L3QtdC8INC+0LHRgNCw0LHQvtGC0YfQuNC60LVcbiAgICog0YHQvtCx0YvRgtC40Lkg0L7QsdGK0LXQutGCIHRoaXMg0L3QtdC00L7RgdGC0YPQv9C10L0g0L/QvtGN0YLQvtC80YMg0LTQvtGB0YLRg9C/INC6INGN0LrQt9C10LzQv9C70Y/RgNGDINC60LvQsNGB0YHQsCDRgNC10LDQu9C40LfRg9C10YLRgdGPINGH0LXRgNC10Lcg0YHRgtCw0YLQuNGH0LXRgdC60LjQuSDQvNCw0YHRgdC40LIg0LLRgdC10YVcbiAgICog0YHQvtC30LTQsNC90L3Ri9GFINGN0LrQt9C10LzQv9C70Y/RgNC+0LIg0LrQu9Cw0YHRgdCwINC4INC40LTQtdC90YLQuNGE0LjQutCw0YLQvtGA0LAg0LrQsNC90LLQsNGB0LAsINCy0YvRgdGC0YPQv9Cw0Y7RidC10LPQviDQuNC90LTQtdC60YHQvtC8INCyINGN0YLQvtC8INC80LDRgdGB0LjQstC1LlxuICAgKlxuICAgKiBAcGFyYW0gZXZlbnQgLSDQodC+0LHRi9GC0LjQtSDQvNGL0YjQuC/RgtGA0LXQutC/0LDQtNCwLlxuICAgKi9cbiAgcHJvdGVjdGVkIGhhbmRsZU1vdXNlRG93bihldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuICAgIGNvbnN0ICR0aGlzID0gU1Bsb3QuaW5zdGFuY2VzWyhldmVudC50YXJnZXQgYXMgSFRNTEVsZW1lbnQpLmlkXVxuXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAkdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgJHRoaXMuaGFuZGxlTW91c2VNb3ZlIGFzIEV2ZW50TGlzdGVuZXIpO1xuICAgICR0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgJHRoaXMuaGFuZGxlTW91c2VVcCBhcyBFdmVudExpc3RlbmVyKTtcblxuICAgICR0aGlzLnRyYW5zb3JtYXRpb24uc3RhcnRJbnZWaWV3UHJvak1hdCA9IG0zLmludmVyc2UoJHRoaXMudHJhbnNvcm1hdGlvbi52aWV3UHJvamVjdGlvbk1hdCk7XG4gICAgJHRoaXMudHJhbnNvcm1hdGlvbi5zdGFydENhbWVyYSA9IE9iamVjdC5hc3NpZ24oe30sICR0aGlzLmNhbWVyYSk7XG4gICAgJHRoaXMudHJhbnNvcm1hdGlvbi5zdGFydENsaXBQb3MgPSAkdGhpcy5nZXRDbGlwU3BhY2VNb3VzZVBvc2l0aW9uKGV2ZW50KTtcbiAgICAkdGhpcy50cmFuc29ybWF0aW9uLnN0YXJ0UG9zID0gbTMudHJhbnNmb3JtUG9pbnQoJHRoaXMudHJhbnNvcm1hdGlvbi5zdGFydEludlZpZXdQcm9qTWF0LCAkdGhpcy50cmFuc29ybWF0aW9uLnN0YXJ0Q2xpcFBvcyk7XG4gICAgJHRoaXMudHJhbnNvcm1hdGlvbi5zdGFydE1vdXNlUG9zID0gW2V2ZW50LmNsaWVudFgsIGV2ZW50LmNsaWVudFldO1xuXG4gICAgJHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICAvKipcbiAgICog0KDQtdCw0LPQuNGA0YPQtdGCINC90LAg0LfRg9C80LjRgNC+0LLQsNC90LjQtSDQvNGL0YjQuC/RgtGA0LXQutC/0LDQtNCwLlxuICAgKlxuICAgKiBAcmVtZXJrc1xuICAgKiDQkiDQvNC+0LzQtdC90YIg0LfRg9C80LjRgNC+0LLQsNC90LjRjyDQvNGL0YjQuC/RgtGA0LXQutC/0LDQtNCwINC/0YDQvtC40YHRhdC+0LTQuNGCINC30YPQvNC40YDQvtCy0LDQvdC40LUg0LrQvtC+0YDQtNC40L3QsNGC0L3QvtC5INC/0LvQvtGB0LrQvtGB0YLQuC4g0JLRi9GH0LjRgdC70LXQvdC40Y8g0LLQvdGD0YLRgNC4INGB0L7QsdGL0YLQuNGPXG4gICAqINGB0LTQtdC70LDQvdGLINC80LDQutGB0LjQvNCw0LvRjNC90L4g0L/RgNC+0LjQt9Cy0L7QtNC40YLQtdC70YzQvdGL0LzQuCDQsiDRg9GJ0LXRgNCxINGH0LjRgtCw0LHQtdC70YzQvdC+0YHRgtC4INC70L7Qs9C40LrQuCDQtNC10LnRgdGC0LLQuNC5LiDQktC+INCy0L3QtdGI0L3QtdC8INC+0LHRgNCw0LHQvtGC0YfQuNC60LUg0YHQvtCx0YvRgtC40Lkg0L7QsdGK0LXQutGCXG4gICAqIHRoaXMg0L3QtdC00L7RgdGC0YPQv9C10L0g0L/QvtGN0YLQvtC80YMg0LTQvtGB0YLRg9C/INC6INGN0LrQt9C10LzQv9C70Y/RgNGDINC60LvQsNGB0YHQsCDRgNC10LDQu9C40LfRg9C10YLRgdGPINGH0LXRgNC10Lcg0YHRgtCw0YLQuNGH0LXRgdC60LjQuSDQvNCw0YHRgdC40LIg0LLRgdC10YUg0YHQvtC30LTQsNC90L3Ri9GFINGN0LrQt9C10LzQv9C70Y/RgNC+0LJcbiAgICog0LrQu9Cw0YHRgdCwINC4INC40LTQtdC90YLQuNGE0LjQutCw0YLQvtGA0LAg0LrQsNC90LLQsNGB0LAsINCy0YvRgdGC0YPQv9Cw0Y7RidC10LPQviDQuNC90LTQtdC60YHQvtC8INCyINGN0YLQvtC8INC80LDRgdGB0LjQstC1LlxuICAgKlxuICAgKiBAcGFyYW0gZXZlbnQgLSDQodC+0LHRi9GC0LjQtSDQvNGL0YjQuC/RgtGA0LXQutC/0LDQtNCwLlxuICAgKi9cbiAgcHJvdGVjdGVkIGhhbmRsZU1vdXNlV2hlZWxfb3JpZ2luYWwoZXZlbnQ6IFdoZWVsRXZlbnQpOiB2b2lkIHtcbiAgICBjb25zdCAkdGhpcyA9IFNQbG90Lmluc3RhbmNlc1soZXZlbnQudGFyZ2V0IGFzIEhUTUxFbGVtZW50KS5pZF1cblxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc3QgW2NsaXBYLCBjbGlwWV0gPSAkdGhpcy5nZXRDbGlwU3BhY2VNb3VzZVBvc2l0aW9uKGV2ZW50KTtcblxuICAgIC8vIHBvc2l0aW9uIGJlZm9yZSB6b29taW5nXG4gICAgY29uc3QgW3ByZVpvb21YLCBwcmVab29tWV0gPSBtMy50cmFuc2Zvcm1Qb2ludChtMy5pbnZlcnNlKCR0aGlzLnRyYW5zb3JtYXRpb24udmlld1Byb2plY3Rpb25NYXQpLCBbY2xpcFgsIGNsaXBZXSk7XG5cbiAgICAvLyBtdWx0aXBseSB0aGUgd2hlZWwgbW92ZW1lbnQgYnkgdGhlIGN1cnJlbnQgem9vbSBsZXZlbCwgc28gd2Ugem9vbSBsZXNzIHdoZW4gem9vbWVkIGluIGFuZCBtb3JlIHdoZW4gem9vbWVkIG91dFxuICAgIGNvbnN0IG5ld1pvb20gPSAkdGhpcy5jYW1lcmEuem9vbSEgKiBNYXRoLnBvdygyLCBldmVudC5kZWx0YVkgKiAtMC4wMSk7XG4gICAgJHRoaXMuY2FtZXJhLnpvb20gPSBNYXRoLm1heCgwLjAwMiwgTWF0aC5taW4oMjAwLCBuZXdab29tKSk7XG5cbiAgICAkdGhpcy51cGRhdGVWaWV3UHJvamVjdGlvbigkdGhpcyk7XG5cbiAgICAvLyBwb3NpdGlvbiBhZnRlciB6b29taW5nXG4gICAgY29uc3QgW3Bvc3Rab29tWCwgcG9zdFpvb21ZXSA9IG0zLnRyYW5zZm9ybVBvaW50KG0zLmludmVyc2UoJHRoaXMudHJhbnNvcm1hdGlvbi52aWV3UHJvamVjdGlvbk1hdCksIFtjbGlwWCwgY2xpcFldKTtcblxuICAgIC8vIGNhbWVyYSBuZWVkcyB0byBiZSBtb3ZlZCB0aGUgZGlmZmVyZW5jZSBvZiBiZWZvcmUgYW5kIGFmdGVyXG4gICAgJHRoaXMuY2FtZXJhLnghICs9IHByZVpvb21YIC0gcG9zdFpvb21YO1xuICAgICR0aGlzLmNhbWVyYS55ISArPSBwcmVab29tWSAtIHBvc3Rab29tWTtcblxuICAgICR0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqL1xuICBwcm90ZWN0ZWQgaGFuZGxlTW91c2VXaGVlbChldmVudDogV2hlZWxFdmVudCk6IHZvaWQge1xuICAgIGNvbnN0ICR0aGlzID0gU1Bsb3QuaW5zdGFuY2VzWyhldmVudC50YXJnZXQgYXMgSFRNTEVsZW1lbnQpLmlkXVxuXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBjb25zdCBbY2xpcFgsIGNsaXBZXSA9ICR0aGlzLmdldENsaXBTcGFjZU1vdXNlUG9zaXRpb24oZXZlbnQpO1xuXG4gICAgLy8gcG9zaXRpb24gYmVmb3JlIHpvb21pbmdcbiAgICBjb25zdCBbcHJlWm9vbVgsIHByZVpvb21ZXSA9IG0zLnRyYW5zZm9ybVBvaW50KFxuICAgICAgbTMuaW52ZXJzZSgkdGhpcy50cmFuc29ybWF0aW9uLnZpZXdQcm9qZWN0aW9uTWF0KSxcbiAgICAgIFtjbGlwWCwgY2xpcFldXG4gICAgKTtcblxuICAgIC8vIG11bHRpcGx5IHRoZSB3aGVlbCBtb3ZlbWVudCBieSB0aGUgY3VycmVudCB6b29tIGxldmVsLCBzbyB3ZSB6b29tIGxlc3Mgd2hlbiB6b29tZWQgaW4gYW5kIG1vcmUgd2hlbiB6b29tZWQgb3V0XG4gICAgY29uc3QgbmV3Wm9vbSA9ICR0aGlzLmNhbWVyYS56b29tISAqIE1hdGgucG93KDIsIGV2ZW50LmRlbHRhWSAqIC0wLjAxKTtcbiAgICAkdGhpcy5jYW1lcmEuem9vbSA9IE1hdGgubWF4KDAuMDAyLCBNYXRoLm1pbigyMDAsIG5ld1pvb20pKTtcblxuXG5cblxuICAgIC8vIFRoaXMgaXMgLS0tICR0aGlzLnVwZGF0ZVZpZXdQcm9qZWN0aW9uKCR0aGlzKTtcbiAgICBjb25zdCBwcm9qZWN0aW9uTWF0ID0gbTMucHJvamVjdGlvbigkdGhpcy5nbC5jYW52YXMud2lkdGgsICR0aGlzLmdsLmNhbnZhcy5oZWlnaHQpO1xuXG4gICAgICAvLyBUaGlzIGlzIC0tLSBjb25zdCBjYW1lcmFNYXQgPSAkdGhpcy5tYWtlQ2FtZXJhTWF0cml4KCR0aGlzKTtcbiAgICAgIGNvbnN0IHpvb21TY2FsZSA9IDEgLyAkdGhpcy5jYW1lcmEuem9vbTtcbiAgICAgIGxldCBjYW1lcmFNYXQgPSBtMy5pZGVudGl0eSgpO1xuICAgICAgY2FtZXJhTWF0ID0gbTMudHJhbnNsYXRlKGNhbWVyYU1hdCwgJHRoaXMuY2FtZXJhLngsICR0aGlzLmNhbWVyYS55KTtcbiAgICAgIGNhbWVyYU1hdCA9IG0zLnNjYWxlKGNhbWVyYU1hdCwgem9vbVNjYWxlLCB6b29tU2NhbGUpO1xuXG4gICAgbGV0IHZpZXdNYXQgPSBtMy5pbnZlcnNlKGNhbWVyYU1hdCk7XG4gICAgJHRoaXMudHJhbnNvcm1hdGlvbi52aWV3UHJvamVjdGlvbk1hdCA9IG0zLm11bHRpcGx5KHByb2plY3Rpb25NYXQsIHZpZXdNYXQpO1xuXG5cblxuXG4gICAgLy8gcG9zaXRpb24gYWZ0ZXIgem9vbWluZ1xuICAgIGNvbnN0IFtwb3N0Wm9vbVgsIHBvc3Rab29tWV0gPSBtMy50cmFuc2Zvcm1Qb2ludChtMy5pbnZlcnNlKCR0aGlzLnRyYW5zb3JtYXRpb24udmlld1Byb2plY3Rpb25NYXQpLCBbY2xpcFgsIGNsaXBZXSk7XG5cbiAgICAvLyBjYW1lcmEgbmVlZHMgdG8gYmUgbW92ZWQgdGhlIGRpZmZlcmVuY2Ugb2YgYmVmb3JlIGFuZCBhZnRlclxuICAgICR0aGlzLmNhbWVyYS54ISArPSBwcmVab29tWCAtIHBvc3Rab29tWDtcbiAgICAkdGhpcy5jYW1lcmEueSEgKz0gcHJlWm9vbVkgLSBwb3N0Wm9vbVk7XG5cbiAgICAkdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICovXG5cbiAgLyoqXG4gICAqINCf0YDQvtC40LfQstC+0LTQuNGCINGA0LXQvdC00LXRgNC40L3QsyDQs9GA0LDRhNC40LrQsCDQsiDRgdC+0L7RgtCy0LXRgtGB0YLQstC40Lgg0YEg0YLQtdC60YPRidC40LzQuCDQv9Cw0YDQsNC80LXRgtGA0LDQvNC4INGC0YDQsNC90YHRhNC+0YDQvNCw0YbQuNC4LlxuICAgKi9cbiAgcHJvdGVjdGVkIHJlbmRlcigpOiB2b2lkIHtcblxuICAgIC8vINCe0YfQuNGB0YLQutCwINC+0LHRitC10LrRgtCwINGA0LXQvdC00LXRgNC40L3Qs9CwIFdlYkdMLlxuICAgIHRoaXMuZ2wuY2xlYXIodGhpcy5nbC5DT0xPUl9CVUZGRVJfQklUKVxuXG4gICAgLy8g0J7QsdC90L7QstC70LXQvdC40LUg0LzQsNGC0YDQuNGG0Ysg0YLRgNCw0L3RgdGE0L7RgNC80LDRhtC40LguXG4gICAgdGhpcy51cGRhdGVWaWV3UHJvamVjdGlvbih0aGlzKVxuXG4gICAgLy8g0J/RgNC40LLRj9C30LrQsCDQvNCw0YLRgNC40YbRiyDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuCDQuiDQv9C10YDQtdC80LXQvdC90L7QuSDRiNC10LnQtNC10YDQsC5cbiAgICB0aGlzLmdsLnVuaWZvcm1NYXRyaXgzZnYodGhpcy52YXJpYWJsZXNbJ3VfbWF0cml4J10sIGZhbHNlLCB0aGlzLnRyYW5zb3JtYXRpb24udmlld1Byb2plY3Rpb25NYXQpXG5cbiAgICAvLyDQmNGC0LXRgNC40YDQvtCy0LDQvdC40LUg0Lgg0YDQtdC90LTQtdGA0LjQvdCzINCz0YDRg9C/0L8g0LHRg9GE0LXRgNC+0LIgV2ViR0wuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmJ1ZmZlcnMuYW1vdW50T2ZCdWZmZXJHcm91cHM7IGkrKykge1xuXG4gICAgICAvLyDQo9GB0YLQsNC90L7QstC60LAg0YLQtdC60YPRidC10LPQviDQsdGD0YTQtdGA0LAg0LLQtdGA0YjQuNC9INC4INC10LPQviDQv9GA0LjQstGP0LfQutCwINC6INC/0LXRgNC10LzQtdC90L3QvtC5INGI0LXQudC00LXRgNCwLlxuICAgICAgdGhpcy5nbC5iaW5kQnVmZmVyKHRoaXMuZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLmJ1ZmZlcnMudmVydGV4QnVmZmVyc1tpXSlcbiAgICAgIHRoaXMuZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkodGhpcy52YXJpYWJsZXNbJ2FfcG9zaXRpb24nXSlcbiAgICAgIHRoaXMuZ2wudmVydGV4QXR0cmliUG9pbnRlcih0aGlzLnZhcmlhYmxlc1snYV9wb3NpdGlvbiddLCAyLCB0aGlzLmdsLkZMT0FULCBmYWxzZSwgMCwgMClcblxuICAgICAgLy8g0KPRgdGC0LDQvdC+0LLQutCwINGC0LXQutGD0YnQtdCz0L4g0LHRg9GE0LXRgNCwINGG0LLQtdGC0L7QsiDQstC10YDRiNC40L0g0Lgg0LXQs9C+INC/0YDQuNCy0Y/Qt9C60LAg0Log0L/QtdGA0LXQvNC10L3QvdC+0Lkg0YjQtdC50LTQtdGA0LAuXG4gICAgICB0aGlzLmdsLmJpbmRCdWZmZXIodGhpcy5nbC5BUlJBWV9CVUZGRVIsIHRoaXMuYnVmZmVycy5jb2xvckJ1ZmZlcnNbaV0pXG4gICAgICB0aGlzLmdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KHRoaXMudmFyaWFibGVzWydhX2NvbG9yJ10pXG4gICAgICB0aGlzLmdsLnZlcnRleEF0dHJpYlBvaW50ZXIodGhpcy52YXJpYWJsZXNbJ2FfY29sb3InXSwgMSwgdGhpcy5nbC5VTlNJR05FRF9CWVRFLCBmYWxzZSwgMCwgMClcblxuICAgICAgLy8g0KPRgdGC0LDQvdC+0LLQutCwINGC0LXQutGD0YnQtdCz0L4g0LHRg9GE0LXRgNCwINC40L3QtNC10LrRgdC+0LIg0LLQtdGA0YjQuNC9LlxuICAgICAgdGhpcy5nbC5iaW5kQnVmZmVyKHRoaXMuZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIHRoaXMuYnVmZmVycy5pbmRleEJ1ZmZlcnNbaV0pXG5cbiAgICAgIC8vINCg0LXQvdC00LXRgNC40L3QsyDRgtC10LrRg9GJ0LXQuSDQs9GA0YPQv9C/0Ysg0LHRg9GE0LXRgNC+0LIuXG4gICAgICB0aGlzLmdsLmRyYXdFbGVtZW50cyh0aGlzLmdsLlBPSU5UUywgdGhpcy5idWZmZXJzLmFtb3VudE9mR0xWZXJ0aWNlc1tpXSxcbiAgICAgICAgdGhpcy5nbC5VTlNJR05FRF9TSE9SVCwgMClcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICog0KHQu9GD0YfQsNC50L3Ri9C8INC+0LHRgNCw0LfQvtC8INCy0L7Qt9Cy0YDQsNGJ0LDQtdGCINC+0LTQuNC9INC40Lcg0LjQvdC00LXQutGB0L7QsiDRh9C40YHQu9C+0LLQvtCz0L4g0L7QtNC90L7QvNC10YDQvdC+0LPQviDQvNCw0YHRgdC40LLQsC4g0J3QtdGB0LzQvtGC0YDRjyDQvdCwINGB0LvRg9GH0LDQudC90L7RgdGC0Ywg0LrQsNC20LTQvtCz0L5cbiAgICog0LrQvtC90LrRgNC10YLQvdC+0LPQviDQstGL0LfQvtCy0LAg0YTRg9C90LrRhtC40LgsINC40L3QtNC10LrRgdGLINCy0L7Qt9Cy0YDQsNGJ0LDRjtGC0YHRjyDRgSDQv9GA0LXQtNC+0L/RgNC10LTQtdC70LXQvdC90L7QuSDRh9Cw0YHRgtC+0YLQvtC5LiDQp9Cw0YHRgtC+0YLQsCBcItCy0YvQv9Cw0LTQsNC90LjQuVwiINC40L3QtNC10LrRgdC+0LIg0LfQsNC00LDQtdGC0YHRj1xuICAgKiDRgdC+0L7RgtCy0LXRgtGB0YLQstGD0Y7RidC40LzQuCDQt9C90LDRh9C10L3QuNGP0LzQuCDRjdC70LXQvNC10L3RgtC+0LIuXG4gICAqXG4gICAqIEByZW1hcmtzXG4gICAqINCf0YDQuNC80LXRgDog0J3QsCDQvNCw0YHRgdC40LLQtSBbMywgMiwgNV0g0YTRg9C90LrRhtC40Y8g0LHRg9C00LXRgiDQstC+0LfQstGA0LDRidCw0YLRjCDQuNC90LTQtdC60YEgMCDRgSDRh9Cw0YHRgtC+0YLQvtC5ID0gMy8oMysyKzUpID0gMy8xMCwg0LjQvdC00LXQutGBIDEg0YEg0YfQsNGB0YLQvtGC0L7QuSA9XG4gICAqIDIvKDMrMis1KSA9IDIvMTAsINC40L3QtNC10LrRgSAyINGBINGH0LDRgdGC0L7RgtC+0LkgPSA1LygzKzIrNSkgPSA1LzEwLlxuICAgKlxuICAgKiBAcGFyYW0gYXJyIC0g0KfQuNGB0LvQvtCy0L7QuSDQvtC00L3QvtC80LXRgNC90YvQuSDQvNCw0YHRgdC40LIsINC40L3QtNC10LrRgdGLINC60L7RgtC+0YDQvtCz0L4g0LHRg9C00YPRgiDQstC+0LfQstGA0LDRidCw0YLRjNGB0Y8g0YEg0L/RgNC10LTQvtC/0YDQtdC00LXQu9C10L3QvdC+0Lkg0YfQsNGB0YLQvtGC0L7QuS5cbiAgICogQHJldHVybnMg0KHQu9GD0YfQsNC50L3Ri9C5INC40L3QtNC10LrRgSDQuNC3INC80LDRgdGB0LjQstCwIGFyci5cbiAgICovXG4gIHByb3RlY3RlZCByYW5kb21RdW90YUluZGV4KGFycjogbnVtYmVyW10pOiBudW1iZXIge1xuXG4gICAgbGV0IGE6IG51bWJlcltdID0gW11cbiAgICBhWzBdID0gYXJyWzBdXG5cbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xuICAgICAgYVtpXSA9IGFbaSAtIDFdICsgYXJyW2ldXG4gICAgfVxuXG4gICAgY29uc3QgbGFzdEluZGV4OiBudW1iZXIgPSBhLmxlbmd0aCAtIDFcblxuICAgIGxldCByOiBudW1iZXIgPSBNYXRoLmZsb29yKChNYXRoLnJhbmRvbSgpICogYVtsYXN0SW5kZXhdKSkgKyAxXG4gICAgbGV0IGw6IG51bWJlciA9IDBcbiAgICBsZXQgaDogbnVtYmVyID0gbGFzdEluZGV4XG5cbiAgICB3aGlsZSAobCA8IGgpIHtcbiAgICAgIGNvbnN0IG06IG51bWJlciA9IGwgKyAoKGggLSBsKSA+PiAxKTtcbiAgICAgIChyID4gYVttXSkgPyAobCA9IG0gKyAxKSA6IChoID0gbSlcbiAgICB9XG5cbiAgICByZXR1cm4gKGFbbF0gPj0gcikgPyBsIDogLTFcbiAgfVxuXG4gIC8qKlxuICAgKiDQnNC10YLQvtC0INC40LzQuNGC0LDRhtC40Lgg0LjRgtC10YDQuNGA0L7QstCw0L3QuNGPINC40YHRhdC+0LTQvdGL0YUg0L7QsdGK0LXQutGC0L7Qsi4g0J/RgNC4INC60LDQttC00L7QvCDQvdC+0LLQvtC8INCy0YvQt9C+0LLQtSDQstC+0LfQstGA0LDRidCw0LXRgiDQuNC90YTQvtGA0LzQsNGG0LjRjiDQviDQv9C+0LvQuNCz0L7QvdC1INGB0L4g0YHQu9GD0YfQsNC90YvQvFxuICAgKiDQv9C+0LvQvtC20LXQvdC40LXQvCwg0YHQu9GD0YfQsNC50L3QvtC5INGE0L7RgNC80L7QuSDQuCDRgdC70YPRh9Cw0LnQvdGL0Lwg0YbQstC10YLQvtC8LlxuICAgKlxuICAgKiBAcmV0dXJucyDQmNC90YTQvtGA0LzQsNGG0LjRjyDQviDQv9C+0LvQuNCz0L7QvdC1INC40LvQuCBudWxsLCDQtdGB0LvQuCDQv9C10YDQtdCx0L7RgCDQuNGB0YXQvtC00L3Ri9GFINC+0LHRitC10LrRgtC+0LIg0LfQsNC60L7QvdGH0LjQu9GB0Y8uXG4gICAqL1xuICBwcm90ZWN0ZWQgZGVtb0l0ZXJhdGlvbkNhbGxiYWNrKCk6IFNQbG90UG9seWdvbiB8IG51bGwge1xuICAgIGlmICh0aGlzLmRlbW9Nb2RlLmluZGV4ISA8IHRoaXMuZGVtb01vZGUuYW1vdW50ISkge1xuICAgICAgdGhpcy5kZW1vTW9kZS5pbmRleCEgKys7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB4OiByYW5kb21JbnQodGhpcy5ncmlkU2l6ZS53aWR0aCksXG4gICAgICAgIHk6IHJhbmRvbUludCh0aGlzLmdyaWRTaXplLmhlaWdodCksXG4gICAgICAgIHNoYXBlOiB0aGlzLnJhbmRvbVF1b3RhSW5kZXgodGhpcy5kZW1vTW9kZS5zaGFwZVF1b3RhISksXG4gICAgICAgIGNvbG9yOiByYW5kb21JbnQodGhpcy5wb2x5Z29uUGFsZXR0ZS5sZW5ndGgpXG4gICAgICB9XG4gICAgfVxuICAgIGVsc2VcbiAgICAgIHJldHVybiBudWxsXG4gIH1cblxuICAvKipcbiAgICog0JfQsNC/0YPRgdC60LDQtdGCINGA0LXQvdC00LXRgNC40L3QsyDQuCBcItC/0YDQvtGB0LvRg9GI0LrRg1wiINGB0L7QsdGL0YLQuNC5INC80YvRiNC4L9GC0YDQtdC60L/QsNC00LAg0L3QsCDQutCw0L3QstCw0YHQtS5cbiAgICovXG4gIHB1YmxpYyBydW4oKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmlzUnVubmluZykge1xuXG4gICAgICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLmhhbmRsZU1vdXNlRG93bilcbiAgICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ3doZWVsJywgdGhpcy5oYW5kbGVNb3VzZVdoZWVsKVxuXG4gICAgICB0aGlzLnJlbmRlcigpXG5cbiAgICAgIHRoaXMuaXNSdW5uaW5nID0gdHJ1ZVxuICAgIH1cblxuICAgIC8vINCS0YvQstC+0LQg0L7RgtC70LDQtNC+0YfQvdC+0Lkg0LjQvdGE0L7RgNC80LDRhtC40LguXG4gICAgaWYgKHRoaXMuZGVidWdNb2RlLmlzRW5hYmxlKSB7XG4gICAgICBjb25zb2xlLmxvZygnJWPQoNC10L3QtNC10YDQuNC90LMg0LfQsNC/0YPRidC10L0nLCB0aGlzLmRlYnVnTW9kZS5ncm91cFN0eWxlKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDQntGB0YLQsNC90LDQstC70LjQstCw0LXRgiDRgNC10L3QtNC10YDQuNC90LMg0LggXCLQv9GA0L7RgdC70YPRiNC60YNcIiDRgdC+0LHRi9GC0LjQuSDQvNGL0YjQuC/RgtGA0LXQutC/0LDQtNCwINC90LAg0LrQsNC90LLQsNGB0LUuXG4gICAqXG4gICAqIEBwYXJhbSBjbGVhciAtINCf0YDQuNC30L3QsNC6INC90LXQvtC+0LHRhdC+0LTQuNC80L7RgdGC0Lgg0LLQvNC10YHRgtC1INGBINC+0YHRgtCw0L3QvtCy0LrQvtC5INGA0LXQvdC00LXRgNC40L3Qs9CwINC+0YfQuNGB0YLQuNGC0Ywg0LrQsNC90LLQsNGBLiDQl9C90LDRh9C10L3QuNC1IHRydWUg0L7Rh9C40YnQsNC10YIg0LrQsNC90LLQsNGBLFxuICAgKiDQt9C90LDRh9C10L3QuNC1IGZhbHNlIC0g0L7RgdGC0LDQstC70Y/QtdGCINC10LPQviDQvdC10L7Rh9C40YnQtdC90L3Ri9C8LiDQn9C+INGD0LzQvtC70YfQsNC90LjRjiDQvtGH0LjRgdGC0LrQsCDQvdC1INC/0YDQvtC40YHRhdC+0LTQuNGCLlxuICAgKi9cbiAgcHVibGljIHN0b3AoY2xlYXI6IGJvb2xlYW4gPSBmYWxzZSk6IHZvaWQge1xuXG4gICAgaWYgKHRoaXMuaXNSdW5uaW5nKSB7XG5cbiAgICAgIHRoaXMuY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMuaGFuZGxlTW91c2VEb3duKVxuICAgICAgdGhpcy5jYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcignd2hlZWwnLCB0aGlzLmhhbmRsZU1vdXNlV2hlZWwpXG4gICAgICB0aGlzLmNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLmhhbmRsZU1vdXNlTW92ZSlcbiAgICAgIHRoaXMuY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLmhhbmRsZU1vdXNlVXApXG5cbiAgICAgIGlmIChjbGVhcikge1xuICAgICAgICB0aGlzLmNsZWFyKClcbiAgICAgIH1cblxuICAgICAgdGhpcy5pc1J1bm5pbmcgPSBmYWxzZVxuICAgIH1cblxuICAgIC8vINCS0YvQstC+0LQg0L7RgtC70LDQtNC+0YfQvdC+0Lkg0LjQvdGE0L7RgNC80LDRhtC40LguXG4gICAgaWYgKHRoaXMuZGVidWdNb2RlLmlzRW5hYmxlKSB7XG4gICAgICBjb25zb2xlLmxvZygnJWPQoNC10L3QtNC10YDQuNC90LMg0L7RgdGC0LDQvdC+0LLQu9C10L0nLCB0aGlzLmRlYnVnTW9kZS5ncm91cFN0eWxlKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDQntGH0LjRidCw0LXRgiDQutCw0L3QstCw0YEsINC30LDQutGA0LDRiNC40LLQsNGPINC10LPQviDQsiDRhNC+0L3QvtCy0YvQuSDRhtCy0LXRgi5cbiAgICovXG4gIHB1YmxpYyBjbGVhcigpOiB2b2lkIHtcblxuICAgIHRoaXMuZ2wuY2xlYXIodGhpcy5nbC5DT0xPUl9CVUZGRVJfQklUKTtcblxuICAgIC8vINCS0YvQstC+0LQg0L7RgtC70LDQtNC+0YfQvdC+0Lkg0LjQvdGE0L7RgNC80LDRhtC40LguXG4gICAgaWYgKHRoaXMuZGVidWdNb2RlLmlzRW5hYmxlKSB7XG4gICAgICBjb25zb2xlLmxvZygnJWPQmtC+0L3RgtC10LrRgdGCINGA0LXQvdC00LXRgNC40L3Qs9CwINC+0YfQuNGJ0LXQvSBbJyArIHRoaXMuYmdDb2xvciArICddJywgdGhpcy5kZWJ1Z01vZGUuZ3JvdXBTdHlsZSk7XG4gICAgfVxuICB9XG59XG4iLCIvKlxuICogQ29weXJpZ2h0IDIwMjEgR0ZYRnVuZGFtZW50YWxzLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBSZWRpc3RyaWJ1dGlvbiBhbmQgdXNlIGluIHNvdXJjZSBhbmQgYmluYXJ5IGZvcm1zLCB3aXRoIG9yIHdpdGhvdXRcbiAqIG1vZGlmaWNhdGlvbiwgYXJlIHBlcm1pdHRlZCBwcm92aWRlZCB0aGF0IHRoZSBmb2xsb3dpbmcgY29uZGl0aW9ucyBhcmVcbiAqIG1ldDpcbiAqXG4gKiAgICAgKiBSZWRpc3RyaWJ1dGlvbnMgb2Ygc291cmNlIGNvZGUgbXVzdCByZXRhaW4gdGhlIGFib3ZlIGNvcHlyaWdodFxuICogbm90aWNlLCB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyLlxuICogICAgICogUmVkaXN0cmlidXRpb25zIGluIGJpbmFyeSBmb3JtIG11c3QgcmVwcm9kdWNlIHRoZSBhYm92ZVxuICogY29weXJpZ2h0IG5vdGljZSwgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lclxuICogaW4gdGhlIGRvY3VtZW50YXRpb24gYW5kL29yIG90aGVyIG1hdGVyaWFscyBwcm92aWRlZCB3aXRoIHRoZVxuICogZGlzdHJpYnV0aW9uLlxuICogICAgICogTmVpdGhlciB0aGUgbmFtZSBvZiBHRlhGdW5kYW1lbnRhbHMuIG5vciB0aGUgbmFtZXMgb2YgaGlzXG4gKiBjb250cmlidXRvcnMgbWF5IGJlIHVzZWQgdG8gZW5kb3JzZSBvciBwcm9tb3RlIHByb2R1Y3RzIGRlcml2ZWQgZnJvbVxuICogdGhpcyBzb2Z0d2FyZSB3aXRob3V0IHNwZWNpZmljIHByaW9yIHdyaXR0ZW4gcGVybWlzc2lvbi5cbiAqXG4gKiBUSElTIFNPRlRXQVJFIElTIFBST1ZJREVEIEJZIFRIRSBDT1BZUklHSFQgSE9MREVSUyBBTkQgQ09OVFJJQlVUT1JTXG4gKiBcIkFTIElTXCIgQU5EIEFOWSBFWFBSRVNTIE9SIElNUExJRUQgV0FSUkFOVElFUywgSU5DTFVESU5HLCBCVVQgTk9UXG4gKiBMSU1JVEVEIFRPLCBUSEUgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSBBTkQgRklUTkVTUyBGT1JcbiAqIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFSRSBESVNDTEFJTUVELiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQ09QWVJJR0hUXG4gKiBPV05FUiBPUiBDT05UUklCVVRPUlMgQkUgTElBQkxFIEZPUiBBTlkgRElSRUNULCBJTkRJUkVDVCwgSU5DSURFTlRBTCxcbiAqIFNQRUNJQUwsIEVYRU1QTEFSWSwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTIChJTkNMVURJTkcsIEJVVCBOT1RcbiAqIExJTUlURUQgVE8sIFBST0NVUkVNRU5UIE9GIFNVQlNUSVRVVEUgR09PRFMgT1IgU0VSVklDRVM7IExPU1MgT0YgVVNFLFxuICogREFUQSwgT1IgUFJPRklUUzsgT1IgQlVTSU5FU1MgSU5URVJSVVBUSU9OKSBIT1dFVkVSIENBVVNFRCBBTkQgT04gQU5ZXG4gKiBUSEVPUlkgT0YgTElBQklMSVRZLCBXSEVUSEVSIElOIENPTlRSQUNULCBTVFJJQ1QgTElBQklMSVRZLCBPUiBUT1JUXG4gKiAoSU5DTFVESU5HIE5FR0xJR0VOQ0UgT1IgT1RIRVJXSVNFKSBBUklTSU5HIElOIEFOWSBXQVkgT1VUIE9GIFRIRSBVU0VcbiAqIE9GIFRISVMgU09GVFdBUkUsIEVWRU4gSUYgQURWSVNFRCBPRiBUSEUgUE9TU0lCSUxJVFkgT0YgU1VDSCBEQU1BR0UuXG4gKi9cblxuLyoqXG4gKiBWYXJpb3VzIDJkIG1hdGggZnVuY3Rpb25zLlxuICpcbiAqIEBtb2R1bGUgd2ViZ2wtMmQtbWF0aFxuICovXG4oZnVuY3Rpb24ocm9vdCwgZmFjdG9yeSkgeyAgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgLy8gQU1ELiBSZWdpc3RlciBhcyBhbiBhbm9ueW1vdXMgbW9kdWxlLlxuICAgIGRlZmluZShbXSwgZmFjdG9yeSk7XG4gIH0gZWxzZSB7XG4gICAgLy8gQnJvd3NlciBnbG9iYWxzXG4gICAgcm9vdC5tMyA9IGZhY3RvcnkoKTtcbiAgfVxufSh0aGlzLCBmdW5jdGlvbigpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgLyoqXG4gICAqIEFuIGFycmF5IG9yIHR5cGVkIGFycmF5IHdpdGggOSB2YWx1ZXMuXG4gICAqIEB0eXBlZGVmIHtudW1iZXJbXXxUeXBlZEFycmF5fSBNYXRyaXgzXG4gICAqIEBtZW1iZXJPZiBtb2R1bGU6d2ViZ2wtMmQtbWF0aFxuICAgKi9cblxuICAvKipcbiAgICogVGFrZXMgdHdvIE1hdHJpeDNzLCBhIGFuZCBiLCBhbmQgY29tcHV0ZXMgdGhlIHByb2R1Y3QgaW4gdGhlIG9yZGVyXG4gICAqIHRoYXQgcHJlLWNvbXBvc2VzIGIgd2l0aCBhLiAgSW4gb3RoZXIgd29yZHMsIHRoZSBtYXRyaXggcmV0dXJuZWQgd2lsbFxuICAgKiBAcGFyYW0ge21vZHVsZTp3ZWJnbC0yZC1tYXRoLk1hdHJpeDN9IGEgQSBtYXRyaXguXG4gICAqIEBwYXJhbSB7bW9kdWxlOndlYmdsLTJkLW1hdGguTWF0cml4M30gYiBBIG1hdHJpeC5cbiAgICogQHJldHVybiB7bW9kdWxlOndlYmdsLTJkLW1hdGguTWF0cml4M30gdGhlIHJlc3VsdC5cbiAgICogQG1lbWJlck9mIG1vZHVsZTp3ZWJnbC0yZC1tYXRoXG4gICAqL1xuICBmdW5jdGlvbiBtdWx0aXBseShhLCBiKSB7XG4gICAgdmFyIGEwMCA9IGFbMCAqIDMgKyAwXTtcbiAgICB2YXIgYTAxID0gYVswICogMyArIDFdO1xuICAgIHZhciBhMDIgPSBhWzAgKiAzICsgMl07XG4gICAgdmFyIGExMCA9IGFbMSAqIDMgKyAwXTtcbiAgICB2YXIgYTExID0gYVsxICogMyArIDFdO1xuICAgIHZhciBhMTIgPSBhWzEgKiAzICsgMl07XG4gICAgdmFyIGEyMCA9IGFbMiAqIDMgKyAwXTtcbiAgICB2YXIgYTIxID0gYVsyICogMyArIDFdO1xuICAgIHZhciBhMjIgPSBhWzIgKiAzICsgMl07XG4gICAgdmFyIGIwMCA9IGJbMCAqIDMgKyAwXTtcbiAgICB2YXIgYjAxID0gYlswICogMyArIDFdO1xuICAgIHZhciBiMDIgPSBiWzAgKiAzICsgMl07XG4gICAgdmFyIGIxMCA9IGJbMSAqIDMgKyAwXTtcbiAgICB2YXIgYjExID0gYlsxICogMyArIDFdO1xuICAgIHZhciBiMTIgPSBiWzEgKiAzICsgMl07XG4gICAgdmFyIGIyMCA9IGJbMiAqIDMgKyAwXTtcbiAgICB2YXIgYjIxID0gYlsyICogMyArIDFdO1xuICAgIHZhciBiMjIgPSBiWzIgKiAzICsgMl07XG5cbiAgICByZXR1cm4gW1xuICAgICAgYjAwICogYTAwICsgYjAxICogYTEwICsgYjAyICogYTIwLFxuICAgICAgYjAwICogYTAxICsgYjAxICogYTExICsgYjAyICogYTIxLFxuICAgICAgYjAwICogYTAyICsgYjAxICogYTEyICsgYjAyICogYTIyLFxuICAgICAgYjEwICogYTAwICsgYjExICogYTEwICsgYjEyICogYTIwLFxuICAgICAgYjEwICogYTAxICsgYjExICogYTExICsgYjEyICogYTIxLFxuICAgICAgYjEwICogYTAyICsgYjExICogYTEyICsgYjEyICogYTIyLFxuICAgICAgYjIwICogYTAwICsgYjIxICogYTEwICsgYjIyICogYTIwLFxuICAgICAgYjIwICogYTAxICsgYjIxICogYTExICsgYjIyICogYTIxLFxuICAgICAgYjIwICogYTAyICsgYjIxICogYTEyICsgYjIyICogYTIyLFxuICAgIF07XG4gIH1cblxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgM3gzIGlkZW50aXR5IG1hdHJpeFxuICAgKiBAcmV0dXJuIHttb2R1bGU6d2ViZ2wyLTJkLW1hdGguTWF0cml4M30gYW4gaWRlbnRpdHkgbWF0cml4XG4gICAqL1xuICBmdW5jdGlvbiBpZGVudGl0eSgpIHtcbiAgICByZXR1cm4gW1xuICAgICAgMSwgMCwgMCxcbiAgICAgIDAsIDEsIDAsXG4gICAgICAwLCAwLCAxLFxuICAgIF07XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIDJEIHByb2plY3Rpb24gbWF0cml4XG4gICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aCB3aWR0aCBpbiBwaXhlbHNcbiAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodCBoZWlnaHQgaW4gcGl4ZWxzXG4gICAqIEByZXR1cm4ge21vZHVsZTp3ZWJnbC0yZC1tYXRoLk1hdHJpeDN9IGEgcHJvamVjdGlvbiBtYXRyaXggdGhhdCBjb252ZXJ0cyBmcm9tIHBpeGVscyB0byBjbGlwc3BhY2Ugd2l0aCBZID0gMCBhdCB0aGUgdG9wLlxuICAgKiBAbWVtYmVyT2YgbW9kdWxlOndlYmdsLTJkLW1hdGhcbiAgICovXG4gIGZ1bmN0aW9uIHByb2plY3Rpb24od2lkdGgsIGhlaWdodCkge1xuICAgIC8vIE5vdGU6IFRoaXMgbWF0cml4IGZsaXBzIHRoZSBZIGF4aXMgc28gMCBpcyBhdCB0aGUgdG9wLlxuICAgIHJldHVybiBbXG4gICAgICAyIC8gd2lkdGgsIDAsIDAsXG4gICAgICAwLCAtMiAvIGhlaWdodCwgMCxcbiAgICAgIC0xLCAxLCAxLFxuICAgIF07XG4gIH1cblxuICAvKipcbiAgICogTXVsdGlwbGllcyBieSBhIDJEIHByb2plY3Rpb24gbWF0cml4XG4gICAqIEBwYXJhbSB7bW9kdWxlOndlYmdsLTJkLW1hdGguTWF0cml4M30gdGhlIG1hdHJpeCB0byBiZSBtdWx0aXBsaWVkXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aCB3aWR0aCBpbiBwaXhlbHNcbiAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodCBoZWlnaHQgaW4gcGl4ZWxzXG4gICAqIEByZXR1cm4ge21vZHVsZTp3ZWJnbC0yZC1tYXRoLk1hdHJpeDN9IHRoZSByZXN1bHRcbiAgICogQG1lbWJlck9mIG1vZHVsZTp3ZWJnbC0yZC1tYXRoXG4gICAqL1xuICBmdW5jdGlvbiBwcm9qZWN0KG0sIHdpZHRoLCBoZWlnaHQpIHtcbiAgICByZXR1cm4gbXVsdGlwbHkobSwgcHJvamVjdGlvbih3aWR0aCwgaGVpZ2h0KSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIDJEIHRyYW5zbGF0aW9uIG1hdHJpeFxuICAgKiBAcGFyYW0ge251bWJlcn0gdHggYW1vdW50IHRvIHRyYW5zbGF0ZSBpbiB4XG4gICAqIEBwYXJhbSB7bnVtYmVyfSB0eSBhbW91bnQgdG8gdHJhbnNsYXRlIGluIHlcbiAgICogQHJldHVybiB7bW9kdWxlOndlYmdsLTJkLW1hdGguTWF0cml4M30gYSB0cmFuc2xhdGlvbiBtYXRyaXggdGhhdCB0cmFuc2xhdGVzIGJ5IHR4IGFuZCB0eS5cbiAgICogQG1lbWJlck9mIG1vZHVsZTp3ZWJnbC0yZC1tYXRoXG4gICAqL1xuICBmdW5jdGlvbiB0cmFuc2xhdGlvbih0eCwgdHkpIHtcbiAgICByZXR1cm4gW1xuICAgICAgMSwgMCwgMCxcbiAgICAgIDAsIDEsIDAsXG4gICAgICB0eCwgdHksIDEsXG4gICAgXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNdWx0aXBsaWVzIGJ5IGEgMkQgdHJhbnNsYXRpb24gbWF0cml4XG4gICAqIEBwYXJhbSB7bW9kdWxlOndlYmdsLTJkLW1hdGguTWF0cml4M30gdGhlIG1hdHJpeCB0byBiZSBtdWx0aXBsaWVkXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB0eCBhbW91bnQgdG8gdHJhbnNsYXRlIGluIHhcbiAgICogQHBhcmFtIHtudW1iZXJ9IHR5IGFtb3VudCB0byB0cmFuc2xhdGUgaW4geVxuICAgKiBAcmV0dXJuIHttb2R1bGU6d2ViZ2wtMmQtbWF0aC5NYXRyaXgzfSB0aGUgcmVzdWx0XG4gICAqIEBtZW1iZXJPZiBtb2R1bGU6d2ViZ2wtMmQtbWF0aFxuICAgKi9cbiAgZnVuY3Rpb24gdHJhbnNsYXRlKG0sIHR4LCB0eSkge1xuICAgIHJldHVybiBtdWx0aXBseShtLCB0cmFuc2xhdGlvbih0eCwgdHkpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgMkQgcm90YXRpb24gbWF0cml4XG4gICAqIEBwYXJhbSB7bnVtYmVyfSBhbmdsZUluUmFkaWFucyBhbW91bnQgdG8gcm90YXRlIGluIHJhZGlhbnNcbiAgICogQHJldHVybiB7bW9kdWxlOndlYmdsLTJkLW1hdGguTWF0cml4M30gYSByb3RhdGlvbiBtYXRyaXggdGhhdCByb3RhdGVzIGJ5IGFuZ2xlSW5SYWRpYW5zXG4gICAqIEBtZW1iZXJPZiBtb2R1bGU6d2ViZ2wtMmQtbWF0aFxuICAgKi9cbiAgZnVuY3Rpb24gcm90YXRpb24oYW5nbGVJblJhZGlhbnMpIHtcbiAgICB2YXIgYyA9IE1hdGguY29zKGFuZ2xlSW5SYWRpYW5zKTtcbiAgICB2YXIgcyA9IE1hdGguc2luKGFuZ2xlSW5SYWRpYW5zKTtcbiAgICByZXR1cm4gW1xuICAgICAgYywgLXMsIDAsXG4gICAgICBzLCBjLCAwLFxuICAgICAgMCwgMCwgMSxcbiAgICBdO1xuICB9XG5cbiAgLyoqXG4gICAqIE11bHRpcGxpZXMgYnkgYSAyRCByb3RhdGlvbiBtYXRyaXhcbiAgICogQHBhcmFtIHttb2R1bGU6d2ViZ2wtMmQtbWF0aC5NYXRyaXgzfSB0aGUgbWF0cml4IHRvIGJlIG11bHRpcGxpZWRcbiAgICogQHBhcmFtIHtudW1iZXJ9IGFuZ2xlSW5SYWRpYW5zIGFtb3VudCB0byByb3RhdGUgaW4gcmFkaWFuc1xuICAgKiBAcmV0dXJuIHttb2R1bGU6d2ViZ2wtMmQtbWF0aC5NYXRyaXgzfSB0aGUgcmVzdWx0XG4gICAqIEBtZW1iZXJPZiBtb2R1bGU6d2ViZ2wtMmQtbWF0aFxuICAgKi9cbiAgZnVuY3Rpb24gcm90YXRlKG0sIGFuZ2xlSW5SYWRpYW5zKSB7XG4gICAgcmV0dXJuIG11bHRpcGx5KG0sIHJvdGF0aW9uKGFuZ2xlSW5SYWRpYW5zKSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIDJEIHNjYWxpbmcgbWF0cml4XG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzeCBhbW91bnQgdG8gc2NhbGUgaW4geFxuICAgKiBAcGFyYW0ge251bWJlcn0gc3kgYW1vdW50IHRvIHNjYWxlIGluIHlcbiAgICogQHJldHVybiB7bW9kdWxlOndlYmdsLTJkLW1hdGguTWF0cml4M30gYSBzY2FsZSBtYXRyaXggdGhhdCBzY2FsZXMgYnkgc3ggYW5kIHN5LlxuICAgKiBAbWVtYmVyT2YgbW9kdWxlOndlYmdsLTJkLW1hdGhcbiAgICovXG4gIGZ1bmN0aW9uIHNjYWxpbmcoc3gsIHN5KSB7XG4gICAgcmV0dXJuIFtcbiAgICAgIHN4LCAwLCAwLFxuICAgICAgMCwgc3ksIDAsXG4gICAgICAwLCAwLCAxLFxuICAgIF07XG4gIH1cblxuICAvKipcbiAgICogTXVsdGlwbGllcyBieSBhIDJEIHNjYWxpbmcgbWF0cml4XG4gICAqIEBwYXJhbSB7bW9kdWxlOndlYmdsLTJkLW1hdGguTWF0cml4M30gdGhlIG1hdHJpeCB0byBiZSBtdWx0aXBsaWVkXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzeCBhbW91bnQgdG8gc2NhbGUgaW4geFxuICAgKiBAcGFyYW0ge251bWJlcn0gc3kgYW1vdW50IHRvIHNjYWxlIGluIHlcbiAgICogQHJldHVybiB7bW9kdWxlOndlYmdsLTJkLW1hdGguTWF0cml4M30gdGhlIHJlc3VsdFxuICAgKiBAbWVtYmVyT2YgbW9kdWxlOndlYmdsLTJkLW1hdGhcbiAgICovXG4gIGZ1bmN0aW9uIHNjYWxlKG0sIHN4LCBzeSkge1xuICAgIHJldHVybiBtdWx0aXBseShtLCBzY2FsaW5nKHN4LCBzeSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gZG90KHgxLCB5MSwgeDIsIHkyKSB7XG4gICAgcmV0dXJuIHgxICogeDIgKyB5MSAqIHkyO1xuICB9XG5cbiAgZnVuY3Rpb24gZGlzdGFuY2UoeDEsIHkxLCB4MiwgeTIpIHtcbiAgICB2YXIgZHggPSB4MSAtIHgyO1xuICAgIHZhciBkeSA9IHkxIC0geTI7XG4gICAgcmV0dXJuIE1hdGguc3FydChkeCAqIGR4ICsgZHkgKiBkeSk7XG4gIH1cblxuICBmdW5jdGlvbiBub3JtYWxpemUoeCwgeSkge1xuICAgIHZhciBsID0gZGlzdGFuY2UoMCwgMCwgeCwgeSk7XG4gICAgaWYgKGwgPiAwLjAwMDAxKSB7XG4gICAgICByZXR1cm4gW3ggLyBsLCB5IC8gbF07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBbMCwgMF07XG4gICAgfVxuICB9XG5cbiAgLy8gaSA9IGluY2lkZW50XG4gIC8vIG4gPSBub3JtYWxcbiAgZnVuY3Rpb24gcmVmbGVjdChpeCwgaXksIG54LCBueSkge1xuICAgIC8vIEkgLSAyLjAgKiBkb3QoTiwgSSkgKiBOLlxuICAgIHZhciBkID0gZG90KG54LCBueSwgaXgsIGl5KTtcbiAgICByZXR1cm4gW1xuICAgICAgaXggLSAyICogZCAqIG54LFxuICAgICAgaXkgLSAyICogZCAqIG55LFxuICAgIF07XG4gIH1cblxuICBmdW5jdGlvbiByYWRUb0RlZyhyKSB7XG4gICAgcmV0dXJuIHIgKiAxODAgLyBNYXRoLlBJO1xuICB9XG5cbiAgZnVuY3Rpb24gZGVnVG9SYWQoZCkge1xuICAgIHJldHVybiBkICogTWF0aC5QSSAvIDE4MDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRyYW5zZm9ybVBvaW50KG0sIHYpIHtcbiAgICB2YXIgdjAgPSB2WzBdO1xuICAgIHZhciB2MSA9IHZbMV07XG4gICAgdmFyIGQgPSB2MCAqIG1bMCAqIDMgKyAyXSArIHYxICogbVsxICogMyArIDJdICsgbVsyICogMyArIDJdO1xuICAgIHJldHVybiBbXG4gICAgICAodjAgKiBtWzAgKiAzICsgMF0gKyB2MSAqIG1bMSAqIDMgKyAwXSArIG1bMiAqIDMgKyAwXSkgLyBkLFxuICAgICAgKHYwICogbVswICogMyArIDFdICsgdjEgKiBtWzEgKiAzICsgMV0gKyBtWzIgKiAzICsgMV0pIC8gZCxcbiAgICBdO1xuICB9XG5cbiAgZnVuY3Rpb24gaW52ZXJzZShtKSB7XG4gICAgdmFyIHQwMCA9IG1bMSAqIDMgKyAxXSAqIG1bMiAqIDMgKyAyXSAtIG1bMSAqIDMgKyAyXSAqIG1bMiAqIDMgKyAxXTtcbiAgICB2YXIgdDEwID0gbVswICogMyArIDFdICogbVsyICogMyArIDJdIC0gbVswICogMyArIDJdICogbVsyICogMyArIDFdO1xuICAgIHZhciB0MjAgPSBtWzAgKiAzICsgMV0gKiBtWzEgKiAzICsgMl0gLSBtWzAgKiAzICsgMl0gKiBtWzEgKiAzICsgMV07XG4gICAgdmFyIGQgPSAxLjAgLyAobVswICogMyArIDBdICogdDAwIC0gbVsxICogMyArIDBdICogdDEwICsgbVsyICogMyArIDBdICogdDIwKTtcbiAgICByZXR1cm4gW1xuICAgICAgIGQgKiB0MDAsIC1kICogdDEwLCBkICogdDIwLFxuICAgICAgLWQgKiAobVsxICogMyArIDBdICogbVsyICogMyArIDJdIC0gbVsxICogMyArIDJdICogbVsyICogMyArIDBdKSxcbiAgICAgICBkICogKG1bMCAqIDMgKyAwXSAqIG1bMiAqIDMgKyAyXSAtIG1bMCAqIDMgKyAyXSAqIG1bMiAqIDMgKyAwXSksXG4gICAgICAtZCAqIChtWzAgKiAzICsgMF0gKiBtWzEgKiAzICsgMl0gLSBtWzAgKiAzICsgMl0gKiBtWzEgKiAzICsgMF0pLFxuICAgICAgIGQgKiAobVsxICogMyArIDBdICogbVsyICogMyArIDFdIC0gbVsxICogMyArIDFdICogbVsyICogMyArIDBdKSxcbiAgICAgIC1kICogKG1bMCAqIDMgKyAwXSAqIG1bMiAqIDMgKyAxXSAtIG1bMCAqIDMgKyAxXSAqIG1bMiAqIDMgKyAwXSksXG4gICAgICAgZCAqIChtWzAgKiAzICsgMF0gKiBtWzEgKiAzICsgMV0gLSBtWzAgKiAzICsgMV0gKiBtWzEgKiAzICsgMF0pLFxuICAgIF07XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGRlZ1RvUmFkOiBkZWdUb1JhZCxcbiAgICBkaXN0YW5jZTogZGlzdGFuY2UsXG4gICAgZG90OiBkb3QsXG4gICAgaWRlbnRpdHk6IGlkZW50aXR5LFxuICAgIGludmVyc2U6IGludmVyc2UsXG4gICAgbXVsdGlwbHk6IG11bHRpcGx5LFxuICAgIG5vcm1hbGl6ZTogbm9ybWFsaXplLFxuICAgIHByb2plY3Rpb246IHByb2plY3Rpb24sXG4gICAgcmFkVG9EZWc6IHJhZFRvRGVnLFxuICAgIHJlZmxlY3Q6IHJlZmxlY3QsXG4gICAgcm90YXRpb246IHJvdGF0aW9uLFxuICAgIHJvdGF0ZTogcm90YXRlLFxuICAgIHNjYWxpbmc6IHNjYWxpbmcsXG4gICAgc2NhbGU6IHNjYWxlLFxuICAgIHRyYW5zZm9ybVBvaW50OiB0cmFuc2Zvcm1Qb2ludCxcbiAgICB0cmFuc2xhdGlvbjogdHJhbnNsYXRpb24sXG4gICAgdHJhbnNsYXRlOiB0cmFuc2xhdGUsXG4gICAgcHJvamVjdDogcHJvamVjdCxcbiAgfTtcblxufSkpO1xuXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9pbmRleC50c1wiKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=