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
            shape: randomInt(2),
            size: 10 + randomInt(21),
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
    grid: {
        width: plotWidth,
        height: plotHeight,
    },
    debug: {
        isEnable: true,
    },
    demoMode: {
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
        console.log('Кол-во цветов в палитре: ' + this.splot.polygonPalette.length);
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
                color: utils_1.randomInt(this.splot.polygonPalette.length)
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
var splot_demo_1 = __importDefault(__webpack_require__(/*! ./splot-demo */ "./splot-demo.ts"));
var splot_webgl_1 = __importDefault(__webpack_require__(/*! ./splot-webgl */ "./splot-webgl.ts"));
var splot_debug_1 = __importDefault(__webpack_require__(/*! ./splot-debug */ "./splot-debug.ts"));
var splot_control_1 = __importDefault(__webpack_require__(/*! ./splot-control */ "./splot-control.ts"));
var shader_code_vert_tmpl_1 = __importDefault(__webpack_require__(/*! ./shader-code-vert-tmpl */ "./shader-code-vert-tmpl.ts"));
var shader_code_frag_tmpl_1 = __importDefault(__webpack_require__(/*! ./shader-code-frag-tmpl */ "./shader-code-frag-tmpl.ts"));
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
        this.iterationCallback = undefined; // Функция итерирования объектов.
        this.debug = new splot_debug_1.default(this); // Объект, управляющий режимом отладки.
        this.webGl = new splot_webgl_1.default(this); // Объект управления webGL.
        this.forceRun = false; // Признак форсированного запуска рендера.
        this.maxAmountOfPolygons = 1000000000; // Искусственное ограничение кол-ва объектов.
        this.isRunning = false; // Признак активного процесса рендера.
        // Цветовая палитра полигонов по умолчанию.
        this.polygonPalette = [
            '#FF00FF', '#800080', '#FF0000', '#800000', '#FFFF00',
            '#00FF00', '#008000', '#00FFFF', '#0000FF', '#000080'
        ];
        // Параметры координатной плоскости по умолчанию.
        this.grid = {
            width: 32000,
            height: 16000,
            bgColor: '#ffffff',
            rulesColor: '#c0c0c0'
        };
        // Параметры режима демострационных данных.
        this.demo = new splot_demo_1.default(this);
        // По умолчанию область просмотра устанавливается в центр координатной плооскости.
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
            this.iterationCallback = this.demo.demoIterationCallback; // Имитация итерирования для демо-режима.
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
            this.debug.logDataLoadingComplete(this.amountOfPolygons, this.maxAmountOfPolygons);
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
        this.polygonPalette.push(this.grid.rulesColor);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zdHlsZS5jc3MiLCJ3ZWJwYWNrOi8vLy4vaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vc2hhZGVyLWNvZGUtZnJhZy10bXBsLnRzIiwid2VicGFjazovLy8uL3NoYWRlci1jb2RlLXZlcnQtdG1wbC50cyIsIndlYnBhY2s6Ly8vLi9zcGxvdC1jb250cm9sLnRzIiwid2VicGFjazovLy8uL3NwbG90LWRlYnVnLnRzIiwid2VicGFjazovLy8uL3NwbG90LWRlbW8udHMiLCJ3ZWJwYWNrOi8vLy4vc3Bsb3Qtd2ViZ2wudHMiLCJ3ZWJwYWNrOi8vLy4vc3Bsb3QudHMiLCJ3ZWJwYWNrOi8vLy4vdXRpbHMudHMiLCJ3ZWJwYWNrOi8vLy4vbTMuanMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovLy93ZWJwYWNrL3N0YXJ0dXAiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBQSxnRkFBMkI7QUFDM0Isa0RBQWdCO0FBRWhCLFNBQVMsU0FBUyxDQUFDLEtBQWE7SUFDOUIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxLQUFLLENBQUM7QUFDMUMsQ0FBQztBQUVELElBQUksQ0FBQyxHQUFHLENBQUM7QUFDVCxJQUFJLENBQUMsR0FBRyxPQUFTLEVBQUUsOEJBQThCO0FBQ2pELElBQUksT0FBTyxHQUFHLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDO0FBQzVILElBQUksU0FBUyxHQUFHLEtBQU07QUFDdEIsSUFBSSxVQUFVLEdBQUcsS0FBTTtBQUV2QixnSEFBZ0g7QUFDaEgsU0FB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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBLGNBQWMsOEJBQThCO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEIsY0FBYyw2QkFBNkI7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWEsNkJBQTZCO0FBQzFDLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEIsY0FBYyw2QkFBNkI7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQixjQUFjLDZCQUE2QjtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWEsNkJBQTZCO0FBQzFDLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEIsY0FBYyw2QkFBNkI7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCLGNBQWMsNkJBQTZCO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWEsNkJBQTZCO0FBQzFDLGFBQWEsT0FBTztBQUNwQixjQUFjLDZCQUE2QjtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhLE9BQU87QUFDcEIsYUFBYSxPQUFPO0FBQ3BCLGNBQWMsNkJBQTZCO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYSw2QkFBNkI7QUFDMUMsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQixjQUFjLDZCQUE2QjtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxDQUFDOzs7Ozs7OztVQzdTRDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQSxzREFBc0Qsa0JBQWtCO1dBQ3hFO1dBQ0EsK0NBQStDLGNBQWM7V0FDN0QsRTs7Ozs7VUNOQTtVQUNBO1VBQ0E7VUFDQSIsImZpbGUiOiJzY3JpcHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCJpbXBvcnQgU1Bsb3QgZnJvbSAnLi9zcGxvdCdcbmltcG9ydCAnQC9zdHlsZSdcblxuZnVuY3Rpb24gcmFuZG9tSW50KHJhbmdlOiBudW1iZXIpIHtcbiAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHJhbmdlKVxufVxuXG5sZXQgaSA9IDBcbmxldCBuID0gMV8wMDBfMDAwICAvLyDQmNC80LjRgtC40YDRg9C10LzQvtC1INGH0LjRgdC70L4g0L7QsdGK0LXQutGC0L7Qsi5cbmxldCBwYWxldHRlID0gWycjRkYwMEZGJywgJyM4MDAwODAnLCAnI0ZGMDAwMCcsICcjODAwMDAwJywgJyNGRkZGMDAnLCAnIzAwRkYwMCcsICcjMDA4MDAwJywgJyMwMEZGRkYnLCAnIzAwMDBGRicsICcjMDAwMDgwJ11cbmxldCBwbG90V2lkdGggPSAzMl8wMDBcbmxldCBwbG90SGVpZ2h0ID0gMTZfMDAwXG5cbi8vINCf0YDQuNC80LXRgCDQuNGC0LXRgNC40YDRg9GO0YnQtdC5INGE0YPQvdC60YbQuNC4LiDQmNGC0LXRgNCw0YbQuNC4INC40LzQuNGC0LjRgNGD0Y7RgtGB0Y8g0YHQu9GD0YfQsNC50L3Ri9C80Lgg0LLRi9C00LDRh9Cw0LzQuC4g0J/QvtGH0YLQuCDRgtCw0LrQttC1INGA0LDQsdC+0YLQsNC10YIg0YDQtdC20LjQvCDQtNC10LzQvi3QtNCw0L3QvdGL0YUuXG5mdW5jdGlvbiByZWFkTmV4dE9iamVjdCgpIHtcbiAgaWYgKGkgPCBuKSB7XG4gICAgaSsrXG4gICAgcmV0dXJuIHtcbiAgICAgIHg6IHJhbmRvbUludChwbG90V2lkdGgpLFxuICAgICAgeTogcmFuZG9tSW50KHBsb3RIZWlnaHQpLFxuICAgICAgc2hhcGU6IHJhbmRvbUludCgyKSxcbiAgICAgIHNpemU6IDEwICsgcmFuZG9tSW50KDIxKSxcbiAgICAgIGNvbG9yOiByYW5kb21JbnQocGFsZXR0ZS5sZW5ndGgpLCAgLy8g0JjQvdC00LXQutGBINGG0LLQtdGC0LAg0LIg0LzQsNGB0YHQuNCy0LUg0YbQstC10YLQvtCyXG4gICAgfVxuICB9XG4gIGVsc2VcbiAgICByZXR1cm4gbnVsbCAgLy8g0JLQvtC30LLRgNCw0YnQsNC10LwgbnVsbCwg0LrQvtCz0LTQsCDQvtCx0YrQtdC60YLRiyBcItC30LDQutC+0L3Rh9C40LvQuNGB0YxcIlxufVxuXG4vKiogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICoqL1xuXG5sZXQgc2NhdHRlclBsb3QgPSBuZXcgU1Bsb3QoJ2NhbnZhczEnKVxuXG4vLyDQndCw0YHRgtGA0L7QudC60LAg0Y3QutC30LXQvNC/0LvRj9GA0LAg0L3QsCDRgNC10LbQuNC8INCy0YvQstC+0LTQsCDQvtGC0LvQsNC00L7Rh9C90L7QuSDQuNC90YTQvtGA0LzQsNGG0LjQuCDQsiDQutC+0L3RgdC+0LvRjCDQsdGA0LDRg9C30LXRgNCwLlxuLy8g0JTRgNGD0LPQuNC1INC/0YDQuNC80LXRgNGLINGA0LDQsdC+0YLRiyDQvtC/0LjRgdCw0L3RiyDQsiDRhNCw0LnQu9C1IHNwbG90LmpzINGB0L4g0YHRgtGA0L7QutC4IDIxNC5cbnNjYXR0ZXJQbG90LnNldHVwKHtcbiAgaXRlcmF0aW9uQ2FsbGJhY2s6IHJlYWROZXh0T2JqZWN0LFxuICBwb2x5Z29uUGFsZXR0ZTogcGFsZXR0ZSxcbiAgZ3JpZDoge1xuICAgIHdpZHRoOiBwbG90V2lkdGgsXG4gICAgaGVpZ2h0OiBwbG90SGVpZ2h0LFxuICB9LFxuICBkZWJ1Zzoge1xuICAgIGlzRW5hYmxlOiB0cnVlLFxuICB9LFxuICBkZW1vTW9kZToge1xuICAgIGlzRW5hYmxlOiBmYWxzZSxcbiAgfSxcbiAgdXNlVmVydGV4SW5kaWNlczogZmFsc2Vcbn0pXG5cbnNjYXR0ZXJQbG90LnJ1bigpXG4vL3NjYXR0ZXJQbG90LnN0b3AoKVxuXG4vL3NldFRpbWVvdXQoKCkgPT4gc2NhdHRlclBsb3Quc3RvcCgpLCAzMDAwKVxuIiwiZXhwb3J0IGRlZmF1bHRcbmBcbnByZWNpc2lvbiBsb3dwIGZsb2F0O1xudmFyeWluZyB2ZWMzIHZfY29sb3I7XG52YXJ5aW5nIGZsb2F0IHZfc2hhcGU7XG52b2lkIG1haW4oKSB7XG4gIGlmICh2X3NoYXBlID09IDAuMCkge1xuICAgIGZsb2F0IHZTaXplID0gMjAuMDtcbiAgICBmbG9hdCBkaXN0YW5jZSA9IGxlbmd0aCgyLjAgKiBnbF9Qb2ludENvb3JkIC0gMS4wKTtcbiAgICBpZiAoZGlzdGFuY2UgPiAxLjApIHsgZGlzY2FyZDsgfTtcbiAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KHZfY29sb3IucmdiLCAxLjApO1xuICB9XG4gIGVsc2UgaWYgKHZfc2hhcGUgPT0gMS4wKSB7XG4gICAgZ2xfRnJhZ0NvbG9yID0gdmVjNCh2X2NvbG9yLnJnYiwgMS4wKTtcbiAgfVxufVxuYFxuXG4vKipcbmV4cG9ydCBkZWZhdWx0XG4gIGBcbnByZWNpc2lvbiBsb3dwIGZsb2F0O1xudmFyeWluZyB2ZWMzIHZfY29sb3I7XG52b2lkIG1haW4oKSB7XG4gIGZsb2F0IHZTaXplID0gMjAuMDtcbiAgZmxvYXQgZGlzdGFuY2UgPSBsZW5ndGgoMi4wICogZ2xfUG9pbnRDb29yZCAtIDEuMCk7XG4gIGlmIChkaXN0YW5jZSA+IDEuMCkgeyBkaXNjYXJkOyB9XG4gIGdsX0ZyYWdDb2xvciA9IHZlYzQodl9jb2xvci5yZ2IsIDEuMCk7XG5cbiAgIHZlYzQgdUVkZ2VDb2xvciA9IHZlYzQoMC41LCAwLjUsIDAuNSwgMS4wKTtcbiBmbG9hdCB1RWRnZVNpemUgPSAxLjA7XG5cbmZsb2F0IHNFZGdlID0gc21vb3Roc3RlcChcbiAgdlNpemUgLSB1RWRnZVNpemUgLSAyLjAsXG4gIHZTaXplIC0gdUVkZ2VTaXplLFxuICBkaXN0YW5jZSAqICh2U2l6ZSArIHVFZGdlU2l6ZSlcbik7XG5nbF9GcmFnQ29sb3IgPSAodUVkZ2VDb2xvciAqIHNFZGdlKSArICgoMS4wIC0gc0VkZ2UpICogZ2xfRnJhZ0NvbG9yKTtcblxuZ2xfRnJhZ0NvbG9yLmEgPSBnbF9GcmFnQ29sb3IuYSAqICgxLjAgLSBzbW9vdGhzdGVwKFxuICAgIHZTaXplIC0gMi4wLFxuICAgIHZTaXplLFxuICAgIGRpc3RhbmNlICogdlNpemVcbikpO1xuXG59XG5gXG4qL1xuIiwiZXhwb3J0IGRlZmF1bHRcbmBcbmF0dHJpYnV0ZSB2ZWMyIGFfcG9zaXRpb247XG5hdHRyaWJ1dGUgZmxvYXQgYV9jb2xvcjtcbmF0dHJpYnV0ZSBmbG9hdCBhX3BvbHlnb25zaXplO1xuYXR0cmlidXRlIGZsb2F0IGFfc2hhcGU7XG51bmlmb3JtIG1hdDMgdV9tYXRyaXg7XG52YXJ5aW5nIHZlYzMgdl9jb2xvcjtcbnZhcnlpbmcgZmxvYXQgdl9zaGFwZTtcbnZvaWQgbWFpbigpIHtcbiAgZ2xfUG9zaXRpb24gPSB2ZWM0KCh1X21hdHJpeCAqIHZlYzMoYV9wb3NpdGlvbiwgMSkpLnh5LCAwLjAsIDEuMCk7XG4gIGdsX1BvaW50U2l6ZSA9IGFfcG9seWdvbnNpemU7XG4gIHZfc2hhcGUgPSBhX3NoYXBlO1xuICB7RVhURVJOQUwtQ09ERX1cbn1cbmBcbiIsIi8vIEB0cy1pZ25vcmVcbmltcG9ydCBtMyBmcm9tICcuL20zJ1xuaW1wb3J0IFNQbG90IGZyb20gJy4vc3Bsb3QnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNQbG90Q29udG9sIHtcblxuICBwcml2YXRlIHNwbG90OiBTUGxvdFxuXG4gIHByb3RlY3RlZCBoYW5kbGVNb3VzZURvd25XaXRoQ29udGV4dDogRXZlbnRMaXN0ZW5lciA9IHRoaXMuaGFuZGxlTW91c2VEb3duLmJpbmQodGhpcykgYXMgRXZlbnRMaXN0ZW5lclxuICBwcm90ZWN0ZWQgaGFuZGxlTW91c2VXaGVlbFdpdGhDb250ZXh0OiBFdmVudExpc3RlbmVyID0gdGhpcy5oYW5kbGVNb3VzZVdoZWVsLmJpbmQodGhpcykgYXMgRXZlbnRMaXN0ZW5lclxuICBwcm90ZWN0ZWQgaGFuZGxlTW91c2VNb3ZlV2l0aENvbnRleHQ6IEV2ZW50TGlzdGVuZXIgPSB0aGlzLmhhbmRsZU1vdXNlTW92ZS5iaW5kKHRoaXMpIGFzIEV2ZW50TGlzdGVuZXJcbiAgcHJvdGVjdGVkIGhhbmRsZU1vdXNlVXBXaXRoQ29udGV4dDogRXZlbnRMaXN0ZW5lciA9IHRoaXMuaGFuZGxlTW91c2VVcC5iaW5kKHRoaXMpIGFzIEV2ZW50TGlzdGVuZXJcblxuICBjb25zdHJ1Y3RvcihzcGxvdDogU1Bsb3QpIHtcbiAgICB0aGlzLnNwbG90ID0gc3Bsb3RcbiAgfVxuXG4gIHB1YmxpYyBydW4oKSB7XG4gICAgdGhpcy5zcGxvdC5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5oYW5kbGVNb3VzZURvd25XaXRoQ29udGV4dClcbiAgICB0aGlzLnNwbG90LmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCd3aGVlbCcsIHRoaXMuaGFuZGxlTW91c2VXaGVlbFdpdGhDb250ZXh0KVxuICB9XG5cbiAgcHVibGljIHN0b3AoKSB7XG4gICAgdGhpcy5zcGxvdC5jYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5oYW5kbGVNb3VzZURvd25XaXRoQ29udGV4dClcbiAgICB0aGlzLnNwbG90LmNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKCd3aGVlbCcsIHRoaXMuaGFuZGxlTW91c2VXaGVlbFdpdGhDb250ZXh0KVxuICAgIHRoaXMuc3Bsb3QuY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMuaGFuZGxlTW91c2VNb3ZlV2l0aENvbnRleHQpXG4gICAgdGhpcy5zcGxvdC5jYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuaGFuZGxlTW91c2VVcFdpdGhDb250ZXh0KVxuICB9XG5cbiAgcHJvdGVjdGVkIG1ha2VDYW1lcmFNYXRyaXgoKSB7XG5cbiAgICBjb25zdCB6b29tU2NhbGUgPSAxIC8gdGhpcy5zcGxvdC5jYW1lcmEuem9vbSE7XG5cbiAgICBsZXQgY2FtZXJhTWF0ID0gbTMuaWRlbnRpdHkoKTtcbiAgICBjYW1lcmFNYXQgPSBtMy50cmFuc2xhdGUoY2FtZXJhTWF0LCB0aGlzLnNwbG90LmNhbWVyYS54LCB0aGlzLnNwbG90LmNhbWVyYS55KTtcbiAgICBjYW1lcmFNYXQgPSBtMy5zY2FsZShjYW1lcmFNYXQsIHpvb21TY2FsZSwgem9vbVNjYWxlKTtcblxuICAgIHJldHVybiBjYW1lcmFNYXQ7XG4gIH1cblxuICAvKipcbiAgICog0J7QsdC90L7QstC70Y/QtdGCINC80LDRgtGA0LjRhtGDINGC0YDQsNC90YHRhNC+0YDQvNCw0YbQuNC4LlxuICAgKlxuICAgKiBAcmVtYXJrc1xuICAgKiDQodGD0YnQtdGB0YLQstGD0LXRgiDQtNCy0LAg0LLQsNGA0LjQsNC90YLQsCDQstGL0LfQvtCy0LAg0LzQtdGC0L7QtNCwIC0g0LjQtyDQtNGA0YPQs9C+0LPQviDQvNC10YLQvtC00LAg0Y3QutC30LXQvNC/0LvRj9GA0LAgKHtAbGluayByZW5kZXJ9KSDQuCDQuNC3INC+0LHRgNCw0LHQvtGC0YfQuNC60LAg0YHQvtCx0YvRgtC40Y8g0LzRi9GI0LhcbiAgICogKHtAbGluayBoYW5kbGVNb3VzZVdoZWVsfSkuINCS0L4g0LLRgtC+0YDQvtC8INCy0LDRgNC40LDQvdGC0LUg0LjRgdC/0L7Qu9GM0LfQvtCy0LDQvdC40LUg0L7QsdGK0LXQutGC0LAgdGhpcyDQvdC10LLQvtC30LzQvtC20L3Qvi4g0JTQu9GPINGD0L3QuNCy0LXRgNGB0LDQu9GM0L3QvtGB0YLQuCDQstGL0LfQvtCy0LBcbiAgICog0LzQtdGC0L7QtNCwIC0g0LIg0L3QtdCz0L4g0LLRgdC10LPQtNCwINGP0LLQvdC+INC90LXQvtCx0YXQvtC00LjQvNC+INC/0LXRgNC10LTQsNCy0LDRgtGMINGB0YHRi9C70LrRgyDQvdCwINGN0LrQt9C10LzQv9C70Y/RgCDQutC70LDRgdGB0LAuXG4gICAqL1xuICBwdWJsaWMgdXBkYXRlVmlld1Byb2plY3Rpb24oKTogdm9pZCB7XG5cbiAgICBjb25zdCBwcm9qZWN0aW9uTWF0ID0gbTMucHJvamVjdGlvbih0aGlzLnNwbG90LmdsLmNhbnZhcy53aWR0aCwgdGhpcy5zcGxvdC5nbC5jYW52YXMuaGVpZ2h0KTtcbiAgICBjb25zdCBjYW1lcmFNYXQgPSB0aGlzLm1ha2VDYW1lcmFNYXRyaXgoKTtcbiAgICBsZXQgdmlld01hdCA9IG0zLmludmVyc2UoY2FtZXJhTWF0KTtcbiAgICB0aGlzLnNwbG90LnRyYW5zZm9ybS52aWV3UHJvamVjdGlvbk1hdCA9IG0zLm11bHRpcGx5KHByb2plY3Rpb25NYXQsIHZpZXdNYXQpO1xuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqL1xuICBwcm90ZWN0ZWQgZ2V0Q2xpcFNwYWNlTW91c2VQb3NpdGlvbihldmVudDogTW91c2VFdmVudCkge1xuXG4gICAgLy8gZ2V0IGNhbnZhcyByZWxhdGl2ZSBjc3MgcG9zaXRpb25cbiAgICBjb25zdCByZWN0ID0gdGhpcy5zcGxvdC5jYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgY3NzWCA9IGV2ZW50LmNsaWVudFggLSByZWN0LmxlZnQ7XG4gICAgY29uc3QgY3NzWSA9IGV2ZW50LmNsaWVudFkgLSByZWN0LnRvcDtcblxuICAgIC8vIGdldCBub3JtYWxpemVkIDAgdG8gMSBwb3NpdGlvbiBhY3Jvc3MgYW5kIGRvd24gY2FudmFzXG4gICAgY29uc3Qgbm9ybWFsaXplZFggPSBjc3NYIC8gdGhpcy5zcGxvdC5jYW52YXMuY2xpZW50V2lkdGg7XG4gICAgY29uc3Qgbm9ybWFsaXplZFkgPSBjc3NZIC8gdGhpcy5zcGxvdC5jYW52YXMuY2xpZW50SGVpZ2h0O1xuXG4gICAgLy8gY29udmVydCB0byBjbGlwIHNwYWNlXG4gICAgY29uc3QgY2xpcFggPSBub3JtYWxpemVkWCAqIDIgLSAxO1xuICAgIGNvbnN0IGNsaXBZID0gbm9ybWFsaXplZFkgKiAtMiArIDE7XG5cbiAgICByZXR1cm4gW2NsaXBYLCBjbGlwWV07XG4gIH1cblxuICAvKipcbiAgICpcbiAgICovXG4gIHByb3RlY3RlZCBtb3ZlQ2FtZXJhKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG5cbiAgICBjb25zdCBwb3MgPSBtMy50cmFuc2Zvcm1Qb2ludChcbiAgICAgIHRoaXMuc3Bsb3QudHJhbnNmb3JtLnN0YXJ0SW52Vmlld1Byb2pNYXQsXG4gICAgICB0aGlzLmdldENsaXBTcGFjZU1vdXNlUG9zaXRpb24oZXZlbnQpXG4gICAgKTtcblxuICAgIHRoaXMuc3Bsb3QuY2FtZXJhLnggPVxuICAgICAgdGhpcy5zcGxvdC50cmFuc2Zvcm0uc3RhcnRDYW1lcmEueCEgKyB0aGlzLnNwbG90LnRyYW5zZm9ybS5zdGFydFBvc1swXSAtIHBvc1swXTtcblxuICAgIHRoaXMuc3Bsb3QuY2FtZXJhLnkgPVxuICAgICAgdGhpcy5zcGxvdC50cmFuc2Zvcm0uc3RhcnRDYW1lcmEueSEgKyB0aGlzLnNwbG90LnRyYW5zZm9ybS5zdGFydFBvc1sxXSAtIHBvc1sxXTtcblxuICAgIHRoaXMuc3Bsb3QucmVuZGVyKCk7XG4gIH1cblxuICAvKipcbiAgICog0KDQtdCw0LPQuNGA0YPQtdGCINC90LAg0LTQstC40LbQtdC90LjQtSDQvNGL0YjQuC/RgtGA0LXQutC/0LDQtNCwINCyINC80L7QvNC10L3Rgiwg0LrQvtCz0LTQsCDQtdC1L9C10LPQviDQutC70LDQstC40YjQsCDRg9C00LXRgNC20LjQstCw0LXRgtGB0Y8g0L3QsNC20LDRgtC+0LkuXG4gICAqXG4gICAqIEByZW1lcmtzXG4gICAqINCc0LXRgtC+0LQg0L/QtdGA0LXQvNC10YnQsNC10YIg0L7QsdC70LDRgdGC0Ywg0LLQuNC00LjQvNC+0YHRgtC4INC90LAg0L/Qu9C+0YHQutC+0YHRgtC4INCy0LzQtdGB0YLQtSDRgSDQtNCy0LjQttC10L3QuNC10Lwg0LzRi9GI0Lgv0YLRgNC10LrQv9Cw0LTQsC4g0JLRi9GH0LjRgdC70LXQvdC40Y8g0LLQvdGD0YLRgNC4INGB0L7QsdGL0YLQuNGPINGB0LTQtdC70LDQvdGLXG4gICAqINC80LDQutGB0LjQvNCw0LvRjNC90L4g0L/RgNC+0LjQt9Cy0L7QtNC40YLQtdC70YzQvdGL0LzQuCDQsiDRg9GJ0LXRgNCxINGH0LjRgtCw0LHQtdC70YzQvdC+0YHRgtC4INC70L7Qs9C40LrQuCDQtNC10LnRgdGC0LLQuNC5LiDQktC+INCy0L3QtdGI0L3QtdC8INC+0LHRgNCw0LHQvtGC0YfQuNC60LUg0YHQvtCx0YvRgtC40Lkg0L7QsdGK0LXQutGCIHRoaXNcbiAgICog0L3QtdC00L7RgdGC0YPQv9C10L0g0L/QvtGN0YLQvtC80YMg0LTQvtGB0YLRg9C/INC6INGN0LrQt9C10LzQv9C70Y/RgNGDINC60LvQsNGB0YHQsCDRgNC10LDQu9C40LfRg9C10YLRgdGPINGH0LXRgNC10Lcg0YHRgtCw0YLQuNGH0LXRgdC60LjQuSDQvNCw0YHRgdC40LIg0LLRgdC10YUg0YHQvtC30LTQsNC90L3Ri9GFINGN0LrQt9C10LzQv9C70Y/RgNC+0LJcbiAgICog0LrQu9Cw0YHRgdCwINC4INC40LTQtdC90YLQuNGE0LjQutCw0YLQvtGA0LAg0LrQsNC90LLQsNGB0LAsINCy0YvRgdGC0YPQv9Cw0Y7RidC10LPQviDQuNC90LTQtdC60YHQvtC8INCyINGN0YLQvtC8INC80LDRgdGB0LjQstC1LlxuICAgKlxuICAgKiBAcGFyYW0gZXZlbnQgLSDQodC+0LHRi9GC0LjQtSDQvNGL0YjQuC/RgtGA0LXQutC/0LDQtNCwLlxuICAgKi9cbiAgcHJvdGVjdGVkIGhhbmRsZU1vdXNlTW92ZShldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuICAgIHRoaXMubW92ZUNhbWVyYS5jYWxsKHRoaXMsIGV2ZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiDQoNC10LDQs9C40YDRg9C10YIg0L3QsCDQvtGC0LbQsNGC0LjQtSDQutC70LDQstC40YjQuCDQvNGL0YjQuC/RgtGA0LXQutC/0LDQtNCwLlxuICAgKlxuICAgKiBAcmVtZXJrc1xuICAgKiDQkiDQvNC+0LzQtdC90YIg0L7RgtC20LDRgtC40Y8g0LrQu9Cw0LLQuNGI0Lgg0LDQvdCw0LvQuNC3INC00LLQuNC20LXQvdC40Y8g0LzRi9GI0Lgv0YLRgNC10LrQv9Cw0LTQsCDRgSDQt9Cw0LbQsNGC0L7QuSDQutC70LDQstC40YjQtdC5INC/0YDQtdC60YDQsNGJ0LDQtdGC0YHRjy4g0JLRi9GH0LjRgdC70LXQvdC40Y8g0LLQvdGD0YLRgNC4INGB0L7QsdGL0YLQuNGPXG4gICAqINGB0LTQtdC70LDQvdGLINC80LDQutGB0LjQvNCw0LvRjNC90L4g0L/RgNC+0LjQt9Cy0L7QtNC40YLQtdC70YzQvdGL0LzQuCDQsiDRg9GJ0LXRgNCxINGH0LjRgtCw0LHQtdC70YzQvdC+0YHRgtC4INC70L7Qs9C40LrQuCDQtNC10LnRgdGC0LLQuNC5LiDQktC+INCy0L3QtdGI0L3QtdC8INC+0LHRgNCw0LHQvtGC0YfQuNC60LUg0YHQvtCx0YvRgtC40Lkg0L7QsdGK0LXQutGCXG4gICAqIHRoaXMg0L3QtdC00L7RgdGC0YPQv9C10L0g0L/QvtGN0YLQvtC80YMg0LTQvtGB0YLRg9C/INC6INGN0LrQt9C10LzQv9C70Y/RgNGDINC60LvQsNGB0YHQsCDRgNC10LDQu9C40LfRg9C10YLRgdGPINGH0LXRgNC10Lcg0YHRgtCw0YLQuNGH0LXRgdC60LjQuSDQvNCw0YHRgdC40LIg0LLRgdC10YUg0YHQvtC30LTQsNC90L3Ri9GFINGN0LrQt9C10LzQv9C70Y/RgNC+0LJcbiAgICog0LrQu9Cw0YHRgdCwINC4INC40LTQtdC90YLQuNGE0LjQutCw0YLQvtGA0LAg0LrQsNC90LLQsNGB0LAsINCy0YvRgdGC0YPQv9Cw0Y7RidC10LPQviDQuNC90LTQtdC60YHQvtC8INCyINGN0YLQvtC8INC80LDRgdGB0LjQstC1LlxuICAgKlxuICAgKiBAcGFyYW0gZXZlbnQgLSDQodC+0LHRi9GC0LjQtSDQvNGL0YjQuC/RgtGA0LXQutC/0LDQtNCwLlxuICAgKi9cbiAgcHJvdGVjdGVkIGhhbmRsZU1vdXNlVXAoZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICB0aGlzLnNwbG90LnJlbmRlcigpO1xuICAgIGV2ZW50LnRhcmdldCEucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5oYW5kbGVNb3VzZU1vdmVXaXRoQ29udGV4dCk7XG4gICAgZXZlbnQudGFyZ2V0IS5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5oYW5kbGVNb3VzZVVwV2l0aENvbnRleHQpO1xuICB9XG5cbiAgLyoqXG4gICAqINCg0LXQsNCz0LjRgNGD0LXRgiDQvdCwINC90LDQttCw0YLQuNC1INC60LvQsNCy0LjRiNC4INC80YvRiNC4L9GC0YDQtdC60L/QsNC00LAuXG4gICAqXG4gICAqIEByZW1lcmtzXG4gICAqINCSINC80L7QvNC10L3RgiDQvdCw0LbQsNGC0LjRjyDQuCDRg9C00LXRgNC20LDQvdC40Y8g0LrQu9Cw0LLQuNGI0Lgg0LfQsNC/0YPRgdC60LDQtdGC0YHRjyDQsNC90LDQu9C40Lcg0LTQstC40LbQtdC90LjRjyDQvNGL0YjQuC/RgtGA0LXQutC/0LDQtNCwICjRgSDQt9Cw0LbQsNGC0L7QuSDQutC70LDQstC40YjQtdC5KS4g0JLRi9GH0LjRgdC70LXQvdC40Y9cbiAgICog0LLQvdGD0YLRgNC4INGB0L7QsdGL0YLQuNGPINGB0LTQtdC70LDQvdGLINC80LDQutGB0LjQvNCw0LvRjNC90L4g0L/RgNC+0LjQt9Cy0L7QtNC40YLQtdC70YzQvdGL0LzQuCDQsiDRg9GJ0LXRgNCxINGH0LjRgtCw0LHQtdC70YzQvdC+0YHRgtC4INC70L7Qs9C40LrQuCDQtNC10LnRgdGC0LLQuNC5LiDQktC+INCy0L3QtdGI0L3QtdC8INC+0LHRgNCw0LHQvtGC0YfQuNC60LVcbiAgICog0YHQvtCx0YvRgtC40Lkg0L7QsdGK0LXQutGCIHRoaXMg0L3QtdC00L7RgdGC0YPQv9C10L0g0L/QvtGN0YLQvtC80YMg0LTQvtGB0YLRg9C/INC6INGN0LrQt9C10LzQv9C70Y/RgNGDINC60LvQsNGB0YHQsCDRgNC10LDQu9C40LfRg9C10YLRgdGPINGH0LXRgNC10Lcg0YHRgtCw0YLQuNGH0LXRgdC60LjQuSDQvNCw0YHRgdC40LIg0LLRgdC10YVcbiAgICog0YHQvtC30LTQsNC90L3Ri9GFINGN0LrQt9C10LzQv9C70Y/RgNC+0LIg0LrQu9Cw0YHRgdCwINC4INC40LTQtdC90YLQuNGE0LjQutCw0YLQvtGA0LAg0LrQsNC90LLQsNGB0LAsINCy0YvRgdGC0YPQv9Cw0Y7RidC10LPQviDQuNC90LTQtdC60YHQvtC8INCyINGN0YLQvtC8INC80LDRgdGB0LjQstC1LlxuICAgKlxuICAgKiBAcGFyYW0gZXZlbnQgLSDQodC+0LHRi9GC0LjQtSDQvNGL0YjQuC/RgtGA0LXQutC/0LDQtNCwLlxuICAgKi9cbiAgcHJvdGVjdGVkIGhhbmRsZU1vdXNlRG93bihldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB0aGlzLnNwbG90LmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLmhhbmRsZU1vdXNlTW92ZVdpdGhDb250ZXh0KTtcbiAgICB0aGlzLnNwbG90LmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5oYW5kbGVNb3VzZVVwV2l0aENvbnRleHQpO1xuXG4gICAgdGhpcy5zcGxvdC50cmFuc2Zvcm0uc3RhcnRJbnZWaWV3UHJvak1hdCA9IG0zLmludmVyc2UodGhpcy5zcGxvdC50cmFuc2Zvcm0udmlld1Byb2plY3Rpb25NYXQpO1xuICAgIHRoaXMuc3Bsb3QudHJhbnNmb3JtLnN0YXJ0Q2FtZXJhID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zcGxvdC5jYW1lcmEpO1xuICAgIHRoaXMuc3Bsb3QudHJhbnNmb3JtLnN0YXJ0Q2xpcFBvcyA9IHRoaXMuZ2V0Q2xpcFNwYWNlTW91c2VQb3NpdGlvbi5jYWxsKHRoaXMsIGV2ZW50KTtcbiAgICB0aGlzLnNwbG90LnRyYW5zZm9ybS5zdGFydFBvcyA9IG0zLnRyYW5zZm9ybVBvaW50KHRoaXMuc3Bsb3QudHJhbnNmb3JtLnN0YXJ0SW52Vmlld1Byb2pNYXQsIHRoaXMuc3Bsb3QudHJhbnNmb3JtLnN0YXJ0Q2xpcFBvcyk7XG4gICAgdGhpcy5zcGxvdC50cmFuc2Zvcm0uc3RhcnRNb3VzZVBvcyA9IFtldmVudC5jbGllbnRYLCBldmVudC5jbGllbnRZXTtcblxuICAgIHRoaXMuc3Bsb3QucmVuZGVyKCk7XG4gIH1cblxuICAvKipcbiAgICog0KDQtdCw0LPQuNGA0YPQtdGCINC90LAg0LfRg9C80LjRgNC+0LLQsNC90LjQtSDQvNGL0YjQuC/RgtGA0LXQutC/0LDQtNCwLlxuICAgKlxuICAgKiBAcmVtZXJrc1xuICAgKiDQkiDQvNC+0LzQtdC90YIg0LfRg9C80LjRgNC+0LLQsNC90LjRjyDQvNGL0YjQuC/RgtGA0LXQutC/0LDQtNCwINC/0YDQvtC40YHRhdC+0LTQuNGCINC30YPQvNC40YDQvtCy0LDQvdC40LUg0LrQvtC+0YDQtNC40L3QsNGC0L3QvtC5INC/0LvQvtGB0LrQvtGB0YLQuC4g0JLRi9GH0LjRgdC70LXQvdC40Y8g0LLQvdGD0YLRgNC4INGB0L7QsdGL0YLQuNGPXG4gICAqINGB0LTQtdC70LDQvdGLINC80LDQutGB0LjQvNCw0LvRjNC90L4g0L/RgNC+0LjQt9Cy0L7QtNC40YLQtdC70YzQvdGL0LzQuCDQsiDRg9GJ0LXRgNCxINGH0LjRgtCw0LHQtdC70YzQvdC+0YHRgtC4INC70L7Qs9C40LrQuCDQtNC10LnRgdGC0LLQuNC5LiDQktC+INCy0L3QtdGI0L3QtdC8INC+0LHRgNCw0LHQvtGC0YfQuNC60LUg0YHQvtCx0YvRgtC40Lkg0L7QsdGK0LXQutGCXG4gICAqIHRoaXMg0L3QtdC00L7RgdGC0YPQv9C10L0g0L/QvtGN0YLQvtC80YMg0LTQvtGB0YLRg9C/INC6INGN0LrQt9C10LzQv9C70Y/RgNGDINC60LvQsNGB0YHQsCDRgNC10LDQu9C40LfRg9C10YLRgdGPINGH0LXRgNC10Lcg0YHRgtCw0YLQuNGH0LXRgdC60LjQuSDQvNCw0YHRgdC40LIg0LLRgdC10YUg0YHQvtC30LTQsNC90L3Ri9GFINGN0LrQt9C10LzQv9C70Y/RgNC+0LJcbiAgICog0LrQu9Cw0YHRgdCwINC4INC40LTQtdC90YLQuNGE0LjQutCw0YLQvtGA0LAg0LrQsNC90LLQsNGB0LAsINCy0YvRgdGC0YPQv9Cw0Y7RidC10LPQviDQuNC90LTQtdC60YHQvtC8INCyINGN0YLQvtC8INC80LDRgdGB0LjQstC1LlxuICAgKlxuICAgKiBAcGFyYW0gZXZlbnQgLSDQodC+0LHRi9GC0LjQtSDQvNGL0YjQuC/RgtGA0LXQutC/0LDQtNCwLlxuICAgKi9cbiAgcHJvdGVjdGVkIGhhbmRsZU1vdXNlV2hlZWwoZXZlbnQ6IFdoZWVsRXZlbnQpOiB2b2lkIHtcblxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc3QgW2NsaXBYLCBjbGlwWV0gPSB0aGlzLmdldENsaXBTcGFjZU1vdXNlUG9zaXRpb24uY2FsbCh0aGlzLCBldmVudCk7XG5cbiAgICAvLyBwb3NpdGlvbiBiZWZvcmUgem9vbWluZ1xuICAgIGNvbnN0IFtwcmVab29tWCwgcHJlWm9vbVldID0gbTMudHJhbnNmb3JtUG9pbnQobTMuaW52ZXJzZSh0aGlzLnNwbG90LnRyYW5zZm9ybS52aWV3UHJvamVjdGlvbk1hdCksIFtjbGlwWCwgY2xpcFldKTtcblxuICAgIC8vIG11bHRpcGx5IHRoZSB3aGVlbCBtb3ZlbWVudCBieSB0aGUgY3VycmVudCB6b29tIGxldmVsLCBzbyB3ZSB6b29tIGxlc3Mgd2hlbiB6b29tZWQgaW4gYW5kIG1vcmUgd2hlbiB6b29tZWQgb3V0XG4gICAgY29uc3QgbmV3Wm9vbSA9IHRoaXMuc3Bsb3QuY2FtZXJhLnpvb20hICogTWF0aC5wb3coMiwgZXZlbnQuZGVsdGFZICogLTAuMDEpO1xuICAgIHRoaXMuc3Bsb3QuY2FtZXJhLnpvb20gPSBNYXRoLm1heCgwLjAwMiwgTWF0aC5taW4oMjAwLCBuZXdab29tKSk7XG5cbiAgICB0aGlzLnVwZGF0ZVZpZXdQcm9qZWN0aW9uLmNhbGwodGhpcyk7XG5cbiAgICAvLyBwb3NpdGlvbiBhZnRlciB6b29taW5nXG4gICAgY29uc3QgW3Bvc3Rab29tWCwgcG9zdFpvb21ZXSA9IG0zLnRyYW5zZm9ybVBvaW50KG0zLmludmVyc2UodGhpcy5zcGxvdC50cmFuc2Zvcm0udmlld1Byb2plY3Rpb25NYXQpLCBbY2xpcFgsIGNsaXBZXSk7XG5cbiAgICAvLyBjYW1lcmEgbmVlZHMgdG8gYmUgbW92ZWQgdGhlIGRpZmZlcmVuY2Ugb2YgYmVmb3JlIGFuZCBhZnRlclxuICAgIHRoaXMuc3Bsb3QuY2FtZXJhLnghICs9IHByZVpvb21YIC0gcG9zdFpvb21YO1xuICAgIHRoaXMuc3Bsb3QuY2FtZXJhLnkhICs9IHByZVpvb21ZIC0gcG9zdFpvb21ZO1xuXG4gICAgdGhpcy5zcGxvdC5yZW5kZXIoKTtcbiAgfVxufVxuIiwiaW1wb3J0IFNQbG90IGZyb20gJy4vc3Bsb3QnXG5pbXBvcnQgeyBqc29uU3RyaW5naWZ5LCBnZXRDdXJyZW50VGltZSB9IGZyb20gJy4vdXRpbHMnXG5cbi8qKlxuICog0KLQuNC/INC00LvRjyDQv9Cw0YDQsNC80LXRgtGA0L7QsiDRgNC10LbQuNC80LAg0L7RgtC70LDQtNC60LguXG4gKlxuICogQHBhcmFtIGlzRW5hYmxlIC0g0J/RgNC40LfQvdCw0Log0LLQutC70Y7Rh9C10L3QuNGPINC+0YLQu9Cw0LTQvtGH0L3QvtCz0L4g0YDQtdC20LjQvNCwLlxuICogQHBhcmFtIG91dHB1dCAtINCc0LXRgdGC0L4g0LLRi9Cy0L7QtNCwINC+0YLQu9Cw0LTQvtGH0L3QvtC5INC40L3RhNC+0YDQvNCw0YbQuNC4LlxuICogQHBhcmFtIGhlYWRlclN0eWxlIC0g0KHRgtC40LvRjCDQtNC70Y8g0LfQsNCz0L7Qu9C+0LLQutCwINCy0YHQtdCz0L4g0L7RgtC70LDQtNC+0YfQvdC+0LPQviDQsdC70L7QutCwLlxuICogQHBhcmFtIGdyb3VwU3R5bGUgLSDQodGC0LjQu9GMINC00LvRjyDQt9Cw0LPQvtC70L7QstC60LAg0LPRgNGD0L/Qv9C40YDQvtCy0LrQuCDQvtGC0LvQsNC00L7Rh9C90YvRhSDQtNCw0L3QvdGL0YUuXG4gKlxuICogQHRvZG8g0KDQtdCw0LvQuNC30L7QstCw0YLRjCDQtNC+0L/QvtC70L3QuNGC0LXQu9GM0L3Ri9C1INC80LXRgdGC0LAg0LLRi9Cy0L7QtNCwIG91dHB1dDogJ2NvbnNvbGUnIHwgJ2RvY3VtZW50JyB8ICdmaWxlJ1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTUGxvdERlYnVnIHtcblxuICBwdWJsaWMgaXNFbmFibGU6IGJvb2xlYW4gPSBmYWxzZVxuICBwdWJsaWMgaGVhZGVyU3R5bGU6IHN0cmluZyA9ICdmb250LXdlaWdodDogYm9sZDsgY29sb3I6ICNmZmZmZmY7IGJhY2tncm91bmQtY29sb3I6ICNjYzAwMDA7J1xuICBwdWJsaWMgZ3JvdXBTdHlsZTogc3RyaW5nID0gJ2ZvbnQtd2VpZ2h0OiBib2xkOyBjb2xvcjogI2ZmZmZmZjsnXG5cbiAgcHJpdmF0ZSBzcGxvdDogU1Bsb3RcblxuICBjb25zdHJ1Y3RvciAoc3Bsb3Q6IFNQbG90KSB7XG4gICAgdGhpcy5zcGxvdCA9IHNwbG90XG4gIH1cblxuICBwdWJsaWMgbG9nSW50cm8oY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCk6IHZvaWQge1xuICAgIGNvbnNvbGUubG9nKCclY9Ce0YLQu9Cw0LTQutCwIFNQbG90INC90LAg0L7QsdGK0LXQutGC0LUgIycgKyBjYW52YXMuaWQsIHRoaXMuaGVhZGVyU3R5bGUpXG5cbiAgICBpZiAodGhpcy5zcGxvdC5kZW1vLmlzRW5hYmxlKSB7XG4gICAgICBjb25zb2xlLmxvZygnJWPQktC60LvRjtGH0LXQvSDQtNC10LzQvtC90YHRgtGA0LDRhtC40L7QvdC90YvQuSDRgNC10LbQuNC8INC00LDQvdC90YvRhScsIHRoaXMuZ3JvdXBTdHlsZSlcbiAgICB9XG5cbiAgICBjb25zb2xlLmdyb3VwKCclY9Cf0YDQtdC00YPQv9GA0LXQttC00LXQvdC40LUnLCB0aGlzLnNwbG90LmRlYnVnLmdyb3VwU3R5bGUpXG4gICAgY29uc29sZS5sb2coJ9Ce0YLQutGA0YvRgtCw0Y8g0LrQvtC90YHQvtC70Ywg0LHRgNCw0YPQt9C10YDQsCDQuCDQtNGA0YPQs9C40LUg0LDQutGC0LjQstC90YvQtSDRgdGA0LXQtNGB0YLQstCwINC60L7QvdGC0YDQvtC70Y8g0YDQsNC30YDQsNCx0L7RgtC60Lgg0YHRg9GJ0LXRgdGC0LLQtdC90L3QviDRgdC90LjQttCw0Y7RgiDQv9GA0L7QuNC30LLQvtC00LjRgtC10LvRjNC90L7RgdGC0Ywg0LLRi9GB0L7QutC+0L3QsNCz0YDRg9C20LXQvdC90YvRhSDQv9GA0LjQu9C+0LbQtdC90LjQuS4g0JTQu9GPINC+0LHRitC10LrRgtC40LLQvdC+0LPQviDQsNC90LDQu9C40LfQsCDQv9GA0L7QuNC30LLQvtC00LjRgtC10LvRjNC90L7RgdGC0Lgg0LLRgdC1INC/0L7QtNC+0LHQvdGL0LUg0YHRgNC10LTRgdGC0LLQsCDQtNC+0LvQttC90Ysg0LHRi9GC0Ywg0L7RgtC60LvRjtGH0LXQvdGLLCDQsCDQutC+0L3RgdC+0LvRjCDQsdGA0LDRg9C30LXRgNCwINC30LDQutGA0YvRgtCwLiDQndC10LrQvtGC0L7RgNGL0LUg0LTQsNC90L3Ri9C1INC+0YLQu9Cw0LTQvtGH0L3QvtC5INC40L3RhNC+0YDQvNCw0YbQuNC4INCyINC30LDQstC40YHQuNC80L7RgdGC0Lgg0L7RgiDQuNGB0L/QvtC70YzQt9GD0LXQvNC+0LPQviDQsdGA0LDRg9C30LXRgNCwINC80L7Qs9GD0YIg0L3QtSDQvtGC0L7QsdGA0LDQttCw0YLRjNGB0Y8g0LjQu9C4INC+0YLQvtCx0YDQsNC20LDRgtGM0YHRjyDQvdC10LrQvtGA0YDQtdC60YLQvdC+LiDQodGA0LXQtNGB0YLQstC+INC+0YLQu9Cw0LTQutC4INC/0YDQvtGC0LXRgdGC0LjRgNC+0LLQsNC90L4g0LIg0LHRgNCw0YPQt9C10YDQtSBHb29nbGUgQ2hyb21lIHYuOTAnKVxuICAgIGNvbnNvbGUuZ3JvdXBFbmQoKVxuICB9XG5cbiAgcHVibGljIGxvZ0dwdUluZm8oZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCk6IHZvaWQge1xuICAgIGNvbnNvbGUuZ3JvdXAoJyVj0JLQuNC00LXQvtGB0LjRgdGC0LXQvNCwJywgdGhpcy5ncm91cFN0eWxlKVxuICAgIGxldCBleHQgPSBnbC5nZXRFeHRlbnNpb24oJ1dFQkdMX2RlYnVnX3JlbmRlcmVyX2luZm8nKVxuICAgIGxldCBncmFwaGljc0NhcmROYW1lID0gKGV4dCkgPyBnbC5nZXRQYXJhbWV0ZXIoZXh0LlVOTUFTS0VEX1JFTkRFUkVSX1dFQkdMKSA6ICdb0L3QtdC40LfQstC10YHRgtC90L5dJ1xuICAgIGNvbnNvbGUubG9nKCfQk9GA0LDRhNC40YfQtdGB0LrQsNGPINC60LDRgNGC0LA6ICcgKyBncmFwaGljc0NhcmROYW1lKVxuICAgIGNvbnNvbGUubG9nKCfQktC10YDRgdC40Y8gR0w6ICcgKyBnbC5nZXRQYXJhbWV0ZXIoZ2wuVkVSU0lPTikpXG4gICAgY29uc29sZS5ncm91cEVuZCgpXG4gIH1cblxuICBwdWJsaWMgbG9nSW5zdGFuY2VJbmZvKGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQsIG9wdGlvbnM6IFNQbG90T3B0aW9ucyk6IHZvaWQge1xuICAgIGNvbnNvbGUuZ3JvdXAoJyVj0J3QsNGB0YLRgNC+0LnQutCwINC/0LDRgNCw0LzQtdGC0YDQvtCyINGN0LrQt9C10LzQv9C70Y/RgNCwJywgdGhpcy5ncm91cFN0eWxlKVxuICAgIHtcbiAgICAgIGNvbnNvbGUuZGlyKHRoaXMpXG4gICAgICBjb25zb2xlLmxvZygn0J/QvtC70YzQt9C+0LLQsNGC0LXQu9GM0YHQutC40LUg0L3QsNGB0YLRgNC+0LnQutC4OlxcbicsIGpzb25TdHJpbmdpZnkob3B0aW9ucykpXG4gICAgICBjb25zb2xlLmxvZygn0JrQsNC90LLQsNGBOiAjJyArIGNhbnZhcy5pZClcbiAgICAgIGNvbnNvbGUubG9nKCfQoNCw0LfQvNC10YAg0LrQsNC90LLQsNGB0LA6ICcgKyBjYW52YXMud2lkdGggKyAnIHggJyArIGNhbnZhcy5oZWlnaHQgKyAnIHB4JylcbiAgICAgIGNvbnNvbGUubG9nKCfQoNCw0LfQvNC10YAg0L/Qu9C+0YHQutC+0YHRgtC4OiAnICsgdGhpcy5zcGxvdC5ncmlkLndpZHRoICsgJyB4ICcgKyB0aGlzLnNwbG90LmdyaWQuaGVpZ2h0ICsgJyBweCcpXG5cbiAgICAgIGlmICh0aGlzLnNwbG90LmRlbW8uaXNFbmFibGUpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ9Ch0L/QvtGB0L7QsSDQv9C+0LvRg9GH0LXQvdC40Y8g0LTQsNC90L3Ri9GFOiAnICsgJ9C00LXQvNC+LdC00LDQvdC90YvQtScpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmxvZygn0KHQv9C+0YHQvtCxINC/0L7Qu9GD0YfQtdC90LjRjyDQtNCw0L3QvdGL0YU6ICcgKyAn0LjRgtC10YDQuNGA0L7QstCw0L3QuNC1JylcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc29sZS5ncm91cEVuZCgpXG4gIH1cblxuICBwdWJsaWMgbG9nU2hhZGVySW5mbyhzaGFkZXJUeXBlOiBzdHJpbmcsIHNoYWRlckNvZGU6IHN0cmluZywgKTogdm9pZCB7XG4gICAgY29uc29sZS5ncm91cCgnJWPQodC+0LfQtNCw0L0g0YjQtdC50LTQtdGAIFsnICsgc2hhZGVyVHlwZSArICddJywgdGhpcy5ncm91cFN0eWxlKVxuICAgIGNvbnNvbGUubG9nKHNoYWRlckNvZGUpXG4gICAgY29uc29sZS5ncm91cEVuZCgpXG4gIH1cblxuICBwdWJsaWMgbG9nRGF0YUxvYWRpbmdTdGFydCgpOiB2b2lkIHtcbiAgICBjb25zb2xlLmxvZygnJWPQl9Cw0L/Rg9GJ0LXQvSDQv9GA0L7RhtC10YHRgSDQt9Cw0LPRgNGD0LfQutC4INC00LDQvdC90YvRhSBbJyArIGdldEN1cnJlbnRUaW1lKCkgKyAnXS4uLicsIHRoaXMuZ3JvdXBTdHlsZSlcbiAgICBjb25zb2xlLnRpbWUoJ9CU0LvQuNGC0LXQu9GM0L3QvtGB0YLRjCcpXG4gIH1cblxuICBwdWJsaWMgbG9nRGF0YUxvYWRpbmdDb21wbGV0ZShhbW91bnQ6IG51bWJlciwgbWF4QW1vdW50OiBudW1iZXIpOiB2b2lkIHtcbiAgICBjb25zb2xlLmdyb3VwKCclY9CX0LDQs9GA0YPQt9C60LAg0LTQsNC90L3Ri9GFINC30LDQstC10YDRiNC10L3QsCBbJyArIGdldEN1cnJlbnRUaW1lKCkgKyAnXScsIHRoaXMuZ3JvdXBTdHlsZSlcbiAgICBjb25zb2xlLnRpbWVFbmQoJ9CU0LvQuNGC0LXQu9GM0L3QvtGB0YLRjCcpXG4gICAgY29uc29sZS5sb2coJ9Cg0LXQt9GD0LvRjNGC0LDRgjogJyArXG4gICAgICAoKGFtb3VudCA+PSBtYXhBbW91bnQpID9cbiAgICAgICfQtNC+0YHRgtC40LPQvdGD0YIg0LfQsNC00LDQvdC90YvQuSDQu9C40LzQuNGCICgnICsgbWF4QW1vdW50LnRvTG9jYWxlU3RyaW5nKCkgKyAnKScgOlxuICAgICAgJ9C+0LHRgNCw0LHQvtGC0LDQvdGLINCy0YHQtSDQvtCx0YrQtdC60YLRiycpKVxuICAgIGNvbnNvbGUuZ3JvdXBFbmQoKVxuICB9XG5cbiAgcHVibGljIGxvZ09iamVjdFN0YXRzKGJ1ZmZlcnM6IFNQbG90QnVmZmVycywgYW1vdW50T2ZQb2x5Z29uczogbnVtYmVyKTogdm9pZCB7XG4gICAgY29uc29sZS5ncm91cCgnJWPQmtC+0Lst0LLQviDQvtCx0YrQtdC60YLQvtCyOiAnICsgYW1vdW50T2ZQb2x5Z29ucy50b0xvY2FsZVN0cmluZygpLCB0aGlzLmdyb3VwU3R5bGUpXG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc3Bsb3Quc2hhcGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBzaGFwZUNhcGN0aW9uID0gdGhpcy5zcGxvdC5zaGFwZXNbaV0ubmFtZVxuICAgICAgY29uc3Qgc2hhcGVBbW91bnQgPSBidWZmZXJzLmFtb3VudE9mU2hhcGVzW2ldXG4gICAgICBjb25zb2xlLmxvZyhzaGFwZUNhcGN0aW9uICsgJzogJyArIHNoYXBlQW1vdW50LnRvTG9jYWxlU3RyaW5nKCkgK1xuICAgICAgICAnIFt+JyArIE1hdGgucm91bmQoMTAwICogc2hhcGVBbW91bnQgLyBhbW91bnRPZlBvbHlnb25zKSArICclXScpXG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coJ9Ca0L7Quy3QstC+INGG0LLQtdGC0L7QsiDQsiDQv9Cw0LvQuNGC0YDQtTogJyArIHRoaXMuc3Bsb3QucG9seWdvblBhbGV0dGUubGVuZ3RoKVxuICAgIGNvbnNvbGUuZ3JvdXBFbmQoKVxuICB9XG5cbiAgcHVibGljIGxvZ0dwdU1lbVN0YXRzKGJ1ZmZlcnM6IFNQbG90QnVmZmVycyk6IHZvaWQge1xuICAgIGxldCBieXRlc1VzZWRCeUJ1ZmZlcnMgPSBidWZmZXJzLnNpemVJbkJ5dGVzWzBdICsgYnVmZmVycy5zaXplSW5CeXRlc1sxXSArIGJ1ZmZlcnMuc2l6ZUluQnl0ZXNbM11cblxuICAgIGNvbnNvbGUuZ3JvdXAoJyVj0KDQsNGB0YXQvtC0INCy0LjQtNC10L7Qv9Cw0LzRj9GC0Lg6ICcgKyAoYnl0ZXNVc2VkQnlCdWZmZXJzIC8gMTAwMDAwMCkudG9GaXhlZCgyKS50b0xvY2FsZVN0cmluZygpICsgJyDQnNCRJywgdGhpcy5ncm91cFN0eWxlKVxuXG4gICAgY29uc29sZS5sb2coJ9CR0YPRhNC10YDRiyDQstC10YDRiNC40L06ICcgK1xuICAgICAgKGJ1ZmZlcnMuc2l6ZUluQnl0ZXNbMF0gLyAxMDAwMDAwKS50b0ZpeGVkKDIpLnRvTG9jYWxlU3RyaW5nKCkgKyAnINCc0JEnICtcbiAgICAgICcgW34nICsgTWF0aC5yb3VuZCgxMDAgKiBidWZmZXJzLnNpemVJbkJ5dGVzWzBdIC8gYnl0ZXNVc2VkQnlCdWZmZXJzKSArICclXScpXG5cbiAgICBjb25zb2xlLmxvZygn0JHRg9GE0LXRgNGLINGG0LLQtdGC0L7QsjogJ1xuICAgICAgKyAoYnVmZmVycy5zaXplSW5CeXRlc1sxXSAvIDEwMDAwMDApLnRvRml4ZWQoMikudG9Mb2NhbGVTdHJpbmcoKSArICcg0JzQkScgK1xuICAgICAgJyBbficgKyBNYXRoLnJvdW5kKDEwMCAqIGJ1ZmZlcnMuc2l6ZUluQnl0ZXNbMV0gLyBieXRlc1VzZWRCeUJ1ZmZlcnMpICsgJyVdJylcblxuICAgIGNvbnNvbGUubG9nKCfQkdGD0YTQtdGA0Ysg0YDQsNC30LzQtdGA0L7QsjogJ1xuICAgICAgKyAoYnVmZmVycy5zaXplSW5CeXRlc1szXSAvIDEwMDAwMDApLnRvRml4ZWQoMikudG9Mb2NhbGVTdHJpbmcoKSArICcg0JzQkScgK1xuICAgICAgJyBbficgKyBNYXRoLnJvdW5kKDEwMCAqIGJ1ZmZlcnMuc2l6ZUluQnl0ZXNbMl0gLyBieXRlc1VzZWRCeUJ1ZmZlcnMpICsgJyVdJylcblxuICAgIGNvbnNvbGUubG9nKCfQmtC+0Lst0LLQviDQs9GA0YPQv9C/INCx0YPRhNC10YDQvtCyOiAnICsgYnVmZmVycy5hbW91bnRPZkJ1ZmZlckdyb3Vwcy50b0xvY2FsZVN0cmluZygpKVxuICAgIGNvbnNvbGUubG9nKCfQmtC+0Lst0LLQviBHTC3RgtGA0LXRg9Cz0L7Qu9GM0L3QuNC60L7QsjogJyArIChidWZmZXJzLmFtb3VudE9mVG90YWxHTFZlcnRpY2VzIC8gMykudG9Mb2NhbGVTdHJpbmcoKSlcbiAgICBjb25zb2xlLmxvZygn0JrQvtC7LdCy0L4g0LLQtdGA0YjQuNC9OiAnICsgYnVmZmVycy5hbW91bnRPZlRvdGFsVmVydGljZXMudG9Mb2NhbGVTdHJpbmcoKSlcblxuICAgIGNvbnNvbGUuZ3JvdXBFbmQoKVxuICB9XG5cbiAgcHVibGljIGxvZ1JlbmRlclN0YXJ0ZWQoKSB7XG4gICAgY29uc29sZS5sb2coJyVj0KDQtdC90LTQtdGA0LjQvdCzINC30LDQv9GD0YnQtdC9JywgdGhpcy5zcGxvdC5kZWJ1Zy5ncm91cFN0eWxlKVxuICB9XG5cbiAgcHVibGljIGxvZ1JlbmRlclN0b3BlZCgpIHtcbiAgICBjb25zb2xlLmxvZygnJWPQoNC10L3QtNC10YDQuNC90LMg0L7RgdGC0LDQvdC+0LLQu9C10L0nLCB0aGlzLnNwbG90LmRlYnVnLmdyb3VwU3R5bGUpXG4gIH1cblxuICBwdWJsaWMgbG9nQ2FudmFzQ2xlYXJlZCgpIHtcbiAgICBjb25zb2xlLmxvZygnJWPQmtC+0L3RgtC10LrRgdGCINGA0LXQvdC00LXRgNC40L3Qs9CwINC+0YfQuNGJ0LXQvSBbJyArIHRoaXMuc3Bsb3QuZ3JpZC5iZ0NvbG9yICsgJ10nLCB0aGlzLnNwbG90LmRlYnVnLmdyb3VwU3R5bGUpO1xuICB9XG59XG4iLCJpbXBvcnQgeyByYW5kb21JbnQsIHJhbmRvbVF1b3RhSW5kZXggfSBmcm9tICcuL3V0aWxzJ1xuaW1wb3J0IFNQbG90IGZyb20gJy4vc3Bsb3QnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNQbG90RGVtbyB7XG5cbiAgcHVibGljIGlzRW5hYmxlOiBib29sZWFuID0gZmFsc2VcbiAgcHVibGljIGFtb3VudDogbnVtYmVyID0gMV8wMDBfMDAwXG4gIHB1YmxpYyBzaGFwZVF1b3RhOiBudW1iZXJbXSA9IFtdXG5cbiAgcHJpdmF0ZSBpbmRleDogbnVtYmVyID0gMFxuICBwcml2YXRlIHNwbG90OiBTUGxvdFxuXG4gIGNvbnN0cnVjdG9yKHNwbG90OiBTUGxvdCkge1xuICAgIHRoaXMuc3Bsb3QgPSBzcGxvdFxuICAgIHRoaXMuaW5pdCgpXG4gIH1cblxuICBwdWJsaWMgaW5pdCgpIHtcbiAgICB0aGlzLmluZGV4ID0gMFxuICB9XG5cbiAgLyoqXG4gICAqINCY0LzQuNGC0LjRgNGD0LXRgiDQuNGC0LXRgNC40YDQvtCy0LDQvdC40LUg0LjRgdGF0L7QtNC90YvRhSDQvtCx0YrQtdC60YLQvtCyLlxuICAgKlxuICAgKiBAcmV0dXJucyDQmNC90YTQvtGA0LzQsNGG0LjRjyDQviDQv9C+0LvQuNCz0L7QvdC1INC40LvQuCBudWxsLCDQtdGB0LvQuCDQuNGC0LXRgNC40YDQvtCy0LDQvdC40LUg0LfQsNCy0LXRgNGI0LjQu9C+0YHRjC5cbiAgICovXG4gIHB1YmxpYyBkZW1vSXRlcmF0aW9uQ2FsbGJhY2soKTogU1Bsb3RQb2x5Z29uIHwgbnVsbCB7XG4gICAgaWYgKHRoaXMuaW5kZXghIDwgdGhpcy5hbW91bnQhKSB7XG4gICAgICB0aGlzLmluZGV4ISArKztcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHg6IHJhbmRvbUludCh0aGlzLnNwbG90LmdyaWQud2lkdGghKSxcbiAgICAgICAgeTogcmFuZG9tSW50KHRoaXMuc3Bsb3QuZ3JpZC5oZWlnaHQhKSxcbiAgICAgICAgc2hhcGU6IHJhbmRvbVF1b3RhSW5kZXgodGhpcy5zaGFwZVF1b3RhISksXG4gICAgICAgIHNpemU6IDEwICsgcmFuZG9tSW50KDIxKSxcbiAgICAgICAgY29sb3I6IHJhbmRvbUludCh0aGlzLnNwbG90LnBvbHlnb25QYWxldHRlLmxlbmd0aClcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aGlzLmluZGV4ID0gMFxuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCBTUGxvdCBmcm9tICcuL3NwbG90J1xuaW1wb3J0IHsgY29sb3JGcm9tSGV4VG9HbFJnYiB9IGZyb20gJy4vdXRpbHMnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNQbG90V2ViR2wge1xuXG4gIHB1YmxpYyB3ZWJHbFNldHRpbmdzOiBXZWJHTENvbnRleHRBdHRyaWJ1dGVzID0ge1xuICAgIGFscGhhOiBmYWxzZSxcbiAgICBkZXB0aDogZmFsc2UsXG4gICAgc3RlbmNpbDogZmFsc2UsXG4gICAgYW50aWFsaWFzOiBmYWxzZSxcbiAgICBwcmVtdWx0aXBsaWVkQWxwaGE6IGZhbHNlLFxuICAgIHByZXNlcnZlRHJhd2luZ0J1ZmZlcjogZmFsc2UsXG4gICAgcG93ZXJQcmVmZXJlbmNlOiAnaGlnaC1wZXJmb3JtYW5jZScsXG4gICAgZmFpbElmTWFqb3JQZXJmb3JtYW5jZUNhdmVhdDogZmFsc2UsXG4gICAgZGVzeW5jaHJvbml6ZWQ6IGZhbHNlXG4gIH1cblxuICBwcml2YXRlIHNwbG90OiBTUGxvdFxuXG4gIGNvbnN0cnVjdG9yKHNwbG90OiBTUGxvdCkge1xuICAgIHRoaXMuc3Bsb3QgPSBzcGxvdFxuICB9XG5cbiAgLyoqXG4gICAqINCh0L7Qt9C00LDQtdGCINC60L7QvdGC0LXQutGB0YIg0YDQtdC90LTQtdGA0LjQvdCz0LAgV2ViR0wg0Lgg0YPRgdGC0LDQvdCw0LLQu9C40LLQsNC10YIg0LrQvtGA0YDQtdC60YLQvdGL0Lkg0YDQsNC30LzQtdGAINC+0LHQu9Cw0YHRgtC4INC/0YDQvtGB0LzQvtGC0YDQsC5cbiAgICovXG4gIHB1YmxpYyBjcmVhdGUoKTogdm9pZCB7XG5cbiAgICB0aGlzLnNwbG90LmdsID0gdGhpcy5zcGxvdC5jYW52YXMuZ2V0Q29udGV4dCgnd2ViZ2wnLCB0aGlzLndlYkdsU2V0dGluZ3MpIVxuXG4gICAgdGhpcy5zcGxvdC5jYW52YXMud2lkdGggPSB0aGlzLnNwbG90LmNhbnZhcy5jbGllbnRXaWR0aFxuICAgIHRoaXMuc3Bsb3QuY2FudmFzLmhlaWdodCA9IHRoaXMuc3Bsb3QuY2FudmFzLmNsaWVudEhlaWdodFxuXG4gICAgdGhpcy5zcGxvdC5nbC52aWV3cG9ydCgwLCAwLCB0aGlzLnNwbG90LmNhbnZhcy53aWR0aCwgdGhpcy5zcGxvdC5jYW52YXMuaGVpZ2h0KVxuICB9XG5cbiAgcHVibGljIHNldEJnQ29sb3IoY29sb3I6IHN0cmluZykge1xuICAgIGxldCBbciwgZywgYl0gPSBjb2xvckZyb21IZXhUb0dsUmdiKGNvbG9yKVxuICAgIHRoaXMuc3Bsb3QuZ2wuY2xlYXJDb2xvcihyLCBnLCBiLCAwLjApXG4gIH1cblxuICBwdWJsaWMgY2xlYXJCYWNrZ3JvdW5kKCkge1xuICAgIHRoaXMuc3Bsb3QuZ2wuY2xlYXIodGhpcy5zcGxvdC5nbC5DT0xPUl9CVUZGRVJfQklUKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDQodC+0LfQtNCw0LXRgiDRiNC10LnQtNC10YAgV2ViR0wuXG4gICAqXG4gICAqIEBwYXJhbSBzaGFkZXJUeXBlINCi0LjQvyDRiNC10LnQtNC10YDQsC5cbiAgICogQHBhcmFtIHNoYWRlckNvZGUg0JrQvtC0INGI0LXQudC00LXRgNCwINC90LAg0Y/Qt9GL0LrQtSBHTFNMLlxuICAgKiBAcmV0dXJucyDQodC+0LfQtNCw0L3QvdGL0Lkg0L7QsdGK0LXQutGCINGI0LXQudC00LXRgNCwLlxuICAgKi9cbiAgcHVibGljIGNyZWF0ZVNoYWRlcihzaGFkZXJUeXBlOiBXZWJHbFNoYWRlclR5cGUsIHNoYWRlckNvZGU6IHN0cmluZyk6IFdlYkdMU2hhZGVyIHtcblxuICAgIC8vINCh0L7Qt9C00LDQvdC40LUsINC/0YDQuNCy0Y/Qt9C60LAg0LrQvtC00LAg0Lgg0LrQvtC80L/QuNC70Y/RhtC40Y8g0YjQtdC50LTQtdGA0LAuXG4gICAgY29uc3Qgc2hhZGVyID0gdGhpcy5zcGxvdC5nbC5jcmVhdGVTaGFkZXIodGhpcy5zcGxvdC5nbFtzaGFkZXJUeXBlXSkhXG4gICAgdGhpcy5zcGxvdC5nbC5zaGFkZXJTb3VyY2Uoc2hhZGVyLCBzaGFkZXJDb2RlKVxuICAgIHRoaXMuc3Bsb3QuZ2wuY29tcGlsZVNoYWRlcihzaGFkZXIpXG5cbiAgICBpZiAoIXRoaXMuc3Bsb3QuZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKHNoYWRlciwgdGhpcy5zcGxvdC5nbC5DT01QSUxFX1NUQVRVUykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcign0J7RiNC40LHQutCwINC60L7QvNC/0LjQu9GP0YbQuNC4INGI0LXQudC00LXRgNCwIFsnICsgc2hhZGVyVHlwZSArICddLiAnICsgdGhpcy5zcGxvdC5nbC5nZXRTaGFkZXJJbmZvTG9nKHNoYWRlcikpXG4gICAgfVxuXG4gICAgcmV0dXJuIHNoYWRlclxuICB9XG5cbiAgLyoqXG4gICAqINCh0L7Qt9C00LDQtdGCINC/0YDQvtCz0YDQsNC80LzRgyBXZWJHTC5cbiAgICpcbiAgICogQHBhcmFtIHtXZWJHTFNoYWRlcn0gdmVydGV4U2hhZGVyINCS0LXRgNGI0LjQvdC90YvQuSDRiNC10LnQtNC10YAuXG4gICAqIEBwYXJhbSB7V2ViR0xTaGFkZXJ9IGZyYWdtZW50U2hhZGVyINCk0YDQsNCz0LzQtdC90YLQvdGL0Lkg0YjQtdC50LTQtdGALlxuICAgKi9cbiAgcHVibGljIGNyZWF0ZVByb2dyYW0oc2hhZGVyVmVydDogV2ViR0xTaGFkZXIsIHNoYWRlckZyYWc6IFdlYkdMU2hhZGVyKSB7XG4gICAgdGhpcy5zcGxvdC5ncHVQcm9ncmFtID0gdGhpcy5zcGxvdC5nbC5jcmVhdGVQcm9ncmFtKCkhXG4gICAgdGhpcy5zcGxvdC5nbC5hdHRhY2hTaGFkZXIodGhpcy5zcGxvdC5ncHVQcm9ncmFtLCBzaGFkZXJWZXJ0KVxuICAgIHRoaXMuc3Bsb3QuZ2wuYXR0YWNoU2hhZGVyKHRoaXMuc3Bsb3QuZ3B1UHJvZ3JhbSwgc2hhZGVyRnJhZylcbiAgICB0aGlzLnNwbG90LmdsLmxpbmtQcm9ncmFtKHRoaXMuc3Bsb3QuZ3B1UHJvZ3JhbSlcbiAgICB0aGlzLnNwbG90LmdsLnVzZVByb2dyYW0odGhpcy5zcGxvdC5ncHVQcm9ncmFtKVxuICB9XG5cbiAgLyoqXG4gICAqINCj0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdGCINGB0LLRj9C30Ywg0L/QtdGA0LXQvNC10L3QvdC+0Lkg0L/RgNC40LvQvtC20LXQvdC40Y8g0YEg0L/RgNC+0LPRgNCw0LzQvNC+0LkgV2ViR2wuXG4gICAqXG4gICAqIEBwYXJhbSB2YXJUeXBlINCi0LjQvyDQv9C10YDQtdC80LXQvdC90L7QuS5cbiAgICogQHBhcmFtIHZhck5hbWUg0JjQvNGPINC/0LXRgNC10LzQtdC90L3QvtC5LlxuICAgKi9cbiAgcHVibGljIGNyZWF0ZVZhcmlhYmxlKHZhclR5cGU6IFdlYkdsVmFyaWFibGVUeXBlLCB2YXJOYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAodmFyVHlwZSA9PT0gJ3VuaWZvcm0nKSB7XG4gICAgICB0aGlzLnNwbG90LnZhcmlhYmxlc1t2YXJOYW1lXSA9IHRoaXMuc3Bsb3QuZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHRoaXMuc3Bsb3QuZ3B1UHJvZ3JhbSwgdmFyTmFtZSlcbiAgICB9IGVsc2UgaWYgKHZhclR5cGUgPT09ICdhdHRyaWJ1dGUnKSB7XG4gICAgICB0aGlzLnNwbG90LnZhcmlhYmxlc1t2YXJOYW1lXSA9IHRoaXMuc3Bsb3QuZ2wuZ2V0QXR0cmliTG9jYXRpb24odGhpcy5zcGxvdC5ncHVQcm9ncmFtLCB2YXJOYW1lKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDQodC+0LfQtNCw0LXRgiDQsiDQvNCw0YHRgdC40LLQtSDQsdGD0YTQtdGA0L7QsiBXZWJHTCDQvdC+0LLRi9C5INCx0YPRhNC10YAg0Lgg0LfQsNC/0LjRgdGL0LLQsNC10YIg0LIg0L3QtdCz0L4g0L/QtdGA0LXQtNCw0L3QvdGL0LUg0LTQsNC90L3Ri9C1LlxuICAgKlxuICAgKiBAcGFyYW0gYnVmZmVycyAtINCc0LDRgdGB0LjQsiDQsdGD0YTQtdGA0L7QsiBXZWJHTCwg0LIg0LrQvtGC0L7RgNGL0Lkg0LHRg9C00LXRgiDQtNC+0LHQsNCy0LvQtdC9INGB0L7Qt9C00LDQstCw0LXQvNGL0Lkg0LHRg9GE0LXRgC5cbiAgICogQHBhcmFtIHR5cGUgLSDQotC40L8g0YHQvtC30LTQsNCy0LDQtdC80L7Qs9C+INCx0YPRhNC10YDQsC5cbiAgICogQHBhcmFtIGRhdGEgLSDQlNCw0L3QvdGL0LUg0LIg0LLQuNC00LUg0YLQuNC/0LjQt9C40YDQvtCy0LDQvdC90L7Qs9C+INC80LDRgdGB0LjQstCwINC00LvRjyDQt9Cw0L/QuNGB0Lgg0LIg0YHQvtC30LTQsNCy0LDQtdC80YvQuSDQsdGD0YTQtdGALlxuICAgKiBAcGFyYW0ga2V5IC0g0JrQu9GO0YcgKNC40L3QtNC10LrRgSksINC40LTQtdC90YLQuNGE0LjRhtC40YDRg9GO0YnQuNC5INGC0LjQvyDQsdGD0YTQtdGA0LAgKNC00LvRjyDQstC10YDRiNC40L0sINC00LvRjyDRhtCy0LXRgtC+0LIsINC00LvRjyDQuNC90LTQtdC60YHQvtCyKS4g0JjRgdC/0L7Qu9GM0LfRg9C10YLRgdGPINC00LvRj1xuICAgKiAgICAg0YDQsNC30LTQtdC70YzQvdC+0LPQviDQv9C+0LTRgdGH0LXRgtCwINC/0LDQvNGP0YLQuCwg0LfQsNC90LjQvNCw0LXQvNC+0Lkg0LrQsNC20LTRi9C8INGC0LjQv9C+0Lwg0LHRg9GE0LXRgNCwLlxuICAgKi9cbiAgcHVibGljIGNyZWF0ZUJ1ZmZlcihidWZmZXJzOiBXZWJHTEJ1ZmZlcltdLCB0eXBlOiBXZWJHbEJ1ZmZlclR5cGUsIGRhdGE6IFR5cGVkQXJyYXksIGtleTogbnVtYmVyKTogdm9pZCB7XG5cbiAgICAvLyDQntC/0YDQtdC00LXQu9C10L3QuNC1INC40L3QtNC10LrRgdCwINC90L7QstC+0LPQviDRjdC70LXQvNC10L3RgtCwINCyINC80LDRgdGB0LjQstC1INCx0YPRhNC10YDQvtCyIFdlYkdMLlxuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5zcGxvdC5idWZmZXJzLmFtb3VudE9mQnVmZmVyR3JvdXBzXG5cbiAgICAvLyDQodC+0LfQtNCw0L3QuNC1INC4INC30LDQv9C+0LvQvdC10L3QuNC1INC00LDQvdC90YvQvNC4INC90L7QstC+0LPQviDQsdGD0YTQtdGA0LAuXG4gICAgYnVmZmVyc1tpbmRleF0gPSB0aGlzLnNwbG90LmdsLmNyZWF0ZUJ1ZmZlcigpIVxuICAgIHRoaXMuc3Bsb3QuZ2wuYmluZEJ1ZmZlcih0aGlzLnNwbG90LmdsW3R5cGVdLCBidWZmZXJzW2luZGV4XSlcbiAgICB0aGlzLnNwbG90LmdsLmJ1ZmZlckRhdGEodGhpcy5zcGxvdC5nbFt0eXBlXSwgZGF0YSwgdGhpcy5zcGxvdC5nbC5TVEFUSUNfRFJBVylcblxuICAgIC8vINCh0YfQtdGC0YfQuNC6INC/0LDQvNGP0YLQuCwg0LfQsNC90LjQvNCw0LXQvNC+0Lkg0LHRg9GE0LXRgNCw0LzQuCDQtNCw0L3QvdGL0YUgKNGA0LDQt9C00LXQu9GM0L3QviDQv9C+INC60LDQttC00L7QvNGDINGC0LjQv9GDINCx0YPRhNC10YDQvtCyKVxuICAgIHRoaXMuc3Bsb3QuYnVmZmVycy5zaXplSW5CeXRlc1trZXldICs9IGRhdGEubGVuZ3RoICogZGF0YS5CWVRFU19QRVJfRUxFTUVOVFxuICB9XG59XG4iLCJpbXBvcnQgeyBjb3B5TWF0Y2hpbmdLZXlWYWx1ZXMsIGNvbG9yRnJvbUhleFRvR2xSZ2IgfSBmcm9tICcuL3V0aWxzJ1xuaW1wb3J0IFNQbG90RGVtbyBmcm9tICcuL3NwbG90LWRlbW8nXG5pbXBvcnQgU1Bsb3RXZWJHbCBmcm9tICcuL3NwbG90LXdlYmdsJ1xuaW1wb3J0IFNQbG90RGVidWcgZnJvbSAnLi9zcGxvdC1kZWJ1ZydcbmltcG9ydCBTUGxvdENvbnRvbCBmcm9tICcuL3NwbG90LWNvbnRyb2wnXG5pbXBvcnQgc2hhZGVyQ29kZVZlcnRUbXBsIGZyb20gJy4vc2hhZGVyLWNvZGUtdmVydC10bXBsJ1xuaW1wb3J0IHNoYWRlckNvZGVGcmFnVG1wbCBmcm9tICcuL3NoYWRlci1jb2RlLWZyYWctdG1wbCdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU1Bsb3Qge1xuXG4gIHB1YmxpYyBpdGVyYXRpb25DYWxsYmFjazogU1Bsb3RJdGVyYXRpb25GdW5jdGlvbiA9IHVuZGVmaW5lZCAgICAvLyDQpNGD0L3QutGG0LjRjyDQuNGC0LXRgNC40YDQvtCy0LDQvdC40Y8g0L7QsdGK0LXQutGC0L7Qsi5cbiAgcHVibGljIGRlYnVnOiBTUGxvdERlYnVnID0gbmV3IFNQbG90RGVidWcodGhpcykgICAgICAgICAgICAgICAgIC8vINCe0LHRitC10LrRgiwg0YPQv9GA0LDQstC70Y/RjtGJ0LjQuSDRgNC10LbQuNC80L7QvCDQvtGC0LvQsNC00LrQuC5cbiAgcHVibGljIHdlYkdsOiBTUGxvdFdlYkdsID0gbmV3IFNQbG90V2ViR2wodGhpcykgICAgICAgICAgICAgICAgIC8vINCe0LHRitC10LrRgiDRg9C/0YDQsNCy0LvQtdC90LjRjyB3ZWJHTC5cbiAgcHVibGljIGZvcmNlUnVuOiBib29sZWFuID0gZmFsc2UgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vINCf0YDQuNC30L3QsNC6INGE0L7RgNGB0LjRgNC+0LLQsNC90L3QvtCz0L4g0LfQsNC/0YPRgdC60LAg0YDQtdC90LTQtdGA0LAuXG4gIHB1YmxpYyBtYXhBbW91bnRPZlBvbHlnb25zOiBudW1iZXIgPSAxXzAwMF8wMDBfMDAwICAgICAgICAgICAgICAvLyDQmNGB0LrRg9GB0YHRgtCy0LXQvdC90L7QtSDQvtCz0YDQsNC90LjRh9C10L3QuNC1INC60L7Quy3QstCwINC+0LHRitC10LrRgtC+0LIuXG4gIHB1YmxpYyBpc1J1bm5pbmc6IGJvb2xlYW4gPSBmYWxzZSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDQn9GA0LjQt9C90LDQuiDQsNC60YLQuNCy0L3QvtCz0L4g0L/RgNC+0YbQtdGB0YHQsCDRgNC10L3QtNC10YDQsC5cblxuICAvLyDQptCy0LXRgtC+0LLQsNGPINC/0LDQu9C40YLRgNCwINC/0L7Qu9C40LPQvtC90L7QsiDQv9C+INGD0LzQvtC70YfQsNC90LjRji5cbiAgcHVibGljIHBvbHlnb25QYWxldHRlOiBzdHJpbmdbXSA9IFtcbiAgICAnI0ZGMDBGRicsICcjODAwMDgwJywgJyNGRjAwMDAnLCAnIzgwMDAwMCcsICcjRkZGRjAwJyxcbiAgICAnIzAwRkYwMCcsICcjMDA4MDAwJywgJyMwMEZGRkYnLCAnIzAwMDBGRicsICcjMDAwMDgwJ1xuICBdXG5cbiAgLy8g0J/QsNGA0LDQvNC10YLRgNGLINC60L7QvtGA0LTQuNC90LDRgtC90L7QuSDQv9C70L7RgdC60L7RgdGC0Lgg0L/QviDRg9C80L7Qu9GH0LDQvdC40Y4uXG4gIHB1YmxpYyBncmlkOiBTUGxvdEdyaWQgPSB7XG4gICAgd2lkdGg6IDMyXzAwMCxcbiAgICBoZWlnaHQ6IDE2XzAwMCxcbiAgICBiZ0NvbG9yOiAnI2ZmZmZmZicsXG4gICAgcnVsZXNDb2xvcjogJyNjMGMwYzAnXG4gIH1cblxuICAvLyDQn9Cw0YDQsNC80LXRgtGA0Ysg0YDQtdC20LjQvNCwINC00LXQvNC+0YHRgtGA0LDRhtC40L7QvdC90YvRhSDQtNCw0L3QvdGL0YUuXG4gIHB1YmxpYyBkZW1vOiBTUGxvdERlbW8gPSBuZXcgU1Bsb3REZW1vKHRoaXMpXG5cbiAgLy8g0J/QviDRg9C80L7Qu9GH0LDQvdC40Y4g0L7QsdC70LDRgdGC0Ywg0L/RgNC+0YHQvNC+0YLRgNCwINGD0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdGC0YHRjyDQsiDRhtC10L3RgtGAINC60L7QvtGA0LTQuNC90LDRgtC90L7QuSDQv9C70L7QvtGB0LrQvtGB0YLQuC5cbiAgcHVibGljIGNhbWVyYTogU1Bsb3RDYW1lcmEgPSB7XG4gICAgeDogdGhpcy5ncmlkLndpZHRoISAvIDIsXG4gICAgeTogdGhpcy5ncmlkLmhlaWdodCEgLyAyLFxuICAgIHpvb206IDFcbiAgfVxuXG4gIHB1YmxpYyByZWFkb25seSBzaGFwZXM6IHsgbmFtZTogc3RyaW5nIH1bXSA9IFtdXG5cbiAgcHVibGljIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQgICAgICAgICAgICAgICAgICAgICAgIC8vINCe0LHRitC10LrRgiDQutCw0L3QstCw0YHQsC5cbiAgcHVibGljIGdsITogV2ViR0xSZW5kZXJpbmdDb250ZXh0ICAgICAgICAgICAgICAgICAgICAgIC8vINCe0LHRitC10LrRgiDQutC+0L3RgtC10LrRgdGC0LAg0YDQtdC90LTQtdGA0LjQvdCz0LAgV2ViR0wuXG5cbiAgcHVibGljIGdwdVByb2dyYW0hOiBXZWJHTFByb2dyYW0gICAgICAgICAgICAgICAgICAgICAgIC8vINCe0LHRitC10LrRgiDQv9GA0L7Qs9GA0LDQvNC80YsgV2ViR0wuXG4gIHB1YmxpYyB2YXJpYWJsZXM6IHsgW2tleTogc3RyaW5nXTogYW55IH0gPSB7fSAgICAgICAgICAvLyDQn9C10YDQtdC80LXQvdC90YvQtSDQtNC70Y8g0YHQstGP0LfQuCDQv9GA0LjQu9C+0LbQtdC90LjRjyDRgSDQv9GA0L7Qs9GA0LDQvNC80L7QuSBXZWJHTC5cbiAgcHJvdGVjdGVkIHNoYWRlckNvZGVWZXJ0OiBzdHJpbmcgPSBzaGFkZXJDb2RlVmVydFRtcGwgICAgICAgICAvLyDQqNCw0LHQu9C+0L0gR0xTTC3QutC+0LTQsCDQtNC70Y8g0LLQtdGA0YjQuNC90L3QvtCz0L4g0YjQtdC50LTQtdGA0LAuXG4gIHByb3RlY3RlZCBzaGFkZXJDb2RlRnJhZzogc3RyaW5nID0gc2hhZGVyQ29kZUZyYWdUbXBsICAgICAgICAgLy8g0KjQsNCx0LvQvtC9IEdMU0wt0LrQvtC00LAg0LTQu9GPINGE0YDQsNCz0LzQtdC90YLQvdC+0LPQviDRiNC10LnQtNC10YDQsC5cbiAgcHJvdGVjdGVkIGFtb3VudE9mUG9seWdvbnM6IG51bWJlciA9IDAgICAgICAgICAgICAgICAgICAgIC8vINCh0YfQtdGC0YfQuNC6INGH0LjRgdC70LAg0L7QsdGA0LDQsdC+0YLQsNC90L3Ri9GFINC/0L7Qu9C40LPQvtC90L7Qsi5cbiAgcHJvdGVjdGVkIG1heEFtb3VudE9mVmVydGV4SW5Hcm91cDogbnVtYmVyID0gMTBfMDAwICAgICAgIC8vINCc0LDQutGB0LjQvNCw0LvRjNC90L7QtSDQutC+0Lst0LLQviDQstC10YDRiNC40L0g0LIg0LPRgNGD0L/Qv9C1LlxuXG4gIHByb3RlY3RlZCBjb250cm9sOiBTUGxvdENvbnRvbCA9IG5ldyBTUGxvdENvbnRvbCh0aGlzKSAgICAvLyDQntCx0YrQtdC60YIg0YPQv9GA0LDQstC70LXQvdC40Y8g0LPRgNCw0YTQuNC60L7QvCDRg9GB0YLRgNC+0LnRgdGC0LLQsNC80Lgg0LLQstC+0LTQsC5cblxuICAvLyDQotC10YXQvdC40YfQtdGB0LrQsNGPINC40L3RhNC+0YDQvNCw0YbQuNGPLCDQuNGB0L/QvtC70YzQt9GD0LXQvNCw0Y8g0L/RgNC40LvQvtC20LXQvdC40LXQvCDQtNC70Y8g0YDQsNGB0YfQtdGC0LAg0YLRgNCw0L3RgdGE0L7RgNC80LDRhtC40LkuXG4gIHB1YmxpYyB0cmFuc2Zvcm06IFNQbG90VHJhbnNmb3JtID0ge1xuICAgIHZpZXdQcm9qZWN0aW9uTWF0OiBbXSxcbiAgICBzdGFydEludlZpZXdQcm9qTWF0OiBbXSxcbiAgICBzdGFydENhbWVyYToge3g6IDAsIHk6IDAsIHpvb206IDF9LFxuICAgIHN0YXJ0UG9zOiBbXSxcbiAgICBzdGFydENsaXBQb3M6IFtdLFxuICAgIHN0YXJ0TW91c2VQb3M6IFtdXG4gIH1cblxuICAvLyDQmNC90YTQvtGA0LzQsNGG0LjRjyDQviDQsdGD0YTQtdGA0LDRhSwg0YXRgNCw0L3Rj9GJ0LjRhSDQtNCw0L3QvdGL0LUg0LTQu9GPINCy0LjQtNC10L7Qv9Cw0LzRj9GC0LguXG4gIHB1YmxpYyBidWZmZXJzOiBTUGxvdEJ1ZmZlcnMgPSB7XG4gICAgdmVydGV4QnVmZmVyczogW10sXG4gICAgY29sb3JCdWZmZXJzOiBbXSxcbiAgICBzaXplQnVmZmVyczogW10sXG4gICAgc2hhcGVCdWZmZXJzOiBbXSxcbiAgICBhbW91bnRPZkdMVmVydGljZXM6IFtdLFxuICAgIGFtb3VudE9mU2hhcGVzOiBbXSxcbiAgICBhbW91bnRPZkJ1ZmZlckdyb3VwczogMCxcbiAgICBhbW91bnRPZlRvdGFsVmVydGljZXM6IDAsXG4gICAgYW1vdW50T2ZUb3RhbEdMVmVydGljZXM6IDAsXG4gICAgc2l6ZUluQnl0ZXM6IFswLCAwLCAwLCAwXVxuICB9XG5cbiAgLyoqXG4gICAqINCh0L7Qt9C00LDQtdGCINGN0LrQt9C10LzQv9C70Y/RgCDQutC70LDRgdGB0LAsINC40L3QuNGG0LjQsNC70LjQt9C40YDRg9C10YIg0L3QsNGB0YLRgNC+0LnQutC4LlxuICAgKlxuICAgKiBAcmVtYXJrc1xuICAgKiDQldGB0LvQuCDQutCw0L3QstCw0YEg0YEg0LfQsNC00LDQvdC90YvQvCDQuNC00LXQvdGC0LjRhNC40LrQsNGC0L7RgNC+0Lwg0L3QtSDQvdCw0LnQtNC10L0gLSDQs9C10L3QtdGA0LjRgNGD0LXRgtGB0Y8g0L7RiNC40LHQutCwLiDQndCw0YHRgtGA0L7QudC60Lgg0LzQvtCz0YPRgiDQsdGL0YLRjCDQt9Cw0LTQsNC90Ysg0LrQsNC6INCyXG4gICAqINC60L7QvdGB0YLRgNGD0LrRgtC+0YDQtSwg0YLQsNC6INC4INCyINC80LXRgtC+0LTQtSB7QGxpbmsgc2V0dXB9LiDQntC00L3QsNC60L4g0LIg0LvRjtCx0L7QvCDRgdC70YPRh9Cw0LUg0L3QsNGB0YLRgNC+0LnQutC4INC00L7Qu9C20L3RiyDQsdGL0YLRjCDQt9Cw0LTQsNC90Ysg0LTQviDQt9Cw0L/Rg9GB0LrQsCDRgNC10L3QtNC10YDQsC5cbiAgICpcbiAgICogQHBhcmFtIGNhbnZhc0lkIC0g0JjQtNC10L3RgtC40YTQuNC60LDRgtC+0YAg0LrQsNC90LLQsNGB0LAsINC90LAg0LrQvtGC0L7RgNC+0Lwg0LHRg9C00LXRgiDRgNC40YHQvtCy0LDRgtGM0YHRjyDQs9GA0LDRhNC40LouXG4gICAqIEBwYXJhbSBvcHRpb25zIC0g0J/QvtC70YzQt9C+0LLQsNGC0LXQu9GM0YHQutC40LUg0L3QsNGB0YLRgNC+0LnQutC4INGN0LrQt9C10LzQv9C70Y/RgNCwLlxuICAgKi9cbiAgY29uc3RydWN0b3IoY2FudmFzSWQ6IHN0cmluZywgb3B0aW9ucz86IFNQbG90T3B0aW9ucykge1xuXG4gICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNhbnZhc0lkKSkge1xuICAgICAgdGhpcy5jYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChjYW52YXNJZCkgYXMgSFRNTENhbnZhc0VsZW1lbnRcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCfQmtCw0L3QstCw0YEg0YEg0LjQtNC10L3RgtC40YTQuNC60LDRgtC+0YDQvtC8IFwiIycgKyBjYW52YXNJZCArIMKgJ1wiINC90LUg0L3QsNC50LTQtdC9IScpXG4gICAgfVxuXG4gICAgLy8g0JTQvtCx0LDQstC70LXQvdC40LUg0YTQvtGA0LzRiyDQsiDQvNCw0YHRgdC40LIg0YTQvtGA0LwuXG4gICAgdGhpcy5zaGFwZXMucHVzaCh7XG4gICAgICBuYW1lOiAn0KLQvtGH0LrQsCdcbiAgICB9KVxuICAgIC8vINCU0L7QsdCw0LLQu9C10L3QuNC1INGE0L7RgNC80Ysg0LIg0LzQsNGB0YHQuNCyINGH0LDRgdGC0L7RgiDQv9C+0Y/QstC70LXQvdC40Y8g0LIg0LTQtdC80L4t0YDQtdC20LjQvNC1LlxuICAgIHRoaXMuZGVtby5zaGFwZVF1b3RhIS5wdXNoKDEpXG5cbiAgICBpZiAob3B0aW9ucykge1xuICAgICAgdGhpcy5zZXRPcHRpb25zKG9wdGlvbnMpICAgIC8vINCV0YHQu9C4INC/0LXRgNC10LTQsNC90Ysg0L3QsNGB0YLRgNC+0LnQutC4LCDRgtC+INC+0L3QuCDQv9GA0LjQvNC10L3Rj9GO0YLRgdGPLlxuXG4gICAgICBpZiAodGhpcy5mb3JjZVJ1bikge1xuICAgICAgICB0aGlzLnNldHVwKG9wdGlvbnMpICAgICAgIC8vICDQmNC90LjRhtC40LDQu9C40LfQsNGG0LjRjyDQstGB0LXRhSDQv9Cw0YDQsNC80LXRgtGA0L7QsiDRgNC10L3QtNC10YDQsCwg0LXRgdC70Lgg0LfQsNC/0YDQvtGI0LXQvSDRhNC+0YDRgdC40YDQvtCy0LDQvdC90YvQuSDQt9Cw0L/Rg9GB0LouXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqINCY0L3QuNGG0LjQsNC70LjQt9C40YDRg9C10YIg0L3QtdC+0LHRhdC+0LTQuNC80YvQtSDQtNC70Y8g0YDQtdC90LTQtdGA0LAg0L/QsNGA0LDQvNC10YLRgNGLINGN0LrQt9C10LzQv9C70Y/RgNCwINC4IFdlYkdMLlxuICAgKlxuICAgKiBAcGFyYW0gb3B0aW9ucyAtINCf0L7Qu9GM0LfQvtCy0LDRgtC10LvRjNGB0LrQuNC1INC90LDRgdGC0YDQvtC50LrQuCDRjdC60LfQtdC80L/Qu9GP0YDQsC5cbiAgICovXG4gIHB1YmxpYyBzZXR1cChvcHRpb25zOiBTUGxvdE9wdGlvbnMpOiB2b2lkIHtcblxuICAgIHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKSAgICAgLy8g0J/RgNC40LzQtdC90LXQvdC40LUg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GM0YHQutC40YUg0L3QsNGB0YLRgNC+0LXQui5cbiAgICB0aGlzLndlYkdsLmNyZWF0ZSgpICAgICAgICAgICAgICAvLyDQodC+0LfQtNCw0L3QuNC1INC60L7QvdGC0LXQutGB0YLQsCDRgNC10L3QtNC10YDQuNC90LPQsC5cbiAgICB0aGlzLmFtb3VudE9mUG9seWdvbnMgPSAwICAgIC8vINCe0LHQvdGD0LvQtdC90LjQtSDRgdGH0LXRgtGH0LjQutCwINC/0L7Qu9C40LPQvtC90L7Qsi5cbiAgICB0aGlzLmRlbW8uaW5pdCgpICAgICAgLy8g0J7QsdC90YPQu9C10L3QuNC1INGC0LXRhdC90LjRh9C10YHQutC+0LPQviDRgdGH0LXRgtGH0LjQutCwINGA0LXQttC40LzQsCDQtNC10LzQvi3QtNCw0L3QvdGL0YUuXG5cbiAgICBmb3IgKGNvbnN0IGtleSBpbiB0aGlzLnNoYXBlcykge1xuICAgICAgdGhpcy5idWZmZXJzLmFtb3VudE9mU2hhcGVzW2tleV0gPSAwICAgIC8vINCe0LHQvdGD0LvQtdC90LjQtSDRgdGH0LXRgtGH0LjQutC+0LIg0YTQvtGA0Lwg0L/QvtC70LjQs9C+0L3QvtCyLlxuICAgIH1cblxuICAgIGlmICh0aGlzLmRlYnVnLmlzRW5hYmxlKSB7XG4gICAgICB0aGlzLmRlYnVnLmxvZ0ludHJvKHRoaXMuY2FudmFzKVxuICAgICAgdGhpcy5kZWJ1Zy5sb2dHcHVJbmZvKHRoaXMuZ2wpXG4gICAgICB0aGlzLmRlYnVnLmxvZ0luc3RhbmNlSW5mbyh0aGlzLmNhbnZhcywgb3B0aW9ucylcbiAgICB9XG5cbiAgICB0aGlzLndlYkdsLnNldEJnQ29sb3IodGhpcy5ncmlkLmJnQ29sb3IhKSAgICAvLyDQo9GB0YLQsNC90L7QstC60LAg0YbQstC10YLQsCDQvtGH0LjRgdGC0LrQuCDRgNC10L3QtNC10YDQuNC90LPQsFxuXG4gICAgLy8g0KHQvtC30LTQsNC90LjQtSDRiNC10LnQtNC10YDQvtCyIFdlYkdMLlxuICAgIGNvbnN0IHNoYWRlckNvZGVWZXJ0ID0gdGhpcy5zaGFkZXJDb2RlVmVydC5yZXBsYWNlKCd7RVhURVJOQUwtQ09ERX0nLCB0aGlzLmdlblNoYWRlckNvbG9yQ29kZSgpKVxuICAgIGNvbnN0IHNoYWRlckNvZGVGcmFnID0gdGhpcy5zaGFkZXJDb2RlRnJhZ1xuXG4gICAgY29uc3Qgc2hhZGVyVmVydCA9IHRoaXMud2ViR2wuY3JlYXRlU2hhZGVyKCdWRVJURVhfU0hBREVSJywgc2hhZGVyQ29kZVZlcnQpXG4gICAgY29uc3Qgc2hhZGVyRnJhZyA9IHRoaXMud2ViR2wuY3JlYXRlU2hhZGVyKCdGUkFHTUVOVF9TSEFERVInLCBzaGFkZXJDb2RlRnJhZylcblxuICAgIC8vINCS0YvQstC+0LQg0L7RgtC70LDQtNC+0YfQvdC+0Lkg0LjQvdGE0L7RgNC80LDRhtC40LguXG4gICAgaWYgKHRoaXMuZGVidWcuaXNFbmFibGUpIHtcbiAgICAgIHRoaXMuZGVidWcubG9nU2hhZGVySW5mbygnVkVSVEVYX1NIQURFUicsIHNoYWRlckNvZGVWZXJ0KVxuICAgICAgdGhpcy5kZWJ1Zy5sb2dTaGFkZXJJbmZvKCdGUkFHTUVOVF9TSEFERVInLCBzaGFkZXJDb2RlRnJhZylcbiAgICB9XG5cbiAgICAvLyDQodC+0LfQtNCw0L3QuNC1INC/0YDQvtCz0YDQsNC80LzRiyBXZWJHTC5cbiAgICB0aGlzLndlYkdsLmNyZWF0ZVByb2dyYW0oc2hhZGVyVmVydCwgc2hhZGVyRnJhZylcblxuXG4gICAgLy8g0KPRgdGC0LDQvdC+0LLQutCwINGB0LLRj9C30LXQuSDQv9C10YDQtdC80LXQvdC90YvRhSDQv9GA0LjQu9C+0LbQtdC90LjRjyDRgSDQv9GA0L7Qs9GA0LDQvNC80L7QuSBXZWJHbC5cbiAgICB0aGlzLndlYkdsLmNyZWF0ZVZhcmlhYmxlKCdhdHRyaWJ1dGUnLCAnYV9wb3NpdGlvbicpXG4gICAgdGhpcy53ZWJHbC5jcmVhdGVWYXJpYWJsZSgnYXR0cmlidXRlJywgJ2FfY29sb3InKVxuICAgIHRoaXMud2ViR2wuY3JlYXRlVmFyaWFibGUoJ2F0dHJpYnV0ZScsICdhX3BvbHlnb25zaXplJylcbiAgICB0aGlzLndlYkdsLmNyZWF0ZVZhcmlhYmxlKCdhdHRyaWJ1dGUnLCAnYV9zaGFwZScpXG4gICAgdGhpcy53ZWJHbC5jcmVhdGVWYXJpYWJsZSgndW5pZm9ybScsICd1X21hdHJpeCcpXG5cbiAgICB0aGlzLmNyZWF0ZVdlYkdsQnVmZmVycygpICAgIC8vINCX0LDQv9C+0LvQvdC10L3QuNC1INCx0YPRhNC10YDQvtCyIFdlYkdMLlxuXG4gICAgaWYgKHRoaXMuZm9yY2VSdW4pIHtcbiAgICAgIHRoaXMucnVuKCkgICAgICAgICAgICAgICAgLy8g0KTQvtGA0YHQuNGA0L7QstCw0L3QvdGL0Lkg0LfQsNC/0YPRgdC6INGA0LXQvdC00LXRgNC40L3Qs9CwICjQtdGB0LvQuCDRgtGA0LXQsdGD0LXRgtGB0Y8pLlxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDQn9GA0LjQvNC10L3Rj9C10YIg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GM0YHQutC40LUg0L3QsNGB0YLRgNC+0LnQutC4INGN0LrQt9C10LzQv9C70Y/RgNCwLlxuICAgKlxuICAgKiBAcGFyYW0gb3B0aW9ucyAtINCf0L7Qu9GM0LfQvtCy0LDRgtC10LvRjNGB0LrQuNC1INC90LDRgdGC0YDQvtC50LrQuCDRjdC60LfQtdC80L/Qu9GP0YDQsC5cbiAgICovXG4gIHByb3RlY3RlZCBzZXRPcHRpb25zKG9wdGlvbnM6IFNQbG90T3B0aW9ucyk6IHZvaWQge1xuXG4gICAgY29weU1hdGNoaW5nS2V5VmFsdWVzKHRoaXMsIG9wdGlvbnMpICAgIC8vINCf0YDQuNC80LXQvdC10L3QuNC1INC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjNGB0LrQuNGFINC90LDRgdGC0YDQvtC10LouXG5cbiAgICAvLyDQldGB0LvQuCDQt9Cw0LTQsNC9INGA0LDQt9C80LXRgCDQv9C70L7RgdC60L7RgdGC0LgsINC90L4g0L3QtSDQt9Cw0LTQsNC90L4g0L/QvtC70L7QttC10L3QuNC1INC+0LHQu9Cw0YHRgtC4INC/0YDQvtGB0LzQvtGC0YDQsCwg0YLQviDQvtCx0LvQsNGB0YLRjCDQv9C+0LzQtdGJ0LDQtdGC0YHRjyDQsiDRhtC10L3RgtGAINC/0LvQvtGB0LrQvtGB0YLQuC5cbiAgICBpZiAoKCdncmlkJyBpbiBvcHRpb25zKSAmJiAhKCdjYW1lcmEnIGluIG9wdGlvbnMpKSB7XG4gICAgICB0aGlzLmNhbWVyYS54ID0gdGhpcy5ncmlkLndpZHRoISAvIDJcbiAgICAgIHRoaXMuY2FtZXJhLnkgPSB0aGlzLmdyaWQuaGVpZ2h0ISAvIDJcbiAgICB9XG5cbiAgICBpZiAodGhpcy5kZW1vLmlzRW5hYmxlKSB7XG4gICAgICB0aGlzLml0ZXJhdGlvbkNhbGxiYWNrID0gdGhpcy5kZW1vLmRlbW9JdGVyYXRpb25DYWxsYmFjayAgICAvLyDQmNC80LjRgtCw0YbQuNGPINC40YLQtdGA0LjRgNC+0LLQsNC90LjRjyDQtNC70Y8g0LTQtdC80L4t0YDQtdC20LjQvNCwLlxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDQodC+0LfQtNCw0LXRgiDQuCDQt9Cw0L/QvtC70L3Rj9C10YIg0LTQsNC90L3Ri9C80Lgg0L7QsdC+INCy0YHQtdGFINC/0L7Qu9C40LPQvtC90LDRhSDQsdGD0YTQtdGA0YsgV2ViR0wuXG4gICAqL1xuICBwcm90ZWN0ZWQgY3JlYXRlV2ViR2xCdWZmZXJzKCk6IHZvaWQge1xuXG4gICAgLy8g0JLRi9Cy0L7QtCDQvtGC0LvQsNC00L7Rh9C90L7QuSDQuNC90YTQvtGA0LzQsNGG0LjQuC5cbiAgICBpZiAodGhpcy5kZWJ1Zy5pc0VuYWJsZSkge1xuICAgICAgdGhpcy5kZWJ1Zy5sb2dEYXRhTG9hZGluZ1N0YXJ0KClcbiAgICB9XG5cbiAgICBsZXQgcG9seWdvbkdyb3VwOiBTUGxvdFBvbHlnb25Hcm91cCB8IG51bGxcblxuICAgIC8vINCY0YLQtdGA0LjRgNC+0LLQsNC90LjQtSDQs9GA0YPQv9C/INC/0L7Qu9C40LPQvtC90L7Qsi5cbiAgICB3aGlsZSAocG9seWdvbkdyb3VwID0gdGhpcy5jcmVhdGVQb2x5Z29uR3JvdXAoKSkge1xuXG4gICAgICAvLyDQodC+0LfQtNCw0L3QuNC1INC4INC30LDQv9C+0LvQvdC10L3QuNC1INCx0YPRhNC10YDQvtCyINC00LDQvdC90YvQvNC4INC+INGC0LXQutGD0YnQtdC5INCz0YDRg9C/0L/QtSDQv9C+0LvQuNCz0L7QvdC+0LIuXG4gICAgICB0aGlzLndlYkdsLmNyZWF0ZUJ1ZmZlcih0aGlzLmJ1ZmZlcnMudmVydGV4QnVmZmVycywgJ0FSUkFZX0JVRkZFUicsIG5ldyBGbG9hdDMyQXJyYXkocG9seWdvbkdyb3VwLnZlcnRpY2VzKSwgMClcbiAgICAgIHRoaXMud2ViR2wuY3JlYXRlQnVmZmVyKHRoaXMuYnVmZmVycy5jb2xvckJ1ZmZlcnMsICdBUlJBWV9CVUZGRVInLCBuZXcgVWludDhBcnJheShwb2x5Z29uR3JvdXAuY29sb3JzKSwgMSlcbiAgICAgIHRoaXMud2ViR2wuY3JlYXRlQnVmZmVyKHRoaXMuYnVmZmVycy5zaGFwZUJ1ZmZlcnMsICdBUlJBWV9CVUZGRVInLCBuZXcgVWludDhBcnJheShwb2x5Z29uR3JvdXAuc2hhcGVzKSwgNClcbiAgICAgIHRoaXMud2ViR2wuY3JlYXRlQnVmZmVyKHRoaXMuYnVmZmVycy5zaXplQnVmZmVycywgJ0FSUkFZX0JVRkZFUicsIG5ldyBGbG9hdDMyQXJyYXkocG9seWdvbkdyb3VwLnNpemVzKSwgMylcblxuICAgICAgLy8g0KHRh9C10YLRh9C40Log0LrQvtC70LjRh9C10YHRgtCy0LAg0LHRg9GE0LXRgNC+0LIuXG4gICAgICB0aGlzLmJ1ZmZlcnMuYW1vdW50T2ZCdWZmZXJHcm91cHMrK1xuXG4gICAgICAvLyDQodGH0LXRgtGH0LjQuiDQutC+0LvQuNGH0LXRgdGC0LLQsCDQstC10YDRiNC40L0gR0wt0YLRgNC10YPQs9C+0LvRjNC90LjQutC+0LIg0YLQtdC60YPRidC10Lkg0LPRgNGD0L/Qv9GLINCx0YPRhNC10YDQvtCyLlxuICAgICAgdGhpcy5idWZmZXJzLmFtb3VudE9mR0xWZXJ0aWNlcy5wdXNoKHBvbHlnb25Hcm91cC5hbW91bnRPZkdMVmVydGljZXMpXG5cbiAgICAgIC8vINCh0YfQtdGC0YfQuNC6INC+0LHRidC10LPQviDQutC+0LvQuNGH0LXRgdGC0LLQsCDQstC10YDRiNC40L0gR0wt0YLRgNC10YPQs9C+0LvRjNC90LjQutC+0LIuXG4gICAgICB0aGlzLmJ1ZmZlcnMuYW1vdW50T2ZUb3RhbEdMVmVydGljZXMgKz0gcG9seWdvbkdyb3VwLmFtb3VudE9mR0xWZXJ0aWNlc1xuICAgIH1cblxuICAgIC8vINCS0YvQstC+0LQg0L7RgtC70LDQtNC+0YfQvdC+0Lkg0LjQvdGE0L7RgNC80LDRhtC40LguXG4gICAgaWYgKHRoaXMuZGVidWcuaXNFbmFibGUpIHtcbiAgICAgIHRoaXMuZGVidWcubG9nRGF0YUxvYWRpbmdDb21wbGV0ZSh0aGlzLmFtb3VudE9mUG9seWdvbnMsIHRoaXMubWF4QW1vdW50T2ZQb2x5Z29ucylcbiAgICAgIHRoaXMuZGVidWcubG9nT2JqZWN0U3RhdHModGhpcy5idWZmZXJzLCB0aGlzLmFtb3VudE9mUG9seWdvbnMpXG4gICAgICB0aGlzLmRlYnVnLmxvZ0dwdU1lbVN0YXRzKHRoaXMuYnVmZmVycylcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICog0KHRh9C40YLRi9Cy0LDQtdGCINC00LDQvdC90YvQtSDQvtCxINC40YHRhdC+0LTQvdGL0YUg0L7QsdGK0LXQutGC0LDRhSDQuCDRhNC+0YDQvNC40YDRg9C10YIg0YHQvtC+0YLQstC10YLRgdCy0YPRjtGJ0YPRjiDRjdGC0LjQvCDQvtCx0YrQtdC60YLQsNC8INCz0YDRg9C/0L/RgyDQv9C+0LvQuNCz0L7QvdC+0LIuXG4gICAqXG4gICAqIEByZW1hcmtzXG4gICAqINCT0YDRg9C/0L/QsCDRhNC+0YDQvNC40YDRg9C10YLRgdGPINGBINGD0YfQtdGC0L7QvCDRgtC10YXQvdC40YfQtdGB0LrQvtCz0L4g0L7Qs9GA0LDQvdC40YfQtdC90LjRjyDQvdCwINC60L7Qu9C40YfQtdGB0YLQstC+INCy0LXRgNGI0LjQvSDQsiDQs9GA0YPQv9C/0LUg0Lgg0LvQuNC80LjRgtCwINC90LAg0L7QsdGJ0LXQtSDQutC+0LvQuNGH0LXRgdGC0LLQvlxuICAgKiDQv9C+0LvQuNCz0L7QvdC+0LIg0L3QsCDQutCw0L3QstCw0YHQtS5cbiAgICpcbiAgICogQHJldHVybnMg0KHQvtC30LTQsNC90L3QsNGPINCz0YDRg9C/0L/QsCDQv9C+0LvQuNCz0L7QvdC+0LIg0LjQu9C4IG51bGwsINC10YHQu9C4INGE0L7RgNC80LjRgNC+0LLQsNC90LjQtSDQstGB0LXRhSDQs9GA0YPQv9C/INC/0L7Qu9C40LPQvtC90L7QsiDQt9Cw0LLQtdGA0YjQuNC70L7RgdGMLlxuICAgKi9cbiAgcHJvdGVjdGVkIGNyZWF0ZVBvbHlnb25Hcm91cCgpOiBTUGxvdFBvbHlnb25Hcm91cCB8IG51bGwge1xuXG4gICAgbGV0IHBvbHlnb25Hcm91cDogU1Bsb3RQb2x5Z29uR3JvdXAgPSB7XG4gICAgICB2ZXJ0aWNlczogW10sXG4gICAgICBjb2xvcnM6IFtdLFxuICAgICAgc2l6ZXM6IFtdLFxuICAgICAgc2hhcGVzOiBbXSxcbiAgICAgIGFtb3VudE9mVmVydGljZXM6IDAsXG4gICAgICBhbW91bnRPZkdMVmVydGljZXM6IDBcbiAgICB9XG5cbiAgICBsZXQgcG9seWdvbjogU1Bsb3RQb2x5Z29uIHwgbnVsbCB8IHVuZGVmaW5lZFxuXG4gICAgLyoqXG4gICAgICog0JXRgdC70Lgg0LrQvtC70LjRh9C10YHRgtCy0L4g0L/QvtC70LjQs9C+0L3QvtCyINC60LDQvdCy0LDRgdCwINC00L7RgdGC0LjQs9C70L4g0LTQvtC/0YPRgdGC0LjQvNC+0LPQviDQvNCw0LrRgdC40LzRg9C80LAsINGC0L4g0LTQsNC70YzQvdC10LnRiNCw0Y8g0L7QsdGA0LDQsdC+0YLQutCwINC40YHRhdC+0LTQvdGL0YUg0L7QsdGK0LXQutGC0L7QslxuICAgICAqINC/0YDQuNC+0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdGC0YHRjyAtINGE0L7RgNC80LjRgNC+0LLQsNC90LjQtSDQs9GA0YPQv9C/INC/0L7Qu9C40LPQvtC90L7QsiDQt9Cw0LLQtdGA0YjQsNC10YLRgdGPINCy0L7Qt9Cy0YDQsNGC0L7QvCDQt9C90LDRh9C10L3QuNGPIG51bGwgKNGB0LjQvNGD0LvRj9GG0LjRjyDQtNC+0YHRgtC40LbQtdC90LjRj1xuICAgICAqINC/0L7RgdC70LXQtNC90LXQs9C+INC+0LHRgNCw0LHQsNGC0YvQstCw0LXQvNC+0LPQviDQuNGB0YXQvtC00L3QvtCz0L4g0L7QsdGK0LXQutGC0LApLlxuICAgICAqL1xuICAgIGlmICh0aGlzLmFtb3VudE9mUG9seWdvbnMgPj0gdGhpcy5tYXhBbW91bnRPZlBvbHlnb25zKSByZXR1cm4gbnVsbFxuXG4gICAgLy8g0JjRgtC10YDQuNGA0L7QstCw0L3QuNC1INC40YHRhdC+0LTQvdGL0YUg0L7QsdGK0LXQutGC0L7Qsi5cbiAgICB3aGlsZSAocG9seWdvbiA9IHRoaXMuaXRlcmF0aW9uQ2FsbGJhY2shKCkpIHtcblxuICAgICAgLy8g0JTQvtCx0LDQstC70LXQvdC40LUg0LIg0LPRgNGD0L/Qv9GDINC/0L7Qu9C40LPQvtC90L7QsiDQvdC+0LLQvtCz0L4g0L/QvtC70LjQs9C+0L3QsC5cbiAgICAgIHRoaXMuYWRkUG9seWdvbihwb2x5Z29uR3JvdXAsIHBvbHlnb24pXG5cbiAgICAgIC8vINCh0YfQtdGC0YfQuNC6INGH0LjRgdC70LAg0L/RgNC40LzQtdC90LXQvdC40Lkg0LrQsNC20LTQvtC5INC40Lcg0YTQvtGA0Lwg0L/QvtC70LjQs9C+0L3QvtCyLlxuICAgICAgdGhpcy5idWZmZXJzLmFtb3VudE9mU2hhcGVzW3BvbHlnb24uc2hhcGVdKytcblxuICAgICAgLy8g0KHRh9C10YLRh9C40Log0L7QsdGJ0LXQs9C+INC60L7Qu9C40YfQtdGB0YLQstC+INC/0L7Qu9C40LPQvtC90L7Qsi5cbiAgICAgIHRoaXMuYW1vdW50T2ZQb2x5Z29ucysrXG5cbiAgICAgIC8qKlxuICAgICAgICog0JXRgdC70Lgg0LrQvtC70LjRh9C10YHRgtCy0L4g0L/QvtC70LjQs9C+0L3QvtCyINC60LDQvdCy0LDRgdCwINC00L7RgdGC0LjQs9C70L4g0LTQvtC/0YPRgdGC0LjQvNC+0LPQviDQvNCw0LrRgdC40LzRg9C80LAsINGC0L4g0LTQsNC70YzQvdC10LnRiNCw0Y8g0L7QsdGA0LDQsdC+0YLQutCwINC40YHRhdC+0LTQvdGL0YUg0L7QsdGK0LXQutGC0L7QslxuICAgICAgICog0L/RgNC40L7RgdGC0LDQvdCw0LLQu9C40LLQsNC10YLRgdGPIC0g0YTQvtGA0LzQuNGA0L7QstCw0L3QuNC1INCz0YDRg9C/0L8g0L/QvtC70LjQs9C+0L3QvtCyINC30LDQstC10YDRiNCw0LXRgtGB0Y8g0LLQvtC30LLRgNCw0YLQvtC8INC30L3QsNGH0LXQvdC40Y8gbnVsbCAo0YHQuNC80YPQu9GP0YbQuNGPINC00L7RgdGC0LjQttC10L3QuNGPXG4gICAgICAgKiDQv9C+0YHQu9C10LTQvdC10LPQviDQvtCx0YDQsNCx0LDRgtGL0LLQsNC10LzQvtCz0L4g0LjRgdGF0L7QtNC90L7Qs9C+INC+0LHRitC10LrRgtCwKS5cbiAgICAgICAqL1xuICAgICAgaWYgKHRoaXMuYW1vdW50T2ZQb2x5Z29ucyA+PSB0aGlzLm1heEFtb3VudE9mUG9seWdvbnMpIGJyZWFrXG5cbiAgICAgIC8qKlxuICAgICAgICog0JXRgdC70Lgg0L7QsdGJ0LXQtSDQutC+0LvQuNGH0LXRgdGC0LLQviDQstGB0LXRhSDQstC10YDRiNC40L0g0LIg0LPRgNGD0L/Qv9C1INC/0L7Qu9C40LPQvtC90L7QsiDQv9GA0LXQstGL0YHQuNC70L4g0YLQtdGF0L3QuNGH0LXRgdC60L7QtSDQvtCz0YDQsNC90LjRh9C10L3QuNC1LCDRgtC+INCz0YDRg9C/0L/QsCDQv9C+0LvQuNCz0L7QvdC+0LJcbiAgICAgICAqINGB0YfQuNGC0LDQtdGC0YHRjyDRgdGE0L7RgNC80LjRgNC+0LLQsNC90L3QvtC5INC4INC40YLQtdGA0LjRgNC+0LLQsNC90LjQtSDQuNGB0YXQvtC00L3Ri9GFINC+0LHRitC10LrRgtC+0LIg0L/RgNC40L7RgdGC0LDQvdCw0LLQu9C40LLQsNC10YLRgdGPLlxuICAgICAgICovXG4gICAgICBpZiAocG9seWdvbkdyb3VwLmFtb3VudE9mVmVydGljZXMgPj0gdGhpcy5tYXhBbW91bnRPZlZlcnRleEluR3JvdXApIGJyZWFrXG4gICAgfVxuXG4gICAgLy8g0KHRh9C10YLRh9C40Log0L7QsdGJ0LXQs9C+INC60L7Qu9C40YfQtdGB0YLQstCwINCy0LXRgNGI0LjQvSDQstGB0LXRhSDQstC10YDRiNC40L3QvdGL0YUg0LHRg9GE0LXRgNC+0LIuXG4gICAgdGhpcy5idWZmZXJzLmFtb3VudE9mVG90YWxWZXJ0aWNlcyArPSBwb2x5Z29uR3JvdXAuYW1vdW50T2ZWZXJ0aWNlc1xuXG4gICAgLy8g0JXRgdC70Lgg0LPRgNGD0L/Qv9CwINC/0L7Qu9C40LPQvtC90L7QsiDQvdC10L/Rg9GB0YLQsNGPLCDRgtC+INCy0L7Qt9Cy0YDQsNGJ0LDQtdC8INC10LUuINCV0YHQu9C4INC/0YPRgdGC0LDRjyAtINCy0L7Qt9Cy0YDQsNGJ0LDQtdC8IG51bGwuXG4gICAgcmV0dXJuIChwb2x5Z29uR3JvdXAuYW1vdW50T2ZWZXJ0aWNlcyA+IDApID8gcG9seWdvbkdyb3VwIDogbnVsbFxuICB9XG5cbiAgLyoqXG4gICAqINCh0L7Qt9C00LDQtdGCINC4INC00L7QsdCw0LLQu9GP0LXRgiDQsiDQs9GA0YPQv9C/0YMg0L/QvtC70LjQs9C+0L3QvtCyINC90L7QstGL0Lkg0L/QvtC70LjQs9C+0L0uXG4gICAqXG4gICAqIEBwYXJhbSBwb2x5Z29uR3JvdXAgLSDQk9GA0YPQv9C/0LAg0L/QvtC70LjQs9C+0L3QvtCyLCDQsiDQutC+0YLQvtGA0YPRjiDQv9GA0L7QuNGB0YXQvtC00LjRgiDQtNC+0LHQsNCy0LvQtdC90LjQtS5cbiAgICogQHBhcmFtIHBvbHlnb24gLSDQmNC90YTQvtGA0LzQsNGG0LjRjyDQviDQtNC+0LHQsNCy0LvRj9C10LzQvtC8INC/0L7Qu9C40LPQvtC90LUuXG4gICAqL1xuICBwcm90ZWN0ZWQgYWRkUG9seWdvbihwb2x5Z29uR3JvdXA6IFNQbG90UG9seWdvbkdyb3VwLCBwb2x5Z29uOiBTUGxvdFBvbHlnb24pOiB2b2lkIHtcblxuICAgIC8qKlxuICAgICAqINCU0L7QsdCw0LLQu9C10L3QuNC1INCyINCz0YDRg9C/0L/RgyDQv9C+0LvQuNCz0L7QvdC+0LIg0LjQvdC00LXQutGB0L7QsiDQstC10YDRiNC40L0g0L3QvtCy0L7Qs9C+INC/0L7Qu9C40LPQvtC90LAg0Lgg0L/QvtC00YHRh9C10YIg0L7QsdGJ0LXQs9C+INC60L7Qu9C40YfQtdGB0YLQstCwINCy0LXRgNGI0LjQvSBHTC3RgtGA0LXRg9Cz0L7Qu9GM0L3QuNC60L7QslxuICAgICAqINCyINCz0YDRg9C/0L/QtS5cbiAgICAgKi9cbiAgICBwb2x5Z29uR3JvdXAuYW1vdW50T2ZHTFZlcnRpY2VzKytcblxuICAgIC8vINCU0L7QsdCw0LLQu9C10L3QuNC1INCyINCz0YDRg9C/0L/RgyDQv9C+0LvQuNCz0L7QvdC+0LIg0LLQtdGA0YjQuNC9INC90L7QstC+0LPQviDQv9C+0LvQuNCz0L7QvdCwINC4INC/0L7QtNGB0YfQtdGCINC+0LHRidC10LPQviDQutC+0LvQuNGH0LXRgdGC0LLQsCDQstC10YDRiNC40L0g0LIg0LPRgNGD0L/Qv9C1LlxuICAgIHBvbHlnb25Hcm91cC52ZXJ0aWNlcy5wdXNoKHBvbHlnb24ueCwgcG9seWdvbi55KVxuICAgIHBvbHlnb25Hcm91cC5hbW91bnRPZlZlcnRpY2VzKytcblxuICAgIHBvbHlnb25Hcm91cC5zaGFwZXMucHVzaChwb2x5Z29uLnNoYXBlKVxuICAgIHBvbHlnb25Hcm91cC5zaXplcy5wdXNoKHBvbHlnb24uc2l6ZSlcbiAgICBwb2x5Z29uR3JvdXAuY29sb3JzLnB1c2gocG9seWdvbi5jb2xvcilcbiAgfVxuXG4gIC8qKlxuICAgKiDQodC+0LfQtNCw0LXRgiDQtNC+0L/QvtC70L3QtdC90LjQtSDQuiDQutC+0LTRgyDQvdCwINGP0LfRi9C60LUgR0xTTC5cbiAgICpcbiAgICogQHJlbWFya3NcbiAgICog0JIg0LTQsNC70YzQvdC10LnRiNC10Lwg0YHQvtC30LTQsNC90L3Ri9C5INC60L7QtCDQsdGD0LTQtdGCINCy0YHRgtGA0L7QtdC9INCyINC60L7QtCDQstC10YDRiNC40L3QvdC+0LPQviDRiNC10LnQtNC10YDQsCDQtNC70Y8g0LfQsNC00LDQvdC40Y8g0YbQstC10YLQsCDQstC10YDRiNC40L3RiyDQsiDQt9Cw0LLQuNGB0LjQvNC+0YHRgtC4INC+0YJcbiAgICog0LjQvdC00LXQutGB0LAg0YbQstC10YLQsCwg0L/RgNC40YHQstC+0LXQvdC90L7Qs9C+INGN0YLQvtC5INCy0LXRgNGI0LjQvdC1LiDQoi7Qui4g0YjQtdC50LTQtdGAINC90LUg0L/QvtC30LLQvtC70Y/QtdGCINC40YHQv9C+0LvRjNC30L7QstCw0YLRjCDQsiDQutCw0YfQtdGB0YLQstC1INC40L3QtNC10LrRgdC+0LIg0L/QtdGA0LXQvNC10L3QvdGL0LUgLVxuICAgKiDQtNC70Y8g0LfQsNC00LDQvdC40Y8g0YbQstC10YLQsCDQuNGB0L/QvtC70YzQt9GD0LXRgtGB0Y8g0L/QtdGA0LXQsdC+0YAg0YbQstC10YLQvtCy0YvRhSDQuNC90LTQtdC60YHQvtCyLlxuICAgKlxuICAgKiBAcmV0dXJucyDQmtC+0LQg0L3QsCDRj9C30YvQutC1IEdMU0wuXG4gICAqL1xuICBwcm90ZWN0ZWQgZ2VuU2hhZGVyQ29sb3JDb2RlKCk6IHN0cmluZyB7XG5cbiAgICAvLyDQktGA0LXQvNC10L3QvdC+0LUg0LTQvtCx0LDQstC70LXQvdC40LUg0LIg0L/QsNC70LjRgtGA0YMg0YbQstC10YLQvtCyINCy0LXRgNGI0LjQvSDRhtCy0LXRgtCwINC90LDQv9GA0LDQstC70Y/RjtGJ0LjRhS5cbiAgICB0aGlzLnBvbHlnb25QYWxldHRlLnB1c2godGhpcy5ncmlkLnJ1bGVzQ29sb3IhKVxuXG4gICAgbGV0IGNvZGU6IHN0cmluZyA9ICcnXG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucG9seWdvblBhbGV0dGUubGVuZ3RoOyBpKyspIHtcblxuICAgICAgLy8g0J/QvtC70YPRh9C10L3QuNC1INGG0LLQtdGC0LAg0LIg0L3Rg9C20L3QvtC8INGE0L7RgNC80LDRgtC1LlxuICAgICAgbGV0IFtyLCBnLCBiXSA9IGNvbG9yRnJvbUhleFRvR2xSZ2IodGhpcy5wb2x5Z29uUGFsZXR0ZVtpXSlcblxuICAgICAgLy8g0KTQvtGA0LzQuNGA0L7QstC90LjQtSDRgdGC0YDQvtC6IEdMU0wt0LrQvtC00LAg0L/RgNC+0LLQtdGA0LrQuCDQuNC90LTQtdC60YHQsCDRhtCy0LXRgtCwLlxuICAgICAgY29kZSArPSAoKGkgPT09IDApID8gJycgOiAnICBlbHNlICcpICsgJ2lmIChhX2NvbG9yID09ICcgKyBpICsgJy4wKSB2X2NvbG9yID0gdmVjMygnICtcbiAgICAgICAgci50b1N0cmluZygpLnNsaWNlKDAsIDkpICsgJywnICtcbiAgICAgICAgZy50b1N0cmluZygpLnNsaWNlKDAsIDkpICsgJywnICtcbiAgICAgICAgYi50b1N0cmluZygpLnNsaWNlKDAsIDkpICsgJyk7XFxuJ1xuICAgIH1cblxuICAgIC8vINCj0LTQsNC70LXQvdC40LUg0LjQtyDQv9Cw0LvQuNGC0YDRiyDQstC10YDRiNC40L0g0LLRgNC10LzQtdC90L3QviDQtNC+0LHQsNCy0LvQtdC90L3QvtCz0L4g0YbQstC10YLQsCDQvdCw0L/RgNCw0LLQu9GP0Y7RidC40YUuXG4gICAgdGhpcy5wb2x5Z29uUGFsZXR0ZS5wb3AoKVxuXG4gICAgcmV0dXJuIGNvZGVcbiAgfVxuXG4gIC8qKlxuICAgKiDQn9GA0L7QuNC30LLQvtC00LjRgiDRgNC10L3QtNC10YDQuNC90LMg0LPRgNCw0YTQuNC60LAg0LIg0YHQvtC+0YLQstC10YLRgdGC0LLQuNC4INGBINGC0LXQutGD0YnQuNC80Lgg0L/QsNGA0LDQvNC10YLRgNCw0LzQuCDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuC5cbiAgICovXG4gIHB1YmxpYyByZW5kZXIoKTogdm9pZCB7XG5cbiAgICAvLyDQntGH0LjRgdGC0LrQsCDQvtCx0YrQtdC60YLQsCDRgNC10L3QtNC10YDQuNC90LPQsCBXZWJHTC5cbiAgICB0aGlzLmdsLmNsZWFyKHRoaXMuZ2wuQ09MT1JfQlVGRkVSX0JJVClcblxuICAgIC8vINCe0LHQvdC+0LLQu9C10L3QuNC1INC80LDRgtGA0LjRhtGLINGC0YDQsNC90YHRhNC+0YDQvNCw0YbQuNC4LlxuICAgIHRoaXMuY29udHJvbC51cGRhdGVWaWV3UHJvamVjdGlvbigpXG5cbiAgICAvLyDQn9GA0LjQstGP0LfQutCwINC80LDRgtGA0LjRhtGLINGC0YDQsNC90YHRhNC+0YDQvNCw0YbQuNC4INC6INC/0LXRgNC10LzQtdC90L3QvtC5INGI0LXQudC00LXRgNCwLlxuICAgIHRoaXMuZ2wudW5pZm9ybU1hdHJpeDNmdih0aGlzLnZhcmlhYmxlc1sndV9tYXRyaXgnXSwgZmFsc2UsIHRoaXMudHJhbnNmb3JtLnZpZXdQcm9qZWN0aW9uTWF0KVxuXG4gICAgLy8g0JjRgtC10YDQuNGA0L7QstCw0L3QuNC1INC4INGA0LXQvdC00LXRgNC40L3QsyDQs9GA0YPQv9C/INCx0YPRhNC10YDQvtCyIFdlYkdMLlxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5idWZmZXJzLmFtb3VudE9mQnVmZmVyR3JvdXBzOyBpKyspIHtcblxuICAgICAgLy8g0KPRgdGC0LDQvdC+0LLQutCwINGC0LXQutGD0YnQtdCz0L4g0LHRg9GE0LXRgNCwINCy0LXRgNGI0LjQvSDQuCDQtdCz0L4g0L/RgNC40LLRj9C30LrQsCDQuiDQv9C10YDQtdC80LXQvdC90L7QuSDRiNC10LnQtNC10YDQsC5cbiAgICAgIHRoaXMuZ2wuYmluZEJ1ZmZlcih0aGlzLmdsLkFSUkFZX0JVRkZFUiwgdGhpcy5idWZmZXJzLnZlcnRleEJ1ZmZlcnNbaV0pXG4gICAgICB0aGlzLmdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KHRoaXMudmFyaWFibGVzWydhX3Bvc2l0aW9uJ10pXG4gICAgICB0aGlzLmdsLnZlcnRleEF0dHJpYlBvaW50ZXIodGhpcy52YXJpYWJsZXNbJ2FfcG9zaXRpb24nXSwgMiwgdGhpcy5nbC5GTE9BVCwgZmFsc2UsIDAsIDApXG5cbiAgICAgIC8vINCj0YHRgtCw0L3QvtCy0LrQsCDRgtC10LrRg9GJ0LXQs9C+INCx0YPRhNC10YDQsCDRhtCy0LXRgtC+0LIg0LLQtdGA0YjQuNC9INC4INC10LPQviDQv9GA0LjQstGP0LfQutCwINC6INC/0LXRgNC10LzQtdC90L3QvtC5INGI0LXQudC00LXRgNCwLlxuICAgICAgdGhpcy5nbC5iaW5kQnVmZmVyKHRoaXMuZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLmJ1ZmZlcnMuY29sb3JCdWZmZXJzW2ldKVxuICAgICAgdGhpcy5nbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheSh0aGlzLnZhcmlhYmxlc1snYV9jb2xvciddKVxuICAgICAgdGhpcy5nbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKHRoaXMudmFyaWFibGVzWydhX2NvbG9yJ10sIDEsIHRoaXMuZ2wuVU5TSUdORURfQllURSwgZmFsc2UsIDAsIDApXG5cbiAgICAgIC8vINCj0YHRgtCw0L3QvtCy0LrQsCDRgtC10LrRg9GJ0LXQs9C+INCx0YPRhNC10YDQsCDRgNCw0LfQvNC10YDQvtCyINCy0LXRgNGI0LjQvSDQuCDQtdCz0L4g0L/RgNC40LLRj9C30LrQsCDQuiDQv9C10YDQtdC80LXQvdC90L7QuSDRiNC10LnQtNC10YDQsC5cbiAgICAgIHRoaXMuZ2wuYmluZEJ1ZmZlcih0aGlzLmdsLkFSUkFZX0JVRkZFUiwgdGhpcy5idWZmZXJzLnNpemVCdWZmZXJzW2ldKVxuICAgICAgdGhpcy5nbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheSh0aGlzLnZhcmlhYmxlc1snYV9wb2x5Z29uc2l6ZSddKVxuICAgICAgdGhpcy5nbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKHRoaXMudmFyaWFibGVzWydhX3BvbHlnb25zaXplJ10sIDEsIHRoaXMuZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKVxuXG4gICAgICB0aGlzLmdsLmJpbmRCdWZmZXIodGhpcy5nbC5BUlJBWV9CVUZGRVIsIHRoaXMuYnVmZmVycy5zaGFwZUJ1ZmZlcnNbaV0pXG4gICAgICB0aGlzLmdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KHRoaXMudmFyaWFibGVzWydhX3NoYXBlJ10pXG4gICAgICB0aGlzLmdsLnZlcnRleEF0dHJpYlBvaW50ZXIodGhpcy52YXJpYWJsZXNbJ2Ffc2hhcGUnXSwgMSwgdGhpcy5nbC5VTlNJR05FRF9CWVRFLCBmYWxzZSwgMCwgMClcblxuICAgICAgdGhpcy5nbC5kcmF3QXJyYXlzKHRoaXMuZ2wuUE9JTlRTLCAwLCB0aGlzLmJ1ZmZlcnMuYW1vdW50T2ZHTFZlcnRpY2VzW2ldIC8gMylcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICog0JfQsNC/0YPRgdC60LDQtdGCINGA0LXQvdC00LXRgNC40L3QsyDQuCDQutC+0L3RgtGA0L7Qu9GMINGD0L/RgNCw0LLQu9C10L3QuNGPLlxuICAgKi9cbiAgcHVibGljIHJ1bigpOiB2b2lkIHtcblxuICAgIGlmICh0aGlzLmlzUnVubmluZykge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgdGhpcy5yZW5kZXIoKVxuICAgIHRoaXMuY29udHJvbC5ydW4oKVxuICAgIHRoaXMuaXNSdW5uaW5nID0gdHJ1ZVxuXG4gICAgaWYgKHRoaXMuZGVidWcuaXNFbmFibGUpIHtcbiAgICAgIHRoaXMuZGVidWcubG9nUmVuZGVyU3RhcnRlZCgpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqINCe0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdGCINGA0LXQvdC00LXRgNC40L3QsyDQuCDQutC+0L3RgtGA0L7Qu9GMINGD0L/RgNCw0LLQu9C10L3QuNGPLlxuICAgKi9cbiAgcHVibGljIHN0b3AoKTogdm9pZCB7XG5cbiAgICBpZiAoIXRoaXMuaXNSdW5uaW5nKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICB0aGlzLmNvbnRyb2wuc3RvcCgpXG4gICAgdGhpcy5pc1J1bm5pbmcgPSBmYWxzZVxuXG4gICAgaWYgKHRoaXMuZGVidWcuaXNFbmFibGUpIHtcbiAgICAgIHRoaXMuZGVidWcubG9nUmVuZGVyU3RvcGVkKClcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICog0J7Rh9C40YnQsNC10YIg0YTQvtC9LlxuICAgKi9cbiAgcHVibGljIGNsZWFyKCk6IHZvaWQge1xuXG4gICAgdGhpcy53ZWJHbC5jbGVhckJhY2tncm91bmQoKVxuXG4gICAgaWYgKHRoaXMuZGVidWcuaXNFbmFibGUpIHtcbiAgICAgIHRoaXMuZGVidWcubG9nQ2FudmFzQ2xlYXJlZCgpXG4gICAgfVxuICB9XG59XG4iLCJcbi8qKlxuICog0J/RgNC+0LLQtdGA0Y/QtdGCINGP0LLQu9GP0LXRgtGB0Y8g0LvQuCDQv9C10YDQtdC80LXQvdC90LDRjyDRjdC60LfQtdC80L/Qu9GP0YDQvtC8INC60LDQutC+0LPQvi3Qu9C40LHQvtC+INC60LvQsNGB0YHQsC5cbiAqXG4gKiBAcGFyYW0gdmFsIC0g0J/RgNC+0LLQtdGA0Y/QtdC80LDRjyDQv9C10YDQtdC80LXQvdC90LDRjy5cbiAqIEByZXR1cm5zINCg0LXQt9GD0LvRjNGC0LDRgiDQv9GA0L7QstC10YDQutC4LlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNPYmplY3Qob2JqOiBhbnkpOiBib29sZWFuIHtcbiAgcmV0dXJuIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgT2JqZWN0XScpXG59XG5cbi8qKlxuICog0J/QtdGA0LXQvtC/0YDQtdC00LXQu9GP0LXRgiDQt9C90LDRh9C10L3QuNGPINC/0L7Qu9C10Lkg0L7QsdGK0LXQutGC0LAgdGFyZ2V0INC90LAg0LfQvdCw0YfQtdC90LjRjyDQv9C+0LvQtdC5INC+0LHRitC10LrRgtCwIHNvdXJjZS4g0J/QtdGA0LXQvtC/0YDQtdC00LXQu9GP0Y7RgtGB0Y8g0YLQvtC70YzQutC+INGC0LUg0L/QvtC70Y8sXG4gKiDQutC+0YLQvtGA0YvQtSDRgdGD0YnQtdGB0YLQstGD0LXRjtGCINCyIHRhcmdldC4g0JXRgdC70Lgg0LIgc291cmNlINC10YHRgtGMINC/0L7Qu9GPLCDQutC+0YLQvtGA0YvRhSDQvdC10YIg0LIgdGFyZ2V0LCDRgtC+INC+0L3QuCDQuNCz0L3QvtGA0LjRgNGD0Y7RgtGB0Y8uINCV0YHQu9C4INC60LDQutC40LUt0YLQviDQv9C+0LvRj1xuICog0YHQsNC80Lgg0Y/QstC70Y/RjtGC0YHRjyDRj9Cy0LvRj9GO0YLRgdGPINC+0LHRitC10LrRgtCw0LzQuCwg0YLQviDRgtC+INC+0L3QuCDRgtCw0LrQttC1INGA0LXQutGD0YDRgdC40LLQvdC+INC60L7Qv9C40YDRg9GO0YLRgdGPICjQv9GA0Lgg0YLQvtC8INC20LUg0YPRgdC70L7QstC40LgsINGH0YLQviDQsiDRhtC10LvQtdC+0Lwg0L7QsdGK0LXQutGC0LVcbiAqINGB0YPRidC10YHRgtCy0YPRjtGCINC/0L7Qu9GPINC+0LHRitC10LrRgtCwLdC40YHRgtC+0YfQvdC40LrQsCkuXG4gKlxuICogQHBhcmFtIHRhcmdldCAtINCm0LXQu9C10LLQvtC5ICjQuNC30LzQtdC90Y/QtdC80YvQuSkg0L7QsdGK0LXQutGCLlxuICogQHBhcmFtIHNvdXJjZSAtINCe0LHRitC10LrRgiDRgSDQtNCw0L3QvdGL0LzQuCwg0LrQvtGC0L7RgNGL0LUg0L3Rg9C20L3QviDRg9GB0YLQsNC90L7QstC40YLRjCDRgyDRhtC10LvQtdCy0L7Qs9C+INC+0LHRitC10LrRgtCwLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY29weU1hdGNoaW5nS2V5VmFsdWVzKHRhcmdldDogYW55LCBzb3VyY2U6IGFueSk6IHZvaWQge1xuICBPYmplY3Qua2V5cyhzb3VyY2UpLmZvckVhY2goa2V5ID0+IHtcbiAgICBpZiAoa2V5IGluIHRhcmdldCkge1xuICAgICAgaWYgKGlzT2JqZWN0KHNvdXJjZVtrZXldKSkge1xuICAgICAgICBpZiAoaXNPYmplY3QodGFyZ2V0W2tleV0pKSB7XG4gICAgICAgICAgY29weU1hdGNoaW5nS2V5VmFsdWVzKHRhcmdldFtrZXldLCBzb3VyY2Vba2V5XSlcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCFpc09iamVjdCh0YXJnZXRba2V5XSkgJiYgKHR5cGVvZiB0YXJnZXRba2V5XSAhPT0gJ2Z1bmN0aW9uJykpIHtcbiAgICAgICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pXG59XG5cbi8qKlxuICog0JLQvtC30LLRgNCw0YnQsNC10YIg0YHQu9GD0YfQsNC50L3QvtC1INGG0LXQu9C+0LUg0YfQuNGB0LvQviDQsiDQtNC40LDQv9Cw0LfQvtC90LU6IFswLi4ucmFuZ2UtMV0uXG4gKlxuICogQHBhcmFtIHJhbmdlIC0g0JLQtdGA0YXQvdC40Lkg0L/RgNC10LTQtdC7INC00LjQsNC/0LDQt9C+0L3QsCDRgdC70YPRh9Cw0LnQvdC+0LPQviDQstGL0LHQvtGA0LAuXG4gKiBAcmV0dXJucyDQodC70YPRh9Cw0LnQvdC+0LUg0YfQuNGB0LvQvi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJhbmRvbUludChyYW5nZTogbnVtYmVyKTogbnVtYmVyIHtcbiAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHJhbmdlKVxufVxuXG4vKipcbiAqINCf0YDQtdC+0LHRgNCw0LfRg9C10YIg0L7QsdGK0LXQutGCINCyINGB0YLRgNC+0LrRgyBKU09OLiDQmNC80LXQtdGCINC+0YLQu9C40YfQuNC1INC+0YIg0YHRgtCw0L3QtNCw0YDRgtC90L7QuSDRhNGD0L3QutGG0LjQuCBKU09OLnN0cmluZ2lmeSAtINC/0L7Qu9GPINC+0LHRitC10LrRgtCwLCDQuNC80LXRjtGJ0LjQtVxuICog0LfQvdCw0YfQtdC90LjRjyDRhNGD0L3QutGG0LjQuSDQvdC1INC/0YDQvtC/0YPRgdC60LDRjtGC0YHRjywg0LAg0L/RgNC10L7QsdGA0LDQt9GD0Y7RgtGB0Y8g0LIg0L3QsNC30LLQsNC90LjQtSDRhNGD0L3QutGG0LjQuC5cbiAqXG4gKiBAcGFyYW0gb2JqIC0g0KbQtdC70LXQstC+0Lkg0L7QsdGK0LXQutGCLlxuICogQHJldHVybnMg0KHRgtGA0L7QutCwIEpTT04sINC+0YLQvtCx0YDQsNC20LDRjtGJ0LDRjyDQvtCx0YrQtdC60YIuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBqc29uU3RyaW5naWZ5KG9iajogYW55KTogc3RyaW5nIHtcbiAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KFxuICAgIG9iaixcbiAgICBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgcmV0dXJuICh0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpID8gdmFsdWUubmFtZSA6IHZhbHVlXG4gICAgfSxcbiAgICAnICdcbiAgKVxufVxuXG4vKipcbiAqINCh0LvRg9GH0LDQudC90YvQvCDQvtCx0YDQsNC30L7QvCDQstC+0LfQstGA0LDRidCw0LXRgiDQvtC00LjQvSDQuNC3INC40L3QtNC10LrRgdC+0LIg0YfQuNGB0LvQvtCy0L7Qs9C+INC+0LTQvdC+0LzQtdGA0L3QvtCz0L4g0LzQsNGB0YHQuNCy0LAuINCd0LXRgdC80L7RgtGA0Y8g0L3QsCDRgdC70YPRh9Cw0LnQvdC+0YHRgtGMINC60LDQttC00L7Qs9C+XG4gKiDQutC+0L3QutGA0LXRgtC90L7Qs9C+INCy0YvQt9C+0LLQsCDRhNGD0L3QutGG0LjQuCwg0LjQvdC00LXQutGB0Ysg0LLQvtC30LLRgNCw0YnQsNGO0YLRgdGPINGBINC/0YDQtdC00L7Qv9GA0LXQtNC10LvQtdC90L3QvtC5INGH0LDRgdGC0L7RgtC+0LkuINCn0LDRgdGC0L7RgtCwIFwi0LLRi9C/0LDQtNCw0L3QuNC5XCIg0LjQvdC00LXQutGB0L7QsiDQt9Cw0LTQsNC10YLRgdGPXG4gKiDRgdC+0L7RgtCy0LXRgtGB0YLQstGD0Y7RidC40LzQuCDQt9C90LDRh9C10L3QuNGP0LzQuCDRjdC70LXQvNC10L3RgtC+0LIuXG4gKlxuICogQHJlbWFya3NcbiAqINCf0YDQuNC80LXRgDog0J3QsCDQvNCw0YHRgdC40LLQtSBbMywgMiwgNV0g0YTRg9C90LrRhtC40Y8g0LHRg9C00LXRgiDQstC+0LfQstGA0LDRidCw0YLRjCDQuNC90LTQtdC60YEgMCDRgSDRh9Cw0YHRgtC+0YLQvtC5ID0gMy8oMysyKzUpID0gMy8xMCwg0LjQvdC00LXQutGBIDEg0YEg0YfQsNGB0YLQvtGC0L7QuSA9XG4gKiAyLygzKzIrNSkgPSAyLzEwLCDQuNC90LTQtdC60YEgMiDRgSDRh9Cw0YHRgtC+0YLQvtC5ID0gNS8oMysyKzUpID0gNS8xMC5cbiAqXG4gKiBAcGFyYW0gYXJyIC0g0KfQuNGB0LvQvtCy0L7QuSDQvtC00L3QvtC80LXRgNC90YvQuSDQvNCw0YHRgdC40LIsINC40L3QtNC10LrRgdGLINC60L7RgtC+0YDQvtCz0L4g0LHRg9C00YPRgiDQstC+0LfQstGA0LDRidCw0YLRjNGB0Y8g0YEg0L/RgNC10LTQvtC/0YDQtdC00LXQu9C10L3QvdC+0Lkg0YfQsNGB0YLQvtGC0L7QuS5cbiAqIEByZXR1cm5zINCh0LvRg9GH0LDQudC90YvQuSDQuNC90LTQtdC60YEg0LjQtyDQvNCw0YHRgdC40LLQsCBhcnIuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByYW5kb21RdW90YUluZGV4KGFycjogbnVtYmVyW10pOiBudW1iZXIge1xuXG4gIGxldCBhOiBudW1iZXJbXSA9IFtdXG4gIGFbMF0gPSBhcnJbMF1cblxuICBmb3IgKGxldCBpID0gMTsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xuICAgIGFbaV0gPSBhW2kgLSAxXSArIGFycltpXVxuICB9XG5cbiAgY29uc3QgbGFzdEluZGV4OiBudW1iZXIgPSBhLmxlbmd0aCAtIDFcblxuICBsZXQgcjogbnVtYmVyID0gTWF0aC5mbG9vcigoTWF0aC5yYW5kb20oKSAqIGFbbGFzdEluZGV4XSkpICsgMVxuICBsZXQgbDogbnVtYmVyID0gMFxuICBsZXQgaDogbnVtYmVyID0gbGFzdEluZGV4XG5cbiAgd2hpbGUgKGwgPCBoKSB7XG4gICAgY29uc3QgbTogbnVtYmVyID0gbCArICgoaCAtIGwpID4+IDEpO1xuICAgIChyID4gYVttXSkgPyAobCA9IG0gKyAxKSA6IChoID0gbSlcbiAgfVxuXG4gIHJldHVybiAoYVtsXSA+PSByKSA/IGwgOiAtMVxufVxuXG5cbi8qKlxuICog0JrQvtC90LLQtdGA0YLQuNGA0YPQtdGCINGG0LLQtdGCINC40LcgSEVYLdC/0YDQtdC00YHRgtCw0LLQu9C10L3QuNGPINCyINC/0YDQtdC00YHRgtCw0LLQu9C10L3QuNC1INGG0LLQtdGC0LAg0LTQu9GPIEdMU0wt0LrQvtC00LAgKFJHQiDRgSDQtNC40LDQv9Cw0LfQvtC90LDQvNC4INC30L3QsNGH0LXQvdC40Lkg0L7RgiAwINC00L4gMSkuXG4gKlxuICogQHBhcmFtIGhleENvbG9yIC0g0KbQstC10YIg0LIgSEVYLdGE0L7RgNC80LDRgtC1LlxuICogQHJldHVybnMg0JzQsNGB0YHQuNCyINC40Lcg0YLRgNC10YUg0YfQuNGB0LXQuyDQsiDQtNC40LDQv9Cw0LfQvtC90LUg0L7RgiAwINC00L4gMS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbG9yRnJvbUhleFRvR2xSZ2IoaGV4Q29sb3I6IHN0cmluZyk6IG51bWJlcltdIHtcblxuICBsZXQgayA9IC9eIz8oW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkkL2kuZXhlYyhoZXhDb2xvcilcbiAgbGV0IFtyLCBnLCBiXSA9IFtwYXJzZUludChrIVsxXSwgMTYpIC8gMjU1LCBwYXJzZUludChrIVsyXSwgMTYpIC8gMjU1LCBwYXJzZUludChrIVszXSwgMTYpIC8gMjU1XVxuXG4gIHJldHVybiBbciwgZywgYl1cbn1cblxuLyoqXG4gKiDQktGL0YfQuNGB0LvRj9C10YIg0YLQtdC60YPRidC10LUg0LLRgNC10LzRjy5cbiAqXG4gKiBAcmV0dXJucyDQodGC0YDQvtC60L7QstCw0Y8g0YTQvtGA0LzQsNGC0LjRgNC+0LLQsNC90L3QsNGPINC30LDQv9C40YHRjCDRgtC10LrRg9GJ0LXQs9C+INCy0YDQtdC80LXQvdC4LiDQpNC+0YDQvNCw0YI6IGhoOm1tOnNzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRDdXJyZW50VGltZSgpOiBzdHJpbmcge1xuXG4gIGxldCB0b2RheSA9IG5ldyBEYXRlKCk7XG5cbiAgbGV0IHRpbWUgPVxuICAgICgodG9kYXkuZ2V0SG91cnMoKSA8IDEwID8gJzAnIDogJycpICsgdG9kYXkuZ2V0SG91cnMoKSkgKyBcIjpcIiArXG4gICAgKCh0b2RheS5nZXRNaW51dGVzKCkgPCAxMCA/ICcwJyA6ICcnKSArIHRvZGF5LmdldE1pbnV0ZXMoKSkgKyBcIjpcIiArXG4gICAgKCh0b2RheS5nZXRTZWNvbmRzKCkgPCAxMCA/ICcwJyA6ICcnKSArIHRvZGF5LmdldFNlY29uZHMoKSlcblxuICByZXR1cm4gdGltZVxufVxuIiwiLypcbiAqIENvcHlyaWdodCAyMDIxIEdGWEZ1bmRhbWVudGFscy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogUmVkaXN0cmlidXRpb24gYW5kIHVzZSBpbiBzb3VyY2UgYW5kIGJpbmFyeSBmb3Jtcywgd2l0aCBvciB3aXRob3V0XG4gKiBtb2RpZmljYXRpb24sIGFyZSBwZXJtaXR0ZWQgcHJvdmlkZWQgdGhhdCB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnMgYXJlXG4gKiBtZXQ6XG4gKlxuICogICAgICogUmVkaXN0cmlidXRpb25zIG9mIHNvdXJjZSBjb2RlIG11c3QgcmV0YWluIHRoZSBhYm92ZSBjb3B5cmlnaHRcbiAqIG5vdGljZSwgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lci5cbiAqICAgICAqIFJlZGlzdHJpYnV0aW9ucyBpbiBiaW5hcnkgZm9ybSBtdXN0IHJlcHJvZHVjZSB0aGUgYWJvdmVcbiAqIGNvcHlyaWdodCBub3RpY2UsIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXJcbiAqIGluIHRoZSBkb2N1bWVudGF0aW9uIGFuZC9vciBvdGhlciBtYXRlcmlhbHMgcHJvdmlkZWQgd2l0aCB0aGVcbiAqIGRpc3RyaWJ1dGlvbi5cbiAqICAgICAqIE5laXRoZXIgdGhlIG5hbWUgb2YgR0ZYRnVuZGFtZW50YWxzLiBub3IgdGhlIG5hbWVzIG9mIGhpc1xuICogY29udHJpYnV0b3JzIG1heSBiZSB1c2VkIHRvIGVuZG9yc2Ugb3IgcHJvbW90ZSBwcm9kdWN0cyBkZXJpdmVkIGZyb21cbiAqIHRoaXMgc29mdHdhcmUgd2l0aG91dCBzcGVjaWZpYyBwcmlvciB3cml0dGVuIHBlcm1pc3Npb24uXG4gKlxuICogVEhJUyBTT0ZUV0FSRSBJUyBQUk9WSURFRCBCWSBUSEUgQ09QWVJJR0hUIEhPTERFUlMgQU5EIENPTlRSSUJVVE9SU1xuICogXCJBUyBJU1wiIEFORCBBTlkgRVhQUkVTUyBPUiBJTVBMSUVEIFdBUlJBTlRJRVMsIElOQ0xVRElORywgQlVUIE5PVFxuICogTElNSVRFRCBUTywgVEhFIElNUExJRUQgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFkgQU5EIEZJVE5FU1MgRk9SXG4gKiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBUkUgRElTQ0xBSU1FRC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIENPUFlSSUdIVFxuICogT1dORVIgT1IgQ09OVFJJQlVUT1JTIEJFIExJQUJMRSBGT1IgQU5ZIERJUkVDVCwgSU5ESVJFQ1QsIElOQ0lERU5UQUwsXG4gKiBTUEVDSUFMLCBFWEVNUExBUlksIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyAoSU5DTFVESU5HLCBCVVQgTk9UXG4gKiBMSU1JVEVEIFRPLCBQUk9DVVJFTUVOVCBPRiBTVUJTVElUVVRFIEdPT0RTIE9SIFNFUlZJQ0VTOyBMT1NTIE9GIFVTRSxcbiAqIERBVEEsIE9SIFBST0ZJVFM7IE9SIEJVU0lORVNTIElOVEVSUlVQVElPTikgSE9XRVZFUiBDQVVTRUQgQU5EIE9OIEFOWVxuICogVEhFT1JZIE9GIExJQUJJTElUWSwgV0hFVEhFUiBJTiBDT05UUkFDVCwgU1RSSUNUIExJQUJJTElUWSwgT1IgVE9SVFxuICogKElOQ0xVRElORyBORUdMSUdFTkNFIE9SIE9USEVSV0lTRSkgQVJJU0lORyBJTiBBTlkgV0FZIE9VVCBPRiBUSEUgVVNFXG4gKiBPRiBUSElTIFNPRlRXQVJFLCBFVkVOIElGIEFEVklTRUQgT0YgVEhFIFBPU1NJQklMSVRZIE9GIFNVQ0ggREFNQUdFLlxuICovXG5cbi8qKlxuICogVmFyaW91cyAyZCBtYXRoIGZ1bmN0aW9ucy5cbiAqXG4gKiBAbW9kdWxlIHdlYmdsLTJkLW1hdGhcbiAqL1xuKGZ1bmN0aW9uKHJvb3QsIGZhY3RvcnkpIHsgIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIC8vIEFNRC4gUmVnaXN0ZXIgYXMgYW4gYW5vbnltb3VzIG1vZHVsZS5cbiAgICBkZWZpbmUoW10sIGZhY3RvcnkpO1xuICB9IGVsc2Uge1xuICAgIC8vIEJyb3dzZXIgZ2xvYmFsc1xuICAgIHJvb3QubTMgPSBmYWN0b3J5KCk7XG4gIH1cbn0odGhpcywgZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIC8qKlxuICAgKiBBbiBhcnJheSBvciB0eXBlZCBhcnJheSB3aXRoIDkgdmFsdWVzLlxuICAgKiBAdHlwZWRlZiB7bnVtYmVyW118VHlwZWRBcnJheX0gTWF0cml4M1xuICAgKiBAbWVtYmVyT2YgbW9kdWxlOndlYmdsLTJkLW1hdGhcbiAgICovXG5cbiAgLyoqXG4gICAqIFRha2VzIHR3byBNYXRyaXgzcywgYSBhbmQgYiwgYW5kIGNvbXB1dGVzIHRoZSBwcm9kdWN0IGluIHRoZSBvcmRlclxuICAgKiB0aGF0IHByZS1jb21wb3NlcyBiIHdpdGggYS4gIEluIG90aGVyIHdvcmRzLCB0aGUgbWF0cml4IHJldHVybmVkIHdpbGxcbiAgICogQHBhcmFtIHttb2R1bGU6d2ViZ2wtMmQtbWF0aC5NYXRyaXgzfSBhIEEgbWF0cml4LlxuICAgKiBAcGFyYW0ge21vZHVsZTp3ZWJnbC0yZC1tYXRoLk1hdHJpeDN9IGIgQSBtYXRyaXguXG4gICAqIEByZXR1cm4ge21vZHVsZTp3ZWJnbC0yZC1tYXRoLk1hdHJpeDN9IHRoZSByZXN1bHQuXG4gICAqIEBtZW1iZXJPZiBtb2R1bGU6d2ViZ2wtMmQtbWF0aFxuICAgKi9cbiAgZnVuY3Rpb24gbXVsdGlwbHkoYSwgYikge1xuICAgIHZhciBhMDAgPSBhWzAgKiAzICsgMF07XG4gICAgdmFyIGEwMSA9IGFbMCAqIDMgKyAxXTtcbiAgICB2YXIgYTAyID0gYVswICogMyArIDJdO1xuICAgIHZhciBhMTAgPSBhWzEgKiAzICsgMF07XG4gICAgdmFyIGExMSA9IGFbMSAqIDMgKyAxXTtcbiAgICB2YXIgYTEyID0gYVsxICogMyArIDJdO1xuICAgIHZhciBhMjAgPSBhWzIgKiAzICsgMF07XG4gICAgdmFyIGEyMSA9IGFbMiAqIDMgKyAxXTtcbiAgICB2YXIgYTIyID0gYVsyICogMyArIDJdO1xuICAgIHZhciBiMDAgPSBiWzAgKiAzICsgMF07XG4gICAgdmFyIGIwMSA9IGJbMCAqIDMgKyAxXTtcbiAgICB2YXIgYjAyID0gYlswICogMyArIDJdO1xuICAgIHZhciBiMTAgPSBiWzEgKiAzICsgMF07XG4gICAgdmFyIGIxMSA9IGJbMSAqIDMgKyAxXTtcbiAgICB2YXIgYjEyID0gYlsxICogMyArIDJdO1xuICAgIHZhciBiMjAgPSBiWzIgKiAzICsgMF07XG4gICAgdmFyIGIyMSA9IGJbMiAqIDMgKyAxXTtcbiAgICB2YXIgYjIyID0gYlsyICogMyArIDJdO1xuXG4gICAgcmV0dXJuIFtcbiAgICAgIGIwMCAqIGEwMCArIGIwMSAqIGExMCArIGIwMiAqIGEyMCxcbiAgICAgIGIwMCAqIGEwMSArIGIwMSAqIGExMSArIGIwMiAqIGEyMSxcbiAgICAgIGIwMCAqIGEwMiArIGIwMSAqIGExMiArIGIwMiAqIGEyMixcbiAgICAgIGIxMCAqIGEwMCArIGIxMSAqIGExMCArIGIxMiAqIGEyMCxcbiAgICAgIGIxMCAqIGEwMSArIGIxMSAqIGExMSArIGIxMiAqIGEyMSxcbiAgICAgIGIxMCAqIGEwMiArIGIxMSAqIGExMiArIGIxMiAqIGEyMixcbiAgICAgIGIyMCAqIGEwMCArIGIyMSAqIGExMCArIGIyMiAqIGEyMCxcbiAgICAgIGIyMCAqIGEwMSArIGIyMSAqIGExMSArIGIyMiAqIGEyMSxcbiAgICAgIGIyMCAqIGEwMiArIGIyMSAqIGExMiArIGIyMiAqIGEyMixcbiAgICBdO1xuICB9XG5cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIDN4MyBpZGVudGl0eSBtYXRyaXhcbiAgICogQHJldHVybiB7bW9kdWxlOndlYmdsMi0yZC1tYXRoLk1hdHJpeDN9IGFuIGlkZW50aXR5IG1hdHJpeFxuICAgKi9cbiAgZnVuY3Rpb24gaWRlbnRpdHkoKSB7XG4gICAgcmV0dXJuIFtcbiAgICAgIDEsIDAsIDAsXG4gICAgICAwLCAxLCAwLFxuICAgICAgMCwgMCwgMSxcbiAgICBdO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSAyRCBwcm9qZWN0aW9uIG1hdHJpeFxuICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGggd2lkdGggaW4gcGl4ZWxzXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHQgaGVpZ2h0IGluIHBpeGVsc1xuICAgKiBAcmV0dXJuIHttb2R1bGU6d2ViZ2wtMmQtbWF0aC5NYXRyaXgzfSBhIHByb2plY3Rpb24gbWF0cml4IHRoYXQgY29udmVydHMgZnJvbSBwaXhlbHMgdG8gY2xpcHNwYWNlIHdpdGggWSA9IDAgYXQgdGhlIHRvcC5cbiAgICogQG1lbWJlck9mIG1vZHVsZTp3ZWJnbC0yZC1tYXRoXG4gICAqL1xuICBmdW5jdGlvbiBwcm9qZWN0aW9uKHdpZHRoLCBoZWlnaHQpIHtcbiAgICAvLyBOb3RlOiBUaGlzIG1hdHJpeCBmbGlwcyB0aGUgWSBheGlzIHNvIDAgaXMgYXQgdGhlIHRvcC5cbiAgICByZXR1cm4gW1xuICAgICAgMiAvIHdpZHRoLCAwLCAwLFxuICAgICAgMCwgLTIgLyBoZWlnaHQsIDAsXG4gICAgICAtMSwgMSwgMSxcbiAgICBdO1xuICB9XG5cbiAgLyoqXG4gICAqIE11bHRpcGxpZXMgYnkgYSAyRCBwcm9qZWN0aW9uIG1hdHJpeFxuICAgKiBAcGFyYW0ge21vZHVsZTp3ZWJnbC0yZC1tYXRoLk1hdHJpeDN9IHRoZSBtYXRyaXggdG8gYmUgbXVsdGlwbGllZFxuICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGggd2lkdGggaW4gcGl4ZWxzXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHQgaGVpZ2h0IGluIHBpeGVsc1xuICAgKiBAcmV0dXJuIHttb2R1bGU6d2ViZ2wtMmQtbWF0aC5NYXRyaXgzfSB0aGUgcmVzdWx0XG4gICAqIEBtZW1iZXJPZiBtb2R1bGU6d2ViZ2wtMmQtbWF0aFxuICAgKi9cbiAgZnVuY3Rpb24gcHJvamVjdChtLCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgcmV0dXJuIG11bHRpcGx5KG0sIHByb2plY3Rpb24od2lkdGgsIGhlaWdodCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSAyRCB0cmFuc2xhdGlvbiBtYXRyaXhcbiAgICogQHBhcmFtIHtudW1iZXJ9IHR4IGFtb3VudCB0byB0cmFuc2xhdGUgaW4geFxuICAgKiBAcGFyYW0ge251bWJlcn0gdHkgYW1vdW50IHRvIHRyYW5zbGF0ZSBpbiB5XG4gICAqIEByZXR1cm4ge21vZHVsZTp3ZWJnbC0yZC1tYXRoLk1hdHJpeDN9IGEgdHJhbnNsYXRpb24gbWF0cml4IHRoYXQgdHJhbnNsYXRlcyBieSB0eCBhbmQgdHkuXG4gICAqIEBtZW1iZXJPZiBtb2R1bGU6d2ViZ2wtMmQtbWF0aFxuICAgKi9cbiAgZnVuY3Rpb24gdHJhbnNsYXRpb24odHgsIHR5KSB7XG4gICAgcmV0dXJuIFtcbiAgICAgIDEsIDAsIDAsXG4gICAgICAwLCAxLCAwLFxuICAgICAgdHgsIHR5LCAxLFxuICAgIF07XG4gIH1cblxuICAvKipcbiAgICogTXVsdGlwbGllcyBieSBhIDJEIHRyYW5zbGF0aW9uIG1hdHJpeFxuICAgKiBAcGFyYW0ge21vZHVsZTp3ZWJnbC0yZC1tYXRoLk1hdHJpeDN9IHRoZSBtYXRyaXggdG8gYmUgbXVsdGlwbGllZFxuICAgKiBAcGFyYW0ge251bWJlcn0gdHggYW1vdW50IHRvIHRyYW5zbGF0ZSBpbiB4XG4gICAqIEBwYXJhbSB7bnVtYmVyfSB0eSBhbW91bnQgdG8gdHJhbnNsYXRlIGluIHlcbiAgICogQHJldHVybiB7bW9kdWxlOndlYmdsLTJkLW1hdGguTWF0cml4M30gdGhlIHJlc3VsdFxuICAgKiBAbWVtYmVyT2YgbW9kdWxlOndlYmdsLTJkLW1hdGhcbiAgICovXG4gIGZ1bmN0aW9uIHRyYW5zbGF0ZShtLCB0eCwgdHkpIHtcbiAgICByZXR1cm4gbXVsdGlwbHkobSwgdHJhbnNsYXRpb24odHgsIHR5KSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIDJEIHJvdGF0aW9uIG1hdHJpeFxuICAgKiBAcGFyYW0ge251bWJlcn0gYW5nbGVJblJhZGlhbnMgYW1vdW50IHRvIHJvdGF0ZSBpbiByYWRpYW5zXG4gICAqIEByZXR1cm4ge21vZHVsZTp3ZWJnbC0yZC1tYXRoLk1hdHJpeDN9IGEgcm90YXRpb24gbWF0cml4IHRoYXQgcm90YXRlcyBieSBhbmdsZUluUmFkaWFuc1xuICAgKiBAbWVtYmVyT2YgbW9kdWxlOndlYmdsLTJkLW1hdGhcbiAgICovXG4gIGZ1bmN0aW9uIHJvdGF0aW9uKGFuZ2xlSW5SYWRpYW5zKSB7XG4gICAgdmFyIGMgPSBNYXRoLmNvcyhhbmdsZUluUmFkaWFucyk7XG4gICAgdmFyIHMgPSBNYXRoLnNpbihhbmdsZUluUmFkaWFucyk7XG4gICAgcmV0dXJuIFtcbiAgICAgIGMsIC1zLCAwLFxuICAgICAgcywgYywgMCxcbiAgICAgIDAsIDAsIDEsXG4gICAgXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNdWx0aXBsaWVzIGJ5IGEgMkQgcm90YXRpb24gbWF0cml4XG4gICAqIEBwYXJhbSB7bW9kdWxlOndlYmdsLTJkLW1hdGguTWF0cml4M30gdGhlIG1hdHJpeCB0byBiZSBtdWx0aXBsaWVkXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBhbmdsZUluUmFkaWFucyBhbW91bnQgdG8gcm90YXRlIGluIHJhZGlhbnNcbiAgICogQHJldHVybiB7bW9kdWxlOndlYmdsLTJkLW1hdGguTWF0cml4M30gdGhlIHJlc3VsdFxuICAgKiBAbWVtYmVyT2YgbW9kdWxlOndlYmdsLTJkLW1hdGhcbiAgICovXG4gIGZ1bmN0aW9uIHJvdGF0ZShtLCBhbmdsZUluUmFkaWFucykge1xuICAgIHJldHVybiBtdWx0aXBseShtLCByb3RhdGlvbihhbmdsZUluUmFkaWFucykpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSAyRCBzY2FsaW5nIG1hdHJpeFxuICAgKiBAcGFyYW0ge251bWJlcn0gc3ggYW1vdW50IHRvIHNjYWxlIGluIHhcbiAgICogQHBhcmFtIHtudW1iZXJ9IHN5IGFtb3VudCB0byBzY2FsZSBpbiB5XG4gICAqIEByZXR1cm4ge21vZHVsZTp3ZWJnbC0yZC1tYXRoLk1hdHJpeDN9IGEgc2NhbGUgbWF0cml4IHRoYXQgc2NhbGVzIGJ5IHN4IGFuZCBzeS5cbiAgICogQG1lbWJlck9mIG1vZHVsZTp3ZWJnbC0yZC1tYXRoXG4gICAqL1xuICBmdW5jdGlvbiBzY2FsaW5nKHN4LCBzeSkge1xuICAgIHJldHVybiBbXG4gICAgICBzeCwgMCwgMCxcbiAgICAgIDAsIHN5LCAwLFxuICAgICAgMCwgMCwgMSxcbiAgICBdO1xuICB9XG5cbiAgLyoqXG4gICAqIE11bHRpcGxpZXMgYnkgYSAyRCBzY2FsaW5nIG1hdHJpeFxuICAgKiBAcGFyYW0ge21vZHVsZTp3ZWJnbC0yZC1tYXRoLk1hdHJpeDN9IHRoZSBtYXRyaXggdG8gYmUgbXVsdGlwbGllZFxuICAgKiBAcGFyYW0ge251bWJlcn0gc3ggYW1vdW50IHRvIHNjYWxlIGluIHhcbiAgICogQHBhcmFtIHtudW1iZXJ9IHN5IGFtb3VudCB0byBzY2FsZSBpbiB5XG4gICAqIEByZXR1cm4ge21vZHVsZTp3ZWJnbC0yZC1tYXRoLk1hdHJpeDN9IHRoZSByZXN1bHRcbiAgICogQG1lbWJlck9mIG1vZHVsZTp3ZWJnbC0yZC1tYXRoXG4gICAqL1xuICBmdW5jdGlvbiBzY2FsZShtLCBzeCwgc3kpIHtcbiAgICByZXR1cm4gbXVsdGlwbHkobSwgc2NhbGluZyhzeCwgc3kpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRvdCh4MSwgeTEsIHgyLCB5Mikge1xuICAgIHJldHVybiB4MSAqIHgyICsgeTEgKiB5MjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRpc3RhbmNlKHgxLCB5MSwgeDIsIHkyKSB7XG4gICAgdmFyIGR4ID0geDEgLSB4MjtcbiAgICB2YXIgZHkgPSB5MSAtIHkyO1xuICAgIHJldHVybiBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xuICB9XG5cbiAgZnVuY3Rpb24gbm9ybWFsaXplKHgsIHkpIHtcbiAgICB2YXIgbCA9IGRpc3RhbmNlKDAsIDAsIHgsIHkpO1xuICAgIGlmIChsID4gMC4wMDAwMSkge1xuICAgICAgcmV0dXJuIFt4IC8gbCwgeSAvIGxdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gWzAsIDBdO1xuICAgIH1cbiAgfVxuXG4gIC8vIGkgPSBpbmNpZGVudFxuICAvLyBuID0gbm9ybWFsXG4gIGZ1bmN0aW9uIHJlZmxlY3QoaXgsIGl5LCBueCwgbnkpIHtcbiAgICAvLyBJIC0gMi4wICogZG90KE4sIEkpICogTi5cbiAgICB2YXIgZCA9IGRvdChueCwgbnksIGl4LCBpeSk7XG4gICAgcmV0dXJuIFtcbiAgICAgIGl4IC0gMiAqIGQgKiBueCxcbiAgICAgIGl5IC0gMiAqIGQgKiBueSxcbiAgICBdO1xuICB9XG5cbiAgZnVuY3Rpb24gcmFkVG9EZWcocikge1xuICAgIHJldHVybiByICogMTgwIC8gTWF0aC5QSTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRlZ1RvUmFkKGQpIHtcbiAgICByZXR1cm4gZCAqIE1hdGguUEkgLyAxODA7XG4gIH1cblxuICBmdW5jdGlvbiB0cmFuc2Zvcm1Qb2ludChtLCB2KSB7XG4gICAgdmFyIHYwID0gdlswXTtcbiAgICB2YXIgdjEgPSB2WzFdO1xuICAgIHZhciBkID0gdjAgKiBtWzAgKiAzICsgMl0gKyB2MSAqIG1bMSAqIDMgKyAyXSArIG1bMiAqIDMgKyAyXTtcbiAgICByZXR1cm4gW1xuICAgICAgKHYwICogbVswICogMyArIDBdICsgdjEgKiBtWzEgKiAzICsgMF0gKyBtWzIgKiAzICsgMF0pIC8gZCxcbiAgICAgICh2MCAqIG1bMCAqIDMgKyAxXSArIHYxICogbVsxICogMyArIDFdICsgbVsyICogMyArIDFdKSAvIGQsXG4gICAgXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGludmVyc2UobSkge1xuICAgIHZhciB0MDAgPSBtWzEgKiAzICsgMV0gKiBtWzIgKiAzICsgMl0gLSBtWzEgKiAzICsgMl0gKiBtWzIgKiAzICsgMV07XG4gICAgdmFyIHQxMCA9IG1bMCAqIDMgKyAxXSAqIG1bMiAqIDMgKyAyXSAtIG1bMCAqIDMgKyAyXSAqIG1bMiAqIDMgKyAxXTtcbiAgICB2YXIgdDIwID0gbVswICogMyArIDFdICogbVsxICogMyArIDJdIC0gbVswICogMyArIDJdICogbVsxICogMyArIDFdO1xuICAgIHZhciBkID0gMS4wIC8gKG1bMCAqIDMgKyAwXSAqIHQwMCAtIG1bMSAqIDMgKyAwXSAqIHQxMCArIG1bMiAqIDMgKyAwXSAqIHQyMCk7XG4gICAgcmV0dXJuIFtcbiAgICAgICBkICogdDAwLCAtZCAqIHQxMCwgZCAqIHQyMCxcbiAgICAgIC1kICogKG1bMSAqIDMgKyAwXSAqIG1bMiAqIDMgKyAyXSAtIG1bMSAqIDMgKyAyXSAqIG1bMiAqIDMgKyAwXSksXG4gICAgICAgZCAqIChtWzAgKiAzICsgMF0gKiBtWzIgKiAzICsgMl0gLSBtWzAgKiAzICsgMl0gKiBtWzIgKiAzICsgMF0pLFxuICAgICAgLWQgKiAobVswICogMyArIDBdICogbVsxICogMyArIDJdIC0gbVswICogMyArIDJdICogbVsxICogMyArIDBdKSxcbiAgICAgICBkICogKG1bMSAqIDMgKyAwXSAqIG1bMiAqIDMgKyAxXSAtIG1bMSAqIDMgKyAxXSAqIG1bMiAqIDMgKyAwXSksXG4gICAgICAtZCAqIChtWzAgKiAzICsgMF0gKiBtWzIgKiAzICsgMV0gLSBtWzAgKiAzICsgMV0gKiBtWzIgKiAzICsgMF0pLFxuICAgICAgIGQgKiAobVswICogMyArIDBdICogbVsxICogMyArIDFdIC0gbVswICogMyArIDFdICogbVsxICogMyArIDBdKSxcbiAgICBdO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBkZWdUb1JhZDogZGVnVG9SYWQsXG4gICAgZGlzdGFuY2U6IGRpc3RhbmNlLFxuICAgIGRvdDogZG90LFxuICAgIGlkZW50aXR5OiBpZGVudGl0eSxcbiAgICBpbnZlcnNlOiBpbnZlcnNlLFxuICAgIG11bHRpcGx5OiBtdWx0aXBseSxcbiAgICBub3JtYWxpemU6IG5vcm1hbGl6ZSxcbiAgICBwcm9qZWN0aW9uOiBwcm9qZWN0aW9uLFxuICAgIHJhZFRvRGVnOiByYWRUb0RlZyxcbiAgICByZWZsZWN0OiByZWZsZWN0LFxuICAgIHJvdGF0aW9uOiByb3RhdGlvbixcbiAgICByb3RhdGU6IHJvdGF0ZSxcbiAgICBzY2FsaW5nOiBzY2FsaW5nLFxuICAgIHNjYWxlOiBzY2FsZSxcbiAgICB0cmFuc2Zvcm1Qb2ludDogdHJhbnNmb3JtUG9pbnQsXG4gICAgdHJhbnNsYXRpb246IHRyYW5zbGF0aW9uLFxuICAgIHRyYW5zbGF0ZTogdHJhbnNsYXRlLFxuICAgIHByb2plY3Q6IHByb2plY3QsXG4gIH07XG5cbn0pKTtcblxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vaW5kZXgudHNcIik7XG4iXSwic291cmNlUm9vdCI6IiJ9