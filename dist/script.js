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
function isObject(val) {
    return (val instanceof Object) && (val.constructor === Object);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zdHlsZS5jc3M/YzRkMiIsIndlYnBhY2s6Ly8vLi9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9zcGxvdC50cyIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svc3RhcnR1cCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0FDQUEsZ0ZBQTJCO0FBQzNCLGtEQUFnQjtBQUVoQixTQUFTLFNBQVMsQ0FBQyxLQUFhO0lBQzlCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsS0FBSyxDQUFDO0FBQzFDLENBQUM7QUFFRCxJQUFJLENBQUMsR0FBRyxDQUFDO0FBQ1QsSUFBSSxDQUFDLEdBQUcsT0FBUyxFQUFFLDhCQUE4QjtBQUNqRCxJQUFJLE9BQU8sR0FBRyxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQztBQUM1SCxJQUFJLFNBQVMsR0FBRyxLQUFNO0FBQ3RCLElBQUksVUFBVSxHQUFHLEtBQU07QUFFdkIsZ0hBQWdIO0FBQ2hILFNBQVMsY0FBYztJQUNyQixJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDVCxDQUFDLEVBQUU7UUFDSCxPQUFPO1lBQ0wsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxTQUFTLENBQUM7WUFDdkIsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxVQUFVLENBQUM7WUFDeEIsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDbkIsS0FBSyxFQUFFLFNBQVMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUcsZ0NBQWdDO1NBQ3BFO0tBQ0Y7O1FB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QUFDO1FBRXhDLCtCQUErQjtRQUMvQixJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFO1lBQzNCLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0NBQWdDLEdBQUcsSUFBSSxDQUFDLE9BQU8sR0FBRyxHQUFHLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUMvRjtJQUNILENBQUM7SUEvb0NEOzs7O09BSUc7SUFDVyxlQUFTLEdBQTZCLEVBQUU7SUEyb0N4RCxZQUFDO0NBQUE7a0JBbHBDb0IsS0FBSzs7Ozs7OztVQ2hSMUI7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0Esc0RBQXNELGtCQUFrQjtXQUN4RTtXQUNBLCtDQUErQyxjQUFjO1dBQzdELEU7Ozs7O1VDTkE7VUFDQTtVQUNBO1VBQ0EiLCJmaWxlIjoic2NyaXB0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiaW1wb3J0IFNQbG90IGZyb20gJy4vc3Bsb3QnXG5pbXBvcnQgJ0Avc3R5bGUnXG5cbmZ1bmN0aW9uIHJhbmRvbUludChyYW5nZTogbnVtYmVyKSB7XG4gIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiByYW5nZSlcbn1cblxubGV0IGkgPSAwXG5sZXQgbiA9IDFfMDAwXzAwMCAgLy8g0JjQvNC40YLQuNGA0YPQtdC80L7QtSDRh9C40YHQu9C+INC+0LHRitC10LrRgtC+0LIuXG5sZXQgcGFsZXR0ZSA9IFsnI0ZGMDBGRicsICcjODAwMDgwJywgJyNGRjAwMDAnLCAnIzgwMDAwMCcsICcjRkZGRjAwJywgJyMwMEZGMDAnLCAnIzAwODAwMCcsICcjMDBGRkZGJywgJyMwMDAwRkYnLCAnIzAwMDA4MCddXG5sZXQgcGxvdFdpZHRoID0gMzJfMDAwXG5sZXQgcGxvdEhlaWdodCA9IDE2XzAwMFxuXG4vLyDQn9GA0LjQvNC10YAg0LjRgtC10YDQuNGA0YPRjtGJ0LXQuSDRhNGD0L3QutGG0LjQuC4g0JjRgtC10YDQsNGG0LjQuCDQuNC80LjRgtC40YDRg9GO0YLRgdGPINGB0LvRg9GH0LDQudC90YvQvNC4INCy0YvQtNCw0YfQsNC80LguINCf0L7Rh9GC0Lgg0YLQsNC60LbQtSDRgNCw0LHQvtGC0LDQtdGCINGA0LXQttC40Lwg0LTQtdC80L4t0LTQsNC90L3Ri9GFLlxuZnVuY3Rpb24gcmVhZE5leHRPYmplY3QoKSB7XG4gIGlmIChpIDwgbikge1xuICAgIGkrK1xuICAgIHJldHVybiB7XG4gICAgICB4OiByYW5kb21JbnQocGxvdFdpZHRoKSxcbiAgICAgIHk6IHJhbmRvbUludChwbG90SGVpZ2h0KSxcbiAgICAgIHNoYXBlOiByYW5kb21JbnQoMyksICAgICAgICAgICAgICAgLy8gMCAtINGC0YDQtdGD0LPQvtC70YzQvdC40LosIDEgLSDQutCy0LDQtNGA0LDRgiwgMiAtINC60YDRg9CzXG4gICAgICBjb2xvcjogcmFuZG9tSW50KHBhbGV0dGUubGVuZ3RoKSwgIC8vINCY0L3QtNC10LrRgSDRhtCy0LXRgtCwINCyINC80LDRgdGB0LjQstC1INGG0LLQtdGC0L7QslxuICAgIH1cbiAgfVxuICBlbHNlXG4gICAgcmV0dXJuIG51bGwgIC8vINCS0L7Qt9Cy0YDQsNGJ0LDQtdC8IG51bGwsINC60L7Qs9C00LAg0L7QsdGK0LXQutGC0YsgXCLQt9Cw0LrQvtC90YfQuNC70LjRgdGMXCJcbn1cblxuLyoqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqKi9cblxubGV0IHNjYXR0ZXJQbG90ID0gbmV3IFNQbG90KCdjYW52YXMxJylcblxuLy8g0J3QsNGB0YLRgNC+0LnQutCwINGN0LrQt9C10LzQv9C70Y/RgNCwINC90LAg0YDQtdC20LjQvCDQstGL0LLQvtC00LAg0L7RgtC70LDQtNC+0YfQvdC+0Lkg0LjQvdGE0L7RgNC80LDRhtC40Lgg0LIg0LrQvtC90YHQvtC70Ywg0LHRgNCw0YPQt9C10YDQsC5cbi8vINCU0YDRg9Cz0LjQtSDQv9GA0LjQvNC10YDRiyDRgNCw0LHQvtGC0Ysg0L7Qv9C40YHQsNC90Ysg0LIg0YTQsNC50LvQtSBzcGxvdC5qcyDRgdC+INGB0YLRgNC+0LrQuCAyMTQuXG5zY2F0dGVyUGxvdC5zZXR1cCh7XG4gIGl0ZXJhdGlvbkNhbGxiYWNrOiByZWFkTmV4dE9iamVjdCxcbiAgcG9seWdvblBhbGV0dGU6IHBhbGV0dGUsXG4gIGdyaWRTaXplOiB7XG4gICAgd2lkdGg6IHBsb3RXaWR0aCxcbiAgICBoZWlnaHQ6IHBsb3RIZWlnaHQsXG4gIH0sXG4gIGRlYnVnTW9kZToge1xuICAgIGlzRW5hYmxlOiB0cnVlLFxuICB9LFxuICBkZW1vTW9kZToge1xuICAgIGlzRW5hYmxlOiB0cnVlLFxuICB9LFxufSlcblxuc2NhdHRlclBsb3QucnVuKClcbiIsIlxuLyoqXG4gKiDQn9GA0L7QstC10YDRj9C10YIg0Y/QstC70Y/QtdGC0YHRjyDQu9C4INC/0LXRgNC10LzQtdC90L3QsNGPINGN0LrQt9C10LzQv9C70Y/RgNC+0Lwg0LrQsNC60L7Qs9C+LdC70LjQsdC+0L4g0LrQu9Cw0YHRgdCwLlxuICpcbiAqIEBwYXJhbSB2YWwgLSDQn9GA0L7QstC10YDRj9C10LzQsNGPINC/0LXRgNC10LzQtdC90L3QsNGPLlxuICogQHJldHVybnMg0KDQtdC30YPQu9GM0YLQsNGCINC/0YDQvtCy0LXRgNC60LguXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbDogYW55KTogYm9vbGVhbiB7XG4gIHJldHVybiAodmFsIGluc3RhbmNlb2YgT2JqZWN0KSAmJiAodmFsLmNvbnN0cnVjdG9yID09PSBPYmplY3QpXG59XG5cbi8qKlxuICog0JLQvtC30LLRgNCw0YnQsNC10YIg0YHQu9GD0YfQsNC50L3QvtC1INGG0LXQu9C+0LUg0YfQuNGB0LvQviDQsiDQtNC40LDQv9Cw0LfQvtC90LU6IFswLi4ucmFuZ2UtMV0uXG4gKlxuICogQHBhcmFtIHJhbmdlIC0g0JLQtdGA0YXQvdC40Lkg0L/RgNC10LTQtdC7INC00LjQsNC/0LDQt9C+0L3QsCDRgdC70YPRh9Cw0LnQvdC+0LPQviDQstGL0LHQvtGA0LAuXG4gKiBAcmV0dXJucyDQodC70YPRh9Cw0LnQvdC+0LUg0YfQuNGB0LvQvi5cbiAqL1xuZnVuY3Rpb24gcmFuZG9tSW50KHJhbmdlOiBudW1iZXIpOiBudW1iZXIge1xuICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcmFuZ2UpXG59XG5cbi8qKlxuICog0KLQuNC/INGE0YPQvdC60YbQuNC4LCDQstGL0YfQuNGB0LvRj9GO0YnQtdC5INC60L7QvtGA0LTQuNC90LDRgtGLINCy0LXRgNGI0LjQvSDQv9C+0LvQuNCz0L7QvdCwINC+0L/RgNC10LTQtdC70LXQvdC90L7QuSDRhNC+0YDQvNGLLlxuICpcbiAqIEBwYXJhbSB4IC0g0J/QvtC70L7QttC10L3QuNC1INGG0LXQvdGC0YDQsCDQv9C+0LvQuNCz0L7QvdCwINC90LAg0L7RgdC4INCw0LHRgdGG0LjRgdGBLlxuICogQHBhcmFtIHkgLSDQn9C+0LvQvtC20LXQvdC40LUg0YbQtdC90YLRgNCwINC/0L7Qu9C40LPQvtC90LAg0L3QsCDQvtGB0Lgg0L7RgNC00LjQvdCw0YIuXG4gKiBAcGFyYW0gY29uc3RzIC0g0J3QsNCx0L7RgCDQstGB0L/QvtC80L7Qs9Cw0YLQtdC70YzQvdGL0YUg0LrQvtC90YHRgtCw0L3Rgiwg0LjRgdC/0L7Qu9GM0LfRg9C10LzRi9GFINC00LvRjyDQstGL0YfQuNGB0LvQtdC90LjRjyDQstC10YDRiNC40L0uXG4gKiBAcmV0dXJucyDQlNCw0L3QvdGL0LUg0L4g0LLQtdGA0YjQuNC90LDRhSDQv9C+0LvQuNCz0L7QvdCwLlxuICovXG50eXBlIFNQbG90Q2FsY1NoYXBlRnVuYyA9ICh4OiBudW1iZXIsIHk6IG51bWJlciwgY29uc3RzOiBBcnJheTxhbnk+KSA9PiBTUGxvdFBvbHlnb25WZXJ0aWNlc1xuXG4vKipcbiAqINCi0LjQvyDRhtCy0LXRgtCwINCyIEhFWC3RhNC+0YDQvNCw0YLQtSAoXCIjZmZmZmZmXCIpLlxuICovXG50eXBlIEhFWENvbG9yID0gc3RyaW5nXG5cbi8qKlxuICog0KLQuNC/INGE0YPQvdC60YbQuNC4INC40YLQtdGA0LjRgNC+0LLQsNC90LjRjyDQvNCw0YHRgdC40LLQsCDQuNGB0YXQvtC00L3Ri9GFINC+0LHRitC10LrRgtC+0LIuINCa0LDQttC00YvQuSDQstGL0LfQvtCyINGC0LDQutC+0Lkg0YTRg9C90LrRhtC40Lgg0LTQvtC70LbQtdC9INCy0L7Qt9Cy0YDQsNGJ0LDRgtGMINC40L3RhNC+0YDQvNCw0YbQuNGOINC+0LFcbiAqINC+0YfQtdGA0LXQtNC90L7QvCDQv9C+0LvQuNCz0L7QvdC1LCDQutC+0YLQvtGA0YvQuSDQvdC10L7QsdGF0L7QtNC40LzQviDQvtGC0L7QsdGA0LDQt9C40YLRjCAo0LXQs9C+INC60L7QvtGA0LTQuNC90LDRgtGLLCDRhNC+0YDQvNGDINC4INGG0LLQtdGCKS4g0JrQvtCz0LTQsCDQuNGB0YXQvtC00L3Ri9C1INC+0LHRitC10LrRgtGLINC30LDQutC+0L3Rh9Cw0YLRgdGPXG4gKiDRhNGD0L3QutGG0LjRjyDQtNC+0LvQttC90LAg0LLQtdGA0L3Rg9GC0YwgbnVsbC5cbiAqL1xudHlwZSBTUGxvdEl0ZXJhdGlvbkZ1bmN0aW9uID0gKCkgPT4gU1Bsb3RQb2x5Z29uIHwgbnVsbFxuXG4vKipcbiAqINCi0LjQvyDQvNC10YHRgtCwINCy0YvQstC+0LTQsCDRgdC40YHRgtC10LzQvdC+0Lkg0LjQvdGE0L7RgNC80LDRhtC40Lgg0L/RgNC4INCw0LrRgtC40LLQuNGA0L7QstCw0L3QvdC+0Lwg0YDQtdC20LjQvNC1INC+0YLQu9Cw0LTQutC4INC/0YDQuNC70L7QttC10L3QuNGPLlxuICog0JfQvdCw0YfQtdC90LjQtSBcImNvbnNvbGVcIiDRg9GB0YLQsNC90LDQstC70LjQstCw0LXRgiDQsiDQutCw0YfQtdGB0YLQstC1INC80LXRgdGC0LAg0LLRi9Cy0L7QtNCwINC60L7QvdGB0L7Qu9GMINCx0YDQsNGD0LfQtdGA0LAuXG4gKlxuICogQHRvZG8g0JTQvtCx0LDQstC40YLRjCDQvNC10YHRgtC+INCy0YvQstC+0LTQsCAtIEhUTUwg0LTQvtC60YPQvNC10L3RgiAo0LfQvdCw0YfQtdC90LjQtSBcImRvY3VtZW50XCIpXG4gKiBAdG9kbyDQlNC+0LHQsNCy0LjRgtGMINC80LXRgdGC0L4g0LLRi9Cy0L7QtNCwIC0g0YTQsNC50LsgKNC30L3QsNGH0LXQvdC40LUgXCJmaWxlXCIpXG4gKi9cbnR5cGUgU1Bsb3REZWJ1Z091dHB1dCA9ICdjb25zb2xlJ1xuXG4vKipcbiAqINCi0LjQvyDRiNC10LnQtNC10YDQsCBXZWJHTC5cbiAqINCX0L3QsNGH0LXQvdC40LUgXCJWRVJURVhfU0hBREVSXCIg0LfQsNC00LDQtdGCINCy0LXRgNGI0LjQvdC90YvQuSDRiNC10LnQtNC10YAuXG4gKiDQl9C90LDRh9C10L3QuNC1IFwiRlJBR01FTlRfU0hBREVSXCIg0LfQsNC00LDQtdGCINGE0YDQsNCz0LzQtdC90YLQvdGL0Lkg0YjQtdC50LTQtdGALlxuICovXG50eXBlIFdlYkdsU2hhZGVyVHlwZSA9ICdWRVJURVhfU0hBREVSJyB8ICdGUkFHTUVOVF9TSEFERVInXG5cbi8qKlxuICog0KLQuNC/INCx0YPRhNC10YDQsCBXZWJHTC5cbiAqINCX0L3QsNGH0LXQvdC40LUgXCJBUlJBWV9CVUZGRVJcIiDQt9Cw0LTQsNC10YIg0LHRg9GE0LXRgCDRgdC+0LTQtdGA0LbQsNGJ0LjQuSDQstC10YDRiNC40L3QvdGL0LUg0LDRgtGA0LjQsdGD0YLRiy5cbiAqINCX0L3QsNGH0LXQvdC40LUgXCJFTEVNRU5UX0FSUkFZX0JVRkZFUlwiINC30LDQtNCw0LXRgiDQsdGD0YTQtdGAINC40YHQv9C+0LvRjNC30YPRjtGJ0LjQudGB0Y8g0LTQu9GPINC40L3QtNC10LrRgdC40YDQvtCy0LDQvdC40Y8g0Y3Qu9C10LzQtdC90YLQvtCyLlxuICovXG50eXBlIFdlYkdsQnVmZmVyVHlwZSA9ICdBUlJBWV9CVUZGRVInIHwgJ0VMRU1FTlRfQVJSQVlfQlVGRkVSJ1xuXG4vKipcbiAqINCi0LjQvyDQv9C10YDQtdC80LXQvdC90L7QuSBXZWJHTC5cbiAqINCX0L3QsNGH0LXQvdC40LUgXCJ1bmlmb3JtXCIg0LfQsNC00LDQtdGCINC+0LHRidGD0Y4g0LTQu9GPINCy0YHQtdGFINCy0LXRgNGI0LjQvdC90YvRhSDRiNC10LnQtNC10YDQvtCyINC/0LXRgNC10LzQtdC90L3Rg9GOLlxuICog0JfQvdCw0YfQtdC90LjQtSBcImF0dHJpYnV0ZVwiINC30LDQtNCw0LXRgiDRg9C90LjQutCw0LvRjNC90YPRjiDQv9C10YDQtdC80LXQvdC90YPRjiDQtNC70Y8g0LrQsNC20LTQvtCz0L4g0LLQtdGA0YjQuNC90L3QvtCz0L4g0YjQtdC50LTQtdGA0LAuXG4gKiDQl9C90LDRh9C10L3QuNC1IFwidmFyeWluZ1wiINC30LDQtNCw0LXRgiDRg9C90LjQutCw0LvRjNC90YPRjiDQv9C10YDQtdC80LXQvdC90YPRjiDRgSDQvtCx0YnQtdC5INC+0LHQu9Cw0YHRgtGM0Y4g0LLQuNC00LjQvNC+0YHRgtC4INC00LvRjyDQstC10YDRiNC40L3QvdC+0LPQviDQuCDRhNGA0LDQs9C80LXQvdGC0L3QvtCz0L4g0YjQtdC50LTQtdGA0L7Qsi5cbiAqL1xudHlwZSBXZWJHbFZhcmlhYmxlVHlwZSA9ICd1bmlmb3JtJyB8ICdhdHRyaWJ1dGUnIHwgJ3ZhcnlpbmcnXG5cbi8qKlxuICog0KLQuNC/INC80LDRgdGB0LjQstCwINC00LDQvdC90YvRhSwg0LfQsNC90LjQvNCw0Y7RidC40YUg0LIg0L/QsNC80Y/RgtC4INC90LXQv9GA0LXRgNGL0LLQvdGL0Lkg0L7QsdGK0LXQvC5cbiAqL1xudHlwZSBUeXBlZEFycmF5ID0gSW50OEFycmF5IHwgSW50MTZBcnJheSB8IEludDMyQXJyYXkgfCBVaW50OEFycmF5IHxcbiAgVWludDE2QXJyYXkgfCBVaW50MzJBcnJheSB8IEZsb2F0MzJBcnJheSB8IEZsb2F0NjRBcnJheVxuXG4vKipcbiAqINCi0LjQvyDQtNC70Y8g0L3QsNGB0YLRgNC+0LXQuiDQv9GA0LjQu9C+0LbQtdC90LjRjy5cbiAqXG4gKiBAcGFyYW0gaXRlcmF0aW9uQ2FsbGJhY2sgLSDQpNGD0L3QutGG0LjRjyDQuNGC0LXRgNC40YDQvtCy0LDQvdC40Y8g0LjRgdGF0L7QtNC90YvRhSDQvtCx0YrQtdC60YLQvtCyLlxuICogQHBhcmFtIHBvbHlnb25QYWxldHRlIC0g0KbQstC10YLQvtCy0LDRjyDQv9Cw0LvQuNGC0YDQsCDQv9C+0LvQuNCz0L7QvdC+0LIuXG4gKiBAcGFyYW0gZ3JpZFNpemUgLSDQoNCw0LfQvNC10YAg0LrQvtC+0YDQtNC40L3QsNGC0L3QvtC5INC/0LvQvtGB0LrQvtGB0YLQuCDQsiDQv9C40LrRgdC10LvRj9GFLlxuICogQHBhcmFtIHBvbHlnb25TaXplIC0g0KDQsNC30LzQtdGAINC/0L7Qu9C40LPQvtC90LAg0L3QsCDQs9GA0LDRhNC40LrQtSDQsiDQv9C40LrRgdC10LvRj9GFICjRgdGC0L7RgNC+0L3QsCDQtNC70Y8g0LrQstCw0LTRgNCw0YLQsCwg0LTQuNCw0LzQtdGC0YAg0LTQu9GPINC60YDRg9Cz0LAg0Lgg0YIu0L8uKVxuICogQHBhcmFtIGNpcmNsZUFwcHJveExldmVsIC0g0KHRgtC10L/QtdC90Ywg0LTQtdGC0LDQu9C40LfQsNGG0LjQuCDQutGA0YPQs9CwIC0g0LrQvtC70LjRh9C10YHRgtCy0L4g0YPQs9C70L7QsiDQv9C+0LvQuNCz0L7QvdCwLCDQsNC/0YDQvtC60YHQuNC80LjRgNGD0Y7RidC10LPQviDQvtC60YDRg9C20L3QvtGB0YLRjCDQutGA0YPQs9CwLlxuICogQHBhcmFtIGRlYnVnTW9kZSAtINCf0LDRgNCw0LzQtdGC0YDRiyDRgNC10LbQuNC80LAg0L7RgtC70LDQtNC60Lgg0L/RgNC40LvQvtC20LXQvdC40Y8uXG4gKiBAcGFyYW0gZGVtb01vZGUgLSDQn9Cw0YDQsNC80LXRgtGA0Ysg0YDQtdC20LjQvNCwINC40YHQv9C+0LvRjNC30L7QstCw0L3QuNGPINC00LXQvNC+0L3RgdGC0YDQsNGG0LjQvtC90L3Ri9GFINC00LDQvdC90YvRhS5cbiAqIEBwYXJhbSBmb3JjZVJ1biAtINCf0YDQuNC30L3QsNC6INGC0L7Qs9C+LCDRh9GC0L4g0YDQtdC90LTQtdGA0LjQvdCzINC90LXQvtCx0YXQvtC00LjQvNC+INC90LDRh9Cw0YLRjCDRgdGA0LDQt9GDINC/0L7RgdC70LUg0LfQsNC00LDQvdC40Y8g0L3QsNGB0YLRgNC+0LXQuiDRjdC60LfQtdC80L/Qu9GP0YDQsCAo0L/QviDRg9C80L7Qu9GH0LDQvdC40Y5cbiAqICAgICDRgNC10L3QtNC10YDQuNC90LMg0LfQsNC/0YPRgdC60LDQtdGC0YHRjyDRgtC+0LvRjNC60L4g0L/QvtGB0LvQtSDQstGL0LfQvtCy0LAg0LzQtdGC0L7QtNCwIHN0YXJ0KS5cbiAqIEBwYXJhbSBtYXhBbW91bnRPZlBvbHlnb25zIC0g0JjRgdC60YPRgdGB0YLQstC10L3QvdC+0LUg0L7Qs9GA0LDQvdC40YfQtdC90LjQtSDQutC+0LvQuNGH0LXRgdGC0LLQsCDQvtGC0L7QsdGA0LDQttCw0LXQvNGL0YUg0L/QvtC70LjQs9C+0L3QvtCyLiDQn9GA0Lgg0LTQvtGB0YLQuNC20LXQvdC40Lgg0Y3RgtC+0LPQviDRh9C40YHQu9CwXG4gKiAgICAg0LjRgtC10YDQuNGA0L7QstCw0L3QuNC1INC40YHRhdC+0LTQvdGL0YUg0L7QsdGK0LXQutGC0L7QsiDQv9GA0LXRgNGL0LLQsNC10YLRgdGPLCDQtNCw0LbQtSDQtdGB0LvQuCDQvtCx0YDQsNCx0L7RgtCw0L3RiyDQvdC1INCy0YHQtSDQvtCx0YrQtdC60YLRiy5cbiAqIEBwYXJhbSBiZ0NvbG9yIC0g0KTQvtC90L7QstGL0Lkg0YbQstC10YIg0LrQsNC90LLQsNGB0LAuXG4gKiBAcGFyYW0gcnVsZXNDb2xvciAtINCm0LLQtdGCINC90LDQv9GA0LDQstC70Y/RjtGJ0LjRhS5cbiAqIEBwYXJhbSBjYW1lcmEgLSDQn9C+0LvQvtC20LXQvdC40LUg0LrQvtC+0YDQtNC40L3QsNGC0L3QvtC5INC/0LvQvtGB0LrQvtGB0YLQuCDQsiDQvtCx0LvQsNGB0YLQuCDQv9GA0L7RgdC80L7RgtGA0LAuXG4gKiBAcGFyYW0gd2ViR2xTZXR0aW5ncyAtINCY0L3QuNGG0LjQsNC70LjQt9C40YDRg9GO0YnQuNC1INC90LDRgdGC0YDQvtC50LrQuCDQutC+0L3RgtC10LrRgdGC0LAg0YDQtdC90LTQtdGA0LjQvdCz0LAgV2ViR0wuXG4gKi9cbmludGVyZmFjZSBTUGxvdE9wdGlvbnMge1xuICBpdGVyYXRpb25DYWxsYmFjaz86IFNQbG90SXRlcmF0aW9uRnVuY3Rpb24sXG4gIHBvbHlnb25QYWxldHRlPzogSEVYQ29sb3JbXSxcbiAgZ3JpZFNpemU/OiBTUGxvdEdyaWRTaXplLFxuICBwb2x5Z29uU2l6ZT86IG51bWJlcixcbiAgY2lyY2xlQXBwcm94TGV2ZWw/OiBudW1iZXIsXG4gIGRlYnVnTW9kZT86IFNQbG90RGVidWdNb2RlLFxuICBkZW1vTW9kZT86IFNQbG90RGVtb01vZGUsXG4gIGZvcmNlUnVuPzogYm9vbGVhbixcbiAgbWF4QW1vdW50T2ZQb2x5Z29ucz86IG51bWJlcixcbiAgYmdDb2xvcj86IEhFWENvbG9yLFxuICBydWxlc0NvbG9yPzogSEVYQ29sb3IsXG4gIGNhbWVyYT86IFNQbG90Q2FtZXJhLFxuICB3ZWJHbFNldHRpbmdzPzogV2ViR0xDb250ZXh0QXR0cmlidXRlc1xufVxuXG4vKipcbiAqINCi0LjQvyDQtNC70Y8g0LjQvdGE0L7RgNC80LDRhtC40Lgg0L4g0L/QvtC70LjQs9C+0L3QtS4g0KHQvtC00LXRgNC20LjRgiDQtNCw0L3QvdGL0LUsINC90LXQvtCx0YXQvtC00LjQvNGL0LUg0LTQu9GPINC00L7QsdCw0LLQu9C10L3QuNGPINC/0L7Qu9C40LPQvtC90LAg0LIg0LPRgNGD0L/Qv9GDINC/0L7Qu9C40LPQvtC90L7Qsi4g0J/QvtC70LjQs9C+0L0gLSDRjdGC0L5cbiAqINGB0L/Qu9C+0YjQvdCw0Y8g0YTQuNCz0YPRgNCwINC90LAg0LrQvtC+0YDQtNC40L3QsNGC0L3QvtC5INC/0LvQvtGB0LrQvtGB0YLQuCwg0L7QtNC90L7Qt9C90LDRh9C90L4g0L/RgNC10LTRgdGC0LDQstC70Y/RjtGJ0LDRjyDQvtC00LjQvSDQuNGB0YXQvtC00L3Ri9C5INC+0LHRitC10LrRgi5cbiAqXG4gKiBAcGFyYW0geCAtINCa0L7QvtGA0LTQuNC90LDRgtCwINGG0LXQvdGC0YDQsCDQv9C+0LvQuNCz0L7QvdCwINC90LAg0L7RgdC4INCw0LHRgdGG0LjRgdGBLiDQnNC+0LbQtdGCINCx0YvRgtGMINC60LDQuiDRhtC10LvRi9C8LCDRgtCw0Log0Lgg0LLQtdGJ0LXRgdGC0LLQtdC90L3Ri9C8INGH0LjRgdC70L7QvC5cbiAqIEBwYXJhbSB5IC0g0JrQvtC+0YDQtNC40L3QsNGC0LAg0YbQtdC90YLRgNCwINC/0L7Qu9C40LPQvtC90LAg0L3QsCDQvtGB0Lgg0L7RgNC00LjQvdCw0YIuINCc0L7QttC10YIg0LHRi9GC0Ywg0LrQsNC6INGG0LXQu9GL0LwsINGC0LDQuiDQuCDQstC10YnQtdGB0YLQstC10L3QvdGL0Lwg0YfQuNGB0LvQvtC8LlxuICogQHBhcmFtIHNoYXBlIC0g0KTQvtGA0LzQsCDQv9C+0LvQuNCz0L7QvdCwLiDQpNC+0YDQvNCwIC0g0Y3RgtC+INC40L3QtNC10LrRgSDQsiDQvNCw0YHRgdC40LLQtSDRhNC+0YDQvCB7QGxpbmsgc2hhcGVzfS4g0J7RgdC90L7QstC90YvQtSDRhNC+0YDQvNGLOiAwIC0g0YLRgNC10YPQs9C+0LvRjNC90LjQuiwgMSAtXG4gKiAgICAg0LrQstCw0LTRgNCw0YIsIDIgLSDQutGA0YPQsy5cbiAqIEBwYXJhbSBjb2xvciAtINCm0LLQtdGCINC/0L7Qu9C40LPQvtC90LAuINCm0LLQtdGCIC0g0Y3RgtC+INC40L3QtNC10LrRgSDQsiDQtNC40LDQv9Cw0LfQvtC90LUg0L7RgiAwINC00L4gMjU1LCDQv9GA0LXQtNGB0YLQsNCy0LvRj9GO0YnQuNC5INGB0L7QsdC+0Lkg0LjQvdC00LXQutGBINGG0LLQtdGC0LAg0LJcbiAqICAgICDQv9GA0LXQtNC+0L/RgNC10LTQtdC70LXQvdC90L7QvCDQvNCw0YHRgdC40LLQtSDRhtCy0LXRgtC+0LIge0BsaW5rIHBvbHlnb25QYWxldHRlfS5cbiAqL1xuaW50ZXJmYWNlIFNQbG90UG9seWdvbiB7XG4gIHg6IG51bWJlcixcbiAgeTogbnVtYmVyLFxuICBzaGFwZTogbnVtYmVyLFxuICBjb2xvcjogbnVtYmVyXG59XG5cbi8qKlxuICog0KLQuNC/INC00LvRjyDRgNCw0LfQvNC10YDQsCDQutC+0L7RgNC00LjQvdCw0YLQvdC+0Lkg0L/Qu9C+0YHQutC+0YHRgtC4LlxuICpcbiAqIEBwYXJhbSB3aWR0aCAtINCo0LjRgNC40L3QsCDQutC+0L7RgNC00LjQvdCw0YLQvdC+0Lkg0L/Qu9C+0YHQutC+0YHRgtC4INCyINC/0LjQutGB0LXQu9GP0YUuXG4gKiBAcGFyYW0gaGVpZ2h0IC0g0JLRi9GB0L7RgtCwINC60L7QvtGA0LTQuNC90LDRgtC90L7QvtC5INC/0LvQvtGB0LrQvtGB0YLQuCDQsiDQv9C40LrRgdC10LvRj9GFLlxuICovXG5pbnRlcmZhY2UgU1Bsb3RHcmlkU2l6ZSB7XG4gIHdpZHRoOiBudW1iZXIsXG4gIGhlaWdodDogbnVtYmVyXG59XG5cbi8qKlxuICog0KLQuNC/INC00LvRjyDQv9Cw0YDQsNC80LXRgtGA0L7QsiDRgNC10LbQuNC80LAg0L7RgtC70LDQtNC60LguXG4gKlxuICogQHBhcmFtIGlzRW5hYmxlIC0g0J/RgNC40LfQvdCw0Log0LLQutC70Y7Rh9C10L3QuNGPINC+0YLQu9Cw0LTQvtGH0L3QvtCz0L4g0YDQtdC20LjQvNCwLlxuICogQHBhcmFtIG91dHB1dCAtINCc0LXRgdGC0L4g0LLRi9Cy0L7QtNCwINC+0YLQu9Cw0LTQvtGH0L3QvtC5INC40L3RhNC+0YDQvNCw0YbQuNC4LlxuICogQHBhcmFtIGhlYWRlclN0eWxlIC0g0KHRgtC40LvRjCDQtNC70Y8g0LfQsNCz0L7Qu9C+0LLQutCwINCy0YHQtdCz0L4g0L7RgtC70LDQtNC+0YfQvdC+0LPQviDQsdC70L7QutCwLlxuICogQHBhcmFtIGdyb3VwU3R5bGUgLSDQodGC0LjQu9GMINC00LvRjyDQt9Cw0LPQvtC70L7QstC60LAg0LPRgNGD0L/Qv9C40YDQvtCy0LrQuCDQvtGC0LvQsNC00L7Rh9C90YvRhSDQtNCw0L3QvdGL0YUuXG4gKi9cbmludGVyZmFjZSBTUGxvdERlYnVnTW9kZSB7XG4gIGlzRW5hYmxlPzogYm9vbGVhbixcbiAgb3V0cHV0PzogU1Bsb3REZWJ1Z091dHB1dCxcbiAgaGVhZGVyU3R5bGU/OiBzdHJpbmcsXG4gIGdyb3VwU3R5bGU/OiBzdHJpbmdcbn1cblxuLyoqXG4gKiDQotC40L8g0LTQu9GPINC/0LDRgNCw0LzQtdGC0YDQvtCyINGA0LXQttC40LzQsCDQvtGC0L7QsdGA0LDQttC10L3QuNGPINC00LXQvNC+0L3RgdGC0YDQsNGG0LjQvtC90L3Ri9GFINC00LDQvdC90YvRhS5cbiAqXG4gKiBAcGFyYW0gaXNFbmFibGUgLSDQn9GA0LjQt9C90LDQuiDQstC60LvRjtGH0LXQvdC40Y8g0LTQtdC80L4t0YDQtdC20LjQvNCwLiDQkiDRjdGC0L7QvCDRgNC10LbQuNC80LUg0L/RgNC40LvQvtC20LXQvdC40LUg0LLQvNC10YHRgtC+INCy0L3QtdGI0L3QtdC5INGE0YPQvdC60YbQuNC4INC40YLQtdGA0LjRgNC+0LLQsNC90LjRj1xuICogICAgINC40YHRhdC+0LTQvdGL0YUg0L7QsdGK0LXQutGC0L7QsiDQuNGB0L/QvtC70YzQt9GD0LXRgiDQstC90YPRgtGA0LXQvdC90LjQuSDQvNC10YLQvtC0LCDQuNC80LjRgtC40YDRg9GO0YnQuNC5INC40YLQtdGA0LjRgNC+0LLQsNC90LjQtS5cbiAqIEBwYXJhbSBhbW91bnQgLSDQmtC+0LvQuNGH0LXRgdGC0LLQviDQuNC80LjRgtC40YDRg9C10LzRi9GFINC40YHRhdC+0LTQvdGL0YUg0L7QsdGK0LXQutGC0L7Qsi5cbiAqIEBwYXJhbSBzaGFwZVF1b3RhIC0g0KfQsNGB0YLQvtGC0LAg0L/QvtGP0LLQu9C10L3QuNGPINCyINC40YLQtdGA0LjRgNC+0LLQsNC90LjQuCDRgNCw0LfQu9C40YfQvdGL0YUg0YTQvtGA0Lwg0L/QvtC70LjQs9C+0L3QvtCyIC0g0YLRgNC10YPQs9C+0LvRjNC90LjQutC+0LJbMF0sINC60LLQsNC00YDQsNGC0L7QslsxXSxcbiAqICAgICDQutGA0YPQs9C+0LJbMl0g0Lgg0YIu0LQuINCf0YDQuNC80LXRgDog0LzQsNGB0YHQuNCyIFszLCAyLCA1XSDQvtC30L3QsNGH0LDQtdGCLCDRh9GC0L4g0YfQsNGB0YLQvtGC0LAg0L/QvtGP0LLQu9C10L3QuNGPINGC0YDQtdGD0LPQvtC70YzQvdC40LrQvtCyID0gMy8oMysyKzUpID0gMy8xMCxcbiAqICAgICDRh9Cw0YHRgtC+0YLQsCDQv9C+0Y/QstC70LXQvdC40Y8g0LrQstCw0LTRgNCw0YLQvtCyID0gMi8oMysyKzUpID0gMi8xMCwg0YfQsNGB0YLQvtGC0LAg0L/QvtGP0LLQu9C10L3QuNGPINC60YDRg9Cz0L7QsiA9IDUvKDMrMis1KSA9IDUvMTAuXG4gKiBAcGFyYW0gaW5kZXggLSDQn9Cw0YDQsNC80LXRgtGAINC40YHQv9C+0LvRjNC30YPQtdC80YvQuSDQtNC70Y8g0LjQvNC40YLQsNGG0LjQuCDQuNGC0LXRgNC40YDQvtCy0LDQvdC40Y8uINCX0LDQtNCw0L3QuNGPINC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjNGB0LrQvtCz0L4g0LfQvdCw0YfQtdC90LjRjyDQvdC1INGC0YDQtdCx0YPQtdGCLlxuICovXG5pbnRlcmZhY2UgU1Bsb3REZW1vTW9kZSB7XG4gIGlzRW5hYmxlPzogYm9vbGVhbixcbiAgYW1vdW50PzogbnVtYmVyLFxuICBzaGFwZVF1b3RhPzogbnVtYmVyW10sXG4gIGluZGV4PzogbnVtYmVyXG59XG5cbi8qKlxuICog0KLQuNC/INC00LvRjyDQv9C+0LvQvtC20LXQvdC40Y8g0LrQvtC+0YDQtNC40L3QsNGC0L3QvtC5INC/0LvQvtGB0LrQvtGB0YLQuCDQsiDQvtCx0LvQsNGB0YLQuCDQv9GA0L7RgdC80L7RgtGA0LAuXG4gKlxuICogQHBhcmFtIHggLSDQmtC+0L7RgNC00LjQvdCw0YLQsCDQs9GA0LDRhNC40LrQsCDQvdCwINC+0YHQuCDQsNCx0YHRhtC40YHRgS5cbiAqIEBwYXJhbSB5IC0g0JrQvtC+0YDQtNC40L3QsNGC0LAg0LPRgNCw0YTQuNC60LAg0L3QsCDQvtGB0Lgg0L7RgNC00LjQvdCw0YIuXG4gKiBAcGFyYW0gem9vbSAtINCh0YLQtdC/0LXQvdGMIFwi0L/RgNC40LHQu9C40LbQtdC90LjRj1wiINC90LDQsdC70Y7QtNCw0YLQtdC70Y8g0Log0LPRgNCw0YTQuNC60YMgKNC80LDRgdGI0YLQsNCxINC60L7QvtC00YDQuNC90LDRgtC90L7QuSDQv9C70L7RgdC60L7RgdGC0Lgg0LIg0L7QsdC70LDRgdGC0Lgg0L/RgNC+0YHQvNC+0YLRgNCwKS5cbiAqL1xuaW50ZXJmYWNlIFNQbG90Q2FtZXJhIHtcbiAgeDogbnVtYmVyLFxuICB5OiBudW1iZXIsXG4gIHpvb206IG51bWJlclxufVxuXG4vKipcbiAqINCi0LjQvyDQtNC70Y8g0YLRgNCw0L3RgdGE0L7RgNC80LDRhtC40LguINCh0L7QtNC10YDQttC40YIg0LLRgdGOINGC0LXRhdC90LjRh9C10YHQutGD0Y4g0LjQvdGE0L7RgNC80LDRhtC40Y4sINC90LXQvtCx0YXQvtC00LjQvNGD0Y4g0LTQu9GPINGA0LDRgdGB0YfQtdGC0LAg0YLQtdC60YPRidC10LPQviDQv9C+0LvQvtC20LXQvdC40Y8g0LrQvtC+0YDQtNC40L3QsNGC0L3QvtC5XG4gKiDQv9C70L7RgdC60L7RgdGC0Lgg0LIg0L7QsdC70LDRgdGC0Lgg0L/RgNC+0YHQvNC+0YLRgNCwINCy0L4g0LLRgNC10LzRjyDRgdC+0LHRi9GC0LjQuSDQv9C10YDQtdC80LXRidC10L3QuNGPINC4INC30YPQvNC40YDQvtCy0LDQvdC40Y8g0LrQsNC90LLQsNGB0LAuXG4gKlxuICogQHBhcmFtIG1hdHJpeCAtINCe0YHQvdC+0LLQvdCw0Y8g0LzQsNGC0YDQuNGG0LAg0YLRgNCw0L3RgdGE0L7RgNC80LDRhtC40LggM3gzINCyINCy0LjQtNC1INC+0LTQvdC+0LzQtdGA0L3QvtCz0L4g0LzQsNGB0YHQuNCy0LAg0LjQtyA5INGN0LvQtdC80LXQvdGC0L7Qsi5cbiAqIEBwYXJhbSBzdGFydEludk1hdHJpeCAtINCS0YHQv9C+0LzQvtCz0LDRgtC10LvRjNC90LDRjyDQvNCw0YLRgNC40YbQsCDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuC5cbiAqIEBwYXJhbSBzdGFydENhbWVyYVggLSDQktGB0L/QvtC80L7Qs9Cw0YLQtdC70YzQvdCw0Y8g0YLQvtGH0LrQsCDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuC5cbiAqIEBwYXJhbSBzdGFydENhbWVyYVkgLSDQktGB0L/QvtC80L7Qs9Cw0YLQtdC70YzQvdCw0Y8g0YLQvtGH0LrQsCDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuC5cbiAqIEBwYXJhbSBzdGFydFBvc1ggLSDQktGB0L/QvtC80L7Qs9Cw0YLQtdC70YzQvdCw0Y8g0YLQvtGH0LrQsCDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuC5cbiAqIEBwYXJhbSBzdGFydFBvc1kgLSDQktGB0L/QvtC80L7Qs9Cw0YLQtdC70YzQvdCw0Y8g0YLQvtGH0LrQsCDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuC5cbiAqL1xuaW50ZXJmYWNlIFNQbG90VHJhbnNmb3JtYXRpb24ge1xuICBtYXRyaXg6IG51bWJlcltdLFxuICBzdGFydEludk1hdHJpeDogbnVtYmVyW10sXG4gIHN0YXJ0Q2FtZXJhWDogbnVtYmVyLFxuICBzdGFydENhbWVyYVk6IG51bWJlcixcbiAgc3RhcnRQb3NYOiBudW1iZXIsXG4gIHN0YXJ0UG9zWTogbnVtYmVyXG59XG5cbi8qKlxuICog0KLQuNC/INC00LvRjyDQuNC90YTQvtGA0LzQsNGG0LjQuCDQviDQsdGD0YTQtdGA0LDRhSwg0YTQvtGA0LzQuNGA0YPRjtGJ0LjRhSDQtNCw0L3QvdGL0LUg0LTQu9GPINC30LDQs9GA0YPQt9C60Lgg0LIg0LLQuNC00LXQvtC/0LDQvNGP0YLRjC5cbiAqXG4gKiBAcGFyYW0gdmVydGV4QnVmZmVycyAtINCc0LDRgdGB0LjQsiDQsdGD0YTQtdGA0L7QsiDRgSDQuNC90YTQvtGA0LzQsNGG0LjQtdC5INC+INCy0LXRgNGI0LjQvdCw0YUg0L/QvtC70LjQs9C+0L3QvtCyLlxuICogQHBhcmFtIGNvbG9yQnVmZmVycyAtINCc0LDRgdGB0LjQsiDQsdGD0YTQtdGA0L7QsiDRgSDQuNC90YTQvtGA0LzQsNGG0LjQtdC5INC+INGG0LLQtdGC0LDRhSDQstC10YDRiNC40L0g0L/QvtC70LjQs9C+0L3QvtCyLlxuICogQHBhcmFtIGluZGV4QnVmZmVycyAtINCc0LDRgdGB0LjQsiDQsdGD0YTQtdGA0L7QsiDRgSDQuNC90LTQtdC60YHQsNC80Lgg0LLQtdGA0YjQuNC9INC/0L7Qu9C40LPQvtC90L7Qsi5cbiAqIEBwYXJhbSBhbW91bnRPZkJ1ZmZlckdyb3VwcyAtINCa0L7Qu9C40YfQtdGB0YLQstC+INCx0YPRhNC10YDQvdGL0YUg0LPRgNGD0L/QvyDQsiDQvNCw0YHRgdC40LLQtS4g0JLRgdC1INGD0LrQsNC30LDQvdC90YvQtSDQstGL0YjQtSDQvNCw0YHRgdC40LLRiyDQsdGD0YTQtdGA0L7QsiDRgdC+0LTQtdGA0LbQsNGCXG4gKiAgICAg0L7QtNC40L3QsNC60L7QstC+0LUg0LrQvtC70LjRh9C10YHRgtCy0L4g0LHRg9GE0LXRgNC+0LIuXG4gKiBAcGFyYW0gYW1vdW50T2ZHTFZlcnRpY2VzIC0g0JrQvtC70LjRh9C10YHRgtCy0L4g0LLQtdGA0YjQuNC9LCDQvtCx0YDQsNC30YPRjtGJ0LjRhSBHTC3RgtGA0LXRg9Cz0L7Qu9GM0L3QuNC60Lgg0LrQsNC20LTQvtCz0L4g0LLQtdGA0YjQuNC90L3QvtCz0L4g0LHRg9GE0LXRgNCwLlxuICogQHBhcmFtIGFtb3VudE9mU2hhcGVzIC0g0JrQvtC70LjRh9C10YHRgtCy0L4g0L/QvtC70LjQs9C+0L3QvtCyINC60LDQttC00L7QuSDRhNC+0YDQvNGLICjRgdC60L7Qu9GM0LrQviDRgtGA0LXRg9Cz0L7Qu9GM0L3QuNC60L7Qsiwg0LrQstCw0LTRgNCw0YLQvtCyLCDQutGA0YPQs9C+0LIg0Lgg0YIu0LQuKS5cbiAqIEBwYXJhbSBhbW91bnRPZlRvdGFsVmVydGljZXMgLSDQntCx0YnQtdC1INC60L7Qu9C40YfQtdGB0YLQstC+INCy0LXRgNGI0LjQvSDQstGB0LXRhSDQstC10YDRiNC40L3QvdGL0YUg0LHRg9GE0LXRgNC+0LIgKHZlcnRleEJ1ZmZlcnMpLlxuICogQHBhcmFtIGFtb3VudE9mVG90YWxHTFZlcnRpY2VzIC0g0J7QsdGJ0LXQtSDQutC+0LvQuNGH0LXRgdGC0LLQviDQstC10YDRiNC40L0g0LLRgdC10YUg0LjQvdC00LXQutGB0L3Ri9GFINCx0YPRhNC10YDQvtCyIChpbmRleEJ1ZmZlcnMpLlxuICogQHBhcmFtIHNpemVJbkJ5dGVzIC0g0KDQsNC30LzQtdGA0Ysg0LHRg9GE0LXRgNC+0LIg0LrQsNC20LTQvtCz0L4g0YLQuNC/0LAgKNC00LvRjyDQstC10YDRiNC40L0sINC00LvRjyDRhtCy0LXRgtC+0LIsINC00LvRjyDQuNC90LTQtdC60YHQvtCyKSDQsiDQsdCw0LnRgtCw0YUuXG4gKi9cbmludGVyZmFjZSBTUGxvdEJ1ZmZlcnMge1xuICB2ZXJ0ZXhCdWZmZXJzOiBXZWJHTEJ1ZmZlcltdLFxuICBjb2xvckJ1ZmZlcnM6IFdlYkdMQnVmZmVyW10sXG4gIGluZGV4QnVmZmVyczogV2ViR0xCdWZmZXJbXSxcbiAgYW1vdW50T2ZCdWZmZXJHcm91cHM6IG51bWJlcixcbiAgYW1vdW50T2ZHTFZlcnRpY2VzOiBudW1iZXJbXSxcbiAgYW1vdW50T2ZTaGFwZXM6IG51bWJlcltdLFxuICBhbW91bnRPZlRvdGFsVmVydGljZXM6IG51bWJlcixcbiAgYW1vdW50T2ZUb3RhbEdMVmVydGljZXM6IG51bWJlcixcbiAgc2l6ZUluQnl0ZXM6IG51bWJlcltdXG59XG5cbi8qKlxuICog0KLQuNC/INC00LvRjyDQuNC90YTQvtGA0LzQsNGG0LjQuCDQviDQs9GA0YPQv9C/0LUg0L/QvtC70LjQs9C+0L3QvtCyLCDQutC+0YLQvtGA0YPRjiDQvNC+0LbQvdC+INC+0YLQvtCx0YDQsNC30LjRgtGMINC90LAg0LrQsNC90LLQsNGB0LUg0LfQsCDQvtC00LjQvSDQstGL0LfQvtCyINGE0YPQvdC60YbQuNC4IHtAbGluayBkcmF3RWxlbWVudHN9LlxuICpcbiAqIEBwYXJhbSB2ZXJ0aWNlcyAtINCc0LDRgdGB0LjQsiDQstC10YDRiNC40L0g0LLRgdC10YUg0L/QvtC70LjQs9C+0L3QvtCyINCz0YDRg9C/0L/Riy4g0JrQsNC20LTQsNGPINCy0LXRgNGI0LjQvdCwIC0g0Y3RgtC+INC/0LDRgNCwINGH0LjRgdC10LsgKNC60L7QvtGA0LTQuNC90LDRgtGLINCy0LXRgNGI0LjQvdGLINC90LBcbiAqICAgICDQv9C70L7RgdC60L7RgdGC0LgpLiDQmtC+0L7RgNC00LjQvdCw0YLRiyDQvNC+0LPRg9GCINCx0YvRgtGMINC60LDQuiDRhtC10LvRi9C80LgsINGC0LDQuiDQuCDQstC10YnQtdGB0YLQstC10L3QvdGL0LzQuCDRh9C40YHQu9Cw0LzQuC5cbiAqIEBwYXJhbSBpbmRpY2VzIC0g0JzQsNGB0YHQuNCyINC40L3QtNC10LrRgdC+0LIg0LLQtdGA0YjQuNC9INC/0L7Qu9C40LPQvtC90L7QsiDQs9GA0YPQv9C/0YsuINCa0LDQttC00YvQuSDQuNC90LTQtdC60YEgLSDRjdGC0L4g0L3QvtC80LXRgCDQstC10YDRiNC40L3RiyDQsiDQvNCw0YHRgdC40LLQtSDQstC10YDRiNC40L0uINCY0L3QtNC10LrRgdGLXG4gKiAgICAg0L7Qv9C40YHRi9Cy0LDRjtGCINCy0YHQtSBHTC3RgtGA0LXRg9Cz0L7Qu9GM0L3QuNC60LgsINC40Lcg0LrQvtGC0L7RgNGL0YUg0YHQvtGB0YLQvtGP0YIg0L/QvtC70LjQs9C+0L3RiyDQs9GA0YPQv9C/0YssINGCLtC+LiDQutCw0LbQtNCw0Y8g0YLRgNC+0LnQutCwINC40L3QtNC10LrRgdC+0LIg0LrQvtC00LjRgNGD0LXRgiDQvtC00LjQvVxuICogICAgIEdMLdGC0YDQtdGD0LPQvtC70YzQvdC40LouINCY0L3QtNC10LrRgdGLIC0g0Y3RgtC+INGG0LXQu9GL0LUg0YfQuNGB0LvQsCDQsiDQtNC40LDQv9Cw0LfQvtC90LUg0L7RgiAwINC00L4gNjU1MzUsINGH0YLQviDQvdCw0LrQu9Cw0LTRi9Cy0LDQtdGCINC+0LPRgNCw0L3QuNGH0LXQvdC40LUg0L3QsCDQvNCw0LrRgdC40LzQsNC70YzQvdC+0LVcbiAqICAgICDQutC+0LvQuNGH0LXRgdGC0LLQviDQstC10YDRiNC40L0sINGF0YDQsNC90LjQvNGL0YUg0LIg0LPRgNGD0L/Qv9C1INC/0L7Qu9C40LPQvtC90L7QsiAo0L3QtSDQsdC+0LvQtdC1IDMyNzY4INGI0YLRg9C6KS5cbiAqIEBwYXJhbSBjb2xvcnMgLSDQnNCw0YHRgdC40LIg0YbQstC10YLQvtCyINCy0LXRgNGI0LjQvSDQv9C+0LvQuNCz0L7QvdC+0LIg0LPRgNGD0L/Qv9GLLiDQmtCw0LbQtNC+0LUg0YfQuNGB0LvQviDQt9Cw0LTQsNC10YIg0YbQstC10YIg0L7QtNC90L7QuSDQstC10YDRiNC40L3RiyDQsiDQvNCw0YHRgdC40LLQtSDQstC10YDRiNC40L0uINCn0YLQvtCx0YtcbiAqICAgICDQv9C+0LvQuNCz0L7QvSDQsdGL0Lsg0YHQv9C70L7RiNC90L7Qs9C+INC+0LTQvdC+0YDQvtC00L3QvtCz0L4g0YbQstC10YLQsCDQvdC10L7QsdGF0L7QtNC40LzQviDRh9GC0L7QsdGLINCy0YHQtSDQstC10YDRiNC40L3RiyDQv9C+0LvQuNCz0L7QvdCwINC40LzQtdC70Lgg0L7QtNC40L3QsNC60L7QstGL0Lkg0YbQstC10YIuINCm0LLQtdGCIC0g0Y3RgtC+XG4gKiAgICAg0YbQtdC70L7QtSDRh9C40YHQu9C+INCyINC00LjQsNC/0LDQt9C+0L3QtSDQvtGCIDAg0LTQviAyNTUsINC/0YDQtdC00YHRgtCw0LLQu9GP0Y7RidC10LUg0YHQvtCx0L7QuSDQuNC90LTQtdC60YEg0YbQstC10YLQsCDQsiDQv9GA0LXQtNC+0L/RgNC10LTQtdC70LXQvdC90L7QvCDQvNCw0YHRgdC40LLQtSDRhtCy0LXRgtC+0LIuXG4gKiBAcGFyYW0gYW1vdW50T2ZWZXJ0aWNlcyAtINCa0L7Qu9C40YfQtdGB0YLQstC+INCy0YHQtdGFINCy0LXRgNGI0LjQvSDQsiDQs9GA0YPQv9C/0LUg0L/QvtC70LjQs9C+0L3QvtCyLlxuICogQHBhcmFtIGFtb3VudE9mR0xWZXJ0aWNlcyAtINCa0L7Qu9C40YfQtdGB0YLQstC+INCy0LXRgNGI0LjQvSDQstGB0LXRhSBHTC3RgtGA0LXRg9Cz0L7Qu9GM0L3QuNC60L7QsiDQsiDQs9GA0YPQv9C/0LUg0L/QvtC70LjQs9C+0L3QvtCyLlxuICovXG5pbnRlcmZhY2UgU1Bsb3RQb2x5Z29uR3JvdXAge1xuICB2ZXJ0aWNlczogbnVtYmVyW10sXG4gIGluZGljZXM6IG51bWJlcltdLFxuICBjb2xvcnM6IG51bWJlcltdLFxuICBhbW91bnRPZlZlcnRpY2VzOiBudW1iZXIsXG4gIGFtb3VudE9mR0xWZXJ0aWNlczogbnVtYmVyXG59XG5cbi8qKlxuICog0KLQuNC/INC00LvRjyDQuNC90YTQvtGA0LzQsNGG0LjQuCDQviDQstC10YDRiNC40L3QsNGFINC/0L7Qu9C40LPQvtC90LAuXG4gKlxuICogQHBhcmFtIHZlcnRpY2VzIC0g0JzQsNGB0YHQuNCyINCy0YHQtdGFINCy0LXRgNGI0LjQvSDQv9C+0LvQuNCz0L7QvdCwLiDQmtCw0LbQtNCw0Y8g0LLQtdGA0YjQuNC90LAgLSDRjdGC0L4g0L/QsNGA0LAg0YfQuNGB0LXQuyAo0LrQvtC+0YDQtNC40L3QsNGC0Ysg0LLQtdGA0YjQuNC90Ysg0L3QsFxuICogICAgINC/0LvQvtGB0LrQvtGB0YLQuCkuINCa0L7QvtGA0LTQuNC90LDRgtGLINC80L7Qs9GD0YIg0LHRi9GC0Ywg0LrQsNC6INGG0LXQu9GL0LzQuCwg0YLQsNC6INC4INCy0LXRidC10YHRgtCy0LXQvdC90YvQvNC4INGH0LjRgdC70LDQvNC4LlxuICogQHBhcmFtIGluZGljZXMgLSDQnNCw0YHRgdC40LIg0LjQvdC00LXQutGB0L7QsiDQstC10YDRiNC40L0g0L/QvtC70LjQs9C+0L3QsC4g0JrQsNC20LTRi9C5INC40L3QtNC10LrRgSAtINGN0YLQviDQvdC+0LzQtdGAINCy0LXRgNGI0LjQvdGLINCyINC80LDRgdGB0LjQstC1INCy0LXRgNGI0LjQvS4g0JjQvdC00LXQutGB0YtcbiAqICAgICDQvtC/0LjRgdGL0LLQsNGO0YIg0LLRgdC1IEdMLdGC0YDQtdGD0LPQvtC70YzQvdC40LrQuCwg0LjQtyDQutC+0YLQvtGA0YvRhSDRgdC+0YHRgtC+0LjRgiDQv9C+0LvQuNCz0L7QvS5cbiAqL1xuaW50ZXJmYWNlIFNQbG90UG9seWdvblZlcnRpY2VzIHtcbiAgdmFsdWVzOiBudW1iZXJbXSxcbiAgaW5kaWNlczogbnVtYmVyW11cbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU1Bsb3Qge1xuXG4gIC8qKlxuICAgKiDQnNCw0YHRgdC40LIg0LrQu9Cw0YHRgdCwLCDRgdC+0LTQtdGA0LbQsNGJ0LjQuSDRgdGB0YvQu9C60Lgg0L3QsCDQstGB0LUg0YHQvtC30LTQsNC90L3Ri9C1INGN0LrQt9C10LzQv9C70Y/RgNGLINC60LvQsNGB0YHQsC4g0JjQvdC00LXQutGB0LDQvNC4INC80LDRgdGB0LjQstCwINCy0YvRgdGC0YPQv9Cw0Y7RgiDQuNC00LXQvdGC0LjRhNC40LrQsNGC0L7RgNGLXG4gICAqINC60LDQvdCy0LDRgdC+0LIg0Y3QutC30LXQvNC/0LvRj9GA0L7Qsi4g0JjRgdC/0L7Qu9GM0LfRg9C10YLRgdGPINC00LvRjyDQtNC+0YHRgtGD0L/QsCDQuiDQv9C+0LvRj9C8INC4INC80LXRgtC+0LTQsNC8INGN0LrQt9C10LzQv9C70Y/RgNCwINC40Lcg0YLQtdC70LAg0LLQvdC10YjQvdC40YUg0L7QsdGA0LDQsdC+0YfQuNC60L7QsiDRgdC+0LHRi9GC0LjQuVxuICAgKiDQvNGL0YjQuC/RgtGA0LXQutC/0LDQtNCwLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBpbnN0YW5jZXM6IHsgW2tleTogc3RyaW5nXTogU1Bsb3QgfSA9IHt9XG5cbiAgLy8g0KTRg9C90LrRhtC40Y8g0L/QviDRg9C80L7Qu9GH0LDQvdC40Y4g0LTQu9GPINC40YLQtdGA0LjRgNC+0LLQsNC90LjRjyDQvtCx0YrQtdC60YLQvtCyINC90LUg0LfQsNC00LDQtdGC0YHRjy5cbiAgcHVibGljIGl0ZXJhdGlvbkNhbGxiYWNrPzogU1Bsb3RJdGVyYXRpb25GdW5jdGlvblxuXG4gIC8vINCm0LLQtdGC0L7QstCw0Y8g0L/QsNC70LjRgtGA0LAg0L/QvtC70LjQs9C+0L3QvtCyINC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOLlxuICBwdWJsaWMgcG9seWdvblBhbGV0dGU6IEhFWENvbG9yW10gPSBbXG4gICAgJyNGRjAwRkYnLCAnIzgwMDA4MCcsICcjRkYwMDAwJywgJyM4MDAwMDAnLCAnI0ZGRkYwMCcsXG4gICAgJyMwMEZGMDAnLCAnIzAwODAwMCcsICcjMDBGRkZGJywgJyMwMDAwRkYnLCAnIzAwMDA4MCdcbiAgXVxuXG4gIC8vINCg0LDQt9C80LXRgCDQutC+0L7RgNC00LjQvdCw0YLQvdC+0Lkg0L/Qu9C+0YHQutC+0YHRgtC4INC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOLlxuICBwdWJsaWMgZ3JpZFNpemU6IFNQbG90R3JpZFNpemUgPSB7XG4gICAgd2lkdGg6IDMyXzAwMCxcbiAgICBoZWlnaHQ6IDE2XzAwMFxuICB9XG5cbiAgLy8g0KDQsNC30LzQtdGAINC/0L7Qu9C40LPQvtC90LAg0L/QviDRg9C80L7Qu9GH0LDQvdC40Y4uXG4gIHB1YmxpYyBwb2x5Z29uU2l6ZTogbnVtYmVyID0gMjBcblxuICAvLyDQodGC0LXQv9C10L3RjCDQtNC10YLQsNC70LjQt9Cw0YbQuNC4INC60YDRg9Cz0LAg0L/QviDRg9C80L7Qu9GH0LDQvdC40Y4uXG4gIHB1YmxpYyBjaXJjbGVBcHByb3hMZXZlbDogbnVtYmVyID0gMTJcblxuICAvLyDQn9Cw0YDQsNC80LXRgtGA0Ysg0YDQtdC20LjQvNCwINC+0YLQu9Cw0LTQutC4INC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOLlxuICBwdWJsaWMgZGVidWdNb2RlOiBTUGxvdERlYnVnTW9kZSA9IHtcbiAgICBpc0VuYWJsZTogZmFsc2UsXG4gICAgb3V0cHV0OiAnY29uc29sZScsXG4gICAgaGVhZGVyU3R5bGU6ICdmb250LXdlaWdodDogYm9sZDsgY29sb3I6ICNmZmZmZmY7IGJhY2tncm91bmQtY29sb3I6ICNjYzAwMDA7JyxcbiAgICBncm91cFN0eWxlOiAnZm9udC13ZWlnaHQ6IGJvbGQ7IGNvbG9yOiAjZmZmZmZmOydcbiAgfVxuXG4gIC8vINCf0LDRgNCw0LzQtdGC0YDRiyDRgNC10LbQuNC80LAg0LTQtdC80L7RgdGC0YDQsNGG0LjQvtC90L3Ri9GFINC00LDQvdC90YvRhSDQv9C+INGD0LzQvtC70YfQsNC90LjRji5cbiAgcHVibGljIGRlbW9Nb2RlOiBTUGxvdERlbW9Nb2RlID0ge1xuICAgIGlzRW5hYmxlOiBmYWxzZSxcbiAgICBhbW91bnQ6IDFfMDAwXzAwMCxcbiAgICAvKipcbiAgICAgKiDQn9C+INGD0LzQvtC70YfQsNC90LjRjiDQsiDRgNC10LbQuNC80LUg0LTQtdC80L4t0LTQsNC90L3Ri9GFINCx0YPQtNGD0YIg0L/QvtGA0L7QstC90YMg0L7RgtC+0LHRgNCw0LbQsNGC0YzRgdGPINC/0L7Qu9C40LPQvtC90Ysg0LLRgdC10YUg0LLQvtC30LzQvtC20L3Ri9GFINGE0L7RgNC8LiDQodC+0L7RgtCy0LXRgtGB0YLQstGD0Y7RidC40LVcbiAgICAgKiDQt9C90LDRh9C10L3QuNGPINC80LDRgdGB0LjQstCwINC40L3QuNGG0LjQsNC70LjQt9C40YDRg9GO0YLRgdGPINC/0YDQuCDRgNC10LPQuNGB0YLRgNCw0YbQuNC4INGE0YPQvdC60YbQuNC5INGB0L7Qt9C00LDQvdC40Y8g0YTQvtGA0Lwg0LzQtdGC0L7QtNC+0Lwge0BsaW5rIHJlZ2lzdGVyU2hhcGV9LlxuICAgICAqL1xuICAgIHNoYXBlUXVvdGE6IFtdLFxuICAgIGluZGV4OiAwXG4gIH1cblxuICAvLyDQn9GA0LjQt9C90LDQuiDQv9C+INGD0LzQvtC70YfQsNC90LjRjiDRhNC+0YDRgdC40YDQvtCy0LDQvdC90L7Qs9C+INC30LDQv9GD0YHQutCwINGA0LXQvdC00LXRgNCwLlxuICBwdWJsaWMgZm9yY2VSdW46IGJvb2xlYW4gPSBmYWxzZVxuXG4gIC8qKlxuICAgKiDQn9C+INGD0LzQvtC70YfQsNC90LjRjiDQuNGB0LrRg9GB0YHRgtCy0LXQvdC90L7Qs9C+INC+0LPRgNCw0L3QuNGH0LXQvdC40Y8g0L3QsCDQutC+0LvQuNGH0LXRgdGC0LLQviDQvtGC0L7QsdGA0LDQttCw0LXQvNGL0YUg0L/QvtC70LjQs9C+0L3QvtCyINC90LXRgiAo0LfQsCDRgdGH0LXRgiDQt9Cw0LTQsNC90LjRjyDQsdC+0LvRjNGI0L7Qs9C+INC30LDQstC10LTQvtC80L5cbiAgICog0L3QtdC00L7RgdGC0LjQttC40LzQvtCz0L4g0L/QvtGA0L7Qs9C+0LLQvtCz0L4g0YfQuNGB0LvQsCkuXG4gICAqL1xuICBwdWJsaWMgbWF4QW1vdW50T2ZQb2x5Z29uczogbnVtYmVyID0gMV8wMDBfMDAwXzAwMFxuXG4gIC8vINCk0L7QvdC+0LLRi9C5INGG0LLQtdGCINC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOINC00LvRjyDQutCw0L3QstCw0YHQsC5cbiAgcHVibGljIGJnQ29sb3I6IEhFWENvbG9yID0gJyNmZmZmZmYnXG5cbiAgLy8g0KbQstC10YIg0L/QviDRg9C80L7Qu9GH0LDQvdC40Y4g0LTQu9GPINC90LDQv9GA0LDQstC70Y/RjtGJ0LjRhS5cbiAgcHVibGljIHJ1bGVzQ29sb3I6IEhFWENvbG9yID0gJyNjMGMwYzAnXG5cbiAgLy8g0J/QviDRg9C80L7Qu9GH0LDQvdC40Y4g0L7QsdC70LDRgdGC0Ywg0L/RgNC+0YHQvNC+0YLRgNCwINGD0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdGC0YHRjyDQsiDRhtC10L3RgtGAINC60L7QvtGA0LTQuNC90LDRgtC90L7QuSDQv9C70L7QvtGB0LrQvtGB0YLQuC5cbiAgcHVibGljIGNhbWVyYTogU1Bsb3RDYW1lcmEgPSB7XG4gICAgeDogdGhpcy5ncmlkU2l6ZS53aWR0aCAvIDIsXG4gICAgeTogdGhpcy5ncmlkU2l6ZS5oZWlnaHQgLyAyLFxuICAgIHpvb206IDFcbiAgfVxuXG4gIC8qKlxuICAgKiDQn9C+INGD0LzQvtC70YfQsNC90LjRjiDQvdCw0YHRgtGA0L7QudC60Lgg0LrQvtC90YLQtdC60YHRgtCwINGA0LXQvdC00LXRgNC40L3Qs9CwIFdlYkdMINC80LDQutGB0LjQvNC40LfQuNGA0YPRjtGCINC/0YDQvtC40LfQstC+0LTQuNGC0LXQu9GM0L3QvtGB0YLRjCDQs9GA0LDRhNC40YfQtdGB0LrQvtC5INGB0LjRgdGC0LXQvNGLLiDQodC/0LXRhtC40LDQu9GM0L3Ri9GFXG4gICAqINC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjNGB0LrQuNGFINC/0YDQtdC00YPRgdGC0LDQvdC+0LLQvtC6INC90LUg0YLRgNC10LHRg9C10YLRgdGPLCDQvtC00L3QsNC60L4g0L/RgNC40LvQvtC20LXQvdC40LUg0L/QvtC30LLQvtC70Y/QtdGCINGN0LrRgdC/0LXRgNC40LzQtdC90YLQuNGA0L7QstCw0YLRjCDRgSDQvdCw0YHRgtGA0L7QudC60LDQvNC4INCz0YDQsNGE0LjQutC4LlxuICAgKi9cbiAgcHVibGljIHdlYkdsU2V0dGluZ3M6IFdlYkdMQ29udGV4dEF0dHJpYnV0ZXMgPSB7XG4gICAgYWxwaGE6IGZhbHNlLFxuICAgIGRlcHRoOiBmYWxzZSxcbiAgICBzdGVuY2lsOiBmYWxzZSxcbiAgICBhbnRpYWxpYXM6IGZhbHNlLFxuICAgIHByZW11bHRpcGxpZWRBbHBoYTogZmFsc2UsXG4gICAgcHJlc2VydmVEcmF3aW5nQnVmZmVyOiBmYWxzZSxcbiAgICBwb3dlclByZWZlcmVuY2U6ICdoaWdoLXBlcmZvcm1hbmNlJyxcbiAgICBmYWlsSWZNYWpvclBlcmZvcm1hbmNlQ2F2ZWF0OiBmYWxzZSxcbiAgICBkZXN5bmNocm9uaXplZDogZmFsc2VcbiAgfVxuXG4gIC8vINCf0YDQuNC30L3QsNC6INCw0LrRgtC40LLQvdC+0LPQviDQv9GA0L7RhtC10YHRgdCwINGA0LXQvdC00LXRgNCwLiDQlNC+0YHRgtGD0L/QtdC9INC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjiDQv9GA0LjQu9C+0LbQtdC90LjRjyDRgtC+0LvRjNC60L4g0LTQu9GPINGH0YLQtdC90LjRjy5cbiAgcHVibGljIGlzUnVubmluZzogYm9vbGVhbiA9IGZhbHNlXG5cbiAgLy8g0J7QsdGK0LXQutGCINC60LDQvdCy0LDRgdCwLlxuICBwcm90ZWN0ZWQgcmVhZG9ubHkgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudFxuXG4gIC8vINCe0LHRitC10LrRgiDQutC+0L3RgtC10LrRgdGC0LAg0YDQtdC90LTQtdGA0LjQvdCz0LAgV2ViR0wuXG4gIHByb3RlY3RlZCBnbCE6IFdlYkdMUmVuZGVyaW5nQ29udGV4dFxuXG4gIC8vINCe0LHRitC10LrRgiDQv9GA0L7Qs9GA0LDQvNC80YsgV2ViR0wuXG4gIHByb3RlY3RlZCBncHVQcm9ncmFtITogV2ViR0xQcm9ncmFtXG5cbiAgLy8g0J/QtdGA0LXQvNC10L3QvdGL0LUg0LTQu9GPINGB0LLRj9C30Lgg0L/RgNC40LvQvtC20LXQvdC40Y8g0YEg0L/RgNC+0LPRgNCw0LzQvNC+0LkgV2ViR0wuXG4gIHByb3RlY3RlZCB2YXJpYWJsZXM6IHsgW2tleTogc3RyaW5nXTogYW55IH0gPSB7fVxuXG4gIC8qKlxuICAgKiDQqNCw0LHQu9C+0L0gR0xTTC3QutC+0LTQsCDQtNC70Y8g0LLQtdGA0YjQuNC90L3QvtCz0L4g0YjQtdC50LTQtdGA0LAuINCh0L7QtNC10YDQttC40YIg0YHQv9C10YbQuNCw0LvRjNC90YPRjiDQstGB0YLQsNCy0LrRgyBcIlNFVC1WRVJURVgtQ09MT1ItQ09ERVwiLCDQutC+0YLQvtGA0LDRjyDQv9C10YDQtdC0XG4gICAqINGB0L7Qt9C00LDQvdC40LXQvCDRiNC10LnQtNC10YDQsCDQt9Cw0LzQtdC90Y/QtdGC0YHRjyDQvdCwIEdMU0wt0LrQvtC0INCy0YvQsdC+0YDQsCDRhtCy0LXRgtCwINCy0LXRgNGI0LjQvS5cbiAgICovXG4gIHByb3RlY3RlZCByZWFkb25seSBfdmVydGV4U2hhZGVyQ29kZVRlbXBsYXRlOiBzdHJpbmcgPVxuICAgICdhdHRyaWJ1dGUgdmVjMiBhX3Bvc2l0aW9uO1xcbicgK1xuICAgICdhdHRyaWJ1dGUgZmxvYXQgYV9jb2xvcjtcXG4nICtcbiAgICAndW5pZm9ybSBtYXQzIHVfbWF0cml4O1xcbicgK1xuICAgICd2YXJ5aW5nIHZlYzMgdl9jb2xvcjtcXG4nICtcbiAgICAndm9pZCBtYWluKCkge1xcbicgK1xuICAgICcgIGdsX1Bvc2l0aW9uID0gdmVjNCgodV9tYXRyaXggKiB2ZWMzKGFfcG9zaXRpb24sIDEpKS54eSwgMC4wLCAxLjApO1xcbicgK1xuICAgICcgIFNFVC1WRVJURVgtQ09MT1ItQ09ERScgK1xuICAgICd9XFxuJ1xuXG4gIC8vINCo0LDQsdC70L7QvSBHTFNMLdC60L7QtNCwINC00LvRjyDRhNGA0LDQs9C80LXQvdGC0L3QvtCz0L4g0YjQtdC50LTQtdGA0LAuXG4gIHByb3RlY3RlZCByZWFkb25seSBmcmFnbWVudFNoYWRlckNvZGVUZW1wbGF0ZTogc3RyaW5nID1cbiAgICAncHJlY2lzaW9uIGxvd3AgZmxvYXQ7XFxuJyArXG4gICAgJ3ZhcnlpbmcgdmVjMyB2X2NvbG9yO1xcbicgK1xuICAgICd2b2lkIG1haW4oKSB7XFxuJyArXG4gICAgJyAgZ2xfRnJhZ0NvbG9yID0gdmVjNCh2X2NvbG9yLnJnYiwgMS4wKTtcXG4nICtcbiAgICAnfVxcbidcblxuICAvLyDQodGH0LXRgtGH0LjQuiDRh9C40YHQu9CwINC+0LHRgNCw0LHQvtGC0LDQvdC90YvRhSDQv9C+0LvQuNCz0L7QvdC+0LIuXG4gIHByb3RlY3RlZCBhbW91bnRPZlBvbHlnb25zOiBudW1iZXIgPSAwXG5cbiAgLyoqXG4gICAqICAg0J3QsNCx0L7RgCDQstGB0L/QvtC80L7Qs9Cw0YLQtdC70YzQvdGL0YUg0LrQvtC90YHRgtCw0L3Rgiwg0LjRgdC/0L7Qu9GM0LfRg9C10LzRi9GFINCyINGH0LDRgdGC0L4g0L/QvtCy0YLQvtGA0Y/RjtGJ0LjRhdGB0Y8g0LLRi9GH0LjRgdC70LXQvdC40Y/RhS4g0KDQsNGB0YHRh9C40YLRi9Cy0LDQtdGC0YHRjyDQuCDQt9Cw0LTQsNC10YLRgdGPINCyXG4gICAqICAg0LzQtdGC0L7QtNC1IHtAbGluayBzZXRVc2VmdWxDb25zdGFudHN9LlxuICAgKi9cbiAgcHJvdGVjdGVkIFVTRUZVTF9DT05TVFM6IGFueVtdID0gW11cblxuICAvLyDQotC10YXQvdC40YfQtdGB0LrQsNGPINC40L3RhNC+0YDQvNCw0YbQuNGPLCDQuNGB0L/QvtC70YzQt9GD0LXQvNCw0Y8g0L/RgNC40LvQvtC20LXQvdC40LXQvCDQtNC70Y8g0YDQsNGB0YfQtdGC0LAg0YLRgNCw0L3RgdGE0L7RgNC80LDRhtC40LkuXG4gIHByb3RlY3RlZCB0cmFuc29ybWF0aW9uOiBTUGxvdFRyYW5zZm9ybWF0aW9uID0ge1xuICAgIG1hdHJpeDogW10sXG4gICAgc3RhcnRJbnZNYXRyaXg6IFtdLFxuICAgIHN0YXJ0Q2FtZXJhWDogMCxcbiAgICBzdGFydENhbWVyYVk6IDAsXG4gICAgc3RhcnRQb3NYOiAwLFxuICAgIHN0YXJ0UG9zWTogMFxuICB9XG5cbiAgLyoqXG4gICAqINCc0LDQutGB0LjQvNCw0LvRjNC90L7QtSDQstC+0LfQvNC+0LbQvdC+0LUg0LrQvtC70LjRh9C10YHRgtCy0L4g0LLQtdGA0YjQuNC9INCyINCz0YDRg9C/0L/QtSDQv9C+0LvQuNCz0L7QvdC+0LIsINC60L7RgtC+0YDQvtC1INC10YnQtSDQtNC+0L/Rg9GB0LrQsNC10YIg0LTQvtCx0LDQstC70LXQvdC40LUg0L7QtNC90L7Qs9C+INGB0LDQvNC+0LPQvlxuICAgKiDQvNC90L7Qs9C+0LLQtdGA0YjQuNC90L3QvtCz0L4g0L/QvtC70LjQs9C+0L3QsC4g0K3RgtC+INC60L7Qu9C40YfQtdGB0YLQstC+INC40LzQtdC10YIg0L7QsdGK0LXQutGC0LjQstC90L7QtSDRgtC10YXQvdC40YfQtdGB0LrQvtC1INC+0LPRgNCw0L3QuNGH0LXQvdC40LUsINGCLtC6LiDRhNGD0L3QutGG0LjRj1xuICAgKiB7QGxpbmsgZHJhd0VsZW1lbnRzfSDQvdC1INC/0L7Qt9Cy0L7Qu9GP0LXRgiDQutC+0YDRgNC10LrRgtC90L4g0L/RgNC40L3QuNC80LDRgtGMINCx0L7Qu9GM0YjQtSA2NTUzNiDQuNC90LTQtdC60YHQvtCyICgzMjc2OCDQstC10YDRiNC40L0pLlxuICAgKi9cbiAgcHJvdGVjdGVkIG1heEFtb3VudE9mVmVydGV4UGVyUG9seWdvbkdyb3VwOiBudW1iZXIgPSAzMjc2OCAtICh0aGlzLmNpcmNsZUFwcHJveExldmVsICsgMSk7XG5cbiAgLy8g0JjQvdGE0L7RgNC80LDRhtC40Y8g0L4g0LHRg9GE0LXRgNCw0YUsINGF0YDQsNC90Y/RidC40YUg0LTQsNC90L3Ri9C1INC00LvRjyDQstC40LTQtdC+0L/QsNC80Y/RgtC4LlxuICBwcm90ZWN0ZWQgYnVmZmVyczogU1Bsb3RCdWZmZXJzID0ge1xuICAgIHZlcnRleEJ1ZmZlcnM6IFtdLFxuICAgIGNvbG9yQnVmZmVyczogW10sXG4gICAgaW5kZXhCdWZmZXJzOiBbXSxcbiAgICBhbW91bnRPZkdMVmVydGljZXM6IFtdLFxuICAgIGFtb3VudE9mU2hhcGVzOiBbXSxcbiAgICBhbW91bnRPZkJ1ZmZlckdyb3VwczogMCxcbiAgICBhbW91bnRPZlRvdGFsVmVydGljZXM6IDAsXG4gICAgYW1vdW50T2ZUb3RhbEdMVmVydGljZXM6IDAsXG4gICAgc2l6ZUluQnl0ZXM6IFswLCAwLCAwXVxuICB9XG5cbiAgLyoqXG4gICAqINCY0L3RhNC+0YDQvNCw0YbQuNGPINC+INCy0L7Qt9C80L7QttC90YvRhSDRhNC+0YDQvNCw0YUg0L/QvtC70LjQs9C+0L3QvtCyLlxuICAgKiDQmtCw0LbQtNCw0Y8g0YTQvtGA0LzQsCDQv9GA0LXQtNGB0YLQsNCy0LvRj9C10YLRgdGPINGE0YPQvdC60YbQuNC10LksINCy0YvRh9C40YHQu9GP0Y7RidC10Lkg0LXQtSDQstC10YDRiNC40L3RiyDQuCDQvdCw0LfQstCw0L3QuNC10Lwg0YTQvtGA0LzRiy5cbiAgICog0JTQu9GPINGD0LrQsNC30LDQvdC40Y8g0YTQvtGA0LzRiyDQv9C+0LvQuNCz0L7QvdC+0LIg0LIg0L/RgNC40LvQvtC20LXQvdC40Lgg0LjRgdC/0L7Qu9GM0LfRg9GO0YLRgdGPINGH0LjRgdC70L7QstGL0LUg0LjQvdC00LXQutGB0Ysg0LIg0LTQsNC90L3QvtC8INC80LDRgdGB0LjQstC1LlxuICAgKi9cbiAgcHJvdGVjdGVkIHNoYXBlczoge2NhbGM6IFNQbG90Q2FsY1NoYXBlRnVuYywgbmFtZTogc3RyaW5nfVtdID0gW11cblxuICAvKipcbiAgICog0KHQvtC30LTQsNC10YIg0Y3QutC30LXQvNC/0LvRj9GAINC60LvQsNGB0YHQsCwg0LjQvdC40YbQuNCw0LvQuNC30LjRgNGD0LXRgiDQvdCw0YHRgtGA0L7QudC60LguXG4gICAqXG4gICAqIEByZW1hcmtzXG4gICAqINCV0YHQu9C4INC60LDQvdCy0LDRgSDRgSDQt9Cw0LTQsNC90L3Ri9C8INC40LTQtdC90YLQuNGE0LjQutCw0YLQvtGA0L7QvCDQvdC1INC90LDQudC00LXQvSAtINCz0LXQvdC10YDQuNGA0YPQtdGC0YHRjyDQvtGI0LjQsdC60LAuINCd0LDRgdGC0YDQvtC50LrQuCDQvNC+0LPRg9GCINCx0YvRgtGMINC30LDQtNCw0L3RiyDQutCw0Log0LJcbiAgICog0LrQvtC90YHRgtGA0YPQutGC0L7RgNC1LCDRgtCw0Log0Lgg0LIg0LzQtdGC0L7QtNC1IHtAbGluayBzZXR1cH0uINCe0LTQvdCw0LrQviDQsiDQu9GO0LHQvtC8INGB0LvRg9GH0LDQtSDQvdCw0YHRgtGA0L7QudC60Lgg0LTQvtC70LbQvdGLINCx0YvRgtGMINC30LDQtNCw0L3RiyDQtNC+INC30LDQv9GD0YHQutCwINGA0LXQvdC00LXRgNCwLlxuICAgKlxuICAgKiBAcGFyYW0gY2FudmFzSWQgLSDQmNC00LXQvdGC0LjRhNC40LrQsNGC0L7RgCDQutCw0L3QstCw0YHQsCwg0L3QsCDQutC+0YLQvtGA0L7QvCDQsdGD0LTQtdGCINGA0LjRgdC+0LLQsNGC0YzRgdGPINCz0YDQsNGE0LjQui5cbiAgICogQHBhcmFtIG9wdGlvbnMgLSDQn9C+0LvRjNC30L7QstCw0YLQtdC70YzRgdC60LjQtSDQvdCw0YHRgtGA0L7QudC60Lgg0Y3QutC30LXQvNC/0LvRj9GA0LAuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihjYW52YXNJZDogc3RyaW5nLCBvcHRpb25zPzogU1Bsb3RPcHRpb25zKSB7XG5cbiAgICAvLyDQodC+0YXRgNCw0L3QtdC90LjQtSDRgdGB0YvQu9C60Lgg0L3QsCDRjdC60LfQtdC80L/Qu9GP0YAg0LrQu9Cw0YHRgdCwLiDQn9C+0LfQstC+0LvRj9C10YIg0LLQvdC10YjQuNC8INGB0L7QsdGL0YLQuNGP0Lwg0L/QvtC70YPRh9Cw0YLRjCDQtNC+0YHRgtGD0L8g0Log0L/QvtC70Y/QvCDQuCDQvNC10YLQvtC00LDQvCDRjdC60LfQtdC80L/Qu9GP0YDQsC5cbiAgICBTUGxvdC5pbnN0YW5jZXNbY2FudmFzSWRdID0gdGhpc1xuXG4gICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNhbnZhc0lkKSkge1xuICAgICAgdGhpcy5jYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChjYW52YXNJZCkgYXMgSFRNTENhbnZhc0VsZW1lbnRcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCfQmtCw0L3QstCw0YEg0YEg0LjQtNC10L3RgtC40YTQuNC60LDRgtC+0YDQvtC8IFwiIycgKyBjYW52YXNJZCArIMKgJ1wiINC90LUg0L3QsNC50LTQtdC9IScpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog0KDQtdCz0LjRgdGC0YDQsNGG0LjRjyDRgtGA0LXRhSDQsdCw0LfQvtCy0YvRhSDRhNC+0YDQvCDQv9C+0LvQuNCz0L7QvdC+0LIgKNGC0YDQtdGD0LPQvtC70YzQvdC40LrQuCwg0LrQstCw0LTRgNCw0YLRiyDQuCDQutGA0YPQs9C4KS4g0J3QsNC70LjRh9C40LUg0Y3RgtC40YUg0YTQvtGA0Lwg0LIg0YPQutCw0LfQsNC90L3QvtC8INC/0L7RgNGP0LTQutC1XG4gICAgICog0Y/QstC70Y/QtdGC0YHRjyDQvtCx0Y/Qt9Cw0YLQtdC70YzQvdGL0Lwg0LTQu9GPINC60L7RgNGA0LXQutGC0L3QvtC5INGA0LDQsdC+0YLRiyDQv9GA0LjQu9C+0LbQtdC90LjRjy4g0JTRgNGD0LPQuNC1INGE0L7RgNC80Ysg0LzQvtCz0YPRgiDRgNC10LPQuNGB0YLRgNC40YDQvtCy0LDRgtGM0Y8g0LIg0LvRjtCx0L7QvCDQutC+0LvQuNGH0LXRgdGC0LLQtSwg0LJcbiAgICAgKiDQu9GO0LHQvtC5INC/0L7RgdC70LXQtNC+0LLQsNGC0LXQu9GM0L3QvtGB0YLQuC5cbiAgICAgKi9cbiAgICB0aGlzLnJlZ2lzdGVyU2hhcGUodGhpcy5nZXRWZXJ0aWNlc09mVHJpYW5nbGUsICfQotGA0LXRg9Cz0L7Qu9GM0L3QuNC6JylcbiAgICB0aGlzLnJlZ2lzdGVyU2hhcGUodGhpcy5nZXRWZXJ0aWNlc09mU3F1YXJlLCAn0JrQstCw0LTRgNCw0YInKVxuICAgIHRoaXMucmVnaXN0ZXJTaGFwZSh0aGlzLmdldFZlcnRpY2VzT2ZDaXJjbGUsICfQmtGA0YPQsycpXG5cbiAgICAvLyDQldGB0LvQuCDQv9C10YDQtdC00LDQvdGLINC90LDRgdGC0YDQvtC50LrQuCwg0YLQviDQvtC90Lgg0L/RgNC40LzQtdC90Y/RjtGC0YHRjy5cbiAgICBpZiAob3B0aW9ucykge1xuICAgICAgdGhpcy5zZXRPcHRpb25zKG9wdGlvbnMpXG5cbiAgICAgIC8vICDQldGB0LvQuCDQt9Cw0L/RgNC+0YjQtdC9INGE0L7RgNGB0LjRgNC+0LLQsNC90L3Ri9C5INC30LDQv9GD0YHQuiwg0YLQviDQuNC90LjRhtC40LDQu9C40LfQuNGA0YPRjtGC0YHRjyDQstGB0LUg0L3QtdC+0LHRhdC+0LTQuNC80YvQtSDQtNC70Y8g0YDQtdC90LTQtdGA0LAg0L/QsNGA0LDQvNC10YLRgNGLLlxuICAgICAgaWYgKHRoaXMuZm9yY2VSdW4pIHtcbiAgICAgICAgdGhpcy5zZXR1cChvcHRpb25zKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDQodC+0LfQtNCw0LXRgiDQutC+0L3RgtC10LrRgdGCINGA0LXQvdC00LXRgNC40L3Qs9CwIFdlYkdMINC4INGD0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdGCINC60L7RgNGA0LXQutGC0L3Ri9C5INGA0LDQt9C80LXRgCDQvtCx0LvQsNGB0YLQuCDQv9GA0L7RgdC80L7RgtGA0LAuXG4gICAqL1xuICBwcm90ZWN0ZWQgY3JlYXRlR2woKTogdm9pZCB7XG5cbiAgICB0aGlzLmdsID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnd2ViZ2wnLCB0aGlzLndlYkdsU2V0dGluZ3MpIGFzIFdlYkdMUmVuZGVyaW5nQ29udGV4dFxuXG4gICAgdGhpcy5jYW52YXMud2lkdGggPSB0aGlzLmNhbnZhcy5jbGllbnRXaWR0aFxuICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IHRoaXMuY2FudmFzLmNsaWVudEhlaWdodFxuXG4gICAgdGhpcy5nbC52aWV3cG9ydCgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KVxuICB9XG5cbiAgLyoqXG4gICAqINCg0LXQs9C40YHRgtGA0LjRgNGD0LXRgiDQvdC+0LLRg9GOINGE0L7RgNC80YMg0L/QvtC70LjQs9C+0L3QvtCyLiDQoNC10LPQuNGB0YLRgNCw0YbQuNGPINC+0LfQvdCw0YfQsNC10YIg0LLQvtC30LzQvtC20L3QvtGB0YLRjCDQsiDQtNCw0LvRjNC90LXQudGI0LXQvCDQvtGC0L7QsdGA0LDQttCw0YLRjCDQvdCwINCz0YDQsNGE0LjQutC1INC/0L7Qu9C40LPQvtC90Ysg0LTQsNC90L3QvtC5INGE0L7RgNC80YsuXG4gICAqXG4gICAqIEBwYXJhbSBwb2x5Z29uQ2FsYyAtINCk0YPQvdC60YbQuNGPINCy0YvRh9C40YHQu9C10L3QuNGPINC60L7QvtGA0LTQuNC90LDRgiDQstC10YDRiNC40L0g0L/QvtC70LjQs9C+0L3QsCDQtNCw0L3QvdC+0Lkg0YTQvtGA0LzRiy5cbiAgICogQHBhcmFtIHBvbHlnb25OYW1lIC0g0J3QsNC30LLQsNC90LjQtSDRhNC+0YDQvNGLINC/0L7Qu9C40LPQvtC90LAuXG4gICAqIEByZXR1cm5zINCY0L3QtNC10LrRgSDQvdC+0LLQvtC5INGE0L7RgNC80YssINC/0L4g0LrQvtGC0L7RgNC+0LzRgyDQt9Cw0LTQsNC10YLRgdGPINC10LUg0L7RgtC+0LHRgNCw0LbQtdC90LjQtSDQvdCwINCz0YDQsNGE0LjQutC1LlxuICAgKi9cbiAgcHVibGljIHJlZ2lzdGVyU2hhcGUocG9seWdvbkNhbGM6IFNQbG90Q2FsY1NoYXBlRnVuYywgcG9seWdvbk5hbWU6IHN0cmluZyk6IG51bWJlciB7XG5cbiAgICAvLyDQlNC+0LHQsNCy0LvQtdC90LjQtSDRhNC+0YDQvNGLINCyINC80LDRgdGB0LjQsiDRhNC+0YDQvC5cbiAgICB0aGlzLnNoYXBlcy5wdXNoKHtcbiAgICAgIGNhbGM6IHBvbHlnb25DYWxjLFxuICAgICAgbmFtZTogcG9seWdvbk5hbWVcbiAgICB9KVxuXG4gICAgLy8g0JTQvtCx0LDQstC70LXQvdC40LUg0YTQvtGA0LzRiyDQsiDQvNCw0YHRgdC40LIg0YfQsNGB0YLQvtGCINC/0L7Rj9Cy0LvQtdC90LjRjyDQsiDQtNC10LzQvi3RgNC10LbQuNC80LUuXG4gICAgdGhpcy5kZW1vTW9kZS5zaGFwZVF1b3RhIS5wdXNoKDEpXG5cbiAgICAvLyDQn9C+0LvRg9GH0LXQvdC90YvQuSDQuNC90LTQtdC60YEg0YTQvtGA0LzRiyDQsiDQvNCw0YHRgdC40LLQtSDRhNC+0YDQvC5cbiAgICByZXR1cm4gdGhpcy5zaGFwZXMubGVuZ3RoIC0gMVxuICB9XG5cbiAgLyoqXG4gICAqINCj0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdGCINC90LXQvtCx0YXQvtC00LjQvNGL0LUg0LTQu9GPINGA0LXQvdC00LXRgNCwINC/0LDRgNCw0LzQtdGC0YDRiyDRjdC60LfQtdC80L/Qu9GP0YDQsCDQuCBXZWJHTC5cbiAgICpcbiAgICogQHBhcmFtIG9wdGlvbnMgLSDQn9C+0LvRjNC30L7QstCw0YLQtdC70YzRgdC60LjQtSDQvdCw0YHRgtGA0L7QudC60Lgg0Y3QutC30LXQvNC/0LvRj9GA0LAuXG4gICAqL1xuICBwdWJsaWMgc2V0dXAob3B0aW9uczogU1Bsb3RPcHRpb25zKTogdm9pZCB7XG5cbiAgICAvLyDQn9GA0LjQvNC10L3QtdC90LjQtSDQv9C+0LvRjNC30L7QstCw0YLQtdC70YzRgdC60LjRhSDQvdCw0YHRgtGA0L7QtdC6LlxuICAgIHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKVxuXG4gICAgLy8g0KHQvtC30LTQsNC90LjQtSDQutC+0L3RgtC10LrRgdGC0LAg0YDQtdC90LTQtdGA0LjQvdCz0LAuXG4gICAgdGhpcy5jcmVhdGVHbCgpXG5cbiAgICAvLyDQktGL0LLQvtC0INC+0YLQu9Cw0LTQvtGH0L3QvtC5INC40L3RhNC+0YDQvNCw0YbQuNC4LlxuICAgIGlmICh0aGlzLmRlYnVnTW9kZS5pc0VuYWJsZSkge1xuICAgICAgdGhpcy5yZXBvcnRNYWluSW5mbyhvcHRpb25zKVxuICAgIH1cblxuICAgIC8vINCe0LHQvdGD0LvQtdC90LjQtSDRgdGH0LXRgtGH0LjQutCwINC/0L7Qu9C40LPQvtC90L7Qsi5cbiAgICB0aGlzLmFtb3VudE9mUG9seWdvbnMgPSAwXG5cbiAgICAvLyDQntCx0L3Rg9C70LXQvdC40LUg0YLQtdGF0L3QuNGH0LXRgdC60L7Qs9C+INGB0YfQtdGC0YfQuNC60LAg0YDQtdC20LjQvNCwINC00LXQvNC+LdC00LDQvdC90YvRhVxuICAgIHRoaXMuZGVtb01vZGUuaW5kZXggPSAwXG5cbiAgICAvLyDQntCx0L3Rg9C70LXQvdC40LUg0YHRh9C10YLRh9C40LrQvtCyINGH0LjRgdC70LAg0LjRgdC/0L7Qu9GM0LfQvtCy0LDQvdC40Y8g0YDQsNC30LvQuNGH0L3Ri9GFINGE0L7RgNC8INC/0L7Qu9C40LPQvtC90L7Qsi5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc2hhcGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0aGlzLmJ1ZmZlcnMuYW1vdW50T2ZTaGFwZXNbaV0gPSAwXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog0J/RgNC10LTQtdC70YzQvdC+0LUg0LrQvtC70LjRh9C10YHRgtCy0L4g0LLQtdGA0YjQuNC9INCyINCz0YDRg9C/0L/QtSDQv9C+0LvQuNCz0L7QvdC+0LIg0LfQsNCy0LjRgdC40YIg0L7RgiDQv9Cw0YDQsNC80LXRgtGA0LBcbiAgICAgKiBjaXJjbGVBcHByb3hMZXZlbCwg0LrQvtGC0L7RgNGL0Lkg0LzQvtCzINCx0YvRgtGMINC40LfQvNC10L3QtdC9INC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjNGB0LrQuNC80Lgg0L3QsNGB0YLRgNC+0LnQutCw0LzQuC5cbiAgICAgKi9cbiAgICB0aGlzLm1heEFtb3VudE9mVmVydGV4UGVyUG9seWdvbkdyb3VwID0gMzI3NjggLSAodGhpcy5jaXJjbGVBcHByb3hMZXZlbCArIDEpXG5cbiAgICAvLyDQmNC90LjRhtC40LDQu9C40LfQsNGG0LjRjyDQstGB0L/QvtC80L7Qs9Cw0YLQtdC70YzQvdGL0YUg0LrQvtC90YHRgtCw0L3Rgi5cbiAgICB0aGlzLnNldFVzZWZ1bENvbnN0YW50cygpXG5cbiAgICAvLyDQo9GB0YLQsNC90L7QstC60LAg0YbQstC10YLQsCDQvtGH0LjRgdGC0LrQuCDRgNC10L3QtNC10YDQuNC90LPQsFxuICAgIGxldCBbciwgZywgYl0gPSB0aGlzLmNvbnZlcnRDb2xvcih0aGlzLmJnQ29sb3IpXG4gICAgdGhpcy5nbC5jbGVhckNvbG9yKHIsIGcsIGIsIDAuMClcbiAgICB0aGlzLmdsLmNsZWFyKHRoaXMuZ2wuQ09MT1JfQlVGRkVSX0JJVClcblxuICAgIC8qKlxuICAgICAqINCf0L7QtNCz0L7RgtC+0LLQutCwINC60L7QtNC+0LIg0YjQtdC50LTQtdGA0L7Qsi4g0JIg0LrQvtC0INCy0LXRgNGI0LjQvdC90L7Qs9C+INGI0LXQudC00LXRgNCwINCy0YHRgtCw0LLQu9GP0LXRgtGB0Y8g0LrQvtC0INCy0YvQsdC+0YDQsCDRhtCy0LXRgtCwINCy0LXRgNGI0LjQvS4g0JrQvtC0INGE0YDQsNCz0LzQtdC90YLQvdC+0LPQvlxuICAgICAqINGI0LXQudC00LXRgNCwINC40YHQv9C+0LvRjNC30YPQtdGC0YHRjyDQsdC10Lcg0LjQt9C80LXQvdC10L3QuNC5LlxuICAgICAqL1xuICAgIGxldCB2ZXJ0ZXhTaGFkZXJDb2RlID0gdGhpcy5fdmVydGV4U2hhZGVyQ29kZVRlbXBsYXRlLnJlcGxhY2UoJ1NFVC1WRVJURVgtQ09MT1ItQ09ERScsIHRoaXMuZ2VuU2hhZGVyQ29sb3JDb2RlKCkpXG4gICAgbGV0IGZyYWdtZW50U2hhZGVyQ29kZSA9IHRoaXMuZnJhZ21lbnRTaGFkZXJDb2RlVGVtcGxhdGVcblxuICAgIC8vINCh0L7Qt9C00LDQvdC40LUg0YjQtdC50LTQtdGA0L7QsiBXZWJHTC5cbiAgICBsZXQgdmVydGV4U2hhZGVyID0gdGhpcy5jcmVhdGVXZWJHbFNoYWRlcignVkVSVEVYX1NIQURFUicsIHZlcnRleFNoYWRlckNvZGUpXG4gICAgbGV0IGZyYWdtZW50U2hhZGVyID0gdGhpcy5jcmVhdGVXZWJHbFNoYWRlcignRlJBR01FTlRfU0hBREVSJywgZnJhZ21lbnRTaGFkZXJDb2RlKVxuXG4gICAgLy8g0KHQvtC30LTQsNC90LjQtSDQv9GA0L7Qs9GA0LDQvNC80YsgV2ViR0wuXG4gICAgdGhpcy5jcmVhdGVXZWJHbFByb2dyYW0odmVydGV4U2hhZGVyLCBmcmFnbWVudFNoYWRlcilcblxuICAgIC8vINCj0YHRgtCw0L3QvtCy0LrQsCDRgdCy0Y/Qt9C10Lkg0L/QtdGA0LXQvNC10L3QvdGL0YUg0L/RgNC40LvQvtC20LXQvdC40Y8g0YEg0L/RgNC+0LPRgNCw0LzQvNC+0LkgV2ViR2wuXG4gICAgdGhpcy5zZXRXZWJHbFZhcmlhYmxlKCdhdHRyaWJ1dGUnLCAnYV9wb3NpdGlvbicpXG4gICAgdGhpcy5zZXRXZWJHbFZhcmlhYmxlKCdhdHRyaWJ1dGUnLCAnYV9jb2xvcicpXG4gICAgdGhpcy5zZXRXZWJHbFZhcmlhYmxlKCd1bmlmb3JtJywgJ3VfbWF0cml4JylcblxuICAgIC8vINCS0YvRh9C40YHQu9C10L3QuNC1INC00LDQvdC90YvRhSDQvtCx0L4g0LLRgdC10YUg0L/QvtC70LjQs9C+0L3QsNGFINC4INC30LDQv9C+0LvQvdC10L3QuNC1INC40LzQuCDQsdGD0YTQtdGA0L7QsiBXZWJHTC5cbiAgICB0aGlzLmNyZWF0ZVdiR2xCdWZmZXJzKClcblxuICAgIC8vINCV0YHQu9C4INC90LXQvtCx0YXQvtC00LjQvNC+LCDRgtC+INGA0LXQvdC00LXRgNC40L3QsyDQt9Cw0L/Rg9GB0LrQsNC10YLRgdGPINGB0YDQsNC30YMg0L/QvtGB0LvQtSDRg9GB0YLQsNC90L7QstC60Lgg0L/QsNGA0LDQvNC10YLRgNC+0LIg0Y3QutC30LXQvNC/0LvRj9GA0LAuXG4gICAgaWYgKHRoaXMuZm9yY2VSdW4pIHtcbiAgICAgIHRoaXMucnVuKClcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICog0J/RgNC40LzQtdC90Y/QtdGCINC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjNGB0LrQuNC1INC90LDRgdGC0YDQvtC50LrQuCDRjdC60LfQtdC80L/Qu9GP0YDQsC5cbiAgICpcbiAgICogQHBhcmFtIG9wdGlvbnMgLSDQn9C+0LvRjNC30L7QstCw0YLQtdC70YzRgdC60LjQtSDQvdCw0YHRgtGA0L7QudC60Lgg0Y3QutC30LXQvNC/0LvRj9GA0LAuXG4gICAqL1xuICBwcm90ZWN0ZWQgc2V0T3B0aW9ucyhvcHRpb25zOiBTUGxvdE9wdGlvbnMpOiB2b2lkIHtcblxuICAgIC8qKlxuICAgICAqINCa0L7Qv9C40YDQvtCy0LDQvdC40LUg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GM0YHQutC40YUg0L3QsNGB0YLRgNC+0LXQuiDQsiDRgdC+0L7RgtCy0LXRgtGB0LLRg9GO0YnQuNC1INC/0L7Qu9GPINGN0LrQt9C10LzQv9C70Y/RgNCwLiDQmtC+0L/QuNGA0YPRjtGC0YHRjyDRgtC+0LvRjNC60L4g0YLQtSDQuNC3INC90LjRhSwg0LrQvtGC0L7RgNGL0LxcbiAgICAgKiDQuNC80LXRjtGC0YHRjyDRgdC+0L7RgtCy0LXRgtGB0YLQstGD0Y7RidC40LUg0Y3QutCy0LjQstCw0LvQtdC90YLRiyDQsiDQv9C+0LvRj9GFINGN0LrQt9C10LzQv9C70Y/RgNCwLiDQmtC+0L/QuNGA0YPQtdGC0YHRjyDRgtCw0LrQttC1INC/0LXRgNCy0YvQuSDRg9GA0L7QstC10L3RjCDQstC70L7QttC10L3QvdGL0YUg0L3QsNGB0YLRgNC+0LXQui5cbiAgICAgKi9cbiAgICBmb3IgKGxldCBvcHRpb24gaW4gb3B0aW9ucykge1xuXG4gICAgICBpZiAoIXRoaXMuaGFzT3duUHJvcGVydHkob3B0aW9uKSkgY29udGludWVcblxuICAgICAgaWYgKGlzT2JqZWN0KChvcHRpb25zIGFzIGFueSlbb3B0aW9uXSkgJiYgaXNPYmplY3QoKHRoaXMgYXMgYW55KVtvcHRpb25dKSApIHtcbiAgICAgICAgZm9yIChsZXQgbmVzdGVkT3B0aW9uIGluIChvcHRpb25zIGFzIGFueSlbb3B0aW9uXSkge1xuICAgICAgICAgIGlmICgodGhpcyBhcyBhbnkpW29wdGlvbl0uaGFzT3duUHJvcGVydHkobmVzdGVkT3B0aW9uKSkge1xuICAgICAgICAgICAgKHRoaXMgYXMgYW55KVtvcHRpb25dW25lc3RlZE9wdGlvbl0gPSAob3B0aW9ucyBhcyBhbnkpW29wdGlvbl1bbmVzdGVkT3B0aW9uXVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgKHRoaXMgYXMgYW55KVtvcHRpb25dID0gKG9wdGlvbnMgYXMgYW55KVtvcHRpb25dXG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog0JXRgdC70Lgg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GMINC30LDQtNCw0LXRgiDRgNCw0LfQvNC10YAg0L/Qu9C+0YHQutC+0YHRgtC4LCDQvdC+INC/0YDQuCDRjdGC0L7QvCDQvdCwINC30LDQtNCw0LXRgiDQvdCw0YfQsNC70YzQvdC+0LUg0L/QvtC70L7QttC10L3QuNC1INC+0LHQu9Cw0YHRgtC4INC/0YDQvtGB0LzQvtGC0YDQsCwg0YLQvlxuICAgICAqINC+0LHQu9Cw0YHRgtGMINC/0YDQvtGB0LzQvtGC0YDQsCDQv9C+0LzQtdGJ0LDQtdGC0YHRjyDQsiDRhtC10L3RgtGAINC30LDQtNCw0L3QvdC+0Lkg0L/Qu9C+0YHQutC+0YHRgtC4LlxuICAgICAqL1xuICAgIGlmIChvcHRpb25zLmhhc093blByb3BlcnR5KCdncmlkU2l6ZScpICYmICFvcHRpb25zLmhhc093blByb3BlcnR5KCdjYW1lcmEnKSkge1xuICAgICAgdGhpcy5jYW1lcmEgPSB7XG4gICAgICAgIHg6IHRoaXMuZ3JpZFNpemUud2lkdGggLyAyLFxuICAgICAgICB5OiB0aGlzLmdyaWRTaXplLmhlaWdodCAvIDIsXG4gICAgICAgIHpvb206IDFcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDQldGB0LvQuCDQt9Cw0L/RgNC+0YjQtdC9INC00LXQvNC+LdGA0LXQttC40LwsINGC0L4g0LTQu9GPINC40YLQtdGA0LjRgNC+0LLQsNC90LjRjyDQvtCx0YrQtdC60YLQvtCyINCx0YPQtNC10YIg0LjRgdC/0L7Qu9GM0LfQvtCy0LDRgtGM0YHRjyDQstC90YPRgtGA0LXQvdC90LjQuSDQuNC80LjRgtC40YDRg9GO0YnQuNC5INC40YLQtdGA0LjRgNC+0LLQsNC90LjQtVxuICAgICAqINC80LXRgtC+0LQuINCf0YDQuCDRjdGC0L7QvCDQstC90LXRiNC90Y/RjyDRhNGD0L3QutGG0LjRjyDQuNGC0LXRgNC40YDQvtCy0LDQvdC40Y8g0LjRgdC/0L7Qu9GM0LfQvtCy0LDQvdCwINC90LUg0LHRg9C00LXRgi5cbiAgICAgKi9cbiAgICBpZiAodGhpcy5kZW1vTW9kZS5pc0VuYWJsZSkge1xuICAgICAgdGhpcy5pdGVyYXRpb25DYWxsYmFjayA9IHRoaXMuZGVtb0l0ZXJhdGlvbkNhbGxiYWNrXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqINCS0YvRh9C40YHQu9GP0LXRgiDQvdCw0LHQvtGAINCy0YHQv9C+0LzQvtCz0LDRgtC10LvRjNC90YvRhSDQutC+0L3RgdGC0LDQvdGCIHtAbGluayBVU0VGVUxfQ09OU1RTfSwg0YXRgNCw0L3Rj9GJ0LjRhSDRgNC10LfRg9C70YzRgtCw0YLRiyDQsNC70LPQtdCx0YDQsNC40YfQtdGB0LrQuNGFINC4XG4gICAqINGC0YDQuNCz0L7QvdC+0LzQtdGC0YDQuNGH0LXRgdC60LjRhSDQstGL0YfQuNGB0LvQtdC90LjQuSwg0LjRgdC/0L7Qu9GM0LfRg9C10LzRi9GFINCyINGA0LDRgdGH0LXRgtCw0YUg0LLQtdGA0YjQuNC9INC/0L7Qu9C40LPQvtC90L7QsiDQuCDQvNCw0YLRgNC40YYg0YLRgNCw0L3RgdGE0L7RgNC80LDRhtC40LguXG4gICAqXG4gICAqIEByZW1hcmtzXG4gICAqINCi0LDQutC40LUg0LrQvtC90YHRgtCw0L3RgtGLINC/0L7Qt9Cy0L7Qu9GP0Y7RgiDQstGL0L3QtdGB0YLQuCDQt9Cw0YLRgNCw0YLQvdGL0LUg0LTQu9GPINC/0YDQvtGG0LXRgdGB0L7RgNCwINC+0L/QtdGA0LDRhtC40Lgg0LfQsCDQv9GA0LXQtNC10LvRiyDQvNC90L7Qs9C+0LrRgNCw0YLQvdC+INC40YHQv9C+0LvRjNC30YPQtdC80YvRhSDRhNGD0L3QutGG0LjQuVxuICAgKiDRg9Cy0LXQu9C40YfQuNCy0LDRjyDQv9GA0L7QuNC30LLQvtC00LjRgtC10LvRjNC90L7RgdGC0Ywg0L/RgNC40LvQvtC20LXQvdC40Y8g0L3QsCDRjdGC0LDQv9Cw0YUg0L/QvtC00LPQvtGC0L7QstC60Lgg0LTQsNC90L3Ri9GFINC4INGA0LXQvdC00LXRgNC40L3Qs9CwLlxuICAgKi9cbiAgcHJvdGVjdGVkIHNldFVzZWZ1bENvbnN0YW50cygpOiB2b2lkIHtcblxuICAgIC8vINCa0L7QvdGB0YLQsNC90YLRiywg0LfQsNCy0LjRgdGP0YnQuNC1INC+0YIg0YDQsNC30LzQtdGA0LAg0L/QvtC70LjQs9C+0L3QsC5cbiAgICB0aGlzLlVTRUZVTF9DT05TVFNbMF0gPSB0aGlzLnBvbHlnb25TaXplIC8gMlxuICAgIHRoaXMuVVNFRlVMX0NPTlNUU1sxXSA9IHRoaXMuVVNFRlVMX0NPTlNUU1swXSAvIE1hdGguY29zKE1hdGguUEkgLyA2KVxuICAgIHRoaXMuVVNFRlVMX0NPTlNUU1syXSA9IHRoaXMuVVNFRlVMX0NPTlNUU1swXSAqIE1hdGgudGFuKE1hdGguUEkgLyA2KVxuXG4gICAgLy8g0JrQvtC90YHRgtCw0L3RgtGLLCDQt9Cw0LLQuNGB0Y/RidC40LUg0L7RgiDRgdGC0LXQv9C10L3QuCDQtNC10YLQsNC70LjQt9Cw0YbQuNC4INC60YDRg9Cz0LAg0Lgg0YDQsNC30LzQtdGA0LAg0L/QvtC70LjQs9C+0L3QsC5cbiAgICB0aGlzLlVTRUZVTF9DT05TVFNbM10gPSBuZXcgRmxvYXQzMkFycmF5KHRoaXMuY2lyY2xlQXBwcm94TGV2ZWwpXG4gICAgdGhpcy5VU0VGVUxfQ09OU1RTWzRdID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLmNpcmNsZUFwcHJveExldmVsKVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNpcmNsZUFwcHJveExldmVsOyBpKyspIHtcbiAgICAgIGNvbnN0IGFuZ2xlID0gMiAqIE1hdGguUEkgKiBpIC8gdGhpcy5jaXJjbGVBcHByb3hMZXZlbFxuICAgICAgdGhpcy5VU0VGVUxfQ09OU1RTWzNdW2ldID0gdGhpcy5VU0VGVUxfQ09OU1RTWzBdICogTWF0aC5jb3MoYW5nbGUpXG4gICAgICB0aGlzLlVTRUZVTF9DT05TVFNbNF1baV0gPSB0aGlzLlVTRUZVTF9DT05TVFNbMF0gKiBNYXRoLnNpbihhbmdsZSlcbiAgICB9XG5cbiAgICAvLyDQmtC+0L3RgdGC0LDQvdGC0YssINC30LDQstC40YHRj9GJ0LjQtSDQvtGCINGA0LDQt9C80LXRgNCwINC60LDQvdCy0LDRgdCwLlxuICAgIHRoaXMuVVNFRlVMX0NPTlNUU1s1XSA9IDIgLyB0aGlzLmNhbnZhcy53aWR0aFxuICAgIHRoaXMuVVNFRlVMX0NPTlNUU1s2XSA9IDIgLyB0aGlzLmNhbnZhcy5oZWlnaHRcbiAgICB0aGlzLlVTRUZVTF9DT05TVFNbN10gPSAyIC8gdGhpcy5jYW52YXMuY2xpZW50V2lkdGhcbiAgICB0aGlzLlVTRUZVTF9DT05TVFNbOF0gPSAtMiAvIHRoaXMuY2FudmFzLmNsaWVudEhlaWdodFxuICAgIHRoaXMuVVNFRlVMX0NPTlNUU1s5XSA9IHRoaXMuY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnRcbiAgICB0aGlzLlVTRUZVTF9DT05TVFNbMTBdID0gdGhpcy5jYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wXG4gIH1cblxuICAvKipcbiAgICog0KHQvtC30LTQsNC10YIg0YjQtdC50LTQtdGAIFdlYkdMLlxuICAgKlxuICAgKiBAcGFyYW0gc2hhZGVyVHlwZSDQotC40L8g0YjQtdC50LTQtdGA0LAuXG4gICAqIEBwYXJhbSBzaGFkZXJDb2RlINCa0L7QtCDRiNC10LnQtNC10YDQsCDQvdCwINGP0LfRi9C60LUgR0xTTC5cbiAgICogQHJldHVybnMg0KHQvtC30LTQsNC90L3Ri9C5INC+0LHRitC10LrRgiDRiNC10LnQtNC10YDQsC5cbiAgICovXG4gIHByb3RlY3RlZCBjcmVhdGVXZWJHbFNoYWRlcihzaGFkZXJUeXBlOiBXZWJHbFNoYWRlclR5cGUsIHNoYWRlckNvZGU6IHN0cmluZyk6IFdlYkdMU2hhZGVyIHtcblxuICAgIC8vINCh0L7Qt9C00LDQvdC40LUsINC/0YDQuNCy0Y/Qt9C60LAg0LrQvtC00LAg0Lgg0LrQvtC80L/QuNC70Y/RhtC40Y8g0YjQtdC50LTQtdGA0LAuXG4gICAgY29uc3Qgc2hhZGVyID0gdGhpcy5nbC5jcmVhdGVTaGFkZXIodGhpcy5nbFtzaGFkZXJUeXBlXSkgYXMgV2ViR0xTaGFkZXJcbiAgICB0aGlzLmdsLnNoYWRlclNvdXJjZShzaGFkZXIsIHNoYWRlckNvZGUpXG4gICAgdGhpcy5nbC5jb21waWxlU2hhZGVyKHNoYWRlcilcblxuICAgIGlmICghdGhpcy5nbC5nZXRTaGFkZXJQYXJhbWV0ZXIoc2hhZGVyLCB0aGlzLmdsLkNPTVBJTEVfU1RBVFVTKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCfQntGI0LjQsdC60LAg0LrQvtC80L/QuNC70Y/RhtC40Lgg0YjQtdC50LTQtdGA0LAgWycgKyBzaGFkZXJUeXBlICsgJ10uICcgKyB0aGlzLmdsLmdldFNoYWRlckluZm9Mb2coc2hhZGVyKSlcbiAgICB9XG5cbiAgICAvLyDQktGL0LLQvtC0INC+0YLQu9Cw0LTQvtGH0L3QvtC5INC40L3RhNC+0YDQvNCw0YbQuNC4LlxuICAgIGlmICh0aGlzLmRlYnVnTW9kZS5pc0VuYWJsZSkge1xuICAgICAgY29uc29sZS5ncm91cCgnJWPQodC+0LfQtNCw0L0g0YjQtdC50LTQtdGAIFsnICsgc2hhZGVyVHlwZSArICddJywgdGhpcy5kZWJ1Z01vZGUuZ3JvdXBTdHlsZSlcbiAgICAgIHtcbiAgICAgICAgY29uc29sZS5sb2coc2hhZGVyQ29kZSlcbiAgICAgIH1cbiAgICAgIGNvbnNvbGUuZ3JvdXBFbmQoKVxuICAgIH1cblxuICAgIHJldHVybiBzaGFkZXJcbiAgfVxuXG4gIC8qKlxuICAgKiDQodC+0LfQtNCw0LXRgiDQv9GA0L7Qs9GA0LDQvNC80YMgV2ViR0wuXG4gICAqXG4gICAqIEBwYXJhbSB7V2ViR0xTaGFkZXJ9IHZlcnRleFNoYWRlciDQktC10YDRiNC40L3QvdGL0Lkg0YjQtdC50LTQtdGALlxuICAgKiBAcGFyYW0ge1dlYkdMU2hhZGVyfSBmcmFnbWVudFNoYWRlciDQpNGA0LDQs9C80LXQvdGC0L3Ri9C5INGI0LXQudC00LXRgC5cbiAgICovXG4gIHByb3RlY3RlZCBjcmVhdGVXZWJHbFByb2dyYW0odmVydGV4U2hhZGVyOiBXZWJHTFNoYWRlciwgZnJhZ21lbnRTaGFkZXI6IFdlYkdMU2hhZGVyKTogdm9pZCB7XG5cbiAgICB0aGlzLmdwdVByb2dyYW0gPSB0aGlzLmdsLmNyZWF0ZVByb2dyYW0oKSBhcyBXZWJHTFByb2dyYW1cblxuICAgIHRoaXMuZ2wuYXR0YWNoU2hhZGVyKHRoaXMuZ3B1UHJvZ3JhbSwgdmVydGV4U2hhZGVyKVxuICAgIHRoaXMuZ2wuYXR0YWNoU2hhZGVyKHRoaXMuZ3B1UHJvZ3JhbSwgZnJhZ21lbnRTaGFkZXIpXG4gICAgdGhpcy5nbC5saW5rUHJvZ3JhbSh0aGlzLmdwdVByb2dyYW0pXG5cbiAgICBpZiAoIXRoaXMuZ2wuZ2V0UHJvZ3JhbVBhcmFtZXRlcih0aGlzLmdwdVByb2dyYW0sIHRoaXMuZ2wuTElOS19TVEFUVVMpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ9Ce0YjQuNCx0LrQsCDRgdC+0LfQtNCw0L3QuNGPINC/0YDQvtCz0YDQsNC80LzRiyBXZWJHTC4gJyArIHRoaXMuZ2wuZ2V0UHJvZ3JhbUluZm9Mb2codGhpcy5ncHVQcm9ncmFtKSlcbiAgICB9XG5cbiAgICB0aGlzLmdsLnVzZVByb2dyYW0odGhpcy5ncHVQcm9ncmFtKVxuICB9XG5cbiAgLyoqXG4gICAqINCj0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdGCINGB0LLRj9C30Ywg0L/QtdGA0LXQvNC10L3QvdC+0Lkg0L/RgNC40LvQvtC20LXQvdC40Y8g0YEg0L/RgNC+0LPRgNCw0LzQvNC+0LkgV2ViR2wuXG4gICAqXG4gICAqIEBwYXJhbSB2YXJUeXBlINCi0LjQvyDQv9C10YDQtdC80LXQvdC90L7QuS5cbiAgICogQHBhcmFtIHZhck5hbWUg0JjQvNGPINC/0LXRgNC10LzQtdC90L3QvtC5LlxuICAgKi9cbiAgcHJvdGVjdGVkIHNldFdlYkdsVmFyaWFibGUodmFyVHlwZTogV2ViR2xWYXJpYWJsZVR5cGUsIHZhck5hbWU6IHN0cmluZyk6IHZvaWQge1xuICAgIGlmICh2YXJUeXBlID09PSAndW5pZm9ybScpIHtcbiAgICAgIHRoaXMudmFyaWFibGVzW3Zhck5hbWVdID0gdGhpcy5nbC5nZXRVbmlmb3JtTG9jYXRpb24odGhpcy5ncHVQcm9ncmFtLCB2YXJOYW1lKVxuICAgIH0gZWxzZSBpZiAodmFyVHlwZSA9PT0gJ2F0dHJpYnV0ZScpIHtcbiAgICAgIHRoaXMudmFyaWFibGVzW3Zhck5hbWVdID0gdGhpcy5nbC5nZXRBdHRyaWJMb2NhdGlvbih0aGlzLmdwdVByb2dyYW0sIHZhck5hbWUpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqINCh0L7Qt9C00LDQtdGCINC4INC30LDQv9C+0LvQvdGP0LXRgiDQtNCw0L3QvdGL0LzQuCDQvtCx0L4g0LLRgdC10YUg0L/QvtC70LjQs9C+0L3QsNGFINCx0YPRhNC10YDRiyBXZWJHTC5cbiAgICovXG4gIHByb3RlY3RlZCBjcmVhdGVXYkdsQnVmZmVycygpOiB2b2lkIHtcblxuICAgIC8vINCS0YvQstC+0LQg0L7RgtC70LDQtNC+0YfQvdC+0Lkg0LjQvdGE0L7RgNC80LDRhtC40LguXG4gICAgaWYgKHRoaXMuZGVidWdNb2RlLmlzRW5hYmxlKSB7XG4gICAgICBjb25zb2xlLmxvZygnJWPQl9Cw0L/Rg9GJ0LXQvSDQv9GA0L7RhtC10YHRgSDQt9Cw0LPRgNGD0LfQutC4INC00LDQvdC90YvRhSBbJyArIHRoaXMuZ2V0Q3VycmVudFRpbWUoKSArICddLi4uJywgdGhpcy5kZWJ1Z01vZGUuZ3JvdXBTdHlsZSlcblxuICAgICAgLy8g0JfQsNC/0YPRgdC6INC60L7QvdGB0L7Qu9GM0L3QvtCz0L4g0YLQsNC50LzQtdGA0LAsINC40LfQvNC10YDRj9GO0YnQtdCz0L4g0LTQu9C40YLQtdC70YzQvdC+0YHRgtGMINC/0YDQvtGG0LXRgdGB0LAg0LfQsNCz0YDRg9C30LrQuCDQtNCw0L3QvdGL0YUg0LIg0LLQuNC00LXQvtC/0LDQvNGP0YLRjC5cbiAgICAgIGNvbnNvbGUudGltZSgn0JTQu9C40YLQtdC70YzQvdC+0YHRgtGMJylcbiAgICB9XG5cbiAgICBsZXQgcG9seWdvbkdyb3VwOiBTUGxvdFBvbHlnb25Hcm91cCB8IG51bGxcblxuICAgIC8vINCY0YLQtdGA0LjRgNC+0LLQsNC90LjQtSDQs9GA0YPQv9C/INC/0L7Qu9C40LPQvtC90L7Qsi5cbiAgICB3aGlsZSAocG9seWdvbkdyb3VwID0gdGhpcy5jcmVhdGVQb2x5Z29uR3JvdXAoKSkge1xuXG4gICAgICAvLyDQodC+0LfQtNCw0L3QuNC1INC4INC30LDQv9C+0LvQvdC10L3QuNC1INCx0YPRhNC10YDQvtCyINC00LDQvdC90YvQvNC4INC+INGC0LXQutGD0YnQtdC5INCz0YDRg9C/0L/QtSDQv9C+0LvQuNCz0L7QvdC+0LIuXG4gICAgICB0aGlzLmFkZFdiR2xCdWZmZXIodGhpcy5idWZmZXJzLnZlcnRleEJ1ZmZlcnMsICdBUlJBWV9CVUZGRVInLCBuZXcgRmxvYXQzMkFycmF5KHBvbHlnb25Hcm91cC52ZXJ0aWNlcyksIDApXG4gICAgICB0aGlzLmFkZFdiR2xCdWZmZXIodGhpcy5idWZmZXJzLmNvbG9yQnVmZmVycywgJ0FSUkFZX0JVRkZFUicsIG5ldyBVaW50OEFycmF5KHBvbHlnb25Hcm91cC5jb2xvcnMpLCAxKVxuICAgICAgdGhpcy5hZGRXYkdsQnVmZmVyKHRoaXMuYnVmZmVycy5pbmRleEJ1ZmZlcnMsICdFTEVNRU5UX0FSUkFZX0JVRkZFUicsIG5ldyBVaW50MTZBcnJheShwb2x5Z29uR3JvdXAuaW5kaWNlcyksIDIpXG5cbiAgICAgIC8vINCh0YfQtdGC0YfQuNC6INC60L7Qu9C40YfQtdGB0YLQstCwINCx0YPRhNC10YDQvtCyLlxuICAgICAgdGhpcy5idWZmZXJzLmFtb3VudE9mQnVmZmVyR3JvdXBzKytcblxuICAgICAgLy8g0KHRh9C10YLRh9C40Log0LrQvtC70LjRh9C10YHRgtCy0LAg0LLQtdGA0YjQuNC9IEdMLdGC0YDQtdGD0LPQvtC70YzQvdC40LrQvtCyINGC0LXQutGD0YnQtdC5INCz0YDRg9C/0L/RiyDQsdGD0YTQtdGA0L7Qsi5cbiAgICAgIHRoaXMuYnVmZmVycy5hbW91bnRPZkdMVmVydGljZXMucHVzaChwb2x5Z29uR3JvdXAuYW1vdW50T2ZHTFZlcnRpY2VzKVxuXG4gICAgICAvLyDQodGH0LXRgtGH0LjQuiDQvtCx0YnQtdCz0L4g0LrQvtC70LjRh9C10YHRgtCy0LAg0LLQtdGA0YjQuNC9IEdMLdGC0YDQtdGD0LPQvtC70YzQvdC40LrQvtCyLlxuICAgICAgdGhpcy5idWZmZXJzLmFtb3VudE9mVG90YWxHTFZlcnRpY2VzICs9IHBvbHlnb25Hcm91cC5hbW91bnRPZkdMVmVydGljZXNcbiAgICB9XG5cbiAgICAvLyDQktGL0LLQvtC0INC+0YLQu9Cw0LTQvtGH0L3QvtC5INC40L3RhNC+0YDQvNCw0YbQuNC4LlxuICAgIGlmICh0aGlzLmRlYnVnTW9kZS5pc0VuYWJsZSkge1xuICAgICAgdGhpcy5yZXBvcnRBYm91dE9iamVjdFJlYWRpbmcoKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDQodGH0LjRgtGL0LLQsNC10YIg0LTQsNC90L3Ri9C1INC+0LEg0LjRgdGF0L7QtNC90YvRhSDQvtCx0YrQtdC60YLQsNGFINC4INGE0L7RgNC80LjRgNGD0LXRgiDRgdC+0L7RgtCy0LXRgtGB0LLRg9GO0YnRg9GOINGN0YLQuNC8INC+0LHRitC10LrRgtCw0Lwg0LPRgNGD0L/Qv9GDINC/0L7Qu9C40LPQvtC90L7Qsi5cbiAgICpcbiAgICogQHJlbWFya3NcbiAgICog0JPRgNGD0L/Qv9CwINGE0L7RgNC80LjRgNGD0LXRgtGB0Y8g0YEg0YPRh9C10YLQvtC8INGC0LXRhdC90LjRh9C10YHQutC+0LPQviDQvtCz0YDQsNC90LjRh9C10L3QuNGPINC90LAg0LrQvtC70LjRh9C10YHRgtCy0L4g0LLQtdGA0YjQuNC9INCyINCz0YDRg9C/0L/QtSDQuCDQu9C40LzQuNGC0LAg0L3QsCDQvtCx0YnQtdC1INC60L7Qu9C40YfQtdGB0YLQstC+XG4gICAqINC/0L7Qu9C40LPQvtC90L7QsiDQvdCwINC60LDQvdCy0LDRgdC1LlxuICAgKlxuICAgKiBAcmV0dXJucyDQodC+0LfQtNCw0L3QvdCw0Y8g0LPRgNGD0L/Qv9CwINC/0L7Qu9C40LPQvtC90L7QsiDQuNC70LggbnVsbCwg0LXRgdC70Lgg0YTQvtGA0LzQuNGA0L7QstCw0L3QuNC1INCy0YHQtdGFINCz0YDRg9C/0L8g0L/QvtC70LjQs9C+0L3QvtCyINC30LDQstC10YDRiNC40LvQvtGB0YwuXG4gICAqL1xuICBwcm90ZWN0ZWQgY3JlYXRlUG9seWdvbkdyb3VwKCk6IFNQbG90UG9seWdvbkdyb3VwIHwgbnVsbCB7XG5cbiAgICBsZXQgcG9seWdvbkdyb3VwOiBTUGxvdFBvbHlnb25Hcm91cCA9IHtcbiAgICAgIHZlcnRpY2VzOiBbXSxcbiAgICAgIGluZGljZXM6IFtdLFxuICAgICAgY29sb3JzOiBbXSxcbiAgICAgIGFtb3VudE9mVmVydGljZXM6IDAsXG4gICAgICBhbW91bnRPZkdMVmVydGljZXM6IDBcbiAgICB9XG5cbiAgICBsZXQgcG9seWdvbjogU1Bsb3RQb2x5Z29uIHwgbnVsbFxuXG4gICAgLyoqXG4gICAgICog0JXRgdC70Lgg0LrQvtC70LjRh9C10YHRgtCy0L4g0L/QvtC70LjQs9C+0L3QvtCyINC60LDQvdCy0LDRgdCwINC00L7RgdGC0LjQs9C70L4g0LTQvtC/0YPRgdGC0LjQvNC+0LPQviDQvNCw0LrRgdC40LzRg9C80LAsINGC0L4g0LTQsNC70YzQvdC10LnRiNCw0Y8g0L7QsdGA0LDQsdC+0YLQutCwINC40YHRhdC+0LTQvdGL0YUg0L7QsdGK0LXQutGC0L7QslxuICAgICAqINC/0YDQuNC+0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdGC0YHRjyAtINGE0L7RgNC80LjRgNC+0LLQsNC90LjQtSDQs9GA0YPQv9C/INC/0L7Qu9C40LPQvtC90L7QsiDQt9Cw0LLQtdGA0YjQsNC10YLRgdGPINCy0L7Qt9Cy0YDQsNGC0L7QvCDQt9C90LDRh9C10L3QuNGPIG51bGwgKNGB0LjQvNGD0LvRj9GG0LjRjyDQtNC+0YHRgtC40LbQtdC90LjRj1xuICAgICAqINC/0L7RgdC70LXQtNC90LXQs9C+INC+0LHRgNCw0LHQsNGC0YvQstCw0LXQvNC+0LPQviDQuNGB0YXQvtC00L3QvtCz0L4g0L7QsdGK0LXQutGC0LApLlxuICAgICAqL1xuICAgIGlmICh0aGlzLmFtb3VudE9mUG9seWdvbnMgPj0gdGhpcy5tYXhBbW91bnRPZlBvbHlnb25zKSByZXR1cm4gbnVsbFxuXG4gICAgLy8g0JjRgtC10YDQuNGA0L7QstCw0L3QuNC1INC40YHRhdC+0LTQvdGL0YUg0L7QsdGK0LXQutGC0L7Qsi5cbiAgICB3aGlsZSAocG9seWdvbiA9IHRoaXMuaXRlcmF0aW9uQ2FsbGJhY2shKCkpIHtcblxuICAgICAgLy8g0JTQvtCx0LDQstC70LXQvdC40LUg0LIg0LPRgNGD0L/Qv9GDINC/0L7Qu9C40LPQvtC90L7QsiDQvdC+0LLQvtCz0L4g0L/QvtC70LjQs9C+0L3QsC5cbiAgICAgIHRoaXMuYWRkUG9seWdvbihwb2x5Z29uR3JvdXAsIHBvbHlnb24pXG5cbiAgICAgIC8vINCh0YfQtdGC0YfQuNC6INGH0LjRgdC70LAg0L/RgNC40LzQtdC90LXQvdC40Lkg0LrQsNC20LTQvtC5INC40Lcg0YTQvtGA0Lwg0L/QvtC70LjQs9C+0L3QvtCyLlxuICAgICAgdGhpcy5idWZmZXJzLmFtb3VudE9mU2hhcGVzW3BvbHlnb24uc2hhcGVdKytcblxuICAgICAgLy8g0KHRh9C10YLRh9C40Log0L7QsdGJ0LXQs9C+INC60L7Qu9C40YfQtdGB0YLQstC+INC/0L7Qu9C40LPQvtC90L7Qsi5cbiAgICAgIHRoaXMuYW1vdW50T2ZQb2x5Z29ucysrXG5cbiAgICAgIC8qKlxuICAgICAgICog0JXRgdC70Lgg0LrQvtC70LjRh9C10YHRgtCy0L4g0L/QvtC70LjQs9C+0L3QvtCyINC60LDQvdCy0LDRgdCwINC00L7RgdGC0LjQs9C70L4g0LTQvtC/0YPRgdGC0LjQvNC+0LPQviDQvNCw0LrRgdC40LzRg9C80LAsINGC0L4g0LTQsNC70YzQvdC10LnRiNCw0Y8g0L7QsdGA0LDQsdC+0YLQutCwINC40YHRhdC+0LTQvdGL0YUg0L7QsdGK0LXQutGC0L7QslxuICAgICAgICog0L/RgNC40L7RgdGC0LDQvdCw0LLQu9C40LLQsNC10YLRgdGPIC0g0YTQvtGA0LzQuNGA0L7QstCw0L3QuNC1INCz0YDRg9C/0L8g0L/QvtC70LjQs9C+0L3QvtCyINC30LDQstC10YDRiNCw0LXRgtGB0Y8g0LLQvtC30LLRgNCw0YLQvtC8INC30L3QsNGH0LXQvdC40Y8gbnVsbCAo0YHQuNC80YPQu9GP0YbQuNGPINC00L7RgdGC0LjQttC10L3QuNGPXG4gICAgICAgKiDQv9C+0YHQu9C10LTQvdC10LPQviDQvtCx0YDQsNCx0LDRgtGL0LLQsNC10LzQvtCz0L4g0LjRgdGF0L7QtNC90L7Qs9C+INC+0LHRitC10LrRgtCwKS5cbiAgICAgICAqL1xuICAgICAgaWYgKHRoaXMuYW1vdW50T2ZQb2x5Z29ucyA+PSB0aGlzLm1heEFtb3VudE9mUG9seWdvbnMpIGJyZWFrXG5cbiAgICAgIC8qKlxuICAgICAgICog0JXRgdC70Lgg0L7QsdGJ0LXQtSDQutC+0LvQuNGH0LXRgdGC0LLQviDQstGB0LXRhSDQstC10YDRiNC40L0g0LIg0LPRgNGD0L/Qv9C1INC/0L7Qu9C40LPQvtC90L7QsiDQv9GA0LXQstGL0YHQuNC70L4g0YLQtdGF0L3QuNGH0LXRgdC60L7QtSDQvtCz0YDQsNC90LjRh9C10L3QuNC1LCDRgtC+INCz0YDRg9C/0L/QsCDQv9C+0LvQuNCz0L7QvdC+0LJcbiAgICAgICAqINGB0YfQuNGC0LDQtdGC0YHRjyDRgdGE0L7RgNC80LjRgNC+0LLQsNC90L3QvtC5INC4INC40YLQtdGA0LjRgNC+0LLQsNC90LjQtSDQuNGB0YXQvtC00L3Ri9GFINC+0LHRitC10LrRgtC+0LIg0L/RgNC40L7RgdGC0LDQvdCw0LLQu9C40LLQsNC10YLRgdGPLlxuICAgICAgICovXG4gICAgICBpZiAocG9seWdvbkdyb3VwLmFtb3VudE9mVmVydGljZXMgPj0gdGhpcy5tYXhBbW91bnRPZlZlcnRleFBlclBvbHlnb25Hcm91cCkgYnJlYWtcbiAgICB9XG5cbiAgICAvLyDQodGH0LXRgtGH0LjQuiDQvtCx0YnQtdCz0L4g0LrQvtC70LjRh9C10YHRgtCy0LAg0LLQtdGA0YjQuNC9INCy0YHQtdGFINCy0LXRgNGI0LjQvdC90YvRhSDQsdGD0YTQtdGA0L7Qsi5cbiAgICB0aGlzLmJ1ZmZlcnMuYW1vdW50T2ZUb3RhbFZlcnRpY2VzICs9IHBvbHlnb25Hcm91cC5hbW91bnRPZlZlcnRpY2VzXG5cbiAgICAvLyDQldGB0LvQuCDQs9GA0YPQv9C/0LAg0L/QvtC70LjQs9C+0L3QvtCyINC90LXQv9GD0YHRgtCw0Y8sINGC0L4g0LLQvtC30LLRgNCw0YnQsNC10Lwg0LXQtS4g0JXRgdC70Lgg0L/Rg9GB0YLQsNGPIC0g0LLQvtC30LLRgNCw0YnQsNC10LwgbnVsbC5cbiAgICByZXR1cm4gKHBvbHlnb25Hcm91cC5hbW91bnRPZlZlcnRpY2VzID4gMCkgPyBwb2x5Z29uR3JvdXAgOiBudWxsXG4gIH1cblxuICAvKipcbiAgICog0KHQvtC30LTQsNC10YIg0LIg0LzQsNGB0YHQuNCy0LUg0LHRg9GE0LXRgNC+0LIgV2ViR0wg0L3QvtCy0YvQuSDQsdGD0YTQtdGAINC4INC30LDQv9C40YHRi9Cy0LDQtdGCINCyINC90LXQs9C+INC/0LXRgNC10LTQsNC90L3Ri9C1INC00LDQvdC90YvQtS5cbiAgICpcbiAgICogQHBhcmFtIGJ1ZmZlcnMgLSDQnNCw0YHRgdC40LIg0LHRg9GE0LXRgNC+0LIgV2ViR0wsINCyINC60L7RgtC+0YDRi9C5INCx0YPQtNC10YIg0LTQvtCx0LDQstC70LXQvSDRgdC+0LfQtNCw0LLQsNC10LzRi9C5INCx0YPRhNC10YAuXG4gICAqIEBwYXJhbSB0eXBlIC0g0KLQuNC/INGB0L7Qt9C00LDQstCw0LXQvNC+0LPQviDQsdGD0YTQtdGA0LAuXG4gICAqIEBwYXJhbSBkYXRhIC0g0JTQsNC90L3Ri9C1INCyINCy0LjQtNC1INGC0LjQv9C40LfQuNGA0L7QstCw0L3QvdC+0LPQviDQvNCw0YHRgdC40LLQsCDQtNC70Y8g0LfQsNC/0LjRgdC4INCyINGB0L7Qt9C00LDQstCw0LXQvNGL0Lkg0LHRg9GE0LXRgC5cbiAgICogQHBhcmFtIGtleSAtINCa0LvRjtGHICjQuNC90LTQtdC60YEpLCDQuNC00LXQvdGC0LjRhNC40YbQuNGA0YPRjtGJ0LjQuSDRgtC40L8g0LHRg9GE0LXRgNCwICjQtNC70Y8g0LLQtdGA0YjQuNC9LCDQtNC70Y8g0YbQstC10YLQvtCyLCDQtNC70Y8g0LjQvdC00LXQutGB0L7QsikuINCY0YHQv9C+0LvRjNC30YPQtdGC0YHRjyDQtNC70Y9cbiAgICogICAgINGA0LDQt9C00LXQu9GM0L3QvtCz0L4g0L/QvtC00YHRh9C10YLQsCDQv9Cw0LzRj9GC0LgsINC30LDQvdC40LzQsNC10LzQvtC5INC60LDQttC00YvQvCDRgtC40L/QvtC8INCx0YPRhNC10YDQsC5cbiAgICovXG4gIHByb3RlY3RlZCBhZGRXYkdsQnVmZmVyKGJ1ZmZlcnM6IFdlYkdMQnVmZmVyW10sIHR5cGU6IFdlYkdsQnVmZmVyVHlwZSwgZGF0YTogVHlwZWRBcnJheSwga2V5OiBudW1iZXIpOiB2b2lkIHtcblxuICAgIC8vINCe0L/RgNC10LTQtdC70LXQvdC40LUg0LjQvdC00LXQutGB0LAg0L3QvtCy0L7Qs9C+INGN0LvQtdC80LXQvdGC0LAg0LIg0LzQsNGB0YHQuNCy0LUg0LHRg9GE0LXRgNC+0LIgV2ViR0wuXG4gICAgY29uc3QgaW5kZXggPSB0aGlzLmJ1ZmZlcnMuYW1vdW50T2ZCdWZmZXJHcm91cHNcblxuICAgIC8vINCh0L7Qt9C00LDQvdC40LUg0Lgg0LfQsNC/0L7Qu9C90LXQvdC40LUg0LTQsNC90L3Ri9C80Lgg0L3QvtCy0L7Qs9C+INCx0YPRhNC10YDQsC5cbiAgICBidWZmZXJzW2luZGV4XSA9IHRoaXMuZ2wuY3JlYXRlQnVmZmVyKCkhXG4gICAgdGhpcy5nbC5iaW5kQnVmZmVyKHRoaXMuZ2xbdHlwZV0sIGJ1ZmZlcnNbaW5kZXhdKVxuICAgIHRoaXMuZ2wuYnVmZmVyRGF0YSh0aGlzLmdsW3R5cGVdLCBkYXRhLCB0aGlzLmdsLlNUQVRJQ19EUkFXKVxuXG4gICAgLy8g0KHRh9C10YLRh9C40Log0L/QsNC80Y/RgtC4LCDQt9Cw0L3QuNC80LDQtdC80L7QuSDQsdGD0YTQtdGA0LDQvNC4INC00LDQvdC90YvRhSAo0YDQsNC30LTQtdC70YzQvdC+INC/0L4g0LrQsNC20LTQvtC80YMg0YLQuNC/0YMg0LHRg9GE0LXRgNC+0LIpXG4gICAgdGhpcy5idWZmZXJzLnNpemVJbkJ5dGVzW2tleV0gKz0gZGF0YS5sZW5ndGggKiBkYXRhLkJZVEVTX1BFUl9FTEVNRU5UXG4gIH1cblxuICAvKipcbiAgICog0JLRi9GH0LjRgdC70Y/QtdGCINC60L7QvtGA0LTQuNC90LDRgtGLINCy0LXRgNGI0LjQvSDQv9C+0LvQuNCz0L7QvdCwINGC0YDQtdGD0LPQvtC70YzQvdC+0Lkg0YTQvtGA0LzRiy5cbiAgICog0KLQuNC/INGE0YPQvdC60YbQuNC4OiB7QGxpbmsgU1Bsb3RDYWxjU2hhcGVGdW5jfVxuICAgKlxuICAgKiBAcGFyYW0geCAtINCf0L7Qu9C+0LbQtdC90LjQtSDRhtC10L3RgtGA0LAg0L/QvtC70LjQs9C+0L3QsCDQvdCwINC+0YHQuCDQsNCx0YHRhtC40YHRgS5cbiAgICogQHBhcmFtIHkgLSDQn9C+0LvQvtC20LXQvdC40LUg0YbQtdC90YLRgNCwINC/0L7Qu9C40LPQvtC90LAg0L3QsCDQvtGB0Lgg0L7RgNC00LjQvdCw0YIuXG4gICAqIEBwYXJhbSBjb25zdHMgLSDQndCw0LHQvtGAINCy0YHQv9C+0LzQvtCz0LDRgtC10LvRjNC90YvRhSDQutC+0L3RgdGC0LDQvdGCLCDQuNGB0L/QvtC70YzQt9GD0LXQvNGL0YUg0LTQu9GPINCy0YvRh9C40YHQu9C10L3QuNGPINCy0LXRgNGI0LjQvS5cbiAgICogQHJldHVybnMg0JTQsNC90L3Ri9C1INC+INCy0LXRgNGI0LjQvdCw0YUg0L/QvtC70LjQs9C+0L3QsC5cbiAgICovXG4gIHByb3RlY3RlZCBnZXRWZXJ0aWNlc09mVHJpYW5nbGUoeDogbnVtYmVyLCB5OiBudW1iZXIsIGNvbnN0czogYW55W10pOiBTUGxvdFBvbHlnb25WZXJ0aWNlcyB7XG5cbiAgICBjb25zdCBbeDEsIHkxXSA9IFt4IC0gY29uc3RzWzBdLCB5ICsgY29uc3RzWzJdXVxuICAgIGNvbnN0IFt4MiwgeTJdID0gW3gsIHkgLSBjb25zdHNbMV1dXG4gICAgY29uc3QgW3gzLCB5M10gPSBbeCArIGNvbnN0c1swXSwgeSArIGNvbnN0c1syXV1cblxuICAgIGNvbnN0IHZlcnRpY2VzID0ge1xuICAgICAgdmFsdWVzOiBbeDEsIHkxLCB4MiwgeTIsIHgzLCB5M10sXG4gICAgICBpbmRpY2VzOiBbMCwgMSwgMl1cbiAgICB9XG5cbiAgICByZXR1cm4gdmVydGljZXNcbiAgfVxuXG4gIC8qKlxuICAgKiDQktGL0YfQuNGB0LvRj9C10YIg0LrQvtC+0YDQtNC40L3QsNGC0Ysg0LLQtdGA0YjQuNC9INC/0L7Qu9C40LPQvtC90LAg0LrQstCw0LTRgNCw0YLQvdC+0Lkg0YTQvtGA0LzRiy5cbiAgICog0KLQuNC/INGE0YPQvdC60YbQuNC4OiB7QGxpbmsgU1Bsb3RDYWxjU2hhcGVGdW5jfVxuICAgKlxuICAgKiBAcGFyYW0geCAtINCf0L7Qu9C+0LbQtdC90LjQtSDRhtC10L3RgtGA0LAg0L/QvtC70LjQs9C+0L3QsCDQvdCwINC+0YHQuCDQsNCx0YHRhtC40YHRgS5cbiAgICogQHBhcmFtIHkgLSDQn9C+0LvQvtC20LXQvdC40LUg0YbQtdC90YLRgNCwINC/0L7Qu9C40LPQvtC90LAg0L3QsCDQvtGB0Lgg0L7RgNC00LjQvdCw0YIuXG4gICAqIEBwYXJhbSBjb25zdHMgLSDQndCw0LHQvtGAINCy0YHQv9C+0LzQvtCz0LDRgtC10LvRjNC90YvRhSDQutC+0L3RgdGC0LDQvdGCLCDQuNGB0L/QvtC70YzQt9GD0LXQvNGL0YUg0LTQu9GPINCy0YvRh9C40YHQu9C10L3QuNGPINCy0LXRgNGI0LjQvS5cbiAgICogQHJldHVybnMg0JTQsNC90L3Ri9C1INC+INCy0LXRgNGI0LjQvdCw0YUg0L/QvtC70LjQs9C+0L3QsC5cbiAgICovXG4gIHByb3RlY3RlZCBnZXRWZXJ0aWNlc09mU3F1YXJlKHg6IG51bWJlciwgeTogbnVtYmVyLCBjb25zdHM6IGFueVtdKTogU1Bsb3RQb2x5Z29uVmVydGljZXMge1xuXG4gICAgY29uc3QgW3gxLCB5MV0gPSBbeCAtIGNvbnN0c1swXSwgeSAtIGNvbnN0c1swXV1cbiAgICBjb25zdCBbeDIsIHkyXSA9IFt4ICsgY29uc3RzWzBdLCB5ICsgY29uc3RzWzBdXVxuXG4gICAgY29uc3QgdmVydGljZXMgPSB7XG4gICAgICB2YWx1ZXM6IFt4MSwgeTEsIHgyLCB5MSwgeDIsIHkyLCB4MSwgeTJdLFxuICAgICAgaW5kaWNlczogWzAsIDEsIDIsIDAsIDIsIDNdXG4gICAgfVxuXG4gICAgcmV0dXJuIHZlcnRpY2VzXG4gIH1cblxuICAvKipcbiAgICog0JLRi9GH0LjRgdC70Y/QtdGCINC60L7QvtGA0LTQuNC90LDRgtGLINCy0LXRgNGI0LjQvSDQv9C+0LvQuNCz0L7QvdCwINC60YDRg9Cz0LvQvtC5INGE0L7RgNC80YsuXG4gICAqINCi0LjQvyDRhNGD0L3QutGG0LjQuDoge0BsaW5rIFNQbG90Q2FsY1NoYXBlRnVuY31cbiAgICpcbiAgICogQHBhcmFtIHggLSDQn9C+0LvQvtC20LXQvdC40LUg0YbQtdC90YLRgNCwINC/0L7Qu9C40LPQvtC90LAg0L3QsCDQvtGB0Lgg0LDQsdGB0YbQuNGB0YEuXG4gICAqIEBwYXJhbSB5IC0g0J/QvtC70L7QttC10L3QuNC1INGG0LXQvdGC0YDQsCDQv9C+0LvQuNCz0L7QvdCwINC90LAg0L7RgdC4INC+0YDQtNC40L3QsNGCLlxuICAgKiBAcGFyYW0gY29uc3RzIC0g0J3QsNCx0L7RgCDQstGB0L/QvtC80L7Qs9Cw0YLQtdC70YzQvdGL0YUg0LrQvtC90YHRgtCw0L3Rgiwg0LjRgdC/0L7Qu9GM0LfRg9C10LzRi9GFINC00LvRjyDQstGL0YfQuNGB0LvQtdC90LjRjyDQstC10YDRiNC40L0uXG4gICAqIEByZXR1cm5zINCU0LDQvdC90YvQtSDQviDQstC10YDRiNC40L3QsNGFINC/0L7Qu9C40LPQvtC90LAuXG4gICAqL1xuICBwcm90ZWN0ZWQgZ2V0VmVydGljZXNPZkNpcmNsZSh4OiBudW1iZXIsIHk6IG51bWJlciwgY29uc3RzOiBhbnlbXSk6IFNQbG90UG9seWdvblZlcnRpY2VzIHtcblxuICAgIC8vINCX0LDQvdC10YHQtdC90LjQtSDQsiDQvdCw0LHQvtGAINCy0LXRgNGI0LjQvSDRhtC10L3RgtGA0LAg0LrRgNGD0LPQsC5cbiAgICBjb25zdCB2ZXJ0aWNlczogU1Bsb3RQb2x5Z29uVmVydGljZXMgPSB7XG4gICAgICB2YWx1ZXM6IFt4LCB5XSxcbiAgICAgIGluZGljZXM6IFtdXG4gICAgfVxuXG4gICAgLy8g0JTQvtCx0LDQstC70LXQvdC40LUg0LDQv9GA0L7QutGB0LjQvNC40YDRg9GO0YnQuNGFINC+0LrRgNGD0LbQvdC+0YHRgtGMINC60YDRg9Cz0LAg0LLQtdGA0YjQuNC9LlxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29uc3RzWzNdLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2ZXJ0aWNlcy52YWx1ZXMucHVzaCh4ICsgY29uc3RzWzNdW2ldLCB5ICsgY29uc3RzWzRdW2ldKVxuICAgICAgdmVydGljZXMuaW5kaWNlcy5wdXNoKDAsIGkgKyAxLCBpICsgMilcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDQn9C+0YHQu9C10LTQvdGP0Y8g0LLQtdGA0YjQuNC90LAg0L/QvtGB0LvQtdC00L3QtdCz0L4gR0wt0YLRgNC10YPQs9C+0LvRjNC90LjQutCwINC30LDQvNC10L3Rj9C10YLRgdGPINC90LAg0L/QtdGA0LLRg9GOINCw0L/RgNC+0LrRgdC40LzQuNGA0YPRjtGJ0YPRjlxuICAgICAqINC+0LrRgNGD0LbQvdC+0YHRgtGMINC60YDRg9Cz0LAg0LLQtdGA0YjQuNC90YMsINC30LDQvNGL0LrQsNGPINCw0L/RgNC+0LrRgdC40LzQuNGA0YPRidC40Lkg0LrRgNGD0LMg0L/QvtC70LjQs9C+0L0uXG4gICAgICovXG4gICAgdmVydGljZXMuaW5kaWNlc1t2ZXJ0aWNlcy5pbmRpY2VzLmxlbmd0aCAtIDFdID0gMVxuXG4gICAgcmV0dXJuIHZlcnRpY2VzXG4gIH1cblxuICAvKipcbiAgICog0KHQvtC30LTQsNC10YIg0Lgg0LTQvtCx0LDQstC70Y/QtdGCINCyINCz0YDRg9C/0L/RgyDQv9C+0LvQuNCz0L7QvdC+0LIg0L3QvtCy0YvQuSDQv9C+0LvQuNCz0L7QvS5cbiAgICpcbiAgICogQHBhcmFtIHBvbHlnb25Hcm91cCAtINCT0YDRg9C/0L/QsCDQv9C+0LvQuNCz0L7QvdC+0LIsINCyINC60L7RgtC+0YDRg9GOINC/0YDQvtC40YHRhdC+0LTQuNGCINC00L7QsdCw0LLQu9C10L3QuNC1LlxuICAgKiBAcGFyYW0gcG9seWdvbiAtINCY0L3RhNC+0YDQvNCw0YbQuNGPINC+INC00L7QsdCw0LLQu9GP0LXQvNC+0Lwg0L/QvtC70LjQs9C+0L3QtS5cbiAgICovXG4gIHByb3RlY3RlZCBhZGRQb2x5Z29uKHBvbHlnb25Hcm91cDogU1Bsb3RQb2x5Z29uR3JvdXAsIHBvbHlnb246IFNQbG90UG9seWdvbik6IHZvaWQge1xuXG4gICAgLyoqXG4gICAgICog0JIg0LfQsNCy0LjRgdC40LzQvtGB0YLQuCDQvtGCINGE0L7RgNC80Ysg0L/QvtC70LjQs9C+0L3QsCDQuCDQutC+0L7RgNC00LjQvdCw0YIg0LXQs9C+INGG0LXQvdGC0YDQsCDQstGL0LfRi9Cy0LDQtdGC0YHRjyDRgdC+0L7RgtCy0LXRgtGB0LLRg9GO0YnQsNGPINGE0YPQvdC60YbQuNGPINC90LDRhdC+0LbQtNC10L3QuNGPINC60L7QvtGA0LTQuNC90LDRgiDQtdCz0L5cbiAgICAgKiDQstC10YDRiNC40L0uXG4gICAgICovXG4gICAgY29uc3QgdmVydGljZXMgPSB0aGlzLnNoYXBlc1twb2x5Z29uLnNoYXBlXS5jYWxjKFxuICAgICAgcG9seWdvbi54LCBwb2x5Z29uLnksIHRoaXMuVVNFRlVMX0NPTlNUU1xuICAgIClcblxuICAgIC8vINCa0L7Qu9C40YfQtdGB0YLQstC+INCy0LXRgNGI0LjQvSAtINGN0YLQviDQutC+0LvQuNGH0LXRgdGC0LLQviDQv9Cw0YAg0YfQuNGB0LXQuyDQsiDQvNCw0YHRgdC40LLQtSDQstC10YDRiNC40L0uXG4gICAgY29uc3QgYW1vdW50T2ZWZXJ0aWNlcyA9IE1hdGgudHJ1bmModmVydGljZXMudmFsdWVzLmxlbmd0aCAvIDIpXG5cbiAgICAvLyDQndCw0YXQvtC20LTQtdC90LjQtSDQuNC90LTQtdC60YHQsCDQv9C10YDQstC+0Lkg0LTQvtCx0LDQstC70Y/QtdC80L7QuSDQsiDQs9GA0YPQv9C/0YMg0L/QvtC70LjQs9C+0L3QvtCyINCy0LXRgNGI0LjQvdGLLlxuICAgIGNvbnN0IGluZGV4T2ZMYXN0VmVydGV4ID0gcG9seWdvbkdyb3VwLmFtb3VudE9mVmVydGljZXNcblxuICAgIC8qKlxuICAgICAqINCd0L7QvNC10YDQsCDQuNC90LTQtdC60YHQvtCyINCy0LXRgNGI0LjQvSAtINC+0YLQvdC+0YHQuNGC0LXQu9GM0L3Ri9C1LiDQlNC70Y8g0LLRi9GH0LjRgdC70LXQvdC40Y8g0LDQsdGB0L7Qu9GO0YLQvdGL0YUg0LjQvdC00LXQutGB0L7QsiDQvdC10L7QsdGF0L7QtNC40LzQviDQv9GA0LjQsdCw0LLQuNGC0Ywg0Log0L7RgtC90L7RgdC40YLQtdC70YzQvdGL0LxcbiAgICAgKiDQuNC90LTQtdC60YHQsNC8INC40L3QtNC10LrRgSDQv9C10YDQstC+0Lkg0LTQvtCx0LDQstC70Y/QtdC80L7QuSDQsiDQs9GA0YPQv9C/0YMg0L/QvtC70LjQs9C+0L3QvtCyINCy0LXRgNGI0LjQvdGLLlxuICAgICAqL1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmVydGljZXMuaW5kaWNlcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmVydGljZXMuaW5kaWNlc1tpXSArPSBpbmRleE9mTGFzdFZlcnRleFxuICAgIH1cblxuICAgIC8qKlxuICAgICAqINCU0L7QsdCw0LLQu9C10L3QuNC1INCyINCz0YDRg9C/0L/RgyDQv9C+0LvQuNCz0L7QvdC+0LIg0LjQvdC00LXQutGB0L7QsiDQstC10YDRiNC40L0g0L3QvtCy0L7Qs9C+INC/0L7Qu9C40LPQvtC90LAg0Lgg0L/QvtC00YHRh9C10YIg0L7QsdGJ0LXQs9C+INC60L7Qu9C40YfQtdGB0YLQstCwINCy0LXRgNGI0LjQvSBHTC3RgtGA0LXRg9Cz0L7Qu9GM0L3QuNC60L7QslxuICAgICAqINCyINCz0YDRg9C/0L/QtS5cbiAgICAgKi9cbiAgICBwb2x5Z29uR3JvdXAuaW5kaWNlcy5wdXNoKC4uLnZlcnRpY2VzLmluZGljZXMpXG4gICAgcG9seWdvbkdyb3VwLmFtb3VudE9mR0xWZXJ0aWNlcyArPSB2ZXJ0aWNlcy5pbmRpY2VzLmxlbmd0aFxuXG4gICAgLy8g0JTQvtCx0LDQstC70LXQvdC40LUg0LIg0LPRgNGD0L/Qv9GDINC/0L7Qu9C40LPQvtC90L7QsiDQstC10YDRiNC40L0g0L3QvtCy0L7Qs9C+INC/0L7Qu9C40LPQvtC90LAg0Lgg0L/QvtC00YHRh9C10YIg0L7QsdGJ0LXQs9C+INC60L7Qu9C40YfQtdGB0YLQstCwINCy0LXRgNGI0LjQvSDQsiDQs9GA0YPQv9C/0LUuXG4gICAgcG9seWdvbkdyb3VwLnZlcnRpY2VzLnB1c2goLi4udmVydGljZXMudmFsdWVzKVxuICAgIHBvbHlnb25Hcm91cC5hbW91bnRPZlZlcnRpY2VzICs9IGFtb3VudE9mVmVydGljZXNcblxuICAgIC8vINCU0L7QsdCw0LLQu9C10L3QuNC1INGG0LLQtdGC0L7QsiDQstC10YDRiNC40L0gLSDQv9C+INC+0LTQvdC+0LzRgyDRhtCy0LXRgtGDINC90LAg0LrQsNC20LTRg9GOINCy0LXRgNGI0LjQvdGDLlxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYW1vdW50T2ZWZXJ0aWNlczsgaSsrKSB7XG4gICAgICBwb2x5Z29uR3JvdXAuY29sb3JzLnB1c2gocG9seWdvbi5jb2xvcilcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICog0JLRi9Cy0L7QtNC40YIg0LHQsNC30L7QstGD0Y4g0YfQsNGB0YLRjCDQvtGC0LvQsNC00L7Rh9C90L7QuSDQuNC90YTQvtGA0LzQsNGG0LjQuC5cbiAgICpcbiAgICogQHBhcmFtIG9wdGlvbnMgLSDQn9C+0LvRjNC30L7QstCw0YLQtdC70YzRgdC60LjQtSDQvdCw0YHRgtGA0L7QudC60Lgg0Y3QutC30LXQvNC/0LvRj9GA0LAuXG4gICAqL1xuICBwcm90ZWN0ZWQgcmVwb3J0TWFpbkluZm8ob3B0aW9uczogU1Bsb3RPcHRpb25zKTogdm9pZCB7XG5cbiAgICBjb25zb2xlLmxvZygnJWPQktC60LvRjtGH0LXQvSDRgNC10LbQuNC8INC+0YLQu9Cw0LTQutC4ICcgKyB0aGlzLmNvbnN0cnVjdG9yLm5hbWUgKyAnINC90LAg0L7QsdGK0LXQutGC0LUgWyMnICsgdGhpcy5jYW52YXMuaWQgKyAnXScsXG4gICAgICB0aGlzLmRlYnVnTW9kZS5oZWFkZXJTdHlsZSlcblxuICAgIGlmICh0aGlzLmRlbW9Nb2RlLmlzRW5hYmxlKSB7XG4gICAgICBjb25zb2xlLmxvZygnJWPQktC60LvRjtGH0LXQvSDQtNC10LzQvtC90YHRgtGA0LDRhtC40L7QvdC90YvQuSDRgNC10LbQuNC8INC00LDQvdC90YvRhScsIHRoaXMuZGVidWdNb2RlLmdyb3VwU3R5bGUpXG4gICAgfVxuXG4gICAgY29uc29sZS5ncm91cCgnJWPQn9GA0LXQtNGD0L/RgNC10LbQtNC10L3QuNC1JywgdGhpcy5kZWJ1Z01vZGUuZ3JvdXBTdHlsZSlcbiAgICB7XG4gICAgICBjb25zb2xlLmRpcign0J7RgtC60YDRi9GC0LDRjyDQutC+0L3RgdC+0LvRjCDQsdGA0LDRg9C30LXRgNCwINC4INC00YDRg9Cz0LjQtSDQsNC60YLQuNCy0L3Ri9C1INGB0YDQtdC00YHRgtCy0LAg0LrQvtC90YLRgNC+0LvRjyDRgNCw0LfRgNCw0LHQvtGC0LrQuCDRgdGD0YnQtdGB0YLQstC10L3QvdC+INGB0L3QuNC20LDRjtGCINC/0YDQvtC40LfQstC+0LTQuNGC0LXQu9GM0L3QvtGB0YLRjCDQstGL0YHQvtC60L7QvdCw0LPRgNGD0LbQtdC90L3Ri9GFINC/0YDQuNC70L7QttC10L3QuNC5LiDQlNC70Y8g0L7QsdGK0LXQutGC0LjQstC90L7Qs9C+INCw0L3QsNC70LjQt9CwINC/0YDQvtC40LfQstC+0LTQuNGC0LXQu9GM0L3QvtGB0YLQuCDQstGB0LUg0L/QvtC00L7QsdC90YvQtSDRgdGA0LXQtNGB0YLQstCwINC00L7Qu9C20L3RiyDQsdGL0YLRjCDQvtGC0LrQu9GO0YfQtdC90YssINCwINC60L7QvdGB0L7Qu9GMINCx0YDQsNGD0LfQtdGA0LAg0LfQsNC60YDRi9GC0LAuINCd0LXQutC+0YLQvtGA0YvQtSDQtNCw0L3QvdGL0LUg0L7RgtC70LDQtNC+0YfQvdC+0Lkg0LjQvdGE0L7RgNC80LDRhtC40Lgg0LIg0LfQsNCy0LjRgdC40LzQvtGB0YLQuCDQvtGCINC40YHQv9C+0LvRjNC30YPQtdC80L7Qs9C+INCx0YDQsNGD0LfQtdGA0LAg0LzQvtCz0YPRgiDQvdC1INC+0YLQvtCx0YDQsNC20LDRgtGM0YHRjyDQuNC70Lgg0L7RgtC+0LHRgNCw0LbQsNGC0YzRgdGPINC90LXQutC+0YDRgNC10LrRgtC90L4uINCh0YDQtdC00YHRgtCy0L4g0L7RgtC70LDQtNC60Lgg0L/RgNC+0YLQtdGB0YLQuNGA0L7QstCw0L3QviDQsiDQsdGA0LDRg9C30LXRgNC1IEdvb2dsZSBDaHJvbWUgdi45MCcpXG4gICAgfVxuICAgIGNvbnNvbGUuZ3JvdXBFbmQoKVxuXG4gICAgY29uc29sZS5ncm91cCgnJWPQktC40LTQtdC+0YHQuNGB0YLQtdC80LAnLCB0aGlzLmRlYnVnTW9kZS5ncm91cFN0eWxlKVxuICAgIHtcbiAgICAgIGxldCBleHQgPSB0aGlzLmdsLmdldEV4dGVuc2lvbignV0VCR0xfZGVidWdfcmVuZGVyZXJfaW5mbycpXG4gICAgICBsZXQgZ3JhcGhpY3NDYXJkTmFtZSA9IChleHQpID8gdGhpcy5nbC5nZXRQYXJhbWV0ZXIoZXh0LlVOTUFTS0VEX1JFTkRFUkVSX1dFQkdMKSA6ICdb0L3QtdC40LfQstC10YHRgtC90L5dJ1xuICAgICAgY29uc29sZS5sb2coJ9CT0YDQsNGE0LjRh9C10YHQutCw0Y8g0LrQsNGA0YLQsDogJyArIGdyYXBoaWNzQ2FyZE5hbWUpXG4gICAgICBjb25zb2xlLmxvZygn0JLQtdGA0YHQuNGPIEdMOiAnICsgdGhpcy5nbC5nZXRQYXJhbWV0ZXIodGhpcy5nbC5WRVJTSU9OKSlcbiAgICB9XG4gICAgY29uc29sZS5ncm91cEVuZCgpXG5cbiAgICBjb25zb2xlLmdyb3VwKCclY9Cd0LDRgdGC0YDQvtC50LrQsCDQv9Cw0YDQsNC80LXRgtGA0L7QsiDRjdC60LfQtdC80L/Qu9GP0YDQsCcsIHRoaXMuZGVidWdNb2RlLmdyb3VwU3R5bGUpXG4gICAge1xuICAgICAgY29uc29sZS5kaXIodGhpcylcbiAgICAgIGNvbnNvbGUubG9nKCfQl9Cw0LTQsNC90Ysg0L/QsNGA0LDQvNC10YLRgNGLOlxcbicsIEpTT04uc3RyaW5naWZ5KG9wdGlvbnMsIG51bGwsICcgJykpXG4gICAgICBjb25zb2xlLmxvZygn0JrQsNC90LLQsNGBOiAjJyArIHRoaXMuY2FudmFzLmlkKVxuICAgICAgY29uc29sZS5sb2coJ9Cg0LDQt9C80LXRgCDQutCw0L3QstCw0YHQsDogJyArIHRoaXMuY2FudmFzLndpZHRoICsgJyB4ICcgKyB0aGlzLmNhbnZhcy5oZWlnaHQgKyAnIHB4JylcbiAgICAgIGNvbnNvbGUubG9nKCfQoNCw0LfQvNC10YAg0L/Qu9C+0YHQutC+0YHRgtC4OiAnICsgdGhpcy5ncmlkU2l6ZS53aWR0aCArICcgeCAnICsgdGhpcy5ncmlkU2l6ZS5oZWlnaHQgKyAnIHB4JylcbiAgICAgIGNvbnNvbGUubG9nKCfQoNCw0LfQvNC10YAg0L/QvtC70LjQs9C+0L3QsDogJyArIHRoaXMucG9seWdvblNpemUgKyAnIHB4JylcbiAgICAgIGNvbnNvbGUubG9nKCfQkNC/0YDQvtC60YHQuNC80LDRhtC40Y8g0L7QutGA0YPQttC90L7RgdGC0Lg6ICcgKyB0aGlzLmNpcmNsZUFwcHJveExldmVsICsgJyDRg9Cz0LvQvtCyJylcbiAgICAgIGNvbnNvbGUubG9nKCfQpNGD0L3QutGG0LjRjyDQv9C10YDQtdCx0L7RgNCwOiAnICsgdGhpcy5pdGVyYXRpb25DYWxsYmFjayEubmFtZSlcbiAgICB9XG4gICAgY29uc29sZS5ncm91cEVuZCgpXG4gIH1cblxuICAvKipcbiAgICog0JLRi9Cy0L7QtNC40YIg0LIg0LrQvtC90YHQvtC70Ywg0L7RgtC70LDQtNC+0YfQvdGD0Y4g0LjQvdGE0L7RgNC80LDRhtC40Y4g0L4g0LfQsNCz0YDRg9C30LrQtSDQtNCw0L3QvdGL0YUg0LIg0LLQuNC00LXQvtC/0LDQvNGP0YLRjC5cbiAgICovXG4gIHByb3RlY3RlZCByZXBvcnRBYm91dE9iamVjdFJlYWRpbmcoKTogdm9pZCB7XG5cbiAgICBjb25zb2xlLmdyb3VwKCclY9CX0LDQs9GA0YPQt9C60LAg0LTQsNC90L3Ri9GFINC30LDQstC10YDRiNC10L3QsCBbJyArIHRoaXMuZ2V0Q3VycmVudFRpbWUoKSArICddJywgdGhpcy5kZWJ1Z01vZGUuZ3JvdXBTdHlsZSlcbiAgICB7XG4gICAgICBjb25zb2xlLnRpbWVFbmQoJ9CU0LvQuNGC0LXQu9GM0L3QvtGB0YLRjCcpXG5cbiAgICAgIGNvbnNvbGUubG9nKCfQoNC10LfRg9C70YzRgtCw0YI6ICcgK1xuICAgICAgICAoKHRoaXMuYW1vdW50T2ZQb2x5Z29ucyA+PSB0aGlzLm1heEFtb3VudE9mUG9seWdvbnMpID8gJ9C00L7RgdGC0LjQs9C90YPRgiDQt9Cw0LTQsNC90L3Ri9C5INC70LjQvNC40YIgKCcgK1xuICAgICAgICAgIHRoaXMubWF4QW1vdW50T2ZQb2x5Z29ucy50b0xvY2FsZVN0cmluZygpICsgJyknIDogJ9C+0LHRgNCw0LHQvtGC0LDQvdGLINCy0YHQtSDQvtCx0YrQtdC60YLRiycpKVxuXG4gICAgICBjb25zb2xlLmdyb3VwKCfQmtC+0Lst0LLQviDQvtCx0YrQtdC60YLQvtCyOiAnICsgdGhpcy5hbW91bnRPZlBvbHlnb25zLnRvTG9jYWxlU3RyaW5nKCkpXG4gICAgICB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zaGFwZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBjb25zdCBzaGFwZUNhcGN0aW9uID0gdGhpcy5zaGFwZXNbaV0ubmFtZVxuICAgICAgICAgIGNvbnN0IHNoYXBlQW1vdW50ID0gdGhpcy5idWZmZXJzLmFtb3VudE9mU2hhcGVzW2ldXG4gICAgICAgICAgY29uc29sZS5sb2coc2hhcGVDYXBjdGlvbiArICc6ICcgKyBzaGFwZUFtb3VudC50b0xvY2FsZVN0cmluZygpICtcbiAgICAgICAgICAgICcgW34nICsgTWF0aC5yb3VuZCgxMDAgKiBzaGFwZUFtb3VudCAvIHRoaXMuYW1vdW50T2ZQb2x5Z29ucykgKyAnJV0nKVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc29sZS5sb2coJ9Cf0LDQu9C40YLRgNCwOiAnICsgdGhpcy5wb2x5Z29uUGFsZXR0ZS5sZW5ndGggKyAnINGG0LLQtdGC0L7QsicpXG4gICAgICB9XG4gICAgICBjb25zb2xlLmdyb3VwRW5kKClcblxuICAgICAgbGV0IGJ5dGVzVXNlZEJ5QnVmZmVycyA9IHRoaXMuYnVmZmVycy5zaXplSW5CeXRlc1swXSArIHRoaXMuYnVmZmVycy5zaXplSW5CeXRlc1sxXSArIHRoaXMuYnVmZmVycy5zaXplSW5CeXRlc1syXVxuXG4gICAgICBjb25zb2xlLmdyb3VwKCfQl9Cw0L3Rj9GC0L4g0LLQuNC00LXQvtC/0LDQvNGP0YLQuDogJyArIChieXRlc1VzZWRCeUJ1ZmZlcnMgLyAxMDAwMDAwKS50b0ZpeGVkKDIpLnRvTG9jYWxlU3RyaW5nKCkgKyAnINCc0JEnKVxuICAgICAge1xuICAgICAgICBjb25zb2xlLmxvZygn0JHRg9GE0LXRgNGLINCy0LXRgNGI0LjQvTogJyArXG4gICAgICAgICAgKHRoaXMuYnVmZmVycy5zaXplSW5CeXRlc1swXSAvIDEwMDAwMDApLnRvRml4ZWQoMikudG9Mb2NhbGVTdHJpbmcoKSArICcg0JzQkScgK1xuICAgICAgICAgICcgW34nICsgTWF0aC5yb3VuZCgxMDAgKiB0aGlzLmJ1ZmZlcnMuc2l6ZUluQnl0ZXNbMF0gLyBieXRlc1VzZWRCeUJ1ZmZlcnMpICsgJyVdJylcblxuICAgICAgICBjb25zb2xlLmxvZygn0JHRg9GE0LXRgNGLINGG0LLQtdGC0L7QsjogJ1xuICAgICAgICAgICsgKHRoaXMuYnVmZmVycy5zaXplSW5CeXRlc1sxXSAvIDEwMDAwMDApLnRvRml4ZWQoMikudG9Mb2NhbGVTdHJpbmcoKSArICcg0JzQkScgK1xuICAgICAgICAgICcgW34nICsgTWF0aC5yb3VuZCgxMDAgKiB0aGlzLmJ1ZmZlcnMuc2l6ZUluQnl0ZXNbMV0gLyBieXRlc1VzZWRCeUJ1ZmZlcnMpICsgJyVdJylcblxuICAgICAgICBjb25zb2xlLmxvZygn0JHRg9GE0LXRgNGLINC40L3QtNC10LrRgdC+0LI6ICdcbiAgICAgICAgICArICh0aGlzLmJ1ZmZlcnMuc2l6ZUluQnl0ZXNbMl0gLyAxMDAwMDAwKS50b0ZpeGVkKDIpLnRvTG9jYWxlU3RyaW5nKCkgKyAnINCc0JEnICtcbiAgICAgICAgICAnIFt+JyArIE1hdGgucm91bmQoMTAwICogdGhpcy5idWZmZXJzLnNpemVJbkJ5dGVzWzJdIC8gYnl0ZXNVc2VkQnlCdWZmZXJzKSArICclXScpXG4gICAgICB9XG4gICAgICBjb25zb2xlLmdyb3VwRW5kKClcblxuICAgICAgY29uc29sZS5sb2coJ9Ca0L7Quy3QstC+INCz0YDRg9C/0L8g0LHRg9GE0LXRgNC+0LI6ICcgKyB0aGlzLmJ1ZmZlcnMuYW1vdW50T2ZCdWZmZXJHcm91cHMudG9Mb2NhbGVTdHJpbmcoKSlcbiAgICAgIGNvbnNvbGUubG9nKCfQmtC+0Lst0LLQviBHTC3RgtGA0LXRg9Cz0L7Qu9GM0L3QuNC60L7QsjogJyArICh0aGlzLmJ1ZmZlcnMuYW1vdW50T2ZUb3RhbEdMVmVydGljZXMgLyAzKS50b0xvY2FsZVN0cmluZygpKVxuICAgICAgY29uc29sZS5sb2coJ9Ca0L7Quy3QstC+INCy0LXRgNGI0LjQvTogJyArIHRoaXMuYnVmZmVycy5hbW91bnRPZlRvdGFsVmVydGljZXMudG9Mb2NhbGVTdHJpbmcoKSlcbiAgICB9XG4gICAgY29uc29sZS5ncm91cEVuZCgpXG4gIH1cblxuICAvKipcbiAgICog0KHQvtC30LTQsNC10YIg0LTQvtC/0L7Qu9C90LXQvdC40LUg0Log0LrQvtC00YMg0L3QsCDRj9C30YvQutC1IEdMU0wuXG4gICAqXG4gICAqIEByZW1hcmtzXG4gICAqINCSINC00LDQu9GM0L3QtdC50YjQtdC8INGB0L7Qt9C00LDQvdC90YvQuSDQutC+0LQg0LHRg9C00LXRgiDQstGB0YLRgNC+0LXQvSDQsiDQutC+0LQg0LLQtdGA0YjQuNC90L3QvtCz0L4g0YjQtdC50LTQtdGA0LAg0LTQu9GPINC30LDQtNCw0L3QuNGPINGG0LLQtdGC0LAg0LLQtdGA0YjQuNC90Ysg0LIg0LfQsNCy0LjRgdC40LzQvtGB0YLQuCDQvtGCXG4gICAqINC40L3QtNC10LrRgdCwINGG0LLQtdGC0LAsINC/0YDQuNGB0LLQvtC10L3QvdC+0LPQviDRjdGC0L7QuSDQstC10YDRiNC40L3QtS4g0KIu0LouINGI0LXQudC00LXRgCDQvdC1INC/0L7Qt9Cy0L7Qu9GP0LXRgiDQuNGB0L/QvtC70YzQt9C+0LLQsNGC0Ywg0LIg0LrQsNGH0LXRgdGC0LLQtSDQuNC90LTQtdC60YHQvtCyINC/0LXRgNC10LzQtdC90L3Ri9C1IC1cbiAgICog0LTQu9GPINC30LDQtNCw0L3QuNGPINGG0LLQtdGC0LAg0LjRgdC/0L7Qu9GM0LfRg9C10YLRgdGPINC/0LXRgNC10LHQvtGAINGG0LLQtdGC0L7QstGL0YUg0LjQvdC00LXQutGB0L7Qsi5cbiAgICpcbiAgICogQHJldHVybnMg0JrQvtC0INC90LAg0Y/Qt9GL0LrQtSBHTFNMLlxuICAgKi9cbiAgcHJvdGVjdGVkIGdlblNoYWRlckNvbG9yQ29kZSgpOiBzdHJpbmcge1xuXG4gICAgLy8g0JLRgNC10LzQtdC90L3QvtC1INC00L7QsdCw0LLQu9C10L3QuNC1INCyINC/0LDQu9C40YLRgNGDINGG0LLQtdGC0L7QsiDQstC10YDRiNC40L0g0YbQstC10YLQsCDQvdCw0L/RgNCw0LLQu9GP0Y7RidC40YUuXG4gICAgdGhpcy5wb2x5Z29uUGFsZXR0ZS5wdXNoKHRoaXMucnVsZXNDb2xvcilcblxuICAgIGxldCBjb2RlOiBzdHJpbmcgPSAnJ1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBvbHlnb25QYWxldHRlLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgIC8vINCf0L7Qu9GD0YfQtdC90LjQtSDRhtCy0LXRgtCwINCyINC90YPQttC90L7QvCDRhNC+0YDQvNCw0YLQtS5cbiAgICAgIGxldCBbciwgZywgYl0gPSB0aGlzLmNvbnZlcnRDb2xvcih0aGlzLnBvbHlnb25QYWxldHRlW2ldKVxuXG4gICAgICAvLyDQpNC+0YDQvNC40YDQvtCy0L3QuNC1INGB0YLRgNC+0LogR0xTTC3QutC+0LTQsCDQv9GA0L7QstC10YDQutC4INC40L3QtNC10LrRgdCwINGG0LLQtdGC0LAuXG4gICAgICBjb2RlICs9ICgoaSA9PT0gMCkgPyAnJyA6ICcgIGVsc2UgJykgKyAnaWYgKGFfY29sb3IgPT0gJyArIGkgKyAnLjApIHZfY29sb3IgPSB2ZWMzKCcgK1xuICAgICAgICByLnRvU3RyaW5nKCkuc2xpY2UoMCwgOSkgKyAnLCcgK1xuICAgICAgICBnLnRvU3RyaW5nKCkuc2xpY2UoMCwgOSkgKyAnLCcgK1xuICAgICAgICBiLnRvU3RyaW5nKCkuc2xpY2UoMCwgOSkgKyAnKTtcXG4nXG4gICAgfVxuXG4gICAgLy8g0KPQtNCw0LvQtdC90LjQtSDQuNC3INC/0LDQu9C40YLRgNGLINCy0LXRgNGI0LjQvSDQstGA0LXQvNC10L3QvdC+INC00L7QsdCw0LLQu9C10L3QvdC+0LPQviDRhtCy0LXRgtCwINC90LDQv9GA0LDQstC70Y/RjtGJ0LjRhS5cbiAgICB0aGlzLnBvbHlnb25QYWxldHRlLnBvcCgpXG5cbiAgICByZXR1cm4gY29kZVxuICB9XG5cbiAgLyoqXG4gICAqINCa0L7QvdCy0LXRgNGC0LjRgNGD0LXRgiDRhtCy0LXRgiDQuNC3IEhFWC3Qv9GA0LXQtNGB0YLQsNCy0LvQtdC90LjRjyDQsiDQv9GA0LXQtNGB0YLQsNCy0LvQtdC90LjQtSDRhtCy0LXRgtCwINC00LvRjyBHTFNMLdC60L7QtNCwIChSR0Ig0YEg0LTQuNCw0L/QsNC30L7QvdCw0LzQuCDQt9C90LDRh9C10L3QuNC5INC+0YIgMCDQtNC+IDEpLlxuICAgKlxuICAgKiBAcGFyYW0gaGV4Q29sb3IgLSDQptCy0LXRgiDQsiBIRVgt0YTQvtGA0LzQsNGC0LUuXG4gICAqIEByZXR1cm5zINCc0LDRgdGB0LjQsiDQuNC3INGC0YDQtdGFINGH0LjRgdC10Lsg0LIg0LTQuNCw0L/QsNC30L7QvdC1INC+0YIgMCDQtNC+IDEuXG4gICAqL1xuICBwcm90ZWN0ZWQgY29udmVydENvbG9yKGhleENvbG9yOiBIRVhDb2xvcik6IG51bWJlcltdIHtcblxuICAgIGxldCBrID0gL14jPyhbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KSQvaS5leGVjKGhleENvbG9yKVxuICAgIGxldCBbciwgZywgYl0gPSBbcGFyc2VJbnQoayFbMV0sIDE2KSAvIDI1NSwgcGFyc2VJbnQoayFbMl0sIDE2KSAvIDI1NSwgcGFyc2VJbnQoayFbM10sIDE2KSAvIDI1NV1cblxuICAgIHJldHVybiBbciwgZywgYl1cbiAgfVxuXG4gIC8qKlxuICAgKiDQktGL0YfQuNGB0LvRj9C10YIg0YLQtdC60YPRidC10LUg0LLRgNC10LzRjy5cbiAgICpcbiAgICogQHJldHVybnMg0KHRgtGA0L7QutC+0LLQsNGPINGE0L7RgNC80LDRgtC40YDQvtCy0LDQvdC90LDRjyDQt9Cw0L/QuNGB0Ywg0YLQtdC60YPRidC10LPQviDQstGA0LXQvNC10L3QuC5cbiAgICovXG4gIHByb3RlY3RlZCBnZXRDdXJyZW50VGltZSgpOiBzdHJpbmcge1xuXG4gICAgbGV0IHRvZGF5ID0gbmV3IERhdGUoKTtcblxuICAgIGxldCB0aW1lID1cbiAgICAgICgodG9kYXkuZ2V0SG91cnMoKSA8IDEwID8gJzAnIDogJycpICsgdG9kYXkuZ2V0SG91cnMoKSkgKyBcIjpcIiArXG4gICAgICAoKHRvZGF5LmdldE1pbnV0ZXMoKSA8IDEwID8gJzAnIDogJycpICsgdG9kYXkuZ2V0TWludXRlcygpKSArIFwiOlwiICtcbiAgICAgICgodG9kYXkuZ2V0U2Vjb25kcygpIDwgMTAgPyAnMCcgOiAnJykgKyB0b2RheS5nZXRTZWNvbmRzKCkpXG5cbiAgICByZXR1cm4gdGltZVxuICB9XG5cbiAgLyoqXG4gICAqINCe0LHQvdC+0LLQu9GP0LXRgiDQvNCw0YLRgNC40YbRgyDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuC5cbiAgICpcbiAgICogQHJlbWFya3NcbiAgICog0KHRg9GJ0LXRgdGC0LLRg9C10YIg0LTQstCwINCy0LDRgNC40LDQvdGC0LAg0LLRi9C30L7QstCwINC80LXRgtC+0LTQsCAtINC40Lcg0LTRgNGD0LPQvtCz0L4g0LzQtdGC0L7QtNCwINGN0LrQt9C10LzQv9C70Y/RgNCwICh7QGxpbmsgcmVuZGVyfSkg0Lgg0LjQtyDQvtCx0YDQsNCx0L7RgtGH0LjQutCwINGB0L7QsdGL0YLQuNGPINC80YvRiNC4XG4gICAqICh7QGxpbmsgaGFuZGxlTW91c2VXaGVlbH0pLiDQktC+INCy0YLQvtGA0L7QvCDQstCw0YDQuNCw0L3RgtC1INC40YHQv9C+0LvRjNC30L7QstCw0L3QuNC1INC+0LHRitC10LrRgtCwIHRoaXMg0L3QtdCy0L7Qt9C80L7QttC90L4uINCU0LvRjyDRg9C90LjQstC10YDRgdCw0LvRjNC90L7RgdGC0Lgg0LLRi9C30L7QstCwXG4gICAqINC80LXRgtC+0LTQsCAtINCyINC90LXQs9C+INCy0YHQtdCz0LTQsCDRj9Cy0L3QviDQvdC10L7QsdGF0L7QtNC40LzQviDQv9C10YDQtdC00LDQstCw0YLRjCDRgdGB0YvQu9C60YMg0L3QsCDRjdC60LfQtdC80L/Qu9GP0YAg0LrQu9Cw0YHRgdCwLlxuICAgKlxuICAgKiBAcGFyYW0gJHRoaXMgLSDQrdC60LfQtdC80L/Qu9GP0YAg0LrQu9Cw0YHRgdCwLCDRh9GM0Y4g0LzQsNGC0YDQuNGG0YMg0YLRgNCw0L3RgdGE0L7RgNC80LDRhtC40Lgg0L3QtdC+0LHRhdC+0LTQuNC80L4g0L7QsdC90L7QstC40YLRjC5cbiAgICovXG4gIHByb3RlY3RlZCB1cGRhdGVUcmFuc01hdHJpeCgkdGhpczogU1Bsb3QpOiB2b2lkIHtcblxuICAgIGNvbnN0IHQxID0gJHRoaXMuY2FtZXJhLnpvb20gKiAkdGhpcy5VU0VGVUxfQ09OU1RTWzVdXG4gICAgY29uc3QgdDIgPSAkdGhpcy5jYW1lcmEuem9vbSAqICR0aGlzLlVTRUZVTF9DT05TVFNbNl1cblxuICAgICR0aGlzLnRyYW5zb3JtYXRpb24ubWF0cml4ID0gW1xuICAgICAgdDEsIDAsIDAsIDAsIC10MiwgMCwgLSR0aGlzLmNhbWVyYS54ICogdDEgLSAxLCAkdGhpcy5jYW1lcmEueSAqIHQyICsgMSwgMVxuICAgIF1cbiAgfVxuXG4gIC8qKlxuICAgKiDQoNC10LDQs9C40YDRg9C10YIg0L3QsCDQtNCy0LjQttC10L3QuNC1INC80YvRiNC4L9GC0YDQtdC60L/QsNC00LAg0LIg0LzQvtC80LXQvdGCLCDQutC+0LPQtNCwINC10LUv0LXQs9C+INC60LvQsNCy0LjRiNCwINGD0LTQtdGA0LbQuNCy0LDQtdGC0YHRjyDQvdCw0LbQsNGC0L7QuS5cbiAgICpcbiAgICogQHJlbWVya3NcbiAgICog0JzQtdGC0L7QtCDQv9C10YDQtdC80LXRidCw0LXRgiDQvtCx0LvQsNGB0YLRjCDQstC40LTQuNC80L7RgdGC0Lgg0L3QsCDQv9C70L7RgdC60L7RgdGC0Lgg0LLQvNC10YHRgtC1INGBINC00LLQuNC20LXQvdC40LXQvCDQvNGL0YjQuC/RgtGA0LXQutC/0LDQtNCwLiDQktGL0YfQuNGB0LvQtdC90LjRjyDQstC90YPRgtGA0Lgg0YHQvtCx0YvRgtC40Y8g0YHQtNC10LvQsNC90YtcbiAgICog0LzQsNC60YHQuNC80LDQu9GM0L3QviDQv9GA0L7QuNC30LLQvtC00LjRgtC10LvRjNC90YvQvNC4INCyINGD0YnQtdGA0LEg0YfQuNGC0LDQsdC10LvRjNC90L7RgdGC0Lgg0LvQvtCz0LjQutC4INC00LXQudGB0YLQstC40LkuINCS0L4g0LLQvdC10YjQvdC10Lwg0L7QsdGA0LDQsdC+0YLRh9C40LrQtSDRgdC+0LHRi9GC0LjQuSDQvtCx0YrQtdC60YIgdGhpc1xuICAgKiDQvdC10LTQvtGB0YLRg9C/0LXQvSDQv9C+0Y3RgtC+0LzRgyDQtNC+0YHRgtGD0L8g0Log0Y3QutC30LXQvNC/0LvRj9GA0YMg0LrQu9Cw0YHRgdCwINGA0LXQsNC70LjQt9GD0LXRgtGB0Y8g0YfQtdGA0LXQtyDRgdGC0LDRgtC40YfQtdGB0LrQuNC5INC80LDRgdGB0LjQsiDQstGB0LXRhSDRgdC+0LfQtNCw0L3QvdGL0YUg0Y3QutC30LXQvNC/0LvRj9GA0L7QslxuICAgKiDQutC70LDRgdGB0LAg0Lgg0LjQtNC10L3RgtC40YTQuNC60LDRgtC+0YDQsCDQutCw0L3QstCw0YHQsCwg0LLRi9GB0YLRg9C/0LDRjtGJ0LXQs9C+INC40L3QtNC10LrRgdC+0Lwg0LIg0Y3RgtC+0Lwg0LzQsNGB0YHQuNCy0LUuXG4gICAqXG4gICAqIEBwYXJhbSBldmVudCAtINCh0L7QsdGL0YLQuNC1INC80YvRiNC4L9GC0YDQtdC60L/QsNC00LAuXG4gICAqL1xuICBwcm90ZWN0ZWQgaGFuZGxlTW91c2VNb3ZlKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG5cbiAgICAvLyDQn9C+0LvRg9GH0LXQvdC40LUg0LTQvtGB0YLRg9C/0LAg0Log0L7QsdGK0LXQutGC0YMgdGhpcy5cbiAgICBjb25zdCAkdGhpcyA9IFNQbG90Lmluc3RhbmNlc1sgKGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudCkuaWQgXVxuXG4gICAgJHRoaXMuY2FtZXJhLnggPSAkdGhpcy50cmFuc29ybWF0aW9uLnN0YXJ0Q2FtZXJhWCArICR0aGlzLnRyYW5zb3JtYXRpb24uc3RhcnRQb3NYIC1cbiAgICAgICgoZXZlbnQuY2xpZW50WCAtICR0aGlzLlVTRUZVTF9DT05TVFNbOV0pICogJHRoaXMuVVNFRlVMX0NPTlNUU1s3XSAtIDEpICogJHRoaXMudHJhbnNvcm1hdGlvbi5zdGFydEludk1hdHJpeFswXSAtXG4gICAgICAkdGhpcy50cmFuc29ybWF0aW9uLnN0YXJ0SW52TWF0cml4WzZdXG5cbiAgICAkdGhpcy5jYW1lcmEueSA9ICR0aGlzLnRyYW5zb3JtYXRpb24uc3RhcnRDYW1lcmFZICsgJHRoaXMudHJhbnNvcm1hdGlvbi5zdGFydFBvc1kgLVxuICAgICAgKChldmVudC5jbGllbnRZIC0gJHRoaXMuVVNFRlVMX0NPTlNUU1sxMF0pICogJHRoaXMuVVNFRlVMX0NPTlNUU1s4XSArIDEpICogJHRoaXMudHJhbnNvcm1hdGlvbi5zdGFydEludk1hdHJpeFs0XSAtXG4gICAgICAkdGhpcy50cmFuc29ybWF0aW9uLnN0YXJ0SW52TWF0cml4WzddXG5cbiAgICAvLyDQoNC10L3QtNC10YDQuNC90LMg0YEg0L7QsdC90L7QstC70LXQvdC90YvQvNC4INC/0LDRgNCw0LzQtdGC0YDQsNC80Lgg0YLRgNCw0L3RgdGE0L7RgNC80LDRhtC40LguXG4gICAgJHRoaXMucmVuZGVyKClcbiAgfVxuXG4gIC8qKlxuICAgKiDQoNC10LDQs9C40YDRg9C10YIg0L3QsCDQvdCw0LbQsNGC0LjQtSDQutC70LDQstC40YjQuCDQvNGL0YjQuC/RgtGA0LXQutC/0LDQtNCwLlxuICAgKlxuICAgKiBAcmVtZXJrc1xuICAgKiDQkiDQvNC+0LzQtdC90YIg0L3QsNC20LDRgtC40Y8g0Lgg0YPQtNC10YDQttCw0L3QuNGPINC60LvQsNCy0LjRiNC4INC30LDQv9GD0YHQutCw0LXRgtGB0Y8g0LDQvdCw0LvQuNC3INC00LLQuNC20LXQvdC40Y8g0LzRi9GI0Lgv0YLRgNC10LrQv9Cw0LTQsCAo0YEg0LfQsNC20LDRgtC+0Lkg0LrQu9Cw0LLQuNGI0LXQuSkuINCS0YvRh9C40YHQu9C10L3QuNGPXG4gICAqINCy0L3Rg9GC0YDQuCDRgdC+0LHRi9GC0LjRjyDRgdC00LXQu9Cw0L3RiyDQvNCw0LrRgdC40LzQsNC70YzQvdC+INC/0YDQvtC40LfQstC+0LTQuNGC0LXQu9GM0L3Ri9C80Lgg0LIg0YPRidC10YDQsSDRh9C40YLQsNCx0LXQu9GM0L3QvtGB0YLQuCDQu9C+0LPQuNC60Lgg0LTQtdC50YHRgtCy0LjQuS4g0JLQviDQstC90LXRiNC90LXQvCDQvtCx0YDQsNCx0L7RgtGH0LjQutC1XG4gICAqINGB0L7QsdGL0YLQuNC5INC+0LHRitC10LrRgiB0aGlzINC90LXQtNC+0YHRgtGD0L/QtdC9INC/0L7RjdGC0L7QvNGDINC00L7RgdGC0YPQvyDQuiDRjdC60LfQtdC80L/Qu9GP0YDRgyDQutC70LDRgdGB0LAg0YDQtdCw0LvQuNC30YPQtdGC0YHRjyDRh9C10YDQtdC3INGB0YLQsNGC0LjRh9C10YHQutC40Lkg0LzQsNGB0YHQuNCyINCy0YHQtdGFXG4gICAqINGB0L7Qt9C00LDQvdC90YvRhSDRjdC60LfQtdC80L/Qu9GP0YDQvtCyINC60LvQsNGB0YHQsCDQuCDQuNC00LXQvdGC0LjRhNC40LrQsNGC0L7RgNCwINC60LDQvdCy0LDRgdCwLCDQstGL0YHRgtGD0L/QsNGO0YnQtdCz0L4g0LjQvdC00LXQutGB0L7QvCDQsiDRjdGC0L7QvCDQvNCw0YHRgdC40LLQtS5cbiAgICpcbiAgICogQHBhcmFtIGV2ZW50IC0g0KHQvtCx0YvRgtC40LUg0LzRi9GI0Lgv0YLRgNC10LrQv9Cw0LTQsC5cbiAgICovXG4gIHByb3RlY3RlZCBoYW5kbGVNb3VzZURvd24oZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcblxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcblxuICAgIC8vINCf0L7Qu9GD0YfQtdC90LjQtSDQtNC+0YHRgtGD0L/QsCDQuiDQvtCx0YrQtdC60YLRgyB0aGlzLlxuICAgIGNvbnN0ICR0aGlzID0gU1Bsb3QuaW5zdGFuY2VzWyhldmVudC50YXJnZXQgYXMgSFRNTEVsZW1lbnQpLmlkXVxuXG4gICAgLy8g0KHRgNCw0LfRgyDQv9C+0YHQu9C1INC90LDRh9Cw0LvQsCDRg9C00LXRgNC20LDQvdC40Y8g0LrQu9Cw0LLQuNGI0Lgg0LfQsNC/0YPRgdC60LXRgtGB0Y8gXCLQv9GA0L7RgdC70YPRiNC60LBcIiDRgdC+0LHRi9GC0LjQuSDQtNCy0LjQttC10L3QuNGPINC4INC+0YLQttCw0YLQuNGPINC60LvQsNCy0LjRiNC4LlxuICAgIGV2ZW50LnRhcmdldCEuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgJHRoaXMuaGFuZGxlTW91c2VNb3ZlIGFzIEV2ZW50TGlzdGVuZXIpXG4gICAgZXZlbnQudGFyZ2V0IS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgJHRoaXMuaGFuZGxlTW91c2VVcCBhcyBFdmVudExpc3RlbmVyKVxuXG4gICAgJHRoaXMudHJhbnNvcm1hdGlvbi5zdGFydEludk1hdHJpeCA9IFtcbiAgICAgIDEgLyAkdGhpcy50cmFuc29ybWF0aW9uLm1hdHJpeFswXSwgMCwgMCwgMCwgMSAvICR0aGlzLnRyYW5zb3JtYXRpb24ubWF0cml4WzRdLFxuICAgICAgMCwgLSR0aGlzLnRyYW5zb3JtYXRpb24ubWF0cml4WzZdIC8gJHRoaXMudHJhbnNvcm1hdGlvbi5tYXRyaXhbMF0sXG4gICAgICAtJHRoaXMudHJhbnNvcm1hdGlvbi5tYXRyaXhbN10gLyAkdGhpcy50cmFuc29ybWF0aW9uLm1hdHJpeFs0XSwgMVxuICAgIF07XG5cbiAgICAkdGhpcy50cmFuc29ybWF0aW9uLnN0YXJ0Q2FtZXJhWCA9ICR0aGlzLmNhbWVyYS54XG4gICAgJHRoaXMudHJhbnNvcm1hdGlvbi5zdGFydENhbWVyYVkgPSAkdGhpcy5jYW1lcmEueVxuXG4gICAgJHRoaXMudHJhbnNvcm1hdGlvbi5zdGFydFBvc1ggPVxuICAgICAgKChldmVudC5jbGllbnRYIC0gJHRoaXMuVVNFRlVMX0NPTlNUU1s5XSkgKiAkdGhpcy5VU0VGVUxfQ09OU1RTWzddIC0gMSkgKlxuICAgICAgJHRoaXMudHJhbnNvcm1hdGlvbi5zdGFydEludk1hdHJpeFswXSArICR0aGlzLnRyYW5zb3JtYXRpb24uc3RhcnRJbnZNYXRyaXhbNl1cblxuICAgICR0aGlzLnRyYW5zb3JtYXRpb24uc3RhcnRQb3NZID1cbiAgICAgICgoZXZlbnQuY2xpZW50WSAtICR0aGlzLlVTRUZVTF9DT05TVFNbMTBdKSAqICR0aGlzLlVTRUZVTF9DT05TVFNbOF0gKyAxKSAqXG4gICAgICAkdGhpcy50cmFuc29ybWF0aW9uLnN0YXJ0SW52TWF0cml4WzRdICsgJHRoaXMudHJhbnNvcm1hdGlvbi5zdGFydEludk1hdHJpeFs3XVxuICB9XG5cbiAgLyoqXG4gICAqINCg0LXQsNCz0LjRgNGD0LXRgiDQvdCwINC+0YLQttCw0YLQuNC1INC60LvQsNCy0LjRiNC4INC80YvRiNC4L9GC0YDQtdC60L/QsNC00LAuXG4gICAqXG4gICAqIEByZW1lcmtzXG4gICAqINCSINC80L7QvNC10L3RgiDQvtGC0LbQsNGC0LjRjyDQutC70LDQstC40YjQuCDQsNC90LDQu9C40Lcg0LTQstC40LbQtdC90LjRjyDQvNGL0YjQuC/RgtGA0LXQutC/0LDQtNCwINGBINC30LDQttCw0YLQvtC5INC60LvQsNCy0LjRiNC10Lkg0L/RgNC10LrRgNCw0YnQsNC10YLRgdGPLiDQktGL0YfQuNGB0LvQtdC90LjRjyDQstC90YPRgtGA0Lgg0YHQvtCx0YvRgtC40Y9cbiAgICog0YHQtNC10LvQsNC90Ysg0LzQsNC60YHQuNC80LDQu9GM0L3QviDQv9GA0L7QuNC30LLQvtC00LjRgtC10LvRjNC90YvQvNC4INCyINGD0YnQtdGA0LEg0YfQuNGC0LDQsdC10LvRjNC90L7RgdGC0Lgg0LvQvtCz0LjQutC4INC00LXQudGB0YLQstC40LkuINCS0L4g0LLQvdC10YjQvdC10Lwg0L7QsdGA0LDQsdC+0YLRh9C40LrQtSDRgdC+0LHRi9GC0LjQuSDQvtCx0YrQtdC60YJcbiAgICogdGhpcyDQvdC10LTQvtGB0YLRg9C/0LXQvSDQv9C+0Y3RgtC+0LzRgyDQtNC+0YHRgtGD0L8g0Log0Y3QutC30LXQvNC/0LvRj9GA0YMg0LrQu9Cw0YHRgdCwINGA0LXQsNC70LjQt9GD0LXRgtGB0Y8g0YfQtdGA0LXQtyDRgdGC0LDRgtC40YfQtdGB0LrQuNC5INC80LDRgdGB0LjQsiDQstGB0LXRhSDRgdC+0LfQtNCw0L3QvdGL0YUg0Y3QutC30LXQvNC/0LvRj9GA0L7QslxuICAgKiDQutC70LDRgdGB0LAg0Lgg0LjQtNC10L3RgtC40YTQuNC60LDRgtC+0YDQsCDQutCw0L3QstCw0YHQsCwg0LLRi9GB0YLRg9C/0LDRjtGJ0LXQs9C+INC40L3QtNC10LrRgdC+0Lwg0LIg0Y3RgtC+0Lwg0LzQsNGB0YHQuNCy0LUuXG4gICAqXG4gICAqIEBwYXJhbSBldmVudCAtINCh0L7QsdGL0YLQuNC1INC80YvRiNC4L9GC0YDQtdC60L/QsNC00LAuXG4gICAqL1xuICBwcm90ZWN0ZWQgaGFuZGxlTW91c2VVcChldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuXG4gICAgLy8g0J/QvtC70YPRh9C10L3QuNC1INC00L7RgdGC0YPQv9CwINC6INC+0LHRitC10LrRgtGDIHRoaXMuXG4gICAgY29uc3QgJHRoaXMgPSBTUGxvdC5pbnN0YW5jZXNbKGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudCkuaWRdXG5cbiAgICAvLyDQodGA0LDQt9GDINC/0L7RgdC70LUg0L7RgtC20LDRgtC40Y8g0LrQu9Cw0LLQuNGI0LggXCLQv9GA0L7RgdC70YPRiNC60LBcIiDRgdC+0LHRi9GC0LjQuSDQtNCy0LjQttC10L3QuNGPINC4INC+0YLQttCw0YLQuNGPINC60LvQsNCy0LjRiNC4INC/0YDQtdC60YDQsNGJ0LDRjtGC0YHRjy5cbiAgICBldmVudC50YXJnZXQhLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsICR0aGlzLmhhbmRsZU1vdXNlTW92ZSBhcyBFdmVudExpc3RlbmVyKVxuICAgIGV2ZW50LnRhcmdldCEucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsICR0aGlzLmhhbmRsZU1vdXNlVXAgYXMgRXZlbnRMaXN0ZW5lcilcbiAgfVxuXG4gIC8qKlxuICAgKiDQoNC10LDQs9C40YDRg9C10YIg0L3QsCDQt9GD0LzQuNGA0L7QstCw0L3QuNC1INC80YvRiNC4L9GC0YDQtdC60L/QsNC00LAuXG4gICAqXG4gICAqIEByZW1lcmtzXG4gICAqINCSINC80L7QvNC10L3RgiDQt9GD0LzQuNGA0L7QstCw0L3QuNGPINC80YvRiNC4L9GC0YDQtdC60L/QsNC00LAg0L/RgNC+0LjRgdGF0L7QtNC40YIg0LfRg9C80LjRgNC+0LLQsNC90LjQtSDQutC+0L7RgNC00LjQvdCw0YLQvdC+0Lkg0L/Qu9C+0YHQutC+0YHRgtC4LiDQktGL0YfQuNGB0LvQtdC90LjRjyDQstC90YPRgtGA0Lgg0YHQvtCx0YvRgtC40Y9cbiAgICog0YHQtNC10LvQsNC90Ysg0LzQsNC60YHQuNC80LDQu9GM0L3QviDQv9GA0L7QuNC30LLQvtC00LjRgtC10LvRjNC90YvQvNC4INCyINGD0YnQtdGA0LEg0YfQuNGC0LDQsdC10LvRjNC90L7RgdGC0Lgg0LvQvtCz0LjQutC4INC00LXQudGB0YLQstC40LkuINCS0L4g0LLQvdC10YjQvdC10Lwg0L7QsdGA0LDQsdC+0YLRh9C40LrQtSDRgdC+0LHRi9GC0LjQuSDQvtCx0YrQtdC60YJcbiAgICogdGhpcyDQvdC10LTQvtGB0YLRg9C/0LXQvSDQv9C+0Y3RgtC+0LzRgyDQtNC+0YHRgtGD0L8g0Log0Y3QutC30LXQvNC/0LvRj9GA0YMg0LrQu9Cw0YHRgdCwINGA0LXQsNC70LjQt9GD0LXRgtGB0Y8g0YfQtdGA0LXQtyDRgdGC0LDRgtC40YfQtdGB0LrQuNC5INC80LDRgdGB0LjQsiDQstGB0LXRhSDRgdC+0LfQtNCw0L3QvdGL0YUg0Y3QutC30LXQvNC/0LvRj9GA0L7QslxuICAgKiDQutC70LDRgdGB0LAg0Lgg0LjQtNC10L3RgtC40YTQuNC60LDRgtC+0YDQsCDQutCw0L3QstCw0YHQsCwg0LLRi9GB0YLRg9C/0LDRjtGJ0LXQs9C+INC40L3QtNC10LrRgdC+0Lwg0LIg0Y3RgtC+0Lwg0LzQsNGB0YHQuNCy0LUuXG4gICAqXG4gICAqIEBwYXJhbSBldmVudCAtINCh0L7QsdGL0YLQuNC1INC80YvRiNC4L9GC0YDQtdC60L/QsNC00LAuXG4gICAqL1xuICBwcm90ZWN0ZWQgaGFuZGxlTW91c2VXaGVlbChldmVudDogV2hlZWxFdmVudCk6IHZvaWQge1xuXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuXG4gICAgLy8g0J/QvtC70YPRh9C10L3QuNC1INC00L7RgdGC0YPQv9CwINC6INC+0LHRitC10LrRgtGDIHRoaXMuXG4gICAgY29uc3QgJHRoaXMgPSBTUGxvdC5pbnN0YW5jZXNbKGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudCkuaWRdXG5cbiAgICBjb25zdCBjbGlwWCA9IChldmVudC5jbGllbnRYIC0gJHRoaXMuVVNFRlVMX0NPTlNUU1s5XSkgKiAkdGhpcy5VU0VGVUxfQ09OU1RTWzddIC0gMVxuICAgIGNvbnN0IGNsaXBZID0gKGV2ZW50LmNsaWVudFkgLSAkdGhpcy5VU0VGVUxfQ09OU1RTWzEwXSkgKiAkdGhpcy5VU0VGVUxfQ09OU1RTWzhdICsgMVxuXG4gICAgY29uc3QgcHJlWm9vbVggPSAoY2xpcFggLSAkdGhpcy50cmFuc29ybWF0aW9uLm1hdHJpeFs2XSkgLyAkdGhpcy50cmFuc29ybWF0aW9uLm1hdHJpeFswXVxuICAgIGNvbnN0IHByZVpvb21ZID0gKGNsaXBZIC0gJHRoaXMudHJhbnNvcm1hdGlvbi5tYXRyaXhbN10pIC8gJHRoaXMudHJhbnNvcm1hdGlvbi5tYXRyaXhbNF1cblxuICAgIGNvbnN0IG5ld1pvb20gPSAkdGhpcy5jYW1lcmEuem9vbSAqIE1hdGgucG93KDIsIGV2ZW50LmRlbHRhWSAqIC0wLjAxKVxuICAgICR0aGlzLmNhbWVyYS56b29tID0gTWF0aC5tYXgoMC4wMDIsIE1hdGgubWluKDIwMCwgbmV3Wm9vbSkpXG5cbiAgICAkdGhpcy51cGRhdGVUcmFuc01hdHJpeCgkdGhpcylcblxuICAgIGNvbnN0IHBvc3Rab29tWCA9IChjbGlwWCAtICR0aGlzLnRyYW5zb3JtYXRpb24ubWF0cml4WzZdKSAvICR0aGlzLnRyYW5zb3JtYXRpb24ubWF0cml4WzBdXG4gICAgY29uc3QgcG9zdFpvb21ZID0gKGNsaXBZIC0gJHRoaXMudHJhbnNvcm1hdGlvbi5tYXRyaXhbN10pIC8gJHRoaXMudHJhbnNvcm1hdGlvbi5tYXRyaXhbNF1cblxuICAgICR0aGlzLmNhbWVyYS54ICs9IChwcmVab29tWCAtIHBvc3Rab29tWClcbiAgICAkdGhpcy5jYW1lcmEueSArPSAocHJlWm9vbVkgLSBwb3N0Wm9vbVkpXG5cbiAgICAvLyDQoNC10L3QtNC10YDQuNC90LMg0YEg0L7QsdC90L7QstC70LXQvdC90YvQvNC4INC/0LDRgNCw0LzQtdGC0YDQsNC80Lgg0YLRgNCw0L3RgdGE0L7RgNC80LDRhtC40LguXG4gICAgJHRoaXMucmVuZGVyKClcbiAgfVxuXG4gIC8qKlxuICAgKiDQn9GA0L7QuNC30LLQvtC00LjRgiDRgNC10L3QtNC10YDQuNC90LMg0LPRgNCw0YTQuNC60LAg0LIg0YHQvtC+0YLQstC10YLRgdGC0LLQuNC4INGBINGC0LXQutGD0YnQuNC80Lgg0L/QsNGA0LDQvNC10YLRgNCw0LzQuCDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuC5cbiAgICovXG4gIHByb3RlY3RlZCByZW5kZXIoKTogdm9pZCB7XG5cbiAgICAvLyDQntGH0LjRgdGC0LrQsCDQvtCx0YrQtdC60YLQsCDRgNC10L3QtNC10YDQuNC90LPQsCBXZWJHTC5cbiAgICB0aGlzLmdsLmNsZWFyKHRoaXMuZ2wuQ09MT1JfQlVGRkVSX0JJVClcblxuICAgIC8vINCe0LHQvdC+0LLQu9C10L3QuNC1INC80LDRgtGA0LjRhtGLINGC0YDQsNC90YHRhNC+0YDQvNCw0YbQuNC4LlxuICAgIHRoaXMudXBkYXRlVHJhbnNNYXRyaXgodGhpcylcblxuICAgIC8vINCf0YDQuNCy0Y/Qt9C60LAg0LzQsNGC0YDQuNGG0Ysg0YLRgNCw0L3RgdGE0L7RgNC80LDRhtC40Lgg0Log0L/QtdGA0LXQvNC10L3QvdC+0Lkg0YjQtdC50LTQtdGA0LAuXG4gICAgdGhpcy5nbC51bmlmb3JtTWF0cml4M2Z2KHRoaXMudmFyaWFibGVzWyd1X21hdHJpeCddLCBmYWxzZSwgdGhpcy50cmFuc29ybWF0aW9uLm1hdHJpeClcblxuICAgIC8vINCY0YLQtdGA0LjRgNC+0LLQsNC90LjQtSDQuCDRgNC10L3QtNC10YDQuNC90LMg0LPRgNGD0L/QvyDQsdGD0YTQtdGA0L7QsiBXZWJHTC5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYnVmZmVycy5hbW91bnRPZkJ1ZmZlckdyb3VwczsgaSsrKSB7XG5cbiAgICAgIC8vINCj0YHRgtCw0L3QvtCy0LrQsCDRgtC10LrRg9GJ0LXQs9C+INCx0YPRhNC10YDQsCDQstC10YDRiNC40L0g0Lgg0LXQs9C+INC/0YDQuNCy0Y/Qt9C60LAg0Log0L/QtdGA0LXQvNC10L3QvdC+0Lkg0YjQtdC50LTQtdGA0LAuXG4gICAgICB0aGlzLmdsLmJpbmRCdWZmZXIodGhpcy5nbC5BUlJBWV9CVUZGRVIsIHRoaXMuYnVmZmVycy52ZXJ0ZXhCdWZmZXJzW2ldKVxuICAgICAgdGhpcy5nbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheSh0aGlzLnZhcmlhYmxlc1snYV9wb3NpdGlvbiddKVxuICAgICAgdGhpcy5nbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKHRoaXMudmFyaWFibGVzWydhX3Bvc2l0aW9uJ10sIDIsIHRoaXMuZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKVxuXG4gICAgICAvLyDQo9GB0YLQsNC90L7QstC60LAg0YLQtdC60YPRidC10LPQviDQsdGD0YTQtdGA0LAg0YbQstC10YLQvtCyINCy0LXRgNGI0LjQvSDQuCDQtdCz0L4g0L/RgNC40LLRj9C30LrQsCDQuiDQv9C10YDQtdC80LXQvdC90L7QuSDRiNC10LnQtNC10YDQsC5cbiAgICAgIHRoaXMuZ2wuYmluZEJ1ZmZlcih0aGlzLmdsLkFSUkFZX0JVRkZFUiwgdGhpcy5idWZmZXJzLmNvbG9yQnVmZmVyc1tpXSlcbiAgICAgIHRoaXMuZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkodGhpcy52YXJpYWJsZXNbJ2FfY29sb3InXSlcbiAgICAgIHRoaXMuZ2wudmVydGV4QXR0cmliUG9pbnRlcih0aGlzLnZhcmlhYmxlc1snYV9jb2xvciddLCAxLCB0aGlzLmdsLlVOU0lHTkVEX0JZVEUsIGZhbHNlLCAwLCAwKVxuXG4gICAgICAvLyDQo9GB0YLQsNC90L7QstC60LAg0YLQtdC60YPRidC10LPQviDQsdGD0YTQtdGA0LAg0LjQvdC00LXQutGB0L7QsiDQstC10YDRiNC40L0uXG4gICAgICB0aGlzLmdsLmJpbmRCdWZmZXIodGhpcy5nbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgdGhpcy5idWZmZXJzLmluZGV4QnVmZmVyc1tpXSlcblxuICAgICAgLy8g0KDQtdC90LTQtdGA0LjQvdCzINGC0LXQutGD0YnQtdC5INCz0YDRg9C/0L/RiyDQsdGD0YTQtdGA0L7Qsi5cbiAgICAgIHRoaXMuZ2wuZHJhd0VsZW1lbnRzKHRoaXMuZ2wuVFJJQU5HTEVTLCB0aGlzLmJ1ZmZlcnMuYW1vdW50T2ZHTFZlcnRpY2VzW2ldLFxuICAgICAgICB0aGlzLmdsLlVOU0lHTkVEX1NIT1JULCAwKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDQodC70YPRh9Cw0LnQvdGL0Lwg0L7QsdGA0LDQt9C+0Lwg0LLQvtC30LLRgNCw0YnQsNC10YIg0L7QtNC40L0g0LjQtyDQuNC90LTQtdC60YHQvtCyINGH0LjRgdC70L7QstC+0LPQviDQvtC00L3QvtC80LXRgNC90L7Qs9C+INC80LDRgdGB0LjQstCwLiDQndC10YHQvNC+0YLRgNGPINC90LAg0YHQu9GD0YfQsNC50L3QvtGB0YLRjCDQutCw0LbQtNC+0LPQvlxuICAgKiDQutC+0L3QutGA0LXRgtC90L7Qs9C+INCy0YvQt9C+0LLQsCDRhNGD0L3QutGG0LjQuCwg0LjQvdC00LXQutGB0Ysg0LLQvtC30LLRgNCw0YnQsNGO0YLRgdGPINGBINC/0YDQtdC00L7Qv9GA0LXQtNC10LvQtdC90L3QvtC5INGH0LDRgdGC0L7RgtC+0LkuINCn0LDRgdGC0L7RgtCwIFwi0LLRi9C/0LDQtNCw0L3QuNC5XCIg0LjQvdC00LXQutGB0L7QsiDQt9Cw0LTQsNC10YLRgdGPXG4gICAqINGB0L7QvtGC0LLQtdGC0YHRgtCy0YPRjtGJ0LjQvNC4INC30L3QsNGH0LXQvdC40Y/QvNC4INGN0LvQtdC80LXQvdGC0L7Qsi5cbiAgICpcbiAgICogQHJlbWFya3NcbiAgICog0J/RgNC40LzQtdGAOiDQndCwINC80LDRgdGB0LjQstC1IFszLCAyLCA1XSDRhNGD0L3QutGG0LjRjyDQsdGD0LTQtdGCINCy0L7Qt9Cy0YDQsNGJ0LDRgtGMINC40L3QtNC10LrRgSAwINGBINGH0LDRgdGC0L7RgtC+0LkgPSAzLygzKzIrNSkgPSAzLzEwLCDQuNC90LTQtdC60YEgMSDRgSDRh9Cw0YHRgtC+0YLQvtC5ID1cbiAgICogMi8oMysyKzUpID0gMi8xMCwg0LjQvdC00LXQutGBIDIg0YEg0YfQsNGB0YLQvtGC0L7QuSA9IDUvKDMrMis1KSA9IDUvMTAuXG4gICAqXG4gICAqIEBwYXJhbSBhcnIgLSDQp9C40YHQu9C+0LLQvtC5INC+0LTQvdC+0LzQtdGA0L3Ri9C5INC80LDRgdGB0LjQsiwg0LjQvdC00LXQutGB0Ysg0LrQvtGC0L7RgNC+0LPQviDQsdGD0LTRg9GCINCy0L7Qt9Cy0YDQsNGJ0LDRgtGM0YHRjyDRgSDQv9GA0LXQtNC+0L/RgNC10LTQtdC70LXQvdC90L7QuSDRh9Cw0YHRgtC+0YLQvtC5LlxuICAgKiBAcmV0dXJucyDQodC70YPRh9Cw0LnQvdGL0Lkg0LjQvdC00LXQutGBINC40Lcg0LzQsNGB0YHQuNCy0LAgYXJyLlxuICAgKi9cbiAgcHJvdGVjdGVkIHJhbmRvbVF1b3RhSW5kZXgoYXJyOiBudW1iZXJbXSk6IG51bWJlciB7XG5cbiAgICBsZXQgYTogbnVtYmVyW10gPSBbXVxuICAgIGFbMF0gPSBhcnJbMF1cblxuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICBhW2ldID0gYVtpIC0gMV0gKyBhcnJbaV1cbiAgICB9XG5cbiAgICBjb25zdCBsYXN0SW5kZXg6IG51bWJlciA9IGEubGVuZ3RoIC0gMVxuXG4gICAgbGV0IHI6IG51bWJlciA9IE1hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkgKiBhW2xhc3RJbmRleF0pKSArIDFcbiAgICBsZXQgbDogbnVtYmVyID0gMFxuICAgIGxldCBoOiBudW1iZXIgPSBsYXN0SW5kZXhcblxuICAgIHdoaWxlIChsIDwgaCkge1xuICAgICAgY29uc3QgbTogbnVtYmVyID0gbCArICgoaCAtIGwpID4+IDEpO1xuICAgICAgKHIgPiBhW21dKSA/IChsID0gbSArIDEpIDogKGggPSBtKVxuICAgIH1cblxuICAgIHJldHVybiAoYVtsXSA+PSByKSA/IGwgOiAtMVxuICB9XG5cbiAgLyoqXG4gICAqINCc0LXRgtC+0LQg0LjQvNC40YLQsNGG0LjQuCDQuNGC0LXRgNC40YDQvtCy0LDQvdC40Y8g0LjRgdGF0L7QtNC90YvRhSDQvtCx0YrQtdC60YLQvtCyLiDQn9GA0Lgg0LrQsNC20LTQvtC8INC90L7QstC+0Lwg0LLRi9C30L7QstC1INCy0L7Qt9Cy0YDQsNGJ0LDQtdGCINC40L3RhNC+0YDQvNCw0YbQuNGOINC+INC/0L7Qu9C40LPQvtC90LUg0YHQviDRgdC70YPRh9Cw0L3Ri9C8XG4gICAqINC/0L7Qu9C+0LbQtdC90LjQtdC8LCDRgdC70YPRh9Cw0LnQvdC+0Lkg0YTQvtGA0LzQvtC5INC4INGB0LvRg9GH0LDQudC90YvQvCDRhtCy0LXRgtC+0LwuXG4gICAqXG4gICAqIEByZXR1cm5zINCY0L3RhNC+0YDQvNCw0YbQuNGPINC+INC/0L7Qu9C40LPQvtC90LUg0LjQu9C4IG51bGwsINC10YHQu9C4INC/0LXRgNC10LHQvtGAINC40YHRhdC+0LTQvdGL0YUg0L7QsdGK0LXQutGC0L7QsiDQt9Cw0LrQvtC90YfQuNC70YHRjy5cbiAgICovXG4gIHByb3RlY3RlZCBkZW1vSXRlcmF0aW9uQ2FsbGJhY2soKTogU1Bsb3RQb2x5Z29uIHwgbnVsbCB7XG4gICAgaWYgKHRoaXMuZGVtb01vZGUuaW5kZXghIDwgdGhpcy5kZW1vTW9kZS5hbW91bnQhKSB7XG4gICAgICB0aGlzLmRlbW9Nb2RlLmluZGV4ISArKztcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHg6IHJhbmRvbUludCh0aGlzLmdyaWRTaXplLndpZHRoKSxcbiAgICAgICAgeTogcmFuZG9tSW50KHRoaXMuZ3JpZFNpemUuaGVpZ2h0KSxcbiAgICAgICAgc2hhcGU6IHRoaXMucmFuZG9tUXVvdGFJbmRleCh0aGlzLmRlbW9Nb2RlLnNoYXBlUXVvdGEhKSxcbiAgICAgICAgY29sb3I6IHJhbmRvbUludCh0aGlzLnBvbHlnb25QYWxldHRlLmxlbmd0aClcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZVxuICAgICAgcmV0dXJuIG51bGxcbiAgfVxuXG4gIC8qKlxuICAgKiDQl9Cw0L/Rg9GB0LrQsNC10YIg0YDQtdC90LTQtdGA0LjQvdCzINC4IFwi0L/RgNC+0YHQu9GD0YjQutGDXCIg0YHQvtCx0YvRgtC40Lkg0LzRi9GI0Lgv0YLRgNC10LrQv9Cw0LTQsCDQvdCwINC60LDQvdCy0LDRgdC1LlxuICAgKi9cbiAgcHVibGljIHJ1bigpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuaXNSdW5uaW5nKSB7XG5cbiAgICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMuaGFuZGxlTW91c2VEb3duKVxuICAgICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignd2hlZWwnLCB0aGlzLmhhbmRsZU1vdXNlV2hlZWwpXG5cbiAgICAgIHRoaXMucmVuZGVyKClcblxuICAgICAgdGhpcy5pc1J1bm5pbmcgPSB0cnVlXG4gICAgfVxuXG4gICAgLy8g0JLRi9Cy0L7QtCDQvtGC0LvQsNC00L7Rh9C90L7QuSDQuNC90YTQvtGA0LzQsNGG0LjQuC5cbiAgICBpZiAodGhpcy5kZWJ1Z01vZGUuaXNFbmFibGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKCclY9Cg0LXQvdC00LXRgNC40L3QsyDQt9Cw0L/Rg9GJ0LXQvScsIHRoaXMuZGVidWdNb2RlLmdyb3VwU3R5bGUpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqINCe0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdGCINGA0LXQvdC00LXRgNC40L3QsyDQuCBcItC/0YDQvtGB0LvRg9GI0LrRg1wiINGB0L7QsdGL0YLQuNC5INC80YvRiNC4L9GC0YDQtdC60L/QsNC00LAg0L3QsCDQutCw0L3QstCw0YHQtS5cbiAgICpcbiAgICogQHBhcmFtIGNsZWFyIC0g0J/RgNC40LfQvdCw0Log0L3QtdC+0L7QsdGF0L7QtNC40LzQvtGB0YLQuCDQstC80LXRgdGC0LUg0YEg0L7RgdGC0LDQvdC+0LLQutC+0Lkg0YDQtdC90LTQtdGA0LjQvdCz0LAg0L7Rh9C40YHRgtC40YLRjCDQutCw0L3QstCw0YEuINCX0L3QsNGH0LXQvdC40LUgdHJ1ZSDQvtGH0LjRidCw0LXRgiDQutCw0L3QstCw0YEsXG4gICAqINC30L3QsNGH0LXQvdC40LUgZmFsc2UgLSDQvtGB0YLQsNCy0LvRj9C10YIg0LXQs9C+INC90LXQvtGH0LjRidC10L3QvdGL0LwuINCf0L4g0YPQvNC+0LvRh9Cw0L3QuNGOINC+0YfQuNGB0YLQutCwINC90LUg0L/RgNC+0LjRgdGF0L7QtNC40YIuXG4gICAqL1xuICBwdWJsaWMgc3RvcChjbGVhcjogYm9vbGVhbiA9IGZhbHNlKTogdm9pZCB7XG5cbiAgICBpZiAodGhpcy5pc1J1bm5pbmcpIHtcblxuICAgICAgdGhpcy5jYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5oYW5kbGVNb3VzZURvd24pXG4gICAgICB0aGlzLmNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKCd3aGVlbCcsIHRoaXMuaGFuZGxlTW91c2VXaGVlbClcbiAgICAgIHRoaXMuY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMuaGFuZGxlTW91c2VNb3ZlKVxuICAgICAgdGhpcy5jYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuaGFuZGxlTW91c2VVcClcblxuICAgICAgaWYgKGNsZWFyKSB7XG4gICAgICAgIHRoaXMuY2xlYXIoKVxuICAgICAgfVxuXG4gICAgICB0aGlzLmlzUnVubmluZyA9IGZhbHNlXG4gICAgfVxuXG4gICAgLy8g0JLRi9Cy0L7QtCDQvtGC0LvQsNC00L7Rh9C90L7QuSDQuNC90YTQvtGA0LzQsNGG0LjQuC5cbiAgICBpZiAodGhpcy5kZWJ1Z01vZGUuaXNFbmFibGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKCclY9Cg0LXQvdC00LXRgNC40L3QsyDQvtGB0YLQsNC90L7QstC70LXQvScsIHRoaXMuZGVidWdNb2RlLmdyb3VwU3R5bGUpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqINCe0YfQuNGJ0LDQtdGCINC60LDQvdCy0LDRgSwg0LfQsNC60YDQsNGI0LjQstCw0Y8g0LXQs9C+INCyINGE0L7QvdC+0LLRi9C5INGG0LLQtdGCLlxuICAgKi9cbiAgcHVibGljIGNsZWFyKCk6IHZvaWQge1xuXG4gICAgdGhpcy5nbC5jbGVhcih0aGlzLmdsLkNPTE9SX0JVRkZFUl9CSVQpO1xuXG4gICAgLy8g0JLRi9Cy0L7QtCDQvtGC0LvQsNC00L7Rh9C90L7QuSDQuNC90YTQvtGA0LzQsNGG0LjQuC5cbiAgICBpZiAodGhpcy5kZWJ1Z01vZGUuaXNFbmFibGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKCclY9Ca0L7QvdGC0LXQutGB0YIg0YDQtdC90LTQtdGA0LjQvdCz0LAg0L7Rh9C40YnQtdC9IFsnICsgdGhpcy5iZ0NvbG9yICsgJ10nLCB0aGlzLmRlYnVnTW9kZS5ncm91cFN0eWxlKTtcbiAgICB9XG4gIH1cbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL2luZGV4LnRzXCIpO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==