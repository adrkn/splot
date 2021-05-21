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
        height: plotHeight
    },
    debug: {
        isEnable: true,
    },
    demo: {
        isEnable: false
    }
});
scatterPlot.run();
//scatterPlot.stop()
//setTimeout(() => scatterPlot.stop(), 3000)


/***/ }),

/***/ "./m3.ts":
/*!***************!*\
  !*** ./m3.ts ***!
  \***************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.inverse = exports.transformPoint = exports.scale = exports.scaling = exports.translate = exports.translation = exports.projection = exports.identity = exports.multiply = void 0;
/**
 * Takes two Matrix3s, a and b, and computes the product in the order
 * that pre-composes b with a.  In other words, the matrix returned will
 */
function multiply(a, b) {
    return [
        b[0] * a[0] + b[1] * a[3] + b[2] * a[6],
        b[0] * a[1] + b[1] * a[4] + b[2] * a[7],
        b[0] * a[2] + b[1] * a[5] + b[2] * a[8],
        b[3] * a[0] + b[4] * a[3] + b[5] * a[6],
        b[3] * a[1] + b[4] * a[4] + b[5] * a[7],
        b[3] * a[2] + b[4] * a[5] + b[5] * a[8],
        b[6] * a[0] + b[7] * a[3] + b[8] * a[6],
        b[6] * a[1] + b[7] * a[4] + b[8] * a[7],
        b[6] * a[2] + b[7] * a[5] + b[8] * a[8]
    ];
}
exports.multiply = multiply;
/**
 * Creates a 3x3 identity matrix
 */
function identity() {
    return [
        1, 0, 0,
        0, 1, 0,
        0, 0, 1
    ];
}
exports.identity = identity;
/**
 * Creates a 2D projection matrix. Returns a projection matrix that converts from pixels to clipspace with Y = 0 at the
 * top. This matrix flips the Y axis so 0 is at the top.
 */
function projection(width, height) {
    return [
        2 / width, 0, 0,
        0, -2 / height, 0,
        -1, 1, 1
    ];
}
exports.projection = projection;
/**
 * Creates a 2D translation matrix. Returns a translation matrix that translates by tx and ty.
 */
function translation(tx, ty) {
    return [
        1, 0, 0,
        0, 1, 0,
        tx, ty, 1
    ];
}
exports.translation = translation;
/**
 * Multiplies by a 2D translation matrix
 */
function translate(m, tx, ty) {
    return multiply(m, translation(tx, ty));
}
exports.translate = translate;
/**
 * Creates a 2D scaling matrix
 */
function scaling(sx, sy) {
    return [
        sx, 0, 0,
        0, sy, 0,
        0, 0, 1
    ];
}
exports.scaling = scaling;
/**
 * Multiplies by a 2D scaling matrix
 */
function scale(m, sx, sy) {
    return multiply(m, scaling(sx, sy));
}
exports.scale = scale;
function transformPoint(m, v) {
    var d = v[0] * m[2] + v[1] * m[5] + m[8];
    return [
        (v[0] * m[0] + v[1] * m[3] + m[6]) / d,
        (v[0] * m[1] + v[1] * m[4] + m[7]) / d
    ];
}
exports.transformPoint = transformPoint;
function inverse(m) {
    var t00 = m[4] * m[8] - m[5] * m[7];
    var t10 = m[1] * m[8] - m[2] * m[7];
    var t20 = m[1] * m[5] - m[2] * m[4];
    var d = 1.0 / (m[0] * t00 - m[3] * t10 + m[6] * t20);
    return [
        d * t00, -d * t10, d * t20,
        -d * (m[3] * m[8] - m[5] * m[6]),
        d * (m[0] * m[8] - m[2] * m[6]),
        -d * (m[0] * m[5] - m[2] * m[3]),
        d * (m[3] * m[7] - m[4] * m[6]),
        -d * (m[0] * m[7] - m[1] * m[6]),
        d * (m[0] * m[4] - m[1] * m[3])
    ];
}
exports.inverse = inverse;


/***/ }),

/***/ "./shader-code-frag-tmpl.ts":
/*!**********************************!*\
  !*** ./shader-code-frag-tmpl.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports) => {


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


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.default = "\nattribute vec2 a_position;\nattribute float a_color;\nattribute float a_size;\nattribute float a_shape;\nuniform mat3 u_matrix;\nvarying vec3 v_color;\nvarying float v_shape;\nvoid main() {\n  gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0.0, 1.0);\n  gl_PointSize = a_size;\n  v_shape = a_shape;\n  {EXT-CODE}\n}\n";


/***/ }),

/***/ "./splot-control.ts":
/*!**************************!*\
  !*** ./splot-control.ts ***!
  \**************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var m3 = __importStar(__webpack_require__(/*! ./m3 */ "./m3.ts"));
/** ****************************************************************************
 *
 * Класс-хелпер, реализующий обработку средств ввода (мыши, трекпада и т.п.) и математические расчеты технических данных,
 * соответсвующих трансформациям графика для класса Splot.
 */
