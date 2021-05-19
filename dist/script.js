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
        this.splot.webGl.canvas.addEventListener('mousedown', this.handleMouseDownWithContext);
        this.splot.webGl.canvas.addEventListener('wheel', this.handleMouseWheelWithContext);
    };
    SPlotContol.prototype.stop = function () {
        this.splot.webGl.canvas.removeEventListener('mousedown', this.handleMouseDownWithContext);
        this.splot.webGl.canvas.removeEventListener('wheel', this.handleMouseWheelWithContext);
        this.splot.webGl.canvas.removeEventListener('mousemove', this.handleMouseMoveWithContext);
        this.splot.webGl.canvas.removeEventListener('mouseup', this.handleMouseUpWithContext);
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
        var projectionMat = m3_1.default.projection(this.splot.webGl.gl.canvas.width, this.splot.webGl.gl.canvas.height);
        var cameraMat = this.makeCameraMatrix();
        var viewMat = m3_1.default.inverse(cameraMat);
        this.splot.transform.viewProjectionMat = m3_1.default.multiply(projectionMat, viewMat);
    };
    /**
     *
     */
    SPlotContol.prototype.getClipSpaceMousePosition = function (event) {
        // get canvas relative css position
        var rect = this.splot.webGl.canvas.getBoundingClientRect();
        var cssX = event.clientX - rect.left;
        var cssY = event.clientY - rect.top;
        // get normalized 0 to 1 position across and down canvas
        var normalizedX = cssX / this.splot.webGl.canvas.clientWidth;
        var normalizedY = cssY / this.splot.webGl.canvas.clientHeight;
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
        this.splot.webGl.canvas.addEventListener('mousemove', this.handleMouseMoveWithContext);
        this.splot.webGl.canvas.addEventListener('mouseup', this.handleMouseUpWithContext);
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
        this.variables = {};
        this.splot = splot;
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
        this.gl = this.canvas.getContext('webgl', this.webGlSettings);
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
    SPlotWebGl.prototype.createProgram = function (shaderVert, shaderFrag) {
        this.gpuProgram = this.gl.createProgram();
        this.gl.attachShader(this.gpuProgram, shaderVert);
        this.gl.attachShader(this.gpuProgram, shaderFrag);
        this.gl.linkProgram(this.gpuProgram);
        this.gl.useProgram(this.gpuProgram);
    };
    /**
     * Устанавливает связь переменной приложения с программой WebGl.
     *
     * @param varType Тип переменной.
     * @param varName Имя переменной.
     */
    SPlotWebGl.prototype.createVariable = function (varType, varName) {
        if (varType === 'uniform') {
            this.variables[varName] = this.gl.getUniformLocation(this.gpuProgram, varName);
        }
        else if (varType === 'attribute') {
            this.variables[varName] = this.gl.getAttribLocation(this.gpuProgram, varName);
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
        buffers[index] = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl[type], buffers[index]);
        this.gl.bufferData(this.gl[type], data, this.gl.STATIC_DRAW);
        // Счетчик памяти, занимаемой буферами данных (раздельно по каждому типу буферов)
        this.splot.buffers.sizeInBytes[key] += data.length * data.BYTES_PER_ELEMENT;
    };
    SPlotWebGl.prototype.setVariable = function (varName, varValue) {
        this.gl.uniformMatrix3fv(this.variables[varName], false, varValue);
    };
    SPlotWebGl.prototype.setBuffer = function (buffer, varName, type, size, stride, offset) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.enableVertexAttribArray(this.variables[varName]);
        this.gl.vertexAttribPointer(this.variables[varName], size, type, false, stride, offset);
    };
    SPlotWebGl.prototype.draw = function (first, count) {
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
        this.shaderCodeVert = shader_code_vert_tmpl_1.default; // Шаблон GLSL-кода для вершинного шейдера.
        this.shaderCodeFrag = shader_code_frag_tmpl_1.default; // Шаблон GLSL-кода для фрагментного шейдера.
        this.amountOfPolygons = 0; // Счетчик числа обработанных полигонов.
        this.maxAmountOfVertexInGroup = 10000; // Ограничение количества объектов в группе.
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
        this.webGl.prepare(canvasId);
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
            this.debug.logIntro(this.webGl.canvas);
            this.debug.logGpuInfo(this.webGl.gl);
            this.debug.logInstanceInfo(this.webGl.canvas, options);
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
        this.webGl.clearBackground();
        // Обновление матрицы трансформации.
        this.control.updateViewProjection();
        // Привязка матрицы трансформации к переменной шейдера.
        this.webGl.setVariable('u_matrix', this.transform.viewProjectionMat);
        // Итерирование и рендеринг групп буферов WebGL.
        for (var i = 0; i < this.buffers.amountOfBufferGroups; i++) {
            this.webGl.setBuffer(this.buffers.vertexBuffers[i], 'a_position', this.webGl.gl.FLOAT, 2, 0, 0);
            this.webGl.setBuffer(this.buffers.colorBuffers[i], 'a_color', this.webGl.gl.UNSIGNED_BYTE, 1, 0, 0);
            this.webGl.setBuffer(this.buffers.sizeBuffers[i], 'a_polygonsize', this.webGl.gl.FLOAT, 1, 0, 0);
            this.webGl.setBuffer(this.buffers.shapeBuffers[i], 'a_shape', this.webGl.gl.UNSIGNED_BYTE, 1, 0, 0);
            this.webGl.draw(0, this.buffers.amountOfGLVertices[i] / 3);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zdHlsZS5jc3MiLCJ3ZWJwYWNrOi8vLy4vaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vc2hhZGVyLWNvZGUtZnJhZy10bXBsLnRzIiwid2VicGFjazovLy8uL3NoYWRlci1jb2RlLXZlcnQtdG1wbC50cyIsIndlYnBhY2s6Ly8vLi9zcGxvdC1jb250cm9sLnRzIiwid2VicGFjazovLy8uL3NwbG90LWRlYnVnLnRzIiwid2VicGFjazovLy8uL3NwbG90LWRlbW8udHMiLCJ3ZWJwYWNrOi8vLy4vc3Bsb3Qtd2ViZ2wudHMiLCJ3ZWJwYWNrOi8vLy4vc3Bsb3QudHMiLCJ3ZWJwYWNrOi8vLy4vdXRpbHMudHMiLCJ3ZWJwYWNrOi8vLy4vbTMuanMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovLy93ZWJwYWNrL3N0YXJ0dXAiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBQSxnRkFBMkI7QUFDM0Isa0RBQWdCO0FBRWhCLFNBQVMsU0FBUyxDQUFDLEtBQWE7SUFDOUIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxLQUFLLENBQUM7QUFDMUMsQ0FBQztBQUVELElBQUksQ0FBQyxHQUFHLENBQUM7QUFDVCxJQUFJLENBQUMsR0FBRyxPQUFTLEVBQUUsOEJBQThCO0FBQ2pELElBQUksTUFBTSxHQUFHLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDO0FBQzNILElBQUksU0FBUyxHQUFHLEtBQU07QUFDdEIsSUFBSSxVQUFVLEdBQUcsS0FBTTtBQUV2QixnSEFBZ0g7QUFDaEgsU0FB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QkFBNkI7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhLDZCQUE2QjtBQUMxQyxhQUFhLE9BQU87QUFDcEIsYUFBYSxPQUFPO0FBQ3BCLGNBQWMsNkJBQTZCO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWEsT0FBTztBQUNwQixjQUFjLDZCQUE2QjtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhLDZCQUE2QjtBQUMxQyxhQUFhLE9BQU87QUFDcEIsY0FBYyw2QkFBNkI7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQixjQUFjLDZCQUE2QjtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWEsNkJBQTZCO0FBQzFDLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEIsY0FBYyw2QkFBNkI7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsQ0FBQzs7Ozs7Ozs7VUM3U0Q7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0Esc0RBQXNELGtCQUFrQjtXQUN4RTtXQUNBLCtDQUErQyxjQUFjO1dBQzdELEU7Ozs7O1VDTkE7VUFDQTtVQUNBO1VBQ0EiLCJmaWxlIjoic2NyaXB0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiaW1wb3J0IFNQbG90IGZyb20gJy4vc3Bsb3QnXG5pbXBvcnQgJ0Avc3R5bGUnXG5cbmZ1bmN0aW9uIHJhbmRvbUludChyYW5nZTogbnVtYmVyKSB7XG4gIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiByYW5nZSlcbn1cblxubGV0IGkgPSAwXG5sZXQgbiA9IDFfMDAwXzAwMCAgLy8g0JjQvNC40YLQuNGA0YPQtdC80L7QtSDRh9C40YHQu9C+INC+0LHRitC10LrRgtC+0LIuXG5sZXQgY29sb3JzID0gWycjRkYwMEZGJywgJyM4MDAwODAnLCAnI0ZGMDAwMCcsICcjODAwMDAwJywgJyNGRkZGMDAnLCAnIzAwRkYwMCcsICcjMDA4MDAwJywgJyMwMEZGRkYnLCAnIzAwMDBGRicsICcjMDAwMDgwJ11cbmxldCBwbG90V2lkdGggPSAzMl8wMDBcbmxldCBwbG90SGVpZ2h0ID0gMTZfMDAwXG5cbi8vINCf0YDQuNC80LXRgCDQuNGC0LXRgNC40YDRg9GO0YnQtdC5INGE0YPQvdC60YbQuNC4LiDQmNGC0LXRgNCw0YbQuNC4INC40LzQuNGC0LjRgNGD0Y7RgtGB0Y8g0YHQu9GD0YfQsNC50L3Ri9C80Lgg0LLRi9C00LDRh9Cw0LzQuC4g0J/QvtGH0YLQuCDRgtCw0LrQttC1INGA0LDQsdC+0YLQsNC10YIg0YDQtdC20LjQvCDQtNC10LzQvi3QtNCw0L3QvdGL0YUuXG5mdW5jdGlvbiByZWFkTmV4dE9iamVjdCgpIHtcbiAgaWYgKGkgPCBuKSB7XG4gICAgaSsrXG4gICAgcmV0dXJuIHtcbiAgICAgIHg6IHJhbmRvbUludChwbG90V2lkdGgpLFxuICAgICAgeTogcmFuZG9tSW50KHBsb3RIZWlnaHQpLFxuICAgICAgc2hhcGU6IHJhbmRvbUludCgyKSxcbiAgICAgIHNpemU6IDEwICsgcmFuZG9tSW50KDIxKSxcbiAgICAgIGNvbG9yOiByYW5kb21JbnQoY29sb3JzLmxlbmd0aCksICAvLyDQmNC90LTQtdC60YEg0YbQstC10YLQsCDQsiDQvNCw0YHRgdC40LLQtSDRhtCy0LXRgtC+0LJcbiAgICB9XG4gIH1cbiAgZWxzZVxuICAgIHJldHVybiBudWxsICAvLyDQktC+0LfQstGA0LDRidCw0LXQvCBudWxsLCDQutC+0LPQtNCwINC+0LHRitC10LrRgtGLIFwi0LfQsNC60L7QvdGH0LjQu9C40YHRjFwiXG59XG5cbi8qKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKiovXG5cbmxldCBzY2F0dGVyUGxvdCA9IG5ldyBTUGxvdCgnY2FudmFzMScpXG5cbi8vINCd0LDRgdGC0YDQvtC50LrQsCDRjdC60LfQtdC80L/Qu9GP0YDQsCDQvdCwINGA0LXQttC40Lwg0LLRi9Cy0L7QtNCwINC+0YLQu9Cw0LTQvtGH0L3QvtC5INC40L3RhNC+0YDQvNCw0YbQuNC4INCyINC60L7QvdGB0L7Qu9GMINCx0YDQsNGD0LfQtdGA0LAuXG4vLyDQlNGA0YPQs9C40LUg0L/RgNC40LzQtdGA0Ysg0YDQsNCx0L7RgtGLINC+0L/QuNGB0LDQvdGLINCyINGE0LDQudC70LUgc3Bsb3QuanMg0YHQviDRgdGC0YDQvtC60LggMjE0Llxuc2NhdHRlclBsb3Quc2V0dXAoe1xuICBpdGVyYXRvcjogcmVhZE5leHRPYmplY3QsXG4gIGNvbG9yczogY29sb3JzLFxuICBncmlkOiB7XG4gICAgd2lkdGg6IHBsb3RXaWR0aCxcbiAgICBoZWlnaHQ6IHBsb3RIZWlnaHQsXG4gIH0sXG4gIGRlYnVnOiB7XG4gICAgaXNFbmFibGU6IHRydWUsXG4gIH0sXG4gIGRlbW86IHtcbiAgICBpc0VuYWJsZTogZmFsc2UsXG4gIH0sXG4gIHVzZVZlcnRleEluZGljZXM6IGZhbHNlXG59KVxuXG5zY2F0dGVyUGxvdC5ydW4oKVxuXG4vL3NjYXR0ZXJQbG90LnN0b3AoKVxuXG4vL3NldFRpbWVvdXQoKCkgPT4gc2NhdHRlclBsb3Quc3RvcCgpLCAzMDAwKVxuIiwiZXhwb3J0IGRlZmF1bHRcbmBcbnByZWNpc2lvbiBsb3dwIGZsb2F0O1xudmFyeWluZyB2ZWMzIHZfY29sb3I7XG52YXJ5aW5nIGZsb2F0IHZfc2hhcGU7XG52b2lkIG1haW4oKSB7XG4gIGlmICh2X3NoYXBlID09IDAuMCkge1xuICAgIGZsb2F0IHZTaXplID0gMjAuMDtcbiAgICBmbG9hdCBkaXN0YW5jZSA9IGxlbmd0aCgyLjAgKiBnbF9Qb2ludENvb3JkIC0gMS4wKTtcbiAgICBpZiAoZGlzdGFuY2UgPiAxLjApIHsgZGlzY2FyZDsgfTtcbiAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KHZfY29sb3IucmdiLCAxLjApO1xuICB9XG4gIGVsc2UgaWYgKHZfc2hhcGUgPT0gMS4wKSB7XG4gICAgZ2xfRnJhZ0NvbG9yID0gdmVjNCh2X2NvbG9yLnJnYiwgMS4wKTtcbiAgfVxufVxuYFxuXG4vKipcbmV4cG9ydCBkZWZhdWx0XG4gIGBcbnByZWNpc2lvbiBsb3dwIGZsb2F0O1xudmFyeWluZyB2ZWMzIHZfY29sb3I7XG52b2lkIG1haW4oKSB7XG4gIGZsb2F0IHZTaXplID0gMjAuMDtcbiAgZmxvYXQgZGlzdGFuY2UgPSBsZW5ndGgoMi4wICogZ2xfUG9pbnRDb29yZCAtIDEuMCk7XG4gIGlmIChkaXN0YW5jZSA+IDEuMCkgeyBkaXNjYXJkOyB9XG4gIGdsX0ZyYWdDb2xvciA9IHZlYzQodl9jb2xvci5yZ2IsIDEuMCk7XG5cbiAgIHZlYzQgdUVkZ2VDb2xvciA9IHZlYzQoMC41LCAwLjUsIDAuNSwgMS4wKTtcbiBmbG9hdCB1RWRnZVNpemUgPSAxLjA7XG5cbmZsb2F0IHNFZGdlID0gc21vb3Roc3RlcChcbiAgdlNpemUgLSB1RWRnZVNpemUgLSAyLjAsXG4gIHZTaXplIC0gdUVkZ2VTaXplLFxuICBkaXN0YW5jZSAqICh2U2l6ZSArIHVFZGdlU2l6ZSlcbik7XG5nbF9GcmFnQ29sb3IgPSAodUVkZ2VDb2xvciAqIHNFZGdlKSArICgoMS4wIC0gc0VkZ2UpICogZ2xfRnJhZ0NvbG9yKTtcblxuZ2xfRnJhZ0NvbG9yLmEgPSBnbF9GcmFnQ29sb3IuYSAqICgxLjAgLSBzbW9vdGhzdGVwKFxuICAgIHZTaXplIC0gMi4wLFxuICAgIHZTaXplLFxuICAgIGRpc3RhbmNlICogdlNpemVcbikpO1xuXG59XG5gXG4qL1xuIiwiZXhwb3J0IGRlZmF1bHRcbmBcbmF0dHJpYnV0ZSB2ZWMyIGFfcG9zaXRpb247XG5hdHRyaWJ1dGUgZmxvYXQgYV9jb2xvcjtcbmF0dHJpYnV0ZSBmbG9hdCBhX3BvbHlnb25zaXplO1xuYXR0cmlidXRlIGZsb2F0IGFfc2hhcGU7XG51bmlmb3JtIG1hdDMgdV9tYXRyaXg7XG52YXJ5aW5nIHZlYzMgdl9jb2xvcjtcbnZhcnlpbmcgZmxvYXQgdl9zaGFwZTtcbnZvaWQgbWFpbigpIHtcbiAgZ2xfUG9zaXRpb24gPSB2ZWM0KCh1X21hdHJpeCAqIHZlYzMoYV9wb3NpdGlvbiwgMSkpLnh5LCAwLjAsIDEuMCk7XG4gIGdsX1BvaW50U2l6ZSA9IGFfcG9seWdvbnNpemU7XG4gIHZfc2hhcGUgPSBhX3NoYXBlO1xuICB7RVhURVJOQUwtQ09ERX1cbn1cbmBcbiIsIi8vIEB0cy1pZ25vcmVcbmltcG9ydCBtMyBmcm9tICcuL20zJ1xuaW1wb3J0IFNQbG90IGZyb20gJy4vc3Bsb3QnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNQbG90Q29udG9sIHtcblxuICBwcml2YXRlIHNwbG90OiBTUGxvdFxuXG4gIHByb3RlY3RlZCBoYW5kbGVNb3VzZURvd25XaXRoQ29udGV4dDogRXZlbnRMaXN0ZW5lciA9IHRoaXMuaGFuZGxlTW91c2VEb3duLmJpbmQodGhpcykgYXMgRXZlbnRMaXN0ZW5lclxuICBwcm90ZWN0ZWQgaGFuZGxlTW91c2VXaGVlbFdpdGhDb250ZXh0OiBFdmVudExpc3RlbmVyID0gdGhpcy5oYW5kbGVNb3VzZVdoZWVsLmJpbmQodGhpcykgYXMgRXZlbnRMaXN0ZW5lclxuICBwcm90ZWN0ZWQgaGFuZGxlTW91c2VNb3ZlV2l0aENvbnRleHQ6IEV2ZW50TGlzdGVuZXIgPSB0aGlzLmhhbmRsZU1vdXNlTW92ZS5iaW5kKHRoaXMpIGFzIEV2ZW50TGlzdGVuZXJcbiAgcHJvdGVjdGVkIGhhbmRsZU1vdXNlVXBXaXRoQ29udGV4dDogRXZlbnRMaXN0ZW5lciA9IHRoaXMuaGFuZGxlTW91c2VVcC5iaW5kKHRoaXMpIGFzIEV2ZW50TGlzdGVuZXJcblxuICBjb25zdHJ1Y3RvcihzcGxvdDogU1Bsb3QpIHtcbiAgICB0aGlzLnNwbG90ID0gc3Bsb3RcbiAgfVxuXG4gIHB1YmxpYyBydW4oKSB7XG4gICAgdGhpcy5zcGxvdC53ZWJHbC5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5oYW5kbGVNb3VzZURvd25XaXRoQ29udGV4dClcbiAgICB0aGlzLnNwbG90LndlYkdsLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCd3aGVlbCcsIHRoaXMuaGFuZGxlTW91c2VXaGVlbFdpdGhDb250ZXh0KVxuICB9XG5cbiAgcHVibGljIHN0b3AoKSB7XG4gICAgdGhpcy5zcGxvdC53ZWJHbC5jYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5oYW5kbGVNb3VzZURvd25XaXRoQ29udGV4dClcbiAgICB0aGlzLnNwbG90LndlYkdsLmNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKCd3aGVlbCcsIHRoaXMuaGFuZGxlTW91c2VXaGVlbFdpdGhDb250ZXh0KVxuICAgIHRoaXMuc3Bsb3Qud2ViR2wuY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMuaGFuZGxlTW91c2VNb3ZlV2l0aENvbnRleHQpXG4gICAgdGhpcy5zcGxvdC53ZWJHbC5jYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuaGFuZGxlTW91c2VVcFdpdGhDb250ZXh0KVxuICB9XG5cbiAgcHJvdGVjdGVkIG1ha2VDYW1lcmFNYXRyaXgoKSB7XG5cbiAgICBjb25zdCB6b29tU2NhbGUgPSAxIC8gdGhpcy5zcGxvdC5jYW1lcmEuem9vbSE7XG5cbiAgICBsZXQgY2FtZXJhTWF0ID0gbTMuaWRlbnRpdHkoKTtcbiAgICBjYW1lcmFNYXQgPSBtMy50cmFuc2xhdGUoY2FtZXJhTWF0LCB0aGlzLnNwbG90LmNhbWVyYS54LCB0aGlzLnNwbG90LmNhbWVyYS55KTtcbiAgICBjYW1lcmFNYXQgPSBtMy5zY2FsZShjYW1lcmFNYXQsIHpvb21TY2FsZSwgem9vbVNjYWxlKTtcblxuICAgIHJldHVybiBjYW1lcmFNYXQ7XG4gIH1cblxuICAvKipcbiAgICog0J7QsdC90L7QstC70Y/QtdGCINC80LDRgtGA0LjRhtGDINGC0YDQsNC90YHRhNC+0YDQvNCw0YbQuNC4LlxuICAgKlxuICAgKiBAcmVtYXJrc1xuICAgKiDQodGD0YnQtdGB0YLQstGD0LXRgiDQtNCy0LAg0LLQsNGA0LjQsNC90YLQsCDQstGL0LfQvtCy0LAg0LzQtdGC0L7QtNCwIC0g0LjQtyDQtNGA0YPQs9C+0LPQviDQvNC10YLQvtC00LAg0Y3QutC30LXQvNC/0LvRj9GA0LAgKHtAbGluayByZW5kZXJ9KSDQuCDQuNC3INC+0LHRgNCw0LHQvtGC0YfQuNC60LAg0YHQvtCx0YvRgtC40Y8g0LzRi9GI0LhcbiAgICogKHtAbGluayBoYW5kbGVNb3VzZVdoZWVsfSkuINCS0L4g0LLRgtC+0YDQvtC8INCy0LDRgNC40LDQvdGC0LUg0LjRgdC/0L7Qu9GM0LfQvtCy0LDQvdC40LUg0L7QsdGK0LXQutGC0LAgdGhpcyDQvdC10LLQvtC30LzQvtC20L3Qvi4g0JTQu9GPINGD0L3QuNCy0LXRgNGB0LDQu9GM0L3QvtGB0YLQuCDQstGL0LfQvtCy0LBcbiAgICog0LzQtdGC0L7QtNCwIC0g0LIg0L3QtdCz0L4g0LLRgdC10LPQtNCwINGP0LLQvdC+INC90LXQvtCx0YXQvtC00LjQvNC+INC/0LXRgNC10LTQsNCy0LDRgtGMINGB0YHRi9C70LrRgyDQvdCwINGN0LrQt9C10LzQv9C70Y/RgCDQutC70LDRgdGB0LAuXG4gICAqL1xuICBwdWJsaWMgdXBkYXRlVmlld1Byb2plY3Rpb24oKTogdm9pZCB7XG5cbiAgICBjb25zdCBwcm9qZWN0aW9uTWF0ID0gbTMucHJvamVjdGlvbih0aGlzLnNwbG90LndlYkdsLmdsLmNhbnZhcy53aWR0aCwgdGhpcy5zcGxvdC53ZWJHbC5nbC5jYW52YXMuaGVpZ2h0KTtcbiAgICBjb25zdCBjYW1lcmFNYXQgPSB0aGlzLm1ha2VDYW1lcmFNYXRyaXgoKTtcbiAgICBsZXQgdmlld01hdCA9IG0zLmludmVyc2UoY2FtZXJhTWF0KTtcbiAgICB0aGlzLnNwbG90LnRyYW5zZm9ybS52aWV3UHJvamVjdGlvbk1hdCA9IG0zLm11bHRpcGx5KHByb2plY3Rpb25NYXQsIHZpZXdNYXQpO1xuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqL1xuICBwcm90ZWN0ZWQgZ2V0Q2xpcFNwYWNlTW91c2VQb3NpdGlvbihldmVudDogTW91c2VFdmVudCkge1xuXG4gICAgLy8gZ2V0IGNhbnZhcyByZWxhdGl2ZSBjc3MgcG9zaXRpb25cbiAgICBjb25zdCByZWN0ID0gdGhpcy5zcGxvdC53ZWJHbC5jYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgY3NzWCA9IGV2ZW50LmNsaWVudFggLSByZWN0LmxlZnQ7XG4gICAgY29uc3QgY3NzWSA9IGV2ZW50LmNsaWVudFkgLSByZWN0LnRvcDtcblxuICAgIC8vIGdldCBub3JtYWxpemVkIDAgdG8gMSBwb3NpdGlvbiBhY3Jvc3MgYW5kIGRvd24gY2FudmFzXG4gICAgY29uc3Qgbm9ybWFsaXplZFggPSBjc3NYIC8gdGhpcy5zcGxvdC53ZWJHbC5jYW52YXMuY2xpZW50V2lkdGg7XG4gICAgY29uc3Qgbm9ybWFsaXplZFkgPSBjc3NZIC8gdGhpcy5zcGxvdC53ZWJHbC5jYW52YXMuY2xpZW50SGVpZ2h0O1xuXG4gICAgLy8gY29udmVydCB0byBjbGlwIHNwYWNlXG4gICAgY29uc3QgY2xpcFggPSBub3JtYWxpemVkWCAqIDIgLSAxO1xuICAgIGNvbnN0IGNsaXBZID0gbm9ybWFsaXplZFkgKiAtMiArIDE7XG5cbiAgICByZXR1cm4gW2NsaXBYLCBjbGlwWV07XG4gIH1cblxuICAvKipcbiAgICpcbiAgICovXG4gIHByb3RlY3RlZCBtb3ZlQ2FtZXJhKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG5cbiAgICBjb25zdCBwb3MgPSBtMy50cmFuc2Zvcm1Qb2ludChcbiAgICAgIHRoaXMuc3Bsb3QudHJhbnNmb3JtLnN0YXJ0SW52Vmlld1Byb2pNYXQsXG4gICAgICB0aGlzLmdldENsaXBTcGFjZU1vdXNlUG9zaXRpb24oZXZlbnQpXG4gICAgKTtcblxuICAgIHRoaXMuc3Bsb3QuY2FtZXJhLnggPVxuICAgICAgdGhpcy5zcGxvdC50cmFuc2Zvcm0uc3RhcnRDYW1lcmEueCEgKyB0aGlzLnNwbG90LnRyYW5zZm9ybS5zdGFydFBvc1swXSAtIHBvc1swXTtcblxuICAgIHRoaXMuc3Bsb3QuY2FtZXJhLnkgPVxuICAgICAgdGhpcy5zcGxvdC50cmFuc2Zvcm0uc3RhcnRDYW1lcmEueSEgKyB0aGlzLnNwbG90LnRyYW5zZm9ybS5zdGFydFBvc1sxXSAtIHBvc1sxXTtcblxuICAgIHRoaXMuc3Bsb3QucmVuZGVyKCk7XG4gIH1cblxuICAvKipcbiAgICog0KDQtdCw0LPQuNGA0YPQtdGCINC90LAg0LTQstC40LbQtdC90LjQtSDQvNGL0YjQuC/RgtGA0LXQutC/0LDQtNCwINCyINC80L7QvNC10L3Rgiwg0LrQvtCz0LTQsCDQtdC1L9C10LPQviDQutC70LDQstC40YjQsCDRg9C00LXRgNC20LjQstCw0LXRgtGB0Y8g0L3QsNC20LDRgtC+0LkuXG4gICAqXG4gICAqIEByZW1lcmtzXG4gICAqINCc0LXRgtC+0LQg0L/QtdGA0LXQvNC10YnQsNC10YIg0L7QsdC70LDRgdGC0Ywg0LLQuNC00LjQvNC+0YHRgtC4INC90LAg0L/Qu9C+0YHQutC+0YHRgtC4INCy0LzQtdGB0YLQtSDRgSDQtNCy0LjQttC10L3QuNC10Lwg0LzRi9GI0Lgv0YLRgNC10LrQv9Cw0LTQsC4g0JLRi9GH0LjRgdC70LXQvdC40Y8g0LLQvdGD0YLRgNC4INGB0L7QsdGL0YLQuNGPINGB0LTQtdC70LDQvdGLXG4gICAqINC80LDQutGB0LjQvNCw0LvRjNC90L4g0L/RgNC+0LjQt9Cy0L7QtNC40YLQtdC70YzQvdGL0LzQuCDQsiDRg9GJ0LXRgNCxINGH0LjRgtCw0LHQtdC70YzQvdC+0YHRgtC4INC70L7Qs9C40LrQuCDQtNC10LnRgdGC0LLQuNC5LiDQktC+INCy0L3QtdGI0L3QtdC8INC+0LHRgNCw0LHQvtGC0YfQuNC60LUg0YHQvtCx0YvRgtC40Lkg0L7QsdGK0LXQutGCIHRoaXNcbiAgICog0L3QtdC00L7RgdGC0YPQv9C10L0g0L/QvtGN0YLQvtC80YMg0LTQvtGB0YLRg9C/INC6INGN0LrQt9C10LzQv9C70Y/RgNGDINC60LvQsNGB0YHQsCDRgNC10LDQu9C40LfRg9C10YLRgdGPINGH0LXRgNC10Lcg0YHRgtCw0YLQuNGH0LXRgdC60LjQuSDQvNCw0YHRgdC40LIg0LLRgdC10YUg0YHQvtC30LTQsNC90L3Ri9GFINGN0LrQt9C10LzQv9C70Y/RgNC+0LJcbiAgICog0LrQu9Cw0YHRgdCwINC4INC40LTQtdC90YLQuNGE0LjQutCw0YLQvtGA0LAg0LrQsNC90LLQsNGB0LAsINCy0YvRgdGC0YPQv9Cw0Y7RidC10LPQviDQuNC90LTQtdC60YHQvtC8INCyINGN0YLQvtC8INC80LDRgdGB0LjQstC1LlxuICAgKlxuICAgKiBAcGFyYW0gZXZlbnQgLSDQodC+0LHRi9GC0LjQtSDQvNGL0YjQuC/RgtGA0LXQutC/0LDQtNCwLlxuICAgKi9cbiAgcHJvdGVjdGVkIGhhbmRsZU1vdXNlTW92ZShldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuICAgIHRoaXMubW92ZUNhbWVyYS5jYWxsKHRoaXMsIGV2ZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiDQoNC10LDQs9C40YDRg9C10YIg0L3QsCDQvtGC0LbQsNGC0LjQtSDQutC70LDQstC40YjQuCDQvNGL0YjQuC/RgtGA0LXQutC/0LDQtNCwLlxuICAgKlxuICAgKiBAcmVtZXJrc1xuICAgKiDQkiDQvNC+0LzQtdC90YIg0L7RgtC20LDRgtC40Y8g0LrQu9Cw0LLQuNGI0Lgg0LDQvdCw0LvQuNC3INC00LLQuNC20LXQvdC40Y8g0LzRi9GI0Lgv0YLRgNC10LrQv9Cw0LTQsCDRgSDQt9Cw0LbQsNGC0L7QuSDQutC70LDQstC40YjQtdC5INC/0YDQtdC60YDQsNGJ0LDQtdGC0YHRjy4g0JLRi9GH0LjRgdC70LXQvdC40Y8g0LLQvdGD0YLRgNC4INGB0L7QsdGL0YLQuNGPXG4gICAqINGB0LTQtdC70LDQvdGLINC80LDQutGB0LjQvNCw0LvRjNC90L4g0L/RgNC+0LjQt9Cy0L7QtNC40YLQtdC70YzQvdGL0LzQuCDQsiDRg9GJ0LXRgNCxINGH0LjRgtCw0LHQtdC70YzQvdC+0YHRgtC4INC70L7Qs9C40LrQuCDQtNC10LnRgdGC0LLQuNC5LiDQktC+INCy0L3QtdGI0L3QtdC8INC+0LHRgNCw0LHQvtGC0YfQuNC60LUg0YHQvtCx0YvRgtC40Lkg0L7QsdGK0LXQutGCXG4gICAqIHRoaXMg0L3QtdC00L7RgdGC0YPQv9C10L0g0L/QvtGN0YLQvtC80YMg0LTQvtGB0YLRg9C/INC6INGN0LrQt9C10LzQv9C70Y/RgNGDINC60LvQsNGB0YHQsCDRgNC10LDQu9C40LfRg9C10YLRgdGPINGH0LXRgNC10Lcg0YHRgtCw0YLQuNGH0LXRgdC60LjQuSDQvNCw0YHRgdC40LIg0LLRgdC10YUg0YHQvtC30LTQsNC90L3Ri9GFINGN0LrQt9C10LzQv9C70Y/RgNC+0LJcbiAgICog0LrQu9Cw0YHRgdCwINC4INC40LTQtdC90YLQuNGE0LjQutCw0YLQvtGA0LAg0LrQsNC90LLQsNGB0LAsINCy0YvRgdGC0YPQv9Cw0Y7RidC10LPQviDQuNC90LTQtdC60YHQvtC8INCyINGN0YLQvtC8INC80LDRgdGB0LjQstC1LlxuICAgKlxuICAgKiBAcGFyYW0gZXZlbnQgLSDQodC+0LHRi9GC0LjQtSDQvNGL0YjQuC/RgtGA0LXQutC/0LDQtNCwLlxuICAgKi9cbiAgcHJvdGVjdGVkIGhhbmRsZU1vdXNlVXAoZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICB0aGlzLnNwbG90LnJlbmRlcigpO1xuICAgIGV2ZW50LnRhcmdldCEucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5oYW5kbGVNb3VzZU1vdmVXaXRoQ29udGV4dCk7XG4gICAgZXZlbnQudGFyZ2V0IS5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5oYW5kbGVNb3VzZVVwV2l0aENvbnRleHQpO1xuICB9XG5cbiAgLyoqXG4gICAqINCg0LXQsNCz0LjRgNGD0LXRgiDQvdCwINC90LDQttCw0YLQuNC1INC60LvQsNCy0LjRiNC4INC80YvRiNC4L9GC0YDQtdC60L/QsNC00LAuXG4gICAqXG4gICAqIEByZW1lcmtzXG4gICAqINCSINC80L7QvNC10L3RgiDQvdCw0LbQsNGC0LjRjyDQuCDRg9C00LXRgNC20LDQvdC40Y8g0LrQu9Cw0LLQuNGI0Lgg0LfQsNC/0YPRgdC60LDQtdGC0YHRjyDQsNC90LDQu9C40Lcg0LTQstC40LbQtdC90LjRjyDQvNGL0YjQuC/RgtGA0LXQutC/0LDQtNCwICjRgSDQt9Cw0LbQsNGC0L7QuSDQutC70LDQstC40YjQtdC5KS4g0JLRi9GH0LjRgdC70LXQvdC40Y9cbiAgICog0LLQvdGD0YLRgNC4INGB0L7QsdGL0YLQuNGPINGB0LTQtdC70LDQvdGLINC80LDQutGB0LjQvNCw0LvRjNC90L4g0L/RgNC+0LjQt9Cy0L7QtNC40YLQtdC70YzQvdGL0LzQuCDQsiDRg9GJ0LXRgNCxINGH0LjRgtCw0LHQtdC70YzQvdC+0YHRgtC4INC70L7Qs9C40LrQuCDQtNC10LnRgdGC0LLQuNC5LiDQktC+INCy0L3QtdGI0L3QtdC8INC+0LHRgNCw0LHQvtGC0YfQuNC60LVcbiAgICog0YHQvtCx0YvRgtC40Lkg0L7QsdGK0LXQutGCIHRoaXMg0L3QtdC00L7RgdGC0YPQv9C10L0g0L/QvtGN0YLQvtC80YMg0LTQvtGB0YLRg9C/INC6INGN0LrQt9C10LzQv9C70Y/RgNGDINC60LvQsNGB0YHQsCDRgNC10LDQu9C40LfRg9C10YLRgdGPINGH0LXRgNC10Lcg0YHRgtCw0YLQuNGH0LXRgdC60LjQuSDQvNCw0YHRgdC40LIg0LLRgdC10YVcbiAgICog0YHQvtC30LTQsNC90L3Ri9GFINGN0LrQt9C10LzQv9C70Y/RgNC+0LIg0LrQu9Cw0YHRgdCwINC4INC40LTQtdC90YLQuNGE0LjQutCw0YLQvtGA0LAg0LrQsNC90LLQsNGB0LAsINCy0YvRgdGC0YPQv9Cw0Y7RidC10LPQviDQuNC90LTQtdC60YHQvtC8INCyINGN0YLQvtC8INC80LDRgdGB0LjQstC1LlxuICAgKlxuICAgKiBAcGFyYW0gZXZlbnQgLSDQodC+0LHRi9GC0LjQtSDQvNGL0YjQuC/RgtGA0LXQutC/0LDQtNCwLlxuICAgKi9cbiAgcHJvdGVjdGVkIGhhbmRsZU1vdXNlRG93bihldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB0aGlzLnNwbG90LndlYkdsLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLmhhbmRsZU1vdXNlTW92ZVdpdGhDb250ZXh0KTtcbiAgICB0aGlzLnNwbG90LndlYkdsLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5oYW5kbGVNb3VzZVVwV2l0aENvbnRleHQpO1xuXG4gICAgdGhpcy5zcGxvdC50cmFuc2Zvcm0uc3RhcnRJbnZWaWV3UHJvak1hdCA9IG0zLmludmVyc2UodGhpcy5zcGxvdC50cmFuc2Zvcm0udmlld1Byb2plY3Rpb25NYXQpO1xuICAgIHRoaXMuc3Bsb3QudHJhbnNmb3JtLnN0YXJ0Q2FtZXJhID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zcGxvdC5jYW1lcmEpO1xuICAgIHRoaXMuc3Bsb3QudHJhbnNmb3JtLnN0YXJ0Q2xpcFBvcyA9IHRoaXMuZ2V0Q2xpcFNwYWNlTW91c2VQb3NpdGlvbi5jYWxsKHRoaXMsIGV2ZW50KTtcbiAgICB0aGlzLnNwbG90LnRyYW5zZm9ybS5zdGFydFBvcyA9IG0zLnRyYW5zZm9ybVBvaW50KHRoaXMuc3Bsb3QudHJhbnNmb3JtLnN0YXJ0SW52Vmlld1Byb2pNYXQsIHRoaXMuc3Bsb3QudHJhbnNmb3JtLnN0YXJ0Q2xpcFBvcyk7XG4gICAgdGhpcy5zcGxvdC50cmFuc2Zvcm0uc3RhcnRNb3VzZVBvcyA9IFtldmVudC5jbGllbnRYLCBldmVudC5jbGllbnRZXTtcblxuICAgIHRoaXMuc3Bsb3QucmVuZGVyKCk7XG4gIH1cblxuICAvKipcbiAgICog0KDQtdCw0LPQuNGA0YPQtdGCINC90LAg0LfRg9C80LjRgNC+0LLQsNC90LjQtSDQvNGL0YjQuC/RgtGA0LXQutC/0LDQtNCwLlxuICAgKlxuICAgKiBAcmVtZXJrc1xuICAgKiDQkiDQvNC+0LzQtdC90YIg0LfRg9C80LjRgNC+0LLQsNC90LjRjyDQvNGL0YjQuC/RgtGA0LXQutC/0LDQtNCwINC/0YDQvtC40YHRhdC+0LTQuNGCINC30YPQvNC40YDQvtCy0LDQvdC40LUg0LrQvtC+0YDQtNC40L3QsNGC0L3QvtC5INC/0LvQvtGB0LrQvtGB0YLQuC4g0JLRi9GH0LjRgdC70LXQvdC40Y8g0LLQvdGD0YLRgNC4INGB0L7QsdGL0YLQuNGPXG4gICAqINGB0LTQtdC70LDQvdGLINC80LDQutGB0LjQvNCw0LvRjNC90L4g0L/RgNC+0LjQt9Cy0L7QtNC40YLQtdC70YzQvdGL0LzQuCDQsiDRg9GJ0LXRgNCxINGH0LjRgtCw0LHQtdC70YzQvdC+0YHRgtC4INC70L7Qs9C40LrQuCDQtNC10LnRgdGC0LLQuNC5LiDQktC+INCy0L3QtdGI0L3QtdC8INC+0LHRgNCw0LHQvtGC0YfQuNC60LUg0YHQvtCx0YvRgtC40Lkg0L7QsdGK0LXQutGCXG4gICAqIHRoaXMg0L3QtdC00L7RgdGC0YPQv9C10L0g0L/QvtGN0YLQvtC80YMg0LTQvtGB0YLRg9C/INC6INGN0LrQt9C10LzQv9C70Y/RgNGDINC60LvQsNGB0YHQsCDRgNC10LDQu9C40LfRg9C10YLRgdGPINGH0LXRgNC10Lcg0YHRgtCw0YLQuNGH0LXRgdC60LjQuSDQvNCw0YHRgdC40LIg0LLRgdC10YUg0YHQvtC30LTQsNC90L3Ri9GFINGN0LrQt9C10LzQv9C70Y/RgNC+0LJcbiAgICog0LrQu9Cw0YHRgdCwINC4INC40LTQtdC90YLQuNGE0LjQutCw0YLQvtGA0LAg0LrQsNC90LLQsNGB0LAsINCy0YvRgdGC0YPQv9Cw0Y7RidC10LPQviDQuNC90LTQtdC60YHQvtC8INCyINGN0YLQvtC8INC80LDRgdGB0LjQstC1LlxuICAgKlxuICAgKiBAcGFyYW0gZXZlbnQgLSDQodC+0LHRi9GC0LjQtSDQvNGL0YjQuC/RgtGA0LXQutC/0LDQtNCwLlxuICAgKi9cbiAgcHJvdGVjdGVkIGhhbmRsZU1vdXNlV2hlZWwoZXZlbnQ6IFdoZWVsRXZlbnQpOiB2b2lkIHtcblxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc3QgW2NsaXBYLCBjbGlwWV0gPSB0aGlzLmdldENsaXBTcGFjZU1vdXNlUG9zaXRpb24uY2FsbCh0aGlzLCBldmVudCk7XG5cbiAgICAvLyBwb3NpdGlvbiBiZWZvcmUgem9vbWluZ1xuICAgIGNvbnN0IFtwcmVab29tWCwgcHJlWm9vbVldID0gbTMudHJhbnNmb3JtUG9pbnQobTMuaW52ZXJzZSh0aGlzLnNwbG90LnRyYW5zZm9ybS52aWV3UHJvamVjdGlvbk1hdCksIFtjbGlwWCwgY2xpcFldKTtcblxuICAgIC8vIG11bHRpcGx5IHRoZSB3aGVlbCBtb3ZlbWVudCBieSB0aGUgY3VycmVudCB6b29tIGxldmVsLCBzbyB3ZSB6b29tIGxlc3Mgd2hlbiB6b29tZWQgaW4gYW5kIG1vcmUgd2hlbiB6b29tZWQgb3V0XG4gICAgY29uc3QgbmV3Wm9vbSA9IHRoaXMuc3Bsb3QuY2FtZXJhLnpvb20hICogTWF0aC5wb3coMiwgZXZlbnQuZGVsdGFZICogLTAuMDEpO1xuICAgIHRoaXMuc3Bsb3QuY2FtZXJhLnpvb20gPSBNYXRoLm1heCgwLjAwMiwgTWF0aC5taW4oMjAwLCBuZXdab29tKSk7XG5cbiAgICB0aGlzLnVwZGF0ZVZpZXdQcm9qZWN0aW9uLmNhbGwodGhpcyk7XG5cbiAgICAvLyBwb3NpdGlvbiBhZnRlciB6b29taW5nXG4gICAgY29uc3QgW3Bvc3Rab29tWCwgcG9zdFpvb21ZXSA9IG0zLnRyYW5zZm9ybVBvaW50KG0zLmludmVyc2UodGhpcy5zcGxvdC50cmFuc2Zvcm0udmlld1Byb2plY3Rpb25NYXQpLCBbY2xpcFgsIGNsaXBZXSk7XG5cbiAgICAvLyBjYW1lcmEgbmVlZHMgdG8gYmUgbW92ZWQgdGhlIGRpZmZlcmVuY2Ugb2YgYmVmb3JlIGFuZCBhZnRlclxuICAgIHRoaXMuc3Bsb3QuY2FtZXJhLnghICs9IHByZVpvb21YIC0gcG9zdFpvb21YO1xuICAgIHRoaXMuc3Bsb3QuY2FtZXJhLnkhICs9IHByZVpvb21ZIC0gcG9zdFpvb21ZO1xuXG4gICAgdGhpcy5zcGxvdC5yZW5kZXIoKTtcbiAgfVxufVxuIiwiaW1wb3J0IFNQbG90IGZyb20gJy4vc3Bsb3QnXG5pbXBvcnQgeyBqc29uU3RyaW5naWZ5LCBnZXRDdXJyZW50VGltZSB9IGZyb20gJy4vdXRpbHMnXG5cbi8qKlxuICog0KLQuNC/INC00LvRjyDQv9Cw0YDQsNC80LXRgtGA0L7QsiDRgNC10LbQuNC80LAg0L7RgtC70LDQtNC60LguXG4gKlxuICogQHBhcmFtIGlzRW5hYmxlIC0g0J/RgNC40LfQvdCw0Log0LLQutC70Y7Rh9C10L3QuNGPINC+0YLQu9Cw0LTQvtGH0L3QvtCz0L4g0YDQtdC20LjQvNCwLlxuICogQHBhcmFtIG91dHB1dCAtINCc0LXRgdGC0L4g0LLRi9Cy0L7QtNCwINC+0YLQu9Cw0LTQvtGH0L3QvtC5INC40L3RhNC+0YDQvNCw0YbQuNC4LlxuICogQHBhcmFtIGhlYWRlclN0eWxlIC0g0KHRgtC40LvRjCDQtNC70Y8g0LfQsNCz0L7Qu9C+0LLQutCwINCy0YHQtdCz0L4g0L7RgtC70LDQtNC+0YfQvdC+0LPQviDQsdC70L7QutCwLlxuICogQHBhcmFtIGdyb3VwU3R5bGUgLSDQodGC0LjQu9GMINC00LvRjyDQt9Cw0LPQvtC70L7QstC60LAg0LPRgNGD0L/Qv9C40YDQvtCy0LrQuCDQvtGC0LvQsNC00L7Rh9C90YvRhSDQtNCw0L3QvdGL0YUuXG4gKlxuICogQHRvZG8g0KDQtdCw0LvQuNC30L7QstCw0YLRjCDQtNC+0L/QvtC70L3QuNGC0LXQu9GM0L3Ri9C1INC80LXRgdGC0LAg0LLRi9Cy0L7QtNCwIG91dHB1dDogJ2NvbnNvbGUnIHwgJ2RvY3VtZW50JyB8ICdmaWxlJ1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTUGxvdERlYnVnIHtcblxuICBwdWJsaWMgaXNFbmFibGU6IGJvb2xlYW4gPSBmYWxzZVxuICBwdWJsaWMgaGVhZGVyU3R5bGU6IHN0cmluZyA9ICdmb250LXdlaWdodDogYm9sZDsgY29sb3I6ICNmZmZmZmY7IGJhY2tncm91bmQtY29sb3I6ICNjYzAwMDA7J1xuICBwdWJsaWMgZ3JvdXBTdHlsZTogc3RyaW5nID0gJ2ZvbnQtd2VpZ2h0OiBib2xkOyBjb2xvcjogI2ZmZmZmZjsnXG5cbiAgcHJpdmF0ZSBzcGxvdDogU1Bsb3RcblxuICBjb25zdHJ1Y3RvciAoc3Bsb3Q6IFNQbG90KSB7XG4gICAgdGhpcy5zcGxvdCA9IHNwbG90XG4gIH1cblxuICBwdWJsaWMgbG9nSW50cm8oY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCk6IHZvaWQge1xuICAgIGNvbnNvbGUubG9nKCclY9Ce0YLQu9Cw0LTQutCwIFNQbG90INC90LAg0L7QsdGK0LXQutGC0LUgIycgKyBjYW52YXMuaWQsIHRoaXMuaGVhZGVyU3R5bGUpXG5cbiAgICBpZiAodGhpcy5zcGxvdC5kZW1vLmlzRW5hYmxlKSB7XG4gICAgICBjb25zb2xlLmxvZygnJWPQktC60LvRjtGH0LXQvSDQtNC10LzQvtC90YHRgtGA0LDRhtC40L7QvdC90YvQuSDRgNC10LbQuNC8INC00LDQvdC90YvRhScsIHRoaXMuZ3JvdXBTdHlsZSlcbiAgICB9XG5cbiAgICBjb25zb2xlLmdyb3VwKCclY9Cf0YDQtdC00YPQv9GA0LXQttC00LXQvdC40LUnLCB0aGlzLnNwbG90LmRlYnVnLmdyb3VwU3R5bGUpXG4gICAgY29uc29sZS5sb2coJ9Ce0YLQutGA0YvRgtCw0Y8g0LrQvtC90YHQvtC70Ywg0LHRgNCw0YPQt9C10YDQsCDQuCDQtNGA0YPQs9C40LUg0LDQutGC0LjQstC90YvQtSDRgdGA0LXQtNGB0YLQstCwINC60L7QvdGC0YDQvtC70Y8g0YDQsNC30YDQsNCx0L7RgtC60Lgg0YHRg9GJ0LXRgdGC0LLQtdC90L3QviDRgdC90LjQttCw0Y7RgiDQv9GA0L7QuNC30LLQvtC00LjRgtC10LvRjNC90L7RgdGC0Ywg0LLRi9GB0L7QutC+0L3QsNCz0YDRg9C20LXQvdC90YvRhSDQv9GA0LjQu9C+0LbQtdC90LjQuS4g0JTQu9GPINC+0LHRitC10LrRgtC40LLQvdC+0LPQviDQsNC90LDQu9C40LfQsCDQv9GA0L7QuNC30LLQvtC00LjRgtC10LvRjNC90L7RgdGC0Lgg0LLRgdC1INC/0L7QtNC+0LHQvdGL0LUg0YHRgNC10LTRgdGC0LLQsCDQtNC+0LvQttC90Ysg0LHRi9GC0Ywg0L7RgtC60LvRjtGH0LXQvdGLLCDQsCDQutC+0L3RgdC+0LvRjCDQsdGA0LDRg9C30LXRgNCwINC30LDQutGA0YvRgtCwLiDQndC10LrQvtGC0L7RgNGL0LUg0LTQsNC90L3Ri9C1INC+0YLQu9Cw0LTQvtGH0L3QvtC5INC40L3RhNC+0YDQvNCw0YbQuNC4INCyINC30LDQstC40YHQuNC80L7RgdGC0Lgg0L7RgiDQuNGB0L/QvtC70YzQt9GD0LXQvNC+0LPQviDQsdGA0LDRg9C30LXRgNCwINC80L7Qs9GD0YIg0L3QtSDQvtGC0L7QsdGA0LDQttCw0YLRjNGB0Y8g0LjQu9C4INC+0YLQvtCx0YDQsNC20LDRgtGM0YHRjyDQvdC10LrQvtGA0YDQtdC60YLQvdC+LiDQodGA0LXQtNGB0YLQstC+INC+0YLQu9Cw0LTQutC4INC/0YDQvtGC0LXRgdGC0LjRgNC+0LLQsNC90L4g0LIg0LHRgNCw0YPQt9C10YDQtSBHb29nbGUgQ2hyb21lIHYuOTAnKVxuICAgIGNvbnNvbGUuZ3JvdXBFbmQoKVxuICB9XG5cbiAgcHVibGljIGxvZ0dwdUluZm8oZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCk6IHZvaWQge1xuICAgIGNvbnNvbGUuZ3JvdXAoJyVj0JLQuNC00LXQvtGB0LjRgdGC0LXQvNCwJywgdGhpcy5ncm91cFN0eWxlKVxuICAgIGxldCBleHQgPSBnbC5nZXRFeHRlbnNpb24oJ1dFQkdMX2RlYnVnX3JlbmRlcmVyX2luZm8nKVxuICAgIGxldCBncmFwaGljc0NhcmROYW1lID0gKGV4dCkgPyBnbC5nZXRQYXJhbWV0ZXIoZXh0LlVOTUFTS0VEX1JFTkRFUkVSX1dFQkdMKSA6ICdb0L3QtdC40LfQstC10YHRgtC90L5dJ1xuICAgIGNvbnNvbGUubG9nKCfQk9GA0LDRhNC40YfQtdGB0LrQsNGPINC60LDRgNGC0LA6ICcgKyBncmFwaGljc0NhcmROYW1lKVxuICAgIGNvbnNvbGUubG9nKCfQktC10YDRgdC40Y8gR0w6ICcgKyBnbC5nZXRQYXJhbWV0ZXIoZ2wuVkVSU0lPTikpXG4gICAgY29uc29sZS5ncm91cEVuZCgpXG4gIH1cblxuICBwdWJsaWMgbG9nSW5zdGFuY2VJbmZvKGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQsIG9wdGlvbnM6IFNQbG90T3B0aW9ucyk6IHZvaWQge1xuICAgIGNvbnNvbGUuZ3JvdXAoJyVj0J3QsNGB0YLRgNC+0LnQutCwINC/0LDRgNCw0LzQtdGC0YDQvtCyINGN0LrQt9C10LzQv9C70Y/RgNCwJywgdGhpcy5ncm91cFN0eWxlKVxuICAgIHtcbiAgICAgIGNvbnNvbGUuZGlyKHRoaXMpXG4gICAgICBjb25zb2xlLmxvZygn0J/QvtC70YzQt9C+0LLQsNGC0LXQu9GM0YHQutC40LUg0L3QsNGB0YLRgNC+0LnQutC4OlxcbicsIGpzb25TdHJpbmdpZnkob3B0aW9ucykpXG4gICAgICBjb25zb2xlLmxvZygn0JrQsNC90LLQsNGBOiAjJyArIGNhbnZhcy5pZClcbiAgICAgIGNvbnNvbGUubG9nKCfQoNCw0LfQvNC10YAg0LrQsNC90LLQsNGB0LA6ICcgKyBjYW52YXMud2lkdGggKyAnIHggJyArIGNhbnZhcy5oZWlnaHQgKyAnIHB4JylcbiAgICAgIGNvbnNvbGUubG9nKCfQoNCw0LfQvNC10YAg0L/Qu9C+0YHQutC+0YHRgtC4OiAnICsgdGhpcy5zcGxvdC5ncmlkLndpZHRoICsgJyB4ICcgKyB0aGlzLnNwbG90LmdyaWQuaGVpZ2h0ICsgJyBweCcpXG5cbiAgICAgIGlmICh0aGlzLnNwbG90LmRlbW8uaXNFbmFibGUpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ9Ch0L/QvtGB0L7QsSDQv9C+0LvRg9GH0LXQvdC40Y8g0LTQsNC90L3Ri9GFOiAnICsgJ9C00LXQvNC+LdC00LDQvdC90YvQtScpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmxvZygn0KHQv9C+0YHQvtCxINC/0L7Qu9GD0YfQtdC90LjRjyDQtNCw0L3QvdGL0YU6ICcgKyAn0LjRgtC10YDQuNGA0L7QstCw0L3QuNC1JylcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc29sZS5ncm91cEVuZCgpXG4gIH1cblxuICBwdWJsaWMgbG9nU2hhZGVySW5mbyhzaGFkZXJUeXBlOiBzdHJpbmcsIHNoYWRlckNvZGU6IHN0cmluZywgKTogdm9pZCB7XG4gICAgY29uc29sZS5ncm91cCgnJWPQodC+0LfQtNCw0L0g0YjQtdC50LTQtdGAIFsnICsgc2hhZGVyVHlwZSArICddJywgdGhpcy5ncm91cFN0eWxlKVxuICAgIGNvbnNvbGUubG9nKHNoYWRlckNvZGUpXG4gICAgY29uc29sZS5ncm91cEVuZCgpXG4gIH1cblxuICBwdWJsaWMgbG9nRGF0YUxvYWRpbmdTdGFydCgpOiB2b2lkIHtcbiAgICBjb25zb2xlLmxvZygnJWPQl9Cw0L/Rg9GJ0LXQvSDQv9GA0L7RhtC10YHRgSDQt9Cw0LPRgNGD0LfQutC4INC00LDQvdC90YvRhSBbJyArIGdldEN1cnJlbnRUaW1lKCkgKyAnXS4uLicsIHRoaXMuZ3JvdXBTdHlsZSlcbiAgICBjb25zb2xlLnRpbWUoJ9CU0LvQuNGC0LXQu9GM0L3QvtGB0YLRjCcpXG4gIH1cblxuICBwdWJsaWMgbG9nRGF0YUxvYWRpbmdDb21wbGV0ZShhbW91bnQ6IG51bWJlciwgbWF4QW1vdW50OiBudW1iZXIpOiB2b2lkIHtcbiAgICBjb25zb2xlLmdyb3VwKCclY9CX0LDQs9GA0YPQt9C60LAg0LTQsNC90L3Ri9GFINC30LDQstC10YDRiNC10L3QsCBbJyArIGdldEN1cnJlbnRUaW1lKCkgKyAnXScsIHRoaXMuZ3JvdXBTdHlsZSlcbiAgICBjb25zb2xlLnRpbWVFbmQoJ9CU0LvQuNGC0LXQu9GM0L3QvtGB0YLRjCcpXG4gICAgY29uc29sZS5sb2coJ9Cg0LXQt9GD0LvRjNGC0LDRgjogJyArXG4gICAgICAoKGFtb3VudCA+PSBtYXhBbW91bnQpID9cbiAgICAgICfQtNC+0YHRgtC40LPQvdGD0YIg0LfQsNC00LDQvdC90YvQuSDQu9C40LzQuNGCICgnICsgbWF4QW1vdW50LnRvTG9jYWxlU3RyaW5nKCkgKyAnKScgOlxuICAgICAgJ9C+0LHRgNCw0LHQvtGC0LDQvdGLINCy0YHQtSDQvtCx0YrQtdC60YLRiycpKVxuICAgIGNvbnNvbGUuZ3JvdXBFbmQoKVxuICB9XG5cbiAgcHVibGljIGxvZ09iamVjdFN0YXRzKGJ1ZmZlcnM6IFNQbG90QnVmZmVycywgYW1vdW50T2ZQb2x5Z29uczogbnVtYmVyKTogdm9pZCB7XG4gICAgY29uc29sZS5ncm91cCgnJWPQmtC+0Lst0LLQviDQvtCx0YrQtdC60YLQvtCyOiAnICsgYW1vdW50T2ZQb2x5Z29ucy50b0xvY2FsZVN0cmluZygpLCB0aGlzLmdyb3VwU3R5bGUpXG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc3Bsb3Quc2hhcGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBzaGFwZUNhcGN0aW9uID0gdGhpcy5zcGxvdC5zaGFwZXNbaV0ubmFtZVxuICAgICAgY29uc3Qgc2hhcGVBbW91bnQgPSBidWZmZXJzLmFtb3VudE9mU2hhcGVzW2ldXG4gICAgICBjb25zb2xlLmxvZyhzaGFwZUNhcGN0aW9uICsgJzogJyArIHNoYXBlQW1vdW50LnRvTG9jYWxlU3RyaW5nKCkgK1xuICAgICAgICAnIFt+JyArIE1hdGgucm91bmQoMTAwICogc2hhcGVBbW91bnQgLyBhbW91bnRPZlBvbHlnb25zKSArICclXScpXG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coJ9Ca0L7Quy3QstC+INGG0LLQtdGC0L7QsiDQsiDQv9Cw0LvQuNGC0YDQtTogJyArIHRoaXMuc3Bsb3QuY29sb3JzLmxlbmd0aClcbiAgICBjb25zb2xlLmdyb3VwRW5kKClcbiAgfVxuXG4gIHB1YmxpYyBsb2dHcHVNZW1TdGF0cyhidWZmZXJzOiBTUGxvdEJ1ZmZlcnMpOiB2b2lkIHtcbiAgICBsZXQgYnl0ZXNVc2VkQnlCdWZmZXJzID0gYnVmZmVycy5zaXplSW5CeXRlc1swXSArIGJ1ZmZlcnMuc2l6ZUluQnl0ZXNbMV0gKyBidWZmZXJzLnNpemVJbkJ5dGVzWzNdXG5cbiAgICBjb25zb2xlLmdyb3VwKCclY9Cg0LDRgdGF0L7QtCDQstC40LTQtdC+0L/QsNC80Y/RgtC4OiAnICsgKGJ5dGVzVXNlZEJ5QnVmZmVycyAvIDEwMDAwMDApLnRvRml4ZWQoMikudG9Mb2NhbGVTdHJpbmcoKSArICcg0JzQkScsIHRoaXMuZ3JvdXBTdHlsZSlcblxuICAgIGNvbnNvbGUubG9nKCfQkdGD0YTQtdGA0Ysg0LLQtdGA0YjQuNC9OiAnICtcbiAgICAgIChidWZmZXJzLnNpemVJbkJ5dGVzWzBdIC8gMTAwMDAwMCkudG9GaXhlZCgyKS50b0xvY2FsZVN0cmluZygpICsgJyDQnNCRJyArXG4gICAgICAnIFt+JyArIE1hdGgucm91bmQoMTAwICogYnVmZmVycy5zaXplSW5CeXRlc1swXSAvIGJ5dGVzVXNlZEJ5QnVmZmVycykgKyAnJV0nKVxuXG4gICAgY29uc29sZS5sb2coJ9CR0YPRhNC10YDRiyDRhtCy0LXRgtC+0LI6ICdcbiAgICAgICsgKGJ1ZmZlcnMuc2l6ZUluQnl0ZXNbMV0gLyAxMDAwMDAwKS50b0ZpeGVkKDIpLnRvTG9jYWxlU3RyaW5nKCkgKyAnINCc0JEnICtcbiAgICAgICcgW34nICsgTWF0aC5yb3VuZCgxMDAgKiBidWZmZXJzLnNpemVJbkJ5dGVzWzFdIC8gYnl0ZXNVc2VkQnlCdWZmZXJzKSArICclXScpXG5cbiAgICBjb25zb2xlLmxvZygn0JHRg9GE0LXRgNGLINGA0LDQt9C80LXRgNC+0LI6ICdcbiAgICAgICsgKGJ1ZmZlcnMuc2l6ZUluQnl0ZXNbM10gLyAxMDAwMDAwKS50b0ZpeGVkKDIpLnRvTG9jYWxlU3RyaW5nKCkgKyAnINCc0JEnICtcbiAgICAgICcgW34nICsgTWF0aC5yb3VuZCgxMDAgKiBidWZmZXJzLnNpemVJbkJ5dGVzWzJdIC8gYnl0ZXNVc2VkQnlCdWZmZXJzKSArICclXScpXG5cbiAgICBjb25zb2xlLmxvZygn0JrQvtC7LdCy0L4g0LPRgNGD0L/QvyDQsdGD0YTQtdGA0L7QsjogJyArIGJ1ZmZlcnMuYW1vdW50T2ZCdWZmZXJHcm91cHMudG9Mb2NhbGVTdHJpbmcoKSlcbiAgICBjb25zb2xlLmxvZygn0JrQvtC7LdCy0L4gR0wt0YLRgNC10YPQs9C+0LvRjNC90LjQutC+0LI6ICcgKyAoYnVmZmVycy5hbW91bnRPZlRvdGFsR0xWZXJ0aWNlcyAvIDMpLnRvTG9jYWxlU3RyaW5nKCkpXG4gICAgY29uc29sZS5sb2coJ9Ca0L7Quy3QstC+INCy0LXRgNGI0LjQvTogJyArIGJ1ZmZlcnMuYW1vdW50T2ZUb3RhbFZlcnRpY2VzLnRvTG9jYWxlU3RyaW5nKCkpXG5cbiAgICBjb25zb2xlLmdyb3VwRW5kKClcbiAgfVxuXG4gIHB1YmxpYyBsb2dSZW5kZXJTdGFydGVkKCkge1xuICAgIGNvbnNvbGUubG9nKCclY9Cg0LXQvdC00LXRgNC40L3QsyDQt9Cw0L/Rg9GJ0LXQvScsIHRoaXMuc3Bsb3QuZGVidWcuZ3JvdXBTdHlsZSlcbiAgfVxuXG4gIHB1YmxpYyBsb2dSZW5kZXJTdG9wZWQoKSB7XG4gICAgY29uc29sZS5sb2coJyVj0KDQtdC90LTQtdGA0LjQvdCzINC+0YHRgtCw0L3QvtCy0LvQtdC9JywgdGhpcy5zcGxvdC5kZWJ1Zy5ncm91cFN0eWxlKVxuICB9XG5cbiAgcHVibGljIGxvZ0NhbnZhc0NsZWFyZWQoKSB7XG4gICAgY29uc29sZS5sb2coJyVj0JrQvtC90YLQtdC60YHRgiDRgNC10L3QtNC10YDQuNC90LPQsCDQvtGH0LjRidC10L0gWycgKyB0aGlzLnNwbG90LmdyaWQuYmdDb2xvciArICddJywgdGhpcy5zcGxvdC5kZWJ1Zy5ncm91cFN0eWxlKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgcmFuZG9tSW50LCByYW5kb21RdW90YUluZGV4IH0gZnJvbSAnLi91dGlscydcbmltcG9ydCBTUGxvdCBmcm9tICcuL3NwbG90J1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTUGxvdERlbW8ge1xuXG4gIHB1YmxpYyBpc0VuYWJsZTogYm9vbGVhbiA9IGZhbHNlXG4gIHB1YmxpYyBhbW91bnQ6IG51bWJlciA9IDFfMDAwXzAwMFxuICBwdWJsaWMgc2hhcGVRdW90YTogbnVtYmVyW10gPSBbXVxuXG4gIHByaXZhdGUgaW5kZXg6IG51bWJlciA9IDBcbiAgcHJpdmF0ZSBzcGxvdDogU1Bsb3RcblxuICBjb25zdHJ1Y3RvcihzcGxvdDogU1Bsb3QpIHtcbiAgICB0aGlzLnNwbG90ID0gc3Bsb3RcbiAgICB0aGlzLmluaXQoKVxuICB9XG5cbiAgcHVibGljIGluaXQoKSB7XG4gICAgdGhpcy5pbmRleCA9IDBcbiAgfVxuXG4gIC8qKlxuICAgKiDQmNC80LjRgtC40YDRg9C10YIg0LjRgtC10YDQuNGA0L7QstCw0L3QuNC1INC40YHRhdC+0LTQvdGL0YUg0L7QsdGK0LXQutGC0L7Qsi5cbiAgICpcbiAgICogQHJldHVybnMg0JjQvdGE0L7RgNC80LDRhtC40Y8g0L4g0L/QvtC70LjQs9C+0L3QtSDQuNC70LggbnVsbCwg0LXRgdC70Lgg0LjRgtC10YDQuNGA0L7QstCw0L3QuNC1INC30LDQstC10YDRiNC40LvQvtGB0YwuXG4gICAqL1xuICBwdWJsaWMgZGVtb0l0ZXJhdGlvbkNhbGxiYWNrKCk6IFNQbG90UG9seWdvbiB8IG51bGwge1xuICAgIGlmICh0aGlzLmluZGV4ISA8IHRoaXMuYW1vdW50ISkge1xuICAgICAgdGhpcy5pbmRleCEgKys7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB4OiByYW5kb21JbnQodGhpcy5zcGxvdC5ncmlkLndpZHRoISksXG4gICAgICAgIHk6IHJhbmRvbUludCh0aGlzLnNwbG90LmdyaWQuaGVpZ2h0ISksXG4gICAgICAgIHNoYXBlOiByYW5kb21RdW90YUluZGV4KHRoaXMuc2hhcGVRdW90YSEpLFxuICAgICAgICBzaXplOiAxMCArIHJhbmRvbUludCgyMSksXG4gICAgICAgIGNvbG9yOiByYW5kb21JbnQodGhpcy5zcGxvdC5jb2xvcnMubGVuZ3RoKVxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRoaXMuaW5kZXggPSAwXG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IFNQbG90IGZyb20gJy4vc3Bsb3QnXG5pbXBvcnQgeyBjb2xvckZyb21IZXhUb0dsUmdiIH0gZnJvbSAnLi91dGlscydcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU1Bsb3RXZWJHbCB7XG5cbiAgcHVibGljIHdlYkdsU2V0dGluZ3M6IFdlYkdMQ29udGV4dEF0dHJpYnV0ZXMgPSB7XG4gICAgYWxwaGE6IGZhbHNlLFxuICAgIGRlcHRoOiBmYWxzZSxcbiAgICBzdGVuY2lsOiBmYWxzZSxcbiAgICBhbnRpYWxpYXM6IGZhbHNlLFxuICAgIHByZW11bHRpcGxpZWRBbHBoYTogZmFsc2UsXG4gICAgcHJlc2VydmVEcmF3aW5nQnVmZmVyOiBmYWxzZSxcbiAgICBwb3dlclByZWZlcmVuY2U6ICdoaWdoLXBlcmZvcm1hbmNlJyxcbiAgICBmYWlsSWZNYWpvclBlcmZvcm1hbmNlQ2F2ZWF0OiBmYWxzZSxcbiAgICBkZXN5bmNocm9uaXplZDogZmFsc2VcbiAgfVxuXG4gIHByaXZhdGUgc3Bsb3Q6IFNQbG90XG4gIHB1YmxpYyBjYW52YXMhOiBIVE1MQ2FudmFzRWxlbWVudFxuICBwdWJsaWMgZ2whOiBXZWJHTFJlbmRlcmluZ0NvbnRleHRcbiAgcHJpdmF0ZSBncHVQcm9ncmFtITogV2ViR0xQcm9ncmFtXG4gIHByaXZhdGUgdmFyaWFibGVzOiB7IFtrZXk6IHN0cmluZ106IGFueSB9ID0ge31cblxuICBjb25zdHJ1Y3RvcihzcGxvdDogU1Bsb3QpIHtcbiAgICB0aGlzLnNwbG90ID0gc3Bsb3RcbiAgfVxuXG4gIHB1YmxpYyBwcmVwYXJlKGNhbnZhc0lkOiBzdHJpbmcpIHtcbiAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY2FudmFzSWQpKSB7XG4gICAgICB0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNhbnZhc0lkKSBhcyBIVE1MQ2FudmFzRWxlbWVudFxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ9Ca0LDQvdCy0LDRgSDRgSDQuNC00LXQvdGC0LjRhNC40LrQsNGC0L7RgNC+0LwgXCIjJyArIGNhbnZhc0lkICsgJ1wiINC90LUg0L3QsNC50LTQtdC9IScpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqINCh0L7Qt9C00LDQtdGCINC60L7QvdGC0LXQutGB0YIg0YDQtdC90LTQtdGA0LjQvdCz0LAgV2ViR0wg0Lgg0YPRgdGC0LDQvdCw0LLQu9C40LLQsNC10YIg0LrQvtGA0YDQtdC60YLQvdGL0Lkg0YDQsNC30LzQtdGAINC+0LHQu9Cw0YHRgtC4INC/0YDQvtGB0LzQvtGC0YDQsC5cbiAgICovXG4gIHB1YmxpYyBjcmVhdGUoKTogdm9pZCB7XG5cbiAgICB0aGlzLmdsID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnd2ViZ2wnLCB0aGlzLndlYkdsU2V0dGluZ3MpIVxuXG4gICAgdGhpcy5jYW52YXMud2lkdGggPSB0aGlzLmNhbnZhcy5jbGllbnRXaWR0aFxuICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IHRoaXMuY2FudmFzLmNsaWVudEhlaWdodFxuXG4gICAgdGhpcy5nbC52aWV3cG9ydCgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KVxuICB9XG5cbiAgcHVibGljIHNldEJnQ29sb3IoY29sb3I6IHN0cmluZykge1xuICAgIGxldCBbciwgZywgYl0gPSBjb2xvckZyb21IZXhUb0dsUmdiKGNvbG9yKVxuICAgIHRoaXMuZ2wuY2xlYXJDb2xvcihyLCBnLCBiLCAwLjApXG4gIH1cblxuICBwdWJsaWMgY2xlYXJCYWNrZ3JvdW5kKCkge1xuICAgIHRoaXMuZ2wuY2xlYXIodGhpcy5nbC5DT0xPUl9CVUZGRVJfQklUKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDQodC+0LfQtNCw0LXRgiDRiNC10LnQtNC10YAgV2ViR0wuXG4gICAqXG4gICAqIEBwYXJhbSBzaGFkZXJUeXBlINCi0LjQvyDRiNC10LnQtNC10YDQsC5cbiAgICogQHBhcmFtIHNoYWRlckNvZGUg0JrQvtC0INGI0LXQudC00LXRgNCwINC90LAg0Y/Qt9GL0LrQtSBHTFNMLlxuICAgKiBAcmV0dXJucyDQodC+0LfQtNCw0L3QvdGL0Lkg0L7QsdGK0LXQutGCINGI0LXQudC00LXRgNCwLlxuICAgKi9cbiAgcHVibGljIGNyZWF0ZVNoYWRlcihzaGFkZXJUeXBlOiBXZWJHbFNoYWRlclR5cGUsIHNoYWRlckNvZGU6IHN0cmluZyk6IFdlYkdMU2hhZGVyIHtcblxuICAgIC8vINCh0L7Qt9C00LDQvdC40LUsINC/0YDQuNCy0Y/Qt9C60LAg0LrQvtC00LAg0Lgg0LrQvtC80L/QuNC70Y/RhtC40Y8g0YjQtdC50LTQtdGA0LAuXG4gICAgY29uc3Qgc2hhZGVyID0gdGhpcy5nbC5jcmVhdGVTaGFkZXIodGhpcy5nbFtzaGFkZXJUeXBlXSkhXG4gICAgdGhpcy5nbC5zaGFkZXJTb3VyY2Uoc2hhZGVyLCBzaGFkZXJDb2RlKVxuICAgIHRoaXMuZ2wuY29tcGlsZVNoYWRlcihzaGFkZXIpXG5cbiAgICBpZiAoIXRoaXMuZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKHNoYWRlciwgdGhpcy5nbC5DT01QSUxFX1NUQVRVUykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcign0J7RiNC40LHQutCwINC60L7QvNC/0LjQu9GP0YbQuNC4INGI0LXQudC00LXRgNCwIFsnICsgc2hhZGVyVHlwZSArICddLiAnICsgdGhpcy5nbC5nZXRTaGFkZXJJbmZvTG9nKHNoYWRlcikpXG4gICAgfVxuXG4gICAgcmV0dXJuIHNoYWRlclxuICB9XG5cbiAgLyoqXG4gICAqINCh0L7Qt9C00LDQtdGCINC/0YDQvtCz0YDQsNC80LzRgyBXZWJHTC5cbiAgICpcbiAgICogQHBhcmFtIHtXZWJHTFNoYWRlcn0gdmVydGV4U2hhZGVyINCS0LXRgNGI0LjQvdC90YvQuSDRiNC10LnQtNC10YAuXG4gICAqIEBwYXJhbSB7V2ViR0xTaGFkZXJ9IGZyYWdtZW50U2hhZGVyINCk0YDQsNCz0LzQtdC90YLQvdGL0Lkg0YjQtdC50LTQtdGALlxuICAgKi9cbiAgcHVibGljIGNyZWF0ZVByb2dyYW0oc2hhZGVyVmVydDogV2ViR0xTaGFkZXIsIHNoYWRlckZyYWc6IFdlYkdMU2hhZGVyKSB7XG4gICAgdGhpcy5ncHVQcm9ncmFtID0gdGhpcy5nbC5jcmVhdGVQcm9ncmFtKCkhXG4gICAgdGhpcy5nbC5hdHRhY2hTaGFkZXIodGhpcy5ncHVQcm9ncmFtLCBzaGFkZXJWZXJ0KVxuICAgIHRoaXMuZ2wuYXR0YWNoU2hhZGVyKHRoaXMuZ3B1UHJvZ3JhbSwgc2hhZGVyRnJhZylcbiAgICB0aGlzLmdsLmxpbmtQcm9ncmFtKHRoaXMuZ3B1UHJvZ3JhbSlcbiAgICB0aGlzLmdsLnVzZVByb2dyYW0odGhpcy5ncHVQcm9ncmFtKVxuICB9XG5cbiAgLyoqXG4gICAqINCj0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdGCINGB0LLRj9C30Ywg0L/QtdGA0LXQvNC10L3QvdC+0Lkg0L/RgNC40LvQvtC20LXQvdC40Y8g0YEg0L/RgNC+0LPRgNCw0LzQvNC+0LkgV2ViR2wuXG4gICAqXG4gICAqIEBwYXJhbSB2YXJUeXBlINCi0LjQvyDQv9C10YDQtdC80LXQvdC90L7QuS5cbiAgICogQHBhcmFtIHZhck5hbWUg0JjQvNGPINC/0LXRgNC10LzQtdC90L3QvtC5LlxuICAgKi9cbiAgcHVibGljIGNyZWF0ZVZhcmlhYmxlKHZhclR5cGU6IFdlYkdsVmFyaWFibGVUeXBlLCB2YXJOYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAodmFyVHlwZSA9PT0gJ3VuaWZvcm0nKSB7XG4gICAgICB0aGlzLnZhcmlhYmxlc1t2YXJOYW1lXSA9IHRoaXMuZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHRoaXMuZ3B1UHJvZ3JhbSwgdmFyTmFtZSlcbiAgICB9IGVsc2UgaWYgKHZhclR5cGUgPT09ICdhdHRyaWJ1dGUnKSB7XG4gICAgICB0aGlzLnZhcmlhYmxlc1t2YXJOYW1lXSA9IHRoaXMuZ2wuZ2V0QXR0cmliTG9jYXRpb24odGhpcy5ncHVQcm9ncmFtLCB2YXJOYW1lKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDQodC+0LfQtNCw0LXRgiDQsiDQvNCw0YHRgdC40LLQtSDQsdGD0YTQtdGA0L7QsiBXZWJHTCDQvdC+0LLRi9C5INCx0YPRhNC10YAg0Lgg0LfQsNC/0LjRgdGL0LLQsNC10YIg0LIg0L3QtdCz0L4g0L/QtdGA0LXQtNCw0L3QvdGL0LUg0LTQsNC90L3Ri9C1LlxuICAgKlxuICAgKiBAcGFyYW0gYnVmZmVycyAtINCc0LDRgdGB0LjQsiDQsdGD0YTQtdGA0L7QsiBXZWJHTCwg0LIg0LrQvtGC0L7RgNGL0Lkg0LHRg9C00LXRgiDQtNC+0LHQsNCy0LvQtdC9INGB0L7Qt9C00LDQstCw0LXQvNGL0Lkg0LHRg9GE0LXRgC5cbiAgICogQHBhcmFtIHR5cGUgLSDQotC40L8g0YHQvtC30LTQsNCy0LDQtdC80L7Qs9C+INCx0YPRhNC10YDQsC5cbiAgICogQHBhcmFtIGRhdGEgLSDQlNCw0L3QvdGL0LUg0LIg0LLQuNC00LUg0YLQuNC/0LjQt9C40YDQvtCy0LDQvdC90L7Qs9C+INC80LDRgdGB0LjQstCwINC00LvRjyDQt9Cw0L/QuNGB0Lgg0LIg0YHQvtC30LTQsNCy0LDQtdC80YvQuSDQsdGD0YTQtdGALlxuICAgKiBAcGFyYW0ga2V5IC0g0JrQu9GO0YcgKNC40L3QtNC10LrRgSksINC40LTQtdC90YLQuNGE0LjRhtC40YDRg9GO0YnQuNC5INGC0LjQvyDQsdGD0YTQtdGA0LAgKNC00LvRjyDQstC10YDRiNC40L0sINC00LvRjyDRhtCy0LXRgtC+0LIsINC00LvRjyDQuNC90LTQtdC60YHQvtCyKS4g0JjRgdC/0L7Qu9GM0LfRg9C10YLRgdGPINC00LvRj1xuICAgKiAgICAg0YDQsNC30LTQtdC70YzQvdC+0LPQviDQv9C+0LTRgdGH0LXRgtCwINC/0LDQvNGP0YLQuCwg0LfQsNC90LjQvNCw0LXQvNC+0Lkg0LrQsNC20LTRi9C8INGC0LjQv9C+0Lwg0LHRg9GE0LXRgNCwLlxuICAgKi9cbiAgcHVibGljIGNyZWF0ZUJ1ZmZlcihidWZmZXJzOiBXZWJHTEJ1ZmZlcltdLCB0eXBlOiBXZWJHbEJ1ZmZlclR5cGUsIGRhdGE6IFR5cGVkQXJyYXksIGtleTogbnVtYmVyKTogdm9pZCB7XG5cbiAgICAvLyDQntC/0YDQtdC00LXQu9C10L3QuNC1INC40L3QtNC10LrRgdCwINC90L7QstC+0LPQviDRjdC70LXQvNC10L3RgtCwINCyINC80LDRgdGB0LjQstC1INCx0YPRhNC10YDQvtCyIFdlYkdMLlxuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5zcGxvdC5idWZmZXJzLmFtb3VudE9mQnVmZmVyR3JvdXBzXG5cbiAgICAvLyDQodC+0LfQtNCw0L3QuNC1INC4INC30LDQv9C+0LvQvdC10L3QuNC1INC00LDQvdC90YvQvNC4INC90L7QstC+0LPQviDQsdGD0YTQtdGA0LAuXG4gICAgYnVmZmVyc1tpbmRleF0gPSB0aGlzLmdsLmNyZWF0ZUJ1ZmZlcigpIVxuICAgIHRoaXMuZ2wuYmluZEJ1ZmZlcih0aGlzLmdsW3R5cGVdLCBidWZmZXJzW2luZGV4XSlcbiAgICB0aGlzLmdsLmJ1ZmZlckRhdGEodGhpcy5nbFt0eXBlXSwgZGF0YSwgdGhpcy5nbC5TVEFUSUNfRFJBVylcblxuICAgIC8vINCh0YfQtdGC0YfQuNC6INC/0LDQvNGP0YLQuCwg0LfQsNC90LjQvNCw0LXQvNC+0Lkg0LHRg9GE0LXRgNCw0LzQuCDQtNCw0L3QvdGL0YUgKNGA0LDQt9C00LXQu9GM0L3QviDQv9C+INC60LDQttC00L7QvNGDINGC0LjQv9GDINCx0YPRhNC10YDQvtCyKVxuICAgIHRoaXMuc3Bsb3QuYnVmZmVycy5zaXplSW5CeXRlc1trZXldICs9IGRhdGEubGVuZ3RoICogZGF0YS5CWVRFU19QRVJfRUxFTUVOVFxuICB9XG5cbiAgcHVibGljIHNldFZhcmlhYmxlKHZhck5hbWU6IHN0cmluZywgdmFyVmFsdWU6IG51bWJlcltdKSB7XG4gICAgdGhpcy5nbC51bmlmb3JtTWF0cml4M2Z2KHRoaXMudmFyaWFibGVzW3Zhck5hbWVdLCBmYWxzZSwgdmFyVmFsdWUpXG4gIH1cblxuICBwdWJsaWMgc2V0QnVmZmVyKGJ1ZmZlcjogV2ViR0xCdWZmZXIsIHZhck5hbWU6IHN0cmluZywgdHlwZTogbnVtYmVyLCBzaXplOiBudW1iZXIsIHN0cmlkZTogbnVtYmVyLCBvZmZzZXQ6IG51bWJlcikge1xuICAgIHRoaXMuZ2wuYmluZEJ1ZmZlcih0aGlzLmdsLkFSUkFZX0JVRkZFUiwgYnVmZmVyKVxuICAgIHRoaXMuZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkodGhpcy52YXJpYWJsZXNbdmFyTmFtZV0pXG4gICAgdGhpcy5nbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKHRoaXMudmFyaWFibGVzW3Zhck5hbWVdLCBzaXplLCB0eXBlLCBmYWxzZSwgc3RyaWRlLCBvZmZzZXQpXG4gIH1cblxuICBwdWJsaWMgZHJhdyhmaXJzdDogbnVtYmVyLCBjb3VudDogbnVtYmVyKSB7XG4gICAgdGhpcy5nbC5kcmF3QXJyYXlzKHRoaXMuZ2wuUE9JTlRTLCBmaXJzdCwgY291bnQpXG4gIH1cbn1cbiIsImltcG9ydCB7IGNvcHlNYXRjaGluZ0tleVZhbHVlcywgY29sb3JGcm9tSGV4VG9HbFJnYiB9IGZyb20gJy4vdXRpbHMnXG5pbXBvcnQgU0hBREVSX0NPREVfVkVSVF9UTVBMIGZyb20gJy4vc2hhZGVyLWNvZGUtdmVydC10bXBsJ1xuaW1wb3J0IFNIQURFUl9DT0RFX0ZSQUdfVE1QTCBmcm9tICcuL3NoYWRlci1jb2RlLWZyYWctdG1wbCdcbmltcG9ydCBTUGxvdENvbnRvbCBmcm9tICcuL3NwbG90LWNvbnRyb2wnXG5pbXBvcnQgU1Bsb3RXZWJHbCBmcm9tICcuL3NwbG90LXdlYmdsJ1xuaW1wb3J0IFNQbG90RGVidWcgZnJvbSAnLi9zcGxvdC1kZWJ1ZydcbmltcG9ydCBTUGxvdERlbW8gZnJvbSAnLi9zcGxvdC1kZW1vJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTUGxvdCB7XG5cbiAgcHVibGljIGl0ZXJhdG9yOiBTUGxvdEl0ZXJhdG9yID0gdW5kZWZpbmVkICAgICAgICAgLy8g0KTRg9C90LrRhtC40Y8g0LjRgtC10YDQuNGA0L7QstCw0L3QuNGPINC40YHRhdC+0LTQvdGL0YUg0LTQsNC90L3Ri9GFLlxuICBwdWJsaWMgZGVtbzogU1Bsb3REZW1vID0gbmV3IFNQbG90RGVtbyh0aGlzKSAgICAgICAvLyDQpdC10LvQv9C10YAg0YDQtdC20LjQvNCwINC00LXQvNC+LdC00LDQvdC90YvRhS5cbiAgcHVibGljIHdlYkdsOiBTUGxvdFdlYkdsID0gbmV3IFNQbG90V2ViR2wodGhpcykgICAgLy8g0KXQtdC70L/QtdGAIFdlYkdMLlxuICBwdWJsaWMgZGVidWc6IFNQbG90RGVidWcgPSBuZXcgU1Bsb3REZWJ1Zyh0aGlzKSAgICAvLyDQpdC10LvQv9C10YAg0YDQtdC20LjQvNCwINC+0YLQu9Cw0LTQutC4XG4gIHB1YmxpYyBmb3JjZVJ1bjogYm9vbGVhbiA9IGZhbHNlICAgICAgICAgICAgICAgICAgIC8vINCf0YDQuNC30L3QsNC6INGE0L7RgNGB0LjRgNC+0LLQsNC90L3QvtCz0L4g0LfQsNC/0YPRgdC60LAg0YDQtdC90LTQtdGA0LAuXG4gIHB1YmxpYyBsaW1pdDogbnVtYmVyID0gMV8wMDBfMDAwXzAwMCAgICAgICAgICAgICAgIC8vINCe0LPRgNCw0L3QuNGH0LXQvdC40LUg0LrQvtC7LdCy0LAg0L7QsdGK0LXQutGC0L7QsiDQvdCwINCz0YDQsNGE0LjQutC1LlxuICBwdWJsaWMgaXNSdW5uaW5nOiBib29sZWFuID0gZmFsc2UgICAgICAgICAgICAgICAgICAvLyDQn9GA0LjQt9C90LDQuiDQsNC60YLQuNCy0L3QvtCz0L4g0L/RgNC+0YbQtdGB0YHQsCDRgNC10L3QtNC10YDQsC5cblxuICAvLyDQptCy0LXRgtC+0LLQsNGPINC/0LDQu9C40YLRgNCwINC+0LHRitC10LrRgtC+0LIuXG4gIHB1YmxpYyBjb2xvcnM6IHN0cmluZ1tdID0gW1xuICAgICcjRkYwMEZGJywgJyM4MDAwODAnLCAnI0ZGMDAwMCcsICcjODAwMDAwJywgJyNGRkZGMDAnLFxuICAgICcjMDBGRjAwJywgJyMwMDgwMDAnLCAnIzAwRkZGRicsICcjMDAwMEZGJywgJyMwMDAwODAnXG4gIF1cblxuICAvLyDQn9Cw0YDQsNC80LXRgtGA0Ysg0LrQvtC+0YDQtNC40L3QsNGC0L3QvtC5INC/0LvQvtGB0LrQvtGB0YLQuC5cbiAgcHVibGljIGdyaWQ6IFNQbG90R3JpZCA9IHtcbiAgICB3aWR0aDogMzJfMDAwLFxuICAgIGhlaWdodDogMTZfMDAwLFxuICAgIGJnQ29sb3I6ICcjZmZmZmZmJyxcbiAgICBydWxlc0NvbG9yOiAnI2MwYzBjMCdcbiAgfVxuXG4gIC8vINCf0LDRgNCw0LzQtdGC0YDRiyDQvtCx0LvQsNGB0YLQuCDQv9GA0L7RgdC80L7RgtGA0LAuXG4gIHB1YmxpYyBjYW1lcmE6IFNQbG90Q2FtZXJhID0ge1xuICAgIHg6IHRoaXMuZ3JpZC53aWR0aCEgLyAyLFxuICAgIHk6IHRoaXMuZ3JpZC5oZWlnaHQhIC8gMixcbiAgICB6b29tOiAxXG4gIH1cblxuICBwdWJsaWMgcmVhZG9ubHkgc2hhcGVzOiB7IG5hbWU6IHN0cmluZyB9W10gPSBbXVxuICBwcm90ZWN0ZWQgc2hhZGVyQ29kZVZlcnQ6IHN0cmluZyA9IFNIQURFUl9DT0RFX1ZFUlRfVE1QTCAgICAgICAgIC8vINCo0LDQsdC70L7QvSBHTFNMLdC60L7QtNCwINC00LvRjyDQstC10YDRiNC40L3QvdC+0LPQviDRiNC10LnQtNC10YDQsC5cbiAgcHJvdGVjdGVkIHNoYWRlckNvZGVGcmFnOiBzdHJpbmcgPSBTSEFERVJfQ09ERV9GUkFHX1RNUEwgICAgICAgICAvLyDQqNCw0LHQu9C+0L0gR0xTTC3QutC+0LTQsCDQtNC70Y8g0YTRgNCw0LPQvNC10L3RgtC90L7Qs9C+INGI0LXQudC00LXRgNCwLlxuICBwcm90ZWN0ZWQgYW1vdW50T2ZQb2x5Z29uczogbnVtYmVyID0gMCAgICAgICAgICAgICAgICAgICAgLy8g0KHRh9C10YLRh9C40Log0YfQuNGB0LvQsCDQvtCx0YDQsNCx0L7RgtCw0L3QvdGL0YUg0L/QvtC70LjQs9C+0L3QvtCyLlxuICBwcm90ZWN0ZWQgbWF4QW1vdW50T2ZWZXJ0ZXhJbkdyb3VwOiBudW1iZXIgPSAxMF8wMDAgICAgICAgLy8g0J7Qs9GA0LDQvdC40YfQtdC90LjQtSDQutC+0LvQuNGH0LXRgdGC0LLQsCDQvtCx0YrQtdC60YLQvtCyINCyINCz0YDRg9C/0L/QtS5cblxuICBwcm90ZWN0ZWQgY29udHJvbDogU1Bsb3RDb250b2wgPSBuZXcgU1Bsb3RDb250b2wodGhpcykgICAgLy8g0J7QsdGK0LXQutGCINGD0L/RgNCw0LLQu9C10L3QuNGPINCz0YDQsNGE0LjQutC+0Lwg0YPRgdGC0YDQvtC50YHRgtCy0LDQvNC4INCy0LLQvtC00LAuXG5cbiAgLy8g0KLQtdGF0L3QuNGH0LXRgdC60LDRjyDQuNC90YTQvtGA0LzQsNGG0LjRjywg0LjRgdC/0L7Qu9GM0LfRg9C10LzQsNGPINC/0YDQuNC70L7QttC10L3QuNC10Lwg0LTQu9GPINGA0LDRgdGH0LXRgtCwINGC0YDQsNC90YHRhNC+0YDQvNCw0YbQuNC5LlxuICBwdWJsaWMgdHJhbnNmb3JtOiBTUGxvdFRyYW5zZm9ybSA9IHtcbiAgICB2aWV3UHJvamVjdGlvbk1hdDogW10sXG4gICAgc3RhcnRJbnZWaWV3UHJvak1hdDogW10sXG4gICAgc3RhcnRDYW1lcmE6IHt4OiAwLCB5OiAwLCB6b29tOiAxfSxcbiAgICBzdGFydFBvczogW10sXG4gICAgc3RhcnRDbGlwUG9zOiBbXSxcbiAgICBzdGFydE1vdXNlUG9zOiBbXVxuICB9XG5cbiAgLy8g0JjQvdGE0L7RgNC80LDRhtC40Y8g0L4g0LHRg9GE0LXRgNCw0YUsINGF0YDQsNC90Y/RidC40YUg0LTQsNC90L3Ri9C1INC00LvRjyDQstC40LTQtdC+0L/QsNC80Y/RgtC4LlxuICBwdWJsaWMgYnVmZmVyczogU1Bsb3RCdWZmZXJzID0ge1xuICAgIHZlcnRleEJ1ZmZlcnM6IFtdLFxuICAgIGNvbG9yQnVmZmVyczogW10sXG4gICAgc2l6ZUJ1ZmZlcnM6IFtdLFxuICAgIHNoYXBlQnVmZmVyczogW10sXG4gICAgYW1vdW50T2ZHTFZlcnRpY2VzOiBbXSxcbiAgICBhbW91bnRPZlNoYXBlczogW10sXG4gICAgYW1vdW50T2ZCdWZmZXJHcm91cHM6IDAsXG4gICAgYW1vdW50T2ZUb3RhbFZlcnRpY2VzOiAwLFxuICAgIGFtb3VudE9mVG90YWxHTFZlcnRpY2VzOiAwLFxuICAgIHNpemVJbkJ5dGVzOiBbMCwgMCwgMCwgMF1cbiAgfVxuXG4gIC8qKlxuICAgKiDQodC+0LfQtNCw0LXRgiDRjdC60LfQtdC80L/Qu9GP0YAg0LrQu9Cw0YHRgdCwLCDQuNC90LjRhtC40LDQu9C40LfQuNGA0YPQtdGCINC90LDRgdGC0YDQvtC50LrQuC5cbiAgICpcbiAgICogQHJlbWFya3NcbiAgICog0JXRgdC70Lgg0LrQsNC90LLQsNGBINGBINC30LDQtNCw0L3QvdGL0Lwg0LjQtNC10L3RgtC40YTQuNC60LDRgtC+0YDQvtC8INC90LUg0L3QsNC50LTQtdC9IC0g0LPQtdC90LXRgNC40YDRg9C10YLRgdGPINC+0YjQuNCx0LrQsC4g0J3QsNGB0YLRgNC+0LnQutC4INC80L7Qs9GD0YIg0LHRi9GC0Ywg0LfQsNC00LDQvdGLINC60LDQuiDQslxuICAgKiDQutC+0L3RgdGC0YDRg9C60YLQvtGA0LUsINGC0LDQuiDQuCDQsiDQvNC10YLQvtC00LUge0BsaW5rIHNldHVwfS4g0J7QtNC90LDQutC+INCyINC70Y7QsdC+0Lwg0YHQu9GD0YfQsNC1INC90LDRgdGC0YDQvtC50LrQuCDQtNC+0LvQttC90Ysg0LHRi9GC0Ywg0LfQsNC00LDQvdGLINC00L4g0LfQsNC/0YPRgdC60LAg0YDQtdC90LTQtdGA0LAuXG4gICAqXG4gICAqIEBwYXJhbSBjYW52YXNJZCAtINCY0LTQtdC90YLQuNGE0LjQutCw0YLQvtGAINC60LDQvdCy0LDRgdCwLCDQvdCwINC60L7RgtC+0YDQvtC8INCx0YPQtNC10YIg0YDQuNGB0L7QstCw0YLRjNGB0Y8g0LPRgNCw0YTQuNC6LlxuICAgKiBAcGFyYW0gb3B0aW9ucyAtINCf0L7Qu9GM0LfQvtCy0LDRgtC10LvRjNGB0LrQuNC1INC90LDRgdGC0YDQvtC50LrQuCDRjdC60LfQtdC80L/Qu9GP0YDQsC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGNhbnZhc0lkOiBzdHJpbmcsIG9wdGlvbnM/OiBTUGxvdE9wdGlvbnMpIHtcblxuICAgIHRoaXMud2ViR2wucHJlcGFyZShjYW52YXNJZClcblxuICAgIC8vINCU0L7QsdCw0LLQu9C10L3QuNC1INGE0L7RgNC80Ysg0LIg0LzQsNGB0YHQuNCyINGE0L7RgNC8LlxuICAgIHRoaXMuc2hhcGVzLnB1c2goe1xuICAgICAgbmFtZTogJ9Ci0L7Rh9C60LAnXG4gICAgfSlcbiAgICAvLyDQlNC+0LHQsNCy0LvQtdC90LjQtSDRhNC+0YDQvNGLINCyINC80LDRgdGB0LjQsiDRh9Cw0YHRgtC+0YIg0L/QvtGP0LLQu9C10L3QuNGPINCyINC00LXQvNC+LdGA0LXQttC40LzQtS5cbiAgICB0aGlzLmRlbW8uc2hhcGVRdW90YSEucHVzaCgxKVxuXG4gICAgaWYgKG9wdGlvbnMpIHtcbiAgICAgIHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKSAgICAvLyDQldGB0LvQuCDQv9C10YDQtdC00LDQvdGLINC90LDRgdGC0YDQvtC50LrQuCwg0YLQviDQvtC90Lgg0L/RgNC40LzQtdC90Y/RjtGC0YHRjy5cblxuICAgICAgaWYgKHRoaXMuZm9yY2VSdW4pIHtcbiAgICAgICAgdGhpcy5zZXR1cChvcHRpb25zKSAgICAgICAvLyAg0JjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y8g0LLRgdC10YUg0L/QsNGA0LDQvNC10YLRgNC+0LIg0YDQtdC90LTQtdGA0LAsINC10YHQu9C4INC30LDQv9GA0L7RiNC10L0g0YTQvtGA0YHQuNGA0L7QstCw0L3QvdGL0Lkg0LfQsNC/0YPRgdC6LlxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDQmNC90LjRhtC40LDQu9C40LfQuNGA0YPQtdGCINC90LXQvtCx0YXQvtC00LjQvNGL0LUg0LTQu9GPINGA0LXQvdC00LXRgNCwINC/0LDRgNCw0LzQtdGC0YDRiyDRjdC60LfQtdC80L/Qu9GP0YDQsCDQuCBXZWJHTC5cbiAgICpcbiAgICogQHBhcmFtIG9wdGlvbnMgLSDQn9C+0LvRjNC30L7QstCw0YLQtdC70YzRgdC60LjQtSDQvdCw0YHRgtGA0L7QudC60Lgg0Y3QutC30LXQvNC/0LvRj9GA0LAuXG4gICAqL1xuICBwdWJsaWMgc2V0dXAob3B0aW9uczogU1Bsb3RPcHRpb25zKTogdm9pZCB7XG5cbiAgICB0aGlzLnNldE9wdGlvbnMob3B0aW9ucykgICAgIC8vINCf0YDQuNC80LXQvdC10L3QuNC1INC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjNGB0LrQuNGFINC90LDRgdGC0YDQvtC10LouXG4gICAgdGhpcy53ZWJHbC5jcmVhdGUoKSAgICAgICAgICAgICAgLy8g0KHQvtC30LTQsNC90LjQtSDQutC+0L3RgtC10LrRgdGC0LAg0YDQtdC90LTQtdGA0LjQvdCz0LAuXG4gICAgdGhpcy5hbW91bnRPZlBvbHlnb25zID0gMCAgICAvLyDQntCx0L3Rg9C70LXQvdC40LUg0YHRh9C10YLRh9C40LrQsCDQv9C+0LvQuNCz0L7QvdC+0LIuXG4gICAgdGhpcy5kZW1vLmluaXQoKSAgICAgIC8vINCe0LHQvdGD0LvQtdC90LjQtSDRgtC10YXQvdC40YfQtdGB0LrQvtCz0L4g0YHRh9C10YLRh9C40LrQsCDRgNC10LbQuNC80LAg0LTQtdC80L4t0LTQsNC90L3Ri9GFLlxuXG4gICAgZm9yIChjb25zdCBrZXkgaW4gdGhpcy5zaGFwZXMpIHtcbiAgICAgIHRoaXMuYnVmZmVycy5hbW91bnRPZlNoYXBlc1trZXldID0gMCAgICAvLyDQntCx0L3Rg9C70LXQvdC40LUg0YHRh9C10YLRh9C40LrQvtCyINGE0L7RgNC8INC/0L7Qu9C40LPQvtC90L7Qsi5cbiAgICB9XG5cbiAgICBpZiAodGhpcy5kZWJ1Zy5pc0VuYWJsZSkge1xuICAgICAgdGhpcy5kZWJ1Zy5sb2dJbnRybyh0aGlzLndlYkdsLmNhbnZhcylcbiAgICAgIHRoaXMuZGVidWcubG9nR3B1SW5mbyh0aGlzLndlYkdsLmdsKVxuICAgICAgdGhpcy5kZWJ1Zy5sb2dJbnN0YW5jZUluZm8odGhpcy53ZWJHbC5jYW52YXMsIG9wdGlvbnMpXG4gICAgfVxuXG4gICAgdGhpcy53ZWJHbC5zZXRCZ0NvbG9yKHRoaXMuZ3JpZC5iZ0NvbG9yISkgICAgLy8g0KPRgdGC0LDQvdC+0LLQutCwINGG0LLQtdGC0LAg0L7Rh9C40YHRgtC60Lgg0YDQtdC90LTQtdGA0LjQvdCz0LBcblxuICAgIC8vINCh0L7Qt9C00LDQvdC40LUg0YjQtdC50LTQtdGA0L7QsiBXZWJHTC5cbiAgICBjb25zdCBzaGFkZXJDb2RlVmVydCA9IHRoaXMuc2hhZGVyQ29kZVZlcnQucmVwbGFjZSgne0VYVEVSTkFMLUNPREV9JywgdGhpcy5nZW5TaGFkZXJDb2xvckNvZGUoKSlcbiAgICBjb25zdCBzaGFkZXJDb2RlRnJhZyA9IHRoaXMuc2hhZGVyQ29kZUZyYWdcblxuICAgIGNvbnN0IHNoYWRlclZlcnQgPSB0aGlzLndlYkdsLmNyZWF0ZVNoYWRlcignVkVSVEVYX1NIQURFUicsIHNoYWRlckNvZGVWZXJ0KVxuICAgIGNvbnN0IHNoYWRlckZyYWcgPSB0aGlzLndlYkdsLmNyZWF0ZVNoYWRlcignRlJBR01FTlRfU0hBREVSJywgc2hhZGVyQ29kZUZyYWcpXG5cbiAgICAvLyDQktGL0LLQvtC0INC+0YLQu9Cw0LTQvtGH0L3QvtC5INC40L3RhNC+0YDQvNCw0YbQuNC4LlxuICAgIGlmICh0aGlzLmRlYnVnLmlzRW5hYmxlKSB7XG4gICAgICB0aGlzLmRlYnVnLmxvZ1NoYWRlckluZm8oJ1ZFUlRFWF9TSEFERVInLCBzaGFkZXJDb2RlVmVydClcbiAgICAgIHRoaXMuZGVidWcubG9nU2hhZGVySW5mbygnRlJBR01FTlRfU0hBREVSJywgc2hhZGVyQ29kZUZyYWcpXG4gICAgfVxuXG4gICAgLy8g0KHQvtC30LTQsNC90LjQtSDQv9GA0L7Qs9GA0LDQvNC80YsgV2ViR0wuXG4gICAgdGhpcy53ZWJHbC5jcmVhdGVQcm9ncmFtKHNoYWRlclZlcnQsIHNoYWRlckZyYWcpXG5cbiAgICAvLyDQo9GB0YLQsNC90L7QstC60LAg0YHQstGP0LfQtdC5INC/0LXRgNC10LzQtdC90L3Ri9GFINC/0YDQuNC70L7QttC10L3QuNGPINGBINC/0YDQvtCz0YDQsNC80LzQvtC5IFdlYkdsLlxuICAgIHRoaXMud2ViR2wuY3JlYXRlVmFyaWFibGUoJ2F0dHJpYnV0ZScsICdhX3Bvc2l0aW9uJylcbiAgICB0aGlzLndlYkdsLmNyZWF0ZVZhcmlhYmxlKCdhdHRyaWJ1dGUnLCAnYV9jb2xvcicpXG4gICAgdGhpcy53ZWJHbC5jcmVhdGVWYXJpYWJsZSgnYXR0cmlidXRlJywgJ2FfcG9seWdvbnNpemUnKVxuICAgIHRoaXMud2ViR2wuY3JlYXRlVmFyaWFibGUoJ2F0dHJpYnV0ZScsICdhX3NoYXBlJylcbiAgICB0aGlzLndlYkdsLmNyZWF0ZVZhcmlhYmxlKCd1bmlmb3JtJywgJ3VfbWF0cml4JylcblxuICAgIHRoaXMuY3JlYXRlV2ViR2xCdWZmZXJzKCkgICAgLy8g0JfQsNC/0L7Qu9C90LXQvdC40LUg0LHRg9GE0LXRgNC+0LIgV2ViR0wuXG5cbiAgICBpZiAodGhpcy5mb3JjZVJ1bikge1xuICAgICAgdGhpcy5ydW4oKSAgICAgICAgICAgICAgICAvLyDQpNC+0YDRgdC40YDQvtCy0LDQvdC90YvQuSDQt9Cw0L/Rg9GB0Log0YDQtdC90LTQtdGA0LjQvdCz0LAgKNC10YHQu9C4INGC0YDQtdCx0YPQtdGC0YHRjykuXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqINCf0YDQuNC80LXQvdGP0LXRgiDQv9C+0LvRjNC30L7QstCw0YLQtdC70YzRgdC60LjQtSDQvdCw0YHRgtGA0L7QudC60Lgg0Y3QutC30LXQvNC/0LvRj9GA0LAuXG4gICAqXG4gICAqIEBwYXJhbSBvcHRpb25zIC0g0J/QvtC70YzQt9C+0LLQsNGC0LXQu9GM0YHQutC40LUg0L3QsNGB0YLRgNC+0LnQutC4INGN0LrQt9C10LzQv9C70Y/RgNCwLlxuICAgKi9cbiAgcHJvdGVjdGVkIHNldE9wdGlvbnMob3B0aW9uczogU1Bsb3RPcHRpb25zKTogdm9pZCB7XG5cbiAgICBjb3B5TWF0Y2hpbmdLZXlWYWx1ZXModGhpcywgb3B0aW9ucykgICAgLy8g0J/RgNC40LzQtdC90LXQvdC40LUg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GM0YHQutC40YUg0L3QsNGB0YLRgNC+0LXQui5cblxuICAgIC8vINCV0YHQu9C4INC30LDQtNCw0L0g0YDQsNC30LzQtdGAINC/0LvQvtGB0LrQvtGB0YLQuCwg0L3QviDQvdC1INC30LDQtNCw0L3QviDQv9C+0LvQvtC20LXQvdC40LUg0L7QsdC70LDRgdGC0Lgg0L/RgNC+0YHQvNC+0YLRgNCwLCDRgtC+INC+0LHQu9Cw0YHRgtGMINC/0L7QvNC10YnQsNC10YLRgdGPINCyINGG0LXQvdGC0YAg0L/Qu9C+0YHQutC+0YHRgtC4LlxuICAgIGlmICgoJ2dyaWQnIGluIG9wdGlvbnMpICYmICEoJ2NhbWVyYScgaW4gb3B0aW9ucykpIHtcbiAgICAgIHRoaXMuY2FtZXJhLnggPSB0aGlzLmdyaWQud2lkdGghIC8gMlxuICAgICAgdGhpcy5jYW1lcmEueSA9IHRoaXMuZ3JpZC5oZWlnaHQhIC8gMlxuICAgIH1cblxuICAgIGlmICh0aGlzLmRlbW8uaXNFbmFibGUpIHtcbiAgICAgIHRoaXMuaXRlcmF0b3IgPSB0aGlzLmRlbW8uZGVtb0l0ZXJhdGlvbkNhbGxiYWNrICAgIC8vINCY0LzQuNGC0LDRhtC40Y8g0LjRgtC10YDQuNGA0L7QstCw0L3QuNGPINC00LvRjyDQtNC10LzQvi3RgNC10LbQuNC80LAuXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqINCh0L7Qt9C00LDQtdGCINC4INC30LDQv9C+0LvQvdGP0LXRgiDQtNCw0L3QvdGL0LzQuCDQvtCx0L4g0LLRgdC10YUg0L/QvtC70LjQs9C+0L3QsNGFINCx0YPRhNC10YDRiyBXZWJHTC5cbiAgICovXG4gIHByb3RlY3RlZCBjcmVhdGVXZWJHbEJ1ZmZlcnMoKTogdm9pZCB7XG5cbiAgICAvLyDQktGL0LLQvtC0INC+0YLQu9Cw0LTQvtGH0L3QvtC5INC40L3RhNC+0YDQvNCw0YbQuNC4LlxuICAgIGlmICh0aGlzLmRlYnVnLmlzRW5hYmxlKSB7XG4gICAgICB0aGlzLmRlYnVnLmxvZ0RhdGFMb2FkaW5nU3RhcnQoKVxuICAgIH1cblxuICAgIGxldCBwb2x5Z29uR3JvdXA6IFNQbG90UG9seWdvbkdyb3VwIHwgbnVsbFxuXG4gICAgLy8g0JjRgtC10YDQuNGA0L7QstCw0L3QuNC1INCz0YDRg9C/0L8g0L/QvtC70LjQs9C+0L3QvtCyLlxuICAgIHdoaWxlIChwb2x5Z29uR3JvdXAgPSB0aGlzLmNyZWF0ZVBvbHlnb25Hcm91cCgpKSB7XG5cbiAgICAgIC8vINCh0L7Qt9C00LDQvdC40LUg0Lgg0LfQsNC/0L7Qu9C90LXQvdC40LUg0LHRg9GE0LXRgNC+0LIg0LTQsNC90L3Ri9C80Lgg0L4g0YLQtdC60YPRidC10Lkg0LPRgNGD0L/Qv9C1INC/0L7Qu9C40LPQvtC90L7Qsi5cbiAgICAgIHRoaXMud2ViR2wuY3JlYXRlQnVmZmVyKHRoaXMuYnVmZmVycy52ZXJ0ZXhCdWZmZXJzLCAnQVJSQVlfQlVGRkVSJywgbmV3IEZsb2F0MzJBcnJheShwb2x5Z29uR3JvdXAudmVydGljZXMpLCAwKVxuICAgICAgdGhpcy53ZWJHbC5jcmVhdGVCdWZmZXIodGhpcy5idWZmZXJzLmNvbG9yQnVmZmVycywgJ0FSUkFZX0JVRkZFUicsIG5ldyBVaW50OEFycmF5KHBvbHlnb25Hcm91cC5jb2xvcnMpLCAxKVxuICAgICAgdGhpcy53ZWJHbC5jcmVhdGVCdWZmZXIodGhpcy5idWZmZXJzLnNoYXBlQnVmZmVycywgJ0FSUkFZX0JVRkZFUicsIG5ldyBVaW50OEFycmF5KHBvbHlnb25Hcm91cC5zaGFwZXMpLCA0KVxuICAgICAgdGhpcy53ZWJHbC5jcmVhdGVCdWZmZXIodGhpcy5idWZmZXJzLnNpemVCdWZmZXJzLCAnQVJSQVlfQlVGRkVSJywgbmV3IEZsb2F0MzJBcnJheShwb2x5Z29uR3JvdXAuc2l6ZXMpLCAzKVxuXG4gICAgICAvLyDQodGH0LXRgtGH0LjQuiDQutC+0LvQuNGH0LXRgdGC0LLQsCDQsdGD0YTQtdGA0L7Qsi5cbiAgICAgIHRoaXMuYnVmZmVycy5hbW91bnRPZkJ1ZmZlckdyb3VwcysrXG5cbiAgICAgIC8vINCh0YfQtdGC0YfQuNC6INC60L7Qu9C40YfQtdGB0YLQstCwINCy0LXRgNGI0LjQvSBHTC3RgtGA0LXRg9Cz0L7Qu9GM0L3QuNC60L7QsiDRgtC10LrRg9GJ0LXQuSDQs9GA0YPQv9C/0Ysg0LHRg9GE0LXRgNC+0LIuXG4gICAgICB0aGlzLmJ1ZmZlcnMuYW1vdW50T2ZHTFZlcnRpY2VzLnB1c2gocG9seWdvbkdyb3VwLmFtb3VudE9mR0xWZXJ0aWNlcylcblxuICAgICAgLy8g0KHRh9C10YLRh9C40Log0L7QsdGJ0LXQs9C+INC60L7Qu9C40YfQtdGB0YLQstCwINCy0LXRgNGI0LjQvSBHTC3RgtGA0LXRg9Cz0L7Qu9GM0L3QuNC60L7Qsi5cbiAgICAgIHRoaXMuYnVmZmVycy5hbW91bnRPZlRvdGFsR0xWZXJ0aWNlcyArPSBwb2x5Z29uR3JvdXAuYW1vdW50T2ZHTFZlcnRpY2VzXG4gICAgfVxuXG4gICAgLy8g0JLRi9Cy0L7QtCDQvtGC0LvQsNC00L7Rh9C90L7QuSDQuNC90YTQvtGA0LzQsNGG0LjQuC5cbiAgICBpZiAodGhpcy5kZWJ1Zy5pc0VuYWJsZSkge1xuICAgICAgdGhpcy5kZWJ1Zy5sb2dEYXRhTG9hZGluZ0NvbXBsZXRlKHRoaXMuYW1vdW50T2ZQb2x5Z29ucywgdGhpcy5saW1pdClcbiAgICAgIHRoaXMuZGVidWcubG9nT2JqZWN0U3RhdHModGhpcy5idWZmZXJzLCB0aGlzLmFtb3VudE9mUG9seWdvbnMpXG4gICAgICB0aGlzLmRlYnVnLmxvZ0dwdU1lbVN0YXRzKHRoaXMuYnVmZmVycylcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICog0KHRh9C40YLRi9Cy0LDQtdGCINC00LDQvdC90YvQtSDQvtCxINC40YHRhdC+0LTQvdGL0YUg0L7QsdGK0LXQutGC0LDRhSDQuCDRhNC+0YDQvNC40YDRg9C10YIg0YHQvtC+0YLQstC10YLRgdCy0YPRjtGJ0YPRjiDRjdGC0LjQvCDQvtCx0YrQtdC60YLQsNC8INCz0YDRg9C/0L/RgyDQv9C+0LvQuNCz0L7QvdC+0LIuXG4gICAqXG4gICAqIEByZW1hcmtzXG4gICAqINCT0YDRg9C/0L/QsCDRhNC+0YDQvNC40YDRg9C10YLRgdGPINGBINGD0YfQtdGC0L7QvCDRgtC10YXQvdC40YfQtdGB0LrQvtCz0L4g0L7Qs9GA0LDQvdC40YfQtdC90LjRjyDQvdCwINC60L7Qu9C40YfQtdGB0YLQstC+INCy0LXRgNGI0LjQvSDQsiDQs9GA0YPQv9C/0LUg0Lgg0LvQuNC80LjRgtCwINC90LAg0L7QsdGJ0LXQtSDQutC+0LvQuNGH0LXRgdGC0LLQvlxuICAgKiDQv9C+0LvQuNCz0L7QvdC+0LIg0L3QsCDQutCw0L3QstCw0YHQtS5cbiAgICpcbiAgICogQHJldHVybnMg0KHQvtC30LTQsNC90L3QsNGPINCz0YDRg9C/0L/QsCDQv9C+0LvQuNCz0L7QvdC+0LIg0LjQu9C4IG51bGwsINC10YHQu9C4INGE0L7RgNC80LjRgNC+0LLQsNC90LjQtSDQstGB0LXRhSDQs9GA0YPQv9C/INC/0L7Qu9C40LPQvtC90L7QsiDQt9Cw0LLQtdGA0YjQuNC70L7RgdGMLlxuICAgKi9cbiAgcHJvdGVjdGVkIGNyZWF0ZVBvbHlnb25Hcm91cCgpOiBTUGxvdFBvbHlnb25Hcm91cCB8IG51bGwge1xuXG4gICAgbGV0IHBvbHlnb25Hcm91cDogU1Bsb3RQb2x5Z29uR3JvdXAgPSB7XG4gICAgICB2ZXJ0aWNlczogW10sXG4gICAgICBjb2xvcnM6IFtdLFxuICAgICAgc2l6ZXM6IFtdLFxuICAgICAgc2hhcGVzOiBbXSxcbiAgICAgIGFtb3VudE9mVmVydGljZXM6IDAsXG4gICAgICBhbW91bnRPZkdMVmVydGljZXM6IDBcbiAgICB9XG5cbiAgICBsZXQgcG9seWdvbjogU1Bsb3RQb2x5Z29uIHwgbnVsbCB8IHVuZGVmaW5lZFxuXG4gICAgLyoqXG4gICAgICog0JXRgdC70Lgg0LrQvtC70LjRh9C10YHRgtCy0L4g0L/QvtC70LjQs9C+0L3QvtCyINC60LDQvdCy0LDRgdCwINC00L7RgdGC0LjQs9C70L4g0LTQvtC/0YPRgdGC0LjQvNC+0LPQviDQvNCw0LrRgdC40LzRg9C80LAsINGC0L4g0LTQsNC70YzQvdC10LnRiNCw0Y8g0L7QsdGA0LDQsdC+0YLQutCwINC40YHRhdC+0LTQvdGL0YUg0L7QsdGK0LXQutGC0L7QslxuICAgICAqINC/0YDQuNC+0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdGC0YHRjyAtINGE0L7RgNC80LjRgNC+0LLQsNC90LjQtSDQs9GA0YPQv9C/INC/0L7Qu9C40LPQvtC90L7QsiDQt9Cw0LLQtdGA0YjQsNC10YLRgdGPINCy0L7Qt9Cy0YDQsNGC0L7QvCDQt9C90LDRh9C10L3QuNGPIG51bGwgKNGB0LjQvNGD0LvRj9GG0LjRjyDQtNC+0YHRgtC40LbQtdC90LjRj1xuICAgICAqINC/0L7RgdC70LXQtNC90LXQs9C+INC+0LHRgNCw0LHQsNGC0YvQstCw0LXQvNC+0LPQviDQuNGB0YXQvtC00L3QvtCz0L4g0L7QsdGK0LXQutGC0LApLlxuICAgICAqL1xuICAgIGlmICh0aGlzLmFtb3VudE9mUG9seWdvbnMgPj0gdGhpcy5saW1pdCkgcmV0dXJuIG51bGxcblxuICAgIC8vINCY0YLQtdGA0LjRgNC+0LLQsNC90LjQtSDQuNGB0YXQvtC00L3Ri9GFINC+0LHRitC10LrRgtC+0LIuXG4gICAgd2hpbGUgKHBvbHlnb24gPSB0aGlzLml0ZXJhdG9yISgpKSB7XG5cbiAgICAgIC8vINCU0L7QsdCw0LLQu9C10L3QuNC1INCyINCz0YDRg9C/0L/RgyDQv9C+0LvQuNCz0L7QvdC+0LIg0L3QvtCy0L7Qs9C+INC/0L7Qu9C40LPQvtC90LAuXG4gICAgICB0aGlzLmFkZFBvbHlnb24ocG9seWdvbkdyb3VwLCBwb2x5Z29uKVxuXG4gICAgICAvLyDQodGH0LXRgtGH0LjQuiDRh9C40YHQu9CwINC/0YDQuNC80LXQvdC10L3QuNC5INC60LDQttC00L7QuSDQuNC3INGE0L7RgNC8INC/0L7Qu9C40LPQvtC90L7Qsi5cbiAgICAgIHRoaXMuYnVmZmVycy5hbW91bnRPZlNoYXBlc1twb2x5Z29uLnNoYXBlXSsrXG5cbiAgICAgIC8vINCh0YfQtdGC0YfQuNC6INC+0LHRidC10LPQviDQutC+0LvQuNGH0LXRgdGC0LLQviDQv9C+0LvQuNCz0L7QvdC+0LIuXG4gICAgICB0aGlzLmFtb3VudE9mUG9seWdvbnMrK1xuXG4gICAgICAvKipcbiAgICAgICAqINCV0YHQu9C4INC60L7Qu9C40YfQtdGB0YLQstC+INC/0L7Qu9C40LPQvtC90L7QsiDQutCw0L3QstCw0YHQsCDQtNC+0YHRgtC40LPQu9C+INC00L7Qv9GD0YHRgtC40LzQvtCz0L4g0LzQsNC60YHQuNC80YPQvNCwLCDRgtC+INC00LDQu9GM0L3QtdC50YjQsNGPINC+0LHRgNCw0LHQvtGC0LrQsCDQuNGB0YXQvtC00L3Ri9GFINC+0LHRitC10LrRgtC+0LJcbiAgICAgICAqINC/0YDQuNC+0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdGC0YHRjyAtINGE0L7RgNC80LjRgNC+0LLQsNC90LjQtSDQs9GA0YPQv9C/INC/0L7Qu9C40LPQvtC90L7QsiDQt9Cw0LLQtdGA0YjQsNC10YLRgdGPINCy0L7Qt9Cy0YDQsNGC0L7QvCDQt9C90LDRh9C10L3QuNGPIG51bGwgKNGB0LjQvNGD0LvRj9GG0LjRjyDQtNC+0YHRgtC40LbQtdC90LjRj1xuICAgICAgICog0L/QvtGB0LvQtdC00L3QtdCz0L4g0L7QsdGA0LDQsdCw0YLRi9Cy0LDQtdC80L7Qs9C+INC40YHRhdC+0LTQvdC+0LPQviDQvtCx0YrQtdC60YLQsCkuXG4gICAgICAgKi9cbiAgICAgIGlmICh0aGlzLmFtb3VudE9mUG9seWdvbnMgPj0gdGhpcy5saW1pdCkgYnJlYWtcblxuICAgICAgLyoqXG4gICAgICAgKiDQldGB0LvQuCDQvtCx0YnQtdC1INC60L7Qu9C40YfQtdGB0YLQstC+INCy0YHQtdGFINCy0LXRgNGI0LjQvSDQsiDQs9GA0YPQv9C/0LUg0L/QvtC70LjQs9C+0L3QvtCyINC/0YDQtdCy0YvRgdC40LvQviDRgtC10YXQvdC40YfQtdGB0LrQvtC1INC+0LPRgNCw0L3QuNGH0LXQvdC40LUsINGC0L4g0LPRgNGD0L/Qv9CwINC/0L7Qu9C40LPQvtC90L7QslxuICAgICAgICog0YHRh9C40YLQsNC10YLRgdGPINGB0YTQvtGA0LzQuNGA0L7QstCw0L3QvdC+0Lkg0Lgg0LjRgtC10YDQuNGA0L7QstCw0L3QuNC1INC40YHRhdC+0LTQvdGL0YUg0L7QsdGK0LXQutGC0L7QsiDQv9GA0LjQvtGB0YLQsNC90LDQstC70LjQstCw0LXRgtGB0Y8uXG4gICAgICAgKi9cbiAgICAgIGlmIChwb2x5Z29uR3JvdXAuYW1vdW50T2ZWZXJ0aWNlcyA+PSB0aGlzLm1heEFtb3VudE9mVmVydGV4SW5Hcm91cCkgYnJlYWtcbiAgICB9XG5cbiAgICAvLyDQodGH0LXRgtGH0LjQuiDQvtCx0YnQtdCz0L4g0LrQvtC70LjRh9C10YHRgtCy0LAg0LLQtdGA0YjQuNC9INCy0YHQtdGFINCy0LXRgNGI0LjQvdC90YvRhSDQsdGD0YTQtdGA0L7Qsi5cbiAgICB0aGlzLmJ1ZmZlcnMuYW1vdW50T2ZUb3RhbFZlcnRpY2VzICs9IHBvbHlnb25Hcm91cC5hbW91bnRPZlZlcnRpY2VzXG5cbiAgICAvLyDQldGB0LvQuCDQs9GA0YPQv9C/0LAg0L/QvtC70LjQs9C+0L3QvtCyINC90LXQv9GD0YHRgtCw0Y8sINGC0L4g0LLQvtC30LLRgNCw0YnQsNC10Lwg0LXQtS4g0JXRgdC70Lgg0L/Rg9GB0YLQsNGPIC0g0LLQvtC30LLRgNCw0YnQsNC10LwgbnVsbC5cbiAgICByZXR1cm4gKHBvbHlnb25Hcm91cC5hbW91bnRPZlZlcnRpY2VzID4gMCkgPyBwb2x5Z29uR3JvdXAgOiBudWxsXG4gIH1cblxuICAvKipcbiAgICog0KHQvtC30LTQsNC10YIg0Lgg0LTQvtCx0LDQstC70Y/QtdGCINCyINCz0YDRg9C/0L/RgyDQv9C+0LvQuNCz0L7QvdC+0LIg0L3QvtCy0YvQuSDQv9C+0LvQuNCz0L7QvS5cbiAgICpcbiAgICogQHBhcmFtIHBvbHlnb25Hcm91cCAtINCT0YDRg9C/0L/QsCDQv9C+0LvQuNCz0L7QvdC+0LIsINCyINC60L7RgtC+0YDRg9GOINC/0YDQvtC40YHRhdC+0LTQuNGCINC00L7QsdCw0LLQu9C10L3QuNC1LlxuICAgKiBAcGFyYW0gcG9seWdvbiAtINCY0L3RhNC+0YDQvNCw0YbQuNGPINC+INC00L7QsdCw0LLQu9GP0LXQvNC+0Lwg0L/QvtC70LjQs9C+0L3QtS5cbiAgICovXG4gIHByb3RlY3RlZCBhZGRQb2x5Z29uKHBvbHlnb25Hcm91cDogU1Bsb3RQb2x5Z29uR3JvdXAsIHBvbHlnb246IFNQbG90UG9seWdvbik6IHZvaWQge1xuXG4gICAgLyoqXG4gICAgICog0JTQvtCx0LDQstC70LXQvdC40LUg0LIg0LPRgNGD0L/Qv9GDINC/0L7Qu9C40LPQvtC90L7QsiDQuNC90LTQtdC60YHQvtCyINCy0LXRgNGI0LjQvSDQvdC+0LLQvtCz0L4g0L/QvtC70LjQs9C+0L3QsCDQuCDQv9C+0LTRgdGH0LXRgiDQvtCx0YnQtdCz0L4g0LrQvtC70LjRh9C10YHRgtCy0LAg0LLQtdGA0YjQuNC9IEdMLdGC0YDQtdGD0LPQvtC70YzQvdC40LrQvtCyXG4gICAgICog0LIg0LPRgNGD0L/Qv9C1LlxuICAgICAqL1xuICAgIHBvbHlnb25Hcm91cC5hbW91bnRPZkdMVmVydGljZXMrK1xuXG4gICAgLy8g0JTQvtCx0LDQstC70LXQvdC40LUg0LIg0LPRgNGD0L/Qv9GDINC/0L7Qu9C40LPQvtC90L7QsiDQstC10YDRiNC40L0g0L3QvtCy0L7Qs9C+INC/0L7Qu9C40LPQvtC90LAg0Lgg0L/QvtC00YHRh9C10YIg0L7QsdGJ0LXQs9C+INC60L7Qu9C40YfQtdGB0YLQstCwINCy0LXRgNGI0LjQvSDQsiDQs9GA0YPQv9C/0LUuXG4gICAgcG9seWdvbkdyb3VwLnZlcnRpY2VzLnB1c2gocG9seWdvbi54LCBwb2x5Z29uLnkpXG4gICAgcG9seWdvbkdyb3VwLmFtb3VudE9mVmVydGljZXMrK1xuXG4gICAgcG9seWdvbkdyb3VwLnNoYXBlcy5wdXNoKHBvbHlnb24uc2hhcGUpXG4gICAgcG9seWdvbkdyb3VwLnNpemVzLnB1c2gocG9seWdvbi5zaXplKVxuICAgIHBvbHlnb25Hcm91cC5jb2xvcnMucHVzaChwb2x5Z29uLmNvbG9yKVxuICB9XG5cbiAgLyoqXG4gICAqINCh0L7Qt9C00LDQtdGCINC00L7Qv9C+0LvQvdC10L3QuNC1INC6INC60L7QtNGDINC90LAg0Y/Qt9GL0LrQtSBHTFNMLlxuICAgKlxuICAgKiBAcmVtYXJrc1xuICAgKiDQkiDQtNCw0LvRjNC90LXQudGI0LXQvCDRgdC+0LfQtNCw0L3QvdGL0Lkg0LrQvtC0INCx0YPQtNC10YIg0LLRgdGC0YDQvtC10L0g0LIg0LrQvtC0INCy0LXRgNGI0LjQvdC90L7Qs9C+INGI0LXQudC00LXRgNCwINC00LvRjyDQt9Cw0LTQsNC90LjRjyDRhtCy0LXRgtCwINCy0LXRgNGI0LjQvdGLINCyINC30LDQstC40YHQuNC80L7RgdGC0Lgg0L7RglxuICAgKiDQuNC90LTQtdC60YHQsCDRhtCy0LXRgtCwLCDQv9GA0LjRgdCy0L7QtdC90L3QvtCz0L4g0Y3RgtC+0Lkg0LLQtdGA0YjQuNC90LUuINCiLtC6LiDRiNC10LnQtNC10YAg0L3QtSDQv9C+0LfQstC+0LvRj9C10YIg0LjRgdC/0L7Qu9GM0LfQvtCy0LDRgtGMINCyINC60LDRh9C10YHRgtCy0LUg0LjQvdC00LXQutGB0L7QsiDQv9C10YDQtdC80LXQvdC90YvQtSAtXG4gICAqINC00LvRjyDQt9Cw0LTQsNC90LjRjyDRhtCy0LXRgtCwINC40YHQv9C+0LvRjNC30YPQtdGC0YHRjyDQv9C10YDQtdCx0L7RgCDRhtCy0LXRgtC+0LLRi9GFINC40L3QtNC10LrRgdC+0LIuXG4gICAqXG4gICAqIEByZXR1cm5zINCa0L7QtCDQvdCwINGP0LfRi9C60LUgR0xTTC5cbiAgICovXG4gIHByb3RlY3RlZCBnZW5TaGFkZXJDb2xvckNvZGUoKTogc3RyaW5nIHtcblxuICAgIC8vINCS0YDQtdC80LXQvdC90L7QtSDQtNC+0LHQsNCy0LvQtdC90LjQtSDQsiDQv9Cw0LvQuNGC0YDRgyDRhtCy0LXRgtC+0LIg0LLQtdGA0YjQuNC9INGG0LLQtdGC0LAg0L3QsNC/0YDQsNCy0LvRj9GO0YnQuNGFLlxuICAgIHRoaXMuY29sb3JzLnB1c2godGhpcy5ncmlkLnJ1bGVzQ29sb3IhKVxuXG4gICAgbGV0IGNvZGU6IHN0cmluZyA9ICcnXG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY29sb3JzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgIC8vINCf0L7Qu9GD0YfQtdC90LjQtSDRhtCy0LXRgtCwINCyINC90YPQttC90L7QvCDRhNC+0YDQvNCw0YLQtS5cbiAgICAgIGxldCBbciwgZywgYl0gPSBjb2xvckZyb21IZXhUb0dsUmdiKHRoaXMuY29sb3JzW2ldKVxuXG4gICAgICAvLyDQpNC+0YDQvNC40YDQvtCy0L3QuNC1INGB0YLRgNC+0LogR0xTTC3QutC+0LTQsCDQv9GA0L7QstC10YDQutC4INC40L3QtNC10LrRgdCwINGG0LLQtdGC0LAuXG4gICAgICBjb2RlICs9ICgoaSA9PT0gMCkgPyAnJyA6ICcgIGVsc2UgJykgKyAnaWYgKGFfY29sb3IgPT0gJyArIGkgKyAnLjApIHZfY29sb3IgPSB2ZWMzKCcgK1xuICAgICAgICByLnRvU3RyaW5nKCkuc2xpY2UoMCwgOSkgKyAnLCcgK1xuICAgICAgICBnLnRvU3RyaW5nKCkuc2xpY2UoMCwgOSkgKyAnLCcgK1xuICAgICAgICBiLnRvU3RyaW5nKCkuc2xpY2UoMCwgOSkgKyAnKTtcXG4nXG4gICAgfVxuXG4gICAgLy8g0KPQtNCw0LvQtdC90LjQtSDQuNC3INC/0LDQu9C40YLRgNGLINCy0LXRgNGI0LjQvSDQstGA0LXQvNC10L3QvdC+INC00L7QsdCw0LLQu9C10L3QvdC+0LPQviDRhtCy0LXRgtCwINC90LDQv9GA0LDQstC70Y/RjtGJ0LjRhS5cbiAgICB0aGlzLmNvbG9ycy5wb3AoKVxuXG4gICAgcmV0dXJuIGNvZGVcbiAgfVxuXG4gIC8qKlxuICAgKiDQn9GA0L7QuNC30LLQvtC00LjRgiDRgNC10L3QtNC10YDQuNC90LMg0LPRgNCw0YTQuNC60LAg0LIg0YHQvtC+0YLQstC10YLRgdGC0LLQuNC4INGBINGC0LXQutGD0YnQuNC80Lgg0L/QsNGA0LDQvNC10YLRgNCw0LzQuCDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuC5cbiAgICovXG4gIHB1YmxpYyByZW5kZXIoKTogdm9pZCB7XG5cbiAgICAvLyDQntGH0LjRgdGC0LrQsCDQvtCx0YrQtdC60YLQsCDRgNC10L3QtNC10YDQuNC90LPQsCBXZWJHTC5cbiAgICB0aGlzLndlYkdsLmNsZWFyQmFja2dyb3VuZCgpXG5cbiAgICAvLyDQntCx0L3QvtCy0LvQtdC90LjQtSDQvNCw0YLRgNC40YbRiyDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuC5cbiAgICB0aGlzLmNvbnRyb2wudXBkYXRlVmlld1Byb2plY3Rpb24oKVxuXG4gICAgLy8g0J/RgNC40LLRj9C30LrQsCDQvNCw0YLRgNC40YbRiyDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuCDQuiDQv9C10YDQtdC80LXQvdC90L7QuSDRiNC10LnQtNC10YDQsC5cbiAgICB0aGlzLndlYkdsLnNldFZhcmlhYmxlKCd1X21hdHJpeCcsIHRoaXMudHJhbnNmb3JtLnZpZXdQcm9qZWN0aW9uTWF0KVxuXG4gICAgLy8g0JjRgtC10YDQuNGA0L7QstCw0L3QuNC1INC4INGA0LXQvdC00LXRgNC40L3QsyDQs9GA0YPQv9C/INCx0YPRhNC10YDQvtCyIFdlYkdMLlxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5idWZmZXJzLmFtb3VudE9mQnVmZmVyR3JvdXBzOyBpKyspIHtcblxuICAgICAgdGhpcy53ZWJHbC5zZXRCdWZmZXIodGhpcy5idWZmZXJzLnZlcnRleEJ1ZmZlcnNbaV0sICdhX3Bvc2l0aW9uJywgdGhpcy53ZWJHbC5nbC5GTE9BVCwgMiwgMCwgMClcbiAgICAgIHRoaXMud2ViR2wuc2V0QnVmZmVyKHRoaXMuYnVmZmVycy5jb2xvckJ1ZmZlcnNbaV0sICdhX2NvbG9yJywgdGhpcy53ZWJHbC5nbC5VTlNJR05FRF9CWVRFLCAxLCAwLCAwKVxuICAgICAgdGhpcy53ZWJHbC5zZXRCdWZmZXIodGhpcy5idWZmZXJzLnNpemVCdWZmZXJzW2ldLCAnYV9wb2x5Z29uc2l6ZScsIHRoaXMud2ViR2wuZ2wuRkxPQVQsIDEsIDAsIDApXG4gICAgICB0aGlzLndlYkdsLnNldEJ1ZmZlcih0aGlzLmJ1ZmZlcnMuc2hhcGVCdWZmZXJzW2ldLCAnYV9zaGFwZScsIHRoaXMud2ViR2wuZ2wuVU5TSUdORURfQllURSwgMSwgMCwgMClcblxuICAgICAgdGhpcy53ZWJHbC5kcmF3KDAsIHRoaXMuYnVmZmVycy5hbW91bnRPZkdMVmVydGljZXNbaV0gLyAzKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDQl9Cw0L/Rg9GB0LrQsNC10YIg0YDQtdC90LTQtdGA0LjQvdCzINC4INC60L7QvdGC0YDQvtC70Ywg0YPQv9GA0LDQstC70LXQvdC40Y8uXG4gICAqL1xuICBwdWJsaWMgcnVuKCk6IHZvaWQge1xuXG4gICAgaWYgKHRoaXMuaXNSdW5uaW5nKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICB0aGlzLnJlbmRlcigpXG4gICAgdGhpcy5jb250cm9sLnJ1bigpXG4gICAgdGhpcy5pc1J1bm5pbmcgPSB0cnVlXG5cbiAgICBpZiAodGhpcy5kZWJ1Zy5pc0VuYWJsZSkge1xuICAgICAgdGhpcy5kZWJ1Zy5sb2dSZW5kZXJTdGFydGVkKClcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICog0J7RgdGC0LDQvdCw0LLQu9C40LLQsNC10YIg0YDQtdC90LTQtdGA0LjQvdCzINC4INC60L7QvdGC0YDQvtC70Ywg0YPQv9GA0LDQstC70LXQvdC40Y8uXG4gICAqL1xuICBwdWJsaWMgc3RvcCgpOiB2b2lkIHtcblxuICAgIGlmICghdGhpcy5pc1J1bm5pbmcpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHRoaXMuY29udHJvbC5zdG9wKClcbiAgICB0aGlzLmlzUnVubmluZyA9IGZhbHNlXG5cbiAgICBpZiAodGhpcy5kZWJ1Zy5pc0VuYWJsZSkge1xuICAgICAgdGhpcy5kZWJ1Zy5sb2dSZW5kZXJTdG9wZWQoKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDQntGH0LjRidCw0LXRgiDRhNC+0L0uXG4gICAqL1xuICBwdWJsaWMgY2xlYXIoKTogdm9pZCB7XG5cbiAgICB0aGlzLndlYkdsLmNsZWFyQmFja2dyb3VuZCgpXG5cbiAgICBpZiAodGhpcy5kZWJ1Zy5pc0VuYWJsZSkge1xuICAgICAgdGhpcy5kZWJ1Zy5sb2dDYW52YXNDbGVhcmVkKClcbiAgICB9XG4gIH1cbn1cbiIsIlxuLyoqXG4gKiDQn9GA0L7QstC10YDRj9C10YIg0Y/QstC70Y/QtdGC0YHRjyDQu9C4INC/0LXRgNC10LzQtdC90L3QsNGPINGN0LrQt9C10LzQv9C70Y/RgNC+0Lwg0LrQsNC60L7Qs9C+LdC70LjQsdC+0L4g0LrQu9Cw0YHRgdCwLlxuICpcbiAqIEBwYXJhbSB2YWwgLSDQn9GA0L7QstC10YDRj9C10LzQsNGPINC/0LXRgNC10LzQtdC90L3QsNGPLlxuICogQHJldHVybnMg0KDQtdC30YPQu9GM0YLQsNGCINC/0YDQvtCy0LXRgNC60LguXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc09iamVjdChvYmo6IGFueSk6IGJvb2xlYW4ge1xuICByZXR1cm4gKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBPYmplY3RdJylcbn1cblxuLyoqXG4gKiDQn9C10YDQtdC+0L/RgNC10LTQtdC70Y/QtdGCINC30L3QsNGH0LXQvdC40Y8g0L/QvtC70LXQuSDQvtCx0YrQtdC60YLQsCB0YXJnZXQg0L3QsCDQt9C90LDRh9C10L3QuNGPINC/0L7Qu9C10Lkg0L7QsdGK0LXQutGC0LAgc291cmNlLiDQn9C10YDQtdC+0L/RgNC10LTQtdC70Y/RjtGC0YHRjyDRgtC+0LvRjNC60L4g0YLQtSDQv9C+0LvRjyxcbiAqINC60L7RgtC+0YDRi9C1INGB0YPRidC10YHRgtCy0YPQtdGO0YIg0LIgdGFyZ2V0LiDQldGB0LvQuCDQsiBzb3VyY2Ug0LXRgdGC0Ywg0L/QvtC70Y8sINC60L7RgtC+0YDRi9GFINC90LXRgiDQsiB0YXJnZXQsINGC0L4g0L7QvdC4INC40LPQvdC+0YDQuNGA0YPRjtGC0YHRjy4g0JXRgdC70Lgg0LrQsNC60LjQtS3RgtC+INC/0L7Qu9GPXG4gKiDRgdCw0LzQuCDRj9Cy0LvRj9GO0YLRgdGPINGP0LLQu9GP0Y7RgtGB0Y8g0L7QsdGK0LXQutGC0LDQvNC4LCDRgtC+INGC0L4g0L7QvdC4INGC0LDQutC20LUg0YDQtdC60YPRgNGB0LjQstC90L4g0LrQvtC/0LjRgNGD0Y7RgtGB0Y8gKNC/0YDQuCDRgtC+0Lwg0LbQtSDRg9GB0LvQvtCy0LjQuCwg0YfRgtC+INCyINGG0LXQu9C10L7QvCDQvtCx0YrQtdC60YLQtVxuICog0YHRg9GJ0LXRgdGC0LLRg9GO0YIg0L/QvtC70Y8g0L7QsdGK0LXQutGC0LAt0LjRgdGC0L7Rh9C90LjQutCwKS5cbiAqXG4gKiBAcGFyYW0gdGFyZ2V0IC0g0KbQtdC70LXQstC+0LkgKNC40LfQvNC10L3Rj9C10LzRi9C5KSDQvtCx0YrQtdC60YIuXG4gKiBAcGFyYW0gc291cmNlIC0g0J7QsdGK0LXQutGCINGBINC00LDQvdC90YvQvNC4LCDQutC+0YLQvtGA0YvQtSDQvdGD0LbQvdC+INGD0YHRgtCw0L3QvtCy0LjRgtGMINGDINGG0LXQu9C10LLQvtCz0L4g0L7QsdGK0LXQutGC0LAuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb3B5TWF0Y2hpbmdLZXlWYWx1ZXModGFyZ2V0OiBhbnksIHNvdXJjZTogYW55KTogdm9pZCB7XG4gIE9iamVjdC5rZXlzKHNvdXJjZSkuZm9yRWFjaChrZXkgPT4ge1xuICAgIGlmIChrZXkgaW4gdGFyZ2V0KSB7XG4gICAgICBpZiAoaXNPYmplY3Qoc291cmNlW2tleV0pKSB7XG4gICAgICAgIGlmIChpc09iamVjdCh0YXJnZXRba2V5XSkpIHtcbiAgICAgICAgICBjb3B5TWF0Y2hpbmdLZXlWYWx1ZXModGFyZ2V0W2tleV0sIHNvdXJjZVtrZXldKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoIWlzT2JqZWN0KHRhcmdldFtrZXldKSAmJiAodHlwZW9mIHRhcmdldFtrZXldICE9PSAnZnVuY3Rpb24nKSkge1xuICAgICAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSlcbn1cblxuLyoqXG4gKiDQktC+0LfQstGA0LDRidCw0LXRgiDRgdC70YPRh9Cw0LnQvdC+0LUg0YbQtdC70L7QtSDRh9C40YHQu9C+INCyINC00LjQsNC/0LDQt9C+0L3QtTogWzAuLi5yYW5nZS0xXS5cbiAqXG4gKiBAcGFyYW0gcmFuZ2UgLSDQktC10YDRhdC90LjQuSDQv9GA0LXQtNC10Lsg0LTQuNCw0L/QsNC30L7QvdCwINGB0LvRg9GH0LDQudC90L7Qs9C+INCy0YvQsdC+0YDQsC5cbiAqIEByZXR1cm5zINCh0LvRg9GH0LDQudC90L7QtSDRh9C40YHQu9C+LlxuICovXG5leHBvcnQgZnVuY3Rpb24gcmFuZG9tSW50KHJhbmdlOiBudW1iZXIpOiBudW1iZXIge1xuICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcmFuZ2UpXG59XG5cbi8qKlxuICog0J/RgNC10L7QsdGA0LDQt9GD0LXRgiDQvtCx0YrQtdC60YIg0LIg0YHRgtGA0L7QutGDIEpTT04uINCY0LzQtdC10YIg0L7RgtC70LjRh9C40LUg0L7RgiDRgdGC0LDQvdC00LDRgNGC0L3QvtC5INGE0YPQvdC60YbQuNC4IEpTT04uc3RyaW5naWZ5IC0g0L/QvtC70Y8g0L7QsdGK0LXQutGC0LAsINC40LzQtdGO0YnQuNC1XG4gKiDQt9C90LDRh9C10L3QuNGPINGE0YPQvdC60YbQuNC5INC90LUg0L/RgNC+0L/Rg9GB0LrQsNGO0YLRgdGPLCDQsCDQv9GA0LXQvtCx0YDQsNC30YPRjtGC0YHRjyDQsiDQvdCw0LfQstCw0L3QuNC1INGE0YPQvdC60YbQuNC4LlxuICpcbiAqIEBwYXJhbSBvYmogLSDQptC10LvQtdCy0L7QuSDQvtCx0YrQtdC60YIuXG4gKiBAcmV0dXJucyDQodGC0YDQvtC60LAgSlNPTiwg0L7RgtC+0LHRgNCw0LbQsNGO0YnQsNGPINC+0LHRitC10LrRgi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGpzb25TdHJpbmdpZnkob2JqOiBhbnkpOiBzdHJpbmcge1xuICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoXG4gICAgb2JqLFxuICAgIGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgICByZXR1cm4gKHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJykgPyB2YWx1ZS5uYW1lIDogdmFsdWVcbiAgICB9LFxuICAgICcgJ1xuICApXG59XG5cbi8qKlxuICog0KHQu9GD0YfQsNC50L3Ri9C8INC+0LHRgNCw0LfQvtC8INCy0L7Qt9Cy0YDQsNGJ0LDQtdGCINC+0LTQuNC9INC40Lcg0LjQvdC00LXQutGB0L7QsiDRh9C40YHQu9C+0LLQvtCz0L4g0L7QtNC90L7QvNC10YDQvdC+0LPQviDQvNCw0YHRgdC40LLQsC4g0J3QtdGB0LzQvtGC0YDRjyDQvdCwINGB0LvRg9GH0LDQudC90L7RgdGC0Ywg0LrQsNC20LTQvtCz0L5cbiAqINC60L7QvdC60YDQtdGC0L3QvtCz0L4g0LLRi9C30L7QstCwINGE0YPQvdC60YbQuNC4LCDQuNC90LTQtdC60YHRiyDQstC+0LfQstGA0LDRidCw0Y7RgtGB0Y8g0YEg0L/RgNC10LTQvtC/0YDQtdC00LXQu9C10L3QvdC+0Lkg0YfQsNGB0YLQvtGC0L7QuS4g0KfQsNGB0YLQvtGC0LAgXCLQstGL0L/QsNC00LDQvdC40LlcIiDQuNC90LTQtdC60YHQvtCyINC30LDQtNCw0LXRgtGB0Y9cbiAqINGB0L7QvtGC0LLQtdGC0YHRgtCy0YPRjtGJ0LjQvNC4INC30L3QsNGH0LXQvdC40Y/QvNC4INGN0LvQtdC80LXQvdGC0L7Qsi5cbiAqXG4gKiBAcmVtYXJrc1xuICog0J/RgNC40LzQtdGAOiDQndCwINC80LDRgdGB0LjQstC1IFszLCAyLCA1XSDRhNGD0L3QutGG0LjRjyDQsdGD0LTQtdGCINCy0L7Qt9Cy0YDQsNGJ0LDRgtGMINC40L3QtNC10LrRgSAwINGBINGH0LDRgdGC0L7RgtC+0LkgPSAzLygzKzIrNSkgPSAzLzEwLCDQuNC90LTQtdC60YEgMSDRgSDRh9Cw0YHRgtC+0YLQvtC5ID1cbiAqIDIvKDMrMis1KSA9IDIvMTAsINC40L3QtNC10LrRgSAyINGBINGH0LDRgdGC0L7RgtC+0LkgPSA1LygzKzIrNSkgPSA1LzEwLlxuICpcbiAqIEBwYXJhbSBhcnIgLSDQp9C40YHQu9C+0LLQvtC5INC+0LTQvdC+0LzQtdGA0L3Ri9C5INC80LDRgdGB0LjQsiwg0LjQvdC00LXQutGB0Ysg0LrQvtGC0L7RgNC+0LPQviDQsdGD0LTRg9GCINCy0L7Qt9Cy0YDQsNGJ0LDRgtGM0YHRjyDRgSDQv9GA0LXQtNC+0L/RgNC10LTQtdC70LXQvdC90L7QuSDRh9Cw0YHRgtC+0YLQvtC5LlxuICogQHJldHVybnMg0KHQu9GD0YfQsNC50L3Ri9C5INC40L3QtNC10LrRgSDQuNC3INC80LDRgdGB0LjQstCwIGFyci5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJhbmRvbVF1b3RhSW5kZXgoYXJyOiBudW1iZXJbXSk6IG51bWJlciB7XG5cbiAgbGV0IGE6IG51bWJlcltdID0gW11cbiAgYVswXSA9IGFyclswXVxuXG4gIGZvciAobGV0IGkgPSAxOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgYVtpXSA9IGFbaSAtIDFdICsgYXJyW2ldXG4gIH1cblxuICBjb25zdCBsYXN0SW5kZXg6IG51bWJlciA9IGEubGVuZ3RoIC0gMVxuXG4gIGxldCByOiBudW1iZXIgPSBNYXRoLmZsb29yKChNYXRoLnJhbmRvbSgpICogYVtsYXN0SW5kZXhdKSkgKyAxXG4gIGxldCBsOiBudW1iZXIgPSAwXG4gIGxldCBoOiBudW1iZXIgPSBsYXN0SW5kZXhcblxuICB3aGlsZSAobCA8IGgpIHtcbiAgICBjb25zdCBtOiBudW1iZXIgPSBsICsgKChoIC0gbCkgPj4gMSk7XG4gICAgKHIgPiBhW21dKSA/IChsID0gbSArIDEpIDogKGggPSBtKVxuICB9XG5cbiAgcmV0dXJuIChhW2xdID49IHIpID8gbCA6IC0xXG59XG5cblxuLyoqXG4gKiDQmtC+0L3QstC10YDRgtC40YDRg9C10YIg0YbQstC10YIg0LjQtyBIRVgt0L/RgNC10LTRgdGC0LDQstC70LXQvdC40Y8g0LIg0L/RgNC10LTRgdGC0LDQstC70LXQvdC40LUg0YbQstC10YLQsCDQtNC70Y8gR0xTTC3QutC+0LTQsCAoUkdCINGBINC00LjQsNC/0LDQt9C+0L3QsNC80Lgg0LfQvdCw0YfQtdC90LjQuSDQvtGCIDAg0LTQviAxKS5cbiAqXG4gKiBAcGFyYW0gaGV4Q29sb3IgLSDQptCy0LXRgiDQsiBIRVgt0YTQvtGA0LzQsNGC0LUuXG4gKiBAcmV0dXJucyDQnNCw0YHRgdC40LIg0LjQtyDRgtGA0LXRhSDRh9C40YHQtdC7INCyINC00LjQsNC/0LDQt9C+0L3QtSDQvtGCIDAg0LTQviAxLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY29sb3JGcm9tSGV4VG9HbFJnYihoZXhDb2xvcjogc3RyaW5nKTogbnVtYmVyW10ge1xuXG4gIGxldCBrID0gL14jPyhbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KSQvaS5leGVjKGhleENvbG9yKVxuICBsZXQgW3IsIGcsIGJdID0gW3BhcnNlSW50KGshWzFdLCAxNikgLyAyNTUsIHBhcnNlSW50KGshWzJdLCAxNikgLyAyNTUsIHBhcnNlSW50KGshWzNdLCAxNikgLyAyNTVdXG5cbiAgcmV0dXJuIFtyLCBnLCBiXVxufVxuXG4vKipcbiAqINCS0YvRh9C40YHQu9GP0LXRgiDRgtC10LrRg9GJ0LXQtSDQstGA0LXQvNGPLlxuICpcbiAqIEByZXR1cm5zINCh0YLRgNC+0LrQvtCy0LDRjyDRhNC+0YDQvNCw0YLQuNGA0L7QstCw0L3QvdCw0Y8g0LfQsNC/0LjRgdGMINGC0LXQutGD0YnQtdCz0L4g0LLRgNC10LzQtdC90LguINCk0L7RgNC80LDRgjogaGg6bW06c3NcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEN1cnJlbnRUaW1lKCk6IHN0cmluZyB7XG5cbiAgbGV0IHRvZGF5ID0gbmV3IERhdGUoKTtcblxuICBsZXQgdGltZSA9XG4gICAgKCh0b2RheS5nZXRIb3VycygpIDwgMTAgPyAnMCcgOiAnJykgKyB0b2RheS5nZXRIb3VycygpKSArIFwiOlwiICtcbiAgICAoKHRvZGF5LmdldE1pbnV0ZXMoKSA8IDEwID8gJzAnIDogJycpICsgdG9kYXkuZ2V0TWludXRlcygpKSArIFwiOlwiICtcbiAgICAoKHRvZGF5LmdldFNlY29uZHMoKSA8IDEwID8gJzAnIDogJycpICsgdG9kYXkuZ2V0U2Vjb25kcygpKVxuXG4gIHJldHVybiB0aW1lXG59XG4iLCIvKlxuICogQ29weXJpZ2h0IDIwMjEgR0ZYRnVuZGFtZW50YWxzLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBSZWRpc3RyaWJ1dGlvbiBhbmQgdXNlIGluIHNvdXJjZSBhbmQgYmluYXJ5IGZvcm1zLCB3aXRoIG9yIHdpdGhvdXRcbiAqIG1vZGlmaWNhdGlvbiwgYXJlIHBlcm1pdHRlZCBwcm92aWRlZCB0aGF0IHRoZSBmb2xsb3dpbmcgY29uZGl0aW9ucyBhcmVcbiAqIG1ldDpcbiAqXG4gKiAgICAgKiBSZWRpc3RyaWJ1dGlvbnMgb2Ygc291cmNlIGNvZGUgbXVzdCByZXRhaW4gdGhlIGFib3ZlIGNvcHlyaWdodFxuICogbm90aWNlLCB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyLlxuICogICAgICogUmVkaXN0cmlidXRpb25zIGluIGJpbmFyeSBmb3JtIG11c3QgcmVwcm9kdWNlIHRoZSBhYm92ZVxuICogY29weXJpZ2h0IG5vdGljZSwgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lclxuICogaW4gdGhlIGRvY3VtZW50YXRpb24gYW5kL29yIG90aGVyIG1hdGVyaWFscyBwcm92aWRlZCB3aXRoIHRoZVxuICogZGlzdHJpYnV0aW9uLlxuICogICAgICogTmVpdGhlciB0aGUgbmFtZSBvZiBHRlhGdW5kYW1lbnRhbHMuIG5vciB0aGUgbmFtZXMgb2YgaGlzXG4gKiBjb250cmlidXRvcnMgbWF5IGJlIHVzZWQgdG8gZW5kb3JzZSBvciBwcm9tb3RlIHByb2R1Y3RzIGRlcml2ZWQgZnJvbVxuICogdGhpcyBzb2Z0d2FyZSB3aXRob3V0IHNwZWNpZmljIHByaW9yIHdyaXR0ZW4gcGVybWlzc2lvbi5cbiAqXG4gKiBUSElTIFNPRlRXQVJFIElTIFBST1ZJREVEIEJZIFRIRSBDT1BZUklHSFQgSE9MREVSUyBBTkQgQ09OVFJJQlVUT1JTXG4gKiBcIkFTIElTXCIgQU5EIEFOWSBFWFBSRVNTIE9SIElNUExJRUQgV0FSUkFOVElFUywgSU5DTFVESU5HLCBCVVQgTk9UXG4gKiBMSU1JVEVEIFRPLCBUSEUgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSBBTkQgRklUTkVTUyBGT1JcbiAqIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFSRSBESVNDTEFJTUVELiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQ09QWVJJR0hUXG4gKiBPV05FUiBPUiBDT05UUklCVVRPUlMgQkUgTElBQkxFIEZPUiBBTlkgRElSRUNULCBJTkRJUkVDVCwgSU5DSURFTlRBTCxcbiAqIFNQRUNJQUwsIEVYRU1QTEFSWSwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTIChJTkNMVURJTkcsIEJVVCBOT1RcbiAqIExJTUlURUQgVE8sIFBST0NVUkVNRU5UIE9GIFNVQlNUSVRVVEUgR09PRFMgT1IgU0VSVklDRVM7IExPU1MgT0YgVVNFLFxuICogREFUQSwgT1IgUFJPRklUUzsgT1IgQlVTSU5FU1MgSU5URVJSVVBUSU9OKSBIT1dFVkVSIENBVVNFRCBBTkQgT04gQU5ZXG4gKiBUSEVPUlkgT0YgTElBQklMSVRZLCBXSEVUSEVSIElOIENPTlRSQUNULCBTVFJJQ1QgTElBQklMSVRZLCBPUiBUT1JUXG4gKiAoSU5DTFVESU5HIE5FR0xJR0VOQ0UgT1IgT1RIRVJXSVNFKSBBUklTSU5HIElOIEFOWSBXQVkgT1VUIE9GIFRIRSBVU0VcbiAqIE9GIFRISVMgU09GVFdBUkUsIEVWRU4gSUYgQURWSVNFRCBPRiBUSEUgUE9TU0lCSUxJVFkgT0YgU1VDSCBEQU1BR0UuXG4gKi9cblxuLyoqXG4gKiBWYXJpb3VzIDJkIG1hdGggZnVuY3Rpb25zLlxuICpcbiAqIEBtb2R1bGUgd2ViZ2wtMmQtbWF0aFxuICovXG4oZnVuY3Rpb24ocm9vdCwgZmFjdG9yeSkgeyAgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgLy8gQU1ELiBSZWdpc3RlciBhcyBhbiBhbm9ueW1vdXMgbW9kdWxlLlxuICAgIGRlZmluZShbXSwgZmFjdG9yeSk7XG4gIH0gZWxzZSB7XG4gICAgLy8gQnJvd3NlciBnbG9iYWxzXG4gICAgcm9vdC5tMyA9IGZhY3RvcnkoKTtcbiAgfVxufSh0aGlzLCBmdW5jdGlvbigpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgLyoqXG4gICAqIEFuIGFycmF5IG9yIHR5cGVkIGFycmF5IHdpdGggOSB2YWx1ZXMuXG4gICAqIEB0eXBlZGVmIHtudW1iZXJbXXxUeXBlZEFycmF5fSBNYXRyaXgzXG4gICAqIEBtZW1iZXJPZiBtb2R1bGU6d2ViZ2wtMmQtbWF0aFxuICAgKi9cblxuICAvKipcbiAgICogVGFrZXMgdHdvIE1hdHJpeDNzLCBhIGFuZCBiLCBhbmQgY29tcHV0ZXMgdGhlIHByb2R1Y3QgaW4gdGhlIG9yZGVyXG4gICAqIHRoYXQgcHJlLWNvbXBvc2VzIGIgd2l0aCBhLiAgSW4gb3RoZXIgd29yZHMsIHRoZSBtYXRyaXggcmV0dXJuZWQgd2lsbFxuICAgKiBAcGFyYW0ge21vZHVsZTp3ZWJnbC0yZC1tYXRoLk1hdHJpeDN9IGEgQSBtYXRyaXguXG4gICAqIEBwYXJhbSB7bW9kdWxlOndlYmdsLTJkLW1hdGguTWF0cml4M30gYiBBIG1hdHJpeC5cbiAgICogQHJldHVybiB7bW9kdWxlOndlYmdsLTJkLW1hdGguTWF0cml4M30gdGhlIHJlc3VsdC5cbiAgICogQG1lbWJlck9mIG1vZHVsZTp3ZWJnbC0yZC1tYXRoXG4gICAqL1xuICBmdW5jdGlvbiBtdWx0aXBseShhLCBiKSB7XG4gICAgdmFyIGEwMCA9IGFbMCAqIDMgKyAwXTtcbiAgICB2YXIgYTAxID0gYVswICogMyArIDFdO1xuICAgIHZhciBhMDIgPSBhWzAgKiAzICsgMl07XG4gICAgdmFyIGExMCA9IGFbMSAqIDMgKyAwXTtcbiAgICB2YXIgYTExID0gYVsxICogMyArIDFdO1xuICAgIHZhciBhMTIgPSBhWzEgKiAzICsgMl07XG4gICAgdmFyIGEyMCA9IGFbMiAqIDMgKyAwXTtcbiAgICB2YXIgYTIxID0gYVsyICogMyArIDFdO1xuICAgIHZhciBhMjIgPSBhWzIgKiAzICsgMl07XG4gICAgdmFyIGIwMCA9IGJbMCAqIDMgKyAwXTtcbiAgICB2YXIgYjAxID0gYlswICogMyArIDFdO1xuICAgIHZhciBiMDIgPSBiWzAgKiAzICsgMl07XG4gICAgdmFyIGIxMCA9IGJbMSAqIDMgKyAwXTtcbiAgICB2YXIgYjExID0gYlsxICogMyArIDFdO1xuICAgIHZhciBiMTIgPSBiWzEgKiAzICsgMl07XG4gICAgdmFyIGIyMCA9IGJbMiAqIDMgKyAwXTtcbiAgICB2YXIgYjIxID0gYlsyICogMyArIDFdO1xuICAgIHZhciBiMjIgPSBiWzIgKiAzICsgMl07XG5cbiAgICByZXR1cm4gW1xuICAgICAgYjAwICogYTAwICsgYjAxICogYTEwICsgYjAyICogYTIwLFxuICAgICAgYjAwICogYTAxICsgYjAxICogYTExICsgYjAyICogYTIxLFxuICAgICAgYjAwICogYTAyICsgYjAxICogYTEyICsgYjAyICogYTIyLFxuICAgICAgYjEwICogYTAwICsgYjExICogYTEwICsgYjEyICogYTIwLFxuICAgICAgYjEwICogYTAxICsgYjExICogYTExICsgYjEyICogYTIxLFxuICAgICAgYjEwICogYTAyICsgYjExICogYTEyICsgYjEyICogYTIyLFxuICAgICAgYjIwICogYTAwICsgYjIxICogYTEwICsgYjIyICogYTIwLFxuICAgICAgYjIwICogYTAxICsgYjIxICogYTExICsgYjIyICogYTIxLFxuICAgICAgYjIwICogYTAyICsgYjIxICogYTEyICsgYjIyICogYTIyLFxuICAgIF07XG4gIH1cblxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgM3gzIGlkZW50aXR5IG1hdHJpeFxuICAgKiBAcmV0dXJuIHttb2R1bGU6d2ViZ2wyLTJkLW1hdGguTWF0cml4M30gYW4gaWRlbnRpdHkgbWF0cml4XG4gICAqL1xuICBmdW5jdGlvbiBpZGVudGl0eSgpIHtcbiAgICByZXR1cm4gW1xuICAgICAgMSwgMCwgMCxcbiAgICAgIDAsIDEsIDAsXG4gICAgICAwLCAwLCAxLFxuICAgIF07XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIDJEIHByb2plY3Rpb24gbWF0cml4XG4gICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aCB3aWR0aCBpbiBwaXhlbHNcbiAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodCBoZWlnaHQgaW4gcGl4ZWxzXG4gICAqIEByZXR1cm4ge21vZHVsZTp3ZWJnbC0yZC1tYXRoLk1hdHJpeDN9IGEgcHJvamVjdGlvbiBtYXRyaXggdGhhdCBjb252ZXJ0cyBmcm9tIHBpeGVscyB0byBjbGlwc3BhY2Ugd2l0aCBZID0gMCBhdCB0aGUgdG9wLlxuICAgKiBAbWVtYmVyT2YgbW9kdWxlOndlYmdsLTJkLW1hdGhcbiAgICovXG4gIGZ1bmN0aW9uIHByb2plY3Rpb24od2lkdGgsIGhlaWdodCkge1xuICAgIC8vIE5vdGU6IFRoaXMgbWF0cml4IGZsaXBzIHRoZSBZIGF4aXMgc28gMCBpcyBhdCB0aGUgdG9wLlxuICAgIHJldHVybiBbXG4gICAgICAyIC8gd2lkdGgsIDAsIDAsXG4gICAgICAwLCAtMiAvIGhlaWdodCwgMCxcbiAgICAgIC0xLCAxLCAxLFxuICAgIF07XG4gIH1cblxuICAvKipcbiAgICogTXVsdGlwbGllcyBieSBhIDJEIHByb2plY3Rpb24gbWF0cml4XG4gICAqIEBwYXJhbSB7bW9kdWxlOndlYmdsLTJkLW1hdGguTWF0cml4M30gdGhlIG1hdHJpeCB0byBiZSBtdWx0aXBsaWVkXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aCB3aWR0aCBpbiBwaXhlbHNcbiAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodCBoZWlnaHQgaW4gcGl4ZWxzXG4gICAqIEByZXR1cm4ge21vZHVsZTp3ZWJnbC0yZC1tYXRoLk1hdHJpeDN9IHRoZSByZXN1bHRcbiAgICogQG1lbWJlck9mIG1vZHVsZTp3ZWJnbC0yZC1tYXRoXG4gICAqL1xuICBmdW5jdGlvbiBwcm9qZWN0KG0sIHdpZHRoLCBoZWlnaHQpIHtcbiAgICByZXR1cm4gbXVsdGlwbHkobSwgcHJvamVjdGlvbih3aWR0aCwgaGVpZ2h0KSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIDJEIHRyYW5zbGF0aW9uIG1hdHJpeFxuICAgKiBAcGFyYW0ge251bWJlcn0gdHggYW1vdW50IHRvIHRyYW5zbGF0ZSBpbiB4XG4gICAqIEBwYXJhbSB7bnVtYmVyfSB0eSBhbW91bnQgdG8gdHJhbnNsYXRlIGluIHlcbiAgICogQHJldHVybiB7bW9kdWxlOndlYmdsLTJkLW1hdGguTWF0cml4M30gYSB0cmFuc2xhdGlvbiBtYXRyaXggdGhhdCB0cmFuc2xhdGVzIGJ5IHR4IGFuZCB0eS5cbiAgICogQG1lbWJlck9mIG1vZHVsZTp3ZWJnbC0yZC1tYXRoXG4gICAqL1xuICBmdW5jdGlvbiB0cmFuc2xhdGlvbih0eCwgdHkpIHtcbiAgICByZXR1cm4gW1xuICAgICAgMSwgMCwgMCxcbiAgICAgIDAsIDEsIDAsXG4gICAgICB0eCwgdHksIDEsXG4gICAgXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNdWx0aXBsaWVzIGJ5IGEgMkQgdHJhbnNsYXRpb24gbWF0cml4XG4gICAqIEBwYXJhbSB7bW9kdWxlOndlYmdsLTJkLW1hdGguTWF0cml4M30gdGhlIG1hdHJpeCB0byBiZSBtdWx0aXBsaWVkXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB0eCBhbW91bnQgdG8gdHJhbnNsYXRlIGluIHhcbiAgICogQHBhcmFtIHtudW1iZXJ9IHR5IGFtb3VudCB0byB0cmFuc2xhdGUgaW4geVxuICAgKiBAcmV0dXJuIHttb2R1bGU6d2ViZ2wtMmQtbWF0aC5NYXRyaXgzfSB0aGUgcmVzdWx0XG4gICAqIEBtZW1iZXJPZiBtb2R1bGU6d2ViZ2wtMmQtbWF0aFxuICAgKi9cbiAgZnVuY3Rpb24gdHJhbnNsYXRlKG0sIHR4LCB0eSkge1xuICAgIHJldHVybiBtdWx0aXBseShtLCB0cmFuc2xhdGlvbih0eCwgdHkpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgMkQgcm90YXRpb24gbWF0cml4XG4gICAqIEBwYXJhbSB7bnVtYmVyfSBhbmdsZUluUmFkaWFucyBhbW91bnQgdG8gcm90YXRlIGluIHJhZGlhbnNcbiAgICogQHJldHVybiB7bW9kdWxlOndlYmdsLTJkLW1hdGguTWF0cml4M30gYSByb3RhdGlvbiBtYXRyaXggdGhhdCByb3RhdGVzIGJ5IGFuZ2xlSW5SYWRpYW5zXG4gICAqIEBtZW1iZXJPZiBtb2R1bGU6d2ViZ2wtMmQtbWF0aFxuICAgKi9cbiAgZnVuY3Rpb24gcm90YXRpb24oYW5nbGVJblJhZGlhbnMpIHtcbiAgICB2YXIgYyA9IE1hdGguY29zKGFuZ2xlSW5SYWRpYW5zKTtcbiAgICB2YXIgcyA9IE1hdGguc2luKGFuZ2xlSW5SYWRpYW5zKTtcbiAgICByZXR1cm4gW1xuICAgICAgYywgLXMsIDAsXG4gICAgICBzLCBjLCAwLFxuICAgICAgMCwgMCwgMSxcbiAgICBdO1xuICB9XG5cbiAgLyoqXG4gICAqIE11bHRpcGxpZXMgYnkgYSAyRCByb3RhdGlvbiBtYXRyaXhcbiAgICogQHBhcmFtIHttb2R1bGU6d2ViZ2wtMmQtbWF0aC5NYXRyaXgzfSB0aGUgbWF0cml4IHRvIGJlIG11bHRpcGxpZWRcbiAgICogQHBhcmFtIHtudW1iZXJ9IGFuZ2xlSW5SYWRpYW5zIGFtb3VudCB0byByb3RhdGUgaW4gcmFkaWFuc1xuICAgKiBAcmV0dXJuIHttb2R1bGU6d2ViZ2wtMmQtbWF0aC5NYXRyaXgzfSB0aGUgcmVzdWx0XG4gICAqIEBtZW1iZXJPZiBtb2R1bGU6d2ViZ2wtMmQtbWF0aFxuICAgKi9cbiAgZnVuY3Rpb24gcm90YXRlKG0sIGFuZ2xlSW5SYWRpYW5zKSB7XG4gICAgcmV0dXJuIG11bHRpcGx5KG0sIHJvdGF0aW9uKGFuZ2xlSW5SYWRpYW5zKSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIDJEIHNjYWxpbmcgbWF0cml4XG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzeCBhbW91bnQgdG8gc2NhbGUgaW4geFxuICAgKiBAcGFyYW0ge251bWJlcn0gc3kgYW1vdW50IHRvIHNjYWxlIGluIHlcbiAgICogQHJldHVybiB7bW9kdWxlOndlYmdsLTJkLW1hdGguTWF0cml4M30gYSBzY2FsZSBtYXRyaXggdGhhdCBzY2FsZXMgYnkgc3ggYW5kIHN5LlxuICAgKiBAbWVtYmVyT2YgbW9kdWxlOndlYmdsLTJkLW1hdGhcbiAgICovXG4gIGZ1bmN0aW9uIHNjYWxpbmcoc3gsIHN5KSB7XG4gICAgcmV0dXJuIFtcbiAgICAgIHN4LCAwLCAwLFxuICAgICAgMCwgc3ksIDAsXG4gICAgICAwLCAwLCAxLFxuICAgIF07XG4gIH1cblxuICAvKipcbiAgICogTXVsdGlwbGllcyBieSBhIDJEIHNjYWxpbmcgbWF0cml4XG4gICAqIEBwYXJhbSB7bW9kdWxlOndlYmdsLTJkLW1hdGguTWF0cml4M30gdGhlIG1hdHJpeCB0byBiZSBtdWx0aXBsaWVkXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzeCBhbW91bnQgdG8gc2NhbGUgaW4geFxuICAgKiBAcGFyYW0ge251bWJlcn0gc3kgYW1vdW50IHRvIHNjYWxlIGluIHlcbiAgICogQHJldHVybiB7bW9kdWxlOndlYmdsLTJkLW1hdGguTWF0cml4M30gdGhlIHJlc3VsdFxuICAgKiBAbWVtYmVyT2YgbW9kdWxlOndlYmdsLTJkLW1hdGhcbiAgICovXG4gIGZ1bmN0aW9uIHNjYWxlKG0sIHN4LCBzeSkge1xuICAgIHJldHVybiBtdWx0aXBseShtLCBzY2FsaW5nKHN4LCBzeSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gZG90KHgxLCB5MSwgeDIsIHkyKSB7XG4gICAgcmV0dXJuIHgxICogeDIgKyB5MSAqIHkyO1xuICB9XG5cbiAgZnVuY3Rpb24gZGlzdGFuY2UoeDEsIHkxLCB4MiwgeTIpIHtcbiAgICB2YXIgZHggPSB4MSAtIHgyO1xuICAgIHZhciBkeSA9IHkxIC0geTI7XG4gICAgcmV0dXJuIE1hdGguc3FydChkeCAqIGR4ICsgZHkgKiBkeSk7XG4gIH1cblxuICBmdW5jdGlvbiBub3JtYWxpemUoeCwgeSkge1xuICAgIHZhciBsID0gZGlzdGFuY2UoMCwgMCwgeCwgeSk7XG4gICAgaWYgKGwgPiAwLjAwMDAxKSB7XG4gICAgICByZXR1cm4gW3ggLyBsLCB5IC8gbF07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBbMCwgMF07XG4gICAgfVxuICB9XG5cbiAgLy8gaSA9IGluY2lkZW50XG4gIC8vIG4gPSBub3JtYWxcbiAgZnVuY3Rpb24gcmVmbGVjdChpeCwgaXksIG54LCBueSkge1xuICAgIC8vIEkgLSAyLjAgKiBkb3QoTiwgSSkgKiBOLlxuICAgIHZhciBkID0gZG90KG54LCBueSwgaXgsIGl5KTtcbiAgICByZXR1cm4gW1xuICAgICAgaXggLSAyICogZCAqIG54LFxuICAgICAgaXkgLSAyICogZCAqIG55LFxuICAgIF07XG4gIH1cblxuICBmdW5jdGlvbiByYWRUb0RlZyhyKSB7XG4gICAgcmV0dXJuIHIgKiAxODAgLyBNYXRoLlBJO1xuICB9XG5cbiAgZnVuY3Rpb24gZGVnVG9SYWQoZCkge1xuICAgIHJldHVybiBkICogTWF0aC5QSSAvIDE4MDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRyYW5zZm9ybVBvaW50KG0sIHYpIHtcbiAgICB2YXIgdjAgPSB2WzBdO1xuICAgIHZhciB2MSA9IHZbMV07XG4gICAgdmFyIGQgPSB2MCAqIG1bMCAqIDMgKyAyXSArIHYxICogbVsxICogMyArIDJdICsgbVsyICogMyArIDJdO1xuICAgIHJldHVybiBbXG4gICAgICAodjAgKiBtWzAgKiAzICsgMF0gKyB2MSAqIG1bMSAqIDMgKyAwXSArIG1bMiAqIDMgKyAwXSkgLyBkLFxuICAgICAgKHYwICogbVswICogMyArIDFdICsgdjEgKiBtWzEgKiAzICsgMV0gKyBtWzIgKiAzICsgMV0pIC8gZCxcbiAgICBdO1xuICB9XG5cbiAgZnVuY3Rpb24gaW52ZXJzZShtKSB7XG4gICAgdmFyIHQwMCA9IG1bMSAqIDMgKyAxXSAqIG1bMiAqIDMgKyAyXSAtIG1bMSAqIDMgKyAyXSAqIG1bMiAqIDMgKyAxXTtcbiAgICB2YXIgdDEwID0gbVswICogMyArIDFdICogbVsyICogMyArIDJdIC0gbVswICogMyArIDJdICogbVsyICogMyArIDFdO1xuICAgIHZhciB0MjAgPSBtWzAgKiAzICsgMV0gKiBtWzEgKiAzICsgMl0gLSBtWzAgKiAzICsgMl0gKiBtWzEgKiAzICsgMV07XG4gICAgdmFyIGQgPSAxLjAgLyAobVswICogMyArIDBdICogdDAwIC0gbVsxICogMyArIDBdICogdDEwICsgbVsyICogMyArIDBdICogdDIwKTtcbiAgICByZXR1cm4gW1xuICAgICAgIGQgKiB0MDAsIC1kICogdDEwLCBkICogdDIwLFxuICAgICAgLWQgKiAobVsxICogMyArIDBdICogbVsyICogMyArIDJdIC0gbVsxICogMyArIDJdICogbVsyICogMyArIDBdKSxcbiAgICAgICBkICogKG1bMCAqIDMgKyAwXSAqIG1bMiAqIDMgKyAyXSAtIG1bMCAqIDMgKyAyXSAqIG1bMiAqIDMgKyAwXSksXG4gICAgICAtZCAqIChtWzAgKiAzICsgMF0gKiBtWzEgKiAzICsgMl0gLSBtWzAgKiAzICsgMl0gKiBtWzEgKiAzICsgMF0pLFxuICAgICAgIGQgKiAobVsxICogMyArIDBdICogbVsyICogMyArIDFdIC0gbVsxICogMyArIDFdICogbVsyICogMyArIDBdKSxcbiAgICAgIC1kICogKG1bMCAqIDMgKyAwXSAqIG1bMiAqIDMgKyAxXSAtIG1bMCAqIDMgKyAxXSAqIG1bMiAqIDMgKyAwXSksXG4gICAgICAgZCAqIChtWzAgKiAzICsgMF0gKiBtWzEgKiAzICsgMV0gLSBtWzAgKiAzICsgMV0gKiBtWzEgKiAzICsgMF0pLFxuICAgIF07XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGRlZ1RvUmFkOiBkZWdUb1JhZCxcbiAgICBkaXN0YW5jZTogZGlzdGFuY2UsXG4gICAgZG90OiBkb3QsXG4gICAgaWRlbnRpdHk6IGlkZW50aXR5LFxuICAgIGludmVyc2U6IGludmVyc2UsXG4gICAgbXVsdGlwbHk6IG11bHRpcGx5LFxuICAgIG5vcm1hbGl6ZTogbm9ybWFsaXplLFxuICAgIHByb2plY3Rpb246IHByb2plY3Rpb24sXG4gICAgcmFkVG9EZWc6IHJhZFRvRGVnLFxuICAgIHJlZmxlY3Q6IHJlZmxlY3QsXG4gICAgcm90YXRpb246IHJvdGF0aW9uLFxuICAgIHJvdGF0ZTogcm90YXRlLFxuICAgIHNjYWxpbmc6IHNjYWxpbmcsXG4gICAgc2NhbGU6IHNjYWxlLFxuICAgIHRyYW5zZm9ybVBvaW50OiB0cmFuc2Zvcm1Qb2ludCxcbiAgICB0cmFuc2xhdGlvbjogdHJhbnNsYXRpb24sXG4gICAgdHJhbnNsYXRlOiB0cmFuc2xhdGUsXG4gICAgcHJvamVjdDogcHJvamVjdCxcbiAgfTtcblxufSkpO1xuXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9pbmRleC50c1wiKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=