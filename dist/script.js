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
exports.SHAPES = exports.FRAGMENT_TEMPLATE = exports.VERTEX_TEMPLATE = void 0;
exports.VERTEX_TEMPLATE = "\nprecision lowp float;\nattribute lowp vec2 a_position;\nattribute float a_color;\nattribute float a_size;\nattribute float a_shape;\nuniform lowp mat3 u_matrix;\nvarying lowp vec3 v_color;\nvarying float v_shape;\nvoid main() {\n  gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0.0, 1.0);\n  gl_PointSize = a_size;\n  v_shape = a_shape;\n  {COLOR-SELECTION}\n}\n";
exports.FRAGMENT_TEMPLATE = "\nprecision lowp float;\nvarying vec3 v_color;\nvarying float v_shape;\n{SHAPES-FUNCTIONS}\nvoid main() {\n  {SHAPE-SELECTION}\n  gl_FragColor = vec4(v_color.rgb, 1.0);\n}\n";
exports.SHAPES = [];
exports.SHAPES[0] = // Квадрат
    "\n";
exports.SHAPES[1] = // Круг
    "\nif (length(gl_PointCoord - 0.5) > 0.5) discard;\n";
exports.SHAPES[2] = // Крест
    "\nif ((all(lessThan(gl_PointCoord, vec2(0.3)))) ||\n  ((gl_PointCoord.x > 0.7) && (gl_PointCoord.y < 0.3)) ||\n  (all(greaterThan(gl_PointCoord, vec2(0.7)))) ||\n  ((gl_PointCoord.x < 0.3) && (gl_PointCoord.y > 0.7))\n  ) discard;\n";
exports.SHAPES[3] = // Треугольник
    "\nvec2 pos = vec2(gl_PointCoord.x, gl_PointCoord.y - 0.1) - 0.5;\nfloat a = atan(pos.x, pos.y) + 2.09439510239;\nif (step(0.285, cos(floor(0.5 + a / 2.09439510239) * 2.09439510239 - a) * length(pos)) > 0.9) discard;\n";
exports.SHAPES[4] = // Шестеренка
    "\nvec2 pos = vec2(0.5) - gl_PointCoord;\nfloat r = length(pos) * 1.62;\nfloat a = atan(pos.y, pos.x);\nfloat f = cos(a * 3.0);\nf = step(0.0, cos(a * 10.0)) * 0.2 + 0.5;\nif ( step(f, r) > 0.5 ) discard;\n";


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
var m3 = __importStar(__webpack_require__(/*! @/math3x3 */ "./math3x3.ts"));
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
var utils_1 = __webpack_require__(/*! @/utils */ "./utils.ts");
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
var utils_1 = __webpack_require__(/*! @/utils */ "./utils.ts");
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
var shaders = __importStar(__webpack_require__(/*! @/shaders */ "./shaders.ts"));
var utils_1 = __webpack_require__(/*! @/utils */ "./utils.ts");
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
        /** Вычисление количества различных форм объектов. */
        this.splot.shapesCount = shaders.SHAPES.length;
    };
    /** ****************************************************************************
     *
     * Создает код вершинного шейдера.
     *
     * @remarks
     * В шаблон вершинного шейдера вставляется код выбора цвета объекта по индексу цвета. Т.к.шейдер не позволяет
     * использовать в качестве индексов переменные - для задания цвета используется последовательный перебор цветовых
     * индексов.
     */
    SPlotGlsl.prototype.makeVertShaderSource = function () {
        /** Временное добавление в палитру вершин цвета направляющих. */
        this.splot.colors.push(this.splot.grid.rulesColor);
        var code = '';
        /** Формировние кода установки цвета объекта по индексу. */
        this.splot.colors.forEach(function (value, index) {
            var _a = utils_1.colorFromHexToGlRgb(value), r = _a[0], g = _a[1], b = _a[2];
            code += "else if (a_color == " + index + ".0) v_color = vec3(" + r + ", " + g + ", " + b + ");\n";
        });
        /** Удаление из палитры вершин временно добавленного цвета направляющих. */
        this.splot.colors.pop();
        /** Удаление лишнего "else" в начале кода и лишнего перевода строки в конце. */
        code = code.slice(5).slice(0, -1);
        return shaders.VERTEX_TEMPLATE.replace('{COLOR-SELECTION}', code).trim();
    };
    /** ****************************************************************************
     *
     * Создает код фрагментного шейдера.
     */
    SPlotGlsl.prototype.makeFragShaderSource = function () {
        var code1 = '';
        var code2 = '';
        shaders.SHAPES.forEach(function (value, index) {
            /** Формирование кода функций, описывающих формы объектов. */
            code1 += "void s" + index + "() { " + value.trim() + " }\n";
            /** Формирование кода установки формы объекта по индексу. */
            code2 += "else if (v_shape == " + index + ".0) { s" + index + "();}\n";
        });
        /** Удаление лишнего перевода строки в конце. */
        code1 = code1.slice(0, -1);
        /** Удаление лишнего "else" в начале кода и лишнего перевода строки в конце. */
        code2 = code2.slice(5).slice(0, -1);
        return shaders.FRAGMENT_TEMPLATE.
            replace('{SHAPES-FUNCTIONS}', code1).
            replace('{SHAPE-SELECTION}', code2).
            trim();
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
var utils_1 = __webpack_require__(/*! @/utils */ "./utils.ts");
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
var utils_1 = __webpack_require__(/*! @/utils */ "./utils.ts");
var splot_control_1 = __importDefault(__webpack_require__(/*! @/splot-control */ "./splot-control.ts"));
var splot_webgl_1 = __importDefault(__webpack_require__(/*! @/splot-webgl */ "./splot-webgl.ts"));
var splot_debug_1 = __importDefault(__webpack_require__(/*! @/splot-debug */ "./splot-debug.ts"));
var splot_demo_1 = __importDefault(__webpack_require__(/*! @/splot-demo */ "./splot-demo.ts"));
var splot_glsl_1 = __importDefault(__webpack_require__(/*! @/splot-glsl */ "./splot-glsl.ts"));
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
        /** Подготовка всех хелперов. Последовательность подготовки имеет значение. */
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
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
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
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!******************!*\
  !*** ./index.js ***!
  \******************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _splot__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/splot */ "./splot.ts");
/* harmony import */ var _splot__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_splot__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _style__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/style */ "./style.css");



/** ************************************************************************* */

let n = 1_000_000
let colors = ['#D81C01', '#E9967A', '#BA55D3', '#FFD700', '#FFE4B5', '#FF8C00', '#228B22', '#90EE90', '#4169E1', '#00BFFF', '#8B4513', '#00CED1']
let width = 32_000
let height = 16_000

/** Синтетическая итерирующая функция. */
let i = 0
function readNextObject() {
  if (i < n) {
    i++
    return {
      x: randomInt(width),
      y: randomInt(height),
      shape: randomInt(5),
      size: 10 + randomInt(21),
      color: randomInt(colors.length)
    }
  } else {
    i = 0
    return null  // Возвращаем null, когда объекты "закончились".
  }
}

function randomInt(range) {
  return Math.floor(Math.random() * range)
}

/** ************************************************************************* */

let scatterPlot = new (_splot__WEBPACK_IMPORTED_MODULE_0___default())('canvas1')

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
})

