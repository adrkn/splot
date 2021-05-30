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
            startCamera: { x: 0, y: 0, zoom: 1 },
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
        console.log('Результат: ' + ((this.splot.stats.objTotalCount >= this.splot.globalLimit) ?
            'достигнут лимит объектов (' + this.splot.globalLimit.toLocaleString() + ')' :
            'обработаны все объекты'));
        console.log('Расход видеопамяти: ' + (this.splot.stats.memUsage / 1000000).toFixed(2).toLocaleString() + ' МБ');
        console.log('Кол-во объектов: ' + this.splot.stats.objTotalCount.toLocaleString());
        console.log('Создано видеобуферов: ' + this.splot.stats.groupsCount.toLocaleString());
        console.log("\u0413\u0440\u0443\u043F\u043F\u0438\u0440\u043E\u0432\u043A\u0430 \u0432\u0438\u0434\u0435\u043E\u0431\u0443\u0444\u0435\u0440\u043E\u0432: " + this.splot.area.count + " x " + this.splot.area.count);
        console.log("\u041C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u043E\u0435 \u043A\u043E\u043B-\u0432\u043E z-\u0433\u0440\u0443\u043F\u043F: " + this.splot.stats.maxDepthCount);
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
        /** Признак того, что хелпер уже настроен. */
        this.isSetuped = false;
        /** Буферы видеопамяти WebGL. */
        this.data = [];
        this.groupType = [];
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
            this.splot.camera.x = 0.5;
            this.splot.camera.y = 0.5;
        }
        /** Установка фонового цвета канваса (цвет очистки контекста рендеринга). */
        this.setBgColor(this.splot.grid.bgColor);
    };
    SPlotWebGl.prototype.clearData = function () {
        for (var dx = 0; dx < this.splot.area.count; dx++) {
            this.data[dx] = [];
            for (var dy = 0; dy < this.splot.area.count; dy++) {
                this.data[dx][dy] = [];
                for (var dz = 0; dz < this.splot.area.groups[dx][dy].length; dz++) {
                    this.data[dx][dy][dz] = [];
                }
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
     * @param groupCode - Название группы буферов, в которую будет добавлен новый буфер.
     * @param dx - Горизонтальный индекс буферной группы.
     * @param dy - Вертикальный индекс буферной группы.
     * @param data - Данные в виде типизированного массива для записи в создаваемый буфер.
     * @returns Объем памяти, занятый новым буфером (в байтах).
     */
    SPlotWebGl.prototype.createBuffer = function (dx, dy, dz, groupCode, data) {
        var buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW);
        this.data[dx][dy][dz][groupCode] = buffer;
        this.groupType[groupCode] = this.glNumberTypes.get(data.constructor.name);
        //console.log('BUFFER_SIZE = ', this.gl.getBufferParameter(this.gl.ARRAY_BUFFER, this.gl.BUFFER_SIZE));
        if (this.gl.getBufferParameter(this.gl.ARRAY_BUFFER, this.gl.BUFFER_SIZE) !== data.length * data.BYTES_PER_ELEMENT)
            throw new Error((this.gl.ARRAY_BUFFER, this.gl.BUFFER_SIZE) + " !== " + data.length * data.BYTES_PER_ELEMENT);
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
     * @param groupCode - Название группы буферов, в котором хранится необходимый буфер.
     * @param dx - Горизонтальный индекс буферной группы.
     * @param dy - Вертикальный индекс буферной группы.
     * @param dz - Глубинный индекс буфера в группе.
     * @param varName - Имя переменной (из массива {@link variables}), с которой будет связан буфер.
     * @param size - Количество элементов в буфере, соответствующих одной  GL-вершине.
     * @param stride - Размер шага обработки элементов буфера (значение 0 задает размещение элементов друг за другом).
     * @param offset - Смещение относительно начала буфера, начиная с которого будет происходить обработка элементов.
     */
    SPlotWebGl.prototype.setBuffer = function (dx, dy, dz, groupCode, varName, size, stride, offset) {
        var variable = this.variables.get(varName);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.data[dx][dy][dz][groupCode]);
        this.gl.enableVertexAttribArray(variable);
        this.gl.vertexAttribPointer(variable, size, this.groupType[groupCode], false, stride, offset);
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
        /** Ограничение кол-ва объектов в группе. */
        this.groupLimit = 10000;
        /** Цветовая палитра объектов. */
        this.colors = [];
        /** Параметры координатной плоскости. */
        this.grid = {
            bgColor: '#ffffff',
            rulesColor: '#c0c0c0'
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
            maxDepthCount: 0,
            memUsage: 0,
            minObjectSize: 1000000,
            maxObjectSize: 0,
        };
        /** Настройки, запрошенные пользователем в конструкторе или при последнем вызове setup. */
        this.lastRequestedOptions = {};
        /** Хелпер взаимодействия с устройством ввода. */
        this.control = new splot_control_1.default(this);
        /** Признак того, что экземпляр класса был корректно подготовлен к рендеру. */
        this.isSetuped = false;
        /** Переменная для перебора индексов массива данных data. */
        this.arrayIndex = 0;
        this.area = {
            groups: [],
            step: 0,
            count: 0,
            dxVisibleFrom: 0,
            dxVisibleTo: 0,
            dyVisibleFrom: 0,
            dyVisibleTo: 0,
            dzVisibleFrom: 0
        };
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
        this.camera.zoom = Math.min(this.canvas.width, this.canvas.height) - this.stats.maxObjectSize;
        this.camera.x = 0.5 - this.canvas.width / (2 * this.camera.zoom);
        this.camera.y = 0.5;
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
        this.stats = { objTotalCount: 0, groupsCount: 0, maxDepthCount: 0, memUsage: 0, minObjectSize: 1000000, maxObjectSize: 0 };
        var dx, dy, dz = 0;
        var object;
        var isObjectEnds = false;
        this.area.step = 0.02;
        this.area.count = Math.trunc(1 / this.area.step) + 1;
        this.area.dxVisibleFrom = 0;
        this.area.dxVisibleTo = this.area.count;
        this.area.dyVisibleFrom = 0;
        this.area.dyVisibleTo = this.area.count;
        this.area.dzVisibleFrom = 0;
        var groups = [];
        for (var dx_1 = 0; dx_1 < this.area.count; dx_1++) {
            groups[dx_1] = [];
            for (var dy_1 = 0; dy_1 < this.area.count; dy_1++) {
                groups[dx_1][dy_1] = [];
            }
        }
        while (!isObjectEnds) {
            object = this.iterator();
            /** Объекты закончились, если итератор вернул null или если достигнут лимит числа объектов. */
            isObjectEnds = (object === null) || (this.stats.objTotalCount >= this.globalLimit);
            if (!isObjectEnds) {
                object = this.checkObject(object);
                dx = Math.trunc(object.x / this.area.step);
                dy = Math.trunc(object.y / this.area.step);
                if (Array.isArray(groups[dx][dy][dz])) {
                    dz = groups[dx][dy].length - 1;
                    if (groups[dx][dy][dz][1].length >= this.groupLimit) {
                        dz++;
                        groups[dx][dy][dz] = [];
                        for (var i = 0; i < 4; i++) {
                            groups[dx][dy][dz][i] = [];
                        }
                    }
                }
                else {
                    dz = 0;
                    groups[dx][dy][dz] = [];
                    for (var i = 0; i < 4; i++) {
                        groups[dx][dy][dz][i] = [];
                    } // Массив: 0- вершины, 1 - формы, 2 - цвета, 3 - размеры
                }
                groups[dx][dy][dz][0].push(object.x, object.y);
                groups[dx][dy][dz][1].push(object.shape);
                groups[dx][dy][dz][2].push(object.color);
                groups[dx][dy][dz][3].push(object.size);
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
        this.webgl.clearData();
        /** Итерирование и занесение данных в буферы WebGL. */
        for (var dx_2 = 0; dx_2 < this.area.count; dx_2++) {
            for (var dy_2 = 0; dy_2 < this.area.count; dy_2++) {
                if (Array.isArray(groups[dx_2][dy_2])) {
                    for (var dz_1 = 0; dz_1 < groups[dx_2][dy_2].length; dz_1++) {
                        this.stats.memUsage +=
                            this.webgl.createBuffer(dx_2, dy_2, dz_1, 0, new Float32Array(groups[dx_2][dy_2][dz_1][0])) +
                                this.webgl.createBuffer(dx_2, dy_2, dz_1, 1, new Uint8Array(groups[dx_2][dy_2][dz_1][1])) +
                                this.webgl.createBuffer(dx_2, dy_2, dz_1, 2, new Uint8Array(groups[dx_2][dy_2][dz_1][2])) +
                                this.webgl.createBuffer(dx_2, dy_2, dz_1, 3, new Uint8Array(groups[dx_2][dy_2][dz_1][3]));
                        this.stats.groupsCount += 4;
                        if (groups[dx_2][dy_2].length > this.stats.maxDepthCount) {
                            this.stats.maxDepthCount = groups[dx_2][dy_2].length;
                        }
                    }
                }
            }
        }
        this.debug.log('loaded');
    };
    /** ****************************************************************************
     *
     * Проверяет корректность параметров объекта и в случае необходимости вносит в них изменения.
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
        /** Проверка корректности формы и цвета объекта объекта. */
        if ((object.shape >= this.shapesCount) || (object.shape < 0))
            object.shape = 0;
        if ((object.color >= this.colors.length) || (object.color < 0))
            object.color = 0;
        return object;
    };
    SPlot.prototype.updateVisibleArea = function () {
        var kx = this.canvas.width / (2 * this.camera.zoom);
        var ky = this.canvas.height / (2 * this.camera.zoom);
        var cameraLeft = this.camera.x;
        var cameraRight = this.camera.x + 2 * kx;
        var cameraTop = this.camera.y - ky;
        var cameraBottom = this.camera.y + ky;
        if ((cameraLeft < 1) && (cameraRight > 0) && (cameraTop < 1) && (cameraBottom > 0)) {
            this.area.dxVisibleFrom = (cameraLeft < 0) ? 0 : Math.trunc(cameraLeft / this.area.step);
            this.area.dxVisibleTo = (cameraRight > 1) ? this.area.count : this.area.count - Math.trunc((1 - cameraRight) / this.area.step);
            this.area.dyVisibleFrom = (cameraTop < 0) ? 0 : Math.trunc(cameraTop / this.area.step);
            this.area.dyVisibleTo = (cameraBottom > 1) ? this.area.count : this.area.count - Math.trunc((1 - cameraBottom) / this.area.step);
        }
        else {
            this.area.dxVisibleFrom = 1;
            this.area.dxVisibleTo = 0;
            this.area.dyVisibleFrom = 1;
            this.area.dyVisibleTo = 0;
        }
        this.area.dzVisibleFrom = 0;
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
        this.updateVisibleArea();
        //let zz = 0
        /** Итерирование и рендеринг групп буферов WebGL. */
        for (var dx = this.area.dxVisibleFrom; dx < this.area.dxVisibleTo; dx++) {
            for (var dy = this.area.dyVisibleFrom; dy < this.area.dyVisibleTo; dy++) {
                var gr = this.area.groups[dx][dy];
                if (Array.isArray(gr)) {
                    var gr_len = gr.length;
                    for (var dz = this.area.dzVisibleFrom; dz < gr_len; dz++) {
                        this.webgl.setBuffer(dx, dy, dz, 0, 'a_position', 2, 0, 0);
                        this.webgl.setBuffer(dx, dy, dz, 1, 'a_shape', 1, 0, 0);
                        this.webgl.setBuffer(dx, dy, dz, 2, 'a_color', 1, 0, 0);
                        this.webgl.setBuffer(dx, dy, dz, 3, 'a_size', 1, 0, 0);
                        this.webgl.drawPoints(0, gr[dz][1].length);
                        //zz++
                        //console.log(`x=${this.camera.x}, y=${this.camera.y}, zoom=${this.camera.zoom}`)
                    }
                }
            }
        }
        //console.log('zz = ', zz);
        //console.log(`x=${this.camera.x}, y=${this.camera.y}, zoom=${this.camera.zoom}`)
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
let colors2 = ['#000000', '#ff0000', '#00ff00', '#0000ff']

/** Синтетическая итерирующая функция. */
let i = 0
function readNextObject() {
  if (i < n) {
    i++
    return {
      x: Math.random(),
      y: Math.random(),
      shape: randomInt(5),
      size: 30,
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

const size = 30

const data = [
  { x: 0, y: 0, shape: 0, size: size, color: 0 },
  { x: 0, y: 0.5, shape: 0, size: size, color: 1 },
  { x: 0.5, y: 0.5, shape: 0, size: size, color: 2 },
  { x: 0.5, y: 0, shape: 0, size: size, color: 3 },
]

/** ************************************************************************* */

let scatterPlot = new (_splot__WEBPACK_IMPORTED_MODULE_0___default())('canvas1')

scatterPlot.setup({
  iterator: readNextObject,
  //data: data,
  colors: colors,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zdHlsZS5jc3MiLCJ3ZWJwYWNrOi8vLy4vc2hhZGVycy50cyIsIndlYnBhY2s6Ly8vLi9zcGxvdC1jb250cm9sLnRzIiwid2VicGFjazovLy8uL3NwbG90LWRlYnVnLnRzIiwid2VicGFjazovLy8uL3NwbG90LWRlbW8udHMiLCJ3ZWJwYWNrOi8vLy4vc3Bsb3QtZ2xzbC50cyIsIndlYnBhY2s6Ly8vLi9zcGxvdC13ZWJnbC50cyIsIndlYnBhY2s6Ly8vLi9zcGxvdC50cyIsIndlYnBhY2s6Ly8vLi91dGlscy50cyIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vLy4vaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7QUNBYSx1QkFBZSxHQUM1Qix1WEFlQztBQUVZLHlCQUFpQixHQUM5QiwrS0FTQztBQUVZLGNBQU0sR0FBYSxFQUFFO0FBRWxDLGlCQUFTLEdBQUksVUFBVTtJQUN2QixJQUNDO0FBRUQsaUJBQVMsR0FBSSxPQUFPO0lBQ3BCLHFEQUVDO0FBRUQsaUJBQVMsR0FBSSxRQUFRO0lBQ3JCLDBPQU1DO0FBRUQsaUJBQVMsR0FBSSxjQUFjO0lBQzNCLDJOQUlDO0FBRUQsaUJBQVMsR0FBSSxhQUFhO0lBQzFCLCtNQU9DOzs7Ozs7Ozs7Ozs7O0FDL0REOzs7O0dBSUc7QUFDSDtJQW1CRSwyREFBMkQ7SUFDM0QscUJBQ1csS0FBWTtRQUFaLFVBQUssR0FB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QUssRUFBRSxJQUFFLEVBQUUsRUFBRTtZQUMzQyxLQUFLLElBQUksSUFBRSxHQUFHLENBQUMsRUFBRSxJQUFFLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBRSxFQUFFLEVBQUU7Z0JBQzNDLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBRSxDQUFDLENBQUMsSUFBRSxDQUFDLENBQUMsRUFBRTtvQkFDakMsS0FBSyxJQUFJLElBQUUsR0FBRyxDQUFDLEVBQUUsSUFBRSxHQUFHLE1BQU0sQ0FBQyxJQUFFLENBQUMsQ0FBQyxJQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsSUFBRSxFQUFFLEVBQUU7d0JBRWpELElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUTs0QkFDakIsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsSUFBRSxFQUFFLElBQUUsRUFBRSxJQUFFLEVBQUUsQ0FBQyxFQUFFLElBQUksWUFBWSxDQUFDLE1BQU0sQ0FBQyxJQUFFLENBQUMsQ0FBQyxJQUFFLENBQUMsQ0FBQyxJQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dDQUMvRSxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxJQUFFLEVBQUUsSUFBRSxFQUFFLElBQUUsRUFBRSxDQUFDLEVBQUUsSUFBSSxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUUsQ0FBQyxDQUFDLElBQUUsQ0FBQyxDQUFDLElBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0NBQzdFLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLElBQUUsRUFBRSxJQUFFLEVBQUUsSUFBRSxFQUFFLENBQUMsRUFBRSxJQUFJLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBRSxDQUFDLENBQUMsSUFBRSxDQUFDLENBQUMsSUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQ0FDN0UsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsSUFBRSxFQUFFLElBQUUsRUFBRSxJQUFFLEVB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O0FBRTNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQiLCJmaWxlIjoic2NyaXB0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiZXhwb3J0IGNvbnN0IFZFUlRFWF9URU1QTEFURSA9XG5gXG5wcmVjaXNpb24gbG93cCBmbG9hdDtcbmF0dHJpYnV0ZSBsb3dwIHZlYzIgYV9wb3NpdGlvbjtcbmF0dHJpYnV0ZSBmbG9hdCBhX2NvbG9yO1xuYXR0cmlidXRlIGZsb2F0IGFfc2l6ZTtcbmF0dHJpYnV0ZSBmbG9hdCBhX3NoYXBlO1xudW5pZm9ybSBsb3dwIG1hdDMgdV9tYXRyaXg7XG52YXJ5aW5nIGxvd3AgdmVjMyB2X2NvbG9yO1xudmFyeWluZyBmbG9hdCB2X3NoYXBlO1xudm9pZCBtYWluKCkge1xuICBnbF9Qb3NpdGlvbiA9IHZlYzQoKHVfbWF0cml4ICogdmVjMyhhX3Bvc2l0aW9uLCAxKSkueHksIDAuMCwgMS4wKTtcbiAgZ2xfUG9pbnRTaXplID0gYV9zaXplO1xuICB2X3NoYXBlID0gYV9zaGFwZTtcbiAge0NPTE9SLVNFTEVDVElPTn1cbn1cbmBcblxuZXhwb3J0IGNvbnN0IEZSQUdNRU5UX1RFTVBMQVRFID1cbmBcbnByZWNpc2lvbiBsb3dwIGZsb2F0O1xudmFyeWluZyB2ZWMzIHZfY29sb3I7XG52YXJ5aW5nIGZsb2F0IHZfc2hhcGU7XG57U0hBUEVTLUZVTkNUSU9OU31cbnZvaWQgbWFpbigpIHtcbiAge1NIQVBFLVNFTEVDVElPTn1cbiAgZ2xfRnJhZ0NvbG9yID0gdmVjNCh2X2NvbG9yLnJnYiwgMS4wKTtcbn1cbmBcblxuZXhwb3J0IGNvbnN0IFNIQVBFUzogc3RyaW5nW10gPSBbXVxuXG5TSEFQRVNbMF0gPSAgLy8g0JrQstCw0LTRgNCw0YJcbmBcbmBcblxuU0hBUEVTWzFdID0gIC8vINCa0YDRg9CzXG5gXG5pZiAobGVuZ3RoKGdsX1BvaW50Q29vcmQgLSAwLjUpID4gMC41KSBkaXNjYXJkO1xuYFxuXG5TSEFQRVNbMl0gPSAgLy8g0JrRgNC10YHRglxuYFxuaWYgKChhbGwobGVzc1RoYW4oZ2xfUG9pbnRDb29yZCwgdmVjMigwLjMpKSkpIHx8XG4gICgoZ2xfUG9pbnRDb29yZC54ID4gMC43KSAmJiAoZ2xfUG9pbnRDb29yZC55IDwgMC4zKSkgfHxcbiAgKGFsbChncmVhdGVyVGhhbihnbF9Qb2ludENvb3JkLCB2ZWMyKDAuNykpKSkgfHxcbiAgKChnbF9Qb2ludENvb3JkLnggPCAwLjMpICYmIChnbF9Qb2ludENvb3JkLnkgPiAwLjcpKVxuICApIGRpc2NhcmQ7XG5gXG5cblNIQVBFU1szXSA9ICAvLyDQotGA0LXRg9Cz0L7Qu9GM0L3QuNC6XG5gXG52ZWMyIHBvcyA9IHZlYzIoZ2xfUG9pbnRDb29yZC54LCBnbF9Qb2ludENvb3JkLnkgLSAwLjEpIC0gMC41O1xuZmxvYXQgYSA9IGF0YW4ocG9zLngsIHBvcy55KSArIDIuMDk0Mzk1MTAyMzk7XG5pZiAoc3RlcCgwLjI4NSwgY29zKGZsb29yKDAuNSArIGEgLyAyLjA5NDM5NTEwMjM5KSAqIDIuMDk0Mzk1MTAyMzkgLSBhKSAqIGxlbmd0aChwb3MpKSA+IDAuOSkgZGlzY2FyZDtcbmBcblxuU0hBUEVTWzRdID0gIC8vINCo0LXRgdGC0LXRgNC10L3QutCwXG5gXG52ZWMyIHBvcyA9IHZlYzIoMC41KSAtIGdsX1BvaW50Q29vcmQ7XG5mbG9hdCByID0gbGVuZ3RoKHBvcykgKiAxLjYyO1xuZmxvYXQgYSA9IGF0YW4ocG9zLnksIHBvcy54KTtcbmZsb2F0IGYgPSBjb3MoYSAqIDMuMCk7XG5mID0gc3RlcCgwLjAsIGNvcyhhICogMTAuMCkpICogMC4yICsgMC41O1xuaWYgKCBzdGVwKGYsIHIpID4gMC41ICkgZGlzY2FyZDtcbmBcbiIsImltcG9ydCBTUGxvdCBmcm9tICdAL3NwbG90J1xuXG4vKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICpcbiAqINCa0LvQsNGB0YEt0YXQtdC70L/QtdGALCDRgNC10LDQu9C40LfRg9GO0YnQuNC5INC+0LHRgNCw0LHQvtGC0LrRgyDRgdGA0LXQtNGB0YLQsiDQstCy0L7QtNCwICjQvNGL0YjQuCwg0YLRgNC10LrQv9Cw0LTQsCDQuCDRgi7Qvy4pINC4INC80LDRgtC10LzQsNGC0LjRh9C10YHQutC40LUg0YDQsNGB0YfQtdGC0Ysg0YLQtdGF0L3QuNGH0LXRgdC60LjRhSDQtNCw0L3QvdGL0YUsXG4gKiDRgdC+0L7RgtCy0LXRgtGB0LLRg9GO0YnQuNGFINGC0YDQsNC90YHRhNC+0YDQvNCw0YbQuNGP0Lwg0LPRgNCw0YTQuNC60LAg0LTQu9GPINC60LvQsNGB0YHQsCBTcGxvdC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU1Bsb3RDb250b2wgaW1wbGVtZW50cyBTUGxvdEhlbHBlciB7XG5cbiAgLyoqINCi0LXRhdC90LjRh9C10YHQutCw0Y8g0LjQvdGE0L7RgNC80LDRhtC40Y8sINC40YHQv9C+0LvRjNC30YPQtdC80LDRjyDQv9GA0LjQu9C+0LbQtdC90LjQtdC8INC00LvRjyDRgNCw0YHRh9C10YLQsCDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuS4gKi9cbiAgcHVibGljIHRyYW5zZm9ybTogU1Bsb3RUcmFuc2Zvcm0gPSB7XG4gICAgdmlld1Byb2plY3Rpb25NYXQ6IFtdLFxuICAgIHN0YXJ0SW52Vmlld1Byb2pNYXQ6IFtdLFxuICAgIHN0YXJ0Q2FtZXJhOiB7IHg6IDAsIHk6IDAsIHpvb206IDEgfSxcbiAgICBzdGFydFBvczogW10sXG4gIH1cblxuICAvKiog0J/RgNC40LfQvdCw0Log0YLQvtCz0L4sINGH0YLQviDRhdC10LvQv9C10YAg0YPQttC1INC90LDRgdGC0YDQvtC10L0uICovXG4gIHB1YmxpYyBpc1NldHVwZWQ6IGJvb2xlYW4gPSBmYWxzZVxuXG4gIC8qKiDQntCx0YDQsNCx0L7RgtGH0LjQutC4INGB0L7QsdGL0YLQuNC5INGBINC30LDQutGA0LXQv9C70LXQvdC90YvQvNC4INC60L7QvdGC0LXQutGB0YLQsNC80LguICovXG4gIHByb3RlY3RlZCBoYW5kbGVNb3VzZURvd25XaXRoQ29udGV4dDogRXZlbnRMaXN0ZW5lciA9IHRoaXMuaGFuZGxlTW91c2VEb3duLmJpbmQodGhpcykgYXMgRXZlbnRMaXN0ZW5lclxuICBwcm90ZWN0ZWQgaGFuZGxlTW91c2VXaGVlbFdpdGhDb250ZXh0OiBFdmVudExpc3RlbmVyID0gdGhpcy5oYW5kbGVNb3VzZVdoZWVsLmJpbmQodGhpcykgYXMgRXZlbnRMaXN0ZW5lclxuICBwcm90ZWN0ZWQgaGFuZGxlTW91c2VNb3ZlV2l0aENvbnRleHQ6IEV2ZW50TGlzdGVuZXIgPSB0aGlzLmhhbmRsZU1vdXNlTW92ZS5iaW5kKHRoaXMpIGFzIEV2ZW50TGlzdGVuZXJcbiAgcHJvdGVjdGVkIGhhbmRsZU1vdXNlVXBXaXRoQ29udGV4dDogRXZlbnRMaXN0ZW5lciA9IHRoaXMuaGFuZGxlTW91c2VVcC5iaW5kKHRoaXMpIGFzIEV2ZW50TGlzdGVuZXJcblxuICAvKiog0KXQtdC70L/QtdGAINCx0YPQtNC10YIg0LjQvNC10YLRjCDQv9C+0LvQvdGL0Lkg0LTQvtGB0YLRg9C/INC6INGN0LrQt9C10LzQv9C70Y/RgNGDIFNQbG90LiAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICByZWFkb25seSBzcGxvdDogU1Bsb3RcbiAgKSB7IH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQn9C+0LTQs9C+0YLQsNCy0LvQuNCy0LDQtdGCINGF0LXQu9C/0LXRgCDQuiDQuNGB0L/QvtC70YzQt9C+0LLQsNC90LjRji5cbiAgICovXG4gIHNldHVwKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5pc1NldHVwZWQpIHtcbiAgICAgIHRoaXMuaXNTZXR1cGVkID0gdHJ1ZVxuICAgIH1cbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCX0LDQv9GD0YHQutCw0LXRgiDQv9GA0L7RgdC70YPRiNC60YMg0YHQvtCx0YvRgtC40Lkg0LzRi9GI0LguXG4gICAqL1xuICBwdWJsaWMgcnVuKCk6IHZvaWQge1xuICAgIHRoaXMuc3Bsb3QuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMuaGFuZGxlTW91c2VEb3duV2l0aENvbnRleHQpXG4gICAgdGhpcy5zcGxvdC5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignd2hlZWwnLCB0aGlzLmhhbmRsZU1vdXNlV2hlZWxXaXRoQ29udGV4dClcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCe0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdGCINC/0YDQvtGB0LvRg9GI0LrRgyDRgdC+0LHRi9GC0LjQuSDQvNGL0YjQuC5cbiAgICovXG4gIHB1YmxpYyBzdG9wKCk6IHZvaWQge1xuICAgIHRoaXMuc3Bsb3QuY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMuaGFuZGxlTW91c2VEb3duV2l0aENvbnRleHQpXG4gICAgdGhpcy5zcGxvdC5jYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcignd2hlZWwnLCB0aGlzLmhhbmRsZU1vdXNlV2hlZWxXaXRoQ29udGV4dClcbiAgICB0aGlzLnNwbG90LmNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLmhhbmRsZU1vdXNlTW92ZVdpdGhDb250ZXh0KVxuICAgIHRoaXMuc3Bsb3QuY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLmhhbmRsZU1vdXNlVXBXaXRoQ29udGV4dClcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCe0LHQvdC+0LLQu9GP0LXRgiDQvNCw0YLRgNC40YbRgyDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuC5cbiAgICovXG4gIHB1YmxpYyB1cGRhdGVWaWV3UHJvamVjdGlvbigpOiB2b2lkIHtcblxuICAgIGNvbnN0IGNhbnZhcyA9IHRoaXMuc3Bsb3QuY2FudmFzXG4gICAgY29uc3QgY2FtZXJhID0gdGhpcy5zcGxvdC5jYW1lcmFcblxuICAgIGNvbnN0IGQwID0gY2FtZXJhLnpvb20hXG4gICAgY29uc3QgZDEgPSAyIC8gY2FudmFzLndpZHRoICogZDBcbiAgICBjb25zdCBkMiA9IDIgLyBjYW52YXMuaGVpZ2h0ICogZDBcblxuICAgIHRoaXMudHJhbnNmb3JtLnZpZXdQcm9qZWN0aW9uTWF0ID0gWyBkMSwgMCwgMCwgMCwgLWQyLCAwLCAtZDEgKiBjYW1lcmEueCEgLSAxLCBkMiAqIGNhbWVyYS55ISwgMSBdXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQn9GA0LXQvtCx0YDQsNC30YPQtdGCINC60L7QvtGA0LTQuNC90LDRgtGLINC80YvRiNC4INCyIEdMLdC60L7QvtGA0LTQuNC90LDRgtGLLlxuICAgKi9cbiAgcHJvdGVjdGVkIGdldENsaXBTcGFjZU1vdXNlUG9zaXRpb24oZXZlbnQ6IE1vdXNlRXZlbnQpOiBudW1iZXJbXSB7XG5cbiAgICBjb25zdCBjYW52YXMgPSB0aGlzLnNwbG90LmNhbnZhc1xuXG4gICAgY29uc3QgcmVjdCA9IGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuXG4gICAgY29uc3QgY2xpcFggPSAgMiAqICgoZXZlbnQuY2xpZW50WCAtIHJlY3QubGVmdCkgLyBjYW52YXMuY2xpZW50V2lkdGgpIC0gMVxuICAgIGNvbnN0IGNsaXBZID0gLTIgKiAoKGV2ZW50LmNsaWVudFkgLSByZWN0LnRvcCkgLyBjYW52YXMuY2xpZW50SGVpZ2h0KSArIDFcblxuICAgIHJldHVybiBbY2xpcFgsIGNsaXBZXVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0KDQtdCw0LPQuNGA0YPQtdGCINC90LAg0LTQstC40LbQtdC90LjQtSDQvNGL0YjQuCDQsiDQvNC+0LzQtdC90YIsINC60L7Qs9C00LAg0LXQtSDQutC70LDQstC40YjQsCDRg9C00LXRgNC20LjQstCw0LXRgtGB0Y8g0L3QsNC20LDRgtC+0LkuINCc0LXRgtC+0LQg0L/QtdGA0LXQvNC10YnQsNC10YIg0L7QsdC70LDRgdGC0Ywg0LLQuNC00LjQvNC+0YHRgtC4INC90LBcbiAgICog0L/Qu9C+0YHQutC+0YHRgtC4INCy0LzQtdGB0YLQtSDRgSDQtNCy0LjQttC10L3QuNC10Lwg0LzRi9GI0LguXG4gICAqL1xuICBwcm90ZWN0ZWQgaGFuZGxlTW91c2VNb3ZlKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG5cbiAgICBjb25zdCBzcGxvdCA9IHRoaXMuc3Bsb3RcbiAgICBjb25zdCB0cmFuc2Zvcm0gPSB0aGlzLnRyYW5zZm9ybVxuICAgIGNvbnN0IG1hdHJpeCA9IHRyYW5zZm9ybS5zdGFydEludlZpZXdQcm9qTWF0XG4gICAgY29uc3QgW2NsaXBYLCBjbGlwWV0gPSB0aGlzLmdldENsaXBTcGFjZU1vdXNlUG9zaXRpb24oZXZlbnQpXG5cbiAgICBzcGxvdC5jYW1lcmEueCA9IHRyYW5zZm9ybS5zdGFydENhbWVyYS54ISArIHRyYW5zZm9ybS5zdGFydFBvc1swXSAtIGNsaXBYICogbWF0cml4WzBdIC0gbWF0cml4WzZdXG4gICAgc3Bsb3QuY2FtZXJhLnkgPSB0cmFuc2Zvcm0uc3RhcnRDYW1lcmEueSEgKyB0cmFuc2Zvcm0uc3RhcnRQb3NbMV0gLSBjbGlwWSAqIG1hdHJpeFs0XSAtIG1hdHJpeFs3XVxuXG4gICAgc3Bsb3QucmVuZGVyKClcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCg0LXQsNCz0LjRgNGD0LXRgiDQvdCwINC+0YLQttCw0YLQuNC1INC60LvQsNCy0LjRiNC4INC80YvRiNC4LiDQkiDQvNC+0LzQtdC90YIg0L7RgtC20LDRgtC40Y8g0LrQu9Cw0LLQuNGI0Lgg0LDQvdCw0LvQuNC3INC00LLQuNC20LXQvdC40Y8g0LzRi9GI0Lgg0YEg0LfQsNC20LDRgtC+0Lkg0LrQu9Cw0LLQuNGI0LXQuSDQv9GA0LXQutGA0LDRidCw0LXRgtGB0Y8uXG4gICAqL1xuICBwcm90ZWN0ZWQgaGFuZGxlTW91c2VVcChldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuXG4gICAgdGhpcy5zcGxvdC5yZW5kZXIoKVxuXG4gICAgZXZlbnQudGFyZ2V0IS5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLmhhbmRsZU1vdXNlTW92ZVdpdGhDb250ZXh0KVxuICAgIGV2ZW50LnRhcmdldCEucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuaGFuZGxlTW91c2VVcFdpdGhDb250ZXh0KVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0KDQtdCw0LPQuNGA0YPQtdGCINC90LAg0L3QsNC20LDRgtC40LUg0LrQu9Cw0LLQuNGI0Lgg0LzRi9GI0LguINCSINC80L7QvNC10L3RgiDQvdCw0LbQsNGC0LjRjyDQuCDRg9C00LXRgNC20LDQvdC40Y8g0LrQu9Cw0LLQuNGI0Lgg0LfQsNC/0YPRgdC60LDQtdGC0YHRjyDQsNC90LDQu9C40Lcg0LTQstC40LbQtdC90LjRjyDQvNGL0YjQuCAo0YEg0LfQsNC20LDRgtC+0LlcbiAgICog0LrQu9Cw0LLQuNGI0LXQuSkuXG4gICAqL1xuICBwcm90ZWN0ZWQgaGFuZGxlTW91c2VEb3duKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG5cbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgICBjb25zdCBzcGxvdCA9IHRoaXMuc3Bsb3RcbiAgICBjb25zdCB0cmFuc2Zvcm0gPSB0aGlzLnRyYW5zZm9ybVxuXG4gICAgc3Bsb3QuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMuaGFuZGxlTW91c2VNb3ZlV2l0aENvbnRleHQpXG4gICAgc3Bsb3QuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLmhhbmRsZU1vdXNlVXBXaXRoQ29udGV4dClcblxuICAgIGxldCBtYXRyaXggPSB0cmFuc2Zvcm0udmlld1Byb2plY3Rpb25NYXRcbiAgICB0cmFuc2Zvcm0uc3RhcnRJbnZWaWV3UHJvak1hdCA9IFsxIC8gbWF0cml4WzBdLCAwLCAwLCAwLCAxIC8gbWF0cml4WzRdLCAwLCAtbWF0cml4WzZdIC8gbWF0cml4WzBdLCAtbWF0cml4WzddIC8gbWF0cml4WzRdLCAxXVxuXG4gICAgdHJhbnNmb3JtLnN0YXJ0Q2FtZXJhID0geyB4OiBzcGxvdC5jYW1lcmEueCwgeTogc3Bsb3QuY2FtZXJhLnksIHpvb206IHNwbG90LmNhbWVyYS56b29tIH1cblxuICAgIGNvbnN0IFtjbGlwWCwgY2xpcFldID0gdGhpcy5nZXRDbGlwU3BhY2VNb3VzZVBvc2l0aW9uKGV2ZW50KVxuICAgIG1hdHJpeCA9IHRyYW5zZm9ybS5zdGFydEludlZpZXdQcm9qTWF0XG4gICAgdHJhbnNmb3JtLnN0YXJ0UG9zWzBdID0gY2xpcFggKiBtYXRyaXhbMF0gKyBtYXRyaXhbNl1cbiAgICB0cmFuc2Zvcm0uc3RhcnRQb3NbMV0gPSBjbGlwWSAqIG1hdHJpeFs0XSArIG1hdHJpeFs3XVxuXG4gICAgc3Bsb3QucmVuZGVyKClcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCg0LXQsNCz0LjRgNGD0LXRgiDQvdCwINC30YPQvNC40YDQvtCy0LDQvdC40LUg0LzRi9GI0LguINCSINC80L7QvNC10L3RgiDQt9GD0LzQuNGA0L7QstCw0L3QuNGPINC80YvRiNC4INC/0YDQvtC40YHRhdC+0LTQuNGCINC30YPQvNC40YDQvtCy0LDQvdC40LUg0LrQvtC+0YDQtNC40L3QsNGC0L3QvtC5INC/0LvQvtGB0LrQvtGB0YLQuC5cbiAgICovXG4gIHByb3RlY3RlZCBoYW5kbGVNb3VzZVdoZWVsKGV2ZW50OiBXaGVlbEV2ZW50KTogdm9pZCB7XG5cbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgICBjb25zdCBjYW1lcmEgPSB0aGlzLnNwbG90LmNhbWVyYVxuXG4gICAgLyoqINCS0YvRh9C40YHQu9C10L3QuNC1INC/0L7Qt9C40YbQuNC4INC80YvRiNC4INCyIEdMLdC60L7QvtGA0LTQuNC90LDRgtCw0YUuICovXG4gICAgY29uc3QgW2NsaXBYLCBjbGlwWV0gPSB0aGlzLmdldENsaXBTcGFjZU1vdXNlUG9zaXRpb24oZXZlbnQpXG5cbiAgICAvKiog0J/QvtC30LjRhtC40Y8g0LzRi9GI0Lgg0LTQviDQt9GD0LzQuNGA0L7QstCw0L3QuNGPLiAqL1xuICAgIGxldCBtYXRyaXggPSB0aGlzLnRyYW5zZm9ybS52aWV3UHJvamVjdGlvbk1hdFxuICAgIGNvbnN0IHByZVpvb21YID0gKGNsaXBYIC0gbWF0cml4WzZdKSAvIG1hdHJpeFswXVxuICAgIGNvbnN0IHByZVpvb21ZID0gKGNsaXBZICAtIG1hdHJpeFs3XSkgLyBtYXRyaXhbNF1cblxuICAgIC8qKiDQndC+0LLQvtC1INC30L3QsNGH0LXQvdC40LUg0LfRg9C80LAg0L7QsdC70LDRgdGC0Lgg0L/RgNC+0YHQvNC+0YLRgNCwINGN0LrRgdC/0L7QvdC10L3RhtC40LDQu9GM0L3QviDQt9Cw0LLQuNGB0LjRgiDQvtGCINCy0LXQu9C40YfQuNC90Ysg0LfRg9C80LjRgNC+0LLQsNC90LjRjyDQvNGL0YjQuC4gKi9cbiAgICBjb25zdCBuZXdab29tID0gY2FtZXJhLnpvb20hICogTWF0aC5wb3coMiwgZXZlbnQuZGVsdGFZICogLTAuMDEpXG5cbiAgICAvKiog0JzQsNC60YHQuNC80LDQu9GM0L3QvtC1INC4INC80LjQvdC40LzQsNC70YzQvdC+0LUg0LfQvdCw0YfQtdC90LjRjyDQt9GD0LzQsCDQvtCx0LvQsNGB0YLQuCDQv9GA0L7RgdC80L7RgtGA0LAuICovXG4gICAgY2FtZXJhLnpvb20gPSBNYXRoLm1heChjYW1lcmEubWluWm9vbSEsIE1hdGgubWluKGNhbWVyYS5tYXhab29tISwgbmV3Wm9vbSkpXG5cbiAgICAvKiog0J7QsdC90L7QstC70LXQvdC40LUg0LzQsNGC0YDQuNGG0Ysg0YLRgNCw0L3RgdGE0L7RgNC80LDRhtC40LguICovXG4gICAgdGhpcy51cGRhdGVWaWV3UHJvamVjdGlvbigpXG5cbiAgICAvKiog0J/QvtC30LjRhtC40Y8g0LzRi9GI0Lgg0L/QvtGB0LvQtSDQt9GD0LzQuNGA0L7QstCw0L3QuNGPLiAqL1xuICAgIG1hdHJpeCA9IHRoaXMudHJhbnNmb3JtLnZpZXdQcm9qZWN0aW9uTWF0XG4gICAgY29uc3QgcG9zdFpvb21YID0gKGNsaXBYIC0gbWF0cml4WzZdKSAvIG1hdHJpeFswXVxuICAgIGNvbnN0IHBvc3Rab29tWSA9IChjbGlwWSAtIG1hdHJpeFs3XSkgLyBtYXRyaXhbNF1cblxuICAgIC8qKiDQktGL0YfQuNGB0LvQtdC90LjQtSDQvdC+0LLQvtCz0L4g0L/QvtC70L7QttC10L3QuNGPINC+0LHQu9Cw0YHRgtC4INC/0YDQvtGB0LzQvtGC0YDQsCDQv9C+0YHQu9C1INC30YPQvNC40YDQvtCy0LDQvdC40Y8uICovXG4gICAgY2FtZXJhLnghICs9IHByZVpvb21YIC0gcG9zdFpvb21YXG4gICAgY2FtZXJhLnkhICs9IHByZVpvb21ZIC0gcG9zdFpvb21ZXG5cbiAgICB0aGlzLnNwbG90LnJlbmRlcigpXG4gIH1cbn1cbiIsImltcG9ydCBTUGxvdCBmcm9tICdAL3NwbG90J1xuaW1wb3J0IHsgZ2V0Q3VycmVudFRpbWUgfSBmcm9tICdAL3V0aWxzJ1xuXG4vKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICpcbiAqINCa0LvQsNGB0YEt0YXQtdC70L/QtdGALCDRgNC10LDQu9C40LfRg9GO0YnQuNC5INC/0L7QtNC00LXRgNC20LrRgyDRgNC10LbQuNC80LAg0L7RgtC70LDQtNC60Lgg0LTQu9GPINC60LvQsNGB0YHQsCBTUGxvdC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU1Bsb3REZWJ1ZyBpbXBsZW1lbnRzIFNQbG90SGVscGVyIHtcblxuICAvKiog0J/RgNC40LfQvdCw0Log0LDQutGC0LjQstCw0YbQuNC4INGA0LXQttC40Lwg0L7RgtC70LDQtNC60LguICovXG4gIHB1YmxpYyBpc0VuYWJsZTogYm9vbGVhbiA9IGZhbHNlXG5cbiAgLyoqINCh0YLQuNC70Ywg0LfQsNCz0L7Qu9C+0LLQutCwINGA0LXQttC40LzQsCDQvtGC0LvQsNC00LrQuC4gKi9cbiAgcHVibGljIGhlYWRlclN0eWxlOiBzdHJpbmcgPSAnZm9udC13ZWlnaHQ6IGJvbGQ7IGNvbG9yOiAjZmZmZmZmOyBiYWNrZ3JvdW5kLWNvbG9yOiAjY2MwMDAwOydcblxuICAvKiog0KHRgtC40LvRjCDQt9Cw0LPQvtC70L7QstC60LAg0LPRgNGD0L/Qv9GLINC/0LDRgNCw0LzQtdGC0YDQvtCyLiAqL1xuICBwdWJsaWMgZ3JvdXBTdHlsZTogc3RyaW5nID0gJ2ZvbnQtd2VpZ2h0OiBib2xkOyBjb2xvcjogI2ZmZmZmZjsnXG5cbiAgLyoqINCf0YDQuNC30L3QsNC6INGC0L7Qs9C+LCDRh9GC0L4g0YXQtdC70L/QtdGAINGD0LbQtSDQvdCw0YHRgtGA0L7QtdC9LiAqL1xuICBwdWJsaWMgaXNTZXR1cGVkOiBib29sZWFuID0gZmFsc2VcblxuICAvKiog0KXQtdC70L/QtdGAINCx0YPQtNC10YIg0LjQvNC10YLRjCDQv9C+0LvQvdGL0Lkg0LTQvtGB0YLRg9C/INC6INGN0LrQt9C10LzQv9C70Y/RgNGDIFNQbG90LiAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICByZWFkb25seSBzcGxvdDogU1Bsb3RcbiAgKSB7fVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCf0L7QtNCz0L7RgtCw0LLQu9C40LLQsNC10YIg0YXQtdC70L/QtdGAINC6INC40YHQv9C+0LvRjNC30L7QstCw0L3QuNGOLlxuICAgKi9cbiAgcHVibGljIHNldHVwKGNsZWFyQ29uc29sZTogYm9vbGVhbiA9IGZhbHNlKTogdm9pZCB7XG5cbiAgICBpZiAoIXRoaXMuaXNTZXR1cGVkKSB7XG5cbiAgICAgIGlmIChjbGVhckNvbnNvbGUpIHtcbiAgICAgICAgY29uc29sZS5jbGVhcigpXG4gICAgICB9XG5cbiAgICAgIHRoaXMuaXNTZXR1cGVkID0gdHJ1ZVxuICAgIH1cbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCS0YvQstC+0LTQuNGCINCyINC60L7QvdGB0L7Qu9GMINC+0YLQu9Cw0LTQvtGH0L3Rg9GOINC40L3RhNC+0YDQvNCw0YbQuNGOLCDQtdGB0LvQuCDQstC60LvRjtGH0LXQvSDRgNC10LbQuNC8INC+0YLQu9Cw0LTQutC4LlxuICAgKlxuICAgKiBAcmVtYXJrc1xuICAgKiDQntGC0LvQsNC00L7Rh9C90LDRjyDQuNC90YTQvtGA0LzQsNGG0LjRjyDQstGL0LLQvtC00LjRgtGB0Y8g0LHQu9C+0LrQsNC80LguINCd0LDQt9Cy0LDQvdC40Y8g0LHQu9C+0LrQvtCyINC/0LXRgNC10LTQsNGO0YLRgdGPINCyINC80LXRgtC+0LQg0L/QtdGA0LXRh9C40YHQu9C10L3QuNC10Lwg0YHRgtGA0L7Qui4g0JrQsNC20LTQsNGPINGB0YLRgNC+0LrQsFxuICAgKiDQuNC90YLQtdGA0L/RgNC10YLQuNGA0YPQtdGC0YHRjyDQutCw0Log0LjQvNGPINC80LXRgtC+0LTQsC4g0JXRgdC70Lgg0L3Rg9C20L3Ri9C1INC80LXRgtC+0LTRiyDQstGL0LLQvtC00LAg0LHQu9C+0LrQsCDRgdGD0YnQtdGB0YLQstGD0Y7RgiAtINC+0L3QuCDQstGL0LfRi9Cy0LDRjtGC0YHRjy4g0JXRgdC70Lgg0LzQtdGC0L7QtNCwINGBINC90YPQttC90YvQvFxuICAgKiDQvdCw0LfQstCw0L3QuNC10Lwg0L3QtSDRgdGD0YnQtdGB0YLQstGD0LXRgiAtINCz0LXQvdC10YDQuNGA0YPQtdGC0YHRjyDQvtGI0LjQsdC60LAuXG4gICAqXG4gICAqIEBwYXJhbSBsb2dJdGVtcyAtINCf0LXRgNC10YfQuNGB0LvQtdC90LjQtSDRgdGC0YDQvtC6INGBINC90LDQt9Cy0LDQvdC40Y/QvNC4INC+0YLQu9Cw0LTQvtGH0L3Ri9GFINCx0LvQvtC60L7Qsiwg0LrQvtGC0L7RgNGL0LUg0L3Rg9C20L3QviDQvtGC0L7QsdGA0LDQt9C40YLRjCDQsiDQutC+0L3RgdC+0LvQuC5cbiAgICovXG4gIHB1YmxpYyBsb2coLi4ubG9nSXRlbXM6IHN0cmluZ1tdKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuaXNFbmFibGUpIHtcbiAgICAgIGxvZ0l0ZW1zLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgIGlmICh0eXBlb2YgKHRoaXMgYXMgYW55KVtpdGVtXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICh0aGlzIGFzIGFueSlbaXRlbV0oKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcign0J7RgtC70LDQtNC+0YfQvdC+0LPQviDQsdC70L7QutCwICcgKyBpdGVtICsgJ1wiINC90LUg0YHRg9GJ0LXRgdGC0LLRg9C10YIhJylcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQktGL0LLQvtC00LjRgiDRgdC+0L7QsdGJ0LXQvdC40LUg0L7QsSDQvtGI0LjQsdC60LUuXG4gICAqL1xuICBwdWJsaWMgZXJyb3IobWVzc2FnZTogc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuaXNFbmFibGUpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IobWVzc2FnZSlcbiAgICB9XG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQktGL0LLQvtC00LjRgiDQstGB0YLRg9C/0LjRgtC10LvRjNC90YPRjiDRh9Cw0YHRgtGMINC+INGA0LXQttC40LzQtSDQvtGC0LvQsNC00LrQuC5cbiAgICovXG4gIHB1YmxpYyBpbnRybygpOiB2b2lkIHtcbiAgICBjb25zb2xlLmxvZygnJWPQntGC0LvQsNC00LrQsCBTUGxvdCDQvdCwINC+0LHRitC10LrRgtC1ICMnICsgdGhpcy5zcGxvdC5jYW52YXMuaWQsIHRoaXMuaGVhZGVyU3R5bGUpXG5cbiAgICBpZiAodGhpcy5zcGxvdC5kZW1vLmlzRW5hYmxlKSB7XG4gICAgICBjb25zb2xlLmxvZygnJWPQktC60LvRjtGH0LXQvSDQtNC10LzQvtC90YHRgtGA0LDRhtC40L7QvdC90YvQuSDRgNC10LbQuNC8INC00LDQvdC90YvRhScsIHRoaXMuZ3JvdXBTdHlsZSlcbiAgICB9XG5cbiAgICBjb25zb2xlLmdyb3VwKCclY9Cf0YDQtdC00YPQv9GA0LXQttC00LXQvdC40LUnLCB0aGlzLmdyb3VwU3R5bGUpXG4gICAgY29uc29sZS5sb2coJ9Ce0YLQutGA0YvRgtCw0Y8g0LrQvtC90YHQvtC70Ywg0LHRgNCw0YPQt9C10YDQsCDQuCDQtNGA0YPQs9C40LUg0LDQutGC0LjQstC90YvQtSDRgdGA0LXQtNGB0YLQstCwINC60L7QvdGC0YDQvtC70Y8g0YDQsNC30YDQsNCx0L7RgtC60Lgg0YHRg9GJ0LXRgdGC0LLQtdC90L3QviDRgdC90LjQttCw0Y7RgiDQv9GA0L7QuNC30LLQvtC00LjRgtC10LvRjNC90L7RgdGC0Ywg0LLRi9GB0L7QutC+0L3QsNCz0YDRg9C20LXQvdC90YvRhSDQv9GA0LjQu9C+0LbQtdC90LjQuS4g0JTQu9GPINC+0LHRitC10LrRgtC40LLQvdC+0LPQviDQsNC90LDQu9C40LfQsCDQv9GA0L7QuNC30LLQvtC00LjRgtC10LvRjNC90L7RgdGC0Lgg0LLRgdC1INC/0L7QtNC+0LHQvdGL0LUg0YHRgNC10LTRgdGC0LLQsCDQtNC+0LvQttC90Ysg0LHRi9GC0Ywg0L7RgtC60LvRjtGH0LXQvdGLLCDQsCDQutC+0L3RgdC+0LvRjCDQsdGAetCw0YPQt9C10YDQsCDQt9Cw0LrRgNGL0YLQsC4g0J3QtdC60L7RgtC+0YDRi9C1INC00LDQvdC90YvQtSDQvtGC0LvQsNC00L7Rh9C90L7QuSDQuNC90YTQvtGA0LzQsNGG0LjQuCDQsiDQt9Cw0LLQuNGB0LjQvNC+0YHRgtC4INC+0YIg0LjRgdC/0L7Qu9GM0LfRg9C10LzQvtCz0L4g0LHRgNCw0YPQt9C10YDQsCDQvNC+0LPRg9GCINC90LUg0L7RgtC+0LHRgNCw0LbQsNGC0YzRgdGPINC40LvQuCDQvtGC0L7QsdGA0LDQttCw0YLRjNGB0Y8g0L3QtdC60L7RgNGA0LXQutGC0L3Qvi4g0KHRgNC10LTRgdGC0LLQviDQvtGC0LvQsNC00LrQuCDQv9GA0L7RgtC10YHRgtC40YDQvtCy0LDQvdC+INCyINCx0YDQsNGD0LfQtdGA0LUgR29vZ2xlIENocm9tZSB2LjkwJylcbiAgICBjb25zb2xlLmdyb3VwRW5kKClcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCS0YvQstC+0LTQuNGCINC40L3RhNC+0YDQvNCw0YbQuNGOINC+INCz0YDQsNGE0LjRh9C10YHQutC+0Lkg0YHQuNGB0YLQtdC80LUg0LrQu9C40LXQvdGC0LAuXG4gICAqL1xuICBwdWJsaWMgZ3B1KCk6IHZvaWQge1xuICAgIGNvbnNvbGUuZ3JvdXAoJyVj0JLQuNC00LXQvtGB0LjRgdGC0LXQvNCwJywgdGhpcy5ncm91cFN0eWxlKVxuICAgIGNvbnNvbGUubG9nKCfQk9GA0LDRhNC40YfQtdGB0LrQsNGPINC60LDRgNGC0LA6ICcgKyB0aGlzLnNwbG90LndlYmdsLmdwdS5oYXJkd2FyZSlcbiAgICBjb25zb2xlLmxvZygn0JLQtdGA0YHQuNGPIEdMOiAnICsgdGhpcy5zcGxvdC53ZWJnbC5ncHUuc29mdHdhcmUpXG4gICAgY29uc29sZS5ncm91cEVuZCgpXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQktGL0LLQvtC00LjRgiDQuNC90YTQvtGA0LzQsNGG0LjRjyDQviDRgtC10LrRg9GJ0LXQvCDRjdC60LfQtdC80L/Qu9GP0YDQtSDQutC70LDRgdGB0LAgU1Bsb3QuXG4gICAqL1xuICBwdWJsaWMgaW5zdGFuY2UoKTogdm9pZCB7XG5cbiAgICBjb25zb2xlLmdyb3VwKCclY9Cd0LDRgdGC0YDQvtC50LrQsCDQv9Cw0YDQsNC80LXRgtGA0L7QsiDRjdC60LfQtdC80L/Qu9GP0YDQsCcsIHRoaXMuZ3JvdXBTdHlsZSlcbiAgICBjb25zb2xlLmRpcih0aGlzLnNwbG90KVxuICAgIGNvbnNvbGUubG9nKCfQoNCw0LfQvNC10YAg0LrQsNC90LLQsNGB0LA6ICcgKyB0aGlzLnNwbG90LmNhbnZhcy53aWR0aCArICcgeCAnICsgdGhpcy5zcGxvdC5jYW52YXMuaGVpZ2h0ICsgJyBweCcpXG5cbiAgICBpZiAodGhpcy5zcGxvdC5kZW1vLmlzRW5hYmxlKSB7XG4gICAgICBjb25zb2xlLmxvZygn0KHQv9C+0YHQvtCxINC/0L7Qu9GD0YfQtdC90LjRjyDQtNCw0L3QvdGL0YU6ICcgKyAn0LTQtdC80L4t0LTQsNC90L3Ri9C1JylcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ9Ch0L/QvtGB0L7QsSDQv9C+0LvRg9GH0LXQvdC40Y8g0LTQsNC90L3Ri9GFOiAnICsgJ9C40YLQtdGA0LjRgNC+0LLQsNC90LjQtScpXG4gICAgfVxuICAgIGNvbnNvbGUuZ3JvdXBFbmQoKVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JLRi9Cy0L7QtNC40YIg0LrQvtC00Ysg0YjQtdC50LTQtdGA0L7Qsi5cbiAgICovXG4gIHB1YmxpYyBzaGFkZXJzKCk6IHZvaWQge1xuICAgIGNvbnNvbGUuZ3JvdXAoJyVj0KHQvtC30LTQsNC9INCy0LXRgNGI0LjQvdC90YvQuSDRiNC10LnQtNC10YA6ICcsIHRoaXMuZ3JvdXBTdHlsZSlcbiAgICBjb25zb2xlLmxvZyh0aGlzLnNwbG90Lmdsc2wudmVydFNoYWRlclNvdXJjZSlcbiAgICBjb25zb2xlLmdyb3VwRW5kKClcbiAgICBjb25zb2xlLmdyb3VwKCclY9Ch0L7Qt9C00LDQvSDRhNGA0LDQs9C80LXQvdGC0L3Ri9C5INGI0LXQudC00LXRgDogJywgdGhpcy5ncm91cFN0eWxlKVxuICAgIGNvbnNvbGUubG9nKHRoaXMuc3Bsb3QuZ2xzbC5mcmFnU2hhZGVyU291cmNlKVxuICAgIGNvbnNvbGUuZ3JvdXBFbmQoKVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JLRi9Cy0L7QtNC40YIg0YHQvtC+0LHRidC10L3QuNC1INC+INC90LDRh9Cw0LvQtSDQv9GA0L7RhtC10YHRgdC1INC30LDQs9GA0YPQt9C60Lgg0LTQsNC90L3Ri9GFLlxuICAgKi9cbiAgcHVibGljIGxvYWRpbmcoKTogdm9pZCB7XG4gICAgY29uc29sZS5sb2coJyVj0JfQsNC/0YPRidC10L0g0L/RgNC+0YbQtdGB0YEg0LfQsNCz0YDRg9C30LrQuCDQtNCw0L3QvdGL0YUgWycgKyBnZXRDdXJyZW50VGltZSgpICsgJ10uLi4nLCB0aGlzLmdyb3VwU3R5bGUpXG4gICAgY29uc29sZS50aW1lKCfQlNC70LjRgtC10LvRjNC90L7RgdGC0YwnKVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JLRi9Cy0L7QtNC40YIg0YHRgtCw0YLQuNGB0YLQuNC60YMg0L/QviDQt9Cw0LLQtdGA0YjQtdC90LjQuCDQv9GA0L7RhtC10YHRgdCwINC30LDQs9GA0YPQt9C60Lgg0LTQsNC90L3Ri9GFLlxuICAgKi9cbiAgcHVibGljIGxvYWRlZCgpOiB2b2lkIHtcbiAgICBjb25zb2xlLmdyb3VwKCclY9CX0LDQs9GA0YPQt9C60LAg0LTQsNC90L3Ri9GFINC30LDQstC10YDRiNC10L3QsCBbJyArIGdldEN1cnJlbnRUaW1lKCkgKyAnXScsIHRoaXMuZ3JvdXBTdHlsZSlcbiAgICBjb25zb2xlLnRpbWVFbmQoJ9CU0LvQuNGC0LXQu9GM0L3QvtGB0YLRjCcpXG4gICAgY29uc29sZS5sb2coJ9Cg0LXQt9GD0LvRjNGC0LDRgjogJyArICgodGhpcy5zcGxvdC5zdGF0cy5vYmpUb3RhbENvdW50ID49IHRoaXMuc3Bsb3QuZ2xvYmFsTGltaXQpID9cbiAgICAgICfQtNC+0YHRgtC40LPQvdGD0YIg0LvQuNC80LjRgiDQvtCx0YrQtdC60YLQvtCyICgnICsgdGhpcy5zcGxvdC5nbG9iYWxMaW1pdC50b0xvY2FsZVN0cmluZygpICsgJyknIDpcbiAgICAgICfQvtCx0YDQsNCx0L7RgtCw0L3RiyDQstGB0LUg0L7QsdGK0LXQutGC0YsnKSlcbiAgICBjb25zb2xlLmxvZygn0KDQsNGB0YXQvtC0INCy0LjQtNC10L7Qv9Cw0LzRj9GC0Lg6ICcgKyAodGhpcy5zcGxvdC5zdGF0cy5tZW1Vc2FnZSAvIDEwMDAwMDApLnRvRml4ZWQoMikudG9Mb2NhbGVTdHJpbmcoKSArICcg0JzQkScpXG4gICAgY29uc29sZS5sb2coJ9Ca0L7Quy3QstC+INC+0LHRitC10LrRgtC+0LI6ICcgKyB0aGlzLnNwbG90LnN0YXRzLm9ialRvdGFsQ291bnQudG9Mb2NhbGVTdHJpbmcoKSlcbiAgICBjb25zb2xlLmxvZygn0KHQvtC30LTQsNC90L4g0LLQuNC00LXQvtCx0YPRhNC10YDQvtCyOiAnICsgdGhpcy5zcGxvdC5zdGF0cy5ncm91cHNDb3VudC50b0xvY2FsZVN0cmluZygpKVxuICAgIGNvbnNvbGUubG9nKGDQk9GA0YPQv9C/0LjRgNC+0LLQutCwINCy0LjQtNC10L7QsdGD0YTQtdGA0L7QsjogJHt0aGlzLnNwbG90LmFyZWEuY291bnR9IHggJHt0aGlzLnNwbG90LmFyZWEuY291bnR9YClcbiAgICBjb25zb2xlLmxvZyhg0JzQsNC60YHQuNC80LDQu9GM0L3QvtC1INC60L7Quy3QstC+IHot0LPRgNGD0L/QvzogJHt0aGlzLnNwbG90LnN0YXRzLm1heERlcHRoQ291bnR9YClcbiAgICBjb25zb2xlLmxvZyhg0KjQsNCzINC00LXQu9C10L3QuNGPINC90LAg0LPRgNGD0L/Qv9GLOiAke3RoaXMuc3Bsb3QuYXJlYS5zdGVwfWApXG4gICAgY29uc29sZS5sb2coJ9Cg0LDQt9C80LXRgNGLINC+0LHRitC10LrRgtC+0LI6IG1pbiA9ICcgKyB0aGlzLnNwbG90LnN0YXRzLm1pbk9iamVjdFNpemUgKyAnOyBtYXggPSAnICsgdGhpcy5zcGxvdC5zdGF0cy5tYXhPYmplY3RTaXplKVxuICAgIGNvbnNvbGUuZ3JvdXBFbmQoKVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JLRi9Cy0L7QtNC40YIg0YHQvtC+0LHRidC10L3QuNC1INC+INC30LDQv9GD0YHQutC1INGA0LXQvdC00LXRgNCwLlxuICAgKi9cbiAgcHVibGljIHN0YXJ0ZWQoKTogdm9pZCB7XG4gICAgY29uc29sZS5sb2coJyVj0KDQtdC90LTQtdGAINC30LDQv9GD0YnQtdC9JywgdGhpcy5ncm91cFN0eWxlKVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JLRi9Cy0L7QtNC40YIg0YHQvtC+0LHRidC10L3QuNC1INC+0LEg0L7RgdGC0LDQvdC+0LLQutC1INGA0LXQvdC00LXRgNCwLlxuICAgKi9cbiAgcHVibGljIHN0b3BlZCgpOiB2b2lkIHtcbiAgICBjb25zb2xlLmxvZygnJWPQoNC10L3QtNC10YAg0L7RgdGC0LDQvdC+0LLQu9C10L0nLCB0aGlzLmdyb3VwU3R5bGUpXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQktGL0LLQvtC00LjRgiDRgdC+0L7QsdGI0LXQvdC40LUg0L7QsSDQvtGH0LjRgdGC0LrQtSDQvtCx0LvQsNGB0YLQuCDRgNC10L3QtNC10YDQsC5cbiAgICovXG4gIHB1YmxpYyBjbGVhcmVkKGNvbG9yOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zb2xlLmxvZygnJWPQntCx0LvQsNGB0YLRjCDRgNC10L3QtNC10YDQsCDQvtGH0LjRidC10L3QsCBbJyArIGNvbG9yICsgJ10nLCB0aGlzLmdyb3VwU3R5bGUpO1xuICB9XG59XG4iLCJpbXBvcnQgU1Bsb3QgZnJvbSAnQC9zcGxvdCdcbmltcG9ydCB7IHJhbmRvbUludCB9IGZyb20gJ0AvdXRpbHMnXG5cbi8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKlxuICog0JrQu9Cw0YHRgS3RhdC10LvQv9C10YAsINGA0LXQsNC70LjQt9GD0Y7RidC40Lkg0L/QvtC00LTQtdGA0LbQutGDINGA0LXQttC40LzQsCDQtNC10LzQvtC90YHRgtGA0LDRhtC40L7QvdC90YvRhSDQtNCw0L3QvdGL0YUg0LTQu9GPINC60LvQsNGB0YHQsCBTUGxvdC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU1Bsb3REZW1vIGltcGxlbWVudHMgU1Bsb3RIZWxwZXIge1xuXG4gIC8qKiDQn9GA0LjQt9C90LDQuiDQsNC60YLQuNCy0LDRhtC40Lgg0LTQtdC80L4t0YDQtdC20LjQvNCwLiAqL1xuICBwdWJsaWMgaXNFbmFibGU6IGJvb2xlYW4gPSBmYWxzZVxuXG4gIC8qKiDQmtC+0LvQuNGH0LXRgdGC0LLQviDQsdGK0LXQutGC0L7Qsi4gKi9cbiAgcHVibGljIGFtb3VudDogbnVtYmVyID0gMV8wMDBfMDAwXG5cbiAgLyoqINCc0LjQvdC40LzQsNC70YzQvdGL0Lkg0YDQsNC30LzQtdGAINC+0LHRitC10LrRgtC+0LIuICovXG4gIHB1YmxpYyBzaXplTWluOiBudW1iZXIgPSAxMFxuXG4gIC8qKiDQnNCw0LrRgdC40LzQsNC70YzQvdGL0Lkg0YDQsNC30LzQtdGAINC+0LHRitC10LrRgtC+0LIuICovXG4gIHB1YmxpYyBzaXplTWF4OiBudW1iZXIgPSAzMFxuXG4gIC8qKiDQptCy0LXRgtC+0LLQsNGPINC/0LDQu9C40YLRgNCwINC+0LHRitC10LrRgtC+0LIuICovXG4gIHB1YmxpYyBjb2xvcnM6IHN0cmluZ1tdID0gW1xuICAgICcjRDgxQzAxJywgJyNFOTk2N0EnLCAnI0JBNTVEMycsICcjRkZENzAwJywgJyNGRkU0QjUnLCAnI0ZGOEMwMCcsXG4gICAgJyMyMjhCMjInLCAnIzkwRUU5MCcsICcjNDE2OUUxJywgJyMwMEJGRkYnLCAnIzhCNDUxMycsICcjMDBDRUQxJ1xuICBdXG5cbiAgLyoqINCf0YDQuNC30L3QsNC6INGC0L7Qs9C+LCDRh9GC0L4g0YXQtdC70L/QtdGAINGD0LbQtSDQvdCw0YHRgtGA0L7QtdC9LiAqL1xuICBwdWJsaWMgaXNTZXR1cGVkOiBib29sZWFuID0gZmFsc2VcblxuICAvKiog0KHRh9C10YLRh9C40Log0LjRgtC10YDQuNGA0YPQtdC80YvRhSDQvtCx0YrQtdC60YLQvtCyLiAqL1xuICBwcml2YXRlIGluZGV4OiBudW1iZXIgPSAwXG5cbiAgLyoqINCl0LXQu9C/0LXRgCDQsdGD0LTQtdGCINC40LzQtdGC0Ywg0L/QvtC70L3Ri9C5INC00L7RgdGC0YPQvyDQuiDRjdC60LfQtdC80L/Qu9GP0YDRgyBTUGxvdC4gKi9cbiAgY29uc3RydWN0b3IoXG4gICAgcmVhZG9ubHkgc3Bsb3Q6IFNQbG90XG4gICkge31cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQn9C+0LTQs9C+0YLQsNCy0LvQuNCy0LDQtdGCINGF0LXQu9C/0LXRgCDQuiDQuNGB0L/QvtC70YzQt9C+0LLQsNC90LjRji5cbiAgICovXG4gIHB1YmxpYyBzZXR1cCgpOiB2b2lkIHtcblxuICAgIC8qKiDQpdC10LvQv9C10YAg0LTQtdC80L4t0YDQtdC20LjQvNCwINCy0YvQv9C+0LvQvdGP0LXRgiDQvdCw0YHRgtGA0L7QudC60YMg0LLRgdC10YUg0YHQstC+0LjRhSDQv9Cw0YDQsNC80LXRgtGA0L7QsiDQtNCw0LbQtSDQtdGB0LvQuCDQvtC90LAg0YPQttC1INCy0YvQv9C+0LvQvdGP0LvQsNGB0YwuICovXG4gICAgaWYgKCF0aGlzLmlzU2V0dXBlZCkge1xuICAgICAgdGhpcy5pc1NldHVwZWQgPSB0cnVlXG4gICAgfVxuXG4gICAgLyoqINCe0LHQvdGD0LvQtdC90LjQtSDRgdGH0LXRgtGH0LjQutCwINC40YLQtdGA0LDRgtC+0YDQsC4gKi9cbiAgICB0aGlzLmluZGV4ID0gMFxuXG4gICAgLyoqINCf0L7QtNCz0L7RgtC+0LLQutCwINC00LXQvNC+LdGA0LXQttC40LzQsCAo0LXRgdC70Lgg0YLRgNC10LHRg9C10YLRgdGPKS4gKi9cbiAgICBpZiAodGhpcy5zcGxvdC5kZW1vLmlzRW5hYmxlKSB7XG4gICAgICB0aGlzLnNwbG90Lml0ZXJhdG9yID0gdGhpcy5zcGxvdC5kZW1vLml0ZXJhdG9yLmJpbmQodGhpcylcbiAgICAgIHRoaXMuc3Bsb3QuY29sb3JzID0gdGhpcy5zcGxvdC5kZW1vLmNvbG9yc1xuICAgIH1cbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCY0LzQuNGC0LjRgNGD0LXRgiDQuNGC0LXRgNCw0YLQvtGAINC40YHRhdC+0LTQvdGL0YUg0L7QsdGK0LXQutGC0L7Qsi5cbiAgICovXG4gIHB1YmxpYyBpdGVyYXRvcigpOiBTUGxvdE9iamVjdCB8IG51bGwge1xuICAgIGlmICh0aGlzLmluZGV4IDwgdGhpcy5hbW91bnQpIHtcbiAgICAgIHRoaXMuaW5kZXgrK1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgeDogTWF0aC5yYW5kb20oKSxcbiAgICAgICAgeTogTWF0aC5yYW5kb20oKSxcbiAgICAgICAgc2hhcGU6IHJhbmRvbUludCh0aGlzLnNwbG90LnNoYXBlc0NvdW50ISksXG4gICAgICAgIHNpemU6IHRoaXMuc2l6ZU1pbiArIHJhbmRvbUludCh0aGlzLnNpemVNYXggLSB0aGlzLnNpemVNaW4gKyAxKSxcbiAgICAgICAgY29sb3I6IHJhbmRvbUludCh0aGlzLmNvbG9ycy5sZW5ndGgpXG4gICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCBTUGxvdCBmcm9tICdAL3NwbG90J1xuaW1wb3J0ICogYXMgc2hhZGVycyBmcm9tICdAL3NoYWRlcnMnXG5pbXBvcnQgeyBjb2xvckZyb21IZXhUb0dsUmdiIH0gZnJvbSAnQC91dGlscydcblxuLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqXG4gKiDQmtC70LDRgdGBLdGF0LXQu9C/0LXRgCwg0YPQv9GA0LDQstC70Y/RjtGJ0LjQuSBHTFNMLdC60L7QtNC+0Lwg0YjQtdC50LTQtdGA0L7Qsi5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU1Bsb3RHbHNsIGltcGxlbWVudHMgU1Bsb3RIZWxwZXIge1xuXG4gIC8qKiDQmtC+0LTRiyDRiNC10LnQtNC10YDQvtCyLiAqL1xuICBwdWJsaWMgdmVydFNoYWRlclNvdXJjZTogc3RyaW5nID0gJydcbiAgcHVibGljIGZyYWdTaGFkZXJTb3VyY2U6IHN0cmluZyA9ICcnXG5cbiAgLyoqINCf0YDQuNC30L3QsNC6INGC0L7Qs9C+LCDRh9GC0L4g0YXQtdC70L/QtdGAINGD0LbQtSDQvdCw0YHRgtGA0L7QtdC9LiAqL1xuICBwdWJsaWMgaXNTZXR1cGVkOiBib29sZWFuID0gZmFsc2VcblxuICAvKiog0KXQtdC70L/QtdGAINCx0YPQtNC10YIg0LjQvNC10YLRjCDQv9C+0LvQvdGL0Lkg0LTQvtGB0YLRg9C/INC6INGN0LrQt9C10LzQv9C70Y/RgNGDIFNQbG90LiAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICByZWFkb25seSBzcGxvdDogU1Bsb3RcbiAgKSB7fVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCf0L7QtNCz0L7RgtCw0LLQu9C40LLQsNC10YIg0YXQtdC70L/QtdGAINC6INC40YHQv9C+0LvRjNC30L7QstCw0L3QuNGOLlxuICAgKi9cbiAgcHVibGljIHNldHVwKCk6IHZvaWQge1xuXG4gICAgaWYgKCF0aGlzLmlzU2V0dXBlZCkge1xuXG4gICAgICAvKiog0KHQsdC+0YDQutCwINC60L7QtNC+0LIg0YjQtdC50LTQtdGA0L7Qsi4gKi9cbiAgICAgIHRoaXMudmVydFNoYWRlclNvdXJjZSA9IHRoaXMubWFrZVZlcnRTaGFkZXJTb3VyY2UoKVxuICAgICAgdGhpcy5mcmFnU2hhZGVyU291cmNlID0gdGhpcy5tYWtlRnJhZ1NoYWRlclNvdXJjZSgpXG5cbiAgICAgIC8qKiDQktGL0YfQuNGB0LvQtdC90LjQtSDQutC+0LvQuNGH0LXRgdGC0LLQsCDRgNCw0LfQu9C40YfQvdGL0YUg0YTQvtGA0Lwg0L7QsdGK0LXQutGC0L7Qsi4gKi9cbiAgICAgIHRoaXMuc3Bsb3Quc2hhcGVzQ291bnQgPSBzaGFkZXJzLlNIQVBFUy5sZW5ndGhcblxuICAgICAgdGhpcy5pc1NldHVwZWQgPSB0cnVlXG4gICAgfVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0KHQvtC30LTQsNC10YIg0LrQvtC0INCy0LXRgNGI0LjQvdC90L7Qs9C+INGI0LXQudC00LXRgNCwLlxuICAgKlxuICAgKiBAcmVtYXJrc1xuICAgKiDQkiDRiNCw0LHQu9C+0L0g0LLQtdGA0YjQuNC90L3QvtCz0L4g0YjQtdC50LTQtdGA0LAg0LLRgdGC0LDQstC70Y/QtdGC0YHRjyDQutC+0LQg0LLRi9Cx0L7RgNCwINGG0LLQtdGC0LAg0L7QsdGK0LXQutGC0LAg0L/QviDQuNC90LTQtdC60YHRgyDRhtCy0LXRgtCwLiDQoi7Qui7RiNC10LnQtNC10YAg0L3QtSDQv9C+0LfQstC+0LvRj9C10YJcbiAgICog0LjRgdC/0L7Qu9GM0LfQvtCy0LDRgtGMINCyINC60LDRh9C10YHRgtCy0LUg0LjQvdC00LXQutGB0L7QsiDQv9C10YDQtdC80LXQvdC90YvQtSAtINC00LvRjyDQt9Cw0LTQsNC90LjRjyDRhtCy0LXRgtCwINC40YHQv9C+0LvRjNC30YPQtdGC0YHRjyDQv9C+0YHQu9C10LTQvtCy0LDRgtC10LvRjNC90YvQuSDQv9C10YDQtdCx0L7RgCDRhtCy0LXRgtC+0LLRi9GFXG4gICAqINC40L3QtNC10LrRgdC+0LIuXG4gICAqL1xuICBwcml2YXRlIG1ha2VWZXJ0U2hhZGVyU291cmNlKCkge1xuXG4gICAgLyoqINCS0YDQtdC80LXQvdC90L7QtSDQtNC+0LHQsNCy0LvQtdC90LjQtSDQsiDQv9Cw0LvQuNGC0YDRgyDQstC10YDRiNC40L0g0YbQstC10YLQsCDQvdCw0L/RgNCw0LLQu9GP0Y7RidC40YUuICovXG4gICAgdGhpcy5zcGxvdC5jb2xvcnMucHVzaCh0aGlzLnNwbG90LmdyaWQucnVsZXNDb2xvciEpXG5cbiAgICBsZXQgY29kZTogc3RyaW5nID0gJydcblxuICAgIC8qKiDQpNC+0YDQvNC40YDQvtCy0L3QuNC1INC60L7QtNCwINGD0YHRgtCw0L3QvtCy0LrQuCDRhtCy0LXRgtCwINC+0LHRitC10LrRgtCwINC/0L4g0LjQvdC00LXQutGB0YMuICovXG4gICAgdGhpcy5zcGxvdC5jb2xvcnMuZm9yRWFjaCgodmFsdWUsIGluZGV4KSA9PiB7XG4gICAgICBsZXQgW3IsIGcsIGJdID0gY29sb3JGcm9tSGV4VG9HbFJnYih2YWx1ZSlcbiAgICAgIGNvZGUgKz0gYGVsc2UgaWYgKGFfY29sb3IgPT0gJHtpbmRleH0uMCkgdl9jb2xvciA9IHZlYzMoJHtyfSwgJHtnfSwgJHtifSk7XFxuYFxuICAgIH0pXG5cbiAgICAvKiog0KPQtNCw0LvQtdC90LjQtSDQuNC3INC/0LDQu9C40YLRgNGLINCy0LXRgNGI0LjQvSDQstGA0LXQvNC10L3QvdC+INC00L7QsdCw0LLQu9C10L3QvdC+0LPQviDRhtCy0LXRgtCwINC90LDQv9GA0LDQstC70Y/RjtGJ0LjRhS4gKi9cbiAgICB0aGlzLnNwbG90LmNvbG9ycy5wb3AoKVxuXG4gICAgLyoqINCj0LTQsNC70LXQvdC40LUg0LvQuNGI0L3QtdCz0L4gXCJlbHNlXCIg0LIg0L3QsNGH0LDQu9C1INC60L7QtNCwINC4INC70LjRiNC90LXQs9C+INC/0LXRgNC10LLQvtC00LAg0YHRgtGA0L7QutC4INCyINC60L7QvdGG0LUuICovXG4gICAgY29kZSA9IGNvZGUuc2xpY2UoNSkuc2xpY2UoMCwgLTEpXG5cbiAgICByZXR1cm4gc2hhZGVycy5WRVJURVhfVEVNUExBVEUucmVwbGFjZSgne0NPTE9SLVNFTEVDVElPTn0nLCBjb2RlKS50cmltKClcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCh0L7Qt9C00LDQtdGCINC60L7QtCDRhNGA0LDQs9C80LXQvdGC0L3QvtCz0L4g0YjQtdC50LTQtdGA0LAuXG4gICAqL1xuICBwcml2YXRlIG1ha2VGcmFnU2hhZGVyU291cmNlKCkge1xuXG4gICAgbGV0IGNvZGUxOiBzdHJpbmcgPSAnJ1xuICAgIGxldCBjb2RlMjogc3RyaW5nID0gJydcblxuICAgIHNoYWRlcnMuU0hBUEVTLmZvckVhY2goKHZhbHVlLCBpbmRleCkgPT4ge1xuXG4gICAgICAvKiog0KTQvtGA0LzQuNGA0L7QstCw0L3QuNC1INC60L7QtNCwINGE0YPQvdC60YbQuNC5LCDQvtC/0LjRgdGL0LLQsNGO0YnQuNGFINGE0L7RgNC80Ysg0L7QsdGK0LXQutGC0L7Qsi4gKi9cbiAgICAgIGNvZGUxICs9IGB2b2lkIHMke2luZGV4fSgpIHsgJHt2YWx1ZS50cmltKCl9IH1cXG5gXG5cbiAgICAgIC8qKiDQpNC+0YDQvNC40YDQvtCy0LDQvdC40LUg0LrQvtC00LAg0YPRgdGC0LDQvdC+0LLQutC4INGE0L7RgNC80Ysg0L7QsdGK0LXQutGC0LAg0L/QviDQuNC90LTQtdC60YHRgy4gKi9cbiAgICAgIGNvZGUyICs9IGBlbHNlIGlmICh2X3NoYXBlID09ICR7aW5kZXh9LjApIHsgcyR7aW5kZXh9KCk7fVxcbmBcbiAgICB9KVxuXG4gICAgLyoqINCj0LTQsNC70LXQvdC40LUg0LvQuNGI0L3QtdCz0L4g0L/QtdGA0LXQstC+0LTQsCDRgdGC0YDQvtC60Lgg0LIg0LrQvtC90YbQtS4gKi9cbiAgICBjb2RlMSA9IGNvZGUxLnNsaWNlKDAsIC0xKVxuXG4gICAgLyoqINCj0LTQsNC70LXQvdC40LUg0LvQuNGI0L3QtdCz0L4gXCJlbHNlXCIg0LIg0L3QsNGH0LDQu9C1INC60L7QtNCwINC4INC70LjRiNC90LXQs9C+INC/0LXRgNC10LLQvtC00LAg0YHRgtGA0L7QutC4INCyINC60L7QvdGG0LUuICovXG4gICAgY29kZTIgPSBjb2RlMi5zbGljZSg1KS5zbGljZSgwLCAtMSlcblxuICAgIHJldHVybiBzaGFkZXJzLkZSQUdNRU5UX1RFTVBMQVRFLlxuICAgICAgcmVwbGFjZSgne1NIQVBFUy1GVU5DVElPTlN9JywgY29kZTEpLlxuICAgICAgcmVwbGFjZSgne1NIQVBFLVNFTEVDVElPTn0nLCBjb2RlMikuXG4gICAgICB0cmltKClcbiAgfVxufVxuIiwiaW1wb3J0IFNQbG90IGZyb20gJ0Avc3Bsb3QnXG5pbXBvcnQgeyBjb2xvckZyb21IZXhUb0dsUmdiIH0gZnJvbSAnQC91dGlscydcblxuLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqXG4gKiDQmtC70LDRgdGBLdGF0LXQu9C/0LXRgCwg0YDQtdCw0LvQuNC30YPRjtGJ0LjQuSDRg9C/0YDQsNCy0LvQtdC90LjQtSDQutC+0L3RgtC10LrRgdGC0L7QvCDRgNC10L3QtNC10YDQuNC90LPQsCBXZWJHTCDQutC70LDRgdGB0LAgU3Bsb3QuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNQbG90V2ViR2wgaW1wbGVtZW50cyBTUGxvdEhlbHBlciB7XG5cbiAgLyoqINCf0LDRgNCw0LzQtdGC0YDRiyDQuNC90LjRhtC40LDQu9C40LfQsNGG0LjQuCDQutC+0L3RgtC10LrRgdGC0LAg0YDQtdC90LTQtdGA0LjQvdCz0LAgV2ViR0wuICovXG4gIHB1YmxpYyBhbHBoYTogYm9vbGVhbiA9IGZhbHNlXG4gIHB1YmxpYyBkZXB0aDogYm9vbGVhbiA9IGZhbHNlXG4gIHB1YmxpYyBzdGVuY2lsOiBib29sZWFuID0gZmFsc2VcbiAgcHVibGljIGFudGlhbGlhczogYm9vbGVhbiA9IGZhbHNlXG4gIHB1YmxpYyBkZXN5bmNocm9uaXplZDogYm9vbGVhbiA9IHRydWVcbiAgcHVibGljIHByZW11bHRpcGxpZWRBbHBoYTogYm9vbGVhbiA9IGZhbHNlXG4gIHB1YmxpYyBwcmVzZXJ2ZURyYXdpbmdCdWZmZXI6IGJvb2xlYW4gPSBmYWxzZVxuICBwdWJsaWMgZmFpbElmTWFqb3JQZXJmb3JtYW5jZUNhdmVhdDogYm9vbGVhbiA9IHRydWVcbiAgcHVibGljIHBvd2VyUHJlZmVyZW5jZTogV2ViR0xQb3dlclByZWZlcmVuY2UgPSAnaGlnaC1wZXJmb3JtYW5jZSdcblxuICAvKiog0J3QsNC30LLQsNC90LjRjyDRjdC70LXQvNC10L3RgtC+0LIg0LPRgNCw0YTQuNGH0LXRgdC60L7QuSDRgdC40YHRgtC10LzRiyDQutC70LjQtdC90YLQsC4gKi9cbiAgcHVibGljIGdwdSA9IHsgaGFyZHdhcmU6ICctJywgc29mdHdhcmU6ICctJyB9XG5cbiAgLyoqINCa0L7QvdGC0LXQutGB0YIg0YDQtdC90LTQtdGA0LjQvdCz0LAg0Lgg0L/RgNC+0LPRgNCw0LzQvNCwIFdlYkdMLiAqL1xuICBwdWJsaWMgZ2whOiBXZWJHTFJlbmRlcmluZ0NvbnRleHRcbiAgcHJpdmF0ZSBncHVQcm9ncmFtITogV2ViR0xQcm9ncmFtXG5cbiAgLyoqINCf0LXRgNC10LzQtdC90L3Ri9C1INC00LvRjyDRgdCy0Y/Qt9C4INC/0YDQuNC70L7QttC10L3QuNGPINGBINC/0YDQvtCz0YDQsNC80LzQvtC5IFdlYkdMLiAqL1xuICBwcml2YXRlIHZhcmlhYmxlczogTWFwPHN0cmluZywgYW55PiA9IG5ldyBNYXAoKVxuXG4gIC8qKiDQn9GA0LjQt9C90LDQuiDRgtC+0LPQviwg0YfRgtC+INGF0LXQu9C/0LXRgCDRg9C20LUg0L3QsNGB0YLRgNC+0LXQvS4gKi9cbiAgcHVibGljIGlzU2V0dXBlZDogYm9vbGVhbiA9IGZhbHNlXG5cbiAgLyoqINCR0YPRhNC10YDRiyDQstC40LTQtdC+0L/QsNC80Y/RgtC4IFdlYkdMLiAqL1xuICBwdWJsaWMgZGF0YTogYW55W10gPSBbXVxuXG4gIHByaXZhdGUgZ3JvdXBUeXBlOiBudW1iZXJbXSA9IFtdXG5cbiAgLyoqINCf0YDQsNCy0LjQu9CwINGB0L7QvtGC0LLQtdGC0YHRgtCy0LjRjyDRgtC40L/QvtCyINGC0LjQv9C40LfQuNGA0L7QstCw0L3QvdGL0YUg0LzQsNGB0YHQuNCy0L7QsiDQuCDRgtC40L/QvtCyINC/0LXRgNC10LzQtdC90L3Ri9GFIFdlYkdMLiAqL1xuICBwcml2YXRlIGdsTnVtYmVyVHlwZXM6IE1hcDxzdHJpbmcsIG51bWJlcj4gPSBuZXcgTWFwKFtcbiAgICBbJ0ludDhBcnJheScsIDB4MTQwMF0sICAgICAgIC8vIGdsLkJZVEVcbiAgICBbJ1VpbnQ4QXJyYXknLCAweDE0MDFdLCAgICAgIC8vIGdsLlVOU0lHTkVEX0JZVEVcbiAgICBbJ0ludDE2QXJyYXknLCAweDE0MDJdLCAgICAgIC8vIGdsLlNIT1JUXG4gICAgWydVaW50MTZBcnJheScsIDB4MTQwM10sICAgICAvLyBnbC5VTlNJR05FRF9TSE9SVFxuICAgIFsnRmxvYXQzMkFycmF5JywgMHgxNDA2XSAgICAgLy8gZ2wuRkxPQVRcbiAgXSlcblxuICAvKiog0KXQtdC70L/QtdGAINCx0YPQtNC10YIg0LjQvNC10YLRjCDQv9C+0LvQvdGL0Lkg0LTQvtGB0YLRg9C/INC6INGN0LrQt9C10LzQv9C70Y/RgNGDIFNQbG90LiAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICByZWFkb25seSBzcGxvdDogU1Bsb3RcbiAgKSB7IH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQn9C+0LTQs9C+0YLQsNCy0LvQuNCy0LDQtdGCINGF0LXQu9C/0LXRgCDQuiDQuNGB0L/QvtC70YzQt9C+0LLQsNC90LjRji5cbiAgICovXG4gIHB1YmxpYyBzZXR1cCgpOiB2b2lkIHtcblxuICAgIC8qKiDQp9Cw0YHRgtGMINC/0LDRgNCw0LzQtdGC0YDQvtCyINGF0LXQu9C/0LXRgNCwIFdlYkdMINC40L3QuNGG0LjQsNC70LjQt9C40YDRg9C10YLRgdGPINGC0L7Qu9GM0LrQviDQvtC00LjQvSDRgNCw0LcuICovXG4gICAgaWYgKCF0aGlzLmlzU2V0dXBlZCkge1xuXG4gICAgICB0aGlzLmdsID0gdGhpcy5zcGxvdC5jYW52YXMuZ2V0Q29udGV4dCgnd2ViZ2wnLCB7XG4gICAgICAgIGFscGhhOiB0aGlzLmFscGhhLFxuICAgICAgICBkZXB0aDogdGhpcy5kZXB0aCxcbiAgICAgICAgc3RlbmNpbDogdGhpcy5zdGVuY2lsLFxuICAgICAgICBhbnRpYWxpYXM6IHRoaXMuYW50aWFsaWFzLFxuICAgICAgICBkZXN5bmNocm9uaXplZDogdGhpcy5kZXN5bmNocm9uaXplZCxcbiAgICAgICAgcHJlbXVsdGlwbGllZEFscGhhOiB0aGlzLnByZW11bHRpcGxpZWRBbHBoYSxcbiAgICAgICAgcHJlc2VydmVEcmF3aW5nQnVmZmVyOiB0aGlzLnByZXNlcnZlRHJhd2luZ0J1ZmZlcixcbiAgICAgICAgZmFpbElmTWFqb3JQZXJmb3JtYW5jZUNhdmVhdDogdGhpcy5mYWlsSWZNYWpvclBlcmZvcm1hbmNlQ2F2ZWF0LFxuICAgICAgICBwb3dlclByZWZlcmVuY2U6IHRoaXMucG93ZXJQcmVmZXJlbmNlXG4gICAgICB9KSFcblxuICAgICAgaWYgKHRoaXMuZ2wgPT09IG51bGwpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCfQntGI0LjQsdC60LAg0YHQvtC30LTQsNC90LjRjyDQutC+0L3RgtC10LrRgdGC0LAg0YDQtdC90LTQtdGA0LjQvdCz0LAgV2ViR0whJylcbiAgICAgIH1cblxuICAgICAgLyoqINCf0L7Qu9GD0YfQtdC90LjQtSDQuNC90YTQvtGA0LzQsNGG0LjQuCDQviDQs9GA0LDRhNC40YfQtdGB0LrQvtC5INGB0LjRgdGC0LXQvNC1INC60LvQuNC10L3RgtCwLiAqL1xuICAgICAgbGV0IGV4dCA9IHRoaXMuZ2wuZ2V0RXh0ZW5zaW9uKCdXRUJHTF9kZWJ1Z19yZW5kZXJlcl9pbmZvJylcbiAgICAgIHRoaXMuZ3B1LmhhcmR3YXJlID0gKGV4dCkgPyB0aGlzLmdsLmdldFBhcmFtZXRlcihleHQuVU5NQVNLRURfUkVOREVSRVJfV0VCR0wpIDogJ1vQvdC10LjQt9Cy0LXRgdGC0L3Qvl0nXG4gICAgICB0aGlzLmdwdS5zb2Z0d2FyZSA9IHRoaXMuZ2wuZ2V0UGFyYW1ldGVyKHRoaXMuZ2wuVkVSU0lPTilcblxuICAgICAgdGhpcy5zcGxvdC5kZWJ1Zy5sb2coJ2dwdScpXG5cbiAgICAgIC8qKiDQodC+0LfQtNCw0L3QuNC1INC/0YDQvtCz0YDQsNC80LzRiyBXZWJHTC4gKi9cbiAgICAgIHRoaXMuY3JlYXRlUHJvZ3JhbSh0aGlzLnNwbG90Lmdsc2wudmVydFNoYWRlclNvdXJjZSwgdGhpcy5zcGxvdC5nbHNsLmZyYWdTaGFkZXJTb3VyY2UpXG5cbiAgICAgIHRoaXMuaXNTZXR1cGVkID0gdHJ1ZVxuICAgIH1cblxuICAgIC8qKiDQlNGA0YPQs9Cw0Y8g0YfQsNGB0YLRjCDQv9Cw0YDQsNC80LXRgtGA0L7QsiDRhdC10LvQv9C10YDQsCBXZWJHTCDQuNC90LjRhtC40LDQu9C40LfQuNGA0YPQtdGC0YHRjyDQv9GA0Lgg0LrQsNC20LTQvtC8INCy0YvQt9C+0LLQtSDQvNC10YLQvtC00LAgc2V0dXAuICovXG5cbiAgICAvKiog0JrQvtC+0YDQtdC60YLQuNGA0L7QstC60LAg0YDQsNC30LzQtdGA0LAg0L7QsdC70LDRgdGC0Lgg0L/RgNC+0YHQvNC+0YLRgNCwLiAqL1xuICAgIHRoaXMuc3Bsb3QuY2FudmFzLndpZHRoID0gdGhpcy5zcGxvdC5jYW52YXMuY2xpZW50V2lkdGhcbiAgICB0aGlzLnNwbG90LmNhbnZhcy5oZWlnaHQgPSB0aGlzLnNwbG90LmNhbnZhcy5jbGllbnRIZWlnaHRcbiAgICB0aGlzLmdsLnZpZXdwb3J0KDAsIDAsIHRoaXMuc3Bsb3QuY2FudmFzLndpZHRoLCB0aGlzLnNwbG90LmNhbnZhcy5oZWlnaHQpXG5cbiAgICAvKiog0JXRgdC70Lgg0LfQsNC00LDQvSDRgNCw0LfQvNC10YAg0L/Qu9C+0YHQutC+0YHRgtC4LCDQvdC+INC90LUg0LfQsNC00LDQvdC+INC/0L7Qu9C+0LbQtdC90LjQtSDQvtCx0LvQsNGB0YLQuCDQv9GA0L7RgdC80L7RgtGA0LAsINGC0L4g0L7QvdCwINC/0L7QvNC10YnQsNC10YLRgdGPINCyINGG0LXQvdGC0YAg0L/Qu9C+0YHQutC+0YHRgtC4LiAqL1xuICAgIGlmICgoJ2dyaWQnIGluIHRoaXMuc3Bsb3QubGFzdFJlcXVlc3RlZE9wdGlvbnMhKSAmJiAhKCdjYW1lcmEnIGluIHRoaXMuc3Bsb3QubGFzdFJlcXVlc3RlZE9wdGlvbnMpKSB7XG4gICAgICB0aGlzLnNwbG90LmNhbWVyYS54ID0gMC41XG4gICAgICB0aGlzLnNwbG90LmNhbWVyYS55ID0gMC41XG4gICAgfVxuXG4gICAgLyoqINCj0YHRgtCw0L3QvtCy0LrQsCDRhNC+0L3QvtCy0L7Qs9C+INGG0LLQtdGC0LAg0LrQsNC90LLQsNGB0LAgKNGG0LLQtdGCINC+0YfQuNGB0YLQutC4INC60L7QvdGC0LXQutGB0YLQsCDRgNC10L3QtNC10YDQuNC90LPQsCkuICovXG4gICAgdGhpcy5zZXRCZ0NvbG9yKHRoaXMuc3Bsb3QuZ3JpZC5iZ0NvbG9yISlcbiAgfVxuXG4gIGNsZWFyRGF0YSgpIHtcbiAgICBmb3IgKGxldCBkeCA9IDA7IGR4IDwgdGhpcy5zcGxvdC5hcmVhLmNvdW50OyBkeCsrKSB7XG4gICAgICB0aGlzLmRhdGFbZHhdID0gW11cbiAgICAgIGZvciAobGV0IGR5ID0gMDsgZHkgPCB0aGlzLnNwbG90LmFyZWEuY291bnQ7IGR5KyspIHtcbiAgICAgICAgdGhpcy5kYXRhW2R4XVtkeV0gPSBbXVxuICAgICAgICBmb3IgKGxldCBkeiA9IDA7IGR6IDwgdGhpcy5zcGxvdC5hcmVhLmdyb3Vwc1tkeF1bZHldLmxlbmd0aDsgZHorKykge1xuICAgICAgICAgIHRoaXMuZGF0YVtkeF1bZHldW2R6XSA9IFtdXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQo9GB0YLQsNC90LDQstC70LjQstCw0LXRgiDRhtCy0LXRgiDRhNC+0L3QsCDQutC+0L3RgtC10LrRgdGC0LAg0YDQtdC90LTQtdGA0LjQvdCz0LAgV2ViR0wuXG4gICAqL1xuICBwdWJsaWMgc2V0QmdDb2xvcihjb2xvcjogc3RyaW5nKTogdm9pZCB7XG4gICAgbGV0IFtyLCBnLCBiXSA9IGNvbG9yRnJvbUhleFRvR2xSZ2IoY29sb3IpXG4gICAgdGhpcy5nbC5jbGVhckNvbG9yKHIsIGcsIGIsIDAuMClcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCX0LDQutGA0LDRiNC40LLQsNC10YIg0LrQvtC90YLQtdC60YHRgiDRgNC10L3QtNC10YDQuNC90LPQsCBXZWJHTCDRhtCy0LXRgtC+0Lwg0YTQvtC90LAuXG4gICAqL1xuICBwdWJsaWMgY2xlYXJCYWNrZ3JvdW5kKCk6IHZvaWQge1xuICAgIHRoaXMuZ2wuY2xlYXIodGhpcy5nbC5DT0xPUl9CVUZGRVJfQklUKTtcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCh0L7Qt9C00LDQtdGCINGI0LXQudC00LXRgCBXZWJHTC5cbiAgICpcbiAgICogQHBhcmFtIHR5cGUgLSDQotC40L8g0YjQtdC50LTQtdGA0LAuXG4gICAqIEBwYXJhbSBjb2RlIC0gR0xTTC3QutC+0LQg0YjQtdC50LTQtdGA0LAuXG4gICAqIEByZXR1cm5zINCh0L7Qt9C00LDQvdC90YvQuSDRiNC10LnQtNC10YAuXG4gICAqL1xuICBwdWJsaWMgY3JlYXRlU2hhZGVyKHR5cGU6ICdWRVJURVhfU0hBREVSJyB8ICdGUkFHTUVOVF9TSEFERVInLCBjb2RlOiBzdHJpbmcpOiBXZWJHTFNoYWRlciB7XG5cbiAgICBjb25zdCBzaGFkZXIgPSB0aGlzLmdsLmNyZWF0ZVNoYWRlcih0aGlzLmdsW3R5cGVdKSFcbiAgICB0aGlzLmdsLnNoYWRlclNvdXJjZShzaGFkZXIsIGNvZGUpXG4gICAgdGhpcy5nbC5jb21waWxlU2hhZGVyKHNoYWRlcilcblxuICAgIGlmICghdGhpcy5nbC5nZXRTaGFkZXJQYXJhbWV0ZXIoc2hhZGVyLCB0aGlzLmdsLkNPTVBJTEVfU1RBVFVTKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCfQntGI0LjQsdC60LAg0LrQvtC80L/QuNC70Y/RhtC40Lgg0YjQtdC50LTQtdGA0LAgWycgKyB0eXBlICsgJ10uICcgKyB0aGlzLmdsLmdldFNoYWRlckluZm9Mb2coc2hhZGVyKSlcbiAgICB9XG5cbiAgICByZXR1cm4gc2hhZGVyXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQodC+0LfQtNCw0LXRgiDQv9GA0L7Qs9GA0LDQvNC80YMgV2ViR0wg0LjQtyDRiNC10LnQtNC10YDQvtCyLlxuICAgKlxuICAgKiBAcGFyYW0gc2hhZGVyVmVydCAtINCS0LXRgNGI0LjQvdC90YvQuSDRiNC10LnQtNC10YAuXG4gICAqIEBwYXJhbSBzaGFkZXJGcmFnIC0g0KTRgNCw0LPQvNC10L3RgtC90YvQuSDRiNC10LnQtNC10YAuXG4gICAqL1xuICBwdWJsaWMgY3JlYXRlUHJvZ3JhbUZyb21TaGFkZXJzKHNoYWRlclZlcnQ6IFdlYkdMU2hhZGVyLCBzaGFkZXJGcmFnOiBXZWJHTFNoYWRlcik6IHZvaWQge1xuXG4gICAgdGhpcy5ncHVQcm9ncmFtID0gdGhpcy5nbC5jcmVhdGVQcm9ncmFtKCkhXG4gICAgdGhpcy5nbC5hdHRhY2hTaGFkZXIodGhpcy5ncHVQcm9ncmFtLCBzaGFkZXJWZXJ0KVxuICAgIHRoaXMuZ2wuYXR0YWNoU2hhZGVyKHRoaXMuZ3B1UHJvZ3JhbSwgc2hhZGVyRnJhZylcbiAgICB0aGlzLmdsLmxpbmtQcm9ncmFtKHRoaXMuZ3B1UHJvZ3JhbSlcbiAgICB0aGlzLmdsLnVzZVByb2dyYW0odGhpcy5ncHVQcm9ncmFtKVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0KHQvtC30LTQsNC10YIg0L/RgNC+0LPRgNCw0LzQvNGDIFdlYkdMINC40LcgR0xTTC3QutC+0LTQvtCyINGI0LXQudC00LXRgNC+0LIuXG4gICAqXG4gICAqIEBwYXJhbSBzaGFkZXJDb2RlVmVydCAtINCa0L7QtCDQstC10YDRiNC40L3QvdC+0LPQviDRiNC10LnQtNC10YDQsC5cbiAgICogQHBhcmFtIHNoYWRlckNvZGVGcmFnIC0g0JrQvtC0INGE0YDQsNCz0LzQtdC90YLQvdC+0LPQviDRiNC10LnQtNC10YDQsC5cbiAgICovXG4gIHB1YmxpYyBjcmVhdGVQcm9ncmFtKHNoYWRlckNvZGVWZXJ0OiBzdHJpbmcsIHNoYWRlckNvZGVGcmFnOiBzdHJpbmcpOiB2b2lkIHtcblxuICAgIHRoaXMuc3Bsb3QuZGVidWcubG9nKCdzaGFkZXJzJylcblxuICAgIHRoaXMuY3JlYXRlUHJvZ3JhbUZyb21TaGFkZXJzKFxuICAgICAgdGhpcy5jcmVhdGVTaGFkZXIoJ1ZFUlRFWF9TSEFERVInLCBzaGFkZXJDb2RlVmVydCksXG4gICAgICB0aGlzLmNyZWF0ZVNoYWRlcignRlJBR01FTlRfU0hBREVSJywgc2hhZGVyQ29kZUZyYWcpXG4gICAgKVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0KHQvtC30LTQsNC10YIg0YHQstGP0LfRjCDQv9C10YDQtdC80LXQvdC90L7QuSDQv9GA0LjQu9C+0LbQtdC90LjRjyDRgSDQv9GA0L7Qs9GA0LDQvNC80L7QuSBXZWJHbC5cbiAgICpcbiAgICogQHJlbWFya3NcbiAgICog0J/QtdGA0LXQvNC10L3QvdGL0LUg0YHQvtGF0YDQsNC90Y/RjtGC0YHRjyDQsiDQsNGB0YHQvtGG0LjQsNGC0LjQstC90L7QvCDQvNCw0YHRgdC40LLQtSwg0LPQtNC1INC60LvRjtGH0LggLSDRjdGC0L4g0L3QsNC30LLQsNC90LjRjyDQv9C10YDQtdC80LXQvdC90YvRhS4g0J3QsNC30LLQsNC90LjQtSDQv9C10YDQtdC80LXQvdC90L7QuSDQtNC+0LvQttC90L5cbiAgICog0L3QsNGH0LjQvdCw0YLRjNGB0Y8g0YEg0L/RgNC10YTQuNC60YHQsCwg0L7QsdC+0LfQvdCw0YfQsNGO0YnQtdCz0L4g0LXQtSBHTFNMLdGC0LjQvy4g0J/RgNC10YTQuNC60YEgXCJ1X1wiINC+0L/QuNGB0YvQstCw0LXRgiDQv9C10YDQtdC80LXQvdC90YPRjiDRgtC40L/QsCB1bmlmb3JtLiDQn9GA0LXRhNC40LrRgSBcImFfXCJcbiAgICog0L7Qv9C40YHRi9Cy0LDQtdGCINC/0LXRgNC10LzQtdC90L3Rg9GOINGC0LjQv9CwIGF0dHJpYnV0ZS5cbiAgICpcbiAgICogQHBhcmFtIHZhck5hbWUgLSDQmNC80Y8g0L/QtdGA0LXQvNC10L3QvdC+0LkgKNGB0YLRgNC+0LrQsCkuXG4gICAqL1xuICBwdWJsaWMgY3JlYXRlVmFyaWFibGUodmFyTmFtZTogc3RyaW5nKTogdm9pZCB7XG5cbiAgICBjb25zdCB2YXJUeXBlID0gdmFyTmFtZS5zbGljZSgwLCAyKVxuXG4gICAgaWYgKHZhclR5cGUgPT09ICd1XycpIHtcbiAgICAgIHRoaXMudmFyaWFibGVzLnNldCh2YXJOYW1lLCB0aGlzLmdsLmdldFVuaWZvcm1Mb2NhdGlvbih0aGlzLmdwdVByb2dyYW0sIHZhck5hbWUpKVxuICAgIH0gZWxzZSBpZiAodmFyVHlwZSA9PT0gJ2FfJykge1xuICAgICAgdGhpcy52YXJpYWJsZXMuc2V0KHZhck5hbWUsIHRoaXMuZ2wuZ2V0QXR0cmliTG9jYXRpb24odGhpcy5ncHVQcm9ncmFtLCB2YXJOYW1lKSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCfQo9C60LDQt9Cw0L0g0L3QtdCy0LXRgNC90YvQuSDRgtC40L8gKNC/0YDQtdGE0LjQutGBKSDQv9C10YDQtdC80LXQvdC90L7QuSDRiNC10LnQtNC10YDQsDogJyArIHZhck5hbWUpXG4gICAgfVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0KHQvtC30LTQsNC10YIg0YHQstGP0LfRjCDQvdCw0LHQvtGA0LAg0L/QtdGA0LXQvNC10L3QvdGL0YUg0L/RgNC40LvQvtC20LXQvdC40Y8g0YEg0L/RgNC+0LPRgNCw0LzQvNC+0LkgV2ViR2wuXG4gICAqXG4gICAqIEByZW1hcmtzXG4gICAqINCU0LXQu9Cw0LXRgiDRgtC+0LbQtSDRgdCw0LzQvtC1LCDRh9GC0L4g0Lgg0LzQtdGC0L7QtCB7QGxpbmsgY3JlYXRlVmFyaWFibGV9LCDQvdC+INC/0L7Qt9Cy0L7Qu9GP0LXRgiDQt9CwINC+0LTQuNC9INCy0YvQt9C+0LIg0YHQvtC30LTQsNGC0Ywg0YHRgNCw0LfRgyDQvdC10YHQutC+0LvRjNC60L5cbiAgICog0L/QtdGA0LXQvNC10L3QvdGL0YUuXG4gICAqXG4gICAqIEBwYXJhbSB2YXJOYW1lcyAtINCf0LXRgNC10YfQuNGB0LvQtdC90LjRjyDQuNC80LXQvSDQv9C10YDQtdC80LXQvdC90YvRhSAo0YHRgtGA0L7QutCw0LzQuCkuXG4gICAqL1xuICBwdWJsaWMgY3JlYXRlVmFyaWFibGVzKC4uLnZhck5hbWVzOiBzdHJpbmdbXSk6IHZvaWQge1xuICAgIHZhck5hbWVzLmZvckVhY2godmFyTmFtZSA9PiB0aGlzLmNyZWF0ZVZhcmlhYmxlKHZhck5hbWUpKTtcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCh0L7Qt9C00LDQtdGCINCyINCz0YDRg9C/0L/QtSDQsdGD0YTQtdGA0L7QsiBXZWJHTCDQvdC+0LLRi9C5INCx0YPRhNC10YAg0Lgg0LfQsNC/0LjRgdGL0LLQsNC10YIg0LIg0L3QtdCz0L4g0L/QtdGA0LXQtNCw0L3QvdGL0LUg0LTQsNC90L3Ri9C1LlxuICAgKlxuICAgKiBAcmVtYXJrc1xuICAgKiDQmtC+0LvQuNGH0LXRgdGC0LLQviDQs9GA0YPQv9C/INCx0YPRhNC10YDQvtCyINC4INC60L7Qu9C40YfQtdGB0YLQstC+INCx0YPRhNC10YDQvtCyINCyINC60LDQttC00L7QuSDQs9GA0YPQv9C/0LUg0L3QtSDQvtCz0YDQsNC90LjRh9C10L3Riy4g0JrQsNC20LTQsNGPINCz0YDRg9C/0L/QsCDQuNC80LXQtdGCINGB0LLQvtC1INC90LDQt9Cy0LDQvdC40LUg0LhcbiAgICogR0xTTC3RgtC40L8uINCi0LjQvyDQs9GA0YPQv9C/0Ysg0L7Qv9GA0LXQtNC10LvRj9C10YLRgdGPINCw0LLRgtC+0LzQsNGC0LjRh9C10YHQutC4INC90LAg0L7RgdC90L7QstC1INGC0LjQv9CwINGC0LjQv9C40LfQuNGA0L7QstCw0L3QvdC+0LPQviDQvNCw0YHRgdC40LLQsC4g0J/RgNCw0LLQuNC70LAg0YHQvtC+0YLQstC10YLRgdGC0LLQuNGPINGC0LjQv9C+0LJcbiAgICog0L7Qv9GA0LXQtNC10LvRj9GO0YLRgdGPINC/0LXRgNC10LzQtdC90L3QvtC5IHtAbGluayBnbE51bWJlclR5cGVzfS5cbiAgICpcbiAgICogQHBhcmFtIGdyb3VwQ29kZSAtINCd0LDQt9Cy0LDQvdC40LUg0LPRgNGD0L/Qv9GLINCx0YPRhNC10YDQvtCyLCDQsiDQutC+0YLQvtGA0YPRjiDQsdGD0LTQtdGCINC00L7QsdCw0LLQu9C10L0g0L3QvtCy0YvQuSDQsdGD0YTQtdGALlxuICAgKiBAcGFyYW0gZHggLSDQk9C+0YDQuNC30L7QvdGC0LDQu9GM0L3Ri9C5INC40L3QtNC10LrRgSDQsdGD0YTQtdGA0L3QvtC5INCz0YDRg9C/0L/Riy5cbiAgICogQHBhcmFtIGR5IC0g0JLQtdGA0YLQuNC60LDQu9GM0L3Ri9C5INC40L3QtNC10LrRgSDQsdGD0YTQtdGA0L3QvtC5INCz0YDRg9C/0L/Riy5cbiAgICogQHBhcmFtIGRhdGEgLSDQlNCw0L3QvdGL0LUg0LIg0LLQuNC00LUg0YLQuNC/0LjQt9C40YDQvtCy0LDQvdC90L7Qs9C+INC80LDRgdGB0LjQstCwINC00LvRjyDQt9Cw0L/QuNGB0Lgg0LIg0YHQvtC30LTQsNCy0LDQtdC80YvQuSDQsdGD0YTQtdGALlxuICAgKiBAcmV0dXJucyDQntCx0YrQtdC8INC/0LDQvNGP0YLQuCwg0LfQsNC90Y/RgtGL0Lkg0L3QvtCy0YvQvCDQsdGD0YTQtdGA0L7QvCAo0LIg0LHQsNC50YLQsNGFKS5cbiAgICovXG4gIHB1YmxpYyBjcmVhdGVCdWZmZXIoZHg6IG51bWJlciwgZHk6IG51bWJlciwgZHo6IG51bWJlciwgZ3JvdXBDb2RlOiBudW1iZXIsIGRhdGE6IFR5cGVkQXJyYXkpOiBudW1iZXIge1xuXG4gICAgY29uc3QgYnVmZmVyID0gdGhpcy5nbC5jcmVhdGVCdWZmZXIoKSFcbiAgICB0aGlzLmdsLmJpbmRCdWZmZXIodGhpcy5nbC5BUlJBWV9CVUZGRVIsIGJ1ZmZlcilcbiAgICB0aGlzLmdsLmJ1ZmZlckRhdGEodGhpcy5nbC5BUlJBWV9CVUZGRVIsIGRhdGEsIHRoaXMuZ2wuU1RBVElDX0RSQVcpXG5cbiAgICB0aGlzLmRhdGFbZHhdW2R5XVtkel1bZ3JvdXBDb2RlXSA9IGJ1ZmZlclxuXG4gICAgdGhpcy5ncm91cFR5cGVbZ3JvdXBDb2RlXSA9IHRoaXMuZ2xOdW1iZXJUeXBlcy5nZXQoZGF0YS5jb25zdHJ1Y3Rvci5uYW1lKSFcbiAgICAvL2NvbnNvbGUubG9nKCdCVUZGRVJfU0laRSA9ICcsIHRoaXMuZ2wuZ2V0QnVmZmVyUGFyYW1ldGVyKHRoaXMuZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLmdsLkJVRkZFUl9TSVpFKSk7XG5cbiAgICBpZiAodGhpcy5nbC5nZXRCdWZmZXJQYXJhbWV0ZXIodGhpcy5nbC5BUlJBWV9CVUZGRVIsIHRoaXMuZ2wuQlVGRkVSX1NJWkUpICE9PSBkYXRhLmxlbmd0aCAqIGRhdGEuQllURVNfUEVSX0VMRU1FTlQpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7dGhpcy5nbC5BUlJBWV9CVUZGRVIsIHRoaXMuZ2wuQlVGRkVSX1NJWkV9ICE9PSAke2RhdGEubGVuZ3RoICogZGF0YS5CWVRFU19QRVJfRUxFTUVOVH1gKVxuXG4gICAgcmV0dXJuIGRhdGEubGVuZ3RoICogZGF0YS5CWVRFU19QRVJfRUxFTUVOVFxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0J/QtdGA0LXQtNCw0LXRgiDQt9C90LDRh9C10L3QuNC1INC80LDRgtGA0LjRhtGLIDMg0YUgMyDQsiDQv9GA0L7Qs9GA0LDQvNC80YMgV2ViR2wuXG4gICAqXG4gICAqIEBwYXJhbSB2YXJOYW1lIC0g0JjQvNGPINC/0LXRgNC10LzQtdC90L3QvtC5IFdlYkdMICjQuNC3INC80LDRgdGB0LjQstCwIHtAbGluayB2YXJpYWJsZXN9KSDQsiDQutC+0YLQvtGA0YPRjiDQsdGD0LTQtdGCINC30LDQv9C40YHQsNC90L4g0L/QtdGA0LXQtNCw0L3QvdC+0LUg0LfQvdCw0YfQtdC90LjQtS5cbiAgICogQHBhcmFtIHZhclZhbHVlIC0g0KPRgdGC0LDQvdCw0LLQu9C40LLQsNC10LzQvtC1INC30L3QsNGH0LXQvdC40LUg0LTQvtC70LbQvdC+INGP0LLQu9GP0YLRjNGB0Y8g0LzQsNGC0YDQuNGG0LXQuSDQstC10YnQtdGB0YLQstC10L3QvdGL0YUg0YfQuNGB0LXQuyDRgNCw0LfQvNC10YDQvtC8IDMg0YUgMywg0YDQsNC30LLQtdGA0L3Rg9GC0L7QuVxuICAgKiAgICAg0LIg0LLQuNC00LUg0L7QtNC90L7QvNC10YDQvdC+0LPQviDQvNCw0YHRgdC40LLQsCDQuNC3IDkg0Y3Qu9C10LzQtdC90YLQvtCyLlxuICAgKi9cbiAgcHVibGljIHNldFZhcmlhYmxlKHZhck5hbWU6IHN0cmluZywgdmFyVmFsdWU6IG51bWJlcltdKTogdm9pZCB7XG4gICAgdGhpcy5nbC51bmlmb3JtTWF0cml4M2Z2KHRoaXMudmFyaWFibGVzLmdldCh2YXJOYW1lKSwgZmFsc2UsIHZhclZhbHVlKVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JTQtdC70LDQtdGCINCx0YPRhNC10YAgV2ViR2wgXCLQsNC60YLQuNCy0L3Ri9C8XCIuXG4gICAqXG4gICAqIEBwYXJhbSBncm91cENvZGUgLSDQndCw0LfQstCw0L3QuNC1INCz0YDRg9C/0L/RiyDQsdGD0YTQtdGA0L7Qsiwg0LIg0LrQvtGC0L7RgNC+0Lwg0YXRgNCw0L3QuNGC0YHRjyDQvdC10L7QsdGF0L7QtNC40LzRi9C5INCx0YPRhNC10YAuXG4gICAqIEBwYXJhbSBkeCAtINCT0L7RgNC40LfQvtC90YLQsNC70YzQvdGL0Lkg0LjQvdC00LXQutGBINCx0YPRhNC10YDQvdC+0Lkg0LPRgNGD0L/Qv9GLLlxuICAgKiBAcGFyYW0gZHkgLSDQktC10YDRgtC40LrQsNC70YzQvdGL0Lkg0LjQvdC00LXQutGBINCx0YPRhNC10YDQvdC+0Lkg0LPRgNGD0L/Qv9GLLlxuICAgKiBAcGFyYW0gZHogLSDQk9C70YPQsdC40L3QvdGL0Lkg0LjQvdC00LXQutGBINCx0YPRhNC10YDQsCDQsiDQs9GA0YPQv9C/0LUuXG4gICAqIEBwYXJhbSB2YXJOYW1lIC0g0JjQvNGPINC/0LXRgNC10LzQtdC90L3QvtC5ICjQuNC3INC80LDRgdGB0LjQstCwIHtAbGluayB2YXJpYWJsZXN9KSwg0YEg0LrQvtGC0L7RgNC+0Lkg0LHRg9C00LXRgiDRgdCy0Y/Qt9Cw0L0g0LHRg9GE0LXRgC5cbiAgICogQHBhcmFtIHNpemUgLSDQmtC+0LvQuNGH0LXRgdGC0LLQviDRjdC70LXQvNC10L3RgtC+0LIg0LIg0LHRg9GE0LXRgNC1LCDRgdC+0L7RgtCy0LXRgtGB0YLQstGD0Y7RidC40YUg0L7QtNC90L7QuSDCoEdMLdCy0LXRgNGI0LjQvdC1LlxuICAgKiBAcGFyYW0gc3RyaWRlIC0g0KDQsNC30LzQtdGAINGI0LDQs9CwINC+0LHRgNCw0LHQvtGC0LrQuCDRjdC70LXQvNC10L3RgtC+0LIg0LHRg9GE0LXRgNCwICjQt9C90LDRh9C10L3QuNC1IDAg0LfQsNC00LDQtdGCINGA0LDQt9C80LXRidC10L3QuNC1INGN0LvQtdC80LXQvdGC0L7QsiDQtNGA0YPQsyDQt9CwINC00YDRg9Cz0L7QvCkuXG4gICAqIEBwYXJhbSBvZmZzZXQgLSDQodC80LXRidC10L3QuNC1INC+0YLQvdC+0YHQuNGC0LXQu9GM0L3QviDQvdCw0YfQsNC70LAg0LHRg9GE0LXRgNCwLCDQvdCw0YfQuNC90LDRjyDRgSDQutC+0YLQvtGA0L7Qs9C+INCx0YPQtNC10YIg0L/RgNC+0LjRgdGF0L7QtNC40YLRjCDQvtCx0YDQsNCx0L7RgtC60LAg0Y3Qu9C10LzQtdC90YLQvtCyLlxuICAgKi9cbiAgcHVibGljIHNldEJ1ZmZlcihkeDogbnVtYmVyLCBkeTogbnVtYmVyLCBkejogbnVtYmVyLCBncm91cENvZGU6IG51bWJlciwgdmFyTmFtZTogc3RyaW5nLCBzaXplOiBudW1iZXIsIHN0cmlkZTogbnVtYmVyLCBvZmZzZXQ6IG51bWJlcik6IHZvaWQge1xuXG4gICAgY29uc3QgdmFyaWFibGUgPSB0aGlzLnZhcmlhYmxlcy5nZXQodmFyTmFtZSlcblxuICAgIHRoaXMuZ2wuYmluZEJ1ZmZlcih0aGlzLmdsLkFSUkFZX0JVRkZFUiwgdGhpcy5kYXRhW2R4XVtkeV1bZHpdW2dyb3VwQ29kZV0pXG4gICAgdGhpcy5nbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheSh2YXJpYWJsZSlcbiAgICB0aGlzLmdsLnZlcnRleEF0dHJpYlBvaW50ZXIodmFyaWFibGUsIHNpemUsIHRoaXMuZ3JvdXBUeXBlW2dyb3VwQ29kZV0sIGZhbHNlLCBzdHJpZGUsIG9mZnNldClcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCS0YvQv9C+0LvQvdGP0LXRgiDQvtGC0YDQuNGB0L7QstC60YMg0LrQvtC90YLQtdC60YHRgtCwINGA0LXQvdC00LXRgNC40L3Qs9CwIFdlYkdMINC80LXRgtC+0LTQvtC8INC/0YDQuNC80LjRgtC40LLQvdGL0YUg0YLQvtGH0LXQui5cbiAgICpcbiAgICogQHBhcmFtIGZpcnN0IC0g0JjQvdC00LXQutGBIEdMLdCy0LXRgNGI0LjQvdGLLCDRgSDQutC+0YLQvtGA0L7QuSDQvdCw0YfQvdC10YLRjyDQvtGC0YDQuNGB0L7QstC60LAuXG4gICAqIEBwYXJhbSBjb3VudCAtINCa0L7Qu9C40YfQtdGB0YLQstC+INC+0YDQuNGB0L7QstGL0LLQsNC10LzRi9GFIEdMLdCy0LXRgNGI0LjQvS5cbiAgICovXG4gIHB1YmxpYyBkcmF3UG9pbnRzKGZpcnN0OiBudW1iZXIsIGNvdW50OiBudW1iZXIpOiB2b2lkIHtcbiAgICB0aGlzLmdsLmRyYXdBcnJheXModGhpcy5nbC5QT0lOVFMsIGZpcnN0LCBjb3VudClcbiAgfVxufVxuIiwiaW1wb3J0IHsgY29weU1hdGNoaW5nS2V5VmFsdWVzIH0gZnJvbSAnQC91dGlscydcbmltcG9ydCBTUGxvdENvbnRvbCBmcm9tICdAL3NwbG90LWNvbnRyb2wnXG5pbXBvcnQgU1Bsb3RXZWJHbCBmcm9tICdAL3NwbG90LXdlYmdsJ1xuaW1wb3J0IFNQbG90RGVidWcgZnJvbSAnQC9zcGxvdC1kZWJ1ZydcbmltcG9ydCBTUGxvdERlbW8gZnJvbSAnQC9zcGxvdC1kZW1vJ1xuaW1wb3J0IFNQbG90R2xzbCBmcm9tICdAL3NwbG90LWdsc2wnXG5cbi8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKlxuICog0JrQu9Cw0YHRgSBTUGxvdCAtINGA0LXQsNC70LjQt9GD0LXRgiDQs9GA0LDRhNC40Log0YLQuNC/0LAg0YHQutCw0YLRgtC10YDQv9C70L7RgiDRgdGA0LXQtNGB0YLQstCw0LzQuCBXZWJHTC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU1Bsb3Qge1xuXG4gIC8qKiDQpNGD0L3QutGG0LjRjyDQuNGC0LXRgNC40YDQvtCy0LDQvdC40Y8g0LjRgdGF0L7QtNC90YvRhSDQtNCw0L3QvdGL0YUuICovXG4gIHB1YmxpYyBpdGVyYXRvcjogU1Bsb3RJdGVyYXRvciA9IHVuZGVmaW5lZFxuXG4gIC8qKiDQlNCw0L3QvdGL0LUg0L7QsSDQvtCx0YrQtdC60YLQsNGFINCz0YDQsNGE0LjQutCwLiAqL1xuICBwdWJsaWMgZGF0YTogU1Bsb3RPYmplY3RbXSB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZFxuXG4gIC8qKiDQpdC10LvQv9C10YAg0YDQtdC20LjQvNCwINC+0YLQu9Cw0LTQutC4LiAqL1xuICBwdWJsaWMgZGVidWc6IFNQbG90RGVidWcgPSBuZXcgU1Bsb3REZWJ1Zyh0aGlzKVxuXG4gIC8qKiDQpdC10LvQv9C10YAsINGD0L/RgNCw0LLQu9GP0Y7RidC40LkgR0xTTC3QutC+0LTQvtC8INGI0LXQudC00LXRgNC+0LIuICovXG4gIHB1YmxpYyBnbHNsOiBTUGxvdEdsc2wgPSBuZXcgU1Bsb3RHbHNsKHRoaXMpXG5cbiAgLyoqINCl0LXQu9C/0LXRgCBXZWJHTC4gKi9cbiAgcHVibGljIHdlYmdsOiBTUGxvdFdlYkdsID0gbmV3IFNQbG90V2ViR2wodGhpcylcblxuICAvKiog0KXQtdC70L/QtdGAINGA0LXQttC40LzQsCDQtNC10LzQvi3QtNCw0L3QvdGL0YUuICovXG4gIHB1YmxpYyBkZW1vOiBTUGxvdERlbW8gPSBuZXcgU1Bsb3REZW1vKHRoaXMpXG5cbiAgLyoqINCf0YDQuNC30L3QsNC6INGE0L7RgNGB0LjRgNC+0LLQsNC90L3QvtCz0L4g0LfQsNC/0YPRgdC60LAg0YDQtdC90LTQtdGA0LAuICovXG4gIHB1YmxpYyBmb3JjZVJ1bjogYm9vbGVhbiA9IGZhbHNlXG5cbiAgLyoqINCe0LPRgNCw0L3QuNGH0LXQvdC40LUg0LrQvtC7LdCy0LAg0L7QsdGK0LXQutGC0L7QsiDQvdCwINCz0YDQsNGE0LjQutC1LiAqL1xuICBwdWJsaWMgZ2xvYmFsTGltaXQ6IG51bWJlciA9IDFfMDAwXzAwMF8wMDBcblxuICAvKiog0J7Qs9GA0LDQvdC40YfQtdC90LjQtSDQutC+0Lst0LLQsCDQvtCx0YrQtdC60YLQvtCyINCyINCz0YDRg9C/0L/QtS4gKi9cbiAgcHVibGljIGdyb3VwTGltaXQ6IG51bWJlciA9IDEwXzAwMFxuXG4gIC8qKiDQptCy0LXRgtC+0LLQsNGPINC/0LDQu9C40YLRgNCwINC+0LHRitC10LrRgtC+0LIuICovXG4gIHB1YmxpYyBjb2xvcnM6IHN0cmluZ1tdID0gW11cblxuICAvKiog0J/QsNGA0LDQvNC10YLRgNGLINC60L7QvtGA0LTQuNC90LDRgtC90L7QuSDQv9C70L7RgdC60L7RgdGC0LguICovXG4gIHB1YmxpYyBncmlkOiBTUGxvdEdyaWQgPSB7XG4gICAgYmdDb2xvcjogJyNmZmZmZmYnLFxuICAgIHJ1bGVzQ29sb3I6ICcjYzBjMGMwJ1xuICB9XG5cbiAgLyoqINCf0LDRgNCw0LzQtdGC0YDRiyDQvtCx0LvQsNGB0YLQuCDQv9GA0L7RgdC80L7RgtGA0LAuICovXG4gIHB1YmxpYyBjYW1lcmE6IFNQbG90Q2FtZXJhID0ge1xuICAgIHg6IDAsXG4gICAgeTogMCxcbiAgICB6b29tOiAxLFxuICAgIG1pblpvb206IDEsXG4gICAgbWF4Wm9vbTogMTBfMDAwXzAwMFxuICB9XG5cbiAgLyoqINCf0YDQuNC30L3QsNC6INC90LXQvtCx0YXQvtC00LjQvNC+0YHRgtC4INC30LDQs9GA0YPQt9C60Lgg0LTQsNC90L3Ri9GFINC+0LEg0L7QsdGK0LXQutGC0LDRhS4gKi9cbiAgcHVibGljIGxvYWREYXRhOiBib29sZWFuID0gdHJ1ZVxuXG4gIC8qKiDQn9GA0LjQt9C90LDQuiDQvdC10L7QsdGF0L7QtNC40LzQvtGB0YLQuCDQsdC10LfQvtGC0LvQsNCz0LDRgtC10LvRjNC90L7Qs9C+INC30LDQv9GD0YHQutCwINGA0LXQvdC00LXRgNCwLiAqL1xuICBwdWJsaWMgaXNSdW5uaW5nOiBib29sZWFuID0gZmFsc2VcblxuICAvKiog0JrQvtC70LjRh9C10YHRgtCy0L4g0YDQsNC30LvQuNGH0L3Ri9GFINGE0L7RgNC8INC+0LHRitC10LrRgtC+0LIuINCS0YvRh9C40YHQu9GP0LXRgtGB0Y8g0L/QvtC30LbQtSDQsiDRhdC10LvQv9C10YDQtSBnbHNsLiAqL1xuICBwdWJsaWMgc2hhcGVzQ291bnQ6IG51bWJlciB8IHVuZGVmaW5lZFxuXG4gIC8qKiDQodGC0LDRgtC40YHRgtC40YfQtdGB0LrQsNGPINC40L3RhNC+0YDQvNCw0YbQuNGPLiAqL1xuICBwdWJsaWMgc3RhdHMgPSB7XG4gICAgb2JqVG90YWxDb3VudDogMCxcbiAgICBncm91cHNDb3VudDogMCxcbiAgICBtYXhEZXB0aENvdW50OiAwLFxuICAgIG1lbVVzYWdlOiAwLFxuICAgIG1pbk9iamVjdFNpemU6IDFfMDAwXzAwMCxcbiAgICBtYXhPYmplY3RTaXplOiAwLFxuICB9XG5cbiAgLyoqINCe0LHRitC10LrRgi3QutCw0L3QstCw0YEg0LrQvtC90YLQtdC60YHRgtCwINGA0LXQvdC00LXRgNC40L3Qs9CwIFdlYkdMLiAqL1xuICBwdWJsaWMgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudFxuXG4gIC8qKiDQndCw0YHRgtGA0L7QudC60LgsINC30LDQv9GA0L7RiNC10L3QvdGL0LUg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9C10Lwg0LIg0LrQvtC90YHRgtGA0YPQutGC0L7RgNC1INC40LvQuCDQv9GA0Lgg0L/QvtGB0LvQtdC00L3QtdC8INCy0YvQt9C+0LLQtSBzZXR1cC4gKi9cbiAgcHVibGljIGxhc3RSZXF1ZXN0ZWRPcHRpb25zOiBTUGxvdE9wdGlvbnMgfCB1bmRlZmluZWQgPSB7fVxuXG4gIC8qKiDQpdC10LvQv9C10YAg0LLQt9Cw0LjQvNC+0LTQtdC50YHRgtCy0LjRjyDRgSDRg9GB0YLRgNC+0LnRgdGC0LLQvtC8INCy0LLQvtC00LAuICovXG4gIHByb3RlY3RlZCBjb250cm9sOiBTUGxvdENvbnRvbCA9IG5ldyBTUGxvdENvbnRvbCh0aGlzKVxuXG4gIC8qKiDQn9GA0LjQt9C90LDQuiDRgtC+0LPQviwg0YfRgtC+INGN0LrQt9C10LzQv9C70Y/RgCDQutC70LDRgdGB0LAg0LHRi9C7INC60L7RgNGA0LXQutGC0L3QviDQv9C+0LTQs9C+0YLQvtCy0LvQtdC9INC6INGA0LXQvdC00LXRgNGDLiAqL1xuICBwcml2YXRlIGlzU2V0dXBlZDogYm9vbGVhbiA9IGZhbHNlXG5cbiAgLyoqINCf0LXRgNC10LzQtdC90L3QsNGPINC00LvRjyDQv9C10YDQtdCx0L7RgNCwINC40L3QtNC10LrRgdC+0LIg0LzQsNGB0YHQuNCy0LAg0LTQsNC90L3Ri9GFIGRhdGEuICovXG4gIHByaXZhdGUgYXJyYXlJbmRleDogbnVtYmVyID0gMFxuXG4gIHB1YmxpYyBhcmVhID0ge1xuICAgIGdyb3VwczogW10gYXMgYW55W10sXG4gICAgc3RlcDogMCxcbiAgICBjb3VudDogMCxcbiAgICBkeFZpc2libGVGcm9tOiAwLFxuICAgIGR4VmlzaWJsZVRvOiAwLFxuICAgIGR5VmlzaWJsZUZyb206IDAsXG4gICAgZHlWaXNpYmxlVG86IDAsXG4gICAgZHpWaXNpYmxlRnJvbTogMFxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0KHQvtC30LTQsNC10YIg0Y3QutC30LXQvNC/0LvRj9GAINC60LvQsNGB0YHQsCwg0LjQvdC40YbQuNCw0LvQuNC30LjRgNGD0LXRgiDQvdCw0YHRgtGA0L7QudC60LggKNC10YHQu9C4INC/0LXRgNC10LTQsNC90YspLlxuICAgKlxuICAgKiBAcmVtYXJrc1xuICAgKiDQldGB0LvQuCDQutCw0L3QstCw0YEg0YEg0LfQsNC00LDQvdC90YvQvCDQuNC00LXQvdGC0LjRhNC40LrQsNGC0L7RgNC+0Lwg0L3QtSDQvdCw0LnQtNC10L0gLSDQs9C10L3QtdGA0LjRgNGD0LXRgtGB0Y8g0L7RiNC40LHQutCwLiDQndCw0YHRgtGA0L7QudC60Lgg0LzQvtCz0YPRgiDQsdGL0YLRjCDQt9Cw0LTQsNC90Ysg0LrQsNC6INCyXG4gICAqINC60L7QvdGB0YLRgNGD0LrRgtC+0YDQtSwg0YLQsNC6INC4INCyINC80LXRgtC+0LTQtSB7QGxpbmsgc2V0dXB9LiDQkiDQu9GO0LHQvtC8INGB0LvRg9GH0LDQtSDQvdCw0YHRgtGA0L7QudC60Lgg0LTQvtC70LbQvdGLINCx0YvRgtGMINC30LDQtNCw0L3RiyDQtNC+INC30LDQv9GD0YHQutCwINGA0LXQvdC00LXRgNCwLlxuICAgKlxuICAgKiBAcGFyYW0gY2FudmFzSWQgLSDQmNC00LXQvdGC0LjRhNC40LrQsNGC0L7RgCDQutCw0L3QstCw0YHQsCwg0L3QsCDQutC+0YLQvtGA0L7QvCDQsdGD0LTQtdGCINGA0LjRgdC+0LLQsNGC0YzRgdGPINCz0YDQsNGE0LjQui5cbiAgICogQHBhcmFtIG9wdGlvbnMgLSDQn9C+0LvRjNC30L7QstCw0YLQtdC70YzRgdC60LjQtSDQvdCw0YHRgtGA0L7QudC60Lgg0Y3QutC30LXQvNC/0LvRj9GA0LAuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihjYW52YXNJZDogc3RyaW5nLCBvcHRpb25zPzogU1Bsb3RPcHRpb25zKSB7XG5cbiAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY2FudmFzSWQpKSB7XG4gICAgICB0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNhbnZhc0lkKSBhcyBIVE1MQ2FudmFzRWxlbWVudFxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ9Ca0LDQvdCy0LDRgSDRgSDQuNC00LXQvdGC0LjRhNC40LrQsNGC0L7RgNC+0LwgXCIjJyArIGNhbnZhc0lkICsgJ1wiINC90LUg0L3QsNC50LTQtdC9IScpXG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMpIHtcblxuICAgICAgLyoqINCV0YHQu9C4INC/0LXRgNC10LTQsNC90Ysg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GM0YHQutC40LUg0L3QsNGB0YLRgNC+0LnQutC4LCDRgtC+INC+0L3QuCDQv9GA0LjQvNC10L3Rj9GO0YLRgdGPLiAqL1xuICAgICAgY29weU1hdGNoaW5nS2V5VmFsdWVzKHRoaXMsIG9wdGlvbnMpXG4gICAgICB0aGlzLmxhc3RSZXF1ZXN0ZWRPcHRpb25zID0gb3B0aW9uc1xuXG4gICAgICAvKiog0JjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y8g0LLRgdC10YUg0L/QsNGA0LDQvNC10YLRgNC+0LIg0YDQtdC90LTQtdGA0LAsINC10YHQu9C4INC30LDQv9GA0L7RiNC10L0g0YTQvtGA0YHQuNGA0L7QstCw0L3QvdGL0Lkg0LfQsNC/0YPRgdC6LiAqL1xuICAgICAgaWYgKHRoaXMuZm9yY2VSdW4pIHtcbiAgICAgICAgdGhpcy5zZXR1cChvcHRpb25zKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCY0L3QuNGG0LjQsNC70LjQt9C40YDRg9C10YIg0L3QtdC+0LHRhdC+0LTQuNC80YvQtSDQtNC70Y8g0YDQtdC90LTQtdGA0LAg0L/QsNGA0LDQvNC10YLRgNGLINGN0LrQt9C10LzQv9C70Y/RgNCwLCDQstGL0L/QvtC70L3Rj9C10YIg0L/QvtC00LPQvtGC0L7QstC60YMg0Lgg0LfQsNC/0L7Qu9C90LXQvdC40LUg0LHRg9GE0LXRgNC+0LIgV2ViR0wuXG4gICAqXG4gICAqIEBwYXJhbSBvcHRpb25zIC0g0J3QsNGB0YLRgNC+0LnQutC4INGN0LrQt9C10LzQv9C70Y/RgNCwLlxuICAgKi9cbiAgcHVibGljIHNldHVwKG9wdGlvbnM/OiBTUGxvdE9wdGlvbnMpOiB2b2lkIHtcblxuICAgIGlmICghb3B0aW9ucykgb3B0aW9ucyA9IHt9XG5cbiAgICAvKiog0J/RgNC40LzQtdC90LXQvdC40LUg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GM0YHQutC40YUg0L3QsNGB0YLRgNC+0LXQui4gKi9cbiAgICBjb3B5TWF0Y2hpbmdLZXlWYWx1ZXModGhpcywgb3B0aW9ucylcbiAgICB0aGlzLmxhc3RSZXF1ZXN0ZWRPcHRpb25zID0gb3B0aW9uc1xuXG4gICAgdGhpcy5kZWJ1Zy5sb2coJ2ludHJvJylcblxuICAgIGlmIChvcHRpb25zLmRhdGEpIHtcbiAgICAgIHRoaXMuaXRlcmF0b3IgPSB0aGlzLmFycmF5SXRlcmF0b3JcbiAgICAgIHRoaXMuYXJyYXlJbmRleCA9IDBcbiAgICB9XG5cbiAgICAvKiog0J/QvtC00LPQvtGC0L7QstC60LAg0LLRgdC10YUg0YXQtdC70L/QtdGA0L7Qsi4g0J/QvtGB0LvQtdC00L7QstCw0YLQtdC70YzQvdC+0YHRgtGMINC/0L7QtNCz0L7RgtC+0LLQutC4INC40LzQtdC10YIg0LfQvdCw0YfQtdC90LjQtS4gKi9cbiAgICB0aGlzLmRlYnVnLnNldHVwKClcbiAgICB0aGlzLmdsc2wuc2V0dXAoKVxuICAgIHRoaXMud2ViZ2wuc2V0dXAoKVxuICAgIHRoaXMuY29udHJvbC5zZXR1cCgpXG4gICAgdGhpcy5kZW1vLnNldHVwKClcblxuICAgIHRoaXMuZGVidWcubG9nKCdpbnN0YW5jZScpXG5cbiAgICAvKiog0J7QsdGA0LDQsdC+0YLQutCwINCy0YHQtdGFINC00LDQvdC90YvRhSDQvtCxINC+0LHRitC10LrRgtCw0YUg0Lgg0LjRhSDQt9Cw0LPRgNGD0LfQutCwINCyINCx0YPRhNC10YDRiyDQstC40LTQtdC+0L/QsNC80Y/RgtC4LiAqL1xuICAgIGlmICh0aGlzLmxvYWREYXRhKSB7XG4gICAgICB0aGlzLmxvYWQoKVxuXG4gICAgICAvKiog0J/QviDRg9C80L7Qu9GH0LDQvdC40Y4g0L/RgNC4INC/0L7QstGC0L7RgNC90L7QvCDQstGL0LfQvtCy0LUg0LzQtdGC0L7QtNCwIHNldHVwINC90L7QstC+0LUg0YfRgtC10L3QuNC1INC+0LHRitC10LrRgtC+0LIg0L3QtSDQv9GA0L7QuNC30LLQvtC00LjRgtGB0Y8uICovXG4gICAgICB0aGlzLmxvYWREYXRhID0gZmFsc2VcbiAgICB9XG5cbiAgICB0aGlzLmNhbWVyYS56b29tID0gTWF0aC5taW4odGhpcy5jYW52YXMud2lkdGgsIHRoaXMuY2FudmFzLmhlaWdodCkgLSB0aGlzLnN0YXRzLm1heE9iamVjdFNpemVcbiAgICB0aGlzLmNhbWVyYS54ID0gMC41IC0gdGhpcy5jYW52YXMud2lkdGggLyAoMiAqIHRoaXMuY2FtZXJhLnpvb20pXG4gICAgdGhpcy5jYW1lcmEueSA9IDAuNVxuXG4gICAgLyoqINCU0LXQudGB0YLQstC40Y8sINC60L7RgtC+0YDRi9C1INCy0YvQv9C+0LvQvdGP0Y7RgtGB0Y8g0YLQvtC70YzQutC+INC/0YDQuCDQv9C10YDQstC+0Lwg0LLRi9C30L7QstC1INC80LXRgtC+0LTQsCBzZXR1cC4gKi9cbiAgICBpZiAoIXRoaXMuaXNTZXR1cGVkKSB7XG5cbiAgICAgIC8qKiDQodC+0LfQtNCw0L3QuNC1INC/0LXRgNC10LzQtdC90L3Ri9GFIFdlYkdsLiAqL1xuICAgICAgdGhpcy53ZWJnbC5jcmVhdGVWYXJpYWJsZXMoJ2FfcG9zaXRpb24nLCAnYV9jb2xvcicsICdhX3NpemUnLCAnYV9zaGFwZScsICd1X21hdHJpeCcpXG5cbiAgICAgIC8qKiDQn9GA0LjQt9C90LDQuiDRgtC+0LPQviwg0YfRgtC+INGN0LrQt9C10LzQv9C70Y/RgCDQutCw0Log0LzQuNC90LjQvNGD0Lwg0L7QtNC40L0g0YDQsNC3INCy0YvQv9C+0LvQvdC40Lsg0LzQtdGC0L7QtCBzZXR1cC4gKi9cbiAgICAgIHRoaXMuaXNTZXR1cGVkID0gdHJ1ZVxuICAgIH1cblxuICAgIC8qKiDQn9GA0L7QstC10YDQutCwINC60L7RgNGA0LXQutGC0L3QvtGB0YLQuCDQvdCw0YHRgtGA0L7QudC60Lgg0Y3QutC30LXQvNC/0LvRj9GA0LAuICovXG4gICAgdGhpcy5jaGVja1NldHVwKClcblxuICAgIGlmICh0aGlzLmZvcmNlUnVuKSB7XG4gICAgICAvKiog0KTQvtGA0YHQuNGA0L7QstCw0L3QvdGL0Lkg0LfQsNC/0YPRgdC6INGA0LXQvdC00LXRgNC40L3Qs9CwICjQtdGB0LvQuCDRgtGA0LXQsdGD0LXRgtGB0Y8pLiAqL1xuICAgICAgdGhpcy5ydW4oKVxuICAgIH1cbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCh0L7Qt9C00LDQtdGCINC4INC30LDQv9C+0LvQvdGP0LXRgiDQtNCw0L3QvdGL0LzQuCDQvtCx0L4g0LLRgdC10YUg0L7QsdGK0LXQutGC0LDRhSDQsdGD0YTQtdGA0YsgV2ViR0wuXG4gICAqL1xuICBwcm90ZWN0ZWQgbG9hZCgpOiB2b2lkIHtcblxuICAgIHRoaXMuZGVidWcubG9nKCdsb2FkaW5nJylcblxuICAgIHRoaXMuc3RhdHMgPSB7IG9ialRvdGFsQ291bnQ6IDAsIGdyb3Vwc0NvdW50OiAwLCBtYXhEZXB0aENvdW50OjAsIG1lbVVzYWdlOiAwLCBtaW5PYmplY3RTaXplOiAxXzAwMF8wMDAsIG1heE9iamVjdFNpemU6IDAgfVxuXG4gICAgbGV0IGR4LCBkeSwgZHogPSAwXG4gICAgbGV0IG9iamVjdDogU1Bsb3RPYmplY3QgfCBudWxsXG4gICAgbGV0IGlzT2JqZWN0RW5kczogYm9vbGVhbiA9IGZhbHNlXG5cbiAgICB0aGlzLmFyZWEuc3RlcCA9IDAuMDJcbiAgICB0aGlzLmFyZWEuY291bnQgPSBNYXRoLnRydW5jKDEgLyB0aGlzLmFyZWEuc3RlcCkgKyAxXG5cbiAgICB0aGlzLmFyZWEuZHhWaXNpYmxlRnJvbSA9IDBcbiAgICB0aGlzLmFyZWEuZHhWaXNpYmxlVG8gPSB0aGlzLmFyZWEuY291bnRcbiAgICB0aGlzLmFyZWEuZHlWaXNpYmxlRnJvbSA9IDBcbiAgICB0aGlzLmFyZWEuZHlWaXNpYmxlVG8gPSB0aGlzLmFyZWEuY291bnRcbiAgICB0aGlzLmFyZWEuZHpWaXNpYmxlRnJvbSA9IDBcblxuICAgIGxldCBncm91cHM6IGFueVtdID0gW11cblxuICAgIGZvciAobGV0IGR4ID0gMDsgZHggPCB0aGlzLmFyZWEuY291bnQ7IGR4KyspIHtcbiAgICAgIGdyb3Vwc1tkeF0gPSBbXVxuICAgICAgZm9yIChsZXQgZHkgPSAwOyBkeSA8IHRoaXMuYXJlYS5jb3VudDsgZHkrKykge1xuICAgICAgICBncm91cHNbZHhdW2R5XSA9IFtdXG4gICAgICB9XG4gICAgfVxuXG4gICAgd2hpbGUgKCFpc09iamVjdEVuZHMpIHtcblxuICAgICAgb2JqZWN0ID0gdGhpcy5pdGVyYXRvciEoKVxuXG4gICAgICAvKiog0J7QsdGK0LXQutGC0Ysg0LfQsNC60L7QvdGH0LjQu9C40YHRjCwg0LXRgdC70Lgg0LjRgtC10YDQsNGC0L7RgCDQstC10YDQvdGD0LsgbnVsbCDQuNC70Lgg0LXRgdC70Lgg0LTQvtGB0YLQuNCz0L3Rg9GCINC70LjQvNC40YIg0YfQuNGB0LvQsCDQvtCx0YrQtdC60YLQvtCyLiAqL1xuICAgICAgaXNPYmplY3RFbmRzID0gKG9iamVjdCA9PT0gbnVsbCkgfHwgKHRoaXMuc3RhdHMub2JqVG90YWxDb3VudCA+PSB0aGlzLmdsb2JhbExpbWl0KVxuXG4gICAgICBpZiAoIWlzT2JqZWN0RW5kcykge1xuXG4gICAgICAgIG9iamVjdCA9IHRoaXMuY2hlY2tPYmplY3Qob2JqZWN0ISlcblxuICAgICAgICBkeCA9IE1hdGgudHJ1bmMob2JqZWN0LnggLyB0aGlzLmFyZWEuc3RlcClcbiAgICAgICAgZHkgPSBNYXRoLnRydW5jKG9iamVjdC55IC8gdGhpcy5hcmVhLnN0ZXApXG5cbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZ3JvdXBzW2R4XVtkeV1bZHpdKSkge1xuICAgICAgICAgIGR6ID0gZ3JvdXBzW2R4XVtkeV0ubGVuZ3RoIC0gMVxuICAgICAgICAgIGlmIChncm91cHNbZHhdW2R5XVtkel1bMV0ubGVuZ3RoID49IHRoaXMuZ3JvdXBMaW1pdCkge1xuICAgICAgICAgICAgZHorK1xuICAgICAgICAgICAgZ3JvdXBzW2R4XVtkeV1bZHpdID0gW11cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNDsgaSsrKSB7IGdyb3Vwc1tkeF1bZHldW2R6XVtpXSA9IFtdIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZHogPSAwXG4gICAgICAgICAgZ3JvdXBzW2R4XVtkeV1bZHpdID0gW11cbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDQ7IGkrKykgeyBncm91cHNbZHhdW2R5XVtkel1baV0gPSBbXSB9IC8vINCc0LDRgdGB0LjQsjogMC0g0LLQtdGA0YjQuNC90YssIDEgLSDRhNC+0YDQvNGLLCAyIC0g0YbQstC10YLQsCwgMyAtINGA0LDQt9C80LXRgNGLXG4gICAgICAgIH1cblxuICAgICAgICBncm91cHNbZHhdW2R5XVtkel1bMF0ucHVzaChvYmplY3QueCwgb2JqZWN0LnkpXG4gICAgICAgIGdyb3Vwc1tkeF1bZHldW2R6XVsxXS5wdXNoKG9iamVjdC5zaGFwZSlcbiAgICAgICAgZ3JvdXBzW2R4XVtkeV1bZHpdWzJdLnB1c2gob2JqZWN0LmNvbG9yKVxuICAgICAgICBncm91cHNbZHhdW2R5XVtkel1bM10ucHVzaChvYmplY3Quc2l6ZSlcblxuICAgICAgICBpZiAob2JqZWN0LnNpemUgPiB0aGlzLnN0YXRzLm1heE9iamVjdFNpemUpIHtcbiAgICAgICAgICB0aGlzLnN0YXRzLm1heE9iamVjdFNpemUgPSBvYmplY3Quc2l6ZVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9iamVjdC5zaXplIDwgdGhpcy5zdGF0cy5taW5PYmplY3RTaXplKSB7XG4gICAgICAgICAgdGhpcy5zdGF0cy5taW5PYmplY3RTaXplID0gb2JqZWN0LnNpemVcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc3RhdHMub2JqVG90YWxDb3VudCsrXG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5hcmVhLmdyb3VwcyA9IGdyb3Vwc1xuXG4gICAgdGhpcy53ZWJnbC5jbGVhckRhdGEoKVxuXG4gICAgLyoqINCY0YLQtdGA0LjRgNC+0LLQsNC90LjQtSDQuCDQt9Cw0L3QtdGB0LXQvdC40LUg0LTQsNC90L3Ri9GFINCyINCx0YPRhNC10YDRiyBXZWJHTC4gKi9cbiAgICBmb3IgKGxldCBkeCA9IDA7IGR4IDwgdGhpcy5hcmVhLmNvdW50OyBkeCsrKSB7XG4gICAgICBmb3IgKGxldCBkeSA9IDA7IGR5IDwgdGhpcy5hcmVhLmNvdW50OyBkeSsrKSB7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGdyb3Vwc1tkeF1bZHldKSkge1xuICAgICAgICAgIGZvciAobGV0IGR6ID0gMDsgZHogPCBncm91cHNbZHhdW2R5XS5sZW5ndGg7IGR6KyspIHtcblxuICAgICAgICAgICAgdGhpcy5zdGF0cy5tZW1Vc2FnZSArPVxuICAgICAgICAgICAgICB0aGlzLndlYmdsLmNyZWF0ZUJ1ZmZlcihkeCwgZHksIGR6LCAwLCBuZXcgRmxvYXQzMkFycmF5KGdyb3Vwc1tkeF1bZHldW2R6XVswXSkpICtcbiAgICAgICAgICAgICAgdGhpcy53ZWJnbC5jcmVhdGVCdWZmZXIoZHgsIGR5LCBkeiwgMSwgbmV3IFVpbnQ4QXJyYXkoZ3JvdXBzW2R4XVtkeV1bZHpdWzFdKSkgK1xuICAgICAgICAgICAgICB0aGlzLndlYmdsLmNyZWF0ZUJ1ZmZlcihkeCwgZHksIGR6LCAyLCBuZXcgVWludDhBcnJheShncm91cHNbZHhdW2R5XVtkel1bMl0pKSArXG4gICAgICAgICAgICAgIHRoaXMud2ViZ2wuY3JlYXRlQnVmZmVyKGR4LCBkeSwgZHosIDMsIG5ldyBVaW50OEFycmF5KGdyb3Vwc1tkeF1bZHldW2R6XVszXSkpXG5cbiAgICAgICAgICAgIHRoaXMuc3RhdHMuZ3JvdXBzQ291bnQgKz0gNFxuICAgICAgICAgICAgaWYgKGdyb3Vwc1tkeF1bZHldLmxlbmd0aCA+IHRoaXMuc3RhdHMubWF4RGVwdGhDb3VudCkge1xuICAgICAgICAgICAgICB0aGlzLnN0YXRzLm1heERlcHRoQ291bnQgPSBncm91cHNbZHhdW2R5XS5sZW5ndGhcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmRlYnVnLmxvZygnbG9hZGVkJylcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCf0YDQvtCy0LXRgNGP0LXRgiDQutC+0YDRgNC10LrRgtC90L7RgdGC0Ywg0L/QsNGA0LDQvNC10YLRgNC+0LIg0L7QsdGK0LXQutGC0LAg0Lgg0LIg0YHQu9GD0YfQsNC1INC90LXQvtCx0YXQvtC00LjQvNC+0YHRgtC4INCy0L3QvtGB0LjRgiDQsiDQvdC40YUg0LjQt9C80LXQvdC10L3QuNGPLlxuICAgKi9cbiAgY2hlY2tPYmplY3Qob2JqZWN0OiBTUGxvdE9iamVjdCk6IFNQbG90T2JqZWN0IHtcblxuICAgIC8qKiDQn9GA0L7QstC10YDQutCwINC60L7RgNGA0LXQutGC0L3QvtGB0YLQuCDRgNCw0YHQv9C+0LvQvtC20LXQvdC40Y8g0L7QsdGK0LXQutGC0LAuICovXG4gICAgaWYgKG9iamVjdC54ID4gMSkge1xuICAgICAgb2JqZWN0LnggPSAxXG4gICAgfSBlbHNlIGlmIChvYmplY3QueCA8IDApIHtcbiAgICAgIG9iamVjdC54ID0gMFxuICAgIH1cblxuICAgIGlmIChvYmplY3QueSA+IDEpIHtcbiAgICAgIG9iamVjdC55ID0gMVxuICAgIH0gZWxzZSBpZiAob2JqZWN0LnkgPCAwKSB7XG4gICAgICBvYmplY3QueSA9IDBcbiAgICB9XG5cbiAgICAvKiog0J/RgNC+0LLQtdGA0LrQsCDQutC+0YDRgNC10LrRgtC90L7RgdGC0Lgg0YTQvtGA0LzRiyDQuCDRhtCy0LXRgtCwINC+0LHRitC10LrRgtCwINC+0LHRitC10LrRgtCwLiAqL1xuICAgIGlmICgob2JqZWN0LnNoYXBlID49IHRoaXMuc2hhcGVzQ291bnQhKSB8fCAob2JqZWN0LnNoYXBlIDwgMCkpIG9iamVjdC5zaGFwZSA9IDBcbiAgICBpZiAoKG9iamVjdC5jb2xvciA+PSB0aGlzLmNvbG9ycy5sZW5ndGgpIHx8IChvYmplY3QuY29sb3IgPCAwKSkgb2JqZWN0LmNvbG9yID0gMFxuXG4gICAgcmV0dXJuIG9iamVjdFxuICB9XG5cbiAgdXBkYXRlVmlzaWJsZUFyZWEoKSB7XG4gICAgY29uc3Qga3ggPSB0aGlzLmNhbnZhcy53aWR0aCAvICgyICogdGhpcy5jYW1lcmEuem9vbSEpXG4gICAgY29uc3Qga3kgPSB0aGlzLmNhbnZhcy5oZWlnaHQgLyAoMiAqIHRoaXMuY2FtZXJhLnpvb20hKVxuICAgIGNvbnN0IGNhbWVyYUxlZnQgPSB0aGlzLmNhbWVyYS54IVxuICAgIGNvbnN0IGNhbWVyYVJpZ2h0ID0gdGhpcy5jYW1lcmEueCEgKyAyKmt4XG4gICAgY29uc3QgY2FtZXJhVG9wID0gdGhpcy5jYW1lcmEueSEgLSBreVxuICAgIGNvbnN0IGNhbWVyYUJvdHRvbSA9IHRoaXMuY2FtZXJhLnkhICsga3lcblxuICAgIGlmICggKGNhbWVyYUxlZnQgPCAxKSAmJiAoY2FtZXJhUmlnaHQgPiAwKSAmJiAoY2FtZXJhVG9wIDwgMSkgJiYgKGNhbWVyYUJvdHRvbSA+IDApICkge1xuICAgICAgdGhpcy5hcmVhLmR4VmlzaWJsZUZyb20gPSAoY2FtZXJhTGVmdCA8IDApID8gMCA6IE1hdGgudHJ1bmMoY2FtZXJhTGVmdCAvIHRoaXMuYXJlYS5zdGVwKVxuICAgICAgdGhpcy5hcmVhLmR4VmlzaWJsZVRvID0gKGNhbWVyYVJpZ2h0ID4gMSkgPyB0aGlzLmFyZWEuY291bnQgOiB0aGlzLmFyZWEuY291bnQgLSBNYXRoLnRydW5jKCgxIC0gY2FtZXJhUmlnaHQpIC8gdGhpcy5hcmVhLnN0ZXApXG4gICAgICB0aGlzLmFyZWEuZHlWaXNpYmxlRnJvbSA9IChjYW1lcmFUb3AgPCAwKSA/IDAgOiBNYXRoLnRydW5jKGNhbWVyYVRvcCAvIHRoaXMuYXJlYS5zdGVwKVxuICAgICAgdGhpcy5hcmVhLmR5VmlzaWJsZVRvID0gKGNhbWVyYUJvdHRvbSA+IDEpID8gdGhpcy5hcmVhLmNvdW50IDogdGhpcy5hcmVhLmNvdW50IC0gTWF0aC50cnVuYygoMSAtIGNhbWVyYUJvdHRvbSkgLyB0aGlzLmFyZWEuc3RlcClcblxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmFyZWEuZHhWaXNpYmxlRnJvbSA9IDFcbiAgICAgIHRoaXMuYXJlYS5keFZpc2libGVUbyA9IDBcbiAgICAgIHRoaXMuYXJlYS5keVZpc2libGVGcm9tID0gMVxuICAgICAgdGhpcy5hcmVhLmR5VmlzaWJsZVRvID0gMFxuICAgIH1cblxuICAgIHRoaXMuYXJlYS5kelZpc2libGVGcm9tID0gMDtcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCf0YDQvtC40LfQstC+0LTQuNGCINGA0LXQvdC00LXRgNC40L3QsyDQs9GA0LDRhNC40LrQsCDQsiDRgdC+0L7RgtCy0LXRgtGB0YLQstC40Lgg0YEg0YLQtdC60YPRidC40LzQuCDQv9Cw0YDQsNC80LXRgtGA0LDQvNC4INGC0YDQsNC90YHRhNC+0YDQvNCw0YbQuNC4LlxuICAgKi9cbiAgcHVibGljIHJlbmRlcigpOiB2b2lkIHtcblxuICAgIC8qKiDQntGH0LjRgdGC0LrQsCDQvtCx0YrQtdC60YLQsCDRgNC10L3QtNC10YDQuNC90LPQsCBXZWJHTC4gKi9cbiAgICB0aGlzLndlYmdsLmNsZWFyQmFja2dyb3VuZCgpXG5cbiAgICAvKiog0J7QsdC90L7QstC70LXQvdC40LUg0LzQsNGC0YDQuNGG0Ysg0YLRgNCw0L3RgdGE0L7RgNC80LDRhtC40LguICovXG4gICAgdGhpcy5jb250cm9sLnVwZGF0ZVZpZXdQcm9qZWN0aW9uKClcblxuICAgIC8qKiDQn9GA0LjQstGP0LfQutCwINC80LDRgtGA0LjRhtGLINGC0YDQsNC90YHRhNC+0YDQvNCw0YbQuNC4INC6INC/0LXRgNC10LzQtdC90L3QvtC5INGI0LXQudC00LXRgNCwLiAqL1xuICAgIHRoaXMud2ViZ2wuc2V0VmFyaWFibGUoJ3VfbWF0cml4JywgdGhpcy5jb250cm9sLnRyYW5zZm9ybS52aWV3UHJvamVjdGlvbk1hdClcblxuICAgIHRoaXMudXBkYXRlVmlzaWJsZUFyZWEoKVxuXG4gICAgLy9sZXQgenogPSAwXG4gICAgLyoqINCY0YLQtdGA0LjRgNC+0LLQsNC90LjQtSDQuCDRgNC10L3QtNC10YDQuNC90LMg0LPRgNGD0L/QvyDQsdGD0YTQtdGA0L7QsiBXZWJHTC4gKi9cbiAgICBmb3IgKGxldCBkeCA9IHRoaXMuYXJlYS5keFZpc2libGVGcm9tOyBkeCA8IHRoaXMuYXJlYS5keFZpc2libGVUbzsgZHgrKykge1xuICAgICAgZm9yIChsZXQgZHkgPSB0aGlzLmFyZWEuZHlWaXNpYmxlRnJvbTsgZHkgPCB0aGlzLmFyZWEuZHlWaXNpYmxlVG87IGR5KyspIHtcbiAgICAgICAgY29uc3QgZ3IgPSB0aGlzLmFyZWEuZ3JvdXBzW2R4XVtkeV1cbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZ3IpKSB7XG4gICAgICAgICAgY29uc3QgZ3JfbGVuID0gZ3IubGVuZ3RoXG4gICAgICAgICAgZm9yIChsZXQgZHogPSB0aGlzLmFyZWEuZHpWaXNpYmxlRnJvbTsgZHogPCBncl9sZW47IGR6KyspIHtcblxuICAgICAgICAgICAgdGhpcy53ZWJnbC5zZXRCdWZmZXIoZHgsIGR5LCBkeiwgMCwgJ2FfcG9zaXRpb24nLCAyLCAwLCAwKVxuICAgICAgICAgICAgdGhpcy53ZWJnbC5zZXRCdWZmZXIoZHgsIGR5LCBkeiwgMSwgJ2Ffc2hhcGUnLCAxLCAwLCAwKVxuICAgICAgICAgICAgdGhpcy53ZWJnbC5zZXRCdWZmZXIoZHgsIGR5LCBkeiwgMiwgJ2FfY29sb3InLCAxLCAwLCAwKVxuICAgICAgICAgICAgdGhpcy53ZWJnbC5zZXRCdWZmZXIoZHgsIGR5LCBkeiwgMywgJ2Ffc2l6ZScsIDEsIDAsIDApXG5cbiAgICAgICAgICAgIHRoaXMud2ViZ2wuZHJhd1BvaW50cygwLCBncltkel1bMV0ubGVuZ3RoKVxuXG4gICAgICAgICAgICAvL3p6KytcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coYHg9JHt0aGlzLmNhbWVyYS54fSwgeT0ke3RoaXMuY2FtZXJhLnl9LCB6b29tPSR7dGhpcy5jYW1lcmEuem9vbX1gKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICAvL2NvbnNvbGUubG9nKCd6eiA9ICcsIHp6KTtcbiAgICAvL2NvbnNvbGUubG9nKGB4PSR7dGhpcy5jYW1lcmEueH0sIHk9JHt0aGlzLmNhbWVyYS55fSwgem9vbT0ke3RoaXMuY2FtZXJhLnpvb219YClcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCf0YDQvtCy0LXRgNGP0LXRgiDQutC+0YDRgNC10LrRgtC90L7RgdGC0Ywg0L3QsNGB0YLRgNC+0LXQuiDRjdC60LfQtdC80L/Qu9GP0YDQsC5cbiAgICpcbiAgICogQHJlbWFya3NcbiAgICog0JjRgdC/0L7Qu9GM0LfRg9C10YLRgdGPINC00LvRjyDQv9GA0L7QstC10YDQutC4INC60L7RgNGA0LXQutGC0L3QvtGB0YLQuCDQu9C+0LPQuNC60Lgg0YDQsNCx0L7RgtGLINC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjyDRgSDRjdC60LfQtdC80L/Qu9GP0YDQvtC8LiDQndC1INC/0L7Qt9Cy0L7Qu9GP0LXRgiDRgNCw0LHQvtGC0LDRgtGMINGBXG4gICAqINC90LXQvdCw0YHRgtGA0L7QtdC90L3Ri9C8INC40LvQuCDQvdC10LrQvtGA0YDQtdC60YLQvdC+INC90LDRgdGC0YDQvtC10L3QvdGL0Lwg0Y3QutC30LXQvNC/0LvRj9GA0L7QvC5cbiAgICovXG4gIGNoZWNrU2V0dXAoKSB7XG5cbiAgICAvKipcbiAgICAgKiAg0J/QvtC70YzQt9C+0LLQsNGC0LXQu9GMINC80L7QsyDQvdCw0YHRgtGA0L7QuNGC0Ywg0Y3QutC30LXQvNC/0LvRj9GAINCyINC60L7QvdGB0YLRgNGD0LrRgtC+0YDQtSDQuCDRgdGA0LDQt9GDINC30LDQv9GD0YHRgtC40YLRjCDRgNC10L3QtNC10YAsINCyINGC0LDQutC+0Lwg0YHQu9GD0YfQsNC1INC80LXRgtC+0LQgc2V0dXBcbiAgICAgKiAg0LHRg9C00LXRgiDQstGL0LfRi9Cy0LDQtdGC0YHRjyDQvdC10Y/QstC90L4uXG4gICAgICovXG4gICAgaWYgKCF0aGlzLmlzU2V0dXBlZCkge1xuICAgICAgdGhpcy5zZXR1cCgpXG4gICAgfVxuXG4gICAgLyoqINCd0LDQsdC+0YAg0L/RgNC+0LLQtdGA0L7QuiDQutC+0YDRgNC10LrRgtC90L7RgdGC0Lgg0L3QsNGB0YLRgNC+0LnQutC4INGN0LrQt9C10LzQv9C70Y/RgNCwLiAqL1xuICAgIGlmICghdGhpcy5pdGVyYXRvcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCfQndC1INC30LDQtNCw0L3QsCDRhNGD0L3QutGG0LjRjyDQuNGC0LXRgNC40YDQvtCy0LDQvdC40Y8g0L7QsdGK0LXQutGC0L7QsiEnKVxuICAgIH1cbiAgfVxuXG4gIGFycmF5SXRlcmF0b3IoKSB7XG4gICAgaWYgKHRoaXMuZGF0YSFbdGhpcy5hcnJheUluZGV4XSkge1xuICAgICAgcmV0dXJuIHRoaXMuZGF0YSFbdGhpcy5hcnJheUluZGV4KytdXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JfQsNC/0YPRgdC60LDQtdGCINGA0LXQvdC00LXRgNC40L3QsyDQuCDQutC+0L3RgtGA0L7Qu9GMINGD0L/RgNCw0LLQu9C10L3QuNGPLlxuICAgKi9cbiAgcHVibGljIHJ1bigpOiB2b2lkIHtcblxuICAgIHRoaXMuY2hlY2tTZXR1cCgpXG5cbiAgICBpZiAoIXRoaXMuaXNSdW5uaW5nKSB7XG4gICAgICB0aGlzLnJlbmRlcigpXG4gICAgICB0aGlzLmNvbnRyb2wucnVuKClcbiAgICAgIHRoaXMuaXNSdW5uaW5nID0gdHJ1ZVxuICAgICAgdGhpcy5kZWJ1Zy5sb2coJ3N0YXJ0ZWQnKVxuICAgIH1cbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCe0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdGCINGA0LXQvdC00LXRgNC40L3QsyDQuCDQutC+0L3RgtGA0L7Qu9GMINGD0L/RgNCw0LLQu9C10L3QuNGPLlxuICAgKi9cbiAgcHVibGljIHN0b3AoKTogdm9pZCB7XG5cbiAgICB0aGlzLmNoZWNrU2V0dXAoKVxuXG4gICAgaWYgKHRoaXMuaXNSdW5uaW5nKSB7XG4gICAgICB0aGlzLmNvbnRyb2wuc3RvcCgpXG4gICAgICB0aGlzLmlzUnVubmluZyA9IGZhbHNlXG4gICAgICB0aGlzLmRlYnVnLmxvZygnc3RvcGVkJylcbiAgICB9XG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQntGH0LjRidCw0LXRgiDRhNC+0L0uXG4gICAqL1xuICBwdWJsaWMgY2xlYXIoKTogdm9pZCB7XG5cbiAgICB0aGlzLmNoZWNrU2V0dXAoKVxuXG4gICAgdGhpcy53ZWJnbC5jbGVhckJhY2tncm91bmQoKVxuICAgIHRoaXMuZGVidWcubG9nKCdjbGVhcmVkJylcbiAgfVxufVxuIiwiXG4vKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICpcbiAqINCf0YDQvtCy0LXRgNGP0LXRgiDRj9Cy0LvRj9C10YLRgdGPINC70Lgg0L/QtdGA0LXQvNC10L3QvdCw0Y8g0Y3QutC30LXQvNC/0LvRj9GA0L7QvCDQutCw0LrQvtCz0L4t0LvQuNCx0L7QviDQutC70LDRgdGB0LAuXG4gKlxuICogQHBhcmFtIHZhcmlhYmxlIC0g0J/RgNC+0LLQtdGA0Y/QtdC80LDRjyDQv9C10YDQtdC80LXQvdC90LDRjy5cbiAqIEByZXR1cm5zINCg0LXQt9GD0LvRjNGC0LDRgiDQv9GA0L7QstC10YDQutC4LlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNPYmplY3QodmFyaWFibGU6IGFueSk6IGJvb2xlYW4ge1xuICByZXR1cm4gKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YXJpYWJsZSkgPT09ICdbb2JqZWN0IE9iamVjdF0nKVxufVxuXG4vKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICpcbiAqINCf0LXRgNC10L7Qv9GA0LXQtNC10LvRj9C10YIg0LfQvdCw0YfQtdC90LjRjyDQv9C+0LvQtdC5INC+0LHRitC10LrRgtCwIHRhcmdldCDQvdCwINC30L3QsNGH0LXQvdC40Y8g0L/QvtC70LXQuSDQvtCx0YrQtdC60YLQsCBzb3VyY2UuXG4gKlxuICogQHJlbWFya3NcbiAqINCf0LXRgNC10L7Qv9GA0LXQtNC10LvRj9GO0YLRgdGPINGC0L7Qu9GM0LrQviDRgtC1INC/0L7Qu9GPLCDQutC+0YLQvtGA0YvQtSDRgdGD0YnQtdGB0YLQstGD0LXRjtGCINCyIHRhcmdldC4g0JXRgdC70Lgg0LIgc291cmNlINC10YHRgtGMINC/0L7Qu9GPLCDQutC+0YLQvtGA0YvRhSDQvdC10YIg0LIgdGFyZ2V0LCDRgtC+INC+0L3QuFxuICog0LjQs9C90L7RgNC40YDRg9GO0YLRgdGPLiDQldGB0LvQuCDQutCw0LrQuNC1LdGC0L4g0L/QvtC70Y8g0YHQsNC80Lgg0Y/QstC70Y/RjtGC0YHRjyDRj9Cy0LvRj9GO0YLRgdGPINC+0LHRitC10LrRgtCw0LzQuCwg0YLQviDRgtC+INC+0L3QuCDRgtCw0LrQttC1INGA0LXQutGD0YDRgdC40LLQvdC+INC60L7Qv9C40YDRg9GO0YLRgdGPICjQv9GA0Lgg0YLQvtC8INC20LVcbiAqINGD0YHQu9C+0LLQuNC4LCDRh9GC0L4g0LIg0YbQtdC70LXQstC+0Lwg0L7QsdGK0LXQutGC0LUg0YHRg9GJ0LXRgdGC0LLRg9GO0YIg0L/QvtC70Y8g0L7QsdGK0LXQutGC0LAt0LjRgdGC0L7Rh9C90LjQutCwKS5cbiAqXG4gKiBAcGFyYW0gdGFyZ2V0IC0g0KbQtdC70LXQstC+0LkgKNC40LfQvNC10L3Rj9C10LzRi9C5KSDQvtCx0YrQtdC60YIuXG4gKiBAcGFyYW0gc291cmNlIC0g0J7QsdGK0LXQutGCINGBINC00LDQvdC90YvQvNC4LCDQutC+0YLQvtGA0YvQtSDQvdGD0LbQvdC+INGD0YHRgtCw0L3QvtCy0LjRgtGMINGDINGG0LXQu9C10LLQvtCz0L4g0L7QsdGK0LXQutGC0LAuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb3B5TWF0Y2hpbmdLZXlWYWx1ZXModGFyZ2V0OiBhbnksIHNvdXJjZTogYW55KTogdm9pZCB7XG4gIE9iamVjdC5rZXlzKHNvdXJjZSkuZm9yRWFjaChrZXkgPT4ge1xuICAgIGlmIChrZXkgaW4gdGFyZ2V0KSB7XG4gICAgICBpZiAoaXNPYmplY3Qoc291cmNlW2tleV0pKSB7XG4gICAgICAgIGlmIChpc09iamVjdCh0YXJnZXRba2V5XSkpIHtcbiAgICAgICAgICBjb3B5TWF0Y2hpbmdLZXlWYWx1ZXModGFyZ2V0W2tleV0sIHNvdXJjZVtrZXldKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoIWlzT2JqZWN0KHRhcmdldFtrZXldKSAmJiAodHlwZW9mIHRhcmdldFtrZXldICE9PSAnZnVuY3Rpb24nKSkge1xuICAgICAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSlcbn1cblxuLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqXG4gKiDQktC+0LfQstGA0LDRidCw0LXRgiDRgdC70YPRh9Cw0LnQvdC+0LUg0YbQtdC70L7QtSDRh9C40YHQu9C+INCyINC00LjQsNC/0LDQt9C+0L3QtTogWzAuLi5yYW5nZS0xXS5cbiAqXG4gKiBAcGFyYW0gcmFuZ2UgLSDQktC10YDRhdC90LjQuSDQv9GA0LXQtNC10Lsg0LTQuNCw0L/QsNC30L7QvdCwINGB0LvRg9GH0LDQudC90L7Qs9C+INCy0YvQsdC+0YDQsC5cbiAqIEByZXR1cm5zINCh0LvRg9GH0LDQudC90L7QtSDRh9C40YHQu9C+LlxuICovXG5leHBvcnQgZnVuY3Rpb24gcmFuZG9tSW50KHJhbmdlOiBudW1iZXIpOiBudW1iZXIge1xuICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcmFuZ2UpXG59XG5cbi8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKlxuICog0JrQvtC90LLQtdGA0YLQuNGA0YPQtdGCINGG0LLQtdGCINC40LcgSEVYLdGE0L7RgNC80LDRgtCwINCyIEdMU0wt0YTQvtGA0LzQsNGCLlxuICpcbiAqIEBwYXJhbSBoZXhDb2xvciAtINCm0LLQtdGCINCyIEhFWC3RhNC+0YDQvNCw0YLQtSAoXCIjZmZmZmZmXCIpLlxuICogQHJldHVybnMg0JzQsNGB0YHQuNCyINC40Lcg0YLRgNC10YUg0YfQuNGB0LXQuyDQsiDQtNC40LDQv9Cw0LfQvtC90LUg0L7RgiAwINC00L4gMS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbG9yRnJvbUhleFRvR2xSZ2IoaGV4Q29sb3I6IHN0cmluZyk6IG51bWJlcltdIHtcbiAgbGV0IGsgPSAvXiM/KFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pJC9pLmV4ZWMoaGV4Q29sb3IpXG4gIGxldCBbciwgZywgYl0gPSBbcGFyc2VJbnQoayFbMV0sIDE2KSAvIDI1NSwgcGFyc2VJbnQoayFbMl0sIDE2KSAvIDI1NSwgcGFyc2VJbnQoayFbM10sIDE2KSAvIDI1NV1cbiAgcmV0dXJuIFtyLCBnLCBiXVxufVxuXG4vKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICpcbiAqINCS0L7Qt9Cy0YDQsNGJ0LDQtdGCINGB0YLRgNC+0LrQvtCy0YPRjiDQt9Cw0L/QuNGB0Ywg0YLQtdC60YPRidC10LPQviDQstGA0LXQvNC10L3QuC5cbiAqXG4gKiBAcmV0dXJucyDQodGC0YDQvtC60LAg0LLRgNC10LzQtdC90Lgg0LIg0YTQvtGA0LzQsNGC0LUgXCJoaDptbTpzc1wiLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q3VycmVudFRpbWUoKTogc3RyaW5nIHtcblxuICBsZXQgdG9kYXkgPSBuZXcgRGF0ZSgpXG5cbiAgcmV0dXJuIFtcbiAgICB0b2RheS5nZXRIb3VycygpLnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgJzAnKSxcbiAgICB0b2RheS5nZXRNaW51dGVzKCkudG9TdHJpbmcoKS5wYWRTdGFydCgyLCAnMCcpLFxuICAgIHRvZGF5LmdldFNlY29uZHMoKS50b1N0cmluZygpLnBhZFN0YXJ0KDIsICcwJylcbiAgXS5qb2luKCc6Jylcbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgU1Bsb3QgZnJvbSAnQC9zcGxvdCdcbmltcG9ydCAnQC9zdHlsZSdcblxuLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cblxubGV0IG4gPSAxXzAwMF8wMDBcbmxldCBjb2xvcnMgPSBbJyNEODFDMDEnLCAnI0U5OTY3QScsICcjQkE1NUQzJywgJyNGRkQ3MDAnLCAnI0ZGRTRCNScsICcjRkY4QzAwJywgJyMyMjhCMjInLCAnIzkwRUU5MCcsICcjNDE2OUUxJywgJyMwMEJGRkYnLCAnIzhCNDUxMycsICcjMDBDRUQxJ11cbmxldCBjb2xvcnMyID0gWycjMDAwMDAwJywgJyNmZjAwMDAnLCAnIzAwZmYwMCcsICcjMDAwMGZmJ11cblxuLyoqINCh0LjQvdGC0LXRgtC40YfQtdGB0LrQsNGPINC40YLQtdGA0LjRgNGD0Y7RidCw0Y8g0YTRg9C90LrRhtC40Y8uICovXG5sZXQgaSA9IDBcbmZ1bmN0aW9uIHJlYWROZXh0T2JqZWN0KCkge1xuICBpZiAoaSA8IG4pIHtcbiAgICBpKytcbiAgICByZXR1cm4ge1xuICAgICAgeDogTWF0aC5yYW5kb20oKSxcbiAgICAgIHk6IE1hdGgucmFuZG9tKCksXG4gICAgICBzaGFwZTogcmFuZG9tSW50KDUpLFxuICAgICAgc2l6ZTogMzAsXG4gICAgICBjb2xvcjogcmFuZG9tSW50KGNvbG9ycy5sZW5ndGgpXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGkgPSAwXG4gICAgcmV0dXJuIG51bGwgIC8vINCS0L7Qt9Cy0YDQsNGJ0LDQtdC8IG51bGwsINC60L7Qs9C00LAg0L7QsdGK0LXQutGC0YsgXCLQt9Cw0LrQvtC90YfQuNC70LjRgdGMXCIuXG4gIH1cbn1cblxuZnVuY3Rpb24gcmFuZG9tSW50KHJhbmdlKSB7XG4gIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiByYW5nZSlcbn1cblxuY29uc3Qgc2l6ZSA9IDMwXG5cbmNvbnN0IGRhdGEgPSBbXG4gIHsgeDogMCwgeTogMCwgc2hhcGU6IDAsIHNpemU6IHNpemUsIGNvbG9yOiAwIH0sXG4gIHsgeDogMCwgeTogMC41LCBzaGFwZTogMCwgc2l6ZTogc2l6ZSwgY29sb3I6IDEgfSxcbiAgeyB4OiAwLjUsIHk6IDAuNSwgc2hhcGU6IDAsIHNpemU6IHNpemUsIGNvbG9yOiAyIH0sXG4gIHsgeDogMC41LCB5OiAwLCBzaGFwZTogMCwgc2l6ZTogc2l6ZSwgY29sb3I6IDMgfSxcbl1cblxuLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cblxubGV0IHNjYXR0ZXJQbG90ID0gbmV3IFNQbG90KCdjYW52YXMxJylcblxuc2NhdHRlclBsb3Quc2V0dXAoe1xuICBpdGVyYXRvcjogcmVhZE5leHRPYmplY3QsXG4gIC8vZGF0YTogZGF0YSxcbiAgY29sb3JzOiBjb2xvcnMsXG4gIGRlYnVnOiB7XG4gICAgaXNFbmFibGU6IHRydWUsXG4gIH0sXG4gIGRlbW86IHtcbiAgICBpc0VuYWJsZTogZmFsc2VcbiAgfSxcbiAgd2ViZ2w6IHtcbiAgICBmYWlsSWZNYWpvclBlcmZvcm1hbmNlQ2F2ZWF0OiB0cnVlXG4gIH1cbn0pXG5cbnNjYXR0ZXJQbG90LnJ1bigpXG4iXSwic291cmNlUm9vdCI6IiJ9