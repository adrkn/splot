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
/** ************************************************************************* */
var n = 1000000;
var colors = ['#D81C01', '#E9967A', '#BA55D3', '#FFD700', '#FFE4B5', '#FF8C00', '#228B22', '#90EE90', '#4169E1', '#00BFFF', '#8B4513', '#00CED1'];
var width = 32000;
var height = 16000;
/** Синтетическая итерирующая функция. */
var i = 0;
function readNextObject() {
    if (i < n) {
        i++;
        return {
            x: utils_1.randomInt(width),
            y: utils_1.randomInt(height),
            shape: utils_1.randomInt(3),
            size: 10 + utils_1.randomInt(21),
            color: utils_1.randomInt(colors.length)
        };
    }
    else {
        i = 0;
        return null; // Возвращаем null, когда объекты "закончились".
    }
}
/** ************************************************************************* */
var scatterPlot = new splot_1.default('canvas1');
scatterPlot.setup({
    iterator: readNextObject,
    colors: colors,
    grid: {
        width: width,
        height: height
    },
    debug: {
        isEnable: true,
    },
    demo: {
        isEnable: false
    }
});
scatterPlot.run();
//setTimeout(() => scatterPlot.stop(), 3000)


/***/ }),

/***/ "./math3x3.ts":
/*!********************!*\
  !*** ./math3x3.ts ***!
  \********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.inverse = exports.transformPoint = exports.scale = exports.scaling = exports.translate = exports.translation = exports.projection = exports.identity = exports.multiply = void 0;
/**
 * Умножает матрицы.
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
 * Создает единичную матрицу.
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

/***/ "./shaders.ts":
/*!********************!*\
  !*** ./shaders.ts ***!
  \********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FRAGMENT_TEMPLATE = exports.VERTEX_TEMPLATE = void 0;
exports.VERTEX_TEMPLATE = "\nattribute vec2 a_position;\nattribute float a_color;\nattribute float a_size;\nattribute float a_shape;\nuniform mat3 u_matrix;\nvarying vec3 v_color;\nvarying float v_shape;\nvoid main() {\n  gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0.0, 1.0);\n  gl_PointSize = a_size;\n  v_shape = a_shape;\n  {COLOR-CODE}\n}\n";
exports.FRAGMENT_TEMPLATE = "\nprecision lowp float;\nvarying vec3 v_color;\nvarying float v_shape;\nvoid main() {\n  if (v_shape == 0.0) {\n    if (length(gl_PointCoord - 0.5) > 0.5) { discard; };\n  } else if (v_shape == 1.0) {\n\n  } else if (v_shape == 2.0) {\n    if ( ((gl_PointCoord.x < 0.3) && (gl_PointCoord.y < 0.3)) ||\n      ((gl_PointCoord.x > 0.7) && (gl_PointCoord.y < 0.3)) ||\n      ((gl_PointCoord.x > 0.7) && (gl_PointCoord.y > 0.7)) ||\n      ((gl_PointCoord.x < 0.3) && (gl_PointCoord.y > 0.7)) )\n      { discard; };\n  }\n  gl_FragColor = vec4(v_color.rgb, 1.0);\n}\n";


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
var m3 = __importStar(__webpack_require__(/*! ./math3x3 */ "./math3x3.ts"));
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
        /** Обработчики событий с закрепленными контекстами. */
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
     * Создает матрицу для текущего положения области просмотра.
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
        /** Расчет положения канваса по отношению к мыши. */
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
     * Перемещает область видимости.
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
        /** Расчет трансформаций. */
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
        /** Вычисление позиции мыши в GL-координатах. */
        var _a = this.getClipSpaceMousePosition(event), clipX = _a[0], clipY = _a[1];
        /** Позиция мыши до зумирования. */
        var _b = m3.transformPoint(m3.inverse(this.transform.viewProjectionMat), [clipX, clipY]), preZoomX = _b[0], preZoomY = _b[1];
        /** Новое значение зума области просмотра экспоненциально зависит от величины зумирования мыши. */
        var newZoom = this.splot.camera.zoom * Math.pow(2, event.deltaY * -0.01);
        /** Максимальное и минимальное значения зума области просмотра. */
        this.splot.camera.zoom = Math.max(0.002, Math.min(200, newZoom));
        /** Обновление матрицы трансформации. */
        this.updateViewProjection();
        /** Позиция мыши после зумирования. */
        var _c = m3.transformPoint(m3.inverse(this.transform.viewProjectionMat), [clipX, clipY]), postZoomX = _c[0], postZoomY = _c[1];
        /** Вычисление нового положения области просмотра после зумирования. */
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
     * Отладочная информация выводится блоками. Названия блоков передаются в метод перечислением строк. Каждая строка
     * интерпретируется как имя метода. Если нужные методы вывода блока существуют - они вызываются. Если метода с нужным
     * названием не существует - генерируется ошибка.
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
     * Выводит сообщение об ошибке.
     */
    SPlotDebug.prototype.error = function (message) {
        if (this.isEnable) {
            console.error(message);
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
        console.log(this.splot.glsl.vertShaderSource);
        console.groupEnd();
        console.group('%cСоздан фрагментный шейдер: ', this.groupStyle);
        console.log(this.splot.glsl.fragShaderSource);
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
        console.log('Кол-во объектов: ' + this.splot.stats.objTotalCount.toLocaleString());
        console.log('Кол-во групп буферов: ' + this.splot.stats.groupsCount.toLocaleString());
        console.log('Результат: ' + ((this.splot.stats.objTotalCount >= this.splot.globalLimit) ?
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
        /** Обнуление счетчика итератора. */
        this.index = 0;
        /** Подготовка демо-режима (если требуется). */
        if (this.splot.demo.isEnable) {
            this.splot.iterator = this.splot.demo.iterator.bind(this);
            this.splot.colors = this.splot.demo.colors;
        }
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

/***/ "./splot-glsl.ts":
/*!***********************!*\
  !*** ./splot-glsl.ts ***!
  \***********************/
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
var shaders = __importStar(__webpack_require__(/*! ./shaders */ "./shaders.ts"));
var utils_1 = __webpack_require__(/*! ./utils */ "./utils.ts");
/** ****************************************************************************
 *
 * Класс-хелпер, управляющий GLSL-кодом шейдеров.
 */
var SPlotGlsl = /** @class */ (function () {
    /** Хелпер будет иметь полный доступ к экземпляру SPlot. */
    function SPlotGlsl(splot) {
        this.splot = splot;
        /** Коды шейдеров. */
        this.vertShaderSource = '';
        this.fragShaderSource = '';
    }
    /** ****************************************************************************
     *
     * Подготавливает хелпер к использованию.
     */
    SPlotGlsl.prototype.setup = function () {
        /** Сборка кодов шейдеров. */
        this.vertShaderSource = this.makeVertShaderSource();
        this.fragShaderSource = this.makeFragShaderSource();
    };
    /** ****************************************************************************
     *
     * Создает код вершинного шейдера.
     */
    SPlotGlsl.prototype.makeVertShaderSource = function () {
        return shaders.VERTEX_TEMPLATE.replace('{COLOR-CODE}', this.makeColorSource()).trim();
    };
    /** ****************************************************************************
     *
     * Создает код вершинного шейдера.
     */
    SPlotGlsl.prototype.makeFragShaderSource = function () {
        return shaders.FRAGMENT_TEMPLATE.trim();
    };
    /** ****************************************************************************
     *
     * Создает дополнение к коду, устанавливающее цвет объекта по индексу цвета.
     *
     * @remarks
     * Т.к. шейдер не позволяет использовать в качестве индексов переменные - для задания цвета используется
     * последовательный перебор цветовых индексов.
     *
     * @returns Код дополнения.
     */
    SPlotGlsl.prototype.makeColorSource = function () {
        /** Временное добавление в палитру вершин цвета направляющих. */
        this.splot.colors.push(this.splot.grid.rulesColor);
        var code = '';
        /** Формировние кода установки цвета по индексу. */
        this.splot.colors.forEach(function (value, index) {
            var _a = utils_1.colorFromHexToGlRgb(value), r = _a[0], g = _a[1], b = _a[2];
            code += "else if (a_color == " + index + ".0) v_color = vec3(" + r + ", " + g + ", " + b + ");\n";
        });
        /** Удаление из палитры вершин временно добавленного цвета направляющих. */
        this.splot.colors.pop();
        /** Удаление лишнего "else" в начале кода. */
        return code.slice(5);
    };
    return SPlotGlsl;
}());
exports.default = SPlotGlsl;


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
        /** Если задан размер плоскости, но не задано положение области просмотра, то она помещается в центр плоскости. */
        if (('grid' in this.splot.lastRequestedOptions) && !('camera' in this.splot.lastRequestedOptions)) {
            this.splot.camera.x = this.splot.grid.width / 2;
            this.splot.camera.y = this.splot.grid.height / 2;
        }
        /** Установка фонового цвета канваса (цвет очистки контекста рендеринга). */
        this.setBgColor(this.splot.grid.bgColor);
        /** Создание программы WebGL. */
        this.createProgram(this.splot.glsl.vertShaderSource, this.splot.glsl.fragShaderSource);
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
    };
    /** ****************************************************************************
     *
     * Создает программу WebGL из GLSL-кодов шейдеров.
     *
     * @param shaderCodeVert - Код вершинного шейдера.
     * @param shaderCodeFrag - Код фрагментного шейдера.
     */
    SPlotWebGl.prototype.createProgram = function (shaderCodeVert, shaderCodeFrag) {
        this.splot.debug.log('shaders');
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
var splot_control_1 = __importDefault(__webpack_require__(/*! ./splot-control */ "./splot-control.ts"));
var splot_webgl_1 = __importDefault(__webpack_require__(/*! ./splot-webgl */ "./splot-webgl.ts"));
var splot_debug_1 = __importDefault(__webpack_require__(/*! ./splot-debug */ "./splot-debug.ts"));
var splot_demo_1 = __importDefault(__webpack_require__(/*! ./splot-demo */ "./splot-demo.ts"));
var splot_glsl_1 = __importDefault(__webpack_require__(/*! ./splot-glsl */ "./splot-glsl.ts"));
/** ****************************************************************************
 *
 * Класс SPlot - реализует график типа скаттерплот средствами WebGL.
 */
var SPlot = /** @class */ (function () {
    /** ****************************************************************************
     *
     * Создает экземпляр класса, инициализирует настройки (если переданы).
     *
     * @remarks
     * Если канвас с заданным идентификатором не найден - генерируется ошибка. Настройки могут быть заданы как в
     * конструкторе, так и в методе {@link setup}. В любом случае настройки должны быть заданы до запуска рендера.
     *
     * @param canvasId - Идентификатор канваса, на котором будет рисоваться график.
     * @param options - Пользовательские настройки экземпляра.
     */
    function SPlot(canvasId, options) {
        /** Функция итерирования исходных данных. */
        this.iterator = undefined;
        /** Хелпер режима отладки. */
        this.debug = new splot_debug_1.default(this);
        /** Хелпер, управляющий GLSL-кодом шейдеров. */
        this.glsl = new splot_glsl_1.default(this);
        /** Хелпер WebGL. */
        this.webgl = new splot_webgl_1.default(this);
        /** Хелпер режима демо-данных. */
        this.demo = new splot_demo_1.default(this);
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
        this.shapesCount = 3;
        /** Статистическая информация. */
        this.stats = {
            objTotalCount: 0,
            objInGroupCount: [],
            groupsCount: 0,
            memUsage: 0
        };
        /** Настройки, запрошенные пользователем в конструкторе или при последнем вызове setup. */
        this.lastRequestedOptions = {};
        /** Хелпер взаимодействия с устройством ввода. */
        this.control = new splot_control_1.default(this);
        /** Признак того, что экземпляр класса был корректно подготовлен к рендеру. */
        this.isSetuped = false;
        if (document.getElementById(canvasId)) {
            this.canvas = document.getElementById(canvasId);
        }
        else {
            throw new Error('Канвас с идентификатором "#' + canvasId + '" не найден!');
        }
        if (options) {
            /** Если переданы пользовательские настройки, то они применяются. */
            utils_1.copyMatchingKeyValues(this, options);
            this.lastRequestedOptions = options;
            /** Инициализация всех параметров рендера, если запрошен форсированный запуск. */
            if (this.forceRun) {
                this.setup(options);
            }
        }
    }
    /** ****************************************************************************
     *
     * Инициализирует необходимые для рендера параметры экземпляра, выполняет подготовку и заполнение буферов WebGL.
     *
     * @param options - Настройки экземпляра.
     */
    SPlot.prototype.setup = function (options) {
        if (options === void 0) { options = {}; }
        /** Признак того, что экземпляр как минимум один раз выполнил метод setup. */
        this.isSetuped = true;
        /** Применение пользовательских настроек. */
        utils_1.copyMatchingKeyValues(this, options);
        this.lastRequestedOptions = options;
        /** Проверка корректности настройки экземпляра. */
        this.checkSetup();
        this.debug.log('intro');
        /** Подготовка всех хелперов. */
        this.debug.setup();
        this.glsl.setup();
        this.webgl.setup();
        this.control.setup();
        this.demo.setup();
        this.debug.log('instance');
        /** Создание переменных WebGl. */
        this.webgl.createVariables('a_position', 'a_color', 'a_size', 'a_shape', 'u_matrix');
        /** Обработка всех данных об объектах и их загрузка в буферы видеопамяти. */
        this.loadData();
        if (this.forceRun) {
            /** Форсированный запуск рендеринга (если требуется). */
            this.run();
        }
    };
    /** ****************************************************************************
     *
     * Создает и заполняет данными обо всех объектах буферы WebGL.
     */
    SPlot.prototype.loadData = function () {
        this.debug.log('loading');
        var groups = { vertices: [], colors: [], sizes: [], shapes: [] };
        this.stats = { objTotalCount: 0, objInGroupCount: [], groupsCount: 0, memUsage: 0 };
        var object;
        var i = 0;
        var isObjectEnds = false;
        while (!isObjectEnds) {
            object = this.iterator();
            isObjectEnds = (object === null) || (this.stats.objTotalCount >= this.globalLimit);
            if (!isObjectEnds) {
                groups.vertices.push(object.x, object.y);
                groups.shapes.push(object.shape);
                groups.sizes.push(object.size);
                groups.colors.push(object.color);
                this.stats.objTotalCount++;
                i++;
            }
            if ((i >= this.groupLimit) || isObjectEnds) {
                this.stats.objInGroupCount[this.stats.groupsCount] = i;
                /** Создание и заполнение буферов данными о текущей группе объектов. */
                this.stats.memUsage +=
                    this.webgl.createBuffer('vertices', new Float32Array(groups.vertices)) +
                        this.webgl.createBuffer('colors', new Uint8Array(groups.colors)) +
                        this.webgl.createBuffer('shapes', new Uint8Array(groups.shapes)) +
                        this.webgl.createBuffer('sizes', new Float32Array(groups.sizes));
            }
            if ((i >= this.groupLimit) && !isObjectEnds) {
                this.stats.groupsCount++;
                groups = { vertices: [], colors: [], sizes: [], shapes: [] };
                i = 0;
            }
        }
        this.debug.log('loaded');
    };
    /** ****************************************************************************
     *
     * Производит рендеринг графика в соответствии с текущими параметрами трансформации.
     */
    SPlot.prototype.render = function () {
        /** Очистка объекта рендеринга WebGL. */
        this.webgl.clearBackground();
        /** Обновление матрицы трансформации. */
        this.control.updateViewProjection();
        /** Привязка матрицы трансформации к переменной шейдера. */
        this.webgl.setVariable('u_matrix', this.control.transform.viewProjectionMat);
        /** Итерирование и рендеринг групп буферов WebGL. */
        for (var i = 0; i < this.stats.groupsCount; i++) {
            this.webgl.setBuffer('vertices', i, 'a_position', 2, 0, 0);
            this.webgl.setBuffer('colors', i, 'a_color', 1, 0, 0);
            this.webgl.setBuffer('sizes', i, 'a_size', 1, 0, 0);
            this.webgl.setBuffer('shapes', i, 'a_shape', 1, 0, 0);
            this.webgl.drawPoints(0, this.stats.objInGroupCount[i]);
        }
    };
    /** ****************************************************************************
     *
     * Проверяет корректность настроек экземпляра.
     *
     * @remarks
     * Используется для проверки корректности логики работы пользователя с экземпляром. Не позволяет работать с
     * ненастроенным или некорректно настроенным экземпляром.
     */
    SPlot.prototype.checkSetup = function () {
        /**
         *  Пользователь мог настроить экземпляр в конструкторе и сразу запустить рендер, в таком случае метод setup
         *  будет вызывается неявно.
         */
        if (!this.isSetuped) {
            this.setup();
        }
        /** Набор проверок корректности настройки экземпляра. */
        if (!this.iterator) {
            throw new Error('Не задана функция итерирования объектов!');
        }
    };
    /** ****************************************************************************
     *
     * Запускает рендеринг и контроль управления.
     */
    SPlot.prototype.run = function () {
        this.checkSetup();
        if (!this.isRunning) {
            this.render();
            this.control.run();
            this.isRunning = true;
            this.debug.log('started');
        }
    };
    /** ****************************************************************************
     *
     * Останавливает рендеринг и контроль управления.
     */
    SPlot.prototype.stop = function () {
        this.checkSetup();
        if (this.isRunning) {
            this.control.stop();
            this.isRunning = false;
            this.debug.log('stoped');
        }
    };
    /** ****************************************************************************
     *
     * Очищает фон.
     */
    SPlot.prototype.clear = function () {
        this.checkSetup();
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
exports.getCurrentTime = exports.colorFromHexToGlRgb = exports.randomInt = exports.copyMatchingKeyValues = exports.isObject = void 0;
/** ****************************************************************************
 *
 * Проверяет является ли переменная экземпляром какого-либоо класса.
 *
 * @param variable - Проверяемая переменная.
 * @returns Результат проверки.
 */
function isObject(variable) {
    return (Object.prototype.toString.call(variable) === '[object Object]');
}
exports.isObject = isObject;
/** ****************************************************************************
 *
 * Переопределяет значения полей объекта target на значения полей объекта source.
 *
 * @remarks
 * Переопределяются только те поля, которые существуеют в target. Если в source есть поля, которых нет в target, то они
 * игнорируются. Если какие-то поля сами являются являются объектами, то то они также рекурсивно копируются (при том же
 * условии, что в целевом объекте существуют поля объекта-источника).
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
/** ****************************************************************************
 *
 * Возвращает случайное целое число в диапазоне: [0...range-1].
 *
 * @param range - Верхний предел диапазона случайного выбора.
 * @returns Случайное число.
 */
function randomInt(range) {
    return Math.floor(Math.random() * range);
}
exports.randomInt = randomInt;
/** ****************************************************************************
 *
 * Конвертирует цвет из HEX-формата в GLSL-формат.
 *
 * @param hexColor - Цвет в HEX-формате ("#ffffff").
 * @returns Массив из трех чисел в диапазоне от 0 до 1.
 */
function colorFromHexToGlRgb(hexColor) {
    var k = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor);
    var _a = [parseInt(k[1], 16) / 255, parseInt(k[2], 16) / 255, parseInt(k[3], 16) / 255], r = _a[0], g = _a[1], b = _a[2];
    return [r, g, b];
}
exports.colorFromHexToGlRgb = colorFromHexToGlRgb;
/** ****************************************************************************
 *
 * Возвращает строковую запись текущего времени.
 *
 * @returns Строка времени в формате "hh:mm:ss".
 */
function getCurrentTime() {
    var today = new Date();
    return [
        today.getHours().toString().padStart(2, '0'),
        today.getMinutes().toString().padStart(2, '0'),
        today.getSeconds().toString().padStart(2, '0')
    ].join(':');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zdHlsZS5jc3MiLCJ3ZWJwYWNrOi8vLy4vaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vbWF0aDN4My50cyIsIndlYnBhY2s6Ly8vLi9zaGFkZXJzLnRzIiwid2VicGFjazovLy8uL3NwbG90LWNvbnRyb2wudHMiLCJ3ZWJwYWNrOi8vLy4vc3Bsb3QtZGVidWcudHMiLCJ3ZWJwYWNrOi8vLy4vc3Bsb3QtZGVtby50cyIsIndlYnBhY2s6Ly8vLi9zcGxvdC1nbHNsLnRzIiwid2VicGFjazovLy8uL3NwbG90LXdlYmdsLnRzIiwid2VicGFjazovLy8uL3NwbG90LnRzIiwid2VicGFjazovLy8uL3V0aWxzLnRzIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly8vd2VicGFjay9zdGFydHVwIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBQSwrREFBbUM7QUFDbkMsZ0ZBQTJCO0FBQzNCLGtEQUFnQjtBQUVoQixnRkFBZ0Y7QUFFaEYsSUFBSSxDQUFDLEdBQUcsT0FBUztBQUNqQixJQUFJLE1BQU0sR0FBRyxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDO0FBQ2pKLElBQUksS0FBSyxHQUFHLEtBQU07QUFDbEIsSUFBSSxNQUFNLEdBQUcsS0FBTTtBQUVuQix5Q0FBeUM7QUFDekMsSUFBSSxDQUFDLEdBQUcsQ0FBQztBQUNULFNBQVMsY0FBYztJQUNyQixJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDVCxDQUFDLEVBQUU7UUFDSCxPQUFPO1lBQ0wsQ0FBQyxFQUFFLGlCQUFTLENBQUMsS0FBSyxDQUFDO1lBQ25CLENBQUMsRUFBRSxpQkFBUyxDQUFDLE1BQU0sQ0FBQztZQUNwQixLQUFLLEVBQUUsaUJBQVMsQ0FBQyxDQUFDLENBQUM7WUFDbkIsSUFBSSxFQUFFLEVBQUUsR0FBRyxpQkFBUyxDQUFDLEVBQUUsQ0FBQztZQUN4QixLQUFLLEVBQUUsaUJBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO1NBQ2hDO0tBQ0Y7U0FBTTtRQUNMLENBQUMsR0FBRyxDQUFDO1FBQ0wsT0FBTyxJQUFJLEVBQUUsZ0RBQWdEO0tBQzlEO0FBQ0gsQ0FBQztBQUVELGdGQUFnRjtBQUVoRixJQUFJLFdBQVcsR0FBRyxJQUFJLGVBQUssQ0FBQyxTQUFTLENBQUM7QUFFdEMsV0FBVyxDQUFDLEtBQUssQ0FBQztJQUNoQixRQUFRLEVBQUUsY0FBYztJQUN4QixNQUFNLEVBQUUsTUFBTTtJQUNkLElBQUksRUFBRTtRQUNKLEtBQUssRUFBRSxLQUFLO1FBQ1osTUFBTSxFQUFFLE1BQU07S0FDZjtJQUNELEtBQUssRUFBRTtRQUNMLFFBQVEsRUFBRSxJQUFJO0tBQ2Y7SUFDRCxJQUFJLEVBQUU7UUFDSixRQUFRLEVBQUUsS0FBSztLQUNoQjtDQUNGLENBQUM7QUFFRixXQUFXLENBQUMsR0FBRyxFQUFFO0FBRWpCLDRDQUE0Qzs7Ozs7Ozs7Ozs7Ozs7QUNqRDVDOztHQUVHO0FBQ0gsU0FBZ0IsUUFBUSxDQUFDLENBQVcsRUFBRSxDQUFXO0lBQy9DLE9BQU87UUFDTCxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUN4QztBQUNILENBQUM7QUFaRCw0QkFZQztBQUVEOztHQUVHO0FBQ0gsU0FBZ0IsUUFBUTtJQUN0QixPQUFPO1FBQ0wsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO1FBQ1AsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO1FBQ1AsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO0tBQ1I7QUFDSCxDQUFDO0FBTkQsNEJBTUM7QUFFRDs7O0dBR0c7QUFDSCxTQUFnQixVQUFVLENBQUMsS0FBYSxFQUFFLE1BQWM7SUFDdEQsT0FBTztRQUNMLENBQUMsR0FBRyxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUM7UUFDZixDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsTUFBTSxFQUFFLENBQUM7UUFDakIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7S0FDVDtBQUNILENBQUM7QUFORCxnQ0FNQztBQUVEOztHQUVHO0FBQ0gsU0FBZ0IsV0FBVyxDQUFDLEVBQVUsRUFBRSxFQUFVO0lBQ2hELE9BQU87UUFDTCxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7UUFDUCxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7UUFDUCxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7S0FDVjtBQUNILENBQUM7QUFORCxrQ0FNQztBQUVEOztHQUVHO0FBQ0gsU0FBZ0IsU0FBUyxDQUFDLENBQVcsRUFBRSxFQUFVLEVBQUUsRUFBVTtJQUMzRCxPQUFPLFFBQVEsQ0FBQyxDQUFDLEVBQUUsV0FBVyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUN6QyxDQUFDO0FBRkQsOEJBRUM7QUFFRDs7R0FFRztBQUNILFNBQWdCLE9BQU8sQ0FBQyxFQUFVLEVBQUUsRUFBVTtJQUM1QyxPQUFPO1FBQ0wsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDO1FBQ1IsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDO1FBQ1IsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO0tBQ1I7QUFDSCxDQUFDO0FBTkQsMEJBTUM7QUFFRDs7R0FFRztBQUNILFNBQWdCLEtBQUssQ0FBQyxDQUFXLEVBQUUsRUFBVSxFQUFFLEVBQVU7SUFDdkQsT0FBTyxRQUFRLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDckMsQ0FBQztBQUZELHNCQUVDO0FBRUQsU0FBZ0IsY0FBYyxDQUFDLENBQVcsRUFBRSxDQUFXO0lBQ3JELElBQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFDLE9BQU87UUFDTCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO1FBQ3RDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7S0FDdkM7QUFDSCxDQUFDO0FBTkQsd0NBTUM7QUFFRCxTQUFnQixPQUFPLENBQUMsQ0FBVztJQUNqQyxJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3JDLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckMsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNyQyxJQUFNLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztJQUN0RCxPQUFPO1FBQ0osQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEdBQUc7UUFDM0IsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQy9CLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMvQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDakM7QUFDSCxDQUFDO0FBZEQsMEJBY0M7Ozs7Ozs7Ozs7Ozs7O0FDbkdZLHVCQUFlLEdBQzVCLDRVQWNDO0FBQ1kseUJBQWlCLEdBQzlCLG1qQkFrQkM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbENELDRFQUErQjtBQUUvQjs7OztHQUlHO0FBQ0g7SUFrQkUsMkRBQTJEO0lBQzNELHFCQUNXLEtBQVk7UUFBWixVQUFLLEdBQUwsS0FBSyxDQUFPO1FBbEJ2QixrRkFBa0Y7UUFDM0UsY0FBUyxHQUFtQjtZQUNqQyxpQkFBaUIsRUFBRSxFQUFFO1lBQ3JCLG1CQUFtQixFQUFFLEVBQUU7WUFDdkIsV0FBVyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUU7WUFDcEMsUUFBUSxFQUFFLEVBQUU7WUFDWixZQUFZLEVBQUUsRUFBRTtZQUNoQixhQUFhLEVBQUUsRUFBRTtTQUNsQjtRQUVELHVEQUF1RDtRQUM3QywrQkFBMEIsR0FBa0IsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFrQjtRQUM1RixnQ0FBMkIsR0FBa0IsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQWtCO1FBQzlGLCtCQUEwQixHQUFrQixJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQWtCO1FBQzVGLDZCQUF3QixHQUFrQixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQWtCO0lBSzlGLENBQUM7SUFFTDs7O09BR0c7SUFDSCwyQkFBSyxHQUFMO0lBRUEsQ0FBQztJQUVEOzs7T0FHRztJQUNJLHlCQUFHLEdBQVY7UUFDRSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLDBCQUEwQixDQUFDO1FBQ2hGLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsMkJBQTJCLENBQUM7SUFDL0UsQ0FBQztJQUVEOzs7T0FHRztJQUNJLDBCQUFJLEdBQVg7UUFDRSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLDBCQUEwQixDQUFDO1FBQ25GLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsMkJBQTJCLENBQUM7UUFDaEYsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsbUJBQW1CLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQywwQkFBMEIsQ0FBQztRQUNuRixJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLHdCQUF3QixDQUFDO0lBQ2pGLENBQUM7SUFFRDs7O09BR0c7SUFDTyxzQ0FBZ0IsR0FBMUI7UUFFRSxJQUFNLFNBQVMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSztRQUU3QyxJQUFJLFNBQVMsR0FBRyxFQUFFLENBQUMsUUFBUSxFQUFFO1FBQzdCLFNBQVMsR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFFLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBRSxDQUFDO1FBQy9FLFNBQVMsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDO1FBRXJELE9BQU8sU0FBUztJQUNsQixDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksMENBQW9CLEdBQTNCO1FBQ0UsSUFBTSxhQUFhLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ3RGLElBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtRQUN6QyxJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQztRQUNuQyxJQUFJLENBQUMsU0FBUyxDQUFDLGlCQUFpQixHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQztJQUN4RSxDQUFDO0lBRUQ7OztPQUdHO0lBQ08sK0NBQXlCLEdBQW5DLFVBQW9DLEtBQWlCO1FBRW5ELG9EQUFvRDtRQUNwRCxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsRUFBRTtRQUN0RCxJQUFNLElBQUksR0FBRyxLQUFLLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJO1FBQ3RDLElBQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUc7UUFFckMsb0NBQW9DO1FBQ3BDLElBQU0sS0FBSyxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxXQUFXO1FBQ2xELElBQU0sS0FBSyxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxZQUFZO1FBRW5ELHFDQUFxQztRQUNyQyxJQUFNLEtBQUssR0FBRyxLQUFLLEdBQUcsQ0FBQyxHQUFHLENBQUM7UUFDM0IsSUFBTSxLQUFLLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUM7UUFFNUIsT0FBTyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUM7SUFDdkIsQ0FBQztJQUVEOzs7T0FHRztJQUNPLGdDQUFVLEdBQXBCLFVBQXFCLEtBQWlCO1FBRXBDLElBQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRSxJQUFJLENBQUMseUJBQXlCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFeEcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pGLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFFLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUV6RixJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRTtJQUNyQixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNPLHFDQUFlLEdBQXpCLFVBQTBCLEtBQWlCO1FBQ3pDLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDO0lBQ3hCLENBQUM7SUFFRDs7O09BR0c7SUFDTyxtQ0FBYSxHQUF2QixVQUF3QixLQUFpQjtRQUV2QyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRTtRQUVuQixLQUFLLENBQUMsTUFBTyxDQUFDLG1CQUFtQixDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsMEJBQTBCLENBQUM7UUFDL0UsS0FBSyxDQUFDLE1BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLHdCQUF3QixDQUFDO0lBQzdFLENBQUM7SUFFRDs7OztPQUlHO0lBQ08scUNBQWUsR0FBekIsVUFBMEIsS0FBaUI7UUFFekMsS0FBSyxDQUFDLGNBQWMsRUFBRTtRQUV0QixJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLDBCQUEwQixDQUFDO1FBQ2hGLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsd0JBQXdCLENBQUM7UUFFNUUsNEJBQTRCO1FBQzVCLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQW1CLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGlCQUFpQixDQUFDO1FBQ2pGLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO1FBQ2pFLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxLQUFLLENBQUM7UUFDbkUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDO1FBQzVHLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDO1FBRTdELElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFO0lBQ3JCLENBQUM7SUFFRDs7O09BR0c7SUFDTyxzQ0FBZ0IsR0FBMUIsVUFBMkIsS0FBaUI7UUFFMUMsS0FBSyxDQUFDLGNBQWMsRUFBRTtRQUV0QixnREFBZ0Q7UUFDMUMsU0FBaUIsSUFBSSxDQUFDLHlCQUF5QixDQUFDLEtBQUssQ0FBQyxFQUFyRCxLQUFLLFVBQUUsS0FBSyxRQUF5QztRQUU1RCxtQ0FBbUM7UUFDN0IsU0FBdUIsRUFBRSxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsaUJBQWlCLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxFQUFyRyxRQUFRLFVBQUUsUUFBUSxRQUFtRjtRQUU1RyxrR0FBa0c7UUFDbEcsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUM7UUFFM0Usa0VBQWtFO1FBQ2xFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUVoRSx3Q0FBd0M7UUFDeEMsSUFBSSxDQUFDLG9CQUFvQixFQUFFO1FBRTNCLHNDQUFzQztRQUNoQyxTQUF5QixFQUFFLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQXZHLFNBQVMsVUFBRSxTQUFTLFFBQW1GO1FBRTlHLHVFQUF1RTtRQUN2RSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFFLElBQUksUUFBUSxHQUFHLFNBQVM7UUFDNUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBRSxJQUFJLFFBQVEsR0FBRyxTQUFTO1FBRTVDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFO0lBQ3JCLENBQUM7SUFDSCxrQkFBQztBQUFELENBQUM7Ozs7Ozs7Ozs7Ozs7O0FDbk1ELCtEQUF3QztBQUV4Qzs7O0dBR0c7QUFDSDtJQVdFLDJEQUEyRDtJQUMzRCxvQkFDVyxLQUFZO1FBQVosVUFBSyxHQUFMLEtBQUssQ0FBTztRQVh2Qix1Q0FBdUM7UUFDaEMsYUFBUSxHQUFZLEtBQUs7UUFFaEMsc0NBQXNDO1FBQy9CLGdCQUFXLEdBQVcsK0RBQStEO1FBRTVGLHlDQUF5QztRQUNsQyxlQUFVLEdBQVcsb0NBQW9DO0lBSzdELENBQUM7SUFFSjs7O09BR0c7SUFDSSwwQkFBSyxHQUFaLFVBQWEsWUFBNkI7UUFBN0IsbURBQTZCO1FBQ3hDLElBQUksWUFBWSxFQUFFO1lBQ2hCLE9BQU8sQ0FBQyxLQUFLLEVBQUU7U0FDaEI7SUFDSCxDQUFDO0lBRUQ7Ozs7Ozs7Ozs7T0FVRztJQUNJLHdCQUFHLEdBQVY7UUFBQSxpQkFVQztRQVZVLGtCQUFxQjthQUFyQixVQUFxQixFQUFyQixxQkFBcUIsRUFBckIsSUFBcUI7WUFBckIsNkJBQXFCOztRQUM5QixJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDakIsUUFBUSxDQUFDLE9BQU8sQ0FBQyxjQUFJO2dCQUNuQixJQUFJLE9BQVEsS0FBWSxDQUFDLElBQUksQ0FBQyxLQUFLLFVBQVUsRUFBRTtvQkFDNUMsS0FBWSxDQUFDLElBQUksQ0FBQyxFQUFFO2lCQUN0QjtxQkFBTTtvQkFDTCxNQUFNLElBQUksS0FBSyxDQUFDLG9CQUFvQixHQUFHLElBQUksR0FBRyxrQkFBa0IsQ0FBQztpQkFDbEU7WUFDSCxDQUFDLENBQUM7U0FDSDtJQUNILENBQUM7SUFFRDs7O09BR0c7SUFDSSwwQkFBSyxHQUFaLFVBQWEsT0FBZTtRQUMxQixJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDakIsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUM7U0FDdkI7SUFDSCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksMEJBQUssR0FBWjtRQUNFLE9BQU8sQ0FBQyxHQUFHLENBQUMsOEJBQThCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUM7UUFFcEYsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDNUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5Q0FBeUMsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDO1NBQ3hFO1FBRUQsT0FBTyxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDO1FBQ2xELE9BQU8sQ0FBQyxHQUFHLENBQUMsc2NBQXNjLENBQUM7UUFDbmQsT0FBTyxDQUFDLFFBQVEsRUFBRTtJQUNwQixDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksd0JBQUcsR0FBVjtRQUNFLE9BQU8sQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUNoRCxPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUM7UUFDbEUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQztRQUMxRCxPQUFPLENBQUMsUUFBUSxFQUFFO0lBQ3BCLENBQUM7SUFFRDs7O09BR0c7SUFDSSw2QkFBUSxHQUFmO1FBRUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxtQ0FBbUMsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDO1FBQ25FLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUN2QixPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztRQUNwRyxPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztRQUVsRyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUM1QixPQUFPLENBQUMsR0FBRyxDQUFDLDJCQUEyQixHQUFHLGFBQWEsQ0FBQztTQUN6RDthQUFNO1lBQ0wsT0FBTyxDQUFDLEdBQUcsQ0FBQywyQkFBMkIsR0FBRyxjQUFjLENBQUM7U0FDMUQ7UUFDRCxPQUFPLENBQUMsUUFBUSxFQUFFO0lBQ3BCLENBQUM7SUFFRDs7O09BR0c7SUFDSSw0QkFBTyxHQUFkO1FBQ0UsT0FBTyxDQUFDLEtBQUssQ0FBQyw2QkFBNkIsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDO1FBQzdELE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7UUFDN0MsT0FBTyxDQUFDLFFBQVEsRUFBRTtRQUNsQixPQUFPLENBQUMsS0FBSyxDQUFDLCtCQUErQixFQUFFLElBQUksQ0FBQyxVQUFVLENBQUM7UUFDL0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztRQUM3QyxPQUFPLENBQUMsUUFBUSxFQUFFO0lBQ3BCLENBQUM7SUFFRDs7O09BR0c7SUFDSSw0QkFBTyxHQUFkO1FBQ0UsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQ0FBcUMsR0FBRyxzQkFBYyxFQUFFLEdBQUcsTUFBTSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUM7UUFDL0YsT0FBTyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUM7SUFDOUIsQ0FBQztJQUVEOzs7T0FHRztJQUNJLDJCQUFNLEdBQWI7UUFDRSxPQUFPLENBQUMsS0FBSyxDQUFDLCtCQUErQixHQUFHLHNCQUFjLEVBQUUsR0FBRyxHQUFHLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUN4RixPQUFPLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQztRQUMvQixPQUFPLENBQUMsR0FBRyxDQUFDLHNCQUFzQixHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLEVBQUUsR0FBRyxLQUFLLENBQUM7UUFDL0csT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDbEYsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDckYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLGFBQWEsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDdkYsNEJBQTRCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsY0FBYyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFDOUUsd0JBQXdCLENBQUMsQ0FBQztRQUM1QixPQUFPLENBQUMsUUFBUSxFQUFFO0lBQ3BCLENBQUM7SUFFRDs7O09BR0c7SUFDSSw0QkFBTyxHQUFkO1FBQ0UsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDO0lBQ2xELENBQUM7SUFFRDs7O09BR0c7SUFDSSwyQkFBTSxHQUFiO1FBQ0UsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDO0lBQ3JELENBQUM7SUFFRDs7O09BR0c7SUFDSSw0QkFBTyxHQUFkLFVBQWUsS0FBYTtRQUMxQixPQUFPLENBQUMsR0FBRyxDQUFDLDZCQUE2QixHQUFHLEtBQUssR0FBRyxHQUFHLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzVFLENBQUM7SUFDSCxpQkFBQztBQUFELENBQUM7Ozs7Ozs7Ozs7Ozs7O0FDNUtELCtEQUFtQztBQUVuQzs7O0dBR0c7QUFDSDtJQXVCRSwyREFBMkQ7SUFDM0QsbUJBQ1csS0FBWTtRQUFaLFVBQUssR0FBTCxLQUFLLENBQU87UUF2QnZCLHFDQUFxQztRQUM5QixhQUFRLEdBQVksS0FBSztRQUVoQywwQkFBMEI7UUFDbkIsV0FBTSxHQUFXLE9BQVM7UUFFakMsbUNBQW1DO1FBQzVCLFlBQU8sR0FBVyxFQUFFO1FBRTNCLG9DQUFvQztRQUM3QixZQUFPLEdBQVcsRUFBRTtRQUUzQixpQ0FBaUM7UUFDMUIsV0FBTSxHQUFhO1lBQ3hCLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUztZQUNoRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVM7U0FDakU7UUFFRCxvQ0FBb0M7UUFDNUIsVUFBSyxHQUFXLENBQUM7SUFLdEIsQ0FBQztJQUVKOzs7T0FHRztJQUNJLHlCQUFLLEdBQVo7UUFFRSxvQ0FBb0M7UUFDcEMsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDO1FBRWQsK0NBQStDO1FBQy9DLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQzVCLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ3pELElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU07U0FDM0M7SUFDSCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksNEJBQVEsR0FBZjtRQUNFLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQzVCLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDWixPQUFPO2dCQUNMLENBQUMsRUFBRSxpQkFBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQU0sQ0FBQztnQkFDcEMsQ0FBQyxFQUFFLGlCQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTyxDQUFDO2dCQUNyQyxLQUFLLEVBQUUsaUJBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQztnQkFDeEMsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLEdBQUcsaUJBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO2dCQUMvRCxLQUFLLEVBQUUsaUJBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQzthQUNyQztTQUNGO2FBQ0k7WUFDSCxPQUFPLElBQUk7U0FDWjtJQUNILENBQUM7SUFDSCxnQkFBQztBQUFELENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3JFRCxpRkFBb0M7QUFDcEMsK0RBQTZDO0FBRTdDOzs7R0FHRztBQUNIO0lBTUUsMkRBQTJEO0lBQzNELG1CQUNXLEtBQVk7UUFBWixVQUFLLEdBQUwsS0FBSyxDQUFPO1FBTnZCLHFCQUFxQjtRQUNkLHFCQUFnQixHQUFXLEVBQUU7UUFDN0IscUJBQWdCLEdBQVcsRUFBRTtJQUtqQyxDQUFDO0lBRUo7OztPQUdHO0lBQ0kseUJBQUssR0FBWjtRQUVFLDZCQUE2QjtRQUM3QixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixFQUFFO1FBQ25ELElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsb0JBQW9CLEVBQUU7SUFDckQsQ0FBQztJQUVEOzs7T0FHRztJQUNLLHdDQUFvQixHQUE1QjtRQUNFLE9BQU8sT0FBTyxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRTtJQUN2RixDQUFDO0lBRUQ7OztPQUdHO0lBQ0ssd0NBQW9CLEdBQTVCO1FBQ0UsT0FBTyxPQUFPLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUFFO0lBQ3pDLENBQUM7SUFFRDs7Ozs7Ozs7O09BU0c7SUFDTyxtQ0FBZSxHQUF6QjtRQUVFLGdFQUFnRTtRQUNoRSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVyxDQUFDO1FBRW5ELElBQUksSUFBSSxHQUFXLEVBQUU7UUFFckIsbURBQW1EO1FBQ25ELElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQUssRUFBRSxLQUFLO1lBQ2pDLFNBQVksMkJBQW1CLENBQUMsS0FBSyxDQUFDLEVBQXJDLENBQUMsVUFBRSxDQUFDLFVBQUUsQ0FBQyxRQUE4QjtZQUMxQyxJQUFJLElBQUkseUJBQXVCLEtBQUssMkJBQXNCLENBQUMsVUFBSyxDQUFDLFVBQUssQ0FBQyxTQUFNO1FBQy9FLENBQUMsQ0FBQztRQUVGLDJFQUEyRTtRQUMzRSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUU7UUFFdkIsNkNBQTZDO1FBQzdDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDdEIsQ0FBQztJQUNILGdCQUFDO0FBQUQsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7QUMxRUQsK0RBQTZDO0FBRTdDOzs7R0FHRztBQUNIO0lBbUNFLDJEQUEyRDtJQUMzRCxvQkFDVyxLQUFZO1FBQVosVUFBSyxHQUFMLEtBQUssQ0FBTztRQW5DdkIsMERBQTBEO1FBQ25ELFVBQUssR0FBWSxLQUFLO1FBQ3RCLFVBQUssR0FBWSxLQUFLO1FBQ3RCLFlBQU8sR0FBWSxLQUFLO1FBQ3hCLGNBQVMsR0FBWSxLQUFLO1FBQzFCLG1CQUFjLEdBQVksS0FBSztRQUMvQix1QkFBa0IsR0FBWSxLQUFLO1FBQ25DLDBCQUFxQixHQUFZLEtBQUs7UUFDdEMsaUNBQTRCLEdBQVksS0FBSztRQUM3QyxvQkFBZSxHQUF5QixrQkFBa0I7UUFFakUsc0RBQXNEO1FBQy9DLFFBQUcsR0FBRyxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRTtRQU03QywwREFBMEQ7UUFDbEQsY0FBUyxHQUF3QixJQUFJLEdBQUcsRUFBRTtRQUVsRCxnQ0FBZ0M7UUFDekIsU0FBSSxHQUEyRCxJQUFJLEdBQUcsRUFBRTtRQUUvRSxtRkFBbUY7UUFDM0Usa0JBQWEsR0FBd0IsSUFBSSxHQUFHLENBQUM7WUFDbkQsQ0FBQyxXQUFXLEVBQUUsTUFBTSxDQUFDO1lBQ3JCLENBQUMsWUFBWSxFQUFFLE1BQU0sQ0FBQztZQUN0QixDQUFDLFlBQVksRUFBRSxNQUFNLENBQUM7WUFDdEIsQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDO1lBQ3ZCLENBQUMsY0FBYyxFQUFFLE1BQU0sQ0FBQyxDQUFLLFdBQVc7U0FDekMsQ0FBQztJQUtFLENBQUM7SUFFTDs7O09BR0c7SUFDSSwwQkFBSyxHQUFaO1FBRUUsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFO1lBQzlDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztZQUNqQixLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUs7WUFDakIsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPO1lBQ3JCLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUztZQUN6QixjQUFjLEVBQUUsSUFBSSxDQUFDLGNBQWM7WUFDbkMsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLGtCQUFrQjtZQUMzQyxxQkFBcUIsRUFBRSxJQUFJLENBQUMscUJBQXFCO1lBQ2pELDRCQUE0QixFQUFFLElBQUksQ0FBQyw0QkFBNEI7WUFDL0QsZUFBZSxFQUFFLElBQUksQ0FBQyxlQUFlO1NBQ3RDLENBQUU7UUFFSCxJQUFJLElBQUksQ0FBQyxFQUFFLEtBQUssSUFBSSxFQUFFO1lBQ3BCLE1BQU0sSUFBSSxLQUFLLENBQUMsNkNBQTZDLENBQUM7U0FDL0Q7UUFFRCwwREFBMEQ7UUFDMUQsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsMkJBQTJCLENBQUM7UUFDM0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWM7UUFDOUYsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUM7UUFFekQsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQztRQUUzQiwrQ0FBK0M7UUFDL0MsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFdBQVc7UUFDdkQsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFlBQVk7UUFDekQsSUFBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO1FBRXpFLGtIQUFrSDtRQUNsSCxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsb0JBQXFCLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsb0JBQW9CLENBQUMsRUFBRTtZQUNsRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBTSxHQUFHLENBQUM7WUFDaEQsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU8sR0FBRyxDQUFDO1NBQ2xEO1FBRUQsNEVBQTRFO1FBQzVFLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBUSxDQUFDO1FBRXpDLGdDQUFnQztRQUNoQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDO0lBQ3hGLENBQUM7SUFFRDs7O09BR0c7SUFDSSwrQkFBVSxHQUFqQixVQUFrQixLQUFhO1FBQ3pCLFNBQVksMkJBQW1CLENBQUMsS0FBSyxDQUFDLEVBQXJDLENBQUMsVUFBRSxDQUFDLFVBQUUsQ0FBQyxRQUE4QjtRQUMxQyxJQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUM7SUFDbEMsQ0FBQztJQUVEOzs7T0FHRztJQUNJLG9DQUFlLEdBQXRCO1FBQ0UsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ0ksaUNBQVksR0FBbkIsVUFBb0IsSUFBeUMsRUFBRSxJQUFZO1FBRXpFLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUU7UUFDbkQsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQztRQUNsQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUM7UUFFN0IsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsa0JBQWtCLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsY0FBYyxDQUFDLEVBQUU7WUFDL0QsTUFBTSxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsR0FBRyxJQUFJLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDakc7UUFFRCxPQUFPLE1BQU07SUFDZixDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0ksNkNBQXdCLEdBQS9CLFVBQWdDLFVBQXVCLEVBQUUsVUFBdUI7UUFFOUUsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRztRQUMxQyxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQztRQUNqRCxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQztRQUNqRCxJQUFJLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO1FBQ3BDLElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDckMsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNJLGtDQUFhLEdBQXBCLFVBQXFCLGNBQXNCLEVBQUUsY0FBc0I7UUFFakUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQztRQUUvQixJQUFJLENBQUMsd0JBQXdCLENBQzNCLElBQUksQ0FBQyxZQUFZLENBQUMsZUFBZSxFQUFFLGNBQWMsQ0FBQyxFQUNsRCxJQUFJLENBQUMsWUFBWSxDQUFDLGlCQUFpQixFQUFFLGNBQWMsQ0FBQyxDQUNyRDtJQUNILENBQUM7SUFFRDs7Ozs7Ozs7OztPQVVHO0lBQ0ksbUNBQWMsR0FBckIsVUFBc0IsT0FBZTtRQUVuQyxJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFbkMsSUFBSSxPQUFPLEtBQUssSUFBSSxFQUFFO1lBQ3BCLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUM7U0FDbEY7YUFBTSxJQUFJLE9BQU8sS0FBSyxJQUFJLEVBQUU7WUFDM0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQztTQUNqRjthQUFNO1lBQ0wsTUFBTSxJQUFJLEtBQUssQ0FBQyxvREFBb0QsR0FBRyxPQUFPLENBQUM7U0FDaEY7SUFDSCxDQUFDO0lBRUQ7Ozs7Ozs7OztPQVNHO0lBQ0ksb0NBQWUsR0FBdEI7UUFBQSxpQkFFQztRQUZzQixrQkFBcUI7YUFBckIsVUFBcUIsRUFBckIscUJBQXFCLEVBQXJCLElBQXFCO1lBQXJCLDZCQUFxQjs7UUFDMUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxpQkFBTyxJQUFJLFlBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLEVBQTVCLENBQTRCLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBRUQ7Ozs7Ozs7Ozs7OztPQVlHO0lBQ0ksaUNBQVksR0FBbkIsVUFBb0IsU0FBaUIsRUFBRSxJQUFnQjtRQUVyRCxJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRztRQUN0QyxJQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxNQUFNLENBQUM7UUFDaEQsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDO1FBRW5FLHlFQUF5RTtRQUN6RSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDN0IsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUUsRUFBQyxDQUFDO1NBQy9GO1FBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7UUFFOUMsT0FBTyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxpQkFBaUI7SUFDN0MsQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDSSxnQ0FBVyxHQUFsQixVQUFtQixPQUFlLEVBQUUsUUFBa0I7UUFDcEQsSUFBSSxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDO0lBQ3hFLENBQUM7SUFFRDs7Ozs7Ozs7OztPQVVHO0lBQ0ksOEJBQVMsR0FBaEIsVUFBaUIsU0FBaUIsRUFBRSxLQUFhLEVBQUUsT0FBZSxFQUFFLElBQVksRUFBRSxNQUFjLEVBQUUsTUFBYztRQUU5RyxJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUU7UUFDdkMsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDO1FBRTVDLElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUQsSUFBSSxDQUFDLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQyxRQUFRLENBQUM7UUFDekMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUM7SUFDaEYsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNJLCtCQUFVLEdBQWpCLFVBQWtCLEtBQWEsRUFBRSxLQUFhO1FBQzVDLElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUM7SUFDbEQsQ0FBQztJQUNILGlCQUFDO0FBQUQsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNuUkQsK0RBQW9FO0FBRXBFLHdHQUF5QztBQUN6QyxrR0FBc0M7QUFDdEMsa0dBQXNDO0FBQ3RDLCtGQUFvQztBQUNwQywrRkFBb0M7QUFFcEM7OztHQUdHO0FBQ0g7SUFzRUU7Ozs7Ozs7Ozs7T0FVRztJQUNILGVBQVksUUFBZ0IsRUFBRSxPQUFzQjtRQS9FcEQsNENBQTRDO1FBQ3JDLGFBQVEsR0FBa0IsU0FBUztRQUUxQyw2QkFBNkI7UUFDdEIsVUFBSyxHQUFlLElBQUkscUJBQVUsQ0FBQyxJQUFJLENBQUM7UUFFL0MsK0NBQStDO1FBQ3hDLFNBQUksR0FBYyxJQUFJLG9CQUFTLENBQUMsSUFBSSxDQUFDO1FBRTVDLG9CQUFvQjtRQUNiLFVBQUssR0FBZSxJQUFJLHFCQUFVLENBQUMsSUFBSSxDQUFDO1FBRS9DLGlDQUFpQztRQUMxQixTQUFJLEdBQWMsSUFBSSxvQkFBUyxDQUFDLElBQUksQ0FBQztRQUU1Qyw4Q0FBOEM7UUFDdkMsYUFBUSxHQUFZLEtBQUs7UUFFaEMsOENBQThDO1FBQ3ZDLGdCQUFXLEdBQVcsVUFBYTtRQUUxQyw0Q0FBNEM7UUFDckMsZUFBVSxHQUFXLEtBQU07UUFFbEMsaUNBQWlDO1FBQzFCLFdBQU0sR0FBYSxFQUFFO1FBRTVCLHdDQUF3QztRQUNqQyxTQUFJLEdBQWM7WUFDdkIsS0FBSyxFQUFFLEtBQU07WUFDYixNQUFNLEVBQUUsS0FBTTtZQUNkLE9BQU8sRUFBRSxTQUFTO1lBQ2xCLFVBQVUsRUFBRSxTQUFTO1NBQ3RCO1FBRUQsbUNBQW1DO1FBQzVCLFdBQU0sR0FBZ0I7WUFDM0IsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBTSxHQUFHLENBQUM7WUFDdkIsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTyxHQUFHLENBQUM7WUFDeEIsSUFBSSxFQUFFLENBQUM7U0FDUjtRQUVELCtEQUErRDtRQUN4RCxjQUFTLEdBQVksS0FBSztRQUVqQywwQ0FBMEM7UUFDbkMsZ0JBQVcsR0FBVyxDQUFDO1FBRTlCLGlDQUFpQztRQUMxQixVQUFLLEdBQUc7WUFDYixhQUFhLEVBQUUsQ0FBQztZQUNoQixlQUFlLEVBQUUsRUFBYztZQUMvQixXQUFXLEVBQUUsQ0FBQztZQUNkLFFBQVEsRUFBRSxDQUFDO1NBQ1o7UUFLRCwwRkFBMEY7UUFDbkYseUJBQW9CLEdBQTZCLEVBQUU7UUFFMUQsaURBQWlEO1FBQ3ZDLFlBQU8sR0FBZ0IsSUFBSSx1QkFBVyxDQUFDLElBQUksQ0FBQztRQUV0RCw4RUFBOEU7UUFDdEUsY0FBUyxHQUFZLEtBQUs7UUFlaEMsSUFBSSxRQUFRLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQ3JDLElBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQXNCO1NBQ3JFO2FBQU07WUFDTCxNQUFNLElBQUksS0FBSyxDQUFDLDZCQUE2QixHQUFHLFFBQVEsR0FBRyxjQUFjLENBQUM7U0FDM0U7UUFFRCxJQUFJLE9BQU8sRUFBRTtZQUVYLG9FQUFvRTtZQUNwRSw2QkFBcUIsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDO1lBQ3BDLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxPQUFPO1lBRW5DLGlGQUFpRjtZQUNqRixJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ2pCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDO2FBQ3BCO1NBQ0Y7SUFDSCxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSSxxQkFBSyxHQUFaLFVBQWMsT0FBMEI7UUFBMUIsc0NBQTBCO1FBRXRDLDZFQUE2RTtRQUM3RSxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUk7UUFFckIsNENBQTRDO1FBQzVDLDZCQUFxQixDQUFDLElBQUksRUFBRSxPQUFPLENBQUM7UUFDcEMsSUFBSSxDQUFDLG9CQUFvQixHQUFHLE9BQU87UUFFbkMsa0RBQWtEO1FBQ2xELElBQUksQ0FBQyxVQUFVLEVBQUU7UUFFakIsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDO1FBRXZCLGdDQUFnQztRQUNoQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRTtRQUNsQixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRTtRQUNqQixJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRTtRQUNsQixJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRTtRQUNwQixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRTtRQUVqQixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUM7UUFFMUIsaUNBQWlDO1FBQ2pDLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLFlBQVksRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxVQUFVLENBQUM7UUFFcEYsNEVBQTRFO1FBQzVFLElBQUksQ0FBQyxRQUFRLEVBQUU7UUFFZixJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDakIsd0RBQXdEO1lBQ3hELElBQUksQ0FBQyxHQUFHLEVBQUU7U0FDWDtJQUNILENBQUM7SUFFRDs7O09BR0c7SUFDTyx3QkFBUSxHQUFsQjtRQUVFLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQztRQUV6QixJQUFJLE1BQU0sR0FBRyxFQUFFLFFBQVEsRUFBRSxFQUFjLEVBQUUsTUFBTSxFQUFFLEVBQWMsRUFBRSxLQUFLLEVBQUUsRUFBYyxFQUFFLE1BQU0sRUFBRSxFQUFjLEVBQUU7UUFDaEgsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLGFBQWEsRUFBRSxDQUFDLEVBQUUsZUFBZSxFQUFFLEVBQWMsRUFBRSxXQUFXLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUU7UUFFL0YsSUFBSSxNQUFzQztRQUMxQyxJQUFJLENBQUMsR0FBVyxDQUFDO1FBQ2pCLElBQUksWUFBWSxHQUFZLEtBQUs7UUFFakMsT0FBTyxDQUFDLFlBQVksRUFBRTtZQUVwQixNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVMsRUFBRTtZQUN6QixZQUFZLEdBQUcsQ0FBQyxNQUFNLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDO1lBRWxGLElBQUksQ0FBQyxZQUFZLEVBQUU7Z0JBQ2pCLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU8sQ0FBQyxDQUFDLEVBQUUsTUFBTyxDQUFDLENBQUMsQ0FBQztnQkFDMUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTyxDQUFDLEtBQUssQ0FBQztnQkFDakMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTyxDQUFDLElBQUksQ0FBQztnQkFDL0IsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTyxDQUFDLEtBQUssQ0FBQztnQkFDakMsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUU7Z0JBQzFCLENBQUMsRUFBRTthQUNKO1lBRUQsSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksWUFBWSxFQUFFO2dCQUMxQyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUM7Z0JBRXRELHVFQUF1RTtnQkFDdkUsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRO29CQUNqQixJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsSUFBSSxZQUFZLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO3dCQUN0RSxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsSUFBSSxVQUFVLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO3dCQUNoRSxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsSUFBSSxVQUFVLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO3dCQUNoRSxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsSUFBSSxZQUFZLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ25FO1lBRUQsSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUU7Z0JBQzNDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFO2dCQUN4QixNQUFNLEdBQUcsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFO2dCQUM1RCxDQUFDLEdBQUcsQ0FBQzthQUNOO1NBQ0Y7UUFFRCxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUM7SUFDMUIsQ0FBQztJQUVEOzs7T0FHRztJQUNJLHNCQUFNLEdBQWI7UUFFRSx3Q0FBd0M7UUFDeEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLEVBQUU7UUFFNUIsd0NBQXdDO1FBQ3hDLElBQUksQ0FBQyxPQUFPLENBQUMsb0JBQW9CLEVBQUU7UUFFbkMsMkRBQTJEO1FBQzNELElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQztRQUU1RSxvREFBb0Q7UUFDcEQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBRS9DLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRSxDQUFDLEVBQUUsWUFBWSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQzFELElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3JELElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ25ELElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBRXJELElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUN4RDtJQUNILENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ0gsMEJBQVUsR0FBVjtRQUVFOzs7V0FHRztRQUNILElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ25CLElBQUksQ0FBQyxLQUFLLEVBQUU7U0FDYjtRQUVELHdEQUF3RDtRQUN4RCxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNsQixNQUFNLElBQUksS0FBSyxDQUFDLDBDQUEwQyxDQUFDO1NBQzVEO0lBQ0gsQ0FBQztJQUVEOzs7T0FHRztJQUNJLG1CQUFHLEdBQVY7UUFFRSxJQUFJLENBQUMsVUFBVSxFQUFFO1FBRWpCLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ25CLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDYixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRTtZQUNsQixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUk7WUFDckIsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDO1NBQzFCO0lBQ0gsQ0FBQztJQUVEOzs7T0FHRztJQUNJLG9CQUFJLEdBQVg7UUFFRSxJQUFJLENBQUMsVUFBVSxFQUFFO1FBRWpCLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNsQixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRTtZQUNuQixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUs7WUFDdEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDO1NBQ3pCO0lBQ0gsQ0FBQztJQUVEOzs7T0FHRztJQUNJLHFCQUFLLEdBQVo7UUFFRSxJQUFJLENBQUMsVUFBVSxFQUFFO1FBRWpCLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxFQUFFO1FBQzVCLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQztJQUMzQixDQUFDO0lBQ0gsWUFBQztBQUFELENBQUM7Ozs7Ozs7Ozs7Ozs7OztBQ3pTRDs7Ozs7O0dBTUc7QUFDSCxTQUFnQixRQUFRLENBQUMsUUFBYTtJQUNwQyxPQUFPLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLGlCQUFpQixDQUFDO0FBQ3pFLENBQUM7QUFGRCw0QkFFQztBQUVEOzs7Ozs7Ozs7OztHQVdHO0FBQ0gsU0FBZ0IscUJBQXFCLENBQUMsTUFBVyxFQUFFLE1BQVc7SUFDNUQsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsYUFBRztRQUM3QixJQUFJLEdBQUcsSUFBSSxNQUFNLEVBQUU7WUFDakIsSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUU7Z0JBQ3pCLElBQUksUUFBUSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO29CQUN6QixxQkFBcUIsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2lCQUNoRDthQUNGO2lCQUFNO2dCQUNMLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxVQUFVLENBQUMsRUFBRTtvQkFDakUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUM7aUJBQzFCO2FBQ0Y7U0FDRjtJQUNILENBQUMsQ0FBQztBQUNKLENBQUM7QUFkRCxzREFjQztBQUVEOzs7Ozs7R0FNRztBQUNILFNBQWdCLFNBQVMsQ0FBQyxLQUFhO0lBQ3JDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsS0FBSyxDQUFDO0FBQzFDLENBQUM7QUFGRCw4QkFFQztBQUVEOzs7Ozs7R0FNRztBQUNILFNBQWdCLG1CQUFtQixDQUFDLFFBQWdCO0lBQ2xELElBQUksQ0FBQyxHQUFHLDJDQUEyQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDOUQsU0FBWSxDQUFDLFFBQVEsQ0FBQyxDQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQTVGLENBQUMsVUFBRSxDQUFDLFVBQUUsQ0FBQyxRQUFxRjtJQUNqRyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDbEIsQ0FBQztBQUpELGtEQUlDO0FBRUQ7Ozs7O0dBS0c7QUFDSCxTQUFnQixjQUFjO0lBRTVCLElBQUksS0FBSyxHQUFHLElBQUksSUFBSSxFQUFFO0lBRXRCLE9BQU87UUFDTCxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUM7UUFDNUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDO1FBQzlDLEtBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQztLQUMvQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7QUFDYixDQUFDO0FBVEQsd0NBU0M7Ozs7Ozs7VUMvRUQ7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0Esc0RBQXNELGtCQUFrQjtXQUN4RTtXQUNBLCtDQUErQyxjQUFjO1dBQzdELEU7Ozs7O1VDTkE7VUFDQTtVQUNBO1VBQ0EiLCJmaWxlIjoic2NyaXB0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiaW1wb3J0IHsgcmFuZG9tSW50IH0gZnJvbSAnLi91dGlscydcbmltcG9ydCBTUGxvdCBmcm9tICcuL3NwbG90J1xuaW1wb3J0ICdAL3N0eWxlJ1xuXG4vKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuXG5sZXQgbiA9IDFfMDAwXzAwMFxubGV0IGNvbG9ycyA9IFsnI0Q4MUMwMScsICcjRTk5NjdBJywgJyNCQTU1RDMnLCAnI0ZGRDcwMCcsICcjRkZFNEI1JywgJyNGRjhDMDAnLCAnIzIyOEIyMicsICcjOTBFRTkwJywgJyM0MTY5RTEnLCAnIzAwQkZGRicsICcjOEI0NTEzJywgJyMwMENFRDEnXVxubGV0IHdpZHRoID0gMzJfMDAwXG5sZXQgaGVpZ2h0ID0gMTZfMDAwXG5cbi8qKiDQodC40L3RgtC10YLQuNGH0LXRgdC60LDRjyDQuNGC0LXRgNC40YDRg9GO0YnQsNGPINGE0YPQvdC60YbQuNGPLiAqL1xubGV0IGkgPSAwXG5mdW5jdGlvbiByZWFkTmV4dE9iamVjdCgpIHtcbiAgaWYgKGkgPCBuKSB7XG4gICAgaSsrXG4gICAgcmV0dXJuIHtcbiAgICAgIHg6IHJhbmRvbUludCh3aWR0aCksXG4gICAgICB5OiByYW5kb21JbnQoaGVpZ2h0KSxcbiAgICAgIHNoYXBlOiByYW5kb21JbnQoMyksXG4gICAgICBzaXplOiAxMCArIHJhbmRvbUludCgyMSksXG4gICAgICBjb2xvcjogcmFuZG9tSW50KGNvbG9ycy5sZW5ndGgpXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGkgPSAwXG4gICAgcmV0dXJuIG51bGwgIC8vINCS0L7Qt9Cy0YDQsNGJ0LDQtdC8IG51bGwsINC60L7Qs9C00LAg0L7QsdGK0LXQutGC0YsgXCLQt9Cw0LrQvtC90YfQuNC70LjRgdGMXCIuXG4gIH1cbn1cblxuLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cblxubGV0IHNjYXR0ZXJQbG90ID0gbmV3IFNQbG90KCdjYW52YXMxJylcblxuc2NhdHRlclBsb3Quc2V0dXAoe1xuICBpdGVyYXRvcjogcmVhZE5leHRPYmplY3QsXG4gIGNvbG9yczogY29sb3JzLFxuICBncmlkOiB7XG4gICAgd2lkdGg6IHdpZHRoLFxuICAgIGhlaWdodDogaGVpZ2h0XG4gIH0sXG4gIGRlYnVnOiB7XG4gICAgaXNFbmFibGU6IHRydWUsXG4gIH0sXG4gIGRlbW86IHtcbiAgICBpc0VuYWJsZTogZmFsc2VcbiAgfVxufSlcblxuc2NhdHRlclBsb3QucnVuKClcblxuLy9zZXRUaW1lb3V0KCgpID0+IHNjYXR0ZXJQbG90LnN0b3AoKSwgMzAwMClcbiIsIlxuLyoqXG4gKiDQo9C80L3QvtC20LDQtdGCINC80LDRgtGA0LjRhtGLLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbXVsdGlwbHkoYTogbnVtYmVyW10sIGI6IG51bWJlcltdKTogbnVtYmVyW10ge1xuICByZXR1cm4gW1xuICAgIGJbMF0gKiBhWzBdICsgYlsxXSAqIGFbM10gKyBiWzJdICogYVs2XSxcbiAgICBiWzBdICogYVsxXSArIGJbMV0gKiBhWzRdICsgYlsyXSAqIGFbN10sXG4gICAgYlswXSAqIGFbMl0gKyBiWzFdICogYVs1XSArIGJbMl0gKiBhWzhdLFxuICAgIGJbM10gKiBhWzBdICsgYls0XSAqIGFbM10gKyBiWzVdICogYVs2XSxcbiAgICBiWzNdICogYVsxXSArIGJbNF0gKiBhWzRdICsgYls1XSAqIGFbN10sXG4gICAgYlszXSAqIGFbMl0gKyBiWzRdICogYVs1XSArIGJbNV0gKiBhWzhdLFxuICAgIGJbNl0gKiBhWzBdICsgYls3XSAqIGFbM10gKyBiWzhdICogYVs2XSxcbiAgICBiWzZdICogYVsxXSArIGJbN10gKiBhWzRdICsgYls4XSAqIGFbN10sXG4gICAgYls2XSAqIGFbMl0gKyBiWzddICogYVs1XSArIGJbOF0gKiBhWzhdXG4gIF1cbn1cblxuLyoqXG4gKiDQodC+0LfQtNCw0LXRgiDQtdC00LjQvdC40YfQvdGD0Y4g0LzQsNGC0YDQuNGG0YMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpZGVudGl0eSgpOiBudW1iZXJbXSB7XG4gIHJldHVybiBbXG4gICAgMSwgMCwgMCxcbiAgICAwLCAxLCAwLFxuICAgIDAsIDAsIDFcbiAgXVxufVxuXG4vKipcbiAqIENyZWF0ZXMgYSAyRCBwcm9qZWN0aW9uIG1hdHJpeC4gUmV0dXJucyBhIHByb2plY3Rpb24gbWF0cml4IHRoYXQgY29udmVydHMgZnJvbSBwaXhlbHMgdG8gY2xpcHNwYWNlIHdpdGggWSA9IDAgYXQgdGhlXG4gKiB0b3AuIFRoaXMgbWF0cml4IGZsaXBzIHRoZSBZIGF4aXMgc28gMCBpcyBhdCB0aGUgdG9wLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcHJvamVjdGlvbih3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlcik6IG51bWJlcltdIHtcbiAgcmV0dXJuIFtcbiAgICAyIC8gd2lkdGgsIDAsIDAsXG4gICAgMCwgLTIgLyBoZWlnaHQsIDAsXG4gICAgLTEsIDEsIDFcbiAgXVxufVxuXG4vKipcbiAqIENyZWF0ZXMgYSAyRCB0cmFuc2xhdGlvbiBtYXRyaXguIFJldHVybnMgYSB0cmFuc2xhdGlvbiBtYXRyaXggdGhhdCB0cmFuc2xhdGVzIGJ5IHR4IGFuZCB0eS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRyYW5zbGF0aW9uKHR4OiBudW1iZXIsIHR5OiBudW1iZXIpOiBudW1iZXJbXSB7XG4gIHJldHVybiBbXG4gICAgMSwgMCwgMCxcbiAgICAwLCAxLCAwLFxuICAgIHR4LCB0eSwgMVxuICBdXG59XG5cbi8qKlxuICogTXVsdGlwbGllcyBieSBhIDJEIHRyYW5zbGF0aW9uIG1hdHJpeFxuICovXG5leHBvcnQgZnVuY3Rpb24gdHJhbnNsYXRlKG06IG51bWJlcltdLCB0eDogbnVtYmVyLCB0eTogbnVtYmVyKTogbnVtYmVyW10ge1xuICByZXR1cm4gbXVsdGlwbHkobSwgdHJhbnNsYXRpb24odHgsIHR5KSlcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgMkQgc2NhbGluZyBtYXRyaXhcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNjYWxpbmcoc3g6IG51bWJlciwgc3k6IG51bWJlcik6IG51bWJlcltdIHtcbiAgcmV0dXJuIFtcbiAgICBzeCwgMCwgMCxcbiAgICAwLCBzeSwgMCxcbiAgICAwLCAwLCAxXG4gIF1cbn1cblxuLyoqXG4gKiBNdWx0aXBsaWVzIGJ5IGEgMkQgc2NhbGluZyBtYXRyaXhcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNjYWxlKG06IG51bWJlcltdLCBzeDogbnVtYmVyLCBzeTogbnVtYmVyKTogbnVtYmVyW10ge1xuICByZXR1cm4gbXVsdGlwbHkobSwgc2NhbGluZyhzeCwgc3kpKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdHJhbnNmb3JtUG9pbnQobTogbnVtYmVyW10sIHY6IG51bWJlcltdKTogbnVtYmVyW10ge1xuICBjb25zdCBkID0gdlswXSAqIG1bMl0gKyB2WzFdICogbVs1XSArIG1bOF1cbiAgcmV0dXJuIFtcbiAgICAodlswXSAqIG1bMF0gKyB2WzFdICogbVszXSArIG1bNl0pIC8gZCxcbiAgICAodlswXSAqIG1bMV0gKyB2WzFdICogbVs0XSArIG1bN10pIC8gZFxuICBdXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbnZlcnNlKG06IG51bWJlcltdKTogbnVtYmVyW10ge1xuICBjb25zdCB0MDAgPSBtWzRdICogbVs4XSAtIG1bNV0gKiBtWzddXG4gIGNvbnN0IHQxMCA9IG1bMV0gKiBtWzhdIC0gbVsyXSAqIG1bN11cbiAgY29uc3QgdDIwID0gbVsxXSAqIG1bNV0gLSBtWzJdICogbVs0XVxuICBjb25zdCBkID0gMS4wIC8gKG1bMF0gKiB0MDAgLSBtWzNdICogdDEwICsgbVs2XSAqIHQyMClcbiAgcmV0dXJuIFtcbiAgICAgZCAqIHQwMCwgLWQgKiB0MTAsIGQgKiB0MjAsXG4gICAgLWQgKiAobVszXSAqIG1bOF0gLSBtWzVdICogbVs2XSksXG4gICAgIGQgKiAobVswXSAqIG1bOF0gLSBtWzJdICogbVs2XSksXG4gICAgLWQgKiAobVswXSAqIG1bNV0gLSBtWzJdICogbVszXSksXG4gICAgIGQgKiAobVszXSAqIG1bN10gLSBtWzRdICogbVs2XSksXG4gICAgLWQgKiAobVswXSAqIG1bN10gLSBtWzFdICogbVs2XSksXG4gICAgIGQgKiAobVswXSAqIG1bNF0gLSBtWzFdICogbVszXSlcbiAgXVxufVxuIiwiZXhwb3J0IGNvbnN0IFZFUlRFWF9URU1QTEFURSA9XG5gXG5hdHRyaWJ1dGUgdmVjMiBhX3Bvc2l0aW9uO1xuYXR0cmlidXRlIGZsb2F0IGFfY29sb3I7XG5hdHRyaWJ1dGUgZmxvYXQgYV9zaXplO1xuYXR0cmlidXRlIGZsb2F0IGFfc2hhcGU7XG51bmlmb3JtIG1hdDMgdV9tYXRyaXg7XG52YXJ5aW5nIHZlYzMgdl9jb2xvcjtcbnZhcnlpbmcgZmxvYXQgdl9zaGFwZTtcbnZvaWQgbWFpbigpIHtcbiAgZ2xfUG9zaXRpb24gPSB2ZWM0KCh1X21hdHJpeCAqIHZlYzMoYV9wb3NpdGlvbiwgMSkpLnh5LCAwLjAsIDEuMCk7XG4gIGdsX1BvaW50U2l6ZSA9IGFfc2l6ZTtcbiAgdl9zaGFwZSA9IGFfc2hhcGU7XG4gIHtDT0xPUi1DT0RFfVxufVxuYFxuZXhwb3J0IGNvbnN0IEZSQUdNRU5UX1RFTVBMQVRFID1cbmBcbnByZWNpc2lvbiBsb3dwIGZsb2F0O1xudmFyeWluZyB2ZWMzIHZfY29sb3I7XG52YXJ5aW5nIGZsb2F0IHZfc2hhcGU7XG52b2lkIG1haW4oKSB7XG4gIGlmICh2X3NoYXBlID09IDAuMCkge1xuICAgIGlmIChsZW5ndGgoZ2xfUG9pbnRDb29yZCAtIDAuNSkgPiAwLjUpIHsgZGlzY2FyZDsgfTtcbiAgfSBlbHNlIGlmICh2X3NoYXBlID09IDEuMCkge1xuXG4gIH0gZWxzZSBpZiAodl9zaGFwZSA9PSAyLjApIHtcbiAgICBpZiAoICgoZ2xfUG9pbnRDb29yZC54IDwgMC4zKSAmJiAoZ2xfUG9pbnRDb29yZC55IDwgMC4zKSkgfHxcbiAgICAgICgoZ2xfUG9pbnRDb29yZC54ID4gMC43KSAmJiAoZ2xfUG9pbnRDb29yZC55IDwgMC4zKSkgfHxcbiAgICAgICgoZ2xfUG9pbnRDb29yZC54ID4gMC43KSAmJiAoZ2xfUG9pbnRDb29yZC55ID4gMC43KSkgfHxcbiAgICAgICgoZ2xfUG9pbnRDb29yZC54IDwgMC4zKSAmJiAoZ2xfUG9pbnRDb29yZC55ID4gMC43KSkgKVxuICAgICAgeyBkaXNjYXJkOyB9O1xuICB9XG4gIGdsX0ZyYWdDb2xvciA9IHZlYzQodl9jb2xvci5yZ2IsIDEuMCk7XG59XG5gXG4iLCJpbXBvcnQgU1Bsb3QgZnJvbSAnLi9zcGxvdCdcbmltcG9ydCAqIGFzIG0zIGZyb20gJy4vbWF0aDN4MydcblxuLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqXG4gKiDQmtC70LDRgdGBLdGF0LXQu9C/0LXRgCwg0YDQtdCw0LvQuNC30YPRjtGJ0LjQuSDQvtCx0YDQsNCx0L7RgtC60YMg0YHRgNC10LTRgdGC0LIg0LLQstC+0LTQsCAo0LzRi9GI0LgsINGC0YDQtdC60L/QsNC00LAg0Lgg0YIu0L8uKSDQuCDQvNCw0YLQtdC80LDRgtC40YfQtdGB0LrQuNC1INGA0LDRgdGH0LXRgtGLINGC0LXRhdC90LjRh9C10YHQutC40YUg0LTQsNC90L3Ri9GFLFxuICog0YHQvtC+0YLQstC10YLRgdCy0YPRjtGJ0LjRhSDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjRj9C8INCz0YDQsNGE0LjQutCwINC00LvRjyDQutC70LDRgdGB0LAgU3Bsb3QuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNQbG90Q29udG9sIGltcGxlbWVudHMgU1Bsb3RIZWxwZXIge1xuXG4gIC8qKiDQotC10YXQvdC40YfQtdGB0LrQsNGPINC40L3RhNC+0YDQvNCw0YbQuNGPLCDQuNGB0L/QvtC70YzQt9GD0LXQvNCw0Y8g0L/RgNC40LvQvtC20LXQvdC40LXQvCDQtNC70Y8g0YDQsNGB0YfQtdGC0LAg0YLRgNCw0L3RgdGE0L7RgNC80LDRhtC40LkuICovXG4gIHB1YmxpYyB0cmFuc2Zvcm06IFNQbG90VHJhbnNmb3JtID0ge1xuICAgIHZpZXdQcm9qZWN0aW9uTWF0OiBbXSxcbiAgICBzdGFydEludlZpZXdQcm9qTWF0OiBbXSxcbiAgICBzdGFydENhbWVyYTogeyB4OiAwLCB5OiAwLCB6b29tOiAxIH0sXG4gICAgc3RhcnRQb3M6IFtdLFxuICAgIHN0YXJ0Q2xpcFBvczogW10sXG4gICAgc3RhcnRNb3VzZVBvczogW11cbiAgfVxuXG4gIC8qKiDQntCx0YDQsNCx0L7RgtGH0LjQutC4INGB0L7QsdGL0YLQuNC5INGBINC30LDQutGA0LXQv9C70LXQvdC90YvQvNC4INC60L7QvdGC0LXQutGB0YLQsNC80LguICovXG4gIHByb3RlY3RlZCBoYW5kbGVNb3VzZURvd25XaXRoQ29udGV4dDogRXZlbnRMaXN0ZW5lciA9IHRoaXMuaGFuZGxlTW91c2VEb3duLmJpbmQodGhpcykgYXMgRXZlbnRMaXN0ZW5lclxuICBwcm90ZWN0ZWQgaGFuZGxlTW91c2VXaGVlbFdpdGhDb250ZXh0OiBFdmVudExpc3RlbmVyID0gdGhpcy5oYW5kbGVNb3VzZVdoZWVsLmJpbmQodGhpcykgYXMgRXZlbnRMaXN0ZW5lclxuICBwcm90ZWN0ZWQgaGFuZGxlTW91c2VNb3ZlV2l0aENvbnRleHQ6IEV2ZW50TGlzdGVuZXIgPSB0aGlzLmhhbmRsZU1vdXNlTW92ZS5iaW5kKHRoaXMpIGFzIEV2ZW50TGlzdGVuZXJcbiAgcHJvdGVjdGVkIGhhbmRsZU1vdXNlVXBXaXRoQ29udGV4dDogRXZlbnRMaXN0ZW5lciA9IHRoaXMuaGFuZGxlTW91c2VVcC5iaW5kKHRoaXMpIGFzIEV2ZW50TGlzdGVuZXJcblxuICAvKiog0KXQtdC70L/QtdGAINCx0YPQtNC10YIg0LjQvNC10YLRjCDQv9C+0LvQvdGL0Lkg0LTQvtGB0YLRg9C/INC6INGN0LrQt9C10LzQv9C70Y/RgNGDIFNQbG90LiAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICByZWFkb25seSBzcGxvdDogU1Bsb3RcbiAgKSB7IH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQn9C+0LTQs9C+0YLQsNCy0LvQuNCy0LDQtdGCINGF0LXQu9C/0LXRgCDQuiDQuNGB0L/QvtC70YzQt9C+0LLQsNC90LjRji5cbiAgICovXG4gIHNldHVwKCk6IHZvaWQge1xuXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQl9Cw0L/Rg9GB0LrQsNC10YIg0L/RgNC+0YHQu9GD0YjQutGDINGB0L7QsdGL0YLQuNC5INC80YvRiNC4LlxuICAgKi9cbiAgcHVibGljIHJ1bigpOiB2b2lkIHtcbiAgICB0aGlzLnNwbG90LmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLmhhbmRsZU1vdXNlRG93bldpdGhDb250ZXh0KVxuICAgIHRoaXMuc3Bsb3QuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ3doZWVsJywgdGhpcy5oYW5kbGVNb3VzZVdoZWVsV2l0aENvbnRleHQpXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQntGB0YLQsNC90LDQstC70LjQstCw0LXRgiDQv9GA0L7RgdC70YPRiNC60YMg0YHQvtCx0YvRgtC40Lkg0LzRi9GI0LguXG4gICAqL1xuICBwdWJsaWMgc3RvcCgpOiB2b2lkIHtcbiAgICB0aGlzLnNwbG90LmNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLmhhbmRsZU1vdXNlRG93bldpdGhDb250ZXh0KVxuICAgIHRoaXMuc3Bsb3QuY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3doZWVsJywgdGhpcy5oYW5kbGVNb3VzZVdoZWVsV2l0aENvbnRleHQpXG4gICAgdGhpcy5zcGxvdC5jYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5oYW5kbGVNb3VzZU1vdmVXaXRoQ29udGV4dClcbiAgICB0aGlzLnNwbG90LmNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5oYW5kbGVNb3VzZVVwV2l0aENvbnRleHQpXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQodC+0LfQtNCw0LXRgiDQvNCw0YLRgNC40YbRgyDQtNC70Y8g0YLQtdC60YPRidC10LPQviDQv9C+0LvQvtC20LXQvdC40Y8g0L7QsdC70LDRgdGC0Lgg0L/RgNC+0YHQvNC+0YLRgNCwLlxuICAgKi9cbiAgcHJvdGVjdGVkIG1ha2VDYW1lcmFNYXRyaXgoKTogbnVtYmVyW10ge1xuXG4gICAgY29uc3Qgem9vbVNjYWxlID0gMSAvIHRoaXMuc3Bsb3QuY2FtZXJhLnpvb20hXG5cbiAgICBsZXQgY2FtZXJhTWF0ID0gbTMuaWRlbnRpdHkoKVxuICAgIGNhbWVyYU1hdCA9IG0zLnRyYW5zbGF0ZShjYW1lcmFNYXQsIHRoaXMuc3Bsb3QuY2FtZXJhLnghLCB0aGlzLnNwbG90LmNhbWVyYS55ISlcbiAgICBjYW1lcmFNYXQgPSBtMy5zY2FsZShjYW1lcmFNYXQsIHpvb21TY2FsZSwgem9vbVNjYWxlKVxuXG4gICAgcmV0dXJuIGNhbWVyYU1hdFxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0J7QsdC90L7QstC70Y/QtdGCINC80LDRgtGA0LjRhtGDINGC0YDQsNC90YHRhNC+0YDQvNCw0YbQuNC4LlxuICAgKi9cbiAgcHVibGljIHVwZGF0ZVZpZXdQcm9qZWN0aW9uKCk6IHZvaWQge1xuICAgIGNvbnN0IHByb2plY3Rpb25NYXQgPSBtMy5wcm9qZWN0aW9uKHRoaXMuc3Bsb3QuY2FudmFzLndpZHRoLCB0aGlzLnNwbG90LmNhbnZhcy5oZWlnaHQpXG4gICAgY29uc3QgY2FtZXJhTWF0ID0gdGhpcy5tYWtlQ2FtZXJhTWF0cml4KClcbiAgICBsZXQgdmlld01hdCA9IG0zLmludmVyc2UoY2FtZXJhTWF0KVxuICAgIHRoaXMudHJhbnNmb3JtLnZpZXdQcm9qZWN0aW9uTWF0ID0gbTMubXVsdGlwbHkocHJvamVjdGlvbk1hdCwgdmlld01hdClcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCf0YDQtdC+0LHRgNCw0LfRg9C10YIg0LrQvtC+0YDQtNC40L3QsNGC0Ysg0LzRi9GI0Lgg0LIgR0wt0LrQvtC+0YDQtNC40L3QsNGC0YsuXG4gICAqL1xuICBwcm90ZWN0ZWQgZ2V0Q2xpcFNwYWNlTW91c2VQb3NpdGlvbihldmVudDogTW91c2VFdmVudCk6IG51bWJlcltdIHtcblxuICAgIC8qKiDQoNCw0YHRh9C10YIg0L/QvtC70L7QttC10L3QuNGPINC60LDQvdCy0LDRgdCwINC/0L4g0L7RgtC90L7RiNC10L3QuNGOINC6INC80YvRiNC4LiAqL1xuICAgIGNvbnN0IHJlY3QgPSB0aGlzLnNwbG90LmNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgIGNvbnN0IGNzc1ggPSBldmVudC5jbGllbnRYIC0gcmVjdC5sZWZ0XG4gICAgY29uc3QgY3NzWSA9IGV2ZW50LmNsaWVudFkgLSByZWN0LnRvcFxuXG4gICAgLyoqINCd0L7RgNC80LDQu9C40LfQsNGG0LjRjyDQutC+0L7RgNC00LjQvdCw0YIgWzAuLjFdICovXG4gICAgY29uc3Qgbm9ybVggPSBjc3NYIC8gdGhpcy5zcGxvdC5jYW52YXMuY2xpZW50V2lkdGhcbiAgICBjb25zdCBub3JtWSA9IGNzc1kgLyB0aGlzLnNwbG90LmNhbnZhcy5jbGllbnRIZWlnaHRcblxuICAgIC8qKiDQn9C+0LvRg9GH0LXQvdC40LUgR0wt0LrQvtC+0YDQtNC40L3QsNGCIFstMS4uMV0gKi9cbiAgICBjb25zdCBjbGlwWCA9IG5vcm1YICogMiAtIDFcbiAgICBjb25zdCBjbGlwWSA9IG5vcm1ZICogLTIgKyAxXG5cbiAgICByZXR1cm4gW2NsaXBYLCBjbGlwWV1cbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCf0LXRgNC10LzQtdGJ0LDQtdGCINC+0LHQu9Cw0YHRgtGMINCy0LjQtNC40LzQvtGB0YLQuC5cbiAgICovXG4gIHByb3RlY3RlZCBtb3ZlQ2FtZXJhKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG5cbiAgICBjb25zdCBwb3MgPSBtMy50cmFuc2Zvcm1Qb2ludCh0aGlzLnRyYW5zZm9ybS5zdGFydEludlZpZXdQcm9qTWF0LCB0aGlzLmdldENsaXBTcGFjZU1vdXNlUG9zaXRpb24oZXZlbnQpKVxuXG4gICAgdGhpcy5zcGxvdC5jYW1lcmEueCA9IHRoaXMudHJhbnNmb3JtLnN0YXJ0Q2FtZXJhLnghICsgdGhpcy50cmFuc2Zvcm0uc3RhcnRQb3NbMF0gLSBwb3NbMF1cbiAgICB0aGlzLnNwbG90LmNhbWVyYS55ID0gdGhpcy50cmFuc2Zvcm0uc3RhcnRDYW1lcmEueSEgKyB0aGlzLnRyYW5zZm9ybS5zdGFydFBvc1sxXSAtIHBvc1sxXVxuXG4gICAgdGhpcy5zcGxvdC5yZW5kZXIoKVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0KDQtdCw0LPQuNGA0YPQtdGCINC90LAg0LTQstC40LbQtdC90LjQtSDQvNGL0YjQuCDQsiDQvNC+0LzQtdC90YIsINC60L7Qs9C00LAg0LXQtSDQutC70LDQstC40YjQsCDRg9C00LXRgNC20LjQstCw0LXRgtGB0Y8g0L3QsNC20LDRgtC+0LkuINCc0LXRgtC+0LQg0L/QtdGA0LXQvNC10YnQsNC10YIg0L7QsdC70LDRgdGC0Ywg0LLQuNC00LjQvNC+0YHRgtC4INC90LBcbiAgICog0L/Qu9C+0YHQutC+0YHRgtC4INCy0LzQtdGB0YLQtSDRgSDQtNCy0LjQttC10L3QuNC10Lwg0LzRi9GI0LguXG4gICAqL1xuICBwcm90ZWN0ZWQgaGFuZGxlTW91c2VNb3ZlKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG4gICAgdGhpcy5tb3ZlQ2FtZXJhKGV2ZW50KVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0KDQtdCw0LPQuNGA0YPQtdGCINC90LAg0L7RgtC20LDRgtC40LUg0LrQu9Cw0LLQuNGI0Lgg0LzRi9GI0LguINCSINC80L7QvNC10L3RgiDQvtGC0LbQsNGC0LjRjyDQutC70LDQstC40YjQuCDQsNC90LDQu9C40Lcg0LTQstC40LbQtdC90LjRjyDQvNGL0YjQuCDRgSDQt9Cw0LbQsNGC0L7QuSDQutC70LDQstC40YjQtdC5INC/0YDQtdC60YDQsNGJ0LDQtdGC0YHRjy5cbiAgICovXG4gIHByb3RlY3RlZCBoYW5kbGVNb3VzZVVwKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG5cbiAgICB0aGlzLnNwbG90LnJlbmRlcigpXG5cbiAgICBldmVudC50YXJnZXQhLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMuaGFuZGxlTW91c2VNb3ZlV2l0aENvbnRleHQpXG4gICAgZXZlbnQudGFyZ2V0IS5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5oYW5kbGVNb3VzZVVwV2l0aENvbnRleHQpXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQoNC10LDQs9C40YDRg9C10YIg0L3QsCDQvdCw0LbQsNGC0LjQtSDQutC70LDQstC40YjQuCDQvNGL0YjQuC4g0JIg0LzQvtC80LXQvdGCINC90LDQttCw0YLQuNGPINC4INGD0LTQtdGA0LbQsNC90LjRjyDQutC70LDQstC40YjQuCDQt9Cw0L/Rg9GB0LrQsNC10YLRgdGPINCw0L3QsNC70LjQtyDQtNCy0LjQttC10L3QuNGPINC80YvRiNC4ICjRgSDQt9Cw0LbQsNGC0L7QuVxuICAgKiDQutC70LDQstC40YjQtdC5KS5cbiAgICovXG4gIHByb3RlY3RlZCBoYW5kbGVNb3VzZURvd24oZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcblxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcblxuICAgIHRoaXMuc3Bsb3QuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMuaGFuZGxlTW91c2VNb3ZlV2l0aENvbnRleHQpXG4gICAgdGhpcy5zcGxvdC5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuaGFuZGxlTW91c2VVcFdpdGhDb250ZXh0KVxuXG4gICAgLyoqINCg0LDRgdGH0LXRgiDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuS4gKi9cbiAgICB0aGlzLnRyYW5zZm9ybS5zdGFydEludlZpZXdQcm9qTWF0ID0gbTMuaW52ZXJzZSh0aGlzLnRyYW5zZm9ybS52aWV3UHJvamVjdGlvbk1hdClcbiAgICB0aGlzLnRyYW5zZm9ybS5zdGFydENhbWVyYSA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3Bsb3QuY2FtZXJhKVxuICAgIHRoaXMudHJhbnNmb3JtLnN0YXJ0Q2xpcFBvcyA9IHRoaXMuZ2V0Q2xpcFNwYWNlTW91c2VQb3NpdGlvbihldmVudClcbiAgICB0aGlzLnRyYW5zZm9ybS5zdGFydFBvcyA9IG0zLnRyYW5zZm9ybVBvaW50KHRoaXMudHJhbnNmb3JtLnN0YXJ0SW52Vmlld1Byb2pNYXQsIHRoaXMudHJhbnNmb3JtLnN0YXJ0Q2xpcFBvcylcbiAgICB0aGlzLnRyYW5zZm9ybS5zdGFydE1vdXNlUG9zID0gW2V2ZW50LmNsaWVudFgsIGV2ZW50LmNsaWVudFldXG5cbiAgICB0aGlzLnNwbG90LnJlbmRlcigpXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQoNC10LDQs9C40YDRg9C10YIg0L3QsCDQt9GD0LzQuNGA0L7QstCw0L3QuNC1INC80YvRiNC4LiDQkiDQvNC+0LzQtdC90YIg0LfRg9C80LjRgNC+0LLQsNC90LjRjyDQvNGL0YjQuCDQv9GA0L7QuNGB0YXQvtC00LjRgiDQt9GD0LzQuNGA0L7QstCw0L3QuNC1INC60L7QvtGA0LTQuNC90LDRgtC90L7QuSDQv9C70L7RgdC60L7RgdGC0LguXG4gICAqL1xuICBwcm90ZWN0ZWQgaGFuZGxlTW91c2VXaGVlbChldmVudDogV2hlZWxFdmVudCk6IHZvaWQge1xuXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuXG4gICAgLyoqINCS0YvRh9C40YHQu9C10L3QuNC1INC/0L7Qt9C40YbQuNC4INC80YvRiNC4INCyIEdMLdC60L7QvtGA0LTQuNC90LDRgtCw0YUuICovXG4gICAgY29uc3QgW2NsaXBYLCBjbGlwWV0gPSB0aGlzLmdldENsaXBTcGFjZU1vdXNlUG9zaXRpb24oZXZlbnQpXG5cbiAgICAvKiog0J/QvtC30LjRhtC40Y8g0LzRi9GI0Lgg0LTQviDQt9GD0LzQuNGA0L7QstCw0L3QuNGPLiAqL1xuICAgIGNvbnN0IFtwcmVab29tWCwgcHJlWm9vbVldID0gbTMudHJhbnNmb3JtUG9pbnQobTMuaW52ZXJzZSh0aGlzLnRyYW5zZm9ybS52aWV3UHJvamVjdGlvbk1hdCksIFtjbGlwWCwgY2xpcFldKVxuXG4gICAgLyoqINCd0L7QstC+0LUg0LfQvdCw0YfQtdC90LjQtSDQt9GD0LzQsCDQvtCx0LvQsNGB0YLQuCDQv9GA0L7RgdC80L7RgtGA0LAg0Y3QutGB0L/QvtC90LXQvdGG0LjQsNC70YzQvdC+INC30LDQstC40YHQuNGCINC+0YIg0LLQtdC70LjRh9C40L3RiyDQt9GD0LzQuNGA0L7QstCw0L3QuNGPINC80YvRiNC4LiAqL1xuICAgIGNvbnN0IG5ld1pvb20gPSB0aGlzLnNwbG90LmNhbWVyYS56b29tISAqIE1hdGgucG93KDIsIGV2ZW50LmRlbHRhWSAqIC0wLjAxKVxuXG4gICAgLyoqINCc0LDQutGB0LjQvNCw0LvRjNC90L7QtSDQuCDQvNC40L3QuNC80LDQu9GM0L3QvtC1INC30L3QsNGH0LXQvdC40Y8g0LfRg9C80LAg0L7QsdC70LDRgdGC0Lgg0L/RgNC+0YHQvNC+0YLRgNCwLiAqL1xuICAgIHRoaXMuc3Bsb3QuY2FtZXJhLnpvb20gPSBNYXRoLm1heCgwLjAwMiwgTWF0aC5taW4oMjAwLCBuZXdab29tKSlcblxuICAgIC8qKiDQntCx0L3QvtCy0LvQtdC90LjQtSDQvNCw0YLRgNC40YbRiyDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuC4gKi9cbiAgICB0aGlzLnVwZGF0ZVZpZXdQcm9qZWN0aW9uKClcblxuICAgIC8qKiDQn9C+0LfQuNGG0LjRjyDQvNGL0YjQuCDQv9C+0YHQu9C1INC30YPQvNC40YDQvtCy0LDQvdC40Y8uICovXG4gICAgY29uc3QgW3Bvc3Rab29tWCwgcG9zdFpvb21ZXSA9IG0zLnRyYW5zZm9ybVBvaW50KG0zLmludmVyc2UodGhpcy50cmFuc2Zvcm0udmlld1Byb2plY3Rpb25NYXQpLCBbY2xpcFgsIGNsaXBZXSlcblxuICAgIC8qKiDQktGL0YfQuNGB0LvQtdC90LjQtSDQvdC+0LLQvtCz0L4g0L/QvtC70L7QttC10L3QuNGPINC+0LHQu9Cw0YHRgtC4INC/0YDQvtGB0LzQvtGC0YDQsCDQv9C+0YHQu9C1INC30YPQvNC40YDQvtCy0LDQvdC40Y8uICovXG4gICAgdGhpcy5zcGxvdC5jYW1lcmEueCEgKz0gcHJlWm9vbVggLSBwb3N0Wm9vbVhcbiAgICB0aGlzLnNwbG90LmNhbWVyYS55ISArPSBwcmVab29tWSAtIHBvc3Rab29tWVxuXG4gICAgdGhpcy5zcGxvdC5yZW5kZXIoKVxuICB9XG59XG4iLCJpbXBvcnQgU1Bsb3QgZnJvbSAnLi9zcGxvdCdcbmltcG9ydCB7IGdldEN1cnJlbnRUaW1lIH0gZnJvbSAnLi91dGlscydcblxuLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqXG4gKiDQmtC70LDRgdGBLdGF0LXQu9C/0LXRgCwg0YDQtdCw0LvQuNC30YPRjtGJ0LjQuSDQv9C+0LTQtNC10YDQttC60YMg0YDQtdC20LjQvNCwINC+0YLQu9Cw0LTQutC4INC00LvRjyDQutC70LDRgdGB0LAgU1Bsb3QuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNQbG90RGVidWcgaW1wbGVtZW50cyBTUGxvdEhlbHBlciB7XG5cbiAgLyoqINCf0YDQuNC30L3QsNC6INCw0LrRgtC40LLQsNGG0LjQuCDRgNC10LbQuNC8INC+0YLQu9Cw0LTQutC4LiAqL1xuICBwdWJsaWMgaXNFbmFibGU6IGJvb2xlYW4gPSBmYWxzZVxuXG4gIC8qKiDQodGC0LjQu9GMINC30LDQs9C+0LvQvtCy0LrQsCDRgNC10LbQuNC80LAg0L7RgtC70LDQtNC60LguICovXG4gIHB1YmxpYyBoZWFkZXJTdHlsZTogc3RyaW5nID0gJ2ZvbnQtd2VpZ2h0OiBib2xkOyBjb2xvcjogI2ZmZmZmZjsgYmFja2dyb3VuZC1jb2xvcjogI2NjMDAwMDsnXG5cbiAgLyoqINCh0YLQuNC70Ywg0LfQsNCz0L7Qu9C+0LLQutCwINCz0YDRg9C/0L/RiyDQv9Cw0YDQsNC80LXRgtGA0L7Qsi4gKi9cbiAgcHVibGljIGdyb3VwU3R5bGU6IHN0cmluZyA9ICdmb250LXdlaWdodDogYm9sZDsgY29sb3I6ICNmZmZmZmY7J1xuXG4gIC8qKiDQpdC10LvQv9C10YAg0LHRg9C00LXRgiDQuNC80LXRgtGMINC/0L7Qu9C90YvQuSDQtNC+0YHRgtGD0L8g0Log0Y3QutC30LXQvNC/0LvRj9GA0YMgU1Bsb3QuICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIHJlYWRvbmx5IHNwbG90OiBTUGxvdFxuICApIHt9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0J/QvtC00LPQvtGC0LDQstC70LjQstCw0LXRgiDRhdC10LvQv9C10YAg0Log0LjRgdC/0L7Qu9GM0LfQvtCy0LDQvdC40Y4uXG4gICAqL1xuICBwdWJsaWMgc2V0dXAoY2xlYXJDb25zb2xlOiBib29sZWFuID0gZmFsc2UpOiB2b2lkIHtcbiAgICBpZiAoY2xlYXJDb25zb2xlKSB7XG4gICAgICBjb25zb2xlLmNsZWFyKClcbiAgICB9XG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQktGL0LLQvtC00LjRgiDQsiDQutC+0L3RgdC+0LvRjCDQvtGC0LvQsNC00L7Rh9C90YPRjiDQuNC90YTQvtGA0LzQsNGG0LjRjiwg0LXRgdC70Lgg0LLQutC70Y7Rh9C10L0g0YDQtdC20LjQvCDQvtGC0LvQsNC00LrQuC5cbiAgICpcbiAgICogQHJlbWFya3NcbiAgICog0J7RgtC70LDQtNC+0YfQvdCw0Y8g0LjQvdGE0L7RgNC80LDRhtC40Y8g0LLRi9Cy0L7QtNC40YLRgdGPINCx0LvQvtC60LDQvNC4LiDQndCw0LfQstCw0L3QuNGPINCx0LvQvtC60L7QsiDQv9C10YDQtdC00LDRjtGC0YHRjyDQsiDQvNC10YLQvtC0INC/0LXRgNC10YfQuNGB0LvQtdC90LjQtdC8INGB0YLRgNC+0LouINCa0LDQttC00LDRjyDRgdGC0YDQvtC60LBcbiAgICog0LjQvdGC0LXRgNC/0YDQtdGC0LjRgNGD0LXRgtGB0Y8g0LrQsNC6INC40LzRjyDQvNC10YLQvtC00LAuINCV0YHQu9C4INC90YPQttC90YvQtSDQvNC10YLQvtC00Ysg0LLRi9Cy0L7QtNCwINCx0LvQvtC60LAg0YHRg9GJ0LXRgdGC0LLRg9GO0YIgLSDQvtC90Lgg0LLRi9C30YvQstCw0Y7RgtGB0Y8uINCV0YHQu9C4INC80LXRgtC+0LTQsCDRgSDQvdGD0LbQvdGL0LxcbiAgICog0L3QsNC30LLQsNC90LjQtdC8INC90LUg0YHRg9GJ0LXRgdGC0LLRg9C10YIgLSDQs9C10L3QtdGA0LjRgNGD0LXRgtGB0Y8g0L7RiNC40LHQutCwLlxuICAgKlxuICAgKiBAcGFyYW0gbG9nSXRlbXMgLSDQn9C10YDQtdGH0LjRgdC70LXQvdC40LUg0YHRgtGA0L7QuiDRgSDQvdCw0LfQstCw0L3QuNGP0LzQuCDQvtGC0LvQsNC00L7Rh9C90YvRhSDQsdC70L7QutC+0LIsINC60L7RgtC+0YDRi9C1INC90YPQttC90L4g0L7RgtC+0LHRgNCw0LfQuNGC0Ywg0LIg0LrQvtC90YHQvtC70LguXG4gICAqL1xuICBwdWJsaWMgbG9nKC4uLmxvZ0l0ZW1zOiBzdHJpbmdbXSk6IHZvaWQge1xuICAgIGlmICh0aGlzLmlzRW5hYmxlKSB7XG4gICAgICBsb2dJdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICBpZiAodHlwZW9mICh0aGlzIGFzIGFueSlbaXRlbV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAodGhpcyBhcyBhbnkpW2l0ZW1dKClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ9Ce0YLQu9Cw0LTQvtGH0L3QvtCz0L4g0LHQu9C+0LrQsCAnICsgaXRlbSArICdcIiDQvdC1INGB0YPRidC10YHRgtCy0YPQtdGCIScpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JLRi9Cy0L7QtNC40YIg0YHQvtC+0LHRidC10L3QuNC1INC+0LEg0L7RiNC40LHQutC1LlxuICAgKi9cbiAgcHVibGljIGVycm9yKG1lc3NhZ2U6IHN0cmluZyk6IHZvaWQge1xuICAgIGlmICh0aGlzLmlzRW5hYmxlKSB7XG4gICAgICBjb25zb2xlLmVycm9yKG1lc3NhZ2UpXG4gICAgfVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JLRi9Cy0L7QtNC40YIg0LLRgdGC0YPQv9C40YLQtdC70YzQvdGD0Y4g0YfQsNGB0YLRjCDQviDRgNC10LbQuNC80LUg0L7RgtC70LDQtNC60LguXG4gICAqL1xuICBwdWJsaWMgaW50cm8oKTogdm9pZCB7XG4gICAgY29uc29sZS5sb2coJyVj0J7RgtC70LDQtNC60LAgU1Bsb3Qg0L3QsCDQvtCx0YrQtdC60YLQtSAjJyArIHRoaXMuc3Bsb3QuY2FudmFzLmlkLCB0aGlzLmhlYWRlclN0eWxlKVxuXG4gICAgaWYgKHRoaXMuc3Bsb3QuZGVtby5pc0VuYWJsZSkge1xuICAgICAgY29uc29sZS5sb2coJyVj0JLQutC70Y7Rh9C10L0g0LTQtdC80L7QvdGB0YLRgNCw0YbQuNC+0L3QvdGL0Lkg0YDQtdC20LjQvCDQtNCw0L3QvdGL0YUnLCB0aGlzLmdyb3VwU3R5bGUpXG4gICAgfVxuXG4gICAgY29uc29sZS5ncm91cCgnJWPQn9GA0LXQtNGD0L/RgNC10LbQtNC10L3QuNC1JywgdGhpcy5ncm91cFN0eWxlKVxuICAgIGNvbnNvbGUubG9nKCfQntGC0LrRgNGL0YLQsNGPINC60L7QvdGB0L7Qu9GMINCx0YDQsNGD0LfQtdGA0LAg0Lgg0LTRgNGD0LPQuNC1INCw0LrRgtC40LLQvdGL0LUg0YHRgNC10LTRgdGC0LLQsCDQutC+0L3RgtGA0L7Qu9GPINGA0LDQt9GA0LDQsdC+0YLQutC4INGB0YPRidC10YHRgtCy0LXQvdC90L4g0YHQvdC40LbQsNGO0YIg0L/RgNC+0LjQt9Cy0L7QtNC40YLQtdC70YzQvdC+0YHRgtGMINCy0YvRgdC+0LrQvtC90LDQs9GA0YPQttC10L3QvdGL0YUg0L/RgNC40LvQvtC20LXQvdC40LkuINCU0LvRjyDQvtCx0YrQtdC60YLQuNCy0L3QvtCz0L4g0LDQvdCw0LvQuNC30LAg0L/RgNC+0LjQt9Cy0L7QtNC40YLQtdC70YzQvdC+0YHRgtC4INCy0YHQtSDQv9C+0LTQvtCx0L3Ri9C1INGB0YDQtdC00YHRgtCy0LAg0LTQvtC70LbQvdGLINCx0YvRgtGMINC+0YLQutC70Y7Rh9C10L3Riywg0LAg0LrQvtC90YHQvtC70Ywg0LHRgHrQsNGD0LfQtdGA0LAg0LfQsNC60YDRi9GC0LAuINCd0LXQutC+0YLQvtGA0YvQtSDQtNCw0L3QvdGL0LUg0L7RgtC70LDQtNC+0YfQvdC+0Lkg0LjQvdGE0L7RgNC80LDRhtC40Lgg0LIg0LfQsNCy0LjRgdC40LzQvtGB0YLQuCDQvtGCINC40YHQv9C+0LvRjNC30YPQtdC80L7Qs9C+INCx0YDQsNGD0LfQtdGA0LAg0LzQvtCz0YPRgiDQvdC1INC+0YLQvtCx0YDQsNC20LDRgtGM0YHRjyDQuNC70Lgg0L7RgtC+0LHRgNCw0LbQsNGC0YzRgdGPINC90LXQutC+0YDRgNC10LrRgtC90L4uINCh0YDQtdC00YHRgtCy0L4g0L7RgtC70LDQtNC60Lgg0L/RgNC+0YLQtdGB0YLQuNGA0L7QstCw0L3QviDQsiDQsdGA0LDRg9C30LXRgNC1IEdvb2dsZSBDaHJvbWUgdi45MCcpXG4gICAgY29uc29sZS5ncm91cEVuZCgpXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQktGL0LLQvtC00LjRgiDQuNC90YTQvtGA0LzQsNGG0LjRjiDQviDQs9GA0LDRhNC40YfQtdGB0LrQvtC5INGB0LjRgdGC0LXQvNC1INC60LvQuNC10L3RgtCwLlxuICAgKi9cbiAgcHVibGljIGdwdSgpOiB2b2lkIHtcbiAgICBjb25zb2xlLmdyb3VwKCclY9CS0LjQtNC10L7RgdC40YHRgtC10LzQsCcsIHRoaXMuZ3JvdXBTdHlsZSlcbiAgICBjb25zb2xlLmxvZygn0JPRgNCw0YTQuNGH0LXRgdC60LDRjyDQutCw0YDRgtCwOiAnICsgdGhpcy5zcGxvdC53ZWJnbC5ncHUuaGFyZHdhcmUpXG4gICAgY29uc29sZS5sb2coJ9CS0LXRgNGB0LjRjyBHTDogJyArIHRoaXMuc3Bsb3Qud2ViZ2wuZ3B1LnNvZnR3YXJlKVxuICAgIGNvbnNvbGUuZ3JvdXBFbmQoKVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JLRi9Cy0L7QtNC40YIg0LjQvdGE0L7RgNC80LDRhtC40Y8g0L4g0YLQtdC60YPRidC10Lwg0Y3QutC30LXQvNC/0LvRj9GA0LUg0LrQu9Cw0YHRgdCwIFNQbG90LlxuICAgKi9cbiAgcHVibGljIGluc3RhbmNlKCk6IHZvaWQge1xuXG4gICAgY29uc29sZS5ncm91cCgnJWPQndCw0YHRgtGA0L7QudC60LAg0L/QsNGA0LDQvNC10YLRgNC+0LIg0Y3QutC30LXQvNC/0LvRj9GA0LAnLCB0aGlzLmdyb3VwU3R5bGUpXG4gICAgY29uc29sZS5kaXIodGhpcy5zcGxvdClcbiAgICBjb25zb2xlLmxvZygn0KDQsNC30LzQtdGAINC60LDQvdCy0LDRgdCwOiAnICsgdGhpcy5zcGxvdC5jYW52YXMud2lkdGggKyAnIHggJyArIHRoaXMuc3Bsb3QuY2FudmFzLmhlaWdodCArICcgcHgnKVxuICAgIGNvbnNvbGUubG9nKCfQoNCw0LfQvNC10YAg0L/Qu9C+0YHQutC+0YHRgtC4OiAnICsgdGhpcy5zcGxvdC5ncmlkLndpZHRoICsgJyB4ICcgKyB0aGlzLnNwbG90LmdyaWQuaGVpZ2h0ICsgJyBweCcpXG5cbiAgICBpZiAodGhpcy5zcGxvdC5kZW1vLmlzRW5hYmxlKSB7XG4gICAgICBjb25zb2xlLmxvZygn0KHQv9C+0YHQvtCxINC/0L7Qu9GD0YfQtdC90LjRjyDQtNCw0L3QvdGL0YU6ICcgKyAn0LTQtdC80L4t0LTQsNC90L3Ri9C1JylcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ9Ch0L/QvtGB0L7QsSDQv9C+0LvRg9GH0LXQvdC40Y8g0LTQsNC90L3Ri9GFOiAnICsgJ9C40YLQtdGA0LjRgNC+0LLQsNC90LjQtScpXG4gICAgfVxuICAgIGNvbnNvbGUuZ3JvdXBFbmQoKVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JLRi9Cy0L7QtNC40YIg0LrQvtC00Ysg0YjQtdC50LTQtdGA0L7Qsi5cbiAgICovXG4gIHB1YmxpYyBzaGFkZXJzKCk6IHZvaWQge1xuICAgIGNvbnNvbGUuZ3JvdXAoJyVj0KHQvtC30LTQsNC9INCy0LXRgNGI0LjQvdC90YvQuSDRiNC10LnQtNC10YA6ICcsIHRoaXMuZ3JvdXBTdHlsZSlcbiAgICBjb25zb2xlLmxvZyh0aGlzLnNwbG90Lmdsc2wudmVydFNoYWRlclNvdXJjZSlcbiAgICBjb25zb2xlLmdyb3VwRW5kKClcbiAgICBjb25zb2xlLmdyb3VwKCclY9Ch0L7Qt9C00LDQvSDRhNGA0LDQs9C80LXQvdGC0L3Ri9C5INGI0LXQudC00LXRgDogJywgdGhpcy5ncm91cFN0eWxlKVxuICAgIGNvbnNvbGUubG9nKHRoaXMuc3Bsb3QuZ2xzbC5mcmFnU2hhZGVyU291cmNlKVxuICAgIGNvbnNvbGUuZ3JvdXBFbmQoKVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JLRi9Cy0L7QtNC40YIg0YHQvtC+0LHRidC10L3QuNC1INC+INC90LDRh9Cw0LvQtSDQv9GA0L7RhtC10YHRgdC1INC30LDQs9GA0YPQt9C60Lgg0LTQsNC90L3Ri9GFLlxuICAgKi9cbiAgcHVibGljIGxvYWRpbmcoKTogdm9pZCB7XG4gICAgY29uc29sZS5sb2coJyVj0JfQsNC/0YPRidC10L0g0L/RgNC+0YbQtdGB0YEg0LfQsNCz0YDRg9C30LrQuCDQtNCw0L3QvdGL0YUgWycgKyBnZXRDdXJyZW50VGltZSgpICsgJ10uLi4nLCB0aGlzLmdyb3VwU3R5bGUpXG4gICAgY29uc29sZS50aW1lKCfQlNC70LjRgtC10LvRjNC90L7RgdGC0YwnKVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JLRi9Cy0L7QtNC40YIg0YHRgtCw0YLQuNGB0YLQuNC60YMg0L/QviDQt9Cw0LLQtdGA0YjQtdC90LjQuCDQv9GA0L7RhtC10YHRgdCwINC30LDQs9GA0YPQt9C60Lgg0LTQsNC90L3Ri9GFLlxuICAgKi9cbiAgcHVibGljIGxvYWRlZCgpOiB2b2lkIHtcbiAgICBjb25zb2xlLmdyb3VwKCclY9CX0LDQs9GA0YPQt9C60LAg0LTQsNC90L3Ri9GFINC30LDQstC10YDRiNC10L3QsCBbJyArIGdldEN1cnJlbnRUaW1lKCkgKyAnXScsIHRoaXMuZ3JvdXBTdHlsZSlcbiAgICBjb25zb2xlLnRpbWVFbmQoJ9CU0LvQuNGC0LXQu9GM0L3QvtGB0YLRjCcpXG4gICAgY29uc29sZS5sb2coJ9Cg0LDRgdGF0L7QtCDQstC40LTQtdC+0L/QsNC80Y/RgtC4OiAnICsgKHRoaXMuc3Bsb3Quc3RhdHMubWVtVXNhZ2UgLyAxMDAwMDAwKS50b0ZpeGVkKDIpLnRvTG9jYWxlU3RyaW5nKCkgKyAnINCc0JEnKVxuICAgIGNvbnNvbGUubG9nKCfQmtC+0Lst0LLQviDQvtCx0YrQtdC60YLQvtCyOiAnICsgdGhpcy5zcGxvdC5zdGF0cy5vYmpUb3RhbENvdW50LnRvTG9jYWxlU3RyaW5nKCkpXG4gICAgY29uc29sZS5sb2coJ9Ca0L7Quy3QstC+INCz0YDRg9C/0L8g0LHRg9GE0LXRgNC+0LI6ICcgKyB0aGlzLnNwbG90LnN0YXRzLmdyb3Vwc0NvdW50LnRvTG9jYWxlU3RyaW5nKCkpXG4gICAgY29uc29sZS5sb2coJ9Cg0LXQt9GD0LvRjNGC0LDRgjogJyArICgodGhpcy5zcGxvdC5zdGF0cy5vYmpUb3RhbENvdW50ID49IHRoaXMuc3Bsb3QuZ2xvYmFsTGltaXQpID9cbiAgICAgICfQtNC+0YHRgtC40LPQvdGD0YIg0LvQuNC80LjRgiDQvtCx0YrQtdC60YLQvtCyICgnICsgdGhpcy5zcGxvdC5nbG9iYWxMaW1pdC50b0xvY2FsZVN0cmluZygpICsgJyknIDpcbiAgICAgICfQvtCx0YDQsNCx0L7RgtCw0L3RiyDQstGB0LUg0L7QsdGK0LXQutGC0YsnKSlcbiAgICBjb25zb2xlLmdyb3VwRW5kKClcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCS0YvQstC+0LTQuNGCINGB0L7QvtCx0YnQtdC90LjQtSDQviDQt9Cw0L/Rg9GB0LrQtSDRgNC10L3QtNC10YDQsC5cbiAgICovXG4gIHB1YmxpYyBzdGFydGVkKCk6IHZvaWQge1xuICAgIGNvbnNvbGUubG9nKCclY9Cg0LXQvdC00LXRgCDQt9Cw0L/Rg9GJ0LXQvScsIHRoaXMuZ3JvdXBTdHlsZSlcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCS0YvQstC+0LTQuNGCINGB0L7QvtCx0YnQtdC90LjQtSDQvtCxINC+0YHRgtCw0L3QvtCy0LrQtSDRgNC10L3QtNC10YDQsC5cbiAgICovXG4gIHB1YmxpYyBzdG9wZWQoKTogdm9pZCB7XG4gICAgY29uc29sZS5sb2coJyVj0KDQtdC90LTQtdGAINC+0YHRgtCw0L3QvtCy0LvQtdC9JywgdGhpcy5ncm91cFN0eWxlKVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JLRi9Cy0L7QtNC40YIg0YHQvtC+0LHRiNC10L3QuNC1INC+0LEg0L7Rh9C40YHRgtC60LUg0L7QsdC70LDRgdGC0Lgg0YDQtdC90LTQtdGA0LAuXG4gICAqL1xuICBwdWJsaWMgY2xlYXJlZChjb2xvcjogc3RyaW5nKTogdm9pZCB7XG4gICAgY29uc29sZS5sb2coJyVj0J7QsdC70LDRgdGC0Ywg0YDQtdC90LTQtdGA0LAg0L7Rh9C40YnQtdC90LAgWycgKyBjb2xvciArICddJywgdGhpcy5ncm91cFN0eWxlKTtcbiAgfVxufVxuIiwiaW1wb3J0IFNQbG90IGZyb20gJy4vc3Bsb3QnXG5pbXBvcnQgeyByYW5kb21JbnQgfSBmcm9tICcuL3V0aWxzJ1xuXG4vKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICpcbiAqINCa0LvQsNGB0YEt0YXQtdC70L/QtdGALCDRgNC10LDQu9C40LfRg9GO0YnQuNC5INC/0L7QtNC00LXRgNC20LrRgyDRgNC10LbQuNC80LAg0LTQtdC80L7QvdGB0YLRgNCw0YbQuNC+0L3QvdGL0YUg0LTQsNC90L3Ri9GFINC00LvRjyDQutC70LDRgdGB0LAgU1Bsb3QuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNQbG90RGVtbyBpbXBsZW1lbnRzIFNQbG90SGVscGVyIHtcblxuICAvKiog0J/RgNC40LfQvdCw0Log0LDQutGC0LjQstCw0YbQuNC4INC00LXQvNC+LdGA0LXQttC40LzQsC4gKi9cbiAgcHVibGljIGlzRW5hYmxlOiBib29sZWFuID0gZmFsc2VcblxuICAvKiog0JrQvtC70LjRh9C10YHRgtCy0L4g0LHRitC10LrRgtC+0LIuICovXG4gIHB1YmxpYyBhbW91bnQ6IG51bWJlciA9IDFfMDAwXzAwMFxuXG4gIC8qKiDQnNC40L3QuNC80LDQu9GM0L3Ri9C5INGA0LDQt9C80LXRgCDQvtCx0YrQtdC60YLQvtCyLiAqL1xuICBwdWJsaWMgc2l6ZU1pbjogbnVtYmVyID0gMTBcblxuICAvKiog0JzQsNC60YHQuNC80LDQu9GM0L3Ri9C5INGA0LDQt9C80LXRgCDQvtCx0YrQtdC60YLQvtCyLiAqL1xuICBwdWJsaWMgc2l6ZU1heDogbnVtYmVyID0gMzBcblxuICAvKiog0KbQstC10YLQvtCy0LDRjyDQv9Cw0LvQuNGC0YDQsCDQvtCx0YrQtdC60YLQvtCyLiAqL1xuICBwdWJsaWMgY29sb3JzOiBzdHJpbmdbXSA9IFtcbiAgICAnI0Q4MUMwMScsICcjRTk5NjdBJywgJyNCQTU1RDMnLCAnI0ZGRDcwMCcsICcjRkZFNEI1JywgJyNGRjhDMDAnLFxuICAgICcjMjI4QjIyJywgJyM5MEVFOTAnLCAnIzQxNjlFMScsICcjMDBCRkZGJywgJyM4QjQ1MTMnLCAnIzAwQ0VEMSdcbiAgXVxuXG4gIC8qKiDQodGH0LXRgtGH0LjQuiDQuNGC0LXRgNC40YDRg9C10LzRi9GFINC+0LHRitC10LrRgtC+0LIuICovXG4gIHByaXZhdGUgaW5kZXg6IG51bWJlciA9IDBcblxuICAvKiog0KXQtdC70L/QtdGAINCx0YPQtNC10YIg0LjQvNC10YLRjCDQv9C+0LvQvdGL0Lkg0LTQvtGB0YLRg9C/INC6INGN0LrQt9C10LzQv9C70Y/RgNGDIFNQbG90LiAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICByZWFkb25seSBzcGxvdDogU1Bsb3RcbiAgKSB7fVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCf0L7QtNCz0L7RgtCw0LLQu9C40LLQsNC10YIg0YXQtdC70L/QtdGAINC6INC40YHQv9C+0LvRjNC30L7QstCw0L3QuNGOLlxuICAgKi9cbiAgcHVibGljIHNldHVwKCk6IHZvaWQge1xuXG4gICAgLyoqINCe0LHQvdGD0LvQtdC90LjQtSDRgdGH0LXRgtGH0LjQutCwINC40YLQtdGA0LDRgtC+0YDQsC4gKi9cbiAgICB0aGlzLmluZGV4ID0gMFxuXG4gICAgLyoqINCf0L7QtNCz0L7RgtC+0LLQutCwINC00LXQvNC+LdGA0LXQttC40LzQsCAo0LXRgdC70Lgg0YLRgNC10LHRg9C10YLRgdGPKS4gKi9cbiAgICBpZiAodGhpcy5zcGxvdC5kZW1vLmlzRW5hYmxlKSB7XG4gICAgICB0aGlzLnNwbG90Lml0ZXJhdG9yID0gdGhpcy5zcGxvdC5kZW1vLml0ZXJhdG9yLmJpbmQodGhpcylcbiAgICAgIHRoaXMuc3Bsb3QuY29sb3JzID0gdGhpcy5zcGxvdC5kZW1vLmNvbG9yc1xuICAgIH1cbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCY0LzQuNGC0LjRgNGD0LXRgiDQuNGC0LXRgNCw0YLQvtGAINC40YHRhdC+0LTQvdGL0YUg0L7QsdGK0LXQutGC0L7Qsi5cbiAgICovXG4gIHB1YmxpYyBpdGVyYXRvcigpOiBTUGxvdE9iamVjdCB8IG51bGwge1xuICAgIGlmICh0aGlzLmluZGV4IDwgdGhpcy5hbW91bnQpIHtcbiAgICAgIHRoaXMuaW5kZXgrK1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgeDogcmFuZG9tSW50KHRoaXMuc3Bsb3QuZ3JpZC53aWR0aCEpLFxuICAgICAgICB5OiByYW5kb21JbnQodGhpcy5zcGxvdC5ncmlkLmhlaWdodCEpLFxuICAgICAgICBzaGFwZTogcmFuZG9tSW50KHRoaXMuc3Bsb3Quc2hhcGVzQ291bnQpLFxuICAgICAgICBzaXplOiB0aGlzLnNpemVNaW4gKyByYW5kb21JbnQodGhpcy5zaXplTWF4IC0gdGhpcy5zaXplTWluICsgMSksXG4gICAgICAgIGNvbG9yOiByYW5kb21JbnQodGhpcy5jb2xvcnMubGVuZ3RoKVxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgU1Bsb3QgZnJvbSAnLi9zcGxvdCdcbmltcG9ydCAqIGFzIHNoYWRlcnMgZnJvbSAnLi9zaGFkZXJzJ1xuaW1wb3J0IHsgY29sb3JGcm9tSGV4VG9HbFJnYiB9IGZyb20gJy4vdXRpbHMnXG5cbi8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKlxuICog0JrQu9Cw0YHRgS3RhdC10LvQv9C10YAsINGD0L/RgNCw0LLQu9GP0Y7RidC40LkgR0xTTC3QutC+0LTQvtC8INGI0LXQudC00LXRgNC+0LIuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNQbG90R2xzbCBpbXBsZW1lbnRzIFNQbG90SGVscGVyIHtcblxuICAvKiog0JrQvtC00Ysg0YjQtdC50LTQtdGA0L7Qsi4gKi9cbiAgcHVibGljIHZlcnRTaGFkZXJTb3VyY2U6IHN0cmluZyA9ICcnXG4gIHB1YmxpYyBmcmFnU2hhZGVyU291cmNlOiBzdHJpbmcgPSAnJ1xuXG4gIC8qKiDQpdC10LvQv9C10YAg0LHRg9C00LXRgiDQuNC80LXRgtGMINC/0L7Qu9C90YvQuSDQtNC+0YHRgtGD0L8g0Log0Y3QutC30LXQvNC/0LvRj9GA0YMgU1Bsb3QuICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIHJlYWRvbmx5IHNwbG90OiBTUGxvdFxuICApIHt9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0J/QvtC00LPQvtGC0LDQstC70LjQstCw0LXRgiDRhdC10LvQv9C10YAg0Log0LjRgdC/0L7Qu9GM0LfQvtCy0LDQvdC40Y4uXG4gICAqL1xuICBwdWJsaWMgc2V0dXAoKTogdm9pZCB7XG5cbiAgICAvKiog0KHQsdC+0YDQutCwINC60L7QtNC+0LIg0YjQtdC50LTQtdGA0L7Qsi4gKi9cbiAgICB0aGlzLnZlcnRTaGFkZXJTb3VyY2UgPSB0aGlzLm1ha2VWZXJ0U2hhZGVyU291cmNlKClcbiAgICB0aGlzLmZyYWdTaGFkZXJTb3VyY2UgPSB0aGlzLm1ha2VGcmFnU2hhZGVyU291cmNlKClcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCh0L7Qt9C00LDQtdGCINC60L7QtCDQstC10YDRiNC40L3QvdC+0LPQviDRiNC10LnQtNC10YDQsC5cbiAgICovXG4gIHByaXZhdGUgbWFrZVZlcnRTaGFkZXJTb3VyY2UoKSB7XG4gICAgcmV0dXJuIHNoYWRlcnMuVkVSVEVYX1RFTVBMQVRFLnJlcGxhY2UoJ3tDT0xPUi1DT0RFfScsIHRoaXMubWFrZUNvbG9yU291cmNlKCkpLnRyaW0oKVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0KHQvtC30LTQsNC10YIg0LrQvtC0INCy0LXRgNGI0LjQvdC90L7Qs9C+INGI0LXQudC00LXRgNCwLlxuICAgKi9cbiAgcHJpdmF0ZSBtYWtlRnJhZ1NoYWRlclNvdXJjZSgpIHtcbiAgICByZXR1cm4gc2hhZGVycy5GUkFHTUVOVF9URU1QTEFURS50cmltKClcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCh0L7Qt9C00LDQtdGCINC00L7Qv9C+0LvQvdC10L3QuNC1INC6INC60L7QtNGDLCDRg9GB0YLQsNC90LDQstC70LjQstCw0Y7RidC10LUg0YbQstC10YIg0L7QsdGK0LXQutGC0LAg0L/QviDQuNC90LTQtdC60YHRgyDRhtCy0LXRgtCwLlxuICAgKlxuICAgKiBAcmVtYXJrc1xuICAgKiDQoi7Qui4g0YjQtdC50LTQtdGAINC90LUg0L/QvtC30LLQvtC70Y/QtdGCINC40YHQv9C+0LvRjNC30L7QstCw0YLRjCDQsiDQutCw0YfQtdGB0YLQstC1INC40L3QtNC10LrRgdC+0LIg0L/QtdGA0LXQvNC10L3QvdGL0LUgLSDQtNC70Y8g0LfQsNC00LDQvdC40Y8g0YbQstC10YLQsCDQuNGB0L/QvtC70YzQt9GD0LXRgtGB0Y9cbiAgICog0L/QvtGB0LvQtdC00L7QstCw0YLQtdC70YzQvdGL0Lkg0L/QtdGA0LXQsdC+0YAg0YbQstC10YLQvtCy0YvRhSDQuNC90LTQtdC60YHQvtCyLlxuICAgKlxuICAgKiBAcmV0dXJucyDQmtC+0LQg0LTQvtC/0L7Qu9C90LXQvdC40Y8uXG4gICAqL1xuICBwcm90ZWN0ZWQgbWFrZUNvbG9yU291cmNlKCk6IHN0cmluZyB7XG5cbiAgICAvKiog0JLRgNC10LzQtdC90L3QvtC1INC00L7QsdCw0LLQu9C10L3QuNC1INCyINC/0LDQu9C40YLRgNGDINCy0LXRgNGI0LjQvSDRhtCy0LXRgtCwINC90LDQv9GA0LDQstC70Y/RjtGJ0LjRhS4gKi9cbiAgICB0aGlzLnNwbG90LmNvbG9ycy5wdXNoKHRoaXMuc3Bsb3QuZ3JpZC5ydWxlc0NvbG9yISlcblxuICAgIGxldCBjb2RlOiBzdHJpbmcgPSAnJ1xuXG4gICAgLyoqINCk0L7RgNC80LjRgNC+0LLQvdC40LUg0LrQvtC00LAg0YPRgdGC0LDQvdC+0LLQutC4INGG0LLQtdGC0LAg0L/QviDQuNC90LTQtdC60YHRgy4gKi9cbiAgICB0aGlzLnNwbG90LmNvbG9ycy5mb3JFYWNoKCh2YWx1ZSwgaW5kZXgpID0+IHtcbiAgICAgIGxldCBbciwgZywgYl0gPSBjb2xvckZyb21IZXhUb0dsUmdiKHZhbHVlKVxuICAgICAgY29kZSArPSBgZWxzZSBpZiAoYV9jb2xvciA9PSAke2luZGV4fS4wKSB2X2NvbG9yID0gdmVjMygke3J9LCAke2d9LCAke2J9KTtcXG5gXG4gICAgfSlcblxuICAgIC8qKiDQo9C00LDQu9C10L3QuNC1INC40Lcg0L/QsNC70LjRgtGA0Ysg0LLQtdGA0YjQuNC9INCy0YDQtdC80LXQvdC90L4g0LTQvtCx0LDQstC70LXQvdC90L7Qs9C+INGG0LLQtdGC0LAg0L3QsNC/0YDQsNCy0LvRj9GO0YnQuNGFLiAqL1xuICAgIHRoaXMuc3Bsb3QuY29sb3JzLnBvcCgpXG5cbiAgICAvKiog0KPQtNCw0LvQtdC90LjQtSDQu9C40YjQvdC10LPQviBcImVsc2VcIiDQsiDQvdCw0YfQsNC70LUg0LrQvtC00LAuICovXG4gICAgcmV0dXJuIGNvZGUuc2xpY2UoNSlcbiAgfVxufVxuIiwiaW1wb3J0IFNQbG90IGZyb20gJy4vc3Bsb3QnXG5pbXBvcnQgeyBjb2xvckZyb21IZXhUb0dsUmdiIH0gZnJvbSAnLi91dGlscydcblxuLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqXG4gKiDQmtC70LDRgdGBLdGF0LXQu9C/0LXRgCwg0YDQtdCw0LvQuNC30YPRjtGJ0LjQuSDRg9C/0YDQsNCy0LvQtdC90LjQtSDQutC+0L3RgtC10LrRgdGC0L7QvCDRgNC10L3QtNC10YDQuNC90LPQsCBXZWJHTCDQutC70LDRgdGB0LAgU3Bsb3QuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNQbG90V2ViR2wgaW1wbGVtZW50cyBTUGxvdEhlbHBlciB7XG5cbiAgLyoqINCf0LDRgNCw0LzQtdGC0YDRiyDQuNC90LjRhtC40LDQu9C40LfQsNGG0LjQuCDQutC+0L3RgtC10LrRgdGC0LAg0YDQtdC90LTQtdGA0LjQvdCz0LAgV2ViR0wuICovXG4gIHB1YmxpYyBhbHBoYTogYm9vbGVhbiA9IGZhbHNlXG4gIHB1YmxpYyBkZXB0aDogYm9vbGVhbiA9IGZhbHNlXG4gIHB1YmxpYyBzdGVuY2lsOiBib29sZWFuID0gZmFsc2VcbiAgcHVibGljIGFudGlhbGlhczogYm9vbGVhbiA9IGZhbHNlXG4gIHB1YmxpYyBkZXN5bmNocm9uaXplZDogYm9vbGVhbiA9IGZhbHNlXG4gIHB1YmxpYyBwcmVtdWx0aXBsaWVkQWxwaGE6IGJvb2xlYW4gPSBmYWxzZVxuICBwdWJsaWMgcHJlc2VydmVEcmF3aW5nQnVmZmVyOiBib29sZWFuID0gZmFsc2VcbiAgcHVibGljIGZhaWxJZk1ham9yUGVyZm9ybWFuY2VDYXZlYXQ6IGJvb2xlYW4gPSBmYWxzZVxuICBwdWJsaWMgcG93ZXJQcmVmZXJlbmNlOiBXZWJHTFBvd2VyUHJlZmVyZW5jZSA9ICdoaWdoLXBlcmZvcm1hbmNlJ1xuXG4gIC8qKiDQndCw0LfQstCw0L3QuNGPINGN0LvQtdC80LXQvdGC0L7QsiDQs9GA0LDRhNC40YfQtdGB0LrQvtC5INGB0LjRgdGC0LXQvNGLINC60LvQuNC10L3RgtCwLiAqL1xuICBwdWJsaWMgZ3B1ID0geyBoYXJkd2FyZTogJy0nLCBzb2Z0d2FyZTogJy0nIH1cblxuICAvKiog0JrQvtC90YLQtdC60YHRgiDRgNC10L3QtNC10YDQuNC90LPQsCDQuCDQv9GA0L7Qs9GA0LDQvNC80LAgV2ViR0wuICovXG4gIHByaXZhdGUgZ2whOiBXZWJHTFJlbmRlcmluZ0NvbnRleHRcbiAgcHJpdmF0ZSBncHVQcm9ncmFtITogV2ViR0xQcm9ncmFtXG5cbiAgLyoqINCf0LXRgNC10LzQtdC90L3Ri9C1INC00LvRjyDRgdCy0Y/Qt9C4INC/0YDQuNC70L7QttC10L3QuNGPINGBINC/0YDQvtCz0YDQsNC80LzQvtC5IFdlYkdMLiAqL1xuICBwcml2YXRlIHZhcmlhYmxlczogTWFwIDwgc3RyaW5nLCBhbnkgPiA9IG5ldyBNYXAoKVxuXG4gIC8qKiDQkdGD0YTQtdGA0Ysg0LLQuNC00LXQvtC/0LDQvNGP0YLQuCBXZWJHTC4gKi9cbiAgcHVibGljIGRhdGE6IE1hcCA8IHN0cmluZywge2J1ZmZlcnM6IFdlYkdMQnVmZmVyW10sIHR5cGU6IG51bWJlcn0gPiA9IG5ldyBNYXAoKVxuXG4gIC8qKiDQn9GA0LDQstC40LvQsCDRgdC+0L7RgtCy0LXRgtGB0YLQstC40Y8g0YLQuNC/0L7QsiDRgtC40L/QuNC30LjRgNC+0LLQsNC90L3Ri9GFINC80LDRgdGB0LjQstC+0LIg0Lgg0YLQuNC/0L7QsiDQv9C10YDQtdC80LXQvdC90YvRhSBXZWJHTC4gKi9cbiAgcHJpdmF0ZSBnbE51bWJlclR5cGVzOiBNYXA8c3RyaW5nLCBudW1iZXI+ID0gbmV3IE1hcChbXG4gICAgWydJbnQ4QXJyYXknLCAweDE0MDBdLCAgICAgICAvLyBnbC5CWVRFXG4gICAgWydVaW50OEFycmF5JywgMHgxNDAxXSwgICAgICAvLyBnbC5VTlNJR05FRF9CWVRFXG4gICAgWydJbnQxNkFycmF5JywgMHgxNDAyXSwgICAgICAvLyBnbC5TSE9SVFxuICAgIFsnVWludDE2QXJyYXknLCAweDE0MDNdLCAgICAgLy8gZ2wuVU5TSUdORURfU0hPUlRcbiAgICBbJ0Zsb2F0MzJBcnJheScsIDB4MTQwNl0gICAgIC8vIGdsLkZMT0FUXG4gIF0pXG5cbiAgLyoqINCl0LXQu9C/0LXRgCDQsdGD0LTQtdGCINC40LzQtdGC0Ywg0L/QvtC70L3Ri9C5INC00L7RgdGC0YPQvyDQuiDRjdC60LfQtdC80L/Qu9GP0YDRgyBTUGxvdC4gKi9cbiAgY29uc3RydWN0b3IoXG4gICAgcmVhZG9ubHkgc3Bsb3Q6IFNQbG90XG4gICkgeyB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0J/QvtC00LPQvtGC0LDQstC70LjQstCw0LXRgiDRhdC10LvQv9C10YAg0Log0LjRgdC/0L7Qu9GM0LfQvtCy0LDQvdC40Y4uXG4gICAqL1xuICBwdWJsaWMgc2V0dXAoKTogdm9pZCB7XG5cbiAgICB0aGlzLmdsID0gdGhpcy5zcGxvdC5jYW52YXMuZ2V0Q29udGV4dCgnd2ViZ2wnLCB7XG4gICAgICBhbHBoYTogdGhpcy5hbHBoYSxcbiAgICAgIGRlcHRoOiB0aGlzLmRlcHRoLFxuICAgICAgc3RlbmNpbDogdGhpcy5zdGVuY2lsLFxuICAgICAgYW50aWFsaWFzOiB0aGlzLmFudGlhbGlhcyxcbiAgICAgIGRlc3luY2hyb25pemVkOiB0aGlzLmRlc3luY2hyb25pemVkLFxuICAgICAgcHJlbXVsdGlwbGllZEFscGhhOiB0aGlzLnByZW11bHRpcGxpZWRBbHBoYSxcbiAgICAgIHByZXNlcnZlRHJhd2luZ0J1ZmZlcjogdGhpcy5wcmVzZXJ2ZURyYXdpbmdCdWZmZXIsXG4gICAgICBmYWlsSWZNYWpvclBlcmZvcm1hbmNlQ2F2ZWF0OiB0aGlzLmZhaWxJZk1ham9yUGVyZm9ybWFuY2VDYXZlYXQsXG4gICAgICBwb3dlclByZWZlcmVuY2U6IHRoaXMucG93ZXJQcmVmZXJlbmNlXG4gICAgfSkhXG5cbiAgICBpZiAodGhpcy5nbCA9PT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCfQntGI0LjQsdC60LAg0YHQvtC30LTQsNC90LjRjyDQutC+0L3RgtC10LrRgdGC0LAg0YDQtdC90LTQtdGA0LjQvdCz0LAgV2ViR0whJylcbiAgICB9XG5cbiAgICAvKiog0J/QvtC70YPRh9C10L3QuNC1INC40L3RhNC+0YDQvNCw0YbQuNC4INC+INCz0YDQsNGE0LjRh9C10YHQutC+0Lkg0YHQuNGB0YLQtdC80LUg0LrQu9C40LXQvdGC0LAuICovXG4gICAgbGV0IGV4dCA9IHRoaXMuZ2wuZ2V0RXh0ZW5zaW9uKCdXRUJHTF9kZWJ1Z19yZW5kZXJlcl9pbmZvJylcbiAgICB0aGlzLmdwdS5oYXJkd2FyZSA9IChleHQpID8gdGhpcy5nbC5nZXRQYXJhbWV0ZXIoZXh0LlVOTUFTS0VEX1JFTkRFUkVSX1dFQkdMKSA6ICdb0L3QtdC40LfQstC10YHRgtC90L5dJ1xuICAgIHRoaXMuZ3B1LnNvZnR3YXJlID0gdGhpcy5nbC5nZXRQYXJhbWV0ZXIodGhpcy5nbC5WRVJTSU9OKVxuXG4gICAgdGhpcy5zcGxvdC5kZWJ1Zy5sb2coJ2dwdScpXG5cbiAgICAvKiog0JrQvtC+0YDQtdC60YLQuNGA0L7QstC60LAg0YDQsNC30LzQtdGA0LAg0L7QsdC70LDRgdGC0Lgg0L/RgNC+0YHQvNC+0YLRgNCwLiAqL1xuICAgIHRoaXMuc3Bsb3QuY2FudmFzLndpZHRoID0gdGhpcy5zcGxvdC5jYW52YXMuY2xpZW50V2lkdGhcbiAgICB0aGlzLnNwbG90LmNhbnZhcy5oZWlnaHQgPSB0aGlzLnNwbG90LmNhbnZhcy5jbGllbnRIZWlnaHRcbiAgICB0aGlzLmdsLnZpZXdwb3J0KDAsIDAsIHRoaXMuc3Bsb3QuY2FudmFzLndpZHRoLCB0aGlzLnNwbG90LmNhbnZhcy5oZWlnaHQpXG5cbiAgICAvKiog0JXRgdC70Lgg0LfQsNC00LDQvSDRgNCw0LfQvNC10YAg0L/Qu9C+0YHQutC+0YHRgtC4LCDQvdC+INC90LUg0LfQsNC00LDQvdC+INC/0L7Qu9C+0LbQtdC90LjQtSDQvtCx0LvQsNGB0YLQuCDQv9GA0L7RgdC80L7RgtGA0LAsINGC0L4g0L7QvdCwINC/0L7QvNC10YnQsNC10YLRgdGPINCyINGG0LXQvdGC0YAg0L/Qu9C+0YHQutC+0YHRgtC4LiAqL1xuICAgIGlmICgoJ2dyaWQnIGluIHRoaXMuc3Bsb3QubGFzdFJlcXVlc3RlZE9wdGlvbnMhKSAmJiAhKCdjYW1lcmEnIGluIHRoaXMuc3Bsb3QubGFzdFJlcXVlc3RlZE9wdGlvbnMpKSB7XG4gICAgICB0aGlzLnNwbG90LmNhbWVyYS54ID0gdGhpcy5zcGxvdC5ncmlkLndpZHRoISAvIDJcbiAgICAgIHRoaXMuc3Bsb3QuY2FtZXJhLnkgPSB0aGlzLnNwbG90LmdyaWQuaGVpZ2h0ISAvIDJcbiAgICB9XG5cbiAgICAvKiog0KPRgdGC0LDQvdC+0LLQutCwINGE0L7QvdC+0LLQvtCz0L4g0YbQstC10YLQsCDQutCw0L3QstCw0YHQsCAo0YbQstC10YIg0L7Rh9C40YHRgtC60Lgg0LrQvtC90YLQtdC60YHRgtCwINGA0LXQvdC00LXRgNC40L3Qs9CwKS4gKi9cbiAgICB0aGlzLnNldEJnQ29sb3IodGhpcy5zcGxvdC5ncmlkLmJnQ29sb3IhKVxuXG4gICAgLyoqINCh0L7Qt9C00LDQvdC40LUg0L/RgNC+0LPRgNCw0LzQvNGLIFdlYkdMLiAqL1xuICAgIHRoaXMuY3JlYXRlUHJvZ3JhbSh0aGlzLnNwbG90Lmdsc2wudmVydFNoYWRlclNvdXJjZSwgdGhpcy5zcGxvdC5nbHNsLmZyYWdTaGFkZXJTb3VyY2UpXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQo9GB0YLQsNC90LDQstC70LjQstCw0LXRgiDRhtCy0LXRgiDRhNC+0L3QsCDQutC+0L3RgtC10LrRgdGC0LAg0YDQtdC90LTQtdGA0LjQvdCz0LAgV2ViR0wuXG4gICAqL1xuICBwdWJsaWMgc2V0QmdDb2xvcihjb2xvcjogc3RyaW5nKTogdm9pZCB7XG4gICAgbGV0IFtyLCBnLCBiXSA9IGNvbG9yRnJvbUhleFRvR2xSZ2IoY29sb3IpXG4gICAgdGhpcy5nbC5jbGVhckNvbG9yKHIsIGcsIGIsIDAuMClcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCX0LDQutGA0LDRiNC40LLQsNC10YIg0LrQvtC90YLQtdC60YHRgiDRgNC10L3QtNC10YDQuNC90LPQsCBXZWJHTCDRhtCy0LXRgtC+0Lwg0YTQvtC90LAuXG4gICAqL1xuICBwdWJsaWMgY2xlYXJCYWNrZ3JvdW5kKCk6IHZvaWQge1xuICAgIHRoaXMuZ2wuY2xlYXIodGhpcy5nbC5DT0xPUl9CVUZGRVJfQklUKTtcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCh0L7Qt9C00LDQtdGCINGI0LXQudC00LXRgCBXZWJHTC5cbiAgICpcbiAgICogQHBhcmFtIHR5cGUgLSDQotC40L8g0YjQtdC50LTQtdGA0LAuXG4gICAqIEBwYXJhbSBjb2RlIC0gR0xTTC3QutC+0LQg0YjQtdC50LTQtdGA0LAuXG4gICAqIEByZXR1cm5zINCh0L7Qt9C00LDQvdC90YvQuSDRiNC10LnQtNC10YAuXG4gICAqL1xuICBwdWJsaWMgY3JlYXRlU2hhZGVyKHR5cGU6ICdWRVJURVhfU0hBREVSJyB8ICdGUkFHTUVOVF9TSEFERVInLCBjb2RlOiBzdHJpbmcpOiBXZWJHTFNoYWRlciB7XG5cbiAgICBjb25zdCBzaGFkZXIgPSB0aGlzLmdsLmNyZWF0ZVNoYWRlcih0aGlzLmdsW3R5cGVdKSFcbiAgICB0aGlzLmdsLnNoYWRlclNvdXJjZShzaGFkZXIsIGNvZGUpXG4gICAgdGhpcy5nbC5jb21waWxlU2hhZGVyKHNoYWRlcilcblxuICAgIGlmICghdGhpcy5nbC5nZXRTaGFkZXJQYXJhbWV0ZXIoc2hhZGVyLCB0aGlzLmdsLkNPTVBJTEVfU1RBVFVTKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCfQntGI0LjQsdC60LAg0LrQvtC80L/QuNC70Y/RhtC40Lgg0YjQtdC50LTQtdGA0LAgWycgKyB0eXBlICsgJ10uICcgKyB0aGlzLmdsLmdldFNoYWRlckluZm9Mb2coc2hhZGVyKSlcbiAgICB9XG5cbiAgICByZXR1cm4gc2hhZGVyXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQodC+0LfQtNCw0LXRgiDQv9GA0L7Qs9GA0LDQvNC80YMgV2ViR0wg0LjQtyDRiNC10LnQtNC10YDQvtCyLlxuICAgKlxuICAgKiBAcGFyYW0gc2hhZGVyVmVydCAtINCS0LXRgNGI0LjQvdC90YvQuSDRiNC10LnQtNC10YAuXG4gICAqIEBwYXJhbSBzaGFkZXJGcmFnIC0g0KTRgNCw0LPQvNC10L3RgtC90YvQuSDRiNC10LnQtNC10YAuXG4gICAqL1xuICBwdWJsaWMgY3JlYXRlUHJvZ3JhbUZyb21TaGFkZXJzKHNoYWRlclZlcnQ6IFdlYkdMU2hhZGVyLCBzaGFkZXJGcmFnOiBXZWJHTFNoYWRlcik6IHZvaWQge1xuXG4gICAgdGhpcy5ncHVQcm9ncmFtID0gdGhpcy5nbC5jcmVhdGVQcm9ncmFtKCkhXG4gICAgdGhpcy5nbC5hdHRhY2hTaGFkZXIodGhpcy5ncHVQcm9ncmFtLCBzaGFkZXJWZXJ0KVxuICAgIHRoaXMuZ2wuYXR0YWNoU2hhZGVyKHRoaXMuZ3B1UHJvZ3JhbSwgc2hhZGVyRnJhZylcbiAgICB0aGlzLmdsLmxpbmtQcm9ncmFtKHRoaXMuZ3B1UHJvZ3JhbSlcbiAgICB0aGlzLmdsLnVzZVByb2dyYW0odGhpcy5ncHVQcm9ncmFtKVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0KHQvtC30LTQsNC10YIg0L/RgNC+0LPRgNCw0LzQvNGDIFdlYkdMINC40LcgR0xTTC3QutC+0LTQvtCyINGI0LXQudC00LXRgNC+0LIuXG4gICAqXG4gICAqIEBwYXJhbSBzaGFkZXJDb2RlVmVydCAtINCa0L7QtCDQstC10YDRiNC40L3QvdC+0LPQviDRiNC10LnQtNC10YDQsC5cbiAgICogQHBhcmFtIHNoYWRlckNvZGVGcmFnIC0g0JrQvtC0INGE0YDQsNCz0LzQtdC90YLQvdC+0LPQviDRiNC10LnQtNC10YDQsC5cbiAgICovXG4gIHB1YmxpYyBjcmVhdGVQcm9ncmFtKHNoYWRlckNvZGVWZXJ0OiBzdHJpbmcsIHNoYWRlckNvZGVGcmFnOiBzdHJpbmcpOiB2b2lkIHtcblxuICAgIHRoaXMuc3Bsb3QuZGVidWcubG9nKCdzaGFkZXJzJylcblxuICAgIHRoaXMuY3JlYXRlUHJvZ3JhbUZyb21TaGFkZXJzKFxuICAgICAgdGhpcy5jcmVhdGVTaGFkZXIoJ1ZFUlRFWF9TSEFERVInLCBzaGFkZXJDb2RlVmVydCksXG4gICAgICB0aGlzLmNyZWF0ZVNoYWRlcignRlJBR01FTlRfU0hBREVSJywgc2hhZGVyQ29kZUZyYWcpXG4gICAgKVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0KHQvtC30LTQsNC10YIg0YHQstGP0LfRjCDQv9C10YDQtdC80LXQvdC90L7QuSDQv9GA0LjQu9C+0LbQtdC90LjRjyDRgSDQv9GA0L7Qs9GA0LDQvNC80L7QuSBXZWJHbC5cbiAgICpcbiAgICogQHJlbWFya3NcbiAgICog0J/QtdGA0LXQvNC10L3QvdGL0LUg0YHQvtGF0YDQsNC90Y/RjtGC0YHRjyDQsiDQsNGB0YHQvtGG0LjQsNGC0LjQstC90L7QvCDQvNCw0YHRgdC40LLQtSwg0LPQtNC1INC60LvRjtGH0LggLSDRjdGC0L4g0L3QsNC30LLQsNC90LjRjyDQv9C10YDQtdC80LXQvdC90YvRhS4g0J3QsNC30LLQsNC90LjQtSDQv9C10YDQtdC80LXQvdC90L7QuSDQtNC+0LvQttC90L5cbiAgICog0L3QsNGH0LjQvdCw0YLRjNGB0Y8g0YEg0L/RgNC10YTQuNC60YHQsCwg0L7QsdC+0LfQvdCw0YfQsNGO0YnQtdCz0L4g0LXQtSBHTFNMLdGC0LjQvy4g0J/RgNC10YTQuNC60YEgXCJ1X1wiINC+0L/QuNGB0YvQstCw0LXRgiDQv9C10YDQtdC80LXQvdC90YPRjiDRgtC40L/QsCB1bmlmb3JtLiDQn9GA0LXRhNC40LrRgSBcImFfXCJcbiAgICog0L7Qv9C40YHRi9Cy0LDQtdGCINC/0LXRgNC10LzQtdC90L3Rg9GOINGC0LjQv9CwIGF0dHJpYnV0ZS5cbiAgICpcbiAgICogQHBhcmFtIHZhck5hbWUgLSDQmNC80Y8g0L/QtdGA0LXQvNC10L3QvdC+0LkgKNGB0YLRgNC+0LrQsCkuXG4gICAqL1xuICBwdWJsaWMgY3JlYXRlVmFyaWFibGUodmFyTmFtZTogc3RyaW5nKTogdm9pZCB7XG5cbiAgICBjb25zdCB2YXJUeXBlID0gdmFyTmFtZS5zbGljZSgwLCAyKVxuXG4gICAgaWYgKHZhclR5cGUgPT09ICd1XycpIHtcbiAgICAgIHRoaXMudmFyaWFibGVzLnNldCh2YXJOYW1lLCB0aGlzLmdsLmdldFVuaWZvcm1Mb2NhdGlvbih0aGlzLmdwdVByb2dyYW0sIHZhck5hbWUpKVxuICAgIH0gZWxzZSBpZiAodmFyVHlwZSA9PT0gJ2FfJykge1xuICAgICAgdGhpcy52YXJpYWJsZXMuc2V0KHZhck5hbWUsIHRoaXMuZ2wuZ2V0QXR0cmliTG9jYXRpb24odGhpcy5ncHVQcm9ncmFtLCB2YXJOYW1lKSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCfQo9C60LDQt9Cw0L0g0L3QtdCy0LXRgNC90YvQuSDRgtC40L8gKNC/0YDQtdGE0LjQutGBKSDQv9C10YDQtdC80LXQvdC90L7QuSDRiNC10LnQtNC10YDQsDogJyArIHZhck5hbWUpXG4gICAgfVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0KHQvtC30LTQsNC10YIg0YHQstGP0LfRjCDQvdCw0LHQvtGA0LAg0L/QtdGA0LXQvNC10L3QvdGL0YUg0L/RgNC40LvQvtC20LXQvdC40Y8g0YEg0L/RgNC+0LPRgNCw0LzQvNC+0LkgV2ViR2wuXG4gICAqXG4gICAqIEByZW1hcmtzXG4gICAqINCU0LXQu9Cw0LXRgiDRgtC+0LbQtSDRgdCw0LzQvtC1LCDRh9GC0L4g0Lgg0LzQtdGC0L7QtCB7QGxpbmsgY3JlYXRlVmFyaWFibGV9LCDQvdC+INC/0L7Qt9Cy0L7Qu9GP0LXRgiDQt9CwINC+0LTQuNC9INCy0YvQt9C+0LIg0YHQvtC30LTQsNGC0Ywg0YHRgNCw0LfRgyDQvdC10YHQutC+0LvRjNC60L5cbiAgICog0L/QtdGA0LXQvNC10L3QvdGL0YUuXG4gICAqXG4gICAqIEBwYXJhbSB2YXJOYW1lcyAtINCf0LXRgNC10YfQuNGB0LvQtdC90LjRjyDQuNC80LXQvSDQv9C10YDQtdC80LXQvdC90YvRhSAo0YHRgtGA0L7QutCw0LzQuCkuXG4gICAqL1xuICBwdWJsaWMgY3JlYXRlVmFyaWFibGVzKC4uLnZhck5hbWVzOiBzdHJpbmdbXSk6IHZvaWQge1xuICAgIHZhck5hbWVzLmZvckVhY2godmFyTmFtZSA9PiB0aGlzLmNyZWF0ZVZhcmlhYmxlKHZhck5hbWUpKTtcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCh0L7Qt9C00LDQtdGCINCyINCz0YDRg9C/0L/QtSDQsdGD0YTQtdGA0L7QsiBXZWJHTCDQvdC+0LLRi9C5INCx0YPRhNC10YAg0Lgg0LfQsNC/0LjRgdGL0LLQsNC10YIg0LIg0L3QtdCz0L4g0L/QtdGA0LXQtNCw0L3QvdGL0LUg0LTQsNC90L3Ri9C1LlxuICAgKlxuICAgKiBAcmVtYXJrc1xuICAgKiDQmtC+0LvQuNGH0LXRgdGC0LLQviDQs9GA0YPQv9C/INCx0YPRhNC10YDQvtCyINC4INC60L7Qu9C40YfQtdGB0YLQstC+INCx0YPRhNC10YDQvtCyINCyINC60LDQttC00L7QuSDQs9GA0YPQv9C/0LUg0L3QtSDQvtCz0YDQsNC90LjRh9C10L3Riy4g0JrQsNC20LTQsNGPINCz0YDRg9C/0L/QsCDQuNC80LXQtdGCINGB0LLQvtC1INC90LDQt9Cy0LDQvdC40LUg0LhcbiAgICogR0xTTC3RgtC40L8uINCi0LjQvyDQs9GA0YPQv9C/0Ysg0L7Qv9GA0LXQtNC10LvRj9C10YLRgdGPINCw0LLRgtC+0LzQsNGC0LjRh9C10YHQutC4INC90LAg0L7RgdC90L7QstC1INGC0LjQv9CwINGC0LjQv9C40LfQuNGA0L7QstCw0L3QvdC+0LPQviDQvNCw0YHRgdC40LLQsC4g0J/RgNCw0LLQuNC70LAg0YHQvtC+0YLQstC10YLRgdGC0LLQuNGPINGC0LjQv9C+0LJcbiAgICog0L7Qv9GA0LXQtNC10LvRj9GO0YLRgdGPINC/0LXRgNC10LzQtdC90L3QvtC5IHtAbGluayBnbE51bWJlclR5cGVzfS5cbiAgICpcbiAgICogQHBhcmFtIGdyb3VwTmFtZSAtINCd0LDQt9Cy0LDQvdC40LUg0LPRgNGD0L/Qv9GLINCx0YPRhNC10YDQvtCyLCDQsiDQutC+0YLQvtGA0YPRjiDQsdGD0LTQtdGCINC00L7QsdCw0LLQu9C10L0g0L3QvtCy0YvQuSDQsdGD0YTQtdGALlxuICAgKiBAcGFyYW0gZGF0YSAtINCU0LDQvdC90YvQtSDQsiDQstC40LTQtSDRgtC40L/QuNC30LjRgNC+0LLQsNC90L3QvtCz0L4g0LzQsNGB0YHQuNCy0LAg0LTQu9GPINC30LDQv9C40YHQuCDQsiDRgdC+0LfQtNCw0LLQsNC10LzRi9C5INCx0YPRhNC10YAuXG4gICAqIEByZXR1cm5zINCe0LHRitC10Lwg0L/QsNC80Y/RgtC4LCDQt9Cw0L3Rj9GC0YvQuSDQvdC+0LLRi9C8INCx0YPRhNC10YDQvtC8ICjQsiDQsdCw0LnRgtCw0YUpLlxuICAgKi9cbiAgcHVibGljIGNyZWF0ZUJ1ZmZlcihncm91cE5hbWU6IHN0cmluZywgZGF0YTogVHlwZWRBcnJheSk6IG51bWJlciB7XG5cbiAgICBjb25zdCBidWZmZXIgPSB0aGlzLmdsLmNyZWF0ZUJ1ZmZlcigpIVxuICAgIHRoaXMuZ2wuYmluZEJ1ZmZlcih0aGlzLmdsLkFSUkFZX0JVRkZFUiwgYnVmZmVyKVxuICAgIHRoaXMuZ2wuYnVmZmVyRGF0YSh0aGlzLmdsLkFSUkFZX0JVRkZFUiwgZGF0YSwgdGhpcy5nbC5TVEFUSUNfRFJBVylcblxuICAgIC8qKiDQldGB0LvQuCDQs9GA0YPQv9C/0Ysg0YEg0YPQutCw0LfQsNC90L3Ri9C8INC90LDQt9Cy0LDQvdC40LXQvCDQvdC1INGB0YPRidC10YHRgtCy0YPQtdGCLCDRgtC+INC+0L3QsCDRgdC+0LfQtNCw0LXRgtGB0Y8uICovXG4gICAgaWYgKCF0aGlzLmRhdGEuaGFzKGdyb3VwTmFtZSkpIHtcbiAgICAgIHRoaXMuZGF0YS5zZXQoZ3JvdXBOYW1lLCB7IGJ1ZmZlcnM6IFtdLCB0eXBlOiB0aGlzLmdsTnVtYmVyVHlwZXMuZ2V0KGRhdGEuY29uc3RydWN0b3IubmFtZSkhfSlcbiAgICB9XG5cbiAgICB0aGlzLmRhdGEuZ2V0KGdyb3VwTmFtZSkhLmJ1ZmZlcnMucHVzaChidWZmZXIpXG5cbiAgICByZXR1cm4gZGF0YS5sZW5ndGggKiBkYXRhLkJZVEVTX1BFUl9FTEVNRU5UXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQn9C10YDQtdC00LDQtdGCINC30L3QsNGH0LXQvdC40LUg0LzQsNGC0YDQuNGG0YsgMyDRhSAzINCyINC/0YDQvtCz0YDQsNC80LzRgyBXZWJHbC5cbiAgICpcbiAgICogQHBhcmFtIHZhck5hbWUgLSDQmNC80Y8g0L/QtdGA0LXQvNC10L3QvdC+0LkgV2ViR0wgKNC40Lcg0LzQsNGB0YHQuNCy0LAge0BsaW5rIHZhcmlhYmxlc30pINCyINC60L7RgtC+0YDRg9GOINCx0YPQtNC10YIg0LfQsNC/0LjRgdCw0L3QviDQv9C10YDQtdC00LDQvdC90L7QtSDQt9C90LDRh9C10L3QuNC1LlxuICAgKiBAcGFyYW0gdmFyVmFsdWUgLSDQo9GB0YLQsNC90LDQstC70LjQstCw0LXQvNC+0LUg0LfQvdCw0YfQtdC90LjQtSDQtNC+0LvQttC90L4g0Y/QstC70Y/RgtGM0YHRjyDQvNCw0YLRgNC40YbQtdC5INCy0LXRidC10YHRgtCy0LXQvdC90YvRhSDRh9C40YHQtdC7INGA0LDQt9C80LXRgNC+0LwgMyDRhSAzLCDRgNCw0LfQstC10YDQvdGD0YLQvtC5XG4gICAqICAgICDQsiDQstC40LTQtSDQvtC00L3QvtC80LXRgNC90L7Qs9C+INC80LDRgdGB0LjQstCwINC40LcgOSDRjdC70LXQvNC10L3RgtC+0LIuXG4gICAqL1xuICBwdWJsaWMgc2V0VmFyaWFibGUodmFyTmFtZTogc3RyaW5nLCB2YXJWYWx1ZTogbnVtYmVyW10pOiB2b2lkIHtcbiAgICB0aGlzLmdsLnVuaWZvcm1NYXRyaXgzZnYodGhpcy52YXJpYWJsZXMuZ2V0KHZhck5hbWUpLCBmYWxzZSwgdmFyVmFsdWUpXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQlNC10LvQsNC10YIg0LHRg9GE0LXRgCBXZWJHbCBcItCw0LrRgtC40LLQvdGL0LxcIi5cbiAgICpcbiAgICogQHBhcmFtIGdyb3VwTmFtZSAtINCd0LDQt9Cy0LDQvdC40LUg0LPRgNGD0L/Qv9GLINCx0YPRhNC10YDQvtCyLCDQsiDQutC+0YLQvtGA0L7QvCDRhdGA0LDQvdC40YLRgdGPINC90LXQvtCx0YXQvtC00LjQvNGL0Lkg0LHRg9GE0LXRgC5cbiAgICogQHBhcmFtIGluZGV4IC0g0JjQvdC00LXQutGBINCx0YPRhNC10YDQsCDQsiDQs9GA0YPQv9C/0LUuXG4gICAqIEBwYXJhbSB2YXJOYW1lIC0g0JjQvNGPINC/0LXRgNC10LzQtdC90L3QvtC5ICjQuNC3INC80LDRgdGB0LjQstCwIHtAbGluayB2YXJpYWJsZXN9KSwg0YEg0LrQvtGC0L7RgNC+0Lkg0LHRg9C00LXRgiDRgdCy0Y/Qt9Cw0L0g0LHRg9GE0LXRgC5cbiAgICogQHBhcmFtIHNpemUgLSDQmtC+0LvQuNGH0LXRgdGC0LLQviDRjdC70LXQvNC10L3RgtC+0LIg0LIg0LHRg9GE0LXRgNC1LCDRgdC+0L7RgtCy0LXRgtGB0YLQstGD0Y7RidC40YUg0L7QtNC90L7QuSDCoEdMLdCy0LXRgNGI0LjQvdC1LlxuICAgKiBAcGFyYW0gc3RyaWRlIC0g0KDQsNC30LzQtdGAINGI0LDQs9CwINC+0LHRgNCw0LHQvtGC0LrQuCDRjdC70LXQvNC10L3RgtC+0LIg0LHRg9GE0LXRgNCwICjQt9C90LDRh9C10L3QuNC1IDAg0LfQsNC00LDQtdGCINGA0LDQt9C80LXRidC10L3QuNC1INGN0LvQtdC80LXQvdGC0L7QsiDQtNGA0YPQsyDQt9CwINC00YDRg9Cz0L7QvCkuXG4gICAqIEBwYXJhbSBvZmZzZXQgLSDQodC80LXRidC10L3QuNC1INC+0YLQvdC+0YHQuNGC0LXQu9GM0L3QviDQvdCw0YfQsNC70LAg0LHRg9GE0LXRgNCwLCDQvdCw0YfQuNC90LDRjyDRgSDQutC+0YLQvtGA0L7Qs9C+INCx0YPQtNC10YIg0L/RgNC+0LjRgdGF0L7QtNC40YLRjCDQvtCx0YDQsNCx0L7RgtC60LAg0Y3Qu9C10LzQtdC90YLQvtCyLlxuICAgKi9cbiAgcHVibGljIHNldEJ1ZmZlcihncm91cE5hbWU6IHN0cmluZywgaW5kZXg6IG51bWJlciwgdmFyTmFtZTogc3RyaW5nLCBzaXplOiBudW1iZXIsIHN0cmlkZTogbnVtYmVyLCBvZmZzZXQ6IG51bWJlcik6IHZvaWQge1xuXG4gICAgY29uc3QgZ3JvdXAgPSB0aGlzLmRhdGEuZ2V0KGdyb3VwTmFtZSkhXG4gICAgY29uc3QgdmFyaWFibGUgPSB0aGlzLnZhcmlhYmxlcy5nZXQodmFyTmFtZSlcblxuICAgIHRoaXMuZ2wuYmluZEJ1ZmZlcih0aGlzLmdsLkFSUkFZX0JVRkZFUiwgZ3JvdXAuYnVmZmVyc1tpbmRleF0pXG4gICAgdGhpcy5nbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheSh2YXJpYWJsZSlcbiAgICB0aGlzLmdsLnZlcnRleEF0dHJpYlBvaW50ZXIodmFyaWFibGUsIHNpemUsIGdyb3VwLnR5cGUsIGZhbHNlLCBzdHJpZGUsIG9mZnNldClcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCS0YvQv9C+0LvQvdGP0LXRgiDQvtGC0YDQuNGB0L7QstC60YMg0LrQvtC90YLQtdC60YHRgtCwINGA0LXQvdC00LXRgNC40L3Qs9CwIFdlYkdMINC80LXRgtC+0LTQvtC8INC/0YDQuNC80LjRgtC40LLQvdGL0YUg0YLQvtGH0LXQui5cbiAgICpcbiAgICogQHBhcmFtIGZpcnN0IC0g0JjQvdC00LXQutGBIEdMLdCy0LXRgNGI0LjQvdGLLCDRgSDQutC+0YLQvtGA0L7QuSDQvdCw0YfQvdC10YLRjyDQvtGC0YDQuNGB0L7QstC60LAuXG4gICAqIEBwYXJhbSBjb3VudCAtINCa0L7Qu9C40YfQtdGB0YLQstC+INC+0YDQuNGB0L7QstGL0LLQsNC10LzRi9GFIEdMLdCy0LXRgNGI0LjQvS5cbiAgICovXG4gIHB1YmxpYyBkcmF3UG9pbnRzKGZpcnN0OiBudW1iZXIsIGNvdW50OiBudW1iZXIpOiB2b2lkIHtcbiAgICB0aGlzLmdsLmRyYXdBcnJheXModGhpcy5nbC5QT0lOVFMsIGZpcnN0LCBjb3VudClcbiAgfVxufVxuIiwiaW1wb3J0IHsgY29weU1hdGNoaW5nS2V5VmFsdWVzLCBjb2xvckZyb21IZXhUb0dsUmdiIH0gZnJvbSAnLi91dGlscydcbmltcG9ydCBTSEFERVJfQ09ERV9GUkFHX1RNUEwgZnJvbSAnLi9zaGFkZXItY29kZS1mcmFnLXRtcGwnXG5pbXBvcnQgU1Bsb3RDb250b2wgZnJvbSAnLi9zcGxvdC1jb250cm9sJ1xuaW1wb3J0IFNQbG90V2ViR2wgZnJvbSAnLi9zcGxvdC13ZWJnbCdcbmltcG9ydCBTUGxvdERlYnVnIGZyb20gJy4vc3Bsb3QtZGVidWcnXG5pbXBvcnQgU1Bsb3REZW1vIGZyb20gJy4vc3Bsb3QtZGVtbydcbmltcG9ydCBTUGxvdEdsc2wgZnJvbSAnLi9zcGxvdC1nbHNsJ1xuXG4vKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICpcbiAqINCa0LvQsNGB0YEgU1Bsb3QgLSDRgNC10LDQu9C40LfRg9C10YIg0LPRgNCw0YTQuNC6INGC0LjQv9CwINGB0LrQsNGC0YLQtdGA0L/Qu9C+0YIg0YHRgNC10LTRgdGC0LLQsNC80LggV2ViR0wuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNQbG90IHtcblxuICAvKiog0KTRg9C90LrRhtC40Y8g0LjRgtC10YDQuNGA0L7QstCw0L3QuNGPINC40YHRhdC+0LTQvdGL0YUg0LTQsNC90L3Ri9GFLiAqL1xuICBwdWJsaWMgaXRlcmF0b3I6IFNQbG90SXRlcmF0b3IgPSB1bmRlZmluZWRcblxuICAvKiog0KXQtdC70L/QtdGAINGA0LXQttC40LzQsCDQvtGC0LvQsNC00LrQuC4gKi9cbiAgcHVibGljIGRlYnVnOiBTUGxvdERlYnVnID0gbmV3IFNQbG90RGVidWcodGhpcylcblxuICAvKiog0KXQtdC70L/QtdGALCDRg9C/0YDQsNCy0LvRj9GO0YnQuNC5IEdMU0wt0LrQvtC00L7QvCDRiNC10LnQtNC10YDQvtCyLiAqL1xuICBwdWJsaWMgZ2xzbDogU1Bsb3RHbHNsID0gbmV3IFNQbG90R2xzbCh0aGlzKVxuXG4gIC8qKiDQpdC10LvQv9C10YAgV2ViR0wuICovXG4gIHB1YmxpYyB3ZWJnbDogU1Bsb3RXZWJHbCA9IG5ldyBTUGxvdFdlYkdsKHRoaXMpXG5cbiAgLyoqINCl0LXQu9C/0LXRgCDRgNC10LbQuNC80LAg0LTQtdC80L4t0LTQsNC90L3Ri9GFLiAqL1xuICBwdWJsaWMgZGVtbzogU1Bsb3REZW1vID0gbmV3IFNQbG90RGVtbyh0aGlzKVxuXG4gIC8qKiDQn9GA0LjQt9C90LDQuiDRhNC+0YDRgdC40YDQvtCy0LDQvdC90L7Qs9C+INC30LDQv9GD0YHQutCwINGA0LXQvdC00LXRgNCwLiAqL1xuICBwdWJsaWMgZm9yY2VSdW46IGJvb2xlYW4gPSBmYWxzZVxuXG4gIC8qKiDQntCz0YDQsNC90LjRh9C10L3QuNC1INC60L7Quy3QstCwINC+0LHRitC10LrRgtC+0LIg0L3QsCDQs9GA0LDRhNC40LrQtS4gKi9cbiAgcHVibGljIGdsb2JhbExpbWl0OiBudW1iZXIgPSAxXzAwMF8wMDBfMDAwXG5cbiAgLyoqINCe0LPRgNCw0L3QuNGH0LXQvdC40LUg0LrQvtC7LdCy0LAg0L7QsdGK0LXQutGC0L7QsiDQsiDQs9GA0YPQv9C/0LUuICovXG4gIHB1YmxpYyBncm91cExpbWl0OiBudW1iZXIgPSAxMF8wMDBcblxuICAvKiog0KbQstC10YLQvtCy0LDRjyDQv9Cw0LvQuNGC0YDQsCDQvtCx0YrQtdC60YLQvtCyLiAqL1xuICBwdWJsaWMgY29sb3JzOiBzdHJpbmdbXSA9IFtdXG5cbiAgLyoqINCf0LDRgNCw0LzQtdGC0YDRiyDQutC+0L7RgNC00LjQvdCw0YLQvdC+0Lkg0L/Qu9C+0YHQutC+0YHRgtC4LiAqL1xuICBwdWJsaWMgZ3JpZDogU1Bsb3RHcmlkID0ge1xuICAgIHdpZHRoOiAzMl8wMDAsXG4gICAgaGVpZ2h0OiAxNl8wMDAsXG4gICAgYmdDb2xvcjogJyNmZmZmZmYnLFxuICAgIHJ1bGVzQ29sb3I6ICcjYzBjMGMwJ1xuICB9XG5cbiAgLyoqINCf0LDRgNCw0LzQtdGC0YDRiyDQvtCx0LvQsNGB0YLQuCDQv9GA0L7RgdC80L7RgtGA0LAuICovXG4gIHB1YmxpYyBjYW1lcmE6IFNQbG90Q2FtZXJhID0ge1xuICAgIHg6IHRoaXMuZ3JpZC53aWR0aCEgLyAyLFxuICAgIHk6IHRoaXMuZ3JpZC5oZWlnaHQhIC8gMixcbiAgICB6b29tOiAxXG4gIH1cblxuICAvKiog0J/RgNC40LfQvdCw0Log0L3QtdC+0LHRhdC+0LTQuNC80L7RgdGC0Lgg0LHQtdC30L7RgtC70LDQs9Cw0YLQtdC70YzQvdC+0LPQviDQt9Cw0L/Rg9GB0LrQsCDRgNC10L3QtNC10YDQsC4gKi9cbiAgcHVibGljIGlzUnVubmluZzogYm9vbGVhbiA9IGZhbHNlXG5cbiAgLyoqINCa0L7Qu9C40YfQtdGB0YLQstC+INGA0LDQt9C70LjRh9C90YvRhSDRhNC+0YDQvCDQvtCx0YrQtdC60YLQvtCyLiAqL1xuICBwdWJsaWMgc2hhcGVzQ291bnQ6IG51bWJlciA9IDNcblxuICAvKiog0KHRgtCw0YLQuNGB0YLQuNGH0LXRgdC60LDRjyDQuNC90YTQvtGA0LzQsNGG0LjRjy4gKi9cbiAgcHVibGljIHN0YXRzID0ge1xuICAgIG9ialRvdGFsQ291bnQ6IDAsXG4gICAgb2JqSW5Hcm91cENvdW50OiBbXSBhcyBudW1iZXJbXSxcbiAgICBncm91cHNDb3VudDogMCxcbiAgICBtZW1Vc2FnZTogMFxuICB9XG5cbiAgLyoqINCe0LHRitC10LrRgi3QutCw0L3QstCw0YEg0LrQvtC90YLQtdC60YHRgtCwINGA0LXQvdC00LXRgNC40L3Qs9CwIFdlYkdMLiAqL1xuICBwdWJsaWMgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudFxuXG4gIC8qKiDQndCw0YHRgtGA0L7QudC60LgsINC30LDQv9GA0L7RiNC10L3QvdGL0LUg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9C10Lwg0LIg0LrQvtC90YHRgtGA0YPQutGC0L7RgNC1INC40LvQuCDQv9GA0Lgg0L/QvtGB0LvQtdC00L3QtdC8INCy0YvQt9C+0LLQtSBzZXR1cC4gKi9cbiAgcHVibGljIGxhc3RSZXF1ZXN0ZWRPcHRpb25zOiBTUGxvdE9wdGlvbnMgfCB1bmRlZmluZWQgPSB7fVxuXG4gIC8qKiDQpdC10LvQv9C10YAg0LLQt9Cw0LjQvNC+0LTQtdC50YHRgtCy0LjRjyDRgSDRg9GB0YLRgNC+0LnRgdGC0LLQvtC8INCy0LLQvtC00LAuICovXG4gIHByb3RlY3RlZCBjb250cm9sOiBTUGxvdENvbnRvbCA9IG5ldyBTUGxvdENvbnRvbCh0aGlzKVxuXG4gIC8qKiDQn9GA0LjQt9C90LDQuiDRgtC+0LPQviwg0YfRgtC+INGN0LrQt9C10LzQv9C70Y/RgCDQutC70LDRgdGB0LAg0LHRi9C7INC60L7RgNGA0LXQutGC0L3QviDQv9C+0LTQs9C+0YLQvtCy0LvQtdC9INC6INGA0LXQvdC00LXRgNGDLiAqL1xuICBwcml2YXRlIGlzU2V0dXBlZDogYm9vbGVhbiA9IGZhbHNlXG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0KHQvtC30LTQsNC10YIg0Y3QutC30LXQvNC/0LvRj9GAINC60LvQsNGB0YHQsCwg0LjQvdC40YbQuNCw0LvQuNC30LjRgNGD0LXRgiDQvdCw0YHRgtGA0L7QudC60LggKNC10YHQu9C4INC/0LXRgNC10LTQsNC90YspLlxuICAgKlxuICAgKiBAcmVtYXJrc1xuICAgKiDQldGB0LvQuCDQutCw0L3QstCw0YEg0YEg0LfQsNC00LDQvdC90YvQvCDQuNC00LXQvdGC0LjRhNC40LrQsNGC0L7RgNC+0Lwg0L3QtSDQvdCw0LnQtNC10L0gLSDQs9C10L3QtdGA0LjRgNGD0LXRgtGB0Y8g0L7RiNC40LHQutCwLiDQndCw0YHRgtGA0L7QudC60Lgg0LzQvtCz0YPRgiDQsdGL0YLRjCDQt9Cw0LTQsNC90Ysg0LrQsNC6INCyXG4gICAqINC60L7QvdGB0YLRgNGD0LrRgtC+0YDQtSwg0YLQsNC6INC4INCyINC80LXRgtC+0LTQtSB7QGxpbmsgc2V0dXB9LiDQkiDQu9GO0LHQvtC8INGB0LvRg9GH0LDQtSDQvdCw0YHRgtGA0L7QudC60Lgg0LTQvtC70LbQvdGLINCx0YvRgtGMINC30LDQtNCw0L3RiyDQtNC+INC30LDQv9GD0YHQutCwINGA0LXQvdC00LXRgNCwLlxuICAgKlxuICAgKiBAcGFyYW0gY2FudmFzSWQgLSDQmNC00LXQvdGC0LjRhNC40LrQsNGC0L7RgCDQutCw0L3QstCw0YHQsCwg0L3QsCDQutC+0YLQvtGA0L7QvCDQsdGD0LTQtdGCINGA0LjRgdC+0LLQsNGC0YzRgdGPINCz0YDQsNGE0LjQui5cbiAgICogQHBhcmFtIG9wdGlvbnMgLSDQn9C+0LvRjNC30L7QstCw0YLQtdC70YzRgdC60LjQtSDQvdCw0YHRgtGA0L7QudC60Lgg0Y3QutC30LXQvNC/0LvRj9GA0LAuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihjYW52YXNJZDogc3RyaW5nLCBvcHRpb25zPzogU1Bsb3RPcHRpb25zKSB7XG5cbiAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY2FudmFzSWQpKSB7XG4gICAgICB0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNhbnZhc0lkKSBhcyBIVE1MQ2FudmFzRWxlbWVudFxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ9Ca0LDQvdCy0LDRgSDRgSDQuNC00LXQvdGC0LjRhNC40LrQsNGC0L7RgNC+0LwgXCIjJyArIGNhbnZhc0lkICsgJ1wiINC90LUg0L3QsNC50LTQtdC9IScpXG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMpIHtcblxuICAgICAgLyoqINCV0YHQu9C4INC/0LXRgNC10LTQsNC90Ysg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GM0YHQutC40LUg0L3QsNGB0YLRgNC+0LnQutC4LCDRgtC+INC+0L3QuCDQv9GA0LjQvNC10L3Rj9GO0YLRgdGPLiAqL1xuICAgICAgY29weU1hdGNoaW5nS2V5VmFsdWVzKHRoaXMsIG9wdGlvbnMpXG4gICAgICB0aGlzLmxhc3RSZXF1ZXN0ZWRPcHRpb25zID0gb3B0aW9uc1xuXG4gICAgICAvKiog0JjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y8g0LLRgdC10YUg0L/QsNGA0LDQvNC10YLRgNC+0LIg0YDQtdC90LTQtdGA0LAsINC10YHQu9C4INC30LDQv9GA0L7RiNC10L0g0YTQvtGA0YHQuNGA0L7QstCw0L3QvdGL0Lkg0LfQsNC/0YPRgdC6LiAqL1xuICAgICAgaWYgKHRoaXMuZm9yY2VSdW4pIHtcbiAgICAgICAgdGhpcy5zZXR1cChvcHRpb25zKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCY0L3QuNGG0LjQsNC70LjQt9C40YDRg9C10YIg0L3QtdC+0LHRhdC+0LTQuNC80YvQtSDQtNC70Y8g0YDQtdC90LTQtdGA0LAg0L/QsNGA0LDQvNC10YLRgNGLINGN0LrQt9C10LzQv9C70Y/RgNCwLCDQstGL0L/QvtC70L3Rj9C10YIg0L/QvtC00LPQvtGC0L7QstC60YMg0Lgg0LfQsNC/0L7Qu9C90LXQvdC40LUg0LHRg9GE0LXRgNC+0LIgV2ViR0wuXG4gICAqXG4gICAqIEBwYXJhbSBvcHRpb25zIC0g0J3QsNGB0YLRgNC+0LnQutC4INGN0LrQt9C10LzQv9C70Y/RgNCwLlxuICAgKi9cbiAgcHVibGljIHNldHVwKCBvcHRpb25zOiBTUGxvdE9wdGlvbnMgPSB7fSApOiB2b2lkIHtcblxuICAgIC8qKiDQn9GA0LjQt9C90LDQuiDRgtC+0LPQviwg0YfRgtC+INGN0LrQt9C10LzQv9C70Y/RgCDQutCw0Log0LzQuNC90LjQvNGD0Lwg0L7QtNC40L0g0YDQsNC3INCy0YvQv9C+0LvQvdC40Lsg0LzQtdGC0L7QtCBzZXR1cC4gKi9cbiAgICB0aGlzLmlzU2V0dXBlZCA9IHRydWVcblxuICAgIC8qKiDQn9GA0LjQvNC10L3QtdC90LjQtSDQv9C+0LvRjNC30L7QstCw0YLQtdC70YzRgdC60LjRhSDQvdCw0YHRgtGA0L7QtdC6LiAqL1xuICAgIGNvcHlNYXRjaGluZ0tleVZhbHVlcyh0aGlzLCBvcHRpb25zKVxuICAgIHRoaXMubGFzdFJlcXVlc3RlZE9wdGlvbnMgPSBvcHRpb25zXG5cbiAgICAvKiog0J/RgNC+0LLQtdGA0LrQsCDQutC+0YDRgNC10LrRgtC90L7RgdGC0Lgg0L3QsNGB0YLRgNC+0LnQutC4INGN0LrQt9C10LzQv9C70Y/RgNCwLiAqL1xuICAgIHRoaXMuY2hlY2tTZXR1cCgpXG5cbiAgICB0aGlzLmRlYnVnLmxvZygnaW50cm8nKVxuXG4gICAgLyoqINCf0L7QtNCz0L7RgtC+0LLQutCwINCy0YHQtdGFINGF0LXQu9C/0LXRgNC+0LIuICovXG4gICAgdGhpcy5kZWJ1Zy5zZXR1cCgpXG4gICAgdGhpcy5nbHNsLnNldHVwKClcbiAgICB0aGlzLndlYmdsLnNldHVwKClcbiAgICB0aGlzLmNvbnRyb2wuc2V0dXAoKVxuICAgIHRoaXMuZGVtby5zZXR1cCgpXG5cbiAgICB0aGlzLmRlYnVnLmxvZygnaW5zdGFuY2UnKVxuXG4gICAgLyoqINCh0L7Qt9C00LDQvdC40LUg0L/QtdGA0LXQvNC10L3QvdGL0YUgV2ViR2wuICovXG4gICAgdGhpcy53ZWJnbC5jcmVhdGVWYXJpYWJsZXMoJ2FfcG9zaXRpb24nLCAnYV9jb2xvcicsICdhX3NpemUnLCAnYV9zaGFwZScsICd1X21hdHJpeCcpXG5cbiAgICAvKiog0J7QsdGA0LDQsdC+0YLQutCwINCy0YHQtdGFINC00LDQvdC90YvRhSDQvtCxINC+0LHRitC10LrRgtCw0YUg0Lgg0LjRhSDQt9Cw0LPRgNGD0LfQutCwINCyINCx0YPRhNC10YDRiyDQstC40LTQtdC+0L/QsNC80Y/RgtC4LiAqL1xuICAgIHRoaXMubG9hZERhdGEoKVxuXG4gICAgaWYgKHRoaXMuZm9yY2VSdW4pIHtcbiAgICAgIC8qKiDQpNC+0YDRgdC40YDQvtCy0LDQvdC90YvQuSDQt9Cw0L/Rg9GB0Log0YDQtdC90LTQtdGA0LjQvdCz0LAgKNC10YHQu9C4INGC0YDQtdCx0YPQtdGC0YHRjykuICovXG4gICAgICB0aGlzLnJ1bigpXG4gICAgfVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0KHQvtC30LTQsNC10YIg0Lgg0LfQsNC/0L7Qu9C90Y/QtdGCINC00LDQvdC90YvQvNC4INC+0LHQviDQstGB0LXRhSDQvtCx0YrQtdC60YLQsNGFINCx0YPRhNC10YDRiyBXZWJHTC5cbiAgICovXG4gIHByb3RlY3RlZCBsb2FkRGF0YSgpOiB2b2lkIHtcblxuICAgIHRoaXMuZGVidWcubG9nKCdsb2FkaW5nJylcblxuICAgIGxldCBncm91cHMgPSB7IHZlcnRpY2VzOiBbXSBhcyBudW1iZXJbXSwgY29sb3JzOiBbXSBhcyBudW1iZXJbXSwgc2l6ZXM6IFtdIGFzIG51bWJlcltdLCBzaGFwZXM6IFtdIGFzIG51bWJlcltdIH1cbiAgICB0aGlzLnN0YXRzID0geyBvYmpUb3RhbENvdW50OiAwLCBvYmpJbkdyb3VwQ291bnQ6IFtdIGFzIG51bWJlcltdLCBncm91cHNDb3VudDogMCwgbWVtVXNhZ2U6IDAgfVxuXG4gICAgbGV0IG9iamVjdDogU1Bsb3RPYmplY3QgfCBudWxsIHwgdW5kZWZpbmVkXG4gICAgbGV0IGk6IG51bWJlciA9IDBcbiAgICBsZXQgaXNPYmplY3RFbmRzOiBib29sZWFuID0gZmFsc2VcblxuICAgIHdoaWxlICghaXNPYmplY3RFbmRzKSB7XG5cbiAgICAgIG9iamVjdCA9IHRoaXMuaXRlcmF0b3IhKClcbiAgICAgIGlzT2JqZWN0RW5kcyA9IChvYmplY3QgPT09IG51bGwpIHx8ICh0aGlzLnN0YXRzLm9ialRvdGFsQ291bnQgPj0gdGhpcy5nbG9iYWxMaW1pdClcblxuICAgICAgaWYgKCFpc09iamVjdEVuZHMpIHtcbiAgICAgICAgZ3JvdXBzLnZlcnRpY2VzLnB1c2gob2JqZWN0IS54LCBvYmplY3QhLnkpXG4gICAgICAgIGdyb3Vwcy5zaGFwZXMucHVzaChvYmplY3QhLnNoYXBlKVxuICAgICAgICBncm91cHMuc2l6ZXMucHVzaChvYmplY3QhLnNpemUpXG4gICAgICAgIGdyb3Vwcy5jb2xvcnMucHVzaChvYmplY3QhLmNvbG9yKVxuICAgICAgICB0aGlzLnN0YXRzLm9ialRvdGFsQ291bnQrK1xuICAgICAgICBpKytcbiAgICAgIH1cblxuICAgICAgaWYgKChpID49IHRoaXMuZ3JvdXBMaW1pdCkgfHwgaXNPYmplY3RFbmRzKSB7XG4gICAgICAgIHRoaXMuc3RhdHMub2JqSW5Hcm91cENvdW50W3RoaXMuc3RhdHMuZ3JvdXBzQ291bnRdID0gaVxuXG4gICAgICAgIC8qKiDQodC+0LfQtNCw0L3QuNC1INC4INC30LDQv9C+0LvQvdC10L3QuNC1INCx0YPRhNC10YDQvtCyINC00LDQvdC90YvQvNC4INC+INGC0LXQutGD0YnQtdC5INCz0YDRg9C/0L/QtSDQvtCx0YrQtdC60YLQvtCyLiAqL1xuICAgICAgICB0aGlzLnN0YXRzLm1lbVVzYWdlICs9XG4gICAgICAgICAgdGhpcy53ZWJnbC5jcmVhdGVCdWZmZXIoJ3ZlcnRpY2VzJywgbmV3IEZsb2F0MzJBcnJheShncm91cHMudmVydGljZXMpKSArXG4gICAgICAgICAgdGhpcy53ZWJnbC5jcmVhdGVCdWZmZXIoJ2NvbG9ycycsIG5ldyBVaW50OEFycmF5KGdyb3Vwcy5jb2xvcnMpKSArXG4gICAgICAgICAgdGhpcy53ZWJnbC5jcmVhdGVCdWZmZXIoJ3NoYXBlcycsIG5ldyBVaW50OEFycmF5KGdyb3Vwcy5zaGFwZXMpKSArXG4gICAgICAgICAgdGhpcy53ZWJnbC5jcmVhdGVCdWZmZXIoJ3NpemVzJywgbmV3IEZsb2F0MzJBcnJheShncm91cHMuc2l6ZXMpKVxuICAgICAgfVxuXG4gICAgICBpZiAoKGkgPj0gdGhpcy5ncm91cExpbWl0KSAmJiAhaXNPYmplY3RFbmRzKSB7XG4gICAgICAgIHRoaXMuc3RhdHMuZ3JvdXBzQ291bnQrK1xuICAgICAgICBncm91cHMgPSB7IHZlcnRpY2VzOiBbXSwgY29sb3JzOiBbXSwgc2l6ZXM6IFtdLCBzaGFwZXM6IFtdIH1cbiAgICAgICAgaSA9IDBcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmRlYnVnLmxvZygnbG9hZGVkJylcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCf0YDQvtC40LfQstC+0LTQuNGCINGA0LXQvdC00LXRgNC40L3QsyDQs9GA0LDRhNC40LrQsCDQsiDRgdC+0L7RgtCy0LXRgtGB0YLQstC40Lgg0YEg0YLQtdC60YPRidC40LzQuCDQv9Cw0YDQsNC80LXRgtGA0LDQvNC4INGC0YDQsNC90YHRhNC+0YDQvNCw0YbQuNC4LlxuICAgKi9cbiAgcHVibGljIHJlbmRlcigpOiB2b2lkIHtcblxuICAgIC8qKiDQntGH0LjRgdGC0LrQsCDQvtCx0YrQtdC60YLQsCDRgNC10L3QtNC10YDQuNC90LPQsCBXZWJHTC4gKi9cbiAgICB0aGlzLndlYmdsLmNsZWFyQmFja2dyb3VuZCgpXG5cbiAgICAvKiog0J7QsdC90L7QstC70LXQvdC40LUg0LzQsNGC0YDQuNGG0Ysg0YLRgNCw0L3RgdGE0L7RgNC80LDRhtC40LguICovXG4gICAgdGhpcy5jb250cm9sLnVwZGF0ZVZpZXdQcm9qZWN0aW9uKClcblxuICAgIC8qKiDQn9GA0LjQstGP0LfQutCwINC80LDRgtGA0LjRhtGLINGC0YDQsNC90YHRhNC+0YDQvNCw0YbQuNC4INC6INC/0LXRgNC10LzQtdC90L3QvtC5INGI0LXQudC00LXRgNCwLiAqL1xuICAgIHRoaXMud2ViZ2wuc2V0VmFyaWFibGUoJ3VfbWF0cml4JywgdGhpcy5jb250cm9sLnRyYW5zZm9ybS52aWV3UHJvamVjdGlvbk1hdClcblxuICAgIC8qKiDQmNGC0LXRgNC40YDQvtCy0LDQvdC40LUg0Lgg0YDQtdC90LTQtdGA0LjQvdCzINCz0YDRg9C/0L8g0LHRg9GE0LXRgNC+0LIgV2ViR0wuICovXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnN0YXRzLmdyb3Vwc0NvdW50OyBpKyspIHtcblxuICAgICAgdGhpcy53ZWJnbC5zZXRCdWZmZXIoJ3ZlcnRpY2VzJywgaSwgJ2FfcG9zaXRpb24nLCAyLCAwLCAwKVxuICAgICAgdGhpcy53ZWJnbC5zZXRCdWZmZXIoJ2NvbG9ycycsIGksICdhX2NvbG9yJywgMSwgMCwgMClcbiAgICAgIHRoaXMud2ViZ2wuc2V0QnVmZmVyKCdzaXplcycsIGksICdhX3NpemUnLCAxLCAwLCAwKVxuICAgICAgdGhpcy53ZWJnbC5zZXRCdWZmZXIoJ3NoYXBlcycsIGksICdhX3NoYXBlJywgMSwgMCwgMClcblxuICAgICAgdGhpcy53ZWJnbC5kcmF3UG9pbnRzKDAsIHRoaXMuc3RhdHMub2JqSW5Hcm91cENvdW50W2ldKVxuICAgIH1cbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCf0YDQvtCy0LXRgNGP0LXRgiDQutC+0YDRgNC10LrRgtC90L7RgdGC0Ywg0L3QsNGB0YLRgNC+0LXQuiDRjdC60LfQtdC80L/Qu9GP0YDQsC5cbiAgICpcbiAgICogQHJlbWFya3NcbiAgICog0JjRgdC/0L7Qu9GM0LfRg9C10YLRgdGPINC00LvRjyDQv9GA0L7QstC10YDQutC4INC60L7RgNGA0LXQutGC0L3QvtGB0YLQuCDQu9C+0LPQuNC60Lgg0YDQsNCx0L7RgtGLINC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjyDRgSDRjdC60LfQtdC80L/Qu9GP0YDQvtC8LiDQndC1INC/0L7Qt9Cy0L7Qu9GP0LXRgiDRgNCw0LHQvtGC0LDRgtGMINGBXG4gICAqINC90LXQvdCw0YHRgtGA0L7QtdC90L3Ri9C8INC40LvQuCDQvdC10LrQvtGA0YDQtdC60YLQvdC+INC90LDRgdGC0YDQvtC10L3QvdGL0Lwg0Y3QutC30LXQvNC/0LvRj9GA0L7QvC5cbiAgICovXG4gIGNoZWNrU2V0dXAoKSB7XG5cbiAgICAvKipcbiAgICAgKiAg0J/QvtC70YzQt9C+0LLQsNGC0LXQu9GMINC80L7QsyDQvdCw0YHRgtGA0L7QuNGC0Ywg0Y3QutC30LXQvNC/0LvRj9GAINCyINC60L7QvdGB0YLRgNGD0LrRgtC+0YDQtSDQuCDRgdGA0LDQt9GDINC30LDQv9GD0YHRgtC40YLRjCDRgNC10L3QtNC10YAsINCyINGC0LDQutC+0Lwg0YHQu9GD0YfQsNC1INC80LXRgtC+0LQgc2V0dXBcbiAgICAgKiAg0LHRg9C00LXRgiDQstGL0LfRi9Cy0LDQtdGC0YHRjyDQvdC10Y/QstC90L4uXG4gICAgICovXG4gICAgaWYgKCF0aGlzLmlzU2V0dXBlZCkge1xuICAgICAgdGhpcy5zZXR1cCgpXG4gICAgfVxuXG4gICAgLyoqINCd0LDQsdC+0YAg0L/RgNC+0LLQtdGA0L7QuiDQutC+0YDRgNC10LrRgtC90L7RgdGC0Lgg0L3QsNGB0YLRgNC+0LnQutC4INGN0LrQt9C10LzQv9C70Y/RgNCwLiAqL1xuICAgIGlmICghdGhpcy5pdGVyYXRvcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCfQndC1INC30LDQtNCw0L3QsCDRhNGD0L3QutGG0LjRjyDQuNGC0LXRgNC40YDQvtCy0LDQvdC40Y8g0L7QsdGK0LXQutGC0L7QsiEnKVxuICAgIH1cbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCX0LDQv9GD0YHQutCw0LXRgiDRgNC10L3QtNC10YDQuNC90LMg0Lgg0LrQvtC90YLRgNC+0LvRjCDRg9C/0YDQsNCy0LvQtdC90LjRjy5cbiAgICovXG4gIHB1YmxpYyBydW4oKTogdm9pZCB7XG5cbiAgICB0aGlzLmNoZWNrU2V0dXAoKVxuXG4gICAgaWYgKCF0aGlzLmlzUnVubmluZykge1xuICAgICAgdGhpcy5yZW5kZXIoKVxuICAgICAgdGhpcy5jb250cm9sLnJ1bigpXG4gICAgICB0aGlzLmlzUnVubmluZyA9IHRydWVcbiAgICAgIHRoaXMuZGVidWcubG9nKCdzdGFydGVkJylcbiAgICB9XG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQntGB0YLQsNC90LDQstC70LjQstCw0LXRgiDRgNC10L3QtNC10YDQuNC90LMg0Lgg0LrQvtC90YLRgNC+0LvRjCDRg9C/0YDQsNCy0LvQtdC90LjRjy5cbiAgICovXG4gIHB1YmxpYyBzdG9wKCk6IHZvaWQge1xuXG4gICAgdGhpcy5jaGVja1NldHVwKClcblxuICAgIGlmICh0aGlzLmlzUnVubmluZykge1xuICAgICAgdGhpcy5jb250cm9sLnN0b3AoKVxuICAgICAgdGhpcy5pc1J1bm5pbmcgPSBmYWxzZVxuICAgICAgdGhpcy5kZWJ1Zy5sb2coJ3N0b3BlZCcpXG4gICAgfVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0J7Rh9C40YnQsNC10YIg0YTQvtC9LlxuICAgKi9cbiAgcHVibGljIGNsZWFyKCk6IHZvaWQge1xuXG4gICAgdGhpcy5jaGVja1NldHVwKClcblxuICAgIHRoaXMud2ViZ2wuY2xlYXJCYWNrZ3JvdW5kKClcbiAgICB0aGlzLmRlYnVnLmxvZygnY2xlYXJlZCcpXG4gIH1cbn1cbiIsIlxuLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqXG4gKiDQn9GA0L7QstC10YDRj9C10YIg0Y/QstC70Y/QtdGC0YHRjyDQu9C4INC/0LXRgNC10LzQtdC90L3QsNGPINGN0LrQt9C10LzQv9C70Y/RgNC+0Lwg0LrQsNC60L7Qs9C+LdC70LjQsdC+0L4g0LrQu9Cw0YHRgdCwLlxuICpcbiAqIEBwYXJhbSB2YXJpYWJsZSAtINCf0YDQvtCy0LXRgNGP0LXQvNCw0Y8g0L/QtdGA0LXQvNC10L3QvdCw0Y8uXG4gKiBAcmV0dXJucyDQoNC10LfRg9C70YzRgtCw0YIg0L/RgNC+0LLQtdGA0LrQuC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzT2JqZWN0KHZhcmlhYmxlOiBhbnkpOiBib29sZWFuIHtcbiAgcmV0dXJuIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFyaWFibGUpID09PSAnW29iamVjdCBPYmplY3RdJylcbn1cblxuLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqXG4gKiDQn9C10YDQtdC+0L/RgNC10LTQtdC70Y/QtdGCINC30L3QsNGH0LXQvdC40Y8g0L/QvtC70LXQuSDQvtCx0YrQtdC60YLQsCB0YXJnZXQg0L3QsCDQt9C90LDRh9C10L3QuNGPINC/0L7Qu9C10Lkg0L7QsdGK0LXQutGC0LAgc291cmNlLlxuICpcbiAqIEByZW1hcmtzXG4gKiDQn9C10YDQtdC+0L/RgNC10LTQtdC70Y/RjtGC0YHRjyDRgtC+0LvRjNC60L4g0YLQtSDQv9C+0LvRjywg0LrQvtGC0L7RgNGL0LUg0YHRg9GJ0LXRgdGC0LLRg9C10Y7RgiDQsiB0YXJnZXQuINCV0YHQu9C4INCyIHNvdXJjZSDQtdGB0YLRjCDQv9C+0LvRjywg0LrQvtGC0L7RgNGL0YUg0L3QtdGCINCyIHRhcmdldCwg0YLQviDQvtC90LhcbiAqINC40LPQvdC+0YDQuNGA0YPRjtGC0YHRjy4g0JXRgdC70Lgg0LrQsNC60LjQtS3RgtC+INC/0L7Qu9GPINGB0LDQvNC4INGP0LLQu9GP0Y7RgtGB0Y8g0Y/QstC70Y/RjtGC0YHRjyDQvtCx0YrQtdC60YLQsNC80LgsINGC0L4g0YLQviDQvtC90Lgg0YLQsNC60LbQtSDRgNC10LrRg9GA0YHQuNCy0L3QviDQutC+0L/QuNGA0YPRjtGC0YHRjyAo0L/RgNC4INGC0L7QvCDQttC1XG4gKiDRg9GB0LvQvtCy0LjQuCwg0YfRgtC+INCyINGG0LXQu9C10LLQvtC8INC+0LHRitC10LrRgtC1INGB0YPRidC10YHRgtCy0YPRjtGCINC/0L7Qu9GPINC+0LHRitC10LrRgtCwLdC40YHRgtC+0YfQvdC40LrQsCkuXG4gKlxuICogQHBhcmFtIHRhcmdldCAtINCm0LXQu9C10LLQvtC5ICjQuNC30LzQtdC90Y/QtdC80YvQuSkg0L7QsdGK0LXQutGCLlxuICogQHBhcmFtIHNvdXJjZSAtINCe0LHRitC10LrRgiDRgSDQtNCw0L3QvdGL0LzQuCwg0LrQvtGC0L7RgNGL0LUg0L3Rg9C20L3QviDRg9GB0YLQsNC90L7QstC40YLRjCDRgyDRhtC10LvQtdCy0L7Qs9C+INC+0LHRitC10LrRgtCwLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY29weU1hdGNoaW5nS2V5VmFsdWVzKHRhcmdldDogYW55LCBzb3VyY2U6IGFueSk6IHZvaWQge1xuICBPYmplY3Qua2V5cyhzb3VyY2UpLmZvckVhY2goa2V5ID0+IHtcbiAgICBpZiAoa2V5IGluIHRhcmdldCkge1xuICAgICAgaWYgKGlzT2JqZWN0KHNvdXJjZVtrZXldKSkge1xuICAgICAgICBpZiAoaXNPYmplY3QodGFyZ2V0W2tleV0pKSB7XG4gICAgICAgICAgY29weU1hdGNoaW5nS2V5VmFsdWVzKHRhcmdldFtrZXldLCBzb3VyY2Vba2V5XSlcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCFpc09iamVjdCh0YXJnZXRba2V5XSkgJiYgKHR5cGVvZiB0YXJnZXRba2V5XSAhPT0gJ2Z1bmN0aW9uJykpIHtcbiAgICAgICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pXG59XG5cbi8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKlxuICog0JLQvtC30LLRgNCw0YnQsNC10YIg0YHQu9GD0YfQsNC50L3QvtC1INGG0LXQu9C+0LUg0YfQuNGB0LvQviDQsiDQtNC40LDQv9Cw0LfQvtC90LU6IFswLi4ucmFuZ2UtMV0uXG4gKlxuICogQHBhcmFtIHJhbmdlIC0g0JLQtdGA0YXQvdC40Lkg0L/RgNC10LTQtdC7INC00LjQsNC/0LDQt9C+0L3QsCDRgdC70YPRh9Cw0LnQvdC+0LPQviDQstGL0LHQvtGA0LAuXG4gKiBAcmV0dXJucyDQodC70YPRh9Cw0LnQvdC+0LUg0YfQuNGB0LvQvi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJhbmRvbUludChyYW5nZTogbnVtYmVyKTogbnVtYmVyIHtcbiAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHJhbmdlKVxufVxuXG4vKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICpcbiAqINCa0L7QvdCy0LXRgNGC0LjRgNGD0LXRgiDRhtCy0LXRgiDQuNC3IEhFWC3RhNC+0YDQvNCw0YLQsCDQsiBHTFNMLdGE0L7RgNC80LDRgi5cbiAqXG4gKiBAcGFyYW0gaGV4Q29sb3IgLSDQptCy0LXRgiDQsiBIRVgt0YTQvtGA0LzQsNGC0LUgKFwiI2ZmZmZmZlwiKS5cbiAqIEByZXR1cm5zINCc0LDRgdGB0LjQsiDQuNC3INGC0YDQtdGFINGH0LjRgdC10Lsg0LIg0LTQuNCw0L/QsNC30L7QvdC1INC+0YIgMCDQtNC+IDEuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb2xvckZyb21IZXhUb0dsUmdiKGhleENvbG9yOiBzdHJpbmcpOiBudW1iZXJbXSB7XG4gIGxldCBrID0gL14jPyhbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KSQvaS5leGVjKGhleENvbG9yKVxuICBsZXQgW3IsIGcsIGJdID0gW3BhcnNlSW50KGshWzFdLCAxNikgLyAyNTUsIHBhcnNlSW50KGshWzJdLCAxNikgLyAyNTUsIHBhcnNlSW50KGshWzNdLCAxNikgLyAyNTVdXG4gIHJldHVybiBbciwgZywgYl1cbn1cblxuLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqXG4gKiDQktC+0LfQstGA0LDRidCw0LXRgiDRgdGC0YDQvtC60L7QstGD0Y4g0LfQsNC/0LjRgdGMINGC0LXQutGD0YnQtdCz0L4g0LLRgNC10LzQtdC90LguXG4gKlxuICogQHJldHVybnMg0KHRgtGA0L7QutCwINCy0YDQtdC80LXQvdC4INCyINGE0L7RgNC80LDRgtC1IFwiaGg6bW06c3NcIi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEN1cnJlbnRUaW1lKCk6IHN0cmluZyB7XG5cbiAgbGV0IHRvZGF5ID0gbmV3IERhdGUoKVxuXG4gIHJldHVybiBbXG4gICAgdG9kYXkuZ2V0SG91cnMoKS50b1N0cmluZygpLnBhZFN0YXJ0KDIsICcwJyksXG4gICAgdG9kYXkuZ2V0TWludXRlcygpLnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgJzAnKSxcbiAgICB0b2RheS5nZXRTZWNvbmRzKCkudG9TdHJpbmcoKS5wYWRTdGFydCgyLCAnMCcpXG4gIF0uam9pbignOicpXG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9pbmRleC50c1wiKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=