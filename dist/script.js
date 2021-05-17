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

/***/ "./fragment-shader.ts":
/*!****************************!*\
  !*** ./fragment-shader.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.default = "\nprecision lowp float;\nvarying vec3 v_color;\nvoid main() {\n  float vSize = 20.0;\n  float distance = length(2.0 * gl_PointCoord - 1.0);\n  if (distance > 1.0) { discard; }\n  gl_FragColor = vec4(v_color.rgb, 1.0);\n}\n";
/**
export default
  `
precision lowp float;
varying vec3 v_color;
void main() {
  float vSize = 20.0;
  float distance = length(2.0 * gl_PointCoord - 1.0);
  if (distance > 1.0) { discard; }
  gl_FragColor = vec4(v_color.rgb, 1.0);

   vec4 uEdgeColor = vec4(0.5, 0.5, 0.5, 1.0);
 float uEdgeSize = 1.0;

float sEdge = smoothstep(
  vSize - uEdgeSize - 2.0,
  vSize - uEdgeSize,
  distance * (vSize + uEdgeSize)
);
gl_FragColor = (uEdgeColor * sEdge) + ((1.0 - sEdge) * gl_FragColor);

gl_FragColor.a = gl_FragColor.a * (1.0 - smoothstep(
    vSize - 2.0,
    vSize,
    distance * vSize
));

}
`
*/


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
            shape: 3,
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
//scatterPlot.stop()
//setTimeout(() => scatterPlot.stop(), 3000)


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
var utils_1 = __webpack_require__(/*! ./utils */ "./utils.ts");
var vertex_shader_1 = __importDefault(__webpack_require__(/*! ./vertex-shader */ "./vertex-shader.ts"));
var fragment_shader_1 = __importDefault(__webpack_require__(/*! ./fragment-shader */ "./fragment-shader.ts"));
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
        this.useVertexIndices = false;
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
         * Шаблон GLSL-кода для вершинного шейдера. Содержит специальную вставку "{ADDITIONAL-CODE}", которая перед
         * созданием шейдера заменяется на GLSL-код выбора цвета вершин.
         */
        this.vertexShaderCodeTemplate = vertex_shader_1.default;
        // Шаблон GLSL-кода для фрагментного шейдера.
        this.fragmentShaderCodeTemplate = fragment_shader_1.default;
        // Счетчик числа обработанных полигонов.
        this.amountOfPolygons = 0;
        /**
         *   Набор вспомогательных констант, используемых в часто повторяющихся вычислениях. Рассчитывается и задается в
         *   методе {@link setUsefulConstants}.
         */
        this.USEFUL_CONSTS = [];
        // Техническая информация, используемая приложением для расчета трансформаций.
        this.transform = {
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
        //  protected maxAmountOfVertexPerPolygonGroup: number = 32768 - (this.circleApproxLevel + 1);
        this.maxAmountOfVertexPerPolygonGroup = 10000;
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
        this.handleMouseDownWithContext = this.handleMouseDown.bind(this);
        this.handleMouseWheelWithContext = this.handleMouseWheel.bind(this);
        this.handleMouseMoveWithContext = this.handleMouseMove.bind(this);
        this.handleMouseUpWithContext = this.handleMouseUp.bind(this);
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
        this.registerShape(this.getVerticesOfPoint, 'Точка');
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
        // Инициализация вспомогательных констант.
        this.setUsefulConstants();
        // Установка цвета очистки рендеринга
        var _a = utils_1.colorFromHexToGlRgb(this.bgColor), r = _a[0], g = _a[1], b = _a[2];
        this.gl.clearColor(r, g, b, 0.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        /**
         * Подготовка кодов шейдеров. В код вершинного шейдера вставляется код выбора цвета вершин. Код фрагментного
         * шейдера используется без изменений.
         */
        var vertexShaderCode = this.vertexShaderCodeTemplate.replace('{ADDITIONAL-CODE}', this.genShaderColorCode());
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
            if (utils_1.isObject(options[option]) && utils_1.isObject(this[option])) {
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
            console.log('%cЗапущен процесс загрузки данных [' + utils_1.getCurrentTime() + ']...', this.debugMode.groupStyle);
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
    SPlot.prototype.getVerticesOfPoint = function (x, y, consts) {
        return {
            values: [x, y],
            indices: [0, 0, 0]
        };
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
            console.log('Пользовательские настройки:\n', utils_1.jsonStringify(options));
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
        console.group('%cЗагрузка данных завершена [' + utils_1.getCurrentTime() + ']', this.debugMode.groupStyle);
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
            var _a = utils_1.colorFromHexToGlRgb(this.polygonPalette[i]), r = _a[0], g = _a[1], b = _a[2];
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
     * =====================================================================================================================
     */
    SPlot.prototype.makeCameraMatrix = function () {
        var zoomScale = 1 / this.camera.zoom;
        var cameraMat = m3_1.default.identity();
        cameraMat = m3_1.default.translate(cameraMat, this.camera.x, this.camera.y);
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
     */
    SPlot.prototype.updateViewProjection = function () {
        var projectionMat = m3_1.default.projection(this.gl.canvas.width, this.gl.canvas.height);
        var cameraMat = this.makeCameraMatrix();
        var viewMat = m3_1.default.inverse(cameraMat);
        this.transform.viewProjectionMat = m3_1.default.multiply(projectionMat, viewMat);
    };
    /**
     *
     */
    SPlot.prototype.getClipSpaceMousePosition = function (event) {
        // get canvas relative css position
        var rect = this.canvas.getBoundingClientRect();
        var cssX = event.clientX - rect.left;
        var cssY = event.clientY - rect.top;
        // get normalized 0 to 1 position across and down canvas
        var normalizedX = cssX / this.canvas.clientWidth;
        var normalizedY = cssY / this.canvas.clientHeight;
        // convert to clip space
        var clipX = normalizedX * 2 - 1;
        var clipY = normalizedY * -2 + 1;
        return [clipX, clipY];
    };
    /**
     *
     */
    SPlot.prototype.moveCamera = function (event) {
        var pos = m3_1.default.transformPoint(this.transform.startInvViewProjMat, this.getClipSpaceMousePosition(event));
        this.camera.x =
            this.transform.startCamera.x + this.transform.startPos[0] - pos[0];
        this.camera.y =
            this.transform.startCamera.y + this.transform.startPos[1] - pos[1];
        this.render();
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
        this.moveCamera.call(this, event);
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
        this.render();
        event.target.removeEventListener('mousemove', this.handleMouseMoveWithContext);
        event.target.removeEventListener('mouseup', this.handleMouseUpWithContext);
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
        this.canvas.addEventListener('mousemove', this.handleMouseMoveWithContext);
        this.canvas.addEventListener('mouseup', this.handleMouseUpWithContext);
        this.transform.startInvViewProjMat = m3_1.default.inverse(this.transform.viewProjectionMat);
        this.transform.startCamera = Object.assign({}, this.camera);
        this.transform.startClipPos = this.getClipSpaceMousePosition.call(this, event);
        this.transform.startPos = m3_1.default.transformPoint(this.transform.startInvViewProjMat, this.transform.startClipPos);
        this.transform.startMousePos = [event.clientX, event.clientY];
        this.render();
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
        var _a = this.getClipSpaceMousePosition.call(this, event), clipX = _a[0], clipY = _a[1];
        // position before zooming
        var _b = m3_1.default.transformPoint(m3_1.default.inverse(this.transform.viewProjectionMat), [clipX, clipY]), preZoomX = _b[0], preZoomY = _b[1];
        // multiply the wheel movement by the current zoom level, so we zoom less when zoomed in and more when zoomed out
        var newZoom = this.camera.zoom * Math.pow(2, event.deltaY * -0.01);
        this.camera.zoom = Math.max(0.002, Math.min(200, newZoom));
        this.updateViewProjection.call(this);
        // position after zooming
        var _c = m3_1.default.transformPoint(m3_1.default.inverse(this.transform.viewProjectionMat), [clipX, clipY]), postZoomX = _c[0], postZoomY = _c[1];
        // camera needs to be moved the difference of before and after
        this.camera.x += preZoomX - postZoomX;
        this.camera.y += preZoomY - postZoomY;
        this.render();
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
        this.updateViewProjection();
        // Привязка матрицы трансформации к переменной шейдера.
        this.gl.uniformMatrix3fv(this.variables['u_matrix'], false, this.transform.viewProjectionMat);
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
            if (this.useVertexIndices) {
                // Установка текущего буфера индексов вершин.
                this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffers.indexBuffers[i]);
                // Рендеринг текущей группы буферов.
                this.gl.drawElements(this.gl.POINTS, this.buffers.amountOfGLVertices[i], this.gl.UNSIGNED_SHORT, 0);
            }
            else {
                this.gl.drawArrays(this.gl.POINTS, 0, this.buffers.amountOfGLVertices[i] / 3);
            }
        }
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
                x: utils_1.randomInt(this.gridSize.width),
                y: utils_1.randomInt(this.gridSize.height),
                shape: utils_1.randomQuotaIndex(this.demoMode.shapeQuota),
                color: utils_1.randomInt(this.polygonPalette.length)
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
            this.canvas.addEventListener('mousedown', this.handleMouseDownWithContext);
            this.canvas.addEventListener('wheel', this.handleMouseWheelWithContext);
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
            this.canvas.removeEventListener('mousedown', this.handleMouseDownWithContext);
            this.canvas.removeEventListener('wheel', this.handleMouseWheelWithContext);
            this.canvas.removeEventListener('mousemove', this.handleMouseMoveWithContext);
            this.canvas.removeEventListener('mouseup', this.handleMouseUpWithContext);
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
    return SPlot;
}());
exports.default = SPlot;


/***/ }),

/***/ "./utils.ts":
/*!******************!*\
  !*** ./utils.ts ***!
  \******************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getCurrentTime = exports.colorFromHexToGlRgb = exports.randomQuotaIndex = exports.jsonStringify = exports.randomInt = exports.isObject = void 0;
/**
 * Проверяет является ли переменная экземпляром какого-либоо класса.
 *
 * @param val - Проверяемая переменная.
 * @returns Результат проверки.
 */
function isObject(obj) {
    return (Object.prototype.toString.call(obj) === '[object Object]');
}
exports.isObject = isObject;
/**
 * Возвращает случайное целое число в диапазоне: [0...range-1].
 *
 * @param range - Верхний предел диапазона случайного выбора.
 * @returns Случайное число.
 */
function randomInt(range) {
    return Math.floor(Math.random() * range);
}
exports.randomInt = randomInt;
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
exports.jsonStringify = jsonStringify;
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
function randomQuotaIndex(arr) {
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
}
exports.randomQuotaIndex = randomQuotaIndex;
/**
 * Конвертирует цвет из HEX-представления в представление цвета для GLSL-кода (RGB с диапазонами значений от 0 до 1).
 *
 * @param hexColor - Цвет в HEX-формате.
 * @returns Массив из трех чисел в диапазоне от 0 до 1.
 */
function colorFromHexToGlRgb(hexColor) {
    var k = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor);
    var _a = [parseInt(k[1], 16) / 255, parseInt(k[2], 16) / 255, parseInt(k[3], 16) / 255], r = _a[0], g = _a[1], b = _a[2];
    return [r, g, b];
}
exports.colorFromHexToGlRgb = colorFromHexToGlRgb;
/**
 * Вычисляет текущее время.
 *
 * @returns Строковая форматированная запись текущего времени. Формат: hh:mm:ss
 */
function getCurrentTime() {
    var today = new Date();
    var time = ((today.getHours() < 10 ? '0' : '') + today.getHours()) + ":" +
        ((today.getMinutes() < 10 ? '0' : '') + today.getMinutes()) + ":" +
        ((today.getSeconds() < 10 ? '0' : '') + today.getSeconds());
    return time;
}
exports.getCurrentTime = getCurrentTime;


/***/ }),

