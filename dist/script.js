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
var colors = ['#FF00FF', '#800080', '#FF0000', '#800000', '#FFFF00', '#00FF00', '#008000', '#00FFFF', '#0000FF', '#000080'];
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
        isEnable: false,
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
exports.default = "\nattribute vec2 a_position;\nattribute float a_color;\nattribute float a_polygonsize;\nattribute float a_shape;\nuniform mat3 u_matrix;\nvarying vec3 v_color;\nvarying float v_shape;\nvoid main() {\n  gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0.0, 1.0);\n  gl_PointSize = a_polygonsize;\n  v_shape = a_shape;\n  {EXTERNAL-CODE}\n}\n";


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
    function SPlotContol(splot) {
        this.handleMouseDownWithContext = this.handleMouseDown.bind(this);
        this.handleMouseWheelWithContext = this.handleMouseWheel.bind(this);
        this.handleMouseMoveWithContext = this.handleMouseMove.bind(this);
        this.handleMouseUpWithContext = this.handleMouseUp.bind(this);
        this.splot = splot;
    }
    SPlotContol.prototype.run = function () {
        this.splot.canvas.addEventListener('mousedown', this.handleMouseDownWithContext);
        this.splot.canvas.addEventListener('wheel', this.handleMouseWheelWithContext);
    };
    SPlotContol.prototype.stop = function () {
        this.splot.canvas.removeEventListener('mousedown', this.handleMouseDownWithContext);
        this.splot.canvas.removeEventListener('wheel', this.handleMouseWheelWithContext);
        this.splot.canvas.removeEventListener('mousemove', this.handleMouseMoveWithContext);
        this.splot.canvas.removeEventListener('mouseup', this.handleMouseUpWithContext);
    };
    SPlotContol.prototype.makeCameraMatrix = function () {
        var zoomScale = 1 / this.splot.camera.zoom;
        var cameraMat = m3_1.default.identity();
        cameraMat = m3_1.default.translate(cameraMat, this.splot.camera.x, this.splot.camera.y);
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
        var projectionMat = m3_1.default.projection(this.splot.gl.canvas.width, this.splot.gl.canvas.height);
        var cameraMat = this.makeCameraMatrix();
        var viewMat = m3_1.default.inverse(cameraMat);
        this.splot.transform.viewProjectionMat = m3_1.default.multiply(projectionMat, viewMat);
    };
    /**
     *
     */
    SPlotContol.prototype.getClipSpaceMousePosition = function (event) {
        // get canvas relative css position
        var rect = this.splot.canvas.getBoundingClientRect();
        var cssX = event.clientX - rect.left;
        var cssY = event.clientY - rect.top;
        // get normalized 0 to 1 position across and down canvas
        var normalizedX = cssX / this.splot.canvas.clientWidth;
        var normalizedY = cssY / this.splot.canvas.clientHeight;
        // convert to clip space
        var clipX = normalizedX * 2 - 1;
        var clipY = normalizedY * -2 + 1;
        return [clipX, clipY];
    };
    /**
     *
     */
    SPlotContol.prototype.moveCamera = function (event) {
        var pos = m3_1.default.transformPoint(this.splot.transform.startInvViewProjMat, this.getClipSpaceMousePosition(event));
        this.splot.camera.x =
            this.splot.transform.startCamera.x + this.splot.transform.startPos[0] - pos[0];
        this.splot.camera.y =
            this.splot.transform.startCamera.y + this.splot.transform.startPos[1] - pos[1];
        this.splot.render();
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
        this.splot.render();
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
        this.splot.canvas.addEventListener('mousemove', this.handleMouseMoveWithContext);
        this.splot.canvas.addEventListener('mouseup', this.handleMouseUpWithContext);
        this.splot.transform.startInvViewProjMat = m3_1.default.inverse(this.splot.transform.viewProjectionMat);
        this.splot.transform.startCamera = Object.assign({}, this.splot.camera);
        this.splot.transform.startClipPos = this.getClipSpaceMousePosition.call(this, event);
        this.splot.transform.startPos = m3_1.default.transformPoint(this.splot.transform.startInvViewProjMat, this.splot.transform.startClipPos);
        this.splot.transform.startMousePos = [event.clientX, event.clientY];
        this.splot.render();
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
        var _b = m3_1.default.transformPoint(m3_1.default.inverse(this.splot.transform.viewProjectionMat), [clipX, clipY]), preZoomX = _b[0], preZoomY = _b[1];
        // multiply the wheel movement by the current zoom level, so we zoom less when zoomed in and more when zoomed out
        var newZoom = this.splot.camera.zoom * Math.pow(2, event.deltaY * -0.01);
        this.splot.camera.zoom = Math.max(0.002, Math.min(200, newZoom));
        this.updateViewProjection.call(this);
        // position after zooming
        var _c = m3_1.default.transformPoint(m3_1.default.inverse(this.splot.transform.viewProjectionMat), [clipX, clipY]), postZoomX = _c[0], postZoomY = _c[1];
        // camera needs to be moved the difference of before and after
        this.splot.camera.x += preZoomX - postZoomX;
        this.splot.camera.y += preZoomY - postZoomY;
        this.splot.render();
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
    function SPlotDebug(splot) {
        this.isEnable = false;
        this.headerStyle = 'font-weight: bold; color: #ffffff; background-color: #cc0000;';
        this.groupStyle = 'font-weight: bold; color: #ffffff;';
        this.splot = splot;
    }
    SPlotDebug.prototype.logIntro = function (canvas) {
        console.log('%cОтладка SPlot на объекте #' + canvas.id, this.headerStyle);
        if (this.splot.demo.isEnable) {
            console.log('%cВключен демонстрационный режим данных', this.groupStyle);
        }
        console.group('%cПредупреждение', this.splot.debug.groupStyle);
        console.log('Открытая консоль браузера и другие активные средства контроля разработки существенно снижают производительность высоконагруженных приложений. Для объективного анализа производительности все подобные средства должны быть отключены, а консоль браузера закрыта. Некоторые данные отладочной информации в зависимости от используемого браузера могут не отображаться или отображаться некорректно. Средство отладки протестировано в браузере Google Chrome v.90');
        console.groupEnd();
    };
    SPlotDebug.prototype.logGpuInfo = function (gl) {
        console.group('%cВидеосистема', this.groupStyle);
        var ext = gl.getExtension('WEBGL_debug_renderer_info');
        var graphicsCardName = (ext) ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : '[неизвестно]';
        console.log('Графическая карта: ' + graphicsCardName);
        console.log('Версия GL: ' + gl.getParameter(gl.VERSION));
        console.groupEnd();
    };
    SPlotDebug.prototype.logInstanceInfo = function (canvas, options) {
        console.group('%cНастройка параметров экземпляра', this.groupStyle);
        {
            console.dir(this);
            console.log('Пользовательские настройки:\n', utils_1.jsonStringify(options));
            console.log('Канвас: #' + canvas.id);
            console.log('Размер канваса: ' + canvas.width + ' x ' + canvas.height + ' px');
            console.log('Размер плоскости: ' + this.splot.grid.width + ' x ' + this.splot.grid.height + ' px');
            if (this.splot.demo.isEnable) {
                console.log('Способ получения данных: ' + 'демо-данные');
            }
            else {
                console.log('Способ получения данных: ' + 'итерирование');
            }
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
    SPlotDebug.prototype.logDataLoadingComplete = function (amount, maxAmount) {
        console.group('%cЗагрузка данных завершена [' + utils_1.getCurrentTime() + ']', this.groupStyle);
        console.timeEnd('Длительность');
        console.log('Результат: ' +
            ((amount >= maxAmount) ?
                'достигнут заданный лимит (' + maxAmount.toLocaleString() + ')' :
                'обработаны все объекты'));
        console.groupEnd();
    };
    SPlotDebug.prototype.logObjectStats = function (buffers, amountOfPolygons) {
        console.group('%cКол-во объектов: ' + amountOfPolygons.toLocaleString(), this.groupStyle);
        for (var i = 0; i < this.splot.shapes.length; i++) {
            var shapeCapction = this.splot.shapes[i].name;
            var shapeAmount = buffers.amountOfShapes[i];
            console.log(shapeCapction + ': ' + shapeAmount.toLocaleString() +
                ' [~' + Math.round(100 * shapeAmount / amountOfPolygons) + '%]');
        }
        console.log('Кол-во цветов в палитре: ' + this.splot.colors.length);
        console.groupEnd();
    };
    SPlotDebug.prototype.logGpuMemStats = function (buffers) {
        var bytesUsedByBuffers = buffers.sizeInBytes[0] + buffers.sizeInBytes[1] + buffers.sizeInBytes[3];
        console.group('%cРасход видеопамяти: ' + (bytesUsedByBuffers / 1000000).toFixed(2).toLocaleString() + ' МБ', this.groupStyle);
        console.log('Буферы вершин: ' +
            (buffers.sizeInBytes[0] / 1000000).toFixed(2).toLocaleString() + ' МБ' +
            ' [~' + Math.round(100 * buffers.sizeInBytes[0] / bytesUsedByBuffers) + '%]');
        console.log('Буферы цветов: '
            + (buffers.sizeInBytes[1] / 1000000).toFixed(2).toLocaleString() + ' МБ' +
            ' [~' + Math.round(100 * buffers.sizeInBytes[1] / bytesUsedByBuffers) + '%]');
        console.log('Буферы размеров: '
            + (buffers.sizeInBytes[3] / 1000000).toFixed(2).toLocaleString() + ' МБ' +
            ' [~' + Math.round(100 * buffers.sizeInBytes[2] / bytesUsedByBuffers) + '%]');
        console.log('Кол-во групп буферов: ' + buffers.amountOfBufferGroups.toLocaleString());
        console.log('Кол-во GL-треугольников: ' + (buffers.amountOfTotalGLVertices / 3).toLocaleString());
        console.log('Кол-во вершин: ' + buffers.amountOfTotalVertices.toLocaleString());
        console.groupEnd();
    };
    SPlotDebug.prototype.logRenderStarted = function () {
        console.log('%cРендеринг запущен', this.splot.debug.groupStyle);
    };
    SPlotDebug.prototype.logRenderStoped = function () {
        console.log('%cРендеринг остановлен', this.splot.debug.groupStyle);
    };
    SPlotDebug.prototype.logCanvasCleared = function () {
        console.log('%cКонтекст рендеринга очищен [' + this.splot.grid.bgColor + ']', this.splot.debug.groupStyle);
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
        this.isEnable = false;
        this.amount = 1000000;
        this.shapeQuota = [];
        this.index = 0;
        this.splot = splot;
        this.init();
    }
    SPlotDemo.prototype.init = function () {
        this.index = 0;
    };
    /**
     * Имитирует итерирование исходных объектов.
     *
     * @returns Информация о полигоне или null, если итерирование завершилось.
     */
    SPlotDemo.prototype.demoIterationCallback = function () {
        if (this.index < this.amount) {
            this.index++;
            return {
                x: utils_1.randomInt(this.splot.grid.width),
                y: utils_1.randomInt(this.splot.grid.height),
                shape: utils_1.randomQuotaIndex(this.shapeQuota),
                size: 10 + utils_1.randomInt(21),
                color: utils_1.randomInt(this.splot.colors.length)
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
    function SPlotWebGl(splot) {
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
        this.splot = splot;
    }
    /**
     * Создает контекст рендеринга WebGL и устанавливает корректный размер области просмотра.
     */
    SPlotWebGl.prototype.create = function () {
        this.splot.gl = this.splot.canvas.getContext('webgl', this.webGlSettings);
        this.splot.canvas.width = this.splot.canvas.clientWidth;
        this.splot.canvas.height = this.splot.canvas.clientHeight;
        this.splot.gl.viewport(0, 0, this.splot.canvas.width, this.splot.canvas.height);
    };
    SPlotWebGl.prototype.setBgColor = function (color) {
        var _a = utils_1.colorFromHexToGlRgb(color), r = _a[0], g = _a[1], b = _a[2];
        this.splot.gl.clearColor(r, g, b, 0.0);
    };
    SPlotWebGl.prototype.clearBackground = function () {
        this.splot.gl.clear(this.splot.gl.COLOR_BUFFER_BIT);
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
        var shader = this.splot.gl.createShader(this.splot.gl[shaderType]);
        this.splot.gl.shaderSource(shader, shaderCode);
        this.splot.gl.compileShader(shader);
        if (!this.splot.gl.getShaderParameter(shader, this.splot.gl.COMPILE_STATUS)) {
            throw new Error('Ошибка компиляции шейдера [' + shaderType + ']. ' + this.splot.gl.getShaderInfoLog(shader));
        }
        return shader;
    };
    /**
     * Создает программу WebGL.
     *
     * @param {WebGLShader} vertexShader Вершинный шейдер.
     * @param {WebGLShader} fragmentShader Фрагментный шейдер.
     */
    SPlotWebGl.prototype.createProgram = function (shaderVert, shaderFrag) {
        this.splot.gpuProgram = this.splot.gl.createProgram();
        this.splot.gl.attachShader(this.splot.gpuProgram, shaderVert);
        this.splot.gl.attachShader(this.splot.gpuProgram, shaderFrag);
        this.splot.gl.linkProgram(this.splot.gpuProgram);
        this.splot.gl.useProgram(this.splot.gpuProgram);
    };
    /**
     * Устанавливает связь переменной приложения с программой WebGl.
     *
     * @param varType Тип переменной.
     * @param varName Имя переменной.
     */
    SPlotWebGl.prototype.createVariable = function (varType, varName) {
        if (varType === 'uniform') {
            this.splot.variables[varName] = this.splot.gl.getUniformLocation(this.splot.gpuProgram, varName);
        }
        else if (varType === 'attribute') {
            this.splot.variables[varName] = this.splot.gl.getAttribLocation(this.splot.gpuProgram, varName);
        }
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
    SPlotWebGl.prototype.createBuffer = function (buffers, type, data, key) {
        // Определение индекса нового элемента в массиве буферов WebGL.
        var index = this.splot.buffers.amountOfBufferGroups;
        // Создание и заполнение данными нового буфера.
        buffers[index] = this.splot.gl.createBuffer();
        this.splot.gl.bindBuffer(this.splot.gl[type], buffers[index]);
        this.splot.gl.bufferData(this.splot.gl[type], data, this.splot.gl.STATIC_DRAW);
        // Счетчик памяти, занимаемой буферами данных (раздельно по каждому типу буферов)
        this.splot.buffers.sizeInBytes[key] += data.length * data.BYTES_PER_ELEMENT;
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
        this.demo = new splot_demo_1.default(this); // Хелпер режима демо-данных.
        this.webGl = new splot_webgl_1.default(this); // Хелпер WebGL.
        this.debug = new splot_debug_1.default(this); // Хелпер режима отладки
        this.forceRun = false; // Признак форсированного запуска рендера.
        this.limit = 1000000000; // Ограничение кол-ва объектов на графике.
        this.isRunning = false; // Признак активного процесса рендера.
        // Цветовая палитра объектов.
        this.colors = [
            '#FF00FF', '#800080', '#FF0000', '#800000', '#FFFF00',
            '#00FF00', '#008000', '#00FFFF', '#0000FF', '#000080'
        ];
        // Параметры координатной плоскости.
        this.grid = {
            width: 32000,
            height: 16000,
            bgColor: '#ffffff',
            rulesColor: '#c0c0c0'
        };
        // Параметры области просмотра.
        this.camera = {
            x: this.grid.width / 2,
            y: this.grid.height / 2,
            zoom: 1
        };
        this.shapes = [];
        this.variables = {}; // Переменные для связи приложения с программой WebGL.
        this.shaderCodeVert = shader_code_vert_tmpl_1.default; // Шаблон GLSL-кода для вершинного шейдера.
        this.shaderCodeFrag = shader_code_frag_tmpl_1.default; // Шаблон GLSL-кода для фрагментного шейдера.
        this.amountOfPolygons = 0; // Счетчик числа обработанных полигонов.
        this.maxAmountOfVertexInGroup = 10000; // Максимальное кол-во вершин в группе.
        this.control = new splot_control_1.default(this); // Объект управления графиком устройствами ввода.
        // Техническая информация, используемая приложением для расчета трансформаций.
        this.transform = {
            viewProjectionMat: [],
            startInvViewProjMat: [],
            startCamera: { x: 0, y: 0, zoom: 1 },
            startPos: [],
            startClipPos: [],
            startMousePos: []
        };
        // Информация о буферах, хранящих данные для видеопамяти.
        this.buffers = {
            vertexBuffers: [],
            colorBuffers: [],
            sizeBuffers: [],
            shapeBuffers: [],
            amountOfGLVertices: [],
            amountOfShapes: [],
            amountOfBufferGroups: 0,
            amountOfTotalVertices: 0,
            amountOfTotalGLVertices: 0,
            sizeInBytes: [0, 0, 0, 0]
        };
        if (document.getElementById(canvasId)) {
            this.canvas = document.getElementById(canvasId);
        }
        else {
            throw new Error('Канвас с идентификатором "#' + canvasId + '" не найден!');
        }
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
        this.webGl.create(); // Создание контекста рендеринга.
        this.amountOfPolygons = 0; // Обнуление счетчика полигонов.
        this.demo.init(); // Обнуление технического счетчика режима демо-данных.
        for (var key in this.shapes) {
            this.buffers.amountOfShapes[key] = 0; // Обнуление счетчиков форм полигонов.
        }
        if (this.debug.isEnable) {
            this.debug.logIntro(this.canvas);
            this.debug.logGpuInfo(this.gl);
            this.debug.logInstanceInfo(this.canvas, options);
        }
        this.webGl.setBgColor(this.grid.bgColor); // Установка цвета очистки рендеринга
        // Создание шейдеров WebGL.
        var shaderCodeVert = this.shaderCodeVert.replace('{EXTERNAL-CODE}', this.genShaderColorCode());
        var shaderCodeFrag = this.shaderCodeFrag;
        var shaderVert = this.webGl.createShader('VERTEX_SHADER', shaderCodeVert);
        var shaderFrag = this.webGl.createShader('FRAGMENT_SHADER', shaderCodeFrag);
        // Вывод отладочной информации.
        if (this.debug.isEnable) {
            this.debug.logShaderInfo('VERTEX_SHADER', shaderCodeVert);
            this.debug.logShaderInfo('FRAGMENT_SHADER', shaderCodeFrag);
        }
        // Создание программы WebGL.
        this.webGl.createProgram(shaderVert, shaderFrag);
        // Установка связей переменных приложения с программой WebGl.
        this.webGl.createVariable('attribute', 'a_position');
        this.webGl.createVariable('attribute', 'a_color');
        this.webGl.createVariable('attribute', 'a_polygonsize');
        this.webGl.createVariable('attribute', 'a_shape');
        this.webGl.createVariable('uniform', 'u_matrix');
        this.createWebGlBuffers(); // Заполнение буферов WebGL.
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
            this.iterator = this.demo.demoIterationCallback; // Имитация итерирования для демо-режима.
        }
    };
    /**
     * Создает и заполняет данными обо всех полигонах буферы WebGL.
     */
    SPlot.prototype.createWebGlBuffers = function () {
        // Вывод отладочной информации.
        if (this.debug.isEnable) {
            this.debug.logDataLoadingStart();
        }
        var polygonGroup;
        // Итерирование групп полигонов.
        while (polygonGroup = this.createPolygonGroup()) {
            // Создание и заполнение буферов данными о текущей группе полигонов.
            this.webGl.createBuffer(this.buffers.vertexBuffers, 'ARRAY_BUFFER', new Float32Array(polygonGroup.vertices), 0);
            this.webGl.createBuffer(this.buffers.colorBuffers, 'ARRAY_BUFFER', new Uint8Array(polygonGroup.colors), 1);
            this.webGl.createBuffer(this.buffers.shapeBuffers, 'ARRAY_BUFFER', new Uint8Array(polygonGroup.shapes), 4);
            this.webGl.createBuffer(this.buffers.sizeBuffers, 'ARRAY_BUFFER', new Float32Array(polygonGroup.sizes), 3);
            // Счетчик количества буферов.
            this.buffers.amountOfBufferGroups++;
            // Счетчик количества вершин GL-треугольников текущей группы буферов.
            this.buffers.amountOfGLVertices.push(polygonGroup.amountOfGLVertices);
            // Счетчик общего количества вершин GL-треугольников.
            this.buffers.amountOfTotalGLVertices += polygonGroup.amountOfGLVertices;
        }
        // Вывод отладочной информации.
        if (this.debug.isEnable) {
            this.debug.logDataLoadingComplete(this.amountOfPolygons, this.limit);
            this.debug.logObjectStats(this.buffers, this.amountOfPolygons);
            this.debug.logGpuMemStats(this.buffers);
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
            amountOfGLVertices: 0
        };
        var polygon;
        /**
         * Если количество полигонов канваса достигло допустимого максимума, то дальнейшая обработка исходных объектов
         * приостанавливается - формирование групп полигонов завершается возвратом значения null (симуляция достижения
         * последнего обрабатываемого исходного объекта).
         */
        if (this.amountOfPolygons >= this.limit)
            return null;
        // Итерирование исходных объектов.
        while (polygon = this.iterator()) {
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
            if (this.amountOfPolygons >= this.limit)
                break;
            /**
             * Если общее количество всех вершин в группе полигонов превысило техническое ограничение, то группа полигонов
             * считается сформированной и итерирование исходных объектов приостанавливается.
             */
            if (polygonGroup.amountOfVertices >= this.maxAmountOfVertexInGroup)
                break;
        }
        // Счетчик общего количества вершин всех вершинных буферов.
        this.buffers.amountOfTotalVertices += polygonGroup.amountOfVertices;
        // Если группа полигонов непустая, то возвращаем ее. Если пустая - возвращаем null.
        return (polygonGroup.amountOfVertices > 0) ? polygonGroup : null;
    };
    /**
     * Создает и добавляет в группу полигонов новый полигон.
     *
     * @param polygonGroup - Группа полигонов, в которую происходит добавление.
     * @param polygon - Информация о добавляемом полигоне.
     */
    SPlot.prototype.addPolygon = function (polygonGroup, polygon) {
        /**
         * Добавление в группу полигонов индексов вершин нового полигона и подсчет общего количества вершин GL-треугольников
         * в группе.
         */
        polygonGroup.amountOfGLVertices++;
        // Добавление в группу полигонов вершин нового полигона и подсчет общего количества вершин в группе.
        polygonGroup.vertices.push(polygon.x, polygon.y);
        polygonGroup.amountOfVertices++;
        polygonGroup.shapes.push(polygon.shape);
        polygonGroup.sizes.push(polygon.size);
        polygonGroup.colors.push(polygon.color);
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
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        // Обновление матрицы трансформации.
        this.control.updateViewProjection();
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
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.shapeBuffers[i]);
            this.gl.enableVertexAttribArray(this.variables['a_shape']);
            this.gl.vertexAttribPointer(this.variables['a_shape'], 1, this.gl.UNSIGNED_BYTE, false, 0, 0);
            this.gl.drawArrays(this.gl.POINTS, 0, this.buffers.amountOfGLVertices[i] / 3);
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
        this.webGl.clearBackground();
        if (this.debug.isEnable) {
            this.debug.logCanvasCleared();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zdHlsZS5jc3MiLCJ3ZWJwYWNrOi8vLy4vaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vc2hhZGVyLWNvZGUtZnJhZy10bXBsLnRzIiwid2VicGFjazovLy8uL3NoYWRlci1jb2RlLXZlcnQtdG1wbC50cyIsIndlYnBhY2s6Ly8vLi9zcGxvdC1jb250cm9sLnRzIiwid2VicGFjazovLy8uL3NwbG90LWRlYnVnLnRzIiwid2VicGFjazovLy8uL3NwbG90LWRlbW8udHMiLCJ3ZWJwYWNrOi8vLy4vc3Bsb3Qtd2ViZ2wudHMiLCJ3ZWJwYWNrOi8vLy4vc3Bsb3QudHMiLCJ3ZWJwYWNrOi8vLy4vdXRpbHMudHMiLCJ3ZWJwYWNrOi8vLy4vbTMuanMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovLy93ZWJwYWNrL3N0YXJ0dXAiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBQSxnRkFBMkI7QUFDM0Isa0RBQWdCO0FBRWhCLFNBQVMsU0FBUyxDQUFDLEtBQWE7SUFDOUIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxLQUFLLENBQUM7QUFDMUMsQ0FBQztBQUVELElBQUksQ0FBQyxHQUFHLENBQUM7QUFDVCxJQUFJLENBQUMsR0FBRyxPQUFTLEVBQUUsOEJBQThCO0FBQ2pELElBQUksTUFBTSxHQUFHLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDO0FBQzNILElBQUksU0FBUyxHQUFHLEtBQU07QUFDdEIsSUFBSSxVQUFVLEdBQUcsS0FBTTtBQUV2QixnSEFBZ0g7QUFDaEgsU0FB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QTs7O0FBR0E7QUFDQTtBQUNBLGNBQWMsOEJBQThCO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEIsY0FBYyw2QkFBNkI7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWEsNkJBQTZCO0FBQzFDLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEIsY0FBYyw2QkFBNkI7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQixjQUFjLDZCQUE2QjtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWEsNkJBQTZCO0FBQzFDLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEIsY0FBYyw2QkFBNkI7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCLGNBQWMsNkJBQTZCO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWEsNkJBQTZCO0FBQzFDLGFBQWEsT0FBTztBQUNwQixjQUFjLDZCQUE2QjtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhLE9BQU87QUFDcEIsYUFBYSxPQUFPO0FBQ3BCLGNBQWMsNkJBQTZCO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYSw2QkFBNkI7QUFDMUMsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQixjQUFjLDZCQUE2QjtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxDQUFDOzs7Ozs7OztVQzdTRDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQSxzREFBc0Qsa0JBQWtCO1dBQ3hFO1dBQ0EsK0NBQStDLGNBQWM7V0FDN0QsRTs7Ozs7VUNOQTtVQUNBO1VBQ0E7VUFDQSIsImZpbGUiOiJzY3JpcHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCJpbXBvcnQgU1Bsb3QgZnJvbSAnLi9zcGxvdCdcbmltcG9ydCAnQC9zdHlsZSdcblxuZnVuY3Rpb24gcmFuZG9tSW50KHJhbmdlOiBudW1iZXIpIHtcbiAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHJhbmdlKVxufVxuXG5sZXQgaSA9IDBcbmxldCBuID0gMV8wMDBfMDAwICAvLyDQmNC80LjRgtC40YDRg9C10LzQvtC1INGH0LjRgdC70L4g0L7QsdGK0LXQutGC0L7Qsi5cbmxldCBjb2xvcnMgPSBbJyNGRjAwRkYnLCAnIzgwMDA4MCcsICcjRkYwMDAwJywgJyM4MDAwMDAnLCAnI0ZGRkYwMCcsICcjMDBGRjAwJywgJyMwMDgwMDAnLCAnIzAwRkZGRicsICcjMDAwMEZGJywgJyMwMDAwODAnXVxubGV0IHBsb3RXaWR0aCA9IDMyXzAwMFxubGV0IHBsb3RIZWlnaHQgPSAxNl8wMDBcblxuLy8g0J/RgNC40LzQtdGAINC40YLQtdGA0LjRgNGD0Y7RidC10Lkg0YTRg9C90LrRhtC40LguINCY0YLQtdGA0LDRhtC40Lgg0LjQvNC40YLQuNGA0YPRjtGC0YHRjyDRgdC70YPRh9Cw0LnQvdGL0LzQuCDQstGL0LTQsNGH0LDQvNC4LiDQn9C+0YfRgtC4INGC0LDQutC20LUg0YDQsNCx0L7RgtCw0LXRgiDRgNC10LbQuNC8INC00LXQvNC+LdC00LDQvdC90YvRhS5cbmZ1bmN0aW9uIHJlYWROZXh0T2JqZWN0KCkge1xuICBpZiAoaSA8IG4pIHtcbiAgICBpKytcbiAgICByZXR1cm4ge1xuICAgICAgeDogcmFuZG9tSW50KHBsb3RXaWR0aCksXG4gICAgICB5OiByYW5kb21JbnQocGxvdEhlaWdodCksXG4gICAgICBzaGFwZTogcmFuZG9tSW50KDIpLFxuICAgICAgc2l6ZTogMTAgKyByYW5kb21JbnQoMjEpLFxuICAgICAgY29sb3I6IHJhbmRvbUludChjb2xvcnMubGVuZ3RoKSwgIC8vINCY0L3QtNC10LrRgSDRhtCy0LXRgtCwINCyINC80LDRgdGB0LjQstC1INGG0LLQtdGC0L7QslxuICAgIH1cbiAgfVxuICBlbHNlXG4gICAgcmV0dXJuIG51bGwgIC8vINCS0L7Qt9Cy0YDQsNGJ0LDQtdC8IG51bGwsINC60L7Qs9C00LAg0L7QsdGK0LXQutGC0YsgXCLQt9Cw0LrQvtC90YfQuNC70LjRgdGMXCJcbn1cblxuLyoqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqKi9cblxubGV0IHNjYXR0ZXJQbG90ID0gbmV3IFNQbG90KCdjYW52YXMxJylcblxuLy8g0J3QsNGB0YLRgNC+0LnQutCwINGN0LrQt9C10LzQv9C70Y/RgNCwINC90LAg0YDQtdC20LjQvCDQstGL0LLQvtC00LAg0L7RgtC70LDQtNC+0YfQvdC+0Lkg0LjQvdGE0L7RgNC80LDRhtC40Lgg0LIg0LrQvtC90YHQvtC70Ywg0LHRgNCw0YPQt9C10YDQsC5cbi8vINCU0YDRg9Cz0LjQtSDQv9GA0LjQvNC10YDRiyDRgNCw0LHQvtGC0Ysg0L7Qv9C40YHQsNC90Ysg0LIg0YTQsNC50LvQtSBzcGxvdC5qcyDRgdC+INGB0YLRgNC+0LrQuCAyMTQuXG5zY2F0dGVyUGxvdC5zZXR1cCh7XG4gIGl0ZXJhdG9yOiByZWFkTmV4dE9iamVjdCxcbiAgY29sb3JzOiBjb2xvcnMsXG4gIGdyaWQ6IHtcbiAgICB3aWR0aDogcGxvdFdpZHRoLFxuICAgIGhlaWdodDogcGxvdEhlaWdodCxcbiAgfSxcbiAgZGVidWc6IHtcbiAgICBpc0VuYWJsZTogdHJ1ZSxcbiAgfSxcbiAgZGVtbzoge1xuICAgIGlzRW5hYmxlOiBmYWxzZSxcbiAgfSxcbiAgdXNlVmVydGV4SW5kaWNlczogZmFsc2Vcbn0pXG5cbnNjYXR0ZXJQbG90LnJ1bigpXG5cbi8vc2NhdHRlclBsb3Quc3RvcCgpXG5cbi8vc2V0VGltZW91dCgoKSA9PiBzY2F0dGVyUGxvdC5zdG9wKCksIDMwMDApXG4iLCJleHBvcnQgZGVmYXVsdFxuYFxucHJlY2lzaW9uIGxvd3AgZmxvYXQ7XG52YXJ5aW5nIHZlYzMgdl9jb2xvcjtcbnZhcnlpbmcgZmxvYXQgdl9zaGFwZTtcbnZvaWQgbWFpbigpIHtcbiAgaWYgKHZfc2hhcGUgPT0gMC4wKSB7XG4gICAgZmxvYXQgdlNpemUgPSAyMC4wO1xuICAgIGZsb2F0IGRpc3RhbmNlID0gbGVuZ3RoKDIuMCAqIGdsX1BvaW50Q29vcmQgLSAxLjApO1xuICAgIGlmIChkaXN0YW5jZSA+IDEuMCkgeyBkaXNjYXJkOyB9O1xuICAgIGdsX0ZyYWdDb2xvciA9IHZlYzQodl9jb2xvci5yZ2IsIDEuMCk7XG4gIH1cbiAgZWxzZSBpZiAodl9zaGFwZSA9PSAxLjApIHtcbiAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KHZfY29sb3IucmdiLCAxLjApO1xuICB9XG59XG5gXG5cbi8qKlxuZXhwb3J0IGRlZmF1bHRcbiAgYFxucHJlY2lzaW9uIGxvd3AgZmxvYXQ7XG52YXJ5aW5nIHZlYzMgdl9jb2xvcjtcbnZvaWQgbWFpbigpIHtcbiAgZmxvYXQgdlNpemUgPSAyMC4wO1xuICBmbG9hdCBkaXN0YW5jZSA9IGxlbmd0aCgyLjAgKiBnbF9Qb2ludENvb3JkIC0gMS4wKTtcbiAgaWYgKGRpc3RhbmNlID4gMS4wKSB7IGRpc2NhcmQ7IH1cbiAgZ2xfRnJhZ0NvbG9yID0gdmVjNCh2X2NvbG9yLnJnYiwgMS4wKTtcblxuICAgdmVjNCB1RWRnZUNvbG9yID0gdmVjNCgwLjUsIDAuNSwgMC41LCAxLjApO1xuIGZsb2F0IHVFZGdlU2l6ZSA9IDEuMDtcblxuZmxvYXQgc0VkZ2UgPSBzbW9vdGhzdGVwKFxuICB2U2l6ZSAtIHVFZGdlU2l6ZSAtIDIuMCxcbiAgdlNpemUgLSB1RWRnZVNpemUsXG4gIGRpc3RhbmNlICogKHZTaXplICsgdUVkZ2VTaXplKVxuKTtcbmdsX0ZyYWdDb2xvciA9ICh1RWRnZUNvbG9yICogc0VkZ2UpICsgKCgxLjAgLSBzRWRnZSkgKiBnbF9GcmFnQ29sb3IpO1xuXG5nbF9GcmFnQ29sb3IuYSA9IGdsX0ZyYWdDb2xvci5hICogKDEuMCAtIHNtb290aHN0ZXAoXG4gICAgdlNpemUgLSAyLjAsXG4gICAgdlNpemUsXG4gICAgZGlzdGFuY2UgKiB2U2l6ZVxuKSk7XG5cbn1cbmBcbiovXG4iLCJleHBvcnQgZGVmYXVsdFxuYFxuYXR0cmlidXRlIHZlYzIgYV9wb3NpdGlvbjtcbmF0dHJpYnV0ZSBmbG9hdCBhX2NvbG9yO1xuYXR0cmlidXRlIGZsb2F0IGFfcG9seWdvbnNpemU7XG5hdHRyaWJ1dGUgZmxvYXQgYV9zaGFwZTtcbnVuaWZvcm0gbWF0MyB1X21hdHJpeDtcbnZhcnlpbmcgdmVjMyB2X2NvbG9yO1xudmFyeWluZyBmbG9hdCB2X3NoYXBlO1xudm9pZCBtYWluKCkge1xuICBnbF9Qb3NpdGlvbiA9IHZlYzQoKHVfbWF0cml4ICogdmVjMyhhX3Bvc2l0aW9uLCAxKSkueHksIDAuMCwgMS4wKTtcbiAgZ2xfUG9pbnRTaXplID0gYV9wb2x5Z29uc2l6ZTtcbiAgdl9zaGFwZSA9IGFfc2hhcGU7XG4gIHtFWFRFUk5BTC1DT0RFfVxufVxuYFxuIiwiLy8gQHRzLWlnbm9yZVxuaW1wb3J0IG0zIGZyb20gJy4vbTMnXG5pbXBvcnQgU1Bsb3QgZnJvbSAnLi9zcGxvdCdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU1Bsb3RDb250b2wge1xuXG4gIHByaXZhdGUgc3Bsb3Q6IFNQbG90XG5cbiAgcHJvdGVjdGVkIGhhbmRsZU1vdXNlRG93bldpdGhDb250ZXh0OiBFdmVudExpc3RlbmVyID0gdGhpcy5oYW5kbGVNb3VzZURvd24uYmluZCh0aGlzKSBhcyBFdmVudExpc3RlbmVyXG4gIHByb3RlY3RlZCBoYW5kbGVNb3VzZVdoZWVsV2l0aENvbnRleHQ6IEV2ZW50TGlzdGVuZXIgPSB0aGlzLmhhbmRsZU1vdXNlV2hlZWwuYmluZCh0aGlzKSBhcyBFdmVudExpc3RlbmVyXG4gIHByb3RlY3RlZCBoYW5kbGVNb3VzZU1vdmVXaXRoQ29udGV4dDogRXZlbnRMaXN0ZW5lciA9IHRoaXMuaGFuZGxlTW91c2VNb3ZlLmJpbmQodGhpcykgYXMgRXZlbnRMaXN0ZW5lclxuICBwcm90ZWN0ZWQgaGFuZGxlTW91c2VVcFdpdGhDb250ZXh0OiBFdmVudExpc3RlbmVyID0gdGhpcy5oYW5kbGVNb3VzZVVwLmJpbmQodGhpcykgYXMgRXZlbnRMaXN0ZW5lclxuXG4gIGNvbnN0cnVjdG9yKHNwbG90OiBTUGxvdCkge1xuICAgIHRoaXMuc3Bsb3QgPSBzcGxvdFxuICB9XG5cbiAgcHVibGljIHJ1bigpIHtcbiAgICB0aGlzLnNwbG90LmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLmhhbmRsZU1vdXNlRG93bldpdGhDb250ZXh0KVxuICAgIHRoaXMuc3Bsb3QuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ3doZWVsJywgdGhpcy5oYW5kbGVNb3VzZVdoZWVsV2l0aENvbnRleHQpXG4gIH1cblxuICBwdWJsaWMgc3RvcCgpIHtcbiAgICB0aGlzLnNwbG90LmNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLmhhbmRsZU1vdXNlRG93bldpdGhDb250ZXh0KVxuICAgIHRoaXMuc3Bsb3QuY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3doZWVsJywgdGhpcy5oYW5kbGVNb3VzZVdoZWVsV2l0aENvbnRleHQpXG4gICAgdGhpcy5zcGxvdC5jYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5oYW5kbGVNb3VzZU1vdmVXaXRoQ29udGV4dClcbiAgICB0aGlzLnNwbG90LmNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5oYW5kbGVNb3VzZVVwV2l0aENvbnRleHQpXG4gIH1cblxuICBwcm90ZWN0ZWQgbWFrZUNhbWVyYU1hdHJpeCgpIHtcblxuICAgIGNvbnN0IHpvb21TY2FsZSA9IDEgLyB0aGlzLnNwbG90LmNhbWVyYS56b29tITtcblxuICAgIGxldCBjYW1lcmFNYXQgPSBtMy5pZGVudGl0eSgpO1xuICAgIGNhbWVyYU1hdCA9IG0zLnRyYW5zbGF0ZShjYW1lcmFNYXQsIHRoaXMuc3Bsb3QuY2FtZXJhLngsIHRoaXMuc3Bsb3QuY2FtZXJhLnkpO1xuICAgIGNhbWVyYU1hdCA9IG0zLnNjYWxlKGNhbWVyYU1hdCwgem9vbVNjYWxlLCB6b29tU2NhbGUpO1xuXG4gICAgcmV0dXJuIGNhbWVyYU1hdDtcbiAgfVxuXG4gIC8qKlxuICAgKiDQntCx0L3QvtCy0LvRj9C10YIg0LzQsNGC0YDQuNGG0YMg0YLRgNCw0L3RgdGE0L7RgNC80LDRhtC40LguXG4gICAqXG4gICAqIEByZW1hcmtzXG4gICAqINCh0YPRidC10YHRgtCy0YPQtdGCINC00LLQsCDQstCw0YDQuNCw0L3RgtCwINCy0YvQt9C+0LLQsCDQvNC10YLQvtC00LAgLSDQuNC3INC00YDRg9Cz0L7Qs9C+INC80LXRgtC+0LTQsCDRjdC60LfQtdC80L/Qu9GP0YDQsCAoe0BsaW5rIHJlbmRlcn0pINC4INC40Lcg0L7QsdGA0LDQsdC+0YLRh9C40LrQsCDRgdC+0LHRi9GC0LjRjyDQvNGL0YjQuFxuICAgKiAoe0BsaW5rIGhhbmRsZU1vdXNlV2hlZWx9KS4g0JLQviDQstGC0L7RgNC+0Lwg0LLQsNGA0LjQsNC90YLQtSDQuNGB0L/QvtC70YzQt9C+0LLQsNC90LjQtSDQvtCx0YrQtdC60YLQsCB0aGlzINC90LXQstC+0LfQvNC+0LbQvdC+LiDQlNC70Y8g0YPQvdC40LLQtdGA0YHQsNC70YzQvdC+0YHRgtC4INCy0YvQt9C+0LLQsFxuICAgKiDQvNC10YLQvtC00LAgLSDQsiDQvdC10LPQviDQstGB0LXQs9C00LAg0Y/QstC90L4g0L3QtdC+0LHRhdC+0LTQuNC80L4g0L/QtdGA0LXQtNCw0LLQsNGC0Ywg0YHRgdGL0LvQutGDINC90LAg0Y3QutC30LXQvNC/0LvRj9GAINC60LvQsNGB0YHQsC5cbiAgICovXG4gIHB1YmxpYyB1cGRhdGVWaWV3UHJvamVjdGlvbigpOiB2b2lkIHtcblxuICAgIGNvbnN0IHByb2plY3Rpb25NYXQgPSBtMy5wcm9qZWN0aW9uKHRoaXMuc3Bsb3QuZ2wuY2FudmFzLndpZHRoLCB0aGlzLnNwbG90LmdsLmNhbnZhcy5oZWlnaHQpO1xuICAgIGNvbnN0IGNhbWVyYU1hdCA9IHRoaXMubWFrZUNhbWVyYU1hdHJpeCgpO1xuICAgIGxldCB2aWV3TWF0ID0gbTMuaW52ZXJzZShjYW1lcmFNYXQpO1xuICAgIHRoaXMuc3Bsb3QudHJhbnNmb3JtLnZpZXdQcm9qZWN0aW9uTWF0ID0gbTMubXVsdGlwbHkocHJvamVjdGlvbk1hdCwgdmlld01hdCk7XG4gIH1cblxuICAvKipcbiAgICpcbiAgICovXG4gIHByb3RlY3RlZCBnZXRDbGlwU3BhY2VNb3VzZVBvc2l0aW9uKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG5cbiAgICAvLyBnZXQgY2FudmFzIHJlbGF0aXZlIGNzcyBwb3NpdGlvblxuICAgIGNvbnN0IHJlY3QgPSB0aGlzLnNwbG90LmNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBjc3NYID0gZXZlbnQuY2xpZW50WCAtIHJlY3QubGVmdDtcbiAgICBjb25zdCBjc3NZID0gZXZlbnQuY2xpZW50WSAtIHJlY3QudG9wO1xuXG4gICAgLy8gZ2V0IG5vcm1hbGl6ZWQgMCB0byAxIHBvc2l0aW9uIGFjcm9zcyBhbmQgZG93biBjYW52YXNcbiAgICBjb25zdCBub3JtYWxpemVkWCA9IGNzc1ggLyB0aGlzLnNwbG90LmNhbnZhcy5jbGllbnRXaWR0aDtcbiAgICBjb25zdCBub3JtYWxpemVkWSA9IGNzc1kgLyB0aGlzLnNwbG90LmNhbnZhcy5jbGllbnRIZWlnaHQ7XG5cbiAgICAvLyBjb252ZXJ0IHRvIGNsaXAgc3BhY2VcbiAgICBjb25zdCBjbGlwWCA9IG5vcm1hbGl6ZWRYICogMiAtIDE7XG4gICAgY29uc3QgY2xpcFkgPSBub3JtYWxpemVkWSAqIC0yICsgMTtcblxuICAgIHJldHVybiBbY2xpcFgsIGNsaXBZXTtcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKi9cbiAgcHJvdGVjdGVkIG1vdmVDYW1lcmEoZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcblxuICAgIGNvbnN0IHBvcyA9IG0zLnRyYW5zZm9ybVBvaW50KFxuICAgICAgdGhpcy5zcGxvdC50cmFuc2Zvcm0uc3RhcnRJbnZWaWV3UHJvak1hdCxcbiAgICAgIHRoaXMuZ2V0Q2xpcFNwYWNlTW91c2VQb3NpdGlvbihldmVudClcbiAgICApO1xuXG4gICAgdGhpcy5zcGxvdC5jYW1lcmEueCA9XG4gICAgICB0aGlzLnNwbG90LnRyYW5zZm9ybS5zdGFydENhbWVyYS54ISArIHRoaXMuc3Bsb3QudHJhbnNmb3JtLnN0YXJ0UG9zWzBdIC0gcG9zWzBdO1xuXG4gICAgdGhpcy5zcGxvdC5jYW1lcmEueSA9XG4gICAgICB0aGlzLnNwbG90LnRyYW5zZm9ybS5zdGFydENhbWVyYS55ISArIHRoaXMuc3Bsb3QudHJhbnNmb3JtLnN0YXJ0UG9zWzFdIC0gcG9zWzFdO1xuXG4gICAgdGhpcy5zcGxvdC5yZW5kZXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDQoNC10LDQs9C40YDRg9C10YIg0L3QsCDQtNCy0LjQttC10L3QuNC1INC80YvRiNC4L9GC0YDQtdC60L/QsNC00LAg0LIg0LzQvtC80LXQvdGCLCDQutC+0LPQtNCwINC10LUv0LXQs9C+INC60LvQsNCy0LjRiNCwINGD0LTQtdGA0LbQuNCy0LDQtdGC0YHRjyDQvdCw0LbQsNGC0L7QuS5cbiAgICpcbiAgICogQHJlbWVya3NcbiAgICog0JzQtdGC0L7QtCDQv9C10YDQtdC80LXRidCw0LXRgiDQvtCx0LvQsNGB0YLRjCDQstC40LTQuNC80L7RgdGC0Lgg0L3QsCDQv9C70L7RgdC60L7RgdGC0Lgg0LLQvNC10YHRgtC1INGBINC00LLQuNC20LXQvdC40LXQvCDQvNGL0YjQuC/RgtGA0LXQutC/0LDQtNCwLiDQktGL0YfQuNGB0LvQtdC90LjRjyDQstC90YPRgtGA0Lgg0YHQvtCx0YvRgtC40Y8g0YHQtNC10LvQsNC90YtcbiAgICog0LzQsNC60YHQuNC80LDQu9GM0L3QviDQv9GA0L7QuNC30LLQvtC00LjRgtC10LvRjNC90YvQvNC4INCyINGD0YnQtdGA0LEg0YfQuNGC0LDQsdC10LvRjNC90L7RgdGC0Lgg0LvQvtCz0LjQutC4INC00LXQudGB0YLQstC40LkuINCS0L4g0LLQvdC10YjQvdC10Lwg0L7QsdGA0LDQsdC+0YLRh9C40LrQtSDRgdC+0LHRi9GC0LjQuSDQvtCx0YrQtdC60YIgdGhpc1xuICAgKiDQvdC10LTQvtGB0YLRg9C/0LXQvSDQv9C+0Y3RgtC+0LzRgyDQtNC+0YHRgtGD0L8g0Log0Y3QutC30LXQvNC/0LvRj9GA0YMg0LrQu9Cw0YHRgdCwINGA0LXQsNC70LjQt9GD0LXRgtGB0Y8g0YfQtdGA0LXQtyDRgdGC0LDRgtC40YfQtdGB0LrQuNC5INC80LDRgdGB0LjQsiDQstGB0LXRhSDRgdC+0LfQtNCw0L3QvdGL0YUg0Y3QutC30LXQvNC/0LvRj9GA0L7QslxuICAgKiDQutC70LDRgdGB0LAg0Lgg0LjQtNC10L3RgtC40YTQuNC60LDRgtC+0YDQsCDQutCw0L3QstCw0YHQsCwg0LLRi9GB0YLRg9C/0LDRjtGJ0LXQs9C+INC40L3QtNC10LrRgdC+0Lwg0LIg0Y3RgtC+0Lwg0LzQsNGB0YHQuNCy0LUuXG4gICAqXG4gICAqIEBwYXJhbSBldmVudCAtINCh0L7QsdGL0YLQuNC1INC80YvRiNC4L9GC0YDQtdC60L/QsNC00LAuXG4gICAqL1xuICBwcm90ZWN0ZWQgaGFuZGxlTW91c2VNb3ZlKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG4gICAgdGhpcy5tb3ZlQ2FtZXJhLmNhbGwodGhpcywgZXZlbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqINCg0LXQsNCz0LjRgNGD0LXRgiDQvdCwINC+0YLQttCw0YLQuNC1INC60LvQsNCy0LjRiNC4INC80YvRiNC4L9GC0YDQtdC60L/QsNC00LAuXG4gICAqXG4gICAqIEByZW1lcmtzXG4gICAqINCSINC80L7QvNC10L3RgiDQvtGC0LbQsNGC0LjRjyDQutC70LDQstC40YjQuCDQsNC90LDQu9C40Lcg0LTQstC40LbQtdC90LjRjyDQvNGL0YjQuC/RgtGA0LXQutC/0LDQtNCwINGBINC30LDQttCw0YLQvtC5INC60LvQsNCy0LjRiNC10Lkg0L/RgNC10LrRgNCw0YnQsNC10YLRgdGPLiDQktGL0YfQuNGB0LvQtdC90LjRjyDQstC90YPRgtGA0Lgg0YHQvtCx0YvRgtC40Y9cbiAgICog0YHQtNC10LvQsNC90Ysg0LzQsNC60YHQuNC80LDQu9GM0L3QviDQv9GA0L7QuNC30LLQvtC00LjRgtC10LvRjNC90YvQvNC4INCyINGD0YnQtdGA0LEg0YfQuNGC0LDQsdC10LvRjNC90L7RgdGC0Lgg0LvQvtCz0LjQutC4INC00LXQudGB0YLQstC40LkuINCS0L4g0LLQvdC10YjQvdC10Lwg0L7QsdGA0LDQsdC+0YLRh9C40LrQtSDRgdC+0LHRi9GC0LjQuSDQvtCx0YrQtdC60YJcbiAgICogdGhpcyDQvdC10LTQvtGB0YLRg9C/0LXQvSDQv9C+0Y3RgtC+0LzRgyDQtNC+0YHRgtGD0L8g0Log0Y3QutC30LXQvNC/0LvRj9GA0YMg0LrQu9Cw0YHRgdCwINGA0LXQsNC70LjQt9GD0LXRgtGB0Y8g0YfQtdGA0LXQtyDRgdGC0LDRgtC40YfQtdGB0LrQuNC5INC80LDRgdGB0LjQsiDQstGB0LXRhSDRgdC+0LfQtNCw0L3QvdGL0YUg0Y3QutC30LXQvNC/0LvRj9GA0L7QslxuICAgKiDQutC70LDRgdGB0LAg0Lgg0LjQtNC10L3RgtC40YTQuNC60LDRgtC+0YDQsCDQutCw0L3QstCw0YHQsCwg0LLRi9GB0YLRg9C/0LDRjtGJ0LXQs9C+INC40L3QtNC10LrRgdC+0Lwg0LIg0Y3RgtC+0Lwg0LzQsNGB0YHQuNCy0LUuXG4gICAqXG4gICAqIEBwYXJhbSBldmVudCAtINCh0L7QsdGL0YLQuNC1INC80YvRiNC4L9GC0YDQtdC60L/QsNC00LAuXG4gICAqL1xuICBwcm90ZWN0ZWQgaGFuZGxlTW91c2VVcChldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuICAgIHRoaXMuc3Bsb3QucmVuZGVyKCk7XG4gICAgZXZlbnQudGFyZ2V0IS5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLmhhbmRsZU1vdXNlTW92ZVdpdGhDb250ZXh0KTtcbiAgICBldmVudC50YXJnZXQhLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLmhhbmRsZU1vdXNlVXBXaXRoQ29udGV4dCk7XG4gIH1cblxuICAvKipcbiAgICog0KDQtdCw0LPQuNGA0YPQtdGCINC90LAg0L3QsNC20LDRgtC40LUg0LrQu9Cw0LLQuNGI0Lgg0LzRi9GI0Lgv0YLRgNC10LrQv9Cw0LTQsC5cbiAgICpcbiAgICogQHJlbWVya3NcbiAgICog0JIg0LzQvtC80LXQvdGCINC90LDQttCw0YLQuNGPINC4INGD0LTQtdGA0LbQsNC90LjRjyDQutC70LDQstC40YjQuCDQt9Cw0L/Rg9GB0LrQsNC10YLRgdGPINCw0L3QsNC70LjQtyDQtNCy0LjQttC10L3QuNGPINC80YvRiNC4L9GC0YDQtdC60L/QsNC00LAgKNGBINC30LDQttCw0YLQvtC5INC60LvQsNCy0LjRiNC10LkpLiDQktGL0YfQuNGB0LvQtdC90LjRj1xuICAgKiDQstC90YPRgtGA0Lgg0YHQvtCx0YvRgtC40Y8g0YHQtNC10LvQsNC90Ysg0LzQsNC60YHQuNC80LDQu9GM0L3QviDQv9GA0L7QuNC30LLQvtC00LjRgtC10LvRjNC90YvQvNC4INCyINGD0YnQtdGA0LEg0YfQuNGC0LDQsdC10LvRjNC90L7RgdGC0Lgg0LvQvtCz0LjQutC4INC00LXQudGB0YLQstC40LkuINCS0L4g0LLQvdC10YjQvdC10Lwg0L7QsdGA0LDQsdC+0YLRh9C40LrQtVxuICAgKiDRgdC+0LHRi9GC0LjQuSDQvtCx0YrQtdC60YIgdGhpcyDQvdC10LTQvtGB0YLRg9C/0LXQvSDQv9C+0Y3RgtC+0LzRgyDQtNC+0YHRgtGD0L8g0Log0Y3QutC30LXQvNC/0LvRj9GA0YMg0LrQu9Cw0YHRgdCwINGA0LXQsNC70LjQt9GD0LXRgtGB0Y8g0YfQtdGA0LXQtyDRgdGC0LDRgtC40YfQtdGB0LrQuNC5INC80LDRgdGB0LjQsiDQstGB0LXRhVxuICAgKiDRgdC+0LfQtNCw0L3QvdGL0YUg0Y3QutC30LXQvNC/0LvRj9GA0L7QsiDQutC70LDRgdGB0LAg0Lgg0LjQtNC10L3RgtC40YTQuNC60LDRgtC+0YDQsCDQutCw0L3QstCw0YHQsCwg0LLRi9GB0YLRg9C/0LDRjtGJ0LXQs9C+INC40L3QtNC10LrRgdC+0Lwg0LIg0Y3RgtC+0Lwg0LzQsNGB0YHQuNCy0LUuXG4gICAqXG4gICAqIEBwYXJhbSBldmVudCAtINCh0L7QsdGL0YLQuNC1INC80YvRiNC4L9GC0YDQtdC60L/QsNC00LAuXG4gICAqL1xuICBwcm90ZWN0ZWQgaGFuZGxlTW91c2VEb3duKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG5cbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRoaXMuc3Bsb3QuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMuaGFuZGxlTW91c2VNb3ZlV2l0aENvbnRleHQpO1xuICAgIHRoaXMuc3Bsb3QuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLmhhbmRsZU1vdXNlVXBXaXRoQ29udGV4dCk7XG5cbiAgICB0aGlzLnNwbG90LnRyYW5zZm9ybS5zdGFydEludlZpZXdQcm9qTWF0ID0gbTMuaW52ZXJzZSh0aGlzLnNwbG90LnRyYW5zZm9ybS52aWV3UHJvamVjdGlvbk1hdCk7XG4gICAgdGhpcy5zcGxvdC50cmFuc2Zvcm0uc3RhcnRDYW1lcmEgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnNwbG90LmNhbWVyYSk7XG4gICAgdGhpcy5zcGxvdC50cmFuc2Zvcm0uc3RhcnRDbGlwUG9zID0gdGhpcy5nZXRDbGlwU3BhY2VNb3VzZVBvc2l0aW9uLmNhbGwodGhpcywgZXZlbnQpO1xuICAgIHRoaXMuc3Bsb3QudHJhbnNmb3JtLnN0YXJ0UG9zID0gbTMudHJhbnNmb3JtUG9pbnQodGhpcy5zcGxvdC50cmFuc2Zvcm0uc3RhcnRJbnZWaWV3UHJvak1hdCwgdGhpcy5zcGxvdC50cmFuc2Zvcm0uc3RhcnRDbGlwUG9zKTtcbiAgICB0aGlzLnNwbG90LnRyYW5zZm9ybS5zdGFydE1vdXNlUG9zID0gW2V2ZW50LmNsaWVudFgsIGV2ZW50LmNsaWVudFldO1xuXG4gICAgdGhpcy5zcGxvdC5yZW5kZXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDQoNC10LDQs9C40YDRg9C10YIg0L3QsCDQt9GD0LzQuNGA0L7QstCw0L3QuNC1INC80YvRiNC4L9GC0YDQtdC60L/QsNC00LAuXG4gICAqXG4gICAqIEByZW1lcmtzXG4gICAqINCSINC80L7QvNC10L3RgiDQt9GD0LzQuNGA0L7QstCw0L3QuNGPINC80YvRiNC4L9GC0YDQtdC60L/QsNC00LAg0L/RgNC+0LjRgdGF0L7QtNC40YIg0LfRg9C80LjRgNC+0LLQsNC90LjQtSDQutC+0L7RgNC00LjQvdCw0YLQvdC+0Lkg0L/Qu9C+0YHQutC+0YHRgtC4LiDQktGL0YfQuNGB0LvQtdC90LjRjyDQstC90YPRgtGA0Lgg0YHQvtCx0YvRgtC40Y9cbiAgICog0YHQtNC10LvQsNC90Ysg0LzQsNC60YHQuNC80LDQu9GM0L3QviDQv9GA0L7QuNC30LLQvtC00LjRgtC10LvRjNC90YvQvNC4INCyINGD0YnQtdGA0LEg0YfQuNGC0LDQsdC10LvRjNC90L7RgdGC0Lgg0LvQvtCz0LjQutC4INC00LXQudGB0YLQstC40LkuINCS0L4g0LLQvdC10YjQvdC10Lwg0L7QsdGA0LDQsdC+0YLRh9C40LrQtSDRgdC+0LHRi9GC0LjQuSDQvtCx0YrQtdC60YJcbiAgICogdGhpcyDQvdC10LTQvtGB0YLRg9C/0LXQvSDQv9C+0Y3RgtC+0LzRgyDQtNC+0YHRgtGD0L8g0Log0Y3QutC30LXQvNC/0LvRj9GA0YMg0LrQu9Cw0YHRgdCwINGA0LXQsNC70LjQt9GD0LXRgtGB0Y8g0YfQtdGA0LXQtyDRgdGC0LDRgtC40YfQtdGB0LrQuNC5INC80LDRgdGB0LjQsiDQstGB0LXRhSDRgdC+0LfQtNCw0L3QvdGL0YUg0Y3QutC30LXQvNC/0LvRj9GA0L7QslxuICAgKiDQutC70LDRgdGB0LAg0Lgg0LjQtNC10L3RgtC40YTQuNC60LDRgtC+0YDQsCDQutCw0L3QstCw0YHQsCwg0LLRi9GB0YLRg9C/0LDRjtGJ0LXQs9C+INC40L3QtNC10LrRgdC+0Lwg0LIg0Y3RgtC+0Lwg0LzQsNGB0YHQuNCy0LUuXG4gICAqXG4gICAqIEBwYXJhbSBldmVudCAtINCh0L7QsdGL0YLQuNC1INC80YvRiNC4L9GC0YDQtdC60L/QsNC00LAuXG4gICAqL1xuICBwcm90ZWN0ZWQgaGFuZGxlTW91c2VXaGVlbChldmVudDogV2hlZWxFdmVudCk6IHZvaWQge1xuXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBjb25zdCBbY2xpcFgsIGNsaXBZXSA9IHRoaXMuZ2V0Q2xpcFNwYWNlTW91c2VQb3NpdGlvbi5jYWxsKHRoaXMsIGV2ZW50KTtcblxuICAgIC8vIHBvc2l0aW9uIGJlZm9yZSB6b29taW5nXG4gICAgY29uc3QgW3ByZVpvb21YLCBwcmVab29tWV0gPSBtMy50cmFuc2Zvcm1Qb2ludChtMy5pbnZlcnNlKHRoaXMuc3Bsb3QudHJhbnNmb3JtLnZpZXdQcm9qZWN0aW9uTWF0KSwgW2NsaXBYLCBjbGlwWV0pO1xuXG4gICAgLy8gbXVsdGlwbHkgdGhlIHdoZWVsIG1vdmVtZW50IGJ5IHRoZSBjdXJyZW50IHpvb20gbGV2ZWwsIHNvIHdlIHpvb20gbGVzcyB3aGVuIHpvb21lZCBpbiBhbmQgbW9yZSB3aGVuIHpvb21lZCBvdXRcbiAgICBjb25zdCBuZXdab29tID0gdGhpcy5zcGxvdC5jYW1lcmEuem9vbSEgKiBNYXRoLnBvdygyLCBldmVudC5kZWx0YVkgKiAtMC4wMSk7XG4gICAgdGhpcy5zcGxvdC5jYW1lcmEuem9vbSA9IE1hdGgubWF4KDAuMDAyLCBNYXRoLm1pbigyMDAsIG5ld1pvb20pKTtcblxuICAgIHRoaXMudXBkYXRlVmlld1Byb2plY3Rpb24uY2FsbCh0aGlzKTtcblxuICAgIC8vIHBvc2l0aW9uIGFmdGVyIHpvb21pbmdcbiAgICBjb25zdCBbcG9zdFpvb21YLCBwb3N0Wm9vbVldID0gbTMudHJhbnNmb3JtUG9pbnQobTMuaW52ZXJzZSh0aGlzLnNwbG90LnRyYW5zZm9ybS52aWV3UHJvamVjdGlvbk1hdCksIFtjbGlwWCwgY2xpcFldKTtcblxuICAgIC8vIGNhbWVyYSBuZWVkcyB0byBiZSBtb3ZlZCB0aGUgZGlmZmVyZW5jZSBvZiBiZWZvcmUgYW5kIGFmdGVyXG4gICAgdGhpcy5zcGxvdC5jYW1lcmEueCEgKz0gcHJlWm9vbVggLSBwb3N0Wm9vbVg7XG4gICAgdGhpcy5zcGxvdC5jYW1lcmEueSEgKz0gcHJlWm9vbVkgLSBwb3N0Wm9vbVk7XG5cbiAgICB0aGlzLnNwbG90LnJlbmRlcigpO1xuICB9XG59XG4iLCJpbXBvcnQgU1Bsb3QgZnJvbSAnLi9zcGxvdCdcbmltcG9ydCB7IGpzb25TdHJpbmdpZnksIGdldEN1cnJlbnRUaW1lIH0gZnJvbSAnLi91dGlscydcblxuLyoqXG4gKiDQotC40L8g0LTQu9GPINC/0LDRgNCw0LzQtdGC0YDQvtCyINGA0LXQttC40LzQsCDQvtGC0LvQsNC00LrQuC5cbiAqXG4gKiBAcGFyYW0gaXNFbmFibGUgLSDQn9GA0LjQt9C90LDQuiDQstC60LvRjtGH0LXQvdC40Y8g0L7RgtC70LDQtNC+0YfQvdC+0LPQviDRgNC10LbQuNC80LAuXG4gKiBAcGFyYW0gb3V0cHV0IC0g0JzQtdGB0YLQviDQstGL0LLQvtC00LAg0L7RgtC70LDQtNC+0YfQvdC+0Lkg0LjQvdGE0L7RgNC80LDRhtC40LguXG4gKiBAcGFyYW0gaGVhZGVyU3R5bGUgLSDQodGC0LjQu9GMINC00LvRjyDQt9Cw0LPQvtC70L7QstC60LAg0LLRgdC10LPQviDQvtGC0LvQsNC00L7Rh9C90L7Qs9C+INCx0LvQvtC60LAuXG4gKiBAcGFyYW0gZ3JvdXBTdHlsZSAtINCh0YLQuNC70Ywg0LTQu9GPINC30LDQs9C+0LvQvtCy0LrQsCDQs9GA0YPQv9C/0LjRgNC+0LLQutC4INC+0YLQu9Cw0LTQvtGH0L3Ri9GFINC00LDQvdC90YvRhS5cbiAqXG4gKiBAdG9kbyDQoNC10LDQu9C40LfQvtCy0LDRgtGMINC00L7Qv9C+0LvQvdC40YLQtdC70YzQvdGL0LUg0LzQtdGB0YLQsCDQstGL0LLQvtC00LAgb3V0cHV0OiAnY29uc29sZScgfCAnZG9jdW1lbnQnIHwgJ2ZpbGUnXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNQbG90RGVidWcge1xuXG4gIHB1YmxpYyBpc0VuYWJsZTogYm9vbGVhbiA9IGZhbHNlXG4gIHB1YmxpYyBoZWFkZXJTdHlsZTogc3RyaW5nID0gJ2ZvbnQtd2VpZ2h0OiBib2xkOyBjb2xvcjogI2ZmZmZmZjsgYmFja2dyb3VuZC1jb2xvcjogI2NjMDAwMDsnXG4gIHB1YmxpYyBncm91cFN0eWxlOiBzdHJpbmcgPSAnZm9udC13ZWlnaHQ6IGJvbGQ7IGNvbG9yOiAjZmZmZmZmOydcblxuICBwcml2YXRlIHNwbG90OiBTUGxvdFxuXG4gIGNvbnN0cnVjdG9yIChzcGxvdDogU1Bsb3QpIHtcbiAgICB0aGlzLnNwbG90ID0gc3Bsb3RcbiAgfVxuXG4gIHB1YmxpYyBsb2dJbnRybyhjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50KTogdm9pZCB7XG4gICAgY29uc29sZS5sb2coJyVj0J7RgtC70LDQtNC60LAgU1Bsb3Qg0L3QsCDQvtCx0YrQtdC60YLQtSAjJyArIGNhbnZhcy5pZCwgdGhpcy5oZWFkZXJTdHlsZSlcblxuICAgIGlmICh0aGlzLnNwbG90LmRlbW8uaXNFbmFibGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKCclY9CS0LrQu9GO0YfQtdC9INC00LXQvNC+0L3RgdGC0YDQsNGG0LjQvtC90L3Ri9C5INGA0LXQttC40Lwg0LTQsNC90L3Ri9GFJywgdGhpcy5ncm91cFN0eWxlKVxuICAgIH1cblxuICAgIGNvbnNvbGUuZ3JvdXAoJyVj0J/RgNC10LTRg9C/0YDQtdC20LTQtdC90LjQtScsIHRoaXMuc3Bsb3QuZGVidWcuZ3JvdXBTdHlsZSlcbiAgICBjb25zb2xlLmxvZygn0J7RgtC60YDRi9GC0LDRjyDQutC+0L3RgdC+0LvRjCDQsdGA0LDRg9C30LXRgNCwINC4INC00YDRg9Cz0LjQtSDQsNC60YLQuNCy0L3Ri9C1INGB0YDQtdC00YHRgtCy0LAg0LrQvtC90YLRgNC+0LvRjyDRgNCw0LfRgNCw0LHQvtGC0LrQuCDRgdGD0YnQtdGB0YLQstC10L3QvdC+INGB0L3QuNC20LDRjtGCINC/0YDQvtC40LfQstC+0LTQuNGC0LXQu9GM0L3QvtGB0YLRjCDQstGL0YHQvtC60L7QvdCw0LPRgNGD0LbQtdC90L3Ri9GFINC/0YDQuNC70L7QttC10L3QuNC5LiDQlNC70Y8g0L7QsdGK0LXQutGC0LjQstC90L7Qs9C+INCw0L3QsNC70LjQt9CwINC/0YDQvtC40LfQstC+0LTQuNGC0LXQu9GM0L3QvtGB0YLQuCDQstGB0LUg0L/QvtC00L7QsdC90YvQtSDRgdGA0LXQtNGB0YLQstCwINC00L7Qu9C20L3RiyDQsdGL0YLRjCDQvtGC0LrQu9GO0YfQtdC90YssINCwINC60L7QvdGB0L7Qu9GMINCx0YDQsNGD0LfQtdGA0LAg0LfQsNC60YDRi9GC0LAuINCd0LXQutC+0YLQvtGA0YvQtSDQtNCw0L3QvdGL0LUg0L7RgtC70LDQtNC+0YfQvdC+0Lkg0LjQvdGE0L7RgNC80LDRhtC40Lgg0LIg0LfQsNCy0LjRgdC40LzQvtGB0YLQuCDQvtGCINC40YHQv9C+0LvRjNC30YPQtdC80L7Qs9C+INCx0YDQsNGD0LfQtdGA0LAg0LzQvtCz0YPRgiDQvdC1INC+0YLQvtCx0YDQsNC20LDRgtGM0YHRjyDQuNC70Lgg0L7RgtC+0LHRgNCw0LbQsNGC0YzRgdGPINC90LXQutC+0YDRgNC10LrRgtC90L4uINCh0YDQtdC00YHRgtCy0L4g0L7RgtC70LDQtNC60Lgg0L/RgNC+0YLQtdGB0YLQuNGA0L7QstCw0L3QviDQsiDQsdGA0LDRg9C30LXRgNC1IEdvb2dsZSBDaHJvbWUgdi45MCcpXG4gICAgY29uc29sZS5ncm91cEVuZCgpXG4gIH1cblxuICBwdWJsaWMgbG9nR3B1SW5mbyhnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0KTogdm9pZCB7XG4gICAgY29uc29sZS5ncm91cCgnJWPQktC40LTQtdC+0YHQuNGB0YLQtdC80LAnLCB0aGlzLmdyb3VwU3R5bGUpXG4gICAgbGV0IGV4dCA9IGdsLmdldEV4dGVuc2lvbignV0VCR0xfZGVidWdfcmVuZGVyZXJfaW5mbycpXG4gICAgbGV0IGdyYXBoaWNzQ2FyZE5hbWUgPSAoZXh0KSA/IGdsLmdldFBhcmFtZXRlcihleHQuVU5NQVNLRURfUkVOREVSRVJfV0VCR0wpIDogJ1vQvdC10LjQt9Cy0LXRgdGC0L3Qvl0nXG4gICAgY29uc29sZS5sb2coJ9CT0YDQsNGE0LjRh9C10YHQutCw0Y8g0LrQsNGA0YLQsDogJyArIGdyYXBoaWNzQ2FyZE5hbWUpXG4gICAgY29uc29sZS5sb2coJ9CS0LXRgNGB0LjRjyBHTDogJyArIGdsLmdldFBhcmFtZXRlcihnbC5WRVJTSU9OKSlcbiAgICBjb25zb2xlLmdyb3VwRW5kKClcbiAgfVxuXG4gIHB1YmxpYyBsb2dJbnN0YW5jZUluZm8oY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCwgb3B0aW9uczogU1Bsb3RPcHRpb25zKTogdm9pZCB7XG4gICAgY29uc29sZS5ncm91cCgnJWPQndCw0YHRgtGA0L7QudC60LAg0L/QsNGA0LDQvNC10YLRgNC+0LIg0Y3QutC30LXQvNC/0LvRj9GA0LAnLCB0aGlzLmdyb3VwU3R5bGUpXG4gICAge1xuICAgICAgY29uc29sZS5kaXIodGhpcylcbiAgICAgIGNvbnNvbGUubG9nKCfQn9C+0LvRjNC30L7QstCw0YLQtdC70YzRgdC60LjQtSDQvdCw0YHRgtGA0L7QudC60Lg6XFxuJywganNvblN0cmluZ2lmeShvcHRpb25zKSlcbiAgICAgIGNvbnNvbGUubG9nKCfQmtCw0L3QstCw0YE6ICMnICsgY2FudmFzLmlkKVxuICAgICAgY29uc29sZS5sb2coJ9Cg0LDQt9C80LXRgCDQutCw0L3QstCw0YHQsDogJyArIGNhbnZhcy53aWR0aCArICcgeCAnICsgY2FudmFzLmhlaWdodCArICcgcHgnKVxuICAgICAgY29uc29sZS5sb2coJ9Cg0LDQt9C80LXRgCDQv9C70L7RgdC60L7RgdGC0Lg6ICcgKyB0aGlzLnNwbG90LmdyaWQud2lkdGggKyAnIHggJyArIHRoaXMuc3Bsb3QuZ3JpZC5oZWlnaHQgKyAnIHB4JylcblxuICAgICAgaWYgKHRoaXMuc3Bsb3QuZGVtby5pc0VuYWJsZSkge1xuICAgICAgICBjb25zb2xlLmxvZygn0KHQv9C+0YHQvtCxINC/0L7Qu9GD0YfQtdC90LjRjyDQtNCw0L3QvdGL0YU6ICcgKyAn0LTQtdC80L4t0LTQsNC90L3Ri9C1JylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCfQodC/0L7RgdC+0LEg0L/QvtC70YPRh9C10L3QuNGPINC00LDQvdC90YvRhTogJyArICfQuNGC0LXRgNC40YDQvtCy0LDQvdC40LUnKVxuICAgICAgfVxuICAgIH1cbiAgICBjb25zb2xlLmdyb3VwRW5kKClcbiAgfVxuXG4gIHB1YmxpYyBsb2dTaGFkZXJJbmZvKHNoYWRlclR5cGU6IHN0cmluZywgc2hhZGVyQ29kZTogc3RyaW5nLCApOiB2b2lkIHtcbiAgICBjb25zb2xlLmdyb3VwKCclY9Ch0L7Qt9C00LDQvSDRiNC10LnQtNC10YAgWycgKyBzaGFkZXJUeXBlICsgJ10nLCB0aGlzLmdyb3VwU3R5bGUpXG4gICAgY29uc29sZS5sb2coc2hhZGVyQ29kZSlcbiAgICBjb25zb2xlLmdyb3VwRW5kKClcbiAgfVxuXG4gIHB1YmxpYyBsb2dEYXRhTG9hZGluZ1N0YXJ0KCk6IHZvaWQge1xuICAgIGNvbnNvbGUubG9nKCclY9CX0LDQv9GD0YnQtdC9INC/0YDQvtGG0LXRgdGBINC30LDQs9GA0YPQt9C60Lgg0LTQsNC90L3Ri9GFIFsnICsgZ2V0Q3VycmVudFRpbWUoKSArICddLi4uJywgdGhpcy5ncm91cFN0eWxlKVxuICAgIGNvbnNvbGUudGltZSgn0JTQu9C40YLQtdC70YzQvdC+0YHRgtGMJylcbiAgfVxuXG4gIHB1YmxpYyBsb2dEYXRhTG9hZGluZ0NvbXBsZXRlKGFtb3VudDogbnVtYmVyLCBtYXhBbW91bnQ6IG51bWJlcik6IHZvaWQge1xuICAgIGNvbnNvbGUuZ3JvdXAoJyVj0JfQsNCz0YDRg9C30LrQsCDQtNCw0L3QvdGL0YUg0LfQsNCy0LXRgNGI0LXQvdCwIFsnICsgZ2V0Q3VycmVudFRpbWUoKSArICddJywgdGhpcy5ncm91cFN0eWxlKVxuICAgIGNvbnNvbGUudGltZUVuZCgn0JTQu9C40YLQtdC70YzQvdC+0YHRgtGMJylcbiAgICBjb25zb2xlLmxvZygn0KDQtdC30YPQu9GM0YLQsNGCOiAnICtcbiAgICAgICgoYW1vdW50ID49IG1heEFtb3VudCkgP1xuICAgICAgJ9C00L7RgdGC0LjQs9C90YPRgiDQt9Cw0LTQsNC90L3Ri9C5INC70LjQvNC40YIgKCcgKyBtYXhBbW91bnQudG9Mb2NhbGVTdHJpbmcoKSArICcpJyA6XG4gICAgICAn0L7QsdGA0LDQsdC+0YLQsNC90Ysg0LLRgdC1INC+0LHRitC10LrRgtGLJykpXG4gICAgY29uc29sZS5ncm91cEVuZCgpXG4gIH1cblxuICBwdWJsaWMgbG9nT2JqZWN0U3RhdHMoYnVmZmVyczogU1Bsb3RCdWZmZXJzLCBhbW91bnRPZlBvbHlnb25zOiBudW1iZXIpOiB2b2lkIHtcbiAgICBjb25zb2xlLmdyb3VwKCclY9Ca0L7Quy3QstC+INC+0LHRitC10LrRgtC+0LI6ICcgKyBhbW91bnRPZlBvbHlnb25zLnRvTG9jYWxlU3RyaW5nKCksIHRoaXMuZ3JvdXBTdHlsZSlcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zcGxvdC5zaGFwZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHNoYXBlQ2FwY3Rpb24gPSB0aGlzLnNwbG90LnNoYXBlc1tpXS5uYW1lXG4gICAgICBjb25zdCBzaGFwZUFtb3VudCA9IGJ1ZmZlcnMuYW1vdW50T2ZTaGFwZXNbaV1cbiAgICAgIGNvbnNvbGUubG9nKHNoYXBlQ2FwY3Rpb24gKyAnOiAnICsgc2hhcGVBbW91bnQudG9Mb2NhbGVTdHJpbmcoKSArXG4gICAgICAgICcgW34nICsgTWF0aC5yb3VuZCgxMDAgKiBzaGFwZUFtb3VudCAvIGFtb3VudE9mUG9seWdvbnMpICsgJyVdJylcbiAgICB9XG5cbiAgICBjb25zb2xlLmxvZygn0JrQvtC7LdCy0L4g0YbQstC10YLQvtCyINCyINC/0LDQu9C40YLRgNC1OiAnICsgdGhpcy5zcGxvdC5jb2xvcnMubGVuZ3RoKVxuICAgIGNvbnNvbGUuZ3JvdXBFbmQoKVxuICB9XG5cbiAgcHVibGljIGxvZ0dwdU1lbVN0YXRzKGJ1ZmZlcnM6IFNQbG90QnVmZmVycyk6IHZvaWQge1xuICAgIGxldCBieXRlc1VzZWRCeUJ1ZmZlcnMgPSBidWZmZXJzLnNpemVJbkJ5dGVzWzBdICsgYnVmZmVycy5zaXplSW5CeXRlc1sxXSArIGJ1ZmZlcnMuc2l6ZUluQnl0ZXNbM11cblxuICAgIGNvbnNvbGUuZ3JvdXAoJyVj0KDQsNGB0YXQvtC0INCy0LjQtNC10L7Qv9Cw0LzRj9GC0Lg6ICcgKyAoYnl0ZXNVc2VkQnlCdWZmZXJzIC8gMTAwMDAwMCkudG9GaXhlZCgyKS50b0xvY2FsZVN0cmluZygpICsgJyDQnNCRJywgdGhpcy5ncm91cFN0eWxlKVxuXG4gICAgY29uc29sZS5sb2coJ9CR0YPRhNC10YDRiyDQstC10YDRiNC40L06ICcgK1xuICAgICAgKGJ1ZmZlcnMuc2l6ZUluQnl0ZXNbMF0gLyAxMDAwMDAwKS50b0ZpeGVkKDIpLnRvTG9jYWxlU3RyaW5nKCkgKyAnINCc0JEnICtcbiAgICAgICcgW34nICsgTWF0aC5yb3VuZCgxMDAgKiBidWZmZXJzLnNpemVJbkJ5dGVzWzBdIC8gYnl0ZXNVc2VkQnlCdWZmZXJzKSArICclXScpXG5cbiAgICBjb25zb2xlLmxvZygn0JHRg9GE0LXRgNGLINGG0LLQtdGC0L7QsjogJ1xuICAgICAgKyAoYnVmZmVycy5zaXplSW5CeXRlc1sxXSAvIDEwMDAwMDApLnRvRml4ZWQoMikudG9Mb2NhbGVTdHJpbmcoKSArICcg0JzQkScgK1xuICAgICAgJyBbficgKyBNYXRoLnJvdW5kKDEwMCAqIGJ1ZmZlcnMuc2l6ZUluQnl0ZXNbMV0gLyBieXRlc1VzZWRCeUJ1ZmZlcnMpICsgJyVdJylcblxuICAgIGNvbnNvbGUubG9nKCfQkdGD0YTQtdGA0Ysg0YDQsNC30LzQtdGA0L7QsjogJ1xuICAgICAgKyAoYnVmZmVycy5zaXplSW5CeXRlc1szXSAvIDEwMDAwMDApLnRvRml4ZWQoMikudG9Mb2NhbGVTdHJpbmcoKSArICcg0JzQkScgK1xuICAgICAgJyBbficgKyBNYXRoLnJvdW5kKDEwMCAqIGJ1ZmZlcnMuc2l6ZUluQnl0ZXNbMl0gLyBieXRlc1VzZWRCeUJ1ZmZlcnMpICsgJyVdJylcblxuICAgIGNvbnNvbGUubG9nKCfQmtC+0Lst0LLQviDQs9GA0YPQv9C/INCx0YPRhNC10YDQvtCyOiAnICsgYnVmZmVycy5hbW91bnRPZkJ1ZmZlckdyb3Vwcy50b0xvY2FsZVN0cmluZygpKVxuICAgIGNvbnNvbGUubG9nKCfQmtC+0Lst0LLQviBHTC3RgtGA0LXRg9Cz0L7Qu9GM0L3QuNC60L7QsjogJyArIChidWZmZXJzLmFtb3VudE9mVG90YWxHTFZlcnRpY2VzIC8gMykudG9Mb2NhbGVTdHJpbmcoKSlcbiAgICBjb25zb2xlLmxvZygn0JrQvtC7LdCy0L4g0LLQtdGA0YjQuNC9OiAnICsgYnVmZmVycy5hbW91bnRPZlRvdGFsVmVydGljZXMudG9Mb2NhbGVTdHJpbmcoKSlcblxuICAgIGNvbnNvbGUuZ3JvdXBFbmQoKVxuICB9XG5cbiAgcHVibGljIGxvZ1JlbmRlclN0YXJ0ZWQoKSB7XG4gICAgY29uc29sZS5sb2coJyVj0KDQtdC90LTQtdGA0LjQvdCzINC30LDQv9GD0YnQtdC9JywgdGhpcy5zcGxvdC5kZWJ1Zy5ncm91cFN0eWxlKVxuICB9XG5cbiAgcHVibGljIGxvZ1JlbmRlclN0b3BlZCgpIHtcbiAgICBjb25zb2xlLmxvZygnJWPQoNC10L3QtNC10YDQuNC90LMg0L7RgdGC0LDQvdC+0LLQu9C10L0nLCB0aGlzLnNwbG90LmRlYnVnLmdyb3VwU3R5bGUpXG4gIH1cblxuICBwdWJsaWMgbG9nQ2FudmFzQ2xlYXJlZCgpIHtcbiAgICBjb25zb2xlLmxvZygnJWPQmtC+0L3RgtC10LrRgdGCINGA0LXQvdC00LXRgNC40L3Qs9CwINC+0YfQuNGJ0LXQvSBbJyArIHRoaXMuc3Bsb3QuZ3JpZC5iZ0NvbG9yICsgJ10nLCB0aGlzLnNwbG90LmRlYnVnLmdyb3VwU3R5bGUpO1xuICB9XG59XG4iLCJpbXBvcnQgeyByYW5kb21JbnQsIHJhbmRvbVF1b3RhSW5kZXggfSBmcm9tICcuL3V0aWxzJ1xuaW1wb3J0IFNQbG90IGZyb20gJy4vc3Bsb3QnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNQbG90RGVtbyB7XG5cbiAgcHVibGljIGlzRW5hYmxlOiBib29sZWFuID0gZmFsc2VcbiAgcHVibGljIGFtb3VudDogbnVtYmVyID0gMV8wMDBfMDAwXG4gIHB1YmxpYyBzaGFwZVF1b3RhOiBudW1iZXJbXSA9IFtdXG5cbiAgcHJpdmF0ZSBpbmRleDogbnVtYmVyID0gMFxuICBwcml2YXRlIHNwbG90OiBTUGxvdFxuXG4gIGNvbnN0cnVjdG9yKHNwbG90OiBTUGxvdCkge1xuICAgIHRoaXMuc3Bsb3QgPSBzcGxvdFxuICAgIHRoaXMuaW5pdCgpXG4gIH1cblxuICBwdWJsaWMgaW5pdCgpIHtcbiAgICB0aGlzLmluZGV4ID0gMFxuICB9XG5cbiAgLyoqXG4gICAqINCY0LzQuNGC0LjRgNGD0LXRgiDQuNGC0LXRgNC40YDQvtCy0LDQvdC40LUg0LjRgdGF0L7QtNC90YvRhSDQvtCx0YrQtdC60YLQvtCyLlxuICAgKlxuICAgKiBAcmV0dXJucyDQmNC90YTQvtGA0LzQsNGG0LjRjyDQviDQv9C+0LvQuNCz0L7QvdC1INC40LvQuCBudWxsLCDQtdGB0LvQuCDQuNGC0LXRgNC40YDQvtCy0LDQvdC40LUg0LfQsNCy0LXRgNGI0LjQu9C+0YHRjC5cbiAgICovXG4gIHB1YmxpYyBkZW1vSXRlcmF0aW9uQ2FsbGJhY2soKTogU1Bsb3RQb2x5Z29uIHwgbnVsbCB7XG4gICAgaWYgKHRoaXMuaW5kZXghIDwgdGhpcy5hbW91bnQhKSB7XG4gICAgICB0aGlzLmluZGV4ISArKztcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHg6IHJhbmRvbUludCh0aGlzLnNwbG90LmdyaWQud2lkdGghKSxcbiAgICAgICAgeTogcmFuZG9tSW50KHRoaXMuc3Bsb3QuZ3JpZC5oZWlnaHQhKSxcbiAgICAgICAgc2hhcGU6IHJhbmRvbVF1b3RhSW5kZXgodGhpcy5zaGFwZVF1b3RhISksXG4gICAgICAgIHNpemU6IDEwICsgcmFuZG9tSW50KDIxKSxcbiAgICAgICAgY29sb3I6IHJhbmRvbUludCh0aGlzLnNwbG90LmNvbG9ycy5sZW5ndGgpXG4gICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdGhpcy5pbmRleCA9IDBcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgU1Bsb3QgZnJvbSAnLi9zcGxvdCdcbmltcG9ydCB7IGNvbG9yRnJvbUhleFRvR2xSZ2IgfSBmcm9tICcuL3V0aWxzJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTUGxvdFdlYkdsIHtcblxuICBwdWJsaWMgd2ViR2xTZXR0aW5nczogV2ViR0xDb250ZXh0QXR0cmlidXRlcyA9IHtcbiAgICBhbHBoYTogZmFsc2UsXG4gICAgZGVwdGg6IGZhbHNlLFxuICAgIHN0ZW5jaWw6IGZhbHNlLFxuICAgIGFudGlhbGlhczogZmFsc2UsXG4gICAgcHJlbXVsdGlwbGllZEFscGhhOiBmYWxzZSxcbiAgICBwcmVzZXJ2ZURyYXdpbmdCdWZmZXI6IGZhbHNlLFxuICAgIHBvd2VyUHJlZmVyZW5jZTogJ2hpZ2gtcGVyZm9ybWFuY2UnLFxuICAgIGZhaWxJZk1ham9yUGVyZm9ybWFuY2VDYXZlYXQ6IGZhbHNlLFxuICAgIGRlc3luY2hyb25pemVkOiBmYWxzZVxuICB9XG5cbiAgcHJpdmF0ZSBzcGxvdDogU1Bsb3RcblxuICBjb25zdHJ1Y3RvcihzcGxvdDogU1Bsb3QpIHtcbiAgICB0aGlzLnNwbG90ID0gc3Bsb3RcbiAgfVxuXG4gIC8qKlxuICAgKiDQodC+0LfQtNCw0LXRgiDQutC+0L3RgtC10LrRgdGCINGA0LXQvdC00LXRgNC40L3Qs9CwIFdlYkdMINC4INGD0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdGCINC60L7RgNGA0LXQutGC0L3Ri9C5INGA0LDQt9C80LXRgCDQvtCx0LvQsNGB0YLQuCDQv9GA0L7RgdC80L7RgtGA0LAuXG4gICAqL1xuICBwdWJsaWMgY3JlYXRlKCk6IHZvaWQge1xuXG4gICAgdGhpcy5zcGxvdC5nbCA9IHRoaXMuc3Bsb3QuY2FudmFzLmdldENvbnRleHQoJ3dlYmdsJywgdGhpcy53ZWJHbFNldHRpbmdzKSFcblxuICAgIHRoaXMuc3Bsb3QuY2FudmFzLndpZHRoID0gdGhpcy5zcGxvdC5jYW52YXMuY2xpZW50V2lkdGhcbiAgICB0aGlzLnNwbG90LmNhbnZhcy5oZWlnaHQgPSB0aGlzLnNwbG90LmNhbnZhcy5jbGllbnRIZWlnaHRcblxuICAgIHRoaXMuc3Bsb3QuZ2wudmlld3BvcnQoMCwgMCwgdGhpcy5zcGxvdC5jYW52YXMud2lkdGgsIHRoaXMuc3Bsb3QuY2FudmFzLmhlaWdodClcbiAgfVxuXG4gIHB1YmxpYyBzZXRCZ0NvbG9yKGNvbG9yOiBzdHJpbmcpIHtcbiAgICBsZXQgW3IsIGcsIGJdID0gY29sb3JGcm9tSGV4VG9HbFJnYihjb2xvcilcbiAgICB0aGlzLnNwbG90LmdsLmNsZWFyQ29sb3IociwgZywgYiwgMC4wKVxuICB9XG5cbiAgcHVibGljIGNsZWFyQmFja2dyb3VuZCgpIHtcbiAgICB0aGlzLnNwbG90LmdsLmNsZWFyKHRoaXMuc3Bsb3QuZ2wuQ09MT1JfQlVGRkVSX0JJVCk7XG4gIH1cblxuICAvKipcbiAgICog0KHQvtC30LTQsNC10YIg0YjQtdC50LTQtdGAIFdlYkdMLlxuICAgKlxuICAgKiBAcGFyYW0gc2hhZGVyVHlwZSDQotC40L8g0YjQtdC50LTQtdGA0LAuXG4gICAqIEBwYXJhbSBzaGFkZXJDb2RlINCa0L7QtCDRiNC10LnQtNC10YDQsCDQvdCwINGP0LfRi9C60LUgR0xTTC5cbiAgICogQHJldHVybnMg0KHQvtC30LTQsNC90L3Ri9C5INC+0LHRitC10LrRgiDRiNC10LnQtNC10YDQsC5cbiAgICovXG4gIHB1YmxpYyBjcmVhdGVTaGFkZXIoc2hhZGVyVHlwZTogV2ViR2xTaGFkZXJUeXBlLCBzaGFkZXJDb2RlOiBzdHJpbmcpOiBXZWJHTFNoYWRlciB7XG5cbiAgICAvLyDQodC+0LfQtNCw0L3QuNC1LCDQv9GA0LjQstGP0LfQutCwINC60L7QtNCwINC4INC60L7QvNC/0LjQu9GP0YbQuNGPINGI0LXQudC00LXRgNCwLlxuICAgIGNvbnN0IHNoYWRlciA9IHRoaXMuc3Bsb3QuZ2wuY3JlYXRlU2hhZGVyKHRoaXMuc3Bsb3QuZ2xbc2hhZGVyVHlwZV0pIVxuICAgIHRoaXMuc3Bsb3QuZ2wuc2hhZGVyU291cmNlKHNoYWRlciwgc2hhZGVyQ29kZSlcbiAgICB0aGlzLnNwbG90LmdsLmNvbXBpbGVTaGFkZXIoc2hhZGVyKVxuXG4gICAgaWYgKCF0aGlzLnNwbG90LmdsLmdldFNoYWRlclBhcmFtZXRlcihzaGFkZXIsIHRoaXMuc3Bsb3QuZ2wuQ09NUElMRV9TVEFUVVMpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ9Ce0YjQuNCx0LrQsCDQutC+0LzQv9C40LvRj9GG0LjQuCDRiNC10LnQtNC10YDQsCBbJyArIHNoYWRlclR5cGUgKyAnXS4gJyArIHRoaXMuc3Bsb3QuZ2wuZ2V0U2hhZGVySW5mb0xvZyhzaGFkZXIpKVxuICAgIH1cblxuICAgIHJldHVybiBzaGFkZXJcbiAgfVxuXG4gIC8qKlxuICAgKiDQodC+0LfQtNCw0LXRgiDQv9GA0L7Qs9GA0LDQvNC80YMgV2ViR0wuXG4gICAqXG4gICAqIEBwYXJhbSB7V2ViR0xTaGFkZXJ9IHZlcnRleFNoYWRlciDQktC10YDRiNC40L3QvdGL0Lkg0YjQtdC50LTQtdGALlxuICAgKiBAcGFyYW0ge1dlYkdMU2hhZGVyfSBmcmFnbWVudFNoYWRlciDQpNGA0LDQs9C80LXQvdGC0L3Ri9C5INGI0LXQudC00LXRgC5cbiAgICovXG4gIHB1YmxpYyBjcmVhdGVQcm9ncmFtKHNoYWRlclZlcnQ6IFdlYkdMU2hhZGVyLCBzaGFkZXJGcmFnOiBXZWJHTFNoYWRlcikge1xuICAgIHRoaXMuc3Bsb3QuZ3B1UHJvZ3JhbSA9IHRoaXMuc3Bsb3QuZ2wuY3JlYXRlUHJvZ3JhbSgpIVxuICAgIHRoaXMuc3Bsb3QuZ2wuYXR0YWNoU2hhZGVyKHRoaXMuc3Bsb3QuZ3B1UHJvZ3JhbSwgc2hhZGVyVmVydClcbiAgICB0aGlzLnNwbG90LmdsLmF0dGFjaFNoYWRlcih0aGlzLnNwbG90LmdwdVByb2dyYW0sIHNoYWRlckZyYWcpXG4gICAgdGhpcy5zcGxvdC5nbC5saW5rUHJvZ3JhbSh0aGlzLnNwbG90LmdwdVByb2dyYW0pXG4gICAgdGhpcy5zcGxvdC5nbC51c2VQcm9ncmFtKHRoaXMuc3Bsb3QuZ3B1UHJvZ3JhbSlcbiAgfVxuXG4gIC8qKlxuICAgKiDQo9GB0YLQsNC90LDQstC70LjQstCw0LXRgiDRgdCy0Y/Qt9GMINC/0LXRgNC10LzQtdC90L3QvtC5INC/0YDQuNC70L7QttC10L3QuNGPINGBINC/0YDQvtCz0YDQsNC80LzQvtC5IFdlYkdsLlxuICAgKlxuICAgKiBAcGFyYW0gdmFyVHlwZSDQotC40L8g0L/QtdGA0LXQvNC10L3QvdC+0LkuXG4gICAqIEBwYXJhbSB2YXJOYW1lINCY0LzRjyDQv9C10YDQtdC80LXQvdC90L7QuS5cbiAgICovXG4gIHB1YmxpYyBjcmVhdGVWYXJpYWJsZSh2YXJUeXBlOiBXZWJHbFZhcmlhYmxlVHlwZSwgdmFyTmFtZTogc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKHZhclR5cGUgPT09ICd1bmlmb3JtJykge1xuICAgICAgdGhpcy5zcGxvdC52YXJpYWJsZXNbdmFyTmFtZV0gPSB0aGlzLnNwbG90LmdsLmdldFVuaWZvcm1Mb2NhdGlvbih0aGlzLnNwbG90LmdwdVByb2dyYW0sIHZhck5hbWUpXG4gICAgfSBlbHNlIGlmICh2YXJUeXBlID09PSAnYXR0cmlidXRlJykge1xuICAgICAgdGhpcy5zcGxvdC52YXJpYWJsZXNbdmFyTmFtZV0gPSB0aGlzLnNwbG90LmdsLmdldEF0dHJpYkxvY2F0aW9uKHRoaXMuc3Bsb3QuZ3B1UHJvZ3JhbSwgdmFyTmFtZSlcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICog0KHQvtC30LTQsNC10YIg0LIg0LzQsNGB0YHQuNCy0LUg0LHRg9GE0LXRgNC+0LIgV2ViR0wg0L3QvtCy0YvQuSDQsdGD0YTQtdGAINC4INC30LDQv9C40YHRi9Cy0LDQtdGCINCyINC90LXQs9C+INC/0LXRgNC10LTQsNC90L3Ri9C1INC00LDQvdC90YvQtS5cbiAgICpcbiAgICogQHBhcmFtIGJ1ZmZlcnMgLSDQnNCw0YHRgdC40LIg0LHRg9GE0LXRgNC+0LIgV2ViR0wsINCyINC60L7RgtC+0YDRi9C5INCx0YPQtNC10YIg0LTQvtCx0LDQstC70LXQvSDRgdC+0LfQtNCw0LLQsNC10LzRi9C5INCx0YPRhNC10YAuXG4gICAqIEBwYXJhbSB0eXBlIC0g0KLQuNC/INGB0L7Qt9C00LDQstCw0LXQvNC+0LPQviDQsdGD0YTQtdGA0LAuXG4gICAqIEBwYXJhbSBkYXRhIC0g0JTQsNC90L3Ri9C1INCyINCy0LjQtNC1INGC0LjQv9C40LfQuNGA0L7QstCw0L3QvdC+0LPQviDQvNCw0YHRgdC40LLQsCDQtNC70Y8g0LfQsNC/0LjRgdC4INCyINGB0L7Qt9C00LDQstCw0LXQvNGL0Lkg0LHRg9GE0LXRgC5cbiAgICogQHBhcmFtIGtleSAtINCa0LvRjtGHICjQuNC90LTQtdC60YEpLCDQuNC00LXQvdGC0LjRhNC40YbQuNGA0YPRjtGJ0LjQuSDRgtC40L8g0LHRg9GE0LXRgNCwICjQtNC70Y8g0LLQtdGA0YjQuNC9LCDQtNC70Y8g0YbQstC10YLQvtCyLCDQtNC70Y8g0LjQvdC00LXQutGB0L7QsikuINCY0YHQv9C+0LvRjNC30YPQtdGC0YHRjyDQtNC70Y9cbiAgICogICAgINGA0LDQt9C00LXQu9GM0L3QvtCz0L4g0L/QvtC00YHRh9C10YLQsCDQv9Cw0LzRj9GC0LgsINC30LDQvdC40LzQsNC10LzQvtC5INC60LDQttC00YvQvCDRgtC40L/QvtC8INCx0YPRhNC10YDQsC5cbiAgICovXG4gIHB1YmxpYyBjcmVhdGVCdWZmZXIoYnVmZmVyczogV2ViR0xCdWZmZXJbXSwgdHlwZTogV2ViR2xCdWZmZXJUeXBlLCBkYXRhOiBUeXBlZEFycmF5LCBrZXk6IG51bWJlcik6IHZvaWQge1xuXG4gICAgLy8g0J7Qv9GA0LXQtNC10LvQtdC90LjQtSDQuNC90LTQtdC60YHQsCDQvdC+0LLQvtCz0L4g0Y3Qu9C10LzQtdC90YLQsCDQsiDQvNCw0YHRgdC40LLQtSDQsdGD0YTQtdGA0L7QsiBXZWJHTC5cbiAgICBjb25zdCBpbmRleCA9IHRoaXMuc3Bsb3QuYnVmZmVycy5hbW91bnRPZkJ1ZmZlckdyb3Vwc1xuXG4gICAgLy8g0KHQvtC30LTQsNC90LjQtSDQuCDQt9Cw0L/QvtC70L3QtdC90LjQtSDQtNCw0L3QvdGL0LzQuCDQvdC+0LLQvtCz0L4g0LHRg9GE0LXRgNCwLlxuICAgIGJ1ZmZlcnNbaW5kZXhdID0gdGhpcy5zcGxvdC5nbC5jcmVhdGVCdWZmZXIoKSFcbiAgICB0aGlzLnNwbG90LmdsLmJpbmRCdWZmZXIodGhpcy5zcGxvdC5nbFt0eXBlXSwgYnVmZmVyc1tpbmRleF0pXG4gICAgdGhpcy5zcGxvdC5nbC5idWZmZXJEYXRhKHRoaXMuc3Bsb3QuZ2xbdHlwZV0sIGRhdGEsIHRoaXMuc3Bsb3QuZ2wuU1RBVElDX0RSQVcpXG5cbiAgICAvLyDQodGH0LXRgtGH0LjQuiDQv9Cw0LzRj9GC0LgsINC30LDQvdC40LzQsNC10LzQvtC5INCx0YPRhNC10YDQsNC80Lgg0LTQsNC90L3Ri9GFICjRgNCw0LfQtNC10LvRjNC90L4g0L/QviDQutCw0LbQtNC+0LzRgyDRgtC40L/RgyDQsdGD0YTQtdGA0L7QsilcbiAgICB0aGlzLnNwbG90LmJ1ZmZlcnMuc2l6ZUluQnl0ZXNba2V5XSArPSBkYXRhLmxlbmd0aCAqIGRhdGEuQllURVNfUEVSX0VMRU1FTlRcbiAgfVxufVxuIiwiaW1wb3J0IHsgY29weU1hdGNoaW5nS2V5VmFsdWVzLCBjb2xvckZyb21IZXhUb0dsUmdiIH0gZnJvbSAnLi91dGlscydcbmltcG9ydCBTSEFERVJfQ09ERV9WRVJUX1RNUEwgZnJvbSAnLi9zaGFkZXItY29kZS12ZXJ0LXRtcGwnXG5pbXBvcnQgU0hBREVSX0NPREVfRlJBR19UTVBMIGZyb20gJy4vc2hhZGVyLWNvZGUtZnJhZy10bXBsJ1xuaW1wb3J0IFNQbG90Q29udG9sIGZyb20gJy4vc3Bsb3QtY29udHJvbCdcbmltcG9ydCBTUGxvdFdlYkdsIGZyb20gJy4vc3Bsb3Qtd2ViZ2wnXG5pbXBvcnQgU1Bsb3REZWJ1ZyBmcm9tICcuL3NwbG90LWRlYnVnJ1xuaW1wb3J0IFNQbG90RGVtbyBmcm9tICcuL3NwbG90LWRlbW8nXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNQbG90IHtcblxuICBwdWJsaWMgaXRlcmF0b3I6IFNQbG90SXRlcmF0b3IgPSB1bmRlZmluZWQgICAgICAgICAvLyDQpNGD0L3QutGG0LjRjyDQuNGC0LXRgNC40YDQvtCy0LDQvdC40Y8g0LjRgdGF0L7QtNC90YvRhSDQtNCw0L3QvdGL0YUuXG4gIHB1YmxpYyBkZW1vOiBTUGxvdERlbW8gPSBuZXcgU1Bsb3REZW1vKHRoaXMpICAgICAgIC8vINCl0LXQu9C/0LXRgCDRgNC10LbQuNC80LAg0LTQtdC80L4t0LTQsNC90L3Ri9GFLlxuICBwdWJsaWMgd2ViR2w6IFNQbG90V2ViR2wgPSBuZXcgU1Bsb3RXZWJHbCh0aGlzKSAgICAvLyDQpdC10LvQv9C10YAgV2ViR0wuXG4gIHB1YmxpYyBkZWJ1ZzogU1Bsb3REZWJ1ZyA9IG5ldyBTUGxvdERlYnVnKHRoaXMpICAgIC8vINCl0LXQu9C/0LXRgCDRgNC10LbQuNC80LAg0L7RgtC70LDQtNC60LhcbiAgcHVibGljIGZvcmNlUnVuOiBib29sZWFuID0gZmFsc2UgICAgICAgICAgICAgICAgICAgLy8g0J/RgNC40LfQvdCw0Log0YTQvtGA0YHQuNGA0L7QstCw0L3QvdC+0LPQviDQt9Cw0L/Rg9GB0LrQsCDRgNC10L3QtNC10YDQsC5cbiAgcHVibGljIGxpbWl0OiBudW1iZXIgPSAxXzAwMF8wMDBfMDAwICAgICAgICAgICAgICAgLy8g0J7Qs9GA0LDQvdC40YfQtdC90LjQtSDQutC+0Lst0LLQsCDQvtCx0YrQtdC60YLQvtCyINC90LAg0LPRgNCw0YTQuNC60LUuXG4gIHB1YmxpYyBpc1J1bm5pbmc6IGJvb2xlYW4gPSBmYWxzZSAgICAgICAgICAgICAgICAgIC8vINCf0YDQuNC30L3QsNC6INCw0LrRgtC40LLQvdC+0LPQviDQv9GA0L7RhtC10YHRgdCwINGA0LXQvdC00LXRgNCwLlxuXG4gIC8vINCm0LLQtdGC0L7QstCw0Y8g0L/QsNC70LjRgtGA0LAg0L7QsdGK0LXQutGC0L7Qsi5cbiAgcHVibGljIGNvbG9yczogc3RyaW5nW10gPSBbXG4gICAgJyNGRjAwRkYnLCAnIzgwMDA4MCcsICcjRkYwMDAwJywgJyM4MDAwMDAnLCAnI0ZGRkYwMCcsXG4gICAgJyMwMEZGMDAnLCAnIzAwODAwMCcsICcjMDBGRkZGJywgJyMwMDAwRkYnLCAnIzAwMDA4MCdcbiAgXVxuXG4gIC8vINCf0LDRgNCw0LzQtdGC0YDRiyDQutC+0L7RgNC00LjQvdCw0YLQvdC+0Lkg0L/Qu9C+0YHQutC+0YHRgtC4LlxuICBwdWJsaWMgZ3JpZDogU1Bsb3RHcmlkID0ge1xuICAgIHdpZHRoOiAzMl8wMDAsXG4gICAgaGVpZ2h0OiAxNl8wMDAsXG4gICAgYmdDb2xvcjogJyNmZmZmZmYnLFxuICAgIHJ1bGVzQ29sb3I6ICcjYzBjMGMwJ1xuICB9XG5cbiAgLy8g0J/QsNGA0LDQvNC10YLRgNGLINC+0LHQu9Cw0YHRgtC4INC/0YDQvtGB0LzQvtGC0YDQsC5cbiAgcHVibGljIGNhbWVyYTogU1Bsb3RDYW1lcmEgPSB7XG4gICAgeDogdGhpcy5ncmlkLndpZHRoISAvIDIsXG4gICAgeTogdGhpcy5ncmlkLmhlaWdodCEgLyAyLFxuICAgIHpvb206IDFcbiAgfVxuXG4gIHB1YmxpYyByZWFkb25seSBzaGFwZXM6IHsgbmFtZTogc3RyaW5nIH1bXSA9IFtdXG5cbiAgcHVibGljIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQgICAgICAgICAgICAgICAgICAgICAgIC8vINCe0LHRitC10LrRgiDQutCw0L3QstCw0YHQsC5cbiAgcHVibGljIGdsITogV2ViR0xSZW5kZXJpbmdDb250ZXh0ICAgICAgICAgICAgICAgICAgICAgIC8vINCe0LHRitC10LrRgiDQutC+0L3RgtC10LrRgdGC0LAg0YDQtdC90LTQtdGA0LjQvdCz0LAgV2ViR0wuXG5cbiAgcHVibGljIGdwdVByb2dyYW0hOiBXZWJHTFByb2dyYW0gICAgICAgICAgICAgICAgICAgICAgIC8vINCe0LHRitC10LrRgiDQv9GA0L7Qs9GA0LDQvNC80YsgV2ViR0wuXG4gIHB1YmxpYyB2YXJpYWJsZXM6IHsgW2tleTogc3RyaW5nXTogYW55IH0gPSB7fSAgICAgICAgICAvLyDQn9C10YDQtdC80LXQvdC90YvQtSDQtNC70Y8g0YHQstGP0LfQuCDQv9GA0LjQu9C+0LbQtdC90LjRjyDRgSDQv9GA0L7Qs9GA0LDQvNC80L7QuSBXZWJHTC5cbiAgcHJvdGVjdGVkIHNoYWRlckNvZGVWZXJ0OiBzdHJpbmcgPSBTSEFERVJfQ09ERV9WRVJUX1RNUEwgICAgICAgICAvLyDQqNCw0LHQu9C+0L0gR0xTTC3QutC+0LTQsCDQtNC70Y8g0LLQtdGA0YjQuNC90L3QvtCz0L4g0YjQtdC50LTQtdGA0LAuXG4gIHByb3RlY3RlZCBzaGFkZXJDb2RlRnJhZzogc3RyaW5nID0gU0hBREVSX0NPREVfRlJBR19UTVBMICAgICAgICAgLy8g0KjQsNCx0LvQvtC9IEdMU0wt0LrQvtC00LAg0LTQu9GPINGE0YDQsNCz0LzQtdC90YLQvdC+0LPQviDRiNC10LnQtNC10YDQsC5cbiAgcHJvdGVjdGVkIGFtb3VudE9mUG9seWdvbnM6IG51bWJlciA9IDAgICAgICAgICAgICAgICAgICAgIC8vINCh0YfQtdGC0YfQuNC6INGH0LjRgdC70LAg0L7QsdGA0LDQsdC+0YLQsNC90L3Ri9GFINC/0L7Qu9C40LPQvtC90L7Qsi5cbiAgcHJvdGVjdGVkIG1heEFtb3VudE9mVmVydGV4SW5Hcm91cDogbnVtYmVyID0gMTBfMDAwICAgICAgIC8vINCc0LDQutGB0LjQvNCw0LvRjNC90L7QtSDQutC+0Lst0LLQviDQstC10YDRiNC40L0g0LIg0LPRgNGD0L/Qv9C1LlxuXG4gIHByb3RlY3RlZCBjb250cm9sOiBTUGxvdENvbnRvbCA9IG5ldyBTUGxvdENvbnRvbCh0aGlzKSAgICAvLyDQntCx0YrQtdC60YIg0YPQv9GA0LDQstC70LXQvdC40Y8g0LPRgNCw0YTQuNC60L7QvCDRg9GB0YLRgNC+0LnRgdGC0LLQsNC80Lgg0LLQstC+0LTQsC5cblxuICAvLyDQotC10YXQvdC40YfQtdGB0LrQsNGPINC40L3RhNC+0YDQvNCw0YbQuNGPLCDQuNGB0L/QvtC70YzQt9GD0LXQvNCw0Y8g0L/RgNC40LvQvtC20LXQvdC40LXQvCDQtNC70Y8g0YDQsNGB0YfQtdGC0LAg0YLRgNCw0L3RgdGE0L7RgNC80LDRhtC40LkuXG4gIHB1YmxpYyB0cmFuc2Zvcm06IFNQbG90VHJhbnNmb3JtID0ge1xuICAgIHZpZXdQcm9qZWN0aW9uTWF0OiBbXSxcbiAgICBzdGFydEludlZpZXdQcm9qTWF0OiBbXSxcbiAgICBzdGFydENhbWVyYToge3g6IDAsIHk6IDAsIHpvb206IDF9LFxuICAgIHN0YXJ0UG9zOiBbXSxcbiAgICBzdGFydENsaXBQb3M6IFtdLFxuICAgIHN0YXJ0TW91c2VQb3M6IFtdXG4gIH1cblxuICAvLyDQmNC90YTQvtGA0LzQsNGG0LjRjyDQviDQsdGD0YTQtdGA0LDRhSwg0YXRgNCw0L3Rj9GJ0LjRhSDQtNCw0L3QvdGL0LUg0LTQu9GPINCy0LjQtNC10L7Qv9Cw0LzRj9GC0LguXG4gIHB1YmxpYyBidWZmZXJzOiBTUGxvdEJ1ZmZlcnMgPSB7XG4gICAgdmVydGV4QnVmZmVyczogW10sXG4gICAgY29sb3JCdWZmZXJzOiBbXSxcbiAgICBzaXplQnVmZmVyczogW10sXG4gICAgc2hhcGVCdWZmZXJzOiBbXSxcbiAgICBhbW91bnRPZkdMVmVydGljZXM6IFtdLFxuICAgIGFtb3VudE9mU2hhcGVzOiBbXSxcbiAgICBhbW91bnRPZkJ1ZmZlckdyb3VwczogMCxcbiAgICBhbW91bnRPZlRvdGFsVmVydGljZXM6IDAsXG4gICAgYW1vdW50T2ZUb3RhbEdMVmVydGljZXM6IDAsXG4gICAgc2l6ZUluQnl0ZXM6IFswLCAwLCAwLCAwXVxuICB9XG5cbiAgLyoqXG4gICAqINCh0L7Qt9C00LDQtdGCINGN0LrQt9C10LzQv9C70Y/RgCDQutC70LDRgdGB0LAsINC40L3QuNGG0LjQsNC70LjQt9C40YDRg9C10YIg0L3QsNGB0YLRgNC+0LnQutC4LlxuICAgKlxuICAgKiBAcmVtYXJrc1xuICAgKiDQldGB0LvQuCDQutCw0L3QstCw0YEg0YEg0LfQsNC00LDQvdC90YvQvCDQuNC00LXQvdGC0LjRhNC40LrQsNGC0L7RgNC+0Lwg0L3QtSDQvdCw0LnQtNC10L0gLSDQs9C10L3QtdGA0LjRgNGD0LXRgtGB0Y8g0L7RiNC40LHQutCwLiDQndCw0YHRgtGA0L7QudC60Lgg0LzQvtCz0YPRgiDQsdGL0YLRjCDQt9Cw0LTQsNC90Ysg0LrQsNC6INCyXG4gICAqINC60L7QvdGB0YLRgNGD0LrRgtC+0YDQtSwg0YLQsNC6INC4INCyINC80LXRgtC+0LTQtSB7QGxpbmsgc2V0dXB9LiDQntC00L3QsNC60L4g0LIg0LvRjtCx0L7QvCDRgdC70YPRh9Cw0LUg0L3QsNGB0YLRgNC+0LnQutC4INC00L7Qu9C20L3RiyDQsdGL0YLRjCDQt9Cw0LTQsNC90Ysg0LTQviDQt9Cw0L/Rg9GB0LrQsCDRgNC10L3QtNC10YDQsC5cbiAgICpcbiAgICogQHBhcmFtIGNhbnZhc0lkIC0g0JjQtNC10L3RgtC40YTQuNC60LDRgtC+0YAg0LrQsNC90LLQsNGB0LAsINC90LAg0LrQvtGC0L7RgNC+0Lwg0LHRg9C00LXRgiDRgNC40YHQvtCy0LDRgtGM0YHRjyDQs9GA0LDRhNC40LouXG4gICAqIEBwYXJhbSBvcHRpb25zIC0g0J/QvtC70YzQt9C+0LLQsNGC0LXQu9GM0YHQutC40LUg0L3QsNGB0YLRgNC+0LnQutC4INGN0LrQt9C10LzQv9C70Y/RgNCwLlxuICAgKi9cbiAgY29uc3RydWN0b3IoY2FudmFzSWQ6IHN0cmluZywgb3B0aW9ucz86IFNQbG90T3B0aW9ucykge1xuXG4gICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNhbnZhc0lkKSkge1xuICAgICAgdGhpcy5jYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChjYW52YXNJZCkgYXMgSFRNTENhbnZhc0VsZW1lbnRcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCfQmtCw0L3QstCw0YEg0YEg0LjQtNC10L3RgtC40YTQuNC60LDRgtC+0YDQvtC8IFwiIycgKyBjYW52YXNJZCArIMKgJ1wiINC90LUg0L3QsNC50LTQtdC9IScpXG4gICAgfVxuXG4gICAgLy8g0JTQvtCx0LDQstC70LXQvdC40LUg0YTQvtGA0LzRiyDQsiDQvNCw0YHRgdC40LIg0YTQvtGA0LwuXG4gICAgdGhpcy5zaGFwZXMucHVzaCh7XG4gICAgICBuYW1lOiAn0KLQvtGH0LrQsCdcbiAgICB9KVxuICAgIC8vINCU0L7QsdCw0LLQu9C10L3QuNC1INGE0L7RgNC80Ysg0LIg0LzQsNGB0YHQuNCyINGH0LDRgdGC0L7RgiDQv9C+0Y/QstC70LXQvdC40Y8g0LIg0LTQtdC80L4t0YDQtdC20LjQvNC1LlxuICAgIHRoaXMuZGVtby5zaGFwZVF1b3RhIS5wdXNoKDEpXG5cbiAgICBpZiAob3B0aW9ucykge1xuICAgICAgdGhpcy5zZXRPcHRpb25zKG9wdGlvbnMpICAgIC8vINCV0YHQu9C4INC/0LXRgNC10LTQsNC90Ysg0L3QsNGB0YLRgNC+0LnQutC4LCDRgtC+INC+0L3QuCDQv9GA0LjQvNC10L3Rj9GO0YLRgdGPLlxuXG4gICAgICBpZiAodGhpcy5mb3JjZVJ1bikge1xuICAgICAgICB0aGlzLnNldHVwKG9wdGlvbnMpICAgICAgIC8vICDQmNC90LjRhtC40LDQu9C40LfQsNGG0LjRjyDQstGB0LXRhSDQv9Cw0YDQsNC80LXRgtGA0L7QsiDRgNC10L3QtNC10YDQsCwg0LXRgdC70Lgg0LfQsNC/0YDQvtGI0LXQvSDRhNC+0YDRgdC40YDQvtCy0LDQvdC90YvQuSDQt9Cw0L/Rg9GB0LouXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqINCY0L3QuNGG0LjQsNC70LjQt9C40YDRg9C10YIg0L3QtdC+0LHRhdC+0LTQuNC80YvQtSDQtNC70Y8g0YDQtdC90LTQtdGA0LAg0L/QsNGA0LDQvNC10YLRgNGLINGN0LrQt9C10LzQv9C70Y/RgNCwINC4IFdlYkdMLlxuICAgKlxuICAgKiBAcGFyYW0gb3B0aW9ucyAtINCf0L7Qu9GM0LfQvtCy0LDRgtC10LvRjNGB0LrQuNC1INC90LDRgdGC0YDQvtC50LrQuCDRjdC60LfQtdC80L/Qu9GP0YDQsC5cbiAgICovXG4gIHB1YmxpYyBzZXR1cChvcHRpb25zOiBTUGxvdE9wdGlvbnMpOiB2b2lkIHtcblxuICAgIHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKSAgICAgLy8g0J/RgNC40LzQtdC90LXQvdC40LUg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GM0YHQutC40YUg0L3QsNGB0YLRgNC+0LXQui5cbiAgICB0aGlzLndlYkdsLmNyZWF0ZSgpICAgICAgICAgICAgICAvLyDQodC+0LfQtNCw0L3QuNC1INC60L7QvdGC0LXQutGB0YLQsCDRgNC10L3QtNC10YDQuNC90LPQsC5cbiAgICB0aGlzLmFtb3VudE9mUG9seWdvbnMgPSAwICAgIC8vINCe0LHQvdGD0LvQtdC90LjQtSDRgdGH0LXRgtGH0LjQutCwINC/0L7Qu9C40LPQvtC90L7Qsi5cbiAgICB0aGlzLmRlbW8uaW5pdCgpICAgICAgLy8g0J7QsdC90YPQu9C10L3QuNC1INGC0LXRhdC90LjRh9C10YHQutC+0LPQviDRgdGH0LXRgtGH0LjQutCwINGA0LXQttC40LzQsCDQtNC10LzQvi3QtNCw0L3QvdGL0YUuXG5cbiAgICBmb3IgKGNvbnN0IGtleSBpbiB0aGlzLnNoYXBlcykge1xuICAgICAgdGhpcy5idWZmZXJzLmFtb3VudE9mU2hhcGVzW2tleV0gPSAwICAgIC8vINCe0LHQvdGD0LvQtdC90LjQtSDRgdGH0LXRgtGH0LjQutC+0LIg0YTQvtGA0Lwg0L/QvtC70LjQs9C+0L3QvtCyLlxuICAgIH1cblxuICAgIGlmICh0aGlzLmRlYnVnLmlzRW5hYmxlKSB7XG4gICAgICB0aGlzLmRlYnVnLmxvZ0ludHJvKHRoaXMuY2FudmFzKVxuICAgICAgdGhpcy5kZWJ1Zy5sb2dHcHVJbmZvKHRoaXMuZ2wpXG4gICAgICB0aGlzLmRlYnVnLmxvZ0luc3RhbmNlSW5mbyh0aGlzLmNhbnZhcywgb3B0aW9ucylcbiAgICB9XG5cbiAgICB0aGlzLndlYkdsLnNldEJnQ29sb3IodGhpcy5ncmlkLmJnQ29sb3IhKSAgICAvLyDQo9GB0YLQsNC90L7QstC60LAg0YbQstC10YLQsCDQvtGH0LjRgdGC0LrQuCDRgNC10L3QtNC10YDQuNC90LPQsFxuXG4gICAgLy8g0KHQvtC30LTQsNC90LjQtSDRiNC10LnQtNC10YDQvtCyIFdlYkdMLlxuICAgIGNvbnN0IHNoYWRlckNvZGVWZXJ0ID0gdGhpcy5zaGFkZXJDb2RlVmVydC5yZXBsYWNlKCd7RVhURVJOQUwtQ09ERX0nLCB0aGlzLmdlblNoYWRlckNvbG9yQ29kZSgpKVxuICAgIGNvbnN0IHNoYWRlckNvZGVGcmFnID0gdGhpcy5zaGFkZXJDb2RlRnJhZ1xuXG4gICAgY29uc3Qgc2hhZGVyVmVydCA9IHRoaXMud2ViR2wuY3JlYXRlU2hhZGVyKCdWRVJURVhfU0hBREVSJywgc2hhZGVyQ29kZVZlcnQpXG4gICAgY29uc3Qgc2hhZGVyRnJhZyA9IHRoaXMud2ViR2wuY3JlYXRlU2hhZGVyKCdGUkFHTUVOVF9TSEFERVInLCBzaGFkZXJDb2RlRnJhZylcblxuICAgIC8vINCS0YvQstC+0LQg0L7RgtC70LDQtNC+0YfQvdC+0Lkg0LjQvdGE0L7RgNC80LDRhtC40LguXG4gICAgaWYgKHRoaXMuZGVidWcuaXNFbmFibGUpIHtcbiAgICAgIHRoaXMuZGVidWcubG9nU2hhZGVySW5mbygnVkVSVEVYX1NIQURFUicsIHNoYWRlckNvZGVWZXJ0KVxuICAgICAgdGhpcy5kZWJ1Zy5sb2dTaGFkZXJJbmZvKCdGUkFHTUVOVF9TSEFERVInLCBzaGFkZXJDb2RlRnJhZylcbiAgICB9XG5cbiAgICAvLyDQodC+0LfQtNCw0L3QuNC1INC/0YDQvtCz0YDQsNC80LzRiyBXZWJHTC5cbiAgICB0aGlzLndlYkdsLmNyZWF0ZVByb2dyYW0oc2hhZGVyVmVydCwgc2hhZGVyRnJhZylcblxuXG4gICAgLy8g0KPRgdGC0LDQvdC+0LLQutCwINGB0LLRj9C30LXQuSDQv9C10YDQtdC80LXQvdC90YvRhSDQv9GA0LjQu9C+0LbQtdC90LjRjyDRgSDQv9GA0L7Qs9GA0LDQvNC80L7QuSBXZWJHbC5cbiAgICB0aGlzLndlYkdsLmNyZWF0ZVZhcmlhYmxlKCdhdHRyaWJ1dGUnLCAnYV9wb3NpdGlvbicpXG4gICAgdGhpcy53ZWJHbC5jcmVhdGVWYXJpYWJsZSgnYXR0cmlidXRlJywgJ2FfY29sb3InKVxuICAgIHRoaXMud2ViR2wuY3JlYXRlVmFyaWFibGUoJ2F0dHJpYnV0ZScsICdhX3BvbHlnb25zaXplJylcbiAgICB0aGlzLndlYkdsLmNyZWF0ZVZhcmlhYmxlKCdhdHRyaWJ1dGUnLCAnYV9zaGFwZScpXG4gICAgdGhpcy53ZWJHbC5jcmVhdGVWYXJpYWJsZSgndW5pZm9ybScsICd1X21hdHJpeCcpXG5cbiAgICB0aGlzLmNyZWF0ZVdlYkdsQnVmZmVycygpICAgIC8vINCX0LDQv9C+0LvQvdC10L3QuNC1INCx0YPRhNC10YDQvtCyIFdlYkdMLlxuXG4gICAgaWYgKHRoaXMuZm9yY2VSdW4pIHtcbiAgICAgIHRoaXMucnVuKCkgICAgICAgICAgICAgICAgLy8g0KTQvtGA0YHQuNGA0L7QstCw0L3QvdGL0Lkg0LfQsNC/0YPRgdC6INGA0LXQvdC00LXRgNC40L3Qs9CwICjQtdGB0LvQuCDRgtGA0LXQsdGD0LXRgtGB0Y8pLlxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDQn9GA0LjQvNC10L3Rj9C10YIg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GM0YHQutC40LUg0L3QsNGB0YLRgNC+0LnQutC4INGN0LrQt9C10LzQv9C70Y/RgNCwLlxuICAgKlxuICAgKiBAcGFyYW0gb3B0aW9ucyAtINCf0L7Qu9GM0LfQvtCy0LDRgtC10LvRjNGB0LrQuNC1INC90LDRgdGC0YDQvtC50LrQuCDRjdC60LfQtdC80L/Qu9GP0YDQsC5cbiAgICovXG4gIHByb3RlY3RlZCBzZXRPcHRpb25zKG9wdGlvbnM6IFNQbG90T3B0aW9ucyk6IHZvaWQge1xuXG4gICAgY29weU1hdGNoaW5nS2V5VmFsdWVzKHRoaXMsIG9wdGlvbnMpICAgIC8vINCf0YDQuNC80LXQvdC10L3QuNC1INC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjNGB0LrQuNGFINC90LDRgdGC0YDQvtC10LouXG5cbiAgICAvLyDQldGB0LvQuCDQt9Cw0LTQsNC9INGA0LDQt9C80LXRgCDQv9C70L7RgdC60L7RgdGC0LgsINC90L4g0L3QtSDQt9Cw0LTQsNC90L4g0L/QvtC70L7QttC10L3QuNC1INC+0LHQu9Cw0YHRgtC4INC/0YDQvtGB0LzQvtGC0YDQsCwg0YLQviDQvtCx0LvQsNGB0YLRjCDQv9C+0LzQtdGJ0LDQtdGC0YHRjyDQsiDRhtC10L3RgtGAINC/0LvQvtGB0LrQvtGB0YLQuC5cbiAgICBpZiAoKCdncmlkJyBpbiBvcHRpb25zKSAmJiAhKCdjYW1lcmEnIGluIG9wdGlvbnMpKSB7XG4gICAgICB0aGlzLmNhbWVyYS54ID0gdGhpcy5ncmlkLndpZHRoISAvIDJcbiAgICAgIHRoaXMuY2FtZXJhLnkgPSB0aGlzLmdyaWQuaGVpZ2h0ISAvIDJcbiAgICB9XG5cbiAgICBpZiAodGhpcy5kZW1vLmlzRW5hYmxlKSB7XG4gICAgICB0aGlzLml0ZXJhdG9yID0gdGhpcy5kZW1vLmRlbW9JdGVyYXRpb25DYWxsYmFjayAgICAvLyDQmNC80LjRgtCw0YbQuNGPINC40YLQtdGA0LjRgNC+0LLQsNC90LjRjyDQtNC70Y8g0LTQtdC80L4t0YDQtdC20LjQvNCwLlxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDQodC+0LfQtNCw0LXRgiDQuCDQt9Cw0L/QvtC70L3Rj9C10YIg0LTQsNC90L3Ri9C80Lgg0L7QsdC+INCy0YHQtdGFINC/0L7Qu9C40LPQvtC90LDRhSDQsdGD0YTQtdGA0YsgV2ViR0wuXG4gICAqL1xuICBwcm90ZWN0ZWQgY3JlYXRlV2ViR2xCdWZmZXJzKCk6IHZvaWQge1xuXG4gICAgLy8g0JLRi9Cy0L7QtCDQvtGC0LvQsNC00L7Rh9C90L7QuSDQuNC90YTQvtGA0LzQsNGG0LjQuC5cbiAgICBpZiAodGhpcy5kZWJ1Zy5pc0VuYWJsZSkge1xuICAgICAgdGhpcy5kZWJ1Zy5sb2dEYXRhTG9hZGluZ1N0YXJ0KClcbiAgICB9XG5cbiAgICBsZXQgcG9seWdvbkdyb3VwOiBTUGxvdFBvbHlnb25Hcm91cCB8IG51bGxcblxuICAgIC8vINCY0YLQtdGA0LjRgNC+0LLQsNC90LjQtSDQs9GA0YPQv9C/INC/0L7Qu9C40LPQvtC90L7Qsi5cbiAgICB3aGlsZSAocG9seWdvbkdyb3VwID0gdGhpcy5jcmVhdGVQb2x5Z29uR3JvdXAoKSkge1xuXG4gICAgICAvLyDQodC+0LfQtNCw0L3QuNC1INC4INC30LDQv9C+0LvQvdC10L3QuNC1INCx0YPRhNC10YDQvtCyINC00LDQvdC90YvQvNC4INC+INGC0LXQutGD0YnQtdC5INCz0YDRg9C/0L/QtSDQv9C+0LvQuNCz0L7QvdC+0LIuXG4gICAgICB0aGlzLndlYkdsLmNyZWF0ZUJ1ZmZlcih0aGlzLmJ1ZmZlcnMudmVydGV4QnVmZmVycywgJ0FSUkFZX0JVRkZFUicsIG5ldyBGbG9hdDMyQXJyYXkocG9seWdvbkdyb3VwLnZlcnRpY2VzKSwgMClcbiAgICAgIHRoaXMud2ViR2wuY3JlYXRlQnVmZmVyKHRoaXMuYnVmZmVycy5jb2xvckJ1ZmZlcnMsICdBUlJBWV9CVUZGRVInLCBuZXcgVWludDhBcnJheShwb2x5Z29uR3JvdXAuY29sb3JzKSwgMSlcbiAgICAgIHRoaXMud2ViR2wuY3JlYXRlQnVmZmVyKHRoaXMuYnVmZmVycy5zaGFwZUJ1ZmZlcnMsICdBUlJBWV9CVUZGRVInLCBuZXcgVWludDhBcnJheShwb2x5Z29uR3JvdXAuc2hhcGVzKSwgNClcbiAgICAgIHRoaXMud2ViR2wuY3JlYXRlQnVmZmVyKHRoaXMuYnVmZmVycy5zaXplQnVmZmVycywgJ0FSUkFZX0JVRkZFUicsIG5ldyBGbG9hdDMyQXJyYXkocG9seWdvbkdyb3VwLnNpemVzKSwgMylcblxuICAgICAgLy8g0KHRh9C10YLRh9C40Log0LrQvtC70LjRh9C10YHRgtCy0LAg0LHRg9GE0LXRgNC+0LIuXG4gICAgICB0aGlzLmJ1ZmZlcnMuYW1vdW50T2ZCdWZmZXJHcm91cHMrK1xuXG4gICAgICAvLyDQodGH0LXRgtGH0LjQuiDQutC+0LvQuNGH0LXRgdGC0LLQsCDQstC10YDRiNC40L0gR0wt0YLRgNC10YPQs9C+0LvRjNC90LjQutC+0LIg0YLQtdC60YPRidC10Lkg0LPRgNGD0L/Qv9GLINCx0YPRhNC10YDQvtCyLlxuICAgICAgdGhpcy5idWZmZXJzLmFtb3VudE9mR0xWZXJ0aWNlcy5wdXNoKHBvbHlnb25Hcm91cC5hbW91bnRPZkdMVmVydGljZXMpXG5cbiAgICAgIC8vINCh0YfQtdGC0YfQuNC6INC+0LHRidC10LPQviDQutC+0LvQuNGH0LXRgdGC0LLQsCDQstC10YDRiNC40L0gR0wt0YLRgNC10YPQs9C+0LvRjNC90LjQutC+0LIuXG4gICAgICB0aGlzLmJ1ZmZlcnMuYW1vdW50T2ZUb3RhbEdMVmVydGljZXMgKz0gcG9seWdvbkdyb3VwLmFtb3VudE9mR0xWZXJ0aWNlc1xuICAgIH1cblxuICAgIC8vINCS0YvQstC+0LQg0L7RgtC70LDQtNC+0YfQvdC+0Lkg0LjQvdGE0L7RgNC80LDRhtC40LguXG4gICAgaWYgKHRoaXMuZGVidWcuaXNFbmFibGUpIHtcbiAgICAgIHRoaXMuZGVidWcubG9nRGF0YUxvYWRpbmdDb21wbGV0ZSh0aGlzLmFtb3VudE9mUG9seWdvbnMsIHRoaXMubGltaXQpXG4gICAgICB0aGlzLmRlYnVnLmxvZ09iamVjdFN0YXRzKHRoaXMuYnVmZmVycywgdGhpcy5hbW91bnRPZlBvbHlnb25zKVxuICAgICAgdGhpcy5kZWJ1Zy5sb2dHcHVNZW1TdGF0cyh0aGlzLmJ1ZmZlcnMpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqINCh0YfQuNGC0YvQstCw0LXRgiDQtNCw0L3QvdGL0LUg0L7QsSDQuNGB0YXQvtC00L3Ri9GFINC+0LHRitC10LrRgtCw0YUg0Lgg0YTQvtGA0LzQuNGA0YPQtdGCINGB0L7QvtGC0LLQtdGC0YHQstGD0Y7RidGD0Y4g0Y3RgtC40Lwg0L7QsdGK0LXQutGC0LDQvCDQs9GA0YPQv9C/0YMg0L/QvtC70LjQs9C+0L3QvtCyLlxuICAgKlxuICAgKiBAcmVtYXJrc1xuICAgKiDQk9GA0YPQv9C/0LAg0YTQvtGA0LzQuNGA0YPQtdGC0YHRjyDRgSDRg9GH0LXRgtC+0Lwg0YLQtdGF0L3QuNGH0LXRgdC60L7Qs9C+INC+0LPRgNCw0L3QuNGH0LXQvdC40Y8g0L3QsCDQutC+0LvQuNGH0LXRgdGC0LLQviDQstC10YDRiNC40L0g0LIg0LPRgNGD0L/Qv9C1INC4INC70LjQvNC40YLQsCDQvdCwINC+0LHRidC10LUg0LrQvtC70LjRh9C10YHRgtCy0L5cbiAgICog0L/QvtC70LjQs9C+0L3QvtCyINC90LAg0LrQsNC90LLQsNGB0LUuXG4gICAqXG4gICAqIEByZXR1cm5zINCh0L7Qt9C00LDQvdC90LDRjyDQs9GA0YPQv9C/0LAg0L/QvtC70LjQs9C+0L3QvtCyINC40LvQuCBudWxsLCDQtdGB0LvQuCDRhNC+0YDQvNC40YDQvtCy0LDQvdC40LUg0LLRgdC10YUg0LPRgNGD0L/QvyDQv9C+0LvQuNCz0L7QvdC+0LIg0LfQsNCy0LXRgNGI0LjQu9C+0YHRjC5cbiAgICovXG4gIHByb3RlY3RlZCBjcmVhdGVQb2x5Z29uR3JvdXAoKTogU1Bsb3RQb2x5Z29uR3JvdXAgfCBudWxsIHtcblxuICAgIGxldCBwb2x5Z29uR3JvdXA6IFNQbG90UG9seWdvbkdyb3VwID0ge1xuICAgICAgdmVydGljZXM6IFtdLFxuICAgICAgY29sb3JzOiBbXSxcbiAgICAgIHNpemVzOiBbXSxcbiAgICAgIHNoYXBlczogW10sXG4gICAgICBhbW91bnRPZlZlcnRpY2VzOiAwLFxuICAgICAgYW1vdW50T2ZHTFZlcnRpY2VzOiAwXG4gICAgfVxuXG4gICAgbGV0IHBvbHlnb246IFNQbG90UG9seWdvbiB8IG51bGwgfCB1bmRlZmluZWRcblxuICAgIC8qKlxuICAgICAqINCV0YHQu9C4INC60L7Qu9C40YfQtdGB0YLQstC+INC/0L7Qu9C40LPQvtC90L7QsiDQutCw0L3QstCw0YHQsCDQtNC+0YHRgtC40LPQu9C+INC00L7Qv9GD0YHRgtC40LzQvtCz0L4g0LzQsNC60YHQuNC80YPQvNCwLCDRgtC+INC00LDQu9GM0L3QtdC50YjQsNGPINC+0LHRgNCw0LHQvtGC0LrQsCDQuNGB0YXQvtC00L3Ri9GFINC+0LHRitC10LrRgtC+0LJcbiAgICAgKiDQv9GA0LjQvtGB0YLQsNC90LDQstC70LjQstCw0LXRgtGB0Y8gLSDRhNC+0YDQvNC40YDQvtCy0LDQvdC40LUg0LPRgNGD0L/QvyDQv9C+0LvQuNCz0L7QvdC+0LIg0LfQsNCy0LXRgNGI0LDQtdGC0YHRjyDQstC+0LfQstGA0LDRgtC+0Lwg0LfQvdCw0YfQtdC90LjRjyBudWxsICjRgdC40LzRg9C70Y/RhtC40Y8g0LTQvtGB0YLQuNC20LXQvdC40Y9cbiAgICAgKiDQv9C+0YHQu9C10LTQvdC10LPQviDQvtCx0YDQsNCx0LDRgtGL0LLQsNC10LzQvtCz0L4g0LjRgdGF0L7QtNC90L7Qs9C+INC+0LHRitC10LrRgtCwKS5cbiAgICAgKi9cbiAgICBpZiAodGhpcy5hbW91bnRPZlBvbHlnb25zID49IHRoaXMubGltaXQpIHJldHVybiBudWxsXG5cbiAgICAvLyDQmNGC0LXRgNC40YDQvtCy0LDQvdC40LUg0LjRgdGF0L7QtNC90YvRhSDQvtCx0YrQtdC60YLQvtCyLlxuICAgIHdoaWxlIChwb2x5Z29uID0gdGhpcy5pdGVyYXRvciEoKSkge1xuXG4gICAgICAvLyDQlNC+0LHQsNCy0LvQtdC90LjQtSDQsiDQs9GA0YPQv9C/0YMg0L/QvtC70LjQs9C+0L3QvtCyINC90L7QstC+0LPQviDQv9C+0LvQuNCz0L7QvdCwLlxuICAgICAgdGhpcy5hZGRQb2x5Z29uKHBvbHlnb25Hcm91cCwgcG9seWdvbilcblxuICAgICAgLy8g0KHRh9C10YLRh9C40Log0YfQuNGB0LvQsCDQv9GA0LjQvNC10L3QtdC90LjQuSDQutCw0LbQtNC+0Lkg0LjQtyDRhNC+0YDQvCDQv9C+0LvQuNCz0L7QvdC+0LIuXG4gICAgICB0aGlzLmJ1ZmZlcnMuYW1vdW50T2ZTaGFwZXNbcG9seWdvbi5zaGFwZV0rK1xuXG4gICAgICAvLyDQodGH0LXRgtGH0LjQuiDQvtCx0YnQtdCz0L4g0LrQvtC70LjRh9C10YHRgtCy0L4g0L/QvtC70LjQs9C+0L3QvtCyLlxuICAgICAgdGhpcy5hbW91bnRPZlBvbHlnb25zKytcblxuICAgICAgLyoqXG4gICAgICAgKiDQldGB0LvQuCDQutC+0LvQuNGH0LXRgdGC0LLQviDQv9C+0LvQuNCz0L7QvdC+0LIg0LrQsNC90LLQsNGB0LAg0LTQvtGB0YLQuNCz0LvQviDQtNC+0L/Rg9GB0YLQuNC80L7Qs9C+INC80LDQutGB0LjQvNGD0LzQsCwg0YLQviDQtNCw0LvRjNC90LXQudGI0LDRjyDQvtCx0YDQsNCx0L7RgtC60LAg0LjRgdGF0L7QtNC90YvRhSDQvtCx0YrQtdC60YLQvtCyXG4gICAgICAgKiDQv9GA0LjQvtGB0YLQsNC90LDQstC70LjQstCw0LXRgtGB0Y8gLSDRhNC+0YDQvNC40YDQvtCy0LDQvdC40LUg0LPRgNGD0L/QvyDQv9C+0LvQuNCz0L7QvdC+0LIg0LfQsNCy0LXRgNGI0LDQtdGC0YHRjyDQstC+0LfQstGA0LDRgtC+0Lwg0LfQvdCw0YfQtdC90LjRjyBudWxsICjRgdC40LzRg9C70Y/RhtC40Y8g0LTQvtGB0YLQuNC20LXQvdC40Y9cbiAgICAgICAqINC/0L7RgdC70LXQtNC90LXQs9C+INC+0LHRgNCw0LHQsNGC0YvQstCw0LXQvNC+0LPQviDQuNGB0YXQvtC00L3QvtCz0L4g0L7QsdGK0LXQutGC0LApLlxuICAgICAgICovXG4gICAgICBpZiAodGhpcy5hbW91bnRPZlBvbHlnb25zID49IHRoaXMubGltaXQpIGJyZWFrXG5cbiAgICAgIC8qKlxuICAgICAgICog0JXRgdC70Lgg0L7QsdGJ0LXQtSDQutC+0LvQuNGH0LXRgdGC0LLQviDQstGB0LXRhSDQstC10YDRiNC40L0g0LIg0LPRgNGD0L/Qv9C1INC/0L7Qu9C40LPQvtC90L7QsiDQv9GA0LXQstGL0YHQuNC70L4g0YLQtdGF0L3QuNGH0LXRgdC60L7QtSDQvtCz0YDQsNC90LjRh9C10L3QuNC1LCDRgtC+INCz0YDRg9C/0L/QsCDQv9C+0LvQuNCz0L7QvdC+0LJcbiAgICAgICAqINGB0YfQuNGC0LDQtdGC0YHRjyDRgdGE0L7RgNC80LjRgNC+0LLQsNC90L3QvtC5INC4INC40YLQtdGA0LjRgNC+0LLQsNC90LjQtSDQuNGB0YXQvtC00L3Ri9GFINC+0LHRitC10LrRgtC+0LIg0L/RgNC40L7RgdGC0LDQvdCw0LLQu9C40LLQsNC10YLRgdGPLlxuICAgICAgICovXG4gICAgICBpZiAocG9seWdvbkdyb3VwLmFtb3VudE9mVmVydGljZXMgPj0gdGhpcy5tYXhBbW91bnRPZlZlcnRleEluR3JvdXApIGJyZWFrXG4gICAgfVxuXG4gICAgLy8g0KHRh9C10YLRh9C40Log0L7QsdGJ0LXQs9C+INC60L7Qu9C40YfQtdGB0YLQstCwINCy0LXRgNGI0LjQvSDQstGB0LXRhSDQstC10YDRiNC40L3QvdGL0YUg0LHRg9GE0LXRgNC+0LIuXG4gICAgdGhpcy5idWZmZXJzLmFtb3VudE9mVG90YWxWZXJ0aWNlcyArPSBwb2x5Z29uR3JvdXAuYW1vdW50T2ZWZXJ0aWNlc1xuXG4gICAgLy8g0JXRgdC70Lgg0LPRgNGD0L/Qv9CwINC/0L7Qu9C40LPQvtC90L7QsiDQvdC10L/Rg9GB0YLQsNGPLCDRgtC+INCy0L7Qt9Cy0YDQsNGJ0LDQtdC8INC10LUuINCV0YHQu9C4INC/0YPRgdGC0LDRjyAtINCy0L7Qt9Cy0YDQsNGJ0LDQtdC8IG51bGwuXG4gICAgcmV0dXJuIChwb2x5Z29uR3JvdXAuYW1vdW50T2ZWZXJ0aWNlcyA+IDApID8gcG9seWdvbkdyb3VwIDogbnVsbFxuICB9XG5cbiAgLyoqXG4gICAqINCh0L7Qt9C00LDQtdGCINC4INC00L7QsdCw0LLQu9GP0LXRgiDQsiDQs9GA0YPQv9C/0YMg0L/QvtC70LjQs9C+0L3QvtCyINC90L7QstGL0Lkg0L/QvtC70LjQs9C+0L0uXG4gICAqXG4gICAqIEBwYXJhbSBwb2x5Z29uR3JvdXAgLSDQk9GA0YPQv9C/0LAg0L/QvtC70LjQs9C+0L3QvtCyLCDQsiDQutC+0YLQvtGA0YPRjiDQv9GA0L7QuNGB0YXQvtC00LjRgiDQtNC+0LHQsNCy0LvQtdC90LjQtS5cbiAgICogQHBhcmFtIHBvbHlnb24gLSDQmNC90YTQvtGA0LzQsNGG0LjRjyDQviDQtNC+0LHQsNCy0LvRj9C10LzQvtC8INC/0L7Qu9C40LPQvtC90LUuXG4gICAqL1xuICBwcm90ZWN0ZWQgYWRkUG9seWdvbihwb2x5Z29uR3JvdXA6IFNQbG90UG9seWdvbkdyb3VwLCBwb2x5Z29uOiBTUGxvdFBvbHlnb24pOiB2b2lkIHtcblxuICAgIC8qKlxuICAgICAqINCU0L7QsdCw0LLQu9C10L3QuNC1INCyINCz0YDRg9C/0L/RgyDQv9C+0LvQuNCz0L7QvdC+0LIg0LjQvdC00LXQutGB0L7QsiDQstC10YDRiNC40L0g0L3QvtCy0L7Qs9C+INC/0L7Qu9C40LPQvtC90LAg0Lgg0L/QvtC00YHRh9C10YIg0L7QsdGJ0LXQs9C+INC60L7Qu9C40YfQtdGB0YLQstCwINCy0LXRgNGI0LjQvSBHTC3RgtGA0LXRg9Cz0L7Qu9GM0L3QuNC60L7QslxuICAgICAqINCyINCz0YDRg9C/0L/QtS5cbiAgICAgKi9cbiAgICBwb2x5Z29uR3JvdXAuYW1vdW50T2ZHTFZlcnRpY2VzKytcblxuICAgIC8vINCU0L7QsdCw0LLQu9C10L3QuNC1INCyINCz0YDRg9C/0L/RgyDQv9C+0LvQuNCz0L7QvdC+0LIg0LLQtdGA0YjQuNC9INC90L7QstC+0LPQviDQv9C+0LvQuNCz0L7QvdCwINC4INC/0L7QtNGB0YfQtdGCINC+0LHRidC10LPQviDQutC+0LvQuNGH0LXRgdGC0LLQsCDQstC10YDRiNC40L0g0LIg0LPRgNGD0L/Qv9C1LlxuICAgIHBvbHlnb25Hcm91cC52ZXJ0aWNlcy5wdXNoKHBvbHlnb24ueCwgcG9seWdvbi55KVxuICAgIHBvbHlnb25Hcm91cC5hbW91bnRPZlZlcnRpY2VzKytcblxuICAgIHBvbHlnb25Hcm91cC5zaGFwZXMucHVzaChwb2x5Z29uLnNoYXBlKVxuICAgIHBvbHlnb25Hcm91cC5zaXplcy5wdXNoKHBvbHlnb24uc2l6ZSlcbiAgICBwb2x5Z29uR3JvdXAuY29sb3JzLnB1c2gocG9seWdvbi5jb2xvcilcbiAgfVxuXG4gIC8qKlxuICAgKiDQodC+0LfQtNCw0LXRgiDQtNC+0L/QvtC70L3QtdC90LjQtSDQuiDQutC+0LTRgyDQvdCwINGP0LfRi9C60LUgR0xTTC5cbiAgICpcbiAgICogQHJlbWFya3NcbiAgICog0JIg0LTQsNC70YzQvdC10LnRiNC10Lwg0YHQvtC30LTQsNC90L3Ri9C5INC60L7QtCDQsdGD0LTQtdGCINCy0YHRgtGA0L7QtdC9INCyINC60L7QtCDQstC10YDRiNC40L3QvdC+0LPQviDRiNC10LnQtNC10YDQsCDQtNC70Y8g0LfQsNC00LDQvdC40Y8g0YbQstC10YLQsCDQstC10YDRiNC40L3RiyDQsiDQt9Cw0LLQuNGB0LjQvNC+0YHRgtC4INC+0YJcbiAgICog0LjQvdC00LXQutGB0LAg0YbQstC10YLQsCwg0L/RgNC40YHQstC+0LXQvdC90L7Qs9C+INGN0YLQvtC5INCy0LXRgNGI0LjQvdC1LiDQoi7Qui4g0YjQtdC50LTQtdGAINC90LUg0L/QvtC30LLQvtC70Y/QtdGCINC40YHQv9C+0LvRjNC30L7QstCw0YLRjCDQsiDQutCw0YfQtdGB0YLQstC1INC40L3QtNC10LrRgdC+0LIg0L/QtdGA0LXQvNC10L3QvdGL0LUgLVxuICAgKiDQtNC70Y8g0LfQsNC00LDQvdC40Y8g0YbQstC10YLQsCDQuNGB0L/QvtC70YzQt9GD0LXRgtGB0Y8g0L/QtdGA0LXQsdC+0YAg0YbQstC10YLQvtCy0YvRhSDQuNC90LTQtdC60YHQvtCyLlxuICAgKlxuICAgKiBAcmV0dXJucyDQmtC+0LQg0L3QsCDRj9C30YvQutC1IEdMU0wuXG4gICAqL1xuICBwcm90ZWN0ZWQgZ2VuU2hhZGVyQ29sb3JDb2RlKCk6IHN0cmluZyB7XG5cbiAgICAvLyDQktGA0LXQvNC10L3QvdC+0LUg0LTQvtCx0LDQstC70LXQvdC40LUg0LIg0L/QsNC70LjRgtGA0YMg0YbQstC10YLQvtCyINCy0LXRgNGI0LjQvSDRhtCy0LXRgtCwINC90LDQv9GA0LDQstC70Y/RjtGJ0LjRhS5cbiAgICB0aGlzLmNvbG9ycy5wdXNoKHRoaXMuZ3JpZC5ydWxlc0NvbG9yISlcblxuICAgIGxldCBjb2RlOiBzdHJpbmcgPSAnJ1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNvbG9ycy5sZW5ndGg7IGkrKykge1xuXG4gICAgICAvLyDQn9C+0LvRg9GH0LXQvdC40LUg0YbQstC10YLQsCDQsiDQvdGD0LbQvdC+0Lwg0YTQvtGA0LzQsNGC0LUuXG4gICAgICBsZXQgW3IsIGcsIGJdID0gY29sb3JGcm9tSGV4VG9HbFJnYih0aGlzLmNvbG9yc1tpXSlcblxuICAgICAgLy8g0KTQvtGA0LzQuNGA0L7QstC90LjQtSDRgdGC0YDQvtC6IEdMU0wt0LrQvtC00LAg0L/RgNC+0LLQtdGA0LrQuCDQuNC90LTQtdC60YHQsCDRhtCy0LXRgtCwLlxuICAgICAgY29kZSArPSAoKGkgPT09IDApID8gJycgOiAnICBlbHNlICcpICsgJ2lmIChhX2NvbG9yID09ICcgKyBpICsgJy4wKSB2X2NvbG9yID0gdmVjMygnICtcbiAgICAgICAgci50b1N0cmluZygpLnNsaWNlKDAsIDkpICsgJywnICtcbiAgICAgICAgZy50b1N0cmluZygpLnNsaWNlKDAsIDkpICsgJywnICtcbiAgICAgICAgYi50b1N0cmluZygpLnNsaWNlKDAsIDkpICsgJyk7XFxuJ1xuICAgIH1cblxuICAgIC8vINCj0LTQsNC70LXQvdC40LUg0LjQtyDQv9Cw0LvQuNGC0YDRiyDQstC10YDRiNC40L0g0LLRgNC10LzQtdC90L3QviDQtNC+0LHQsNCy0LvQtdC90L3QvtCz0L4g0YbQstC10YLQsCDQvdCw0L/RgNCw0LLQu9GP0Y7RidC40YUuXG4gICAgdGhpcy5jb2xvcnMucG9wKClcblxuICAgIHJldHVybiBjb2RlXG4gIH1cblxuICAvKipcbiAgICog0J/RgNC+0LjQt9Cy0L7QtNC40YIg0YDQtdC90LTQtdGA0LjQvdCzINCz0YDQsNGE0LjQutCwINCyINGB0L7QvtGC0LLQtdGC0YHRgtCy0LjQuCDRgSDRgtC10LrRg9GJ0LjQvNC4INC/0LDRgNCw0LzQtdGC0YDQsNC80Lgg0YLRgNCw0L3RgdGE0L7RgNC80LDRhtC40LguXG4gICAqL1xuICBwdWJsaWMgcmVuZGVyKCk6IHZvaWQge1xuXG4gICAgLy8g0J7Rh9C40YHRgtC60LAg0L7QsdGK0LXQutGC0LAg0YDQtdC90LTQtdGA0LjQvdCz0LAgV2ViR0wuXG4gICAgdGhpcy5nbC5jbGVhcih0aGlzLmdsLkNPTE9SX0JVRkZFUl9CSVQpXG5cbiAgICAvLyDQntCx0L3QvtCy0LvQtdC90LjQtSDQvNCw0YLRgNC40YbRiyDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuC5cbiAgICB0aGlzLmNvbnRyb2wudXBkYXRlVmlld1Byb2plY3Rpb24oKVxuXG4gICAgLy8g0J/RgNC40LLRj9C30LrQsCDQvNCw0YLRgNC40YbRiyDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuCDQuiDQv9C10YDQtdC80LXQvdC90L7QuSDRiNC10LnQtNC10YDQsC5cbiAgICB0aGlzLmdsLnVuaWZvcm1NYXRyaXgzZnYodGhpcy52YXJpYWJsZXNbJ3VfbWF0cml4J10sIGZhbHNlLCB0aGlzLnRyYW5zZm9ybS52aWV3UHJvamVjdGlvbk1hdClcblxuICAgIC8vINCY0YLQtdGA0LjRgNC+0LLQsNC90LjQtSDQuCDRgNC10L3QtNC10YDQuNC90LMg0LPRgNGD0L/QvyDQsdGD0YTQtdGA0L7QsiBXZWJHTC5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYnVmZmVycy5hbW91bnRPZkJ1ZmZlckdyb3VwczsgaSsrKSB7XG5cbiAgICAgIC8vINCj0YHRgtCw0L3QvtCy0LrQsCDRgtC10LrRg9GJ0LXQs9C+INCx0YPRhNC10YDQsCDQstC10YDRiNC40L0g0Lgg0LXQs9C+INC/0YDQuNCy0Y/Qt9C60LAg0Log0L/QtdGA0LXQvNC10L3QvdC+0Lkg0YjQtdC50LTQtdGA0LAuXG4gICAgICB0aGlzLmdsLmJpbmRCdWZmZXIodGhpcy5nbC5BUlJBWV9CVUZGRVIsIHRoaXMuYnVmZmVycy52ZXJ0ZXhCdWZmZXJzW2ldKVxuICAgICAgdGhpcy5nbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheSh0aGlzLnZhcmlhYmxlc1snYV9wb3NpdGlvbiddKVxuICAgICAgdGhpcy5nbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKHRoaXMudmFyaWFibGVzWydhX3Bvc2l0aW9uJ10sIDIsIHRoaXMuZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKVxuXG4gICAgICAvLyDQo9GB0YLQsNC90L7QstC60LAg0YLQtdC60YPRidC10LPQviDQsdGD0YTQtdGA0LAg0YbQstC10YLQvtCyINCy0LXRgNGI0LjQvSDQuCDQtdCz0L4g0L/RgNC40LLRj9C30LrQsCDQuiDQv9C10YDQtdC80LXQvdC90L7QuSDRiNC10LnQtNC10YDQsC5cbiAgICAgIHRoaXMuZ2wuYmluZEJ1ZmZlcih0aGlzLmdsLkFSUkFZX0JVRkZFUiwgdGhpcy5idWZmZXJzLmNvbG9yQnVmZmVyc1tpXSlcbiAgICAgIHRoaXMuZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkodGhpcy52YXJpYWJsZXNbJ2FfY29sb3InXSlcbiAgICAgIHRoaXMuZ2wudmVydGV4QXR0cmliUG9pbnRlcih0aGlzLnZhcmlhYmxlc1snYV9jb2xvciddLCAxLCB0aGlzLmdsLlVOU0lHTkVEX0JZVEUsIGZhbHNlLCAwLCAwKVxuXG4gICAgICAvLyDQo9GB0YLQsNC90L7QstC60LAg0YLQtdC60YPRidC10LPQviDQsdGD0YTQtdGA0LAg0YDQsNC30LzQtdGA0L7QsiDQstC10YDRiNC40L0g0Lgg0LXQs9C+INC/0YDQuNCy0Y/Qt9C60LAg0Log0L/QtdGA0LXQvNC10L3QvdC+0Lkg0YjQtdC50LTQtdGA0LAuXG4gICAgICB0aGlzLmdsLmJpbmRCdWZmZXIodGhpcy5nbC5BUlJBWV9CVUZGRVIsIHRoaXMuYnVmZmVycy5zaXplQnVmZmVyc1tpXSlcbiAgICAgIHRoaXMuZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkodGhpcy52YXJpYWJsZXNbJ2FfcG9seWdvbnNpemUnXSlcbiAgICAgIHRoaXMuZ2wudmVydGV4QXR0cmliUG9pbnRlcih0aGlzLnZhcmlhYmxlc1snYV9wb2x5Z29uc2l6ZSddLCAxLCB0aGlzLmdsLkZMT0FULCBmYWxzZSwgMCwgMClcblxuICAgICAgdGhpcy5nbC5iaW5kQnVmZmVyKHRoaXMuZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLmJ1ZmZlcnMuc2hhcGVCdWZmZXJzW2ldKVxuICAgICAgdGhpcy5nbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheSh0aGlzLnZhcmlhYmxlc1snYV9zaGFwZSddKVxuICAgICAgdGhpcy5nbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKHRoaXMudmFyaWFibGVzWydhX3NoYXBlJ10sIDEsIHRoaXMuZ2wuVU5TSUdORURfQllURSwgZmFsc2UsIDAsIDApXG5cbiAgICAgIHRoaXMuZ2wuZHJhd0FycmF5cyh0aGlzLmdsLlBPSU5UUywgMCwgdGhpcy5idWZmZXJzLmFtb3VudE9mR0xWZXJ0aWNlc1tpXSAvIDMpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqINCX0LDQv9GD0YHQutCw0LXRgiDRgNC10L3QtNC10YDQuNC90LMg0Lgg0LrQvtC90YLRgNC+0LvRjCDRg9C/0YDQsNCy0LvQtdC90LjRjy5cbiAgICovXG4gIHB1YmxpYyBydW4oKTogdm9pZCB7XG5cbiAgICBpZiAodGhpcy5pc1J1bm5pbmcpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHRoaXMucmVuZGVyKClcbiAgICB0aGlzLmNvbnRyb2wucnVuKClcbiAgICB0aGlzLmlzUnVubmluZyA9IHRydWVcblxuICAgIGlmICh0aGlzLmRlYnVnLmlzRW5hYmxlKSB7XG4gICAgICB0aGlzLmRlYnVnLmxvZ1JlbmRlclN0YXJ0ZWQoKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDQntGB0YLQsNC90LDQstC70LjQstCw0LXRgiDRgNC10L3QtNC10YDQuNC90LMg0Lgg0LrQvtC90YLRgNC+0LvRjCDRg9C/0YDQsNCy0LvQtdC90LjRjy5cbiAgICovXG4gIHB1YmxpYyBzdG9wKCk6IHZvaWQge1xuXG4gICAgaWYgKCF0aGlzLmlzUnVubmluZykge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgdGhpcy5jb250cm9sLnN0b3AoKVxuICAgIHRoaXMuaXNSdW5uaW5nID0gZmFsc2VcblxuICAgIGlmICh0aGlzLmRlYnVnLmlzRW5hYmxlKSB7XG4gICAgICB0aGlzLmRlYnVnLmxvZ1JlbmRlclN0b3BlZCgpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqINCe0YfQuNGJ0LDQtdGCINGE0L7QvS5cbiAgICovXG4gIHB1YmxpYyBjbGVhcigpOiB2b2lkIHtcblxuICAgIHRoaXMud2ViR2wuY2xlYXJCYWNrZ3JvdW5kKClcblxuICAgIGlmICh0aGlzLmRlYnVnLmlzRW5hYmxlKSB7XG4gICAgICB0aGlzLmRlYnVnLmxvZ0NhbnZhc0NsZWFyZWQoKVxuICAgIH1cbiAgfVxufVxuIiwiXG4vKipcbiAqINCf0YDQvtCy0LXRgNGP0LXRgiDRj9Cy0LvRj9C10YLRgdGPINC70Lgg0L/QtdGA0LXQvNC10L3QvdCw0Y8g0Y3QutC30LXQvNC/0LvRj9GA0L7QvCDQutCw0LrQvtCz0L4t0LvQuNCx0L7QviDQutC70LDRgdGB0LAuXG4gKlxuICogQHBhcmFtIHZhbCAtINCf0YDQvtCy0LXRgNGP0LXQvNCw0Y8g0L/QtdGA0LXQvNC10L3QvdCw0Y8uXG4gKiBAcmV0dXJucyDQoNC10LfRg9C70YzRgtCw0YIg0L/RgNC+0LLQtdGA0LrQuC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzT2JqZWN0KG9iajogYW55KTogYm9vbGVhbiB7XG4gIHJldHVybiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IE9iamVjdF0nKVxufVxuXG4vKipcbiAqINCf0LXRgNC10L7Qv9GA0LXQtNC10LvRj9C10YIg0LfQvdCw0YfQtdC90LjRjyDQv9C+0LvQtdC5INC+0LHRitC10LrRgtCwIHRhcmdldCDQvdCwINC30L3QsNGH0LXQvdC40Y8g0L/QvtC70LXQuSDQvtCx0YrQtdC60YLQsCBzb3VyY2UuINCf0LXRgNC10L7Qv9GA0LXQtNC10LvRj9GO0YLRgdGPINGC0L7Qu9GM0LrQviDRgtC1INC/0L7Qu9GPLFxuICog0LrQvtGC0L7RgNGL0LUg0YHRg9GJ0LXRgdGC0LLRg9C10Y7RgiDQsiB0YXJnZXQuINCV0YHQu9C4INCyIHNvdXJjZSDQtdGB0YLRjCDQv9C+0LvRjywg0LrQvtGC0L7RgNGL0YUg0L3QtdGCINCyIHRhcmdldCwg0YLQviDQvtC90Lgg0LjQs9C90L7RgNC40YDRg9GO0YLRgdGPLiDQldGB0LvQuCDQutCw0LrQuNC1LdGC0L4g0L/QvtC70Y9cbiAqINGB0LDQvNC4INGP0LLQu9GP0Y7RgtGB0Y8g0Y/QstC70Y/RjtGC0YHRjyDQvtCx0YrQtdC60YLQsNC80LgsINGC0L4g0YLQviDQvtC90Lgg0YLQsNC60LbQtSDRgNC10LrRg9GA0YHQuNCy0L3QviDQutC+0L/QuNGA0YPRjtGC0YHRjyAo0L/RgNC4INGC0L7QvCDQttC1INGD0YHQu9C+0LLQuNC4LCDRh9GC0L4g0LIg0YbQtdC70LXQvtC8INC+0LHRitC10LrRgtC1XG4gKiDRgdGD0YnQtdGB0YLQstGD0Y7RgiDQv9C+0LvRjyDQvtCx0YrQtdC60YLQsC3QuNGB0YLQvtGH0L3QuNC60LApLlxuICpcbiAqIEBwYXJhbSB0YXJnZXQgLSDQptC10LvQtdCy0L7QuSAo0LjQt9C80LXQvdGP0LXQvNGL0LkpINC+0LHRitC10LrRgi5cbiAqIEBwYXJhbSBzb3VyY2UgLSDQntCx0YrQtdC60YIg0YEg0LTQsNC90L3Ri9C80LgsINC60L7RgtC+0YDRi9C1INC90YPQttC90L4g0YPRgdGC0LDQvdC+0LLQuNGC0Ywg0YMg0YbQtdC70LXQstC+0LPQviDQvtCx0YrQtdC60YLQsC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvcHlNYXRjaGluZ0tleVZhbHVlcyh0YXJnZXQ6IGFueSwgc291cmNlOiBhbnkpOiB2b2lkIHtcbiAgT2JqZWN0LmtleXMoc291cmNlKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgaWYgKGtleSBpbiB0YXJnZXQpIHtcbiAgICAgIGlmIChpc09iamVjdChzb3VyY2Vba2V5XSkpIHtcbiAgICAgICAgaWYgKGlzT2JqZWN0KHRhcmdldFtrZXldKSkge1xuICAgICAgICAgIGNvcHlNYXRjaGluZ0tleVZhbHVlcyh0YXJnZXRba2V5XSwgc291cmNlW2tleV0pXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghaXNPYmplY3QodGFyZ2V0W2tleV0pICYmICh0eXBlb2YgdGFyZ2V0W2tleV0gIT09ICdmdW5jdGlvbicpKSB7XG4gICAgICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KVxufVxuXG4vKipcbiAqINCS0L7Qt9Cy0YDQsNGJ0LDQtdGCINGB0LvRg9GH0LDQudC90L7QtSDRhtC10LvQvtC1INGH0LjRgdC70L4g0LIg0LTQuNCw0L/QsNC30L7QvdC1OiBbMC4uLnJhbmdlLTFdLlxuICpcbiAqIEBwYXJhbSByYW5nZSAtINCS0LXRgNGF0L3QuNC5INC/0YDQtdC00LXQuyDQtNC40LDQv9Cw0LfQvtC90LAg0YHQu9GD0YfQsNC50L3QvtCz0L4g0LLRi9Cx0L7RgNCwLlxuICogQHJldHVybnMg0KHQu9GD0YfQsNC50L3QvtC1INGH0LjRgdC70L4uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByYW5kb21JbnQocmFuZ2U6IG51bWJlcik6IG51bWJlciB7XG4gIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiByYW5nZSlcbn1cblxuLyoqXG4gKiDQn9GA0LXQvtCx0YDQsNC30YPQtdGCINC+0LHRitC10LrRgiDQsiDRgdGC0YDQvtC60YMgSlNPTi4g0JjQvNC10LXRgiDQvtGC0LvQuNGH0LjQtSDQvtGCINGB0YLQsNC90LTQsNGA0YLQvdC+0Lkg0YTRg9C90LrRhtC40LggSlNPTi5zdHJpbmdpZnkgLSDQv9C+0LvRjyDQvtCx0YrQtdC60YLQsCwg0LjQvNC10Y7RidC40LVcbiAqINC30L3QsNGH0LXQvdC40Y8g0YTRg9C90LrRhtC40Lkg0L3QtSDQv9GA0L7Qv9GD0YHQutCw0Y7RgtGB0Y8sINCwINC/0YDQtdC+0LHRgNCw0LfRg9GO0YLRgdGPINCyINC90LDQt9Cy0LDQvdC40LUg0YTRg9C90LrRhtC40LguXG4gKlxuICogQHBhcmFtIG9iaiAtINCm0LXQu9C10LLQvtC5INC+0LHRitC10LrRgi5cbiAqIEByZXR1cm5zINCh0YLRgNC+0LrQsCBKU09OLCDQvtGC0L7QsdGA0LDQttCw0Y7RidCw0Y8g0L7QsdGK0LXQutGCLlxuICovXG5leHBvcnQgZnVuY3Rpb24ganNvblN0cmluZ2lmeShvYmo6IGFueSk6IHN0cmluZyB7XG4gIHJldHVybiBKU09OLnN0cmluZ2lmeShcbiAgICBvYmosXG4gICAgZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICAgIHJldHVybiAodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKSA/IHZhbHVlLm5hbWUgOiB2YWx1ZVxuICAgIH0sXG4gICAgJyAnXG4gIClcbn1cblxuLyoqXG4gKiDQodC70YPRh9Cw0LnQvdGL0Lwg0L7QsdGA0LDQt9C+0Lwg0LLQvtC30LLRgNCw0YnQsNC10YIg0L7QtNC40L0g0LjQtyDQuNC90LTQtdC60YHQvtCyINGH0LjRgdC70L7QstC+0LPQviDQvtC00L3QvtC80LXRgNC90L7Qs9C+INC80LDRgdGB0LjQstCwLiDQndC10YHQvNC+0YLRgNGPINC90LAg0YHQu9GD0YfQsNC50L3QvtGB0YLRjCDQutCw0LbQtNC+0LPQvlxuICog0LrQvtC90LrRgNC10YLQvdC+0LPQviDQstGL0LfQvtCy0LAg0YTRg9C90LrRhtC40LgsINC40L3QtNC10LrRgdGLINCy0L7Qt9Cy0YDQsNGJ0LDRjtGC0YHRjyDRgSDQv9GA0LXQtNC+0L/RgNC10LTQtdC70LXQvdC90L7QuSDRh9Cw0YHRgtC+0YLQvtC5LiDQp9Cw0YHRgtC+0YLQsCBcItCy0YvQv9Cw0LTQsNC90LjQuVwiINC40L3QtNC10LrRgdC+0LIg0LfQsNC00LDQtdGC0YHRj1xuICog0YHQvtC+0YLQstC10YLRgdGC0LLRg9GO0YnQuNC80Lgg0LfQvdCw0YfQtdC90LjRj9C80Lgg0Y3Qu9C10LzQtdC90YLQvtCyLlxuICpcbiAqIEByZW1hcmtzXG4gKiDQn9GA0LjQvNC10YA6INCd0LAg0LzQsNGB0YHQuNCy0LUgWzMsIDIsIDVdINGE0YPQvdC60YbQuNGPINCx0YPQtNC10YIg0LLQvtC30LLRgNCw0YnQsNGC0Ywg0LjQvdC00LXQutGBIDAg0YEg0YfQsNGB0YLQvtGC0L7QuSA9IDMvKDMrMis1KSA9IDMvMTAsINC40L3QtNC10LrRgSAxINGBINGH0LDRgdGC0L7RgtC+0LkgPVxuICogMi8oMysyKzUpID0gMi8xMCwg0LjQvdC00LXQutGBIDIg0YEg0YfQsNGB0YLQvtGC0L7QuSA9IDUvKDMrMis1KSA9IDUvMTAuXG4gKlxuICogQHBhcmFtIGFyciAtINCn0LjRgdC70L7QstC+0Lkg0L7QtNC90L7QvNC10YDQvdGL0Lkg0LzQsNGB0YHQuNCyLCDQuNC90LTQtdC60YHRiyDQutC+0YLQvtGA0L7Qs9C+INCx0YPQtNGD0YIg0LLQvtC30LLRgNCw0YnQsNGC0YzRgdGPINGBINC/0YDQtdC00L7Qv9GA0LXQtNC10LvQtdC90L3QvtC5INGH0LDRgdGC0L7RgtC+0LkuXG4gKiBAcmV0dXJucyDQodC70YPRh9Cw0LnQvdGL0Lkg0LjQvdC00LXQutGBINC40Lcg0LzQsNGB0YHQuNCy0LAgYXJyLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcmFuZG9tUXVvdGFJbmRleChhcnI6IG51bWJlcltdKTogbnVtYmVyIHtcblxuICBsZXQgYTogbnVtYmVyW10gPSBbXVxuICBhWzBdID0gYXJyWzBdXG5cbiAgZm9yIChsZXQgaSA9IDE7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcbiAgICBhW2ldID0gYVtpIC0gMV0gKyBhcnJbaV1cbiAgfVxuXG4gIGNvbnN0IGxhc3RJbmRleDogbnVtYmVyID0gYS5sZW5ndGggLSAxXG5cbiAgbGV0IHI6IG51bWJlciA9IE1hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkgKiBhW2xhc3RJbmRleF0pKSArIDFcbiAgbGV0IGw6IG51bWJlciA9IDBcbiAgbGV0IGg6IG51bWJlciA9IGxhc3RJbmRleFxuXG4gIHdoaWxlIChsIDwgaCkge1xuICAgIGNvbnN0IG06IG51bWJlciA9IGwgKyAoKGggLSBsKSA+PiAxKTtcbiAgICAociA+IGFbbV0pID8gKGwgPSBtICsgMSkgOiAoaCA9IG0pXG4gIH1cblxuICByZXR1cm4gKGFbbF0gPj0gcikgPyBsIDogLTFcbn1cblxuXG4vKipcbiAqINCa0L7QvdCy0LXRgNGC0LjRgNGD0LXRgiDRhtCy0LXRgiDQuNC3IEhFWC3Qv9GA0LXQtNGB0YLQsNCy0LvQtdC90LjRjyDQsiDQv9GA0LXQtNGB0YLQsNCy0LvQtdC90LjQtSDRhtCy0LXRgtCwINC00LvRjyBHTFNMLdC60L7QtNCwIChSR0Ig0YEg0LTQuNCw0L/QsNC30L7QvdCw0LzQuCDQt9C90LDRh9C10L3QuNC5INC+0YIgMCDQtNC+IDEpLlxuICpcbiAqIEBwYXJhbSBoZXhDb2xvciAtINCm0LLQtdGCINCyIEhFWC3RhNC+0YDQvNCw0YLQtS5cbiAqIEByZXR1cm5zINCc0LDRgdGB0LjQsiDQuNC3INGC0YDQtdGFINGH0LjRgdC10Lsg0LIg0LTQuNCw0L/QsNC30L7QvdC1INC+0YIgMCDQtNC+IDEuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb2xvckZyb21IZXhUb0dsUmdiKGhleENvbG9yOiBzdHJpbmcpOiBudW1iZXJbXSB7XG5cbiAgbGV0IGsgPSAvXiM/KFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pJC9pLmV4ZWMoaGV4Q29sb3IpXG4gIGxldCBbciwgZywgYl0gPSBbcGFyc2VJbnQoayFbMV0sIDE2KSAvIDI1NSwgcGFyc2VJbnQoayFbMl0sIDE2KSAvIDI1NSwgcGFyc2VJbnQoayFbM10sIDE2KSAvIDI1NV1cblxuICByZXR1cm4gW3IsIGcsIGJdXG59XG5cbi8qKlxuICog0JLRi9GH0LjRgdC70Y/QtdGCINGC0LXQutGD0YnQtdC1INCy0YDQtdC80Y8uXG4gKlxuICogQHJldHVybnMg0KHRgtGA0L7QutC+0LLQsNGPINGE0L7RgNC80LDRgtC40YDQvtCy0LDQvdC90LDRjyDQt9Cw0L/QuNGB0Ywg0YLQtdC60YPRidC10LPQviDQstGA0LXQvNC10L3QuC4g0KTQvtGA0LzQsNGCOiBoaDptbTpzc1xuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q3VycmVudFRpbWUoKTogc3RyaW5nIHtcblxuICBsZXQgdG9kYXkgPSBuZXcgRGF0ZSgpO1xuXG4gIGxldCB0aW1lID1cbiAgICAoKHRvZGF5LmdldEhvdXJzKCkgPCAxMCA/ICcwJyA6ICcnKSArIHRvZGF5LmdldEhvdXJzKCkpICsgXCI6XCIgK1xuICAgICgodG9kYXkuZ2V0TWludXRlcygpIDwgMTAgPyAnMCcgOiAnJykgKyB0b2RheS5nZXRNaW51dGVzKCkpICsgXCI6XCIgK1xuICAgICgodG9kYXkuZ2V0U2Vjb25kcygpIDwgMTAgPyAnMCcgOiAnJykgKyB0b2RheS5nZXRTZWNvbmRzKCkpXG5cbiAgcmV0dXJuIHRpbWVcbn1cbiIsIi8qXG4gKiBDb3B5cmlnaHQgMjAyMSBHRlhGdW5kYW1lbnRhbHMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFJlZGlzdHJpYnV0aW9uIGFuZCB1c2UgaW4gc291cmNlIGFuZCBiaW5hcnkgZm9ybXMsIHdpdGggb3Igd2l0aG91dFxuICogbW9kaWZpY2F0aW9uLCBhcmUgcGVybWl0dGVkIHByb3ZpZGVkIHRoYXQgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zIGFyZVxuICogbWV0OlxuICpcbiAqICAgICAqIFJlZGlzdHJpYnV0aW9ucyBvZiBzb3VyY2UgY29kZSBtdXN0IHJldGFpbiB0aGUgYWJvdmUgY29weXJpZ2h0XG4gKiBub3RpY2UsIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIuXG4gKiAgICAgKiBSZWRpc3RyaWJ1dGlvbnMgaW4gYmluYXJ5IGZvcm0gbXVzdCByZXByb2R1Y2UgdGhlIGFib3ZlXG4gKiBjb3B5cmlnaHQgbm90aWNlLCB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyXG4gKiBpbiB0aGUgZG9jdW1lbnRhdGlvbiBhbmQvb3Igb3RoZXIgbWF0ZXJpYWxzIHByb3ZpZGVkIHdpdGggdGhlXG4gKiBkaXN0cmlidXRpb24uXG4gKiAgICAgKiBOZWl0aGVyIHRoZSBuYW1lIG9mIEdGWEZ1bmRhbWVudGFscy4gbm9yIHRoZSBuYW1lcyBvZiBoaXNcbiAqIGNvbnRyaWJ1dG9ycyBtYXkgYmUgdXNlZCB0byBlbmRvcnNlIG9yIHByb21vdGUgcHJvZHVjdHMgZGVyaXZlZCBmcm9tXG4gKiB0aGlzIHNvZnR3YXJlIHdpdGhvdXQgc3BlY2lmaWMgcHJpb3Igd3JpdHRlbiBwZXJtaXNzaW9uLlxuICpcbiAqIFRISVMgU09GVFdBUkUgSVMgUFJPVklERUQgQlkgVEhFIENPUFlSSUdIVCBIT0xERVJTIEFORCBDT05UUklCVVRPUlNcbiAqIFwiQVMgSVNcIiBBTkQgQU5ZIEVYUFJFU1MgT1IgSU1QTElFRCBXQVJSQU5USUVTLCBJTkNMVURJTkcsIEJVVCBOT1RcbiAqIExJTUlURUQgVE8sIFRIRSBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZIEFORCBGSVRORVNTIEZPUlxuICogQSBQQVJUSUNVTEFSIFBVUlBPU0UgQVJFIERJU0NMQUlNRUQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBDT1BZUklHSFRcbiAqIE9XTkVSIE9SIENPTlRSSUJVVE9SUyBCRSBMSUFCTEUgRk9SIEFOWSBESVJFQ1QsIElORElSRUNULCBJTkNJREVOVEFMLFxuICogU1BFQ0lBTCwgRVhFTVBMQVJZLCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVMgKElOQ0xVRElORywgQlVUIE5PVFxuICogTElNSVRFRCBUTywgUFJPQ1VSRU1FTlQgT0YgU1VCU1RJVFVURSBHT09EUyBPUiBTRVJWSUNFUzsgTE9TUyBPRiBVU0UsXG4gKiBEQVRBLCBPUiBQUk9GSVRTOyBPUiBCVVNJTkVTUyBJTlRFUlJVUFRJT04pIEhPV0VWRVIgQ0FVU0VEIEFORCBPTiBBTllcbiAqIFRIRU9SWSBPRiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQ09OVFJBQ1QsIFNUUklDVCBMSUFCSUxJVFksIE9SIFRPUlRcbiAqIChJTkNMVURJTkcgTkVHTElHRU5DRSBPUiBPVEhFUldJU0UpIEFSSVNJTkcgSU4gQU5ZIFdBWSBPVVQgT0YgVEhFIFVTRVxuICogT0YgVEhJUyBTT0ZUV0FSRSwgRVZFTiBJRiBBRFZJU0VEIE9GIFRIRSBQT1NTSUJJTElUWSBPRiBTVUNIIERBTUFHRS5cbiAqL1xuXG4vKipcbiAqIFZhcmlvdXMgMmQgbWF0aCBmdW5jdGlvbnMuXG4gKlxuICogQG1vZHVsZSB3ZWJnbC0yZC1tYXRoXG4gKi9cbihmdW5jdGlvbihyb290LCBmYWN0b3J5KSB7ICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAvLyBBTUQuIFJlZ2lzdGVyIGFzIGFuIGFub255bW91cyBtb2R1bGUuXG4gICAgZGVmaW5lKFtdLCBmYWN0b3J5KTtcbiAgfSBlbHNlIHtcbiAgICAvLyBCcm93c2VyIGdsb2JhbHNcbiAgICByb290Lm0zID0gZmFjdG9yeSgpO1xuICB9XG59KHRoaXMsIGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICAvKipcbiAgICogQW4gYXJyYXkgb3IgdHlwZWQgYXJyYXkgd2l0aCA5IHZhbHVlcy5cbiAgICogQHR5cGVkZWYge251bWJlcltdfFR5cGVkQXJyYXl9IE1hdHJpeDNcbiAgICogQG1lbWJlck9mIG1vZHVsZTp3ZWJnbC0yZC1tYXRoXG4gICAqL1xuXG4gIC8qKlxuICAgKiBUYWtlcyB0d28gTWF0cml4M3MsIGEgYW5kIGIsIGFuZCBjb21wdXRlcyB0aGUgcHJvZHVjdCBpbiB0aGUgb3JkZXJcbiAgICogdGhhdCBwcmUtY29tcG9zZXMgYiB3aXRoIGEuICBJbiBvdGhlciB3b3JkcywgdGhlIG1hdHJpeCByZXR1cm5lZCB3aWxsXG4gICAqIEBwYXJhbSB7bW9kdWxlOndlYmdsLTJkLW1hdGguTWF0cml4M30gYSBBIG1hdHJpeC5cbiAgICogQHBhcmFtIHttb2R1bGU6d2ViZ2wtMmQtbWF0aC5NYXRyaXgzfSBiIEEgbWF0cml4LlxuICAgKiBAcmV0dXJuIHttb2R1bGU6d2ViZ2wtMmQtbWF0aC5NYXRyaXgzfSB0aGUgcmVzdWx0LlxuICAgKiBAbWVtYmVyT2YgbW9kdWxlOndlYmdsLTJkLW1hdGhcbiAgICovXG4gIGZ1bmN0aW9uIG11bHRpcGx5KGEsIGIpIHtcbiAgICB2YXIgYTAwID0gYVswICogMyArIDBdO1xuICAgIHZhciBhMDEgPSBhWzAgKiAzICsgMV07XG4gICAgdmFyIGEwMiA9IGFbMCAqIDMgKyAyXTtcbiAgICB2YXIgYTEwID0gYVsxICogMyArIDBdO1xuICAgIHZhciBhMTEgPSBhWzEgKiAzICsgMV07XG4gICAgdmFyIGExMiA9IGFbMSAqIDMgKyAyXTtcbiAgICB2YXIgYTIwID0gYVsyICogMyArIDBdO1xuICAgIHZhciBhMjEgPSBhWzIgKiAzICsgMV07XG4gICAgdmFyIGEyMiA9IGFbMiAqIDMgKyAyXTtcbiAgICB2YXIgYjAwID0gYlswICogMyArIDBdO1xuICAgIHZhciBiMDEgPSBiWzAgKiAzICsgMV07XG4gICAgdmFyIGIwMiA9IGJbMCAqIDMgKyAyXTtcbiAgICB2YXIgYjEwID0gYlsxICogMyArIDBdO1xuICAgIHZhciBiMTEgPSBiWzEgKiAzICsgMV07XG4gICAgdmFyIGIxMiA9IGJbMSAqIDMgKyAyXTtcbiAgICB2YXIgYjIwID0gYlsyICogMyArIDBdO1xuICAgIHZhciBiMjEgPSBiWzIgKiAzICsgMV07XG4gICAgdmFyIGIyMiA9IGJbMiAqIDMgKyAyXTtcblxuICAgIHJldHVybiBbXG4gICAgICBiMDAgKiBhMDAgKyBiMDEgKiBhMTAgKyBiMDIgKiBhMjAsXG4gICAgICBiMDAgKiBhMDEgKyBiMDEgKiBhMTEgKyBiMDIgKiBhMjEsXG4gICAgICBiMDAgKiBhMDIgKyBiMDEgKiBhMTIgKyBiMDIgKiBhMjIsXG4gICAgICBiMTAgKiBhMDAgKyBiMTEgKiBhMTAgKyBiMTIgKiBhMjAsXG4gICAgICBiMTAgKiBhMDEgKyBiMTEgKiBhMTEgKyBiMTIgKiBhMjEsXG4gICAgICBiMTAgKiBhMDIgKyBiMTEgKiBhMTIgKyBiMTIgKiBhMjIsXG4gICAgICBiMjAgKiBhMDAgKyBiMjEgKiBhMTAgKyBiMjIgKiBhMjAsXG4gICAgICBiMjAgKiBhMDEgKyBiMjEgKiBhMTEgKyBiMjIgKiBhMjEsXG4gICAgICBiMjAgKiBhMDIgKyBiMjEgKiBhMTIgKyBiMjIgKiBhMjIsXG4gICAgXTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSAzeDMgaWRlbnRpdHkgbWF0cml4XG4gICAqIEByZXR1cm4ge21vZHVsZTp3ZWJnbDItMmQtbWF0aC5NYXRyaXgzfSBhbiBpZGVudGl0eSBtYXRyaXhcbiAgICovXG4gIGZ1bmN0aW9uIGlkZW50aXR5KCkge1xuICAgIHJldHVybiBbXG4gICAgICAxLCAwLCAwLFxuICAgICAgMCwgMSwgMCxcbiAgICAgIDAsIDAsIDEsXG4gICAgXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgMkQgcHJvamVjdGlvbiBtYXRyaXhcbiAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoIHdpZHRoIGluIHBpeGVsc1xuICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0IGhlaWdodCBpbiBwaXhlbHNcbiAgICogQHJldHVybiB7bW9kdWxlOndlYmdsLTJkLW1hdGguTWF0cml4M30gYSBwcm9qZWN0aW9uIG1hdHJpeCB0aGF0IGNvbnZlcnRzIGZyb20gcGl4ZWxzIHRvIGNsaXBzcGFjZSB3aXRoIFkgPSAwIGF0IHRoZSB0b3AuXG4gICAqIEBtZW1iZXJPZiBtb2R1bGU6d2ViZ2wtMmQtbWF0aFxuICAgKi9cbiAgZnVuY3Rpb24gcHJvamVjdGlvbih3aWR0aCwgaGVpZ2h0KSB7XG4gICAgLy8gTm90ZTogVGhpcyBtYXRyaXggZmxpcHMgdGhlIFkgYXhpcyBzbyAwIGlzIGF0IHRoZSB0b3AuXG4gICAgcmV0dXJuIFtcbiAgICAgIDIgLyB3aWR0aCwgMCwgMCxcbiAgICAgIDAsIC0yIC8gaGVpZ2h0LCAwLFxuICAgICAgLTEsIDEsIDEsXG4gICAgXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNdWx0aXBsaWVzIGJ5IGEgMkQgcHJvamVjdGlvbiBtYXRyaXhcbiAgICogQHBhcmFtIHttb2R1bGU6d2ViZ2wtMmQtbWF0aC5NYXRyaXgzfSB0aGUgbWF0cml4IHRvIGJlIG11bHRpcGxpZWRcbiAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoIHdpZHRoIGluIHBpeGVsc1xuICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0IGhlaWdodCBpbiBwaXhlbHNcbiAgICogQHJldHVybiB7bW9kdWxlOndlYmdsLTJkLW1hdGguTWF0cml4M30gdGhlIHJlc3VsdFxuICAgKiBAbWVtYmVyT2YgbW9kdWxlOndlYmdsLTJkLW1hdGhcbiAgICovXG4gIGZ1bmN0aW9uIHByb2plY3QobSwgd2lkdGgsIGhlaWdodCkge1xuICAgIHJldHVybiBtdWx0aXBseShtLCBwcm9qZWN0aW9uKHdpZHRoLCBoZWlnaHQpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgMkQgdHJhbnNsYXRpb24gbWF0cml4XG4gICAqIEBwYXJhbSB7bnVtYmVyfSB0eCBhbW91bnQgdG8gdHJhbnNsYXRlIGluIHhcbiAgICogQHBhcmFtIHtudW1iZXJ9IHR5IGFtb3VudCB0byB0cmFuc2xhdGUgaW4geVxuICAgKiBAcmV0dXJuIHttb2R1bGU6d2ViZ2wtMmQtbWF0aC5NYXRyaXgzfSBhIHRyYW5zbGF0aW9uIG1hdHJpeCB0aGF0IHRyYW5zbGF0ZXMgYnkgdHggYW5kIHR5LlxuICAgKiBAbWVtYmVyT2YgbW9kdWxlOndlYmdsLTJkLW1hdGhcbiAgICovXG4gIGZ1bmN0aW9uIHRyYW5zbGF0aW9uKHR4LCB0eSkge1xuICAgIHJldHVybiBbXG4gICAgICAxLCAwLCAwLFxuICAgICAgMCwgMSwgMCxcbiAgICAgIHR4LCB0eSwgMSxcbiAgICBdO1xuICB9XG5cbiAgLyoqXG4gICAqIE11bHRpcGxpZXMgYnkgYSAyRCB0cmFuc2xhdGlvbiBtYXRyaXhcbiAgICogQHBhcmFtIHttb2R1bGU6d2ViZ2wtMmQtbWF0aC5NYXRyaXgzfSB0aGUgbWF0cml4IHRvIGJlIG11bHRpcGxpZWRcbiAgICogQHBhcmFtIHtudW1iZXJ9IHR4IGFtb3VudCB0byB0cmFuc2xhdGUgaW4geFxuICAgKiBAcGFyYW0ge251bWJlcn0gdHkgYW1vdW50IHRvIHRyYW5zbGF0ZSBpbiB5XG4gICAqIEByZXR1cm4ge21vZHVsZTp3ZWJnbC0yZC1tYXRoLk1hdHJpeDN9IHRoZSByZXN1bHRcbiAgICogQG1lbWJlck9mIG1vZHVsZTp3ZWJnbC0yZC1tYXRoXG4gICAqL1xuICBmdW5jdGlvbiB0cmFuc2xhdGUobSwgdHgsIHR5KSB7XG4gICAgcmV0dXJuIG11bHRpcGx5KG0sIHRyYW5zbGF0aW9uKHR4LCB0eSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSAyRCByb3RhdGlvbiBtYXRyaXhcbiAgICogQHBhcmFtIHtudW1iZXJ9IGFuZ2xlSW5SYWRpYW5zIGFtb3VudCB0byByb3RhdGUgaW4gcmFkaWFuc1xuICAgKiBAcmV0dXJuIHttb2R1bGU6d2ViZ2wtMmQtbWF0aC5NYXRyaXgzfSBhIHJvdGF0aW9uIG1hdHJpeCB0aGF0IHJvdGF0ZXMgYnkgYW5nbGVJblJhZGlhbnNcbiAgICogQG1lbWJlck9mIG1vZHVsZTp3ZWJnbC0yZC1tYXRoXG4gICAqL1xuICBmdW5jdGlvbiByb3RhdGlvbihhbmdsZUluUmFkaWFucykge1xuICAgIHZhciBjID0gTWF0aC5jb3MoYW5nbGVJblJhZGlhbnMpO1xuICAgIHZhciBzID0gTWF0aC5zaW4oYW5nbGVJblJhZGlhbnMpO1xuICAgIHJldHVybiBbXG4gICAgICBjLCAtcywgMCxcbiAgICAgIHMsIGMsIDAsXG4gICAgICAwLCAwLCAxLFxuICAgIF07XG4gIH1cblxuICAvKipcbiAgICogTXVsdGlwbGllcyBieSBhIDJEIHJvdGF0aW9uIG1hdHJpeFxuICAgKiBAcGFyYW0ge21vZHVsZTp3ZWJnbC0yZC1tYXRoLk1hdHJpeDN9IHRoZSBtYXRyaXggdG8gYmUgbXVsdGlwbGllZFxuICAgKiBAcGFyYW0ge251bWJlcn0gYW5nbGVJblJhZGlhbnMgYW1vdW50IHRvIHJvdGF0ZSBpbiByYWRpYW5zXG4gICAqIEByZXR1cm4ge21vZHVsZTp3ZWJnbC0yZC1tYXRoLk1hdHJpeDN9IHRoZSByZXN1bHRcbiAgICogQG1lbWJlck9mIG1vZHVsZTp3ZWJnbC0yZC1tYXRoXG4gICAqL1xuICBmdW5jdGlvbiByb3RhdGUobSwgYW5nbGVJblJhZGlhbnMpIHtcbiAgICByZXR1cm4gbXVsdGlwbHkobSwgcm90YXRpb24oYW5nbGVJblJhZGlhbnMpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgMkQgc2NhbGluZyBtYXRyaXhcbiAgICogQHBhcmFtIHtudW1iZXJ9IHN4IGFtb3VudCB0byBzY2FsZSBpbiB4XG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzeSBhbW91bnQgdG8gc2NhbGUgaW4geVxuICAgKiBAcmV0dXJuIHttb2R1bGU6d2ViZ2wtMmQtbWF0aC5NYXRyaXgzfSBhIHNjYWxlIG1hdHJpeCB0aGF0IHNjYWxlcyBieSBzeCBhbmQgc3kuXG4gICAqIEBtZW1iZXJPZiBtb2R1bGU6d2ViZ2wtMmQtbWF0aFxuICAgKi9cbiAgZnVuY3Rpb24gc2NhbGluZyhzeCwgc3kpIHtcbiAgICByZXR1cm4gW1xuICAgICAgc3gsIDAsIDAsXG4gICAgICAwLCBzeSwgMCxcbiAgICAgIDAsIDAsIDEsXG4gICAgXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNdWx0aXBsaWVzIGJ5IGEgMkQgc2NhbGluZyBtYXRyaXhcbiAgICogQHBhcmFtIHttb2R1bGU6d2ViZ2wtMmQtbWF0aC5NYXRyaXgzfSB0aGUgbWF0cml4IHRvIGJlIG11bHRpcGxpZWRcbiAgICogQHBhcmFtIHtudW1iZXJ9IHN4IGFtb3VudCB0byBzY2FsZSBpbiB4XG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzeSBhbW91bnQgdG8gc2NhbGUgaW4geVxuICAgKiBAcmV0dXJuIHttb2R1bGU6d2ViZ2wtMmQtbWF0aC5NYXRyaXgzfSB0aGUgcmVzdWx0XG4gICAqIEBtZW1iZXJPZiBtb2R1bGU6d2ViZ2wtMmQtbWF0aFxuICAgKi9cbiAgZnVuY3Rpb24gc2NhbGUobSwgc3gsIHN5KSB7XG4gICAgcmV0dXJuIG11bHRpcGx5KG0sIHNjYWxpbmcoc3gsIHN5KSk7XG4gIH1cblxuICBmdW5jdGlvbiBkb3QoeDEsIHkxLCB4MiwgeTIpIHtcbiAgICByZXR1cm4geDEgKiB4MiArIHkxICogeTI7XG4gIH1cblxuICBmdW5jdGlvbiBkaXN0YW5jZSh4MSwgeTEsIHgyLCB5Mikge1xuICAgIHZhciBkeCA9IHgxIC0geDI7XG4gICAgdmFyIGR5ID0geTEgLSB5MjtcbiAgICByZXR1cm4gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG5vcm1hbGl6ZSh4LCB5KSB7XG4gICAgdmFyIGwgPSBkaXN0YW5jZSgwLCAwLCB4LCB5KTtcbiAgICBpZiAobCA+IDAuMDAwMDEpIHtcbiAgICAgIHJldHVybiBbeCAvIGwsIHkgLyBsXTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFswLCAwXTtcbiAgICB9XG4gIH1cblxuICAvLyBpID0gaW5jaWRlbnRcbiAgLy8gbiA9IG5vcm1hbFxuICBmdW5jdGlvbiByZWZsZWN0KGl4LCBpeSwgbngsIG55KSB7XG4gICAgLy8gSSAtIDIuMCAqIGRvdChOLCBJKSAqIE4uXG4gICAgdmFyIGQgPSBkb3QobngsIG55LCBpeCwgaXkpO1xuICAgIHJldHVybiBbXG4gICAgICBpeCAtIDIgKiBkICogbngsXG4gICAgICBpeSAtIDIgKiBkICogbnksXG4gICAgXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJhZFRvRGVnKHIpIHtcbiAgICByZXR1cm4gciAqIDE4MCAvIE1hdGguUEk7XG4gIH1cblxuICBmdW5jdGlvbiBkZWdUb1JhZChkKSB7XG4gICAgcmV0dXJuIGQgKiBNYXRoLlBJIC8gMTgwO1xuICB9XG5cbiAgZnVuY3Rpb24gdHJhbnNmb3JtUG9pbnQobSwgdikge1xuICAgIHZhciB2MCA9IHZbMF07XG4gICAgdmFyIHYxID0gdlsxXTtcbiAgICB2YXIgZCA9IHYwICogbVswICogMyArIDJdICsgdjEgKiBtWzEgKiAzICsgMl0gKyBtWzIgKiAzICsgMl07XG4gICAgcmV0dXJuIFtcbiAgICAgICh2MCAqIG1bMCAqIDMgKyAwXSArIHYxICogbVsxICogMyArIDBdICsgbVsyICogMyArIDBdKSAvIGQsXG4gICAgICAodjAgKiBtWzAgKiAzICsgMV0gKyB2MSAqIG1bMSAqIDMgKyAxXSArIG1bMiAqIDMgKyAxXSkgLyBkLFxuICAgIF07XG4gIH1cblxuICBmdW5jdGlvbiBpbnZlcnNlKG0pIHtcbiAgICB2YXIgdDAwID0gbVsxICogMyArIDFdICogbVsyICogMyArIDJdIC0gbVsxICogMyArIDJdICogbVsyICogMyArIDFdO1xuICAgIHZhciB0MTAgPSBtWzAgKiAzICsgMV0gKiBtWzIgKiAzICsgMl0gLSBtWzAgKiAzICsgMl0gKiBtWzIgKiAzICsgMV07XG4gICAgdmFyIHQyMCA9IG1bMCAqIDMgKyAxXSAqIG1bMSAqIDMgKyAyXSAtIG1bMCAqIDMgKyAyXSAqIG1bMSAqIDMgKyAxXTtcbiAgICB2YXIgZCA9IDEuMCAvIChtWzAgKiAzICsgMF0gKiB0MDAgLSBtWzEgKiAzICsgMF0gKiB0MTAgKyBtWzIgKiAzICsgMF0gKiB0MjApO1xuICAgIHJldHVybiBbXG4gICAgICAgZCAqIHQwMCwgLWQgKiB0MTAsIGQgKiB0MjAsXG4gICAgICAtZCAqIChtWzEgKiAzICsgMF0gKiBtWzIgKiAzICsgMl0gLSBtWzEgKiAzICsgMl0gKiBtWzIgKiAzICsgMF0pLFxuICAgICAgIGQgKiAobVswICogMyArIDBdICogbVsyICogMyArIDJdIC0gbVswICogMyArIDJdICogbVsyICogMyArIDBdKSxcbiAgICAgIC1kICogKG1bMCAqIDMgKyAwXSAqIG1bMSAqIDMgKyAyXSAtIG1bMCAqIDMgKyAyXSAqIG1bMSAqIDMgKyAwXSksXG4gICAgICAgZCAqIChtWzEgKiAzICsgMF0gKiBtWzIgKiAzICsgMV0gLSBtWzEgKiAzICsgMV0gKiBtWzIgKiAzICsgMF0pLFxuICAgICAgLWQgKiAobVswICogMyArIDBdICogbVsyICogMyArIDFdIC0gbVswICogMyArIDFdICogbVsyICogMyArIDBdKSxcbiAgICAgICBkICogKG1bMCAqIDMgKyAwXSAqIG1bMSAqIDMgKyAxXSAtIG1bMCAqIDMgKyAxXSAqIG1bMSAqIDMgKyAwXSksXG4gICAgXTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgZGVnVG9SYWQ6IGRlZ1RvUmFkLFxuICAgIGRpc3RhbmNlOiBkaXN0YW5jZSxcbiAgICBkb3Q6IGRvdCxcbiAgICBpZGVudGl0eTogaWRlbnRpdHksXG4gICAgaW52ZXJzZTogaW52ZXJzZSxcbiAgICBtdWx0aXBseTogbXVsdGlwbHksXG4gICAgbm9ybWFsaXplOiBub3JtYWxpemUsXG4gICAgcHJvamVjdGlvbjogcHJvamVjdGlvbixcbiAgICByYWRUb0RlZzogcmFkVG9EZWcsXG4gICAgcmVmbGVjdDogcmVmbGVjdCxcbiAgICByb3RhdGlvbjogcm90YXRpb24sXG4gICAgcm90YXRlOiByb3RhdGUsXG4gICAgc2NhbGluZzogc2NhbGluZyxcbiAgICBzY2FsZTogc2NhbGUsXG4gICAgdHJhbnNmb3JtUG9pbnQ6IHRyYW5zZm9ybVBvaW50LFxuICAgIHRyYW5zbGF0aW9uOiB0cmFuc2xhdGlvbixcbiAgICB0cmFuc2xhdGU6IHRyYW5zbGF0ZSxcbiAgICBwcm9qZWN0OiBwcm9qZWN0LFxuICB9O1xuXG59KSk7XG5cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL2luZGV4LnRzXCIpO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==