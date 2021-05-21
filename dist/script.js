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
    function SPlotContol(splot) {
        this.splot = splot;
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
    SPlotContol.prototype.setup = function (splot) {
        this.splot.camera = splot.camera;
    };
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
        var projectionMat = m3_1.default.projection(this.splot.canvas.width, this.splot.canvas.height);
        var cameraMat = this.makeCameraMatrix();
        var viewMat = m3_1.default.inverse(cameraMat);
        this.transform.viewProjectionMat = m3_1.default.multiply(projectionMat, viewMat);
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
        var pos = m3_1.default.transformPoint(this.transform.startInvViewProjMat, this.getClipSpaceMousePosition(event));
        this.splot.camera.x =
            this.transform.startCamera.x + this.transform.startPos[0] - pos[0];
        this.splot.camera.y =
            this.transform.startCamera.y + this.transform.startPos[1] - pos[1];
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
        this.transform.startInvViewProjMat = m3_1.default.inverse(this.transform.viewProjectionMat);
        this.transform.startCamera = Object.assign({}, this.splot.camera);
        this.transform.startClipPos = this.getClipSpaceMousePosition.call(this, event);
        this.transform.startPos = m3_1.default.transformPoint(this.transform.startInvViewProjMat, this.transform.startClipPos);
        this.transform.startMousePos = [event.clientX, event.clientY];
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
        var _b = m3_1.default.transformPoint(m3_1.default.inverse(this.transform.viewProjectionMat), [clipX, clipY]), preZoomX = _b[0], preZoomY = _b[1];
        // multiply the wheel movement by the current zoom level, so we zoom less when zoomed in and more when zoomed out
        var newZoom = this.splot.camera.zoom * Math.pow(2, event.deltaY * -0.01);
        this.splot.camera.zoom = Math.max(0.002, Math.min(200, newZoom));
        this.updateViewProjection.call(this);
        // position after zooming
        var _c = m3_1.default.transformPoint(m3_1.default.inverse(this.transform.viewProjectionMat), [clipX, clipY]), postZoomX = _c[0], postZoomY = _c[1];
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
 * @param headerStyle - Стиль для заголовка всего отладочного блока.
 * @param groupStyle - Стиль для заголовка группировки отладочных данных.
 *
 * @todo Реализовать дополнительные места вывода output: 'console' | 'document' | 'file'
 */
var SPlotDebug = /** @class */ (function () {
    function SPlotDebug(splot) {
        this.splot = splot;
        /** Признак активации режим отладки. */
        this.isEnable = false;
        /** Стиль заголовка режима отладки. */
        this.headerStyle = 'font-weight: bold; color: #ffffff; background-color: #cc0000;';
        /** Стиль заголовка группы параметров. */
        this.groupStyle = 'font-weight: bold; color: #ffffff;';
    }
    /** Подготовка к использованию отладочного режима. */
    SPlotDebug.prototype.setup = function (clearConsole) {
        if (clearConsole === void 0) { clearConsole = false; }
        if (clearConsole) {
            console.clear();
        }
    };
    SPlotDebug.prototype.logIntro = function () {
        console.log('%cОтладка SPlot на объекте #' + this.splot.canvas.id, this.headerStyle);
        if (this.splot.demo.isEnable) {
            console.log('%cВключен демонстрационный режим данных', this.groupStyle);
        }
        console.group('%cПредупреждение', this.groupStyle);
        console.log('Открытая консоль браузера и другие активные средства контроля разработки существенно снижают производительность высоконагруженных приложений. Для объективного анализа производительности все подобные средства должны быть отключены, а консоль браузера закрыта. Некоторые данные отладочной информации в зависимости от используемого браузера могут не отображаться или отображаться некорректно. Средство отладки протестировано в браузере Google Chrome v.90');
        console.groupEnd();
    };
    SPlotDebug.prototype.logGpuInfo = function () {
        console.group('%cВидеосистема', this.groupStyle);
        console.log('Графическая карта: ' + this.splot.webgl.gpu.hardware);
        console.log('Версия GL: ' + this.splot.webgl.gpu.software);
        console.groupEnd();
    };
    SPlotDebug.prototype.logInstanceInfo = function () {
        console.group('%cНастройка параметров экземпляра', this.groupStyle);
        console.dir(this.splot);
        console.log('Канвас: #' + this.splot.canvas.id);
        console.log('Размер канваса: ' + this.splot.canvas.width + ' x ' + this.splot.canvas.height + ' px');
        console.log('Размер плоскости: ' + this.splot.grid.width + ' x ' + this.splot.grid.height + ' px');
        if (this.splot.demo.isEnable) {
            console.log('Способ получения данных: ' + 'демо-данные');
        }
        else {
            console.log('Способ получения данных: ' + 'итерирование');
        }
        console.groupEnd();
    };
    SPlotDebug.prototype.logShadersInfo = function () {
        console.group('%cСоздан вершинный шейдер: ', this.groupStyle);
        console.log(this.splot.shaderCodeVert);
        console.groupEnd();
        console.group('%cСоздан фрагментный шейдер: ', this.groupStyle);
        console.log(this.splot.shaderCodeFrag);
        console.groupEnd();
    };
    SPlotDebug.prototype.logDataLoadingStart = function () {
        console.log('%cЗапущен процесс загрузки данных [' + utils_1.getCurrentTime() + ']...', this.groupStyle);
        console.time('Длительность');
    };
    SPlotDebug.prototype.logDataLoadingComplete = function () {
        console.group('%cЗагрузка данных завершена [' + utils_1.getCurrentTime() + ']', this.groupStyle);
        console.timeEnd('Длительность');
        console.log('Расход видеопамяти: ' + (this.splot.stats.memUsage / 1000000).toFixed(2).toLocaleString() + ' МБ');
        console.log('Кол-во объектов: ' + this.splot.stats.objectsCountTotal.toLocaleString());
        console.log('Кол-во групп буферов: ' + this.splot.stats.groupsCount.toLocaleString());
        console.log('Результат: ' + ((this.splot.stats.objectsCountTotal >= this.splot.globalLimit) ?
            'достигнут лимит объектов (' + this.splot.globalLimit.toLocaleString() + ')' :
            'обработаны все объекты'));
        console.groupEnd();
    };
    SPlotDebug.prototype.logRenderStarted = function () {
        console.log('%cРендер запущен', this.groupStyle);
    };
    SPlotDebug.prototype.logRenderStoped = function () {
        console.log('%cРендер остановлен', this.groupStyle);
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
    SPlotDemo.prototype.setup = function () {
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
    function SPlotWebGl(splot) {
        this.splot = splot;
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
    /**
     * Создает контекст рендеринга WebGL и устанавливает корректный размер области просмотра.
     */
    SPlotWebGl.prototype.setup = function () {
        this.gl = this.splot.canvas.getContext('webgl', {
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
        this.splot.canvas.width = this.splot.canvas.clientWidth;
        this.splot.canvas.height = this.splot.canvas.clientHeight;
        this.gl.viewport(0, 0, this.splot.canvas.width, this.splot.canvas.height);
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
        this.webgl = new splot_webgl_1.default(this);
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
        /** GLSL-коды шейдеров. */
        this.shaderCodeVert = '';
        this.shaderCodeFrag = '';
        /** Статистическая информация. */
        this.stats = {
            objectsCountTotal: 0,
            objectsCountInGroups: [],
            groupsCount: 0,
            memUsage: 0
        };
        /** Хелпер взаимодействия с устройством ввода. */
        this.control = new splot_control_1.default(this);
        if (document.getElementById(canvasId)) {
            this.canvas = document.getElementById(canvasId);
        }
        else {
            throw new Error('Канвас с идентификатором "#' + canvasId + '" не найден!');
        }
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
        this.webgl.setup(); // Создание контекста рендеринга.
        this.control.setup(this);
        this.debug.setup();
        this.demo.setup();
        if (this.debug.isEnable) {
            this.debug.logIntro();
            this.debug.logGpuInfo();
            this.debug.logInstanceInfo();
        }
        this.webgl.setBgColor(this.grid.bgColor); // Установка цвета очистки рендеринга
        this.shaderCodeVert = shader_code_vert_tmpl_1.default.replace('{EXT-CODE}', this.genShaderColorCode()).trim();
        this.shaderCodeFrag = shader_code_frag_tmpl_1.default.trim();
        this.webgl.createProgram(this.shaderCodeVert, this.shaderCodeFrag); // Создание программы WebGL.
        if (this.debug.isEnable) {
            this.debug.logShadersInfo();
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
            this.debug.logDataLoadingComplete();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zdHlsZS5jc3MiLCJ3ZWJwYWNrOi8vLy4vaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vc2hhZGVyLWNvZGUtZnJhZy10bXBsLnRzIiwid2VicGFjazovLy8uL3NoYWRlci1jb2RlLXZlcnQtdG1wbC50cyIsIndlYnBhY2s6Ly8vLi9zcGxvdC1jb250cm9sLnRzIiwid2VicGFjazovLy8uL3NwbG90LWRlYnVnLnRzIiwid2VicGFjazovLy8uL3NwbG90LWRlbW8udHMiLCJ3ZWJwYWNrOi8vLy4vc3Bsb3Qtd2ViZ2wudHMiLCJ3ZWJwYWNrOi8vLy4vc3Bsb3QudHMiLCJ3ZWJwYWNrOi8vLy4vdXRpbHMudHMiLCJ3ZWJwYWNrOi8vLy4vbTMuanMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovLy93ZWJwYWNrL3N0YXJ0dXAiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBQSwrREFBbUM7QUFDbkMsZ0ZBQTJCO0FBQzNCLGtEQUFnQjtBQUVoQixJQUFJLENBQUMsR0FBRyxDQUFDO0FBQ1QsSUFBSSxDQUFDLEdBQUcsT0FBUyxFQUFFLDhCQUE4QjtBQUNqRCxJQUFJLE1BQU0sR0FBRyxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDO0FBQ2pKLElBQUksU0FBUyxHQUFHLEtBQU07QUFDdEIsSUFBSSxVQUFVLEdBQUcsS0FBTTtBQUV2QixnSEFBZ0g7QUFDaEgsU0FBUyxjQUFjO0lBQ3JCLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUNULENBQUMsRUFBRTtRQUNILE9BQU87WUFDTCxD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YUFBYSw2QkFBNkI7QUFDMUMsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQixjQUFjLDZCQUE2QjtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhLE9BQU87QUFDcEIsYUFBYSxPQUFPO0FBQ3BCLGNBQWMsNkJBQTZCO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYSw2QkFBNkI7QUFDMUMsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQixjQUFjLDZCQUE2QjtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhLE9BQU87QUFDcEIsY0FBYyw2QkFBNkI7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYSw2QkFBNkI7QUFDMUMsYUFBYSxPQUFPO0FBQ3BCLGNBQWMsNkJBQTZCO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEIsY0FBYyw2QkFBNkI7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhLDZCQUE2QjtBQUMxQyxhQUFhLE9BQU87QUFDcEIsYUFBYSxPQUFPO0FBQ3BCLGNBQWMsNkJBQTZCO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLENBQUM7Ozs7Ozs7O1VDN1NEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBLHNEQUFzRCxrQkFBa0I7V0FDeEU7V0FDQSwrQ0FBK0MsY0FBYztXQUM3RCxFOzs7OztVQ05BO1VBQ0E7VUFDQTtVQUNBIiwiZmlsZSI6InNjcmlwdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsImltcG9ydCB7IHJhbmRvbUludCB9IGZyb20gJy4vdXRpbHMnXG5pbXBvcnQgU1Bsb3QgZnJvbSAnLi9zcGxvdCdcbmltcG9ydCAnQC9zdHlsZSdcblxubGV0IGkgPSAwXG5sZXQgbiA9IDFfMDAwXzAwMCAgLy8g0JjQvNC40YLQuNGA0YPQtdC80L7QtSDRh9C40YHQu9C+INC+0LHRitC10LrRgtC+0LIuXG5sZXQgY29sb3JzID0gWycjRDgxQzAxJywgJyNFOTk2N0EnLCAnI0JBNTVEMycsICcjRkZENzAwJywgJyNGRkU0QjUnLCAnI0ZGOEMwMCcsICcjMjI4QjIyJywgJyM5MEVFOTAnLCAnIzQxNjlFMScsICcjMDBCRkZGJywgJyM4QjQ1MTMnLCAnIzAwQ0VEMSddXG5sZXQgcGxvdFdpZHRoID0gMzJfMDAwXG5sZXQgcGxvdEhlaWdodCA9IDE2XzAwMFxuXG4vLyDQn9GA0LjQvNC10YAg0LjRgtC10YDQuNGA0YPRjtGJ0LXQuSDRhNGD0L3QutGG0LjQuC4g0JjRgtC10YDQsNGG0LjQuCDQuNC80LjRgtC40YDRg9GO0YLRgdGPINGB0LvRg9GH0LDQudC90YvQvNC4INCy0YvQtNCw0YfQsNC80LguINCf0L7Rh9GC0Lgg0YLQsNC60LbQtSDRgNCw0LHQvtGC0LDQtdGCINGA0LXQttC40Lwg0LTQtdC80L4t0LTQsNC90L3Ri9GFLlxuZnVuY3Rpb24gcmVhZE5leHRPYmplY3QoKSB7XG4gIGlmIChpIDwgbikge1xuICAgIGkrK1xuICAgIHJldHVybiB7XG4gICAgICB4OiByYW5kb21JbnQocGxvdFdpZHRoKSxcbiAgICAgIHk6IHJhbmRvbUludChwbG90SGVpZ2h0KSxcbiAgICAgIHNoYXBlOiByYW5kb21JbnQoMiksXG4gICAgICBzaXplOiAxMCArIHJhbmRvbUludCgyMSksXG4gICAgICBjb2xvcjogcmFuZG9tSW50KGNvbG9ycy5sZW5ndGgpLCAgLy8g0JjQvdC00LXQutGBINGG0LLQtdGC0LAg0LIg0LzQsNGB0YHQuNCy0LUg0YbQstC10YLQvtCyXG4gICAgfVxuICB9XG4gIGVsc2VcbiAgICByZXR1cm4gbnVsbCAgLy8g0JLQvtC30LLRgNCw0YnQsNC10LwgbnVsbCwg0LrQvtCz0LTQsCDQvtCx0YrQtdC60YLRiyBcItC30LDQutC+0L3Rh9C40LvQuNGB0YxcIlxufVxuXG4vKiogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICoqL1xuXG5sZXQgc2NhdHRlclBsb3QgPSBuZXcgU1Bsb3QoJ2NhbnZhczEnKVxuXG4vLyDQndCw0YHRgtGA0L7QudC60LAg0Y3QutC30LXQvNC/0LvRj9GA0LAg0L3QsCDRgNC10LbQuNC8INCy0YvQstC+0LTQsCDQvtGC0LvQsNC00L7Rh9C90L7QuSDQuNC90YTQvtGA0LzQsNGG0LjQuCDQsiDQutC+0L3RgdC+0LvRjCDQsdGA0LDRg9C30LXRgNCwLlxuLy8g0JTRgNGD0LPQuNC1INC/0YDQuNC80LXRgNGLINGA0LDQsdC+0YLRiyDQvtC/0LjRgdCw0L3RiyDQsiDRhNCw0LnQu9C1IHNwbG90LmpzINGB0L4g0YHRgtGA0L7QutC4IDIxNC5cbnNjYXR0ZXJQbG90LnNldHVwKHtcbiAgaXRlcmF0b3I6IHJlYWROZXh0T2JqZWN0LFxuICBjb2xvcnM6IGNvbG9ycyxcbiAgZ3JpZDoge1xuICAgIHdpZHRoOiBwbG90V2lkdGgsXG4gICAgaGVpZ2h0OiBwbG90SGVpZ2h0LFxuICB9LFxuICBkZWJ1Zzoge1xuICAgIGlzRW5hYmxlOiB0cnVlLFxuICB9LFxuICBkZW1vOiB7XG4gICAgaXNFbmFibGU6IHRydWVcbiAgfVxufSlcblxuc2NhdHRlclBsb3QucnVuKClcblxuLy9zY2F0dGVyUGxvdC5zdG9wKClcblxuLy9zZXRUaW1lb3V0KCgpID0+IHNjYXR0ZXJQbG90LnN0b3AoKSwgMzAwMClcbiIsImV4cG9ydCBkZWZhdWx0XG5gXG5wcmVjaXNpb24gbG93cCBmbG9hdDtcbnZhcnlpbmcgdmVjMyB2X2NvbG9yO1xudmFyeWluZyBmbG9hdCB2X3NoYXBlO1xudm9pZCBtYWluKCkge1xuICBpZiAodl9zaGFwZSA9PSAwLjApIHtcbiAgICBmbG9hdCB2U2l6ZSA9IDIwLjA7XG4gICAgZmxvYXQgZGlzdGFuY2UgPSBsZW5ndGgoMi4wICogZ2xfUG9pbnRDb29yZCAtIDEuMCk7XG4gICAgaWYgKGRpc3RhbmNlID4gMS4wKSB7IGRpc2NhcmQ7IH07XG4gICAgZ2xfRnJhZ0NvbG9yID0gdmVjNCh2X2NvbG9yLnJnYiwgMS4wKTtcbiAgfVxuICBlbHNlIGlmICh2X3NoYXBlID09IDEuMCkge1xuICAgIGdsX0ZyYWdDb2xvciA9IHZlYzQodl9jb2xvci5yZ2IsIDEuMCk7XG4gIH1cbn1cbmBcblxuLyoqXG5leHBvcnQgZGVmYXVsdFxuICBgXG5wcmVjaXNpb24gbG93cCBmbG9hdDtcbnZhcnlpbmcgdmVjMyB2X2NvbG9yO1xudm9pZCBtYWluKCkge1xuICBmbG9hdCB2U2l6ZSA9IDIwLjA7XG4gIGZsb2F0IGRpc3RhbmNlID0gbGVuZ3RoKDIuMCAqIGdsX1BvaW50Q29vcmQgLSAxLjApO1xuICBpZiAoZGlzdGFuY2UgPiAxLjApIHsgZGlzY2FyZDsgfVxuICBnbF9GcmFnQ29sb3IgPSB2ZWM0KHZfY29sb3IucmdiLCAxLjApO1xuXG4gICB2ZWM0IHVFZGdlQ29sb3IgPSB2ZWM0KDAuNSwgMC41LCAwLjUsIDEuMCk7XG4gZmxvYXQgdUVkZ2VTaXplID0gMS4wO1xuXG5mbG9hdCBzRWRnZSA9IHNtb290aHN0ZXAoXG4gIHZTaXplIC0gdUVkZ2VTaXplIC0gMi4wLFxuICB2U2l6ZSAtIHVFZGdlU2l6ZSxcbiAgZGlzdGFuY2UgKiAodlNpemUgKyB1RWRnZVNpemUpXG4pO1xuZ2xfRnJhZ0NvbG9yID0gKHVFZGdlQ29sb3IgKiBzRWRnZSkgKyAoKDEuMCAtIHNFZGdlKSAqIGdsX0ZyYWdDb2xvcik7XG5cbmdsX0ZyYWdDb2xvci5hID0gZ2xfRnJhZ0NvbG9yLmEgKiAoMS4wIC0gc21vb3Roc3RlcChcbiAgICB2U2l6ZSAtIDIuMCxcbiAgICB2U2l6ZSxcbiAgICBkaXN0YW5jZSAqIHZTaXplXG4pKTtcblxufVxuYFxuKi9cbiIsImV4cG9ydCBkZWZhdWx0XG5gXG5hdHRyaWJ1dGUgdmVjMiBhX3Bvc2l0aW9uO1xuYXR0cmlidXRlIGZsb2F0IGFfY29sb3I7XG5hdHRyaWJ1dGUgZmxvYXQgYV9zaXplO1xuYXR0cmlidXRlIGZsb2F0IGFfc2hhcGU7XG51bmlmb3JtIG1hdDMgdV9tYXRyaXg7XG52YXJ5aW5nIHZlYzMgdl9jb2xvcjtcbnZhcnlpbmcgZmxvYXQgdl9zaGFwZTtcbnZvaWQgbWFpbigpIHtcbiAgZ2xfUG9zaXRpb24gPSB2ZWM0KCh1X21hdHJpeCAqIHZlYzMoYV9wb3NpdGlvbiwgMSkpLnh5LCAwLjAsIDEuMCk7XG4gIGdsX1BvaW50U2l6ZSA9IGFfc2l6ZTtcbiAgdl9zaGFwZSA9IGFfc2hhcGU7XG4gIHtFWFQtQ09ERX1cbn1cbmBcbiIsIi8vIEB0cy1pZ25vcmVcbmltcG9ydCBtMyBmcm9tICcuL20zJ1xuaW1wb3J0IFNQbG90IGZyb20gJy4vc3Bsb3QnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNQbG90Q29udG9sIHtcblxuICAvLyDQotC10YXQvdC40YfQtdGB0LrQsNGPINC40L3RhNC+0YDQvNCw0YbQuNGPLCDQuNGB0L/QvtC70YzQt9GD0LXQvNCw0Y8g0L/RgNC40LvQvtC20LXQvdC40LXQvCDQtNC70Y8g0YDQsNGB0YfQtdGC0LAg0YLRgNCw0L3RgdGE0L7RgNC80LDRhtC40LkuXG4gIHB1YmxpYyB0cmFuc2Zvcm06IFNQbG90VHJhbnNmb3JtID0ge1xuICAgIHZpZXdQcm9qZWN0aW9uTWF0OiBbXSxcbiAgICBzdGFydEludlZpZXdQcm9qTWF0OiBbXSxcbiAgICBzdGFydENhbWVyYTogeyB4OiAwLCB5OiAwLCB6b29tOiAxIH0sXG4gICAgc3RhcnRQb3M6IFtdLFxuICAgIHN0YXJ0Q2xpcFBvczogW10sXG4gICAgc3RhcnRNb3VzZVBvczogW11cbiAgfVxuXG4gIHByb3RlY3RlZCBoYW5kbGVNb3VzZURvd25XaXRoQ29udGV4dDogRXZlbnRMaXN0ZW5lciA9IHRoaXMuaGFuZGxlTW91c2VEb3duLmJpbmQodGhpcykgYXMgRXZlbnRMaXN0ZW5lclxuICBwcm90ZWN0ZWQgaGFuZGxlTW91c2VXaGVlbFdpdGhDb250ZXh0OiBFdmVudExpc3RlbmVyID0gdGhpcy5oYW5kbGVNb3VzZVdoZWVsLmJpbmQodGhpcykgYXMgRXZlbnRMaXN0ZW5lclxuICBwcm90ZWN0ZWQgaGFuZGxlTW91c2VNb3ZlV2l0aENvbnRleHQ6IEV2ZW50TGlzdGVuZXIgPSB0aGlzLmhhbmRsZU1vdXNlTW92ZS5iaW5kKHRoaXMpIGFzIEV2ZW50TGlzdGVuZXJcbiAgcHJvdGVjdGVkIGhhbmRsZU1vdXNlVXBXaXRoQ29udGV4dDogRXZlbnRMaXN0ZW5lciA9IHRoaXMuaGFuZGxlTW91c2VVcC5iaW5kKHRoaXMpIGFzIEV2ZW50TGlzdGVuZXJcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlYWRvbmx5IHNwbG90OiBTUGxvdFxuICApIHsgfVxuXG4gIHNldHVwKHNwbG90OiBTUGxvdCkge1xuICAgIHRoaXMuc3Bsb3QuY2FtZXJhID0gc3Bsb3QuY2FtZXJhXG4gIH1cblxuICBwdWJsaWMgcnVuKCkge1xuICAgIHRoaXMuc3Bsb3QuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMuaGFuZGxlTW91c2VEb3duV2l0aENvbnRleHQpXG4gICAgdGhpcy5zcGxvdC5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignd2hlZWwnLCB0aGlzLmhhbmRsZU1vdXNlV2hlZWxXaXRoQ29udGV4dClcbiAgfVxuXG4gIHB1YmxpYyBzdG9wKCkge1xuICAgIHRoaXMuc3Bsb3QuY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMuaGFuZGxlTW91c2VEb3duV2l0aENvbnRleHQpXG4gICAgdGhpcy5zcGxvdC5jYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcignd2hlZWwnLCB0aGlzLmhhbmRsZU1vdXNlV2hlZWxXaXRoQ29udGV4dClcbiAgICB0aGlzLnNwbG90LmNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLmhhbmRsZU1vdXNlTW92ZVdpdGhDb250ZXh0KVxuICAgIHRoaXMuc3Bsb3QuY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLmhhbmRsZU1vdXNlVXBXaXRoQ29udGV4dClcbiAgfVxuXG4gIHByb3RlY3RlZCBtYWtlQ2FtZXJhTWF0cml4KCkge1xuXG4gICAgY29uc3Qgem9vbVNjYWxlID0gMSAvIHRoaXMuc3Bsb3QuY2FtZXJhLnpvb20hO1xuXG4gICAgbGV0IGNhbWVyYU1hdCA9IG0zLmlkZW50aXR5KCk7XG4gICAgY2FtZXJhTWF0ID0gbTMudHJhbnNsYXRlKGNhbWVyYU1hdCwgdGhpcy5zcGxvdC5jYW1lcmEueCwgdGhpcy5zcGxvdC5jYW1lcmEueSk7XG4gICAgY2FtZXJhTWF0ID0gbTMuc2NhbGUoY2FtZXJhTWF0LCB6b29tU2NhbGUsIHpvb21TY2FsZSk7XG5cbiAgICByZXR1cm4gY2FtZXJhTWF0O1xuICB9XG5cbiAgLyoqXG4gICAqINCe0LHQvdC+0LLQu9GP0LXRgiDQvNCw0YLRgNC40YbRgyDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuC5cbiAgICpcbiAgICogQHJlbWFya3NcbiAgICog0KHRg9GJ0LXRgdGC0LLRg9C10YIg0LTQstCwINCy0LDRgNC40LDQvdGC0LAg0LLRi9C30L7QstCwINC80LXRgtC+0LTQsCAtINC40Lcg0LTRgNGD0LPQvtCz0L4g0LzQtdGC0L7QtNCwINGN0LrQt9C10LzQv9C70Y/RgNCwICh7QGxpbmsgcmVuZGVyfSkg0Lgg0LjQtyDQvtCx0YDQsNCx0L7RgtGH0LjQutCwINGB0L7QsdGL0YLQuNGPINC80YvRiNC4XG4gICAqICh7QGxpbmsgaGFuZGxlTW91c2VXaGVlbH0pLiDQktC+INCy0YLQvtGA0L7QvCDQstCw0YDQuNCw0L3RgtC1INC40YHQv9C+0LvRjNC30L7QstCw0L3QuNC1INC+0LHRitC10LrRgtCwIHRoaXMg0L3QtdCy0L7Qt9C80L7QttC90L4uINCU0LvRjyDRg9C90LjQstC10YDRgdCw0LvRjNC90L7RgdGC0Lgg0LLRi9C30L7QstCwXG4gICAqINC80LXRgtC+0LTQsCAtINCyINC90LXQs9C+INCy0YHQtdCz0LTQsCDRj9Cy0L3QviDQvdC10L7QsdGF0L7QtNC40LzQviDQv9C10YDQtdC00LDQstCw0YLRjCDRgdGB0YvQu9C60YMg0L3QsCDRjdC60LfQtdC80L/Qu9GP0YAg0LrQu9Cw0YHRgdCwLlxuICAgKi9cbiAgcHVibGljIHVwZGF0ZVZpZXdQcm9qZWN0aW9uKCk6IHZvaWQge1xuXG4gICAgY29uc3QgcHJvamVjdGlvbk1hdCA9IG0zLnByb2plY3Rpb24odGhpcy5zcGxvdC5jYW52YXMud2lkdGgsIHRoaXMuc3Bsb3QuY2FudmFzLmhlaWdodCk7XG4gICAgY29uc3QgY2FtZXJhTWF0ID0gdGhpcy5tYWtlQ2FtZXJhTWF0cml4KCk7XG4gICAgbGV0IHZpZXdNYXQgPSBtMy5pbnZlcnNlKGNhbWVyYU1hdCk7XG4gICAgdGhpcy50cmFuc2Zvcm0udmlld1Byb2plY3Rpb25NYXQgPSBtMy5tdWx0aXBseShwcm9qZWN0aW9uTWF0LCB2aWV3TWF0KTtcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKi9cbiAgcHJvdGVjdGVkIGdldENsaXBTcGFjZU1vdXNlUG9zaXRpb24oZXZlbnQ6IE1vdXNlRXZlbnQpIHtcblxuICAgIC8vIGdldCBjYW52YXMgcmVsYXRpdmUgY3NzIHBvc2l0aW9uXG4gICAgY29uc3QgcmVjdCA9IHRoaXMuc3Bsb3QuY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IGNzc1ggPSBldmVudC5jbGllbnRYIC0gcmVjdC5sZWZ0O1xuICAgIGNvbnN0IGNzc1kgPSBldmVudC5jbGllbnRZIC0gcmVjdC50b3A7XG5cbiAgICAvLyBnZXQgbm9ybWFsaXplZCAwIHRvIDEgcG9zaXRpb24gYWNyb3NzIGFuZCBkb3duIGNhbnZhc1xuICAgIGNvbnN0IG5vcm1hbGl6ZWRYID0gY3NzWCAvIHRoaXMuc3Bsb3QuY2FudmFzLmNsaWVudFdpZHRoO1xuICAgIGNvbnN0IG5vcm1hbGl6ZWRZID0gY3NzWSAvIHRoaXMuc3Bsb3QuY2FudmFzLmNsaWVudEhlaWdodDtcblxuICAgIC8vIGNvbnZlcnQgdG8gY2xpcCBzcGFjZVxuICAgIGNvbnN0IGNsaXBYID0gbm9ybWFsaXplZFggKiAyIC0gMTtcbiAgICBjb25zdCBjbGlwWSA9IG5vcm1hbGl6ZWRZICogLTIgKyAxO1xuXG4gICAgcmV0dXJuIFtjbGlwWCwgY2xpcFldO1xuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqL1xuICBwcm90ZWN0ZWQgbW92ZUNhbWVyYShldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuXG4gICAgY29uc3QgcG9zID0gbTMudHJhbnNmb3JtUG9pbnQoXG4gICAgICB0aGlzLnRyYW5zZm9ybS5zdGFydEludlZpZXdQcm9qTWF0LFxuICAgICAgdGhpcy5nZXRDbGlwU3BhY2VNb3VzZVBvc2l0aW9uKGV2ZW50KVxuICAgICk7XG5cbiAgICB0aGlzLnNwbG90LmNhbWVyYS54ID1cbiAgICAgIHRoaXMudHJhbnNmb3JtLnN0YXJ0Q2FtZXJhLnghICsgdGhpcy50cmFuc2Zvcm0uc3RhcnRQb3NbMF0gLSBwb3NbMF07XG5cbiAgICB0aGlzLnNwbG90LmNhbWVyYS55ID1cbiAgICAgIHRoaXMudHJhbnNmb3JtLnN0YXJ0Q2FtZXJhLnkhICsgdGhpcy50cmFuc2Zvcm0uc3RhcnRQb3NbMV0gLSBwb3NbMV07XG5cbiAgICB0aGlzLnNwbG90LnJlbmRlcigpO1xuICB9XG5cbiAgLyoqXG4gICAqINCg0LXQsNCz0LjRgNGD0LXRgiDQvdCwINC00LLQuNC20LXQvdC40LUg0LzRi9GI0Lgv0YLRgNC10LrQv9Cw0LTQsCDQsiDQvNC+0LzQtdC90YIsINC60L7Qs9C00LAg0LXQtS/QtdCz0L4g0LrQu9Cw0LLQuNGI0LAg0YPQtNC10YDQttC40LLQsNC10YLRgdGPINC90LDQttCw0YLQvtC5LlxuICAgKlxuICAgKiBAcmVtZXJrc1xuICAgKiDQnNC10YLQvtC0INC/0LXRgNC10LzQtdGJ0LDQtdGCINC+0LHQu9Cw0YHRgtGMINCy0LjQtNC40LzQvtGB0YLQuCDQvdCwINC/0LvQvtGB0LrQvtGB0YLQuCDQstC80LXRgdGC0LUg0YEg0LTQstC40LbQtdC90LjQtdC8INC80YvRiNC4L9GC0YDQtdC60L/QsNC00LAuINCS0YvRh9C40YHQu9C10L3QuNGPINCy0L3Rg9GC0YDQuCDRgdC+0LHRi9GC0LjRjyDRgdC00LXQu9Cw0L3Ri1xuICAgKiDQvNCw0LrRgdC40LzQsNC70YzQvdC+INC/0YDQvtC40LfQstC+0LTQuNGC0LXQu9GM0L3Ri9C80Lgg0LIg0YPRidC10YDQsSDRh9C40YLQsNCx0LXQu9GM0L3QvtGB0YLQuCDQu9C+0LPQuNC60Lgg0LTQtdC50YHRgtCy0LjQuS4g0JLQviDQstC90LXRiNC90LXQvCDQvtCx0YDQsNCx0L7RgtGH0LjQutC1INGB0L7QsdGL0YLQuNC5INC+0LHRitC10LrRgiB0aGlzXG4gICAqINC90LXQtNC+0YHRgtGD0L/QtdC9INC/0L7RjdGC0L7QvNGDINC00L7RgdGC0YPQvyDQuiDRjdC60LfQtdC80L/Qu9GP0YDRgyDQutC70LDRgdGB0LAg0YDQtdCw0LvQuNC30YPQtdGC0YHRjyDRh9C10YDQtdC3INGB0YLQsNGC0LjRh9C10YHQutC40Lkg0LzQsNGB0YHQuNCyINCy0YHQtdGFINGB0L7Qt9C00LDQvdC90YvRhSDRjdC60LfQtdC80L/Qu9GP0YDQvtCyXG4gICAqINC60LvQsNGB0YHQsCDQuCDQuNC00LXQvdGC0LjRhNC40LrQsNGC0L7RgNCwINC60LDQvdCy0LDRgdCwLCDQstGL0YHRgtGD0L/QsNGO0YnQtdCz0L4g0LjQvdC00LXQutGB0L7QvCDQsiDRjdGC0L7QvCDQvNCw0YHRgdC40LLQtS5cbiAgICpcbiAgICogQHBhcmFtIGV2ZW50IC0g0KHQvtCx0YvRgtC40LUg0LzRi9GI0Lgv0YLRgNC10LrQv9Cw0LTQsC5cbiAgICovXG4gIHByb3RlY3RlZCBoYW5kbGVNb3VzZU1vdmUoZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICB0aGlzLm1vdmVDYW1lcmEuY2FsbCh0aGlzLCBldmVudCk7XG4gIH1cblxuICAvKipcbiAgICog0KDQtdCw0LPQuNGA0YPQtdGCINC90LAg0L7RgtC20LDRgtC40LUg0LrQu9Cw0LLQuNGI0Lgg0LzRi9GI0Lgv0YLRgNC10LrQv9Cw0LTQsC5cbiAgICpcbiAgICogQHJlbWVya3NcbiAgICog0JIg0LzQvtC80LXQvdGCINC+0YLQttCw0YLQuNGPINC60LvQsNCy0LjRiNC4INCw0L3QsNC70LjQtyDQtNCy0LjQttC10L3QuNGPINC80YvRiNC4L9GC0YDQtdC60L/QsNC00LAg0YEg0LfQsNC20LDRgtC+0Lkg0LrQu9Cw0LLQuNGI0LXQuSDQv9GA0LXQutGA0LDRidCw0LXRgtGB0Y8uINCS0YvRh9C40YHQu9C10L3QuNGPINCy0L3Rg9GC0YDQuCDRgdC+0LHRi9GC0LjRj1xuICAgKiDRgdC00LXQu9Cw0L3RiyDQvNCw0LrRgdC40LzQsNC70YzQvdC+INC/0YDQvtC40LfQstC+0LTQuNGC0LXQu9GM0L3Ri9C80Lgg0LIg0YPRidC10YDQsSDRh9C40YLQsNCx0LXQu9GM0L3QvtGB0YLQuCDQu9C+0LPQuNC60Lgg0LTQtdC50YHRgtCy0LjQuS4g0JLQviDQstC90LXRiNC90LXQvCDQvtCx0YDQsNCx0L7RgtGH0LjQutC1INGB0L7QsdGL0YLQuNC5INC+0LHRitC10LrRglxuICAgKiB0aGlzINC90LXQtNC+0YHRgtGD0L/QtdC9INC/0L7RjdGC0L7QvNGDINC00L7RgdGC0YPQvyDQuiDRjdC60LfQtdC80L/Qu9GP0YDRgyDQutC70LDRgdGB0LAg0YDQtdCw0LvQuNC30YPQtdGC0YHRjyDRh9C10YDQtdC3INGB0YLQsNGC0LjRh9C10YHQutC40Lkg0LzQsNGB0YHQuNCyINCy0YHQtdGFINGB0L7Qt9C00LDQvdC90YvRhSDRjdC60LfQtdC80L/Qu9GP0YDQvtCyXG4gICAqINC60LvQsNGB0YHQsCDQuCDQuNC00LXQvdGC0LjRhNC40LrQsNGC0L7RgNCwINC60LDQvdCy0LDRgdCwLCDQstGL0YHRgtGD0L/QsNGO0YnQtdCz0L4g0LjQvdC00LXQutGB0L7QvCDQsiDRjdGC0L7QvCDQvNCw0YHRgdC40LLQtS5cbiAgICpcbiAgICogQHBhcmFtIGV2ZW50IC0g0KHQvtCx0YvRgtC40LUg0LzRi9GI0Lgv0YLRgNC10LrQv9Cw0LTQsC5cbiAgICovXG4gIHByb3RlY3RlZCBoYW5kbGVNb3VzZVVwKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG4gICAgdGhpcy5zcGxvdC5yZW5kZXIoKTtcbiAgICBldmVudC50YXJnZXQhLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMuaGFuZGxlTW91c2VNb3ZlV2l0aENvbnRleHQpO1xuICAgIGV2ZW50LnRhcmdldCEucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuaGFuZGxlTW91c2VVcFdpdGhDb250ZXh0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiDQoNC10LDQs9C40YDRg9C10YIg0L3QsCDQvdCw0LbQsNGC0LjQtSDQutC70LDQstC40YjQuCDQvNGL0YjQuC/RgtGA0LXQutC/0LDQtNCwLlxuICAgKlxuICAgKiBAcmVtZXJrc1xuICAgKiDQkiDQvNC+0LzQtdC90YIg0L3QsNC20LDRgtC40Y8g0Lgg0YPQtNC10YDQttCw0L3QuNGPINC60LvQsNCy0LjRiNC4INC30LDQv9GD0YHQutCw0LXRgtGB0Y8g0LDQvdCw0LvQuNC3INC00LLQuNC20LXQvdC40Y8g0LzRi9GI0Lgv0YLRgNC10LrQv9Cw0LTQsCAo0YEg0LfQsNC20LDRgtC+0Lkg0LrQu9Cw0LLQuNGI0LXQuSkuINCS0YvRh9C40YHQu9C10L3QuNGPXG4gICAqINCy0L3Rg9GC0YDQuCDRgdC+0LHRi9GC0LjRjyDRgdC00LXQu9Cw0L3RiyDQvNCw0LrRgdC40LzQsNC70YzQvdC+INC/0YDQvtC40LfQstC+0LTQuNGC0LXQu9GM0L3Ri9C80Lgg0LIg0YPRidC10YDQsSDRh9C40YLQsNCx0LXQu9GM0L3QvtGB0YLQuCDQu9C+0LPQuNC60Lgg0LTQtdC50YHRgtCy0LjQuS4g0JLQviDQstC90LXRiNC90LXQvCDQvtCx0YDQsNCx0L7RgtGH0LjQutC1XG4gICAqINGB0L7QsdGL0YLQuNC5INC+0LHRitC10LrRgiB0aGlzINC90LXQtNC+0YHRgtGD0L/QtdC9INC/0L7RjdGC0L7QvNGDINC00L7RgdGC0YPQvyDQuiDRjdC60LfQtdC80L/Qu9GP0YDRgyDQutC70LDRgdGB0LAg0YDQtdCw0LvQuNC30YPQtdGC0YHRjyDRh9C10YDQtdC3INGB0YLQsNGC0LjRh9C10YHQutC40Lkg0LzQsNGB0YHQuNCyINCy0YHQtdGFXG4gICAqINGB0L7Qt9C00LDQvdC90YvRhSDRjdC60LfQtdC80L/Qu9GP0YDQvtCyINC60LvQsNGB0YHQsCDQuCDQuNC00LXQvdGC0LjRhNC40LrQsNGC0L7RgNCwINC60LDQvdCy0LDRgdCwLCDQstGL0YHRgtGD0L/QsNGO0YnQtdCz0L4g0LjQvdC00LXQutGB0L7QvCDQsiDRjdGC0L7QvCDQvNCw0YHRgdC40LLQtS5cbiAgICpcbiAgICogQHBhcmFtIGV2ZW50IC0g0KHQvtCx0YvRgtC40LUg0LzRi9GI0Lgv0YLRgNC10LrQv9Cw0LTQsC5cbiAgICovXG4gIHByb3RlY3RlZCBoYW5kbGVNb3VzZURvd24oZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcblxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGhpcy5zcGxvdC5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5oYW5kbGVNb3VzZU1vdmVXaXRoQ29udGV4dCk7XG4gICAgdGhpcy5zcGxvdC5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuaGFuZGxlTW91c2VVcFdpdGhDb250ZXh0KTtcblxuICAgIHRoaXMudHJhbnNmb3JtLnN0YXJ0SW52Vmlld1Byb2pNYXQgPSBtMy5pbnZlcnNlKHRoaXMudHJhbnNmb3JtLnZpZXdQcm9qZWN0aW9uTWF0KTtcbiAgICB0aGlzLnRyYW5zZm9ybS5zdGFydENhbWVyYSA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3Bsb3QuY2FtZXJhKTtcbiAgICB0aGlzLnRyYW5zZm9ybS5zdGFydENsaXBQb3MgPSB0aGlzLmdldENsaXBTcGFjZU1vdXNlUG9zaXRpb24uY2FsbCh0aGlzLCBldmVudCk7XG4gICAgdGhpcy50cmFuc2Zvcm0uc3RhcnRQb3MgPSBtMy50cmFuc2Zvcm1Qb2ludCh0aGlzLnRyYW5zZm9ybS5zdGFydEludlZpZXdQcm9qTWF0LCB0aGlzLnRyYW5zZm9ybS5zdGFydENsaXBQb3MpO1xuICAgIHRoaXMudHJhbnNmb3JtLnN0YXJ0TW91c2VQb3MgPSBbZXZlbnQuY2xpZW50WCwgZXZlbnQuY2xpZW50WV07XG5cbiAgICB0aGlzLnNwbG90LnJlbmRlcigpO1xuICB9XG5cbiAgLyoqXG4gICAqINCg0LXQsNCz0LjRgNGD0LXRgiDQvdCwINC30YPQvNC40YDQvtCy0LDQvdC40LUg0LzRi9GI0Lgv0YLRgNC10LrQv9Cw0LTQsC5cbiAgICpcbiAgICogQHJlbWVya3NcbiAgICog0JIg0LzQvtC80LXQvdGCINC30YPQvNC40YDQvtCy0LDQvdC40Y8g0LzRi9GI0Lgv0YLRgNC10LrQv9Cw0LTQsCDQv9GA0L7QuNGB0YXQvtC00LjRgiDQt9GD0LzQuNGA0L7QstCw0L3QuNC1INC60L7QvtGA0LTQuNC90LDRgtC90L7QuSDQv9C70L7RgdC60L7RgdGC0LguINCS0YvRh9C40YHQu9C10L3QuNGPINCy0L3Rg9GC0YDQuCDRgdC+0LHRi9GC0LjRj1xuICAgKiDRgdC00LXQu9Cw0L3RiyDQvNCw0LrRgdC40LzQsNC70YzQvdC+INC/0YDQvtC40LfQstC+0LTQuNGC0LXQu9GM0L3Ri9C80Lgg0LIg0YPRidC10YDQsSDRh9C40YLQsNCx0LXQu9GM0L3QvtGB0YLQuCDQu9C+0LPQuNC60Lgg0LTQtdC50YHRgtCy0LjQuS4g0JLQviDQstC90LXRiNC90LXQvCDQvtCx0YDQsNCx0L7RgtGH0LjQutC1INGB0L7QsdGL0YLQuNC5INC+0LHRitC10LrRglxuICAgKiB0aGlzINC90LXQtNC+0YHRgtGD0L/QtdC9INC/0L7RjdGC0L7QvNGDINC00L7RgdGC0YPQvyDQuiDRjdC60LfQtdC80L/Qu9GP0YDRgyDQutC70LDRgdGB0LAg0YDQtdCw0LvQuNC30YPQtdGC0YHRjyDRh9C10YDQtdC3INGB0YLQsNGC0LjRh9C10YHQutC40Lkg0LzQsNGB0YHQuNCyINCy0YHQtdGFINGB0L7Qt9C00LDQvdC90YvRhSDRjdC60LfQtdC80L/Qu9GP0YDQvtCyXG4gICAqINC60LvQsNGB0YHQsCDQuCDQuNC00LXQvdGC0LjRhNC40LrQsNGC0L7RgNCwINC60LDQvdCy0LDRgdCwLCDQstGL0YHRgtGD0L/QsNGO0YnQtdCz0L4g0LjQvdC00LXQutGB0L7QvCDQsiDRjdGC0L7QvCDQvNCw0YHRgdC40LLQtS5cbiAgICpcbiAgICogQHBhcmFtIGV2ZW50IC0g0KHQvtCx0YvRgtC40LUg0LzRi9GI0Lgv0YLRgNC10LrQv9Cw0LTQsC5cbiAgICovXG4gIHByb3RlY3RlZCBoYW5kbGVNb3VzZVdoZWVsKGV2ZW50OiBXaGVlbEV2ZW50KTogdm9pZCB7XG5cbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNvbnN0IFtjbGlwWCwgY2xpcFldID0gdGhpcy5nZXRDbGlwU3BhY2VNb3VzZVBvc2l0aW9uLmNhbGwodGhpcywgZXZlbnQpO1xuXG4gICAgLy8gcG9zaXRpb24gYmVmb3JlIHpvb21pbmdcbiAgICBjb25zdCBbcHJlWm9vbVgsIHByZVpvb21ZXSA9IG0zLnRyYW5zZm9ybVBvaW50KG0zLmludmVyc2UodGhpcy50cmFuc2Zvcm0udmlld1Byb2plY3Rpb25NYXQpLCBbY2xpcFgsIGNsaXBZXSk7XG5cbiAgICAvLyBtdWx0aXBseSB0aGUgd2hlZWwgbW92ZW1lbnQgYnkgdGhlIGN1cnJlbnQgem9vbSBsZXZlbCwgc28gd2Ugem9vbSBsZXNzIHdoZW4gem9vbWVkIGluIGFuZCBtb3JlIHdoZW4gem9vbWVkIG91dFxuICAgIGNvbnN0IG5ld1pvb20gPSB0aGlzLnNwbG90LmNhbWVyYS56b29tISAqIE1hdGgucG93KDIsIGV2ZW50LmRlbHRhWSAqIC0wLjAxKTtcbiAgICB0aGlzLnNwbG90LmNhbWVyYS56b29tID0gTWF0aC5tYXgoMC4wMDIsIE1hdGgubWluKDIwMCwgbmV3Wm9vbSkpO1xuXG4gICAgdGhpcy51cGRhdGVWaWV3UHJvamVjdGlvbi5jYWxsKHRoaXMpO1xuXG4gICAgLy8gcG9zaXRpb24gYWZ0ZXIgem9vbWluZ1xuICAgIGNvbnN0IFtwb3N0Wm9vbVgsIHBvc3Rab29tWV0gPSBtMy50cmFuc2Zvcm1Qb2ludChtMy5pbnZlcnNlKHRoaXMudHJhbnNmb3JtLnZpZXdQcm9qZWN0aW9uTWF0KSwgW2NsaXBYLCBjbGlwWV0pO1xuXG4gICAgLy8gY2FtZXJhIG5lZWRzIHRvIGJlIG1vdmVkIHRoZSBkaWZmZXJlbmNlIG9mIGJlZm9yZSBhbmQgYWZ0ZXJcbiAgICB0aGlzLnNwbG90LmNhbWVyYS54ISArPSBwcmVab29tWCAtIHBvc3Rab29tWDtcbiAgICB0aGlzLnNwbG90LmNhbWVyYS55ISArPSBwcmVab29tWSAtIHBvc3Rab29tWTtcblxuICAgIHRoaXMuc3Bsb3QucmVuZGVyKCk7XG4gIH1cbn1cbiIsImltcG9ydCBTUGxvdCBmcm9tICcuL3NwbG90J1xuaW1wb3J0IHsganNvblN0cmluZ2lmeSwgZ2V0Q3VycmVudFRpbWUgfSBmcm9tICcuL3V0aWxzJ1xuXG4vKipcbiAqINCi0LjQvyDQtNC70Y8g0L/QsNGA0LDQvNC10YLRgNC+0LIg0YDQtdC20LjQvNCwINC+0YLQu9Cw0LTQutC4LlxuICpcbiAqIEBwYXJhbSBpc0VuYWJsZSAtINCf0YDQuNC30L3QsNC6INCy0LrQu9GO0YfQtdC90LjRjyDQvtGC0LvQsNC00L7Rh9C90L7Qs9C+INGA0LXQttC40LzQsC5cbiAqIEBwYXJhbSBoZWFkZXJTdHlsZSAtINCh0YLQuNC70Ywg0LTQu9GPINC30LDQs9C+0LvQvtCy0LrQsCDQstGB0LXQs9C+INC+0YLQu9Cw0LTQvtGH0L3QvtCz0L4g0LHQu9C+0LrQsC5cbiAqIEBwYXJhbSBncm91cFN0eWxlIC0g0KHRgtC40LvRjCDQtNC70Y8g0LfQsNCz0L7Qu9C+0LLQutCwINCz0YDRg9C/0L/QuNGA0L7QstC60Lgg0L7RgtC70LDQtNC+0YfQvdGL0YUg0LTQsNC90L3Ri9GFLlxuICpcbiAqIEB0b2RvINCg0LXQsNC70LjQt9C+0LLQsNGC0Ywg0LTQvtC/0L7Qu9C90LjRgtC10LvRjNC90YvQtSDQvNC10YHRgtCwINCy0YvQstC+0LTQsCBvdXRwdXQ6ICdjb25zb2xlJyB8ICdkb2N1bWVudCcgfCAnZmlsZSdcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU1Bsb3REZWJ1ZyB7XG5cbiAgLyoqINCf0YDQuNC30L3QsNC6INCw0LrRgtC40LLQsNGG0LjQuCDRgNC10LbQuNC8INC+0YLQu9Cw0LTQutC4LiAqL1xuICBwdWJsaWMgaXNFbmFibGU6IGJvb2xlYW4gPSBmYWxzZVxuXG4gIC8qKiDQodGC0LjQu9GMINC30LDQs9C+0LvQvtCy0LrQsCDRgNC10LbQuNC80LAg0L7RgtC70LDQtNC60LguICovXG4gIHB1YmxpYyBoZWFkZXJTdHlsZTogc3RyaW5nID0gJ2ZvbnQtd2VpZ2h0OiBib2xkOyBjb2xvcjogI2ZmZmZmZjsgYmFja2dyb3VuZC1jb2xvcjogI2NjMDAwMDsnXG5cbiAgLyoqINCh0YLQuNC70Ywg0LfQsNCz0L7Qu9C+0LLQutCwINCz0YDRg9C/0L/RiyDQv9Cw0YDQsNC80LXRgtGA0L7Qsi4gKi9cbiAgcHVibGljIGdyb3VwU3R5bGU6IHN0cmluZyA9ICdmb250LXdlaWdodDogYm9sZDsgY29sb3I6ICNmZmZmZmY7J1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcmVhZG9ubHkgc3Bsb3Q6IFNQbG90XG4gICkge31cblxuICAvKiog0J/QvtC00LPQvtGC0L7QstC60LAg0Log0LjRgdC/0L7Qu9GM0LfQvtCy0LDQvdC40Y4g0L7RgtC70LDQtNC+0YfQvdC+0LPQviDRgNC10LbQuNC80LAuICovXG4gIHB1YmxpYyBzZXR1cChjbGVhckNvbnNvbGU6IGJvb2xlYW4gPSBmYWxzZSk6IHZvaWQge1xuICAgIGlmIChjbGVhckNvbnNvbGUpIHtcbiAgICAgIGNvbnNvbGUuY2xlYXIoKVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBsb2dJbnRybygpOiB2b2lkIHtcbiAgICBjb25zb2xlLmxvZygnJWPQntGC0LvQsNC00LrQsCBTUGxvdCDQvdCwINC+0LHRitC10LrRgtC1ICMnICsgdGhpcy5zcGxvdC5jYW52YXMuaWQsIHRoaXMuaGVhZGVyU3R5bGUpXG5cbiAgICBpZiAodGhpcy5zcGxvdC5kZW1vLmlzRW5hYmxlKSB7XG4gICAgICBjb25zb2xlLmxvZygnJWPQktC60LvRjtGH0LXQvSDQtNC10LzQvtC90YHRgtGA0LDRhtC40L7QvdC90YvQuSDRgNC10LbQuNC8INC00LDQvdC90YvRhScsIHRoaXMuZ3JvdXBTdHlsZSlcbiAgICB9XG5cbiAgICBjb25zb2xlLmdyb3VwKCclY9Cf0YDQtdC00YPQv9GA0LXQttC00LXQvdC40LUnLCB0aGlzLmdyb3VwU3R5bGUpXG4gICAgY29uc29sZS5sb2coJ9Ce0YLQutGA0YvRgtCw0Y8g0LrQvtC90YHQvtC70Ywg0LHRgNCw0YPQt9C10YDQsCDQuCDQtNGA0YPQs9C40LUg0LDQutGC0LjQstC90YvQtSDRgdGA0LXQtNGB0YLQstCwINC60L7QvdGC0YDQvtC70Y8g0YDQsNC30YDQsNCx0L7RgtC60Lgg0YHRg9GJ0LXRgdGC0LLQtdC90L3QviDRgdC90LjQttCw0Y7RgiDQv9GA0L7QuNC30LLQvtC00LjRgtC10LvRjNC90L7RgdGC0Ywg0LLRi9GB0L7QutC+0L3QsNCz0YDRg9C20LXQvdC90YvRhSDQv9GA0LjQu9C+0LbQtdC90LjQuS4g0JTQu9GPINC+0LHRitC10LrRgtC40LLQvdC+0LPQviDQsNC90LDQu9C40LfQsCDQv9GA0L7QuNC30LLQvtC00LjRgtC10LvRjNC90L7RgdGC0Lgg0LLRgdC1INC/0L7QtNC+0LHQvdGL0LUg0YHRgNC10LTRgdGC0LLQsCDQtNC+0LvQttC90Ysg0LHRi9GC0Ywg0L7RgtC60LvRjtGH0LXQvdGLLCDQsCDQutC+0L3RgdC+0LvRjCDQsdGA0LDRg9C30LXRgNCwINC30LDQutGA0YvRgtCwLiDQndC10LrQvtGC0L7RgNGL0LUg0LTQsNC90L3Ri9C1INC+0YLQu9Cw0LTQvtGH0L3QvtC5INC40L3RhNC+0YDQvNCw0YbQuNC4INCyINC30LDQstC40YHQuNC80L7RgdGC0Lgg0L7RgiDQuNGB0L/QvtC70YzQt9GD0LXQvNC+0LPQviDQsdGA0LDRg9C30LXRgNCwINC80L7Qs9GD0YIg0L3QtSDQvtGC0L7QsdGA0LDQttCw0YLRjNGB0Y8g0LjQu9C4INC+0YLQvtCx0YDQsNC20LDRgtGM0YHRjyDQvdC10LrQvtGA0YDQtdC60YLQvdC+LiDQodGA0LXQtNGB0YLQstC+INC+0YLQu9Cw0LTQutC4INC/0YDQvtGC0LXRgdGC0LjRgNC+0LLQsNC90L4g0LIg0LHRgNCw0YPQt9C10YDQtSBHb29nbGUgQ2hyb21lIHYuOTAnKVxuICAgIGNvbnNvbGUuZ3JvdXBFbmQoKVxuICB9XG5cbiAgcHVibGljIGxvZ0dwdUluZm8oKTogdm9pZCB7XG4gICAgY29uc29sZS5ncm91cCgnJWPQktC40LTQtdC+0YHQuNGB0YLQtdC80LAnLCB0aGlzLmdyb3VwU3R5bGUpXG4gICAgY29uc29sZS5sb2coJ9CT0YDQsNGE0LjRh9C10YHQutCw0Y8g0LrQsNGA0YLQsDogJyArIHRoaXMuc3Bsb3Qud2ViZ2wuZ3B1LmhhcmR3YXJlKVxuICAgIGNvbnNvbGUubG9nKCfQktC10YDRgdC40Y8gR0w6ICcgKyB0aGlzLnNwbG90LndlYmdsLmdwdS5zb2Z0d2FyZSlcbiAgICBjb25zb2xlLmdyb3VwRW5kKClcbiAgfVxuXG4gIHB1YmxpYyBsb2dJbnN0YW5jZUluZm8oKTogdm9pZCB7XG5cbiAgICBjb25zb2xlLmdyb3VwKCclY9Cd0LDRgdGC0YDQvtC50LrQsCDQv9Cw0YDQsNC80LXRgtGA0L7QsiDRjdC60LfQtdC80L/Qu9GP0YDQsCcsIHRoaXMuZ3JvdXBTdHlsZSlcbiAgICBjb25zb2xlLmRpcih0aGlzLnNwbG90KVxuICAgIGNvbnNvbGUubG9nKCfQmtCw0L3QstCw0YE6ICMnICsgdGhpcy5zcGxvdC5jYW52YXMuaWQpXG4gICAgY29uc29sZS5sb2coJ9Cg0LDQt9C80LXRgCDQutCw0L3QstCw0YHQsDogJyArIHRoaXMuc3Bsb3QuY2FudmFzLndpZHRoICsgJyB4ICcgKyB0aGlzLnNwbG90LmNhbnZhcy5oZWlnaHQgKyAnIHB4JylcbiAgICBjb25zb2xlLmxvZygn0KDQsNC30LzQtdGAINC/0LvQvtGB0LrQvtGB0YLQuDogJyArIHRoaXMuc3Bsb3QuZ3JpZC53aWR0aCArICcgeCAnICsgdGhpcy5zcGxvdC5ncmlkLmhlaWdodCArICcgcHgnKVxuXG4gICAgaWYgKHRoaXMuc3Bsb3QuZGVtby5pc0VuYWJsZSkge1xuICAgICAgY29uc29sZS5sb2coJ9Ch0L/QvtGB0L7QsSDQv9C+0LvRg9GH0LXQvdC40Y8g0LTQsNC90L3Ri9GFOiAnICsgJ9C00LXQvNC+LdC00LDQvdC90YvQtScpXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKCfQodC/0L7RgdC+0LEg0L/QvtC70YPRh9C10L3QuNGPINC00LDQvdC90YvRhTogJyArICfQuNGC0LXRgNC40YDQvtCy0LDQvdC40LUnKVxuICAgIH1cbiAgICBjb25zb2xlLmdyb3VwRW5kKClcbiAgfVxuXG4gIHB1YmxpYyBsb2dTaGFkZXJzSW5mbygpOiB2b2lkIHtcbiAgICBjb25zb2xlLmdyb3VwKCclY9Ch0L7Qt9C00LDQvSDQstC10YDRiNC40L3QvdGL0Lkg0YjQtdC50LTQtdGAOiAnLCB0aGlzLmdyb3VwU3R5bGUpXG4gICAgY29uc29sZS5sb2codGhpcy5zcGxvdC5zaGFkZXJDb2RlVmVydClcbiAgICBjb25zb2xlLmdyb3VwRW5kKClcbiAgICBjb25zb2xlLmdyb3VwKCclY9Ch0L7Qt9C00LDQvSDRhNGA0LDQs9C80LXQvdGC0L3Ri9C5INGI0LXQudC00LXRgDogJywgdGhpcy5ncm91cFN0eWxlKVxuICAgIGNvbnNvbGUubG9nKHRoaXMuc3Bsb3Quc2hhZGVyQ29kZUZyYWcpXG4gICAgY29uc29sZS5ncm91cEVuZCgpXG4gIH1cblxuICBwdWJsaWMgbG9nRGF0YUxvYWRpbmdTdGFydCgpOiB2b2lkIHtcbiAgICBjb25zb2xlLmxvZygnJWPQl9Cw0L/Rg9GJ0LXQvSDQv9GA0L7RhtC10YHRgSDQt9Cw0LPRgNGD0LfQutC4INC00LDQvdC90YvRhSBbJyArIGdldEN1cnJlbnRUaW1lKCkgKyAnXS4uLicsIHRoaXMuZ3JvdXBTdHlsZSlcbiAgICBjb25zb2xlLnRpbWUoJ9CU0LvQuNGC0LXQu9GM0L3QvtGB0YLRjCcpXG4gIH1cblxuICBwdWJsaWMgbG9nRGF0YUxvYWRpbmdDb21wbGV0ZSgpOiB2b2lkIHtcbiAgICBjb25zb2xlLmdyb3VwKCclY9CX0LDQs9GA0YPQt9C60LAg0LTQsNC90L3Ri9GFINC30LDQstC10YDRiNC10L3QsCBbJyArIGdldEN1cnJlbnRUaW1lKCkgKyAnXScsIHRoaXMuZ3JvdXBTdHlsZSlcbiAgICBjb25zb2xlLnRpbWVFbmQoJ9CU0LvQuNGC0LXQu9GM0L3QvtGB0YLRjCcpXG4gICAgY29uc29sZS5sb2coJ9Cg0LDRgdGF0L7QtCDQstC40LTQtdC+0L/QsNC80Y/RgtC4OiAnICsgKHRoaXMuc3Bsb3Quc3RhdHMubWVtVXNhZ2UgLyAxMDAwMDAwKS50b0ZpeGVkKDIpLnRvTG9jYWxlU3RyaW5nKCkgKyAnINCc0JEnKVxuICAgIGNvbnNvbGUubG9nKCfQmtC+0Lst0LLQviDQvtCx0YrQtdC60YLQvtCyOiAnICsgdGhpcy5zcGxvdC5zdGF0cy5vYmplY3RzQ291bnRUb3RhbC50b0xvY2FsZVN0cmluZygpKVxuICAgIGNvbnNvbGUubG9nKCfQmtC+0Lst0LLQviDQs9GA0YPQv9C/INCx0YPRhNC10YDQvtCyOiAnICsgdGhpcy5zcGxvdC5zdGF0cy5ncm91cHNDb3VudC50b0xvY2FsZVN0cmluZygpKVxuICAgIGNvbnNvbGUubG9nKCfQoNC10LfRg9C70YzRgtCw0YI6ICcgKyAoKHRoaXMuc3Bsb3Quc3RhdHMub2JqZWN0c0NvdW50VG90YWwgPj0gdGhpcy5zcGxvdC5nbG9iYWxMaW1pdCkgP1xuICAgICAgJ9C00L7RgdGC0LjQs9C90YPRgiDQu9C40LzQuNGCINC+0LHRitC10LrRgtC+0LIgKCcgKyB0aGlzLnNwbG90Lmdsb2JhbExpbWl0LnRvTG9jYWxlU3RyaW5nKCkgKyAnKScgOlxuICAgICAgJ9C+0LHRgNCw0LHQvtGC0LDQvdGLINCy0YHQtSDQvtCx0YrQtdC60YLRiycpKVxuICAgIGNvbnNvbGUuZ3JvdXBFbmQoKVxuICB9XG5cbiAgcHVibGljIGxvZ1JlbmRlclN0YXJ0ZWQoKSB7XG4gICAgY29uc29sZS5sb2coJyVj0KDQtdC90LTQtdGAINC30LDQv9GD0YnQtdC9JywgdGhpcy5ncm91cFN0eWxlKVxuICB9XG5cbiAgcHVibGljIGxvZ1JlbmRlclN0b3BlZCgpIHtcbiAgICBjb25zb2xlLmxvZygnJWPQoNC10L3QtNC10YAg0L7RgdGC0LDQvdC+0LLQu9C10L0nLCB0aGlzLmdyb3VwU3R5bGUpXG4gIH1cblxuICBwdWJsaWMgbG9nQ2FudmFzQ2xlYXJlZChjb2xvcjogc3RyaW5nKSB7XG4gICAgY29uc29sZS5sb2coJyVj0JrQvtC90YLQtdC60YHRgiDRgNC10L3QtNC10YDQuNC90LPQsCDQvtGH0LjRidC10L0gWycgKyBjb2xvciArICddJywgdGhpcy5ncm91cFN0eWxlKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgcmFuZG9tSW50IH0gZnJvbSAnLi91dGlscydcbmltcG9ydCBTUGxvdCBmcm9tICcuL3NwbG90J1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTUGxvdERlbW8ge1xuXG4gIC8qKiDQn9GA0LjQt9C90LDQuiDQsNC60YLQuNCy0LDRhtC40Lgg0LTQtdC80L4t0YDQtdC20LjQvNCwLiAqL1xuICBwdWJsaWMgaXNFbmFibGU6IGJvb2xlYW4gPSBmYWxzZVxuXG4gIC8qKiDQmtC+0LvQuNGH0LXRgdGC0LLQviDQsdGK0LXQutGC0L7Qsi4gKi9cbiAgcHVibGljIGFtb3VudDogbnVtYmVyID0gMV8wMDBfMDAwXG5cbiAgLyoqINCc0LjQvdC40LzQsNC70YzQvdGL0Lkg0YDQsNC30LzQtdGAINC+0LHRitC10LrRgtC+0LIuICovXG4gIHB1YmxpYyBzaXplTWluOiBudW1iZXIgPSAxMFxuXG4gIC8qKiDQnNCw0LrRgdC40LzQsNC70YzQvdGL0Lkg0YDQsNC30LzQtdGAINC+0LHRitC10LrRgtC+0LIuICovXG4gIHB1YmxpYyBzaXplTWF4OiBudW1iZXIgPSAzMFxuXG4gIC8qKiDQptCy0LXRgtC+0LLQsNGPINC/0LDQu9C40YLRgNCwINC+0LHRitC10LrRgtC+0LIuICovXG4gIHB1YmxpYyBjb2xvcnM6IHN0cmluZ1tdID0gW1xuICAgICcjRDgxQzAxJywgJyNFOTk2N0EnLCAnI0JBNTVEMycsICcjRkZENzAwJywgJyNGRkU0QjUnLCAnI0ZGOEMwMCcsXG4gICAgJyMyMjhCMjInLCAnIzkwRUU5MCcsICcjNDE2OUUxJywgJyMwMEJGRkYnLCAnIzhCNDUxMycsICcjMDBDRUQxJ1xuICBdXG5cbiAgLyoqINCh0YfQtdGC0YfQuNC6INC40YLQtdGA0LjRgNGD0LXQvNGL0YUg0L7QsdGK0LXQutGC0L7Qsi4gKi9cbiAgcHJpdmF0ZSBpbmRleDogbnVtYmVyID0gMFxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcmVhZG9ubHkgc3Bsb3Q6IFNQbG90XG4gICkge31cblxuICAvKiog0J/QvtC00LPQvtGC0L7QstC60LAg0Log0LjRgdC/0L7Qu9GM0LfQvtCy0LDQvdC40Y4g0LTQtdC80L4t0YDQtdC20LjQvNCwLiAqL1xuICBwdWJsaWMgc2V0dXAoKTogdm9pZCB7XG4gICAgdGhpcy5pbmRleCA9IDBcbiAgfVxuXG4gIC8qKiDQmNC80LjRgtCw0YbQuNGPINC40YLQtdGA0LDRgtC+0YDQsCDQuNGB0YXQvtC00L3Ri9GFINC+0LHRitC10LrRgtC+0LIuICovXG4gIHB1YmxpYyBpdGVyYXRvcigpOiBTUGxvdE9iamVjdCB8IG51bGwge1xuICAgIGlmICh0aGlzLmluZGV4IDwgdGhpcy5hbW91bnQpIHtcbiAgICAgIHRoaXMuaW5kZXgrK1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgeDogcmFuZG9tSW50KHRoaXMuc3Bsb3QuZ3JpZC53aWR0aCEpLFxuICAgICAgICB5OiByYW5kb21JbnQodGhpcy5zcGxvdC5ncmlkLmhlaWdodCEpLFxuICAgICAgICBzaGFwZTogcmFuZG9tSW50KHRoaXMuc3Bsb3Quc2hhcGVzQ291bnQpLFxuICAgICAgICBzaXplOiB0aGlzLnNpemVNaW4gKyByYW5kb21JbnQodGhpcy5zaXplTWF4IC0gdGhpcy5zaXplTWluICsgMSksXG4gICAgICAgIGNvbG9yOiByYW5kb21JbnQodGhpcy5jb2xvcnMubGVuZ3RoKVxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgU1Bsb3QgZnJvbSAnLi9zcGxvdCdcbmltcG9ydCB7IGNvbG9yRnJvbUhleFRvR2xSZ2IgfSBmcm9tICcuL3V0aWxzJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTUGxvdFdlYkdsIHtcblxuICBwdWJsaWMgYWxwaGE6IGJvb2xlYW4gPSBmYWxzZVxuICBwdWJsaWMgZGVwdGg6IGJvb2xlYW4gPSBmYWxzZVxuICBwdWJsaWMgc3RlbmNpbDogYm9vbGVhbiA9IGZhbHNlXG4gIHB1YmxpYyBhbnRpYWxpYXM6IGJvb2xlYW4gPSBmYWxzZVxuICBwdWJsaWMgZGVzeW5jaHJvbml6ZWQ6IGJvb2xlYW4gPSBmYWxzZVxuICBwdWJsaWMgcHJlbXVsdGlwbGllZEFscGhhOiBib29sZWFuID0gZmFsc2VcbiAgcHVibGljIHByZXNlcnZlRHJhd2luZ0J1ZmZlcjogYm9vbGVhbiA9IGZhbHNlXG4gIHB1YmxpYyBmYWlsSWZNYWpvclBlcmZvcm1hbmNlQ2F2ZWF0OiBib29sZWFuID0gZmFsc2VcbiAgcHVibGljIHBvd2VyUHJlZmVyZW5jZTogV2ViR0xQb3dlclByZWZlcmVuY2UgPSAnaGlnaC1wZXJmb3JtYW5jZSdcblxuICBwdWJsaWMgZ3B1ID0geyBoYXJkd2FyZTogJycsIHNvZnR3YXJlOiAnJyB9XG4gIHB1YmxpYyBnbCE6IFdlYkdMUmVuZGVyaW5nQ29udGV4dFxuICBwcml2YXRlIGdwdVByb2dyYW0hOiBXZWJHTFByb2dyYW1cblxuICBwcml2YXRlIHZhcmlhYmxlczogTWFwPHN0cmluZywgYW55PiA9IG5ldyBNYXAoKVxuXG4gIHB1YmxpYyBkYXRhOiBNYXA8c3RyaW5nLCB7YnVmZmVyczogV2ViR0xCdWZmZXJbXSwgdHlwZTogbnVtYmVyfT4gPSBuZXcgTWFwKClcblxuICBwcml2YXRlIGdsTnVtYmVyVHlwZXM6IE1hcDxzdHJpbmcsIG51bWJlcj4gPSBuZXcgTWFwKClcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlYWRvbmx5IHNwbG90OiBTUGxvdFxuICApIHsgfVxuXG4gIC8qKlxuICAgKiDQodC+0LfQtNCw0LXRgiDQutC+0L3RgtC10LrRgdGCINGA0LXQvdC00LXRgNC40L3Qs9CwIFdlYkdMINC4INGD0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdGCINC60L7RgNGA0LXQutGC0L3Ri9C5INGA0LDQt9C80LXRgCDQvtCx0LvQsNGB0YLQuCDQv9GA0L7RgdC80L7RgtGA0LAuXG4gICAqL1xuICBwdWJsaWMgc2V0dXAoKTogdm9pZCB7XG5cbiAgICB0aGlzLmdsID0gdGhpcy5zcGxvdC5jYW52YXMuZ2V0Q29udGV4dCgnd2ViZ2wnLCB7XG4gICAgICBhbHBoYTogdGhpcy5hbHBoYSxcbiAgICAgIGRlcHRoOiB0aGlzLmRlcHRoLFxuICAgICAgc3RlbmNpbDogdGhpcy5zdGVuY2lsLFxuICAgICAgYW50aWFsaWFzOiB0aGlzLmFudGlhbGlhcyxcbiAgICAgIGRlc3luY2hyb25pemVkOiB0aGlzLmRlc3luY2hyb25pemVkLFxuICAgICAgcHJlbXVsdGlwbGllZEFscGhhOiB0aGlzLnByZW11bHRpcGxpZWRBbHBoYSxcbiAgICAgIHByZXNlcnZlRHJhd2luZ0J1ZmZlcjogdGhpcy5wcmVzZXJ2ZURyYXdpbmdCdWZmZXIsXG4gICAgICBmYWlsSWZNYWpvclBlcmZvcm1hbmNlQ2F2ZWF0OiB0aGlzLmZhaWxJZk1ham9yUGVyZm9ybWFuY2VDYXZlYXQsXG4gICAgICBwb3dlclByZWZlcmVuY2U6IHRoaXMucG93ZXJQcmVmZXJlbmNlXG4gICAgfSkhXG5cbiAgICBsZXQgZXh0ID0gdGhpcy5nbC5nZXRFeHRlbnNpb24oJ1dFQkdMX2RlYnVnX3JlbmRlcmVyX2luZm8nKVxuICAgIHRoaXMuZ3B1LmhhcmR3YXJlID0gKGV4dCkgPyB0aGlzLmdsLmdldFBhcmFtZXRlcihleHQuVU5NQVNLRURfUkVOREVSRVJfV0VCR0wpIDogJ1vQvdC10LjQt9Cy0LXRgdGC0L3Qvl0nXG4gICAgdGhpcy5ncHUuc29mdHdhcmUgPSB0aGlzLmdsLmdldFBhcmFtZXRlcih0aGlzLmdsLlZFUlNJT04pXG5cbiAgICB0aGlzLmdsTnVtYmVyVHlwZXMuc2V0KCdGbG9hdDMyQXJyYXknLCB0aGlzLmdsLkZMT0FUKVxuICAgIHRoaXMuZ2xOdW1iZXJUeXBlcy5zZXQoJ1VpbnQ4QXJyYXknLCB0aGlzLmdsLlVOU0lHTkVEX0JZVEUpXG4gICAgdGhpcy5nbE51bWJlclR5cGVzLnNldCgnVWludDE2QXJyYXknLCB0aGlzLmdsLlVOU0lHTkVEX1NIT1JUKVxuICAgIHRoaXMuZ2xOdW1iZXJUeXBlcy5zZXQoJ0ludDhBcnJheScsIHRoaXMuZ2wuQllURSlcbiAgICB0aGlzLmdsTnVtYmVyVHlwZXMuc2V0KCdJbnQxNkFycmF5JywgdGhpcy5nbC5TSE9SVClcblxuICAgIHRoaXMuc3Bsb3QuY2FudmFzLndpZHRoID0gdGhpcy5zcGxvdC5jYW52YXMuY2xpZW50V2lkdGhcbiAgICB0aGlzLnNwbG90LmNhbnZhcy5oZWlnaHQgPSB0aGlzLnNwbG90LmNhbnZhcy5jbGllbnRIZWlnaHRcblxuICAgIHRoaXMuZ2wudmlld3BvcnQoMCwgMCwgdGhpcy5zcGxvdC5jYW52YXMud2lkdGgsIHRoaXMuc3Bsb3QuY2FudmFzLmhlaWdodClcbiAgfVxuXG4gIHB1YmxpYyBzZXRCZ0NvbG9yKGNvbG9yOiBzdHJpbmcpIHtcbiAgICBsZXQgW3IsIGcsIGJdID0gY29sb3JGcm9tSGV4VG9HbFJnYihjb2xvcilcbiAgICB0aGlzLmdsLmNsZWFyQ29sb3IociwgZywgYiwgMC4wKVxuICB9XG5cbiAgcHVibGljIGNsZWFyQmFja2dyb3VuZCgpIHtcbiAgICB0aGlzLmdsLmNsZWFyKHRoaXMuZ2wuQ09MT1JfQlVGRkVSX0JJVCk7XG4gIH1cblxuICAvKipcbiAgICog0KHQvtC30LTQsNC10YIg0YjQtdC50LTQtdGAIFdlYkdMLlxuICAgKlxuICAgKiBAcGFyYW0gc2hhZGVyVHlwZSDQotC40L8g0YjQtdC50LTQtdGA0LAuXG4gICAqIEBwYXJhbSBzaGFkZXJDb2RlINCa0L7QtCDRiNC10LnQtNC10YDQsCDQvdCwINGP0LfRi9C60LUgR0xTTC5cbiAgICogQHJldHVybnMg0KHQvtC30LTQsNC90L3Ri9C5INC+0LHRitC10LrRgiDRiNC10LnQtNC10YDQsC5cbiAgICovXG4gIHB1YmxpYyBjcmVhdGVTaGFkZXIoc2hhZGVyVHlwZTogJ1ZFUlRFWF9TSEFERVInIHwgJ0ZSQUdNRU5UX1NIQURFUicsIHNoYWRlckNvZGU6IHN0cmluZyk6IFdlYkdMU2hhZGVyIHtcblxuICAgIC8vINCh0L7Qt9C00LDQvdC40LUsINC/0YDQuNCy0Y/Qt9C60LAg0LrQvtC00LAg0Lgg0LrQvtC80L/QuNC70Y/RhtC40Y8g0YjQtdC50LTQtdGA0LAuXG4gICAgY29uc3Qgc2hhZGVyID0gdGhpcy5nbC5jcmVhdGVTaGFkZXIodGhpcy5nbFtzaGFkZXJUeXBlXSkhXG4gICAgdGhpcy5nbC5zaGFkZXJTb3VyY2Uoc2hhZGVyLCBzaGFkZXJDb2RlKVxuICAgIHRoaXMuZ2wuY29tcGlsZVNoYWRlcihzaGFkZXIpXG5cbiAgICBpZiAoIXRoaXMuZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKHNoYWRlciwgdGhpcy5nbC5DT01QSUxFX1NUQVRVUykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcign0J7RiNC40LHQutCwINC60L7QvNC/0LjQu9GP0YbQuNC4INGI0LXQudC00LXRgNCwIFsnICsgc2hhZGVyVHlwZSArICddLiAnICsgdGhpcy5nbC5nZXRTaGFkZXJJbmZvTG9nKHNoYWRlcikpXG4gICAgfVxuXG4gICAgcmV0dXJuIHNoYWRlclxuICB9XG5cbiAgLyoqXG4gICAqINCh0L7Qt9C00LDQtdGCINC/0YDQvtCz0YDQsNC80LzRgyBXZWJHTC5cbiAgICpcbiAgICogQHBhcmFtIHtXZWJHTFNoYWRlcn0gdmVydGV4U2hhZGVyINCS0LXRgNGI0LjQvdC90YvQuSDRiNC10LnQtNC10YAuXG4gICAqIEBwYXJhbSB7V2ViR0xTaGFkZXJ9IGZyYWdtZW50U2hhZGVyINCk0YDQsNCz0LzQtdC90YLQvdGL0Lkg0YjQtdC50LTQtdGALlxuICAgKi9cbiAgcHVibGljIGNyZWF0ZVByb2dyYW1Gcm9tU2hhZGVycyhzaGFkZXJWZXJ0OiBXZWJHTFNoYWRlciwgc2hhZGVyRnJhZzogV2ViR0xTaGFkZXIpOiB2b2lkIHtcbiAgICB0aGlzLmdwdVByb2dyYW0gPSB0aGlzLmdsLmNyZWF0ZVByb2dyYW0oKSFcbiAgICB0aGlzLmdsLmF0dGFjaFNoYWRlcih0aGlzLmdwdVByb2dyYW0sIHNoYWRlclZlcnQpXG4gICAgdGhpcy5nbC5hdHRhY2hTaGFkZXIodGhpcy5ncHVQcm9ncmFtLCBzaGFkZXJGcmFnKVxuICAgIHRoaXMuZ2wubGlua1Byb2dyYW0odGhpcy5ncHVQcm9ncmFtKVxuICAgIHRoaXMuZ2wudXNlUHJvZ3JhbSh0aGlzLmdwdVByb2dyYW0pXG4gIH1cblxuICBwdWJsaWMgY3JlYXRlUHJvZ3JhbShzaGFkZXJDb2RlVmVydDogc3RyaW5nLCBzaGFkZXJDb2RlRnJhZzogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5jcmVhdGVQcm9ncmFtRnJvbVNoYWRlcnMoXG4gICAgICB0aGlzLmNyZWF0ZVNoYWRlcignVkVSVEVYX1NIQURFUicsIHNoYWRlckNvZGVWZXJ0KSxcbiAgICAgIHRoaXMuY3JlYXRlU2hhZGVyKCdGUkFHTUVOVF9TSEFERVInLCBzaGFkZXJDb2RlRnJhZylcbiAgICApXG4gIH1cblxuICAvKipcbiAgICog0KPRgdGC0LDQvdCw0LLQu9C40LLQsNC10YIg0YHQstGP0LfRjCDQv9C10YDQtdC80LXQvdC90L7QuSDQv9GA0LjQu9C+0LbQtdC90LjRjyDRgSDQv9GA0L7Qs9GA0LDQvNC80L7QuSBXZWJHbC5cbiAgICpcbiAgICogQHBhcmFtIHZhclR5cGUg0KLQuNC/INC/0LXRgNC10LzQtdC90L3QvtC5LlxuICAgKiBAcGFyYW0gdmFyTmFtZSDQmNC80Y8g0L/QtdGA0LXQvNC10L3QvdC+0LkuXG4gICAqL1xuICBwdWJsaWMgY3JlYXRlVmFyaWFibGUodmFyTmFtZTogc3RyaW5nKTogdm9pZCB7XG5cbiAgICBjb25zdCB2YXJUeXBlID0gdmFyTmFtZS5zbGljZSgwLCAyKVxuXG4gICAgaWYgKHZhclR5cGUgPT09ICd1XycpIHtcbiAgICAgIHRoaXMudmFyaWFibGVzLnNldCh2YXJOYW1lLCB0aGlzLmdsLmdldFVuaWZvcm1Mb2NhdGlvbih0aGlzLmdwdVByb2dyYW0sIHZhck5hbWUpKVxuICAgIH0gZWxzZSBpZiAodmFyVHlwZSA9PT0gJ2FfJykge1xuICAgICAgdGhpcy52YXJpYWJsZXMuc2V0KHZhck5hbWUsIHRoaXMuZ2wuZ2V0QXR0cmliTG9jYXRpb24odGhpcy5ncHVQcm9ncmFtLCB2YXJOYW1lKSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCfQndC1INGD0LrQsNC30LDQvSDRgtC40L8gKNC/0YDQtdGE0LjQutGBKSDQv9C10YDQtdC80LXQvdC90L7QuSDRiNC10LnQtNC10YDQsDogJyArIHZhck5hbWUpXG4gICAgfVxuICB9XG5cbiAgcHVibGljIGNyZWF0ZVZhcmlhYmxlcyguLi52YXJOYW1lczogc3RyaW5nW10pOiB2b2lkIHtcbiAgICB2YXJOYW1lcy5mb3JFYWNoKHZhck5hbWUgPT4gdGhpcy5jcmVhdGVWYXJpYWJsZSh2YXJOYW1lKSk7XG4gIH1cbiAgLyoqXG4gICAqINCh0L7Qt9C00LDQtdGCINCyINC80LDRgdGB0LjQstC1INCx0YPRhNC10YDQvtCyIFdlYkdMINC90L7QstGL0Lkg0LHRg9GE0LXRgCDQuCDQt9Cw0L/QuNGB0YvQstCw0LXRgiDQsiDQvdC10LPQviDQv9C10YDQtdC00LDQvdC90YvQtSDQtNCw0L3QvdGL0LUuXG4gICAqXG4gICAqIEBwYXJhbSBidWZmZXJzIC0g0JzQsNGB0YHQuNCyINCx0YPRhNC10YDQvtCyIFdlYkdMLCDQsiDQutC+0YLQvtGA0YvQuSDQsdGD0LTQtdGCINC00L7QsdCw0LLQu9C10L0g0YHQvtC30LTQsNCy0LDQtdC80YvQuSDQsdGD0YTQtdGALlxuICAgKiBAcGFyYW0gdHlwZSAtINCi0LjQvyDRgdC+0LfQtNCw0LLQsNC10LzQvtCz0L4g0LHRg9GE0LXRgNCwLlxuICAgKiBAcGFyYW0gZGF0YSAtINCU0LDQvdC90YvQtSDQsiDQstC40LTQtSDRgtC40L/QuNC30LjRgNC+0LLQsNC90L3QvtCz0L4g0LzQsNGB0YHQuNCy0LAg0LTQu9GPINC30LDQv9C40YHQuCDQsiDRgdC+0LfQtNCw0LLQsNC10LzRi9C5INCx0YPRhNC10YAuXG4gICAqIEBwYXJhbSBrZXkgLSDQmtC70Y7RhyAo0LjQvdC00LXQutGBKSwg0LjQtNC10L3RgtC40YTQuNGG0LjRgNGD0Y7RidC40Lkg0YLQuNC/INCx0YPRhNC10YDQsCAo0LTQu9GPINCy0LXRgNGI0LjQvSwg0LTQu9GPINGG0LLQtdGC0L7Qsiwg0LTQu9GPINC40L3QtNC10LrRgdC+0LIpLiDQmNGB0L/QvtC70YzQt9GD0LXRgtGB0Y8g0LTQu9GPXG4gICAqICAgICDRgNCw0LfQtNC10LvRjNC90L7Qs9C+INC/0L7QtNGB0YfQtdGC0LAg0L/QsNC80Y/RgtC4LCDQt9Cw0L3QuNC80LDQtdC80L7QuSDQutCw0LbQtNGL0Lwg0YLQuNC/0L7QvCDQsdGD0YTQtdGA0LAuXG4gICAqL1xuICBwdWJsaWMgY3JlYXRlQnVmZmVyKGdyb3VwTmFtZTogc3RyaW5nLCBkYXRhOiBUeXBlZEFycmF5KTogbnVtYmVyIHtcblxuICAgIGNvbnN0IGJ1ZmZlciA9IHRoaXMuZ2wuY3JlYXRlQnVmZmVyKCkhXG4gICAgdGhpcy5nbC5iaW5kQnVmZmVyKHRoaXMuZ2wuQVJSQVlfQlVGRkVSLCBidWZmZXIpXG4gICAgdGhpcy5nbC5idWZmZXJEYXRhKHRoaXMuZ2wuQVJSQVlfQlVGRkVSLCBkYXRhLCB0aGlzLmdsLlNUQVRJQ19EUkFXKVxuXG4gICAgaWYgKCF0aGlzLmRhdGEuaGFzKGdyb3VwTmFtZSkpIHtcbiAgICAgIHRoaXMuZGF0YS5zZXQoZ3JvdXBOYW1lLCB7IGJ1ZmZlcnM6IFtdLCB0eXBlOiB0aGlzLmdsTnVtYmVyVHlwZXMuZ2V0KGRhdGEuY29uc3RydWN0b3IubmFtZSkhfSlcbiAgICB9XG5cbiAgICB0aGlzLmRhdGEuZ2V0KGdyb3VwTmFtZSkhLmJ1ZmZlcnMucHVzaChidWZmZXIpXG5cbiAgICByZXR1cm4gZGF0YS5sZW5ndGggKiBkYXRhLkJZVEVTX1BFUl9FTEVNRU5UXG4gIH1cblxuICBwdWJsaWMgc2V0VmFyaWFibGUodmFyTmFtZTogc3RyaW5nLCB2YXJWYWx1ZTogbnVtYmVyW10pIHtcbiAgICB0aGlzLmdsLnVuaWZvcm1NYXRyaXgzZnYodGhpcy52YXJpYWJsZXMuZ2V0KHZhck5hbWUpLCBmYWxzZSwgdmFyVmFsdWUpXG4gIH1cblxuICBwdWJsaWMgc2V0QnVmZmVyKGdyb3VwTmFtZTogc3RyaW5nLCBpbmRleDogbnVtYmVyLCB2YXJOYW1lOiBzdHJpbmcsIHNpemU6IG51bWJlciwgc3RyaWRlOiBudW1iZXIsIG9mZnNldDogbnVtYmVyKSB7XG4gICAgY29uc3QgZ3JvdXAgPSB0aGlzLmRhdGEuZ2V0KGdyb3VwTmFtZSkhXG4gICAgY29uc3QgdmFyaWFibGUgPSB0aGlzLnZhcmlhYmxlcy5nZXQodmFyTmFtZSlcblxuICAgIHRoaXMuZ2wuYmluZEJ1ZmZlcih0aGlzLmdsLkFSUkFZX0JVRkZFUiwgZ3JvdXAuYnVmZmVyc1tpbmRleF0pXG4gICAgdGhpcy5nbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheSh2YXJpYWJsZSlcbiAgICB0aGlzLmdsLnZlcnRleEF0dHJpYlBvaW50ZXIodmFyaWFibGUsIHNpemUsIGdyb3VwLnR5cGUsIGZhbHNlLCBzdHJpZGUsIG9mZnNldClcbiAgfVxuXG4gIHB1YmxpYyBkcmF3UG9pbnRzKGZpcnN0OiBudW1iZXIsIGNvdW50OiBudW1iZXIpIHtcbiAgICB0aGlzLmdsLmRyYXdBcnJheXModGhpcy5nbC5QT0lOVFMsIGZpcnN0LCBjb3VudClcbiAgfVxufVxuIiwiaW1wb3J0IHsgY29weU1hdGNoaW5nS2V5VmFsdWVzLCBjb2xvckZyb21IZXhUb0dsUmdiIH0gZnJvbSAnLi91dGlscydcbmltcG9ydCBTSEFERVJfQ09ERV9WRVJUX1RNUEwgZnJvbSAnLi9zaGFkZXItY29kZS12ZXJ0LXRtcGwnXG5pbXBvcnQgU0hBREVSX0NPREVfRlJBR19UTVBMIGZyb20gJy4vc2hhZGVyLWNvZGUtZnJhZy10bXBsJ1xuaW1wb3J0IFNQbG90Q29udG9sIGZyb20gJy4vc3Bsb3QtY29udHJvbCdcbmltcG9ydCBTUGxvdFdlYkdsIGZyb20gJy4vc3Bsb3Qtd2ViZ2wnXG5pbXBvcnQgU1Bsb3REZWJ1ZyBmcm9tICcuL3NwbG90LWRlYnVnJ1xuaW1wb3J0IFNQbG90RGVtbyBmcm9tICcuL3NwbG90LWRlbW8nXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNQbG90IHtcblxuICAvKiog0KTRg9C90LrRhtC40Y8g0LjRgtC10YDQuNGA0L7QstCw0L3QuNGPINC40YHRhdC+0LTQvdGL0YUg0LTQsNC90L3Ri9GFLiAqL1xuICBwdWJsaWMgaXRlcmF0b3I6IFNQbG90SXRlcmF0b3IgPSB1bmRlZmluZWRcblxuICAvKiog0KXQtdC70L/QtdGAINGA0LXQttC40LzQsCDQtNC10LzQvi3QtNCw0L3QvdGL0YUuICovXG4gIHB1YmxpYyBkZW1vOiBTUGxvdERlbW8gPSBuZXcgU1Bsb3REZW1vKHRoaXMpXG5cbiAgLyoqINCl0LXQu9C/0LXRgCDRgNC10LbQuNC80LAg0L7RgtC70LDQtNC60LguICovXG4gIHB1YmxpYyBkZWJ1ZzogU1Bsb3REZWJ1ZyA9IG5ldyBTUGxvdERlYnVnKHRoaXMpXG5cbiAgLyoqINCl0LXQu9C/0LXRgCBXZWJHTC4gKi9cbiAgcHVibGljIHdlYmdsOiBTUGxvdFdlYkdsID0gbmV3IFNQbG90V2ViR2wodGhpcylcblxuICAvKiog0J/RgNC40LfQvdCw0Log0YTQvtGA0YHQuNGA0L7QstCw0L3QvdC+0LPQviDQt9Cw0L/Rg9GB0LrQsCDRgNC10L3QtNC10YDQsC4gKi9cbiAgcHVibGljIGZvcmNlUnVuOiBib29sZWFuID0gZmFsc2VcblxuICAvKiog0J7Qs9GA0LDQvdC40YfQtdC90LjQtSDQutC+0Lst0LLQsCDQvtCx0YrQtdC60YLQvtCyINC90LAg0LPRgNCw0YTQuNC60LUuICovXG4gIHB1YmxpYyBnbG9iYWxMaW1pdDogbnVtYmVyID0gMV8wMDBfMDAwXzAwMFxuXG4gIC8qKiDQntCz0YDQsNC90LjRh9C10L3QuNC1INC60L7Quy3QstCwINC+0LHRitC10LrRgtC+0LIg0LIg0LPRgNGD0L/Qv9C1LiAqL1xuICBwdWJsaWMgZ3JvdXBMaW1pdDogbnVtYmVyID0gMTBfMDAwXG5cbiAgLyoqINCm0LLQtdGC0L7QstCw0Y8g0L/QsNC70LjRgtGA0LAg0L7QsdGK0LXQutGC0L7Qsi4gKi9cbiAgcHVibGljIGNvbG9yczogc3RyaW5nW10gPSBbXVxuXG4gIC8qKiDQn9Cw0YDQsNC80LXRgtGA0Ysg0LrQvtC+0YDQtNC40L3QsNGC0L3QvtC5INC/0LvQvtGB0LrQvtGB0YLQuC4gKi9cbiAgcHVibGljIGdyaWQ6IFNQbG90R3JpZCA9IHtcbiAgICB3aWR0aDogMzJfMDAwLFxuICAgIGhlaWdodDogMTZfMDAwLFxuICAgIGJnQ29sb3I6ICcjZmZmZmZmJyxcbiAgICBydWxlc0NvbG9yOiAnI2MwYzBjMCdcbiAgfVxuXG4gIC8qKiDQn9Cw0YDQsNC80LXRgtGA0Ysg0L7QsdC70LDRgdGC0Lgg0L/RgNC+0YHQvNC+0YLRgNCwLiAqL1xuICBwdWJsaWMgY2FtZXJhOiBTUGxvdENhbWVyYSA9IHtcbiAgICB4OiB0aGlzLmdyaWQud2lkdGghIC8gMixcbiAgICB5OiB0aGlzLmdyaWQuaGVpZ2h0ISAvIDIsXG4gICAgem9vbTogMVxuICB9XG5cbiAgLyoqINCf0YDQuNC30L3QsNC6INC90LXQvtCx0YXQvtC00LjQvNC+0YHRgtC4INCx0LXQt9C+0YLQu9Cw0LPQsNGC0LXQu9GM0L3QvtCz0L4g0LfQsNC/0YPRgdC60LAg0YDQtdC90LTQtdGA0LAuICovXG4gIHB1YmxpYyBpc1J1bm5pbmc6IGJvb2xlYW4gPSBmYWxzZVxuXG4gIC8qKiDQmtC+0LvQuNGH0LXRgdGC0LLQviDRgNCw0LfQu9C40YfQvdGL0YUg0YTQvtGA0Lwg0L7QsdGK0LXQutGC0L7Qsi4gKi9cbiAgcHVibGljIHNoYXBlc0NvdW50OiBudW1iZXIgPSAyXG5cbiAgLyoqIEdMU0wt0LrQvtC00Ysg0YjQtdC50LTQtdGA0L7Qsi4gKi9cbiAgcHVibGljIHNoYWRlckNvZGVWZXJ0OiBzdHJpbmcgPSAnJ1xuICBwdWJsaWMgc2hhZGVyQ29kZUZyYWc6IHN0cmluZyA9ICcnXG5cbiAgLyoqINCh0YLQsNGC0LjRgdGC0LjRh9C10YHQutCw0Y8g0LjQvdGE0L7RgNC80LDRhtC40Y8uICovXG4gIHB1YmxpYyBzdGF0cyA9IHtcbiAgICBvYmplY3RzQ291bnRUb3RhbDogMCxcbiAgICBvYmplY3RzQ291bnRJbkdyb3VwczogW10gYXMgbnVtYmVyW10sXG4gICAgZ3JvdXBzQ291bnQ6IDAsXG4gICAgbWVtVXNhZ2U6IDBcbiAgfVxuXG4gIC8qKiDQpdC10LvQv9C10YAg0LLQt9Cw0LjQvNC+0LTQtdC50YHRgtCy0LjRjyDRgSDRg9GB0YLRgNC+0LnRgdGC0LLQvtC8INCy0LLQvtC00LAuICovXG4gIHByb3RlY3RlZCBjb250cm9sOiBTUGxvdENvbnRvbCA9IG5ldyBTUGxvdENvbnRvbCh0aGlzKVxuXG4gIHB1YmxpYyBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50XG5cbiAgLyoqXG4gICAqINCh0L7Qt9C00LDQtdGCINGN0LrQt9C10LzQv9C70Y/RgCDQutC70LDRgdGB0LAsINC40L3QuNGG0LjQsNC70LjQt9C40YDRg9C10YIg0L3QsNGB0YLRgNC+0LnQutC4LlxuICAgKlxuICAgKiBAcmVtYXJrc1xuICAgKiDQldGB0LvQuCDQutCw0L3QstCw0YEg0YEg0LfQsNC00LDQvdC90YvQvCDQuNC00LXQvdGC0LjRhNC40LrQsNGC0L7RgNC+0Lwg0L3QtSDQvdCw0LnQtNC10L0gLSDQs9C10L3QtdGA0LjRgNGD0LXRgtGB0Y8g0L7RiNC40LHQutCwLiDQndCw0YHRgtGA0L7QudC60Lgg0LzQvtCz0YPRgiDQsdGL0YLRjCDQt9Cw0LTQsNC90Ysg0LrQsNC6INCyXG4gICAqINC60L7QvdGB0YLRgNGD0LrRgtC+0YDQtSwg0YLQsNC6INC4INCyINC80LXRgtC+0LTQtSB7QGxpbmsgc2V0dXB9LiDQntC00L3QsNC60L4g0LIg0LvRjtCx0L7QvCDRgdC70YPRh9Cw0LUg0L3QsNGB0YLRgNC+0LnQutC4INC00L7Qu9C20L3RiyDQsdGL0YLRjCDQt9Cw0LTQsNC90Ysg0LTQviDQt9Cw0L/Rg9GB0LrQsCDRgNC10L3QtNC10YDQsC5cbiAgICpcbiAgICogQHBhcmFtIGNhbnZhc0lkIC0g0JjQtNC10L3RgtC40YTQuNC60LDRgtC+0YAg0LrQsNC90LLQsNGB0LAsINC90LAg0LrQvtGC0L7RgNC+0Lwg0LHRg9C00LXRgiDRgNC40YHQvtCy0LDRgtGM0YHRjyDQs9GA0LDRhNC40LouXG4gICAqIEBwYXJhbSBvcHRpb25zIC0g0J/QvtC70YzQt9C+0LLQsNGC0LXQu9GM0YHQutC40LUg0L3QsNGB0YLRgNC+0LnQutC4INGN0LrQt9C10LzQv9C70Y/RgNCwLlxuICAgKi9cbiAgY29uc3RydWN0b3IoY2FudmFzSWQ6IHN0cmluZywgb3B0aW9ucz86IFNQbG90T3B0aW9ucykge1xuXG4gICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNhbnZhc0lkKSkge1xuICAgICAgdGhpcy5jYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChjYW52YXNJZCkgYXMgSFRNTENhbnZhc0VsZW1lbnRcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCfQmtCw0L3QstCw0YEg0YEg0LjQtNC10L3RgtC40YTQuNC60LDRgtC+0YDQvtC8IFwiIycgKyBjYW52YXNJZCArICdcIiDQvdC1INC90LDQudC00LXQvSEnKVxuICAgIH1cblxuICAgIGlmIChvcHRpb25zKSB7XG4gICAgICB0aGlzLnNldE9wdGlvbnMob3B0aW9ucykgICAgLy8g0JXRgdC70Lgg0L/QtdGA0LXQtNCw0L3RiyDQvdCw0YHRgtGA0L7QudC60LgsINGC0L4g0L7QvdC4INC/0YDQuNC80LXQvdGP0Y7RgtGB0Y8uXG5cbiAgICAgIGlmICh0aGlzLmZvcmNlUnVuKSB7XG4gICAgICAgIHRoaXMuc2V0dXAob3B0aW9ucykgICAgICAgLy8gINCY0L3QuNGG0LjQsNC70LjQt9Cw0YbQuNGPINCy0YHQtdGFINC/0LDRgNCw0LzQtdGC0YDQvtCyINGA0LXQvdC00LXRgNCwLCDQtdGB0LvQuCDQt9Cw0L/RgNC+0YjQtdC9INGE0L7RgNGB0LjRgNC+0LLQsNC90L3Ri9C5INC30LDQv9GD0YHQui5cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICog0JjQvdC40YbQuNCw0LvQuNC30LjRgNGD0LXRgiDQvdC10L7QsdGF0L7QtNC40LzRi9C1INC00LvRjyDRgNC10L3QtNC10YDQsCDQv9Cw0YDQsNC80LXRgtGA0Ysg0Y3QutC30LXQvNC/0LvRj9GA0LAg0LggV2ViR0wuXG4gICAqXG4gICAqIEBwYXJhbSBvcHRpb25zIC0g0J/QvtC70YzQt9C+0LLQsNGC0LXQu9GM0YHQutC40LUg0L3QsNGB0YLRgNC+0LnQutC4INGN0LrQt9C10LzQv9C70Y/RgNCwLlxuICAgKi9cbiAgcHVibGljIHNldHVwKG9wdGlvbnM6IFNQbG90T3B0aW9ucyk6IHZvaWQge1xuXG4gICAgdGhpcy5zZXRPcHRpb25zKG9wdGlvbnMpICAgIC8vINCf0YDQuNC80LXQvdC10L3QuNC1INC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjNGB0LrQuNGFINC90LDRgdGC0YDQvtC10LouXG5cbiAgICB0aGlzLndlYmdsLnNldHVwKCkgICAgICAgICAvLyDQodC+0LfQtNCw0L3QuNC1INC60L7QvdGC0LXQutGB0YLQsCDRgNC10L3QtNC10YDQuNC90LPQsC5cbiAgICB0aGlzLmNvbnRyb2wuc2V0dXAodGhpcylcbiAgICB0aGlzLmRlYnVnLnNldHVwKClcbiAgICB0aGlzLmRlbW8uc2V0dXAoKVxuXG4gICAgaWYgKHRoaXMuZGVidWcuaXNFbmFibGUpIHtcbiAgICAgIHRoaXMuZGVidWcubG9nSW50cm8oKVxuICAgICAgdGhpcy5kZWJ1Zy5sb2dHcHVJbmZvKClcbiAgICAgIHRoaXMuZGVidWcubG9nSW5zdGFuY2VJbmZvKClcbiAgICB9XG5cbiAgICB0aGlzLndlYmdsLnNldEJnQ29sb3IodGhpcy5ncmlkLmJnQ29sb3IhKSAgICAvLyDQo9GB0YLQsNC90L7QstC60LAg0YbQstC10YLQsCDQvtGH0LjRgdGC0LrQuCDRgNC10L3QtNC10YDQuNC90LPQsFxuXG4gICAgdGhpcy5zaGFkZXJDb2RlVmVydCA9IFNIQURFUl9DT0RFX1ZFUlRfVE1QTC5yZXBsYWNlKCd7RVhULUNPREV9JywgdGhpcy5nZW5TaGFkZXJDb2xvckNvZGUoKSkudHJpbSgpXG4gICAgdGhpcy5zaGFkZXJDb2RlRnJhZyA9IFNIQURFUl9DT0RFX0ZSQUdfVE1QTC50cmltKClcblxuICAgIHRoaXMud2ViZ2wuY3JlYXRlUHJvZ3JhbSh0aGlzLnNoYWRlckNvZGVWZXJ0LCB0aGlzLnNoYWRlckNvZGVGcmFnKSAgICAvLyDQodC+0LfQtNCw0L3QuNC1INC/0YDQvtCz0YDQsNC80LzRiyBXZWJHTC5cblxuICAgIGlmICh0aGlzLmRlYnVnLmlzRW5hYmxlKSB7XG4gICAgICB0aGlzLmRlYnVnLmxvZ1NoYWRlcnNJbmZvKClcbiAgICB9XG5cbiAgICAvLyDQodC+0LfQtNCw0L3QuNC1INC/0LXRgNC10LzQtdC90L3Ri9GFIFdlYkdsLlxuICAgIHRoaXMud2ViZ2wuY3JlYXRlVmFyaWFibGVzKCdhX3Bvc2l0aW9uJywgJ2FfY29sb3InLCAnYV9zaXplJywgJ2Ffc2hhcGUnLCAndV9tYXRyaXgnKVxuXG4gICAgdGhpcy5sb2FkRGF0YSgpICAgIC8vINCX0LDQv9C+0LvQvdC10L3QuNC1INCx0YPRhNC10YDQvtCyIFdlYkdMLlxuXG4gICAgaWYgKHRoaXMuZm9yY2VSdW4pIHtcbiAgICAgIHRoaXMucnVuKCkgICAgICAgICAgICAgICAgLy8g0KTQvtGA0YHQuNGA0L7QstCw0L3QvdGL0Lkg0LfQsNC/0YPRgdC6INGA0LXQvdC00LXRgNC40L3Qs9CwICjQtdGB0LvQuCDRgtGA0LXQsdGD0LXRgtGB0Y8pLlxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDQn9GA0LjQvNC10L3Rj9C10YIg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GM0YHQutC40LUg0L3QsNGB0YLRgNC+0LnQutC4INGN0LrQt9C10LzQv9C70Y/RgNCwLlxuICAgKlxuICAgKiBAcGFyYW0gb3B0aW9ucyAtINCf0L7Qu9GM0LfQvtCy0LDRgtC10LvRjNGB0LrQuNC1INC90LDRgdGC0YDQvtC50LrQuCDRjdC60LfQtdC80L/Qu9GP0YDQsC5cbiAgICovXG4gIHByb3RlY3RlZCBzZXRPcHRpb25zKG9wdGlvbnM6IFNQbG90T3B0aW9ucyk6IHZvaWQge1xuXG4gICAgY29weU1hdGNoaW5nS2V5VmFsdWVzKHRoaXMsIG9wdGlvbnMpICAgIC8vINCf0YDQuNC80LXQvdC10L3QuNC1INC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjNGB0LrQuNGFINC90LDRgdGC0YDQvtC10LouXG5cbiAgICAvLyDQldGB0LvQuCDQt9Cw0LTQsNC9INGA0LDQt9C80LXRgCDQv9C70L7RgdC60L7RgdGC0LgsINC90L4g0L3QtSDQt9Cw0LTQsNC90L4g0L/QvtC70L7QttC10L3QuNC1INC+0LHQu9Cw0YHRgtC4INC/0YDQvtGB0LzQvtGC0YDQsCwg0YLQviDQvtCx0LvQsNGB0YLRjCDQv9C+0LzQtdGJ0LDQtdGC0YHRjyDQsiDRhtC10L3RgtGAINC/0LvQvtGB0LrQvtGB0YLQuC5cbiAgICBpZiAoKCdncmlkJyBpbiBvcHRpb25zKSAmJiAhKCdjYW1lcmEnIGluIG9wdGlvbnMpKSB7XG4gICAgICB0aGlzLmNhbWVyYS54ID0gdGhpcy5ncmlkLndpZHRoISAvIDJcbiAgICAgIHRoaXMuY2FtZXJhLnkgPSB0aGlzLmdyaWQuaGVpZ2h0ISAvIDJcbiAgICB9XG5cbiAgICBpZiAodGhpcy5kZW1vLmlzRW5hYmxlKSB7XG4gICAgICB0aGlzLml0ZXJhdG9yID0gdGhpcy5kZW1vLml0ZXJhdG9yLmJpbmQodGhpcy5kZW1vKSAgICAvLyDQmNC80LjRgtCw0YbQuNGPINC40YLQtdGA0LjRgNC+0LLQsNC90LjRjyDQtNC70Y8g0LTQtdC80L4t0YDQtdC20LjQvNCwLlxuICAgICAgdGhpcy5jb2xvcnMgPSB0aGlzLmRlbW8uY29sb3JzXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqINCh0L7Qt9C00LDQtdGCINC4INC30LDQv9C+0LvQvdGP0LXRgiDQtNCw0L3QvdGL0LzQuCDQvtCx0L4g0LLRgdC10YUg0L/QvtC70LjQs9C+0L3QsNGFINCx0YPRhNC10YDRiyBXZWJHTC5cbiAgICovXG4gIHByb3RlY3RlZCBsb2FkRGF0YSgpOiB2b2lkIHtcblxuICAgIGlmICh0aGlzLmRlYnVnLmlzRW5hYmxlKSB7XG4gICAgICB0aGlzLmRlYnVnLmxvZ0RhdGFMb2FkaW5nU3RhcnQoKVxuICAgIH1cblxuICAgIGxldCBwb2x5Z29uR3JvdXA6IFNQbG90UG9seWdvbkdyb3VwID0geyB2ZXJ0aWNlczogW10sIGNvbG9yczogW10sIHNpemVzOiBbXSwgc2hhcGVzOiBbXSwgYW1vdW50T2ZWZXJ0aWNlczogMCB9XG5cbiAgICB0aGlzLnN0YXRzID0ge1xuICAgICAgb2JqZWN0c0NvdW50VG90YWw6IDAsXG4gICAgICBvYmplY3RzQ291bnRJbkdyb3VwczogW10gYXMgbnVtYmVyW10sXG4gICAgICBncm91cHNDb3VudDogMCxcbiAgICAgIG1lbVVzYWdlOiAwXG4gICAgfVxuXG4gICAgbGV0IG9iamVjdDogU1Bsb3RPYmplY3QgfCBudWxsIHwgdW5kZWZpbmVkXG4gICAgbGV0IGs6IG51bWJlciA9IDBcbiAgICBsZXQgaXNPYmplY3RFbmRzOiBib29sZWFuID0gZmFsc2VcblxuICAgIHdoaWxlICghaXNPYmplY3RFbmRzKSB7XG5cbiAgICAgIG9iamVjdCA9IHRoaXMuaXRlcmF0b3IhKClcbiAgICAgIGlzT2JqZWN0RW5kcyA9IChvYmplY3QgPT09IG51bGwpIHx8ICh0aGlzLnN0YXRzLm9iamVjdHNDb3VudFRvdGFsID49IHRoaXMuZ2xvYmFsTGltaXQpXG5cbiAgICAgIGlmICghaXNPYmplY3RFbmRzKSB7XG4gICAgICAgIHBvbHlnb25Hcm91cC52ZXJ0aWNlcy5wdXNoKG9iamVjdCEueCwgb2JqZWN0IS55KVxuICAgICAgICBwb2x5Z29uR3JvdXAuc2hhcGVzLnB1c2gob2JqZWN0IS5zaGFwZSlcbiAgICAgICAgcG9seWdvbkdyb3VwLnNpemVzLnB1c2gob2JqZWN0IS5zaXplKVxuICAgICAgICBwb2x5Z29uR3JvdXAuY29sb3JzLnB1c2gob2JqZWN0IS5jb2xvcilcbiAgICAgICAgaysrXG4gICAgICAgIHRoaXMuc3RhdHMub2JqZWN0c0NvdW50VG90YWwrK1xuICAgICAgfVxuXG4gICAgICBpZiAoKGsgPj0gdGhpcy5ncm91cExpbWl0KSB8fCBpc09iamVjdEVuZHMpIHtcbiAgICAgICAgdGhpcy5zdGF0cy5vYmplY3RzQ291bnRJbkdyb3Vwc1t0aGlzLnN0YXRzLmdyb3Vwc0NvdW50XSA9IGtcblxuICAgICAgICAvKiog0KHQvtC30LTQsNC90LjQtSDQuCDQt9Cw0L/QvtC70L3QtdC90LjQtSDQsdGD0YTQtdGA0L7QsiDQtNCw0L3QvdGL0LzQuCDQviDRgtC10LrRg9GJ0LXQuSDQs9GA0YPQv9C/0LUg0L/QvtC70LjQs9C+0L3QvtCyLiAqL1xuICAgICAgICB0aGlzLnN0YXRzLm1lbVVzYWdlICs9XG4gICAgICAgICAgdGhpcy53ZWJnbC5jcmVhdGVCdWZmZXIoJ3ZlcnRpY2VzJywgbmV3IEZsb2F0MzJBcnJheShwb2x5Z29uR3JvdXAudmVydGljZXMpKSArXG4gICAgICAgICAgdGhpcy53ZWJnbC5jcmVhdGVCdWZmZXIoJ2NvbG9ycycsIG5ldyBVaW50OEFycmF5KHBvbHlnb25Hcm91cC5jb2xvcnMpKSArXG4gICAgICAgICAgdGhpcy53ZWJnbC5jcmVhdGVCdWZmZXIoJ3NoYXBlcycsIG5ldyBVaW50OEFycmF5KHBvbHlnb25Hcm91cC5zaGFwZXMpKSArXG4gICAgICAgICAgdGhpcy53ZWJnbC5jcmVhdGVCdWZmZXIoJ3NpemVzJywgbmV3IEZsb2F0MzJBcnJheShwb2x5Z29uR3JvdXAuc2l6ZXMpKVxuICAgICAgfVxuXG4gICAgICBpZiAoKGsgPj0gdGhpcy5ncm91cExpbWl0KSAmJiAhaXNPYmplY3RFbmRzKSB7XG4gICAgICAgIHRoaXMuc3RhdHMuZ3JvdXBzQ291bnQrK1xuICAgICAgICBwb2x5Z29uR3JvdXAgPSB7IHZlcnRpY2VzOiBbXSwgY29sb3JzOiBbXSwgc2l6ZXM6IFtdLCBzaGFwZXM6IFtdLCBhbW91bnRPZlZlcnRpY2VzOiAwIH1cbiAgICAgICAgayA9IDBcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5kZWJ1Zy5pc0VuYWJsZSkge1xuICAgICAgdGhpcy5kZWJ1Zy5sb2dEYXRhTG9hZGluZ0NvbXBsZXRlKClcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICog0KHQvtC30LTQsNC10YIg0LTQvtC/0L7Qu9C90LXQvdC40LUg0Log0LrQvtC00YMg0L3QsCDRj9C30YvQutC1IEdMU0wuXG4gICAqXG4gICAqIEByZW1hcmtzXG4gICAqINCSINC00LDQu9GM0L3QtdC50YjQtdC8INGB0L7Qt9C00LDQvdC90YvQuSDQutC+0LQg0LHRg9C00LXRgiDQstGB0YLRgNC+0LXQvSDQsiDQutC+0LQg0LLQtdGA0YjQuNC90L3QvtCz0L4g0YjQtdC50LTQtdGA0LAg0LTQu9GPINC30LDQtNCw0L3QuNGPINGG0LLQtdGC0LAg0LLQtdGA0YjQuNC90Ysg0LIg0LfQsNCy0LjRgdC40LzQvtGB0YLQuCDQvtGCXG4gICAqINC40L3QtNC10LrRgdCwINGG0LLQtdGC0LAsINC/0YDQuNGB0LLQvtC10L3QvdC+0LPQviDRjdGC0L7QuSDQstC10YDRiNC40L3QtS4g0KIu0LouINGI0LXQudC00LXRgCDQvdC1INC/0L7Qt9Cy0L7Qu9GP0LXRgiDQuNGB0L/QvtC70YzQt9C+0LLQsNGC0Ywg0LIg0LrQsNGH0LXRgdGC0LLQtSDQuNC90LTQtdC60YHQvtCyINC/0LXRgNC10LzQtdC90L3Ri9C1IC1cbiAgICog0LTQu9GPINC30LDQtNCw0L3QuNGPINGG0LLQtdGC0LAg0LjRgdC/0L7Qu9GM0LfRg9C10YLRgdGPINC/0LXRgNC10LHQvtGAINGG0LLQtdGC0L7QstGL0YUg0LjQvdC00LXQutGB0L7Qsi5cbiAgICpcbiAgICogQHJldHVybnMg0JrQvtC0INC90LAg0Y/Qt9GL0LrQtSBHTFNMLlxuICAgKi9cbiAgcHJvdGVjdGVkIGdlblNoYWRlckNvbG9yQ29kZSgpOiBzdHJpbmcge1xuXG4gICAgLy8g0JLRgNC10LzQtdC90L3QvtC1INC00L7QsdCw0LLQu9C10L3QuNC1INCyINC/0LDQu9C40YLRgNGDINGG0LLQtdGC0L7QsiDQstC10YDRiNC40L0g0YbQstC10YLQsCDQvdCw0L/RgNCw0LLQu9GP0Y7RidC40YUuXG4gICAgdGhpcy5jb2xvcnMucHVzaCh0aGlzLmdyaWQucnVsZXNDb2xvciEpXG5cbiAgICBsZXQgY29kZTogc3RyaW5nID0gJydcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jb2xvcnMubGVuZ3RoOyBpKyspIHtcblxuICAgICAgLy8g0J/QvtC70YPRh9C10L3QuNC1INGG0LLQtdGC0LAg0LIg0L3Rg9C20L3QvtC8INGE0L7RgNC80LDRgtC1LlxuICAgICAgbGV0IFtyLCBnLCBiXSA9IGNvbG9yRnJvbUhleFRvR2xSZ2IodGhpcy5jb2xvcnNbaV0pXG5cbiAgICAgIC8vINCk0L7RgNC80LjRgNC+0LLQvdC40LUg0YHRgtGA0L7QuiBHTFNMLdC60L7QtNCwINC/0YDQvtCy0LXRgNC60Lgg0LjQvdC00LXQutGB0LAg0YbQstC10YLQsC5cbiAgICAgIGNvZGUgKz0gKChpID09PSAwKSA/ICcnIDogJyAgZWxzZSAnKSArICdpZiAoYV9jb2xvciA9PSAnICsgaSArICcuMCkgdl9jb2xvciA9IHZlYzMoJyArXG4gICAgICAgIHIudG9TdHJpbmcoKS5zbGljZSgwLCA5KSArICcsJyArXG4gICAgICAgIGcudG9TdHJpbmcoKS5zbGljZSgwLCA5KSArICcsJyArXG4gICAgICAgIGIudG9TdHJpbmcoKS5zbGljZSgwLCA5KSArICcpO1xcbidcbiAgICB9XG5cbiAgICAvLyDQo9C00LDQu9C10L3QuNC1INC40Lcg0L/QsNC70LjRgtGA0Ysg0LLQtdGA0YjQuNC9INCy0YDQtdC80LXQvdC90L4g0LTQvtCx0LDQstC70LXQvdC90L7Qs9C+INGG0LLQtdGC0LAg0L3QsNC/0YDQsNCy0LvRj9GO0YnQuNGFLlxuICAgIHRoaXMuY29sb3JzLnBvcCgpXG5cbiAgICByZXR1cm4gY29kZVxuICB9XG5cbiAgLyoqXG4gICAqINCf0YDQvtC40LfQstC+0LTQuNGCINGA0LXQvdC00LXRgNC40L3QsyDQs9GA0LDRhNC40LrQsCDQsiDRgdC+0L7RgtCy0LXRgtGB0YLQstC40Lgg0YEg0YLQtdC60YPRidC40LzQuCDQv9Cw0YDQsNC80LXRgtGA0LDQvNC4INGC0YDQsNC90YHRhNC+0YDQvNCw0YbQuNC4LlxuICAgKi9cbiAgcHVibGljIHJlbmRlcigpOiB2b2lkIHtcblxuICAgIC8vINCe0YfQuNGB0YLQutCwINC+0LHRitC10LrRgtCwINGA0LXQvdC00LXRgNC40L3Qs9CwIFdlYkdMLlxuICAgIHRoaXMud2ViZ2wuY2xlYXJCYWNrZ3JvdW5kKClcblxuICAgIC8vINCe0LHQvdC+0LLQu9C10L3QuNC1INC80LDRgtGA0LjRhtGLINGC0YDQsNC90YHRhNC+0YDQvNCw0YbQuNC4LlxuICAgIHRoaXMuY29udHJvbC51cGRhdGVWaWV3UHJvamVjdGlvbigpXG5cbiAgICAvLyDQn9GA0LjQstGP0LfQutCwINC80LDRgtGA0LjRhtGLINGC0YDQsNC90YHRhNC+0YDQvNCw0YbQuNC4INC6INC/0LXRgNC10LzQtdC90L3QvtC5INGI0LXQudC00LXRgNCwLlxuICAgIHRoaXMud2ViZ2wuc2V0VmFyaWFibGUoJ3VfbWF0cml4JywgdGhpcy5jb250cm9sLnRyYW5zZm9ybS52aWV3UHJvamVjdGlvbk1hdClcblxuICAgIC8vINCY0YLQtdGA0LjRgNC+0LLQsNC90LjQtSDQuCDRgNC10L3QtNC10YDQuNC90LMg0LPRgNGD0L/QvyDQsdGD0YTQtdGA0L7QsiBXZWJHTC5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc3RhdHMuZ3JvdXBzQ291bnQ7IGkrKykge1xuXG4gICAgICB0aGlzLndlYmdsLnNldEJ1ZmZlcigndmVydGljZXMnLCBpLCAnYV9wb3NpdGlvbicsIDIsIDAsIDApXG4gICAgICB0aGlzLndlYmdsLnNldEJ1ZmZlcignY29sb3JzJywgaSwgJ2FfY29sb3InLCAxLCAwLCAwKVxuICAgICAgdGhpcy53ZWJnbC5zZXRCdWZmZXIoJ3NpemVzJywgaSwgJ2Ffc2l6ZScsIDEsIDAsIDApXG4gICAgICB0aGlzLndlYmdsLnNldEJ1ZmZlcignc2hhcGVzJywgaSwgJ2Ffc2hhcGUnLCAxLCAwLCAwKVxuXG4gICAgICB0aGlzLndlYmdsLmRyYXdQb2ludHMoMCwgdGhpcy5zdGF0cy5vYmplY3RzQ291bnRJbkdyb3Vwc1tpXSlcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICog0JfQsNC/0YPRgdC60LDQtdGCINGA0LXQvdC00LXRgNC40L3QsyDQuCDQutC+0L3RgtGA0L7Qu9GMINGD0L/RgNCw0LLQu9C10L3QuNGPLlxuICAgKi9cbiAgcHVibGljIHJ1bigpOiB2b2lkIHtcblxuICAgIGlmICh0aGlzLmlzUnVubmluZykge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgdGhpcy5yZW5kZXIoKVxuICAgIHRoaXMuY29udHJvbC5ydW4oKVxuICAgIHRoaXMuaXNSdW5uaW5nID0gdHJ1ZVxuXG4gICAgaWYgKHRoaXMuZGVidWcuaXNFbmFibGUpIHtcbiAgICAgIHRoaXMuZGVidWcubG9nUmVuZGVyU3RhcnRlZCgpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqINCe0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdGCINGA0LXQvdC00LXRgNC40L3QsyDQuCDQutC+0L3RgtGA0L7Qu9GMINGD0L/RgNCw0LLQu9C10L3QuNGPLlxuICAgKi9cbiAgcHVibGljIHN0b3AoKTogdm9pZCB7XG5cbiAgICBpZiAoIXRoaXMuaXNSdW5uaW5nKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICB0aGlzLmNvbnRyb2wuc3RvcCgpXG4gICAgdGhpcy5pc1J1bm5pbmcgPSBmYWxzZVxuXG4gICAgaWYgKHRoaXMuZGVidWcuaXNFbmFibGUpIHtcbiAgICAgIHRoaXMuZGVidWcubG9nUmVuZGVyU3RvcGVkKClcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICog0J7Rh9C40YnQsNC10YIg0YTQvtC9LlxuICAgKi9cbiAgcHVibGljIGNsZWFyKCk6IHZvaWQge1xuXG4gICAgdGhpcy53ZWJnbC5jbGVhckJhY2tncm91bmQoKVxuXG4gICAgaWYgKHRoaXMuZGVidWcuaXNFbmFibGUpIHtcbiAgICAgIHRoaXMuZGVidWcubG9nQ2FudmFzQ2xlYXJlZCh0aGlzLmdyaWQuYmdDb2xvciEpXG4gICAgfVxuICB9XG59XG4iLCJcbi8qKlxuICog0J/RgNC+0LLQtdGA0Y/QtdGCINGP0LLQu9GP0LXRgtGB0Y8g0LvQuCDQv9C10YDQtdC80LXQvdC90LDRjyDRjdC60LfQtdC80L/Qu9GP0YDQvtC8INC60LDQutC+0LPQvi3Qu9C40LHQvtC+INC60LvQsNGB0YHQsC5cbiAqXG4gKiBAcGFyYW0gdmFsIC0g0J/RgNC+0LLQtdGA0Y/QtdC80LDRjyDQv9C10YDQtdC80LXQvdC90LDRjy5cbiAqIEByZXR1cm5zINCg0LXQt9GD0LvRjNGC0LDRgiDQv9GA0L7QstC10YDQutC4LlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNPYmplY3Qob2JqOiBhbnkpOiBib29sZWFuIHtcbiAgcmV0dXJuIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgT2JqZWN0XScpXG59XG5cbi8qKlxuICog0J/QtdGA0LXQvtC/0YDQtdC00LXQu9GP0LXRgiDQt9C90LDRh9C10L3QuNGPINC/0L7Qu9C10Lkg0L7QsdGK0LXQutGC0LAgdGFyZ2V0INC90LAg0LfQvdCw0YfQtdC90LjRjyDQv9C+0LvQtdC5INC+0LHRitC10LrRgtCwIHNvdXJjZS4g0J/QtdGA0LXQvtC/0YDQtdC00LXQu9GP0Y7RgtGB0Y8g0YLQvtC70YzQutC+INGC0LUg0L/QvtC70Y8sXG4gKiDQutC+0YLQvtGA0YvQtSDRgdGD0YnQtdGB0YLQstGD0LXRjtGCINCyIHRhcmdldC4g0JXRgdC70Lgg0LIgc291cmNlINC10YHRgtGMINC/0L7Qu9GPLCDQutC+0YLQvtGA0YvRhSDQvdC10YIg0LIgdGFyZ2V0LCDRgtC+INC+0L3QuCDQuNCz0L3QvtGA0LjRgNGD0Y7RgtGB0Y8uINCV0YHQu9C4INC60LDQutC40LUt0YLQviDQv9C+0LvRj1xuICog0YHQsNC80Lgg0Y/QstC70Y/RjtGC0YHRjyDRj9Cy0LvRj9GO0YLRgdGPINC+0LHRitC10LrRgtCw0LzQuCwg0YLQviDRgtC+INC+0L3QuCDRgtCw0LrQttC1INGA0LXQutGD0YDRgdC40LLQvdC+INC60L7Qv9C40YDRg9GO0YLRgdGPICjQv9GA0Lgg0YLQvtC8INC20LUg0YPRgdC70L7QstC40LgsINGH0YLQviDQsiDRhtC10LvQtdC+0Lwg0L7QsdGK0LXQutGC0LVcbiAqINGB0YPRidC10YHRgtCy0YPRjtGCINC/0L7Qu9GPINC+0LHRitC10LrRgtCwLdC40YHRgtC+0YfQvdC40LrQsCkuXG4gKlxuICogQHBhcmFtIHRhcmdldCAtINCm0LXQu9C10LLQvtC5ICjQuNC30LzQtdC90Y/QtdC80YvQuSkg0L7QsdGK0LXQutGCLlxuICogQHBhcmFtIHNvdXJjZSAtINCe0LHRitC10LrRgiDRgSDQtNCw0L3QvdGL0LzQuCwg0LrQvtGC0L7RgNGL0LUg0L3Rg9C20L3QviDRg9GB0YLQsNC90L7QstC40YLRjCDRgyDRhtC10LvQtdCy0L7Qs9C+INC+0LHRitC10LrRgtCwLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY29weU1hdGNoaW5nS2V5VmFsdWVzKHRhcmdldDogYW55LCBzb3VyY2U6IGFueSk6IHZvaWQge1xuICBPYmplY3Qua2V5cyhzb3VyY2UpLmZvckVhY2goa2V5ID0+IHtcbiAgICBpZiAoa2V5IGluIHRhcmdldCkge1xuICAgICAgaWYgKGlzT2JqZWN0KHNvdXJjZVtrZXldKSkge1xuICAgICAgICBpZiAoaXNPYmplY3QodGFyZ2V0W2tleV0pKSB7XG4gICAgICAgICAgY29weU1hdGNoaW5nS2V5VmFsdWVzKHRhcmdldFtrZXldLCBzb3VyY2Vba2V5XSlcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCFpc09iamVjdCh0YXJnZXRba2V5XSkgJiYgKHR5cGVvZiB0YXJnZXRba2V5XSAhPT0gJ2Z1bmN0aW9uJykpIHtcbiAgICAgICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pXG59XG5cbi8qKlxuICog0JLQvtC30LLRgNCw0YnQsNC10YIg0YHQu9GD0YfQsNC50L3QvtC1INGG0LXQu9C+0LUg0YfQuNGB0LvQviDQsiDQtNC40LDQv9Cw0LfQvtC90LU6IFswLi4ucmFuZ2UtMV0uXG4gKlxuICogQHBhcmFtIHJhbmdlIC0g0JLQtdGA0YXQvdC40Lkg0L/RgNC10LTQtdC7INC00LjQsNC/0LDQt9C+0L3QsCDRgdC70YPRh9Cw0LnQvdC+0LPQviDQstGL0LHQvtGA0LAuXG4gKiBAcmV0dXJucyDQodC70YPRh9Cw0LnQvdC+0LUg0YfQuNGB0LvQvi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJhbmRvbUludChyYW5nZTogbnVtYmVyKTogbnVtYmVyIHtcbiAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHJhbmdlKVxufVxuXG4vKipcbiAqINCf0YDQtdC+0LHRgNCw0LfRg9C10YIg0L7QsdGK0LXQutGCINCyINGB0YLRgNC+0LrRgyBKU09OLiDQmNC80LXQtdGCINC+0YLQu9C40YfQuNC1INC+0YIg0YHRgtCw0L3QtNCw0YDRgtC90L7QuSDRhNGD0L3QutGG0LjQuCBKU09OLnN0cmluZ2lmeSAtINC/0L7Qu9GPINC+0LHRitC10LrRgtCwLCDQuNC80LXRjtGJ0LjQtVxuICog0LfQvdCw0YfQtdC90LjRjyDRhNGD0L3QutGG0LjQuSDQvdC1INC/0YDQvtC/0YPRgdC60LDRjtGC0YHRjywg0LAg0L/RgNC10L7QsdGA0LDQt9GD0Y7RgtGB0Y8g0LIg0L3QsNC30LLQsNC90LjQtSDRhNGD0L3QutGG0LjQuC5cbiAqXG4gKiBAcGFyYW0gb2JqIC0g0KbQtdC70LXQstC+0Lkg0L7QsdGK0LXQutGCLlxuICogQHJldHVybnMg0KHRgtGA0L7QutCwIEpTT04sINC+0YLQvtCx0YDQsNC20LDRjtGJ0LDRjyDQvtCx0YrQtdC60YIuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBqc29uU3RyaW5naWZ5KG9iajogYW55KTogc3RyaW5nIHtcbiAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KFxuICAgIG9iaixcbiAgICBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgcmV0dXJuICh0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpID8gdmFsdWUubmFtZSA6IHZhbHVlXG4gICAgfSxcbiAgICAnICdcbiAgKVxufVxuXG4vKipcbiAqINCa0L7QvdCy0LXRgNGC0LjRgNGD0LXRgiDRhtCy0LXRgiDQuNC3IEhFWC3Qv9GA0LXQtNGB0YLQsNCy0LvQtdC90LjRjyDQsiDQv9GA0LXQtNGB0YLQsNCy0LvQtdC90LjQtSDRhtCy0LXRgtCwINC00LvRjyBHTFNMLdC60L7QtNCwIChSR0Ig0YEg0LTQuNCw0L/QsNC30L7QvdCw0LzQuCDQt9C90LDRh9C10L3QuNC5INC+0YIgMCDQtNC+IDEpLlxuICpcbiAqIEBwYXJhbSBoZXhDb2xvciAtINCm0LLQtdGCINCyIEhFWC3RhNC+0YDQvNCw0YLQtS5cbiAqIEByZXR1cm5zINCc0LDRgdGB0LjQsiDQuNC3INGC0YDQtdGFINGH0LjRgdC10Lsg0LIg0LTQuNCw0L/QsNC30L7QvdC1INC+0YIgMCDQtNC+IDEuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb2xvckZyb21IZXhUb0dsUmdiKGhleENvbG9yOiBzdHJpbmcpOiBudW1iZXJbXSB7XG5cbiAgbGV0IGsgPSAvXiM/KFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pJC9pLmV4ZWMoaGV4Q29sb3IpXG4gIGxldCBbciwgZywgYl0gPSBbcGFyc2VJbnQoayFbMV0sIDE2KSAvIDI1NSwgcGFyc2VJbnQoayFbMl0sIDE2KSAvIDI1NSwgcGFyc2VJbnQoayFbM10sIDE2KSAvIDI1NV1cblxuICByZXR1cm4gW3IsIGcsIGJdXG59XG5cbi8qKlxuICog0JLRi9GH0LjRgdC70Y/QtdGCINGC0LXQutGD0YnQtdC1INCy0YDQtdC80Y8uXG4gKlxuICogQHJldHVybnMg0KHRgtGA0L7QutC+0LLQsNGPINGE0L7RgNC80LDRgtC40YDQvtCy0LDQvdC90LDRjyDQt9Cw0L/QuNGB0Ywg0YLQtdC60YPRidC10LPQviDQstGA0LXQvNC10L3QuC4g0KTQvtGA0LzQsNGCOiBoaDptbTpzc1xuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q3VycmVudFRpbWUoKTogc3RyaW5nIHtcblxuICBsZXQgdG9kYXkgPSBuZXcgRGF0ZSgpO1xuXG4gIGxldCB0aW1lID1cbiAgICAoKHRvZGF5LmdldEhvdXJzKCkgPCAxMCA/ICcwJyA6ICcnKSArIHRvZGF5LmdldEhvdXJzKCkpICsgXCI6XCIgK1xuICAgICgodG9kYXkuZ2V0TWludXRlcygpIDwgMTAgPyAnMCcgOiAnJykgKyB0b2RheS5nZXRNaW51dGVzKCkpICsgXCI6XCIgK1xuICAgICgodG9kYXkuZ2V0U2Vjb25kcygpIDwgMTAgPyAnMCcgOiAnJykgKyB0b2RheS5nZXRTZWNvbmRzKCkpXG5cbiAgcmV0dXJuIHRpbWVcbn1cbiIsIi8qXG4gKiBDb3B5cmlnaHQgMjAyMSBHRlhGdW5kYW1lbnRhbHMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFJlZGlzdHJpYnV0aW9uIGFuZCB1c2UgaW4gc291cmNlIGFuZCBiaW5hcnkgZm9ybXMsIHdpdGggb3Igd2l0aG91dFxuICogbW9kaWZpY2F0aW9uLCBhcmUgcGVybWl0dGVkIHByb3ZpZGVkIHRoYXQgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zIGFyZVxuICogbWV0OlxuICpcbiAqICAgICAqIFJlZGlzdHJpYnV0aW9ucyBvZiBzb3VyY2UgY29kZSBtdXN0IHJldGFpbiB0aGUgYWJvdmUgY29weXJpZ2h0XG4gKiBub3RpY2UsIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIuXG4gKiAgICAgKiBSZWRpc3RyaWJ1dGlvbnMgaW4gYmluYXJ5IGZvcm0gbXVzdCByZXByb2R1Y2UgdGhlIGFib3ZlXG4gKiBjb3B5cmlnaHQgbm90aWNlLCB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyXG4gKiBpbiB0aGUgZG9jdW1lbnRhdGlvbiBhbmQvb3Igb3RoZXIgbWF0ZXJpYWxzIHByb3ZpZGVkIHdpdGggdGhlXG4gKiBkaXN0cmlidXRpb24uXG4gKiAgICAgKiBOZWl0aGVyIHRoZSBuYW1lIG9mIEdGWEZ1bmRhbWVudGFscy4gbm9yIHRoZSBuYW1lcyBvZiBoaXNcbiAqIGNvbnRyaWJ1dG9ycyBtYXkgYmUgdXNlZCB0byBlbmRvcnNlIG9yIHByb21vdGUgcHJvZHVjdHMgZGVyaXZlZCBmcm9tXG4gKiB0aGlzIHNvZnR3YXJlIHdpdGhvdXQgc3BlY2lmaWMgcHJpb3Igd3JpdHRlbiBwZXJtaXNzaW9uLlxuICpcbiAqIFRISVMgU09GVFdBUkUgSVMgUFJPVklERUQgQlkgVEhFIENPUFlSSUdIVCBIT0xERVJTIEFORCBDT05UUklCVVRPUlNcbiAqIFwiQVMgSVNcIiBBTkQgQU5ZIEVYUFJFU1MgT1IgSU1QTElFRCBXQVJSQU5USUVTLCBJTkNMVURJTkcsIEJVVCBOT1RcbiAqIExJTUlURUQgVE8sIFRIRSBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZIEFORCBGSVRORVNTIEZPUlxuICogQSBQQVJUSUNVTEFSIFBVUlBPU0UgQVJFIERJU0NMQUlNRUQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBDT1BZUklHSFRcbiAqIE9XTkVSIE9SIENPTlRSSUJVVE9SUyBCRSBMSUFCTEUgRk9SIEFOWSBESVJFQ1QsIElORElSRUNULCBJTkNJREVOVEFMLFxuICogU1BFQ0lBTCwgRVhFTVBMQVJZLCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVMgKElOQ0xVRElORywgQlVUIE5PVFxuICogTElNSVRFRCBUTywgUFJPQ1VSRU1FTlQgT0YgU1VCU1RJVFVURSBHT09EUyBPUiBTRVJWSUNFUzsgTE9TUyBPRiBVU0UsXG4gKiBEQVRBLCBPUiBQUk9GSVRTOyBPUiBCVVNJTkVTUyBJTlRFUlJVUFRJT04pIEhPV0VWRVIgQ0FVU0VEIEFORCBPTiBBTllcbiAqIFRIRU9SWSBPRiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQ09OVFJBQ1QsIFNUUklDVCBMSUFCSUxJVFksIE9SIFRPUlRcbiAqIChJTkNMVURJTkcgTkVHTElHRU5DRSBPUiBPVEhFUldJU0UpIEFSSVNJTkcgSU4gQU5ZIFdBWSBPVVQgT0YgVEhFIFVTRVxuICogT0YgVEhJUyBTT0ZUV0FSRSwgRVZFTiBJRiBBRFZJU0VEIE9GIFRIRSBQT1NTSUJJTElUWSBPRiBTVUNIIERBTUFHRS5cbiAqL1xuXG4vKipcbiAqIFZhcmlvdXMgMmQgbWF0aCBmdW5jdGlvbnMuXG4gKlxuICogQG1vZHVsZSB3ZWJnbC0yZC1tYXRoXG4gKi9cbihmdW5jdGlvbihyb290LCBmYWN0b3J5KSB7ICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAvLyBBTUQuIFJlZ2lzdGVyIGFzIGFuIGFub255bW91cyBtb2R1bGUuXG4gICAgZGVmaW5lKFtdLCBmYWN0b3J5KTtcbiAgfSBlbHNlIHtcbiAgICAvLyBCcm93c2VyIGdsb2JhbHNcbiAgICByb290Lm0zID0gZmFjdG9yeSgpO1xuICB9XG59KHRoaXMsIGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICAvKipcbiAgICogQW4gYXJyYXkgb3IgdHlwZWQgYXJyYXkgd2l0aCA5IHZhbHVlcy5cbiAgICogQHR5cGVkZWYge251bWJlcltdfFR5cGVkQXJyYXl9IE1hdHJpeDNcbiAgICogQG1lbWJlck9mIG1vZHVsZTp3ZWJnbC0yZC1tYXRoXG4gICAqL1xuXG4gIC8qKlxuICAgKiBUYWtlcyB0d28gTWF0cml4M3MsIGEgYW5kIGIsIGFuZCBjb21wdXRlcyB0aGUgcHJvZHVjdCBpbiB0aGUgb3JkZXJcbiAgICogdGhhdCBwcmUtY29tcG9zZXMgYiB3aXRoIGEuICBJbiBvdGhlciB3b3JkcywgdGhlIG1hdHJpeCByZXR1cm5lZCB3aWxsXG4gICAqIEBwYXJhbSB7bW9kdWxlOndlYmdsLTJkLW1hdGguTWF0cml4M30gYSBBIG1hdHJpeC5cbiAgICogQHBhcmFtIHttb2R1bGU6d2ViZ2wtMmQtbWF0aC5NYXRyaXgzfSBiIEEgbWF0cml4LlxuICAgKiBAcmV0dXJuIHttb2R1bGU6d2ViZ2wtMmQtbWF0aC5NYXRyaXgzfSB0aGUgcmVzdWx0LlxuICAgKiBAbWVtYmVyT2YgbW9kdWxlOndlYmdsLTJkLW1hdGhcbiAgICovXG4gIGZ1bmN0aW9uIG11bHRpcGx5KGEsIGIpIHtcbiAgICB2YXIgYTAwID0gYVswICogMyArIDBdO1xuICAgIHZhciBhMDEgPSBhWzAgKiAzICsgMV07XG4gICAgdmFyIGEwMiA9IGFbMCAqIDMgKyAyXTtcbiAgICB2YXIgYTEwID0gYVsxICogMyArIDBdO1xuICAgIHZhciBhMTEgPSBhWzEgKiAzICsgMV07XG4gICAgdmFyIGExMiA9IGFbMSAqIDMgKyAyXTtcbiAgICB2YXIgYTIwID0gYVsyICogMyArIDBdO1xuICAgIHZhciBhMjEgPSBhWzIgKiAzICsgMV07XG4gICAgdmFyIGEyMiA9IGFbMiAqIDMgKyAyXTtcbiAgICB2YXIgYjAwID0gYlswICogMyArIDBdO1xuICAgIHZhciBiMDEgPSBiWzAgKiAzICsgMV07XG4gICAgdmFyIGIwMiA9IGJbMCAqIDMgKyAyXTtcbiAgICB2YXIgYjEwID0gYlsxICogMyArIDBdO1xuICAgIHZhciBiMTEgPSBiWzEgKiAzICsgMV07XG4gICAgdmFyIGIxMiA9IGJbMSAqIDMgKyAyXTtcbiAgICB2YXIgYjIwID0gYlsyICogMyArIDBdO1xuICAgIHZhciBiMjEgPSBiWzIgKiAzICsgMV07XG4gICAgdmFyIGIyMiA9IGJbMiAqIDMgKyAyXTtcblxuICAgIHJldHVybiBbXG4gICAgICBiMDAgKiBhMDAgKyBiMDEgKiBhMTAgKyBiMDIgKiBhMjAsXG4gICAgICBiMDAgKiBhMDEgKyBiMDEgKiBhMTEgKyBiMDIgKiBhMjEsXG4gICAgICBiMDAgKiBhMDIgKyBiMDEgKiBhMTIgKyBiMDIgKiBhMjIsXG4gICAgICBiMTAgKiBhMDAgKyBiMTEgKiBhMTAgKyBiMTIgKiBhMjAsXG4gICAgICBiMTAgKiBhMDEgKyBiMTEgKiBhMTEgKyBiMTIgKiBhMjEsXG4gICAgICBiMTAgKiBhMDIgKyBiMTEgKiBhMTIgKyBiMTIgKiBhMjIsXG4gICAgICBiMjAgKiBhMDAgKyBiMjEgKiBhMTAgKyBiMjIgKiBhMjAsXG4gICAgICBiMjAgKiBhMDEgKyBiMjEgKiBhMTEgKyBiMjIgKiBhMjEsXG4gICAgICBiMjAgKiBhMDIgKyBiMjEgKiBhMTIgKyBiMjIgKiBhMjIsXG4gICAgXTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSAzeDMgaWRlbnRpdHkgbWF0cml4XG4gICAqIEByZXR1cm4ge21vZHVsZTp3ZWJnbDItMmQtbWF0aC5NYXRyaXgzfSBhbiBpZGVudGl0eSBtYXRyaXhcbiAgICovXG4gIGZ1bmN0aW9uIGlkZW50aXR5KCkge1xuICAgIHJldHVybiBbXG4gICAgICAxLCAwLCAwLFxuICAgICAgMCwgMSwgMCxcbiAgICAgIDAsIDAsIDEsXG4gICAgXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgMkQgcHJvamVjdGlvbiBtYXRyaXhcbiAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoIHdpZHRoIGluIHBpeGVsc1xuICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0IGhlaWdodCBpbiBwaXhlbHNcbiAgICogQHJldHVybiB7bW9kdWxlOndlYmdsLTJkLW1hdGguTWF0cml4M30gYSBwcm9qZWN0aW9uIG1hdHJpeCB0aGF0IGNvbnZlcnRzIGZyb20gcGl4ZWxzIHRvIGNsaXBzcGFjZSB3aXRoIFkgPSAwIGF0IHRoZSB0b3AuXG4gICAqIEBtZW1iZXJPZiBtb2R1bGU6d2ViZ2wtMmQtbWF0aFxuICAgKi9cbiAgZnVuY3Rpb24gcHJvamVjdGlvbih3aWR0aCwgaGVpZ2h0KSB7XG4gICAgLy8gTm90ZTogVGhpcyBtYXRyaXggZmxpcHMgdGhlIFkgYXhpcyBzbyAwIGlzIGF0IHRoZSB0b3AuXG4gICAgcmV0dXJuIFtcbiAgICAgIDIgLyB3aWR0aCwgMCwgMCxcbiAgICAgIDAsIC0yIC8gaGVpZ2h0LCAwLFxuICAgICAgLTEsIDEsIDEsXG4gICAgXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNdWx0aXBsaWVzIGJ5IGEgMkQgcHJvamVjdGlvbiBtYXRyaXhcbiAgICogQHBhcmFtIHttb2R1bGU6d2ViZ2wtMmQtbWF0aC5NYXRyaXgzfSB0aGUgbWF0cml4IHRvIGJlIG11bHRpcGxpZWRcbiAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoIHdpZHRoIGluIHBpeGVsc1xuICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0IGhlaWdodCBpbiBwaXhlbHNcbiAgICogQHJldHVybiB7bW9kdWxlOndlYmdsLTJkLW1hdGguTWF0cml4M30gdGhlIHJlc3VsdFxuICAgKiBAbWVtYmVyT2YgbW9kdWxlOndlYmdsLTJkLW1hdGhcbiAgICovXG4gIGZ1bmN0aW9uIHByb2plY3QobSwgd2lkdGgsIGhlaWdodCkge1xuICAgIHJldHVybiBtdWx0aXBseShtLCBwcm9qZWN0aW9uKHdpZHRoLCBoZWlnaHQpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgMkQgdHJhbnNsYXRpb24gbWF0cml4XG4gICAqIEBwYXJhbSB7bnVtYmVyfSB0eCBhbW91bnQgdG8gdHJhbnNsYXRlIGluIHhcbiAgICogQHBhcmFtIHtudW1iZXJ9IHR5IGFtb3VudCB0byB0cmFuc2xhdGUgaW4geVxuICAgKiBAcmV0dXJuIHttb2R1bGU6d2ViZ2wtMmQtbWF0aC5NYXRyaXgzfSBhIHRyYW5zbGF0aW9uIG1hdHJpeCB0aGF0IHRyYW5zbGF0ZXMgYnkgdHggYW5kIHR5LlxuICAgKiBAbWVtYmVyT2YgbW9kdWxlOndlYmdsLTJkLW1hdGhcbiAgICovXG4gIGZ1bmN0aW9uIHRyYW5zbGF0aW9uKHR4LCB0eSkge1xuICAgIHJldHVybiBbXG4gICAgICAxLCAwLCAwLFxuICAgICAgMCwgMSwgMCxcbiAgICAgIHR4LCB0eSwgMSxcbiAgICBdO1xuICB9XG5cbiAgLyoqXG4gICAqIE11bHRpcGxpZXMgYnkgYSAyRCB0cmFuc2xhdGlvbiBtYXRyaXhcbiAgICogQHBhcmFtIHttb2R1bGU6d2ViZ2wtMmQtbWF0aC5NYXRyaXgzfSB0aGUgbWF0cml4IHRvIGJlIG11bHRpcGxpZWRcbiAgICogQHBhcmFtIHtudW1iZXJ9IHR4IGFtb3VudCB0byB0cmFuc2xhdGUgaW4geFxuICAgKiBAcGFyYW0ge251bWJlcn0gdHkgYW1vdW50IHRvIHRyYW5zbGF0ZSBpbiB5XG4gICAqIEByZXR1cm4ge21vZHVsZTp3ZWJnbC0yZC1tYXRoLk1hdHJpeDN9IHRoZSByZXN1bHRcbiAgICogQG1lbWJlck9mIG1vZHVsZTp3ZWJnbC0yZC1tYXRoXG4gICAqL1xuICBmdW5jdGlvbiB0cmFuc2xhdGUobSwgdHgsIHR5KSB7XG4gICAgcmV0dXJuIG11bHRpcGx5KG0sIHRyYW5zbGF0aW9uKHR4LCB0eSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSAyRCByb3RhdGlvbiBtYXRyaXhcbiAgICogQHBhcmFtIHtudW1iZXJ9IGFuZ2xlSW5SYWRpYW5zIGFtb3VudCB0byByb3RhdGUgaW4gcmFkaWFuc1xuICAgKiBAcmV0dXJuIHttb2R1bGU6d2ViZ2wtMmQtbWF0aC5NYXRyaXgzfSBhIHJvdGF0aW9uIG1hdHJpeCB0aGF0IHJvdGF0ZXMgYnkgYW5nbGVJblJhZGlhbnNcbiAgICogQG1lbWJlck9mIG1vZHVsZTp3ZWJnbC0yZC1tYXRoXG4gICAqL1xuICBmdW5jdGlvbiByb3RhdGlvbihhbmdsZUluUmFkaWFucykge1xuICAgIHZhciBjID0gTWF0aC5jb3MoYW5nbGVJblJhZGlhbnMpO1xuICAgIHZhciBzID0gTWF0aC5zaW4oYW5nbGVJblJhZGlhbnMpO1xuICAgIHJldHVybiBbXG4gICAgICBjLCAtcywgMCxcbiAgICAgIHMsIGMsIDAsXG4gICAgICAwLCAwLCAxLFxuICAgIF07XG4gIH1cblxuICAvKipcbiAgICogTXVsdGlwbGllcyBieSBhIDJEIHJvdGF0aW9uIG1hdHJpeFxuICAgKiBAcGFyYW0ge21vZHVsZTp3ZWJnbC0yZC1tYXRoLk1hdHJpeDN9IHRoZSBtYXRyaXggdG8gYmUgbXVsdGlwbGllZFxuICAgKiBAcGFyYW0ge251bWJlcn0gYW5nbGVJblJhZGlhbnMgYW1vdW50IHRvIHJvdGF0ZSBpbiByYWRpYW5zXG4gICAqIEByZXR1cm4ge21vZHVsZTp3ZWJnbC0yZC1tYXRoLk1hdHJpeDN9IHRoZSByZXN1bHRcbiAgICogQG1lbWJlck9mIG1vZHVsZTp3ZWJnbC0yZC1tYXRoXG4gICAqL1xuICBmdW5jdGlvbiByb3RhdGUobSwgYW5nbGVJblJhZGlhbnMpIHtcbiAgICByZXR1cm4gbXVsdGlwbHkobSwgcm90YXRpb24oYW5nbGVJblJhZGlhbnMpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgMkQgc2NhbGluZyBtYXRyaXhcbiAgICogQHBhcmFtIHtudW1iZXJ9IHN4IGFtb3VudCB0byBzY2FsZSBpbiB4XG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzeSBhbW91bnQgdG8gc2NhbGUgaW4geVxuICAgKiBAcmV0dXJuIHttb2R1bGU6d2ViZ2wtMmQtbWF0aC5NYXRyaXgzfSBhIHNjYWxlIG1hdHJpeCB0aGF0IHNjYWxlcyBieSBzeCBhbmQgc3kuXG4gICAqIEBtZW1iZXJPZiBtb2R1bGU6d2ViZ2wtMmQtbWF0aFxuICAgKi9cbiAgZnVuY3Rpb24gc2NhbGluZyhzeCwgc3kpIHtcbiAgICByZXR1cm4gW1xuICAgICAgc3gsIDAsIDAsXG4gICAgICAwLCBzeSwgMCxcbiAgICAgIDAsIDAsIDEsXG4gICAgXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNdWx0aXBsaWVzIGJ5IGEgMkQgc2NhbGluZyBtYXRyaXhcbiAgICogQHBhcmFtIHttb2R1bGU6d2ViZ2wtMmQtbWF0aC5NYXRyaXgzfSB0aGUgbWF0cml4IHRvIGJlIG11bHRpcGxpZWRcbiAgICogQHBhcmFtIHtudW1iZXJ9IHN4IGFtb3VudCB0byBzY2FsZSBpbiB4XG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzeSBhbW91bnQgdG8gc2NhbGUgaW4geVxuICAgKiBAcmV0dXJuIHttb2R1bGU6d2ViZ2wtMmQtbWF0aC5NYXRyaXgzfSB0aGUgcmVzdWx0XG4gICAqIEBtZW1iZXJPZiBtb2R1bGU6d2ViZ2wtMmQtbWF0aFxuICAgKi9cbiAgZnVuY3Rpb24gc2NhbGUobSwgc3gsIHN5KSB7XG4gICAgcmV0dXJuIG11bHRpcGx5KG0sIHNjYWxpbmcoc3gsIHN5KSk7XG4gIH1cblxuICBmdW5jdGlvbiBkb3QoeDEsIHkxLCB4MiwgeTIpIHtcbiAgICByZXR1cm4geDEgKiB4MiArIHkxICogeTI7XG4gIH1cblxuICBmdW5jdGlvbiBkaXN0YW5jZSh4MSwgeTEsIHgyLCB5Mikge1xuICAgIHZhciBkeCA9IHgxIC0geDI7XG4gICAgdmFyIGR5ID0geTEgLSB5MjtcbiAgICByZXR1cm4gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG5vcm1hbGl6ZSh4LCB5KSB7XG4gICAgdmFyIGwgPSBkaXN0YW5jZSgwLCAwLCB4LCB5KTtcbiAgICBpZiAobCA+IDAuMDAwMDEpIHtcbiAgICAgIHJldHVybiBbeCAvIGwsIHkgLyBsXTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFswLCAwXTtcbiAgICB9XG4gIH1cblxuICAvLyBpID0gaW5jaWRlbnRcbiAgLy8gbiA9IG5vcm1hbFxuICBmdW5jdGlvbiByZWZsZWN0KGl4LCBpeSwgbngsIG55KSB7XG4gICAgLy8gSSAtIDIuMCAqIGRvdChOLCBJKSAqIE4uXG4gICAgdmFyIGQgPSBkb3QobngsIG55LCBpeCwgaXkpO1xuICAgIHJldHVybiBbXG4gICAgICBpeCAtIDIgKiBkICogbngsXG4gICAgICBpeSAtIDIgKiBkICogbnksXG4gICAgXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJhZFRvRGVnKHIpIHtcbiAgICByZXR1cm4gciAqIDE4MCAvIE1hdGguUEk7XG4gIH1cblxuICBmdW5jdGlvbiBkZWdUb1JhZChkKSB7XG4gICAgcmV0dXJuIGQgKiBNYXRoLlBJIC8gMTgwO1xuICB9XG5cbiAgZnVuY3Rpb24gdHJhbnNmb3JtUG9pbnQobSwgdikge1xuICAgIHZhciB2MCA9IHZbMF07XG4gICAgdmFyIHYxID0gdlsxXTtcbiAgICB2YXIgZCA9IHYwICogbVswICogMyArIDJdICsgdjEgKiBtWzEgKiAzICsgMl0gKyBtWzIgKiAzICsgMl07XG4gICAgcmV0dXJuIFtcbiAgICAgICh2MCAqIG1bMCAqIDMgKyAwXSArIHYxICogbVsxICogMyArIDBdICsgbVsyICogMyArIDBdKSAvIGQsXG4gICAgICAodjAgKiBtWzAgKiAzICsgMV0gKyB2MSAqIG1bMSAqIDMgKyAxXSArIG1bMiAqIDMgKyAxXSkgLyBkLFxuICAgIF07XG4gIH1cblxuICBmdW5jdGlvbiBpbnZlcnNlKG0pIHtcbiAgICB2YXIgdDAwID0gbVsxICogMyArIDFdICogbVsyICogMyArIDJdIC0gbVsxICogMyArIDJdICogbVsyICogMyArIDFdO1xuICAgIHZhciB0MTAgPSBtWzAgKiAzICsgMV0gKiBtWzIgKiAzICsgMl0gLSBtWzAgKiAzICsgMl0gKiBtWzIgKiAzICsgMV07XG4gICAgdmFyIHQyMCA9IG1bMCAqIDMgKyAxXSAqIG1bMSAqIDMgKyAyXSAtIG1bMCAqIDMgKyAyXSAqIG1bMSAqIDMgKyAxXTtcbiAgICB2YXIgZCA9IDEuMCAvIChtWzAgKiAzICsgMF0gKiB0MDAgLSBtWzEgKiAzICsgMF0gKiB0MTAgKyBtWzIgKiAzICsgMF0gKiB0MjApO1xuICAgIHJldHVybiBbXG4gICAgICAgZCAqIHQwMCwgLWQgKiB0MTAsIGQgKiB0MjAsXG4gICAgICAtZCAqIChtWzEgKiAzICsgMF0gKiBtWzIgKiAzICsgMl0gLSBtWzEgKiAzICsgMl0gKiBtWzIgKiAzICsgMF0pLFxuICAgICAgIGQgKiAobVswICogMyArIDBdICogbVsyICogMyArIDJdIC0gbVswICogMyArIDJdICogbVsyICogMyArIDBdKSxcbiAgICAgIC1kICogKG1bMCAqIDMgKyAwXSAqIG1bMSAqIDMgKyAyXSAtIG1bMCAqIDMgKyAyXSAqIG1bMSAqIDMgKyAwXSksXG4gICAgICAgZCAqIChtWzEgKiAzICsgMF0gKiBtWzIgKiAzICsgMV0gLSBtWzEgKiAzICsgMV0gKiBtWzIgKiAzICsgMF0pLFxuICAgICAgLWQgKiAobVswICogMyArIDBdICogbVsyICogMyArIDFdIC0gbVswICogMyArIDFdICogbVsyICogMyArIDBdKSxcbiAgICAgICBkICogKG1bMCAqIDMgKyAwXSAqIG1bMSAqIDMgKyAxXSAtIG1bMCAqIDMgKyAxXSAqIG1bMSAqIDMgKyAwXSksXG4gICAgXTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgZGVnVG9SYWQ6IGRlZ1RvUmFkLFxuICAgIGRpc3RhbmNlOiBkaXN0YW5jZSxcbiAgICBkb3Q6IGRvdCxcbiAgICBpZGVudGl0eTogaWRlbnRpdHksXG4gICAgaW52ZXJzZTogaW52ZXJzZSxcbiAgICBtdWx0aXBseTogbXVsdGlwbHksXG4gICAgbm9ybWFsaXplOiBub3JtYWxpemUsXG4gICAgcHJvamVjdGlvbjogcHJvamVjdGlvbixcbiAgICByYWRUb0RlZzogcmFkVG9EZWcsXG4gICAgcmVmbGVjdDogcmVmbGVjdCxcbiAgICByb3RhdGlvbjogcm90YXRpb24sXG4gICAgcm90YXRlOiByb3RhdGUsXG4gICAgc2NhbGluZzogc2NhbGluZyxcbiAgICBzY2FsZTogc2NhbGUsXG4gICAgdHJhbnNmb3JtUG9pbnQ6IHRyYW5zZm9ybVBvaW50LFxuICAgIHRyYW5zbGF0aW9uOiB0cmFuc2xhdGlvbixcbiAgICB0cmFuc2xhdGU6IHRyYW5zbGF0ZSxcbiAgICBwcm9qZWN0OiBwcm9qZWN0LFxuICB9O1xuXG59KSk7XG5cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL2luZGV4LnRzXCIpO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==