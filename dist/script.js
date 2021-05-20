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
var colors = ['#D81C01', '#E9967A', '#BA55D3', '#FFD700', '#FFE4B5', '#FF8C00', '#228B22', '#90EE90', '#4169E1', '#00BFFF', '#8B4513', '#00CED1'];
var plotWidth = 32000;
var plotHeight = 16000;
// Пример итерирующей функции. Итерации имитируются случайными выдачами. Почти также работает режим демо-данных.
function readNextObject() {
    if (i < n) {
        i++;
        return {
            x: randomInt(plotWidth),
            y: randomInt(plotHeight),
            shape: randomInt(2),
            size: 10 + randomInt(21),
            color: randomInt(colors.length), // Индекс цвета в массиве цветов
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
        isEnable: false
    },
    useVertexIndices: false
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
 * @param output - Место вывода отладочной информации.
 * @param headerStyle - Стиль для заголовка всего отладочного блока.
 * @param groupStyle - Стиль для заголовка группировки отладочных данных.
 *
 * @todo Реализовать дополнительные места вывода output: 'console' | 'document' | 'file'
 */
var SPlotDebug = /** @class */ (function () {
    function SPlotDebug() {
        this.isEnable = false;
        this.headerStyle = 'font-weight: bold; color: #ffffff; background-color: #cc0000;';
        this.groupStyle = 'font-weight: bold; color: #ffffff;';
    }
    SPlotDebug.prototype.logIntro = function (splot, canvas) {
        console.log('%cОтладка SPlot на объекте #' + canvas.id, this.headerStyle);
        if (splot.demo.isEnable) {
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
        console.log('Результат: ' +
            ((counter >= limit) ?
                'достигнут заданный лимит (' + limit.toLocaleString() + ')' :
                'обработаны все объекты'));
        console.groupEnd();
    };
    SPlotDebug.prototype.logObjectStats = function (splot, objectCounter) {
        console.group('%cКол-во объектов: ' + objectCounter.toLocaleString(), this.groupStyle);
        for (var i = 0; i < splot.shapes.length; i++) {
            var shapeCapction = splot.shapes[i].name;
            /*const shapeAmount = buffers.amountOfShapes[i]
            console.log(shapeCapction + ': ' + shapeAmount.toLocaleString() +
              ' [~' + Math.round(100 * shapeAmount / objectCounter) + '%]')*/
        }
        console.log('Кол-во цветов в палитре: ' + splot.colors.length);
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
    function SPlotDemo() {
        this.isEnable = false;
        this.amount = 1000000;
        this.shapeQuota = [];
        this.sizeMin = 10;
        this.sizeMax = 30;
        this.index = 0;
        this.colors = [
            '#D81C01', '#E9967A', '#BA55D3', '#FFD700', '#FFE4B5', '#FF8C00',
            '#228B22', '#90EE90', '#4169E1', '#00BFFF', '#8B4513', '#00CED1'
        ];
    }
    SPlotDemo.prototype.prepare = function (grid) {
        this.grid = grid;
        this.index = 0;
    };
    /**
     * Имитирует итерирование исходных объектов.
     *
     * @returns Информация о полигоне или null, если итерирование завершилось.
     */
    SPlotDemo.prototype.iterator = function () {
        if (this.index < this.amount) {
            this.index++;
            return {
                x: utils_1.randomInt(this.grid.width),
                y: utils_1.randomInt(this.grid.height),
                shape: utils_1.randomQuotaIndex(this.shapeQuota),
                size: this.sizeMin + utils_1.randomInt(this.sizeMax - this.sizeMin + 1),
                color: utils_1.randomInt(this.colors.length)
            };
        }
        else {
            this.index = 0;
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
        this.iterator = undefined; // Функция итерирования исходных данных.
        this.demo = new splot_demo_1.default(); // Хелпер режима демо-данных.
        this.debug = new splot_debug_1.default(); // Хелпер режима отладки
        this.webgl = new splot_webgl_1.default(); // Хелпер WebGL.
        this.forceRun = false; // Признак форсированного запуска рендера.
        this.globalLimit = 1000000000; // Ограничение кол-ва объектов на графике.
        this.groupLimit = 10000; // Ограничение кол-ва объектов в группе.
        this.isRunning = false; // Признак активного процесса рендера.
        this.colors = [];
        this.grid = {
            width: 32000,
            height: 16000,
            bgColor: '#ffffff',
            rulesColor: '#c0c0c0'
        };
        this.camera = {
            x: this.grid.width / 2,
            y: this.grid.height / 2,
            zoom: 1
        };
        this.shapes = [];
        this.shaderCodeVert = shader_code_vert_tmpl_1.default; // Шаблон GLSL-кода для вершинного шейдера.
        this.shaderCodeFrag = shader_code_frag_tmpl_1.default; // Шаблон GLSL-кода для фрагментного шейдера.
        this.objectCounter = 0; // Счетчик числа обработанных полигонов.
        this.control = new splot_control_1.default(); // Хелпер взаимодействия с устройством ввода.
        this.stats = {
            objectsCountTotal: 0,
            objectsCountInGroups: [],
            groupsCount: 0,
            memUsage: 0,
            shapes: []
        };
        this.webgl.prepare(canvasId);
        this.control.prepare(this);
        // Добавление формы в массив форм.
        this.shapes.push({
            name: 'Точка'
        });
        // Добавление формы в массив частот появления в демо-режиме.
        this.demo.shapeQuota.push(1);
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
        this.demo.prepare(this.grid); // Обнуление технического счетчика режима демо-данных.
        this.objectCounter = 0; // Обнуление счетчика полигонов.
        for (var i = 0; i < this.stats.shapes.length; i++) {
            //  this.stats.shapes[i] = 0    // Обнуление счетчиков форм полигонов.
        }
        if (this.debug.isEnable) {
            this.debug.logIntro(this, this.webgl.canvas);
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
            this.iterator = this.demo.iterator; // Имитация итерирования для демо-режима.
            this.colors = this.demo.colors;
        }
    };
    /**
     * Создает и заполняет данными обо всех полигонах буферы WebGL.
     */
    SPlot.prototype.loadData = function () {
        // Вывод отладочной информации.
        if (this.debug.isEnable) {
            this.debug.logDataLoadingStart();
        }
        var polygonGroup;
        this.stats.memUsage = 0;
        // Итерирование групп полигонов.
        while (polygonGroup = this.createPolygonGroup()) {
            // Создание и заполнение буферов данными о текущей группе полигонов.
            this.stats.memUsage +=
                this.webgl.createBuffer('vertices', new Float32Array(polygonGroup.vertices)) +
                    this.webgl.createBuffer('colors', new Uint8Array(polygonGroup.colors)) +
                    this.webgl.createBuffer('shapes', new Uint8Array(polygonGroup.shapes)) +
                    this.webgl.createBuffer('sizes', new Float32Array(polygonGroup.sizes));
            this.stats.objectsCountInGroups.push(polygonGroup.vertices.length / 2);
            this.stats.groupsCount++; // Счетчик количества буферов.
        }
        // Вывод отладочной информации.
        if (this.debug.isEnable) {
            this.debug.logDataLoadingComplete(this.objectCounter, this.globalLimit);
            this.debug.logObjectStats(this, this.objectCounter);
            this.debug.logGpuMemStats(this.stats);
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
            colors: [],
            sizes: [],
            shapes: [],
            amountOfVertices: 0,
        };
        var polygon;
        /**
         * Если количество полигонов канваса достигло допустимого максимума, то дальнейшая обработка исходных объектов
         * приостанавливается - формирование групп полигонов завершается возвратом значения null (симуляция достижения
         * последнего обрабатываемого исходного объекта).
         */
        if (this.objectCounter >= this.globalLimit)
            return null;
        // Итерирование исходных объектов.
        while (polygon = this.iterator()) {
            // Добавление в группу полигонов вершин нового полигона и подсчет общего количества вершин в группе.
            polygonGroup.vertices.push(polygon.x, polygon.y);
            polygonGroup.amountOfVertices++;
            polygonGroup.shapes.push(polygon.shape);
            polygonGroup.sizes.push(polygon.size);
            polygonGroup.colors.push(polygon.color);
            // Счетчик числа применений каждой из форм полигонов.
            // this.stats.shapes[i]++
            // Счетчик общего количество полигонов.
            this.objectCounter++;
            /**
             * Если количество полигонов канваса достигло допустимого максимума, то дальнейшая обработка исходных объектов
             * приостанавливается - формирование групп полигонов завершается возвратом значения null (симуляция достижения
             * последнего обрабатываемого исходного объекта).
             */
            if (this.objectCounter >= this.globalLimit)
                break;
            /**
             * Если общее количество всех вершин в группе полигонов превысило техническое ограничение, то группа полигонов
             * считается сформированной и итерирование исходных объектов приостанавливается.
             */
            if (polygonGroup.amountOfVertices >= this.groupLimit)
                break;
        }
        // Счетчик общего количества вершин всех вершинных буферов.
        this.stats.objectsCountTotal += polygonGroup.amountOfVertices;
        // Если группа полигонов непустая, то возвращаем ее. Если пустая - возвращаем null.
        return (polygonGroup.amountOfVertices > 0) ? polygonGroup : null;
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
exports.getCurrentTime = exports.colorFromHexToGlRgb = exports.randomQuotaIndex = exports.jsonStringify = exports.randomInt = exports.copyMatchingKeyValues = exports.isObject = void 0;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zdHlsZS5jc3MiLCJ3ZWJwYWNrOi8vLy4vaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vc2hhZGVyLWNvZGUtZnJhZy10bXBsLnRzIiwid2VicGFjazovLy8uL3NoYWRlci1jb2RlLXZlcnQtdG1wbC50cyIsIndlYnBhY2s6Ly8vLi9zcGxvdC1jb250cm9sLnRzIiwid2VicGFjazovLy8uL3NwbG90LWRlYnVnLnRzIiwid2VicGFjazovLy8uL3NwbG90LWRlbW8udHMiLCJ3ZWJwYWNrOi8vLy4vc3Bsb3Qtd2ViZ2wudHMiLCJ3ZWJwYWNrOi8vLy4vc3Bsb3QudHMiLCJ3ZWJwYWNrOi8vLy4vdXRpbHMudHMiLCJ3ZWJwYWNrOi8vLy4vbTMuanMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovLy93ZWJwYWNrL3N0YXJ0dXAiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBQSxnRkFBMkI7QUFDM0Isa0RBQWdCO0FBRWhCLFNBQVMsU0FBUyxDQUFDLEtBQWE7SUFDOUIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxLQUFLLENBQUM7QUFDMUMsQ0FBQztBQUVELElBQUksQ0FBQyxHQUFHLENBQUM7QUFDVCxJQUFJLENBQUMsR0FBRyxPQUFTLEVBQUUsOEJBQThCO0FBQ2pELElBQUksTUFBTSxHQUFHLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUM7QUFDakosSUFBSSxTQUFTLEdBQUcsS0FBTTtBQUN0QixJQUFJLFVBQVUsR0FBRyxLQUFNO0FB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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBLGNBQWMsOEJBQThCO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEIsY0FBYyw2QkFBNkI7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWEsNkJBQTZCO0FBQzFDLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEIsY0FBYyw2QkFBNkI7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQixjQUFjLDZCQUE2QjtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWEsNkJBQTZCO0FBQzFDLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEIsY0FBYyw2QkFBNkI7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCLGNBQWMsNkJBQTZCO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWEsNkJBQTZCO0FBQzFDLGFBQWEsT0FBTztBQUNwQixjQUFjLDZCQUE2QjtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhLE9BQU87QUFDcEIsYUFBYSxPQUFPO0FBQ3BCLGNBQWMsNkJBQTZCO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYSw2QkFBNkI7QUFDMUMsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQixjQUFjLDZCQUE2QjtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxDQUFDOzs7Ozs7OztVQzdTRDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQSxzREFBc0Qsa0JBQWtCO1dBQ3hFO1dBQ0EsK0NBQStDLGNBQWM7V0FDN0QsRTs7Ozs7VUNOQTtVQUNBO1VBQ0E7VUFDQSIsImZpbGUiOiJzY3JpcHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCJpbXBvcnQgU1Bsb3QgZnJvbSAnLi9zcGxvdCdcbmltcG9ydCAnQC9zdHlsZSdcblxuZnVuY3Rpb24gcmFuZG9tSW50KHJhbmdlOiBudW1iZXIpIHtcbiAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHJhbmdlKVxufVxuXG5sZXQgaSA9IDBcbmxldCBuID0gMV8wMDBfMDAwICAvLyDQmNC80LjRgtC40YDRg9C10LzQvtC1INGH0LjRgdC70L4g0L7QsdGK0LXQutGC0L7Qsi5cbmxldCBjb2xvcnMgPSBbJyNEODFDMDEnLCAnI0U5OTY3QScsICcjQkE1NUQzJywgJyNGRkQ3MDAnLCAnI0ZGRTRCNScsICcjRkY4QzAwJywgJyMyMjhCMjInLCAnIzkwRUU5MCcsICcjNDE2OUUxJywgJyMwMEJGRkYnLCAnIzhCNDUxMycsICcjMDBDRUQxJ11cbmxldCBwbG90V2lkdGggPSAzMl8wMDBcbmxldCBwbG90SGVpZ2h0ID0gMTZfMDAwXG5cbi8vINCf0YDQuNC80LXRgCDQuNGC0LXRgNC40YDRg9GO0YnQtdC5INGE0YPQvdC60YbQuNC4LiDQmNGC0LXRgNCw0YbQuNC4INC40LzQuNGC0LjRgNGD0Y7RgtGB0Y8g0YHQu9GD0YfQsNC50L3Ri9C80Lgg0LLRi9C00LDRh9Cw0LzQuC4g0J/QvtGH0YLQuCDRgtCw0LrQttC1INGA0LDQsdC+0YLQsNC10YIg0YDQtdC20LjQvCDQtNC10LzQvi3QtNCw0L3QvdGL0YUuXG5mdW5jdGlvbiByZWFkTmV4dE9iamVjdCgpIHtcbiAgaWYgKGkgPCBuKSB7XG4gICAgaSsrXG4gICAgcmV0dXJuIHtcbiAgICAgIHg6IHJhbmRvbUludChwbG90V2lkdGgpLFxuICAgICAgeTogcmFuZG9tSW50KHBsb3RIZWlnaHQpLFxuICAgICAgc2hhcGU6IHJhbmRvbUludCgyKSxcbiAgICAgIHNpemU6IDEwICsgcmFuZG9tSW50KDIxKSxcbiAgICAgIGNvbG9yOiByYW5kb21JbnQoY29sb3JzLmxlbmd0aCksICAvLyDQmNC90LTQtdC60YEg0YbQstC10YLQsCDQsiDQvNCw0YHRgdC40LLQtSDRhtCy0LXRgtC+0LJcbiAgICB9XG4gIH1cbiAgZWxzZVxuICAgIHJldHVybiBudWxsICAvLyDQktC+0LfQstGA0LDRidCw0LXQvCBudWxsLCDQutC+0LPQtNCwINC+0LHRitC10LrRgtGLIFwi0LfQsNC60L7QvdGH0LjQu9C40YHRjFwiXG59XG5cbi8qKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKiovXG5cbmxldCBzY2F0dGVyUGxvdCA9IG5ldyBTUGxvdCgnY2FudmFzMScpXG5cbi8vINCd0LDRgdGC0YDQvtC50LrQsCDRjdC60LfQtdC80L/Qu9GP0YDQsCDQvdCwINGA0LXQttC40Lwg0LLRi9Cy0L7QtNCwINC+0YLQu9Cw0LTQvtGH0L3QvtC5INC40L3RhNC+0YDQvNCw0YbQuNC4INCyINC60L7QvdGB0L7Qu9GMINCx0YDQsNGD0LfQtdGA0LAuXG4vLyDQlNGA0YPQs9C40LUg0L/RgNC40LzQtdGA0Ysg0YDQsNCx0L7RgtGLINC+0L/QuNGB0LDQvdGLINCyINGE0LDQudC70LUgc3Bsb3QuanMg0YHQviDRgdGC0YDQvtC60LggMjE0Llxuc2NhdHRlclBsb3Quc2V0dXAoe1xuICBpdGVyYXRvcjogcmVhZE5leHRPYmplY3QsXG4gIGNvbG9yczogY29sb3JzLFxuICBncmlkOiB7XG4gICAgd2lkdGg6IHBsb3RXaWR0aCxcbiAgICBoZWlnaHQ6IHBsb3RIZWlnaHQsXG4gIH0sXG4gIGRlYnVnOiB7XG4gICAgaXNFbmFibGU6IHRydWUsXG4gIH0sXG4gIGRlbW86IHtcbiAgICBpc0VuYWJsZTogZmFsc2VcbiAgfSxcbiAgdXNlVmVydGV4SW5kaWNlczogZmFsc2Vcbn0pXG5cbnNjYXR0ZXJQbG90LnJ1bigpXG5cbi8vc2NhdHRlclBsb3Quc3RvcCgpXG5cbi8vc2V0VGltZW91dCgoKSA9PiBzY2F0dGVyUGxvdC5zdG9wKCksIDMwMDApXG4iLCJleHBvcnQgZGVmYXVsdFxuYFxucHJlY2lzaW9uIGxvd3AgZmxvYXQ7XG52YXJ5aW5nIHZlYzMgdl9jb2xvcjtcbnZhcnlpbmcgZmxvYXQgdl9zaGFwZTtcbnZvaWQgbWFpbigpIHtcbiAgaWYgKHZfc2hhcGUgPT0gMC4wKSB7XG4gICAgZmxvYXQgdlNpemUgPSAyMC4wO1xuICAgIGZsb2F0IGRpc3RhbmNlID0gbGVuZ3RoKDIuMCAqIGdsX1BvaW50Q29vcmQgLSAxLjApO1xuICAgIGlmIChkaXN0YW5jZSA+IDEuMCkgeyBkaXNjYXJkOyB9O1xuICAgIGdsX0ZyYWdDb2xvciA9IHZlYzQodl9jb2xvci5yZ2IsIDEuMCk7XG4gIH1cbiAgZWxzZSBpZiAodl9zaGFwZSA9PSAxLjApIHtcbiAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KHZfY29sb3IucmdiLCAxLjApO1xuICB9XG59XG5gXG5cbi8qKlxuZXhwb3J0IGRlZmF1bHRcbiAgYFxucHJlY2lzaW9uIGxvd3AgZmxvYXQ7XG52YXJ5aW5nIHZlYzMgdl9jb2xvcjtcbnZvaWQgbWFpbigpIHtcbiAgZmxvYXQgdlNpemUgPSAyMC4wO1xuICBmbG9hdCBkaXN0YW5jZSA9IGxlbmd0aCgyLjAgKiBnbF9Qb2ludENvb3JkIC0gMS4wKTtcbiAgaWYgKGRpc3RhbmNlID4gMS4wKSB7IGRpc2NhcmQ7IH1cbiAgZ2xfRnJhZ0NvbG9yID0gdmVjNCh2X2NvbG9yLnJnYiwgMS4wKTtcblxuICAgdmVjNCB1RWRnZUNvbG9yID0gdmVjNCgwLjUsIDAuNSwgMC41LCAxLjApO1xuIGZsb2F0IHVFZGdlU2l6ZSA9IDEuMDtcblxuZmxvYXQgc0VkZ2UgPSBzbW9vdGhzdGVwKFxuICB2U2l6ZSAtIHVFZGdlU2l6ZSAtIDIuMCxcbiAgdlNpemUgLSB1RWRnZVNpemUsXG4gIGRpc3RhbmNlICogKHZTaXplICsgdUVkZ2VTaXplKVxuKTtcbmdsX0ZyYWdDb2xvciA9ICh1RWRnZUNvbG9yICogc0VkZ2UpICsgKCgxLjAgLSBzRWRnZSkgKiBnbF9GcmFnQ29sb3IpO1xuXG5nbF9GcmFnQ29sb3IuYSA9IGdsX0ZyYWdDb2xvci5hICogKDEuMCAtIHNtb290aHN0ZXAoXG4gICAgdlNpemUgLSAyLjAsXG4gICAgdlNpemUsXG4gICAgZGlzdGFuY2UgKiB2U2l6ZVxuKSk7XG5cbn1cbmBcbiovXG4iLCJleHBvcnQgZGVmYXVsdFxuYFxuYXR0cmlidXRlIHZlYzIgYV9wb3NpdGlvbjtcbmF0dHJpYnV0ZSBmbG9hdCBhX2NvbG9yO1xuYXR0cmlidXRlIGZsb2F0IGFfc2l6ZTtcbmF0dHJpYnV0ZSBmbG9hdCBhX3NoYXBlO1xudW5pZm9ybSBtYXQzIHVfbWF0cml4O1xudmFyeWluZyB2ZWMzIHZfY29sb3I7XG52YXJ5aW5nIGZsb2F0IHZfc2hhcGU7XG52b2lkIG1haW4oKSB7XG4gIGdsX1Bvc2l0aW9uID0gdmVjNCgodV9tYXRyaXggKiB2ZWMzKGFfcG9zaXRpb24sIDEpKS54eSwgMC4wLCAxLjApO1xuICBnbF9Qb2ludFNpemUgPSBhX3NpemU7XG4gIHZfc2hhcGUgPSBhX3NoYXBlO1xuICB7RVhULUNPREV9XG59XG5gXG4iLCIvLyBAdHMtaWdub3JlXG5pbXBvcnQgbTMgZnJvbSAnLi9tMydcbmltcG9ydCBTUGxvdCBmcm9tICcuL3NwbG90J1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTUGxvdENvbnRvbCB7XG5cbiAgcHJpdmF0ZSBjYW52YXMhOiBIVE1MQ2FudmFzRWxlbWVudFxuICBwcml2YXRlIGNhbWVyYSE6IFNQbG90Q2FtZXJhXG4gIHByaXZhdGUgcmVuZGVyITogKCkgPT4gdm9pZFxuXG4gIC8vINCi0LXRhdC90LjRh9C10YHQutCw0Y8g0LjQvdGE0L7RgNC80LDRhtC40Y8sINC40YHQv9C+0LvRjNC30YPQtdC80LDRjyDQv9GA0LjQu9C+0LbQtdC90LjQtdC8INC00LvRjyDRgNCw0YHRh9C10YLQsCDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuS5cbiAgcHVibGljIHRyYW5zZm9ybTogU1Bsb3RUcmFuc2Zvcm0gPSB7XG4gICAgdmlld1Byb2plY3Rpb25NYXQ6IFtdLFxuICAgIHN0YXJ0SW52Vmlld1Byb2pNYXQ6IFtdLFxuICAgIHN0YXJ0Q2FtZXJhOiB7IHg6IDAsIHk6IDAsIHpvb206IDEgfSxcbiAgICBzdGFydFBvczogW10sXG4gICAgc3RhcnRDbGlwUG9zOiBbXSxcbiAgICBzdGFydE1vdXNlUG9zOiBbXVxuICB9XG5cbiAgcHJvdGVjdGVkIGhhbmRsZU1vdXNlRG93bldpdGhDb250ZXh0OiBFdmVudExpc3RlbmVyID0gdGhpcy5oYW5kbGVNb3VzZURvd24uYmluZCh0aGlzKSBhcyBFdmVudExpc3RlbmVyXG4gIHByb3RlY3RlZCBoYW5kbGVNb3VzZVdoZWVsV2l0aENvbnRleHQ6IEV2ZW50TGlzdGVuZXIgPSB0aGlzLmhhbmRsZU1vdXNlV2hlZWwuYmluZCh0aGlzKSBhcyBFdmVudExpc3RlbmVyXG4gIHByb3RlY3RlZCBoYW5kbGVNb3VzZU1vdmVXaXRoQ29udGV4dDogRXZlbnRMaXN0ZW5lciA9IHRoaXMuaGFuZGxlTW91c2VNb3ZlLmJpbmQodGhpcykgYXMgRXZlbnRMaXN0ZW5lclxuICBwcm90ZWN0ZWQgaGFuZGxlTW91c2VVcFdpdGhDb250ZXh0OiBFdmVudExpc3RlbmVyID0gdGhpcy5oYW5kbGVNb3VzZVVwLmJpbmQodGhpcykgYXMgRXZlbnRMaXN0ZW5lclxuXG4gIHByZXBhcmUoc3Bsb3Q6IFNQbG90KSB7XG4gICAgdGhpcy5jYW52YXMgPSBzcGxvdC53ZWJnbC5jYW52YXNcbiAgICB0aGlzLmNhbWVyYSA9IHNwbG90LmNhbWVyYVxuICAgIHRoaXMucmVuZGVyID0gc3Bsb3QucmVuZGVyLmJpbmQoc3Bsb3QpXG4gIH1cblxuICBwdWJsaWMgcnVuKCkge1xuICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMuaGFuZGxlTW91c2VEb3duV2l0aENvbnRleHQpXG4gICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignd2hlZWwnLCB0aGlzLmhhbmRsZU1vdXNlV2hlZWxXaXRoQ29udGV4dClcbiAgfVxuXG4gIHB1YmxpYyBzdG9wKCkge1xuICAgIHRoaXMuY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMuaGFuZGxlTW91c2VEb3duV2l0aENvbnRleHQpXG4gICAgdGhpcy5jYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcignd2hlZWwnLCB0aGlzLmhhbmRsZU1vdXNlV2hlZWxXaXRoQ29udGV4dClcbiAgICB0aGlzLmNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLmhhbmRsZU1vdXNlTW92ZVdpdGhDb250ZXh0KVxuICAgIHRoaXMuY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLmhhbmRsZU1vdXNlVXBXaXRoQ29udGV4dClcbiAgfVxuXG4gIHByb3RlY3RlZCBtYWtlQ2FtZXJhTWF0cml4KCkge1xuXG4gICAgY29uc3Qgem9vbVNjYWxlID0gMSAvIHRoaXMuY2FtZXJhLnpvb20hO1xuXG4gICAgbGV0IGNhbWVyYU1hdCA9IG0zLmlkZW50aXR5KCk7XG4gICAgY2FtZXJhTWF0ID0gbTMudHJhbnNsYXRlKGNhbWVyYU1hdCwgdGhpcy5jYW1lcmEueCwgdGhpcy5jYW1lcmEueSk7XG4gICAgY2FtZXJhTWF0ID0gbTMuc2NhbGUoY2FtZXJhTWF0LCB6b29tU2NhbGUsIHpvb21TY2FsZSk7XG5cbiAgICByZXR1cm4gY2FtZXJhTWF0O1xuICB9XG5cbiAgLyoqXG4gICAqINCe0LHQvdC+0LLQu9GP0LXRgiDQvNCw0YLRgNC40YbRgyDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuC5cbiAgICpcbiAgICogQHJlbWFya3NcbiAgICog0KHRg9GJ0LXRgdGC0LLRg9C10YIg0LTQstCwINCy0LDRgNC40LDQvdGC0LAg0LLRi9C30L7QstCwINC80LXRgtC+0LTQsCAtINC40Lcg0LTRgNGD0LPQvtCz0L4g0LzQtdGC0L7QtNCwINGN0LrQt9C10LzQv9C70Y/RgNCwICh7QGxpbmsgcmVuZGVyfSkg0Lgg0LjQtyDQvtCx0YDQsNCx0L7RgtGH0LjQutCwINGB0L7QsdGL0YLQuNGPINC80YvRiNC4XG4gICAqICh7QGxpbmsgaGFuZGxlTW91c2VXaGVlbH0pLiDQktC+INCy0YLQvtGA0L7QvCDQstCw0YDQuNCw0L3RgtC1INC40YHQv9C+0LvRjNC30L7QstCw0L3QuNC1INC+0LHRitC10LrRgtCwIHRoaXMg0L3QtdCy0L7Qt9C80L7QttC90L4uINCU0LvRjyDRg9C90LjQstC10YDRgdCw0LvRjNC90L7RgdGC0Lgg0LLRi9C30L7QstCwXG4gICAqINC80LXRgtC+0LTQsCAtINCyINC90LXQs9C+INCy0YHQtdCz0LTQsCDRj9Cy0L3QviDQvdC10L7QsdGF0L7QtNC40LzQviDQv9C10YDQtdC00LDQstCw0YLRjCDRgdGB0YvQu9C60YMg0L3QsCDRjdC60LfQtdC80L/Qu9GP0YAg0LrQu9Cw0YHRgdCwLlxuICAgKi9cbiAgcHVibGljIHVwZGF0ZVZpZXdQcm9qZWN0aW9uKCk6IHZvaWQge1xuXG4gICAgY29uc3QgcHJvamVjdGlvbk1hdCA9IG0zLnByb2plY3Rpb24odGhpcy5jYW52YXMud2lkdGgsIHRoaXMuY2FudmFzLmhlaWdodCk7XG4gICAgY29uc3QgY2FtZXJhTWF0ID0gdGhpcy5tYWtlQ2FtZXJhTWF0cml4KCk7XG4gICAgbGV0IHZpZXdNYXQgPSBtMy5pbnZlcnNlKGNhbWVyYU1hdCk7XG4gICAgdGhpcy50cmFuc2Zvcm0udmlld1Byb2plY3Rpb25NYXQgPSBtMy5tdWx0aXBseShwcm9qZWN0aW9uTWF0LCB2aWV3TWF0KTtcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKi9cbiAgcHJvdGVjdGVkIGdldENsaXBTcGFjZU1vdXNlUG9zaXRpb24oZXZlbnQ6IE1vdXNlRXZlbnQpIHtcblxuICAgIC8vIGdldCBjYW52YXMgcmVsYXRpdmUgY3NzIHBvc2l0aW9uXG4gICAgY29uc3QgcmVjdCA9IHRoaXMuY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IGNzc1ggPSBldmVudC5jbGllbnRYIC0gcmVjdC5sZWZ0O1xuICAgIGNvbnN0IGNzc1kgPSBldmVudC5jbGllbnRZIC0gcmVjdC50b3A7XG5cbiAgICAvLyBnZXQgbm9ybWFsaXplZCAwIHRvIDEgcG9zaXRpb24gYWNyb3NzIGFuZCBkb3duIGNhbnZhc1xuICAgIGNvbnN0IG5vcm1hbGl6ZWRYID0gY3NzWCAvIHRoaXMuY2FudmFzLmNsaWVudFdpZHRoO1xuICAgIGNvbnN0IG5vcm1hbGl6ZWRZID0gY3NzWSAvIHRoaXMuY2FudmFzLmNsaWVudEhlaWdodDtcblxuICAgIC8vIGNvbnZlcnQgdG8gY2xpcCBzcGFjZVxuICAgIGNvbnN0IGNsaXBYID0gbm9ybWFsaXplZFggKiAyIC0gMTtcbiAgICBjb25zdCBjbGlwWSA9IG5vcm1hbGl6ZWRZICogLTIgKyAxO1xuXG4gICAgcmV0dXJuIFtjbGlwWCwgY2xpcFldO1xuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqL1xuICBwcm90ZWN0ZWQgbW92ZUNhbWVyYShldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuXG4gICAgY29uc3QgcG9zID0gbTMudHJhbnNmb3JtUG9pbnQoXG4gICAgICB0aGlzLnRyYW5zZm9ybS5zdGFydEludlZpZXdQcm9qTWF0LFxuICAgICAgdGhpcy5nZXRDbGlwU3BhY2VNb3VzZVBvc2l0aW9uKGV2ZW50KVxuICAgICk7XG5cbiAgICB0aGlzLmNhbWVyYS54ID1cbiAgICAgIHRoaXMudHJhbnNmb3JtLnN0YXJ0Q2FtZXJhLnghICsgdGhpcy50cmFuc2Zvcm0uc3RhcnRQb3NbMF0gLSBwb3NbMF07XG5cbiAgICB0aGlzLmNhbWVyYS55ID1cbiAgICAgIHRoaXMudHJhbnNmb3JtLnN0YXJ0Q2FtZXJhLnkhICsgdGhpcy50cmFuc2Zvcm0uc3RhcnRQb3NbMV0gLSBwb3NbMV07XG5cbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgLyoqXG4gICAqINCg0LXQsNCz0LjRgNGD0LXRgiDQvdCwINC00LLQuNC20LXQvdC40LUg0LzRi9GI0Lgv0YLRgNC10LrQv9Cw0LTQsCDQsiDQvNC+0LzQtdC90YIsINC60L7Qs9C00LAg0LXQtS/QtdCz0L4g0LrQu9Cw0LLQuNGI0LAg0YPQtNC10YDQttC40LLQsNC10YLRgdGPINC90LDQttCw0YLQvtC5LlxuICAgKlxuICAgKiBAcmVtZXJrc1xuICAgKiDQnNC10YLQvtC0INC/0LXRgNC10LzQtdGJ0LDQtdGCINC+0LHQu9Cw0YHRgtGMINCy0LjQtNC40LzQvtGB0YLQuCDQvdCwINC/0LvQvtGB0LrQvtGB0YLQuCDQstC80LXRgdGC0LUg0YEg0LTQstC40LbQtdC90LjQtdC8INC80YvRiNC4L9GC0YDQtdC60L/QsNC00LAuINCS0YvRh9C40YHQu9C10L3QuNGPINCy0L3Rg9GC0YDQuCDRgdC+0LHRi9GC0LjRjyDRgdC00LXQu9Cw0L3Ri1xuICAgKiDQvNCw0LrRgdC40LzQsNC70YzQvdC+INC/0YDQvtC40LfQstC+0LTQuNGC0LXQu9GM0L3Ri9C80Lgg0LIg0YPRidC10YDQsSDRh9C40YLQsNCx0LXQu9GM0L3QvtGB0YLQuCDQu9C+0LPQuNC60Lgg0LTQtdC50YHRgtCy0LjQuS4g0JLQviDQstC90LXRiNC90LXQvCDQvtCx0YDQsNCx0L7RgtGH0LjQutC1INGB0L7QsdGL0YLQuNC5INC+0LHRitC10LrRgiB0aGlzXG4gICAqINC90LXQtNC+0YHRgtGD0L/QtdC9INC/0L7RjdGC0L7QvNGDINC00L7RgdGC0YPQvyDQuiDRjdC60LfQtdC80L/Qu9GP0YDRgyDQutC70LDRgdGB0LAg0YDQtdCw0LvQuNC30YPQtdGC0YHRjyDRh9C10YDQtdC3INGB0YLQsNGC0LjRh9C10YHQutC40Lkg0LzQsNGB0YHQuNCyINCy0YHQtdGFINGB0L7Qt9C00LDQvdC90YvRhSDRjdC60LfQtdC80L/Qu9GP0YDQvtCyXG4gICAqINC60LvQsNGB0YHQsCDQuCDQuNC00LXQvdGC0LjRhNC40LrQsNGC0L7RgNCwINC60LDQvdCy0LDRgdCwLCDQstGL0YHRgtGD0L/QsNGO0YnQtdCz0L4g0LjQvdC00LXQutGB0L7QvCDQsiDRjdGC0L7QvCDQvNCw0YHRgdC40LLQtS5cbiAgICpcbiAgICogQHBhcmFtIGV2ZW50IC0g0KHQvtCx0YvRgtC40LUg0LzRi9GI0Lgv0YLRgNC10LrQv9Cw0LTQsC5cbiAgICovXG4gIHByb3RlY3RlZCBoYW5kbGVNb3VzZU1vdmUoZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICB0aGlzLm1vdmVDYW1lcmEuY2FsbCh0aGlzLCBldmVudCk7XG4gIH1cblxuICAvKipcbiAgICog0KDQtdCw0LPQuNGA0YPQtdGCINC90LAg0L7RgtC20LDRgtC40LUg0LrQu9Cw0LLQuNGI0Lgg0LzRi9GI0Lgv0YLRgNC10LrQv9Cw0LTQsC5cbiAgICpcbiAgICogQHJlbWVya3NcbiAgICog0JIg0LzQvtC80LXQvdGCINC+0YLQttCw0YLQuNGPINC60LvQsNCy0LjRiNC4INCw0L3QsNC70LjQtyDQtNCy0LjQttC10L3QuNGPINC80YvRiNC4L9GC0YDQtdC60L/QsNC00LAg0YEg0LfQsNC20LDRgtC+0Lkg0LrQu9Cw0LLQuNGI0LXQuSDQv9GA0LXQutGA0LDRidCw0LXRgtGB0Y8uINCS0YvRh9C40YHQu9C10L3QuNGPINCy0L3Rg9GC0YDQuCDRgdC+0LHRi9GC0LjRj1xuICAgKiDRgdC00LXQu9Cw0L3RiyDQvNCw0LrRgdC40LzQsNC70YzQvdC+INC/0YDQvtC40LfQstC+0LTQuNGC0LXQu9GM0L3Ri9C80Lgg0LIg0YPRidC10YDQsSDRh9C40YLQsNCx0LXQu9GM0L3QvtGB0YLQuCDQu9C+0LPQuNC60Lgg0LTQtdC50YHRgtCy0LjQuS4g0JLQviDQstC90LXRiNC90LXQvCDQvtCx0YDQsNCx0L7RgtGH0LjQutC1INGB0L7QsdGL0YLQuNC5INC+0LHRitC10LrRglxuICAgKiB0aGlzINC90LXQtNC+0YHRgtGD0L/QtdC9INC/0L7RjdGC0L7QvNGDINC00L7RgdGC0YPQvyDQuiDRjdC60LfQtdC80L/Qu9GP0YDRgyDQutC70LDRgdGB0LAg0YDQtdCw0LvQuNC30YPQtdGC0YHRjyDRh9C10YDQtdC3INGB0YLQsNGC0LjRh9C10YHQutC40Lkg0LzQsNGB0YHQuNCyINCy0YHQtdGFINGB0L7Qt9C00LDQvdC90YvRhSDRjdC60LfQtdC80L/Qu9GP0YDQvtCyXG4gICAqINC60LvQsNGB0YHQsCDQuCDQuNC00LXQvdGC0LjRhNC40LrQsNGC0L7RgNCwINC60LDQvdCy0LDRgdCwLCDQstGL0YHRgtGD0L/QsNGO0YnQtdCz0L4g0LjQvdC00LXQutGB0L7QvCDQsiDRjdGC0L7QvCDQvNCw0YHRgdC40LLQtS5cbiAgICpcbiAgICogQHBhcmFtIGV2ZW50IC0g0KHQvtCx0YvRgtC40LUg0LzRi9GI0Lgv0YLRgNC10LrQv9Cw0LTQsC5cbiAgICovXG4gIHByb3RlY3RlZCBoYW5kbGVNb3VzZVVwKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgICBldmVudC50YXJnZXQhLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMuaGFuZGxlTW91c2VNb3ZlV2l0aENvbnRleHQpO1xuICAgIGV2ZW50LnRhcmdldCEucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuaGFuZGxlTW91c2VVcFdpdGhDb250ZXh0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiDQoNC10LDQs9C40YDRg9C10YIg0L3QsCDQvdCw0LbQsNGC0LjQtSDQutC70LDQstC40YjQuCDQvNGL0YjQuC/RgtGA0LXQutC/0LDQtNCwLlxuICAgKlxuICAgKiBAcmVtZXJrc1xuICAgKiDQkiDQvNC+0LzQtdC90YIg0L3QsNC20LDRgtC40Y8g0Lgg0YPQtNC10YDQttCw0L3QuNGPINC60LvQsNCy0LjRiNC4INC30LDQv9GD0YHQutCw0LXRgtGB0Y8g0LDQvdCw0LvQuNC3INC00LLQuNC20LXQvdC40Y8g0LzRi9GI0Lgv0YLRgNC10LrQv9Cw0LTQsCAo0YEg0LfQsNC20LDRgtC+0Lkg0LrQu9Cw0LLQuNGI0LXQuSkuINCS0YvRh9C40YHQu9C10L3QuNGPXG4gICAqINCy0L3Rg9GC0YDQuCDRgdC+0LHRi9GC0LjRjyDRgdC00LXQu9Cw0L3RiyDQvNCw0LrRgdC40LzQsNC70YzQvdC+INC/0YDQvtC40LfQstC+0LTQuNGC0LXQu9GM0L3Ri9C80Lgg0LIg0YPRidC10YDQsSDRh9C40YLQsNCx0LXQu9GM0L3QvtGB0YLQuCDQu9C+0LPQuNC60Lgg0LTQtdC50YHRgtCy0LjQuS4g0JLQviDQstC90LXRiNC90LXQvCDQvtCx0YDQsNCx0L7RgtGH0LjQutC1XG4gICAqINGB0L7QsdGL0YLQuNC5INC+0LHRitC10LrRgiB0aGlzINC90LXQtNC+0YHRgtGD0L/QtdC9INC/0L7RjdGC0L7QvNGDINC00L7RgdGC0YPQvyDQuiDRjdC60LfQtdC80L/Qu9GP0YDRgyDQutC70LDRgdGB0LAg0YDQtdCw0LvQuNC30YPQtdGC0YHRjyDRh9C10YDQtdC3INGB0YLQsNGC0LjRh9C10YHQutC40Lkg0LzQsNGB0YHQuNCyINCy0YHQtdGFXG4gICAqINGB0L7Qt9C00LDQvdC90YvRhSDRjdC60LfQtdC80L/Qu9GP0YDQvtCyINC60LvQsNGB0YHQsCDQuCDQuNC00LXQvdGC0LjRhNC40LrQsNGC0L7RgNCwINC60LDQvdCy0LDRgdCwLCDQstGL0YHRgtGD0L/QsNGO0YnQtdCz0L4g0LjQvdC00LXQutGB0L7QvCDQsiDRjdGC0L7QvCDQvNCw0YHRgdC40LLQtS5cbiAgICpcbiAgICogQHBhcmFtIGV2ZW50IC0g0KHQvtCx0YvRgtC40LUg0LzRi9GI0Lgv0YLRgNC10LrQv9Cw0LTQsC5cbiAgICovXG4gIHByb3RlY3RlZCBoYW5kbGVNb3VzZURvd24oZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcblxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5oYW5kbGVNb3VzZU1vdmVXaXRoQ29udGV4dCk7XG4gICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuaGFuZGxlTW91c2VVcFdpdGhDb250ZXh0KTtcblxuICAgIHRoaXMudHJhbnNmb3JtLnN0YXJ0SW52Vmlld1Byb2pNYXQgPSBtMy5pbnZlcnNlKHRoaXMudHJhbnNmb3JtLnZpZXdQcm9qZWN0aW9uTWF0KTtcbiAgICB0aGlzLnRyYW5zZm9ybS5zdGFydENhbWVyYSA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuY2FtZXJhKTtcbiAgICB0aGlzLnRyYW5zZm9ybS5zdGFydENsaXBQb3MgPSB0aGlzLmdldENsaXBTcGFjZU1vdXNlUG9zaXRpb24uY2FsbCh0aGlzLCBldmVudCk7XG4gICAgdGhpcy50cmFuc2Zvcm0uc3RhcnRQb3MgPSBtMy50cmFuc2Zvcm1Qb2ludCh0aGlzLnRyYW5zZm9ybS5zdGFydEludlZpZXdQcm9qTWF0LCB0aGlzLnRyYW5zZm9ybS5zdGFydENsaXBQb3MpO1xuICAgIHRoaXMudHJhbnNmb3JtLnN0YXJ0TW91c2VQb3MgPSBbZXZlbnQuY2xpZW50WCwgZXZlbnQuY2xpZW50WV07XG5cbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgLyoqXG4gICAqINCg0LXQsNCz0LjRgNGD0LXRgiDQvdCwINC30YPQvNC40YDQvtCy0LDQvdC40LUg0LzRi9GI0Lgv0YLRgNC10LrQv9Cw0LTQsC5cbiAgICpcbiAgICogQHJlbWVya3NcbiAgICog0JIg0LzQvtC80LXQvdGCINC30YPQvNC40YDQvtCy0LDQvdC40Y8g0LzRi9GI0Lgv0YLRgNC10LrQv9Cw0LTQsCDQv9GA0L7QuNGB0YXQvtC00LjRgiDQt9GD0LzQuNGA0L7QstCw0L3QuNC1INC60L7QvtGA0LTQuNC90LDRgtC90L7QuSDQv9C70L7RgdC60L7RgdGC0LguINCS0YvRh9C40YHQu9C10L3QuNGPINCy0L3Rg9GC0YDQuCDRgdC+0LHRi9GC0LjRj1xuICAgKiDRgdC00LXQu9Cw0L3RiyDQvNCw0LrRgdC40LzQsNC70YzQvdC+INC/0YDQvtC40LfQstC+0LTQuNGC0LXQu9GM0L3Ri9C80Lgg0LIg0YPRidC10YDQsSDRh9C40YLQsNCx0LXQu9GM0L3QvtGB0YLQuCDQu9C+0LPQuNC60Lgg0LTQtdC50YHRgtCy0LjQuS4g0JLQviDQstC90LXRiNC90LXQvCDQvtCx0YDQsNCx0L7RgtGH0LjQutC1INGB0L7QsdGL0YLQuNC5INC+0LHRitC10LrRglxuICAgKiB0aGlzINC90LXQtNC+0YHRgtGD0L/QtdC9INC/0L7RjdGC0L7QvNGDINC00L7RgdGC0YPQvyDQuiDRjdC60LfQtdC80L/Qu9GP0YDRgyDQutC70LDRgdGB0LAg0YDQtdCw0LvQuNC30YPQtdGC0YHRjyDRh9C10YDQtdC3INGB0YLQsNGC0LjRh9C10YHQutC40Lkg0LzQsNGB0YHQuNCyINCy0YHQtdGFINGB0L7Qt9C00LDQvdC90YvRhSDRjdC60LfQtdC80L/Qu9GP0YDQvtCyXG4gICAqINC60LvQsNGB0YHQsCDQuCDQuNC00LXQvdGC0LjRhNC40LrQsNGC0L7RgNCwINC60LDQvdCy0LDRgdCwLCDQstGL0YHRgtGD0L/QsNGO0YnQtdCz0L4g0LjQvdC00LXQutGB0L7QvCDQsiDRjdGC0L7QvCDQvNCw0YHRgdC40LLQtS5cbiAgICpcbiAgICogQHBhcmFtIGV2ZW50IC0g0KHQvtCx0YvRgtC40LUg0LzRi9GI0Lgv0YLRgNC10LrQv9Cw0LTQsC5cbiAgICovXG4gIHByb3RlY3RlZCBoYW5kbGVNb3VzZVdoZWVsKGV2ZW50OiBXaGVlbEV2ZW50KTogdm9pZCB7XG5cbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNvbnN0IFtjbGlwWCwgY2xpcFldID0gdGhpcy5nZXRDbGlwU3BhY2VNb3VzZVBvc2l0aW9uLmNhbGwodGhpcywgZXZlbnQpO1xuXG4gICAgLy8gcG9zaXRpb24gYmVmb3JlIHpvb21pbmdcbiAgICBjb25zdCBbcHJlWm9vbVgsIHByZVpvb21ZXSA9IG0zLnRyYW5zZm9ybVBvaW50KG0zLmludmVyc2UodGhpcy50cmFuc2Zvcm0udmlld1Byb2plY3Rpb25NYXQpLCBbY2xpcFgsIGNsaXBZXSk7XG5cbiAgICAvLyBtdWx0aXBseSB0aGUgd2hlZWwgbW92ZW1lbnQgYnkgdGhlIGN1cnJlbnQgem9vbSBsZXZlbCwgc28gd2Ugem9vbSBsZXNzIHdoZW4gem9vbWVkIGluIGFuZCBtb3JlIHdoZW4gem9vbWVkIG91dFxuICAgIGNvbnN0IG5ld1pvb20gPSB0aGlzLmNhbWVyYS56b29tISAqIE1hdGgucG93KDIsIGV2ZW50LmRlbHRhWSAqIC0wLjAxKTtcbiAgICB0aGlzLmNhbWVyYS56b29tID0gTWF0aC5tYXgoMC4wMDIsIE1hdGgubWluKDIwMCwgbmV3Wm9vbSkpO1xuXG4gICAgdGhpcy51cGRhdGVWaWV3UHJvamVjdGlvbi5jYWxsKHRoaXMpO1xuXG4gICAgLy8gcG9zaXRpb24gYWZ0ZXIgem9vbWluZ1xuICAgIGNvbnN0IFtwb3N0Wm9vbVgsIHBvc3Rab29tWV0gPSBtMy50cmFuc2Zvcm1Qb2ludChtMy5pbnZlcnNlKHRoaXMudHJhbnNmb3JtLnZpZXdQcm9qZWN0aW9uTWF0KSwgW2NsaXBYLCBjbGlwWV0pO1xuXG4gICAgLy8gY2FtZXJhIG5lZWRzIHRvIGJlIG1vdmVkIHRoZSBkaWZmZXJlbmNlIG9mIGJlZm9yZSBhbmQgYWZ0ZXJcbiAgICB0aGlzLmNhbWVyYS54ISArPSBwcmVab29tWCAtIHBvc3Rab29tWDtcbiAgICB0aGlzLmNhbWVyYS55ISArPSBwcmVab29tWSAtIHBvc3Rab29tWTtcblxuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cbn1cbiIsImltcG9ydCBTUGxvdCBmcm9tICcuL3NwbG90J1xuaW1wb3J0IHsganNvblN0cmluZ2lmeSwgZ2V0Q3VycmVudFRpbWUgfSBmcm9tICcuL3V0aWxzJ1xuXG4vKipcbiAqINCi0LjQvyDQtNC70Y8g0L/QsNGA0LDQvNC10YLRgNC+0LIg0YDQtdC20LjQvNCwINC+0YLQu9Cw0LTQutC4LlxuICpcbiAqIEBwYXJhbSBpc0VuYWJsZSAtINCf0YDQuNC30L3QsNC6INCy0LrQu9GO0YfQtdC90LjRjyDQvtGC0LvQsNC00L7Rh9C90L7Qs9C+INGA0LXQttC40LzQsC5cbiAqIEBwYXJhbSBvdXRwdXQgLSDQnNC10YHRgtC+INCy0YvQstC+0LTQsCDQvtGC0LvQsNC00L7Rh9C90L7QuSDQuNC90YTQvtGA0LzQsNGG0LjQuC5cbiAqIEBwYXJhbSBoZWFkZXJTdHlsZSAtINCh0YLQuNC70Ywg0LTQu9GPINC30LDQs9C+0LvQvtCy0LrQsCDQstGB0LXQs9C+INC+0YLQu9Cw0LTQvtGH0L3QvtCz0L4g0LHQu9C+0LrQsC5cbiAqIEBwYXJhbSBncm91cFN0eWxlIC0g0KHRgtC40LvRjCDQtNC70Y8g0LfQsNCz0L7Qu9C+0LLQutCwINCz0YDRg9C/0L/QuNGA0L7QstC60Lgg0L7RgtC70LDQtNC+0YfQvdGL0YUg0LTQsNC90L3Ri9GFLlxuICpcbiAqIEB0b2RvINCg0LXQsNC70LjQt9C+0LLQsNGC0Ywg0LTQvtC/0L7Qu9C90LjRgtC10LvRjNC90YvQtSDQvNC10YHRgtCwINCy0YvQstC+0LTQsCBvdXRwdXQ6ICdjb25zb2xlJyB8ICdkb2N1bWVudCcgfCAnZmlsZSdcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU1Bsb3REZWJ1ZyB7XG5cbiAgcHVibGljIGlzRW5hYmxlOiBib29sZWFuID0gZmFsc2VcbiAgcHVibGljIGhlYWRlclN0eWxlOiBzdHJpbmcgPSAnZm9udC13ZWlnaHQ6IGJvbGQ7IGNvbG9yOiAjZmZmZmZmOyBiYWNrZ3JvdW5kLWNvbG9yOiAjY2MwMDAwOydcbiAgcHVibGljIGdyb3VwU3R5bGU6IHN0cmluZyA9ICdmb250LXdlaWdodDogYm9sZDsgY29sb3I6ICNmZmZmZmY7J1xuXG4gIHB1YmxpYyBsb2dJbnRybyhzcGxvdDogU1Bsb3QsIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQpOiB2b2lkIHtcbiAgICBjb25zb2xlLmxvZygnJWPQntGC0LvQsNC00LrQsCBTUGxvdCDQvdCwINC+0LHRitC10LrRgtC1ICMnICsgY2FudmFzLmlkLCB0aGlzLmhlYWRlclN0eWxlKVxuXG4gICAgaWYgKHNwbG90LmRlbW8uaXNFbmFibGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKCclY9CS0LrQu9GO0YfQtdC9INC00LXQvNC+0L3RgdGC0YDQsNGG0LjQvtC90L3Ri9C5INGA0LXQttC40Lwg0LTQsNC90L3Ri9GFJywgdGhpcy5ncm91cFN0eWxlKVxuICAgIH1cblxuICAgIGNvbnNvbGUuZ3JvdXAoJyVj0J/RgNC10LTRg9C/0YDQtdC20LTQtdC90LjQtScsIHRoaXMuZ3JvdXBTdHlsZSlcbiAgICBjb25zb2xlLmxvZygn0J7RgtC60YDRi9GC0LDRjyDQutC+0L3RgdC+0LvRjCDQsdGA0LDRg9C30LXRgNCwINC4INC00YDRg9Cz0LjQtSDQsNC60YLQuNCy0L3Ri9C1INGB0YDQtdC00YHRgtCy0LAg0LrQvtC90YLRgNC+0LvRjyDRgNCw0LfRgNCw0LHQvtGC0LrQuCDRgdGD0YnQtdGB0YLQstC10L3QvdC+INGB0L3QuNC20LDRjtGCINC/0YDQvtC40LfQstC+0LTQuNGC0LXQu9GM0L3QvtGB0YLRjCDQstGL0YHQvtC60L7QvdCw0LPRgNGD0LbQtdC90L3Ri9GFINC/0YDQuNC70L7QttC10L3QuNC5LiDQlNC70Y8g0L7QsdGK0LXQutGC0LjQstC90L7Qs9C+INCw0L3QsNC70LjQt9CwINC/0YDQvtC40LfQstC+0LTQuNGC0LXQu9GM0L3QvtGB0YLQuCDQstGB0LUg0L/QvtC00L7QsdC90YvQtSDRgdGA0LXQtNGB0YLQstCwINC00L7Qu9C20L3RiyDQsdGL0YLRjCDQvtGC0LrQu9GO0YfQtdC90YssINCwINC60L7QvdGB0L7Qu9GMINCx0YDQsNGD0LfQtdGA0LAg0LfQsNC60YDRi9GC0LAuINCd0LXQutC+0YLQvtGA0YvQtSDQtNCw0L3QvdGL0LUg0L7RgtC70LDQtNC+0YfQvdC+0Lkg0LjQvdGE0L7RgNC80LDRhtC40Lgg0LIg0LfQsNCy0LjRgdC40LzQvtGB0YLQuCDQvtGCINC40YHQv9C+0LvRjNC30YPQtdC80L7Qs9C+INCx0YDQsNGD0LfQtdGA0LAg0LzQvtCz0YPRgiDQvdC1INC+0YLQvtCx0YDQsNC20LDRgtGM0YHRjyDQuNC70Lgg0L7RgtC+0LHRgNCw0LbQsNGC0YzRgdGPINC90LXQutC+0YDRgNC10LrRgtC90L4uINCh0YDQtdC00YHRgtCy0L4g0L7RgtC70LDQtNC60Lgg0L/RgNC+0YLQtdGB0YLQuNGA0L7QstCw0L3QviDQsiDQsdGA0LDRg9C30LXRgNC1IEdvb2dsZSBDaHJvbWUgdi45MCcpXG4gICAgY29uc29sZS5ncm91cEVuZCgpXG4gIH1cblxuICBwdWJsaWMgbG9nR3B1SW5mbyhoYXJkd2FyZTogc3RyaW5nLCBzb2Z0d2FyZTogc3RyaW5nKTogdm9pZCB7XG4gICAgY29uc29sZS5ncm91cCgnJWPQktC40LTQtdC+0YHQuNGB0YLQtdC80LAnLCB0aGlzLmdyb3VwU3R5bGUpXG4gICAgY29uc29sZS5sb2coJ9CT0YDQsNGE0LjRh9C10YHQutCw0Y8g0LrQsNGA0YLQsDogJyArIGhhcmR3YXJlKVxuICAgIGNvbnNvbGUubG9nKCfQktC10YDRgdC40Y8gR0w6ICcgKyBzb2Z0d2FyZSlcbiAgICBjb25zb2xlLmdyb3VwRW5kKClcbiAgfVxuXG4gIHB1YmxpYyBsb2dJbnN0YW5jZUluZm8oc3Bsb3Q6IFNQbG90LCBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50LCBvcHRpb25zOiBTUGxvdE9wdGlvbnMpOiB2b2lkIHtcblxuICAgIGNvbnNvbGUuZ3JvdXAoJyVj0J3QsNGB0YLRgNC+0LnQutCwINC/0LDRgNCw0LzQtdGC0YDQvtCyINGN0LrQt9C10LzQv9C70Y/RgNCwJywgdGhpcy5ncm91cFN0eWxlKVxuICAgIGNvbnNvbGUuZGlyKHNwbG90KVxuICAgIGNvbnNvbGUubG9nKCfQn9C+0LvRjNC30L7QstCw0YLQtdC70YzRgdC60LjQtSDQvdCw0YHRgtGA0L7QudC60Lg6XFxuJywganNvblN0cmluZ2lmeShvcHRpb25zKSlcbiAgICBjb25zb2xlLmxvZygn0JrQsNC90LLQsNGBOiAjJyArIGNhbnZhcy5pZClcbiAgICBjb25zb2xlLmxvZygn0KDQsNC30LzQtdGAINC60LDQvdCy0LDRgdCwOiAnICsgY2FudmFzLndpZHRoICsgJyB4ICcgKyBjYW52YXMuaGVpZ2h0ICsgJyBweCcpXG4gICAgY29uc29sZS5sb2coJ9Cg0LDQt9C80LXRgCDQv9C70L7RgdC60L7RgdGC0Lg6ICcgKyBzcGxvdC5ncmlkLndpZHRoICsgJyB4ICcgKyBzcGxvdC5ncmlkLmhlaWdodCArICcgcHgnKVxuXG4gICAgaWYgKHNwbG90LmRlbW8uaXNFbmFibGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKCfQodC/0L7RgdC+0LEg0L/QvtC70YPRh9C10L3QuNGPINC00LDQvdC90YvRhTogJyArICfQtNC10LzQvi3QtNCw0L3QvdGL0LUnKVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZygn0KHQv9C+0YHQvtCxINC/0L7Qu9GD0YfQtdC90LjRjyDQtNCw0L3QvdGL0YU6ICcgKyAn0LjRgtC10YDQuNGA0L7QstCw0L3QuNC1JylcbiAgICB9XG4gICAgY29uc29sZS5ncm91cEVuZCgpXG4gIH1cblxuICBwdWJsaWMgbG9nU2hhZGVySW5mbyhzaGFkZXJUeXBlOiBzdHJpbmcsIHNoYWRlckNvZGU6IHN0cmluZywgKTogdm9pZCB7XG4gICAgY29uc29sZS5ncm91cCgnJWPQodC+0LfQtNCw0L0g0YjQtdC50LTQtdGAIFsnICsgc2hhZGVyVHlwZSArICddJywgdGhpcy5ncm91cFN0eWxlKVxuICAgIGNvbnNvbGUubG9nKHNoYWRlckNvZGUpXG4gICAgY29uc29sZS5ncm91cEVuZCgpXG4gIH1cblxuICBwdWJsaWMgbG9nRGF0YUxvYWRpbmdTdGFydCgpOiB2b2lkIHtcbiAgICBjb25zb2xlLmxvZygnJWPQl9Cw0L/Rg9GJ0LXQvSDQv9GA0L7RhtC10YHRgSDQt9Cw0LPRgNGD0LfQutC4INC00LDQvdC90YvRhSBbJyArIGdldEN1cnJlbnRUaW1lKCkgKyAnXS4uLicsIHRoaXMuZ3JvdXBTdHlsZSlcbiAgICBjb25zb2xlLnRpbWUoJ9CU0LvQuNGC0LXQu9GM0L3QvtGB0YLRjCcpXG4gIH1cblxuICBwdWJsaWMgbG9nRGF0YUxvYWRpbmdDb21wbGV0ZShjb3VudGVyOiBudW1iZXIsIGxpbWl0OiBudW1iZXIpOiB2b2lkIHtcbiAgICBjb25zb2xlLmdyb3VwKCclY9CX0LDQs9GA0YPQt9C60LAg0LTQsNC90L3Ri9GFINC30LDQstC10YDRiNC10L3QsCBbJyArIGdldEN1cnJlbnRUaW1lKCkgKyAnXScsIHRoaXMuZ3JvdXBTdHlsZSlcbiAgICBjb25zb2xlLnRpbWVFbmQoJ9CU0LvQuNGC0LXQu9GM0L3QvtGB0YLRjCcpXG4gICAgY29uc29sZS5sb2coJ9Cg0LXQt9GD0LvRjNGC0LDRgjogJyArXG4gICAgICAoKGNvdW50ZXIgPj0gbGltaXQpID9cbiAgICAgICfQtNC+0YHRgtC40LPQvdGD0YIg0LfQsNC00LDQvdC90YvQuSDQu9C40LzQuNGCICgnICsgbGltaXQudG9Mb2NhbGVTdHJpbmcoKSArICcpJyA6XG4gICAgICAn0L7QsdGA0LDQsdC+0YLQsNC90Ysg0LLRgdC1INC+0LHRitC10LrRgtGLJykpXG4gICAgY29uc29sZS5ncm91cEVuZCgpXG4gIH1cblxuICBwdWJsaWMgbG9nT2JqZWN0U3RhdHMoc3Bsb3Q6IFNQbG90LCBvYmplY3RDb3VudGVyOiBudW1iZXIpOiB2b2lkIHtcbiAgICBjb25zb2xlLmdyb3VwKCclY9Ca0L7Quy3QstC+INC+0LHRitC10LrRgtC+0LI6ICcgKyBvYmplY3RDb3VudGVyLnRvTG9jYWxlU3RyaW5nKCksIHRoaXMuZ3JvdXBTdHlsZSlcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3Bsb3Quc2hhcGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBzaGFwZUNhcGN0aW9uID0gc3Bsb3Quc2hhcGVzW2ldLm5hbWVcbiAgICAgIC8qY29uc3Qgc2hhcGVBbW91bnQgPSBidWZmZXJzLmFtb3VudE9mU2hhcGVzW2ldXG4gICAgICBjb25zb2xlLmxvZyhzaGFwZUNhcGN0aW9uICsgJzogJyArIHNoYXBlQW1vdW50LnRvTG9jYWxlU3RyaW5nKCkgK1xuICAgICAgICAnIFt+JyArIE1hdGgucm91bmQoMTAwICogc2hhcGVBbW91bnQgLyBvYmplY3RDb3VudGVyKSArICclXScpKi9cbiAgICB9XG5cbiAgICBjb25zb2xlLmxvZygn0JrQvtC7LdCy0L4g0YbQstC10YLQvtCyINCyINC/0LDQu9C40YLRgNC1OiAnICsgc3Bsb3QuY29sb3JzLmxlbmd0aClcbiAgICBjb25zb2xlLmdyb3VwRW5kKClcbiAgfVxuXG4gIHB1YmxpYyBsb2dHcHVNZW1TdGF0cyhzdGF0czogYW55KTogdm9pZCB7XG5cbiAgICBjb25zb2xlLmdyb3VwKCclY9Cg0LDRgdGF0L7QtCDQstC40LTQtdC+0L/QsNC80Y/RgtC4OiAnICsgKHN0YXRzLm1lbVVzYWdlIC8gMTAwMDAwMCkudG9GaXhlZCgyKS50b0xvY2FsZVN0cmluZygpICsgJyDQnNCRJywgdGhpcy5ncm91cFN0eWxlKVxuICAgIC8qY29uc29sZS5sb2coJ9Ca0L7Quy3QstC+INCz0YDRg9C/0L8g0LHRg9GE0LXRgNC+0LI6ICcgKyBzdGF0cy5ncm91cHNDb3VudC50b0xvY2FsZVN0cmluZygpKVxuICAgIGNvbnNvbGUubG9nKCfQmtC+0Lst0LLQviBHTC3RgtGA0LXRg9Cz0L7Qu9GM0L3QuNC60L7QsjogJyArIChidWZmZXJzLmFtb3VudE9mVG90YWxHTFZlcnRpY2VzIC8gMykudG9Mb2NhbGVTdHJpbmcoKSlcbiAgICBjb25zb2xlLmxvZygn0JrQvtC7LdCy0L4g0LLQtdGA0YjQuNC9OiAnICsgc3RhdHMub2JqZWN0c0NvdW50VG90YWwudG9Mb2NhbGVTdHJpbmcoKSkqL1xuXG4gICAgY29uc29sZS5ncm91cEVuZCgpXG4gIH1cblxuICBwdWJsaWMgbG9nUmVuZGVyU3RhcnRlZCgpIHtcbiAgICBjb25zb2xlLmxvZygnJWPQoNC10L3QtNC10YDQuNC90LMg0LfQsNC/0YPRidC10L0nLCB0aGlzLmdyb3VwU3R5bGUpXG4gIH1cblxuICBwdWJsaWMgbG9nUmVuZGVyU3RvcGVkKCkge1xuICAgIGNvbnNvbGUubG9nKCclY9Cg0LXQvdC00LXRgNC40L3QsyDQvtGB0YLQsNC90L7QstC70LXQvScsIHRoaXMuZ3JvdXBTdHlsZSlcbiAgfVxuXG4gIHB1YmxpYyBsb2dDYW52YXNDbGVhcmVkKGNvbG9yOiBzdHJpbmcpIHtcbiAgICBjb25zb2xlLmxvZygnJWPQmtC+0L3RgtC10LrRgdGCINGA0LXQvdC00LXRgNC40L3Qs9CwINC+0YfQuNGJ0LXQvSBbJyArIGNvbG9yICsgJ10nLCB0aGlzLmdyb3VwU3R5bGUpO1xuICB9XG59XG4iLCJpbXBvcnQgeyByYW5kb21JbnQsIHJhbmRvbVF1b3RhSW5kZXggfSBmcm9tICcuL3V0aWxzJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTUGxvdERlbW8ge1xuXG4gIHB1YmxpYyBpc0VuYWJsZTogYm9vbGVhbiA9IGZhbHNlXG4gIHB1YmxpYyBhbW91bnQ6IG51bWJlciA9IDFfMDAwXzAwMFxuICBwdWJsaWMgc2hhcGVRdW90YTogbnVtYmVyW10gPSBbXVxuICBwdWJsaWMgc2l6ZU1pbjogbnVtYmVyID0gMTBcbiAgcHVibGljIHNpemVNYXg6IG51bWJlciA9IDMwXG5cbiAgcHJpdmF0ZSBncmlkITogU1Bsb3RHcmlkXG4gIHByaXZhdGUgaW5kZXg6IG51bWJlciA9IDBcblxuICBwdWJsaWMgY29sb3JzOiBzdHJpbmdbXSA9IFtcbiAgICAnI0Q4MUMwMScsICcjRTk5NjdBJywgJyNCQTU1RDMnLCAnI0ZGRDcwMCcsICcjRkZFNEI1JywgJyNGRjhDMDAnLFxuICAgICcjMjI4QjIyJywgJyM5MEVFOTAnLCAnIzQxNjlFMScsICcjMDBCRkZGJywgJyM4QjQ1MTMnLCAnIzAwQ0VEMSdcbiAgXVxuXG4gIHB1YmxpYyBwcmVwYXJlKGdyaWQ6IFNQbG90R3JpZCk6IHZvaWQge1xuICAgIHRoaXMuZ3JpZCA9IGdyaWRcbiAgICB0aGlzLmluZGV4ID0gMFxuICB9XG5cbiAgLyoqXG4gICAqINCY0LzQuNGC0LjRgNGD0LXRgiDQuNGC0LXRgNC40YDQvtCy0LDQvdC40LUg0LjRgdGF0L7QtNC90YvRhSDQvtCx0YrQtdC60YLQvtCyLlxuICAgKlxuICAgKiBAcmV0dXJucyDQmNC90YTQvtGA0LzQsNGG0LjRjyDQviDQv9C+0LvQuNCz0L7QvdC1INC40LvQuCBudWxsLCDQtdGB0LvQuCDQuNGC0LXRgNC40YDQvtCy0LDQvdC40LUg0LfQsNCy0LXRgNGI0LjQu9C+0YHRjC5cbiAgICovXG4gIHB1YmxpYyBpdGVyYXRvcigpOiBTUGxvdFBvbHlnb24gfCBudWxsIHtcbiAgICBpZiAodGhpcy5pbmRleCEgPCB0aGlzLmFtb3VudCEpIHtcbiAgICAgIHRoaXMuaW5kZXghICsrO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgeDogcmFuZG9tSW50KHRoaXMuZ3JpZC53aWR0aCEpLFxuICAgICAgICB5OiByYW5kb21JbnQodGhpcy5ncmlkLmhlaWdodCEpLFxuICAgICAgICBzaGFwZTogcmFuZG9tUXVvdGFJbmRleCh0aGlzLnNoYXBlUXVvdGEhKSxcbiAgICAgICAgc2l6ZTogdGhpcy5zaXplTWluICsgcmFuZG9tSW50KHRoaXMuc2l6ZU1heCAtIHRoaXMuc2l6ZU1pbiArIDEpLFxuICAgICAgICBjb2xvcjogcmFuZG9tSW50KHRoaXMuY29sb3JzLmxlbmd0aClcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aGlzLmluZGV4ID0gMFxuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7IGNvbG9yRnJvbUhleFRvR2xSZ2IgfSBmcm9tICcuL3V0aWxzJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTUGxvdFdlYkdsIHtcblxuICBwdWJsaWMgYWxwaGE6IGJvb2xlYW4gPSBmYWxzZVxuICBwdWJsaWMgZGVwdGg6IGJvb2xlYW4gPSBmYWxzZVxuICBwdWJsaWMgc3RlbmNpbDogYm9vbGVhbiA9IGZhbHNlXG4gIHB1YmxpYyBhbnRpYWxpYXM6IGJvb2xlYW4gPSBmYWxzZVxuICBwdWJsaWMgZGVzeW5jaHJvbml6ZWQ6IGJvb2xlYW4gPSBmYWxzZVxuICBwdWJsaWMgcHJlbXVsdGlwbGllZEFscGhhOiBib29sZWFuID0gZmFsc2VcbiAgcHVibGljIHByZXNlcnZlRHJhd2luZ0J1ZmZlcjogYm9vbGVhbiA9IGZhbHNlXG4gIHB1YmxpYyBmYWlsSWZNYWpvclBlcmZvcm1hbmNlQ2F2ZWF0OiBib29sZWFuID0gZmFsc2VcbiAgcHVibGljIHBvd2VyUHJlZmVyZW5jZTogV2ViR0xQb3dlclByZWZlcmVuY2UgPSAnaGlnaC1wZXJmb3JtYW5jZSdcblxuICBwdWJsaWMgZ3B1ID0geyBoYXJkd2FyZTogJycsIHNvZnR3YXJlOiAnJyB9XG4gIHB1YmxpYyBjYW52YXMhOiBIVE1MQ2FudmFzRWxlbWVudFxuICBwdWJsaWMgZ2whOiBXZWJHTFJlbmRlcmluZ0NvbnRleHRcbiAgcHJpdmF0ZSBncHVQcm9ncmFtITogV2ViR0xQcm9ncmFtXG5cbiAgcHJpdmF0ZSB2YXJpYWJsZXM6IE1hcDxzdHJpbmcsIGFueT4gPSBuZXcgTWFwKClcblxuICBwdWJsaWMgZGF0YTogTWFwPHN0cmluZywge2J1ZmZlcnM6IFdlYkdMQnVmZmVyW10sIHR5cGU6IG51bWJlcn0+ID0gbmV3IE1hcCgpXG5cbiAgcHJpdmF0ZSBnbE51bWJlclR5cGVzOiBNYXA8c3RyaW5nLCBudW1iZXI+ID0gbmV3IE1hcCgpXG5cbiAgcHVibGljIHByZXBhcmUoY2FudmFzSWQ6IHN0cmluZykge1xuICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChjYW52YXNJZCkpIHtcbiAgICAgIHRoaXMuY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY2FudmFzSWQpIGFzIEhUTUxDYW52YXNFbGVtZW50XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcign0JrQsNC90LLQsNGBINGBINC40LTQtdC90YLQuNGE0LjQutCw0YLQvtGA0L7QvCBcIiMnICsgY2FudmFzSWQgKyAnXCIg0L3QtSDQvdCw0LnQtNC10L0hJylcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICog0KHQvtC30LTQsNC10YIg0LrQvtC90YLQtdC60YHRgiDRgNC10L3QtNC10YDQuNC90LPQsCBXZWJHTCDQuCDRg9GB0YLQsNC90LDQstC70LjQstCw0LXRgiDQutC+0YDRgNC10LrRgtC90YvQuSDRgNCw0LfQvNC10YAg0L7QsdC70LDRgdGC0Lgg0L/RgNC+0YHQvNC+0YLRgNCwLlxuICAgKi9cbiAgcHVibGljIGNyZWF0ZSgpOiB2b2lkIHtcblxuICAgIHRoaXMuZ2wgPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCd3ZWJnbCcsIHtcbiAgICAgIGFscGhhOiB0aGlzLmFscGhhLFxuICAgICAgZGVwdGg6IHRoaXMuZGVwdGgsXG4gICAgICBzdGVuY2lsOiB0aGlzLnN0ZW5jaWwsXG4gICAgICBhbnRpYWxpYXM6IHRoaXMuYW50aWFsaWFzLFxuICAgICAgZGVzeW5jaHJvbml6ZWQ6IHRoaXMuZGVzeW5jaHJvbml6ZWQsXG4gICAgICBwcmVtdWx0aXBsaWVkQWxwaGE6IHRoaXMucHJlbXVsdGlwbGllZEFscGhhLFxuICAgICAgcHJlc2VydmVEcmF3aW5nQnVmZmVyOiB0aGlzLnByZXNlcnZlRHJhd2luZ0J1ZmZlcixcbiAgICAgIGZhaWxJZk1ham9yUGVyZm9ybWFuY2VDYXZlYXQ6IHRoaXMuZmFpbElmTWFqb3JQZXJmb3JtYW5jZUNhdmVhdCxcbiAgICAgIHBvd2VyUHJlZmVyZW5jZTogdGhpcy5wb3dlclByZWZlcmVuY2VcbiAgICB9KSFcblxuICAgIGxldCBleHQgPSB0aGlzLmdsLmdldEV4dGVuc2lvbignV0VCR0xfZGVidWdfcmVuZGVyZXJfaW5mbycpXG4gICAgdGhpcy5ncHUuaGFyZHdhcmUgPSAoZXh0KSA/IHRoaXMuZ2wuZ2V0UGFyYW1ldGVyKGV4dC5VTk1BU0tFRF9SRU5ERVJFUl9XRUJHTCkgOiAnW9C90LXQuNC30LLQtdGB0YLQvdC+XSdcbiAgICB0aGlzLmdwdS5zb2Z0d2FyZSA9IHRoaXMuZ2wuZ2V0UGFyYW1ldGVyKHRoaXMuZ2wuVkVSU0lPTilcblxuICAgIHRoaXMuZ2xOdW1iZXJUeXBlcy5zZXQoJ0Zsb2F0MzJBcnJheScsIHRoaXMuZ2wuRkxPQVQpXG4gICAgdGhpcy5nbE51bWJlclR5cGVzLnNldCgnVWludDhBcnJheScsIHRoaXMuZ2wuVU5TSUdORURfQllURSlcbiAgICB0aGlzLmdsTnVtYmVyVHlwZXMuc2V0KCdVaW50MTZBcnJheScsIHRoaXMuZ2wuVU5TSUdORURfU0hPUlQpXG4gICAgdGhpcy5nbE51bWJlclR5cGVzLnNldCgnSW50OEFycmF5JywgdGhpcy5nbC5CWVRFKVxuICAgIHRoaXMuZ2xOdW1iZXJUeXBlcy5zZXQoJ0ludDE2QXJyYXknLCB0aGlzLmdsLlNIT1JUKVxuXG4gICAgdGhpcy5jYW52YXMud2lkdGggPSB0aGlzLmNhbnZhcy5jbGllbnRXaWR0aFxuICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IHRoaXMuY2FudmFzLmNsaWVudEhlaWdodFxuXG4gICAgdGhpcy5nbC52aWV3cG9ydCgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KVxuICB9XG5cbiAgcHVibGljIHNldEJnQ29sb3IoY29sb3I6IHN0cmluZykge1xuICAgIGxldCBbciwgZywgYl0gPSBjb2xvckZyb21IZXhUb0dsUmdiKGNvbG9yKVxuICAgIHRoaXMuZ2wuY2xlYXJDb2xvcihyLCBnLCBiLCAwLjApXG4gIH1cblxuICBwdWJsaWMgY2xlYXJCYWNrZ3JvdW5kKCkge1xuICAgIHRoaXMuZ2wuY2xlYXIodGhpcy5nbC5DT0xPUl9CVUZGRVJfQklUKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDQodC+0LfQtNCw0LXRgiDRiNC10LnQtNC10YAgV2ViR0wuXG4gICAqXG4gICAqIEBwYXJhbSBzaGFkZXJUeXBlINCi0LjQvyDRiNC10LnQtNC10YDQsC5cbiAgICogQHBhcmFtIHNoYWRlckNvZGUg0JrQvtC0INGI0LXQudC00LXRgNCwINC90LAg0Y/Qt9GL0LrQtSBHTFNMLlxuICAgKiBAcmV0dXJucyDQodC+0LfQtNCw0L3QvdGL0Lkg0L7QsdGK0LXQutGCINGI0LXQudC00LXRgNCwLlxuICAgKi9cbiAgcHVibGljIGNyZWF0ZVNoYWRlcihzaGFkZXJUeXBlOiAnVkVSVEVYX1NIQURFUicgfCAnRlJBR01FTlRfU0hBREVSJywgc2hhZGVyQ29kZTogc3RyaW5nKTogV2ViR0xTaGFkZXIge1xuXG4gICAgLy8g0KHQvtC30LTQsNC90LjQtSwg0L/RgNC40LLRj9C30LrQsCDQutC+0LTQsCDQuCDQutC+0LzQv9C40LvRj9GG0LjRjyDRiNC10LnQtNC10YDQsC5cbiAgICBjb25zdCBzaGFkZXIgPSB0aGlzLmdsLmNyZWF0ZVNoYWRlcih0aGlzLmdsW3NoYWRlclR5cGVdKSFcbiAgICB0aGlzLmdsLnNoYWRlclNvdXJjZShzaGFkZXIsIHNoYWRlckNvZGUpXG4gICAgdGhpcy5nbC5jb21waWxlU2hhZGVyKHNoYWRlcilcblxuICAgIGlmICghdGhpcy5nbC5nZXRTaGFkZXJQYXJhbWV0ZXIoc2hhZGVyLCB0aGlzLmdsLkNPTVBJTEVfU1RBVFVTKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCfQntGI0LjQsdC60LAg0LrQvtC80L/QuNC70Y/RhtC40Lgg0YjQtdC50LTQtdGA0LAgWycgKyBzaGFkZXJUeXBlICsgJ10uICcgKyB0aGlzLmdsLmdldFNoYWRlckluZm9Mb2coc2hhZGVyKSlcbiAgICB9XG5cbiAgICByZXR1cm4gc2hhZGVyXG4gIH1cblxuICAvKipcbiAgICog0KHQvtC30LTQsNC10YIg0L/RgNC+0LPRgNCw0LzQvNGDIFdlYkdMLlxuICAgKlxuICAgKiBAcGFyYW0ge1dlYkdMU2hhZGVyfSB2ZXJ0ZXhTaGFkZXIg0JLQtdGA0YjQuNC90L3Ri9C5INGI0LXQudC00LXRgC5cbiAgICogQHBhcmFtIHtXZWJHTFNoYWRlcn0gZnJhZ21lbnRTaGFkZXIg0KTRgNCw0LPQvNC10L3RgtC90YvQuSDRiNC10LnQtNC10YAuXG4gICAqL1xuICBwdWJsaWMgY3JlYXRlUHJvZ3JhbUZyb21TaGFkZXJzKHNoYWRlclZlcnQ6IFdlYkdMU2hhZGVyLCBzaGFkZXJGcmFnOiBXZWJHTFNoYWRlcik6IHZvaWQge1xuICAgIHRoaXMuZ3B1UHJvZ3JhbSA9IHRoaXMuZ2wuY3JlYXRlUHJvZ3JhbSgpIVxuICAgIHRoaXMuZ2wuYXR0YWNoU2hhZGVyKHRoaXMuZ3B1UHJvZ3JhbSwgc2hhZGVyVmVydClcbiAgICB0aGlzLmdsLmF0dGFjaFNoYWRlcih0aGlzLmdwdVByb2dyYW0sIHNoYWRlckZyYWcpXG4gICAgdGhpcy5nbC5saW5rUHJvZ3JhbSh0aGlzLmdwdVByb2dyYW0pXG4gICAgdGhpcy5nbC51c2VQcm9ncmFtKHRoaXMuZ3B1UHJvZ3JhbSlcbiAgfVxuXG4gIHB1YmxpYyBjcmVhdGVQcm9ncmFtKHNoYWRlckNvZGVWZXJ0OiBzdHJpbmcsIHNoYWRlckNvZGVGcmFnOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLmNyZWF0ZVByb2dyYW1Gcm9tU2hhZGVycyhcbiAgICAgIHRoaXMuY3JlYXRlU2hhZGVyKCdWRVJURVhfU0hBREVSJywgc2hhZGVyQ29kZVZlcnQpLFxuICAgICAgdGhpcy5jcmVhdGVTaGFkZXIoJ0ZSQUdNRU5UX1NIQURFUicsIHNoYWRlckNvZGVGcmFnKVxuICAgIClcbiAgfVxuXG4gIC8qKlxuICAgKiDQo9GB0YLQsNC90LDQstC70LjQstCw0LXRgiDRgdCy0Y/Qt9GMINC/0LXRgNC10LzQtdC90L3QvtC5INC/0YDQuNC70L7QttC10L3QuNGPINGBINC/0YDQvtCz0YDQsNC80LzQvtC5IFdlYkdsLlxuICAgKlxuICAgKiBAcGFyYW0gdmFyVHlwZSDQotC40L8g0L/QtdGA0LXQvNC10L3QvdC+0LkuXG4gICAqIEBwYXJhbSB2YXJOYW1lINCY0LzRjyDQv9C10YDQtdC80LXQvdC90L7QuS5cbiAgICovXG4gIHB1YmxpYyBjcmVhdGVWYXJpYWJsZSh2YXJOYW1lOiBzdHJpbmcpOiB2b2lkIHtcblxuICAgIGNvbnN0IHZhclR5cGUgPSB2YXJOYW1lLnNsaWNlKDAsIDIpXG5cbiAgICBpZiAodmFyVHlwZSA9PT0gJ3VfJykge1xuICAgICAgdGhpcy52YXJpYWJsZXMuc2V0KHZhck5hbWUsIHRoaXMuZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHRoaXMuZ3B1UHJvZ3JhbSwgdmFyTmFtZSkpXG4gICAgfSBlbHNlIGlmICh2YXJUeXBlID09PSAnYV8nKSB7XG4gICAgICB0aGlzLnZhcmlhYmxlcy5zZXQodmFyTmFtZSwgdGhpcy5nbC5nZXRBdHRyaWJMb2NhdGlvbih0aGlzLmdwdVByb2dyYW0sIHZhck5hbWUpKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ9Cd0LUg0YPQutCw0LfQsNC9INGC0LjQvyAo0L/RgNC10YTQuNC60YEpINC/0LXRgNC10LzQtdC90L3QvtC5INGI0LXQudC00LXRgNCwOiAnICsgdmFyTmFtZSlcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgY3JlYXRlVmFyaWFibGVzKC4uLnZhck5hbWVzOiBzdHJpbmdbXSk6IHZvaWQge1xuICAgIHZhck5hbWVzLmZvckVhY2godmFyTmFtZSA9PiB0aGlzLmNyZWF0ZVZhcmlhYmxlKHZhck5hbWUpKTtcbiAgfVxuICAvKipcbiAgICog0KHQvtC30LTQsNC10YIg0LIg0LzQsNGB0YHQuNCy0LUg0LHRg9GE0LXRgNC+0LIgV2ViR0wg0L3QvtCy0YvQuSDQsdGD0YTQtdGAINC4INC30LDQv9C40YHRi9Cy0LDQtdGCINCyINC90LXQs9C+INC/0LXRgNC10LTQsNC90L3Ri9C1INC00LDQvdC90YvQtS5cbiAgICpcbiAgICogQHBhcmFtIGJ1ZmZlcnMgLSDQnNCw0YHRgdC40LIg0LHRg9GE0LXRgNC+0LIgV2ViR0wsINCyINC60L7RgtC+0YDRi9C5INCx0YPQtNC10YIg0LTQvtCx0LDQstC70LXQvSDRgdC+0LfQtNCw0LLQsNC10LzRi9C5INCx0YPRhNC10YAuXG4gICAqIEBwYXJhbSB0eXBlIC0g0KLQuNC/INGB0L7Qt9C00LDQstCw0LXQvNC+0LPQviDQsdGD0YTQtdGA0LAuXG4gICAqIEBwYXJhbSBkYXRhIC0g0JTQsNC90L3Ri9C1INCyINCy0LjQtNC1INGC0LjQv9C40LfQuNGA0L7QstCw0L3QvdC+0LPQviDQvNCw0YHRgdC40LLQsCDQtNC70Y8g0LfQsNC/0LjRgdC4INCyINGB0L7Qt9C00LDQstCw0LXQvNGL0Lkg0LHRg9GE0LXRgC5cbiAgICogQHBhcmFtIGtleSAtINCa0LvRjtGHICjQuNC90LTQtdC60YEpLCDQuNC00LXQvdGC0LjRhNC40YbQuNGA0YPRjtGJ0LjQuSDRgtC40L8g0LHRg9GE0LXRgNCwICjQtNC70Y8g0LLQtdGA0YjQuNC9LCDQtNC70Y8g0YbQstC10YLQvtCyLCDQtNC70Y8g0LjQvdC00LXQutGB0L7QsikuINCY0YHQv9C+0LvRjNC30YPQtdGC0YHRjyDQtNC70Y9cbiAgICogICAgINGA0LDQt9C00LXQu9GM0L3QvtCz0L4g0L/QvtC00YHRh9C10YLQsCDQv9Cw0LzRj9GC0LgsINC30LDQvdC40LzQsNC10LzQvtC5INC60LDQttC00YvQvCDRgtC40L/QvtC8INCx0YPRhNC10YDQsC5cbiAgICovXG4gIHB1YmxpYyBjcmVhdGVCdWZmZXIoZ3JvdXBOYW1lOiBzdHJpbmcsIGRhdGE6IFR5cGVkQXJyYXkpOiBudW1iZXIge1xuXG4gICAgY29uc3QgYnVmZmVyID0gdGhpcy5nbC5jcmVhdGVCdWZmZXIoKSFcbiAgICB0aGlzLmdsLmJpbmRCdWZmZXIodGhpcy5nbC5BUlJBWV9CVUZGRVIsIGJ1ZmZlcilcbiAgICB0aGlzLmdsLmJ1ZmZlckRhdGEodGhpcy5nbC5BUlJBWV9CVUZGRVIsIGRhdGEsIHRoaXMuZ2wuU1RBVElDX0RSQVcpXG5cbiAgICBpZiAoIXRoaXMuZGF0YS5oYXMoZ3JvdXBOYW1lKSkge1xuICAgICAgdGhpcy5kYXRhLnNldChncm91cE5hbWUsIHsgYnVmZmVyczogW10sIHR5cGU6IHRoaXMuZ2xOdW1iZXJUeXBlcy5nZXQoZGF0YS5jb25zdHJ1Y3Rvci5uYW1lKSF9KVxuICAgIH1cblxuICAgIHRoaXMuZGF0YS5nZXQoZ3JvdXBOYW1lKSEuYnVmZmVycy5wdXNoKGJ1ZmZlcilcblxuICAgIHJldHVybiBkYXRhLmxlbmd0aCAqIGRhdGEuQllURVNfUEVSX0VMRU1FTlRcbiAgfVxuXG4gIHB1YmxpYyBzZXRWYXJpYWJsZSh2YXJOYW1lOiBzdHJpbmcsIHZhclZhbHVlOiBudW1iZXJbXSkge1xuICAgIHRoaXMuZ2wudW5pZm9ybU1hdHJpeDNmdih0aGlzLnZhcmlhYmxlcy5nZXQodmFyTmFtZSksIGZhbHNlLCB2YXJWYWx1ZSlcbiAgfVxuXG4gIHB1YmxpYyBzZXRCdWZmZXIoZ3JvdXBOYW1lOiBzdHJpbmcsIGluZGV4OiBudW1iZXIsIHZhck5hbWU6IHN0cmluZywgc2l6ZTogbnVtYmVyLCBzdHJpZGU6IG51bWJlciwgb2Zmc2V0OiBudW1iZXIpIHtcbiAgICBjb25zdCBncm91cCA9IHRoaXMuZGF0YS5nZXQoZ3JvdXBOYW1lKSFcbiAgICBjb25zdCB2YXJpYWJsZSA9IHRoaXMudmFyaWFibGVzLmdldCh2YXJOYW1lKVxuXG4gICAgdGhpcy5nbC5iaW5kQnVmZmVyKHRoaXMuZ2wuQVJSQVlfQlVGRkVSLCBncm91cC5idWZmZXJzW2luZGV4XSlcbiAgICB0aGlzLmdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KHZhcmlhYmxlKVxuICAgIHRoaXMuZ2wudmVydGV4QXR0cmliUG9pbnRlcih2YXJpYWJsZSwgc2l6ZSwgZ3JvdXAudHlwZSwgZmFsc2UsIHN0cmlkZSwgb2Zmc2V0KVxuICB9XG5cbiAgcHVibGljIGRyYXdQb2ludHMoZmlyc3Q6IG51bWJlciwgY291bnQ6IG51bWJlcikge1xuICAgIHRoaXMuZ2wuZHJhd0FycmF5cyh0aGlzLmdsLlBPSU5UUywgZmlyc3QsIGNvdW50KVxuICB9XG59XG4iLCJpbXBvcnQgeyBjb3B5TWF0Y2hpbmdLZXlWYWx1ZXMsIGNvbG9yRnJvbUhleFRvR2xSZ2IgfSBmcm9tICcuL3V0aWxzJ1xuaW1wb3J0IFNIQURFUl9DT0RFX1ZFUlRfVE1QTCBmcm9tICcuL3NoYWRlci1jb2RlLXZlcnQtdG1wbCdcbmltcG9ydCBTSEFERVJfQ09ERV9GUkFHX1RNUEwgZnJvbSAnLi9zaGFkZXItY29kZS1mcmFnLXRtcGwnXG5pbXBvcnQgU1Bsb3RDb250b2wgZnJvbSAnLi9zcGxvdC1jb250cm9sJ1xuaW1wb3J0IFNQbG90V2ViR2wgZnJvbSAnLi9zcGxvdC13ZWJnbCdcbmltcG9ydCBTUGxvdERlYnVnIGZyb20gJy4vc3Bsb3QtZGVidWcnXG5pbXBvcnQgU1Bsb3REZW1vIGZyb20gJy4vc3Bsb3QtZGVtbydcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU1Bsb3Qge1xuXG4gIHB1YmxpYyBpdGVyYXRvcjogU1Bsb3RJdGVyYXRvciA9IHVuZGVmaW5lZCAgICAgLy8g0KTRg9C90LrRhtC40Y8g0LjRgtC10YDQuNGA0L7QstCw0L3QuNGPINC40YHRhdC+0LTQvdGL0YUg0LTQsNC90L3Ri9GFLlxuICBwdWJsaWMgZGVtbzogU1Bsb3REZW1vID0gbmV3IFNQbG90RGVtbygpICAgICAgIC8vINCl0LXQu9C/0LXRgCDRgNC10LbQuNC80LAg0LTQtdC80L4t0LTQsNC90L3Ri9GFLlxuICBwdWJsaWMgZGVidWc6IFNQbG90RGVidWcgPSBuZXcgU1Bsb3REZWJ1ZygpICAgIC8vINCl0LXQu9C/0LXRgCDRgNC10LbQuNC80LAg0L7RgtC70LDQtNC60LhcbiAgcHVibGljIHdlYmdsOiBTUGxvdFdlYkdsID0gbmV3IFNQbG90V2ViR2woKSAgICAvLyDQpdC10LvQv9C10YAgV2ViR0wuXG4gIHB1YmxpYyBmb3JjZVJ1bjogYm9vbGVhbiA9IGZhbHNlICAgICAgICAgICAgICAgLy8g0J/RgNC40LfQvdCw0Log0YTQvtGA0YHQuNGA0L7QstCw0L3QvdC+0LPQviDQt9Cw0L/Rg9GB0LrQsCDRgNC10L3QtNC10YDQsC5cbiAgcHVibGljIGdsb2JhbExpbWl0OiBudW1iZXIgPSAxXzAwMF8wMDBfMDAwICAgICAvLyDQntCz0YDQsNC90LjRh9C10L3QuNC1INC60L7Quy3QstCwINC+0LHRitC10LrRgtC+0LIg0L3QsCDQs9GA0LDRhNC40LrQtS5cbiAgcHVibGljIGdyb3VwTGltaXQ6IG51bWJlciA9IDEwXzAwMCAgICAgICAgICAgICAvLyDQntCz0YDQsNC90LjRh9C10L3QuNC1INC60L7Quy3QstCwINC+0LHRitC10LrRgtC+0LIg0LIg0LPRgNGD0L/Qv9C1LlxuICBwdWJsaWMgaXNSdW5uaW5nOiBib29sZWFuID0gZmFsc2UgICAgICAgICAgICAgIC8vINCf0YDQuNC30L3QsNC6INCw0LrRgtC40LLQvdC+0LPQviDQv9GA0L7RhtC10YHRgdCwINGA0LXQvdC00LXRgNCwLlxuICBwdWJsaWMgY29sb3JzOiBzdHJpbmdbXSA9IFtdXG5cbiAgcHVibGljIGdyaWQ6IFNQbG90R3JpZCA9IHsgICAgLy8g0J/QsNGA0LDQvNC10YLRgNGLINC60L7QvtGA0LTQuNC90LDRgtC90L7QuSDQv9C70L7RgdC60L7RgdGC0LguXG4gICAgd2lkdGg6IDMyXzAwMCxcbiAgICBoZWlnaHQ6IDE2XzAwMCxcbiAgICBiZ0NvbG9yOiAnI2ZmZmZmZicsXG4gICAgcnVsZXNDb2xvcjogJyNjMGMwYzAnXG4gIH1cblxuICBwdWJsaWMgY2FtZXJhOiBTUGxvdENhbWVyYSA9IHsgICAgLy8g0J/QsNGA0LDQvNC10YLRgNGLINC+0LHQu9Cw0YHRgtC4INC/0YDQvtGB0LzQvtGC0YDQsC5cbiAgICB4OiB0aGlzLmdyaWQud2lkdGghIC8gMixcbiAgICB5OiB0aGlzLmdyaWQuaGVpZ2h0ISAvIDIsXG4gICAgem9vbTogMVxuICB9XG5cbiAgcHVibGljIHJlYWRvbmx5IHNoYXBlczogeyBuYW1lOiBzdHJpbmcgfVtdID0gW11cbiAgcHJvdGVjdGVkIHNoYWRlckNvZGVWZXJ0OiBzdHJpbmcgPSBTSEFERVJfQ09ERV9WRVJUX1RNUEwgICAgICAgICAvLyDQqNCw0LHQu9C+0L0gR0xTTC3QutC+0LTQsCDQtNC70Y8g0LLQtdGA0YjQuNC90L3QvtCz0L4g0YjQtdC50LTQtdGA0LAuXG4gIHByb3RlY3RlZCBzaGFkZXJDb2RlRnJhZzogc3RyaW5nID0gU0hBREVSX0NPREVfRlJBR19UTVBMICAgICAgICAgLy8g0KjQsNCx0LvQvtC9IEdMU0wt0LrQvtC00LAg0LTQu9GPINGE0YDQsNCz0LzQtdC90YLQvdC+0LPQviDRiNC10LnQtNC10YDQsC5cbiAgcHJvdGVjdGVkIG9iamVjdENvdW50ZXI6IG51bWJlciA9IDAgICAgICAgICAgICAgICAgICAgIC8vINCh0YfQtdGC0YfQuNC6INGH0LjRgdC70LAg0L7QsdGA0LDQsdC+0YLQsNC90L3Ri9GFINC/0L7Qu9C40LPQvtC90L7Qsi5cblxuICBwcm90ZWN0ZWQgY29udHJvbDogU1Bsb3RDb250b2wgPSBuZXcgU1Bsb3RDb250b2woKSAgICAvLyDQpdC10LvQv9C10YAg0LLQt9Cw0LjQvNC+0LTQtdC50YHRgtCy0LjRjyDRgSDRg9GB0YLRgNC+0LnRgdGC0LLQvtC8INCy0LLQvtC00LAuXG5cbiAgcHVibGljIHN0YXRzID0ge1xuICAgIG9iamVjdHNDb3VudFRvdGFsOiAwLFxuICAgIG9iamVjdHNDb3VudEluR3JvdXBzOiBbXSBhcyBudW1iZXJbXSxcbiAgICBncm91cHNDb3VudDogMCxcbiAgICBtZW1Vc2FnZTogMCxcbiAgICBzaGFwZXM6IFtdXG4gIH1cblxuICAvKipcbiAgICog0KHQvtC30LTQsNC10YIg0Y3QutC30LXQvNC/0LvRj9GAINC60LvQsNGB0YHQsCwg0LjQvdC40YbQuNCw0LvQuNC30LjRgNGD0LXRgiDQvdCw0YHRgtGA0L7QudC60LguXG4gICAqXG4gICAqIEByZW1hcmtzXG4gICAqINCV0YHQu9C4INC60LDQvdCy0LDRgSDRgSDQt9Cw0LTQsNC90L3Ri9C8INC40LTQtdC90YLQuNGE0LjQutCw0YLQvtGA0L7QvCDQvdC1INC90LDQudC00LXQvSAtINCz0LXQvdC10YDQuNGA0YPQtdGC0YHRjyDQvtGI0LjQsdC60LAuINCd0LDRgdGC0YDQvtC50LrQuCDQvNC+0LPRg9GCINCx0YvRgtGMINC30LDQtNCw0L3RiyDQutCw0Log0LJcbiAgICog0LrQvtC90YHRgtGA0YPQutGC0L7RgNC1LCDRgtCw0Log0Lgg0LIg0LzQtdGC0L7QtNC1IHtAbGluayBzZXR1cH0uINCe0LTQvdCw0LrQviDQsiDQu9GO0LHQvtC8INGB0LvRg9GH0LDQtSDQvdCw0YHRgtGA0L7QudC60Lgg0LTQvtC70LbQvdGLINCx0YvRgtGMINC30LDQtNCw0L3RiyDQtNC+INC30LDQv9GD0YHQutCwINGA0LXQvdC00LXRgNCwLlxuICAgKlxuICAgKiBAcGFyYW0gY2FudmFzSWQgLSDQmNC00LXQvdGC0LjRhNC40LrQsNGC0L7RgCDQutCw0L3QstCw0YHQsCwg0L3QsCDQutC+0YLQvtGA0L7QvCDQsdGD0LTQtdGCINGA0LjRgdC+0LLQsNGC0YzRgdGPINCz0YDQsNGE0LjQui5cbiAgICogQHBhcmFtIG9wdGlvbnMgLSDQn9C+0LvRjNC30L7QstCw0YLQtdC70YzRgdC60LjQtSDQvdCw0YHRgtGA0L7QudC60Lgg0Y3QutC30LXQvNC/0LvRj9GA0LAuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihjYW52YXNJZDogc3RyaW5nLCBvcHRpb25zPzogU1Bsb3RPcHRpb25zKSB7XG5cbiAgICB0aGlzLndlYmdsLnByZXBhcmUoY2FudmFzSWQpXG4gICAgdGhpcy5jb250cm9sLnByZXBhcmUodGhpcylcblxuICAgIC8vINCU0L7QsdCw0LLQu9C10L3QuNC1INGE0L7RgNC80Ysg0LIg0LzQsNGB0YHQuNCyINGE0L7RgNC8LlxuICAgIHRoaXMuc2hhcGVzLnB1c2goe1xuICAgICAgbmFtZTogJ9Ci0L7Rh9C60LAnXG4gICAgfSlcbiAgICAvLyDQlNC+0LHQsNCy0LvQtdC90LjQtSDRhNC+0YDQvNGLINCyINC80LDRgdGB0LjQsiDRh9Cw0YHRgtC+0YIg0L/QvtGP0LLQu9C10L3QuNGPINCyINC00LXQvNC+LdGA0LXQttC40LzQtS5cbiAgICB0aGlzLmRlbW8uc2hhcGVRdW90YSEucHVzaCgxKVxuXG4gICAgaWYgKG9wdGlvbnMpIHtcbiAgICAgIHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKSAgICAvLyDQldGB0LvQuCDQv9C10YDQtdC00LDQvdGLINC90LDRgdGC0YDQvtC50LrQuCwg0YLQviDQvtC90Lgg0L/RgNC40LzQtdC90Y/RjtGC0YHRjy5cblxuICAgICAgaWYgKHRoaXMuZm9yY2VSdW4pIHtcbiAgICAgICAgdGhpcy5zZXR1cChvcHRpb25zKSAgICAgICAvLyAg0JjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y8g0LLRgdC10YUg0L/QsNGA0LDQvNC10YLRgNC+0LIg0YDQtdC90LTQtdGA0LAsINC10YHQu9C4INC30LDQv9GA0L7RiNC10L0g0YTQvtGA0YHQuNGA0L7QstCw0L3QvdGL0Lkg0LfQsNC/0YPRgdC6LlxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDQmNC90LjRhtC40LDQu9C40LfQuNGA0YPQtdGCINC90LXQvtCx0YXQvtC00LjQvNGL0LUg0LTQu9GPINGA0LXQvdC00LXRgNCwINC/0LDRgNCw0LzQtdGC0YDRiyDRjdC60LfQtdC80L/Qu9GP0YDQsCDQuCBXZWJHTC5cbiAgICpcbiAgICogQHBhcmFtIG9wdGlvbnMgLSDQn9C+0LvRjNC30L7QstCw0YLQtdC70YzRgdC60LjQtSDQvdCw0YHRgtGA0L7QudC60Lgg0Y3QutC30LXQvNC/0LvRj9GA0LAuXG4gICAqL1xuICBwdWJsaWMgc2V0dXAob3B0aW9uczogU1Bsb3RPcHRpb25zKTogdm9pZCB7XG5cbiAgICB0aGlzLnNldE9wdGlvbnMob3B0aW9ucykgICAgIC8vINCf0YDQuNC80LXQvdC10L3QuNC1INC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjNGB0LrQuNGFINC90LDRgdGC0YDQvtC10LouXG4gICAgdGhpcy53ZWJnbC5jcmVhdGUoKSAgICAgICAgICAgICAgLy8g0KHQvtC30LTQsNC90LjQtSDQutC+0L3RgtC10LrRgdGC0LAg0YDQtdC90LTQtdGA0LjQvdCz0LAuXG4gICAgdGhpcy5kZW1vLnByZXBhcmUodGhpcy5ncmlkKSAgICAgIC8vINCe0LHQvdGD0LvQtdC90LjQtSDRgtC10YXQvdC40YfQtdGB0LrQvtCz0L4g0YHRh9C10YLRh9C40LrQsCDRgNC10LbQuNC80LAg0LTQtdC80L4t0LTQsNC90L3Ri9GFLlxuICAgIHRoaXMub2JqZWN0Q291bnRlciA9IDAgICAgLy8g0J7QsdC90YPQu9C10L3QuNC1INGB0YfQtdGC0YfQuNC60LAg0L/QvtC70LjQs9C+0L3QvtCyLlxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnN0YXRzLnNoYXBlcy5sZW5ndGg7IGkrKykge1xuICAgIC8vICB0aGlzLnN0YXRzLnNoYXBlc1tpXSA9IDAgICAgLy8g0J7QsdC90YPQu9C10L3QuNC1INGB0YfQtdGC0YfQuNC60L7QsiDRhNC+0YDQvCDQv9C+0LvQuNCz0L7QvdC+0LIuXG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZGVidWcuaXNFbmFibGUpIHtcbiAgICAgIHRoaXMuZGVidWcubG9nSW50cm8odGhpcywgdGhpcy53ZWJnbC5jYW52YXMpXG4gICAgICB0aGlzLmRlYnVnLmxvZ0dwdUluZm8odGhpcy53ZWJnbC5ncHUuaGFyZHdhcmUsIHRoaXMud2ViZ2wuZ3B1LnNvZnR3YXJlKVxuICAgICAgdGhpcy5kZWJ1Zy5sb2dJbnN0YW5jZUluZm8odGhpcywgdGhpcy53ZWJnbC5jYW52YXMsIG9wdGlvbnMpXG4gICAgfVxuXG4gICAgdGhpcy53ZWJnbC5zZXRCZ0NvbG9yKHRoaXMuZ3JpZC5iZ0NvbG9yISkgICAgLy8g0KPRgdGC0LDQvdC+0LLQutCwINGG0LLQtdGC0LAg0L7Rh9C40YHRgtC60Lgg0YDQtdC90LTQtdGA0LjQvdCz0LBcblxuICAgIC8vINCh0L7Qt9C00LDQvdC40LUg0YjQtdC50LTQtdGA0L7QsiBXZWJHTC5cbiAgICBjb25zdCBzaGFkZXJDb2RlVmVydCA9IHRoaXMuc2hhZGVyQ29kZVZlcnQucmVwbGFjZSgne0VYVC1DT0RFfScsIHRoaXMuZ2VuU2hhZGVyQ29sb3JDb2RlKCkpXG4gICAgY29uc3Qgc2hhZGVyQ29kZUZyYWcgPSB0aGlzLnNoYWRlckNvZGVGcmFnXG5cbiAgICB0aGlzLndlYmdsLmNyZWF0ZVByb2dyYW0oc2hhZGVyQ29kZVZlcnQsIHNoYWRlckNvZGVGcmFnKSAgICAvLyDQodC+0LfQtNCw0L3QuNC1INC/0YDQvtCz0YDQsNC80LzRiyBXZWJHTC5cblxuICAgIGlmICh0aGlzLmRlYnVnLmlzRW5hYmxlKSB7XG4gICAgICB0aGlzLmRlYnVnLmxvZ1NoYWRlckluZm8oJ1ZFUlRFWF9TSEFERVInLCBzaGFkZXJDb2RlVmVydClcbiAgICAgIHRoaXMuZGVidWcubG9nU2hhZGVySW5mbygnRlJBR01FTlRfU0hBREVSJywgc2hhZGVyQ29kZUZyYWcpXG4gICAgfVxuXG4gICAgLy8g0KHQvtC30LTQsNC90LjQtSDQv9C10YDQtdC80LXQvdC90YvRhSBXZWJHbC5cbiAgICB0aGlzLndlYmdsLmNyZWF0ZVZhcmlhYmxlcygnYV9wb3NpdGlvbicsICdhX2NvbG9yJywgJ2Ffc2l6ZScsICdhX3NoYXBlJywgJ3VfbWF0cml4JylcblxuICAgIHRoaXMubG9hZERhdGEoKSAgICAvLyDQl9Cw0L/QvtC70L3QtdC90LjQtSDQsdGD0YTQtdGA0L7QsiBXZWJHTC5cblxuICAgIGlmICh0aGlzLmZvcmNlUnVuKSB7XG4gICAgICB0aGlzLnJ1bigpICAgICAgICAgICAgICAgIC8vINCk0L7RgNGB0LjRgNC+0LLQsNC90L3Ri9C5INC30LDQv9GD0YHQuiDRgNC10L3QtNC10YDQuNC90LPQsCAo0LXRgdC70Lgg0YLRgNC10LHRg9C10YLRgdGPKS5cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICog0J/RgNC40LzQtdC90Y/QtdGCINC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjNGB0LrQuNC1INC90LDRgdGC0YDQvtC50LrQuCDRjdC60LfQtdC80L/Qu9GP0YDQsC5cbiAgICpcbiAgICogQHBhcmFtIG9wdGlvbnMgLSDQn9C+0LvRjNC30L7QstCw0YLQtdC70YzRgdC60LjQtSDQvdCw0YHRgtGA0L7QudC60Lgg0Y3QutC30LXQvNC/0LvRj9GA0LAuXG4gICAqL1xuICBwcm90ZWN0ZWQgc2V0T3B0aW9ucyhvcHRpb25zOiBTUGxvdE9wdGlvbnMpOiB2b2lkIHtcblxuICAgIGNvcHlNYXRjaGluZ0tleVZhbHVlcyh0aGlzLCBvcHRpb25zKSAgICAvLyDQn9GA0LjQvNC10L3QtdC90LjQtSDQv9C+0LvRjNC30L7QstCw0YLQtdC70YzRgdC60LjRhSDQvdCw0YHRgtGA0L7QtdC6LlxuXG4gICAgLy8g0JXRgdC70Lgg0LfQsNC00LDQvSDRgNCw0LfQvNC10YAg0L/Qu9C+0YHQutC+0YHRgtC4LCDQvdC+INC90LUg0LfQsNC00LDQvdC+INC/0L7Qu9C+0LbQtdC90LjQtSDQvtCx0LvQsNGB0YLQuCDQv9GA0L7RgdC80L7RgtGA0LAsINGC0L4g0L7QsdC70LDRgdGC0Ywg0L/QvtC80LXRidCw0LXRgtGB0Y8g0LIg0YbQtdC90YLRgCDQv9C70L7RgdC60L7RgdGC0LguXG4gICAgaWYgKCgnZ3JpZCcgaW4gb3B0aW9ucykgJiYgISgnY2FtZXJhJyBpbiBvcHRpb25zKSkge1xuICAgICAgdGhpcy5jYW1lcmEueCA9IHRoaXMuZ3JpZC53aWR0aCEgLyAyXG4gICAgICB0aGlzLmNhbWVyYS55ID0gdGhpcy5ncmlkLmhlaWdodCEgLyAyXG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZGVtby5pc0VuYWJsZSkge1xuICAgICAgdGhpcy5pdGVyYXRvciA9IHRoaXMuZGVtby5pdGVyYXRvciAgICAvLyDQmNC80LjRgtCw0YbQuNGPINC40YLQtdGA0LjRgNC+0LLQsNC90LjRjyDQtNC70Y8g0LTQtdC80L4t0YDQtdC20LjQvNCwLlxuICAgICAgdGhpcy5jb2xvcnMgPSB0aGlzLmRlbW8uY29sb3JzXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqINCh0L7Qt9C00LDQtdGCINC4INC30LDQv9C+0LvQvdGP0LXRgiDQtNCw0L3QvdGL0LzQuCDQvtCx0L4g0LLRgdC10YUg0L/QvtC70LjQs9C+0L3QsNGFINCx0YPRhNC10YDRiyBXZWJHTC5cbiAgICovXG4gIHByb3RlY3RlZCBsb2FkRGF0YSgpOiB2b2lkIHtcblxuICAgIC8vINCS0YvQstC+0LQg0L7RgtC70LDQtNC+0YfQvdC+0Lkg0LjQvdGE0L7RgNC80LDRhtC40LguXG4gICAgaWYgKHRoaXMuZGVidWcuaXNFbmFibGUpIHtcbiAgICAgIHRoaXMuZGVidWcubG9nRGF0YUxvYWRpbmdTdGFydCgpXG4gICAgfVxuXG4gICAgbGV0IHBvbHlnb25Hcm91cDogU1Bsb3RQb2x5Z29uR3JvdXAgfCBudWxsXG4gICAgdGhpcy5zdGF0cy5tZW1Vc2FnZSA9IDBcbiAgICAvLyDQmNGC0LXRgNC40YDQvtCy0LDQvdC40LUg0LPRgNGD0L/QvyDQv9C+0LvQuNCz0L7QvdC+0LIuXG4gICAgd2hpbGUgKHBvbHlnb25Hcm91cCA9IHRoaXMuY3JlYXRlUG9seWdvbkdyb3VwKCkpIHtcblxuICAgICAgLy8g0KHQvtC30LTQsNC90LjQtSDQuCDQt9Cw0L/QvtC70L3QtdC90LjQtSDQsdGD0YTQtdGA0L7QsiDQtNCw0L3QvdGL0LzQuCDQviDRgtC10LrRg9GJ0LXQuSDQs9GA0YPQv9C/0LUg0L/QvtC70LjQs9C+0L3QvtCyLlxuICAgICAgdGhpcy5zdGF0cy5tZW1Vc2FnZSArPVxuICAgICAgICB0aGlzLndlYmdsLmNyZWF0ZUJ1ZmZlcigndmVydGljZXMnLCBuZXcgRmxvYXQzMkFycmF5KHBvbHlnb25Hcm91cC52ZXJ0aWNlcykpICtcbiAgICAgICAgdGhpcy53ZWJnbC5jcmVhdGVCdWZmZXIoJ2NvbG9ycycsIG5ldyBVaW50OEFycmF5KHBvbHlnb25Hcm91cC5jb2xvcnMpKSArXG4gICAgICAgIHRoaXMud2ViZ2wuY3JlYXRlQnVmZmVyKCdzaGFwZXMnLCBuZXcgVWludDhBcnJheShwb2x5Z29uR3JvdXAuc2hhcGVzKSkgK1xuICAgICAgICB0aGlzLndlYmdsLmNyZWF0ZUJ1ZmZlcignc2l6ZXMnLCBuZXcgRmxvYXQzMkFycmF5KHBvbHlnb25Hcm91cC5zaXplcykpXG5cbiAgICAgIHRoaXMuc3RhdHMub2JqZWN0c0NvdW50SW5Hcm91cHMucHVzaChwb2x5Z29uR3JvdXAudmVydGljZXMubGVuZ3RoIC8gMilcbiAgICAgIHRoaXMuc3RhdHMuZ3JvdXBzQ291bnQrKyAgICAgICAgICAgICAgLy8g0KHRh9C10YLRh9C40Log0LrQvtC70LjRh9C10YHRgtCy0LAg0LHRg9GE0LXRgNC+0LIuXG4gICAgfVxuXG4gICAgLy8g0JLRi9Cy0L7QtCDQvtGC0LvQsNC00L7Rh9C90L7QuSDQuNC90YTQvtGA0LzQsNGG0LjQuC5cbiAgICBpZiAodGhpcy5kZWJ1Zy5pc0VuYWJsZSkge1xuICAgICAgdGhpcy5kZWJ1Zy5sb2dEYXRhTG9hZGluZ0NvbXBsZXRlKHRoaXMub2JqZWN0Q291bnRlciwgdGhpcy5nbG9iYWxMaW1pdClcbiAgICAgIHRoaXMuZGVidWcubG9nT2JqZWN0U3RhdHModGhpcywgdGhpcy5vYmplY3RDb3VudGVyKVxuICAgICAgdGhpcy5kZWJ1Zy5sb2dHcHVNZW1TdGF0cyh0aGlzLnN0YXRzKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDQodGH0LjRgtGL0LLQsNC10YIg0LTQsNC90L3Ri9C1INC+0LEg0LjRgdGF0L7QtNC90YvRhSDQvtCx0YrQtdC60YLQsNGFINC4INGE0L7RgNC80LjRgNGD0LXRgiDRgdC+0L7RgtCy0LXRgtGB0LLRg9GO0YnRg9GOINGN0YLQuNC8INC+0LHRitC10LrRgtCw0Lwg0LPRgNGD0L/Qv9GDINC/0L7Qu9C40LPQvtC90L7Qsi5cbiAgICpcbiAgICogQHJlbWFya3NcbiAgICog0JPRgNGD0L/Qv9CwINGE0L7RgNC80LjRgNGD0LXRgtGB0Y8g0YEg0YPRh9C10YLQvtC8INGC0LXRhdC90LjRh9C10YHQutC+0LPQviDQvtCz0YDQsNC90LjRh9C10L3QuNGPINC90LAg0LrQvtC70LjRh9C10YHRgtCy0L4g0LLQtdGA0YjQuNC9INCyINCz0YDRg9C/0L/QtSDQuCDQu9C40LzQuNGC0LAg0L3QsCDQvtCx0YnQtdC1INC60L7Qu9C40YfQtdGB0YLQstC+XG4gICAqINC/0L7Qu9C40LPQvtC90L7QsiDQvdCwINC60LDQvdCy0LDRgdC1LlxuICAgKlxuICAgKiBAcmV0dXJucyDQodC+0LfQtNCw0L3QvdCw0Y8g0LPRgNGD0L/Qv9CwINC/0L7Qu9C40LPQvtC90L7QsiDQuNC70LggbnVsbCwg0LXRgdC70Lgg0YTQvtGA0LzQuNGA0L7QstCw0L3QuNC1INCy0YHQtdGFINCz0YDRg9C/0L8g0L/QvtC70LjQs9C+0L3QvtCyINC30LDQstC10YDRiNC40LvQvtGB0YwuXG4gICAqL1xuICBwcm90ZWN0ZWQgY3JlYXRlUG9seWdvbkdyb3VwKCk6IFNQbG90UG9seWdvbkdyb3VwIHwgbnVsbCB7XG5cbiAgICBsZXQgcG9seWdvbkdyb3VwOiBTUGxvdFBvbHlnb25Hcm91cCA9IHtcbiAgICAgIHZlcnRpY2VzOiBbXSxcbiAgICAgIGNvbG9yczogW10sXG4gICAgICBzaXplczogW10sXG4gICAgICBzaGFwZXM6IFtdLFxuICAgICAgYW1vdW50T2ZWZXJ0aWNlczogMCxcbiAgICB9XG5cbiAgICBsZXQgcG9seWdvbjogU1Bsb3RQb2x5Z29uIHwgbnVsbCB8IHVuZGVmaW5lZFxuXG4gICAgLyoqXG4gICAgICog0JXRgdC70Lgg0LrQvtC70LjRh9C10YHRgtCy0L4g0L/QvtC70LjQs9C+0L3QvtCyINC60LDQvdCy0LDRgdCwINC00L7RgdGC0LjQs9C70L4g0LTQvtC/0YPRgdGC0LjQvNC+0LPQviDQvNCw0LrRgdC40LzRg9C80LAsINGC0L4g0LTQsNC70YzQvdC10LnRiNCw0Y8g0L7QsdGA0LDQsdC+0YLQutCwINC40YHRhdC+0LTQvdGL0YUg0L7QsdGK0LXQutGC0L7QslxuICAgICAqINC/0YDQuNC+0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdGC0YHRjyAtINGE0L7RgNC80LjRgNC+0LLQsNC90LjQtSDQs9GA0YPQv9C/INC/0L7Qu9C40LPQvtC90L7QsiDQt9Cw0LLQtdGA0YjQsNC10YLRgdGPINCy0L7Qt9Cy0YDQsNGC0L7QvCDQt9C90LDRh9C10L3QuNGPIG51bGwgKNGB0LjQvNGD0LvRj9GG0LjRjyDQtNC+0YHRgtC40LbQtdC90LjRj1xuICAgICAqINC/0L7RgdC70LXQtNC90LXQs9C+INC+0LHRgNCw0LHQsNGC0YvQstCw0LXQvNC+0LPQviDQuNGB0YXQvtC00L3QvtCz0L4g0L7QsdGK0LXQutGC0LApLlxuICAgICAqL1xuICAgIGlmICh0aGlzLm9iamVjdENvdW50ZXIgPj0gdGhpcy5nbG9iYWxMaW1pdCkgcmV0dXJuIG51bGxcblxuICAgIC8vINCY0YLQtdGA0LjRgNC+0LLQsNC90LjQtSDQuNGB0YXQvtC00L3Ri9GFINC+0LHRitC10LrRgtC+0LIuXG4gICAgd2hpbGUgKHBvbHlnb24gPSB0aGlzLml0ZXJhdG9yISgpKSB7XG5cbiAgICAgIC8vINCU0L7QsdCw0LLQu9C10L3QuNC1INCyINCz0YDRg9C/0L/RgyDQv9C+0LvQuNCz0L7QvdC+0LIg0LLQtdGA0YjQuNC9INC90L7QstC+0LPQviDQv9C+0LvQuNCz0L7QvdCwINC4INC/0L7QtNGB0YfQtdGCINC+0LHRidC10LPQviDQutC+0LvQuNGH0LXRgdGC0LLQsCDQstC10YDRiNC40L0g0LIg0LPRgNGD0L/Qv9C1LlxuICAgICAgcG9seWdvbkdyb3VwLnZlcnRpY2VzLnB1c2gocG9seWdvbi54LCBwb2x5Z29uLnkpXG4gICAgICBwb2x5Z29uR3JvdXAuYW1vdW50T2ZWZXJ0aWNlcysrXG5cbiAgICAgIHBvbHlnb25Hcm91cC5zaGFwZXMucHVzaChwb2x5Z29uLnNoYXBlKVxuICAgICAgcG9seWdvbkdyb3VwLnNpemVzLnB1c2gocG9seWdvbi5zaXplKVxuICAgICAgcG9seWdvbkdyb3VwLmNvbG9ycy5wdXNoKHBvbHlnb24uY29sb3IpXG5cbiAgICAgIC8vINCh0YfQtdGC0YfQuNC6INGH0LjRgdC70LAg0L/RgNC40LzQtdC90LXQvdC40Lkg0LrQsNC20LTQvtC5INC40Lcg0YTQvtGA0Lwg0L/QvtC70LjQs9C+0L3QvtCyLlxuICAgICAvLyB0aGlzLnN0YXRzLnNoYXBlc1tpXSsrXG5cbiAgICAgIC8vINCh0YfQtdGC0YfQuNC6INC+0LHRidC10LPQviDQutC+0LvQuNGH0LXRgdGC0LLQviDQv9C+0LvQuNCz0L7QvdC+0LIuXG4gICAgICB0aGlzLm9iamVjdENvdW50ZXIrK1xuXG4gICAgICAvKipcbiAgICAgICAqINCV0YHQu9C4INC60L7Qu9C40YfQtdGB0YLQstC+INC/0L7Qu9C40LPQvtC90L7QsiDQutCw0L3QstCw0YHQsCDQtNC+0YHRgtC40LPQu9C+INC00L7Qv9GD0YHRgtC40LzQvtCz0L4g0LzQsNC60YHQuNC80YPQvNCwLCDRgtC+INC00LDQu9GM0L3QtdC50YjQsNGPINC+0LHRgNCw0LHQvtGC0LrQsCDQuNGB0YXQvtC00L3Ri9GFINC+0LHRitC10LrRgtC+0LJcbiAgICAgICAqINC/0YDQuNC+0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdGC0YHRjyAtINGE0L7RgNC80LjRgNC+0LLQsNC90LjQtSDQs9GA0YPQv9C/INC/0L7Qu9C40LPQvtC90L7QsiDQt9Cw0LLQtdGA0YjQsNC10YLRgdGPINCy0L7Qt9Cy0YDQsNGC0L7QvCDQt9C90LDRh9C10L3QuNGPIG51bGwgKNGB0LjQvNGD0LvRj9GG0LjRjyDQtNC+0YHRgtC40LbQtdC90LjRj1xuICAgICAgICog0L/QvtGB0LvQtdC00L3QtdCz0L4g0L7QsdGA0LDQsdCw0YLRi9Cy0LDQtdC80L7Qs9C+INC40YHRhdC+0LTQvdC+0LPQviDQvtCx0YrQtdC60YLQsCkuXG4gICAgICAgKi9cbiAgICAgIGlmICh0aGlzLm9iamVjdENvdW50ZXIgPj0gdGhpcy5nbG9iYWxMaW1pdCkgYnJlYWtcblxuICAgICAgLyoqXG4gICAgICAgKiDQldGB0LvQuCDQvtCx0YnQtdC1INC60L7Qu9C40YfQtdGB0YLQstC+INCy0YHQtdGFINCy0LXRgNGI0LjQvSDQsiDQs9GA0YPQv9C/0LUg0L/QvtC70LjQs9C+0L3QvtCyINC/0YDQtdCy0YvRgdC40LvQviDRgtC10YXQvdC40YfQtdGB0LrQvtC1INC+0LPRgNCw0L3QuNGH0LXQvdC40LUsINGC0L4g0LPRgNGD0L/Qv9CwINC/0L7Qu9C40LPQvtC90L7QslxuICAgICAgICog0YHRh9C40YLQsNC10YLRgdGPINGB0YTQvtGA0LzQuNGA0L7QstCw0L3QvdC+0Lkg0Lgg0LjRgtC10YDQuNGA0L7QstCw0L3QuNC1INC40YHRhdC+0LTQvdGL0YUg0L7QsdGK0LXQutGC0L7QsiDQv9GA0LjQvtGB0YLQsNC90LDQstC70LjQstCw0LXRgtGB0Y8uXG4gICAgICAgKi9cbiAgICAgIGlmIChwb2x5Z29uR3JvdXAuYW1vdW50T2ZWZXJ0aWNlcyA+PSB0aGlzLmdyb3VwTGltaXQpIGJyZWFrXG4gICAgfVxuXG4gICAgLy8g0KHRh9C10YLRh9C40Log0L7QsdGJ0LXQs9C+INC60L7Qu9C40YfQtdGB0YLQstCwINCy0LXRgNGI0LjQvSDQstGB0LXRhSDQstC10YDRiNC40L3QvdGL0YUg0LHRg9GE0LXRgNC+0LIuXG4gICAgdGhpcy5zdGF0cy5vYmplY3RzQ291bnRUb3RhbCArPSBwb2x5Z29uR3JvdXAuYW1vdW50T2ZWZXJ0aWNlc1xuXG4gICAgLy8g0JXRgdC70Lgg0LPRgNGD0L/Qv9CwINC/0L7Qu9C40LPQvtC90L7QsiDQvdC10L/Rg9GB0YLQsNGPLCDRgtC+INCy0L7Qt9Cy0YDQsNGJ0LDQtdC8INC10LUuINCV0YHQu9C4INC/0YPRgdGC0LDRjyAtINCy0L7Qt9Cy0YDQsNGJ0LDQtdC8IG51bGwuXG4gICAgcmV0dXJuIChwb2x5Z29uR3JvdXAuYW1vdW50T2ZWZXJ0aWNlcyA+IDApID8gcG9seWdvbkdyb3VwIDogbnVsbFxuICB9XG5cbiAgLyoqXG4gICAqINCh0L7Qt9C00LDQtdGCINC00L7Qv9C+0LvQvdC10L3QuNC1INC6INC60L7QtNGDINC90LAg0Y/Qt9GL0LrQtSBHTFNMLlxuICAgKlxuICAgKiBAcmVtYXJrc1xuICAgKiDQkiDQtNCw0LvRjNC90LXQudGI0LXQvCDRgdC+0LfQtNCw0L3QvdGL0Lkg0LrQvtC0INCx0YPQtNC10YIg0LLRgdGC0YDQvtC10L0g0LIg0LrQvtC0INCy0LXRgNGI0LjQvdC90L7Qs9C+INGI0LXQudC00LXRgNCwINC00LvRjyDQt9Cw0LTQsNC90LjRjyDRhtCy0LXRgtCwINCy0LXRgNGI0LjQvdGLINCyINC30LDQstC40YHQuNC80L7RgdGC0Lgg0L7RglxuICAgKiDQuNC90LTQtdC60YHQsCDRhtCy0LXRgtCwLCDQv9GA0LjRgdCy0L7QtdC90L3QvtCz0L4g0Y3RgtC+0Lkg0LLQtdGA0YjQuNC90LUuINCiLtC6LiDRiNC10LnQtNC10YAg0L3QtSDQv9C+0LfQstC+0LvRj9C10YIg0LjRgdC/0L7Qu9GM0LfQvtCy0LDRgtGMINCyINC60LDRh9C10YHRgtCy0LUg0LjQvdC00LXQutGB0L7QsiDQv9C10YDQtdC80LXQvdC90YvQtSAtXG4gICAqINC00LvRjyDQt9Cw0LTQsNC90LjRjyDRhtCy0LXRgtCwINC40YHQv9C+0LvRjNC30YPQtdGC0YHRjyDQv9C10YDQtdCx0L7RgCDRhtCy0LXRgtC+0LLRi9GFINC40L3QtNC10LrRgdC+0LIuXG4gICAqXG4gICAqIEByZXR1cm5zINCa0L7QtCDQvdCwINGP0LfRi9C60LUgR0xTTC5cbiAgICovXG4gIHByb3RlY3RlZCBnZW5TaGFkZXJDb2xvckNvZGUoKTogc3RyaW5nIHtcblxuICAgIC8vINCS0YDQtdC80LXQvdC90L7QtSDQtNC+0LHQsNCy0LvQtdC90LjQtSDQsiDQv9Cw0LvQuNGC0YDRgyDRhtCy0LXRgtC+0LIg0LLQtdGA0YjQuNC9INGG0LLQtdGC0LAg0L3QsNC/0YDQsNCy0LvRj9GO0YnQuNGFLlxuICAgIHRoaXMuY29sb3JzLnB1c2godGhpcy5ncmlkLnJ1bGVzQ29sb3IhKVxuXG4gICAgbGV0IGNvZGU6IHN0cmluZyA9ICcnXG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY29sb3JzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgIC8vINCf0L7Qu9GD0YfQtdC90LjQtSDRhtCy0LXRgtCwINCyINC90YPQttC90L7QvCDRhNC+0YDQvNCw0YLQtS5cbiAgICAgIGxldCBbciwgZywgYl0gPSBjb2xvckZyb21IZXhUb0dsUmdiKHRoaXMuY29sb3JzW2ldKVxuXG4gICAgICAvLyDQpNC+0YDQvNC40YDQvtCy0L3QuNC1INGB0YLRgNC+0LogR0xTTC3QutC+0LTQsCDQv9GA0L7QstC10YDQutC4INC40L3QtNC10LrRgdCwINGG0LLQtdGC0LAuXG4gICAgICBjb2RlICs9ICgoaSA9PT0gMCkgPyAnJyA6ICcgIGVsc2UgJykgKyAnaWYgKGFfY29sb3IgPT0gJyArIGkgKyAnLjApIHZfY29sb3IgPSB2ZWMzKCcgK1xuICAgICAgICByLnRvU3RyaW5nKCkuc2xpY2UoMCwgOSkgKyAnLCcgK1xuICAgICAgICBnLnRvU3RyaW5nKCkuc2xpY2UoMCwgOSkgKyAnLCcgK1xuICAgICAgICBiLnRvU3RyaW5nKCkuc2xpY2UoMCwgOSkgKyAnKTtcXG4nXG4gICAgfVxuXG4gICAgLy8g0KPQtNCw0LvQtdC90LjQtSDQuNC3INC/0LDQu9C40YLRgNGLINCy0LXRgNGI0LjQvSDQstGA0LXQvNC10L3QvdC+INC00L7QsdCw0LLQu9C10L3QvdC+0LPQviDRhtCy0LXRgtCwINC90LDQv9GA0LDQstC70Y/RjtGJ0LjRhS5cbiAgICB0aGlzLmNvbG9ycy5wb3AoKVxuXG4gICAgcmV0dXJuIGNvZGVcbiAgfVxuXG4gIC8qKlxuICAgKiDQn9GA0L7QuNC30LLQvtC00LjRgiDRgNC10L3QtNC10YDQuNC90LMg0LPRgNCw0YTQuNC60LAg0LIg0YHQvtC+0YLQstC10YLRgdGC0LLQuNC4INGBINGC0LXQutGD0YnQuNC80Lgg0L/QsNGA0LDQvNC10YLRgNCw0LzQuCDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuC5cbiAgICovXG4gIHB1YmxpYyByZW5kZXIoKTogdm9pZCB7XG5cbiAgICAvLyDQntGH0LjRgdGC0LrQsCDQvtCx0YrQtdC60YLQsCDRgNC10L3QtNC10YDQuNC90LPQsCBXZWJHTC5cbiAgICB0aGlzLndlYmdsLmNsZWFyQmFja2dyb3VuZCgpXG5cbiAgICAvLyDQntCx0L3QvtCy0LvQtdC90LjQtSDQvNCw0YLRgNC40YbRiyDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuC5cbiAgICB0aGlzLmNvbnRyb2wudXBkYXRlVmlld1Byb2plY3Rpb24oKVxuXG4gICAgLy8g0J/RgNC40LLRj9C30LrQsCDQvNCw0YLRgNC40YbRiyDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuCDQuiDQv9C10YDQtdC80LXQvdC90L7QuSDRiNC10LnQtNC10YDQsC5cbiAgICB0aGlzLndlYmdsLnNldFZhcmlhYmxlKCd1X21hdHJpeCcsIHRoaXMuY29udHJvbC50cmFuc2Zvcm0udmlld1Byb2plY3Rpb25NYXQpXG5cbiAgICAvLyDQmNGC0LXRgNC40YDQvtCy0LDQvdC40LUg0Lgg0YDQtdC90LTQtdGA0LjQvdCzINCz0YDRg9C/0L8g0LHRg9GE0LXRgNC+0LIgV2ViR0wuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnN0YXRzLmdyb3Vwc0NvdW50OyBpKyspIHtcblxuICAgICAgdGhpcy53ZWJnbC5zZXRCdWZmZXIoJ3ZlcnRpY2VzJywgaSwgJ2FfcG9zaXRpb24nLCAyLCAwLCAwKVxuICAgICAgdGhpcy53ZWJnbC5zZXRCdWZmZXIoJ2NvbG9ycycsIGksICdhX2NvbG9yJywgMSwgMCwgMClcbiAgICAgIHRoaXMud2ViZ2wuc2V0QnVmZmVyKCdzaXplcycsIGksICdhX3NpemUnLCAxLCAwLCAwKVxuICAgICAgdGhpcy53ZWJnbC5zZXRCdWZmZXIoJ3NoYXBlcycsIGksICdhX3NoYXBlJywgMSwgMCwgMClcblxuICAgICAgdGhpcy53ZWJnbC5kcmF3UG9pbnRzKDAsIHRoaXMuc3RhdHMub2JqZWN0c0NvdW50SW5Hcm91cHNbaV0pXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqINCX0LDQv9GD0YHQutCw0LXRgiDRgNC10L3QtNC10YDQuNC90LMg0Lgg0LrQvtC90YLRgNC+0LvRjCDRg9C/0YDQsNCy0LvQtdC90LjRjy5cbiAgICovXG4gIHB1YmxpYyBydW4oKTogdm9pZCB7XG5cbiAgICBpZiAodGhpcy5pc1J1bm5pbmcpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHRoaXMucmVuZGVyKClcbiAgICB0aGlzLmNvbnRyb2wucnVuKClcbiAgICB0aGlzLmlzUnVubmluZyA9IHRydWVcblxuICAgIGlmICh0aGlzLmRlYnVnLmlzRW5hYmxlKSB7XG4gICAgICB0aGlzLmRlYnVnLmxvZ1JlbmRlclN0YXJ0ZWQoKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDQntGB0YLQsNC90LDQstC70LjQstCw0LXRgiDRgNC10L3QtNC10YDQuNC90LMg0Lgg0LrQvtC90YLRgNC+0LvRjCDRg9C/0YDQsNCy0LvQtdC90LjRjy5cbiAgICovXG4gIHB1YmxpYyBzdG9wKCk6IHZvaWQge1xuXG4gICAgaWYgKCF0aGlzLmlzUnVubmluZykge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgdGhpcy5jb250cm9sLnN0b3AoKVxuICAgIHRoaXMuaXNSdW5uaW5nID0gZmFsc2VcblxuICAgIGlmICh0aGlzLmRlYnVnLmlzRW5hYmxlKSB7XG4gICAgICB0aGlzLmRlYnVnLmxvZ1JlbmRlclN0b3BlZCgpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqINCe0YfQuNGJ0LDQtdGCINGE0L7QvS5cbiAgICovXG4gIHB1YmxpYyBjbGVhcigpOiB2b2lkIHtcblxuICAgIHRoaXMud2ViZ2wuY2xlYXJCYWNrZ3JvdW5kKClcblxuICAgIGlmICh0aGlzLmRlYnVnLmlzRW5hYmxlKSB7XG4gICAgICB0aGlzLmRlYnVnLmxvZ0NhbnZhc0NsZWFyZWQodGhpcy5ncmlkLmJnQ29sb3IhKVxuICAgIH1cbiAgfVxufVxuIiwiXG4vKipcbiAqINCf0YDQvtCy0LXRgNGP0LXRgiDRj9Cy0LvRj9C10YLRgdGPINC70Lgg0L/QtdGA0LXQvNC10L3QvdCw0Y8g0Y3QutC30LXQvNC/0LvRj9GA0L7QvCDQutCw0LrQvtCz0L4t0LvQuNCx0L7QviDQutC70LDRgdGB0LAuXG4gKlxuICogQHBhcmFtIHZhbCAtINCf0YDQvtCy0LXRgNGP0LXQvNCw0Y8g0L/QtdGA0LXQvNC10L3QvdCw0Y8uXG4gKiBAcmV0dXJucyDQoNC10LfRg9C70YzRgtCw0YIg0L/RgNC+0LLQtdGA0LrQuC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzT2JqZWN0KG9iajogYW55KTogYm9vbGVhbiB7XG4gIHJldHVybiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IE9iamVjdF0nKVxufVxuXG4vKipcbiAqINCf0LXRgNC10L7Qv9GA0LXQtNC10LvRj9C10YIg0LfQvdCw0YfQtdC90LjRjyDQv9C+0LvQtdC5INC+0LHRitC10LrRgtCwIHRhcmdldCDQvdCwINC30L3QsNGH0LXQvdC40Y8g0L/QvtC70LXQuSDQvtCx0YrQtdC60YLQsCBzb3VyY2UuINCf0LXRgNC10L7Qv9GA0LXQtNC10LvRj9GO0YLRgdGPINGC0L7Qu9GM0LrQviDRgtC1INC/0L7Qu9GPLFxuICog0LrQvtGC0L7RgNGL0LUg0YHRg9GJ0LXRgdGC0LLRg9C10Y7RgiDQsiB0YXJnZXQuINCV0YHQu9C4INCyIHNvdXJjZSDQtdGB0YLRjCDQv9C+0LvRjywg0LrQvtGC0L7RgNGL0YUg0L3QtdGCINCyIHRhcmdldCwg0YLQviDQvtC90Lgg0LjQs9C90L7RgNC40YDRg9GO0YLRgdGPLiDQldGB0LvQuCDQutCw0LrQuNC1LdGC0L4g0L/QvtC70Y9cbiAqINGB0LDQvNC4INGP0LLQu9GP0Y7RgtGB0Y8g0Y/QstC70Y/RjtGC0YHRjyDQvtCx0YrQtdC60YLQsNC80LgsINGC0L4g0YLQviDQvtC90Lgg0YLQsNC60LbQtSDRgNC10LrRg9GA0YHQuNCy0L3QviDQutC+0L/QuNGA0YPRjtGC0YHRjyAo0L/RgNC4INGC0L7QvCDQttC1INGD0YHQu9C+0LLQuNC4LCDRh9GC0L4g0LIg0YbQtdC70LXQvtC8INC+0LHRitC10LrRgtC1XG4gKiDRgdGD0YnQtdGB0YLQstGD0Y7RgiDQv9C+0LvRjyDQvtCx0YrQtdC60YLQsC3QuNGB0YLQvtGH0L3QuNC60LApLlxuICpcbiAqIEBwYXJhbSB0YXJnZXQgLSDQptC10LvQtdCy0L7QuSAo0LjQt9C80LXQvdGP0LXQvNGL0LkpINC+0LHRitC10LrRgi5cbiAqIEBwYXJhbSBzb3VyY2UgLSDQntCx0YrQtdC60YIg0YEg0LTQsNC90L3Ri9C80LgsINC60L7RgtC+0YDRi9C1INC90YPQttC90L4g0YPRgdGC0LDQvdC+0LLQuNGC0Ywg0YMg0YbQtdC70LXQstC+0LPQviDQvtCx0YrQtdC60YLQsC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvcHlNYXRjaGluZ0tleVZhbHVlcyh0YXJnZXQ6IGFueSwgc291cmNlOiBhbnkpOiB2b2lkIHtcbiAgT2JqZWN0LmtleXMoc291cmNlKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgaWYgKGtleSBpbiB0YXJnZXQpIHtcbiAgICAgIGlmIChpc09iamVjdChzb3VyY2Vba2V5XSkpIHtcbiAgICAgICAgaWYgKGlzT2JqZWN0KHRhcmdldFtrZXldKSkge1xuICAgICAgICAgIGNvcHlNYXRjaGluZ0tleVZhbHVlcyh0YXJnZXRba2V5XSwgc291cmNlW2tleV0pXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghaXNPYmplY3QodGFyZ2V0W2tleV0pICYmICh0eXBlb2YgdGFyZ2V0W2tleV0gIT09ICdmdW5jdGlvbicpKSB7XG4gICAgICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KVxufVxuXG4vKipcbiAqINCS0L7Qt9Cy0YDQsNGJ0LDQtdGCINGB0LvRg9GH0LDQudC90L7QtSDRhtC10LvQvtC1INGH0LjRgdC70L4g0LIg0LTQuNCw0L/QsNC30L7QvdC1OiBbMC4uLnJhbmdlLTFdLlxuICpcbiAqIEBwYXJhbSByYW5nZSAtINCS0LXRgNGF0L3QuNC5INC/0YDQtdC00LXQuyDQtNC40LDQv9Cw0LfQvtC90LAg0YHQu9GD0YfQsNC50L3QvtCz0L4g0LLRi9Cx0L7RgNCwLlxuICogQHJldHVybnMg0KHQu9GD0YfQsNC50L3QvtC1INGH0LjRgdC70L4uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByYW5kb21JbnQocmFuZ2U6IG51bWJlcik6IG51bWJlciB7XG4gIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiByYW5nZSlcbn1cblxuLyoqXG4gKiDQn9GA0LXQvtCx0YDQsNC30YPQtdGCINC+0LHRitC10LrRgiDQsiDRgdGC0YDQvtC60YMgSlNPTi4g0JjQvNC10LXRgiDQvtGC0LvQuNGH0LjQtSDQvtGCINGB0YLQsNC90LTQsNGA0YLQvdC+0Lkg0YTRg9C90LrRhtC40LggSlNPTi5zdHJpbmdpZnkgLSDQv9C+0LvRjyDQvtCx0YrQtdC60YLQsCwg0LjQvNC10Y7RidC40LVcbiAqINC30L3QsNGH0LXQvdC40Y8g0YTRg9C90LrRhtC40Lkg0L3QtSDQv9GA0L7Qv9GD0YHQutCw0Y7RgtGB0Y8sINCwINC/0YDQtdC+0LHRgNCw0LfRg9GO0YLRgdGPINCyINC90LDQt9Cy0LDQvdC40LUg0YTRg9C90LrRhtC40LguXG4gKlxuICogQHBhcmFtIG9iaiAtINCm0LXQu9C10LLQvtC5INC+0LHRitC10LrRgi5cbiAqIEByZXR1cm5zINCh0YLRgNC+0LrQsCBKU09OLCDQvtGC0L7QsdGA0LDQttCw0Y7RidCw0Y8g0L7QsdGK0LXQutGCLlxuICovXG5leHBvcnQgZnVuY3Rpb24ganNvblN0cmluZ2lmeShvYmo6IGFueSk6IHN0cmluZyB7XG4gIHJldHVybiBKU09OLnN0cmluZ2lmeShcbiAgICBvYmosXG4gICAgZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICAgIHJldHVybiAodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKSA/IHZhbHVlLm5hbWUgOiB2YWx1ZVxuICAgIH0sXG4gICAgJyAnXG4gIClcbn1cblxuLyoqXG4gKiDQodC70YPRh9Cw0LnQvdGL0Lwg0L7QsdGA0LDQt9C+0Lwg0LLQvtC30LLRgNCw0YnQsNC10YIg0L7QtNC40L0g0LjQtyDQuNC90LTQtdC60YHQvtCyINGH0LjRgdC70L7QstC+0LPQviDQvtC00L3QvtC80LXRgNC90L7Qs9C+INC80LDRgdGB0LjQstCwLiDQndC10YHQvNC+0YLRgNGPINC90LAg0YHQu9GD0YfQsNC50L3QvtGB0YLRjCDQutCw0LbQtNC+0LPQvlxuICog0LrQvtC90LrRgNC10YLQvdC+0LPQviDQstGL0LfQvtCy0LAg0YTRg9C90LrRhtC40LgsINC40L3QtNC10LrRgdGLINCy0L7Qt9Cy0YDQsNGJ0LDRjtGC0YHRjyDRgSDQv9GA0LXQtNC+0L/RgNC10LTQtdC70LXQvdC90L7QuSDRh9Cw0YHRgtC+0YLQvtC5LiDQp9Cw0YHRgtC+0YLQsCBcItCy0YvQv9Cw0LTQsNC90LjQuVwiINC40L3QtNC10LrRgdC+0LIg0LfQsNC00LDQtdGC0YHRj1xuICog0YHQvtC+0YLQstC10YLRgdGC0LLRg9GO0YnQuNC80Lgg0LfQvdCw0YfQtdC90LjRj9C80Lgg0Y3Qu9C10LzQtdC90YLQvtCyLlxuICpcbiAqIEByZW1hcmtzXG4gKiDQn9GA0LjQvNC10YA6INCd0LAg0LzQsNGB0YHQuNCy0LUgWzMsIDIsIDVdINGE0YPQvdC60YbQuNGPINCx0YPQtNC10YIg0LLQvtC30LLRgNCw0YnQsNGC0Ywg0LjQvdC00LXQutGBIDAg0YEg0YfQsNGB0YLQvtGC0L7QuSA9IDMvKDMrMis1KSA9IDMvMTAsINC40L3QtNC10LrRgSAxINGBINGH0LDRgdGC0L7RgtC+0LkgPVxuICogMi8oMysyKzUpID0gMi8xMCwg0LjQvdC00LXQutGBIDIg0YEg0YfQsNGB0YLQvtGC0L7QuSA9IDUvKDMrMis1KSA9IDUvMTAuXG4gKlxuICogQHBhcmFtIGFyciAtINCn0LjRgdC70L7QstC+0Lkg0L7QtNC90L7QvNC10YDQvdGL0Lkg0LzQsNGB0YHQuNCyLCDQuNC90LTQtdC60YHRiyDQutC+0YLQvtGA0L7Qs9C+INCx0YPQtNGD0YIg0LLQvtC30LLRgNCw0YnQsNGC0YzRgdGPINGBINC/0YDQtdC00L7Qv9GA0LXQtNC10LvQtdC90L3QvtC5INGH0LDRgdGC0L7RgtC+0LkuXG4gKiBAcmV0dXJucyDQodC70YPRh9Cw0LnQvdGL0Lkg0LjQvdC00LXQutGBINC40Lcg0LzQsNGB0YHQuNCy0LAgYXJyLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcmFuZG9tUXVvdGFJbmRleChhcnI6IG51bWJlcltdKTogbnVtYmVyIHtcblxuICBsZXQgYTogbnVtYmVyW10gPSBbXVxuICBhWzBdID0gYXJyWzBdXG5cbiAgZm9yIChsZXQgaSA9IDE7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcbiAgICBhW2ldID0gYVtpIC0gMV0gKyBhcnJbaV1cbiAgfVxuXG4gIGNvbnN0IGxhc3RJbmRleDogbnVtYmVyID0gYS5sZW5ndGggLSAxXG5cbiAgbGV0IHI6IG51bWJlciA9IE1hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkgKiBhW2xhc3RJbmRleF0pKSArIDFcbiAgbGV0IGw6IG51bWJlciA9IDBcbiAgbGV0IGg6IG51bWJlciA9IGxhc3RJbmRleFxuXG4gIHdoaWxlIChsIDwgaCkge1xuICAgIGNvbnN0IG06IG51bWJlciA9IGwgKyAoKGggLSBsKSA+PiAxKTtcbiAgICAociA+IGFbbV0pID8gKGwgPSBtICsgMSkgOiAoaCA9IG0pXG4gIH1cblxuICByZXR1cm4gKGFbbF0gPj0gcikgPyBsIDogLTFcbn1cblxuXG4vKipcbiAqINCa0L7QvdCy0LXRgNGC0LjRgNGD0LXRgiDRhtCy0LXRgiDQuNC3IEhFWC3Qv9GA0LXQtNGB0YLQsNCy0LvQtdC90LjRjyDQsiDQv9GA0LXQtNGB0YLQsNCy0LvQtdC90LjQtSDRhtCy0LXRgtCwINC00LvRjyBHTFNMLdC60L7QtNCwIChSR0Ig0YEg0LTQuNCw0L/QsNC30L7QvdCw0LzQuCDQt9C90LDRh9C10L3QuNC5INC+0YIgMCDQtNC+IDEpLlxuICpcbiAqIEBwYXJhbSBoZXhDb2xvciAtINCm0LLQtdGCINCyIEhFWC3RhNC+0YDQvNCw0YLQtS5cbiAqIEByZXR1cm5zINCc0LDRgdGB0LjQsiDQuNC3INGC0YDQtdGFINGH0LjRgdC10Lsg0LIg0LTQuNCw0L/QsNC30L7QvdC1INC+0YIgMCDQtNC+IDEuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb2xvckZyb21IZXhUb0dsUmdiKGhleENvbG9yOiBzdHJpbmcpOiBudW1iZXJbXSB7XG5cbiAgbGV0IGsgPSAvXiM/KFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pJC9pLmV4ZWMoaGV4Q29sb3IpXG4gIGxldCBbciwgZywgYl0gPSBbcGFyc2VJbnQoayFbMV0sIDE2KSAvIDI1NSwgcGFyc2VJbnQoayFbMl0sIDE2KSAvIDI1NSwgcGFyc2VJbnQoayFbM10sIDE2KSAvIDI1NV1cblxuICByZXR1cm4gW3IsIGcsIGJdXG59XG5cbi8qKlxuICog0JLRi9GH0LjRgdC70Y/QtdGCINGC0LXQutGD0YnQtdC1INCy0YDQtdC80Y8uXG4gKlxuICogQHJldHVybnMg0KHRgtGA0L7QutC+0LLQsNGPINGE0L7RgNC80LDRgtC40YDQvtCy0LDQvdC90LDRjyDQt9Cw0L/QuNGB0Ywg0YLQtdC60YPRidC10LPQviDQstGA0LXQvNC10L3QuC4g0KTQvtGA0LzQsNGCOiBoaDptbTpzc1xuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q3VycmVudFRpbWUoKTogc3RyaW5nIHtcblxuICBsZXQgdG9kYXkgPSBuZXcgRGF0ZSgpO1xuXG4gIGxldCB0aW1lID1cbiAgICAoKHRvZGF5LmdldEhvdXJzKCkgPCAxMCA/ICcwJyA6ICcnKSArIHRvZGF5LmdldEhvdXJzKCkpICsgXCI6XCIgK1xuICAgICgodG9kYXkuZ2V0TWludXRlcygpIDwgMTAgPyAnMCcgOiAnJykgKyB0b2RheS5nZXRNaW51dGVzKCkpICsgXCI6XCIgK1xuICAgICgodG9kYXkuZ2V0U2Vjb25kcygpIDwgMTAgPyAnMCcgOiAnJykgKyB0b2RheS5nZXRTZWNvbmRzKCkpXG5cbiAgcmV0dXJuIHRpbWVcbn1cbiIsIi8qXG4gKiBDb3B5cmlnaHQgMjAyMSBHRlhGdW5kYW1lbnRhbHMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFJlZGlzdHJpYnV0aW9uIGFuZCB1c2UgaW4gc291cmNlIGFuZCBiaW5hcnkgZm9ybXMsIHdpdGggb3Igd2l0aG91dFxuICogbW9kaWZpY2F0aW9uLCBhcmUgcGVybWl0dGVkIHByb3ZpZGVkIHRoYXQgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zIGFyZVxuICogbWV0OlxuICpcbiAqICAgICAqIFJlZGlzdHJpYnV0aW9ucyBvZiBzb3VyY2UgY29kZSBtdXN0IHJldGFpbiB0aGUgYWJvdmUgY29weXJpZ2h0XG4gKiBub3RpY2UsIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIuXG4gKiAgICAgKiBSZWRpc3RyaWJ1dGlvbnMgaW4gYmluYXJ5IGZvcm0gbXVzdCByZXByb2R1Y2UgdGhlIGFib3ZlXG4gKiBjb3B5cmlnaHQgbm90aWNlLCB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyXG4gKiBpbiB0aGUgZG9jdW1lbnRhdGlvbiBhbmQvb3Igb3RoZXIgbWF0ZXJpYWxzIHByb3ZpZGVkIHdpdGggdGhlXG4gKiBkaXN0cmlidXRpb24uXG4gKiAgICAgKiBOZWl0aGVyIHRoZSBuYW1lIG9mIEdGWEZ1bmRhbWVudGFscy4gbm9yIHRoZSBuYW1lcyBvZiBoaXNcbiAqIGNvbnRyaWJ1dG9ycyBtYXkgYmUgdXNlZCB0byBlbmRvcnNlIG9yIHByb21vdGUgcHJvZHVjdHMgZGVyaXZlZCBmcm9tXG4gKiB0aGlzIHNvZnR3YXJlIHdpdGhvdXQgc3BlY2lmaWMgcHJpb3Igd3JpdHRlbiBwZXJtaXNzaW9uLlxuICpcbiAqIFRISVMgU09GVFdBUkUgSVMgUFJPVklERUQgQlkgVEhFIENPUFlSSUdIVCBIT0xERVJTIEFORCBDT05UUklCVVRPUlNcbiAqIFwiQVMgSVNcIiBBTkQgQU5ZIEVYUFJFU1MgT1IgSU1QTElFRCBXQVJSQU5USUVTLCBJTkNMVURJTkcsIEJVVCBOT1RcbiAqIExJTUlURUQgVE8sIFRIRSBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZIEFORCBGSVRORVNTIEZPUlxuICogQSBQQVJUSUNVTEFSIFBVUlBPU0UgQVJFIERJU0NMQUlNRUQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBDT1BZUklHSFRcbiAqIE9XTkVSIE9SIENPTlRSSUJVVE9SUyBCRSBMSUFCTEUgRk9SIEFOWSBESVJFQ1QsIElORElSRUNULCBJTkNJREVOVEFMLFxuICogU1BFQ0lBTCwgRVhFTVBMQVJZLCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVMgKElOQ0xVRElORywgQlVUIE5PVFxuICogTElNSVRFRCBUTywgUFJPQ1VSRU1FTlQgT0YgU1VCU1RJVFVURSBHT09EUyBPUiBTRVJWSUNFUzsgTE9TUyBPRiBVU0UsXG4gKiBEQVRBLCBPUiBQUk9GSVRTOyBPUiBCVVNJTkVTUyBJTlRFUlJVUFRJT04pIEhPV0VWRVIgQ0FVU0VEIEFORCBPTiBBTllcbiAqIFRIRU9SWSBPRiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQ09OVFJBQ1QsIFNUUklDVCBMSUFCSUxJVFksIE9SIFRPUlRcbiAqIChJTkNMVURJTkcgTkVHTElHRU5DRSBPUiBPVEhFUldJU0UpIEFSSVNJTkcgSU4gQU5ZIFdBWSBPVVQgT0YgVEhFIFVTRVxuICogT0YgVEhJUyBTT0ZUV0FSRSwgRVZFTiBJRiBBRFZJU0VEIE9GIFRIRSBQT1NTSUJJTElUWSBPRiBTVUNIIERBTUFHRS5cbiAqL1xuXG4vKipcbiAqIFZhcmlvdXMgMmQgbWF0aCBmdW5jdGlvbnMuXG4gKlxuICogQG1vZHVsZSB3ZWJnbC0yZC1tYXRoXG4gKi9cbihmdW5jdGlvbihyb290LCBmYWN0b3J5KSB7ICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAvLyBBTUQuIFJlZ2lzdGVyIGFzIGFuIGFub255bW91cyBtb2R1bGUuXG4gICAgZGVmaW5lKFtdLCBmYWN0b3J5KTtcbiAgfSBlbHNlIHtcbiAgICAvLyBCcm93c2VyIGdsb2JhbHNcbiAgICByb290Lm0zID0gZmFjdG9yeSgpO1xuICB9XG59KHRoaXMsIGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICAvKipcbiAgICogQW4gYXJyYXkgb3IgdHlwZWQgYXJyYXkgd2l0aCA5IHZhbHVlcy5cbiAgICogQHR5cGVkZWYge251bWJlcltdfFR5cGVkQXJyYXl9IE1hdHJpeDNcbiAgICogQG1lbWJlck9mIG1vZHVsZTp3ZWJnbC0yZC1tYXRoXG4gICAqL1xuXG4gIC8qKlxuICAgKiBUYWtlcyB0d28gTWF0cml4M3MsIGEgYW5kIGIsIGFuZCBjb21wdXRlcyB0aGUgcHJvZHVjdCBpbiB0aGUgb3JkZXJcbiAgICogdGhhdCBwcmUtY29tcG9zZXMgYiB3aXRoIGEuICBJbiBvdGhlciB3b3JkcywgdGhlIG1hdHJpeCByZXR1cm5lZCB3aWxsXG4gICAqIEBwYXJhbSB7bW9kdWxlOndlYmdsLTJkLW1hdGguTWF0cml4M30gYSBBIG1hdHJpeC5cbiAgICogQHBhcmFtIHttb2R1bGU6d2ViZ2wtMmQtbWF0aC5NYXRyaXgzfSBiIEEgbWF0cml4LlxuICAgKiBAcmV0dXJuIHttb2R1bGU6d2ViZ2wtMmQtbWF0aC5NYXRyaXgzfSB0aGUgcmVzdWx0LlxuICAgKiBAbWVtYmVyT2YgbW9kdWxlOndlYmdsLTJkLW1hdGhcbiAgICovXG4gIGZ1bmN0aW9uIG11bHRpcGx5KGEsIGIpIHtcbiAgICB2YXIgYTAwID0gYVswICogMyArIDBdO1xuICAgIHZhciBhMDEgPSBhWzAgKiAzICsgMV07XG4gICAgdmFyIGEwMiA9IGFbMCAqIDMgKyAyXTtcbiAgICB2YXIgYTEwID0gYVsxICogMyArIDBdO1xuICAgIHZhciBhMTEgPSBhWzEgKiAzICsgMV07XG4gICAgdmFyIGExMiA9IGFbMSAqIDMgKyAyXTtcbiAgICB2YXIgYTIwID0gYVsyICogMyArIDBdO1xuICAgIHZhciBhMjEgPSBhWzIgKiAzICsgMV07XG4gICAgdmFyIGEyMiA9IGFbMiAqIDMgKyAyXTtcbiAgICB2YXIgYjAwID0gYlswICogMyArIDBdO1xuICAgIHZhciBiMDEgPSBiWzAgKiAzICsgMV07XG4gICAgdmFyIGIwMiA9IGJbMCAqIDMgKyAyXTtcbiAgICB2YXIgYjEwID0gYlsxICogMyArIDBdO1xuICAgIHZhciBiMTEgPSBiWzEgKiAzICsgMV07XG4gICAgdmFyIGIxMiA9IGJbMSAqIDMgKyAyXTtcbiAgICB2YXIgYjIwID0gYlsyICogMyArIDBdO1xuICAgIHZhciBiMjEgPSBiWzIgKiAzICsgMV07XG4gICAgdmFyIGIyMiA9IGJbMiAqIDMgKyAyXTtcblxuICAgIHJldHVybiBbXG4gICAgICBiMDAgKiBhMDAgKyBiMDEgKiBhMTAgKyBiMDIgKiBhMjAsXG4gICAgICBiMDAgKiBhMDEgKyBiMDEgKiBhMTEgKyBiMDIgKiBhMjEsXG4gICAgICBiMDAgKiBhMDIgKyBiMDEgKiBhMTIgKyBiMDIgKiBhMjIsXG4gICAgICBiMTAgKiBhMDAgKyBiMTEgKiBhMTAgKyBiMTIgKiBhMjAsXG4gICAgICBiMTAgKiBhMDEgKyBiMTEgKiBhMTEgKyBiMTIgKiBhMjEsXG4gICAgICBiMTAgKiBhMDIgKyBiMTEgKiBhMTIgKyBiMTIgKiBhMjIsXG4gICAgICBiMjAgKiBhMDAgKyBiMjEgKiBhMTAgKyBiMjIgKiBhMjAsXG4gICAgICBiMjAgKiBhMDEgKyBiMjEgKiBhMTEgKyBiMjIgKiBhMjEsXG4gICAgICBiMjAgKiBhMDIgKyBiMjEgKiBhMTIgKyBiMjIgKiBhMjIsXG4gICAgXTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSAzeDMgaWRlbnRpdHkgbWF0cml4XG4gICAqIEByZXR1cm4ge21vZHVsZTp3ZWJnbDItMmQtbWF0aC5NYXRyaXgzfSBhbiBpZGVudGl0eSBtYXRyaXhcbiAgICovXG4gIGZ1bmN0aW9uIGlkZW50aXR5KCkge1xuICAgIHJldHVybiBbXG4gICAgICAxLCAwLCAwLFxuICAgICAgMCwgMSwgMCxcbiAgICAgIDAsIDAsIDEsXG4gICAgXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgMkQgcHJvamVjdGlvbiBtYXRyaXhcbiAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoIHdpZHRoIGluIHBpeGVsc1xuICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0IGhlaWdodCBpbiBwaXhlbHNcbiAgICogQHJldHVybiB7bW9kdWxlOndlYmdsLTJkLW1hdGguTWF0cml4M30gYSBwcm9qZWN0aW9uIG1hdHJpeCB0aGF0IGNvbnZlcnRzIGZyb20gcGl4ZWxzIHRvIGNsaXBzcGFjZSB3aXRoIFkgPSAwIGF0IHRoZSB0b3AuXG4gICAqIEBtZW1iZXJPZiBtb2R1bGU6d2ViZ2wtMmQtbWF0aFxuICAgKi9cbiAgZnVuY3Rpb24gcHJvamVjdGlvbih3aWR0aCwgaGVpZ2h0KSB7XG4gICAgLy8gTm90ZTogVGhpcyBtYXRyaXggZmxpcHMgdGhlIFkgYXhpcyBzbyAwIGlzIGF0IHRoZSB0b3AuXG4gICAgcmV0dXJuIFtcbiAgICAgIDIgLyB3aWR0aCwgMCwgMCxcbiAgICAgIDAsIC0yIC8gaGVpZ2h0LCAwLFxuICAgICAgLTEsIDEsIDEsXG4gICAgXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNdWx0aXBsaWVzIGJ5IGEgMkQgcHJvamVjdGlvbiBtYXRyaXhcbiAgICogQHBhcmFtIHttb2R1bGU6d2ViZ2wtMmQtbWF0aC5NYXRyaXgzfSB0aGUgbWF0cml4IHRvIGJlIG11bHRpcGxpZWRcbiAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoIHdpZHRoIGluIHBpeGVsc1xuICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0IGhlaWdodCBpbiBwaXhlbHNcbiAgICogQHJldHVybiB7bW9kdWxlOndlYmdsLTJkLW1hdGguTWF0cml4M30gdGhlIHJlc3VsdFxuICAgKiBAbWVtYmVyT2YgbW9kdWxlOndlYmdsLTJkLW1hdGhcbiAgICovXG4gIGZ1bmN0aW9uIHByb2plY3QobSwgd2lkdGgsIGhlaWdodCkge1xuICAgIHJldHVybiBtdWx0aXBseShtLCBwcm9qZWN0aW9uKHdpZHRoLCBoZWlnaHQpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgMkQgdHJhbnNsYXRpb24gbWF0cml4XG4gICAqIEBwYXJhbSB7bnVtYmVyfSB0eCBhbW91bnQgdG8gdHJhbnNsYXRlIGluIHhcbiAgICogQHBhcmFtIHtudW1iZXJ9IHR5IGFtb3VudCB0byB0cmFuc2xhdGUgaW4geVxuICAgKiBAcmV0dXJuIHttb2R1bGU6d2ViZ2wtMmQtbWF0aC5NYXRyaXgzfSBhIHRyYW5zbGF0aW9uIG1hdHJpeCB0aGF0IHRyYW5zbGF0ZXMgYnkgdHggYW5kIHR5LlxuICAgKiBAbWVtYmVyT2YgbW9kdWxlOndlYmdsLTJkLW1hdGhcbiAgICovXG4gIGZ1bmN0aW9uIHRyYW5zbGF0aW9uKHR4LCB0eSkge1xuICAgIHJldHVybiBbXG4gICAgICAxLCAwLCAwLFxuICAgICAgMCwgMSwgMCxcbiAgICAgIHR4LCB0eSwgMSxcbiAgICBdO1xuICB9XG5cbiAgLyoqXG4gICAqIE11bHRpcGxpZXMgYnkgYSAyRCB0cmFuc2xhdGlvbiBtYXRyaXhcbiAgICogQHBhcmFtIHttb2R1bGU6d2ViZ2wtMmQtbWF0aC5NYXRyaXgzfSB0aGUgbWF0cml4IHRvIGJlIG11bHRpcGxpZWRcbiAgICogQHBhcmFtIHtudW1iZXJ9IHR4IGFtb3VudCB0byB0cmFuc2xhdGUgaW4geFxuICAgKiBAcGFyYW0ge251bWJlcn0gdHkgYW1vdW50IHRvIHRyYW5zbGF0ZSBpbiB5XG4gICAqIEByZXR1cm4ge21vZHVsZTp3ZWJnbC0yZC1tYXRoLk1hdHJpeDN9IHRoZSByZXN1bHRcbiAgICogQG1lbWJlck9mIG1vZHVsZTp3ZWJnbC0yZC1tYXRoXG4gICAqL1xuICBmdW5jdGlvbiB0cmFuc2xhdGUobSwgdHgsIHR5KSB7XG4gICAgcmV0dXJuIG11bHRpcGx5KG0sIHRyYW5zbGF0aW9uKHR4LCB0eSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSAyRCByb3RhdGlvbiBtYXRyaXhcbiAgICogQHBhcmFtIHtudW1iZXJ9IGFuZ2xlSW5SYWRpYW5zIGFtb3VudCB0byByb3RhdGUgaW4gcmFkaWFuc1xuICAgKiBAcmV0dXJuIHttb2R1bGU6d2ViZ2wtMmQtbWF0aC5NYXRyaXgzfSBhIHJvdGF0aW9uIG1hdHJpeCB0aGF0IHJvdGF0ZXMgYnkgYW5nbGVJblJhZGlhbnNcbiAgICogQG1lbWJlck9mIG1vZHVsZTp3ZWJnbC0yZC1tYXRoXG4gICAqL1xuICBmdW5jdGlvbiByb3RhdGlvbihhbmdsZUluUmFkaWFucykge1xuICAgIHZhciBjID0gTWF0aC5jb3MoYW5nbGVJblJhZGlhbnMpO1xuICAgIHZhciBzID0gTWF0aC5zaW4oYW5nbGVJblJhZGlhbnMpO1xuICAgIHJldHVybiBbXG4gICAgICBjLCAtcywgMCxcbiAgICAgIHMsIGMsIDAsXG4gICAgICAwLCAwLCAxLFxuICAgIF07XG4gIH1cblxuICAvKipcbiAgICogTXVsdGlwbGllcyBieSBhIDJEIHJvdGF0aW9uIG1hdHJpeFxuICAgKiBAcGFyYW0ge21vZHVsZTp3ZWJnbC0yZC1tYXRoLk1hdHJpeDN9IHRoZSBtYXRyaXggdG8gYmUgbXVsdGlwbGllZFxuICAgKiBAcGFyYW0ge251bWJlcn0gYW5nbGVJblJhZGlhbnMgYW1vdW50IHRvIHJvdGF0ZSBpbiByYWRpYW5zXG4gICAqIEByZXR1cm4ge21vZHVsZTp3ZWJnbC0yZC1tYXRoLk1hdHJpeDN9IHRoZSByZXN1bHRcbiAgICogQG1lbWJlck9mIG1vZHVsZTp3ZWJnbC0yZC1tYXRoXG4gICAqL1xuICBmdW5jdGlvbiByb3RhdGUobSwgYW5nbGVJblJhZGlhbnMpIHtcbiAgICByZXR1cm4gbXVsdGlwbHkobSwgcm90YXRpb24oYW5nbGVJblJhZGlhbnMpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgMkQgc2NhbGluZyBtYXRyaXhcbiAgICogQHBhcmFtIHtudW1iZXJ9IHN4IGFtb3VudCB0byBzY2FsZSBpbiB4XG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzeSBhbW91bnQgdG8gc2NhbGUgaW4geVxuICAgKiBAcmV0dXJuIHttb2R1bGU6d2ViZ2wtMmQtbWF0aC5NYXRyaXgzfSBhIHNjYWxlIG1hdHJpeCB0aGF0IHNjYWxlcyBieSBzeCBhbmQgc3kuXG4gICAqIEBtZW1iZXJPZiBtb2R1bGU6d2ViZ2wtMmQtbWF0aFxuICAgKi9cbiAgZnVuY3Rpb24gc2NhbGluZyhzeCwgc3kpIHtcbiAgICByZXR1cm4gW1xuICAgICAgc3gsIDAsIDAsXG4gICAgICAwLCBzeSwgMCxcbiAgICAgIDAsIDAsIDEsXG4gICAgXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNdWx0aXBsaWVzIGJ5IGEgMkQgc2NhbGluZyBtYXRyaXhcbiAgICogQHBhcmFtIHttb2R1bGU6d2ViZ2wtMmQtbWF0aC5NYXRyaXgzfSB0aGUgbWF0cml4IHRvIGJlIG11bHRpcGxpZWRcbiAgICogQHBhcmFtIHtudW1iZXJ9IHN4IGFtb3VudCB0byBzY2FsZSBpbiB4XG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzeSBhbW91bnQgdG8gc2NhbGUgaW4geVxuICAgKiBAcmV0dXJuIHttb2R1bGU6d2ViZ2wtMmQtbWF0aC5NYXRyaXgzfSB0aGUgcmVzdWx0XG4gICAqIEBtZW1iZXJPZiBtb2R1bGU6d2ViZ2wtMmQtbWF0aFxuICAgKi9cbiAgZnVuY3Rpb24gc2NhbGUobSwgc3gsIHN5KSB7XG4gICAgcmV0dXJuIG11bHRpcGx5KG0sIHNjYWxpbmcoc3gsIHN5KSk7XG4gIH1cblxuICBmdW5jdGlvbiBkb3QoeDEsIHkxLCB4MiwgeTIpIHtcbiAgICByZXR1cm4geDEgKiB4MiArIHkxICogeTI7XG4gIH1cblxuICBmdW5jdGlvbiBkaXN0YW5jZSh4MSwgeTEsIHgyLCB5Mikge1xuICAgIHZhciBkeCA9IHgxIC0geDI7XG4gICAgdmFyIGR5ID0geTEgLSB5MjtcbiAgICByZXR1cm4gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG5vcm1hbGl6ZSh4LCB5KSB7XG4gICAgdmFyIGwgPSBkaXN0YW5jZSgwLCAwLCB4LCB5KTtcbiAgICBpZiAobCA+IDAuMDAwMDEpIHtcbiAgICAgIHJldHVybiBbeCAvIGwsIHkgLyBsXTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFswLCAwXTtcbiAgICB9XG4gIH1cblxuICAvLyBpID0gaW5jaWRlbnRcbiAgLy8gbiA9IG5vcm1hbFxuICBmdW5jdGlvbiByZWZsZWN0KGl4LCBpeSwgbngsIG55KSB7XG4gICAgLy8gSSAtIDIuMCAqIGRvdChOLCBJKSAqIE4uXG4gICAgdmFyIGQgPSBkb3QobngsIG55LCBpeCwgaXkpO1xuICAgIHJldHVybiBbXG4gICAgICBpeCAtIDIgKiBkICogbngsXG4gICAgICBpeSAtIDIgKiBkICogbnksXG4gICAgXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJhZFRvRGVnKHIpIHtcbiAgICByZXR1cm4gciAqIDE4MCAvIE1hdGguUEk7XG4gIH1cblxuICBmdW5jdGlvbiBkZWdUb1JhZChkKSB7XG4gICAgcmV0dXJuIGQgKiBNYXRoLlBJIC8gMTgwO1xuICB9XG5cbiAgZnVuY3Rpb24gdHJhbnNmb3JtUG9pbnQobSwgdikge1xuICAgIHZhciB2MCA9IHZbMF07XG4gICAgdmFyIHYxID0gdlsxXTtcbiAgICB2YXIgZCA9IHYwICogbVswICogMyArIDJdICsgdjEgKiBtWzEgKiAzICsgMl0gKyBtWzIgKiAzICsgMl07XG4gICAgcmV0dXJuIFtcbiAgICAgICh2MCAqIG1bMCAqIDMgKyAwXSArIHYxICogbVsxICogMyArIDBdICsgbVsyICogMyArIDBdKSAvIGQsXG4gICAgICAodjAgKiBtWzAgKiAzICsgMV0gKyB2MSAqIG1bMSAqIDMgKyAxXSArIG1bMiAqIDMgKyAxXSkgLyBkLFxuICAgIF07XG4gIH1cblxuICBmdW5jdGlvbiBpbnZlcnNlKG0pIHtcbiAgICB2YXIgdDAwID0gbVsxICogMyArIDFdICogbVsyICogMyArIDJdIC0gbVsxICogMyArIDJdICogbVsyICogMyArIDFdO1xuICAgIHZhciB0MTAgPSBtWzAgKiAzICsgMV0gKiBtWzIgKiAzICsgMl0gLSBtWzAgKiAzICsgMl0gKiBtWzIgKiAzICsgMV07XG4gICAgdmFyIHQyMCA9IG1bMCAqIDMgKyAxXSAqIG1bMSAqIDMgKyAyXSAtIG1bMCAqIDMgKyAyXSAqIG1bMSAqIDMgKyAxXTtcbiAgICB2YXIgZCA9IDEuMCAvIChtWzAgKiAzICsgMF0gKiB0MDAgLSBtWzEgKiAzICsgMF0gKiB0MTAgKyBtWzIgKiAzICsgMF0gKiB0MjApO1xuICAgIHJldHVybiBbXG4gICAgICAgZCAqIHQwMCwgLWQgKiB0MTAsIGQgKiB0MjAsXG4gICAgICAtZCAqIChtWzEgKiAzICsgMF0gKiBtWzIgKiAzICsgMl0gLSBtWzEgKiAzICsgMl0gKiBtWzIgKiAzICsgMF0pLFxuICAgICAgIGQgKiAobVswICogMyArIDBdICogbVsyICogMyArIDJdIC0gbVswICogMyArIDJdICogbVsyICogMyArIDBdKSxcbiAgICAgIC1kICogKG1bMCAqIDMgKyAwXSAqIG1bMSAqIDMgKyAyXSAtIG1bMCAqIDMgKyAyXSAqIG1bMSAqIDMgKyAwXSksXG4gICAgICAgZCAqIChtWzEgKiAzICsgMF0gKiBtWzIgKiAzICsgMV0gLSBtWzEgKiAzICsgMV0gKiBtWzIgKiAzICsgMF0pLFxuICAgICAgLWQgKiAobVswICogMyArIDBdICogbVsyICogMyArIDFdIC0gbVswICogMyArIDFdICogbVsyICogMyArIDBdKSxcbiAgICAgICBkICogKG1bMCAqIDMgKyAwXSAqIG1bMSAqIDMgKyAxXSAtIG1bMCAqIDMgKyAxXSAqIG1bMSAqIDMgKyAwXSksXG4gICAgXTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgZGVnVG9SYWQ6IGRlZ1RvUmFkLFxuICAgIGRpc3RhbmNlOiBkaXN0YW5jZSxcbiAgICBkb3Q6IGRvdCxcbiAgICBpZGVudGl0eTogaWRlbnRpdHksXG4gICAgaW52ZXJzZTogaW52ZXJzZSxcbiAgICBtdWx0aXBseTogbXVsdGlwbHksXG4gICAgbm9ybWFsaXplOiBub3JtYWxpemUsXG4gICAgcHJvamVjdGlvbjogcHJvamVjdGlvbixcbiAgICByYWRUb0RlZzogcmFkVG9EZWcsXG4gICAgcmVmbGVjdDogcmVmbGVjdCxcbiAgICByb3RhdGlvbjogcm90YXRpb24sXG4gICAgcm90YXRlOiByb3RhdGUsXG4gICAgc2NhbGluZzogc2NhbGluZyxcbiAgICBzY2FsZTogc2NhbGUsXG4gICAgdHJhbnNmb3JtUG9pbnQ6IHRyYW5zZm9ybVBvaW50LFxuICAgIHRyYW5zbGF0aW9uOiB0cmFuc2xhdGlvbixcbiAgICB0cmFuc2xhdGU6IHRyYW5zbGF0ZSxcbiAgICBwcm9qZWN0OiBwcm9qZWN0LFxuICB9O1xuXG59KSk7XG5cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL2luZGV4LnRzXCIpO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==