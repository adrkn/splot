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
const splot_1 = __importDefault(__webpack_require__(/*! @/splot */ "./splot.ts"));
__webpack_require__(/*! @/style */ "./style.css");
function randomInt(range) {
    return Math.floor(Math.random() * range);
}
let i = 0;
let n = 1000000; // Имитируемое число объектов.
let palette = ['#FF00FF', '#800080', '#FF0000', '#800000', '#FFFF00', '#00FF00', '#008000', '#00FFFF', '#0000FF', '#000080'];
let plotWidth = 32000;
let plotHeight = 16000;
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
let scatterPlot = new splot_1.default('canvas1');
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
class SPlot {
    constructor(canvasId, options) {
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
             * По умолчанию в режиме демонстрационных данных будут поровну отображаться
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
        this._variables = [];
        this._vertexShaderCodeTemplate = 'attribute vec2 a_position;\n' +
            'attribute float a_color;\n' +
            'uniform mat3 u_matrix;\n' +
            'varying vec3 v_color;\n' +
            'void main() {\n' +
            '  gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0.0, 1.0);\n' +
            '  SET-VERTEX-COLOR-CODE' +
            '}\n';
        this._fragmentShaderCodeTemplate = 'precision lowp float;\n' +
            'varying vec3 v_color;\n' +
            'void main() {\n' +
            '  gl_FragColor = vec4(v_color.rgb, 1.0);\n' +
            '}\n';
        this._amountOfPolygons = 0;
        this._debugStyle = 'font-weight: bold; color: #ffffff;';
        this._USEFUL_CONSTS = [];
        this._isRunning = false;
        this._transormation = {
            matrix: [],
            startInvMatrix: [],
            startCameraX: 0,
            startCameraY: 0,
            startPosX: 0,
            startPosY: 0
        };
        this._maxAmountOfVertexPerPolygonGroup = 32768 - (this.circleApproxLevel + 1);
        this._buffers = {
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
        this._getVertices = [];
        SPlot.instances[canvasId] = this;
        this._canvas = document.getElementById(canvasId);
        if (options) {
            this._setOptions(options);
            if (this.forceRun) {
                this.setup(options);
            }
        }
        this.registerPolygonShape(this._getVerticesOfTriangle, 'Треугольник');
        this.registerPolygonShape(this._getVerticesOfSquare, 'Квадрат');
        this.registerPolygonShape(this._getVerticesOfCircle, 'Круг');
    }
    /**
     * Создает и инициализирует объекты рендеринга WebGL.
     *
     * @private
     * @param {string} canvasId Идентификатор элемента <canvas>.
     */
    _createWebGl() {
        this._gl = this._canvas.getContext('webgl', this.webGlSettings);
        // Выравнивание области рендеринга в соответствии с размером канваса.
        this._canvas.width = this._canvas.clientWidth;
        this._canvas.height = this._canvas.clientHeight;
        this._gl.viewport(0, 0, this._canvas.width, this._canvas.height);
    }
    registerPolygonShape(polygonFunc, polygonCaption) {
        // Занесение функции и названия формы в массив. Форма будет кодироваться индексом в этом массиве.
        this._getVertices.push({
            func: polygonFunc,
            caption: polygonCaption
        });
        // Добавление новой формы в массив частот появления форм в режиме демонстрационных данных.
        this.demoMode.shapeQuota.push(1);
        return this._getVertices.length - 1;
    }
    /**
     * Устанавливает необходимые перед запуском рендера параметры экземпляра и WebGL.
     *
     * @public
     * @param {SPlotOptions} options Пользовательские настройки экземпляра.
     */
    setup(options) {
        // Применение пользовательских настроек.
        this._setOptions(options);
        this._createWebGl();
        // Обнуление счетчика полигонов.
        this._amountOfPolygons = 0;
        // Обнуление счетчиков форм полигонов.
        for (let i = 0; i < this._getVertices.length; i++) {
            this._buffers.amountOfShapes[i] = 0;
        }
        /**
         * Предельное количество вершин в группе полигонов зависит от параметра
         * circleApproxLevel, который мог быть изменен пользовательскими настройками.
         */
        this._maxAmountOfVertexPerPolygonGroup = 32768 - (this.circleApproxLevel + 1);
        // Инициализация вспомогательных констант.
        this._setUsefulConstants();
        /**
         * Подготовка кодов шейдеров. Код фрагментного шейдера используется как есть.
         * В код вершинного шейдера вставляется код выбора цвета вершин.
         */
        let vertexShaderCode = this._vertexShaderCodeTemplate.replace('SET-VERTEX-COLOR-CODE', this._genShaderColorCode());
        let fragmentShaderCode = this._fragmentShaderCodeTemplate;
        // Создание шейдеров WebGL.
        let vertexShader = this._createWebGlShader('VERTEX_SHADER', vertexShaderCode);
        let fragmentShader = this._createWebGlShader('FRAGMENT_SHADER', fragmentShaderCode);
        // Создание программы WebGL.
        let gpuProgram = this._createWebGlProgram(vertexShader, fragmentShader);
        this._setWebGlProgram(gpuProgram);
        // Установка связей переменных приложения с программой WebGl.
        this._setWebGlVariable('attribute', 'a_position');
        this._setWebGlVariable('attribute', 'a_color');
        this._setWebGlVariable('uniform', 'u_matrix');
        // Создание и заполнение данными буферов WebGL.
        this._createWbGlBuffers();
        // Установка цвета очистки рендеринга
        let [r, g, b] = this._convertColor(this.bgColor);
        this._gl.clearColor(r, g, b, 0.0);
        this._gl.clear(this._gl.COLOR_BUFFER_BIT);
        // Если требуется - рендеринг запускается сразу после установки параметров экземпляра.
        if (this.forceRun) {
            this.run();
        }
    }
    /**
     * Применяет пользовательские настройки экземпляра.
     *
     * @private
     * @param {SPlotOtions} options Пользовательские настройки экземпляра.
     */
    _setOptions(options) {
        /**
         * Копирование пользовательских настроек в соответсвующие поля экземпляра.
         * Копируются только те пользовательские настройки, которым имеются соответствующие
         * эквиваленты в полях экземпляра. Копируется также первый уровень вложенных
         * настроек.
         */
        for (let option in options) {
            if (!this.hasOwnProperty(option))
                continue;
            if (isObject(options[option]) && isObject(this[option])) {
                for (let nestedOption in options[option]) {
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
         * Если пользователь задает размер плоскости, но при этом на задает начальное
         * положение области просмотра, то область просмотра помещается в центр заданной
         * плоскости.
         */
        if (options.hasOwnProperty('gridSize') && !options.hasOwnProperty('camera')) {
            this.camera = {
                x: this.gridSize.width / 2,
                y: this.gridSize.height / 2,
                zoom: 1
            };
        }
        /**
         * Если запрошен режим демонстрационных данных, то для итерирования объектов
         * будет использоваться внутренний метод, имитирующий итерирование. При этом,
         * если была задана внешняя функция итерирования - она будет проигнорирована.
         */
        if (this.demoMode.isEnable) {
            this.iterationCallback = this._demoIterationCallback;
        }
        // Вывод отладочной информации.
        if (this.debugMode.isEnable) {
            this._reportMainInfo(options);
        }
    }
    /**
     * Вычисляет набор вспомогательных констант _USEFUL_CONSTS[].
     * Они хранят результаты алгебраических и тригонометрических вычислений,
     * используемых в расчетах вершин полигонов и матриц трансформации. Такие константы
     * позволяют вынести затратные для процессора операции за пределы многократно
     * используемых функций увеличивая производительность приложения на этапах
     * подготовки данных и рендеринга.
     *
     * @private
     */
    _setUsefulConstants() {
        // Константы, зависящие от размера полигона.
        this._USEFUL_CONSTS[0] = this.polygonSize / 2;
        this._USEFUL_CONSTS[1] = this._USEFUL_CONSTS[0] / Math.cos(Math.PI / 6);
        this._USEFUL_CONSTS[2] = this._USEFUL_CONSTS[0] * Math.tan(Math.PI / 6);
        // Константы, зависящие от степени детализации круга и размера полигона.
        this._USEFUL_CONSTS[3] = new Float32Array(this.circleApproxLevel);
        this._USEFUL_CONSTS[4] = new Float32Array(this.circleApproxLevel);
        for (let i = 0; i < this.circleApproxLevel; i++) {
            const angle = 2 * Math.PI * i / this.circleApproxLevel;
            this._USEFUL_CONSTS[3][i] = this._USEFUL_CONSTS[0] * Math.cos(angle);
            this._USEFUL_CONSTS[4][i] = this._USEFUL_CONSTS[0] * Math.sin(angle);
        }
        // Константы, зависящие от размера канваса.
        this._USEFUL_CONSTS[5] = 2 / this._canvas.width;
        this._USEFUL_CONSTS[6] = 2 / this._canvas.height;
        this._USEFUL_CONSTS[7] = 2 / this._canvas.clientWidth;
        this._USEFUL_CONSTS[8] = -2 / this._canvas.clientHeight;
        this._USEFUL_CONSTS[9] = this._canvas.getBoundingClientRect().left;
        this._USEFUL_CONSTS[10] = this._canvas.getBoundingClientRect().top;
    }
    _createWebGlShader(shaderType, shaderCode) {
        // Создание, привязка кода и компиляция шейдера.
        const shader = this._gl.createShader(this._gl[shaderType]);
        this._gl.shaderSource(shader, shaderCode);
        this._gl.compileShader(shader);
        if (!this._gl.getShaderParameter(shader, this._gl.COMPILE_STATUS)) {
            throw new Error('Ошибка компиляции шейдера [' + shaderType + ']. ' + this._gl.getShaderInfoLog(shader));
        }
        // Вывод отладочной информации.
        if (this.debugMode.isEnable) {
            console.group('%cСоздан шейдер [' + shaderType + ']', this._debugStyle);
            console.log(shaderCode);
            console.groupEnd();
        }
        return shader;
    }
    /**
     * Создает программу WebGL.
     *
     * @private
     * @param {WebGLShader} vertexShader Вершинный шейдер.
     * @param {WebGLShader} fragmentShader Фрагментный шейдер.
     * @return {WebGLProgram} Созданный объект программы WebGL.
     */
    _createWebGlProgram(vertexShader, fragmentShader) {
        // Создание я привязка программы WebGL.
        let gpuProgram = this._gl.createProgram();
        this._gl.attachShader(gpuProgram, vertexShader);
        this._gl.attachShader(gpuProgram, fragmentShader);
        this._gl.linkProgram(gpuProgram);
        if (!this._gl.getProgramParameter(gpuProgram, this._gl.LINK_STATUS)) {
            throw new Error('Ошибка создания программы WebGL. ' + this._gl.getProgramInfoLog(gpuProgram));
        }
        return gpuProgram;
    }
    _setWebGlProgram(gpuProgram) {
        this._gl.useProgram(gpuProgram);
        this._gpuProgram = gpuProgram;
    }
    _setWebGlVariable(varType, varName) {
        if (varType === 'uniform') {
            this._variables[varName] = this._gl.getUniformLocation(this._gpuProgram, varName);
        }
        else if (varType === 'attribute') {
            this._variables[varName] = this._gl.getAttribLocation(this._gpuProgram, varName);
        }
    }
    /**
     * Создает и заполняет данными обо всех полигонах буферы WebGL.
     *
     * @private
     */
    _createWbGlBuffers() {
        // Вывод отладочной информации.
        if (this.debugMode.isEnable) {
            console.log('%cЗапущен процесс загрузки данных [' +
                this._getCurrentTime() + ']...', this._debugStyle);
            /**
             * Запуск консольного таймера, подсчитывающего длительность процесса итерирования
             * исходных объектов и загрузки соответствующих данных в видеопамять.
             */
            console.time('Длительность');
        }
        /** @type {SPlotPolygonGroup} */
        let polygonGroup;
        // Итерирование групп полигонов.
        while (polygonGroup = this._createPolygonGroup()) {
            // Создание и заполнение буферов данными о группе полигонов.
            this._addWbGlBuffer(this._buffers.vertexBuffers, 'ARRAY_BUFFER', new Float32Array(polygonGroup.vertices), 0);
            this._addWbGlBuffer(this._buffers.colorBuffers, 'ARRAY_BUFFER', new Uint8Array(polygonGroup.colors), 1);
            this._addWbGlBuffer(this._buffers.indexBuffers, 'ELEMENT_ARRAY_BUFFER', new Uint16Array(polygonGroup.indices), 2);
            // Счетчик количества буферов.
            this._buffers.amountOfBufferGroups++;
            // Определение количества вершин GL-треугольников текущей группы буферов.
            this._buffers.amountOfGLVertices.push(polygonGroup.amountOfGLVertices);
            // Определение общего количества вершин GL-треугольников.
            this._buffers.amountOfTotalGLVertices += polygonGroup.amountOfGLVertices;
        }
        // Вывод отладочной информации.
        if (this.debugMode.isEnable) {
            this._reportAboutObjectReading();
        }
    }
    /**
     * Считывает данные об исходных объектах и формирует соответсвующую этим объектам
     * группу полигонов. Группа формируется с учетом лимита на количество вершин
     * в группе и лимита на общее количество полигонов на канвасе.
     *
     * @private
     * @return {(SPlotPolygonGroup|null)} Созданная группа полигонов или null,
     *     если формирование всех групп полигонов завершилось.
     */
    _createPolygonGroup() {
        /** @type {SPlotPolygonGroup} */
        let polygonGroup = {
            vertices: [],
            indices: [],
            colors: [],
            amountOfVertices: 0,
            amountOfGLVertices: 0
        };
        /** @type {SPlotPolygon} */
        let polygon;
        /**
         * Если количество полигонов канваса достигло допустимого максимума, то дальнейшая
         * обработка исходных объектов больше не требуется - формирование групп полигонов
         * завершается возвратом значения null (симуляция достижения последнего
         * обрабатываемого исходного объекта).
         */
        if (this._amountOfPolygons >= this.maxAmountOfPolygons)
            return null;
        // Итерирование исходных объектов.
        while (polygon = this.iterationCallback()) {
            // Добавление в группу полигонов нового полигона.
            this._addPolygon(polygonGroup, polygon);
            // Подсчитывается число применений каждой из форм полигонов.
            this._buffers.amountOfShapes[polygon.shape]++;
            // Счетчик общего количество полигонов.
            this._amountOfPolygons++;
            /**
             * Если количество полигонов канваса достигло допустимого максимума, то дальнейшая
             * обработка исходных объектов больше не требуется - формирование групп полигонов
             * завершается возвратом значения null (симуляция достижения последнего
             * обрабатываемого исходного объекта).
             */
            if (this._amountOfPolygons >= this.maxAmountOfPolygons)
                break;
            /**
             * Если общее количество всех вершин в группе полигонов превысило допустимое,
             * то группа полигонов считается сформированной и итерирование исходных
             * объектов прерывается.
             */
            if (polygonGroup.amountOfVertices >= this._maxAmountOfVertexPerPolygonGroup)
                break;
        }
        // Подсчитывается общее количество вершин всех вершинных буферов.
        this._buffers.amountOfTotalVertices += polygonGroup.amountOfVertices;
        // Если группа полигонов непустая, то возвращаем ее. Если пустая - возвращаем null.
        return (polygonGroup.amountOfVertices > 0) ? polygonGroup : null;
    }
    /**
     * Создает в массиве буферов WebGL новый буфер и записывает в него переданные данные.
     *
     * @private
     * @param {Array.<WebGLBuffer>} buffers Массив буферов WebGL, в который будет
     *     добавлен создаваемый буфер.
     * @param {string="ARRAY_BUFFER","ELEMENT_ARRAY_BUFFER"} type Тип создаваемого
     *     буфера - с информацией о вершинах, или с информацией об индексах вершин.
     * @param {TypedArray} data Данные в виде типизированного массива для записи
     *     в создаваемый буфер.
     * @param {number} key Ключ (индекс), идентифицирующий тип буфера (для вершин,
     *     для цветов, для индексов). Используется для раздельного подсчета памяти,
     *     занимаемой каждым типом буфера.
     */
    _addWbGlBuffer(buffers, type, data, key) {
        // Определение индекса нового элемента в массиве буферов WebGL.
        const index = this._buffers.amountOfBufferGroups;
        // Создание и заполнение данными нового буфера.
        buffers[index] = this._gl.createBuffer();
        this._gl.bindBuffer(this._gl[type], buffers[index]);
        this._gl.bufferData(this._gl[type], data, this._gl.STATIC_DRAW);
        // Подсчет памяти, занимаемой буферами данных (раздельно по каждому типу буферов)
        this._buffers.sizeInBytes[key] += data.length * data.BYTES_PER_ELEMENT;
    }
    _getVerticesOfTriangle(x, y, consts) {
        const [x1, y1] = [x - consts[0], y + consts[2]];
        const [x2, y2] = [x, y - consts[1]];
        const [x3, y3] = [x + consts[0], y + consts[2]];
        const vertices = {
            values: [x1, y1, x2, y2, x3, y3],
            indices: [0, 1, 2]
        };
        return vertices;
    }
    _getVerticesOfSquare(x, y, consts) {
        const [x1, y1] = [x - consts[0], y - consts[0]];
        const [x2, y2] = [x + consts[0], y + consts[0]];
        const vertices = {
            values: [x1, y1, x2, y1, x2, y2, x1, y2],
            indices: [0, 1, 2, 0, 2, 3]
        };
        return vertices;
    }
    _getVerticesOfCircle(x, y, consts) {
        // Занесение в набор вершин центра круга.
        const vertices = {
            values: [x, y],
            indices: []
        };
        // Добавление апроксимирующих окружность круга вершин.
        for (let i = 0; i < consts[3].length; i++) {
            vertices.values.push(x + consts[3][i], y + consts[4][i]);
            vertices.indices.push(0, i + 1, i + 2);
        }
        /**
         * Последняя вершина последнего GL-треугольника заменяется на первую апроксимирующую
         * окружность круга вершину, замыкая апроксимирущий круг полигон.
         */
        vertices.indices[vertices.indices.length - 1] = 1;
        return vertices;
    }
    /**
     * Создает и добавляет в группу полигонов новый полигон.
     *
     * @private
     * @param {SPlotPolygonGroup} polygonGroup Группа полигонов, в которую
     *     происходит добавление.
     * @param {SPlotPolygon} polygon Информация о добавляемом полигоне.
     */
    _addPolygon(polygonGroup, polygon) {
        /**
         * На основе формы полигона и координат его центра вызывается соответсвующая
         * функция нахождения координат его вершин.
         */
        const vertices = this._getVertices[polygon.shape].func(polygon.x, polygon.y, this._USEFUL_CONSTS);
        // Количество вершин - это количество пар чисел в массиве вершин.
        const amountOfVertices = Math.trunc(vertices.values.length / 2);
        // Нахождение индекса первой добавляемой в группу полигонов вершины.
        const indexOfLastVertex = polygonGroup.amountOfVertices;
        /**
         * Номера индексов вершин - относительные. Для вычисления абсолютных индексов
         * необходимо прибавить к относительным индексам индекс первой добавляемой
         * в группу полигонов вершины.
         */
        for (let i = 0; i < vertices.indices.length; i++) {
            vertices.indices[i] += indexOfLastVertex;
        }
        /**
         * Добавление в группу полигонов индексов вершин нового полигона и подсчет
         * общего количества вершин GL-треугольников в группе.
         */
        polygonGroup.indices.push(...vertices.indices);
        polygonGroup.amountOfGLVertices += vertices.indices.length;
        /**
         * Добавление в группу полигонов самих вершин нового полигона и подсчет
         * общего количества вершин в группе.
         */
        polygonGroup.vertices.push(...vertices.values);
        polygonGroup.amountOfVertices += amountOfVertices;
        // Добавление цветов вершин - по одному цвету на каждую вершину.
        for (let i = 0; i < amountOfVertices; i++) {
            polygonGroup.colors.push(polygon.color);
        }
    }
    /**
     * Выводит в консоль базовую часть отладочной информации.
     *
     * @private
     * @param {SPlotOtions} options Пользовательские настройки экземпляра.
     */
    _reportMainInfo(options) {
        console.log('%cВключен режим отладки ' + this.constructor.name +
            ' [#' + this._canvas.id + ']', this._debugStyle + ' background-color: #cc0000;');
        if (this.demoMode.isEnable) {
            console.log('%cВключен демонстрационный режим данных', this._debugStyle);
        }
        // Группа "Предупреждение".
        console.group('%cПредупреждение', this._debugStyle);
        console.dir('Открытая консоль браузера и другие активные средства контроля разработки существенно снижают производительность высоконагруженных приложений. Для объективного анализа производительности все подобные средства должны быть отключены, а консоль браузера закрыта. Некоторые данные отладочной информации в зависимости от используемого браузера могут не отображаться или отображаться некорректно. Средство отладки протестировано в браузере Google Chrome v.90');
        console.groupEnd();
        /*
            // Группа "Видеосистема".
            console.group('%cВидеосистема', this._debugStyle);
        
            let ext = this._gl.getExtension('WEBGL_debug_renderer_info');
            let graphicsCardName = (ext) ? this._gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : '[неизвестно]'
            console.log('Графическая карта: ' + graphicsCardName);
            console.log('Версия GL: ' + this._gl.getParameter(this._gl.VERSION));
        
            console.groupEnd();
        */
        // Группа "Настройка параметров экземпляра".
        console.group('%cНастройка параметров экземпляра', this._debugStyle);
        console.dir(this);
        console.log('Заданы параметры:\n', JSON.stringify(options, null, ' '));
        console.log('Канвас: #' + this._canvas.id);
        console.log('Размер канваса: ' + this._canvas.width + ' x ' + this._canvas.height + ' px');
        console.log('Размер плоскости: ' + this.gridSize.width + ' x ' + this.gridSize.height + ' px');
        console.log('Размер полигона: ' + this.polygonSize + ' px');
        console.log('Апроксимация окружности: ' + this.circleApproxLevel + ' углов');
        console.log('Функция перебора: ' + this.iterationCallback.name);
        console.groupEnd();
    }
    /**
     * Выводит в консоль отладочную информацию о загрузке исходных объектов.
     *
     * @private
     */
    _reportAboutObjectReading() {
        // Группа "Загрузка данных завершена".
        console.group('%cЗагрузка данных завершена [' +
            this._getCurrentTime() + ']', this._debugStyle);
        console.timeEnd('Длительность');
        console.log('Результат: ' +
            ((this._amountOfPolygons >= this.maxAmountOfPolygons) ? 'достигнут заданный лимит (' +
                this.maxAmountOfPolygons.toLocaleString() + ')' : 'обработаны все объекты'));
        // Группа "Кол-во объектов".
        console.group('Кол-во объектов: ' + this._amountOfPolygons.toLocaleString());
        for (let i = 0; i < this._getVertices.length; i++) {
            const shapeCapction = this._getVertices[i].caption;
            const shapeAmount = this._buffers.amountOfShapes[i];
            console.log(shapeCapction + ': ' + shapeAmount.toLocaleString() +
                ' [~' + Math.round(100 * shapeAmount / this._amountOfPolygons) + '%]');
        }
        console.log('Палитра: ' + this.polygonPalette.length + ' цветов');
        console.groupEnd();
        let bytesUsedByBuffers = this._buffers.sizeInBytes[0] +
            this._buffers.sizeInBytes[1] + this._buffers.sizeInBytes[2];
        // Группа "Занято видеопамяти".
        console.group('Занято видеопамяти: ' +
            (bytesUsedByBuffers / 1000000).toFixed(2).toLocaleString() + ' МБ');
        console.log('Буферы вершин: ' +
            (this._buffers.sizeInBytes[0] / 1000000).toFixed(2).toLocaleString() + ' МБ' +
            ' [~' + Math.round(100 * this._buffers.sizeInBytes[0] / bytesUsedByBuffers) + '%]');
        console.log('Буферы цветов: '
            + (this._buffers.sizeInBytes[1] / 1000000).toFixed(2).toLocaleString() + ' МБ' +
            ' [~' + Math.round(100 * this._buffers.sizeInBytes[1] / bytesUsedByBuffers) + '%]');
        console.log('Буферы индексов: '
            + (this._buffers.sizeInBytes[2] / 1000000).toFixed(2).toLocaleString() + ' МБ' +
            ' [~' + Math.round(100 * this._buffers.sizeInBytes[2] / bytesUsedByBuffers) + '%]');
        console.groupEnd();
        console.log('Кол-во групп буферов: ' +
            this._buffers.amountOfBufferGroups.toLocaleString());
        console.log('Кол-во GL-треугольников: ' +
            (this._buffers.amountOfTotalGLVertices / 3).toLocaleString());
        console.log('Кол-во вершин: ' +
            this._buffers.amountOfTotalVertices.toLocaleString());
        console.groupEnd();
    }
    /**
     * Создает дополнение к коду на языке GLSL. Созданный код будет встроен в код
     * вершинного шейдера WebGL для задания цвета вершины в зависимости от индекса
     * цвета, присвоенного этой вершине. Т.к. шейдер не позволяет использовать в
     * качестве индексов переменные - для задания цвета используется перебор индексов.
     *
     * @private
     * @return {string} Код на языке GLSL.
     */
    _genShaderColorCode() {
        // Временно добавляем в палитру цветов вершин цвет для направляющих.
        this.polygonPalette.push(this.rulesColor);
        let code = '';
        for (let i = 0; i < this.polygonPalette.length; i++) {
            // Получение цвета в нужном формате.
            let [r, g, b] = this._convertColor(this.polygonPalette[i]);
            // Формировние строк GLSL-кода проверки индекса цвета.
            code += ((i === 0) ? '' : '  else ') +
                'if (a_color == ' + i + '.0) v_color = vec3(' +
                r.toString().slice(0, 9) + ',' +
                g.toString().slice(0, 9) + ',' +
                b.toString().slice(0, 9) + ');\n';
        }
        // Удаляем из палитры вершин временно добавленный цвет направляющих.
        this.polygonPalette.pop();
        return code;
    }
    _convertColor(hexColor) {
        let k = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor);
        let [r, g, b] = [parseInt(k[1], 16) / 255, parseInt(k[2], 16) / 255, parseInt(k[3], 16) / 255];
        return [r, g, b];
    }
    /**
     * Вычисляет текущее время.
     *
     * @private
     * @retutn {string} Строковая форматированная запись текущего времени.
     */
    _getCurrentTime() {
        let today = new Date();
        let time = ((today.getHours() < 10 ? '0' : '') + today.getHours()) + ":" +
            ((today.getMinutes() < 10 ? '0' : '') + today.getMinutes()) + ":" +
            ((today.getSeconds() < 10 ? '0' : '') + today.getSeconds());
        return time;
    }
    /**
     * Создает и добавляет в группу полигонов новый полигон - квадрат.
     *
     * @private
     * @param {HTMLCanvasElement} canvas Объект-канвас необходим, чтобы метод имел
     *     возможность обращаться к матрице трансформации экземпляра независимо от
     *     того, из какого места был вызван метод. Существует два варианта вызова
     *     метода - из другого метода экземпляра (render) и из обработчика события
     *     мыши (_handleMouseWheel). Во втором варианте использование объекта this
     *     невозможно.
     */
    _updateTransMatrix($this) {
        const t1 = $this.camera.zoom * $this._USEFUL_CONSTS[5];
        const t2 = $this.camera.zoom * $this._USEFUL_CONSTS[6];
        $this._transormation.matrix = [
            t1, 0, 0, 0, -t2, 0, -$this.camera.x * t1 - 1, $this.camera.y * t2 + 1, 1
        ];
    }
    /**
     * Реагирует на движение мыши/трекпада в момент, когда ее клавиша удерживается
     * нажатой. В этот момент область видимости перемещается на плоскости вместе
     * с движением мыши/трекпада. Вычисления внутри события сделаны максимально
     * производительными в ущерб читабельности логики производимых действий.
     *
     * @private
     * @param {MouseEvent} event Событие мыши/трекпада.
     */
    _handleMouseMove(event) {
        // Хак получения доступа к объекту this.
        const $this = SPlot.instances[event.target.id];
        $this.camera.x = $this._transormation.startCameraX + $this._transormation.startPosX -
            ((event.clientX - $this._USEFUL_CONSTS[9]) * $this._USEFUL_CONSTS[7] - 1) * $this._transormation.startInvMatrix[0] -
            $this._transormation.startInvMatrix[6];
        $this.camera.y = $this._transormation.startCameraY + $this._transormation.startPosY -
            ((event.clientY - $this._USEFUL_CONSTS[10]) * $this._USEFUL_CONSTS[8] + 1) * $this._transormation.startInvMatrix[4] -
            $this._transormation.startInvMatrix[7];
        // Рендеринг с новыми параметрами области видимости.
        $this._render();
    }
    /**
     * Реагирует на нажатие клавиши мыши/трекпада. В этот момент запускается анализ
     * движения мыши/трекпада (с зажатой клавишей). Вычисления внутри события сделаны
     * максимально производительными в ущерб читабельности логики производимых действий.
     *
     * @private
     * @param {MouseEvent} event Событие мыши/трекпада.
     */
    _handleMouseDown(event) {
        event.preventDefault();
        // Хак получения доступа к объекту this.
        const $this = SPlot.instances[event.target.id];
        event.target.addEventListener('mousemove', $this._handleMouseMove);
        event.target.addEventListener('mouseup', $this._handleMouseUp);
        $this._transormation.startInvMatrix = [
            1 / $this._transormation.matrix[0], 0, 0, 0, 1 / $this._transormation.matrix[4],
            0, -$this._transormation.matrix[6] / $this._transormation.matrix[0],
            -$this._transormation.matrix[7] / $this._transormation.matrix[4], 1
        ];
        $this._transormation.startCameraX = $this.camera.x;
        $this._transormation.startCameraY = $this.camera.y;
        $this._transormation.startPosX =
            ((event.clientX - $this._USEFUL_CONSTS[9]) * $this._USEFUL_CONSTS[7] - 1) *
                $this._transormation.startInvMatrix[0] + $this._transormation.startInvMatrix[6];
        $this._transormation.startPosY =
            ((event.clientY - $this._USEFUL_CONSTS[10]) * $this._USEFUL_CONSTS[8] + 1) *
                $this._transormation.startInvMatrix[4] + $this._transormation.startInvMatrix[7];
    }
    /**
     * Реагирует на отжатие клавиши мыши/трекпада. В этот момент анализ движения
     * мыши/трекпада с зажатой клавишей прекращается.
     *
     * @private
     * @param {MouseEvent} event Событие мыши/трекпада.
     */
    _handleMouseUp(event) {
        // Хак получения доступа к объекту this.
        const $this = SPlot.instances[event.target.id];
        event.target.removeEventListener('mousemove', $this._handleMouseMove);
        event.target.removeEventListener('mouseup', $this._handleMouseUp);
    }
    /**
     * Реагирует на зумирование мыши/трекпада. В этот момент происходит зумирование
     * координатной плоскости. Вычисления внутри события сделаны максимально
     * производительными в ущерб читабельности логики производимых действий.
     *
     * @private
     * @param {MouseEvent} event Событие мыши/трекпада.
     */
    _handleMouseWheel(event) {
        event.preventDefault();
        // Хак получения доступа к объекту this.
        const $this = SPlot.instances[event.target.id];
        const clipX = (event.clientX - $this._USEFUL_CONSTS[9]) * $this._USEFUL_CONSTS[7] - 1;
        const clipY = (event.clientY - $this._USEFUL_CONSTS[10]) * $this._USEFUL_CONSTS[8] + 1;
        const preZoomX = (clipX - $this._transormation.matrix[6]) / $this._transormation.matrix[0];
        const preZoomY = (clipY - $this._transormation.matrix[7]) / $this._transormation.matrix[4];
        const newZoom = $this.camera.zoom * Math.pow(2, event.deltaY * -0.01);
        $this.camera.zoom = Math.max(0.002, Math.min(200, newZoom));
        $this._updateTransMatrix($this);
        const postZoomX = (clipX - $this._transormation.matrix[6]) / $this._transormation.matrix[0];
        const postZoomY = (clipY - $this._transormation.matrix[7]) / $this._transormation.matrix[4];
        $this.camera.x += (preZoomX - postZoomX);
        $this.camera.y += (preZoomY - postZoomY);
        // Рендеринг с новыми параметрами области видимости.
        $this._render();
    }
    /**
     * Рисует плоскость в соответствии с текущими параметрами области видимости.
     *
     * @private
     */
    _render() {
        // Очистка объекта рендеринга WebGL.
        this._gl.clear(this._gl.COLOR_BUFFER_BIT);
        // Обновление матрицы трансформации.
        this._updateTransMatrix(this);
        // Привязка матрицы трансформации к переменной шейдера.
        this._gl.uniformMatrix3fv(this._variables['u_matrix'], false, this._transormation.matrix);
        // Итерирование и рендеринг всех буферов WebGL.
        for (let i = 0; i < this._buffers.amountOfBufferGroups; i++) {
            // Установка текущего буфера вершин и его привязка к переменной шейдера.
            this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._buffers.vertexBuffers[i]);
            this._gl.enableVertexAttribArray(this._variables['a_position']);
            this._gl.vertexAttribPointer(this._variables['a_position'], 2, this._gl.FLOAT, false, 0, 0);
            // Установка текущего буфера цветов вершин и его привязка к переменной шейдера.
            this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._buffers.colorBuffers[i]);
            this._gl.enableVertexAttribArray(this._variables['a_color']);
            this._gl.vertexAttribPointer(this._variables['a_color'], 1, this._gl.UNSIGNED_BYTE, false, 0, 0);
            // Установка текущего буфера индексов вершин.
            this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, this._buffers.indexBuffers[i]);
            // Отрисовка текущих буферов.
            this._gl.drawElements(this._gl.TRIANGLES, this._buffers.amountOfGLVertices[i], this._gl.UNSIGNED_SHORT, 0);
        }
    }
    /**
     * Генерирует случайное целое число в диапазоне от 0 до заданного предела. Сам
     * предел в диапазон не входит: [0...range-1].
     *
     * @private
     * @param {number} range Верхний предел диапазона случайного выбора.
     * @return {number} Сгенерированное случайное число.
     */
    _randomInt(range) {
        return Math.floor(Math.random() * range);
    }
    /**
     * Случайным образом возвращает один из индексов числового одномерного массива.
     * Несмотря на случайность каждого конкретного вызова функции, индексы возвращаются
     * с предопределенной частотой. Частота "выпаданий" индексов задается соответствующими
     * значениями элементов. Пример: На массиве [3, 2, 5] функция будет возвращать
     * индекс 0 с частотой = 3/(3+2+5) = 3/10, индекс 1 с частотой = 2/(3+2+5) = 2/10,
     * индекс 2 с частотой = 5/(3+2+5) = 5/10.
     * @private
     * @param {Array.<number>} arr Числовой одномерный массив, индексы которого будут
     *     возвращаться с предопределенной частотой.
     * @return {number} Случайный индекс из массива arr.
     */
    _randomQuotaIndex(arr) {
        let a = [];
        a[0] = arr[0];
        for (let i = 1; i < arr.length; i++) {
            a[i] = a[i - 1] + arr[i];
        }
        const lastIndex = a.length - 1;
        let r = Math.floor((Math.random() * a[lastIndex])) + 1;
        let [l, h] = [0, lastIndex];
        while (l < h) {
            const m = l + ((h - l) >> 1);
            (r > a[m]) ? (l = m + 1) : (h = m);
        }
        return (a[l] >= r) ? l : -1;
    }
    /**
     * Имитирует итерирование исходных объектов. При каждом новом вызове возвращает
     * информацию о полигоне со случаным положением, случайной формой и случайным цветом.
     *
     * @private
     * @return {(SPlotPolygon|null)} Информация о полигоне или null, если перебор
     *     исходных объектов закончился.
     */
    _demoIterationCallback() {
        if (this.demoMode.index < this.demoMode.amount) {
            this.demoMode.index++;
            return {
                x: this._randomInt(this.gridSize.width),
                y: this._randomInt(this.gridSize.height),
                shape: this._randomQuotaIndex(this.demoMode.shapeQuota),
                color: this._randomInt(this.polygonPalette.length)
            };
        }
        else
            return null;
    }
    /**
     * Запускает рендеринг и "прослушку" событий мыши на канвасе.
     *
     * @public
     */
    run() {
        if (!this._isRunning) {
            this._canvas.addEventListener('mousedown', this._handleMouseDown);
            this._canvas.addEventListener('wheel', this._handleMouseWheel);
            this._render();
            this._isRunning = true;
        }
        // Вывод отладочной информации.
        if (this.debugMode.isEnable) {
            console.log('%cРендеринг запущен', this._debugStyle);
        }
    }
    /**
     * Останавливает рендеринг и "прослушку" событий мыши на канвасе.
     *
     * @public
     * @param {boolean} clear Признак неообходимости вместе с остановкой рендеринга
     *     очистить канвас. Значение true очищает канвас, значение false - не очищает.
     *     По умолчанию очистка не происходит.
     */
    stop(clear = false) {
        if (this._isRunning) {
            this._canvas.removeEventListener('mousedown', this._handleMouseDown);
            this._canvas.removeEventListener('wheel', this._handleMouseWheel);
            this._canvas.removeEventListener('mousemove', this._handleMouseMove);
            this._canvas.removeEventListener('mouseup', this._handleMouseUp);
            if (clear) {
                this.clear();
            }
            this._isRunning = false;
        }
        // Вывод отладочной информации.
        if (this.debugMode.isEnable) {
            console.log('%cРендеринг остановлен', this._debugStyle);
        }
    }
    /**
     * Очищает канвас, закрашивая его в фоновый цвет.
     *
     * @public
     */
    clear() {
        this._gl.clear(this._gl.COLOR_BUFFER_BIT);
        // Вывод отладочной информации.
        if (this.debugMode.isEnable) {
            console.log('%cКонтекст рендеринга очищен [' + this.bgColor + ']', this._debugStyle);
        }
    }
}
exports.default = SPlot;
SPlot.instances = {};


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zdHlsZS5jc3M/YzRkMiIsIndlYnBhY2s6Ly8vLi9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9zcGxvdC50cyIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svc3RhcnR1cCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0FDQ0Esa0ZBQTJCO0FBQzNCLGtEQUFnQjtBQUVoQixTQUFTLFNBQVMsQ0FBQyxLQUFhO0lBQzlCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsS0FBSyxDQUFDO0FBQzFDLENBQUM7QUFFRCxJQUFJLENBQUMsR0FBRyxDQUFDO0FBQ1QsSUFBSSxDQUFDLEdBQUcsT0FBUyxFQUFFLDhCQUE4QjtBQUNqRCxJQUFJLE9BQU8sR0FBRyxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQztBQUM1SCxJQUFJLFNBQVMsR0FBRyxLQUFNO0FBQ3RCLElBQUksVUFBVSxHQUFHLEtBQU07QUFFdkIsZ0hBQWdIO0FBQ2hILFNBQVMsY0FBYztJQUNyQixJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDVCxDQUFDLEVBQUU7UUFDSCxPQUFPO1lBQ0wsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxTQUFTLENBQUM7WUFDdkIsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxVQUFVLENBQUM7WUFDeEIsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDbkIsS0FBSyxFQUFFLFNBQVMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUcsZ0NBQWdDO1NBQ3BFO0tBQ0Y7O1FB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QUFHLEdBQUcsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7U0FDdEY7SUFDSCxDQUFDOztBQTlsQ0gsd0JBK2xDQztBQTdsQ2UsZUFBUyxHQUE2QixFQUFFOzs7Ozs7O1VDdEh4RDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQSxzREFBc0Qsa0JBQWtCO1dBQ3hFO1dBQ0EsK0NBQStDLGNBQWM7V0FDN0QsRTs7Ozs7VUNOQTtVQUNBO1VBQ0E7VUFDQSIsImZpbGUiOiJzY3JpcHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCJcbmltcG9ydCBTUGxvdCBmcm9tICdAL3NwbG90J1xuaW1wb3J0ICdAL3N0eWxlJ1xuXG5mdW5jdGlvbiByYW5kb21JbnQocmFuZ2U6IG51bWJlcikge1xuICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcmFuZ2UpXG59XG5cbmxldCBpID0gMFxubGV0IG4gPSAxXzAwMF8wMDAgIC8vINCY0LzQuNGC0LjRgNGD0LXQvNC+0LUg0YfQuNGB0LvQviDQvtCx0YrQtdC60YLQvtCyLlxubGV0IHBhbGV0dGUgPSBbJyNGRjAwRkYnLCAnIzgwMDA4MCcsICcjRkYwMDAwJywgJyM4MDAwMDAnLCAnI0ZGRkYwMCcsICcjMDBGRjAwJywgJyMwMDgwMDAnLCAnIzAwRkZGRicsICcjMDAwMEZGJywgJyMwMDAwODAnXVxubGV0IHBsb3RXaWR0aCA9IDMyXzAwMFxubGV0IHBsb3RIZWlnaHQgPSAxNl8wMDBcblxuLy8g0J/RgNC40LzQtdGAINC40YLQtdGA0LjRgNGD0Y7RidC10Lkg0YTRg9C90LrRhtC40LguINCY0YLQtdGA0LDRhtC40Lgg0LjQvNC40YLQuNGA0YPRjtGC0YHRjyDRgdC70YPRh9Cw0LnQvdGL0LzQuCDQstGL0LTQsNGH0LDQvNC4LiDQn9C+0YfRgtC4INGC0LDQutC20LUg0YDQsNCx0L7RgtCw0LXRgiDRgNC10LbQuNC8INC00LXQvNC+LdC00LDQvdC90YvRhS5cbmZ1bmN0aW9uIHJlYWROZXh0T2JqZWN0KCkge1xuICBpZiAoaSA8IG4pIHtcbiAgICBpKytcbiAgICByZXR1cm4ge1xuICAgICAgeDogcmFuZG9tSW50KHBsb3RXaWR0aCksXG4gICAgICB5OiByYW5kb21JbnQocGxvdEhlaWdodCksXG4gICAgICBzaGFwZTogcmFuZG9tSW50KDMpLCAgICAgICAgICAgICAgIC8vIDAgLSDRgtGA0LXRg9Cz0L7Qu9GM0L3QuNC6LCAxIC0g0LrQstCw0LTRgNCw0YIsIDIgLSDQutGA0YPQs1xuICAgICAgY29sb3I6IHJhbmRvbUludChwYWxldHRlLmxlbmd0aCksICAvLyDQmNC90LTQtdC60YEg0YbQstC10YLQsCDQsiDQvNCw0YHRgdC40LLQtSDRhtCy0LXRgtC+0LJcbiAgICB9XG4gIH1cbiAgZWxzZVxuICAgIHJldHVybiBudWxsICAvLyDQktC+0LfQstGA0LDRidCw0LXQvCBudWxsLCDQutC+0LPQtNCwINC+0LHRitC10LrRgtGLIFwi0LfQsNC60L7QvdGH0LjQu9C40YHRjFwiXG59XG5cbi8qKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKiovXG5cbmxldCBzY2F0dGVyUGxvdCA9IG5ldyBTUGxvdCgnY2FudmFzMScpXG5cbi8vINCd0LDRgdGC0YDQvtC50LrQsCDRjdC60LfQtdC80L/Qu9GP0YDQsCDQvdCwINGA0LXQttC40Lwg0LLRi9Cy0L7QtNCwINC+0YLQu9Cw0LTQvtGH0L3QvtC5INC40L3RhNC+0YDQvNCw0YbQuNC4INCyINC60L7QvdGB0L7Qu9GMINCx0YDQsNGD0LfQtdGA0LAuXG4vLyDQlNGA0YPQs9C40LUg0L/RgNC40LzQtdGA0Ysg0YDQsNCx0L7RgtGLINC+0L/QuNGB0LDQvdGLINCyINGE0LDQudC70LUgc3Bsb3QuanMg0YHQviDRgdGC0YDQvtC60LggMjE0Llxuc2NhdHRlclBsb3Quc2V0dXAoe1xuICBpdGVyYXRpb25DYWxsYmFjazogcmVhZE5leHRPYmplY3QsXG4gIHBvbHlnb25QYWxldHRlOiBwYWxldHRlLFxuICBncmlkU2l6ZToge1xuICAgIHdpZHRoOiBwbG90V2lkdGgsXG4gICAgaGVpZ2h0OiBwbG90SGVpZ2h0LFxuICB9LFxuICBkZWJ1Z01vZGU6IHtcbiAgICBpc0VuYWJsZTogdHJ1ZSxcbiAgfSxcbiAgZGVtb01vZGU6IHtcbiAgICBpc0VuYWJsZTogdHJ1ZSxcbiAgfSxcbn0pXG5cbnNjYXR0ZXJQbG90LnJ1bigpXG4iLCJcbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbDogYW55KSB7XG4gIHJldHVybiAodmFsIGluc3RhbmNlb2YgT2JqZWN0KSAmJiAodmFsLmNvbnN0cnVjdG9yID09PSBPYmplY3QpO1xufVxuXG50eXBlIFNQbG90U2hhcGVGdW5jdGlvbiA9ICh4OiBudW1iZXIsIHk6IG51bWJlciwgY29uc3RzOiBBcnJheTxhbnk+KSA9PiBTUGxvdFBvbHlnb25WZXJ0aWNlc1xuXG4vKipcbiAqINCm0LLQtdGCINCyIEhFWC3RhNC+0YDQvNCw0YLQtS5cbiAqL1xudHlwZSBIRVhDb2xvciA9IHN0cmluZ1xuXG4vKipcbiAqINCk0YPQvdC60YbQuNGPINC40YLQtdGA0LjRgNC+0LLQsNC90LjRjyDQvNCw0YHRgdC40LLQsCDQuNGB0YXQvtC00L3Ri9GFINC+0LHRitC10LrRgtC+0LIuINCa0LDQttC00YvQuSDQstGL0LfQvtCyINGC0LDQutC+0Lkg0YTRg9C90LrRhtC40LhcbiAqINC00L7Qu9C20LXQvSDQstC+0LfQstGA0LDRidCw0YLRjCDQuNC90YTQvtGA0LzQsNGG0LjRjiDQvtCxINC+0YfQtdGA0LXQtNC90L7QvCDQv9C+0LvQuNCz0L7QvdC1LCDQutC+0YLQvtGA0YvQuSDQvdC10L7QsdGF0L7QtNC40LzQvlxuICog0L7RgtC+0LHRgNCw0LfQuNGC0YwgKNC10LPQviDQutC+0L7RgNC00LjQvdCw0YLRiywg0YTQvtGA0LzRgyDQuCDRhtCy0LXRgikuINCa0L7Qs9C00LAg0LjRgdGF0L7QtNC90YvQtSDQvtCx0YrQtdC60YLRiyDQt9Cw0LrQvtC90YfQsNGC0YHRj1xuICog0YTRg9C90LrRhtC40Y8g0LTQvtC70LbQvdCwINCy0LXRgNC90YPRgtGMIG51bGwuXG4gKi9cbnR5cGUgU1Bsb3RJdGVyYXRpb25GdW5jdGlvbiA9ICgpID0+IFNQbG90UG9seWdvbiB8IG51bGxcblxudHlwZSBTUGxvdERlYnVnT3V0cHV0ID0gJ2NvbnNvbGUnIHwgJ2RvY3VtZW50JyB8ICdmaWxlJ1xuXG50eXBlIFdlYkdsU2hhZGVyVHlwZSA9ICdWRVJURVhfU0hBREVSJyB8ICdGUkFHTUVOVF9TSEFERVInXG5cbnR5cGUgV2ViR2xCdWZmZXJUeXBlID0gJ0FSUkFZX0JVRkZFUicgfCAnRUxFTUVOVF9BUlJBWV9CVUZGRVInXG5cbnR5cGUgV2ViR2xWYXJpYWJsZVR5cGUgPSAndW5pZm9ybScgfCAnYXR0cmlidXRlJ1xuXG50eXBlIFR5cGVkQXJyYXkgPSBJbnQ4QXJyYXkgfCBJbnQxNkFycmF5IHwgSW50MzJBcnJheSB8IFVpbnQ4QXJyYXkgfCBVaW50MTZBcnJheSB8IFVpbnQzMkFycmF5IHwgRmxvYXQzMkFycmF5IHwgRmxvYXQ2NEFycmF5XG5cbnR5cGUgU1Bsb3RXZWJHbFZhcmlhYmxlcyA9IHtcbiAgbmFtZTogc3RyaW5nLFxuICB0eXBlOiBXZWJHbFZhcmlhYmxlVHlwZSxcbiAgdmFsdWU6IFdlYkdMVW5pZm9ybUxvY2F0aW9uIHwgR0xpbnRcbn1cblxuaW50ZXJmYWNlIFNQbG90T3B0aW9ucyB7XG4gIGl0ZXJhdGlvbkNhbGxiYWNrPzogU1Bsb3RJdGVyYXRpb25GdW5jdGlvbixcbiAgcG9seWdvblBhbGV0dGU/OiBIRVhDb2xvcltdLFxuICBncmlkU2l6ZT86IFNQbG90R3JpZFNpemUsXG4gIHBvbHlnb25TaXplPzogbnVtYmVyLFxuICBjaXJjbGVBcHByb3hMZXZlbD86IG51bWJlcixcbiAgZGVidWdNb2RlPzogU1Bsb3REZWJ1Z01vZGUsXG4gIGRlbW9Nb2RlPzogU1Bsb3REZW1vTW9kZSxcbiAgZm9yY2VSdW4/OiBib29sZWFuLFxuICBtYXhBbW91bnRPZlBvbHlnb25zPzogbnVtYmVyLFxuICBiZ0NvbG9yPzogSEVYQ29sb3IsXG4gIHJ1bGVzQ29sb3I/OiBIRVhDb2xvcixcbiAgY2FtZXJhPzogU1Bsb3RDYW1lcmEsXG4gIHdlYkdsU2V0dGluZ3M/OiBXZWJHTENvbnRleHRBdHRyaWJ1dGVzXG59XG5cbmludGVyZmFjZSBTUGxvdFBvbHlnb24ge1xuICB4OiBudW1iZXIsXG4gIHk6IG51bWJlcixcbiAgc2hhcGU6IG51bWJlcixcbiAgY29sb3I6IG51bWJlclxufVxuXG5pbnRlcmZhY2UgU1Bsb3RHcmlkU2l6ZSB7XG4gIHdpZHRoOiBudW1iZXIsXG4gIGhlaWdodDogbnVtYmVyXG59XG5cbmludGVyZmFjZSBTUGxvdERlYnVnTW9kZSB7XG4gIGlzRW5hYmxlPzogYm9vbGVhbixcbiAgb3V0cHV0PzogU1Bsb3REZWJ1Z091dHB1dFxufVxuXG5pbnRlcmZhY2UgU1Bsb3REZW1vTW9kZSB7XG4gIGlzRW5hYmxlPzogYm9vbGVhbixcbiAgYW1vdW50PzogbnVtYmVyLFxuICBzaGFwZVF1b3RhPzogbnVtYmVyW10sXG4gIGluZGV4PzogbnVtYmVyXG59XG5cbmludGVyZmFjZSBTUGxvdENhbWVyYSB7XG4gIHg6IG51bWJlcixcbiAgeTogbnVtYmVyLFxuICB6b29tOiBudW1iZXJcbn1cblxuaW50ZXJmYWNlIFNQbG90VHJhbnNmb3JtYXRpb24ge1xuICBtYXRyaXg6IG51bWJlcltdLFxuICBzdGFydEludk1hdHJpeDogbnVtYmVyW10sXG4gIHN0YXJ0Q2FtZXJhWDogbnVtYmVyLFxuICBzdGFydENhbWVyYVk6IG51bWJlcixcbiAgc3RhcnRQb3NYOiBudW1iZXIsXG4gIHN0YXJ0UG9zWTogbnVtYmVyXG59XG5cbmludGVyZmFjZSBTUGxvdEJ1ZmZlcnMge1xuICB2ZXJ0ZXhCdWZmZXJzOiBXZWJHTEJ1ZmZlcltdLFxuICBjb2xvckJ1ZmZlcnM6IFdlYkdMQnVmZmVyW10sXG4gIGluZGV4QnVmZmVyczogV2ViR0xCdWZmZXJbXSxcbiAgYW1vdW50T2ZHTFZlcnRpY2VzOiBudW1iZXJbXSxcbiAgYW1vdW50T2ZTaGFwZXM6IG51bWJlcltdLFxuICBhbW91bnRPZkJ1ZmZlckdyb3VwczogbnVtYmVyLFxuICBhbW91bnRPZlRvdGFsVmVydGljZXM6IG51bWJlcixcbiAgYW1vdW50T2ZUb3RhbEdMVmVydGljZXM6IG51bWJlcixcbiAgc2l6ZUluQnl0ZXM6IG51bWJlcltdXG59XG5cbmludGVyZmFjZSBTUGxvdFBvbHlnb25Hcm91cCB7XG4gIHZlcnRpY2VzOiBudW1iZXJbXSxcbiAgaW5kaWNlczogbnVtYmVyW10sXG4gIGNvbG9yczogbnVtYmVyW10sXG4gIGFtb3VudE9mVmVydGljZXM6IG51bWJlcixcbiAgYW1vdW50T2ZHTFZlcnRpY2VzOiBudW1iZXJcbn1cblxuaW50ZXJmYWNlIFNQbG90UG9seWdvblZlcnRpY2VzIHtcbiAgdmFsdWVzOiBudW1iZXJbXSxcbiAgaW5kaWNlczogbnVtYmVyW11cbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU1Bsb3Qge1xuXG4gIHB1YmxpYyBzdGF0aWMgaW5zdGFuY2VzOiB7IFtrZXk6IHN0cmluZ106IFNQbG90IH0gPSB7fVxuXG4gIHB1YmxpYyBpdGVyYXRpb25DYWxsYmFjaz86IFNQbG90SXRlcmF0aW9uRnVuY3Rpb25cblxuICBwdWJsaWMgcG9seWdvblBhbGV0dGU6IEhFWENvbG9yW10gPSBbXG4gICAgJyNGRjAwRkYnLCAnIzgwMDA4MCcsICcjRkYwMDAwJywgJyM4MDAwMDAnLCAnI0ZGRkYwMCcsXG4gICAgJyMwMEZGMDAnLCAnIzAwODAwMCcsICcjMDBGRkZGJywgJyMwMDAwRkYnLCAnIzAwMDA4MCdcbiAgXVxuXG4gIHB1YmxpYyBncmlkU2l6ZTogU1Bsb3RHcmlkU2l6ZSA9IHtcbiAgICB3aWR0aDogMzJfMDAwLFxuICAgIGhlaWdodDogMTZfMDAwXG4gIH1cblxuICBwdWJsaWMgcG9seWdvblNpemU6IG51bWJlciA9IDIwXG5cbiAgcHVibGljIGNpcmNsZUFwcHJveExldmVsOiBudW1iZXIgPSAxMlxuXG4gIHB1YmxpYyBkZWJ1Z01vZGU6IFNQbG90RGVidWdNb2RlID0ge1xuICAgIGlzRW5hYmxlOiBmYWxzZSxcbiAgICBvdXRwdXQ6ICdjb25zb2xlJ1xuICB9XG5cbiAgcHVibGljIGRlbW9Nb2RlOiBTUGxvdERlbW9Nb2RlID0ge1xuICAgIGlzRW5hYmxlOiBmYWxzZSxcbiAgICBhbW91bnQ6IDFfMDAwXzAwMCxcbiAgICAvKipcbiAgICAgKiDQn9C+INGD0LzQvtC70YfQsNC90LjRjiDQsiDRgNC10LbQuNC80LUg0LTQtdC80L7QvdGB0YLRgNCw0YbQuNC+0L3QvdGL0YUg0LTQsNC90L3Ri9GFINCx0YPQtNGD0YIg0L/QvtGA0L7QstC90YMg0L7RgtC+0LHRgNCw0LbQsNGC0YzRgdGPXG4gICAgICog0L/QvtC70LjQs9C+0L3RiyDQstGB0LXRhSDQstC+0LfQvNC+0LbQvdGL0YUg0YTQvtGA0LwuINCh0L7QvtGC0LLQtdGC0YHRgtCy0YPRjtGJ0LjQtSDQt9C90LDRh9C10L3QuNGPIHNoYXBlUXVvdGFcbiAgICAgKiDQuNC90LjRhtC40LDQu9C40LfQuNGA0YPRjtGC0YHRjyDQv9GA0Lgg0YDQtdCz0LjRgdGC0YDQsNGG0LjQuCDRhNGD0L3QutGG0LjQuSDRgdC+0LfQtNCw0L3QuNGPINGE0L7RgNC8ICjQvdC40LbQtSDQv9C+INC60L7QtNGDKS5cbiAgICAgKi9cbiAgICBzaGFwZVF1b3RhOiBbXSxcbiAgICBpbmRleDogMFxuICB9XG5cbiAgcHVibGljIGZvcmNlUnVuOiBib29sZWFuID0gZmFsc2VcblxuICBwdWJsaWMgbWF4QW1vdW50T2ZQb2x5Z29uczogbnVtYmVyID0gMV8wMDBfMDAwXzAwMFxuXG4gIHB1YmxpYyBiZ0NvbG9yOiBIRVhDb2xvciA9ICcjZmZmZmZmJ1xuXG4gIHB1YmxpYyBydWxlc0NvbG9yOiBIRVhDb2xvciA9ICcjYzBjMGMwJ1xuXG4gIHB1YmxpYyBjYW1lcmE6IFNQbG90Q2FtZXJhID0ge1xuICAgIHg6IHRoaXMuZ3JpZFNpemUud2lkdGggLyAyLFxuICAgIHk6IHRoaXMuZ3JpZFNpemUuaGVpZ2h0IC8gMixcbiAgICB6b29tOiAxXG4gIH1cblxuICBwdWJsaWMgd2ViR2xTZXR0aW5nczogV2ViR0xDb250ZXh0QXR0cmlidXRlcyA9IHtcbiAgICBhbHBoYTogZmFsc2UsXG4gICAgZGVwdGg6IGZhbHNlLFxuICAgIHN0ZW5jaWw6IGZhbHNlLFxuICAgIGFudGlhbGlhczogZmFsc2UsXG4gICAgcHJlbXVsdGlwbGllZEFscGhhOiBmYWxzZSxcbiAgICBwcmVzZXJ2ZURyYXdpbmdCdWZmZXI6IGZhbHNlLFxuICAgIHBvd2VyUHJlZmVyZW5jZTogJ2hpZ2gtcGVyZm9ybWFuY2UnLFxuICAgIGZhaWxJZk1ham9yUGVyZm9ybWFuY2VDYXZlYXQ6IGZhbHNlLFxuICAgIGRlc3luY2hyb25pemVkOiBmYWxzZVxuICB9XG5cbiAgcHJvdGVjdGVkIF9jYW52YXM6IEhUTUxDYW52YXNFbGVtZW50XG5cbiAgcHJvdGVjdGVkIF9nbCE6IFdlYkdMUmVuZGVyaW5nQ29udGV4dFxuXG4gIHByb3RlY3RlZCBfdmFyaWFibGVzOiB7IFtrZXk6IHN0cmluZ106IGFueSB9ID0gW11cblxuICBwcm90ZWN0ZWQgX3ZlcnRleFNoYWRlckNvZGVUZW1wbGF0ZTogc3RyaW5nID1cbiAgICAnYXR0cmlidXRlIHZlYzIgYV9wb3NpdGlvbjtcXG4nICtcbiAgICAnYXR0cmlidXRlIGZsb2F0IGFfY29sb3I7XFxuJyArXG4gICAgJ3VuaWZvcm0gbWF0MyB1X21hdHJpeDtcXG4nICtcbiAgICAndmFyeWluZyB2ZWMzIHZfY29sb3I7XFxuJyArXG4gICAgJ3ZvaWQgbWFpbigpIHtcXG4nICtcbiAgICAnICBnbF9Qb3NpdGlvbiA9IHZlYzQoKHVfbWF0cml4ICogdmVjMyhhX3Bvc2l0aW9uLCAxKSkueHksIDAuMCwgMS4wKTtcXG4nICtcbiAgICAnICBTRVQtVkVSVEVYLUNPTE9SLUNPREUnICtcbiAgICAnfVxcbidcblxuICBwcm90ZWN0ZWQgX2ZyYWdtZW50U2hhZGVyQ29kZVRlbXBsYXRlOiBzdHJpbmcgPVxuICAgICdwcmVjaXNpb24gbG93cCBmbG9hdDtcXG4nICtcbiAgICAndmFyeWluZyB2ZWMzIHZfY29sb3I7XFxuJyArXG4gICAgJ3ZvaWQgbWFpbigpIHtcXG4nICtcbiAgICAnICBnbF9GcmFnQ29sb3IgPSB2ZWM0KHZfY29sb3IucmdiLCAxLjApO1xcbicgK1xuICAgICd9XFxuJ1xuXG4gIHByb3RlY3RlZCBfYW1vdW50T2ZQb2x5Z29uczogbnVtYmVyID0gMFxuXG4gIHByb3RlY3RlZCBfZGVidWdTdHlsZTogc3RyaW5nID0gJ2ZvbnQtd2VpZ2h0OiBib2xkOyBjb2xvcjogI2ZmZmZmZjsnXG5cbiAgcHJvdGVjdGVkIF9VU0VGVUxfQ09OU1RTOiBhbnlbXSA9IFtdXG5cbiAgcHJvdGVjdGVkIF9pc1J1bm5pbmc6IGJvb2xlYW4gPSBmYWxzZVxuXG4gIHByb3RlY3RlZCBfdHJhbnNvcm1hdGlvbjogU1Bsb3RUcmFuc2Zvcm1hdGlvbiA9IHtcbiAgICBtYXRyaXg6IFtdLFxuICAgIHN0YXJ0SW52TWF0cml4OiBbXSxcbiAgICBzdGFydENhbWVyYVg6IDAsXG4gICAgc3RhcnRDYW1lcmFZOiAwLFxuICAgIHN0YXJ0UG9zWDogMCxcbiAgICBzdGFydFBvc1k6IDBcbiAgfVxuXG4gIHByb3RlY3RlZCBfbWF4QW1vdW50T2ZWZXJ0ZXhQZXJQb2x5Z29uR3JvdXA6IG51bWJlciA9IDMyNzY4IC0gKHRoaXMuY2lyY2xlQXBwcm94TGV2ZWwgKyAxKTtcblxuICBwcm90ZWN0ZWQgX2J1ZmZlcnM6IFNQbG90QnVmZmVycyA9IHtcbiAgICB2ZXJ0ZXhCdWZmZXJzOiBbXSxcbiAgICBjb2xvckJ1ZmZlcnM6IFtdLFxuICAgIGluZGV4QnVmZmVyczogW10sXG4gICAgYW1vdW50T2ZHTFZlcnRpY2VzOiBbXSxcbiAgICBhbW91bnRPZlNoYXBlczogW10sXG4gICAgYW1vdW50T2ZCdWZmZXJHcm91cHM6IDAsXG4gICAgYW1vdW50T2ZUb3RhbFZlcnRpY2VzOiAwLFxuICAgIGFtb3VudE9mVG90YWxHTFZlcnRpY2VzOiAwLFxuICAgIHNpemVJbkJ5dGVzOiBbMCwgMCwgMF1cbiAgfVxuXG4gIHByb3RlY3RlZCBfZ2V0VmVydGljZXM6IHtmdW5jOiBTUGxvdFNoYXBlRnVuY3Rpb24sIGNhcHRpb246IHN0cmluZ31bXSA9IFtdXG5cbiAgcHJvdGVjdGVkIF9ncHVQcm9ncmFtITogV2ViR0xQcm9ncmFtXG5cbiAgY29uc3RydWN0b3IoY2FudmFzSWQ6IHN0cmluZywgb3B0aW9ucz86IFNQbG90T3B0aW9ucykge1xuXG4gICAgU1Bsb3QuaW5zdGFuY2VzW2NhbnZhc0lkXSA9IHRoaXNcblxuICAgIHRoaXMuX2NhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNhbnZhc0lkKSBhcyBIVE1MQ2FudmFzRWxlbWVudFxuXG4gICAgaWYgKG9wdGlvbnMpIHtcblxuICAgICAgdGhpcy5fc2V0T3B0aW9ucyhvcHRpb25zKVxuXG4gICAgICBpZiAodGhpcy5mb3JjZVJ1bikge1xuICAgICAgICB0aGlzLnNldHVwKG9wdGlvbnMpXG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5yZWdpc3RlclBvbHlnb25TaGFwZSh0aGlzLl9nZXRWZXJ0aWNlc09mVHJpYW5nbGUsICfQotGA0LXRg9Cz0L7Qu9GM0L3QuNC6JylcbiAgICB0aGlzLnJlZ2lzdGVyUG9seWdvblNoYXBlKHRoaXMuX2dldFZlcnRpY2VzT2ZTcXVhcmUsICfQmtCy0LDQtNGA0LDRgicpXG4gICAgdGhpcy5yZWdpc3RlclBvbHlnb25TaGFwZSh0aGlzLl9nZXRWZXJ0aWNlc09mQ2lyY2xlLCAn0JrRgNGD0LMnKVxuICB9XG5cbiAgLyoqXG4gICAqINCh0L7Qt9C00LDQtdGCINC4INC40L3QuNGG0LjQsNC70LjQt9C40YDRg9C10YIg0L7QsdGK0LXQutGC0Ysg0YDQtdC90LTQtdGA0LjQvdCz0LAgV2ViR0wuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjYW52YXNJZCDQmNC00LXQvdGC0LjRhNC40LrQsNGC0L7RgCDRjdC70LXQvNC10L3RgtCwIDxjYW52YXM+LlxuICAgKi9cbiAgX2NyZWF0ZVdlYkdsKCkge1xuXG4gICAgdGhpcy5fZ2wgPSB0aGlzLl9jYW52YXMuZ2V0Q29udGV4dCgnd2ViZ2wnLCB0aGlzLndlYkdsU2V0dGluZ3MpIGFzIFdlYkdMUmVuZGVyaW5nQ29udGV4dFxuXG4gICAgLy8g0JLRi9GA0LDQstC90LjQstCw0L3QuNC1INC+0LHQu9Cw0YHRgtC4INGA0LXQvdC00LXRgNC40L3Qs9CwINCyINGB0L7QvtGC0LLQtdGC0YHRgtCy0LjQuCDRgSDRgNCw0LfQvNC10YDQvtC8INC60LDQvdCy0LDRgdCwLlxuICAgIHRoaXMuX2NhbnZhcy53aWR0aCA9IHRoaXMuX2NhbnZhcy5jbGllbnRXaWR0aDtcbiAgICB0aGlzLl9jYW52YXMuaGVpZ2h0ID0gdGhpcy5fY2FudmFzLmNsaWVudEhlaWdodDtcbiAgICB0aGlzLl9nbC52aWV3cG9ydCgwLCAwLCB0aGlzLl9jYW52YXMud2lkdGgsIHRoaXMuX2NhbnZhcy5oZWlnaHQpO1xuICB9XG5cbiAgcmVnaXN0ZXJQb2x5Z29uU2hhcGUocG9seWdvbkZ1bmM6IFNQbG90U2hhcGVGdW5jdGlvbiwgcG9seWdvbkNhcHRpb246IHN0cmluZykge1xuXG4gICAgLy8g0JfQsNC90LXRgdC10L3QuNC1INGE0YPQvdC60YbQuNC4INC4INC90LDQt9Cy0LDQvdC40Y8g0YTQvtGA0LzRiyDQsiDQvNCw0YHRgdC40LIuINCk0L7RgNC80LAg0LHRg9C00LXRgiDQutC+0LTQuNGA0L7QstCw0YLRjNGB0Y8g0LjQvdC00LXQutGB0L7QvCDQsiDRjdGC0L7QvCDQvNCw0YHRgdC40LLQtS5cbiAgICB0aGlzLl9nZXRWZXJ0aWNlcy5wdXNoKHtcbiAgICAgIGZ1bmM6IHBvbHlnb25GdW5jLFxuICAgICAgY2FwdGlvbjogcG9seWdvbkNhcHRpb25cbiAgICB9KTtcblxuICAgIC8vINCU0L7QsdCw0LLQu9C10L3QuNC1INC90L7QstC+0Lkg0YTQvtGA0LzRiyDQsiDQvNCw0YHRgdC40LIg0YfQsNGB0YLQvtGCINC/0L7Rj9Cy0LvQtdC90LjRjyDRhNC+0YDQvCDQsiDRgNC10LbQuNC80LUg0LTQtdC80L7QvdGB0YLRgNCw0YbQuNC+0L3QvdGL0YUg0LTQsNC90L3Ri9GFLlxuICAgIHRoaXMuZGVtb01vZGUuc2hhcGVRdW90YSEucHVzaCgxKTtcblxuICAgIHJldHVybiB0aGlzLl9nZXRWZXJ0aWNlcy5sZW5ndGggLSAxO1xuICB9XG5cbiAgLyoqXG4gICAqINCj0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdGCINC90LXQvtCx0YXQvtC00LjQvNGL0LUg0L/QtdGA0LXQtCDQt9Cw0L/Rg9GB0LrQvtC8INGA0LXQvdC00LXRgNCwINC/0LDRgNCw0LzQtdGC0YDRiyDRjdC60LfQtdC80L/Qu9GP0YDQsCDQuCBXZWJHTC5cbiAgICpcbiAgICogQHB1YmxpY1xuICAgKiBAcGFyYW0ge1NQbG90T3B0aW9uc30gb3B0aW9ucyDQn9C+0LvRjNC30L7QstCw0YLQtdC70YzRgdC60LjQtSDQvdCw0YHRgtGA0L7QudC60Lgg0Y3QutC30LXQvNC/0LvRj9GA0LAuXG4gICAqL1xuICBzZXR1cChvcHRpb25zOiBTUGxvdE9wdGlvbnMpIHtcblxuICAgIC8vINCf0YDQuNC80LXQvdC10L3QuNC1INC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjNGB0LrQuNGFINC90LDRgdGC0YDQvtC10LouXG4gICAgdGhpcy5fc2V0T3B0aW9ucyhvcHRpb25zKTtcblxuICAgIHRoaXMuX2NyZWF0ZVdlYkdsKClcblxuICAgIC8vINCe0LHQvdGD0LvQtdC90LjQtSDRgdGH0LXRgtGH0LjQutCwINC/0L7Qu9C40LPQvtC90L7Qsi5cbiAgICB0aGlzLl9hbW91bnRPZlBvbHlnb25zID0gMDtcblxuICAgIC8vINCe0LHQvdGD0LvQtdC90LjQtSDRgdGH0LXRgtGH0LjQutC+0LIg0YTQvtGA0Lwg0L/QvtC70LjQs9C+0L3QvtCyLlxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fZ2V0VmVydGljZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRoaXMuX2J1ZmZlcnMuYW1vdW50T2ZTaGFwZXNbaV0gPSAwO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqINCf0YDQtdC00LXQu9GM0L3QvtC1INC60L7Qu9C40YfQtdGB0YLQstC+INCy0LXRgNGI0LjQvSDQsiDQs9GA0YPQv9C/0LUg0L/QvtC70LjQs9C+0L3QvtCyINC30LDQstC40YHQuNGCINC+0YIg0L/QsNGA0LDQvNC10YLRgNCwXG4gICAgICogY2lyY2xlQXBwcm94TGV2ZWwsINC60L7RgtC+0YDRi9C5INC80L7QsyDQsdGL0YLRjCDQuNC30LzQtdC90LXQvSDQv9C+0LvRjNC30L7QstCw0YLQtdC70YzRgdC60LjQvNC4INC90LDRgdGC0YDQvtC50LrQsNC80LguXG4gICAgICovXG4gICAgdGhpcy5fbWF4QW1vdW50T2ZWZXJ0ZXhQZXJQb2x5Z29uR3JvdXAgPSAzMjc2OCAtICh0aGlzLmNpcmNsZUFwcHJveExldmVsICsgMSk7XG5cbiAgICAvLyDQmNC90LjRhtC40LDQu9C40LfQsNGG0LjRjyDQstGB0L/QvtC80L7Qs9Cw0YLQtdC70YzQvdGL0YUg0LrQvtC90YHRgtCw0L3Rgi5cbiAgICB0aGlzLl9zZXRVc2VmdWxDb25zdGFudHMoKTtcblxuICAgIC8qKlxuICAgICAqINCf0L7QtNCz0L7RgtC+0LLQutCwINC60L7QtNC+0LIg0YjQtdC50LTQtdGA0L7Qsi4g0JrQvtC0INGE0YDQsNCz0LzQtdC90YLQvdC+0LPQviDRiNC10LnQtNC10YDQsCDQuNGB0L/QvtC70YzQt9GD0LXRgtGB0Y8g0LrQsNC6INC10YHRgtGMLlxuICAgICAqINCSINC60L7QtCDQstC10YDRiNC40L3QvdC+0LPQviDRiNC10LnQtNC10YDQsCDQstGB0YLQsNCy0LvRj9C10YLRgdGPINC60L7QtCDQstGL0LHQvtGA0LAg0YbQstC10YLQsCDQstC10YDRiNC40L0uXG4gICAgICovXG4gICAgbGV0IHZlcnRleFNoYWRlckNvZGUgPSB0aGlzLl92ZXJ0ZXhTaGFkZXJDb2RlVGVtcGxhdGUucmVwbGFjZShcbiAgICAgICdTRVQtVkVSVEVYLUNPTE9SLUNPREUnLFxuICAgICAgdGhpcy5fZ2VuU2hhZGVyQ29sb3JDb2RlKClcbiAgICApO1xuICAgIGxldCBmcmFnbWVudFNoYWRlckNvZGUgPSB0aGlzLl9mcmFnbWVudFNoYWRlckNvZGVUZW1wbGF0ZTtcblxuICAgIC8vINCh0L7Qt9C00LDQvdC40LUg0YjQtdC50LTQtdGA0L7QsiBXZWJHTC5cbiAgICBsZXQgdmVydGV4U2hhZGVyID0gdGhpcy5fY3JlYXRlV2ViR2xTaGFkZXIoJ1ZFUlRFWF9TSEFERVInLCB2ZXJ0ZXhTaGFkZXJDb2RlKTtcbiAgICBsZXQgZnJhZ21lbnRTaGFkZXIgPSB0aGlzLl9jcmVhdGVXZWJHbFNoYWRlcignRlJBR01FTlRfU0hBREVSJywgZnJhZ21lbnRTaGFkZXJDb2RlKTtcblxuICAgIC8vINCh0L7Qt9C00LDQvdC40LUg0L/RgNC+0LPRgNCw0LzQvNGLIFdlYkdMLlxuICAgIGxldCBncHVQcm9ncmFtID0gdGhpcy5fY3JlYXRlV2ViR2xQcm9ncmFtKHZlcnRleFNoYWRlciwgZnJhZ21lbnRTaGFkZXIpO1xuICAgIHRoaXMuX3NldFdlYkdsUHJvZ3JhbShncHVQcm9ncmFtKTtcblxuICAgIC8vINCj0YHRgtCw0L3QvtCy0LrQsCDRgdCy0Y/Qt9C10Lkg0L/QtdGA0LXQvNC10L3QvdGL0YUg0L/RgNC40LvQvtC20LXQvdC40Y8g0YEg0L/RgNC+0LPRgNCw0LzQvNC+0LkgV2ViR2wuXG4gICAgdGhpcy5fc2V0V2ViR2xWYXJpYWJsZSgnYXR0cmlidXRlJywgJ2FfcG9zaXRpb24nKTtcbiAgICB0aGlzLl9zZXRXZWJHbFZhcmlhYmxlKCdhdHRyaWJ1dGUnLCAnYV9jb2xvcicpO1xuICAgIHRoaXMuX3NldFdlYkdsVmFyaWFibGUoJ3VuaWZvcm0nLCAndV9tYXRyaXgnKTtcblxuICAgIC8vINCh0L7Qt9C00LDQvdC40LUg0Lgg0LfQsNC/0L7Qu9C90LXQvdC40LUg0LTQsNC90L3Ri9C80Lgg0LHRg9GE0LXRgNC+0LIgV2ViR0wuXG4gICAgdGhpcy5fY3JlYXRlV2JHbEJ1ZmZlcnMoKTtcblxuICAgIC8vINCj0YHRgtCw0L3QvtCy0LrQsCDRhtCy0LXRgtCwINC+0YfQuNGB0YLQutC4INGA0LXQvdC00LXRgNC40L3Qs9CwXG4gICAgbGV0IFtyLCBnLCBiXSA9IHRoaXMuX2NvbnZlcnRDb2xvcih0aGlzLmJnQ29sb3IpO1xuICAgIHRoaXMuX2dsLmNsZWFyQ29sb3IociwgZywgYiwgMC4wKTtcbiAgICB0aGlzLl9nbC5jbGVhcih0aGlzLl9nbC5DT0xPUl9CVUZGRVJfQklUKTtcblxuICAgIC8vINCV0YHQu9C4INGC0YDQtdCx0YPQtdGC0YHRjyAtINGA0LXQvdC00LXRgNC40L3QsyDQt9Cw0L/Rg9GB0LrQsNC10YLRgdGPINGB0YDQsNC30YMg0L/QvtGB0LvQtSDRg9GB0YLQsNC90L7QstC60Lgg0L/QsNGA0LDQvNC10YLRgNC+0LIg0Y3QutC30LXQvNC/0LvRj9GA0LAuXG4gICAgaWYgKHRoaXMuZm9yY2VSdW4pIHtcbiAgICAgIHRoaXMucnVuKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqINCf0YDQuNC80LXQvdGP0LXRgiDQv9C+0LvRjNC30L7QstCw0YLQtdC70YzRgdC60LjQtSDQvdCw0YHRgtGA0L7QudC60Lgg0Y3QutC30LXQvNC/0LvRj9GA0LAuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7U1Bsb3RPdGlvbnN9IG9wdGlvbnMg0J/QvtC70YzQt9C+0LLQsNGC0LXQu9GM0YHQutC40LUg0L3QsNGB0YLRgNC+0LnQutC4INGN0LrQt9C10LzQv9C70Y/RgNCwLlxuICAgKi9cbiAgX3NldE9wdGlvbnMob3B0aW9uczogU1Bsb3RPcHRpb25zKSB7XG5cbiAgICAvKipcbiAgICAgKiDQmtC+0L/QuNGA0L7QstCw0L3QuNC1INC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjNGB0LrQuNGFINC90LDRgdGC0YDQvtC10Log0LIg0YHQvtC+0YLQstC10YLRgdCy0YPRjtGJ0LjQtSDQv9C+0LvRjyDRjdC60LfQtdC80L/Qu9GP0YDQsC5cbiAgICAgKiDQmtC+0L/QuNGA0YPRjtGC0YHRjyDRgtC+0LvRjNC60L4g0YLQtSDQv9C+0LvRjNC30L7QstCw0YLQtdC70YzRgdC60LjQtSDQvdCw0YHRgtGA0L7QudC60LgsINC60L7RgtC+0YDRi9C8INC40LzQtdGO0YLRgdGPINGB0L7QvtGC0LLQtdGC0YHRgtCy0YPRjtGJ0LjQtVxuICAgICAqINGN0LrQstC40LLQsNC70LXQvdGC0Ysg0LIg0L/QvtC70Y/RhSDRjdC60LfQtdC80L/Qu9GP0YDQsC4g0JrQvtC/0LjRgNGD0LXRgtGB0Y8g0YLQsNC60LbQtSDQv9C10YDQstGL0Lkg0YPRgNC+0LLQtdC90Ywg0LLQu9C+0LbQtdC90L3Ri9GFXG4gICAgICog0L3QsNGB0YLRgNC+0LXQui5cbiAgICAgKi9cbiAgICBmb3IgKGxldCBvcHRpb24gaW4gb3B0aW9ucykge1xuXG4gICAgICBpZiAoIXRoaXMuaGFzT3duUHJvcGVydHkob3B0aW9uKSkgY29udGludWVcblxuICAgICAgaWYgKGlzT2JqZWN0KChvcHRpb25zIGFzIGFueSlbb3B0aW9uXSkgJiYgaXNPYmplY3QoKHRoaXMgYXMgYW55KVtvcHRpb25dKSApIHtcbiAgICAgICAgZm9yIChsZXQgbmVzdGVkT3B0aW9uIGluIChvcHRpb25zIGFzIGFueSlbb3B0aW9uXSkge1xuICAgICAgICAgIGlmICgodGhpcyBhcyBhbnkpW29wdGlvbl0uaGFzT3duUHJvcGVydHkobmVzdGVkT3B0aW9uKSkge1xuICAgICAgICAgICAgKHRoaXMgYXMgYW55KVtvcHRpb25dW25lc3RlZE9wdGlvbl0gPSAob3B0aW9ucyBhcyBhbnkpW29wdGlvbl1bbmVzdGVkT3B0aW9uXTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICh0aGlzIGFzIGFueSlbb3B0aW9uXSA9IChvcHRpb25zIGFzIGFueSlbb3B0aW9uXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDQldGB0LvQuCDQv9C+0LvRjNC30L7QstCw0YLQtdC70Ywg0LfQsNC00LDQtdGCINGA0LDQt9C80LXRgCDQv9C70L7RgdC60L7RgdGC0LgsINC90L4g0L/RgNC4INGN0YLQvtC8INC90LAg0LfQsNC00LDQtdGCINC90LDRh9Cw0LvRjNC90L7QtVxuICAgICAqINC/0L7Qu9C+0LbQtdC90LjQtSDQvtCx0LvQsNGB0YLQuCDQv9GA0L7RgdC80L7RgtGA0LAsINGC0L4g0L7QsdC70LDRgdGC0Ywg0L/RgNC+0YHQvNC+0YLRgNCwINC/0L7QvNC10YnQsNC10YLRgdGPINCyINGG0LXQvdGC0YAg0LfQsNC00LDQvdC90L7QuVxuICAgICAqINC/0LvQvtGB0LrQvtGB0YLQuC5cbiAgICAgKi9cbiAgICBpZiAob3B0aW9ucy5oYXNPd25Qcm9wZXJ0eSgnZ3JpZFNpemUnKSAmJiAhb3B0aW9ucy5oYXNPd25Qcm9wZXJ0eSgnY2FtZXJhJykpIHtcbiAgICAgIHRoaXMuY2FtZXJhID0ge1xuICAgICAgICB4OiB0aGlzLmdyaWRTaXplLndpZHRoIC8gMixcbiAgICAgICAgeTogdGhpcy5ncmlkU2l6ZS5oZWlnaHQgLyAyLFxuICAgICAgICB6b29tOiAxXG4gICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqINCV0YHQu9C4INC30LDQv9GA0L7RiNC10L0g0YDQtdC20LjQvCDQtNC10LzQvtC90YHRgtGA0LDRhtC40L7QvdC90YvRhSDQtNCw0L3QvdGL0YUsINGC0L4g0LTQu9GPINC40YLQtdGA0LjRgNC+0LLQsNC90LjRjyDQvtCx0YrQtdC60YLQvtCyXG4gICAgICog0LHRg9C00LXRgiDQuNGB0L/QvtC70YzQt9C+0LLQsNGC0YzRgdGPINCy0L3Rg9GC0YDQtdC90L3QuNC5INC80LXRgtC+0LQsINC40LzQuNGC0LjRgNGD0Y7RidC40Lkg0LjRgtC10YDQuNGA0L7QstCw0L3QuNC1LiDQn9GA0Lgg0Y3RgtC+0LwsXG4gICAgICog0LXRgdC70Lgg0LHRi9C70LAg0LfQsNC00LDQvdCwINCy0L3QtdGI0L3Rj9GPINGE0YPQvdC60YbQuNGPINC40YLQtdGA0LjRgNC+0LLQsNC90LjRjyAtINC+0L3QsCDQsdGD0LTQtdGCINC/0YDQvtC40LPQvdC+0YDQuNGA0L7QstCw0L3QsC5cbiAgICAgKi9cbiAgICBpZiAodGhpcy5kZW1vTW9kZS5pc0VuYWJsZSkge1xuICAgICAgdGhpcy5pdGVyYXRpb25DYWxsYmFjayA9IHRoaXMuX2RlbW9JdGVyYXRpb25DYWxsYmFjaztcbiAgICB9XG5cbiAgICAvLyDQktGL0LLQvtC0INC+0YLQu9Cw0LTQvtGH0L3QvtC5INC40L3RhNC+0YDQvNCw0YbQuNC4LlxuICAgIGlmICh0aGlzLmRlYnVnTW9kZS5pc0VuYWJsZSkge1xuICAgICAgdGhpcy5fcmVwb3J0TWFpbkluZm8ob3B0aW9ucyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqINCS0YvRh9C40YHQu9GP0LXRgiDQvdCw0LHQvtGAINCy0YHQv9C+0LzQvtCz0LDRgtC10LvRjNC90YvRhSDQutC+0L3RgdGC0LDQvdGCIF9VU0VGVUxfQ09OU1RTW10uXG4gICAqINCe0L3QuCDRhdGA0LDQvdGP0YIg0YDQtdC30YPQu9GM0YLQsNGC0Ysg0LDQu9Cz0LXQsdGA0LDQuNGH0LXRgdC60LjRhSDQuCDRgtGA0LjQs9C+0L3QvtC80LXRgtGA0LjRh9C10YHQutC40YUg0LLRi9GH0LjRgdC70LXQvdC40LksXG4gICAqINC40YHQv9C+0LvRjNC30YPQtdC80YvRhSDQsiDRgNCw0YHRh9C10YLQsNGFINCy0LXRgNGI0LjQvSDQv9C+0LvQuNCz0L7QvdC+0LIg0Lgg0LzQsNGC0YDQuNGGINGC0YDQsNC90YHRhNC+0YDQvNCw0YbQuNC4LiDQotCw0LrQuNC1INC60L7QvdGB0YLQsNC90YLRi1xuICAgKiDQv9C+0LfQstC+0LvRj9GO0YIg0LLRi9C90LXRgdGC0Lgg0LfQsNGC0YDQsNGC0L3Ri9C1INC00LvRjyDQv9GA0L7RhtC10YHRgdC+0YDQsCDQvtC/0LXRgNCw0YbQuNC4INC30LAg0L/RgNC10LTQtdC70Ysg0LzQvdC+0LPQvtC60YDQsNGC0L3QvlxuICAgKiDQuNGB0L/QvtC70YzQt9GD0LXQvNGL0YUg0YTRg9C90LrRhtC40Lkg0YPQstC10LvQuNGH0LjQstCw0Y8g0L/RgNC+0LjQt9Cy0L7QtNC40YLQtdC70YzQvdC+0YHRgtGMINC/0YDQuNC70L7QttC10L3QuNGPINC90LAg0Y3RgtCw0L/QsNGFXG4gICAqINC/0L7QtNCz0L7RgtC+0LLQutC4INC00LDQvdC90YvRhSDQuCDRgNC10L3QtNC10YDQuNC90LPQsC5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9zZXRVc2VmdWxDb25zdGFudHMoKSB7XG5cbiAgICAvLyDQmtC+0L3RgdGC0LDQvdGC0YssINC30LDQstC40YHRj9GJ0LjQtSDQvtGCINGA0LDQt9C80LXRgNCwINC/0L7Qu9C40LPQvtC90LAuXG4gICAgdGhpcy5fVVNFRlVMX0NPTlNUU1swXSA9IHRoaXMucG9seWdvblNpemUgLyAyO1xuICAgIHRoaXMuX1VTRUZVTF9DT05TVFNbMV0gPSB0aGlzLl9VU0VGVUxfQ09OU1RTWzBdIC8gTWF0aC5jb3MoTWF0aC5QSSAvIDYpO1xuICAgIHRoaXMuX1VTRUZVTF9DT05TVFNbMl0gPSB0aGlzLl9VU0VGVUxfQ09OU1RTWzBdICogTWF0aC50YW4oTWF0aC5QSSAvIDYpO1xuXG4gICAgLy8g0JrQvtC90YHRgtCw0L3RgtGLLCDQt9Cw0LLQuNGB0Y/RidC40LUg0L7RgiDRgdGC0LXQv9C10L3QuCDQtNC10YLQsNC70LjQt9Cw0YbQuNC4INC60YDRg9Cz0LAg0Lgg0YDQsNC30LzQtdGA0LAg0L/QvtC70LjQs9C+0L3QsC5cbiAgICB0aGlzLl9VU0VGVUxfQ09OU1RTWzNdID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLmNpcmNsZUFwcHJveExldmVsKTtcbiAgICB0aGlzLl9VU0VGVUxfQ09OU1RTWzRdID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLmNpcmNsZUFwcHJveExldmVsKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jaXJjbGVBcHByb3hMZXZlbDsgaSsrKSB7XG4gICAgICBjb25zdCBhbmdsZSA9IDIgKiBNYXRoLlBJICogaSAvIHRoaXMuY2lyY2xlQXBwcm94TGV2ZWw7XG4gICAgICB0aGlzLl9VU0VGVUxfQ09OU1RTWzNdW2ldID0gdGhpcy5fVVNFRlVMX0NPTlNUU1swXSAqIE1hdGguY29zKGFuZ2xlKTtcbiAgICAgIHRoaXMuX1VTRUZVTF9DT05TVFNbNF1baV0gPSB0aGlzLl9VU0VGVUxfQ09OU1RTWzBdICogTWF0aC5zaW4oYW5nbGUpO1xuICAgIH1cblxuICAgIC8vINCa0L7QvdGB0YLQsNC90YLRiywg0LfQsNCy0LjRgdGP0YnQuNC1INC+0YIg0YDQsNC30LzQtdGA0LAg0LrQsNC90LLQsNGB0LAuXG4gICAgdGhpcy5fVVNFRlVMX0NPTlNUU1s1XSA9IDIgLyB0aGlzLl9jYW52YXMud2lkdGg7XG4gICAgdGhpcy5fVVNFRlVMX0NPTlNUU1s2XSA9IDIgLyB0aGlzLl9jYW52YXMuaGVpZ2h0O1xuICAgIHRoaXMuX1VTRUZVTF9DT05TVFNbN10gPSAyIC8gdGhpcy5fY2FudmFzLmNsaWVudFdpZHRoO1xuICAgIHRoaXMuX1VTRUZVTF9DT05TVFNbOF0gPSAtMiAvIHRoaXMuX2NhbnZhcy5jbGllbnRIZWlnaHQ7XG4gICAgdGhpcy5fVVNFRlVMX0NPTlNUU1s5XSA9IHRoaXMuX2NhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0O1xuICAgIHRoaXMuX1VTRUZVTF9DT05TVFNbMTBdID0gdGhpcy5fY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcDtcbiAgfVxuXG4gIF9jcmVhdGVXZWJHbFNoYWRlcihzaGFkZXJUeXBlOiBXZWJHbFNoYWRlclR5cGUsIHNoYWRlckNvZGU6IHN0cmluZykge1xuXG4gICAgLy8g0KHQvtC30LTQsNC90LjQtSwg0L/RgNC40LLRj9C30LrQsCDQutC+0LTQsCDQuCDQutC+0LzQv9C40LvRj9GG0LjRjyDRiNC10LnQtNC10YDQsC5cbiAgICBjb25zdCBzaGFkZXIgPSB0aGlzLl9nbC5jcmVhdGVTaGFkZXIodGhpcy5fZ2xbc2hhZGVyVHlwZV0pIGFzIFdlYkdMU2hhZGVyO1xuICAgIHRoaXMuX2dsLnNoYWRlclNvdXJjZShzaGFkZXIsIHNoYWRlckNvZGUpO1xuICAgIHRoaXMuX2dsLmNvbXBpbGVTaGFkZXIoc2hhZGVyKTtcblxuICAgIGlmICghdGhpcy5fZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKHNoYWRlciwgdGhpcy5fZ2wuQ09NUElMRV9TVEFUVVMpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ9Ce0YjQuNCx0LrQsCDQutC+0LzQv9C40LvRj9GG0LjQuCDRiNC10LnQtNC10YDQsCBbJyArIHNoYWRlclR5cGUgKyAnXS4gJyArIHRoaXMuX2dsLmdldFNoYWRlckluZm9Mb2coc2hhZGVyKSk7XG4gICAgfVxuXG4gICAgLy8g0JLRi9Cy0L7QtCDQvtGC0LvQsNC00L7Rh9C90L7QuSDQuNC90YTQvtGA0LzQsNGG0LjQuC5cbiAgICBpZiAodGhpcy5kZWJ1Z01vZGUuaXNFbmFibGUpIHtcbiAgICAgIGNvbnNvbGUuZ3JvdXAoJyVj0KHQvtC30LTQsNC9INGI0LXQudC00LXRgCBbJyArIHNoYWRlclR5cGUgKyAnXScsIHRoaXMuX2RlYnVnU3R5bGUpO1xuICAgICAgY29uc29sZS5sb2coc2hhZGVyQ29kZSk7XG4gICAgICBjb25zb2xlLmdyb3VwRW5kKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNoYWRlcjtcbiAgfVxuXG4gIC8qKlxuICAgKiDQodC+0LfQtNCw0LXRgiDQv9GA0L7Qs9GA0LDQvNC80YMgV2ViR0wuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7V2ViR0xTaGFkZXJ9IHZlcnRleFNoYWRlciDQktC10YDRiNC40L3QvdGL0Lkg0YjQtdC50LTQtdGALlxuICAgKiBAcGFyYW0ge1dlYkdMU2hhZGVyfSBmcmFnbWVudFNoYWRlciDQpNGA0LDQs9C80LXQvdGC0L3Ri9C5INGI0LXQudC00LXRgC5cbiAgICogQHJldHVybiB7V2ViR0xQcm9ncmFtfSDQodC+0LfQtNCw0L3QvdGL0Lkg0L7QsdGK0LXQutGCINC/0YDQvtCz0YDQsNC80LzRiyBXZWJHTC5cbiAgICovXG4gIF9jcmVhdGVXZWJHbFByb2dyYW0odmVydGV4U2hhZGVyOiBXZWJHTFNoYWRlciwgZnJhZ21lbnRTaGFkZXI6IFdlYkdMU2hhZGVyKSB7XG5cbiAgICAvLyDQodC+0LfQtNCw0L3QuNC1INGPINC/0YDQuNCy0Y/Qt9C60LAg0L/RgNC+0LPRgNCw0LzQvNGLIFdlYkdMLlxuICAgIGxldCBncHVQcm9ncmFtID0gdGhpcy5fZ2wuY3JlYXRlUHJvZ3JhbSgpIGFzIFdlYkdMUHJvZ3JhbTtcbiAgICB0aGlzLl9nbC5hdHRhY2hTaGFkZXIoZ3B1UHJvZ3JhbSwgdmVydGV4U2hhZGVyKTtcbiAgICB0aGlzLl9nbC5hdHRhY2hTaGFkZXIoZ3B1UHJvZ3JhbSwgZnJhZ21lbnRTaGFkZXIpO1xuICAgIHRoaXMuX2dsLmxpbmtQcm9ncmFtKGdwdVByb2dyYW0pO1xuXG4gICAgaWYgKCF0aGlzLl9nbC5nZXRQcm9ncmFtUGFyYW1ldGVyKGdwdVByb2dyYW0sIHRoaXMuX2dsLkxJTktfU1RBVFVTKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCfQntGI0LjQsdC60LAg0YHQvtC30LTQsNC90LjRjyDQv9GA0L7Qs9GA0LDQvNC80YsgV2ViR0wuICcgKyB0aGlzLl9nbC5nZXRQcm9ncmFtSW5mb0xvZyhncHVQcm9ncmFtKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGdwdVByb2dyYW07XG4gIH1cblxuICBfc2V0V2ViR2xQcm9ncmFtKGdwdVByb2dyYW06IFdlYkdMUHJvZ3JhbSkge1xuICAgIHRoaXMuX2dsLnVzZVByb2dyYW0oZ3B1UHJvZ3JhbSk7XG4gICAgdGhpcy5fZ3B1UHJvZ3JhbSA9IGdwdVByb2dyYW07XG4gIH1cblxuICBfc2V0V2ViR2xWYXJpYWJsZSh2YXJUeXBlOiBXZWJHbFZhcmlhYmxlVHlwZSwgdmFyTmFtZTogc3RyaW5nKSB7XG4gICAgaWYgKHZhclR5cGUgPT09ICd1bmlmb3JtJykge1xuICAgICAgdGhpcy5fdmFyaWFibGVzW3Zhck5hbWVdID0gdGhpcy5fZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHRoaXMuX2dwdVByb2dyYW0sIHZhck5hbWUpO1xuICAgIH0gZWxzZSBpZiAodmFyVHlwZSA9PT0gJ2F0dHJpYnV0ZScpIHtcbiAgICAgIHRoaXMuX3ZhcmlhYmxlc1t2YXJOYW1lXSA9IHRoaXMuX2dsLmdldEF0dHJpYkxvY2F0aW9uKHRoaXMuX2dwdVByb2dyYW0sIHZhck5hbWUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDQodC+0LfQtNCw0LXRgiDQuCDQt9Cw0L/QvtC70L3Rj9C10YIg0LTQsNC90L3Ri9C80Lgg0L7QsdC+INCy0YHQtdGFINC/0L7Qu9C40LPQvtC90LDRhSDQsdGD0YTQtdGA0YsgV2ViR0wuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfY3JlYXRlV2JHbEJ1ZmZlcnMoKSB7XG5cbiAgICAvLyDQktGL0LLQvtC0INC+0YLQu9Cw0LTQvtGH0L3QvtC5INC40L3RhNC+0YDQvNCw0YbQuNC4LlxuICAgIGlmICh0aGlzLmRlYnVnTW9kZS5pc0VuYWJsZSkge1xuXG4gICAgICBjb25zb2xlLmxvZygnJWPQl9Cw0L/Rg9GJ0LXQvSDQv9GA0L7RhtC10YHRgSDQt9Cw0LPRgNGD0LfQutC4INC00LDQvdC90YvRhSBbJyArXG4gICAgICAgIHRoaXMuX2dldEN1cnJlbnRUaW1lKCkgKyAnXS4uLicsIHRoaXMuX2RlYnVnU3R5bGUpO1xuXG4gICAgICAvKipcbiAgICAgICAqINCX0LDQv9GD0YHQuiDQutC+0L3RgdC+0LvRjNC90L7Qs9C+INGC0LDQudC80LXRgNCwLCDQv9C+0LTRgdGH0LjRgtGL0LLQsNGO0YnQtdCz0L4g0LTQu9C40YLQtdC70YzQvdC+0YHRgtGMINC/0YDQvtGG0LXRgdGB0LAg0LjRgtC10YDQuNGA0L7QstCw0L3QuNGPXG4gICAgICAgKiDQuNGB0YXQvtC00L3Ri9GFINC+0LHRitC10LrRgtC+0LIg0Lgg0LfQsNCz0YDRg9C30LrQuCDRgdC+0L7RgtCy0LXRgtGB0YLQstGD0Y7RidC40YUg0LTQsNC90L3Ri9GFINCyINCy0LjQtNC10L7Qv9Cw0LzRj9GC0YwuXG4gICAgICAgKi9cbiAgICAgIGNvbnNvbGUudGltZSgn0JTQu9C40YLQtdC70YzQvdC+0YHRgtGMJyk7XG4gICAgfVxuXG4gICAgLyoqIEB0eXBlIHtTUGxvdFBvbHlnb25Hcm91cH0gKi9cbiAgICBsZXQgcG9seWdvbkdyb3VwO1xuXG4gICAgLy8g0JjRgtC10YDQuNGA0L7QstCw0L3QuNC1INCz0YDRg9C/0L8g0L/QvtC70LjQs9C+0L3QvtCyLlxuICAgIHdoaWxlIChwb2x5Z29uR3JvdXAgPSB0aGlzLl9jcmVhdGVQb2x5Z29uR3JvdXAoKSkge1xuXG4gICAgICAvLyDQodC+0LfQtNCw0L3QuNC1INC4INC30LDQv9C+0LvQvdC10L3QuNC1INCx0YPRhNC10YDQvtCyINC00LDQvdC90YvQvNC4INC+INCz0YDRg9C/0L/QtSDQv9C+0LvQuNCz0L7QvdC+0LIuXG5cbiAgICAgIHRoaXMuX2FkZFdiR2xCdWZmZXIodGhpcy5fYnVmZmVycy52ZXJ0ZXhCdWZmZXJzLCAnQVJSQVlfQlVGRkVSJyxcbiAgICAgICAgbmV3IEZsb2F0MzJBcnJheShwb2x5Z29uR3JvdXAudmVydGljZXMpLCAwKTtcblxuICAgICAgdGhpcy5fYWRkV2JHbEJ1ZmZlcih0aGlzLl9idWZmZXJzLmNvbG9yQnVmZmVycywgJ0FSUkFZX0JVRkZFUicsXG4gICAgICAgIG5ldyBVaW50OEFycmF5KHBvbHlnb25Hcm91cC5jb2xvcnMpLCAxKTtcblxuICAgICAgdGhpcy5fYWRkV2JHbEJ1ZmZlcih0aGlzLl9idWZmZXJzLmluZGV4QnVmZmVycywgJ0VMRU1FTlRfQVJSQVlfQlVGRkVSJyxcbiAgICAgICAgbmV3IFVpbnQxNkFycmF5KHBvbHlnb25Hcm91cC5pbmRpY2VzKSwgMik7XG5cbiAgICAgIC8vINCh0YfQtdGC0YfQuNC6INC60L7Qu9C40YfQtdGB0YLQstCwINCx0YPRhNC10YDQvtCyLlxuICAgICAgdGhpcy5fYnVmZmVycy5hbW91bnRPZkJ1ZmZlckdyb3VwcysrO1xuXG4gICAgICAvLyDQntC/0YDQtdC00LXQu9C10L3QuNC1INC60L7Qu9C40YfQtdGB0YLQstCwINCy0LXRgNGI0LjQvSBHTC3RgtGA0LXRg9Cz0L7Qu9GM0L3QuNC60L7QsiDRgtC10LrRg9GJ0LXQuSDQs9GA0YPQv9C/0Ysg0LHRg9GE0LXRgNC+0LIuXG4gICAgICB0aGlzLl9idWZmZXJzLmFtb3VudE9mR0xWZXJ0aWNlcy5wdXNoKHBvbHlnb25Hcm91cC5hbW91bnRPZkdMVmVydGljZXMpO1xuXG4gICAgICAvLyDQntC/0YDQtdC00LXQu9C10L3QuNC1INC+0LHRidC10LPQviDQutC+0LvQuNGH0LXRgdGC0LLQsCDQstC10YDRiNC40L0gR0wt0YLRgNC10YPQs9C+0LvRjNC90LjQutC+0LIuXG4gICAgICB0aGlzLl9idWZmZXJzLmFtb3VudE9mVG90YWxHTFZlcnRpY2VzICs9IHBvbHlnb25Hcm91cC5hbW91bnRPZkdMVmVydGljZXM7XG4gICAgfVxuXG4gICAgLy8g0JLRi9Cy0L7QtCDQvtGC0LvQsNC00L7Rh9C90L7QuSDQuNC90YTQvtGA0LzQsNGG0LjQuC5cbiAgICBpZiAodGhpcy5kZWJ1Z01vZGUuaXNFbmFibGUpIHtcbiAgICAgIHRoaXMuX3JlcG9ydEFib3V0T2JqZWN0UmVhZGluZygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDQodGH0LjRgtGL0LLQsNC10YIg0LTQsNC90L3Ri9C1INC+0LEg0LjRgdGF0L7QtNC90YvRhSDQvtCx0YrQtdC60YLQsNGFINC4INGE0L7RgNC80LjRgNGD0LXRgiDRgdC+0L7RgtCy0LXRgtGB0LLRg9GO0YnRg9GOINGN0YLQuNC8INC+0LHRitC10LrRgtCw0LxcbiAgICog0LPRgNGD0L/Qv9GDINC/0L7Qu9C40LPQvtC90L7Qsi4g0JPRgNGD0L/Qv9CwINGE0L7RgNC80LjRgNGD0LXRgtGB0Y8g0YEg0YPRh9C10YLQvtC8INC70LjQvNC40YLQsCDQvdCwINC60L7Qu9C40YfQtdGB0YLQstC+INCy0LXRgNGI0LjQvVxuICAgKiDQsiDQs9GA0YPQv9C/0LUg0Lgg0LvQuNC80LjRgtCwINC90LAg0L7QsdGJ0LXQtSDQutC+0LvQuNGH0LXRgdGC0LLQviDQv9C+0LvQuNCz0L7QvdC+0LIg0L3QsCDQutCw0L3QstCw0YHQtS5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHJldHVybiB7KFNQbG90UG9seWdvbkdyb3VwfG51bGwpfSDQodC+0LfQtNCw0L3QvdCw0Y8g0LPRgNGD0L/Qv9CwINC/0L7Qu9C40LPQvtC90L7QsiDQuNC70LggbnVsbCxcbiAgICogICAgINC10YHQu9C4INGE0L7RgNC80LjRgNC+0LLQsNC90LjQtSDQstGB0LXRhSDQs9GA0YPQv9C/INC/0L7Qu9C40LPQvtC90L7QsiDQt9Cw0LLQtdGA0YjQuNC70L7RgdGMLlxuICAgKi9cbiAgX2NyZWF0ZVBvbHlnb25Hcm91cCgpIHtcblxuICAgIC8qKiBAdHlwZSB7U1Bsb3RQb2x5Z29uR3JvdXB9ICovXG4gICAgbGV0IHBvbHlnb25Hcm91cCA9IHtcbiAgICAgIHZlcnRpY2VzOiBbXSxcbiAgICAgIGluZGljZXM6IFtdLFxuICAgICAgY29sb3JzOiBbXSxcbiAgICAgIGFtb3VudE9mVmVydGljZXM6IDAsXG4gICAgICBhbW91bnRPZkdMVmVydGljZXM6IDBcbiAgICB9XG5cbiAgICAvKiogQHR5cGUge1NQbG90UG9seWdvbn0gKi9cbiAgICBsZXQgcG9seWdvbjtcblxuICAgIC8qKlxuICAgICAqINCV0YHQu9C4INC60L7Qu9C40YfQtdGB0YLQstC+INC/0L7Qu9C40LPQvtC90L7QsiDQutCw0L3QstCw0YHQsCDQtNC+0YHRgtC40LPQu9C+INC00L7Qv9GD0YHRgtC40LzQvtCz0L4g0LzQsNC60YHQuNC80YPQvNCwLCDRgtC+INC00LDQu9GM0L3QtdC50YjQsNGPXG4gICAgICog0L7QsdGA0LDQsdC+0YLQutCwINC40YHRhdC+0LTQvdGL0YUg0L7QsdGK0LXQutGC0L7QsiDQsdC+0LvRjNGI0LUg0L3QtSDRgtGA0LXQsdGD0LXRgtGB0Y8gLSDRhNC+0YDQvNC40YDQvtCy0LDQvdC40LUg0LPRgNGD0L/QvyDQv9C+0LvQuNCz0L7QvdC+0LJcbiAgICAgKiDQt9Cw0LLQtdGA0YjQsNC10YLRgdGPINCy0L7Qt9Cy0YDQsNGC0L7QvCDQt9C90LDRh9C10L3QuNGPIG51bGwgKNGB0LjQvNGD0LvRj9GG0LjRjyDQtNC+0YHRgtC40LbQtdC90LjRjyDQv9C+0YHQu9C10LTQvdC10LPQvlxuICAgICAqINC+0LHRgNCw0LHQsNGC0YvQstCw0LXQvNC+0LPQviDQuNGB0YXQvtC00L3QvtCz0L4g0L7QsdGK0LXQutGC0LApLlxuICAgICAqL1xuICAgIGlmICh0aGlzLl9hbW91bnRPZlBvbHlnb25zID49IHRoaXMubWF4QW1vdW50T2ZQb2x5Z29ucykgcmV0dXJuIG51bGw7XG5cbiAgICAvLyDQmNGC0LXRgNC40YDQvtCy0LDQvdC40LUg0LjRgdGF0L7QtNC90YvRhSDQvtCx0YrQtdC60YLQvtCyLlxuICAgIHdoaWxlIChwb2x5Z29uID0gdGhpcy5pdGVyYXRpb25DYWxsYmFjayEoKSkge1xuXG4gICAgICAvLyDQlNC+0LHQsNCy0LvQtdC90LjQtSDQsiDQs9GA0YPQv9C/0YMg0L/QvtC70LjQs9C+0L3QvtCyINC90L7QstC+0LPQviDQv9C+0LvQuNCz0L7QvdCwLlxuICAgICAgdGhpcy5fYWRkUG9seWdvbihwb2x5Z29uR3JvdXAsIHBvbHlnb24pO1xuXG4gICAgICAvLyDQn9C+0LTRgdGH0LjRgtGL0LLQsNC10YLRgdGPINGH0LjRgdC70L4g0L/RgNC40LzQtdC90LXQvdC40Lkg0LrQsNC20LTQvtC5INC40Lcg0YTQvtGA0Lwg0L/QvtC70LjQs9C+0L3QvtCyLlxuICAgICAgdGhpcy5fYnVmZmVycy5hbW91bnRPZlNoYXBlc1twb2x5Z29uLnNoYXBlXSsrO1xuXG4gICAgICAvLyDQodGH0LXRgtGH0LjQuiDQvtCx0YnQtdCz0L4g0LrQvtC70LjRh9C10YHRgtCy0L4g0L/QvtC70LjQs9C+0L3QvtCyLlxuICAgICAgdGhpcy5fYW1vdW50T2ZQb2x5Z29ucysrO1xuXG4gICAgICAvKipcbiAgICAgICAqINCV0YHQu9C4INC60L7Qu9C40YfQtdGB0YLQstC+INC/0L7Qu9C40LPQvtC90L7QsiDQutCw0L3QstCw0YHQsCDQtNC+0YHRgtC40LPQu9C+INC00L7Qv9GD0YHRgtC40LzQvtCz0L4g0LzQsNC60YHQuNC80YPQvNCwLCDRgtC+INC00LDQu9GM0L3QtdC50YjQsNGPXG4gICAgICAgKiDQvtCx0YDQsNCx0L7RgtC60LAg0LjRgdGF0L7QtNC90YvRhSDQvtCx0YrQtdC60YLQvtCyINCx0L7Qu9GM0YjQtSDQvdC1INGC0YDQtdCx0YPQtdGC0YHRjyAtINGE0L7RgNC80LjRgNC+0LLQsNC90LjQtSDQs9GA0YPQv9C/INC/0L7Qu9C40LPQvtC90L7QslxuICAgICAgICog0LfQsNCy0LXRgNGI0LDQtdGC0YHRjyDQstC+0LfQstGA0LDRgtC+0Lwg0LfQvdCw0YfQtdC90LjRjyBudWxsICjRgdC40LzRg9C70Y/RhtC40Y8g0LTQvtGB0YLQuNC20LXQvdC40Y8g0L/QvtGB0LvQtdC00L3QtdCz0L5cbiAgICAgICAqINC+0LHRgNCw0LHQsNGC0YvQstCw0LXQvNC+0LPQviDQuNGB0YXQvtC00L3QvtCz0L4g0L7QsdGK0LXQutGC0LApLlxuICAgICAgICovXG4gICAgICBpZiAodGhpcy5fYW1vdW50T2ZQb2x5Z29ucyA+PSB0aGlzLm1heEFtb3VudE9mUG9seWdvbnMpIGJyZWFrO1xuXG4gICAgICAvKipcbiAgICAgICAqINCV0YHQu9C4INC+0LHRidC10LUg0LrQvtC70LjRh9C10YHRgtCy0L4g0LLRgdC10YUg0LLQtdGA0YjQuNC9INCyINCz0YDRg9C/0L/QtSDQv9C+0LvQuNCz0L7QvdC+0LIg0L/RgNC10LLRi9GB0LjQu9C+INC00L7Qv9GD0YHRgtC40LzQvtC1LFxuICAgICAgICog0YLQviDQs9GA0YPQv9C/0LAg0L/QvtC70LjQs9C+0L3QvtCyINGB0YfQuNGC0LDQtdGC0YHRjyDRgdGE0L7RgNC80LjRgNC+0LLQsNC90L3QvtC5INC4INC40YLQtdGA0LjRgNC+0LLQsNC90LjQtSDQuNGB0YXQvtC00L3Ri9GFXG4gICAgICAgKiDQvtCx0YrQtdC60YLQvtCyINC/0YDQtdGA0YvQstCw0LXRgtGB0Y8uXG4gICAgICAgKi9cbiAgICAgIGlmIChwb2x5Z29uR3JvdXAuYW1vdW50T2ZWZXJ0aWNlcyA+PSB0aGlzLl9tYXhBbW91bnRPZlZlcnRleFBlclBvbHlnb25Hcm91cCkgYnJlYWs7XG4gICAgfVxuXG4gICAgLy8g0J/QvtC00YHRh9C40YLRi9Cy0LDQtdGC0YHRjyDQvtCx0YnQtdC1INC60L7Qu9C40YfQtdGB0YLQstC+INCy0LXRgNGI0LjQvSDQstGB0LXRhSDQstC10YDRiNC40L3QvdGL0YUg0LHRg9GE0LXRgNC+0LIuXG4gICAgdGhpcy5fYnVmZmVycy5hbW91bnRPZlRvdGFsVmVydGljZXMgKz0gcG9seWdvbkdyb3VwLmFtb3VudE9mVmVydGljZXM7XG5cbiAgICAvLyDQldGB0LvQuCDQs9GA0YPQv9C/0LAg0L/QvtC70LjQs9C+0L3QvtCyINC90LXQv9GD0YHRgtCw0Y8sINGC0L4g0LLQvtC30LLRgNCw0YnQsNC10Lwg0LXQtS4g0JXRgdC70Lgg0L/Rg9GB0YLQsNGPIC0g0LLQvtC30LLRgNCw0YnQsNC10LwgbnVsbC5cbiAgICByZXR1cm4gKHBvbHlnb25Hcm91cC5hbW91bnRPZlZlcnRpY2VzID4gMCkgPyBwb2x5Z29uR3JvdXAgOiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqINCh0L7Qt9C00LDQtdGCINCyINC80LDRgdGB0LjQstC1INCx0YPRhNC10YDQvtCyIFdlYkdMINC90L7QstGL0Lkg0LHRg9GE0LXRgCDQuCDQt9Cw0L/QuNGB0YvQstCw0LXRgiDQsiDQvdC10LPQviDQv9C10YDQtdC00LDQvdC90YvQtSDQtNCw0L3QvdGL0LUuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7QXJyYXkuPFdlYkdMQnVmZmVyPn0gYnVmZmVycyDQnNCw0YHRgdC40LIg0LHRg9GE0LXRgNC+0LIgV2ViR0wsINCyINC60L7RgtC+0YDRi9C5INCx0YPQtNC10YJcbiAgICogICAgINC00L7QsdCw0LLQu9C10L0g0YHQvtC30LTQsNCy0LDQtdC80YvQuSDQsdGD0YTQtdGALlxuICAgKiBAcGFyYW0ge3N0cmluZz1cIkFSUkFZX0JVRkZFUlwiLFwiRUxFTUVOVF9BUlJBWV9CVUZGRVJcIn0gdHlwZSDQotC40L8g0YHQvtC30LTQsNCy0LDQtdC80L7Qs9C+XG4gICAqICAgICDQsdGD0YTQtdGA0LAgLSDRgSDQuNC90YTQvtGA0LzQsNGG0LjQtdC5INC+INCy0LXRgNGI0LjQvdCw0YUsINC40LvQuCDRgSDQuNC90YTQvtGA0LzQsNGG0LjQtdC5INC+0LEg0LjQvdC00LXQutGB0LDRhSDQstC10YDRiNC40L0uXG4gICAqIEBwYXJhbSB7VHlwZWRBcnJheX0gZGF0YSDQlNCw0L3QvdGL0LUg0LIg0LLQuNC00LUg0YLQuNC/0LjQt9C40YDQvtCy0LDQvdC90L7Qs9C+INC80LDRgdGB0LjQstCwINC00LvRjyDQt9Cw0L/QuNGB0LhcbiAgICogICAgINCyINGB0L7Qt9C00LDQstCw0LXQvNGL0Lkg0LHRg9GE0LXRgC5cbiAgICogQHBhcmFtIHtudW1iZXJ9IGtleSDQmtC70Y7RhyAo0LjQvdC00LXQutGBKSwg0LjQtNC10L3RgtC40YTQuNGG0LjRgNGD0Y7RidC40Lkg0YLQuNC/INCx0YPRhNC10YDQsCAo0LTQu9GPINCy0LXRgNGI0LjQvSxcbiAgICogICAgINC00LvRjyDRhtCy0LXRgtC+0LIsINC00LvRjyDQuNC90LTQtdC60YHQvtCyKS4g0JjRgdC/0L7Qu9GM0LfRg9C10YLRgdGPINC00LvRjyDRgNCw0LfQtNC10LvRjNC90L7Qs9C+INC/0L7QtNGB0YfQtdGC0LAg0L/QsNC80Y/RgtC4LFxuICAgKiAgICAg0LfQsNC90LjQvNCw0LXQvNC+0Lkg0LrQsNC20LTRi9C8INGC0LjQv9C+0Lwg0LHRg9GE0LXRgNCwLlxuICAgKi9cbiAgX2FkZFdiR2xCdWZmZXIoYnVmZmVyczogV2ViR0xCdWZmZXJbXSwgdHlwZTogV2ViR2xCdWZmZXJUeXBlLCBkYXRhOiBUeXBlZEFycmF5LCBrZXk6IG51bWJlcikge1xuXG4gICAgLy8g0J7Qv9GA0LXQtNC10LvQtdC90LjQtSDQuNC90LTQtdC60YHQsCDQvdC+0LLQvtCz0L4g0Y3Qu9C10LzQtdC90YLQsCDQsiDQvNCw0YHRgdC40LLQtSDQsdGD0YTQtdGA0L7QsiBXZWJHTC5cbiAgICBjb25zdCBpbmRleCA9IHRoaXMuX2J1ZmZlcnMuYW1vdW50T2ZCdWZmZXJHcm91cHM7XG5cbiAgICAvLyDQodC+0LfQtNCw0L3QuNC1INC4INC30LDQv9C+0LvQvdC10L3QuNC1INC00LDQvdC90YvQvNC4INC90L7QstC+0LPQviDQsdGD0YTQtdGA0LAuXG4gICAgYnVmZmVyc1tpbmRleF0gPSB0aGlzLl9nbC5jcmVhdGVCdWZmZXIoKSE7XG4gICAgdGhpcy5fZ2wuYmluZEJ1ZmZlcih0aGlzLl9nbFt0eXBlXSwgYnVmZmVyc1tpbmRleF0pO1xuICAgIHRoaXMuX2dsLmJ1ZmZlckRhdGEodGhpcy5fZ2xbdHlwZV0sIGRhdGEsIHRoaXMuX2dsLlNUQVRJQ19EUkFXKTtcblxuICAgIC8vINCf0L7QtNGB0YfQtdGCINC/0LDQvNGP0YLQuCwg0LfQsNC90LjQvNCw0LXQvNC+0Lkg0LHRg9GE0LXRgNCw0LzQuCDQtNCw0L3QvdGL0YUgKNGA0LDQt9C00LXQu9GM0L3QviDQv9C+INC60LDQttC00L7QvNGDINGC0LjQv9GDINCx0YPRhNC10YDQvtCyKVxuICAgIHRoaXMuX2J1ZmZlcnMuc2l6ZUluQnl0ZXNba2V5XSArPSBkYXRhLmxlbmd0aCAqIGRhdGEuQllURVNfUEVSX0VMRU1FTlQ7XG4gIH1cblxuICBfZ2V0VmVydGljZXNPZlRyaWFuZ2xlKHg6IG51bWJlciwgeTogbnVtYmVyLCBjb25zdHM6IGFueVtdKTogU1Bsb3RQb2x5Z29uVmVydGljZXMge1xuXG4gICAgY29uc3QgW3gxLCB5MV0gPSBbeCAtIGNvbnN0c1swXSwgeSArIGNvbnN0c1syXV07XG4gICAgY29uc3QgW3gyLCB5Ml0gPSBbeCwgeSAtIGNvbnN0c1sxXV07XG4gICAgY29uc3QgW3gzLCB5M10gPSBbeCArIGNvbnN0c1swXSwgeSArIGNvbnN0c1syXV07XG5cbiAgICBjb25zdCB2ZXJ0aWNlcyA9IHtcbiAgICAgIHZhbHVlczogW3gxLCB5MSwgeDIsIHkyLCB4MywgeTNdLFxuICAgICAgaW5kaWNlczogWzAsIDEsIDJdXG4gICAgfVxuXG4gICAgcmV0dXJuIHZlcnRpY2VzO1xuICB9XG5cbiAgX2dldFZlcnRpY2VzT2ZTcXVhcmUoeDogbnVtYmVyLCB5OiBudW1iZXIsIGNvbnN0czogYW55W10pOiBTUGxvdFBvbHlnb25WZXJ0aWNlcyB7XG5cbiAgICBjb25zdCBbeDEsIHkxXSA9IFt4IC0gY29uc3RzWzBdLCB5IC0gY29uc3RzWzBdXTtcbiAgICBjb25zdCBbeDIsIHkyXSA9IFt4ICsgY29uc3RzWzBdLCB5ICsgY29uc3RzWzBdXTtcblxuICAgIGNvbnN0IHZlcnRpY2VzID0ge1xuICAgICAgdmFsdWVzOiBbeDEsIHkxLCB4MiwgeTEsIHgyLCB5MiwgeDEsIHkyXSxcbiAgICAgIGluZGljZXM6IFswLCAxLCAyLCAwLCAyLCAzXVxuICAgIH07XG5cbiAgICByZXR1cm4gdmVydGljZXM7XG4gIH1cblxuICBfZ2V0VmVydGljZXNPZkNpcmNsZSh4OiBudW1iZXIsIHk6IG51bWJlciwgY29uc3RzOiBhbnlbXSk6IFNQbG90UG9seWdvblZlcnRpY2VzIHtcblxuICAgIC8vINCX0LDQvdC10YHQtdC90LjQtSDQsiDQvdCw0LHQvtGAINCy0LXRgNGI0LjQvSDRhtC10L3RgtGA0LAg0LrRgNGD0LPQsC5cbiAgICBjb25zdCB2ZXJ0aWNlczogU1Bsb3RQb2x5Z29uVmVydGljZXMgPSB7XG4gICAgICB2YWx1ZXM6IFt4LCB5XSxcbiAgICAgIGluZGljZXM6IFtdXG4gICAgfTtcblxuICAgIC8vINCU0L7QsdCw0LLQu9C10L3QuNC1INCw0L/RgNC+0LrRgdC40LzQuNGA0YPRjtGJ0LjRhSDQvtC60YDRg9C20L3QvtGB0YLRjCDQutGA0YPQs9CwINCy0LXRgNGI0LjQvS5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbnN0c1szXS5sZW5ndGg7IGkrKykge1xuICAgICAgdmVydGljZXMudmFsdWVzLnB1c2goeCArIGNvbnN0c1szXVtpXSwgeSArIGNvbnN0c1s0XVtpXSk7XG4gICAgICB2ZXJ0aWNlcy5pbmRpY2VzLnB1c2goMCwgaSArIDEsIGkgKyAyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDQn9C+0YHQu9C10LTQvdGP0Y8g0LLQtdGA0YjQuNC90LAg0L/QvtGB0LvQtdC00L3QtdCz0L4gR0wt0YLRgNC10YPQs9C+0LvRjNC90LjQutCwINC30LDQvNC10L3Rj9C10YLRgdGPINC90LAg0L/QtdGA0LLRg9GOINCw0L/RgNC+0LrRgdC40LzQuNGA0YPRjtGJ0YPRjlxuICAgICAqINC+0LrRgNGD0LbQvdC+0YHRgtGMINC60YDRg9Cz0LAg0LLQtdGA0YjQuNC90YMsINC30LDQvNGL0LrQsNGPINCw0L/RgNC+0LrRgdC40LzQuNGA0YPRidC40Lkg0LrRgNGD0LMg0L/QvtC70LjQs9C+0L0uXG4gICAgICovXG4gICAgdmVydGljZXMuaW5kaWNlc1t2ZXJ0aWNlcy5pbmRpY2VzLmxlbmd0aCAtIDFdID0gMTtcblxuICAgIHJldHVybiB2ZXJ0aWNlcztcbiAgfVxuXG4gIC8qKlxuICAgKiDQodC+0LfQtNCw0LXRgiDQuCDQtNC+0LHQsNCy0LvRj9C10YIg0LIg0LPRgNGD0L/Qv9GDINC/0L7Qu9C40LPQvtC90L7QsiDQvdC+0LLRi9C5INC/0L7Qu9C40LPQvtC9LlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge1NQbG90UG9seWdvbkdyb3VwfSBwb2x5Z29uR3JvdXAg0JPRgNGD0L/Qv9CwINC/0L7Qu9C40LPQvtC90L7Qsiwg0LIg0LrQvtGC0L7RgNGD0Y5cbiAgICogICAgINC/0YDQvtC40YHRhdC+0LTQuNGCINC00L7QsdCw0LLQu9C10L3QuNC1LlxuICAgKiBAcGFyYW0ge1NQbG90UG9seWdvbn0gcG9seWdvbiDQmNC90YTQvtGA0LzQsNGG0LjRjyDQviDQtNC+0LHQsNCy0LvRj9C10LzQvtC8INC/0L7Qu9C40LPQvtC90LUuXG4gICAqL1xuICBfYWRkUG9seWdvbihwb2x5Z29uR3JvdXA6IFNQbG90UG9seWdvbkdyb3VwLCBwb2x5Z29uOiBTUGxvdFBvbHlnb24pIHtcblxuICAgIC8qKlxuICAgICAqINCd0LAg0L7RgdC90L7QstC1INGE0L7RgNC80Ysg0L/QvtC70LjQs9C+0L3QsCDQuCDQutC+0L7RgNC00LjQvdCw0YIg0LXQs9C+INGG0LXQvdGC0YDQsCDQstGL0LfRi9Cy0LDQtdGC0YHRjyDRgdC+0L7RgtCy0LXRgtGB0LLRg9GO0YnQsNGPXG4gICAgICog0YTRg9C90LrRhtC40Y8g0L3QsNGF0L7QttC00LXQvdC40Y8g0LrQvtC+0YDQtNC40L3QsNGCINC10LPQviDQstC10YDRiNC40L0uXG4gICAgICovXG4gICAgY29uc3QgdmVydGljZXMgPSB0aGlzLl9nZXRWZXJ0aWNlc1twb2x5Z29uLnNoYXBlXS5mdW5jKFxuICAgICAgcG9seWdvbi54LCBwb2x5Z29uLnksIHRoaXMuX1VTRUZVTF9DT05TVFNcbiAgICApO1xuXG4gICAgLy8g0JrQvtC70LjRh9C10YHRgtCy0L4g0LLQtdGA0YjQuNC9IC0g0Y3RgtC+INC60L7Qu9C40YfQtdGB0YLQstC+INC/0LDRgCDRh9C40YHQtdC7INCyINC80LDRgdGB0LjQstC1INCy0LXRgNGI0LjQvS5cbiAgICBjb25zdCBhbW91bnRPZlZlcnRpY2VzID0gTWF0aC50cnVuYyh2ZXJ0aWNlcy52YWx1ZXMubGVuZ3RoIC8gMik7XG5cbiAgICAvLyDQndCw0YXQvtC20LTQtdC90LjQtSDQuNC90LTQtdC60YHQsCDQv9C10YDQstC+0Lkg0LTQvtCx0LDQstC70Y/QtdC80L7QuSDQsiDQs9GA0YPQv9C/0YMg0L/QvtC70LjQs9C+0L3QvtCyINCy0LXRgNGI0LjQvdGLLlxuICAgIGNvbnN0IGluZGV4T2ZMYXN0VmVydGV4ID0gcG9seWdvbkdyb3VwLmFtb3VudE9mVmVydGljZXM7XG5cbiAgICAvKipcbiAgICAgKiDQndC+0LzQtdGA0LAg0LjQvdC00LXQutGB0L7QsiDQstC10YDRiNC40L0gLSDQvtGC0L3QvtGB0LjRgtC10LvRjNC90YvQtS4g0JTQu9GPINCy0YvRh9C40YHQu9C10L3QuNGPINCw0LHRgdC+0LvRjtGC0L3Ri9GFINC40L3QtNC10LrRgdC+0LJcbiAgICAgKiDQvdC10L7QsdGF0L7QtNC40LzQviDQv9GA0LjQsdCw0LLQuNGC0Ywg0Log0L7RgtC90L7RgdC40YLQtdC70YzQvdGL0Lwg0LjQvdC00LXQutGB0LDQvCDQuNC90LTQtdC60YEg0L/QtdGA0LLQvtC5INC00L7QsdCw0LLQu9GP0LXQvNC+0LlcbiAgICAgKiDQsiDQs9GA0YPQv9C/0YMg0L/QvtC70LjQs9C+0L3QvtCyINCy0LXRgNGI0LjQvdGLLlxuICAgICAqL1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmVydGljZXMuaW5kaWNlcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmVydGljZXMuaW5kaWNlc1tpXSArPSBpbmRleE9mTGFzdFZlcnRleDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDQlNC+0LHQsNCy0LvQtdC90LjQtSDQsiDQs9GA0YPQv9C/0YMg0L/QvtC70LjQs9C+0L3QvtCyINC40L3QtNC10LrRgdC+0LIg0LLQtdGA0YjQuNC9INC90L7QstC+0LPQviDQv9C+0LvQuNCz0L7QvdCwINC4INC/0L7QtNGB0YfQtdGCXG4gICAgICog0L7QsdGJ0LXQs9C+INC60L7Qu9C40YfQtdGB0YLQstCwINCy0LXRgNGI0LjQvSBHTC3RgtGA0LXRg9Cz0L7Qu9GM0L3QuNC60L7QsiDQsiDQs9GA0YPQv9C/0LUuXG4gICAgICovXG4gICAgcG9seWdvbkdyb3VwLmluZGljZXMucHVzaCguLi52ZXJ0aWNlcy5pbmRpY2VzKTtcbiAgICBwb2x5Z29uR3JvdXAuYW1vdW50T2ZHTFZlcnRpY2VzICs9IHZlcnRpY2VzLmluZGljZXMubGVuZ3RoO1xuXG4gICAgLyoqXG4gICAgICog0JTQvtCx0LDQstC70LXQvdC40LUg0LIg0LPRgNGD0L/Qv9GDINC/0L7Qu9C40LPQvtC90L7QsiDRgdCw0LzQuNGFINCy0LXRgNGI0LjQvSDQvdC+0LLQvtCz0L4g0L/QvtC70LjQs9C+0L3QsCDQuCDQv9C+0LTRgdGH0LXRglxuICAgICAqINC+0LHRidC10LPQviDQutC+0LvQuNGH0LXRgdGC0LLQsCDQstC10YDRiNC40L0g0LIg0LPRgNGD0L/Qv9C1LlxuICAgICAqL1xuICAgIHBvbHlnb25Hcm91cC52ZXJ0aWNlcy5wdXNoKC4uLnZlcnRpY2VzLnZhbHVlcyk7XG4gICAgcG9seWdvbkdyb3VwLmFtb3VudE9mVmVydGljZXMgKz0gYW1vdW50T2ZWZXJ0aWNlcztcblxuICAgIC8vINCU0L7QsdCw0LLQu9C10L3QuNC1INGG0LLQtdGC0L7QsiDQstC10YDRiNC40L0gLSDQv9C+INC+0LTQvdC+0LzRgyDRhtCy0LXRgtGDINC90LAg0LrQsNC20LTRg9GOINCy0LXRgNGI0LjQvdGDLlxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYW1vdW50T2ZWZXJ0aWNlczsgaSsrKSB7XG4gICAgICBwb2x5Z29uR3JvdXAuY29sb3JzLnB1c2gocG9seWdvbi5jb2xvcik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqINCS0YvQstC+0LTQuNGCINCyINC60L7QvdGB0L7Qu9GMINCx0LDQt9C+0LLRg9GOINGH0LDRgdGC0Ywg0L7RgtC70LDQtNC+0YfQvdC+0Lkg0LjQvdGE0L7RgNC80LDRhtC40LguXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7U1Bsb3RPdGlvbnN9IG9wdGlvbnMg0J/QvtC70YzQt9C+0LLQsNGC0LXQu9GM0YHQutC40LUg0L3QsNGB0YLRgNC+0LnQutC4INGN0LrQt9C10LzQv9C70Y/RgNCwLlxuICAgKi9cbiAgX3JlcG9ydE1haW5JbmZvKG9wdGlvbnM6IFNQbG90T3B0aW9ucykge1xuXG4gICAgY29uc29sZS5sb2coJyVj0JLQutC70Y7Rh9C10L0g0YDQtdC20LjQvCDQvtGC0LvQsNC00LrQuCAnICsgdGhpcy5jb25zdHJ1Y3Rvci5uYW1lICtcbiAgICAgICcgWyMnICsgdGhpcy5fY2FudmFzLmlkICsgJ10nLCB0aGlzLl9kZWJ1Z1N0eWxlICsgJyBiYWNrZ3JvdW5kLWNvbG9yOiAjY2MwMDAwOycpO1xuXG4gICAgaWYgKHRoaXMuZGVtb01vZGUuaXNFbmFibGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKCclY9CS0LrQu9GO0YfQtdC9INC00LXQvNC+0L3RgdGC0YDQsNGG0LjQvtC90L3Ri9C5INGA0LXQttC40Lwg0LTQsNC90L3Ri9GFJywgdGhpcy5fZGVidWdTdHlsZSk7XG4gICAgfVxuXG4gICAgLy8g0JPRgNGD0L/Qv9CwIFwi0J/RgNC10LTRg9C/0YDQtdC20LTQtdC90LjQtVwiLlxuICAgIGNvbnNvbGUuZ3JvdXAoJyVj0J/RgNC10LTRg9C/0YDQtdC20LTQtdC90LjQtScsIHRoaXMuX2RlYnVnU3R5bGUpO1xuXG4gICAgY29uc29sZS5kaXIoJ9Ce0YLQutGA0YvRgtCw0Y8g0LrQvtC90YHQvtC70Ywg0LHRgNCw0YPQt9C10YDQsCDQuCDQtNGA0YPQs9C40LUg0LDQutGC0LjQstC90YvQtSDRgdGA0LXQtNGB0YLQstCwINC60L7QvdGC0YDQvtC70Y8g0YDQsNC30YDQsNCx0L7RgtC60Lgg0YHRg9GJ0LXRgdGC0LLQtdC90L3QviDRgdC90LjQttCw0Y7RgiDQv9GA0L7QuNC30LLQvtC00LjRgtC10LvRjNC90L7RgdGC0Ywg0LLRi9GB0L7QutC+0L3QsNCz0YDRg9C20LXQvdC90YvRhSDQv9GA0LjQu9C+0LbQtdC90LjQuS4g0JTQu9GPINC+0LHRitC10LrRgtC40LLQvdC+0LPQviDQsNC90LDQu9C40LfQsCDQv9GA0L7QuNC30LLQvtC00LjRgtC10LvRjNC90L7RgdGC0Lgg0LLRgdC1INC/0L7QtNC+0LHQvdGL0LUg0YHRgNC10LTRgdGC0LLQsCDQtNC+0LvQttC90Ysg0LHRi9GC0Ywg0L7RgtC60LvRjtGH0LXQvdGLLCDQsCDQutC+0L3RgdC+0LvRjCDQsdGA0LDRg9C30LXRgNCwINC30LDQutGA0YvRgtCwLiDQndC10LrQvtGC0L7RgNGL0LUg0LTQsNC90L3Ri9C1INC+0YLQu9Cw0LTQvtGH0L3QvtC5INC40L3RhNC+0YDQvNCw0YbQuNC4INCyINC30LDQstC40YHQuNC80L7RgdGC0Lgg0L7RgiDQuNGB0L/QvtC70YzQt9GD0LXQvNC+0LPQviDQsdGA0LDRg9C30LXRgNCwINC80L7Qs9GD0YIg0L3QtSDQvtGC0L7QsdGA0LDQttCw0YLRjNGB0Y8g0LjQu9C4INC+0YLQvtCx0YDQsNC20LDRgtGM0YHRjyDQvdC10LrQvtGA0YDQtdC60YLQvdC+LiDQodGA0LXQtNGB0YLQstC+INC+0YLQu9Cw0LTQutC4INC/0YDQvtGC0LXRgdGC0LjRgNC+0LLQsNC90L4g0LIg0LHRgNCw0YPQt9C10YDQtSBHb29nbGUgQ2hyb21lIHYuOTAnKTtcblxuICAgIGNvbnNvbGUuZ3JvdXBFbmQoKTtcbi8qXG4gICAgLy8g0JPRgNGD0L/Qv9CwIFwi0JLQuNC00LXQvtGB0LjRgdGC0LXQvNCwXCIuXG4gICAgY29uc29sZS5ncm91cCgnJWPQktC40LTQtdC+0YHQuNGB0YLQtdC80LAnLCB0aGlzLl9kZWJ1Z1N0eWxlKTtcblxuICAgIGxldCBleHQgPSB0aGlzLl9nbC5nZXRFeHRlbnNpb24oJ1dFQkdMX2RlYnVnX3JlbmRlcmVyX2luZm8nKTtcbiAgICBsZXQgZ3JhcGhpY3NDYXJkTmFtZSA9IChleHQpID8gdGhpcy5fZ2wuZ2V0UGFyYW1ldGVyKGV4dC5VTk1BU0tFRF9SRU5ERVJFUl9XRUJHTCkgOiAnW9C90LXQuNC30LLQtdGB0YLQvdC+XSdcbiAgICBjb25zb2xlLmxvZygn0JPRgNCw0YTQuNGH0LXRgdC60LDRjyDQutCw0YDRgtCwOiAnICsgZ3JhcGhpY3NDYXJkTmFtZSk7XG4gICAgY29uc29sZS5sb2coJ9CS0LXRgNGB0LjRjyBHTDogJyArIHRoaXMuX2dsLmdldFBhcmFtZXRlcih0aGlzLl9nbC5WRVJTSU9OKSk7XG5cbiAgICBjb25zb2xlLmdyb3VwRW5kKCk7XG4qL1xuICAgIC8vINCT0YDRg9C/0L/QsCBcItCd0LDRgdGC0YDQvtC50LrQsCDQv9Cw0YDQsNC80LXRgtGA0L7QsiDRjdC60LfQtdC80L/Qu9GP0YDQsFwiLlxuICAgIGNvbnNvbGUuZ3JvdXAoJyVj0J3QsNGB0YLRgNC+0LnQutCwINC/0LDRgNCw0LzQtdGC0YDQvtCyINGN0LrQt9C10LzQv9C70Y/RgNCwJywgdGhpcy5fZGVidWdTdHlsZSk7XG5cbiAgICBjb25zb2xlLmRpcih0aGlzKTtcbiAgICBjb25zb2xlLmxvZygn0JfQsNC00LDQvdGLINC/0LDRgNCw0LzQtdGC0YDRizpcXG4nLCBKU09OLnN0cmluZ2lmeShvcHRpb25zLCBudWxsLCAnICcpKTtcbiAgICBjb25zb2xlLmxvZygn0JrQsNC90LLQsNGBOiAjJyArIHRoaXMuX2NhbnZhcy5pZCk7XG4gICAgY29uc29sZS5sb2coJ9Cg0LDQt9C80LXRgCDQutCw0L3QstCw0YHQsDogJyArIHRoaXMuX2NhbnZhcy53aWR0aCArICcgeCAnICsgdGhpcy5fY2FudmFzLmhlaWdodCArICcgcHgnKTtcbiAgICBjb25zb2xlLmxvZygn0KDQsNC30LzQtdGAINC/0LvQvtGB0LrQvtGB0YLQuDogJyArIHRoaXMuZ3JpZFNpemUud2lkdGggKyAnIHggJyArIHRoaXMuZ3JpZFNpemUuaGVpZ2h0ICsgJyBweCcpO1xuICAgIGNvbnNvbGUubG9nKCfQoNCw0LfQvNC10YAg0L/QvtC70LjQs9C+0L3QsDogJyArIHRoaXMucG9seWdvblNpemUgKyAnIHB4Jyk7XG4gICAgY29uc29sZS5sb2coJ9CQ0L/RgNC+0LrRgdC40LzQsNGG0LjRjyDQvtC60YDRg9C20L3QvtGB0YLQuDogJyArIHRoaXMuY2lyY2xlQXBwcm94TGV2ZWwgKyAnINGD0LPQu9C+0LInKTtcbiAgICBjb25zb2xlLmxvZygn0KTRg9C90LrRhtC40Y8g0L/QtdGA0LXQsdC+0YDQsDogJyArIHRoaXMuaXRlcmF0aW9uQ2FsbGJhY2shLm5hbWUpO1xuXG4gICAgY29uc29sZS5ncm91cEVuZCgpO1xuICB9XG5cbiAgLyoqXG4gICAqINCS0YvQstC+0LTQuNGCINCyINC60L7QvdGB0L7Qu9GMINC+0YLQu9Cw0LTQvtGH0L3Rg9GOINC40L3RhNC+0YDQvNCw0YbQuNGOINC+INC30LDQs9GA0YPQt9C60LUg0LjRgdGF0L7QtNC90YvRhSDQvtCx0YrQtdC60YLQvtCyLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3JlcG9ydEFib3V0T2JqZWN0UmVhZGluZygpIHtcblxuICAgIC8vINCT0YDRg9C/0L/QsCBcItCX0LDQs9GA0YPQt9C60LAg0LTQsNC90L3Ri9GFINC30LDQstC10YDRiNC10L3QsFwiLlxuICAgIGNvbnNvbGUuZ3JvdXAoJyVj0JfQsNCz0YDRg9C30LrQsCDQtNCw0L3QvdGL0YUg0LfQsNCy0LXRgNGI0LXQvdCwIFsnICtcbiAgICAgIHRoaXMuX2dldEN1cnJlbnRUaW1lKCkgKyAnXScsIHRoaXMuX2RlYnVnU3R5bGUpO1xuXG4gICAgY29uc29sZS50aW1lRW5kKCfQlNC70LjRgtC10LvRjNC90L7RgdGC0YwnKTtcblxuICAgIGNvbnNvbGUubG9nKCfQoNC10LfRg9C70YzRgtCw0YI6ICcgK1xuICAgICAgKCh0aGlzLl9hbW91bnRPZlBvbHlnb25zID49IHRoaXMubWF4QW1vdW50T2ZQb2x5Z29ucykgPyAn0LTQvtGB0YLQuNCz0L3Rg9GCINC30LDQtNCw0L3QvdGL0Lkg0LvQuNC80LjRgiAoJyArXG4gICAgICAgIHRoaXMubWF4QW1vdW50T2ZQb2x5Z29ucy50b0xvY2FsZVN0cmluZygpICsgJyknIDogJ9C+0LHRgNCw0LHQvtGC0LDQvdGLINCy0YHQtSDQvtCx0YrQtdC60YLRiycpKTtcblxuICAgIC8vINCT0YDRg9C/0L/QsCBcItCa0L7Quy3QstC+INC+0LHRitC10LrRgtC+0LJcIi5cbiAgICBjb25zb2xlLmdyb3VwKCfQmtC+0Lst0LLQviDQvtCx0YrQtdC60YLQvtCyOiAnICsgdGhpcy5fYW1vdW50T2ZQb2x5Z29ucy50b0xvY2FsZVN0cmluZygpKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fZ2V0VmVydGljZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHNoYXBlQ2FwY3Rpb24gPSB0aGlzLl9nZXRWZXJ0aWNlc1tpXS5jYXB0aW9uO1xuICAgICAgY29uc3Qgc2hhcGVBbW91bnQgPSB0aGlzLl9idWZmZXJzLmFtb3VudE9mU2hhcGVzW2ldO1xuICAgICAgY29uc29sZS5sb2coc2hhcGVDYXBjdGlvbiArICc6ICcgKyBzaGFwZUFtb3VudC50b0xvY2FsZVN0cmluZygpICtcbiAgICAgICAgJyBbficgKyBNYXRoLnJvdW5kKDEwMCAqIHNoYXBlQW1vdW50IC8gdGhpcy5fYW1vdW50T2ZQb2x5Z29ucykgKyAnJV0nKTtcbiAgICB9XG5cbiAgICBjb25zb2xlLmxvZygn0J/QsNC70LjRgtGA0LA6ICcgKyB0aGlzLnBvbHlnb25QYWxldHRlLmxlbmd0aCArICcg0YbQstC10YLQvtCyJyk7XG5cbiAgICBjb25zb2xlLmdyb3VwRW5kKCk7XG5cbiAgICBsZXQgYnl0ZXNVc2VkQnlCdWZmZXJzID0gdGhpcy5fYnVmZmVycy5zaXplSW5CeXRlc1swXSArXG4gICAgICB0aGlzLl9idWZmZXJzLnNpemVJbkJ5dGVzWzFdICsgdGhpcy5fYnVmZmVycy5zaXplSW5CeXRlc1syXTtcblxuICAgIC8vINCT0YDRg9C/0L/QsCBcItCX0LDQvdGP0YLQviDQstC40LTQtdC+0L/QsNC80Y/RgtC4XCIuXG4gICAgY29uc29sZS5ncm91cCgn0JfQsNC90Y/RgtC+INCy0LjQtNC10L7Qv9Cw0LzRj9GC0Lg6ICcgK1xuICAgICAgKGJ5dGVzVXNlZEJ5QnVmZmVycyAvIDEwMDAwMDApLnRvRml4ZWQoMikudG9Mb2NhbGVTdHJpbmcoKSArICcg0JzQkScpO1xuXG4gICAgY29uc29sZS5sb2coJ9CR0YPRhNC10YDRiyDQstC10YDRiNC40L06ICcgK1xuICAgICAgKHRoaXMuX2J1ZmZlcnMuc2l6ZUluQnl0ZXNbMF0gLyAxMDAwMDAwKS50b0ZpeGVkKDIpLnRvTG9jYWxlU3RyaW5nKCkgKyAnINCc0JEnICtcbiAgICAgICcgW34nICsgTWF0aC5yb3VuZCgxMDAgKiB0aGlzLl9idWZmZXJzLnNpemVJbkJ5dGVzWzBdIC8gYnl0ZXNVc2VkQnlCdWZmZXJzKSArICclXScpO1xuXG4gICAgY29uc29sZS5sb2coJ9CR0YPRhNC10YDRiyDRhtCy0LXRgtC+0LI6ICdcbiAgICAgICsgKHRoaXMuX2J1ZmZlcnMuc2l6ZUluQnl0ZXNbMV0gLyAxMDAwMDAwKS50b0ZpeGVkKDIpLnRvTG9jYWxlU3RyaW5nKCkgKyAnINCc0JEnICtcbiAgICAgICcgW34nICsgTWF0aC5yb3VuZCgxMDAgKiB0aGlzLl9idWZmZXJzLnNpemVJbkJ5dGVzWzFdIC8gYnl0ZXNVc2VkQnlCdWZmZXJzKSArICclXScpO1xuXG4gICAgY29uc29sZS5sb2coJ9CR0YPRhNC10YDRiyDQuNC90LTQtdC60YHQvtCyOiAnXG4gICAgICArICh0aGlzLl9idWZmZXJzLnNpemVJbkJ5dGVzWzJdIC8gMTAwMDAwMCkudG9GaXhlZCgyKS50b0xvY2FsZVN0cmluZygpICsgJyDQnNCRJyArXG4gICAgICAnIFt+JyArIE1hdGgucm91bmQoMTAwICogdGhpcy5fYnVmZmVycy5zaXplSW5CeXRlc1syXSAvIGJ5dGVzVXNlZEJ5QnVmZmVycykgKyAnJV0nKTtcblxuICAgIGNvbnNvbGUuZ3JvdXBFbmQoKTtcblxuICAgIGNvbnNvbGUubG9nKCfQmtC+0Lst0LLQviDQs9GA0YPQv9C/INCx0YPRhNC10YDQvtCyOiAnICtcbiAgICAgIHRoaXMuX2J1ZmZlcnMuYW1vdW50T2ZCdWZmZXJHcm91cHMudG9Mb2NhbGVTdHJpbmcoKSk7XG5cbiAgICBjb25zb2xlLmxvZygn0JrQvtC7LdCy0L4gR0wt0YLRgNC10YPQs9C+0LvRjNC90LjQutC+0LI6ICcgK1xuICAgICAgKHRoaXMuX2J1ZmZlcnMuYW1vdW50T2ZUb3RhbEdMVmVydGljZXMgLyAzKS50b0xvY2FsZVN0cmluZygpKTtcblxuICAgIGNvbnNvbGUubG9nKCfQmtC+0Lst0LLQviDQstC10YDRiNC40L06ICcgK1xuICAgICAgdGhpcy5fYnVmZmVycy5hbW91bnRPZlRvdGFsVmVydGljZXMudG9Mb2NhbGVTdHJpbmcoKSk7XG5cbiAgICBjb25zb2xlLmdyb3VwRW5kKCk7XG4gIH1cblxuICAvKipcbiAgICog0KHQvtC30LTQsNC10YIg0LTQvtC/0L7Qu9C90LXQvdC40LUg0Log0LrQvtC00YMg0L3QsCDRj9C30YvQutC1IEdMU0wuINCh0L7Qt9C00LDQvdC90YvQuSDQutC+0LQg0LHRg9C00LXRgiDQstGB0YLRgNC+0LXQvSDQsiDQutC+0LRcbiAgICog0LLQtdGA0YjQuNC90L3QvtCz0L4g0YjQtdC50LTQtdGA0LAgV2ViR0wg0LTQu9GPINC30LDQtNCw0L3QuNGPINGG0LLQtdGC0LAg0LLQtdGA0YjQuNC90Ysg0LIg0LfQsNCy0LjRgdC40LzQvtGB0YLQuCDQvtGCINC40L3QtNC10LrRgdCwXG4gICAqINGG0LLQtdGC0LAsINC/0YDQuNGB0LLQvtC10L3QvdC+0LPQviDRjdGC0L7QuSDQstC10YDRiNC40L3QtS4g0KIu0LouINGI0LXQudC00LXRgCDQvdC1INC/0L7Qt9Cy0L7Qu9GP0LXRgiDQuNGB0L/QvtC70YzQt9C+0LLQsNGC0Ywg0LJcbiAgICog0LrQsNGH0LXRgdGC0LLQtSDQuNC90LTQtdC60YHQvtCyINC/0LXRgNC10LzQtdC90L3Ri9C1IC0g0LTQu9GPINC30LDQtNCw0L3QuNGPINGG0LLQtdGC0LAg0LjRgdC/0L7Qu9GM0LfRg9C10YLRgdGPINC/0LXRgNC10LHQvtGAINC40L3QtNC10LrRgdC+0LIuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEByZXR1cm4ge3N0cmluZ30g0JrQvtC0INC90LAg0Y/Qt9GL0LrQtSBHTFNMLlxuICAgKi9cbiAgX2dlblNoYWRlckNvbG9yQ29kZSgpIHtcblxuICAgIC8vINCS0YDQtdC80LXQvdC90L4g0LTQvtCx0LDQstC70Y/QtdC8INCyINC/0LDQu9C40YLRgNGDINGG0LLQtdGC0L7QsiDQstC10YDRiNC40L0g0YbQstC10YIg0LTQu9GPINC90LDQv9GA0LDQstC70Y/RjtGJ0LjRhS5cbiAgICB0aGlzLnBvbHlnb25QYWxldHRlLnB1c2godGhpcy5ydWxlc0NvbG9yKTtcblxuICAgIGxldCBjb2RlID0gJyc7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucG9seWdvblBhbGV0dGUubGVuZ3RoOyBpKyspIHtcblxuICAgICAgLy8g0J/QvtC70YPRh9C10L3QuNC1INGG0LLQtdGC0LAg0LIg0L3Rg9C20L3QvtC8INGE0L7RgNC80LDRgtC1LlxuICAgICAgbGV0IFtyLCBnLCBiXSA9IHRoaXMuX2NvbnZlcnRDb2xvcih0aGlzLnBvbHlnb25QYWxldHRlW2ldKTtcblxuICAgICAgLy8g0KTQvtGA0LzQuNGA0L7QstC90LjQtSDRgdGC0YDQvtC6IEdMU0wt0LrQvtC00LAg0L/RgNC+0LLQtdGA0LrQuCDQuNC90LTQtdC60YHQsCDRhtCy0LXRgtCwLlxuICAgICAgY29kZSArPSAoKGkgPT09IDApID8gJycgOiAnICBlbHNlICcpICtcbiAgICAgICAgJ2lmIChhX2NvbG9yID09ICcgKyBpICsgJy4wKSB2X2NvbG9yID0gdmVjMygnICtcbiAgICAgICAgci50b1N0cmluZygpLnNsaWNlKDAsIDkpICsgJywnICtcbiAgICAgICAgZy50b1N0cmluZygpLnNsaWNlKDAsIDkpICsgJywnICtcbiAgICAgICAgYi50b1N0cmluZygpLnNsaWNlKDAsIDkpICsgJyk7XFxuJztcbiAgICB9XG5cbiAgICAvLyDQo9C00LDQu9GP0LXQvCDQuNC3INC/0LDQu9C40YLRgNGLINCy0LXRgNGI0LjQvSDQstGA0LXQvNC10L3QvdC+INC00L7QsdCw0LLQu9C10L3QvdGL0Lkg0YbQstC10YIg0L3QsNC/0YDQsNCy0LvRj9GO0YnQuNGFLlxuICAgIHRoaXMucG9seWdvblBhbGV0dGUucG9wKCk7XG5cbiAgICByZXR1cm4gY29kZTtcbiAgfVxuXG4gIF9jb252ZXJ0Q29sb3IoaGV4Q29sb3I6IEhFWENvbG9yKSB7XG5cbiAgICBsZXQgayA9IC9eIz8oW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkkL2kuZXhlYyhoZXhDb2xvcik7XG4gICAgbGV0IFtyLCBnLCBiXSA9IFtwYXJzZUludChrIVsxXSwgMTYpIC8gMjU1LCBwYXJzZUludChrIVsyXSwgMTYpIC8gMjU1LCBwYXJzZUludChrIVszXSwgMTYpIC8gMjU1XTtcblxuICAgIHJldHVybiBbciwgZywgYl07XG4gIH1cblxuICAvKipcbiAgICog0JLRi9GH0LjRgdC70Y/QtdGCINGC0LXQutGD0YnQtdC1INCy0YDQtdC80Y8uXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEByZXR1dG4ge3N0cmluZ30g0KHRgtGA0L7QutC+0LLQsNGPINGE0L7RgNC80LDRgtC40YDQvtCy0LDQvdC90LDRjyDQt9Cw0L/QuNGB0Ywg0YLQtdC60YPRidC10LPQviDQstGA0LXQvNC10L3QuC5cbiAgICovXG4gIF9nZXRDdXJyZW50VGltZSgpIHtcblxuICAgIGxldCB0b2RheSA9IG5ldyBEYXRlKCk7XG5cbiAgICBsZXQgdGltZSA9XG4gICAgICAoKHRvZGF5LmdldEhvdXJzKCkgPCAxMCA/ICcwJyA6ICcnKSArIHRvZGF5LmdldEhvdXJzKCkpICsgXCI6XCIgK1xuICAgICAgKCh0b2RheS5nZXRNaW51dGVzKCkgPCAxMCA/ICcwJyA6ICcnKSArIHRvZGF5LmdldE1pbnV0ZXMoKSkgKyBcIjpcIiArXG4gICAgICAoKHRvZGF5LmdldFNlY29uZHMoKSA8IDEwID8gJzAnIDogJycpICsgdG9kYXkuZ2V0U2Vjb25kcygpKTtcblxuICAgIHJldHVybiB0aW1lO1xuICB9XG5cbiAgLyoqXG4gICAqINCh0L7Qt9C00LDQtdGCINC4INC00L7QsdCw0LLQu9GP0LXRgiDQsiDQs9GA0YPQv9C/0YMg0L/QvtC70LjQs9C+0L3QvtCyINC90L7QstGL0Lkg0L/QvtC70LjQs9C+0L0gLSDQutCy0LDQtNGA0LDRgi5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtIVE1MQ2FudmFzRWxlbWVudH0gY2FudmFzINCe0LHRitC10LrRgi3QutCw0L3QstCw0YEg0L3QtdC+0LHRhdC+0LTQuNC8LCDRh9GC0L7QsdGLINC80LXRgtC+0LQg0LjQvNC10LtcbiAgICogICAgINCy0L7Qt9C80L7QttC90L7RgdGC0Ywg0L7QsdGA0LDRidCw0YLRjNGB0Y8g0Log0LzQsNGC0YDQuNGG0LUg0YLRgNCw0L3RgdGE0L7RgNC80LDRhtC40Lgg0Y3QutC30LXQvNC/0LvRj9GA0LAg0L3QtdC30LDQstC40YHQuNC80L4g0L7RglxuICAgKiAgICAg0YLQvtCz0L4sINC40Lcg0LrQsNC60L7Qs9C+INC80LXRgdGC0LAg0LHRi9C7INCy0YvQt9Cy0LDQvSDQvNC10YLQvtC0LiDQodGD0YnQtdGB0YLQstGD0LXRgiDQtNCy0LAg0LLQsNGA0LjQsNC90YLQsCDQstGL0LfQvtCy0LBcbiAgICogICAgINC80LXRgtC+0LTQsCAtINC40Lcg0LTRgNGD0LPQvtCz0L4g0LzQtdGC0L7QtNCwINGN0LrQt9C10LzQv9C70Y/RgNCwIChyZW5kZXIpINC4INC40Lcg0L7QsdGA0LDQsdC+0YLRh9C40LrQsCDRgdC+0LHRi9GC0LjRj1xuICAgKiAgICAg0LzRi9GI0LggKF9oYW5kbGVNb3VzZVdoZWVsKS4g0JLQviDQstGC0L7RgNC+0Lwg0LLQsNGA0LjQsNC90YLQtSDQuNGB0L/QvtC70YzQt9C+0LLQsNC90LjQtSDQvtCx0YrQtdC60YLQsCB0aGlzXG4gICAqICAgICDQvdC10LLQvtC30LzQvtC20L3Qvi5cbiAgICovXG4gIF91cGRhdGVUcmFuc01hdHJpeCgkdGhpczogU1Bsb3QpIHtcblxuICAgIGNvbnN0IHQxID0gJHRoaXMuY2FtZXJhLnpvb20gKiAkdGhpcy5fVVNFRlVMX0NPTlNUU1s1XTtcbiAgICBjb25zdCB0MiA9ICR0aGlzLmNhbWVyYS56b29tICogJHRoaXMuX1VTRUZVTF9DT05TVFNbNl07XG5cbiAgICAkdGhpcy5fdHJhbnNvcm1hdGlvbi5tYXRyaXggPSBbXG4gICAgICB0MSwgMCwgMCwgMCwgLXQyLCAwLCAtJHRoaXMuY2FtZXJhLnggKiB0MSAtIDEsICR0aGlzLmNhbWVyYS55ICogdDIgKyAxLCAxXG4gICAgXTtcbiAgfVxuXG4gIC8qKlxuICAgKiDQoNC10LDQs9C40YDRg9C10YIg0L3QsCDQtNCy0LjQttC10L3QuNC1INC80YvRiNC4L9GC0YDQtdC60L/QsNC00LAg0LIg0LzQvtC80LXQvdGCLCDQutC+0LPQtNCwINC10LUg0LrQu9Cw0LLQuNGI0LAg0YPQtNC10YDQttC40LLQsNC10YLRgdGPXG4gICAqINC90LDQttCw0YLQvtC5LiDQkiDRjdGC0L7RgiDQvNC+0LzQtdC90YIg0L7QsdC70LDRgdGC0Ywg0LLQuNC00LjQvNC+0YHRgtC4INC/0LXRgNC10LzQtdGJ0LDQtdGC0YHRjyDQvdCwINC/0LvQvtGB0LrQvtGB0YLQuCDQstC80LXRgdGC0LVcbiAgICog0YEg0LTQstC40LbQtdC90LjQtdC8INC80YvRiNC4L9GC0YDQtdC60L/QsNC00LAuINCS0YvRh9C40YHQu9C10L3QuNGPINCy0L3Rg9GC0YDQuCDRgdC+0LHRi9GC0LjRjyDRgdC00LXQu9Cw0L3RiyDQvNCw0LrRgdC40LzQsNC70YzQvdC+XG4gICAqINC/0YDQvtC40LfQstC+0LTQuNGC0LXQu9GM0L3Ri9C80Lgg0LIg0YPRidC10YDQsSDRh9C40YLQsNCx0LXQu9GM0L3QvtGB0YLQuCDQu9C+0LPQuNC60Lgg0L/RgNC+0LjQt9Cy0L7QtNC40LzRi9GFINC00LXQudGB0YLQstC40LkuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7TW91c2VFdmVudH0gZXZlbnQg0KHQvtCx0YvRgtC40LUg0LzRi9GI0Lgv0YLRgNC10LrQv9Cw0LTQsC5cbiAgICovXG4gIF9oYW5kbGVNb3VzZU1vdmUoZXZlbnQ6IE1vdXNlRXZlbnQpIHtcblxuICAgIC8vINCl0LDQuiDQv9C+0LvRg9GH0LXQvdC40Y8g0LTQvtGB0YLRg9C/0LAg0Log0L7QsdGK0LXQutGC0YMgdGhpcy5cbiAgICBjb25zdCAkdGhpcyA9IFNQbG90Lmluc3RhbmNlc1sgKGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudCkuaWQgXVxuXG4gICAgJHRoaXMuY2FtZXJhLnggPSAkdGhpcy5fdHJhbnNvcm1hdGlvbi5zdGFydENhbWVyYVggKyAkdGhpcy5fdHJhbnNvcm1hdGlvbi5zdGFydFBvc1ggLVxuICAgICAgKChldmVudC5jbGllbnRYIC0gJHRoaXMuX1VTRUZVTF9DT05TVFNbOV0pICogJHRoaXMuX1VTRUZVTF9DT05TVFNbN10gLSAxKSAqICR0aGlzLl90cmFuc29ybWF0aW9uLnN0YXJ0SW52TWF0cml4WzBdIC1cbiAgICAgICR0aGlzLl90cmFuc29ybWF0aW9uLnN0YXJ0SW52TWF0cml4WzZdO1xuXG4gICAgJHRoaXMuY2FtZXJhLnkgPSAkdGhpcy5fdHJhbnNvcm1hdGlvbi5zdGFydENhbWVyYVkgKyAkdGhpcy5fdHJhbnNvcm1hdGlvbi5zdGFydFBvc1kgLVxuICAgICAgKChldmVudC5jbGllbnRZIC0gJHRoaXMuX1VTRUZVTF9DT05TVFNbMTBdKSAqICR0aGlzLl9VU0VGVUxfQ09OU1RTWzhdICsgMSkgKiAkdGhpcy5fdHJhbnNvcm1hdGlvbi5zdGFydEludk1hdHJpeFs0XSAtXG4gICAgICAkdGhpcy5fdHJhbnNvcm1hdGlvbi5zdGFydEludk1hdHJpeFs3XTtcblxuICAgIC8vINCg0LXQvdC00LXRgNC40L3QsyDRgSDQvdC+0LLRi9C80Lgg0L/QsNGA0LDQvNC10YLRgNCw0LzQuCDQvtCx0LvQsNGB0YLQuCDQstC40LTQuNC80L7RgdGC0LguXG4gICAgJHRoaXMuX3JlbmRlcigpO1xuICB9XG5cbiAgLyoqXG4gICAqINCg0LXQsNCz0LjRgNGD0LXRgiDQvdCwINC90LDQttCw0YLQuNC1INC60LvQsNCy0LjRiNC4INC80YvRiNC4L9GC0YDQtdC60L/QsNC00LAuINCSINGN0YLQvtGCINC80L7QvNC10L3RgiDQt9Cw0L/Rg9GB0LrQsNC10YLRgdGPINCw0L3QsNC70LjQt1xuICAgKiDQtNCy0LjQttC10L3QuNGPINC80YvRiNC4L9GC0YDQtdC60L/QsNC00LAgKNGBINC30LDQttCw0YLQvtC5INC60LvQsNCy0LjRiNC10LkpLiDQktGL0YfQuNGB0LvQtdC90LjRjyDQstC90YPRgtGA0Lgg0YHQvtCx0YvRgtC40Y8g0YHQtNC10LvQsNC90YtcbiAgICog0LzQsNC60YHQuNC80LDQu9GM0L3QviDQv9GA0L7QuNC30LLQvtC00LjRgtC10LvRjNC90YvQvNC4INCyINGD0YnQtdGA0LEg0YfQuNGC0LDQsdC10LvRjNC90L7RgdGC0Lgg0LvQvtCz0LjQutC4INC/0YDQvtC40LfQstC+0LTQuNC80YvRhSDQtNC10LnRgdGC0LLQuNC5LlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge01vdXNlRXZlbnR9IGV2ZW50INCh0L7QsdGL0YLQuNC1INC80YvRiNC4L9GC0YDQtdC60L/QsNC00LAuXG4gICAqL1xuICBfaGFuZGxlTW91c2VEb3duKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG5cbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgLy8g0KXQsNC6INC/0L7Qu9GD0YfQtdC90LjRjyDQtNC+0YHRgtGD0L/QsCDQuiDQvtCx0YrQtdC60YLRgyB0aGlzLlxuICAgIGNvbnN0ICR0aGlzID0gU1Bsb3QuaW5zdGFuY2VzWyhldmVudC50YXJnZXQgYXMgSFRNTEVsZW1lbnQpLmlkXVxuXG4gICAgZXZlbnQudGFyZ2V0IS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCAkdGhpcy5faGFuZGxlTW91c2VNb3ZlIGFzIEV2ZW50TGlzdGVuZXIpO1xuICAgIGV2ZW50LnRhcmdldCEuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsICR0aGlzLl9oYW5kbGVNb3VzZVVwIGFzIEV2ZW50TGlzdGVuZXIpO1xuXG4gICAgJHRoaXMuX3RyYW5zb3JtYXRpb24uc3RhcnRJbnZNYXRyaXggPSBbXG4gICAgICAxIC8gJHRoaXMuX3RyYW5zb3JtYXRpb24ubWF0cml4WzBdLCAwLCAwLCAwLCAxIC8gJHRoaXMuX3RyYW5zb3JtYXRpb24ubWF0cml4WzRdLFxuICAgICAgMCwgLSR0aGlzLl90cmFuc29ybWF0aW9uLm1hdHJpeFs2XSAvICR0aGlzLl90cmFuc29ybWF0aW9uLm1hdHJpeFswXSxcbiAgICAgIC0kdGhpcy5fdHJhbnNvcm1hdGlvbi5tYXRyaXhbN10gLyAkdGhpcy5fdHJhbnNvcm1hdGlvbi5tYXRyaXhbNF0sIDFcbiAgICBdO1xuXG4gICAgJHRoaXMuX3RyYW5zb3JtYXRpb24uc3RhcnRDYW1lcmFYID0gJHRoaXMuY2FtZXJhLng7XG4gICAgJHRoaXMuX3RyYW5zb3JtYXRpb24uc3RhcnRDYW1lcmFZID0gJHRoaXMuY2FtZXJhLnk7XG5cbiAgICAkdGhpcy5fdHJhbnNvcm1hdGlvbi5zdGFydFBvc1ggPVxuICAgICAgKChldmVudC5jbGllbnRYIC0gJHRoaXMuX1VTRUZVTF9DT05TVFNbOV0pICogJHRoaXMuX1VTRUZVTF9DT05TVFNbN10gLSAxKSAqXG4gICAgICAkdGhpcy5fdHJhbnNvcm1hdGlvbi5zdGFydEludk1hdHJpeFswXSArICR0aGlzLl90cmFuc29ybWF0aW9uLnN0YXJ0SW52TWF0cml4WzZdO1xuXG4gICAgJHRoaXMuX3RyYW5zb3JtYXRpb24uc3RhcnRQb3NZID1cbiAgICAgICgoZXZlbnQuY2xpZW50WSAtICR0aGlzLl9VU0VGVUxfQ09OU1RTWzEwXSkgKiAkdGhpcy5fVVNFRlVMX0NPTlNUU1s4XSArIDEpICpcbiAgICAgICR0aGlzLl90cmFuc29ybWF0aW9uLnN0YXJ0SW52TWF0cml4WzRdICsgJHRoaXMuX3RyYW5zb3JtYXRpb24uc3RhcnRJbnZNYXRyaXhbN11cbiAgfVxuXG4gIC8qKlxuICAgKiDQoNC10LDQs9C40YDRg9C10YIg0L3QsCDQvtGC0LbQsNGC0LjQtSDQutC70LDQstC40YjQuCDQvNGL0YjQuC/RgtGA0LXQutC/0LDQtNCwLiDQkiDRjdGC0L7RgiDQvNC+0LzQtdC90YIg0LDQvdCw0LvQuNC3INC00LLQuNC20LXQvdC40Y9cbiAgICog0LzRi9GI0Lgv0YLRgNC10LrQv9Cw0LTQsCDRgSDQt9Cw0LbQsNGC0L7QuSDQutC70LDQstC40YjQtdC5INC/0YDQtdC60YDQsNGJ0LDQtdGC0YHRjy5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtNb3VzZUV2ZW50fSBldmVudCDQodC+0LHRi9GC0LjQtSDQvNGL0YjQuC/RgtGA0LXQutC/0LDQtNCwLlxuICAgKi9cbiAgX2hhbmRsZU1vdXNlVXAoZXZlbnQ6IE1vdXNlRXZlbnQpIHtcblxuICAgIC8vINCl0LDQuiDQv9C+0LvRg9GH0LXQvdC40Y8g0LTQvtGB0YLRg9C/0LAg0Log0L7QsdGK0LXQutGC0YMgdGhpcy5cbiAgICBjb25zdCAkdGhpcyA9IFNQbG90Lmluc3RhbmNlc1soZXZlbnQudGFyZ2V0IGFzIEhUTUxFbGVtZW50KS5pZF1cblxuICAgIGV2ZW50LnRhcmdldCEucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgJHRoaXMuX2hhbmRsZU1vdXNlTW92ZSBhcyBFdmVudExpc3RlbmVyKTtcbiAgICBldmVudC50YXJnZXQhLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCAkdGhpcy5faGFuZGxlTW91c2VVcCBhcyBFdmVudExpc3RlbmVyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDQoNC10LDQs9C40YDRg9C10YIg0L3QsCDQt9GD0LzQuNGA0L7QstCw0L3QuNC1INC80YvRiNC4L9GC0YDQtdC60L/QsNC00LAuINCSINGN0YLQvtGCINC80L7QvNC10L3RgiDQv9GA0L7QuNGB0YXQvtC00LjRgiDQt9GD0LzQuNGA0L7QstCw0L3QuNC1XG4gICAqINC60L7QvtGA0LTQuNC90LDRgtC90L7QuSDQv9C70L7RgdC60L7RgdGC0LguINCS0YvRh9C40YHQu9C10L3QuNGPINCy0L3Rg9GC0YDQuCDRgdC+0LHRi9GC0LjRjyDRgdC00LXQu9Cw0L3RiyDQvNCw0LrRgdC40LzQsNC70YzQvdC+XG4gICAqINC/0YDQvtC40LfQstC+0LTQuNGC0LXQu9GM0L3Ri9C80Lgg0LIg0YPRidC10YDQsSDRh9C40YLQsNCx0LXQu9GM0L3QvtGB0YLQuCDQu9C+0LPQuNC60Lgg0L/RgNC+0LjQt9Cy0L7QtNC40LzRi9GFINC00LXQudGB0YLQstC40LkuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7TW91c2VFdmVudH0gZXZlbnQg0KHQvtCx0YvRgtC40LUg0LzRi9GI0Lgv0YLRgNC10LrQv9Cw0LTQsC5cbiAgICovXG4gIF9oYW5kbGVNb3VzZVdoZWVsKGV2ZW50OiBXaGVlbEV2ZW50KSB7XG5cbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgLy8g0KXQsNC6INC/0L7Qu9GD0YfQtdC90LjRjyDQtNC+0YHRgtGD0L/QsCDQuiDQvtCx0YrQtdC60YLRgyB0aGlzLlxuICAgIGNvbnN0ICR0aGlzID0gU1Bsb3QuaW5zdGFuY2VzWyhldmVudC50YXJnZXQgYXMgSFRNTEVsZW1lbnQpLmlkXVxuXG4gICAgY29uc3QgY2xpcFggPSAoZXZlbnQuY2xpZW50WCAtICR0aGlzLl9VU0VGVUxfQ09OU1RTWzldKSAqICR0aGlzLl9VU0VGVUxfQ09OU1RTWzddIC0gMTtcbiAgICBjb25zdCBjbGlwWSA9IChldmVudC5jbGllbnRZIC0gJHRoaXMuX1VTRUZVTF9DT05TVFNbMTBdKSAqICR0aGlzLl9VU0VGVUxfQ09OU1RTWzhdICsgMTtcblxuICAgIGNvbnN0IHByZVpvb21YID0gKGNsaXBYIC0gJHRoaXMuX3RyYW5zb3JtYXRpb24ubWF0cml4WzZdKSAvICR0aGlzLl90cmFuc29ybWF0aW9uLm1hdHJpeFswXTtcbiAgICBjb25zdCBwcmVab29tWSA9IChjbGlwWSAtICR0aGlzLl90cmFuc29ybWF0aW9uLm1hdHJpeFs3XSkgLyAkdGhpcy5fdHJhbnNvcm1hdGlvbi5tYXRyaXhbNF07XG5cbiAgICBjb25zdCBuZXdab29tID0gJHRoaXMuY2FtZXJhLnpvb20gKiBNYXRoLnBvdygyLCBldmVudC5kZWx0YVkgKiAtMC4wMSk7XG4gICAgJHRoaXMuY2FtZXJhLnpvb20gPSBNYXRoLm1heCgwLjAwMiwgTWF0aC5taW4oMjAwLCBuZXdab29tKSk7XG5cbiAgICAkdGhpcy5fdXBkYXRlVHJhbnNNYXRyaXgoJHRoaXMpO1xuXG4gICAgY29uc3QgcG9zdFpvb21YID0gKGNsaXBYIC0gJHRoaXMuX3RyYW5zb3JtYXRpb24ubWF0cml4WzZdKSAvICR0aGlzLl90cmFuc29ybWF0aW9uLm1hdHJpeFswXTtcbiAgICBjb25zdCBwb3N0Wm9vbVkgPSAoY2xpcFkgLSAkdGhpcy5fdHJhbnNvcm1hdGlvbi5tYXRyaXhbN10pIC8gJHRoaXMuX3RyYW5zb3JtYXRpb24ubWF0cml4WzRdO1xuXG4gICAgJHRoaXMuY2FtZXJhLnggKz0gKHByZVpvb21YIC0gcG9zdFpvb21YKTtcbiAgICAkdGhpcy5jYW1lcmEueSArPSAocHJlWm9vbVkgLSBwb3N0Wm9vbVkpO1xuXG4gICAgLy8g0KDQtdC90LTQtdGA0LjQvdCzINGBINC90L7QstGL0LzQuCDQv9Cw0YDQsNC80LXRgtGA0LDQvNC4INC+0LHQu9Cw0YHRgtC4INCy0LjQtNC40LzQvtGB0YLQuC5cbiAgICAkdGhpcy5fcmVuZGVyKCk7XG4gIH1cblxuICAvKipcbiAgICog0KDQuNGB0YPQtdGCINC/0LvQvtGB0LrQvtGB0YLRjCDQsiDRgdC+0L7RgtCy0LXRgtGB0YLQstC40Lgg0YEg0YLQtdC60YPRidC40LzQuCDQv9Cw0YDQsNC80LXRgtGA0LDQvNC4INC+0LHQu9Cw0YHRgtC4INCy0LjQtNC40LzQvtGB0YLQuC5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9yZW5kZXIoKSB7XG5cbiAgICAvLyDQntGH0LjRgdGC0LrQsCDQvtCx0YrQtdC60YLQsCDRgNC10L3QtNC10YDQuNC90LPQsCBXZWJHTC5cbiAgICB0aGlzLl9nbC5jbGVhcih0aGlzLl9nbC5DT0xPUl9CVUZGRVJfQklUKTtcblxuICAgIC8vINCe0LHQvdC+0LLQu9C10L3QuNC1INC80LDRgtGA0LjRhtGLINGC0YDQsNC90YHRhNC+0YDQvNCw0YbQuNC4LlxuICAgIHRoaXMuX3VwZGF0ZVRyYW5zTWF0cml4KHRoaXMpO1xuXG4gICAgLy8g0J/RgNC40LLRj9C30LrQsCDQvNCw0YLRgNC40YbRiyDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuCDQuiDQv9C10YDQtdC80LXQvdC90L7QuSDRiNC10LnQtNC10YDQsC5cbiAgICB0aGlzLl9nbC51bmlmb3JtTWF0cml4M2Z2KHRoaXMuX3ZhcmlhYmxlc1sndV9tYXRyaXgnXSwgZmFsc2UsIHRoaXMuX3RyYW5zb3JtYXRpb24ubWF0cml4KTtcblxuICAgIC8vINCY0YLQtdGA0LjRgNC+0LLQsNC90LjQtSDQuCDRgNC10L3QtNC10YDQuNC90LMg0LLRgdC10YUg0LHRg9GE0LXRgNC+0LIgV2ViR0wuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9idWZmZXJzLmFtb3VudE9mQnVmZmVyR3JvdXBzOyBpKyspIHtcblxuICAgICAgLy8g0KPRgdGC0LDQvdC+0LLQutCwINGC0LXQutGD0YnQtdCz0L4g0LHRg9GE0LXRgNCwINCy0LXRgNGI0LjQvSDQuCDQtdCz0L4g0L/RgNC40LLRj9C30LrQsCDQuiDQv9C10YDQtdC80LXQvdC90L7QuSDRiNC10LnQtNC10YDQsC5cbiAgICAgIHRoaXMuX2dsLmJpbmRCdWZmZXIodGhpcy5fZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLl9idWZmZXJzLnZlcnRleEJ1ZmZlcnNbaV0pO1xuICAgICAgdGhpcy5fZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkodGhpcy5fdmFyaWFibGVzWydhX3Bvc2l0aW9uJ10pO1xuICAgICAgdGhpcy5fZ2wudmVydGV4QXR0cmliUG9pbnRlcih0aGlzLl92YXJpYWJsZXNbJ2FfcG9zaXRpb24nXSxcbiAgICAgICAgMiwgdGhpcy5fZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKTtcblxuICAgICAgLy8g0KPRgdGC0LDQvdC+0LLQutCwINGC0LXQutGD0YnQtdCz0L4g0LHRg9GE0LXRgNCwINGG0LLQtdGC0L7QsiDQstC10YDRiNC40L0g0Lgg0LXQs9C+INC/0YDQuNCy0Y/Qt9C60LAg0Log0L/QtdGA0LXQvNC10L3QvdC+0Lkg0YjQtdC50LTQtdGA0LAuXG4gICAgICB0aGlzLl9nbC5iaW5kQnVmZmVyKHRoaXMuX2dsLkFSUkFZX0JVRkZFUiwgdGhpcy5fYnVmZmVycy5jb2xvckJ1ZmZlcnNbaV0pO1xuICAgICAgdGhpcy5fZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkodGhpcy5fdmFyaWFibGVzWydhX2NvbG9yJ10pO1xuICAgICAgdGhpcy5fZ2wudmVydGV4QXR0cmliUG9pbnRlcih0aGlzLl92YXJpYWJsZXNbJ2FfY29sb3InXSxcbiAgICAgICAgMSwgdGhpcy5fZ2wuVU5TSUdORURfQllURSwgZmFsc2UsIDAsIDApO1xuXG4gICAgICAvLyDQo9GB0YLQsNC90L7QstC60LAg0YLQtdC60YPRidC10LPQviDQsdGD0YTQtdGA0LAg0LjQvdC00LXQutGB0L7QsiDQstC10YDRiNC40L0uXG4gICAgICB0aGlzLl9nbC5iaW5kQnVmZmVyKHRoaXMuX2dsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCB0aGlzLl9idWZmZXJzLmluZGV4QnVmZmVyc1tpXSk7XG5cbiAgICAgIC8vINCe0YLRgNC40YHQvtCy0LrQsCDRgtC10LrRg9GJ0LjRhSDQsdGD0YTQtdGA0L7Qsi5cbiAgICAgIHRoaXMuX2dsLmRyYXdFbGVtZW50cyh0aGlzLl9nbC5UUklBTkdMRVMsIHRoaXMuX2J1ZmZlcnMuYW1vdW50T2ZHTFZlcnRpY2VzW2ldLFxuICAgICAgICB0aGlzLl9nbC5VTlNJR05FRF9TSE9SVCwgMCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqINCT0LXQvdC10YDQuNGA0YPQtdGCINGB0LvRg9GH0LDQudC90L7QtSDRhtC10LvQvtC1INGH0LjRgdC70L4g0LIg0LTQuNCw0L/QsNC30L7QvdC1INC+0YIgMCDQtNC+INC30LDQtNCw0L3QvdC+0LPQviDQv9GA0LXQtNC10LvQsC4g0KHQsNC8XG4gICAqINC/0YDQtdC00LXQuyDQsiDQtNC40LDQv9Cw0LfQvtC9INC90LUg0LLRhdC+0LTQuNGCOiBbMC4uLnJhbmdlLTFdLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge251bWJlcn0gcmFuZ2Ug0JLQtdGA0YXQvdC40Lkg0L/RgNC10LTQtdC7INC00LjQsNC/0LDQt9C+0L3QsCDRgdC70YPRh9Cw0LnQvdC+0LPQviDQstGL0LHQvtGA0LAuXG4gICAqIEByZXR1cm4ge251bWJlcn0g0KHQs9C10L3QtdGA0LjRgNC+0LLQsNC90L3QvtC1INGB0LvRg9GH0LDQudC90L7QtSDRh9C40YHQu9C+LlxuICAgKi9cbiAgX3JhbmRvbUludChyYW5nZTogbnVtYmVyKSB7XG4gICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHJhbmdlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDQodC70YPRh9Cw0LnQvdGL0Lwg0L7QsdGA0LDQt9C+0Lwg0LLQvtC30LLRgNCw0YnQsNC10YIg0L7QtNC40L0g0LjQtyDQuNC90LTQtdC60YHQvtCyINGH0LjRgdC70L7QstC+0LPQviDQvtC00L3QvtC80LXRgNC90L7Qs9C+INC80LDRgdGB0LjQstCwLlxuICAgKiDQndC10YHQvNC+0YLRgNGPINC90LAg0YHQu9GD0YfQsNC50L3QvtGB0YLRjCDQutCw0LbQtNC+0LPQviDQutC+0L3QutGA0LXRgtC90L7Qs9C+INCy0YvQt9C+0LLQsCDRhNGD0L3QutGG0LjQuCwg0LjQvdC00LXQutGB0Ysg0LLQvtC30LLRgNCw0YnQsNGO0YLRgdGPXG4gICAqINGBINC/0YDQtdC00L7Qv9GA0LXQtNC10LvQtdC90L3QvtC5INGH0LDRgdGC0L7RgtC+0LkuINCn0LDRgdGC0L7RgtCwIFwi0LLRi9C/0LDQtNCw0L3QuNC5XCIg0LjQvdC00LXQutGB0L7QsiDQt9Cw0LTQsNC10YLRgdGPINGB0L7QvtGC0LLQtdGC0YHRgtCy0YPRjtGJ0LjQvNC4XG4gICAqINC30L3QsNGH0LXQvdC40Y/QvNC4INGN0LvQtdC80LXQvdGC0L7Qsi4g0J/RgNC40LzQtdGAOiDQndCwINC80LDRgdGB0LjQstC1IFszLCAyLCA1XSDRhNGD0L3QutGG0LjRjyDQsdGD0LTQtdGCINCy0L7Qt9Cy0YDQsNGJ0LDRgtGMXG4gICAqINC40L3QtNC10LrRgSAwINGBINGH0LDRgdGC0L7RgtC+0LkgPSAzLygzKzIrNSkgPSAzLzEwLCDQuNC90LTQtdC60YEgMSDRgSDRh9Cw0YHRgtC+0YLQvtC5ID0gMi8oMysyKzUpID0gMi8xMCxcbiAgICog0LjQvdC00LXQutGBIDIg0YEg0YfQsNGB0YLQvtGC0L7QuSA9IDUvKDMrMis1KSA9IDUvMTAuXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7QXJyYXkuPG51bWJlcj59IGFyciDQp9C40YHQu9C+0LLQvtC5INC+0LTQvdC+0LzQtdGA0L3Ri9C5INC80LDRgdGB0LjQsiwg0LjQvdC00LXQutGB0Ysg0LrQvtGC0L7RgNC+0LPQviDQsdGD0LTRg9GCXG4gICAqICAgICDQstC+0LfQstGA0LDRidCw0YLRjNGB0Y8g0YEg0L/RgNC10LTQvtC/0YDQtdC00LXQu9C10L3QvdC+0Lkg0YfQsNGB0YLQvtGC0L7QuS5cbiAgICogQHJldHVybiB7bnVtYmVyfSDQodC70YPRh9Cw0LnQvdGL0Lkg0LjQvdC00LXQutGBINC40Lcg0LzQsNGB0YHQuNCy0LAgYXJyLlxuICAgKi9cbiAgX3JhbmRvbVF1b3RhSW5kZXgoYXJyOiBudW1iZXJbXSkge1xuXG4gICAgbGV0IGEgPSBbXTtcbiAgICBhWzBdID0gYXJyWzBdO1xuXG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgIGFbaV0gPSBhW2kgLSAxXSArIGFycltpXTtcbiAgICB9XG5cbiAgICBjb25zdCBsYXN0SW5kZXggPSBhLmxlbmd0aCAtIDE7XG5cbiAgICBsZXQgciA9IE1hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkgKiBhW2xhc3RJbmRleF0pKSArIDE7XG4gICAgbGV0IFtsLCBoXSA9IFswLCBsYXN0SW5kZXhdO1xuXG4gICAgd2hpbGUgKGwgPCBoKSB7XG4gICAgICBjb25zdCBtID0gbCArICgoaCAtIGwpID4+IDEpO1xuICAgICAgKHIgPiBhW21dKSA/IChsID0gbSArIDEpIDogKGggPSBtKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKGFbbF0gPj0gcikgPyBsIDogLTE7XG4gIH1cblxuICAvKipcbiAgICog0JjQvNC40YLQuNGA0YPQtdGCINC40YLQtdGA0LjRgNC+0LLQsNC90LjQtSDQuNGB0YXQvtC00L3Ri9GFINC+0LHRitC10LrRgtC+0LIuINCf0YDQuCDQutCw0LbQtNC+0Lwg0L3QvtCy0L7QvCDQstGL0LfQvtCy0LUg0LLQvtC30LLRgNCw0YnQsNC10YJcbiAgICog0LjQvdGE0L7RgNC80LDRhtC40Y4g0L4g0L/QvtC70LjQs9C+0L3QtSDRgdC+INGB0LvRg9GH0LDQvdGL0Lwg0L/QvtC70L7QttC10L3QuNC10LwsINGB0LvRg9GH0LDQudC90L7QuSDRhNC+0YDQvNC+0Lkg0Lgg0YHQu9GD0YfQsNC50L3Ri9C8INGG0LLQtdGC0L7QvC5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHJldHVybiB7KFNQbG90UG9seWdvbnxudWxsKX0g0JjQvdGE0L7RgNC80LDRhtC40Y8g0L4g0L/QvtC70LjQs9C+0L3QtSDQuNC70LggbnVsbCwg0LXRgdC70Lgg0L/QtdGA0LXQsdC+0YBcbiAgICogICAgINC40YHRhdC+0LTQvdGL0YUg0L7QsdGK0LXQutGC0L7QsiDQt9Cw0LrQvtC90YfQuNC70YHRjy5cbiAgICovXG4gIF9kZW1vSXRlcmF0aW9uQ2FsbGJhY2soKSB7XG4gICAgaWYgKHRoaXMuZGVtb01vZGUuaW5kZXghIDwgdGhpcy5kZW1vTW9kZS5hbW91bnQhKSB7XG4gICAgICB0aGlzLmRlbW9Nb2RlLmluZGV4ISArKztcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHg6IHRoaXMuX3JhbmRvbUludCh0aGlzLmdyaWRTaXplLndpZHRoKSxcbiAgICAgICAgeTogdGhpcy5fcmFuZG9tSW50KHRoaXMuZ3JpZFNpemUuaGVpZ2h0KSxcbiAgICAgICAgc2hhcGU6IHRoaXMuX3JhbmRvbVF1b3RhSW5kZXgodGhpcy5kZW1vTW9kZS5zaGFwZVF1b3RhISksXG4gICAgICAgIGNvbG9yOiB0aGlzLl9yYW5kb21JbnQodGhpcy5wb2x5Z29uUGFsZXR0ZS5sZW5ndGgpXG4gICAgICB9XG4gICAgfVxuICAgIGVsc2VcbiAgICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqINCX0LDQv9GD0YHQutCw0LXRgiDRgNC10L3QtNC10YDQuNC90LMg0LggXCLQv9GA0L7RgdC70YPRiNC60YNcIiDRgdC+0LHRi9GC0LjQuSDQvNGL0YjQuCDQvdCwINC60LDQvdCy0LDRgdC1LlxuICAgKlxuICAgKiBAcHVibGljXG4gICAqL1xuICBydW4oKSB7XG4gICAgaWYgKCF0aGlzLl9pc1J1bm5pbmcpIHtcblxuICAgICAgdGhpcy5fY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMuX2hhbmRsZU1vdXNlRG93bik7XG4gICAgICB0aGlzLl9jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignd2hlZWwnLCB0aGlzLl9oYW5kbGVNb3VzZVdoZWVsKTtcblxuICAgICAgdGhpcy5fcmVuZGVyKCk7XG5cbiAgICAgIHRoaXMuX2lzUnVubmluZyA9IHRydWU7XG4gICAgfVxuXG4gICAgLy8g0JLRi9Cy0L7QtCDQvtGC0LvQsNC00L7Rh9C90L7QuSDQuNC90YTQvtGA0LzQsNGG0LjQuC5cbiAgICBpZiAodGhpcy5kZWJ1Z01vZGUuaXNFbmFibGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKCclY9Cg0LXQvdC00LXRgNC40L3QsyDQt9Cw0L/Rg9GJ0LXQvScsIHRoaXMuX2RlYnVnU3R5bGUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDQntGB0YLQsNC90LDQstC70LjQstCw0LXRgiDRgNC10L3QtNC10YDQuNC90LMg0LggXCLQv9GA0L7RgdC70YPRiNC60YNcIiDRgdC+0LHRi9GC0LjQuSDQvNGL0YjQuCDQvdCwINC60LDQvdCy0LDRgdC1LlxuICAgKlxuICAgKiBAcHVibGljXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gY2xlYXIg0J/RgNC40LfQvdCw0Log0L3QtdC+0L7QsdGF0L7QtNC40LzQvtGB0YLQuCDQstC80LXRgdGC0LUg0YEg0L7RgdGC0LDQvdC+0LLQutC+0Lkg0YDQtdC90LTQtdGA0LjQvdCz0LBcbiAgICogICAgINC+0YfQuNGB0YLQuNGC0Ywg0LrQsNC90LLQsNGBLiDQl9C90LDRh9C10L3QuNC1IHRydWUg0L7Rh9C40YnQsNC10YIg0LrQsNC90LLQsNGBLCDQt9C90LDRh9C10L3QuNC1IGZhbHNlIC0g0L3QtSDQvtGH0LjRidCw0LXRgi5cbiAgICogICAgINCf0L4g0YPQvNC+0LvRh9Cw0L3QuNGOINC+0YfQuNGB0YLQutCwINC90LUg0L/RgNC+0LjRgdGF0L7QtNC40YIuXG4gICAqL1xuICBzdG9wKGNsZWFyID0gZmFsc2UpIHtcblxuICAgIGlmICh0aGlzLl9pc1J1bm5pbmcpIHtcblxuICAgICAgdGhpcy5fY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMuX2hhbmRsZU1vdXNlRG93bik7XG4gICAgICB0aGlzLl9jYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcignd2hlZWwnLCB0aGlzLl9oYW5kbGVNb3VzZVdoZWVsKTtcbiAgICAgIHRoaXMuX2NhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLl9oYW5kbGVNb3VzZU1vdmUpO1xuICAgICAgdGhpcy5fY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLl9oYW5kbGVNb3VzZVVwKTtcblxuICAgICAgaWYgKGNsZWFyKSB7XG4gICAgICAgIHRoaXMuY2xlYXIoKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5faXNSdW5uaW5nID0gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8g0JLRi9Cy0L7QtCDQvtGC0LvQsNC00L7Rh9C90L7QuSDQuNC90YTQvtGA0LzQsNGG0LjQuC5cbiAgICBpZiAodGhpcy5kZWJ1Z01vZGUuaXNFbmFibGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKCclY9Cg0LXQvdC00LXRgNC40L3QsyDQvtGB0YLQsNC90L7QstC70LXQvScsIHRoaXMuX2RlYnVnU3R5bGUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDQntGH0LjRidCw0LXRgiDQutCw0L3QstCw0YEsINC30LDQutGA0LDRiNC40LLQsNGPINC10LPQviDQsiDRhNC+0L3QvtCy0YvQuSDRhtCy0LXRgi5cbiAgICpcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgY2xlYXIoKSB7XG5cbiAgICB0aGlzLl9nbC5jbGVhcih0aGlzLl9nbC5DT0xPUl9CVUZGRVJfQklUKTtcblxuICAgIC8vINCS0YvQstC+0LQg0L7RgtC70LDQtNC+0YfQvdC+0Lkg0LjQvdGE0L7RgNC80LDRhtC40LguXG4gICAgaWYgKHRoaXMuZGVidWdNb2RlLmlzRW5hYmxlKSB7XG4gICAgICBjb25zb2xlLmxvZygnJWPQmtC+0L3RgtC10LrRgdGCINGA0LXQvdC00LXRgNC40L3Qs9CwINC+0YfQuNGJ0LXQvSBbJyArIHRoaXMuYmdDb2xvciArICddJywgdGhpcy5fZGVidWdTdHlsZSk7XG4gICAgfVxuICB9XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9pbmRleC50c1wiKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=