scatterPlot.run()

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zdHlsZS5jc3MiLCJ3ZWJwYWNrOi8vLy4vbWF0aDN4My50cyIsIndlYnBhY2s6Ly8vLi9zaGFkZXJzLnRzIiwid2VicGFjazovLy8uL3NwbG90LWNvbnRyb2wudHMiLCJ3ZWJwYWNrOi8vLy4vc3Bsb3QtZGVidWcudHMiLCJ3ZWJwYWNrOi8vLy4vc3Bsb3QtZGVtby50cyIsIndlYnBhY2s6Ly8vLi9zcGxvdC1nbHNsLnRzIiwid2VicGFjazovLy8uL3NwbG90LXdlYmdsLnRzIiwid2VicGFjazovLy8uL3NwbG90LnRzIiwid2VicGFjazovLy8uL3V0aWxzLnRzIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly8vLi9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7OztBQ0NBOztHQUVHO0FBQ0gsU0FBZ0IsUUFBUSxDQUFDLENBQVcsRUFBRSxDQUFXO0lBQy9DLE9BQU87UUFDTCxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMs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QUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3JDLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckMsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNyQyxJQUFNLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztJQUN0RCxPQUFPO1FBQ0osQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEdBQUc7UUFDM0IsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFD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RUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDO1FBQzlDLEtBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQztLQUMvQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7QUFDYixDQUFDO0FBVEQsd0NBU0M7Ozs7Ozs7VUMvRUQ7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGdDQUFnQyxZQUFZO1dBQzVDO1dBQ0EsRTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHdDQUF3Qyx5Q0FBeUM7V0FDakY7V0FDQTtXQUNBLEU7Ozs7O1dDUEEsd0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0Esc0RBQXNELGtCQUFrQjtXQUN4RTtXQUNBLCtDQUErQyxjQUFjO1dBQzdELEU7Ozs7Ozs7Ozs7Ozs7O0FDTjJCO0FBQ1g7O0FBRWhCOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsc0JBQXNCLCtDQUFLOztBQUUzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEIiwiZmlsZSI6InNjcmlwdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIlxuLyoqXG4gKiDQo9C80L3QvtC20LDQtdGCINC80LDRgtGA0LjRhtGLLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbXVsdGlwbHkoYTogbnVtYmVyW10sIGI6IG51bWJlcltdKTogbnVtYmVyW10ge1xuICByZXR1cm4gW1xuICAgIGJbMF0gKiBhWzBdICsgYlsxXSAqIGFbM10gKyBiWzJdICogYVs2XSxcbiAgICBiWzBdICogYVsxXSArIGJbMV0gKiBhWzRdICsgYlsyXSAqIGFbN10sXG4gICAgYlswXSAqIGFbMl0gKyBiWzFdICogYVs1XSArIGJbMl0gKiBhWzhdLFxuICAgIGJbM10gKiBhWzBdICsgYls0XSAqIGFbM10gKyBiWzVdICogYVs2XSxcbiAgICBiWzNdICogYVsxXSArIGJbNF0gKiBhWzRdICsgYls1XSAqIGFbN10sXG4gICAgYlszXSAqIGFbMl0gKyBiWzRdICogYVs1XSArIGJbNV0gKiBhWzhdLFxuICAgIGJbNl0gKiBhWzBdICsgYls3XSAqIGFbM10gKyBiWzhdICogYVs2XSxcbiAgICBiWzZdICogYVsxXSArIGJbN10gKiBhWzRdICsgYls4XSAqIGFbN10sXG4gICAgYls2XSAqIGFbMl0gKyBiWzddICogYVs1XSArIGJbOF0gKiBhWzhdXG4gIF1cbn1cblxuLyoqXG4gKiDQodC+0LfQtNCw0LXRgiDQtdC00LjQvdC40YfQvdGD0Y4g0LzQsNGC0YDQuNGG0YMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpZGVudGl0eSgpOiBudW1iZXJbXSB7XG4gIHJldHVybiBbXG4gICAgMSwgMCwgMCxcbiAgICAwLCAxLCAwLFxuICAgIDAsIDAsIDFcbiAgXVxufVxuXG4vKipcbiAqIENyZWF0ZXMgYSAyRCBwcm9qZWN0aW9uIG1hdHJpeC4gUmV0dXJucyBhIHByb2plY3Rpb24gbWF0cml4IHRoYXQgY29udmVydHMgZnJvbSBwaXhlbHMgdG8gY2xpcHNwYWNlIHdpdGggWSA9IDAgYXQgdGhlXG4gKiB0b3AuIFRoaXMgbWF0cml4IGZsaXBzIHRoZSBZIGF4aXMgc28gMCBpcyBhdCB0aGUgdG9wLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcHJvamVjdGlvbih3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlcik6IG51bWJlcltdIHtcbiAgcmV0dXJuIFtcbiAgICAyIC8gd2lkdGgsIDAsIDAsXG4gICAgMCwgLTIgLyBoZWlnaHQsIDAsXG4gICAgLTEsIDEsIDFcbiAgXVxufVxuXG4vKipcbiAqIENyZWF0ZXMgYSAyRCB0cmFuc2xhdGlvbiBtYXRyaXguIFJldHVybnMgYSB0cmFuc2xhdGlvbiBtYXRyaXggdGhhdCB0cmFuc2xhdGVzIGJ5IHR4IGFuZCB0eS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRyYW5zbGF0aW9uKHR4OiBudW1iZXIsIHR5OiBudW1iZXIpOiBudW1iZXJbXSB7XG4gIHJldHVybiBbXG4gICAgMSwgMCwgMCxcbiAgICAwLCAxLCAwLFxuICAgIHR4LCB0eSwgMVxuICBdXG59XG5cbi8qKlxuICogTXVsdGlwbGllcyBieSBhIDJEIHRyYW5zbGF0aW9uIG1hdHJpeFxuICovXG5leHBvcnQgZnVuY3Rpb24gdHJhbnNsYXRlKG06IG51bWJlcltdLCB0eDogbnVtYmVyLCB0eTogbnVtYmVyKTogbnVtYmVyW10ge1xuICByZXR1cm4gbXVsdGlwbHkobSwgdHJhbnNsYXRpb24odHgsIHR5KSlcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgMkQgc2NhbGluZyBtYXRyaXhcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNjYWxpbmcoc3g6IG51bWJlciwgc3k6IG51bWJlcik6IG51bWJlcltdIHtcbiAgcmV0dXJuIFtcbiAgICBzeCwgMCwgMCxcbiAgICAwLCBzeSwgMCxcbiAgICAwLCAwLCAxXG4gIF1cbn1cblxuLyoqXG4gKiBNdWx0aXBsaWVzIGJ5IGEgMkQgc2NhbGluZyBtYXRyaXhcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNjYWxlKG06IG51bWJlcltdLCBzeDogbnVtYmVyLCBzeTogbnVtYmVyKTogbnVtYmVyW10ge1xuICByZXR1cm4gbXVsdGlwbHkobSwgc2NhbGluZyhzeCwgc3kpKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdHJhbnNmb3JtUG9pbnQobTogbnVtYmVyW10sIHY6IG51bWJlcltdKTogbnVtYmVyW10ge1xuICBjb25zdCBkID0gdlswXSAqIG1bMl0gKyB2WzFdICogbVs1XSArIG1bOF1cbiAgcmV0dXJuIFtcbiAgICAodlswXSAqIG1bMF0gKyB2WzFdICogbVszXSArIG1bNl0pIC8gZCxcbiAgICAodlswXSAqIG1bMV0gKyB2WzFdICogbVs0XSArIG1bN10pIC8gZFxuICBdXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbnZlcnNlKG06IG51bWJlcltdKTogbnVtYmVyW10ge1xuICBjb25zdCB0MDAgPSBtWzRdICogbVs4XSAtIG1bNV0gKiBtWzddXG4gIGNvbnN0IHQxMCA9IG1bMV0gKiBtWzhdIC0gbVsyXSAqIG1bN11cbiAgY29uc3QgdDIwID0gbVsxXSAqIG1bNV0gLSBtWzJdICogbVs0XVxuICBjb25zdCBkID0gMS4wIC8gKG1bMF0gKiB0MDAgLSBtWzNdICogdDEwICsgbVs2XSAqIHQyMClcbiAgcmV0dXJuIFtcbiAgICAgZCAqIHQwMCwgLWQgKiB0MTAsIGQgKiB0MjAsXG4gICAgLWQgKiAobVszXSAqIG1bOF0gLSBtWzVdICogbVs2XSksXG4gICAgIGQgKiAobVswXSAqIG1bOF0gLSBtWzJdICogbVs2XSksXG4gICAgLWQgKiAobVswXSAqIG1bNV0gLSBtWzJdICogbVszXSksXG4gICAgIGQgKiAobVszXSAqIG1bN10gLSBtWzRdICogbVs2XSksXG4gICAgLWQgKiAobVswXSAqIG1bN10gLSBtWzFdICogbVs2XSksXG4gICAgIGQgKiAobVswXSAqIG1bNF0gLSBtWzFdICogbVszXSlcbiAgXVxufVxuIiwiZXhwb3J0IGNvbnN0IFZFUlRFWF9URU1QTEFURSA9XG5gXG5wcmVjaXNpb24gbG93cCBmbG9hdDtcbmF0dHJpYnV0ZSBsb3dwIHZlYzIgYV9wb3NpdGlvbjtcbmF0dHJpYnV0ZSBmbG9hdCBhX2NvbG9yO1xuYXR0cmlidXRlIGZsb2F0IGFfc2l6ZTtcbmF0dHJpYnV0ZSBmbG9hdCBhX3NoYXBlO1xudW5pZm9ybSBsb3dwIG1hdDMgdV9tYXRyaXg7XG52YXJ5aW5nIGxvd3AgdmVjMyB2X2NvbG9yO1xudmFyeWluZyBmbG9hdCB2X3NoYXBlO1xudm9pZCBtYWluKCkge1xuICBnbF9Qb3NpdGlvbiA9IHZlYzQoKHVfbWF0cml4ICogdmVjMyhhX3Bvc2l0aW9uLCAxKSkueHksIDAuMCwgMS4wKTtcbiAgZ2xfUG9pbnRTaXplID0gYV9zaXplO1xuICB2X3NoYXBlID0gYV9zaGFwZTtcbiAge0NPTE9SLVNFTEVDVElPTn1cbn1cbmBcblxuZXhwb3J0IGNvbnN0IEZSQUdNRU5UX1RFTVBMQVRFID1cbmBcbnByZWNpc2lvbiBsb3dwIGZsb2F0O1xudmFyeWluZyB2ZWMzIHZfY29sb3I7XG52YXJ5aW5nIGZsb2F0IHZfc2hhcGU7XG57U0hBUEVTLUZVTkNUSU9OU31cbnZvaWQgbWFpbigpIHtcbiAge1NIQVBFLVNFTEVDVElPTn1cbiAgZ2xfRnJhZ0NvbG9yID0gdmVjNCh2X2NvbG9yLnJnYiwgMS4wKTtcbn1cbmBcblxuZXhwb3J0IGNvbnN0IFNIQVBFUzogc3RyaW5nW10gPSBbXVxuXG5TSEFQRVNbMF0gPSAgLy8g0JrQstCw0LTRgNCw0YJcbmBcbmBcblxuU0hBUEVTWzFdID0gIC8vINCa0YDRg9CzXG5gXG5pZiAobGVuZ3RoKGdsX1BvaW50Q29vcmQgLSAwLjUpID4gMC41KSBkaXNjYXJkO1xuYFxuXG5TSEFQRVNbMl0gPSAgLy8g0JrRgNC10YHRglxuYFxuaWYgKChhbGwobGVzc1RoYW4oZ2xfUG9pbnRDb29yZCwgdmVjMigwLjMpKSkpIHx8XG4gICgoZ2xfUG9pbnRDb29yZC54ID4gMC43KSAmJiAoZ2xfUG9pbnRDb29yZC55IDwgMC4zKSkgfHxcbiAgKGFsbChncmVhdGVyVGhhbihnbF9Qb2ludENvb3JkLCB2ZWMyKDAuNykpKSkgfHxcbiAgKChnbF9Qb2ludENvb3JkLnggPCAwLjMpICYmIChnbF9Qb2ludENvb3JkLnkgPiAwLjcpKVxuICApIGRpc2NhcmQ7XG5gXG5cblNIQVBFU1szXSA9ICAvLyDQotGA0LXRg9Cz0L7Qu9GM0L3QuNC6XG5gXG52ZWMyIHBvcyA9IHZlYzIoZ2xfUG9pbnRDb29yZC54LCBnbF9Qb2ludENvb3JkLnkgLSAwLjEpIC0gMC41O1xuZmxvYXQgYSA9IGF0YW4ocG9zLngsIHBvcy55KSArIDIuMDk0Mzk1MTAyMzk7XG5pZiAoc3RlcCgwLjI4NSwgY29zKGZsb29yKDAuNSArIGEgLyAyLjA5NDM5NTEwMjM5KSAqIDIuMDk0Mzk1MTAyMzkgLSBhKSAqIGxlbmd0aChwb3MpKSA+IDAuOSkgZGlzY2FyZDtcbmBcblxuU0hBUEVTWzRdID0gIC8vINCo0LXRgdGC0LXRgNC10L3QutCwXG5gXG52ZWMyIHBvcyA9IHZlYzIoMC41KSAtIGdsX1BvaW50Q29vcmQ7XG5mbG9hdCByID0gbGVuZ3RoKHBvcykgKiAxLjYyO1xuZmxvYXQgYSA9IGF0YW4ocG9zLnksIHBvcy54KTtcbmZsb2F0IGYgPSBjb3MoYSAqIDMuMCk7XG5mID0gc3RlcCgwLjAsIGNvcyhhICogMTAuMCkpICogMC4yICsgMC41O1xuaWYgKCBzdGVwKGYsIHIpID4gMC41ICkgZGlzY2FyZDtcbmBcbiIsImltcG9ydCBTUGxvdCBmcm9tICdAL3NwbG90J1xuaW1wb3J0ICogYXMgbTMgZnJvbSAnQC9tYXRoM3gzJ1xuXG4vKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICpcbiAqINCa0LvQsNGB0YEt0YXQtdC70L/QtdGALCDRgNC10LDQu9C40LfRg9GO0YnQuNC5INC+0LHRgNCw0LHQvtGC0LrRgyDRgdGA0LXQtNGB0YLQsiDQstCy0L7QtNCwICjQvNGL0YjQuCwg0YLRgNC10LrQv9Cw0LTQsCDQuCDRgi7Qvy4pINC4INC80LDRgtC10LzQsNGC0LjRh9C10YHQutC40LUg0YDQsNGB0YfQtdGC0Ysg0YLQtdGF0L3QuNGH0LXRgdC60LjRhSDQtNCw0L3QvdGL0YUsXG4gKiDRgdC+0L7RgtCy0LXRgtGB0LLRg9GO0YnQuNGFINGC0YDQsNC90YHRhNC+0YDQvNCw0YbQuNGP0Lwg0LPRgNCw0YTQuNC60LAg0LTQu9GPINC60LvQsNGB0YHQsCBTcGxvdC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU1Bsb3RDb250b2wgaW1wbGVtZW50cyBTUGxvdEhlbHBlciB7XG5cbiAgLyoqINCi0LXRhdC90LjRh9C10YHQutCw0Y8g0LjQvdGE0L7RgNC80LDRhtC40Y8sINC40YHQv9C+0LvRjNC30YPQtdC80LDRjyDQv9GA0LjQu9C+0LbQtdC90LjQtdC8INC00LvRjyDRgNCw0YHRh9C10YLQsCDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuS4gKi9cbiAgcHVibGljIHRyYW5zZm9ybTogU1Bsb3RUcmFuc2Zvcm0gPSB7XG4gICAgdmlld1Byb2plY3Rpb25NYXQ6IFtdLFxuICAgIHN0YXJ0SW52Vmlld1Byb2pNYXQ6IFtdLFxuICAgIHN0YXJ0Q2FtZXJhOiB7IHg6IDAsIHk6IDAsIHpvb206IDEgfSxcbiAgICBzdGFydFBvczogW10sXG4gICAgc3RhcnRDbGlwUG9zOiBbXSxcbiAgICBzdGFydE1vdXNlUG9zOiBbXVxuICB9XG5cbiAgLyoqINCe0LHRgNCw0LHQvtGC0YfQuNC60Lgg0YHQvtCx0YvRgtC40Lkg0YEg0LfQsNC60YDQtdC/0LvQtdC90L3Ri9C80Lgg0LrQvtC90YLQtdC60YHRgtCw0LzQuC4gKi9cbiAgcHJvdGVjdGVkIGhhbmRsZU1vdXNlRG93bldpdGhDb250ZXh0OiBFdmVudExpc3RlbmVyID0gdGhpcy5oYW5kbGVNb3VzZURvd24uYmluZCh0aGlzKSBhcyBFdmVudExpc3RlbmVyXG4gIHByb3RlY3RlZCBoYW5kbGVNb3VzZVdoZWVsV2l0aENvbnRleHQ6IEV2ZW50TGlzdGVuZXIgPSB0aGlzLmhhbmRsZU1vdXNlV2hlZWwuYmluZCh0aGlzKSBhcyBFdmVudExpc3RlbmVyXG4gIHByb3RlY3RlZCBoYW5kbGVNb3VzZU1vdmVXaXRoQ29udGV4dDogRXZlbnRMaXN0ZW5lciA9IHRoaXMuaGFuZGxlTW91c2VNb3ZlLmJpbmQodGhpcykgYXMgRXZlbnRMaXN0ZW5lclxuICBwcm90ZWN0ZWQgaGFuZGxlTW91c2VVcFdpdGhDb250ZXh0OiBFdmVudExpc3RlbmVyID0gdGhpcy5oYW5kbGVNb3VzZVVwLmJpbmQodGhpcykgYXMgRXZlbnRMaXN0ZW5lclxuXG4gIC8qKiDQpdC10LvQv9C10YAg0LHRg9C00LXRgiDQuNC80LXRgtGMINC/0L7Qu9C90YvQuSDQtNC+0YHRgtGD0L8g0Log0Y3QutC30LXQvNC/0LvRj9GA0YMgU1Bsb3QuICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIHJlYWRvbmx5IHNwbG90OiBTUGxvdFxuICApIHsgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCf0L7QtNCz0L7RgtCw0LLQu9C40LLQsNC10YIg0YXQtdC70L/QtdGAINC6INC40YHQv9C+0LvRjNC30L7QstCw0L3QuNGOLlxuICAgKi9cbiAgc2V0dXAoKTogdm9pZCB7XG5cbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCX0LDQv9GD0YHQutCw0LXRgiDQv9GA0L7RgdC70YPRiNC60YMg0YHQvtCx0YvRgtC40Lkg0LzRi9GI0LguXG4gICAqL1xuICBwdWJsaWMgcnVuKCk6IHZvaWQge1xuICAgIHRoaXMuc3Bsb3QuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMuaGFuZGxlTW91c2VEb3duV2l0aENvbnRleHQpXG4gICAgdGhpcy5zcGxvdC5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignd2hlZWwnLCB0aGlzLmhhbmRsZU1vdXNlV2hlZWxXaXRoQ29udGV4dClcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCe0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdGCINC/0YDQvtGB0LvRg9GI0LrRgyDRgdC+0LHRi9GC0LjQuSDQvNGL0YjQuC5cbiAgICovXG4gIHB1YmxpYyBzdG9wKCk6IHZvaWQge1xuICAgIHRoaXMuc3Bsb3QuY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMuaGFuZGxlTW91c2VEb3duV2l0aENvbnRleHQpXG4gICAgdGhpcy5zcGxvdC5jYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcignd2hlZWwnLCB0aGlzLmhhbmRsZU1vdXNlV2hlZWxXaXRoQ29udGV4dClcbiAgICB0aGlzLnNwbG90LmNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLmhhbmRsZU1vdXNlTW92ZVdpdGhDb250ZXh0KVxuICAgIHRoaXMuc3Bsb3QuY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLmhhbmRsZU1vdXNlVXBXaXRoQ29udGV4dClcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCh0L7Qt9C00LDQtdGCINC80LDRgtGA0LjRhtGDINC00LvRjyDRgtC10LrRg9GJ0LXQs9C+INC/0L7Qu9C+0LbQtdC90LjRjyDQvtCx0LvQsNGB0YLQuCDQv9GA0L7RgdC80L7RgtGA0LAuXG4gICAqL1xuICBwcm90ZWN0ZWQgbWFrZUNhbWVyYU1hdHJpeCgpOiBudW1iZXJbXSB7XG5cbiAgICBjb25zdCB6b29tU2NhbGUgPSAxIC8gdGhpcy5zcGxvdC5jYW1lcmEuem9vbSFcblxuICAgIGxldCBjYW1lcmFNYXQgPSBtMy5pZGVudGl0eSgpXG4gICAgY2FtZXJhTWF0ID0gbTMudHJhbnNsYXRlKGNhbWVyYU1hdCwgdGhpcy5zcGxvdC5jYW1lcmEueCEsIHRoaXMuc3Bsb3QuY2FtZXJhLnkhKVxuICAgIGNhbWVyYU1hdCA9IG0zLnNjYWxlKGNhbWVyYU1hdCwgem9vbVNjYWxlLCB6b29tU2NhbGUpXG5cbiAgICByZXR1cm4gY2FtZXJhTWF0XG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQntCx0L3QvtCy0LvRj9C10YIg0LzQsNGC0YDQuNGG0YMg0YLRgNCw0L3RgdGE0L7RgNC80LDRhtC40LguXG4gICAqL1xuICBwdWJsaWMgdXBkYXRlVmlld1Byb2plY3Rpb24oKTogdm9pZCB7XG4gICAgY29uc3QgcHJvamVjdGlvbk1hdCA9IG0zLnByb2plY3Rpb24odGhpcy5zcGxvdC5jYW52YXMud2lkdGgsIHRoaXMuc3Bsb3QuY2FudmFzLmhlaWdodClcbiAgICBjb25zdCBjYW1lcmFNYXQgPSB0aGlzLm1ha2VDYW1lcmFNYXRyaXgoKVxuICAgIGxldCB2aWV3TWF0ID0gbTMuaW52ZXJzZShjYW1lcmFNYXQpXG4gICAgdGhpcy50cmFuc2Zvcm0udmlld1Byb2plY3Rpb25NYXQgPSBtMy5tdWx0aXBseShwcm9qZWN0aW9uTWF0LCB2aWV3TWF0KVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0J/RgNC10L7QsdGA0LDQt9GD0LXRgiDQutC+0L7RgNC00LjQvdCw0YLRiyDQvNGL0YjQuCDQsiBHTC3QutC+0L7RgNC00LjQvdCw0YLRiy5cbiAgICovXG4gIHByb3RlY3RlZCBnZXRDbGlwU3BhY2VNb3VzZVBvc2l0aW9uKGV2ZW50OiBNb3VzZUV2ZW50KTogbnVtYmVyW10ge1xuXG4gICAgLyoqINCg0LDRgdGH0LXRgiDQv9C+0LvQvtC20LXQvdC40Y8g0LrQsNC90LLQsNGB0LAg0L/QviDQvtGC0L3QvtGI0LXQvdC40Y4g0Log0LzRi9GI0LguICovXG4gICAgY29uc3QgcmVjdCA9IHRoaXMuc3Bsb3QuY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgY29uc3QgY3NzWCA9IGV2ZW50LmNsaWVudFggLSByZWN0LmxlZnRcbiAgICBjb25zdCBjc3NZID0gZXZlbnQuY2xpZW50WSAtIHJlY3QudG9wXG5cbiAgICAvKiog0J3QvtGA0LzQsNC70LjQt9Cw0YbQuNGPINC60L7QvtGA0LTQuNC90LDRgiBbMC4uMV0gKi9cbiAgICBjb25zdCBub3JtWCA9IGNzc1ggLyB0aGlzLnNwbG90LmNhbnZhcy5jbGllbnRXaWR0aFxuICAgIGNvbnN0IG5vcm1ZID0gY3NzWSAvIHRoaXMuc3Bsb3QuY2FudmFzLmNsaWVudEhlaWdodFxuXG4gICAgLyoqINCf0L7Qu9GD0YfQtdC90LjQtSBHTC3QutC+0L7RgNC00LjQvdCw0YIgWy0xLi4xXSAqL1xuICAgIGNvbnN0IGNsaXBYID0gbm9ybVggKiAyIC0gMVxuICAgIGNvbnN0IGNsaXBZID0gbm9ybVkgKiAtMiArIDFcblxuICAgIHJldHVybiBbY2xpcFgsIGNsaXBZXVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0J/QtdGA0LXQvNC10YnQsNC10YIg0L7QsdC70LDRgdGC0Ywg0LLQuNC00LjQvNC+0YHRgtC4LlxuICAgKi9cbiAgcHJvdGVjdGVkIG1vdmVDYW1lcmEoZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcblxuICAgIGNvbnN0IHBvcyA9IG0zLnRyYW5zZm9ybVBvaW50KHRoaXMudHJhbnNmb3JtLnN0YXJ0SW52Vmlld1Byb2pNYXQsIHRoaXMuZ2V0Q2xpcFNwYWNlTW91c2VQb3NpdGlvbihldmVudCkpXG5cbiAgICB0aGlzLnNwbG90LmNhbWVyYS54ID0gdGhpcy50cmFuc2Zvcm0uc3RhcnRDYW1lcmEueCEgKyB0aGlzLnRyYW5zZm9ybS5zdGFydFBvc1swXSAtIHBvc1swXVxuICAgIHRoaXMuc3Bsb3QuY2FtZXJhLnkgPSB0aGlzLnRyYW5zZm9ybS5zdGFydENhbWVyYS55ISArIHRoaXMudHJhbnNmb3JtLnN0YXJ0UG9zWzFdIC0gcG9zWzFdXG5cbiAgICB0aGlzLnNwbG90LnJlbmRlcigpXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQoNC10LDQs9C40YDRg9C10YIg0L3QsCDQtNCy0LjQttC10L3QuNC1INC80YvRiNC4INCyINC80L7QvNC10L3Rgiwg0LrQvtCz0LTQsCDQtdC1INC60LvQsNCy0LjRiNCwINGD0LTQtdGA0LbQuNCy0LDQtdGC0YHRjyDQvdCw0LbQsNGC0L7QuS4g0JzQtdGC0L7QtCDQv9C10YDQtdC80LXRidCw0LXRgiDQvtCx0LvQsNGB0YLRjCDQstC40LTQuNC80L7RgdGC0Lgg0L3QsFxuICAgKiDQv9C70L7RgdC60L7RgdGC0Lgg0LLQvNC10YHRgtC1INGBINC00LLQuNC20LXQvdC40LXQvCDQvNGL0YjQuC5cbiAgICovXG4gIHByb3RlY3RlZCBoYW5kbGVNb3VzZU1vdmUoZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICB0aGlzLm1vdmVDYW1lcmEoZXZlbnQpXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQoNC10LDQs9C40YDRg9C10YIg0L3QsCDQvtGC0LbQsNGC0LjQtSDQutC70LDQstC40YjQuCDQvNGL0YjQuC4g0JIg0LzQvtC80LXQvdGCINC+0YLQttCw0YLQuNGPINC60LvQsNCy0LjRiNC4INCw0L3QsNC70LjQtyDQtNCy0LjQttC10L3QuNGPINC80YvRiNC4INGBINC30LDQttCw0YLQvtC5INC60LvQsNCy0LjRiNC10Lkg0L/RgNC10LrRgNCw0YnQsNC10YLRgdGPLlxuICAgKi9cbiAgcHJvdGVjdGVkIGhhbmRsZU1vdXNlVXAoZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcblxuICAgIHRoaXMuc3Bsb3QucmVuZGVyKClcblxuICAgIGV2ZW50LnRhcmdldCEucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5oYW5kbGVNb3VzZU1vdmVXaXRoQ29udGV4dClcbiAgICBldmVudC50YXJnZXQhLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLmhhbmRsZU1vdXNlVXBXaXRoQ29udGV4dClcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCg0LXQsNCz0LjRgNGD0LXRgiDQvdCwINC90LDQttCw0YLQuNC1INC60LvQsNCy0LjRiNC4INC80YvRiNC4LiDQkiDQvNC+0LzQtdC90YIg0L3QsNC20LDRgtC40Y8g0Lgg0YPQtNC10YDQttCw0L3QuNGPINC60LvQsNCy0LjRiNC4INC30LDQv9GD0YHQutCw0LXRgtGB0Y8g0LDQvdCw0LvQuNC3INC00LLQuNC20LXQvdC40Y8g0LzRi9GI0LggKNGBINC30LDQttCw0YLQvtC5XG4gICAqINC60LvQsNCy0LjRiNC10LkpLlxuICAgKi9cbiAgcHJvdGVjdGVkIGhhbmRsZU1vdXNlRG93bihldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuXG4gICAgdGhpcy5zcGxvdC5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5oYW5kbGVNb3VzZU1vdmVXaXRoQ29udGV4dClcbiAgICB0aGlzLnNwbG90LmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5oYW5kbGVNb3VzZVVwV2l0aENvbnRleHQpXG5cbiAgICAvKiog0KDQsNGB0YfQtdGCINGC0YDQsNC90YHRhNC+0YDQvNCw0YbQuNC5LiAqL1xuICAgIHRoaXMudHJhbnNmb3JtLnN0YXJ0SW52Vmlld1Byb2pNYXQgPSBtMy5pbnZlcnNlKHRoaXMudHJhbnNmb3JtLnZpZXdQcm9qZWN0aW9uTWF0KVxuICAgIHRoaXMudHJhbnNmb3JtLnN0YXJ0Q2FtZXJhID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zcGxvdC5jYW1lcmEpXG4gICAgdGhpcy50cmFuc2Zvcm0uc3RhcnRDbGlwUG9zID0gdGhpcy5nZXRDbGlwU3BhY2VNb3VzZVBvc2l0aW9uKGV2ZW50KVxuICAgIHRoaXMudHJhbnNmb3JtLnN0YXJ0UG9zID0gbTMudHJhbnNmb3JtUG9pbnQodGhpcy50cmFuc2Zvcm0uc3RhcnRJbnZWaWV3UHJvak1hdCwgdGhpcy50cmFuc2Zvcm0uc3RhcnRDbGlwUG9zKVxuICAgIHRoaXMudHJhbnNmb3JtLnN0YXJ0TW91c2VQb3MgPSBbZXZlbnQuY2xpZW50WCwgZXZlbnQuY2xpZW50WV1cblxuICAgIHRoaXMuc3Bsb3QucmVuZGVyKClcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCg0LXQsNCz0LjRgNGD0LXRgiDQvdCwINC30YPQvNC40YDQvtCy0LDQvdC40LUg0LzRi9GI0LguINCSINC80L7QvNC10L3RgiDQt9GD0LzQuNGA0L7QstCw0L3QuNGPINC80YvRiNC4INC/0YDQvtC40YHRhdC+0LTQuNGCINC30YPQvNC40YDQvtCy0LDQvdC40LUg0LrQvtC+0YDQtNC40L3QsNGC0L3QvtC5INC/0LvQvtGB0LrQvtGB0YLQuC5cbiAgICovXG4gIHByb3RlY3RlZCBoYW5kbGVNb3VzZVdoZWVsKGV2ZW50OiBXaGVlbEV2ZW50KTogdm9pZCB7XG5cbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgICAvKiog0JLRi9GH0LjRgdC70LXQvdC40LUg0L/QvtC30LjRhtC40Lgg0LzRi9GI0Lgg0LIgR0wt0LrQvtC+0YDQtNC40L3QsNGC0LDRhS4gKi9cbiAgICBjb25zdCBbY2xpcFgsIGNsaXBZXSA9IHRoaXMuZ2V0Q2xpcFNwYWNlTW91c2VQb3NpdGlvbihldmVudClcblxuICAgIC8qKiDQn9C+0LfQuNGG0LjRjyDQvNGL0YjQuCDQtNC+INC30YPQvNC40YDQvtCy0LDQvdC40Y8uICovXG4gICAgY29uc3QgW3ByZVpvb21YLCBwcmVab29tWV0gPSBtMy50cmFuc2Zvcm1Qb2ludChtMy5pbnZlcnNlKHRoaXMudHJhbnNmb3JtLnZpZXdQcm9qZWN0aW9uTWF0KSwgW2NsaXBYLCBjbGlwWV0pXG5cbiAgICAvKiog0J3QvtCy0L7QtSDQt9C90LDRh9C10L3QuNC1INC30YPQvNCwINC+0LHQu9Cw0YHRgtC4INC/0YDQvtGB0LzQvtGC0YDQsCDRjdC60YHQv9C+0L3QtdC90YbQuNCw0LvRjNC90L4g0LfQsNCy0LjRgdC40YIg0L7RgiDQstC10LvQuNGH0LjQvdGLINC30YPQvNC40YDQvtCy0LDQvdC40Y8g0LzRi9GI0LguICovXG4gICAgY29uc3QgbmV3Wm9vbSA9IHRoaXMuc3Bsb3QuY2FtZXJhLnpvb20hICogTWF0aC5wb3coMiwgZXZlbnQuZGVsdGFZICogLTAuMDEpXG5cbiAgICAvKiog0JzQsNC60YHQuNC80LDQu9GM0L3QvtC1INC4INC80LjQvdC40LzQsNC70YzQvdC+0LUg0LfQvdCw0YfQtdC90LjRjyDQt9GD0LzQsCDQvtCx0LvQsNGB0YLQuCDQv9GA0L7RgdC80L7RgtGA0LAuICovXG4gICAgdGhpcy5zcGxvdC5jYW1lcmEuem9vbSA9IE1hdGgubWF4KDAuMDAyLCBNYXRoLm1pbigyMDAsIG5ld1pvb20pKVxuXG4gICAgLyoqINCe0LHQvdC+0LLQu9C10L3QuNC1INC80LDRgtGA0LjRhtGLINGC0YDQsNC90YHRhNC+0YDQvNCw0YbQuNC4LiAqL1xuICAgIHRoaXMudXBkYXRlVmlld1Byb2plY3Rpb24oKVxuXG4gICAgLyoqINCf0L7Qt9C40YbQuNGPINC80YvRiNC4INC/0L7RgdC70LUg0LfRg9C80LjRgNC+0LLQsNC90LjRjy4gKi9cbiAgICBjb25zdCBbcG9zdFpvb21YLCBwb3N0Wm9vbVldID0gbTMudHJhbnNmb3JtUG9pbnQobTMuaW52ZXJzZSh0aGlzLnRyYW5zZm9ybS52aWV3UHJvamVjdGlvbk1hdCksIFtjbGlwWCwgY2xpcFldKVxuXG4gICAgLyoqINCS0YvRh9C40YHQu9C10L3QuNC1INC90L7QstC+0LPQviDQv9C+0LvQvtC20LXQvdC40Y8g0L7QsdC70LDRgdGC0Lgg0L/RgNC+0YHQvNC+0YLRgNCwINC/0L7RgdC70LUg0LfRg9C80LjRgNC+0LLQsNC90LjRjy4gKi9cbiAgICB0aGlzLnNwbG90LmNhbWVyYS54ISArPSBwcmVab29tWCAtIHBvc3Rab29tWFxuICAgIHRoaXMuc3Bsb3QuY2FtZXJhLnkhICs9IHByZVpvb21ZIC0gcG9zdFpvb21ZXG5cbiAgICB0aGlzLnNwbG90LnJlbmRlcigpXG4gIH1cbn1cbiIsImltcG9ydCBTUGxvdCBmcm9tICdAL3NwbG90J1xuaW1wb3J0IHsgZ2V0Q3VycmVudFRpbWUgfSBmcm9tICdAL3V0aWxzJ1xuXG4vKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICpcbiAqINCa0LvQsNGB0YEt0YXQtdC70L/QtdGALCDRgNC10LDQu9C40LfRg9GO0YnQuNC5INC/0L7QtNC00LXRgNC20LrRgyDRgNC10LbQuNC80LAg0L7RgtC70LDQtNC60Lgg0LTQu9GPINC60LvQsNGB0YHQsCBTUGxvdC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU1Bsb3REZWJ1ZyBpbXBsZW1lbnRzIFNQbG90SGVscGVyIHtcblxuICAvKiog0J/RgNC40LfQvdCw0Log0LDQutGC0LjQstCw0YbQuNC4INGA0LXQttC40Lwg0L7RgtC70LDQtNC60LguICovXG4gIHB1YmxpYyBpc0VuYWJsZTogYm9vbGVhbiA9IGZhbHNlXG5cbiAgLyoqINCh0YLQuNC70Ywg0LfQsNCz0L7Qu9C+0LLQutCwINGA0LXQttC40LzQsCDQvtGC0LvQsNC00LrQuC4gKi9cbiAgcHVibGljIGhlYWRlclN0eWxlOiBzdHJpbmcgPSAnZm9udC13ZWlnaHQ6IGJvbGQ7IGNvbG9yOiAjZmZmZmZmOyBiYWNrZ3JvdW5kLWNvbG9yOiAjY2MwMDAwOydcblxuICAvKiog0KHRgtC40LvRjCDQt9Cw0LPQvtC70L7QstC60LAg0LPRgNGD0L/Qv9GLINC/0LDRgNCw0LzQtdGC0YDQvtCyLiAqL1xuICBwdWJsaWMgZ3JvdXBTdHlsZTogc3RyaW5nID0gJ2ZvbnQtd2VpZ2h0OiBib2xkOyBjb2xvcjogI2ZmZmZmZjsnXG5cbiAgLyoqINCl0LXQu9C/0LXRgCDQsdGD0LTQtdGCINC40LzQtdGC0Ywg0L/QvtC70L3Ri9C5INC00L7RgdGC0YPQvyDQuiDRjdC60LfQtdC80L/Qu9GP0YDRgyBTUGxvdC4gKi9cbiAgY29uc3RydWN0b3IoXG4gICAgcmVhZG9ubHkgc3Bsb3Q6IFNQbG90XG4gICkge31cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQn9C+0LTQs9C+0YLQsNCy0LvQuNCy0LDQtdGCINGF0LXQu9C/0LXRgCDQuiDQuNGB0L/QvtC70YzQt9C+0LLQsNC90LjRji5cbiAgICovXG4gIHB1YmxpYyBzZXR1cChjbGVhckNvbnNvbGU6IGJvb2xlYW4gPSBmYWxzZSk6IHZvaWQge1xuICAgIGlmIChjbGVhckNvbnNvbGUpIHtcbiAgICAgIGNvbnNvbGUuY2xlYXIoKVxuICAgIH1cbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCS0YvQstC+0LTQuNGCINCyINC60L7QvdGB0L7Qu9GMINC+0YLQu9Cw0LTQvtGH0L3Rg9GOINC40L3RhNC+0YDQvNCw0YbQuNGOLCDQtdGB0LvQuCDQstC60LvRjtGH0LXQvSDRgNC10LbQuNC8INC+0YLQu9Cw0LTQutC4LlxuICAgKlxuICAgKiBAcmVtYXJrc1xuICAgKiDQntGC0LvQsNC00L7Rh9C90LDRjyDQuNC90YTQvtGA0LzQsNGG0LjRjyDQstGL0LLQvtC00LjRgtGB0Y8g0LHQu9C+0LrQsNC80LguINCd0LDQt9Cy0LDQvdC40Y8g0LHQu9C+0LrQvtCyINC/0LXRgNC10LTQsNGO0YLRgdGPINCyINC80LXRgtC+0LQg0L/QtdGA0LXRh9C40YHQu9C10L3QuNC10Lwg0YHRgtGA0L7Qui4g0JrQsNC20LTQsNGPINGB0YLRgNC+0LrQsFxuICAgKiDQuNC90YLQtdGA0L/RgNC10YLQuNGA0YPQtdGC0YHRjyDQutCw0Log0LjQvNGPINC80LXRgtC+0LTQsC4g0JXRgdC70Lgg0L3Rg9C20L3Ri9C1INC80LXRgtC+0LTRiyDQstGL0LLQvtC00LAg0LHQu9C+0LrQsCDRgdGD0YnQtdGB0YLQstGD0Y7RgiAtINC+0L3QuCDQstGL0LfRi9Cy0LDRjtGC0YHRjy4g0JXRgdC70Lgg0LzQtdGC0L7QtNCwINGBINC90YPQttC90YvQvFxuICAgKiDQvdCw0LfQstCw0L3QuNC10Lwg0L3QtSDRgdGD0YnQtdGB0YLQstGD0LXRgiAtINCz0LXQvdC10YDQuNGA0YPQtdGC0YHRjyDQvtGI0LjQsdC60LAuXG4gICAqXG4gICAqIEBwYXJhbSBsb2dJdGVtcyAtINCf0LXRgNC10YfQuNGB0LvQtdC90LjQtSDRgdGC0YDQvtC6INGBINC90LDQt9Cy0LDQvdC40Y/QvNC4INC+0YLQu9Cw0LTQvtGH0L3Ri9GFINCx0LvQvtC60L7Qsiwg0LrQvtGC0L7RgNGL0LUg0L3Rg9C20L3QviDQvtGC0L7QsdGA0LDQt9C40YLRjCDQsiDQutC+0L3RgdC+0LvQuC5cbiAgICovXG4gIHB1YmxpYyBsb2coLi4ubG9nSXRlbXM6IHN0cmluZ1tdKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuaXNFbmFibGUpIHtcbiAgICAgIGxvZ0l0ZW1zLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgIGlmICh0eXBlb2YgKHRoaXMgYXMgYW55KVtpdGVtXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICh0aGlzIGFzIGFueSlbaXRlbV0oKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcign0J7RgtC70LDQtNC+0YfQvdC+0LPQviDQsdC70L7QutCwICcgKyBpdGVtICsgJ1wiINC90LUg0YHRg9GJ0LXRgdGC0LLRg9C10YIhJylcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQktGL0LLQvtC00LjRgiDRgdC+0L7QsdGJ0LXQvdC40LUg0L7QsSDQvtGI0LjQsdC60LUuXG4gICAqL1xuICBwdWJsaWMgZXJyb3IobWVzc2FnZTogc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuaXNFbmFibGUpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IobWVzc2FnZSlcbiAgICB9XG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQktGL0LLQvtC00LjRgiDQstGB0YLRg9C/0LjRgtC10LvRjNC90YPRjiDRh9Cw0YHRgtGMINC+INGA0LXQttC40LzQtSDQvtGC0LvQsNC00LrQuC5cbiAgICovXG4gIHB1YmxpYyBpbnRybygpOiB2b2lkIHtcbiAgICBjb25zb2xlLmxvZygnJWPQntGC0LvQsNC00LrQsCBTUGxvdCDQvdCwINC+0LHRitC10LrRgtC1ICMnICsgdGhpcy5zcGxvdC5jYW52YXMuaWQsIHRoaXMuaGVhZGVyU3R5bGUpXG5cbiAgICBpZiAodGhpcy5zcGxvdC5kZW1vLmlzRW5hYmxlKSB7XG4gICAgICBjb25zb2xlLmxvZygnJWPQktC60LvRjtGH0LXQvSDQtNC10LzQvtC90YHRgtGA0LDRhtC40L7QvdC90YvQuSDRgNC10LbQuNC8INC00LDQvdC90YvRhScsIHRoaXMuZ3JvdXBTdHlsZSlcbiAgICB9XG5cbiAgICBjb25zb2xlLmdyb3VwKCclY9Cf0YDQtdC00YPQv9GA0LXQttC00LXQvdC40LUnLCB0aGlzLmdyb3VwU3R5bGUpXG4gICAgY29uc29sZS5sb2coJ9Ce0YLQutGA0YvRgtCw0Y8g0LrQvtC90YHQvtC70Ywg0LHRgNCw0YPQt9C10YDQsCDQuCDQtNGA0YPQs9C40LUg0LDQutGC0LjQstC90YvQtSDRgdGA0LXQtNGB0YLQstCwINC60L7QvdGC0YDQvtC70Y8g0YDQsNC30YDQsNCx0L7RgtC60Lgg0YHRg9GJ0LXRgdGC0LLQtdC90L3QviDRgdC90LjQttCw0Y7RgiDQv9GA0L7QuNC30LLQvtC00LjRgtC10LvRjNC90L7RgdGC0Ywg0LLRi9GB0L7QutC+0L3QsNCz0YDRg9C20LXQvdC90YvRhSDQv9GA0LjQu9C+0LbQtdC90LjQuS4g0JTQu9GPINC+0LHRitC10LrRgtC40LLQvdC+0LPQviDQsNC90LDQu9C40LfQsCDQv9GA0L7QuNC30LLQvtC00LjRgtC10LvRjNC90L7RgdGC0Lgg0LLRgdC1INC/0L7QtNC+0LHQvdGL0LUg0YHRgNC10LTRgdGC0LLQsCDQtNC+0LvQttC90Ysg0LHRi9GC0Ywg0L7RgtC60LvRjtGH0LXQvdGLLCDQsCDQutC+0L3RgdC+0LvRjCDQsdGAetCw0YPQt9C10YDQsCDQt9Cw0LrRgNGL0YLQsC4g0J3QtdC60L7RgtC+0YDRi9C1INC00LDQvdC90YvQtSDQvtGC0LvQsNC00L7Rh9C90L7QuSDQuNC90YTQvtGA0LzQsNGG0LjQuCDQsiDQt9Cw0LLQuNGB0LjQvNC+0YHRgtC4INC+0YIg0LjRgdC/0L7Qu9GM0LfRg9C10LzQvtCz0L4g0LHRgNCw0YPQt9C10YDQsCDQvNC+0LPRg9GCINC90LUg0L7RgtC+0LHRgNCw0LbQsNGC0YzRgdGPINC40LvQuCDQvtGC0L7QsdGA0LDQttCw0YLRjNGB0Y8g0L3QtdC60L7RgNGA0LXQutGC0L3Qvi4g0KHRgNC10LTRgdGC0LLQviDQvtGC0LvQsNC00LrQuCDQv9GA0L7RgtC10YHRgtC40YDQvtCy0LDQvdC+INCyINCx0YDQsNGD0LfQtdGA0LUgR29vZ2xlIENocm9tZSB2LjkwJylcbiAgICBjb25zb2xlLmdyb3VwRW5kKClcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCS0YvQstC+0LTQuNGCINC40L3RhNC+0YDQvNCw0YbQuNGOINC+INCz0YDQsNGE0LjRh9C10YHQutC+0Lkg0YHQuNGB0YLQtdC80LUg0LrQu9C40LXQvdGC0LAuXG4gICAqL1xuICBwdWJsaWMgZ3B1KCk6IHZvaWQge1xuICAgIGNvbnNvbGUuZ3JvdXAoJyVj0JLQuNC00LXQvtGB0LjRgdGC0LXQvNCwJywgdGhpcy5ncm91cFN0eWxlKVxuICAgIGNvbnNvbGUubG9nKCfQk9GA0LDRhNC40YfQtdGB0LrQsNGPINC60LDRgNGC0LA6ICcgKyB0aGlzLnNwbG90LndlYmdsLmdwdS5oYXJkd2FyZSlcbiAgICBjb25zb2xlLmxvZygn0JLQtdGA0YHQuNGPIEdMOiAnICsgdGhpcy5zcGxvdC53ZWJnbC5ncHUuc29mdHdhcmUpXG4gICAgY29uc29sZS5ncm91cEVuZCgpXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQktGL0LLQvtC00LjRgiDQuNC90YTQvtGA0LzQsNGG0LjRjyDQviDRgtC10LrRg9GJ0LXQvCDRjdC60LfQtdC80L/Qu9GP0YDQtSDQutC70LDRgdGB0LAgU1Bsb3QuXG4gICAqL1xuICBwdWJsaWMgaW5zdGFuY2UoKTogdm9pZCB7XG5cbiAgICBjb25zb2xlLmdyb3VwKCclY9Cd0LDRgdGC0YDQvtC50LrQsCDQv9Cw0YDQsNC80LXRgtGA0L7QsiDRjdC60LfQtdC80L/Qu9GP0YDQsCcsIHRoaXMuZ3JvdXBTdHlsZSlcbiAgICBjb25zb2xlLmRpcih0aGlzLnNwbG90KVxuICAgIGNvbnNvbGUubG9nKCfQoNCw0LfQvNC10YAg0LrQsNC90LLQsNGB0LA6ICcgKyB0aGlzLnNwbG90LmNhbnZhcy53aWR0aCArICcgeCAnICsgdGhpcy5zcGxvdC5jYW52YXMuaGVpZ2h0ICsgJyBweCcpXG4gICAgY29uc29sZS5sb2coJ9Cg0LDQt9C80LXRgCDQv9C70L7RgdC60L7RgdGC0Lg6ICcgKyB0aGlzLnNwbG90LmdyaWQud2lkdGggKyAnIHggJyArIHRoaXMuc3Bsb3QuZ3JpZC5oZWlnaHQgKyAnIHB4JylcblxuICAgIGlmICh0aGlzLnNwbG90LmRlbW8uaXNFbmFibGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKCfQodC/0L7RgdC+0LEg0L/QvtC70YPRh9C10L3QuNGPINC00LDQvdC90YvRhTogJyArICfQtNC10LzQvi3QtNCw0L3QvdGL0LUnKVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZygn0KHQv9C+0YHQvtCxINC/0L7Qu9GD0YfQtdC90LjRjyDQtNCw0L3QvdGL0YU6ICcgKyAn0LjRgtC10YDQuNGA0L7QstCw0L3QuNC1JylcbiAgICB9XG4gICAgY29uc29sZS5ncm91cEVuZCgpXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQktGL0LLQvtC00LjRgiDQutC+0LTRiyDRiNC10LnQtNC10YDQvtCyLlxuICAgKi9cbiAgcHVibGljIHNoYWRlcnMoKTogdm9pZCB7XG4gICAgY29uc29sZS5ncm91cCgnJWPQodC+0LfQtNCw0L0g0LLQtdGA0YjQuNC90L3Ri9C5INGI0LXQudC00LXRgDogJywgdGhpcy5ncm91cFN0eWxlKVxuICAgIGNvbnNvbGUubG9nKHRoaXMuc3Bsb3QuZ2xzbC52ZXJ0U2hhZGVyU291cmNlKVxuICAgIGNvbnNvbGUuZ3JvdXBFbmQoKVxuICAgIGNvbnNvbGUuZ3JvdXAoJyVj0KHQvtC30LTQsNC9INGE0YDQsNCz0LzQtdC90YLQvdGL0Lkg0YjQtdC50LTQtdGAOiAnLCB0aGlzLmdyb3VwU3R5bGUpXG4gICAgY29uc29sZS5sb2codGhpcy5zcGxvdC5nbHNsLmZyYWdTaGFkZXJTb3VyY2UpXG4gICAgY29uc29sZS5ncm91cEVuZCgpXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQktGL0LLQvtC00LjRgiDRgdC+0L7QsdGJ0LXQvdC40LUg0L4g0L3QsNGH0LDQu9C1INC/0YDQvtGG0LXRgdGB0LUg0LfQsNCz0YDRg9C30LrQuCDQtNCw0L3QvdGL0YUuXG4gICAqL1xuICBwdWJsaWMgbG9hZGluZygpOiB2b2lkIHtcbiAgICBjb25zb2xlLmxvZygnJWPQl9Cw0L/Rg9GJ0LXQvSDQv9GA0L7RhtC10YHRgSDQt9Cw0LPRgNGD0LfQutC4INC00LDQvdC90YvRhSBbJyArIGdldEN1cnJlbnRUaW1lKCkgKyAnXS4uLicsIHRoaXMuZ3JvdXBTdHlsZSlcbiAgICBjb25zb2xlLnRpbWUoJ9CU0LvQuNGC0LXQu9GM0L3QvtGB0YLRjCcpXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQktGL0LLQvtC00LjRgiDRgdGC0LDRgtC40YHRgtC40LrRgyDQv9C+INC30LDQstC10YDRiNC10L3QuNC4INC/0YDQvtGG0LXRgdGB0LAg0LfQsNCz0YDRg9C30LrQuCDQtNCw0L3QvdGL0YUuXG4gICAqL1xuICBwdWJsaWMgbG9hZGVkKCk6IHZvaWQge1xuICAgIGNvbnNvbGUuZ3JvdXAoJyVj0JfQsNCz0YDRg9C30LrQsCDQtNCw0L3QvdGL0YUg0LfQsNCy0LXRgNGI0LXQvdCwIFsnICsgZ2V0Q3VycmVudFRpbWUoKSArICddJywgdGhpcy5ncm91cFN0eWxlKVxuICAgIGNvbnNvbGUudGltZUVuZCgn0JTQu9C40YLQtdC70YzQvdC+0YHRgtGMJylcbiAgICBjb25zb2xlLmxvZygn0KDQsNGB0YXQvtC0INCy0LjQtNC10L7Qv9Cw0LzRj9GC0Lg6ICcgKyAodGhpcy5zcGxvdC5zdGF0cy5tZW1Vc2FnZSAvIDEwMDAwMDApLnRvRml4ZWQoMikudG9Mb2NhbGVTdHJpbmcoKSArICcg0JzQkScpXG4gICAgY29uc29sZS5sb2coJ9Ca0L7Quy3QstC+INC+0LHRitC10LrRgtC+0LI6ICcgKyB0aGlzLnNwbG90LnN0YXRzLm9ialRvdGFsQ291bnQudG9Mb2NhbGVTdHJpbmcoKSlcbiAgICBjb25zb2xlLmxvZygn0JrQvtC7LdCy0L4g0LPRgNGD0L/QvyDQsdGD0YTQtdGA0L7QsjogJyArIHRoaXMuc3Bsb3Quc3RhdHMuZ3JvdXBzQ291bnQudG9Mb2NhbGVTdHJpbmcoKSlcbiAgICBjb25zb2xlLmxvZygn0KDQtdC30YPQu9GM0YLQsNGCOiAnICsgKCh0aGlzLnNwbG90LnN0YXRzLm9ialRvdGFsQ291bnQgPj0gdGhpcy5zcGxvdC5nbG9iYWxMaW1pdCkgP1xuICAgICAgJ9C00L7RgdGC0LjQs9C90YPRgiDQu9C40LzQuNGCINC+0LHRitC10LrRgtC+0LIgKCcgKyB0aGlzLnNwbG90Lmdsb2JhbExpbWl0LnRvTG9jYWxlU3RyaW5nKCkgKyAnKScgOlxuICAgICAgJ9C+0LHRgNCw0LHQvtGC0LDQvdGLINCy0YHQtSDQvtCx0YrQtdC60YLRiycpKVxuICAgIGNvbnNvbGUuZ3JvdXBFbmQoKVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JLRi9Cy0L7QtNC40YIg0YHQvtC+0LHRidC10L3QuNC1INC+INC30LDQv9GD0YHQutC1INGA0LXQvdC00LXRgNCwLlxuICAgKi9cbiAgcHVibGljIHN0YXJ0ZWQoKTogdm9pZCB7XG4gICAgY29uc29sZS5sb2coJyVj0KDQtdC90LTQtdGAINC30LDQv9GD0YnQtdC9JywgdGhpcy5ncm91cFN0eWxlKVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JLRi9Cy0L7QtNC40YIg0YHQvtC+0LHRidC10L3QuNC1INC+0LEg0L7RgdGC0LDQvdC+0LLQutC1INGA0LXQvdC00LXRgNCwLlxuICAgKi9cbiAgcHVibGljIHN0b3BlZCgpOiB2b2lkIHtcbiAgICBjb25zb2xlLmxvZygnJWPQoNC10L3QtNC10YAg0L7RgdGC0LDQvdC+0LLQu9C10L0nLCB0aGlzLmdyb3VwU3R5bGUpXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQktGL0LLQvtC00LjRgiDRgdC+0L7QsdGI0LXQvdC40LUg0L7QsSDQvtGH0LjRgdGC0LrQtSDQvtCx0LvQsNGB0YLQuCDRgNC10L3QtNC10YDQsC5cbiAgICovXG4gIHB1YmxpYyBjbGVhcmVkKGNvbG9yOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zb2xlLmxvZygnJWPQntCx0LvQsNGB0YLRjCDRgNC10L3QtNC10YDQsCDQvtGH0LjRidC10L3QsCBbJyArIGNvbG9yICsgJ10nLCB0aGlzLmdyb3VwU3R5bGUpO1xuICB9XG59XG4iLCJpbXBvcnQgU1Bsb3QgZnJvbSAnQC9zcGxvdCdcbmltcG9ydCB7IHJhbmRvbUludCB9IGZyb20gJ0AvdXRpbHMnXG5cbi8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKlxuICog0JrQu9Cw0YHRgS3RhdC10LvQv9C10YAsINGA0LXQsNC70LjQt9GD0Y7RidC40Lkg0L/QvtC00LTQtdGA0LbQutGDINGA0LXQttC40LzQsCDQtNC10LzQvtC90YHRgtGA0LDRhtC40L7QvdC90YvRhSDQtNCw0L3QvdGL0YUg0LTQu9GPINC60LvQsNGB0YHQsCBTUGxvdC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU1Bsb3REZW1vIGltcGxlbWVudHMgU1Bsb3RIZWxwZXIge1xuXG4gIC8qKiDQn9GA0LjQt9C90LDQuiDQsNC60YLQuNCy0LDRhtC40Lgg0LTQtdC80L4t0YDQtdC20LjQvNCwLiAqL1xuICBwdWJsaWMgaXNFbmFibGU6IGJvb2xlYW4gPSBmYWxzZVxuXG4gIC8qKiDQmtC+0LvQuNGH0LXRgdGC0LLQviDQsdGK0LXQutGC0L7Qsi4gKi9cbiAgcHVibGljIGFtb3VudDogbnVtYmVyID0gMV8wMDBfMDAwXG5cbiAgLyoqINCc0LjQvdC40LzQsNC70YzQvdGL0Lkg0YDQsNC30LzQtdGAINC+0LHRitC10LrRgtC+0LIuICovXG4gIHB1YmxpYyBzaXplTWluOiBudW1iZXIgPSAxMFxuXG4gIC8qKiDQnNCw0LrRgdC40LzQsNC70YzQvdGL0Lkg0YDQsNC30LzQtdGAINC+0LHRitC10LrRgtC+0LIuICovXG4gIHB1YmxpYyBzaXplTWF4OiBudW1iZXIgPSAzMFxuXG4gIC8qKiDQptCy0LXRgtC+0LLQsNGPINC/0LDQu9C40YLRgNCwINC+0LHRitC10LrRgtC+0LIuICovXG4gIHB1YmxpYyBjb2xvcnM6IHN0cmluZ1tdID0gW1xuICAgICcjRDgxQzAxJywgJyNFOTk2N0EnLCAnI0JBNTVEMycsICcjRkZENzAwJywgJyNGRkU0QjUnLCAnI0ZGOEMwMCcsXG4gICAgJyMyMjhCMjInLCAnIzkwRUU5MCcsICcjNDE2OUUxJywgJyMwMEJGRkYnLCAnIzhCNDUxMycsICcjMDBDRUQxJ1xuICBdXG5cbiAgLyoqINCh0YfQtdGC0YfQuNC6INC40YLQtdGA0LjRgNGD0LXQvNGL0YUg0L7QsdGK0LXQutGC0L7Qsi4gKi9cbiAgcHJpdmF0ZSBpbmRleDogbnVtYmVyID0gMFxuXG4gIC8qKiDQpdC10LvQv9C10YAg0LHRg9C00LXRgiDQuNC80LXRgtGMINC/0L7Qu9C90YvQuSDQtNC+0YHRgtGD0L8g0Log0Y3QutC30LXQvNC/0LvRj9GA0YMgU1Bsb3QuICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIHJlYWRvbmx5IHNwbG90OiBTUGxvdFxuICApIHt9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0J/QvtC00LPQvtGC0LDQstC70LjQstCw0LXRgiDRhdC10LvQv9C10YAg0Log0LjRgdC/0L7Qu9GM0LfQvtCy0LDQvdC40Y4uXG4gICAqL1xuICBwdWJsaWMgc2V0dXAoKTogdm9pZCB7XG5cbiAgICAvKiog0J7QsdC90YPQu9C10L3QuNC1INGB0YfQtdGC0YfQuNC60LAg0LjRgtC10YDQsNGC0L7RgNCwLiAqL1xuICAgIHRoaXMuaW5kZXggPSAwXG5cbiAgICAvKiog0J/QvtC00LPQvtGC0L7QstC60LAg0LTQtdC80L4t0YDQtdC20LjQvNCwICjQtdGB0LvQuCDRgtGA0LXQsdGD0LXRgtGB0Y8pLiAqL1xuICAgIGlmICh0aGlzLnNwbG90LmRlbW8uaXNFbmFibGUpIHtcbiAgICAgIHRoaXMuc3Bsb3QuaXRlcmF0b3IgPSB0aGlzLnNwbG90LmRlbW8uaXRlcmF0b3IuYmluZCh0aGlzKVxuICAgICAgdGhpcy5zcGxvdC5jb2xvcnMgPSB0aGlzLnNwbG90LmRlbW8uY29sb3JzXG4gICAgfVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JjQvNC40YLQuNGA0YPQtdGCINC40YLQtdGA0LDRgtC+0YAg0LjRgdGF0L7QtNC90YvRhSDQvtCx0YrQtdC60YLQvtCyLlxuICAgKi9cbiAgcHVibGljIGl0ZXJhdG9yKCk6IFNQbG90T2JqZWN0IHwgbnVsbCB7XG4gICAgaWYgKHRoaXMuaW5kZXggPCB0aGlzLmFtb3VudCkge1xuICAgICAgdGhpcy5pbmRleCsrXG4gICAgICByZXR1cm4ge1xuICAgICAgICB4OiByYW5kb21JbnQodGhpcy5zcGxvdC5ncmlkLndpZHRoISksXG4gICAgICAgIHk6IHJhbmRvbUludCh0aGlzLnNwbG90LmdyaWQuaGVpZ2h0ISksXG4gICAgICAgIHNoYXBlOiByYW5kb21JbnQodGhpcy5zcGxvdC5zaGFwZXNDb3VudCEpLFxuICAgICAgICBzaXplOiB0aGlzLnNpemVNaW4gKyByYW5kb21JbnQodGhpcy5zaXplTWF4IC0gdGhpcy5zaXplTWluICsgMSksXG4gICAgICAgIGNvbG9yOiByYW5kb21JbnQodGhpcy5jb2xvcnMubGVuZ3RoKVxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgU1Bsb3QgZnJvbSAnQC9zcGxvdCdcbmltcG9ydCAqIGFzIHNoYWRlcnMgZnJvbSAnQC9zaGFkZXJzJ1xuaW1wb3J0IHsgY29sb3JGcm9tSGV4VG9HbFJnYiB9IGZyb20gJ0AvdXRpbHMnXG5cbi8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKlxuICog0JrQu9Cw0YHRgS3RhdC10LvQv9C10YAsINGD0L/RgNCw0LLQu9GP0Y7RidC40LkgR0xTTC3QutC+0LTQvtC8INGI0LXQudC00LXRgNC+0LIuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNQbG90R2xzbCBpbXBsZW1lbnRzIFNQbG90SGVscGVyIHtcblxuICAvKiog0JrQvtC00Ysg0YjQtdC50LTQtdGA0L7Qsi4gKi9cbiAgcHVibGljIHZlcnRTaGFkZXJTb3VyY2U6IHN0cmluZyA9ICcnXG4gIHB1YmxpYyBmcmFnU2hhZGVyU291cmNlOiBzdHJpbmcgPSAnJ1xuXG4gIC8qKiDQpdC10LvQv9C10YAg0LHRg9C00LXRgiDQuNC80LXRgtGMINC/0L7Qu9C90YvQuSDQtNC+0YHRgtGD0L8g0Log0Y3QutC30LXQvNC/0LvRj9GA0YMgU1Bsb3QuICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIHJlYWRvbmx5IHNwbG90OiBTUGxvdFxuICApIHt9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0J/QvtC00LPQvtGC0LDQstC70LjQstCw0LXRgiDRhdC10LvQv9C10YAg0Log0LjRgdC/0L7Qu9GM0LfQvtCy0LDQvdC40Y4uXG4gICAqL1xuICBwdWJsaWMgc2V0dXAoKTogdm9pZCB7XG5cbiAgICAvKiog0KHQsdC+0YDQutCwINC60L7QtNC+0LIg0YjQtdC50LTQtdGA0L7Qsi4gKi9cbiAgICB0aGlzLnZlcnRTaGFkZXJTb3VyY2UgPSB0aGlzLm1ha2VWZXJ0U2hhZGVyU291cmNlKClcbiAgICB0aGlzLmZyYWdTaGFkZXJTb3VyY2UgPSB0aGlzLm1ha2VGcmFnU2hhZGVyU291cmNlKClcblxuICAgIC8qKiDQktGL0YfQuNGB0LvQtdC90LjQtSDQutC+0LvQuNGH0LXRgdGC0LLQsCDRgNCw0LfQu9C40YfQvdGL0YUg0YTQvtGA0Lwg0L7QsdGK0LXQutGC0L7Qsi4gKi9cbiAgICB0aGlzLnNwbG90LnNoYXBlc0NvdW50ID0gc2hhZGVycy5TSEFQRVMubGVuZ3RoXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQodC+0LfQtNCw0LXRgiDQutC+0LQg0LLQtdGA0YjQuNC90L3QvtCz0L4g0YjQtdC50LTQtdGA0LAuXG4gICAqXG4gICAqIEByZW1hcmtzXG4gICAqINCSINGI0LDQsdC70L7QvSDQstC10YDRiNC40L3QvdC+0LPQviDRiNC10LnQtNC10YDQsCDQstGB0YLQsNCy0LvRj9C10YLRgdGPINC60L7QtCDQstGL0LHQvtGA0LAg0YbQstC10YLQsCDQvtCx0YrQtdC60YLQsCDQv9C+INC40L3QtNC10LrRgdGDINGG0LLQtdGC0LAuINCiLtC6LtGI0LXQudC00LXRgCDQvdC1INC/0L7Qt9Cy0L7Qu9GP0LXRglxuICAgKiDQuNGB0L/QvtC70YzQt9C+0LLQsNGC0Ywg0LIg0LrQsNGH0LXRgdGC0LLQtSDQuNC90LTQtdC60YHQvtCyINC/0LXRgNC10LzQtdC90L3Ri9C1IC0g0LTQu9GPINC30LDQtNCw0L3QuNGPINGG0LLQtdGC0LAg0LjRgdC/0L7Qu9GM0LfRg9C10YLRgdGPINC/0L7RgdC70LXQtNC+0LLQsNGC0LXQu9GM0L3Ri9C5INC/0LXRgNC10LHQvtGAINGG0LLQtdGC0L7QstGL0YVcbiAgICog0LjQvdC00LXQutGB0L7Qsi5cbiAgICovXG4gIHByaXZhdGUgbWFrZVZlcnRTaGFkZXJTb3VyY2UoKSB7XG5cbiAgICAvKiog0JLRgNC10LzQtdC90L3QvtC1INC00L7QsdCw0LLQu9C10L3QuNC1INCyINC/0LDQu9C40YLRgNGDINCy0LXRgNGI0LjQvSDRhtCy0LXRgtCwINC90LDQv9GA0LDQstC70Y/RjtGJ0LjRhS4gKi9cbiAgICB0aGlzLnNwbG90LmNvbG9ycy5wdXNoKHRoaXMuc3Bsb3QuZ3JpZC5ydWxlc0NvbG9yISlcblxuICAgIGxldCBjb2RlOiBzdHJpbmcgPSAnJ1xuXG4gICAgLyoqINCk0L7RgNC80LjRgNC+0LLQvdC40LUg0LrQvtC00LAg0YPRgdGC0LDQvdC+0LLQutC4INGG0LLQtdGC0LAg0L7QsdGK0LXQutGC0LAg0L/QviDQuNC90LTQtdC60YHRgy4gKi9cbiAgICB0aGlzLnNwbG90LmNvbG9ycy5mb3JFYWNoKCh2YWx1ZSwgaW5kZXgpID0+IHtcbiAgICAgIGxldCBbciwgZywgYl0gPSBjb2xvckZyb21IZXhUb0dsUmdiKHZhbHVlKVxuICAgICAgY29kZSArPSBgZWxzZSBpZiAoYV9jb2xvciA9PSAke2luZGV4fS4wKSB2X2NvbG9yID0gdmVjMygke3J9LCAke2d9LCAke2J9KTtcXG5gXG4gICAgfSlcblxuICAgIC8qKiDQo9C00LDQu9C10L3QuNC1INC40Lcg0L/QsNC70LjRgtGA0Ysg0LLQtdGA0YjQuNC9INCy0YDQtdC80LXQvdC90L4g0LTQvtCx0LDQstC70LXQvdC90L7Qs9C+INGG0LLQtdGC0LAg0L3QsNC/0YDQsNCy0LvRj9GO0YnQuNGFLiAqL1xuICAgIHRoaXMuc3Bsb3QuY29sb3JzLnBvcCgpXG5cbiAgICAvKiog0KPQtNCw0LvQtdC90LjQtSDQu9C40YjQvdC10LPQviBcImVsc2VcIiDQsiDQvdCw0YfQsNC70LUg0LrQvtC00LAg0Lgg0LvQuNGI0L3QtdCz0L4g0L/QtdGA0LXQstC+0LTQsCDRgdGC0YDQvtC60Lgg0LIg0LrQvtC90YbQtS4gKi9cbiAgICBjb2RlID0gY29kZS5zbGljZSg1KS5zbGljZSgwLCAtMSlcblxuICAgIHJldHVybiBzaGFkZXJzLlZFUlRFWF9URU1QTEFURS5yZXBsYWNlKCd7Q09MT1ItU0VMRUNUSU9OfScsIGNvZGUpLnRyaW0oKVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0KHQvtC30LTQsNC10YIg0LrQvtC0INGE0YDQsNCz0LzQtdC90YLQvdC+0LPQviDRiNC10LnQtNC10YDQsC5cbiAgICovXG4gIHByaXZhdGUgbWFrZUZyYWdTaGFkZXJTb3VyY2UoKSB7XG5cbiAgICBsZXQgY29kZTE6IHN0cmluZyA9ICcnXG4gICAgbGV0IGNvZGUyOiBzdHJpbmcgPSAnJ1xuXG4gICAgc2hhZGVycy5TSEFQRVMuZm9yRWFjaCgodmFsdWUsIGluZGV4KSA9PiB7XG5cbiAgICAgIC8qKiDQpNC+0YDQvNC40YDQvtCy0LDQvdC40LUg0LrQvtC00LAg0YTRg9C90LrRhtC40LksINC+0L/QuNGB0YvQstCw0Y7RidC40YUg0YTQvtGA0LzRiyDQvtCx0YrQtdC60YLQvtCyLiAqL1xuICAgICAgY29kZTEgKz0gYHZvaWQgcyR7aW5kZXh9KCkgeyAke3ZhbHVlLnRyaW0oKX0gfVxcbmBcblxuICAgICAgLyoqINCk0L7RgNC80LjRgNC+0LLQsNC90LjQtSDQutC+0LTQsCDRg9GB0YLQsNC90L7QstC60Lgg0YTQvtGA0LzRiyDQvtCx0YrQtdC60YLQsCDQv9C+INC40L3QtNC10LrRgdGDLiAqL1xuICAgICAgY29kZTIgKz0gYGVsc2UgaWYgKHZfc2hhcGUgPT0gJHtpbmRleH0uMCkgeyBzJHtpbmRleH0oKTt9XFxuYFxuICAgIH0pXG5cbiAgICAvKiog0KPQtNCw0LvQtdC90LjQtSDQu9C40YjQvdC10LPQviDQv9C10YDQtdCy0L7QtNCwINGB0YLRgNC+0LrQuCDQsiDQutC+0L3RhtC1LiAqL1xuICAgIGNvZGUxID0gY29kZTEuc2xpY2UoMCwgLTEpXG5cbiAgICAvKiog0KPQtNCw0LvQtdC90LjQtSDQu9C40YjQvdC10LPQviBcImVsc2VcIiDQsiDQvdCw0YfQsNC70LUg0LrQvtC00LAg0Lgg0LvQuNGI0L3QtdCz0L4g0L/QtdGA0LXQstC+0LTQsCDRgdGC0YDQvtC60Lgg0LIg0LrQvtC90YbQtS4gKi9cbiAgICBjb2RlMiA9IGNvZGUyLnNsaWNlKDUpLnNsaWNlKDAsIC0xKVxuXG4gICAgcmV0dXJuIHNoYWRlcnMuRlJBR01FTlRfVEVNUExBVEUuXG4gICAgICByZXBsYWNlKCd7U0hBUEVTLUZVTkNUSU9OU30nLCBjb2RlMSkuXG4gICAgICByZXBsYWNlKCd7U0hBUEUtU0VMRUNUSU9OfScsIGNvZGUyKS5cbiAgICAgIHRyaW0oKVxuICB9XG59XG4iLCJpbXBvcnQgU1Bsb3QgZnJvbSAnQC9zcGxvdCdcbmltcG9ydCB7IGNvbG9yRnJvbUhleFRvR2xSZ2IgfSBmcm9tICdAL3V0aWxzJ1xuXG4vKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICpcbiAqINCa0LvQsNGB0YEt0YXQtdC70L/QtdGALCDRgNC10LDQu9C40LfRg9GO0YnQuNC5INGD0L/RgNCw0LLQu9C10L3QuNC1INC60L7QvdGC0LXQutGB0YLQvtC8INGA0LXQvdC00LXRgNC40L3Qs9CwIFdlYkdMINC60LvQsNGB0YHQsCBTcGxvdC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU1Bsb3RXZWJHbCBpbXBsZW1lbnRzIFNQbG90SGVscGVyIHtcblxuICAvKiog0J/QsNGA0LDQvNC10YLRgNGLINC40L3QuNGG0LjQsNC70LjQt9Cw0YbQuNC4INC60L7QvdGC0LXQutGB0YLQsCDRgNC10L3QtNC10YDQuNC90LPQsCBXZWJHTC4gKi9cbiAgcHVibGljIGFscGhhOiBib29sZWFuID0gZmFsc2VcbiAgcHVibGljIGRlcHRoOiBib29sZWFuID0gZmFsc2VcbiAgcHVibGljIHN0ZW5jaWw6IGJvb2xlYW4gPSBmYWxzZVxuICBwdWJsaWMgYW50aWFsaWFzOiBib29sZWFuID0gZmFsc2VcbiAgcHVibGljIGRlc3luY2hyb25pemVkOiBib29sZWFuID0gZmFsc2VcbiAgcHVibGljIHByZW11bHRpcGxpZWRBbHBoYTogYm9vbGVhbiA9IGZhbHNlXG4gIHB1YmxpYyBwcmVzZXJ2ZURyYXdpbmdCdWZmZXI6IGJvb2xlYW4gPSBmYWxzZVxuICBwdWJsaWMgZmFpbElmTWFqb3JQZXJmb3JtYW5jZUNhdmVhdDogYm9vbGVhbiA9IGZhbHNlXG4gIHB1YmxpYyBwb3dlclByZWZlcmVuY2U6IFdlYkdMUG93ZXJQcmVmZXJlbmNlID0gJ2hpZ2gtcGVyZm9ybWFuY2UnXG5cbiAgLyoqINCd0LDQt9Cy0LDQvdC40Y8g0Y3Qu9C10LzQtdC90YLQvtCyINCz0YDQsNGE0LjRh9C10YHQutC+0Lkg0YHQuNGB0YLQtdC80Ysg0LrQu9C40LXQvdGC0LAuICovXG4gIHB1YmxpYyBncHUgPSB7IGhhcmR3YXJlOiAnLScsIHNvZnR3YXJlOiAnLScgfVxuXG4gIC8qKiDQmtC+0L3RgtC10LrRgdGCINGA0LXQvdC00LXRgNC40L3Qs9CwINC4INC/0YDQvtCz0YDQsNC80LzQsCBXZWJHTC4gKi9cbiAgcHJpdmF0ZSBnbCE6IFdlYkdMUmVuZGVyaW5nQ29udGV4dFxuICBwcml2YXRlIGdwdVByb2dyYW0hOiBXZWJHTFByb2dyYW1cblxuICAvKiog0J/QtdGA0LXQvNC10L3QvdGL0LUg0LTQu9GPINGB0LLRj9C30Lgg0L/RgNC40LvQvtC20LXQvdC40Y8g0YEg0L/RgNC+0LPRgNCw0LzQvNC+0LkgV2ViR0wuICovXG4gIHByaXZhdGUgdmFyaWFibGVzOiBNYXAgPCBzdHJpbmcsIGFueSA+ID0gbmV3IE1hcCgpXG5cbiAgLyoqINCR0YPRhNC10YDRiyDQstC40LTQtdC+0L/QsNC80Y/RgtC4IFdlYkdMLiAqL1xuICBwdWJsaWMgZGF0YTogTWFwIDwgc3RyaW5nLCB7YnVmZmVyczogV2ViR0xCdWZmZXJbXSwgdHlwZTogbnVtYmVyfSA+ID0gbmV3IE1hcCgpXG5cbiAgLyoqINCf0YDQsNCy0LjQu9CwINGB0L7QvtGC0LLQtdGC0YHRgtCy0LjRjyDRgtC40L/QvtCyINGC0LjQv9C40LfQuNGA0L7QstCw0L3QvdGL0YUg0LzQsNGB0YHQuNCy0L7QsiDQuCDRgtC40L/QvtCyINC/0LXRgNC10LzQtdC90L3Ri9GFIFdlYkdMLiAqL1xuICBwcml2YXRlIGdsTnVtYmVyVHlwZXM6IE1hcDxzdHJpbmcsIG51bWJlcj4gPSBuZXcgTWFwKFtcbiAgICBbJ0ludDhBcnJheScsIDB4MTQwMF0sICAgICAgIC8vIGdsLkJZVEVcbiAgICBbJ1VpbnQ4QXJyYXknLCAweDE0MDFdLCAgICAgIC8vIGdsLlVOU0lHTkVEX0JZVEVcbiAgICBbJ0ludDE2QXJyYXknLCAweDE0MDJdLCAgICAgIC8vIGdsLlNIT1JUXG4gICAgWydVaW50MTZBcnJheScsIDB4MTQwM10sICAgICAvLyBnbC5VTlNJR05FRF9TSE9SVFxuICAgIFsnRmxvYXQzMkFycmF5JywgMHgxNDA2XSAgICAgLy8gZ2wuRkxPQVRcbiAgXSlcblxuICAvKiog0KXQtdC70L/QtdGAINCx0YPQtNC10YIg0LjQvNC10YLRjCDQv9C+0LvQvdGL0Lkg0LTQvtGB0YLRg9C/INC6INGN0LrQt9C10LzQv9C70Y/RgNGDIFNQbG90LiAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICByZWFkb25seSBzcGxvdDogU1Bsb3RcbiAgKSB7IH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQn9C+0LTQs9C+0YLQsNCy0LvQuNCy0LDQtdGCINGF0LXQu9C/0LXRgCDQuiDQuNGB0L/QvtC70YzQt9C+0LLQsNC90LjRji5cbiAgICovXG4gIHB1YmxpYyBzZXR1cCgpOiB2b2lkIHtcblxuICAgIHRoaXMuZ2wgPSB0aGlzLnNwbG90LmNhbnZhcy5nZXRDb250ZXh0KCd3ZWJnbCcsIHtcbiAgICAgIGFscGhhOiB0aGlzLmFscGhhLFxuICAgICAgZGVwdGg6IHRoaXMuZGVwdGgsXG4gICAgICBzdGVuY2lsOiB0aGlzLnN0ZW5jaWwsXG4gICAgICBhbnRpYWxpYXM6IHRoaXMuYW50aWFsaWFzLFxuICAgICAgZGVzeW5jaHJvbml6ZWQ6IHRoaXMuZGVzeW5jaHJvbml6ZWQsXG4gICAgICBwcmVtdWx0aXBsaWVkQWxwaGE6IHRoaXMucHJlbXVsdGlwbGllZEFscGhhLFxuICAgICAgcHJlc2VydmVEcmF3aW5nQnVmZmVyOiB0aGlzLnByZXNlcnZlRHJhd2luZ0J1ZmZlcixcbiAgICAgIGZhaWxJZk1ham9yUGVyZm9ybWFuY2VDYXZlYXQ6IHRoaXMuZmFpbElmTWFqb3JQZXJmb3JtYW5jZUNhdmVhdCxcbiAgICAgIHBvd2VyUHJlZmVyZW5jZTogdGhpcy5wb3dlclByZWZlcmVuY2VcbiAgICB9KSFcblxuICAgIGlmICh0aGlzLmdsID09PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ9Ce0YjQuNCx0LrQsCDRgdC+0LfQtNCw0L3QuNGPINC60L7QvdGC0LXQutGB0YLQsCDRgNC10L3QtNC10YDQuNC90LPQsCBXZWJHTCEnKVxuICAgIH1cblxuICAgIC8qKiDQn9C+0LvRg9GH0LXQvdC40LUg0LjQvdGE0L7RgNC80LDRhtC40Lgg0L4g0LPRgNCw0YTQuNGH0LXRgdC60L7QuSDRgdC40YHRgtC10LzQtSDQutC70LjQtdC90YLQsC4gKi9cbiAgICBsZXQgZXh0ID0gdGhpcy5nbC5nZXRFeHRlbnNpb24oJ1dFQkdMX2RlYnVnX3JlbmRlcmVyX2luZm8nKVxuICAgIHRoaXMuZ3B1LmhhcmR3YXJlID0gKGV4dCkgPyB0aGlzLmdsLmdldFBhcmFtZXRlcihleHQuVU5NQVNLRURfUkVOREVSRVJfV0VCR0wpIDogJ1vQvdC10LjQt9Cy0LXRgdGC0L3Qvl0nXG4gICAgdGhpcy5ncHUuc29mdHdhcmUgPSB0aGlzLmdsLmdldFBhcmFtZXRlcih0aGlzLmdsLlZFUlNJT04pXG5cbiAgICB0aGlzLnNwbG90LmRlYnVnLmxvZygnZ3B1JylcblxuICAgIC8qKiDQmtC+0L7RgNC10LrRgtC40YDQvtCy0LrQsCDRgNCw0LfQvNC10YDQsCDQvtCx0LvQsNGB0YLQuCDQv9GA0L7RgdC80L7RgtGA0LAuICovXG4gICAgdGhpcy5zcGxvdC5jYW52YXMud2lkdGggPSB0aGlzLnNwbG90LmNhbnZhcy5jbGllbnRXaWR0aFxuICAgIHRoaXMuc3Bsb3QuY2FudmFzLmhlaWdodCA9IHRoaXMuc3Bsb3QuY2FudmFzLmNsaWVudEhlaWdodFxuICAgIHRoaXMuZ2wudmlld3BvcnQoMCwgMCwgdGhpcy5zcGxvdC5jYW52YXMud2lkdGgsIHRoaXMuc3Bsb3QuY2FudmFzLmhlaWdodClcblxuICAgIC8qKiDQldGB0LvQuCDQt9Cw0LTQsNC9INGA0LDQt9C80LXRgCDQv9C70L7RgdC60L7RgdGC0LgsINC90L4g0L3QtSDQt9Cw0LTQsNC90L4g0L/QvtC70L7QttC10L3QuNC1INC+0LHQu9Cw0YHRgtC4INC/0YDQvtGB0LzQvtGC0YDQsCwg0YLQviDQvtC90LAg0L/QvtC80LXRidCw0LXRgtGB0Y8g0LIg0YbQtdC90YLRgCDQv9C70L7RgdC60L7RgdGC0LguICovXG4gICAgaWYgKCgnZ3JpZCcgaW4gdGhpcy5zcGxvdC5sYXN0UmVxdWVzdGVkT3B0aW9ucyEpICYmICEoJ2NhbWVyYScgaW4gdGhpcy5zcGxvdC5sYXN0UmVxdWVzdGVkT3B0aW9ucykpIHtcbiAgICAgIHRoaXMuc3Bsb3QuY2FtZXJhLnggPSB0aGlzLnNwbG90LmdyaWQud2lkdGghIC8gMlxuICAgICAgdGhpcy5zcGxvdC5jYW1lcmEueSA9IHRoaXMuc3Bsb3QuZ3JpZC5oZWlnaHQhIC8gMlxuICAgIH1cblxuICAgIC8qKiDQo9GB0YLQsNC90L7QstC60LAg0YTQvtC90L7QstC+0LPQviDRhtCy0LXRgtCwINC60LDQvdCy0LDRgdCwICjRhtCy0LXRgiDQvtGH0LjRgdGC0LrQuCDQutC+0L3RgtC10LrRgdGC0LAg0YDQtdC90LTQtdGA0LjQvdCz0LApLiAqL1xuICAgIHRoaXMuc2V0QmdDb2xvcih0aGlzLnNwbG90LmdyaWQuYmdDb2xvciEpXG5cbiAgICAvKiog0KHQvtC30LTQsNC90LjQtSDQv9GA0L7Qs9GA0LDQvNC80YsgV2ViR0wuICovXG4gICAgdGhpcy5jcmVhdGVQcm9ncmFtKHRoaXMuc3Bsb3QuZ2xzbC52ZXJ0U2hhZGVyU291cmNlLCB0aGlzLnNwbG90Lmdsc2wuZnJhZ1NoYWRlclNvdXJjZSlcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCj0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdGCINGG0LLQtdGCINGE0L7QvdCwINC60L7QvdGC0LXQutGB0YLQsCDRgNC10L3QtNC10YDQuNC90LPQsCBXZWJHTC5cbiAgICovXG4gIHB1YmxpYyBzZXRCZ0NvbG9yKGNvbG9yOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBsZXQgW3IsIGcsIGJdID0gY29sb3JGcm9tSGV4VG9HbFJnYihjb2xvcilcbiAgICB0aGlzLmdsLmNsZWFyQ29sb3IociwgZywgYiwgMC4wKVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JfQsNC60YDQsNGI0LjQstCw0LXRgiDQutC+0L3RgtC10LrRgdGCINGA0LXQvdC00LXRgNC40L3Qs9CwIFdlYkdMINGG0LLQtdGC0L7QvCDRhNC+0L3QsC5cbiAgICovXG4gIHB1YmxpYyBjbGVhckJhY2tncm91bmQoKTogdm9pZCB7XG4gICAgdGhpcy5nbC5jbGVhcih0aGlzLmdsLkNPTE9SX0JVRkZFUl9CSVQpO1xuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0KHQvtC30LTQsNC10YIg0YjQtdC50LTQtdGAIFdlYkdMLlxuICAgKlxuICAgKiBAcGFyYW0gdHlwZSAtINCi0LjQvyDRiNC10LnQtNC10YDQsC5cbiAgICogQHBhcmFtIGNvZGUgLSBHTFNMLdC60L7QtCDRiNC10LnQtNC10YDQsC5cbiAgICogQHJldHVybnMg0KHQvtC30LTQsNC90L3Ri9C5INGI0LXQudC00LXRgC5cbiAgICovXG4gIHB1YmxpYyBjcmVhdGVTaGFkZXIodHlwZTogJ1ZFUlRFWF9TSEFERVInIHwgJ0ZSQUdNRU5UX1NIQURFUicsIGNvZGU6IHN0cmluZyk6IFdlYkdMU2hhZGVyIHtcblxuICAgIGNvbnN0IHNoYWRlciA9IHRoaXMuZ2wuY3JlYXRlU2hhZGVyKHRoaXMuZ2xbdHlwZV0pIVxuICAgIHRoaXMuZ2wuc2hhZGVyU291cmNlKHNoYWRlciwgY29kZSlcbiAgICB0aGlzLmdsLmNvbXBpbGVTaGFkZXIoc2hhZGVyKVxuXG4gICAgaWYgKCF0aGlzLmdsLmdldFNoYWRlclBhcmFtZXRlcihzaGFkZXIsIHRoaXMuZ2wuQ09NUElMRV9TVEFUVVMpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ9Ce0YjQuNCx0LrQsCDQutC+0LzQv9C40LvRj9GG0LjQuCDRiNC10LnQtNC10YDQsCBbJyArIHR5cGUgKyAnXS4gJyArIHRoaXMuZ2wuZ2V0U2hhZGVySW5mb0xvZyhzaGFkZXIpKVxuICAgIH1cblxuICAgIHJldHVybiBzaGFkZXJcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCh0L7Qt9C00LDQtdGCINC/0YDQvtCz0YDQsNC80LzRgyBXZWJHTCDQuNC3INGI0LXQudC00LXRgNC+0LIuXG4gICAqXG4gICAqIEBwYXJhbSBzaGFkZXJWZXJ0IC0g0JLQtdGA0YjQuNC90L3Ri9C5INGI0LXQudC00LXRgC5cbiAgICogQHBhcmFtIHNoYWRlckZyYWcgLSDQpNGA0LDQs9C80LXQvdGC0L3Ri9C5INGI0LXQudC00LXRgC5cbiAgICovXG4gIHB1YmxpYyBjcmVhdGVQcm9ncmFtRnJvbVNoYWRlcnMoc2hhZGVyVmVydDogV2ViR0xTaGFkZXIsIHNoYWRlckZyYWc6IFdlYkdMU2hhZGVyKTogdm9pZCB7XG5cbiAgICB0aGlzLmdwdVByb2dyYW0gPSB0aGlzLmdsLmNyZWF0ZVByb2dyYW0oKSFcbiAgICB0aGlzLmdsLmF0dGFjaFNoYWRlcih0aGlzLmdwdVByb2dyYW0sIHNoYWRlclZlcnQpXG4gICAgdGhpcy5nbC5hdHRhY2hTaGFkZXIodGhpcy5ncHVQcm9ncmFtLCBzaGFkZXJGcmFnKVxuICAgIHRoaXMuZ2wubGlua1Byb2dyYW0odGhpcy5ncHVQcm9ncmFtKVxuICAgIHRoaXMuZ2wudXNlUHJvZ3JhbSh0aGlzLmdwdVByb2dyYW0pXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQodC+0LfQtNCw0LXRgiDQv9GA0L7Qs9GA0LDQvNC80YMgV2ViR0wg0LjQtyBHTFNMLdC60L7QtNC+0LIg0YjQtdC50LTQtdGA0L7Qsi5cbiAgICpcbiAgICogQHBhcmFtIHNoYWRlckNvZGVWZXJ0IC0g0JrQvtC0INCy0LXRgNGI0LjQvdC90L7Qs9C+INGI0LXQudC00LXRgNCwLlxuICAgKiBAcGFyYW0gc2hhZGVyQ29kZUZyYWcgLSDQmtC+0LQg0YTRgNCw0LPQvNC10L3RgtC90L7Qs9C+INGI0LXQudC00LXRgNCwLlxuICAgKi9cbiAgcHVibGljIGNyZWF0ZVByb2dyYW0oc2hhZGVyQ29kZVZlcnQ6IHN0cmluZywgc2hhZGVyQ29kZUZyYWc6IHN0cmluZyk6IHZvaWQge1xuXG4gICAgdGhpcy5zcGxvdC5kZWJ1Zy5sb2coJ3NoYWRlcnMnKVxuXG4gICAgdGhpcy5jcmVhdGVQcm9ncmFtRnJvbVNoYWRlcnMoXG4gICAgICB0aGlzLmNyZWF0ZVNoYWRlcignVkVSVEVYX1NIQURFUicsIHNoYWRlckNvZGVWZXJ0KSxcbiAgICAgIHRoaXMuY3JlYXRlU2hhZGVyKCdGUkFHTUVOVF9TSEFERVInLCBzaGFkZXJDb2RlRnJhZylcbiAgICApXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQodC+0LfQtNCw0LXRgiDRgdCy0Y/Qt9GMINC/0LXRgNC10LzQtdC90L3QvtC5INC/0YDQuNC70L7QttC10L3QuNGPINGBINC/0YDQvtCz0YDQsNC80LzQvtC5IFdlYkdsLlxuICAgKlxuICAgKiBAcmVtYXJrc1xuICAgKiDQn9C10YDQtdC80LXQvdC90YvQtSDRgdC+0YXRgNCw0L3Rj9GO0YLRgdGPINCyINCw0YHRgdC+0YbQuNCw0YLQuNCy0L3QvtC8INC80LDRgdGB0LjQstC1LCDQs9C00LUg0LrQu9GO0YfQuCAtINGN0YLQviDQvdCw0LfQstCw0L3QuNGPINC/0LXRgNC10LzQtdC90L3Ri9GFLiDQndCw0LfQstCw0L3QuNC1INC/0LXRgNC10LzQtdC90L3QvtC5INC00L7Qu9C20L3QvlxuICAgKiDQvdCw0YfQuNC90LDRgtGM0YHRjyDRgSDQv9GA0LXRhNC40LrRgdCwLCDQvtCx0L7Qt9C90LDRh9Cw0Y7RidC10LPQviDQtdC1IEdMU0wt0YLQuNC/LiDQn9GA0LXRhNC40LrRgSBcInVfXCIg0L7Qv9C40YHRi9Cy0LDQtdGCINC/0LXRgNC10LzQtdC90L3Rg9GOINGC0LjQv9CwIHVuaWZvcm0uINCf0YDQtdGE0LjQutGBIFwiYV9cIlxuICAgKiDQvtC/0LjRgdGL0LLQsNC10YIg0L/QtdGA0LXQvNC10L3QvdGD0Y4g0YLQuNC/0LAgYXR0cmlidXRlLlxuICAgKlxuICAgKiBAcGFyYW0gdmFyTmFtZSAtINCY0LzRjyDQv9C10YDQtdC80LXQvdC90L7QuSAo0YHRgtGA0L7QutCwKS5cbiAgICovXG4gIHB1YmxpYyBjcmVhdGVWYXJpYWJsZSh2YXJOYW1lOiBzdHJpbmcpOiB2b2lkIHtcblxuICAgIGNvbnN0IHZhclR5cGUgPSB2YXJOYW1lLnNsaWNlKDAsIDIpXG5cbiAgICBpZiAodmFyVHlwZSA9PT0gJ3VfJykge1xuICAgICAgdGhpcy52YXJpYWJsZXMuc2V0KHZhck5hbWUsIHRoaXMuZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHRoaXMuZ3B1UHJvZ3JhbSwgdmFyTmFtZSkpXG4gICAgfSBlbHNlIGlmICh2YXJUeXBlID09PSAnYV8nKSB7XG4gICAgICB0aGlzLnZhcmlhYmxlcy5zZXQodmFyTmFtZSwgdGhpcy5nbC5nZXRBdHRyaWJMb2NhdGlvbih0aGlzLmdwdVByb2dyYW0sIHZhck5hbWUpKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ9Cj0LrQsNC30LDQvSDQvdC10LLQtdGA0L3Ri9C5INGC0LjQvyAo0L/RgNC10YTQuNC60YEpINC/0LXRgNC10LzQtdC90L3QvtC5INGI0LXQudC00LXRgNCwOiAnICsgdmFyTmFtZSlcbiAgICB9XG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQodC+0LfQtNCw0LXRgiDRgdCy0Y/Qt9GMINC90LDQsdC+0YDQsCDQv9C10YDQtdC80LXQvdC90YvRhSDQv9GA0LjQu9C+0LbQtdC90LjRjyDRgSDQv9GA0L7Qs9GA0LDQvNC80L7QuSBXZWJHbC5cbiAgICpcbiAgICogQHJlbWFya3NcbiAgICog0JTQtdC70LDQtdGCINGC0L7QttC1INGB0LDQvNC+0LUsINGH0YLQviDQuCDQvNC10YLQvtC0IHtAbGluayBjcmVhdGVWYXJpYWJsZX0sINC90L4g0L/QvtC30LLQvtC70Y/QtdGCINC30LAg0L7QtNC40L0g0LLRi9C30L7QsiDRgdC+0LfQtNCw0YLRjCDRgdGA0LDQt9GDINC90LXRgdC60L7Qu9GM0LrQvlxuICAgKiDQv9C10YDQtdC80LXQvdC90YvRhS5cbiAgICpcbiAgICogQHBhcmFtIHZhck5hbWVzIC0g0J/QtdGA0LXRh9C40YHQu9C10L3QuNGPINC40LzQtdC9INC/0LXRgNC10LzQtdC90L3Ri9GFICjRgdGC0YDQvtC60LDQvNC4KS5cbiAgICovXG4gIHB1YmxpYyBjcmVhdGVWYXJpYWJsZXMoLi4udmFyTmFtZXM6IHN0cmluZ1tdKTogdm9pZCB7XG4gICAgdmFyTmFtZXMuZm9yRWFjaCh2YXJOYW1lID0+IHRoaXMuY3JlYXRlVmFyaWFibGUodmFyTmFtZSkpO1xuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0KHQvtC30LTQsNC10YIg0LIg0LPRgNGD0L/Qv9C1INCx0YPRhNC10YDQvtCyIFdlYkdMINC90L7QstGL0Lkg0LHRg9GE0LXRgCDQuCDQt9Cw0L/QuNGB0YvQstCw0LXRgiDQsiDQvdC10LPQviDQv9C10YDQtdC00LDQvdC90YvQtSDQtNCw0L3QvdGL0LUuXG4gICAqXG4gICAqIEByZW1hcmtzXG4gICAqINCa0L7Qu9C40YfQtdGB0YLQstC+INCz0YDRg9C/0L8g0LHRg9GE0LXRgNC+0LIg0Lgg0LrQvtC70LjRh9C10YHRgtCy0L4g0LHRg9GE0LXRgNC+0LIg0LIg0LrQsNC20LTQvtC5INCz0YDRg9C/0L/QtSDQvdC1INC+0LPRgNCw0L3QuNGH0LXQvdGLLiDQmtCw0LbQtNCw0Y8g0LPRgNGD0L/Qv9CwINC40LzQtdC10YIg0YHQstC+0LUg0L3QsNC30LLQsNC90LjQtSDQuFxuICAgKiBHTFNMLdGC0LjQvy4g0KLQuNC/INCz0YDRg9C/0L/RiyDQvtC/0YDQtdC00LXQu9GP0LXRgtGB0Y8g0LDQstGC0L7QvNCw0YLQuNGH0LXRgdC60Lgg0L3QsCDQvtGB0L3QvtCy0LUg0YLQuNC/0LAg0YLQuNC/0LjQt9C40YDQvtCy0LDQvdC90L7Qs9C+INC80LDRgdGB0LjQstCwLiDQn9GA0LDQstC40LvQsCDRgdC+0L7RgtCy0LXRgtGB0YLQstC40Y8g0YLQuNC/0L7QslxuICAgKiDQvtC/0YDQtdC00LXQu9GP0Y7RgtGB0Y8g0L/QtdGA0LXQvNC10L3QvdC+0Lkge0BsaW5rIGdsTnVtYmVyVHlwZXN9LlxuICAgKlxuICAgKiBAcGFyYW0gZ3JvdXBOYW1lIC0g0J3QsNC30LLQsNC90LjQtSDQs9GA0YPQv9C/0Ysg0LHRg9GE0LXRgNC+0LIsINCyINC60L7RgtC+0YDRg9GOINCx0YPQtNC10YIg0LTQvtCx0LDQstC70LXQvSDQvdC+0LLRi9C5INCx0YPRhNC10YAuXG4gICAqIEBwYXJhbSBkYXRhIC0g0JTQsNC90L3Ri9C1INCyINCy0LjQtNC1INGC0LjQv9C40LfQuNGA0L7QstCw0L3QvdC+0LPQviDQvNCw0YHRgdC40LLQsCDQtNC70Y8g0LfQsNC/0LjRgdC4INCyINGB0L7Qt9C00LDQstCw0LXQvNGL0Lkg0LHRg9GE0LXRgC5cbiAgICogQHJldHVybnMg0J7QsdGK0LXQvCDQv9Cw0LzRj9GC0LgsINC30LDQvdGP0YLRi9C5INC90L7QstGL0Lwg0LHRg9GE0LXRgNC+0LwgKNCyINCx0LDQudGC0LDRhSkuXG4gICAqL1xuICBwdWJsaWMgY3JlYXRlQnVmZmVyKGdyb3VwTmFtZTogc3RyaW5nLCBkYXRhOiBUeXBlZEFycmF5KTogbnVtYmVyIHtcblxuICAgIGNvbnN0IGJ1ZmZlciA9IHRoaXMuZ2wuY3JlYXRlQnVmZmVyKCkhXG4gICAgdGhpcy5nbC5iaW5kQnVmZmVyKHRoaXMuZ2wuQVJSQVlfQlVGRkVSLCBidWZmZXIpXG4gICAgdGhpcy5nbC5idWZmZXJEYXRhKHRoaXMuZ2wuQVJSQVlfQlVGRkVSLCBkYXRhLCB0aGlzLmdsLlNUQVRJQ19EUkFXKVxuXG4gICAgLyoqINCV0YHQu9C4INCz0YDRg9C/0L/RiyDRgSDRg9C60LDQt9Cw0L3QvdGL0Lwg0L3QsNC30LLQsNC90LjQtdC8INC90LUg0YHRg9GJ0LXRgdGC0LLRg9C10YIsINGC0L4g0L7QvdCwINGB0L7Qt9C00LDQtdGC0YHRjy4gKi9cbiAgICBpZiAoIXRoaXMuZGF0YS5oYXMoZ3JvdXBOYW1lKSkge1xuICAgICAgdGhpcy5kYXRhLnNldChncm91cE5hbWUsIHsgYnVmZmVyczogW10sIHR5cGU6IHRoaXMuZ2xOdW1iZXJUeXBlcy5nZXQoZGF0YS5jb25zdHJ1Y3Rvci5uYW1lKSF9KVxuICAgIH1cblxuICAgIHRoaXMuZGF0YS5nZXQoZ3JvdXBOYW1lKSEuYnVmZmVycy5wdXNoKGJ1ZmZlcilcblxuICAgIHJldHVybiBkYXRhLmxlbmd0aCAqIGRhdGEuQllURVNfUEVSX0VMRU1FTlRcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCf0LXRgNC10LTQsNC10YIg0LfQvdCw0YfQtdC90LjQtSDQvNCw0YLRgNC40YbRiyAzINGFIDMg0LIg0L/RgNC+0LPRgNCw0LzQvNGDIFdlYkdsLlxuICAgKlxuICAgKiBAcGFyYW0gdmFyTmFtZSAtINCY0LzRjyDQv9C10YDQtdC80LXQvdC90L7QuSBXZWJHTCAo0LjQtyDQvNCw0YHRgdC40LLQsCB7QGxpbmsgdmFyaWFibGVzfSkg0LIg0LrQvtGC0L7RgNGD0Y4g0LHRg9C00LXRgiDQt9Cw0L/QuNGB0LDQvdC+INC/0LXRgNC10LTQsNC90L3QvtC1INC30L3QsNGH0LXQvdC40LUuXG4gICAqIEBwYXJhbSB2YXJWYWx1ZSAtINCj0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdC80L7QtSDQt9C90LDRh9C10L3QuNC1INC00L7Qu9C20L3QviDRj9Cy0LvRj9GC0YzRgdGPINC80LDRgtGA0LjRhtC10Lkg0LLQtdGJ0LXRgdGC0LLQtdC90L3Ri9GFINGH0LjRgdC10Lsg0YDQsNC30LzQtdGA0L7QvCAzINGFIDMsINGA0LDQt9Cy0LXRgNC90YPRgtC+0LlcbiAgICogICAgINCyINCy0LjQtNC1INC+0LTQvdC+0LzQtdGA0L3QvtCz0L4g0LzQsNGB0YHQuNCy0LAg0LjQtyA5INGN0LvQtdC80LXQvdGC0L7Qsi5cbiAgICovXG4gIHB1YmxpYyBzZXRWYXJpYWJsZSh2YXJOYW1lOiBzdHJpbmcsIHZhclZhbHVlOiBudW1iZXJbXSk6IHZvaWQge1xuICAgIHRoaXMuZ2wudW5pZm9ybU1hdHJpeDNmdih0aGlzLnZhcmlhYmxlcy5nZXQodmFyTmFtZSksIGZhbHNlLCB2YXJWYWx1ZSlcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCU0LXQu9Cw0LXRgiDQsdGD0YTQtdGAIFdlYkdsIFwi0LDQutGC0LjQstC90YvQvFwiLlxuICAgKlxuICAgKiBAcGFyYW0gZ3JvdXBOYW1lIC0g0J3QsNC30LLQsNC90LjQtSDQs9GA0YPQv9C/0Ysg0LHRg9GE0LXRgNC+0LIsINCyINC60L7RgtC+0YDQvtC8INGF0YDQsNC90LjRgtGB0Y8g0L3QtdC+0LHRhdC+0LTQuNC80YvQuSDQsdGD0YTQtdGALlxuICAgKiBAcGFyYW0gaW5kZXggLSDQmNC90LTQtdC60YEg0LHRg9GE0LXRgNCwINCyINCz0YDRg9C/0L/QtS5cbiAgICogQHBhcmFtIHZhck5hbWUgLSDQmNC80Y8g0L/QtdGA0LXQvNC10L3QvdC+0LkgKNC40Lcg0LzQsNGB0YHQuNCy0LAge0BsaW5rIHZhcmlhYmxlc30pLCDRgSDQutC+0YLQvtGA0L7QuSDQsdGD0LTQtdGCINGB0LLRj9C30LDQvSDQsdGD0YTQtdGALlxuICAgKiBAcGFyYW0gc2l6ZSAtINCa0L7Qu9C40YfQtdGB0YLQstC+INGN0LvQtdC80LXQvdGC0L7QsiDQsiDQsdGD0YTQtdGA0LUsINGB0L7QvtGC0LLQtdGC0YHRgtCy0YPRjtGJ0LjRhSDQvtC00L3QvtC5IMKgR0wt0LLQtdGA0YjQuNC90LUuXG4gICAqIEBwYXJhbSBzdHJpZGUgLSDQoNCw0LfQvNC10YAg0YjQsNCz0LAg0L7QsdGA0LDQsdC+0YLQutC4INGN0LvQtdC80LXQvdGC0L7QsiDQsdGD0YTQtdGA0LAgKNC30L3QsNGH0LXQvdC40LUgMCDQt9Cw0LTQsNC10YIg0YDQsNC30LzQtdGJ0LXQvdC40LUg0Y3Qu9C10LzQtdC90YLQvtCyINC00YDRg9CzINC30LAg0LTRgNGD0LPQvtC8KS5cbiAgICogQHBhcmFtIG9mZnNldCAtINCh0LzQtdGJ0LXQvdC40LUg0L7RgtC90L7RgdC40YLQtdC70YzQvdC+INC90LDRh9Cw0LvQsCDQsdGD0YTQtdGA0LAsINC90LDRh9C40L3QsNGPINGBINC60L7RgtC+0YDQvtCz0L4g0LHRg9C00LXRgiDQv9GA0L7QuNGB0YXQvtC00LjRgtGMINC+0LHRgNCw0LHQvtGC0LrQsCDRjdC70LXQvNC10L3RgtC+0LIuXG4gICAqL1xuICBwdWJsaWMgc2V0QnVmZmVyKGdyb3VwTmFtZTogc3RyaW5nLCBpbmRleDogbnVtYmVyLCB2YXJOYW1lOiBzdHJpbmcsIHNpemU6IG51bWJlciwgc3RyaWRlOiBudW1iZXIsIG9mZnNldDogbnVtYmVyKTogdm9pZCB7XG5cbiAgICBjb25zdCBncm91cCA9IHRoaXMuZGF0YS5nZXQoZ3JvdXBOYW1lKSFcbiAgICBjb25zdCB2YXJpYWJsZSA9IHRoaXMudmFyaWFibGVzLmdldCh2YXJOYW1lKVxuXG4gICAgdGhpcy5nbC5iaW5kQnVmZmVyKHRoaXMuZ2wuQVJSQVlfQlVGRkVSLCBncm91cC5idWZmZXJzW2luZGV4XSlcbiAgICB0aGlzLmdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KHZhcmlhYmxlKVxuICAgIHRoaXMuZ2wudmVydGV4QXR0cmliUG9pbnRlcih2YXJpYWJsZSwgc2l6ZSwgZ3JvdXAudHlwZSwgZmFsc2UsIHN0cmlkZSwgb2Zmc2V0KVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JLRi9C/0L7Qu9C90Y/QtdGCINC+0YLRgNC40YHQvtCy0LrRgyDQutC+0L3RgtC10LrRgdGC0LAg0YDQtdC90LTQtdGA0LjQvdCz0LAgV2ViR0wg0LzQtdGC0L7QtNC+0Lwg0L/RgNC40LzQuNGC0LjQstC90YvRhSDRgtC+0YfQtdC6LlxuICAgKlxuICAgKiBAcGFyYW0gZmlyc3QgLSDQmNC90LTQtdC60YEgR0wt0LLQtdGA0YjQuNC90YssINGBINC60L7RgtC+0YDQvtC5INC90LDRh9C90LXRgtGPINC+0YLRgNC40YHQvtCy0LrQsC5cbiAgICogQHBhcmFtIGNvdW50IC0g0JrQvtC70LjRh9C10YHRgtCy0L4g0L7RgNC40YHQvtCy0YvQstCw0LXQvNGL0YUgR0wt0LLQtdGA0YjQuNC9LlxuICAgKi9cbiAgcHVibGljIGRyYXdQb2ludHMoZmlyc3Q6IG51bWJlciwgY291bnQ6IG51bWJlcik6IHZvaWQge1xuICAgIHRoaXMuZ2wuZHJhd0FycmF5cyh0aGlzLmdsLlBPSU5UUywgZmlyc3QsIGNvdW50KVxuICB9XG59XG4iLCJpbXBvcnQgeyBjb3B5TWF0Y2hpbmdLZXlWYWx1ZXMgfSBmcm9tICdAL3V0aWxzJ1xuaW1wb3J0IFNQbG90Q29udG9sIGZyb20gJ0Avc3Bsb3QtY29udHJvbCdcbmltcG9ydCBTUGxvdFdlYkdsIGZyb20gJ0Avc3Bsb3Qtd2ViZ2wnXG5pbXBvcnQgU1Bsb3REZWJ1ZyBmcm9tICdAL3NwbG90LWRlYnVnJ1xuaW1wb3J0IFNQbG90RGVtbyBmcm9tICdAL3NwbG90LWRlbW8nXG5pbXBvcnQgU1Bsb3RHbHNsIGZyb20gJ0Avc3Bsb3QtZ2xzbCdcblxuLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqXG4gKiDQmtC70LDRgdGBIFNQbG90IC0g0YDQtdCw0LvQuNC30YPQtdGCINCz0YDQsNGE0LjQuiDRgtC40L/QsCDRgdC60LDRgtGC0LXRgNC/0LvQvtGCINGB0YDQtdC00YHRgtCy0LDQvNC4IFdlYkdMLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTUGxvdCB7XG5cbiAgLyoqINCk0YPQvdC60YbQuNGPINC40YLQtdGA0LjRgNC+0LLQsNC90LjRjyDQuNGB0YXQvtC00L3Ri9GFINC00LDQvdC90YvRhS4gKi9cbiAgcHVibGljIGl0ZXJhdG9yOiBTUGxvdEl0ZXJhdG9yID0gdW5kZWZpbmVkXG5cbiAgLyoqINCl0LXQu9C/0LXRgCDRgNC10LbQuNC80LAg0L7RgtC70LDQtNC60LguICovXG4gIHB1YmxpYyBkZWJ1ZzogU1Bsb3REZWJ1ZyA9IG5ldyBTUGxvdERlYnVnKHRoaXMpXG5cbiAgLyoqINCl0LXQu9C/0LXRgCwg0YPQv9GA0LDQstC70Y/RjtGJ0LjQuSBHTFNMLdC60L7QtNC+0Lwg0YjQtdC50LTQtdGA0L7Qsi4gKi9cbiAgcHVibGljIGdsc2w6IFNQbG90R2xzbCA9IG5ldyBTUGxvdEdsc2wodGhpcylcblxuICAvKiog0KXQtdC70L/QtdGAIFdlYkdMLiAqL1xuICBwdWJsaWMgd2ViZ2w6IFNQbG90V2ViR2wgPSBuZXcgU1Bsb3RXZWJHbCh0aGlzKVxuXG4gIC8qKiDQpdC10LvQv9C10YAg0YDQtdC20LjQvNCwINC00LXQvNC+LdC00LDQvdC90YvRhS4gKi9cbiAgcHVibGljIGRlbW86IFNQbG90RGVtbyA9IG5ldyBTUGxvdERlbW8odGhpcylcblxuICAvKiog0J/RgNC40LfQvdCw0Log0YTQvtGA0YHQuNGA0L7QstCw0L3QvdC+0LPQviDQt9Cw0L/Rg9GB0LrQsCDRgNC10L3QtNC10YDQsC4gKi9cbiAgcHVibGljIGZvcmNlUnVuOiBib29sZWFuID0gZmFsc2VcblxuICAvKiog0J7Qs9GA0LDQvdC40YfQtdC90LjQtSDQutC+0Lst0LLQsCDQvtCx0YrQtdC60YLQvtCyINC90LAg0LPRgNCw0YTQuNC60LUuICovXG4gIHB1YmxpYyBnbG9iYWxMaW1pdDogbnVtYmVyID0gMV8wMDBfMDAwXzAwMFxuXG4gIC8qKiDQntCz0YDQsNC90LjRh9C10L3QuNC1INC60L7Quy3QstCwINC+0LHRitC10LrRgtC+0LIg0LIg0LPRgNGD0L/Qv9C1LiAqL1xuICBwdWJsaWMgZ3JvdXBMaW1pdDogbnVtYmVyID0gMTBfMDAwXG5cbiAgLyoqINCm0LLQtdGC0L7QstCw0Y8g0L/QsNC70LjRgtGA0LAg0L7QsdGK0LXQutGC0L7Qsi4gKi9cbiAgcHVibGljIGNvbG9yczogc3RyaW5nW10gPSBbXVxuXG4gIC8qKiDQn9Cw0YDQsNC80LXRgtGA0Ysg0LrQvtC+0YDQtNC40L3QsNGC0L3QvtC5INC/0LvQvtGB0LrQvtGB0YLQuC4gKi9cbiAgcHVibGljIGdyaWQ6IFNQbG90R3JpZCA9IHtcbiAgICB3aWR0aDogMzJfMDAwLFxuICAgIGhlaWdodDogMTZfMDAwLFxuICAgIGJnQ29sb3I6ICcjZmZmZmZmJyxcbiAgICBydWxlc0NvbG9yOiAnI2MwYzBjMCdcbiAgfVxuXG4gIC8qKiDQn9Cw0YDQsNC80LXRgtGA0Ysg0L7QsdC70LDRgdGC0Lgg0L/RgNC+0YHQvNC+0YLRgNCwLiAqL1xuICBwdWJsaWMgY2FtZXJhOiBTUGxvdENhbWVyYSA9IHtcbiAgICB4OiB0aGlzLmdyaWQud2lkdGghIC8gMixcbiAgICB5OiB0aGlzLmdyaWQuaGVpZ2h0ISAvIDIsXG4gICAgem9vbTogMVxuICB9XG5cbiAgLyoqINCf0YDQuNC30L3QsNC6INC90LXQvtCx0YXQvtC00LjQvNC+0YHRgtC4INCx0LXQt9C+0YLQu9Cw0LPQsNGC0LXQu9GM0L3QvtCz0L4g0LfQsNC/0YPRgdC60LAg0YDQtdC90LTQtdGA0LAuICovXG4gIHB1YmxpYyBpc1J1bm5pbmc6IGJvb2xlYW4gPSBmYWxzZVxuXG4gIC8qKiDQmtC+0LvQuNGH0LXRgdGC0LLQviDRgNCw0LfQu9C40YfQvdGL0YUg0YTQvtGA0Lwg0L7QsdGK0LXQutGC0L7Qsi4g0JLRi9GH0LjRgdC70Y/QtdGC0YHRjyDQv9C+0LfQttC1INCyINGF0LXQu9C/0LXRgNC1IGdsc2wuICovXG4gIHB1YmxpYyBzaGFwZXNDb3VudDogbnVtYmVyIHwgdW5kZWZpbmVkXG5cbiAgLyoqINCh0YLQsNGC0LjRgdGC0LjRh9C10YHQutCw0Y8g0LjQvdGE0L7RgNC80LDRhtC40Y8uICovXG4gIHB1YmxpYyBzdGF0cyA9IHtcbiAgICBvYmpUb3RhbENvdW50OiAwLFxuICAgIG9iakluR3JvdXBDb3VudDogW10gYXMgbnVtYmVyW10sXG4gICAgZ3JvdXBzQ291bnQ6IDAsXG4gICAgbWVtVXNhZ2U6IDBcbiAgfVxuXG4gIC8qKiDQntCx0YrQtdC60YIt0LrQsNC90LLQsNGBINC60L7QvdGC0LXQutGB0YLQsCDRgNC10L3QtNC10YDQuNC90LPQsCBXZWJHTC4gKi9cbiAgcHVibGljIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnRcblxuICAvKiog0J3QsNGB0YLRgNC+0LnQutC4LCDQt9Cw0L/RgNC+0YjQtdC90L3Ri9C1INC/0L7Qu9GM0LfQvtCy0LDRgtC10LvQtdC8INCyINC60L7QvdGB0YLRgNGD0LrRgtC+0YDQtSDQuNC70Lgg0L/RgNC4INC/0L7RgdC70LXQtNC90LXQvCDQstGL0LfQvtCy0LUgc2V0dXAuICovXG4gIHB1YmxpYyBsYXN0UmVxdWVzdGVkT3B0aW9uczogU1Bsb3RPcHRpb25zIHwgdW5kZWZpbmVkID0ge31cblxuICAvKiog0KXQtdC70L/QtdGAINCy0LfQsNC40LzQvtC00LXQudGB0YLQstC40Y8g0YEg0YPRgdGC0YDQvtC50YHRgtCy0L7QvCDQstCy0L7QtNCwLiAqL1xuICBwcm90ZWN0ZWQgY29udHJvbDogU1Bsb3RDb250b2wgPSBuZXcgU1Bsb3RDb250b2wodGhpcylcblxuICAvKiog0J/RgNC40LfQvdCw0Log0YLQvtCz0L4sINGH0YLQviDRjdC60LfQtdC80L/Qu9GP0YAg0LrQu9Cw0YHRgdCwINCx0YvQuyDQutC+0YDRgNC10LrRgtC90L4g0L/QvtC00LPQvtGC0L7QstC70LXQvSDQuiDRgNC10L3QtNC10YDRgy4gKi9cbiAgcHJpdmF0ZSBpc1NldHVwZWQ6IGJvb2xlYW4gPSBmYWxzZVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCh0L7Qt9C00LDQtdGCINGN0LrQt9C10LzQv9C70Y/RgCDQutC70LDRgdGB0LAsINC40L3QuNGG0LjQsNC70LjQt9C40YDRg9C10YIg0L3QsNGB0YLRgNC+0LnQutC4ICjQtdGB0LvQuCDQv9C10YDQtdC00LDQvdGLKS5cbiAgICpcbiAgICogQHJlbWFya3NcbiAgICog0JXRgdC70Lgg0LrQsNC90LLQsNGBINGBINC30LDQtNCw0L3QvdGL0Lwg0LjQtNC10L3RgtC40YTQuNC60LDRgtC+0YDQvtC8INC90LUg0L3QsNC50LTQtdC9IC0g0LPQtdC90LXRgNC40YDRg9C10YLRgdGPINC+0YjQuNCx0LrQsC4g0J3QsNGB0YLRgNC+0LnQutC4INC80L7Qs9GD0YIg0LHRi9GC0Ywg0LfQsNC00LDQvdGLINC60LDQuiDQslxuICAgKiDQutC+0L3RgdGC0YDRg9C60YLQvtGA0LUsINGC0LDQuiDQuCDQsiDQvNC10YLQvtC00LUge0BsaW5rIHNldHVwfS4g0JIg0LvRjtCx0L7QvCDRgdC70YPRh9Cw0LUg0L3QsNGB0YLRgNC+0LnQutC4INC00L7Qu9C20L3RiyDQsdGL0YLRjCDQt9Cw0LTQsNC90Ysg0LTQviDQt9Cw0L/Rg9GB0LrQsCDRgNC10L3QtNC10YDQsC5cbiAgICpcbiAgICogQHBhcmFtIGNhbnZhc0lkIC0g0JjQtNC10L3RgtC40YTQuNC60LDRgtC+0YAg0LrQsNC90LLQsNGB0LAsINC90LAg0LrQvtGC0L7RgNC+0Lwg0LHRg9C00LXRgiDRgNC40YHQvtCy0LDRgtGM0YHRjyDQs9GA0LDRhNC40LouXG4gICAqIEBwYXJhbSBvcHRpb25zIC0g0J/QvtC70YzQt9C+0LLQsNGC0LXQu9GM0YHQutC40LUg0L3QsNGB0YLRgNC+0LnQutC4INGN0LrQt9C10LzQv9C70Y/RgNCwLlxuICAgKi9cbiAgY29uc3RydWN0b3IoY2FudmFzSWQ6IHN0cmluZywgb3B0aW9ucz86IFNQbG90T3B0aW9ucykge1xuXG4gICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNhbnZhc0lkKSkge1xuICAgICAgdGhpcy5jYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChjYW52YXNJZCkgYXMgSFRNTENhbnZhc0VsZW1lbnRcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCfQmtCw0L3QstCw0YEg0YEg0LjQtNC10L3RgtC40YTQuNC60LDRgtC+0YDQvtC8IFwiIycgKyBjYW52YXNJZCArICdcIiDQvdC1INC90LDQudC00LXQvSEnKVxuICAgIH1cblxuICAgIGlmIChvcHRpb25zKSB7XG5cbiAgICAgIC8qKiDQldGB0LvQuCDQv9C10YDQtdC00LDQvdGLINC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjNGB0LrQuNC1INC90LDRgdGC0YDQvtC50LrQuCwg0YLQviDQvtC90Lgg0L/RgNC40LzQtdC90Y/RjtGC0YHRjy4gKi9cbiAgICAgIGNvcHlNYXRjaGluZ0tleVZhbHVlcyh0aGlzLCBvcHRpb25zKVxuICAgICAgdGhpcy5sYXN0UmVxdWVzdGVkT3B0aW9ucyA9IG9wdGlvbnNcblxuICAgICAgLyoqINCY0L3QuNGG0LjQsNC70LjQt9Cw0YbQuNGPINCy0YHQtdGFINC/0LDRgNCw0LzQtdGC0YDQvtCyINGA0LXQvdC00LXRgNCwLCDQtdGB0LvQuCDQt9Cw0L/RgNC+0YjQtdC9INGE0L7RgNGB0LjRgNC+0LLQsNC90L3Ri9C5INC30LDQv9GD0YHQui4gKi9cbiAgICAgIGlmICh0aGlzLmZvcmNlUnVuKSB7XG4gICAgICAgIHRoaXMuc2V0dXAob3B0aW9ucylcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQmNC90LjRhtC40LDQu9C40LfQuNGA0YPQtdGCINC90LXQvtCx0YXQvtC00LjQvNGL0LUg0LTQu9GPINGA0LXQvdC00LXRgNCwINC/0LDRgNCw0LzQtdGC0YDRiyDRjdC60LfQtdC80L/Qu9GP0YDQsCwg0LLRi9C/0L7Qu9C90Y/QtdGCINC/0L7QtNCz0L7RgtC+0LLQutGDINC4INC30LDQv9C+0LvQvdC10L3QuNC1INCx0YPRhNC10YDQvtCyIFdlYkdMLlxuICAgKlxuICAgKiBAcGFyYW0gb3B0aW9ucyAtINCd0LDRgdGC0YDQvtC50LrQuCDRjdC60LfQtdC80L/Qu9GP0YDQsC5cbiAgICovXG4gIHB1YmxpYyBzZXR1cCggb3B0aW9uczogU1Bsb3RPcHRpb25zID0ge30gKTogdm9pZCB7XG5cbiAgICAvKiog0J/RgNC40LfQvdCw0Log0YLQvtCz0L4sINGH0YLQviDRjdC60LfQtdC80L/Qu9GP0YAg0LrQsNC6INC80LjQvdC40LzRg9C8INC+0LTQuNC9INGA0LDQtyDQstGL0L/QvtC70L3QuNC7INC80LXRgtC+0LQgc2V0dXAuICovXG4gICAgdGhpcy5pc1NldHVwZWQgPSB0cnVlXG5cbiAgICAvKiog0J/RgNC40LzQtdC90LXQvdC40LUg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GM0YHQutC40YUg0L3QsNGB0YLRgNC+0LXQui4gKi9cbiAgICBjb3B5TWF0Y2hpbmdLZXlWYWx1ZXModGhpcywgb3B0aW9ucylcbiAgICB0aGlzLmxhc3RSZXF1ZXN0ZWRPcHRpb25zID0gb3B0aW9uc1xuXG4gICAgLyoqINCf0YDQvtCy0LXRgNC60LAg0LrQvtGA0YDQtdC60YLQvdC+0YHRgtC4INC90LDRgdGC0YDQvtC50LrQuCDRjdC60LfQtdC80L/Qu9GP0YDQsC4gKi9cbiAgICB0aGlzLmNoZWNrU2V0dXAoKVxuXG4gICAgdGhpcy5kZWJ1Zy5sb2coJ2ludHJvJylcblxuICAgIC8qKiDQn9C+0LTQs9C+0YLQvtCy0LrQsCDQstGB0LXRhSDRhdC10LvQv9C10YDQvtCyLiDQn9C+0YHQu9C10LTQvtCy0LDRgtC10LvRjNC90L7RgdGC0Ywg0L/QvtC00LPQvtGC0L7QstC60Lgg0LjQvNC10LXRgiDQt9C90LDRh9C10L3QuNC1LiAqL1xuICAgIHRoaXMuZGVidWcuc2V0dXAoKVxuICAgIHRoaXMuZ2xzbC5zZXR1cCgpXG4gICAgdGhpcy53ZWJnbC5zZXR1cCgpXG4gICAgdGhpcy5jb250cm9sLnNldHVwKClcbiAgICB0aGlzLmRlbW8uc2V0dXAoKVxuXG4gICAgdGhpcy5kZWJ1Zy5sb2coJ2luc3RhbmNlJylcblxuICAgIC8qKiDQodC+0LfQtNCw0L3QuNC1INC/0LXRgNC10LzQtdC90L3Ri9GFIFdlYkdsLiAqL1xuICAgIHRoaXMud2ViZ2wuY3JlYXRlVmFyaWFibGVzKCdhX3Bvc2l0aW9uJywgJ2FfY29sb3InLCAnYV9zaXplJywgJ2Ffc2hhcGUnLCAndV9tYXRyaXgnKVxuXG4gICAgLyoqINCe0LHRgNCw0LHQvtGC0LrQsCDQstGB0LXRhSDQtNCw0L3QvdGL0YUg0L7QsSDQvtCx0YrQtdC60YLQsNGFINC4INC40YUg0LfQsNCz0YDRg9C30LrQsCDQsiDQsdGD0YTQtdGA0Ysg0LLQuNC00LXQvtC/0LDQvNGP0YLQuC4gKi9cbiAgICB0aGlzLmxvYWREYXRhKClcblxuICAgIGlmICh0aGlzLmZvcmNlUnVuKSB7XG4gICAgICAvKiog0KTQvtGA0YHQuNGA0L7QstCw0L3QvdGL0Lkg0LfQsNC/0YPRgdC6INGA0LXQvdC00LXRgNC40L3Qs9CwICjQtdGB0LvQuCDRgtGA0LXQsdGD0LXRgtGB0Y8pLiAqL1xuICAgICAgdGhpcy5ydW4oKVxuICAgIH1cbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCh0L7Qt9C00LDQtdGCINC4INC30LDQv9C+0LvQvdGP0LXRgiDQtNCw0L3QvdGL0LzQuCDQvtCx0L4g0LLRgdC10YUg0L7QsdGK0LXQutGC0LDRhSDQsdGD0YTQtdGA0YsgV2ViR0wuXG4gICAqL1xuICBwcm90ZWN0ZWQgbG9hZERhdGEoKTogdm9pZCB7XG5cbiAgICB0aGlzLmRlYnVnLmxvZygnbG9hZGluZycpXG5cbiAgICBsZXQgZ3JvdXBzID0geyB2ZXJ0aWNlczogW10gYXMgbnVtYmVyW10sIGNvbG9yczogW10gYXMgbnVtYmVyW10sIHNpemVzOiBbXSBhcyBudW1iZXJbXSwgc2hhcGVzOiBbXSBhcyBudW1iZXJbXSB9XG4gICAgdGhpcy5zdGF0cyA9IHsgb2JqVG90YWxDb3VudDogMCwgb2JqSW5Hcm91cENvdW50OiBbXSBhcyBudW1iZXJbXSwgZ3JvdXBzQ291bnQ6IDAsIG1lbVVzYWdlOiAwIH1cblxuICAgIGxldCBvYmplY3Q6IFNQbG90T2JqZWN0IHwgbnVsbCB8IHVuZGVmaW5lZFxuICAgIGxldCBpOiBudW1iZXIgPSAwXG4gICAgbGV0IGlzT2JqZWN0RW5kczogYm9vbGVhbiA9IGZhbHNlXG5cbiAgICB3aGlsZSAoIWlzT2JqZWN0RW5kcykge1xuXG4gICAgICBvYmplY3QgPSB0aGlzLml0ZXJhdG9yISgpXG4gICAgICBpc09iamVjdEVuZHMgPSAob2JqZWN0ID09PSBudWxsKSB8fCAodGhpcy5zdGF0cy5vYmpUb3RhbENvdW50ID49IHRoaXMuZ2xvYmFsTGltaXQpXG5cbiAgICAgIGlmICghaXNPYmplY3RFbmRzKSB7XG4gICAgICAgIGdyb3Vwcy52ZXJ0aWNlcy5wdXNoKG9iamVjdCEueCwgb2JqZWN0IS55KVxuICAgICAgICBncm91cHMuc2hhcGVzLnB1c2gob2JqZWN0IS5zaGFwZSlcbiAgICAgICAgZ3JvdXBzLnNpemVzLnB1c2gob2JqZWN0IS5zaXplKVxuICAgICAgICBncm91cHMuY29sb3JzLnB1c2gob2JqZWN0IS5jb2xvcilcbiAgICAgICAgdGhpcy5zdGF0cy5vYmpUb3RhbENvdW50KytcbiAgICAgICAgaSsrXG4gICAgICB9XG5cbiAgICAgIGlmICgoaSA+PSB0aGlzLmdyb3VwTGltaXQpIHx8IGlzT2JqZWN0RW5kcykge1xuICAgICAgICB0aGlzLnN0YXRzLm9iakluR3JvdXBDb3VudFt0aGlzLnN0YXRzLmdyb3Vwc0NvdW50XSA9IGlcblxuICAgICAgICAvKiog0KHQvtC30LTQsNC90LjQtSDQuCDQt9Cw0L/QvtC70L3QtdC90LjQtSDQsdGD0YTQtdGA0L7QsiDQtNCw0L3QvdGL0LzQuCDQviDRgtC10LrRg9GJ0LXQuSDQs9GA0YPQv9C/0LUg0L7QsdGK0LXQutGC0L7Qsi4gKi9cbiAgICAgICAgdGhpcy5zdGF0cy5tZW1Vc2FnZSArPVxuICAgICAgICAgIHRoaXMud2ViZ2wuY3JlYXRlQnVmZmVyKCd2ZXJ0aWNlcycsIG5ldyBGbG9hdDMyQXJyYXkoZ3JvdXBzLnZlcnRpY2VzKSkgK1xuICAgICAgICAgIHRoaXMud2ViZ2wuY3JlYXRlQnVmZmVyKCdjb2xvcnMnLCBuZXcgVWludDhBcnJheShncm91cHMuY29sb3JzKSkgK1xuICAgICAgICAgIHRoaXMud2ViZ2wuY3JlYXRlQnVmZmVyKCdzaGFwZXMnLCBuZXcgVWludDhBcnJheShncm91cHMuc2hhcGVzKSkgK1xuICAgICAgICAgIHRoaXMud2ViZ2wuY3JlYXRlQnVmZmVyKCdzaXplcycsIG5ldyBGbG9hdDMyQXJyYXkoZ3JvdXBzLnNpemVzKSlcbiAgICAgIH1cblxuICAgICAgaWYgKChpID49IHRoaXMuZ3JvdXBMaW1pdCkgJiYgIWlzT2JqZWN0RW5kcykge1xuICAgICAgICB0aGlzLnN0YXRzLmdyb3Vwc0NvdW50KytcbiAgICAgICAgZ3JvdXBzID0geyB2ZXJ0aWNlczogW10sIGNvbG9yczogW10sIHNpemVzOiBbXSwgc2hhcGVzOiBbXSB9XG4gICAgICAgIGkgPSAwXG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5kZWJ1Zy5sb2coJ2xvYWRlZCcpXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQn9GA0L7QuNC30LLQvtC00LjRgiDRgNC10L3QtNC10YDQuNC90LMg0LPRgNCw0YTQuNC60LAg0LIg0YHQvtC+0YLQstC10YLRgdGC0LLQuNC4INGBINGC0LXQutGD0YnQuNC80Lgg0L/QsNGA0LDQvNC10YLRgNCw0LzQuCDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuC5cbiAgICovXG4gIHB1YmxpYyByZW5kZXIoKTogdm9pZCB7XG5cbiAgICAvKiog0J7Rh9C40YHRgtC60LAg0L7QsdGK0LXQutGC0LAg0YDQtdC90LTQtdGA0LjQvdCz0LAgV2ViR0wuICovXG4gICAgdGhpcy53ZWJnbC5jbGVhckJhY2tncm91bmQoKVxuXG4gICAgLyoqINCe0LHQvdC+0LLQu9C10L3QuNC1INC80LDRgtGA0LjRhtGLINGC0YDQsNC90YHRhNC+0YDQvNCw0YbQuNC4LiAqL1xuICAgIHRoaXMuY29udHJvbC51cGRhdGVWaWV3UHJvamVjdGlvbigpXG5cbiAgICAvKiog0J/RgNC40LLRj9C30LrQsCDQvNCw0YLRgNC40YbRiyDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuCDQuiDQv9C10YDQtdC80LXQvdC90L7QuSDRiNC10LnQtNC10YDQsC4gKi9cbiAgICB0aGlzLndlYmdsLnNldFZhcmlhYmxlKCd1X21hdHJpeCcsIHRoaXMuY29udHJvbC50cmFuc2Zvcm0udmlld1Byb2plY3Rpb25NYXQpXG5cbiAgICAvKiog0JjRgtC10YDQuNGA0L7QstCw0L3QuNC1INC4INGA0LXQvdC00LXRgNC40L3QsyDQs9GA0YPQv9C/INCx0YPRhNC10YDQvtCyIFdlYkdMLiAqL1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zdGF0cy5ncm91cHNDb3VudDsgaSsrKSB7XG5cbiAgICAgIHRoaXMud2ViZ2wuc2V0QnVmZmVyKCd2ZXJ0aWNlcycsIGksICdhX3Bvc2l0aW9uJywgMiwgMCwgMClcbiAgICAgIHRoaXMud2ViZ2wuc2V0QnVmZmVyKCdjb2xvcnMnLCBpLCAnYV9jb2xvcicsIDEsIDAsIDApXG4gICAgICB0aGlzLndlYmdsLnNldEJ1ZmZlcignc2l6ZXMnLCBpLCAnYV9zaXplJywgMSwgMCwgMClcbiAgICAgIHRoaXMud2ViZ2wuc2V0QnVmZmVyKCdzaGFwZXMnLCBpLCAnYV9zaGFwZScsIDEsIDAsIDApXG5cbiAgICAgIHRoaXMud2ViZ2wuZHJhd1BvaW50cygwLCB0aGlzLnN0YXRzLm9iakluR3JvdXBDb3VudFtpXSlcbiAgICB9XG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQn9GA0L7QstC10YDRj9C10YIg0LrQvtGA0YDQtdC60YLQvdC+0YHRgtGMINC90LDRgdGC0YDQvtC10Log0Y3QutC30LXQvNC/0LvRj9GA0LAuXG4gICAqXG4gICAqIEByZW1hcmtzXG4gICAqINCY0YHQv9C+0LvRjNC30YPQtdGC0YHRjyDQtNC70Y8g0L/RgNC+0LLQtdGA0LrQuCDQutC+0YDRgNC10LrRgtC90L7RgdGC0Lgg0LvQvtCz0LjQutC4INGA0LDQsdC+0YLRiyDQv9C+0LvRjNC30L7QstCw0YLQtdC70Y8g0YEg0Y3QutC30LXQvNC/0LvRj9GA0L7QvC4g0J3QtSDQv9C+0LfQstC+0LvRj9C10YIg0YDQsNCx0L7RgtCw0YLRjCDRgVxuICAgKiDQvdC10L3QsNGB0YLRgNC+0LXQvdC90YvQvCDQuNC70Lgg0L3QtdC60L7RgNGA0LXQutGC0L3QviDQvdCw0YHRgtGA0L7QtdC90L3Ri9C8INGN0LrQt9C10LzQv9C70Y/RgNC+0LwuXG4gICAqL1xuICBjaGVja1NldHVwKCkge1xuXG4gICAgLyoqXG4gICAgICogINCf0L7Qu9GM0LfQvtCy0LDRgtC10LvRjCDQvNC+0LMg0L3QsNGB0YLRgNC+0LjRgtGMINGN0LrQt9C10LzQv9C70Y/RgCDQsiDQutC+0L3RgdGC0YDRg9C60YLQvtGA0LUg0Lgg0YHRgNCw0LfRgyDQt9Cw0L/Rg9GB0YLQuNGC0Ywg0YDQtdC90LTQtdGALCDQsiDRgtCw0LrQvtC8INGB0LvRg9GH0LDQtSDQvNC10YLQvtC0IHNldHVwXG4gICAgICogINCx0YPQtNC10YIg0LLRi9C30YvQstCw0LXRgtGB0Y8g0L3QtdGP0LLQvdC+LlxuICAgICAqL1xuICAgIGlmICghdGhpcy5pc1NldHVwZWQpIHtcbiAgICAgIHRoaXMuc2V0dXAoKVxuICAgIH1cblxuICAgIC8qKiDQndCw0LHQvtGAINC/0YDQvtCy0LXRgNC+0Log0LrQvtGA0YDQtdC60YLQvdC+0YHRgtC4INC90LDRgdGC0YDQvtC50LrQuCDRjdC60LfQtdC80L/Qu9GP0YDQsC4gKi9cbiAgICBpZiAoIXRoaXMuaXRlcmF0b3IpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcign0J3QtSDQt9Cw0LTQsNC90LAg0YTRg9C90LrRhtC40Y8g0LjRgtC10YDQuNGA0L7QstCw0L3QuNGPINC+0LHRitC10LrRgtC+0LIhJylcbiAgICB9XG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQl9Cw0L/Rg9GB0LrQsNC10YIg0YDQtdC90LTQtdGA0LjQvdCzINC4INC60L7QvdGC0YDQvtC70Ywg0YPQv9GA0LDQstC70LXQvdC40Y8uXG4gICAqL1xuICBwdWJsaWMgcnVuKCk6IHZvaWQge1xuXG4gICAgdGhpcy5jaGVja1NldHVwKClcblxuICAgIGlmICghdGhpcy5pc1J1bm5pbmcpIHtcbiAgICAgIHRoaXMucmVuZGVyKClcbiAgICAgIHRoaXMuY29udHJvbC5ydW4oKVxuICAgICAgdGhpcy5pc1J1bm5pbmcgPSB0cnVlXG4gICAgICB0aGlzLmRlYnVnLmxvZygnc3RhcnRlZCcpXG4gICAgfVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0J7RgdGC0LDQvdCw0LLQu9C40LLQsNC10YIg0YDQtdC90LTQtdGA0LjQvdCzINC4INC60L7QvdGC0YDQvtC70Ywg0YPQv9GA0LDQstC70LXQvdC40Y8uXG4gICAqL1xuICBwdWJsaWMgc3RvcCgpOiB2b2lkIHtcblxuICAgIHRoaXMuY2hlY2tTZXR1cCgpXG5cbiAgICBpZiAodGhpcy5pc1J1bm5pbmcpIHtcbiAgICAgIHRoaXMuY29udHJvbC5zdG9wKClcbiAgICAgIHRoaXMuaXNSdW5uaW5nID0gZmFsc2VcbiAgICAgIHRoaXMuZGVidWcubG9nKCdzdG9wZWQnKVxuICAgIH1cbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCe0YfQuNGJ0LDQtdGCINGE0L7QvS5cbiAgICovXG4gIHB1YmxpYyBjbGVhcigpOiB2b2lkIHtcblxuICAgIHRoaXMuY2hlY2tTZXR1cCgpXG5cbiAgICB0aGlzLndlYmdsLmNsZWFyQmFja2dyb3VuZCgpXG4gICAgdGhpcy5kZWJ1Zy5sb2coJ2NsZWFyZWQnKVxuICB9XG59XG4iLCJcbi8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKlxuICog0J/RgNC+0LLQtdGA0Y/QtdGCINGP0LLQu9GP0LXRgtGB0Y8g0LvQuCDQv9C10YDQtdC80LXQvdC90LDRjyDRjdC60LfQtdC80L/Qu9GP0YDQvtC8INC60LDQutC+0LPQvi3Qu9C40LHQvtC+INC60LvQsNGB0YHQsC5cbiAqXG4gKiBAcGFyYW0gdmFyaWFibGUgLSDQn9GA0L7QstC10YDRj9C10LzQsNGPINC/0LXRgNC10LzQtdC90L3QsNGPLlxuICogQHJldHVybnMg0KDQtdC30YPQu9GM0YLQsNGCINC/0YDQvtCy0LXRgNC60LguXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc09iamVjdCh2YXJpYWJsZTogYW55KTogYm9vbGVhbiB7XG4gIHJldHVybiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhcmlhYmxlKSA9PT0gJ1tvYmplY3QgT2JqZWN0XScpXG59XG5cbi8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKlxuICog0J/QtdGA0LXQvtC/0YDQtdC00LXQu9GP0LXRgiDQt9C90LDRh9C10L3QuNGPINC/0L7Qu9C10Lkg0L7QsdGK0LXQutGC0LAgdGFyZ2V0INC90LAg0LfQvdCw0YfQtdC90LjRjyDQv9C+0LvQtdC5INC+0LHRitC10LrRgtCwIHNvdXJjZS5cbiAqXG4gKiBAcmVtYXJrc1xuICog0J/QtdGA0LXQvtC/0YDQtdC00LXQu9GP0Y7RgtGB0Y8g0YLQvtC70YzQutC+INGC0LUg0L/QvtC70Y8sINC60L7RgtC+0YDRi9C1INGB0YPRidC10YHRgtCy0YPQtdGO0YIg0LIgdGFyZ2V0LiDQldGB0LvQuCDQsiBzb3VyY2Ug0LXRgdGC0Ywg0L/QvtC70Y8sINC60L7RgtC+0YDRi9GFINC90LXRgiDQsiB0YXJnZXQsINGC0L4g0L7QvdC4XG4gKiDQuNCz0L3QvtGA0LjRgNGD0Y7RgtGB0Y8uINCV0YHQu9C4INC60LDQutC40LUt0YLQviDQv9C+0LvRjyDRgdCw0LzQuCDRj9Cy0LvRj9GO0YLRgdGPINGP0LLQu9GP0Y7RgtGB0Y8g0L7QsdGK0LXQutGC0LDQvNC4LCDRgtC+INGC0L4g0L7QvdC4INGC0LDQutC20LUg0YDQtdC60YPRgNGB0LjQstC90L4g0LrQvtC/0LjRgNGD0Y7RgtGB0Y8gKNC/0YDQuCDRgtC+0Lwg0LbQtVxuICog0YPRgdC70L7QstC40LgsINGH0YLQviDQsiDRhtC10LvQtdCy0L7QvCDQvtCx0YrQtdC60YLQtSDRgdGD0YnQtdGB0YLQstGD0Y7RgiDQv9C+0LvRjyDQvtCx0YrQtdC60YLQsC3QuNGB0YLQvtGH0L3QuNC60LApLlxuICpcbiAqIEBwYXJhbSB0YXJnZXQgLSDQptC10LvQtdCy0L7QuSAo0LjQt9C80LXQvdGP0LXQvNGL0LkpINC+0LHRitC10LrRgi5cbiAqIEBwYXJhbSBzb3VyY2UgLSDQntCx0YrQtdC60YIg0YEg0LTQsNC90L3Ri9C80LgsINC60L7RgtC+0YDRi9C1INC90YPQttC90L4g0YPRgdGC0LDQvdC+0LLQuNGC0Ywg0YMg0YbQtdC70LXQstC+0LPQviDQvtCx0YrQtdC60YLQsC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvcHlNYXRjaGluZ0tleVZhbHVlcyh0YXJnZXQ6IGFueSwgc291cmNlOiBhbnkpOiB2b2lkIHtcbiAgT2JqZWN0LmtleXMoc291cmNlKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgaWYgKGtleSBpbiB0YXJnZXQpIHtcbiAgICAgIGlmIChpc09iamVjdChzb3VyY2Vba2V5XSkpIHtcbiAgICAgICAgaWYgKGlzT2JqZWN0KHRhcmdldFtrZXldKSkge1xuICAgICAgICAgIGNvcHlNYXRjaGluZ0tleVZhbHVlcyh0YXJnZXRba2V5XSwgc291cmNlW2tleV0pXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghaXNPYmplY3QodGFyZ2V0W2tleV0pICYmICh0eXBlb2YgdGFyZ2V0W2tleV0gIT09ICdmdW5jdGlvbicpKSB7XG4gICAgICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KVxufVxuXG4vKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICpcbiAqINCS0L7Qt9Cy0YDQsNGJ0LDQtdGCINGB0LvRg9GH0LDQudC90L7QtSDRhtC10LvQvtC1INGH0LjRgdC70L4g0LIg0LTQuNCw0L/QsNC30L7QvdC1OiBbMC4uLnJhbmdlLTFdLlxuICpcbiAqIEBwYXJhbSByYW5nZSAtINCS0LXRgNGF0L3QuNC5INC/0YDQtdC00LXQuyDQtNC40LDQv9Cw0LfQvtC90LAg0YHQu9GD0YfQsNC50L3QvtCz0L4g0LLRi9Cx0L7RgNCwLlxuICogQHJldHVybnMg0KHQu9GD0YfQsNC50L3QvtC1INGH0LjRgdC70L4uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByYW5kb21JbnQocmFuZ2U6IG51bWJlcik6IG51bWJlciB7XG4gIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiByYW5nZSlcbn1cblxuLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqXG4gKiDQmtC+0L3QstC10YDRgtC40YDRg9C10YIg0YbQstC10YIg0LjQtyBIRVgt0YTQvtGA0LzQsNGC0LAg0LIgR0xTTC3RhNC+0YDQvNCw0YIuXG4gKlxuICogQHBhcmFtIGhleENvbG9yIC0g0KbQstC10YIg0LIgSEVYLdGE0L7RgNC80LDRgtC1IChcIiNmZmZmZmZcIikuXG4gKiBAcmV0dXJucyDQnNCw0YHRgdC40LIg0LjQtyDRgtGA0LXRhSDRh9C40YHQtdC7INCyINC00LjQsNC/0LDQt9C+0L3QtSDQvtGCIDAg0LTQviAxLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY29sb3JGcm9tSGV4VG9HbFJnYihoZXhDb2xvcjogc3RyaW5nKTogbnVtYmVyW10ge1xuICBsZXQgayA9IC9eIz8oW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkkL2kuZXhlYyhoZXhDb2xvcilcbiAgbGV0IFtyLCBnLCBiXSA9IFtwYXJzZUludChrIVsxXSwgMTYpIC8gMjU1LCBwYXJzZUludChrIVsyXSwgMTYpIC8gMjU1LCBwYXJzZUludChrIVszXSwgMTYpIC8gMjU1XVxuICByZXR1cm4gW3IsIGcsIGJdXG59XG5cbi8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKlxuICog0JLQvtC30LLRgNCw0YnQsNC10YIg0YHRgtGA0L7QutC+0LLRg9GOINC30LDQv9C40YHRjCDRgtC10LrRg9GJ0LXQs9C+INCy0YDQtdC80LXQvdC4LlxuICpcbiAqIEByZXR1cm5zINCh0YLRgNC+0LrQsCDQstGA0LXQvNC10L3QuCDQsiDRhNC+0YDQvNCw0YLQtSBcImhoOm1tOnNzXCIuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRDdXJyZW50VGltZSgpOiBzdHJpbmcge1xuXG4gIGxldCB0b2RheSA9IG5ldyBEYXRlKClcblxuICByZXR1cm4gW1xuICAgIHRvZGF5LmdldEhvdXJzKCkudG9TdHJpbmcoKS5wYWRTdGFydCgyLCAnMCcpLFxuICAgIHRvZGF5LmdldE1pbnV0ZXMoKS50b1N0cmluZygpLnBhZFN0YXJ0KDIsICcwJyksXG4gICAgdG9kYXkuZ2V0U2Vjb25kcygpLnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgJzAnKVxuICBdLmpvaW4oJzonKVxufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBTUGxvdCBmcm9tICdAL3NwbG90J1xuaW1wb3J0ICdAL3N0eWxlJ1xuXG4vKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuXG5sZXQgbiA9IDFfMDAwXzAwMFxubGV0IGNvbG9ycyA9IFsnI0Q4MUMwMScsICcjRTk5NjdBJywgJyNCQTU1RDMnLCAnI0ZGRDcwMCcsICcjRkZFNEI1JywgJyNGRjhDMDAnLCAnIzIyOEIyMicsICcjOTBFRTkwJywgJyM0MTY5RTEnLCAnIzAwQkZGRicsICcjOEI0NTEzJywgJyMwMENFRDEnXVxubGV0IHdpZHRoID0gMzJfMDAwXG5sZXQgaGVpZ2h0ID0gMTZfMDAwXG5cbi8qKiDQodC40L3RgtC10YLQuNGH0LXRgdC60LDRjyDQuNGC0LXRgNC40YDRg9GO0YnQsNGPINGE0YPQvdC60YbQuNGPLiAqL1xubGV0IGkgPSAwXG5mdW5jdGlvbiByZWFkTmV4dE9iamVjdCgpIHtcbiAgaWYgKGkgPCBuKSB7XG4gICAgaSsrXG4gICAgcmV0dXJuIHtcbiAgICAgIHg6IHJhbmRvbUludCh3aWR0aCksXG4gICAgICB5OiByYW5kb21JbnQoaGVpZ2h0KSxcbiAgICAgIHNoYXBlOiByYW5kb21JbnQoNSksXG4gICAgICBzaXplOiAxMCArIHJhbmRvbUludCgyMSksXG4gICAgICBjb2xvcjogcmFuZG9tSW50KGNvbG9ycy5sZW5ndGgpXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGkgPSAwXG4gICAgcmV0dXJuIG51bGwgIC8vINCS0L7Qt9Cy0YDQsNGJ0LDQtdC8IG51bGwsINC60L7Qs9C00LAg0L7QsdGK0LXQutGC0YsgXCLQt9Cw0LrQvtC90YfQuNC70LjRgdGMXCIuXG4gIH1cbn1cblxuZnVuY3Rpb24gcmFuZG9tSW50KHJhbmdlKSB7XG4gIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiByYW5nZSlcbn1cblxuLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cblxubGV0IHNjYXR0ZXJQbG90ID0gbmV3IFNQbG90KCdjYW52YXMxJylcblxuc2NhdHRlclBsb3Quc2V0dXAoe1xuICBpdGVyYXRvcjogcmVhZE5leHRPYmplY3QsXG4gIGNvbG9yczogY29sb3JzLFxuICBncmlkOiB7XG4gICAgd2lkdGg6IHdpZHRoLFxuICAgIGhlaWdodDogaGVpZ2h0XG4gIH0sXG4gIGRlYnVnOiB7XG4gICAgaXNFbmFibGU6IHRydWUsXG4gIH0sXG4gIGRlbW86IHtcbiAgICBpc0VuYWJsZTogZmFsc2VcbiAgfVxufSlcblxuc2NhdHRlclBsb3QucnVuKClcbiJdLCJzb3VyY2VSb290IjoiIn0=