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

/***/ "./shaders.ts":
/*!********************!*\
  !*** ./shaders.ts ***!
  \********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SHAPES = exports.FRAGMENT_TEMPLATE = exports.VERTEX_TEMPLATE = void 0;
exports.VERTEX_TEMPLATE = "\nattribute vec2 a_position;\nattribute float a_color;\nattribute float a_size;\nattribute float a_shape;\nuniform mat3 u_matrix;\nvarying vec3 v_color;\nvarying float v_shape;\nvoid main() {\n  gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0.0, 1.0);\n  gl_PointSize = a_size;\n  v_shape = a_shape;\n  {COLOR-SELECTION}\n}\n";
exports.FRAGMENT_TEMPLATE = "\nprecision highp float;\nvarying vec3 v_color;\nvarying float v_shape;\n{SHAPES-FUNCTIONS}\nvoid main() {\n  {SHAPE-SELECTION}\n  gl_FragColor = vec4(v_color.rgb, 1.0);\n}\n";
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
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
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
            startCamera: {},
            startPos: [],
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
     * Обновляет матрицу трансформации.
     */
    SPlotContol.prototype.updateViewProjection = function () {
        var canvas = this.splot.canvas;
        var camera = this.splot.camera;
        var d0 = camera.zoom;
        var d1 = 2 / canvas.width * d0;
        var d2 = 2 / canvas.height * d0;
        this.transform.viewProjectionMat = [d1, 0, 0, 0, -d2, 0, -d1 * camera.x - 1, d2 * camera.y, 1];
    };
    /** ****************************************************************************
     *
     * Преобразует координаты мыши в GL-координаты.
     */
    SPlotContol.prototype.getClipSpaceMousePosition = function (event) {
        var canvas = this.splot.canvas;
        var rect = canvas.getBoundingClientRect();
        var clipX = 2 * ((event.clientX - rect.left) / canvas.clientWidth) - 1;
        var clipY = -2 * ((event.clientY - rect.top) / canvas.clientHeight) + 1;
        return [clipX, clipY];
    };
    /** ****************************************************************************
     *
     * Реагирует на движение мыши в момент, когда ее клавиша удерживается нажатой. Метод перемещает область видимости на
     * плоскости вместе с движением мыши.
     */
    SPlotContol.prototype.handleMouseMove = function (event) {
        var splot = this.splot;
        var transform = this.transform;
        var matrix = transform.startInvViewProjMat;
        var _a = this.getClipSpaceMousePosition(event), clipX = _a[0], clipY = _a[1];
        splot.camera.x = transform.startCamera.x + transform.startPos[0] - clipX * matrix[0] - matrix[6];
        splot.camera.y = transform.startCamera.y + transform.startPos[1] - clipY * matrix[4] - matrix[7];
        splot.render();
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
        var splot = this.splot;
        var transform = this.transform;
        splot.canvas.addEventListener('mousemove', this.handleMouseMoveWithContext);
        splot.canvas.addEventListener('mouseup', this.handleMouseUpWithContext);
        var matrix = transform.viewProjectionMat;
        transform.startInvViewProjMat = [1 / matrix[0], 0, 0, 0, 1 / matrix[4], 0, -matrix[6] / matrix[0], -matrix[7] / matrix[4], 1];
        transform.startCamera = { x: splot.camera.x, y: splot.camera.y, zoom: splot.camera.zoom };
        var _a = this.getClipSpaceMousePosition(event), clipX = _a[0], clipY = _a[1];
        matrix = transform.startInvViewProjMat;
        transform.startPos[0] = clipX * matrix[0] + matrix[6];
        transform.startPos[1] = clipY * matrix[4] + matrix[7];
        splot.render();
    };
    /** ****************************************************************************
     *
     * Реагирует на зумирование мыши. В момент зумирования мыши происходит зумирование координатной плоскости.
     */
    SPlotContol.prototype.handleMouseWheel = function (event) {
        event.preventDefault();
        var camera = this.splot.camera;
        /** Вычисление позиции мыши в GL-координатах. */
        var _a = this.getClipSpaceMousePosition(event), clipX = _a[0], clipY = _a[1];
        /** Позиция мыши до зумирования. */
        var matrix = this.transform.viewProjectionMat;
        var preZoomX = (clipX - matrix[6]) / matrix[0];
        var preZoomY = (clipY - matrix[7]) / matrix[4];
        /** Новое значение зума области просмотра экспоненциально зависит от величины зумирования мыши. */
        var newZoom = camera.zoom * Math.pow(2, event.deltaY * -0.01);
        /** Максимальное и минимальное значения зума области просмотра. */
        camera.zoom = Math.max(camera.minZoom, Math.min(camera.maxZoom, newZoom));
        /** Обновление матрицы трансформации. */
        this.updateViewProjection();
        /** Позиция мыши после зумирования. */
        matrix = this.transform.viewProjectionMat;
        var postZoomX = (clipX - matrix[6]) / matrix[0];
        var postZoomY = (clipY - matrix[7]) / matrix[4];
        /** Вычисление нового положения области просмотра после зумирования. */
        camera.x += preZoomX - postZoomX;
        camera.y += preZoomY - postZoomY;
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
     *
     * @param clearConsole - Признак необходимости очистки консоли браузера перед началом рендера.
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
        console.log("\u0420\u0430\u0437\u043C\u0435\u0440 \u043A\u0430\u043D\u0432\u0430\u0441\u0430: " + this.splot.canvas.width + " x " + this.splot.canvas.height + " px");
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
        console.log("%c\u0417\u0430\u043F\u0443\u0449\u0435\u043D \u043F\u0440\u043E\u0446\u0435\u0441\u0441 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438 \u0434\u0430\u043D\u043D\u044B\u0445 [" + utils_1.getCurrentTime() + "]...", this.groupStyle);
        console.time('Длительность');
    };
    /** ****************************************************************************
     *
     * Выводит статистику по завершении процесса загрузки данных.
     */
    SPlotDebug.prototype.loaded = function () {
        console.group("%c\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u0434\u0430\u043D\u043D\u044B\u0445 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0430 [" + utils_1.getCurrentTime() + "]", this.groupStyle);
        console.timeEnd('Длительность');
        console.log('Результат: ' + ((this.splot.stats.objTotalCount >= this.splot.globalLimit) ?
            'достигнут лимит объектов (' + this.splot.globalLimit.toLocaleString() + ')' :
            'обработаны все объекты'));
        console.log('Расход видеопамяти: ' + (this.splot.stats.memUsage / 1000000).toFixed(2).toLocaleString() + ' МБ');
        console.log('Кол-во объектов: ' + this.splot.stats.objTotalCount.toLocaleString());
        console.log('Создано видеобуферов: ' + this.splot.stats.groupsCount.toLocaleString());
        console.log("\u0413\u0440\u0443\u043F\u043F\u0438\u0440\u043E\u0432\u043A\u0430 \u0432\u0438\u0434\u0435\u043E\u0431\u0443\u0444\u0435\u0440\u043E\u0432: " + this.splot.area.count + " x " + this.splot.area.count);
        console.log("\u0428\u0430\u0433 \u0434\u0435\u043B\u0435\u043D\u0438\u044F \u043D\u0430 \u0433\u0440\u0443\u043F\u043F\u044B: " + this.splot.area.step);
        console.log('Размеры объектов: min = ' + this.splot.stats.minObjectSize + '; max = ' + this.splot.stats.maxObjectSize);
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
        console.log("%c\u041E\u0431\u043B\u0430\u0441\u0442\u044C \u0440\u0435\u043D\u0434\u0435\u0440\u0430 \u043E\u0447\u0438\u0449\u0435\u043D\u0430 [" + color + "]", this.groupStyle);
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
     *
     * @returns Данные об объекте.
     */
    SPlotDemo.prototype.iterator = function () {
        if (this.index < this.amount) {
            this.index++;
            return {
                x: Math.random(),
                y: Math.random(),
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
     * индексов. Место вставки кода обозначается в шаблоне вершинного шейдера словом "{COLOR-SELECTION}".
     *
     * @returns Строка с кодом.
     */
    SPlotGlsl.prototype.makeVertShaderSource = function () {
        /** Временное добавление в палитру вершин цвета направляющих. */
        this.splot.colors.push(this.splot.grid.guideColor);
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
     *
     * @remarks
     * В шаблон фрагментного шейдера вставляется код выбора формы объекта по индексу формы. Т.к.шейдер не позволяет
     * использовать в качестве индексов переменные - для задания формы используется последовательный перебор индексов
     * форм. Каждая форма описывается функцией, которые создаются из перечисляемых GLSL-алгоритмов (константы SHAPES).
     * Место вставки кода функций в шаблоне фрагментного шейдера обозначается словом "{SHAPES-FUNCTIONS}". Место вставки
     * перебора индексов форм обозначается словом "{SHAPE-SELECTION}".
     *
     * @returns Строка с кодом.
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
        /** Удаление лишнего перевода строки в конце кода функций. */
        code1 = code1.slice(0, -1);
        /** Удаление лишнего "else" в начале кода перебора и лишнего перевода строки в конце кода. */
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
        this.antialias = true;
        this.desynchronized = true;
        this.premultipliedAlpha = false;
        this.preserveDrawingBuffer = false;
        this.failIfMajorPerformanceCaveat = false;
        this.powerPreference = 'high-performance';
        /** Названия элементов графической системы клиента. */
        this.gpu = { hardware: '-', software: '-' };
        /** Переменные для связи приложения с программой WebGL. */
        this.variables = new Map();
        /** Признак того, что хелпер уже настроен. */
        this.isSetuped = false;
        /** Буферы видеопамяти WebGL. */
        this.data = [];
        /** Массив соответствий параметра объекта типу группы (типу типизированного массива и типу переменной WebGL). */
        this.objParamType = [];
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
        /** Если ожидается загрузка данных, то видеобуферы предварительно очищаются. */
        if (this.splot.loadData) {
            this.clearData();
        }
        /** Установка фонового цвета канваса (цвет очистки контекста рендеринга). */
        this.setBgColor(this.splot.grid.bgColor);
    };
    /** ****************************************************************************
     *
     * Очищает видеобуферы.
     */
    SPlotWebGl.prototype.clearData = function () {
        for (var dx = 0; dx < this.splot.area.count; dx++) {
            this.data[dx] = [];
            for (var dy = 0; dy < this.splot.area.count; dy++) {
                this.data[dx][dy] = [];
            }
        }
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
     * @param dx - Горизонтальный индекс буферной группы.
     * @param dy - Вертикальный индекс буферной группы.
     * @param objParamIndex - Название группы буферов, в которую будет добавлен новый буфер.
     * @param data - Данные в виде типизированного массива для записи в создаваемый буфер.
     * @returns Объем памяти, занятый новым буфером (в байтах).
     */
    SPlotWebGl.prototype.createBuffer = function (dx, dy, objParamIndex, data) {
        var buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW);
        this.data[dx][dy][objParamIndex] = buffer;
        /** Определение типа параметра объекта по типу типизированного массива переданных данных. */
        this.objParamType[objParamIndex] = this.glNumberTypes.get(data.constructor.name);
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
     * @param dx - Горизонтальный индекс буферной группы.
     * @param dy - Вертикальный индекс буферной группы.
     * @param objParamIndex - Название группы буферов, в котором хранится необходимый буфер.
     * @param varName - Имя переменной (из массива {@link variables}), с которой будет связан буфер.
     * @param size - Количество элементов в буфере, соответствующих одной  GL-вершине.
     * @param stride - Размер шага обработки элементов буфера (значение 0 задает размещение элементов друг за другом).
     * @param offset - Смещение относительно начала буфера, начиная с которого будет происходить обработка элементов.
     */
    SPlotWebGl.prototype.setBuffer = function (dx, dy, objParamIndex, varName, size, stride, offset) {
        var variable = this.variables.get(varName);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.data[dx][dy][objParamIndex]);
        this.gl.enableVertexAttribArray(variable);
        this.gl.vertexAttribPointer(variable, size, this.objParamType[objParamIndex], false, stride, offset);
    };
    /** ****************************************************************************
     *
     * Выполняет отрисовку контекста рендеринга WebGL методом примитивных точек.
     *
     * @param first - Индекс GL-вершины, с которой начнетя отрисовка.
     * @param count - Количество отрисовываемых GL-вершин.
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
        /** Данные об объектах графика. */
        this.data = undefined;
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
        /** Цветовая палитра объектов. */
        this.colors = [];
        /** Параметры координатной плоскости. */
        this.grid = {
            bgColor: '#ffffff',
            guideColor: '#c0c0c0'
        };
        /** Параметры области просмотра. */
        this.camera = {
            x: 0,
            y: 0,
            zoom: 1,
            minZoom: 1,
            maxZoom: 10000000
        };
        /** Признак необходимости загрузки данных об объектах. */
        this.loadData = true;
        /** Признак необходимости безотлагательного запуска рендера. */
        this.isRunning = false;
        /** Статистическая информация. */
        this.stats = {
            objTotalCount: 0,
            groupsCount: 0,
            memUsage: 0,
            minObjectSize: 1000000,
            maxObjectSize: 0, // Значение заведомо меньше любого объекта.
        };
        /** Настройки, запрошенные пользователем в конструкторе или при последнем вызове setup. */
        this.lastRequestedOptions = {};
        /** Хелпер взаимодействия с устройством ввода. */
        this.control = new splot_control_1.default(this);
        /** Признак того, что экземпляр класса был корректно подготовлен к рендеру. */
        this.isSetuped = false;
        /** Переменная для перебора индексов массива данных data. */
        this.arrayIndex = 0;
        /** Информация о группировке и области видимости данных. */
        this.area = {
            groups: [],
            step: 0.02,
            count: 0,
            dxVisibleFrom: 0,
            dxVisibleTo: 0,
            dyVisibleFrom: 0,
            dyVisibleTo: 0,
            shuffledIndices: [],
            objParamCount: 4,
            objSignParamIndex: 1 // Индекс того параметра, у которого на один объект приходится одно значение.
        };
        if (document.getElementById(canvasId)) {
            this.canvas = document.getElementById(canvasId);
        }
        else {
            throw new Error('Канвас с идентификатором "#' + canvasId + '" не найден!');
        }
        /** Вычисление размерности групповой матрицы (кол-во частей графика по каждой размерности). */
        this.area.count = Math.trunc(1 / this.area.step) + 1;
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
        /** Если предоставлен массив с данными об объектах, то устанавливается итератор перебора массива. */
        if (options.data) {
            this.iterator = this.arrayIterator;
            this.arrayIndex = 0;
        }
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
        /**
         * Если начальное положение области видимости и зумирование не были заданы явно, то эти параметры устанавливается
         * таким образом, чтобы при первом отображении область видимости была в центре графика и включала в себя все
         * объекты.
         */
        if (!('camera' in this.lastRequestedOptions)) {
            this.camera.zoom = Math.min(this.canvas.width, this.canvas.height) - this.stats.maxObjectSize;
            this.camera.x = 0.5 - this.canvas.width / (2 * this.camera.zoom);
            this.camera.y = 0.5;
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
        /** При каждом обновлении данных об объектах статистика сбрасывается. */
        this.stats = { objTotalCount: 0, groupsCount: 0, memUsage: 0, minObjectSize: 1000000, maxObjectSize: 0 };
        var dx, dy = 0;
        var groups = [];
        var object;
        var isObjectEnds = false;
        /** Подготовка группировочной матрицы и матрицы случайных индексов. */
        for (var dx_1 = 0; dx_1 < this.area.count; dx_1++) {
            groups[dx_1] = [];
            this.area.shuffledIndices[dx_1] = [];
            for (var dy_1 = 0; dy_1 < this.area.count; dy_1++) {
                groups[dx_1][dy_1] = [];
                this.area.shuffledIndices[dx_1][dy_1] = [dx_1, dy_1];
                for (var i = 0; i < this.area.objParamCount; i++) {
                    groups[dx_1][dy_1][i] = [];
                }
            }
        }
        /** Перемешивание матрицы случайных индексов. */
        utils_1.shuffleMatrix(this.area.shuffledIndices);
        /** Цикл чтения и подготовки данных об объектах. */
        while (!isObjectEnds) {
            /** Получение данных об очередном объекте. */
            object = this.iterator();
            /** Объекты закончились, если итератор вернул null или если достигнут лимит числа объектов. */
            isObjectEnds = (object === null) || (this.stats.objTotalCount >= this.globalLimit);
            if (!isObjectEnds) {
                /** Проверка корректности и подготовка данных объекта. */
                object = this.checkObject(object);
                /** Вычисление группы, в которую запишется объект. */
                dx = Math.trunc(object.x / this.area.step);
                dy = Math.trunc(object.y / this.area.step);
                /** Запись объекта. */
                groups[dx][dy][0].push(object.x, object.y);
                groups[dx][dy][1].push(object.shape);
                groups[dx][dy][2].push(object.color);
                groups[dx][dy][3].push(object.size);
                /** Нахождение минимального и максимального размеров объектов. */
                if (object.size > this.stats.maxObjectSize) {
                    this.stats.maxObjectSize = object.size;
                }
                if (object.size < this.stats.minObjectSize) {
                    this.stats.minObjectSize = object.size;
                }
                this.stats.objTotalCount++;
            }
        }
        this.area.groups = groups;
        /** Цикл копирования данных в видеопамять. */
        for (var dx_2 = 0; dx_2 < this.area.count; dx_2++) {
            for (var dy_2 = 0; dy_2 < this.area.count; dy_2++) {
                if (groups[dx_2][dy_2][this.area.objSignParamIndex].length > 0) {
                    /** Создание видеобуферов, совмещенное с подсчетом занимаемой ими памяти. */
                    this.stats.memUsage +=
                        this.webgl.createBuffer(dx_2, dy_2, 0, new Float32Array(groups[dx_2][dy_2][0])) +
                            this.webgl.createBuffer(dx_2, dy_2, 1, new Uint8Array(groups[dx_2][dy_2][1])) +
                            this.webgl.createBuffer(dx_2, dy_2, 2, new Uint8Array(groups[dx_2][dy_2][2])) +
                            this.webgl.createBuffer(dx_2, dy_2, 3, new Uint8Array(groups[dx_2][dy_2][3]));
                    /** Количество созданных групп (буферов). */
                    this.stats.groupsCount += this.area.objParamCount;
                }
            }
        }
        this.debug.log('loaded');
    };
    /** ****************************************************************************
     *
     * Проверяет корректность параметров объекта и в случае необходимости вносит в них изменения.
     *
     * @param object - Данные об объекте.
     * @returns Скорректированные данные об объекте.
     */
    SPlot.prototype.checkObject = function (object) {
        /** Проверка корректности расположения объекта. */
        if (object.x > 1) {
            object.x = 1;
        }
        else if (object.x < 0) {
            object.x = 0;
        }
        if (object.y > 1) {
            object.y = 1;
        }
        else if (object.y < 0) {
            object.y = 0;
        }
        /** Проверка корректности формы и цвета объекта. */
        if ((object.shape >= this.shapesCount) || (object.shape < 0))
            object.shape = 0;
        if ((object.color >= this.colors.length) || (object.color < 0))
            object.color = 0;
        return object;
    };
    /** ****************************************************************************
     *
     * Вычисляет видимую область групповой матрицы на основе области видимости скаттерплота.
     */
    SPlot.prototype.updateVisibleArea = function () {
        var kx = this.canvas.width / (2 * this.camera.zoom);
        var ky = this.canvas.height / (2 * this.camera.zoom);
        /** Расчет границ области видимости в единичных координатах скаттерплота. */
        var cameraLeft = this.camera.x;
        var cameraRight = this.camera.x + 2 * kx;
        var cameraTop = this.camera.y - ky;
        var cameraBottom = this.camera.y + ky;
        if ((cameraLeft < 1) && (cameraRight > 0) && (cameraTop < 1) && (cameraBottom > 0)) {
            /** Расчет видимой области матрицы, если область видимости скаттерплота находится в пределах графика. */
            this.area.dxVisibleFrom = (cameraLeft < 0) ? 0 : Math.trunc(cameraLeft / this.area.step);
            this.area.dxVisibleTo = (cameraRight > 1) ? this.area.count : this.area.count - Math.trunc((1 - cameraRight) / this.area.step);
            this.area.dyVisibleFrom = (cameraTop < 0) ? 0 : Math.trunc(cameraTop / this.area.step);
            this.area.dyVisibleTo = (cameraBottom > 1) ? this.area.count : this.area.count - Math.trunc((1 - cameraBottom) / this.area.step);
        }
        else {
            /** Если область видимости вне пределов графика, то групповая матрица не требует обхода. */
            this.area.dxVisibleFrom = 1;
            this.area.dxVisibleTo = 0;
            this.area.dyVisibleFrom = 1;
            this.area.dyVisibleTo = 0;
        }
    };
    /** ****************************************************************************
     *
     * Вычисляет отображаемую глубину группы объектов.
     *
     * @param totalCount - Общее количество объектов в группе.
     * @param ratio - Размерный коэффициент, показывающий соотношение между средним размером объектов и линейным размером
     *     группы объектов при текущем значении зумирования.
     * @returns Два параметра глубины отображаемой группы: [0] - индекс, с которого будет начинаться отображение объектов
     *     группы, [1] - количество отбражаемых объектов группы.
     */
    SPlot.prototype.getVisibleObjectsParams = function (totalCount, ratio) {
        var count = 0;
        /** Расчет количества отображаемых объектов на основе размерного коэффициента. */
        if (ratio < 5) {
            count = 40 * ratio;
        }
        else if (ratio < 10) {
            count = 70 * ratio;
        }
        else {
            count = totalCount;
        }
        /** Корректировка полученного количества. */
        count = Math.trunc(count);
        if (count > totalCount) {
            count = totalCount;
        }
        if (count < 1) {
            count = 1;
        }
        return [totalCount - count, count];
    };
    /** ****************************************************************************
     *
     * Производит рендеринг графика в соответствии с текущими параметрами трансформации.
     */
    SPlot.prototype.render = function () {
        var _a;
        /** Очистка объекта рендеринга WebGL. */
        this.webgl.clearBackground();
        /** Обновление матрицы трансформации. */
        this.control.updateViewProjection();
        /** Привязка матрицы трансформации к переменной шейдера. */
        this.webgl.setVariable('u_matrix', this.control.transform.viewProjectionMat);
        /** Вычисление видимой области групповой матрицы. */
        this.updateVisibleArea();
        /**
         * Вычисление размерного коэффициента, показывающего соотношение между средним размером объектов и линейным
         * размером группы объектов при текущем значении зумирования.
         */
        var ratioObjectGroup = (2 * this.camera.zoom * this.area.step) / (this.stats.minObjectSize + this.stats.maxObjectSize);
        var first = 0;
        var count = 0;
        for (var i = 0; i < this.area.count; i++) {
            for (var j = 0; j < this.area.count; j++) {
                /** Индексы извлекаются из матрицы перемешанных индексов. */
                var _b = this.area.shuffledIndices[i][j], dx = _b[0], dy = _b[1];
                /** Если текущий индекс лежит вне видимой области групповой матрицы, то он не итерируется. */
                if ((dx < this.area.dxVisibleFrom) ||
                    (dx > this.area.dxVisibleTo) ||
                    (dy < this.area.dyVisibleFrom) ||
                    (dy > this.area.dyVisibleTo)) {
                    continue;
                }
                if (this.area.groups[dx][dy][this.area.objSignParamIndex].length > 0) {
                    /** Если в текущей группе есть объекты, то делаем соответсвующие буферы активными. */
                    this.webgl.setBuffer(dx, dy, 0, 'a_position', 2, 0, 0);
                    this.webgl.setBuffer(dx, dy, 1, 'a_shape', 1, 0, 0);
                    this.webgl.setBuffer(dx, dy, 2, 'a_color', 1, 0, 0);
                    this.webgl.setBuffer(dx, dy, 3, 'a_size', 1, 0, 0); // Точка с запятой без которой ничего не работает ;-)
                    /** Вычисление отображаемой глубины текущей группы. */
                    _a = this.getVisibleObjectsParams(this.area.groups[dx][dy][this.area.objSignParamIndex].length, ratioObjectGroup), first = _a[0], count = _a[1];
                    /** Рендер группы. */
                    this.webgl.drawPoints(first, count);
                }
            }
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
     * Функция итерирования массива данных об объектах {@link this.data}. При каждом вызове возвращает очередной элемент
     * массива объектов.
     *
     * @returns Данные об очередном объекте или null, если массив закончился.
     */
    SPlot.prototype.arrayIterator = function () {
        if (this.data[this.arrayIndex]) {
            return this.data[this.arrayIndex++];
        }
        else {
            return null;
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
exports.shuffleMatrix = exports.shuffleArray = exports.getCurrentTime = exports.colorFromHexToGlRgb = exports.randomInt = exports.copyMatchingKeyValues = exports.isObject = void 0;
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
/** ****************************************************************************
 *
 * Перемешивает элементы одномерного массива случайным образом.
 *
 * @param array - Целевой массив.
 */
function shuffleArray(array) {
    var _a;
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        _a = [array[j], array[i]], array[i] = _a[0], array[j] = _a[1];
    }
}
exports.shuffleArray = shuffleArray;
/** ****************************************************************************
 *
 * Перемешивает элементы матрицы случайным образом.
 *
 * @param matrix - Целевая матрица.
 */
function shuffleMatrix(matrix) {
    var array = [];
    /** Матрица развертывается в одномерный массив. */
    for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[i].length; j++) {
            array.push(matrix[i][j]);
        }
    }
    /** Перемешивание массива. */
    shuffleArray(array);
    /** Массив собирается в матрицу. */
    for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[i].length; j++) {
            matrix[i][j] = array.pop();
        }
    }
}
exports.shuffleMatrix = shuffleMatrix;


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

const urlParams = new URLSearchParams(window.location.search)
const userN = urlParams.get('n')

let n = (userN)? userN : 1_000_000

let colors = ['#D81C01', '#E9967A', '#BA55D3', '#FFD700', '#FFE4B5', '#FF8C00', '#228B22', '#90EE90', '#4169E1', '#00BFFF', '#8B4513', '#00CED1']

/** Синтетическая итерирующая функция. */
let i = 0
function readNextObject() {
  if (i < n) {
    i++
    return {
      x: Math.random(),
      y: Math.random(),
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
  debug: {
    isEnable: true,
  },
  demo: {
    isEnable: false
  }
})

scatterPlot.run()

/** ************************************************************************* */

document.getElementById('obj-count').innerHTML = scatterPlot.stats.objTotalCount.toLocaleString()

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zdHlsZS5jc3MiLCJ3ZWJwYWNrOi8vLy4vc2hhZGVycy50cyIsIndlYnBhY2s6Ly8vLi9zcGxvdC1jb250cm9sLnRzIiwid2VicGFjazovLy8uL3NwbG90LWRlYnVnLnRzIiwid2VicGFjazovLy8uL3NwbG90LWRlbW8udHMiLCJ3ZWJwYWNrOi8vLy4vc3Bsb3QtZ2xzbC50cyIsIndlYnBhY2s6Ly8vLi9zcGxvdC13ZWJnbC50cyIsIndlYnBhY2s6Ly8vLi9zcGxvdC50cyIsIndlYnBhY2s6Ly8vLi91dGlscy50cyIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vLy4vaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7QUNBYSx1QkFBZSxHQUM1QixpVkFjQztBQUVZLHlCQUFpQixHQUM5QixnTEFTQztBQUVZLGNBQU0sR0FBYSxFQUFFO0FBRWxDLGlCQUFTLEdBQUksVUFBVTtJQUN2QixJQUNDO0FBRUQsaUJBQVMsR0FBSSxPQUFPO0lBQ3BCLHFEQUVDO0FBRUQsaUJBQVMsR0FBSSxRQUFRO0lBQ3JCLDBPQU1DO0FBRUQsaUJBQVMsR0FBSSxjQUFjO0lBQzNCLDJOQUlDO0FBRUQsaUJBQVMsR0FBSSxhQUFhO0lBQzFCLCtNQU9DOzs7Ozs7Ozs7Ozs7O0FDOUREOzs7O0dBSUc7QUFDSDtJQW1CRSwyREFBMkQ7SUFDM0QscUJBQ1csS0FBWTtRQUFaLFVBQUssR0FB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O1dBQ3hFO1dBQ0EsK0NBQStDLGNBQWM7V0FDN0QsRTs7Ozs7Ozs7Ozs7Ozs7QUNOMkI7QUFDWDs7QUFFaEI7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBLHNCQUFzQiwrQ0FBSzs7QUFFM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEOztBQUVBOztBQUVBIiwiZmlsZSI6InNjcmlwdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsImV4cG9ydCBjb25zdCBWRVJURVhfVEVNUExBVEUgPVxuYFxuYXR0cmlidXRlIHZlYzIgYV9wb3NpdGlvbjtcbmF0dHJpYnV0ZSBmbG9hdCBhX2NvbG9yO1xuYXR0cmlidXRlIGZsb2F0IGFfc2l6ZTtcbmF0dHJpYnV0ZSBmbG9hdCBhX3NoYXBlO1xudW5pZm9ybSBtYXQzIHVfbWF0cml4O1xudmFyeWluZyB2ZWMzIHZfY29sb3I7XG52YXJ5aW5nIGZsb2F0IHZfc2hhcGU7XG52b2lkIG1haW4oKSB7XG4gIGdsX1Bvc2l0aW9uID0gdmVjNCgodV9tYXRyaXggKiB2ZWMzKGFfcG9zaXRpb24sIDEpKS54eSwgMC4wLCAxLjApO1xuICBnbF9Qb2ludFNpemUgPSBhX3NpemU7XG4gIHZfc2hhcGUgPSBhX3NoYXBlO1xuICB7Q09MT1ItU0VMRUNUSU9OfVxufVxuYFxuXG5leHBvcnQgY29uc3QgRlJBR01FTlRfVEVNUExBVEUgPVxuYFxucHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xudmFyeWluZyB2ZWMzIHZfY29sb3I7XG52YXJ5aW5nIGZsb2F0IHZfc2hhcGU7XG57U0hBUEVTLUZVTkNUSU9OU31cbnZvaWQgbWFpbigpIHtcbiAge1NIQVBFLVNFTEVDVElPTn1cbiAgZ2xfRnJhZ0NvbG9yID0gdmVjNCh2X2NvbG9yLnJnYiwgMS4wKTtcbn1cbmBcblxuZXhwb3J0IGNvbnN0IFNIQVBFUzogc3RyaW5nW10gPSBbXVxuXG5TSEFQRVNbMF0gPSAgLy8g0JrQstCw0LTRgNCw0YJcbmBcbmBcblxuU0hBUEVTWzFdID0gIC8vINCa0YDRg9CzXG5gXG5pZiAobGVuZ3RoKGdsX1BvaW50Q29vcmQgLSAwLjUpID4gMC41KSBkaXNjYXJkO1xuYFxuXG5TSEFQRVNbMl0gPSAgLy8g0JrRgNC10YHRglxuYFxuaWYgKChhbGwobGVzc1RoYW4oZ2xfUG9pbnRDb29yZCwgdmVjMigwLjMpKSkpIHx8XG4gICgoZ2xfUG9pbnRDb29yZC54ID4gMC43KSAmJiAoZ2xfUG9pbnRDb29yZC55IDwgMC4zKSkgfHxcbiAgKGFsbChncmVhdGVyVGhhbihnbF9Qb2ludENvb3JkLCB2ZWMyKDAuNykpKSkgfHxcbiAgKChnbF9Qb2ludENvb3JkLnggPCAwLjMpICYmIChnbF9Qb2ludENvb3JkLnkgPiAwLjcpKVxuICApIGRpc2NhcmQ7XG5gXG5cblNIQVBFU1szXSA9ICAvLyDQotGA0LXRg9Cz0L7Qu9GM0L3QuNC6XG5gXG52ZWMyIHBvcyA9IHZlYzIoZ2xfUG9pbnRDb29yZC54LCBnbF9Qb2ludENvb3JkLnkgLSAwLjEpIC0gMC41O1xuZmxvYXQgYSA9IGF0YW4ocG9zLngsIHBvcy55KSArIDIuMDk0Mzk1MTAyMzk7XG5pZiAoc3RlcCgwLjI4NSwgY29zKGZsb29yKDAuNSArIGEgLyAyLjA5NDM5NTEwMjM5KSAqIDIuMDk0Mzk1MTAyMzkgLSBhKSAqIGxlbmd0aChwb3MpKSA+IDAuOSkgZGlzY2FyZDtcbmBcblxuU0hBUEVTWzRdID0gIC8vINCo0LXRgdGC0LXRgNC10L3QutCwXG5gXG52ZWMyIHBvcyA9IHZlYzIoMC41KSAtIGdsX1BvaW50Q29vcmQ7XG5mbG9hdCByID0gbGVuZ3RoKHBvcykgKiAxLjYyO1xuZmxvYXQgYSA9IGF0YW4ocG9zLnksIHBvcy54KTtcbmZsb2F0IGYgPSBjb3MoYSAqIDMuMCk7XG5mID0gc3RlcCgwLjAsIGNvcyhhICogMTAuMCkpICogMC4yICsgMC41O1xuaWYgKCBzdGVwKGYsIHIpID4gMC41ICkgZGlzY2FyZDtcbmBcbiIsImltcG9ydCBTUGxvdCBmcm9tICdAL3NwbG90J1xuXG4vKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICpcbiAqINCa0LvQsNGB0YEt0YXQtdC70L/QtdGALCDRgNC10LDQu9C40LfRg9GO0YnQuNC5INC+0LHRgNCw0LHQvtGC0LrRgyDRgdGA0LXQtNGB0YLQsiDQstCy0L7QtNCwICjQvNGL0YjQuCwg0YLRgNC10LrQv9Cw0LTQsCDQuCDRgi7Qvy4pINC4INC80LDRgtC10LzQsNGC0LjRh9C10YHQutC40LUg0YDQsNGB0YfQtdGC0Ysg0YLQtdGF0L3QuNGH0LXRgdC60LjRhSDQtNCw0L3QvdGL0YUsXG4gKiDRgdC+0L7RgtCy0LXRgtGB0LLRg9GO0YnQuNGFINGC0YDQsNC90YHRhNC+0YDQvNCw0YbQuNGP0Lwg0LPRgNCw0YTQuNC60LAg0LTQu9GPINC60LvQsNGB0YHQsCBTcGxvdC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU1Bsb3RDb250b2wgaW1wbGVtZW50cyBTUGxvdEhlbHBlciB7XG5cbiAgLyoqINCi0LXRhdC90LjRh9C10YHQutCw0Y8g0LjQvdGE0L7RgNC80LDRhtC40Y8sINC40YHQv9C+0LvRjNC30YPQtdC80LDRjyDQv9GA0LjQu9C+0LbQtdC90LjQtdC8INC00LvRjyDRgNCw0YHRh9C10YLQsCDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuS4gKi9cbiAgcHVibGljIHRyYW5zZm9ybTogU1Bsb3RUcmFuc2Zvcm0gPSB7XG4gICAgdmlld1Byb2plY3Rpb25NYXQ6IFtdLFxuICAgIHN0YXJ0SW52Vmlld1Byb2pNYXQ6IFtdLFxuICAgIHN0YXJ0Q2FtZXJhOiB7fSxcbiAgICBzdGFydFBvczogW10sXG4gIH1cblxuICAvKiog0J/RgNC40LfQvdCw0Log0YLQvtCz0L4sINGH0YLQviDRhdC10LvQv9C10YAg0YPQttC1INC90LDRgdGC0YDQvtC10L0uICovXG4gIHB1YmxpYyBpc1NldHVwZWQ6IGJvb2xlYW4gPSBmYWxzZVxuXG4gIC8qKiDQntCx0YDQsNCx0L7RgtGH0LjQutC4INGB0L7QsdGL0YLQuNC5INGBINC30LDQutGA0LXQv9C70LXQvdC90YvQvNC4INC60L7QvdGC0LXQutGB0YLQsNC80LguICovXG4gIHByb3RlY3RlZCBoYW5kbGVNb3VzZURvd25XaXRoQ29udGV4dDogRXZlbnRMaXN0ZW5lciA9IHRoaXMuaGFuZGxlTW91c2VEb3duLmJpbmQodGhpcykgYXMgRXZlbnRMaXN0ZW5lclxuICBwcm90ZWN0ZWQgaGFuZGxlTW91c2VXaGVlbFdpdGhDb250ZXh0OiBFdmVudExpc3RlbmVyID0gdGhpcy5oYW5kbGVNb3VzZVdoZWVsLmJpbmQodGhpcykgYXMgRXZlbnRMaXN0ZW5lclxuICBwcm90ZWN0ZWQgaGFuZGxlTW91c2VNb3ZlV2l0aENvbnRleHQ6IEV2ZW50TGlzdGVuZXIgPSB0aGlzLmhhbmRsZU1vdXNlTW92ZS5iaW5kKHRoaXMpIGFzIEV2ZW50TGlzdGVuZXJcbiAgcHJvdGVjdGVkIGhhbmRsZU1vdXNlVXBXaXRoQ29udGV4dDogRXZlbnRMaXN0ZW5lciA9IHRoaXMuaGFuZGxlTW91c2VVcC5iaW5kKHRoaXMpIGFzIEV2ZW50TGlzdGVuZXJcblxuICAvKiog0KXQtdC70L/QtdGAINCx0YPQtNC10YIg0LjQvNC10YLRjCDQv9C+0LvQvdGL0Lkg0LTQvtGB0YLRg9C/INC6INGN0LrQt9C10LzQv9C70Y/RgNGDIFNQbG90LiAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICByZWFkb25seSBzcGxvdDogU1Bsb3RcbiAgKSB7IH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQn9C+0LTQs9C+0YLQsNCy0LvQuNCy0LDQtdGCINGF0LXQu9C/0LXRgCDQuiDQuNGB0L/QvtC70YzQt9C+0LLQsNC90LjRji5cbiAgICovXG4gIHNldHVwKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5pc1NldHVwZWQpIHtcbiAgICAgIHRoaXMuaXNTZXR1cGVkID0gdHJ1ZVxuICAgIH1cbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCX0LDQv9GD0YHQutCw0LXRgiDQv9GA0L7RgdC70YPRiNC60YMg0YHQvtCx0YvRgtC40Lkg0LzRi9GI0LguXG4gICAqL1xuICBwdWJsaWMgcnVuKCk6IHZvaWQge1xuICAgIHRoaXMuc3Bsb3QuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMuaGFuZGxlTW91c2VEb3duV2l0aENvbnRleHQpXG4gICAgdGhpcy5zcGxvdC5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignd2hlZWwnLCB0aGlzLmhhbmRsZU1vdXNlV2hlZWxXaXRoQ29udGV4dClcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCe0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdGCINC/0YDQvtGB0LvRg9GI0LrRgyDRgdC+0LHRi9GC0LjQuSDQvNGL0YjQuC5cbiAgICovXG4gIHB1YmxpYyBzdG9wKCk6IHZvaWQge1xuICAgIHRoaXMuc3Bsb3QuY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMuaGFuZGxlTW91c2VEb3duV2l0aENvbnRleHQpXG4gICAgdGhpcy5zcGxvdC5jYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcignd2hlZWwnLCB0aGlzLmhhbmRsZU1vdXNlV2hlZWxXaXRoQ29udGV4dClcbiAgICB0aGlzLnNwbG90LmNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLmhhbmRsZU1vdXNlTW92ZVdpdGhDb250ZXh0KVxuICAgIHRoaXMuc3Bsb3QuY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLmhhbmRsZU1vdXNlVXBXaXRoQ29udGV4dClcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCe0LHQvdC+0LLQu9GP0LXRgiDQvNCw0YLRgNC40YbRgyDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuC5cbiAgICovXG4gIHB1YmxpYyB1cGRhdGVWaWV3UHJvamVjdGlvbigpOiB2b2lkIHtcblxuICAgIGNvbnN0IGNhbnZhcyA9IHRoaXMuc3Bsb3QuY2FudmFzXG4gICAgY29uc3QgY2FtZXJhID0gdGhpcy5zcGxvdC5jYW1lcmFcblxuICAgIGNvbnN0IGQwID0gY2FtZXJhLnpvb20hXG4gICAgY29uc3QgZDEgPSAyIC8gY2FudmFzLndpZHRoICogZDBcbiAgICBjb25zdCBkMiA9IDIgLyBjYW52YXMuaGVpZ2h0ICogZDBcblxuICAgIHRoaXMudHJhbnNmb3JtLnZpZXdQcm9qZWN0aW9uTWF0ID0gWyBkMSwgMCwgMCwgMCwgLWQyLCAwLCAtZDEgKiBjYW1lcmEueCEgLSAxLCBkMiAqIGNhbWVyYS55ISwgMSBdXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQn9GA0LXQvtCx0YDQsNC30YPQtdGCINC60L7QvtGA0LTQuNC90LDRgtGLINC80YvRiNC4INCyIEdMLdC60L7QvtGA0LTQuNC90LDRgtGLLlxuICAgKi9cbiAgcHJvdGVjdGVkIGdldENsaXBTcGFjZU1vdXNlUG9zaXRpb24oZXZlbnQ6IE1vdXNlRXZlbnQpOiBudW1iZXJbXSB7XG5cbiAgICBjb25zdCBjYW52YXMgPSB0aGlzLnNwbG90LmNhbnZhc1xuXG4gICAgY29uc3QgcmVjdCA9IGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuXG4gICAgY29uc3QgY2xpcFggPSAgMiAqICgoZXZlbnQuY2xpZW50WCAtIHJlY3QubGVmdCkgLyBjYW52YXMuY2xpZW50V2lkdGgpIC0gMVxuICAgIGNvbnN0IGNsaXBZID0gLTIgKiAoKGV2ZW50LmNsaWVudFkgLSByZWN0LnRvcCkgLyBjYW52YXMuY2xpZW50SGVpZ2h0KSArIDFcblxuICAgIHJldHVybiBbY2xpcFgsIGNsaXBZXVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0KDQtdCw0LPQuNGA0YPQtdGCINC90LAg0LTQstC40LbQtdC90LjQtSDQvNGL0YjQuCDQsiDQvNC+0LzQtdC90YIsINC60L7Qs9C00LAg0LXQtSDQutC70LDQstC40YjQsCDRg9C00LXRgNC20LjQstCw0LXRgtGB0Y8g0L3QsNC20LDRgtC+0LkuINCc0LXRgtC+0LQg0L/QtdGA0LXQvNC10YnQsNC10YIg0L7QsdC70LDRgdGC0Ywg0LLQuNC00LjQvNC+0YHRgtC4INC90LBcbiAgICog0L/Qu9C+0YHQutC+0YHRgtC4INCy0LzQtdGB0YLQtSDRgSDQtNCy0LjQttC10L3QuNC10Lwg0LzRi9GI0LguXG4gICAqL1xuICBwcm90ZWN0ZWQgaGFuZGxlTW91c2VNb3ZlKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG5cbiAgICBjb25zdCBzcGxvdCA9IHRoaXMuc3Bsb3RcbiAgICBjb25zdCB0cmFuc2Zvcm0gPSB0aGlzLnRyYW5zZm9ybVxuICAgIGNvbnN0IG1hdHJpeCA9IHRyYW5zZm9ybS5zdGFydEludlZpZXdQcm9qTWF0XG4gICAgY29uc3QgW2NsaXBYLCBjbGlwWV0gPSB0aGlzLmdldENsaXBTcGFjZU1vdXNlUG9zaXRpb24oZXZlbnQpXG5cbiAgICBzcGxvdC5jYW1lcmEueCA9IHRyYW5zZm9ybS5zdGFydENhbWVyYS54ISArIHRyYW5zZm9ybS5zdGFydFBvc1swXSAtIGNsaXBYICogbWF0cml4WzBdIC0gbWF0cml4WzZdXG4gICAgc3Bsb3QuY2FtZXJhLnkgPSB0cmFuc2Zvcm0uc3RhcnRDYW1lcmEueSEgKyB0cmFuc2Zvcm0uc3RhcnRQb3NbMV0gLSBjbGlwWSAqIG1hdHJpeFs0XSAtIG1hdHJpeFs3XVxuXG4gICAgc3Bsb3QucmVuZGVyKClcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCg0LXQsNCz0LjRgNGD0LXRgiDQvdCwINC+0YLQttCw0YLQuNC1INC60LvQsNCy0LjRiNC4INC80YvRiNC4LiDQkiDQvNC+0LzQtdC90YIg0L7RgtC20LDRgtC40Y8g0LrQu9Cw0LLQuNGI0Lgg0LDQvdCw0LvQuNC3INC00LLQuNC20LXQvdC40Y8g0LzRi9GI0Lgg0YEg0LfQsNC20LDRgtC+0Lkg0LrQu9Cw0LLQuNGI0LXQuSDQv9GA0LXQutGA0LDRidCw0LXRgtGB0Y8uXG4gICAqL1xuICBwcm90ZWN0ZWQgaGFuZGxlTW91c2VVcChldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuXG4gICAgdGhpcy5zcGxvdC5yZW5kZXIoKVxuXG4gICAgZXZlbnQudGFyZ2V0IS5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLmhhbmRsZU1vdXNlTW92ZVdpdGhDb250ZXh0KVxuICAgIGV2ZW50LnRhcmdldCEucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuaGFuZGxlTW91c2VVcFdpdGhDb250ZXh0KVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0KDQtdCw0LPQuNGA0YPQtdGCINC90LAg0L3QsNC20LDRgtC40LUg0LrQu9Cw0LLQuNGI0Lgg0LzRi9GI0LguINCSINC80L7QvNC10L3RgiDQvdCw0LbQsNGC0LjRjyDQuCDRg9C00LXRgNC20LDQvdC40Y8g0LrQu9Cw0LLQuNGI0Lgg0LfQsNC/0YPRgdC60LDQtdGC0YHRjyDQsNC90LDQu9C40Lcg0LTQstC40LbQtdC90LjRjyDQvNGL0YjQuCAo0YEg0LfQsNC20LDRgtC+0LlcbiAgICog0LrQu9Cw0LLQuNGI0LXQuSkuXG4gICAqL1xuICBwcm90ZWN0ZWQgaGFuZGxlTW91c2VEb3duKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG5cbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgICBjb25zdCBzcGxvdCA9IHRoaXMuc3Bsb3RcbiAgICBjb25zdCB0cmFuc2Zvcm0gPSB0aGlzLnRyYW5zZm9ybVxuXG4gICAgc3Bsb3QuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMuaGFuZGxlTW91c2VNb3ZlV2l0aENvbnRleHQpXG4gICAgc3Bsb3QuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLmhhbmRsZU1vdXNlVXBXaXRoQ29udGV4dClcblxuICAgIGxldCBtYXRyaXggPSB0cmFuc2Zvcm0udmlld1Byb2plY3Rpb25NYXRcbiAgICB0cmFuc2Zvcm0uc3RhcnRJbnZWaWV3UHJvak1hdCA9IFsxIC8gbWF0cml4WzBdLCAwLCAwLCAwLCAxIC8gbWF0cml4WzRdLCAwLCAtbWF0cml4WzZdIC8gbWF0cml4WzBdLCAtbWF0cml4WzddIC8gbWF0cml4WzRdLCAxXVxuXG4gICAgdHJhbnNmb3JtLnN0YXJ0Q2FtZXJhID0geyB4OiBzcGxvdC5jYW1lcmEueCwgeTogc3Bsb3QuY2FtZXJhLnksIHpvb206IHNwbG90LmNhbWVyYS56b29tIH1cblxuICAgIGNvbnN0IFtjbGlwWCwgY2xpcFldID0gdGhpcy5nZXRDbGlwU3BhY2VNb3VzZVBvc2l0aW9uKGV2ZW50KVxuICAgIG1hdHJpeCA9IHRyYW5zZm9ybS5zdGFydEludlZpZXdQcm9qTWF0XG4gICAgdHJhbnNmb3JtLnN0YXJ0UG9zWzBdID0gY2xpcFggKiBtYXRyaXhbMF0gKyBtYXRyaXhbNl1cbiAgICB0cmFuc2Zvcm0uc3RhcnRQb3NbMV0gPSBjbGlwWSAqIG1hdHJpeFs0XSArIG1hdHJpeFs3XVxuXG4gICAgc3Bsb3QucmVuZGVyKClcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCg0LXQsNCz0LjRgNGD0LXRgiDQvdCwINC30YPQvNC40YDQvtCy0LDQvdC40LUg0LzRi9GI0LguINCSINC80L7QvNC10L3RgiDQt9GD0LzQuNGA0L7QstCw0L3QuNGPINC80YvRiNC4INC/0YDQvtC40YHRhdC+0LTQuNGCINC30YPQvNC40YDQvtCy0LDQvdC40LUg0LrQvtC+0YDQtNC40L3QsNGC0L3QvtC5INC/0LvQvtGB0LrQvtGB0YLQuC5cbiAgICovXG4gIHByb3RlY3RlZCBoYW5kbGVNb3VzZVdoZWVsKGV2ZW50OiBXaGVlbEV2ZW50KTogdm9pZCB7XG5cbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgICBjb25zdCBjYW1lcmEgPSB0aGlzLnNwbG90LmNhbWVyYVxuXG4gICAgLyoqINCS0YvRh9C40YHQu9C10L3QuNC1INC/0L7Qt9C40YbQuNC4INC80YvRiNC4INCyIEdMLdC60L7QvtGA0LTQuNC90LDRgtCw0YUuICovXG4gICAgY29uc3QgW2NsaXBYLCBjbGlwWV0gPSB0aGlzLmdldENsaXBTcGFjZU1vdXNlUG9zaXRpb24oZXZlbnQpXG5cbiAgICAvKiog0J/QvtC30LjRhtC40Y8g0LzRi9GI0Lgg0LTQviDQt9GD0LzQuNGA0L7QstCw0L3QuNGPLiAqL1xuICAgIGxldCBtYXRyaXggPSB0aGlzLnRyYW5zZm9ybS52aWV3UHJvamVjdGlvbk1hdFxuICAgIGNvbnN0IHByZVpvb21YID0gKGNsaXBYIC0gbWF0cml4WzZdKSAvIG1hdHJpeFswXVxuICAgIGNvbnN0IHByZVpvb21ZID0gKGNsaXBZICAtIG1hdHJpeFs3XSkgLyBtYXRyaXhbNF1cblxuICAgIC8qKiDQndC+0LLQvtC1INC30L3QsNGH0LXQvdC40LUg0LfRg9C80LAg0L7QsdC70LDRgdGC0Lgg0L/RgNC+0YHQvNC+0YLRgNCwINGN0LrRgdC/0L7QvdC10L3RhtC40LDQu9GM0L3QviDQt9Cw0LLQuNGB0LjRgiDQvtGCINCy0LXQu9C40YfQuNC90Ysg0LfRg9C80LjRgNC+0LLQsNC90LjRjyDQvNGL0YjQuC4gKi9cbiAgICBjb25zdCBuZXdab29tID0gY2FtZXJhLnpvb20hICogTWF0aC5wb3coMiwgZXZlbnQuZGVsdGFZICogLTAuMDEpXG5cbiAgICAvKiog0JzQsNC60YHQuNC80LDQu9GM0L3QvtC1INC4INC80LjQvdC40LzQsNC70YzQvdC+0LUg0LfQvdCw0YfQtdC90LjRjyDQt9GD0LzQsCDQvtCx0LvQsNGB0YLQuCDQv9GA0L7RgdC80L7RgtGA0LAuICovXG4gICAgY2FtZXJhLnpvb20gPSBNYXRoLm1heChjYW1lcmEubWluWm9vbSEsIE1hdGgubWluKGNhbWVyYS5tYXhab29tISwgbmV3Wm9vbSkpXG5cbiAgICAvKiog0J7QsdC90L7QstC70LXQvdC40LUg0LzQsNGC0YDQuNGG0Ysg0YLRgNCw0L3RgdGE0L7RgNC80LDRhtC40LguICovXG4gICAgdGhpcy51cGRhdGVWaWV3UHJvamVjdGlvbigpXG5cbiAgICAvKiog0J/QvtC30LjRhtC40Y8g0LzRi9GI0Lgg0L/QvtGB0LvQtSDQt9GD0LzQuNGA0L7QstCw0L3QuNGPLiAqL1xuICAgIG1hdHJpeCA9IHRoaXMudHJhbnNmb3JtLnZpZXdQcm9qZWN0aW9uTWF0XG4gICAgY29uc3QgcG9zdFpvb21YID0gKGNsaXBYIC0gbWF0cml4WzZdKSAvIG1hdHJpeFswXVxuICAgIGNvbnN0IHBvc3Rab29tWSA9IChjbGlwWSAtIG1hdHJpeFs3XSkgLyBtYXRyaXhbNF1cblxuICAgIC8qKiDQktGL0YfQuNGB0LvQtdC90LjQtSDQvdC+0LLQvtCz0L4g0L/QvtC70L7QttC10L3QuNGPINC+0LHQu9Cw0YHRgtC4INC/0YDQvtGB0LzQvtGC0YDQsCDQv9C+0YHQu9C1INC30YPQvNC40YDQvtCy0LDQvdC40Y8uICovXG4gICAgY2FtZXJhLnghICs9IHByZVpvb21YIC0gcG9zdFpvb21YXG4gICAgY2FtZXJhLnkhICs9IHByZVpvb21ZIC0gcG9zdFpvb21ZXG5cbiAgICB0aGlzLnNwbG90LnJlbmRlcigpXG4gIH1cbn1cbiIsImltcG9ydCBTUGxvdCBmcm9tICdAL3NwbG90J1xuaW1wb3J0IHsgZ2V0Q3VycmVudFRpbWUgfSBmcm9tICdAL3V0aWxzJ1xuXG4vKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICpcbiAqINCa0LvQsNGB0YEt0YXQtdC70L/QtdGALCDRgNC10LDQu9C40LfRg9GO0YnQuNC5INC/0L7QtNC00LXRgNC20LrRgyDRgNC10LbQuNC80LAg0L7RgtC70LDQtNC60Lgg0LTQu9GPINC60LvQsNGB0YHQsCBTUGxvdC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU1Bsb3REZWJ1ZyBpbXBsZW1lbnRzIFNQbG90SGVscGVyIHtcblxuICAvKiog0J/RgNC40LfQvdCw0Log0LDQutGC0LjQstCw0YbQuNC4INGA0LXQttC40Lwg0L7RgtC70LDQtNC60LguICovXG4gIHB1YmxpYyBpc0VuYWJsZTogYm9vbGVhbiA9IGZhbHNlXG5cbiAgLyoqINCh0YLQuNC70Ywg0LfQsNCz0L7Qu9C+0LLQutCwINGA0LXQttC40LzQsCDQvtGC0LvQsNC00LrQuC4gKi9cbiAgcHVibGljIGhlYWRlclN0eWxlOiBzdHJpbmcgPSAnZm9udC13ZWlnaHQ6IGJvbGQ7IGNvbG9yOiAjZmZmZmZmOyBiYWNrZ3JvdW5kLWNvbG9yOiAjY2MwMDAwOydcblxuICAvKiog0KHRgtC40LvRjCDQt9Cw0LPQvtC70L7QstC60LAg0LPRgNGD0L/Qv9GLINC/0LDRgNCw0LzQtdGC0YDQvtCyLiAqL1xuICBwdWJsaWMgZ3JvdXBTdHlsZTogc3RyaW5nID0gJ2ZvbnQtd2VpZ2h0OiBib2xkOyBjb2xvcjogI2ZmZmZmZjsnXG5cbiAgLyoqINCf0YDQuNC30L3QsNC6INGC0L7Qs9C+LCDRh9GC0L4g0YXQtdC70L/QtdGAINGD0LbQtSDQvdCw0YHRgtGA0L7QtdC9LiAqL1xuICBwdWJsaWMgaXNTZXR1cGVkOiBib29sZWFuID0gZmFsc2VcblxuICAvKiog0KXQtdC70L/QtdGAINCx0YPQtNC10YIg0LjQvNC10YLRjCDQv9C+0LvQvdGL0Lkg0LTQvtGB0YLRg9C/INC6INGN0LrQt9C10LzQv9C70Y/RgNGDIFNQbG90LiAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICByZWFkb25seSBzcGxvdDogU1Bsb3RcbiAgKSB7fVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCf0L7QtNCz0L7RgtCw0LLQu9C40LLQsNC10YIg0YXQtdC70L/QtdGAINC6INC40YHQv9C+0LvRjNC30L7QstCw0L3QuNGOLlxuICAgKlxuICAgKiBAcGFyYW0gY2xlYXJDb25zb2xlIC0g0J/RgNC40LfQvdCw0Log0L3QtdC+0LHRhdC+0LTQuNC80L7RgdGC0Lgg0L7Rh9C40YHRgtC60Lgg0LrQvtC90YHQvtC70Lgg0LHRgNCw0YPQt9C10YDQsCDQv9C10YDQtdC0INC90LDRh9Cw0LvQvtC8INGA0LXQvdC00LXRgNCwLlxuICAgKi9cbiAgcHVibGljIHNldHVwKGNsZWFyQ29uc29sZTogYm9vbGVhbiA9IGZhbHNlKTogdm9pZCB7XG5cbiAgICBpZiAoIXRoaXMuaXNTZXR1cGVkKSB7XG5cbiAgICAgIGlmIChjbGVhckNvbnNvbGUpIHtcbiAgICAgICAgY29uc29sZS5jbGVhcigpXG4gICAgICB9XG5cbiAgICAgIHRoaXMuaXNTZXR1cGVkID0gdHJ1ZVxuICAgIH1cbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCS0YvQstC+0LTQuNGCINCyINC60L7QvdGB0L7Qu9GMINC+0YLQu9Cw0LTQvtGH0L3Rg9GOINC40L3RhNC+0YDQvNCw0YbQuNGOLCDQtdGB0LvQuCDQstC60LvRjtGH0LXQvSDRgNC10LbQuNC8INC+0YLQu9Cw0LTQutC4LlxuICAgKlxuICAgKiBAcmVtYXJrc1xuICAgKiDQntGC0LvQsNC00L7Rh9C90LDRjyDQuNC90YTQvtGA0LzQsNGG0LjRjyDQstGL0LLQvtC00LjRgtGB0Y8g0LHQu9C+0LrQsNC80LguINCd0LDQt9Cy0LDQvdC40Y8g0LHQu9C+0LrQvtCyINC/0LXRgNC10LTQsNGO0YLRgdGPINCyINC80LXRgtC+0LQg0L/QtdGA0LXRh9C40YHQu9C10L3QuNC10Lwg0YHRgtGA0L7Qui4g0JrQsNC20LTQsNGPINGB0YLRgNC+0LrQsFxuICAgKiDQuNC90YLQtdGA0L/RgNC10YLQuNGA0YPQtdGC0YHRjyDQutCw0Log0LjQvNGPINC80LXRgtC+0LTQsC4g0JXRgdC70Lgg0L3Rg9C20L3Ri9C1INC80LXRgtC+0LTRiyDQstGL0LLQvtC00LAg0LHQu9C+0LrQsCDRgdGD0YnQtdGB0YLQstGD0Y7RgiAtINC+0L3QuCDQstGL0LfRi9Cy0LDRjtGC0YHRjy4g0JXRgdC70Lgg0LzQtdGC0L7QtNCwINGBINC90YPQttC90YvQvFxuICAgKiDQvdCw0LfQstCw0L3QuNC10Lwg0L3QtSDRgdGD0YnQtdGB0YLQstGD0LXRgiAtINCz0LXQvdC10YDQuNGA0YPQtdGC0YHRjyDQvtGI0LjQsdC60LAuXG4gICAqXG4gICAqIEBwYXJhbSBsb2dJdGVtcyAtINCf0LXRgNC10YfQuNGB0LvQtdC90LjQtSDRgdGC0YDQvtC6INGBINC90LDQt9Cy0LDQvdC40Y/QvNC4INC+0YLQu9Cw0LTQvtGH0L3Ri9GFINCx0LvQvtC60L7Qsiwg0LrQvtGC0L7RgNGL0LUg0L3Rg9C20L3QviDQvtGC0L7QsdGA0LDQt9C40YLRjCDQsiDQutC+0L3RgdC+0LvQuC5cbiAgICovXG4gIHB1YmxpYyBsb2coLi4ubG9nSXRlbXM6IHN0cmluZ1tdKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuaXNFbmFibGUpIHtcbiAgICAgIGxvZ0l0ZW1zLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgIGlmICh0eXBlb2YgKHRoaXMgYXMgYW55KVtpdGVtXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICh0aGlzIGFzIGFueSlbaXRlbV0oKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcign0J7RgtC70LDQtNC+0YfQvdC+0LPQviDQsdC70L7QutCwICcgKyBpdGVtICsgJ1wiINC90LUg0YHRg9GJ0LXRgdGC0LLRg9C10YIhJylcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQktGL0LLQvtC00LjRgiDRgdC+0L7QsdGJ0LXQvdC40LUg0L7QsSDQvtGI0LjQsdC60LUuXG4gICAqL1xuICBwdWJsaWMgZXJyb3IobWVzc2FnZTogc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuaXNFbmFibGUpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IobWVzc2FnZSlcbiAgICB9XG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQktGL0LLQvtC00LjRgiDQstGB0YLRg9C/0LjRgtC10LvRjNC90YPRjiDRh9Cw0YHRgtGMINC+INGA0LXQttC40LzQtSDQvtGC0LvQsNC00LrQuC5cbiAgICovXG4gIHB1YmxpYyBpbnRybygpOiB2b2lkIHtcbiAgICBjb25zb2xlLmxvZygnJWPQntGC0LvQsNC00LrQsCBTUGxvdCDQvdCwINC+0LHRitC10LrRgtC1ICMnICsgdGhpcy5zcGxvdC5jYW52YXMuaWQsIHRoaXMuaGVhZGVyU3R5bGUpXG5cbiAgICBpZiAodGhpcy5zcGxvdC5kZW1vLmlzRW5hYmxlKSB7XG4gICAgICBjb25zb2xlLmxvZygnJWPQktC60LvRjtGH0LXQvSDQtNC10LzQvtC90YHRgtGA0LDRhtC40L7QvdC90YvQuSDRgNC10LbQuNC8INC00LDQvdC90YvRhScsIHRoaXMuZ3JvdXBTdHlsZSlcbiAgICB9XG5cbiAgICBjb25zb2xlLmdyb3VwKCclY9Cf0YDQtdC00YPQv9GA0LXQttC00LXQvdC40LUnLCB0aGlzLmdyb3VwU3R5bGUpXG4gICAgY29uc29sZS5sb2coJ9Ce0YLQutGA0YvRgtCw0Y8g0LrQvtC90YHQvtC70Ywg0LHRgNCw0YPQt9C10YDQsCDQuCDQtNGA0YPQs9C40LUg0LDQutGC0LjQstC90YvQtSDRgdGA0LXQtNGB0YLQstCwINC60L7QvdGC0YDQvtC70Y8g0YDQsNC30YDQsNCx0L7RgtC60Lgg0YHRg9GJ0LXRgdGC0LLQtdC90L3QviDRgdC90LjQttCw0Y7RgiDQv9GA0L7QuNC30LLQvtC00LjRgtC10LvRjNC90L7RgdGC0Ywg0LLRi9GB0L7QutC+0L3QsNCz0YDRg9C20LXQvdC90YvRhSDQv9GA0LjQu9C+0LbQtdC90LjQuS4g0JTQu9GPINC+0LHRitC10LrRgtC40LLQvdC+0LPQviDQsNC90LDQu9C40LfQsCDQv9GA0L7QuNC30LLQvtC00LjRgtC10LvRjNC90L7RgdGC0Lgg0LLRgdC1INC/0L7QtNC+0LHQvdGL0LUg0YHRgNC10LTRgdGC0LLQsCDQtNC+0LvQttC90Ysg0LHRi9GC0Ywg0L7RgtC60LvRjtGH0LXQvdGLLCDQsCDQutC+0L3RgdC+0LvRjCDQsdGAetCw0YPQt9C10YDQsCDQt9Cw0LrRgNGL0YLQsC4g0J3QtdC60L7RgtC+0YDRi9C1INC00LDQvdC90YvQtSDQvtGC0LvQsNC00L7Rh9C90L7QuSDQuNC90YTQvtGA0LzQsNGG0LjQuCDQsiDQt9Cw0LLQuNGB0LjQvNC+0YHRgtC4INC+0YIg0LjRgdC/0L7Qu9GM0LfRg9C10LzQvtCz0L4g0LHRgNCw0YPQt9C10YDQsCDQvNC+0LPRg9GCINC90LUg0L7RgtC+0LHRgNCw0LbQsNGC0YzRgdGPINC40LvQuCDQvtGC0L7QsdGA0LDQttCw0YLRjNGB0Y8g0L3QtdC60L7RgNGA0LXQutGC0L3Qvi4g0KHRgNC10LTRgdGC0LLQviDQvtGC0LvQsNC00LrQuCDQv9GA0L7RgtC10YHRgtC40YDQvtCy0LDQvdC+INCyINCx0YDQsNGD0LfQtdGA0LUgR29vZ2xlIENocm9tZSB2LjkwJylcbiAgICBjb25zb2xlLmdyb3VwRW5kKClcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCS0YvQstC+0LTQuNGCINC40L3RhNC+0YDQvNCw0YbQuNGOINC+INCz0YDQsNGE0LjRh9C10YHQutC+0Lkg0YHQuNGB0YLQtdC80LUg0LrQu9C40LXQvdGC0LAuXG4gICAqL1xuICBwdWJsaWMgZ3B1KCk6IHZvaWQge1xuICAgIGNvbnNvbGUuZ3JvdXAoJyVj0JLQuNC00LXQvtGB0LjRgdGC0LXQvNCwJywgdGhpcy5ncm91cFN0eWxlKVxuICAgIGNvbnNvbGUubG9nKCfQk9GA0LDRhNC40YfQtdGB0LrQsNGPINC60LDRgNGC0LA6ICcgKyB0aGlzLnNwbG90LndlYmdsLmdwdS5oYXJkd2FyZSlcbiAgICBjb25zb2xlLmxvZygn0JLQtdGA0YHQuNGPIEdMOiAnICsgdGhpcy5zcGxvdC53ZWJnbC5ncHUuc29mdHdhcmUpXG4gICAgY29uc29sZS5ncm91cEVuZCgpXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQktGL0LLQvtC00LjRgiDQuNC90YTQvtGA0LzQsNGG0LjRjyDQviDRgtC10LrRg9GJ0LXQvCDRjdC60LfQtdC80L/Qu9GP0YDQtSDQutC70LDRgdGB0LAgU1Bsb3QuXG4gICAqL1xuICBwdWJsaWMgaW5zdGFuY2UoKTogdm9pZCB7XG5cbiAgICBjb25zb2xlLmdyb3VwKCclY9Cd0LDRgdGC0YDQvtC50LrQsCDQv9Cw0YDQsNC80LXRgtGA0L7QsiDRjdC60LfQtdC80L/Qu9GP0YDQsCcsIHRoaXMuZ3JvdXBTdHlsZSlcbiAgICBjb25zb2xlLmRpcih0aGlzLnNwbG90KVxuICAgIGNvbnNvbGUubG9nKGDQoNCw0LfQvNC10YAg0LrQsNC90LLQsNGB0LA6ICR7dGhpcy5zcGxvdC5jYW52YXMud2lkdGh9IHggJHt0aGlzLnNwbG90LmNhbnZhcy5oZWlnaHR9IHB4YClcblxuICAgIGlmICh0aGlzLnNwbG90LmRlbW8uaXNFbmFibGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKCfQodC/0L7RgdC+0LEg0L/QvtC70YPRh9C10L3QuNGPINC00LDQvdC90YvRhTogJyArICfQtNC10LzQvi3QtNCw0L3QvdGL0LUnKVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZygn0KHQv9C+0YHQvtCxINC/0L7Qu9GD0YfQtdC90LjRjyDQtNCw0L3QvdGL0YU6ICcgKyAn0LjRgtC10YDQuNGA0L7QstCw0L3QuNC1JylcbiAgICB9XG4gICAgY29uc29sZS5ncm91cEVuZCgpXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQktGL0LLQvtC00LjRgiDQutC+0LTRiyDRiNC10LnQtNC10YDQvtCyLlxuICAgKi9cbiAgcHVibGljIHNoYWRlcnMoKTogdm9pZCB7XG4gICAgY29uc29sZS5ncm91cCgnJWPQodC+0LfQtNCw0L0g0LLQtdGA0YjQuNC90L3Ri9C5INGI0LXQudC00LXRgDogJywgdGhpcy5ncm91cFN0eWxlKVxuICAgIGNvbnNvbGUubG9nKHRoaXMuc3Bsb3QuZ2xzbC52ZXJ0U2hhZGVyU291cmNlKVxuICAgIGNvbnNvbGUuZ3JvdXBFbmQoKVxuICAgIGNvbnNvbGUuZ3JvdXAoJyVj0KHQvtC30LTQsNC9INGE0YDQsNCz0LzQtdC90YLQvdGL0Lkg0YjQtdC50LTQtdGAOiAnLCB0aGlzLmdyb3VwU3R5bGUpXG4gICAgY29uc29sZS5sb2codGhpcy5zcGxvdC5nbHNsLmZyYWdTaGFkZXJTb3VyY2UpXG4gICAgY29uc29sZS5ncm91cEVuZCgpXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQktGL0LLQvtC00LjRgiDRgdC+0L7QsdGJ0LXQvdC40LUg0L4g0L3QsNGH0LDQu9C1INC/0YDQvtGG0LXRgdGB0LUg0LfQsNCz0YDRg9C30LrQuCDQtNCw0L3QvdGL0YUuXG4gICAqL1xuICBwdWJsaWMgbG9hZGluZygpOiB2b2lkIHtcbiAgICBjb25zb2xlLmxvZyhgJWPQl9Cw0L/Rg9GJ0LXQvSDQv9GA0L7RhtC10YHRgSDQt9Cw0LPRgNGD0LfQutC4INC00LDQvdC90YvRhSBbJHtnZXRDdXJyZW50VGltZSgpfV0uLi5gLCB0aGlzLmdyb3VwU3R5bGUpXG4gICAgY29uc29sZS50aW1lKCfQlNC70LjRgtC10LvRjNC90L7RgdGC0YwnKVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JLRi9Cy0L7QtNC40YIg0YHRgtCw0YLQuNGB0YLQuNC60YMg0L/QviDQt9Cw0LLQtdGA0YjQtdC90LjQuCDQv9GA0L7RhtC10YHRgdCwINC30LDQs9GA0YPQt9C60Lgg0LTQsNC90L3Ri9GFLlxuICAgKi9cbiAgcHVibGljIGxvYWRlZCgpOiB2b2lkIHtcbiAgICBjb25zb2xlLmdyb3VwKGAlY9CX0LDQs9GA0YPQt9C60LAg0LTQsNC90L3Ri9GFINC30LDQstC10YDRiNC10L3QsCBbJHtnZXRDdXJyZW50VGltZSgpfV1gLCB0aGlzLmdyb3VwU3R5bGUpXG4gICAgY29uc29sZS50aW1lRW5kKCfQlNC70LjRgtC10LvRjNC90L7RgdGC0YwnKVxuICAgIGNvbnNvbGUubG9nKCfQoNC10LfRg9C70YzRgtCw0YI6ICcgKyAoKHRoaXMuc3Bsb3Quc3RhdHMub2JqVG90YWxDb3VudCA+PSB0aGlzLnNwbG90Lmdsb2JhbExpbWl0KSA/XG4gICAgICAn0LTQvtGB0YLQuNCz0L3Rg9GCINC70LjQvNC40YIg0L7QsdGK0LXQutGC0L7QsiAoJyArIHRoaXMuc3Bsb3QuZ2xvYmFsTGltaXQudG9Mb2NhbGVTdHJpbmcoKSArICcpJyA6XG4gICAgICAn0L7QsdGA0LDQsdC+0YLQsNC90Ysg0LLRgdC1INC+0LHRitC10LrRgtGLJykpXG4gICAgY29uc29sZS5sb2coJ9Cg0LDRgdGF0L7QtCDQstC40LTQtdC+0L/QsNC80Y/RgtC4OiAnICsgKHRoaXMuc3Bsb3Quc3RhdHMubWVtVXNhZ2UgLyAxMDAwMDAwKS50b0ZpeGVkKDIpLnRvTG9jYWxlU3RyaW5nKCkgKyAnINCc0JEnKVxuICAgIGNvbnNvbGUubG9nKCfQmtC+0Lst0LLQviDQvtCx0YrQtdC60YLQvtCyOiAnICsgdGhpcy5zcGxvdC5zdGF0cy5vYmpUb3RhbENvdW50LnRvTG9jYWxlU3RyaW5nKCkpXG4gICAgY29uc29sZS5sb2coJ9Ch0L7Qt9C00LDQvdC+INCy0LjQtNC10L7QsdGD0YTQtdGA0L7QsjogJyArIHRoaXMuc3Bsb3Quc3RhdHMuZ3JvdXBzQ291bnQudG9Mb2NhbGVTdHJpbmcoKSlcbiAgICBjb25zb2xlLmxvZyhg0JPRgNGD0L/Qv9C40YDQvtCy0LrQsCDQstC40LTQtdC+0LHRg9GE0LXRgNC+0LI6ICR7dGhpcy5zcGxvdC5hcmVhLmNvdW50fSB4ICR7dGhpcy5zcGxvdC5hcmVhLmNvdW50fWApXG4gICAgY29uc29sZS5sb2coYNCo0LDQsyDQtNC10LvQtdC90LjRjyDQvdCwINCz0YDRg9C/0L/RizogJHt0aGlzLnNwbG90LmFyZWEuc3RlcH1gKVxuICAgIGNvbnNvbGUubG9nKCfQoNCw0LfQvNC10YDRiyDQvtCx0YrQtdC60YLQvtCyOiBtaW4gPSAnICsgdGhpcy5zcGxvdC5zdGF0cy5taW5PYmplY3RTaXplICsgJzsgbWF4ID0gJyArIHRoaXMuc3Bsb3Quc3RhdHMubWF4T2JqZWN0U2l6ZSlcbiAgICBjb25zb2xlLmdyb3VwRW5kKClcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCS0YvQstC+0LTQuNGCINGB0L7QvtCx0YnQtdC90LjQtSDQviDQt9Cw0L/Rg9GB0LrQtSDRgNC10L3QtNC10YDQsC5cbiAgICovXG4gIHB1YmxpYyBzdGFydGVkKCk6IHZvaWQge1xuICAgIGNvbnNvbGUubG9nKCclY9Cg0LXQvdC00LXRgCDQt9Cw0L/Rg9GJ0LXQvScsIHRoaXMuZ3JvdXBTdHlsZSlcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCS0YvQstC+0LTQuNGCINGB0L7QvtCx0YnQtdC90LjQtSDQvtCxINC+0YHRgtCw0L3QvtCy0LrQtSDRgNC10L3QtNC10YDQsC5cbiAgICovXG4gIHB1YmxpYyBzdG9wZWQoKTogdm9pZCB7XG4gICAgY29uc29sZS5sb2coJyVj0KDQtdC90LTQtdGAINC+0YHRgtCw0L3QvtCy0LvQtdC9JywgdGhpcy5ncm91cFN0eWxlKVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JLRi9Cy0L7QtNC40YIg0YHQvtC+0LHRiNC10L3QuNC1INC+0LEg0L7Rh9C40YHRgtC60LUg0L7QsdC70LDRgdGC0Lgg0YDQtdC90LTQtdGA0LAuXG4gICAqL1xuICBwdWJsaWMgY2xlYXJlZChjb2xvcjogc3RyaW5nKTogdm9pZCB7XG4gICAgY29uc29sZS5sb2coYCVj0J7QsdC70LDRgdGC0Ywg0YDQtdC90LTQtdGA0LAg0L7Rh9C40YnQtdC90LAgWyR7Y29sb3J9XWAsIHRoaXMuZ3JvdXBTdHlsZSk7XG4gIH1cbn1cbiIsImltcG9ydCBTUGxvdCBmcm9tICdAL3NwbG90J1xuaW1wb3J0IHsgcmFuZG9tSW50IH0gZnJvbSAnQC91dGlscydcblxuLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqXG4gKiDQmtC70LDRgdGBLdGF0LXQu9C/0LXRgCwg0YDQtdCw0LvQuNC30YPRjtGJ0LjQuSDQv9C+0LTQtNC10YDQttC60YMg0YDQtdC20LjQvNCwINC00LXQvNC+0L3RgdGC0YDQsNGG0LjQvtC90L3Ri9GFINC00LDQvdC90YvRhSDQtNC70Y8g0LrQu9Cw0YHRgdCwIFNQbG90LlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTUGxvdERlbW8gaW1wbGVtZW50cyBTUGxvdEhlbHBlciB7XG5cbiAgLyoqINCf0YDQuNC30L3QsNC6INCw0LrRgtC40LLQsNGG0LjQuCDQtNC10LzQvi3RgNC10LbQuNC80LAuICovXG4gIHB1YmxpYyBpc0VuYWJsZTogYm9vbGVhbiA9IGZhbHNlXG5cbiAgLyoqINCa0L7Qu9C40YfQtdGB0YLQstC+INCx0YrQtdC60YLQvtCyLiAqL1xuICBwdWJsaWMgYW1vdW50OiBudW1iZXIgPSAxXzAwMF8wMDBcblxuICAvKiog0JzQuNC90LjQvNCw0LvRjNC90YvQuSDRgNCw0LfQvNC10YAg0L7QsdGK0LXQutGC0L7Qsi4gKi9cbiAgcHVibGljIHNpemVNaW46IG51bWJlciA9IDEwXG5cbiAgLyoqINCc0LDQutGB0LjQvNCw0LvRjNC90YvQuSDRgNCw0LfQvNC10YAg0L7QsdGK0LXQutGC0L7Qsi4gKi9cbiAgcHVibGljIHNpemVNYXg6IG51bWJlciA9IDMwXG5cbiAgLyoqINCm0LLQtdGC0L7QstCw0Y8g0L/QsNC70LjRgtGA0LAg0L7QsdGK0LXQutGC0L7Qsi4gKi9cbiAgcHVibGljIGNvbG9yczogc3RyaW5nW10gPSBbXG4gICAgJyNEODFDMDEnLCAnI0U5OTY3QScsICcjQkE1NUQzJywgJyNGRkQ3MDAnLCAnI0ZGRTRCNScsICcjRkY4QzAwJyxcbiAgICAnIzIyOEIyMicsICcjOTBFRTkwJywgJyM0MTY5RTEnLCAnIzAwQkZGRicsICcjOEI0NTEzJywgJyMwMENFRDEnXG4gIF1cblxuICAvKiog0J/RgNC40LfQvdCw0Log0YLQvtCz0L4sINGH0YLQviDRhdC10LvQv9C10YAg0YPQttC1INC90LDRgdGC0YDQvtC10L0uICovXG4gIHB1YmxpYyBpc1NldHVwZWQ6IGJvb2xlYW4gPSBmYWxzZVxuXG4gIC8qKiDQodGH0LXRgtGH0LjQuiDQuNGC0LXRgNC40YDRg9C10LzRi9GFINC+0LHRitC10LrRgtC+0LIuICovXG4gIHByaXZhdGUgaW5kZXg6IG51bWJlciA9IDBcblxuICAvKiog0KXQtdC70L/QtdGAINCx0YPQtNC10YIg0LjQvNC10YLRjCDQv9C+0LvQvdGL0Lkg0LTQvtGB0YLRg9C/INC6INGN0LrQt9C10LzQv9C70Y/RgNGDIFNQbG90LiAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICByZWFkb25seSBzcGxvdDogU1Bsb3RcbiAgKSB7fVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCf0L7QtNCz0L7RgtCw0LLQu9C40LLQsNC10YIg0YXQtdC70L/QtdGAINC6INC40YHQv9C+0LvRjNC30L7QstCw0L3QuNGOLlxuICAgKi9cbiAgcHVibGljIHNldHVwKCk6IHZvaWQge1xuXG4gICAgLyoqINCl0LXQu9C/0LXRgCDQtNC10LzQvi3RgNC10LbQuNC80LAg0LLRi9C/0L7Qu9C90Y/QtdGCINC90LDRgdGC0YDQvtC50LrRgyDQstGB0LXRhSDRgdCy0L7QuNGFINC/0LDRgNCw0LzQtdGC0YDQvtCyINC00LDQttC1INC10YHQu9C4INC+0L3QsCDRg9C20LUg0LLRi9C/0L7Qu9C90Y/Qu9Cw0YHRjC4gKi9cbiAgICBpZiAoIXRoaXMuaXNTZXR1cGVkKSB7XG4gICAgICB0aGlzLmlzU2V0dXBlZCA9IHRydWVcbiAgICB9XG5cbiAgICAvKiog0J7QsdC90YPQu9C10L3QuNC1INGB0YfQtdGC0YfQuNC60LAg0LjRgtC10YDQsNGC0L7RgNCwLiAqL1xuICAgIHRoaXMuaW5kZXggPSAwXG5cbiAgICAvKiog0J/QvtC00LPQvtGC0L7QstC60LAg0LTQtdC80L4t0YDQtdC20LjQvNCwICjQtdGB0LvQuCDRgtGA0LXQsdGD0LXRgtGB0Y8pLiAqL1xuICAgIGlmICh0aGlzLnNwbG90LmRlbW8uaXNFbmFibGUpIHtcbiAgICAgIHRoaXMuc3Bsb3QuaXRlcmF0b3IgPSB0aGlzLnNwbG90LmRlbW8uaXRlcmF0b3IuYmluZCh0aGlzKVxuICAgICAgdGhpcy5zcGxvdC5jb2xvcnMgPSB0aGlzLnNwbG90LmRlbW8uY29sb3JzXG4gICAgfVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JjQvNC40YLQuNGA0YPQtdGCINC40YLQtdGA0LDRgtC+0YAg0LjRgdGF0L7QtNC90YvRhSDQvtCx0YrQtdC60YLQvtCyLlxuICAgKlxuICAgKiBAcmV0dXJucyDQlNCw0L3QvdGL0LUg0L7QsSDQvtCx0YrQtdC60YLQtS5cbiAgICovXG4gIHB1YmxpYyBpdGVyYXRvcigpOiBTUGxvdE9iamVjdCB8IG51bGwge1xuICAgIGlmICh0aGlzLmluZGV4IDwgdGhpcy5hbW91bnQpIHtcbiAgICAgIHRoaXMuaW5kZXgrK1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgeDogTWF0aC5yYW5kb20oKSxcbiAgICAgICAgeTogTWF0aC5yYW5kb20oKSxcbiAgICAgICAgc2hhcGU6IHJhbmRvbUludCh0aGlzLnNwbG90LnNoYXBlc0NvdW50ISksXG4gICAgICAgIHNpemU6IHRoaXMuc2l6ZU1pbiArIHJhbmRvbUludCh0aGlzLnNpemVNYXggLSB0aGlzLnNpemVNaW4gKyAxKSxcbiAgICAgICAgY29sb3I6IHJhbmRvbUludCh0aGlzLmNvbG9ycy5sZW5ndGgpXG4gICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCBTUGxvdCBmcm9tICdAL3NwbG90J1xuaW1wb3J0ICogYXMgc2hhZGVycyBmcm9tICdAL3NoYWRlcnMnXG5pbXBvcnQgeyBjb2xvckZyb21IZXhUb0dsUmdiIH0gZnJvbSAnQC91dGlscydcblxuLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqXG4gKiDQmtC70LDRgdGBLdGF0LXQu9C/0LXRgCwg0YPQv9GA0LDQstC70Y/RjtGJ0LjQuSBHTFNMLdC60L7QtNC+0Lwg0YjQtdC50LTQtdGA0L7Qsi5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU1Bsb3RHbHNsIGltcGxlbWVudHMgU1Bsb3RIZWxwZXIge1xuXG4gIC8qKiDQmtC+0LTRiyDRiNC10LnQtNC10YDQvtCyLiAqL1xuICBwdWJsaWMgdmVydFNoYWRlclNvdXJjZTogc3RyaW5nID0gJydcbiAgcHVibGljIGZyYWdTaGFkZXJTb3VyY2U6IHN0cmluZyA9ICcnXG5cbiAgLyoqINCf0YDQuNC30L3QsNC6INGC0L7Qs9C+LCDRh9GC0L4g0YXQtdC70L/QtdGAINGD0LbQtSDQvdCw0YHRgtGA0L7QtdC9LiAqL1xuICBwdWJsaWMgaXNTZXR1cGVkOiBib29sZWFuID0gZmFsc2VcblxuICAvKiog0KXQtdC70L/QtdGAINCx0YPQtNC10YIg0LjQvNC10YLRjCDQv9C+0LvQvdGL0Lkg0LTQvtGB0YLRg9C/INC6INGN0LrQt9C10LzQv9C70Y/RgNGDIFNQbG90LiAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICByZWFkb25seSBzcGxvdDogU1Bsb3RcbiAgKSB7fVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCf0L7QtNCz0L7RgtCw0LLQu9C40LLQsNC10YIg0YXQtdC70L/QtdGAINC6INC40YHQv9C+0LvRjNC30L7QstCw0L3QuNGOLlxuICAgKi9cbiAgcHVibGljIHNldHVwKCk6IHZvaWQge1xuXG4gICAgaWYgKCF0aGlzLmlzU2V0dXBlZCkge1xuXG4gICAgICAvKiog0KHQsdC+0YDQutCwINC60L7QtNC+0LIg0YjQtdC50LTQtdGA0L7Qsi4gKi9cbiAgICAgIHRoaXMudmVydFNoYWRlclNvdXJjZSA9IHRoaXMubWFrZVZlcnRTaGFkZXJTb3VyY2UoKVxuICAgICAgdGhpcy5mcmFnU2hhZGVyU291cmNlID0gdGhpcy5tYWtlRnJhZ1NoYWRlclNvdXJjZSgpXG5cbiAgICAgIC8qKiDQktGL0YfQuNGB0LvQtdC90LjQtSDQutC+0LvQuNGH0LXRgdGC0LLQsCDRgNCw0LfQu9C40YfQvdGL0YUg0YTQvtGA0Lwg0L7QsdGK0LXQutGC0L7Qsi4gKi9cbiAgICAgIHRoaXMuc3Bsb3Quc2hhcGVzQ291bnQgPSBzaGFkZXJzLlNIQVBFUy5sZW5ndGhcblxuICAgICAgdGhpcy5pc1NldHVwZWQgPSB0cnVlXG4gICAgfVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0KHQvtC30LTQsNC10YIg0LrQvtC0INCy0LXRgNGI0LjQvdC90L7Qs9C+INGI0LXQudC00LXRgNCwLlxuICAgKlxuICAgKiBAcmVtYXJrc1xuICAgKiDQkiDRiNCw0LHQu9C+0L0g0LLQtdGA0YjQuNC90L3QvtCz0L4g0YjQtdC50LTQtdGA0LAg0LLRgdGC0LDQstC70Y/QtdGC0YHRjyDQutC+0LQg0LLRi9Cx0L7RgNCwINGG0LLQtdGC0LAg0L7QsdGK0LXQutGC0LAg0L/QviDQuNC90LTQtdC60YHRgyDRhtCy0LXRgtCwLiDQoi7Qui7RiNC10LnQtNC10YAg0L3QtSDQv9C+0LfQstC+0LvRj9C10YJcbiAgICog0LjRgdC/0L7Qu9GM0LfQvtCy0LDRgtGMINCyINC60LDRh9C10YHRgtCy0LUg0LjQvdC00LXQutGB0L7QsiDQv9C10YDQtdC80LXQvdC90YvQtSAtINC00LvRjyDQt9Cw0LTQsNC90LjRjyDRhtCy0LXRgtCwINC40YHQv9C+0LvRjNC30YPQtdGC0YHRjyDQv9C+0YHQu9C10LTQvtCy0LDRgtC10LvRjNC90YvQuSDQv9C10YDQtdCx0L7RgCDRhtCy0LXRgtC+0LLRi9GFXG4gICAqINC40L3QtNC10LrRgdC+0LIuINCc0LXRgdGC0L4g0LLRgdGC0LDQstC60Lgg0LrQvtC00LAg0L7QsdC+0LfQvdCw0YfQsNC10YLRgdGPINCyINGI0LDQsdC70L7QvdC1INCy0LXRgNGI0LjQvdC90L7Qs9C+INGI0LXQudC00LXRgNCwINGB0LvQvtCy0L7QvCBcIntDT0xPUi1TRUxFQ1RJT059XCIuXG4gICAqXG4gICAqIEByZXR1cm5zINCh0YLRgNC+0LrQsCDRgSDQutC+0LTQvtC8LlxuICAgKi9cbiAgcHJpdmF0ZSBtYWtlVmVydFNoYWRlclNvdXJjZSgpOiBzdHJpbmcge1xuXG4gICAgLyoqINCS0YDQtdC80LXQvdC90L7QtSDQtNC+0LHQsNCy0LvQtdC90LjQtSDQsiDQv9Cw0LvQuNGC0YDRgyDQstC10YDRiNC40L0g0YbQstC10YLQsCDQvdCw0L/RgNCw0LLQu9GP0Y7RidC40YUuICovXG4gICAgdGhpcy5zcGxvdC5jb2xvcnMucHVzaCh0aGlzLnNwbG90LmdyaWQuZ3VpZGVDb2xvciEpXG5cbiAgICBsZXQgY29kZTogc3RyaW5nID0gJydcblxuICAgIC8qKiDQpNC+0YDQvNC40YDQvtCy0L3QuNC1INC60L7QtNCwINGD0YHRgtCw0L3QvtCy0LrQuCDRhtCy0LXRgtCwINC+0LHRitC10LrRgtCwINC/0L4g0LjQvdC00LXQutGB0YMuICovXG4gICAgdGhpcy5zcGxvdC5jb2xvcnMuZm9yRWFjaCgodmFsdWUsIGluZGV4KSA9PiB7XG4gICAgICBsZXQgW3IsIGcsIGJdID0gY29sb3JGcm9tSGV4VG9HbFJnYih2YWx1ZSlcbiAgICAgIGNvZGUgKz0gYGVsc2UgaWYgKGFfY29sb3IgPT0gJHtpbmRleH0uMCkgdl9jb2xvciA9IHZlYzMoJHtyfSwgJHtnfSwgJHtifSk7XFxuYFxuICAgIH0pXG5cbiAgICAvKiog0KPQtNCw0LvQtdC90LjQtSDQuNC3INC/0LDQu9C40YLRgNGLINCy0LXRgNGI0LjQvSDQstGA0LXQvNC10L3QvdC+INC00L7QsdCw0LLQu9C10L3QvdC+0LPQviDRhtCy0LXRgtCwINC90LDQv9GA0LDQstC70Y/RjtGJ0LjRhS4gKi9cbiAgICB0aGlzLnNwbG90LmNvbG9ycy5wb3AoKVxuXG4gICAgLyoqINCj0LTQsNC70LXQvdC40LUg0LvQuNGI0L3QtdCz0L4gXCJlbHNlXCIg0LIg0L3QsNGH0LDQu9C1INC60L7QtNCwINC4INC70LjRiNC90LXQs9C+INC/0LXRgNC10LLQvtC00LAg0YHRgtGA0L7QutC4INCyINC60L7QvdGG0LUuICovXG4gICAgY29kZSA9IGNvZGUuc2xpY2UoNSkuc2xpY2UoMCwgLTEpXG5cbiAgICByZXR1cm4gc2hhZGVycy5WRVJURVhfVEVNUExBVEUucmVwbGFjZSgne0NPTE9SLVNFTEVDVElPTn0nLCBjb2RlKS50cmltKClcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCh0L7Qt9C00LDQtdGCINC60L7QtCDRhNGA0LDQs9C80LXQvdGC0L3QvtCz0L4g0YjQtdC50LTQtdGA0LAuXG4gICAqXG4gICAqIEByZW1hcmtzXG4gICAqINCSINGI0LDQsdC70L7QvSDRhNGA0LDQs9C80LXQvdGC0L3QvtCz0L4g0YjQtdC50LTQtdGA0LAg0LLRgdGC0LDQstC70Y/QtdGC0YHRjyDQutC+0LQg0LLRi9Cx0L7RgNCwINGE0L7RgNC80Ysg0L7QsdGK0LXQutGC0LAg0L/QviDQuNC90LTQtdC60YHRgyDRhNC+0YDQvNGLLiDQoi7Qui7RiNC10LnQtNC10YAg0L3QtSDQv9C+0LfQstC+0LvRj9C10YJcbiAgICog0LjRgdC/0L7Qu9GM0LfQvtCy0LDRgtGMINCyINC60LDRh9C10YHRgtCy0LUg0LjQvdC00LXQutGB0L7QsiDQv9C10YDQtdC80LXQvdC90YvQtSAtINC00LvRjyDQt9Cw0LTQsNC90LjRjyDRhNC+0YDQvNGLINC40YHQv9C+0LvRjNC30YPQtdGC0YHRjyDQv9C+0YHQu9C10LTQvtCy0LDRgtC10LvRjNC90YvQuSDQv9C10YDQtdCx0L7RgCDQuNC90LTQtdC60YHQvtCyXG4gICAqINGE0L7RgNC8LiDQmtCw0LbQtNCw0Y8g0YTQvtGA0LzQsCDQvtC/0LjRgdGL0LLQsNC10YLRgdGPINGE0YPQvdC60YbQuNC10LksINC60L7RgtC+0YDRi9C1INGB0L7Qt9C00LDRjtGC0YHRjyDQuNC3INC/0LXRgNC10YfQuNGB0LvRj9C10LzRi9GFIEdMU0wt0LDQu9Cz0L7RgNC40YLQvNC+0LIgKNC60L7QvdGB0YLQsNC90YLRiyBTSEFQRVMpLlxuICAgKiDQnNC10YHRgtC+INCy0YHRgtCw0LLQutC4INC60L7QtNCwINGE0YPQvdC60YbQuNC5INCyINGI0LDQsdC70L7QvdC1INGE0YDQsNCz0LzQtdC90YLQvdC+0LPQviDRiNC10LnQtNC10YDQsCDQvtCx0L7Qt9C90LDRh9Cw0LXRgtGB0Y8g0YHQu9C+0LLQvtC8IFwie1NIQVBFUy1GVU5DVElPTlN9XCIuINCc0LXRgdGC0L4g0LLRgdGC0LDQstC60LhcbiAgICog0L/QtdGA0LXQsdC+0YDQsCDQuNC90LTQtdC60YHQvtCyINGE0L7RgNC8INC+0LHQvtC30L3QsNGH0LDQtdGC0YHRjyDRgdC70L7QstC+0LwgXCJ7U0hBUEUtU0VMRUNUSU9OfVwiLlxuICAgKlxuICAgKiBAcmV0dXJucyDQodGC0YDQvtC60LAg0YEg0LrQvtC00L7QvC5cbiAgICovXG4gIHByaXZhdGUgbWFrZUZyYWdTaGFkZXJTb3VyY2UoKTogc3RyaW5nIHtcblxuICAgIGxldCBjb2RlMTogc3RyaW5nID0gJydcbiAgICBsZXQgY29kZTI6IHN0cmluZyA9ICcnXG5cbiAgICBzaGFkZXJzLlNIQVBFUy5mb3JFYWNoKCh2YWx1ZSwgaW5kZXgpID0+IHtcblxuICAgICAgLyoqINCk0L7RgNC80LjRgNC+0LLQsNC90LjQtSDQutC+0LTQsCDRhNGD0L3QutGG0LjQuSwg0L7Qv9C40YHRi9Cy0LDRjtGJ0LjRhSDRhNC+0YDQvNGLINC+0LHRitC10LrRgtC+0LIuICovXG4gICAgICBjb2RlMSArPSBgdm9pZCBzJHtpbmRleH0oKSB7ICR7dmFsdWUudHJpbSgpfSB9XFxuYFxuXG4gICAgICAvKiog0KTQvtGA0LzQuNGA0L7QstCw0L3QuNC1INC60L7QtNCwINGD0YHRgtCw0L3QvtCy0LrQuCDRhNC+0YDQvNGLINC+0LHRitC10LrRgtCwINC/0L4g0LjQvdC00LXQutGB0YMuICovXG4gICAgICBjb2RlMiArPSBgZWxzZSBpZiAodl9zaGFwZSA9PSAke2luZGV4fS4wKSB7IHMke2luZGV4fSgpO31cXG5gXG4gICAgfSlcblxuICAgIC8qKiDQo9C00LDQu9C10L3QuNC1INC70LjRiNC90LXQs9C+INC/0LXRgNC10LLQvtC00LAg0YHRgtGA0L7QutC4INCyINC60L7QvdGG0LUg0LrQvtC00LAg0YTRg9C90LrRhtC40LkuICovXG4gICAgY29kZTEgPSBjb2RlMS5zbGljZSgwLCAtMSlcblxuICAgIC8qKiDQo9C00LDQu9C10L3QuNC1INC70LjRiNC90LXQs9C+IFwiZWxzZVwiINCyINC90LDRh9Cw0LvQtSDQutC+0LTQsCDQv9C10YDQtdCx0L7RgNCwINC4INC70LjRiNC90LXQs9C+INC/0LXRgNC10LLQvtC00LAg0YHRgtGA0L7QutC4INCyINC60L7QvdGG0LUg0LrQvtC00LAuICovXG4gICAgY29kZTIgPSBjb2RlMi5zbGljZSg1KS5zbGljZSgwLCAtMSlcblxuICAgIHJldHVybiBzaGFkZXJzLkZSQUdNRU5UX1RFTVBMQVRFLlxuICAgICAgcmVwbGFjZSgne1NIQVBFUy1GVU5DVElPTlN9JywgY29kZTEpLlxuICAgICAgcmVwbGFjZSgne1NIQVBFLVNFTEVDVElPTn0nLCBjb2RlMikuXG4gICAgICB0cmltKClcbiAgfVxufVxuIiwiaW1wb3J0IFNQbG90IGZyb20gJ0Avc3Bsb3QnXG5pbXBvcnQgeyBjb2xvckZyb21IZXhUb0dsUmdiIH0gZnJvbSAnQC91dGlscydcblxuLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqXG4gKiDQmtC70LDRgdGBLdGF0LXQu9C/0LXRgCwg0YDQtdCw0LvQuNC30YPRjtGJ0LjQuSDRg9C/0YDQsNCy0LvQtdC90LjQtSDQutC+0L3RgtC10LrRgdGC0L7QvCDRgNC10L3QtNC10YDQuNC90LPQsCBXZWJHTCDQutC70LDRgdGB0LAgU3Bsb3QuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNQbG90V2ViR2wgaW1wbGVtZW50cyBTUGxvdEhlbHBlciB7XG5cbiAgLyoqINCf0LDRgNCw0LzQtdGC0YDRiyDQuNC90LjRhtC40LDQu9C40LfQsNGG0LjQuCDQutC+0L3RgtC10LrRgdGC0LAg0YDQtdC90LTQtdGA0LjQvdCz0LAgV2ViR0wuICovXG4gIHB1YmxpYyBhbHBoYTogYm9vbGVhbiA9IGZhbHNlXG4gIHB1YmxpYyBkZXB0aDogYm9vbGVhbiA9IGZhbHNlXG4gIHB1YmxpYyBzdGVuY2lsOiBib29sZWFuID0gZmFsc2VcbiAgcHVibGljIGFudGlhbGlhczogYm9vbGVhbiA9IHRydWVcbiAgcHVibGljIGRlc3luY2hyb25pemVkOiBib29sZWFuID0gdHJ1ZVxuICBwdWJsaWMgcHJlbXVsdGlwbGllZEFscGhhOiBib29sZWFuID0gZmFsc2VcbiAgcHVibGljIHByZXNlcnZlRHJhd2luZ0J1ZmZlcjogYm9vbGVhbiA9IGZhbHNlXG4gIHB1YmxpYyBmYWlsSWZNYWpvclBlcmZvcm1hbmNlQ2F2ZWF0OiBib29sZWFuID0gZmFsc2VcbiAgcHVibGljIHBvd2VyUHJlZmVyZW5jZTogV2ViR0xQb3dlclByZWZlcmVuY2UgPSAnaGlnaC1wZXJmb3JtYW5jZSdcblxuICAvKiog0J3QsNC30LLQsNC90LjRjyDRjdC70LXQvNC10L3RgtC+0LIg0LPRgNCw0YTQuNGH0LXRgdC60L7QuSDRgdC40YHRgtC10LzRiyDQutC70LjQtdC90YLQsC4gKi9cbiAgcHVibGljIGdwdSA9IHsgaGFyZHdhcmU6ICctJywgc29mdHdhcmU6ICctJyB9XG5cbiAgLyoqINCa0L7QvdGC0LXQutGB0YIg0YDQtdC90LTQtdGA0LjQvdCz0LAg0Lgg0L/RgNC+0LPRgNCw0LzQvNCwIFdlYkdMLiAqL1xuICBwdWJsaWMgZ2whOiBXZWJHTFJlbmRlcmluZ0NvbnRleHRcbiAgcHJpdmF0ZSBncHVQcm9ncmFtITogV2ViR0xQcm9ncmFtXG5cbiAgLyoqINCf0LXRgNC10LzQtdC90L3Ri9C1INC00LvRjyDRgdCy0Y/Qt9C4INC/0YDQuNC70L7QttC10L3QuNGPINGBINC/0YDQvtCz0YDQsNC80LzQvtC5IFdlYkdMLiAqL1xuICBwcml2YXRlIHZhcmlhYmxlczogTWFwPHN0cmluZywgYW55PiA9IG5ldyBNYXAoKVxuXG4gIC8qKiDQn9GA0LjQt9C90LDQuiDRgtC+0LPQviwg0YfRgtC+INGF0LXQu9C/0LXRgCDRg9C20LUg0L3QsNGB0YLRgNC+0LXQvS4gKi9cbiAgcHVibGljIGlzU2V0dXBlZDogYm9vbGVhbiA9IGZhbHNlXG5cbiAgLyoqINCR0YPRhNC10YDRiyDQstC40LTQtdC+0L/QsNC80Y/RgtC4IFdlYkdMLiAqL1xuICBwdWJsaWMgZGF0YTogYW55W10gPSBbXVxuXG4gIC8qKiDQnNCw0YHRgdC40LIg0YHQvtC+0YLQstC10YLRgdGC0LLQuNC5INC/0LDRgNCw0LzQtdGC0YDQsCDQvtCx0YrQtdC60YLQsCDRgtC40L/RgyDQs9GA0YPQv9C/0YsgKNGC0LjQv9GDINGC0LjQv9C40LfQuNGA0L7QstCw0L3QvdC+0LPQviDQvNCw0YHRgdC40LLQsCDQuCDRgtC40L/RgyDQv9C10YDQtdC80LXQvdC90L7QuSBXZWJHTCkuICovXG4gIHByaXZhdGUgb2JqUGFyYW1UeXBlOiBudW1iZXJbXSA9IFtdXG5cbiAgLyoqINCf0YDQsNCy0LjQu9CwINGB0L7QvtGC0LLQtdGC0YHRgtCy0LjRjyDRgtC40L/QvtCyINGC0LjQv9C40LfQuNGA0L7QstCw0L3QvdGL0YUg0LzQsNGB0YHQuNCy0L7QsiDQuCDRgtC40L/QvtCyINC/0LXRgNC10LzQtdC90L3Ri9GFIFdlYkdMLiAqL1xuICBwcml2YXRlIGdsTnVtYmVyVHlwZXM6IE1hcDxzdHJpbmcsIG51bWJlcj4gPSBuZXcgTWFwKFtcbiAgICBbJ0ludDhBcnJheScsIDB4MTQwMF0sICAgICAgIC8vIGdsLkJZVEVcbiAgICBbJ1VpbnQ4QXJyYXknLCAweDE0MDFdLCAgICAgIC8vIGdsLlVOU0lHTkVEX0JZVEVcbiAgICBbJ0ludDE2QXJyYXknLCAweDE0MDJdLCAgICAgIC8vIGdsLlNIT1JUXG4gICAgWydVaW50MTZBcnJheScsIDB4MTQwM10sICAgICAvLyBnbC5VTlNJR05FRF9TSE9SVFxuICAgIFsnRmxvYXQzMkFycmF5JywgMHgxNDA2XSAgICAgLy8gZ2wuRkxPQVRcbiAgXSlcblxuICAvKiog0KXQtdC70L/QtdGAINCx0YPQtNC10YIg0LjQvNC10YLRjCDQv9C+0LvQvdGL0Lkg0LTQvtGB0YLRg9C/INC6INGN0LrQt9C10LzQv9C70Y/RgNGDIFNQbG90LiAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICByZWFkb25seSBzcGxvdDogU1Bsb3RcbiAgKSB7IH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQn9C+0LTQs9C+0YLQsNCy0LvQuNCy0LDQtdGCINGF0LXQu9C/0LXRgCDQuiDQuNGB0L/QvtC70YzQt9C+0LLQsNC90LjRji5cbiAgICovXG4gIHB1YmxpYyBzZXR1cCgpOiB2b2lkIHtcblxuICAgIC8qKiDQp9Cw0YHRgtGMINC/0LDRgNCw0LzQtdGC0YDQvtCyINGF0LXQu9C/0LXRgNCwIFdlYkdMINC40L3QuNGG0LjQsNC70LjQt9C40YDRg9C10YLRgdGPINGC0L7Qu9GM0LrQviDQvtC00LjQvSDRgNCw0LcuICovXG4gICAgaWYgKCF0aGlzLmlzU2V0dXBlZCkge1xuXG4gICAgICB0aGlzLmdsID0gdGhpcy5zcGxvdC5jYW52YXMuZ2V0Q29udGV4dCgnd2ViZ2wnLCB7XG4gICAgICAgIGFscGhhOiB0aGlzLmFscGhhLFxuICAgICAgICBkZXB0aDogdGhpcy5kZXB0aCxcbiAgICAgICAgc3RlbmNpbDogdGhpcy5zdGVuY2lsLFxuICAgICAgICBhbnRpYWxpYXM6IHRoaXMuYW50aWFsaWFzLFxuICAgICAgICBkZXN5bmNocm9uaXplZDogdGhpcy5kZXN5bmNocm9uaXplZCxcbiAgICAgICAgcHJlbXVsdGlwbGllZEFscGhhOiB0aGlzLnByZW11bHRpcGxpZWRBbHBoYSxcbiAgICAgICAgcHJlc2VydmVEcmF3aW5nQnVmZmVyOiB0aGlzLnByZXNlcnZlRHJhd2luZ0J1ZmZlcixcbiAgICAgICAgZmFpbElmTWFqb3JQZXJmb3JtYW5jZUNhdmVhdDogdGhpcy5mYWlsSWZNYWpvclBlcmZvcm1hbmNlQ2F2ZWF0LFxuICAgICAgICBwb3dlclByZWZlcmVuY2U6IHRoaXMucG93ZXJQcmVmZXJlbmNlXG4gICAgICB9KSFcblxuICAgICAgaWYgKHRoaXMuZ2wgPT09IG51bGwpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCfQntGI0LjQsdC60LAg0YHQvtC30LTQsNC90LjRjyDQutC+0L3RgtC10LrRgdGC0LAg0YDQtdC90LTQtdGA0LjQvdCz0LAgV2ViR0whJylcbiAgICAgIH1cblxuICAgICAgLyoqINCf0L7Qu9GD0YfQtdC90LjQtSDQuNC90YTQvtGA0LzQsNGG0LjQuCDQviDQs9GA0LDRhNC40YfQtdGB0LrQvtC5INGB0LjRgdGC0LXQvNC1INC60LvQuNC10L3RgtCwLiAqL1xuICAgICAgbGV0IGV4dCA9IHRoaXMuZ2wuZ2V0RXh0ZW5zaW9uKCdXRUJHTF9kZWJ1Z19yZW5kZXJlcl9pbmZvJylcbiAgICAgIHRoaXMuZ3B1LmhhcmR3YXJlID0gKGV4dCkgPyB0aGlzLmdsLmdldFBhcmFtZXRlcihleHQuVU5NQVNLRURfUkVOREVSRVJfV0VCR0wpIDogJ1vQvdC10LjQt9Cy0LXRgdGC0L3Qvl0nXG4gICAgICB0aGlzLmdwdS5zb2Z0d2FyZSA9IHRoaXMuZ2wuZ2V0UGFyYW1ldGVyKHRoaXMuZ2wuVkVSU0lPTilcblxuICAgICAgdGhpcy5zcGxvdC5kZWJ1Zy5sb2coJ2dwdScpXG5cbiAgICAgIC8qKiDQodC+0LfQtNCw0L3QuNC1INC/0YDQvtCz0YDQsNC80LzRiyBXZWJHTC4gKi9cbiAgICAgIHRoaXMuY3JlYXRlUHJvZ3JhbSh0aGlzLnNwbG90Lmdsc2wudmVydFNoYWRlclNvdXJjZSwgdGhpcy5zcGxvdC5nbHNsLmZyYWdTaGFkZXJTb3VyY2UpXG5cbiAgICAgIHRoaXMuaXNTZXR1cGVkID0gdHJ1ZVxuICAgIH1cblxuICAgIC8qKiDQlNGA0YPQs9Cw0Y8g0YfQsNGB0YLRjCDQv9Cw0YDQsNC80LXRgtGA0L7QsiDRhdC10LvQv9C10YDQsCBXZWJHTCDQuNC90LjRhtC40LDQu9C40LfQuNGA0YPQtdGC0YHRjyDQv9GA0Lgg0LrQsNC20LTQvtC8INCy0YvQt9C+0LLQtSDQvNC10YLQvtC00LAgc2V0dXAuICovXG5cbiAgICAvKiog0JrQvtC+0YDQtdC60YLQuNGA0L7QstC60LAg0YDQsNC30LzQtdGA0LAg0L7QsdC70LDRgdGC0Lgg0L/RgNC+0YHQvNC+0YLRgNCwLiAqL1xuICAgIHRoaXMuc3Bsb3QuY2FudmFzLndpZHRoID0gdGhpcy5zcGxvdC5jYW52YXMuY2xpZW50V2lkdGhcbiAgICB0aGlzLnNwbG90LmNhbnZhcy5oZWlnaHQgPSB0aGlzLnNwbG90LmNhbnZhcy5jbGllbnRIZWlnaHRcbiAgICB0aGlzLmdsLnZpZXdwb3J0KDAsIDAsIHRoaXMuc3Bsb3QuY2FudmFzLndpZHRoLCB0aGlzLnNwbG90LmNhbnZhcy5oZWlnaHQpXG5cbiAgICAvKiog0JXRgdC70Lgg0L7QttC40LTQsNC10YLRgdGPINC30LDQs9GA0YPQt9C60LAg0LTQsNC90L3Ri9GFLCDRgtC+INCy0LjQtNC10L7QsdGD0YTQtdGA0Ysg0L/RgNC10LTQstCw0YDQuNGC0LXQu9GM0L3QviDQvtGH0LjRidCw0Y7RgtGB0Y8uICovXG4gICAgaWYgKHRoaXMuc3Bsb3QubG9hZERhdGEpIHtcbiAgICAgIHRoaXMuY2xlYXJEYXRhKClcbiAgICB9XG5cbiAgICAvKiog0KPRgdGC0LDQvdC+0LLQutCwINGE0L7QvdC+0LLQvtCz0L4g0YbQstC10YLQsCDQutCw0L3QstCw0YHQsCAo0YbQstC10YIg0L7Rh9C40YHRgtC60Lgg0LrQvtC90YLQtdC60YHRgtCwINGA0LXQvdC00LXRgNC40L3Qs9CwKS4gKi9cbiAgICB0aGlzLnNldEJnQ29sb3IodGhpcy5zcGxvdC5ncmlkLmJnQ29sb3IhKVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0J7Rh9C40YnQsNC10YIg0LLQuNC00LXQvtCx0YPRhNC10YDRiy5cbiAgICovXG4gIGNsZWFyRGF0YSgpOiB2b2lkIHtcbiAgICBmb3IgKGxldCBkeCA9IDA7IGR4IDwgdGhpcy5zcGxvdC5hcmVhLmNvdW50OyBkeCsrKSB7XG4gICAgICB0aGlzLmRhdGFbZHhdID0gW11cbiAgICAgIGZvciAobGV0IGR5ID0gMDsgZHkgPCB0aGlzLnNwbG90LmFyZWEuY291bnQ7IGR5KyspIHtcbiAgICAgICAgdGhpcy5kYXRhW2R4XVtkeV0gPSBbXVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCj0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdGCINGG0LLQtdGCINGE0L7QvdCwINC60L7QvdGC0LXQutGB0YLQsCDRgNC10L3QtNC10YDQuNC90LPQsCBXZWJHTC5cbiAgICovXG4gIHB1YmxpYyBzZXRCZ0NvbG9yKGNvbG9yOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBsZXQgW3IsIGcsIGJdID0gY29sb3JGcm9tSGV4VG9HbFJnYihjb2xvcilcbiAgICB0aGlzLmdsLmNsZWFyQ29sb3IociwgZywgYiwgMC4wKVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JfQsNC60YDQsNGI0LjQstCw0LXRgiDQutC+0L3RgtC10LrRgdGCINGA0LXQvdC00LXRgNC40L3Qs9CwIFdlYkdMINGG0LLQtdGC0L7QvCDRhNC+0L3QsC5cbiAgICovXG4gIHB1YmxpYyBjbGVhckJhY2tncm91bmQoKTogdm9pZCB7XG4gICAgdGhpcy5nbC5jbGVhcih0aGlzLmdsLkNPTE9SX0JVRkZFUl9CSVQpO1xuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0KHQvtC30LTQsNC10YIg0YjQtdC50LTQtdGAIFdlYkdMLlxuICAgKlxuICAgKiBAcGFyYW0gdHlwZSAtINCi0LjQvyDRiNC10LnQtNC10YDQsC5cbiAgICogQHBhcmFtIGNvZGUgLSBHTFNMLdC60L7QtCDRiNC10LnQtNC10YDQsC5cbiAgICogQHJldHVybnMg0KHQvtC30LTQsNC90L3Ri9C5INGI0LXQudC00LXRgC5cbiAgICovXG4gIHB1YmxpYyBjcmVhdGVTaGFkZXIodHlwZTogJ1ZFUlRFWF9TSEFERVInIHwgJ0ZSQUdNRU5UX1NIQURFUicsIGNvZGU6IHN0cmluZyk6IFdlYkdMU2hhZGVyIHtcblxuICAgIGNvbnN0IHNoYWRlciA9IHRoaXMuZ2wuY3JlYXRlU2hhZGVyKHRoaXMuZ2xbdHlwZV0pIVxuICAgIHRoaXMuZ2wuc2hhZGVyU291cmNlKHNoYWRlciwgY29kZSlcbiAgICB0aGlzLmdsLmNvbXBpbGVTaGFkZXIoc2hhZGVyKVxuXG4gICAgaWYgKCF0aGlzLmdsLmdldFNoYWRlclBhcmFtZXRlcihzaGFkZXIsIHRoaXMuZ2wuQ09NUElMRV9TVEFUVVMpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ9Ce0YjQuNCx0LrQsCDQutC+0LzQv9C40LvRj9GG0LjQuCDRiNC10LnQtNC10YDQsCBbJyArIHR5cGUgKyAnXS4gJyArIHRoaXMuZ2wuZ2V0U2hhZGVySW5mb0xvZyhzaGFkZXIpKVxuICAgIH1cblxuICAgIHJldHVybiBzaGFkZXJcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCh0L7Qt9C00LDQtdGCINC/0YDQvtCz0YDQsNC80LzRgyBXZWJHTCDQuNC3INGI0LXQudC00LXRgNC+0LIuXG4gICAqXG4gICAqIEBwYXJhbSBzaGFkZXJWZXJ0IC0g0JLQtdGA0YjQuNC90L3Ri9C5INGI0LXQudC00LXRgC5cbiAgICogQHBhcmFtIHNoYWRlckZyYWcgLSDQpNGA0LDQs9C80LXQvdGC0L3Ri9C5INGI0LXQudC00LXRgC5cbiAgICovXG4gIHB1YmxpYyBjcmVhdGVQcm9ncmFtRnJvbVNoYWRlcnMoc2hhZGVyVmVydDogV2ViR0xTaGFkZXIsIHNoYWRlckZyYWc6IFdlYkdMU2hhZGVyKTogdm9pZCB7XG5cbiAgICB0aGlzLmdwdVByb2dyYW0gPSB0aGlzLmdsLmNyZWF0ZVByb2dyYW0oKSFcbiAgICB0aGlzLmdsLmF0dGFjaFNoYWRlcih0aGlzLmdwdVByb2dyYW0sIHNoYWRlclZlcnQpXG4gICAgdGhpcy5nbC5hdHRhY2hTaGFkZXIodGhpcy5ncHVQcm9ncmFtLCBzaGFkZXJGcmFnKVxuICAgIHRoaXMuZ2wubGlua1Byb2dyYW0odGhpcy5ncHVQcm9ncmFtKVxuICAgIHRoaXMuZ2wudXNlUHJvZ3JhbSh0aGlzLmdwdVByb2dyYW0pXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQodC+0LfQtNCw0LXRgiDQv9GA0L7Qs9GA0LDQvNC80YMgV2ViR0wg0LjQtyBHTFNMLdC60L7QtNC+0LIg0YjQtdC50LTQtdGA0L7Qsi5cbiAgICpcbiAgICogQHBhcmFtIHNoYWRlckNvZGVWZXJ0IC0g0JrQvtC0INCy0LXRgNGI0LjQvdC90L7Qs9C+INGI0LXQudC00LXRgNCwLlxuICAgKiBAcGFyYW0gc2hhZGVyQ29kZUZyYWcgLSDQmtC+0LQg0YTRgNCw0LPQvNC10L3RgtC90L7Qs9C+INGI0LXQudC00LXRgNCwLlxuICAgKi9cbiAgcHVibGljIGNyZWF0ZVByb2dyYW0oc2hhZGVyQ29kZVZlcnQ6IHN0cmluZywgc2hhZGVyQ29kZUZyYWc6IHN0cmluZyk6IHZvaWQge1xuXG4gICAgdGhpcy5zcGxvdC5kZWJ1Zy5sb2coJ3NoYWRlcnMnKVxuXG4gICAgdGhpcy5jcmVhdGVQcm9ncmFtRnJvbVNoYWRlcnMoXG4gICAgICB0aGlzLmNyZWF0ZVNoYWRlcignVkVSVEVYX1NIQURFUicsIHNoYWRlckNvZGVWZXJ0KSxcbiAgICAgIHRoaXMuY3JlYXRlU2hhZGVyKCdGUkFHTUVOVF9TSEFERVInLCBzaGFkZXJDb2RlRnJhZylcbiAgICApXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQodC+0LfQtNCw0LXRgiDRgdCy0Y/Qt9GMINC/0LXRgNC10LzQtdC90L3QvtC5INC/0YDQuNC70L7QttC10L3QuNGPINGBINC/0YDQvtCz0YDQsNC80LzQvtC5IFdlYkdsLlxuICAgKlxuICAgKiBAcmVtYXJrc1xuICAgKiDQn9C10YDQtdC80LXQvdC90YvQtSDRgdC+0YXRgNCw0L3Rj9GO0YLRgdGPINCyINCw0YHRgdC+0YbQuNCw0YLQuNCy0L3QvtC8INC80LDRgdGB0LjQstC1LCDQs9C00LUg0LrQu9GO0YfQuCAtINGN0YLQviDQvdCw0LfQstCw0L3QuNGPINC/0LXRgNC10LzQtdC90L3Ri9GFLiDQndCw0LfQstCw0L3QuNC1INC/0LXRgNC10LzQtdC90L3QvtC5INC00L7Qu9C20L3QvlxuICAgKiDQvdCw0YfQuNC90LDRgtGM0YHRjyDRgSDQv9GA0LXRhNC40LrRgdCwLCDQvtCx0L7Qt9C90LDRh9Cw0Y7RidC10LPQviDQtdC1IEdMU0wt0YLQuNC/LiDQn9GA0LXRhNC40LrRgSBcInVfXCIg0L7Qv9C40YHRi9Cy0LDQtdGCINC/0LXRgNC10LzQtdC90L3Rg9GOINGC0LjQv9CwIHVuaWZvcm0uINCf0YDQtdGE0LjQutGBIFwiYV9cIlxuICAgKiDQvtC/0LjRgdGL0LLQsNC10YIg0L/QtdGA0LXQvNC10L3QvdGD0Y4g0YLQuNC/0LAgYXR0cmlidXRlLlxuICAgKlxuICAgKiBAcGFyYW0gdmFyTmFtZSAtINCY0LzRjyDQv9C10YDQtdC80LXQvdC90L7QuSAo0YHRgtGA0L7QutCwKS5cbiAgICovXG4gIHB1YmxpYyBjcmVhdGVWYXJpYWJsZSh2YXJOYW1lOiBzdHJpbmcpOiB2b2lkIHtcblxuICAgIGNvbnN0IHZhclR5cGUgPSB2YXJOYW1lLnNsaWNlKDAsIDIpXG5cbiAgICBpZiAodmFyVHlwZSA9PT0gJ3VfJykge1xuICAgICAgdGhpcy52YXJpYWJsZXMuc2V0KHZhck5hbWUsIHRoaXMuZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHRoaXMuZ3B1UHJvZ3JhbSwgdmFyTmFtZSkpXG4gICAgfSBlbHNlIGlmICh2YXJUeXBlID09PSAnYV8nKSB7XG4gICAgICB0aGlzLnZhcmlhYmxlcy5zZXQodmFyTmFtZSwgdGhpcy5nbC5nZXRBdHRyaWJMb2NhdGlvbih0aGlzLmdwdVByb2dyYW0sIHZhck5hbWUpKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ9Cj0LrQsNC30LDQvSDQvdC10LLQtdGA0L3Ri9C5INGC0LjQvyAo0L/RgNC10YTQuNC60YEpINC/0LXRgNC10LzQtdC90L3QvtC5INGI0LXQudC00LXRgNCwOiAnICsgdmFyTmFtZSlcbiAgICB9XG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQodC+0LfQtNCw0LXRgiDRgdCy0Y/Qt9GMINC90LDQsdC+0YDQsCDQv9C10YDQtdC80LXQvdC90YvRhSDQv9GA0LjQu9C+0LbQtdC90LjRjyDRgSDQv9GA0L7Qs9GA0LDQvNC80L7QuSBXZWJHbC5cbiAgICpcbiAgICogQHJlbWFya3NcbiAgICog0JTQtdC70LDQtdGCINGC0L7QttC1INGB0LDQvNC+0LUsINGH0YLQviDQuCDQvNC10YLQvtC0IHtAbGluayBjcmVhdGVWYXJpYWJsZX0sINC90L4g0L/QvtC30LLQvtC70Y/QtdGCINC30LAg0L7QtNC40L0g0LLRi9C30L7QsiDRgdC+0LfQtNCw0YLRjCDRgdGA0LDQt9GDINC90LXRgdC60L7Qu9GM0LrQvlxuICAgKiDQv9C10YDQtdC80LXQvdC90YvRhS5cbiAgICpcbiAgICogQHBhcmFtIHZhck5hbWVzIC0g0J/QtdGA0LXRh9C40YHQu9C10L3QuNGPINC40LzQtdC9INC/0LXRgNC10LzQtdC90L3Ri9GFICjRgdGC0YDQvtC60LDQvNC4KS5cbiAgICovXG4gIHB1YmxpYyBjcmVhdGVWYXJpYWJsZXMoLi4udmFyTmFtZXM6IHN0cmluZ1tdKTogdm9pZCB7XG4gICAgdmFyTmFtZXMuZm9yRWFjaCh2YXJOYW1lID0+IHRoaXMuY3JlYXRlVmFyaWFibGUodmFyTmFtZSkpO1xuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0KHQvtC30LTQsNC10YIg0LIg0LPRgNGD0L/Qv9C1INCx0YPRhNC10YDQvtCyIFdlYkdMINC90L7QstGL0Lkg0LHRg9GE0LXRgCDQuCDQt9Cw0L/QuNGB0YvQstCw0LXRgiDQsiDQvdC10LPQviDQv9C10YDQtdC00LDQvdC90YvQtSDQtNCw0L3QvdGL0LUuXG4gICAqXG4gICAqIEByZW1hcmtzXG4gICAqINCa0L7Qu9C40YfQtdGB0YLQstC+INCz0YDRg9C/0L8g0LHRg9GE0LXRgNC+0LIg0Lgg0LrQvtC70LjRh9C10YHRgtCy0L4g0LHRg9GE0LXRgNC+0LIg0LIg0LrQsNC20LTQvtC5INCz0YDRg9C/0L/QtSDQvdC1INC+0LPRgNCw0L3QuNGH0LXQvdGLLiDQmtCw0LbQtNCw0Y8g0LPRgNGD0L/Qv9CwINC40LzQtdC10YIg0YHQstC+0LUg0L3QsNC30LLQsNC90LjQtSDQuFxuICAgKiBHTFNMLdGC0LjQvy4g0KLQuNC/INCz0YDRg9C/0L/RiyDQvtC/0YDQtdC00LXQu9GP0LXRgtGB0Y8g0LDQstGC0L7QvNCw0YLQuNGH0LXRgdC60Lgg0L3QsCDQvtGB0L3QvtCy0LUg0YLQuNC/0LAg0YLQuNC/0LjQt9C40YDQvtCy0LDQvdC90L7Qs9C+INC80LDRgdGB0LjQstCwLiDQn9GA0LDQstC40LvQsCDRgdC+0L7RgtCy0LXRgtGB0YLQstC40Y8g0YLQuNC/0L7QslxuICAgKiDQvtC/0YDQtdC00LXQu9GP0Y7RgtGB0Y8g0L/QtdGA0LXQvNC10L3QvdC+0Lkge0BsaW5rIGdsTnVtYmVyVHlwZXN9LlxuICAgKlxuICAgKiBAcGFyYW0gZHggLSDQk9C+0YDQuNC30L7QvdGC0LDQu9GM0L3Ri9C5INC40L3QtNC10LrRgSDQsdGD0YTQtdGA0L3QvtC5INCz0YDRg9C/0L/Riy5cbiAgICogQHBhcmFtIGR5IC0g0JLQtdGA0YLQuNC60LDQu9GM0L3Ri9C5INC40L3QtNC10LrRgSDQsdGD0YTQtdGA0L3QvtC5INCz0YDRg9C/0L/Riy5cbiAgICogQHBhcmFtIG9ialBhcmFtSW5kZXggLSDQndCw0LfQstCw0L3QuNC1INCz0YDRg9C/0L/RiyDQsdGD0YTQtdGA0L7Qsiwg0LIg0LrQvtGC0L7RgNGD0Y4g0LHRg9C00LXRgiDQtNC+0LHQsNCy0LvQtdC9INC90L7QstGL0Lkg0LHRg9GE0LXRgC5cbiAgICogQHBhcmFtIGRhdGEgLSDQlNCw0L3QvdGL0LUg0LIg0LLQuNC00LUg0YLQuNC/0LjQt9C40YDQvtCy0LDQvdC90L7Qs9C+INC80LDRgdGB0LjQstCwINC00LvRjyDQt9Cw0L/QuNGB0Lgg0LIg0YHQvtC30LTQsNCy0LDQtdC80YvQuSDQsdGD0YTQtdGALlxuICAgKiBAcmV0dXJucyDQntCx0YrQtdC8INC/0LDQvNGP0YLQuCwg0LfQsNC90Y/RgtGL0Lkg0L3QvtCy0YvQvCDQsdGD0YTQtdGA0L7QvCAo0LIg0LHQsNC50YLQsNGFKS5cbiAgICovXG4gIHB1YmxpYyBjcmVhdGVCdWZmZXIoZHg6IG51bWJlciwgZHk6IG51bWJlciwgb2JqUGFyYW1JbmRleDogbnVtYmVyLCBkYXRhOiBUeXBlZEFycmF5KTogbnVtYmVyIHtcblxuICAgIGNvbnN0IGJ1ZmZlciA9IHRoaXMuZ2wuY3JlYXRlQnVmZmVyKCkhXG4gICAgdGhpcy5nbC5iaW5kQnVmZmVyKHRoaXMuZ2wuQVJSQVlfQlVGRkVSLCBidWZmZXIpXG4gICAgdGhpcy5nbC5idWZmZXJEYXRhKHRoaXMuZ2wuQVJSQVlfQlVGRkVSLCBkYXRhLCB0aGlzLmdsLlNUQVRJQ19EUkFXKVxuXG4gICAgdGhpcy5kYXRhW2R4XVtkeV1bb2JqUGFyYW1JbmRleF0gPSBidWZmZXJcblxuICAgIC8qKiDQntC/0YDQtdC00LXQu9C10L3QuNC1INGC0LjQv9CwINC/0LDRgNCw0LzQtdGC0YDQsCDQvtCx0YrQtdC60YLQsCDQv9C+INGC0LjQv9GDINGC0LjQv9C40LfQuNGA0L7QstCw0L3QvdC+0LPQviDQvNCw0YHRgdC40LLQsCDQv9C10YDQtdC00LDQvdC90YvRhSDQtNCw0L3QvdGL0YUuICovXG4gICAgdGhpcy5vYmpQYXJhbVR5cGVbb2JqUGFyYW1JbmRleF0gPSB0aGlzLmdsTnVtYmVyVHlwZXMuZ2V0KGRhdGEuY29uc3RydWN0b3IubmFtZSkhXG5cbiAgICByZXR1cm4gZGF0YS5sZW5ndGggKiBkYXRhLkJZVEVTX1BFUl9FTEVNRU5UXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQn9C10YDQtdC00LDQtdGCINC30L3QsNGH0LXQvdC40LUg0LzQsNGC0YDQuNGG0YsgMyDRhSAzINCyINC/0YDQvtCz0YDQsNC80LzRgyBXZWJHbC5cbiAgICpcbiAgICogQHBhcmFtIHZhck5hbWUgLSDQmNC80Y8g0L/QtdGA0LXQvNC10L3QvdC+0LkgV2ViR0wgKNC40Lcg0LzQsNGB0YHQuNCy0LAge0BsaW5rIHZhcmlhYmxlc30pINCyINC60L7RgtC+0YDRg9GOINCx0YPQtNC10YIg0LfQsNC/0LjRgdCw0L3QviDQv9C10YDQtdC00LDQvdC90L7QtSDQt9C90LDRh9C10L3QuNC1LlxuICAgKiBAcGFyYW0gdmFyVmFsdWUgLSDQo9GB0YLQsNC90LDQstC70LjQstCw0LXQvNC+0LUg0LfQvdCw0YfQtdC90LjQtSDQtNC+0LvQttC90L4g0Y/QstC70Y/RgtGM0YHRjyDQvNCw0YLRgNC40YbQtdC5INCy0LXRidC10YHRgtCy0LXQvdC90YvRhSDRh9C40YHQtdC7INGA0LDQt9C80LXRgNC+0LwgMyDRhSAzLCDRgNCw0LfQstC10YDQvdGD0YLQvtC5XG4gICAqICAgICDQsiDQstC40LTQtSDQvtC00L3QvtC80LXRgNC90L7Qs9C+INC80LDRgdGB0LjQstCwINC40LcgOSDRjdC70LXQvNC10L3RgtC+0LIuXG4gICAqL1xuICBwdWJsaWMgc2V0VmFyaWFibGUodmFyTmFtZTogc3RyaW5nLCB2YXJWYWx1ZTogbnVtYmVyW10pOiB2b2lkIHtcbiAgICB0aGlzLmdsLnVuaWZvcm1NYXRyaXgzZnYodGhpcy52YXJpYWJsZXMuZ2V0KHZhck5hbWUpLCBmYWxzZSwgdmFyVmFsdWUpXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQlNC10LvQsNC10YIg0LHRg9GE0LXRgCBXZWJHbCBcItCw0LrRgtC40LLQvdGL0LxcIi5cbiAgICpcbiAgICogQHBhcmFtIGR4IC0g0JPQvtGA0LjQt9C+0L3RgtCw0LvRjNC90YvQuSDQuNC90LTQtdC60YEg0LHRg9GE0LXRgNC90L7QuSDQs9GA0YPQv9C/0YsuXG4gICAqIEBwYXJhbSBkeSAtINCS0LXRgNGC0LjQutCw0LvRjNC90YvQuSDQuNC90LTQtdC60YEg0LHRg9GE0LXRgNC90L7QuSDQs9GA0YPQv9C/0YsuXG4gICAqIEBwYXJhbSBvYmpQYXJhbUluZGV4IC0g0J3QsNC30LLQsNC90LjQtSDQs9GA0YPQv9C/0Ysg0LHRg9GE0LXRgNC+0LIsINCyINC60L7RgtC+0YDQvtC8INGF0YDQsNC90LjRgtGB0Y8g0L3QtdC+0LHRhdC+0LTQuNC80YvQuSDQsdGD0YTQtdGALlxuICAgKiBAcGFyYW0gdmFyTmFtZSAtINCY0LzRjyDQv9C10YDQtdC80LXQvdC90L7QuSAo0LjQtyDQvNCw0YHRgdC40LLQsCB7QGxpbmsgdmFyaWFibGVzfSksINGBINC60L7RgtC+0YDQvtC5INCx0YPQtNC10YIg0YHQstGP0LfQsNC9INCx0YPRhNC10YAuXG4gICAqIEBwYXJhbSBzaXplIC0g0JrQvtC70LjRh9C10YHRgtCy0L4g0Y3Qu9C10LzQtdC90YLQvtCyINCyINCx0YPRhNC10YDQtSwg0YHQvtC+0YLQstC10YLRgdGC0LLRg9GO0YnQuNGFINC+0LTQvdC+0LkgwqBHTC3QstC10YDRiNC40L3QtS5cbiAgICogQHBhcmFtIHN0cmlkZSAtINCg0LDQt9C80LXRgCDRiNCw0LPQsCDQvtCx0YDQsNCx0L7RgtC60Lgg0Y3Qu9C10LzQtdC90YLQvtCyINCx0YPRhNC10YDQsCAo0LfQvdCw0YfQtdC90LjQtSAwINC30LDQtNCw0LXRgiDRgNCw0LfQvNC10YnQtdC90LjQtSDRjdC70LXQvNC10L3RgtC+0LIg0LTRgNGD0LMg0LfQsCDQtNGA0YPQs9C+0LwpLlxuICAgKiBAcGFyYW0gb2Zmc2V0IC0g0KHQvNC10YnQtdC90LjQtSDQvtGC0L3QvtGB0LjRgtC10LvRjNC90L4g0L3QsNGH0LDQu9CwINCx0YPRhNC10YDQsCwg0L3QsNGH0LjQvdCw0Y8g0YEg0LrQvtGC0L7RgNC+0LPQviDQsdGD0LTQtdGCINC/0YDQvtC40YHRhdC+0LTQuNGC0Ywg0L7QsdGA0LDQsdC+0YLQutCwINGN0LvQtdC80LXQvdGC0L7Qsi5cbiAgICovXG4gIHB1YmxpYyBzZXRCdWZmZXIoZHg6IG51bWJlciwgZHk6IG51bWJlciwgb2JqUGFyYW1JbmRleDogbnVtYmVyLCB2YXJOYW1lOiBzdHJpbmcsIHNpemU6IG51bWJlciwgc3RyaWRlOiBudW1iZXIsIG9mZnNldDogbnVtYmVyKTogdm9pZCB7XG5cbiAgICBjb25zdCB2YXJpYWJsZSA9IHRoaXMudmFyaWFibGVzLmdldCh2YXJOYW1lKVxuXG4gICAgdGhpcy5nbC5iaW5kQnVmZmVyKHRoaXMuZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLmRhdGFbZHhdW2R5XVtvYmpQYXJhbUluZGV4XSlcbiAgICB0aGlzLmdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KHZhcmlhYmxlKVxuICAgIHRoaXMuZ2wudmVydGV4QXR0cmliUG9pbnRlcih2YXJpYWJsZSwgc2l6ZSwgdGhpcy5vYmpQYXJhbVR5cGVbb2JqUGFyYW1JbmRleF0sIGZhbHNlLCBzdHJpZGUsIG9mZnNldClcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCS0YvQv9C+0LvQvdGP0LXRgiDQvtGC0YDQuNGB0L7QstC60YMg0LrQvtC90YLQtdC60YHRgtCwINGA0LXQvdC00LXRgNC40L3Qs9CwIFdlYkdMINC80LXRgtC+0LTQvtC8INC/0YDQuNC80LjRgtC40LLQvdGL0YUg0YLQvtGH0LXQui5cbiAgICpcbiAgICogQHBhcmFtIGZpcnN0IC0g0JjQvdC00LXQutGBIEdMLdCy0LXRgNGI0LjQvdGLLCDRgSDQutC+0YLQvtGA0L7QuSDQvdCw0YfQvdC10YLRjyDQvtGC0YDQuNGB0L7QstC60LAuXG4gICAqIEBwYXJhbSBjb3VudCAtINCa0L7Qu9C40YfQtdGB0YLQstC+INC+0YLRgNC40YHQvtCy0YvQstCw0LXQvNGL0YUgR0wt0LLQtdGA0YjQuNC9LlxuICAgKi9cbiAgcHVibGljIGRyYXdQb2ludHMoZmlyc3Q6IG51bWJlciwgY291bnQ6IG51bWJlcik6IHZvaWQge1xuICAgIHRoaXMuZ2wuZHJhd0FycmF5cyh0aGlzLmdsLlBPSU5UUywgZmlyc3QsIGNvdW50KVxuICB9XG59XG4iLCJpbXBvcnQgeyBjb3B5TWF0Y2hpbmdLZXlWYWx1ZXMsIHNodWZmbGVNYXRyaXggfSBmcm9tICdAL3V0aWxzJ1xuaW1wb3J0IFNQbG90Q29udG9sIGZyb20gJ0Avc3Bsb3QtY29udHJvbCdcbmltcG9ydCBTUGxvdFdlYkdsIGZyb20gJ0Avc3Bsb3Qtd2ViZ2wnXG5pbXBvcnQgU1Bsb3REZWJ1ZyBmcm9tICdAL3NwbG90LWRlYnVnJ1xuaW1wb3J0IFNQbG90RGVtbyBmcm9tICdAL3NwbG90LWRlbW8nXG5pbXBvcnQgU1Bsb3RHbHNsIGZyb20gJ0Avc3Bsb3QtZ2xzbCdcblxuLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqXG4gKiDQmtC70LDRgdGBIFNQbG90IC0g0YDQtdCw0LvQuNC30YPQtdGCINCz0YDQsNGE0LjQuiDRgtC40L/QsCDRgdC60LDRgtGC0LXRgNC/0LvQvtGCINGB0YDQtdC00YHRgtCy0LDQvNC4IFdlYkdMLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTUGxvdCB7XG5cbiAgLyoqINCk0YPQvdC60YbQuNGPINC40YLQtdGA0LjRgNC+0LLQsNC90LjRjyDQuNGB0YXQvtC00L3Ri9GFINC00LDQvdC90YvRhS4gKi9cbiAgcHVibGljIGl0ZXJhdG9yOiBTUGxvdEl0ZXJhdG9yID0gdW5kZWZpbmVkXG5cbiAgLyoqINCU0LDQvdC90YvQtSDQvtCxINC+0LHRitC10LrRgtCw0YUg0LPRgNCw0YTQuNC60LAuICovXG4gIHB1YmxpYyBkYXRhOiBTUGxvdE9iamVjdFtdIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkXG5cbiAgLyoqINCl0LXQu9C/0LXRgCDRgNC10LbQuNC80LAg0L7RgtC70LDQtNC60LguICovXG4gIHB1YmxpYyBkZWJ1ZzogU1Bsb3REZWJ1ZyA9IG5ldyBTUGxvdERlYnVnKHRoaXMpXG5cbiAgLyoqINCl0LXQu9C/0LXRgCwg0YPQv9GA0LDQstC70Y/RjtGJ0LjQuSBHTFNMLdC60L7QtNC+0Lwg0YjQtdC50LTQtdGA0L7Qsi4gKi9cbiAgcHVibGljIGdsc2w6IFNQbG90R2xzbCA9IG5ldyBTUGxvdEdsc2wodGhpcylcblxuICAvKiog0KXQtdC70L/QtdGAIFdlYkdMLiAqL1xuICBwdWJsaWMgd2ViZ2w6IFNQbG90V2ViR2wgPSBuZXcgU1Bsb3RXZWJHbCh0aGlzKVxuXG4gIC8qKiDQpdC10LvQv9C10YAg0YDQtdC20LjQvNCwINC00LXQvNC+LdC00LDQvdC90YvRhS4gKi9cbiAgcHVibGljIGRlbW86IFNQbG90RGVtbyA9IG5ldyBTUGxvdERlbW8odGhpcylcblxuICAvKiog0J/RgNC40LfQvdCw0Log0YTQvtGA0YHQuNGA0L7QstCw0L3QvdC+0LPQviDQt9Cw0L/Rg9GB0LrQsCDRgNC10L3QtNC10YDQsC4gKi9cbiAgcHVibGljIGZvcmNlUnVuOiBib29sZWFuID0gZmFsc2VcblxuICAvKiog0J7Qs9GA0LDQvdC40YfQtdC90LjQtSDQutC+0Lst0LLQsCDQvtCx0YrQtdC60YLQvtCyINC90LAg0LPRgNCw0YTQuNC60LUuICovXG4gIHB1YmxpYyBnbG9iYWxMaW1pdDogbnVtYmVyID0gMV8wMDBfMDAwXzAwMFxuXG4gIC8qKiDQptCy0LXRgtC+0LLQsNGPINC/0LDQu9C40YLRgNCwINC+0LHRitC10LrRgtC+0LIuICovXG4gIHB1YmxpYyBjb2xvcnM6IHN0cmluZ1tdID0gW11cblxuICAvKiog0J/QsNGA0LDQvNC10YLRgNGLINC60L7QvtGA0LTQuNC90LDRgtC90L7QuSDQv9C70L7RgdC60L7RgdGC0LguICovXG4gIHB1YmxpYyBncmlkOiBTUGxvdEdyaWQgPSB7XG4gICAgYmdDb2xvcjogJyNmZmZmZmYnLFxuICAgIGd1aWRlQ29sb3I6ICcjYzBjMGMwJ1xuICB9XG5cbiAgLyoqINCf0LDRgNCw0LzQtdGC0YDRiyDQvtCx0LvQsNGB0YLQuCDQv9GA0L7RgdC80L7RgtGA0LAuICovXG4gIHB1YmxpYyBjYW1lcmE6IFNQbG90Q2FtZXJhID0ge1xuICAgIHg6IDAsXG4gICAgeTogMCxcbiAgICB6b29tOiAxLFxuICAgIG1pblpvb206IDEsXG4gICAgbWF4Wm9vbTogMTBfMDAwXzAwMFxuICB9XG5cbiAgLyoqINCf0YDQuNC30L3QsNC6INC90LXQvtCx0YXQvtC00LjQvNC+0YHRgtC4INC30LDQs9GA0YPQt9C60Lgg0LTQsNC90L3Ri9GFINC+0LEg0L7QsdGK0LXQutGC0LDRhS4gKi9cbiAgcHVibGljIGxvYWREYXRhOiBib29sZWFuID0gdHJ1ZVxuXG4gIC8qKiDQn9GA0LjQt9C90LDQuiDQvdC10L7QsdGF0L7QtNC40LzQvtGB0YLQuCDQsdC10LfQvtGC0LvQsNCz0LDRgtC10LvRjNC90L7Qs9C+INC30LDQv9GD0YHQutCwINGA0LXQvdC00LXRgNCwLiAqL1xuICBwdWJsaWMgaXNSdW5uaW5nOiBib29sZWFuID0gZmFsc2VcblxuICAvKiog0JrQvtC70LjRh9C10YHRgtCy0L4g0YDQsNC30LvQuNGH0L3Ri9GFINGE0L7RgNC8INC+0LHRitC10LrRgtC+0LIuINCS0YvRh9C40YHQu9GP0LXRgtGB0Y8g0L/QvtC30LbQtSDQsiDRhdC10LvQv9C10YDQtSBnbHNsLiAqL1xuICBwdWJsaWMgc2hhcGVzQ291bnQ6IG51bWJlciB8IHVuZGVmaW5lZFxuXG4gIC8qKiDQodGC0LDRgtC40YHRgtC40YfQtdGB0LrQsNGPINC40L3RhNC+0YDQvNCw0YbQuNGPLiAqL1xuICBwdWJsaWMgc3RhdHMgPSB7XG4gICAgb2JqVG90YWxDb3VudDogMCxcbiAgICBncm91cHNDb3VudDogMCxcbiAgICBtZW1Vc2FnZTogMCxcbiAgICBtaW5PYmplY3RTaXplOiAxXzAwMF8wMDAsICAvLyDQl9C90LDRh9C10L3QuNC1INC30LDQstC10LTQvtC80L4g0L/RgNC10LLRi9GI0LDRjtGJ0LXQtSDQu9GO0LHQvtC5INGA0LDQt9C80LXRgCDQvtCx0YrQtdC60YLQsC5cbiAgICBtYXhPYmplY3RTaXplOiAwLCAgICAgICAgICAvLyDQl9C90LDRh9C10L3QuNC1INC30LDQstC10LTQvtC80L4g0LzQtdC90YzRiNC1INC70Y7QsdC+0LPQviDQvtCx0YrQtdC60YLQsC5cbiAgfVxuXG4gIC8qKiDQntCx0YrQtdC60YIt0LrQsNC90LLQsNGBINC60L7QvdGC0LXQutGB0YLQsCDRgNC10L3QtNC10YDQuNC90LPQsCBXZWJHTC4gKi9cbiAgcHVibGljIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnRcblxuICAvKiog0J3QsNGB0YLRgNC+0LnQutC4LCDQt9Cw0L/RgNC+0YjQtdC90L3Ri9C1INC/0L7Qu9GM0LfQvtCy0LDRgtC10LvQtdC8INCyINC60L7QvdGB0YLRgNGD0LrRgtC+0YDQtSDQuNC70Lgg0L/RgNC4INC/0L7RgdC70LXQtNC90LXQvCDQstGL0LfQvtCy0LUgc2V0dXAuICovXG4gIHB1YmxpYyBsYXN0UmVxdWVzdGVkT3B0aW9uczogU1Bsb3RPcHRpb25zIHwgdW5kZWZpbmVkID0ge31cblxuICAvKiog0KXQtdC70L/QtdGAINCy0LfQsNC40LzQvtC00LXQudGB0YLQstC40Y8g0YEg0YPRgdGC0YDQvtC50YHRgtCy0L7QvCDQstCy0L7QtNCwLiAqL1xuICBwcm90ZWN0ZWQgY29udHJvbDogU1Bsb3RDb250b2wgPSBuZXcgU1Bsb3RDb250b2wodGhpcylcblxuICAvKiog0J/RgNC40LfQvdCw0Log0YLQvtCz0L4sINGH0YLQviDRjdC60LfQtdC80L/Qu9GP0YAg0LrQu9Cw0YHRgdCwINCx0YvQuyDQutC+0YDRgNC10LrRgtC90L4g0L/QvtC00LPQvtGC0L7QstC70LXQvSDQuiDRgNC10L3QtNC10YDRgy4gKi9cbiAgcHJpdmF0ZSBpc1NldHVwZWQ6IGJvb2xlYW4gPSBmYWxzZVxuXG4gIC8qKiDQn9C10YDQtdC80LXQvdC90LDRjyDQtNC70Y8g0L/QtdGA0LXQsdC+0YDQsCDQuNC90LTQtdC60YHQvtCyINC80LDRgdGB0LjQstCwINC00LDQvdC90YvRhSBkYXRhLiAqL1xuICBwcml2YXRlIGFycmF5SW5kZXg6IG51bWJlciA9IDBcblxuICAvKiog0JjQvdGE0L7RgNC80LDRhtC40Y8g0L4g0LPRgNGD0L/Qv9C40YDQvtCy0LrQtSDQuCDQvtCx0LvQsNGB0YLQuCDQstC40LTQuNC80L7RgdGC0Lgg0LTQsNC90L3Ri9GFLiAqL1xuICBwdWJsaWMgYXJlYSA9IHtcbiAgICBncm91cHM6IFtdIGFzIGFueVtdLCAgLy8g0JPRgNGD0L/Qv9C+0LLQsNGPINC80LDRgtGA0LjRhtCwLlxuICAgIHN0ZXA6IDAuMDIsICAgICAgICAgICAvLyDQlNC10LvQuNGC0LXQu9GMINCz0YDQsNGE0LjQutCwLlxuICAgIGNvdW50OiAwLCAgICAgICAgICAgICAvLyDQmtC+0LvQuNGH0LXRgdGC0LLQviDRh9Cw0YHRgtC10Lkg0LPRgNCw0YTQuNC60LAg0L/QviDQutCw0LbQtNC+0Lkg0YDQsNC30LzQtdGA0L3QvtGB0YLQuC5cbiAgICBkeFZpc2libGVGcm9tOiAwLCAgICAgLy8g0J7Qs9GA0LDQvdC40YfQuNGC0LXQu9C4INCy0LjQtNC40LzQvtC5INC+0LHQu9Cw0YHRgtC4INCz0YDRg9C/0L/QvtCy0L7QuSDQvNCw0YLRgNC40YbRiy5cbiAgICBkeFZpc2libGVUbzogMCxcbiAgICBkeVZpc2libGVGcm9tOiAwLFxuICAgIGR5VmlzaWJsZVRvOiAwLFxuICAgIHNodWZmbGVkSW5kaWNlczogW10gYXMgYW55W10sICAvLyDQn9C10YDQtdC80LXRiNCw0L3QvdGL0LUg0LjQvdC00LXQutGB0Ysg0LPRgNGD0L/Qv9C+0LLQvtC5INC80LDRgtGA0LjRhtGLLlxuICAgIG9ialBhcmFtQ291bnQ6IDQsICAgICAgICAgICAgICAvLyDQmtC+0LvQuNGH0LXRgdGC0LLQviDQv9Cw0YDQsNC80LXRgtGA0L7QsiDQvtCx0YrQtdC60YLQsCAo0LrQvtC+0YDQtNC40L3QsNGC0YssINGE0L7RgNC80LAsINGA0LDQt9C80LXRgCwg0YbQstC10YIg0Lgg0YIu0L8uKS5cbiAgICBvYmpTaWduUGFyYW1JbmRleDogMSAgICAgICAgICAgLy8g0JjQvdC00LXQutGBINGC0L7Qs9C+INC/0LDRgNCw0LzQtdGC0YDQsCwg0YMg0LrQvtGC0L7RgNC+0LPQviDQvdCwINC+0LTQuNC9INC+0LHRitC10LrRgiDQv9GA0LjRhdC+0LTQuNGC0YHRjyDQvtC00L3QviDQt9C90LDRh9C10L3QuNC1LlxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0KHQvtC30LTQsNC10YIg0Y3QutC30LXQvNC/0LvRj9GAINC60LvQsNGB0YHQsCwg0LjQvdC40YbQuNCw0LvQuNC30LjRgNGD0LXRgiDQvdCw0YHRgtGA0L7QudC60LggKNC10YHQu9C4INC/0LXRgNC10LTQsNC90YspLlxuICAgKlxuICAgKiBAcmVtYXJrc1xuICAgKiDQldGB0LvQuCDQutCw0L3QstCw0YEg0YEg0LfQsNC00LDQvdC90YvQvCDQuNC00LXQvdGC0LjRhNC40LrQsNGC0L7RgNC+0Lwg0L3QtSDQvdCw0LnQtNC10L0gLSDQs9C10L3QtdGA0LjRgNGD0LXRgtGB0Y8g0L7RiNC40LHQutCwLiDQndCw0YHRgtGA0L7QudC60Lgg0LzQvtCz0YPRgiDQsdGL0YLRjCDQt9Cw0LTQsNC90Ysg0LrQsNC6INCyXG4gICAqINC60L7QvdGB0YLRgNGD0LrRgtC+0YDQtSwg0YLQsNC6INC4INCyINC80LXRgtC+0LTQtSB7QGxpbmsgc2V0dXB9LiDQkiDQu9GO0LHQvtC8INGB0LvRg9GH0LDQtSDQvdCw0YHRgtGA0L7QudC60Lgg0LTQvtC70LbQvdGLINCx0YvRgtGMINC30LDQtNCw0L3RiyDQtNC+INC30LDQv9GD0YHQutCwINGA0LXQvdC00LXRgNCwLlxuICAgKlxuICAgKiBAcGFyYW0gY2FudmFzSWQgLSDQmNC00LXQvdGC0LjRhNC40LrQsNGC0L7RgCDQutCw0L3QstCw0YHQsCwg0L3QsCDQutC+0YLQvtGA0L7QvCDQsdGD0LTQtdGCINGA0LjRgdC+0LLQsNGC0YzRgdGPINCz0YDQsNGE0LjQui5cbiAgICogQHBhcmFtIG9wdGlvbnMgLSDQn9C+0LvRjNC30L7QstCw0YLQtdC70YzRgdC60LjQtSDQvdCw0YHRgtGA0L7QudC60Lgg0Y3QutC30LXQvNC/0LvRj9GA0LAuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihjYW52YXNJZDogc3RyaW5nLCBvcHRpb25zPzogU1Bsb3RPcHRpb25zKSB7XG5cbiAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY2FudmFzSWQpKSB7XG4gICAgICB0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNhbnZhc0lkKSBhcyBIVE1MQ2FudmFzRWxlbWVudFxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ9Ca0LDQvdCy0LDRgSDRgSDQuNC00LXQvdGC0LjRhNC40LrQsNGC0L7RgNC+0LwgXCIjJyArIGNhbnZhc0lkICsgJ1wiINC90LUg0L3QsNC50LTQtdC9IScpXG4gICAgfVxuXG4gICAgLyoqINCS0YvRh9C40YHQu9C10L3QuNC1INGA0LDQt9C80LXRgNC90L7RgdGC0Lgg0LPRgNGD0L/Qv9C+0LLQvtC5INC80LDRgtGA0LjRhtGLICjQutC+0Lst0LLQviDRh9Cw0YHRgtC10Lkg0LPRgNCw0YTQuNC60LAg0L/QviDQutCw0LbQtNC+0Lkg0YDQsNC30LzQtdGA0L3QvtGB0YLQuCkuICovXG4gICAgdGhpcy5hcmVhLmNvdW50ID0gTWF0aC50cnVuYygxIC8gdGhpcy5hcmVhLnN0ZXApICsgMVxuXG4gICAgaWYgKG9wdGlvbnMpIHtcblxuICAgICAgLyoqINCV0YHQu9C4INC/0LXRgNC10LTQsNC90Ysg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GM0YHQutC40LUg0L3QsNGB0YLRgNC+0LnQutC4LCDRgtC+INC+0L3QuCDQv9GA0LjQvNC10L3Rj9GO0YLRgdGPLiAqL1xuICAgICAgY29weU1hdGNoaW5nS2V5VmFsdWVzKHRoaXMsIG9wdGlvbnMpXG4gICAgICB0aGlzLmxhc3RSZXF1ZXN0ZWRPcHRpb25zID0gb3B0aW9uc1xuXG4gICAgICAvKiog0JjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y8g0LLRgdC10YUg0L/QsNGA0LDQvNC10YLRgNC+0LIg0YDQtdC90LTQtdGA0LAsINC10YHQu9C4INC30LDQv9GA0L7RiNC10L0g0YTQvtGA0YHQuNGA0L7QstCw0L3QvdGL0Lkg0LfQsNC/0YPRgdC6LiAqL1xuICAgICAgaWYgKHRoaXMuZm9yY2VSdW4pIHtcbiAgICAgICAgdGhpcy5zZXR1cChvcHRpb25zKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCY0L3QuNGG0LjQsNC70LjQt9C40YDRg9C10YIg0L3QtdC+0LHRhdC+0LTQuNC80YvQtSDQtNC70Y8g0YDQtdC90LTQtdGA0LAg0L/QsNGA0LDQvNC10YLRgNGLINGN0LrQt9C10LzQv9C70Y/RgNCwLCDQstGL0L/QvtC70L3Rj9C10YIg0L/QvtC00LPQvtGC0L7QstC60YMg0Lgg0LfQsNC/0L7Qu9C90LXQvdC40LUg0LHRg9GE0LXRgNC+0LIgV2ViR0wuXG4gICAqXG4gICAqIEBwYXJhbSBvcHRpb25zIC0g0J3QsNGB0YLRgNC+0LnQutC4INGN0LrQt9C10LzQv9C70Y/RgNCwLlxuICAgKi9cbiAgcHVibGljIHNldHVwKG9wdGlvbnM/OiBTUGxvdE9wdGlvbnMpOiB2b2lkIHtcblxuICAgIGlmICghb3B0aW9ucykgb3B0aW9ucyA9IHt9XG5cbiAgICAvKiog0J/RgNC40LzQtdC90LXQvdC40LUg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GM0YHQutC40YUg0L3QsNGB0YLRgNC+0LXQui4gKi9cbiAgICBjb3B5TWF0Y2hpbmdLZXlWYWx1ZXModGhpcywgb3B0aW9ucylcbiAgICB0aGlzLmxhc3RSZXF1ZXN0ZWRPcHRpb25zID0gb3B0aW9uc1xuXG4gICAgdGhpcy5kZWJ1Zy5sb2coJ2ludHJvJylcblxuICAgIC8qKiDQldGB0LvQuCDQv9GA0LXQtNC+0YHRgtCw0LLQu9C10L0g0LzQsNGB0YHQuNCyINGBINC00LDQvdC90YvQvNC4INC+0LEg0L7QsdGK0LXQutGC0LDRhSwg0YLQviDRg9GB0YLQsNC90LDQstC70LjQstCw0LXRgtGB0Y8g0LjRgtC10YDQsNGC0L7RgCDQv9C10YDQtdCx0L7RgNCwINC80LDRgdGB0LjQstCwLiAqL1xuICAgIGlmIChvcHRpb25zLmRhdGEpIHtcbiAgICAgIHRoaXMuaXRlcmF0b3IgPSB0aGlzLmFycmF5SXRlcmF0b3JcbiAgICAgIHRoaXMuYXJyYXlJbmRleCA9IDBcbiAgICB9XG5cbiAgICAvKiog0J/QvtC00LPQvtGC0L7QstC60LAg0LLRgdC10YUg0YXQtdC70L/QtdGA0L7Qsi4g0J/QvtGB0LvQtdC00L7QstCw0YLQtdC70YzQvdC+0YHRgtGMINC/0L7QtNCz0L7RgtC+0LLQutC4INC40LzQtdC10YIg0LfQvdCw0YfQtdC90LjQtS4gKi9cbiAgICB0aGlzLmRlYnVnLnNldHVwKClcbiAgICB0aGlzLmdsc2wuc2V0dXAoKVxuICAgIHRoaXMud2ViZ2wuc2V0dXAoKVxuICAgIHRoaXMuY29udHJvbC5zZXR1cCgpXG4gICAgdGhpcy5kZW1vLnNldHVwKClcblxuICAgIHRoaXMuZGVidWcubG9nKCdpbnN0YW5jZScpXG5cbiAgICAvKiog0J7QsdGA0LDQsdC+0YLQutCwINCy0YHQtdGFINC00LDQvdC90YvRhSDQvtCxINC+0LHRitC10LrRgtCw0YUg0Lgg0LjRhSDQt9Cw0LPRgNGD0LfQutCwINCyINCx0YPRhNC10YDRiyDQstC40LTQtdC+0L/QsNC80Y/RgtC4LiAqL1xuICAgIGlmICh0aGlzLmxvYWREYXRhKSB7XG4gICAgICB0aGlzLmxvYWQoKVxuXG4gICAgICAvKiog0J/QviDRg9C80L7Qu9GH0LDQvdC40Y4g0L/RgNC4INC/0L7QstGC0L7RgNC90L7QvCDQstGL0LfQvtCy0LUg0LzQtdGC0L7QtNCwIHNldHVwINC90L7QstC+0LUg0YfRgtC10L3QuNC1INC+0LHRitC10LrRgtC+0LIg0L3QtSDQv9GA0L7QuNC30LLQvtC00LjRgtGB0Y8uICovXG4gICAgICB0aGlzLmxvYWREYXRhID0gZmFsc2VcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDQldGB0LvQuCDQvdCw0YfQsNC70YzQvdC+0LUg0L/QvtC70L7QttC10L3QuNC1INC+0LHQu9Cw0YHRgtC4INCy0LjQtNC40LzQvtGB0YLQuCDQuCDQt9GD0LzQuNGA0L7QstCw0L3QuNC1INC90LUg0LHRi9C70Lgg0LfQsNC00LDQvdGLINGP0LLQvdC+LCDRgtC+INGN0YLQuCDQv9Cw0YDQsNC80LXRgtGA0Ysg0YPRgdGC0LDQvdCw0LLQu9C40LLQsNC10YLRgdGPXG4gICAgICog0YLQsNC60LjQvCDQvtCx0YDQsNC30L7QvCwg0YfRgtC+0LHRiyDQv9GA0Lgg0L/QtdGA0LLQvtC8INC+0YLQvtCx0YDQsNC20LXQvdC40Lgg0L7QsdC70LDRgdGC0Ywg0LLQuNC00LjQvNC+0YHRgtC4INCx0YvQu9CwINCyINGG0LXQvdGC0YDQtSDQs9GA0LDRhNC40LrQsCDQuCDQstC60LvRjtGH0LDQu9CwINCyINGB0LXQsdGPINCy0YHQtVxuICAgICAqINC+0LHRitC10LrRgtGLLlxuICAgICAqL1xuICAgIGlmICghKCdjYW1lcmEnIGluIHRoaXMubGFzdFJlcXVlc3RlZE9wdGlvbnMpKSB7XG4gICAgICB0aGlzLmNhbWVyYS56b29tID0gTWF0aC5taW4odGhpcy5jYW52YXMud2lkdGgsIHRoaXMuY2FudmFzLmhlaWdodCkgLSB0aGlzLnN0YXRzLm1heE9iamVjdFNpemVcbiAgICAgIHRoaXMuY2FtZXJhLnggPSAwLjUgLSB0aGlzLmNhbnZhcy53aWR0aCAvICgyICogdGhpcy5jYW1lcmEuem9vbSlcbiAgICAgIHRoaXMuY2FtZXJhLnkgPSAwLjVcbiAgICB9XG5cbiAgICAvKiog0JTQtdC50YHRgtCy0LjRjywg0LrQvtGC0L7RgNGL0LUg0LLRi9C/0L7Qu9C90Y/RjtGC0YHRjyDRgtC+0LvRjNC60L4g0L/RgNC4INC/0LXRgNCy0L7QvCDQstGL0LfQvtCy0LUg0LzQtdGC0L7QtNCwIHNldHVwLiAqL1xuICAgIGlmICghdGhpcy5pc1NldHVwZWQpIHtcblxuICAgICAgLyoqINCh0L7Qt9C00LDQvdC40LUg0L/QtdGA0LXQvNC10L3QvdGL0YUgV2ViR2wuICovXG4gICAgICB0aGlzLndlYmdsLmNyZWF0ZVZhcmlhYmxlcygnYV9wb3NpdGlvbicsICdhX2NvbG9yJywgJ2Ffc2l6ZScsICdhX3NoYXBlJywgJ3VfbWF0cml4JylcblxuICAgICAgLyoqINCf0YDQuNC30L3QsNC6INGC0L7Qs9C+LCDRh9GC0L4g0Y3QutC30LXQvNC/0LvRj9GAINC60LDQuiDQvNC40L3QuNC80YPQvCDQvtC00LjQvSDRgNCw0Lcg0LLRi9C/0L7Qu9C90LjQuyDQvNC10YLQvtC0IHNldHVwLiAqL1xuICAgICAgdGhpcy5pc1NldHVwZWQgPSB0cnVlXG4gICAgfVxuXG4gICAgLyoqINCf0YDQvtCy0LXRgNC60LAg0LrQvtGA0YDQtdC60YLQvdC+0YHRgtC4INC90LDRgdGC0YDQvtC50LrQuCDRjdC60LfQtdC80L/Qu9GP0YDQsC4gKi9cbiAgICB0aGlzLmNoZWNrU2V0dXAoKVxuXG4gICAgaWYgKHRoaXMuZm9yY2VSdW4pIHtcbiAgICAgIC8qKiDQpNC+0YDRgdC40YDQvtCy0LDQvdC90YvQuSDQt9Cw0L/Rg9GB0Log0YDQtdC90LTQtdGA0LjQvdCz0LAgKNC10YHQu9C4INGC0YDQtdCx0YPQtdGC0YHRjykuICovXG4gICAgICB0aGlzLnJ1bigpXG4gICAgfVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0KHQvtC30LTQsNC10YIg0Lgg0LfQsNC/0L7Qu9C90Y/QtdGCINC00LDQvdC90YvQvNC4INC+0LHQviDQstGB0LXRhSDQvtCx0YrQtdC60YLQsNGFINCx0YPRhNC10YDRiyBXZWJHTC5cbiAgICovXG4gIHByb3RlY3RlZCBsb2FkKCk6IHZvaWQge1xuXG4gICAgdGhpcy5kZWJ1Zy5sb2coJ2xvYWRpbmcnKVxuXG4gICAgLyoqINCf0YDQuCDQutCw0LbQtNC+0Lwg0L7QsdC90L7QstC70LXQvdC40Lgg0LTQsNC90L3Ri9GFINC+0LEg0L7QsdGK0LXQutGC0LDRhSDRgdGC0LDRgtC40YHRgtC40LrQsCDRgdCx0YDQsNGB0YvQstCw0LXRgtGB0Y8uICovXG4gICAgdGhpcy5zdGF0cyA9IHsgb2JqVG90YWxDb3VudDogMCwgZ3JvdXBzQ291bnQ6IDAsIG1lbVVzYWdlOiAwLCBtaW5PYmplY3RTaXplOiAxXzAwMF8wMDAsIG1heE9iamVjdFNpemU6IDAgfVxuXG4gICAgbGV0IGR4LCBkeSA9IDBcbiAgICBsZXQgZ3JvdXBzOiBhbnlbXSA9IFtdXG4gICAgbGV0IG9iamVjdDogU1Bsb3RPYmplY3QgfCBudWxsXG4gICAgbGV0IGlzT2JqZWN0RW5kczogYm9vbGVhbiA9IGZhbHNlXG5cbiAgICAvKiog0J/QvtC00LPQvtGC0L7QstC60LAg0LPRgNGD0L/Qv9C40YDQvtCy0L7Rh9C90L7QuSDQvNCw0YLRgNC40YbRiyDQuCDQvNCw0YLRgNC40YbRiyDRgdC70YPRh9Cw0LnQvdGL0YUg0LjQvdC00LXQutGB0L7Qsi4gKi9cbiAgICBmb3IgKGxldCBkeCA9IDA7IGR4IDwgdGhpcy5hcmVhLmNvdW50OyBkeCsrKSB7XG4gICAgICBncm91cHNbZHhdID0gW11cbiAgICAgIHRoaXMuYXJlYS5zaHVmZmxlZEluZGljZXNbZHhdID0gW11cbiAgICAgIGZvciAobGV0IGR5ID0gMDsgZHkgPCB0aGlzLmFyZWEuY291bnQ7IGR5KyspIHtcbiAgICAgICAgZ3JvdXBzW2R4XVtkeV0gPSBbXVxuICAgICAgICB0aGlzLmFyZWEuc2h1ZmZsZWRJbmRpY2VzW2R4XVtkeV0gPSBbZHgsIGR5XVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYXJlYS5vYmpQYXJhbUNvdW50OyBpKyspIHsgZ3JvdXBzW2R4XVtkeV1baV0gPSBbXSB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqINCf0LXRgNC10LzQtdGI0LjQstCw0L3QuNC1INC80LDRgtGA0LjRhtGLINGB0LvRg9GH0LDQudC90YvRhSDQuNC90LTQtdC60YHQvtCyLiAqL1xuICAgIHNodWZmbGVNYXRyaXgodGhpcy5hcmVhLnNodWZmbGVkSW5kaWNlcylcblxuICAgIC8qKiDQptC40LrQuyDRh9GC0LXQvdC40Y8g0Lgg0L/QvtC00LPQvtGC0L7QstC60Lgg0LTQsNC90L3Ri9GFINC+0LEg0L7QsdGK0LXQutGC0LDRhS4gKi9cbiAgICB3aGlsZSAoIWlzT2JqZWN0RW5kcykge1xuXG4gICAgICAvKiog0J/QvtC70YPRh9C10L3QuNC1INC00LDQvdC90YvRhSDQvtCxINC+0YfQtdGA0LXQtNC90L7QvCDQvtCx0YrQtdC60YLQtS4gKi9cbiAgICAgIG9iamVjdCA9IHRoaXMuaXRlcmF0b3IhKClcblxuICAgICAgLyoqINCe0LHRitC10LrRgtGLINC30LDQutC+0L3Rh9C40LvQuNGB0YwsINC10YHQu9C4INC40YLQtdGA0LDRgtC+0YAg0LLQtdGA0L3Rg9C7IG51bGwg0LjQu9C4INC10YHQu9C4INC00L7RgdGC0LjQs9C90YPRgiDQu9C40LzQuNGCINGH0LjRgdC70LAg0L7QsdGK0LXQutGC0L7Qsi4gKi9cbiAgICAgIGlzT2JqZWN0RW5kcyA9IChvYmplY3QgPT09IG51bGwpIHx8ICh0aGlzLnN0YXRzLm9ialRvdGFsQ291bnQgPj0gdGhpcy5nbG9iYWxMaW1pdClcblxuICAgICAgaWYgKCFpc09iamVjdEVuZHMpIHtcblxuICAgICAgICAvKiog0J/RgNC+0LLQtdGA0LrQsCDQutC+0YDRgNC10LrRgtC90L7RgdGC0Lgg0Lgg0L/QvtC00LPQvtGC0L7QstC60LAg0LTQsNC90L3Ri9GFINC+0LHRitC10LrRgtCwLiAqL1xuICAgICAgICBvYmplY3QgPSB0aGlzLmNoZWNrT2JqZWN0KG9iamVjdCEpXG5cbiAgICAgICAgLyoqINCS0YvRh9C40YHQu9C10L3QuNC1INCz0YDRg9C/0L/Riywg0LIg0LrQvtGC0L7RgNGD0Y4g0LfQsNC/0LjRiNC10YLRgdGPINC+0LHRitC10LrRgi4gKi9cbiAgICAgICAgZHggPSBNYXRoLnRydW5jKG9iamVjdC54IC8gdGhpcy5hcmVhLnN0ZXApXG4gICAgICAgIGR5ID0gTWF0aC50cnVuYyhvYmplY3QueSAvIHRoaXMuYXJlYS5zdGVwKVxuXG4gICAgICAgIC8qKiDQl9Cw0L/QuNGB0Ywg0L7QsdGK0LXQutGC0LAuICovXG4gICAgICAgIGdyb3Vwc1tkeF1bZHldWzBdLnB1c2gob2JqZWN0LngsIG9iamVjdC55KVxuICAgICAgICBncm91cHNbZHhdW2R5XVsxXS5wdXNoKG9iamVjdC5zaGFwZSlcbiAgICAgICAgZ3JvdXBzW2R4XVtkeV1bMl0ucHVzaChvYmplY3QuY29sb3IpXG4gICAgICAgIGdyb3Vwc1tkeF1bZHldWzNdLnB1c2gob2JqZWN0LnNpemUpXG5cbiAgICAgICAgLyoqINCd0LDRhdC+0LbQtNC10L3QuNC1INC80LjQvdC40LzQsNC70YzQvdC+0LPQviDQuCDQvNCw0LrRgdC40LzQsNC70YzQvdC+0LPQviDRgNCw0LfQvNC10YDQvtCyINC+0LHRitC10LrRgtC+0LIuICovXG4gICAgICAgIGlmIChvYmplY3Quc2l6ZSA+IHRoaXMuc3RhdHMubWF4T2JqZWN0U2l6ZSkgeyB0aGlzLnN0YXRzLm1heE9iamVjdFNpemUgPSBvYmplY3Quc2l6ZSB9XG4gICAgICAgIGlmIChvYmplY3Quc2l6ZSA8IHRoaXMuc3RhdHMubWluT2JqZWN0U2l6ZSkgeyB0aGlzLnN0YXRzLm1pbk9iamVjdFNpemUgPSBvYmplY3Quc2l6ZSB9XG5cbiAgICAgICAgdGhpcy5zdGF0cy5vYmpUb3RhbENvdW50KytcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmFyZWEuZ3JvdXBzID0gZ3JvdXBzXG5cbiAgICAvKiog0KbQuNC60Lsg0LrQvtC/0LjRgNC+0LLQsNC90LjRjyDQtNCw0L3QvdGL0YUg0LIg0LLQuNC00LXQvtC/0LDQvNGP0YLRjC4gKi9cbiAgICBmb3IgKGxldCBkeCA9IDA7IGR4IDwgdGhpcy5hcmVhLmNvdW50OyBkeCsrKSB7XG4gICAgICBmb3IgKGxldCBkeSA9IDA7IGR5IDwgdGhpcy5hcmVhLmNvdW50OyBkeSsrKSB7XG4gICAgICAgIGlmIChncm91cHNbZHhdW2R5XVt0aGlzLmFyZWEub2JqU2lnblBhcmFtSW5kZXhdLmxlbmd0aCA+IDApIHtcblxuICAgICAgICAgIC8qKiDQodC+0LfQtNCw0L3QuNC1INCy0LjQtNC10L7QsdGD0YTQtdGA0L7Qsiwg0YHQvtCy0LzQtdGJ0LXQvdC90L7QtSDRgSDQv9C+0LTRgdGH0LXRgtC+0Lwg0LfQsNC90LjQvNCw0LXQvNC+0Lkg0LjQvNC4INC/0LDQvNGP0YLQuC4gKi9cbiAgICAgICAgICB0aGlzLnN0YXRzLm1lbVVzYWdlICs9XG4gICAgICAgICAgICB0aGlzLndlYmdsLmNyZWF0ZUJ1ZmZlcihkeCwgZHksIDAsIG5ldyBGbG9hdDMyQXJyYXkoZ3JvdXBzW2R4XVtkeV1bMF0pKSArXG4gICAgICAgICAgICB0aGlzLndlYmdsLmNyZWF0ZUJ1ZmZlcihkeCwgZHksIDEsIG5ldyBVaW50OEFycmF5KGdyb3Vwc1tkeF1bZHldWzFdKSkgK1xuICAgICAgICAgICAgdGhpcy53ZWJnbC5jcmVhdGVCdWZmZXIoZHgsIGR5LCAyLCBuZXcgVWludDhBcnJheShncm91cHNbZHhdW2R5XVsyXSkpICtcbiAgICAgICAgICAgIHRoaXMud2ViZ2wuY3JlYXRlQnVmZmVyKGR4LCBkeSwgMywgbmV3IFVpbnQ4QXJyYXkoZ3JvdXBzW2R4XVtkeV1bM10pKVxuXG4gICAgICAgICAgLyoqINCa0L7Qu9C40YfQtdGB0YLQstC+INGB0L7Qt9C00LDQvdC90YvRhSDQs9GA0YPQv9C/ICjQsdGD0YTQtdGA0L7QsikuICovXG4gICAgICAgICAgdGhpcy5zdGF0cy5ncm91cHNDb3VudCArPSB0aGlzLmFyZWEub2JqUGFyYW1Db3VudFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5kZWJ1Zy5sb2coJ2xvYWRlZCcpXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQn9GA0L7QstC10YDRj9C10YIg0LrQvtGA0YDQtdC60YLQvdC+0YHRgtGMINC/0LDRgNCw0LzQtdGC0YDQvtCyINC+0LHRitC10LrRgtCwINC4INCyINGB0LvRg9GH0LDQtSDQvdC10L7QsdGF0L7QtNC40LzQvtGB0YLQuCDQstC90L7RgdC40YIg0LIg0L3QuNGFINC40LfQvNC10L3QtdC90LjRjy5cbiAgICpcbiAgICogQHBhcmFtIG9iamVjdCAtINCU0LDQvdC90YvQtSDQvtCxINC+0LHRitC10LrRgtC1LlxuICAgKiBAcmV0dXJucyDQodC60L7RgNGA0LXQutGC0LjRgNC+0LLQsNC90L3Ri9C1INC00LDQvdC90YvQtSDQvtCxINC+0LHRitC10LrRgtC1LlxuICAgKi9cbiAgY2hlY2tPYmplY3Qob2JqZWN0OiBTUGxvdE9iamVjdCk6IFNQbG90T2JqZWN0IHtcblxuICAgIC8qKiDQn9GA0L7QstC10YDQutCwINC60L7RgNGA0LXQutGC0L3QvtGB0YLQuCDRgNCw0YHQv9C+0LvQvtC20LXQvdC40Y8g0L7QsdGK0LXQutGC0LAuICovXG4gICAgaWYgKG9iamVjdC54ID4gMSkge1xuICAgICAgb2JqZWN0LnggPSAxXG4gICAgfSBlbHNlIGlmIChvYmplY3QueCA8IDApIHtcbiAgICAgIG9iamVjdC54ID0gMFxuICAgIH1cblxuICAgIGlmIChvYmplY3QueSA+IDEpIHtcbiAgICAgIG9iamVjdC55ID0gMVxuICAgIH0gZWxzZSBpZiAob2JqZWN0LnkgPCAwKSB7XG4gICAgICBvYmplY3QueSA9IDBcbiAgICB9XG5cbiAgICAvKiog0J/RgNC+0LLQtdGA0LrQsCDQutC+0YDRgNC10LrRgtC90L7RgdGC0Lgg0YTQvtGA0LzRiyDQuCDRhtCy0LXRgtCwINC+0LHRitC10LrRgtCwLiAqL1xuICAgIGlmICgob2JqZWN0LnNoYXBlID49IHRoaXMuc2hhcGVzQ291bnQhKSB8fCAob2JqZWN0LnNoYXBlIDwgMCkpIG9iamVjdC5zaGFwZSA9IDBcbiAgICBpZiAoKG9iamVjdC5jb2xvciA+PSB0aGlzLmNvbG9ycy5sZW5ndGgpIHx8IChvYmplY3QuY29sb3IgPCAwKSkgb2JqZWN0LmNvbG9yID0gMFxuXG4gICAgcmV0dXJuIG9iamVjdFxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JLRi9GH0LjRgdC70Y/QtdGCINCy0LjQtNC40LzRg9GOINC+0LHQu9Cw0YHRgtGMINCz0YDRg9C/0L/QvtCy0L7QuSDQvNCw0YLRgNC40YbRiyDQvdCwINC+0YHQvdC+0LLQtSDQvtCx0LvQsNGB0YLQuCDQstC40LTQuNC80L7RgdGC0Lgg0YHQutCw0YLRgtC10YDQv9C70L7RgtCwLlxuICAgKi9cbiAgdXBkYXRlVmlzaWJsZUFyZWEoKTogdm9pZCB7XG5cbiAgICBjb25zdCBreCA9IHRoaXMuY2FudmFzLndpZHRoIC8gKDIgKiB0aGlzLmNhbWVyYS56b29tISlcbiAgICBjb25zdCBreSA9IHRoaXMuY2FudmFzLmhlaWdodCAvICgyICogdGhpcy5jYW1lcmEuem9vbSEpXG5cbiAgICAvKiog0KDQsNGB0YfQtdGCINCz0YDQsNC90LjRhiDQvtCx0LvQsNGB0YLQuCDQstC40LTQuNC80L7RgdGC0Lgg0LIg0LXQtNC40L3QuNGH0L3Ri9GFINC60L7QvtGA0LTQuNC90LDRgtCw0YUg0YHQutCw0YLRgtC10YDQv9C70L7RgtCwLiAqL1xuICAgIGNvbnN0IGNhbWVyYUxlZnQgPSB0aGlzLmNhbWVyYS54IVxuICAgIGNvbnN0IGNhbWVyYVJpZ2h0ID0gdGhpcy5jYW1lcmEueCEgKyAyKmt4XG4gICAgY29uc3QgY2FtZXJhVG9wID0gdGhpcy5jYW1lcmEueSEgLSBreVxuICAgIGNvbnN0IGNhbWVyYUJvdHRvbSA9IHRoaXMuY2FtZXJhLnkhICsga3lcblxuICAgIGlmICggKGNhbWVyYUxlZnQgPCAxKSAmJiAoY2FtZXJhUmlnaHQgPiAwKSAmJiAoY2FtZXJhVG9wIDwgMSkgJiYgKGNhbWVyYUJvdHRvbSA+IDApICkge1xuXG4gICAgICAvKiog0KDQsNGB0YfQtdGCINCy0LjQtNC40LzQvtC5INC+0LHQu9Cw0YHRgtC4INC80LDRgtGA0LjRhtGLLCDQtdGB0LvQuCDQvtCx0LvQsNGB0YLRjCDQstC40LTQuNC80L7RgdGC0Lgg0YHQutCw0YLRgtC10YDQv9C70L7RgtCwINC90LDRhdC+0LTQuNGC0YHRjyDQsiDQv9GA0LXQtNC10LvQsNGFINCz0YDQsNGE0LjQutCwLiAqL1xuICAgICAgdGhpcy5hcmVhLmR4VmlzaWJsZUZyb20gPSAoY2FtZXJhTGVmdCA8IDApID8gMCA6IE1hdGgudHJ1bmMoY2FtZXJhTGVmdCAvIHRoaXMuYXJlYS5zdGVwKVxuICAgICAgdGhpcy5hcmVhLmR4VmlzaWJsZVRvID0gKGNhbWVyYVJpZ2h0ID4gMSkgPyB0aGlzLmFyZWEuY291bnQgOiB0aGlzLmFyZWEuY291bnQgLSBNYXRoLnRydW5jKCgxIC0gY2FtZXJhUmlnaHQpIC8gdGhpcy5hcmVhLnN0ZXApXG4gICAgICB0aGlzLmFyZWEuZHlWaXNpYmxlRnJvbSA9IChjYW1lcmFUb3AgPCAwKSA/IDAgOiBNYXRoLnRydW5jKGNhbWVyYVRvcCAvIHRoaXMuYXJlYS5zdGVwKVxuICAgICAgdGhpcy5hcmVhLmR5VmlzaWJsZVRvID0gKGNhbWVyYUJvdHRvbSA+IDEpID8gdGhpcy5hcmVhLmNvdW50IDogdGhpcy5hcmVhLmNvdW50IC0gTWF0aC50cnVuYygoMSAtIGNhbWVyYUJvdHRvbSkgLyB0aGlzLmFyZWEuc3RlcClcbiAgICB9IGVsc2Uge1xuXG4gICAgICAvKiog0JXRgdC70Lgg0L7QsdC70LDRgdGC0Ywg0LLQuNC00LjQvNC+0YHRgtC4INCy0L3QtSDQv9GA0LXQtNC10LvQvtCyINCz0YDQsNGE0LjQutCwLCDRgtC+INCz0YDRg9C/0L/QvtCy0LDRjyDQvNCw0YLRgNC40YbQsCDQvdC1INGC0YDQtdCx0YPQtdGCINC+0LHRhdC+0LTQsC4gKi9cbiAgICAgIHRoaXMuYXJlYS5keFZpc2libGVGcm9tID0gMVxuICAgICAgdGhpcy5hcmVhLmR4VmlzaWJsZVRvID0gMFxuICAgICAgdGhpcy5hcmVhLmR5VmlzaWJsZUZyb20gPSAxXG4gICAgICB0aGlzLmFyZWEuZHlWaXNpYmxlVG8gPSAwXG4gICAgfVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JLRi9GH0LjRgdC70Y/QtdGCINC+0YLQvtCx0YDQsNC20LDQtdC80YPRjiDQs9C70YPQsdC40L3RgyDQs9GA0YPQv9C/0Ysg0L7QsdGK0LXQutGC0L7Qsi5cbiAgICpcbiAgICogQHBhcmFtIHRvdGFsQ291bnQgLSDQntCx0YnQtdC1INC60L7Qu9C40YfQtdGB0YLQstC+INC+0LHRitC10LrRgtC+0LIg0LIg0LPRgNGD0L/Qv9C1LlxuICAgKiBAcGFyYW0gcmF0aW8gLSDQoNCw0LfQvNC10YDQvdGL0Lkg0LrQvtGN0YTRhNC40YbQuNC10L3Rgiwg0L/QvtC60LDQt9GL0LLQsNGO0YnQuNC5INGB0L7QvtGC0L3QvtGI0LXQvdC40LUg0LzQtdC20LTRgyDRgdGA0LXQtNC90LjQvCDRgNCw0LfQvNC10YDQvtC8INC+0LHRitC10LrRgtC+0LIg0Lgg0LvQuNC90LXQudC90YvQvCDRgNCw0LfQvNC10YDQvtC8XG4gICAqICAgICDQs9GA0YPQv9C/0Ysg0L7QsdGK0LXQutGC0L7QsiDQv9GA0Lgg0YLQtdC60YPRidC10Lwg0LfQvdCw0YfQtdC90LjQuCDQt9GD0LzQuNGA0L7QstCw0L3QuNGPLlxuICAgKiBAcmV0dXJucyDQlNCy0LAg0L/QsNGA0LDQvNC10YLRgNCwINCz0LvRg9Cx0LjQvdGLINC+0YLQvtCx0YDQsNC20LDQtdC80L7QuSDQs9GA0YPQv9C/0Ys6IFswXSAtINC40L3QtNC10LrRgSwg0YEg0LrQvtGC0L7RgNC+0LPQviDQsdGD0LTQtdGCINC90LDRh9C40L3QsNGC0YzRgdGPINC+0YLQvtCx0YDQsNC20LXQvdC40LUg0L7QsdGK0LXQutGC0L7QslxuICAgKiAgICAg0LPRgNGD0L/Qv9GLLCBbMV0gLSDQutC+0LvQuNGH0LXRgdGC0LLQviDQvtGC0LHRgNCw0LbQsNC10LzRi9GFINC+0LHRitC10LrRgtC+0LIg0LPRgNGD0L/Qv9GLLlxuICAgKi9cbiAgZ2V0VmlzaWJsZU9iamVjdHNQYXJhbXModG90YWxDb3VudDogbnVtYmVyLCByYXRpbzogbnVtYmVyKTogbnVtYmVyW10ge1xuXG4gICAgbGV0IGNvdW50OiBudW1iZXIgPSAwXG5cbiAgICAvKiog0KDQsNGB0YfQtdGCINC60L7Qu9C40YfQtdGB0YLQstCwINC+0YLQvtCx0YDQsNC20LDQtdC80YvRhSDQvtCx0YrQtdC60YLQvtCyINC90LAg0L7RgdC90L7QstC1INGA0LDQt9C80LXRgNC90L7Qs9C+INC60L7RjdGE0YTQuNGG0LjQtdC90YLQsC4gKi9cbiAgICBpZiAocmF0aW8gPCA1KSB7XG4gICAgICBjb3VudCA9IDQwICogcmF0aW9cbiAgICB9IGVsc2UgaWYgKHJhdGlvIDwgMTApIHtcbiAgICAgIGNvdW50ID0gNzAgKiByYXRpb1xuICAgIH0gZWxzZSB7XG4gICAgICBjb3VudCA9IHRvdGFsQ291bnRcbiAgICB9XG5cbiAgICAvKiog0JrQvtGA0YDQtdC60YLQuNGA0L7QstC60LAg0L/QvtC70YPRh9C10L3QvdC+0LPQviDQutC+0LvQuNGH0LXRgdGC0LLQsC4gKi9cbiAgICBjb3VudCA9IE1hdGgudHJ1bmMoY291bnQpXG4gICAgaWYgKGNvdW50ID4gdG90YWxDb3VudCkgeyBjb3VudCA9IHRvdGFsQ291bnQgfVxuICAgIGlmIChjb3VudCA8IDEpIHsgY291bnQgPSAxIH1cblxuICAgIHJldHVybiBbdG90YWxDb3VudCAtIGNvdW50LCBjb3VudF1cbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCf0YDQvtC40LfQstC+0LTQuNGCINGA0LXQvdC00LXRgNC40L3QsyDQs9GA0LDRhNC40LrQsCDQsiDRgdC+0L7RgtCy0LXRgtGB0YLQstC40Lgg0YEg0YLQtdC60YPRidC40LzQuCDQv9Cw0YDQsNC80LXRgtGA0LDQvNC4INGC0YDQsNC90YHRhNC+0YDQvNCw0YbQuNC4LlxuICAgKi9cbiAgcHVibGljIHJlbmRlcigpOiB2b2lkIHtcblxuICAgIC8qKiDQntGH0LjRgdGC0LrQsCDQvtCx0YrQtdC60YLQsCDRgNC10L3QtNC10YDQuNC90LPQsCBXZWJHTC4gKi9cbiAgICB0aGlzLndlYmdsLmNsZWFyQmFja2dyb3VuZCgpXG5cbiAgICAvKiog0J7QsdC90L7QstC70LXQvdC40LUg0LzQsNGC0YDQuNGG0Ysg0YLRgNCw0L3RgdGE0L7RgNC80LDRhtC40LguICovXG4gICAgdGhpcy5jb250cm9sLnVwZGF0ZVZpZXdQcm9qZWN0aW9uKClcblxuICAgIC8qKiDQn9GA0LjQstGP0LfQutCwINC80LDRgtGA0LjRhtGLINGC0YDQsNC90YHRhNC+0YDQvNCw0YbQuNC4INC6INC/0LXRgNC10LzQtdC90L3QvtC5INGI0LXQudC00LXRgNCwLiAqL1xuICAgIHRoaXMud2ViZ2wuc2V0VmFyaWFibGUoJ3VfbWF0cml4JywgdGhpcy5jb250cm9sLnRyYW5zZm9ybS52aWV3UHJvamVjdGlvbk1hdClcblxuICAgIC8qKiDQktGL0YfQuNGB0LvQtdC90LjQtSDQstC40LTQuNC80L7QuSDQvtCx0LvQsNGB0YLQuCDQs9GA0YPQv9C/0L7QstC+0Lkg0LzQsNGC0YDQuNGG0YsuICovXG4gICAgdGhpcy51cGRhdGVWaXNpYmxlQXJlYSgpXG5cbiAgICAvKipcbiAgICAgKiDQktGL0YfQuNGB0LvQtdC90LjQtSDRgNCw0LfQvNC10YDQvdC+0LPQviDQutC+0Y3RhNGE0LjRhtC40LXQvdGC0LAsINC/0L7QutCw0LfRi9Cy0LDRjtGJ0LXQs9C+INGB0L7QvtGC0L3QvtGI0LXQvdC40LUg0LzQtdC20LTRgyDRgdGA0LXQtNC90LjQvCDRgNCw0LfQvNC10YDQvtC8INC+0LHRitC10LrRgtC+0LIg0Lgg0LvQuNC90LXQudC90YvQvFxuICAgICAqINGA0LDQt9C80LXRgNC+0Lwg0LPRgNGD0L/Qv9GLINC+0LHRitC10LrRgtC+0LIg0L/RgNC4INGC0LXQutGD0YnQtdC8INC30L3QsNGH0LXQvdC40Lgg0LfRg9C80LjRgNC+0LLQsNC90LjRjy5cbiAgICAgKi9cbiAgICBjb25zdCByYXRpb09iamVjdEdyb3VwID0gKDIgKiB0aGlzLmNhbWVyYS56b29tISAqIHRoaXMuYXJlYS5zdGVwKSAvICh0aGlzLnN0YXRzLm1pbk9iamVjdFNpemUgKyB0aGlzLnN0YXRzLm1heE9iamVjdFNpemUpXG5cbiAgICBsZXQgZmlyc3Q6IG51bWJlciA9IDBcbiAgICBsZXQgY291bnQ6IG51bWJlciA9IDBcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5hcmVhLmNvdW50OyBpKyspIHtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5hcmVhLmNvdW50OyBqKyspIHtcblxuICAgICAgICAvKiog0JjQvdC00LXQutGB0Ysg0LjQt9Cy0LvQtdC60LDRjtGC0YHRjyDQuNC3INC80LDRgtGA0LjRhtGLINC/0LXRgNC10LzQtdGI0LDQvdC90YvRhSDQuNC90LTQtdC60YHQvtCyLiAqL1xuICAgICAgICBjb25zdCBbZHgsIGR5XSA9IHRoaXMuYXJlYS5zaHVmZmxlZEluZGljZXNbaV1bal1cblxuICAgICAgICAvKiog0JXRgdC70Lgg0YLQtdC60YPRidC40Lkg0LjQvdC00LXQutGBINC70LXQttC40YIg0LLQvdC1INCy0LjQtNC40LzQvtC5INC+0LHQu9Cw0YHRgtC4INCz0YDRg9C/0L/QvtCy0L7QuSDQvNCw0YLRgNC40YbRiywg0YLQviDQvtC9INC90LUg0LjRgtC10YDQuNGA0YPQtdGC0YHRjy4gKi9cbiAgICAgICAgaWYgKCAoZHggPCB0aGlzLmFyZWEuZHhWaXNpYmxlRnJvbSkgfHxcbiAgICAgICAgICAoZHggPiB0aGlzLmFyZWEuZHhWaXNpYmxlVG8pIHx8XG4gICAgICAgICAgKGR5IDwgdGhpcy5hcmVhLmR5VmlzaWJsZUZyb20pIHx8XG4gICAgICAgICAgKGR5ID4gdGhpcy5hcmVhLmR5VmlzaWJsZVRvKSApIHsgY29udGludWUgfVxuXG4gICAgICAgIGlmICh0aGlzLmFyZWEuZ3JvdXBzW2R4XVtkeV1bdGhpcy5hcmVhLm9ialNpZ25QYXJhbUluZGV4XS5sZW5ndGggPiAwKSB7XG5cbiAgICAgICAgICAvKiog0JXRgdC70Lgg0LIg0YLQtdC60YPRidC10Lkg0LPRgNGD0L/Qv9C1INC10YHRgtGMINC+0LHRitC10LrRgtGLLCDRgtC+INC00LXQu9Cw0LXQvCDRgdC+0L7RgtCy0LXRgtGB0LLRg9GO0YnQuNC1INCx0YPRhNC10YDRiyDQsNC60YLQuNCy0L3Ri9C80LguICovXG4gICAgICAgICAgdGhpcy53ZWJnbC5zZXRCdWZmZXIoZHgsIGR5LCAwLCAnYV9wb3NpdGlvbicsIDIsIDAsIDApXG4gICAgICAgICAgdGhpcy53ZWJnbC5zZXRCdWZmZXIoZHgsIGR5LCAxLCAnYV9zaGFwZScsIDEsIDAsIDApXG4gICAgICAgICAgdGhpcy53ZWJnbC5zZXRCdWZmZXIoZHgsIGR5LCAyLCAnYV9jb2xvcicsIDEsIDAsIDApXG4gICAgICAgICAgdGhpcy53ZWJnbC5zZXRCdWZmZXIoZHgsIGR5LCAzLCAnYV9zaXplJywgMSwgMCwgMCk7IC8vINCi0L7Rh9C60LAg0YEg0LfQsNC/0Y/RgtC+0Lkg0LHQtdC3INC60L7RgtC+0YDQvtC5INC90LjRh9C10LPQviDQvdC1INGA0LDQsdC+0YLQsNC10YIgOy0pXG5cbiAgICAgICAgICAvKiog0JLRi9GH0LjRgdC70LXQvdC40LUg0L7RgtC+0LHRgNCw0LbQsNC10LzQvtC5INCz0LvRg9Cx0LjQvdGLINGC0LXQutGD0YnQtdC5INCz0YDRg9C/0L/Riy4gKi9cbiAgICAgICAgICBbZmlyc3QsIGNvdW50XSA9IHRoaXMuZ2V0VmlzaWJsZU9iamVjdHNQYXJhbXMoXG4gICAgICAgICAgICB0aGlzLmFyZWEuZ3JvdXBzW2R4XVtkeV1bdGhpcy5hcmVhLm9ialNpZ25QYXJhbUluZGV4XS5sZW5ndGgsXG4gICAgICAgICAgICByYXRpb09iamVjdEdyb3VwXG4gICAgICAgICAgKVxuXG4gICAgICAgICAgLyoqINCg0LXQvdC00LXRgCDQs9GA0YPQv9C/0YsuICovXG4gICAgICAgICAgdGhpcy53ZWJnbC5kcmF3UG9pbnRzKGZpcnN0LCBjb3VudClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCf0YDQvtCy0LXRgNGP0LXRgiDQutC+0YDRgNC10LrRgtC90L7RgdGC0Ywg0L3QsNGB0YLRgNC+0LXQuiDRjdC60LfQtdC80L/Qu9GP0YDQsC5cbiAgICpcbiAgICogQHJlbWFya3NcbiAgICog0JjRgdC/0L7Qu9GM0LfRg9C10YLRgdGPINC00LvRjyDQv9GA0L7QstC10YDQutC4INC60L7RgNGA0LXQutGC0L3QvtGB0YLQuCDQu9C+0LPQuNC60Lgg0YDQsNCx0L7RgtGLINC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjyDRgSDRjdC60LfQtdC80L/Qu9GP0YDQvtC8LiDQndC1INC/0L7Qt9Cy0L7Qu9GP0LXRgiDRgNCw0LHQvtGC0LDRgtGMINGBXG4gICAqINC90LXQvdCw0YHRgtGA0L7QtdC90L3Ri9C8INC40LvQuCDQvdC10LrQvtGA0YDQtdC60YLQvdC+INC90LDRgdGC0YDQvtC10L3QvdGL0Lwg0Y3QutC30LXQvNC/0LvRj9GA0L7QvC5cbiAgICovXG4gIGNoZWNrU2V0dXAoKTogdm9pZCB7XG5cbiAgICAvKipcbiAgICAgKiAg0J/QvtC70YzQt9C+0LLQsNGC0LXQu9GMINC80L7QsyDQvdCw0YHRgtGA0L7QuNGC0Ywg0Y3QutC30LXQvNC/0LvRj9GAINCyINC60L7QvdGB0YLRgNGD0LrRgtC+0YDQtSDQuCDRgdGA0LDQt9GDINC30LDQv9GD0YHRgtC40YLRjCDRgNC10L3QtNC10YAsINCyINGC0LDQutC+0Lwg0YHQu9GD0YfQsNC1INC80LXRgtC+0LQgc2V0dXBcbiAgICAgKiAg0LHRg9C00LXRgiDQstGL0LfRi9Cy0LDQtdGC0YHRjyDQvdC10Y/QstC90L4uXG4gICAgICovXG4gICAgaWYgKCF0aGlzLmlzU2V0dXBlZCkge1xuICAgICAgdGhpcy5zZXR1cCgpXG4gICAgfVxuXG4gICAgLyoqINCd0LDQsdC+0YAg0L/RgNC+0LLQtdGA0L7QuiDQutC+0YDRgNC10LrRgtC90L7RgdGC0Lgg0L3QsNGB0YLRgNC+0LnQutC4INGN0LrQt9C10LzQv9C70Y/RgNCwLiAqL1xuICAgIGlmICghdGhpcy5pdGVyYXRvcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCfQndC1INC30LDQtNCw0L3QsCDRhNGD0L3QutGG0LjRjyDQuNGC0LXRgNC40YDQvtCy0LDQvdC40Y8g0L7QsdGK0LXQutGC0L7QsiEnKVxuICAgIH1cbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCk0YPQvdC60YbQuNGPINC40YLQtdGA0LjRgNC+0LLQsNC90LjRjyDQvNCw0YHRgdC40LLQsCDQtNCw0L3QvdGL0YUg0L7QsSDQvtCx0YrQtdC60YLQsNGFIHtAbGluayB0aGlzLmRhdGF9LiDQn9GA0Lgg0LrQsNC20LTQvtC8INCy0YvQt9C+0LLQtSDQstC+0LfQstGA0LDRidCw0LXRgiDQvtGH0LXRgNC10LTQvdC+0Lkg0Y3Qu9C10LzQtdC90YJcbiAgICog0LzQsNGB0YHQuNCy0LAg0L7QsdGK0LXQutGC0L7Qsi5cbiAgICpcbiAgICogQHJldHVybnMg0JTQsNC90L3Ri9C1INC+0LEg0L7Rh9C10YDQtdC00L3QvtC8INC+0LHRitC10LrRgtC1INC40LvQuCBudWxsLCDQtdGB0LvQuCDQvNCw0YHRgdC40LIg0LfQsNC60L7QvdGH0LjQu9GB0Y8uXG4gICAqL1xuICBhcnJheUl0ZXJhdG9yKCk6IFNQbG90T2JqZWN0IHwgbnVsbCB7XG4gICAgaWYgKHRoaXMuZGF0YSFbdGhpcy5hcnJheUluZGV4XSkge1xuICAgICAgcmV0dXJuIHRoaXMuZGF0YSFbdGhpcy5hcnJheUluZGV4KytdXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JfQsNC/0YPRgdC60LDQtdGCINGA0LXQvdC00LXRgNC40L3QsyDQuCDQutC+0L3RgtGA0L7Qu9GMINGD0L/RgNCw0LLQu9C10L3QuNGPLlxuICAgKi9cbiAgcHVibGljIHJ1bigpOiB2b2lkIHtcblxuICAgIHRoaXMuY2hlY2tTZXR1cCgpXG5cbiAgICBpZiAoIXRoaXMuaXNSdW5uaW5nKSB7XG4gICAgICB0aGlzLnJlbmRlcigpXG4gICAgICB0aGlzLmNvbnRyb2wucnVuKClcbiAgICAgIHRoaXMuaXNSdW5uaW5nID0gdHJ1ZVxuICAgICAgdGhpcy5kZWJ1Zy5sb2coJ3N0YXJ0ZWQnKVxuICAgIH1cbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCe0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdGCINGA0LXQvdC00LXRgNC40L3QsyDQuCDQutC+0L3RgtGA0L7Qu9GMINGD0L/RgNCw0LLQu9C10L3QuNGPLlxuICAgKi9cbiAgcHVibGljIHN0b3AoKTogdm9pZCB7XG5cbiAgICB0aGlzLmNoZWNrU2V0dXAoKVxuXG4gICAgaWYgKHRoaXMuaXNSdW5uaW5nKSB7XG4gICAgICB0aGlzLmNvbnRyb2wuc3RvcCgpXG4gICAgICB0aGlzLmlzUnVubmluZyA9IGZhbHNlXG4gICAgICB0aGlzLmRlYnVnLmxvZygnc3RvcGVkJylcbiAgICB9XG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQntGH0LjRidCw0LXRgiDRhNC+0L0uXG4gICAqL1xuICBwdWJsaWMgY2xlYXIoKTogdm9pZCB7XG5cbiAgICB0aGlzLmNoZWNrU2V0dXAoKVxuXG4gICAgdGhpcy53ZWJnbC5jbGVhckJhY2tncm91bmQoKVxuICAgIHRoaXMuZGVidWcubG9nKCdjbGVhcmVkJylcbiAgfVxufVxuIiwiXG4vKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICpcbiAqINCf0YDQvtCy0LXRgNGP0LXRgiDRj9Cy0LvRj9C10YLRgdGPINC70Lgg0L/QtdGA0LXQvNC10L3QvdCw0Y8g0Y3QutC30LXQvNC/0LvRj9GA0L7QvCDQutCw0LrQvtCz0L4t0LvQuNCx0L7QviDQutC70LDRgdGB0LAuXG4gKlxuICogQHBhcmFtIHZhcmlhYmxlIC0g0J/RgNC+0LLQtdGA0Y/QtdC80LDRjyDQv9C10YDQtdC80LXQvdC90LDRjy5cbiAqIEByZXR1cm5zINCg0LXQt9GD0LvRjNGC0LDRgiDQv9GA0L7QstC10YDQutC4LlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNPYmplY3QodmFyaWFibGU6IGFueSk6IGJvb2xlYW4ge1xuICByZXR1cm4gKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YXJpYWJsZSkgPT09ICdbb2JqZWN0IE9iamVjdF0nKVxufVxuXG4vKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICpcbiAqINCf0LXRgNC10L7Qv9GA0LXQtNC10LvRj9C10YIg0LfQvdCw0YfQtdC90LjRjyDQv9C+0LvQtdC5INC+0LHRitC10LrRgtCwIHRhcmdldCDQvdCwINC30L3QsNGH0LXQvdC40Y8g0L/QvtC70LXQuSDQvtCx0YrQtdC60YLQsCBzb3VyY2UuXG4gKlxuICogQHJlbWFya3NcbiAqINCf0LXRgNC10L7Qv9GA0LXQtNC10LvRj9GO0YLRgdGPINGC0L7Qu9GM0LrQviDRgtC1INC/0L7Qu9GPLCDQutC+0YLQvtGA0YvQtSDRgdGD0YnQtdGB0YLQstGD0LXRjtGCINCyIHRhcmdldC4g0JXRgdC70Lgg0LIgc291cmNlINC10YHRgtGMINC/0L7Qu9GPLCDQutC+0YLQvtGA0YvRhSDQvdC10YIg0LIgdGFyZ2V0LCDRgtC+INC+0L3QuFxuICog0LjQs9C90L7RgNC40YDRg9GO0YLRgdGPLiDQldGB0LvQuCDQutCw0LrQuNC1LdGC0L4g0L/QvtC70Y8g0YHQsNC80Lgg0Y/QstC70Y/RjtGC0YHRjyDRj9Cy0LvRj9GO0YLRgdGPINC+0LHRitC10LrRgtCw0LzQuCwg0YLQviDRgtC+INC+0L3QuCDRgtCw0LrQttC1INGA0LXQutGD0YDRgdC40LLQvdC+INC60L7Qv9C40YDRg9GO0YLRgdGPICjQv9GA0Lgg0YLQvtC8INC20LVcbiAqINGD0YHQu9C+0LLQuNC4LCDRh9GC0L4g0LIg0YbQtdC70LXQstC+0Lwg0L7QsdGK0LXQutGC0LUg0YHRg9GJ0LXRgdGC0LLRg9GO0YIg0L/QvtC70Y8g0L7QsdGK0LXQutGC0LAt0LjRgdGC0L7Rh9C90LjQutCwKS5cbiAqXG4gKiBAcGFyYW0gdGFyZ2V0IC0g0KbQtdC70LXQstC+0LkgKNC40LfQvNC10L3Rj9C10LzRi9C5KSDQvtCx0YrQtdC60YIuXG4gKiBAcGFyYW0gc291cmNlIC0g0J7QsdGK0LXQutGCINGBINC00LDQvdC90YvQvNC4LCDQutC+0YLQvtGA0YvQtSDQvdGD0LbQvdC+INGD0YHRgtCw0L3QvtCy0LjRgtGMINGDINGG0LXQu9C10LLQvtCz0L4g0L7QsdGK0LXQutGC0LAuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb3B5TWF0Y2hpbmdLZXlWYWx1ZXModGFyZ2V0OiBhbnksIHNvdXJjZTogYW55KTogdm9pZCB7XG4gIE9iamVjdC5rZXlzKHNvdXJjZSkuZm9yRWFjaChrZXkgPT4ge1xuICAgIGlmIChrZXkgaW4gdGFyZ2V0KSB7XG4gICAgICBpZiAoaXNPYmplY3Qoc291cmNlW2tleV0pKSB7XG4gICAgICAgIGlmIChpc09iamVjdCh0YXJnZXRba2V5XSkpIHtcbiAgICAgICAgICBjb3B5TWF0Y2hpbmdLZXlWYWx1ZXModGFyZ2V0W2tleV0sIHNvdXJjZVtrZXldKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoIWlzT2JqZWN0KHRhcmdldFtrZXldKSAmJiAodHlwZW9mIHRhcmdldFtrZXldICE9PSAnZnVuY3Rpb24nKSkge1xuICAgICAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSlcbn1cblxuLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqXG4gKiDQktC+0LfQstGA0LDRidCw0LXRgiDRgdC70YPRh9Cw0LnQvdC+0LUg0YbQtdC70L7QtSDRh9C40YHQu9C+INCyINC00LjQsNC/0LDQt9C+0L3QtTogWzAuLi5yYW5nZS0xXS5cbiAqXG4gKiBAcGFyYW0gcmFuZ2UgLSDQktC10YDRhdC90LjQuSDQv9GA0LXQtNC10Lsg0LTQuNCw0L/QsNC30L7QvdCwINGB0LvRg9GH0LDQudC90L7Qs9C+INCy0YvQsdC+0YDQsC5cbiAqIEByZXR1cm5zINCh0LvRg9GH0LDQudC90L7QtSDRh9C40YHQu9C+LlxuICovXG5leHBvcnQgZnVuY3Rpb24gcmFuZG9tSW50KHJhbmdlOiBudW1iZXIpOiBudW1iZXIge1xuICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcmFuZ2UpXG59XG5cbi8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKlxuICog0JrQvtC90LLQtdGA0YLQuNGA0YPQtdGCINGG0LLQtdGCINC40LcgSEVYLdGE0L7RgNC80LDRgtCwINCyIEdMU0wt0YTQvtGA0LzQsNGCLlxuICpcbiAqIEBwYXJhbSBoZXhDb2xvciAtINCm0LLQtdGCINCyIEhFWC3RhNC+0YDQvNCw0YLQtSAoXCIjZmZmZmZmXCIpLlxuICogQHJldHVybnMg0JzQsNGB0YHQuNCyINC40Lcg0YLRgNC10YUg0YfQuNGB0LXQuyDQsiDQtNC40LDQv9Cw0LfQvtC90LUg0L7RgiAwINC00L4gMS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbG9yRnJvbUhleFRvR2xSZ2IoaGV4Q29sb3I6IHN0cmluZyk6IG51bWJlcltdIHtcbiAgbGV0IGsgPSAvXiM/KFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pJC9pLmV4ZWMoaGV4Q29sb3IpXG4gIGxldCBbciwgZywgYl0gPSBbcGFyc2VJbnQoayFbMV0sIDE2KSAvIDI1NSwgcGFyc2VJbnQoayFbMl0sIDE2KSAvIDI1NSwgcGFyc2VJbnQoayFbM10sIDE2KSAvIDI1NV1cbiAgcmV0dXJuIFtyLCBnLCBiXVxufVxuXG4vKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICpcbiAqINCS0L7Qt9Cy0YDQsNGJ0LDQtdGCINGB0YLRgNC+0LrQvtCy0YPRjiDQt9Cw0L/QuNGB0Ywg0YLQtdC60YPRidC10LPQviDQstGA0LXQvNC10L3QuC5cbiAqXG4gKiBAcmV0dXJucyDQodGC0YDQvtC60LAg0LLRgNC10LzQtdC90Lgg0LIg0YTQvtGA0LzQsNGC0LUgXCJoaDptbTpzc1wiLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q3VycmVudFRpbWUoKTogc3RyaW5nIHtcblxuICBsZXQgdG9kYXkgPSBuZXcgRGF0ZSgpXG5cbiAgcmV0dXJuIFtcbiAgICB0b2RheS5nZXRIb3VycygpLnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgJzAnKSxcbiAgICB0b2RheS5nZXRNaW51dGVzKCkudG9TdHJpbmcoKS5wYWRTdGFydCgyLCAnMCcpLFxuICAgIHRvZGF5LmdldFNlY29uZHMoKS50b1N0cmluZygpLnBhZFN0YXJ0KDIsICcwJylcbiAgXS5qb2luKCc6Jylcbn1cblxuLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqXG4gKiDQn9C10YDQtdC80LXRiNC40LLQsNC10YIg0Y3Qu9C10LzQtdC90YLRiyDQvtC00L3QvtC80LXRgNC90L7Qs9C+INC80LDRgdGB0LjQstCwINGB0LvRg9GH0LDQudC90YvQvCDQvtCx0YDQsNC30L7QvC5cbiAqXG4gKiBAcGFyYW0gYXJyYXkgLSDQptC10LvQtdCy0L7QuSDQvNCw0YHRgdC40LIuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzaHVmZmxlQXJyYXkoYXJyYXk6IGFueVtdKTogdm9pZCB7XG4gIGZvciAobGV0IGkgPSBhcnJheS5sZW5ndGggLSAxOyBpID4gMDsgaS0tKSB7XG4gICAgY29uc3QgaiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChpICsgMSkpO1xuICAgIFthcnJheVtpXSwgYXJyYXlbal1dID0gW2FycmF5W2pdLCBhcnJheVtpXV1cbiAgfVxufVxuXG4vKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICpcbiAqINCf0LXRgNC10LzQtdGI0LjQstCw0LXRgiDRjdC70LXQvNC10L3RgtGLINC80LDRgtGA0LjRhtGLINGB0LvRg9GH0LDQudC90YvQvCDQvtCx0YDQsNC30L7QvC5cbiAqXG4gKiBAcGFyYW0gbWF0cml4IC0g0KbQtdC70LXQstCw0Y8g0LzQsNGC0YDQuNGG0LAuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzaHVmZmxlTWF0cml4KG1hdHJpeDogYW55W10pIHtcblxuICBsZXQgYXJyYXk6IGFueVtdID0gW11cblxuICAvKiog0JzQsNGC0YDQuNGG0LAg0YDQsNC30LLQtdGA0YLRi9Cy0LDQtdGC0YHRjyDQsiDQvtC00L3QvtC80LXRgNC90YvQuSDQvNCw0YHRgdC40LIuICovXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbWF0cml4Lmxlbmd0aDsgaSsrKSB7XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBtYXRyaXhbaV0ubGVuZ3RoOyBqKyspIHtcbiAgICAgIGFycmF5LnB1c2gobWF0cml4W2ldW2pdKVxuICAgIH1cbiAgfVxuXG4gIC8qKiDQn9C10YDQtdC80LXRiNC40LLQsNC90LjQtSDQvNCw0YHRgdC40LLQsC4gKi9cbiAgc2h1ZmZsZUFycmF5KGFycmF5KVxuXG4gIC8qKiDQnNCw0YHRgdC40LIg0YHQvtCx0LjRgNCw0LXRgtGB0Y8g0LIg0LzQsNGC0YDQuNGG0YMuICovXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbWF0cml4Lmxlbmd0aDsgaSsrKSB7XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBtYXRyaXhbaV0ubGVuZ3RoOyBqKyspIHtcbiAgICAgIG1hdHJpeFtpXVtqXSA9IGFycmF5LnBvcCgpXG4gICAgfVxuICB9XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IFNQbG90IGZyb20gJ0Avc3Bsb3QnXG5pbXBvcnQgJ0Avc3R5bGUnXG5cbi8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5cbmNvbnN0IHVybFBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMod2luZG93LmxvY2F0aW9uLnNlYXJjaClcbmNvbnN0IHVzZXJOID0gdXJsUGFyYW1zLmdldCgnbicpXG5cbmxldCBuID0gKHVzZXJOKT8gdXNlck4gOiAxXzAwMF8wMDBcblxubGV0IGNvbG9ycyA9IFsnI0Q4MUMwMScsICcjRTk5NjdBJywgJyNCQTU1RDMnLCAnI0ZGRDcwMCcsICcjRkZFNEI1JywgJyNGRjhDMDAnLCAnIzIyOEIyMicsICcjOTBFRTkwJywgJyM0MTY5RTEnLCAnIzAwQkZGRicsICcjOEI0NTEzJywgJyMwMENFRDEnXVxuXG4vKiog0KHQuNC90YLQtdGC0LjRh9C10YHQutCw0Y8g0LjRgtC10YDQuNGA0YPRjtGJ0LDRjyDRhNGD0L3QutGG0LjRjy4gKi9cbmxldCBpID0gMFxuZnVuY3Rpb24gcmVhZE5leHRPYmplY3QoKSB7XG4gIGlmIChpIDwgbikge1xuICAgIGkrK1xuICAgIHJldHVybiB7XG4gICAgICB4OiBNYXRoLnJhbmRvbSgpLFxuICAgICAgeTogTWF0aC5yYW5kb20oKSxcbiAgICAgIHNoYXBlOiByYW5kb21JbnQoNSksXG4gICAgICBzaXplOiAxMCArIHJhbmRvbUludCgyMSksXG4gICAgICBjb2xvcjogcmFuZG9tSW50KGNvbG9ycy5sZW5ndGgpXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGkgPSAwXG4gICAgcmV0dXJuIG51bGwgIC8vINCS0L7Qt9Cy0YDQsNGJ0LDQtdC8IG51bGwsINC60L7Qs9C00LAg0L7QsdGK0LXQutGC0YsgXCLQt9Cw0LrQvtC90YfQuNC70LjRgdGMXCIuXG4gIH1cbn1cblxuZnVuY3Rpb24gcmFuZG9tSW50KHJhbmdlKSB7XG4gIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiByYW5nZSlcbn1cblxuLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cblxubGV0IHNjYXR0ZXJQbG90ID0gbmV3IFNQbG90KCdjYW52YXMxJylcblxuc2NhdHRlclBsb3Quc2V0dXAoe1xuICBpdGVyYXRvcjogcmVhZE5leHRPYmplY3QsXG4gIGNvbG9yczogY29sb3JzLFxuICBkZWJ1Zzoge1xuICAgIGlzRW5hYmxlOiB0cnVlLFxuICB9LFxuICBkZW1vOiB7XG4gICAgaXNFbmFibGU6IGZhbHNlXG4gIH1cbn0pXG5cbnNjYXR0ZXJQbG90LnJ1bigpXG5cbi8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5cbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdvYmotY291bnQnKS5pbm5lckhUTUwgPSBzY2F0dGVyUGxvdC5zdGF0cy5vYmpUb3RhbENvdW50LnRvTG9jYWxlU3RyaW5nKClcbiJdLCJzb3VyY2VSb290IjoiIn0=