/***/ "./vertex-shader.ts":
/*!**************************!*\
  !*** ./vertex-shader.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.default = "\nattribute vec2 a_position;\nattribute float a_color;\nuniform mat3 u_matrix;\nvarying vec3 v_color;\nvoid main() {\n  gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0.0, 1.0);\n  gl_PointSize = 20.0;\n  {ADDITIONAL-CODE}\n}\n";


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zdHlsZS5jc3MiLCJ3ZWJwYWNrOi8vLy4vZnJhZ21lbnQtc2hhZGVyLnRzIiwid2VicGFjazovLy8uL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NwbG90LnRzIiwid2VicGFjazovLy8uL3V0aWxzLnRzIiwid2VicGFjazovLy8uL3ZlcnRleC1zaGFkZXIudHMiLCJ3ZWJwYWNrOi8vLy4vbTMuanMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovLy93ZWJwYWNrL3N0YXJ0dXAiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7QUNBQSxrQkFDQSxnT0FTQztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQTZCRTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN6Q0YsZ0ZBQTJCO0FBQzNCLGtEQUFnQjtBQUVoQixTQUFTLFNBQVMsQ0FBQyxLQUFhO0lBQzlCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsS0FBSyxDQUFDO0FBQzFDLENBQUM7QUFFRCxJQUFJLENBQUMsR0FBRyxDQUFDO0FBQ1QsSUFBSSxDQUFDLEdBQUcsT0FBUyxFQUFFLDhCQUE4QjtBQUNqRCxJQUFJLE9BQU8sR0FBRyxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQztBQUM1SCxJQUFJLFNBQVMsR0FBRyxLQUFNO0FBQ3RCLElBQUksVUFBVSxHQUFHLEtBQU07QUFFdkIsZ0hBQWdIO0FBQ2hILFNBQVMsY0FBYztJQUNyQixJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDVCxDQUFDLEVBQUU7UUFDSCxPQUFPO1lB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QTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhLE9BQU87QUFDcEIsYUFBYSxPQUFPO0FBQ3BCLGNBQWMsNkJBQTZCO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYSw2QkFBNkI7QUFDMUMsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQixjQUFjLDZCQUE2QjtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhLE9BQU87QUFDcEIsY0FBYyw2QkFBNkI7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYSw2QkFBNkI7QUFDMUMsYUFBYSxPQUFPO0FBQ3BCLGNBQWMsNkJBQTZCO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEIsY0FBYyw2QkFBNkI7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhLDZCQUE2QjtBQUMxQyxhQUFhLE9BQU87QUFDcEIsYUFBYSxPQUFPO0FBQ3BCLGNBQWMsNkJBQTZCO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLENBQUM7Ozs7Ozs7O1VDN1NEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBLHNEQUFzRCxrQkFBa0I7V0FDeEU7V0FDQSwrQ0FBK0MsY0FBYztXQUM3RCxFOzs7OztVQ05BO1VBQ0E7VUFDQTtVQUNBIiwiZmlsZSI6InNjcmlwdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsImV4cG9ydCBkZWZhdWx0XG5gXG5wcmVjaXNpb24gbG93cCBmbG9hdDtcbnZhcnlpbmcgdmVjMyB2X2NvbG9yO1xudm9pZCBtYWluKCkge1xuICBmbG9hdCB2U2l6ZSA9IDIwLjA7XG4gIGZsb2F0IGRpc3RhbmNlID0gbGVuZ3RoKDIuMCAqIGdsX1BvaW50Q29vcmQgLSAxLjApO1xuICBpZiAoZGlzdGFuY2UgPiAxLjApIHsgZGlzY2FyZDsgfVxuICBnbF9GcmFnQ29sb3IgPSB2ZWM0KHZfY29sb3IucmdiLCAxLjApO1xufVxuYFxuXG4vKipcbmV4cG9ydCBkZWZhdWx0XG4gIGBcbnByZWNpc2lvbiBsb3dwIGZsb2F0O1xudmFyeWluZyB2ZWMzIHZfY29sb3I7XG52b2lkIG1haW4oKSB7XG4gIGZsb2F0IHZTaXplID0gMjAuMDtcbiAgZmxvYXQgZGlzdGFuY2UgPSBsZW5ndGgoMi4wICogZ2xfUG9pbnRDb29yZCAtIDEuMCk7XG4gIGlmIChkaXN0YW5jZSA+IDEuMCkgeyBkaXNjYXJkOyB9XG4gIGdsX0ZyYWdDb2xvciA9IHZlYzQodl9jb2xvci5yZ2IsIDEuMCk7XG5cbiAgIHZlYzQgdUVkZ2VDb2xvciA9IHZlYzQoMC41LCAwLjUsIDAuNSwgMS4wKTtcbiBmbG9hdCB1RWRnZVNpemUgPSAxLjA7XG5cbmZsb2F0IHNFZGdlID0gc21vb3Roc3RlcChcbiAgdlNpemUgLSB1RWRnZVNpemUgLSAyLjAsXG4gIHZTaXplIC0gdUVkZ2VTaXplLFxuICBkaXN0YW5jZSAqICh2U2l6ZSArIHVFZGdlU2l6ZSlcbik7XG5nbF9GcmFnQ29sb3IgPSAodUVkZ2VDb2xvciAqIHNFZGdlKSArICgoMS4wIC0gc0VkZ2UpICogZ2xfRnJhZ0NvbG9yKTtcblxuZ2xfRnJhZ0NvbG9yLmEgPSBnbF9GcmFnQ29sb3IuYSAqICgxLjAgLSBzbW9vdGhzdGVwKFxuICAgIHZTaXplIC0gMi4wLFxuICAgIHZTaXplLFxuICAgIGRpc3RhbmNlICogdlNpemVcbikpO1xuXG59XG5gXG4qL1xuIiwiaW1wb3J0IFNQbG90IGZyb20gJy4vc3Bsb3QnXG5pbXBvcnQgJ0Avc3R5bGUnXG5cbmZ1bmN0aW9uIHJhbmRvbUludChyYW5nZTogbnVtYmVyKSB7XG4gIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiByYW5nZSlcbn1cblxubGV0IGkgPSAwXG5sZXQgbiA9IDFfMDAwXzAwMCAgLy8g0JjQvNC40YLQuNGA0YPQtdC80L7QtSDRh9C40YHQu9C+INC+0LHRitC10LrRgtC+0LIuXG5sZXQgcGFsZXR0ZSA9IFsnI0ZGMDBGRicsICcjODAwMDgwJywgJyNGRjAwMDAnLCAnIzgwMDAwMCcsICcjRkZGRjAwJywgJyMwMEZGMDAnLCAnIzAwODAwMCcsICcjMDBGRkZGJywgJyMwMDAwRkYnLCAnIzAwMDA4MCddXG5sZXQgcGxvdFdpZHRoID0gMzJfMDAwXG5sZXQgcGxvdEhlaWdodCA9IDE2XzAwMFxuXG4vLyDQn9GA0LjQvNC10YAg0LjRgtC10YDQuNGA0YPRjtGJ0LXQuSDRhNGD0L3QutGG0LjQuC4g0JjRgtC10YDQsNGG0LjQuCDQuNC80LjRgtC40YDRg9GO0YLRgdGPINGB0LvRg9GH0LDQudC90YvQvNC4INCy0YvQtNCw0YfQsNC80LguINCf0L7Rh9GC0Lgg0YLQsNC60LbQtSDRgNCw0LHQvtGC0LDQtdGCINGA0LXQttC40Lwg0LTQtdC80L4t0LTQsNC90L3Ri9GFLlxuZnVuY3Rpb24gcmVhZE5leHRPYmplY3QoKSB7XG4gIGlmIChpIDwgbikge1xuICAgIGkrK1xuICAgIHJldHVybiB7XG4gICAgICB4OiByYW5kb21JbnQocGxvdFdpZHRoKSxcbiAgICAgIHk6IHJhbmRvbUludChwbG90SGVpZ2h0KSxcbiAgICAgIHNoYXBlOiAzLCAgICAgICAgICAgICAgIC8vIDAgLSDRgtGA0LXRg9Cz0L7Qu9GM0L3QuNC6LCAxIC0g0LrQstCw0LTRgNCw0YIsIDIgLSDQutGA0YPQs1xuICAgICAgY29sb3I6IHJhbmRvbUludChwYWxldHRlLmxlbmd0aCksICAvLyDQmNC90LTQtdC60YEg0YbQstC10YLQsCDQsiDQvNCw0YHRgdC40LLQtSDRhtCy0LXRgtC+0LJcbiAgICB9XG4gIH1cbiAgZWxzZVxuICAgIHJldHVybiBudWxsICAvLyDQktC+0LfQstGA0LDRidCw0LXQvCBudWxsLCDQutC+0LPQtNCwINC+0LHRitC10LrRgtGLIFwi0LfQsNC60L7QvdGH0LjQu9C40YHRjFwiXG59XG5cbi8qKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKiovXG5cbmxldCBzY2F0dGVyUGxvdCA9IG5ldyBTUGxvdCgnY2FudmFzMScpXG5cbi8vINCd0LDRgdGC0YDQvtC50LrQsCDRjdC60LfQtdC80L/Qu9GP0YDQsCDQvdCwINGA0LXQttC40Lwg0LLRi9Cy0L7QtNCwINC+0YLQu9Cw0LTQvtGH0L3QvtC5INC40L3RhNC+0YDQvNCw0YbQuNC4INCyINC60L7QvdGB0L7Qu9GMINCx0YDQsNGD0LfQtdGA0LAuXG4vLyDQlNGA0YPQs9C40LUg0L/RgNC40LzQtdGA0Ysg0YDQsNCx0L7RgtGLINC+0L/QuNGB0LDQvdGLINCyINGE0LDQudC70LUgc3Bsb3QuanMg0YHQviDRgdGC0YDQvtC60LggMjE0Llxuc2NhdHRlclBsb3Quc2V0dXAoe1xuICBpdGVyYXRpb25DYWxsYmFjazogcmVhZE5leHRPYmplY3QsXG4gIHBvbHlnb25QYWxldHRlOiBwYWxldHRlLFxuICBncmlkU2l6ZToge1xuICAgIHdpZHRoOiBwbG90V2lkdGgsXG4gICAgaGVpZ2h0OiBwbG90SGVpZ2h0LFxuICB9LFxuICBkZWJ1Z01vZGU6IHtcbiAgICBpc0VuYWJsZTogdHJ1ZSxcbiAgfSxcbiAgZGVtb01vZGU6IHtcbiAgICBpc0VuYWJsZTogZmFsc2UsXG4gIH0sXG59KVxuXG5zY2F0dGVyUGxvdC5ydW4oKVxuLy9zY2F0dGVyUGxvdC5zdG9wKClcblxuLy9zZXRUaW1lb3V0KCgpID0+IHNjYXR0ZXJQbG90LnN0b3AoKSwgMzAwMClcbiIsIi8vIEB0cy1pZ25vcmVcbmltcG9ydCBtMyBmcm9tICcuL20zJ1xuaW1wb3J0IHsgaXNPYmplY3QsIHJhbmRvbUludCwganNvblN0cmluZ2lmeSwgcmFuZG9tUXVvdGFJbmRleCwgY29sb3JGcm9tSGV4VG9HbFJnYiwgZ2V0Q3VycmVudFRpbWUgfSBmcm9tICcuL3V0aWxzJ1xuaW1wb3J0IHZlcnRleFNoYWRlckNvZGUgZnJvbSAnLi92ZXJ0ZXgtc2hhZGVyJ1xuaW1wb3J0IGZyYWdtZW50U2hhZGVyQ29kZSBmcm9tICcuL2ZyYWdtZW50LXNoYWRlcidcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU1Bsb3Qge1xuXG4gIC8vINCk0YPQvdC60YbQuNGPINC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOINC00LvRjyDQuNGC0LXRgNC40YDQvtCy0LDQvdC40Y8g0L7QsdGK0LXQutGC0L7QsiDQvdC1INC30LDQtNCw0LXRgtGB0Y8uXG4gIHB1YmxpYyBpdGVyYXRpb25DYWxsYmFjazogU1Bsb3RJdGVyYXRpb25GdW5jdGlvbiB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZFxuXG4gIC8vINCm0LLQtdGC0L7QstCw0Y8g0L/QsNC70LjRgtGA0LAg0L/QvtC70LjQs9C+0L3QvtCyINC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOLlxuICBwdWJsaWMgcG9seWdvblBhbGV0dGU6IHN0cmluZ1tdID0gW1xuICAgICcjRkYwMEZGJywgJyM4MDAwODAnLCAnI0ZGMDAwMCcsICcjODAwMDAwJywgJyNGRkZGMDAnLFxuICAgICcjMDBGRjAwJywgJyMwMDgwMDAnLCAnIzAwRkZGRicsICcjMDAwMEZGJywgJyMwMDAwODAnXG4gIF1cblxuICAvLyDQoNCw0LfQvNC10YAg0LrQvtC+0YDQtNC40L3QsNGC0L3QvtC5INC/0LvQvtGB0LrQvtGB0YLQuCDQv9C+INGD0LzQvtC70YfQsNC90LjRji5cbiAgcHVibGljIGdyaWRTaXplOiBTUGxvdEdyaWRTaXplID0ge1xuICAgIHdpZHRoOiAzMl8wMDAsXG4gICAgaGVpZ2h0OiAxNl8wMDBcbiAgfVxuXG4gIC8vINCg0LDQt9C80LXRgCDQv9C+0LvQuNCz0L7QvdCwINC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOLlxuICBwdWJsaWMgcG9seWdvblNpemU6IG51bWJlciA9IDIwXG5cbiAgLy8g0KHRgtC10L/QtdC90Ywg0LTQtdGC0LDQu9C40LfQsNGG0LjQuCDQutGA0YPQs9CwINC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOLlxuICBwdWJsaWMgY2lyY2xlQXBwcm94TGV2ZWw6IG51bWJlciA9IDEyXG5cbiAgLy8g0J/QsNGA0LDQvNC10YLRgNGLINGA0LXQttC40LzQsCDQvtGC0LvQsNC00LrQuCDQv9C+INGD0LzQvtC70YfQsNC90LjRji5cbiAgcHVibGljIGRlYnVnTW9kZTogU1Bsb3REZWJ1Z01vZGUgPSB7XG4gICAgaXNFbmFibGU6IGZhbHNlLFxuICAgIG91dHB1dDogJ2NvbnNvbGUnLFxuICAgIGhlYWRlclN0eWxlOiAnZm9udC13ZWlnaHQ6IGJvbGQ7IGNvbG9yOiAjZmZmZmZmOyBiYWNrZ3JvdW5kLWNvbG9yOiAjY2MwMDAwOycsXG4gICAgZ3JvdXBTdHlsZTogJ2ZvbnQtd2VpZ2h0OiBib2xkOyBjb2xvcjogI2ZmZmZmZjsnXG4gIH1cblxuICAvLyDQn9Cw0YDQsNC80LXRgtGA0Ysg0YDQtdC20LjQvNCwINC00LXQvNC+0YHRgtGA0LDRhtC40L7QvdC90YvRhSDQtNCw0L3QvdGL0YUg0L/QviDRg9C80L7Qu9GH0LDQvdC40Y4uXG4gIHB1YmxpYyBkZW1vTW9kZTogU1Bsb3REZW1vTW9kZSA9IHtcbiAgICBpc0VuYWJsZTogZmFsc2UsXG4gICAgYW1vdW50OiAxXzAwMF8wMDAsXG4gICAgLyoqXG4gICAgICog0J/QviDRg9C80L7Qu9GH0LDQvdC40Y4g0LIg0YDQtdC20LjQvNC1INC00LXQvNC+LdC00LDQvdC90YvRhSDQsdGD0LTRg9GCINC/0L7RgNC+0LLQvdGDINC+0YLQvtCx0YDQsNC20LDRgtGM0YHRjyDQv9C+0LvQuNCz0L7QvdGLINCy0YHQtdGFINCy0L7Qt9C80L7QttC90YvRhSDRhNC+0YDQvC4g0KHQvtC+0YLQstC10YLRgdGC0LLRg9GO0YnQuNC1XG4gICAgICog0LfQvdCw0YfQtdC90LjRjyDQvNCw0YHRgdC40LLQsCDQuNC90LjRhtC40LDQu9C40LfQuNGA0YPRjtGC0YHRjyDQv9GA0Lgg0YDQtdCz0LjRgdGC0YDQsNGG0LjQuCDRhNGD0L3QutGG0LjQuSDRgdC+0LfQtNCw0L3QuNGPINGE0L7RgNC8INC80LXRgtC+0LTQvtC8IHtAbGluayByZWdpc3RlclNoYXBlfS5cbiAgICAgKi9cbiAgICBzaGFwZVF1b3RhOiBbXSxcbiAgICBpbmRleDogMFxuICB9XG5cbiAgLy8g0J/RgNC40LfQvdCw0Log0L/QviDRg9C80L7Qu9GH0LDQvdC40Y4g0YTQvtGA0YHQuNGA0L7QstCw0L3QvdC+0LPQviDQt9Cw0L/Rg9GB0LrQsCDRgNC10L3QtNC10YDQsC5cbiAgcHVibGljIGZvcmNlUnVuOiBib29sZWFuID0gZmFsc2VcblxuICAvKipcbiAgICog0J/QviDRg9C80L7Qu9GH0LDQvdC40Y4g0LjRgdC60YPRgdGB0YLQstC10L3QvdC+0LPQviDQvtCz0YDQsNC90LjRh9C10L3QuNGPINC90LAg0LrQvtC70LjRh9C10YHRgtCy0L4g0L7RgtC+0LHRgNCw0LbQsNC10LzRi9GFINC/0L7Qu9C40LPQvtC90L7QsiDQvdC10YIgKNC30LAg0YHRh9C10YIg0LfQsNC00LDQvdC40Y8g0LHQvtC70YzRiNC+0LPQviDQt9Cw0LLQtdC00L7QvNC+XG4gICAqINC90LXQtNC+0YHRgtC40LbQuNC80L7Qs9C+INC/0L7RgNC+0LPQvtCy0L7Qs9C+INGH0LjRgdC70LApLlxuICAgKi9cbiAgcHVibGljIG1heEFtb3VudE9mUG9seWdvbnM6IG51bWJlciA9IDFfMDAwXzAwMF8wMDBcblxuICAvLyDQpNC+0L3QvtCy0YvQuSDRhtCy0LXRgiDQv9C+INGD0LzQvtC70YfQsNC90LjRjiDQtNC70Y8g0LrQsNC90LLQsNGB0LAuXG4gIHB1YmxpYyBiZ0NvbG9yOiBzdHJpbmcgPSAnI2ZmZmZmZidcblxuICAvLyDQptCy0LXRgiDQv9C+INGD0LzQvtC70YfQsNC90LjRjiDQtNC70Y8g0L3QsNC/0YDQsNCy0LvRj9GO0YnQuNGFLlxuICBwdWJsaWMgcnVsZXNDb2xvcjogc3RyaW5nID0gJyNjMGMwYzAnXG5cbiAgLy8g0J/QviDRg9C80L7Qu9GH0LDQvdC40Y4g0L7QsdC70LDRgdGC0Ywg0L/RgNC+0YHQvNC+0YLRgNCwINGD0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdGC0YHRjyDQsiDRhtC10L3RgtGAINC60L7QvtGA0LTQuNC90LDRgtC90L7QuSDQv9C70L7QvtGB0LrQvtGB0YLQuC5cbiAgcHVibGljIGNhbWVyYTogU1Bsb3RDYW1lcmEgPSB7XG4gICAgeDogdGhpcy5ncmlkU2l6ZS53aWR0aCAvIDIsXG4gICAgeTogdGhpcy5ncmlkU2l6ZS5oZWlnaHQgLyAyLFxuICAgIHpvb206IDFcbiAgfVxuXG4gIHB1YmxpYyB1c2VWZXJ0ZXhJbmRpY2VzOiBib29sZWFuID0gZmFsc2VcblxuICAvKipcbiAgICog0J/QviDRg9C80L7Qu9GH0LDQvdC40Y4g0L3QsNGB0YLRgNC+0LnQutC4INC60L7QvdGC0LXQutGB0YLQsCDRgNC10L3QtNC10YDQuNC90LPQsCBXZWJHTCDQvNCw0LrRgdC40LzQuNC30LjRgNGD0Y7RgiDQv9GA0L7QuNC30LLQvtC00LjRgtC10LvRjNC90L7RgdGC0Ywg0LPRgNCw0YTQuNGH0LXRgdC60L7QuSDRgdC40YHRgtC10LzRiy4g0KHQv9C10YbQuNCw0LvRjNC90YvRhVxuICAgKiDQv9C+0LvRjNC30L7QstCw0YLQtdC70YzRgdC60LjRhSDQv9GA0LXQtNGD0YHRgtCw0L3QvtCy0L7QuiDQvdC1INGC0YDQtdCx0YPQtdGC0YHRjywg0L7QtNC90LDQutC+INC/0YDQuNC70L7QttC10L3QuNC1INC/0L7Qt9Cy0L7Qu9GP0LXRgiDRjdC60YHQv9C10YDQuNC80LXQvdGC0LjRgNC+0LLQsNGC0Ywg0YEg0L3QsNGB0YLRgNC+0LnQutCw0LzQuCDQs9GA0LDRhNC40LrQuC5cbiAgICovXG4gIHB1YmxpYyB3ZWJHbFNldHRpbmdzOiBXZWJHTENvbnRleHRBdHRyaWJ1dGVzID0ge1xuICAgIGFscGhhOiBmYWxzZSxcbiAgICBkZXB0aDogZmFsc2UsXG4gICAgc3RlbmNpbDogZmFsc2UsXG4gICAgYW50aWFsaWFzOiBmYWxzZSxcbiAgICBwcmVtdWx0aXBsaWVkQWxwaGE6IGZhbHNlLFxuICAgIHByZXNlcnZlRHJhd2luZ0J1ZmZlcjogZmFsc2UsXG4gICAgcG93ZXJQcmVmZXJlbmNlOiAnaGlnaC1wZXJmb3JtYW5jZScsXG4gICAgZmFpbElmTWFqb3JQZXJmb3JtYW5jZUNhdmVhdDogZmFsc2UsXG4gICAgZGVzeW5jaHJvbml6ZWQ6IGZhbHNlXG4gIH1cblxuICAvLyDQn9GA0LjQt9C90LDQuiDQsNC60YLQuNCy0L3QvtCz0L4g0L/RgNC+0YbQtdGB0YHQsCDRgNC10L3QtNC10YDQsC4g0JTQvtGB0YLRg9C/0LXQvSDQv9C+0LvRjNC30L7QstCw0YLQtdC70Y4g0L/RgNC40LvQvtC20LXQvdC40Y8g0YLQvtC70YzQutC+INC00LvRjyDRh9GC0LXQvdC40Y8uXG4gIHB1YmxpYyBpc1J1bm5pbmc6IGJvb2xlYW4gPSBmYWxzZVxuXG4gIC8vINCe0LHRitC10LrRgiDQutCw0L3QstCw0YHQsC5cbiAgcHJvdGVjdGVkIHJlYWRvbmx5IGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnRcblxuICAvLyDQntCx0YrQtdC60YIg0LrQvtC90YLQtdC60YHRgtCwINGA0LXQvdC00LXRgNC40L3Qs9CwIFdlYkdMLlxuICBwcm90ZWN0ZWQgZ2whOiBXZWJHTFJlbmRlcmluZ0NvbnRleHRcblxuICAvLyDQntCx0YrQtdC60YIg0L/RgNC+0LPRgNCw0LzQvNGLIFdlYkdMLlxuICBwcm90ZWN0ZWQgZ3B1UHJvZ3JhbSE6IFdlYkdMUHJvZ3JhbVxuXG4gIC8vINCf0LXRgNC10LzQtdC90L3Ri9C1INC00LvRjyDRgdCy0Y/Qt9C4INC/0YDQuNC70L7QttC10L3QuNGPINGBINC/0YDQvtCz0YDQsNC80LzQvtC5IFdlYkdMLlxuICBwcm90ZWN0ZWQgdmFyaWFibGVzOiB7IFtrZXk6IHN0cmluZ106IGFueSB9ID0ge31cblxuICAvKipcbiAgICog0KjQsNCx0LvQvtC9IEdMU0wt0LrQvtC00LAg0LTQu9GPINCy0LXRgNGI0LjQvdC90L7Qs9C+INGI0LXQudC00LXRgNCwLiDQodC+0LTQtdGA0LbQuNGCINGB0L/QtdGG0LjQsNC70YzQvdGD0Y4g0LLRgdGC0LDQstC60YMgXCJ7QURESVRJT05BTC1DT0RFfVwiLCDQutC+0YLQvtGA0LDRjyDQv9C10YDQtdC0XG4gICAqINGB0L7Qt9C00LDQvdC40LXQvCDRiNC10LnQtNC10YDQsCDQt9Cw0LzQtdC90Y/QtdGC0YHRjyDQvdCwIEdMU0wt0LrQvtC0INCy0YvQsdC+0YDQsCDRhtCy0LXRgtCwINCy0LXRgNGI0LjQvS5cbiAgICovXG4gIHByb3RlY3RlZCByZWFkb25seSB2ZXJ0ZXhTaGFkZXJDb2RlVGVtcGxhdGU6IHN0cmluZyA9IHZlcnRleFNoYWRlckNvZGVcblxuICAvLyDQqNCw0LHQu9C+0L0gR0xTTC3QutC+0LTQsCDQtNC70Y8g0YTRgNCw0LPQvNC10L3RgtC90L7Qs9C+INGI0LXQudC00LXRgNCwLlxuICBwcm90ZWN0ZWQgcmVhZG9ubHkgZnJhZ21lbnRTaGFkZXJDb2RlVGVtcGxhdGU6IHN0cmluZyA9IGZyYWdtZW50U2hhZGVyQ29kZVxuXG4gIC8vINCh0YfQtdGC0YfQuNC6INGH0LjRgdC70LAg0L7QsdGA0LDQsdC+0YLQsNC90L3Ri9GFINC/0L7Qu9C40LPQvtC90L7Qsi5cbiAgcHJvdGVjdGVkIGFtb3VudE9mUG9seWdvbnM6IG51bWJlciA9IDBcblxuICAvKipcbiAgICogICDQndCw0LHQvtGAINCy0YHQv9C+0LzQvtCz0LDRgtC10LvRjNC90YvRhSDQutC+0L3RgdGC0LDQvdGCLCDQuNGB0L/QvtC70YzQt9GD0LXQvNGL0YUg0LIg0YfQsNGB0YLQviDQv9C+0LLRgtC+0YDRj9GO0YnQuNGF0YHRjyDQstGL0YfQuNGB0LvQtdC90LjRj9GFLiDQoNCw0YHRgdGH0LjRgtGL0LLQsNC10YLRgdGPINC4INC30LDQtNCw0LXRgtGB0Y8g0LJcbiAgICogICDQvNC10YLQvtC00LUge0BsaW5rIHNldFVzZWZ1bENvbnN0YW50c30uXG4gICAqL1xuICBwcm90ZWN0ZWQgVVNFRlVMX0NPTlNUUzogYW55W10gPSBbXVxuXG4gIC8vINCi0LXRhdC90LjRh9C10YHQutCw0Y8g0LjQvdGE0L7RgNC80LDRhtC40Y8sINC40YHQv9C+0LvRjNC30YPQtdC80LDRjyDQv9GA0LjQu9C+0LbQtdC90LjQtdC8INC00LvRjyDRgNCw0YHRh9C10YLQsCDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuS5cbiAgcHJvdGVjdGVkIHRyYW5zZm9ybTogU1Bsb3RUcmFuc2Zvcm0gPSB7XG4gICAgdmlld1Byb2plY3Rpb25NYXQ6IFtdLFxuICAgIHN0YXJ0SW52Vmlld1Byb2pNYXQ6IFtdLFxuICAgIHN0YXJ0Q2FtZXJhOiB7eDowLCB5OjAsIHpvb206IDF9LFxuICAgIHN0YXJ0UG9zOiBbXSxcbiAgICBzdGFydENsaXBQb3M6IFtdLFxuICAgIHN0YXJ0TW91c2VQb3M6IFtdXG4gIH1cblxuICAvKipcbiAgICog0JzQsNC60YHQuNC80LDQu9GM0L3QvtC1INCy0L7Qt9C80L7QttC90L7QtSDQutC+0LvQuNGH0LXRgdGC0LLQviDQstC10YDRiNC40L0g0LIg0LPRgNGD0L/Qv9C1INC/0L7Qu9C40LPQvtC90L7Qsiwg0LrQvtGC0L7RgNC+0LUg0LXRidC1INC00L7Qv9GD0YHQutCw0LXRgiDQtNC+0LHQsNCy0LvQtdC90LjQtSDQvtC00L3QvtCz0L4g0YHQsNC80L7Qs9C+XG4gICAqINC80L3QvtCz0L7QstC10YDRiNC40L3QvdC+0LPQviDQv9C+0LvQuNCz0L7QvdCwLiDQrdGC0L4g0LrQvtC70LjRh9C10YHRgtCy0L4g0LjQvNC10LXRgiDQvtCx0YrQtdC60YLQuNCy0L3QvtC1INGC0LXRhdC90LjRh9C10YHQutC+0LUg0L7Qs9GA0LDQvdC40YfQtdC90LjQtSwg0YIu0LouINGE0YPQvdC60YbQuNGPXG4gICAqIHtAbGluayBkcmF3RWxlbWVudHN9INC90LUg0L/QvtC30LLQvtC70Y/QtdGCINC60L7RgNGA0LXQutGC0L3QviDQv9GA0LjQvdC40LzQsNGC0Ywg0LHQvtC70YzRiNC1IDY1NTM2INC40L3QtNC10LrRgdC+0LIgKDMyNzY4INCy0LXRgNGI0LjQvSkuXG4gICAqL1xuLy8gIHByb3RlY3RlZCBtYXhBbW91bnRPZlZlcnRleFBlclBvbHlnb25Hcm91cDogbnVtYmVyID0gMzI3NjggLSAodGhpcy5jaXJjbGVBcHByb3hMZXZlbCArIDEpO1xuICBwcm90ZWN0ZWQgbWF4QW1vdW50T2ZWZXJ0ZXhQZXJQb2x5Z29uR3JvdXA6IG51bWJlciA9IDEwXzAwMFxuXG4gIC8vINCY0L3RhNC+0YDQvNCw0YbQuNGPINC+INCx0YPRhNC10YDQsNGFLCDRhdGA0LDQvdGP0YnQuNGFINC00LDQvdC90YvQtSDQtNC70Y8g0LLQuNC00LXQvtC/0LDQvNGP0YLQuC5cbiAgcHJvdGVjdGVkIGJ1ZmZlcnM6IFNQbG90QnVmZmVycyA9IHtcbiAgICB2ZXJ0ZXhCdWZmZXJzOiBbXSxcbiAgICBjb2xvckJ1ZmZlcnM6IFtdLFxuICAgIGluZGV4QnVmZmVyczogW10sXG4gICAgYW1vdW50T2ZHTFZlcnRpY2VzOiBbXSxcbiAgICBhbW91bnRPZlNoYXBlczogW10sXG4gICAgYW1vdW50T2ZCdWZmZXJHcm91cHM6IDAsXG4gICAgYW1vdW50T2ZUb3RhbFZlcnRpY2VzOiAwLFxuICAgIGFtb3VudE9mVG90YWxHTFZlcnRpY2VzOiAwLFxuICAgIHNpemVJbkJ5dGVzOiBbMCwgMCwgMF1cbiAgfVxuXG4gIC8qKlxuICAgKiDQmNC90YTQvtGA0LzQsNGG0LjRjyDQviDQstC+0LfQvNC+0LbQvdGL0YUg0YTQvtGA0LzQsNGFINC/0L7Qu9C40LPQvtC90L7Qsi5cbiAgICog0JrQsNC20LTQsNGPINGE0L7RgNC80LAg0L/RgNC10LTRgdGC0LDQstC70Y/QtdGC0YHRjyDRhNGD0L3QutGG0LjQtdC5LCDQstGL0YfQuNGB0LvRj9GO0YnQtdC5INC10LUg0LLQtdGA0YjQuNC90Ysg0Lgg0L3QsNC30LLQsNC90LjQtdC8INGE0L7RgNC80YsuXG4gICAqINCU0LvRjyDRg9C60LDQt9Cw0L3QuNGPINGE0L7RgNC80Ysg0L/QvtC70LjQs9C+0L3QvtCyINCyINC/0YDQuNC70L7QttC10L3QuNC4INC40YHQv9C+0LvRjNC30YPRjtGC0YHRjyDRh9C40YHQu9C+0LLRi9C1INC40L3QtNC10LrRgdGLINCyINC00LDQvdC90L7QvCDQvNCw0YHRgdC40LLQtS5cbiAgICovXG4gIHByb3RlY3RlZCBzaGFwZXM6IHtjYWxjOiBTUGxvdENhbGNTaGFwZUZ1bmMsIG5hbWU6IHN0cmluZ31bXSA9IFtdXG5cbiAgcHJvdGVjdGVkIGhhbmRsZU1vdXNlRG93bldpdGhDb250ZXh0OiBFdmVudExpc3RlbmVyID0gdGhpcy5oYW5kbGVNb3VzZURvd24uYmluZCh0aGlzKSBhcyBFdmVudExpc3RlbmVyXG4gIHByb3RlY3RlZCBoYW5kbGVNb3VzZVdoZWVsV2l0aENvbnRleHQ6IEV2ZW50TGlzdGVuZXIgPSB0aGlzLmhhbmRsZU1vdXNlV2hlZWwuYmluZCh0aGlzKSBhcyBFdmVudExpc3RlbmVyXG4gIHByb3RlY3RlZCBoYW5kbGVNb3VzZU1vdmVXaXRoQ29udGV4dDogRXZlbnRMaXN0ZW5lciA9IHRoaXMuaGFuZGxlTW91c2VNb3ZlLmJpbmQodGhpcykgYXMgRXZlbnRMaXN0ZW5lclxuICBwcm90ZWN0ZWQgaGFuZGxlTW91c2VVcFdpdGhDb250ZXh0OiBFdmVudExpc3RlbmVyID0gdGhpcy5oYW5kbGVNb3VzZVVwLmJpbmQodGhpcykgYXMgRXZlbnRMaXN0ZW5lclxuXG4gIC8qKlxuICAgKiDQodC+0LfQtNCw0LXRgiDRjdC60LfQtdC80L/Qu9GP0YAg0LrQu9Cw0YHRgdCwLCDQuNC90LjRhtC40LDQu9C40LfQuNGA0YPQtdGCINC90LDRgdGC0YDQvtC50LrQuC5cbiAgICpcbiAgICogQHJlbWFya3NcbiAgICog0JXRgdC70Lgg0LrQsNC90LLQsNGBINGBINC30LDQtNCw0L3QvdGL0Lwg0LjQtNC10L3RgtC40YTQuNC60LDRgtC+0YDQvtC8INC90LUg0L3QsNC50LTQtdC9IC0g0LPQtdC90LXRgNC40YDRg9C10YLRgdGPINC+0YjQuNCx0LrQsC4g0J3QsNGB0YLRgNC+0LnQutC4INC80L7Qs9GD0YIg0LHRi9GC0Ywg0LfQsNC00LDQvdGLINC60LDQuiDQslxuICAgKiDQutC+0L3RgdGC0YDRg9C60YLQvtGA0LUsINGC0LDQuiDQuCDQsiDQvNC10YLQvtC00LUge0BsaW5rIHNldHVwfS4g0J7QtNC90LDQutC+INCyINC70Y7QsdC+0Lwg0YHQu9GD0YfQsNC1INC90LDRgdGC0YDQvtC50LrQuCDQtNC+0LvQttC90Ysg0LHRi9GC0Ywg0LfQsNC00LDQvdGLINC00L4g0LfQsNC/0YPRgdC60LAg0YDQtdC90LTQtdGA0LAuXG4gICAqXG4gICAqIEBwYXJhbSBjYW52YXNJZCAtINCY0LTQtdC90YLQuNGE0LjQutCw0YLQvtGAINC60LDQvdCy0LDRgdCwLCDQvdCwINC60L7RgtC+0YDQvtC8INCx0YPQtNC10YIg0YDQuNGB0L7QstCw0YLRjNGB0Y8g0LPRgNCw0YTQuNC6LlxuICAgKiBAcGFyYW0gb3B0aW9ucyAtINCf0L7Qu9GM0LfQvtCy0LDRgtC10LvRjNGB0LrQuNC1INC90LDRgdGC0YDQvtC50LrQuCDRjdC60LfQtdC80L/Qu9GP0YDQsC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGNhbnZhc0lkOiBzdHJpbmcsIG9wdGlvbnM/OiBTUGxvdE9wdGlvbnMpIHtcblxuICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChjYW52YXNJZCkpIHtcbiAgICAgIHRoaXMuY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY2FudmFzSWQpIGFzIEhUTUxDYW52YXNFbGVtZW50XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcign0JrQsNC90LLQsNGBINGBINC40LTQtdC90YLQuNGE0LjQutCw0YLQvtGA0L7QvCBcIiMnICsgY2FudmFzSWQgKyDCoCdcIiDQvdC1INC90LDQudC00LXQvSEnKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqINCg0LXQs9C40YHRgtGA0LDRhtC40Y8g0YLRgNC10YUg0LHQsNC30L7QstGL0YUg0YTQvtGA0Lwg0L/QvtC70LjQs9C+0L3QvtCyICjRgtGA0LXRg9Cz0L7Qu9GM0L3QuNC60LgsINC60LLQsNC00YDQsNGC0Ysg0Lgg0LrRgNGD0LPQuCkuINCd0LDQu9C40YfQuNC1INGN0YLQuNGFINGE0L7RgNC8INCyINGD0LrQsNC30LDQvdC90L7QvCDQv9C+0YDRj9C00LrQtVxuICAgICAqINGP0LLQu9GP0LXRgtGB0Y8g0L7QsdGP0LfQsNGC0LXQu9GM0L3Ri9C8INC00LvRjyDQutC+0YDRgNC10LrRgtC90L7QuSDRgNCw0LHQvtGC0Ysg0L/RgNC40LvQvtC20LXQvdC40Y8uINCU0YDRg9Cz0LjQtSDRhNC+0YDQvNGLINC80L7Qs9GD0YIg0YDQtdCz0LjRgdGC0YDQuNGA0L7QstCw0YLRjNGPINCyINC70Y7QsdC+0Lwg0LrQvtC70LjRh9C10YHRgtCy0LUsINCyXG4gICAgICog0LvRjtCx0L7QuSDQv9C+0YHQu9C10LTQvtCy0LDRgtC10LvRjNC90L7RgdGC0LguXG4gICAgICovXG4gICAgdGhpcy5yZWdpc3RlclNoYXBlKHRoaXMuZ2V0VmVydGljZXNPZlRyaWFuZ2xlLCAn0KLRgNC10YPQs9C+0LvRjNC90LjQuicpXG4gICAgdGhpcy5yZWdpc3RlclNoYXBlKHRoaXMuZ2V0VmVydGljZXNPZlNxdWFyZSwgJ9Ca0LLQsNC00YDQsNGCJylcbiAgICB0aGlzLnJlZ2lzdGVyU2hhcGUodGhpcy5nZXRWZXJ0aWNlc09mQ2lyY2xlLCAn0JrRgNGD0LMnKVxuICAgIHRoaXMucmVnaXN0ZXJTaGFwZSh0aGlzLmdldFZlcnRpY2VzT2ZQb2ludCwgJ9Ci0L7Rh9C60LAnKVxuXG4gICAgLy8g0JXRgdC70Lgg0L/QtdGA0LXQtNCw0L3RiyDQvdCw0YHRgtGA0L7QudC60LgsINGC0L4g0L7QvdC4INC/0YDQuNC80LXQvdGP0Y7RgtGB0Y8uXG4gICAgaWYgKG9wdGlvbnMpIHtcbiAgICAgIHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKVxuXG4gICAgICAvLyAg0JXRgdC70Lgg0LfQsNC/0YDQvtGI0LXQvSDRhNC+0YDRgdC40YDQvtCy0LDQvdC90YvQuSDQt9Cw0L/Rg9GB0LosINGC0L4g0LjQvdC40YbQuNCw0LvQuNC30LjRgNGD0Y7RgtGB0Y8g0LLRgdC1INC90LXQvtCx0YXQvtC00LjQvNGL0LUg0LTQu9GPINGA0LXQvdC00LXRgNCwINC/0LDRgNCw0LzQtdGC0YDRiy5cbiAgICAgIGlmICh0aGlzLmZvcmNlUnVuKSB7XG4gICAgICAgIHRoaXMuc2V0dXAob3B0aW9ucylcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICog0KHQvtC30LTQsNC10YIg0LrQvtC90YLQtdC60YHRgiDRgNC10L3QtNC10YDQuNC90LPQsCBXZWJHTCDQuCDRg9GB0YLQsNC90LDQstC70LjQstCw0LXRgiDQutC+0YDRgNC10LrRgtC90YvQuSDRgNCw0LfQvNC10YAg0L7QsdC70LDRgdGC0Lgg0L/RgNC+0YHQvNC+0YLRgNCwLlxuICAgKi9cbiAgcHJvdGVjdGVkIGNyZWF0ZUdsKCk6IHZvaWQge1xuXG4gICAgdGhpcy5nbCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJ3dlYmdsJywgdGhpcy53ZWJHbFNldHRpbmdzKSBhcyBXZWJHTFJlbmRlcmluZ0NvbnRleHRcblxuICAgIHRoaXMuY2FudmFzLndpZHRoID0gdGhpcy5jYW52YXMuY2xpZW50V2lkdGhcbiAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSB0aGlzLmNhbnZhcy5jbGllbnRIZWlnaHRcblxuICAgIHRoaXMuZ2wudmlld3BvcnQoMCwgMCwgdGhpcy5jYW52YXMud2lkdGgsIHRoaXMuY2FudmFzLmhlaWdodClcbiAgfVxuXG4gIC8qKlxuICAgKiDQoNC10LPQuNGB0YLRgNC40YDRg9C10YIg0L3QvtCy0YPRjiDRhNC+0YDQvNGDINC/0L7Qu9C40LPQvtC90L7Qsi4g0KDQtdCz0LjRgdGC0YDQsNGG0LjRjyDQvtC30L3QsNGH0LDQtdGCINCy0L7Qt9C80L7QttC90L7RgdGC0Ywg0LIg0LTQsNC70YzQvdC10LnRiNC10Lwg0L7RgtC+0LHRgNCw0LbQsNGC0Ywg0L3QsCDQs9GA0LDRhNC40LrQtSDQv9C+0LvQuNCz0L7QvdGLINC00LDQvdC90L7QuSDRhNC+0YDQvNGLLlxuICAgKlxuICAgKiBAcGFyYW0gcG9seWdvbkNhbGMgLSDQpNGD0L3QutGG0LjRjyDQstGL0YfQuNGB0LvQtdC90LjRjyDQutC+0L7RgNC00LjQvdCw0YIg0LLQtdGA0YjQuNC9INC/0L7Qu9C40LPQvtC90LAg0LTQsNC90L3QvtC5INGE0L7RgNC80YsuXG4gICAqIEBwYXJhbSBwb2x5Z29uTmFtZSAtINCd0LDQt9Cy0LDQvdC40LUg0YTQvtGA0LzRiyDQv9C+0LvQuNCz0L7QvdCwLlxuICAgKiBAcmV0dXJucyDQmNC90LTQtdC60YEg0L3QvtCy0L7QuSDRhNC+0YDQvNGLLCDQv9C+INC60L7RgtC+0YDQvtC80YMg0LfQsNC00LDQtdGC0YHRjyDQtdC1INC+0YLQvtCx0YDQsNC20LXQvdC40LUg0L3QsCDQs9GA0LDRhNC40LrQtS5cbiAgICovXG4gIHB1YmxpYyByZWdpc3RlclNoYXBlKHBvbHlnb25DYWxjOiBTUGxvdENhbGNTaGFwZUZ1bmMsIHBvbHlnb25OYW1lOiBzdHJpbmcpOiBudW1iZXIge1xuXG4gICAgLy8g0JTQvtCx0LDQstC70LXQvdC40LUg0YTQvtGA0LzRiyDQsiDQvNCw0YHRgdC40LIg0YTQvtGA0LwuXG4gICAgdGhpcy5zaGFwZXMucHVzaCh7XG4gICAgICBjYWxjOiBwb2x5Z29uQ2FsYyxcbiAgICAgIG5hbWU6IHBvbHlnb25OYW1lXG4gICAgfSlcblxuICAgIC8vINCU0L7QsdCw0LLQu9C10L3QuNC1INGE0L7RgNC80Ysg0LIg0LzQsNGB0YHQuNCyINGH0LDRgdGC0L7RgiDQv9C+0Y/QstC70LXQvdC40Y8g0LIg0LTQtdC80L4t0YDQtdC20LjQvNC1LlxuICAgIHRoaXMuZGVtb01vZGUuc2hhcGVRdW90YSEucHVzaCgxKVxuXG4gICAgLy8g0J/QvtC70YPRh9C10L3QvdGL0Lkg0LjQvdC00LXQutGBINGE0L7RgNC80Ysg0LIg0LzQsNGB0YHQuNCy0LUg0YTQvtGA0LwuXG4gICAgcmV0dXJuIHRoaXMuc2hhcGVzLmxlbmd0aCAtIDFcbiAgfVxuXG4gIC8qKlxuICAgKiDQo9GB0YLQsNC90LDQstC70LjQstCw0LXRgiDQvdC10L7QsdGF0L7QtNC40LzRi9C1INC00LvRjyDRgNC10L3QtNC10YDQsCDQv9Cw0YDQsNC80LXRgtGA0Ysg0Y3QutC30LXQvNC/0LvRj9GA0LAg0LggV2ViR0wuXG4gICAqXG4gICAqIEBwYXJhbSBvcHRpb25zIC0g0J/QvtC70YzQt9C+0LLQsNGC0LXQu9GM0YHQutC40LUg0L3QsNGB0YLRgNC+0LnQutC4INGN0LrQt9C10LzQv9C70Y/RgNCwLlxuICAgKi9cbiAgcHVibGljIHNldHVwKG9wdGlvbnM6IFNQbG90T3B0aW9ucyk6IHZvaWQge1xuXG4gICAgLy8g0J/RgNC40LzQtdC90LXQvdC40LUg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GM0YHQutC40YUg0L3QsNGB0YLRgNC+0LXQui5cbiAgICB0aGlzLnNldE9wdGlvbnMob3B0aW9ucylcblxuICAgIC8vINCh0L7Qt9C00LDQvdC40LUg0LrQvtC90YLQtdC60YHRgtCwINGA0LXQvdC00LXRgNC40L3Qs9CwLlxuICAgIHRoaXMuY3JlYXRlR2woKVxuXG4gICAgLy8g0JLRi9Cy0L7QtCDQvtGC0LvQsNC00L7Rh9C90L7QuSDQuNC90YTQvtGA0LzQsNGG0LjQuC5cbiAgICBpZiAodGhpcy5kZWJ1Z01vZGUuaXNFbmFibGUpIHtcbiAgICAgIHRoaXMucmVwb3J0TWFpbkluZm8ob3B0aW9ucylcbiAgICB9XG5cbiAgICAvLyDQntCx0L3Rg9C70LXQvdC40LUg0YHRh9C10YLRh9C40LrQsCDQv9C+0LvQuNCz0L7QvdC+0LIuXG4gICAgdGhpcy5hbW91bnRPZlBvbHlnb25zID0gMFxuXG4gICAgLy8g0J7QsdC90YPQu9C10L3QuNC1INGC0LXRhdC90LjRh9C10YHQutC+0LPQviDRgdGH0LXRgtGH0LjQutCwINGA0LXQttC40LzQsCDQtNC10LzQvi3QtNCw0L3QvdGL0YVcbiAgICB0aGlzLmRlbW9Nb2RlLmluZGV4ID0gMFxuXG4gICAgLy8g0J7QsdC90YPQu9C10L3QuNC1INGB0YfQtdGC0YfQuNC60L7QsiDRh9C40YHQu9CwINC40YHQv9C+0LvRjNC30L7QstCw0L3QuNGPINGA0LDQt9C70LjRh9C90YvRhSDRhNC+0YDQvCDQv9C+0LvQuNCz0L7QvdC+0LIuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnNoYXBlcy5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy5idWZmZXJzLmFtb3VudE9mU2hhcGVzW2ldID0gMFxuICAgIH1cblxuICAgIC8vINCY0L3QuNGG0LjQsNC70LjQt9Cw0YbQuNGPINCy0YHQv9C+0LzQvtCz0LDRgtC10LvRjNC90YvRhSDQutC+0L3RgdGC0LDQvdGCLlxuICAgIHRoaXMuc2V0VXNlZnVsQ29uc3RhbnRzKClcblxuICAgIC8vINCj0YHRgtCw0L3QvtCy0LrQsCDRhtCy0LXRgtCwINC+0YfQuNGB0YLQutC4INGA0LXQvdC00LXRgNC40L3Qs9CwXG4gICAgbGV0IFtyLCBnLCBiXSA9IGNvbG9yRnJvbUhleFRvR2xSZ2IodGhpcy5iZ0NvbG9yKVxuICAgIHRoaXMuZ2wuY2xlYXJDb2xvcihyLCBnLCBiLCAwLjApXG4gICAgdGhpcy5nbC5jbGVhcih0aGlzLmdsLkNPTE9SX0JVRkZFUl9CSVQpXG5cbiAgICAvKipcbiAgICAgKiDQn9C+0LTQs9C+0YLQvtCy0LrQsCDQutC+0LTQvtCyINGI0LXQudC00LXRgNC+0LIuINCSINC60L7QtCDQstC10YDRiNC40L3QvdC+0LPQviDRiNC10LnQtNC10YDQsCDQstGB0YLQsNCy0LvRj9C10YLRgdGPINC60L7QtCDQstGL0LHQvtGA0LAg0YbQstC10YLQsCDQstC10YDRiNC40L0uINCa0L7QtCDRhNGA0LDQs9C80LXQvdGC0L3QvtCz0L5cbiAgICAgKiDRiNC10LnQtNC10YDQsCDQuNGB0L/QvtC70YzQt9GD0LXRgtGB0Y8g0LHQtdC3INC40LfQvNC10L3QtdC90LjQuS5cbiAgICAgKi9cbiAgICBsZXQgdmVydGV4U2hhZGVyQ29kZSA9IHRoaXMudmVydGV4U2hhZGVyQ29kZVRlbXBsYXRlLnJlcGxhY2UoJ3tBRERJVElPTkFMLUNPREV9JywgdGhpcy5nZW5TaGFkZXJDb2xvckNvZGUoKSlcbiAgICBsZXQgZnJhZ21lbnRTaGFkZXJDb2RlID0gdGhpcy5mcmFnbWVudFNoYWRlckNvZGVUZW1wbGF0ZVxuXG4gICAgLy8g0KHQvtC30LTQsNC90LjQtSDRiNC10LnQtNC10YDQvtCyIFdlYkdMLlxuICAgIGxldCB2ZXJ0ZXhTaGFkZXIgPSB0aGlzLmNyZWF0ZVdlYkdsU2hhZGVyKCdWRVJURVhfU0hBREVSJywgdmVydGV4U2hhZGVyQ29kZSlcbiAgICBsZXQgZnJhZ21lbnRTaGFkZXIgPSB0aGlzLmNyZWF0ZVdlYkdsU2hhZGVyKCdGUkFHTUVOVF9TSEFERVInLCBmcmFnbWVudFNoYWRlckNvZGUpXG5cbiAgICAvLyDQodC+0LfQtNCw0L3QuNC1INC/0YDQvtCz0YDQsNC80LzRiyBXZWJHTC5cbiAgICB0aGlzLmNyZWF0ZVdlYkdsUHJvZ3JhbSh2ZXJ0ZXhTaGFkZXIsIGZyYWdtZW50U2hhZGVyKVxuXG4gICAgLy8g0KPRgdGC0LDQvdC+0LLQutCwINGB0LLRj9C30LXQuSDQv9C10YDQtdC80LXQvdC90YvRhSDQv9GA0LjQu9C+0LbQtdC90LjRjyDRgSDQv9GA0L7Qs9GA0LDQvNC80L7QuSBXZWJHbC5cbiAgICB0aGlzLnNldFdlYkdsVmFyaWFibGUoJ2F0dHJpYnV0ZScsICdhX3Bvc2l0aW9uJylcbiAgICB0aGlzLnNldFdlYkdsVmFyaWFibGUoJ2F0dHJpYnV0ZScsICdhX2NvbG9yJylcbiAgICB0aGlzLnNldFdlYkdsVmFyaWFibGUoJ3VuaWZvcm0nLCAndV9tYXRyaXgnKVxuXG4gICAgLy8g0JLRi9GH0LjRgdC70LXQvdC40LUg0LTQsNC90L3Ri9GFINC+0LHQviDQstGB0LXRhSDQv9C+0LvQuNCz0L7QvdCw0YUg0Lgg0LfQsNC/0L7Qu9C90LXQvdC40LUg0LjQvNC4INCx0YPRhNC10YDQvtCyIFdlYkdMLlxuICAgIHRoaXMuY3JlYXRlV2JHbEJ1ZmZlcnMoKVxuXG4gICAgLy8g0JXRgdC70Lgg0L3QtdC+0LHRhdC+0LTQuNC80L4sINGC0L4g0YDQtdC90LTQtdGA0LjQvdCzINC30LDQv9GD0YHQutCw0LXRgtGB0Y8g0YHRgNCw0LfRgyDQv9C+0YHQu9C1INGD0YHRgtCw0L3QvtCy0LrQuCDQv9Cw0YDQsNC80LXRgtGA0L7QsiDRjdC60LfQtdC80L/Qu9GP0YDQsC5cbiAgICBpZiAodGhpcy5mb3JjZVJ1bikge1xuICAgICAgdGhpcy5ydW4oKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDQn9GA0LjQvNC10L3Rj9C10YIg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GM0YHQutC40LUg0L3QsNGB0YLRgNC+0LnQutC4INGN0LrQt9C10LzQv9C70Y/RgNCwLlxuICAgKlxuICAgKiBAcGFyYW0gb3B0aW9ucyAtINCf0L7Qu9GM0LfQvtCy0LDRgtC10LvRjNGB0LrQuNC1INC90LDRgdGC0YDQvtC50LrQuCDRjdC60LfQtdC80L/Qu9GP0YDQsC5cbiAgICovXG4gIHByb3RlY3RlZCBzZXRPcHRpb25zKG9wdGlvbnM6IFNQbG90T3B0aW9ucyk6IHZvaWQge1xuXG4gICAgLyoqXG4gICAgICog0JrQvtC/0LjRgNC+0LLQsNC90LjQtSDQv9C+0LvRjNC30L7QstCw0YLQtdC70YzRgdC60LjRhSDQvdCw0YHRgtGA0L7QtdC6INCyINGB0L7QvtGC0LLQtdGC0YHQstGD0Y7RidC40LUg0L/QvtC70Y8g0Y3QutC30LXQvNC/0LvRj9GA0LAuINCa0L7Qv9C40YDRg9GO0YLRgdGPINGC0L7Qu9GM0LrQviDRgtC1INC40Lcg0L3QuNGFLCDQutC+0YLQvtGA0YvQvFxuICAgICAqINC40LzQtdGO0YLRgdGPINGB0L7QvtGC0LLQtdGC0YHRgtCy0YPRjtGJ0LjQtSDRjdC60LLQuNCy0LDQu9C10L3RgtGLINCyINC/0L7Qu9GP0YUg0Y3QutC30LXQvNC/0LvRj9GA0LAuINCa0L7Qv9C40YDRg9C10YLRgdGPINGC0LDQutC20LUg0L/QtdGA0LLRi9C5INGD0YDQvtCy0LXQvdGMINCy0LvQvtC20LXQvdC90YvRhSDQvdCw0YHRgtGA0L7QtdC6LlxuICAgICAqL1xuICAgIGZvciAobGV0IG9wdGlvbiBpbiBvcHRpb25zKSB7XG5cbiAgICAgIGlmICghdGhpcy5oYXNPd25Qcm9wZXJ0eShvcHRpb24pKSBjb250aW51ZVxuXG4gICAgICBpZiAoaXNPYmplY3QoKG9wdGlvbnMgYXMgYW55KVtvcHRpb25dKSAmJiBpc09iamVjdCgodGhpcyBhcyBhbnkpW29wdGlvbl0pICkge1xuICAgICAgICBmb3IgKGxldCBuZXN0ZWRPcHRpb24gaW4gKG9wdGlvbnMgYXMgYW55KVtvcHRpb25dKSB7XG4gICAgICAgICAgaWYgKCh0aGlzIGFzIGFueSlbb3B0aW9uXS5oYXNPd25Qcm9wZXJ0eShuZXN0ZWRPcHRpb24pKSB7XG4gICAgICAgICAgICAodGhpcyBhcyBhbnkpW29wdGlvbl1bbmVzdGVkT3B0aW9uXSA9IChvcHRpb25zIGFzIGFueSlbb3B0aW9uXVtuZXN0ZWRPcHRpb25dXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAodGhpcyBhcyBhbnkpW29wdGlvbl0gPSAob3B0aW9ucyBhcyBhbnkpW29wdGlvbl1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDQldGB0LvQuCDQv9C+0LvRjNC30L7QstCw0YLQtdC70Ywg0LfQsNC00LDQtdGCINGA0LDQt9C80LXRgCDQv9C70L7RgdC60L7RgdGC0LgsINC90L4g0L/RgNC4INGN0YLQvtC8INC90LAg0LfQsNC00LDQtdGCINC90LDRh9Cw0LvRjNC90L7QtSDQv9C+0LvQvtC20LXQvdC40LUg0L7QsdC70LDRgdGC0Lgg0L/RgNC+0YHQvNC+0YLRgNCwLCDRgtC+XG4gICAgICog0L7QsdC70LDRgdGC0Ywg0L/RgNC+0YHQvNC+0YLRgNCwINC/0L7QvNC10YnQsNC10YLRgdGPINCyINGG0LXQvdGC0YAg0LfQsNC00LDQvdC90L7QuSDQv9C70L7RgdC60L7RgdGC0LguXG4gICAgICovXG4gICAgaWYgKG9wdGlvbnMuaGFzT3duUHJvcGVydHkoJ2dyaWRTaXplJykgJiYgIW9wdGlvbnMuaGFzT3duUHJvcGVydHkoJ2NhbWVyYScpKSB7XG4gICAgICB0aGlzLmNhbWVyYSA9IHtcbiAgICAgICAgeDogdGhpcy5ncmlkU2l6ZS53aWR0aCAvIDIsXG4gICAgICAgIHk6IHRoaXMuZ3JpZFNpemUuaGVpZ2h0IC8gMixcbiAgICAgICAgem9vbTogMVxuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqINCV0YHQu9C4INC30LDQv9GA0L7RiNC10L0g0LTQtdC80L4t0YDQtdC20LjQvCwg0YLQviDQtNC70Y8g0LjRgtC10YDQuNGA0L7QstCw0L3QuNGPINC+0LHRitC10LrRgtC+0LIg0LHRg9C00LXRgiDQuNGB0L/QvtC70YzQt9C+0LLQsNGC0YzRgdGPINCy0L3Rg9GC0YDQtdC90L3QuNC5INC40LzQuNGC0LjRgNGD0Y7RidC40Lkg0LjRgtC10YDQuNGA0L7QstCw0L3QuNC1XG4gICAgICog0LzQtdGC0L7QtC4g0J/RgNC4INGN0YLQvtC8INCy0L3QtdGI0L3Rj9GPINGE0YPQvdC60YbQuNGPINC40YLQtdGA0LjRgNC+0LLQsNC90LjRjyDQuNGB0L/QvtC70YzQt9C+0LLQsNC90LAg0L3QtSDQsdGD0LTQtdGCLlxuICAgICAqL1xuICAgIGlmICh0aGlzLmRlbW9Nb2RlLmlzRW5hYmxlKSB7XG4gICAgICB0aGlzLml0ZXJhdGlvbkNhbGxiYWNrID0gdGhpcy5kZW1vSXRlcmF0aW9uQ2FsbGJhY2tcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICog0JLRi9GH0LjRgdC70Y/QtdGCINC90LDQsdC+0YAg0LLRgdC/0L7QvNC+0LPQsNGC0LXQu9GM0L3Ri9GFINC60L7QvdGB0YLQsNC90YIge0BsaW5rIFVTRUZVTF9DT05TVFN9LCDRhdGA0LDQvdGP0YnQuNGFINGA0LXQt9GD0LvRjNGC0LDRgtGLINCw0LvQs9C10LHRgNCw0LjRh9C10YHQutC40YUg0LhcbiAgICog0YLRgNC40LPQvtC90L7QvNC10YLRgNC40YfQtdGB0LrQuNGFINCy0YvRh9C40YHQu9C10L3QuNC5LCDQuNGB0L/QvtC70YzQt9GD0LXQvNGL0YUg0LIg0YDQsNGB0YfQtdGC0LDRhSDQstC10YDRiNC40L0g0L/QvtC70LjQs9C+0L3QvtCyINC4INC80LDRgtGA0LjRhiDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuC5cbiAgICpcbiAgICogQHJlbWFya3NcbiAgICog0KLQsNC60LjQtSDQutC+0L3RgdGC0LDQvdGC0Ysg0L/QvtC30LLQvtC70Y/RjtGCINCy0YvQvdC10YHRgtC4INC30LDRgtGA0LDRgtC90YvQtSDQtNC70Y8g0L/RgNC+0YbQtdGB0YHQvtGA0LAg0L7Qv9C10YDQsNGG0LjQuCDQt9CwINC/0YDQtdC00LXQu9GLINC80L3QvtCz0L7QutGA0LDRgtC90L4g0LjRgdC/0L7Qu9GM0LfRg9C10LzRi9GFINGE0YPQvdC60YbQuNC5XG4gICAqINGD0LLQtdC70LjRh9C40LLQsNGPINC/0YDQvtC40LfQstC+0LTQuNGC0LXQu9GM0L3QvtGB0YLRjCDQv9GA0LjQu9C+0LbQtdC90LjRjyDQvdCwINGN0YLQsNC/0LDRhSDQv9C+0LTQs9C+0YLQvtCy0LrQuCDQtNCw0L3QvdGL0YUg0Lgg0YDQtdC90LTQtdGA0LjQvdCz0LAuXG4gICAqL1xuICBwcm90ZWN0ZWQgc2V0VXNlZnVsQ29uc3RhbnRzKCk6IHZvaWQge1xuXG4gICAgLy8g0JrQvtC90YHRgtCw0L3RgtGLLCDQt9Cw0LLQuNGB0Y/RidC40LUg0L7RgiDRgNCw0LfQvNC10YDQsCDQv9C+0LvQuNCz0L7QvdCwLlxuICAgIHRoaXMuVVNFRlVMX0NPTlNUU1swXSA9IHRoaXMucG9seWdvblNpemUgLyAyXG4gICAgdGhpcy5VU0VGVUxfQ09OU1RTWzFdID0gdGhpcy5VU0VGVUxfQ09OU1RTWzBdIC8gTWF0aC5jb3MoTWF0aC5QSSAvIDYpXG4gICAgdGhpcy5VU0VGVUxfQ09OU1RTWzJdID0gdGhpcy5VU0VGVUxfQ09OU1RTWzBdICogTWF0aC50YW4oTWF0aC5QSSAvIDYpXG5cbiAgICAvLyDQmtC+0L3RgdGC0LDQvdGC0YssINC30LDQstC40YHRj9GJ0LjQtSDQvtGCINGB0YLQtdC/0LXQvdC4INC00LXRgtCw0LvQuNC30LDRhtC40Lgg0LrRgNGD0LPQsCDQuCDRgNCw0LfQvNC10YDQsCDQv9C+0LvQuNCz0L7QvdCwLlxuICAgIHRoaXMuVVNFRlVMX0NPTlNUU1szXSA9IG5ldyBGbG9hdDMyQXJyYXkodGhpcy5jaXJjbGVBcHByb3hMZXZlbClcbiAgICB0aGlzLlVTRUZVTF9DT05TVFNbNF0gPSBuZXcgRmxvYXQzMkFycmF5KHRoaXMuY2lyY2xlQXBwcm94TGV2ZWwpXG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2lyY2xlQXBwcm94TGV2ZWw7IGkrKykge1xuICAgICAgY29uc3QgYW5nbGUgPSAyICogTWF0aC5QSSAqIGkgLyB0aGlzLmNpcmNsZUFwcHJveExldmVsXG4gICAgICB0aGlzLlVTRUZVTF9DT05TVFNbM11baV0gPSB0aGlzLlVTRUZVTF9DT05TVFNbMF0gKiBNYXRoLmNvcyhhbmdsZSlcbiAgICAgIHRoaXMuVVNFRlVMX0NPTlNUU1s0XVtpXSA9IHRoaXMuVVNFRlVMX0NPTlNUU1swXSAqIE1hdGguc2luKGFuZ2xlKVxuICAgIH1cblxuICAgIC8vINCa0L7QvdGB0YLQsNC90YLRiywg0LfQsNCy0LjRgdGP0YnQuNC1INC+0YIg0YDQsNC30LzQtdGA0LAg0LrQsNC90LLQsNGB0LAuXG4gICAgdGhpcy5VU0VGVUxfQ09OU1RTWzVdID0gMiAvIHRoaXMuY2FudmFzLndpZHRoXG4gICAgdGhpcy5VU0VGVUxfQ09OU1RTWzZdID0gMiAvIHRoaXMuY2FudmFzLmhlaWdodFxuICAgIHRoaXMuVVNFRlVMX0NPTlNUU1s3XSA9IDIgLyB0aGlzLmNhbnZhcy5jbGllbnRXaWR0aFxuICAgIHRoaXMuVVNFRlVMX0NPTlNUU1s4XSA9IC0yIC8gdGhpcy5jYW52YXMuY2xpZW50SGVpZ2h0XG4gICAgdGhpcy5VU0VGVUxfQ09OU1RTWzldID0gdGhpcy5jYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdFxuICAgIHRoaXMuVVNFRlVMX0NPTlNUU1sxMF0gPSB0aGlzLmNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3BcbiAgfVxuXG4gIC8qKlxuICAgKiDQodC+0LfQtNCw0LXRgiDRiNC10LnQtNC10YAgV2ViR0wuXG4gICAqXG4gICAqIEBwYXJhbSBzaGFkZXJUeXBlINCi0LjQvyDRiNC10LnQtNC10YDQsC5cbiAgICogQHBhcmFtIHNoYWRlckNvZGUg0JrQvtC0INGI0LXQudC00LXRgNCwINC90LAg0Y/Qt9GL0LrQtSBHTFNMLlxuICAgKiBAcmV0dXJucyDQodC+0LfQtNCw0L3QvdGL0Lkg0L7QsdGK0LXQutGCINGI0LXQudC00LXRgNCwLlxuICAgKi9cbiAgcHJvdGVjdGVkIGNyZWF0ZVdlYkdsU2hhZGVyKHNoYWRlclR5cGU6IFdlYkdsU2hhZGVyVHlwZSwgc2hhZGVyQ29kZTogc3RyaW5nKTogV2ViR0xTaGFkZXIge1xuXG4gICAgLy8g0KHQvtC30LTQsNC90LjQtSwg0L/RgNC40LLRj9C30LrQsCDQutC+0LTQsCDQuCDQutC+0LzQv9C40LvRj9GG0LjRjyDRiNC10LnQtNC10YDQsC5cbiAgICBjb25zdCBzaGFkZXIgPSB0aGlzLmdsLmNyZWF0ZVNoYWRlcih0aGlzLmdsW3NoYWRlclR5cGVdKSBhcyBXZWJHTFNoYWRlclxuICAgIHRoaXMuZ2wuc2hhZGVyU291cmNlKHNoYWRlciwgc2hhZGVyQ29kZSlcbiAgICB0aGlzLmdsLmNvbXBpbGVTaGFkZXIoc2hhZGVyKVxuXG4gICAgaWYgKCF0aGlzLmdsLmdldFNoYWRlclBhcmFtZXRlcihzaGFkZXIsIHRoaXMuZ2wuQ09NUElMRV9TVEFUVVMpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ9Ce0YjQuNCx0LrQsCDQutC+0LzQv9C40LvRj9GG0LjQuCDRiNC10LnQtNC10YDQsCBbJyArIHNoYWRlclR5cGUgKyAnXS4gJyArIHRoaXMuZ2wuZ2V0U2hhZGVySW5mb0xvZyhzaGFkZXIpKVxuICAgIH1cblxuICAgIC8vINCS0YvQstC+0LQg0L7RgtC70LDQtNC+0YfQvdC+0Lkg0LjQvdGE0L7RgNC80LDRhtC40LguXG4gICAgaWYgKHRoaXMuZGVidWdNb2RlLmlzRW5hYmxlKSB7XG4gICAgICBjb25zb2xlLmdyb3VwKCclY9Ch0L7Qt9C00LDQvSDRiNC10LnQtNC10YAgWycgKyBzaGFkZXJUeXBlICsgJ10nLCB0aGlzLmRlYnVnTW9kZS5ncm91cFN0eWxlKVxuICAgICAge1xuICAgICAgICBjb25zb2xlLmxvZyhzaGFkZXJDb2RlKVxuICAgICAgfVxuICAgICAgY29uc29sZS5ncm91cEVuZCgpXG4gICAgfVxuXG4gICAgcmV0dXJuIHNoYWRlclxuICB9XG5cbiAgLyoqXG4gICAqINCh0L7Qt9C00LDQtdGCINC/0YDQvtCz0YDQsNC80LzRgyBXZWJHTC5cbiAgICpcbiAgICogQHBhcmFtIHtXZWJHTFNoYWRlcn0gdmVydGV4U2hhZGVyINCS0LXRgNGI0LjQvdC90YvQuSDRiNC10LnQtNC10YAuXG4gICAqIEBwYXJhbSB7V2ViR0xTaGFkZXJ9IGZyYWdtZW50U2hhZGVyINCk0YDQsNCz0LzQtdC90YLQvdGL0Lkg0YjQtdC50LTQtdGALlxuICAgKi9cbiAgcHJvdGVjdGVkIGNyZWF0ZVdlYkdsUHJvZ3JhbSh2ZXJ0ZXhTaGFkZXI6IFdlYkdMU2hhZGVyLCBmcmFnbWVudFNoYWRlcjogV2ViR0xTaGFkZXIpOiB2b2lkIHtcblxuICAgIHRoaXMuZ3B1UHJvZ3JhbSA9IHRoaXMuZ2wuY3JlYXRlUHJvZ3JhbSgpIGFzIFdlYkdMUHJvZ3JhbVxuXG4gICAgdGhpcy5nbC5hdHRhY2hTaGFkZXIodGhpcy5ncHVQcm9ncmFtLCB2ZXJ0ZXhTaGFkZXIpXG4gICAgdGhpcy5nbC5hdHRhY2hTaGFkZXIodGhpcy5ncHVQcm9ncmFtLCBmcmFnbWVudFNoYWRlcilcbiAgICB0aGlzLmdsLmxpbmtQcm9ncmFtKHRoaXMuZ3B1UHJvZ3JhbSlcblxuICAgIGlmICghdGhpcy5nbC5nZXRQcm9ncmFtUGFyYW1ldGVyKHRoaXMuZ3B1UHJvZ3JhbSwgdGhpcy5nbC5MSU5LX1NUQVRVUykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcign0J7RiNC40LHQutCwINGB0L7Qt9C00LDQvdC40Y8g0L/RgNC+0LPRgNCw0LzQvNGLIFdlYkdMLiAnICsgdGhpcy5nbC5nZXRQcm9ncmFtSW5mb0xvZyh0aGlzLmdwdVByb2dyYW0pKVxuICAgIH1cblxuICAgIHRoaXMuZ2wudXNlUHJvZ3JhbSh0aGlzLmdwdVByb2dyYW0pXG4gIH1cblxuICAvKipcbiAgICog0KPRgdGC0LDQvdCw0LLQu9C40LLQsNC10YIg0YHQstGP0LfRjCDQv9C10YDQtdC80LXQvdC90L7QuSDQv9GA0LjQu9C+0LbQtdC90LjRjyDRgSDQv9GA0L7Qs9GA0LDQvNC80L7QuSBXZWJHbC5cbiAgICpcbiAgICogQHBhcmFtIHZhclR5cGUg0KLQuNC/INC/0LXRgNC10LzQtdC90L3QvtC5LlxuICAgKiBAcGFyYW0gdmFyTmFtZSDQmNC80Y8g0L/QtdGA0LXQvNC10L3QvdC+0LkuXG4gICAqL1xuICBwcm90ZWN0ZWQgc2V0V2ViR2xWYXJpYWJsZSh2YXJUeXBlOiBXZWJHbFZhcmlhYmxlVHlwZSwgdmFyTmFtZTogc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKHZhclR5cGUgPT09ICd1bmlmb3JtJykge1xuICAgICAgdGhpcy52YXJpYWJsZXNbdmFyTmFtZV0gPSB0aGlzLmdsLmdldFVuaWZvcm1Mb2NhdGlvbih0aGlzLmdwdVByb2dyYW0sIHZhck5hbWUpXG4gICAgfSBlbHNlIGlmICh2YXJUeXBlID09PSAnYXR0cmlidXRlJykge1xuICAgICAgdGhpcy52YXJpYWJsZXNbdmFyTmFtZV0gPSB0aGlzLmdsLmdldEF0dHJpYkxvY2F0aW9uKHRoaXMuZ3B1UHJvZ3JhbSwgdmFyTmFtZSlcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICog0KHQvtC30LTQsNC10YIg0Lgg0LfQsNC/0L7Qu9C90Y/QtdGCINC00LDQvdC90YvQvNC4INC+0LHQviDQstGB0LXRhSDQv9C+0LvQuNCz0L7QvdCw0YUg0LHRg9GE0LXRgNGLIFdlYkdMLlxuICAgKi9cbiAgcHJvdGVjdGVkIGNyZWF0ZVdiR2xCdWZmZXJzKCk6IHZvaWQge1xuXG4gICAgLy8g0JLRi9Cy0L7QtCDQvtGC0LvQsNC00L7Rh9C90L7QuSDQuNC90YTQvtGA0LzQsNGG0LjQuC5cbiAgICBpZiAodGhpcy5kZWJ1Z01vZGUuaXNFbmFibGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKCclY9CX0LDQv9GD0YnQtdC9INC/0YDQvtGG0LXRgdGBINC30LDQs9GA0YPQt9C60Lgg0LTQsNC90L3Ri9GFIFsnICsgZ2V0Q3VycmVudFRpbWUoKSArICddLi4uJywgdGhpcy5kZWJ1Z01vZGUuZ3JvdXBTdHlsZSlcblxuICAgICAgLy8g0JfQsNC/0YPRgdC6INC60L7QvdGB0L7Qu9GM0L3QvtCz0L4g0YLQsNC50LzQtdGA0LAsINC40LfQvNC10YDRj9GO0YnQtdCz0L4g0LTQu9C40YLQtdC70YzQvdC+0YHRgtGMINC/0YDQvtGG0LXRgdGB0LAg0LfQsNCz0YDRg9C30LrQuCDQtNCw0L3QvdGL0YUg0LIg0LLQuNC00LXQvtC/0LDQvNGP0YLRjC5cbiAgICAgIGNvbnNvbGUudGltZSgn0JTQu9C40YLQtdC70YzQvdC+0YHRgtGMJylcbiAgICB9XG5cbiAgICBsZXQgcG9seWdvbkdyb3VwOiBTUGxvdFBvbHlnb25Hcm91cCB8IG51bGxcblxuICAgIC8vINCY0YLQtdGA0LjRgNC+0LLQsNC90LjQtSDQs9GA0YPQv9C/INC/0L7Qu9C40LPQvtC90L7Qsi5cbiAgICB3aGlsZSAocG9seWdvbkdyb3VwID0gdGhpcy5jcmVhdGVQb2x5Z29uR3JvdXAoKSkge1xuXG4gICAgICAvLyDQodC+0LfQtNCw0L3QuNC1INC4INC30LDQv9C+0LvQvdC10L3QuNC1INCx0YPRhNC10YDQvtCyINC00LDQvdC90YvQvNC4INC+INGC0LXQutGD0YnQtdC5INCz0YDRg9C/0L/QtSDQv9C+0LvQuNCz0L7QvdC+0LIuXG4gICAgICB0aGlzLmFkZFdiR2xCdWZmZXIodGhpcy5idWZmZXJzLnZlcnRleEJ1ZmZlcnMsICdBUlJBWV9CVUZGRVInLCBuZXcgRmxvYXQzMkFycmF5KHBvbHlnb25Hcm91cC52ZXJ0aWNlcyksIDApXG4gICAgICB0aGlzLmFkZFdiR2xCdWZmZXIodGhpcy5idWZmZXJzLmNvbG9yQnVmZmVycywgJ0FSUkFZX0JVRkZFUicsIG5ldyBVaW50OEFycmF5KHBvbHlnb25Hcm91cC5jb2xvcnMpLCAxKVxuICAgICAgdGhpcy5hZGRXYkdsQnVmZmVyKHRoaXMuYnVmZmVycy5pbmRleEJ1ZmZlcnMsICdFTEVNRU5UX0FSUkFZX0JVRkZFUicsIG5ldyBVaW50MTZBcnJheShwb2x5Z29uR3JvdXAuaW5kaWNlcyksIDIpXG5cbiAgICAgIC8vINCh0YfQtdGC0YfQuNC6INC60L7Qu9C40YfQtdGB0YLQstCwINCx0YPRhNC10YDQvtCyLlxuICAgICAgdGhpcy5idWZmZXJzLmFtb3VudE9mQnVmZmVyR3JvdXBzKytcblxuICAgICAgLy8g0KHRh9C10YLRh9C40Log0LrQvtC70LjRh9C10YHRgtCy0LAg0LLQtdGA0YjQuNC9IEdMLdGC0YDQtdGD0LPQvtC70YzQvdC40LrQvtCyINGC0LXQutGD0YnQtdC5INCz0YDRg9C/0L/RiyDQsdGD0YTQtdGA0L7Qsi5cbiAgICAgIHRoaXMuYnVmZmVycy5hbW91bnRPZkdMVmVydGljZXMucHVzaChwb2x5Z29uR3JvdXAuYW1vdW50T2ZHTFZlcnRpY2VzKVxuXG4gICAgICAvLyDQodGH0LXRgtGH0LjQuiDQvtCx0YnQtdCz0L4g0LrQvtC70LjRh9C10YHRgtCy0LAg0LLQtdGA0YjQuNC9IEdMLdGC0YDQtdGD0LPQvtC70YzQvdC40LrQvtCyLlxuICAgICAgdGhpcy5idWZmZXJzLmFtb3VudE9mVG90YWxHTFZlcnRpY2VzICs9IHBvbHlnb25Hcm91cC5hbW91bnRPZkdMVmVydGljZXNcbiAgICB9XG5cbiAgICAvLyDQktGL0LLQvtC0INC+0YLQu9Cw0LTQvtGH0L3QvtC5INC40L3RhNC+0YDQvNCw0YbQuNC4LlxuICAgIGlmICh0aGlzLmRlYnVnTW9kZS5pc0VuYWJsZSkge1xuICAgICAgdGhpcy5yZXBvcnRBYm91dE9iamVjdFJlYWRpbmcoKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDQodGH0LjRgtGL0LLQsNC10YIg0LTQsNC90L3Ri9C1INC+0LEg0LjRgdGF0L7QtNC90YvRhSDQvtCx0YrQtdC60YLQsNGFINC4INGE0L7RgNC80LjRgNGD0LXRgiDRgdC+0L7RgtCy0LXRgtGB0LLRg9GO0YnRg9GOINGN0YLQuNC8INC+0LHRitC10LrRgtCw0Lwg0LPRgNGD0L/Qv9GDINC/0L7Qu9C40LPQvtC90L7Qsi5cbiAgICpcbiAgICogQHJlbWFya3NcbiAgICog0JPRgNGD0L/Qv9CwINGE0L7RgNC80LjRgNGD0LXRgtGB0Y8g0YEg0YPRh9C10YLQvtC8INGC0LXRhdC90LjRh9C10YHQutC+0LPQviDQvtCz0YDQsNC90LjRh9C10L3QuNGPINC90LAg0LrQvtC70LjRh9C10YHRgtCy0L4g0LLQtdGA0YjQuNC9INCyINCz0YDRg9C/0L/QtSDQuCDQu9C40LzQuNGC0LAg0L3QsCDQvtCx0YnQtdC1INC60L7Qu9C40YfQtdGB0YLQstC+XG4gICAqINC/0L7Qu9C40LPQvtC90L7QsiDQvdCwINC60LDQvdCy0LDRgdC1LlxuICAgKlxuICAgKiBAcmV0dXJucyDQodC+0LfQtNCw0L3QvdCw0Y8g0LPRgNGD0L/Qv9CwINC/0L7Qu9C40LPQvtC90L7QsiDQuNC70LggbnVsbCwg0LXRgdC70Lgg0YTQvtGA0LzQuNGA0L7QstCw0L3QuNC1INCy0YHQtdGFINCz0YDRg9C/0L8g0L/QvtC70LjQs9C+0L3QvtCyINC30LDQstC10YDRiNC40LvQvtGB0YwuXG4gICAqL1xuICBwcm90ZWN0ZWQgY3JlYXRlUG9seWdvbkdyb3VwKCk6IFNQbG90UG9seWdvbkdyb3VwIHwgbnVsbCB7XG5cbiAgICBsZXQgcG9seWdvbkdyb3VwOiBTUGxvdFBvbHlnb25Hcm91cCA9IHtcbiAgICAgIHZlcnRpY2VzOiBbXSxcbiAgICAgIGluZGljZXM6IFtdLFxuICAgICAgY29sb3JzOiBbXSxcbiAgICAgIGFtb3VudE9mVmVydGljZXM6IDAsXG4gICAgICBhbW91bnRPZkdMVmVydGljZXM6IDBcbiAgICB9XG5cbiAgICBsZXQgcG9seWdvbjogU1Bsb3RQb2x5Z29uIHwgbnVsbFxuXG4gICAgLyoqXG4gICAgICog0JXRgdC70Lgg0LrQvtC70LjRh9C10YHRgtCy0L4g0L/QvtC70LjQs9C+0L3QvtCyINC60LDQvdCy0LDRgdCwINC00L7RgdGC0LjQs9C70L4g0LTQvtC/0YPRgdGC0LjQvNC+0LPQviDQvNCw0LrRgdC40LzRg9C80LAsINGC0L4g0LTQsNC70YzQvdC10LnRiNCw0Y8g0L7QsdGA0LDQsdC+0YLQutCwINC40YHRhdC+0LTQvdGL0YUg0L7QsdGK0LXQutGC0L7QslxuICAgICAqINC/0YDQuNC+0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdGC0YHRjyAtINGE0L7RgNC80LjRgNC+0LLQsNC90LjQtSDQs9GA0YPQv9C/INC/0L7Qu9C40LPQvtC90L7QsiDQt9Cw0LLQtdGA0YjQsNC10YLRgdGPINCy0L7Qt9Cy0YDQsNGC0L7QvCDQt9C90LDRh9C10L3QuNGPIG51bGwgKNGB0LjQvNGD0LvRj9GG0LjRjyDQtNC+0YHRgtC40LbQtdC90LjRj1xuICAgICAqINC/0L7RgdC70LXQtNC90LXQs9C+INC+0LHRgNCw0LHQsNGC0YvQstCw0LXQvNC+0LPQviDQuNGB0YXQvtC00L3QvtCz0L4g0L7QsdGK0LXQutGC0LApLlxuICAgICAqL1xuICAgIGlmICh0aGlzLmFtb3VudE9mUG9seWdvbnMgPj0gdGhpcy5tYXhBbW91bnRPZlBvbHlnb25zKSByZXR1cm4gbnVsbFxuXG4gICAgLy8g0JjRgtC10YDQuNGA0L7QstCw0L3QuNC1INC40YHRhdC+0LTQvdGL0YUg0L7QsdGK0LXQutGC0L7Qsi5cbiAgICB3aGlsZSAocG9seWdvbiA9IHRoaXMuaXRlcmF0aW9uQ2FsbGJhY2shKCkpIHtcblxuICAgICAgLy8g0JTQvtCx0LDQstC70LXQvdC40LUg0LIg0LPRgNGD0L/Qv9GDINC/0L7Qu9C40LPQvtC90L7QsiDQvdC+0LLQvtCz0L4g0L/QvtC70LjQs9C+0L3QsC5cbiAgICAgIHRoaXMuYWRkUG9seWdvbihwb2x5Z29uR3JvdXAsIHBvbHlnb24pXG5cbiAgICAgIC8vINCh0YfQtdGC0YfQuNC6INGH0LjRgdC70LAg0L/RgNC40LzQtdC90LXQvdC40Lkg0LrQsNC20LTQvtC5INC40Lcg0YTQvtGA0Lwg0L/QvtC70LjQs9C+0L3QvtCyLlxuICAgICAgdGhpcy5idWZmZXJzLmFtb3VudE9mU2hhcGVzW3BvbHlnb24uc2hhcGVdKytcblxuICAgICAgLy8g0KHRh9C10YLRh9C40Log0L7QsdGJ0LXQs9C+INC60L7Qu9C40YfQtdGB0YLQstC+INC/0L7Qu9C40LPQvtC90L7Qsi5cbiAgICAgIHRoaXMuYW1vdW50T2ZQb2x5Z29ucysrXG5cbiAgICAgIC8qKlxuICAgICAgICog0JXRgdC70Lgg0LrQvtC70LjRh9C10YHRgtCy0L4g0L/QvtC70LjQs9C+0L3QvtCyINC60LDQvdCy0LDRgdCwINC00L7RgdGC0LjQs9C70L4g0LTQvtC/0YPRgdGC0LjQvNC+0LPQviDQvNCw0LrRgdC40LzRg9C80LAsINGC0L4g0LTQsNC70YzQvdC10LnRiNCw0Y8g0L7QsdGA0LDQsdC+0YLQutCwINC40YHRhdC+0LTQvdGL0YUg0L7QsdGK0LXQutGC0L7QslxuICAgICAgICog0L/RgNC40L7RgdGC0LDQvdCw0LLQu9C40LLQsNC10YLRgdGPIC0g0YTQvtGA0LzQuNGA0L7QstCw0L3QuNC1INCz0YDRg9C/0L8g0L/QvtC70LjQs9C+0L3QvtCyINC30LDQstC10YDRiNCw0LXRgtGB0Y8g0LLQvtC30LLRgNCw0YLQvtC8INC30L3QsNGH0LXQvdC40Y8gbnVsbCAo0YHQuNC80YPQu9GP0YbQuNGPINC00L7RgdGC0LjQttC10L3QuNGPXG4gICAgICAgKiDQv9C+0YHQu9C10LTQvdC10LPQviDQvtCx0YDQsNCx0LDRgtGL0LLQsNC10LzQvtCz0L4g0LjRgdGF0L7QtNC90L7Qs9C+INC+0LHRitC10LrRgtCwKS5cbiAgICAgICAqL1xuICAgICAgaWYgKHRoaXMuYW1vdW50T2ZQb2x5Z29ucyA+PSB0aGlzLm1heEFtb3VudE9mUG9seWdvbnMpIGJyZWFrXG5cbiAgICAgIC8qKlxuICAgICAgICog0JXRgdC70Lgg0L7QsdGJ0LXQtSDQutC+0LvQuNGH0LXRgdGC0LLQviDQstGB0LXRhSDQstC10YDRiNC40L0g0LIg0LPRgNGD0L/Qv9C1INC/0L7Qu9C40LPQvtC90L7QsiDQv9GA0LXQstGL0YHQuNC70L4g0YLQtdGF0L3QuNGH0LXRgdC60L7QtSDQvtCz0YDQsNC90LjRh9C10L3QuNC1LCDRgtC+INCz0YDRg9C/0L/QsCDQv9C+0LvQuNCz0L7QvdC+0LJcbiAgICAgICAqINGB0YfQuNGC0LDQtdGC0YHRjyDRgdGE0L7RgNC80LjRgNC+0LLQsNC90L3QvtC5INC4INC40YLQtdGA0LjRgNC+0LLQsNC90LjQtSDQuNGB0YXQvtC00L3Ri9GFINC+0LHRitC10LrRgtC+0LIg0L/RgNC40L7RgdGC0LDQvdCw0LLQu9C40LLQsNC10YLRgdGPLlxuICAgICAgICovXG4gICAgICBpZiAocG9seWdvbkdyb3VwLmFtb3VudE9mVmVydGljZXMgPj0gdGhpcy5tYXhBbW91bnRPZlZlcnRleFBlclBvbHlnb25Hcm91cCkgYnJlYWtcbiAgICB9XG5cbiAgICAvLyDQodGH0LXRgtGH0LjQuiDQvtCx0YnQtdCz0L4g0LrQvtC70LjRh9C10YHRgtCy0LAg0LLQtdGA0YjQuNC9INCy0YHQtdGFINCy0LXRgNGI0LjQvdC90YvRhSDQsdGD0YTQtdGA0L7Qsi5cbiAgICB0aGlzLmJ1ZmZlcnMuYW1vdW50T2ZUb3RhbFZlcnRpY2VzICs9IHBvbHlnb25Hcm91cC5hbW91bnRPZlZlcnRpY2VzXG5cbiAgICAvLyDQldGB0LvQuCDQs9GA0YPQv9C/0LAg0L/QvtC70LjQs9C+0L3QvtCyINC90LXQv9GD0YHRgtCw0Y8sINGC0L4g0LLQvtC30LLRgNCw0YnQsNC10Lwg0LXQtS4g0JXRgdC70Lgg0L/Rg9GB0YLQsNGPIC0g0LLQvtC30LLRgNCw0YnQsNC10LwgbnVsbC5cbiAgICByZXR1cm4gKHBvbHlnb25Hcm91cC5hbW91bnRPZlZlcnRpY2VzID4gMCkgPyBwb2x5Z29uR3JvdXAgOiBudWxsXG4gIH1cblxuICAvKipcbiAgICog0KHQvtC30LTQsNC10YIg0LIg0LzQsNGB0YHQuNCy0LUg0LHRg9GE0LXRgNC+0LIgV2ViR0wg0L3QvtCy0YvQuSDQsdGD0YTQtdGAINC4INC30LDQv9C40YHRi9Cy0LDQtdGCINCyINC90LXQs9C+INC/0LXRgNC10LTQsNC90L3Ri9C1INC00LDQvdC90YvQtS5cbiAgICpcbiAgICogQHBhcmFtIGJ1ZmZlcnMgLSDQnNCw0YHRgdC40LIg0LHRg9GE0LXRgNC+0LIgV2ViR0wsINCyINC60L7RgtC+0YDRi9C5INCx0YPQtNC10YIg0LTQvtCx0LDQstC70LXQvSDRgdC+0LfQtNCw0LLQsNC10LzRi9C5INCx0YPRhNC10YAuXG4gICAqIEBwYXJhbSB0eXBlIC0g0KLQuNC/INGB0L7Qt9C00LDQstCw0LXQvNC+0LPQviDQsdGD0YTQtdGA0LAuXG4gICAqIEBwYXJhbSBkYXRhIC0g0JTQsNC90L3Ri9C1INCyINCy0LjQtNC1INGC0LjQv9C40LfQuNGA0L7QstCw0L3QvdC+0LPQviDQvNCw0YHRgdC40LLQsCDQtNC70Y8g0LfQsNC/0LjRgdC4INCyINGB0L7Qt9C00LDQstCw0LXQvNGL0Lkg0LHRg9GE0LXRgC5cbiAgICogQHBhcmFtIGtleSAtINCa0LvRjtGHICjQuNC90LTQtdC60YEpLCDQuNC00LXQvdGC0LjRhNC40YbQuNGA0YPRjtGJ0LjQuSDRgtC40L8g0LHRg9GE0LXRgNCwICjQtNC70Y8g0LLQtdGA0YjQuNC9LCDQtNC70Y8g0YbQstC10YLQvtCyLCDQtNC70Y8g0LjQvdC00LXQutGB0L7QsikuINCY0YHQv9C+0LvRjNC30YPQtdGC0YHRjyDQtNC70Y9cbiAgICogICAgINGA0LDQt9C00LXQu9GM0L3QvtCz0L4g0L/QvtC00YHRh9C10YLQsCDQv9Cw0LzRj9GC0LgsINC30LDQvdC40LzQsNC10LzQvtC5INC60LDQttC00YvQvCDRgtC40L/QvtC8INCx0YPRhNC10YDQsC5cbiAgICovXG4gIHByb3RlY3RlZCBhZGRXYkdsQnVmZmVyKGJ1ZmZlcnM6IFdlYkdMQnVmZmVyW10sIHR5cGU6IFdlYkdsQnVmZmVyVHlwZSwgZGF0YTogVHlwZWRBcnJheSwga2V5OiBudW1iZXIpOiB2b2lkIHtcblxuICAgIC8vINCe0L/RgNC10LTQtdC70LXQvdC40LUg0LjQvdC00LXQutGB0LAg0L3QvtCy0L7Qs9C+INGN0LvQtdC80LXQvdGC0LAg0LIg0LzQsNGB0YHQuNCy0LUg0LHRg9GE0LXRgNC+0LIgV2ViR0wuXG4gICAgY29uc3QgaW5kZXggPSB0aGlzLmJ1ZmZlcnMuYW1vdW50T2ZCdWZmZXJHcm91cHNcblxuICAgIC8vINCh0L7Qt9C00LDQvdC40LUg0Lgg0LfQsNC/0L7Qu9C90LXQvdC40LUg0LTQsNC90L3Ri9C80Lgg0L3QvtCy0L7Qs9C+INCx0YPRhNC10YDQsC5cbiAgICBidWZmZXJzW2luZGV4XSA9IHRoaXMuZ2wuY3JlYXRlQnVmZmVyKCkhXG4gICAgdGhpcy5nbC5iaW5kQnVmZmVyKHRoaXMuZ2xbdHlwZV0sIGJ1ZmZlcnNbaW5kZXhdKVxuICAgIHRoaXMuZ2wuYnVmZmVyRGF0YSh0aGlzLmdsW3R5cGVdLCBkYXRhLCB0aGlzLmdsLlNUQVRJQ19EUkFXKVxuXG4gICAgLy8g0KHRh9C10YLRh9C40Log0L/QsNC80Y/RgtC4LCDQt9Cw0L3QuNC80LDQtdC80L7QuSDQsdGD0YTQtdGA0LDQvNC4INC00LDQvdC90YvRhSAo0YDQsNC30LTQtdC70YzQvdC+INC/0L4g0LrQsNC20LTQvtC80YMg0YLQuNC/0YMg0LHRg9GE0LXRgNC+0LIpXG4gICAgdGhpcy5idWZmZXJzLnNpemVJbkJ5dGVzW2tleV0gKz0gZGF0YS5sZW5ndGggKiBkYXRhLkJZVEVTX1BFUl9FTEVNRU5UXG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0VmVydGljZXNPZlBvaW50KHg6IG51bWJlciwgeTogbnVtYmVyLCBjb25zdHM6IGFueVtdKTogU1Bsb3RQb2x5Z29uVmVydGljZXMge1xuICAgIHJldHVybiB7XG4gICAgICB2YWx1ZXM6IFt4LCB5XSxcbiAgICAgIGluZGljZXM6IFswLCAwLCAwXVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDQktGL0YfQuNGB0LvRj9C10YIg0LrQvtC+0YDQtNC40L3QsNGC0Ysg0LLQtdGA0YjQuNC9INC/0L7Qu9C40LPQvtC90LAg0YLRgNC10YPQs9C+0LvRjNC90L7QuSDRhNC+0YDQvNGLLlxuICAgKiDQotC40L8g0YTRg9C90LrRhtC40Lg6IHtAbGluayBTUGxvdENhbGNTaGFwZUZ1bmN9XG4gICAqXG4gICAqIEBwYXJhbSB4IC0g0J/QvtC70L7QttC10L3QuNC1INGG0LXQvdGC0YDQsCDQv9C+0LvQuNCz0L7QvdCwINC90LAg0L7RgdC4INCw0LHRgdGG0LjRgdGBLlxuICAgKiBAcGFyYW0geSAtINCf0L7Qu9C+0LbQtdC90LjQtSDRhtC10L3RgtGA0LAg0L/QvtC70LjQs9C+0L3QsCDQvdCwINC+0YHQuCDQvtGA0LTQuNC90LDRgi5cbiAgICogQHBhcmFtIGNvbnN0cyAtINCd0LDQsdC+0YAg0LLRgdC/0L7QvNC+0LPQsNGC0LXQu9GM0L3Ri9GFINC60L7QvdGB0YLQsNC90YIsINC40YHQv9C+0LvRjNC30YPQtdC80YvRhSDQtNC70Y8g0LLRi9GH0LjRgdC70LXQvdC40Y8g0LLQtdGA0YjQuNC9LlxuICAgKiBAcmV0dXJucyDQlNCw0L3QvdGL0LUg0L4g0LLQtdGA0YjQuNC90LDRhSDQv9C+0LvQuNCz0L7QvdCwLlxuICAgKi9cbiAgcHJvdGVjdGVkIGdldFZlcnRpY2VzT2ZUcmlhbmdsZSh4OiBudW1iZXIsIHk6IG51bWJlciwgY29uc3RzOiBhbnlbXSk6IFNQbG90UG9seWdvblZlcnRpY2VzIHtcblxuICAgIGNvbnN0IFt4MSwgeTFdID0gW3ggLSBjb25zdHNbMF0sIHkgKyBjb25zdHNbMl1dXG4gICAgY29uc3QgW3gyLCB5Ml0gPSBbeCwgeSAtIGNvbnN0c1sxXV1cbiAgICBjb25zdCBbeDMsIHkzXSA9IFt4ICsgY29uc3RzWzBdLCB5ICsgY29uc3RzWzJdXVxuXG4gICAgY29uc3QgdmVydGljZXMgPSB7XG4gICAgICB2YWx1ZXM6IFt4MSwgeTEsIHgyLCB5MiwgeDMsIHkzXSxcbiAgICAgIGluZGljZXM6IFswLCAxLCAyXVxuICAgIH1cblxuICAgIHJldHVybiB2ZXJ0aWNlc1xuICB9XG5cbiAgLyoqXG4gICAqINCS0YvRh9C40YHQu9GP0LXRgiDQutC+0L7RgNC00LjQvdCw0YLRiyDQstC10YDRiNC40L0g0L/QvtC70LjQs9C+0L3QsCDQutCy0LDQtNGA0LDRgtC90L7QuSDRhNC+0YDQvNGLLlxuICAgKiDQotC40L8g0YTRg9C90LrRhtC40Lg6IHtAbGluayBTUGxvdENhbGNTaGFwZUZ1bmN9XG4gICAqXG4gICAqIEBwYXJhbSB4IC0g0J/QvtC70L7QttC10L3QuNC1INGG0LXQvdGC0YDQsCDQv9C+0LvQuNCz0L7QvdCwINC90LAg0L7RgdC4INCw0LHRgdGG0LjRgdGBLlxuICAgKiBAcGFyYW0geSAtINCf0L7Qu9C+0LbQtdC90LjQtSDRhtC10L3RgtGA0LAg0L/QvtC70LjQs9C+0L3QsCDQvdCwINC+0YHQuCDQvtGA0LTQuNC90LDRgi5cbiAgICogQHBhcmFtIGNvbnN0cyAtINCd0LDQsdC+0YAg0LLRgdC/0L7QvNC+0LPQsNGC0LXQu9GM0L3Ri9GFINC60L7QvdGB0YLQsNC90YIsINC40YHQv9C+0LvRjNC30YPQtdC80YvRhSDQtNC70Y8g0LLRi9GH0LjRgdC70LXQvdC40Y8g0LLQtdGA0YjQuNC9LlxuICAgKiBAcmV0dXJucyDQlNCw0L3QvdGL0LUg0L4g0LLQtdGA0YjQuNC90LDRhSDQv9C+0LvQuNCz0L7QvdCwLlxuICAgKi9cbiAgcHJvdGVjdGVkIGdldFZlcnRpY2VzT2ZTcXVhcmUoeDogbnVtYmVyLCB5OiBudW1iZXIsIGNvbnN0czogYW55W10pOiBTUGxvdFBvbHlnb25WZXJ0aWNlcyB7XG5cbiAgICBjb25zdCBbeDEsIHkxXSA9IFt4IC0gY29uc3RzWzBdLCB5IC0gY29uc3RzWzBdXVxuICAgIGNvbnN0IFt4MiwgeTJdID0gW3ggKyBjb25zdHNbMF0sIHkgKyBjb25zdHNbMF1dXG5cbiAgICBjb25zdCB2ZXJ0aWNlcyA9IHtcbiAgICAgIHZhbHVlczogW3gxLCB5MSwgeDIsIHkxLCB4MiwgeTIsIHgxLCB5Ml0sXG4gICAgICBpbmRpY2VzOiBbMCwgMSwgMiwgMCwgMiwgM11cbiAgICB9XG5cbiAgICByZXR1cm4gdmVydGljZXNcbiAgfVxuXG4gIC8qKlxuICAgKiDQktGL0YfQuNGB0LvRj9C10YIg0LrQvtC+0YDQtNC40L3QsNGC0Ysg0LLQtdGA0YjQuNC9INC/0L7Qu9C40LPQvtC90LAg0LrRgNGD0LPQu9C+0Lkg0YTQvtGA0LzRiy5cbiAgICog0KLQuNC/INGE0YPQvdC60YbQuNC4OiB7QGxpbmsgU1Bsb3RDYWxjU2hhcGVGdW5jfVxuICAgKlxuICAgKiBAcGFyYW0geCAtINCf0L7Qu9C+0LbQtdC90LjQtSDRhtC10L3RgtGA0LAg0L/QvtC70LjQs9C+0L3QsCDQvdCwINC+0YHQuCDQsNCx0YHRhtC40YHRgS5cbiAgICogQHBhcmFtIHkgLSDQn9C+0LvQvtC20LXQvdC40LUg0YbQtdC90YLRgNCwINC/0L7Qu9C40LPQvtC90LAg0L3QsCDQvtGB0Lgg0L7RgNC00LjQvdCw0YIuXG4gICAqIEBwYXJhbSBjb25zdHMgLSDQndCw0LHQvtGAINCy0YHQv9C+0LzQvtCz0LDRgtC10LvRjNC90YvRhSDQutC+0L3RgdGC0LDQvdGCLCDQuNGB0L/QvtC70YzQt9GD0LXQvNGL0YUg0LTQu9GPINCy0YvRh9C40YHQu9C10L3QuNGPINCy0LXRgNGI0LjQvS5cbiAgICogQHJldHVybnMg0JTQsNC90L3Ri9C1INC+INCy0LXRgNGI0LjQvdCw0YUg0L/QvtC70LjQs9C+0L3QsC5cbiAgICovXG4gIHByb3RlY3RlZCBnZXRWZXJ0aWNlc09mQ2lyY2xlKHg6IG51bWJlciwgeTogbnVtYmVyLCBjb25zdHM6IGFueVtdKTogU1Bsb3RQb2x5Z29uVmVydGljZXMge1xuXG4gICAgLy8g0JfQsNC90LXRgdC10L3QuNC1INCyINC90LDQsdC+0YAg0LLQtdGA0YjQuNC9INGG0LXQvdGC0YDQsCDQutGA0YPQs9CwLlxuICAgIGNvbnN0IHZlcnRpY2VzOiBTUGxvdFBvbHlnb25WZXJ0aWNlcyA9IHtcbiAgICAgIHZhbHVlczogW3gsIHldLFxuICAgICAgaW5kaWNlczogW11cbiAgICB9XG5cbiAgICAvLyDQlNC+0LHQsNCy0LvQtdC90LjQtSDQsNC/0YDQvtC60YHQuNC80LjRgNGD0Y7RidC40YUg0L7QutGA0YPQttC90L7RgdGC0Ywg0LrRgNGD0LPQsCDQstC10YDRiNC40L0uXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb25zdHNbM10ubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZlcnRpY2VzLnZhbHVlcy5wdXNoKHggKyBjb25zdHNbM11baV0sIHkgKyBjb25zdHNbNF1baV0pXG4gICAgICB2ZXJ0aWNlcy5pbmRpY2VzLnB1c2goMCwgaSArIDEsIGkgKyAyKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqINCf0L7RgdC70LXQtNC90Y/RjyDQstC10YDRiNC40L3QsCDQv9C+0YHQu9C10LTQvdC10LPQviBHTC3RgtGA0LXRg9Cz0L7Qu9GM0L3QuNC60LAg0LfQsNC80LXQvdGP0LXRgtGB0Y8g0L3QsCDQv9C10YDQstGD0Y4g0LDQv9GA0L7QutGB0LjQvNC40YDRg9GO0YnRg9GOXG4gICAgICog0L7QutGA0YPQttC90L7RgdGC0Ywg0LrRgNGD0LPQsCDQstC10YDRiNC40L3Rgywg0LfQsNC80YvQutCw0Y8g0LDQv9GA0L7QutGB0LjQvNC40YDRg9GJ0LjQuSDQutGA0YPQsyDQv9C+0LvQuNCz0L7QvS5cbiAgICAgKi9cbiAgICB2ZXJ0aWNlcy5pbmRpY2VzW3ZlcnRpY2VzLmluZGljZXMubGVuZ3RoIC0gMV0gPSAxXG5cbiAgICByZXR1cm4gdmVydGljZXNcbiAgfVxuXG4gIC8qKlxuICAgKiDQodC+0LfQtNCw0LXRgiDQuCDQtNC+0LHQsNCy0LvRj9C10YIg0LIg0LPRgNGD0L/Qv9GDINC/0L7Qu9C40LPQvtC90L7QsiDQvdC+0LLRi9C5INC/0L7Qu9C40LPQvtC9LlxuICAgKlxuICAgKiBAcGFyYW0gcG9seWdvbkdyb3VwIC0g0JPRgNGD0L/Qv9CwINC/0L7Qu9C40LPQvtC90L7Qsiwg0LIg0LrQvtGC0L7RgNGD0Y4g0L/RgNC+0LjRgdGF0L7QtNC40YIg0LTQvtCx0LDQstC70LXQvdC40LUuXG4gICAqIEBwYXJhbSBwb2x5Z29uIC0g0JjQvdGE0L7RgNC80LDRhtC40Y8g0L4g0LTQvtCx0LDQstC70Y/QtdC80L7QvCDQv9C+0LvQuNCz0L7QvdC1LlxuICAgKi9cbiAgcHJvdGVjdGVkIGFkZFBvbHlnb24ocG9seWdvbkdyb3VwOiBTUGxvdFBvbHlnb25Hcm91cCwgcG9seWdvbjogU1Bsb3RQb2x5Z29uKTogdm9pZCB7XG5cbiAgICAvKipcbiAgICAgKiDQkiDQt9Cw0LLQuNGB0LjQvNC+0YHRgtC4INC+0YIg0YTQvtGA0LzRiyDQv9C+0LvQuNCz0L7QvdCwINC4INC60L7QvtGA0LTQuNC90LDRgiDQtdCz0L4g0YbQtdC90YLRgNCwINCy0YvQt9GL0LLQsNC10YLRgdGPINGB0L7QvtGC0LLQtdGC0YHQstGD0Y7RidCw0Y8g0YTRg9C90LrRhtC40Y8g0L3QsNGF0L7QttC00LXQvdC40Y8g0LrQvtC+0YDQtNC40L3QsNGCINC10LPQvlxuICAgICAqINCy0LXRgNGI0LjQvS5cbiAgICAgKi9cbiAgICBjb25zdCB2ZXJ0aWNlcyA9IHRoaXMuc2hhcGVzW3BvbHlnb24uc2hhcGVdLmNhbGMoXG4gICAgICBwb2x5Z29uLngsIHBvbHlnb24ueSwgdGhpcy5VU0VGVUxfQ09OU1RTXG4gICAgKVxuXG4gICAgLy8g0JrQvtC70LjRh9C10YHRgtCy0L4g0LLQtdGA0YjQuNC9IC0g0Y3RgtC+INC60L7Qu9C40YfQtdGB0YLQstC+INC/0LDRgCDRh9C40YHQtdC7INCyINC80LDRgdGB0LjQstC1INCy0LXRgNGI0LjQvS5cbiAgICBjb25zdCBhbW91bnRPZlZlcnRpY2VzID0gTWF0aC50cnVuYyh2ZXJ0aWNlcy52YWx1ZXMubGVuZ3RoIC8gMilcblxuICAgIC8vINCd0LDRhdC+0LbQtNC10L3QuNC1INC40L3QtNC10LrRgdCwINC/0LXRgNCy0L7QuSDQtNC+0LHQsNCy0LvRj9C10LzQvtC5INCyINCz0YDRg9C/0L/RgyDQv9C+0LvQuNCz0L7QvdC+0LIg0LLQtdGA0YjQuNC90YsuXG4gICAgY29uc3QgaW5kZXhPZkxhc3RWZXJ0ZXggPSBwb2x5Z29uR3JvdXAuYW1vdW50T2ZWZXJ0aWNlc1xuXG4gICAgLyoqXG4gICAgICog0J3QvtC80LXRgNCwINC40L3QtNC10LrRgdC+0LIg0LLQtdGA0YjQuNC9IC0g0L7RgtC90L7RgdC40YLQtdC70YzQvdGL0LUuINCU0LvRjyDQstGL0YfQuNGB0LvQtdC90LjRjyDQsNCx0YHQvtC70Y7RgtC90YvRhSDQuNC90LTQtdC60YHQvtCyINC90LXQvtCx0YXQvtC00LjQvNC+INC/0YDQuNCx0LDQstC40YLRjCDQuiDQvtGC0L3QvtGB0LjRgtC10LvRjNC90YvQvFxuICAgICAqINC40L3QtNC10LrRgdCw0Lwg0LjQvdC00LXQutGBINC/0LXRgNCy0L7QuSDQtNC+0LHQsNCy0LvRj9C10LzQvtC5INCyINCz0YDRg9C/0L/RgyDQv9C+0LvQuNCz0L7QvdC+0LIg0LLQtdGA0YjQuNC90YsuXG4gICAgICovXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2ZXJ0aWNlcy5pbmRpY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2ZXJ0aWNlcy5pbmRpY2VzW2ldICs9IGluZGV4T2ZMYXN0VmVydGV4XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog0JTQvtCx0LDQstC70LXQvdC40LUg0LIg0LPRgNGD0L/Qv9GDINC/0L7Qu9C40LPQvtC90L7QsiDQuNC90LTQtdC60YHQvtCyINCy0LXRgNGI0LjQvSDQvdC+0LLQvtCz0L4g0L/QvtC70LjQs9C+0L3QsCDQuCDQv9C+0LTRgdGH0LXRgiDQvtCx0YnQtdCz0L4g0LrQvtC70LjRh9C10YHRgtCy0LAg0LLQtdGA0YjQuNC9IEdMLdGC0YDQtdGD0LPQvtC70YzQvdC40LrQvtCyXG4gICAgICog0LIg0LPRgNGD0L/Qv9C1LlxuICAgICAqL1xuICAgIHBvbHlnb25Hcm91cC5pbmRpY2VzLnB1c2goLi4udmVydGljZXMuaW5kaWNlcylcbiAgICBwb2x5Z29uR3JvdXAuYW1vdW50T2ZHTFZlcnRpY2VzICs9IHZlcnRpY2VzLmluZGljZXMubGVuZ3RoXG5cbiAgICAvLyDQlNC+0LHQsNCy0LvQtdC90LjQtSDQsiDQs9GA0YPQv9C/0YMg0L/QvtC70LjQs9C+0L3QvtCyINCy0LXRgNGI0LjQvSDQvdC+0LLQvtCz0L4g0L/QvtC70LjQs9C+0L3QsCDQuCDQv9C+0LTRgdGH0LXRgiDQvtCx0YnQtdCz0L4g0LrQvtC70LjRh9C10YHRgtCy0LAg0LLQtdGA0YjQuNC9INCyINCz0YDRg9C/0L/QtS5cbiAgICBwb2x5Z29uR3JvdXAudmVydGljZXMucHVzaCguLi52ZXJ0aWNlcy52YWx1ZXMpXG4gICAgcG9seWdvbkdyb3VwLmFtb3VudE9mVmVydGljZXMgKz0gYW1vdW50T2ZWZXJ0aWNlc1xuXG4gICAgLy8g0JTQvtCx0LDQstC70LXQvdC40LUg0YbQstC10YLQvtCyINCy0LXRgNGI0LjQvSAtINC/0L4g0L7QtNC90L7QvNGDINGG0LLQtdGC0YMg0L3QsCDQutCw0LbQtNGD0Y4g0LLQtdGA0YjQuNC90YMuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhbW91bnRPZlZlcnRpY2VzOyBpKyspIHtcbiAgICAgIHBvbHlnb25Hcm91cC5jb2xvcnMucHVzaChwb2x5Z29uLmNvbG9yKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDQktGL0LLQvtC00LjRgiDQsdCw0LfQvtCy0YPRjiDRh9Cw0YHRgtGMINC+0YLQu9Cw0LTQvtGH0L3QvtC5INC40L3RhNC+0YDQvNCw0YbQuNC4LlxuICAgKlxuICAgKiBAcGFyYW0gb3B0aW9ucyAtINCf0L7Qu9GM0LfQvtCy0LDRgtC10LvRjNGB0LrQuNC1INC90LDRgdGC0YDQvtC50LrQuCDRjdC60LfQtdC80L/Qu9GP0YDQsC5cbiAgICovXG4gIHByb3RlY3RlZCByZXBvcnRNYWluSW5mbyhvcHRpb25zOiBTUGxvdE9wdGlvbnMpOiB2b2lkIHtcblxuICAgIGNvbnNvbGUubG9nKCclY9CS0LrQu9GO0YfQtdC9INGA0LXQttC40Lwg0L7RgtC70LDQtNC60LggJyArIHRoaXMuY29uc3RydWN0b3IubmFtZSArICcg0L3QsCDQvtCx0YrQtdC60YLQtSBbIycgKyB0aGlzLmNhbnZhcy5pZCArICddJyxcbiAgICAgIHRoaXMuZGVidWdNb2RlLmhlYWRlclN0eWxlKVxuXG4gICAgaWYgKHRoaXMuZGVtb01vZGUuaXNFbmFibGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKCclY9CS0LrQu9GO0YfQtdC9INC00LXQvNC+0L3RgdGC0YDQsNGG0LjQvtC90L3Ri9C5INGA0LXQttC40Lwg0LTQsNC90L3Ri9GFJywgdGhpcy5kZWJ1Z01vZGUuZ3JvdXBTdHlsZSlcbiAgICB9XG5cbiAgICBjb25zb2xlLmdyb3VwKCclY9Cf0YDQtdC00YPQv9GA0LXQttC00LXQvdC40LUnLCB0aGlzLmRlYnVnTW9kZS5ncm91cFN0eWxlKVxuICAgIHtcbiAgICAgIGNvbnNvbGUuZGlyKCfQntGC0LrRgNGL0YLQsNGPINC60L7QvdGB0L7Qu9GMINCx0YDQsNGD0LfQtdGA0LAg0Lgg0LTRgNGD0LPQuNC1INCw0LrRgtC40LLQvdGL0LUg0YHRgNC10LTRgdGC0LLQsCDQutC+0L3RgtGA0L7Qu9GPINGA0LDQt9GA0LDQsdC+0YLQutC4INGB0YPRidC10YHRgtCy0LXQvdC90L4g0YHQvdC40LbQsNGO0YIg0L/RgNC+0LjQt9Cy0L7QtNC40YLQtdC70YzQvdC+0YHRgtGMINCy0YvRgdC+0LrQvtC90LDQs9GA0YPQttC10L3QvdGL0YUg0L/RgNC40LvQvtC20LXQvdC40LkuINCU0LvRjyDQvtCx0YrQtdC60YLQuNCy0L3QvtCz0L4g0LDQvdCw0LvQuNC30LAg0L/RgNC+0LjQt9Cy0L7QtNC40YLQtdC70YzQvdC+0YHRgtC4INCy0YHQtSDQv9C+0LTQvtCx0L3Ri9C1INGB0YDQtdC00YHRgtCy0LAg0LTQvtC70LbQvdGLINCx0YvRgtGMINC+0YLQutC70Y7Rh9C10L3Riywg0LAg0LrQvtC90YHQvtC70Ywg0LHRgNCw0YPQt9C10YDQsCDQt9Cw0LrRgNGL0YLQsC4g0J3QtdC60L7RgtC+0YDRi9C1INC00LDQvdC90YvQtSDQvtGC0LvQsNC00L7Rh9C90L7QuSDQuNC90YTQvtGA0LzQsNGG0LjQuCDQsiDQt9Cw0LLQuNGB0LjQvNC+0YHRgtC4INC+0YIg0LjRgdC/0L7Qu9GM0LfRg9C10LzQvtCz0L4g0LHRgNCw0YPQt9C10YDQsCDQvNC+0LPRg9GCINC90LUg0L7RgtC+0LHRgNCw0LbQsNGC0YzRgdGPINC40LvQuCDQvtGC0L7QsdGA0LDQttCw0YLRjNGB0Y8g0L3QtdC60L7RgNGA0LXQutGC0L3Qvi4g0KHRgNC10LTRgdGC0LLQviDQvtGC0LvQsNC00LrQuCDQv9GA0L7RgtC10YHRgtC40YDQvtCy0LDQvdC+INCyINCx0YDQsNGD0LfQtdGA0LUgR29vZ2xlIENocm9tZSB2LjkwJylcbiAgICB9XG4gICAgY29uc29sZS5ncm91cEVuZCgpXG5cbiAgICBjb25zb2xlLmdyb3VwKCclY9CS0LjQtNC10L7RgdC40YHRgtC10LzQsCcsIHRoaXMuZGVidWdNb2RlLmdyb3VwU3R5bGUpXG4gICAge1xuICAgICAgbGV0IGV4dCA9IHRoaXMuZ2wuZ2V0RXh0ZW5zaW9uKCdXRUJHTF9kZWJ1Z19yZW5kZXJlcl9pbmZvJylcbiAgICAgIGxldCBncmFwaGljc0NhcmROYW1lID0gKGV4dCkgPyB0aGlzLmdsLmdldFBhcmFtZXRlcihleHQuVU5NQVNLRURfUkVOREVSRVJfV0VCR0wpIDogJ1vQvdC10LjQt9Cy0LXRgdGC0L3Qvl0nXG4gICAgICBjb25zb2xlLmxvZygn0JPRgNCw0YTQuNGH0LXRgdC60LDRjyDQutCw0YDRgtCwOiAnICsgZ3JhcGhpY3NDYXJkTmFtZSlcbiAgICAgIGNvbnNvbGUubG9nKCfQktC10YDRgdC40Y8gR0w6ICcgKyB0aGlzLmdsLmdldFBhcmFtZXRlcih0aGlzLmdsLlZFUlNJT04pKVxuICAgIH1cbiAgICBjb25zb2xlLmdyb3VwRW5kKClcblxuICAgIGNvbnNvbGUuZ3JvdXAoJyVj0J3QsNGB0YLRgNC+0LnQutCwINC/0LDRgNCw0LzQtdGC0YDQvtCyINGN0LrQt9C10LzQv9C70Y/RgNCwJywgdGhpcy5kZWJ1Z01vZGUuZ3JvdXBTdHlsZSlcbiAgICB7XG4gICAgICBjb25zb2xlLmRpcih0aGlzKVxuICAgICAgY29uc29sZS5sb2coJ9Cf0L7Qu9GM0LfQvtCy0LDRgtC10LvRjNGB0LrQuNC1INC90LDRgdGC0YDQvtC50LrQuDpcXG4nLCBqc29uU3RyaW5naWZ5KG9wdGlvbnMpKVxuICAgICAgY29uc29sZS5sb2coJ9Ca0LDQvdCy0LDRgTogIycgKyB0aGlzLmNhbnZhcy5pZClcbiAgICAgIGNvbnNvbGUubG9nKCfQoNCw0LfQvNC10YAg0LrQsNC90LLQsNGB0LA6ICcgKyB0aGlzLmNhbnZhcy53aWR0aCArICcgeCAnICsgdGhpcy5jYW52YXMuaGVpZ2h0ICsgJyBweCcpXG4gICAgICBjb25zb2xlLmxvZygn0KDQsNC30LzQtdGAINC/0LvQvtGB0LrQvtGB0YLQuDogJyArIHRoaXMuZ3JpZFNpemUud2lkdGggKyAnIHggJyArIHRoaXMuZ3JpZFNpemUuaGVpZ2h0ICsgJyBweCcpXG4gICAgICBjb25zb2xlLmxvZygn0KDQsNC30LzQtdGAINC/0L7Qu9C40LPQvtC90LA6ICcgKyB0aGlzLnBvbHlnb25TaXplICsgJyBweCcpXG4gICAgICBjb25zb2xlLmxvZygn0JDQv9GA0L7QutGB0LjQvNCw0YbQuNGPINC+0LrRgNGD0LbQvdC+0YHRgtC4OiAnICsgdGhpcy5jaXJjbGVBcHByb3hMZXZlbCArICcg0YPQs9C70L7QsicpXG5cbiAgICAgIC8qKlxuICAgICAgICogQHRvZG8g0J7QsdGA0LDQsdC+0YLQsNGC0Ywg0Y3RgtC+0YIg0LLRi9Cy0L7QtCDQsiDQt9Cw0LLQuNGB0LjQvNC+0YHRgtC4INC+0YIg0YHQv9C+0YHQvtCx0LAg0L/QvtC70YPRh9C10L3QuNGPINC00LDQvdC90YvRhSDQviDQv9C+0LvQuNCz0L7QvdCw0YUuINCS0LLQtdGB0YLQuCDRgtC40L/RiyAtINC30LDQtNCw0L3QvdCw0Y9cbiAgICAgICAqINGE0YPQvdC60YbQuNGPINC40YLQtdGA0LjRgNC+0LLQsNC90LjRjywg0LTQtdC80L4t0LjRgtC10YDQuNGA0L7QstCw0L3QuNC1LCDQv9C10YDQtdC00LDQvdC90YvQuSDQvNCw0YHRgdC40LIg0LTQsNC90L3Ri9GFLlxuICAgICAgICovXG4gICAgICBpZiAodGhpcy5kZW1vTW9kZS5pc0VuYWJsZSkge1xuICAgICAgICBjb25zb2xlLmxvZygn0KHQv9C+0YHQvtCxINC/0L7Qu9GD0YfQtdC90LjRjyDQtNCw0L3QvdGL0YU6ICcgKyAn0LTQtdC80L7QvdGB0YLRgNCw0YbQuNC+0L3QvdCw0Y8g0YTRg9C90LrRhtC40Y8g0LjRgtC10YDQuNGA0L7QstCw0L3QuNGPJylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCfQodC/0L7RgdC+0LEg0L/QvtC70YPRh9C10L3QuNGPINC00LDQvdC90YvRhTogJyArICfQv9C+0LvRjNC30L7QstCw0YLQtdC70YzRgdC60LDRjyDRhNGD0L3QutGG0LjRjyDQuNGC0LXRgNC40YDQvtCy0LDQvdC40Y8nKVxuICAgICAgfVxuICAgIH1cbiAgICBjb25zb2xlLmdyb3VwRW5kKClcbiAgfVxuXG4gIC8qKlxuICAgKiDQktGL0LLQvtC00LjRgiDQsiDQutC+0L3RgdC+0LvRjCDQvtGC0LvQsNC00L7Rh9C90YPRjiDQuNC90YTQvtGA0LzQsNGG0LjRjiDQviDQt9Cw0LPRgNGD0LfQutC1INC00LDQvdC90YvRhSDQsiDQstC40LTQtdC+0L/QsNC80Y/RgtGMLlxuICAgKi9cbiAgcHJvdGVjdGVkIHJlcG9ydEFib3V0T2JqZWN0UmVhZGluZygpOiB2b2lkIHtcblxuICAgIGNvbnNvbGUuZ3JvdXAoJyVj0JfQsNCz0YDRg9C30LrQsCDQtNCw0L3QvdGL0YUg0LfQsNCy0LXRgNGI0LXQvdCwIFsnICsgZ2V0Q3VycmVudFRpbWUoKSArICddJywgdGhpcy5kZWJ1Z01vZGUuZ3JvdXBTdHlsZSlcbiAgICB7XG4gICAgICBjb25zb2xlLnRpbWVFbmQoJ9CU0LvQuNGC0LXQu9GM0L3QvtGB0YLRjCcpXG5cbiAgICAgIGNvbnNvbGUubG9nKCfQoNC10LfRg9C70YzRgtCw0YI6ICcgK1xuICAgICAgICAoKHRoaXMuYW1vdW50T2ZQb2x5Z29ucyA+PSB0aGlzLm1heEFtb3VudE9mUG9seWdvbnMpID8gJ9C00L7RgdGC0LjQs9C90YPRgiDQt9Cw0LTQsNC90L3Ri9C5INC70LjQvNC40YIgKCcgK1xuICAgICAgICAgIHRoaXMubWF4QW1vdW50T2ZQb2x5Z29ucy50b0xvY2FsZVN0cmluZygpICsgJyknIDogJ9C+0LHRgNCw0LHQvtGC0LDQvdGLINCy0YHQtSDQvtCx0YrQtdC60YLRiycpKVxuXG4gICAgICBjb25zb2xlLmdyb3VwKCfQmtC+0Lst0LLQviDQvtCx0YrQtdC60YLQvtCyOiAnICsgdGhpcy5hbW91bnRPZlBvbHlnb25zLnRvTG9jYWxlU3RyaW5nKCkpXG4gICAgICB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zaGFwZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBjb25zdCBzaGFwZUNhcGN0aW9uID0gdGhpcy5zaGFwZXNbaV0ubmFtZVxuICAgICAgICAgIGNvbnN0IHNoYXBlQW1vdW50ID0gdGhpcy5idWZmZXJzLmFtb3VudE9mU2hhcGVzW2ldXG4gICAgICAgICAgY29uc29sZS5sb2coc2hhcGVDYXBjdGlvbiArICc6ICcgKyBzaGFwZUFtb3VudC50b0xvY2FsZVN0cmluZygpICtcbiAgICAgICAgICAgICcgW34nICsgTWF0aC5yb3VuZCgxMDAgKiBzaGFwZUFtb3VudCAvIHRoaXMuYW1vdW50T2ZQb2x5Z29ucykgKyAnJV0nKVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc29sZS5sb2coJ9Ca0L7Quy3QstC+INGG0LLQtdGC0L7QsiDQsiDQv9Cw0LvQuNGC0YDQtTogJyArIHRoaXMucG9seWdvblBhbGV0dGUubGVuZ3RoKVxuICAgICAgfVxuICAgICAgY29uc29sZS5ncm91cEVuZCgpXG5cbiAgICAgIGxldCBieXRlc1VzZWRCeUJ1ZmZlcnMgPSB0aGlzLmJ1ZmZlcnMuc2l6ZUluQnl0ZXNbMF0gKyB0aGlzLmJ1ZmZlcnMuc2l6ZUluQnl0ZXNbMV0gKyB0aGlzLmJ1ZmZlcnMuc2l6ZUluQnl0ZXNbMl1cblxuICAgICAgY29uc29sZS5ncm91cCgn0JfQsNC90Y/RgtC+INCy0LjQtNC10L7Qv9Cw0LzRj9GC0Lg6ICcgKyAoYnl0ZXNVc2VkQnlCdWZmZXJzIC8gMTAwMDAwMCkudG9GaXhlZCgyKS50b0xvY2FsZVN0cmluZygpICsgJyDQnNCRJylcbiAgICAgIHtcbiAgICAgICAgY29uc29sZS5sb2coJ9CR0YPRhNC10YDRiyDQstC10YDRiNC40L06ICcgK1xuICAgICAgICAgICh0aGlzLmJ1ZmZlcnMuc2l6ZUluQnl0ZXNbMF0gLyAxMDAwMDAwKS50b0ZpeGVkKDIpLnRvTG9jYWxlU3RyaW5nKCkgKyAnINCc0JEnICtcbiAgICAgICAgICAnIFt+JyArIE1hdGgucm91bmQoMTAwICogdGhpcy5idWZmZXJzLnNpemVJbkJ5dGVzWzBdIC8gYnl0ZXNVc2VkQnlCdWZmZXJzKSArICclXScpXG5cbiAgICAgICAgY29uc29sZS5sb2coJ9CR0YPRhNC10YDRiyDRhtCy0LXRgtC+0LI6ICdcbiAgICAgICAgICArICh0aGlzLmJ1ZmZlcnMuc2l6ZUluQnl0ZXNbMV0gLyAxMDAwMDAwKS50b0ZpeGVkKDIpLnRvTG9jYWxlU3RyaW5nKCkgKyAnINCc0JEnICtcbiAgICAgICAgICAnIFt+JyArIE1hdGgucm91bmQoMTAwICogdGhpcy5idWZmZXJzLnNpemVJbkJ5dGVzWzFdIC8gYnl0ZXNVc2VkQnlCdWZmZXJzKSArICclXScpXG5cbiAgICAgICAgY29uc29sZS5sb2coJ9CR0YPRhNC10YDRiyDQuNC90LTQtdC60YHQvtCyOiAnXG4gICAgICAgICAgKyAodGhpcy5idWZmZXJzLnNpemVJbkJ5dGVzWzJdIC8gMTAwMDAwMCkudG9GaXhlZCgyKS50b0xvY2FsZVN0cmluZygpICsgJyDQnNCRJyArXG4gICAgICAgICAgJyBbficgKyBNYXRoLnJvdW5kKDEwMCAqIHRoaXMuYnVmZmVycy5zaXplSW5CeXRlc1syXSAvIGJ5dGVzVXNlZEJ5QnVmZmVycykgKyAnJV0nKVxuICAgICAgfVxuICAgICAgY29uc29sZS5ncm91cEVuZCgpXG5cbiAgICAgIGNvbnNvbGUubG9nKCfQmtC+0Lst0LLQviDQs9GA0YPQv9C/INCx0YPRhNC10YDQvtCyOiAnICsgdGhpcy5idWZmZXJzLmFtb3VudE9mQnVmZmVyR3JvdXBzLnRvTG9jYWxlU3RyaW5nKCkpXG4gICAgICBjb25zb2xlLmxvZygn0JrQvtC7LdCy0L4gR0wt0YLRgNC10YPQs9C+0LvRjNC90LjQutC+0LI6ICcgKyAodGhpcy5idWZmZXJzLmFtb3VudE9mVG90YWxHTFZlcnRpY2VzIC8gMykudG9Mb2NhbGVTdHJpbmcoKSlcbiAgICAgIGNvbnNvbGUubG9nKCfQmtC+0Lst0LLQviDQstC10YDRiNC40L06ICcgKyB0aGlzLmJ1ZmZlcnMuYW1vdW50T2ZUb3RhbFZlcnRpY2VzLnRvTG9jYWxlU3RyaW5nKCkpXG4gICAgfVxuICAgIGNvbnNvbGUuZ3JvdXBFbmQoKVxuICB9XG5cbiAgLyoqXG4gICAqINCh0L7Qt9C00LDQtdGCINC00L7Qv9C+0LvQvdC10L3QuNC1INC6INC60L7QtNGDINC90LAg0Y/Qt9GL0LrQtSBHTFNMLlxuICAgKlxuICAgKiBAcmVtYXJrc1xuICAgKiDQkiDQtNCw0LvRjNC90LXQudGI0LXQvCDRgdC+0LfQtNCw0L3QvdGL0Lkg0LrQvtC0INCx0YPQtNC10YIg0LLRgdGC0YDQvtC10L0g0LIg0LrQvtC0INCy0LXRgNGI0LjQvdC90L7Qs9C+INGI0LXQudC00LXRgNCwINC00LvRjyDQt9Cw0LTQsNC90LjRjyDRhtCy0LXRgtCwINCy0LXRgNGI0LjQvdGLINCyINC30LDQstC40YHQuNC80L7RgdGC0Lgg0L7RglxuICAgKiDQuNC90LTQtdC60YHQsCDRhtCy0LXRgtCwLCDQv9GA0LjRgdCy0L7QtdC90L3QvtCz0L4g0Y3RgtC+0Lkg0LLQtdGA0YjQuNC90LUuINCiLtC6LiDRiNC10LnQtNC10YAg0L3QtSDQv9C+0LfQstC+0LvRj9C10YIg0LjRgdC/0L7Qu9GM0LfQvtCy0LDRgtGMINCyINC60LDRh9C10YHRgtCy0LUg0LjQvdC00LXQutGB0L7QsiDQv9C10YDQtdC80LXQvdC90YvQtSAtXG4gICAqINC00LvRjyDQt9Cw0LTQsNC90LjRjyDRhtCy0LXRgtCwINC40YHQv9C+0LvRjNC30YPQtdGC0YHRjyDQv9C10YDQtdCx0L7RgCDRhtCy0LXRgtC+0LLRi9GFINC40L3QtNC10LrRgdC+0LIuXG4gICAqXG4gICAqIEByZXR1cm5zINCa0L7QtCDQvdCwINGP0LfRi9C60LUgR0xTTC5cbiAgICovXG4gIHByb3RlY3RlZCBnZW5TaGFkZXJDb2xvckNvZGUoKTogc3RyaW5nIHtcblxuICAgIC8vINCS0YDQtdC80LXQvdC90L7QtSDQtNC+0LHQsNCy0LvQtdC90LjQtSDQsiDQv9Cw0LvQuNGC0YDRgyDRhtCy0LXRgtC+0LIg0LLQtdGA0YjQuNC9INGG0LLQtdGC0LAg0L3QsNC/0YDQsNCy0LvRj9GO0YnQuNGFLlxuICAgIHRoaXMucG9seWdvblBhbGV0dGUucHVzaCh0aGlzLnJ1bGVzQ29sb3IpXG5cbiAgICBsZXQgY29kZTogc3RyaW5nID0gJydcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wb2x5Z29uUGFsZXR0ZS5sZW5ndGg7IGkrKykge1xuXG4gICAgICAvLyDQn9C+0LvRg9GH0LXQvdC40LUg0YbQstC10YLQsCDQsiDQvdGD0LbQvdC+0Lwg0YTQvtGA0LzQsNGC0LUuXG4gICAgICBsZXQgW3IsIGcsIGJdID0gY29sb3JGcm9tSGV4VG9HbFJnYih0aGlzLnBvbHlnb25QYWxldHRlW2ldKVxuXG4gICAgICAvLyDQpNC+0YDQvNC40YDQvtCy0L3QuNC1INGB0YLRgNC+0LogR0xTTC3QutC+0LTQsCDQv9GA0L7QstC10YDQutC4INC40L3QtNC10LrRgdCwINGG0LLQtdGC0LAuXG4gICAgICBjb2RlICs9ICgoaSA9PT0gMCkgPyAnJyA6ICcgIGVsc2UgJykgKyAnaWYgKGFfY29sb3IgPT0gJyArIGkgKyAnLjApIHZfY29sb3IgPSB2ZWMzKCcgK1xuICAgICAgICByLnRvU3RyaW5nKCkuc2xpY2UoMCwgOSkgKyAnLCcgK1xuICAgICAgICBnLnRvU3RyaW5nKCkuc2xpY2UoMCwgOSkgKyAnLCcgK1xuICAgICAgICBiLnRvU3RyaW5nKCkuc2xpY2UoMCwgOSkgKyAnKTtcXG4nXG4gICAgfVxuXG4gICAgLy8g0KPQtNCw0LvQtdC90LjQtSDQuNC3INC/0LDQu9C40YLRgNGLINCy0LXRgNGI0LjQvSDQstGA0LXQvNC10L3QvdC+INC00L7QsdCw0LLQu9C10L3QvdC+0LPQviDRhtCy0LXRgtCwINC90LDQv9GA0LDQstC70Y/RjtGJ0LjRhS5cbiAgICB0aGlzLnBvbHlnb25QYWxldHRlLnBvcCgpXG5cbiAgICByZXR1cm4gY29kZVxuICB9XG5cbi8qKlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuICBwcm90ZWN0ZWQgbWFrZUNhbWVyYU1hdHJpeCgpIHtcblxuICAgIGNvbnN0IHpvb21TY2FsZSA9IDEgLyB0aGlzLmNhbWVyYS56b29tITtcblxuICAgIGxldCBjYW1lcmFNYXQgPSBtMy5pZGVudGl0eSgpO1xuICAgIGNhbWVyYU1hdCA9IG0zLnRyYW5zbGF0ZShjYW1lcmFNYXQsIHRoaXMuY2FtZXJhLngsIHRoaXMuY2FtZXJhLnkpO1xuICAgIGNhbWVyYU1hdCA9IG0zLnNjYWxlKGNhbWVyYU1hdCwgem9vbVNjYWxlLCB6b29tU2NhbGUpO1xuXG4gICAgcmV0dXJuIGNhbWVyYU1hdDtcbiAgfVxuXG4gIC8qKlxuICAgKiDQntCx0L3QvtCy0LvRj9C10YIg0LzQsNGC0YDQuNGG0YMg0YLRgNCw0L3RgdGE0L7RgNC80LDRhtC40LguXG4gICAqXG4gICAqIEByZW1hcmtzXG4gICAqINCh0YPRidC10YHRgtCy0YPQtdGCINC00LLQsCDQstCw0YDQuNCw0L3RgtCwINCy0YvQt9C+0LLQsCDQvNC10YLQvtC00LAgLSDQuNC3INC00YDRg9Cz0L7Qs9C+INC80LXRgtC+0LTQsCDRjdC60LfQtdC80L/Qu9GP0YDQsCAoe0BsaW5rIHJlbmRlcn0pINC4INC40Lcg0L7QsdGA0LDQsdC+0YLRh9C40LrQsCDRgdC+0LHRi9GC0LjRjyDQvNGL0YjQuFxuICAgKiAoe0BsaW5rIGhhbmRsZU1vdXNlV2hlZWx9KS4g0JLQviDQstGC0L7RgNC+0Lwg0LLQsNGA0LjQsNC90YLQtSDQuNGB0L/QvtC70YzQt9C+0LLQsNC90LjQtSDQvtCx0YrQtdC60YLQsCB0aGlzINC90LXQstC+0LfQvNC+0LbQvdC+LiDQlNC70Y8g0YPQvdC40LLQtdGA0YHQsNC70YzQvdC+0YHRgtC4INCy0YvQt9C+0LLQsFxuICAgKiDQvNC10YLQvtC00LAgLSDQsiDQvdC10LPQviDQstGB0LXQs9C00LAg0Y/QstC90L4g0L3QtdC+0LHRhdC+0LTQuNC80L4g0L/QtdGA0LXQtNCw0LLQsNGC0Ywg0YHRgdGL0LvQutGDINC90LAg0Y3QutC30LXQvNC/0LvRj9GAINC60LvQsNGB0YHQsC5cbiAgICovXG4gIHByb3RlY3RlZCB1cGRhdGVWaWV3UHJvamVjdGlvbigpOiB2b2lkIHtcblxuICAgIGNvbnN0IHByb2plY3Rpb25NYXQgPSBtMy5wcm9qZWN0aW9uKHRoaXMuZ2wuY2FudmFzLndpZHRoLCB0aGlzLmdsLmNhbnZhcy5oZWlnaHQpO1xuICAgIGNvbnN0IGNhbWVyYU1hdCA9IHRoaXMubWFrZUNhbWVyYU1hdHJpeCgpO1xuICAgIGxldCB2aWV3TWF0ID0gbTMuaW52ZXJzZShjYW1lcmFNYXQpO1xuICAgIHRoaXMudHJhbnNmb3JtLnZpZXdQcm9qZWN0aW9uTWF0ID0gbTMubXVsdGlwbHkocHJvamVjdGlvbk1hdCwgdmlld01hdCk7XG4gIH1cblxuICAvKipcbiAgICpcbiAgICovXG4gIHByb3RlY3RlZCBnZXRDbGlwU3BhY2VNb3VzZVBvc2l0aW9uKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG5cbiAgICAvLyBnZXQgY2FudmFzIHJlbGF0aXZlIGNzcyBwb3NpdGlvblxuICAgIGNvbnN0IHJlY3QgPSB0aGlzLmNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBjc3NYID0gZXZlbnQuY2xpZW50WCAtIHJlY3QubGVmdDtcbiAgICBjb25zdCBjc3NZID0gZXZlbnQuY2xpZW50WSAtIHJlY3QudG9wO1xuXG4gICAgLy8gZ2V0IG5vcm1hbGl6ZWQgMCB0byAxIHBvc2l0aW9uIGFjcm9zcyBhbmQgZG93biBjYW52YXNcbiAgICBjb25zdCBub3JtYWxpemVkWCA9IGNzc1ggLyB0aGlzLmNhbnZhcy5jbGllbnRXaWR0aDtcbiAgICBjb25zdCBub3JtYWxpemVkWSA9IGNzc1kgLyB0aGlzLmNhbnZhcy5jbGllbnRIZWlnaHQ7XG5cbiAgICAvLyBjb252ZXJ0IHRvIGNsaXAgc3BhY2VcbiAgICBjb25zdCBjbGlwWCA9IG5vcm1hbGl6ZWRYICogMiAtIDE7XG4gICAgY29uc3QgY2xpcFkgPSBub3JtYWxpemVkWSAqIC0yICsgMTtcblxuICAgIHJldHVybiBbY2xpcFgsIGNsaXBZXTtcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKi9cbiAgcHJvdGVjdGVkIG1vdmVDYW1lcmEoZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcblxuICAgIGNvbnN0IHBvcyA9IG0zLnRyYW5zZm9ybVBvaW50KFxuICAgICAgdGhpcy50cmFuc2Zvcm0uc3RhcnRJbnZWaWV3UHJvak1hdCxcbiAgICAgIHRoaXMuZ2V0Q2xpcFNwYWNlTW91c2VQb3NpdGlvbihldmVudClcbiAgICApO1xuXG4gICAgdGhpcy5jYW1lcmEueCA9XG4gICAgICB0aGlzLnRyYW5zZm9ybS5zdGFydENhbWVyYS54ISArIHRoaXMudHJhbnNmb3JtLnN0YXJ0UG9zWzBdIC0gcG9zWzBdO1xuXG4gICAgdGhpcy5jYW1lcmEueSA9XG4gICAgICB0aGlzLnRyYW5zZm9ybS5zdGFydENhbWVyYS55ISArIHRoaXMudHJhbnNmb3JtLnN0YXJ0UG9zWzFdIC0gcG9zWzFdO1xuXG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDQoNC10LDQs9C40YDRg9C10YIg0L3QsCDQtNCy0LjQttC10L3QuNC1INC80YvRiNC4L9GC0YDQtdC60L/QsNC00LAg0LIg0LzQvtC80LXQvdGCLCDQutC+0LPQtNCwINC10LUv0LXQs9C+INC60LvQsNCy0LjRiNCwINGD0LTQtdGA0LbQuNCy0LDQtdGC0YHRjyDQvdCw0LbQsNGC0L7QuS5cbiAgICpcbiAgICogQHJlbWVya3NcbiAgICog0JzQtdGC0L7QtCDQv9C10YDQtdC80LXRidCw0LXRgiDQvtCx0LvQsNGB0YLRjCDQstC40LTQuNC80L7RgdGC0Lgg0L3QsCDQv9C70L7RgdC60L7RgdGC0Lgg0LLQvNC10YHRgtC1INGBINC00LLQuNC20LXQvdC40LXQvCDQvNGL0YjQuC/RgtGA0LXQutC/0LDQtNCwLiDQktGL0YfQuNGB0LvQtdC90LjRjyDQstC90YPRgtGA0Lgg0YHQvtCx0YvRgtC40Y8g0YHQtNC10LvQsNC90YtcbiAgICog0LzQsNC60YHQuNC80LDQu9GM0L3QviDQv9GA0L7QuNC30LLQvtC00LjRgtC10LvRjNC90YvQvNC4INCyINGD0YnQtdGA0LEg0YfQuNGC0LDQsdC10LvRjNC90L7RgdGC0Lgg0LvQvtCz0LjQutC4INC00LXQudGB0YLQstC40LkuINCS0L4g0LLQvdC10YjQvdC10Lwg0L7QsdGA0LDQsdC+0YLRh9C40LrQtSDRgdC+0LHRi9GC0LjQuSDQvtCx0YrQtdC60YIgdGhpc1xuICAgKiDQvdC10LTQvtGB0YLRg9C/0LXQvSDQv9C+0Y3RgtC+0LzRgyDQtNC+0YHRgtGD0L8g0Log0Y3QutC30LXQvNC/0LvRj9GA0YMg0LrQu9Cw0YHRgdCwINGA0LXQsNC70LjQt9GD0LXRgtGB0Y8g0YfQtdGA0LXQtyDRgdGC0LDRgtC40YfQtdGB0LrQuNC5INC80LDRgdGB0LjQsiDQstGB0LXRhSDRgdC+0LfQtNCw0L3QvdGL0YUg0Y3QutC30LXQvNC/0LvRj9GA0L7QslxuICAgKiDQutC70LDRgdGB0LAg0Lgg0LjQtNC10L3RgtC40YTQuNC60LDRgtC+0YDQsCDQutCw0L3QstCw0YHQsCwg0LLRi9GB0YLRg9C/0LDRjtGJ0LXQs9C+INC40L3QtNC10LrRgdC+0Lwg0LIg0Y3RgtC+0Lwg0LzQsNGB0YHQuNCy0LUuXG4gICAqXG4gICAqIEBwYXJhbSBldmVudCAtINCh0L7QsdGL0YLQuNC1INC80YvRiNC4L9GC0YDQtdC60L/QsNC00LAuXG4gICAqL1xuICBwcm90ZWN0ZWQgaGFuZGxlTW91c2VNb3ZlKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG4gICAgdGhpcy5tb3ZlQ2FtZXJhLmNhbGwodGhpcywgZXZlbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqINCg0LXQsNCz0LjRgNGD0LXRgiDQvdCwINC+0YLQttCw0YLQuNC1INC60LvQsNCy0LjRiNC4INC80YvRiNC4L9GC0YDQtdC60L/QsNC00LAuXG4gICAqXG4gICAqIEByZW1lcmtzXG4gICAqINCSINC80L7QvNC10L3RgiDQvtGC0LbQsNGC0LjRjyDQutC70LDQstC40YjQuCDQsNC90LDQu9C40Lcg0LTQstC40LbQtdC90LjRjyDQvNGL0YjQuC/RgtGA0LXQutC/0LDQtNCwINGBINC30LDQttCw0YLQvtC5INC60LvQsNCy0LjRiNC10Lkg0L/RgNC10LrRgNCw0YnQsNC10YLRgdGPLiDQktGL0YfQuNGB0LvQtdC90LjRjyDQstC90YPRgtGA0Lgg0YHQvtCx0YvRgtC40Y9cbiAgICog0YHQtNC10LvQsNC90Ysg0LzQsNC60YHQuNC80LDQu9GM0L3QviDQv9GA0L7QuNC30LLQvtC00LjRgtC10LvRjNC90YvQvNC4INCyINGD0YnQtdGA0LEg0YfQuNGC0LDQsdC10LvRjNC90L7RgdGC0Lgg0LvQvtCz0LjQutC4INC00LXQudGB0YLQstC40LkuINCS0L4g0LLQvdC10YjQvdC10Lwg0L7QsdGA0LDQsdC+0YLRh9C40LrQtSDRgdC+0LHRi9GC0LjQuSDQvtCx0YrQtdC60YJcbiAgICogdGhpcyDQvdC10LTQvtGB0YLRg9C/0LXQvSDQv9C+0Y3RgtC+0LzRgyDQtNC+0YHRgtGD0L8g0Log0Y3QutC30LXQvNC/0LvRj9GA0YMg0LrQu9Cw0YHRgdCwINGA0LXQsNC70LjQt9GD0LXRgtGB0Y8g0YfQtdGA0LXQtyDRgdGC0LDRgtC40YfQtdGB0LrQuNC5INC80LDRgdGB0LjQsiDQstGB0LXRhSDRgdC+0LfQtNCw0L3QvdGL0YUg0Y3QutC30LXQvNC/0LvRj9GA0L7QslxuICAgKiDQutC70LDRgdGB0LAg0Lgg0LjQtNC10L3RgtC40YTQuNC60LDRgtC+0YDQsCDQutCw0L3QstCw0YHQsCwg0LLRi9GB0YLRg9C/0LDRjtGJ0LXQs9C+INC40L3QtNC10LrRgdC+0Lwg0LIg0Y3RgtC+0Lwg0LzQsNGB0YHQuNCy0LUuXG4gICAqXG4gICAqIEBwYXJhbSBldmVudCAtINCh0L7QsdGL0YLQuNC1INC80YvRiNC4L9GC0YDQtdC60L/QsNC00LAuXG4gICAqL1xuICBwcm90ZWN0ZWQgaGFuZGxlTW91c2VVcChldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuICAgIHRoaXMucmVuZGVyKCk7XG4gICAgZXZlbnQudGFyZ2V0IS5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLmhhbmRsZU1vdXNlTW92ZVdpdGhDb250ZXh0KTtcbiAgICBldmVudC50YXJnZXQhLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLmhhbmRsZU1vdXNlVXBXaXRoQ29udGV4dCk7XG4gIH1cblxuICAvKipcbiAgICog0KDQtdCw0LPQuNGA0YPQtdGCINC90LAg0L3QsNC20LDRgtC40LUg0LrQu9Cw0LLQuNGI0Lgg0LzRi9GI0Lgv0YLRgNC10LrQv9Cw0LTQsC5cbiAgICpcbiAgICogQHJlbWVya3NcbiAgICog0JIg0LzQvtC80LXQvdGCINC90LDQttCw0YLQuNGPINC4INGD0LTQtdGA0LbQsNC90LjRjyDQutC70LDQstC40YjQuCDQt9Cw0L/Rg9GB0LrQsNC10YLRgdGPINCw0L3QsNC70LjQtyDQtNCy0LjQttC10L3QuNGPINC80YvRiNC4L9GC0YDQtdC60L/QsNC00LAgKNGBINC30LDQttCw0YLQvtC5INC60LvQsNCy0LjRiNC10LkpLiDQktGL0YfQuNGB0LvQtdC90LjRj1xuICAgKiDQstC90YPRgtGA0Lgg0YHQvtCx0YvRgtC40Y8g0YHQtNC10LvQsNC90Ysg0LzQsNC60YHQuNC80LDQu9GM0L3QviDQv9GA0L7QuNC30LLQvtC00LjRgtC10LvRjNC90YvQvNC4INCyINGD0YnQtdGA0LEg0YfQuNGC0LDQsdC10LvRjNC90L7RgdGC0Lgg0LvQvtCz0LjQutC4INC00LXQudGB0YLQstC40LkuINCS0L4g0LLQvdC10YjQvdC10Lwg0L7QsdGA0LDQsdC+0YLRh9C40LrQtVxuICAgKiDRgdC+0LHRi9GC0LjQuSDQvtCx0YrQtdC60YIgdGhpcyDQvdC10LTQvtGB0YLRg9C/0LXQvSDQv9C+0Y3RgtC+0LzRgyDQtNC+0YHRgtGD0L8g0Log0Y3QutC30LXQvNC/0LvRj9GA0YMg0LrQu9Cw0YHRgdCwINGA0LXQsNC70LjQt9GD0LXRgtGB0Y8g0YfQtdGA0LXQtyDRgdGC0LDRgtC40YfQtdGB0LrQuNC5INC80LDRgdGB0LjQsiDQstGB0LXRhVxuICAgKiDRgdC+0LfQtNCw0L3QvdGL0YUg0Y3QutC30LXQvNC/0LvRj9GA0L7QsiDQutC70LDRgdGB0LAg0Lgg0LjQtNC10L3RgtC40YTQuNC60LDRgtC+0YDQsCDQutCw0L3QstCw0YHQsCwg0LLRi9GB0YLRg9C/0LDRjtGJ0LXQs9C+INC40L3QtNC10LrRgdC+0Lwg0LIg0Y3RgtC+0Lwg0LzQsNGB0YHQuNCy0LUuXG4gICAqXG4gICAqIEBwYXJhbSBldmVudCAtINCh0L7QsdGL0YLQuNC1INC80YvRiNC4L9GC0YDQtdC60L/QsNC00LAuXG4gICAqL1xuICBwcm90ZWN0ZWQgaGFuZGxlTW91c2VEb3duKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG5cbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMuaGFuZGxlTW91c2VNb3ZlV2l0aENvbnRleHQpO1xuICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLmhhbmRsZU1vdXNlVXBXaXRoQ29udGV4dCk7XG5cbiAgICB0aGlzLnRyYW5zZm9ybS5zdGFydEludlZpZXdQcm9qTWF0ID0gbTMuaW52ZXJzZSh0aGlzLnRyYW5zZm9ybS52aWV3UHJvamVjdGlvbk1hdCk7XG4gICAgdGhpcy50cmFuc2Zvcm0uc3RhcnRDYW1lcmEgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmNhbWVyYSk7XG4gICAgdGhpcy50cmFuc2Zvcm0uc3RhcnRDbGlwUG9zID0gdGhpcy5nZXRDbGlwU3BhY2VNb3VzZVBvc2l0aW9uLmNhbGwodGhpcywgZXZlbnQpO1xuICAgIHRoaXMudHJhbnNmb3JtLnN0YXJ0UG9zID0gbTMudHJhbnNmb3JtUG9pbnQodGhpcy50cmFuc2Zvcm0uc3RhcnRJbnZWaWV3UHJvak1hdCwgdGhpcy50cmFuc2Zvcm0uc3RhcnRDbGlwUG9zKTtcbiAgICB0aGlzLnRyYW5zZm9ybS5zdGFydE1vdXNlUG9zID0gW2V2ZW50LmNsaWVudFgsIGV2ZW50LmNsaWVudFldO1xuXG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDQoNC10LDQs9C40YDRg9C10YIg0L3QsCDQt9GD0LzQuNGA0L7QstCw0L3QuNC1INC80YvRiNC4L9GC0YDQtdC60L/QsNC00LAuXG4gICAqXG4gICAqIEByZW1lcmtzXG4gICAqINCSINC80L7QvNC10L3RgiDQt9GD0LzQuNGA0L7QstCw0L3QuNGPINC80YvRiNC4L9GC0YDQtdC60L/QsNC00LAg0L/RgNC+0LjRgdGF0L7QtNC40YIg0LfRg9C80LjRgNC+0LLQsNC90LjQtSDQutC+0L7RgNC00LjQvdCw0YLQvdC+0Lkg0L/Qu9C+0YHQutC+0YHRgtC4LiDQktGL0YfQuNGB0LvQtdC90LjRjyDQstC90YPRgtGA0Lgg0YHQvtCx0YvRgtC40Y9cbiAgICog0YHQtNC10LvQsNC90Ysg0LzQsNC60YHQuNC80LDQu9GM0L3QviDQv9GA0L7QuNC30LLQvtC00LjRgtC10LvRjNC90YvQvNC4INCyINGD0YnQtdGA0LEg0YfQuNGC0LDQsdC10LvRjNC90L7RgdGC0Lgg0LvQvtCz0LjQutC4INC00LXQudGB0YLQstC40LkuINCS0L4g0LLQvdC10YjQvdC10Lwg0L7QsdGA0LDQsdC+0YLRh9C40LrQtSDRgdC+0LHRi9GC0LjQuSDQvtCx0YrQtdC60YJcbiAgICogdGhpcyDQvdC10LTQvtGB0YLRg9C/0LXQvSDQv9C+0Y3RgtC+0LzRgyDQtNC+0YHRgtGD0L8g0Log0Y3QutC30LXQvNC/0LvRj9GA0YMg0LrQu9Cw0YHRgdCwINGA0LXQsNC70LjQt9GD0LXRgtGB0Y8g0YfQtdGA0LXQtyDRgdGC0LDRgtC40YfQtdGB0LrQuNC5INC80LDRgdGB0LjQsiDQstGB0LXRhSDRgdC+0LfQtNCw0L3QvdGL0YUg0Y3QutC30LXQvNC/0LvRj9GA0L7QslxuICAgKiDQutC70LDRgdGB0LAg0Lgg0LjQtNC10L3RgtC40YTQuNC60LDRgtC+0YDQsCDQutCw0L3QstCw0YHQsCwg0LLRi9GB0YLRg9C/0LDRjtGJ0LXQs9C+INC40L3QtNC10LrRgdC+0Lwg0LIg0Y3RgtC+0Lwg0LzQsNGB0YHQuNCy0LUuXG4gICAqXG4gICAqIEBwYXJhbSBldmVudCAtINCh0L7QsdGL0YLQuNC1INC80YvRiNC4L9GC0YDQtdC60L/QsNC00LAuXG4gICAqL1xuICBwcm90ZWN0ZWQgaGFuZGxlTW91c2VXaGVlbChldmVudDogV2hlZWxFdmVudCk6IHZvaWQge1xuXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBjb25zdCBbY2xpcFgsIGNsaXBZXSA9IHRoaXMuZ2V0Q2xpcFNwYWNlTW91c2VQb3NpdGlvbi5jYWxsKHRoaXMsIGV2ZW50KTtcblxuICAgIC8vIHBvc2l0aW9uIGJlZm9yZSB6b29taW5nXG4gICAgY29uc3QgW3ByZVpvb21YLCBwcmVab29tWV0gPSBtMy50cmFuc2Zvcm1Qb2ludChtMy5pbnZlcnNlKHRoaXMudHJhbnNmb3JtLnZpZXdQcm9qZWN0aW9uTWF0KSwgW2NsaXBYLCBjbGlwWV0pO1xuXG4gICAgLy8gbXVsdGlwbHkgdGhlIHdoZWVsIG1vdmVtZW50IGJ5IHRoZSBjdXJyZW50IHpvb20gbGV2ZWwsIHNvIHdlIHpvb20gbGVzcyB3aGVuIHpvb21lZCBpbiBhbmQgbW9yZSB3aGVuIHpvb21lZCBvdXRcbiAgICBjb25zdCBuZXdab29tID0gdGhpcy5jYW1lcmEuem9vbSEgKiBNYXRoLnBvdygyLCBldmVudC5kZWx0YVkgKiAtMC4wMSk7XG4gICAgdGhpcy5jYW1lcmEuem9vbSA9IE1hdGgubWF4KDAuMDAyLCBNYXRoLm1pbigyMDAsIG5ld1pvb20pKTtcblxuICAgIHRoaXMudXBkYXRlVmlld1Byb2plY3Rpb24uY2FsbCh0aGlzKTtcblxuICAgIC8vIHBvc2l0aW9uIGFmdGVyIHpvb21pbmdcbiAgICBjb25zdCBbcG9zdFpvb21YLCBwb3N0Wm9vbVldID0gbTMudHJhbnNmb3JtUG9pbnQobTMuaW52ZXJzZSh0aGlzLnRyYW5zZm9ybS52aWV3UHJvamVjdGlvbk1hdCksIFtjbGlwWCwgY2xpcFldKTtcblxuICAgIC8vIGNhbWVyYSBuZWVkcyB0byBiZSBtb3ZlZCB0aGUgZGlmZmVyZW5jZSBvZiBiZWZvcmUgYW5kIGFmdGVyXG4gICAgdGhpcy5jYW1lcmEueCEgKz0gcHJlWm9vbVggLSBwb3N0Wm9vbVg7XG4gICAgdGhpcy5jYW1lcmEueSEgKz0gcHJlWm9vbVkgLSBwb3N0Wm9vbVk7XG5cbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgLyoqXG4gICAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgKi9cblxuICAvKipcbiAgICog0J/RgNC+0LjQt9Cy0L7QtNC40YIg0YDQtdC90LTQtdGA0LjQvdCzINCz0YDQsNGE0LjQutCwINCyINGB0L7QvtGC0LLQtdGC0YHRgtCy0LjQuCDRgSDRgtC10LrRg9GJ0LjQvNC4INC/0LDRgNCw0LzQtdGC0YDQsNC80Lgg0YLRgNCw0L3RgdGE0L7RgNC80LDRhtC40LguXG4gICAqL1xuICBwcm90ZWN0ZWQgcmVuZGVyKCk6IHZvaWQge1xuXG4gICAgLy8g0J7Rh9C40YHRgtC60LAg0L7QsdGK0LXQutGC0LAg0YDQtdC90LTQtdGA0LjQvdCz0LAgV2ViR0wuXG4gICAgdGhpcy5nbC5jbGVhcih0aGlzLmdsLkNPTE9SX0JVRkZFUl9CSVQpXG5cbiAgICAvLyDQntCx0L3QvtCy0LvQtdC90LjQtSDQvNCw0YLRgNC40YbRiyDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuC5cbiAgICB0aGlzLnVwZGF0ZVZpZXdQcm9qZWN0aW9uKClcblxuICAgIC8vINCf0YDQuNCy0Y/Qt9C60LAg0LzQsNGC0YDQuNGG0Ysg0YLRgNCw0L3RgdGE0L7RgNC80LDRhtC40Lgg0Log0L/QtdGA0LXQvNC10L3QvdC+0Lkg0YjQtdC50LTQtdGA0LAuXG4gICAgdGhpcy5nbC51bmlmb3JtTWF0cml4M2Z2KHRoaXMudmFyaWFibGVzWyd1X21hdHJpeCddLCBmYWxzZSwgdGhpcy50cmFuc2Zvcm0udmlld1Byb2plY3Rpb25NYXQpXG5cbiAgICAvLyDQmNGC0LXRgNC40YDQvtCy0LDQvdC40LUg0Lgg0YDQtdC90LTQtdGA0LjQvdCzINCz0YDRg9C/0L8g0LHRg9GE0LXRgNC+0LIgV2ViR0wuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmJ1ZmZlcnMuYW1vdW50T2ZCdWZmZXJHcm91cHM7IGkrKykge1xuXG4gICAgICAvLyDQo9GB0YLQsNC90L7QstC60LAg0YLQtdC60YPRidC10LPQviDQsdGD0YTQtdGA0LAg0LLQtdGA0YjQuNC9INC4INC10LPQviDQv9GA0LjQstGP0LfQutCwINC6INC/0LXRgNC10LzQtdC90L3QvtC5INGI0LXQudC00LXRgNCwLlxuICAgICAgdGhpcy5nbC5iaW5kQnVmZmVyKHRoaXMuZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLmJ1ZmZlcnMudmVydGV4QnVmZmVyc1tpXSlcbiAgICAgIHRoaXMuZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkodGhpcy52YXJpYWJsZXNbJ2FfcG9zaXRpb24nXSlcbiAgICAgIHRoaXMuZ2wudmVydGV4QXR0cmliUG9pbnRlcih0aGlzLnZhcmlhYmxlc1snYV9wb3NpdGlvbiddLCAyLCB0aGlzLmdsLkZMT0FULCBmYWxzZSwgMCwgMClcblxuICAgICAgLy8g0KPRgdGC0LDQvdC+0LLQutCwINGC0LXQutGD0YnQtdCz0L4g0LHRg9GE0LXRgNCwINGG0LLQtdGC0L7QsiDQstC10YDRiNC40L0g0Lgg0LXQs9C+INC/0YDQuNCy0Y/Qt9C60LAg0Log0L/QtdGA0LXQvNC10L3QvdC+0Lkg0YjQtdC50LTQtdGA0LAuXG4gICAgICB0aGlzLmdsLmJpbmRCdWZmZXIodGhpcy5nbC5BUlJBWV9CVUZGRVIsIHRoaXMuYnVmZmVycy5jb2xvckJ1ZmZlcnNbaV0pXG4gICAgICB0aGlzLmdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KHRoaXMudmFyaWFibGVzWydhX2NvbG9yJ10pXG4gICAgICB0aGlzLmdsLnZlcnRleEF0dHJpYlBvaW50ZXIodGhpcy52YXJpYWJsZXNbJ2FfY29sb3InXSwgMSwgdGhpcy5nbC5VTlNJR05FRF9CWVRFLCBmYWxzZSwgMCwgMClcblxuICAgICAgaWYgKHRoaXMudXNlVmVydGV4SW5kaWNlcykge1xuXG4gICAgICAgIC8vINCj0YHRgtCw0L3QvtCy0LrQsCDRgtC10LrRg9GJ0LXQs9C+INCx0YPRhNC10YDQsCDQuNC90LTQtdC60YHQvtCyINCy0LXRgNGI0LjQvS5cbiAgICAgICAgdGhpcy5nbC5iaW5kQnVmZmVyKHRoaXMuZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIHRoaXMuYnVmZmVycy5pbmRleEJ1ZmZlcnNbaV0pXG5cbiAgICAgICAgLy8g0KDQtdC90LTQtdGA0LjQvdCzINGC0LXQutGD0YnQtdC5INCz0YDRg9C/0L/RiyDQsdGD0YTQtdGA0L7Qsi5cbiAgICAgICAgdGhpcy5nbC5kcmF3RWxlbWVudHModGhpcy5nbC5QT0lOVFMsIHRoaXMuYnVmZmVycy5hbW91bnRPZkdMVmVydGljZXNbaV0sIHRoaXMuZ2wuVU5TSUdORURfU0hPUlQsIDApXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmdsLmRyYXdBcnJheXModGhpcy5nbC5QT0lOVFMsIDAsIHRoaXMuYnVmZmVycy5hbW91bnRPZkdMVmVydGljZXNbaV0gLyAzKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDQnNC10YLQvtC0INC40LzQuNGC0LDRhtC40Lgg0LjRgtC10YDQuNGA0L7QstCw0L3QuNGPINC40YHRhdC+0LTQvdGL0YUg0L7QsdGK0LXQutGC0L7Qsi4g0J/RgNC4INC60LDQttC00L7QvCDQvdC+0LLQvtC8INCy0YvQt9C+0LLQtSDQstC+0LfQstGA0LDRidCw0LXRgiDQuNC90YTQvtGA0LzQsNGG0LjRjiDQviDQv9C+0LvQuNCz0L7QvdC1INGB0L4g0YHQu9GD0YfQsNC90YvQvFxuICAgKiDQv9C+0LvQvtC20LXQvdC40LXQvCwg0YHQu9GD0YfQsNC50L3QvtC5INGE0L7RgNC80L7QuSDQuCDRgdC70YPRh9Cw0LnQvdGL0Lwg0YbQstC10YLQvtC8LlxuICAgKlxuICAgKiBAcmV0dXJucyDQmNC90YTQvtGA0LzQsNGG0LjRjyDQviDQv9C+0LvQuNCz0L7QvdC1INC40LvQuCBudWxsLCDQtdGB0LvQuCDQv9C10YDQtdCx0L7RgCDQuNGB0YXQvtC00L3Ri9GFINC+0LHRitC10LrRgtC+0LIg0LfQsNC60L7QvdGH0LjQu9GB0Y8uXG4gICAqL1xuICBwcm90ZWN0ZWQgZGVtb0l0ZXJhdGlvbkNhbGxiYWNrKCk6IFNQbG90UG9seWdvbiB8IG51bGwge1xuICAgIGlmICh0aGlzLmRlbW9Nb2RlLmluZGV4ISA8IHRoaXMuZGVtb01vZGUuYW1vdW50ISkge1xuICAgICAgdGhpcy5kZW1vTW9kZS5pbmRleCEgKys7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB4OiByYW5kb21JbnQodGhpcy5ncmlkU2l6ZS53aWR0aCksXG4gICAgICAgIHk6IHJhbmRvbUludCh0aGlzLmdyaWRTaXplLmhlaWdodCksXG4gICAgICAgIHNoYXBlOiByYW5kb21RdW90YUluZGV4KHRoaXMuZGVtb01vZGUuc2hhcGVRdW90YSEpLFxuICAgICAgICBjb2xvcjogcmFuZG9tSW50KHRoaXMucG9seWdvblBhbGV0dGUubGVuZ3RoKVxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlXG4gICAgICByZXR1cm4gbnVsbFxuICB9XG5cbiAgLyoqXG4gICAqINCX0LDQv9GD0YHQutCw0LXRgiDRgNC10L3QtNC10YDQuNC90LMg0LggXCLQv9GA0L7RgdC70YPRiNC60YNcIiDRgdC+0LHRi9GC0LjQuSDQvNGL0YjQuC/RgtGA0LXQutC/0LDQtNCwINC90LAg0LrQsNC90LLQsNGB0LUuXG4gICAqL1xuICBwdWJsaWMgcnVuKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5pc1J1bm5pbmcpIHtcblxuICAgICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5oYW5kbGVNb3VzZURvd25XaXRoQ29udGV4dClcbiAgICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ3doZWVsJywgdGhpcy5oYW5kbGVNb3VzZVdoZWVsV2l0aENvbnRleHQpXG5cbiAgICAgIHRoaXMucmVuZGVyKClcblxuICAgICAgdGhpcy5pc1J1bm5pbmcgPSB0cnVlXG4gICAgfVxuXG4gICAgLy8g0JLRi9Cy0L7QtCDQvtGC0LvQsNC00L7Rh9C90L7QuSDQuNC90YTQvtGA0LzQsNGG0LjQuC5cbiAgICBpZiAodGhpcy5kZWJ1Z01vZGUuaXNFbmFibGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKCclY9Cg0LXQvdC00LXRgNC40L3QsyDQt9Cw0L/Rg9GJ0LXQvScsIHRoaXMuZGVidWdNb2RlLmdyb3VwU3R5bGUpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqINCe0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdGCINGA0LXQvdC00LXRgNC40L3QsyDQuCBcItC/0YDQvtGB0LvRg9GI0LrRg1wiINGB0L7QsdGL0YLQuNC5INC80YvRiNC4L9GC0YDQtdC60L/QsNC00LAg0L3QsCDQutCw0L3QstCw0YHQtS5cbiAgICpcbiAgICogQHBhcmFtIGNsZWFyIC0g0J/RgNC40LfQvdCw0Log0L3QtdC+0L7QsdGF0L7QtNC40LzQvtGB0YLQuCDQstC80LXRgdGC0LUg0YEg0L7RgdGC0LDQvdC+0LLQutC+0Lkg0YDQtdC90LTQtdGA0LjQvdCz0LAg0L7Rh9C40YHRgtC40YLRjCDQutCw0L3QstCw0YEuINCX0L3QsNGH0LXQvdC40LUgdHJ1ZSDQvtGH0LjRidCw0LXRgiDQutCw0L3QstCw0YEsXG4gICAqINC30L3QsNGH0LXQvdC40LUgZmFsc2UgLSDQvtGB0YLQsNCy0LvRj9C10YIg0LXQs9C+INC90LXQvtGH0LjRidC10L3QvdGL0LwuINCf0L4g0YPQvNC+0LvRh9Cw0L3QuNGOINC+0YfQuNGB0YLQutCwINC90LUg0L/RgNC+0LjRgdGF0L7QtNC40YIuXG4gICAqL1xuICBwdWJsaWMgc3RvcChjbGVhcjogYm9vbGVhbiA9IGZhbHNlKTogdm9pZCB7XG5cbiAgICBpZiAodGhpcy5pc1J1bm5pbmcpIHtcblxuICAgICAgdGhpcy5jYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5oYW5kbGVNb3VzZURvd25XaXRoQ29udGV4dClcbiAgICAgIHRoaXMuY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3doZWVsJywgdGhpcy5oYW5kbGVNb3VzZVdoZWVsV2l0aENvbnRleHQpXG4gICAgICB0aGlzLmNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLmhhbmRsZU1vdXNlTW92ZVdpdGhDb250ZXh0KVxuICAgICAgdGhpcy5jYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuaGFuZGxlTW91c2VVcFdpdGhDb250ZXh0KVxuXG4gICAgICBpZiAoY2xlYXIpIHtcbiAgICAgICAgdGhpcy5jbGVhcigpXG4gICAgICB9XG5cbiAgICAgIHRoaXMuaXNSdW5uaW5nID0gZmFsc2VcbiAgICB9XG5cbiAgICAvLyDQktGL0LLQvtC0INC+0YLQu9Cw0LTQvtGH0L3QvtC5INC40L3RhNC+0YDQvNCw0YbQuNC4LlxuICAgIGlmICh0aGlzLmRlYnVnTW9kZS5pc0VuYWJsZSkge1xuICAgICAgY29uc29sZS5sb2coJyVj0KDQtdC90LTQtdGA0LjQvdCzINC+0YHRgtCw0L3QvtCy0LvQtdC9JywgdGhpcy5kZWJ1Z01vZGUuZ3JvdXBTdHlsZSlcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICog0J7Rh9C40YnQsNC10YIg0LrQsNC90LLQsNGBLCDQt9Cw0LrRgNCw0YjQuNCy0LDRjyDQtdCz0L4g0LIg0YTQvtC90L7QstGL0Lkg0YbQstC10YIuXG4gICAqL1xuICBwdWJsaWMgY2xlYXIoKTogdm9pZCB7XG5cbiAgICB0aGlzLmdsLmNsZWFyKHRoaXMuZ2wuQ09MT1JfQlVGRkVSX0JJVCk7XG5cbiAgICAvLyDQktGL0LLQvtC0INC+0YLQu9Cw0LTQvtGH0L3QvtC5INC40L3RhNC+0YDQvNCw0YbQuNC4LlxuICAgIGlmICh0aGlzLmRlYnVnTW9kZS5pc0VuYWJsZSkge1xuICAgICAgY29uc29sZS5sb2coJyVj0JrQvtC90YLQtdC60YHRgiDRgNC10L3QtNC10YDQuNC90LPQsCDQvtGH0LjRidC10L0gWycgKyB0aGlzLmJnQ29sb3IgKyAnXScsIHRoaXMuZGVidWdNb2RlLmdyb3VwU3R5bGUpO1xuICAgIH1cbiAgfVxufVxuIiwiXG4vKipcbiAqINCf0YDQvtCy0LXRgNGP0LXRgiDRj9Cy0LvRj9C10YLRgdGPINC70Lgg0L/QtdGA0LXQvNC10L3QvdCw0Y8g0Y3QutC30LXQvNC/0LvRj9GA0L7QvCDQutCw0LrQvtCz0L4t0LvQuNCx0L7QviDQutC70LDRgdGB0LAuXG4gKlxuICogQHBhcmFtIHZhbCAtINCf0YDQvtCy0LXRgNGP0LXQvNCw0Y8g0L/QtdGA0LXQvNC10L3QvdCw0Y8uXG4gKiBAcmV0dXJucyDQoNC10LfRg9C70YzRgtCw0YIg0L/RgNC+0LLQtdGA0LrQuC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzT2JqZWN0KG9iajogYW55KTogYm9vbGVhbiB7XG4gIHJldHVybiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IE9iamVjdF0nKVxufVxuXG4vKipcbiAqINCS0L7Qt9Cy0YDQsNGJ0LDQtdGCINGB0LvRg9GH0LDQudC90L7QtSDRhtC10LvQvtC1INGH0LjRgdC70L4g0LIg0LTQuNCw0L/QsNC30L7QvdC1OiBbMC4uLnJhbmdlLTFdLlxuICpcbiAqIEBwYXJhbSByYW5nZSAtINCS0LXRgNGF0L3QuNC5INC/0YDQtdC00LXQuyDQtNC40LDQv9Cw0LfQvtC90LAg0YHQu9GD0YfQsNC50L3QvtCz0L4g0LLRi9Cx0L7RgNCwLlxuICogQHJldHVybnMg0KHQu9GD0YfQsNC50L3QvtC1INGH0LjRgdC70L4uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByYW5kb21JbnQocmFuZ2U6IG51bWJlcik6IG51bWJlciB7XG4gIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiByYW5nZSlcbn1cblxuLyoqXG4gKiDQn9GA0LXQvtCx0YDQsNC30YPQtdGCINC+0LHRitC10LrRgiDQsiDRgdGC0YDQvtC60YMgSlNPTi4g0JjQvNC10LXRgiDQvtGC0LvQuNGH0LjQtSDQvtGCINGB0YLQsNC90LTQsNGA0YLQvdC+0Lkg0YTRg9C90LrRhtC40LggSlNPTi5zdHJpbmdpZnkgLSDQv9C+0LvRjyDQvtCx0YrQtdC60YLQsCwg0LjQvNC10Y7RidC40LVcbiAqINC30L3QsNGH0LXQvdC40Y8g0YTRg9C90LrRhtC40Lkg0L3QtSDQv9GA0L7Qv9GD0YHQutCw0Y7RgtGB0Y8sINCwINC/0YDQtdC+0LHRgNCw0LfRg9GO0YLRgdGPINCyINC90LDQt9Cy0LDQvdC40LUg0YTRg9C90LrRhtC40LguXG4gKlxuICogQHBhcmFtIG9iaiAtINCm0LXQu9C10LLQvtC5INC+0LHRitC10LrRgi5cbiAqIEByZXR1cm5zINCh0YLRgNC+0LrQsCBKU09OLCDQvtGC0L7QsdGA0LDQttCw0Y7RidCw0Y8g0L7QsdGK0LXQutGCLlxuICovXG5leHBvcnQgZnVuY3Rpb24ganNvblN0cmluZ2lmeShvYmo6IGFueSk6IHN0cmluZyB7XG4gIHJldHVybiBKU09OLnN0cmluZ2lmeShcbiAgICBvYmosXG4gICAgZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICAgIHJldHVybiAodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKSA/IHZhbHVlLm5hbWUgOiB2YWx1ZVxuICAgIH0sXG4gICAgJyAnXG4gIClcbn1cblxuLyoqXG4gKiDQodC70YPRh9Cw0LnQvdGL0Lwg0L7QsdGA0LDQt9C+0Lwg0LLQvtC30LLRgNCw0YnQsNC10YIg0L7QtNC40L0g0LjQtyDQuNC90LTQtdC60YHQvtCyINGH0LjRgdC70L7QstC+0LPQviDQvtC00L3QvtC80LXRgNC90L7Qs9C+INC80LDRgdGB0LjQstCwLiDQndC10YHQvNC+0YLRgNGPINC90LAg0YHQu9GD0YfQsNC50L3QvtGB0YLRjCDQutCw0LbQtNC+0LPQvlxuICog0LrQvtC90LrRgNC10YLQvdC+0LPQviDQstGL0LfQvtCy0LAg0YTRg9C90LrRhtC40LgsINC40L3QtNC10LrRgdGLINCy0L7Qt9Cy0YDQsNGJ0LDRjtGC0YHRjyDRgSDQv9GA0LXQtNC+0L/RgNC10LTQtdC70LXQvdC90L7QuSDRh9Cw0YHRgtC+0YLQvtC5LiDQp9Cw0YHRgtC+0YLQsCBcItCy0YvQv9Cw0LTQsNC90LjQuVwiINC40L3QtNC10LrRgdC+0LIg0LfQsNC00LDQtdGC0YHRj1xuICog0YHQvtC+0YLQstC10YLRgdGC0LLRg9GO0YnQuNC80Lgg0LfQvdCw0YfQtdC90LjRj9C80Lgg0Y3Qu9C10LzQtdC90YLQvtCyLlxuICpcbiAqIEByZW1hcmtzXG4gKiDQn9GA0LjQvNC10YA6INCd0LAg0LzQsNGB0YHQuNCy0LUgWzMsIDIsIDVdINGE0YPQvdC60YbQuNGPINCx0YPQtNC10YIg0LLQvtC30LLRgNCw0YnQsNGC0Ywg0LjQvdC00LXQutGBIDAg0YEg0YfQsNGB0YLQvtGC0L7QuSA9IDMvKDMrMis1KSA9IDMvMTAsINC40L3QtNC10LrRgSAxINGBINGH0LDRgdGC0L7RgtC+0LkgPVxuICogMi8oMysyKzUpID0gMi8xMCwg0LjQvdC00LXQutGBIDIg0YEg0YfQsNGB0YLQvtGC0L7QuSA9IDUvKDMrMis1KSA9IDUvMTAuXG4gKlxuICogQHBhcmFtIGFyciAtINCn0LjRgdC70L7QstC+0Lkg0L7QtNC90L7QvNC10YDQvdGL0Lkg0LzQsNGB0YHQuNCyLCDQuNC90LTQtdC60YHRiyDQutC+0YLQvtGA0L7Qs9C+INCx0YPQtNGD0YIg0LLQvtC30LLRgNCw0YnQsNGC0YzRgdGPINGBINC/0YDQtdC00L7Qv9GA0LXQtNC10LvQtdC90L3QvtC5INGH0LDRgdGC0L7RgtC+0LkuXG4gKiBAcmV0dXJucyDQodC70YPRh9Cw0LnQvdGL0Lkg0LjQvdC00LXQutGBINC40Lcg0LzQsNGB0YHQuNCy0LAgYXJyLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcmFuZG9tUXVvdGFJbmRleChhcnI6IG51bWJlcltdKTogbnVtYmVyIHtcblxuICBsZXQgYTogbnVtYmVyW10gPSBbXVxuICBhWzBdID0gYXJyWzBdXG5cbiAgZm9yIChsZXQgaSA9IDE7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcbiAgICBhW2ldID0gYVtpIC0gMV0gKyBhcnJbaV1cbiAgfVxuXG4gIGNvbnN0IGxhc3RJbmRleDogbnVtYmVyID0gYS5sZW5ndGggLSAxXG5cbiAgbGV0IHI6IG51bWJlciA9IE1hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkgKiBhW2xhc3RJbmRleF0pKSArIDFcbiAgbGV0IGw6IG51bWJlciA9IDBcbiAgbGV0IGg6IG51bWJlciA9IGxhc3RJbmRleFxuXG4gIHdoaWxlIChsIDwgaCkge1xuICAgIGNvbnN0IG06IG51bWJlciA9IGwgKyAoKGggLSBsKSA+PiAxKTtcbiAgICAociA+IGFbbV0pID8gKGwgPSBtICsgMSkgOiAoaCA9IG0pXG4gIH1cblxuICByZXR1cm4gKGFbbF0gPj0gcikgPyBsIDogLTFcbn1cblxuXG4vKipcbiAqINCa0L7QvdCy0LXRgNGC0LjRgNGD0LXRgiDRhtCy0LXRgiDQuNC3IEhFWC3Qv9GA0LXQtNGB0YLQsNCy0LvQtdC90LjRjyDQsiDQv9GA0LXQtNGB0YLQsNCy0LvQtdC90LjQtSDRhtCy0LXRgtCwINC00LvRjyBHTFNMLdC60L7QtNCwIChSR0Ig0YEg0LTQuNCw0L/QsNC30L7QvdCw0LzQuCDQt9C90LDRh9C10L3QuNC5INC+0YIgMCDQtNC+IDEpLlxuICpcbiAqIEBwYXJhbSBoZXhDb2xvciAtINCm0LLQtdGCINCyIEhFWC3RhNC+0YDQvNCw0YLQtS5cbiAqIEByZXR1cm5zINCc0LDRgdGB0LjQsiDQuNC3INGC0YDQtdGFINGH0LjRgdC10Lsg0LIg0LTQuNCw0L/QsNC30L7QvdC1INC+0YIgMCDQtNC+IDEuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb2xvckZyb21IZXhUb0dsUmdiKGhleENvbG9yOiBzdHJpbmcpOiBudW1iZXJbXSB7XG5cbiAgbGV0IGsgPSAvXiM/KFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pJC9pLmV4ZWMoaGV4Q29sb3IpXG4gIGxldCBbciwgZywgYl0gPSBbcGFyc2VJbnQoayFbMV0sIDE2KSAvIDI1NSwgcGFyc2VJbnQoayFbMl0sIDE2KSAvIDI1NSwgcGFyc2VJbnQoayFbM10sIDE2KSAvIDI1NV1cblxuICByZXR1cm4gW3IsIGcsIGJdXG59XG5cbi8qKlxuICog0JLRi9GH0LjRgdC70Y/QtdGCINGC0LXQutGD0YnQtdC1INCy0YDQtdC80Y8uXG4gKlxuICogQHJldHVybnMg0KHRgtGA0L7QutC+0LLQsNGPINGE0L7RgNC80LDRgtC40YDQvtCy0LDQvdC90LDRjyDQt9Cw0L/QuNGB0Ywg0YLQtdC60YPRidC10LPQviDQstGA0LXQvNC10L3QuC4g0KTQvtGA0LzQsNGCOiBoaDptbTpzc1xuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q3VycmVudFRpbWUoKTogc3RyaW5nIHtcblxuICBsZXQgdG9kYXkgPSBuZXcgRGF0ZSgpO1xuXG4gIGxldCB0aW1lID1cbiAgICAoKHRvZGF5LmdldEhvdXJzKCkgPCAxMCA/ICcwJyA6ICcnKSArIHRvZGF5LmdldEhvdXJzKCkpICsgXCI6XCIgK1xuICAgICgodG9kYXkuZ2V0TWludXRlcygpIDwgMTAgPyAnMCcgOiAnJykgKyB0b2RheS5nZXRNaW51dGVzKCkpICsgXCI6XCIgK1xuICAgICgodG9kYXkuZ2V0U2Vjb25kcygpIDwgMTAgPyAnMCcgOiAnJykgKyB0b2RheS5nZXRTZWNvbmRzKCkpXG5cbiAgcmV0dXJuIHRpbWVcbn1cbiIsImV4cG9ydCBkZWZhdWx0XG5gXG5hdHRyaWJ1dGUgdmVjMiBhX3Bvc2l0aW9uO1xuYXR0cmlidXRlIGZsb2F0IGFfY29sb3I7XG51bmlmb3JtIG1hdDMgdV9tYXRyaXg7XG52YXJ5aW5nIHZlYzMgdl9jb2xvcjtcbnZvaWQgbWFpbigpIHtcbiAgZ2xfUG9zaXRpb24gPSB2ZWM0KCh1X21hdHJpeCAqIHZlYzMoYV9wb3NpdGlvbiwgMSkpLnh5LCAwLjAsIDEuMCk7XG4gIGdsX1BvaW50U2l6ZSA9IDIwLjA7XG4gIHtBRERJVElPTkFMLUNPREV9XG59XG5gXG4iLCIvKlxuICogQ29weXJpZ2h0IDIwMjEgR0ZYRnVuZGFtZW50YWxzLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBSZWRpc3RyaWJ1dGlvbiBhbmQgdXNlIGluIHNvdXJjZSBhbmQgYmluYXJ5IGZvcm1zLCB3aXRoIG9yIHdpdGhvdXRcbiAqIG1vZGlmaWNhdGlvbiwgYXJlIHBlcm1pdHRlZCBwcm92aWRlZCB0aGF0IHRoZSBmb2xsb3dpbmcgY29uZGl0aW9ucyBhcmVcbiAqIG1ldDpcbiAqXG4gKiAgICAgKiBSZWRpc3RyaWJ1dGlvbnMgb2Ygc291cmNlIGNvZGUgbXVzdCByZXRhaW4gdGhlIGFib3ZlIGNvcHlyaWdodFxuICogbm90aWNlLCB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyLlxuICogICAgICogUmVkaXN0cmlidXRpb25zIGluIGJpbmFyeSBmb3JtIG11c3QgcmVwcm9kdWNlIHRoZSBhYm92ZVxuICogY29weXJpZ2h0IG5vdGljZSwgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lclxuICogaW4gdGhlIGRvY3VtZW50YXRpb24gYW5kL29yIG90aGVyIG1hdGVyaWFscyBwcm92aWRlZCB3aXRoIHRoZVxuICogZGlzdHJpYnV0aW9uLlxuICogICAgICogTmVpdGhlciB0aGUgbmFtZSBvZiBHRlhGdW5kYW1lbnRhbHMuIG5vciB0aGUgbmFtZXMgb2YgaGlzXG4gKiBjb250cmlidXRvcnMgbWF5IGJlIHVzZWQgdG8gZW5kb3JzZSBvciBwcm9tb3RlIHByb2R1Y3RzIGRlcml2ZWQgZnJvbVxuICogdGhpcyBzb2Z0d2FyZSB3aXRob3V0IHNwZWNpZmljIHByaW9yIHdyaXR0ZW4gcGVybWlzc2lvbi5cbiAqXG4gKiBUSElTIFNPRlRXQVJFIElTIFBST1ZJREVEIEJZIFRIRSBDT1BZUklHSFQgSE9MREVSUyBBTkQgQ09OVFJJQlVUT1JTXG4gKiBcIkFTIElTXCIgQU5EIEFOWSBFWFBSRVNTIE9SIElNUExJRUQgV0FSUkFOVElFUywgSU5DTFVESU5HLCBCVVQgTk9UXG4gKiBMSU1JVEVEIFRPLCBUSEUgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSBBTkQgRklUTkVTUyBGT1JcbiAqIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFSRSBESVNDTEFJTUVELiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQ09QWVJJR0hUXG4gKiBPV05FUiBPUiBDT05UUklCVVRPUlMgQkUgTElBQkxFIEZPUiBBTlkgRElSRUNULCBJTkRJUkVDVCwgSU5DSURFTlRBTCxcbiAqIFNQRUNJQUwsIEVYRU1QTEFSWSwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTIChJTkNMVURJTkcsIEJVVCBOT1RcbiAqIExJTUlURUQgVE8sIFBST0NVUkVNRU5UIE9GIFNVQlNUSVRVVEUgR09PRFMgT1IgU0VSVklDRVM7IExPU1MgT0YgVVNFLFxuICogREFUQSwgT1IgUFJPRklUUzsgT1IgQlVTSU5FU1MgSU5URVJSVVBUSU9OKSBIT1dFVkVSIENBVVNFRCBBTkQgT04gQU5ZXG4gKiBUSEVPUlkgT0YgTElBQklMSVRZLCBXSEVUSEVSIElOIENPTlRSQUNULCBTVFJJQ1QgTElBQklMSVRZLCBPUiBUT1JUXG4gKiAoSU5DTFVESU5HIE5FR0xJR0VOQ0UgT1IgT1RIRVJXSVNFKSBBUklTSU5HIElOIEFOWSBXQVkgT1VUIE9GIFRIRSBVU0VcbiAqIE9GIFRISVMgU09GVFdBUkUsIEVWRU4gSUYgQURWSVNFRCBPRiBUSEUgUE9TU0lCSUxJVFkgT0YgU1VDSCBEQU1BR0UuXG4gKi9cblxuLyoqXG4gKiBWYXJpb3VzIDJkIG1hdGggZnVuY3Rpb25zLlxuICpcbiAqIEBtb2R1bGUgd2ViZ2wtMmQtbWF0aFxuICovXG4oZnVuY3Rpb24ocm9vdCwgZmFjdG9yeSkgeyAgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgLy8gQU1ELiBSZWdpc3RlciBhcyBhbiBhbm9ueW1vdXMgbW9kdWxlLlxuICAgIGRlZmluZShbXSwgZmFjdG9yeSk7XG4gIH0gZWxzZSB7XG4gICAgLy8gQnJvd3NlciBnbG9iYWxzXG4gICAgcm9vdC5tMyA9IGZhY3RvcnkoKTtcbiAgfVxufSh0aGlzLCBmdW5jdGlvbigpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgLyoqXG4gICAqIEFuIGFycmF5IG9yIHR5cGVkIGFycmF5IHdpdGggOSB2YWx1ZXMuXG4gICAqIEB0eXBlZGVmIHtudW1iZXJbXXxUeXBlZEFycmF5fSBNYXRyaXgzXG4gICAqIEBtZW1iZXJPZiBtb2R1bGU6d2ViZ2wtMmQtbWF0aFxuICAgKi9cblxuICAvKipcbiAgICogVGFrZXMgdHdvIE1hdHJpeDNzLCBhIGFuZCBiLCBhbmQgY29tcHV0ZXMgdGhlIHByb2R1Y3QgaW4gdGhlIG9yZGVyXG4gICAqIHRoYXQgcHJlLWNvbXBvc2VzIGIgd2l0aCBhLiAgSW4gb3RoZXIgd29yZHMsIHRoZSBtYXRyaXggcmV0dXJuZWQgd2lsbFxuICAgKiBAcGFyYW0ge21vZHVsZTp3ZWJnbC0yZC1tYXRoLk1hdHJpeDN9IGEgQSBtYXRyaXguXG4gICAqIEBwYXJhbSB7bW9kdWxlOndlYmdsLTJkLW1hdGguTWF0cml4M30gYiBBIG1hdHJpeC5cbiAgICogQHJldHVybiB7bW9kdWxlOndlYmdsLTJkLW1hdGguTWF0cml4M30gdGhlIHJlc3VsdC5cbiAgICogQG1lbWJlck9mIG1vZHVsZTp3ZWJnbC0yZC1tYXRoXG4gICAqL1xuICBmdW5jdGlvbiBtdWx0aXBseShhLCBiKSB7XG4gICAgdmFyIGEwMCA9IGFbMCAqIDMgKyAwXTtcbiAgICB2YXIgYTAxID0gYVswICogMyArIDFdO1xuICAgIHZhciBhMDIgPSBhWzAgKiAzICsgMl07XG4gICAgdmFyIGExMCA9IGFbMSAqIDMgKyAwXTtcbiAgICB2YXIgYTExID0gYVsxICogMyArIDFdO1xuICAgIHZhciBhMTIgPSBhWzEgKiAzICsgMl07XG4gICAgdmFyIGEyMCA9IGFbMiAqIDMgKyAwXTtcbiAgICB2YXIgYTIxID0gYVsyICogMyArIDFdO1xuICAgIHZhciBhMjIgPSBhWzIgKiAzICsgMl07XG4gICAgdmFyIGIwMCA9IGJbMCAqIDMgKyAwXTtcbiAgICB2YXIgYjAxID0gYlswICogMyArIDFdO1xuICAgIHZhciBiMDIgPSBiWzAgKiAzICsgMl07XG4gICAgdmFyIGIxMCA9IGJbMSAqIDMgKyAwXTtcbiAgICB2YXIgYjExID0gYlsxICogMyArIDFdO1xuICAgIHZhciBiMTIgPSBiWzEgKiAzICsgMl07XG4gICAgdmFyIGIyMCA9IGJbMiAqIDMgKyAwXTtcbiAgICB2YXIgYjIxID0gYlsyICogMyArIDFdO1xuICAgIHZhciBiMjIgPSBiWzIgKiAzICsgMl07XG5cbiAgICByZXR1cm4gW1xuICAgICAgYjAwICogYTAwICsgYjAxICogYTEwICsgYjAyICogYTIwLFxuICAgICAgYjAwICogYTAxICsgYjAxICogYTExICsgYjAyICogYTIxLFxuICAgICAgYjAwICogYTAyICsgYjAxICogYTEyICsgYjAyICogYTIyLFxuICAgICAgYjEwICogYTAwICsgYjExICogYTEwICsgYjEyICogYTIwLFxuICAgICAgYjEwICogYTAxICsgYjExICogYTExICsgYjEyICogYTIxLFxuICAgICAgYjEwICogYTAyICsgYjExICogYTEyICsgYjEyICogYTIyLFxuICAgICAgYjIwICogYTAwICsgYjIxICogYTEwICsgYjIyICogYTIwLFxuICAgICAgYjIwICogYTAxICsgYjIxICogYTExICsgYjIyICogYTIxLFxuICAgICAgYjIwICogYTAyICsgYjIxICogYTEyICsgYjIyICogYTIyLFxuICAgIF07XG4gIH1cblxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgM3gzIGlkZW50aXR5IG1hdHJpeFxuICAgKiBAcmV0dXJuIHttb2R1bGU6d2ViZ2wyLTJkLW1hdGguTWF0cml4M30gYW4gaWRlbnRpdHkgbWF0cml4XG4gICAqL1xuICBmdW5jdGlvbiBpZGVudGl0eSgpIHtcbiAgICByZXR1cm4gW1xuICAgICAgMSwgMCwgMCxcbiAgICAgIDAsIDEsIDAsXG4gICAgICAwLCAwLCAxLFxuICAgIF07XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIDJEIHByb2plY3Rpb24gbWF0cml4XG4gICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aCB3aWR0aCBpbiBwaXhlbHNcbiAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodCBoZWlnaHQgaW4gcGl4ZWxzXG4gICAqIEByZXR1cm4ge21vZHVsZTp3ZWJnbC0yZC1tYXRoLk1hdHJpeDN9IGEgcHJvamVjdGlvbiBtYXRyaXggdGhhdCBjb252ZXJ0cyBmcm9tIHBpeGVscyB0byBjbGlwc3BhY2Ugd2l0aCBZID0gMCBhdCB0aGUgdG9wLlxuICAgKiBAbWVtYmVyT2YgbW9kdWxlOndlYmdsLTJkLW1hdGhcbiAgICovXG4gIGZ1bmN0aW9uIHByb2plY3Rpb24od2lkdGgsIGhlaWdodCkge1xuICAgIC8vIE5vdGU6IFRoaXMgbWF0cml4IGZsaXBzIHRoZSBZIGF4aXMgc28gMCBpcyBhdCB0aGUgdG9wLlxuICAgIHJldHVybiBbXG4gICAgICAyIC8gd2lkdGgsIDAsIDAsXG4gICAgICAwLCAtMiAvIGhlaWdodCwgMCxcbiAgICAgIC0xLCAxLCAxLFxuICAgIF07XG4gIH1cblxuICAvKipcbiAgICogTXVsdGlwbGllcyBieSBhIDJEIHByb2plY3Rpb24gbWF0cml4XG4gICAqIEBwYXJhbSB7bW9kdWxlOndlYmdsLTJkLW1hdGguTWF0cml4M30gdGhlIG1hdHJpeCB0byBiZSBtdWx0aXBsaWVkXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aCB3aWR0aCBpbiBwaXhlbHNcbiAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodCBoZWlnaHQgaW4gcGl4ZWxzXG4gICAqIEByZXR1cm4ge21vZHVsZTp3ZWJnbC0yZC1tYXRoLk1hdHJpeDN9IHRoZSByZXN1bHRcbiAgICogQG1lbWJlck9mIG1vZHVsZTp3ZWJnbC0yZC1tYXRoXG4gICAqL1xuICBmdW5jdGlvbiBwcm9qZWN0KG0sIHdpZHRoLCBoZWlnaHQpIHtcbiAgICByZXR1cm4gbXVsdGlwbHkobSwgcHJvamVjdGlvbih3aWR0aCwgaGVpZ2h0KSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIDJEIHRyYW5zbGF0aW9uIG1hdHJpeFxuICAgKiBAcGFyYW0ge251bWJlcn0gdHggYW1vdW50IHRvIHRyYW5zbGF0ZSBpbiB4XG4gICAqIEBwYXJhbSB7bnVtYmVyfSB0eSBhbW91bnQgdG8gdHJhbnNsYXRlIGluIHlcbiAgICogQHJldHVybiB7bW9kdWxlOndlYmdsLTJkLW1hdGguTWF0cml4M30gYSB0cmFuc2xhdGlvbiBtYXRyaXggdGhhdCB0cmFuc2xhdGVzIGJ5IHR4IGFuZCB0eS5cbiAgICogQG1lbWJlck9mIG1vZHVsZTp3ZWJnbC0yZC1tYXRoXG4gICAqL1xuICBmdW5jdGlvbiB0cmFuc2xhdGlvbih0eCwgdHkpIHtcbiAgICByZXR1cm4gW1xuICAgICAgMSwgMCwgMCxcbiAgICAgIDAsIDEsIDAsXG4gICAgICB0eCwgdHksIDEsXG4gICAgXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNdWx0aXBsaWVzIGJ5IGEgMkQgdHJhbnNsYXRpb24gbWF0cml4XG4gICAqIEBwYXJhbSB7bW9kdWxlOndlYmdsLTJkLW1hdGguTWF0cml4M30gdGhlIG1hdHJpeCB0byBiZSBtdWx0aXBsaWVkXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB0eCBhbW91bnQgdG8gdHJhbnNsYXRlIGluIHhcbiAgICogQHBhcmFtIHtudW1iZXJ9IHR5IGFtb3VudCB0byB0cmFuc2xhdGUgaW4geVxuICAgKiBAcmV0dXJuIHttb2R1bGU6d2ViZ2wtMmQtbWF0aC5NYXRyaXgzfSB0aGUgcmVzdWx0XG4gICAqIEBtZW1iZXJPZiBtb2R1bGU6d2ViZ2wtMmQtbWF0aFxuICAgKi9cbiAgZnVuY3Rpb24gdHJhbnNsYXRlKG0sIHR4LCB0eSkge1xuICAgIHJldHVybiBtdWx0aXBseShtLCB0cmFuc2xhdGlvbih0eCwgdHkpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgMkQgcm90YXRpb24gbWF0cml4XG4gICAqIEBwYXJhbSB7bnVtYmVyfSBhbmdsZUluUmFkaWFucyBhbW91bnQgdG8gcm90YXRlIGluIHJhZGlhbnNcbiAgICogQHJldHVybiB7bW9kdWxlOndlYmdsLTJkLW1hdGguTWF0cml4M30gYSByb3RhdGlvbiBtYXRyaXggdGhhdCByb3RhdGVzIGJ5IGFuZ2xlSW5SYWRpYW5zXG4gICAqIEBtZW1iZXJPZiBtb2R1bGU6d2ViZ2wtMmQtbWF0aFxuICAgKi9cbiAgZnVuY3Rpb24gcm90YXRpb24oYW5nbGVJblJhZGlhbnMpIHtcbiAgICB2YXIgYyA9IE1hdGguY29zKGFuZ2xlSW5SYWRpYW5zKTtcbiAgICB2YXIgcyA9IE1hdGguc2luKGFuZ2xlSW5SYWRpYW5zKTtcbiAgICByZXR1cm4gW1xuICAgICAgYywgLXMsIDAsXG4gICAgICBzLCBjLCAwLFxuICAgICAgMCwgMCwgMSxcbiAgICBdO1xuICB9XG5cbiAgLyoqXG4gICAqIE11bHRpcGxpZXMgYnkgYSAyRCByb3RhdGlvbiBtYXRyaXhcbiAgICogQHBhcmFtIHttb2R1bGU6d2ViZ2wtMmQtbWF0aC5NYXRyaXgzfSB0aGUgbWF0cml4IHRvIGJlIG11bHRpcGxpZWRcbiAgICogQHBhcmFtIHtudW1iZXJ9IGFuZ2xlSW5SYWRpYW5zIGFtb3VudCB0byByb3RhdGUgaW4gcmFkaWFuc1xuICAgKiBAcmV0dXJuIHttb2R1bGU6d2ViZ2wtMmQtbWF0aC5NYXRyaXgzfSB0aGUgcmVzdWx0XG4gICAqIEBtZW1iZXJPZiBtb2R1bGU6d2ViZ2wtMmQtbWF0aFxuICAgKi9cbiAgZnVuY3Rpb24gcm90YXRlKG0sIGFuZ2xlSW5SYWRpYW5zKSB7XG4gICAgcmV0dXJuIG11bHRpcGx5KG0sIHJvdGF0aW9uKGFuZ2xlSW5SYWRpYW5zKSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIDJEIHNjYWxpbmcgbWF0cml4XG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzeCBhbW91bnQgdG8gc2NhbGUgaW4geFxuICAgKiBAcGFyYW0ge251bWJlcn0gc3kgYW1vdW50IHRvIHNjYWxlIGluIHlcbiAgICogQHJldHVybiB7bW9kdWxlOndlYmdsLTJkLW1hdGguTWF0cml4M30gYSBzY2FsZSBtYXRyaXggdGhhdCBzY2FsZXMgYnkgc3ggYW5kIHN5LlxuICAgKiBAbWVtYmVyT2YgbW9kdWxlOndlYmdsLTJkLW1hdGhcbiAgICovXG4gIGZ1bmN0aW9uIHNjYWxpbmcoc3gsIHN5KSB7XG4gICAgcmV0dXJuIFtcbiAgICAgIHN4LCAwLCAwLFxuICAgICAgMCwgc3ksIDAsXG4gICAgICAwLCAwLCAxLFxuICAgIF07XG4gIH1cblxuICAvKipcbiAgICogTXVsdGlwbGllcyBieSBhIDJEIHNjYWxpbmcgbWF0cml4XG4gICAqIEBwYXJhbSB7bW9kdWxlOndlYmdsLTJkLW1hdGguTWF0cml4M30gdGhlIG1hdHJpeCB0byBiZSBtdWx0aXBsaWVkXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzeCBhbW91bnQgdG8gc2NhbGUgaW4geFxuICAgKiBAcGFyYW0ge251bWJlcn0gc3kgYW1vdW50IHRvIHNjYWxlIGluIHlcbiAgICogQHJldHVybiB7bW9kdWxlOndlYmdsLTJkLW1hdGguTWF0cml4M30gdGhlIHJlc3VsdFxuICAgKiBAbWVtYmVyT2YgbW9kdWxlOndlYmdsLTJkLW1hdGhcbiAgICovXG4gIGZ1bmN0aW9uIHNjYWxlKG0sIHN4LCBzeSkge1xuICAgIHJldHVybiBtdWx0aXBseShtLCBzY2FsaW5nKHN4LCBzeSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gZG90KHgxLCB5MSwgeDIsIHkyKSB7XG4gICAgcmV0dXJuIHgxICogeDIgKyB5MSAqIHkyO1xuICB9XG5cbiAgZnVuY3Rpb24gZGlzdGFuY2UoeDEsIHkxLCB4MiwgeTIpIHtcbiAgICB2YXIgZHggPSB4MSAtIHgyO1xuICAgIHZhciBkeSA9IHkxIC0geTI7XG4gICAgcmV0dXJuIE1hdGguc3FydChkeCAqIGR4ICsgZHkgKiBkeSk7XG4gIH1cblxuICBmdW5jdGlvbiBub3JtYWxpemUoeCwgeSkge1xuICAgIHZhciBsID0gZGlzdGFuY2UoMCwgMCwgeCwgeSk7XG4gICAgaWYgKGwgPiAwLjAwMDAxKSB7XG4gICAgICByZXR1cm4gW3ggLyBsLCB5IC8gbF07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBbMCwgMF07XG4gICAgfVxuICB9XG5cbiAgLy8gaSA9IGluY2lkZW50XG4gIC8vIG4gPSBub3JtYWxcbiAgZnVuY3Rpb24gcmVmbGVjdChpeCwgaXksIG54LCBueSkge1xuICAgIC8vIEkgLSAyLjAgKiBkb3QoTiwgSSkgKiBOLlxuICAgIHZhciBkID0gZG90KG54LCBueSwgaXgsIGl5KTtcbiAgICByZXR1cm4gW1xuICAgICAgaXggLSAyICogZCAqIG54LFxuICAgICAgaXkgLSAyICogZCAqIG55LFxuICAgIF07XG4gIH1cblxuICBmdW5jdGlvbiByYWRUb0RlZyhyKSB7XG4gICAgcmV0dXJuIHIgKiAxODAgLyBNYXRoLlBJO1xuICB9XG5cbiAgZnVuY3Rpb24gZGVnVG9SYWQoZCkge1xuICAgIHJldHVybiBkICogTWF0aC5QSSAvIDE4MDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRyYW5zZm9ybVBvaW50KG0sIHYpIHtcbiAgICB2YXIgdjAgPSB2WzBdO1xuICAgIHZhciB2MSA9IHZbMV07XG4gICAgdmFyIGQgPSB2MCAqIG1bMCAqIDMgKyAyXSArIHYxICogbVsxICogMyArIDJdICsgbVsyICogMyArIDJdO1xuICAgIHJldHVybiBbXG4gICAgICAodjAgKiBtWzAgKiAzICsgMF0gKyB2MSAqIG1bMSAqIDMgKyAwXSArIG1bMiAqIDMgKyAwXSkgLyBkLFxuICAgICAgKHYwICogbVswICogMyArIDFdICsgdjEgKiBtWzEgKiAzICsgMV0gKyBtWzIgKiAzICsgMV0pIC8gZCxcbiAgICBdO1xuICB9XG5cbiAgZnVuY3Rpb24gaW52ZXJzZShtKSB7XG4gICAgdmFyIHQwMCA9IG1bMSAqIDMgKyAxXSAqIG1bMiAqIDMgKyAyXSAtIG1bMSAqIDMgKyAyXSAqIG1bMiAqIDMgKyAxXTtcbiAgICB2YXIgdDEwID0gbVswICogMyArIDFdICogbVsyICogMyArIDJdIC0gbVswICogMyArIDJdICogbVsyICogMyArIDFdO1xuICAgIHZhciB0MjAgPSBtWzAgKiAzICsgMV0gKiBtWzEgKiAzICsgMl0gLSBtWzAgKiAzICsgMl0gKiBtWzEgKiAzICsgMV07XG4gICAgdmFyIGQgPSAxLjAgLyAobVswICogMyArIDBdICogdDAwIC0gbVsxICogMyArIDBdICogdDEwICsgbVsyICogMyArIDBdICogdDIwKTtcbiAgICByZXR1cm4gW1xuICAgICAgIGQgKiB0MDAsIC1kICogdDEwLCBkICogdDIwLFxuICAgICAgLWQgKiAobVsxICogMyArIDBdICogbVsyICogMyArIDJdIC0gbVsxICogMyArIDJdICogbVsyICogMyArIDBdKSxcbiAgICAgICBkICogKG1bMCAqIDMgKyAwXSAqIG1bMiAqIDMgKyAyXSAtIG1bMCAqIDMgKyAyXSAqIG1bMiAqIDMgKyAwXSksXG4gICAgICAtZCAqIChtWzAgKiAzICsgMF0gKiBtWzEgKiAzICsgMl0gLSBtWzAgKiAzICsgMl0gKiBtWzEgKiAzICsgMF0pLFxuICAgICAgIGQgKiAobVsxICogMyArIDBdICogbVsyICogMyArIDFdIC0gbVsxICogMyArIDFdICogbVsyICogMyArIDBdKSxcbiAgICAgIC1kICogKG1bMCAqIDMgKyAwXSAqIG1bMiAqIDMgKyAxXSAtIG1bMCAqIDMgKyAxXSAqIG1bMiAqIDMgKyAwXSksXG4gICAgICAgZCAqIChtWzAgKiAzICsgMF0gKiBtWzEgKiAzICsgMV0gLSBtWzAgKiAzICsgMV0gKiBtWzEgKiAzICsgMF0pLFxuICAgIF07XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGRlZ1RvUmFkOiBkZWdUb1JhZCxcbiAgICBkaXN0YW5jZTogZGlzdGFuY2UsXG4gICAgZG90OiBkb3QsXG4gICAgaWRlbnRpdHk6IGlkZW50aXR5LFxuICAgIGludmVyc2U6IGludmVyc2UsXG4gICAgbXVsdGlwbHk6IG11bHRpcGx5LFxuICAgIG5vcm1hbGl6ZTogbm9ybWFsaXplLFxuICAgIHByb2plY3Rpb246IHByb2plY3Rpb24sXG4gICAgcmFkVG9EZWc6IHJhZFRvRGVnLFxuICAgIHJlZmxlY3Q6IHJlZmxlY3QsXG4gICAgcm90YXRpb246IHJvdGF0aW9uLFxuICAgIHJvdGF0ZTogcm90YXRlLFxuICAgIHNjYWxpbmc6IHNjYWxpbmcsXG4gICAgc2NhbGU6IHNjYWxlLFxuICAgIHRyYW5zZm9ybVBvaW50OiB0cmFuc2Zvcm1Qb2ludCxcbiAgICB0cmFuc2xhdGlvbjogdHJhbnNsYXRpb24sXG4gICAgdHJhbnNsYXRlOiB0cmFuc2xhdGUsXG4gICAgcHJvamVjdDogcHJvamVjdCxcbiAgfTtcblxufSkpO1xuXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9pbmRleC50c1wiKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=