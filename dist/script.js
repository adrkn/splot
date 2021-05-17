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
            shape: 0,
            size: 5 + randomInt(16),
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
            sizeBuffers: [],
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
        this.setWebGlVariable('attribute', 'a_polygonsize');
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
            this.addWbGlBuffer(this.buffers.sizeBuffers, 'ARRAY_BUFFER', new Float32Array(polygonGroup.sizes), 1);
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
            sizes: [],
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
    SPlot.prototype.getVerticesOfPoint = function (x, y, size) {
        return {
            values: [x, y],
            indices: [0, 0, 0],
            size: size
        };
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
        var vertices = this.shapes[polygon.shape].calc(polygon.x, polygon.y, polygon.size);
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
        polygonGroup.sizes.push(vertices.size);
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
            // Установка текущего буфера размеров вершин и его привязка к переменной шейдера.
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.sizeBuffers[i]);
            this.gl.enableVertexAttribArray(this.variables['a_polygonsize']);
            this.gl.vertexAttribPointer(this.variables['a_polygonsize'], 1, this.gl.FLOAT, false, 0, 0);
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
                size: 1 + utils_1.randomInt(20),
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
exports.default = "\nattribute vec2 a_position;\nattribute float a_color;\nattribute float a_polygonsize;\nuniform mat3 u_matrix;\nvarying vec3 v_color;\nvoid main() {\n  gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0.0, 1.0);\n  gl_PointSize = a_polygonsize;\n  {ADDITIONAL-CODE}\n}\n";


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zdHlsZS5jc3MiLCJ3ZWJwYWNrOi8vLy4vZnJhZ21lbnQtc2hhZGVyLnRzIiwid2VicGFjazovLy8uL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NwbG90LnRzIiwid2VicGFjazovLy8uL3V0aWxzLnRzIiwid2VicGFjazovLy8uL3ZlcnRleC1zaGFkZXIudHMiLCJ3ZWJwYWNrOi8vLy4vbTMuanMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovLy93ZWJwYWNrL3N0YXJ0dXAiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7QUNBQSxrQkFDQSxnT0FTQztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQTZCRTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN6Q0YsZ0ZBQTJCO0FBQzNCLGtEQUFnQjtBQUVoQixTQUFTLFNBQVMsQ0FBQyxLQUFhO0lBQzlCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsS0FBSyxDQUFDO0FBQzFDLENBQUM7QUFFRCxJQUFJLENBQUMsR0FBRyxDQUFDO0FBQ1QsSUFBSSxDQUFDLEdBQUcsT0FBUyxFQUFFLDhCQUE4QjtBQUNqRCxJQUFJLE9BQU8sR0FBRyxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQztBQUM1SCxJQUFJLFNBQVMsR0FBRyxLQUFNO0FBQ3RCLElBQUksVUFBVSxHQUFHLEtBQU07QUFFdkIsZ0hBQWdIO0FBQ2hILFNBQVMsY0FBYztJQUNyQixJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDVCxDQUFDLEVBQUU7UUFDSCxPQUFPO1lB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhLDZCQUE2QjtBQUMxQyxhQUFhLE9BQU87QUFDcEIsYUFBYSxPQUFPO0FBQ3BCLGNBQWMsNkJBQTZCO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWEsT0FBTztBQUNwQixjQUFjLDZCQUE2QjtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhLDZCQUE2QjtBQUMxQyxhQUFhLE9BQU87QUFDcEIsY0FBYyw2QkFBNkI7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQixjQUFjLDZCQUE2QjtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWEsNkJBQTZCO0FBQzFDLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEIsY0FBYyw2QkFBNkI7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsQ0FBQzs7Ozs7Ozs7VUM3U0Q7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0Esc0RBQXNELGtCQUFrQjtXQUN4RTtXQUNBLCtDQUErQyxjQUFjO1dBQzdELEU7Ozs7O1VDTkE7VUFDQTtVQUNBO1VBQ0EiLCJmaWxlIjoic2NyaXB0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiZXhwb3J0IGRlZmF1bHRcbmBcbnByZWNpc2lvbiBsb3dwIGZsb2F0O1xudmFyeWluZyB2ZWMzIHZfY29sb3I7XG52b2lkIG1haW4oKSB7XG4gIGZsb2F0IHZTaXplID0gMjAuMDtcbiAgZmxvYXQgZGlzdGFuY2UgPSBsZW5ndGgoMi4wICogZ2xfUG9pbnRDb29yZCAtIDEuMCk7XG4gIGlmIChkaXN0YW5jZSA+IDEuMCkgeyBkaXNjYXJkOyB9XG4gIGdsX0ZyYWdDb2xvciA9IHZlYzQodl9jb2xvci5yZ2IsIDEuMCk7XG59XG5gXG5cbi8qKlxuZXhwb3J0IGRlZmF1bHRcbiAgYFxucHJlY2lzaW9uIGxvd3AgZmxvYXQ7XG52YXJ5aW5nIHZlYzMgdl9jb2xvcjtcbnZvaWQgbWFpbigpIHtcbiAgZmxvYXQgdlNpemUgPSAyMC4wO1xuICBmbG9hdCBkaXN0YW5jZSA9IGxlbmd0aCgyLjAgKiBnbF9Qb2ludENvb3JkIC0gMS4wKTtcbiAgaWYgKGRpc3RhbmNlID4gMS4wKSB7IGRpc2NhcmQ7IH1cbiAgZ2xfRnJhZ0NvbG9yID0gdmVjNCh2X2NvbG9yLnJnYiwgMS4wKTtcblxuICAgdmVjNCB1RWRnZUNvbG9yID0gdmVjNCgwLjUsIDAuNSwgMC41LCAxLjApO1xuIGZsb2F0IHVFZGdlU2l6ZSA9IDEuMDtcblxuZmxvYXQgc0VkZ2UgPSBzbW9vdGhzdGVwKFxuICB2U2l6ZSAtIHVFZGdlU2l6ZSAtIDIuMCxcbiAgdlNpemUgLSB1RWRnZVNpemUsXG4gIGRpc3RhbmNlICogKHZTaXplICsgdUVkZ2VTaXplKVxuKTtcbmdsX0ZyYWdDb2xvciA9ICh1RWRnZUNvbG9yICogc0VkZ2UpICsgKCgxLjAgLSBzRWRnZSkgKiBnbF9GcmFnQ29sb3IpO1xuXG5nbF9GcmFnQ29sb3IuYSA9IGdsX0ZyYWdDb2xvci5hICogKDEuMCAtIHNtb290aHN0ZXAoXG4gICAgdlNpemUgLSAyLjAsXG4gICAgdlNpemUsXG4gICAgZGlzdGFuY2UgKiB2U2l6ZVxuKSk7XG5cbn1cbmBcbiovXG4iLCJpbXBvcnQgU1Bsb3QgZnJvbSAnLi9zcGxvdCdcbmltcG9ydCAnQC9zdHlsZSdcblxuZnVuY3Rpb24gcmFuZG9tSW50KHJhbmdlOiBudW1iZXIpIHtcbiAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHJhbmdlKVxufVxuXG5sZXQgaSA9IDBcbmxldCBuID0gMV8wMDBfMDAwICAvLyDQmNC80LjRgtC40YDRg9C10LzQvtC1INGH0LjRgdC70L4g0L7QsdGK0LXQutGC0L7Qsi5cbmxldCBwYWxldHRlID0gWycjRkYwMEZGJywgJyM4MDAwODAnLCAnI0ZGMDAwMCcsICcjODAwMDAwJywgJyNGRkZGMDAnLCAnIzAwRkYwMCcsICcjMDA4MDAwJywgJyMwMEZGRkYnLCAnIzAwMDBGRicsICcjMDAwMDgwJ11cbmxldCBwbG90V2lkdGggPSAzMl8wMDBcbmxldCBwbG90SGVpZ2h0ID0gMTZfMDAwXG5cbi8vINCf0YDQuNC80LXRgCDQuNGC0LXRgNC40YDRg9GO0YnQtdC5INGE0YPQvdC60YbQuNC4LiDQmNGC0LXRgNCw0YbQuNC4INC40LzQuNGC0LjRgNGD0Y7RgtGB0Y8g0YHQu9GD0YfQsNC50L3Ri9C80Lgg0LLRi9C00LDRh9Cw0LzQuC4g0J/QvtGH0YLQuCDRgtCw0LrQttC1INGA0LDQsdC+0YLQsNC10YIg0YDQtdC20LjQvCDQtNC10LzQvi3QtNCw0L3QvdGL0YUuXG5mdW5jdGlvbiByZWFkTmV4dE9iamVjdCgpIHtcbiAgaWYgKGkgPCBuKSB7XG4gICAgaSsrXG4gICAgcmV0dXJuIHtcbiAgICAgIHg6IHJhbmRvbUludChwbG90V2lkdGgpLFxuICAgICAgeTogcmFuZG9tSW50KHBsb3RIZWlnaHQpLFxuICAgICAgc2hhcGU6IDAsXG4gICAgICBzaXplOiA1ICsgcmFuZG9tSW50KDE2KSxcbiAgICAgIGNvbG9yOiByYW5kb21JbnQocGFsZXR0ZS5sZW5ndGgpLCAgLy8g0JjQvdC00LXQutGBINGG0LLQtdGC0LAg0LIg0LzQsNGB0YHQuNCy0LUg0YbQstC10YLQvtCyXG4gICAgfVxuICB9XG4gIGVsc2VcbiAgICByZXR1cm4gbnVsbCAgLy8g0JLQvtC30LLRgNCw0YnQsNC10LwgbnVsbCwg0LrQvtCz0LTQsCDQvtCx0YrQtdC60YLRiyBcItC30LDQutC+0L3Rh9C40LvQuNGB0YxcIlxufVxuXG4vKiogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICoqL1xuXG5sZXQgc2NhdHRlclBsb3QgPSBuZXcgU1Bsb3QoJ2NhbnZhczEnKVxuXG4vLyDQndCw0YHRgtGA0L7QudC60LAg0Y3QutC30LXQvNC/0LvRj9GA0LAg0L3QsCDRgNC10LbQuNC8INCy0YvQstC+0LTQsCDQvtGC0LvQsNC00L7Rh9C90L7QuSDQuNC90YTQvtGA0LzQsNGG0LjQuCDQsiDQutC+0L3RgdC+0LvRjCDQsdGA0LDRg9C30LXRgNCwLlxuLy8g0JTRgNGD0LPQuNC1INC/0YDQuNC80LXRgNGLINGA0LDQsdC+0YLRiyDQvtC/0LjRgdCw0L3RiyDQsiDRhNCw0LnQu9C1IHNwbG90LmpzINGB0L4g0YHRgtGA0L7QutC4IDIxNC5cbnNjYXR0ZXJQbG90LnNldHVwKHtcbiAgaXRlcmF0aW9uQ2FsbGJhY2s6IHJlYWROZXh0T2JqZWN0LFxuICBwb2x5Z29uUGFsZXR0ZTogcGFsZXR0ZSxcbiAgZ3JpZFNpemU6IHtcbiAgICB3aWR0aDogcGxvdFdpZHRoLFxuICAgIGhlaWdodDogcGxvdEhlaWdodCxcbiAgfSxcbiAgZGVidWdNb2RlOiB7XG4gICAgaXNFbmFibGU6IHRydWUsXG4gIH0sXG4gIGRlbW9Nb2RlOiB7XG4gICAgaXNFbmFibGU6IGZhbHNlLFxuICB9LFxufSlcblxuc2NhdHRlclBsb3QucnVuKClcbi8vc2NhdHRlclBsb3Quc3RvcCgpXG5cbi8vc2V0VGltZW91dCgoKSA9PiBzY2F0dGVyUGxvdC5zdG9wKCksIDMwMDApXG4iLCIvLyBAdHMtaWdub3JlXG5pbXBvcnQgbTMgZnJvbSAnLi9tMydcbmltcG9ydCB7IGlzT2JqZWN0LCByYW5kb21JbnQsIGpzb25TdHJpbmdpZnksIHJhbmRvbVF1b3RhSW5kZXgsIGNvbG9yRnJvbUhleFRvR2xSZ2IsIGdldEN1cnJlbnRUaW1lIH0gZnJvbSAnLi91dGlscydcbmltcG9ydCB2ZXJ0ZXhTaGFkZXJDb2RlIGZyb20gJy4vdmVydGV4LXNoYWRlcidcbmltcG9ydCBmcmFnbWVudFNoYWRlckNvZGUgZnJvbSAnLi9mcmFnbWVudC1zaGFkZXInXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNQbG90IHtcblxuICAvLyDQpNGD0L3QutGG0LjRjyDQv9C+INGD0LzQvtC70YfQsNC90LjRjiDQtNC70Y8g0LjRgtC10YDQuNGA0L7QstCw0L3QuNGPINC+0LHRitC10LrRgtC+0LIg0L3QtSDQt9Cw0LTQsNC10YLRgdGPLlxuICBwdWJsaWMgaXRlcmF0aW9uQ2FsbGJhY2s6IFNQbG90SXRlcmF0aW9uRnVuY3Rpb24gfCB1bmRlZmluZWQgPSB1bmRlZmluZWRcblxuICAvLyDQptCy0LXRgtC+0LLQsNGPINC/0LDQu9C40YLRgNCwINC/0L7Qu9C40LPQvtC90L7QsiDQv9C+INGD0LzQvtC70YfQsNC90LjRji5cbiAgcHVibGljIHBvbHlnb25QYWxldHRlOiBzdHJpbmdbXSA9IFtcbiAgICAnI0ZGMDBGRicsICcjODAwMDgwJywgJyNGRjAwMDAnLCAnIzgwMDAwMCcsICcjRkZGRjAwJyxcbiAgICAnIzAwRkYwMCcsICcjMDA4MDAwJywgJyMwMEZGRkYnLCAnIzAwMDBGRicsICcjMDAwMDgwJ1xuICBdXG5cbiAgLy8g0KDQsNC30LzQtdGAINC60L7QvtGA0LTQuNC90LDRgtC90L7QuSDQv9C70L7RgdC60L7RgdGC0Lgg0L/QviDRg9C80L7Qu9GH0LDQvdC40Y4uXG4gIHB1YmxpYyBncmlkU2l6ZTogU1Bsb3RHcmlkU2l6ZSA9IHtcbiAgICB3aWR0aDogMzJfMDAwLFxuICAgIGhlaWdodDogMTZfMDAwXG4gIH1cblxuICAvLyDQoNCw0LfQvNC10YAg0L/QvtC70LjQs9C+0L3QsCDQv9C+INGD0LzQvtC70YfQsNC90LjRji5cbiAgcHVibGljIHBvbHlnb25TaXplOiBudW1iZXIgPSAyMFxuXG4gIC8vINCf0LDRgNCw0LzQtdGC0YDRiyDRgNC10LbQuNC80LAg0L7RgtC70LDQtNC60Lgg0L/QviDRg9C80L7Qu9GH0LDQvdC40Y4uXG4gIHB1YmxpYyBkZWJ1Z01vZGU6IFNQbG90RGVidWdNb2RlID0ge1xuICAgIGlzRW5hYmxlOiBmYWxzZSxcbiAgICBvdXRwdXQ6ICdjb25zb2xlJyxcbiAgICBoZWFkZXJTdHlsZTogJ2ZvbnQtd2VpZ2h0OiBib2xkOyBjb2xvcjogI2ZmZmZmZjsgYmFja2dyb3VuZC1jb2xvcjogI2NjMDAwMDsnLFxuICAgIGdyb3VwU3R5bGU6ICdmb250LXdlaWdodDogYm9sZDsgY29sb3I6ICNmZmZmZmY7J1xuICB9XG5cbiAgLy8g0J/QsNGA0LDQvNC10YLRgNGLINGA0LXQttC40LzQsCDQtNC10LzQvtGB0YLRgNCw0YbQuNC+0L3QvdGL0YUg0LTQsNC90L3Ri9GFINC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOLlxuICBwdWJsaWMgZGVtb01vZGU6IFNQbG90RGVtb01vZGUgPSB7XG4gICAgaXNFbmFibGU6IGZhbHNlLFxuICAgIGFtb3VudDogMV8wMDBfMDAwLFxuICAgIC8qKlxuICAgICAqINCf0L4g0YPQvNC+0LvRh9Cw0L3QuNGOINCyINGA0LXQttC40LzQtSDQtNC10LzQvi3QtNCw0L3QvdGL0YUg0LHRg9C00YPRgiDQv9C+0YDQvtCy0L3RgyDQvtGC0L7QsdGA0LDQttCw0YLRjNGB0Y8g0L/QvtC70LjQs9C+0L3RiyDQstGB0LXRhSDQstC+0LfQvNC+0LbQvdGL0YUg0YTQvtGA0LwuINCh0L7QvtGC0LLQtdGC0YHRgtCy0YPRjtGJ0LjQtVxuICAgICAqINC30L3QsNGH0LXQvdC40Y8g0LzQsNGB0YHQuNCy0LAg0LjQvdC40YbQuNCw0LvQuNC30LjRgNGD0Y7RgtGB0Y8g0L/RgNC4INGA0LXQs9C40YHRgtGA0LDRhtC40Lgg0YTRg9C90LrRhtC40Lkg0YHQvtC30LTQsNC90LjRjyDRhNC+0YDQvCDQvNC10YLQvtC00L7QvCB7QGxpbmsgcmVnaXN0ZXJTaGFwZX0uXG4gICAgICovXG4gICAgc2hhcGVRdW90YTogW10sXG4gICAgaW5kZXg6IDBcbiAgfVxuXG4gIC8vINCf0YDQuNC30L3QsNC6INC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOINGE0L7RgNGB0LjRgNC+0LLQsNC90L3QvtCz0L4g0LfQsNC/0YPRgdC60LAg0YDQtdC90LTQtdGA0LAuXG4gIHB1YmxpYyBmb3JjZVJ1bjogYm9vbGVhbiA9IGZhbHNlXG5cbiAgLyoqXG4gICAqINCf0L4g0YPQvNC+0LvRh9Cw0L3QuNGOINC40YHQutGD0YHRgdGC0LLQtdC90L3QvtCz0L4g0L7Qs9GA0LDQvdC40YfQtdC90LjRjyDQvdCwINC60L7Qu9C40YfQtdGB0YLQstC+INC+0YLQvtCx0YDQsNC20LDQtdC80YvRhSDQv9C+0LvQuNCz0L7QvdC+0LIg0L3QtdGCICjQt9CwINGB0YfQtdGCINC30LDQtNCw0L3QuNGPINCx0L7Qu9GM0YjQvtCz0L4g0LfQsNCy0LXQtNC+0LzQvlxuICAgKiDQvdC10LTQvtGB0YLQuNC20LjQvNC+0LPQviDQv9C+0YDQvtCz0L7QstC+0LPQviDRh9C40YHQu9CwKS5cbiAgICovXG4gIHB1YmxpYyBtYXhBbW91bnRPZlBvbHlnb25zOiBudW1iZXIgPSAxXzAwMF8wMDBfMDAwXG5cbiAgLy8g0KTQvtC90L7QstGL0Lkg0YbQstC10YIg0L/QviDRg9C80L7Qu9GH0LDQvdC40Y4g0LTQu9GPINC60LDQvdCy0LDRgdCwLlxuICBwdWJsaWMgYmdDb2xvcjogc3RyaW5nID0gJyNmZmZmZmYnXG5cbiAgLy8g0KbQstC10YIg0L/QviDRg9C80L7Qu9GH0LDQvdC40Y4g0LTQu9GPINC90LDQv9GA0LDQstC70Y/RjtGJ0LjRhS5cbiAgcHVibGljIHJ1bGVzQ29sb3I6IHN0cmluZyA9ICcjYzBjMGMwJ1xuXG4gIC8vINCf0L4g0YPQvNC+0LvRh9Cw0L3QuNGOINC+0LHQu9Cw0YHRgtGMINC/0YDQvtGB0LzQvtGC0YDQsCDRg9GB0YLQsNC90LDQstC70LjQstCw0LXRgtGB0Y8g0LIg0YbQtdC90YLRgCDQutC+0L7RgNC00LjQvdCw0YLQvdC+0Lkg0L/Qu9C+0L7RgdC60L7RgdGC0LguXG4gIHB1YmxpYyBjYW1lcmE6IFNQbG90Q2FtZXJhID0ge1xuICAgIHg6IHRoaXMuZ3JpZFNpemUud2lkdGggLyAyLFxuICAgIHk6IHRoaXMuZ3JpZFNpemUuaGVpZ2h0IC8gMixcbiAgICB6b29tOiAxXG4gIH1cblxuICBwdWJsaWMgdXNlVmVydGV4SW5kaWNlczogYm9vbGVhbiA9IGZhbHNlXG5cbiAgLyoqXG4gICAqINCf0L4g0YPQvNC+0LvRh9Cw0L3QuNGOINC90LDRgdGC0YDQvtC50LrQuCDQutC+0L3RgtC10LrRgdGC0LAg0YDQtdC90LTQtdGA0LjQvdCz0LAgV2ViR0wg0LzQsNC60YHQuNC80LjQt9C40YDRg9GO0YIg0L/RgNC+0LjQt9Cy0L7QtNC40YLQtdC70YzQvdC+0YHRgtGMINCz0YDQsNGE0LjRh9C10YHQutC+0Lkg0YHQuNGB0YLQtdC80YsuINCh0L/QtdGG0LjQsNC70YzQvdGL0YVcbiAgICog0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GM0YHQutC40YUg0L/RgNC10LTRg9GB0YLQsNC90L7QstC+0Log0L3QtSDRgtGA0LXQsdGD0LXRgtGB0Y8sINC+0LTQvdCw0LrQviDQv9GA0LjQu9C+0LbQtdC90LjQtSDQv9C+0LfQstC+0LvRj9C10YIg0Y3QutGB0L/QtdGA0LjQvNC10L3RgtC40YDQvtCy0LDRgtGMINGBINC90LDRgdGC0YDQvtC50LrQsNC80Lgg0LPRgNCw0YTQuNC60LguXG4gICAqL1xuICBwdWJsaWMgd2ViR2xTZXR0aW5nczogV2ViR0xDb250ZXh0QXR0cmlidXRlcyA9IHtcbiAgICBhbHBoYTogZmFsc2UsXG4gICAgZGVwdGg6IGZhbHNlLFxuICAgIHN0ZW5jaWw6IGZhbHNlLFxuICAgIGFudGlhbGlhczogZmFsc2UsXG4gICAgcHJlbXVsdGlwbGllZEFscGhhOiBmYWxzZSxcbiAgICBwcmVzZXJ2ZURyYXdpbmdCdWZmZXI6IGZhbHNlLFxuICAgIHBvd2VyUHJlZmVyZW5jZTogJ2hpZ2gtcGVyZm9ybWFuY2UnLFxuICAgIGZhaWxJZk1ham9yUGVyZm9ybWFuY2VDYXZlYXQ6IGZhbHNlLFxuICAgIGRlc3luY2hyb25pemVkOiBmYWxzZVxuICB9XG5cbiAgLy8g0J/RgNC40LfQvdCw0Log0LDQutGC0LjQstC90L7Qs9C+INC/0YDQvtGG0LXRgdGB0LAg0YDQtdC90LTQtdGA0LAuINCU0L7RgdGC0YPQv9C10L0g0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GOINC/0YDQuNC70L7QttC10L3QuNGPINGC0L7Qu9GM0LrQviDQtNC70Y8g0YfRgtC10L3QuNGPLlxuICBwdWJsaWMgaXNSdW5uaW5nOiBib29sZWFuID0gZmFsc2VcblxuICAvLyDQntCx0YrQtdC60YIg0LrQsNC90LLQsNGB0LAuXG4gIHByb3RlY3RlZCByZWFkb25seSBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50XG5cbiAgLy8g0J7QsdGK0LXQutGCINC60L7QvdGC0LXQutGB0YLQsCDRgNC10L3QtNC10YDQuNC90LPQsCBXZWJHTC5cbiAgcHJvdGVjdGVkIGdsITogV2ViR0xSZW5kZXJpbmdDb250ZXh0XG5cbiAgLy8g0J7QsdGK0LXQutGCINC/0YDQvtCz0YDQsNC80LzRiyBXZWJHTC5cbiAgcHJvdGVjdGVkIGdwdVByb2dyYW0hOiBXZWJHTFByb2dyYW1cblxuICAvLyDQn9C10YDQtdC80LXQvdC90YvQtSDQtNC70Y8g0YHQstGP0LfQuCDQv9GA0LjQu9C+0LbQtdC90LjRjyDRgSDQv9GA0L7Qs9GA0LDQvNC80L7QuSBXZWJHTC5cbiAgcHJvdGVjdGVkIHZhcmlhYmxlczogeyBba2V5OiBzdHJpbmddOiBhbnkgfSA9IHt9XG5cbiAgLyoqXG4gICAqINCo0LDQsdC70L7QvSBHTFNMLdC60L7QtNCwINC00LvRjyDQstC10YDRiNC40L3QvdC+0LPQviDRiNC10LnQtNC10YDQsC4g0KHQvtC00LXRgNC20LjRgiDRgdC/0LXRhtC40LDQu9GM0L3Rg9GOINCy0YHRgtCw0LLQutGDIFwie0FERElUSU9OQUwtQ09ERX1cIiwg0LrQvtGC0L7RgNCw0Y8g0L/QtdGA0LXQtFxuICAgKiDRgdC+0LfQtNCw0L3QuNC10Lwg0YjQtdC50LTQtdGA0LAg0LfQsNC80LXQvdGP0LXRgtGB0Y8g0L3QsCBHTFNMLdC60L7QtCDQstGL0LHQvtGA0LAg0YbQstC10YLQsCDQstC10YDRiNC40L0uXG4gICAqL1xuICBwcm90ZWN0ZWQgcmVhZG9ubHkgdmVydGV4U2hhZGVyQ29kZVRlbXBsYXRlOiBzdHJpbmcgPSB2ZXJ0ZXhTaGFkZXJDb2RlXG5cbiAgLy8g0KjQsNCx0LvQvtC9IEdMU0wt0LrQvtC00LAg0LTQu9GPINGE0YDQsNCz0LzQtdC90YLQvdC+0LPQviDRiNC10LnQtNC10YDQsC5cbiAgcHJvdGVjdGVkIHJlYWRvbmx5IGZyYWdtZW50U2hhZGVyQ29kZVRlbXBsYXRlOiBzdHJpbmcgPSBmcmFnbWVudFNoYWRlckNvZGVcblxuICAvLyDQodGH0LXRgtGH0LjQuiDRh9C40YHQu9CwINC+0LHRgNCw0LHQvtGC0LDQvdC90YvRhSDQv9C+0LvQuNCz0L7QvdC+0LIuXG4gIHByb3RlY3RlZCBhbW91bnRPZlBvbHlnb25zOiBudW1iZXIgPSAwXG5cbiAgLy8g0KLQtdGF0L3QuNGH0LXRgdC60LDRjyDQuNC90YTQvtGA0LzQsNGG0LjRjywg0LjRgdC/0L7Qu9GM0LfRg9C10LzQsNGPINC/0YDQuNC70L7QttC10L3QuNC10Lwg0LTQu9GPINGA0LDRgdGH0LXRgtCwINGC0YDQsNC90YHRhNC+0YDQvNCw0YbQuNC5LlxuICBwcm90ZWN0ZWQgdHJhbnNmb3JtOiBTUGxvdFRyYW5zZm9ybSA9IHtcbiAgICB2aWV3UHJvamVjdGlvbk1hdDogW10sXG4gICAgc3RhcnRJbnZWaWV3UHJvak1hdDogW10sXG4gICAgc3RhcnRDYW1lcmE6IHt4OjAsIHk6MCwgem9vbTogMX0sXG4gICAgc3RhcnRQb3M6IFtdLFxuICAgIHN0YXJ0Q2xpcFBvczogW10sXG4gICAgc3RhcnRNb3VzZVBvczogW11cbiAgfVxuXG4gIC8qKlxuICAgKiDQnNCw0LrRgdC40LzQsNC70YzQvdC+0LUg0LLQvtC30LzQvtC20L3QvtC1INC60L7Qu9C40YfQtdGB0YLQstC+INCy0LXRgNGI0LjQvSDQsiDQs9GA0YPQv9C/0LUg0L/QvtC70LjQs9C+0L3QvtCyLCDQutC+0YLQvtGA0L7QtSDQtdGJ0LUg0LTQvtC/0YPRgdC60LDQtdGCINC00L7QsdCw0LLQu9C10L3QuNC1INC+0LTQvdC+0LPQviDRgdCw0LzQvtCz0L5cbiAgICog0LzQvdC+0LPQvtCy0LXRgNGI0LjQvdC90L7Qs9C+INC/0L7Qu9C40LPQvtC90LAuINCt0YLQviDQutC+0LvQuNGH0LXRgdGC0LLQviDQuNC80LXQtdGCINC+0LHRitC10LrRgtC40LLQvdC+0LUg0YLQtdGF0L3QuNGH0LXRgdC60L7QtSDQvtCz0YDQsNC90LjRh9C10L3QuNC1LCDRgi7Qui4g0YTRg9C90LrRhtC40Y9cbiAgICoge0BsaW5rIGRyYXdFbGVtZW50c30g0L3QtSDQv9C+0LfQstC+0LvRj9C10YIg0LrQvtGA0YDQtdC60YLQvdC+INC/0YDQuNC90LjQvNCw0YLRjCDQsdC+0LvRjNGI0LUgNjU1MzYg0LjQvdC00LXQutGB0L7QsiAoMzI3Njgg0LLQtdGA0YjQuNC9KS5cbiAgICovXG4vLyAgcHJvdGVjdGVkIG1heEFtb3VudE9mVmVydGV4UGVyUG9seWdvbkdyb3VwOiBudW1iZXIgPSAzMjc2OCAtICh0aGlzLmNpcmNsZUFwcHJveExldmVsICsgMSk7XG4gIHByb3RlY3RlZCBtYXhBbW91bnRPZlZlcnRleFBlclBvbHlnb25Hcm91cDogbnVtYmVyID0gMTBfMDAwXG5cbiAgLy8g0JjQvdGE0L7RgNC80LDRhtC40Y8g0L4g0LHRg9GE0LXRgNCw0YUsINGF0YDQsNC90Y/RidC40YUg0LTQsNC90L3Ri9C1INC00LvRjyDQstC40LTQtdC+0L/QsNC80Y/RgtC4LlxuICBwcm90ZWN0ZWQgYnVmZmVyczogU1Bsb3RCdWZmZXJzID0ge1xuICAgIHZlcnRleEJ1ZmZlcnM6IFtdLFxuICAgIGNvbG9yQnVmZmVyczogW10sXG4gICAgc2l6ZUJ1ZmZlcnM6IFtdLFxuICAgIGluZGV4QnVmZmVyczogW10sXG4gICAgYW1vdW50T2ZHTFZlcnRpY2VzOiBbXSxcbiAgICBhbW91bnRPZlNoYXBlczogW10sXG4gICAgYW1vdW50T2ZCdWZmZXJHcm91cHM6IDAsXG4gICAgYW1vdW50T2ZUb3RhbFZlcnRpY2VzOiAwLFxuICAgIGFtb3VudE9mVG90YWxHTFZlcnRpY2VzOiAwLFxuICAgIHNpemVJbkJ5dGVzOiBbMCwgMCwgMF1cbiAgfVxuXG4gIC8qKlxuICAgKiDQmNC90YTQvtGA0LzQsNGG0LjRjyDQviDQstC+0LfQvNC+0LbQvdGL0YUg0YTQvtGA0LzQsNGFINC/0L7Qu9C40LPQvtC90L7Qsi5cbiAgICog0JrQsNC20LTQsNGPINGE0L7RgNC80LAg0L/RgNC10LTRgdGC0LDQstC70Y/QtdGC0YHRjyDRhNGD0L3QutGG0LjQtdC5LCDQstGL0YfQuNGB0LvRj9GO0YnQtdC5INC10LUg0LLQtdGA0YjQuNC90Ysg0Lgg0L3QsNC30LLQsNC90LjQtdC8INGE0L7RgNC80YsuXG4gICAqINCU0LvRjyDRg9C60LDQt9Cw0L3QuNGPINGE0L7RgNC80Ysg0L/QvtC70LjQs9C+0L3QvtCyINCyINC/0YDQuNC70L7QttC10L3QuNC4INC40YHQv9C+0LvRjNC30YPRjtGC0YHRjyDRh9C40YHQu9C+0LLRi9C1INC40L3QtNC10LrRgdGLINCyINC00LDQvdC90L7QvCDQvNCw0YHRgdC40LLQtS5cbiAgICovXG4gIHByb3RlY3RlZCBzaGFwZXM6IHtjYWxjOiBTUGxvdENhbGNTaGFwZUZ1bmMsIG5hbWU6IHN0cmluZ31bXSA9IFtdXG5cbiAgcHJvdGVjdGVkIGhhbmRsZU1vdXNlRG93bldpdGhDb250ZXh0OiBFdmVudExpc3RlbmVyID0gdGhpcy5oYW5kbGVNb3VzZURvd24uYmluZCh0aGlzKSBhcyBFdmVudExpc3RlbmVyXG4gIHByb3RlY3RlZCBoYW5kbGVNb3VzZVdoZWVsV2l0aENvbnRleHQ6IEV2ZW50TGlzdGVuZXIgPSB0aGlzLmhhbmRsZU1vdXNlV2hlZWwuYmluZCh0aGlzKSBhcyBFdmVudExpc3RlbmVyXG4gIHByb3RlY3RlZCBoYW5kbGVNb3VzZU1vdmVXaXRoQ29udGV4dDogRXZlbnRMaXN0ZW5lciA9IHRoaXMuaGFuZGxlTW91c2VNb3ZlLmJpbmQodGhpcykgYXMgRXZlbnRMaXN0ZW5lclxuICBwcm90ZWN0ZWQgaGFuZGxlTW91c2VVcFdpdGhDb250ZXh0OiBFdmVudExpc3RlbmVyID0gdGhpcy5oYW5kbGVNb3VzZVVwLmJpbmQodGhpcykgYXMgRXZlbnRMaXN0ZW5lclxuXG4gIC8qKlxuICAgKiDQodC+0LfQtNCw0LXRgiDRjdC60LfQtdC80L/Qu9GP0YAg0LrQu9Cw0YHRgdCwLCDQuNC90LjRhtC40LDQu9C40LfQuNGA0YPQtdGCINC90LDRgdGC0YDQvtC50LrQuC5cbiAgICpcbiAgICogQHJlbWFya3NcbiAgICog0JXRgdC70Lgg0LrQsNC90LLQsNGBINGBINC30LDQtNCw0L3QvdGL0Lwg0LjQtNC10L3RgtC40YTQuNC60LDRgtC+0YDQvtC8INC90LUg0L3QsNC50LTQtdC9IC0g0LPQtdC90LXRgNC40YDRg9C10YLRgdGPINC+0YjQuNCx0LrQsC4g0J3QsNGB0YLRgNC+0LnQutC4INC80L7Qs9GD0YIg0LHRi9GC0Ywg0LfQsNC00LDQvdGLINC60LDQuiDQslxuICAgKiDQutC+0L3RgdGC0YDRg9C60YLQvtGA0LUsINGC0LDQuiDQuCDQsiDQvNC10YLQvtC00LUge0BsaW5rIHNldHVwfS4g0J7QtNC90LDQutC+INCyINC70Y7QsdC+0Lwg0YHQu9GD0YfQsNC1INC90LDRgdGC0YDQvtC50LrQuCDQtNC+0LvQttC90Ysg0LHRi9GC0Ywg0LfQsNC00LDQvdGLINC00L4g0LfQsNC/0YPRgdC60LAg0YDQtdC90LTQtdGA0LAuXG4gICAqXG4gICAqIEBwYXJhbSBjYW52YXNJZCAtINCY0LTQtdC90YLQuNGE0LjQutCw0YLQvtGAINC60LDQvdCy0LDRgdCwLCDQvdCwINC60L7RgtC+0YDQvtC8INCx0YPQtNC10YIg0YDQuNGB0L7QstCw0YLRjNGB0Y8g0LPRgNCw0YTQuNC6LlxuICAgKiBAcGFyYW0gb3B0aW9ucyAtINCf0L7Qu9GM0LfQvtCy0LDRgtC10LvRjNGB0LrQuNC1INC90LDRgdGC0YDQvtC50LrQuCDRjdC60LfQtdC80L/Qu9GP0YDQsC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGNhbnZhc0lkOiBzdHJpbmcsIG9wdGlvbnM/OiBTUGxvdE9wdGlvbnMpIHtcblxuICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChjYW52YXNJZCkpIHtcbiAgICAgIHRoaXMuY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY2FudmFzSWQpIGFzIEhUTUxDYW52YXNFbGVtZW50XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcign0JrQsNC90LLQsNGBINGBINC40LTQtdC90YLQuNGE0LjQutCw0YLQvtGA0L7QvCBcIiMnICsgY2FudmFzSWQgKyDCoCdcIiDQvdC1INC90LDQudC00LXQvSEnKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqINCg0LXQs9C40YHRgtGA0LDRhtC40Y8g0YLRgNC10YUg0LHQsNC30L7QstGL0YUg0YTQvtGA0Lwg0L/QvtC70LjQs9C+0L3QvtCyICjRgtGA0LXRg9Cz0L7Qu9GM0L3QuNC60LgsINC60LLQsNC00YDQsNGC0Ysg0Lgg0LrRgNGD0LPQuCkuINCd0LDQu9C40YfQuNC1INGN0YLQuNGFINGE0L7RgNC8INCyINGD0LrQsNC30LDQvdC90L7QvCDQv9C+0YDRj9C00LrQtVxuICAgICAqINGP0LLQu9GP0LXRgtGB0Y8g0L7QsdGP0LfQsNGC0LXQu9GM0L3Ri9C8INC00LvRjyDQutC+0YDRgNC10LrRgtC90L7QuSDRgNCw0LHQvtGC0Ysg0L/RgNC40LvQvtC20LXQvdC40Y8uINCU0YDRg9Cz0LjQtSDRhNC+0YDQvNGLINC80L7Qs9GD0YIg0YDQtdCz0LjRgdGC0YDQuNGA0L7QstCw0YLRjNGPINCyINC70Y7QsdC+0Lwg0LrQvtC70LjRh9C10YHRgtCy0LUsINCyXG4gICAgICog0LvRjtCx0L7QuSDQv9C+0YHQu9C10LTQvtCy0LDRgtC10LvRjNC90L7RgdGC0LguXG4gICAgICovXG4gICAgdGhpcy5yZWdpc3RlclNoYXBlKHRoaXMuZ2V0VmVydGljZXNPZlBvaW50LCAn0KLQvtGH0LrQsCcpXG5cbiAgICAvLyDQldGB0LvQuCDQv9C10YDQtdC00LDQvdGLINC90LDRgdGC0YDQvtC50LrQuCwg0YLQviDQvtC90Lgg0L/RgNC40LzQtdC90Y/RjtGC0YHRjy5cbiAgICBpZiAob3B0aW9ucykge1xuICAgICAgdGhpcy5zZXRPcHRpb25zKG9wdGlvbnMpXG5cbiAgICAgIC8vICDQldGB0LvQuCDQt9Cw0L/RgNC+0YjQtdC9INGE0L7RgNGB0LjRgNC+0LLQsNC90L3Ri9C5INC30LDQv9GD0YHQuiwg0YLQviDQuNC90LjRhtC40LDQu9C40LfQuNGA0YPRjtGC0YHRjyDQstGB0LUg0L3QtdC+0LHRhdC+0LTQuNC80YvQtSDQtNC70Y8g0YDQtdC90LTQtdGA0LAg0L/QsNGA0LDQvNC10YLRgNGLLlxuICAgICAgaWYgKHRoaXMuZm9yY2VSdW4pIHtcbiAgICAgICAgdGhpcy5zZXR1cChvcHRpb25zKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDQodC+0LfQtNCw0LXRgiDQutC+0L3RgtC10LrRgdGCINGA0LXQvdC00LXRgNC40L3Qs9CwIFdlYkdMINC4INGD0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdGCINC60L7RgNGA0LXQutGC0L3Ri9C5INGA0LDQt9C80LXRgCDQvtCx0LvQsNGB0YLQuCDQv9GA0L7RgdC80L7RgtGA0LAuXG4gICAqL1xuICBwcm90ZWN0ZWQgY3JlYXRlR2woKTogdm9pZCB7XG5cbiAgICB0aGlzLmdsID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnd2ViZ2wnLCB0aGlzLndlYkdsU2V0dGluZ3MpIGFzIFdlYkdMUmVuZGVyaW5nQ29udGV4dFxuXG4gICAgdGhpcy5jYW52YXMud2lkdGggPSB0aGlzLmNhbnZhcy5jbGllbnRXaWR0aFxuICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IHRoaXMuY2FudmFzLmNsaWVudEhlaWdodFxuXG4gICAgdGhpcy5nbC52aWV3cG9ydCgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KVxuICB9XG5cbiAgLyoqXG4gICAqINCg0LXQs9C40YHRgtGA0LjRgNGD0LXRgiDQvdC+0LLRg9GOINGE0L7RgNC80YMg0L/QvtC70LjQs9C+0L3QvtCyLiDQoNC10LPQuNGB0YLRgNCw0YbQuNGPINC+0LfQvdCw0YfQsNC10YIg0LLQvtC30LzQvtC20L3QvtGB0YLRjCDQsiDQtNCw0LvRjNC90LXQudGI0LXQvCDQvtGC0L7QsdGA0LDQttCw0YLRjCDQvdCwINCz0YDQsNGE0LjQutC1INC/0L7Qu9C40LPQvtC90Ysg0LTQsNC90L3QvtC5INGE0L7RgNC80YsuXG4gICAqXG4gICAqIEBwYXJhbSBwb2x5Z29uQ2FsYyAtINCk0YPQvdC60YbQuNGPINCy0YvRh9C40YHQu9C10L3QuNGPINC60L7QvtGA0LTQuNC90LDRgiDQstC10YDRiNC40L0g0L/QvtC70LjQs9C+0L3QsCDQtNCw0L3QvdC+0Lkg0YTQvtGA0LzRiy5cbiAgICogQHBhcmFtIHBvbHlnb25OYW1lIC0g0J3QsNC30LLQsNC90LjQtSDRhNC+0YDQvNGLINC/0L7Qu9C40LPQvtC90LAuXG4gICAqIEByZXR1cm5zINCY0L3QtNC10LrRgSDQvdC+0LLQvtC5INGE0L7RgNC80YssINC/0L4g0LrQvtGC0L7RgNC+0LzRgyDQt9Cw0LTQsNC10YLRgdGPINC10LUg0L7RgtC+0LHRgNCw0LbQtdC90LjQtSDQvdCwINCz0YDQsNGE0LjQutC1LlxuICAgKi9cbiAgcHVibGljIHJlZ2lzdGVyU2hhcGUocG9seWdvbkNhbGM6IFNQbG90Q2FsY1NoYXBlRnVuYywgcG9seWdvbk5hbWU6IHN0cmluZyk6IG51bWJlciB7XG5cbiAgICAvLyDQlNC+0LHQsNCy0LvQtdC90LjQtSDRhNC+0YDQvNGLINCyINC80LDRgdGB0LjQsiDRhNC+0YDQvC5cbiAgICB0aGlzLnNoYXBlcy5wdXNoKHtcbiAgICAgIGNhbGM6IHBvbHlnb25DYWxjLFxuICAgICAgbmFtZTogcG9seWdvbk5hbWVcbiAgICB9KVxuXG4gICAgLy8g0JTQvtCx0LDQstC70LXQvdC40LUg0YTQvtGA0LzRiyDQsiDQvNCw0YHRgdC40LIg0YfQsNGB0YLQvtGCINC/0L7Rj9Cy0LvQtdC90LjRjyDQsiDQtNC10LzQvi3RgNC10LbQuNC80LUuXG4gICAgdGhpcy5kZW1vTW9kZS5zaGFwZVF1b3RhIS5wdXNoKDEpXG5cbiAgICAvLyDQn9C+0LvRg9GH0LXQvdC90YvQuSDQuNC90LTQtdC60YEg0YTQvtGA0LzRiyDQsiDQvNCw0YHRgdC40LLQtSDRhNC+0YDQvC5cbiAgICByZXR1cm4gdGhpcy5zaGFwZXMubGVuZ3RoIC0gMVxuICB9XG5cbiAgLyoqXG4gICAqINCj0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdGCINC90LXQvtCx0YXQvtC00LjQvNGL0LUg0LTQu9GPINGA0LXQvdC00LXRgNCwINC/0LDRgNCw0LzQtdGC0YDRiyDRjdC60LfQtdC80L/Qu9GP0YDQsCDQuCBXZWJHTC5cbiAgICpcbiAgICogQHBhcmFtIG9wdGlvbnMgLSDQn9C+0LvRjNC30L7QstCw0YLQtdC70YzRgdC60LjQtSDQvdCw0YHRgtGA0L7QudC60Lgg0Y3QutC30LXQvNC/0LvRj9GA0LAuXG4gICAqL1xuICBwdWJsaWMgc2V0dXAob3B0aW9uczogU1Bsb3RPcHRpb25zKTogdm9pZCB7XG5cbiAgICAvLyDQn9GA0LjQvNC10L3QtdC90LjQtSDQv9C+0LvRjNC30L7QstCw0YLQtdC70YzRgdC60LjRhSDQvdCw0YHRgtGA0L7QtdC6LlxuICAgIHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKVxuXG4gICAgLy8g0KHQvtC30LTQsNC90LjQtSDQutC+0L3RgtC10LrRgdGC0LAg0YDQtdC90LTQtdGA0LjQvdCz0LAuXG4gICAgdGhpcy5jcmVhdGVHbCgpXG5cbiAgICAvLyDQktGL0LLQvtC0INC+0YLQu9Cw0LTQvtGH0L3QvtC5INC40L3RhNC+0YDQvNCw0YbQuNC4LlxuICAgIGlmICh0aGlzLmRlYnVnTW9kZS5pc0VuYWJsZSkge1xuICAgICAgdGhpcy5yZXBvcnRNYWluSW5mbyhvcHRpb25zKVxuICAgIH1cblxuICAgIC8vINCe0LHQvdGD0LvQtdC90LjQtSDRgdGH0LXRgtGH0LjQutCwINC/0L7Qu9C40LPQvtC90L7Qsi5cbiAgICB0aGlzLmFtb3VudE9mUG9seWdvbnMgPSAwXG5cbiAgICAvLyDQntCx0L3Rg9C70LXQvdC40LUg0YLQtdGF0L3QuNGH0LXRgdC60L7Qs9C+INGB0YfQtdGC0YfQuNC60LAg0YDQtdC20LjQvNCwINC00LXQvNC+LdC00LDQvdC90YvRhVxuICAgIHRoaXMuZGVtb01vZGUuaW5kZXggPSAwXG5cbiAgICAvLyDQntCx0L3Rg9C70LXQvdC40LUg0YHRh9C10YLRh9C40LrQvtCyINGH0LjRgdC70LAg0LjRgdC/0L7Qu9GM0LfQvtCy0LDQvdC40Y8g0YDQsNC30LvQuNGH0L3Ri9GFINGE0L7RgNC8INC/0L7Qu9C40LPQvtC90L7Qsi5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc2hhcGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0aGlzLmJ1ZmZlcnMuYW1vdW50T2ZTaGFwZXNbaV0gPSAwXG4gICAgfVxuXG4gICAgLy8g0KPRgdGC0LDQvdC+0LLQutCwINGG0LLQtdGC0LAg0L7Rh9C40YHRgtC60Lgg0YDQtdC90LTQtdGA0LjQvdCz0LBcbiAgICBsZXQgW3IsIGcsIGJdID0gY29sb3JGcm9tSGV4VG9HbFJnYih0aGlzLmJnQ29sb3IpXG4gICAgdGhpcy5nbC5jbGVhckNvbG9yKHIsIGcsIGIsIDAuMClcbiAgICB0aGlzLmdsLmNsZWFyKHRoaXMuZ2wuQ09MT1JfQlVGRkVSX0JJVClcblxuICAgIC8qKlxuICAgICAqINCf0L7QtNCz0L7RgtC+0LLQutCwINC60L7QtNC+0LIg0YjQtdC50LTQtdGA0L7Qsi4g0JIg0LrQvtC0INCy0LXRgNGI0LjQvdC90L7Qs9C+INGI0LXQudC00LXRgNCwINCy0YHRgtCw0LLQu9GP0LXRgtGB0Y8g0LrQvtC0INCy0YvQsdC+0YDQsCDRhtCy0LXRgtCwINCy0LXRgNGI0LjQvS4g0JrQvtC0INGE0YDQsNCz0LzQtdC90YLQvdC+0LPQvlxuICAgICAqINGI0LXQudC00LXRgNCwINC40YHQv9C+0LvRjNC30YPQtdGC0YHRjyDQsdC10Lcg0LjQt9C80LXQvdC10L3QuNC5LlxuICAgICAqL1xuICAgIGxldCB2ZXJ0ZXhTaGFkZXJDb2RlID0gdGhpcy52ZXJ0ZXhTaGFkZXJDb2RlVGVtcGxhdGUucmVwbGFjZSgne0FERElUSU9OQUwtQ09ERX0nLCB0aGlzLmdlblNoYWRlckNvbG9yQ29kZSgpKVxuICAgIGxldCBmcmFnbWVudFNoYWRlckNvZGUgPSB0aGlzLmZyYWdtZW50U2hhZGVyQ29kZVRlbXBsYXRlXG5cbiAgICAvLyDQodC+0LfQtNCw0L3QuNC1INGI0LXQudC00LXRgNC+0LIgV2ViR0wuXG4gICAgbGV0IHZlcnRleFNoYWRlciA9IHRoaXMuY3JlYXRlV2ViR2xTaGFkZXIoJ1ZFUlRFWF9TSEFERVInLCB2ZXJ0ZXhTaGFkZXJDb2RlKVxuICAgIGxldCBmcmFnbWVudFNoYWRlciA9IHRoaXMuY3JlYXRlV2ViR2xTaGFkZXIoJ0ZSQUdNRU5UX1NIQURFUicsIGZyYWdtZW50U2hhZGVyQ29kZSlcblxuICAgIC8vINCh0L7Qt9C00LDQvdC40LUg0L/RgNC+0LPRgNCw0LzQvNGLIFdlYkdMLlxuICAgIHRoaXMuY3JlYXRlV2ViR2xQcm9ncmFtKHZlcnRleFNoYWRlciwgZnJhZ21lbnRTaGFkZXIpXG5cbiAgICAvLyDQo9GB0YLQsNC90L7QstC60LAg0YHQstGP0LfQtdC5INC/0LXRgNC10LzQtdC90L3Ri9GFINC/0YDQuNC70L7QttC10L3QuNGPINGBINC/0YDQvtCz0YDQsNC80LzQvtC5IFdlYkdsLlxuICAgIHRoaXMuc2V0V2ViR2xWYXJpYWJsZSgnYXR0cmlidXRlJywgJ2FfcG9zaXRpb24nKVxuICAgIHRoaXMuc2V0V2ViR2xWYXJpYWJsZSgnYXR0cmlidXRlJywgJ2FfY29sb3InKVxuICAgIHRoaXMuc2V0V2ViR2xWYXJpYWJsZSgnYXR0cmlidXRlJywgJ2FfcG9seWdvbnNpemUnKVxuICAgIHRoaXMuc2V0V2ViR2xWYXJpYWJsZSgndW5pZm9ybScsICd1X21hdHJpeCcpXG5cbiAgICAvLyDQktGL0YfQuNGB0LvQtdC90LjQtSDQtNCw0L3QvdGL0YUg0L7QsdC+INCy0YHQtdGFINC/0L7Qu9C40LPQvtC90LDRhSDQuCDQt9Cw0L/QvtC70L3QtdC90LjQtSDQuNC80Lgg0LHRg9GE0LXRgNC+0LIgV2ViR0wuXG4gICAgdGhpcy5jcmVhdGVXYkdsQnVmZmVycygpXG5cbiAgICAvLyDQldGB0LvQuCDQvdC10L7QsdGF0L7QtNC40LzQviwg0YLQviDRgNC10L3QtNC10YDQuNC90LMg0LfQsNC/0YPRgdC60LDQtdGC0YHRjyDRgdGA0LDQt9GDINC/0L7RgdC70LUg0YPRgdGC0LDQvdC+0LLQutC4INC/0LDRgNCw0LzQtdGC0YDQvtCyINGN0LrQt9C10LzQv9C70Y/RgNCwLlxuICAgIGlmICh0aGlzLmZvcmNlUnVuKSB7XG4gICAgICB0aGlzLnJ1bigpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqINCf0YDQuNC80LXQvdGP0LXRgiDQv9C+0LvRjNC30L7QstCw0YLQtdC70YzRgdC60LjQtSDQvdCw0YHRgtGA0L7QudC60Lgg0Y3QutC30LXQvNC/0LvRj9GA0LAuXG4gICAqXG4gICAqIEBwYXJhbSBvcHRpb25zIC0g0J/QvtC70YzQt9C+0LLQsNGC0LXQu9GM0YHQutC40LUg0L3QsNGB0YLRgNC+0LnQutC4INGN0LrQt9C10LzQv9C70Y/RgNCwLlxuICAgKi9cbiAgcHJvdGVjdGVkIHNldE9wdGlvbnMob3B0aW9uczogU1Bsb3RPcHRpb25zKTogdm9pZCB7XG5cbiAgICAvKipcbiAgICAgKiDQmtC+0L/QuNGA0L7QstCw0L3QuNC1INC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjNGB0LrQuNGFINC90LDRgdGC0YDQvtC10Log0LIg0YHQvtC+0YLQstC10YLRgdCy0YPRjtGJ0LjQtSDQv9C+0LvRjyDRjdC60LfQtdC80L/Qu9GP0YDQsC4g0JrQvtC/0LjRgNGD0Y7RgtGB0Y8g0YLQvtC70YzQutC+INGC0LUg0LjQtyDQvdC40YUsINC60L7RgtC+0YDRi9C8XG4gICAgICog0LjQvNC10Y7RgtGB0Y8g0YHQvtC+0YLQstC10YLRgdGC0LLRg9GO0YnQuNC1INGN0LrQstC40LLQsNC70LXQvdGC0Ysg0LIg0L/QvtC70Y/RhSDRjdC60LfQtdC80L/Qu9GP0YDQsC4g0JrQvtC/0LjRgNGD0LXRgtGB0Y8g0YLQsNC60LbQtSDQv9C10YDQstGL0Lkg0YPRgNC+0LLQtdC90Ywg0LLQu9C+0LbQtdC90L3Ri9GFINC90LDRgdGC0YDQvtC10LouXG4gICAgICovXG4gICAgZm9yIChsZXQgb3B0aW9uIGluIG9wdGlvbnMpIHtcblxuICAgICAgaWYgKCF0aGlzLmhhc093blByb3BlcnR5KG9wdGlvbikpIGNvbnRpbnVlXG5cbiAgICAgIGlmIChpc09iamVjdCgob3B0aW9ucyBhcyBhbnkpW29wdGlvbl0pICYmIGlzT2JqZWN0KCh0aGlzIGFzIGFueSlbb3B0aW9uXSkgKSB7XG4gICAgICAgIGZvciAobGV0IG5lc3RlZE9wdGlvbiBpbiAob3B0aW9ucyBhcyBhbnkpW29wdGlvbl0pIHtcbiAgICAgICAgICBpZiAoKHRoaXMgYXMgYW55KVtvcHRpb25dLmhhc093blByb3BlcnR5KG5lc3RlZE9wdGlvbikpIHtcbiAgICAgICAgICAgICh0aGlzIGFzIGFueSlbb3B0aW9uXVtuZXN0ZWRPcHRpb25dID0gKG9wdGlvbnMgYXMgYW55KVtvcHRpb25dW25lc3RlZE9wdGlvbl1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICh0aGlzIGFzIGFueSlbb3B0aW9uXSA9IChvcHRpb25zIGFzIGFueSlbb3B0aW9uXVxuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqINCV0YHQu9C4INC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjCDQt9Cw0LTQsNC10YIg0YDQsNC30LzQtdGAINC/0LvQvtGB0LrQvtGB0YLQuCwg0L3QviDQv9GA0Lgg0Y3RgtC+0Lwg0L3QsCDQt9Cw0LTQsNC10YIg0L3QsNGH0LDQu9GM0L3QvtC1INC/0L7Qu9C+0LbQtdC90LjQtSDQvtCx0LvQsNGB0YLQuCDQv9GA0L7RgdC80L7RgtGA0LAsINGC0L5cbiAgICAgKiDQvtCx0LvQsNGB0YLRjCDQv9GA0L7RgdC80L7RgtGA0LAg0L/QvtC80LXRidCw0LXRgtGB0Y8g0LIg0YbQtdC90YLRgCDQt9Cw0LTQsNC90L3QvtC5INC/0LvQvtGB0LrQvtGB0YLQuC5cbiAgICAgKi9cbiAgICBpZiAob3B0aW9ucy5oYXNPd25Qcm9wZXJ0eSgnZ3JpZFNpemUnKSAmJiAhb3B0aW9ucy5oYXNPd25Qcm9wZXJ0eSgnY2FtZXJhJykpIHtcbiAgICAgIHRoaXMuY2FtZXJhID0ge1xuICAgICAgICB4OiB0aGlzLmdyaWRTaXplLndpZHRoIC8gMixcbiAgICAgICAgeTogdGhpcy5ncmlkU2l6ZS5oZWlnaHQgLyAyLFxuICAgICAgICB6b29tOiAxXG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog0JXRgdC70Lgg0LfQsNC/0YDQvtGI0LXQvSDQtNC10LzQvi3RgNC10LbQuNC8LCDRgtC+INC00LvRjyDQuNGC0LXRgNC40YDQvtCy0LDQvdC40Y8g0L7QsdGK0LXQutGC0L7QsiDQsdGD0LTQtdGCINC40YHQv9C+0LvRjNC30L7QstCw0YLRjNGB0Y8g0LLQvdGD0YLRgNC10L3QvdC40Lkg0LjQvNC40YLQuNGA0YPRjtGJ0LjQuSDQuNGC0LXRgNC40YDQvtCy0LDQvdC40LVcbiAgICAgKiDQvNC10YLQvtC0LiDQn9GA0Lgg0Y3RgtC+0Lwg0LLQvdC10YjQvdGP0Y8g0YTRg9C90LrRhtC40Y8g0LjRgtC10YDQuNGA0L7QstCw0L3QuNGPINC40YHQv9C+0LvRjNC30L7QstCw0L3QsCDQvdC1INCx0YPQtNC10YIuXG4gICAgICovXG4gICAgaWYgKHRoaXMuZGVtb01vZGUuaXNFbmFibGUpIHtcbiAgICAgIHRoaXMuaXRlcmF0aW9uQ2FsbGJhY2sgPSB0aGlzLmRlbW9JdGVyYXRpb25DYWxsYmFja1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDQodC+0LfQtNCw0LXRgiDRiNC10LnQtNC10YAgV2ViR0wuXG4gICAqXG4gICAqIEBwYXJhbSBzaGFkZXJUeXBlINCi0LjQvyDRiNC10LnQtNC10YDQsC5cbiAgICogQHBhcmFtIHNoYWRlckNvZGUg0JrQvtC0INGI0LXQudC00LXRgNCwINC90LAg0Y/Qt9GL0LrQtSBHTFNMLlxuICAgKiBAcmV0dXJucyDQodC+0LfQtNCw0L3QvdGL0Lkg0L7QsdGK0LXQutGCINGI0LXQudC00LXRgNCwLlxuICAgKi9cbiAgcHJvdGVjdGVkIGNyZWF0ZVdlYkdsU2hhZGVyKHNoYWRlclR5cGU6IFdlYkdsU2hhZGVyVHlwZSwgc2hhZGVyQ29kZTogc3RyaW5nKTogV2ViR0xTaGFkZXIge1xuXG4gICAgLy8g0KHQvtC30LTQsNC90LjQtSwg0L/RgNC40LLRj9C30LrQsCDQutC+0LTQsCDQuCDQutC+0LzQv9C40LvRj9GG0LjRjyDRiNC10LnQtNC10YDQsC5cbiAgICBjb25zdCBzaGFkZXIgPSB0aGlzLmdsLmNyZWF0ZVNoYWRlcih0aGlzLmdsW3NoYWRlclR5cGVdKSBhcyBXZWJHTFNoYWRlclxuICAgIHRoaXMuZ2wuc2hhZGVyU291cmNlKHNoYWRlciwgc2hhZGVyQ29kZSlcbiAgICB0aGlzLmdsLmNvbXBpbGVTaGFkZXIoc2hhZGVyKVxuXG4gICAgaWYgKCF0aGlzLmdsLmdldFNoYWRlclBhcmFtZXRlcihzaGFkZXIsIHRoaXMuZ2wuQ09NUElMRV9TVEFUVVMpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ9Ce0YjQuNCx0LrQsCDQutC+0LzQv9C40LvRj9GG0LjQuCDRiNC10LnQtNC10YDQsCBbJyArIHNoYWRlclR5cGUgKyAnXS4gJyArIHRoaXMuZ2wuZ2V0U2hhZGVySW5mb0xvZyhzaGFkZXIpKVxuICAgIH1cblxuICAgIC8vINCS0YvQstC+0LQg0L7RgtC70LDQtNC+0YfQvdC+0Lkg0LjQvdGE0L7RgNC80LDRhtC40LguXG4gICAgaWYgKHRoaXMuZGVidWdNb2RlLmlzRW5hYmxlKSB7XG4gICAgICBjb25zb2xlLmdyb3VwKCclY9Ch0L7Qt9C00LDQvSDRiNC10LnQtNC10YAgWycgKyBzaGFkZXJUeXBlICsgJ10nLCB0aGlzLmRlYnVnTW9kZS5ncm91cFN0eWxlKVxuICAgICAge1xuICAgICAgICBjb25zb2xlLmxvZyhzaGFkZXJDb2RlKVxuICAgICAgfVxuICAgICAgY29uc29sZS5ncm91cEVuZCgpXG4gICAgfVxuXG4gICAgcmV0dXJuIHNoYWRlclxuICB9XG5cbiAgLyoqXG4gICAqINCh0L7Qt9C00LDQtdGCINC/0YDQvtCz0YDQsNC80LzRgyBXZWJHTC5cbiAgICpcbiAgICogQHBhcmFtIHtXZWJHTFNoYWRlcn0gdmVydGV4U2hhZGVyINCS0LXRgNGI0LjQvdC90YvQuSDRiNC10LnQtNC10YAuXG4gICAqIEBwYXJhbSB7V2ViR0xTaGFkZXJ9IGZyYWdtZW50U2hhZGVyINCk0YDQsNCz0LzQtdC90YLQvdGL0Lkg0YjQtdC50LTQtdGALlxuICAgKi9cbiAgcHJvdGVjdGVkIGNyZWF0ZVdlYkdsUHJvZ3JhbSh2ZXJ0ZXhTaGFkZXI6IFdlYkdMU2hhZGVyLCBmcmFnbWVudFNoYWRlcjogV2ViR0xTaGFkZXIpOiB2b2lkIHtcblxuICAgIHRoaXMuZ3B1UHJvZ3JhbSA9IHRoaXMuZ2wuY3JlYXRlUHJvZ3JhbSgpIGFzIFdlYkdMUHJvZ3JhbVxuXG4gICAgdGhpcy5nbC5hdHRhY2hTaGFkZXIodGhpcy5ncHVQcm9ncmFtLCB2ZXJ0ZXhTaGFkZXIpXG4gICAgdGhpcy5nbC5hdHRhY2hTaGFkZXIodGhpcy5ncHVQcm9ncmFtLCBmcmFnbWVudFNoYWRlcilcbiAgICB0aGlzLmdsLmxpbmtQcm9ncmFtKHRoaXMuZ3B1UHJvZ3JhbSlcblxuICAgIGlmICghdGhpcy5nbC5nZXRQcm9ncmFtUGFyYW1ldGVyKHRoaXMuZ3B1UHJvZ3JhbSwgdGhpcy5nbC5MSU5LX1NUQVRVUykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcign0J7RiNC40LHQutCwINGB0L7Qt9C00LDQvdC40Y8g0L/RgNC+0LPRgNCw0LzQvNGLIFdlYkdMLiAnICsgdGhpcy5nbC5nZXRQcm9ncmFtSW5mb0xvZyh0aGlzLmdwdVByb2dyYW0pKVxuICAgIH1cblxuICAgIHRoaXMuZ2wudXNlUHJvZ3JhbSh0aGlzLmdwdVByb2dyYW0pXG4gIH1cblxuICAvKipcbiAgICog0KPRgdGC0LDQvdCw0LLQu9C40LLQsNC10YIg0YHQstGP0LfRjCDQv9C10YDQtdC80LXQvdC90L7QuSDQv9GA0LjQu9C+0LbQtdC90LjRjyDRgSDQv9GA0L7Qs9GA0LDQvNC80L7QuSBXZWJHbC5cbiAgICpcbiAgICogQHBhcmFtIHZhclR5cGUg0KLQuNC/INC/0LXRgNC10LzQtdC90L3QvtC5LlxuICAgKiBAcGFyYW0gdmFyTmFtZSDQmNC80Y8g0L/QtdGA0LXQvNC10L3QvdC+0LkuXG4gICAqL1xuICBwcm90ZWN0ZWQgc2V0V2ViR2xWYXJpYWJsZSh2YXJUeXBlOiBXZWJHbFZhcmlhYmxlVHlwZSwgdmFyTmFtZTogc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKHZhclR5cGUgPT09ICd1bmlmb3JtJykge1xuICAgICAgdGhpcy52YXJpYWJsZXNbdmFyTmFtZV0gPSB0aGlzLmdsLmdldFVuaWZvcm1Mb2NhdGlvbih0aGlzLmdwdVByb2dyYW0sIHZhck5hbWUpXG4gICAgfSBlbHNlIGlmICh2YXJUeXBlID09PSAnYXR0cmlidXRlJykge1xuICAgICAgdGhpcy52YXJpYWJsZXNbdmFyTmFtZV0gPSB0aGlzLmdsLmdldEF0dHJpYkxvY2F0aW9uKHRoaXMuZ3B1UHJvZ3JhbSwgdmFyTmFtZSlcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICog0KHQvtC30LTQsNC10YIg0Lgg0LfQsNC/0L7Qu9C90Y/QtdGCINC00LDQvdC90YvQvNC4INC+0LHQviDQstGB0LXRhSDQv9C+0LvQuNCz0L7QvdCw0YUg0LHRg9GE0LXRgNGLIFdlYkdMLlxuICAgKi9cbiAgcHJvdGVjdGVkIGNyZWF0ZVdiR2xCdWZmZXJzKCk6IHZvaWQge1xuXG4gICAgLy8g0JLRi9Cy0L7QtCDQvtGC0LvQsNC00L7Rh9C90L7QuSDQuNC90YTQvtGA0LzQsNGG0LjQuC5cbiAgICBpZiAodGhpcy5kZWJ1Z01vZGUuaXNFbmFibGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKCclY9CX0LDQv9GD0YnQtdC9INC/0YDQvtGG0LXRgdGBINC30LDQs9GA0YPQt9C60Lgg0LTQsNC90L3Ri9GFIFsnICsgZ2V0Q3VycmVudFRpbWUoKSArICddLi4uJywgdGhpcy5kZWJ1Z01vZGUuZ3JvdXBTdHlsZSlcblxuICAgICAgLy8g0JfQsNC/0YPRgdC6INC60L7QvdGB0L7Qu9GM0L3QvtCz0L4g0YLQsNC50LzQtdGA0LAsINC40LfQvNC10YDRj9GO0YnQtdCz0L4g0LTQu9C40YLQtdC70YzQvdC+0YHRgtGMINC/0YDQvtGG0LXRgdGB0LAg0LfQsNCz0YDRg9C30LrQuCDQtNCw0L3QvdGL0YUg0LIg0LLQuNC00LXQvtC/0LDQvNGP0YLRjC5cbiAgICAgIGNvbnNvbGUudGltZSgn0JTQu9C40YLQtdC70YzQvdC+0YHRgtGMJylcbiAgICB9XG5cbiAgICBsZXQgcG9seWdvbkdyb3VwOiBTUGxvdFBvbHlnb25Hcm91cCB8IG51bGxcblxuICAgIC8vINCY0YLQtdGA0LjRgNC+0LLQsNC90LjQtSDQs9GA0YPQv9C/INC/0L7Qu9C40LPQvtC90L7Qsi5cbiAgICB3aGlsZSAocG9seWdvbkdyb3VwID0gdGhpcy5jcmVhdGVQb2x5Z29uR3JvdXAoKSkge1xuXG4gICAgICAvLyDQodC+0LfQtNCw0L3QuNC1INC4INC30LDQv9C+0LvQvdC10L3QuNC1INCx0YPRhNC10YDQvtCyINC00LDQvdC90YvQvNC4INC+INGC0LXQutGD0YnQtdC5INCz0YDRg9C/0L/QtSDQv9C+0LvQuNCz0L7QvdC+0LIuXG4gICAgICB0aGlzLmFkZFdiR2xCdWZmZXIodGhpcy5idWZmZXJzLnZlcnRleEJ1ZmZlcnMsICdBUlJBWV9CVUZGRVInLCBuZXcgRmxvYXQzMkFycmF5KHBvbHlnb25Hcm91cC52ZXJ0aWNlcyksIDApXG4gICAgICB0aGlzLmFkZFdiR2xCdWZmZXIodGhpcy5idWZmZXJzLmNvbG9yQnVmZmVycywgJ0FSUkFZX0JVRkZFUicsIG5ldyBVaW50OEFycmF5KHBvbHlnb25Hcm91cC5jb2xvcnMpLCAxKVxuICAgICAgdGhpcy5hZGRXYkdsQnVmZmVyKHRoaXMuYnVmZmVycy5zaXplQnVmZmVycywgJ0FSUkFZX0JVRkZFUicsIG5ldyBGbG9hdDMyQXJyYXkocG9seWdvbkdyb3VwLnNpemVzKSwgMSlcbiAgICAgIHRoaXMuYWRkV2JHbEJ1ZmZlcih0aGlzLmJ1ZmZlcnMuaW5kZXhCdWZmZXJzLCAnRUxFTUVOVF9BUlJBWV9CVUZGRVInLCBuZXcgVWludDE2QXJyYXkocG9seWdvbkdyb3VwLmluZGljZXMpLCAyKVxuXG4gICAgICAvLyDQodGH0LXRgtGH0LjQuiDQutC+0LvQuNGH0LXRgdGC0LLQsCDQsdGD0YTQtdGA0L7Qsi5cbiAgICAgIHRoaXMuYnVmZmVycy5hbW91bnRPZkJ1ZmZlckdyb3VwcysrXG5cbiAgICAgIC8vINCh0YfQtdGC0YfQuNC6INC60L7Qu9C40YfQtdGB0YLQstCwINCy0LXRgNGI0LjQvSBHTC3RgtGA0LXRg9Cz0L7Qu9GM0L3QuNC60L7QsiDRgtC10LrRg9GJ0LXQuSDQs9GA0YPQv9C/0Ysg0LHRg9GE0LXRgNC+0LIuXG4gICAgICB0aGlzLmJ1ZmZlcnMuYW1vdW50T2ZHTFZlcnRpY2VzLnB1c2gocG9seWdvbkdyb3VwLmFtb3VudE9mR0xWZXJ0aWNlcylcblxuICAgICAgLy8g0KHRh9C10YLRh9C40Log0L7QsdGJ0LXQs9C+INC60L7Qu9C40YfQtdGB0YLQstCwINCy0LXRgNGI0LjQvSBHTC3RgtGA0LXRg9Cz0L7Qu9GM0L3QuNC60L7Qsi5cbiAgICAgIHRoaXMuYnVmZmVycy5hbW91bnRPZlRvdGFsR0xWZXJ0aWNlcyArPSBwb2x5Z29uR3JvdXAuYW1vdW50T2ZHTFZlcnRpY2VzXG4gICAgfVxuXG4gICAgLy8g0JLRi9Cy0L7QtCDQvtGC0LvQsNC00L7Rh9C90L7QuSDQuNC90YTQvtGA0LzQsNGG0LjQuC5cbiAgICBpZiAodGhpcy5kZWJ1Z01vZGUuaXNFbmFibGUpIHtcbiAgICAgIHRoaXMucmVwb3J0QWJvdXRPYmplY3RSZWFkaW5nKClcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICog0KHRh9C40YLRi9Cy0LDQtdGCINC00LDQvdC90YvQtSDQvtCxINC40YHRhdC+0LTQvdGL0YUg0L7QsdGK0LXQutGC0LDRhSDQuCDRhNC+0YDQvNC40YDRg9C10YIg0YHQvtC+0YLQstC10YLRgdCy0YPRjtGJ0YPRjiDRjdGC0LjQvCDQvtCx0YrQtdC60YLQsNC8INCz0YDRg9C/0L/RgyDQv9C+0LvQuNCz0L7QvdC+0LIuXG4gICAqXG4gICAqIEByZW1hcmtzXG4gICAqINCT0YDRg9C/0L/QsCDRhNC+0YDQvNC40YDRg9C10YLRgdGPINGBINGD0YfQtdGC0L7QvCDRgtC10YXQvdC40YfQtdGB0LrQvtCz0L4g0L7Qs9GA0LDQvdC40YfQtdC90LjRjyDQvdCwINC60L7Qu9C40YfQtdGB0YLQstC+INCy0LXRgNGI0LjQvSDQsiDQs9GA0YPQv9C/0LUg0Lgg0LvQuNC80LjRgtCwINC90LAg0L7QsdGJ0LXQtSDQutC+0LvQuNGH0LXRgdGC0LLQvlxuICAgKiDQv9C+0LvQuNCz0L7QvdC+0LIg0L3QsCDQutCw0L3QstCw0YHQtS5cbiAgICpcbiAgICogQHJldHVybnMg0KHQvtC30LTQsNC90L3QsNGPINCz0YDRg9C/0L/QsCDQv9C+0LvQuNCz0L7QvdC+0LIg0LjQu9C4IG51bGwsINC10YHQu9C4INGE0L7RgNC80LjRgNC+0LLQsNC90LjQtSDQstGB0LXRhSDQs9GA0YPQv9C/INC/0L7Qu9C40LPQvtC90L7QsiDQt9Cw0LLQtdGA0YjQuNC70L7RgdGMLlxuICAgKi9cbiAgcHJvdGVjdGVkIGNyZWF0ZVBvbHlnb25Hcm91cCgpOiBTUGxvdFBvbHlnb25Hcm91cCB8IG51bGwge1xuXG4gICAgbGV0IHBvbHlnb25Hcm91cDogU1Bsb3RQb2x5Z29uR3JvdXAgPSB7XG4gICAgICB2ZXJ0aWNlczogW10sXG4gICAgICBpbmRpY2VzOiBbXSxcbiAgICAgIGNvbG9yczogW10sXG4gICAgICBzaXplczogW10sXG4gICAgICBhbW91bnRPZlZlcnRpY2VzOiAwLFxuICAgICAgYW1vdW50T2ZHTFZlcnRpY2VzOiAwXG4gICAgfVxuXG4gICAgbGV0IHBvbHlnb246IFNQbG90UG9seWdvbiB8IG51bGxcblxuICAgIC8qKlxuICAgICAqINCV0YHQu9C4INC60L7Qu9C40YfQtdGB0YLQstC+INC/0L7Qu9C40LPQvtC90L7QsiDQutCw0L3QstCw0YHQsCDQtNC+0YHRgtC40LPQu9C+INC00L7Qv9GD0YHRgtC40LzQvtCz0L4g0LzQsNC60YHQuNC80YPQvNCwLCDRgtC+INC00LDQu9GM0L3QtdC50YjQsNGPINC+0LHRgNCw0LHQvtGC0LrQsCDQuNGB0YXQvtC00L3Ri9GFINC+0LHRitC10LrRgtC+0LJcbiAgICAgKiDQv9GA0LjQvtGB0YLQsNC90LDQstC70LjQstCw0LXRgtGB0Y8gLSDRhNC+0YDQvNC40YDQvtCy0LDQvdC40LUg0LPRgNGD0L/QvyDQv9C+0LvQuNCz0L7QvdC+0LIg0LfQsNCy0LXRgNGI0LDQtdGC0YHRjyDQstC+0LfQstGA0LDRgtC+0Lwg0LfQvdCw0YfQtdC90LjRjyBudWxsICjRgdC40LzRg9C70Y/RhtC40Y8g0LTQvtGB0YLQuNC20LXQvdC40Y9cbiAgICAgKiDQv9C+0YHQu9C10LTQvdC10LPQviDQvtCx0YDQsNCx0LDRgtGL0LLQsNC10LzQvtCz0L4g0LjRgdGF0L7QtNC90L7Qs9C+INC+0LHRitC10LrRgtCwKS5cbiAgICAgKi9cbiAgICBpZiAodGhpcy5hbW91bnRPZlBvbHlnb25zID49IHRoaXMubWF4QW1vdW50T2ZQb2x5Z29ucykgcmV0dXJuIG51bGxcblxuICAgIC8vINCY0YLQtdGA0LjRgNC+0LLQsNC90LjQtSDQuNGB0YXQvtC00L3Ri9GFINC+0LHRitC10LrRgtC+0LIuXG4gICAgd2hpbGUgKHBvbHlnb24gPSB0aGlzLml0ZXJhdGlvbkNhbGxiYWNrISgpKSB7XG5cbiAgICAgIC8vINCU0L7QsdCw0LLQu9C10L3QuNC1INCyINCz0YDRg9C/0L/RgyDQv9C+0LvQuNCz0L7QvdC+0LIg0L3QvtCy0L7Qs9C+INC/0L7Qu9C40LPQvtC90LAuXG4gICAgICB0aGlzLmFkZFBvbHlnb24ocG9seWdvbkdyb3VwLCBwb2x5Z29uKVxuXG4gICAgICAvLyDQodGH0LXRgtGH0LjQuiDRh9C40YHQu9CwINC/0YDQuNC80LXQvdC10L3QuNC5INC60LDQttC00L7QuSDQuNC3INGE0L7RgNC8INC/0L7Qu9C40LPQvtC90L7Qsi5cbiAgICAgIHRoaXMuYnVmZmVycy5hbW91bnRPZlNoYXBlc1twb2x5Z29uLnNoYXBlXSsrXG5cbiAgICAgIC8vINCh0YfQtdGC0YfQuNC6INC+0LHRidC10LPQviDQutC+0LvQuNGH0LXRgdGC0LLQviDQv9C+0LvQuNCz0L7QvdC+0LIuXG4gICAgICB0aGlzLmFtb3VudE9mUG9seWdvbnMrK1xuXG4gICAgICAvKipcbiAgICAgICAqINCV0YHQu9C4INC60L7Qu9C40YfQtdGB0YLQstC+INC/0L7Qu9C40LPQvtC90L7QsiDQutCw0L3QstCw0YHQsCDQtNC+0YHRgtC40LPQu9C+INC00L7Qv9GD0YHRgtC40LzQvtCz0L4g0LzQsNC60YHQuNC80YPQvNCwLCDRgtC+INC00LDQu9GM0L3QtdC50YjQsNGPINC+0LHRgNCw0LHQvtGC0LrQsCDQuNGB0YXQvtC00L3Ri9GFINC+0LHRitC10LrRgtC+0LJcbiAgICAgICAqINC/0YDQuNC+0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdGC0YHRjyAtINGE0L7RgNC80LjRgNC+0LLQsNC90LjQtSDQs9GA0YPQv9C/INC/0L7Qu9C40LPQvtC90L7QsiDQt9Cw0LLQtdGA0YjQsNC10YLRgdGPINCy0L7Qt9Cy0YDQsNGC0L7QvCDQt9C90LDRh9C10L3QuNGPIG51bGwgKNGB0LjQvNGD0LvRj9GG0LjRjyDQtNC+0YHRgtC40LbQtdC90LjRj1xuICAgICAgICog0L/QvtGB0LvQtdC00L3QtdCz0L4g0L7QsdGA0LDQsdCw0YLRi9Cy0LDQtdC80L7Qs9C+INC40YHRhdC+0LTQvdC+0LPQviDQvtCx0YrQtdC60YLQsCkuXG4gICAgICAgKi9cbiAgICAgIGlmICh0aGlzLmFtb3VudE9mUG9seWdvbnMgPj0gdGhpcy5tYXhBbW91bnRPZlBvbHlnb25zKSBicmVha1xuXG4gICAgICAvKipcbiAgICAgICAqINCV0YHQu9C4INC+0LHRidC10LUg0LrQvtC70LjRh9C10YHRgtCy0L4g0LLRgdC10YUg0LLQtdGA0YjQuNC9INCyINCz0YDRg9C/0L/QtSDQv9C+0LvQuNCz0L7QvdC+0LIg0L/RgNC10LLRi9GB0LjQu9C+INGC0LXRhdC90LjRh9C10YHQutC+0LUg0L7Qs9GA0LDQvdC40YfQtdC90LjQtSwg0YLQviDQs9GA0YPQv9C/0LAg0L/QvtC70LjQs9C+0L3QvtCyXG4gICAgICAgKiDRgdGH0LjRgtCw0LXRgtGB0Y8g0YHRhNC+0YDQvNC40YDQvtCy0LDQvdC90L7QuSDQuCDQuNGC0LXRgNC40YDQvtCy0LDQvdC40LUg0LjRgdGF0L7QtNC90YvRhSDQvtCx0YrQtdC60YLQvtCyINC/0YDQuNC+0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdGC0YHRjy5cbiAgICAgICAqL1xuICAgICAgaWYgKHBvbHlnb25Hcm91cC5hbW91bnRPZlZlcnRpY2VzID49IHRoaXMubWF4QW1vdW50T2ZWZXJ0ZXhQZXJQb2x5Z29uR3JvdXApIGJyZWFrXG4gICAgfVxuXG4gICAgLy8g0KHRh9C10YLRh9C40Log0L7QsdGJ0LXQs9C+INC60L7Qu9C40YfQtdGB0YLQstCwINCy0LXRgNGI0LjQvSDQstGB0LXRhSDQstC10YDRiNC40L3QvdGL0YUg0LHRg9GE0LXRgNC+0LIuXG4gICAgdGhpcy5idWZmZXJzLmFtb3VudE9mVG90YWxWZXJ0aWNlcyArPSBwb2x5Z29uR3JvdXAuYW1vdW50T2ZWZXJ0aWNlc1xuXG4gICAgLy8g0JXRgdC70Lgg0LPRgNGD0L/Qv9CwINC/0L7Qu9C40LPQvtC90L7QsiDQvdC10L/Rg9GB0YLQsNGPLCDRgtC+INCy0L7Qt9Cy0YDQsNGJ0LDQtdC8INC10LUuINCV0YHQu9C4INC/0YPRgdGC0LDRjyAtINCy0L7Qt9Cy0YDQsNGJ0LDQtdC8IG51bGwuXG4gICAgcmV0dXJuIChwb2x5Z29uR3JvdXAuYW1vdW50T2ZWZXJ0aWNlcyA+IDApID8gcG9seWdvbkdyb3VwIDogbnVsbFxuICB9XG5cbiAgLyoqXG4gICAqINCh0L7Qt9C00LDQtdGCINCyINC80LDRgdGB0LjQstC1INCx0YPRhNC10YDQvtCyIFdlYkdMINC90L7QstGL0Lkg0LHRg9GE0LXRgCDQuCDQt9Cw0L/QuNGB0YvQstCw0LXRgiDQsiDQvdC10LPQviDQv9C10YDQtdC00LDQvdC90YvQtSDQtNCw0L3QvdGL0LUuXG4gICAqXG4gICAqIEBwYXJhbSBidWZmZXJzIC0g0JzQsNGB0YHQuNCyINCx0YPRhNC10YDQvtCyIFdlYkdMLCDQsiDQutC+0YLQvtGA0YvQuSDQsdGD0LTQtdGCINC00L7QsdCw0LLQu9C10L0g0YHQvtC30LTQsNCy0LDQtdC80YvQuSDQsdGD0YTQtdGALlxuICAgKiBAcGFyYW0gdHlwZSAtINCi0LjQvyDRgdC+0LfQtNCw0LLQsNC10LzQvtCz0L4g0LHRg9GE0LXRgNCwLlxuICAgKiBAcGFyYW0gZGF0YSAtINCU0LDQvdC90YvQtSDQsiDQstC40LTQtSDRgtC40L/QuNC30LjRgNC+0LLQsNC90L3QvtCz0L4g0LzQsNGB0YHQuNCy0LAg0LTQu9GPINC30LDQv9C40YHQuCDQsiDRgdC+0LfQtNCw0LLQsNC10LzRi9C5INCx0YPRhNC10YAuXG4gICAqIEBwYXJhbSBrZXkgLSDQmtC70Y7RhyAo0LjQvdC00LXQutGBKSwg0LjQtNC10L3RgtC40YTQuNGG0LjRgNGD0Y7RidC40Lkg0YLQuNC/INCx0YPRhNC10YDQsCAo0LTQu9GPINCy0LXRgNGI0LjQvSwg0LTQu9GPINGG0LLQtdGC0L7Qsiwg0LTQu9GPINC40L3QtNC10LrRgdC+0LIpLiDQmNGB0L/QvtC70YzQt9GD0LXRgtGB0Y8g0LTQu9GPXG4gICAqICAgICDRgNCw0LfQtNC10LvRjNC90L7Qs9C+INC/0L7QtNGB0YfQtdGC0LAg0L/QsNC80Y/RgtC4LCDQt9Cw0L3QuNC80LDQtdC80L7QuSDQutCw0LbQtNGL0Lwg0YLQuNC/0L7QvCDQsdGD0YTQtdGA0LAuXG4gICAqL1xuICBwcm90ZWN0ZWQgYWRkV2JHbEJ1ZmZlcihidWZmZXJzOiBXZWJHTEJ1ZmZlcltdLCB0eXBlOiBXZWJHbEJ1ZmZlclR5cGUsIGRhdGE6IFR5cGVkQXJyYXksIGtleTogbnVtYmVyKTogdm9pZCB7XG5cbiAgICAvLyDQntC/0YDQtdC00LXQu9C10L3QuNC1INC40L3QtNC10LrRgdCwINC90L7QstC+0LPQviDRjdC70LXQvNC10L3RgtCwINCyINC80LDRgdGB0LjQstC1INCx0YPRhNC10YDQvtCyIFdlYkdMLlxuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5idWZmZXJzLmFtb3VudE9mQnVmZmVyR3JvdXBzXG5cbiAgICAvLyDQodC+0LfQtNCw0L3QuNC1INC4INC30LDQv9C+0LvQvdC10L3QuNC1INC00LDQvdC90YvQvNC4INC90L7QstC+0LPQviDQsdGD0YTQtdGA0LAuXG4gICAgYnVmZmVyc1tpbmRleF0gPSB0aGlzLmdsLmNyZWF0ZUJ1ZmZlcigpIVxuICAgIHRoaXMuZ2wuYmluZEJ1ZmZlcih0aGlzLmdsW3R5cGVdLCBidWZmZXJzW2luZGV4XSlcbiAgICB0aGlzLmdsLmJ1ZmZlckRhdGEodGhpcy5nbFt0eXBlXSwgZGF0YSwgdGhpcy5nbC5TVEFUSUNfRFJBVylcblxuICAgIC8vINCh0YfQtdGC0YfQuNC6INC/0LDQvNGP0YLQuCwg0LfQsNC90LjQvNCw0LXQvNC+0Lkg0LHRg9GE0LXRgNCw0LzQuCDQtNCw0L3QvdGL0YUgKNGA0LDQt9C00LXQu9GM0L3QviDQv9C+INC60LDQttC00L7QvNGDINGC0LjQv9GDINCx0YPRhNC10YDQvtCyKVxuICAgIHRoaXMuYnVmZmVycy5zaXplSW5CeXRlc1trZXldICs9IGRhdGEubGVuZ3RoICogZGF0YS5CWVRFU19QRVJfRUxFTUVOVFxuICB9XG5cbiAgcHJvdGVjdGVkIGdldFZlcnRpY2VzT2ZQb2ludCh4OiBudW1iZXIsIHk6IG51bWJlciwgc2l6ZTogbnVtYmVyKTogU1Bsb3RQb2x5Z29uVmVydGljZXMge1xuICAgIHJldHVybiB7XG4gICAgICB2YWx1ZXM6IFt4LCB5XSxcbiAgICAgIGluZGljZXM6IFswLCAwLCAwXSxcbiAgICAgIHNpemU6IHNpemVcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICog0KHQvtC30LTQsNC10YIg0Lgg0LTQvtCx0LDQstC70Y/QtdGCINCyINCz0YDRg9C/0L/RgyDQv9C+0LvQuNCz0L7QvdC+0LIg0L3QvtCy0YvQuSDQv9C+0LvQuNCz0L7QvS5cbiAgICpcbiAgICogQHBhcmFtIHBvbHlnb25Hcm91cCAtINCT0YDRg9C/0L/QsCDQv9C+0LvQuNCz0L7QvdC+0LIsINCyINC60L7RgtC+0YDRg9GOINC/0YDQvtC40YHRhdC+0LTQuNGCINC00L7QsdCw0LLQu9C10L3QuNC1LlxuICAgKiBAcGFyYW0gcG9seWdvbiAtINCY0L3RhNC+0YDQvNCw0YbQuNGPINC+INC00L7QsdCw0LLQu9GP0LXQvNC+0Lwg0L/QvtC70LjQs9C+0L3QtS5cbiAgICovXG4gIHByb3RlY3RlZCBhZGRQb2x5Z29uKHBvbHlnb25Hcm91cDogU1Bsb3RQb2x5Z29uR3JvdXAsIHBvbHlnb246IFNQbG90UG9seWdvbik6IHZvaWQge1xuXG4gICAgLyoqXG4gICAgICog0JIg0LfQsNCy0LjRgdC40LzQvtGB0YLQuCDQvtGCINGE0L7RgNC80Ysg0L/QvtC70LjQs9C+0L3QsCDQuCDQutC+0L7RgNC00LjQvdCw0YIg0LXQs9C+INGG0LXQvdGC0YDQsCDQstGL0LfRi9Cy0LDQtdGC0YHRjyDRgdC+0L7RgtCy0LXRgtGB0LLRg9GO0YnQsNGPINGE0YPQvdC60YbQuNGPINC90LDRhdC+0LbQtNC10L3QuNGPINC60L7QvtGA0LTQuNC90LDRgiDQtdCz0L5cbiAgICAgKiDQstC10YDRiNC40L0uXG4gICAgICovXG4gICAgY29uc3QgdmVydGljZXMgPSB0aGlzLnNoYXBlc1twb2x5Z29uLnNoYXBlXS5jYWxjKFxuICAgICAgcG9seWdvbi54LCBwb2x5Z29uLnksIHBvbHlnb24uc2l6ZVxuICAgIClcblxuICAgIC8vINCa0L7Qu9C40YfQtdGB0YLQstC+INCy0LXRgNGI0LjQvSAtINGN0YLQviDQutC+0LvQuNGH0LXRgdGC0LLQviDQv9Cw0YAg0YfQuNGB0LXQuyDQsiDQvNCw0YHRgdC40LLQtSDQstC10YDRiNC40L0uXG4gICAgY29uc3QgYW1vdW50T2ZWZXJ0aWNlcyA9IE1hdGgudHJ1bmModmVydGljZXMudmFsdWVzLmxlbmd0aCAvIDIpXG5cbiAgICAvLyDQndCw0YXQvtC20LTQtdC90LjQtSDQuNC90LTQtdC60YHQsCDQv9C10YDQstC+0Lkg0LTQvtCx0LDQstC70Y/QtdC80L7QuSDQsiDQs9GA0YPQv9C/0YMg0L/QvtC70LjQs9C+0L3QvtCyINCy0LXRgNGI0LjQvdGLLlxuICAgIGNvbnN0IGluZGV4T2ZMYXN0VmVydGV4ID0gcG9seWdvbkdyb3VwLmFtb3VudE9mVmVydGljZXNcblxuICAgIC8qKlxuICAgICAqINCd0L7QvNC10YDQsCDQuNC90LTQtdC60YHQvtCyINCy0LXRgNGI0LjQvSAtINC+0YLQvdC+0YHQuNGC0LXQu9GM0L3Ri9C1LiDQlNC70Y8g0LLRi9GH0LjRgdC70LXQvdC40Y8g0LDQsdGB0L7Qu9GO0YLQvdGL0YUg0LjQvdC00LXQutGB0L7QsiDQvdC10L7QsdGF0L7QtNC40LzQviDQv9GA0LjQsdCw0LLQuNGC0Ywg0Log0L7RgtC90L7RgdC40YLQtdC70YzQvdGL0LxcbiAgICAgKiDQuNC90LTQtdC60YHQsNC8INC40L3QtNC10LrRgSDQv9C10YDQstC+0Lkg0LTQvtCx0LDQstC70Y/QtdC80L7QuSDQsiDQs9GA0YPQv9C/0YMg0L/QvtC70LjQs9C+0L3QvtCyINCy0LXRgNGI0LjQvdGLLlxuICAgICAqL1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmVydGljZXMuaW5kaWNlcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmVydGljZXMuaW5kaWNlc1tpXSArPSBpbmRleE9mTGFzdFZlcnRleFxuICAgIH1cblxuICAgIC8qKlxuICAgICAqINCU0L7QsdCw0LLQu9C10L3QuNC1INCyINCz0YDRg9C/0L/RgyDQv9C+0LvQuNCz0L7QvdC+0LIg0LjQvdC00LXQutGB0L7QsiDQstC10YDRiNC40L0g0L3QvtCy0L7Qs9C+INC/0L7Qu9C40LPQvtC90LAg0Lgg0L/QvtC00YHRh9C10YIg0L7QsdGJ0LXQs9C+INC60L7Qu9C40YfQtdGB0YLQstCwINCy0LXRgNGI0LjQvSBHTC3RgtGA0LXRg9Cz0L7Qu9GM0L3QuNC60L7QslxuICAgICAqINCyINCz0YDRg9C/0L/QtS5cbiAgICAgKi9cbiAgICBwb2x5Z29uR3JvdXAuaW5kaWNlcy5wdXNoKC4uLnZlcnRpY2VzLmluZGljZXMpXG4gICAgcG9seWdvbkdyb3VwLmFtb3VudE9mR0xWZXJ0aWNlcyArPSB2ZXJ0aWNlcy5pbmRpY2VzLmxlbmd0aFxuXG4gICAgLy8g0JTQvtCx0LDQstC70LXQvdC40LUg0LIg0LPRgNGD0L/Qv9GDINC/0L7Qu9C40LPQvtC90L7QsiDQstC10YDRiNC40L0g0L3QvtCy0L7Qs9C+INC/0L7Qu9C40LPQvtC90LAg0Lgg0L/QvtC00YHRh9C10YIg0L7QsdGJ0LXQs9C+INC60L7Qu9C40YfQtdGB0YLQstCwINCy0LXRgNGI0LjQvSDQsiDQs9GA0YPQv9C/0LUuXG4gICAgcG9seWdvbkdyb3VwLnZlcnRpY2VzLnB1c2goLi4udmVydGljZXMudmFsdWVzKVxuICAgIHBvbHlnb25Hcm91cC5hbW91bnRPZlZlcnRpY2VzICs9IGFtb3VudE9mVmVydGljZXNcblxuICAgIHBvbHlnb25Hcm91cC5zaXplcy5wdXNoKHZlcnRpY2VzLnNpemUpXG5cbiAgICAvLyDQlNC+0LHQsNCy0LvQtdC90LjQtSDRhtCy0LXRgtC+0LIg0LLQtdGA0YjQuNC9IC0g0L/QviDQvtC00L3QvtC80YMg0YbQstC10YLRgyDQvdCwINC60LDQttC00YPRjiDQstC10YDRiNC40L3Rgy5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFtb3VudE9mVmVydGljZXM7IGkrKykge1xuICAgICAgcG9seWdvbkdyb3VwLmNvbG9ycy5wdXNoKHBvbHlnb24uY29sb3IpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqINCS0YvQstC+0LTQuNGCINCx0LDQt9C+0LLRg9GOINGH0LDRgdGC0Ywg0L7RgtC70LDQtNC+0YfQvdC+0Lkg0LjQvdGE0L7RgNC80LDRhtC40LguXG4gICAqXG4gICAqIEBwYXJhbSBvcHRpb25zIC0g0J/QvtC70YzQt9C+0LLQsNGC0LXQu9GM0YHQutC40LUg0L3QsNGB0YLRgNC+0LnQutC4INGN0LrQt9C10LzQv9C70Y/RgNCwLlxuICAgKi9cbiAgcHJvdGVjdGVkIHJlcG9ydE1haW5JbmZvKG9wdGlvbnM6IFNQbG90T3B0aW9ucyk6IHZvaWQge1xuXG4gICAgY29uc29sZS5sb2coJyVj0JLQutC70Y7Rh9C10L0g0YDQtdC20LjQvCDQvtGC0LvQsNC00LrQuCAnICsgdGhpcy5jb25zdHJ1Y3Rvci5uYW1lICsgJyDQvdCwINC+0LHRitC10LrRgtC1IFsjJyArIHRoaXMuY2FudmFzLmlkICsgJ10nLFxuICAgICAgdGhpcy5kZWJ1Z01vZGUuaGVhZGVyU3R5bGUpXG5cbiAgICBpZiAodGhpcy5kZW1vTW9kZS5pc0VuYWJsZSkge1xuICAgICAgY29uc29sZS5sb2coJyVj0JLQutC70Y7Rh9C10L0g0LTQtdC80L7QvdGB0YLRgNCw0YbQuNC+0L3QvdGL0Lkg0YDQtdC20LjQvCDQtNCw0L3QvdGL0YUnLCB0aGlzLmRlYnVnTW9kZS5ncm91cFN0eWxlKVxuICAgIH1cblxuICAgIGNvbnNvbGUuZ3JvdXAoJyVj0J/RgNC10LTRg9C/0YDQtdC20LTQtdC90LjQtScsIHRoaXMuZGVidWdNb2RlLmdyb3VwU3R5bGUpXG4gICAge1xuICAgICAgY29uc29sZS5kaXIoJ9Ce0YLQutGA0YvRgtCw0Y8g0LrQvtC90YHQvtC70Ywg0LHRgNCw0YPQt9C10YDQsCDQuCDQtNGA0YPQs9C40LUg0LDQutGC0LjQstC90YvQtSDRgdGA0LXQtNGB0YLQstCwINC60L7QvdGC0YDQvtC70Y8g0YDQsNC30YDQsNCx0L7RgtC60Lgg0YHRg9GJ0LXRgdGC0LLQtdC90L3QviDRgdC90LjQttCw0Y7RgiDQv9GA0L7QuNC30LLQvtC00LjRgtC10LvRjNC90L7RgdGC0Ywg0LLRi9GB0L7QutC+0L3QsNCz0YDRg9C20LXQvdC90YvRhSDQv9GA0LjQu9C+0LbQtdC90LjQuS4g0JTQu9GPINC+0LHRitC10LrRgtC40LLQvdC+0LPQviDQsNC90LDQu9C40LfQsCDQv9GA0L7QuNC30LLQvtC00LjRgtC10LvRjNC90L7RgdGC0Lgg0LLRgdC1INC/0L7QtNC+0LHQvdGL0LUg0YHRgNC10LTRgdGC0LLQsCDQtNC+0LvQttC90Ysg0LHRi9GC0Ywg0L7RgtC60LvRjtGH0LXQvdGLLCDQsCDQutC+0L3RgdC+0LvRjCDQsdGA0LDRg9C30LXRgNCwINC30LDQutGA0YvRgtCwLiDQndC10LrQvtGC0L7RgNGL0LUg0LTQsNC90L3Ri9C1INC+0YLQu9Cw0LTQvtGH0L3QvtC5INC40L3RhNC+0YDQvNCw0YbQuNC4INCyINC30LDQstC40YHQuNC80L7RgdGC0Lgg0L7RgiDQuNGB0L/QvtC70YzQt9GD0LXQvNC+0LPQviDQsdGA0LDRg9C30LXRgNCwINC80L7Qs9GD0YIg0L3QtSDQvtGC0L7QsdGA0LDQttCw0YLRjNGB0Y8g0LjQu9C4INC+0YLQvtCx0YDQsNC20LDRgtGM0YHRjyDQvdC10LrQvtGA0YDQtdC60YLQvdC+LiDQodGA0LXQtNGB0YLQstC+INC+0YLQu9Cw0LTQutC4INC/0YDQvtGC0LXRgdGC0LjRgNC+0LLQsNC90L4g0LIg0LHRgNCw0YPQt9C10YDQtSBHb29nbGUgQ2hyb21lIHYuOTAnKVxuICAgIH1cbiAgICBjb25zb2xlLmdyb3VwRW5kKClcblxuICAgIGNvbnNvbGUuZ3JvdXAoJyVj0JLQuNC00LXQvtGB0LjRgdGC0LXQvNCwJywgdGhpcy5kZWJ1Z01vZGUuZ3JvdXBTdHlsZSlcbiAgICB7XG4gICAgICBsZXQgZXh0ID0gdGhpcy5nbC5nZXRFeHRlbnNpb24oJ1dFQkdMX2RlYnVnX3JlbmRlcmVyX2luZm8nKVxuICAgICAgbGV0IGdyYXBoaWNzQ2FyZE5hbWUgPSAoZXh0KSA/IHRoaXMuZ2wuZ2V0UGFyYW1ldGVyKGV4dC5VTk1BU0tFRF9SRU5ERVJFUl9XRUJHTCkgOiAnW9C90LXQuNC30LLQtdGB0YLQvdC+XSdcbiAgICAgIGNvbnNvbGUubG9nKCfQk9GA0LDRhNC40YfQtdGB0LrQsNGPINC60LDRgNGC0LA6ICcgKyBncmFwaGljc0NhcmROYW1lKVxuICAgICAgY29uc29sZS5sb2coJ9CS0LXRgNGB0LjRjyBHTDogJyArIHRoaXMuZ2wuZ2V0UGFyYW1ldGVyKHRoaXMuZ2wuVkVSU0lPTikpXG4gICAgfVxuICAgIGNvbnNvbGUuZ3JvdXBFbmQoKVxuXG4gICAgY29uc29sZS5ncm91cCgnJWPQndCw0YHRgtGA0L7QudC60LAg0L/QsNGA0LDQvNC10YLRgNC+0LIg0Y3QutC30LXQvNC/0LvRj9GA0LAnLCB0aGlzLmRlYnVnTW9kZS5ncm91cFN0eWxlKVxuICAgIHtcbiAgICAgIGNvbnNvbGUuZGlyKHRoaXMpXG4gICAgICBjb25zb2xlLmxvZygn0J/QvtC70YzQt9C+0LLQsNGC0LXQu9GM0YHQutC40LUg0L3QsNGB0YLRgNC+0LnQutC4OlxcbicsIGpzb25TdHJpbmdpZnkob3B0aW9ucykpXG4gICAgICBjb25zb2xlLmxvZygn0JrQsNC90LLQsNGBOiAjJyArIHRoaXMuY2FudmFzLmlkKVxuICAgICAgY29uc29sZS5sb2coJ9Cg0LDQt9C80LXRgCDQutCw0L3QstCw0YHQsDogJyArIHRoaXMuY2FudmFzLndpZHRoICsgJyB4ICcgKyB0aGlzLmNhbnZhcy5oZWlnaHQgKyAnIHB4JylcbiAgICAgIGNvbnNvbGUubG9nKCfQoNCw0LfQvNC10YAg0L/Qu9C+0YHQutC+0YHRgtC4OiAnICsgdGhpcy5ncmlkU2l6ZS53aWR0aCArICcgeCAnICsgdGhpcy5ncmlkU2l6ZS5oZWlnaHQgKyAnIHB4JylcbiAgICAgIGNvbnNvbGUubG9nKCfQoNCw0LfQvNC10YAg0L/QvtC70LjQs9C+0L3QsDogJyArIHRoaXMucG9seWdvblNpemUgKyAnIHB4JylcblxuICAgICAgLyoqXG4gICAgICAgKiBAdG9kbyDQntCx0YDQsNCx0L7RgtCw0YLRjCDRjdGC0L7RgiDQstGL0LLQvtC0INCyINC30LDQstC40YHQuNC80L7RgdGC0Lgg0L7RgiDRgdC/0L7RgdC+0LHQsCDQv9C+0LvRg9GH0LXQvdC40Y8g0LTQsNC90L3Ri9GFINC+INC/0L7Qu9C40LPQvtC90LDRhS4g0JLQstC10YHRgtC4INGC0LjQv9GLIC0g0LfQsNC00LDQvdC90LDRj1xuICAgICAgICog0YTRg9C90LrRhtC40Y8g0LjRgtC10YDQuNGA0L7QstCw0L3QuNGPLCDQtNC10LzQvi3QuNGC0LXRgNC40YDQvtCy0LDQvdC40LUsINC/0LXRgNC10LTQsNC90L3Ri9C5INC80LDRgdGB0LjQsiDQtNCw0L3QvdGL0YUuXG4gICAgICAgKi9cbiAgICAgIGlmICh0aGlzLmRlbW9Nb2RlLmlzRW5hYmxlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCfQodC/0L7RgdC+0LEg0L/QvtC70YPRh9C10L3QuNGPINC00LDQvdC90YvRhTogJyArICfQtNC10LzQvtC90YHRgtGA0LDRhtC40L7QvdC90LDRjyDRhNGD0L3QutGG0LjRjyDQuNGC0LXRgNC40YDQvtCy0LDQvdC40Y8nKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5sb2coJ9Ch0L/QvtGB0L7QsSDQv9C+0LvRg9GH0LXQvdC40Y8g0LTQsNC90L3Ri9GFOiAnICsgJ9C/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjNGB0LrQsNGPINGE0YPQvdC60YbQuNGPINC40YLQtdGA0LjRgNC+0LLQsNC90LjRjycpXG4gICAgICB9XG4gICAgfVxuICAgIGNvbnNvbGUuZ3JvdXBFbmQoKVxuICB9XG5cbiAgLyoqXG4gICAqINCS0YvQstC+0LTQuNGCINCyINC60L7QvdGB0L7Qu9GMINC+0YLQu9Cw0LTQvtGH0L3Rg9GOINC40L3RhNC+0YDQvNCw0YbQuNGOINC+INC30LDQs9GA0YPQt9C60LUg0LTQsNC90L3Ri9GFINCyINCy0LjQtNC10L7Qv9Cw0LzRj9GC0YwuXG4gICAqL1xuICBwcm90ZWN0ZWQgcmVwb3J0QWJvdXRPYmplY3RSZWFkaW5nKCk6IHZvaWQge1xuXG4gICAgY29uc29sZS5ncm91cCgnJWPQl9Cw0LPRgNGD0LfQutCwINC00LDQvdC90YvRhSDQt9Cw0LLQtdGA0YjQtdC90LAgWycgKyBnZXRDdXJyZW50VGltZSgpICsgJ10nLCB0aGlzLmRlYnVnTW9kZS5ncm91cFN0eWxlKVxuICAgIHtcbiAgICAgIGNvbnNvbGUudGltZUVuZCgn0JTQu9C40YLQtdC70YzQvdC+0YHRgtGMJylcblxuICAgICAgY29uc29sZS5sb2coJ9Cg0LXQt9GD0LvRjNGC0LDRgjogJyArXG4gICAgICAgICgodGhpcy5hbW91bnRPZlBvbHlnb25zID49IHRoaXMubWF4QW1vdW50T2ZQb2x5Z29ucykgPyAn0LTQvtGB0YLQuNCz0L3Rg9GCINC30LDQtNCw0L3QvdGL0Lkg0LvQuNC80LjRgiAoJyArXG4gICAgICAgICAgdGhpcy5tYXhBbW91bnRPZlBvbHlnb25zLnRvTG9jYWxlU3RyaW5nKCkgKyAnKScgOiAn0L7QsdGA0LDQsdC+0YLQsNC90Ysg0LLRgdC1INC+0LHRitC10LrRgtGLJykpXG5cbiAgICAgIGNvbnNvbGUuZ3JvdXAoJ9Ca0L7Quy3QstC+INC+0LHRitC10LrRgtC+0LI6ICcgKyB0aGlzLmFtb3VudE9mUG9seWdvbnMudG9Mb2NhbGVTdHJpbmcoKSlcbiAgICAgIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnNoYXBlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGNvbnN0IHNoYXBlQ2FwY3Rpb24gPSB0aGlzLnNoYXBlc1tpXS5uYW1lXG4gICAgICAgICAgY29uc3Qgc2hhcGVBbW91bnQgPSB0aGlzLmJ1ZmZlcnMuYW1vdW50T2ZTaGFwZXNbaV1cbiAgICAgICAgICBjb25zb2xlLmxvZyhzaGFwZUNhcGN0aW9uICsgJzogJyArIHNoYXBlQW1vdW50LnRvTG9jYWxlU3RyaW5nKCkgK1xuICAgICAgICAgICAgJyBbficgKyBNYXRoLnJvdW5kKDEwMCAqIHNoYXBlQW1vdW50IC8gdGhpcy5hbW91bnRPZlBvbHlnb25zKSArICclXScpXG4gICAgICAgIH1cblxuICAgICAgICBjb25zb2xlLmxvZygn0JrQvtC7LdCy0L4g0YbQstC10YLQvtCyINCyINC/0LDQu9C40YLRgNC1OiAnICsgdGhpcy5wb2x5Z29uUGFsZXR0ZS5sZW5ndGgpXG4gICAgICB9XG4gICAgICBjb25zb2xlLmdyb3VwRW5kKClcblxuICAgICAgbGV0IGJ5dGVzVXNlZEJ5QnVmZmVycyA9IHRoaXMuYnVmZmVycy5zaXplSW5CeXRlc1swXSArIHRoaXMuYnVmZmVycy5zaXplSW5CeXRlc1sxXSArIHRoaXMuYnVmZmVycy5zaXplSW5CeXRlc1syXVxuXG4gICAgICBjb25zb2xlLmdyb3VwKCfQl9Cw0L3Rj9GC0L4g0LLQuNC00LXQvtC/0LDQvNGP0YLQuDogJyArIChieXRlc1VzZWRCeUJ1ZmZlcnMgLyAxMDAwMDAwKS50b0ZpeGVkKDIpLnRvTG9jYWxlU3RyaW5nKCkgKyAnINCc0JEnKVxuICAgICAge1xuICAgICAgICBjb25zb2xlLmxvZygn0JHRg9GE0LXRgNGLINCy0LXRgNGI0LjQvTogJyArXG4gICAgICAgICAgKHRoaXMuYnVmZmVycy5zaXplSW5CeXRlc1swXSAvIDEwMDAwMDApLnRvRml4ZWQoMikudG9Mb2NhbGVTdHJpbmcoKSArICcg0JzQkScgK1xuICAgICAgICAgICcgW34nICsgTWF0aC5yb3VuZCgxMDAgKiB0aGlzLmJ1ZmZlcnMuc2l6ZUluQnl0ZXNbMF0gLyBieXRlc1VzZWRCeUJ1ZmZlcnMpICsgJyVdJylcblxuICAgICAgICBjb25zb2xlLmxvZygn0JHRg9GE0LXRgNGLINGG0LLQtdGC0L7QsjogJ1xuICAgICAgICAgICsgKHRoaXMuYnVmZmVycy5zaXplSW5CeXRlc1sxXSAvIDEwMDAwMDApLnRvRml4ZWQoMikudG9Mb2NhbGVTdHJpbmcoKSArICcg0JzQkScgK1xuICAgICAgICAgICcgW34nICsgTWF0aC5yb3VuZCgxMDAgKiB0aGlzLmJ1ZmZlcnMuc2l6ZUluQnl0ZXNbMV0gLyBieXRlc1VzZWRCeUJ1ZmZlcnMpICsgJyVdJylcblxuICAgICAgICBjb25zb2xlLmxvZygn0JHRg9GE0LXRgNGLINC40L3QtNC10LrRgdC+0LI6ICdcbiAgICAgICAgICArICh0aGlzLmJ1ZmZlcnMuc2l6ZUluQnl0ZXNbMl0gLyAxMDAwMDAwKS50b0ZpeGVkKDIpLnRvTG9jYWxlU3RyaW5nKCkgKyAnINCc0JEnICtcbiAgICAgICAgICAnIFt+JyArIE1hdGgucm91bmQoMTAwICogdGhpcy5idWZmZXJzLnNpemVJbkJ5dGVzWzJdIC8gYnl0ZXNVc2VkQnlCdWZmZXJzKSArICclXScpXG4gICAgICB9XG4gICAgICBjb25zb2xlLmdyb3VwRW5kKClcblxuICAgICAgY29uc29sZS5sb2coJ9Ca0L7Quy3QstC+INCz0YDRg9C/0L8g0LHRg9GE0LXRgNC+0LI6ICcgKyB0aGlzLmJ1ZmZlcnMuYW1vdW50T2ZCdWZmZXJHcm91cHMudG9Mb2NhbGVTdHJpbmcoKSlcbiAgICAgIGNvbnNvbGUubG9nKCfQmtC+0Lst0LLQviBHTC3RgtGA0LXRg9Cz0L7Qu9GM0L3QuNC60L7QsjogJyArICh0aGlzLmJ1ZmZlcnMuYW1vdW50T2ZUb3RhbEdMVmVydGljZXMgLyAzKS50b0xvY2FsZVN0cmluZygpKVxuICAgICAgY29uc29sZS5sb2coJ9Ca0L7Quy3QstC+INCy0LXRgNGI0LjQvTogJyArIHRoaXMuYnVmZmVycy5hbW91bnRPZlRvdGFsVmVydGljZXMudG9Mb2NhbGVTdHJpbmcoKSlcbiAgICB9XG4gICAgY29uc29sZS5ncm91cEVuZCgpXG4gIH1cblxuICAvKipcbiAgICog0KHQvtC30LTQsNC10YIg0LTQvtC/0L7Qu9C90LXQvdC40LUg0Log0LrQvtC00YMg0L3QsCDRj9C30YvQutC1IEdMU0wuXG4gICAqXG4gICAqIEByZW1hcmtzXG4gICAqINCSINC00LDQu9GM0L3QtdC50YjQtdC8INGB0L7Qt9C00LDQvdC90YvQuSDQutC+0LQg0LHRg9C00LXRgiDQstGB0YLRgNC+0LXQvSDQsiDQutC+0LQg0LLQtdGA0YjQuNC90L3QvtCz0L4g0YjQtdC50LTQtdGA0LAg0LTQu9GPINC30LDQtNCw0L3QuNGPINGG0LLQtdGC0LAg0LLQtdGA0YjQuNC90Ysg0LIg0LfQsNCy0LjRgdC40LzQvtGB0YLQuCDQvtGCXG4gICAqINC40L3QtNC10LrRgdCwINGG0LLQtdGC0LAsINC/0YDQuNGB0LLQvtC10L3QvdC+0LPQviDRjdGC0L7QuSDQstC10YDRiNC40L3QtS4g0KIu0LouINGI0LXQudC00LXRgCDQvdC1INC/0L7Qt9Cy0L7Qu9GP0LXRgiDQuNGB0L/QvtC70YzQt9C+0LLQsNGC0Ywg0LIg0LrQsNGH0LXRgdGC0LLQtSDQuNC90LTQtdC60YHQvtCyINC/0LXRgNC10LzQtdC90L3Ri9C1IC1cbiAgICog0LTQu9GPINC30LDQtNCw0L3QuNGPINGG0LLQtdGC0LAg0LjRgdC/0L7Qu9GM0LfRg9C10YLRgdGPINC/0LXRgNC10LHQvtGAINGG0LLQtdGC0L7QstGL0YUg0LjQvdC00LXQutGB0L7Qsi5cbiAgICpcbiAgICogQHJldHVybnMg0JrQvtC0INC90LAg0Y/Qt9GL0LrQtSBHTFNMLlxuICAgKi9cbiAgcHJvdGVjdGVkIGdlblNoYWRlckNvbG9yQ29kZSgpOiBzdHJpbmcge1xuXG4gICAgLy8g0JLRgNC10LzQtdC90L3QvtC1INC00L7QsdCw0LLQu9C10L3QuNC1INCyINC/0LDQu9C40YLRgNGDINGG0LLQtdGC0L7QsiDQstC10YDRiNC40L0g0YbQstC10YLQsCDQvdCw0L/RgNCw0LLQu9GP0Y7RidC40YUuXG4gICAgdGhpcy5wb2x5Z29uUGFsZXR0ZS5wdXNoKHRoaXMucnVsZXNDb2xvcilcblxuICAgIGxldCBjb2RlOiBzdHJpbmcgPSAnJ1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBvbHlnb25QYWxldHRlLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgIC8vINCf0L7Qu9GD0YfQtdC90LjQtSDRhtCy0LXRgtCwINCyINC90YPQttC90L7QvCDRhNC+0YDQvNCw0YLQtS5cbiAgICAgIGxldCBbciwgZywgYl0gPSBjb2xvckZyb21IZXhUb0dsUmdiKHRoaXMucG9seWdvblBhbGV0dGVbaV0pXG5cbiAgICAgIC8vINCk0L7RgNC80LjRgNC+0LLQvdC40LUg0YHRgtGA0L7QuiBHTFNMLdC60L7QtNCwINC/0YDQvtCy0LXRgNC60Lgg0LjQvdC00LXQutGB0LAg0YbQstC10YLQsC5cbiAgICAgIGNvZGUgKz0gKChpID09PSAwKSA/ICcnIDogJyAgZWxzZSAnKSArICdpZiAoYV9jb2xvciA9PSAnICsgaSArICcuMCkgdl9jb2xvciA9IHZlYzMoJyArXG4gICAgICAgIHIudG9TdHJpbmcoKS5zbGljZSgwLCA5KSArICcsJyArXG4gICAgICAgIGcudG9TdHJpbmcoKS5zbGljZSgwLCA5KSArICcsJyArXG4gICAgICAgIGIudG9TdHJpbmcoKS5zbGljZSgwLCA5KSArICcpO1xcbidcbiAgICB9XG5cbiAgICAvLyDQo9C00LDQu9C10L3QuNC1INC40Lcg0L/QsNC70LjRgtGA0Ysg0LLQtdGA0YjQuNC9INCy0YDQtdC80LXQvdC90L4g0LTQvtCx0LDQstC70LXQvdC90L7Qs9C+INGG0LLQtdGC0LAg0L3QsNC/0YDQsNCy0LvRj9GO0YnQuNGFLlxuICAgIHRoaXMucG9seWdvblBhbGV0dGUucG9wKClcblxuICAgIHJldHVybiBjb2RlXG4gIH1cblxuLyoqXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG4gIHByb3RlY3RlZCBtYWtlQ2FtZXJhTWF0cml4KCkge1xuXG4gICAgY29uc3Qgem9vbVNjYWxlID0gMSAvIHRoaXMuY2FtZXJhLnpvb20hO1xuXG4gICAgbGV0IGNhbWVyYU1hdCA9IG0zLmlkZW50aXR5KCk7XG4gICAgY2FtZXJhTWF0ID0gbTMudHJhbnNsYXRlKGNhbWVyYU1hdCwgdGhpcy5jYW1lcmEueCwgdGhpcy5jYW1lcmEueSk7XG4gICAgY2FtZXJhTWF0ID0gbTMuc2NhbGUoY2FtZXJhTWF0LCB6b29tU2NhbGUsIHpvb21TY2FsZSk7XG5cbiAgICByZXR1cm4gY2FtZXJhTWF0O1xuICB9XG5cbiAgLyoqXG4gICAqINCe0LHQvdC+0LLQu9GP0LXRgiDQvNCw0YLRgNC40YbRgyDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuC5cbiAgICpcbiAgICogQHJlbWFya3NcbiAgICog0KHRg9GJ0LXRgdGC0LLRg9C10YIg0LTQstCwINCy0LDRgNC40LDQvdGC0LAg0LLRi9C30L7QstCwINC80LXRgtC+0LTQsCAtINC40Lcg0LTRgNGD0LPQvtCz0L4g0LzQtdGC0L7QtNCwINGN0LrQt9C10LzQv9C70Y/RgNCwICh7QGxpbmsgcmVuZGVyfSkg0Lgg0LjQtyDQvtCx0YDQsNCx0L7RgtGH0LjQutCwINGB0L7QsdGL0YLQuNGPINC80YvRiNC4XG4gICAqICh7QGxpbmsgaGFuZGxlTW91c2VXaGVlbH0pLiDQktC+INCy0YLQvtGA0L7QvCDQstCw0YDQuNCw0L3RgtC1INC40YHQv9C+0LvRjNC30L7QstCw0L3QuNC1INC+0LHRitC10LrRgtCwIHRoaXMg0L3QtdCy0L7Qt9C80L7QttC90L4uINCU0LvRjyDRg9C90LjQstC10YDRgdCw0LvRjNC90L7RgdGC0Lgg0LLRi9C30L7QstCwXG4gICAqINC80LXRgtC+0LTQsCAtINCyINC90LXQs9C+INCy0YHQtdCz0LTQsCDRj9Cy0L3QviDQvdC10L7QsdGF0L7QtNC40LzQviDQv9C10YDQtdC00LDQstCw0YLRjCDRgdGB0YvQu9C60YMg0L3QsCDRjdC60LfQtdC80L/Qu9GP0YAg0LrQu9Cw0YHRgdCwLlxuICAgKi9cbiAgcHJvdGVjdGVkIHVwZGF0ZVZpZXdQcm9qZWN0aW9uKCk6IHZvaWQge1xuXG4gICAgY29uc3QgcHJvamVjdGlvbk1hdCA9IG0zLnByb2plY3Rpb24odGhpcy5nbC5jYW52YXMud2lkdGgsIHRoaXMuZ2wuY2FudmFzLmhlaWdodCk7XG4gICAgY29uc3QgY2FtZXJhTWF0ID0gdGhpcy5tYWtlQ2FtZXJhTWF0cml4KCk7XG4gICAgbGV0IHZpZXdNYXQgPSBtMy5pbnZlcnNlKGNhbWVyYU1hdCk7XG4gICAgdGhpcy50cmFuc2Zvcm0udmlld1Byb2plY3Rpb25NYXQgPSBtMy5tdWx0aXBseShwcm9qZWN0aW9uTWF0LCB2aWV3TWF0KTtcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKi9cbiAgcHJvdGVjdGVkIGdldENsaXBTcGFjZU1vdXNlUG9zaXRpb24oZXZlbnQ6IE1vdXNlRXZlbnQpIHtcblxuICAgIC8vIGdldCBjYW52YXMgcmVsYXRpdmUgY3NzIHBvc2l0aW9uXG4gICAgY29uc3QgcmVjdCA9IHRoaXMuY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IGNzc1ggPSBldmVudC5jbGllbnRYIC0gcmVjdC5sZWZ0O1xuICAgIGNvbnN0IGNzc1kgPSBldmVudC5jbGllbnRZIC0gcmVjdC50b3A7XG5cbiAgICAvLyBnZXQgbm9ybWFsaXplZCAwIHRvIDEgcG9zaXRpb24gYWNyb3NzIGFuZCBkb3duIGNhbnZhc1xuICAgIGNvbnN0IG5vcm1hbGl6ZWRYID0gY3NzWCAvIHRoaXMuY2FudmFzLmNsaWVudFdpZHRoO1xuICAgIGNvbnN0IG5vcm1hbGl6ZWRZID0gY3NzWSAvIHRoaXMuY2FudmFzLmNsaWVudEhlaWdodDtcblxuICAgIC8vIGNvbnZlcnQgdG8gY2xpcCBzcGFjZVxuICAgIGNvbnN0IGNsaXBYID0gbm9ybWFsaXplZFggKiAyIC0gMTtcbiAgICBjb25zdCBjbGlwWSA9IG5vcm1hbGl6ZWRZICogLTIgKyAxO1xuXG4gICAgcmV0dXJuIFtjbGlwWCwgY2xpcFldO1xuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqL1xuICBwcm90ZWN0ZWQgbW92ZUNhbWVyYShldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuXG4gICAgY29uc3QgcG9zID0gbTMudHJhbnNmb3JtUG9pbnQoXG4gICAgICB0aGlzLnRyYW5zZm9ybS5zdGFydEludlZpZXdQcm9qTWF0LFxuICAgICAgdGhpcy5nZXRDbGlwU3BhY2VNb3VzZVBvc2l0aW9uKGV2ZW50KVxuICAgICk7XG5cbiAgICB0aGlzLmNhbWVyYS54ID1cbiAgICAgIHRoaXMudHJhbnNmb3JtLnN0YXJ0Q2FtZXJhLnghICsgdGhpcy50cmFuc2Zvcm0uc3RhcnRQb3NbMF0gLSBwb3NbMF07XG5cbiAgICB0aGlzLmNhbWVyYS55ID1cbiAgICAgIHRoaXMudHJhbnNmb3JtLnN0YXJ0Q2FtZXJhLnkhICsgdGhpcy50cmFuc2Zvcm0uc3RhcnRQb3NbMV0gLSBwb3NbMV07XG5cbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgLyoqXG4gICAqINCg0LXQsNCz0LjRgNGD0LXRgiDQvdCwINC00LLQuNC20LXQvdC40LUg0LzRi9GI0Lgv0YLRgNC10LrQv9Cw0LTQsCDQsiDQvNC+0LzQtdC90YIsINC60L7Qs9C00LAg0LXQtS/QtdCz0L4g0LrQu9Cw0LLQuNGI0LAg0YPQtNC10YDQttC40LLQsNC10YLRgdGPINC90LDQttCw0YLQvtC5LlxuICAgKlxuICAgKiBAcmVtZXJrc1xuICAgKiDQnNC10YLQvtC0INC/0LXRgNC10LzQtdGJ0LDQtdGCINC+0LHQu9Cw0YHRgtGMINCy0LjQtNC40LzQvtGB0YLQuCDQvdCwINC/0LvQvtGB0LrQvtGB0YLQuCDQstC80LXRgdGC0LUg0YEg0LTQstC40LbQtdC90LjQtdC8INC80YvRiNC4L9GC0YDQtdC60L/QsNC00LAuINCS0YvRh9C40YHQu9C10L3QuNGPINCy0L3Rg9GC0YDQuCDRgdC+0LHRi9GC0LjRjyDRgdC00LXQu9Cw0L3Ri1xuICAgKiDQvNCw0LrRgdC40LzQsNC70YzQvdC+INC/0YDQvtC40LfQstC+0LTQuNGC0LXQu9GM0L3Ri9C80Lgg0LIg0YPRidC10YDQsSDRh9C40YLQsNCx0LXQu9GM0L3QvtGB0YLQuCDQu9C+0LPQuNC60Lgg0LTQtdC50YHRgtCy0LjQuS4g0JLQviDQstC90LXRiNC90LXQvCDQvtCx0YDQsNCx0L7RgtGH0LjQutC1INGB0L7QsdGL0YLQuNC5INC+0LHRitC10LrRgiB0aGlzXG4gICAqINC90LXQtNC+0YHRgtGD0L/QtdC9INC/0L7RjdGC0L7QvNGDINC00L7RgdGC0YPQvyDQuiDRjdC60LfQtdC80L/Qu9GP0YDRgyDQutC70LDRgdGB0LAg0YDQtdCw0LvQuNC30YPQtdGC0YHRjyDRh9C10YDQtdC3INGB0YLQsNGC0LjRh9C10YHQutC40Lkg0LzQsNGB0YHQuNCyINCy0YHQtdGFINGB0L7Qt9C00LDQvdC90YvRhSDRjdC60LfQtdC80L/Qu9GP0YDQvtCyXG4gICAqINC60LvQsNGB0YHQsCDQuCDQuNC00LXQvdGC0LjRhNC40LrQsNGC0L7RgNCwINC60LDQvdCy0LDRgdCwLCDQstGL0YHRgtGD0L/QsNGO0YnQtdCz0L4g0LjQvdC00LXQutGB0L7QvCDQsiDRjdGC0L7QvCDQvNCw0YHRgdC40LLQtS5cbiAgICpcbiAgICogQHBhcmFtIGV2ZW50IC0g0KHQvtCx0YvRgtC40LUg0LzRi9GI0Lgv0YLRgNC10LrQv9Cw0LTQsC5cbiAgICovXG4gIHByb3RlY3RlZCBoYW5kbGVNb3VzZU1vdmUoZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICB0aGlzLm1vdmVDYW1lcmEuY2FsbCh0aGlzLCBldmVudCk7XG4gIH1cblxuICAvKipcbiAgICog0KDQtdCw0LPQuNGA0YPQtdGCINC90LAg0L7RgtC20LDRgtC40LUg0LrQu9Cw0LLQuNGI0Lgg0LzRi9GI0Lgv0YLRgNC10LrQv9Cw0LTQsC5cbiAgICpcbiAgICogQHJlbWVya3NcbiAgICog0JIg0LzQvtC80LXQvdGCINC+0YLQttCw0YLQuNGPINC60LvQsNCy0LjRiNC4INCw0L3QsNC70LjQtyDQtNCy0LjQttC10L3QuNGPINC80YvRiNC4L9GC0YDQtdC60L/QsNC00LAg0YEg0LfQsNC20LDRgtC+0Lkg0LrQu9Cw0LLQuNGI0LXQuSDQv9GA0LXQutGA0LDRidCw0LXRgtGB0Y8uINCS0YvRh9C40YHQu9C10L3QuNGPINCy0L3Rg9GC0YDQuCDRgdC+0LHRi9GC0LjRj1xuICAgKiDRgdC00LXQu9Cw0L3RiyDQvNCw0LrRgdC40LzQsNC70YzQvdC+INC/0YDQvtC40LfQstC+0LTQuNGC0LXQu9GM0L3Ri9C80Lgg0LIg0YPRidC10YDQsSDRh9C40YLQsNCx0LXQu9GM0L3QvtGB0YLQuCDQu9C+0LPQuNC60Lgg0LTQtdC50YHRgtCy0LjQuS4g0JLQviDQstC90LXRiNC90LXQvCDQvtCx0YDQsNCx0L7RgtGH0LjQutC1INGB0L7QsdGL0YLQuNC5INC+0LHRitC10LrRglxuICAgKiB0aGlzINC90LXQtNC+0YHRgtGD0L/QtdC9INC/0L7RjdGC0L7QvNGDINC00L7RgdGC0YPQvyDQuiDRjdC60LfQtdC80L/Qu9GP0YDRgyDQutC70LDRgdGB0LAg0YDQtdCw0LvQuNC30YPQtdGC0YHRjyDRh9C10YDQtdC3INGB0YLQsNGC0LjRh9C10YHQutC40Lkg0LzQsNGB0YHQuNCyINCy0YHQtdGFINGB0L7Qt9C00LDQvdC90YvRhSDRjdC60LfQtdC80L/Qu9GP0YDQvtCyXG4gICAqINC60LvQsNGB0YHQsCDQuCDQuNC00LXQvdGC0LjRhNC40LrQsNGC0L7RgNCwINC60LDQvdCy0LDRgdCwLCDQstGL0YHRgtGD0L/QsNGO0YnQtdCz0L4g0LjQvdC00LXQutGB0L7QvCDQsiDRjdGC0L7QvCDQvNCw0YHRgdC40LLQtS5cbiAgICpcbiAgICogQHBhcmFtIGV2ZW50IC0g0KHQvtCx0YvRgtC40LUg0LzRi9GI0Lgv0YLRgNC10LrQv9Cw0LTQsC5cbiAgICovXG4gIHByb3RlY3RlZCBoYW5kbGVNb3VzZVVwKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgICBldmVudC50YXJnZXQhLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMuaGFuZGxlTW91c2VNb3ZlV2l0aENvbnRleHQpO1xuICAgIGV2ZW50LnRhcmdldCEucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuaGFuZGxlTW91c2VVcFdpdGhDb250ZXh0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiDQoNC10LDQs9C40YDRg9C10YIg0L3QsCDQvdCw0LbQsNGC0LjQtSDQutC70LDQstC40YjQuCDQvNGL0YjQuC/RgtGA0LXQutC/0LDQtNCwLlxuICAgKlxuICAgKiBAcmVtZXJrc1xuICAgKiDQkiDQvNC+0LzQtdC90YIg0L3QsNC20LDRgtC40Y8g0Lgg0YPQtNC10YDQttCw0L3QuNGPINC60LvQsNCy0LjRiNC4INC30LDQv9GD0YHQutCw0LXRgtGB0Y8g0LDQvdCw0LvQuNC3INC00LLQuNC20LXQvdC40Y8g0LzRi9GI0Lgv0YLRgNC10LrQv9Cw0LTQsCAo0YEg0LfQsNC20LDRgtC+0Lkg0LrQu9Cw0LLQuNGI0LXQuSkuINCS0YvRh9C40YHQu9C10L3QuNGPXG4gICAqINCy0L3Rg9GC0YDQuCDRgdC+0LHRi9GC0LjRjyDRgdC00LXQu9Cw0L3RiyDQvNCw0LrRgdC40LzQsNC70YzQvdC+INC/0YDQvtC40LfQstC+0LTQuNGC0LXQu9GM0L3Ri9C80Lgg0LIg0YPRidC10YDQsSDRh9C40YLQsNCx0LXQu9GM0L3QvtGB0YLQuCDQu9C+0LPQuNC60Lgg0LTQtdC50YHRgtCy0LjQuS4g0JLQviDQstC90LXRiNC90LXQvCDQvtCx0YDQsNCx0L7RgtGH0LjQutC1XG4gICAqINGB0L7QsdGL0YLQuNC5INC+0LHRitC10LrRgiB0aGlzINC90LXQtNC+0YHRgtGD0L/QtdC9INC/0L7RjdGC0L7QvNGDINC00L7RgdGC0YPQvyDQuiDRjdC60LfQtdC80L/Qu9GP0YDRgyDQutC70LDRgdGB0LAg0YDQtdCw0LvQuNC30YPQtdGC0YHRjyDRh9C10YDQtdC3INGB0YLQsNGC0LjRh9C10YHQutC40Lkg0LzQsNGB0YHQuNCyINCy0YHQtdGFXG4gICAqINGB0L7Qt9C00LDQvdC90YvRhSDRjdC60LfQtdC80L/Qu9GP0YDQvtCyINC60LvQsNGB0YHQsCDQuCDQuNC00LXQvdGC0LjRhNC40LrQsNGC0L7RgNCwINC60LDQvdCy0LDRgdCwLCDQstGL0YHRgtGD0L/QsNGO0YnQtdCz0L4g0LjQvdC00LXQutGB0L7QvCDQsiDRjdGC0L7QvCDQvNCw0YHRgdC40LLQtS5cbiAgICpcbiAgICogQHBhcmFtIGV2ZW50IC0g0KHQvtCx0YvRgtC40LUg0LzRi9GI0Lgv0YLRgNC10LrQv9Cw0LTQsC5cbiAgICovXG4gIHByb3RlY3RlZCBoYW5kbGVNb3VzZURvd24oZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcblxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5oYW5kbGVNb3VzZU1vdmVXaXRoQ29udGV4dCk7XG4gICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuaGFuZGxlTW91c2VVcFdpdGhDb250ZXh0KTtcblxuICAgIHRoaXMudHJhbnNmb3JtLnN0YXJ0SW52Vmlld1Byb2pNYXQgPSBtMy5pbnZlcnNlKHRoaXMudHJhbnNmb3JtLnZpZXdQcm9qZWN0aW9uTWF0KTtcbiAgICB0aGlzLnRyYW5zZm9ybS5zdGFydENhbWVyYSA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuY2FtZXJhKTtcbiAgICB0aGlzLnRyYW5zZm9ybS5zdGFydENsaXBQb3MgPSB0aGlzLmdldENsaXBTcGFjZU1vdXNlUG9zaXRpb24uY2FsbCh0aGlzLCBldmVudCk7XG4gICAgdGhpcy50cmFuc2Zvcm0uc3RhcnRQb3MgPSBtMy50cmFuc2Zvcm1Qb2ludCh0aGlzLnRyYW5zZm9ybS5zdGFydEludlZpZXdQcm9qTWF0LCB0aGlzLnRyYW5zZm9ybS5zdGFydENsaXBQb3MpO1xuICAgIHRoaXMudHJhbnNmb3JtLnN0YXJ0TW91c2VQb3MgPSBbZXZlbnQuY2xpZW50WCwgZXZlbnQuY2xpZW50WV07XG5cbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgLyoqXG4gICAqINCg0LXQsNCz0LjRgNGD0LXRgiDQvdCwINC30YPQvNC40YDQvtCy0LDQvdC40LUg0LzRi9GI0Lgv0YLRgNC10LrQv9Cw0LTQsC5cbiAgICpcbiAgICogQHJlbWVya3NcbiAgICog0JIg0LzQvtC80LXQvdGCINC30YPQvNC40YDQvtCy0LDQvdC40Y8g0LzRi9GI0Lgv0YLRgNC10LrQv9Cw0LTQsCDQv9GA0L7QuNGB0YXQvtC00LjRgiDQt9GD0LzQuNGA0L7QstCw0L3QuNC1INC60L7QvtGA0LTQuNC90LDRgtC90L7QuSDQv9C70L7RgdC60L7RgdGC0LguINCS0YvRh9C40YHQu9C10L3QuNGPINCy0L3Rg9GC0YDQuCDRgdC+0LHRi9GC0LjRj1xuICAgKiDRgdC00LXQu9Cw0L3RiyDQvNCw0LrRgdC40LzQsNC70YzQvdC+INC/0YDQvtC40LfQstC+0LTQuNGC0LXQu9GM0L3Ri9C80Lgg0LIg0YPRidC10YDQsSDRh9C40YLQsNCx0LXQu9GM0L3QvtGB0YLQuCDQu9C+0LPQuNC60Lgg0LTQtdC50YHRgtCy0LjQuS4g0JLQviDQstC90LXRiNC90LXQvCDQvtCx0YDQsNCx0L7RgtGH0LjQutC1INGB0L7QsdGL0YLQuNC5INC+0LHRitC10LrRglxuICAgKiB0aGlzINC90LXQtNC+0YHRgtGD0L/QtdC9INC/0L7RjdGC0L7QvNGDINC00L7RgdGC0YPQvyDQuiDRjdC60LfQtdC80L/Qu9GP0YDRgyDQutC70LDRgdGB0LAg0YDQtdCw0LvQuNC30YPQtdGC0YHRjyDRh9C10YDQtdC3INGB0YLQsNGC0LjRh9C10YHQutC40Lkg0LzQsNGB0YHQuNCyINCy0YHQtdGFINGB0L7Qt9C00LDQvdC90YvRhSDRjdC60LfQtdC80L/Qu9GP0YDQvtCyXG4gICAqINC60LvQsNGB0YHQsCDQuCDQuNC00LXQvdGC0LjRhNC40LrQsNGC0L7RgNCwINC60LDQvdCy0LDRgdCwLCDQstGL0YHRgtGD0L/QsNGO0YnQtdCz0L4g0LjQvdC00LXQutGB0L7QvCDQsiDRjdGC0L7QvCDQvNCw0YHRgdC40LLQtS5cbiAgICpcbiAgICogQHBhcmFtIGV2ZW50IC0g0KHQvtCx0YvRgtC40LUg0LzRi9GI0Lgv0YLRgNC10LrQv9Cw0LTQsC5cbiAgICovXG4gIHByb3RlY3RlZCBoYW5kbGVNb3VzZVdoZWVsKGV2ZW50OiBXaGVlbEV2ZW50KTogdm9pZCB7XG5cbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNvbnN0IFtjbGlwWCwgY2xpcFldID0gdGhpcy5nZXRDbGlwU3BhY2VNb3VzZVBvc2l0aW9uLmNhbGwodGhpcywgZXZlbnQpO1xuXG4gICAgLy8gcG9zaXRpb24gYmVmb3JlIHpvb21pbmdcbiAgICBjb25zdCBbcHJlWm9vbVgsIHByZVpvb21ZXSA9IG0zLnRyYW5zZm9ybVBvaW50KG0zLmludmVyc2UodGhpcy50cmFuc2Zvcm0udmlld1Byb2plY3Rpb25NYXQpLCBbY2xpcFgsIGNsaXBZXSk7XG5cbiAgICAvLyBtdWx0aXBseSB0aGUgd2hlZWwgbW92ZW1lbnQgYnkgdGhlIGN1cnJlbnQgem9vbSBsZXZlbCwgc28gd2Ugem9vbSBsZXNzIHdoZW4gem9vbWVkIGluIGFuZCBtb3JlIHdoZW4gem9vbWVkIG91dFxuICAgIGNvbnN0IG5ld1pvb20gPSB0aGlzLmNhbWVyYS56b29tISAqIE1hdGgucG93KDIsIGV2ZW50LmRlbHRhWSAqIC0wLjAxKTtcbiAgICB0aGlzLmNhbWVyYS56b29tID0gTWF0aC5tYXgoMC4wMDIsIE1hdGgubWluKDIwMCwgbmV3Wm9vbSkpO1xuXG4gICAgdGhpcy51cGRhdGVWaWV3UHJvamVjdGlvbi5jYWxsKHRoaXMpO1xuXG4gICAgLy8gcG9zaXRpb24gYWZ0ZXIgem9vbWluZ1xuICAgIGNvbnN0IFtwb3N0Wm9vbVgsIHBvc3Rab29tWV0gPSBtMy50cmFuc2Zvcm1Qb2ludChtMy5pbnZlcnNlKHRoaXMudHJhbnNmb3JtLnZpZXdQcm9qZWN0aW9uTWF0KSwgW2NsaXBYLCBjbGlwWV0pO1xuXG4gICAgLy8gY2FtZXJhIG5lZWRzIHRvIGJlIG1vdmVkIHRoZSBkaWZmZXJlbmNlIG9mIGJlZm9yZSBhbmQgYWZ0ZXJcbiAgICB0aGlzLmNhbWVyYS54ISArPSBwcmVab29tWCAtIHBvc3Rab29tWDtcbiAgICB0aGlzLmNhbWVyYS55ISArPSBwcmVab29tWSAtIHBvc3Rab29tWTtcblxuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICAvKipcbiAgICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAqL1xuXG4gIC8qKlxuICAgKiDQn9GA0L7QuNC30LLQvtC00LjRgiDRgNC10L3QtNC10YDQuNC90LMg0LPRgNCw0YTQuNC60LAg0LIg0YHQvtC+0YLQstC10YLRgdGC0LLQuNC4INGBINGC0LXQutGD0YnQuNC80Lgg0L/QsNGA0LDQvNC10YLRgNCw0LzQuCDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuC5cbiAgICovXG4gIHByb3RlY3RlZCByZW5kZXIoKTogdm9pZCB7XG5cbiAgICAvLyDQntGH0LjRgdGC0LrQsCDQvtCx0YrQtdC60YLQsCDRgNC10L3QtNC10YDQuNC90LPQsCBXZWJHTC5cbiAgICB0aGlzLmdsLmNsZWFyKHRoaXMuZ2wuQ09MT1JfQlVGRkVSX0JJVClcblxuICAgIC8vINCe0LHQvdC+0LLQu9C10L3QuNC1INC80LDRgtGA0LjRhtGLINGC0YDQsNC90YHRhNC+0YDQvNCw0YbQuNC4LlxuICAgIHRoaXMudXBkYXRlVmlld1Byb2plY3Rpb24oKVxuXG4gICAgLy8g0J/RgNC40LLRj9C30LrQsCDQvNCw0YLRgNC40YbRiyDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuCDQuiDQv9C10YDQtdC80LXQvdC90L7QuSDRiNC10LnQtNC10YDQsC5cbiAgICB0aGlzLmdsLnVuaWZvcm1NYXRyaXgzZnYodGhpcy52YXJpYWJsZXNbJ3VfbWF0cml4J10sIGZhbHNlLCB0aGlzLnRyYW5zZm9ybS52aWV3UHJvamVjdGlvbk1hdClcblxuICAgIC8vINCY0YLQtdGA0LjRgNC+0LLQsNC90LjQtSDQuCDRgNC10L3QtNC10YDQuNC90LMg0LPRgNGD0L/QvyDQsdGD0YTQtdGA0L7QsiBXZWJHTC5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYnVmZmVycy5hbW91bnRPZkJ1ZmZlckdyb3VwczsgaSsrKSB7XG5cbiAgICAgIC8vINCj0YHRgtCw0L3QvtCy0LrQsCDRgtC10LrRg9GJ0LXQs9C+INCx0YPRhNC10YDQsCDQstC10YDRiNC40L0g0Lgg0LXQs9C+INC/0YDQuNCy0Y/Qt9C60LAg0Log0L/QtdGA0LXQvNC10L3QvdC+0Lkg0YjQtdC50LTQtdGA0LAuXG4gICAgICB0aGlzLmdsLmJpbmRCdWZmZXIodGhpcy5nbC5BUlJBWV9CVUZGRVIsIHRoaXMuYnVmZmVycy52ZXJ0ZXhCdWZmZXJzW2ldKVxuICAgICAgdGhpcy5nbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheSh0aGlzLnZhcmlhYmxlc1snYV9wb3NpdGlvbiddKVxuICAgICAgdGhpcy5nbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKHRoaXMudmFyaWFibGVzWydhX3Bvc2l0aW9uJ10sIDIsIHRoaXMuZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKVxuXG4gICAgICAvLyDQo9GB0YLQsNC90L7QstC60LAg0YLQtdC60YPRidC10LPQviDQsdGD0YTQtdGA0LAg0YbQstC10YLQvtCyINCy0LXRgNGI0LjQvSDQuCDQtdCz0L4g0L/RgNC40LLRj9C30LrQsCDQuiDQv9C10YDQtdC80LXQvdC90L7QuSDRiNC10LnQtNC10YDQsC5cbiAgICAgIHRoaXMuZ2wuYmluZEJ1ZmZlcih0aGlzLmdsLkFSUkFZX0JVRkZFUiwgdGhpcy5idWZmZXJzLmNvbG9yQnVmZmVyc1tpXSlcbiAgICAgIHRoaXMuZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkodGhpcy52YXJpYWJsZXNbJ2FfY29sb3InXSlcbiAgICAgIHRoaXMuZ2wudmVydGV4QXR0cmliUG9pbnRlcih0aGlzLnZhcmlhYmxlc1snYV9jb2xvciddLCAxLCB0aGlzLmdsLlVOU0lHTkVEX0JZVEUsIGZhbHNlLCAwLCAwKVxuXG4gICAgICAvLyDQo9GB0YLQsNC90L7QstC60LAg0YLQtdC60YPRidC10LPQviDQsdGD0YTQtdGA0LAg0YDQsNC30LzQtdGA0L7QsiDQstC10YDRiNC40L0g0Lgg0LXQs9C+INC/0YDQuNCy0Y/Qt9C60LAg0Log0L/QtdGA0LXQvNC10L3QvdC+0Lkg0YjQtdC50LTQtdGA0LAuXG4gICAgICB0aGlzLmdsLmJpbmRCdWZmZXIodGhpcy5nbC5BUlJBWV9CVUZGRVIsIHRoaXMuYnVmZmVycy5zaXplQnVmZmVyc1tpXSlcbiAgICAgIHRoaXMuZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkodGhpcy52YXJpYWJsZXNbJ2FfcG9seWdvbnNpemUnXSlcbiAgICAgIHRoaXMuZ2wudmVydGV4QXR0cmliUG9pbnRlcih0aGlzLnZhcmlhYmxlc1snYV9wb2x5Z29uc2l6ZSddLCAxLCB0aGlzLmdsLkZMT0FULCBmYWxzZSwgMCwgMClcblxuICAgICAgaWYgKHRoaXMudXNlVmVydGV4SW5kaWNlcykge1xuXG4gICAgICAgIC8vINCj0YHRgtCw0L3QvtCy0LrQsCDRgtC10LrRg9GJ0LXQs9C+INCx0YPRhNC10YDQsCDQuNC90LTQtdC60YHQvtCyINCy0LXRgNGI0LjQvS5cbiAgICAgICAgdGhpcy5nbC5iaW5kQnVmZmVyKHRoaXMuZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIHRoaXMuYnVmZmVycy5pbmRleEJ1ZmZlcnNbaV0pXG5cbiAgICAgICAgLy8g0KDQtdC90LTQtdGA0LjQvdCzINGC0LXQutGD0YnQtdC5INCz0YDRg9C/0L/RiyDQsdGD0YTQtdGA0L7Qsi5cbiAgICAgICAgdGhpcy5nbC5kcmF3RWxlbWVudHModGhpcy5nbC5QT0lOVFMsIHRoaXMuYnVmZmVycy5hbW91bnRPZkdMVmVydGljZXNbaV0sIHRoaXMuZ2wuVU5TSUdORURfU0hPUlQsIDApXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmdsLmRyYXdBcnJheXModGhpcy5nbC5QT0lOVFMsIDAsIHRoaXMuYnVmZmVycy5hbW91bnRPZkdMVmVydGljZXNbaV0gLyAzKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDQnNC10YLQvtC0INC40LzQuNGC0LDRhtC40Lgg0LjRgtC10YDQuNGA0L7QstCw0L3QuNGPINC40YHRhdC+0LTQvdGL0YUg0L7QsdGK0LXQutGC0L7Qsi4g0J/RgNC4INC60LDQttC00L7QvCDQvdC+0LLQvtC8INCy0YvQt9C+0LLQtSDQstC+0LfQstGA0LDRidCw0LXRgiDQuNC90YTQvtGA0LzQsNGG0LjRjiDQviDQv9C+0LvQuNCz0L7QvdC1INGB0L4g0YHQu9GD0YfQsNC90YvQvFxuICAgKiDQv9C+0LvQvtC20LXQvdC40LXQvCwg0YHQu9GD0YfQsNC50L3QvtC5INGE0L7RgNC80L7QuSDQuCDRgdC70YPRh9Cw0LnQvdGL0Lwg0YbQstC10YLQvtC8LlxuICAgKlxuICAgKiBAcmV0dXJucyDQmNC90YTQvtGA0LzQsNGG0LjRjyDQviDQv9C+0LvQuNCz0L7QvdC1INC40LvQuCBudWxsLCDQtdGB0LvQuCDQv9C10YDQtdCx0L7RgCDQuNGB0YXQvtC00L3Ri9GFINC+0LHRitC10LrRgtC+0LIg0LfQsNC60L7QvdGH0LjQu9GB0Y8uXG4gICAqL1xuICBwcm90ZWN0ZWQgZGVtb0l0ZXJhdGlvbkNhbGxiYWNrKCk6IFNQbG90UG9seWdvbiB8IG51bGwge1xuICAgIGlmICh0aGlzLmRlbW9Nb2RlLmluZGV4ISA8IHRoaXMuZGVtb01vZGUuYW1vdW50ISkge1xuICAgICAgdGhpcy5kZW1vTW9kZS5pbmRleCEgKys7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB4OiByYW5kb21JbnQodGhpcy5ncmlkU2l6ZS53aWR0aCksXG4gICAgICAgIHk6IHJhbmRvbUludCh0aGlzLmdyaWRTaXplLmhlaWdodCksXG4gICAgICAgIHNoYXBlOiByYW5kb21RdW90YUluZGV4KHRoaXMuZGVtb01vZGUuc2hhcGVRdW90YSEpLFxuICAgICAgICBzaXplOiAxICsgcmFuZG9tSW50KDIwKSxcbiAgICAgICAgY29sb3I6IHJhbmRvbUludCh0aGlzLnBvbHlnb25QYWxldHRlLmxlbmd0aClcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZVxuICAgICAgcmV0dXJuIG51bGxcbiAgfVxuXG4gIC8qKlxuICAgKiDQl9Cw0L/Rg9GB0LrQsNC10YIg0YDQtdC90LTQtdGA0LjQvdCzINC4IFwi0L/RgNC+0YHQu9GD0YjQutGDXCIg0YHQvtCx0YvRgtC40Lkg0LzRi9GI0Lgv0YLRgNC10LrQv9Cw0LTQsCDQvdCwINC60LDQvdCy0LDRgdC1LlxuICAgKi9cbiAgcHVibGljIHJ1bigpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuaXNSdW5uaW5nKSB7XG5cbiAgICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMuaGFuZGxlTW91c2VEb3duV2l0aENvbnRleHQpXG4gICAgICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCd3aGVlbCcsIHRoaXMuaGFuZGxlTW91c2VXaGVlbFdpdGhDb250ZXh0KVxuXG4gICAgICB0aGlzLnJlbmRlcigpXG5cbiAgICAgIHRoaXMuaXNSdW5uaW5nID0gdHJ1ZVxuICAgIH1cblxuICAgIC8vINCS0YvQstC+0LQg0L7RgtC70LDQtNC+0YfQvdC+0Lkg0LjQvdGE0L7RgNC80LDRhtC40LguXG4gICAgaWYgKHRoaXMuZGVidWdNb2RlLmlzRW5hYmxlKSB7XG4gICAgICBjb25zb2xlLmxvZygnJWPQoNC10L3QtNC10YDQuNC90LMg0LfQsNC/0YPRidC10L0nLCB0aGlzLmRlYnVnTW9kZS5ncm91cFN0eWxlKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDQntGB0YLQsNC90LDQstC70LjQstCw0LXRgiDRgNC10L3QtNC10YDQuNC90LMg0LggXCLQv9GA0L7RgdC70YPRiNC60YNcIiDRgdC+0LHRi9GC0LjQuSDQvNGL0YjQuC/RgtGA0LXQutC/0LDQtNCwINC90LAg0LrQsNC90LLQsNGB0LUuXG4gICAqXG4gICAqIEBwYXJhbSBjbGVhciAtINCf0YDQuNC30L3QsNC6INC90LXQvtC+0LHRhdC+0LTQuNC80L7RgdGC0Lgg0LLQvNC10YHRgtC1INGBINC+0YHRgtCw0L3QvtCy0LrQvtC5INGA0LXQvdC00LXRgNC40L3Qs9CwINC+0YfQuNGB0YLQuNGC0Ywg0LrQsNC90LLQsNGBLiDQl9C90LDRh9C10L3QuNC1IHRydWUg0L7Rh9C40YnQsNC10YIg0LrQsNC90LLQsNGBLFxuICAgKiDQt9C90LDRh9C10L3QuNC1IGZhbHNlIC0g0L7RgdGC0LDQstC70Y/QtdGCINC10LPQviDQvdC10L7Rh9C40YnQtdC90L3Ri9C8LiDQn9C+INGD0LzQvtC70YfQsNC90LjRjiDQvtGH0LjRgdGC0LrQsCDQvdC1INC/0YDQvtC40YHRhdC+0LTQuNGCLlxuICAgKi9cbiAgcHVibGljIHN0b3AoY2xlYXI6IGJvb2xlYW4gPSBmYWxzZSk6IHZvaWQge1xuXG4gICAgaWYgKHRoaXMuaXNSdW5uaW5nKSB7XG5cbiAgICAgIHRoaXMuY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMuaGFuZGxlTW91c2VEb3duV2l0aENvbnRleHQpXG4gICAgICB0aGlzLmNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKCd3aGVlbCcsIHRoaXMuaGFuZGxlTW91c2VXaGVlbFdpdGhDb250ZXh0KVxuICAgICAgdGhpcy5jYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5oYW5kbGVNb3VzZU1vdmVXaXRoQ29udGV4dClcbiAgICAgIHRoaXMuY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLmhhbmRsZU1vdXNlVXBXaXRoQ29udGV4dClcblxuICAgICAgaWYgKGNsZWFyKSB7XG4gICAgICAgIHRoaXMuY2xlYXIoKVxuICAgICAgfVxuXG4gICAgICB0aGlzLmlzUnVubmluZyA9IGZhbHNlXG4gICAgfVxuXG4gICAgLy8g0JLRi9Cy0L7QtCDQvtGC0LvQsNC00L7Rh9C90L7QuSDQuNC90YTQvtGA0LzQsNGG0LjQuC5cbiAgICBpZiAodGhpcy5kZWJ1Z01vZGUuaXNFbmFibGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKCclY9Cg0LXQvdC00LXRgNC40L3QsyDQvtGB0YLQsNC90L7QstC70LXQvScsIHRoaXMuZGVidWdNb2RlLmdyb3VwU3R5bGUpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqINCe0YfQuNGJ0LDQtdGCINC60LDQvdCy0LDRgSwg0LfQsNC60YDQsNGI0LjQstCw0Y8g0LXQs9C+INCyINGE0L7QvdC+0LLRi9C5INGG0LLQtdGCLlxuICAgKi9cbiAgcHVibGljIGNsZWFyKCk6IHZvaWQge1xuXG4gICAgdGhpcy5nbC5jbGVhcih0aGlzLmdsLkNPTE9SX0JVRkZFUl9CSVQpO1xuXG4gICAgLy8g0JLRi9Cy0L7QtCDQvtGC0LvQsNC00L7Rh9C90L7QuSDQuNC90YTQvtGA0LzQsNGG0LjQuC5cbiAgICBpZiAodGhpcy5kZWJ1Z01vZGUuaXNFbmFibGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKCclY9Ca0L7QvdGC0LXQutGB0YIg0YDQtdC90LTQtdGA0LjQvdCz0LAg0L7Rh9C40YnQtdC9IFsnICsgdGhpcy5iZ0NvbG9yICsgJ10nLCB0aGlzLmRlYnVnTW9kZS5ncm91cFN0eWxlKTtcbiAgICB9XG4gIH1cbn1cbiIsIlxuLyoqXG4gKiDQn9GA0L7QstC10YDRj9C10YIg0Y/QstC70Y/QtdGC0YHRjyDQu9C4INC/0LXRgNC10LzQtdC90L3QsNGPINGN0LrQt9C10LzQv9C70Y/RgNC+0Lwg0LrQsNC60L7Qs9C+LdC70LjQsdC+0L4g0LrQu9Cw0YHRgdCwLlxuICpcbiAqIEBwYXJhbSB2YWwgLSDQn9GA0L7QstC10YDRj9C10LzQsNGPINC/0LXRgNC10LzQtdC90L3QsNGPLlxuICogQHJldHVybnMg0KDQtdC30YPQu9GM0YLQsNGCINC/0YDQvtCy0LXRgNC60LguXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc09iamVjdChvYmo6IGFueSk6IGJvb2xlYW4ge1xuICByZXR1cm4gKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBPYmplY3RdJylcbn1cblxuLyoqXG4gKiDQktC+0LfQstGA0LDRidCw0LXRgiDRgdC70YPRh9Cw0LnQvdC+0LUg0YbQtdC70L7QtSDRh9C40YHQu9C+INCyINC00LjQsNC/0LDQt9C+0L3QtTogWzAuLi5yYW5nZS0xXS5cbiAqXG4gKiBAcGFyYW0gcmFuZ2UgLSDQktC10YDRhdC90LjQuSDQv9GA0LXQtNC10Lsg0LTQuNCw0L/QsNC30L7QvdCwINGB0LvRg9GH0LDQudC90L7Qs9C+INCy0YvQsdC+0YDQsC5cbiAqIEByZXR1cm5zINCh0LvRg9GH0LDQudC90L7QtSDRh9C40YHQu9C+LlxuICovXG5leHBvcnQgZnVuY3Rpb24gcmFuZG9tSW50KHJhbmdlOiBudW1iZXIpOiBudW1iZXIge1xuICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcmFuZ2UpXG59XG5cbi8qKlxuICog0J/RgNC10L7QsdGA0LDQt9GD0LXRgiDQvtCx0YrQtdC60YIg0LIg0YHRgtGA0L7QutGDIEpTT04uINCY0LzQtdC10YIg0L7RgtC70LjRh9C40LUg0L7RgiDRgdGC0LDQvdC00LDRgNGC0L3QvtC5INGE0YPQvdC60YbQuNC4IEpTT04uc3RyaW5naWZ5IC0g0L/QvtC70Y8g0L7QsdGK0LXQutGC0LAsINC40LzQtdGO0YnQuNC1XG4gKiDQt9C90LDRh9C10L3QuNGPINGE0YPQvdC60YbQuNC5INC90LUg0L/RgNC+0L/Rg9GB0LrQsNGO0YLRgdGPLCDQsCDQv9GA0LXQvtCx0YDQsNC30YPRjtGC0YHRjyDQsiDQvdCw0LfQstCw0L3QuNC1INGE0YPQvdC60YbQuNC4LlxuICpcbiAqIEBwYXJhbSBvYmogLSDQptC10LvQtdCy0L7QuSDQvtCx0YrQtdC60YIuXG4gKiBAcmV0dXJucyDQodGC0YDQvtC60LAgSlNPTiwg0L7RgtC+0LHRgNCw0LbQsNGO0YnQsNGPINC+0LHRitC10LrRgi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGpzb25TdHJpbmdpZnkob2JqOiBhbnkpOiBzdHJpbmcge1xuICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoXG4gICAgb2JqLFxuICAgIGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgICByZXR1cm4gKHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJykgPyB2YWx1ZS5uYW1lIDogdmFsdWVcbiAgICB9LFxuICAgICcgJ1xuICApXG59XG5cbi8qKlxuICog0KHQu9GD0YfQsNC50L3Ri9C8INC+0LHRgNCw0LfQvtC8INCy0L7Qt9Cy0YDQsNGJ0LDQtdGCINC+0LTQuNC9INC40Lcg0LjQvdC00LXQutGB0L7QsiDRh9C40YHQu9C+0LLQvtCz0L4g0L7QtNC90L7QvNC10YDQvdC+0LPQviDQvNCw0YHRgdC40LLQsC4g0J3QtdGB0LzQvtGC0YDRjyDQvdCwINGB0LvRg9GH0LDQudC90L7RgdGC0Ywg0LrQsNC20LTQvtCz0L5cbiAqINC60L7QvdC60YDQtdGC0L3QvtCz0L4g0LLRi9C30L7QstCwINGE0YPQvdC60YbQuNC4LCDQuNC90LTQtdC60YHRiyDQstC+0LfQstGA0LDRidCw0Y7RgtGB0Y8g0YEg0L/RgNC10LTQvtC/0YDQtdC00LXQu9C10L3QvdC+0Lkg0YfQsNGB0YLQvtGC0L7QuS4g0KfQsNGB0YLQvtGC0LAgXCLQstGL0L/QsNC00LDQvdC40LlcIiDQuNC90LTQtdC60YHQvtCyINC30LDQtNCw0LXRgtGB0Y9cbiAqINGB0L7QvtGC0LLQtdGC0YHRgtCy0YPRjtGJ0LjQvNC4INC30L3QsNGH0LXQvdC40Y/QvNC4INGN0LvQtdC80LXQvdGC0L7Qsi5cbiAqXG4gKiBAcmVtYXJrc1xuICog0J/RgNC40LzQtdGAOiDQndCwINC80LDRgdGB0LjQstC1IFszLCAyLCA1XSDRhNGD0L3QutGG0LjRjyDQsdGD0LTQtdGCINCy0L7Qt9Cy0YDQsNGJ0LDRgtGMINC40L3QtNC10LrRgSAwINGBINGH0LDRgdGC0L7RgtC+0LkgPSAzLygzKzIrNSkgPSAzLzEwLCDQuNC90LTQtdC60YEgMSDRgSDRh9Cw0YHRgtC+0YLQvtC5ID1cbiAqIDIvKDMrMis1KSA9IDIvMTAsINC40L3QtNC10LrRgSAyINGBINGH0LDRgdGC0L7RgtC+0LkgPSA1LygzKzIrNSkgPSA1LzEwLlxuICpcbiAqIEBwYXJhbSBhcnIgLSDQp9C40YHQu9C+0LLQvtC5INC+0LTQvdC+0LzQtdGA0L3Ri9C5INC80LDRgdGB0LjQsiwg0LjQvdC00LXQutGB0Ysg0LrQvtGC0L7RgNC+0LPQviDQsdGD0LTRg9GCINCy0L7Qt9Cy0YDQsNGJ0LDRgtGM0YHRjyDRgSDQv9GA0LXQtNC+0L/RgNC10LTQtdC70LXQvdC90L7QuSDRh9Cw0YHRgtC+0YLQvtC5LlxuICogQHJldHVybnMg0KHQu9GD0YfQsNC50L3Ri9C5INC40L3QtNC10LrRgSDQuNC3INC80LDRgdGB0LjQstCwIGFyci5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJhbmRvbVF1b3RhSW5kZXgoYXJyOiBudW1iZXJbXSk6IG51bWJlciB7XG5cbiAgbGV0IGE6IG51bWJlcltdID0gW11cbiAgYVswXSA9IGFyclswXVxuXG4gIGZvciAobGV0IGkgPSAxOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgYVtpXSA9IGFbaSAtIDFdICsgYXJyW2ldXG4gIH1cblxuICBjb25zdCBsYXN0SW5kZXg6IG51bWJlciA9IGEubGVuZ3RoIC0gMVxuXG4gIGxldCByOiBudW1iZXIgPSBNYXRoLmZsb29yKChNYXRoLnJhbmRvbSgpICogYVtsYXN0SW5kZXhdKSkgKyAxXG4gIGxldCBsOiBudW1iZXIgPSAwXG4gIGxldCBoOiBudW1iZXIgPSBsYXN0SW5kZXhcblxuICB3aGlsZSAobCA8IGgpIHtcbiAgICBjb25zdCBtOiBudW1iZXIgPSBsICsgKChoIC0gbCkgPj4gMSk7XG4gICAgKHIgPiBhW21dKSA/IChsID0gbSArIDEpIDogKGggPSBtKVxuICB9XG5cbiAgcmV0dXJuIChhW2xdID49IHIpID8gbCA6IC0xXG59XG5cblxuLyoqXG4gKiDQmtC+0L3QstC10YDRgtC40YDRg9C10YIg0YbQstC10YIg0LjQtyBIRVgt0L/RgNC10LTRgdGC0LDQstC70LXQvdC40Y8g0LIg0L/RgNC10LTRgdGC0LDQstC70LXQvdC40LUg0YbQstC10YLQsCDQtNC70Y8gR0xTTC3QutC+0LTQsCAoUkdCINGBINC00LjQsNC/0LDQt9C+0L3QsNC80Lgg0LfQvdCw0YfQtdC90LjQuSDQvtGCIDAg0LTQviAxKS5cbiAqXG4gKiBAcGFyYW0gaGV4Q29sb3IgLSDQptCy0LXRgiDQsiBIRVgt0YTQvtGA0LzQsNGC0LUuXG4gKiBAcmV0dXJucyDQnNCw0YHRgdC40LIg0LjQtyDRgtGA0LXRhSDRh9C40YHQtdC7INCyINC00LjQsNC/0LDQt9C+0L3QtSDQvtGCIDAg0LTQviAxLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY29sb3JGcm9tSGV4VG9HbFJnYihoZXhDb2xvcjogc3RyaW5nKTogbnVtYmVyW10ge1xuXG4gIGxldCBrID0gL14jPyhbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KSQvaS5leGVjKGhleENvbG9yKVxuICBsZXQgW3IsIGcsIGJdID0gW3BhcnNlSW50KGshWzFdLCAxNikgLyAyNTUsIHBhcnNlSW50KGshWzJdLCAxNikgLyAyNTUsIHBhcnNlSW50KGshWzNdLCAxNikgLyAyNTVdXG5cbiAgcmV0dXJuIFtyLCBnLCBiXVxufVxuXG4vKipcbiAqINCS0YvRh9C40YHQu9GP0LXRgiDRgtC10LrRg9GJ0LXQtSDQstGA0LXQvNGPLlxuICpcbiAqIEByZXR1cm5zINCh0YLRgNC+0LrQvtCy0LDRjyDRhNC+0YDQvNCw0YLQuNGA0L7QstCw0L3QvdCw0Y8g0LfQsNC/0LjRgdGMINGC0LXQutGD0YnQtdCz0L4g0LLRgNC10LzQtdC90LguINCk0L7RgNC80LDRgjogaGg6bW06c3NcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEN1cnJlbnRUaW1lKCk6IHN0cmluZyB7XG5cbiAgbGV0IHRvZGF5ID0gbmV3IERhdGUoKTtcblxuICBsZXQgdGltZSA9XG4gICAgKCh0b2RheS5nZXRIb3VycygpIDwgMTAgPyAnMCcgOiAnJykgKyB0b2RheS5nZXRIb3VycygpKSArIFwiOlwiICtcbiAgICAoKHRvZGF5LmdldE1pbnV0ZXMoKSA8IDEwID8gJzAnIDogJycpICsgdG9kYXkuZ2V0TWludXRlcygpKSArIFwiOlwiICtcbiAgICAoKHRvZGF5LmdldFNlY29uZHMoKSA8IDEwID8gJzAnIDogJycpICsgdG9kYXkuZ2V0U2Vjb25kcygpKVxuXG4gIHJldHVybiB0aW1lXG59XG4iLCJleHBvcnQgZGVmYXVsdFxuYFxuYXR0cmlidXRlIHZlYzIgYV9wb3NpdGlvbjtcbmF0dHJpYnV0ZSBmbG9hdCBhX2NvbG9yO1xuYXR0cmlidXRlIGZsb2F0IGFfcG9seWdvbnNpemU7XG51bmlmb3JtIG1hdDMgdV9tYXRyaXg7XG52YXJ5aW5nIHZlYzMgdl9jb2xvcjtcbnZvaWQgbWFpbigpIHtcbiAgZ2xfUG9zaXRpb24gPSB2ZWM0KCh1X21hdHJpeCAqIHZlYzMoYV9wb3NpdGlvbiwgMSkpLnh5LCAwLjAsIDEuMCk7XG4gIGdsX1BvaW50U2l6ZSA9IGFfcG9seWdvbnNpemU7XG4gIHtBRERJVElPTkFMLUNPREV9XG59XG5gXG4iLCIvKlxuICogQ29weXJpZ2h0IDIwMjEgR0ZYRnVuZGFtZW50YWxzLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBSZWRpc3RyaWJ1dGlvbiBhbmQgdXNlIGluIHNvdXJjZSBhbmQgYmluYXJ5IGZvcm1zLCB3aXRoIG9yIHdpdGhvdXRcbiAqIG1vZGlmaWNhdGlvbiwgYXJlIHBlcm1pdHRlZCBwcm92aWRlZCB0aGF0IHRoZSBmb2xsb3dpbmcgY29uZGl0aW9ucyBhcmVcbiAqIG1ldDpcbiAqXG4gKiAgICAgKiBSZWRpc3RyaWJ1dGlvbnMgb2Ygc291cmNlIGNvZGUgbXVzdCByZXRhaW4gdGhlIGFib3ZlIGNvcHlyaWdodFxuICogbm90aWNlLCB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyLlxuICogICAgICogUmVkaXN0cmlidXRpb25zIGluIGJpbmFyeSBmb3JtIG11c3QgcmVwcm9kdWNlIHRoZSBhYm92ZVxuICogY29weXJpZ2h0IG5vdGljZSwgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lclxuICogaW4gdGhlIGRvY3VtZW50YXRpb24gYW5kL29yIG90aGVyIG1hdGVyaWFscyBwcm92aWRlZCB3aXRoIHRoZVxuICogZGlzdHJpYnV0aW9uLlxuICogICAgICogTmVpdGhlciB0aGUgbmFtZSBvZiBHRlhGdW5kYW1lbnRhbHMuIG5vciB0aGUgbmFtZXMgb2YgaGlzXG4gKiBjb250cmlidXRvcnMgbWF5IGJlIHVzZWQgdG8gZW5kb3JzZSBvciBwcm9tb3RlIHByb2R1Y3RzIGRlcml2ZWQgZnJvbVxuICogdGhpcyBzb2Z0d2FyZSB3aXRob3V0IHNwZWNpZmljIHByaW9yIHdyaXR0ZW4gcGVybWlzc2lvbi5cbiAqXG4gKiBUSElTIFNPRlRXQVJFIElTIFBST1ZJREVEIEJZIFRIRSBDT1BZUklHSFQgSE9MREVSUyBBTkQgQ09OVFJJQlVUT1JTXG4gKiBcIkFTIElTXCIgQU5EIEFOWSBFWFBSRVNTIE9SIElNUExJRUQgV0FSUkFOVElFUywgSU5DTFVESU5HLCBCVVQgTk9UXG4gKiBMSU1JVEVEIFRPLCBUSEUgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSBBTkQgRklUTkVTUyBGT1JcbiAqIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFSRSBESVNDTEFJTUVELiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQ09QWVJJR0hUXG4gKiBPV05FUiBPUiBDT05UUklCVVRPUlMgQkUgTElBQkxFIEZPUiBBTlkgRElSRUNULCBJTkRJUkVDVCwgSU5DSURFTlRBTCxcbiAqIFNQRUNJQUwsIEVYRU1QTEFSWSwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTIChJTkNMVURJTkcsIEJVVCBOT1RcbiAqIExJTUlURUQgVE8sIFBST0NVUkVNRU5UIE9GIFNVQlNUSVRVVEUgR09PRFMgT1IgU0VSVklDRVM7IExPU1MgT0YgVVNFLFxuICogREFUQSwgT1IgUFJPRklUUzsgT1IgQlVTSU5FU1MgSU5URVJSVVBUSU9OKSBIT1dFVkVSIENBVVNFRCBBTkQgT04gQU5ZXG4gKiBUSEVPUlkgT0YgTElBQklMSVRZLCBXSEVUSEVSIElOIENPTlRSQUNULCBTVFJJQ1QgTElBQklMSVRZLCBPUiBUT1JUXG4gKiAoSU5DTFVESU5HIE5FR0xJR0VOQ0UgT1IgT1RIRVJXSVNFKSBBUklTSU5HIElOIEFOWSBXQVkgT1VUIE9GIFRIRSBVU0VcbiAqIE9GIFRISVMgU09GVFdBUkUsIEVWRU4gSUYgQURWSVNFRCBPRiBUSEUgUE9TU0lCSUxJVFkgT0YgU1VDSCBEQU1BR0UuXG4gKi9cblxuLyoqXG4gKiBWYXJpb3VzIDJkIG1hdGggZnVuY3Rpb25zLlxuICpcbiAqIEBtb2R1bGUgd2ViZ2wtMmQtbWF0aFxuICovXG4oZnVuY3Rpb24ocm9vdCwgZmFjdG9yeSkgeyAgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgLy8gQU1ELiBSZWdpc3RlciBhcyBhbiBhbm9ueW1vdXMgbW9kdWxlLlxuICAgIGRlZmluZShbXSwgZmFjdG9yeSk7XG4gIH0gZWxzZSB7XG4gICAgLy8gQnJvd3NlciBnbG9iYWxzXG4gICAgcm9vdC5tMyA9IGZhY3RvcnkoKTtcbiAgfVxufSh0aGlzLCBmdW5jdGlvbigpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgLyoqXG4gICAqIEFuIGFycmF5IG9yIHR5cGVkIGFycmF5IHdpdGggOSB2YWx1ZXMuXG4gICAqIEB0eXBlZGVmIHtudW1iZXJbXXxUeXBlZEFycmF5fSBNYXRyaXgzXG4gICAqIEBtZW1iZXJPZiBtb2R1bGU6d2ViZ2wtMmQtbWF0aFxuICAgKi9cblxuICAvKipcbiAgICogVGFrZXMgdHdvIE1hdHJpeDNzLCBhIGFuZCBiLCBhbmQgY29tcHV0ZXMgdGhlIHByb2R1Y3QgaW4gdGhlIG9yZGVyXG4gICAqIHRoYXQgcHJlLWNvbXBvc2VzIGIgd2l0aCBhLiAgSW4gb3RoZXIgd29yZHMsIHRoZSBtYXRyaXggcmV0dXJuZWQgd2lsbFxuICAgKiBAcGFyYW0ge21vZHVsZTp3ZWJnbC0yZC1tYXRoLk1hdHJpeDN9IGEgQSBtYXRyaXguXG4gICAqIEBwYXJhbSB7bW9kdWxlOndlYmdsLTJkLW1hdGguTWF0cml4M30gYiBBIG1hdHJpeC5cbiAgICogQHJldHVybiB7bW9kdWxlOndlYmdsLTJkLW1hdGguTWF0cml4M30gdGhlIHJlc3VsdC5cbiAgICogQG1lbWJlck9mIG1vZHVsZTp3ZWJnbC0yZC1tYXRoXG4gICAqL1xuICBmdW5jdGlvbiBtdWx0aXBseShhLCBiKSB7XG4gICAgdmFyIGEwMCA9IGFbMCAqIDMgKyAwXTtcbiAgICB2YXIgYTAxID0gYVswICogMyArIDFdO1xuICAgIHZhciBhMDIgPSBhWzAgKiAzICsgMl07XG4gICAgdmFyIGExMCA9IGFbMSAqIDMgKyAwXTtcbiAgICB2YXIgYTExID0gYVsxICogMyArIDFdO1xuICAgIHZhciBhMTIgPSBhWzEgKiAzICsgMl07XG4gICAgdmFyIGEyMCA9IGFbMiAqIDMgKyAwXTtcbiAgICB2YXIgYTIxID0gYVsyICogMyArIDFdO1xuICAgIHZhciBhMjIgPSBhWzIgKiAzICsgMl07XG4gICAgdmFyIGIwMCA9IGJbMCAqIDMgKyAwXTtcbiAgICB2YXIgYjAxID0gYlswICogMyArIDFdO1xuICAgIHZhciBiMDIgPSBiWzAgKiAzICsgMl07XG4gICAgdmFyIGIxMCA9IGJbMSAqIDMgKyAwXTtcbiAgICB2YXIgYjExID0gYlsxICogMyArIDFdO1xuICAgIHZhciBiMTIgPSBiWzEgKiAzICsgMl07XG4gICAgdmFyIGIyMCA9IGJbMiAqIDMgKyAwXTtcbiAgICB2YXIgYjIxID0gYlsyICogMyArIDFdO1xuICAgIHZhciBiMjIgPSBiWzIgKiAzICsgMl07XG5cbiAgICByZXR1cm4gW1xuICAgICAgYjAwICogYTAwICsgYjAxICogYTEwICsgYjAyICogYTIwLFxuICAgICAgYjAwICogYTAxICsgYjAxICogYTExICsgYjAyICogYTIxLFxuICAgICAgYjAwICogYTAyICsgYjAxICogYTEyICsgYjAyICogYTIyLFxuICAgICAgYjEwICogYTAwICsgYjExICogYTEwICsgYjEyICogYTIwLFxuICAgICAgYjEwICogYTAxICsgYjExICogYTExICsgYjEyICogYTIxLFxuICAgICAgYjEwICogYTAyICsgYjExICogYTEyICsgYjEyICogYTIyLFxuICAgICAgYjIwICogYTAwICsgYjIxICogYTEwICsgYjIyICogYTIwLFxuICAgICAgYjIwICogYTAxICsgYjIxICogYTExICsgYjIyICogYTIxLFxuICAgICAgYjIwICogYTAyICsgYjIxICogYTEyICsgYjIyICogYTIyLFxuICAgIF07XG4gIH1cblxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgM3gzIGlkZW50aXR5IG1hdHJpeFxuICAgKiBAcmV0dXJuIHttb2R1bGU6d2ViZ2wyLTJkLW1hdGguTWF0cml4M30gYW4gaWRlbnRpdHkgbWF0cml4XG4gICAqL1xuICBmdW5jdGlvbiBpZGVudGl0eSgpIHtcbiAgICByZXR1cm4gW1xuICAgICAgMSwgMCwgMCxcbiAgICAgIDAsIDEsIDAsXG4gICAgICAwLCAwLCAxLFxuICAgIF07XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIDJEIHByb2plY3Rpb24gbWF0cml4XG4gICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aCB3aWR0aCBpbiBwaXhlbHNcbiAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodCBoZWlnaHQgaW4gcGl4ZWxzXG4gICAqIEByZXR1cm4ge21vZHVsZTp3ZWJnbC0yZC1tYXRoLk1hdHJpeDN9IGEgcHJvamVjdGlvbiBtYXRyaXggdGhhdCBjb252ZXJ0cyBmcm9tIHBpeGVscyB0byBjbGlwc3BhY2Ugd2l0aCBZID0gMCBhdCB0aGUgdG9wLlxuICAgKiBAbWVtYmVyT2YgbW9kdWxlOndlYmdsLTJkLW1hdGhcbiAgICovXG4gIGZ1bmN0aW9uIHByb2plY3Rpb24od2lkdGgsIGhlaWdodCkge1xuICAgIC8vIE5vdGU6IFRoaXMgbWF0cml4IGZsaXBzIHRoZSBZIGF4aXMgc28gMCBpcyBhdCB0aGUgdG9wLlxuICAgIHJldHVybiBbXG4gICAgICAyIC8gd2lkdGgsIDAsIDAsXG4gICAgICAwLCAtMiAvIGhlaWdodCwgMCxcbiAgICAgIC0xLCAxLCAxLFxuICAgIF07XG4gIH1cblxuICAvKipcbiAgICogTXVsdGlwbGllcyBieSBhIDJEIHByb2plY3Rpb24gbWF0cml4XG4gICAqIEBwYXJhbSB7bW9kdWxlOndlYmdsLTJkLW1hdGguTWF0cml4M30gdGhlIG1hdHJpeCB0byBiZSBtdWx0aXBsaWVkXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aCB3aWR0aCBpbiBwaXhlbHNcbiAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodCBoZWlnaHQgaW4gcGl4ZWxzXG4gICAqIEByZXR1cm4ge21vZHVsZTp3ZWJnbC0yZC1tYXRoLk1hdHJpeDN9IHRoZSByZXN1bHRcbiAgICogQG1lbWJlck9mIG1vZHVsZTp3ZWJnbC0yZC1tYXRoXG4gICAqL1xuICBmdW5jdGlvbiBwcm9qZWN0KG0sIHdpZHRoLCBoZWlnaHQpIHtcbiAgICByZXR1cm4gbXVsdGlwbHkobSwgcHJvamVjdGlvbih3aWR0aCwgaGVpZ2h0KSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIDJEIHRyYW5zbGF0aW9uIG1hdHJpeFxuICAgKiBAcGFyYW0ge251bWJlcn0gdHggYW1vdW50IHRvIHRyYW5zbGF0ZSBpbiB4XG4gICAqIEBwYXJhbSB7bnVtYmVyfSB0eSBhbW91bnQgdG8gdHJhbnNsYXRlIGluIHlcbiAgICogQHJldHVybiB7bW9kdWxlOndlYmdsLTJkLW1hdGguTWF0cml4M30gYSB0cmFuc2xhdGlvbiBtYXRyaXggdGhhdCB0cmFuc2xhdGVzIGJ5IHR4IGFuZCB0eS5cbiAgICogQG1lbWJlck9mIG1vZHVsZTp3ZWJnbC0yZC1tYXRoXG4gICAqL1xuICBmdW5jdGlvbiB0cmFuc2xhdGlvbih0eCwgdHkpIHtcbiAgICByZXR1cm4gW1xuICAgICAgMSwgMCwgMCxcbiAgICAgIDAsIDEsIDAsXG4gICAgICB0eCwgdHksIDEsXG4gICAgXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNdWx0aXBsaWVzIGJ5IGEgMkQgdHJhbnNsYXRpb24gbWF0cml4XG4gICAqIEBwYXJhbSB7bW9kdWxlOndlYmdsLTJkLW1hdGguTWF0cml4M30gdGhlIG1hdHJpeCB0byBiZSBtdWx0aXBsaWVkXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB0eCBhbW91bnQgdG8gdHJhbnNsYXRlIGluIHhcbiAgICogQHBhcmFtIHtudW1iZXJ9IHR5IGFtb3VudCB0byB0cmFuc2xhdGUgaW4geVxuICAgKiBAcmV0dXJuIHttb2R1bGU6d2ViZ2wtMmQtbWF0aC5NYXRyaXgzfSB0aGUgcmVzdWx0XG4gICAqIEBtZW1iZXJPZiBtb2R1bGU6d2ViZ2wtMmQtbWF0aFxuICAgKi9cbiAgZnVuY3Rpb24gdHJhbnNsYXRlKG0sIHR4LCB0eSkge1xuICAgIHJldHVybiBtdWx0aXBseShtLCB0cmFuc2xhdGlvbih0eCwgdHkpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgMkQgcm90YXRpb24gbWF0cml4XG4gICAqIEBwYXJhbSB7bnVtYmVyfSBhbmdsZUluUmFkaWFucyBhbW91bnQgdG8gcm90YXRlIGluIHJhZGlhbnNcbiAgICogQHJldHVybiB7bW9kdWxlOndlYmdsLTJkLW1hdGguTWF0cml4M30gYSByb3RhdGlvbiBtYXRyaXggdGhhdCByb3RhdGVzIGJ5IGFuZ2xlSW5SYWRpYW5zXG4gICAqIEBtZW1iZXJPZiBtb2R1bGU6d2ViZ2wtMmQtbWF0aFxuICAgKi9cbiAgZnVuY3Rpb24gcm90YXRpb24oYW5nbGVJblJhZGlhbnMpIHtcbiAgICB2YXIgYyA9IE1hdGguY29zKGFuZ2xlSW5SYWRpYW5zKTtcbiAgICB2YXIgcyA9IE1hdGguc2luKGFuZ2xlSW5SYWRpYW5zKTtcbiAgICByZXR1cm4gW1xuICAgICAgYywgLXMsIDAsXG4gICAgICBzLCBjLCAwLFxuICAgICAgMCwgMCwgMSxcbiAgICBdO1xuICB9XG5cbiAgLyoqXG4gICAqIE11bHRpcGxpZXMgYnkgYSAyRCByb3RhdGlvbiBtYXRyaXhcbiAgICogQHBhcmFtIHttb2R1bGU6d2ViZ2wtMmQtbWF0aC5NYXRyaXgzfSB0aGUgbWF0cml4IHRvIGJlIG11bHRpcGxpZWRcbiAgICogQHBhcmFtIHtudW1iZXJ9IGFuZ2xlSW5SYWRpYW5zIGFtb3VudCB0byByb3RhdGUgaW4gcmFkaWFuc1xuICAgKiBAcmV0dXJuIHttb2R1bGU6d2ViZ2wtMmQtbWF0aC5NYXRyaXgzfSB0aGUgcmVzdWx0XG4gICAqIEBtZW1iZXJPZiBtb2R1bGU6d2ViZ2wtMmQtbWF0aFxuICAgKi9cbiAgZnVuY3Rpb24gcm90YXRlKG0sIGFuZ2xlSW5SYWRpYW5zKSB7XG4gICAgcmV0dXJuIG11bHRpcGx5KG0sIHJvdGF0aW9uKGFuZ2xlSW5SYWRpYW5zKSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIDJEIHNjYWxpbmcgbWF0cml4XG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzeCBhbW91bnQgdG8gc2NhbGUgaW4geFxuICAgKiBAcGFyYW0ge251bWJlcn0gc3kgYW1vdW50IHRvIHNjYWxlIGluIHlcbiAgICogQHJldHVybiB7bW9kdWxlOndlYmdsLTJkLW1hdGguTWF0cml4M30gYSBzY2FsZSBtYXRyaXggdGhhdCBzY2FsZXMgYnkgc3ggYW5kIHN5LlxuICAgKiBAbWVtYmVyT2YgbW9kdWxlOndlYmdsLTJkLW1hdGhcbiAgICovXG4gIGZ1bmN0aW9uIHNjYWxpbmcoc3gsIHN5KSB7XG4gICAgcmV0dXJuIFtcbiAgICAgIHN4LCAwLCAwLFxuICAgICAgMCwgc3ksIDAsXG4gICAgICAwLCAwLCAxLFxuICAgIF07XG4gIH1cblxuICAvKipcbiAgICogTXVsdGlwbGllcyBieSBhIDJEIHNjYWxpbmcgbWF0cml4XG4gICAqIEBwYXJhbSB7bW9kdWxlOndlYmdsLTJkLW1hdGguTWF0cml4M30gdGhlIG1hdHJpeCB0byBiZSBtdWx0aXBsaWVkXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzeCBhbW91bnQgdG8gc2NhbGUgaW4geFxuICAgKiBAcGFyYW0ge251bWJlcn0gc3kgYW1vdW50IHRvIHNjYWxlIGluIHlcbiAgICogQHJldHVybiB7bW9kdWxlOndlYmdsLTJkLW1hdGguTWF0cml4M30gdGhlIHJlc3VsdFxuICAgKiBAbWVtYmVyT2YgbW9kdWxlOndlYmdsLTJkLW1hdGhcbiAgICovXG4gIGZ1bmN0aW9uIHNjYWxlKG0sIHN4LCBzeSkge1xuICAgIHJldHVybiBtdWx0aXBseShtLCBzY2FsaW5nKHN4LCBzeSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gZG90KHgxLCB5MSwgeDIsIHkyKSB7XG4gICAgcmV0dXJuIHgxICogeDIgKyB5MSAqIHkyO1xuICB9XG5cbiAgZnVuY3Rpb24gZGlzdGFuY2UoeDEsIHkxLCB4MiwgeTIpIHtcbiAgICB2YXIgZHggPSB4MSAtIHgyO1xuICAgIHZhciBkeSA9IHkxIC0geTI7XG4gICAgcmV0dXJuIE1hdGguc3FydChkeCAqIGR4ICsgZHkgKiBkeSk7XG4gIH1cblxuICBmdW5jdGlvbiBub3JtYWxpemUoeCwgeSkge1xuICAgIHZhciBsID0gZGlzdGFuY2UoMCwgMCwgeCwgeSk7XG4gICAgaWYgKGwgPiAwLjAwMDAxKSB7XG4gICAgICByZXR1cm4gW3ggLyBsLCB5IC8gbF07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBbMCwgMF07XG4gICAgfVxuICB9XG5cbiAgLy8gaSA9IGluY2lkZW50XG4gIC8vIG4gPSBub3JtYWxcbiAgZnVuY3Rpb24gcmVmbGVjdChpeCwgaXksIG54LCBueSkge1xuICAgIC8vIEkgLSAyLjAgKiBkb3QoTiwgSSkgKiBOLlxuICAgIHZhciBkID0gZG90KG54LCBueSwgaXgsIGl5KTtcbiAgICByZXR1cm4gW1xuICAgICAgaXggLSAyICogZCAqIG54LFxuICAgICAgaXkgLSAyICogZCAqIG55LFxuICAgIF07XG4gIH1cblxuICBmdW5jdGlvbiByYWRUb0RlZyhyKSB7XG4gICAgcmV0dXJuIHIgKiAxODAgLyBNYXRoLlBJO1xuICB9XG5cbiAgZnVuY3Rpb24gZGVnVG9SYWQoZCkge1xuICAgIHJldHVybiBkICogTWF0aC5QSSAvIDE4MDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRyYW5zZm9ybVBvaW50KG0sIHYpIHtcbiAgICB2YXIgdjAgPSB2WzBdO1xuICAgIHZhciB2MSA9IHZbMV07XG4gICAgdmFyIGQgPSB2MCAqIG1bMCAqIDMgKyAyXSArIHYxICogbVsxICogMyArIDJdICsgbVsyICogMyArIDJdO1xuICAgIHJldHVybiBbXG4gICAgICAodjAgKiBtWzAgKiAzICsgMF0gKyB2MSAqIG1bMSAqIDMgKyAwXSArIG1bMiAqIDMgKyAwXSkgLyBkLFxuICAgICAgKHYwICogbVswICogMyArIDFdICsgdjEgKiBtWzEgKiAzICsgMV0gKyBtWzIgKiAzICsgMV0pIC8gZCxcbiAgICBdO1xuICB9XG5cbiAgZnVuY3Rpb24gaW52ZXJzZShtKSB7XG4gICAgdmFyIHQwMCA9IG1bMSAqIDMgKyAxXSAqIG1bMiAqIDMgKyAyXSAtIG1bMSAqIDMgKyAyXSAqIG1bMiAqIDMgKyAxXTtcbiAgICB2YXIgdDEwID0gbVswICogMyArIDFdICogbVsyICogMyArIDJdIC0gbVswICogMyArIDJdICogbVsyICogMyArIDFdO1xuICAgIHZhciB0MjAgPSBtWzAgKiAzICsgMV0gKiBtWzEgKiAzICsgMl0gLSBtWzAgKiAzICsgMl0gKiBtWzEgKiAzICsgMV07XG4gICAgdmFyIGQgPSAxLjAgLyAobVswICogMyArIDBdICogdDAwIC0gbVsxICogMyArIDBdICogdDEwICsgbVsyICogMyArIDBdICogdDIwKTtcbiAgICByZXR1cm4gW1xuICAgICAgIGQgKiB0MDAsIC1kICogdDEwLCBkICogdDIwLFxuICAgICAgLWQgKiAobVsxICogMyArIDBdICogbVsyICogMyArIDJdIC0gbVsxICogMyArIDJdICogbVsyICogMyArIDBdKSxcbiAgICAgICBkICogKG1bMCAqIDMgKyAwXSAqIG1bMiAqIDMgKyAyXSAtIG1bMCAqIDMgKyAyXSAqIG1bMiAqIDMgKyAwXSksXG4gICAgICAtZCAqIChtWzAgKiAzICsgMF0gKiBtWzEgKiAzICsgMl0gLSBtWzAgKiAzICsgMl0gKiBtWzEgKiAzICsgMF0pLFxuICAgICAgIGQgKiAobVsxICogMyArIDBdICogbVsyICogMyArIDFdIC0gbVsxICogMyArIDFdICogbVsyICogMyArIDBdKSxcbiAgICAgIC1kICogKG1bMCAqIDMgKyAwXSAqIG1bMiAqIDMgKyAxXSAtIG1bMCAqIDMgKyAxXSAqIG1bMiAqIDMgKyAwXSksXG4gICAgICAgZCAqIChtWzAgKiAzICsgMF0gKiBtWzEgKiAzICsgMV0gLSBtWzAgKiAzICsgMV0gKiBtWzEgKiAzICsgMF0pLFxuICAgIF07XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGRlZ1RvUmFkOiBkZWdUb1JhZCxcbiAgICBkaXN0YW5jZTogZGlzdGFuY2UsXG4gICAgZG90OiBkb3QsXG4gICAgaWRlbnRpdHk6IGlkZW50aXR5LFxuICAgIGludmVyc2U6IGludmVyc2UsXG4gICAgbXVsdGlwbHk6IG11bHRpcGx5LFxuICAgIG5vcm1hbGl6ZTogbm9ybWFsaXplLFxuICAgIHByb2plY3Rpb246IHByb2plY3Rpb24sXG4gICAgcmFkVG9EZWc6IHJhZFRvRGVnLFxuICAgIHJlZmxlY3Q6IHJlZmxlY3QsXG4gICAgcm90YXRpb246IHJvdGF0aW9uLFxuICAgIHJvdGF0ZTogcm90YXRlLFxuICAgIHNjYWxpbmc6IHNjYWxpbmcsXG4gICAgc2NhbGU6IHNjYWxlLFxuICAgIHRyYW5zZm9ybVBvaW50OiB0cmFuc2Zvcm1Qb2ludCxcbiAgICB0cmFuc2xhdGlvbjogdHJhbnNsYXRpb24sXG4gICAgdHJhbnNsYXRlOiB0cmFuc2xhdGUsXG4gICAgcHJvamVjdDogcHJvamVjdCxcbiAgfTtcblxufSkpO1xuXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9pbmRleC50c1wiKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=