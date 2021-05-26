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
        /** Признак того, что хелпер уже настроен. */
        this.isSetuped = false;
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
        if (!this.isSetuped) {
            this.isSetuped = true;
        }
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
        /** Признак того, что хелпер уже настроен. */
        this.isSetuped = false;
    }
    /** ****************************************************************************
     *
     * Подготавливает хелпер к использованию.
     */
    SPlotDebug.prototype.setup = function (clearConsole) {
        if (clearConsole === void 0) { clearConsole = false; }
        if (!this.isSetuped) {
            if (clearConsole) {
                console.clear();
            }
            this.isSetuped = true;
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
        /** Признак того, что хелпер уже настроен. */
        this.isSetuped = false;
        /** Счетчик итерируемых объектов. */
        this.index = 0;
    }
    /** ****************************************************************************
     *
     * Подготавливает хелпер к использованию.
     */
    SPlotDemo.prototype.setup = function () {
        /** Хелпер демо-режима выполняет настройку всех своих параметров даже если она уже выполнялась. */
        if (!this.isSetuped) {
            this.isSetuped = true;
        }
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
        /** Признак того, что хелпер уже настроен. */
        this.isSetuped = false;
    }
    /** ****************************************************************************
     *
     * Подготавливает хелпер к использованию.
     */
    SPlotGlsl.prototype.setup = function () {
        if (!this.isSetuped) {
            /** Сборка кодов шейдеров. */
            this.vertShaderSource = this.makeVertShaderSource();
            this.fragShaderSource = this.makeFragShaderSource();
            /** Вычисление количества различных форм объектов. */
            this.splot.shapesCount = shaders.SHAPES.length;
            this.isSetuped = true;
        }
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
        this.desynchronized = true;
        this.premultipliedAlpha = false;
        this.preserveDrawingBuffer = false;
        this.failIfMajorPerformanceCaveat = true;
        this.powerPreference = 'high-performance';
        /** Названия элементов графической системы клиента. */
        this.gpu = { hardware: '-', software: '-' };
        /** Переменные для связи приложения с программой WebGL. */
        this.variables = new Map();
        /** Буферы видеопамяти WebGL. */
        this.data = new Map();
        /** Признак того, что хелпер уже настроен. */
        this.isSetuped = false;
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
        /** Часть параметров хелпера WebGL инициализируется только один раз. */
        if (!this.isSetuped) {
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
            /** Создание программы WebGL. */
            this.createProgram(this.splot.glsl.vertShaderSource, this.splot.glsl.fragShaderSource);
            this.isSetuped = true;
        }
        /** Другая часть параметров хелпера WebGL инициализируется при каждом вызове метода setup. */
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
        /** Признак необходимости загрузки данных об объектах. */
        this.loadData = true;
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
        if (!options)
            options = {};
        /** Применение пользовательских настроек. */
        utils_1.copyMatchingKeyValues(this, options);
        this.lastRequestedOptions = options;
        this.debug.log('intro');
        /** Подготовка всех хелперов. Последовательность подготовки имеет значение. */
        this.debug.setup();
        this.glsl.setup();
        this.webgl.setup();
        this.control.setup();
        this.demo.setup();
        this.debug.log('instance');
        /** Обработка всех данных об объектах и их загрузка в буферы видеопамяти. */
        if (this.loadData) {
            this.load();
            /** По умолчанию при повторном вызове метода setup новое чтение объектов не производится. */
            this.loadData = false;
        }
        /** Действия, которые выполняются только при первом вызове метода setup. */
        if (!this.isSetuped) {
            /** Создание переменных WebGl. */
            this.webgl.createVariables('a_position', 'a_color', 'a_size', 'a_shape', 'u_matrix');
            /** Признак того, что экземпляр как минимум один раз выполнил метод setup. */
            this.isSetuped = true;
        }
        /** Проверка корректности настройки экземпляра. */
        this.checkSetup();
        if (this.forceRun) {
            /** Форсированный запуск рендеринга (если требуется). */
            this.run();
        }
    };
    /** ****************************************************************************
     *
     * Создает и заполняет данными обо всех объектах буферы WebGL.
     */
    SPlot.prototype.load = function () {
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
  },
  webgl: {
    failIfMajorPerformanceCaveat: true
  }
})