var SPlotContol = /** @class */ (function () {
    /** Хелпер будет иметь полный доступ к экземпляру SPlot. */
    function SPlotContol(splot) {
        this.splot = splot;
        /** Техническая информация, используемая приложением для расчета трансформаций. */
        this.transform = {
            viewProjectionMat: [],
            startInvViewProjMat: [],
            startCamera: { x: 0, y: 0, zoom: 1 },
            startPos: [],
            startClipPos: [],
            startMousePos: []
        };
        /** Обработчики событий средств ввода с закрепленными контекстами. */
        this.handleMouseDownWithContext = this.handleMouseDown.bind(this);
        this.handleMouseWheelWithContext = this.handleMouseWheel.bind(this);
        this.handleMouseMoveWithContext = this.handleMouseMove.bind(this);
        this.handleMouseUpWithContext = this.handleMouseUp.bind(this);
    }
    /** ****************************************************************************
     *
     * Подготавливает хелпер к использованию.
     */
    SPlotContol.prototype.setup = function () {
    };
    /** ****************************************************************************
     *
     * Запускает прослушку событий мыши.
     */
    SPlotContol.prototype.run = function () {
        this.splot.canvas.addEventListener('mousedown', this.handleMouseDownWithContext);
        this.splot.canvas.addEventListener('wheel', this.handleMouseWheelWithContext);
    };
    /** ****************************************************************************
     *
     * Останавливает прослушку событий мыши.
     */
    SPlotContol.prototype.stop = function () {
        this.splot.canvas.removeEventListener('mousedown', this.handleMouseDownWithContext);
        this.splot.canvas.removeEventListener('wheel', this.handleMouseWheelWithContext);
        this.splot.canvas.removeEventListener('mousemove', this.handleMouseMoveWithContext);
        this.splot.canvas.removeEventListener('mouseup', this.handleMouseUpWithContext);
    };
    /** ****************************************************************************
     *
     *
     */
    SPlotContol.prototype.makeCameraMatrix = function () {
        var zoomScale = 1 / this.splot.camera.zoom;
        var cameraMat = m3.identity();
        cameraMat = m3.translate(cameraMat, this.splot.camera.x, this.splot.camera.y);
        cameraMat = m3.scale(cameraMat, zoomScale, zoomScale);
        return cameraMat;
    };
    /** ****************************************************************************
     *
     * Обновляет матрицу трансформации.
     */
    SPlotContol.prototype.updateViewProjection = function () {
        var projectionMat = m3.projection(this.splot.canvas.width, this.splot.canvas.height);
        var cameraMat = this.makeCameraMatrix();
        var viewMat = m3.inverse(cameraMat);
        this.transform.viewProjectionMat = m3.multiply(projectionMat, viewMat);
    };
    /** ****************************************************************************
     *
     * Преобразует координаты мыши в GL-координаты.
     */
    SPlotContol.prototype.getClipSpaceMousePosition = function (event) {
        // get canvas relative css position
        var rect = this.splot.canvas.getBoundingClientRect();
        var cssX = event.clientX - rect.left;
        var cssY = event.clientY - rect.top;
        /** Нормализация координат [0..1] */
        var normX = cssX / this.splot.canvas.clientWidth;
        var normY = cssY / this.splot.canvas.clientHeight;
        /** Получение GL-координат [-1..1] */
        var clipX = normX * 2 - 1;
        var clipY = normY * -2 + 1;
        return [clipX, clipY];
    };
    /** ****************************************************************************
     *
     *
     */
    SPlotContol.prototype.moveCamera = function (event) {
        var pos = m3.transformPoint(this.transform.startInvViewProjMat, this.getClipSpaceMousePosition(event));
        this.splot.camera.x = this.transform.startCamera.x + this.transform.startPos[0] - pos[0];
        this.splot.camera.y = this.transform.startCamera.y + this.transform.startPos[1] - pos[1];
        this.splot.render();
    };
    /** ****************************************************************************
     *
     * Реагирует на движение мыши в момент, когда ее клавиша удерживается нажатой. Метод перемещает область видимости на
     * плоскости вместе с движением мыши.
     */
    SPlotContol.prototype.handleMouseMove = function (event) {
        this.moveCamera(event);
    };
    /** ****************************************************************************
     *
     * Реагирует на отжатие клавиши мыши. В момент отжатия клавиши анализ движения мыши с зажатой клавишей прекращается.
     */
    SPlotContol.prototype.handleMouseUp = function (event) {
        this.splot.render();
        event.target.removeEventListener('mousemove', this.handleMouseMoveWithContext);
        event.target.removeEventListener('mouseup', this.handleMouseUpWithContext);
    };
    /** ****************************************************************************
     *
     * Реагирует на нажатие клавиши мыши. В момент нажатия и удержания клавиши запускается анализ движения мыши (с зажатой
     * клавишей).
     */
    SPlotContol.prototype.handleMouseDown = function (event) {
        event.preventDefault();
        this.splot.canvas.addEventListener('mousemove', this.handleMouseMoveWithContext);
        this.splot.canvas.addEventListener('mouseup', this.handleMouseUpWithContext);
        this.transform.startInvViewProjMat = m3.inverse(this.transform.viewProjectionMat);
        this.transform.startCamera = Object.assign({}, this.splot.camera);
        this.transform.startClipPos = this.getClipSpaceMousePosition(event);
        this.transform.startPos = m3.transformPoint(this.transform.startInvViewProjMat, this.transform.startClipPos);
        this.transform.startMousePos = [event.clientX, event.clientY];
        this.splot.render();
    };
    /** ****************************************************************************
     *
     * Реагирует на зумирование мыши. В момент зумирования мыши происходит зумирование координатной плоскости.
     */
    SPlotContol.prototype.handleMouseWheel = function (event) {
        event.preventDefault();
        var _a = this.getClipSpaceMousePosition(event), clipX = _a[0], clipY = _a[1];
        // position before zooming
        var _b = m3.transformPoint(m3.inverse(this.transform.viewProjectionMat), [clipX, clipY]), preZoomX = _b[0], preZoomY = _b[1];
        // multiply the wheel movement by the current zoom level, so we zoom less when zoomed in and more when zoomed out
        var newZoom = this.splot.camera.zoom * Math.pow(2, event.deltaY * -0.01);
        this.splot.camera.zoom = Math.max(0.002, Math.min(200, newZoom));
        this.updateViewProjection();
        // position after zooming
        var _c = m3.transformPoint(m3.inverse(this.transform.viewProjectionMat), [clipX, clipY]), postZoomX = _c[0], postZoomY = _c[1];
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


Object.defineProperty(exports, "__esModule", ({ value: true }));
var utils_1 = __webpack_require__(/*! ./utils */ "./utils.ts");
/** ****************************************************************************
 *
 * Класс-хелпер, реализующий поддержку режима отладки для класса SPlot.
 */
var SPlotDebug = /** @class */ (function () {
    /** Хелпер будет иметь полный доступ к экземпляру SPlot. */
    function SPlotDebug(splot) {
        this.splot = splot;
        /** Признак активации режим отладки. */
        this.isEnable = false;
        /** Стиль заголовка режима отладки. */
        this.headerStyle = 'font-weight: bold; color: #ffffff; background-color: #cc0000;';
        /** Стиль заголовка группы параметров. */
        this.groupStyle = 'font-weight: bold; color: #ffffff;';
    }
    /** ****************************************************************************
     *
     * Подготавливает хелпер к использованию.
     */
    SPlotDebug.prototype.setup = function (clearConsole) {
        if (clearConsole === void 0) { clearConsole = false; }
        if (clearConsole) {
            console.clear();
        }
    };
    /** ****************************************************************************
     *
     * Выводит в консоль отладочную информацию, если включен режим отладки.
     *
     * @remarks
     * Отладочная информация выводится блоками. Названия блоков я передаются в метод перечислением строк. Каждая строка
     * интерпретируется как имя метода. Если нужные методы вывода блока существуют - они вызываются. Если метода с нужным
     * названием не существует - герерируется ошибка.
     *
     * @param logItems - Перечисление строк с названиями отладочных блоков, которые нужно отобразить в консоли.
     */
    SPlotDebug.prototype.log = function () {
        var _this = this;
        var logItems = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            logItems[_i] = arguments[_i];
        }
        if (this.isEnable) {
            logItems.forEach(function (item) {
                if (typeof _this[item] === 'function') {
                    _this[item]();
                }
                else {
                    throw new Error('Отладочного блока ' + item + '" не существует!');
                }
            });
        }
    };
    /** ****************************************************************************
     *
     * Выводит вступительную часть о режиме отладки.
     */
    SPlotDebug.prototype.intro = function () {
        console.log('%cОтладка SPlot на объекте #' + this.splot.canvas.id, this.headerStyle);
        if (this.splot.demo.isEnable) {
            console.log('%cВключен демонстрационный режим данных', this.groupStyle);
        }
        console.group('%cПредупреждение', this.groupStyle);
        console.log('Открытая консоль браузера и другие активные средства контроля разработки существенно снижают производительность высоконагруженных приложений. Для объективного анализа производительности все подобные средства должны быть отключены, а консоль брzаузера закрыта. Некоторые данные отладочной информации в зависимости от используемого браузера могут не отображаться или отображаться некорректно. Средство отладки протестировано в браузере Google Chrome v.90');
        console.groupEnd();
    };
    /** ****************************************************************************
     *
     * Выводит информацию о графической системе клиента.
     */
    SPlotDebug.prototype.gpu = function () {
        console.group('%cВидеосистема', this.groupStyle);
        console.log('Графическая карта: ' + this.splot.webgl.gpu.hardware);
        console.log('Версия GL: ' + this.splot.webgl.gpu.software);
        console.groupEnd();
    };
    /** ****************************************************************************
     *
     * Выводит информация о текущем экземпляре класса SPlot.
     */
    SPlotDebug.prototype.instance = function () {
        console.group('%cНастройка параметров экземпляра', this.groupStyle);
        console.dir(this.splot);
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
    /** ****************************************************************************
     *
     * Выводит коды шейдеров.
     */
    SPlotDebug.prototype.shaders = function () {
        console.group('%cСоздан вершинный шейдер: ', this.groupStyle);
        console.log(this.splot.shaderCodeVert);
        console.groupEnd();
        console.group('%cСоздан фрагментный шейдер: ', this.groupStyle);
        console.log(this.splot.shaderCodeFrag);
        console.groupEnd();
    };
    /** ****************************************************************************
     *
     * Выводит сообщение о начале процессе загрузки данных.
     */
    SPlotDebug.prototype.loading = function () {
        console.log('%cЗапущен процесс загрузки данных [' + utils_1.getCurrentTime() + ']...', this.groupStyle);
        console.time('Длительность');
    };
    /** ****************************************************************************
     *
     * Выводит статистику по завершении процесса загрузки данных.
     */
    SPlotDebug.prototype.loaded = function () {
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
    /** ****************************************************************************
     *
     * Выводит сообщение о запуске рендера.
     */
    SPlotDebug.prototype.started = function () {
        console.log('%cРендер запущен', this.groupStyle);
    };
    /** ****************************************************************************
     *
     * Выводит сообщение об остановке рендера.
     */
    SPlotDebug.prototype.stoped = function () {
        console.log('%cРендер остановлен', this.groupStyle);
    };
    /** ****************************************************************************
     *
     * Выводит сообшение об очистке области рендера.
     */
    SPlotDebug.prototype.cleared = function (color) {
        console.log('%cОбласть рендера очищена [' + color + ']', this.groupStyle);
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


Object.defineProperty(exports, "__esModule", ({ value: true }));
var utils_1 = __webpack_require__(/*! ./utils */ "./utils.ts");
/** ****************************************************************************
 *
 * Класс-хелпер, реализующий поддержку режима демонстрационных данных для класса SPlot.
 */
var SPlotDemo = /** @class */ (function () {
    /** Хелпер будет иметь полный доступ к экземпляру SPlot. */
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
    /** ****************************************************************************
     *
     * Подготавливает хелпер к использованию.
     */
    SPlotDemo.prototype.setup = function () {
        this.index = 0;
    };
    /** ****************************************************************************
     *
     * Имитирует итератор исходных объектов.
     */
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


Object.defineProperty(exports, "__esModule", ({ value: true }));
var utils_1 = __webpack_require__(/*! ./utils */ "./utils.ts");
/** ****************************************************************************
 *
 * Класс-хелпер, реализующий управление контекстом рендеринга WebGL класса Splot.
 */
var SPlotWebGl = /** @class */ (function () {
    /** Хелпер будет иметь полный доступ к экземпляру SPlot. */
    function SPlotWebGl(splot) {
        this.splot = splot;
        /** Параметры инициализации контекста рендеринга WebGL. */
        this.alpha = false;
        this.depth = false;
        this.stencil = false;
        this.antialias = false;
        this.desynchronized = false;
        this.premultipliedAlpha = false;
        this.preserveDrawingBuffer = false;
        this.failIfMajorPerformanceCaveat = false;
        this.powerPreference = 'high-performance';
        /** Названия элементов графической системы клиента. */
        this.gpu = { hardware: '-', software: '-' };
        /** Переменные для связи приложения с программой WebGL. */
        this.variables = new Map();
        /** Буферы видеопамяти WebGL. */
        this.data = new Map();
        /** Правила соответствия типов типизированных массивов и типов переменных WebGL. */
        this.glNumberTypes = new Map([
            ['Int8Array', 0x1400],
            ['Uint8Array', 0x1401],
            ['Int16Array', 0x1402],
            ['Uint16Array', 0x1403],
            ['Float32Array', 0x1406] // gl.FLOAT
        ]);
    }
    /** ****************************************************************************
     *
     * Подготавливает хелпер к использованию.
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
        if (this.gl === null) {
            throw new Error('Ошибка создания контекста рендеринга WebGL!');
        }
        /** Получение информации о графической системе клиента. */
        var ext = this.gl.getExtension('WEBGL_debug_renderer_info');
        this.gpu.hardware = (ext) ? this.gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : '[неизвестно]';
        this.gpu.software = this.gl.getParameter(this.gl.VERSION);
        this.splot.debug.log('gpu');
        /** Кооректировка размера области просмотра. */
        this.splot.canvas.width = this.splot.canvas.clientWidth;
        this.splot.canvas.height = this.splot.canvas.clientHeight;
        this.gl.viewport(0, 0, this.splot.canvas.width, this.splot.canvas.height);
    };
    /** ****************************************************************************
     *
     * Устанавливает цвет фона контекста рендеринга WebGL.
     */
    SPlotWebGl.prototype.setBgColor = function (color) {
        var _a = utils_1.colorFromHexToGlRgb(color), r = _a[0], g = _a[1], b = _a[2];
        this.gl.clearColor(r, g, b, 0.0);
    };
    /** ****************************************************************************
     *
     * Закрашивает контекст рендеринга WebGL цветом фона.
     */
    SPlotWebGl.prototype.clearBackground = function () {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    };
    /** ****************************************************************************
     *
     * Создает шейдер WebGL.
     *
     * @param type - Тип шейдера.
     * @param code - GLSL-код шейдера.
     * @returns Созданный шейдер.
     */
    SPlotWebGl.prototype.createShader = function (type, code) {
        var shader = this.gl.createShader(this.gl[type]);
        this.gl.shaderSource(shader, code);
        this.gl.compileShader(shader);
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            throw new Error('Ошибка компиляции шейдера [' + type + ']. ' + this.gl.getShaderInfoLog(shader));
        }
        return shader;
    };
    /** ****************************************************************************
     *
     * Создает программу WebGL из шейдеров.
     *
     * @param shaderVert - Вершинный шейдер.
     * @param shaderFrag - Фрагментный шейдер.
     */
    SPlotWebGl.prototype.createProgramFromShaders = function (shaderVert, shaderFrag) {
        this.gpuProgram = this.gl.createProgram();
        this.gl.attachShader(this.gpuProgram, shaderVert);
        this.gl.attachShader(this.gpuProgram, shaderFrag);
        this.gl.linkProgram(this.gpuProgram);
        this.gl.useProgram(this.gpuProgram);
        this.splot.debug.log('shaders');
    };
    /** ****************************************************************************
     *
     * Создает программу WebGL из GLSL-кодов шейдеров.
     *
     * @param shaderCodeVert - Код вершинного шейдера.
     * @param shaderCodeFrag - Код фрагментного шейдера.
     */
    SPlotWebGl.prototype.createProgram = function (shaderCodeVert, shaderCodeFrag) {
        this.createProgramFromShaders(this.createShader('VERTEX_SHADER', shaderCodeVert), this.createShader('FRAGMENT_SHADER', shaderCodeFrag));
    };
    /** ****************************************************************************
     *
     * Создает связь переменной приложения с программой WebGl.
     *
     * @remarks
     * Переменные сохраняются в ассоциативном массиве, где ключи - это названия переменных. Название переменной должно
     * начинаться с префикса, обозначающего ее GLSL-тип. Префикс "u_" описывает переменную типа uniform. Префикс "a_"
     * описывает переменную типа attribute.
     *
     * @param varName - Имя переменной (строка).
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
            throw new Error('Указан неверный тип (префикс) переменной шейдера: ' + varName);
        }
    };
    /** ****************************************************************************
     *
     * Создает связь набора переменных приложения с программой WebGl.
     *
     * @remarks
     * Делает тоже самое, что и метод {@link createVariable}, но позволяет за один вызов создать сразу несколько
     * переменных.
     *
     * @param varNames - Перечисления имен переменных (строками).
     */
    SPlotWebGl.prototype.createVariables = function () {
        var _this = this;
        var varNames = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            varNames[_i] = arguments[_i];
        }
        varNames.forEach(function (varName) { return _this.createVariable(varName); });
    };
    /** ****************************************************************************
     *
     * Создает в группе буферов WebGL новый буфер и записывает в него переданные данные.
     *
     * @remarks
     * Количество групп буферов и количество буферов в каждой группе не ограничены. Каждая группа имеет свое название и
     * GLSL-тип. Тип группы определяется автоматически на основе типа типизированного массива. Правила соответствия типов
     * определяются переменной {@link glNumberTypes}.
     *
     * @param groupName - Название группы буферов, в которую будет добавлен новый буфер.
     * @param data - Данные в виде типизированного массива для записи в создаваемый буфер.
     * @returns Объем памяти, занятый новым буфером (в байтах).
     */
    SPlotWebGl.prototype.createBuffer = function (groupName, data) {
        var buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW);
        /** Если группы с указанным названием не существует, то она создается. */
        if (!this.data.has(groupName)) {
            this.data.set(groupName, { buffers: [], type: this.glNumberTypes.get(data.constructor.name) });
        }
        this.data.get(groupName).buffers.push(buffer);
        return data.length * data.BYTES_PER_ELEMENT;
    };
    /** ****************************************************************************
     *
     * Передает значение матрицы 3 х 3 в программу WebGl.
     *
     * @param varName - Имя переменной WebGL (из массива {@link variables}) в которую будет записано переданное значение.
     * @param varValue - Устанавливаемое значение должно являться матрицей вещественных чисел размером 3 х 3, развернутой
     *     в виде одномерного массива из 9 элементов.
     */
    SPlotWebGl.prototype.setVariable = function (varName, varValue) {
        this.gl.uniformMatrix3fv(this.variables.get(varName), false, varValue);
    };
    /** ****************************************************************************
     *
     * Делает буфер WebGl "активным".
     *
     * @param groupName - Название группы буферов, в котором хранится необходимый буфер.
     * @param index - Индекс буфера в группе.
     * @param varName - Имя переменной (из массива {@link variables}), с которой будет связан буфер.
     * @param size - Количество элементов в буфере, соответствующих одной  GL-вершине.
     * @param stride - Размер шага обработки элементов буфера (значение 0 задает размещение элементов друг за другом).
     * @param offset - Смещение относительно начала буфера, начиная с которого будет происходить обработка элементов.
     */
    SPlotWebGl.prototype.setBuffer = function (groupName, index, varName, size, stride, offset) {
        var group = this.data.get(groupName);
        var variable = this.variables.get(varName);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, group.buffers[index]);
        this.gl.enableVertexAttribArray(variable);
        this.gl.vertexAttribPointer(variable, size, group.type, false, stride, offset);
    };
    /** ****************************************************************************
     *
     * Выполняет отрисовку контекста рендеринга WebGL методом примитивных точек.
     *
     * @param first - Индекс GL-вершины, с которой начнетя отрисовка.
     * @param count - Количество орисовываемых GL-вершин.
     */
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
        /** Хелпер WebGL. */
        this.webgl = new splot_webgl_1.default(this);
        /** Хелпер режима демо-данных. */
        this.demo = new splot_demo_1.default(this);
        /** Хелпер режима отладки. */
        this.debug = new splot_debug_1.default(this);
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
        this.debug.log('intro');
        this.webgl.setup(); // Создание контекста рендеринга.
        this.control.setup();
        this.debug.setup();
        this.demo.setup();
        this.debug.log('instance');
        this.webgl.setBgColor(this.grid.bgColor); // Установка цвета очистки рендеринга
        this.shaderCodeVert = shader_code_vert_tmpl_1.default.replace('{EXT-CODE}', this.genShaderColorCode()).trim();
        this.shaderCodeFrag = shader_code_frag_tmpl_1.default.trim();
        this.webgl.createProgram(this.shaderCodeVert, this.shaderCodeFrag); // Создание программы WebGL.
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
        this.debug.log('loading');
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
        this.debug.log('loaded');
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
        if (!this.isRunning) {
            this.render();
            this.control.run();
            this.isRunning = true;
            this.debug.log('started');
        }
    };
    /**
     * Останавливает рендеринг и контроль управления.
     */
    SPlot.prototype.stop = function () {
        if (this.isRunning) {
            this.control.stop();
            this.isRunning = false;
            this.debug.log('stoped');
        }
    };
    /**
     * Очищает фон.
     */
    SPlot.prototype.clear = function () {
        this.webgl.clearBackground();
        this.debug.log('cleared');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zdHlsZS5jc3MiLCJ3ZWJwYWNrOi8vLy4vaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vbTMudHMiLCJ3ZWJwYWNrOi8vLy4vc2hhZGVyLWNvZGUtZnJhZy10bXBsLnRzIiwid2VicGFjazovLy8uL3NoYWRlci1jb2RlLXZlcnQtdG1wbC50cyIsIndlYnBhY2s6Ly8vLi9zcGxvdC1jb250cm9sLnRzIiwid2VicGFjazovLy8uL3NwbG90LWRlYnVnLnRzIiwid2VicGFjazovLy8uL3NwbG90LWRlbW8udHMiLCJ3ZWJwYWNrOi8vLy4vc3Bsb3Qtd2ViZ2wudHMiLCJ3ZWJwYWNrOi8vLy4vc3Bsb3QudHMiLCJ3ZWJwYWNrOi8vLy4vdXRpbHMudHMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovLy93ZWJwYWNrL3N0YXJ0dXAiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7OztBQ0FBLCtEQUFtQztBQUNuQyxnRkFBMkI7QUFDM0Isa0RBQWdCO0FBRWhCLElBQUksQ0FBQyxHQUFHLENBQUM7QUFDVCxJQUFJLENBQUMsR0FBRyxPQUFTLEVBQUUsOEJBQThCO0FBQ2pELElBQUksTUFBTSxHQUFHLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUM7QUFDakosSUFBSSxTQUFTLEdBQUcsS0FBTTtBQUN0QixJQUFJLFVBQVUsR0FBRyxLQUFNO0FBRXZCLGdIQUFnSDtBQUNoSCxTQUFTLGNBQWM7SUFDckIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQ1QsQ0FBQyxFQUFFO1FBQ0gsT0FBTztZQUNMLENBQUMsRUFBRSxpQkFBUyxDQUFDLFNBQVMsQ0FBQztZQUN2QixDQUFDLEVBQUUsaUJBQVMsQ0FBQyxVQUFVLENBQUM7WUFDeEIsS0FBSyxFQUFFLGlCQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ25CLElBQUksRUFBRSxFQUFFLEdBQUcsaUJBQVMsQ0FBQyxFQUFFLENBQUM7WUFDeEIsS0FBSyxFQUFFLGlCQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFHLGdDQUFnQztTQUNuRTtLQUNGOztRQUVDLE9BQU8sSUFBSSxFQUFFLCtDQUErQztBQUNoRSxDQUFDO0FBRUQsZ0ZBQWdGO0FBRWhGLElBQUksV0FBVyxHQUFHLElBQUksZUFBSyxDQUFDLFNBQVMsQ0FBQztBQUV0QyxpRkFBaUY7QUFDakYsZ0VBQWdFO0FBQ2hFLFdBQVcsQ0FBQyxLQUFLLENBQUM7SUFDaEIsUUFBUSxFQUFFLGNBQWM7SUFDeEIsTUFBTSxFQUFFLE1BQU07SUFDZCxJQUFJLEVBQUU7UUFDSixLQUFLLEVBQUUsU0FBUztRQUNoQixNQUFNLEVBQUUsVUFBVTtLQUNuQjtJQUNELEtBQUssRUFBRTtRQUNMLFFBQVEsRUFBRSxJQUFJO0tBQ2Y7SUFDRCxJQUFJLEVBQUU7UUFDSixRQUFRLEVBQUUsS0FBSztLQUNoQjtDQUNGLENBQUM7QUFFRixXQUFXLENBQUMsR0FBRyxFQUFFO0FBRWpCLG9CQUFvQjtBQUVwQiw0Q0FBNEM7Ozs7Ozs7Ozs7Ozs7O0FDbEQ1Qzs7O0dBR0c7QUFDSCxTQUFnQixRQUFRLENBQUMsQ0FBVyxFQUFFLENBQVc7SUFDL0MsT0FBTztRQUNMLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFH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QUFXO0lBQ2pDLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckMsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNyQyxJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3JDLElBQU0sQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO0lBQ3RELE9BQU87UUFDSixDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEdBQUcsR0FBRztRQUMzQixDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMvQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FB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RCxrQkFBa0I7V0FDeEU7V0FDQSwrQ0FBK0MsY0FBYztXQUM3RCxFOzs7OztVQ05BO1VBQ0E7VUFDQTtVQUNBIiwiZmlsZSI6InNjcmlwdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsImltcG9ydCB7IHJhbmRvbUludCB9IGZyb20gJy4vdXRpbHMnXG5pbXBvcnQgU1Bsb3QgZnJvbSAnLi9zcGxvdCdcbmltcG9ydCAnQC9zdHlsZSdcblxubGV0IGkgPSAwXG5sZXQgbiA9IDFfMDAwXzAwMCAgLy8g0JjQvNC40YLQuNGA0YPQtdC80L7QtSDRh9C40YHQu9C+INC+0LHRitC10LrRgtC+0LIuXG5sZXQgY29sb3JzID0gWycjRDgxQzAxJywgJyNFOTk2N0EnLCAnI0JBNTVEMycsICcjRkZENzAwJywgJyNGRkU0QjUnLCAnI0ZGOEMwMCcsICcjMjI4QjIyJywgJyM5MEVFOTAnLCAnIzQxNjlFMScsICcjMDBCRkZGJywgJyM4QjQ1MTMnLCAnIzAwQ0VEMSddXG5sZXQgcGxvdFdpZHRoID0gMzJfMDAwXG5sZXQgcGxvdEhlaWdodCA9IDE2XzAwMFxuXG4vLyDQn9GA0LjQvNC10YAg0LjRgtC10YDQuNGA0YPRjtGJ0LXQuSDRhNGD0L3QutGG0LjQuC4g0JjRgtC10YDQsNGG0LjQuCDQuNC80LjRgtC40YDRg9GO0YLRgdGPINGB0LvRg9GH0LDQudC90YvQvNC4INCy0YvQtNCw0YfQsNC80LguINCf0L7Rh9GC0Lgg0YLQsNC60LbQtSDRgNCw0LHQvtGC0LDQtdGCINGA0LXQttC40Lwg0LTQtdC80L4t0LTQsNC90L3Ri9GFLlxuZnVuY3Rpb24gcmVhZE5leHRPYmplY3QoKSB7XG4gIGlmIChpIDwgbikge1xuICAgIGkrK1xuICAgIHJldHVybiB7XG4gICAgICB4OiByYW5kb21JbnQocGxvdFdpZHRoKSxcbiAgICAgIHk6IHJhbmRvbUludChwbG90SGVpZ2h0KSxcbiAgICAgIHNoYXBlOiByYW5kb21JbnQoMiksXG4gICAgICBzaXplOiAxMCArIHJhbmRvbUludCgyMSksXG4gICAgICBjb2xvcjogcmFuZG9tSW50KGNvbG9ycy5sZW5ndGgpLCAgLy8g0JjQvdC00LXQutGBINGG0LLQtdGC0LAg0LIg0LzQsNGB0YHQuNCy0LUg0YbQstC10YLQvtCyXG4gICAgfVxuICB9XG4gIGVsc2VcbiAgICByZXR1cm4gbnVsbCAgLy8g0JLQvtC30LLRgNCw0YnQsNC10LwgbnVsbCwg0LrQvtCz0LTQsCDQvtCx0YrQtdC60YLRiyBcItC30LDQutC+0L3Rh9C40LvQuNGB0YxcIlxufVxuXG4vKiogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICoqL1xuXG5sZXQgc2NhdHRlclBsb3QgPSBuZXcgU1Bsb3QoJ2NhbnZhczEnKVxuXG4vLyDQndCw0YHRgtGA0L7QudC60LAg0Y3QutC30LXQvNC/0LvRj9GA0LAg0L3QsCDRgNC10LbQuNC8INCy0YvQstC+0LTQsCDQvtGC0LvQsNC00L7Rh9C90L7QuSDQuNC90YTQvtGA0LzQsNGG0LjQuCDQsiDQutC+0L3RgdC+0LvRjCDQsdGA0LDRg9C30LXRgNCwLlxuLy8g0JTRgNGD0LPQuNC1INC/0YDQuNC80LXRgNGLINGA0LDQsdC+0YLRiyDQvtC/0LjRgdCw0L3RiyDQsiDRhNCw0LnQu9C1IHNwbG90LmpzINGB0L4g0YHRgtGA0L7QutC4IDIxNC5cbnNjYXR0ZXJQbG90LnNldHVwKHtcbiAgaXRlcmF0b3I6IHJlYWROZXh0T2JqZWN0LFxuICBjb2xvcnM6IGNvbG9ycyxcbiAgZ3JpZDoge1xuICAgIHdpZHRoOiBwbG90V2lkdGgsXG4gICAgaGVpZ2h0OiBwbG90SGVpZ2h0XG4gIH0sXG4gIGRlYnVnOiB7XG4gICAgaXNFbmFibGU6IHRydWUsXG4gIH0sXG4gIGRlbW86IHtcbiAgICBpc0VuYWJsZTogZmFsc2VcbiAgfVxufSlcblxuc2NhdHRlclBsb3QucnVuKClcblxuLy9zY2F0dGVyUGxvdC5zdG9wKClcblxuLy9zZXRUaW1lb3V0KCgpID0+IHNjYXR0ZXJQbG90LnN0b3AoKSwgMzAwMClcbiIsIlxuLyoqXG4gKiBUYWtlcyB0d28gTWF0cml4M3MsIGEgYW5kIGIsIGFuZCBjb21wdXRlcyB0aGUgcHJvZHVjdCBpbiB0aGUgb3JkZXJcbiAqIHRoYXQgcHJlLWNvbXBvc2VzIGIgd2l0aCBhLiAgSW4gb3RoZXIgd29yZHMsIHRoZSBtYXRyaXggcmV0dXJuZWQgd2lsbFxuICovXG5leHBvcnQgZnVuY3Rpb24gbXVsdGlwbHkoYTogbnVtYmVyW10sIGI6IG51bWJlcltdKTogbnVtYmVyW10ge1xuICByZXR1cm4gW1xuICAgIGJbMF0gKiBhWzBdICsgYlsxXSAqIGFbM10gKyBiWzJdICogYVs2XSxcbiAgICBiWzBdICogYVsxXSArIGJbMV0gKiBhWzRdICsgYlsyXSAqIGFbN10sXG4gICAgYlswXSAqIGFbMl0gKyBiWzFdICogYVs1XSArIGJbMl0gKiBhWzhdLFxuICAgIGJbM10gKiBhWzBdICsgYls0XSAqIGFbM10gKyBiWzVdICogYVs2XSxcbiAgICBiWzNdICogYVsxXSArIGJbNF0gKiBhWzRdICsgYls1XSAqIGFbN10sXG4gICAgYlszXSAqIGFbMl0gKyBiWzRdICogYVs1XSArIGJbNV0gKiBhWzhdLFxuICAgIGJbNl0gKiBhWzBdICsgYls3XSAqIGFbM10gKyBiWzhdICogYVs2XSxcbiAgICBiWzZdICogYVsxXSArIGJbN10gKiBhWzRdICsgYls4XSAqIGFbN10sXG4gICAgYls2XSAqIGFbMl0gKyBiWzddICogYVs1XSArIGJbOF0gKiBhWzhdXG4gIF1cbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgM3gzIGlkZW50aXR5IG1hdHJpeFxuICovXG5leHBvcnQgZnVuY3Rpb24gaWRlbnRpdHkoKTogbnVtYmVyW10ge1xuICByZXR1cm4gW1xuICAgIDEsIDAsIDAsXG4gICAgMCwgMSwgMCxcbiAgICAwLCAwLCAxXG4gIF1cbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgMkQgcHJvamVjdGlvbiBtYXRyaXguIFJldHVybnMgYSBwcm9qZWN0aW9uIG1hdHJpeCB0aGF0IGNvbnZlcnRzIGZyb20gcGl4ZWxzIHRvIGNsaXBzcGFjZSB3aXRoIFkgPSAwIGF0IHRoZVxuICogdG9wLiBUaGlzIG1hdHJpeCBmbGlwcyB0aGUgWSBheGlzIHNvIDAgaXMgYXQgdGhlIHRvcC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHByb2plY3Rpb24od2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpOiBudW1iZXJbXSB7XG4gIHJldHVybiBbXG4gICAgMiAvIHdpZHRoLCAwLCAwLFxuICAgIDAsIC0yIC8gaGVpZ2h0LCAwLFxuICAgIC0xLCAxLCAxXG4gIF1cbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgMkQgdHJhbnNsYXRpb24gbWF0cml4LiBSZXR1cm5zIGEgdHJhbnNsYXRpb24gbWF0cml4IHRoYXQgdHJhbnNsYXRlcyBieSB0eCBhbmQgdHkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0cmFuc2xhdGlvbih0eDogbnVtYmVyLCB0eTogbnVtYmVyKTogbnVtYmVyW10ge1xuICByZXR1cm4gW1xuICAgIDEsIDAsIDAsXG4gICAgMCwgMSwgMCxcbiAgICB0eCwgdHksIDFcbiAgXVxufVxuXG4vKipcbiAqIE11bHRpcGxpZXMgYnkgYSAyRCB0cmFuc2xhdGlvbiBtYXRyaXhcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRyYW5zbGF0ZShtOiBudW1iZXJbXSwgdHg6IG51bWJlciwgdHk6IG51bWJlcik6IG51bWJlcltdIHtcbiAgcmV0dXJuIG11bHRpcGx5KG0sIHRyYW5zbGF0aW9uKHR4LCB0eSkpXG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIDJEIHNjYWxpbmcgbWF0cml4XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzY2FsaW5nKHN4OiBudW1iZXIsIHN5OiBudW1iZXIpOiBudW1iZXJbXSB7XG4gIHJldHVybiBbXG4gICAgc3gsIDAsIDAsXG4gICAgMCwgc3ksIDAsXG4gICAgMCwgMCwgMVxuICBdXG59XG5cbi8qKlxuICogTXVsdGlwbGllcyBieSBhIDJEIHNjYWxpbmcgbWF0cml4XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzY2FsZShtOiBudW1iZXJbXSwgc3g6IG51bWJlciwgc3k6IG51bWJlcik6IG51bWJlcltdIHtcbiAgcmV0dXJuIG11bHRpcGx5KG0sIHNjYWxpbmcoc3gsIHN5KSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRyYW5zZm9ybVBvaW50KG06IG51bWJlcltdLCB2OiBudW1iZXJbXSk6IG51bWJlcltdIHtcbiAgY29uc3QgZCA9IHZbMF0gKiBtWzJdICsgdlsxXSAqIG1bNV0gKyBtWzhdXG4gIHJldHVybiBbXG4gICAgKHZbMF0gKiBtWzBdICsgdlsxXSAqIG1bM10gKyBtWzZdKSAvIGQsXG4gICAgKHZbMF0gKiBtWzFdICsgdlsxXSAqIG1bNF0gKyBtWzddKSAvIGRcbiAgXVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaW52ZXJzZShtOiBudW1iZXJbXSk6IG51bWJlcltdIHtcbiAgY29uc3QgdDAwID0gbVs0XSAqIG1bOF0gLSBtWzVdICogbVs3XVxuICBjb25zdCB0MTAgPSBtWzFdICogbVs4XSAtIG1bMl0gKiBtWzddXG4gIGNvbnN0IHQyMCA9IG1bMV0gKiBtWzVdIC0gbVsyXSAqIG1bNF1cbiAgY29uc3QgZCA9IDEuMCAvIChtWzBdICogdDAwIC0gbVszXSAqIHQxMCArIG1bNl0gKiB0MjApXG4gIHJldHVybiBbXG4gICAgIGQgKiB0MDAsIC1kICogdDEwLCBkICogdDIwLFxuICAgIC1kICogKG1bM10gKiBtWzhdIC0gbVs1XSAqIG1bNl0pLFxuICAgICBkICogKG1bMF0gKiBtWzhdIC0gbVsyXSAqIG1bNl0pLFxuICAgIC1kICogKG1bMF0gKiBtWzVdIC0gbVsyXSAqIG1bM10pLFxuICAgICBkICogKG1bM10gKiBtWzddIC0gbVs0XSAqIG1bNl0pLFxuICAgIC1kICogKG1bMF0gKiBtWzddIC0gbVsxXSAqIG1bNl0pLFxuICAgICBkICogKG1bMF0gKiBtWzRdIC0gbVsxXSAqIG1bM10pXG4gIF1cbn1cbiIsImV4cG9ydCBkZWZhdWx0XG5gXG5wcmVjaXNpb24gbG93cCBmbG9hdDtcbnZhcnlpbmcgdmVjMyB2X2NvbG9yO1xudmFyeWluZyBmbG9hdCB2X3NoYXBlO1xudm9pZCBtYWluKCkge1xuICBpZiAodl9zaGFwZSA9PSAwLjApIHtcbiAgICBmbG9hdCB2U2l6ZSA9IDIwLjA7XG4gICAgZmxvYXQgZGlzdGFuY2UgPSBsZW5ndGgoMi4wICogZ2xfUG9pbnRDb29yZCAtIDEuMCk7XG4gICAgaWYgKGRpc3RhbmNlID4gMS4wKSB7IGRpc2NhcmQ7IH07XG4gICAgZ2xfRnJhZ0NvbG9yID0gdmVjNCh2X2NvbG9yLnJnYiwgMS4wKTtcbiAgfVxuICBlbHNlIGlmICh2X3NoYXBlID09IDEuMCkge1xuICAgIGdsX0ZyYWdDb2xvciA9IHZlYzQodl9jb2xvci5yZ2IsIDEuMCk7XG4gIH1cbn1cbmBcblxuLyoqXG5leHBvcnQgZGVmYXVsdFxuICBgXG5wcmVjaXNpb24gbG93cCBmbG9hdDtcbnZhcnlpbmcgdmVjMyB2X2NvbG9yO1xudm9pZCBtYWluKCkge1xuICBmbG9hdCB2U2l6ZSA9IDIwLjA7XG4gIGZsb2F0IGRpc3RhbmNlID0gbGVuZ3RoKDIuMCAqIGdsX1BvaW50Q29vcmQgLSAxLjApO1xuICBpZiAoZGlzdGFuY2UgPiAxLjApIHsgZGlzY2FyZDsgfVxuICBnbF9GcmFnQ29sb3IgPSB2ZWM0KHZfY29sb3IucmdiLCAxLjApO1xuXG4gICB2ZWM0IHVFZGdlQ29sb3IgPSB2ZWM0KDAuNSwgMC41LCAwLjUsIDEuMCk7XG4gZmxvYXQgdUVkZ2VTaXplID0gMS4wO1xuXG5mbG9hdCBzRWRnZSA9IHNtb290aHN0ZXAoXG4gIHZTaXplIC0gdUVkZ2VTaXplIC0gMi4wLFxuICB2U2l6ZSAtIHVFZGdlU2l6ZSxcbiAgZGlzdGFuY2UgKiAodlNpemUgKyB1RWRnZVNpemUpXG4pO1xuZ2xfRnJhZ0NvbG9yID0gKHVFZGdlQ29sb3IgKiBzRWRnZSkgKyAoKDEuMCAtIHNFZGdlKSAqIGdsX0ZyYWdDb2xvcik7XG5cbmdsX0ZyYWdDb2xvci5hID0gZ2xfRnJhZ0NvbG9yLmEgKiAoMS4wIC0gc21vb3Roc3RlcChcbiAgICB2U2l6ZSAtIDIuMCxcbiAgICB2U2l6ZSxcbiAgICBkaXN0YW5jZSAqIHZTaXplXG4pKTtcblxufVxuYFxuKi9cbiIsImV4cG9ydCBkZWZhdWx0XG5gXG5hdHRyaWJ1dGUgdmVjMiBhX3Bvc2l0aW9uO1xuYXR0cmlidXRlIGZsb2F0IGFfY29sb3I7XG5hdHRyaWJ1dGUgZmxvYXQgYV9zaXplO1xuYXR0cmlidXRlIGZsb2F0IGFfc2hhcGU7XG51bmlmb3JtIG1hdDMgdV9tYXRyaXg7XG52YXJ5aW5nIHZlYzMgdl9jb2xvcjtcbnZhcnlpbmcgZmxvYXQgdl9zaGFwZTtcbnZvaWQgbWFpbigpIHtcbiAgZ2xfUG9zaXRpb24gPSB2ZWM0KCh1X21hdHJpeCAqIHZlYzMoYV9wb3NpdGlvbiwgMSkpLnh5LCAwLjAsIDEuMCk7XG4gIGdsX1BvaW50U2l6ZSA9IGFfc2l6ZTtcbiAgdl9zaGFwZSA9IGFfc2hhcGU7XG4gIHtFWFQtQ09ERX1cbn1cbmBcbiIsImltcG9ydCBTUGxvdCBmcm9tICcuL3NwbG90J1xuaW1wb3J0ICogYXMgbTMgZnJvbSAnLi9tMydcblxuLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqXG4gKiDQmtC70LDRgdGBLdGF0LXQu9C/0LXRgCwg0YDQtdCw0LvQuNC30YPRjtGJ0LjQuSDQvtCx0YDQsNCx0L7RgtC60YMg0YHRgNC10LTRgdGC0LIg0LLQstC+0LTQsCAo0LzRi9GI0LgsINGC0YDQtdC60L/QsNC00LAg0Lgg0YIu0L8uKSDQuCDQvNCw0YLQtdC80LDRgtC40YfQtdGB0LrQuNC1INGA0LDRgdGH0LXRgtGLINGC0LXRhdC90LjRh9C10YHQutC40YUg0LTQsNC90L3Ri9GFLFxuICog0YHQvtC+0YLQstC10YLRgdCy0YPRjtGJ0LjRhSDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjRj9C8INCz0YDQsNGE0LjQutCwINC00LvRjyDQutC70LDRgdGB0LAgU3Bsb3QuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNQbG90Q29udG9sIHtcblxuICAvKiog0KLQtdGF0L3QuNGH0LXRgdC60LDRjyDQuNC90YTQvtGA0LzQsNGG0LjRjywg0LjRgdC/0L7Qu9GM0LfRg9C10LzQsNGPINC/0YDQuNC70L7QttC10L3QuNC10Lwg0LTQu9GPINGA0LDRgdGH0LXRgtCwINGC0YDQsNC90YHRhNC+0YDQvNCw0YbQuNC5LiAqL1xuICBwdWJsaWMgdHJhbnNmb3JtOiBTUGxvdFRyYW5zZm9ybSA9IHtcbiAgICB2aWV3UHJvamVjdGlvbk1hdDogW10sXG4gICAgc3RhcnRJbnZWaWV3UHJvak1hdDogW10sXG4gICAgc3RhcnRDYW1lcmE6IHsgeDogMCwgeTogMCwgem9vbTogMSB9LFxuICAgIHN0YXJ0UG9zOiBbXSxcbiAgICBzdGFydENsaXBQb3M6IFtdLFxuICAgIHN0YXJ0TW91c2VQb3M6IFtdXG4gIH1cblxuICAvKiog0J7QsdGA0LDQsdC+0YLRh9C40LrQuCDRgdC+0LHRi9GC0LjQuSDRgdGA0LXQtNGB0YLQsiDQstCy0L7QtNCwINGBINC30LDQutGA0LXQv9C70LXQvdC90YvQvNC4INC60L7QvdGC0LXQutGB0YLQsNC80LguICovXG4gIHByb3RlY3RlZCBoYW5kbGVNb3VzZURvd25XaXRoQ29udGV4dDogRXZlbnRMaXN0ZW5lciA9IHRoaXMuaGFuZGxlTW91c2VEb3duLmJpbmQodGhpcykgYXMgRXZlbnRMaXN0ZW5lclxuICBwcm90ZWN0ZWQgaGFuZGxlTW91c2VXaGVlbFdpdGhDb250ZXh0OiBFdmVudExpc3RlbmVyID0gdGhpcy5oYW5kbGVNb3VzZVdoZWVsLmJpbmQodGhpcykgYXMgRXZlbnRMaXN0ZW5lclxuICBwcm90ZWN0ZWQgaGFuZGxlTW91c2VNb3ZlV2l0aENvbnRleHQ6IEV2ZW50TGlzdGVuZXIgPSB0aGlzLmhhbmRsZU1vdXNlTW92ZS5iaW5kKHRoaXMpIGFzIEV2ZW50TGlzdGVuZXJcbiAgcHJvdGVjdGVkIGhhbmRsZU1vdXNlVXBXaXRoQ29udGV4dDogRXZlbnRMaXN0ZW5lciA9IHRoaXMuaGFuZGxlTW91c2VVcC5iaW5kKHRoaXMpIGFzIEV2ZW50TGlzdGVuZXJcblxuICAvKiog0KXQtdC70L/QtdGAINCx0YPQtNC10YIg0LjQvNC10YLRjCDQv9C+0LvQvdGL0Lkg0LTQvtGB0YLRg9C/INC6INGN0LrQt9C10LzQv9C70Y/RgNGDIFNQbG90LiAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlYWRvbmx5IHNwbG90OiBTUGxvdFxuICApIHsgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCf0L7QtNCz0L7RgtCw0LLQu9C40LLQsNC10YIg0YXQtdC70L/QtdGAINC6INC40YHQv9C+0LvRjNC30L7QstCw0L3QuNGOLlxuICAgKi9cbiAgc2V0dXAoKTogdm9pZCB7XG5cbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCX0LDQv9GD0YHQutCw0LXRgiDQv9GA0L7RgdC70YPRiNC60YMg0YHQvtCx0YvRgtC40Lkg0LzRi9GI0LguXG4gICAqL1xuICBwdWJsaWMgcnVuKCk6IHZvaWQge1xuICAgIHRoaXMuc3Bsb3QuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMuaGFuZGxlTW91c2VEb3duV2l0aENvbnRleHQpXG4gICAgdGhpcy5zcGxvdC5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignd2hlZWwnLCB0aGlzLmhhbmRsZU1vdXNlV2hlZWxXaXRoQ29udGV4dClcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCe0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdGCINC/0YDQvtGB0LvRg9GI0LrRgyDRgdC+0LHRi9GC0LjQuSDQvNGL0YjQuC5cbiAgICovXG4gIHB1YmxpYyBzdG9wKCk6IHZvaWQge1xuICAgIHRoaXMuc3Bsb3QuY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMuaGFuZGxlTW91c2VEb3duV2l0aENvbnRleHQpXG4gICAgdGhpcy5zcGxvdC5jYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcignd2hlZWwnLCB0aGlzLmhhbmRsZU1vdXNlV2hlZWxXaXRoQ29udGV4dClcbiAgICB0aGlzLnNwbG90LmNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLmhhbmRsZU1vdXNlTW92ZVdpdGhDb250ZXh0KVxuICAgIHRoaXMuc3Bsb3QuY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLmhhbmRsZU1vdXNlVXBXaXRoQ29udGV4dClcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqXG4gICAqL1xuICBwcm90ZWN0ZWQgbWFrZUNhbWVyYU1hdHJpeCgpOiBudW1iZXJbXSB7XG5cbiAgICBjb25zdCB6b29tU2NhbGUgPSAxIC8gdGhpcy5zcGxvdC5jYW1lcmEuem9vbSFcblxuICAgIGxldCBjYW1lcmFNYXQgPSBtMy5pZGVudGl0eSgpXG4gICAgY2FtZXJhTWF0ID0gbTMudHJhbnNsYXRlKGNhbWVyYU1hdCwgdGhpcy5zcGxvdC5jYW1lcmEueCEsIHRoaXMuc3Bsb3QuY2FtZXJhLnkhKVxuICAgIGNhbWVyYU1hdCA9IG0zLnNjYWxlKGNhbWVyYU1hdCwgem9vbVNjYWxlLCB6b29tU2NhbGUpXG5cbiAgICByZXR1cm4gY2FtZXJhTWF0XG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQntCx0L3QvtCy0LvRj9C10YIg0LzQsNGC0YDQuNGG0YMg0YLRgNCw0L3RgdGE0L7RgNC80LDRhtC40LguXG4gICAqL1xuICBwdWJsaWMgdXBkYXRlVmlld1Byb2plY3Rpb24oKTogdm9pZCB7XG4gICAgY29uc3QgcHJvamVjdGlvbk1hdCA9IG0zLnByb2plY3Rpb24odGhpcy5zcGxvdC5jYW52YXMud2lkdGgsIHRoaXMuc3Bsb3QuY2FudmFzLmhlaWdodClcbiAgICBjb25zdCBjYW1lcmFNYXQgPSB0aGlzLm1ha2VDYW1lcmFNYXRyaXgoKVxuICAgIGxldCB2aWV3TWF0ID0gbTMuaW52ZXJzZShjYW1lcmFNYXQpXG4gICAgdGhpcy50cmFuc2Zvcm0udmlld1Byb2plY3Rpb25NYXQgPSBtMy5tdWx0aXBseShwcm9qZWN0aW9uTWF0LCB2aWV3TWF0KVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0J/RgNC10L7QsdGA0LDQt9GD0LXRgiDQutC+0L7RgNC00LjQvdCw0YLRiyDQvNGL0YjQuCDQsiBHTC3QutC+0L7RgNC00LjQvdCw0YLRiy5cbiAgICovXG4gIHByb3RlY3RlZCBnZXRDbGlwU3BhY2VNb3VzZVBvc2l0aW9uKGV2ZW50OiBNb3VzZUV2ZW50KTogbnVtYmVyW10ge1xuXG4gICAgLy8gZ2V0IGNhbnZhcyByZWxhdGl2ZSBjc3MgcG9zaXRpb25cbiAgICBjb25zdCByZWN0ID0gdGhpcy5zcGxvdC5jYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICBjb25zdCBjc3NYID0gZXZlbnQuY2xpZW50WCAtIHJlY3QubGVmdFxuICAgIGNvbnN0IGNzc1kgPSBldmVudC5jbGllbnRZIC0gcmVjdC50b3BcblxuICAgIC8qKiDQndC+0YDQvNCw0LvQuNC30LDRhtC40Y8g0LrQvtC+0YDQtNC40L3QsNGCIFswLi4xXSAqL1xuICAgIGNvbnN0IG5vcm1YID0gY3NzWCAvIHRoaXMuc3Bsb3QuY2FudmFzLmNsaWVudFdpZHRoXG4gICAgY29uc3Qgbm9ybVkgPSBjc3NZIC8gdGhpcy5zcGxvdC5jYW52YXMuY2xpZW50SGVpZ2h0XG5cbiAgICAvKiog0J/QvtC70YPRh9C10L3QuNC1IEdMLdC60L7QvtGA0LTQuNC90LDRgiBbLTEuLjFdICovXG4gICAgY29uc3QgY2xpcFggPSBub3JtWCAqIDIgLSAxXG4gICAgY29uc3QgY2xpcFkgPSBub3JtWSAqIC0yICsgMVxuXG4gICAgcmV0dXJuIFtjbGlwWCwgY2xpcFldXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKlxuICAgKi9cbiAgcHJvdGVjdGVkIG1vdmVDYW1lcmEoZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcblxuICAgIGNvbnN0IHBvcyA9IG0zLnRyYW5zZm9ybVBvaW50KHRoaXMudHJhbnNmb3JtLnN0YXJ0SW52Vmlld1Byb2pNYXQsIHRoaXMuZ2V0Q2xpcFNwYWNlTW91c2VQb3NpdGlvbihldmVudCkpXG5cbiAgICB0aGlzLnNwbG90LmNhbWVyYS54ID0gdGhpcy50cmFuc2Zvcm0uc3RhcnRDYW1lcmEueCEgKyB0aGlzLnRyYW5zZm9ybS5zdGFydFBvc1swXSAtIHBvc1swXVxuICAgIHRoaXMuc3Bsb3QuY2FtZXJhLnkgPSB0aGlzLnRyYW5zZm9ybS5zdGFydENhbWVyYS55ISArIHRoaXMudHJhbnNmb3JtLnN0YXJ0UG9zWzFdIC0gcG9zWzFdXG5cbiAgICB0aGlzLnNwbG90LnJlbmRlcigpXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQoNC10LDQs9C40YDRg9C10YIg0L3QsCDQtNCy0LjQttC10L3QuNC1INC80YvRiNC4INCyINC80L7QvNC10L3Rgiwg0LrQvtCz0LTQsCDQtdC1INC60LvQsNCy0LjRiNCwINGD0LTQtdGA0LbQuNCy0LDQtdGC0YHRjyDQvdCw0LbQsNGC0L7QuS4g0JzQtdGC0L7QtCDQv9C10YDQtdC80LXRidCw0LXRgiDQvtCx0LvQsNGB0YLRjCDQstC40LTQuNC80L7RgdGC0Lgg0L3QsFxuICAgKiDQv9C70L7RgdC60L7RgdGC0Lgg0LLQvNC10YHRgtC1INGBINC00LLQuNC20LXQvdC40LXQvCDQvNGL0YjQuC5cbiAgICovXG4gIHByb3RlY3RlZCBoYW5kbGVNb3VzZU1vdmUoZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICB0aGlzLm1vdmVDYW1lcmEoZXZlbnQpXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQoNC10LDQs9C40YDRg9C10YIg0L3QsCDQvtGC0LbQsNGC0LjQtSDQutC70LDQstC40YjQuCDQvNGL0YjQuC4g0JIg0LzQvtC80LXQvdGCINC+0YLQttCw0YLQuNGPINC60LvQsNCy0LjRiNC4INCw0L3QsNC70LjQtyDQtNCy0LjQttC10L3QuNGPINC80YvRiNC4INGBINC30LDQttCw0YLQvtC5INC60LvQsNCy0LjRiNC10Lkg0L/RgNC10LrRgNCw0YnQsNC10YLRgdGPLlxuICAgKi9cbiAgcHJvdGVjdGVkIGhhbmRsZU1vdXNlVXAoZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICB0aGlzLnNwbG90LnJlbmRlcigpXG4gICAgZXZlbnQudGFyZ2V0IS5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLmhhbmRsZU1vdXNlTW92ZVdpdGhDb250ZXh0KVxuICAgIGV2ZW50LnRhcmdldCEucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuaGFuZGxlTW91c2VVcFdpdGhDb250ZXh0KVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0KDQtdCw0LPQuNGA0YPQtdGCINC90LAg0L3QsNC20LDRgtC40LUg0LrQu9Cw0LLQuNGI0Lgg0LzRi9GI0LguINCSINC80L7QvNC10L3RgiDQvdCw0LbQsNGC0LjRjyDQuCDRg9C00LXRgNC20LDQvdC40Y8g0LrQu9Cw0LLQuNGI0Lgg0LfQsNC/0YPRgdC60LDQtdGC0YHRjyDQsNC90LDQu9C40Lcg0LTQstC40LbQtdC90LjRjyDQvNGL0YjQuCAo0YEg0LfQsNC20LDRgtC+0LlcbiAgICog0LrQu9Cw0LLQuNGI0LXQuSkuXG4gICAqL1xuICBwcm90ZWN0ZWQgaGFuZGxlTW91c2VEb3duKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG5cbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgdGhpcy5zcGxvdC5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5oYW5kbGVNb3VzZU1vdmVXaXRoQ29udGV4dClcbiAgICB0aGlzLnNwbG90LmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5oYW5kbGVNb3VzZVVwV2l0aENvbnRleHQpXG5cbiAgICB0aGlzLnRyYW5zZm9ybS5zdGFydEludlZpZXdQcm9qTWF0ID0gbTMuaW52ZXJzZSh0aGlzLnRyYW5zZm9ybS52aWV3UHJvamVjdGlvbk1hdClcbiAgICB0aGlzLnRyYW5zZm9ybS5zdGFydENhbWVyYSA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3Bsb3QuY2FtZXJhKVxuICAgIHRoaXMudHJhbnNmb3JtLnN0YXJ0Q2xpcFBvcyA9IHRoaXMuZ2V0Q2xpcFNwYWNlTW91c2VQb3NpdGlvbihldmVudClcbiAgICB0aGlzLnRyYW5zZm9ybS5zdGFydFBvcyA9IG0zLnRyYW5zZm9ybVBvaW50KHRoaXMudHJhbnNmb3JtLnN0YXJ0SW52Vmlld1Byb2pNYXQsIHRoaXMudHJhbnNmb3JtLnN0YXJ0Q2xpcFBvcylcbiAgICB0aGlzLnRyYW5zZm9ybS5zdGFydE1vdXNlUG9zID0gW2V2ZW50LmNsaWVudFgsIGV2ZW50LmNsaWVudFldXG5cbiAgICB0aGlzLnNwbG90LnJlbmRlcigpXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQoNC10LDQs9C40YDRg9C10YIg0L3QsCDQt9GD0LzQuNGA0L7QstCw0L3QuNC1INC80YvRiNC4LiDQkiDQvNC+0LzQtdC90YIg0LfRg9C80LjRgNC+0LLQsNC90LjRjyDQvNGL0YjQuCDQv9GA0L7QuNGB0YXQvtC00LjRgiDQt9GD0LzQuNGA0L7QstCw0L3QuNC1INC60L7QvtGA0LTQuNC90LDRgtC90L7QuSDQv9C70L7RgdC60L7RgdGC0LguXG4gICAqL1xuICBwcm90ZWN0ZWQgaGFuZGxlTW91c2VXaGVlbChldmVudDogV2hlZWxFdmVudCk6IHZvaWQge1xuXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgIGNvbnN0IFtjbGlwWCwgY2xpcFldID0gdGhpcy5nZXRDbGlwU3BhY2VNb3VzZVBvc2l0aW9uKGV2ZW50KVxuXG4gICAgLy8gcG9zaXRpb24gYmVmb3JlIHpvb21pbmdcbiAgICBjb25zdCBbcHJlWm9vbVgsIHByZVpvb21ZXSA9IG0zLnRyYW5zZm9ybVBvaW50KG0zLmludmVyc2UodGhpcy50cmFuc2Zvcm0udmlld1Byb2plY3Rpb25NYXQpLCBbY2xpcFgsIGNsaXBZXSlcblxuICAgIC8vIG11bHRpcGx5IHRoZSB3aGVlbCBtb3ZlbWVudCBieSB0aGUgY3VycmVudCB6b29tIGxldmVsLCBzbyB3ZSB6b29tIGxlc3Mgd2hlbiB6b29tZWQgaW4gYW5kIG1vcmUgd2hlbiB6b29tZWQgb3V0XG4gICAgY29uc3QgbmV3Wm9vbSA9IHRoaXMuc3Bsb3QuY2FtZXJhLnpvb20hICogTWF0aC5wb3coMiwgZXZlbnQuZGVsdGFZICogLTAuMDEpXG4gICAgdGhpcy5zcGxvdC5jYW1lcmEuem9vbSA9IE1hdGgubWF4KDAuMDAyLCBNYXRoLm1pbigyMDAsIG5ld1pvb20pKVxuXG4gICAgdGhpcy51cGRhdGVWaWV3UHJvamVjdGlvbigpXG5cbiAgICAvLyBwb3NpdGlvbiBhZnRlciB6b29taW5nXG4gICAgY29uc3QgW3Bvc3Rab29tWCwgcG9zdFpvb21ZXSA9IG0zLnRyYW5zZm9ybVBvaW50KG0zLmludmVyc2UodGhpcy50cmFuc2Zvcm0udmlld1Byb2plY3Rpb25NYXQpLCBbY2xpcFgsIGNsaXBZXSlcblxuICAgIC8vIGNhbWVyYSBuZWVkcyB0byBiZSBtb3ZlZCB0aGUgZGlmZmVyZW5jZSBvZiBiZWZvcmUgYW5kIGFmdGVyXG4gICAgdGhpcy5zcGxvdC5jYW1lcmEueCEgKz0gcHJlWm9vbVggLSBwb3N0Wm9vbVhcbiAgICB0aGlzLnNwbG90LmNhbWVyYS55ISArPSBwcmVab29tWSAtIHBvc3Rab29tWVxuXG4gICAgdGhpcy5zcGxvdC5yZW5kZXIoKVxuICB9XG59XG4iLCJpbXBvcnQgU1Bsb3QgZnJvbSAnLi9zcGxvdCdcbmltcG9ydCB7IGdldEN1cnJlbnRUaW1lIH0gZnJvbSAnLi91dGlscydcblxuLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqXG4gKiDQmtC70LDRgdGBLdGF0LXQu9C/0LXRgCwg0YDQtdCw0LvQuNC30YPRjtGJ0LjQuSDQv9C+0LTQtNC10YDQttC60YMg0YDQtdC20LjQvNCwINC+0YLQu9Cw0LTQutC4INC00LvRjyDQutC70LDRgdGB0LAgU1Bsb3QuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNQbG90RGVidWcge1xuXG4gIC8qKiDQn9GA0LjQt9C90LDQuiDQsNC60YLQuNCy0LDRhtC40Lgg0YDQtdC20LjQvCDQvtGC0LvQsNC00LrQuC4gKi9cbiAgcHVibGljIGlzRW5hYmxlOiBib29sZWFuID0gZmFsc2VcblxuICAvKiog0KHRgtC40LvRjCDQt9Cw0LPQvtC70L7QstC60LAg0YDQtdC20LjQvNCwINC+0YLQu9Cw0LTQutC4LiAqL1xuICBwdWJsaWMgaGVhZGVyU3R5bGU6IHN0cmluZyA9ICdmb250LXdlaWdodDogYm9sZDsgY29sb3I6ICNmZmZmZmY7IGJhY2tncm91bmQtY29sb3I6ICNjYzAwMDA7J1xuXG4gIC8qKiDQodGC0LjQu9GMINC30LDQs9C+0LvQvtCy0LrQsCDQs9GA0YPQv9C/0Ysg0L/QsNGA0LDQvNC10YLRgNC+0LIuICovXG4gIHB1YmxpYyBncm91cFN0eWxlOiBzdHJpbmcgPSAnZm9udC13ZWlnaHQ6IGJvbGQ7IGNvbG9yOiAjZmZmZmZmOydcblxuICAvKiog0KXQtdC70L/QtdGAINCx0YPQtNC10YIg0LjQvNC10YLRjCDQv9C+0LvQvdGL0Lkg0LTQvtGB0YLRg9C/INC6INGN0LrQt9C10LzQv9C70Y/RgNGDIFNQbG90LiAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlYWRvbmx5IHNwbG90OiBTUGxvdFxuICApIHt9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0J/QvtC00LPQvtGC0LDQstC70LjQstCw0LXRgiDRhdC10LvQv9C10YAg0Log0LjRgdC/0L7Qu9GM0LfQvtCy0LDQvdC40Y4uXG4gICAqL1xuICBwdWJsaWMgc2V0dXAoY2xlYXJDb25zb2xlOiBib29sZWFuID0gZmFsc2UpOiB2b2lkIHtcbiAgICBpZiAoY2xlYXJDb25zb2xlKSB7XG4gICAgICBjb25zb2xlLmNsZWFyKClcbiAgICB9XG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQktGL0LLQvtC00LjRgiDQsiDQutC+0L3RgdC+0LvRjCDQvtGC0LvQsNC00L7Rh9C90YPRjiDQuNC90YTQvtGA0LzQsNGG0LjRjiwg0LXRgdC70Lgg0LLQutC70Y7Rh9C10L0g0YDQtdC20LjQvCDQvtGC0LvQsNC00LrQuC5cbiAgICpcbiAgICogQHJlbWFya3NcbiAgICog0J7RgtC70LDQtNC+0YfQvdCw0Y8g0LjQvdGE0L7RgNC80LDRhtC40Y8g0LLRi9Cy0L7QtNC40YLRgdGPINCx0LvQvtC60LDQvNC4LiDQndCw0LfQstCw0L3QuNGPINCx0LvQvtC60L7QsiDRjyDQv9C10YDQtdC00LDRjtGC0YHRjyDQsiDQvNC10YLQvtC0INC/0LXRgNC10YfQuNGB0LvQtdC90LjQtdC8INGB0YLRgNC+0LouINCa0LDQttC00LDRjyDRgdGC0YDQvtC60LBcbiAgICog0LjQvdGC0LXRgNC/0YDQtdGC0LjRgNGD0LXRgtGB0Y8g0LrQsNC6INC40LzRjyDQvNC10YLQvtC00LAuINCV0YHQu9C4INC90YPQttC90YvQtSDQvNC10YLQvtC00Ysg0LLRi9Cy0L7QtNCwINCx0LvQvtC60LAg0YHRg9GJ0LXRgdGC0LLRg9GO0YIgLSDQvtC90Lgg0LLRi9C30YvQstCw0Y7RgtGB0Y8uINCV0YHQu9C4INC80LXRgtC+0LTQsCDRgSDQvdGD0LbQvdGL0LxcbiAgICog0L3QsNC30LLQsNC90LjQtdC8INC90LUg0YHRg9GJ0LXRgdGC0LLRg9C10YIgLSDQs9C10YDQtdGA0LjRgNGD0LXRgtGB0Y8g0L7RiNC40LHQutCwLlxuICAgKlxuICAgKiBAcGFyYW0gbG9nSXRlbXMgLSDQn9C10YDQtdGH0LjRgdC70LXQvdC40LUg0YHRgtGA0L7QuiDRgSDQvdCw0LfQstCw0L3QuNGP0LzQuCDQvtGC0LvQsNC00L7Rh9C90YvRhSDQsdC70L7QutC+0LIsINC60L7RgtC+0YDRi9C1INC90YPQttC90L4g0L7RgtC+0LHRgNCw0LfQuNGC0Ywg0LIg0LrQvtC90YHQvtC70LguXG4gICAqL1xuICBwdWJsaWMgbG9nKC4uLmxvZ0l0ZW1zOiBzdHJpbmdbXSk6IHZvaWQge1xuICAgIGlmICh0aGlzLmlzRW5hYmxlKSB7XG4gICAgICBsb2dJdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICBpZiAodHlwZW9mICh0aGlzIGFzIGFueSlbaXRlbV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAodGhpcyBhcyBhbnkpW2l0ZW1dKClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ9Ce0YLQu9Cw0LTQvtGH0L3QvtCz0L4g0LHQu9C+0LrQsCAnICsgaXRlbSArICdcIiDQvdC1INGB0YPRidC10YHRgtCy0YPQtdGCIScpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JLRi9Cy0L7QtNC40YIg0LLRgdGC0YPQv9C40YLQtdC70YzQvdGD0Y4g0YfQsNGB0YLRjCDQviDRgNC10LbQuNC80LUg0L7RgtC70LDQtNC60LguXG4gICAqL1xuICBwdWJsaWMgaW50cm8oKTogdm9pZCB7XG4gICAgY29uc29sZS5sb2coJyVj0J7RgtC70LDQtNC60LAgU1Bsb3Qg0L3QsCDQvtCx0YrQtdC60YLQtSAjJyArIHRoaXMuc3Bsb3QuY2FudmFzLmlkLCB0aGlzLmhlYWRlclN0eWxlKVxuXG4gICAgaWYgKHRoaXMuc3Bsb3QuZGVtby5pc0VuYWJsZSkge1xuICAgICAgY29uc29sZS5sb2coJyVj0JLQutC70Y7Rh9C10L0g0LTQtdC80L7QvdGB0YLRgNCw0YbQuNC+0L3QvdGL0Lkg0YDQtdC20LjQvCDQtNCw0L3QvdGL0YUnLCB0aGlzLmdyb3VwU3R5bGUpXG4gICAgfVxuXG4gICAgY29uc29sZS5ncm91cCgnJWPQn9GA0LXQtNGD0L/RgNC10LbQtNC10L3QuNC1JywgdGhpcy5ncm91cFN0eWxlKVxuICAgIGNvbnNvbGUubG9nKCfQntGC0LrRgNGL0YLQsNGPINC60L7QvdGB0L7Qu9GMINCx0YDQsNGD0LfQtdGA0LAg0Lgg0LTRgNGD0LPQuNC1INCw0LrRgtC40LLQvdGL0LUg0YHRgNC10LTRgdGC0LLQsCDQutC+0L3RgtGA0L7Qu9GPINGA0LDQt9GA0LDQsdC+0YLQutC4INGB0YPRidC10YHRgtCy0LXQvdC90L4g0YHQvdC40LbQsNGO0YIg0L/RgNC+0LjQt9Cy0L7QtNC40YLQtdC70YzQvdC+0YHRgtGMINCy0YvRgdC+0LrQvtC90LDQs9GA0YPQttC10L3QvdGL0YUg0L/RgNC40LvQvtC20LXQvdC40LkuINCU0LvRjyDQvtCx0YrQtdC60YLQuNCy0L3QvtCz0L4g0LDQvdCw0LvQuNC30LAg0L/RgNC+0LjQt9Cy0L7QtNC40YLQtdC70YzQvdC+0YHRgtC4INCy0YHQtSDQv9C+0LTQvtCx0L3Ri9C1INGB0YDQtdC00YHRgtCy0LAg0LTQvtC70LbQvdGLINCx0YvRgtGMINC+0YLQutC70Y7Rh9C10L3Riywg0LAg0LrQvtC90YHQvtC70Ywg0LHRgHrQsNGD0LfQtdGA0LAg0LfQsNC60YDRi9GC0LAuINCd0LXQutC+0YLQvtGA0YvQtSDQtNCw0L3QvdGL0LUg0L7RgtC70LDQtNC+0YfQvdC+0Lkg0LjQvdGE0L7RgNC80LDRhtC40Lgg0LIg0LfQsNCy0LjRgdC40LzQvtGB0YLQuCDQvtGCINC40YHQv9C+0LvRjNC30YPQtdC80L7Qs9C+INCx0YDQsNGD0LfQtdGA0LAg0LzQvtCz0YPRgiDQvdC1INC+0YLQvtCx0YDQsNC20LDRgtGM0YHRjyDQuNC70Lgg0L7RgtC+0LHRgNCw0LbQsNGC0YzRgdGPINC90LXQutC+0YDRgNC10LrRgtC90L4uINCh0YDQtdC00YHRgtCy0L4g0L7RgtC70LDQtNC60Lgg0L/RgNC+0YLQtdGB0YLQuNGA0L7QstCw0L3QviDQsiDQsdGA0LDRg9C30LXRgNC1IEdvb2dsZSBDaHJvbWUgdi45MCcpXG4gICAgY29uc29sZS5ncm91cEVuZCgpXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQktGL0LLQvtC00LjRgiDQuNC90YTQvtGA0LzQsNGG0LjRjiDQviDQs9GA0LDRhNC40YfQtdGB0LrQvtC5INGB0LjRgdGC0LXQvNC1INC60LvQuNC10L3RgtCwLlxuICAgKi9cbiAgcHVibGljIGdwdSgpOiB2b2lkIHtcbiAgICBjb25zb2xlLmdyb3VwKCclY9CS0LjQtNC10L7RgdC40YHRgtC10LzQsCcsIHRoaXMuZ3JvdXBTdHlsZSlcbiAgICBjb25zb2xlLmxvZygn0JPRgNCw0YTQuNGH0LXRgdC60LDRjyDQutCw0YDRgtCwOiAnICsgdGhpcy5zcGxvdC53ZWJnbC5ncHUuaGFyZHdhcmUpXG4gICAgY29uc29sZS5sb2coJ9CS0LXRgNGB0LjRjyBHTDogJyArIHRoaXMuc3Bsb3Qud2ViZ2wuZ3B1LnNvZnR3YXJlKVxuICAgIGNvbnNvbGUuZ3JvdXBFbmQoKVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JLRi9Cy0L7QtNC40YIg0LjQvdGE0L7RgNC80LDRhtC40Y8g0L4g0YLQtdC60YPRidC10Lwg0Y3QutC30LXQvNC/0LvRj9GA0LUg0LrQu9Cw0YHRgdCwIFNQbG90LlxuICAgKi9cbiAgcHVibGljIGluc3RhbmNlKCk6IHZvaWQge1xuXG4gICAgY29uc29sZS5ncm91cCgnJWPQndCw0YHRgtGA0L7QudC60LAg0L/QsNGA0LDQvNC10YLRgNC+0LIg0Y3QutC30LXQvNC/0LvRj9GA0LAnLCB0aGlzLmdyb3VwU3R5bGUpXG4gICAgY29uc29sZS5kaXIodGhpcy5zcGxvdClcbiAgICBjb25zb2xlLmxvZygn0KDQsNC30LzQtdGAINC60LDQvdCy0LDRgdCwOiAnICsgdGhpcy5zcGxvdC5jYW52YXMud2lkdGggKyAnIHggJyArIHRoaXMuc3Bsb3QuY2FudmFzLmhlaWdodCArICcgcHgnKVxuICAgIGNvbnNvbGUubG9nKCfQoNCw0LfQvNC10YAg0L/Qu9C+0YHQutC+0YHRgtC4OiAnICsgdGhpcy5zcGxvdC5ncmlkLndpZHRoICsgJyB4ICcgKyB0aGlzLnNwbG90LmdyaWQuaGVpZ2h0ICsgJyBweCcpXG5cbiAgICBpZiAodGhpcy5zcGxvdC5kZW1vLmlzRW5hYmxlKSB7XG4gICAgICBjb25zb2xlLmxvZygn0KHQv9C+0YHQvtCxINC/0L7Qu9GD0YfQtdC90LjRjyDQtNCw0L3QvdGL0YU6ICcgKyAn0LTQtdC80L4t0LTQsNC90L3Ri9C1JylcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ9Ch0L/QvtGB0L7QsSDQv9C+0LvRg9GH0LXQvdC40Y8g0LTQsNC90L3Ri9GFOiAnICsgJ9C40YLQtdGA0LjRgNC+0LLQsNC90LjQtScpXG4gICAgfVxuICAgIGNvbnNvbGUuZ3JvdXBFbmQoKVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JLRi9Cy0L7QtNC40YIg0LrQvtC00Ysg0YjQtdC50LTQtdGA0L7Qsi5cbiAgICovXG4gIHB1YmxpYyBzaGFkZXJzKCk6IHZvaWQge1xuICAgIGNvbnNvbGUuZ3JvdXAoJyVj0KHQvtC30LTQsNC9INCy0LXRgNGI0LjQvdC90YvQuSDRiNC10LnQtNC10YA6ICcsIHRoaXMuZ3JvdXBTdHlsZSlcbiAgICBjb25zb2xlLmxvZyh0aGlzLnNwbG90LnNoYWRlckNvZGVWZXJ0KVxuICAgIGNvbnNvbGUuZ3JvdXBFbmQoKVxuICAgIGNvbnNvbGUuZ3JvdXAoJyVj0KHQvtC30LTQsNC9INGE0YDQsNCz0LzQtdC90YLQvdGL0Lkg0YjQtdC50LTQtdGAOiAnLCB0aGlzLmdyb3VwU3R5bGUpXG4gICAgY29uc29sZS5sb2codGhpcy5zcGxvdC5zaGFkZXJDb2RlRnJhZylcbiAgICBjb25zb2xlLmdyb3VwRW5kKClcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCS0YvQstC+0LTQuNGCINGB0L7QvtCx0YnQtdC90LjQtSDQviDQvdCw0YfQsNC70LUg0L/RgNC+0YbQtdGB0YHQtSDQt9Cw0LPRgNGD0LfQutC4INC00LDQvdC90YvRhS5cbiAgICovXG4gIHB1YmxpYyBsb2FkaW5nKCk6IHZvaWQge1xuICAgIGNvbnNvbGUubG9nKCclY9CX0LDQv9GD0YnQtdC9INC/0YDQvtGG0LXRgdGBINC30LDQs9GA0YPQt9C60Lgg0LTQsNC90L3Ri9GFIFsnICsgZ2V0Q3VycmVudFRpbWUoKSArICddLi4uJywgdGhpcy5ncm91cFN0eWxlKVxuICAgIGNvbnNvbGUudGltZSgn0JTQu9C40YLQtdC70YzQvdC+0YHRgtGMJylcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCS0YvQstC+0LTQuNGCINGB0YLQsNGC0LjRgdGC0LjQutGDINC/0L4g0LfQsNCy0LXRgNGI0LXQvdC40Lgg0L/RgNC+0YbQtdGB0YHQsCDQt9Cw0LPRgNGD0LfQutC4INC00LDQvdC90YvRhS5cbiAgICovXG4gIHB1YmxpYyBsb2FkZWQoKTogdm9pZCB7XG4gICAgY29uc29sZS5ncm91cCgnJWPQl9Cw0LPRgNGD0LfQutCwINC00LDQvdC90YvRhSDQt9Cw0LLQtdGA0YjQtdC90LAgWycgKyBnZXRDdXJyZW50VGltZSgpICsgJ10nLCB0aGlzLmdyb3VwU3R5bGUpXG4gICAgY29uc29sZS50aW1lRW5kKCfQlNC70LjRgtC10LvRjNC90L7RgdGC0YwnKVxuICAgIGNvbnNvbGUubG9nKCfQoNCw0YHRhdC+0LQg0LLQuNC00LXQvtC/0LDQvNGP0YLQuDogJyArICh0aGlzLnNwbG90LnN0YXRzLm1lbVVzYWdlIC8gMTAwMDAwMCkudG9GaXhlZCgyKS50b0xvY2FsZVN0cmluZygpICsgJyDQnNCRJylcbiAgICBjb25zb2xlLmxvZygn0JrQvtC7LdCy0L4g0L7QsdGK0LXQutGC0L7QsjogJyArIHRoaXMuc3Bsb3Quc3RhdHMub2JqZWN0c0NvdW50VG90YWwudG9Mb2NhbGVTdHJpbmcoKSlcbiAgICBjb25zb2xlLmxvZygn0JrQvtC7LdCy0L4g0LPRgNGD0L/QvyDQsdGD0YTQtdGA0L7QsjogJyArIHRoaXMuc3Bsb3Quc3RhdHMuZ3JvdXBzQ291bnQudG9Mb2NhbGVTdHJpbmcoKSlcbiAgICBjb25zb2xlLmxvZygn0KDQtdC30YPQu9GM0YLQsNGCOiAnICsgKCh0aGlzLnNwbG90LnN0YXRzLm9iamVjdHNDb3VudFRvdGFsID49IHRoaXMuc3Bsb3QuZ2xvYmFsTGltaXQpID9cbiAgICAgICfQtNC+0YHRgtC40LPQvdGD0YIg0LvQuNC80LjRgiDQvtCx0YrQtdC60YLQvtCyICgnICsgdGhpcy5zcGxvdC5nbG9iYWxMaW1pdC50b0xvY2FsZVN0cmluZygpICsgJyknIDpcbiAgICAgICfQvtCx0YDQsNCx0L7RgtCw0L3RiyDQstGB0LUg0L7QsdGK0LXQutGC0YsnKSlcbiAgICBjb25zb2xlLmdyb3VwRW5kKClcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCS0YvQstC+0LTQuNGCINGB0L7QvtCx0YnQtdC90LjQtSDQviDQt9Cw0L/Rg9GB0LrQtSDRgNC10L3QtNC10YDQsC5cbiAgICovXG4gIHB1YmxpYyBzdGFydGVkKCk6IHZvaWQge1xuICAgIGNvbnNvbGUubG9nKCclY9Cg0LXQvdC00LXRgCDQt9Cw0L/Rg9GJ0LXQvScsIHRoaXMuZ3JvdXBTdHlsZSlcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCS0YvQstC+0LTQuNGCINGB0L7QvtCx0YnQtdC90LjQtSDQvtCxINC+0YHRgtCw0L3QvtCy0LrQtSDRgNC10L3QtNC10YDQsC5cbiAgICovXG4gIHB1YmxpYyBzdG9wZWQoKTogdm9pZCB7XG4gICAgY29uc29sZS5sb2coJyVj0KDQtdC90LTQtdGAINC+0YHRgtCw0L3QvtCy0LvQtdC9JywgdGhpcy5ncm91cFN0eWxlKVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JLRi9Cy0L7QtNC40YIg0YHQvtC+0LHRiNC10L3QuNC1INC+0LEg0L7Rh9C40YHRgtC60LUg0L7QsdC70LDRgdGC0Lgg0YDQtdC90LTQtdGA0LAuXG4gICAqL1xuICBwdWJsaWMgY2xlYXJlZChjb2xvcjogc3RyaW5nKTogdm9pZCB7XG4gICAgY29uc29sZS5sb2coJyVj0J7QsdC70LDRgdGC0Ywg0YDQtdC90LTQtdGA0LAg0L7Rh9C40YnQtdC90LAgWycgKyBjb2xvciArICddJywgdGhpcy5ncm91cFN0eWxlKTtcbiAgfVxufVxuIiwiaW1wb3J0IFNQbG90IGZyb20gJy4vc3Bsb3QnXG5pbXBvcnQgeyByYW5kb21JbnQgfSBmcm9tICcuL3V0aWxzJ1xuXG4vKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICpcbiAqINCa0LvQsNGB0YEt0YXQtdC70L/QtdGALCDRgNC10LDQu9C40LfRg9GO0YnQuNC5INC/0L7QtNC00LXRgNC20LrRgyDRgNC10LbQuNC80LAg0LTQtdC80L7QvdGB0YLRgNCw0YbQuNC+0L3QvdGL0YUg0LTQsNC90L3Ri9GFINC00LvRjyDQutC70LDRgdGB0LAgU1Bsb3QuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNQbG90RGVtbyB7XG5cbiAgLyoqINCf0YDQuNC30L3QsNC6INCw0LrRgtC40LLQsNGG0LjQuCDQtNC10LzQvi3RgNC10LbQuNC80LAuICovXG4gIHB1YmxpYyBpc0VuYWJsZTogYm9vbGVhbiA9IGZhbHNlXG5cbiAgLyoqINCa0L7Qu9C40YfQtdGB0YLQstC+INCx0YrQtdC60YLQvtCyLiAqL1xuICBwdWJsaWMgYW1vdW50OiBudW1iZXIgPSAxXzAwMF8wMDBcblxuICAvKiog0JzQuNC90LjQvNCw0LvRjNC90YvQuSDRgNCw0LfQvNC10YAg0L7QsdGK0LXQutGC0L7Qsi4gKi9cbiAgcHVibGljIHNpemVNaW46IG51bWJlciA9IDEwXG5cbiAgLyoqINCc0LDQutGB0LjQvNCw0LvRjNC90YvQuSDRgNCw0LfQvNC10YAg0L7QsdGK0LXQutGC0L7Qsi4gKi9cbiAgcHVibGljIHNpemVNYXg6IG51bWJlciA9IDMwXG5cbiAgLyoqINCm0LLQtdGC0L7QstCw0Y8g0L/QsNC70LjRgtGA0LAg0L7QsdGK0LXQutGC0L7Qsi4gKi9cbiAgcHVibGljIGNvbG9yczogc3RyaW5nW10gPSBbXG4gICAgJyNEODFDMDEnLCAnI0U5OTY3QScsICcjQkE1NUQzJywgJyNGRkQ3MDAnLCAnI0ZGRTRCNScsICcjRkY4QzAwJyxcbiAgICAnIzIyOEIyMicsICcjOTBFRTkwJywgJyM0MTY5RTEnLCAnIzAwQkZGRicsICcjOEI0NTEzJywgJyMwMENFRDEnXG4gIF1cblxuICAvKiog0KHRh9C10YLRh9C40Log0LjRgtC10YDQuNGA0YPQtdC80YvRhSDQvtCx0YrQtdC60YLQvtCyLiAqL1xuICBwcml2YXRlIGluZGV4OiBudW1iZXIgPSAwXG5cbiAgLyoqINCl0LXQu9C/0LXRgCDQsdGD0LTQtdGCINC40LzQtdGC0Ywg0L/QvtC70L3Ri9C5INC00L7RgdGC0YPQvyDQuiDRjdC60LfQtdC80L/Qu9GP0YDRgyBTUGxvdC4gKi9cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSByZWFkb25seSBzcGxvdDogU1Bsb3RcbiAgKSB7fVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCf0L7QtNCz0L7RgtCw0LLQu9C40LLQsNC10YIg0YXQtdC70L/QtdGAINC6INC40YHQv9C+0LvRjNC30L7QstCw0L3QuNGOLlxuICAgKi9cbiAgcHVibGljIHNldHVwKCk6IHZvaWQge1xuICAgIHRoaXMuaW5kZXggPSAwXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQmNC80LjRgtC40YDRg9C10YIg0LjRgtC10YDQsNGC0L7RgCDQuNGB0YXQvtC00L3Ri9GFINC+0LHRitC10LrRgtC+0LIuXG4gICAqL1xuICBwdWJsaWMgaXRlcmF0b3IoKTogU1Bsb3RPYmplY3QgfCBudWxsIHtcbiAgICBpZiAodGhpcy5pbmRleCA8IHRoaXMuYW1vdW50KSB7XG4gICAgICB0aGlzLmluZGV4KytcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHg6IHJhbmRvbUludCh0aGlzLnNwbG90LmdyaWQud2lkdGghKSxcbiAgICAgICAgeTogcmFuZG9tSW50KHRoaXMuc3Bsb3QuZ3JpZC5oZWlnaHQhKSxcbiAgICAgICAgc2hhcGU6IHJhbmRvbUludCh0aGlzLnNwbG90LnNoYXBlc0NvdW50KSxcbiAgICAgICAgc2l6ZTogdGhpcy5zaXplTWluICsgcmFuZG9tSW50KHRoaXMuc2l6ZU1heCAtIHRoaXMuc2l6ZU1pbiArIDEpLFxuICAgICAgICBjb2xvcjogcmFuZG9tSW50KHRoaXMuY29sb3JzLmxlbmd0aClcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IFNQbG90IGZyb20gJy4vc3Bsb3QnXG5pbXBvcnQgeyBjb2xvckZyb21IZXhUb0dsUmdiIH0gZnJvbSAnLi91dGlscydcblxuLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqXG4gKiDQmtC70LDRgdGBLdGF0LXQu9C/0LXRgCwg0YDQtdCw0LvQuNC30YPRjtGJ0LjQuSDRg9C/0YDQsNCy0LvQtdC90LjQtSDQutC+0L3RgtC10LrRgdGC0L7QvCDRgNC10L3QtNC10YDQuNC90LPQsCBXZWJHTCDQutC70LDRgdGB0LAgU3Bsb3QuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNQbG90V2ViR2wge1xuXG4gIC8qKiDQn9Cw0YDQsNC80LXRgtGA0Ysg0LjQvdC40YbQuNCw0LvQuNC30LDRhtC40Lgg0LrQvtC90YLQtdC60YHRgtCwINGA0LXQvdC00LXRgNC40L3Qs9CwIFdlYkdMLiAqL1xuICBwdWJsaWMgYWxwaGE6IGJvb2xlYW4gPSBmYWxzZVxuICBwdWJsaWMgZGVwdGg6IGJvb2xlYW4gPSBmYWxzZVxuICBwdWJsaWMgc3RlbmNpbDogYm9vbGVhbiA9IGZhbHNlXG4gIHB1YmxpYyBhbnRpYWxpYXM6IGJvb2xlYW4gPSBmYWxzZVxuICBwdWJsaWMgZGVzeW5jaHJvbml6ZWQ6IGJvb2xlYW4gPSBmYWxzZVxuICBwdWJsaWMgcHJlbXVsdGlwbGllZEFscGhhOiBib29sZWFuID0gZmFsc2VcbiAgcHVibGljIHByZXNlcnZlRHJhd2luZ0J1ZmZlcjogYm9vbGVhbiA9IGZhbHNlXG4gIHB1YmxpYyBmYWlsSWZNYWpvclBlcmZvcm1hbmNlQ2F2ZWF0OiBib29sZWFuID0gZmFsc2VcbiAgcHVibGljIHBvd2VyUHJlZmVyZW5jZTogV2ViR0xQb3dlclByZWZlcmVuY2UgPSAnaGlnaC1wZXJmb3JtYW5jZSdcblxuICAvKiog0J3QsNC30LLQsNC90LjRjyDRjdC70LXQvNC10L3RgtC+0LIg0LPRgNCw0YTQuNGH0LXRgdC60L7QuSDRgdC40YHRgtC10LzRiyDQutC70LjQtdC90YLQsC4gKi9cbiAgcHVibGljIGdwdSA9IHsgaGFyZHdhcmU6ICctJywgc29mdHdhcmU6ICctJyB9XG5cbiAgLyoqINCa0L7QvdGC0LXQutGB0YIg0YDQtdC90LTQtdGA0LjQvdCz0LAg0Lgg0L/RgNC+0LPRgNCw0LzQvNCwIFdlYkdMLiAqL1xuICBwcml2YXRlIGdsITogV2ViR0xSZW5kZXJpbmdDb250ZXh0XG4gIHByaXZhdGUgZ3B1UHJvZ3JhbSE6IFdlYkdMUHJvZ3JhbVxuXG4gIC8qKiDQn9C10YDQtdC80LXQvdC90YvQtSDQtNC70Y8g0YHQstGP0LfQuCDQv9GA0LjQu9C+0LbQtdC90LjRjyDRgSDQv9GA0L7Qs9GA0LDQvNC80L7QuSBXZWJHTC4gKi9cbiAgcHJpdmF0ZSB2YXJpYWJsZXM6IE1hcDxzdHJpbmcsIGFueT4gPSBuZXcgTWFwKClcblxuICAvKiog0JHRg9GE0LXRgNGLINCy0LjQtNC10L7Qv9Cw0LzRj9GC0LggV2ViR0wuICovXG4gIHB1YmxpYyBkYXRhOiBNYXA8c3RyaW5nLCB7YnVmZmVyczogV2ViR0xCdWZmZXJbXSwgdHlwZTogbnVtYmVyfT4gPSBuZXcgTWFwKClcblxuICAvKiog0J/RgNCw0LLQuNC70LAg0YHQvtC+0YLQstC10YLRgdGC0LLQuNGPINGC0LjQv9C+0LIg0YLQuNC/0LjQt9C40YDQvtCy0LDQvdC90YvRhSDQvNCw0YHRgdC40LLQvtCyINC4INGC0LjQv9C+0LIg0L/QtdGA0LXQvNC10L3QvdGL0YUgV2ViR0wuICovXG4gIHByaXZhdGUgZ2xOdW1iZXJUeXBlczogTWFwPHN0cmluZywgbnVtYmVyPiA9IG5ldyBNYXAoW1xuICAgIFsnSW50OEFycmF5JywgMHgxNDAwXSwgICAgICAgLy8gZ2wuQllURVxuICAgIFsnVWludDhBcnJheScsIDB4MTQwMV0sICAgICAgLy8gZ2wuVU5TSUdORURfQllURVxuICAgIFsnSW50MTZBcnJheScsIDB4MTQwMl0sICAgICAgLy8gZ2wuU0hPUlRcbiAgICBbJ1VpbnQxNkFycmF5JywgMHgxNDAzXSwgICAgIC8vIGdsLlVOU0lHTkVEX1NIT1JUXG4gICAgWydGbG9hdDMyQXJyYXknLCAweDE0MDZdICAgICAvLyBnbC5GTE9BVFxuICBdKVxuXG4gIC8qKiDQpdC10LvQv9C10YAg0LHRg9C00LXRgiDQuNC80LXRgtGMINC/0L7Qu9C90YvQuSDQtNC+0YHRgtGD0L8g0Log0Y3QutC30LXQvNC/0LvRj9GA0YMgU1Bsb3QuICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcmVhZG9ubHkgc3Bsb3Q6IFNQbG90XG4gICkgeyB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0J/QvtC00LPQvtGC0LDQstC70LjQstCw0LXRgiDRhdC10LvQv9C10YAg0Log0LjRgdC/0L7Qu9GM0LfQvtCy0LDQvdC40Y4uXG4gICAqL1xuICBwdWJsaWMgc2V0dXAoKTogdm9pZCB7XG5cbiAgICB0aGlzLmdsID0gdGhpcy5zcGxvdC5jYW52YXMuZ2V0Q29udGV4dCgnd2ViZ2wnLCB7XG4gICAgICBhbHBoYTogdGhpcy5hbHBoYSxcbiAgICAgIGRlcHRoOiB0aGlzLmRlcHRoLFxuICAgICAgc3RlbmNpbDogdGhpcy5zdGVuY2lsLFxuICAgICAgYW50aWFsaWFzOiB0aGlzLmFudGlhbGlhcyxcbiAgICAgIGRlc3luY2hyb25pemVkOiB0aGlzLmRlc3luY2hyb25pemVkLFxuICAgICAgcHJlbXVsdGlwbGllZEFscGhhOiB0aGlzLnByZW11bHRpcGxpZWRBbHBoYSxcbiAgICAgIHByZXNlcnZlRHJhd2luZ0J1ZmZlcjogdGhpcy5wcmVzZXJ2ZURyYXdpbmdCdWZmZXIsXG4gICAgICBmYWlsSWZNYWpvclBlcmZvcm1hbmNlQ2F2ZWF0OiB0aGlzLmZhaWxJZk1ham9yUGVyZm9ybWFuY2VDYXZlYXQsXG4gICAgICBwb3dlclByZWZlcmVuY2U6IHRoaXMucG93ZXJQcmVmZXJlbmNlXG4gICAgfSkhXG5cbiAgICBpZiAodGhpcy5nbCA9PT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCfQntGI0LjQsdC60LAg0YHQvtC30LTQsNC90LjRjyDQutC+0L3RgtC10LrRgdGC0LAg0YDQtdC90LTQtdGA0LjQvdCz0LAgV2ViR0whJylcbiAgICB9XG5cbiAgICAvKiog0J/QvtC70YPRh9C10L3QuNC1INC40L3RhNC+0YDQvNCw0YbQuNC4INC+INCz0YDQsNGE0LjRh9C10YHQutC+0Lkg0YHQuNGB0YLQtdC80LUg0LrQu9C40LXQvdGC0LAuICovXG4gICAgbGV0IGV4dCA9IHRoaXMuZ2wuZ2V0RXh0ZW5zaW9uKCdXRUJHTF9kZWJ1Z19yZW5kZXJlcl9pbmZvJylcbiAgICB0aGlzLmdwdS5oYXJkd2FyZSA9IChleHQpID8gdGhpcy5nbC5nZXRQYXJhbWV0ZXIoZXh0LlVOTUFTS0VEX1JFTkRFUkVSX1dFQkdMKSA6ICdb0L3QtdC40LfQstC10YHRgtC90L5dJ1xuICAgIHRoaXMuZ3B1LnNvZnR3YXJlID0gdGhpcy5nbC5nZXRQYXJhbWV0ZXIodGhpcy5nbC5WRVJTSU9OKVxuXG4gICAgdGhpcy5zcGxvdC5kZWJ1Zy5sb2coJ2dwdScpXG5cbiAgICAvKiog0JrQvtC+0YDQtdC60YLQuNGA0L7QstC60LAg0YDQsNC30LzQtdGA0LAg0L7QsdC70LDRgdGC0Lgg0L/RgNC+0YHQvNC+0YLRgNCwLiAqL1xuICAgIHRoaXMuc3Bsb3QuY2FudmFzLndpZHRoID0gdGhpcy5zcGxvdC5jYW52YXMuY2xpZW50V2lkdGhcbiAgICB0aGlzLnNwbG90LmNhbnZhcy5oZWlnaHQgPSB0aGlzLnNwbG90LmNhbnZhcy5jbGllbnRIZWlnaHRcbiAgICB0aGlzLmdsLnZpZXdwb3J0KDAsIDAsIHRoaXMuc3Bsb3QuY2FudmFzLndpZHRoLCB0aGlzLnNwbG90LmNhbnZhcy5oZWlnaHQpXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQo9GB0YLQsNC90LDQstC70LjQstCw0LXRgiDRhtCy0LXRgiDRhNC+0L3QsCDQutC+0L3RgtC10LrRgdGC0LAg0YDQtdC90LTQtdGA0LjQvdCz0LAgV2ViR0wuXG4gICAqL1xuICBwdWJsaWMgc2V0QmdDb2xvcihjb2xvcjogc3RyaW5nKTogdm9pZCB7XG4gICAgbGV0IFtyLCBnLCBiXSA9IGNvbG9yRnJvbUhleFRvR2xSZ2IoY29sb3IpXG4gICAgdGhpcy5nbC5jbGVhckNvbG9yKHIsIGcsIGIsIDAuMClcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCX0LDQutGA0LDRiNC40LLQsNC10YIg0LrQvtC90YLQtdC60YHRgiDRgNC10L3QtNC10YDQuNC90LPQsCBXZWJHTCDRhtCy0LXRgtC+0Lwg0YTQvtC90LAuXG4gICAqL1xuICBwdWJsaWMgY2xlYXJCYWNrZ3JvdW5kKCk6IHZvaWQge1xuICAgIHRoaXMuZ2wuY2xlYXIodGhpcy5nbC5DT0xPUl9CVUZGRVJfQklUKTtcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCh0L7Qt9C00LDQtdGCINGI0LXQudC00LXRgCBXZWJHTC5cbiAgICpcbiAgICogQHBhcmFtIHR5cGUgLSDQotC40L8g0YjQtdC50LTQtdGA0LAuXG4gICAqIEBwYXJhbSBjb2RlIC0gR0xTTC3QutC+0LQg0YjQtdC50LTQtdGA0LAuXG4gICAqIEByZXR1cm5zINCh0L7Qt9C00LDQvdC90YvQuSDRiNC10LnQtNC10YAuXG4gICAqL1xuICBwdWJsaWMgY3JlYXRlU2hhZGVyKHR5cGU6ICdWRVJURVhfU0hBREVSJyB8ICdGUkFHTUVOVF9TSEFERVInLCBjb2RlOiBzdHJpbmcpOiBXZWJHTFNoYWRlciB7XG5cbiAgICBjb25zdCBzaGFkZXIgPSB0aGlzLmdsLmNyZWF0ZVNoYWRlcih0aGlzLmdsW3R5cGVdKSFcbiAgICB0aGlzLmdsLnNoYWRlclNvdXJjZShzaGFkZXIsIGNvZGUpXG4gICAgdGhpcy5nbC5jb21waWxlU2hhZGVyKHNoYWRlcilcblxuICAgIGlmICghdGhpcy5nbC5nZXRTaGFkZXJQYXJhbWV0ZXIoc2hhZGVyLCB0aGlzLmdsLkNPTVBJTEVfU1RBVFVTKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCfQntGI0LjQsdC60LAg0LrQvtC80L/QuNC70Y/RhtC40Lgg0YjQtdC50LTQtdGA0LAgWycgKyB0eXBlICsgJ10uICcgKyB0aGlzLmdsLmdldFNoYWRlckluZm9Mb2coc2hhZGVyKSlcbiAgICB9XG5cbiAgICByZXR1cm4gc2hhZGVyXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQodC+0LfQtNCw0LXRgiDQv9GA0L7Qs9GA0LDQvNC80YMgV2ViR0wg0LjQtyDRiNC10LnQtNC10YDQvtCyLlxuICAgKlxuICAgKiBAcGFyYW0gc2hhZGVyVmVydCAtINCS0LXRgNGI0LjQvdC90YvQuSDRiNC10LnQtNC10YAuXG4gICAqIEBwYXJhbSBzaGFkZXJGcmFnIC0g0KTRgNCw0LPQvNC10L3RgtC90YvQuSDRiNC10LnQtNC10YAuXG4gICAqL1xuICBwdWJsaWMgY3JlYXRlUHJvZ3JhbUZyb21TaGFkZXJzKHNoYWRlclZlcnQ6IFdlYkdMU2hhZGVyLCBzaGFkZXJGcmFnOiBXZWJHTFNoYWRlcik6IHZvaWQge1xuXG4gICAgdGhpcy5ncHVQcm9ncmFtID0gdGhpcy5nbC5jcmVhdGVQcm9ncmFtKCkhXG4gICAgdGhpcy5nbC5hdHRhY2hTaGFkZXIodGhpcy5ncHVQcm9ncmFtLCBzaGFkZXJWZXJ0KVxuICAgIHRoaXMuZ2wuYXR0YWNoU2hhZGVyKHRoaXMuZ3B1UHJvZ3JhbSwgc2hhZGVyRnJhZylcbiAgICB0aGlzLmdsLmxpbmtQcm9ncmFtKHRoaXMuZ3B1UHJvZ3JhbSlcbiAgICB0aGlzLmdsLnVzZVByb2dyYW0odGhpcy5ncHVQcm9ncmFtKVxuXG4gICAgdGhpcy5zcGxvdC5kZWJ1Zy5sb2coJ3NoYWRlcnMnKVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0KHQvtC30LTQsNC10YIg0L/RgNC+0LPRgNCw0LzQvNGDIFdlYkdMINC40LcgR0xTTC3QutC+0LTQvtCyINGI0LXQudC00LXRgNC+0LIuXG4gICAqXG4gICAqIEBwYXJhbSBzaGFkZXJDb2RlVmVydCAtINCa0L7QtCDQstC10YDRiNC40L3QvdC+0LPQviDRiNC10LnQtNC10YDQsC5cbiAgICogQHBhcmFtIHNoYWRlckNvZGVGcmFnIC0g0JrQvtC0INGE0YDQsNCz0LzQtdC90YLQvdC+0LPQviDRiNC10LnQtNC10YDQsC5cbiAgICovXG4gIHB1YmxpYyBjcmVhdGVQcm9ncmFtKHNoYWRlckNvZGVWZXJ0OiBzdHJpbmcsIHNoYWRlckNvZGVGcmFnOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLmNyZWF0ZVByb2dyYW1Gcm9tU2hhZGVycyhcbiAgICAgIHRoaXMuY3JlYXRlU2hhZGVyKCdWRVJURVhfU0hBREVSJywgc2hhZGVyQ29kZVZlcnQpLFxuICAgICAgdGhpcy5jcmVhdGVTaGFkZXIoJ0ZSQUdNRU5UX1NIQURFUicsIHNoYWRlckNvZGVGcmFnKVxuICAgIClcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCh0L7Qt9C00LDQtdGCINGB0LLRj9C30Ywg0L/QtdGA0LXQvNC10L3QvdC+0Lkg0L/RgNC40LvQvtC20LXQvdC40Y8g0YEg0L/RgNC+0LPRgNCw0LzQvNC+0LkgV2ViR2wuXG4gICAqXG4gICAqIEByZW1hcmtzXG4gICAqINCf0LXRgNC10LzQtdC90L3Ri9C1INGB0L7RhdGA0LDQvdGP0Y7RgtGB0Y8g0LIg0LDRgdGB0L7RhtC40LDRgtC40LLQvdC+0Lwg0LzQsNGB0YHQuNCy0LUsINCz0LTQtSDQutC70Y7Rh9C4IC0g0Y3RgtC+INC90LDQt9Cy0LDQvdC40Y8g0L/QtdGA0LXQvNC10L3QvdGL0YUuINCd0LDQt9Cy0LDQvdC40LUg0L/QtdGA0LXQvNC10L3QvdC+0Lkg0LTQvtC70LbQvdC+XG4gICAqINC90LDRh9C40L3QsNGC0YzRgdGPINGBINC/0YDQtdGE0LjQutGB0LAsINC+0LHQvtC30L3QsNGH0LDRjtGJ0LXQs9C+INC10LUgR0xTTC3RgtC40L8uINCf0YDQtdGE0LjQutGBIFwidV9cIiDQvtC/0LjRgdGL0LLQsNC10YIg0L/QtdGA0LXQvNC10L3QvdGD0Y4g0YLQuNC/0LAgdW5pZm9ybS4g0J/RgNC10YTQuNC60YEgXCJhX1wiXG4gICAqINC+0L/QuNGB0YvQstCw0LXRgiDQv9C10YDQtdC80LXQvdC90YPRjiDRgtC40L/QsCBhdHRyaWJ1dGUuXG4gICAqXG4gICAqIEBwYXJhbSB2YXJOYW1lIC0g0JjQvNGPINC/0LXRgNC10LzQtdC90L3QvtC5ICjRgdGC0YDQvtC60LApLlxuICAgKi9cbiAgcHVibGljIGNyZWF0ZVZhcmlhYmxlKHZhck5hbWU6IHN0cmluZyk6IHZvaWQge1xuXG4gICAgY29uc3QgdmFyVHlwZSA9IHZhck5hbWUuc2xpY2UoMCwgMilcblxuICAgIGlmICh2YXJUeXBlID09PSAndV8nKSB7XG4gICAgICB0aGlzLnZhcmlhYmxlcy5zZXQodmFyTmFtZSwgdGhpcy5nbC5nZXRVbmlmb3JtTG9jYXRpb24odGhpcy5ncHVQcm9ncmFtLCB2YXJOYW1lKSlcbiAgICB9IGVsc2UgaWYgKHZhclR5cGUgPT09ICdhXycpIHtcbiAgICAgIHRoaXMudmFyaWFibGVzLnNldCh2YXJOYW1lLCB0aGlzLmdsLmdldEF0dHJpYkxvY2F0aW9uKHRoaXMuZ3B1UHJvZ3JhbSwgdmFyTmFtZSkpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcign0KPQutCw0LfQsNC9INC90LXQstC10YDQvdGL0Lkg0YLQuNC/ICjQv9GA0LXRhNC40LrRgSkg0L/QtdGA0LXQvNC10L3QvdC+0Lkg0YjQtdC50LTQtdGA0LA6ICcgKyB2YXJOYW1lKVxuICAgIH1cbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCh0L7Qt9C00LDQtdGCINGB0LLRj9C30Ywg0L3QsNCx0L7RgNCwINC/0LXRgNC10LzQtdC90L3Ri9GFINC/0YDQuNC70L7QttC10L3QuNGPINGBINC/0YDQvtCz0YDQsNC80LzQvtC5IFdlYkdsLlxuICAgKlxuICAgKiBAcmVtYXJrc1xuICAgKiDQlNC10LvQsNC10YIg0YLQvtC20LUg0YHQsNC80L7QtSwg0YfRgtC+INC4INC80LXRgtC+0LQge0BsaW5rIGNyZWF0ZVZhcmlhYmxlfSwg0L3QviDQv9C+0LfQstC+0LvRj9C10YIg0LfQsCDQvtC00LjQvSDQstGL0LfQvtCyINGB0L7Qt9C00LDRgtGMINGB0YDQsNC30YMg0L3QtdGB0LrQvtC70YzQutC+XG4gICAqINC/0LXRgNC10LzQtdC90L3Ri9GFLlxuICAgKlxuICAgKiBAcGFyYW0gdmFyTmFtZXMgLSDQn9C10YDQtdGH0LjRgdC70LXQvdC40Y8g0LjQvNC10L0g0L/QtdGA0LXQvNC10L3QvdGL0YUgKNGB0YLRgNC+0LrQsNC80LgpLlxuICAgKi9cbiAgcHVibGljIGNyZWF0ZVZhcmlhYmxlcyguLi52YXJOYW1lczogc3RyaW5nW10pOiB2b2lkIHtcbiAgICB2YXJOYW1lcy5mb3JFYWNoKHZhck5hbWUgPT4gdGhpcy5jcmVhdGVWYXJpYWJsZSh2YXJOYW1lKSk7XG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQodC+0LfQtNCw0LXRgiDQsiDQs9GA0YPQv9C/0LUg0LHRg9GE0LXRgNC+0LIgV2ViR0wg0L3QvtCy0YvQuSDQsdGD0YTQtdGAINC4INC30LDQv9C40YHRi9Cy0LDQtdGCINCyINC90LXQs9C+INC/0LXRgNC10LTQsNC90L3Ri9C1INC00LDQvdC90YvQtS5cbiAgICpcbiAgICogQHJlbWFya3NcbiAgICog0JrQvtC70LjRh9C10YHRgtCy0L4g0LPRgNGD0L/QvyDQsdGD0YTQtdGA0L7QsiDQuCDQutC+0LvQuNGH0LXRgdGC0LLQviDQsdGD0YTQtdGA0L7QsiDQsiDQutCw0LbQtNC+0Lkg0LPRgNGD0L/Qv9C1INC90LUg0L7Qs9GA0LDQvdC40YfQtdC90YsuINCa0LDQttC00LDRjyDQs9GA0YPQv9C/0LAg0LjQvNC10LXRgiDRgdCy0L7QtSDQvdCw0LfQstCw0L3QuNC1INC4XG4gICAqIEdMU0wt0YLQuNC/LiDQotC40L8g0LPRgNGD0L/Qv9GLINC+0L/RgNC10LTQtdC70Y/QtdGC0YHRjyDQsNCy0YLQvtC80LDRgtC40YfQtdGB0LrQuCDQvdCwINC+0YHQvdC+0LLQtSDRgtC40L/QsCDRgtC40L/QuNC30LjRgNC+0LLQsNC90L3QvtCz0L4g0LzQsNGB0YHQuNCy0LAuINCf0YDQsNCy0LjQu9CwINGB0L7QvtGC0LLQtdGC0YHRgtCy0LjRjyDRgtC40L/QvtCyXG4gICAqINC+0L/RgNC10LTQtdC70Y/RjtGC0YHRjyDQv9C10YDQtdC80LXQvdC90L7QuSB7QGxpbmsgZ2xOdW1iZXJUeXBlc30uXG4gICAqXG4gICAqIEBwYXJhbSBncm91cE5hbWUgLSDQndCw0LfQstCw0L3QuNC1INCz0YDRg9C/0L/RiyDQsdGD0YTQtdGA0L7Qsiwg0LIg0LrQvtGC0L7RgNGD0Y4g0LHRg9C00LXRgiDQtNC+0LHQsNCy0LvQtdC9INC90L7QstGL0Lkg0LHRg9GE0LXRgC5cbiAgICogQHBhcmFtIGRhdGEgLSDQlNCw0L3QvdGL0LUg0LIg0LLQuNC00LUg0YLQuNC/0LjQt9C40YDQvtCy0LDQvdC90L7Qs9C+INC80LDRgdGB0LjQstCwINC00LvRjyDQt9Cw0L/QuNGB0Lgg0LIg0YHQvtC30LTQsNCy0LDQtdC80YvQuSDQsdGD0YTQtdGALlxuICAgKiBAcmV0dXJucyDQntCx0YrQtdC8INC/0LDQvNGP0YLQuCwg0LfQsNC90Y/RgtGL0Lkg0L3QvtCy0YvQvCDQsdGD0YTQtdGA0L7QvCAo0LIg0LHQsNC50YLQsNGFKS5cbiAgICovXG4gIHB1YmxpYyBjcmVhdGVCdWZmZXIoZ3JvdXBOYW1lOiBzdHJpbmcsIGRhdGE6IFR5cGVkQXJyYXkpOiBudW1iZXIge1xuXG4gICAgY29uc3QgYnVmZmVyID0gdGhpcy5nbC5jcmVhdGVCdWZmZXIoKSFcbiAgICB0aGlzLmdsLmJpbmRCdWZmZXIodGhpcy5nbC5BUlJBWV9CVUZGRVIsIGJ1ZmZlcilcbiAgICB0aGlzLmdsLmJ1ZmZlckRhdGEodGhpcy5nbC5BUlJBWV9CVUZGRVIsIGRhdGEsIHRoaXMuZ2wuU1RBVElDX0RSQVcpXG5cbiAgICAvKiog0JXRgdC70Lgg0LPRgNGD0L/Qv9GLINGBINGD0LrQsNC30LDQvdC90YvQvCDQvdCw0LfQstCw0L3QuNC10Lwg0L3QtSDRgdGD0YnQtdGB0YLQstGD0LXRgiwg0YLQviDQvtC90LAg0YHQvtC30LTQsNC10YLRgdGPLiAqL1xuICAgIGlmICghdGhpcy5kYXRhLmhhcyhncm91cE5hbWUpKSB7XG4gICAgICB0aGlzLmRhdGEuc2V0KGdyb3VwTmFtZSwgeyBidWZmZXJzOiBbXSwgdHlwZTogdGhpcy5nbE51bWJlclR5cGVzLmdldChkYXRhLmNvbnN0cnVjdG9yLm5hbWUpIX0pXG4gICAgfVxuXG4gICAgdGhpcy5kYXRhLmdldChncm91cE5hbWUpIS5idWZmZXJzLnB1c2goYnVmZmVyKVxuXG4gICAgcmV0dXJuIGRhdGEubGVuZ3RoICogZGF0YS5CWVRFU19QRVJfRUxFTUVOVFxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0J/QtdGA0LXQtNCw0LXRgiDQt9C90LDRh9C10L3QuNC1INC80LDRgtGA0LjRhtGLIDMg0YUgMyDQsiDQv9GA0L7Qs9GA0LDQvNC80YMgV2ViR2wuXG4gICAqXG4gICAqIEBwYXJhbSB2YXJOYW1lIC0g0JjQvNGPINC/0LXRgNC10LzQtdC90L3QvtC5IFdlYkdMICjQuNC3INC80LDRgdGB0LjQstCwIHtAbGluayB2YXJpYWJsZXN9KSDQsiDQutC+0YLQvtGA0YPRjiDQsdGD0LTQtdGCINC30LDQv9C40YHQsNC90L4g0L/QtdGA0LXQtNCw0L3QvdC+0LUg0LfQvdCw0YfQtdC90LjQtS5cbiAgICogQHBhcmFtIHZhclZhbHVlIC0g0KPRgdGC0LDQvdCw0LLQu9C40LLQsNC10LzQvtC1INC30L3QsNGH0LXQvdC40LUg0LTQvtC70LbQvdC+INGP0LLQu9GP0YLRjNGB0Y8g0LzQsNGC0YDQuNGG0LXQuSDQstC10YnQtdGB0YLQstC10L3QvdGL0YUg0YfQuNGB0LXQuyDRgNCw0LfQvNC10YDQvtC8IDMg0YUgMywg0YDQsNC30LLQtdGA0L3Rg9GC0L7QuVxuICAgKiAgICAg0LIg0LLQuNC00LUg0L7QtNC90L7QvNC10YDQvdC+0LPQviDQvNCw0YHRgdC40LLQsCDQuNC3IDkg0Y3Qu9C10LzQtdC90YLQvtCyLlxuICAgKi9cbiAgcHVibGljIHNldFZhcmlhYmxlKHZhck5hbWU6IHN0cmluZywgdmFyVmFsdWU6IG51bWJlcltdKTogdm9pZCB7XG4gICAgdGhpcy5nbC51bmlmb3JtTWF0cml4M2Z2KHRoaXMudmFyaWFibGVzLmdldCh2YXJOYW1lKSwgZmFsc2UsIHZhclZhbHVlKVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JTQtdC70LDQtdGCINCx0YPRhNC10YAgV2ViR2wgXCLQsNC60YLQuNCy0L3Ri9C8XCIuXG4gICAqXG4gICAqIEBwYXJhbSBncm91cE5hbWUgLSDQndCw0LfQstCw0L3QuNC1INCz0YDRg9C/0L/RiyDQsdGD0YTQtdGA0L7Qsiwg0LIg0LrQvtGC0L7RgNC+0Lwg0YXRgNCw0L3QuNGC0YHRjyDQvdC10L7QsdGF0L7QtNC40LzRi9C5INCx0YPRhNC10YAuXG4gICAqIEBwYXJhbSBpbmRleCAtINCY0L3QtNC10LrRgSDQsdGD0YTQtdGA0LAg0LIg0LPRgNGD0L/Qv9C1LlxuICAgKiBAcGFyYW0gdmFyTmFtZSAtINCY0LzRjyDQv9C10YDQtdC80LXQvdC90L7QuSAo0LjQtyDQvNCw0YHRgdC40LLQsCB7QGxpbmsgdmFyaWFibGVzfSksINGBINC60L7RgtC+0YDQvtC5INCx0YPQtNC10YIg0YHQstGP0LfQsNC9INCx0YPRhNC10YAuXG4gICAqIEBwYXJhbSBzaXplIC0g0JrQvtC70LjRh9C10YHRgtCy0L4g0Y3Qu9C10LzQtdC90YLQvtCyINCyINCx0YPRhNC10YDQtSwg0YHQvtC+0YLQstC10YLRgdGC0LLRg9GO0YnQuNGFINC+0LTQvdC+0LkgwqBHTC3QstC10YDRiNC40L3QtS5cbiAgICogQHBhcmFtIHN0cmlkZSAtINCg0LDQt9C80LXRgCDRiNCw0LPQsCDQvtCx0YDQsNCx0L7RgtC60Lgg0Y3Qu9C10LzQtdC90YLQvtCyINCx0YPRhNC10YDQsCAo0LfQvdCw0YfQtdC90LjQtSAwINC30LDQtNCw0LXRgiDRgNCw0LfQvNC10YnQtdC90LjQtSDRjdC70LXQvNC10L3RgtC+0LIg0LTRgNGD0LMg0LfQsCDQtNGA0YPQs9C+0LwpLlxuICAgKiBAcGFyYW0gb2Zmc2V0IC0g0KHQvNC10YnQtdC90LjQtSDQvtGC0L3QvtGB0LjRgtC10LvRjNC90L4g0L3QsNGH0LDQu9CwINCx0YPRhNC10YDQsCwg0L3QsNGH0LjQvdCw0Y8g0YEg0LrQvtGC0L7RgNC+0LPQviDQsdGD0LTQtdGCINC/0YDQvtC40YHRhdC+0LTQuNGC0Ywg0L7QsdGA0LDQsdC+0YLQutCwINGN0LvQtdC80LXQvdGC0L7Qsi5cbiAgICovXG4gIHB1YmxpYyBzZXRCdWZmZXIoZ3JvdXBOYW1lOiBzdHJpbmcsIGluZGV4OiBudW1iZXIsIHZhck5hbWU6IHN0cmluZywgc2l6ZTogbnVtYmVyLCBzdHJpZGU6IG51bWJlciwgb2Zmc2V0OiBudW1iZXIpOiB2b2lkIHtcblxuICAgIGNvbnN0IGdyb3VwID0gdGhpcy5kYXRhLmdldChncm91cE5hbWUpIVxuICAgIGNvbnN0IHZhcmlhYmxlID0gdGhpcy52YXJpYWJsZXMuZ2V0KHZhck5hbWUpXG5cbiAgICB0aGlzLmdsLmJpbmRCdWZmZXIodGhpcy5nbC5BUlJBWV9CVUZGRVIsIGdyb3VwLmJ1ZmZlcnNbaW5kZXhdKVxuICAgIHRoaXMuZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkodmFyaWFibGUpXG4gICAgdGhpcy5nbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKHZhcmlhYmxlLCBzaXplLCBncm91cC50eXBlLCBmYWxzZSwgc3RyaWRlLCBvZmZzZXQpXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQktGL0L/QvtC70L3Rj9C10YIg0L7RgtGA0LjRgdC+0LLQutGDINC60L7QvdGC0LXQutGB0YLQsCDRgNC10L3QtNC10YDQuNC90LPQsCBXZWJHTCDQvNC10YLQvtC00L7QvCDQv9GA0LjQvNC40YLQuNCy0L3Ri9GFINGC0L7Rh9C10LouXG4gICAqXG4gICAqIEBwYXJhbSBmaXJzdCAtINCY0L3QtNC10LrRgSBHTC3QstC10YDRiNC40L3Riywg0YEg0LrQvtGC0L7RgNC+0Lkg0L3QsNGH0L3QtdGC0Y8g0L7RgtGA0LjRgdC+0LLQutCwLlxuICAgKiBAcGFyYW0gY291bnQgLSDQmtC+0LvQuNGH0LXRgdGC0LLQviDQvtGA0LjRgdC+0LLRi9Cy0LDQtdC80YvRhSBHTC3QstC10YDRiNC40L0uXG4gICAqL1xuICBwdWJsaWMgZHJhd1BvaW50cyhmaXJzdDogbnVtYmVyLCBjb3VudDogbnVtYmVyKTogdm9pZCB7XG4gICAgdGhpcy5nbC5kcmF3QXJyYXlzKHRoaXMuZ2wuUE9JTlRTLCBmaXJzdCwgY291bnQpXG4gIH1cbn1cbiIsImltcG9ydCB7IGNvcHlNYXRjaGluZ0tleVZhbHVlcywgY29sb3JGcm9tSGV4VG9HbFJnYiB9IGZyb20gJy4vdXRpbHMnXG5pbXBvcnQgU0hBREVSX0NPREVfVkVSVF9UTVBMIGZyb20gJy4vc2hhZGVyLWNvZGUtdmVydC10bXBsJ1xuaW1wb3J0IFNIQURFUl9DT0RFX0ZSQUdfVE1QTCBmcm9tICcuL3NoYWRlci1jb2RlLWZyYWctdG1wbCdcbmltcG9ydCBTUGxvdENvbnRvbCBmcm9tICcuL3NwbG90LWNvbnRyb2wnXG5pbXBvcnQgU1Bsb3RXZWJHbCBmcm9tICcuL3NwbG90LXdlYmdsJ1xuaW1wb3J0IFNQbG90RGVidWcgZnJvbSAnLi9zcGxvdC1kZWJ1ZydcbmltcG9ydCBTUGxvdERlbW8gZnJvbSAnLi9zcGxvdC1kZW1vJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTUGxvdCB7XG5cbiAgLyoqINCk0YPQvdC60YbQuNGPINC40YLQtdGA0LjRgNC+0LLQsNC90LjRjyDQuNGB0YXQvtC00L3Ri9GFINC00LDQvdC90YvRhS4gKi9cbiAgcHVibGljIGl0ZXJhdG9yOiBTUGxvdEl0ZXJhdG9yID0gdW5kZWZpbmVkXG5cbiAgLyoqINCl0LXQu9C/0LXRgCBXZWJHTC4gKi9cbiAgcHVibGljIHdlYmdsOiBTUGxvdFdlYkdsID0gbmV3IFNQbG90V2ViR2wodGhpcylcblxuICAvKiog0KXQtdC70L/QtdGAINGA0LXQttC40LzQsCDQtNC10LzQvi3QtNCw0L3QvdGL0YUuICovXG4gIHB1YmxpYyBkZW1vOiBTUGxvdERlbW8gPSBuZXcgU1Bsb3REZW1vKHRoaXMpXG5cbiAgLyoqINCl0LXQu9C/0LXRgCDRgNC10LbQuNC80LAg0L7RgtC70LDQtNC60LguICovXG4gIHB1YmxpYyBkZWJ1ZzogU1Bsb3REZWJ1ZyA9IG5ldyBTUGxvdERlYnVnKHRoaXMpXG5cbiAgLyoqINCf0YDQuNC30L3QsNC6INGE0L7RgNGB0LjRgNC+0LLQsNC90L3QvtCz0L4g0LfQsNC/0YPRgdC60LAg0YDQtdC90LTQtdGA0LAuICovXG4gIHB1YmxpYyBmb3JjZVJ1bjogYm9vbGVhbiA9IGZhbHNlXG5cbiAgLyoqINCe0LPRgNCw0L3QuNGH0LXQvdC40LUg0LrQvtC7LdCy0LAg0L7QsdGK0LXQutGC0L7QsiDQvdCwINCz0YDQsNGE0LjQutC1LiAqL1xuICBwdWJsaWMgZ2xvYmFsTGltaXQ6IG51bWJlciA9IDFfMDAwXzAwMF8wMDBcblxuICAvKiog0J7Qs9GA0LDQvdC40YfQtdC90LjQtSDQutC+0Lst0LLQsCDQvtCx0YrQtdC60YLQvtCyINCyINCz0YDRg9C/0L/QtS4gKi9cbiAgcHVibGljIGdyb3VwTGltaXQ6IG51bWJlciA9IDEwXzAwMFxuXG4gIC8qKiDQptCy0LXRgtC+0LLQsNGPINC/0LDQu9C40YLRgNCwINC+0LHRitC10LrRgtC+0LIuICovXG4gIHB1YmxpYyBjb2xvcnM6IHN0cmluZ1tdID0gW11cblxuICAvKiog0J/QsNGA0LDQvNC10YLRgNGLINC60L7QvtGA0LTQuNC90LDRgtC90L7QuSDQv9C70L7RgdC60L7RgdGC0LguICovXG4gIHB1YmxpYyBncmlkOiBTUGxvdEdyaWQgPSB7XG4gICAgd2lkdGg6IDMyXzAwMCxcbiAgICBoZWlnaHQ6IDE2XzAwMCxcbiAgICBiZ0NvbG9yOiAnI2ZmZmZmZicsXG4gICAgcnVsZXNDb2xvcjogJyNjMGMwYzAnXG4gIH1cblxuICAvKiog0J/QsNGA0LDQvNC10YLRgNGLINC+0LHQu9Cw0YHRgtC4INC/0YDQvtGB0LzQvtGC0YDQsC4gKi9cbiAgcHVibGljIGNhbWVyYTogU1Bsb3RDYW1lcmEgPSB7XG4gICAgeDogdGhpcy5ncmlkLndpZHRoISAvIDIsXG4gICAgeTogdGhpcy5ncmlkLmhlaWdodCEgLyAyLFxuICAgIHpvb206IDFcbiAgfVxuXG4gIC8qKiDQn9GA0LjQt9C90LDQuiDQvdC10L7QsdGF0L7QtNC40LzQvtGB0YLQuCDQsdC10LfQvtGC0LvQsNCz0LDRgtC10LvRjNC90L7Qs9C+INC30LDQv9GD0YHQutCwINGA0LXQvdC00LXRgNCwLiAqL1xuICBwdWJsaWMgaXNSdW5uaW5nOiBib29sZWFuID0gZmFsc2VcblxuICAvKiog0JrQvtC70LjRh9C10YHRgtCy0L4g0YDQsNC30LvQuNGH0L3Ri9GFINGE0L7RgNC8INC+0LHRitC10LrRgtC+0LIuICovXG4gIHB1YmxpYyBzaGFwZXNDb3VudDogbnVtYmVyID0gMlxuXG4gIC8qKiBHTFNMLdC60L7QtNGLINGI0LXQudC00LXRgNC+0LIuICovXG4gIHB1YmxpYyBzaGFkZXJDb2RlVmVydDogc3RyaW5nID0gJydcbiAgcHVibGljIHNoYWRlckNvZGVGcmFnOiBzdHJpbmcgPSAnJ1xuXG4gIC8qKiDQodGC0LDRgtC40YHRgtC40YfQtdGB0LrQsNGPINC40L3RhNC+0YDQvNCw0YbQuNGPLiAqL1xuICBwdWJsaWMgc3RhdHMgPSB7XG4gICAgb2JqZWN0c0NvdW50VG90YWw6IDAsXG4gICAgb2JqZWN0c0NvdW50SW5Hcm91cHM6IFtdIGFzIG51bWJlcltdLFxuICAgIGdyb3Vwc0NvdW50OiAwLFxuICAgIG1lbVVzYWdlOiAwXG4gIH1cblxuICAvKiog0KXQtdC70L/QtdGAINCy0LfQsNC40LzQvtC00LXQudGB0YLQstC40Y8g0YEg0YPRgdGC0YDQvtC50YHRgtCy0L7QvCDQstCy0L7QtNCwLiAqL1xuICBwcm90ZWN0ZWQgY29udHJvbDogU1Bsb3RDb250b2wgPSBuZXcgU1Bsb3RDb250b2wodGhpcylcblxuICBwdWJsaWMgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudFxuXG4gIC8qKlxuICAgKiDQodC+0LfQtNCw0LXRgiDRjdC60LfQtdC80L/Qu9GP0YAg0LrQu9Cw0YHRgdCwLCDQuNC90LjRhtC40LDQu9C40LfQuNGA0YPQtdGCINC90LDRgdGC0YDQvtC50LrQuC5cbiAgICpcbiAgICogQHJlbWFya3NcbiAgICog0JXRgdC70Lgg0LrQsNC90LLQsNGBINGBINC30LDQtNCw0L3QvdGL0Lwg0LjQtNC10L3RgtC40YTQuNC60LDRgtC+0YDQvtC8INC90LUg0L3QsNC50LTQtdC9IC0g0LPQtdC90LXRgNC40YDRg9C10YLRgdGPINC+0YjQuNCx0LrQsC4g0J3QsNGB0YLRgNC+0LnQutC4INC80L7Qs9GD0YIg0LHRi9GC0Ywg0LfQsNC00LDQvdGLINC60LDQuiDQslxuICAgKiDQutC+0L3RgdGC0YDRg9C60YLQvtGA0LUsINGC0LDQuiDQuCDQsiDQvNC10YLQvtC00LUge0BsaW5rIHNldHVwfS4g0J7QtNC90LDQutC+INCyINC70Y7QsdC+0Lwg0YHQu9GD0YfQsNC1INC90LDRgdGC0YDQvtC50LrQuCDQtNC+0LvQttC90Ysg0LHRi9GC0Ywg0LfQsNC00LDQvdGLINC00L4g0LfQsNC/0YPRgdC60LAg0YDQtdC90LTQtdGA0LAuXG4gICAqXG4gICAqIEBwYXJhbSBjYW52YXNJZCAtINCY0LTQtdC90YLQuNGE0LjQutCw0YLQvtGAINC60LDQvdCy0LDRgdCwLCDQvdCwINC60L7RgtC+0YDQvtC8INCx0YPQtNC10YIg0YDQuNGB0L7QstCw0YLRjNGB0Y8g0LPRgNCw0YTQuNC6LlxuICAgKiBAcGFyYW0gb3B0aW9ucyAtINCf0L7Qu9GM0LfQvtCy0LDRgtC10LvRjNGB0LrQuNC1INC90LDRgdGC0YDQvtC50LrQuCDRjdC60LfQtdC80L/Qu9GP0YDQsC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGNhbnZhc0lkOiBzdHJpbmcsIG9wdGlvbnM/OiBTUGxvdE9wdGlvbnMpIHtcblxuICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChjYW52YXNJZCkpIHtcbiAgICAgIHRoaXMuY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY2FudmFzSWQpIGFzIEhUTUxDYW52YXNFbGVtZW50XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcign0JrQsNC90LLQsNGBINGBINC40LTQtdC90YLQuNGE0LjQutCw0YLQvtGA0L7QvCBcIiMnICsgY2FudmFzSWQgKyAnXCIg0L3QtSDQvdCw0LnQtNC10L0hJylcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucykge1xuICAgICAgdGhpcy5zZXRPcHRpb25zKG9wdGlvbnMpICAgIC8vINCV0YHQu9C4INC/0LXRgNC10LTQsNC90Ysg0L3QsNGB0YLRgNC+0LnQutC4LCDRgtC+INC+0L3QuCDQv9GA0LjQvNC10L3Rj9GO0YLRgdGPLlxuXG4gICAgICBpZiAodGhpcy5mb3JjZVJ1bikge1xuICAgICAgICB0aGlzLnNldHVwKG9wdGlvbnMpICAgICAgIC8vICDQmNC90LjRhtC40LDQu9C40LfQsNGG0LjRjyDQstGB0LXRhSDQv9Cw0YDQsNC80LXRgtGA0L7QsiDRgNC10L3QtNC10YDQsCwg0LXRgdC70Lgg0LfQsNC/0YDQvtGI0LXQvSDRhNC+0YDRgdC40YDQvtCy0LDQvdC90YvQuSDQt9Cw0L/Rg9GB0LouXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqINCY0L3QuNGG0LjQsNC70LjQt9C40YDRg9C10YIg0L3QtdC+0LHRhdC+0LTQuNC80YvQtSDQtNC70Y8g0YDQtdC90LTQtdGA0LAg0L/QsNGA0LDQvNC10YLRgNGLINGN0LrQt9C10LzQv9C70Y/RgNCwINC4IFdlYkdMLlxuICAgKlxuICAgKiBAcGFyYW0gb3B0aW9ucyAtINCf0L7Qu9GM0LfQvtCy0LDRgtC10LvRjNGB0LrQuNC1INC90LDRgdGC0YDQvtC50LrQuCDRjdC60LfQtdC80L/Qu9GP0YDQsC5cbiAgICovXG4gIHB1YmxpYyBzZXR1cChvcHRpb25zOiBTUGxvdE9wdGlvbnMpOiB2b2lkIHtcblxuICAgIHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKSAgICAvLyDQn9GA0LjQvNC10L3QtdC90LjQtSDQv9C+0LvRjNC30L7QstCw0YLQtdC70YzRgdC60LjRhSDQvdCw0YHRgtGA0L7QtdC6LlxuXG4gICAgdGhpcy5kZWJ1Zy5sb2coJ2ludHJvJylcblxuICAgIHRoaXMud2ViZ2wuc2V0dXAoKSAgICAgICAgIC8vINCh0L7Qt9C00LDQvdC40LUg0LrQvtC90YLQtdC60YHRgtCwINGA0LXQvdC00LXRgNC40L3Qs9CwLlxuICAgIHRoaXMuY29udHJvbC5zZXR1cCgpXG4gICAgdGhpcy5kZWJ1Zy5zZXR1cCgpXG4gICAgdGhpcy5kZW1vLnNldHVwKClcblxuICAgIHRoaXMuZGVidWcubG9nKCdpbnN0YW5jZScpXG5cbiAgICB0aGlzLndlYmdsLnNldEJnQ29sb3IodGhpcy5ncmlkLmJnQ29sb3IhKSAgICAvLyDQo9GB0YLQsNC90L7QstC60LAg0YbQstC10YLQsCDQvtGH0LjRgdGC0LrQuCDRgNC10L3QtNC10YDQuNC90LPQsFxuXG4gICAgdGhpcy5zaGFkZXJDb2RlVmVydCA9IFNIQURFUl9DT0RFX1ZFUlRfVE1QTC5yZXBsYWNlKCd7RVhULUNPREV9JywgdGhpcy5nZW5TaGFkZXJDb2xvckNvZGUoKSkudHJpbSgpXG4gICAgdGhpcy5zaGFkZXJDb2RlRnJhZyA9IFNIQURFUl9DT0RFX0ZSQUdfVE1QTC50cmltKClcblxuICAgIHRoaXMud2ViZ2wuY3JlYXRlUHJvZ3JhbSh0aGlzLnNoYWRlckNvZGVWZXJ0LCB0aGlzLnNoYWRlckNvZGVGcmFnKSAgICAvLyDQodC+0LfQtNCw0L3QuNC1INC/0YDQvtCz0YDQsNC80LzRiyBXZWJHTC5cblxuICAgIC8vINCh0L7Qt9C00LDQvdC40LUg0L/QtdGA0LXQvNC10L3QvdGL0YUgV2ViR2wuXG4gICAgdGhpcy53ZWJnbC5jcmVhdGVWYXJpYWJsZXMoJ2FfcG9zaXRpb24nLCAnYV9jb2xvcicsICdhX3NpemUnLCAnYV9zaGFwZScsICd1X21hdHJpeCcpXG5cbiAgICB0aGlzLmxvYWREYXRhKCkgICAgLy8g0JfQsNC/0L7Qu9C90LXQvdC40LUg0LHRg9GE0LXRgNC+0LIgV2ViR0wuXG5cbiAgICBpZiAodGhpcy5mb3JjZVJ1bikge1xuICAgICAgdGhpcy5ydW4oKSAgICAgICAgICAgICAgICAvLyDQpNC+0YDRgdC40YDQvtCy0LDQvdC90YvQuSDQt9Cw0L/Rg9GB0Log0YDQtdC90LTQtdGA0LjQvdCz0LAgKNC10YHQu9C4INGC0YDQtdCx0YPQtdGC0YHRjykuXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqINCf0YDQuNC80LXQvdGP0LXRgiDQv9C+0LvRjNC30L7QstCw0YLQtdC70YzRgdC60LjQtSDQvdCw0YHRgtGA0L7QudC60Lgg0Y3QutC30LXQvNC/0LvRj9GA0LAuXG4gICAqXG4gICAqIEBwYXJhbSBvcHRpb25zIC0g0J/QvtC70YzQt9C+0LLQsNGC0LXQu9GM0YHQutC40LUg0L3QsNGB0YLRgNC+0LnQutC4INGN0LrQt9C10LzQv9C70Y/RgNCwLlxuICAgKi9cbiAgcHJvdGVjdGVkIHNldE9wdGlvbnMob3B0aW9uczogU1Bsb3RPcHRpb25zKTogdm9pZCB7XG5cbiAgICBjb3B5TWF0Y2hpbmdLZXlWYWx1ZXModGhpcywgb3B0aW9ucykgICAgLy8g0J/RgNC40LzQtdC90LXQvdC40LUg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GM0YHQutC40YUg0L3QsNGB0YLRgNC+0LXQui5cblxuICAgIC8vINCV0YHQu9C4INC30LDQtNCw0L0g0YDQsNC30LzQtdGAINC/0LvQvtGB0LrQvtGB0YLQuCwg0L3QviDQvdC1INC30LDQtNCw0L3QviDQv9C+0LvQvtC20LXQvdC40LUg0L7QsdC70LDRgdGC0Lgg0L/RgNC+0YHQvNC+0YLRgNCwLCDRgtC+INC+0LHQu9Cw0YHRgtGMINC/0L7QvNC10YnQsNC10YLRgdGPINCyINGG0LXQvdGC0YAg0L/Qu9C+0YHQutC+0YHRgtC4LlxuICAgIGlmICgoJ2dyaWQnIGluIG9wdGlvbnMpICYmICEoJ2NhbWVyYScgaW4gb3B0aW9ucykpIHtcbiAgICAgIHRoaXMuY2FtZXJhLnggPSB0aGlzLmdyaWQud2lkdGghIC8gMlxuICAgICAgdGhpcy5jYW1lcmEueSA9IHRoaXMuZ3JpZC5oZWlnaHQhIC8gMlxuICAgIH1cblxuICAgIGlmICh0aGlzLmRlbW8uaXNFbmFibGUpIHtcbiAgICAgIHRoaXMuaXRlcmF0b3IgPSB0aGlzLmRlbW8uaXRlcmF0b3IuYmluZCh0aGlzLmRlbW8pICAgIC8vINCY0LzQuNGC0LDRhtC40Y8g0LjRgtC10YDQuNGA0L7QstCw0L3QuNGPINC00LvRjyDQtNC10LzQvi3RgNC10LbQuNC80LAuXG4gICAgICB0aGlzLmNvbG9ycyA9IHRoaXMuZGVtby5jb2xvcnNcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICog0KHQvtC30LTQsNC10YIg0Lgg0LfQsNC/0L7Qu9C90Y/QtdGCINC00LDQvdC90YvQvNC4INC+0LHQviDQstGB0LXRhSDQv9C+0LvQuNCz0L7QvdCw0YUg0LHRg9GE0LXRgNGLIFdlYkdMLlxuICAgKi9cbiAgcHJvdGVjdGVkIGxvYWREYXRhKCk6IHZvaWQge1xuXG4gICAgdGhpcy5kZWJ1Zy5sb2coJ2xvYWRpbmcnKVxuXG4gICAgbGV0IHBvbHlnb25Hcm91cDogU1Bsb3RQb2x5Z29uR3JvdXAgPSB7IHZlcnRpY2VzOiBbXSwgY29sb3JzOiBbXSwgc2l6ZXM6IFtdLCBzaGFwZXM6IFtdLCBhbW91bnRPZlZlcnRpY2VzOiAwIH1cblxuICAgIHRoaXMuc3RhdHMgPSB7XG4gICAgICBvYmplY3RzQ291bnRUb3RhbDogMCxcbiAgICAgIG9iamVjdHNDb3VudEluR3JvdXBzOiBbXSBhcyBudW1iZXJbXSxcbiAgICAgIGdyb3Vwc0NvdW50OiAwLFxuICAgICAgbWVtVXNhZ2U6IDBcbiAgICB9XG5cbiAgICBsZXQgb2JqZWN0OiBTUGxvdE9iamVjdCB8IG51bGwgfCB1bmRlZmluZWRcbiAgICBsZXQgazogbnVtYmVyID0gMFxuICAgIGxldCBpc09iamVjdEVuZHM6IGJvb2xlYW4gPSBmYWxzZVxuXG4gICAgd2hpbGUgKCFpc09iamVjdEVuZHMpIHtcblxuICAgICAgb2JqZWN0ID0gdGhpcy5pdGVyYXRvciEoKVxuICAgICAgaXNPYmplY3RFbmRzID0gKG9iamVjdCA9PT0gbnVsbCkgfHwgKHRoaXMuc3RhdHMub2JqZWN0c0NvdW50VG90YWwgPj0gdGhpcy5nbG9iYWxMaW1pdClcblxuICAgICAgaWYgKCFpc09iamVjdEVuZHMpIHtcbiAgICAgICAgcG9seWdvbkdyb3VwLnZlcnRpY2VzLnB1c2gob2JqZWN0IS54LCBvYmplY3QhLnkpXG4gICAgICAgIHBvbHlnb25Hcm91cC5zaGFwZXMucHVzaChvYmplY3QhLnNoYXBlKVxuICAgICAgICBwb2x5Z29uR3JvdXAuc2l6ZXMucHVzaChvYmplY3QhLnNpemUpXG4gICAgICAgIHBvbHlnb25Hcm91cC5jb2xvcnMucHVzaChvYmplY3QhLmNvbG9yKVxuICAgICAgICBrKytcbiAgICAgICAgdGhpcy5zdGF0cy5vYmplY3RzQ291bnRUb3RhbCsrXG4gICAgICB9XG5cbiAgICAgIGlmICgoayA+PSB0aGlzLmdyb3VwTGltaXQpIHx8IGlzT2JqZWN0RW5kcykge1xuICAgICAgICB0aGlzLnN0YXRzLm9iamVjdHNDb3VudEluR3JvdXBzW3RoaXMuc3RhdHMuZ3JvdXBzQ291bnRdID0ga1xuXG4gICAgICAgIC8qKiDQodC+0LfQtNCw0L3QuNC1INC4INC30LDQv9C+0LvQvdC10L3QuNC1INCx0YPRhNC10YDQvtCyINC00LDQvdC90YvQvNC4INC+INGC0LXQutGD0YnQtdC5INCz0YDRg9C/0L/QtSDQv9C+0LvQuNCz0L7QvdC+0LIuICovXG4gICAgICAgIHRoaXMuc3RhdHMubWVtVXNhZ2UgKz1cbiAgICAgICAgICB0aGlzLndlYmdsLmNyZWF0ZUJ1ZmZlcigndmVydGljZXMnLCBuZXcgRmxvYXQzMkFycmF5KHBvbHlnb25Hcm91cC52ZXJ0aWNlcykpICtcbiAgICAgICAgICB0aGlzLndlYmdsLmNyZWF0ZUJ1ZmZlcignY29sb3JzJywgbmV3IFVpbnQ4QXJyYXkocG9seWdvbkdyb3VwLmNvbG9ycykpICtcbiAgICAgICAgICB0aGlzLndlYmdsLmNyZWF0ZUJ1ZmZlcignc2hhcGVzJywgbmV3IFVpbnQ4QXJyYXkocG9seWdvbkdyb3VwLnNoYXBlcykpICtcbiAgICAgICAgICB0aGlzLndlYmdsLmNyZWF0ZUJ1ZmZlcignc2l6ZXMnLCBuZXcgRmxvYXQzMkFycmF5KHBvbHlnb25Hcm91cC5zaXplcykpXG4gICAgICB9XG5cbiAgICAgIGlmICgoayA+PSB0aGlzLmdyb3VwTGltaXQpICYmICFpc09iamVjdEVuZHMpIHtcbiAgICAgICAgdGhpcy5zdGF0cy5ncm91cHNDb3VudCsrXG4gICAgICAgIHBvbHlnb25Hcm91cCA9IHsgdmVydGljZXM6IFtdLCBjb2xvcnM6IFtdLCBzaXplczogW10sIHNoYXBlczogW10sIGFtb3VudE9mVmVydGljZXM6IDAgfVxuICAgICAgICBrID0gMFxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuZGVidWcubG9nKCdsb2FkZWQnKVxuICB9XG5cbiAgLyoqXG4gICAqINCh0L7Qt9C00LDQtdGCINC00L7Qv9C+0LvQvdC10L3QuNC1INC6INC60L7QtNGDINC90LAg0Y/Qt9GL0LrQtSBHTFNMLlxuICAgKlxuICAgKiBAcmVtYXJrc1xuICAgKiDQkiDQtNCw0LvRjNC90LXQudGI0LXQvCDRgdC+0LfQtNCw0L3QvdGL0Lkg0LrQvtC0INCx0YPQtNC10YIg0LLRgdGC0YDQvtC10L0g0LIg0LrQvtC0INCy0LXRgNGI0LjQvdC90L7Qs9C+INGI0LXQudC00LXRgNCwINC00LvRjyDQt9Cw0LTQsNC90LjRjyDRhtCy0LXRgtCwINCy0LXRgNGI0LjQvdGLINCyINC30LDQstC40YHQuNC80L7RgdGC0Lgg0L7RglxuICAgKiDQuNC90LTQtdC60YHQsCDRhtCy0LXRgtCwLCDQv9GA0LjRgdCy0L7QtdC90L3QvtCz0L4g0Y3RgtC+0Lkg0LLQtdGA0YjQuNC90LUuINCiLtC6LiDRiNC10LnQtNC10YAg0L3QtSDQv9C+0LfQstC+0LvRj9C10YIg0LjRgdC/0L7Qu9GM0LfQvtCy0LDRgtGMINCyINC60LDRh9C10YHRgtCy0LUg0LjQvdC00LXQutGB0L7QsiDQv9C10YDQtdC80LXQvdC90YvQtSAtXG4gICAqINC00LvRjyDQt9Cw0LTQsNC90LjRjyDRhtCy0LXRgtCwINC40YHQv9C+0LvRjNC30YPQtdGC0YHRjyDQv9C10YDQtdCx0L7RgCDRhtCy0LXRgtC+0LLRi9GFINC40L3QtNC10LrRgdC+0LIuXG4gICAqXG4gICAqIEByZXR1cm5zINCa0L7QtCDQvdCwINGP0LfRi9C60LUgR0xTTC5cbiAgICovXG4gIHByb3RlY3RlZCBnZW5TaGFkZXJDb2xvckNvZGUoKTogc3RyaW5nIHtcblxuICAgIC8vINCS0YDQtdC80LXQvdC90L7QtSDQtNC+0LHQsNCy0LvQtdC90LjQtSDQsiDQv9Cw0LvQuNGC0YDRgyDRhtCy0LXRgtC+0LIg0LLQtdGA0YjQuNC9INGG0LLQtdGC0LAg0L3QsNC/0YDQsNCy0LvRj9GO0YnQuNGFLlxuICAgIHRoaXMuY29sb3JzLnB1c2godGhpcy5ncmlkLnJ1bGVzQ29sb3IhKVxuXG4gICAgbGV0IGNvZGU6IHN0cmluZyA9ICcnXG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY29sb3JzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgIC8vINCf0L7Qu9GD0YfQtdC90LjQtSDRhtCy0LXRgtCwINCyINC90YPQttC90L7QvCDRhNC+0YDQvNCw0YLQtS5cbiAgICAgIGxldCBbciwgZywgYl0gPSBjb2xvckZyb21IZXhUb0dsUmdiKHRoaXMuY29sb3JzW2ldKVxuXG4gICAgICAvLyDQpNC+0YDQvNC40YDQvtCy0L3QuNC1INGB0YLRgNC+0LogR0xTTC3QutC+0LTQsCDQv9GA0L7QstC10YDQutC4INC40L3QtNC10LrRgdCwINGG0LLQtdGC0LAuXG4gICAgICBjb2RlICs9ICgoaSA9PT0gMCkgPyAnJyA6ICcgIGVsc2UgJykgKyAnaWYgKGFfY29sb3IgPT0gJyArIGkgKyAnLjApIHZfY29sb3IgPSB2ZWMzKCcgK1xuICAgICAgICByLnRvU3RyaW5nKCkuc2xpY2UoMCwgOSkgKyAnLCcgK1xuICAgICAgICBnLnRvU3RyaW5nKCkuc2xpY2UoMCwgOSkgKyAnLCcgK1xuICAgICAgICBiLnRvU3RyaW5nKCkuc2xpY2UoMCwgOSkgKyAnKTtcXG4nXG4gICAgfVxuXG4gICAgLy8g0KPQtNCw0LvQtdC90LjQtSDQuNC3INC/0LDQu9C40YLRgNGLINCy0LXRgNGI0LjQvSDQstGA0LXQvNC10L3QvdC+INC00L7QsdCw0LLQu9C10L3QvdC+0LPQviDRhtCy0LXRgtCwINC90LDQv9GA0LDQstC70Y/RjtGJ0LjRhS5cbiAgICB0aGlzLmNvbG9ycy5wb3AoKVxuXG4gICAgcmV0dXJuIGNvZGVcbiAgfVxuXG4gIC8qKlxuICAgKiDQn9GA0L7QuNC30LLQvtC00LjRgiDRgNC10L3QtNC10YDQuNC90LMg0LPRgNCw0YTQuNC60LAg0LIg0YHQvtC+0YLQstC10YLRgdGC0LLQuNC4INGBINGC0LXQutGD0YnQuNC80Lgg0L/QsNGA0LDQvNC10YLRgNCw0LzQuCDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuC5cbiAgICovXG4gIHB1YmxpYyByZW5kZXIoKTogdm9pZCB7XG5cbiAgICAvLyDQntGH0LjRgdGC0LrQsCDQvtCx0YrQtdC60YLQsCDRgNC10L3QtNC10YDQuNC90LPQsCBXZWJHTC5cbiAgICB0aGlzLndlYmdsLmNsZWFyQmFja2dyb3VuZCgpXG5cbiAgICAvLyDQntCx0L3QvtCy0LvQtdC90LjQtSDQvNCw0YLRgNC40YbRiyDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuC5cbiAgICB0aGlzLmNvbnRyb2wudXBkYXRlVmlld1Byb2plY3Rpb24oKVxuXG4gICAgLy8g0J/RgNC40LLRj9C30LrQsCDQvNCw0YLRgNC40YbRiyDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuCDQuiDQv9C10YDQtdC80LXQvdC90L7QuSDRiNC10LnQtNC10YDQsC5cbiAgICB0aGlzLndlYmdsLnNldFZhcmlhYmxlKCd1X21hdHJpeCcsIHRoaXMuY29udHJvbC50cmFuc2Zvcm0udmlld1Byb2plY3Rpb25NYXQpXG5cbiAgICAvLyDQmNGC0LXRgNC40YDQvtCy0LDQvdC40LUg0Lgg0YDQtdC90LTQtdGA0LjQvdCzINCz0YDRg9C/0L8g0LHRg9GE0LXRgNC+0LIgV2ViR0wuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnN0YXRzLmdyb3Vwc0NvdW50OyBpKyspIHtcblxuICAgICAgdGhpcy53ZWJnbC5zZXRCdWZmZXIoJ3ZlcnRpY2VzJywgaSwgJ2FfcG9zaXRpb24nLCAyLCAwLCAwKVxuICAgICAgdGhpcy53ZWJnbC5zZXRCdWZmZXIoJ2NvbG9ycycsIGksICdhX2NvbG9yJywgMSwgMCwgMClcbiAgICAgIHRoaXMud2ViZ2wuc2V0QnVmZmVyKCdzaXplcycsIGksICdhX3NpemUnLCAxLCAwLCAwKVxuICAgICAgdGhpcy53ZWJnbC5zZXRCdWZmZXIoJ3NoYXBlcycsIGksICdhX3NoYXBlJywgMSwgMCwgMClcblxuICAgICAgdGhpcy53ZWJnbC5kcmF3UG9pbnRzKDAsIHRoaXMuc3RhdHMub2JqZWN0c0NvdW50SW5Hcm91cHNbaV0pXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqINCX0LDQv9GD0YHQutCw0LXRgiDRgNC10L3QtNC10YDQuNC90LMg0Lgg0LrQvtC90YLRgNC+0LvRjCDRg9C/0YDQsNCy0LvQtdC90LjRjy5cbiAgICovXG4gIHB1YmxpYyBydW4oKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmlzUnVubmluZykge1xuICAgICAgdGhpcy5yZW5kZXIoKVxuICAgICAgdGhpcy5jb250cm9sLnJ1bigpXG4gICAgICB0aGlzLmlzUnVubmluZyA9IHRydWVcbiAgICAgIHRoaXMuZGVidWcubG9nKCdzdGFydGVkJylcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICog0J7RgdGC0LDQvdCw0LLQu9C40LLQsNC10YIg0YDQtdC90LTQtdGA0LjQvdCzINC4INC60L7QvdGC0YDQvtC70Ywg0YPQv9GA0LDQstC70LXQvdC40Y8uXG4gICAqL1xuICBwdWJsaWMgc3RvcCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5pc1J1bm5pbmcpIHtcbiAgICAgIHRoaXMuY29udHJvbC5zdG9wKClcbiAgICAgIHRoaXMuaXNSdW5uaW5nID0gZmFsc2VcbiAgICAgIHRoaXMuZGVidWcubG9nKCdzdG9wZWQnKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDQntGH0LjRidCw0LXRgiDRhNC+0L0uXG4gICAqL1xuICBwdWJsaWMgY2xlYXIoKTogdm9pZCB7XG4gICAgdGhpcy53ZWJnbC5jbGVhckJhY2tncm91bmQoKVxuICAgIHRoaXMuZGVidWcubG9nKCdjbGVhcmVkJylcbiAgfVxufVxuIiwiXG4vKipcbiAqINCf0YDQvtCy0LXRgNGP0LXRgiDRj9Cy0LvRj9C10YLRgdGPINC70Lgg0L/QtdGA0LXQvNC10L3QvdCw0Y8g0Y3QutC30LXQvNC/0LvRj9GA0L7QvCDQutCw0LrQvtCz0L4t0LvQuNCx0L7QviDQutC70LDRgdGB0LAuXG4gKlxuICogQHBhcmFtIHZhbCAtINCf0YDQvtCy0LXRgNGP0LXQvNCw0Y8g0L/QtdGA0LXQvNC10L3QvdCw0Y8uXG4gKiBAcmV0dXJucyDQoNC10LfRg9C70YzRgtCw0YIg0L/RgNC+0LLQtdGA0LrQuC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzT2JqZWN0KG9iajogYW55KTogYm9vbGVhbiB7XG4gIHJldHVybiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IE9iamVjdF0nKVxufVxuXG4vKipcbiAqINCf0LXRgNC10L7Qv9GA0LXQtNC10LvRj9C10YIg0LfQvdCw0YfQtdC90LjRjyDQv9C+0LvQtdC5INC+0LHRitC10LrRgtCwIHRhcmdldCDQvdCwINC30L3QsNGH0LXQvdC40Y8g0L/QvtC70LXQuSDQvtCx0YrQtdC60YLQsCBzb3VyY2UuINCf0LXRgNC10L7Qv9GA0LXQtNC10LvRj9GO0YLRgdGPINGC0L7Qu9GM0LrQviDRgtC1INC/0L7Qu9GPLFxuICog0LrQvtGC0L7RgNGL0LUg0YHRg9GJ0LXRgdGC0LLRg9C10Y7RgiDQsiB0YXJnZXQuINCV0YHQu9C4INCyIHNvdXJjZSDQtdGB0YLRjCDQv9C+0LvRjywg0LrQvtGC0L7RgNGL0YUg0L3QtdGCINCyIHRhcmdldCwg0YLQviDQvtC90Lgg0LjQs9C90L7RgNC40YDRg9GO0YLRgdGPLiDQldGB0LvQuCDQutCw0LrQuNC1LdGC0L4g0L/QvtC70Y9cbiAqINGB0LDQvNC4INGP0LLQu9GP0Y7RgtGB0Y8g0Y/QstC70Y/RjtGC0YHRjyDQvtCx0YrQtdC60YLQsNC80LgsINGC0L4g0YLQviDQvtC90Lgg0YLQsNC60LbQtSDRgNC10LrRg9GA0YHQuNCy0L3QviDQutC+0L/QuNGA0YPRjtGC0YHRjyAo0L/RgNC4INGC0L7QvCDQttC1INGD0YHQu9C+0LLQuNC4LCDRh9GC0L4g0LIg0YbQtdC70LXQvtC8INC+0LHRitC10LrRgtC1XG4gKiDRgdGD0YnQtdGB0YLQstGD0Y7RgiDQv9C+0LvRjyDQvtCx0YrQtdC60YLQsC3QuNGB0YLQvtGH0L3QuNC60LApLlxuICpcbiAqIEBwYXJhbSB0YXJnZXQgLSDQptC10LvQtdCy0L7QuSAo0LjQt9C80LXQvdGP0LXQvNGL0LkpINC+0LHRitC10LrRgi5cbiAqIEBwYXJhbSBzb3VyY2UgLSDQntCx0YrQtdC60YIg0YEg0LTQsNC90L3Ri9C80LgsINC60L7RgtC+0YDRi9C1INC90YPQttC90L4g0YPRgdGC0LDQvdC+0LLQuNGC0Ywg0YMg0YbQtdC70LXQstC+0LPQviDQvtCx0YrQtdC60YLQsC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvcHlNYXRjaGluZ0tleVZhbHVlcyh0YXJnZXQ6IGFueSwgc291cmNlOiBhbnkpOiB2b2lkIHtcbiAgT2JqZWN0LmtleXMoc291cmNlKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgaWYgKGtleSBpbiB0YXJnZXQpIHtcbiAgICAgIGlmIChpc09iamVjdChzb3VyY2Vba2V5XSkpIHtcbiAgICAgICAgaWYgKGlzT2JqZWN0KHRhcmdldFtrZXldKSkge1xuICAgICAgICAgIGNvcHlNYXRjaGluZ0tleVZhbHVlcyh0YXJnZXRba2V5XSwgc291cmNlW2tleV0pXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghaXNPYmplY3QodGFyZ2V0W2tleV0pICYmICh0eXBlb2YgdGFyZ2V0W2tleV0gIT09ICdmdW5jdGlvbicpKSB7XG4gICAgICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KVxufVxuXG4vKipcbiAqINCS0L7Qt9Cy0YDQsNGJ0LDQtdGCINGB0LvRg9GH0LDQudC90L7QtSDRhtC10LvQvtC1INGH0LjRgdC70L4g0LIg0LTQuNCw0L/QsNC30L7QvdC1OiBbMC4uLnJhbmdlLTFdLlxuICpcbiAqIEBwYXJhbSByYW5nZSAtINCS0LXRgNGF0L3QuNC5INC/0YDQtdC00LXQuyDQtNC40LDQv9Cw0LfQvtC90LAg0YHQu9GD0YfQsNC50L3QvtCz0L4g0LLRi9Cx0L7RgNCwLlxuICogQHJldHVybnMg0KHQu9GD0YfQsNC50L3QvtC1INGH0LjRgdC70L4uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByYW5kb21JbnQocmFuZ2U6IG51bWJlcik6IG51bWJlciB7XG4gIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiByYW5nZSlcbn1cblxuLyoqXG4gKiDQn9GA0LXQvtCx0YDQsNC30YPQtdGCINC+0LHRitC10LrRgiDQsiDRgdGC0YDQvtC60YMgSlNPTi4g0JjQvNC10LXRgiDQvtGC0LvQuNGH0LjQtSDQvtGCINGB0YLQsNC90LTQsNGA0YLQvdC+0Lkg0YTRg9C90LrRhtC40LggSlNPTi5zdHJpbmdpZnkgLSDQv9C+0LvRjyDQvtCx0YrQtdC60YLQsCwg0LjQvNC10Y7RidC40LVcbiAqINC30L3QsNGH0LXQvdC40Y8g0YTRg9C90LrRhtC40Lkg0L3QtSDQv9GA0L7Qv9GD0YHQutCw0Y7RgtGB0Y8sINCwINC/0YDQtdC+0LHRgNCw0LfRg9GO0YLRgdGPINCyINC90LDQt9Cy0LDQvdC40LUg0YTRg9C90LrRhtC40LguXG4gKlxuICogQHBhcmFtIG9iaiAtINCm0LXQu9C10LLQvtC5INC+0LHRitC10LrRgi5cbiAqIEByZXR1cm5zINCh0YLRgNC+0LrQsCBKU09OLCDQvtGC0L7QsdGA0LDQttCw0Y7RidCw0Y8g0L7QsdGK0LXQutGCLlxuICovXG5leHBvcnQgZnVuY3Rpb24ganNvblN0cmluZ2lmeShvYmo6IGFueSk6IHN0cmluZyB7XG4gIHJldHVybiBKU09OLnN0cmluZ2lmeShcbiAgICBvYmosXG4gICAgZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICAgIHJldHVybiAodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKSA/IHZhbHVlLm5hbWUgOiB2YWx1ZVxuICAgIH0sXG4gICAgJyAnXG4gIClcbn1cblxuLyoqXG4gKiDQmtC+0L3QstC10YDRgtC40YDRg9C10YIg0YbQstC10YIg0LjQtyBIRVgt0L/RgNC10LTRgdGC0LDQstC70LXQvdC40Y8g0LIg0L/RgNC10LTRgdGC0LDQstC70LXQvdC40LUg0YbQstC10YLQsCDQtNC70Y8gR0xTTC3QutC+0LTQsCAoUkdCINGBINC00LjQsNC/0LDQt9C+0L3QsNC80Lgg0LfQvdCw0YfQtdC90LjQuSDQvtGCIDAg0LTQviAxKS5cbiAqXG4gKiBAcGFyYW0gaGV4Q29sb3IgLSDQptCy0LXRgiDQsiBIRVgt0YTQvtGA0LzQsNGC0LUuXG4gKiBAcmV0dXJucyDQnNCw0YHRgdC40LIg0LjQtyDRgtGA0LXRhSDRh9C40YHQtdC7INCyINC00LjQsNC/0LDQt9C+0L3QtSDQvtGCIDAg0LTQviAxLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY29sb3JGcm9tSGV4VG9HbFJnYihoZXhDb2xvcjogc3RyaW5nKTogbnVtYmVyW10ge1xuXG4gIGxldCBrID0gL14jPyhbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KSQvaS5leGVjKGhleENvbG9yKVxuICBsZXQgW3IsIGcsIGJdID0gW3BhcnNlSW50KGshWzFdLCAxNikgLyAyNTUsIHBhcnNlSW50KGshWzJdLCAxNikgLyAyNTUsIHBhcnNlSW50KGshWzNdLCAxNikgLyAyNTVdXG5cbiAgcmV0dXJuIFtyLCBnLCBiXVxufVxuXG4vKipcbiAqINCS0YvRh9C40YHQu9GP0LXRgiDRgtC10LrRg9GJ0LXQtSDQstGA0LXQvNGPLlxuICpcbiAqIEByZXR1cm5zINCh0YLRgNC+0LrQvtCy0LDRjyDRhNC+0YDQvNCw0YLQuNGA0L7QstCw0L3QvdCw0Y8g0LfQsNC/0LjRgdGMINGC0LXQutGD0YnQtdCz0L4g0LLRgNC10LzQtdC90LguINCk0L7RgNC80LDRgjogaGg6bW06c3NcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEN1cnJlbnRUaW1lKCk6IHN0cmluZyB7XG5cbiAgbGV0IHRvZGF5ID0gbmV3IERhdGUoKTtcblxuICBsZXQgdGltZSA9XG4gICAgKCh0b2RheS5nZXRIb3VycygpIDwgMTAgPyAnMCcgOiAnJykgKyB0b2RheS5nZXRIb3VycygpKSArIFwiOlwiICtcbiAgICAoKHRvZGF5LmdldE1pbnV0ZXMoKSA8IDEwID8gJzAnIDogJycpICsgdG9kYXkuZ2V0TWludXRlcygpKSArIFwiOlwiICtcbiAgICAoKHRvZGF5LmdldFNlY29uZHMoKSA8IDEwID8gJzAnIDogJycpICsgdG9kYXkuZ2V0U2Vjb25kcygpKVxuXG4gIHJldHVybiB0aW1lXG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9pbmRleC50c1wiKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=