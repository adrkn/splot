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
/** ======================================================================== **/
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

/***/ "./shader-code-frag-tmpl.ts":
/*!**********************************!*\
  !*** ./shader-code-frag-tmpl.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.default = "\nprecision lowp float;\nvarying vec3 v_color;\nvarying float v_shape;\nvoid main() {\n  if (v_shape == 0.0) {\n    if (length(gl_PointCoord - 0.5) > 0.5) { discard; };\n  } else if (v_shape == 1.0) {\n\n  } else if (v_shape == 2.0) {\n    if ( ((gl_PointCoord.x < 0.3) && (gl_PointCoord.y < 0.3)) ||\n      ((gl_PointCoord.x > 0.7) && (gl_PointCoord.y < 0.3)) ||\n      ((gl_PointCoord.x > 0.7) && (gl_PointCoord.y > 0.7)) ||\n      ((gl_PointCoord.x < 0.3) && (gl_PointCoord.y > 0.7)) )\n      { discard; };\n  }\n  gl_FragColor = vec4(v_color.rgb, 1.0);\n}\n";
/*

  &&
  (gl_PointCoord.y >   (0.86602540378 − 1.73205080756 * gl_PointCoord.x)   ) &&
    (gl_PointCoord.y > (1.73205080756 * gl_PointCoord.x - 0.86602540378))

*/
/**
 *
 *
 *   } else if (v_shape == 3.0) {
    if ( (gl_PointCoord.y > 0.86602540378) &&
      (gl_PointCoord.y > (0.86602540378 − (1.73205080756 * gl_PointCoord.x))) )
      { discard; };
  }

 * y = −1.73205080756x + 0.86602540378
 * y =  1.73205080756x − 0.86602540378
 *
 * (gl_PointCoord.y > (−1.73205080756 * gl_PointCoord.x + 0.86602540378))
 * (gl_PointCoord.y > (1.73205080756 * gl_PointCoord.x - 0.86602540378))
 *
 *
 *
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
exports.default = "\nattribute vec2 a_position;\nattribute float a_color;\nattribute float a_size;\nattribute float a_shape;\nuniform mat3 u_matrix;\nvarying vec3 v_color;\nvarying float v_shape;\nvoid main() {\n  gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0.0, 1.0);\n  gl_PointSize = a_size;\n  v_shape = a_shape;\n  {COLOR-CODE}\n}\n";


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
var shader_code_vert_tmpl_1 = __importDefault(__webpack_require__(/*! ./shader-code-vert-tmpl */ "./shader-code-vert-tmpl.ts"));
var shader_code_frag_tmpl_1 = __importDefault(__webpack_require__(/*! ./shader-code-frag-tmpl */ "./shader-code-frag-tmpl.ts"));
var splot_control_1 = __importDefault(__webpack_require__(/*! ./splot-control */ "./splot-control.ts"));
var splot_webgl_1 = __importDefault(__webpack_require__(/*! ./splot-webgl */ "./splot-webgl.ts"));
var splot_debug_1 = __importDefault(__webpack_require__(/*! ./splot-debug */ "./splot-debug.ts"));
var splot_demo_1 = __importDefault(__webpack_require__(/*! ./splot-demo */ "./splot-demo.ts"));
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
        this.shapesCount = 3;
        /** GLSL-коды шейдеров. */
        this.shaderCodeVert = '';
        this.shaderCodeFrag = '';
        /** Статистическая информация. */
        this.stats = {
            objTotalCount: 0,
            objInGroupCount: [],
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
    /** ****************************************************************************
     *
     * Инициализирует необходимые для рендера параметры экземпляра, выполняет подготовку и заполнение буферов WebGL.
     *
     * @param options - Настройки экземпляра.
     */
    SPlot.prototype.setup = function (options) {
        /** Применение пользовательских настроек. */
        this.setOptions(options);
        this.debug.log('intro');
        /** Подготовка всех хелперов. */
        this.webgl.setup();
        this.control.setup();
        this.debug.setup();
        this.demo.setup();
        this.debug.log('instance');
        /** Установка фонового цвета канваса (цвет очистки контекста рендеринга). */
        this.webgl.setBgColor(this.grid.bgColor);
        /** Создание шейдеров и программы WebGL. */
        this.shaderCodeVert = shader_code_vert_tmpl_1.default.replace('{COLOR-CODE}', this.genShaderColorCode()).trim();
        this.shaderCodeFrag = shader_code_frag_tmpl_1.default.trim();
        this.webgl.createProgram(this.shaderCodeVert, this.shaderCodeFrag);
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
     * Применяет настройки экземпляра.
     *
     * @param options - Настройки экземпляра.
     */
    SPlot.prototype.setOptions = function (options) {
        /** Применение пользовательских настроек. */
        utils_1.copyMatchingKeyValues(this, options);
        /** Если задан размер плоскости, но не задано положение области просмотра, то она помещается в центр плоскости. */
        if (('grid' in options) && !('camera' in options)) {
            this.camera.x = this.grid.width / 2;
            this.camera.y = this.grid.height / 2;
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
    /** ****************************************************************************
     *
     * Останавливает рендеринг и контроль управления.
     */
    SPlot.prototype.stop = function () {
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
        this.webgl.clearBackground();
        this.debug.log('cleared');
    };
    /** ****************************************************************************
     *
     * Создает дополнение к коду на языке GLSL.
     *
     * @remarks
     * Т.к. шейдер не позволяет использовать в качестве индексов переменные - для задания цвета используется
     * посоедовательный перебор цветовых индексов.
     *
     * @returns Код на языке GLSL.
     */
    SPlot.prototype.genShaderColorCode = function () {
        /** Временное добавление в палитру вершин цвета направляющих. */
        this.colors.push(this.grid.rulesColor);
        var code = '';
        /** Формировние GLSL-кода установки цвета по индексу. */
        this.colors.forEach(function (value, index) {
            var _a = utils_1.colorFromHexToGlRgb(value), r = _a[0], g = _a[1], b = _a[2];
            code += "else if (a_color == " + index + ".0) v_color = vec3(" + r + ", " + g + ", " + b + ");\n";
        });
        /** Удаление из палитры вершин временно добавленного цвета направляющих. */
        this.colors.pop();
        /** Удаление лишнего "else" в начале GLSL-кода. */
        return code.slice(5);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zdHlsZS5jc3MiLCJ3ZWJwYWNrOi8vLy4vaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vbWF0aDN4My50cyIsIndlYnBhY2s6Ly8vLi9zaGFkZXItY29kZS1mcmFnLXRtcGwudHMiLCJ3ZWJwYWNrOi8vLy4vc2hhZGVyLWNvZGUtdmVydC10bXBsLnRzIiwid2VicGFjazovLy8uL3NwbG90LWNvbnRyb2wudHMiLCJ3ZWJwYWNrOi8vLy4vc3Bsb3QtZGVidWcudHMiLCJ3ZWJwYWNrOi8vLy4vc3Bsb3QtZGVtby50cyIsIndlYnBhY2s6Ly8vLi9zcGxvdC13ZWJnbC50cyIsIndlYnBhY2s6Ly8vLi9zcGxvdC50cyIsIndlYnBhY2s6Ly8vLi91dGlscy50cyIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svc3RhcnR1cCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0FDQUEsK0RBQW1DO0FBQ25DLGdGQUEyQjtBQUMzQixrREFBZ0I7QUFFaEIsZ0ZBQWdGO0FBRWhGLElBQUksQ0FBQyxHQUFHLE9BQVM7QUFDakIsSUFBSSxNQUFNLEdBQUcsQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQztBQUNqSixJQUFJLEtBQUssR0FBRyxLQUFNO0FBQ2xCLElBQUksTUFBTSxHQUFHLEtBQU07QUFFbkIseUNBQXlDO0FBQ3pDLElBQUksQ0FBQyxHQUFHLENBQUM7QUFDVCxTQUFTLGNBQWM7SUFDckIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQ1QsQ0FBQyxFQUFFO1FBQ0gsT0FBTztZQUNMLENBQUMsRUFBRSxpQkFBUyxDQUFDLEtBQUssQ0FBQztZQUNuQixDQUFDLEVBQUUsaUJBQVMsQ0FBQyxNQUFNLENBQUM7WUFDcEIsS0FBSyxFQUFFLGlCQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ25CLElBQUksRUFBRSxFQUFFLEdBQUcsaUJBQVMsQ0FBQyxFQUFFLENBQUM7WUFDeEIsS0FBSyxFQUFFLGlCQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztTQUNoQztLQUNGO1NBQU07UUFDTCxDQUFDLEdBQUcsQ0FBQztRQUNMLE9BQU8sSUFBSSxFQUFFLGdEQUFnRDtLQUM5RDtBQUNILENBQUM7QUFFRCxnRkFBZ0Y7QUFFaEYsSUFBSSxXQUFXLEdBQUcsSUFBSSxlQUFLLENBQUMsU0FBUyxDQUFDO0FBRXRDLFdBQVcsQ0FBQyxLQUFLLENBQUM7SUFDaEIsUUFBUSxFQUFFLGNBQWM7SUFDeEIsTUFBTSxFQUFFLE1BQU07SUFDZCxJQUFJLEVBQUU7UUFDSixLQUFLLEVBQUUsS0FBSztRQUNaLE1BQU0sRUFBRSxNQUFNO0tBQ2Y7SUFDRCxLQUFLLEVBQUU7UUFDTCxRQUFRLEVBQUUsSUFBSTtLQUNmO0lBQ0QsSUFBSSxFQUFFO1FBQ0osUUFBUSxFQUFFLEtBQUs7S0FDaEI7Q0FDRixDQUFDO0FBRUYsV0FBVyxDQUFDLEdBQUcsRUFBRTtBQUVqQiw0Q0FBNEM7Ozs7Ozs7Ozs7Ozs7O0FDakQ1Qzs7R0FFRztBQUNILFNBQWdCLFFBQVEsQ0FBQyxDQUFXLEVBQUUsQ0FBVztJQUMvQyxPQUFPO1FBQ0wsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FB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LEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNyQyxJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3JDLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckMsSUFBTSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7SUFDdEQsT0FBTztRQUNKLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsR0FBRyxHQUFHO1FBQzNCLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQy9CLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENB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LEdBQUcsQ0FBQztRQUM5QyxLQUFLLENBQUMsVUFBVSxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUM7S0FDL0MsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO0FBQ2IsQ0FBQztBQVRELHdDQVNDOzs7Ozs7O1VDL0VEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBLHNEQUFzRCxrQkFBa0I7V0FDeEU7V0FDQSwrQ0FBK0MsY0FBYztXQUM3RCxFOzs7OztVQ05BO1VBQ0E7VUFDQTtVQUNBIiwiZmlsZSI6InNjcmlwdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsImltcG9ydCB7IHJhbmRvbUludCB9IGZyb20gJy4vdXRpbHMnXG5pbXBvcnQgU1Bsb3QgZnJvbSAnLi9zcGxvdCdcbmltcG9ydCAnQC9zdHlsZSdcblxuLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cblxubGV0IG4gPSAxXzAwMF8wMDBcbmxldCBjb2xvcnMgPSBbJyNEODFDMDEnLCAnI0U5OTY3QScsICcjQkE1NUQzJywgJyNGRkQ3MDAnLCAnI0ZGRTRCNScsICcjRkY4QzAwJywgJyMyMjhCMjInLCAnIzkwRUU5MCcsICcjNDE2OUUxJywgJyMwMEJGRkYnLCAnIzhCNDUxMycsICcjMDBDRUQxJ11cbmxldCB3aWR0aCA9IDMyXzAwMFxubGV0IGhlaWdodCA9IDE2XzAwMFxuXG4vKiog0KHQuNC90YLQtdGC0LjRh9C10YHQutCw0Y8g0LjRgtC10YDQuNGA0YPRjtGJ0LDRjyDRhNGD0L3QutGG0LjRjy4gKi9cbmxldCBpID0gMFxuZnVuY3Rpb24gcmVhZE5leHRPYmplY3QoKSB7XG4gIGlmIChpIDwgbikge1xuICAgIGkrK1xuICAgIHJldHVybiB7XG4gICAgICB4OiByYW5kb21JbnQod2lkdGgpLFxuICAgICAgeTogcmFuZG9tSW50KGhlaWdodCksXG4gICAgICBzaGFwZTogcmFuZG9tSW50KDMpLFxuICAgICAgc2l6ZTogMTAgKyByYW5kb21JbnQoMjEpLFxuICAgICAgY29sb3I6IHJhbmRvbUludChjb2xvcnMubGVuZ3RoKVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpID0gMFxuICAgIHJldHVybiBudWxsICAvLyDQktC+0LfQstGA0LDRidCw0LXQvCBudWxsLCDQutC+0LPQtNCwINC+0LHRitC10LrRgtGLIFwi0LfQsNC60L7QvdGH0LjQu9C40YHRjFwiLlxuICB9XG59XG5cbi8qKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKiovXG5cbmxldCBzY2F0dGVyUGxvdCA9IG5ldyBTUGxvdCgnY2FudmFzMScpXG5cbnNjYXR0ZXJQbG90LnNldHVwKHtcbiAgaXRlcmF0b3I6IHJlYWROZXh0T2JqZWN0LFxuICBjb2xvcnM6IGNvbG9ycyxcbiAgZ3JpZDoge1xuICAgIHdpZHRoOiB3aWR0aCxcbiAgICBoZWlnaHQ6IGhlaWdodFxuICB9LFxuICBkZWJ1Zzoge1xuICAgIGlzRW5hYmxlOiB0cnVlLFxuICB9LFxuICBkZW1vOiB7XG4gICAgaXNFbmFibGU6IGZhbHNlXG4gIH1cbn0pXG5cbnNjYXR0ZXJQbG90LnJ1bigpXG5cbi8vc2V0VGltZW91dCgoKSA9PiBzY2F0dGVyUGxvdC5zdG9wKCksIDMwMDApXG4iLCJcbi8qKlxuICog0KPQvNC90L7QttCw0LXRgiDQvNCw0YLRgNC40YbRiy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG11bHRpcGx5KGE6IG51bWJlcltdLCBiOiBudW1iZXJbXSk6IG51bWJlcltdIHtcbiAgcmV0dXJuIFtcbiAgICBiWzBdICogYVswXSArIGJbMV0gKiBhWzNdICsgYlsyXSAqIGFbNl0sXG4gICAgYlswXSAqIGFbMV0gKyBiWzFdICogYVs0XSArIGJbMl0gKiBhWzddLFxuICAgIGJbMF0gKiBhWzJdICsgYlsxXSAqIGFbNV0gKyBiWzJdICogYVs4XSxcbiAgICBiWzNdICogYVswXSArIGJbNF0gKiBhWzNdICsgYls1XSAqIGFbNl0sXG4gICAgYlszXSAqIGFbMV0gKyBiWzRdICogYVs0XSArIGJbNV0gKiBhWzddLFxuICAgIGJbM10gKiBhWzJdICsgYls0XSAqIGFbNV0gKyBiWzVdICogYVs4XSxcbiAgICBiWzZdICogYVswXSArIGJbN10gKiBhWzNdICsgYls4XSAqIGFbNl0sXG4gICAgYls2XSAqIGFbMV0gKyBiWzddICogYVs0XSArIGJbOF0gKiBhWzddLFxuICAgIGJbNl0gKiBhWzJdICsgYls3XSAqIGFbNV0gKyBiWzhdICogYVs4XVxuICBdXG59XG5cbi8qKlxuICog0KHQvtC30LTQsNC10YIg0LXQtNC40L3QuNGH0L3Rg9GOINC80LDRgtGA0LjRhtGDLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaWRlbnRpdHkoKTogbnVtYmVyW10ge1xuICByZXR1cm4gW1xuICAgIDEsIDAsIDAsXG4gICAgMCwgMSwgMCxcbiAgICAwLCAwLCAxXG4gIF1cbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgMkQgcHJvamVjdGlvbiBtYXRyaXguIFJldHVybnMgYSBwcm9qZWN0aW9uIG1hdHJpeCB0aGF0IGNvbnZlcnRzIGZyb20gcGl4ZWxzIHRvIGNsaXBzcGFjZSB3aXRoIFkgPSAwIGF0IHRoZVxuICogdG9wLiBUaGlzIG1hdHJpeCBmbGlwcyB0aGUgWSBheGlzIHNvIDAgaXMgYXQgdGhlIHRvcC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHByb2plY3Rpb24od2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpOiBudW1iZXJbXSB7XG4gIHJldHVybiBbXG4gICAgMiAvIHdpZHRoLCAwLCAwLFxuICAgIDAsIC0yIC8gaGVpZ2h0LCAwLFxuICAgIC0xLCAxLCAxXG4gIF1cbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgMkQgdHJhbnNsYXRpb24gbWF0cml4LiBSZXR1cm5zIGEgdHJhbnNsYXRpb24gbWF0cml4IHRoYXQgdHJhbnNsYXRlcyBieSB0eCBhbmQgdHkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0cmFuc2xhdGlvbih0eDogbnVtYmVyLCB0eTogbnVtYmVyKTogbnVtYmVyW10ge1xuICByZXR1cm4gW1xuICAgIDEsIDAsIDAsXG4gICAgMCwgMSwgMCxcbiAgICB0eCwgdHksIDFcbiAgXVxufVxuXG4vKipcbiAqIE11bHRpcGxpZXMgYnkgYSAyRCB0cmFuc2xhdGlvbiBtYXRyaXhcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRyYW5zbGF0ZShtOiBudW1iZXJbXSwgdHg6IG51bWJlciwgdHk6IG51bWJlcik6IG51bWJlcltdIHtcbiAgcmV0dXJuIG11bHRpcGx5KG0sIHRyYW5zbGF0aW9uKHR4LCB0eSkpXG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIDJEIHNjYWxpbmcgbWF0cml4XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzY2FsaW5nKHN4OiBudW1iZXIsIHN5OiBudW1iZXIpOiBudW1iZXJbXSB7XG4gIHJldHVybiBbXG4gICAgc3gsIDAsIDAsXG4gICAgMCwgc3ksIDAsXG4gICAgMCwgMCwgMVxuICBdXG59XG5cbi8qKlxuICogTXVsdGlwbGllcyBieSBhIDJEIHNjYWxpbmcgbWF0cml4XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzY2FsZShtOiBudW1iZXJbXSwgc3g6IG51bWJlciwgc3k6IG51bWJlcik6IG51bWJlcltdIHtcbiAgcmV0dXJuIG11bHRpcGx5KG0sIHNjYWxpbmcoc3gsIHN5KSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRyYW5zZm9ybVBvaW50KG06IG51bWJlcltdLCB2OiBudW1iZXJbXSk6IG51bWJlcltdIHtcbiAgY29uc3QgZCA9IHZbMF0gKiBtWzJdICsgdlsxXSAqIG1bNV0gKyBtWzhdXG4gIHJldHVybiBbXG4gICAgKHZbMF0gKiBtWzBdICsgdlsxXSAqIG1bM10gKyBtWzZdKSAvIGQsXG4gICAgKHZbMF0gKiBtWzFdICsgdlsxXSAqIG1bNF0gKyBtWzddKSAvIGRcbiAgXVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaW52ZXJzZShtOiBudW1iZXJbXSk6IG51bWJlcltdIHtcbiAgY29uc3QgdDAwID0gbVs0XSAqIG1bOF0gLSBtWzVdICogbVs3XVxuICBjb25zdCB0MTAgPSBtWzFdICogbVs4XSAtIG1bMl0gKiBtWzddXG4gIGNvbnN0IHQyMCA9IG1bMV0gKiBtWzVdIC0gbVsyXSAqIG1bNF1cbiAgY29uc3QgZCA9IDEuMCAvIChtWzBdICogdDAwIC0gbVszXSAqIHQxMCArIG1bNl0gKiB0MjApXG4gIHJldHVybiBbXG4gICAgIGQgKiB0MDAsIC1kICogdDEwLCBkICogdDIwLFxuICAgIC1kICogKG1bM10gKiBtWzhdIC0gbVs1XSAqIG1bNl0pLFxuICAgICBkICogKG1bMF0gKiBtWzhdIC0gbVsyXSAqIG1bNl0pLFxuICAgIC1kICogKG1bMF0gKiBtWzVdIC0gbVsyXSAqIG1bM10pLFxuICAgICBkICogKG1bM10gKiBtWzddIC0gbVs0XSAqIG1bNl0pLFxuICAgIC1kICogKG1bMF0gKiBtWzddIC0gbVsxXSAqIG1bNl0pLFxuICAgICBkICogKG1bMF0gKiBtWzRdIC0gbVsxXSAqIG1bM10pXG4gIF1cbn1cbiIsImV4cG9ydCBkZWZhdWx0XG5gXG5wcmVjaXNpb24gbG93cCBmbG9hdDtcbnZhcnlpbmcgdmVjMyB2X2NvbG9yO1xudmFyeWluZyBmbG9hdCB2X3NoYXBlO1xudm9pZCBtYWluKCkge1xuICBpZiAodl9zaGFwZSA9PSAwLjApIHtcbiAgICBpZiAobGVuZ3RoKGdsX1BvaW50Q29vcmQgLSAwLjUpID4gMC41KSB7IGRpc2NhcmQ7IH07XG4gIH0gZWxzZSBpZiAodl9zaGFwZSA9PSAxLjApIHtcblxuICB9IGVsc2UgaWYgKHZfc2hhcGUgPT0gMi4wKSB7XG4gICAgaWYgKCAoKGdsX1BvaW50Q29vcmQueCA8IDAuMykgJiYgKGdsX1BvaW50Q29vcmQueSA8IDAuMykpIHx8XG4gICAgICAoKGdsX1BvaW50Q29vcmQueCA+IDAuNykgJiYgKGdsX1BvaW50Q29vcmQueSA8IDAuMykpIHx8XG4gICAgICAoKGdsX1BvaW50Q29vcmQueCA+IDAuNykgJiYgKGdsX1BvaW50Q29vcmQueSA+IDAuNykpIHx8XG4gICAgICAoKGdsX1BvaW50Q29vcmQueCA8IDAuMykgJiYgKGdsX1BvaW50Q29vcmQueSA+IDAuNykpIClcbiAgICAgIHsgZGlzY2FyZDsgfTtcbiAgfVxuICBnbF9GcmFnQ29sb3IgPSB2ZWM0KHZfY29sb3IucmdiLCAxLjApO1xufVxuYFxuXG4vKlxuXG4gICYmXG4gIChnbF9Qb2ludENvb3JkLnkgPiAgICgwLjg2NjAyNTQwMzc4IOKIkiAxLjczMjA1MDgwNzU2ICogZ2xfUG9pbnRDb29yZC54KSAgICkgJiZcbiAgICAoZ2xfUG9pbnRDb29yZC55ID4gKDEuNzMyMDUwODA3NTYgKiBnbF9Qb2ludENvb3JkLnggLSAwLjg2NjAyNTQwMzc4KSlcblxuKi9cblxuLyoqXG4gKlxuICpcbiAqICAgfSBlbHNlIGlmICh2X3NoYXBlID09IDMuMCkge1xuICAgIGlmICggKGdsX1BvaW50Q29vcmQueSA+IDAuODY2MDI1NDAzNzgpICYmXG4gICAgICAoZ2xfUG9pbnRDb29yZC55ID4gKDAuODY2MDI1NDAzNzgg4oiSICgxLjczMjA1MDgwNzU2ICogZ2xfUG9pbnRDb29yZC54KSkpIClcbiAgICAgIHsgZGlzY2FyZDsgfTtcbiAgfVxuXG4gKiB5ID0g4oiSMS43MzIwNTA4MDc1NnggKyAwLjg2NjAyNTQwMzc4XG4gKiB5ID0gIDEuNzMyMDUwODA3NTZ4IOKIkiAwLjg2NjAyNTQwMzc4XG4gKlxuICogKGdsX1BvaW50Q29vcmQueSA+ICjiiJIxLjczMjA1MDgwNzU2ICogZ2xfUG9pbnRDb29yZC54ICsgMC44NjYwMjU0MDM3OCkpXG4gKiAoZ2xfUG9pbnRDb29yZC55ID4gKDEuNzMyMDUwODA3NTYgKiBnbF9Qb2ludENvb3JkLnggLSAwLjg2NjAyNTQwMzc4KSlcbiAqXG4gKlxuICpcbmV4cG9ydCBkZWZhdWx0XG4gIGBcbnByZWNpc2lvbiBsb3dwIGZsb2F0O1xudmFyeWluZyB2ZWMzIHZfY29sb3I7XG52b2lkIG1haW4oKSB7XG4gIGZsb2F0IHZTaXplID0gMjAuMDtcbiAgZmxvYXQgZGlzdGFuY2UgPSBsZW5ndGgoMi4wICogZ2xfUG9pbnRDb29yZCAtIDEuMCk7XG4gIGlmIChkaXN0YW5jZSA+IDEuMCkgeyBkaXNjYXJkOyB9XG4gIGdsX0ZyYWdDb2xvciA9IHZlYzQodl9jb2xvci5yZ2IsIDEuMCk7XG5cbiAgIHZlYzQgdUVkZ2VDb2xvciA9IHZlYzQoMC41LCAwLjUsIDAuNSwgMS4wKTtcbiBmbG9hdCB1RWRnZVNpemUgPSAxLjA7XG5cbmZsb2F0IHNFZGdlID0gc21vb3Roc3RlcChcbiAgdlNpemUgLSB1RWRnZVNpemUgLSAyLjAsXG4gIHZTaXplIC0gdUVkZ2VTaXplLFxuICBkaXN0YW5jZSAqICh2U2l6ZSArIHVFZGdlU2l6ZSlcbik7XG5nbF9GcmFnQ29sb3IgPSAodUVkZ2VDb2xvciAqIHNFZGdlKSArICgoMS4wIC0gc0VkZ2UpICogZ2xfRnJhZ0NvbG9yKTtcblxuZ2xfRnJhZ0NvbG9yLmEgPSBnbF9GcmFnQ29sb3IuYSAqICgxLjAgLSBzbW9vdGhzdGVwKFxuICAgIHZTaXplIC0gMi4wLFxuICAgIHZTaXplLFxuICAgIGRpc3RhbmNlICogdlNpemVcbikpO1xuXG59XG5gXG4qL1xuIiwiZXhwb3J0IGRlZmF1bHRcbmBcbmF0dHJpYnV0ZSB2ZWMyIGFfcG9zaXRpb247XG5hdHRyaWJ1dGUgZmxvYXQgYV9jb2xvcjtcbmF0dHJpYnV0ZSBmbG9hdCBhX3NpemU7XG5hdHRyaWJ1dGUgZmxvYXQgYV9zaGFwZTtcbnVuaWZvcm0gbWF0MyB1X21hdHJpeDtcbnZhcnlpbmcgdmVjMyB2X2NvbG9yO1xudmFyeWluZyBmbG9hdCB2X3NoYXBlO1xudm9pZCBtYWluKCkge1xuICBnbF9Qb3NpdGlvbiA9IHZlYzQoKHVfbWF0cml4ICogdmVjMyhhX3Bvc2l0aW9uLCAxKSkueHksIDAuMCwgMS4wKTtcbiAgZ2xfUG9pbnRTaXplID0gYV9zaXplO1xuICB2X3NoYXBlID0gYV9zaGFwZTtcbiAge0NPTE9SLUNPREV9XG59XG5gXG4iLCJpbXBvcnQgU1Bsb3QgZnJvbSAnLi9zcGxvdCdcbmltcG9ydCAqIGFzIG0zIGZyb20gJy4vbWF0aDN4MydcblxuLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqXG4gKiDQmtC70LDRgdGBLdGF0LXQu9C/0LXRgCwg0YDQtdCw0LvQuNC30YPRjtGJ0LjQuSDQvtCx0YDQsNCx0L7RgtC60YMg0YHRgNC10LTRgdGC0LIg0LLQstC+0LTQsCAo0LzRi9GI0LgsINGC0YDQtdC60L/QsNC00LAg0Lgg0YIu0L8uKSDQuCDQvNCw0YLQtdC80LDRgtC40YfQtdGB0LrQuNC1INGA0LDRgdGH0LXRgtGLINGC0LXRhdC90LjRh9C10YHQutC40YUg0LTQsNC90L3Ri9GFLFxuICog0YHQvtC+0YLQstC10YLRgdCy0YPRjtGJ0LjRhSDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjRj9C8INCz0YDQsNGE0LjQutCwINC00LvRjyDQutC70LDRgdGB0LAgU3Bsb3QuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNQbG90Q29udG9sIHtcblxuICAvKiog0KLQtdGF0L3QuNGH0LXRgdC60LDRjyDQuNC90YTQvtGA0LzQsNGG0LjRjywg0LjRgdC/0L7Qu9GM0LfRg9C10LzQsNGPINC/0YDQuNC70L7QttC10L3QuNC10Lwg0LTQu9GPINGA0LDRgdGH0LXRgtCwINGC0YDQsNC90YHRhNC+0YDQvNCw0YbQuNC5LiAqL1xuICBwdWJsaWMgdHJhbnNmb3JtOiBTUGxvdFRyYW5zZm9ybSA9IHtcbiAgICB2aWV3UHJvamVjdGlvbk1hdDogW10sXG4gICAgc3RhcnRJbnZWaWV3UHJvak1hdDogW10sXG4gICAgc3RhcnRDYW1lcmE6IHsgeDogMCwgeTogMCwgem9vbTogMSB9LFxuICAgIHN0YXJ0UG9zOiBbXSxcbiAgICBzdGFydENsaXBQb3M6IFtdLFxuICAgIHN0YXJ0TW91c2VQb3M6IFtdXG4gIH1cblxuICAvKiog0J7QsdGA0LDQsdC+0YLRh9C40LrQuCDRgdC+0LHRi9GC0LjQuSDRgSDQt9Cw0LrRgNC10L/Qu9C10L3QvdGL0LzQuCDQutC+0L3RgtC10LrRgdGC0LDQvNC4LiAqL1xuICBwcm90ZWN0ZWQgaGFuZGxlTW91c2VEb3duV2l0aENvbnRleHQ6IEV2ZW50TGlzdGVuZXIgPSB0aGlzLmhhbmRsZU1vdXNlRG93bi5iaW5kKHRoaXMpIGFzIEV2ZW50TGlzdGVuZXJcbiAgcHJvdGVjdGVkIGhhbmRsZU1vdXNlV2hlZWxXaXRoQ29udGV4dDogRXZlbnRMaXN0ZW5lciA9IHRoaXMuaGFuZGxlTW91c2VXaGVlbC5iaW5kKHRoaXMpIGFzIEV2ZW50TGlzdGVuZXJcbiAgcHJvdGVjdGVkIGhhbmRsZU1vdXNlTW92ZVdpdGhDb250ZXh0OiBFdmVudExpc3RlbmVyID0gdGhpcy5oYW5kbGVNb3VzZU1vdmUuYmluZCh0aGlzKSBhcyBFdmVudExpc3RlbmVyXG4gIHByb3RlY3RlZCBoYW5kbGVNb3VzZVVwV2l0aENvbnRleHQ6IEV2ZW50TGlzdGVuZXIgPSB0aGlzLmhhbmRsZU1vdXNlVXAuYmluZCh0aGlzKSBhcyBFdmVudExpc3RlbmVyXG5cbiAgLyoqINCl0LXQu9C/0LXRgCDQsdGD0LTQtdGCINC40LzQtdGC0Ywg0L/QvtC70L3Ri9C5INC00L7RgdGC0YPQvyDQuiDRjdC60LfQtdC80L/Qu9GP0YDRgyBTUGxvdC4gKi9cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSByZWFkb25seSBzcGxvdDogU1Bsb3RcbiAgKSB7IH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQn9C+0LTQs9C+0YLQsNCy0LvQuNCy0LDQtdGCINGF0LXQu9C/0LXRgCDQuiDQuNGB0L/QvtC70YzQt9C+0LLQsNC90LjRji5cbiAgICovXG4gIHNldHVwKCk6IHZvaWQge1xuXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQl9Cw0L/Rg9GB0LrQsNC10YIg0L/RgNC+0YHQu9GD0YjQutGDINGB0L7QsdGL0YLQuNC5INC80YvRiNC4LlxuICAgKi9cbiAgcHVibGljIHJ1bigpOiB2b2lkIHtcbiAgICB0aGlzLnNwbG90LmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLmhhbmRsZU1vdXNlRG93bldpdGhDb250ZXh0KVxuICAgIHRoaXMuc3Bsb3QuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ3doZWVsJywgdGhpcy5oYW5kbGVNb3VzZVdoZWVsV2l0aENvbnRleHQpXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQntGB0YLQsNC90LDQstC70LjQstCw0LXRgiDQv9GA0L7RgdC70YPRiNC60YMg0YHQvtCx0YvRgtC40Lkg0LzRi9GI0LguXG4gICAqL1xuICBwdWJsaWMgc3RvcCgpOiB2b2lkIHtcbiAgICB0aGlzLnNwbG90LmNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLmhhbmRsZU1vdXNlRG93bldpdGhDb250ZXh0KVxuICAgIHRoaXMuc3Bsb3QuY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3doZWVsJywgdGhpcy5oYW5kbGVNb3VzZVdoZWVsV2l0aENvbnRleHQpXG4gICAgdGhpcy5zcGxvdC5jYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5oYW5kbGVNb3VzZU1vdmVXaXRoQ29udGV4dClcbiAgICB0aGlzLnNwbG90LmNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5oYW5kbGVNb3VzZVVwV2l0aENvbnRleHQpXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQodC+0LfQtNCw0LXRgiDQvNCw0YLRgNC40YbRgyDQtNC70Y8g0YLQtdC60YPRidC10LPQviDQv9C+0LvQvtC20LXQvdC40Y8g0L7QsdC70LDRgdGC0Lgg0L/RgNC+0YHQvNC+0YLRgNCwLlxuICAgKi9cbiAgcHJvdGVjdGVkIG1ha2VDYW1lcmFNYXRyaXgoKTogbnVtYmVyW10ge1xuXG4gICAgY29uc3Qgem9vbVNjYWxlID0gMSAvIHRoaXMuc3Bsb3QuY2FtZXJhLnpvb20hXG5cbiAgICBsZXQgY2FtZXJhTWF0ID0gbTMuaWRlbnRpdHkoKVxuICAgIGNhbWVyYU1hdCA9IG0zLnRyYW5zbGF0ZShjYW1lcmFNYXQsIHRoaXMuc3Bsb3QuY2FtZXJhLnghLCB0aGlzLnNwbG90LmNhbWVyYS55ISlcbiAgICBjYW1lcmFNYXQgPSBtMy5zY2FsZShjYW1lcmFNYXQsIHpvb21TY2FsZSwgem9vbVNjYWxlKVxuXG4gICAgcmV0dXJuIGNhbWVyYU1hdFxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0J7QsdC90L7QstC70Y/QtdGCINC80LDRgtGA0LjRhtGDINGC0YDQsNC90YHRhNC+0YDQvNCw0YbQuNC4LlxuICAgKi9cbiAgcHVibGljIHVwZGF0ZVZpZXdQcm9qZWN0aW9uKCk6IHZvaWQge1xuICAgIGNvbnN0IHByb2plY3Rpb25NYXQgPSBtMy5wcm9qZWN0aW9uKHRoaXMuc3Bsb3QuY2FudmFzLndpZHRoLCB0aGlzLnNwbG90LmNhbnZhcy5oZWlnaHQpXG4gICAgY29uc3QgY2FtZXJhTWF0ID0gdGhpcy5tYWtlQ2FtZXJhTWF0cml4KClcbiAgICBsZXQgdmlld01hdCA9IG0zLmludmVyc2UoY2FtZXJhTWF0KVxuICAgIHRoaXMudHJhbnNmb3JtLnZpZXdQcm9qZWN0aW9uTWF0ID0gbTMubXVsdGlwbHkocHJvamVjdGlvbk1hdCwgdmlld01hdClcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCf0YDQtdC+0LHRgNCw0LfRg9C10YIg0LrQvtC+0YDQtNC40L3QsNGC0Ysg0LzRi9GI0Lgg0LIgR0wt0LrQvtC+0YDQtNC40L3QsNGC0YsuXG4gICAqL1xuICBwcm90ZWN0ZWQgZ2V0Q2xpcFNwYWNlTW91c2VQb3NpdGlvbihldmVudDogTW91c2VFdmVudCk6IG51bWJlcltdIHtcblxuICAgIC8qKiDQoNCw0YHRh9C10YIg0L/QvtC70L7QttC10L3QuNGPINC60LDQvdCy0LDRgdCwINC/0L4g0L7RgtC90L7RiNC10L3QuNGOINC6INC80YvRiNC4LiAqL1xuICAgIGNvbnN0IHJlY3QgPSB0aGlzLnNwbG90LmNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgIGNvbnN0IGNzc1ggPSBldmVudC5jbGllbnRYIC0gcmVjdC5sZWZ0XG4gICAgY29uc3QgY3NzWSA9IGV2ZW50LmNsaWVudFkgLSByZWN0LnRvcFxuXG4gICAgLyoqINCd0L7RgNC80LDQu9C40LfQsNGG0LjRjyDQutC+0L7RgNC00LjQvdCw0YIgWzAuLjFdICovXG4gICAgY29uc3Qgbm9ybVggPSBjc3NYIC8gdGhpcy5zcGxvdC5jYW52YXMuY2xpZW50V2lkdGhcbiAgICBjb25zdCBub3JtWSA9IGNzc1kgLyB0aGlzLnNwbG90LmNhbnZhcy5jbGllbnRIZWlnaHRcblxuICAgIC8qKiDQn9C+0LvRg9GH0LXQvdC40LUgR0wt0LrQvtC+0YDQtNC40L3QsNGCIFstMS4uMV0gKi9cbiAgICBjb25zdCBjbGlwWCA9IG5vcm1YICogMiAtIDFcbiAgICBjb25zdCBjbGlwWSA9IG5vcm1ZICogLTIgKyAxXG5cbiAgICByZXR1cm4gW2NsaXBYLCBjbGlwWV1cbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCf0LXRgNC10LzQtdGJ0LDQtdGCINC+0LHQu9Cw0YHRgtGMINCy0LjQtNC40LzQvtGB0YLQuC5cbiAgICovXG4gIHByb3RlY3RlZCBtb3ZlQ2FtZXJhKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG5cbiAgICBjb25zdCBwb3MgPSBtMy50cmFuc2Zvcm1Qb2ludCh0aGlzLnRyYW5zZm9ybS5zdGFydEludlZpZXdQcm9qTWF0LCB0aGlzLmdldENsaXBTcGFjZU1vdXNlUG9zaXRpb24oZXZlbnQpKVxuXG4gICAgdGhpcy5zcGxvdC5jYW1lcmEueCA9IHRoaXMudHJhbnNmb3JtLnN0YXJ0Q2FtZXJhLnghICsgdGhpcy50cmFuc2Zvcm0uc3RhcnRQb3NbMF0gLSBwb3NbMF1cbiAgICB0aGlzLnNwbG90LmNhbWVyYS55ID0gdGhpcy50cmFuc2Zvcm0uc3RhcnRDYW1lcmEueSEgKyB0aGlzLnRyYW5zZm9ybS5zdGFydFBvc1sxXSAtIHBvc1sxXVxuXG4gICAgdGhpcy5zcGxvdC5yZW5kZXIoKVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0KDQtdCw0LPQuNGA0YPQtdGCINC90LAg0LTQstC40LbQtdC90LjQtSDQvNGL0YjQuCDQsiDQvNC+0LzQtdC90YIsINC60L7Qs9C00LAg0LXQtSDQutC70LDQstC40YjQsCDRg9C00LXRgNC20LjQstCw0LXRgtGB0Y8g0L3QsNC20LDRgtC+0LkuINCc0LXRgtC+0LQg0L/QtdGA0LXQvNC10YnQsNC10YIg0L7QsdC70LDRgdGC0Ywg0LLQuNC00LjQvNC+0YHRgtC4INC90LBcbiAgICog0L/Qu9C+0YHQutC+0YHRgtC4INCy0LzQtdGB0YLQtSDRgSDQtNCy0LjQttC10L3QuNC10Lwg0LzRi9GI0LguXG4gICAqL1xuICBwcm90ZWN0ZWQgaGFuZGxlTW91c2VNb3ZlKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG4gICAgdGhpcy5tb3ZlQ2FtZXJhKGV2ZW50KVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0KDQtdCw0LPQuNGA0YPQtdGCINC90LAg0L7RgtC20LDRgtC40LUg0LrQu9Cw0LLQuNGI0Lgg0LzRi9GI0LguINCSINC80L7QvNC10L3RgiDQvtGC0LbQsNGC0LjRjyDQutC70LDQstC40YjQuCDQsNC90LDQu9C40Lcg0LTQstC40LbQtdC90LjRjyDQvNGL0YjQuCDRgSDQt9Cw0LbQsNGC0L7QuSDQutC70LDQstC40YjQtdC5INC/0YDQtdC60YDQsNGJ0LDQtdGC0YHRjy5cbiAgICovXG4gIHByb3RlY3RlZCBoYW5kbGVNb3VzZVVwKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG5cbiAgICB0aGlzLnNwbG90LnJlbmRlcigpXG5cbiAgICBldmVudC50YXJnZXQhLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMuaGFuZGxlTW91c2VNb3ZlV2l0aENvbnRleHQpXG4gICAgZXZlbnQudGFyZ2V0IS5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5oYW5kbGVNb3VzZVVwV2l0aENvbnRleHQpXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQoNC10LDQs9C40YDRg9C10YIg0L3QsCDQvdCw0LbQsNGC0LjQtSDQutC70LDQstC40YjQuCDQvNGL0YjQuC4g0JIg0LzQvtC80LXQvdGCINC90LDQttCw0YLQuNGPINC4INGD0LTQtdGA0LbQsNC90LjRjyDQutC70LDQstC40YjQuCDQt9Cw0L/Rg9GB0LrQsNC10YLRgdGPINCw0L3QsNC70LjQtyDQtNCy0LjQttC10L3QuNGPINC80YvRiNC4ICjRgSDQt9Cw0LbQsNGC0L7QuVxuICAgKiDQutC70LDQstC40YjQtdC5KS5cbiAgICovXG4gIHByb3RlY3RlZCBoYW5kbGVNb3VzZURvd24oZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcblxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcblxuICAgIHRoaXMuc3Bsb3QuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMuaGFuZGxlTW91c2VNb3ZlV2l0aENvbnRleHQpXG4gICAgdGhpcy5zcGxvdC5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuaGFuZGxlTW91c2VVcFdpdGhDb250ZXh0KVxuXG4gICAgLyoqINCg0LDRgdGH0LXRgiDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuS4gKi9cbiAgICB0aGlzLnRyYW5zZm9ybS5zdGFydEludlZpZXdQcm9qTWF0ID0gbTMuaW52ZXJzZSh0aGlzLnRyYW5zZm9ybS52aWV3UHJvamVjdGlvbk1hdClcbiAgICB0aGlzLnRyYW5zZm9ybS5zdGFydENhbWVyYSA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3Bsb3QuY2FtZXJhKVxuICAgIHRoaXMudHJhbnNmb3JtLnN0YXJ0Q2xpcFBvcyA9IHRoaXMuZ2V0Q2xpcFNwYWNlTW91c2VQb3NpdGlvbihldmVudClcbiAgICB0aGlzLnRyYW5zZm9ybS5zdGFydFBvcyA9IG0zLnRyYW5zZm9ybVBvaW50KHRoaXMudHJhbnNmb3JtLnN0YXJ0SW52Vmlld1Byb2pNYXQsIHRoaXMudHJhbnNmb3JtLnN0YXJ0Q2xpcFBvcylcbiAgICB0aGlzLnRyYW5zZm9ybS5zdGFydE1vdXNlUG9zID0gW2V2ZW50LmNsaWVudFgsIGV2ZW50LmNsaWVudFldXG5cbiAgICB0aGlzLnNwbG90LnJlbmRlcigpXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQoNC10LDQs9C40YDRg9C10YIg0L3QsCDQt9GD0LzQuNGA0L7QstCw0L3QuNC1INC80YvRiNC4LiDQkiDQvNC+0LzQtdC90YIg0LfRg9C80LjRgNC+0LLQsNC90LjRjyDQvNGL0YjQuCDQv9GA0L7QuNGB0YXQvtC00LjRgiDQt9GD0LzQuNGA0L7QstCw0L3QuNC1INC60L7QvtGA0LTQuNC90LDRgtC90L7QuSDQv9C70L7RgdC60L7RgdGC0LguXG4gICAqL1xuICBwcm90ZWN0ZWQgaGFuZGxlTW91c2VXaGVlbChldmVudDogV2hlZWxFdmVudCk6IHZvaWQge1xuXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuXG4gICAgLyoqINCS0YvRh9C40YHQu9C10L3QuNC1INC/0L7Qt9C40YbQuNC4INC80YvRiNC4INCyIEdMLdC60L7QvtGA0LTQuNC90LDRgtCw0YUuICovXG4gICAgY29uc3QgW2NsaXBYLCBjbGlwWV0gPSB0aGlzLmdldENsaXBTcGFjZU1vdXNlUG9zaXRpb24oZXZlbnQpXG5cbiAgICAvKiog0J/QvtC30LjRhtC40Y8g0LzRi9GI0Lgg0LTQviDQt9GD0LzQuNGA0L7QstCw0L3QuNGPLiAqL1xuICAgIGNvbnN0IFtwcmVab29tWCwgcHJlWm9vbVldID0gbTMudHJhbnNmb3JtUG9pbnQobTMuaW52ZXJzZSh0aGlzLnRyYW5zZm9ybS52aWV3UHJvamVjdGlvbk1hdCksIFtjbGlwWCwgY2xpcFldKVxuXG4gICAgLyoqINCd0L7QstC+0LUg0LfQvdCw0YfQtdC90LjQtSDQt9GD0LzQsCDQvtCx0LvQsNGB0YLQuCDQv9GA0L7RgdC80L7RgtGA0LAg0Y3QutGB0L/QvtC90LXQvdGG0LjQsNC70YzQvdC+INC30LDQstC40YHQuNGCINC+0YIg0LLQtdC70LjRh9C40L3RiyDQt9GD0LzQuNGA0L7QstCw0L3QuNGPINC80YvRiNC4LiAqL1xuICAgIGNvbnN0IG5ld1pvb20gPSB0aGlzLnNwbG90LmNhbWVyYS56b29tISAqIE1hdGgucG93KDIsIGV2ZW50LmRlbHRhWSAqIC0wLjAxKVxuXG4gICAgLyoqINCc0LDQutGB0LjQvNCw0LvRjNC90L7QtSDQuCDQvNC40L3QuNC80LDQu9GM0L3QvtC1INC30L3QsNGH0LXQvdC40Y8g0LfRg9C80LAg0L7QsdC70LDRgdGC0Lgg0L/RgNC+0YHQvNC+0YLRgNCwLiAqL1xuICAgIHRoaXMuc3Bsb3QuY2FtZXJhLnpvb20gPSBNYXRoLm1heCgwLjAwMiwgTWF0aC5taW4oMjAwLCBuZXdab29tKSlcblxuICAgIC8qKiDQntCx0L3QvtCy0LvQtdC90LjQtSDQvNCw0YLRgNC40YbRiyDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuC4gKi9cbiAgICB0aGlzLnVwZGF0ZVZpZXdQcm9qZWN0aW9uKClcblxuICAgIC8qKiDQn9C+0LfQuNGG0LjRjyDQvNGL0YjQuCDQv9C+0YHQu9C1INC30YPQvNC40YDQvtCy0LDQvdC40Y8uICovXG4gICAgY29uc3QgW3Bvc3Rab29tWCwgcG9zdFpvb21ZXSA9IG0zLnRyYW5zZm9ybVBvaW50KG0zLmludmVyc2UodGhpcy50cmFuc2Zvcm0udmlld1Byb2plY3Rpb25NYXQpLCBbY2xpcFgsIGNsaXBZXSlcblxuICAgIC8qKiDQktGL0YfQuNGB0LvQtdC90LjQtSDQvdC+0LLQvtCz0L4g0L/QvtC70L7QttC10L3QuNGPINC+0LHQu9Cw0YHRgtC4INC/0YDQvtGB0LzQvtGC0YDQsCDQv9C+0YHQu9C1INC30YPQvNC40YDQvtCy0LDQvdC40Y8uICovXG4gICAgdGhpcy5zcGxvdC5jYW1lcmEueCEgKz0gcHJlWm9vbVggLSBwb3N0Wm9vbVhcbiAgICB0aGlzLnNwbG90LmNhbWVyYS55ISArPSBwcmVab29tWSAtIHBvc3Rab29tWVxuXG4gICAgdGhpcy5zcGxvdC5yZW5kZXIoKVxuICB9XG59XG4iLCJpbXBvcnQgU1Bsb3QgZnJvbSAnLi9zcGxvdCdcbmltcG9ydCB7IGdldEN1cnJlbnRUaW1lIH0gZnJvbSAnLi91dGlscydcblxuLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqXG4gKiDQmtC70LDRgdGBLdGF0LXQu9C/0LXRgCwg0YDQtdCw0LvQuNC30YPRjtGJ0LjQuSDQv9C+0LTQtNC10YDQttC60YMg0YDQtdC20LjQvNCwINC+0YLQu9Cw0LTQutC4INC00LvRjyDQutC70LDRgdGB0LAgU1Bsb3QuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNQbG90RGVidWcge1xuXG4gIC8qKiDQn9GA0LjQt9C90LDQuiDQsNC60YLQuNCy0LDRhtC40Lgg0YDQtdC20LjQvCDQvtGC0LvQsNC00LrQuC4gKi9cbiAgcHVibGljIGlzRW5hYmxlOiBib29sZWFuID0gZmFsc2VcblxuICAvKiog0KHRgtC40LvRjCDQt9Cw0LPQvtC70L7QstC60LAg0YDQtdC20LjQvNCwINC+0YLQu9Cw0LTQutC4LiAqL1xuICBwdWJsaWMgaGVhZGVyU3R5bGU6IHN0cmluZyA9ICdmb250LXdlaWdodDogYm9sZDsgY29sb3I6ICNmZmZmZmY7IGJhY2tncm91bmQtY29sb3I6ICNjYzAwMDA7J1xuXG4gIC8qKiDQodGC0LjQu9GMINC30LDQs9C+0LvQvtCy0LrQsCDQs9GA0YPQv9C/0Ysg0L/QsNGA0LDQvNC10YLRgNC+0LIuICovXG4gIHB1YmxpYyBncm91cFN0eWxlOiBzdHJpbmcgPSAnZm9udC13ZWlnaHQ6IGJvbGQ7IGNvbG9yOiAjZmZmZmZmOydcblxuICAvKiog0KXQtdC70L/QtdGAINCx0YPQtNC10YIg0LjQvNC10YLRjCDQv9C+0LvQvdGL0Lkg0LTQvtGB0YLRg9C/INC6INGN0LrQt9C10LzQv9C70Y/RgNGDIFNQbG90LiAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlYWRvbmx5IHNwbG90OiBTUGxvdFxuICApIHt9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0J/QvtC00LPQvtGC0LDQstC70LjQstCw0LXRgiDRhdC10LvQv9C10YAg0Log0LjRgdC/0L7Qu9GM0LfQvtCy0LDQvdC40Y4uXG4gICAqL1xuICBwdWJsaWMgc2V0dXAoY2xlYXJDb25zb2xlOiBib29sZWFuID0gZmFsc2UpOiB2b2lkIHtcbiAgICBpZiAoY2xlYXJDb25zb2xlKSB7XG4gICAgICBjb25zb2xlLmNsZWFyKClcbiAgICB9XG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQktGL0LLQvtC00LjRgiDQsiDQutC+0L3RgdC+0LvRjCDQvtGC0LvQsNC00L7Rh9C90YPRjiDQuNC90YTQvtGA0LzQsNGG0LjRjiwg0LXRgdC70Lgg0LLQutC70Y7Rh9C10L0g0YDQtdC20LjQvCDQvtGC0LvQsNC00LrQuC5cbiAgICpcbiAgICogQHJlbWFya3NcbiAgICog0J7RgtC70LDQtNC+0YfQvdCw0Y8g0LjQvdGE0L7RgNC80LDRhtC40Y8g0LLRi9Cy0L7QtNC40YLRgdGPINCx0LvQvtC60LDQvNC4LiDQndCw0LfQstCw0L3QuNGPINCx0LvQvtC60L7QsiDRjyDQv9C10YDQtdC00LDRjtGC0YHRjyDQsiDQvNC10YLQvtC0INC/0LXRgNC10YfQuNGB0LvQtdC90LjQtdC8INGB0YLRgNC+0LouINCa0LDQttC00LDRjyDRgdGC0YDQvtC60LBcbiAgICog0LjQvdGC0LXRgNC/0YDQtdGC0LjRgNGD0LXRgtGB0Y8g0LrQsNC6INC40LzRjyDQvNC10YLQvtC00LAuINCV0YHQu9C4INC90YPQttC90YvQtSDQvNC10YLQvtC00Ysg0LLRi9Cy0L7QtNCwINCx0LvQvtC60LAg0YHRg9GJ0LXRgdGC0LLRg9GO0YIgLSDQvtC90Lgg0LLRi9C30YvQstCw0Y7RgtGB0Y8uINCV0YHQu9C4INC80LXRgtC+0LTQsCDRgSDQvdGD0LbQvdGL0LxcbiAgICog0L3QsNC30LLQsNC90LjQtdC8INC90LUg0YHRg9GJ0LXRgdGC0LLRg9C10YIgLSDQs9C10YDQtdGA0LjRgNGD0LXRgtGB0Y8g0L7RiNC40LHQutCwLlxuICAgKlxuICAgKiBAcGFyYW0gbG9nSXRlbXMgLSDQn9C10YDQtdGH0LjRgdC70LXQvdC40LUg0YHRgtGA0L7QuiDRgSDQvdCw0LfQstCw0L3QuNGP0LzQuCDQvtGC0LvQsNC00L7Rh9C90YvRhSDQsdC70L7QutC+0LIsINC60L7RgtC+0YDRi9C1INC90YPQttC90L4g0L7RgtC+0LHRgNCw0LfQuNGC0Ywg0LIg0LrQvtC90YHQvtC70LguXG4gICAqL1xuICBwdWJsaWMgbG9nKC4uLmxvZ0l0ZW1zOiBzdHJpbmdbXSk6IHZvaWQge1xuICAgIGlmICh0aGlzLmlzRW5hYmxlKSB7XG4gICAgICBsb2dJdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICBpZiAodHlwZW9mICh0aGlzIGFzIGFueSlbaXRlbV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAodGhpcyBhcyBhbnkpW2l0ZW1dKClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ9Ce0YLQu9Cw0LTQvtGH0L3QvtCz0L4g0LHQu9C+0LrQsCAnICsgaXRlbSArICdcIiDQvdC1INGB0YPRidC10YHRgtCy0YPQtdGCIScpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JLRi9Cy0L7QtNC40YIg0LLRgdGC0YPQv9C40YLQtdC70YzQvdGD0Y4g0YfQsNGB0YLRjCDQviDRgNC10LbQuNC80LUg0L7RgtC70LDQtNC60LguXG4gICAqL1xuICBwdWJsaWMgaW50cm8oKTogdm9pZCB7XG4gICAgY29uc29sZS5sb2coJyVj0J7RgtC70LDQtNC60LAgU1Bsb3Qg0L3QsCDQvtCx0YrQtdC60YLQtSAjJyArIHRoaXMuc3Bsb3QuY2FudmFzLmlkLCB0aGlzLmhlYWRlclN0eWxlKVxuXG4gICAgaWYgKHRoaXMuc3Bsb3QuZGVtby5pc0VuYWJsZSkge1xuICAgICAgY29uc29sZS5sb2coJyVj0JLQutC70Y7Rh9C10L0g0LTQtdC80L7QvdGB0YLRgNCw0YbQuNC+0L3QvdGL0Lkg0YDQtdC20LjQvCDQtNCw0L3QvdGL0YUnLCB0aGlzLmdyb3VwU3R5bGUpXG4gICAgfVxuXG4gICAgY29uc29sZS5ncm91cCgnJWPQn9GA0LXQtNGD0L/RgNC10LbQtNC10L3QuNC1JywgdGhpcy5ncm91cFN0eWxlKVxuICAgIGNvbnNvbGUubG9nKCfQntGC0LrRgNGL0YLQsNGPINC60L7QvdGB0L7Qu9GMINCx0YDQsNGD0LfQtdGA0LAg0Lgg0LTRgNGD0LPQuNC1INCw0LrRgtC40LLQvdGL0LUg0YHRgNC10LTRgdGC0LLQsCDQutC+0L3RgtGA0L7Qu9GPINGA0LDQt9GA0LDQsdC+0YLQutC4INGB0YPRidC10YHRgtCy0LXQvdC90L4g0YHQvdC40LbQsNGO0YIg0L/RgNC+0LjQt9Cy0L7QtNC40YLQtdC70YzQvdC+0YHRgtGMINCy0YvRgdC+0LrQvtC90LDQs9GA0YPQttC10L3QvdGL0YUg0L/RgNC40LvQvtC20LXQvdC40LkuINCU0LvRjyDQvtCx0YrQtdC60YLQuNCy0L3QvtCz0L4g0LDQvdCw0LvQuNC30LAg0L/RgNC+0LjQt9Cy0L7QtNC40YLQtdC70YzQvdC+0YHRgtC4INCy0YHQtSDQv9C+0LTQvtCx0L3Ri9C1INGB0YDQtdC00YHRgtCy0LAg0LTQvtC70LbQvdGLINCx0YvRgtGMINC+0YLQutC70Y7Rh9C10L3Riywg0LAg0LrQvtC90YHQvtC70Ywg0LHRgHrQsNGD0LfQtdGA0LAg0LfQsNC60YDRi9GC0LAuINCd0LXQutC+0YLQvtGA0YvQtSDQtNCw0L3QvdGL0LUg0L7RgtC70LDQtNC+0YfQvdC+0Lkg0LjQvdGE0L7RgNC80LDRhtC40Lgg0LIg0LfQsNCy0LjRgdC40LzQvtGB0YLQuCDQvtGCINC40YHQv9C+0LvRjNC30YPQtdC80L7Qs9C+INCx0YDQsNGD0LfQtdGA0LAg0LzQvtCz0YPRgiDQvdC1INC+0YLQvtCx0YDQsNC20LDRgtGM0YHRjyDQuNC70Lgg0L7RgtC+0LHRgNCw0LbQsNGC0YzRgdGPINC90LXQutC+0YDRgNC10LrRgtC90L4uINCh0YDQtdC00YHRgtCy0L4g0L7RgtC70LDQtNC60Lgg0L/RgNC+0YLQtdGB0YLQuNGA0L7QstCw0L3QviDQsiDQsdGA0LDRg9C30LXRgNC1IEdvb2dsZSBDaHJvbWUgdi45MCcpXG4gICAgY29uc29sZS5ncm91cEVuZCgpXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQktGL0LLQvtC00LjRgiDQuNC90YTQvtGA0LzQsNGG0LjRjiDQviDQs9GA0LDRhNC40YfQtdGB0LrQvtC5INGB0LjRgdGC0LXQvNC1INC60LvQuNC10L3RgtCwLlxuICAgKi9cbiAgcHVibGljIGdwdSgpOiB2b2lkIHtcbiAgICBjb25zb2xlLmdyb3VwKCclY9CS0LjQtNC10L7RgdC40YHRgtC10LzQsCcsIHRoaXMuZ3JvdXBTdHlsZSlcbiAgICBjb25zb2xlLmxvZygn0JPRgNCw0YTQuNGH0LXRgdC60LDRjyDQutCw0YDRgtCwOiAnICsgdGhpcy5zcGxvdC53ZWJnbC5ncHUuaGFyZHdhcmUpXG4gICAgY29uc29sZS5sb2coJ9CS0LXRgNGB0LjRjyBHTDogJyArIHRoaXMuc3Bsb3Qud2ViZ2wuZ3B1LnNvZnR3YXJlKVxuICAgIGNvbnNvbGUuZ3JvdXBFbmQoKVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JLRi9Cy0L7QtNC40YIg0LjQvdGE0L7RgNC80LDRhtC40Y8g0L4g0YLQtdC60YPRidC10Lwg0Y3QutC30LXQvNC/0LvRj9GA0LUg0LrQu9Cw0YHRgdCwIFNQbG90LlxuICAgKi9cbiAgcHVibGljIGluc3RhbmNlKCk6IHZvaWQge1xuXG4gICAgY29uc29sZS5ncm91cCgnJWPQndCw0YHRgtGA0L7QudC60LAg0L/QsNGA0LDQvNC10YLRgNC+0LIg0Y3QutC30LXQvNC/0LvRj9GA0LAnLCB0aGlzLmdyb3VwU3R5bGUpXG4gICAgY29uc29sZS5kaXIodGhpcy5zcGxvdClcbiAgICBjb25zb2xlLmxvZygn0KDQsNC30LzQtdGAINC60LDQvdCy0LDRgdCwOiAnICsgdGhpcy5zcGxvdC5jYW52YXMud2lkdGggKyAnIHggJyArIHRoaXMuc3Bsb3QuY2FudmFzLmhlaWdodCArICcgcHgnKVxuICAgIGNvbnNvbGUubG9nKCfQoNCw0LfQvNC10YAg0L/Qu9C+0YHQutC+0YHRgtC4OiAnICsgdGhpcy5zcGxvdC5ncmlkLndpZHRoICsgJyB4ICcgKyB0aGlzLnNwbG90LmdyaWQuaGVpZ2h0ICsgJyBweCcpXG5cbiAgICBpZiAodGhpcy5zcGxvdC5kZW1vLmlzRW5hYmxlKSB7XG4gICAgICBjb25zb2xlLmxvZygn0KHQv9C+0YHQvtCxINC/0L7Qu9GD0YfQtdC90LjRjyDQtNCw0L3QvdGL0YU6ICcgKyAn0LTQtdC80L4t0LTQsNC90L3Ri9C1JylcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ9Ch0L/QvtGB0L7QsSDQv9C+0LvRg9GH0LXQvdC40Y8g0LTQsNC90L3Ri9GFOiAnICsgJ9C40YLQtdGA0LjRgNC+0LLQsNC90LjQtScpXG4gICAgfVxuICAgIGNvbnNvbGUuZ3JvdXBFbmQoKVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JLRi9Cy0L7QtNC40YIg0LrQvtC00Ysg0YjQtdC50LTQtdGA0L7Qsi5cbiAgICovXG4gIHB1YmxpYyBzaGFkZXJzKCk6IHZvaWQge1xuICAgIGNvbnNvbGUuZ3JvdXAoJyVj0KHQvtC30LTQsNC9INCy0LXRgNGI0LjQvdC90YvQuSDRiNC10LnQtNC10YA6ICcsIHRoaXMuZ3JvdXBTdHlsZSlcbiAgICBjb25zb2xlLmxvZyh0aGlzLnNwbG90LnNoYWRlckNvZGVWZXJ0KVxuICAgIGNvbnNvbGUuZ3JvdXBFbmQoKVxuICAgIGNvbnNvbGUuZ3JvdXAoJyVj0KHQvtC30LTQsNC9INGE0YDQsNCz0LzQtdC90YLQvdGL0Lkg0YjQtdC50LTQtdGAOiAnLCB0aGlzLmdyb3VwU3R5bGUpXG4gICAgY29uc29sZS5sb2codGhpcy5zcGxvdC5zaGFkZXJDb2RlRnJhZylcbiAgICBjb25zb2xlLmdyb3VwRW5kKClcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCS0YvQstC+0LTQuNGCINGB0L7QvtCx0YnQtdC90LjQtSDQviDQvdCw0YfQsNC70LUg0L/RgNC+0YbQtdGB0YHQtSDQt9Cw0LPRgNGD0LfQutC4INC00LDQvdC90YvRhS5cbiAgICovXG4gIHB1YmxpYyBsb2FkaW5nKCk6IHZvaWQge1xuICAgIGNvbnNvbGUubG9nKCclY9CX0LDQv9GD0YnQtdC9INC/0YDQvtGG0LXRgdGBINC30LDQs9GA0YPQt9C60Lgg0LTQsNC90L3Ri9GFIFsnICsgZ2V0Q3VycmVudFRpbWUoKSArICddLi4uJywgdGhpcy5ncm91cFN0eWxlKVxuICAgIGNvbnNvbGUudGltZSgn0JTQu9C40YLQtdC70YzQvdC+0YHRgtGMJylcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCS0YvQstC+0LTQuNGCINGB0YLQsNGC0LjRgdGC0LjQutGDINC/0L4g0LfQsNCy0LXRgNGI0LXQvdC40Lgg0L/RgNC+0YbQtdGB0YHQsCDQt9Cw0LPRgNGD0LfQutC4INC00LDQvdC90YvRhS5cbiAgICovXG4gIHB1YmxpYyBsb2FkZWQoKTogdm9pZCB7XG4gICAgY29uc29sZS5ncm91cCgnJWPQl9Cw0LPRgNGD0LfQutCwINC00LDQvdC90YvRhSDQt9Cw0LLQtdGA0YjQtdC90LAgWycgKyBnZXRDdXJyZW50VGltZSgpICsgJ10nLCB0aGlzLmdyb3VwU3R5bGUpXG4gICAgY29uc29sZS50aW1lRW5kKCfQlNC70LjRgtC10LvRjNC90L7RgdGC0YwnKVxuICAgIGNvbnNvbGUubG9nKCfQoNCw0YHRhdC+0LQg0LLQuNC00LXQvtC/0LDQvNGP0YLQuDogJyArICh0aGlzLnNwbG90LnN0YXRzLm1lbVVzYWdlIC8gMTAwMDAwMCkudG9GaXhlZCgyKS50b0xvY2FsZVN0cmluZygpICsgJyDQnNCRJylcbiAgICBjb25zb2xlLmxvZygn0JrQvtC7LdCy0L4g0L7QsdGK0LXQutGC0L7QsjogJyArIHRoaXMuc3Bsb3Quc3RhdHMub2JqVG90YWxDb3VudC50b0xvY2FsZVN0cmluZygpKVxuICAgIGNvbnNvbGUubG9nKCfQmtC+0Lst0LLQviDQs9GA0YPQv9C/INCx0YPRhNC10YDQvtCyOiAnICsgdGhpcy5zcGxvdC5zdGF0cy5ncm91cHNDb3VudC50b0xvY2FsZVN0cmluZygpKVxuICAgIGNvbnNvbGUubG9nKCfQoNC10LfRg9C70YzRgtCw0YI6ICcgKyAoKHRoaXMuc3Bsb3Quc3RhdHMub2JqVG90YWxDb3VudCA+PSB0aGlzLnNwbG90Lmdsb2JhbExpbWl0KSA/XG4gICAgICAn0LTQvtGB0YLQuNCz0L3Rg9GCINC70LjQvNC40YIg0L7QsdGK0LXQutGC0L7QsiAoJyArIHRoaXMuc3Bsb3QuZ2xvYmFsTGltaXQudG9Mb2NhbGVTdHJpbmcoKSArICcpJyA6XG4gICAgICAn0L7QsdGA0LDQsdC+0YLQsNC90Ysg0LLRgdC1INC+0LHRitC10LrRgtGLJykpXG4gICAgY29uc29sZS5ncm91cEVuZCgpXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQktGL0LLQvtC00LjRgiDRgdC+0L7QsdGJ0LXQvdC40LUg0L4g0LfQsNC/0YPRgdC60LUg0YDQtdC90LTQtdGA0LAuXG4gICAqL1xuICBwdWJsaWMgc3RhcnRlZCgpOiB2b2lkIHtcbiAgICBjb25zb2xlLmxvZygnJWPQoNC10L3QtNC10YAg0LfQsNC/0YPRidC10L0nLCB0aGlzLmdyb3VwU3R5bGUpXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQktGL0LLQvtC00LjRgiDRgdC+0L7QsdGJ0LXQvdC40LUg0L7QsSDQvtGB0YLQsNC90L7QstC60LUg0YDQtdC90LTQtdGA0LAuXG4gICAqL1xuICBwdWJsaWMgc3RvcGVkKCk6IHZvaWQge1xuICAgIGNvbnNvbGUubG9nKCclY9Cg0LXQvdC00LXRgCDQvtGB0YLQsNC90L7QstC70LXQvScsIHRoaXMuZ3JvdXBTdHlsZSlcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCS0YvQstC+0LTQuNGCINGB0L7QvtCx0YjQtdC90LjQtSDQvtCxINC+0YfQuNGB0YLQutC1INC+0LHQu9Cw0YHRgtC4INGA0LXQvdC00LXRgNCwLlxuICAgKi9cbiAgcHVibGljIGNsZWFyZWQoY29sb3I6IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnNvbGUubG9nKCclY9Ce0LHQu9Cw0YHRgtGMINGA0LXQvdC00LXRgNCwINC+0YfQuNGJ0LXQvdCwIFsnICsgY29sb3IgKyAnXScsIHRoaXMuZ3JvdXBTdHlsZSk7XG4gIH1cbn1cbiIsImltcG9ydCBTUGxvdCBmcm9tICcuL3NwbG90J1xuaW1wb3J0IHsgcmFuZG9tSW50IH0gZnJvbSAnLi91dGlscydcblxuLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqXG4gKiDQmtC70LDRgdGBLdGF0LXQu9C/0LXRgCwg0YDQtdCw0LvQuNC30YPRjtGJ0LjQuSDQv9C+0LTQtNC10YDQttC60YMg0YDQtdC20LjQvNCwINC00LXQvNC+0L3RgdGC0YDQsNGG0LjQvtC90L3Ri9GFINC00LDQvdC90YvRhSDQtNC70Y8g0LrQu9Cw0YHRgdCwIFNQbG90LlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTUGxvdERlbW8ge1xuXG4gIC8qKiDQn9GA0LjQt9C90LDQuiDQsNC60YLQuNCy0LDRhtC40Lgg0LTQtdC80L4t0YDQtdC20LjQvNCwLiAqL1xuICBwdWJsaWMgaXNFbmFibGU6IGJvb2xlYW4gPSBmYWxzZVxuXG4gIC8qKiDQmtC+0LvQuNGH0LXRgdGC0LLQviDQsdGK0LXQutGC0L7Qsi4gKi9cbiAgcHVibGljIGFtb3VudDogbnVtYmVyID0gMV8wMDBfMDAwXG5cbiAgLyoqINCc0LjQvdC40LzQsNC70YzQvdGL0Lkg0YDQsNC30LzQtdGAINC+0LHRitC10LrRgtC+0LIuICovXG4gIHB1YmxpYyBzaXplTWluOiBudW1iZXIgPSAxMFxuXG4gIC8qKiDQnNCw0LrRgdC40LzQsNC70YzQvdGL0Lkg0YDQsNC30LzQtdGAINC+0LHRitC10LrRgtC+0LIuICovXG4gIHB1YmxpYyBzaXplTWF4OiBudW1iZXIgPSAzMFxuXG4gIC8qKiDQptCy0LXRgtC+0LLQsNGPINC/0LDQu9C40YLRgNCwINC+0LHRitC10LrRgtC+0LIuICovXG4gIHB1YmxpYyBjb2xvcnM6IHN0cmluZ1tdID0gW1xuICAgICcjRDgxQzAxJywgJyNFOTk2N0EnLCAnI0JBNTVEMycsICcjRkZENzAwJywgJyNGRkU0QjUnLCAnI0ZGOEMwMCcsXG4gICAgJyMyMjhCMjInLCAnIzkwRUU5MCcsICcjNDE2OUUxJywgJyMwMEJGRkYnLCAnIzhCNDUxMycsICcjMDBDRUQxJ1xuICBdXG5cbiAgLyoqINCh0YfQtdGC0YfQuNC6INC40YLQtdGA0LjRgNGD0LXQvNGL0YUg0L7QsdGK0LXQutGC0L7Qsi4gKi9cbiAgcHJpdmF0ZSBpbmRleDogbnVtYmVyID0gMFxuXG4gIC8qKiDQpdC10LvQv9C10YAg0LHRg9C00LXRgiDQuNC80LXRgtGMINC/0L7Qu9C90YvQuSDQtNC+0YHRgtGD0L8g0Log0Y3QutC30LXQvNC/0LvRj9GA0YMgU1Bsb3QuICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcmVhZG9ubHkgc3Bsb3Q6IFNQbG90XG4gICkge31cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQn9C+0LTQs9C+0YLQsNCy0LvQuNCy0LDQtdGCINGF0LXQu9C/0LXRgCDQuiDQuNGB0L/QvtC70YzQt9C+0LLQsNC90LjRji5cbiAgICovXG4gIHB1YmxpYyBzZXR1cCgpOiB2b2lkIHtcblxuICAgIHRoaXMuaW5kZXggPSAwXG5cbiAgICAvKiog0J/QvtC00LPQvtGC0L7QstC60LAg0LTQtdC80L4t0YDQtdC20LjQvNCwICjQtdGB0LvQuCDRgtGA0LXQsdGD0LXRgtGB0Y8pLiAqL1xuICAgIGlmICh0aGlzLnNwbG90LmRlbW8uaXNFbmFibGUpIHtcbiAgICAgIHRoaXMuc3Bsb3QuaXRlcmF0b3IgPSB0aGlzLnNwbG90LmRlbW8uaXRlcmF0b3IuYmluZCh0aGlzKVxuICAgICAgdGhpcy5zcGxvdC5jb2xvcnMgPSB0aGlzLnNwbG90LmRlbW8uY29sb3JzXG4gICAgfVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JjQvNC40YLQuNGA0YPQtdGCINC40YLQtdGA0LDRgtC+0YAg0LjRgdGF0L7QtNC90YvRhSDQvtCx0YrQtdC60YLQvtCyLlxuICAgKi9cbiAgcHVibGljIGl0ZXJhdG9yKCk6IFNQbG90T2JqZWN0IHwgbnVsbCB7XG4gICAgaWYgKHRoaXMuaW5kZXggPCB0aGlzLmFtb3VudCkge1xuICAgICAgdGhpcy5pbmRleCsrXG4gICAgICByZXR1cm4ge1xuICAgICAgICB4OiByYW5kb21JbnQodGhpcy5zcGxvdC5ncmlkLndpZHRoISksXG4gICAgICAgIHk6IHJhbmRvbUludCh0aGlzLnNwbG90LmdyaWQuaGVpZ2h0ISksXG4gICAgICAgIHNoYXBlOiByYW5kb21JbnQodGhpcy5zcGxvdC5zaGFwZXNDb3VudCksXG4gICAgICAgIHNpemU6IHRoaXMuc2l6ZU1pbiArIHJhbmRvbUludCh0aGlzLnNpemVNYXggLSB0aGlzLnNpemVNaW4gKyAxKSxcbiAgICAgICAgY29sb3I6IHJhbmRvbUludCh0aGlzLmNvbG9ycy5sZW5ndGgpXG4gICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCBTUGxvdCBmcm9tICcuL3NwbG90J1xuaW1wb3J0IHsgY29sb3JGcm9tSGV4VG9HbFJnYiB9IGZyb20gJy4vdXRpbHMnXG5cbi8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKlxuICog0JrQu9Cw0YHRgS3RhdC10LvQv9C10YAsINGA0LXQsNC70LjQt9GD0Y7RidC40Lkg0YPQv9GA0LDQstC70LXQvdC40LUg0LrQvtC90YLQtdC60YHRgtC+0Lwg0YDQtdC90LTQtdGA0LjQvdCz0LAgV2ViR0wg0LrQu9Cw0YHRgdCwIFNwbG90LlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTUGxvdFdlYkdsIHtcblxuICAvKiog0J/QsNGA0LDQvNC10YLRgNGLINC40L3QuNGG0LjQsNC70LjQt9Cw0YbQuNC4INC60L7QvdGC0LXQutGB0YLQsCDRgNC10L3QtNC10YDQuNC90LPQsCBXZWJHTC4gKi9cbiAgcHVibGljIGFscGhhOiBib29sZWFuID0gZmFsc2VcbiAgcHVibGljIGRlcHRoOiBib29sZWFuID0gZmFsc2VcbiAgcHVibGljIHN0ZW5jaWw6IGJvb2xlYW4gPSBmYWxzZVxuICBwdWJsaWMgYW50aWFsaWFzOiBib29sZWFuID0gZmFsc2VcbiAgcHVibGljIGRlc3luY2hyb25pemVkOiBib29sZWFuID0gZmFsc2VcbiAgcHVibGljIHByZW11bHRpcGxpZWRBbHBoYTogYm9vbGVhbiA9IGZhbHNlXG4gIHB1YmxpYyBwcmVzZXJ2ZURyYXdpbmdCdWZmZXI6IGJvb2xlYW4gPSBmYWxzZVxuICBwdWJsaWMgZmFpbElmTWFqb3JQZXJmb3JtYW5jZUNhdmVhdDogYm9vbGVhbiA9IGZhbHNlXG4gIHB1YmxpYyBwb3dlclByZWZlcmVuY2U6IFdlYkdMUG93ZXJQcmVmZXJlbmNlID0gJ2hpZ2gtcGVyZm9ybWFuY2UnXG5cbiAgLyoqINCd0LDQt9Cy0LDQvdC40Y8g0Y3Qu9C10LzQtdC90YLQvtCyINCz0YDQsNGE0LjRh9C10YHQutC+0Lkg0YHQuNGB0YLQtdC80Ysg0LrQu9C40LXQvdGC0LAuICovXG4gIHB1YmxpYyBncHUgPSB7IGhhcmR3YXJlOiAnLScsIHNvZnR3YXJlOiAnLScgfVxuXG4gIC8qKiDQmtC+0L3RgtC10LrRgdGCINGA0LXQvdC00LXRgNC40L3Qs9CwINC4INC/0YDQvtCz0YDQsNC80LzQsCBXZWJHTC4gKi9cbiAgcHJpdmF0ZSBnbCE6IFdlYkdMUmVuZGVyaW5nQ29udGV4dFxuICBwcml2YXRlIGdwdVByb2dyYW0hOiBXZWJHTFByb2dyYW1cblxuICAvKiog0J/QtdGA0LXQvNC10L3QvdGL0LUg0LTQu9GPINGB0LLRj9C30Lgg0L/RgNC40LvQvtC20LXQvdC40Y8g0YEg0L/RgNC+0LPRgNCw0LzQvNC+0LkgV2ViR0wuICovXG4gIHByaXZhdGUgdmFyaWFibGVzOiBNYXAgPCBzdHJpbmcsIGFueSA+ID0gbmV3IE1hcCgpXG5cbiAgLyoqINCR0YPRhNC10YDRiyDQstC40LTQtdC+0L/QsNC80Y/RgtC4IFdlYkdMLiAqL1xuICBwdWJsaWMgZGF0YTogTWFwIDwgc3RyaW5nLCB7YnVmZmVyczogV2ViR0xCdWZmZXJbXSwgdHlwZTogbnVtYmVyfSA+ID0gbmV3IE1hcCgpXG5cbiAgLyoqINCf0YDQsNCy0LjQu9CwINGB0L7QvtGC0LLQtdGC0YHRgtCy0LjRjyDRgtC40L/QvtCyINGC0LjQv9C40LfQuNGA0L7QstCw0L3QvdGL0YUg0LzQsNGB0YHQuNCy0L7QsiDQuCDRgtC40L/QvtCyINC/0LXRgNC10LzQtdC90L3Ri9GFIFdlYkdMLiAqL1xuICBwcml2YXRlIGdsTnVtYmVyVHlwZXM6IE1hcDxzdHJpbmcsIG51bWJlcj4gPSBuZXcgTWFwKFtcbiAgICBbJ0ludDhBcnJheScsIDB4MTQwMF0sICAgICAgIC8vIGdsLkJZVEVcbiAgICBbJ1VpbnQ4QXJyYXknLCAweDE0MDFdLCAgICAgIC8vIGdsLlVOU0lHTkVEX0JZVEVcbiAgICBbJ0ludDE2QXJyYXknLCAweDE0MDJdLCAgICAgIC8vIGdsLlNIT1JUXG4gICAgWydVaW50MTZBcnJheScsIDB4MTQwM10sICAgICAvLyBnbC5VTlNJR05FRF9TSE9SVFxuICAgIFsnRmxvYXQzMkFycmF5JywgMHgxNDA2XSAgICAgLy8gZ2wuRkxPQVRcbiAgXSlcblxuICAvKiog0KXQtdC70L/QtdGAINCx0YPQtNC10YIg0LjQvNC10YLRjCDQv9C+0LvQvdGL0Lkg0LTQvtGB0YLRg9C/INC6INGN0LrQt9C10LzQv9C70Y/RgNGDIFNQbG90LiAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlYWRvbmx5IHNwbG90OiBTUGxvdFxuICApIHsgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCf0L7QtNCz0L7RgtCw0LLQu9C40LLQsNC10YIg0YXQtdC70L/QtdGAINC6INC40YHQv9C+0LvRjNC30L7QstCw0L3QuNGOLlxuICAgKi9cbiAgcHVibGljIHNldHVwKCk6IHZvaWQge1xuXG4gICAgdGhpcy5nbCA9IHRoaXMuc3Bsb3QuY2FudmFzLmdldENvbnRleHQoJ3dlYmdsJywge1xuICAgICAgYWxwaGE6IHRoaXMuYWxwaGEsXG4gICAgICBkZXB0aDogdGhpcy5kZXB0aCxcbiAgICAgIHN0ZW5jaWw6IHRoaXMuc3RlbmNpbCxcbiAgICAgIGFudGlhbGlhczogdGhpcy5hbnRpYWxpYXMsXG4gICAgICBkZXN5bmNocm9uaXplZDogdGhpcy5kZXN5bmNocm9uaXplZCxcbiAgICAgIHByZW11bHRpcGxpZWRBbHBoYTogdGhpcy5wcmVtdWx0aXBsaWVkQWxwaGEsXG4gICAgICBwcmVzZXJ2ZURyYXdpbmdCdWZmZXI6IHRoaXMucHJlc2VydmVEcmF3aW5nQnVmZmVyLFxuICAgICAgZmFpbElmTWFqb3JQZXJmb3JtYW5jZUNhdmVhdDogdGhpcy5mYWlsSWZNYWpvclBlcmZvcm1hbmNlQ2F2ZWF0LFxuICAgICAgcG93ZXJQcmVmZXJlbmNlOiB0aGlzLnBvd2VyUHJlZmVyZW5jZVxuICAgIH0pIVxuXG4gICAgaWYgKHRoaXMuZ2wgPT09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcign0J7RiNC40LHQutCwINGB0L7Qt9C00LDQvdC40Y8g0LrQvtC90YLQtdC60YHRgtCwINGA0LXQvdC00LXRgNC40L3Qs9CwIFdlYkdMIScpXG4gICAgfVxuXG4gICAgLyoqINCf0L7Qu9GD0YfQtdC90LjQtSDQuNC90YTQvtGA0LzQsNGG0LjQuCDQviDQs9GA0LDRhNC40YfQtdGB0LrQvtC5INGB0LjRgdGC0LXQvNC1INC60LvQuNC10L3RgtCwLiAqL1xuICAgIGxldCBleHQgPSB0aGlzLmdsLmdldEV4dGVuc2lvbignV0VCR0xfZGVidWdfcmVuZGVyZXJfaW5mbycpXG4gICAgdGhpcy5ncHUuaGFyZHdhcmUgPSAoZXh0KSA/IHRoaXMuZ2wuZ2V0UGFyYW1ldGVyKGV4dC5VTk1BU0tFRF9SRU5ERVJFUl9XRUJHTCkgOiAnW9C90LXQuNC30LLQtdGB0YLQvdC+XSdcbiAgICB0aGlzLmdwdS5zb2Z0d2FyZSA9IHRoaXMuZ2wuZ2V0UGFyYW1ldGVyKHRoaXMuZ2wuVkVSU0lPTilcblxuICAgIHRoaXMuc3Bsb3QuZGVidWcubG9nKCdncHUnKVxuXG4gICAgLyoqINCa0L7QvtGA0LXQutGC0LjRgNC+0LLQutCwINGA0LDQt9C80LXRgNCwINC+0LHQu9Cw0YHRgtC4INC/0YDQvtGB0LzQvtGC0YDQsC4gKi9cbiAgICB0aGlzLnNwbG90LmNhbnZhcy53aWR0aCA9IHRoaXMuc3Bsb3QuY2FudmFzLmNsaWVudFdpZHRoXG4gICAgdGhpcy5zcGxvdC5jYW52YXMuaGVpZ2h0ID0gdGhpcy5zcGxvdC5jYW52YXMuY2xpZW50SGVpZ2h0XG4gICAgdGhpcy5nbC52aWV3cG9ydCgwLCAwLCB0aGlzLnNwbG90LmNhbnZhcy53aWR0aCwgdGhpcy5zcGxvdC5jYW52YXMuaGVpZ2h0KVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0KPRgdGC0LDQvdCw0LLQu9C40LLQsNC10YIg0YbQstC10YIg0YTQvtC90LAg0LrQvtC90YLQtdC60YHRgtCwINGA0LXQvdC00LXRgNC40L3Qs9CwIFdlYkdMLlxuICAgKi9cbiAgcHVibGljIHNldEJnQ29sb3IoY29sb3I6IHN0cmluZyk6IHZvaWQge1xuICAgIGxldCBbciwgZywgYl0gPSBjb2xvckZyb21IZXhUb0dsUmdiKGNvbG9yKVxuICAgIHRoaXMuZ2wuY2xlYXJDb2xvcihyLCBnLCBiLCAwLjApXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQl9Cw0LrRgNCw0YjQuNCy0LDQtdGCINC60L7QvdGC0LXQutGB0YIg0YDQtdC90LTQtdGA0LjQvdCz0LAgV2ViR0wg0YbQstC10YLQvtC8INGE0L7QvdCwLlxuICAgKi9cbiAgcHVibGljIGNsZWFyQmFja2dyb3VuZCgpOiB2b2lkIHtcbiAgICB0aGlzLmdsLmNsZWFyKHRoaXMuZ2wuQ09MT1JfQlVGRkVSX0JJVCk7XG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQodC+0LfQtNCw0LXRgiDRiNC10LnQtNC10YAgV2ViR0wuXG4gICAqXG4gICAqIEBwYXJhbSB0eXBlIC0g0KLQuNC/INGI0LXQudC00LXRgNCwLlxuICAgKiBAcGFyYW0gY29kZSAtIEdMU0wt0LrQvtC0INGI0LXQudC00LXRgNCwLlxuICAgKiBAcmV0dXJucyDQodC+0LfQtNCw0L3QvdGL0Lkg0YjQtdC50LTQtdGALlxuICAgKi9cbiAgcHVibGljIGNyZWF0ZVNoYWRlcih0eXBlOiAnVkVSVEVYX1NIQURFUicgfCAnRlJBR01FTlRfU0hBREVSJywgY29kZTogc3RyaW5nKTogV2ViR0xTaGFkZXIge1xuXG4gICAgY29uc3Qgc2hhZGVyID0gdGhpcy5nbC5jcmVhdGVTaGFkZXIodGhpcy5nbFt0eXBlXSkhXG4gICAgdGhpcy5nbC5zaGFkZXJTb3VyY2Uoc2hhZGVyLCBjb2RlKVxuICAgIHRoaXMuZ2wuY29tcGlsZVNoYWRlcihzaGFkZXIpXG5cbiAgICBpZiAoIXRoaXMuZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKHNoYWRlciwgdGhpcy5nbC5DT01QSUxFX1NUQVRVUykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcign0J7RiNC40LHQutCwINC60L7QvNC/0LjQu9GP0YbQuNC4INGI0LXQudC00LXRgNCwIFsnICsgdHlwZSArICddLiAnICsgdGhpcy5nbC5nZXRTaGFkZXJJbmZvTG9nKHNoYWRlcikpXG4gICAgfVxuXG4gICAgcmV0dXJuIHNoYWRlclxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0KHQvtC30LTQsNC10YIg0L/RgNC+0LPRgNCw0LzQvNGDIFdlYkdMINC40Lcg0YjQtdC50LTQtdGA0L7Qsi5cbiAgICpcbiAgICogQHBhcmFtIHNoYWRlclZlcnQgLSDQktC10YDRiNC40L3QvdGL0Lkg0YjQtdC50LTQtdGALlxuICAgKiBAcGFyYW0gc2hhZGVyRnJhZyAtINCk0YDQsNCz0LzQtdC90YLQvdGL0Lkg0YjQtdC50LTQtdGALlxuICAgKi9cbiAgcHVibGljIGNyZWF0ZVByb2dyYW1Gcm9tU2hhZGVycyhzaGFkZXJWZXJ0OiBXZWJHTFNoYWRlciwgc2hhZGVyRnJhZzogV2ViR0xTaGFkZXIpOiB2b2lkIHtcblxuICAgIHRoaXMuZ3B1UHJvZ3JhbSA9IHRoaXMuZ2wuY3JlYXRlUHJvZ3JhbSgpIVxuICAgIHRoaXMuZ2wuYXR0YWNoU2hhZGVyKHRoaXMuZ3B1UHJvZ3JhbSwgc2hhZGVyVmVydClcbiAgICB0aGlzLmdsLmF0dGFjaFNoYWRlcih0aGlzLmdwdVByb2dyYW0sIHNoYWRlckZyYWcpXG4gICAgdGhpcy5nbC5saW5rUHJvZ3JhbSh0aGlzLmdwdVByb2dyYW0pXG4gICAgdGhpcy5nbC51c2VQcm9ncmFtKHRoaXMuZ3B1UHJvZ3JhbSlcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCh0L7Qt9C00LDQtdGCINC/0YDQvtCz0YDQsNC80LzRgyBXZWJHTCDQuNC3IEdMU0wt0LrQvtC00L7QsiDRiNC10LnQtNC10YDQvtCyLlxuICAgKlxuICAgKiBAcGFyYW0gc2hhZGVyQ29kZVZlcnQgLSDQmtC+0LQg0LLQtdGA0YjQuNC90L3QvtCz0L4g0YjQtdC50LTQtdGA0LAuXG4gICAqIEBwYXJhbSBzaGFkZXJDb2RlRnJhZyAtINCa0L7QtCDRhNGA0LDQs9C80LXQvdGC0L3QvtCz0L4g0YjQtdC50LTQtdGA0LAuXG4gICAqL1xuICBwdWJsaWMgY3JlYXRlUHJvZ3JhbShzaGFkZXJDb2RlVmVydDogc3RyaW5nLCBzaGFkZXJDb2RlRnJhZzogc3RyaW5nKTogdm9pZCB7XG5cbiAgICB0aGlzLnNwbG90LmRlYnVnLmxvZygnc2hhZGVycycpXG5cbiAgICB0aGlzLmNyZWF0ZVByb2dyYW1Gcm9tU2hhZGVycyhcbiAgICAgIHRoaXMuY3JlYXRlU2hhZGVyKCdWRVJURVhfU0hBREVSJywgc2hhZGVyQ29kZVZlcnQpLFxuICAgICAgdGhpcy5jcmVhdGVTaGFkZXIoJ0ZSQUdNRU5UX1NIQURFUicsIHNoYWRlckNvZGVGcmFnKVxuICAgIClcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCh0L7Qt9C00LDQtdGCINGB0LLRj9C30Ywg0L/QtdGA0LXQvNC10L3QvdC+0Lkg0L/RgNC40LvQvtC20LXQvdC40Y8g0YEg0L/RgNC+0LPRgNCw0LzQvNC+0LkgV2ViR2wuXG4gICAqXG4gICAqIEByZW1hcmtzXG4gICAqINCf0LXRgNC10LzQtdC90L3Ri9C1INGB0L7RhdGA0LDQvdGP0Y7RgtGB0Y8g0LIg0LDRgdGB0L7RhtC40LDRgtC40LLQvdC+0Lwg0LzQsNGB0YHQuNCy0LUsINCz0LTQtSDQutC70Y7Rh9C4IC0g0Y3RgtC+INC90LDQt9Cy0LDQvdC40Y8g0L/QtdGA0LXQvNC10L3QvdGL0YUuINCd0LDQt9Cy0LDQvdC40LUg0L/QtdGA0LXQvNC10L3QvdC+0Lkg0LTQvtC70LbQvdC+XG4gICAqINC90LDRh9C40L3QsNGC0YzRgdGPINGBINC/0YDQtdGE0LjQutGB0LAsINC+0LHQvtC30L3QsNGH0LDRjtGJ0LXQs9C+INC10LUgR0xTTC3RgtC40L8uINCf0YDQtdGE0LjQutGBIFwidV9cIiDQvtC/0LjRgdGL0LLQsNC10YIg0L/QtdGA0LXQvNC10L3QvdGD0Y4g0YLQuNC/0LAgdW5pZm9ybS4g0J/RgNC10YTQuNC60YEgXCJhX1wiXG4gICAqINC+0L/QuNGB0YvQstCw0LXRgiDQv9C10YDQtdC80LXQvdC90YPRjiDRgtC40L/QsCBhdHRyaWJ1dGUuXG4gICAqXG4gICAqIEBwYXJhbSB2YXJOYW1lIC0g0JjQvNGPINC/0LXRgNC10LzQtdC90L3QvtC5ICjRgdGC0YDQvtC60LApLlxuICAgKi9cbiAgcHVibGljIGNyZWF0ZVZhcmlhYmxlKHZhck5hbWU6IHN0cmluZyk6IHZvaWQge1xuXG4gICAgY29uc3QgdmFyVHlwZSA9IHZhck5hbWUuc2xpY2UoMCwgMilcblxuICAgIGlmICh2YXJUeXBlID09PSAndV8nKSB7XG4gICAgICB0aGlzLnZhcmlhYmxlcy5zZXQodmFyTmFtZSwgdGhpcy5nbC5nZXRVbmlmb3JtTG9jYXRpb24odGhpcy5ncHVQcm9ncmFtLCB2YXJOYW1lKSlcbiAgICB9IGVsc2UgaWYgKHZhclR5cGUgPT09ICdhXycpIHtcbiAgICAgIHRoaXMudmFyaWFibGVzLnNldCh2YXJOYW1lLCB0aGlzLmdsLmdldEF0dHJpYkxvY2F0aW9uKHRoaXMuZ3B1UHJvZ3JhbSwgdmFyTmFtZSkpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcign0KPQutCw0LfQsNC9INC90LXQstC10YDQvdGL0Lkg0YLQuNC/ICjQv9GA0LXRhNC40LrRgSkg0L/QtdGA0LXQvNC10L3QvdC+0Lkg0YjQtdC50LTQtdGA0LA6ICcgKyB2YXJOYW1lKVxuICAgIH1cbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCh0L7Qt9C00LDQtdGCINGB0LLRj9C30Ywg0L3QsNCx0L7RgNCwINC/0LXRgNC10LzQtdC90L3Ri9GFINC/0YDQuNC70L7QttC10L3QuNGPINGBINC/0YDQvtCz0YDQsNC80LzQvtC5IFdlYkdsLlxuICAgKlxuICAgKiBAcmVtYXJrc1xuICAgKiDQlNC10LvQsNC10YIg0YLQvtC20LUg0YHQsNC80L7QtSwg0YfRgtC+INC4INC80LXRgtC+0LQge0BsaW5rIGNyZWF0ZVZhcmlhYmxlfSwg0L3QviDQv9C+0LfQstC+0LvRj9C10YIg0LfQsCDQvtC00LjQvSDQstGL0LfQvtCyINGB0L7Qt9C00LDRgtGMINGB0YDQsNC30YMg0L3QtdGB0LrQvtC70YzQutC+XG4gICAqINC/0LXRgNC10LzQtdC90L3Ri9GFLlxuICAgKlxuICAgKiBAcGFyYW0gdmFyTmFtZXMgLSDQn9C10YDQtdGH0LjRgdC70LXQvdC40Y8g0LjQvNC10L0g0L/QtdGA0LXQvNC10L3QvdGL0YUgKNGB0YLRgNC+0LrQsNC80LgpLlxuICAgKi9cbiAgcHVibGljIGNyZWF0ZVZhcmlhYmxlcyguLi52YXJOYW1lczogc3RyaW5nW10pOiB2b2lkIHtcbiAgICB2YXJOYW1lcy5mb3JFYWNoKHZhck5hbWUgPT4gdGhpcy5jcmVhdGVWYXJpYWJsZSh2YXJOYW1lKSk7XG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQodC+0LfQtNCw0LXRgiDQsiDQs9GA0YPQv9C/0LUg0LHRg9GE0LXRgNC+0LIgV2ViR0wg0L3QvtCy0YvQuSDQsdGD0YTQtdGAINC4INC30LDQv9C40YHRi9Cy0LDQtdGCINCyINC90LXQs9C+INC/0LXRgNC10LTQsNC90L3Ri9C1INC00LDQvdC90YvQtS5cbiAgICpcbiAgICogQHJlbWFya3NcbiAgICog0JrQvtC70LjRh9C10YHRgtCy0L4g0LPRgNGD0L/QvyDQsdGD0YTQtdGA0L7QsiDQuCDQutC+0LvQuNGH0LXRgdGC0LLQviDQsdGD0YTQtdGA0L7QsiDQsiDQutCw0LbQtNC+0Lkg0LPRgNGD0L/Qv9C1INC90LUg0L7Qs9GA0LDQvdC40YfQtdC90YsuINCa0LDQttC00LDRjyDQs9GA0YPQv9C/0LAg0LjQvNC10LXRgiDRgdCy0L7QtSDQvdCw0LfQstCw0L3QuNC1INC4XG4gICAqIEdMU0wt0YLQuNC/LiDQotC40L8g0LPRgNGD0L/Qv9GLINC+0L/RgNC10LTQtdC70Y/QtdGC0YHRjyDQsNCy0YLQvtC80LDRgtC40YfQtdGB0LrQuCDQvdCwINC+0YHQvdC+0LLQtSDRgtC40L/QsCDRgtC40L/QuNC30LjRgNC+0LLQsNC90L3QvtCz0L4g0LzQsNGB0YHQuNCy0LAuINCf0YDQsNCy0LjQu9CwINGB0L7QvtGC0LLQtdGC0YHRgtCy0LjRjyDRgtC40L/QvtCyXG4gICAqINC+0L/RgNC10LTQtdC70Y/RjtGC0YHRjyDQv9C10YDQtdC80LXQvdC90L7QuSB7QGxpbmsgZ2xOdW1iZXJUeXBlc30uXG4gICAqXG4gICAqIEBwYXJhbSBncm91cE5hbWUgLSDQndCw0LfQstCw0L3QuNC1INCz0YDRg9C/0L/RiyDQsdGD0YTQtdGA0L7Qsiwg0LIg0LrQvtGC0L7RgNGD0Y4g0LHRg9C00LXRgiDQtNC+0LHQsNCy0LvQtdC9INC90L7QstGL0Lkg0LHRg9GE0LXRgC5cbiAgICogQHBhcmFtIGRhdGEgLSDQlNCw0L3QvdGL0LUg0LIg0LLQuNC00LUg0YLQuNC/0LjQt9C40YDQvtCy0LDQvdC90L7Qs9C+INC80LDRgdGB0LjQstCwINC00LvRjyDQt9Cw0L/QuNGB0Lgg0LIg0YHQvtC30LTQsNCy0LDQtdC80YvQuSDQsdGD0YTQtdGALlxuICAgKiBAcmV0dXJucyDQntCx0YrQtdC8INC/0LDQvNGP0YLQuCwg0LfQsNC90Y/RgtGL0Lkg0L3QvtCy0YvQvCDQsdGD0YTQtdGA0L7QvCAo0LIg0LHQsNC50YLQsNGFKS5cbiAgICovXG4gIHB1YmxpYyBjcmVhdGVCdWZmZXIoZ3JvdXBOYW1lOiBzdHJpbmcsIGRhdGE6IFR5cGVkQXJyYXkpOiBudW1iZXIge1xuXG4gICAgY29uc3QgYnVmZmVyID0gdGhpcy5nbC5jcmVhdGVCdWZmZXIoKSFcbiAgICB0aGlzLmdsLmJpbmRCdWZmZXIodGhpcy5nbC5BUlJBWV9CVUZGRVIsIGJ1ZmZlcilcbiAgICB0aGlzLmdsLmJ1ZmZlckRhdGEodGhpcy5nbC5BUlJBWV9CVUZGRVIsIGRhdGEsIHRoaXMuZ2wuU1RBVElDX0RSQVcpXG5cbiAgICAvKiog0JXRgdC70Lgg0LPRgNGD0L/Qv9GLINGBINGD0LrQsNC30LDQvdC90YvQvCDQvdCw0LfQstCw0L3QuNC10Lwg0L3QtSDRgdGD0YnQtdGB0YLQstGD0LXRgiwg0YLQviDQvtC90LAg0YHQvtC30LTQsNC10YLRgdGPLiAqL1xuICAgIGlmICghdGhpcy5kYXRhLmhhcyhncm91cE5hbWUpKSB7XG4gICAgICB0aGlzLmRhdGEuc2V0KGdyb3VwTmFtZSwgeyBidWZmZXJzOiBbXSwgdHlwZTogdGhpcy5nbE51bWJlclR5cGVzLmdldChkYXRhLmNvbnN0cnVjdG9yLm5hbWUpIX0pXG4gICAgfVxuXG4gICAgdGhpcy5kYXRhLmdldChncm91cE5hbWUpIS5idWZmZXJzLnB1c2goYnVmZmVyKVxuXG4gICAgcmV0dXJuIGRhdGEubGVuZ3RoICogZGF0YS5CWVRFU19QRVJfRUxFTUVOVFxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0J/QtdGA0LXQtNCw0LXRgiDQt9C90LDRh9C10L3QuNC1INC80LDRgtGA0LjRhtGLIDMg0YUgMyDQsiDQv9GA0L7Qs9GA0LDQvNC80YMgV2ViR2wuXG4gICAqXG4gICAqIEBwYXJhbSB2YXJOYW1lIC0g0JjQvNGPINC/0LXRgNC10LzQtdC90L3QvtC5IFdlYkdMICjQuNC3INC80LDRgdGB0LjQstCwIHtAbGluayB2YXJpYWJsZXN9KSDQsiDQutC+0YLQvtGA0YPRjiDQsdGD0LTQtdGCINC30LDQv9C40YHQsNC90L4g0L/QtdGA0LXQtNCw0L3QvdC+0LUg0LfQvdCw0YfQtdC90LjQtS5cbiAgICogQHBhcmFtIHZhclZhbHVlIC0g0KPRgdGC0LDQvdCw0LLQu9C40LLQsNC10LzQvtC1INC30L3QsNGH0LXQvdC40LUg0LTQvtC70LbQvdC+INGP0LLQu9GP0YLRjNGB0Y8g0LzQsNGC0YDQuNGG0LXQuSDQstC10YnQtdGB0YLQstC10L3QvdGL0YUg0YfQuNGB0LXQuyDRgNCw0LfQvNC10YDQvtC8IDMg0YUgMywg0YDQsNC30LLQtdGA0L3Rg9GC0L7QuVxuICAgKiAgICAg0LIg0LLQuNC00LUg0L7QtNC90L7QvNC10YDQvdC+0LPQviDQvNCw0YHRgdC40LLQsCDQuNC3IDkg0Y3Qu9C10LzQtdC90YLQvtCyLlxuICAgKi9cbiAgcHVibGljIHNldFZhcmlhYmxlKHZhck5hbWU6IHN0cmluZywgdmFyVmFsdWU6IG51bWJlcltdKTogdm9pZCB7XG4gICAgdGhpcy5nbC51bmlmb3JtTWF0cml4M2Z2KHRoaXMudmFyaWFibGVzLmdldCh2YXJOYW1lKSwgZmFsc2UsIHZhclZhbHVlKVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JTQtdC70LDQtdGCINCx0YPRhNC10YAgV2ViR2wgXCLQsNC60YLQuNCy0L3Ri9C8XCIuXG4gICAqXG4gICAqIEBwYXJhbSBncm91cE5hbWUgLSDQndCw0LfQstCw0L3QuNC1INCz0YDRg9C/0L/RiyDQsdGD0YTQtdGA0L7Qsiwg0LIg0LrQvtGC0L7RgNC+0Lwg0YXRgNCw0L3QuNGC0YHRjyDQvdC10L7QsdGF0L7QtNC40LzRi9C5INCx0YPRhNC10YAuXG4gICAqIEBwYXJhbSBpbmRleCAtINCY0L3QtNC10LrRgSDQsdGD0YTQtdGA0LAg0LIg0LPRgNGD0L/Qv9C1LlxuICAgKiBAcGFyYW0gdmFyTmFtZSAtINCY0LzRjyDQv9C10YDQtdC80LXQvdC90L7QuSAo0LjQtyDQvNCw0YHRgdC40LLQsCB7QGxpbmsgdmFyaWFibGVzfSksINGBINC60L7RgtC+0YDQvtC5INCx0YPQtNC10YIg0YHQstGP0LfQsNC9INCx0YPRhNC10YAuXG4gICAqIEBwYXJhbSBzaXplIC0g0JrQvtC70LjRh9C10YHRgtCy0L4g0Y3Qu9C10LzQtdC90YLQvtCyINCyINCx0YPRhNC10YDQtSwg0YHQvtC+0YLQstC10YLRgdGC0LLRg9GO0YnQuNGFINC+0LTQvdC+0LkgwqBHTC3QstC10YDRiNC40L3QtS5cbiAgICogQHBhcmFtIHN0cmlkZSAtINCg0LDQt9C80LXRgCDRiNCw0LPQsCDQvtCx0YDQsNCx0L7RgtC60Lgg0Y3Qu9C10LzQtdC90YLQvtCyINCx0YPRhNC10YDQsCAo0LfQvdCw0YfQtdC90LjQtSAwINC30LDQtNCw0LXRgiDRgNCw0LfQvNC10YnQtdC90LjQtSDRjdC70LXQvNC10L3RgtC+0LIg0LTRgNGD0LMg0LfQsCDQtNGA0YPQs9C+0LwpLlxuICAgKiBAcGFyYW0gb2Zmc2V0IC0g0KHQvNC10YnQtdC90LjQtSDQvtGC0L3QvtGB0LjRgtC10LvRjNC90L4g0L3QsNGH0LDQu9CwINCx0YPRhNC10YDQsCwg0L3QsNGH0LjQvdCw0Y8g0YEg0LrQvtGC0L7RgNC+0LPQviDQsdGD0LTQtdGCINC/0YDQvtC40YHRhdC+0LTQuNGC0Ywg0L7QsdGA0LDQsdC+0YLQutCwINGN0LvQtdC80LXQvdGC0L7Qsi5cbiAgICovXG4gIHB1YmxpYyBzZXRCdWZmZXIoZ3JvdXBOYW1lOiBzdHJpbmcsIGluZGV4OiBudW1iZXIsIHZhck5hbWU6IHN0cmluZywgc2l6ZTogbnVtYmVyLCBzdHJpZGU6IG51bWJlciwgb2Zmc2V0OiBudW1iZXIpOiB2b2lkIHtcblxuICAgIGNvbnN0IGdyb3VwID0gdGhpcy5kYXRhLmdldChncm91cE5hbWUpIVxuICAgIGNvbnN0IHZhcmlhYmxlID0gdGhpcy52YXJpYWJsZXMuZ2V0KHZhck5hbWUpXG5cbiAgICB0aGlzLmdsLmJpbmRCdWZmZXIodGhpcy5nbC5BUlJBWV9CVUZGRVIsIGdyb3VwLmJ1ZmZlcnNbaW5kZXhdKVxuICAgIHRoaXMuZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkodmFyaWFibGUpXG4gICAgdGhpcy5nbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKHZhcmlhYmxlLCBzaXplLCBncm91cC50eXBlLCBmYWxzZSwgc3RyaWRlLCBvZmZzZXQpXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQktGL0L/QvtC70L3Rj9C10YIg0L7RgtGA0LjRgdC+0LLQutGDINC60L7QvdGC0LXQutGB0YLQsCDRgNC10L3QtNC10YDQuNC90LPQsCBXZWJHTCDQvNC10YLQvtC00L7QvCDQv9GA0LjQvNC40YLQuNCy0L3Ri9GFINGC0L7Rh9C10LouXG4gICAqXG4gICAqIEBwYXJhbSBmaXJzdCAtINCY0L3QtNC10LrRgSBHTC3QstC10YDRiNC40L3Riywg0YEg0LrQvtGC0L7RgNC+0Lkg0L3QsNGH0L3QtdGC0Y8g0L7RgtGA0LjRgdC+0LLQutCwLlxuICAgKiBAcGFyYW0gY291bnQgLSDQmtC+0LvQuNGH0LXRgdGC0LLQviDQvtGA0LjRgdC+0LLRi9Cy0LDQtdC80YvRhSBHTC3QstC10YDRiNC40L0uXG4gICAqL1xuICBwdWJsaWMgZHJhd1BvaW50cyhmaXJzdDogbnVtYmVyLCBjb3VudDogbnVtYmVyKTogdm9pZCB7XG4gICAgdGhpcy5nbC5kcmF3QXJyYXlzKHRoaXMuZ2wuUE9JTlRTLCBmaXJzdCwgY291bnQpXG4gIH1cbn1cbiIsImltcG9ydCB7IGNvcHlNYXRjaGluZ0tleVZhbHVlcywgY29sb3JGcm9tSGV4VG9HbFJnYiB9IGZyb20gJy4vdXRpbHMnXG5pbXBvcnQgU0hBREVSX0NPREVfVkVSVF9UTVBMIGZyb20gJy4vc2hhZGVyLWNvZGUtdmVydC10bXBsJ1xuaW1wb3J0IFNIQURFUl9DT0RFX0ZSQUdfVE1QTCBmcm9tICcuL3NoYWRlci1jb2RlLWZyYWctdG1wbCdcbmltcG9ydCBTUGxvdENvbnRvbCBmcm9tICcuL3NwbG90LWNvbnRyb2wnXG5pbXBvcnQgU1Bsb3RXZWJHbCBmcm9tICcuL3NwbG90LXdlYmdsJ1xuaW1wb3J0IFNQbG90RGVidWcgZnJvbSAnLi9zcGxvdC1kZWJ1ZydcbmltcG9ydCBTUGxvdERlbW8gZnJvbSAnLi9zcGxvdC1kZW1vJ1xuXG4vKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICpcbiAqINCa0LvQsNGB0YEgU1Bsb3QgLSDRgNC10LDQu9C40LfRg9C10YIg0LPRgNCw0YTQuNC6INGC0LjQv9CwINGB0LrQsNGC0YLQtdGA0L/Qu9C+0YIg0YHRgNC10LTRgdGC0LLQsNC80LggV2ViR0wuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNQbG90IHtcblxuICAvKiog0KTRg9C90LrRhtC40Y8g0LjRgtC10YDQuNGA0L7QstCw0L3QuNGPINC40YHRhdC+0LTQvdGL0YUg0LTQsNC90L3Ri9GFLiAqL1xuICBwdWJsaWMgaXRlcmF0b3I6IFNQbG90SXRlcmF0b3IgPSB1bmRlZmluZWRcblxuICAvKiog0KXQtdC70L/QtdGAIFdlYkdMLiAqL1xuICBwdWJsaWMgd2ViZ2w6IFNQbG90V2ViR2wgPSBuZXcgU1Bsb3RXZWJHbCh0aGlzKVxuXG4gIC8qKiDQpdC10LvQv9C10YAg0YDQtdC20LjQvNCwINC00LXQvNC+LdC00LDQvdC90YvRhS4gKi9cbiAgcHVibGljIGRlbW86IFNQbG90RGVtbyA9IG5ldyBTUGxvdERlbW8odGhpcylcblxuICAvKiog0KXQtdC70L/QtdGAINGA0LXQttC40LzQsCDQvtGC0LvQsNC00LrQuC4gKi9cbiAgcHVibGljIGRlYnVnOiBTUGxvdERlYnVnID0gbmV3IFNQbG90RGVidWcodGhpcylcblxuICAvKiog0J/RgNC40LfQvdCw0Log0YTQvtGA0YHQuNGA0L7QstCw0L3QvdC+0LPQviDQt9Cw0L/Rg9GB0LrQsCDRgNC10L3QtNC10YDQsC4gKi9cbiAgcHVibGljIGZvcmNlUnVuOiBib29sZWFuID0gZmFsc2VcblxuICAvKiog0J7Qs9GA0LDQvdC40YfQtdC90LjQtSDQutC+0Lst0LLQsCDQvtCx0YrQtdC60YLQvtCyINC90LAg0LPRgNCw0YTQuNC60LUuICovXG4gIHB1YmxpYyBnbG9iYWxMaW1pdDogbnVtYmVyID0gMV8wMDBfMDAwXzAwMFxuXG4gIC8qKiDQntCz0YDQsNC90LjRh9C10L3QuNC1INC60L7Quy3QstCwINC+0LHRitC10LrRgtC+0LIg0LIg0LPRgNGD0L/Qv9C1LiAqL1xuICBwdWJsaWMgZ3JvdXBMaW1pdDogbnVtYmVyID0gMTBfMDAwXG5cbiAgLyoqINCm0LLQtdGC0L7QstCw0Y8g0L/QsNC70LjRgtGA0LAg0L7QsdGK0LXQutGC0L7Qsi4gKi9cbiAgcHVibGljIGNvbG9yczogc3RyaW5nW10gPSBbXVxuXG4gIC8qKiDQn9Cw0YDQsNC80LXRgtGA0Ysg0LrQvtC+0YDQtNC40L3QsNGC0L3QvtC5INC/0LvQvtGB0LrQvtGB0YLQuC4gKi9cbiAgcHVibGljIGdyaWQ6IFNQbG90R3JpZCA9IHtcbiAgICB3aWR0aDogMzJfMDAwLFxuICAgIGhlaWdodDogMTZfMDAwLFxuICAgIGJnQ29sb3I6ICcjZmZmZmZmJyxcbiAgICBydWxlc0NvbG9yOiAnI2MwYzBjMCdcbiAgfVxuXG4gIC8qKiDQn9Cw0YDQsNC80LXRgtGA0Ysg0L7QsdC70LDRgdGC0Lgg0L/RgNC+0YHQvNC+0YLRgNCwLiAqL1xuICBwdWJsaWMgY2FtZXJhOiBTUGxvdENhbWVyYSA9IHtcbiAgICB4OiB0aGlzLmdyaWQud2lkdGghIC8gMixcbiAgICB5OiB0aGlzLmdyaWQuaGVpZ2h0ISAvIDIsXG4gICAgem9vbTogMVxuICB9XG5cbiAgLyoqINCf0YDQuNC30L3QsNC6INC90LXQvtCx0YXQvtC00LjQvNC+0YHRgtC4INCx0LXQt9C+0YLQu9Cw0LPQsNGC0LXQu9GM0L3QvtCz0L4g0LfQsNC/0YPRgdC60LAg0YDQtdC90LTQtdGA0LAuICovXG4gIHB1YmxpYyBpc1J1bm5pbmc6IGJvb2xlYW4gPSBmYWxzZVxuXG4gIC8qKiDQmtC+0LvQuNGH0LXRgdGC0LLQviDRgNCw0LfQu9C40YfQvdGL0YUg0YTQvtGA0Lwg0L7QsdGK0LXQutGC0L7Qsi4gKi9cbiAgcHVibGljIHNoYXBlc0NvdW50OiBudW1iZXIgPSAzXG5cbiAgLyoqIEdMU0wt0LrQvtC00Ysg0YjQtdC50LTQtdGA0L7Qsi4gKi9cbiAgcHVibGljIHNoYWRlckNvZGVWZXJ0OiBzdHJpbmcgPSAnJ1xuICBwdWJsaWMgc2hhZGVyQ29kZUZyYWc6IHN0cmluZyA9ICcnXG5cbiAgLyoqINCh0YLQsNGC0LjRgdGC0LjRh9C10YHQutCw0Y8g0LjQvdGE0L7RgNC80LDRhtC40Y8uICovXG4gIHB1YmxpYyBzdGF0cyA9IHtcbiAgICBvYmpUb3RhbENvdW50OiAwLFxuICAgIG9iakluR3JvdXBDb3VudDogW10gYXMgbnVtYmVyW10sXG4gICAgZ3JvdXBzQ291bnQ6IDAsXG4gICAgbWVtVXNhZ2U6IDBcbiAgfVxuXG4gIC8qKiDQntCx0YrQtdC60YIt0LrQsNC90LLQsNGBINC60L7QvdGC0LXQutGB0YLQsCDRgNC10L3QtNC10YDQuNC90LPQsCBXZWJHTC4gKi9cbiAgcHVibGljIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnRcblxuICAvKiog0KXQtdC70L/QtdGAINCy0LfQsNC40LzQvtC00LXQudGB0YLQstC40Y8g0YEg0YPRgdGC0YDQvtC50YHRgtCy0L7QvCDQstCy0L7QtNCwLiAqL1xuICBwcm90ZWN0ZWQgY29udHJvbDogU1Bsb3RDb250b2wgPSBuZXcgU1Bsb3RDb250b2wodGhpcylcblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQodC+0LfQtNCw0LXRgiDRjdC60LfQtdC80L/Qu9GP0YAg0LrQu9Cw0YHRgdCwLCDQuNC90LjRhtC40LDQu9C40LfQuNGA0YPQtdGCINC90LDRgdGC0YDQvtC50LrQuCAo0LXRgdC70Lgg0L/QtdGA0LXQtNCw0L3RiykuXG4gICAqXG4gICAqIEByZW1hcmtzXG4gICAqINCV0YHQu9C4INC60LDQvdCy0LDRgSDRgSDQt9Cw0LTQsNC90L3Ri9C8INC40LTQtdC90YLQuNGE0LjQutCw0YLQvtGA0L7QvCDQvdC1INC90LDQudC00LXQvSAtINCz0LXQvdC10YDQuNGA0YPQtdGC0YHRjyDQvtGI0LjQsdC60LAuINCd0LDRgdGC0YDQvtC50LrQuCDQvNC+0LPRg9GCINCx0YvRgtGMINC30LDQtNCw0L3RiyDQutCw0Log0LJcbiAgICog0LrQvtC90YHRgtGA0YPQutGC0L7RgNC1LCDRgtCw0Log0Lgg0LIg0LzQtdGC0L7QtNC1IHtAbGluayBzZXR1cH0uINCSINC70Y7QsdC+0Lwg0YHQu9GD0YfQsNC1INC90LDRgdGC0YDQvtC50LrQuCDQtNC+0LvQttC90Ysg0LHRi9GC0Ywg0LfQsNC00LDQvdGLINC00L4g0LfQsNC/0YPRgdC60LAg0YDQtdC90LTQtdGA0LAuXG4gICAqXG4gICAqIEBwYXJhbSBjYW52YXNJZCAtINCY0LTQtdC90YLQuNGE0LjQutCw0YLQvtGAINC60LDQvdCy0LDRgdCwLCDQvdCwINC60L7RgtC+0YDQvtC8INCx0YPQtNC10YIg0YDQuNGB0L7QstCw0YLRjNGB0Y8g0LPRgNCw0YTQuNC6LlxuICAgKiBAcGFyYW0gb3B0aW9ucyAtINCf0L7Qu9GM0LfQvtCy0LDRgtC10LvRjNGB0LrQuNC1INC90LDRgdGC0YDQvtC50LrQuCDRjdC60LfQtdC80L/Qu9GP0YDQsC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGNhbnZhc0lkOiBzdHJpbmcsIG9wdGlvbnM/OiBTUGxvdE9wdGlvbnMpIHtcblxuICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChjYW52YXNJZCkpIHtcbiAgICAgIHRoaXMuY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY2FudmFzSWQpIGFzIEhUTUxDYW52YXNFbGVtZW50XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcign0JrQsNC90LLQsNGBINGBINC40LTQtdC90YLQuNGE0LjQutCw0YLQvtGA0L7QvCBcIiMnICsgY2FudmFzSWQgKyAnXCIg0L3QtSDQvdCw0LnQtNC10L0hJylcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucykge1xuICAgICAgdGhpcy5zZXRPcHRpb25zKG9wdGlvbnMpICAgIC8vINCV0YHQu9C4INC/0LXRgNC10LTQsNC90Ysg0L3QsNGB0YLRgNC+0LnQutC4LCDRgtC+INC+0L3QuCDQv9GA0LjQvNC10L3Rj9GO0YLRgdGPLlxuXG4gICAgICBpZiAodGhpcy5mb3JjZVJ1bikge1xuICAgICAgICB0aGlzLnNldHVwKG9wdGlvbnMpICAgICAgIC8vICDQmNC90LjRhtC40LDQu9C40LfQsNGG0LjRjyDQstGB0LXRhSDQv9Cw0YDQsNC80LXRgtGA0L7QsiDRgNC10L3QtNC10YDQsCwg0LXRgdC70Lgg0LfQsNC/0YDQvtGI0LXQvSDRhNC+0YDRgdC40YDQvtCy0LDQvdC90YvQuSDQt9Cw0L/Rg9GB0LouXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JjQvdC40YbQuNCw0LvQuNC30LjRgNGD0LXRgiDQvdC10L7QsdGF0L7QtNC40LzRi9C1INC00LvRjyDRgNC10L3QtNC10YDQsCDQv9Cw0YDQsNC80LXRgtGA0Ysg0Y3QutC30LXQvNC/0LvRj9GA0LAsINCy0YvQv9C+0LvQvdGP0LXRgiDQv9C+0LTQs9C+0YLQvtCy0LrRgyDQuCDQt9Cw0L/QvtC70L3QtdC90LjQtSDQsdGD0YTQtdGA0L7QsiBXZWJHTC5cbiAgICpcbiAgICogQHBhcmFtIG9wdGlvbnMgLSDQndCw0YHRgtGA0L7QudC60Lgg0Y3QutC30LXQvNC/0LvRj9GA0LAuXG4gICAqL1xuICBwdWJsaWMgc2V0dXAob3B0aW9uczogU1Bsb3RPcHRpb25zKTogdm9pZCB7XG5cbiAgICAvKiog0J/RgNC40LzQtdC90LXQvdC40LUg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GM0YHQutC40YUg0L3QsNGB0YLRgNC+0LXQui4gKi9cbiAgICB0aGlzLnNldE9wdGlvbnMob3B0aW9ucylcblxuICAgIHRoaXMuZGVidWcubG9nKCdpbnRybycpXG5cbiAgICAvKiog0J/QvtC00LPQvtGC0L7QstC60LAg0LLRgdC10YUg0YXQtdC70L/QtdGA0L7Qsi4gKi9cbiAgICB0aGlzLndlYmdsLnNldHVwKClcbiAgICB0aGlzLmNvbnRyb2wuc2V0dXAoKVxuICAgIHRoaXMuZGVidWcuc2V0dXAoKVxuICAgIHRoaXMuZGVtby5zZXR1cCgpXG5cbiAgICB0aGlzLmRlYnVnLmxvZygnaW5zdGFuY2UnKVxuXG4gICAgLyoqINCj0YHRgtCw0L3QvtCy0LrQsCDRhNC+0L3QvtCy0L7Qs9C+INGG0LLQtdGC0LAg0LrQsNC90LLQsNGB0LAgKNGG0LLQtdGCINC+0YfQuNGB0YLQutC4INC60L7QvdGC0LXQutGB0YLQsCDRgNC10L3QtNC10YDQuNC90LPQsCkuICovXG4gICAgdGhpcy53ZWJnbC5zZXRCZ0NvbG9yKHRoaXMuZ3JpZC5iZ0NvbG9yISlcblxuICAgIC8qKiDQodC+0LfQtNCw0L3QuNC1INGI0LXQudC00LXRgNC+0LIg0Lgg0L/RgNC+0LPRgNCw0LzQvNGLIFdlYkdMLiAqL1xuICAgIHRoaXMuc2hhZGVyQ29kZVZlcnQgPSBTSEFERVJfQ09ERV9WRVJUX1RNUEwucmVwbGFjZSgne0NPTE9SLUNPREV9JywgdGhpcy5nZW5TaGFkZXJDb2xvckNvZGUoKSkudHJpbSgpXG4gICAgdGhpcy5zaGFkZXJDb2RlRnJhZyA9IFNIQURFUl9DT0RFX0ZSQUdfVE1QTC50cmltKClcbiAgICB0aGlzLndlYmdsLmNyZWF0ZVByb2dyYW0odGhpcy5zaGFkZXJDb2RlVmVydCwgdGhpcy5zaGFkZXJDb2RlRnJhZylcblxuICAgIC8qKiDQodC+0LfQtNCw0L3QuNC1INC/0LXRgNC10LzQtdC90L3Ri9GFIFdlYkdsLiAqL1xuICAgIHRoaXMud2ViZ2wuY3JlYXRlVmFyaWFibGVzKCdhX3Bvc2l0aW9uJywgJ2FfY29sb3InLCAnYV9zaXplJywgJ2Ffc2hhcGUnLCAndV9tYXRyaXgnKVxuXG4gICAgLyoqINCe0LHRgNCw0LHQvtGC0LrQsCDQstGB0LXRhSDQtNCw0L3QvdGL0YUg0L7QsSDQvtCx0YrQtdC60YLQsNGFINC4INC40YUg0LfQsNCz0YDRg9C30LrQsCDQsiDQsdGD0YTQtdGA0Ysg0LLQuNC00LXQvtC/0LDQvNGP0YLQuC4gKi9cbiAgICB0aGlzLmxvYWREYXRhKClcblxuICAgIGlmICh0aGlzLmZvcmNlUnVuKSB7XG4gICAgICAvKiog0KTQvtGA0YHQuNGA0L7QstCw0L3QvdGL0Lkg0LfQsNC/0YPRgdC6INGA0LXQvdC00LXRgNC40L3Qs9CwICjQtdGB0LvQuCDRgtGA0LXQsdGD0LXRgtGB0Y8pLiAqL1xuICAgICAgdGhpcy5ydW4oKVxuICAgIH1cbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCf0YDQuNC80LXQvdGP0LXRgiDQvdCw0YHRgtGA0L7QudC60Lgg0Y3QutC30LXQvNC/0LvRj9GA0LAuXG4gICAqXG4gICAqIEBwYXJhbSBvcHRpb25zIC0g0J3QsNGB0YLRgNC+0LnQutC4INGN0LrQt9C10LzQv9C70Y/RgNCwLlxuICAgKi9cbiAgcHJvdGVjdGVkIHNldE9wdGlvbnMob3B0aW9uczogU1Bsb3RPcHRpb25zKTogdm9pZCB7XG5cbiAgICAvKiog0J/RgNC40LzQtdC90LXQvdC40LUg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GM0YHQutC40YUg0L3QsNGB0YLRgNC+0LXQui4gKi9cbiAgICBjb3B5TWF0Y2hpbmdLZXlWYWx1ZXModGhpcywgb3B0aW9ucylcblxuICAgIC8qKiDQldGB0LvQuCDQt9Cw0LTQsNC9INGA0LDQt9C80LXRgCDQv9C70L7RgdC60L7RgdGC0LgsINC90L4g0L3QtSDQt9Cw0LTQsNC90L4g0L/QvtC70L7QttC10L3QuNC1INC+0LHQu9Cw0YHRgtC4INC/0YDQvtGB0LzQvtGC0YDQsCwg0YLQviDQvtC90LAg0L/QvtC80LXRidCw0LXRgtGB0Y8g0LIg0YbQtdC90YLRgCDQv9C70L7RgdC60L7RgdGC0LguICovXG4gICAgaWYgKCgnZ3JpZCcgaW4gb3B0aW9ucykgJiYgISgnY2FtZXJhJyBpbiBvcHRpb25zKSkge1xuICAgICAgdGhpcy5jYW1lcmEueCA9IHRoaXMuZ3JpZC53aWR0aCEgLyAyXG4gICAgICB0aGlzLmNhbWVyYS55ID0gdGhpcy5ncmlkLmhlaWdodCEgLyAyXG4gICAgfVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0KHQvtC30LTQsNC10YIg0Lgg0LfQsNC/0L7Qu9C90Y/QtdGCINC00LDQvdC90YvQvNC4INC+0LHQviDQstGB0LXRhSDQvtCx0YrQtdC60YLQsNGFINCx0YPRhNC10YDRiyBXZWJHTC5cbiAgICovXG4gIHByb3RlY3RlZCBsb2FkRGF0YSgpOiB2b2lkIHtcblxuICAgIHRoaXMuZGVidWcubG9nKCdsb2FkaW5nJylcblxuICAgIGxldCBncm91cHMgPSB7IHZlcnRpY2VzOiBbXSBhcyBudW1iZXJbXSwgY29sb3JzOiBbXSBhcyBudW1iZXJbXSwgc2l6ZXM6IFtdIGFzIG51bWJlcltdLCBzaGFwZXM6IFtdIGFzIG51bWJlcltdIH1cbiAgICB0aGlzLnN0YXRzID0geyBvYmpUb3RhbENvdW50OiAwLCBvYmpJbkdyb3VwQ291bnQ6IFtdIGFzIG51bWJlcltdLCBncm91cHNDb3VudDogMCwgbWVtVXNhZ2U6IDAgfVxuXG4gICAgbGV0IG9iamVjdDogU1Bsb3RPYmplY3QgfCBudWxsIHwgdW5kZWZpbmVkXG4gICAgbGV0IGk6IG51bWJlciA9IDBcbiAgICBsZXQgaXNPYmplY3RFbmRzOiBib29sZWFuID0gZmFsc2VcblxuICAgIHdoaWxlICghaXNPYmplY3RFbmRzKSB7XG5cbiAgICAgIG9iamVjdCA9IHRoaXMuaXRlcmF0b3IhKClcbiAgICAgIGlzT2JqZWN0RW5kcyA9IChvYmplY3QgPT09IG51bGwpIHx8ICh0aGlzLnN0YXRzLm9ialRvdGFsQ291bnQgPj0gdGhpcy5nbG9iYWxMaW1pdClcblxuICAgICAgaWYgKCFpc09iamVjdEVuZHMpIHtcbiAgICAgICAgZ3JvdXBzLnZlcnRpY2VzLnB1c2gob2JqZWN0IS54LCBvYmplY3QhLnkpXG4gICAgICAgIGdyb3Vwcy5zaGFwZXMucHVzaChvYmplY3QhLnNoYXBlKVxuICAgICAgICBncm91cHMuc2l6ZXMucHVzaChvYmplY3QhLnNpemUpXG4gICAgICAgIGdyb3Vwcy5jb2xvcnMucHVzaChvYmplY3QhLmNvbG9yKVxuICAgICAgICB0aGlzLnN0YXRzLm9ialRvdGFsQ291bnQrK1xuICAgICAgICBpKytcbiAgICAgIH1cblxuICAgICAgaWYgKChpID49IHRoaXMuZ3JvdXBMaW1pdCkgfHwgaXNPYmplY3RFbmRzKSB7XG4gICAgICAgIHRoaXMuc3RhdHMub2JqSW5Hcm91cENvdW50W3RoaXMuc3RhdHMuZ3JvdXBzQ291bnRdID0gaVxuXG4gICAgICAgIC8qKiDQodC+0LfQtNCw0L3QuNC1INC4INC30LDQv9C+0LvQvdC10L3QuNC1INCx0YPRhNC10YDQvtCyINC00LDQvdC90YvQvNC4INC+INGC0LXQutGD0YnQtdC5INCz0YDRg9C/0L/QtSDQvtCx0YrQtdC60YLQvtCyLiAqL1xuICAgICAgICB0aGlzLnN0YXRzLm1lbVVzYWdlICs9XG4gICAgICAgICAgdGhpcy53ZWJnbC5jcmVhdGVCdWZmZXIoJ3ZlcnRpY2VzJywgbmV3IEZsb2F0MzJBcnJheShncm91cHMudmVydGljZXMpKSArXG4gICAgICAgICAgdGhpcy53ZWJnbC5jcmVhdGVCdWZmZXIoJ2NvbG9ycycsIG5ldyBVaW50OEFycmF5KGdyb3Vwcy5jb2xvcnMpKSArXG4gICAgICAgICAgdGhpcy53ZWJnbC5jcmVhdGVCdWZmZXIoJ3NoYXBlcycsIG5ldyBVaW50OEFycmF5KGdyb3Vwcy5zaGFwZXMpKSArXG4gICAgICAgICAgdGhpcy53ZWJnbC5jcmVhdGVCdWZmZXIoJ3NpemVzJywgbmV3IEZsb2F0MzJBcnJheShncm91cHMuc2l6ZXMpKVxuICAgICAgfVxuXG4gICAgICBpZiAoKGkgPj0gdGhpcy5ncm91cExpbWl0KSAmJiAhaXNPYmplY3RFbmRzKSB7XG4gICAgICAgIHRoaXMuc3RhdHMuZ3JvdXBzQ291bnQrK1xuICAgICAgICBncm91cHMgPSB7IHZlcnRpY2VzOiBbXSwgY29sb3JzOiBbXSwgc2l6ZXM6IFtdLCBzaGFwZXM6IFtdIH1cbiAgICAgICAgaSA9IDBcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmRlYnVnLmxvZygnbG9hZGVkJylcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCf0YDQvtC40LfQstC+0LTQuNGCINGA0LXQvdC00LXRgNC40L3QsyDQs9GA0LDRhNC40LrQsCDQsiDRgdC+0L7RgtCy0LXRgtGB0YLQstC40Lgg0YEg0YLQtdC60YPRidC40LzQuCDQv9Cw0YDQsNC80LXRgtGA0LDQvNC4INGC0YDQsNC90YHRhNC+0YDQvNCw0YbQuNC4LlxuICAgKi9cbiAgcHVibGljIHJlbmRlcigpOiB2b2lkIHtcblxuICAgIC8qKiDQntGH0LjRgdGC0LrQsCDQvtCx0YrQtdC60YLQsCDRgNC10L3QtNC10YDQuNC90LPQsCBXZWJHTC4gKi9cbiAgICB0aGlzLndlYmdsLmNsZWFyQmFja2dyb3VuZCgpXG5cbiAgICAvKiog0J7QsdC90L7QstC70LXQvdC40LUg0LzQsNGC0YDQuNGG0Ysg0YLRgNCw0L3RgdGE0L7RgNC80LDRhtC40LguICovXG4gICAgdGhpcy5jb250cm9sLnVwZGF0ZVZpZXdQcm9qZWN0aW9uKClcblxuICAgIC8qKiDQn9GA0LjQstGP0LfQutCwINC80LDRgtGA0LjRhtGLINGC0YDQsNC90YHRhNC+0YDQvNCw0YbQuNC4INC6INC/0LXRgNC10LzQtdC90L3QvtC5INGI0LXQudC00LXRgNCwLiAqL1xuICAgIHRoaXMud2ViZ2wuc2V0VmFyaWFibGUoJ3VfbWF0cml4JywgdGhpcy5jb250cm9sLnRyYW5zZm9ybS52aWV3UHJvamVjdGlvbk1hdClcblxuICAgIC8qKiDQmNGC0LXRgNC40YDQvtCy0LDQvdC40LUg0Lgg0YDQtdC90LTQtdGA0LjQvdCzINCz0YDRg9C/0L8g0LHRg9GE0LXRgNC+0LIgV2ViR0wuICovXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnN0YXRzLmdyb3Vwc0NvdW50OyBpKyspIHtcblxuICAgICAgdGhpcy53ZWJnbC5zZXRCdWZmZXIoJ3ZlcnRpY2VzJywgaSwgJ2FfcG9zaXRpb24nLCAyLCAwLCAwKVxuICAgICAgdGhpcy53ZWJnbC5zZXRCdWZmZXIoJ2NvbG9ycycsIGksICdhX2NvbG9yJywgMSwgMCwgMClcbiAgICAgIHRoaXMud2ViZ2wuc2V0QnVmZmVyKCdzaXplcycsIGksICdhX3NpemUnLCAxLCAwLCAwKVxuICAgICAgdGhpcy53ZWJnbC5zZXRCdWZmZXIoJ3NoYXBlcycsIGksICdhX3NoYXBlJywgMSwgMCwgMClcblxuICAgICAgdGhpcy53ZWJnbC5kcmF3UG9pbnRzKDAsIHRoaXMuc3RhdHMub2JqSW5Hcm91cENvdW50W2ldKVxuICAgIH1cbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCX0LDQv9GD0YHQutCw0LXRgiDRgNC10L3QtNC10YDQuNC90LMg0Lgg0LrQvtC90YLRgNC+0LvRjCDRg9C/0YDQsNCy0LvQtdC90LjRjy5cbiAgICovXG4gIHB1YmxpYyBydW4oKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmlzUnVubmluZykge1xuICAgICAgdGhpcy5yZW5kZXIoKVxuICAgICAgdGhpcy5jb250cm9sLnJ1bigpXG4gICAgICB0aGlzLmlzUnVubmluZyA9IHRydWVcbiAgICAgIHRoaXMuZGVidWcubG9nKCdzdGFydGVkJylcbiAgICB9XG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQntGB0YLQsNC90LDQstC70LjQstCw0LXRgiDRgNC10L3QtNC10YDQuNC90LMg0Lgg0LrQvtC90YLRgNC+0LvRjCDRg9C/0YDQsNCy0LvQtdC90LjRjy5cbiAgICovXG4gIHB1YmxpYyBzdG9wKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmlzUnVubmluZykge1xuICAgICAgdGhpcy5jb250cm9sLnN0b3AoKVxuICAgICAgdGhpcy5pc1J1bm5pbmcgPSBmYWxzZVxuICAgICAgdGhpcy5kZWJ1Zy5sb2coJ3N0b3BlZCcpXG4gICAgfVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0J7Rh9C40YnQsNC10YIg0YTQvtC9LlxuICAgKi9cbiAgcHVibGljIGNsZWFyKCk6IHZvaWQge1xuICAgIHRoaXMud2ViZ2wuY2xlYXJCYWNrZ3JvdW5kKClcbiAgICB0aGlzLmRlYnVnLmxvZygnY2xlYXJlZCcpXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQodC+0LfQtNCw0LXRgiDQtNC+0L/QvtC70L3QtdC90LjQtSDQuiDQutC+0LTRgyDQvdCwINGP0LfRi9C60LUgR0xTTC5cbiAgICpcbiAgICogQHJlbWFya3NcbiAgICog0KIu0LouINGI0LXQudC00LXRgCDQvdC1INC/0L7Qt9Cy0L7Qu9GP0LXRgiDQuNGB0L/QvtC70YzQt9C+0LLQsNGC0Ywg0LIg0LrQsNGH0LXRgdGC0LLQtSDQuNC90LTQtdC60YHQvtCyINC/0LXRgNC10LzQtdC90L3Ri9C1IC0g0LTQu9GPINC30LDQtNCw0L3QuNGPINGG0LLQtdGC0LAg0LjRgdC/0L7Qu9GM0LfRg9C10YLRgdGPXG4gICAqINC/0L7RgdC+0LXQtNC+0LLQsNGC0LXQu9GM0L3Ri9C5INC/0LXRgNC10LHQvtGAINGG0LLQtdGC0L7QstGL0YUg0LjQvdC00LXQutGB0L7Qsi5cbiAgICpcbiAgICogQHJldHVybnMg0JrQvtC0INC90LAg0Y/Qt9GL0LrQtSBHTFNMLlxuICAgKi9cbiAgcHJvdGVjdGVkIGdlblNoYWRlckNvbG9yQ29kZSgpOiBzdHJpbmcge1xuXG4gICAgLyoqINCS0YDQtdC80LXQvdC90L7QtSDQtNC+0LHQsNCy0LvQtdC90LjQtSDQsiDQv9Cw0LvQuNGC0YDRgyDQstC10YDRiNC40L0g0YbQstC10YLQsCDQvdCw0L/RgNCw0LLQu9GP0Y7RidC40YUuICovXG4gICAgdGhpcy5jb2xvcnMucHVzaCh0aGlzLmdyaWQucnVsZXNDb2xvciEpXG5cbiAgICBsZXQgY29kZTogc3RyaW5nID0gJydcblxuICAgIC8qKiDQpNC+0YDQvNC40YDQvtCy0L3QuNC1IEdMU0wt0LrQvtC00LAg0YPRgdGC0LDQvdC+0LLQutC4INGG0LLQtdGC0LAg0L/QviDQuNC90LTQtdC60YHRgy4gKi9cbiAgICB0aGlzLmNvbG9ycy5mb3JFYWNoKCh2YWx1ZSwgaW5kZXgpID0+IHtcbiAgICAgIGxldCBbciwgZywgYl0gPSBjb2xvckZyb21IZXhUb0dsUmdiKHZhbHVlKVxuICAgICAgY29kZSArPSBgZWxzZSBpZiAoYV9jb2xvciA9PSAke2luZGV4fS4wKSB2X2NvbG9yID0gdmVjMygke3J9LCAke2d9LCAke2J9KTtcXG5gXG4gICAgfSlcblxuICAgIC8qKiDQo9C00LDQu9C10L3QuNC1INC40Lcg0L/QsNC70LjRgtGA0Ysg0LLQtdGA0YjQuNC9INCy0YDQtdC80LXQvdC90L4g0LTQvtCx0LDQstC70LXQvdC90L7Qs9C+INGG0LLQtdGC0LAg0L3QsNC/0YDQsNCy0LvRj9GO0YnQuNGFLiAqL1xuICAgIHRoaXMuY29sb3JzLnBvcCgpXG5cbiAgICAvKiog0KPQtNCw0LvQtdC90LjQtSDQu9C40YjQvdC10LPQviBcImVsc2VcIiDQsiDQvdCw0YfQsNC70LUgR0xTTC3QutC+0LTQsC4gKi9cbiAgICByZXR1cm4gY29kZS5zbGljZSg1KVxuICB9XG59XG4iLCJcbi8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKlxuICog0J/RgNC+0LLQtdGA0Y/QtdGCINGP0LLQu9GP0LXRgtGB0Y8g0LvQuCDQv9C10YDQtdC80LXQvdC90LDRjyDRjdC60LfQtdC80L/Qu9GP0YDQvtC8INC60LDQutC+0LPQvi3Qu9C40LHQvtC+INC60LvQsNGB0YHQsC5cbiAqXG4gKiBAcGFyYW0gdmFyaWFibGUgLSDQn9GA0L7QstC10YDRj9C10LzQsNGPINC/0LXRgNC10LzQtdC90L3QsNGPLlxuICogQHJldHVybnMg0KDQtdC30YPQu9GM0YLQsNGCINC/0YDQvtCy0LXRgNC60LguXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc09iamVjdCh2YXJpYWJsZTogYW55KTogYm9vbGVhbiB7XG4gIHJldHVybiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhcmlhYmxlKSA9PT0gJ1tvYmplY3QgT2JqZWN0XScpXG59XG5cbi8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKlxuICog0J/QtdGA0LXQvtC/0YDQtdC00LXQu9GP0LXRgiDQt9C90LDRh9C10L3QuNGPINC/0L7Qu9C10Lkg0L7QsdGK0LXQutGC0LAgdGFyZ2V0INC90LAg0LfQvdCw0YfQtdC90LjRjyDQv9C+0LvQtdC5INC+0LHRitC10LrRgtCwIHNvdXJjZS5cbiAqXG4gKiBAcmVtYXJrc1xuICog0J/QtdGA0LXQvtC/0YDQtdC00LXQu9GP0Y7RgtGB0Y8g0YLQvtC70YzQutC+INGC0LUg0L/QvtC70Y8sINC60L7RgtC+0YDRi9C1INGB0YPRidC10YHRgtCy0YPQtdGO0YIg0LIgdGFyZ2V0LiDQldGB0LvQuCDQsiBzb3VyY2Ug0LXRgdGC0Ywg0L/QvtC70Y8sINC60L7RgtC+0YDRi9GFINC90LXRgiDQsiB0YXJnZXQsINGC0L4g0L7QvdC4XG4gKiDQuNCz0L3QvtGA0LjRgNGD0Y7RgtGB0Y8uINCV0YHQu9C4INC60LDQutC40LUt0YLQviDQv9C+0LvRjyDRgdCw0LzQuCDRj9Cy0LvRj9GO0YLRgdGPINGP0LLQu9GP0Y7RgtGB0Y8g0L7QsdGK0LXQutGC0LDQvNC4LCDRgtC+INGC0L4g0L7QvdC4INGC0LDQutC20LUg0YDQtdC60YPRgNGB0LjQstC90L4g0LrQvtC/0LjRgNGD0Y7RgtGB0Y8gKNC/0YDQuCDRgtC+0Lwg0LbQtVxuICog0YPRgdC70L7QstC40LgsINGH0YLQviDQsiDRhtC10LvQtdCy0L7QvCDQvtCx0YrQtdC60YLQtSDRgdGD0YnQtdGB0YLQstGD0Y7RgiDQv9C+0LvRjyDQvtCx0YrQtdC60YLQsC3QuNGB0YLQvtGH0L3QuNC60LApLlxuICpcbiAqIEBwYXJhbSB0YXJnZXQgLSDQptC10LvQtdCy0L7QuSAo0LjQt9C80LXQvdGP0LXQvNGL0LkpINC+0LHRitC10LrRgi5cbiAqIEBwYXJhbSBzb3VyY2UgLSDQntCx0YrQtdC60YIg0YEg0LTQsNC90L3Ri9C80LgsINC60L7RgtC+0YDRi9C1INC90YPQttC90L4g0YPRgdGC0LDQvdC+0LLQuNGC0Ywg0YMg0YbQtdC70LXQstC+0LPQviDQvtCx0YrQtdC60YLQsC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvcHlNYXRjaGluZ0tleVZhbHVlcyh0YXJnZXQ6IGFueSwgc291cmNlOiBhbnkpOiB2b2lkIHtcbiAgT2JqZWN0LmtleXMoc291cmNlKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgaWYgKGtleSBpbiB0YXJnZXQpIHtcbiAgICAgIGlmIChpc09iamVjdChzb3VyY2Vba2V5XSkpIHtcbiAgICAgICAgaWYgKGlzT2JqZWN0KHRhcmdldFtrZXldKSkge1xuICAgICAgICAgIGNvcHlNYXRjaGluZ0tleVZhbHVlcyh0YXJnZXRba2V5XSwgc291cmNlW2tleV0pXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghaXNPYmplY3QodGFyZ2V0W2tleV0pICYmICh0eXBlb2YgdGFyZ2V0W2tleV0gIT09ICdmdW5jdGlvbicpKSB7XG4gICAgICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KVxufVxuXG4vKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICpcbiAqINCS0L7Qt9Cy0YDQsNGJ0LDQtdGCINGB0LvRg9GH0LDQudC90L7QtSDRhtC10LvQvtC1INGH0LjRgdC70L4g0LIg0LTQuNCw0L/QsNC30L7QvdC1OiBbMC4uLnJhbmdlLTFdLlxuICpcbiAqIEBwYXJhbSByYW5nZSAtINCS0LXRgNGF0L3QuNC5INC/0YDQtdC00LXQuyDQtNC40LDQv9Cw0LfQvtC90LAg0YHQu9GD0YfQsNC50L3QvtCz0L4g0LLRi9Cx0L7RgNCwLlxuICogQHJldHVybnMg0KHQu9GD0YfQsNC50L3QvtC1INGH0LjRgdC70L4uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByYW5kb21JbnQocmFuZ2U6IG51bWJlcik6IG51bWJlciB7XG4gIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiByYW5nZSlcbn1cblxuLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqXG4gKiDQmtC+0L3QstC10YDRgtC40YDRg9C10YIg0YbQstC10YIg0LjQtyBIRVgt0YTQvtGA0LzQsNGC0LAg0LIgR0xTTC3RhNC+0YDQvNCw0YIuXG4gKlxuICogQHBhcmFtIGhleENvbG9yIC0g0KbQstC10YIg0LIgSEVYLdGE0L7RgNC80LDRgtC1IChcIiNmZmZmZmZcIikuXG4gKiBAcmV0dXJucyDQnNCw0YHRgdC40LIg0LjQtyDRgtGA0LXRhSDRh9C40YHQtdC7INCyINC00LjQsNC/0LDQt9C+0L3QtSDQvtGCIDAg0LTQviAxLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY29sb3JGcm9tSGV4VG9HbFJnYihoZXhDb2xvcjogc3RyaW5nKTogbnVtYmVyW10ge1xuICBsZXQgayA9IC9eIz8oW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkkL2kuZXhlYyhoZXhDb2xvcilcbiAgbGV0IFtyLCBnLCBiXSA9IFtwYXJzZUludChrIVsxXSwgMTYpIC8gMjU1LCBwYXJzZUludChrIVsyXSwgMTYpIC8gMjU1LCBwYXJzZUludChrIVszXSwgMTYpIC8gMjU1XVxuICByZXR1cm4gW3IsIGcsIGJdXG59XG5cbi8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKlxuICog0JLQvtC30LLRgNCw0YnQsNC10YIg0YHRgtGA0L7QutC+0LLRg9GOINC30LDQv9C40YHRjCDRgtC10LrRg9GJ0LXQs9C+INCy0YDQtdC80LXQvdC4LlxuICpcbiAqIEByZXR1cm5zINCh0YLRgNC+0LrQsCDQstGA0LXQvNC10L3QuCDQsiDRhNC+0YDQvNCw0YLQtSBcImhoOm1tOnNzXCIuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRDdXJyZW50VGltZSgpOiBzdHJpbmcge1xuXG4gIGxldCB0b2RheSA9IG5ldyBEYXRlKClcblxuICByZXR1cm4gW1xuICAgIHRvZGF5LmdldEhvdXJzKCkudG9TdHJpbmcoKS5wYWRTdGFydCgyLCAnMCcpLFxuICAgIHRvZGF5LmdldE1pbnV0ZXMoKS50b1N0cmluZygpLnBhZFN0YXJ0KDIsICcwJyksXG4gICAgdG9kYXkuZ2V0U2Vjb25kcygpLnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgJzAnKVxuICBdLmpvaW4oJzonKVxufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vaW5kZXgudHNcIik7XG4iXSwic291cmNlUm9vdCI6IiJ9