scatterPlot.run()

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zdHlsZS5jc3MiLCJ3ZWJwYWNrOi8vLy4vbWF0aDN4My50cyIsIndlYnBhY2s6Ly8vLi9zaGFkZXJzLnRzIiwid2VicGFjazovLy8uL3NwbG90LWNvbnRyb2wudHMiLCJ3ZWJwYWNrOi8vLy4vc3Bsb3QtZGVidWcudHMiLCJ3ZWJwYWNrOi8vLy4vc3Bsb3QtZGVtby50cyIsIndlYnBhY2s6Ly8vLi9zcGxvdC1nbHNsLnRzIiwid2VicGFjazovLy8uL3NwbG90LXdlYmdsLnRzIiwid2VicGFjazovLy8uL3NwbG90LnRzIiwid2VicGFjazovLy8uL3V0aWxzLnRzIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly8vLi9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7OztBQ0NBOztHQUVHO0FBQ0gsU0FBZ0IsUUFBUSxDQUFDLENBQVcsRUFBRSxDQUFXO0lBQy9DLE9BQU87UUFDTCxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMs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QUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3JDLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckMsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNyQyxJQUFNLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztJQUN0RCxPQUFPO1FBQ0osQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEdBQUc7UUFDM0IsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFD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LENBQUM7S0FDL0MsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO0FBQ2IsQ0FBQztBQVRELHdDQVNDOzs7Ozs7O1VDL0VEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxnQ0FBZ0MsWUFBWTtXQUM1QztXQUNBLEU7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx3Q0FBd0MseUNBQXlDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBLHdGOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHNEQUFzRCxrQkFBa0I7V0FDeEU7V0FDQSwrQ0FBK0MsY0FBYztXQUM3RCxFOzs7Ozs7Ozs7Ozs7OztBQ04yQjtBQUNYOztBQUVoQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBLHNCQUFzQiwrQ0FBSzs7QUFFM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEIiwiZmlsZSI6InNjcmlwdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIlxuLyoqXG4gKiDQo9C80L3QvtC20LDQtdGCINC80LDRgtGA0LjRhtGLLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbXVsdGlwbHkoYTogbnVtYmVyW10sIGI6IG51bWJlcltdKTogbnVtYmVyW10ge1xuICByZXR1cm4gW1xuICAgIGJbMF0gKiBhWzBdICsgYlsxXSAqIGFbM10gKyBiWzJdICogYVs2XSxcbiAgICBiWzBdICogYVsxXSArIGJbMV0gKiBhWzRdICsgYlsyXSAqIGFbN10sXG4gICAgYlswXSAqIGFbMl0gKyBiWzFdICogYVs1XSArIGJbMl0gKiBhWzhdLFxuICAgIGJbM10gKiBhWzBdICsgYls0XSAqIGFbM10gKyBiWzVdICogYVs2XSxcbiAgICBiWzNdICogYVsxXSArIGJbNF0gKiBhWzRdICsgYls1XSAqIGFbN10sXG4gICAgYlszXSAqIGFbMl0gKyBiWzRdICogYVs1XSArIGJbNV0gKiBhWzhdLFxuICAgIGJbNl0gKiBhWzBdICsgYls3XSAqIGFbM10gKyBiWzhdICogYVs2XSxcbiAgICBiWzZdICogYVsxXSArIGJbN10gKiBhWzRdICsgYls4XSAqIGFbN10sXG4gICAgYls2XSAqIGFbMl0gKyBiWzddICogYVs1XSArIGJbOF0gKiBhWzhdXG4gIF1cbn1cblxuLyoqXG4gKiDQodC+0LfQtNCw0LXRgiDQtdC00LjQvdC40YfQvdGD0Y4g0LzQsNGC0YDQuNGG0YMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpZGVudGl0eSgpOiBudW1iZXJbXSB7XG4gIHJldHVybiBbXG4gICAgMSwgMCwgMCxcbiAgICAwLCAxLCAwLFxuICAgIDAsIDAsIDFcbiAgXVxufVxuXG4vKipcbiAqIENyZWF0ZXMgYSAyRCBwcm9qZWN0aW9uIG1hdHJpeC4gUmV0dXJucyBhIHByb2plY3Rpb24gbWF0cml4IHRoYXQgY29udmVydHMgZnJvbSBwaXhlbHMgdG8gY2xpcHNwYWNlIHdpdGggWSA9IDAgYXQgdGhlXG4gKiB0b3AuIFRoaXMgbWF0cml4IGZsaXBzIHRoZSBZIGF4aXMgc28gMCBpcyBhdCB0aGUgdG9wLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcHJvamVjdGlvbih3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlcik6IG51bWJlcltdIHtcbiAgcmV0dXJuIFtcbiAgICAyIC8gd2lkdGgsIDAsIDAsXG4gICAgMCwgLTIgLyBoZWlnaHQsIDAsXG4gICAgLTEsIDEsIDFcbiAgXVxufVxuXG4vKipcbiAqIENyZWF0ZXMgYSAyRCB0cmFuc2xhdGlvbiBtYXRyaXguIFJldHVybnMgYSB0cmFuc2xhdGlvbiBtYXRyaXggdGhhdCB0cmFuc2xhdGVzIGJ5IHR4IGFuZCB0eS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRyYW5zbGF0aW9uKHR4OiBudW1iZXIsIHR5OiBudW1iZXIpOiBudW1iZXJbXSB7XG4gIHJldHVybiBbXG4gICAgMSwgMCwgMCxcbiAgICAwLCAxLCAwLFxuICAgIHR4LCB0eSwgMVxuICBdXG59XG5cbi8qKlxuICogTXVsdGlwbGllcyBieSBhIDJEIHRyYW5zbGF0aW9uIG1hdHJpeFxuICovXG5leHBvcnQgZnVuY3Rpb24gdHJhbnNsYXRlKG06IG51bWJlcltdLCB0eDogbnVtYmVyLCB0eTogbnVtYmVyKTogbnVtYmVyW10ge1xuICByZXR1cm4gbXVsdGlwbHkobSwgdHJhbnNsYXRpb24odHgsIHR5KSlcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgMkQgc2NhbGluZyBtYXRyaXhcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNjYWxpbmcoc3g6IG51bWJlciwgc3k6IG51bWJlcik6IG51bWJlcltdIHtcbiAgcmV0dXJuIFtcbiAgICBzeCwgMCwgMCxcbiAgICAwLCBzeSwgMCxcbiAgICAwLCAwLCAxXG4gIF1cbn1cblxuLyoqXG4gKiBNdWx0aXBsaWVzIGJ5IGEgMkQgc2NhbGluZyBtYXRyaXhcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNjYWxlKG06IG51bWJlcltdLCBzeDogbnVtYmVyLCBzeTogbnVtYmVyKTogbnVtYmVyW10ge1xuICByZXR1cm4gbXVsdGlwbHkobSwgc2NhbGluZyhzeCwgc3kpKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdHJhbnNmb3JtUG9pbnQobTogbnVtYmVyW10sIHY6IG51bWJlcltdKTogbnVtYmVyW10ge1xuICBjb25zdCBkID0gdlswXSAqIG1bMl0gKyB2WzFdICogbVs1XSArIG1bOF1cbiAgcmV0dXJuIFtcbiAgICAodlswXSAqIG1bMF0gKyB2WzFdICogbVszXSArIG1bNl0pIC8gZCxcbiAgICAodlswXSAqIG1bMV0gKyB2WzFdICogbVs0XSArIG1bN10pIC8gZFxuICBdXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbnZlcnNlKG06IG51bWJlcltdKTogbnVtYmVyW10ge1xuICBjb25zdCB0MDAgPSBtWzRdICogbVs4XSAtIG1bNV0gKiBtWzddXG4gIGNvbnN0IHQxMCA9IG1bMV0gKiBtWzhdIC0gbVsyXSAqIG1bN11cbiAgY29uc3QgdDIwID0gbVsxXSAqIG1bNV0gLSBtWzJdICogbVs0XVxuICBjb25zdCBkID0gMS4wIC8gKG1bMF0gKiB0MDAgLSBtWzNdICogdDEwICsgbVs2XSAqIHQyMClcbiAgcmV0dXJuIFtcbiAgICAgZCAqIHQwMCwgLWQgKiB0MTAsIGQgKiB0MjAsXG4gICAgLWQgKiAobVszXSAqIG1bOF0gLSBtWzVdICogbVs2XSksXG4gICAgIGQgKiAobVswXSAqIG1bOF0gLSBtWzJdICogbVs2XSksXG4gICAgLWQgKiAobVswXSAqIG1bNV0gLSBtWzJdICogbVszXSksXG4gICAgIGQgKiAobVszXSAqIG1bN10gLSBtWzRdICogbVs2XSksXG4gICAgLWQgKiAobVswXSAqIG1bN10gLSBtWzFdICogbVs2XSksXG4gICAgIGQgKiAobVswXSAqIG1bNF0gLSBtWzFdICogbVszXSlcbiAgXVxufVxuIiwiZXhwb3J0IGNvbnN0IFZFUlRFWF9URU1QTEFURSA9XG5gXG5wcmVjaXNpb24gbG93cCBmbG9hdDtcbmF0dHJpYnV0ZSBsb3dwIHZlYzIgYV9wb3NpdGlvbjtcbmF0dHJpYnV0ZSBmbG9hdCBhX2NvbG9yO1xuYXR0cmlidXRlIGZsb2F0IGFfc2l6ZTtcbmF0dHJpYnV0ZSBmbG9hdCBhX3NoYXBlO1xudW5pZm9ybSBsb3dwIG1hdDMgdV9tYXRyaXg7XG52YXJ5aW5nIGxvd3AgdmVjMyB2X2NvbG9yO1xudmFyeWluZyBmbG9hdCB2X3NoYXBlO1xudm9pZCBtYWluKCkge1xuICBnbF9Qb3NpdGlvbiA9IHZlYzQoKHVfbWF0cml4ICogdmVjMyhhX3Bvc2l0aW9uLCAxKSkueHksIDAuMCwgMS4wKTtcbiAgZ2xfUG9pbnRTaXplID0gYV9zaXplO1xuICB2X3NoYXBlID0gYV9zaGFwZTtcbiAge0NPTE9SLVNFTEVDVElPTn1cbn1cbmBcblxuZXhwb3J0IGNvbnN0IEZSQUdNRU5UX1RFTVBMQVRFID1cbmBcbnByZWNpc2lvbiBsb3dwIGZsb2F0O1xudmFyeWluZyB2ZWMzIHZfY29sb3I7XG52YXJ5aW5nIGZsb2F0IHZfc2hhcGU7XG57U0hBUEVTLUZVTkNUSU9OU31cbnZvaWQgbWFpbigpIHtcbiAge1NIQVBFLVNFTEVDVElPTn1cbiAgZ2xfRnJhZ0NvbG9yID0gdmVjNCh2X2NvbG9yLnJnYiwgMS4wKTtcbn1cbmBcblxuZXhwb3J0IGNvbnN0IFNIQVBFUzogc3RyaW5nW10gPSBbXVxuXG5TSEFQRVNbMF0gPSAgLy8g0JrQstCw0LTRgNCw0YJcbmBcbmBcblxuU0hBUEVTWzFdID0gIC8vINCa0YDRg9CzXG5gXG5pZiAobGVuZ3RoKGdsX1BvaW50Q29vcmQgLSAwLjUpID4gMC41KSBkaXNjYXJkO1xuYFxuXG5TSEFQRVNbMl0gPSAgLy8g0JrRgNC10YHRglxuYFxuaWYgKChhbGwobGVzc1RoYW4oZ2xfUG9pbnRDb29yZCwgdmVjMigwLjMpKSkpIHx8XG4gICgoZ2xfUG9pbnRDb29yZC54ID4gMC43KSAmJiAoZ2xfUG9pbnRDb29yZC55IDwgMC4zKSkgfHxcbiAgKGFsbChncmVhdGVyVGhhbihnbF9Qb2ludENvb3JkLCB2ZWMyKDAuNykpKSkgfHxcbiAgKChnbF9Qb2ludENvb3JkLnggPCAwLjMpICYmIChnbF9Qb2ludENvb3JkLnkgPiAwLjcpKVxuICApIGRpc2NhcmQ7XG5gXG5cblNIQVBFU1szXSA9ICAvLyDQotGA0LXRg9Cz0L7Qu9GM0L3QuNC6XG5gXG52ZWMyIHBvcyA9IHZlYzIoZ2xfUG9pbnRDb29yZC54LCBnbF9Qb2ludENvb3JkLnkgLSAwLjEpIC0gMC41O1xuZmxvYXQgYSA9IGF0YW4ocG9zLngsIHBvcy55KSArIDIuMDk0Mzk1MTAyMzk7XG5pZiAoc3RlcCgwLjI4NSwgY29zKGZsb29yKDAuNSArIGEgLyAyLjA5NDM5NTEwMjM5KSAqIDIuMDk0Mzk1MTAyMzkgLSBhKSAqIGxlbmd0aChwb3MpKSA+IDAuOSkgZGlzY2FyZDtcbmBcblxuU0hBUEVTWzRdID0gIC8vINCo0LXRgdGC0LXRgNC10L3QutCwXG5gXG52ZWMyIHBvcyA9IHZlYzIoMC41KSAtIGdsX1BvaW50Q29vcmQ7XG5mbG9hdCByID0gbGVuZ3RoKHBvcykgKiAxLjYyO1xuZmxvYXQgYSA9IGF0YW4ocG9zLnksIHBvcy54KTtcbmZsb2F0IGYgPSBjb3MoYSAqIDMuMCk7XG5mID0gc3RlcCgwLjAsIGNvcyhhICogMTAuMCkpICogMC4yICsgMC41O1xuaWYgKCBzdGVwKGYsIHIpID4gMC41ICkgZGlzY2FyZDtcbmBcbiIsImltcG9ydCBTUGxvdCBmcm9tICdAL3NwbG90J1xuaW1wb3J0ICogYXMgbTMgZnJvbSAnQC9tYXRoM3gzJ1xuXG4vKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICpcbiAqINCa0LvQsNGB0YEt0YXQtdC70L/QtdGALCDRgNC10LDQu9C40LfRg9GO0YnQuNC5INC+0LHRgNCw0LHQvtGC0LrRgyDRgdGA0LXQtNGB0YLQsiDQstCy0L7QtNCwICjQvNGL0YjQuCwg0YLRgNC10LrQv9Cw0LTQsCDQuCDRgi7Qvy4pINC4INC80LDRgtC10LzQsNGC0LjRh9C10YHQutC40LUg0YDQsNGB0YfQtdGC0Ysg0YLQtdGF0L3QuNGH0LXRgdC60LjRhSDQtNCw0L3QvdGL0YUsXG4gKiDRgdC+0L7RgtCy0LXRgtGB0LLRg9GO0YnQuNGFINGC0YDQsNC90YHRhNC+0YDQvNCw0YbQuNGP0Lwg0LPRgNCw0YTQuNC60LAg0LTQu9GPINC60LvQsNGB0YHQsCBTcGxvdC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU1Bsb3RDb250b2wgaW1wbGVtZW50cyBTUGxvdEhlbHBlciB7XG5cbiAgLyoqINCi0LXRhdC90LjRh9C10YHQutCw0Y8g0LjQvdGE0L7RgNC80LDRhtC40Y8sINC40YHQv9C+0LvRjNC30YPQtdC80LDRjyDQv9GA0LjQu9C+0LbQtdC90LjQtdC8INC00LvRjyDRgNCw0YHRh9C10YLQsCDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuS4gKi9cbiAgcHVibGljIHRyYW5zZm9ybTogU1Bsb3RUcmFuc2Zvcm0gPSB7XG4gICAgdmlld1Byb2plY3Rpb25NYXQ6IFtdLFxuICAgIHN0YXJ0SW52Vmlld1Byb2pNYXQ6IFtdLFxuICAgIHN0YXJ0Q2FtZXJhOiB7IHg6IDAsIHk6IDAsIHpvb206IDEgfSxcbiAgICBzdGFydFBvczogW10sXG4gICAgc3RhcnRDbGlwUG9zOiBbXSxcbiAgICBzdGFydE1vdXNlUG9zOiBbXVxuICB9XG5cbiAgLyoqINCf0YDQuNC30L3QsNC6INGC0L7Qs9C+LCDRh9GC0L4g0YXQtdC70L/QtdGAINGD0LbQtSDQvdCw0YHRgtGA0L7QtdC9LiAqL1xuICBwdWJsaWMgaXNTZXR1cGVkOiBib29sZWFuID0gZmFsc2VcblxuICAvKiog0J7QsdGA0LDQsdC+0YLRh9C40LrQuCDRgdC+0LHRi9GC0LjQuSDRgSDQt9Cw0LrRgNC10L/Qu9C10L3QvdGL0LzQuCDQutC+0L3RgtC10LrRgdGC0LDQvNC4LiAqL1xuICBwcm90ZWN0ZWQgaGFuZGxlTW91c2VEb3duV2l0aENvbnRleHQ6IEV2ZW50TGlzdGVuZXIgPSB0aGlzLmhhbmRsZU1vdXNlRG93bi5iaW5kKHRoaXMpIGFzIEV2ZW50TGlzdGVuZXJcbiAgcHJvdGVjdGVkIGhhbmRsZU1vdXNlV2hlZWxXaXRoQ29udGV4dDogRXZlbnRMaXN0ZW5lciA9IHRoaXMuaGFuZGxlTW91c2VXaGVlbC5iaW5kKHRoaXMpIGFzIEV2ZW50TGlzdGVuZXJcbiAgcHJvdGVjdGVkIGhhbmRsZU1vdXNlTW92ZVdpdGhDb250ZXh0OiBFdmVudExpc3RlbmVyID0gdGhpcy5oYW5kbGVNb3VzZU1vdmUuYmluZCh0aGlzKSBhcyBFdmVudExpc3RlbmVyXG4gIHByb3RlY3RlZCBoYW5kbGVNb3VzZVVwV2l0aENvbnRleHQ6IEV2ZW50TGlzdGVuZXIgPSB0aGlzLmhhbmRsZU1vdXNlVXAuYmluZCh0aGlzKSBhcyBFdmVudExpc3RlbmVyXG5cbiAgLyoqINCl0LXQu9C/0LXRgCDQsdGD0LTQtdGCINC40LzQtdGC0Ywg0L/QvtC70L3Ri9C5INC00L7RgdGC0YPQvyDQuiDRjdC60LfQtdC80L/Qu9GP0YDRgyBTUGxvdC4gKi9cbiAgY29uc3RydWN0b3IoXG4gICAgcmVhZG9ubHkgc3Bsb3Q6IFNQbG90XG4gICkgeyB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0J/QvtC00LPQvtGC0LDQstC70LjQstCw0LXRgiDRhdC10LvQv9C10YAg0Log0LjRgdC/0L7Qu9GM0LfQvtCy0LDQvdC40Y4uXG4gICAqL1xuICBzZXR1cCgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuaXNTZXR1cGVkKSB7XG4gICAgICB0aGlzLmlzU2V0dXBlZCA9IHRydWVcbiAgICB9XG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQl9Cw0L/Rg9GB0LrQsNC10YIg0L/RgNC+0YHQu9GD0YjQutGDINGB0L7QsdGL0YLQuNC5INC80YvRiNC4LlxuICAgKi9cbiAgcHVibGljIHJ1bigpOiB2b2lkIHtcbiAgICB0aGlzLnNwbG90LmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLmhhbmRsZU1vdXNlRG93bldpdGhDb250ZXh0KVxuICAgIHRoaXMuc3Bsb3QuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ3doZWVsJywgdGhpcy5oYW5kbGVNb3VzZVdoZWVsV2l0aENvbnRleHQpXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQntGB0YLQsNC90LDQstC70LjQstCw0LXRgiDQv9GA0L7RgdC70YPRiNC60YMg0YHQvtCx0YvRgtC40Lkg0LzRi9GI0LguXG4gICAqL1xuICBwdWJsaWMgc3RvcCgpOiB2b2lkIHtcbiAgICB0aGlzLnNwbG90LmNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLmhhbmRsZU1vdXNlRG93bldpdGhDb250ZXh0KVxuICAgIHRoaXMuc3Bsb3QuY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3doZWVsJywgdGhpcy5oYW5kbGVNb3VzZVdoZWVsV2l0aENvbnRleHQpXG4gICAgdGhpcy5zcGxvdC5jYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5oYW5kbGVNb3VzZU1vdmVXaXRoQ29udGV4dClcbiAgICB0aGlzLnNwbG90LmNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5oYW5kbGVNb3VzZVVwV2l0aENvbnRleHQpXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQodC+0LfQtNCw0LXRgiDQvNCw0YLRgNC40YbRgyDQtNC70Y8g0YLQtdC60YPRidC10LPQviDQv9C+0LvQvtC20LXQvdC40Y8g0L7QsdC70LDRgdGC0Lgg0L/RgNC+0YHQvNC+0YLRgNCwLlxuICAgKi9cbiAgcHJvdGVjdGVkIG1ha2VDYW1lcmFNYXRyaXgoKTogbnVtYmVyW10ge1xuXG4gICAgY29uc3Qgem9vbVNjYWxlID0gMSAvIHRoaXMuc3Bsb3QuY2FtZXJhLnpvb20hXG5cbiAgICBsZXQgY2FtZXJhTWF0ID0gbTMuaWRlbnRpdHkoKVxuICAgIGNhbWVyYU1hdCA9IG0zLnRyYW5zbGF0ZShjYW1lcmFNYXQsIHRoaXMuc3Bsb3QuY2FtZXJhLnghLCB0aGlzLnNwbG90LmNhbWVyYS55ISlcbiAgICBjYW1lcmFNYXQgPSBtMy5zY2FsZShjYW1lcmFNYXQsIHpvb21TY2FsZSwgem9vbVNjYWxlKVxuXG4gICAgcmV0dXJuIGNhbWVyYU1hdFxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0J7QsdC90L7QstC70Y/QtdGCINC80LDRgtGA0LjRhtGDINGC0YDQsNC90YHRhNC+0YDQvNCw0YbQuNC4LlxuICAgKi9cbiAgcHVibGljIHVwZGF0ZVZpZXdQcm9qZWN0aW9uKCk6IHZvaWQge1xuICAgIGNvbnN0IHByb2plY3Rpb25NYXQgPSBtMy5wcm9qZWN0aW9uKHRoaXMuc3Bsb3QuY2FudmFzLndpZHRoLCB0aGlzLnNwbG90LmNhbnZhcy5oZWlnaHQpXG4gICAgY29uc3QgY2FtZXJhTWF0ID0gdGhpcy5tYWtlQ2FtZXJhTWF0cml4KClcbiAgICBsZXQgdmlld01hdCA9IG0zLmludmVyc2UoY2FtZXJhTWF0KVxuICAgIHRoaXMudHJhbnNmb3JtLnZpZXdQcm9qZWN0aW9uTWF0ID0gbTMubXVsdGlwbHkocHJvamVjdGlvbk1hdCwgdmlld01hdClcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCf0YDQtdC+0LHRgNCw0LfRg9C10YIg0LrQvtC+0YDQtNC40L3QsNGC0Ysg0LzRi9GI0Lgg0LIgR0wt0LrQvtC+0YDQtNC40L3QsNGC0YsuXG4gICAqL1xuICBwcm90ZWN0ZWQgZ2V0Q2xpcFNwYWNlTW91c2VQb3NpdGlvbihldmVudDogTW91c2VFdmVudCk6IG51bWJlcltdIHtcblxuICAgIC8qKiDQoNCw0YHRh9C10YIg0L/QvtC70L7QttC10L3QuNGPINC60LDQvdCy0LDRgdCwINC/0L4g0L7RgtC90L7RiNC10L3QuNGOINC6INC80YvRiNC4LiAqL1xuICAgIGNvbnN0IHJlY3QgPSB0aGlzLnNwbG90LmNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgIGNvbnN0IGNzc1ggPSBldmVudC5jbGllbnRYIC0gcmVjdC5sZWZ0XG4gICAgY29uc3QgY3NzWSA9IGV2ZW50LmNsaWVudFkgLSByZWN0LnRvcFxuXG4gICAgLyoqINCd0L7RgNC80LDQu9C40LfQsNGG0LjRjyDQutC+0L7RgNC00LjQvdCw0YIgWzAuLjFdICovXG4gICAgY29uc3Qgbm9ybVggPSBjc3NYIC8gdGhpcy5zcGxvdC5jYW52YXMuY2xpZW50V2lkdGhcbiAgICBjb25zdCBub3JtWSA9IGNzc1kgLyB0aGlzLnNwbG90LmNhbnZhcy5jbGllbnRIZWlnaHRcblxuICAgIC8qKiDQn9C+0LvRg9GH0LXQvdC40LUgR0wt0LrQvtC+0YDQtNC40L3QsNGCIFstMS4uMV0gKi9cbiAgICBjb25zdCBjbGlwWCA9IG5vcm1YICogMiAtIDFcbiAgICBjb25zdCBjbGlwWSA9IG5vcm1ZICogLTIgKyAxXG5cbiAgICByZXR1cm4gW2NsaXBYLCBjbGlwWV1cbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCf0LXRgNC10LzQtdGJ0LDQtdGCINC+0LHQu9Cw0YHRgtGMINCy0LjQtNC40LzQvtGB0YLQuC5cbiAgICovXG4gIHByb3RlY3RlZCBtb3ZlQ2FtZXJhKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG5cbiAgICBjb25zdCBwb3MgPSBtMy50cmFuc2Zvcm1Qb2ludCh0aGlzLnRyYW5zZm9ybS5zdGFydEludlZpZXdQcm9qTWF0LCB0aGlzLmdldENsaXBTcGFjZU1vdXNlUG9zaXRpb24oZXZlbnQpKVxuXG4gICAgdGhpcy5zcGxvdC5jYW1lcmEueCA9IHRoaXMudHJhbnNmb3JtLnN0YXJ0Q2FtZXJhLnghICsgdGhpcy50cmFuc2Zvcm0uc3RhcnRQb3NbMF0gLSBwb3NbMF1cbiAgICB0aGlzLnNwbG90LmNhbWVyYS55ID0gdGhpcy50cmFuc2Zvcm0uc3RhcnRDYW1lcmEueSEgKyB0aGlzLnRyYW5zZm9ybS5zdGFydFBvc1sxXSAtIHBvc1sxXVxuXG4gICAgdGhpcy5zcGxvdC5yZW5kZXIoKVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0KDQtdCw0LPQuNGA0YPQtdGCINC90LAg0LTQstC40LbQtdC90LjQtSDQvNGL0YjQuCDQsiDQvNC+0LzQtdC90YIsINC60L7Qs9C00LAg0LXQtSDQutC70LDQstC40YjQsCDRg9C00LXRgNC20LjQstCw0LXRgtGB0Y8g0L3QsNC20LDRgtC+0LkuINCc0LXRgtC+0LQg0L/QtdGA0LXQvNC10YnQsNC10YIg0L7QsdC70LDRgdGC0Ywg0LLQuNC00LjQvNC+0YHRgtC4INC90LBcbiAgICog0L/Qu9C+0YHQutC+0YHRgtC4INCy0LzQtdGB0YLQtSDRgSDQtNCy0LjQttC10L3QuNC10Lwg0LzRi9GI0LguXG4gICAqL1xuICBwcm90ZWN0ZWQgaGFuZGxlTW91c2VNb3ZlKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG4gICAgdGhpcy5tb3ZlQ2FtZXJhKGV2ZW50KVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0KDQtdCw0LPQuNGA0YPQtdGCINC90LAg0L7RgtC20LDRgtC40LUg0LrQu9Cw0LLQuNGI0Lgg0LzRi9GI0LguINCSINC80L7QvNC10L3RgiDQvtGC0LbQsNGC0LjRjyDQutC70LDQstC40YjQuCDQsNC90LDQu9C40Lcg0LTQstC40LbQtdC90LjRjyDQvNGL0YjQuCDRgSDQt9Cw0LbQsNGC0L7QuSDQutC70LDQstC40YjQtdC5INC/0YDQtdC60YDQsNGJ0LDQtdGC0YHRjy5cbiAgICovXG4gIHByb3RlY3RlZCBoYW5kbGVNb3VzZVVwKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG5cbiAgICB0aGlzLnNwbG90LnJlbmRlcigpXG5cbiAgICBldmVudC50YXJnZXQhLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMuaGFuZGxlTW91c2VNb3ZlV2l0aENvbnRleHQpXG4gICAgZXZlbnQudGFyZ2V0IS5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5oYW5kbGVNb3VzZVVwV2l0aENvbnRleHQpXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQoNC10LDQs9C40YDRg9C10YIg0L3QsCDQvdCw0LbQsNGC0LjQtSDQutC70LDQstC40YjQuCDQvNGL0YjQuC4g0JIg0LzQvtC80LXQvdGCINC90LDQttCw0YLQuNGPINC4INGD0LTQtdGA0LbQsNC90LjRjyDQutC70LDQstC40YjQuCDQt9Cw0L/Rg9GB0LrQsNC10YLRgdGPINCw0L3QsNC70LjQtyDQtNCy0LjQttC10L3QuNGPINC80YvRiNC4ICjRgSDQt9Cw0LbQsNGC0L7QuVxuICAgKiDQutC70LDQstC40YjQtdC5KS5cbiAgICovXG4gIHByb3RlY3RlZCBoYW5kbGVNb3VzZURvd24oZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcblxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcblxuICAgIHRoaXMuc3Bsb3QuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMuaGFuZGxlTW91c2VNb3ZlV2l0aENvbnRleHQpXG4gICAgdGhpcy5zcGxvdC5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuaGFuZGxlTW91c2VVcFdpdGhDb250ZXh0KVxuXG4gICAgLyoqINCg0LDRgdGH0LXRgiDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuS4gKi9cbiAgICB0aGlzLnRyYW5zZm9ybS5zdGFydEludlZpZXdQcm9qTWF0ID0gbTMuaW52ZXJzZSh0aGlzLnRyYW5zZm9ybS52aWV3UHJvamVjdGlvbk1hdClcbiAgICB0aGlzLnRyYW5zZm9ybS5zdGFydENhbWVyYSA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3Bsb3QuY2FtZXJhKVxuICAgIHRoaXMudHJhbnNmb3JtLnN0YXJ0Q2xpcFBvcyA9IHRoaXMuZ2V0Q2xpcFNwYWNlTW91c2VQb3NpdGlvbihldmVudClcbiAgICB0aGlzLnRyYW5zZm9ybS5zdGFydFBvcyA9IG0zLnRyYW5zZm9ybVBvaW50KHRoaXMudHJhbnNmb3JtLnN0YXJ0SW52Vmlld1Byb2pNYXQsIHRoaXMudHJhbnNmb3JtLnN0YXJ0Q2xpcFBvcylcbiAgICB0aGlzLnRyYW5zZm9ybS5zdGFydE1vdXNlUG9zID0gW2V2ZW50LmNsaWVudFgsIGV2ZW50LmNsaWVudFldXG5cbiAgICB0aGlzLnNwbG90LnJlbmRlcigpXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQoNC10LDQs9C40YDRg9C10YIg0L3QsCDQt9GD0LzQuNGA0L7QstCw0L3QuNC1INC80YvRiNC4LiDQkiDQvNC+0LzQtdC90YIg0LfRg9C80LjRgNC+0LLQsNC90LjRjyDQvNGL0YjQuCDQv9GA0L7QuNGB0YXQvtC00LjRgiDQt9GD0LzQuNGA0L7QstCw0L3QuNC1INC60L7QvtGA0LTQuNC90LDRgtC90L7QuSDQv9C70L7RgdC60L7RgdGC0LguXG4gICAqL1xuICBwcm90ZWN0ZWQgaGFuZGxlTW91c2VXaGVlbChldmVudDogV2hlZWxFdmVudCk6IHZvaWQge1xuXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuXG4gICAgLyoqINCS0YvRh9C40YHQu9C10L3QuNC1INC/0L7Qt9C40YbQuNC4INC80YvRiNC4INCyIEdMLdC60L7QvtGA0LTQuNC90LDRgtCw0YUuICovXG4gICAgY29uc3QgW2NsaXBYLCBjbGlwWV0gPSB0aGlzLmdldENsaXBTcGFjZU1vdXNlUG9zaXRpb24oZXZlbnQpXG5cbiAgICAvKiog0J/QvtC30LjRhtC40Y8g0LzRi9GI0Lgg0LTQviDQt9GD0LzQuNGA0L7QstCw0L3QuNGPLiAqL1xuICAgIGNvbnN0IFtwcmVab29tWCwgcHJlWm9vbVldID0gbTMudHJhbnNmb3JtUG9pbnQobTMuaW52ZXJzZSh0aGlzLnRyYW5zZm9ybS52aWV3UHJvamVjdGlvbk1hdCksIFtjbGlwWCwgY2xpcFldKVxuXG4gICAgLyoqINCd0L7QstC+0LUg0LfQvdCw0YfQtdC90LjQtSDQt9GD0LzQsCDQvtCx0LvQsNGB0YLQuCDQv9GA0L7RgdC80L7RgtGA0LAg0Y3QutGB0L/QvtC90LXQvdGG0LjQsNC70YzQvdC+INC30LDQstC40YHQuNGCINC+0YIg0LLQtdC70LjRh9C40L3RiyDQt9GD0LzQuNGA0L7QstCw0L3QuNGPINC80YvRiNC4LiAqL1xuICAgIGNvbnN0IG5ld1pvb20gPSB0aGlzLnNwbG90LmNhbWVyYS56b29tISAqIE1hdGgucG93KDIsIGV2ZW50LmRlbHRhWSAqIC0wLjAxKVxuXG4gICAgLyoqINCc0LDQutGB0LjQvNCw0LvRjNC90L7QtSDQuCDQvNC40L3QuNC80LDQu9GM0L3QvtC1INC30L3QsNGH0LXQvdC40Y8g0LfRg9C80LAg0L7QsdC70LDRgdGC0Lgg0L/RgNC+0YHQvNC+0YLRgNCwLiAqL1xuICAgIHRoaXMuc3Bsb3QuY2FtZXJhLnpvb20gPSBNYXRoLm1heCgwLjAwMiwgTWF0aC5taW4oMjAwLCBuZXdab29tKSlcblxuICAgIC8qKiDQntCx0L3QvtCy0LvQtdC90LjQtSDQvNCw0YLRgNC40YbRiyDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuC4gKi9cbiAgICB0aGlzLnVwZGF0ZVZpZXdQcm9qZWN0aW9uKClcblxuICAgIC8qKiDQn9C+0LfQuNGG0LjRjyDQvNGL0YjQuCDQv9C+0YHQu9C1INC30YPQvNC40YDQvtCy0LDQvdC40Y8uICovXG4gICAgY29uc3QgW3Bvc3Rab29tWCwgcG9zdFpvb21ZXSA9IG0zLnRyYW5zZm9ybVBvaW50KG0zLmludmVyc2UodGhpcy50cmFuc2Zvcm0udmlld1Byb2plY3Rpb25NYXQpLCBbY2xpcFgsIGNsaXBZXSlcblxuICAgIC8qKiDQktGL0YfQuNGB0LvQtdC90LjQtSDQvdC+0LLQvtCz0L4g0L/QvtC70L7QttC10L3QuNGPINC+0LHQu9Cw0YHRgtC4INC/0YDQvtGB0LzQvtGC0YDQsCDQv9C+0YHQu9C1INC30YPQvNC40YDQvtCy0LDQvdC40Y8uICovXG4gICAgdGhpcy5zcGxvdC5jYW1lcmEueCEgKz0gcHJlWm9vbVggLSBwb3N0Wm9vbVhcbiAgICB0aGlzLnNwbG90LmNhbWVyYS55ISArPSBwcmVab29tWSAtIHBvc3Rab29tWVxuXG4gICAgdGhpcy5zcGxvdC5yZW5kZXIoKVxuICB9XG59XG4iLCJpbXBvcnQgU1Bsb3QgZnJvbSAnQC9zcGxvdCdcbmltcG9ydCB7IGdldEN1cnJlbnRUaW1lIH0gZnJvbSAnQC91dGlscydcblxuLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqXG4gKiDQmtC70LDRgdGBLdGF0LXQu9C/0LXRgCwg0YDQtdCw0LvQuNC30YPRjtGJ0LjQuSDQv9C+0LTQtNC10YDQttC60YMg0YDQtdC20LjQvNCwINC+0YLQu9Cw0LTQutC4INC00LvRjyDQutC70LDRgdGB0LAgU1Bsb3QuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNQbG90RGVidWcgaW1wbGVtZW50cyBTUGxvdEhlbHBlciB7XG5cbiAgLyoqINCf0YDQuNC30L3QsNC6INCw0LrRgtC40LLQsNGG0LjQuCDRgNC10LbQuNC8INC+0YLQu9Cw0LTQutC4LiAqL1xuICBwdWJsaWMgaXNFbmFibGU6IGJvb2xlYW4gPSBmYWxzZVxuXG4gIC8qKiDQodGC0LjQu9GMINC30LDQs9C+0LvQvtCy0LrQsCDRgNC10LbQuNC80LAg0L7RgtC70LDQtNC60LguICovXG4gIHB1YmxpYyBoZWFkZXJTdHlsZTogc3RyaW5nID0gJ2ZvbnQtd2VpZ2h0OiBib2xkOyBjb2xvcjogI2ZmZmZmZjsgYmFja2dyb3VuZC1jb2xvcjogI2NjMDAwMDsnXG5cbiAgLyoqINCh0YLQuNC70Ywg0LfQsNCz0L7Qu9C+0LLQutCwINCz0YDRg9C/0L/RiyDQv9Cw0YDQsNC80LXRgtGA0L7Qsi4gKi9cbiAgcHVibGljIGdyb3VwU3R5bGU6IHN0cmluZyA9ICdmb250LXdlaWdodDogYm9sZDsgY29sb3I6ICNmZmZmZmY7J1xuXG4gIC8qKiDQn9GA0LjQt9C90LDQuiDRgtC+0LPQviwg0YfRgtC+INGF0LXQu9C/0LXRgCDRg9C20LUg0L3QsNGB0YLRgNC+0LXQvS4gKi9cbiAgcHVibGljIGlzU2V0dXBlZDogYm9vbGVhbiA9IGZhbHNlXG5cbiAgLyoqINCl0LXQu9C/0LXRgCDQsdGD0LTQtdGCINC40LzQtdGC0Ywg0L/QvtC70L3Ri9C5INC00L7RgdGC0YPQvyDQuiDRjdC60LfQtdC80L/Qu9GP0YDRgyBTUGxvdC4gKi9cbiAgY29uc3RydWN0b3IoXG4gICAgcmVhZG9ubHkgc3Bsb3Q6IFNQbG90XG4gICkge31cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQn9C+0LTQs9C+0YLQsNCy0LvQuNCy0LDQtdGCINGF0LXQu9C/0LXRgCDQuiDQuNGB0L/QvtC70YzQt9C+0LLQsNC90LjRji5cbiAgICovXG4gIHB1YmxpYyBzZXR1cChjbGVhckNvbnNvbGU6IGJvb2xlYW4gPSBmYWxzZSk6IHZvaWQge1xuXG4gICAgaWYgKCF0aGlzLmlzU2V0dXBlZCkge1xuXG4gICAgICBpZiAoY2xlYXJDb25zb2xlKSB7XG4gICAgICAgIGNvbnNvbGUuY2xlYXIoKVxuICAgICAgfVxuXG4gICAgICB0aGlzLmlzU2V0dXBlZCA9IHRydWVcbiAgICB9XG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQktGL0LLQvtC00LjRgiDQsiDQutC+0L3RgdC+0LvRjCDQvtGC0LvQsNC00L7Rh9C90YPRjiDQuNC90YTQvtGA0LzQsNGG0LjRjiwg0LXRgdC70Lgg0LLQutC70Y7Rh9C10L0g0YDQtdC20LjQvCDQvtGC0LvQsNC00LrQuC5cbiAgICpcbiAgICogQHJlbWFya3NcbiAgICog0J7RgtC70LDQtNC+0YfQvdCw0Y8g0LjQvdGE0L7RgNC80LDRhtC40Y8g0LLRi9Cy0L7QtNC40YLRgdGPINCx0LvQvtC60LDQvNC4LiDQndCw0LfQstCw0L3QuNGPINCx0LvQvtC60L7QsiDQv9C10YDQtdC00LDRjtGC0YHRjyDQsiDQvNC10YLQvtC0INC/0LXRgNC10YfQuNGB0LvQtdC90LjQtdC8INGB0YLRgNC+0LouINCa0LDQttC00LDRjyDRgdGC0YDQvtC60LBcbiAgICog0LjQvdGC0LXRgNC/0YDQtdGC0LjRgNGD0LXRgtGB0Y8g0LrQsNC6INC40LzRjyDQvNC10YLQvtC00LAuINCV0YHQu9C4INC90YPQttC90YvQtSDQvNC10YLQvtC00Ysg0LLRi9Cy0L7QtNCwINCx0LvQvtC60LAg0YHRg9GJ0LXRgdGC0LLRg9GO0YIgLSDQvtC90Lgg0LLRi9C30YvQstCw0Y7RgtGB0Y8uINCV0YHQu9C4INC80LXRgtC+0LTQsCDRgSDQvdGD0LbQvdGL0LxcbiAgICog0L3QsNC30LLQsNC90LjQtdC8INC90LUg0YHRg9GJ0LXRgdGC0LLRg9C10YIgLSDQs9C10L3QtdGA0LjRgNGD0LXRgtGB0Y8g0L7RiNC40LHQutCwLlxuICAgKlxuICAgKiBAcGFyYW0gbG9nSXRlbXMgLSDQn9C10YDQtdGH0LjRgdC70LXQvdC40LUg0YHRgtGA0L7QuiDRgSDQvdCw0LfQstCw0L3QuNGP0LzQuCDQvtGC0LvQsNC00L7Rh9C90YvRhSDQsdC70L7QutC+0LIsINC60L7RgtC+0YDRi9C1INC90YPQttC90L4g0L7RgtC+0LHRgNCw0LfQuNGC0Ywg0LIg0LrQvtC90YHQvtC70LguXG4gICAqL1xuICBwdWJsaWMgbG9nKC4uLmxvZ0l0ZW1zOiBzdHJpbmdbXSk6IHZvaWQge1xuICAgIGlmICh0aGlzLmlzRW5hYmxlKSB7XG4gICAgICBsb2dJdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICBpZiAodHlwZW9mICh0aGlzIGFzIGFueSlbaXRlbV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAodGhpcyBhcyBhbnkpW2l0ZW1dKClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ9Ce0YLQu9Cw0LTQvtGH0L3QvtCz0L4g0LHQu9C+0LrQsCAnICsgaXRlbSArICdcIiDQvdC1INGB0YPRidC10YHRgtCy0YPQtdGCIScpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JLRi9Cy0L7QtNC40YIg0YHQvtC+0LHRidC10L3QuNC1INC+0LEg0L7RiNC40LHQutC1LlxuICAgKi9cbiAgcHVibGljIGVycm9yKG1lc3NhZ2U6IHN0cmluZyk6IHZvaWQge1xuICAgIGlmICh0aGlzLmlzRW5hYmxlKSB7XG4gICAgICBjb25zb2xlLmVycm9yKG1lc3NhZ2UpXG4gICAgfVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JLRi9Cy0L7QtNC40YIg0LLRgdGC0YPQv9C40YLQtdC70YzQvdGD0Y4g0YfQsNGB0YLRjCDQviDRgNC10LbQuNC80LUg0L7RgtC70LDQtNC60LguXG4gICAqL1xuICBwdWJsaWMgaW50cm8oKTogdm9pZCB7XG4gICAgY29uc29sZS5sb2coJyVj0J7RgtC70LDQtNC60LAgU1Bsb3Qg0L3QsCDQvtCx0YrQtdC60YLQtSAjJyArIHRoaXMuc3Bsb3QuY2FudmFzLmlkLCB0aGlzLmhlYWRlclN0eWxlKVxuXG4gICAgaWYgKHRoaXMuc3Bsb3QuZGVtby5pc0VuYWJsZSkge1xuICAgICAgY29uc29sZS5sb2coJyVj0JLQutC70Y7Rh9C10L0g0LTQtdC80L7QvdGB0YLRgNCw0YbQuNC+0L3QvdGL0Lkg0YDQtdC20LjQvCDQtNCw0L3QvdGL0YUnLCB0aGlzLmdyb3VwU3R5bGUpXG4gICAgfVxuXG4gICAgY29uc29sZS5ncm91cCgnJWPQn9GA0LXQtNGD0L/RgNC10LbQtNC10L3QuNC1JywgdGhpcy5ncm91cFN0eWxlKVxuICAgIGNvbnNvbGUubG9nKCfQntGC0LrRgNGL0YLQsNGPINC60L7QvdGB0L7Qu9GMINCx0YDQsNGD0LfQtdGA0LAg0Lgg0LTRgNGD0LPQuNC1INCw0LrRgtC40LLQvdGL0LUg0YHRgNC10LTRgdGC0LLQsCDQutC+0L3RgtGA0L7Qu9GPINGA0LDQt9GA0LDQsdC+0YLQutC4INGB0YPRidC10YHRgtCy0LXQvdC90L4g0YHQvdC40LbQsNGO0YIg0L/RgNC+0LjQt9Cy0L7QtNC40YLQtdC70YzQvdC+0YHRgtGMINCy0YvRgdC+0LrQvtC90LDQs9GA0YPQttC10L3QvdGL0YUg0L/RgNC40LvQvtC20LXQvdC40LkuINCU0LvRjyDQvtCx0YrQtdC60YLQuNCy0L3QvtCz0L4g0LDQvdCw0LvQuNC30LAg0L/RgNC+0LjQt9Cy0L7QtNC40YLQtdC70YzQvdC+0YHRgtC4INCy0YHQtSDQv9C+0LTQvtCx0L3Ri9C1INGB0YDQtdC00YHRgtCy0LAg0LTQvtC70LbQvdGLINCx0YvRgtGMINC+0YLQutC70Y7Rh9C10L3Riywg0LAg0LrQvtC90YHQvtC70Ywg0LHRgHrQsNGD0LfQtdGA0LAg0LfQsNC60YDRi9GC0LAuINCd0LXQutC+0YLQvtGA0YvQtSDQtNCw0L3QvdGL0LUg0L7RgtC70LDQtNC+0YfQvdC+0Lkg0LjQvdGE0L7RgNC80LDRhtC40Lgg0LIg0LfQsNCy0LjRgdC40LzQvtGB0YLQuCDQvtGCINC40YHQv9C+0LvRjNC30YPQtdC80L7Qs9C+INCx0YDQsNGD0LfQtdGA0LAg0LzQvtCz0YPRgiDQvdC1INC+0YLQvtCx0YDQsNC20LDRgtGM0YHRjyDQuNC70Lgg0L7RgtC+0LHRgNCw0LbQsNGC0YzRgdGPINC90LXQutC+0YDRgNC10LrRgtC90L4uINCh0YDQtdC00YHRgtCy0L4g0L7RgtC70LDQtNC60Lgg0L/RgNC+0YLQtdGB0YLQuNGA0L7QstCw0L3QviDQsiDQsdGA0LDRg9C30LXRgNC1IEdvb2dsZSBDaHJvbWUgdi45MCcpXG4gICAgY29uc29sZS5ncm91cEVuZCgpXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQktGL0LLQvtC00LjRgiDQuNC90YTQvtGA0LzQsNGG0LjRjiDQviDQs9GA0LDRhNC40YfQtdGB0LrQvtC5INGB0LjRgdGC0LXQvNC1INC60LvQuNC10L3RgtCwLlxuICAgKi9cbiAgcHVibGljIGdwdSgpOiB2b2lkIHtcbiAgICBjb25zb2xlLmdyb3VwKCclY9CS0LjQtNC10L7RgdC40YHRgtC10LzQsCcsIHRoaXMuZ3JvdXBTdHlsZSlcbiAgICBjb25zb2xlLmxvZygn0JPRgNCw0YTQuNGH0LXRgdC60LDRjyDQutCw0YDRgtCwOiAnICsgdGhpcy5zcGxvdC53ZWJnbC5ncHUuaGFyZHdhcmUpXG4gICAgY29uc29sZS5sb2coJ9CS0LXRgNGB0LjRjyBHTDogJyArIHRoaXMuc3Bsb3Qud2ViZ2wuZ3B1LnNvZnR3YXJlKVxuICAgIGNvbnNvbGUuZ3JvdXBFbmQoKVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JLRi9Cy0L7QtNC40YIg0LjQvdGE0L7RgNC80LDRhtC40Y8g0L4g0YLQtdC60YPRidC10Lwg0Y3QutC30LXQvNC/0LvRj9GA0LUg0LrQu9Cw0YHRgdCwIFNQbG90LlxuICAgKi9cbiAgcHVibGljIGluc3RhbmNlKCk6IHZvaWQge1xuXG4gICAgY29uc29sZS5ncm91cCgnJWPQndCw0YHRgtGA0L7QudC60LAg0L/QsNGA0LDQvNC10YLRgNC+0LIg0Y3QutC30LXQvNC/0LvRj9GA0LAnLCB0aGlzLmdyb3VwU3R5bGUpXG4gICAgY29uc29sZS5kaXIodGhpcy5zcGxvdClcbiAgICBjb25zb2xlLmxvZygn0KDQsNC30LzQtdGAINC60LDQvdCy0LDRgdCwOiAnICsgdGhpcy5zcGxvdC5jYW52YXMud2lkdGggKyAnIHggJyArIHRoaXMuc3Bsb3QuY2FudmFzLmhlaWdodCArICcgcHgnKVxuICAgIGNvbnNvbGUubG9nKCfQoNCw0LfQvNC10YAg0L/Qu9C+0YHQutC+0YHRgtC4OiAnICsgdGhpcy5zcGxvdC5ncmlkLndpZHRoICsgJyB4ICcgKyB0aGlzLnNwbG90LmdyaWQuaGVpZ2h0ICsgJyBweCcpXG5cbiAgICBpZiAodGhpcy5zcGxvdC5kZW1vLmlzRW5hYmxlKSB7XG4gICAgICBjb25zb2xlLmxvZygn0KHQv9C+0YHQvtCxINC/0L7Qu9GD0YfQtdC90LjRjyDQtNCw0L3QvdGL0YU6ICcgKyAn0LTQtdC80L4t0LTQsNC90L3Ri9C1JylcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ9Ch0L/QvtGB0L7QsSDQv9C+0LvRg9GH0LXQvdC40Y8g0LTQsNC90L3Ri9GFOiAnICsgJ9C40YLQtdGA0LjRgNC+0LLQsNC90LjQtScpXG4gICAgfVxuICAgIGNvbnNvbGUuZ3JvdXBFbmQoKVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JLRi9Cy0L7QtNC40YIg0LrQvtC00Ysg0YjQtdC50LTQtdGA0L7Qsi5cbiAgICovXG4gIHB1YmxpYyBzaGFkZXJzKCk6IHZvaWQge1xuICAgIGNvbnNvbGUuZ3JvdXAoJyVj0KHQvtC30LTQsNC9INCy0LXRgNGI0LjQvdC90YvQuSDRiNC10LnQtNC10YA6ICcsIHRoaXMuZ3JvdXBTdHlsZSlcbiAgICBjb25zb2xlLmxvZyh0aGlzLnNwbG90Lmdsc2wudmVydFNoYWRlclNvdXJjZSlcbiAgICBjb25zb2xlLmdyb3VwRW5kKClcbiAgICBjb25zb2xlLmdyb3VwKCclY9Ch0L7Qt9C00LDQvSDRhNGA0LDQs9C80LXQvdGC0L3Ri9C5INGI0LXQudC00LXRgDogJywgdGhpcy5ncm91cFN0eWxlKVxuICAgIGNvbnNvbGUubG9nKHRoaXMuc3Bsb3QuZ2xzbC5mcmFnU2hhZGVyU291cmNlKVxuICAgIGNvbnNvbGUuZ3JvdXBFbmQoKVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JLRi9Cy0L7QtNC40YIg0YHQvtC+0LHRidC10L3QuNC1INC+INC90LDRh9Cw0LvQtSDQv9GA0L7RhtC10YHRgdC1INC30LDQs9GA0YPQt9C60Lgg0LTQsNC90L3Ri9GFLlxuICAgKi9cbiAgcHVibGljIGxvYWRpbmcoKTogdm9pZCB7XG4gICAgY29uc29sZS5sb2coJyVj0JfQsNC/0YPRidC10L0g0L/RgNC+0YbQtdGB0YEg0LfQsNCz0YDRg9C30LrQuCDQtNCw0L3QvdGL0YUgWycgKyBnZXRDdXJyZW50VGltZSgpICsgJ10uLi4nLCB0aGlzLmdyb3VwU3R5bGUpXG4gICAgY29uc29sZS50aW1lKCfQlNC70LjRgtC10LvRjNC90L7RgdGC0YwnKVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JLRi9Cy0L7QtNC40YIg0YHRgtCw0YLQuNGB0YLQuNC60YMg0L/QviDQt9Cw0LLQtdGA0YjQtdC90LjQuCDQv9GA0L7RhtC10YHRgdCwINC30LDQs9GA0YPQt9C60Lgg0LTQsNC90L3Ri9GFLlxuICAgKi9cbiAgcHVibGljIGxvYWRlZCgpOiB2b2lkIHtcbiAgICBjb25zb2xlLmdyb3VwKCclY9CX0LDQs9GA0YPQt9C60LAg0LTQsNC90L3Ri9GFINC30LDQstC10YDRiNC10L3QsCBbJyArIGdldEN1cnJlbnRUaW1lKCkgKyAnXScsIHRoaXMuZ3JvdXBTdHlsZSlcbiAgICBjb25zb2xlLnRpbWVFbmQoJ9CU0LvQuNGC0LXQu9GM0L3QvtGB0YLRjCcpXG4gICAgY29uc29sZS5sb2coJ9Cg0LDRgdGF0L7QtCDQstC40LTQtdC+0L/QsNC80Y/RgtC4OiAnICsgKHRoaXMuc3Bsb3Quc3RhdHMubWVtVXNhZ2UgLyAxMDAwMDAwKS50b0ZpeGVkKDIpLnRvTG9jYWxlU3RyaW5nKCkgKyAnINCc0JEnKVxuICAgIGNvbnNvbGUubG9nKCfQmtC+0Lst0LLQviDQvtCx0YrQtdC60YLQvtCyOiAnICsgdGhpcy5zcGxvdC5zdGF0cy5vYmpUb3RhbENvdW50LnRvTG9jYWxlU3RyaW5nKCkpXG4gICAgY29uc29sZS5sb2coJ9Ca0L7Quy3QstC+INCz0YDRg9C/0L8g0LHRg9GE0LXRgNC+0LI6ICcgKyB0aGlzLnNwbG90LnN0YXRzLmdyb3Vwc0NvdW50LnRvTG9jYWxlU3RyaW5nKCkpXG4gICAgY29uc29sZS5sb2coJ9Cg0LXQt9GD0LvRjNGC0LDRgjogJyArICgodGhpcy5zcGxvdC5zdGF0cy5vYmpUb3RhbENvdW50ID49IHRoaXMuc3Bsb3QuZ2xvYmFsTGltaXQpID9cbiAgICAgICfQtNC+0YHRgtC40LPQvdGD0YIg0LvQuNC80LjRgiDQvtCx0YrQtdC60YLQvtCyICgnICsgdGhpcy5zcGxvdC5nbG9iYWxMaW1pdC50b0xvY2FsZVN0cmluZygpICsgJyknIDpcbiAgICAgICfQvtCx0YDQsNCx0L7RgtCw0L3RiyDQstGB0LUg0L7QsdGK0LXQutGC0YsnKSlcbiAgICBjb25zb2xlLmdyb3VwRW5kKClcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCS0YvQstC+0LTQuNGCINGB0L7QvtCx0YnQtdC90LjQtSDQviDQt9Cw0L/Rg9GB0LrQtSDRgNC10L3QtNC10YDQsC5cbiAgICovXG4gIHB1YmxpYyBzdGFydGVkKCk6IHZvaWQge1xuICAgIGNvbnNvbGUubG9nKCclY9Cg0LXQvdC00LXRgCDQt9Cw0L/Rg9GJ0LXQvScsIHRoaXMuZ3JvdXBTdHlsZSlcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCS0YvQstC+0LTQuNGCINGB0L7QvtCx0YnQtdC90LjQtSDQvtCxINC+0YHRgtCw0L3QvtCy0LrQtSDRgNC10L3QtNC10YDQsC5cbiAgICovXG4gIHB1YmxpYyBzdG9wZWQoKTogdm9pZCB7XG4gICAgY29uc29sZS5sb2coJyVj0KDQtdC90LTQtdGAINC+0YHRgtCw0L3QvtCy0LvQtdC9JywgdGhpcy5ncm91cFN0eWxlKVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JLRi9Cy0L7QtNC40YIg0YHQvtC+0LHRiNC10L3QuNC1INC+0LEg0L7Rh9C40YHRgtC60LUg0L7QsdC70LDRgdGC0Lgg0YDQtdC90LTQtdGA0LAuXG4gICAqL1xuICBwdWJsaWMgY2xlYXJlZChjb2xvcjogc3RyaW5nKTogdm9pZCB7XG4gICAgY29uc29sZS5sb2coJyVj0J7QsdC70LDRgdGC0Ywg0YDQtdC90LTQtdGA0LAg0L7Rh9C40YnQtdC90LAgWycgKyBjb2xvciArICddJywgdGhpcy5ncm91cFN0eWxlKTtcbiAgfVxufVxuIiwiaW1wb3J0IFNQbG90IGZyb20gJ0Avc3Bsb3QnXG5pbXBvcnQgeyByYW5kb21JbnQgfSBmcm9tICdAL3V0aWxzJ1xuXG4vKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICpcbiAqINCa0LvQsNGB0YEt0YXQtdC70L/QtdGALCDRgNC10LDQu9C40LfRg9GO0YnQuNC5INC/0L7QtNC00LXRgNC20LrRgyDRgNC10LbQuNC80LAg0LTQtdC80L7QvdGB0YLRgNCw0YbQuNC+0L3QvdGL0YUg0LTQsNC90L3Ri9GFINC00LvRjyDQutC70LDRgdGB0LAgU1Bsb3QuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNQbG90RGVtbyBpbXBsZW1lbnRzIFNQbG90SGVscGVyIHtcblxuICAvKiog0J/RgNC40LfQvdCw0Log0LDQutGC0LjQstCw0YbQuNC4INC00LXQvNC+LdGA0LXQttC40LzQsC4gKi9cbiAgcHVibGljIGlzRW5hYmxlOiBib29sZWFuID0gZmFsc2VcblxuICAvKiog0JrQvtC70LjRh9C10YHRgtCy0L4g0LHRitC10LrRgtC+0LIuICovXG4gIHB1YmxpYyBhbW91bnQ6IG51bWJlciA9IDFfMDAwXzAwMFxuXG4gIC8qKiDQnNC40L3QuNC80LDQu9GM0L3Ri9C5INGA0LDQt9C80LXRgCDQvtCx0YrQtdC60YLQvtCyLiAqL1xuICBwdWJsaWMgc2l6ZU1pbjogbnVtYmVyID0gMTBcblxuICAvKiog0JzQsNC60YHQuNC80LDQu9GM0L3Ri9C5INGA0LDQt9C80LXRgCDQvtCx0YrQtdC60YLQvtCyLiAqL1xuICBwdWJsaWMgc2l6ZU1heDogbnVtYmVyID0gMzBcblxuICAvKiog0KbQstC10YLQvtCy0LDRjyDQv9Cw0LvQuNGC0YDQsCDQvtCx0YrQtdC60YLQvtCyLiAqL1xuICBwdWJsaWMgY29sb3JzOiBzdHJpbmdbXSA9IFtcbiAgICAnI0Q4MUMwMScsICcjRTk5NjdBJywgJyNCQTU1RDMnLCAnI0ZGRDcwMCcsICcjRkZFNEI1JywgJyNGRjhDMDAnLFxuICAgICcjMjI4QjIyJywgJyM5MEVFOTAnLCAnIzQxNjlFMScsICcjMDBCRkZGJywgJyM4QjQ1MTMnLCAnIzAwQ0VEMSdcbiAgXVxuXG4gIC8qKiDQn9GA0LjQt9C90LDQuiDRgtC+0LPQviwg0YfRgtC+INGF0LXQu9C/0LXRgCDRg9C20LUg0L3QsNGB0YLRgNC+0LXQvS4gKi9cbiAgcHVibGljIGlzU2V0dXBlZDogYm9vbGVhbiA9IGZhbHNlXG5cbiAgLyoqINCh0YfQtdGC0YfQuNC6INC40YLQtdGA0LjRgNGD0LXQvNGL0YUg0L7QsdGK0LXQutGC0L7Qsi4gKi9cbiAgcHJpdmF0ZSBpbmRleDogbnVtYmVyID0gMFxuXG4gIC8qKiDQpdC10LvQv9C10YAg0LHRg9C00LXRgiDQuNC80LXRgtGMINC/0L7Qu9C90YvQuSDQtNC+0YHRgtGD0L8g0Log0Y3QutC30LXQvNC/0LvRj9GA0YMgU1Bsb3QuICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIHJlYWRvbmx5IHNwbG90OiBTUGxvdFxuICApIHt9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0J/QvtC00LPQvtGC0LDQstC70LjQstCw0LXRgiDRhdC10LvQv9C10YAg0Log0LjRgdC/0L7Qu9GM0LfQvtCy0LDQvdC40Y4uXG4gICAqL1xuICBwdWJsaWMgc2V0dXAoKTogdm9pZCB7XG5cbiAgICAvKiog0KXQtdC70L/QtdGAINC00LXQvNC+LdGA0LXQttC40LzQsCDQstGL0L/QvtC70L3Rj9C10YIg0L3QsNGB0YLRgNC+0LnQutGDINCy0YHQtdGFINGB0LLQvtC40YUg0L/QsNGA0LDQvNC10YLRgNC+0LIg0LTQsNC20LUg0LXRgdC70Lgg0L7QvdCwINGD0LbQtSDQstGL0L/QvtC70L3Rj9C70LDRgdGMLiAqL1xuICAgIGlmICghdGhpcy5pc1NldHVwZWQpIHtcbiAgICAgIHRoaXMuaXNTZXR1cGVkID0gdHJ1ZVxuICAgIH1cblxuICAgIC8qKiDQntCx0L3Rg9C70LXQvdC40LUg0YHRh9C10YLRh9C40LrQsCDQuNGC0LXRgNCw0YLQvtGA0LAuICovXG4gICAgdGhpcy5pbmRleCA9IDBcblxuICAgIC8qKiDQn9C+0LTQs9C+0YLQvtCy0LrQsCDQtNC10LzQvi3RgNC10LbQuNC80LAgKNC10YHQu9C4INGC0YDQtdCx0YPQtdGC0YHRjykuICovXG4gICAgaWYgKHRoaXMuc3Bsb3QuZGVtby5pc0VuYWJsZSkge1xuICAgICAgdGhpcy5zcGxvdC5pdGVyYXRvciA9IHRoaXMuc3Bsb3QuZGVtby5pdGVyYXRvci5iaW5kKHRoaXMpXG4gICAgICB0aGlzLnNwbG90LmNvbG9ycyA9IHRoaXMuc3Bsb3QuZGVtby5jb2xvcnNcbiAgICB9XG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQmNC80LjRgtC40YDRg9C10YIg0LjRgtC10YDQsNGC0L7RgCDQuNGB0YXQvtC00L3Ri9GFINC+0LHRitC10LrRgtC+0LIuXG4gICAqL1xuICBwdWJsaWMgaXRlcmF0b3IoKTogU1Bsb3RPYmplY3QgfCBudWxsIHtcbiAgICBpZiAodGhpcy5pbmRleCA8IHRoaXMuYW1vdW50KSB7XG4gICAgICB0aGlzLmluZGV4KytcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHg6IHJhbmRvbUludCh0aGlzLnNwbG90LmdyaWQud2lkdGghKSxcbiAgICAgICAgeTogcmFuZG9tSW50KHRoaXMuc3Bsb3QuZ3JpZC5oZWlnaHQhKSxcbiAgICAgICAgc2hhcGU6IHJhbmRvbUludCh0aGlzLnNwbG90LnNoYXBlc0NvdW50ISksXG4gICAgICAgIHNpemU6IHRoaXMuc2l6ZU1pbiArIHJhbmRvbUludCh0aGlzLnNpemVNYXggLSB0aGlzLnNpemVNaW4gKyAxKSxcbiAgICAgICAgY29sb3I6IHJhbmRvbUludCh0aGlzLmNvbG9ycy5sZW5ndGgpXG4gICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCBTUGxvdCBmcm9tICdAL3NwbG90J1xuaW1wb3J0ICogYXMgc2hhZGVycyBmcm9tICdAL3NoYWRlcnMnXG5pbXBvcnQgeyBjb2xvckZyb21IZXhUb0dsUmdiIH0gZnJvbSAnQC91dGlscydcblxuLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqXG4gKiDQmtC70LDRgdGBLdGF0LXQu9C/0LXRgCwg0YPQv9GA0LDQstC70Y/RjtGJ0LjQuSBHTFNMLdC60L7QtNC+0Lwg0YjQtdC50LTQtdGA0L7Qsi5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU1Bsb3RHbHNsIGltcGxlbWVudHMgU1Bsb3RIZWxwZXIge1xuXG4gIC8qKiDQmtC+0LTRiyDRiNC10LnQtNC10YDQvtCyLiAqL1xuICBwdWJsaWMgdmVydFNoYWRlclNvdXJjZTogc3RyaW5nID0gJydcbiAgcHVibGljIGZyYWdTaGFkZXJTb3VyY2U6IHN0cmluZyA9ICcnXG5cbiAgLyoqINCf0YDQuNC30L3QsNC6INGC0L7Qs9C+LCDRh9GC0L4g0YXQtdC70L/QtdGAINGD0LbQtSDQvdCw0YHRgtGA0L7QtdC9LiAqL1xuICBwdWJsaWMgaXNTZXR1cGVkOiBib29sZWFuID0gZmFsc2VcblxuICAvKiog0KXQtdC70L/QtdGAINCx0YPQtNC10YIg0LjQvNC10YLRjCDQv9C+0LvQvdGL0Lkg0LTQvtGB0YLRg9C/INC6INGN0LrQt9C10LzQv9C70Y/RgNGDIFNQbG90LiAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICByZWFkb25seSBzcGxvdDogU1Bsb3RcbiAgKSB7fVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCf0L7QtNCz0L7RgtCw0LLQu9C40LLQsNC10YIg0YXQtdC70L/QtdGAINC6INC40YHQv9C+0LvRjNC30L7QstCw0L3QuNGOLlxuICAgKi9cbiAgcHVibGljIHNldHVwKCk6IHZvaWQge1xuXG4gICAgaWYgKCF0aGlzLmlzU2V0dXBlZCkge1xuXG4gICAgICAvKiog0KHQsdC+0YDQutCwINC60L7QtNC+0LIg0YjQtdC50LTQtdGA0L7Qsi4gKi9cbiAgICAgIHRoaXMudmVydFNoYWRlclNvdXJjZSA9IHRoaXMubWFrZVZlcnRTaGFkZXJTb3VyY2UoKVxuICAgICAgdGhpcy5mcmFnU2hhZGVyU291cmNlID0gdGhpcy5tYWtlRnJhZ1NoYWRlclNvdXJjZSgpXG5cbiAgICAgIC8qKiDQktGL0YfQuNGB0LvQtdC90LjQtSDQutC+0LvQuNGH0LXRgdGC0LLQsCDRgNCw0LfQu9C40YfQvdGL0YUg0YTQvtGA0Lwg0L7QsdGK0LXQutGC0L7Qsi4gKi9cbiAgICAgIHRoaXMuc3Bsb3Quc2hhcGVzQ291bnQgPSBzaGFkZXJzLlNIQVBFUy5sZW5ndGhcblxuICAgICAgdGhpcy5pc1NldHVwZWQgPSB0cnVlXG4gICAgfVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0KHQvtC30LTQsNC10YIg0LrQvtC0INCy0LXRgNGI0LjQvdC90L7Qs9C+INGI0LXQudC00LXRgNCwLlxuICAgKlxuICAgKiBAcmVtYXJrc1xuICAgKiDQkiDRiNCw0LHQu9C+0L0g0LLQtdGA0YjQuNC90L3QvtCz0L4g0YjQtdC50LTQtdGA0LAg0LLRgdGC0LDQstC70Y/QtdGC0YHRjyDQutC+0LQg0LLRi9Cx0L7RgNCwINGG0LLQtdGC0LAg0L7QsdGK0LXQutGC0LAg0L/QviDQuNC90LTQtdC60YHRgyDRhtCy0LXRgtCwLiDQoi7Qui7RiNC10LnQtNC10YAg0L3QtSDQv9C+0LfQstC+0LvRj9C10YJcbiAgICog0LjRgdC/0L7Qu9GM0LfQvtCy0LDRgtGMINCyINC60LDRh9C10YHRgtCy0LUg0LjQvdC00LXQutGB0L7QsiDQv9C10YDQtdC80LXQvdC90YvQtSAtINC00LvRjyDQt9Cw0LTQsNC90LjRjyDRhtCy0LXRgtCwINC40YHQv9C+0LvRjNC30YPQtdGC0YHRjyDQv9C+0YHQu9C10LTQvtCy0LDRgtC10LvRjNC90YvQuSDQv9C10YDQtdCx0L7RgCDRhtCy0LXRgtC+0LLRi9GFXG4gICAqINC40L3QtNC10LrRgdC+0LIuXG4gICAqL1xuICBwcml2YXRlIG1ha2VWZXJ0U2hhZGVyU291cmNlKCkge1xuXG4gICAgLyoqINCS0YDQtdC80LXQvdC90L7QtSDQtNC+0LHQsNCy0LvQtdC90LjQtSDQsiDQv9Cw0LvQuNGC0YDRgyDQstC10YDRiNC40L0g0YbQstC10YLQsCDQvdCw0L/RgNCw0LLQu9GP0Y7RidC40YUuICovXG4gICAgdGhpcy5zcGxvdC5jb2xvcnMucHVzaCh0aGlzLnNwbG90LmdyaWQucnVsZXNDb2xvciEpXG5cbiAgICBsZXQgY29kZTogc3RyaW5nID0gJydcblxuICAgIC8qKiDQpNC+0YDQvNC40YDQvtCy0L3QuNC1INC60L7QtNCwINGD0YHRgtCw0L3QvtCy0LrQuCDRhtCy0LXRgtCwINC+0LHRitC10LrRgtCwINC/0L4g0LjQvdC00LXQutGB0YMuICovXG4gICAgdGhpcy5zcGxvdC5jb2xvcnMuZm9yRWFjaCgodmFsdWUsIGluZGV4KSA9PiB7XG4gICAgICBsZXQgW3IsIGcsIGJdID0gY29sb3JGcm9tSGV4VG9HbFJnYih2YWx1ZSlcbiAgICAgIGNvZGUgKz0gYGVsc2UgaWYgKGFfY29sb3IgPT0gJHtpbmRleH0uMCkgdl9jb2xvciA9IHZlYzMoJHtyfSwgJHtnfSwgJHtifSk7XFxuYFxuICAgIH0pXG5cbiAgICAvKiog0KPQtNCw0LvQtdC90LjQtSDQuNC3INC/0LDQu9C40YLRgNGLINCy0LXRgNGI0LjQvSDQstGA0LXQvNC10L3QvdC+INC00L7QsdCw0LLQu9C10L3QvdC+0LPQviDRhtCy0LXRgtCwINC90LDQv9GA0LDQstC70Y/RjtGJ0LjRhS4gKi9cbiAgICB0aGlzLnNwbG90LmNvbG9ycy5wb3AoKVxuXG4gICAgLyoqINCj0LTQsNC70LXQvdC40LUg0LvQuNGI0L3QtdCz0L4gXCJlbHNlXCIg0LIg0L3QsNGH0LDQu9C1INC60L7QtNCwINC4INC70LjRiNC90LXQs9C+INC/0LXRgNC10LLQvtC00LAg0YHRgtGA0L7QutC4INCyINC60L7QvdGG0LUuICovXG4gICAgY29kZSA9IGNvZGUuc2xpY2UoNSkuc2xpY2UoMCwgLTEpXG5cbiAgICByZXR1cm4gc2hhZGVycy5WRVJURVhfVEVNUExBVEUucmVwbGFjZSgne0NPTE9SLVNFTEVDVElPTn0nLCBjb2RlKS50cmltKClcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCh0L7Qt9C00LDQtdGCINC60L7QtCDRhNGA0LDQs9C80LXQvdGC0L3QvtCz0L4g0YjQtdC50LTQtdGA0LAuXG4gICAqL1xuICBwcml2YXRlIG1ha2VGcmFnU2hhZGVyU291cmNlKCkge1xuXG4gICAgbGV0IGNvZGUxOiBzdHJpbmcgPSAnJ1xuICAgIGxldCBjb2RlMjogc3RyaW5nID0gJydcblxuICAgIHNoYWRlcnMuU0hBUEVTLmZvckVhY2goKHZhbHVlLCBpbmRleCkgPT4ge1xuXG4gICAgICAvKiog0KTQvtGA0LzQuNGA0L7QstCw0L3QuNC1INC60L7QtNCwINGE0YPQvdC60YbQuNC5LCDQvtC/0LjRgdGL0LLQsNGO0YnQuNGFINGE0L7RgNC80Ysg0L7QsdGK0LXQutGC0L7Qsi4gKi9cbiAgICAgIGNvZGUxICs9IGB2b2lkIHMke2luZGV4fSgpIHsgJHt2YWx1ZS50cmltKCl9IH1cXG5gXG5cbiAgICAgIC8qKiDQpNC+0YDQvNC40YDQvtCy0LDQvdC40LUg0LrQvtC00LAg0YPRgdGC0LDQvdC+0LLQutC4INGE0L7RgNC80Ysg0L7QsdGK0LXQutGC0LAg0L/QviDQuNC90LTQtdC60YHRgy4gKi9cbiAgICAgIGNvZGUyICs9IGBlbHNlIGlmICh2X3NoYXBlID09ICR7aW5kZXh9LjApIHsgcyR7aW5kZXh9KCk7fVxcbmBcbiAgICB9KVxuXG4gICAgLyoqINCj0LTQsNC70LXQvdC40LUg0LvQuNGI0L3QtdCz0L4g0L/QtdGA0LXQstC+0LTQsCDRgdGC0YDQvtC60Lgg0LIg0LrQvtC90YbQtS4gKi9cbiAgICBjb2RlMSA9IGNvZGUxLnNsaWNlKDAsIC0xKVxuXG4gICAgLyoqINCj0LTQsNC70LXQvdC40LUg0LvQuNGI0L3QtdCz0L4gXCJlbHNlXCIg0LIg0L3QsNGH0LDQu9C1INC60L7QtNCwINC4INC70LjRiNC90LXQs9C+INC/0LXRgNC10LLQvtC00LAg0YHRgtGA0L7QutC4INCyINC60L7QvdGG0LUuICovXG4gICAgY29kZTIgPSBjb2RlMi5zbGljZSg1KS5zbGljZSgwLCAtMSlcblxuICAgIHJldHVybiBzaGFkZXJzLkZSQUdNRU5UX1RFTVBMQVRFLlxuICAgICAgcmVwbGFjZSgne1NIQVBFUy1GVU5DVElPTlN9JywgY29kZTEpLlxuICAgICAgcmVwbGFjZSgne1NIQVBFLVNFTEVDVElPTn0nLCBjb2RlMikuXG4gICAgICB0cmltKClcbiAgfVxufVxuIiwiaW1wb3J0IFNQbG90IGZyb20gJ0Avc3Bsb3QnXG5pbXBvcnQgeyBjb2xvckZyb21IZXhUb0dsUmdiIH0gZnJvbSAnQC91dGlscydcblxuLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqXG4gKiDQmtC70LDRgdGBLdGF0LXQu9C/0LXRgCwg0YDQtdCw0LvQuNC30YPRjtGJ0LjQuSDRg9C/0YDQsNCy0LvQtdC90LjQtSDQutC+0L3RgtC10LrRgdGC0L7QvCDRgNC10L3QtNC10YDQuNC90LPQsCBXZWJHTCDQutC70LDRgdGB0LAgU3Bsb3QuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNQbG90V2ViR2wgaW1wbGVtZW50cyBTUGxvdEhlbHBlciB7XG5cbiAgLyoqINCf0LDRgNCw0LzQtdGC0YDRiyDQuNC90LjRhtC40LDQu9C40LfQsNGG0LjQuCDQutC+0L3RgtC10LrRgdGC0LAg0YDQtdC90LTQtdGA0LjQvdCz0LAgV2ViR0wuICovXG4gIHB1YmxpYyBhbHBoYTogYm9vbGVhbiA9IGZhbHNlXG4gIHB1YmxpYyBkZXB0aDogYm9vbGVhbiA9IGZhbHNlXG4gIHB1YmxpYyBzdGVuY2lsOiBib29sZWFuID0gZmFsc2VcbiAgcHVibGljIGFudGlhbGlhczogYm9vbGVhbiA9IGZhbHNlXG4gIHB1YmxpYyBkZXN5bmNocm9uaXplZDogYm9vbGVhbiA9IHRydWVcbiAgcHVibGljIHByZW11bHRpcGxpZWRBbHBoYTogYm9vbGVhbiA9IGZhbHNlXG4gIHB1YmxpYyBwcmVzZXJ2ZURyYXdpbmdCdWZmZXI6IGJvb2xlYW4gPSBmYWxzZVxuICBwdWJsaWMgZmFpbElmTWFqb3JQZXJmb3JtYW5jZUNhdmVhdDogYm9vbGVhbiA9IHRydWVcbiAgcHVibGljIHBvd2VyUHJlZmVyZW5jZTogV2ViR0xQb3dlclByZWZlcmVuY2UgPSAnaGlnaC1wZXJmb3JtYW5jZSdcblxuICAvKiog0J3QsNC30LLQsNC90LjRjyDRjdC70LXQvNC10L3RgtC+0LIg0LPRgNCw0YTQuNGH0LXRgdC60L7QuSDRgdC40YHRgtC10LzRiyDQutC70LjQtdC90YLQsC4gKi9cbiAgcHVibGljIGdwdSA9IHsgaGFyZHdhcmU6ICctJywgc29mdHdhcmU6ICctJyB9XG5cbiAgLyoqINCa0L7QvdGC0LXQutGB0YIg0YDQtdC90LTQtdGA0LjQvdCz0LAg0Lgg0L/RgNC+0LPRgNCw0LzQvNCwIFdlYkdMLiAqL1xuICBwcml2YXRlIGdsITogV2ViR0xSZW5kZXJpbmdDb250ZXh0XG4gIHByaXZhdGUgZ3B1UHJvZ3JhbSE6IFdlYkdMUHJvZ3JhbVxuXG4gIC8qKiDQn9C10YDQtdC80LXQvdC90YvQtSDQtNC70Y8g0YHQstGP0LfQuCDQv9GA0LjQu9C+0LbQtdC90LjRjyDRgSDQv9GA0L7Qs9GA0LDQvNC80L7QuSBXZWJHTC4gKi9cbiAgcHJpdmF0ZSB2YXJpYWJsZXM6IE1hcCA8IHN0cmluZywgYW55ID4gPSBuZXcgTWFwKClcblxuICAvKiog0JHRg9GE0LXRgNGLINCy0LjQtNC10L7Qv9Cw0LzRj9GC0LggV2ViR0wuICovXG4gIHB1YmxpYyBkYXRhOiBNYXAgPCBzdHJpbmcsIHtidWZmZXJzOiBXZWJHTEJ1ZmZlcltdLCB0eXBlOiBudW1iZXJ9ID4gPSBuZXcgTWFwKClcblxuICAvKiog0J/RgNC40LfQvdCw0Log0YLQvtCz0L4sINGH0YLQviDRhdC10LvQv9C10YAg0YPQttC1INC90LDRgdGC0YDQvtC10L0uICovXG4gIHB1YmxpYyBpc1NldHVwZWQ6IGJvb2xlYW4gPSBmYWxzZVxuXG4gIC8qKiDQn9GA0LDQstC40LvQsCDRgdC+0L7RgtCy0LXRgtGB0YLQstC40Y8g0YLQuNC/0L7QsiDRgtC40L/QuNC30LjRgNC+0LLQsNC90L3Ri9GFINC80LDRgdGB0LjQstC+0LIg0Lgg0YLQuNC/0L7QsiDQv9C10YDQtdC80LXQvdC90YvRhSBXZWJHTC4gKi9cbiAgcHJpdmF0ZSBnbE51bWJlclR5cGVzOiBNYXA8c3RyaW5nLCBudW1iZXI+ID0gbmV3IE1hcChbXG4gICAgWydJbnQ4QXJyYXknLCAweDE0MDBdLCAgICAgICAvLyBnbC5CWVRFXG4gICAgWydVaW50OEFycmF5JywgMHgxNDAxXSwgICAgICAvLyBnbC5VTlNJR05FRF9CWVRFXG4gICAgWydJbnQxNkFycmF5JywgMHgxNDAyXSwgICAgICAvLyBnbC5TSE9SVFxuICAgIFsnVWludDE2QXJyYXknLCAweDE0MDNdLCAgICAgLy8gZ2wuVU5TSUdORURfU0hPUlRcbiAgICBbJ0Zsb2F0MzJBcnJheScsIDB4MTQwNl0gICAgIC8vIGdsLkZMT0FUXG4gIF0pXG5cbiAgLyoqINCl0LXQu9C/0LXRgCDQsdGD0LTQtdGCINC40LzQtdGC0Ywg0L/QvtC70L3Ri9C5INC00L7RgdGC0YPQvyDQuiDRjdC60LfQtdC80L/Qu9GP0YDRgyBTUGxvdC4gKi9cbiAgY29uc3RydWN0b3IoXG4gICAgcmVhZG9ubHkgc3Bsb3Q6IFNQbG90XG4gICkgeyB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0J/QvtC00LPQvtGC0LDQstC70LjQstCw0LXRgiDRhdC10LvQv9C10YAg0Log0LjRgdC/0L7Qu9GM0LfQvtCy0LDQvdC40Y4uXG4gICAqL1xuICBwdWJsaWMgc2V0dXAoKTogdm9pZCB7XG5cbiAgICAvKiog0KfQsNGB0YLRjCDQv9Cw0YDQsNC80LXRgtGA0L7QsiDRhdC10LvQv9C10YDQsCBXZWJHTCDQuNC90LjRhtC40LDQu9C40LfQuNGA0YPQtdGC0YHRjyDRgtC+0LvRjNC60L4g0L7QtNC40L0g0YDQsNC3LiAqL1xuICAgIGlmICghdGhpcy5pc1NldHVwZWQpIHtcblxuICAgICAgdGhpcy5nbCA9IHRoaXMuc3Bsb3QuY2FudmFzLmdldENvbnRleHQoJ3dlYmdsJywge1xuICAgICAgICBhbHBoYTogdGhpcy5hbHBoYSxcbiAgICAgICAgZGVwdGg6IHRoaXMuZGVwdGgsXG4gICAgICAgIHN0ZW5jaWw6IHRoaXMuc3RlbmNpbCxcbiAgICAgICAgYW50aWFsaWFzOiB0aGlzLmFudGlhbGlhcyxcbiAgICAgICAgZGVzeW5jaHJvbml6ZWQ6IHRoaXMuZGVzeW5jaHJvbml6ZWQsXG4gICAgICAgIHByZW11bHRpcGxpZWRBbHBoYTogdGhpcy5wcmVtdWx0aXBsaWVkQWxwaGEsXG4gICAgICAgIHByZXNlcnZlRHJhd2luZ0J1ZmZlcjogdGhpcy5wcmVzZXJ2ZURyYXdpbmdCdWZmZXIsXG4gICAgICAgIGZhaWxJZk1ham9yUGVyZm9ybWFuY2VDYXZlYXQ6IHRoaXMuZmFpbElmTWFqb3JQZXJmb3JtYW5jZUNhdmVhdCxcbiAgICAgICAgcG93ZXJQcmVmZXJlbmNlOiB0aGlzLnBvd2VyUHJlZmVyZW5jZVxuICAgICAgfSkhXG5cbiAgICAgIGlmICh0aGlzLmdsID09PSBudWxsKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcign0J7RiNC40LHQutCwINGB0L7Qt9C00LDQvdC40Y8g0LrQvtC90YLQtdC60YHRgtCwINGA0LXQvdC00LXRgNC40L3Qs9CwIFdlYkdMIScpXG4gICAgICB9XG5cbiAgICAgIC8qKiDQn9C+0LvRg9GH0LXQvdC40LUg0LjQvdGE0L7RgNC80LDRhtC40Lgg0L4g0LPRgNCw0YTQuNGH0LXRgdC60L7QuSDRgdC40YHRgtC10LzQtSDQutC70LjQtdC90YLQsC4gKi9cbiAgICAgIGxldCBleHQgPSB0aGlzLmdsLmdldEV4dGVuc2lvbignV0VCR0xfZGVidWdfcmVuZGVyZXJfaW5mbycpXG4gICAgICB0aGlzLmdwdS5oYXJkd2FyZSA9IChleHQpID8gdGhpcy5nbC5nZXRQYXJhbWV0ZXIoZXh0LlVOTUFTS0VEX1JFTkRFUkVSX1dFQkdMKSA6ICdb0L3QtdC40LfQstC10YHRgtC90L5dJ1xuICAgICAgdGhpcy5ncHUuc29mdHdhcmUgPSB0aGlzLmdsLmdldFBhcmFtZXRlcih0aGlzLmdsLlZFUlNJT04pXG5cbiAgICAgIHRoaXMuc3Bsb3QuZGVidWcubG9nKCdncHUnKVxuXG4gICAgICAvKiog0KHQvtC30LTQsNC90LjQtSDQv9GA0L7Qs9GA0LDQvNC80YsgV2ViR0wuICovXG4gICAgICB0aGlzLmNyZWF0ZVByb2dyYW0odGhpcy5zcGxvdC5nbHNsLnZlcnRTaGFkZXJTb3VyY2UsIHRoaXMuc3Bsb3QuZ2xzbC5mcmFnU2hhZGVyU291cmNlKVxuXG4gICAgICB0aGlzLmlzU2V0dXBlZCA9IHRydWVcbiAgICB9XG5cbiAgICAvKiog0JTRgNGD0LPQsNGPINGH0LDRgdGC0Ywg0L/QsNGA0LDQvNC10YLRgNC+0LIg0YXQtdC70L/QtdGA0LAgV2ViR0wg0LjQvdC40YbQuNCw0LvQuNC30LjRgNGD0LXRgtGB0Y8g0L/RgNC4INC60LDQttC00L7QvCDQstGL0LfQvtCy0LUg0LzQtdGC0L7QtNCwIHNldHVwLiAqL1xuXG4gICAgLyoqINCa0L7QvtGA0LXQutGC0LjRgNC+0LLQutCwINGA0LDQt9C80LXRgNCwINC+0LHQu9Cw0YHRgtC4INC/0YDQvtGB0LzQvtGC0YDQsC4gKi9cbiAgICB0aGlzLnNwbG90LmNhbnZhcy53aWR0aCA9IHRoaXMuc3Bsb3QuY2FudmFzLmNsaWVudFdpZHRoXG4gICAgdGhpcy5zcGxvdC5jYW52YXMuaGVpZ2h0ID0gdGhpcy5zcGxvdC5jYW52YXMuY2xpZW50SGVpZ2h0XG4gICAgdGhpcy5nbC52aWV3cG9ydCgwLCAwLCB0aGlzLnNwbG90LmNhbnZhcy53aWR0aCwgdGhpcy5zcGxvdC5jYW52YXMuaGVpZ2h0KVxuXG4gICAgLyoqINCV0YHQu9C4INC30LDQtNCw0L0g0YDQsNC30LzQtdGAINC/0LvQvtGB0LrQvtGB0YLQuCwg0L3QviDQvdC1INC30LDQtNCw0L3QviDQv9C+0LvQvtC20LXQvdC40LUg0L7QsdC70LDRgdGC0Lgg0L/RgNC+0YHQvNC+0YLRgNCwLCDRgtC+INC+0L3QsCDQv9C+0LzQtdGJ0LDQtdGC0YHRjyDQsiDRhtC10L3RgtGAINC/0LvQvtGB0LrQvtGB0YLQuC4gKi9cbiAgICBpZiAoKCdncmlkJyBpbiB0aGlzLnNwbG90Lmxhc3RSZXF1ZXN0ZWRPcHRpb25zISkgJiYgISgnY2FtZXJhJyBpbiB0aGlzLnNwbG90Lmxhc3RSZXF1ZXN0ZWRPcHRpb25zKSkge1xuICAgICAgdGhpcy5zcGxvdC5jYW1lcmEueCA9IHRoaXMuc3Bsb3QuZ3JpZC53aWR0aCEgLyAyXG4gICAgICB0aGlzLnNwbG90LmNhbWVyYS55ID0gdGhpcy5zcGxvdC5ncmlkLmhlaWdodCEgLyAyXG4gICAgfVxuXG4gICAgLyoqINCj0YHRgtCw0L3QvtCy0LrQsCDRhNC+0L3QvtCy0L7Qs9C+INGG0LLQtdGC0LAg0LrQsNC90LLQsNGB0LAgKNGG0LLQtdGCINC+0YfQuNGB0YLQutC4INC60L7QvdGC0LXQutGB0YLQsCDRgNC10L3QtNC10YDQuNC90LPQsCkuICovXG4gICAgdGhpcy5zZXRCZ0NvbG9yKHRoaXMuc3Bsb3QuZ3JpZC5iZ0NvbG9yISlcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCj0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdGCINGG0LLQtdGCINGE0L7QvdCwINC60L7QvdGC0LXQutGB0YLQsCDRgNC10L3QtNC10YDQuNC90LPQsCBXZWJHTC5cbiAgICovXG4gIHB1YmxpYyBzZXRCZ0NvbG9yKGNvbG9yOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBsZXQgW3IsIGcsIGJdID0gY29sb3JGcm9tSGV4VG9HbFJnYihjb2xvcilcbiAgICB0aGlzLmdsLmNsZWFyQ29sb3IociwgZywgYiwgMC4wKVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JfQsNC60YDQsNGI0LjQstCw0LXRgiDQutC+0L3RgtC10LrRgdGCINGA0LXQvdC00LXRgNC40L3Qs9CwIFdlYkdMINGG0LLQtdGC0L7QvCDRhNC+0L3QsC5cbiAgICovXG4gIHB1YmxpYyBjbGVhckJhY2tncm91bmQoKTogdm9pZCB7XG4gICAgdGhpcy5nbC5jbGVhcih0aGlzLmdsLkNPTE9SX0JVRkZFUl9CSVQpO1xuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0KHQvtC30LTQsNC10YIg0YjQtdC50LTQtdGAIFdlYkdMLlxuICAgKlxuICAgKiBAcGFyYW0gdHlwZSAtINCi0LjQvyDRiNC10LnQtNC10YDQsC5cbiAgICogQHBhcmFtIGNvZGUgLSBHTFNMLdC60L7QtCDRiNC10LnQtNC10YDQsC5cbiAgICogQHJldHVybnMg0KHQvtC30LTQsNC90L3Ri9C5INGI0LXQudC00LXRgC5cbiAgICovXG4gIHB1YmxpYyBjcmVhdGVTaGFkZXIodHlwZTogJ1ZFUlRFWF9TSEFERVInIHwgJ0ZSQUdNRU5UX1NIQURFUicsIGNvZGU6IHN0cmluZyk6IFdlYkdMU2hhZGVyIHtcblxuICAgIGNvbnN0IHNoYWRlciA9IHRoaXMuZ2wuY3JlYXRlU2hhZGVyKHRoaXMuZ2xbdHlwZV0pIVxuICAgIHRoaXMuZ2wuc2hhZGVyU291cmNlKHNoYWRlciwgY29kZSlcbiAgICB0aGlzLmdsLmNvbXBpbGVTaGFkZXIoc2hhZGVyKVxuXG4gICAgaWYgKCF0aGlzLmdsLmdldFNoYWRlclBhcmFtZXRlcihzaGFkZXIsIHRoaXMuZ2wuQ09NUElMRV9TVEFUVVMpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ9Ce0YjQuNCx0LrQsCDQutC+0LzQv9C40LvRj9GG0LjQuCDRiNC10LnQtNC10YDQsCBbJyArIHR5cGUgKyAnXS4gJyArIHRoaXMuZ2wuZ2V0U2hhZGVySW5mb0xvZyhzaGFkZXIpKVxuICAgIH1cblxuICAgIHJldHVybiBzaGFkZXJcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCh0L7Qt9C00LDQtdGCINC/0YDQvtCz0YDQsNC80LzRgyBXZWJHTCDQuNC3INGI0LXQudC00LXRgNC+0LIuXG4gICAqXG4gICAqIEBwYXJhbSBzaGFkZXJWZXJ0IC0g0JLQtdGA0YjQuNC90L3Ri9C5INGI0LXQudC00LXRgC5cbiAgICogQHBhcmFtIHNoYWRlckZyYWcgLSDQpNGA0LDQs9C80LXQvdGC0L3Ri9C5INGI0LXQudC00LXRgC5cbiAgICovXG4gIHB1YmxpYyBjcmVhdGVQcm9ncmFtRnJvbVNoYWRlcnMoc2hhZGVyVmVydDogV2ViR0xTaGFkZXIsIHNoYWRlckZyYWc6IFdlYkdMU2hhZGVyKTogdm9pZCB7XG5cbiAgICB0aGlzLmdwdVByb2dyYW0gPSB0aGlzLmdsLmNyZWF0ZVByb2dyYW0oKSFcbiAgICB0aGlzLmdsLmF0dGFjaFNoYWRlcih0aGlzLmdwdVByb2dyYW0sIHNoYWRlclZlcnQpXG4gICAgdGhpcy5nbC5hdHRhY2hTaGFkZXIodGhpcy5ncHVQcm9ncmFtLCBzaGFkZXJGcmFnKVxuICAgIHRoaXMuZ2wubGlua1Byb2dyYW0odGhpcy5ncHVQcm9ncmFtKVxuICAgIHRoaXMuZ2wudXNlUHJvZ3JhbSh0aGlzLmdwdVByb2dyYW0pXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQodC+0LfQtNCw0LXRgiDQv9GA0L7Qs9GA0LDQvNC80YMgV2ViR0wg0LjQtyBHTFNMLdC60L7QtNC+0LIg0YjQtdC50LTQtdGA0L7Qsi5cbiAgICpcbiAgICogQHBhcmFtIHNoYWRlckNvZGVWZXJ0IC0g0JrQvtC0INCy0LXRgNGI0LjQvdC90L7Qs9C+INGI0LXQudC00LXRgNCwLlxuICAgKiBAcGFyYW0gc2hhZGVyQ29kZUZyYWcgLSDQmtC+0LQg0YTRgNCw0LPQvNC10L3RgtC90L7Qs9C+INGI0LXQudC00LXRgNCwLlxuICAgKi9cbiAgcHVibGljIGNyZWF0ZVByb2dyYW0oc2hhZGVyQ29kZVZlcnQ6IHN0cmluZywgc2hhZGVyQ29kZUZyYWc6IHN0cmluZyk6IHZvaWQge1xuXG4gICAgdGhpcy5zcGxvdC5kZWJ1Zy5sb2coJ3NoYWRlcnMnKVxuXG4gICAgdGhpcy5jcmVhdGVQcm9ncmFtRnJvbVNoYWRlcnMoXG4gICAgICB0aGlzLmNyZWF0ZVNoYWRlcignVkVSVEVYX1NIQURFUicsIHNoYWRlckNvZGVWZXJ0KSxcbiAgICAgIHRoaXMuY3JlYXRlU2hhZGVyKCdGUkFHTUVOVF9TSEFERVInLCBzaGFkZXJDb2RlRnJhZylcbiAgICApXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQodC+0LfQtNCw0LXRgiDRgdCy0Y/Qt9GMINC/0LXRgNC10LzQtdC90L3QvtC5INC/0YDQuNC70L7QttC10L3QuNGPINGBINC/0YDQvtCz0YDQsNC80LzQvtC5IFdlYkdsLlxuICAgKlxuICAgKiBAcmVtYXJrc1xuICAgKiDQn9C10YDQtdC80LXQvdC90YvQtSDRgdC+0YXRgNCw0L3Rj9GO0YLRgdGPINCyINCw0YHRgdC+0YbQuNCw0YLQuNCy0L3QvtC8INC80LDRgdGB0LjQstC1LCDQs9C00LUg0LrQu9GO0YfQuCAtINGN0YLQviDQvdCw0LfQstCw0L3QuNGPINC/0LXRgNC10LzQtdC90L3Ri9GFLiDQndCw0LfQstCw0L3QuNC1INC/0LXRgNC10LzQtdC90L3QvtC5INC00L7Qu9C20L3QvlxuICAgKiDQvdCw0YfQuNC90LDRgtGM0YHRjyDRgSDQv9GA0LXRhNC40LrRgdCwLCDQvtCx0L7Qt9C90LDRh9Cw0Y7RidC10LPQviDQtdC1IEdMU0wt0YLQuNC/LiDQn9GA0LXRhNC40LrRgSBcInVfXCIg0L7Qv9C40YHRi9Cy0LDQtdGCINC/0LXRgNC10LzQtdC90L3Rg9GOINGC0LjQv9CwIHVuaWZvcm0uINCf0YDQtdGE0LjQutGBIFwiYV9cIlxuICAgKiDQvtC/0LjRgdGL0LLQsNC10YIg0L/QtdGA0LXQvNC10L3QvdGD0Y4g0YLQuNC/0LAgYXR0cmlidXRlLlxuICAgKlxuICAgKiBAcGFyYW0gdmFyTmFtZSAtINCY0LzRjyDQv9C10YDQtdC80LXQvdC90L7QuSAo0YHRgtGA0L7QutCwKS5cbiAgICovXG4gIHB1YmxpYyBjcmVhdGVWYXJpYWJsZSh2YXJOYW1lOiBzdHJpbmcpOiB2b2lkIHtcblxuICAgIGNvbnN0IHZhclR5cGUgPSB2YXJOYW1lLnNsaWNlKDAsIDIpXG5cbiAgICBpZiAodmFyVHlwZSA9PT0gJ3VfJykge1xuICAgICAgdGhpcy52YXJpYWJsZXMuc2V0KHZhck5hbWUsIHRoaXMuZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHRoaXMuZ3B1UHJvZ3JhbSwgdmFyTmFtZSkpXG4gICAgfSBlbHNlIGlmICh2YXJUeXBlID09PSAnYV8nKSB7XG4gICAgICB0aGlzLnZhcmlhYmxlcy5zZXQodmFyTmFtZSwgdGhpcy5nbC5nZXRBdHRyaWJMb2NhdGlvbih0aGlzLmdwdVByb2dyYW0sIHZhck5hbWUpKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ9Cj0LrQsNC30LDQvSDQvdC10LLQtdGA0L3Ri9C5INGC0LjQvyAo0L/RgNC10YTQuNC60YEpINC/0LXRgNC10LzQtdC90L3QvtC5INGI0LXQudC00LXRgNCwOiAnICsgdmFyTmFtZSlcbiAgICB9XG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQodC+0LfQtNCw0LXRgiDRgdCy0Y/Qt9GMINC90LDQsdC+0YDQsCDQv9C10YDQtdC80LXQvdC90YvRhSDQv9GA0LjQu9C+0LbQtdC90LjRjyDRgSDQv9GA0L7Qs9GA0LDQvNC80L7QuSBXZWJHbC5cbiAgICpcbiAgICogQHJlbWFya3NcbiAgICog0JTQtdC70LDQtdGCINGC0L7QttC1INGB0LDQvNC+0LUsINGH0YLQviDQuCDQvNC10YLQvtC0IHtAbGluayBjcmVhdGVWYXJpYWJsZX0sINC90L4g0L/QvtC30LLQvtC70Y/QtdGCINC30LAg0L7QtNC40L0g0LLRi9C30L7QsiDRgdC+0LfQtNCw0YLRjCDRgdGA0LDQt9GDINC90LXRgdC60L7Qu9GM0LrQvlxuICAgKiDQv9C10YDQtdC80LXQvdC90YvRhS5cbiAgICpcbiAgICogQHBhcmFtIHZhck5hbWVzIC0g0J/QtdGA0LXRh9C40YHQu9C10L3QuNGPINC40LzQtdC9INC/0LXRgNC10LzQtdC90L3Ri9GFICjRgdGC0YDQvtC60LDQvNC4KS5cbiAgICovXG4gIHB1YmxpYyBjcmVhdGVWYXJpYWJsZXMoLi4udmFyTmFtZXM6IHN0cmluZ1tdKTogdm9pZCB7XG4gICAgdmFyTmFtZXMuZm9yRWFjaCh2YXJOYW1lID0+IHRoaXMuY3JlYXRlVmFyaWFibGUodmFyTmFtZSkpO1xuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0KHQvtC30LTQsNC10YIg0LIg0LPRgNGD0L/Qv9C1INCx0YPRhNC10YDQvtCyIFdlYkdMINC90L7QstGL0Lkg0LHRg9GE0LXRgCDQuCDQt9Cw0L/QuNGB0YvQstCw0LXRgiDQsiDQvdC10LPQviDQv9C10YDQtdC00LDQvdC90YvQtSDQtNCw0L3QvdGL0LUuXG4gICAqXG4gICAqIEByZW1hcmtzXG4gICAqINCa0L7Qu9C40YfQtdGB0YLQstC+INCz0YDRg9C/0L8g0LHRg9GE0LXRgNC+0LIg0Lgg0LrQvtC70LjRh9C10YHRgtCy0L4g0LHRg9GE0LXRgNC+0LIg0LIg0LrQsNC20LTQvtC5INCz0YDRg9C/0L/QtSDQvdC1INC+0LPRgNCw0L3QuNGH0LXQvdGLLiDQmtCw0LbQtNCw0Y8g0LPRgNGD0L/Qv9CwINC40LzQtdC10YIg0YHQstC+0LUg0L3QsNC30LLQsNC90LjQtSDQuFxuICAgKiBHTFNMLdGC0LjQvy4g0KLQuNC/INCz0YDRg9C/0L/RiyDQvtC/0YDQtdC00LXQu9GP0LXRgtGB0Y8g0LDQstGC0L7QvNCw0YLQuNGH0LXRgdC60Lgg0L3QsCDQvtGB0L3QvtCy0LUg0YLQuNC/0LAg0YLQuNC/0LjQt9C40YDQvtCy0LDQvdC90L7Qs9C+INC80LDRgdGB0LjQstCwLiDQn9GA0LDQstC40LvQsCDRgdC+0L7RgtCy0LXRgtGB0YLQstC40Y8g0YLQuNC/0L7QslxuICAgKiDQvtC/0YDQtdC00LXQu9GP0Y7RgtGB0Y8g0L/QtdGA0LXQvNC10L3QvdC+0Lkge0BsaW5rIGdsTnVtYmVyVHlwZXN9LlxuICAgKlxuICAgKiBAcGFyYW0gZ3JvdXBOYW1lIC0g0J3QsNC30LLQsNC90LjQtSDQs9GA0YPQv9C/0Ysg0LHRg9GE0LXRgNC+0LIsINCyINC60L7RgtC+0YDRg9GOINCx0YPQtNC10YIg0LTQvtCx0LDQstC70LXQvSDQvdC+0LLRi9C5INCx0YPRhNC10YAuXG4gICAqIEBwYXJhbSBkYXRhIC0g0JTQsNC90L3Ri9C1INCyINCy0LjQtNC1INGC0LjQv9C40LfQuNGA0L7QstCw0L3QvdC+0LPQviDQvNCw0YHRgdC40LLQsCDQtNC70Y8g0LfQsNC/0LjRgdC4INCyINGB0L7Qt9C00LDQstCw0LXQvNGL0Lkg0LHRg9GE0LXRgC5cbiAgICogQHJldHVybnMg0J7QsdGK0LXQvCDQv9Cw0LzRj9GC0LgsINC30LDQvdGP0YLRi9C5INC90L7QstGL0Lwg0LHRg9GE0LXRgNC+0LwgKNCyINCx0LDQudGC0LDRhSkuXG4gICAqL1xuICBwdWJsaWMgY3JlYXRlQnVmZmVyKGdyb3VwTmFtZTogc3RyaW5nLCBkYXRhOiBUeXBlZEFycmF5KTogbnVtYmVyIHtcblxuICAgIGNvbnN0IGJ1ZmZlciA9IHRoaXMuZ2wuY3JlYXRlQnVmZmVyKCkhXG4gICAgdGhpcy5nbC5iaW5kQnVmZmVyKHRoaXMuZ2wuQVJSQVlfQlVGRkVSLCBidWZmZXIpXG4gICAgdGhpcy5nbC5idWZmZXJEYXRhKHRoaXMuZ2wuQVJSQVlfQlVGRkVSLCBkYXRhLCB0aGlzLmdsLlNUQVRJQ19EUkFXKVxuXG4gICAgLyoqINCV0YHQu9C4INCz0YDRg9C/0L/RiyDRgSDRg9C60LDQt9Cw0L3QvdGL0Lwg0L3QsNC30LLQsNC90LjQtdC8INC90LUg0YHRg9GJ0LXRgdGC0LLRg9C10YIsINGC0L4g0L7QvdCwINGB0L7Qt9C00LDQtdGC0YHRjy4gKi9cbiAgICBpZiAoIXRoaXMuZGF0YS5oYXMoZ3JvdXBOYW1lKSkge1xuICAgICAgdGhpcy5kYXRhLnNldChncm91cE5hbWUsIHsgYnVmZmVyczogW10sIHR5cGU6IHRoaXMuZ2xOdW1iZXJUeXBlcy5nZXQoZGF0YS5jb25zdHJ1Y3Rvci5uYW1lKSF9KVxuICAgIH1cblxuICAgIHRoaXMuZGF0YS5nZXQoZ3JvdXBOYW1lKSEuYnVmZmVycy5wdXNoKGJ1ZmZlcilcblxuICAgIHJldHVybiBkYXRhLmxlbmd0aCAqIGRhdGEuQllURVNfUEVSX0VMRU1FTlRcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCf0LXRgNC10LTQsNC10YIg0LfQvdCw0YfQtdC90LjQtSDQvNCw0YLRgNC40YbRiyAzINGFIDMg0LIg0L/RgNC+0LPRgNCw0LzQvNGDIFdlYkdsLlxuICAgKlxuICAgKiBAcGFyYW0gdmFyTmFtZSAtINCY0LzRjyDQv9C10YDQtdC80LXQvdC90L7QuSBXZWJHTCAo0LjQtyDQvNCw0YHRgdC40LLQsCB7QGxpbmsgdmFyaWFibGVzfSkg0LIg0LrQvtGC0L7RgNGD0Y4g0LHRg9C00LXRgiDQt9Cw0L/QuNGB0LDQvdC+INC/0LXRgNC10LTQsNC90L3QvtC1INC30L3QsNGH0LXQvdC40LUuXG4gICAqIEBwYXJhbSB2YXJWYWx1ZSAtINCj0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdC80L7QtSDQt9C90LDRh9C10L3QuNC1INC00L7Qu9C20L3QviDRj9Cy0LvRj9GC0YzRgdGPINC80LDRgtGA0LjRhtC10Lkg0LLQtdGJ0LXRgdGC0LLQtdC90L3Ri9GFINGH0LjRgdC10Lsg0YDQsNC30LzQtdGA0L7QvCAzINGFIDMsINGA0LDQt9Cy0LXRgNC90YPRgtC+0LlcbiAgICogICAgINCyINCy0LjQtNC1INC+0LTQvdC+0LzQtdGA0L3QvtCz0L4g0LzQsNGB0YHQuNCy0LAg0LjQtyA5INGN0LvQtdC80LXQvdGC0L7Qsi5cbiAgICovXG4gIHB1YmxpYyBzZXRWYXJpYWJsZSh2YXJOYW1lOiBzdHJpbmcsIHZhclZhbHVlOiBudW1iZXJbXSk6IHZvaWQge1xuICAgIHRoaXMuZ2wudW5pZm9ybU1hdHJpeDNmdih0aGlzLnZhcmlhYmxlcy5nZXQodmFyTmFtZSksIGZhbHNlLCB2YXJWYWx1ZSlcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCU0LXQu9Cw0LXRgiDQsdGD0YTQtdGAIFdlYkdsIFwi0LDQutGC0LjQstC90YvQvFwiLlxuICAgKlxuICAgKiBAcGFyYW0gZ3JvdXBOYW1lIC0g0J3QsNC30LLQsNC90LjQtSDQs9GA0YPQv9C/0Ysg0LHRg9GE0LXRgNC+0LIsINCyINC60L7RgtC+0YDQvtC8INGF0YDQsNC90LjRgtGB0Y8g0L3QtdC+0LHRhdC+0LTQuNC80YvQuSDQsdGD0YTQtdGALlxuICAgKiBAcGFyYW0gaW5kZXggLSDQmNC90LTQtdC60YEg0LHRg9GE0LXRgNCwINCyINCz0YDRg9C/0L/QtS5cbiAgICogQHBhcmFtIHZhck5hbWUgLSDQmNC80Y8g0L/QtdGA0LXQvNC10L3QvdC+0LkgKNC40Lcg0LzQsNGB0YHQuNCy0LAge0BsaW5rIHZhcmlhYmxlc30pLCDRgSDQutC+0YLQvtGA0L7QuSDQsdGD0LTQtdGCINGB0LLRj9C30LDQvSDQsdGD0YTQtdGALlxuICAgKiBAcGFyYW0gc2l6ZSAtINCa0L7Qu9C40YfQtdGB0YLQstC+INGN0LvQtdC80LXQvdGC0L7QsiDQsiDQsdGD0YTQtdGA0LUsINGB0L7QvtGC0LLQtdGC0YHRgtCy0YPRjtGJ0LjRhSDQvtC00L3QvtC5IMKgR0wt0LLQtdGA0YjQuNC90LUuXG4gICAqIEBwYXJhbSBzdHJpZGUgLSDQoNCw0LfQvNC10YAg0YjQsNCz0LAg0L7QsdGA0LDQsdC+0YLQutC4INGN0LvQtdC80LXQvdGC0L7QsiDQsdGD0YTQtdGA0LAgKNC30L3QsNGH0LXQvdC40LUgMCDQt9Cw0LTQsNC10YIg0YDQsNC30LzQtdGJ0LXQvdC40LUg0Y3Qu9C10LzQtdC90YLQvtCyINC00YDRg9CzINC30LAg0LTRgNGD0LPQvtC8KS5cbiAgICogQHBhcmFtIG9mZnNldCAtINCh0LzQtdGJ0LXQvdC40LUg0L7RgtC90L7RgdC40YLQtdC70YzQvdC+INC90LDRh9Cw0LvQsCDQsdGD0YTQtdGA0LAsINC90LDRh9C40L3QsNGPINGBINC60L7RgtC+0YDQvtCz0L4g0LHRg9C00LXRgiDQv9GA0L7QuNGB0YXQvtC00LjRgtGMINC+0LHRgNCw0LHQvtGC0LrQsCDRjdC70LXQvNC10L3RgtC+0LIuXG4gICAqL1xuICBwdWJsaWMgc2V0QnVmZmVyKGdyb3VwTmFtZTogc3RyaW5nLCBpbmRleDogbnVtYmVyLCB2YXJOYW1lOiBzdHJpbmcsIHNpemU6IG51bWJlciwgc3RyaWRlOiBudW1iZXIsIG9mZnNldDogbnVtYmVyKTogdm9pZCB7XG5cbiAgICBjb25zdCBncm91cCA9IHRoaXMuZGF0YS5nZXQoZ3JvdXBOYW1lKSFcbiAgICBjb25zdCB2YXJpYWJsZSA9IHRoaXMudmFyaWFibGVzLmdldCh2YXJOYW1lKVxuXG4gICAgdGhpcy5nbC5iaW5kQnVmZmVyKHRoaXMuZ2wuQVJSQVlfQlVGRkVSLCBncm91cC5idWZmZXJzW2luZGV4XSlcbiAgICB0aGlzLmdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KHZhcmlhYmxlKVxuICAgIHRoaXMuZ2wudmVydGV4QXR0cmliUG9pbnRlcih2YXJpYWJsZSwgc2l6ZSwgZ3JvdXAudHlwZSwgZmFsc2UsIHN0cmlkZSwgb2Zmc2V0KVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JLRi9C/0L7Qu9C90Y/QtdGCINC+0YLRgNC40YHQvtCy0LrRgyDQutC+0L3RgtC10LrRgdGC0LAg0YDQtdC90LTQtdGA0LjQvdCz0LAgV2ViR0wg0LzQtdGC0L7QtNC+0Lwg0L/RgNC40LzQuNGC0LjQstC90YvRhSDRgtC+0YfQtdC6LlxuICAgKlxuICAgKiBAcGFyYW0gZmlyc3QgLSDQmNC90LTQtdC60YEgR0wt0LLQtdGA0YjQuNC90YssINGBINC60L7RgtC+0YDQvtC5INC90LDRh9C90LXRgtGPINC+0YLRgNC40YHQvtCy0LrQsC5cbiAgICogQHBhcmFtIGNvdW50IC0g0JrQvtC70LjRh9C10YHRgtCy0L4g0L7RgNC40YHQvtCy0YvQstCw0LXQvNGL0YUgR0wt0LLQtdGA0YjQuNC9LlxuICAgKi9cbiAgcHVibGljIGRyYXdQb2ludHMoZmlyc3Q6IG51bWJlciwgY291bnQ6IG51bWJlcik6IHZvaWQge1xuICAgIHRoaXMuZ2wuZHJhd0FycmF5cyh0aGlzLmdsLlBPSU5UUywgZmlyc3QsIGNvdW50KVxuICB9XG59XG4iLCJpbXBvcnQgeyBjb3B5TWF0Y2hpbmdLZXlWYWx1ZXMgfSBmcm9tICdAL3V0aWxzJ1xuaW1wb3J0IFNQbG90Q29udG9sIGZyb20gJ0Avc3Bsb3QtY29udHJvbCdcbmltcG9ydCBTUGxvdFdlYkdsIGZyb20gJ0Avc3Bsb3Qtd2ViZ2wnXG5pbXBvcnQgU1Bsb3REZWJ1ZyBmcm9tICdAL3NwbG90LWRlYnVnJ1xuaW1wb3J0IFNQbG90RGVtbyBmcm9tICdAL3NwbG90LWRlbW8nXG5pbXBvcnQgU1Bsb3RHbHNsIGZyb20gJ0Avc3Bsb3QtZ2xzbCdcblxuLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqXG4gKiDQmtC70LDRgdGBIFNQbG90IC0g0YDQtdCw0LvQuNC30YPQtdGCINCz0YDQsNGE0LjQuiDRgtC40L/QsCDRgdC60LDRgtGC0LXRgNC/0LvQvtGCINGB0YDQtdC00YHRgtCy0LDQvNC4IFdlYkdMLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTUGxvdCB7XG5cbiAgLyoqINCk0YPQvdC60YbQuNGPINC40YLQtdGA0LjRgNC+0LLQsNC90LjRjyDQuNGB0YXQvtC00L3Ri9GFINC00LDQvdC90YvRhS4gKi9cbiAgcHVibGljIGl0ZXJhdG9yOiBTUGxvdEl0ZXJhdG9yID0gdW5kZWZpbmVkXG5cbiAgLyoqINCl0LXQu9C/0LXRgCDRgNC10LbQuNC80LAg0L7RgtC70LDQtNC60LguICovXG4gIHB1YmxpYyBkZWJ1ZzogU1Bsb3REZWJ1ZyA9IG5ldyBTUGxvdERlYnVnKHRoaXMpXG5cbiAgLyoqINCl0LXQu9C/0LXRgCwg0YPQv9GA0LDQstC70Y/RjtGJ0LjQuSBHTFNMLdC60L7QtNC+0Lwg0YjQtdC50LTQtdGA0L7Qsi4gKi9cbiAgcHVibGljIGdsc2w6IFNQbG90R2xzbCA9IG5ldyBTUGxvdEdsc2wodGhpcylcblxuICAvKiog0KXQtdC70L/QtdGAIFdlYkdMLiAqL1xuICBwdWJsaWMgd2ViZ2w6IFNQbG90V2ViR2wgPSBuZXcgU1Bsb3RXZWJHbCh0aGlzKVxuXG4gIC8qKiDQpdC10LvQv9C10YAg0YDQtdC20LjQvNCwINC00LXQvNC+LdC00LDQvdC90YvRhS4gKi9cbiAgcHVibGljIGRlbW86IFNQbG90RGVtbyA9IG5ldyBTUGxvdERlbW8odGhpcylcblxuICAvKiog0J/RgNC40LfQvdCw0Log0YTQvtGA0YHQuNGA0L7QstCw0L3QvdC+0LPQviDQt9Cw0L/Rg9GB0LrQsCDRgNC10L3QtNC10YDQsC4gKi9cbiAgcHVibGljIGZvcmNlUnVuOiBib29sZWFuID0gZmFsc2VcblxuICAvKiog0J7Qs9GA0LDQvdC40YfQtdC90LjQtSDQutC+0Lst0LLQsCDQvtCx0YrQtdC60YLQvtCyINC90LAg0LPRgNCw0YTQuNC60LUuICovXG4gIHB1YmxpYyBnbG9iYWxMaW1pdDogbnVtYmVyID0gMV8wMDBfMDAwXzAwMFxuXG4gIC8qKiDQntCz0YDQsNC90LjRh9C10L3QuNC1INC60L7Quy3QstCwINC+0LHRitC10LrRgtC+0LIg0LIg0LPRgNGD0L/Qv9C1LiAqL1xuICBwdWJsaWMgZ3JvdXBMaW1pdDogbnVtYmVyID0gMTBfMDAwXG5cbiAgLyoqINCm0LLQtdGC0L7QstCw0Y8g0L/QsNC70LjRgtGA0LAg0L7QsdGK0LXQutGC0L7Qsi4gKi9cbiAgcHVibGljIGNvbG9yczogc3RyaW5nW10gPSBbXVxuXG4gIC8qKiDQn9Cw0YDQsNC80LXRgtGA0Ysg0LrQvtC+0YDQtNC40L3QsNGC0L3QvtC5INC/0LvQvtGB0LrQvtGB0YLQuC4gKi9cbiAgcHVibGljIGdyaWQ6IFNQbG90R3JpZCA9IHtcbiAgICB3aWR0aDogMzJfMDAwLFxuICAgIGhlaWdodDogMTZfMDAwLFxuICAgIGJnQ29sb3I6ICcjZmZmZmZmJyxcbiAgICBydWxlc0NvbG9yOiAnI2MwYzBjMCdcbiAgfVxuXG4gIC8qKiDQn9Cw0YDQsNC80LXRgtGA0Ysg0L7QsdC70LDRgdGC0Lgg0L/RgNC+0YHQvNC+0YLRgNCwLiAqL1xuICBwdWJsaWMgY2FtZXJhOiBTUGxvdENhbWVyYSA9IHtcbiAgICB4OiB0aGlzLmdyaWQud2lkdGghIC8gMixcbiAgICB5OiB0aGlzLmdyaWQuaGVpZ2h0ISAvIDIsXG4gICAgem9vbTogMVxuICB9XG5cbiAgLyoqINCf0YDQuNC30L3QsNC6INC90LXQvtCx0YXQvtC00LjQvNC+0YHRgtC4INC30LDQs9GA0YPQt9C60Lgg0LTQsNC90L3Ri9GFINC+0LEg0L7QsdGK0LXQutGC0LDRhS4gKi9cbiAgcHVibGljIGxvYWREYXRhOiBib29sZWFuID0gdHJ1ZVxuXG4gIC8qKiDQn9GA0LjQt9C90LDQuiDQvdC10L7QsdGF0L7QtNC40LzQvtGB0YLQuCDQsdC10LfQvtGC0LvQsNCz0LDRgtC10LvRjNC90L7Qs9C+INC30LDQv9GD0YHQutCwINGA0LXQvdC00LXRgNCwLiAqL1xuICBwdWJsaWMgaXNSdW5uaW5nOiBib29sZWFuID0gZmFsc2VcblxuICAvKiog0JrQvtC70LjRh9C10YHRgtCy0L4g0YDQsNC30LvQuNGH0L3Ri9GFINGE0L7RgNC8INC+0LHRitC10LrRgtC+0LIuINCS0YvRh9C40YHQu9GP0LXRgtGB0Y8g0L/QvtC30LbQtSDQsiDRhdC10LvQv9C10YDQtSBnbHNsLiAqL1xuICBwdWJsaWMgc2hhcGVzQ291bnQ6IG51bWJlciB8IHVuZGVmaW5lZFxuXG4gIC8qKiDQodGC0LDRgtC40YHRgtC40YfQtdGB0LrQsNGPINC40L3RhNC+0YDQvNCw0YbQuNGPLiAqL1xuICBwdWJsaWMgc3RhdHMgPSB7XG4gICAgb2JqVG90YWxDb3VudDogMCxcbiAgICBvYmpJbkdyb3VwQ291bnQ6IFtdIGFzIG51bWJlcltdLFxuICAgIGdyb3Vwc0NvdW50OiAwLFxuICAgIG1lbVVzYWdlOiAwXG4gIH1cblxuICAvKiog0J7QsdGK0LXQutGCLdC60LDQvdCy0LDRgSDQutC+0L3RgtC10LrRgdGC0LAg0YDQtdC90LTQtdGA0LjQvdCz0LAgV2ViR0wuICovXG4gIHB1YmxpYyBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50XG5cbiAgLyoqINCd0LDRgdGC0YDQvtC50LrQuCwg0LfQsNC/0YDQvtGI0LXQvdC90YvQtSDQv9C+0LvRjNC30L7QstCw0YLQtdC70LXQvCDQsiDQutC+0L3RgdGC0YDRg9C60YLQvtGA0LUg0LjQu9C4INC/0YDQuCDQv9C+0YHQu9C10LTQvdC10Lwg0LLRi9C30L7QstC1IHNldHVwLiAqL1xuICBwdWJsaWMgbGFzdFJlcXVlc3RlZE9wdGlvbnM6IFNQbG90T3B0aW9ucyB8IHVuZGVmaW5lZCA9IHt9XG5cbiAgLyoqINCl0LXQu9C/0LXRgCDQstC30LDQuNC80L7QtNC10LnRgdGC0LLQuNGPINGBINGD0YHRgtGA0L7QudGB0YLQstC+0Lwg0LLQstC+0LTQsC4gKi9cbiAgcHJvdGVjdGVkIGNvbnRyb2w6IFNQbG90Q29udG9sID0gbmV3IFNQbG90Q29udG9sKHRoaXMpXG5cbiAgLyoqINCf0YDQuNC30L3QsNC6INGC0L7Qs9C+LCDRh9GC0L4g0Y3QutC30LXQvNC/0LvRj9GAINC60LvQsNGB0YHQsCDQsdGL0Lsg0LrQvtGA0YDQtdC60YLQvdC+INC/0L7QtNCz0L7RgtC+0LLQu9C10L0g0Log0YDQtdC90LTQtdGA0YMuICovXG4gIHByaXZhdGUgaXNTZXR1cGVkOiBib29sZWFuID0gZmFsc2VcblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQodC+0LfQtNCw0LXRgiDRjdC60LfQtdC80L/Qu9GP0YAg0LrQu9Cw0YHRgdCwLCDQuNC90LjRhtC40LDQu9C40LfQuNGA0YPQtdGCINC90LDRgdGC0YDQvtC50LrQuCAo0LXRgdC70Lgg0L/QtdGA0LXQtNCw0L3RiykuXG4gICAqXG4gICAqIEByZW1hcmtzXG4gICAqINCV0YHQu9C4INC60LDQvdCy0LDRgSDRgSDQt9Cw0LTQsNC90L3Ri9C8INC40LTQtdC90YLQuNGE0LjQutCw0YLQvtGA0L7QvCDQvdC1INC90LDQudC00LXQvSAtINCz0LXQvdC10YDQuNGA0YPQtdGC0YHRjyDQvtGI0LjQsdC60LAuINCd0LDRgdGC0YDQvtC50LrQuCDQvNC+0LPRg9GCINCx0YvRgtGMINC30LDQtNCw0L3RiyDQutCw0Log0LJcbiAgICog0LrQvtC90YHRgtGA0YPQutGC0L7RgNC1LCDRgtCw0Log0Lgg0LIg0LzQtdGC0L7QtNC1IHtAbGluayBzZXR1cH0uINCSINC70Y7QsdC+0Lwg0YHQu9GD0YfQsNC1INC90LDRgdGC0YDQvtC50LrQuCDQtNC+0LvQttC90Ysg0LHRi9GC0Ywg0LfQsNC00LDQvdGLINC00L4g0LfQsNC/0YPRgdC60LAg0YDQtdC90LTQtdGA0LAuXG4gICAqXG4gICAqIEBwYXJhbSBjYW52YXNJZCAtINCY0LTQtdC90YLQuNGE0LjQutCw0YLQvtGAINC60LDQvdCy0LDRgdCwLCDQvdCwINC60L7RgtC+0YDQvtC8INCx0YPQtNC10YIg0YDQuNGB0L7QstCw0YLRjNGB0Y8g0LPRgNCw0YTQuNC6LlxuICAgKiBAcGFyYW0gb3B0aW9ucyAtINCf0L7Qu9GM0LfQvtCy0LDRgtC10LvRjNGB0LrQuNC1INC90LDRgdGC0YDQvtC50LrQuCDRjdC60LfQtdC80L/Qu9GP0YDQsC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGNhbnZhc0lkOiBzdHJpbmcsIG9wdGlvbnM/OiBTUGxvdE9wdGlvbnMpIHtcblxuICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChjYW52YXNJZCkpIHtcbiAgICAgIHRoaXMuY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY2FudmFzSWQpIGFzIEhUTUxDYW52YXNFbGVtZW50XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcign0JrQsNC90LLQsNGBINGBINC40LTQtdC90YLQuNGE0LjQutCw0YLQvtGA0L7QvCBcIiMnICsgY2FudmFzSWQgKyAnXCIg0L3QtSDQvdCw0LnQtNC10L0hJylcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucykge1xuXG4gICAgICAvKiog0JXRgdC70Lgg0L/QtdGA0LXQtNCw0L3RiyDQv9C+0LvRjNC30L7QstCw0YLQtdC70YzRgdC60LjQtSDQvdCw0YHRgtGA0L7QudC60LgsINGC0L4g0L7QvdC4INC/0YDQuNC80LXQvdGP0Y7RgtGB0Y8uICovXG4gICAgICBjb3B5TWF0Y2hpbmdLZXlWYWx1ZXModGhpcywgb3B0aW9ucylcbiAgICAgIHRoaXMubGFzdFJlcXVlc3RlZE9wdGlvbnMgPSBvcHRpb25zXG5cbiAgICAgIC8qKiDQmNC90LjRhtC40LDQu9C40LfQsNGG0LjRjyDQstGB0LXRhSDQv9Cw0YDQsNC80LXRgtGA0L7QsiDRgNC10L3QtNC10YDQsCwg0LXRgdC70Lgg0LfQsNC/0YDQvtGI0LXQvSDRhNC+0YDRgdC40YDQvtCy0LDQvdC90YvQuSDQt9Cw0L/Rg9GB0LouICovXG4gICAgICBpZiAodGhpcy5mb3JjZVJ1bikge1xuICAgICAgICB0aGlzLnNldHVwKG9wdGlvbnMpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JjQvdC40YbQuNCw0LvQuNC30LjRgNGD0LXRgiDQvdC10L7QsdGF0L7QtNC40LzRi9C1INC00LvRjyDRgNC10L3QtNC10YDQsCDQv9Cw0YDQsNC80LXRgtGA0Ysg0Y3QutC30LXQvNC/0LvRj9GA0LAsINCy0YvQv9C+0LvQvdGP0LXRgiDQv9C+0LTQs9C+0YLQvtCy0LrRgyDQuCDQt9Cw0L/QvtC70L3QtdC90LjQtSDQsdGD0YTQtdGA0L7QsiBXZWJHTC5cbiAgICpcbiAgICogQHBhcmFtIG9wdGlvbnMgLSDQndCw0YHRgtGA0L7QudC60Lgg0Y3QutC30LXQvNC/0LvRj9GA0LAuXG4gICAqL1xuICBwdWJsaWMgc2V0dXAob3B0aW9ucz86IFNQbG90T3B0aW9ucyk6IHZvaWQge1xuXG4gICAgaWYgKCFvcHRpb25zKSBvcHRpb25zID0ge31cblxuICAgIC8qKiDQn9GA0LjQvNC10L3QtdC90LjQtSDQv9C+0LvRjNC30L7QstCw0YLQtdC70YzRgdC60LjRhSDQvdCw0YHRgtGA0L7QtdC6LiAqL1xuICAgIGNvcHlNYXRjaGluZ0tleVZhbHVlcyh0aGlzLCBvcHRpb25zKVxuICAgIHRoaXMubGFzdFJlcXVlc3RlZE9wdGlvbnMgPSBvcHRpb25zXG5cbiAgICB0aGlzLmRlYnVnLmxvZygnaW50cm8nKVxuXG4gICAgLyoqINCf0L7QtNCz0L7RgtC+0LLQutCwINCy0YHQtdGFINGF0LXQu9C/0LXRgNC+0LIuINCf0L7RgdC70LXQtNC+0LLQsNGC0LXQu9GM0L3QvtGB0YLRjCDQv9C+0LTQs9C+0YLQvtCy0LrQuCDQuNC80LXQtdGCINC30L3QsNGH0LXQvdC40LUuICovXG4gICAgdGhpcy5kZWJ1Zy5zZXR1cCgpXG4gICAgdGhpcy5nbHNsLnNldHVwKClcbiAgICB0aGlzLndlYmdsLnNldHVwKClcbiAgICB0aGlzLmNvbnRyb2wuc2V0dXAoKVxuICAgIHRoaXMuZGVtby5zZXR1cCgpXG5cbiAgICB0aGlzLmRlYnVnLmxvZygnaW5zdGFuY2UnKVxuXG4gICAgLyoqINCe0LHRgNCw0LHQvtGC0LrQsCDQstGB0LXRhSDQtNCw0L3QvdGL0YUg0L7QsSDQvtCx0YrQtdC60YLQsNGFINC4INC40YUg0LfQsNCz0YDRg9C30LrQsCDQsiDQsdGD0YTQtdGA0Ysg0LLQuNC00LXQvtC/0LDQvNGP0YLQuC4gKi9cbiAgICBpZiAodGhpcy5sb2FkRGF0YSkge1xuICAgICAgdGhpcy5sb2FkKClcblxuICAgICAgLyoqINCf0L4g0YPQvNC+0LvRh9Cw0L3QuNGOINC/0YDQuCDQv9C+0LLRgtC+0YDQvdC+0Lwg0LLRi9C30L7QstC1INC80LXRgtC+0LTQsCBzZXR1cCDQvdC+0LLQvtC1INGH0YLQtdC90LjQtSDQvtCx0YrQtdC60YLQvtCyINC90LUg0L/RgNC+0LjQt9Cy0L7QtNC40YLRgdGPLiAqL1xuICAgICAgdGhpcy5sb2FkRGF0YSA9IGZhbHNlXG4gICAgfVxuXG4gICAgLyoqINCU0LXQudGB0YLQstC40Y8sINC60L7RgtC+0YDRi9C1INCy0YvQv9C+0LvQvdGP0Y7RgtGB0Y8g0YLQvtC70YzQutC+INC/0YDQuCDQv9C10YDQstC+0Lwg0LLRi9C30L7QstC1INC80LXRgtC+0LTQsCBzZXR1cC4gKi9cbiAgICBpZiAoIXRoaXMuaXNTZXR1cGVkKSB7XG5cbiAgICAgIC8qKiDQodC+0LfQtNCw0L3QuNC1INC/0LXRgNC10LzQtdC90L3Ri9GFIFdlYkdsLiAqL1xuICAgICAgdGhpcy53ZWJnbC5jcmVhdGVWYXJpYWJsZXMoJ2FfcG9zaXRpb24nLCAnYV9jb2xvcicsICdhX3NpemUnLCAnYV9zaGFwZScsICd1X21hdHJpeCcpXG5cbiAgICAgIC8qKiDQn9GA0LjQt9C90LDQuiDRgtC+0LPQviwg0YfRgtC+INGN0LrQt9C10LzQv9C70Y/RgCDQutCw0Log0LzQuNC90LjQvNGD0Lwg0L7QtNC40L0g0YDQsNC3INCy0YvQv9C+0LvQvdC40Lsg0LzQtdGC0L7QtCBzZXR1cC4gKi9cbiAgICAgIHRoaXMuaXNTZXR1cGVkID0gdHJ1ZVxuICAgIH1cblxuICAgIC8qKiDQn9GA0L7QstC10YDQutCwINC60L7RgNGA0LXQutGC0L3QvtGB0YLQuCDQvdCw0YHRgtGA0L7QudC60Lgg0Y3QutC30LXQvNC/0LvRj9GA0LAuICovXG4gICAgdGhpcy5jaGVja1NldHVwKClcblxuICAgIGlmICh0aGlzLmZvcmNlUnVuKSB7XG4gICAgICAvKiog0KTQvtGA0YHQuNGA0L7QstCw0L3QvdGL0Lkg0LfQsNC/0YPRgdC6INGA0LXQvdC00LXRgNC40L3Qs9CwICjQtdGB0LvQuCDRgtGA0LXQsdGD0LXRgtGB0Y8pLiAqL1xuICAgICAgdGhpcy5ydW4oKVxuICAgIH1cbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCh0L7Qt9C00LDQtdGCINC4INC30LDQv9C+0LvQvdGP0LXRgiDQtNCw0L3QvdGL0LzQuCDQvtCx0L4g0LLRgdC10YUg0L7QsdGK0LXQutGC0LDRhSDQsdGD0YTQtdGA0YsgV2ViR0wuXG4gICAqL1xuICBwcm90ZWN0ZWQgbG9hZCgpOiB2b2lkIHtcblxuICAgIHRoaXMuZGVidWcubG9nKCdsb2FkaW5nJylcblxuICAgIGxldCBncm91cHMgPSB7IHZlcnRpY2VzOiBbXSBhcyBudW1iZXJbXSwgY29sb3JzOiBbXSBhcyBudW1iZXJbXSwgc2l6ZXM6IFtdIGFzIG51bWJlcltdLCBzaGFwZXM6IFtdIGFzIG51bWJlcltdIH1cbiAgICB0aGlzLnN0YXRzID0geyBvYmpUb3RhbENvdW50OiAwLCBvYmpJbkdyb3VwQ291bnQ6IFtdIGFzIG51bWJlcltdLCBncm91cHNDb3VudDogMCwgbWVtVXNhZ2U6IDAgfVxuXG4gICAgbGV0IG9iamVjdDogU1Bsb3RPYmplY3QgfCBudWxsIHwgdW5kZWZpbmVkXG4gICAgbGV0IGk6IG51bWJlciA9IDBcbiAgICBsZXQgaXNPYmplY3RFbmRzOiBib29sZWFuID0gZmFsc2VcblxuICAgIHdoaWxlICghaXNPYmplY3RFbmRzKSB7XG5cbiAgICAgIG9iamVjdCA9IHRoaXMuaXRlcmF0b3IhKClcbiAgICAgIGlzT2JqZWN0RW5kcyA9IChvYmplY3QgPT09IG51bGwpIHx8ICh0aGlzLnN0YXRzLm9ialRvdGFsQ291bnQgPj0gdGhpcy5nbG9iYWxMaW1pdClcblxuICAgICAgaWYgKCFpc09iamVjdEVuZHMpIHtcbiAgICAgICAgZ3JvdXBzLnZlcnRpY2VzLnB1c2gob2JqZWN0IS54LCBvYmplY3QhLnkpXG4gICAgICAgIGdyb3Vwcy5zaGFwZXMucHVzaChvYmplY3QhLnNoYXBlKVxuICAgICAgICBncm91cHMuc2l6ZXMucHVzaChvYmplY3QhLnNpemUpXG4gICAgICAgIGdyb3Vwcy5jb2xvcnMucHVzaChvYmplY3QhLmNvbG9yKVxuICAgICAgICB0aGlzLnN0YXRzLm9ialRvdGFsQ291bnQrK1xuICAgICAgICBpKytcbiAgICAgIH1cblxuICAgICAgaWYgKChpID49IHRoaXMuZ3JvdXBMaW1pdCkgfHwgaXNPYmplY3RFbmRzKSB7XG4gICAgICAgIHRoaXMuc3RhdHMub2JqSW5Hcm91cENvdW50W3RoaXMuc3RhdHMuZ3JvdXBzQ291bnRdID0gaVxuXG4gICAgICAgIC8qKiDQodC+0LfQtNCw0L3QuNC1INC4INC30LDQv9C+0LvQvdC10L3QuNC1INCx0YPRhNC10YDQvtCyINC00LDQvdC90YvQvNC4INC+INGC0LXQutGD0YnQtdC5INCz0YDRg9C/0L/QtSDQvtCx0YrQtdC60YLQvtCyLiAqL1xuICAgICAgICB0aGlzLnN0YXRzLm1lbVVzYWdlICs9XG4gICAgICAgICAgdGhpcy53ZWJnbC5jcmVhdGVCdWZmZXIoJ3ZlcnRpY2VzJywgbmV3IEZsb2F0MzJBcnJheShncm91cHMudmVydGljZXMpKSArXG4gICAgICAgICAgdGhpcy53ZWJnbC5jcmVhdGVCdWZmZXIoJ2NvbG9ycycsIG5ldyBVaW50OEFycmF5KGdyb3Vwcy5jb2xvcnMpKSArXG4gICAgICAgICAgdGhpcy53ZWJnbC5jcmVhdGVCdWZmZXIoJ3NoYXBlcycsIG5ldyBVaW50OEFycmF5KGdyb3Vwcy5zaGFwZXMpKSArXG4gICAgICAgICAgdGhpcy53ZWJnbC5jcmVhdGVCdWZmZXIoJ3NpemVzJywgbmV3IEZsb2F0MzJBcnJheShncm91cHMuc2l6ZXMpKVxuICAgICAgfVxuXG4gICAgICBpZiAoKGkgPj0gdGhpcy5ncm91cExpbWl0KSAmJiAhaXNPYmplY3RFbmRzKSB7XG4gICAgICAgIHRoaXMuc3RhdHMuZ3JvdXBzQ291bnQrK1xuICAgICAgICBncm91cHMgPSB7IHZlcnRpY2VzOiBbXSwgY29sb3JzOiBbXSwgc2l6ZXM6IFtdLCBzaGFwZXM6IFtdIH1cbiAgICAgICAgaSA9IDBcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmRlYnVnLmxvZygnbG9hZGVkJylcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCf0YDQvtC40LfQstC+0LTQuNGCINGA0LXQvdC00LXRgNC40L3QsyDQs9GA0LDRhNC40LrQsCDQsiDRgdC+0L7RgtCy0LXRgtGB0YLQstC40Lgg0YEg0YLQtdC60YPRidC40LzQuCDQv9Cw0YDQsNC80LXRgtGA0LDQvNC4INGC0YDQsNC90YHRhNC+0YDQvNCw0YbQuNC4LlxuICAgKi9cbiAgcHVibGljIHJlbmRlcigpOiB2b2lkIHtcblxuICAgIC8qKiDQntGH0LjRgdGC0LrQsCDQvtCx0YrQtdC60YLQsCDRgNC10L3QtNC10YDQuNC90LPQsCBXZWJHTC4gKi9cbiAgICB0aGlzLndlYmdsLmNsZWFyQmFja2dyb3VuZCgpXG5cbiAgICAvKiog0J7QsdC90L7QstC70LXQvdC40LUg0LzQsNGC0YDQuNGG0Ysg0YLRgNCw0L3RgdGE0L7RgNC80LDRhtC40LguICovXG4gICAgdGhpcy5jb250cm9sLnVwZGF0ZVZpZXdQcm9qZWN0aW9uKClcblxuICAgIC8qKiDQn9GA0LjQstGP0LfQutCwINC80LDRgtGA0LjRhtGLINGC0YDQsNC90YHRhNC+0YDQvNCw0YbQuNC4INC6INC/0LXRgNC10LzQtdC90L3QvtC5INGI0LXQudC00LXRgNCwLiAqL1xuICAgIHRoaXMud2ViZ2wuc2V0VmFyaWFibGUoJ3VfbWF0cml4JywgdGhpcy5jb250cm9sLnRyYW5zZm9ybS52aWV3UHJvamVjdGlvbk1hdClcblxuICAgIC8qKiDQmNGC0LXRgNC40YDQvtCy0LDQvdC40LUg0Lgg0YDQtdC90LTQtdGA0LjQvdCzINCz0YDRg9C/0L8g0LHRg9GE0LXRgNC+0LIgV2ViR0wuICovXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnN0YXRzLmdyb3Vwc0NvdW50OyBpKyspIHtcblxuICAgICAgdGhpcy53ZWJnbC5zZXRCdWZmZXIoJ3ZlcnRpY2VzJywgaSwgJ2FfcG9zaXRpb24nLCAyLCAwLCAwKVxuICAgICAgdGhpcy53ZWJnbC5zZXRCdWZmZXIoJ2NvbG9ycycsIGksICdhX2NvbG9yJywgMSwgMCwgMClcbiAgICAgIHRoaXMud2ViZ2wuc2V0QnVmZmVyKCdzaXplcycsIGksICdhX3NpemUnLCAxLCAwLCAwKVxuICAgICAgdGhpcy53ZWJnbC5zZXRCdWZmZXIoJ3NoYXBlcycsIGksICdhX3NoYXBlJywgMSwgMCwgMClcblxuICAgICAgdGhpcy53ZWJnbC5kcmF3UG9pbnRzKDAsIHRoaXMuc3RhdHMub2JqSW5Hcm91cENvdW50W2ldKVxuICAgIH1cbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCf0YDQvtCy0LXRgNGP0LXRgiDQutC+0YDRgNC10LrRgtC90L7RgdGC0Ywg0L3QsNGB0YLRgNC+0LXQuiDRjdC60LfQtdC80L/Qu9GP0YDQsC5cbiAgICpcbiAgICogQHJlbWFya3NcbiAgICog0JjRgdC/0L7Qu9GM0LfRg9C10YLRgdGPINC00LvRjyDQv9GA0L7QstC10YDQutC4INC60L7RgNGA0LXQutGC0L3QvtGB0YLQuCDQu9C+0LPQuNC60Lgg0YDQsNCx0L7RgtGLINC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjyDRgSDRjdC60LfQtdC80L/Qu9GP0YDQvtC8LiDQndC1INC/0L7Qt9Cy0L7Qu9GP0LXRgiDRgNCw0LHQvtGC0LDRgtGMINGBXG4gICAqINC90LXQvdCw0YHRgtGA0L7QtdC90L3Ri9C8INC40LvQuCDQvdC10LrQvtGA0YDQtdC60YLQvdC+INC90LDRgdGC0YDQvtC10L3QvdGL0Lwg0Y3QutC30LXQvNC/0LvRj9GA0L7QvC5cbiAgICovXG4gIGNoZWNrU2V0dXAoKSB7XG5cbiAgICAvKipcbiAgICAgKiAg0J/QvtC70YzQt9C+0LLQsNGC0LXQu9GMINC80L7QsyDQvdCw0YHRgtGA0L7QuNGC0Ywg0Y3QutC30LXQvNC/0LvRj9GAINCyINC60L7QvdGB0YLRgNGD0LrRgtC+0YDQtSDQuCDRgdGA0LDQt9GDINC30LDQv9GD0YHRgtC40YLRjCDRgNC10L3QtNC10YAsINCyINGC0LDQutC+0Lwg0YHQu9GD0YfQsNC1INC80LXRgtC+0LQgc2V0dXBcbiAgICAgKiAg0LHRg9C00LXRgiDQstGL0LfRi9Cy0LDQtdGC0YHRjyDQvdC10Y/QstC90L4uXG4gICAgICovXG4gICAgaWYgKCF0aGlzLmlzU2V0dXBlZCkge1xuICAgICAgdGhpcy5zZXR1cCgpXG4gICAgfVxuXG4gICAgLyoqINCd0LDQsdC+0YAg0L/RgNC+0LLQtdGA0L7QuiDQutC+0YDRgNC10LrRgtC90L7RgdGC0Lgg0L3QsNGB0YLRgNC+0LnQutC4INGN0LrQt9C10LzQv9C70Y/RgNCwLiAqL1xuICAgIGlmICghdGhpcy5pdGVyYXRvcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCfQndC1INC30LDQtNCw0L3QsCDRhNGD0L3QutGG0LjRjyDQuNGC0LXRgNC40YDQvtCy0LDQvdC40Y8g0L7QsdGK0LXQutGC0L7QsiEnKVxuICAgIH1cbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCX0LDQv9GD0YHQutCw0LXRgiDRgNC10L3QtNC10YDQuNC90LMg0Lgg0LrQvtC90YLRgNC+0LvRjCDRg9C/0YDQsNCy0LvQtdC90LjRjy5cbiAgICovXG4gIHB1YmxpYyBydW4oKTogdm9pZCB7XG5cbiAgICB0aGlzLmNoZWNrU2V0dXAoKVxuXG4gICAgaWYgKCF0aGlzLmlzUnVubmluZykge1xuICAgICAgdGhpcy5yZW5kZXIoKVxuICAgICAgdGhpcy5jb250cm9sLnJ1bigpXG4gICAgICB0aGlzLmlzUnVubmluZyA9IHRydWVcbiAgICAgIHRoaXMuZGVidWcubG9nKCdzdGFydGVkJylcbiAgICB9XG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQntGB0YLQsNC90LDQstC70LjQstCw0LXRgiDRgNC10L3QtNC10YDQuNC90LMg0Lgg0LrQvtC90YLRgNC+0LvRjCDRg9C/0YDQsNCy0LvQtdC90LjRjy5cbiAgICovXG4gIHB1YmxpYyBzdG9wKCk6IHZvaWQge1xuXG4gICAgdGhpcy5jaGVja1NldHVwKClcblxuICAgIGlmICh0aGlzLmlzUnVubmluZykge1xuICAgICAgdGhpcy5jb250cm9sLnN0b3AoKVxuICAgICAgdGhpcy5pc1J1bm5pbmcgPSBmYWxzZVxuICAgICAgdGhpcy5kZWJ1Zy5sb2coJ3N0b3BlZCcpXG4gICAgfVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0J7Rh9C40YnQsNC10YIg0YTQvtC9LlxuICAgKi9cbiAgcHVibGljIGNsZWFyKCk6IHZvaWQge1xuXG4gICAgdGhpcy5jaGVja1NldHVwKClcblxuICAgIHRoaXMud2ViZ2wuY2xlYXJCYWNrZ3JvdW5kKClcbiAgICB0aGlzLmRlYnVnLmxvZygnY2xlYXJlZCcpXG4gIH1cbn1cbiIsIlxuLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqXG4gKiDQn9GA0L7QstC10YDRj9C10YIg0Y/QstC70Y/QtdGC0YHRjyDQu9C4INC/0LXRgNC10LzQtdC90L3QsNGPINGN0LrQt9C10LzQv9C70Y/RgNC+0Lwg0LrQsNC60L7Qs9C+LdC70LjQsdC+0L4g0LrQu9Cw0YHRgdCwLlxuICpcbiAqIEBwYXJhbSB2YXJpYWJsZSAtINCf0YDQvtCy0LXRgNGP0LXQvNCw0Y8g0L/QtdGA0LXQvNC10L3QvdCw0Y8uXG4gKiBAcmV0dXJucyDQoNC10LfRg9C70YzRgtCw0YIg0L/RgNC+0LLQtdGA0LrQuC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzT2JqZWN0KHZhcmlhYmxlOiBhbnkpOiBib29sZWFuIHtcbiAgcmV0dXJuIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFyaWFibGUpID09PSAnW29iamVjdCBPYmplY3RdJylcbn1cblxuLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqXG4gKiDQn9C10YDQtdC+0L/RgNC10LTQtdC70Y/QtdGCINC30L3QsNGH0LXQvdC40Y8g0L/QvtC70LXQuSDQvtCx0YrQtdC60YLQsCB0YXJnZXQg0L3QsCDQt9C90LDRh9C10L3QuNGPINC/0L7Qu9C10Lkg0L7QsdGK0LXQutGC0LAgc291cmNlLlxuICpcbiAqIEByZW1hcmtzXG4gKiDQn9C10YDQtdC+0L/RgNC10LTQtdC70Y/RjtGC0YHRjyDRgtC+0LvRjNC60L4g0YLQtSDQv9C+0LvRjywg0LrQvtGC0L7RgNGL0LUg0YHRg9GJ0LXRgdGC0LLRg9C10Y7RgiDQsiB0YXJnZXQuINCV0YHQu9C4INCyIHNvdXJjZSDQtdGB0YLRjCDQv9C+0LvRjywg0LrQvtGC0L7RgNGL0YUg0L3QtdGCINCyIHRhcmdldCwg0YLQviDQvtC90LhcbiAqINC40LPQvdC+0YDQuNGA0YPRjtGC0YHRjy4g0JXRgdC70Lgg0LrQsNC60LjQtS3RgtC+INC/0L7Qu9GPINGB0LDQvNC4INGP0LLQu9GP0Y7RgtGB0Y8g0Y/QstC70Y/RjtGC0YHRjyDQvtCx0YrQtdC60YLQsNC80LgsINGC0L4g0YLQviDQvtC90Lgg0YLQsNC60LbQtSDRgNC10LrRg9GA0YHQuNCy0L3QviDQutC+0L/QuNGA0YPRjtGC0YHRjyAo0L/RgNC4INGC0L7QvCDQttC1XG4gKiDRg9GB0LvQvtCy0LjQuCwg0YfRgtC+INCyINGG0LXQu9C10LLQvtC8INC+0LHRitC10LrRgtC1INGB0YPRidC10YHRgtCy0YPRjtGCINC/0L7Qu9GPINC+0LHRitC10LrRgtCwLdC40YHRgtC+0YfQvdC40LrQsCkuXG4gKlxuICogQHBhcmFtIHRhcmdldCAtINCm0LXQu9C10LLQvtC5ICjQuNC30LzQtdC90Y/QtdC80YvQuSkg0L7QsdGK0LXQutGCLlxuICogQHBhcmFtIHNvdXJjZSAtINCe0LHRitC10LrRgiDRgSDQtNCw0L3QvdGL0LzQuCwg0LrQvtGC0L7RgNGL0LUg0L3Rg9C20L3QviDRg9GB0YLQsNC90L7QstC40YLRjCDRgyDRhtC10LvQtdCy0L7Qs9C+INC+0LHRitC10LrRgtCwLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY29weU1hdGNoaW5nS2V5VmFsdWVzKHRhcmdldDogYW55LCBzb3VyY2U6IGFueSk6IHZvaWQge1xuICBPYmplY3Qua2V5cyhzb3VyY2UpLmZvckVhY2goa2V5ID0+IHtcbiAgICBpZiAoa2V5IGluIHRhcmdldCkge1xuICAgICAgaWYgKGlzT2JqZWN0KHNvdXJjZVtrZXldKSkge1xuICAgICAgICBpZiAoaXNPYmplY3QodGFyZ2V0W2tleV0pKSB7XG4gICAgICAgICAgY29weU1hdGNoaW5nS2V5VmFsdWVzKHRhcmdldFtrZXldLCBzb3VyY2Vba2V5XSlcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCFpc09iamVjdCh0YXJnZXRba2V5XSkgJiYgKHR5cGVvZiB0YXJnZXRba2V5XSAhPT0gJ2Z1bmN0aW9uJykpIHtcbiAgICAgICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pXG59XG5cbi8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKlxuICog0JLQvtC30LLRgNCw0YnQsNC10YIg0YHQu9GD0YfQsNC50L3QvtC1INGG0LXQu9C+0LUg0YfQuNGB0LvQviDQsiDQtNC40LDQv9Cw0LfQvtC90LU6IFswLi4ucmFuZ2UtMV0uXG4gKlxuICogQHBhcmFtIHJhbmdlIC0g0JLQtdGA0YXQvdC40Lkg0L/RgNC10LTQtdC7INC00LjQsNC/0LDQt9C+0L3QsCDRgdC70YPRh9Cw0LnQvdC+0LPQviDQstGL0LHQvtGA0LAuXG4gKiBAcmV0dXJucyDQodC70YPRh9Cw0LnQvdC+0LUg0YfQuNGB0LvQvi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJhbmRvbUludChyYW5nZTogbnVtYmVyKTogbnVtYmVyIHtcbiAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHJhbmdlKVxufVxuXG4vKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICpcbiAqINCa0L7QvdCy0LXRgNGC0LjRgNGD0LXRgiDRhtCy0LXRgiDQuNC3IEhFWC3RhNC+0YDQvNCw0YLQsCDQsiBHTFNMLdGE0L7RgNC80LDRgi5cbiAqXG4gKiBAcGFyYW0gaGV4Q29sb3IgLSDQptCy0LXRgiDQsiBIRVgt0YTQvtGA0LzQsNGC0LUgKFwiI2ZmZmZmZlwiKS5cbiAqIEByZXR1cm5zINCc0LDRgdGB0LjQsiDQuNC3INGC0YDQtdGFINGH0LjRgdC10Lsg0LIg0LTQuNCw0L/QsNC30L7QvdC1INC+0YIgMCDQtNC+IDEuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb2xvckZyb21IZXhUb0dsUmdiKGhleENvbG9yOiBzdHJpbmcpOiBudW1iZXJbXSB7XG4gIGxldCBrID0gL14jPyhbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KSQvaS5leGVjKGhleENvbG9yKVxuICBsZXQgW3IsIGcsIGJdID0gW3BhcnNlSW50KGshWzFdLCAxNikgLyAyNTUsIHBhcnNlSW50KGshWzJdLCAxNikgLyAyNTUsIHBhcnNlSW50KGshWzNdLCAxNikgLyAyNTVdXG4gIHJldHVybiBbciwgZywgYl1cbn1cblxuLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqXG4gKiDQktC+0LfQstGA0LDRidCw0LXRgiDRgdGC0YDQvtC60L7QstGD0Y4g0LfQsNC/0LjRgdGMINGC0LXQutGD0YnQtdCz0L4g0LLRgNC10LzQtdC90LguXG4gKlxuICogQHJldHVybnMg0KHRgtGA0L7QutCwINCy0YDQtdC80LXQvdC4INCyINGE0L7RgNC80LDRgtC1IFwiaGg6bW06c3NcIi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEN1cnJlbnRUaW1lKCk6IHN0cmluZyB7XG5cbiAgbGV0IHRvZGF5ID0gbmV3IERhdGUoKVxuXG4gIHJldHVybiBbXG4gICAgdG9kYXkuZ2V0SG91cnMoKS50b1N0cmluZygpLnBhZFN0YXJ0KDIsICcwJyksXG4gICAgdG9kYXkuZ2V0TWludXRlcygpLnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgJzAnKSxcbiAgICB0b2RheS5nZXRTZWNvbmRzKCkudG9TdHJpbmcoKS5wYWRTdGFydCgyLCAnMCcpXG4gIF0uam9pbignOicpXG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IFNQbG90IGZyb20gJ0Avc3Bsb3QnXG5pbXBvcnQgJ0Avc3R5bGUnXG5cbi8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5cbmxldCBuID0gMV8wMDBfMDAwXG5sZXQgY29sb3JzID0gWycjRDgxQzAxJywgJyNFOTk2N0EnLCAnI0JBNTVEMycsICcjRkZENzAwJywgJyNGRkU0QjUnLCAnI0ZGOEMwMCcsICcjMjI4QjIyJywgJyM5MEVFOTAnLCAnIzQxNjlFMScsICcjMDBCRkZGJywgJyM4QjQ1MTMnLCAnIzAwQ0VEMSddXG5sZXQgd2lkdGggPSAzMl8wMDBcbmxldCBoZWlnaHQgPSAxNl8wMDBcblxuLyoqINCh0LjQvdGC0LXRgtC40YfQtdGB0LrQsNGPINC40YLQtdGA0LjRgNGD0Y7RidCw0Y8g0YTRg9C90LrRhtC40Y8uICovXG5sZXQgaSA9IDBcbmZ1bmN0aW9uIHJlYWROZXh0T2JqZWN0KCkge1xuICBpZiAoaSA8IG4pIHtcbiAgICBpKytcbiAgICByZXR1cm4ge1xuICAgICAgeDogcmFuZG9tSW50KHdpZHRoKSxcbiAgICAgIHk6IHJhbmRvbUludChoZWlnaHQpLFxuICAgICAgc2hhcGU6IHJhbmRvbUludCg1KSxcbiAgICAgIHNpemU6IDEwICsgcmFuZG9tSW50KDIxKSxcbiAgICAgIGNvbG9yOiByYW5kb21JbnQoY29sb3JzLmxlbmd0aClcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaSA9IDBcbiAgICByZXR1cm4gbnVsbCAgLy8g0JLQvtC30LLRgNCw0YnQsNC10LwgbnVsbCwg0LrQvtCz0LTQsCDQvtCx0YrQtdC60YLRiyBcItC30LDQutC+0L3Rh9C40LvQuNGB0YxcIi5cbiAgfVxufVxuXG5mdW5jdGlvbiByYW5kb21JbnQocmFuZ2UpIHtcbiAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHJhbmdlKVxufVxuXG4vKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuXG5sZXQgc2NhdHRlclBsb3QgPSBuZXcgU1Bsb3QoJ2NhbnZhczEnKVxuXG5zY2F0dGVyUGxvdC5zZXR1cCh7XG4gIGl0ZXJhdG9yOiByZWFkTmV4dE9iamVjdCxcbiAgY29sb3JzOiBjb2xvcnMsXG4gIGdyaWQ6IHtcbiAgICB3aWR0aDogd2lkdGgsXG4gICAgaGVpZ2h0OiBoZWlnaHRcbiAgfSxcbiAgZGVidWc6IHtcbiAgICBpc0VuYWJsZTogdHJ1ZSxcbiAgfSxcbiAgZGVtbzoge1xuICAgIGlzRW5hYmxlOiBmYWxzZVxuICB9LFxuICB3ZWJnbDoge1xuICAgIGZhaWxJZk1ham9yUGVyZm9ybWFuY2VDYXZlYXQ6IHRydWVcbiAgfVxufSlcblxuc2NhdHRlclBsb3QucnVuKClcbiJdLCJzb3VyY2VSb290IjoiIn0=