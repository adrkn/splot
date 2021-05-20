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
var utils_1 = __webpack_require__(/*! ./utils */ "./utils.ts");
var splot_1 = __importDefault(__webpack_require__(/*! ./splot */ "./splot.ts"));
__webpack_require__(/*! @/style */ "./style.css");
var i = 0;
var n = 1000000; // Имитируемое число объектов.
var colors = ['#D81C01', '#E9967A', '#BA55D3', '#FFD700', '#FFE4B5', '#FF8C00', '#228B22', '#90EE90', '#4169E1', '#00BFFF', '#8B4513', '#00CED1'];
var plotWidth = 32000;
var plotHeight = 16000;
// Пример итерирующей функции. Итерации имитируются случайными выдачами. Почти также работает режим демо-данных.
function readNextObject() {
    if (i < n) {
        i++;
        return {
            x: utils_1.randomInt(plotWidth),
            y: utils_1.randomInt(plotHeight),
            shape: utils_1.randomInt(2),
            size: 10 + utils_1.randomInt(21),
            color: utils_1.randomInt(colors.length), // Индекс цвета в массиве цветов
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
    iterator: readNextObject,
    colors: colors,
    grid: {
        width: plotWidth,
        height: plotHeight,
    },
    debug: {
        isEnable: true,
    },
    demo: {
        isEnable: true
    }
});
scatterPlot.run();
//scatterPlot.stop()
//setTimeout(() => scatterPlot.stop(), 3000)


/***/ }),

/***/ "./shader-code-frag-tmpl.ts":
/*!**********************************!*\
  !*** ./shader-code-frag-tmpl.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.default = "\nprecision lowp float;\nvarying vec3 v_color;\nvarying float v_shape;\nvoid main() {\n  if (v_shape == 0.0) {\n    float vSize = 20.0;\n    float distance = length(2.0 * gl_PointCoord - 1.0);\n    if (distance > 1.0) { discard; };\n    gl_FragColor = vec4(v_color.rgb, 1.0);\n  }\n  else if (v_shape == 1.0) {\n    gl_FragColor = vec4(v_color.rgb, 1.0);\n  }\n}\n";
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

/***/ "./shader-code-vert-tmpl.ts":
/*!**********************************!*\
  !*** ./shader-code-vert-tmpl.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.default = "\nattribute vec2 a_position;\nattribute float a_color;\nattribute float a_size;\nattribute float a_shape;\nuniform mat3 u_matrix;\nvarying vec3 v_color;\nvarying float v_shape;\nvoid main() {\n  gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0.0, 1.0);\n  gl_PointSize = a_size;\n  v_shape = a_shape;\n  {EXT-CODE}\n}\n";


/***/ }),

/***/ "./splot-control.ts":
/*!**************************!*\
  !*** ./splot-control.ts ***!
  \**************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
// @ts-ignore
var m3_1 = __importDefault(__webpack_require__(/*! ./m3 */ "./m3.js"));
var SPlotContol = /** @class */ (function () {
    function SPlotContol() {
        // Техническая информация, используемая приложением для расчета трансформаций.
        this.transform = {
            viewProjectionMat: [],
            startInvViewProjMat: [],
            startCamera: { x: 0, y: 0, zoom: 1 },
            startPos: [],
            startClipPos: [],
            startMousePos: []
        };
        this.handleMouseDownWithContext = this.handleMouseDown.bind(this);
        this.handleMouseWheelWithContext = this.handleMouseWheel.bind(this);
        this.handleMouseMoveWithContext = this.handleMouseMove.bind(this);
        this.handleMouseUpWithContext = this.handleMouseUp.bind(this);
    }
    SPlotContol.prototype.prepare = function (splot) {
        this.canvas = splot.webgl.canvas;
        this.camera = splot.camera;
        this.render = splot.render.bind(splot);
    };
    SPlotContol.prototype.run = function () {
        this.canvas.addEventListener('mousedown', this.handleMouseDownWithContext);
        this.canvas.addEventListener('wheel', this.handleMouseWheelWithContext);
    };
    SPlotContol.prototype.stop = function () {
        this.canvas.removeEventListener('mousedown', this.handleMouseDownWithContext);
        this.canvas.removeEventListener('wheel', this.handleMouseWheelWithContext);
        this.canvas.removeEventListener('mousemove', this.handleMouseMoveWithContext);
        this.canvas.removeEventListener('mouseup', this.handleMouseUpWithContext);
    };
    SPlotContol.prototype.makeCameraMatrix = function () {
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
    SPlotContol.prototype.updateViewProjection = function () {
        var projectionMat = m3_1.default.projection(this.canvas.width, this.canvas.height);
        var cameraMat = this.makeCameraMatrix();
        var viewMat = m3_1.default.inverse(cameraMat);
        this.transform.viewProjectionMat = m3_1.default.multiply(projectionMat, viewMat);
    };
    /**
     *
     */
    SPlotContol.prototype.getClipSpaceMousePosition = function (event) {
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
    SPlotContol.prototype.moveCamera = function (event) {
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
    SPlotContol.prototype.handleMouseMove = function (event) {
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
    SPlotContol.prototype.handleMouseUp = function (event) {
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
    SPlotContol.prototype.handleMouseDown = function (event) {
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
    SPlotContol.prototype.handleMouseWheel = function (event) {
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
    return SPlotContol;
}());
exports.default = SPlotContol;


/***/ }),

/***/ "./splot-debug.ts":
/*!************************!*\
  !*** ./splot-debug.ts ***!
  \************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var utils_1 = __webpack_require__(/*! ./utils */ "./utils.ts");
/**
 * Тип для параметров режима отладки.
 *
 * @param isEnable - Признак включения отладочного режима.
 * @param headerStyle - Стиль для заголовка всего отладочного блока.
 * @param groupStyle - Стиль для заголовка группировки отладочных данных.
 *
 * @todo Реализовать дополнительные места вывода output: 'console' | 'document' | 'file'
 */
var SPlotDebug = /** @class */ (function () {
    function SPlotDebug(splot) {
        this.splot = splot;
        this.isEnable = false;
        this.headerStyle = 'font-weight: bold; color: #ffffff; background-color: #cc0000;';
        this.groupStyle = 'font-weight: bold; color: #ffffff;';
        this.canvas = undefined;
    }
    /** Подготовка к использованию отладочного режима. */
    SPlotDebug.prototype.prepare = function (canvas) {
        this.canvas = canvas;
    };
    SPlotDebug.prototype.logIntro = function () {
        console.log('%cОтладка SPlot на объекте #' + this.canvas.id, this.headerStyle);
        if (this.splot.demo.isEnable) {
            console.log('%cВключен демонстрационный режим данных', this.groupStyle);
        }
        console.group('%cПредупреждение', this.groupStyle);
        console.log('Открытая консоль браузера и другие активные средства контроля разработки существенно снижают производительность высоконагруженных приложений. Для объективного анализа производительности все подобные средства должны быть отключены, а консоль браузера закрыта. Некоторые данные отладочной информации в зависимости от используемого браузера могут не отображаться или отображаться некорректно. Средство отладки протестировано в браузере Google Chrome v.90');
        console.groupEnd();
    };
    SPlotDebug.prototype.logGpuInfo = function (hardware, software) {
        console.group('%cВидеосистема', this.groupStyle);
        console.log('Графическая карта: ' + hardware);
        console.log('Версия GL: ' + software);
        console.groupEnd();
    };
    SPlotDebug.prototype.logInstanceInfo = function (splot, canvas, options) {
        console.group('%cНастройка параметров экземпляра', this.groupStyle);
        console.dir(splot);
        console.log('Пользовательские настройки:\n', utils_1.jsonStringify(options));
        console.log('Канвас: #' + canvas.id);
        console.log('Размер канваса: ' + canvas.width + ' x ' + canvas.height + ' px');
        console.log('Размер плоскости: ' + splot.grid.width + ' x ' + splot.grid.height + ' px');
        if (splot.demo.isEnable) {
            console.log('Способ получения данных: ' + 'демо-данные');
        }
        else {
            console.log('Способ получения данных: ' + 'итерирование');
        }
        console.groupEnd();
    };
    SPlotDebug.prototype.logShaderInfo = function (shaderType, shaderCode) {
        console.group('%cСоздан шейдер [' + shaderType + ']', this.groupStyle);
        console.log(shaderCode);
        console.groupEnd();
    };
    SPlotDebug.prototype.logDataLoadingStart = function () {
        console.log('%cЗапущен процесс загрузки данных [' + utils_1.getCurrentTime() + ']...', this.groupStyle);
        console.time('Длительность');
    };
    SPlotDebug.prototype.logDataLoadingComplete = function (counter, limit) {
        console.group('%cЗагрузка данных завершена [' + utils_1.getCurrentTime() + ']', this.groupStyle);
        console.timeEnd('Длительность');
        console.log('Кол-во объектов: ' + counter.toLocaleString());
        console.log('Результат: ' +
            ((counter >= limit) ?
                'достигнут заданный лимит (' + limit.toLocaleString() + ')' :
                'обработаны все объекты'));
        console.groupEnd();
    };
    SPlotDebug.prototype.logGpuMemStats = function (stats) {
        console.group('%cРасход видеопамяти: ' + (stats.memUsage / 1000000).toFixed(2).toLocaleString() + ' МБ', this.groupStyle);
        /*console.log('Кол-во групп буферов: ' + stats.groupsCount.toLocaleString())
        console.log('Кол-во GL-треугольников: ' + (buffers.amountOfTotalGLVertices / 3).toLocaleString())
        console.log('Кол-во вершин: ' + stats.objectsCountTotal.toLocaleString())*/
        console.groupEnd();
    };
    SPlotDebug.prototype.logRenderStarted = function () {
        console.log('%cРендеринг запущен', this.groupStyle);
    };
    SPlotDebug.prototype.logRenderStoped = function () {
        console.log('%cРендеринг остановлен', this.groupStyle);
    };
    SPlotDebug.prototype.logCanvasCleared = function (color) {
        console.log('%cКонтекст рендеринга очищен [' + color + ']', this.groupStyle);
    };
    return SPlotDebug;
}());
exports.default = SPlotDebug;


/***/ }),

/***/ "./splot-demo.ts":
/*!***********************!*\
  !*** ./splot-demo.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var utils_1 = __webpack_require__(/*! ./utils */ "./utils.ts");
var SPlotDemo = /** @class */ (function () {
    function SPlotDemo(splot) {
        this.splot = splot;
        /** Признак активации демо-режима. */
        this.isEnable = false;
        /** Количество бъектов. */
        this.amount = 1000000;
        /** Минимальный размер объектов. */
        this.sizeMin = 10;
        /** Максимальный размер объектов. */
        this.sizeMax = 30;
        /** Цветовая палитра объектов. */
        this.colors = [
            '#D81C01', '#E9967A', '#BA55D3', '#FFD700', '#FFE4B5', '#FF8C00',
            '#228B22', '#90EE90', '#4169E1', '#00BFFF', '#8B4513', '#00CED1'
        ];
        /** Счетчик итерируемых объектов. */
        this.index = 0;
    }
    /** Подготовка к использованию демо-режима. */
    SPlotDemo.prototype.prepare = function () {
        this.index = 0;
    };
    /** Имитация итератора исходных объектов. */
    SPlotDemo.prototype.iterator = function () {
        if (this.index < this.amount) {
            this.index++;
            return {
                x: utils_1.randomInt(this.splot.grid.width),
                y: utils_1.randomInt(this.splot.grid.height),
                shape: utils_1.randomInt(this.splot.shapesCount),
                size: this.sizeMin + utils_1.randomInt(this.sizeMax - this.sizeMin + 1),
                color: utils_1.randomInt(this.colors.length)
            };
        }
        else {
            return null;
        }
    };
    return SPlotDemo;
}());
exports.default = SPlotDemo;


/***/ }),

/***/ "./splot-webgl.ts":
/*!************************!*\
  !*** ./splot-webgl.ts ***!
  \************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var utils_1 = __webpack_require__(/*! ./utils */ "./utils.ts");
var SPlotWebGl = /** @class */ (function () {
    function SPlotWebGl() {
        this.alpha = false;
        this.depth = false;
        this.stencil = false;
        this.antialias = false;
        this.desynchronized = false;
        this.premultipliedAlpha = false;
        this.preserveDrawingBuffer = false;
        this.failIfMajorPerformanceCaveat = false;
        this.powerPreference = 'high-performance';
        this.gpu = { hardware: '', software: '' };
        this.variables = new Map();
        this.data = new Map();
        this.glNumberTypes = new Map();
    }
    SPlotWebGl.prototype.prepare = function (canvasId) {
        if (document.getElementById(canvasId)) {
            this.canvas = document.getElementById(canvasId);
        }
        else {
            throw new Error('Канвас с идентификатором "#' + canvasId + '" не найден!');
        }
    };
    /**
     * Создает контекст рендеринга WebGL и устанавливает корректный размер области просмотра.
     */
    SPlotWebGl.prototype.create = function () {
        this.gl = this.canvas.getContext('webgl', {
            alpha: this.alpha,
            depth: this.depth,
            stencil: this.stencil,
            antialias: this.antialias,
            desynchronized: this.desynchronized,
            premultipliedAlpha: this.premultipliedAlpha,
            preserveDrawingBuffer: this.preserveDrawingBuffer,
            failIfMajorPerformanceCaveat: this.failIfMajorPerformanceCaveat,
            powerPreference: this.powerPreference
        });
        var ext = this.gl.getExtension('WEBGL_debug_renderer_info');
        this.gpu.hardware = (ext) ? this.gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : '[неизвестно]';
        this.gpu.software = this.gl.getParameter(this.gl.VERSION);
        this.glNumberTypes.set('Float32Array', this.gl.FLOAT);
        this.glNumberTypes.set('Uint8Array', this.gl.UNSIGNED_BYTE);
        this.glNumberTypes.set('Uint16Array', this.gl.UNSIGNED_SHORT);
        this.glNumberTypes.set('Int8Array', this.gl.BYTE);
        this.glNumberTypes.set('Int16Array', this.gl.SHORT);
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    };
    SPlotWebGl.prototype.setBgColor = function (color) {
        var _a = utils_1.colorFromHexToGlRgb(color), r = _a[0], g = _a[1], b = _a[2];
        this.gl.clearColor(r, g, b, 0.0);
    };
    SPlotWebGl.prototype.clearBackground = function () {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    };
    /**
     * Создает шейдер WebGL.
     *
     * @param shaderType Тип шейдера.
     * @param shaderCode Код шейдера на языке GLSL.
     * @returns Созданный объект шейдера.
     */
    SPlotWebGl.prototype.createShader = function (shaderType, shaderCode) {
        // Создание, привязка кода и компиляция шейдера.
        var shader = this.gl.createShader(this.gl[shaderType]);
        this.gl.shaderSource(shader, shaderCode);
        this.gl.compileShader(shader);
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            throw new Error('Ошибка компиляции шейдера [' + shaderType + ']. ' + this.gl.getShaderInfoLog(shader));
        }
        return shader;
    };
    /**
     * Создает программу WebGL.
     *
     * @param {WebGLShader} vertexShader Вершинный шейдер.
     * @param {WebGLShader} fragmentShader Фрагментный шейдер.
     */
    SPlotWebGl.prototype.createProgramFromShaders = function (shaderVert, shaderFrag) {
        this.gpuProgram = this.gl.createProgram();
        this.gl.attachShader(this.gpuProgram, shaderVert);
        this.gl.attachShader(this.gpuProgram, shaderFrag);
        this.gl.linkProgram(this.gpuProgram);
        this.gl.useProgram(this.gpuProgram);
    };
    SPlotWebGl.prototype.createProgram = function (shaderCodeVert, shaderCodeFrag) {
        this.createProgramFromShaders(this.createShader('VERTEX_SHADER', shaderCodeVert), this.createShader('FRAGMENT_SHADER', shaderCodeFrag));
    };
    /**
     * Устанавливает связь переменной приложения с программой WebGl.
     *
     * @param varType Тип переменной.
     * @param varName Имя переменной.
     */
    SPlotWebGl.prototype.createVariable = function (varName) {
        var varType = varName.slice(0, 2);
        if (varType === 'u_') {
            this.variables.set(varName, this.gl.getUniformLocation(this.gpuProgram, varName));
        }
        else if (varType === 'a_') {
            this.variables.set(varName, this.gl.getAttribLocation(this.gpuProgram, varName));
        }
        else {
            throw new Error('Не указан тип (префикс) переменной шейдера: ' + varName);
        }
    };
    SPlotWebGl.prototype.createVariables = function () {
        var _this = this;
        var varNames = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            varNames[_i] = arguments[_i];
        }
        varNames.forEach(function (varName) { return _this.createVariable(varName); });
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
    SPlotWebGl.prototype.createBuffer = function (groupName, data) {
        var buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW);
        if (!this.data.has(groupName)) {
            this.data.set(groupName, { buffers: [], type: this.glNumberTypes.get(data.constructor.name) });
        }
        this.data.get(groupName).buffers.push(buffer);
        return data.length * data.BYTES_PER_ELEMENT;
    };
    SPlotWebGl.prototype.setVariable = function (varName, varValue) {
        this.gl.uniformMatrix3fv(this.variables.get(varName), false, varValue);
    };
    SPlotWebGl.prototype.setBuffer = function (groupName, index, varName, size, stride, offset) {
        var group = this.data.get(groupName);
        var variable = this.variables.get(varName);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, group.buffers[index]);
        this.gl.enableVertexAttribArray(variable);
        this.gl.vertexAttribPointer(variable, size, group.type, false, stride, offset);
    };
    SPlotWebGl.prototype.drawPoints = function (first, count) {
        this.gl.drawArrays(this.gl.POINTS, first, count);
    };
    return SPlotWebGl;
}());
exports.default = SPlotWebGl;


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
var utils_1 = __webpack_require__(/*! ./utils */ "./utils.ts");
var shader_code_vert_tmpl_1 = __importDefault(__webpack_require__(/*! ./shader-code-vert-tmpl */ "./shader-code-vert-tmpl.ts"));
var shader_code_frag_tmpl_1 = __importDefault(__webpack_require__(/*! ./shader-code-frag-tmpl */ "./shader-code-frag-tmpl.ts"));
var splot_control_1 = __importDefault(__webpack_require__(/*! ./splot-control */ "./splot-control.ts"));
var splot_webgl_1 = __importDefault(__webpack_require__(/*! ./splot-webgl */ "./splot-webgl.ts"));
var splot_debug_1 = __importDefault(__webpack_require__(/*! ./splot-debug */ "./splot-debug.ts"));
var splot_demo_1 = __importDefault(__webpack_require__(/*! ./splot-demo */ "./splot-demo.ts"));
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
        /** Функция итерирования исходных данных. */
        this.iterator = undefined;
        /** Хелпер режима демо-данных. */
        this.demo = new splot_demo_1.default(this);
        /** Хелпер режима отладки. */
        this.debug = new splot_debug_1.default(this);
        /** Хелпер WebGL. */
        this.webgl = new splot_webgl_1.default();
        /** Признак форсированного запуска рендера. */
        this.forceRun = false;
        /** Ограничение кол-ва объектов на графике. */
        this.globalLimit = 1000000000;
        /** Ограничение кол-ва объектов в группе. */
        this.groupLimit = 10000;
        /** Цветовая палитра объектов. */
        this.colors = [];
        /** Параметры координатной плоскости. */
        this.grid = {
            width: 32000,
            height: 16000,
            bgColor: '#ffffff',
            rulesColor: '#c0c0c0'
        };
        /** Параметры области просмотра. */
        this.camera = {
            x: this.grid.width / 2,
            y: this.grid.height / 2,
            zoom: 1
        };
        /** Признак необходимости безотлагательного запуска рендера. */
        this.isRunning = false;
        /** Количество различных форм объектов. */
        this.shapesCount = 2;
        /** Шаблоны GLSL-кодов для шейдеров. */
        this.shaderCodeVert = shader_code_vert_tmpl_1.default;
        this.shaderCodeFrag = shader_code_frag_tmpl_1.default;
        /** Хелпер взаимодействия с устройством ввода. */
        this.control = new splot_control_1.default();
        /** Статистическая информация. */
        this.stats = {
            objectsCountTotal: 0,
            objectsCountInGroups: [],
            groupsCount: 0,
            memUsage: 0
        };
        this.webgl.prepare(canvasId);
        this.control.prepare(this);
        if (options) {
            this.setOptions(options); // Если переданы настройки, то они применяются.
            if (this.forceRun) {
                this.setup(options); //  Инициализация всех параметров рендера, если запрошен форсированный запуск.
            }
        }
    }
    /**
     * Инициализирует необходимые для рендера параметры экземпляра и WebGL.
     *
     * @param options - Пользовательские настройки экземпляра.
     */
    SPlot.prototype.setup = function (options) {
        this.setOptions(options); // Применение пользовательских настроек.
        this.webgl.create(); // Создание контекста рендеринга.
        this.demo.prepare();
        this.debug.prepare(this.webgl.canvas);
        if (this.debug.isEnable) {
            this.debug.logIntro();
            this.debug.logGpuInfo(this.webgl.gpu.hardware, this.webgl.gpu.software);
            this.debug.logInstanceInfo(this, this.webgl.canvas, options);
        }
        this.webgl.setBgColor(this.grid.bgColor); // Установка цвета очистки рендеринга
        // Создание шейдеров WebGL.
        var shaderCodeVert = this.shaderCodeVert.replace('{EXT-CODE}', this.genShaderColorCode());
        var shaderCodeFrag = this.shaderCodeFrag;
        this.webgl.createProgram(shaderCodeVert, shaderCodeFrag); // Создание программы WebGL.
        if (this.debug.isEnable) {
            this.debug.logShaderInfo('VERTEX_SHADER', shaderCodeVert);
            this.debug.logShaderInfo('FRAGMENT_SHADER', shaderCodeFrag);
        }
        // Создание переменных WebGl.
        this.webgl.createVariables('a_position', 'a_color', 'a_size', 'a_shape', 'u_matrix');
        this.loadData(); // Заполнение буферов WebGL.
        if (this.forceRun) {
            this.run(); // Форсированный запуск рендеринга (если требуется).
        }
    };
    /**
     * Применяет пользовательские настройки экземпляра.
     *
     * @param options - Пользовательские настройки экземпляра.
     */
    SPlot.prototype.setOptions = function (options) {
        utils_1.copyMatchingKeyValues(this, options); // Применение пользовательских настроек.
        // Если задан размер плоскости, но не задано положение области просмотра, то область помещается в центр плоскости.
        if (('grid' in options) && !('camera' in options)) {
            this.camera.x = this.grid.width / 2;
            this.camera.y = this.grid.height / 2;
        }
        if (this.demo.isEnable) {
            this.iterator = this.demo.iterator.bind(this.demo); // Имитация итерирования для демо-режима.
            this.colors = this.demo.colors;
        }
    };
    /**
     * Создает и заполняет данными обо всех полигонах буферы WebGL.
     */
    SPlot.prototype.loadData = function () {
        if (this.debug.isEnable) {
            this.debug.logDataLoadingStart();
        }
        var polygonGroup = { vertices: [], colors: [], sizes: [], shapes: [], amountOfVertices: 0 };
        this.stats = {
            objectsCountTotal: 0,
            objectsCountInGroups: [],
            groupsCount: 0,
            memUsage: 0
        };
        var object;
        var k = 0;
        var isObjectEnds = false;
        while (!isObjectEnds) {
            object = this.iterator();
            isObjectEnds = (object === null) || (this.stats.objectsCountTotal >= this.globalLimit);
            if (!isObjectEnds) {
                polygonGroup.vertices.push(object.x, object.y);
                polygonGroup.shapes.push(object.shape);
                polygonGroup.sizes.push(object.size);
                polygonGroup.colors.push(object.color);
                k++;
                this.stats.objectsCountTotal++;
            }
            if ((k >= this.groupLimit) || isObjectEnds) {
                this.stats.objectsCountInGroups[this.stats.groupsCount] = k;
                /** Создание и заполнение буферов данными о текущей группе полигонов. */
                this.stats.memUsage +=
                    this.webgl.createBuffer('vertices', new Float32Array(polygonGroup.vertices)) +
                        this.webgl.createBuffer('colors', new Uint8Array(polygonGroup.colors)) +
                        this.webgl.createBuffer('shapes', new Uint8Array(polygonGroup.shapes)) +
                        this.webgl.createBuffer('sizes', new Float32Array(polygonGroup.sizes));
            }
            if ((k >= this.groupLimit) && !isObjectEnds) {
                this.stats.groupsCount++;
                polygonGroup = { vertices: [], colors: [], sizes: [], shapes: [], amountOfVertices: 0 };
                k = 0;
            }
        }
        if (this.debug.isEnable) {
            this.debug.logDataLoadingComplete(this.stats.objectsCountTotal, this.globalLimit);
            this.debug.logGpuMemStats(this.stats);
        }
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
        this.colors.push(this.grid.rulesColor);
        var code = '';
        for (var i = 0; i < this.colors.length; i++) {
            // Получение цвета в нужном формате.
            var _a = utils_1.colorFromHexToGlRgb(this.colors[i]), r = _a[0], g = _a[1], b = _a[2];
            // Формировние строк GLSL-кода проверки индекса цвета.
            code += ((i === 0) ? '' : '  else ') + 'if (a_color == ' + i + '.0) v_color = vec3(' +
                r.toString().slice(0, 9) + ',' +
                g.toString().slice(0, 9) + ',' +
                b.toString().slice(0, 9) + ');\n';
        }
        // Удаление из палитры вершин временно добавленного цвета направляющих.
        this.colors.pop();
        return code;
    };
    /**
     * Производит рендеринг графика в соответствии с текущими параметрами трансформации.
     */
    SPlot.prototype.render = function () {
        // Очистка объекта рендеринга WebGL.
        this.webgl.clearBackground();
        // Обновление матрицы трансформации.
        this.control.updateViewProjection();
        // Привязка матрицы трансформации к переменной шейдера.
        this.webgl.setVariable('u_matrix', this.control.transform.viewProjectionMat);
        // Итерирование и рендеринг групп буферов WebGL.
        for (var i = 0; i < this.stats.groupsCount; i++) {
            this.webgl.setBuffer('vertices', i, 'a_position', 2, 0, 0);
            this.webgl.setBuffer('colors', i, 'a_color', 1, 0, 0);
            this.webgl.setBuffer('sizes', i, 'a_size', 1, 0, 0);
            this.webgl.setBuffer('shapes', i, 'a_shape', 1, 0, 0);
            this.webgl.drawPoints(0, this.stats.objectsCountInGroups[i]);
        }
    };
    /**
     * Запускает рендеринг и контроль управления.
     */
    SPlot.prototype.run = function () {
        if (this.isRunning) {
            return;
        }
        this.render();
        this.control.run();
        this.isRunning = true;
        if (this.debug.isEnable) {
            this.debug.logRenderStarted();
        }
    };
    /**
     * Останавливает рендеринг и контроль управления.
     */
    SPlot.prototype.stop = function () {
        if (!this.isRunning) {
            return;
        }
        this.control.stop();
        this.isRunning = false;
        if (this.debug.isEnable) {
            this.debug.logRenderStoped();
        }
    };
    /**
     * Очищает фон.
     */
    SPlot.prototype.clear = function () {
        this.webgl.clearBackground();
        if (this.debug.isEnable) {
            this.debug.logCanvasCleared(this.grid.bgColor);
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
exports.getCurrentTime = exports.colorFromHexToGlRgb = exports.jsonStringify = exports.randomInt = exports.copyMatchingKeyValues = exports.isObject = void 0;
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
 * Переопределяет значения полей объекта target на значения полей объекта source. Переопределяются только те поля,
 * которые существуеют в target. Если в source есть поля, которых нет в target, то они игнорируются. Если какие-то поля
 * сами являются являются объектами, то то они также рекурсивно копируются (при том же условии, что в целеом объекте
 * существуют поля объекта-источника).
 *
 * @param target - Целевой (изменяемый) объект.
 * @param source - Объект с данными, которые нужно установить у целевого объекта.
 */
function copyMatchingKeyValues(target, source) {
    Object.keys(source).forEach(function (key) {
        if (key in target) {
            if (isObject(source[key])) {
                if (isObject(target[key])) {
                    copyMatchingKeyValues(target[key], source[key]);
                }
            }
            else {
                if (!isObject(target[key]) && (typeof target[key] !== 'function')) {
                    target[key] = source[key];
                }
            }
        }
    });
}
exports.copyMatchingKeyValues = copyMatchingKeyValues;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zdHlsZS5jc3MiLCJ3ZWJwYWNrOi8vLy4vaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vc2hhZGVyLWNvZGUtZnJhZy10bXBsLnRzIiwid2VicGFjazovLy8uL3NoYWRlci1jb2RlLXZlcnQtdG1wbC50cyIsIndlYnBhY2s6Ly8vLi9zcGxvdC1jb250cm9sLnRzIiwid2VicGFjazovLy8uL3NwbG90LWRlYnVnLnRzIiwid2VicGFjazovLy8uL3NwbG90LWRlbW8udHMiLCJ3ZWJwYWNrOi8vLy4vc3Bsb3Qtd2ViZ2wudHMiLCJ3ZWJwYWNrOi8vLy4vc3Bsb3QudHMiLCJ3ZWJwYWNrOi8vLy4vdXRpbHMudHMiLCJ3ZWJwYWNrOi8vLy4vbTMuanMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovLy93ZWJwYWNrL3N0YXJ0dXAiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBQSwrREFBbUM7QUFDbkMsZ0ZBQTJCO0FBQzNCLGtEQUFnQjtBQUVoQixJQUFJLENBQUMsR0FBRyxDQUFDO0FBQ1QsSUFBSSxDQUFDLEdBQUcsT0FBUyxFQUFFLDhCQUE4QjtBQUNqRCxJQUFJLE1BQU0sR0FBRyxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDO0FBQ2pKLElBQUksU0FBUyxHQUFHLEtBQU07QUFDdEIsSUFBSSxVQUFVLEdBQUcsS0FBTTtBQUV2QixnSEFBZ0g7QUFDaEgsU0FBUyxjQUFjO0lBQ3JCLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUNULENBQUMsRUFBRTtRQUNILE9BQU87WUFDTCxD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QTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBLHNEQUFzRCxrQkFBa0I7V0FDeEU7V0FDQSwrQ0FBK0MsY0FBYztXQUM3RCxFOzs7OztVQ05BO1VBQ0E7VUFDQTtVQUNBIiwiZmlsZSI6InNjcmlwdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsImltcG9ydCB7IHJhbmRvbUludCB9IGZyb20gJy4vdXRpbHMnXG5pbXBvcnQgU1Bsb3QgZnJvbSAnLi9zcGxvdCdcbmltcG9ydCAnQC9zdHlsZSdcblxubGV0IGkgPSAwXG5sZXQgbiA9IDFfMDAwXzAwMCAgLy8g0JjQvNC40YLQuNGA0YPQtdC80L7QtSDRh9C40YHQu9C+INC+0LHRitC10LrRgtC+0LIuXG5sZXQgY29sb3JzID0gWycjRDgxQzAxJywgJyNFOTk2N0EnLCAnI0JBNTVEMycsICcjRkZENzAwJywgJyNGRkU0QjUnLCAnI0ZGOEMwMCcsICcjMjI4QjIyJywgJyM5MEVFOTAnLCAnIzQxNjlFMScsICcjMDBCRkZGJywgJyM4QjQ1MTMnLCAnIzAwQ0VEMSddXG5sZXQgcGxvdFdpZHRoID0gMzJfMDAwXG5sZXQgcGxvdEhlaWdodCA9IDE2XzAwMFxuXG4vLyDQn9GA0LjQvNC10YAg0LjRgtC10YDQuNGA0YPRjtGJ0LXQuSDRhNGD0L3QutGG0LjQuC4g0JjRgtC10YDQsNGG0LjQuCDQuNC80LjRgtC40YDRg9GO0YLRgdGPINGB0LvRg9GH0LDQudC90YvQvNC4INCy0YvQtNCw0YfQsNC80LguINCf0L7Rh9GC0Lgg0YLQsNC60LbQtSDRgNCw0LHQvtGC0LDQtdGCINGA0LXQttC40Lwg0LTQtdC80L4t0LTQsNC90L3Ri9GFLlxuZnVuY3Rpb24gcmVhZE5leHRPYmplY3QoKSB7XG4gIGlmIChpIDwgbikge1xuICAgIGkrK1xuICAgIHJldHVybiB7XG4gICAgICB4OiByYW5kb21JbnQocGxvdFdpZHRoKSxcbiAgICAgIHk6IHJhbmRvbUludChwbG90SGVpZ2h0KSxcbiAgICAgIHNoYXBlOiByYW5kb21JbnQoMiksXG4gICAgICBzaXplOiAxMCArIHJhbmRvbUludCgyMSksXG4gICAgICBjb2xvcjogcmFuZG9tSW50KGNvbG9ycy5sZW5ndGgpLCAgLy8g0JjQvdC00LXQutGBINGG0LLQtdGC0LAg0LIg0LzQsNGB0YHQuNCy0LUg0YbQstC10YLQvtCyXG4gICAgfVxuICB9XG4gIGVsc2VcbiAgICByZXR1cm4gbnVsbCAgLy8g0JLQvtC30LLRgNCw0YnQsNC10LwgbnVsbCwg0LrQvtCz0LTQsCDQvtCx0YrQtdC60YLRiyBcItC30LDQutC+0L3Rh9C40LvQuNGB0YxcIlxufVxuXG4vKiogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICoqL1xuXG5sZXQgc2NhdHRlclBsb3QgPSBuZXcgU1Bsb3QoJ2NhbnZhczEnKVxuXG4vLyDQndCw0YHRgtGA0L7QudC60LAg0Y3QutC30LXQvNC/0LvRj9GA0LAg0L3QsCDRgNC10LbQuNC8INCy0YvQstC+0LTQsCDQvtGC0LvQsNC00L7Rh9C90L7QuSDQuNC90YTQvtGA0LzQsNGG0LjQuCDQsiDQutC+0L3RgdC+0LvRjCDQsdGA0LDRg9C30LXRgNCwLlxuLy8g0JTRgNGD0LPQuNC1INC/0YDQuNC80LXRgNGLINGA0LDQsdC+0YLRiyDQvtC/0LjRgdCw0L3RiyDQsiDRhNCw0LnQu9C1IHNwbG90LmpzINGB0L4g0YHRgtGA0L7QutC4IDIxNC5cbnNjYXR0ZXJQbG90LnNldHVwKHtcbiAgaXRlcmF0b3I6IHJlYWROZXh0T2JqZWN0LFxuICBjb2xvcnM6IGNvbG9ycyxcbiAgZ3JpZDoge1xuICAgIHdpZHRoOiBwbG90V2lkdGgsXG4gICAgaGVpZ2h0OiBwbG90SGVpZ2h0LFxuICB9LFxuICBkZWJ1Zzoge1xuICAgIGlzRW5hYmxlOiB0cnVlLFxuICB9LFxuICBkZW1vOiB7XG4gICAgaXNFbmFibGU6IHRydWVcbiAgfVxufSlcblxuc2NhdHRlclBsb3QucnVuKClcblxuLy9zY2F0dGVyUGxvdC5zdG9wKClcblxuLy9zZXRUaW1lb3V0KCgpID0+IHNjYXR0ZXJQbG90LnN0b3AoKSwgMzAwMClcbiIsImV4cG9ydCBkZWZhdWx0XG5gXG5wcmVjaXNpb24gbG93cCBmbG9hdDtcbnZhcnlpbmcgdmVjMyB2X2NvbG9yO1xudmFyeWluZyBmbG9hdCB2X3NoYXBlO1xudm9pZCBtYWluKCkge1xuICBpZiAodl9zaGFwZSA9PSAwLjApIHtcbiAgICBmbG9hdCB2U2l6ZSA9IDIwLjA7XG4gICAgZmxvYXQgZGlzdGFuY2UgPSBsZW5ndGgoMi4wICogZ2xfUG9pbnRDb29yZCAtIDEuMCk7XG4gICAgaWYgKGRpc3RhbmNlID4gMS4wKSB7IGRpc2NhcmQ7IH07XG4gICAgZ2xfRnJhZ0NvbG9yID0gdmVjNCh2X2NvbG9yLnJnYiwgMS4wKTtcbiAgfVxuICBlbHNlIGlmICh2X3NoYXBlID09IDEuMCkge1xuICAgIGdsX0ZyYWdDb2xvciA9IHZlYzQodl9jb2xvci5yZ2IsIDEuMCk7XG4gIH1cbn1cbmBcblxuLyoqXG5leHBvcnQgZGVmYXVsdFxuICBgXG5wcmVjaXNpb24gbG93cCBmbG9hdDtcbnZhcnlpbmcgdmVjMyB2X2NvbG9yO1xudm9pZCBtYWluKCkge1xuICBmbG9hdCB2U2l6ZSA9IDIwLjA7XG4gIGZsb2F0IGRpc3RhbmNlID0gbGVuZ3RoKDIuMCAqIGdsX1BvaW50Q29vcmQgLSAxLjApO1xuICBpZiAoZGlzdGFuY2UgPiAxLjApIHsgZGlzY2FyZDsgfVxuICBnbF9GcmFnQ29sb3IgPSB2ZWM0KHZfY29sb3IucmdiLCAxLjApO1xuXG4gICB2ZWM0IHVFZGdlQ29sb3IgPSB2ZWM0KDAuNSwgMC41LCAwLjUsIDEuMCk7XG4gZmxvYXQgdUVkZ2VTaXplID0gMS4wO1xuXG5mbG9hdCBzRWRnZSA9IHNtb290aHN0ZXAoXG4gIHZTaXplIC0gdUVkZ2VTaXplIC0gMi4wLFxuICB2U2l6ZSAtIHVFZGdlU2l6ZSxcbiAgZGlzdGFuY2UgKiAodlNpemUgKyB1RWRnZVNpemUpXG4pO1xuZ2xfRnJhZ0NvbG9yID0gKHVFZGdlQ29sb3IgKiBzRWRnZSkgKyAoKDEuMCAtIHNFZGdlKSAqIGdsX0ZyYWdDb2xvcik7XG5cbmdsX0ZyYWdDb2xvci5hID0gZ2xfRnJhZ0NvbG9yLmEgKiAoMS4wIC0gc21vb3Roc3RlcChcbiAgICB2U2l6ZSAtIDIuMCxcbiAgICB2U2l6ZSxcbiAgICBkaXN0YW5jZSAqIHZTaXplXG4pKTtcblxufVxuYFxuKi9cbiIsImV4cG9ydCBkZWZhdWx0XG5gXG5hdHRyaWJ1dGUgdmVjMiBhX3Bvc2l0aW9uO1xuYXR0cmlidXRlIGZsb2F0IGFfY29sb3I7XG5hdHRyaWJ1dGUgZmxvYXQgYV9zaXplO1xuYXR0cmlidXRlIGZsb2F0IGFfc2hhcGU7XG51bmlmb3JtIG1hdDMgdV9tYXRyaXg7XG52YXJ5aW5nIHZlYzMgdl9jb2xvcjtcbnZhcnlpbmcgZmxvYXQgdl9zaGFwZTtcbnZvaWQgbWFpbigpIHtcbiAgZ2xfUG9zaXRpb24gPSB2ZWM0KCh1X21hdHJpeCAqIHZlYzMoYV9wb3NpdGlvbiwgMSkpLnh5LCAwLjAsIDEuMCk7XG4gIGdsX1BvaW50U2l6ZSA9IGFfc2l6ZTtcbiAgdl9zaGFwZSA9IGFfc2hhcGU7XG4gIHtFWFQtQ09ERX1cbn1cbmBcbiIsIi8vIEB0cy1pZ25vcmVcbmltcG9ydCBtMyBmcm9tICcuL20zJ1xuaW1wb3J0IFNQbG90IGZyb20gJy4vc3Bsb3QnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNQbG90Q29udG9sIHtcblxuICBwcml2YXRlIGNhbnZhcyE6IEhUTUxDYW52YXNFbGVtZW50XG4gIHByaXZhdGUgY2FtZXJhITogU1Bsb3RDYW1lcmFcbiAgcHJpdmF0ZSByZW5kZXIhOiAoKSA9PiB2b2lkXG5cbiAgLy8g0KLQtdGF0L3QuNGH0LXRgdC60LDRjyDQuNC90YTQvtGA0LzQsNGG0LjRjywg0LjRgdC/0L7Qu9GM0LfRg9C10LzQsNGPINC/0YDQuNC70L7QttC10L3QuNC10Lwg0LTQu9GPINGA0LDRgdGH0LXRgtCwINGC0YDQsNC90YHRhNC+0YDQvNCw0YbQuNC5LlxuICBwdWJsaWMgdHJhbnNmb3JtOiBTUGxvdFRyYW5zZm9ybSA9IHtcbiAgICB2aWV3UHJvamVjdGlvbk1hdDogW10sXG4gICAgc3RhcnRJbnZWaWV3UHJvak1hdDogW10sXG4gICAgc3RhcnRDYW1lcmE6IHsgeDogMCwgeTogMCwgem9vbTogMSB9LFxuICAgIHN0YXJ0UG9zOiBbXSxcbiAgICBzdGFydENsaXBQb3M6IFtdLFxuICAgIHN0YXJ0TW91c2VQb3M6IFtdXG4gIH1cblxuICBwcm90ZWN0ZWQgaGFuZGxlTW91c2VEb3duV2l0aENvbnRleHQ6IEV2ZW50TGlzdGVuZXIgPSB0aGlzLmhhbmRsZU1vdXNlRG93bi5iaW5kKHRoaXMpIGFzIEV2ZW50TGlzdGVuZXJcbiAgcHJvdGVjdGVkIGhhbmRsZU1vdXNlV2hlZWxXaXRoQ29udGV4dDogRXZlbnRMaXN0ZW5lciA9IHRoaXMuaGFuZGxlTW91c2VXaGVlbC5iaW5kKHRoaXMpIGFzIEV2ZW50TGlzdGVuZXJcbiAgcHJvdGVjdGVkIGhhbmRsZU1vdXNlTW92ZVdpdGhDb250ZXh0OiBFdmVudExpc3RlbmVyID0gdGhpcy5oYW5kbGVNb3VzZU1vdmUuYmluZCh0aGlzKSBhcyBFdmVudExpc3RlbmVyXG4gIHByb3RlY3RlZCBoYW5kbGVNb3VzZVVwV2l0aENvbnRleHQ6IEV2ZW50TGlzdGVuZXIgPSB0aGlzLmhhbmRsZU1vdXNlVXAuYmluZCh0aGlzKSBhcyBFdmVudExpc3RlbmVyXG5cbiAgcHJlcGFyZShzcGxvdDogU1Bsb3QpIHtcbiAgICB0aGlzLmNhbnZhcyA9IHNwbG90LndlYmdsLmNhbnZhc1xuICAgIHRoaXMuY2FtZXJhID0gc3Bsb3QuY2FtZXJhXG4gICAgdGhpcy5yZW5kZXIgPSBzcGxvdC5yZW5kZXIuYmluZChzcGxvdClcbiAgfVxuXG4gIHB1YmxpYyBydW4oKSB7XG4gICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5oYW5kbGVNb3VzZURvd25XaXRoQ29udGV4dClcbiAgICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCd3aGVlbCcsIHRoaXMuaGFuZGxlTW91c2VXaGVlbFdpdGhDb250ZXh0KVxuICB9XG5cbiAgcHVibGljIHN0b3AoKSB7XG4gICAgdGhpcy5jYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5oYW5kbGVNb3VzZURvd25XaXRoQ29udGV4dClcbiAgICB0aGlzLmNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKCd3aGVlbCcsIHRoaXMuaGFuZGxlTW91c2VXaGVlbFdpdGhDb250ZXh0KVxuICAgIHRoaXMuY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMuaGFuZGxlTW91c2VNb3ZlV2l0aENvbnRleHQpXG4gICAgdGhpcy5jYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuaGFuZGxlTW91c2VVcFdpdGhDb250ZXh0KVxuICB9XG5cbiAgcHJvdGVjdGVkIG1ha2VDYW1lcmFNYXRyaXgoKSB7XG5cbiAgICBjb25zdCB6b29tU2NhbGUgPSAxIC8gdGhpcy5jYW1lcmEuem9vbSE7XG5cbiAgICBsZXQgY2FtZXJhTWF0ID0gbTMuaWRlbnRpdHkoKTtcbiAgICBjYW1lcmFNYXQgPSBtMy50cmFuc2xhdGUoY2FtZXJhTWF0LCB0aGlzLmNhbWVyYS54LCB0aGlzLmNhbWVyYS55KTtcbiAgICBjYW1lcmFNYXQgPSBtMy5zY2FsZShjYW1lcmFNYXQsIHpvb21TY2FsZSwgem9vbVNjYWxlKTtcblxuICAgIHJldHVybiBjYW1lcmFNYXQ7XG4gIH1cblxuICAvKipcbiAgICog0J7QsdC90L7QstC70Y/QtdGCINC80LDRgtGA0LjRhtGDINGC0YDQsNC90YHRhNC+0YDQvNCw0YbQuNC4LlxuICAgKlxuICAgKiBAcmVtYXJrc1xuICAgKiDQodGD0YnQtdGB0YLQstGD0LXRgiDQtNCy0LAg0LLQsNGA0LjQsNC90YLQsCDQstGL0LfQvtCy0LAg0LzQtdGC0L7QtNCwIC0g0LjQtyDQtNGA0YPQs9C+0LPQviDQvNC10YLQvtC00LAg0Y3QutC30LXQvNC/0LvRj9GA0LAgKHtAbGluayByZW5kZXJ9KSDQuCDQuNC3INC+0LHRgNCw0LHQvtGC0YfQuNC60LAg0YHQvtCx0YvRgtC40Y8g0LzRi9GI0LhcbiAgICogKHtAbGluayBoYW5kbGVNb3VzZVdoZWVsfSkuINCS0L4g0LLRgtC+0YDQvtC8INCy0LDRgNC40LDQvdGC0LUg0LjRgdC/0L7Qu9GM0LfQvtCy0LDQvdC40LUg0L7QsdGK0LXQutGC0LAgdGhpcyDQvdC10LLQvtC30LzQvtC20L3Qvi4g0JTQu9GPINGD0L3QuNCy0LXRgNGB0LDQu9GM0L3QvtGB0YLQuCDQstGL0LfQvtCy0LBcbiAgICog0LzQtdGC0L7QtNCwIC0g0LIg0L3QtdCz0L4g0LLRgdC10LPQtNCwINGP0LLQvdC+INC90LXQvtCx0YXQvtC00LjQvNC+INC/0LXRgNC10LTQsNCy0LDRgtGMINGB0YHRi9C70LrRgyDQvdCwINGN0LrQt9C10LzQv9C70Y/RgCDQutC70LDRgdGB0LAuXG4gICAqL1xuICBwdWJsaWMgdXBkYXRlVmlld1Byb2plY3Rpb24oKTogdm9pZCB7XG5cbiAgICBjb25zdCBwcm9qZWN0aW9uTWF0ID0gbTMucHJvamVjdGlvbih0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcbiAgICBjb25zdCBjYW1lcmFNYXQgPSB0aGlzLm1ha2VDYW1lcmFNYXRyaXgoKTtcbiAgICBsZXQgdmlld01hdCA9IG0zLmludmVyc2UoY2FtZXJhTWF0KTtcbiAgICB0aGlzLnRyYW5zZm9ybS52aWV3UHJvamVjdGlvbk1hdCA9IG0zLm11bHRpcGx5KHByb2plY3Rpb25NYXQsIHZpZXdNYXQpO1xuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqL1xuICBwcm90ZWN0ZWQgZ2V0Q2xpcFNwYWNlTW91c2VQb3NpdGlvbihldmVudDogTW91c2VFdmVudCkge1xuXG4gICAgLy8gZ2V0IGNhbnZhcyByZWxhdGl2ZSBjc3MgcG9zaXRpb25cbiAgICBjb25zdCByZWN0ID0gdGhpcy5jYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgY3NzWCA9IGV2ZW50LmNsaWVudFggLSByZWN0LmxlZnQ7XG4gICAgY29uc3QgY3NzWSA9IGV2ZW50LmNsaWVudFkgLSByZWN0LnRvcDtcblxuICAgIC8vIGdldCBub3JtYWxpemVkIDAgdG8gMSBwb3NpdGlvbiBhY3Jvc3MgYW5kIGRvd24gY2FudmFzXG4gICAgY29uc3Qgbm9ybWFsaXplZFggPSBjc3NYIC8gdGhpcy5jYW52YXMuY2xpZW50V2lkdGg7XG4gICAgY29uc3Qgbm9ybWFsaXplZFkgPSBjc3NZIC8gdGhpcy5jYW52YXMuY2xpZW50SGVpZ2h0O1xuXG4gICAgLy8gY29udmVydCB0byBjbGlwIHNwYWNlXG4gICAgY29uc3QgY2xpcFggPSBub3JtYWxpemVkWCAqIDIgLSAxO1xuICAgIGNvbnN0IGNsaXBZID0gbm9ybWFsaXplZFkgKiAtMiArIDE7XG5cbiAgICByZXR1cm4gW2NsaXBYLCBjbGlwWV07XG4gIH1cblxuICAvKipcbiAgICpcbiAgICovXG4gIHByb3RlY3RlZCBtb3ZlQ2FtZXJhKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG5cbiAgICBjb25zdCBwb3MgPSBtMy50cmFuc2Zvcm1Qb2ludChcbiAgICAgIHRoaXMudHJhbnNmb3JtLnN0YXJ0SW52Vmlld1Byb2pNYXQsXG4gICAgICB0aGlzLmdldENsaXBTcGFjZU1vdXNlUG9zaXRpb24oZXZlbnQpXG4gICAgKTtcblxuICAgIHRoaXMuY2FtZXJhLnggPVxuICAgICAgdGhpcy50cmFuc2Zvcm0uc3RhcnRDYW1lcmEueCEgKyB0aGlzLnRyYW5zZm9ybS5zdGFydFBvc1swXSAtIHBvc1swXTtcblxuICAgIHRoaXMuY2FtZXJhLnkgPVxuICAgICAgdGhpcy50cmFuc2Zvcm0uc3RhcnRDYW1lcmEueSEgKyB0aGlzLnRyYW5zZm9ybS5zdGFydFBvc1sxXSAtIHBvc1sxXTtcblxuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICAvKipcbiAgICog0KDQtdCw0LPQuNGA0YPQtdGCINC90LAg0LTQstC40LbQtdC90LjQtSDQvNGL0YjQuC/RgtGA0LXQutC/0LDQtNCwINCyINC80L7QvNC10L3Rgiwg0LrQvtCz0LTQsCDQtdC1L9C10LPQviDQutC70LDQstC40YjQsCDRg9C00LXRgNC20LjQstCw0LXRgtGB0Y8g0L3QsNC20LDRgtC+0LkuXG4gICAqXG4gICAqIEByZW1lcmtzXG4gICAqINCc0LXRgtC+0LQg0L/QtdGA0LXQvNC10YnQsNC10YIg0L7QsdC70LDRgdGC0Ywg0LLQuNC00LjQvNC+0YHRgtC4INC90LAg0L/Qu9C+0YHQutC+0YHRgtC4INCy0LzQtdGB0YLQtSDRgSDQtNCy0LjQttC10L3QuNC10Lwg0LzRi9GI0Lgv0YLRgNC10LrQv9Cw0LTQsC4g0JLRi9GH0LjRgdC70LXQvdC40Y8g0LLQvdGD0YLRgNC4INGB0L7QsdGL0YLQuNGPINGB0LTQtdC70LDQvdGLXG4gICAqINC80LDQutGB0LjQvNCw0LvRjNC90L4g0L/RgNC+0LjQt9Cy0L7QtNC40YLQtdC70YzQvdGL0LzQuCDQsiDRg9GJ0LXRgNCxINGH0LjRgtCw0LHQtdC70YzQvdC+0YHRgtC4INC70L7Qs9C40LrQuCDQtNC10LnRgdGC0LLQuNC5LiDQktC+INCy0L3QtdGI0L3QtdC8INC+0LHRgNCw0LHQvtGC0YfQuNC60LUg0YHQvtCx0YvRgtC40Lkg0L7QsdGK0LXQutGCIHRoaXNcbiAgICog0L3QtdC00L7RgdGC0YPQv9C10L0g0L/QvtGN0YLQvtC80YMg0LTQvtGB0YLRg9C/INC6INGN0LrQt9C10LzQv9C70Y/RgNGDINC60LvQsNGB0YHQsCDRgNC10LDQu9C40LfRg9C10YLRgdGPINGH0LXRgNC10Lcg0YHRgtCw0YLQuNGH0LXRgdC60LjQuSDQvNCw0YHRgdC40LIg0LLRgdC10YUg0YHQvtC30LTQsNC90L3Ri9GFINGN0LrQt9C10LzQv9C70Y/RgNC+0LJcbiAgICog0LrQu9Cw0YHRgdCwINC4INC40LTQtdC90YLQuNGE0LjQutCw0YLQvtGA0LAg0LrQsNC90LLQsNGB0LAsINCy0YvRgdGC0YPQv9Cw0Y7RidC10LPQviDQuNC90LTQtdC60YHQvtC8INCyINGN0YLQvtC8INC80LDRgdGB0LjQstC1LlxuICAgKlxuICAgKiBAcGFyYW0gZXZlbnQgLSDQodC+0LHRi9GC0LjQtSDQvNGL0YjQuC/RgtGA0LXQutC/0LDQtNCwLlxuICAgKi9cbiAgcHJvdGVjdGVkIGhhbmRsZU1vdXNlTW92ZShldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuICAgIHRoaXMubW92ZUNhbWVyYS5jYWxsKHRoaXMsIGV2ZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiDQoNC10LDQs9C40YDRg9C10YIg0L3QsCDQvtGC0LbQsNGC0LjQtSDQutC70LDQstC40YjQuCDQvNGL0YjQuC/RgtGA0LXQutC/0LDQtNCwLlxuICAgKlxuICAgKiBAcmVtZXJrc1xuICAgKiDQkiDQvNC+0LzQtdC90YIg0L7RgtC20LDRgtC40Y8g0LrQu9Cw0LLQuNGI0Lgg0LDQvdCw0LvQuNC3INC00LLQuNC20LXQvdC40Y8g0LzRi9GI0Lgv0YLRgNC10LrQv9Cw0LTQsCDRgSDQt9Cw0LbQsNGC0L7QuSDQutC70LDQstC40YjQtdC5INC/0YDQtdC60YDQsNGJ0LDQtdGC0YHRjy4g0JLRi9GH0LjRgdC70LXQvdC40Y8g0LLQvdGD0YLRgNC4INGB0L7QsdGL0YLQuNGPXG4gICAqINGB0LTQtdC70LDQvdGLINC80LDQutGB0LjQvNCw0LvRjNC90L4g0L/RgNC+0LjQt9Cy0L7QtNC40YLQtdC70YzQvdGL0LzQuCDQsiDRg9GJ0LXRgNCxINGH0LjRgtCw0LHQtdC70YzQvdC+0YHRgtC4INC70L7Qs9C40LrQuCDQtNC10LnRgdGC0LLQuNC5LiDQktC+INCy0L3QtdGI0L3QtdC8INC+0LHRgNCw0LHQvtGC0YfQuNC60LUg0YHQvtCx0YvRgtC40Lkg0L7QsdGK0LXQutGCXG4gICAqIHRoaXMg0L3QtdC00L7RgdGC0YPQv9C10L0g0L/QvtGN0YLQvtC80YMg0LTQvtGB0YLRg9C/INC6INGN0LrQt9C10LzQv9C70Y/RgNGDINC60LvQsNGB0YHQsCDRgNC10LDQu9C40LfRg9C10YLRgdGPINGH0LXRgNC10Lcg0YHRgtCw0YLQuNGH0LXRgdC60LjQuSDQvNCw0YHRgdC40LIg0LLRgdC10YUg0YHQvtC30LTQsNC90L3Ri9GFINGN0LrQt9C10LzQv9C70Y/RgNC+0LJcbiAgICog0LrQu9Cw0YHRgdCwINC4INC40LTQtdC90YLQuNGE0LjQutCw0YLQvtGA0LAg0LrQsNC90LLQsNGB0LAsINCy0YvRgdGC0YPQv9Cw0Y7RidC10LPQviDQuNC90LTQtdC60YHQvtC8INCyINGN0YLQvtC8INC80LDRgdGB0LjQstC1LlxuICAgKlxuICAgKiBAcGFyYW0gZXZlbnQgLSDQodC+0LHRi9GC0LjQtSDQvNGL0YjQuC/RgtGA0LXQutC/0LDQtNCwLlxuICAgKi9cbiAgcHJvdGVjdGVkIGhhbmRsZU1vdXNlVXAoZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICB0aGlzLnJlbmRlcigpO1xuICAgIGV2ZW50LnRhcmdldCEucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5oYW5kbGVNb3VzZU1vdmVXaXRoQ29udGV4dCk7XG4gICAgZXZlbnQudGFyZ2V0IS5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5oYW5kbGVNb3VzZVVwV2l0aENvbnRleHQpO1xuICB9XG5cbiAgLyoqXG4gICAqINCg0LXQsNCz0LjRgNGD0LXRgiDQvdCwINC90LDQttCw0YLQuNC1INC60LvQsNCy0LjRiNC4INC80YvRiNC4L9GC0YDQtdC60L/QsNC00LAuXG4gICAqXG4gICAqIEByZW1lcmtzXG4gICAqINCSINC80L7QvNC10L3RgiDQvdCw0LbQsNGC0LjRjyDQuCDRg9C00LXRgNC20LDQvdC40Y8g0LrQu9Cw0LLQuNGI0Lgg0LfQsNC/0YPRgdC60LDQtdGC0YHRjyDQsNC90LDQu9C40Lcg0LTQstC40LbQtdC90LjRjyDQvNGL0YjQuC/RgtGA0LXQutC/0LDQtNCwICjRgSDQt9Cw0LbQsNGC0L7QuSDQutC70LDQstC40YjQtdC5KS4g0JLRi9GH0LjRgdC70LXQvdC40Y9cbiAgICog0LLQvdGD0YLRgNC4INGB0L7QsdGL0YLQuNGPINGB0LTQtdC70LDQvdGLINC80LDQutGB0LjQvNCw0LvRjNC90L4g0L/RgNC+0LjQt9Cy0L7QtNC40YLQtdC70YzQvdGL0LzQuCDQsiDRg9GJ0LXRgNCxINGH0LjRgtCw0LHQtdC70YzQvdC+0YHRgtC4INC70L7Qs9C40LrQuCDQtNC10LnRgdGC0LLQuNC5LiDQktC+INCy0L3QtdGI0L3QtdC8INC+0LHRgNCw0LHQvtGC0YfQuNC60LVcbiAgICog0YHQvtCx0YvRgtC40Lkg0L7QsdGK0LXQutGCIHRoaXMg0L3QtdC00L7RgdGC0YPQv9C10L0g0L/QvtGN0YLQvtC80YMg0LTQvtGB0YLRg9C/INC6INGN0LrQt9C10LzQv9C70Y/RgNGDINC60LvQsNGB0YHQsCDRgNC10LDQu9C40LfRg9C10YLRgdGPINGH0LXRgNC10Lcg0YHRgtCw0YLQuNGH0LXRgdC60LjQuSDQvNCw0YHRgdC40LIg0LLRgdC10YVcbiAgICog0YHQvtC30LTQsNC90L3Ri9GFINGN0LrQt9C10LzQv9C70Y/RgNC+0LIg0LrQu9Cw0YHRgdCwINC4INC40LTQtdC90YLQuNGE0LjQutCw0YLQvtGA0LAg0LrQsNC90LLQsNGB0LAsINCy0YvRgdGC0YPQv9Cw0Y7RidC10LPQviDQuNC90LTQtdC60YHQvtC8INCyINGN0YLQvtC8INC80LDRgdGB0LjQstC1LlxuICAgKlxuICAgKiBAcGFyYW0gZXZlbnQgLSDQodC+0LHRi9GC0LjQtSDQvNGL0YjQuC/RgtGA0LXQutC/0LDQtNCwLlxuICAgKi9cbiAgcHJvdGVjdGVkIGhhbmRsZU1vdXNlRG93bihldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLmhhbmRsZU1vdXNlTW92ZVdpdGhDb250ZXh0KTtcbiAgICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5oYW5kbGVNb3VzZVVwV2l0aENvbnRleHQpO1xuXG4gICAgdGhpcy50cmFuc2Zvcm0uc3RhcnRJbnZWaWV3UHJvak1hdCA9IG0zLmludmVyc2UodGhpcy50cmFuc2Zvcm0udmlld1Byb2plY3Rpb25NYXQpO1xuICAgIHRoaXMudHJhbnNmb3JtLnN0YXJ0Q2FtZXJhID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5jYW1lcmEpO1xuICAgIHRoaXMudHJhbnNmb3JtLnN0YXJ0Q2xpcFBvcyA9IHRoaXMuZ2V0Q2xpcFNwYWNlTW91c2VQb3NpdGlvbi5jYWxsKHRoaXMsIGV2ZW50KTtcbiAgICB0aGlzLnRyYW5zZm9ybS5zdGFydFBvcyA9IG0zLnRyYW5zZm9ybVBvaW50KHRoaXMudHJhbnNmb3JtLnN0YXJ0SW52Vmlld1Byb2pNYXQsIHRoaXMudHJhbnNmb3JtLnN0YXJ0Q2xpcFBvcyk7XG4gICAgdGhpcy50cmFuc2Zvcm0uc3RhcnRNb3VzZVBvcyA9IFtldmVudC5jbGllbnRYLCBldmVudC5jbGllbnRZXTtcblxuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICAvKipcbiAgICog0KDQtdCw0LPQuNGA0YPQtdGCINC90LAg0LfRg9C80LjRgNC+0LLQsNC90LjQtSDQvNGL0YjQuC/RgtGA0LXQutC/0LDQtNCwLlxuICAgKlxuICAgKiBAcmVtZXJrc1xuICAgKiDQkiDQvNC+0LzQtdC90YIg0LfRg9C80LjRgNC+0LLQsNC90LjRjyDQvNGL0YjQuC/RgtGA0LXQutC/0LDQtNCwINC/0YDQvtC40YHRhdC+0LTQuNGCINC30YPQvNC40YDQvtCy0LDQvdC40LUg0LrQvtC+0YDQtNC40L3QsNGC0L3QvtC5INC/0LvQvtGB0LrQvtGB0YLQuC4g0JLRi9GH0LjRgdC70LXQvdC40Y8g0LLQvdGD0YLRgNC4INGB0L7QsdGL0YLQuNGPXG4gICAqINGB0LTQtdC70LDQvdGLINC80LDQutGB0LjQvNCw0LvRjNC90L4g0L/RgNC+0LjQt9Cy0L7QtNC40YLQtdC70YzQvdGL0LzQuCDQsiDRg9GJ0LXRgNCxINGH0LjRgtCw0LHQtdC70YzQvdC+0YHRgtC4INC70L7Qs9C40LrQuCDQtNC10LnRgdGC0LLQuNC5LiDQktC+INCy0L3QtdGI0L3QtdC8INC+0LHRgNCw0LHQvtGC0YfQuNC60LUg0YHQvtCx0YvRgtC40Lkg0L7QsdGK0LXQutGCXG4gICAqIHRoaXMg0L3QtdC00L7RgdGC0YPQv9C10L0g0L/QvtGN0YLQvtC80YMg0LTQvtGB0YLRg9C/INC6INGN0LrQt9C10LzQv9C70Y/RgNGDINC60LvQsNGB0YHQsCDRgNC10LDQu9C40LfRg9C10YLRgdGPINGH0LXRgNC10Lcg0YHRgtCw0YLQuNGH0LXRgdC60LjQuSDQvNCw0YHRgdC40LIg0LLRgdC10YUg0YHQvtC30LTQsNC90L3Ri9GFINGN0LrQt9C10LzQv9C70Y/RgNC+0LJcbiAgICog0LrQu9Cw0YHRgdCwINC4INC40LTQtdC90YLQuNGE0LjQutCw0YLQvtGA0LAg0LrQsNC90LLQsNGB0LAsINCy0YvRgdGC0YPQv9Cw0Y7RidC10LPQviDQuNC90LTQtdC60YHQvtC8INCyINGN0YLQvtC8INC80LDRgdGB0LjQstC1LlxuICAgKlxuICAgKiBAcGFyYW0gZXZlbnQgLSDQodC+0LHRi9GC0LjQtSDQvNGL0YjQuC/RgtGA0LXQutC/0LDQtNCwLlxuICAgKi9cbiAgcHJvdGVjdGVkIGhhbmRsZU1vdXNlV2hlZWwoZXZlbnQ6IFdoZWVsRXZlbnQpOiB2b2lkIHtcblxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc3QgW2NsaXBYLCBjbGlwWV0gPSB0aGlzLmdldENsaXBTcGFjZU1vdXNlUG9zaXRpb24uY2FsbCh0aGlzLCBldmVudCk7XG5cbiAgICAvLyBwb3NpdGlvbiBiZWZvcmUgem9vbWluZ1xuICAgIGNvbnN0IFtwcmVab29tWCwgcHJlWm9vbVldID0gbTMudHJhbnNmb3JtUG9pbnQobTMuaW52ZXJzZSh0aGlzLnRyYW5zZm9ybS52aWV3UHJvamVjdGlvbk1hdCksIFtjbGlwWCwgY2xpcFldKTtcblxuICAgIC8vIG11bHRpcGx5IHRoZSB3aGVlbCBtb3ZlbWVudCBieSB0aGUgY3VycmVudCB6b29tIGxldmVsLCBzbyB3ZSB6b29tIGxlc3Mgd2hlbiB6b29tZWQgaW4gYW5kIG1vcmUgd2hlbiB6b29tZWQgb3V0XG4gICAgY29uc3QgbmV3Wm9vbSA9IHRoaXMuY2FtZXJhLnpvb20hICogTWF0aC5wb3coMiwgZXZlbnQuZGVsdGFZICogLTAuMDEpO1xuICAgIHRoaXMuY2FtZXJhLnpvb20gPSBNYXRoLm1heCgwLjAwMiwgTWF0aC5taW4oMjAwLCBuZXdab29tKSk7XG5cbiAgICB0aGlzLnVwZGF0ZVZpZXdQcm9qZWN0aW9uLmNhbGwodGhpcyk7XG5cbiAgICAvLyBwb3NpdGlvbiBhZnRlciB6b29taW5nXG4gICAgY29uc3QgW3Bvc3Rab29tWCwgcG9zdFpvb21ZXSA9IG0zLnRyYW5zZm9ybVBvaW50KG0zLmludmVyc2UodGhpcy50cmFuc2Zvcm0udmlld1Byb2plY3Rpb25NYXQpLCBbY2xpcFgsIGNsaXBZXSk7XG5cbiAgICAvLyBjYW1lcmEgbmVlZHMgdG8gYmUgbW92ZWQgdGhlIGRpZmZlcmVuY2Ugb2YgYmVmb3JlIGFuZCBhZnRlclxuICAgIHRoaXMuY2FtZXJhLnghICs9IHByZVpvb21YIC0gcG9zdFpvb21YO1xuICAgIHRoaXMuY2FtZXJhLnkhICs9IHByZVpvb21ZIC0gcG9zdFpvb21ZO1xuXG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxufVxuIiwiaW1wb3J0IFNQbG90IGZyb20gJy4vc3Bsb3QnXG5pbXBvcnQgeyBqc29uU3RyaW5naWZ5LCBnZXRDdXJyZW50VGltZSB9IGZyb20gJy4vdXRpbHMnXG5cbi8qKlxuICog0KLQuNC/INC00LvRjyDQv9Cw0YDQsNC80LXRgtGA0L7QsiDRgNC10LbQuNC80LAg0L7RgtC70LDQtNC60LguXG4gKlxuICogQHBhcmFtIGlzRW5hYmxlIC0g0J/RgNC40LfQvdCw0Log0LLQutC70Y7Rh9C10L3QuNGPINC+0YLQu9Cw0LTQvtGH0L3QvtCz0L4g0YDQtdC20LjQvNCwLlxuICogQHBhcmFtIGhlYWRlclN0eWxlIC0g0KHRgtC40LvRjCDQtNC70Y8g0LfQsNCz0L7Qu9C+0LLQutCwINCy0YHQtdCz0L4g0L7RgtC70LDQtNC+0YfQvdC+0LPQviDQsdC70L7QutCwLlxuICogQHBhcmFtIGdyb3VwU3R5bGUgLSDQodGC0LjQu9GMINC00LvRjyDQt9Cw0LPQvtC70L7QstC60LAg0LPRgNGD0L/Qv9C40YDQvtCy0LrQuCDQvtGC0LvQsNC00L7Rh9C90YvRhSDQtNCw0L3QvdGL0YUuXG4gKlxuICogQHRvZG8g0KDQtdCw0LvQuNC30L7QstCw0YLRjCDQtNC+0L/QvtC70L3QuNGC0LXQu9GM0L3Ri9C1INC80LXRgdGC0LAg0LLRi9Cy0L7QtNCwIG91dHB1dDogJ2NvbnNvbGUnIHwgJ2RvY3VtZW50JyB8ICdmaWxlJ1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTUGxvdERlYnVnIHtcblxuICBwdWJsaWMgaXNFbmFibGU6IGJvb2xlYW4gPSBmYWxzZVxuICBwdWJsaWMgaGVhZGVyU3R5bGU6IHN0cmluZyA9ICdmb250LXdlaWdodDogYm9sZDsgY29sb3I6ICNmZmZmZmY7IGJhY2tncm91bmQtY29sb3I6ICNjYzAwMDA7J1xuICBwdWJsaWMgZ3JvdXBTdHlsZTogc3RyaW5nID0gJ2ZvbnQtd2VpZ2h0OiBib2xkOyBjb2xvcjogI2ZmZmZmZjsnXG5cbiAgcHJpdmF0ZSBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50IHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkXG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSByZWFkb25seSBzcGxvdDogU1Bsb3RcbiAgKSB7fVxuXG4gIC8qKiDQn9C+0LTQs9C+0YLQvtCy0LrQsCDQuiDQuNGB0L/QvtC70YzQt9C+0LLQsNC90LjRjiDQvtGC0LvQsNC00L7Rh9C90L7Qs9C+INGA0LXQttC40LzQsC4gKi9cbiAgcHVibGljIHByZXBhcmUoY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCk6IHZvaWQge1xuICAgIHRoaXMuY2FudmFzID0gY2FudmFzXG4gIH1cblxuICBwdWJsaWMgbG9nSW50cm8oKTogdm9pZCB7XG4gICAgY29uc29sZS5sb2coJyVj0J7RgtC70LDQtNC60LAgU1Bsb3Qg0L3QsCDQvtCx0YrQtdC60YLQtSAjJyArIHRoaXMuY2FudmFzIS5pZCwgdGhpcy5oZWFkZXJTdHlsZSlcblxuICAgIGlmICh0aGlzLnNwbG90LmRlbW8uaXNFbmFibGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKCclY9CS0LrQu9GO0YfQtdC9INC00LXQvNC+0L3RgdGC0YDQsNGG0LjQvtC90L3Ri9C5INGA0LXQttC40Lwg0LTQsNC90L3Ri9GFJywgdGhpcy5ncm91cFN0eWxlKVxuICAgIH1cblxuICAgIGNvbnNvbGUuZ3JvdXAoJyVj0J/RgNC10LTRg9C/0YDQtdC20LTQtdC90LjQtScsIHRoaXMuZ3JvdXBTdHlsZSlcbiAgICBjb25zb2xlLmxvZygn0J7RgtC60YDRi9GC0LDRjyDQutC+0L3RgdC+0LvRjCDQsdGA0LDRg9C30LXRgNCwINC4INC00YDRg9Cz0LjQtSDQsNC60YLQuNCy0L3Ri9C1INGB0YDQtdC00YHRgtCy0LAg0LrQvtC90YLRgNC+0LvRjyDRgNCw0LfRgNCw0LHQvtGC0LrQuCDRgdGD0YnQtdGB0YLQstC10L3QvdC+INGB0L3QuNC20LDRjtGCINC/0YDQvtC40LfQstC+0LTQuNGC0LXQu9GM0L3QvtGB0YLRjCDQstGL0YHQvtC60L7QvdCw0LPRgNGD0LbQtdC90L3Ri9GFINC/0YDQuNC70L7QttC10L3QuNC5LiDQlNC70Y8g0L7QsdGK0LXQutGC0LjQstC90L7Qs9C+INCw0L3QsNC70LjQt9CwINC/0YDQvtC40LfQstC+0LTQuNGC0LXQu9GM0L3QvtGB0YLQuCDQstGB0LUg0L/QvtC00L7QsdC90YvQtSDRgdGA0LXQtNGB0YLQstCwINC00L7Qu9C20L3RiyDQsdGL0YLRjCDQvtGC0LrQu9GO0YfQtdC90YssINCwINC60L7QvdGB0L7Qu9GMINCx0YDQsNGD0LfQtdGA0LAg0LfQsNC60YDRi9GC0LAuINCd0LXQutC+0YLQvtGA0YvQtSDQtNCw0L3QvdGL0LUg0L7RgtC70LDQtNC+0YfQvdC+0Lkg0LjQvdGE0L7RgNC80LDRhtC40Lgg0LIg0LfQsNCy0LjRgdC40LzQvtGB0YLQuCDQvtGCINC40YHQv9C+0LvRjNC30YPQtdC80L7Qs9C+INCx0YDQsNGD0LfQtdGA0LAg0LzQvtCz0YPRgiDQvdC1INC+0YLQvtCx0YDQsNC20LDRgtGM0YHRjyDQuNC70Lgg0L7RgtC+0LHRgNCw0LbQsNGC0YzRgdGPINC90LXQutC+0YDRgNC10LrRgtC90L4uINCh0YDQtdC00YHRgtCy0L4g0L7RgtC70LDQtNC60Lgg0L/RgNC+0YLQtdGB0YLQuNGA0L7QstCw0L3QviDQsiDQsdGA0LDRg9C30LXRgNC1IEdvb2dsZSBDaHJvbWUgdi45MCcpXG4gICAgY29uc29sZS5ncm91cEVuZCgpXG4gIH1cblxuICBwdWJsaWMgbG9nR3B1SW5mbyhoYXJkd2FyZTogc3RyaW5nLCBzb2Z0d2FyZTogc3RyaW5nKTogdm9pZCB7XG4gICAgY29uc29sZS5ncm91cCgnJWPQktC40LTQtdC+0YHQuNGB0YLQtdC80LAnLCB0aGlzLmdyb3VwU3R5bGUpXG4gICAgY29uc29sZS5sb2coJ9CT0YDQsNGE0LjRh9C10YHQutCw0Y8g0LrQsNGA0YLQsDogJyArIGhhcmR3YXJlKVxuICAgIGNvbnNvbGUubG9nKCfQktC10YDRgdC40Y8gR0w6ICcgKyBzb2Z0d2FyZSlcbiAgICBjb25zb2xlLmdyb3VwRW5kKClcbiAgfVxuXG4gIHB1YmxpYyBsb2dJbnN0YW5jZUluZm8oc3Bsb3Q6IFNQbG90LCBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50LCBvcHRpb25zOiBTUGxvdE9wdGlvbnMpOiB2b2lkIHtcblxuICAgIGNvbnNvbGUuZ3JvdXAoJyVj0J3QsNGB0YLRgNC+0LnQutCwINC/0LDRgNCw0LzQtdGC0YDQvtCyINGN0LrQt9C10LzQv9C70Y/RgNCwJywgdGhpcy5ncm91cFN0eWxlKVxuICAgIGNvbnNvbGUuZGlyKHNwbG90KVxuICAgIGNvbnNvbGUubG9nKCfQn9C+0LvRjNC30L7QstCw0YLQtdC70YzRgdC60LjQtSDQvdCw0YHRgtGA0L7QudC60Lg6XFxuJywganNvblN0cmluZ2lmeShvcHRpb25zKSlcbiAgICBjb25zb2xlLmxvZygn0JrQsNC90LLQsNGBOiAjJyArIGNhbnZhcy5pZClcbiAgICBjb25zb2xlLmxvZygn0KDQsNC30LzQtdGAINC60LDQvdCy0LDRgdCwOiAnICsgY2FudmFzLndpZHRoICsgJyB4ICcgKyBjYW52YXMuaGVpZ2h0ICsgJyBweCcpXG4gICAgY29uc29sZS5sb2coJ9Cg0LDQt9C80LXRgCDQv9C70L7RgdC60L7RgdGC0Lg6ICcgKyBzcGxvdC5ncmlkLndpZHRoICsgJyB4ICcgKyBzcGxvdC5ncmlkLmhlaWdodCArICcgcHgnKVxuXG4gICAgaWYgKHNwbG90LmRlbW8uaXNFbmFibGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKCfQodC/0L7RgdC+0LEg0L/QvtC70YPRh9C10L3QuNGPINC00LDQvdC90YvRhTogJyArICfQtNC10LzQvi3QtNCw0L3QvdGL0LUnKVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZygn0KHQv9C+0YHQvtCxINC/0L7Qu9GD0YfQtdC90LjRjyDQtNCw0L3QvdGL0YU6ICcgKyAn0LjRgtC10YDQuNGA0L7QstCw0L3QuNC1JylcbiAgICB9XG4gICAgY29uc29sZS5ncm91cEVuZCgpXG4gIH1cblxuICBwdWJsaWMgbG9nU2hhZGVySW5mbyhzaGFkZXJUeXBlOiBzdHJpbmcsIHNoYWRlckNvZGU6IHN0cmluZywgKTogdm9pZCB7XG4gICAgY29uc29sZS5ncm91cCgnJWPQodC+0LfQtNCw0L0g0YjQtdC50LTQtdGAIFsnICsgc2hhZGVyVHlwZSArICddJywgdGhpcy5ncm91cFN0eWxlKVxuICAgIGNvbnNvbGUubG9nKHNoYWRlckNvZGUpXG4gICAgY29uc29sZS5ncm91cEVuZCgpXG4gIH1cblxuICBwdWJsaWMgbG9nRGF0YUxvYWRpbmdTdGFydCgpOiB2b2lkIHtcbiAgICBjb25zb2xlLmxvZygnJWPQl9Cw0L/Rg9GJ0LXQvSDQv9GA0L7RhtC10YHRgSDQt9Cw0LPRgNGD0LfQutC4INC00LDQvdC90YvRhSBbJyArIGdldEN1cnJlbnRUaW1lKCkgKyAnXS4uLicsIHRoaXMuZ3JvdXBTdHlsZSlcbiAgICBjb25zb2xlLnRpbWUoJ9CU0LvQuNGC0LXQu9GM0L3QvtGB0YLRjCcpXG4gIH1cblxuICBwdWJsaWMgbG9nRGF0YUxvYWRpbmdDb21wbGV0ZShjb3VudGVyOiBudW1iZXIsIGxpbWl0OiBudW1iZXIpOiB2b2lkIHtcbiAgICBjb25zb2xlLmdyb3VwKCclY9CX0LDQs9GA0YPQt9C60LAg0LTQsNC90L3Ri9GFINC30LDQstC10YDRiNC10L3QsCBbJyArIGdldEN1cnJlbnRUaW1lKCkgKyAnXScsIHRoaXMuZ3JvdXBTdHlsZSlcbiAgICBjb25zb2xlLnRpbWVFbmQoJ9CU0LvQuNGC0LXQu9GM0L3QvtGB0YLRjCcpXG4gICAgY29uc29sZS5sb2coJ9Ca0L7Quy3QstC+INC+0LHRitC10LrRgtC+0LI6ICcgKyBjb3VudGVyLnRvTG9jYWxlU3RyaW5nKCkpXG4gICAgY29uc29sZS5sb2coJ9Cg0LXQt9GD0LvRjNGC0LDRgjogJyArXG4gICAgICAoKGNvdW50ZXIgPj0gbGltaXQpID9cbiAgICAgICfQtNC+0YHRgtC40LPQvdGD0YIg0LfQsNC00LDQvdC90YvQuSDQu9C40LzQuNGCICgnICsgbGltaXQudG9Mb2NhbGVTdHJpbmcoKSArICcpJyA6XG4gICAgICAn0L7QsdGA0LDQsdC+0YLQsNC90Ysg0LLRgdC1INC+0LHRitC10LrRgtGLJykpXG4gICAgY29uc29sZS5ncm91cEVuZCgpXG4gIH1cblxuICBwdWJsaWMgbG9nR3B1TWVtU3RhdHMoc3RhdHM6IGFueSk6IHZvaWQge1xuXG4gICAgY29uc29sZS5ncm91cCgnJWPQoNCw0YHRhdC+0LQg0LLQuNC00LXQvtC/0LDQvNGP0YLQuDogJyArIChzdGF0cy5tZW1Vc2FnZSAvIDEwMDAwMDApLnRvRml4ZWQoMikudG9Mb2NhbGVTdHJpbmcoKSArICcg0JzQkScsIHRoaXMuZ3JvdXBTdHlsZSlcbiAgICAvKmNvbnNvbGUubG9nKCfQmtC+0Lst0LLQviDQs9GA0YPQv9C/INCx0YPRhNC10YDQvtCyOiAnICsgc3RhdHMuZ3JvdXBzQ291bnQudG9Mb2NhbGVTdHJpbmcoKSlcbiAgICBjb25zb2xlLmxvZygn0JrQvtC7LdCy0L4gR0wt0YLRgNC10YPQs9C+0LvRjNC90LjQutC+0LI6ICcgKyAoYnVmZmVycy5hbW91bnRPZlRvdGFsR0xWZXJ0aWNlcyAvIDMpLnRvTG9jYWxlU3RyaW5nKCkpXG4gICAgY29uc29sZS5sb2coJ9Ca0L7Quy3QstC+INCy0LXRgNGI0LjQvTogJyArIHN0YXRzLm9iamVjdHNDb3VudFRvdGFsLnRvTG9jYWxlU3RyaW5nKCkpKi9cblxuICAgIGNvbnNvbGUuZ3JvdXBFbmQoKVxuICB9XG5cbiAgcHVibGljIGxvZ1JlbmRlclN0YXJ0ZWQoKSB7XG4gICAgY29uc29sZS5sb2coJyVj0KDQtdC90LTQtdGA0LjQvdCzINC30LDQv9GD0YnQtdC9JywgdGhpcy5ncm91cFN0eWxlKVxuICB9XG5cbiAgcHVibGljIGxvZ1JlbmRlclN0b3BlZCgpIHtcbiAgICBjb25zb2xlLmxvZygnJWPQoNC10L3QtNC10YDQuNC90LMg0L7RgdGC0LDQvdC+0LLQu9C10L0nLCB0aGlzLmdyb3VwU3R5bGUpXG4gIH1cblxuICBwdWJsaWMgbG9nQ2FudmFzQ2xlYXJlZChjb2xvcjogc3RyaW5nKSB7XG4gICAgY29uc29sZS5sb2coJyVj0JrQvtC90YLQtdC60YHRgiDRgNC10L3QtNC10YDQuNC90LPQsCDQvtGH0LjRidC10L0gWycgKyBjb2xvciArICddJywgdGhpcy5ncm91cFN0eWxlKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgcmFuZG9tSW50IH0gZnJvbSAnLi91dGlscydcbmltcG9ydCBTUGxvdCBmcm9tICcuL3NwbG90J1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTUGxvdERlbW8ge1xuXG4gIC8qKiDQn9GA0LjQt9C90LDQuiDQsNC60YLQuNCy0LDRhtC40Lgg0LTQtdC80L4t0YDQtdC20LjQvNCwLiAqL1xuICBwdWJsaWMgaXNFbmFibGU6IGJvb2xlYW4gPSBmYWxzZVxuXG4gIC8qKiDQmtC+0LvQuNGH0LXRgdGC0LLQviDQsdGK0LXQutGC0L7Qsi4gKi9cbiAgcHVibGljIGFtb3VudDogbnVtYmVyID0gMV8wMDBfMDAwXG5cbiAgLyoqINCc0LjQvdC40LzQsNC70YzQvdGL0Lkg0YDQsNC30LzQtdGAINC+0LHRitC10LrRgtC+0LIuICovXG4gIHB1YmxpYyBzaXplTWluOiBudW1iZXIgPSAxMFxuXG4gIC8qKiDQnNCw0LrRgdC40LzQsNC70YzQvdGL0Lkg0YDQsNC30LzQtdGAINC+0LHRitC10LrRgtC+0LIuICovXG4gIHB1YmxpYyBzaXplTWF4OiBudW1iZXIgPSAzMFxuXG4gIC8qKiDQptCy0LXRgtC+0LLQsNGPINC/0LDQu9C40YLRgNCwINC+0LHRitC10LrRgtC+0LIuICovXG4gIHB1YmxpYyBjb2xvcnM6IHN0cmluZ1tdID0gW1xuICAgICcjRDgxQzAxJywgJyNFOTk2N0EnLCAnI0JBNTVEMycsICcjRkZENzAwJywgJyNGRkU0QjUnLCAnI0ZGOEMwMCcsXG4gICAgJyMyMjhCMjInLCAnIzkwRUU5MCcsICcjNDE2OUUxJywgJyMwMEJGRkYnLCAnIzhCNDUxMycsICcjMDBDRUQxJ1xuICBdXG5cbiAgLyoqINCh0YfQtdGC0YfQuNC6INC40YLQtdGA0LjRgNGD0LXQvNGL0YUg0L7QsdGK0LXQutGC0L7Qsi4gKi9cbiAgcHJpdmF0ZSBpbmRleDogbnVtYmVyID0gMFxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcmVhZG9ubHkgc3Bsb3Q6IFNQbG90XG4gICkge31cblxuICAvKiog0J/QvtC00LPQvtGC0L7QstC60LAg0Log0LjRgdC/0L7Qu9GM0LfQvtCy0LDQvdC40Y4g0LTQtdC80L4t0YDQtdC20LjQvNCwLiAqL1xuICBwdWJsaWMgcHJlcGFyZSgpOiB2b2lkIHtcbiAgICB0aGlzLmluZGV4ID0gMFxuICB9XG5cbiAgLyoqINCY0LzQuNGC0LDRhtC40Y8g0LjRgtC10YDQsNGC0L7RgNCwINC40YHRhdC+0LTQvdGL0YUg0L7QsdGK0LXQutGC0L7Qsi4gKi9cbiAgcHVibGljIGl0ZXJhdG9yKCk6IFNQbG90T2JqZWN0IHwgbnVsbCB7XG4gICAgaWYgKHRoaXMuaW5kZXggPCB0aGlzLmFtb3VudCkge1xuICAgICAgdGhpcy5pbmRleCsrXG4gICAgICByZXR1cm4ge1xuICAgICAgICB4OiByYW5kb21JbnQodGhpcy5zcGxvdC5ncmlkLndpZHRoISksXG4gICAgICAgIHk6IHJhbmRvbUludCh0aGlzLnNwbG90LmdyaWQuaGVpZ2h0ISksXG4gICAgICAgIHNoYXBlOiByYW5kb21JbnQodGhpcy5zcGxvdC5zaGFwZXNDb3VudCksXG4gICAgICAgIHNpemU6IHRoaXMuc2l6ZU1pbiArIHJhbmRvbUludCh0aGlzLnNpemVNYXggLSB0aGlzLnNpemVNaW4gKyAxKSxcbiAgICAgICAgY29sb3I6IHJhbmRvbUludCh0aGlzLmNvbG9ycy5sZW5ndGgpXG4gICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7IGNvbG9yRnJvbUhleFRvR2xSZ2IgfSBmcm9tICcuL3V0aWxzJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTUGxvdFdlYkdsIHtcblxuICBwdWJsaWMgYWxwaGE6IGJvb2xlYW4gPSBmYWxzZVxuICBwdWJsaWMgZGVwdGg6IGJvb2xlYW4gPSBmYWxzZVxuICBwdWJsaWMgc3RlbmNpbDogYm9vbGVhbiA9IGZhbHNlXG4gIHB1YmxpYyBhbnRpYWxpYXM6IGJvb2xlYW4gPSBmYWxzZVxuICBwdWJsaWMgZGVzeW5jaHJvbml6ZWQ6IGJvb2xlYW4gPSBmYWxzZVxuICBwdWJsaWMgcHJlbXVsdGlwbGllZEFscGhhOiBib29sZWFuID0gZmFsc2VcbiAgcHVibGljIHByZXNlcnZlRHJhd2luZ0J1ZmZlcjogYm9vbGVhbiA9IGZhbHNlXG4gIHB1YmxpYyBmYWlsSWZNYWpvclBlcmZvcm1hbmNlQ2F2ZWF0OiBib29sZWFuID0gZmFsc2VcbiAgcHVibGljIHBvd2VyUHJlZmVyZW5jZTogV2ViR0xQb3dlclByZWZlcmVuY2UgPSAnaGlnaC1wZXJmb3JtYW5jZSdcblxuICBwdWJsaWMgZ3B1ID0geyBoYXJkd2FyZTogJycsIHNvZnR3YXJlOiAnJyB9XG4gIHB1YmxpYyBjYW52YXMhOiBIVE1MQ2FudmFzRWxlbWVudFxuICBwdWJsaWMgZ2whOiBXZWJHTFJlbmRlcmluZ0NvbnRleHRcbiAgcHJpdmF0ZSBncHVQcm9ncmFtITogV2ViR0xQcm9ncmFtXG5cbiAgcHJpdmF0ZSB2YXJpYWJsZXM6IE1hcDxzdHJpbmcsIGFueT4gPSBuZXcgTWFwKClcblxuICBwdWJsaWMgZGF0YTogTWFwPHN0cmluZywge2J1ZmZlcnM6IFdlYkdMQnVmZmVyW10sIHR5cGU6IG51bWJlcn0+ID0gbmV3IE1hcCgpXG5cbiAgcHJpdmF0ZSBnbE51bWJlclR5cGVzOiBNYXA8c3RyaW5nLCBudW1iZXI+ID0gbmV3IE1hcCgpXG5cbiAgcHVibGljIHByZXBhcmUoY2FudmFzSWQ6IHN0cmluZykge1xuICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChjYW52YXNJZCkpIHtcbiAgICAgIHRoaXMuY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY2FudmFzSWQpIGFzIEhUTUxDYW52YXNFbGVtZW50XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcign0JrQsNC90LLQsNGBINGBINC40LTQtdC90YLQuNGE0LjQutCw0YLQvtGA0L7QvCBcIiMnICsgY2FudmFzSWQgKyAnXCIg0L3QtSDQvdCw0LnQtNC10L0hJylcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICog0KHQvtC30LTQsNC10YIg0LrQvtC90YLQtdC60YHRgiDRgNC10L3QtNC10YDQuNC90LPQsCBXZWJHTCDQuCDRg9GB0YLQsNC90LDQstC70LjQstCw0LXRgiDQutC+0YDRgNC10LrRgtC90YvQuSDRgNCw0LfQvNC10YAg0L7QsdC70LDRgdGC0Lgg0L/RgNC+0YHQvNC+0YLRgNCwLlxuICAgKi9cbiAgcHVibGljIGNyZWF0ZSgpOiB2b2lkIHtcblxuICAgIHRoaXMuZ2wgPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCd3ZWJnbCcsIHtcbiAgICAgIGFscGhhOiB0aGlzLmFscGhhLFxuICAgICAgZGVwdGg6IHRoaXMuZGVwdGgsXG4gICAgICBzdGVuY2lsOiB0aGlzLnN0ZW5jaWwsXG4gICAgICBhbnRpYWxpYXM6IHRoaXMuYW50aWFsaWFzLFxuICAgICAgZGVzeW5jaHJvbml6ZWQ6IHRoaXMuZGVzeW5jaHJvbml6ZWQsXG4gICAgICBwcmVtdWx0aXBsaWVkQWxwaGE6IHRoaXMucHJlbXVsdGlwbGllZEFscGhhLFxuICAgICAgcHJlc2VydmVEcmF3aW5nQnVmZmVyOiB0aGlzLnByZXNlcnZlRHJhd2luZ0J1ZmZlcixcbiAgICAgIGZhaWxJZk1ham9yUGVyZm9ybWFuY2VDYXZlYXQ6IHRoaXMuZmFpbElmTWFqb3JQZXJmb3JtYW5jZUNhdmVhdCxcbiAgICAgIHBvd2VyUHJlZmVyZW5jZTogdGhpcy5wb3dlclByZWZlcmVuY2VcbiAgICB9KSFcblxuICAgIGxldCBleHQgPSB0aGlzLmdsLmdldEV4dGVuc2lvbignV0VCR0xfZGVidWdfcmVuZGVyZXJfaW5mbycpXG4gICAgdGhpcy5ncHUuaGFyZHdhcmUgPSAoZXh0KSA/IHRoaXMuZ2wuZ2V0UGFyYW1ldGVyKGV4dC5VTk1BU0tFRF9SRU5ERVJFUl9XRUJHTCkgOiAnW9C90LXQuNC30LLQtdGB0YLQvdC+XSdcbiAgICB0aGlzLmdwdS5zb2Z0d2FyZSA9IHRoaXMuZ2wuZ2V0UGFyYW1ldGVyKHRoaXMuZ2wuVkVSU0lPTilcblxuICAgIHRoaXMuZ2xOdW1iZXJUeXBlcy5zZXQoJ0Zsb2F0MzJBcnJheScsIHRoaXMuZ2wuRkxPQVQpXG4gICAgdGhpcy5nbE51bWJlclR5cGVzLnNldCgnVWludDhBcnJheScsIHRoaXMuZ2wuVU5TSUdORURfQllURSlcbiAgICB0aGlzLmdsTnVtYmVyVHlwZXMuc2V0KCdVaW50MTZBcnJheScsIHRoaXMuZ2wuVU5TSUdORURfU0hPUlQpXG4gICAgdGhpcy5nbE51bWJlclR5cGVzLnNldCgnSW50OEFycmF5JywgdGhpcy5nbC5CWVRFKVxuICAgIHRoaXMuZ2xOdW1iZXJUeXBlcy5zZXQoJ0ludDE2QXJyYXknLCB0aGlzLmdsLlNIT1JUKVxuXG4gICAgdGhpcy5jYW52YXMud2lkdGggPSB0aGlzLmNhbnZhcy5jbGllbnRXaWR0aFxuICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IHRoaXMuY2FudmFzLmNsaWVudEhlaWdodFxuXG4gICAgdGhpcy5nbC52aWV3cG9ydCgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KVxuICB9XG5cbiAgcHVibGljIHNldEJnQ29sb3IoY29sb3I6IHN0cmluZykge1xuICAgIGxldCBbciwgZywgYl0gPSBjb2xvckZyb21IZXhUb0dsUmdiKGNvbG9yKVxuICAgIHRoaXMuZ2wuY2xlYXJDb2xvcihyLCBnLCBiLCAwLjApXG4gIH1cblxuICBwdWJsaWMgY2xlYXJCYWNrZ3JvdW5kKCkge1xuICAgIHRoaXMuZ2wuY2xlYXIodGhpcy5nbC5DT0xPUl9CVUZGRVJfQklUKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDQodC+0LfQtNCw0LXRgiDRiNC10LnQtNC10YAgV2ViR0wuXG4gICAqXG4gICAqIEBwYXJhbSBzaGFkZXJUeXBlINCi0LjQvyDRiNC10LnQtNC10YDQsC5cbiAgICogQHBhcmFtIHNoYWRlckNvZGUg0JrQvtC0INGI0LXQudC00LXRgNCwINC90LAg0Y/Qt9GL0LrQtSBHTFNMLlxuICAgKiBAcmV0dXJucyDQodC+0LfQtNCw0L3QvdGL0Lkg0L7QsdGK0LXQutGCINGI0LXQudC00LXRgNCwLlxuICAgKi9cbiAgcHVibGljIGNyZWF0ZVNoYWRlcihzaGFkZXJUeXBlOiAnVkVSVEVYX1NIQURFUicgfCAnRlJBR01FTlRfU0hBREVSJywgc2hhZGVyQ29kZTogc3RyaW5nKTogV2ViR0xTaGFkZXIge1xuXG4gICAgLy8g0KHQvtC30LTQsNC90LjQtSwg0L/RgNC40LLRj9C30LrQsCDQutC+0LTQsCDQuCDQutC+0LzQv9C40LvRj9GG0LjRjyDRiNC10LnQtNC10YDQsC5cbiAgICBjb25zdCBzaGFkZXIgPSB0aGlzLmdsLmNyZWF0ZVNoYWRlcih0aGlzLmdsW3NoYWRlclR5cGVdKSFcbiAgICB0aGlzLmdsLnNoYWRlclNvdXJjZShzaGFkZXIsIHNoYWRlckNvZGUpXG4gICAgdGhpcy5nbC5jb21waWxlU2hhZGVyKHNoYWRlcilcblxuICAgIGlmICghdGhpcy5nbC5nZXRTaGFkZXJQYXJhbWV0ZXIoc2hhZGVyLCB0aGlzLmdsLkNPTVBJTEVfU1RBVFVTKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCfQntGI0LjQsdC60LAg0LrQvtC80L/QuNC70Y/RhtC40Lgg0YjQtdC50LTQtdGA0LAgWycgKyBzaGFkZXJUeXBlICsgJ10uICcgKyB0aGlzLmdsLmdldFNoYWRlckluZm9Mb2coc2hhZGVyKSlcbiAgICB9XG5cbiAgICByZXR1cm4gc2hhZGVyXG4gIH1cblxuICAvKipcbiAgICog0KHQvtC30LTQsNC10YIg0L/RgNC+0LPRgNCw0LzQvNGDIFdlYkdMLlxuICAgKlxuICAgKiBAcGFyYW0ge1dlYkdMU2hhZGVyfSB2ZXJ0ZXhTaGFkZXIg0JLQtdGA0YjQuNC90L3Ri9C5INGI0LXQudC00LXRgC5cbiAgICogQHBhcmFtIHtXZWJHTFNoYWRlcn0gZnJhZ21lbnRTaGFkZXIg0KTRgNCw0LPQvNC10L3RgtC90YvQuSDRiNC10LnQtNC10YAuXG4gICAqL1xuICBwdWJsaWMgY3JlYXRlUHJvZ3JhbUZyb21TaGFkZXJzKHNoYWRlclZlcnQ6IFdlYkdMU2hhZGVyLCBzaGFkZXJGcmFnOiBXZWJHTFNoYWRlcik6IHZvaWQge1xuICAgIHRoaXMuZ3B1UHJvZ3JhbSA9IHRoaXMuZ2wuY3JlYXRlUHJvZ3JhbSgpIVxuICAgIHRoaXMuZ2wuYXR0YWNoU2hhZGVyKHRoaXMuZ3B1UHJvZ3JhbSwgc2hhZGVyVmVydClcbiAgICB0aGlzLmdsLmF0dGFjaFNoYWRlcih0aGlzLmdwdVByb2dyYW0sIHNoYWRlckZyYWcpXG4gICAgdGhpcy5nbC5saW5rUHJvZ3JhbSh0aGlzLmdwdVByb2dyYW0pXG4gICAgdGhpcy5nbC51c2VQcm9ncmFtKHRoaXMuZ3B1UHJvZ3JhbSlcbiAgfVxuXG4gIHB1YmxpYyBjcmVhdGVQcm9ncmFtKHNoYWRlckNvZGVWZXJ0OiBzdHJpbmcsIHNoYWRlckNvZGVGcmFnOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLmNyZWF0ZVByb2dyYW1Gcm9tU2hhZGVycyhcbiAgICAgIHRoaXMuY3JlYXRlU2hhZGVyKCdWRVJURVhfU0hBREVSJywgc2hhZGVyQ29kZVZlcnQpLFxuICAgICAgdGhpcy5jcmVhdGVTaGFkZXIoJ0ZSQUdNRU5UX1NIQURFUicsIHNoYWRlckNvZGVGcmFnKVxuICAgIClcbiAgfVxuXG4gIC8qKlxuICAgKiDQo9GB0YLQsNC90LDQstC70LjQstCw0LXRgiDRgdCy0Y/Qt9GMINC/0LXRgNC10LzQtdC90L3QvtC5INC/0YDQuNC70L7QttC10L3QuNGPINGBINC/0YDQvtCz0YDQsNC80LzQvtC5IFdlYkdsLlxuICAgKlxuICAgKiBAcGFyYW0gdmFyVHlwZSDQotC40L8g0L/QtdGA0LXQvNC10L3QvdC+0LkuXG4gICAqIEBwYXJhbSB2YXJOYW1lINCY0LzRjyDQv9C10YDQtdC80LXQvdC90L7QuS5cbiAgICovXG4gIHB1YmxpYyBjcmVhdGVWYXJpYWJsZSh2YXJOYW1lOiBzdHJpbmcpOiB2b2lkIHtcblxuICAgIGNvbnN0IHZhclR5cGUgPSB2YXJOYW1lLnNsaWNlKDAsIDIpXG5cbiAgICBpZiAodmFyVHlwZSA9PT0gJ3VfJykge1xuICAgICAgdGhpcy52YXJpYWJsZXMuc2V0KHZhck5hbWUsIHRoaXMuZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHRoaXMuZ3B1UHJvZ3JhbSwgdmFyTmFtZSkpXG4gICAgfSBlbHNlIGlmICh2YXJUeXBlID09PSAnYV8nKSB7XG4gICAgICB0aGlzLnZhcmlhYmxlcy5zZXQodmFyTmFtZSwgdGhpcy5nbC5nZXRBdHRyaWJMb2NhdGlvbih0aGlzLmdwdVByb2dyYW0sIHZhck5hbWUpKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ9Cd0LUg0YPQutCw0LfQsNC9INGC0LjQvyAo0L/RgNC10YTQuNC60YEpINC/0LXRgNC10LzQtdC90L3QvtC5INGI0LXQudC00LXRgNCwOiAnICsgdmFyTmFtZSlcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgY3JlYXRlVmFyaWFibGVzKC4uLnZhck5hbWVzOiBzdHJpbmdbXSk6IHZvaWQge1xuICAgIHZhck5hbWVzLmZvckVhY2godmFyTmFtZSA9PiB0aGlzLmNyZWF0ZVZhcmlhYmxlKHZhck5hbWUpKTtcbiAgfVxuICAvKipcbiAgICog0KHQvtC30LTQsNC10YIg0LIg0LzQsNGB0YHQuNCy0LUg0LHRg9GE0LXRgNC+0LIgV2ViR0wg0L3QvtCy0YvQuSDQsdGD0YTQtdGAINC4INC30LDQv9C40YHRi9Cy0LDQtdGCINCyINC90LXQs9C+INC/0LXRgNC10LTQsNC90L3Ri9C1INC00LDQvdC90YvQtS5cbiAgICpcbiAgICogQHBhcmFtIGJ1ZmZlcnMgLSDQnNCw0YHRgdC40LIg0LHRg9GE0LXRgNC+0LIgV2ViR0wsINCyINC60L7RgtC+0YDRi9C5INCx0YPQtNC10YIg0LTQvtCx0LDQstC70LXQvSDRgdC+0LfQtNCw0LLQsNC10LzRi9C5INCx0YPRhNC10YAuXG4gICAqIEBwYXJhbSB0eXBlIC0g0KLQuNC/INGB0L7Qt9C00LDQstCw0LXQvNC+0LPQviDQsdGD0YTQtdGA0LAuXG4gICAqIEBwYXJhbSBkYXRhIC0g0JTQsNC90L3Ri9C1INCyINCy0LjQtNC1INGC0LjQv9C40LfQuNGA0L7QstCw0L3QvdC+0LPQviDQvNCw0YHRgdC40LLQsCDQtNC70Y8g0LfQsNC/0LjRgdC4INCyINGB0L7Qt9C00LDQstCw0LXQvNGL0Lkg0LHRg9GE0LXRgC5cbiAgICogQHBhcmFtIGtleSAtINCa0LvRjtGHICjQuNC90LTQtdC60YEpLCDQuNC00LXQvdGC0LjRhNC40YbQuNGA0YPRjtGJ0LjQuSDRgtC40L8g0LHRg9GE0LXRgNCwICjQtNC70Y8g0LLQtdGA0YjQuNC9LCDQtNC70Y8g0YbQstC10YLQvtCyLCDQtNC70Y8g0LjQvdC00LXQutGB0L7QsikuINCY0YHQv9C+0LvRjNC30YPQtdGC0YHRjyDQtNC70Y9cbiAgICogICAgINGA0LDQt9C00LXQu9GM0L3QvtCz0L4g0L/QvtC00YHRh9C10YLQsCDQv9Cw0LzRj9GC0LgsINC30LDQvdC40LzQsNC10LzQvtC5INC60LDQttC00YvQvCDRgtC40L/QvtC8INCx0YPRhNC10YDQsC5cbiAgICovXG4gIHB1YmxpYyBjcmVhdGVCdWZmZXIoZ3JvdXBOYW1lOiBzdHJpbmcsIGRhdGE6IFR5cGVkQXJyYXkpOiBudW1iZXIge1xuXG4gICAgY29uc3QgYnVmZmVyID0gdGhpcy5nbC5jcmVhdGVCdWZmZXIoKSFcbiAgICB0aGlzLmdsLmJpbmRCdWZmZXIodGhpcy5nbC5BUlJBWV9CVUZGRVIsIGJ1ZmZlcilcbiAgICB0aGlzLmdsLmJ1ZmZlckRhdGEodGhpcy5nbC5BUlJBWV9CVUZGRVIsIGRhdGEsIHRoaXMuZ2wuU1RBVElDX0RSQVcpXG5cbiAgICBpZiAoIXRoaXMuZGF0YS5oYXMoZ3JvdXBOYW1lKSkge1xuICAgICAgdGhpcy5kYXRhLnNldChncm91cE5hbWUsIHsgYnVmZmVyczogW10sIHR5cGU6IHRoaXMuZ2xOdW1iZXJUeXBlcy5nZXQoZGF0YS5jb25zdHJ1Y3Rvci5uYW1lKSF9KVxuICAgIH1cblxuICAgIHRoaXMuZGF0YS5nZXQoZ3JvdXBOYW1lKSEuYnVmZmVycy5wdXNoKGJ1ZmZlcilcblxuICAgIHJldHVybiBkYXRhLmxlbmd0aCAqIGRhdGEuQllURVNfUEVSX0VMRU1FTlRcbiAgfVxuXG4gIHB1YmxpYyBzZXRWYXJpYWJsZSh2YXJOYW1lOiBzdHJpbmcsIHZhclZhbHVlOiBudW1iZXJbXSkge1xuICAgIHRoaXMuZ2wudW5pZm9ybU1hdHJpeDNmdih0aGlzLnZhcmlhYmxlcy5nZXQodmFyTmFtZSksIGZhbHNlLCB2YXJWYWx1ZSlcbiAgfVxuXG4gIHB1YmxpYyBzZXRCdWZmZXIoZ3JvdXBOYW1lOiBzdHJpbmcsIGluZGV4OiBudW1iZXIsIHZhck5hbWU6IHN0cmluZywgc2l6ZTogbnVtYmVyLCBzdHJpZGU6IG51bWJlciwgb2Zmc2V0OiBudW1iZXIpIHtcbiAgICBjb25zdCBncm91cCA9IHRoaXMuZGF0YS5nZXQoZ3JvdXBOYW1lKSFcbiAgICBjb25zdCB2YXJpYWJsZSA9IHRoaXMudmFyaWFibGVzLmdldCh2YXJOYW1lKVxuXG4gICAgdGhpcy5nbC5iaW5kQnVmZmVyKHRoaXMuZ2wuQVJSQVlfQlVGRkVSLCBncm91cC5idWZmZXJzW2luZGV4XSlcbiAgICB0aGlzLmdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KHZhcmlhYmxlKVxuICAgIHRoaXMuZ2wudmVydGV4QXR0cmliUG9pbnRlcih2YXJpYWJsZSwgc2l6ZSwgZ3JvdXAudHlwZSwgZmFsc2UsIHN0cmlkZSwgb2Zmc2V0KVxuICB9XG5cbiAgcHVibGljIGRyYXdQb2ludHMoZmlyc3Q6IG51bWJlciwgY291bnQ6IG51bWJlcikge1xuICAgIHRoaXMuZ2wuZHJhd0FycmF5cyh0aGlzLmdsLlBPSU5UUywgZmlyc3QsIGNvdW50KVxuICB9XG59XG4iLCJpbXBvcnQgeyBjb3B5TWF0Y2hpbmdLZXlWYWx1ZXMsIGNvbG9yRnJvbUhleFRvR2xSZ2IgfSBmcm9tICcuL3V0aWxzJ1xuaW1wb3J0IFNIQURFUl9DT0RFX1ZFUlRfVE1QTCBmcm9tICcuL3NoYWRlci1jb2RlLXZlcnQtdG1wbCdcbmltcG9ydCBTSEFERVJfQ09ERV9GUkFHX1RNUEwgZnJvbSAnLi9zaGFkZXItY29kZS1mcmFnLXRtcGwnXG5pbXBvcnQgU1Bsb3RDb250b2wgZnJvbSAnLi9zcGxvdC1jb250cm9sJ1xuaW1wb3J0IFNQbG90V2ViR2wgZnJvbSAnLi9zcGxvdC13ZWJnbCdcbmltcG9ydCBTUGxvdERlYnVnIGZyb20gJy4vc3Bsb3QtZGVidWcnXG5pbXBvcnQgU1Bsb3REZW1vIGZyb20gJy4vc3Bsb3QtZGVtbydcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU1Bsb3Qge1xuXG4gIC8qKiDQpNGD0L3QutGG0LjRjyDQuNGC0LXRgNC40YDQvtCy0LDQvdC40Y8g0LjRgdGF0L7QtNC90YvRhSDQtNCw0L3QvdGL0YUuICovXG4gIHB1YmxpYyBpdGVyYXRvcjogU1Bsb3RJdGVyYXRvciA9IHVuZGVmaW5lZFxuXG4gIC8qKiDQpdC10LvQv9C10YAg0YDQtdC20LjQvNCwINC00LXQvNC+LdC00LDQvdC90YvRhS4gKi9cbiAgcHVibGljIGRlbW86IFNQbG90RGVtbyA9IG5ldyBTUGxvdERlbW8odGhpcylcblxuICAvKiog0KXQtdC70L/QtdGAINGA0LXQttC40LzQsCDQvtGC0LvQsNC00LrQuC4gKi9cbiAgcHVibGljIGRlYnVnOiBTUGxvdERlYnVnID0gbmV3IFNQbG90RGVidWcodGhpcylcblxuICAvKiog0KXQtdC70L/QtdGAIFdlYkdMLiAqL1xuICBwdWJsaWMgd2ViZ2w6IFNQbG90V2ViR2wgPSBuZXcgU1Bsb3RXZWJHbCgpXG5cbiAgLyoqINCf0YDQuNC30L3QsNC6INGE0L7RgNGB0LjRgNC+0LLQsNC90L3QvtCz0L4g0LfQsNC/0YPRgdC60LAg0YDQtdC90LTQtdGA0LAuICovXG4gIHB1YmxpYyBmb3JjZVJ1bjogYm9vbGVhbiA9IGZhbHNlXG5cbiAgLyoqINCe0LPRgNCw0L3QuNGH0LXQvdC40LUg0LrQvtC7LdCy0LAg0L7QsdGK0LXQutGC0L7QsiDQvdCwINCz0YDQsNGE0LjQutC1LiAqL1xuICBwdWJsaWMgZ2xvYmFsTGltaXQ6IG51bWJlciA9IDFfMDAwXzAwMF8wMDBcblxuICAvKiog0J7Qs9GA0LDQvdC40YfQtdC90LjQtSDQutC+0Lst0LLQsCDQvtCx0YrQtdC60YLQvtCyINCyINCz0YDRg9C/0L/QtS4gKi9cbiAgcHVibGljIGdyb3VwTGltaXQ6IG51bWJlciA9IDEwXzAwMFxuXG4gIC8qKiDQptCy0LXRgtC+0LLQsNGPINC/0LDQu9C40YLRgNCwINC+0LHRitC10LrRgtC+0LIuICovXG4gIHB1YmxpYyBjb2xvcnM6IHN0cmluZ1tdID0gW11cblxuICAvKiog0J/QsNGA0LDQvNC10YLRgNGLINC60L7QvtGA0LTQuNC90LDRgtC90L7QuSDQv9C70L7RgdC60L7RgdGC0LguICovXG4gIHB1YmxpYyBncmlkOiBTUGxvdEdyaWQgPSB7XG4gICAgd2lkdGg6IDMyXzAwMCxcbiAgICBoZWlnaHQ6IDE2XzAwMCxcbiAgICBiZ0NvbG9yOiAnI2ZmZmZmZicsXG4gICAgcnVsZXNDb2xvcjogJyNjMGMwYzAnXG4gIH1cblxuICAvKiog0J/QsNGA0LDQvNC10YLRgNGLINC+0LHQu9Cw0YHRgtC4INC/0YDQvtGB0LzQvtGC0YDQsC4gKi9cbiAgcHVibGljIGNhbWVyYTogU1Bsb3RDYW1lcmEgPSB7XG4gICAgeDogdGhpcy5ncmlkLndpZHRoISAvIDIsXG4gICAgeTogdGhpcy5ncmlkLmhlaWdodCEgLyAyLFxuICAgIHpvb206IDFcbiAgfVxuXG4gIC8qKiDQn9GA0LjQt9C90LDQuiDQvdC10L7QsdGF0L7QtNC40LzQvtGB0YLQuCDQsdC10LfQvtGC0LvQsNCz0LDRgtC10LvRjNC90L7Qs9C+INC30LDQv9GD0YHQutCwINGA0LXQvdC00LXRgNCwLiAqL1xuICBwdWJsaWMgaXNSdW5uaW5nOiBib29sZWFuID0gZmFsc2VcblxuICAvKiog0JrQvtC70LjRh9C10YHRgtCy0L4g0YDQsNC30LvQuNGH0L3Ri9GFINGE0L7RgNC8INC+0LHRitC10LrRgtC+0LIuICovXG4gIHB1YmxpYyBzaGFwZXNDb3VudDogbnVtYmVyID0gMlxuXG4gIC8qKiDQqNCw0LHQu9C+0L3RiyBHTFNMLdC60L7QtNC+0LIg0LTQu9GPINGI0LXQudC00LXRgNC+0LIuICovXG4gIHByb3RlY3RlZCBzaGFkZXJDb2RlVmVydDogc3RyaW5nID0gU0hBREVSX0NPREVfVkVSVF9UTVBMXG4gIHByb3RlY3RlZCBzaGFkZXJDb2RlRnJhZzogc3RyaW5nID0gU0hBREVSX0NPREVfRlJBR19UTVBMXG5cbiAgLyoqINCl0LXQu9C/0LXRgCDQstC30LDQuNC80L7QtNC10LnRgdGC0LLQuNGPINGBINGD0YHRgtGA0L7QudGB0YLQstC+0Lwg0LLQstC+0LTQsC4gKi9cbiAgcHJvdGVjdGVkIGNvbnRyb2w6IFNQbG90Q29udG9sID0gbmV3IFNQbG90Q29udG9sKClcblxuICAvKiog0KHRgtCw0YLQuNGB0YLQuNGH0LXRgdC60LDRjyDQuNC90YTQvtGA0LzQsNGG0LjRjy4gKi9cbiAgcHVibGljIHN0YXRzID0ge1xuICAgIG9iamVjdHNDb3VudFRvdGFsOiAwLFxuICAgIG9iamVjdHNDb3VudEluR3JvdXBzOiBbXSBhcyBudW1iZXJbXSxcbiAgICBncm91cHNDb3VudDogMCxcbiAgICBtZW1Vc2FnZTogMFxuICB9XG5cbiAgLyoqXG4gICAqINCh0L7Qt9C00LDQtdGCINGN0LrQt9C10LzQv9C70Y/RgCDQutC70LDRgdGB0LAsINC40L3QuNGG0LjQsNC70LjQt9C40YDRg9C10YIg0L3QsNGB0YLRgNC+0LnQutC4LlxuICAgKlxuICAgKiBAcmVtYXJrc1xuICAgKiDQldGB0LvQuCDQutCw0L3QstCw0YEg0YEg0LfQsNC00LDQvdC90YvQvCDQuNC00LXQvdGC0LjRhNC40LrQsNGC0L7RgNC+0Lwg0L3QtSDQvdCw0LnQtNC10L0gLSDQs9C10L3QtdGA0LjRgNGD0LXRgtGB0Y8g0L7RiNC40LHQutCwLiDQndCw0YHRgtGA0L7QudC60Lgg0LzQvtCz0YPRgiDQsdGL0YLRjCDQt9Cw0LTQsNC90Ysg0LrQsNC6INCyXG4gICAqINC60L7QvdGB0YLRgNGD0LrRgtC+0YDQtSwg0YLQsNC6INC4INCyINC80LXRgtC+0LTQtSB7QGxpbmsgc2V0dXB9LiDQntC00L3QsNC60L4g0LIg0LvRjtCx0L7QvCDRgdC70YPRh9Cw0LUg0L3QsNGB0YLRgNC+0LnQutC4INC00L7Qu9C20L3RiyDQsdGL0YLRjCDQt9Cw0LTQsNC90Ysg0LTQviDQt9Cw0L/Rg9GB0LrQsCDRgNC10L3QtNC10YDQsC5cbiAgICpcbiAgICogQHBhcmFtIGNhbnZhc0lkIC0g0JjQtNC10L3RgtC40YTQuNC60LDRgtC+0YAg0LrQsNC90LLQsNGB0LAsINC90LAg0LrQvtGC0L7RgNC+0Lwg0LHRg9C00LXRgiDRgNC40YHQvtCy0LDRgtGM0YHRjyDQs9GA0LDRhNC40LouXG4gICAqIEBwYXJhbSBvcHRpb25zIC0g0J/QvtC70YzQt9C+0LLQsNGC0LXQu9GM0YHQutC40LUg0L3QsNGB0YLRgNC+0LnQutC4INGN0LrQt9C10LzQv9C70Y/RgNCwLlxuICAgKi9cbiAgY29uc3RydWN0b3IoY2FudmFzSWQ6IHN0cmluZywgb3B0aW9ucz86IFNQbG90T3B0aW9ucykge1xuXG4gICAgdGhpcy53ZWJnbC5wcmVwYXJlKGNhbnZhc0lkKVxuICAgIHRoaXMuY29udHJvbC5wcmVwYXJlKHRoaXMpXG5cbiAgICBpZiAob3B0aW9ucykge1xuICAgICAgdGhpcy5zZXRPcHRpb25zKG9wdGlvbnMpICAgIC8vINCV0YHQu9C4INC/0LXRgNC10LTQsNC90Ysg0L3QsNGB0YLRgNC+0LnQutC4LCDRgtC+INC+0L3QuCDQv9GA0LjQvNC10L3Rj9GO0YLRgdGPLlxuXG4gICAgICBpZiAodGhpcy5mb3JjZVJ1bikge1xuICAgICAgICB0aGlzLnNldHVwKG9wdGlvbnMpICAgICAgIC8vICDQmNC90LjRhtC40LDQu9C40LfQsNGG0LjRjyDQstGB0LXRhSDQv9Cw0YDQsNC80LXRgtGA0L7QsiDRgNC10L3QtNC10YDQsCwg0LXRgdC70Lgg0LfQsNC/0YDQvtGI0LXQvSDRhNC+0YDRgdC40YDQvtCy0LDQvdC90YvQuSDQt9Cw0L/Rg9GB0LouXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqINCY0L3QuNGG0LjQsNC70LjQt9C40YDRg9C10YIg0L3QtdC+0LHRhdC+0LTQuNC80YvQtSDQtNC70Y8g0YDQtdC90LTQtdGA0LAg0L/QsNGA0LDQvNC10YLRgNGLINGN0LrQt9C10LzQv9C70Y/RgNCwINC4IFdlYkdMLlxuICAgKlxuICAgKiBAcGFyYW0gb3B0aW9ucyAtINCf0L7Qu9GM0LfQvtCy0LDRgtC10LvRjNGB0LrQuNC1INC90LDRgdGC0YDQvtC50LrQuCDRjdC60LfQtdC80L/Qu9GP0YDQsC5cbiAgICovXG4gIHB1YmxpYyBzZXR1cChvcHRpb25zOiBTUGxvdE9wdGlvbnMpOiB2b2lkIHtcblxuICAgIHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKSAgICAvLyDQn9GA0LjQvNC10L3QtdC90LjQtSDQv9C+0LvRjNC30L7QstCw0YLQtdC70YzRgdC60LjRhSDQvdCw0YHRgtGA0L7QtdC6LlxuICAgIHRoaXMud2ViZ2wuY3JlYXRlKCkgICAgICAgICAvLyDQodC+0LfQtNCw0L3QuNC1INC60L7QvdGC0LXQutGB0YLQsCDRgNC10L3QtNC10YDQuNC90LPQsC5cbiAgICB0aGlzLmRlbW8ucHJlcGFyZSgpXG4gICAgdGhpcy5kZWJ1Zy5wcmVwYXJlKHRoaXMud2ViZ2wuY2FudmFzKVxuXG4gICAgaWYgKHRoaXMuZGVidWcuaXNFbmFibGUpIHtcbiAgICAgIHRoaXMuZGVidWcubG9nSW50cm8oKVxuICAgICAgdGhpcy5kZWJ1Zy5sb2dHcHVJbmZvKHRoaXMud2ViZ2wuZ3B1LmhhcmR3YXJlLCB0aGlzLndlYmdsLmdwdS5zb2Z0d2FyZSlcbiAgICAgIHRoaXMuZGVidWcubG9nSW5zdGFuY2VJbmZvKHRoaXMsIHRoaXMud2ViZ2wuY2FudmFzLCBvcHRpb25zKVxuICAgIH1cblxuICAgIHRoaXMud2ViZ2wuc2V0QmdDb2xvcih0aGlzLmdyaWQuYmdDb2xvciEpICAgIC8vINCj0YHRgtCw0L3QvtCy0LrQsCDRhtCy0LXRgtCwINC+0YfQuNGB0YLQutC4INGA0LXQvdC00LXRgNC40L3Qs9CwXG5cbiAgICAvLyDQodC+0LfQtNCw0L3QuNC1INGI0LXQudC00LXRgNC+0LIgV2ViR0wuXG4gICAgY29uc3Qgc2hhZGVyQ29kZVZlcnQgPSB0aGlzLnNoYWRlckNvZGVWZXJ0LnJlcGxhY2UoJ3tFWFQtQ09ERX0nLCB0aGlzLmdlblNoYWRlckNvbG9yQ29kZSgpKVxuICAgIGNvbnN0IHNoYWRlckNvZGVGcmFnID0gdGhpcy5zaGFkZXJDb2RlRnJhZ1xuXG4gICAgdGhpcy53ZWJnbC5jcmVhdGVQcm9ncmFtKHNoYWRlckNvZGVWZXJ0LCBzaGFkZXJDb2RlRnJhZykgICAgLy8g0KHQvtC30LTQsNC90LjQtSDQv9GA0L7Qs9GA0LDQvNC80YsgV2ViR0wuXG5cbiAgICBpZiAodGhpcy5kZWJ1Zy5pc0VuYWJsZSkge1xuICAgICAgdGhpcy5kZWJ1Zy5sb2dTaGFkZXJJbmZvKCdWRVJURVhfU0hBREVSJywgc2hhZGVyQ29kZVZlcnQpXG4gICAgICB0aGlzLmRlYnVnLmxvZ1NoYWRlckluZm8oJ0ZSQUdNRU5UX1NIQURFUicsIHNoYWRlckNvZGVGcmFnKVxuICAgIH1cblxuICAgIC8vINCh0L7Qt9C00LDQvdC40LUg0L/QtdGA0LXQvNC10L3QvdGL0YUgV2ViR2wuXG4gICAgdGhpcy53ZWJnbC5jcmVhdGVWYXJpYWJsZXMoJ2FfcG9zaXRpb24nLCAnYV9jb2xvcicsICdhX3NpemUnLCAnYV9zaGFwZScsICd1X21hdHJpeCcpXG5cbiAgICB0aGlzLmxvYWREYXRhKCkgICAgLy8g0JfQsNC/0L7Qu9C90LXQvdC40LUg0LHRg9GE0LXRgNC+0LIgV2ViR0wuXG5cbiAgICBpZiAodGhpcy5mb3JjZVJ1bikge1xuICAgICAgdGhpcy5ydW4oKSAgICAgICAgICAgICAgICAvLyDQpNC+0YDRgdC40YDQvtCy0LDQvdC90YvQuSDQt9Cw0L/Rg9GB0Log0YDQtdC90LTQtdGA0LjQvdCz0LAgKNC10YHQu9C4INGC0YDQtdCx0YPQtdGC0YHRjykuXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqINCf0YDQuNC80LXQvdGP0LXRgiDQv9C+0LvRjNC30L7QstCw0YLQtdC70YzRgdC60LjQtSDQvdCw0YHRgtGA0L7QudC60Lgg0Y3QutC30LXQvNC/0LvRj9GA0LAuXG4gICAqXG4gICAqIEBwYXJhbSBvcHRpb25zIC0g0J/QvtC70YzQt9C+0LLQsNGC0LXQu9GM0YHQutC40LUg0L3QsNGB0YLRgNC+0LnQutC4INGN0LrQt9C10LzQv9C70Y/RgNCwLlxuICAgKi9cbiAgcHJvdGVjdGVkIHNldE9wdGlvbnMob3B0aW9uczogU1Bsb3RPcHRpb25zKTogdm9pZCB7XG5cbiAgICBjb3B5TWF0Y2hpbmdLZXlWYWx1ZXModGhpcywgb3B0aW9ucykgICAgLy8g0J/RgNC40LzQtdC90LXQvdC40LUg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GM0YHQutC40YUg0L3QsNGB0YLRgNC+0LXQui5cblxuICAgIC8vINCV0YHQu9C4INC30LDQtNCw0L0g0YDQsNC30LzQtdGAINC/0LvQvtGB0LrQvtGB0YLQuCwg0L3QviDQvdC1INC30LDQtNCw0L3QviDQv9C+0LvQvtC20LXQvdC40LUg0L7QsdC70LDRgdGC0Lgg0L/RgNC+0YHQvNC+0YLRgNCwLCDRgtC+INC+0LHQu9Cw0YHRgtGMINC/0L7QvNC10YnQsNC10YLRgdGPINCyINGG0LXQvdGC0YAg0L/Qu9C+0YHQutC+0YHRgtC4LlxuICAgIGlmICgoJ2dyaWQnIGluIG9wdGlvbnMpICYmICEoJ2NhbWVyYScgaW4gb3B0aW9ucykpIHtcbiAgICAgIHRoaXMuY2FtZXJhLnggPSB0aGlzLmdyaWQud2lkdGghIC8gMlxuICAgICAgdGhpcy5jYW1lcmEueSA9IHRoaXMuZ3JpZC5oZWlnaHQhIC8gMlxuICAgIH1cblxuICAgIGlmICh0aGlzLmRlbW8uaXNFbmFibGUpIHtcbiAgICAgIHRoaXMuaXRlcmF0b3IgPSB0aGlzLmRlbW8uaXRlcmF0b3IuYmluZCh0aGlzLmRlbW8pICAgIC8vINCY0LzQuNGC0LDRhtC40Y8g0LjRgtC10YDQuNGA0L7QstCw0L3QuNGPINC00LvRjyDQtNC10LzQvi3RgNC10LbQuNC80LAuXG4gICAgICB0aGlzLmNvbG9ycyA9IHRoaXMuZGVtby5jb2xvcnNcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICog0KHQvtC30LTQsNC10YIg0Lgg0LfQsNC/0L7Qu9C90Y/QtdGCINC00LDQvdC90YvQvNC4INC+0LHQviDQstGB0LXRhSDQv9C+0LvQuNCz0L7QvdCw0YUg0LHRg9GE0LXRgNGLIFdlYkdMLlxuICAgKi9cbiAgcHJvdGVjdGVkIGxvYWREYXRhKCk6IHZvaWQge1xuXG4gICAgaWYgKHRoaXMuZGVidWcuaXNFbmFibGUpIHtcbiAgICAgIHRoaXMuZGVidWcubG9nRGF0YUxvYWRpbmdTdGFydCgpXG4gICAgfVxuXG4gICAgbGV0IHBvbHlnb25Hcm91cDogU1Bsb3RQb2x5Z29uR3JvdXAgPSB7IHZlcnRpY2VzOiBbXSwgY29sb3JzOiBbXSwgc2l6ZXM6IFtdLCBzaGFwZXM6IFtdLCBhbW91bnRPZlZlcnRpY2VzOiAwIH1cblxuICAgIHRoaXMuc3RhdHMgPSB7XG4gICAgICBvYmplY3RzQ291bnRUb3RhbDogMCxcbiAgICAgIG9iamVjdHNDb3VudEluR3JvdXBzOiBbXSBhcyBudW1iZXJbXSxcbiAgICAgIGdyb3Vwc0NvdW50OiAwLFxuICAgICAgbWVtVXNhZ2U6IDBcbiAgICB9XG5cbiAgICBsZXQgb2JqZWN0OiBTUGxvdE9iamVjdCB8IG51bGwgfCB1bmRlZmluZWRcbiAgICBsZXQgazogbnVtYmVyID0gMFxuICAgIGxldCBpc09iamVjdEVuZHM6IGJvb2xlYW4gPSBmYWxzZVxuXG4gICAgd2hpbGUgKCFpc09iamVjdEVuZHMpIHtcblxuICAgICAgb2JqZWN0ID0gdGhpcy5pdGVyYXRvciEoKVxuICAgICAgaXNPYmplY3RFbmRzID0gKG9iamVjdCA9PT0gbnVsbCkgfHwgKHRoaXMuc3RhdHMub2JqZWN0c0NvdW50VG90YWwgPj0gdGhpcy5nbG9iYWxMaW1pdClcblxuICAgICAgaWYgKCFpc09iamVjdEVuZHMpIHtcbiAgICAgICAgcG9seWdvbkdyb3VwLnZlcnRpY2VzLnB1c2gob2JqZWN0IS54LCBvYmplY3QhLnkpXG4gICAgICAgIHBvbHlnb25Hcm91cC5zaGFwZXMucHVzaChvYmplY3QhLnNoYXBlKVxuICAgICAgICBwb2x5Z29uR3JvdXAuc2l6ZXMucHVzaChvYmplY3QhLnNpemUpXG4gICAgICAgIHBvbHlnb25Hcm91cC5jb2xvcnMucHVzaChvYmplY3QhLmNvbG9yKVxuICAgICAgICBrKytcbiAgICAgICAgdGhpcy5zdGF0cy5vYmplY3RzQ291bnRUb3RhbCsrXG4gICAgICB9XG5cbiAgICAgIGlmICgoayA+PSB0aGlzLmdyb3VwTGltaXQpIHx8IGlzT2JqZWN0RW5kcykge1xuICAgICAgICB0aGlzLnN0YXRzLm9iamVjdHNDb3VudEluR3JvdXBzW3RoaXMuc3RhdHMuZ3JvdXBzQ291bnRdID0ga1xuXG4gICAgICAgIC8qKiDQodC+0LfQtNCw0L3QuNC1INC4INC30LDQv9C+0LvQvdC10L3QuNC1INCx0YPRhNC10YDQvtCyINC00LDQvdC90YvQvNC4INC+INGC0LXQutGD0YnQtdC5INCz0YDRg9C/0L/QtSDQv9C+0LvQuNCz0L7QvdC+0LIuICovXG4gICAgICAgIHRoaXMuc3RhdHMubWVtVXNhZ2UgKz1cbiAgICAgICAgICB0aGlzLndlYmdsLmNyZWF0ZUJ1ZmZlcigndmVydGljZXMnLCBuZXcgRmxvYXQzMkFycmF5KHBvbHlnb25Hcm91cC52ZXJ0aWNlcykpICtcbiAgICAgICAgICB0aGlzLndlYmdsLmNyZWF0ZUJ1ZmZlcignY29sb3JzJywgbmV3IFVpbnQ4QXJyYXkocG9seWdvbkdyb3VwLmNvbG9ycykpICtcbiAgICAgICAgICB0aGlzLndlYmdsLmNyZWF0ZUJ1ZmZlcignc2hhcGVzJywgbmV3IFVpbnQ4QXJyYXkocG9seWdvbkdyb3VwLnNoYXBlcykpICtcbiAgICAgICAgICB0aGlzLndlYmdsLmNyZWF0ZUJ1ZmZlcignc2l6ZXMnLCBuZXcgRmxvYXQzMkFycmF5KHBvbHlnb25Hcm91cC5zaXplcykpXG4gICAgICB9XG5cbiAgICAgIGlmICgoayA+PSB0aGlzLmdyb3VwTGltaXQpICYmICFpc09iamVjdEVuZHMpIHtcbiAgICAgICAgdGhpcy5zdGF0cy5ncm91cHNDb3VudCsrXG4gICAgICAgIHBvbHlnb25Hcm91cCA9IHsgdmVydGljZXM6IFtdLCBjb2xvcnM6IFtdLCBzaXplczogW10sIHNoYXBlczogW10sIGFtb3VudE9mVmVydGljZXM6IDAgfVxuICAgICAgICBrID0gMFxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLmRlYnVnLmlzRW5hYmxlKSB7XG4gICAgICB0aGlzLmRlYnVnLmxvZ0RhdGFMb2FkaW5nQ29tcGxldGUodGhpcy5zdGF0cy5vYmplY3RzQ291bnRUb3RhbCwgdGhpcy5nbG9iYWxMaW1pdClcbiAgICAgIHRoaXMuZGVidWcubG9nR3B1TWVtU3RhdHModGhpcy5zdGF0cylcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICog0KHQvtC30LTQsNC10YIg0LTQvtC/0L7Qu9C90LXQvdC40LUg0Log0LrQvtC00YMg0L3QsCDRj9C30YvQutC1IEdMU0wuXG4gICAqXG4gICAqIEByZW1hcmtzXG4gICAqINCSINC00LDQu9GM0L3QtdC50YjQtdC8INGB0L7Qt9C00LDQvdC90YvQuSDQutC+0LQg0LHRg9C00LXRgiDQstGB0YLRgNC+0LXQvSDQsiDQutC+0LQg0LLQtdGA0YjQuNC90L3QvtCz0L4g0YjQtdC50LTQtdGA0LAg0LTQu9GPINC30LDQtNCw0L3QuNGPINGG0LLQtdGC0LAg0LLQtdGA0YjQuNC90Ysg0LIg0LfQsNCy0LjRgdC40LzQvtGB0YLQuCDQvtGCXG4gICAqINC40L3QtNC10LrRgdCwINGG0LLQtdGC0LAsINC/0YDQuNGB0LLQvtC10L3QvdC+0LPQviDRjdGC0L7QuSDQstC10YDRiNC40L3QtS4g0KIu0LouINGI0LXQudC00LXRgCDQvdC1INC/0L7Qt9Cy0L7Qu9GP0LXRgiDQuNGB0L/QvtC70YzQt9C+0LLQsNGC0Ywg0LIg0LrQsNGH0LXRgdGC0LLQtSDQuNC90LTQtdC60YHQvtCyINC/0LXRgNC10LzQtdC90L3Ri9C1IC1cbiAgICog0LTQu9GPINC30LDQtNCw0L3QuNGPINGG0LLQtdGC0LAg0LjRgdC/0L7Qu9GM0LfRg9C10YLRgdGPINC/0LXRgNC10LHQvtGAINGG0LLQtdGC0L7QstGL0YUg0LjQvdC00LXQutGB0L7Qsi5cbiAgICpcbiAgICogQHJldHVybnMg0JrQvtC0INC90LAg0Y/Qt9GL0LrQtSBHTFNMLlxuICAgKi9cbiAgcHJvdGVjdGVkIGdlblNoYWRlckNvbG9yQ29kZSgpOiBzdHJpbmcge1xuXG4gICAgLy8g0JLRgNC10LzQtdC90L3QvtC1INC00L7QsdCw0LLQu9C10L3QuNC1INCyINC/0LDQu9C40YLRgNGDINGG0LLQtdGC0L7QsiDQstC10YDRiNC40L0g0YbQstC10YLQsCDQvdCw0L/RgNCw0LLQu9GP0Y7RidC40YUuXG4gICAgdGhpcy5jb2xvcnMucHVzaCh0aGlzLmdyaWQucnVsZXNDb2xvciEpXG5cbiAgICBsZXQgY29kZTogc3RyaW5nID0gJydcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jb2xvcnMubGVuZ3RoOyBpKyspIHtcblxuICAgICAgLy8g0J/QvtC70YPRh9C10L3QuNC1INGG0LLQtdGC0LAg0LIg0L3Rg9C20L3QvtC8INGE0L7RgNC80LDRgtC1LlxuICAgICAgbGV0IFtyLCBnLCBiXSA9IGNvbG9yRnJvbUhleFRvR2xSZ2IodGhpcy5jb2xvcnNbaV0pXG5cbiAgICAgIC8vINCk0L7RgNC80LjRgNC+0LLQvdC40LUg0YHRgtGA0L7QuiBHTFNMLdC60L7QtNCwINC/0YDQvtCy0LXRgNC60Lgg0LjQvdC00LXQutGB0LAg0YbQstC10YLQsC5cbiAgICAgIGNvZGUgKz0gKChpID09PSAwKSA/ICcnIDogJyAgZWxzZSAnKSArICdpZiAoYV9jb2xvciA9PSAnICsgaSArICcuMCkgdl9jb2xvciA9IHZlYzMoJyArXG4gICAgICAgIHIudG9TdHJpbmcoKS5zbGljZSgwLCA5KSArICcsJyArXG4gICAgICAgIGcudG9TdHJpbmcoKS5zbGljZSgwLCA5KSArICcsJyArXG4gICAgICAgIGIudG9TdHJpbmcoKS5zbGljZSgwLCA5KSArICcpO1xcbidcbiAgICB9XG5cbiAgICAvLyDQo9C00LDQu9C10L3QuNC1INC40Lcg0L/QsNC70LjRgtGA0Ysg0LLQtdGA0YjQuNC9INCy0YDQtdC80LXQvdC90L4g0LTQvtCx0LDQstC70LXQvdC90L7Qs9C+INGG0LLQtdGC0LAg0L3QsNC/0YDQsNCy0LvRj9GO0YnQuNGFLlxuICAgIHRoaXMuY29sb3JzLnBvcCgpXG5cbiAgICByZXR1cm4gY29kZVxuICB9XG5cbiAgLyoqXG4gICAqINCf0YDQvtC40LfQstC+0LTQuNGCINGA0LXQvdC00LXRgNC40L3QsyDQs9GA0LDRhNC40LrQsCDQsiDRgdC+0L7RgtCy0LXRgtGB0YLQstC40Lgg0YEg0YLQtdC60YPRidC40LzQuCDQv9Cw0YDQsNC80LXRgtGA0LDQvNC4INGC0YDQsNC90YHRhNC+0YDQvNCw0YbQuNC4LlxuICAgKi9cbiAgcHVibGljIHJlbmRlcigpOiB2b2lkIHtcblxuICAgIC8vINCe0YfQuNGB0YLQutCwINC+0LHRitC10LrRgtCwINGA0LXQvdC00LXRgNC40L3Qs9CwIFdlYkdMLlxuICAgIHRoaXMud2ViZ2wuY2xlYXJCYWNrZ3JvdW5kKClcblxuICAgIC8vINCe0LHQvdC+0LLQu9C10L3QuNC1INC80LDRgtGA0LjRhtGLINGC0YDQsNC90YHRhNC+0YDQvNCw0YbQuNC4LlxuICAgIHRoaXMuY29udHJvbC51cGRhdGVWaWV3UHJvamVjdGlvbigpXG5cbiAgICAvLyDQn9GA0LjQstGP0LfQutCwINC80LDRgtGA0LjRhtGLINGC0YDQsNC90YHRhNC+0YDQvNCw0YbQuNC4INC6INC/0LXRgNC10LzQtdC90L3QvtC5INGI0LXQudC00LXRgNCwLlxuICAgIHRoaXMud2ViZ2wuc2V0VmFyaWFibGUoJ3VfbWF0cml4JywgdGhpcy5jb250cm9sLnRyYW5zZm9ybS52aWV3UHJvamVjdGlvbk1hdClcblxuICAgIC8vINCY0YLQtdGA0LjRgNC+0LLQsNC90LjQtSDQuCDRgNC10L3QtNC10YDQuNC90LMg0LPRgNGD0L/QvyDQsdGD0YTQtdGA0L7QsiBXZWJHTC5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc3RhdHMuZ3JvdXBzQ291bnQ7IGkrKykge1xuXG4gICAgICB0aGlzLndlYmdsLnNldEJ1ZmZlcigndmVydGljZXMnLCBpLCAnYV9wb3NpdGlvbicsIDIsIDAsIDApXG4gICAgICB0aGlzLndlYmdsLnNldEJ1ZmZlcignY29sb3JzJywgaSwgJ2FfY29sb3InLCAxLCAwLCAwKVxuICAgICAgdGhpcy53ZWJnbC5zZXRCdWZmZXIoJ3NpemVzJywgaSwgJ2Ffc2l6ZScsIDEsIDAsIDApXG4gICAgICB0aGlzLndlYmdsLnNldEJ1ZmZlcignc2hhcGVzJywgaSwgJ2Ffc2hhcGUnLCAxLCAwLCAwKVxuXG4gICAgICB0aGlzLndlYmdsLmRyYXdQb2ludHMoMCwgdGhpcy5zdGF0cy5vYmplY3RzQ291bnRJbkdyb3Vwc1tpXSlcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICog0JfQsNC/0YPRgdC60LDQtdGCINGA0LXQvdC00LXRgNC40L3QsyDQuCDQutC+0L3RgtGA0L7Qu9GMINGD0L/RgNCw0LLQu9C10L3QuNGPLlxuICAgKi9cbiAgcHVibGljIHJ1bigpOiB2b2lkIHtcblxuICAgIGlmICh0aGlzLmlzUnVubmluZykge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgdGhpcy5yZW5kZXIoKVxuICAgIHRoaXMuY29udHJvbC5ydW4oKVxuICAgIHRoaXMuaXNSdW5uaW5nID0gdHJ1ZVxuXG4gICAgaWYgKHRoaXMuZGVidWcuaXNFbmFibGUpIHtcbiAgICAgIHRoaXMuZGVidWcubG9nUmVuZGVyU3RhcnRlZCgpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqINCe0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdGCINGA0LXQvdC00LXRgNC40L3QsyDQuCDQutC+0L3RgtGA0L7Qu9GMINGD0L/RgNCw0LLQu9C10L3QuNGPLlxuICAgKi9cbiAgcHVibGljIHN0b3AoKTogdm9pZCB7XG5cbiAgICBpZiAoIXRoaXMuaXNSdW5uaW5nKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICB0aGlzLmNvbnRyb2wuc3RvcCgpXG4gICAgdGhpcy5pc1J1bm5pbmcgPSBmYWxzZVxuXG4gICAgaWYgKHRoaXMuZGVidWcuaXNFbmFibGUpIHtcbiAgICAgIHRoaXMuZGVidWcubG9nUmVuZGVyU3RvcGVkKClcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICog0J7Rh9C40YnQsNC10YIg0YTQvtC9LlxuICAgKi9cbiAgcHVibGljIGNsZWFyKCk6IHZvaWQge1xuXG4gICAgdGhpcy53ZWJnbC5jbGVhckJhY2tncm91bmQoKVxuXG4gICAgaWYgKHRoaXMuZGVidWcuaXNFbmFibGUpIHtcbiAgICAgIHRoaXMuZGVidWcubG9nQ2FudmFzQ2xlYXJlZCh0aGlzLmdyaWQuYmdDb2xvciEpXG4gICAgfVxuICB9XG59XG4iLCJcbi8qKlxuICog0J/RgNC+0LLQtdGA0Y/QtdGCINGP0LLQu9GP0LXRgtGB0Y8g0LvQuCDQv9C10YDQtdC80LXQvdC90LDRjyDRjdC60LfQtdC80L/Qu9GP0YDQvtC8INC60LDQutC+0LPQvi3Qu9C40LHQvtC+INC60LvQsNGB0YHQsC5cbiAqXG4gKiBAcGFyYW0gdmFsIC0g0J/RgNC+0LLQtdGA0Y/QtdC80LDRjyDQv9C10YDQtdC80LXQvdC90LDRjy5cbiAqIEByZXR1cm5zINCg0LXQt9GD0LvRjNGC0LDRgiDQv9GA0L7QstC10YDQutC4LlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNPYmplY3Qob2JqOiBhbnkpOiBib29sZWFuIHtcbiAgcmV0dXJuIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgT2JqZWN0XScpXG59XG5cbi8qKlxuICog0J/QtdGA0LXQvtC/0YDQtdC00LXQu9GP0LXRgiDQt9C90LDRh9C10L3QuNGPINC/0L7Qu9C10Lkg0L7QsdGK0LXQutGC0LAgdGFyZ2V0INC90LAg0LfQvdCw0YfQtdC90LjRjyDQv9C+0LvQtdC5INC+0LHRitC10LrRgtCwIHNvdXJjZS4g0J/QtdGA0LXQvtC/0YDQtdC00LXQu9GP0Y7RgtGB0Y8g0YLQvtC70YzQutC+INGC0LUg0L/QvtC70Y8sXG4gKiDQutC+0YLQvtGA0YvQtSDRgdGD0YnQtdGB0YLQstGD0LXRjtGCINCyIHRhcmdldC4g0JXRgdC70Lgg0LIgc291cmNlINC10YHRgtGMINC/0L7Qu9GPLCDQutC+0YLQvtGA0YvRhSDQvdC10YIg0LIgdGFyZ2V0LCDRgtC+INC+0L3QuCDQuNCz0L3QvtGA0LjRgNGD0Y7RgtGB0Y8uINCV0YHQu9C4INC60LDQutC40LUt0YLQviDQv9C+0LvRj1xuICog0YHQsNC80Lgg0Y/QstC70Y/RjtGC0YHRjyDRj9Cy0LvRj9GO0YLRgdGPINC+0LHRitC10LrRgtCw0LzQuCwg0YLQviDRgtC+INC+0L3QuCDRgtCw0LrQttC1INGA0LXQutGD0YDRgdC40LLQvdC+INC60L7Qv9C40YDRg9GO0YLRgdGPICjQv9GA0Lgg0YLQvtC8INC20LUg0YPRgdC70L7QstC40LgsINGH0YLQviDQsiDRhtC10LvQtdC+0Lwg0L7QsdGK0LXQutGC0LVcbiAqINGB0YPRidC10YHRgtCy0YPRjtGCINC/0L7Qu9GPINC+0LHRitC10LrRgtCwLdC40YHRgtC+0YfQvdC40LrQsCkuXG4gKlxuICogQHBhcmFtIHRhcmdldCAtINCm0LXQu9C10LLQvtC5ICjQuNC30LzQtdC90Y/QtdC80YvQuSkg0L7QsdGK0LXQutGCLlxuICogQHBhcmFtIHNvdXJjZSAtINCe0LHRitC10LrRgiDRgSDQtNCw0L3QvdGL0LzQuCwg0LrQvtGC0L7RgNGL0LUg0L3Rg9C20L3QviDRg9GB0YLQsNC90L7QstC40YLRjCDRgyDRhtC10LvQtdCy0L7Qs9C+INC+0LHRitC10LrRgtCwLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY29weU1hdGNoaW5nS2V5VmFsdWVzKHRhcmdldDogYW55LCBzb3VyY2U6IGFueSk6IHZvaWQge1xuICBPYmplY3Qua2V5cyhzb3VyY2UpLmZvckVhY2goa2V5ID0+IHtcbiAgICBpZiAoa2V5IGluIHRhcmdldCkge1xuICAgICAgaWYgKGlzT2JqZWN0KHNvdXJjZVtrZXldKSkge1xuICAgICAgICBpZiAoaXNPYmplY3QodGFyZ2V0W2tleV0pKSB7XG4gICAgICAgICAgY29weU1hdGNoaW5nS2V5VmFsdWVzKHRhcmdldFtrZXldLCBzb3VyY2Vba2V5XSlcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCFpc09iamVjdCh0YXJnZXRba2V5XSkgJiYgKHR5cGVvZiB0YXJnZXRba2V5XSAhPT0gJ2Z1bmN0aW9uJykpIHtcbiAgICAgICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pXG59XG5cbi8qKlxuICog0JLQvtC30LLRgNCw0YnQsNC10YIg0YHQu9GD0YfQsNC50L3QvtC1INGG0LXQu9C+0LUg0YfQuNGB0LvQviDQsiDQtNC40LDQv9Cw0LfQvtC90LU6IFswLi4ucmFuZ2UtMV0uXG4gKlxuICogQHBhcmFtIHJhbmdlIC0g0JLQtdGA0YXQvdC40Lkg0L/RgNC10LTQtdC7INC00LjQsNC/0LDQt9C+0L3QsCDRgdC70YPRh9Cw0LnQvdC+0LPQviDQstGL0LHQvtGA0LAuXG4gKiBAcmV0dXJucyDQodC70YPRh9Cw0LnQvdC+0LUg0YfQuNGB0LvQvi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJhbmRvbUludChyYW5nZTogbnVtYmVyKTogbnVtYmVyIHtcbiAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHJhbmdlKVxufVxuXG4vKipcbiAqINCf0YDQtdC+0LHRgNCw0LfRg9C10YIg0L7QsdGK0LXQutGCINCyINGB0YLRgNC+0LrRgyBKU09OLiDQmNC80LXQtdGCINC+0YLQu9C40YfQuNC1INC+0YIg0YHRgtCw0L3QtNCw0YDRgtC90L7QuSDRhNGD0L3QutGG0LjQuCBKU09OLnN0cmluZ2lmeSAtINC/0L7Qu9GPINC+0LHRitC10LrRgtCwLCDQuNC80LXRjtGJ0LjQtVxuICog0LfQvdCw0YfQtdC90LjRjyDRhNGD0L3QutGG0LjQuSDQvdC1INC/0YDQvtC/0YPRgdC60LDRjtGC0YHRjywg0LAg0L/RgNC10L7QsdGA0LDQt9GD0Y7RgtGB0Y8g0LIg0L3QsNC30LLQsNC90LjQtSDRhNGD0L3QutGG0LjQuC5cbiAqXG4gKiBAcGFyYW0gb2JqIC0g0KbQtdC70LXQstC+0Lkg0L7QsdGK0LXQutGCLlxuICogQHJldHVybnMg0KHRgtGA0L7QutCwIEpTT04sINC+0YLQvtCx0YDQsNC20LDRjtGJ0LDRjyDQvtCx0YrQtdC60YIuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBqc29uU3RyaW5naWZ5KG9iajogYW55KTogc3RyaW5nIHtcbiAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KFxuICAgIG9iaixcbiAgICBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgcmV0dXJuICh0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpID8gdmFsdWUubmFtZSA6IHZhbHVlXG4gICAgfSxcbiAgICAnICdcbiAgKVxufVxuXG4vKipcbiAqINCa0L7QvdCy0LXRgNGC0LjRgNGD0LXRgiDRhtCy0LXRgiDQuNC3IEhFWC3Qv9GA0LXQtNGB0YLQsNCy0LvQtdC90LjRjyDQsiDQv9GA0LXQtNGB0YLQsNCy0LvQtdC90LjQtSDRhtCy0LXRgtCwINC00LvRjyBHTFNMLdC60L7QtNCwIChSR0Ig0YEg0LTQuNCw0L/QsNC30L7QvdCw0LzQuCDQt9C90LDRh9C10L3QuNC5INC+0YIgMCDQtNC+IDEpLlxuICpcbiAqIEBwYXJhbSBoZXhDb2xvciAtINCm0LLQtdGCINCyIEhFWC3RhNC+0YDQvNCw0YLQtS5cbiAqIEByZXR1cm5zINCc0LDRgdGB0LjQsiDQuNC3INGC0YDQtdGFINGH0LjRgdC10Lsg0LIg0LTQuNCw0L/QsNC30L7QvdC1INC+0YIgMCDQtNC+IDEuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb2xvckZyb21IZXhUb0dsUmdiKGhleENvbG9yOiBzdHJpbmcpOiBudW1iZXJbXSB7XG5cbiAgbGV0IGsgPSAvXiM/KFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pJC9pLmV4ZWMoaGV4Q29sb3IpXG4gIGxldCBbciwgZywgYl0gPSBbcGFyc2VJbnQoayFbMV0sIDE2KSAvIDI1NSwgcGFyc2VJbnQoayFbMl0sIDE2KSAvIDI1NSwgcGFyc2VJbnQoayFbM10sIDE2KSAvIDI1NV1cblxuICByZXR1cm4gW3IsIGcsIGJdXG59XG5cbi8qKlxuICog0JLRi9GH0LjRgdC70Y/QtdGCINGC0LXQutGD0YnQtdC1INCy0YDQtdC80Y8uXG4gKlxuICogQHJldHVybnMg0KHRgtGA0L7QutC+0LLQsNGPINGE0L7RgNC80LDRgtC40YDQvtCy0LDQvdC90LDRjyDQt9Cw0L/QuNGB0Ywg0YLQtdC60YPRidC10LPQviDQstGA0LXQvNC10L3QuC4g0KTQvtGA0LzQsNGCOiBoaDptbTpzc1xuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q3VycmVudFRpbWUoKTogc3RyaW5nIHtcblxuICBsZXQgdG9kYXkgPSBuZXcgRGF0ZSgpO1xuXG4gIGxldCB0aW1lID1cbiAgICAoKHRvZGF5LmdldEhvdXJzKCkgPCAxMCA/ICcwJyA6ICcnKSArIHRvZGF5LmdldEhvdXJzKCkpICsgXCI6XCIgK1xuICAgICgodG9kYXkuZ2V0TWludXRlcygpIDwgMTAgPyAnMCcgOiAnJykgKyB0b2RheS5nZXRNaW51dGVzKCkpICsgXCI6XCIgK1xuICAgICgodG9kYXkuZ2V0U2Vjb25kcygpIDwgMTAgPyAnMCcgOiAnJykgKyB0b2RheS5nZXRTZWNvbmRzKCkpXG5cbiAgcmV0dXJuIHRpbWVcbn1cbiIsIi8qXG4gKiBDb3B5cmlnaHQgMjAyMSBHRlhGdW5kYW1lbnRhbHMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFJlZGlzdHJpYnV0aW9uIGFuZCB1c2UgaW4gc291cmNlIGFuZCBiaW5hcnkgZm9ybXMsIHdpdGggb3Igd2l0aG91dFxuICogbW9kaWZpY2F0aW9uLCBhcmUgcGVybWl0dGVkIHByb3ZpZGVkIHRoYXQgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zIGFyZVxuICogbWV0OlxuICpcbiAqICAgICAqIFJlZGlzdHJpYnV0aW9ucyBvZiBzb3VyY2UgY29kZSBtdXN0IHJldGFpbiB0aGUgYWJvdmUgY29weXJpZ2h0XG4gKiBub3RpY2UsIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIuXG4gKiAgICAgKiBSZWRpc3RyaWJ1dGlvbnMgaW4gYmluYXJ5IGZvcm0gbXVzdCByZXByb2R1Y2UgdGhlIGFib3ZlXG4gKiBjb3B5cmlnaHQgbm90aWNlLCB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyXG4gKiBpbiB0aGUgZG9jdW1lbnRhdGlvbiBhbmQvb3Igb3RoZXIgbWF0ZXJpYWxzIHByb3ZpZGVkIHdpdGggdGhlXG4gKiBkaXN0cmlidXRpb24uXG4gKiAgICAgKiBOZWl0aGVyIHRoZSBuYW1lIG9mIEdGWEZ1bmRhbWVudGFscy4gbm9yIHRoZSBuYW1lcyBvZiBoaXNcbiAqIGNvbnRyaWJ1dG9ycyBtYXkgYmUgdXNlZCB0byBlbmRvcnNlIG9yIHByb21vdGUgcHJvZHVjdHMgZGVyaXZlZCBmcm9tXG4gKiB0aGlzIHNvZnR3YXJlIHdpdGhvdXQgc3BlY2lmaWMgcHJpb3Igd3JpdHRlbiBwZXJtaXNzaW9uLlxuICpcbiAqIFRISVMgU09GVFdBUkUgSVMgUFJPVklERUQgQlkgVEhFIENPUFlSSUdIVCBIT0xERVJTIEFORCBDT05UUklCVVRPUlNcbiAqIFwiQVMgSVNcIiBBTkQgQU5ZIEVYUFJFU1MgT1IgSU1QTElFRCBXQVJSQU5USUVTLCBJTkNMVURJTkcsIEJVVCBOT1RcbiAqIExJTUlURUQgVE8sIFRIRSBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZIEFORCBGSVRORVNTIEZPUlxuICogQSBQQVJUSUNVTEFSIFBVUlBPU0UgQVJFIERJU0NMQUlNRUQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBDT1BZUklHSFRcbiAqIE9XTkVSIE9SIENPTlRSSUJVVE9SUyBCRSBMSUFCTEUgRk9SIEFOWSBESVJFQ1QsIElORElSRUNULCBJTkNJREVOVEFMLFxuICogU1BFQ0lBTCwgRVhFTVBMQVJZLCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVMgKElOQ0xVRElORywgQlVUIE5PVFxuICogTElNSVRFRCBUTywgUFJPQ1VSRU1FTlQgT0YgU1VCU1RJVFVURSBHT09EUyBPUiBTRVJWSUNFUzsgTE9TUyBPRiBVU0UsXG4gKiBEQVRBLCBPUiBQUk9GSVRTOyBPUiBCVVNJTkVTUyBJTlRFUlJVUFRJT04pIEhPV0VWRVIgQ0FVU0VEIEFORCBPTiBBTllcbiAqIFRIRU9SWSBPRiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQ09OVFJBQ1QsIFNUUklDVCBMSUFCSUxJVFksIE9SIFRPUlRcbiAqIChJTkNMVURJTkcgTkVHTElHRU5DRSBPUiBPVEhFUldJU0UpIEFSSVNJTkcgSU4gQU5ZIFdBWSBPVVQgT0YgVEhFIFVTRVxuICogT0YgVEhJUyBTT0ZUV0FSRSwgRVZFTiBJRiBBRFZJU0VEIE9GIFRIRSBQT1NTSUJJTElUWSBPRiBTVUNIIERBTUFHRS5cbiAqL1xuXG4vKipcbiAqIFZhcmlvdXMgMmQgbWF0aCBmdW5jdGlvbnMuXG4gKlxuICogQG1vZHVsZSB3ZWJnbC0yZC1tYXRoXG4gKi9cbihmdW5jdGlvbihyb290LCBmYWN0b3J5KSB7ICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAvLyBBTUQuIFJlZ2lzdGVyIGFzIGFuIGFub255bW91cyBtb2R1bGUuXG4gICAgZGVmaW5lKFtdLCBmYWN0b3J5KTtcbiAgfSBlbHNlIHtcbiAgICAvLyBCcm93c2VyIGdsb2JhbHNcbiAgICByb290Lm0zID0gZmFjdG9yeSgpO1xuICB9XG59KHRoaXMsIGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICAvKipcbiAgICogQW4gYXJyYXkgb3IgdHlwZWQgYXJyYXkgd2l0aCA5IHZhbHVlcy5cbiAgICogQHR5cGVkZWYge251bWJlcltdfFR5cGVkQXJyYXl9IE1hdHJpeDNcbiAgICogQG1lbWJlck9mIG1vZHVsZTp3ZWJnbC0yZC1tYXRoXG4gICAqL1xuXG4gIC8qKlxuICAgKiBUYWtlcyB0d28gTWF0cml4M3MsIGEgYW5kIGIsIGFuZCBjb21wdXRlcyB0aGUgcHJvZHVjdCBpbiB0aGUgb3JkZXJcbiAgICogdGhhdCBwcmUtY29tcG9zZXMgYiB3aXRoIGEuICBJbiBvdGhlciB3b3JkcywgdGhlIG1hdHJpeCByZXR1cm5lZCB3aWxsXG4gICAqIEBwYXJhbSB7bW9kdWxlOndlYmdsLTJkLW1hdGguTWF0cml4M30gYSBBIG1hdHJpeC5cbiAgICogQHBhcmFtIHttb2R1bGU6d2ViZ2wtMmQtbWF0aC5NYXRyaXgzfSBiIEEgbWF0cml4LlxuICAgKiBAcmV0dXJuIHttb2R1bGU6d2ViZ2wtMmQtbWF0aC5NYXRyaXgzfSB0aGUgcmVzdWx0LlxuICAgKiBAbWVtYmVyT2YgbW9kdWxlOndlYmdsLTJkLW1hdGhcbiAgICovXG4gIGZ1bmN0aW9uIG11bHRpcGx5KGEsIGIpIHtcbiAgICB2YXIgYTAwID0gYVswICogMyArIDBdO1xuICAgIHZhciBhMDEgPSBhWzAgKiAzICsgMV07XG4gICAgdmFyIGEwMiA9IGFbMCAqIDMgKyAyXTtcbiAgICB2YXIgYTEwID0gYVsxICogMyArIDBdO1xuICAgIHZhciBhMTEgPSBhWzEgKiAzICsgMV07XG4gICAgdmFyIGExMiA9IGFbMSAqIDMgKyAyXTtcbiAgICB2YXIgYTIwID0gYVsyICogMyArIDBdO1xuICAgIHZhciBhMjEgPSBhWzIgKiAzICsgMV07XG4gICAgdmFyIGEyMiA9IGFbMiAqIDMgKyAyXTtcbiAgICB2YXIgYjAwID0gYlswICogMyArIDBdO1xuICAgIHZhciBiMDEgPSBiWzAgKiAzICsgMV07XG4gICAgdmFyIGIwMiA9IGJbMCAqIDMgKyAyXTtcbiAgICB2YXIgYjEwID0gYlsxICogMyArIDBdO1xuICAgIHZhciBiMTEgPSBiWzEgKiAzICsgMV07XG4gICAgdmFyIGIxMiA9IGJbMSAqIDMgKyAyXTtcbiAgICB2YXIgYjIwID0gYlsyICogMyArIDBdO1xuICAgIHZhciBiMjEgPSBiWzIgKiAzICsgMV07XG4gICAgdmFyIGIyMiA9IGJbMiAqIDMgKyAyXTtcblxuICAgIHJldHVybiBbXG4gICAgICBiMDAgKiBhMDAgKyBiMDEgKiBhMTAgKyBiMDIgKiBhMjAsXG4gICAgICBiMDAgKiBhMDEgKyBiMDEgKiBhMTEgKyBiMDIgKiBhMjEsXG4gICAgICBiMDAgKiBhMDIgKyBiMDEgKiBhMTIgKyBiMDIgKiBhMjIsXG4gICAgICBiMTAgKiBhMDAgKyBiMTEgKiBhMTAgKyBiMTIgKiBhMjAsXG4gICAgICBiMTAgKiBhMDEgKyBiMTEgKiBhMTEgKyBiMTIgKiBhMjEsXG4gICAgICBiMTAgKiBhMDIgKyBiMTEgKiBhMTIgKyBiMTIgKiBhMjIsXG4gICAgICBiMjAgKiBhMDAgKyBiMjEgKiBhMTAgKyBiMjIgKiBhMjAsXG4gICAgICBiMjAgKiBhMDEgKyBiMjEgKiBhMTEgKyBiMjIgKiBhMjEsXG4gICAgICBiMjAgKiBhMDIgKyBiMjEgKiBhMTIgKyBiMjIgKiBhMjIsXG4gICAgXTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSAzeDMgaWRlbnRpdHkgbWF0cml4XG4gICAqIEByZXR1cm4ge21vZHVsZTp3ZWJnbDItMmQtbWF0aC5NYXRyaXgzfSBhbiBpZGVudGl0eSBtYXRyaXhcbiAgICovXG4gIGZ1bmN0aW9uIGlkZW50aXR5KCkge1xuICAgIHJldHVybiBbXG4gICAgICAxLCAwLCAwLFxuICAgICAgMCwgMSwgMCxcbiAgICAgIDAsIDAsIDEsXG4gICAgXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgMkQgcHJvamVjdGlvbiBtYXRyaXhcbiAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoIHdpZHRoIGluIHBpeGVsc1xuICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0IGhlaWdodCBpbiBwaXhlbHNcbiAgICogQHJldHVybiB7bW9kdWxlOndlYmdsLTJkLW1hdGguTWF0cml4M30gYSBwcm9qZWN0aW9uIG1hdHJpeCB0aGF0IGNvbnZlcnRzIGZyb20gcGl4ZWxzIHRvIGNsaXBzcGFjZSB3aXRoIFkgPSAwIGF0IHRoZSB0b3AuXG4gICAqIEBtZW1iZXJPZiBtb2R1bGU6d2ViZ2wtMmQtbWF0aFxuICAgKi9cbiAgZnVuY3Rpb24gcHJvamVjdGlvbih3aWR0aCwgaGVpZ2h0KSB7XG4gICAgLy8gTm90ZTogVGhpcyBtYXRyaXggZmxpcHMgdGhlIFkgYXhpcyBzbyAwIGlzIGF0IHRoZSB0b3AuXG4gICAgcmV0dXJuIFtcbiAgICAgIDIgLyB3aWR0aCwgMCwgMCxcbiAgICAgIDAsIC0yIC8gaGVpZ2h0LCAwLFxuICAgICAgLTEsIDEsIDEsXG4gICAgXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNdWx0aXBsaWVzIGJ5IGEgMkQgcHJvamVjdGlvbiBtYXRyaXhcbiAgICogQHBhcmFtIHttb2R1bGU6d2ViZ2wtMmQtbWF0aC5NYXRyaXgzfSB0aGUgbWF0cml4IHRvIGJlIG11bHRpcGxpZWRcbiAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoIHdpZHRoIGluIHBpeGVsc1xuICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0IGhlaWdodCBpbiBwaXhlbHNcbiAgICogQHJldHVybiB7bW9kdWxlOndlYmdsLTJkLW1hdGguTWF0cml4M30gdGhlIHJlc3VsdFxuICAgKiBAbWVtYmVyT2YgbW9kdWxlOndlYmdsLTJkLW1hdGhcbiAgICovXG4gIGZ1bmN0aW9uIHByb2plY3QobSwgd2lkdGgsIGhlaWdodCkge1xuICAgIHJldHVybiBtdWx0aXBseShtLCBwcm9qZWN0aW9uKHdpZHRoLCBoZWlnaHQpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgMkQgdHJhbnNsYXRpb24gbWF0cml4XG4gICAqIEBwYXJhbSB7bnVtYmVyfSB0eCBhbW91bnQgdG8gdHJhbnNsYXRlIGluIHhcbiAgICogQHBhcmFtIHtudW1iZXJ9IHR5IGFtb3VudCB0byB0cmFuc2xhdGUgaW4geVxuICAgKiBAcmV0dXJuIHttb2R1bGU6d2ViZ2wtMmQtbWF0aC5NYXRyaXgzfSBhIHRyYW5zbGF0aW9uIG1hdHJpeCB0aGF0IHRyYW5zbGF0ZXMgYnkgdHggYW5kIHR5LlxuICAgKiBAbWVtYmVyT2YgbW9kdWxlOndlYmdsLTJkLW1hdGhcbiAgICovXG4gIGZ1bmN0aW9uIHRyYW5zbGF0aW9uKHR4LCB0eSkge1xuICAgIHJldHVybiBbXG4gICAgICAxLCAwLCAwLFxuICAgICAgMCwgMSwgMCxcbiAgICAgIHR4LCB0eSwgMSxcbiAgICBdO1xuICB9XG5cbiAgLyoqXG4gICAqIE11bHRpcGxpZXMgYnkgYSAyRCB0cmFuc2xhdGlvbiBtYXRyaXhcbiAgICogQHBhcmFtIHttb2R1bGU6d2ViZ2wtMmQtbWF0aC5NYXRyaXgzfSB0aGUgbWF0cml4IHRvIGJlIG11bHRpcGxpZWRcbiAgICogQHBhcmFtIHtudW1iZXJ9IHR4IGFtb3VudCB0byB0cmFuc2xhdGUgaW4geFxuICAgKiBAcGFyYW0ge251bWJlcn0gdHkgYW1vdW50IHRvIHRyYW5zbGF0ZSBpbiB5XG4gICAqIEByZXR1cm4ge21vZHVsZTp3ZWJnbC0yZC1tYXRoLk1hdHJpeDN9IHRoZSByZXN1bHRcbiAgICogQG1lbWJlck9mIG1vZHVsZTp3ZWJnbC0yZC1tYXRoXG4gICAqL1xuICBmdW5jdGlvbiB0cmFuc2xhdGUobSwgdHgsIHR5KSB7XG4gICAgcmV0dXJuIG11bHRpcGx5KG0sIHRyYW5zbGF0aW9uKHR4LCB0eSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSAyRCByb3RhdGlvbiBtYXRyaXhcbiAgICogQHBhcmFtIHtudW1iZXJ9IGFuZ2xlSW5SYWRpYW5zIGFtb3VudCB0byByb3RhdGUgaW4gcmFkaWFuc1xuICAgKiBAcmV0dXJuIHttb2R1bGU6d2ViZ2wtMmQtbWF0aC5NYXRyaXgzfSBhIHJvdGF0aW9uIG1hdHJpeCB0aGF0IHJvdGF0ZXMgYnkgYW5nbGVJblJhZGlhbnNcbiAgICogQG1lbWJlck9mIG1vZHVsZTp3ZWJnbC0yZC1tYXRoXG4gICAqL1xuICBmdW5jdGlvbiByb3RhdGlvbihhbmdsZUluUmFkaWFucykge1xuICAgIHZhciBjID0gTWF0aC5jb3MoYW5nbGVJblJhZGlhbnMpO1xuICAgIHZhciBzID0gTWF0aC5zaW4oYW5nbGVJblJhZGlhbnMpO1xuICAgIHJldHVybiBbXG4gICAgICBjLCAtcywgMCxcbiAgICAgIHMsIGMsIDAsXG4gICAgICAwLCAwLCAxLFxuICAgIF07XG4gIH1cblxuICAvKipcbiAgICogTXVsdGlwbGllcyBieSBhIDJEIHJvdGF0aW9uIG1hdHJpeFxuICAgKiBAcGFyYW0ge21vZHVsZTp3ZWJnbC0yZC1tYXRoLk1hdHJpeDN9IHRoZSBtYXRyaXggdG8gYmUgbXVsdGlwbGllZFxuICAgKiBAcGFyYW0ge251bWJlcn0gYW5nbGVJblJhZGlhbnMgYW1vdW50IHRvIHJvdGF0ZSBpbiByYWRpYW5zXG4gICAqIEByZXR1cm4ge21vZHVsZTp3ZWJnbC0yZC1tYXRoLk1hdHJpeDN9IHRoZSByZXN1bHRcbiAgICogQG1lbWJlck9mIG1vZHVsZTp3ZWJnbC0yZC1tYXRoXG4gICAqL1xuICBmdW5jdGlvbiByb3RhdGUobSwgYW5nbGVJblJhZGlhbnMpIHtcbiAgICByZXR1cm4gbXVsdGlwbHkobSwgcm90YXRpb24oYW5nbGVJblJhZGlhbnMpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgMkQgc2NhbGluZyBtYXRyaXhcbiAgICogQHBhcmFtIHtudW1iZXJ9IHN4IGFtb3VudCB0byBzY2FsZSBpbiB4XG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzeSBhbW91bnQgdG8gc2NhbGUgaW4geVxuICAgKiBAcmV0dXJuIHttb2R1bGU6d2ViZ2wtMmQtbWF0aC5NYXRyaXgzfSBhIHNjYWxlIG1hdHJpeCB0aGF0IHNjYWxlcyBieSBzeCBhbmQgc3kuXG4gICAqIEBtZW1iZXJPZiBtb2R1bGU6d2ViZ2wtMmQtbWF0aFxuICAgKi9cbiAgZnVuY3Rpb24gc2NhbGluZyhzeCwgc3kpIHtcbiAgICByZXR1cm4gW1xuICAgICAgc3gsIDAsIDAsXG4gICAgICAwLCBzeSwgMCxcbiAgICAgIDAsIDAsIDEsXG4gICAgXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNdWx0aXBsaWVzIGJ5IGEgMkQgc2NhbGluZyBtYXRyaXhcbiAgICogQHBhcmFtIHttb2R1bGU6d2ViZ2wtMmQtbWF0aC5NYXRyaXgzfSB0aGUgbWF0cml4IHRvIGJlIG11bHRpcGxpZWRcbiAgICogQHBhcmFtIHtudW1iZXJ9IHN4IGFtb3VudCB0byBzY2FsZSBpbiB4XG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzeSBhbW91bnQgdG8gc2NhbGUgaW4geVxuICAgKiBAcmV0dXJuIHttb2R1bGU6d2ViZ2wtMmQtbWF0aC5NYXRyaXgzfSB0aGUgcmVzdWx0XG4gICAqIEBtZW1iZXJPZiBtb2R1bGU6d2ViZ2wtMmQtbWF0aFxuICAgKi9cbiAgZnVuY3Rpb24gc2NhbGUobSwgc3gsIHN5KSB7XG4gICAgcmV0dXJuIG11bHRpcGx5KG0sIHNjYWxpbmcoc3gsIHN5KSk7XG4gIH1cblxuICBmdW5jdGlvbiBkb3QoeDEsIHkxLCB4MiwgeTIpIHtcbiAgICByZXR1cm4geDEgKiB4MiArIHkxICogeTI7XG4gIH1cblxuICBmdW5jdGlvbiBkaXN0YW5jZSh4MSwgeTEsIHgyLCB5Mikge1xuICAgIHZhciBkeCA9IHgxIC0geDI7XG4gICAgdmFyIGR5ID0geTEgLSB5MjtcbiAgICByZXR1cm4gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG5vcm1hbGl6ZSh4LCB5KSB7XG4gICAgdmFyIGwgPSBkaXN0YW5jZSgwLCAwLCB4LCB5KTtcbiAgICBpZiAobCA+IDAuMDAwMDEpIHtcbiAgICAgIHJldHVybiBbeCAvIGwsIHkgLyBsXTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFswLCAwXTtcbiAgICB9XG4gIH1cblxuICAvLyBpID0gaW5jaWRlbnRcbiAgLy8gbiA9IG5vcm1hbFxuICBmdW5jdGlvbiByZWZsZWN0KGl4LCBpeSwgbngsIG55KSB7XG4gICAgLy8gSSAtIDIuMCAqIGRvdChOLCBJKSAqIE4uXG4gICAgdmFyIGQgPSBkb3QobngsIG55LCBpeCwgaXkpO1xuICAgIHJldHVybiBbXG4gICAgICBpeCAtIDIgKiBkICogbngsXG4gICAgICBpeSAtIDIgKiBkICogbnksXG4gICAgXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJhZFRvRGVnKHIpIHtcbiAgICByZXR1cm4gciAqIDE4MCAvIE1hdGguUEk7XG4gIH1cblxuICBmdW5jdGlvbiBkZWdUb1JhZChkKSB7XG4gICAgcmV0dXJuIGQgKiBNYXRoLlBJIC8gMTgwO1xuICB9XG5cbiAgZnVuY3Rpb24gdHJhbnNmb3JtUG9pbnQobSwgdikge1xuICAgIHZhciB2MCA9IHZbMF07XG4gICAgdmFyIHYxID0gdlsxXTtcbiAgICB2YXIgZCA9IHYwICogbVswICogMyArIDJdICsgdjEgKiBtWzEgKiAzICsgMl0gKyBtWzIgKiAzICsgMl07XG4gICAgcmV0dXJuIFtcbiAgICAgICh2MCAqIG1bMCAqIDMgKyAwXSArIHYxICogbVsxICogMyArIDBdICsgbVsyICogMyArIDBdKSAvIGQsXG4gICAgICAodjAgKiBtWzAgKiAzICsgMV0gKyB2MSAqIG1bMSAqIDMgKyAxXSArIG1bMiAqIDMgKyAxXSkgLyBkLFxuICAgIF07XG4gIH1cblxuICBmdW5jdGlvbiBpbnZlcnNlKG0pIHtcbiAgICB2YXIgdDAwID0gbVsxICogMyArIDFdICogbVsyICogMyArIDJdIC0gbVsxICogMyArIDJdICogbVsyICogMyArIDFdO1xuICAgIHZhciB0MTAgPSBtWzAgKiAzICsgMV0gKiBtWzIgKiAzICsgMl0gLSBtWzAgKiAzICsgMl0gKiBtWzIgKiAzICsgMV07XG4gICAgdmFyIHQyMCA9IG1bMCAqIDMgKyAxXSAqIG1bMSAqIDMgKyAyXSAtIG1bMCAqIDMgKyAyXSAqIG1bMSAqIDMgKyAxXTtcbiAgICB2YXIgZCA9IDEuMCAvIChtWzAgKiAzICsgMF0gKiB0MDAgLSBtWzEgKiAzICsgMF0gKiB0MTAgKyBtWzIgKiAzICsgMF0gKiB0MjApO1xuICAgIHJldHVybiBbXG4gICAgICAgZCAqIHQwMCwgLWQgKiB0MTAsIGQgKiB0MjAsXG4gICAgICAtZCAqIChtWzEgKiAzICsgMF0gKiBtWzIgKiAzICsgMl0gLSBtWzEgKiAzICsgMl0gKiBtWzIgKiAzICsgMF0pLFxuICAgICAgIGQgKiAobVswICogMyArIDBdICogbVsyICogMyArIDJdIC0gbVswICogMyArIDJdICogbVsyICogMyArIDBdKSxcbiAgICAgIC1kICogKG1bMCAqIDMgKyAwXSAqIG1bMSAqIDMgKyAyXSAtIG1bMCAqIDMgKyAyXSAqIG1bMSAqIDMgKyAwXSksXG4gICAgICAgZCAqIChtWzEgKiAzICsgMF0gKiBtWzIgKiAzICsgMV0gLSBtWzEgKiAzICsgMV0gKiBtWzIgKiAzICsgMF0pLFxuICAgICAgLWQgKiAobVswICogMyArIDBdICogbVsyICogMyArIDFdIC0gbVswICogMyArIDFdICogbVsyICogMyArIDBdKSxcbiAgICAgICBkICogKG1bMCAqIDMgKyAwXSAqIG1bMSAqIDMgKyAxXSAtIG1bMCAqIDMgKyAxXSAqIG1bMSAqIDMgKyAwXSksXG4gICAgXTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgZGVnVG9SYWQ6IGRlZ1RvUmFkLFxuICAgIGRpc3RhbmNlOiBkaXN0YW5jZSxcbiAgICBkb3Q6IGRvdCxcbiAgICBpZGVudGl0eTogaWRlbnRpdHksXG4gICAgaW52ZXJzZTogaW52ZXJzZSxcbiAgICBtdWx0aXBseTogbXVsdGlwbHksXG4gICAgbm9ybWFsaXplOiBub3JtYWxpemUsXG4gICAgcHJvamVjdGlvbjogcHJvamVjdGlvbixcbiAgICByYWRUb0RlZzogcmFkVG9EZWcsXG4gICAgcmVmbGVjdDogcmVmbGVjdCxcbiAgICByb3RhdGlvbjogcm90YXRpb24sXG4gICAgcm90YXRlOiByb3RhdGUsXG4gICAgc2NhbGluZzogc2NhbGluZyxcbiAgICBzY2FsZTogc2NhbGUsXG4gICAgdHJhbnNmb3JtUG9pbnQ6IHRyYW5zZm9ybVBvaW50LFxuICAgIHRyYW5zbGF0aW9uOiB0cmFuc2xhdGlvbixcbiAgICB0cmFuc2xhdGU6IHRyYW5zbGF0ZSxcbiAgICBwcm9qZWN0OiBwcm9qZWN0LFxuICB9O1xuXG59KSk7XG5cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL2luZGV4LnRzXCIpO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==