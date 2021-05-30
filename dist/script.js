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
    SPlotWebGl.prototype.createBuffer = function (dx, dy, groupCode, data) {
        var buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW);
        this.data[dx][dy][groupCode] = buffer;
        this.groupType[groupCode] = this.glNumberTypes.get(data.constructor.name);
        //console.log('BUFFER_SIZE = ', this.gl.getBufferParameter(this.gl.ARRAY_BUFFER, this.gl.BUFFER_SIZE));
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
     * @param varName - Имя переменной (из массива {@link variables}), с которой будет связан буфер.
     * @param size - Количество элементов в буфере, соответствующих одной  GL-вершине.
     * @param stride - Размер шага обработки элементов буфера (значение 0 задает размещение элементов друг за другом).
     * @param offset - Смещение относительно начала буфера, начиная с которого будет происходить обработка элементов.
     */
    SPlotWebGl.prototype.setBuffer = function (dx, dy, groupCode, varName, size, stride, offset) {
        var variable = this.variables.get(varName);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.data[dx][dy][groupCode]);
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
        this.stats = { objTotalCount: 0, groupsCount: 0, memUsage: 0, minObjectSize: 1000000, maxObjectSize: 0 };
        var dx, dy = 0;
        var object;
        var isObjectEnds = false;
        this.area.step = 0.02;
        this.area.count = Math.trunc(1 / this.area.step) + 1;
        var groups = [];
        for (var dx_1 = 0; dx_1 < this.area.count; dx_1++) {
            groups[dx_1] = [];
            for (var dy_1 = 0; dy_1 < this.area.count; dy_1++) {
                groups[dx_1][dy_1] = [];
                for (var i = 0; i < 4; i++) {
                    groups[dx_1][dy_1][i] = [];
                }
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
                groups[dx][dy][0].push(object.x, object.y);
                groups[dx][dy][1].push(object.shape);
                groups[dx][dy][2].push(object.color);
                groups[dx][dy][3].push(object.size);
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
                if (groups[dx_2][dy_2][1].length > 0) {
                    this.stats.memUsage +=
                        this.webgl.createBuffer(dx_2, dy_2, 0, new Float32Array(groups[dx_2][dy_2][0])) +
                            this.webgl.createBuffer(dx_2, dy_2, 1, new Uint8Array(groups[dx_2][dy_2][1])) +
                            this.webgl.createBuffer(dx_2, dy_2, 2, new Uint8Array(groups[dx_2][dy_2][2])) +
                            this.webgl.createBuffer(dx_2, dy_2, 3, new Uint8Array(groups[dx_2][dy_2][3]));
                    this.stats.groupsCount += 4;
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
                if (this.area.groups[dx][dy][1].length > 0) {
                    this.webgl.setBuffer(dx, dy, 0, 'a_position', 2, 0, 0);
                    this.webgl.setBuffer(dx, dy, 1, 'a_shape', 1, 0, 0);
                    this.webgl.setBuffer(dx, dy, 2, 'a_color', 1, 0, 0);
                    this.webgl.setBuffer(dx, dy, 3, 'a_size', 1, 0, 0);
                    this.webgl.drawPoints(0, this.area.groups[dx][dy][1].length);
                    //zz++
                    //console.log(`x=${this.camera.x}, y=${this.camera.y}, zoom=${this.camera.zoom}`)
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

let n = 10_000_000
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zdHlsZS5jc3MiLCJ3ZWJwYWNrOi8vLy4vc2hhZGVycy50cyIsIndlYnBhY2s6Ly8vLi9zcGxvdC1jb250cm9sLnRzIiwid2VicGFjazovLy8uL3NwbG90LWRlYnVnLnRzIiwid2VicGFjazovLy8uL3NwbG90LWRlbW8udHMiLCJ3ZWJwYWNrOi8vLy4vc3Bsb3QtZ2xzbC50cyIsIndlYnBhY2s6Ly8vLi9zcGxvdC13ZWJnbC50cyIsIndlYnBhY2s6Ly8vLi9zcGxvdC50cyIsIndlYnBhY2s6Ly8vLi91dGlscy50cyIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vLy4vaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7QUNBYSx1QkFBZSxHQUM1Qix1WEFlQztBQUVZLHlCQUFpQixHQUM5QiwrS0FTQztBQUVZLGNBQU0sR0FBYSxFQUFFO0FBRWxDLGlCQUFTLEdBQUksVUFBVTtJQUN2QixJQUNDO0FBRUQsaUJBQVMsR0FBSSxPQUFPO0lBQ3BCLHFEQUVDO0FBRUQsaUJBQVMsR0FBSSxRQUFRO0lBQ3JCLDBPQU1DO0FBRUQsaUJBQVMsR0FBSSxjQUFjO0lBQzNCLDJOQUlDO0FBRUQsaUJBQVMsR0FBSSxhQUFhO0lBQzFCLCtNQU9DOzs7Ozs7Ozs7Ozs7O0FDL0REOzs7O0dBSUc7QUFDSDtJQW1CRSwyREFBMkQ7SUFDM0QscUJBQ1csS0FBWTtRQUFaLFVBQUssR0FB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LENBQUMsTUFBTSxHQUFHLE1BQU07UUFFekIsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUU7UUFFdEIsc0RBQXNEO1FBQ3RELEtBQUssSUFBSSxJQUFFLEdBQUcsQ0FBQyxFQUFFLElBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFFLEVBQUUsRUFBRTtZQUMzQyxLQUFLLElBQUksSUFBRSxHQUFHLENBQUMsRUFBRSxJQUFFLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBRSxFQUFFLEVBQUU7Z0JBQzNDLElBQUksTUFBTSxDQUFDLElBQUUsQ0FBQyxDQUFDLElBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7b0JBQ2hDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUTt3QkFDakIsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsSUFBRSxFQUFFLElBQUUsRUFBRSxDQUFDLEVBQUUsSUFBSSxZQUFZLENBQUMsTUFBTSxDQUFDLElBQUUsQ0FBQyxDQUFDLElBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQ3ZFLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLElBQUUsRUFBRSxJQUFFLEVBQUUsQ0FBQyxFQUFFLElBQUksVUFBVSxDQUFDLE1BQU0sQ0FBQyxJQUFFLENBQUMsQ0FBQyxJQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUNyRSxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxJQUFFLEVBQUUsSUFBRSxFQUFFLENBQUMsRUFBRSxJQUFJLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBRSxDQUFDLENBQUMsSUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDckUsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsSUFBRSxFQUFFLElBQUUsRUFBRSxDQUFDLEVBQUUsSUFBSSxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUUsQ0FBQyxD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QTtXQUNBO1dBQ0EsZ0NBQWdDLFlBQVk7V0FDNUM7V0FDQSxFOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0Esd0NBQXdDLHlDQUF5QztXQUNqRjtXQUNBO1dBQ0EsRTs7Ozs7V0NQQSx3Rjs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSxzREFBc0Qsa0JBQWtCO1dBQ3hFO1dBQ0EsK0NBQStDLGNBQWM7V0FDN0QsRTs7Ozs7Ozs7Ozs7Ozs7QUNOMkI7QUFDWDs7QUFFaEI7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxHQUFHLDZDQUE2QztBQUNoRCxHQUFHLCtDQUErQztBQUNsRCxHQUFHLGlEQUFpRDtBQUNwRCxHQUFHLCtDQUErQztBQUNsRDs7QUFFQTs7QUFFQSxzQkFBc0IsK0NBQUs7O0FBRTNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQiLCJmaWxlIjoic2NyaXB0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiZXhwb3J0IGNvbnN0IFZFUlRFWF9URU1QTEFURSA9XG5gXG5wcmVjaXNpb24gbG93cCBmbG9hdDtcbmF0dHJpYnV0ZSBsb3dwIHZlYzIgYV9wb3NpdGlvbjtcbmF0dHJpYnV0ZSBmbG9hdCBhX2NvbG9yO1xuYXR0cmlidXRlIGZsb2F0IGFfc2l6ZTtcbmF0dHJpYnV0ZSBmbG9hdCBhX3NoYXBlO1xudW5pZm9ybSBsb3dwIG1hdDMgdV9tYXRyaXg7XG52YXJ5aW5nIGxvd3AgdmVjMyB2X2NvbG9yO1xudmFyeWluZyBmbG9hdCB2X3NoYXBlO1xudm9pZCBtYWluKCkge1xuICBnbF9Qb3NpdGlvbiA9IHZlYzQoKHVfbWF0cml4ICogdmVjMyhhX3Bvc2l0aW9uLCAxKSkueHksIDAuMCwgMS4wKTtcbiAgZ2xfUG9pbnRTaXplID0gYV9zaXplO1xuICB2X3NoYXBlID0gYV9zaGFwZTtcbiAge0NPTE9SLVNFTEVDVElPTn1cbn1cbmBcblxuZXhwb3J0IGNvbnN0IEZSQUdNRU5UX1RFTVBMQVRFID1cbmBcbnByZWNpc2lvbiBsb3dwIGZsb2F0O1xudmFyeWluZyB2ZWMzIHZfY29sb3I7XG52YXJ5aW5nIGZsb2F0IHZfc2hhcGU7XG57U0hBUEVTLUZVTkNUSU9OU31cbnZvaWQgbWFpbigpIHtcbiAge1NIQVBFLVNFTEVDVElPTn1cbiAgZ2xfRnJhZ0NvbG9yID0gdmVjNCh2X2NvbG9yLnJnYiwgMS4wKTtcbn1cbmBcblxuZXhwb3J0IGNvbnN0IFNIQVBFUzogc3RyaW5nW10gPSBbXVxuXG5TSEFQRVNbMF0gPSAgLy8g0JrQstCw0LTRgNCw0YJcbmBcbmBcblxuU0hBUEVTWzFdID0gIC8vINCa0YDRg9CzXG5gXG5pZiAobGVuZ3RoKGdsX1BvaW50Q29vcmQgLSAwLjUpID4gMC41KSBkaXNjYXJkO1xuYFxuXG5TSEFQRVNbMl0gPSAgLy8g0JrRgNC10YHRglxuYFxuaWYgKChhbGwobGVzc1RoYW4oZ2xfUG9pbnRDb29yZCwgdmVjMigwLjMpKSkpIHx8XG4gICgoZ2xfUG9pbnRDb29yZC54ID4gMC43KSAmJiAoZ2xfUG9pbnRDb29yZC55IDwgMC4zKSkgfHxcbiAgKGFsbChncmVhdGVyVGhhbihnbF9Qb2ludENvb3JkLCB2ZWMyKDAuNykpKSkgfHxcbiAgKChnbF9Qb2ludENvb3JkLnggPCAwLjMpICYmIChnbF9Qb2ludENvb3JkLnkgPiAwLjcpKVxuICApIGRpc2NhcmQ7XG5gXG5cblNIQVBFU1szXSA9ICAvLyDQotGA0LXRg9Cz0L7Qu9GM0L3QuNC6XG5gXG52ZWMyIHBvcyA9IHZlYzIoZ2xfUG9pbnRDb29yZC54LCBnbF9Qb2ludENvb3JkLnkgLSAwLjEpIC0gMC41O1xuZmxvYXQgYSA9IGF0YW4ocG9zLngsIHBvcy55KSArIDIuMDk0Mzk1MTAyMzk7XG5pZiAoc3RlcCgwLjI4NSwgY29zKGZsb29yKDAuNSArIGEgLyAyLjA5NDM5NTEwMjM5KSAqIDIuMDk0Mzk1MTAyMzkgLSBhKSAqIGxlbmd0aChwb3MpKSA+IDAuOSkgZGlzY2FyZDtcbmBcblxuU0hBUEVTWzRdID0gIC8vINCo0LXRgdGC0LXRgNC10L3QutCwXG5gXG52ZWMyIHBvcyA9IHZlYzIoMC41KSAtIGdsX1BvaW50Q29vcmQ7XG5mbG9hdCByID0gbGVuZ3RoKHBvcykgKiAxLjYyO1xuZmxvYXQgYSA9IGF0YW4ocG9zLnksIHBvcy54KTtcbmZsb2F0IGYgPSBjb3MoYSAqIDMuMCk7XG5mID0gc3RlcCgwLjAsIGNvcyhhICogMTAuMCkpICogMC4yICsgMC41O1xuaWYgKCBzdGVwKGYsIHIpID4gMC41ICkgZGlzY2FyZDtcbmBcbiIsImltcG9ydCBTUGxvdCBmcm9tICdAL3NwbG90J1xuXG4vKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICpcbiAqINCa0LvQsNGB0YEt0YXQtdC70L/QtdGALCDRgNC10LDQu9C40LfRg9GO0YnQuNC5INC+0LHRgNCw0LHQvtGC0LrRgyDRgdGA0LXQtNGB0YLQsiDQstCy0L7QtNCwICjQvNGL0YjQuCwg0YLRgNC10LrQv9Cw0LTQsCDQuCDRgi7Qvy4pINC4INC80LDRgtC10LzQsNGC0LjRh9C10YHQutC40LUg0YDQsNGB0YfQtdGC0Ysg0YLQtdGF0L3QuNGH0LXRgdC60LjRhSDQtNCw0L3QvdGL0YUsXG4gKiDRgdC+0L7RgtCy0LXRgtGB0LLRg9GO0YnQuNGFINGC0YDQsNC90YHRhNC+0YDQvNCw0YbQuNGP0Lwg0LPRgNCw0YTQuNC60LAg0LTQu9GPINC60LvQsNGB0YHQsCBTcGxvdC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU1Bsb3RDb250b2wgaW1wbGVtZW50cyBTUGxvdEhlbHBlciB7XG5cbiAgLyoqINCi0LXRhdC90LjRh9C10YHQutCw0Y8g0LjQvdGE0L7RgNC80LDRhtC40Y8sINC40YHQv9C+0LvRjNC30YPQtdC80LDRjyDQv9GA0LjQu9C+0LbQtdC90LjQtdC8INC00LvRjyDRgNCw0YHRh9C10YLQsCDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuS4gKi9cbiAgcHVibGljIHRyYW5zZm9ybTogU1Bsb3RUcmFuc2Zvcm0gPSB7XG4gICAgdmlld1Byb2plY3Rpb25NYXQ6IFtdLFxuICAgIHN0YXJ0SW52Vmlld1Byb2pNYXQ6IFtdLFxuICAgIHN0YXJ0Q2FtZXJhOiB7IHg6IDAsIHk6IDAsIHpvb206IDEgfSxcbiAgICBzdGFydFBvczogW10sXG4gIH1cblxuICAvKiog0J/RgNC40LfQvdCw0Log0YLQvtCz0L4sINGH0YLQviDRhdC10LvQv9C10YAg0YPQttC1INC90LDRgdGC0YDQvtC10L0uICovXG4gIHB1YmxpYyBpc1NldHVwZWQ6IGJvb2xlYW4gPSBmYWxzZVxuXG4gIC8qKiDQntCx0YDQsNCx0L7RgtGH0LjQutC4INGB0L7QsdGL0YLQuNC5INGBINC30LDQutGA0LXQv9C70LXQvdC90YvQvNC4INC60L7QvdGC0LXQutGB0YLQsNC80LguICovXG4gIHByb3RlY3RlZCBoYW5kbGVNb3VzZURvd25XaXRoQ29udGV4dDogRXZlbnRMaXN0ZW5lciA9IHRoaXMuaGFuZGxlTW91c2VEb3duLmJpbmQodGhpcykgYXMgRXZlbnRMaXN0ZW5lclxuICBwcm90ZWN0ZWQgaGFuZGxlTW91c2VXaGVlbFdpdGhDb250ZXh0OiBFdmVudExpc3RlbmVyID0gdGhpcy5oYW5kbGVNb3VzZVdoZWVsLmJpbmQodGhpcykgYXMgRXZlbnRMaXN0ZW5lclxuICBwcm90ZWN0ZWQgaGFuZGxlTW91c2VNb3ZlV2l0aENvbnRleHQ6IEV2ZW50TGlzdGVuZXIgPSB0aGlzLmhhbmRsZU1vdXNlTW92ZS5iaW5kKHRoaXMpIGFzIEV2ZW50TGlzdGVuZXJcbiAgcHJvdGVjdGVkIGhhbmRsZU1vdXNlVXBXaXRoQ29udGV4dDogRXZlbnRMaXN0ZW5lciA9IHRoaXMuaGFuZGxlTW91c2VVcC5iaW5kKHRoaXMpIGFzIEV2ZW50TGlzdGVuZXJcblxuICAvKiog0KXQtdC70L/QtdGAINCx0YPQtNC10YIg0LjQvNC10YLRjCDQv9C+0LvQvdGL0Lkg0LTQvtGB0YLRg9C/INC6INGN0LrQt9C10LzQv9C70Y/RgNGDIFNQbG90LiAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICByZWFkb25seSBzcGxvdDogU1Bsb3RcbiAgKSB7IH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQn9C+0LTQs9C+0YLQsNCy0LvQuNCy0LDQtdGCINGF0LXQu9C/0LXRgCDQuiDQuNGB0L/QvtC70YzQt9C+0LLQsNC90LjRji5cbiAgICovXG4gIHNldHVwKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5pc1NldHVwZWQpIHtcbiAgICAgIHRoaXMuaXNTZXR1cGVkID0gdHJ1ZVxuICAgIH1cbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCX0LDQv9GD0YHQutCw0LXRgiDQv9GA0L7RgdC70YPRiNC60YMg0YHQvtCx0YvRgtC40Lkg0LzRi9GI0LguXG4gICAqL1xuICBwdWJsaWMgcnVuKCk6IHZvaWQge1xuICAgIHRoaXMuc3Bsb3QuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMuaGFuZGxlTW91c2VEb3duV2l0aENvbnRleHQpXG4gICAgdGhpcy5zcGxvdC5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignd2hlZWwnLCB0aGlzLmhhbmRsZU1vdXNlV2hlZWxXaXRoQ29udGV4dClcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCe0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdGCINC/0YDQvtGB0LvRg9GI0LrRgyDRgdC+0LHRi9GC0LjQuSDQvNGL0YjQuC5cbiAgICovXG4gIHB1YmxpYyBzdG9wKCk6IHZvaWQge1xuICAgIHRoaXMuc3Bsb3QuY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMuaGFuZGxlTW91c2VEb3duV2l0aENvbnRleHQpXG4gICAgdGhpcy5zcGxvdC5jYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcignd2hlZWwnLCB0aGlzLmhhbmRsZU1vdXNlV2hlZWxXaXRoQ29udGV4dClcbiAgICB0aGlzLnNwbG90LmNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLmhhbmRsZU1vdXNlTW92ZVdpdGhDb250ZXh0KVxuICAgIHRoaXMuc3Bsb3QuY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLmhhbmRsZU1vdXNlVXBXaXRoQ29udGV4dClcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCe0LHQvdC+0LLQu9GP0LXRgiDQvNCw0YLRgNC40YbRgyDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuC5cbiAgICovXG4gIHB1YmxpYyB1cGRhdGVWaWV3UHJvamVjdGlvbigpOiB2b2lkIHtcblxuICAgIGNvbnN0IGNhbnZhcyA9IHRoaXMuc3Bsb3QuY2FudmFzXG4gICAgY29uc3QgY2FtZXJhID0gdGhpcy5zcGxvdC5jYW1lcmFcblxuICAgIGNvbnN0IGQwID0gY2FtZXJhLnpvb20hXG4gICAgY29uc3QgZDEgPSAyIC8gY2FudmFzLndpZHRoICogZDBcbiAgICBjb25zdCBkMiA9IDIgLyBjYW52YXMuaGVpZ2h0ICogZDBcblxuICAgIHRoaXMudHJhbnNmb3JtLnZpZXdQcm9qZWN0aW9uTWF0ID0gWyBkMSwgMCwgMCwgMCwgLWQyLCAwLCAtZDEgKiBjYW1lcmEueCEgLSAxLCBkMiAqIGNhbWVyYS55ISwgMSBdXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQn9GA0LXQvtCx0YDQsNC30YPQtdGCINC60L7QvtGA0LTQuNC90LDRgtGLINC80YvRiNC4INCyIEdMLdC60L7QvtGA0LTQuNC90LDRgtGLLlxuICAgKi9cbiAgcHJvdGVjdGVkIGdldENsaXBTcGFjZU1vdXNlUG9zaXRpb24oZXZlbnQ6IE1vdXNlRXZlbnQpOiBudW1iZXJbXSB7XG5cbiAgICBjb25zdCBjYW52YXMgPSB0aGlzLnNwbG90LmNhbnZhc1xuXG4gICAgY29uc3QgcmVjdCA9IGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuXG4gICAgY29uc3QgY2xpcFggPSAgMiAqICgoZXZlbnQuY2xpZW50WCAtIHJlY3QubGVmdCkgLyBjYW52YXMuY2xpZW50V2lkdGgpIC0gMVxuICAgIGNvbnN0IGNsaXBZID0gLTIgKiAoKGV2ZW50LmNsaWVudFkgLSByZWN0LnRvcCkgLyBjYW52YXMuY2xpZW50SGVpZ2h0KSArIDFcblxuICAgIHJldHVybiBbY2xpcFgsIGNsaXBZXVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0KDQtdCw0LPQuNGA0YPQtdGCINC90LAg0LTQstC40LbQtdC90LjQtSDQvNGL0YjQuCDQsiDQvNC+0LzQtdC90YIsINC60L7Qs9C00LAg0LXQtSDQutC70LDQstC40YjQsCDRg9C00LXRgNC20LjQstCw0LXRgtGB0Y8g0L3QsNC20LDRgtC+0LkuINCc0LXRgtC+0LQg0L/QtdGA0LXQvNC10YnQsNC10YIg0L7QsdC70LDRgdGC0Ywg0LLQuNC00LjQvNC+0YHRgtC4INC90LBcbiAgICog0L/Qu9C+0YHQutC+0YHRgtC4INCy0LzQtdGB0YLQtSDRgSDQtNCy0LjQttC10L3QuNC10Lwg0LzRi9GI0LguXG4gICAqL1xuICBwcm90ZWN0ZWQgaGFuZGxlTW91c2VNb3ZlKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG5cbiAgICBjb25zdCBzcGxvdCA9IHRoaXMuc3Bsb3RcbiAgICBjb25zdCB0cmFuc2Zvcm0gPSB0aGlzLnRyYW5zZm9ybVxuICAgIGNvbnN0IG1hdHJpeCA9IHRyYW5zZm9ybS5zdGFydEludlZpZXdQcm9qTWF0XG4gICAgY29uc3QgW2NsaXBYLCBjbGlwWV0gPSB0aGlzLmdldENsaXBTcGFjZU1vdXNlUG9zaXRpb24oZXZlbnQpXG5cbiAgICBzcGxvdC5jYW1lcmEueCA9IHRyYW5zZm9ybS5zdGFydENhbWVyYS54ISArIHRyYW5zZm9ybS5zdGFydFBvc1swXSAtIGNsaXBYICogbWF0cml4WzBdIC0gbWF0cml4WzZdXG4gICAgc3Bsb3QuY2FtZXJhLnkgPSB0cmFuc2Zvcm0uc3RhcnRDYW1lcmEueSEgKyB0cmFuc2Zvcm0uc3RhcnRQb3NbMV0gLSBjbGlwWSAqIG1hdHJpeFs0XSAtIG1hdHJpeFs3XVxuXG4gICAgc3Bsb3QucmVuZGVyKClcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCg0LXQsNCz0LjRgNGD0LXRgiDQvdCwINC+0YLQttCw0YLQuNC1INC60LvQsNCy0LjRiNC4INC80YvRiNC4LiDQkiDQvNC+0LzQtdC90YIg0L7RgtC20LDRgtC40Y8g0LrQu9Cw0LLQuNGI0Lgg0LDQvdCw0LvQuNC3INC00LLQuNC20LXQvdC40Y8g0LzRi9GI0Lgg0YEg0LfQsNC20LDRgtC+0Lkg0LrQu9Cw0LLQuNGI0LXQuSDQv9GA0LXQutGA0LDRidCw0LXRgtGB0Y8uXG4gICAqL1xuICBwcm90ZWN0ZWQgaGFuZGxlTW91c2VVcChldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuXG4gICAgdGhpcy5zcGxvdC5yZW5kZXIoKVxuXG4gICAgZXZlbnQudGFyZ2V0IS5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLmhhbmRsZU1vdXNlTW92ZVdpdGhDb250ZXh0KVxuICAgIGV2ZW50LnRhcmdldCEucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuaGFuZGxlTW91c2VVcFdpdGhDb250ZXh0KVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0KDQtdCw0LPQuNGA0YPQtdGCINC90LAg0L3QsNC20LDRgtC40LUg0LrQu9Cw0LLQuNGI0Lgg0LzRi9GI0LguINCSINC80L7QvNC10L3RgiDQvdCw0LbQsNGC0LjRjyDQuCDRg9C00LXRgNC20LDQvdC40Y8g0LrQu9Cw0LLQuNGI0Lgg0LfQsNC/0YPRgdC60LDQtdGC0YHRjyDQsNC90LDQu9C40Lcg0LTQstC40LbQtdC90LjRjyDQvNGL0YjQuCAo0YEg0LfQsNC20LDRgtC+0LlcbiAgICog0LrQu9Cw0LLQuNGI0LXQuSkuXG4gICAqL1xuICBwcm90ZWN0ZWQgaGFuZGxlTW91c2VEb3duKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG5cbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgICBjb25zdCBzcGxvdCA9IHRoaXMuc3Bsb3RcbiAgICBjb25zdCB0cmFuc2Zvcm0gPSB0aGlzLnRyYW5zZm9ybVxuXG4gICAgc3Bsb3QuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMuaGFuZGxlTW91c2VNb3ZlV2l0aENvbnRleHQpXG4gICAgc3Bsb3QuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLmhhbmRsZU1vdXNlVXBXaXRoQ29udGV4dClcblxuICAgIGxldCBtYXRyaXggPSB0cmFuc2Zvcm0udmlld1Byb2plY3Rpb25NYXRcbiAgICB0cmFuc2Zvcm0uc3RhcnRJbnZWaWV3UHJvak1hdCA9IFsxIC8gbWF0cml4WzBdLCAwLCAwLCAwLCAxIC8gbWF0cml4WzRdLCAwLCAtbWF0cml4WzZdIC8gbWF0cml4WzBdLCAtbWF0cml4WzddIC8gbWF0cml4WzRdLCAxXVxuXG4gICAgdHJhbnNmb3JtLnN0YXJ0Q2FtZXJhID0geyB4OiBzcGxvdC5jYW1lcmEueCwgeTogc3Bsb3QuY2FtZXJhLnksIHpvb206IHNwbG90LmNhbWVyYS56b29tIH1cblxuICAgIGNvbnN0IFtjbGlwWCwgY2xpcFldID0gdGhpcy5nZXRDbGlwU3BhY2VNb3VzZVBvc2l0aW9uKGV2ZW50KVxuICAgIG1hdHJpeCA9IHRyYW5zZm9ybS5zdGFydEludlZpZXdQcm9qTWF0XG4gICAgdHJhbnNmb3JtLnN0YXJ0UG9zWzBdID0gY2xpcFggKiBtYXRyaXhbMF0gKyBtYXRyaXhbNl1cbiAgICB0cmFuc2Zvcm0uc3RhcnRQb3NbMV0gPSBjbGlwWSAqIG1hdHJpeFs0XSArIG1hdHJpeFs3XVxuXG4gICAgc3Bsb3QucmVuZGVyKClcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCg0LXQsNCz0LjRgNGD0LXRgiDQvdCwINC30YPQvNC40YDQvtCy0LDQvdC40LUg0LzRi9GI0LguINCSINC80L7QvNC10L3RgiDQt9GD0LzQuNGA0L7QstCw0L3QuNGPINC80YvRiNC4INC/0YDQvtC40YHRhdC+0LTQuNGCINC30YPQvNC40YDQvtCy0LDQvdC40LUg0LrQvtC+0YDQtNC40L3QsNGC0L3QvtC5INC/0LvQvtGB0LrQvtGB0YLQuC5cbiAgICovXG4gIHByb3RlY3RlZCBoYW5kbGVNb3VzZVdoZWVsKGV2ZW50OiBXaGVlbEV2ZW50KTogdm9pZCB7XG5cbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgICBjb25zdCBjYW1lcmEgPSB0aGlzLnNwbG90LmNhbWVyYVxuXG4gICAgLyoqINCS0YvRh9C40YHQu9C10L3QuNC1INC/0L7Qt9C40YbQuNC4INC80YvRiNC4INCyIEdMLdC60L7QvtGA0LTQuNC90LDRgtCw0YUuICovXG4gICAgY29uc3QgW2NsaXBYLCBjbGlwWV0gPSB0aGlzLmdldENsaXBTcGFjZU1vdXNlUG9zaXRpb24oZXZlbnQpXG5cbiAgICAvKiog0J/QvtC30LjRhtC40Y8g0LzRi9GI0Lgg0LTQviDQt9GD0LzQuNGA0L7QstCw0L3QuNGPLiAqL1xuICAgIGxldCBtYXRyaXggPSB0aGlzLnRyYW5zZm9ybS52aWV3UHJvamVjdGlvbk1hdFxuICAgIGNvbnN0IHByZVpvb21YID0gKGNsaXBYIC0gbWF0cml4WzZdKSAvIG1hdHJpeFswXVxuICAgIGNvbnN0IHByZVpvb21ZID0gKGNsaXBZICAtIG1hdHJpeFs3XSkgLyBtYXRyaXhbNF1cblxuICAgIC8qKiDQndC+0LLQvtC1INC30L3QsNGH0LXQvdC40LUg0LfRg9C80LAg0L7QsdC70LDRgdGC0Lgg0L/RgNC+0YHQvNC+0YLRgNCwINGN0LrRgdC/0L7QvdC10L3RhtC40LDQu9GM0L3QviDQt9Cw0LLQuNGB0LjRgiDQvtGCINCy0LXQu9C40YfQuNC90Ysg0LfRg9C80LjRgNC+0LLQsNC90LjRjyDQvNGL0YjQuC4gKi9cbiAgICBjb25zdCBuZXdab29tID0gY2FtZXJhLnpvb20hICogTWF0aC5wb3coMiwgZXZlbnQuZGVsdGFZICogLTAuMDEpXG5cbiAgICAvKiog0JzQsNC60YHQuNC80LDQu9GM0L3QvtC1INC4INC80LjQvdC40LzQsNC70YzQvdC+0LUg0LfQvdCw0YfQtdC90LjRjyDQt9GD0LzQsCDQvtCx0LvQsNGB0YLQuCDQv9GA0L7RgdC80L7RgtGA0LAuICovXG4gICAgY2FtZXJhLnpvb20gPSBNYXRoLm1heChjYW1lcmEubWluWm9vbSEsIE1hdGgubWluKGNhbWVyYS5tYXhab29tISwgbmV3Wm9vbSkpXG5cbiAgICAvKiog0J7QsdC90L7QstC70LXQvdC40LUg0LzQsNGC0YDQuNGG0Ysg0YLRgNCw0L3RgdGE0L7RgNC80LDRhtC40LguICovXG4gICAgdGhpcy51cGRhdGVWaWV3UHJvamVjdGlvbigpXG5cbiAgICAvKiog0J/QvtC30LjRhtC40Y8g0LzRi9GI0Lgg0L/QvtGB0LvQtSDQt9GD0LzQuNGA0L7QstCw0L3QuNGPLiAqL1xuICAgIG1hdHJpeCA9IHRoaXMudHJhbnNmb3JtLnZpZXdQcm9qZWN0aW9uTWF0XG4gICAgY29uc3QgcG9zdFpvb21YID0gKGNsaXBYIC0gbWF0cml4WzZdKSAvIG1hdHJpeFswXVxuICAgIGNvbnN0IHBvc3Rab29tWSA9IChjbGlwWSAtIG1hdHJpeFs3XSkgLyBtYXRyaXhbNF1cblxuICAgIC8qKiDQktGL0YfQuNGB0LvQtdC90LjQtSDQvdC+0LLQvtCz0L4g0L/QvtC70L7QttC10L3QuNGPINC+0LHQu9Cw0YHRgtC4INC/0YDQvtGB0LzQvtGC0YDQsCDQv9C+0YHQu9C1INC30YPQvNC40YDQvtCy0LDQvdC40Y8uICovXG4gICAgY2FtZXJhLnghICs9IHByZVpvb21YIC0gcG9zdFpvb21YXG4gICAgY2FtZXJhLnkhICs9IHByZVpvb21ZIC0gcG9zdFpvb21ZXG5cbiAgICB0aGlzLnNwbG90LnJlbmRlcigpXG4gIH1cbn1cbiIsImltcG9ydCBTUGxvdCBmcm9tICdAL3NwbG90J1xuaW1wb3J0IHsgZ2V0Q3VycmVudFRpbWUgfSBmcm9tICdAL3V0aWxzJ1xuXG4vKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICpcbiAqINCa0LvQsNGB0YEt0YXQtdC70L/QtdGALCDRgNC10LDQu9C40LfRg9GO0YnQuNC5INC/0L7QtNC00LXRgNC20LrRgyDRgNC10LbQuNC80LAg0L7RgtC70LDQtNC60Lgg0LTQu9GPINC60LvQsNGB0YHQsCBTUGxvdC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU1Bsb3REZWJ1ZyBpbXBsZW1lbnRzIFNQbG90SGVscGVyIHtcblxuICAvKiog0J/RgNC40LfQvdCw0Log0LDQutGC0LjQstCw0YbQuNC4INGA0LXQttC40Lwg0L7RgtC70LDQtNC60LguICovXG4gIHB1YmxpYyBpc0VuYWJsZTogYm9vbGVhbiA9IGZhbHNlXG5cbiAgLyoqINCh0YLQuNC70Ywg0LfQsNCz0L7Qu9C+0LLQutCwINGA0LXQttC40LzQsCDQvtGC0LvQsNC00LrQuC4gKi9cbiAgcHVibGljIGhlYWRlclN0eWxlOiBzdHJpbmcgPSAnZm9udC13ZWlnaHQ6IGJvbGQ7IGNvbG9yOiAjZmZmZmZmOyBiYWNrZ3JvdW5kLWNvbG9yOiAjY2MwMDAwOydcblxuICAvKiog0KHRgtC40LvRjCDQt9Cw0LPQvtC70L7QstC60LAg0LPRgNGD0L/Qv9GLINC/0LDRgNCw0LzQtdGC0YDQvtCyLiAqL1xuICBwdWJsaWMgZ3JvdXBTdHlsZTogc3RyaW5nID0gJ2ZvbnQtd2VpZ2h0OiBib2xkOyBjb2xvcjogI2ZmZmZmZjsnXG5cbiAgLyoqINCf0YDQuNC30L3QsNC6INGC0L7Qs9C+LCDRh9GC0L4g0YXQtdC70L/QtdGAINGD0LbQtSDQvdCw0YHRgtGA0L7QtdC9LiAqL1xuICBwdWJsaWMgaXNTZXR1cGVkOiBib29sZWFuID0gZmFsc2VcblxuICAvKiog0KXQtdC70L/QtdGAINCx0YPQtNC10YIg0LjQvNC10YLRjCDQv9C+0LvQvdGL0Lkg0LTQvtGB0YLRg9C/INC6INGN0LrQt9C10LzQv9C70Y/RgNGDIFNQbG90LiAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICByZWFkb25seSBzcGxvdDogU1Bsb3RcbiAgKSB7fVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCf0L7QtNCz0L7RgtCw0LLQu9C40LLQsNC10YIg0YXQtdC70L/QtdGAINC6INC40YHQv9C+0LvRjNC30L7QstCw0L3QuNGOLlxuICAgKi9cbiAgcHVibGljIHNldHVwKGNsZWFyQ29uc29sZTogYm9vbGVhbiA9IGZhbHNlKTogdm9pZCB7XG5cbiAgICBpZiAoIXRoaXMuaXNTZXR1cGVkKSB7XG5cbiAgICAgIGlmIChjbGVhckNvbnNvbGUpIHtcbiAgICAgICAgY29uc29sZS5jbGVhcigpXG4gICAgICB9XG5cbiAgICAgIHRoaXMuaXNTZXR1cGVkID0gdHJ1ZVxuICAgIH1cbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCS0YvQstC+0LTQuNGCINCyINC60L7QvdGB0L7Qu9GMINC+0YLQu9Cw0LTQvtGH0L3Rg9GOINC40L3RhNC+0YDQvNCw0YbQuNGOLCDQtdGB0LvQuCDQstC60LvRjtGH0LXQvSDRgNC10LbQuNC8INC+0YLQu9Cw0LTQutC4LlxuICAgKlxuICAgKiBAcmVtYXJrc1xuICAgKiDQntGC0LvQsNC00L7Rh9C90LDRjyDQuNC90YTQvtGA0LzQsNGG0LjRjyDQstGL0LLQvtC00LjRgtGB0Y8g0LHQu9C+0LrQsNC80LguINCd0LDQt9Cy0LDQvdC40Y8g0LHQu9C+0LrQvtCyINC/0LXRgNC10LTQsNGO0YLRgdGPINCyINC80LXRgtC+0LQg0L/QtdGA0LXRh9C40YHQu9C10L3QuNC10Lwg0YHRgtGA0L7Qui4g0JrQsNC20LTQsNGPINGB0YLRgNC+0LrQsFxuICAgKiDQuNC90YLQtdGA0L/RgNC10YLQuNGA0YPQtdGC0YHRjyDQutCw0Log0LjQvNGPINC80LXRgtC+0LTQsC4g0JXRgdC70Lgg0L3Rg9C20L3Ri9C1INC80LXRgtC+0LTRiyDQstGL0LLQvtC00LAg0LHQu9C+0LrQsCDRgdGD0YnQtdGB0YLQstGD0Y7RgiAtINC+0L3QuCDQstGL0LfRi9Cy0LDRjtGC0YHRjy4g0JXRgdC70Lgg0LzQtdGC0L7QtNCwINGBINC90YPQttC90YvQvFxuICAgKiDQvdCw0LfQstCw0L3QuNC10Lwg0L3QtSDRgdGD0YnQtdGB0YLQstGD0LXRgiAtINCz0LXQvdC10YDQuNGA0YPQtdGC0YHRjyDQvtGI0LjQsdC60LAuXG4gICAqXG4gICAqIEBwYXJhbSBsb2dJdGVtcyAtINCf0LXRgNC10YfQuNGB0LvQtdC90LjQtSDRgdGC0YDQvtC6INGBINC90LDQt9Cy0LDQvdC40Y/QvNC4INC+0YLQu9Cw0LTQvtGH0L3Ri9GFINCx0LvQvtC60L7Qsiwg0LrQvtGC0L7RgNGL0LUg0L3Rg9C20L3QviDQvtGC0L7QsdGA0LDQt9C40YLRjCDQsiDQutC+0L3RgdC+0LvQuC5cbiAgICovXG4gIHB1YmxpYyBsb2coLi4ubG9nSXRlbXM6IHN0cmluZ1tdKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuaXNFbmFibGUpIHtcbiAgICAgIGxvZ0l0ZW1zLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgIGlmICh0eXBlb2YgKHRoaXMgYXMgYW55KVtpdGVtXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICh0aGlzIGFzIGFueSlbaXRlbV0oKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcign0J7RgtC70LDQtNC+0YfQvdC+0LPQviDQsdC70L7QutCwICcgKyBpdGVtICsgJ1wiINC90LUg0YHRg9GJ0LXRgdGC0LLRg9C10YIhJylcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQktGL0LLQvtC00LjRgiDRgdC+0L7QsdGJ0LXQvdC40LUg0L7QsSDQvtGI0LjQsdC60LUuXG4gICAqL1xuICBwdWJsaWMgZXJyb3IobWVzc2FnZTogc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuaXNFbmFibGUpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IobWVzc2FnZSlcbiAgICB9XG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQktGL0LLQvtC00LjRgiDQstGB0YLRg9C/0LjRgtC10LvRjNC90YPRjiDRh9Cw0YHRgtGMINC+INGA0LXQttC40LzQtSDQvtGC0LvQsNC00LrQuC5cbiAgICovXG4gIHB1YmxpYyBpbnRybygpOiB2b2lkIHtcbiAgICBjb25zb2xlLmxvZygnJWPQntGC0LvQsNC00LrQsCBTUGxvdCDQvdCwINC+0LHRitC10LrRgtC1ICMnICsgdGhpcy5zcGxvdC5jYW52YXMuaWQsIHRoaXMuaGVhZGVyU3R5bGUpXG5cbiAgICBpZiAodGhpcy5zcGxvdC5kZW1vLmlzRW5hYmxlKSB7XG4gICAgICBjb25zb2xlLmxvZygnJWPQktC60LvRjtGH0LXQvSDQtNC10LzQvtC90YHRgtGA0LDRhtC40L7QvdC90YvQuSDRgNC10LbQuNC8INC00LDQvdC90YvRhScsIHRoaXMuZ3JvdXBTdHlsZSlcbiAgICB9XG5cbiAgICBjb25zb2xlLmdyb3VwKCclY9Cf0YDQtdC00YPQv9GA0LXQttC00LXQvdC40LUnLCB0aGlzLmdyb3VwU3R5bGUpXG4gICAgY29uc29sZS5sb2coJ9Ce0YLQutGA0YvRgtCw0Y8g0LrQvtC90YHQvtC70Ywg0LHRgNCw0YPQt9C10YDQsCDQuCDQtNGA0YPQs9C40LUg0LDQutGC0LjQstC90YvQtSDRgdGA0LXQtNGB0YLQstCwINC60L7QvdGC0YDQvtC70Y8g0YDQsNC30YDQsNCx0L7RgtC60Lgg0YHRg9GJ0LXRgdGC0LLQtdC90L3QviDRgdC90LjQttCw0Y7RgiDQv9GA0L7QuNC30LLQvtC00LjRgtC10LvRjNC90L7RgdGC0Ywg0LLRi9GB0L7QutC+0L3QsNCz0YDRg9C20LXQvdC90YvRhSDQv9GA0LjQu9C+0LbQtdC90LjQuS4g0JTQu9GPINC+0LHRitC10LrRgtC40LLQvdC+0LPQviDQsNC90LDQu9C40LfQsCDQv9GA0L7QuNC30LLQvtC00LjRgtC10LvRjNC90L7RgdGC0Lgg0LLRgdC1INC/0L7QtNC+0LHQvdGL0LUg0YHRgNC10LTRgdGC0LLQsCDQtNC+0LvQttC90Ysg0LHRi9GC0Ywg0L7RgtC60LvRjtGH0LXQvdGLLCDQsCDQutC+0L3RgdC+0LvRjCDQsdGAetCw0YPQt9C10YDQsCDQt9Cw0LrRgNGL0YLQsC4g0J3QtdC60L7RgtC+0YDRi9C1INC00LDQvdC90YvQtSDQvtGC0LvQsNC00L7Rh9C90L7QuSDQuNC90YTQvtGA0LzQsNGG0LjQuCDQsiDQt9Cw0LLQuNGB0LjQvNC+0YHRgtC4INC+0YIg0LjRgdC/0L7Qu9GM0LfRg9C10LzQvtCz0L4g0LHRgNCw0YPQt9C10YDQsCDQvNC+0LPRg9GCINC90LUg0L7RgtC+0LHRgNCw0LbQsNGC0YzRgdGPINC40LvQuCDQvtGC0L7QsdGA0LDQttCw0YLRjNGB0Y8g0L3QtdC60L7RgNGA0LXQutGC0L3Qvi4g0KHRgNC10LTRgdGC0LLQviDQvtGC0LvQsNC00LrQuCDQv9GA0L7RgtC10YHRgtC40YDQvtCy0LDQvdC+INCyINCx0YDQsNGD0LfQtdGA0LUgR29vZ2xlIENocm9tZSB2LjkwJylcbiAgICBjb25zb2xlLmdyb3VwRW5kKClcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCS0YvQstC+0LTQuNGCINC40L3RhNC+0YDQvNCw0YbQuNGOINC+INCz0YDQsNGE0LjRh9C10YHQutC+0Lkg0YHQuNGB0YLQtdC80LUg0LrQu9C40LXQvdGC0LAuXG4gICAqL1xuICBwdWJsaWMgZ3B1KCk6IHZvaWQge1xuICAgIGNvbnNvbGUuZ3JvdXAoJyVj0JLQuNC00LXQvtGB0LjRgdGC0LXQvNCwJywgdGhpcy5ncm91cFN0eWxlKVxuICAgIGNvbnNvbGUubG9nKCfQk9GA0LDRhNC40YfQtdGB0LrQsNGPINC60LDRgNGC0LA6ICcgKyB0aGlzLnNwbG90LndlYmdsLmdwdS5oYXJkd2FyZSlcbiAgICBjb25zb2xlLmxvZygn0JLQtdGA0YHQuNGPIEdMOiAnICsgdGhpcy5zcGxvdC53ZWJnbC5ncHUuc29mdHdhcmUpXG4gICAgY29uc29sZS5ncm91cEVuZCgpXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQktGL0LLQvtC00LjRgiDQuNC90YTQvtGA0LzQsNGG0LjRjyDQviDRgtC10LrRg9GJ0LXQvCDRjdC60LfQtdC80L/Qu9GP0YDQtSDQutC70LDRgdGB0LAgU1Bsb3QuXG4gICAqL1xuICBwdWJsaWMgaW5zdGFuY2UoKTogdm9pZCB7XG5cbiAgICBjb25zb2xlLmdyb3VwKCclY9Cd0LDRgdGC0YDQvtC50LrQsCDQv9Cw0YDQsNC80LXRgtGA0L7QsiDRjdC60LfQtdC80L/Qu9GP0YDQsCcsIHRoaXMuZ3JvdXBTdHlsZSlcbiAgICBjb25zb2xlLmRpcih0aGlzLnNwbG90KVxuICAgIGNvbnNvbGUubG9nKCfQoNCw0LfQvNC10YAg0LrQsNC90LLQsNGB0LA6ICcgKyB0aGlzLnNwbG90LmNhbnZhcy53aWR0aCArICcgeCAnICsgdGhpcy5zcGxvdC5jYW52YXMuaGVpZ2h0ICsgJyBweCcpXG5cbiAgICBpZiAodGhpcy5zcGxvdC5kZW1vLmlzRW5hYmxlKSB7XG4gICAgICBjb25zb2xlLmxvZygn0KHQv9C+0YHQvtCxINC/0L7Qu9GD0YfQtdC90LjRjyDQtNCw0L3QvdGL0YU6ICcgKyAn0LTQtdC80L4t0LTQsNC90L3Ri9C1JylcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ9Ch0L/QvtGB0L7QsSDQv9C+0LvRg9GH0LXQvdC40Y8g0LTQsNC90L3Ri9GFOiAnICsgJ9C40YLQtdGA0LjRgNC+0LLQsNC90LjQtScpXG4gICAgfVxuICAgIGNvbnNvbGUuZ3JvdXBFbmQoKVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JLRi9Cy0L7QtNC40YIg0LrQvtC00Ysg0YjQtdC50LTQtdGA0L7Qsi5cbiAgICovXG4gIHB1YmxpYyBzaGFkZXJzKCk6IHZvaWQge1xuICAgIGNvbnNvbGUuZ3JvdXAoJyVj0KHQvtC30LTQsNC9INCy0LXRgNGI0LjQvdC90YvQuSDRiNC10LnQtNC10YA6ICcsIHRoaXMuZ3JvdXBTdHlsZSlcbiAgICBjb25zb2xlLmxvZyh0aGlzLnNwbG90Lmdsc2wudmVydFNoYWRlclNvdXJjZSlcbiAgICBjb25zb2xlLmdyb3VwRW5kKClcbiAgICBjb25zb2xlLmdyb3VwKCclY9Ch0L7Qt9C00LDQvSDRhNGA0LDQs9C80LXQvdGC0L3Ri9C5INGI0LXQudC00LXRgDogJywgdGhpcy5ncm91cFN0eWxlKVxuICAgIGNvbnNvbGUubG9nKHRoaXMuc3Bsb3QuZ2xzbC5mcmFnU2hhZGVyU291cmNlKVxuICAgIGNvbnNvbGUuZ3JvdXBFbmQoKVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JLRi9Cy0L7QtNC40YIg0YHQvtC+0LHRidC10L3QuNC1INC+INC90LDRh9Cw0LvQtSDQv9GA0L7RhtC10YHRgdC1INC30LDQs9GA0YPQt9C60Lgg0LTQsNC90L3Ri9GFLlxuICAgKi9cbiAgcHVibGljIGxvYWRpbmcoKTogdm9pZCB7XG4gICAgY29uc29sZS5sb2coJyVj0JfQsNC/0YPRidC10L0g0L/RgNC+0YbQtdGB0YEg0LfQsNCz0YDRg9C30LrQuCDQtNCw0L3QvdGL0YUgWycgKyBnZXRDdXJyZW50VGltZSgpICsgJ10uLi4nLCB0aGlzLmdyb3VwU3R5bGUpXG4gICAgY29uc29sZS50aW1lKCfQlNC70LjRgtC10LvRjNC90L7RgdGC0YwnKVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JLRi9Cy0L7QtNC40YIg0YHRgtCw0YLQuNGB0YLQuNC60YMg0L/QviDQt9Cw0LLQtdGA0YjQtdC90LjQuCDQv9GA0L7RhtC10YHRgdCwINC30LDQs9GA0YPQt9C60Lgg0LTQsNC90L3Ri9GFLlxuICAgKi9cbiAgcHVibGljIGxvYWRlZCgpOiB2b2lkIHtcbiAgICBjb25zb2xlLmdyb3VwKCclY9CX0LDQs9GA0YPQt9C60LAg0LTQsNC90L3Ri9GFINC30LDQstC10YDRiNC10L3QsCBbJyArIGdldEN1cnJlbnRUaW1lKCkgKyAnXScsIHRoaXMuZ3JvdXBTdHlsZSlcbiAgICBjb25zb2xlLnRpbWVFbmQoJ9CU0LvQuNGC0LXQu9GM0L3QvtGB0YLRjCcpXG4gICAgY29uc29sZS5sb2coJ9Cg0LXQt9GD0LvRjNGC0LDRgjogJyArICgodGhpcy5zcGxvdC5zdGF0cy5vYmpUb3RhbENvdW50ID49IHRoaXMuc3Bsb3QuZ2xvYmFsTGltaXQpID9cbiAgICAgICfQtNC+0YHRgtC40LPQvdGD0YIg0LvQuNC80LjRgiDQvtCx0YrQtdC60YLQvtCyICgnICsgdGhpcy5zcGxvdC5nbG9iYWxMaW1pdC50b0xvY2FsZVN0cmluZygpICsgJyknIDpcbiAgICAgICfQvtCx0YDQsNCx0L7RgtCw0L3RiyDQstGB0LUg0L7QsdGK0LXQutGC0YsnKSlcbiAgICBjb25zb2xlLmxvZygn0KDQsNGB0YXQvtC0INCy0LjQtNC10L7Qv9Cw0LzRj9GC0Lg6ICcgKyAodGhpcy5zcGxvdC5zdGF0cy5tZW1Vc2FnZSAvIDEwMDAwMDApLnRvRml4ZWQoMikudG9Mb2NhbGVTdHJpbmcoKSArICcg0JzQkScpXG4gICAgY29uc29sZS5sb2coJ9Ca0L7Quy3QstC+INC+0LHRitC10LrRgtC+0LI6ICcgKyB0aGlzLnNwbG90LnN0YXRzLm9ialRvdGFsQ291bnQudG9Mb2NhbGVTdHJpbmcoKSlcbiAgICBjb25zb2xlLmxvZygn0KHQvtC30LTQsNC90L4g0LLQuNC00LXQvtCx0YPRhNC10YDQvtCyOiAnICsgdGhpcy5zcGxvdC5zdGF0cy5ncm91cHNDb3VudC50b0xvY2FsZVN0cmluZygpKVxuICAgIGNvbnNvbGUubG9nKGDQk9GA0YPQv9C/0LjRgNC+0LLQutCwINCy0LjQtNC10L7QsdGD0YTQtdGA0L7QsjogJHt0aGlzLnNwbG90LmFyZWEuY291bnR9IHggJHt0aGlzLnNwbG90LmFyZWEuY291bnR9YClcbiAgICBjb25zb2xlLmxvZyhg0KjQsNCzINC00LXQu9C10L3QuNGPINC90LAg0LPRgNGD0L/Qv9GLOiAke3RoaXMuc3Bsb3QuYXJlYS5zdGVwfWApXG4gICAgY29uc29sZS5sb2coJ9Cg0LDQt9C80LXRgNGLINC+0LHRitC10LrRgtC+0LI6IG1pbiA9ICcgKyB0aGlzLnNwbG90LnN0YXRzLm1pbk9iamVjdFNpemUgKyAnOyBtYXggPSAnICsgdGhpcy5zcGxvdC5zdGF0cy5tYXhPYmplY3RTaXplKVxuICAgIGNvbnNvbGUuZ3JvdXBFbmQoKVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JLRi9Cy0L7QtNC40YIg0YHQvtC+0LHRidC10L3QuNC1INC+INC30LDQv9GD0YHQutC1INGA0LXQvdC00LXRgNCwLlxuICAgKi9cbiAgcHVibGljIHN0YXJ0ZWQoKTogdm9pZCB7XG4gICAgY29uc29sZS5sb2coJyVj0KDQtdC90LTQtdGAINC30LDQv9GD0YnQtdC9JywgdGhpcy5ncm91cFN0eWxlKVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JLRi9Cy0L7QtNC40YIg0YHQvtC+0LHRidC10L3QuNC1INC+0LEg0L7RgdGC0LDQvdC+0LLQutC1INGA0LXQvdC00LXRgNCwLlxuICAgKi9cbiAgcHVibGljIHN0b3BlZCgpOiB2b2lkIHtcbiAgICBjb25zb2xlLmxvZygnJWPQoNC10L3QtNC10YAg0L7RgdGC0LDQvdC+0LLQu9C10L0nLCB0aGlzLmdyb3VwU3R5bGUpXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQktGL0LLQvtC00LjRgiDRgdC+0L7QsdGI0LXQvdC40LUg0L7QsSDQvtGH0LjRgdGC0LrQtSDQvtCx0LvQsNGB0YLQuCDRgNC10L3QtNC10YDQsC5cbiAgICovXG4gIHB1YmxpYyBjbGVhcmVkKGNvbG9yOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zb2xlLmxvZygnJWPQntCx0LvQsNGB0YLRjCDRgNC10L3QtNC10YDQsCDQvtGH0LjRidC10L3QsCBbJyArIGNvbG9yICsgJ10nLCB0aGlzLmdyb3VwU3R5bGUpO1xuICB9XG59XG4iLCJpbXBvcnQgU1Bsb3QgZnJvbSAnQC9zcGxvdCdcbmltcG9ydCB7IHJhbmRvbUludCB9IGZyb20gJ0AvdXRpbHMnXG5cbi8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKlxuICog0JrQu9Cw0YHRgS3RhdC10LvQv9C10YAsINGA0LXQsNC70LjQt9GD0Y7RidC40Lkg0L/QvtC00LTQtdGA0LbQutGDINGA0LXQttC40LzQsCDQtNC10LzQvtC90YHRgtGA0LDRhtC40L7QvdC90YvRhSDQtNCw0L3QvdGL0YUg0LTQu9GPINC60LvQsNGB0YHQsCBTUGxvdC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU1Bsb3REZW1vIGltcGxlbWVudHMgU1Bsb3RIZWxwZXIge1xuXG4gIC8qKiDQn9GA0LjQt9C90LDQuiDQsNC60YLQuNCy0LDRhtC40Lgg0LTQtdC80L4t0YDQtdC20LjQvNCwLiAqL1xuICBwdWJsaWMgaXNFbmFibGU6IGJvb2xlYW4gPSBmYWxzZVxuXG4gIC8qKiDQmtC+0LvQuNGH0LXRgdGC0LLQviDQsdGK0LXQutGC0L7Qsi4gKi9cbiAgcHVibGljIGFtb3VudDogbnVtYmVyID0gMV8wMDBfMDAwXG5cbiAgLyoqINCc0LjQvdC40LzQsNC70YzQvdGL0Lkg0YDQsNC30LzQtdGAINC+0LHRitC10LrRgtC+0LIuICovXG4gIHB1YmxpYyBzaXplTWluOiBudW1iZXIgPSAxMFxuXG4gIC8qKiDQnNCw0LrRgdC40LzQsNC70YzQvdGL0Lkg0YDQsNC30LzQtdGAINC+0LHRitC10LrRgtC+0LIuICovXG4gIHB1YmxpYyBzaXplTWF4OiBudW1iZXIgPSAzMFxuXG4gIC8qKiDQptCy0LXRgtC+0LLQsNGPINC/0LDQu9C40YLRgNCwINC+0LHRitC10LrRgtC+0LIuICovXG4gIHB1YmxpYyBjb2xvcnM6IHN0cmluZ1tdID0gW1xuICAgICcjRDgxQzAxJywgJyNFOTk2N0EnLCAnI0JBNTVEMycsICcjRkZENzAwJywgJyNGRkU0QjUnLCAnI0ZGOEMwMCcsXG4gICAgJyMyMjhCMjInLCAnIzkwRUU5MCcsICcjNDE2OUUxJywgJyMwMEJGRkYnLCAnIzhCNDUxMycsICcjMDBDRUQxJ1xuICBdXG5cbiAgLyoqINCf0YDQuNC30L3QsNC6INGC0L7Qs9C+LCDRh9GC0L4g0YXQtdC70L/QtdGAINGD0LbQtSDQvdCw0YHRgtGA0L7QtdC9LiAqL1xuICBwdWJsaWMgaXNTZXR1cGVkOiBib29sZWFuID0gZmFsc2VcblxuICAvKiog0KHRh9C10YLRh9C40Log0LjRgtC10YDQuNGA0YPQtdC80YvRhSDQvtCx0YrQtdC60YLQvtCyLiAqL1xuICBwcml2YXRlIGluZGV4OiBudW1iZXIgPSAwXG5cbiAgLyoqINCl0LXQu9C/0LXRgCDQsdGD0LTQtdGCINC40LzQtdGC0Ywg0L/QvtC70L3Ri9C5INC00L7RgdGC0YPQvyDQuiDRjdC60LfQtdC80L/Qu9GP0YDRgyBTUGxvdC4gKi9cbiAgY29uc3RydWN0b3IoXG4gICAgcmVhZG9ubHkgc3Bsb3Q6IFNQbG90XG4gICkge31cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQn9C+0LTQs9C+0YLQsNCy0LvQuNCy0LDQtdGCINGF0LXQu9C/0LXRgCDQuiDQuNGB0L/QvtC70YzQt9C+0LLQsNC90LjRji5cbiAgICovXG4gIHB1YmxpYyBzZXR1cCgpOiB2b2lkIHtcblxuICAgIC8qKiDQpdC10LvQv9C10YAg0LTQtdC80L4t0YDQtdC20LjQvNCwINCy0YvQv9C+0LvQvdGP0LXRgiDQvdCw0YHRgtGA0L7QudC60YMg0LLRgdC10YUg0YHQstC+0LjRhSDQv9Cw0YDQsNC80LXRgtGA0L7QsiDQtNCw0LbQtSDQtdGB0LvQuCDQvtC90LAg0YPQttC1INCy0YvQv9C+0LvQvdGP0LvQsNGB0YwuICovXG4gICAgaWYgKCF0aGlzLmlzU2V0dXBlZCkge1xuICAgICAgdGhpcy5pc1NldHVwZWQgPSB0cnVlXG4gICAgfVxuXG4gICAgLyoqINCe0LHQvdGD0LvQtdC90LjQtSDRgdGH0LXRgtGH0LjQutCwINC40YLQtdGA0LDRgtC+0YDQsC4gKi9cbiAgICB0aGlzLmluZGV4ID0gMFxuXG4gICAgLyoqINCf0L7QtNCz0L7RgtC+0LLQutCwINC00LXQvNC+LdGA0LXQttC40LzQsCAo0LXRgdC70Lgg0YLRgNC10LHRg9C10YLRgdGPKS4gKi9cbiAgICBpZiAodGhpcy5zcGxvdC5kZW1vLmlzRW5hYmxlKSB7XG4gICAgICB0aGlzLnNwbG90Lml0ZXJhdG9yID0gdGhpcy5zcGxvdC5kZW1vLml0ZXJhdG9yLmJpbmQodGhpcylcbiAgICAgIHRoaXMuc3Bsb3QuY29sb3JzID0gdGhpcy5zcGxvdC5kZW1vLmNvbG9yc1xuICAgIH1cbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCY0LzQuNGC0LjRgNGD0LXRgiDQuNGC0LXRgNCw0YLQvtGAINC40YHRhdC+0LTQvdGL0YUg0L7QsdGK0LXQutGC0L7Qsi5cbiAgICovXG4gIHB1YmxpYyBpdGVyYXRvcigpOiBTUGxvdE9iamVjdCB8IG51bGwge1xuICAgIGlmICh0aGlzLmluZGV4IDwgdGhpcy5hbW91bnQpIHtcbiAgICAgIHRoaXMuaW5kZXgrK1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgeDogTWF0aC5yYW5kb20oKSxcbiAgICAgICAgeTogTWF0aC5yYW5kb20oKSxcbiAgICAgICAgc2hhcGU6IHJhbmRvbUludCh0aGlzLnNwbG90LnNoYXBlc0NvdW50ISksXG4gICAgICAgIHNpemU6IHRoaXMuc2l6ZU1pbiArIHJhbmRvbUludCh0aGlzLnNpemVNYXggLSB0aGlzLnNpemVNaW4gKyAxKSxcbiAgICAgICAgY29sb3I6IHJhbmRvbUludCh0aGlzLmNvbG9ycy5sZW5ndGgpXG4gICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCBTUGxvdCBmcm9tICdAL3NwbG90J1xuaW1wb3J0ICogYXMgc2hhZGVycyBmcm9tICdAL3NoYWRlcnMnXG5pbXBvcnQgeyBjb2xvckZyb21IZXhUb0dsUmdiIH0gZnJvbSAnQC91dGlscydcblxuLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqXG4gKiDQmtC70LDRgdGBLdGF0LXQu9C/0LXRgCwg0YPQv9GA0LDQstC70Y/RjtGJ0LjQuSBHTFNMLdC60L7QtNC+0Lwg0YjQtdC50LTQtdGA0L7Qsi5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU1Bsb3RHbHNsIGltcGxlbWVudHMgU1Bsb3RIZWxwZXIge1xuXG4gIC8qKiDQmtC+0LTRiyDRiNC10LnQtNC10YDQvtCyLiAqL1xuICBwdWJsaWMgdmVydFNoYWRlclNvdXJjZTogc3RyaW5nID0gJydcbiAgcHVibGljIGZyYWdTaGFkZXJTb3VyY2U6IHN0cmluZyA9ICcnXG5cbiAgLyoqINCf0YDQuNC30L3QsNC6INGC0L7Qs9C+LCDRh9GC0L4g0YXQtdC70L/QtdGAINGD0LbQtSDQvdCw0YHRgtGA0L7QtdC9LiAqL1xuICBwdWJsaWMgaXNTZXR1cGVkOiBib29sZWFuID0gZmFsc2VcblxuICAvKiog0KXQtdC70L/QtdGAINCx0YPQtNC10YIg0LjQvNC10YLRjCDQv9C+0LvQvdGL0Lkg0LTQvtGB0YLRg9C/INC6INGN0LrQt9C10LzQv9C70Y/RgNGDIFNQbG90LiAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICByZWFkb25seSBzcGxvdDogU1Bsb3RcbiAgKSB7fVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCf0L7QtNCz0L7RgtCw0LLQu9C40LLQsNC10YIg0YXQtdC70L/QtdGAINC6INC40YHQv9C+0LvRjNC30L7QstCw0L3QuNGOLlxuICAgKi9cbiAgcHVibGljIHNldHVwKCk6IHZvaWQge1xuXG4gICAgaWYgKCF0aGlzLmlzU2V0dXBlZCkge1xuXG4gICAgICAvKiog0KHQsdC+0YDQutCwINC60L7QtNC+0LIg0YjQtdC50LTQtdGA0L7Qsi4gKi9cbiAgICAgIHRoaXMudmVydFNoYWRlclNvdXJjZSA9IHRoaXMubWFrZVZlcnRTaGFkZXJTb3VyY2UoKVxuICAgICAgdGhpcy5mcmFnU2hhZGVyU291cmNlID0gdGhpcy5tYWtlRnJhZ1NoYWRlclNvdXJjZSgpXG5cbiAgICAgIC8qKiDQktGL0YfQuNGB0LvQtdC90LjQtSDQutC+0LvQuNGH0LXRgdGC0LLQsCDRgNCw0LfQu9C40YfQvdGL0YUg0YTQvtGA0Lwg0L7QsdGK0LXQutGC0L7Qsi4gKi9cbiAgICAgIHRoaXMuc3Bsb3Quc2hhcGVzQ291bnQgPSBzaGFkZXJzLlNIQVBFUy5sZW5ndGhcblxuICAgICAgdGhpcy5pc1NldHVwZWQgPSB0cnVlXG4gICAgfVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0KHQvtC30LTQsNC10YIg0LrQvtC0INCy0LXRgNGI0LjQvdC90L7Qs9C+INGI0LXQudC00LXRgNCwLlxuICAgKlxuICAgKiBAcmVtYXJrc1xuICAgKiDQkiDRiNCw0LHQu9C+0L0g0LLQtdGA0YjQuNC90L3QvtCz0L4g0YjQtdC50LTQtdGA0LAg0LLRgdGC0LDQstC70Y/QtdGC0YHRjyDQutC+0LQg0LLRi9Cx0L7RgNCwINGG0LLQtdGC0LAg0L7QsdGK0LXQutGC0LAg0L/QviDQuNC90LTQtdC60YHRgyDRhtCy0LXRgtCwLiDQoi7Qui7RiNC10LnQtNC10YAg0L3QtSDQv9C+0LfQstC+0LvRj9C10YJcbiAgICog0LjRgdC/0L7Qu9GM0LfQvtCy0LDRgtGMINCyINC60LDRh9C10YHRgtCy0LUg0LjQvdC00LXQutGB0L7QsiDQv9C10YDQtdC80LXQvdC90YvQtSAtINC00LvRjyDQt9Cw0LTQsNC90LjRjyDRhtCy0LXRgtCwINC40YHQv9C+0LvRjNC30YPQtdGC0YHRjyDQv9C+0YHQu9C10LTQvtCy0LDRgtC10LvRjNC90YvQuSDQv9C10YDQtdCx0L7RgCDRhtCy0LXRgtC+0LLRi9GFXG4gICAqINC40L3QtNC10LrRgdC+0LIuXG4gICAqL1xuICBwcml2YXRlIG1ha2VWZXJ0U2hhZGVyU291cmNlKCkge1xuXG4gICAgLyoqINCS0YDQtdC80LXQvdC90L7QtSDQtNC+0LHQsNCy0LvQtdC90LjQtSDQsiDQv9Cw0LvQuNGC0YDRgyDQstC10YDRiNC40L0g0YbQstC10YLQsCDQvdCw0L/RgNCw0LLQu9GP0Y7RidC40YUuICovXG4gICAgdGhpcy5zcGxvdC5jb2xvcnMucHVzaCh0aGlzLnNwbG90LmdyaWQucnVsZXNDb2xvciEpXG5cbiAgICBsZXQgY29kZTogc3RyaW5nID0gJydcblxuICAgIC8qKiDQpNC+0YDQvNC40YDQvtCy0L3QuNC1INC60L7QtNCwINGD0YHRgtCw0L3QvtCy0LrQuCDRhtCy0LXRgtCwINC+0LHRitC10LrRgtCwINC/0L4g0LjQvdC00LXQutGB0YMuICovXG4gICAgdGhpcy5zcGxvdC5jb2xvcnMuZm9yRWFjaCgodmFsdWUsIGluZGV4KSA9PiB7XG4gICAgICBsZXQgW3IsIGcsIGJdID0gY29sb3JGcm9tSGV4VG9HbFJnYih2YWx1ZSlcbiAgICAgIGNvZGUgKz0gYGVsc2UgaWYgKGFfY29sb3IgPT0gJHtpbmRleH0uMCkgdl9jb2xvciA9IHZlYzMoJHtyfSwgJHtnfSwgJHtifSk7XFxuYFxuICAgIH0pXG5cbiAgICAvKiog0KPQtNCw0LvQtdC90LjQtSDQuNC3INC/0LDQu9C40YLRgNGLINCy0LXRgNGI0LjQvSDQstGA0LXQvNC10L3QvdC+INC00L7QsdCw0LLQu9C10L3QvdC+0LPQviDRhtCy0LXRgtCwINC90LDQv9GA0LDQstC70Y/RjtGJ0LjRhS4gKi9cbiAgICB0aGlzLnNwbG90LmNvbG9ycy5wb3AoKVxuXG4gICAgLyoqINCj0LTQsNC70LXQvdC40LUg0LvQuNGI0L3QtdCz0L4gXCJlbHNlXCIg0LIg0L3QsNGH0LDQu9C1INC60L7QtNCwINC4INC70LjRiNC90LXQs9C+INC/0LXRgNC10LLQvtC00LAg0YHRgtGA0L7QutC4INCyINC60L7QvdGG0LUuICovXG4gICAgY29kZSA9IGNvZGUuc2xpY2UoNSkuc2xpY2UoMCwgLTEpXG5cbiAgICByZXR1cm4gc2hhZGVycy5WRVJURVhfVEVNUExBVEUucmVwbGFjZSgne0NPTE9SLVNFTEVDVElPTn0nLCBjb2RlKS50cmltKClcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCh0L7Qt9C00LDQtdGCINC60L7QtCDRhNGA0LDQs9C80LXQvdGC0L3QvtCz0L4g0YjQtdC50LTQtdGA0LAuXG4gICAqL1xuICBwcml2YXRlIG1ha2VGcmFnU2hhZGVyU291cmNlKCkge1xuXG4gICAgbGV0IGNvZGUxOiBzdHJpbmcgPSAnJ1xuICAgIGxldCBjb2RlMjogc3RyaW5nID0gJydcblxuICAgIHNoYWRlcnMuU0hBUEVTLmZvckVhY2goKHZhbHVlLCBpbmRleCkgPT4ge1xuXG4gICAgICAvKiog0KTQvtGA0LzQuNGA0L7QstCw0L3QuNC1INC60L7QtNCwINGE0YPQvdC60YbQuNC5LCDQvtC/0LjRgdGL0LLQsNGO0YnQuNGFINGE0L7RgNC80Ysg0L7QsdGK0LXQutGC0L7Qsi4gKi9cbiAgICAgIGNvZGUxICs9IGB2b2lkIHMke2luZGV4fSgpIHsgJHt2YWx1ZS50cmltKCl9IH1cXG5gXG5cbiAgICAgIC8qKiDQpNC+0YDQvNC40YDQvtCy0LDQvdC40LUg0LrQvtC00LAg0YPRgdGC0LDQvdC+0LLQutC4INGE0L7RgNC80Ysg0L7QsdGK0LXQutGC0LAg0L/QviDQuNC90LTQtdC60YHRgy4gKi9cbiAgICAgIGNvZGUyICs9IGBlbHNlIGlmICh2X3NoYXBlID09ICR7aW5kZXh9LjApIHsgcyR7aW5kZXh9KCk7fVxcbmBcbiAgICB9KVxuXG4gICAgLyoqINCj0LTQsNC70LXQvdC40LUg0LvQuNGI0L3QtdCz0L4g0L/QtdGA0LXQstC+0LTQsCDRgdGC0YDQvtC60Lgg0LIg0LrQvtC90YbQtS4gKi9cbiAgICBjb2RlMSA9IGNvZGUxLnNsaWNlKDAsIC0xKVxuXG4gICAgLyoqINCj0LTQsNC70LXQvdC40LUg0LvQuNGI0L3QtdCz0L4gXCJlbHNlXCIg0LIg0L3QsNGH0LDQu9C1INC60L7QtNCwINC4INC70LjRiNC90LXQs9C+INC/0LXRgNC10LLQvtC00LAg0YHRgtGA0L7QutC4INCyINC60L7QvdGG0LUuICovXG4gICAgY29kZTIgPSBjb2RlMi5zbGljZSg1KS5zbGljZSgwLCAtMSlcblxuICAgIHJldHVybiBzaGFkZXJzLkZSQUdNRU5UX1RFTVBMQVRFLlxuICAgICAgcmVwbGFjZSgne1NIQVBFUy1GVU5DVElPTlN9JywgY29kZTEpLlxuICAgICAgcmVwbGFjZSgne1NIQVBFLVNFTEVDVElPTn0nLCBjb2RlMikuXG4gICAgICB0cmltKClcbiAgfVxufVxuIiwiaW1wb3J0IFNQbG90IGZyb20gJ0Avc3Bsb3QnXG5pbXBvcnQgeyBjb2xvckZyb21IZXhUb0dsUmdiIH0gZnJvbSAnQC91dGlscydcblxuLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqXG4gKiDQmtC70LDRgdGBLdGF0LXQu9C/0LXRgCwg0YDQtdCw0LvQuNC30YPRjtGJ0LjQuSDRg9C/0YDQsNCy0LvQtdC90LjQtSDQutC+0L3RgtC10LrRgdGC0L7QvCDRgNC10L3QtNC10YDQuNC90LPQsCBXZWJHTCDQutC70LDRgdGB0LAgU3Bsb3QuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNQbG90V2ViR2wgaW1wbGVtZW50cyBTUGxvdEhlbHBlciB7XG5cbiAgLyoqINCf0LDRgNCw0LzQtdGC0YDRiyDQuNC90LjRhtC40LDQu9C40LfQsNGG0LjQuCDQutC+0L3RgtC10LrRgdGC0LAg0YDQtdC90LTQtdGA0LjQvdCz0LAgV2ViR0wuICovXG4gIHB1YmxpYyBhbHBoYTogYm9vbGVhbiA9IGZhbHNlXG4gIHB1YmxpYyBkZXB0aDogYm9vbGVhbiA9IGZhbHNlXG4gIHB1YmxpYyBzdGVuY2lsOiBib29sZWFuID0gZmFsc2VcbiAgcHVibGljIGFudGlhbGlhczogYm9vbGVhbiA9IGZhbHNlXG4gIHB1YmxpYyBkZXN5bmNocm9uaXplZDogYm9vbGVhbiA9IHRydWVcbiAgcHVibGljIHByZW11bHRpcGxpZWRBbHBoYTogYm9vbGVhbiA9IGZhbHNlXG4gIHB1YmxpYyBwcmVzZXJ2ZURyYXdpbmdCdWZmZXI6IGJvb2xlYW4gPSBmYWxzZVxuICBwdWJsaWMgZmFpbElmTWFqb3JQZXJmb3JtYW5jZUNhdmVhdDogYm9vbGVhbiA9IHRydWVcbiAgcHVibGljIHBvd2VyUHJlZmVyZW5jZTogV2ViR0xQb3dlclByZWZlcmVuY2UgPSAnaGlnaC1wZXJmb3JtYW5jZSdcblxuICAvKiog0J3QsNC30LLQsNC90LjRjyDRjdC70LXQvNC10L3RgtC+0LIg0LPRgNCw0YTQuNGH0LXRgdC60L7QuSDRgdC40YHRgtC10LzRiyDQutC70LjQtdC90YLQsC4gKi9cbiAgcHVibGljIGdwdSA9IHsgaGFyZHdhcmU6ICctJywgc29mdHdhcmU6ICctJyB9XG5cbiAgLyoqINCa0L7QvdGC0LXQutGB0YIg0YDQtdC90LTQtdGA0LjQvdCz0LAg0Lgg0L/RgNC+0LPRgNCw0LzQvNCwIFdlYkdMLiAqL1xuICBwdWJsaWMgZ2whOiBXZWJHTFJlbmRlcmluZ0NvbnRleHRcbiAgcHJpdmF0ZSBncHVQcm9ncmFtITogV2ViR0xQcm9ncmFtXG5cbiAgLyoqINCf0LXRgNC10LzQtdC90L3Ri9C1INC00LvRjyDRgdCy0Y/Qt9C4INC/0YDQuNC70L7QttC10L3QuNGPINGBINC/0YDQvtCz0YDQsNC80LzQvtC5IFdlYkdMLiAqL1xuICBwcml2YXRlIHZhcmlhYmxlczogTWFwPHN0cmluZywgYW55PiA9IG5ldyBNYXAoKVxuXG4gIC8qKiDQn9GA0LjQt9C90LDQuiDRgtC+0LPQviwg0YfRgtC+INGF0LXQu9C/0LXRgCDRg9C20LUg0L3QsNGB0YLRgNC+0LXQvS4gKi9cbiAgcHVibGljIGlzU2V0dXBlZDogYm9vbGVhbiA9IGZhbHNlXG5cbiAgLyoqINCR0YPRhNC10YDRiyDQstC40LTQtdC+0L/QsNC80Y/RgtC4IFdlYkdMLiAqL1xuICBwdWJsaWMgZGF0YTogYW55W10gPSBbXVxuXG4gIHByaXZhdGUgZ3JvdXBUeXBlOiBudW1iZXJbXSA9IFtdXG5cbiAgLyoqINCf0YDQsNCy0LjQu9CwINGB0L7QvtGC0LLQtdGC0YHRgtCy0LjRjyDRgtC40L/QvtCyINGC0LjQv9C40LfQuNGA0L7QstCw0L3QvdGL0YUg0LzQsNGB0YHQuNCy0L7QsiDQuCDRgtC40L/QvtCyINC/0LXRgNC10LzQtdC90L3Ri9GFIFdlYkdMLiAqL1xuICBwcml2YXRlIGdsTnVtYmVyVHlwZXM6IE1hcDxzdHJpbmcsIG51bWJlcj4gPSBuZXcgTWFwKFtcbiAgICBbJ0ludDhBcnJheScsIDB4MTQwMF0sICAgICAgIC8vIGdsLkJZVEVcbiAgICBbJ1VpbnQ4QXJyYXknLCAweDE0MDFdLCAgICAgIC8vIGdsLlVOU0lHTkVEX0JZVEVcbiAgICBbJ0ludDE2QXJyYXknLCAweDE0MDJdLCAgICAgIC8vIGdsLlNIT1JUXG4gICAgWydVaW50MTZBcnJheScsIDB4MTQwM10sICAgICAvLyBnbC5VTlNJR05FRF9TSE9SVFxuICAgIFsnRmxvYXQzMkFycmF5JywgMHgxNDA2XSAgICAgLy8gZ2wuRkxPQVRcbiAgXSlcblxuICAvKiog0KXQtdC70L/QtdGAINCx0YPQtNC10YIg0LjQvNC10YLRjCDQv9C+0LvQvdGL0Lkg0LTQvtGB0YLRg9C/INC6INGN0LrQt9C10LzQv9C70Y/RgNGDIFNQbG90LiAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICByZWFkb25seSBzcGxvdDogU1Bsb3RcbiAgKSB7IH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQn9C+0LTQs9C+0YLQsNCy0LvQuNCy0LDQtdGCINGF0LXQu9C/0LXRgCDQuiDQuNGB0L/QvtC70YzQt9C+0LLQsNC90LjRji5cbiAgICovXG4gIHB1YmxpYyBzZXR1cCgpOiB2b2lkIHtcblxuICAgIC8qKiDQp9Cw0YHRgtGMINC/0LDRgNCw0LzQtdGC0YDQvtCyINGF0LXQu9C/0LXRgNCwIFdlYkdMINC40L3QuNGG0LjQsNC70LjQt9C40YDRg9C10YLRgdGPINGC0L7Qu9GM0LrQviDQvtC00LjQvSDRgNCw0LcuICovXG4gICAgaWYgKCF0aGlzLmlzU2V0dXBlZCkge1xuXG4gICAgICB0aGlzLmdsID0gdGhpcy5zcGxvdC5jYW52YXMuZ2V0Q29udGV4dCgnd2ViZ2wnLCB7XG4gICAgICAgIGFscGhhOiB0aGlzLmFscGhhLFxuICAgICAgICBkZXB0aDogdGhpcy5kZXB0aCxcbiAgICAgICAgc3RlbmNpbDogdGhpcy5zdGVuY2lsLFxuICAgICAgICBhbnRpYWxpYXM6IHRoaXMuYW50aWFsaWFzLFxuICAgICAgICBkZXN5bmNocm9uaXplZDogdGhpcy5kZXN5bmNocm9uaXplZCxcbiAgICAgICAgcHJlbXVsdGlwbGllZEFscGhhOiB0aGlzLnByZW11bHRpcGxpZWRBbHBoYSxcbiAgICAgICAgcHJlc2VydmVEcmF3aW5nQnVmZmVyOiB0aGlzLnByZXNlcnZlRHJhd2luZ0J1ZmZlcixcbiAgICAgICAgZmFpbElmTWFqb3JQZXJmb3JtYW5jZUNhdmVhdDogdGhpcy5mYWlsSWZNYWpvclBlcmZvcm1hbmNlQ2F2ZWF0LFxuICAgICAgICBwb3dlclByZWZlcmVuY2U6IHRoaXMucG93ZXJQcmVmZXJlbmNlXG4gICAgICB9KSFcblxuICAgICAgaWYgKHRoaXMuZ2wgPT09IG51bGwpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCfQntGI0LjQsdC60LAg0YHQvtC30LTQsNC90LjRjyDQutC+0L3RgtC10LrRgdGC0LAg0YDQtdC90LTQtdGA0LjQvdCz0LAgV2ViR0whJylcbiAgICAgIH1cblxuICAgICAgLyoqINCf0L7Qu9GD0YfQtdC90LjQtSDQuNC90YTQvtGA0LzQsNGG0LjQuCDQviDQs9GA0LDRhNC40YfQtdGB0LrQvtC5INGB0LjRgdGC0LXQvNC1INC60LvQuNC10L3RgtCwLiAqL1xuICAgICAgbGV0IGV4dCA9IHRoaXMuZ2wuZ2V0RXh0ZW5zaW9uKCdXRUJHTF9kZWJ1Z19yZW5kZXJlcl9pbmZvJylcbiAgICAgIHRoaXMuZ3B1LmhhcmR3YXJlID0gKGV4dCkgPyB0aGlzLmdsLmdldFBhcmFtZXRlcihleHQuVU5NQVNLRURfUkVOREVSRVJfV0VCR0wpIDogJ1vQvdC10LjQt9Cy0LXRgdGC0L3Qvl0nXG4gICAgICB0aGlzLmdwdS5zb2Z0d2FyZSA9IHRoaXMuZ2wuZ2V0UGFyYW1ldGVyKHRoaXMuZ2wuVkVSU0lPTilcblxuICAgICAgdGhpcy5zcGxvdC5kZWJ1Zy5sb2coJ2dwdScpXG5cbiAgICAgIC8qKiDQodC+0LfQtNCw0L3QuNC1INC/0YDQvtCz0YDQsNC80LzRiyBXZWJHTC4gKi9cbiAgICAgIHRoaXMuY3JlYXRlUHJvZ3JhbSh0aGlzLnNwbG90Lmdsc2wudmVydFNoYWRlclNvdXJjZSwgdGhpcy5zcGxvdC5nbHNsLmZyYWdTaGFkZXJTb3VyY2UpXG5cbiAgICAgIHRoaXMuaXNTZXR1cGVkID0gdHJ1ZVxuICAgIH1cblxuICAgIC8qKiDQlNGA0YPQs9Cw0Y8g0YfQsNGB0YLRjCDQv9Cw0YDQsNC80LXRgtGA0L7QsiDRhdC10LvQv9C10YDQsCBXZWJHTCDQuNC90LjRhtC40LDQu9C40LfQuNGA0YPQtdGC0YHRjyDQv9GA0Lgg0LrQsNC20LTQvtC8INCy0YvQt9C+0LLQtSDQvNC10YLQvtC00LAgc2V0dXAuICovXG5cbiAgICAvKiog0JrQvtC+0YDQtdC60YLQuNGA0L7QstC60LAg0YDQsNC30LzQtdGA0LAg0L7QsdC70LDRgdGC0Lgg0L/RgNC+0YHQvNC+0YLRgNCwLiAqL1xuICAgIHRoaXMuc3Bsb3QuY2FudmFzLndpZHRoID0gdGhpcy5zcGxvdC5jYW52YXMuY2xpZW50V2lkdGhcbiAgICB0aGlzLnNwbG90LmNhbnZhcy5oZWlnaHQgPSB0aGlzLnNwbG90LmNhbnZhcy5jbGllbnRIZWlnaHRcbiAgICB0aGlzLmdsLnZpZXdwb3J0KDAsIDAsIHRoaXMuc3Bsb3QuY2FudmFzLndpZHRoLCB0aGlzLnNwbG90LmNhbnZhcy5oZWlnaHQpXG5cbiAgICAvKiog0JXRgdC70Lgg0LfQsNC00LDQvSDRgNCw0LfQvNC10YAg0L/Qu9C+0YHQutC+0YHRgtC4LCDQvdC+INC90LUg0LfQsNC00LDQvdC+INC/0L7Qu9C+0LbQtdC90LjQtSDQvtCx0LvQsNGB0YLQuCDQv9GA0L7RgdC80L7RgtGA0LAsINGC0L4g0L7QvdCwINC/0L7QvNC10YnQsNC10YLRgdGPINCyINGG0LXQvdGC0YAg0L/Qu9C+0YHQutC+0YHRgtC4LiAqL1xuICAgIGlmICgoJ2dyaWQnIGluIHRoaXMuc3Bsb3QubGFzdFJlcXVlc3RlZE9wdGlvbnMhKSAmJiAhKCdjYW1lcmEnIGluIHRoaXMuc3Bsb3QubGFzdFJlcXVlc3RlZE9wdGlvbnMpKSB7XG4gICAgICB0aGlzLnNwbG90LmNhbWVyYS54ID0gMC41XG4gICAgICB0aGlzLnNwbG90LmNhbWVyYS55ID0gMC41XG4gICAgfVxuXG4gICAgLyoqINCj0YHRgtCw0L3QvtCy0LrQsCDRhNC+0L3QvtCy0L7Qs9C+INGG0LLQtdGC0LAg0LrQsNC90LLQsNGB0LAgKNGG0LLQtdGCINC+0YfQuNGB0YLQutC4INC60L7QvdGC0LXQutGB0YLQsCDRgNC10L3QtNC10YDQuNC90LPQsCkuICovXG4gICAgdGhpcy5zZXRCZ0NvbG9yKHRoaXMuc3Bsb3QuZ3JpZC5iZ0NvbG9yISlcbiAgfVxuXG4gIGNsZWFyRGF0YSgpIHtcbiAgICBmb3IgKGxldCBkeCA9IDA7IGR4IDwgdGhpcy5zcGxvdC5hcmVhLmNvdW50OyBkeCsrKSB7XG4gICAgICB0aGlzLmRhdGFbZHhdID0gW11cbiAgICAgIGZvciAobGV0IGR5ID0gMDsgZHkgPCB0aGlzLnNwbG90LmFyZWEuY291bnQ7IGR5KyspIHtcbiAgICAgICAgdGhpcy5kYXRhW2R4XVtkeV0gPSBbXVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCj0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdGCINGG0LLQtdGCINGE0L7QvdCwINC60L7QvdGC0LXQutGB0YLQsCDRgNC10L3QtNC10YDQuNC90LPQsCBXZWJHTC5cbiAgICovXG4gIHB1YmxpYyBzZXRCZ0NvbG9yKGNvbG9yOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBsZXQgW3IsIGcsIGJdID0gY29sb3JGcm9tSGV4VG9HbFJnYihjb2xvcilcbiAgICB0aGlzLmdsLmNsZWFyQ29sb3IociwgZywgYiwgMC4wKVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JfQsNC60YDQsNGI0LjQstCw0LXRgiDQutC+0L3RgtC10LrRgdGCINGA0LXQvdC00LXRgNC40L3Qs9CwIFdlYkdMINGG0LLQtdGC0L7QvCDRhNC+0L3QsC5cbiAgICovXG4gIHB1YmxpYyBjbGVhckJhY2tncm91bmQoKTogdm9pZCB7XG4gICAgdGhpcy5nbC5jbGVhcih0aGlzLmdsLkNPTE9SX0JVRkZFUl9CSVQpO1xuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0KHQvtC30LTQsNC10YIg0YjQtdC50LTQtdGAIFdlYkdMLlxuICAgKlxuICAgKiBAcGFyYW0gdHlwZSAtINCi0LjQvyDRiNC10LnQtNC10YDQsC5cbiAgICogQHBhcmFtIGNvZGUgLSBHTFNMLdC60L7QtCDRiNC10LnQtNC10YDQsC5cbiAgICogQHJldHVybnMg0KHQvtC30LTQsNC90L3Ri9C5INGI0LXQudC00LXRgC5cbiAgICovXG4gIHB1YmxpYyBjcmVhdGVTaGFkZXIodHlwZTogJ1ZFUlRFWF9TSEFERVInIHwgJ0ZSQUdNRU5UX1NIQURFUicsIGNvZGU6IHN0cmluZyk6IFdlYkdMU2hhZGVyIHtcblxuICAgIGNvbnN0IHNoYWRlciA9IHRoaXMuZ2wuY3JlYXRlU2hhZGVyKHRoaXMuZ2xbdHlwZV0pIVxuICAgIHRoaXMuZ2wuc2hhZGVyU291cmNlKHNoYWRlciwgY29kZSlcbiAgICB0aGlzLmdsLmNvbXBpbGVTaGFkZXIoc2hhZGVyKVxuXG4gICAgaWYgKCF0aGlzLmdsLmdldFNoYWRlclBhcmFtZXRlcihzaGFkZXIsIHRoaXMuZ2wuQ09NUElMRV9TVEFUVVMpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ9Ce0YjQuNCx0LrQsCDQutC+0LzQv9C40LvRj9GG0LjQuCDRiNC10LnQtNC10YDQsCBbJyArIHR5cGUgKyAnXS4gJyArIHRoaXMuZ2wuZ2V0U2hhZGVySW5mb0xvZyhzaGFkZXIpKVxuICAgIH1cblxuICAgIHJldHVybiBzaGFkZXJcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCh0L7Qt9C00LDQtdGCINC/0YDQvtCz0YDQsNC80LzRgyBXZWJHTCDQuNC3INGI0LXQudC00LXRgNC+0LIuXG4gICAqXG4gICAqIEBwYXJhbSBzaGFkZXJWZXJ0IC0g0JLQtdGA0YjQuNC90L3Ri9C5INGI0LXQudC00LXRgC5cbiAgICogQHBhcmFtIHNoYWRlckZyYWcgLSDQpNGA0LDQs9C80LXQvdGC0L3Ri9C5INGI0LXQudC00LXRgC5cbiAgICovXG4gIHB1YmxpYyBjcmVhdGVQcm9ncmFtRnJvbVNoYWRlcnMoc2hhZGVyVmVydDogV2ViR0xTaGFkZXIsIHNoYWRlckZyYWc6IFdlYkdMU2hhZGVyKTogdm9pZCB7XG5cbiAgICB0aGlzLmdwdVByb2dyYW0gPSB0aGlzLmdsLmNyZWF0ZVByb2dyYW0oKSFcbiAgICB0aGlzLmdsLmF0dGFjaFNoYWRlcih0aGlzLmdwdVByb2dyYW0sIHNoYWRlclZlcnQpXG4gICAgdGhpcy5nbC5hdHRhY2hTaGFkZXIodGhpcy5ncHVQcm9ncmFtLCBzaGFkZXJGcmFnKVxuICAgIHRoaXMuZ2wubGlua1Byb2dyYW0odGhpcy5ncHVQcm9ncmFtKVxuICAgIHRoaXMuZ2wudXNlUHJvZ3JhbSh0aGlzLmdwdVByb2dyYW0pXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQodC+0LfQtNCw0LXRgiDQv9GA0L7Qs9GA0LDQvNC80YMgV2ViR0wg0LjQtyBHTFNMLdC60L7QtNC+0LIg0YjQtdC50LTQtdGA0L7Qsi5cbiAgICpcbiAgICogQHBhcmFtIHNoYWRlckNvZGVWZXJ0IC0g0JrQvtC0INCy0LXRgNGI0LjQvdC90L7Qs9C+INGI0LXQudC00LXRgNCwLlxuICAgKiBAcGFyYW0gc2hhZGVyQ29kZUZyYWcgLSDQmtC+0LQg0YTRgNCw0LPQvNC10L3RgtC90L7Qs9C+INGI0LXQudC00LXRgNCwLlxuICAgKi9cbiAgcHVibGljIGNyZWF0ZVByb2dyYW0oc2hhZGVyQ29kZVZlcnQ6IHN0cmluZywgc2hhZGVyQ29kZUZyYWc6IHN0cmluZyk6IHZvaWQge1xuXG4gICAgdGhpcy5zcGxvdC5kZWJ1Zy5sb2coJ3NoYWRlcnMnKVxuXG4gICAgdGhpcy5jcmVhdGVQcm9ncmFtRnJvbVNoYWRlcnMoXG4gICAgICB0aGlzLmNyZWF0ZVNoYWRlcignVkVSVEVYX1NIQURFUicsIHNoYWRlckNvZGVWZXJ0KSxcbiAgICAgIHRoaXMuY3JlYXRlU2hhZGVyKCdGUkFHTUVOVF9TSEFERVInLCBzaGFkZXJDb2RlRnJhZylcbiAgICApXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQodC+0LfQtNCw0LXRgiDRgdCy0Y/Qt9GMINC/0LXRgNC10LzQtdC90L3QvtC5INC/0YDQuNC70L7QttC10L3QuNGPINGBINC/0YDQvtCz0YDQsNC80LzQvtC5IFdlYkdsLlxuICAgKlxuICAgKiBAcmVtYXJrc1xuICAgKiDQn9C10YDQtdC80LXQvdC90YvQtSDRgdC+0YXRgNCw0L3Rj9GO0YLRgdGPINCyINCw0YHRgdC+0YbQuNCw0YLQuNCy0L3QvtC8INC80LDRgdGB0LjQstC1LCDQs9C00LUg0LrQu9GO0YfQuCAtINGN0YLQviDQvdCw0LfQstCw0L3QuNGPINC/0LXRgNC10LzQtdC90L3Ri9GFLiDQndCw0LfQstCw0L3QuNC1INC/0LXRgNC10LzQtdC90L3QvtC5INC00L7Qu9C20L3QvlxuICAgKiDQvdCw0YfQuNC90LDRgtGM0YHRjyDRgSDQv9GA0LXRhNC40LrRgdCwLCDQvtCx0L7Qt9C90LDRh9Cw0Y7RidC10LPQviDQtdC1IEdMU0wt0YLQuNC/LiDQn9GA0LXRhNC40LrRgSBcInVfXCIg0L7Qv9C40YHRi9Cy0LDQtdGCINC/0LXRgNC10LzQtdC90L3Rg9GOINGC0LjQv9CwIHVuaWZvcm0uINCf0YDQtdGE0LjQutGBIFwiYV9cIlxuICAgKiDQvtC/0LjRgdGL0LLQsNC10YIg0L/QtdGA0LXQvNC10L3QvdGD0Y4g0YLQuNC/0LAgYXR0cmlidXRlLlxuICAgKlxuICAgKiBAcGFyYW0gdmFyTmFtZSAtINCY0LzRjyDQv9C10YDQtdC80LXQvdC90L7QuSAo0YHRgtGA0L7QutCwKS5cbiAgICovXG4gIHB1YmxpYyBjcmVhdGVWYXJpYWJsZSh2YXJOYW1lOiBzdHJpbmcpOiB2b2lkIHtcblxuICAgIGNvbnN0IHZhclR5cGUgPSB2YXJOYW1lLnNsaWNlKDAsIDIpXG5cbiAgICBpZiAodmFyVHlwZSA9PT0gJ3VfJykge1xuICAgICAgdGhpcy52YXJpYWJsZXMuc2V0KHZhck5hbWUsIHRoaXMuZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHRoaXMuZ3B1UHJvZ3JhbSwgdmFyTmFtZSkpXG4gICAgfSBlbHNlIGlmICh2YXJUeXBlID09PSAnYV8nKSB7XG4gICAgICB0aGlzLnZhcmlhYmxlcy5zZXQodmFyTmFtZSwgdGhpcy5nbC5nZXRBdHRyaWJMb2NhdGlvbih0aGlzLmdwdVByb2dyYW0sIHZhck5hbWUpKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ9Cj0LrQsNC30LDQvSDQvdC10LLQtdGA0L3Ri9C5INGC0LjQvyAo0L/RgNC10YTQuNC60YEpINC/0LXRgNC10LzQtdC90L3QvtC5INGI0LXQudC00LXRgNCwOiAnICsgdmFyTmFtZSlcbiAgICB9XG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQodC+0LfQtNCw0LXRgiDRgdCy0Y/Qt9GMINC90LDQsdC+0YDQsCDQv9C10YDQtdC80LXQvdC90YvRhSDQv9GA0LjQu9C+0LbQtdC90LjRjyDRgSDQv9GA0L7Qs9GA0LDQvNC80L7QuSBXZWJHbC5cbiAgICpcbiAgICogQHJlbWFya3NcbiAgICog0JTQtdC70LDQtdGCINGC0L7QttC1INGB0LDQvNC+0LUsINGH0YLQviDQuCDQvNC10YLQvtC0IHtAbGluayBjcmVhdGVWYXJpYWJsZX0sINC90L4g0L/QvtC30LLQvtC70Y/QtdGCINC30LAg0L7QtNC40L0g0LLRi9C30L7QsiDRgdC+0LfQtNCw0YLRjCDRgdGA0LDQt9GDINC90LXRgdC60L7Qu9GM0LrQvlxuICAgKiDQv9C10YDQtdC80LXQvdC90YvRhS5cbiAgICpcbiAgICogQHBhcmFtIHZhck5hbWVzIC0g0J/QtdGA0LXRh9C40YHQu9C10L3QuNGPINC40LzQtdC9INC/0LXRgNC10LzQtdC90L3Ri9GFICjRgdGC0YDQvtC60LDQvNC4KS5cbiAgICovXG4gIHB1YmxpYyBjcmVhdGVWYXJpYWJsZXMoLi4udmFyTmFtZXM6IHN0cmluZ1tdKTogdm9pZCB7XG4gICAgdmFyTmFtZXMuZm9yRWFjaCh2YXJOYW1lID0+IHRoaXMuY3JlYXRlVmFyaWFibGUodmFyTmFtZSkpO1xuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0KHQvtC30LTQsNC10YIg0LIg0LPRgNGD0L/Qv9C1INCx0YPRhNC10YDQvtCyIFdlYkdMINC90L7QstGL0Lkg0LHRg9GE0LXRgCDQuCDQt9Cw0L/QuNGB0YvQstCw0LXRgiDQsiDQvdC10LPQviDQv9C10YDQtdC00LDQvdC90YvQtSDQtNCw0L3QvdGL0LUuXG4gICAqXG4gICAqIEByZW1hcmtzXG4gICAqINCa0L7Qu9C40YfQtdGB0YLQstC+INCz0YDRg9C/0L8g0LHRg9GE0LXRgNC+0LIg0Lgg0LrQvtC70LjRh9C10YHRgtCy0L4g0LHRg9GE0LXRgNC+0LIg0LIg0LrQsNC20LTQvtC5INCz0YDRg9C/0L/QtSDQvdC1INC+0LPRgNCw0L3QuNGH0LXQvdGLLiDQmtCw0LbQtNCw0Y8g0LPRgNGD0L/Qv9CwINC40LzQtdC10YIg0YHQstC+0LUg0L3QsNC30LLQsNC90LjQtSDQuFxuICAgKiBHTFNMLdGC0LjQvy4g0KLQuNC/INCz0YDRg9C/0L/RiyDQvtC/0YDQtdC00LXQu9GP0LXRgtGB0Y8g0LDQstGC0L7QvNCw0YLQuNGH0LXRgdC60Lgg0L3QsCDQvtGB0L3QvtCy0LUg0YLQuNC/0LAg0YLQuNC/0LjQt9C40YDQvtCy0LDQvdC90L7Qs9C+INC80LDRgdGB0LjQstCwLiDQn9GA0LDQstC40LvQsCDRgdC+0L7RgtCy0LXRgtGB0YLQstC40Y8g0YLQuNC/0L7QslxuICAgKiDQvtC/0YDQtdC00LXQu9GP0Y7RgtGB0Y8g0L/QtdGA0LXQvNC10L3QvdC+0Lkge0BsaW5rIGdsTnVtYmVyVHlwZXN9LlxuICAgKlxuICAgKiBAcGFyYW0gZ3JvdXBDb2RlIC0g0J3QsNC30LLQsNC90LjQtSDQs9GA0YPQv9C/0Ysg0LHRg9GE0LXRgNC+0LIsINCyINC60L7RgtC+0YDRg9GOINCx0YPQtNC10YIg0LTQvtCx0LDQstC70LXQvSDQvdC+0LLRi9C5INCx0YPRhNC10YAuXG4gICAqIEBwYXJhbSBkeCAtINCT0L7RgNC40LfQvtC90YLQsNC70YzQvdGL0Lkg0LjQvdC00LXQutGBINCx0YPRhNC10YDQvdC+0Lkg0LPRgNGD0L/Qv9GLLlxuICAgKiBAcGFyYW0gZHkgLSDQktC10YDRgtC40LrQsNC70YzQvdGL0Lkg0LjQvdC00LXQutGBINCx0YPRhNC10YDQvdC+0Lkg0LPRgNGD0L/Qv9GLLlxuICAgKiBAcGFyYW0gZGF0YSAtINCU0LDQvdC90YvQtSDQsiDQstC40LTQtSDRgtC40L/QuNC30LjRgNC+0LLQsNC90L3QvtCz0L4g0LzQsNGB0YHQuNCy0LAg0LTQu9GPINC30LDQv9C40YHQuCDQsiDRgdC+0LfQtNCw0LLQsNC10LzRi9C5INCx0YPRhNC10YAuXG4gICAqIEByZXR1cm5zINCe0LHRitC10Lwg0L/QsNC80Y/RgtC4LCDQt9Cw0L3Rj9GC0YvQuSDQvdC+0LLRi9C8INCx0YPRhNC10YDQvtC8ICjQsiDQsdCw0LnRgtCw0YUpLlxuICAgKi9cbiAgcHVibGljIGNyZWF0ZUJ1ZmZlcihkeDogbnVtYmVyLCBkeTogbnVtYmVyLCBncm91cENvZGU6IG51bWJlciwgZGF0YTogVHlwZWRBcnJheSk6IG51bWJlciB7XG5cbiAgICBjb25zdCBidWZmZXIgPSB0aGlzLmdsLmNyZWF0ZUJ1ZmZlcigpIVxuICAgIHRoaXMuZ2wuYmluZEJ1ZmZlcih0aGlzLmdsLkFSUkFZX0JVRkZFUiwgYnVmZmVyKVxuICAgIHRoaXMuZ2wuYnVmZmVyRGF0YSh0aGlzLmdsLkFSUkFZX0JVRkZFUiwgZGF0YSwgdGhpcy5nbC5TVEFUSUNfRFJBVylcblxuICAgIHRoaXMuZGF0YVtkeF1bZHldW2dyb3VwQ29kZV0gPSBidWZmZXJcblxuICAgIHRoaXMuZ3JvdXBUeXBlW2dyb3VwQ29kZV0gPSB0aGlzLmdsTnVtYmVyVHlwZXMuZ2V0KGRhdGEuY29uc3RydWN0b3IubmFtZSkhXG4gICAgLy9jb25zb2xlLmxvZygnQlVGRkVSX1NJWkUgPSAnLCB0aGlzLmdsLmdldEJ1ZmZlclBhcmFtZXRlcih0aGlzLmdsLkFSUkFZX0JVRkZFUiwgdGhpcy5nbC5CVUZGRVJfU0laRSkpO1xuXG4gICAgcmV0dXJuIGRhdGEubGVuZ3RoICogZGF0YS5CWVRFU19QRVJfRUxFTUVOVFxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0J/QtdGA0LXQtNCw0LXRgiDQt9C90LDRh9C10L3QuNC1INC80LDRgtGA0LjRhtGLIDMg0YUgMyDQsiDQv9GA0L7Qs9GA0LDQvNC80YMgV2ViR2wuXG4gICAqXG4gICAqIEBwYXJhbSB2YXJOYW1lIC0g0JjQvNGPINC/0LXRgNC10LzQtdC90L3QvtC5IFdlYkdMICjQuNC3INC80LDRgdGB0LjQstCwIHtAbGluayB2YXJpYWJsZXN9KSDQsiDQutC+0YLQvtGA0YPRjiDQsdGD0LTQtdGCINC30LDQv9C40YHQsNC90L4g0L/QtdGA0LXQtNCw0L3QvdC+0LUg0LfQvdCw0YfQtdC90LjQtS5cbiAgICogQHBhcmFtIHZhclZhbHVlIC0g0KPRgdGC0LDQvdCw0LLQu9C40LLQsNC10LzQvtC1INC30L3QsNGH0LXQvdC40LUg0LTQvtC70LbQvdC+INGP0LLQu9GP0YLRjNGB0Y8g0LzQsNGC0YDQuNGG0LXQuSDQstC10YnQtdGB0YLQstC10L3QvdGL0YUg0YfQuNGB0LXQuyDRgNCw0LfQvNC10YDQvtC8IDMg0YUgMywg0YDQsNC30LLQtdGA0L3Rg9GC0L7QuVxuICAgKiAgICAg0LIg0LLQuNC00LUg0L7QtNC90L7QvNC10YDQvdC+0LPQviDQvNCw0YHRgdC40LLQsCDQuNC3IDkg0Y3Qu9C10LzQtdC90YLQvtCyLlxuICAgKi9cbiAgcHVibGljIHNldFZhcmlhYmxlKHZhck5hbWU6IHN0cmluZywgdmFyVmFsdWU6IG51bWJlcltdKTogdm9pZCB7XG4gICAgdGhpcy5nbC51bmlmb3JtTWF0cml4M2Z2KHRoaXMudmFyaWFibGVzLmdldCh2YXJOYW1lKSwgZmFsc2UsIHZhclZhbHVlKVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JTQtdC70LDQtdGCINCx0YPRhNC10YAgV2ViR2wgXCLQsNC60YLQuNCy0L3Ri9C8XCIuXG4gICAqXG4gICAqIEBwYXJhbSBncm91cENvZGUgLSDQndCw0LfQstCw0L3QuNC1INCz0YDRg9C/0L/RiyDQsdGD0YTQtdGA0L7Qsiwg0LIg0LrQvtGC0L7RgNC+0Lwg0YXRgNCw0L3QuNGC0YHRjyDQvdC10L7QsdGF0L7QtNC40LzRi9C5INCx0YPRhNC10YAuXG4gICAqIEBwYXJhbSBkeCAtINCT0L7RgNC40LfQvtC90YLQsNC70YzQvdGL0Lkg0LjQvdC00LXQutGBINCx0YPRhNC10YDQvdC+0Lkg0LPRgNGD0L/Qv9GLLlxuICAgKiBAcGFyYW0gZHkgLSDQktC10YDRgtC40LrQsNC70YzQvdGL0Lkg0LjQvdC00LXQutGBINCx0YPRhNC10YDQvdC+0Lkg0LPRgNGD0L/Qv9GLLlxuICAgKiBAcGFyYW0gdmFyTmFtZSAtINCY0LzRjyDQv9C10YDQtdC80LXQvdC90L7QuSAo0LjQtyDQvNCw0YHRgdC40LLQsCB7QGxpbmsgdmFyaWFibGVzfSksINGBINC60L7RgtC+0YDQvtC5INCx0YPQtNC10YIg0YHQstGP0LfQsNC9INCx0YPRhNC10YAuXG4gICAqIEBwYXJhbSBzaXplIC0g0JrQvtC70LjRh9C10YHRgtCy0L4g0Y3Qu9C10LzQtdC90YLQvtCyINCyINCx0YPRhNC10YDQtSwg0YHQvtC+0YLQstC10YLRgdGC0LLRg9GO0YnQuNGFINC+0LTQvdC+0LkgwqBHTC3QstC10YDRiNC40L3QtS5cbiAgICogQHBhcmFtIHN0cmlkZSAtINCg0LDQt9C80LXRgCDRiNCw0LPQsCDQvtCx0YDQsNCx0L7RgtC60Lgg0Y3Qu9C10LzQtdC90YLQvtCyINCx0YPRhNC10YDQsCAo0LfQvdCw0YfQtdC90LjQtSAwINC30LDQtNCw0LXRgiDRgNCw0LfQvNC10YnQtdC90LjQtSDRjdC70LXQvNC10L3RgtC+0LIg0LTRgNGD0LMg0LfQsCDQtNGA0YPQs9C+0LwpLlxuICAgKiBAcGFyYW0gb2Zmc2V0IC0g0KHQvNC10YnQtdC90LjQtSDQvtGC0L3QvtGB0LjRgtC10LvRjNC90L4g0L3QsNGH0LDQu9CwINCx0YPRhNC10YDQsCwg0L3QsNGH0LjQvdCw0Y8g0YEg0LrQvtGC0L7RgNC+0LPQviDQsdGD0LTQtdGCINC/0YDQvtC40YHRhdC+0LTQuNGC0Ywg0L7QsdGA0LDQsdC+0YLQutCwINGN0LvQtdC80LXQvdGC0L7Qsi5cbiAgICovXG4gIHB1YmxpYyBzZXRCdWZmZXIoZHg6IG51bWJlciwgZHk6IG51bWJlciwgZ3JvdXBDb2RlOiBudW1iZXIsIHZhck5hbWU6IHN0cmluZywgc2l6ZTogbnVtYmVyLCBzdHJpZGU6IG51bWJlciwgb2Zmc2V0OiBudW1iZXIpOiB2b2lkIHtcblxuICAgIGNvbnN0IHZhcmlhYmxlID0gdGhpcy52YXJpYWJsZXMuZ2V0KHZhck5hbWUpXG5cbiAgICB0aGlzLmdsLmJpbmRCdWZmZXIodGhpcy5nbC5BUlJBWV9CVUZGRVIsIHRoaXMuZGF0YVtkeF1bZHldW2dyb3VwQ29kZV0pXG4gICAgdGhpcy5nbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheSh2YXJpYWJsZSlcbiAgICB0aGlzLmdsLnZlcnRleEF0dHJpYlBvaW50ZXIodmFyaWFibGUsIHNpemUsIHRoaXMuZ3JvdXBUeXBlW2dyb3VwQ29kZV0sIGZhbHNlLCBzdHJpZGUsIG9mZnNldClcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCS0YvQv9C+0LvQvdGP0LXRgiDQvtGC0YDQuNGB0L7QstC60YMg0LrQvtC90YLQtdC60YHRgtCwINGA0LXQvdC00LXRgNC40L3Qs9CwIFdlYkdMINC80LXRgtC+0LTQvtC8INC/0YDQuNC80LjRgtC40LLQvdGL0YUg0YLQvtGH0LXQui5cbiAgICpcbiAgICogQHBhcmFtIGZpcnN0IC0g0JjQvdC00LXQutGBIEdMLdCy0LXRgNGI0LjQvdGLLCDRgSDQutC+0YLQvtGA0L7QuSDQvdCw0YfQvdC10YLRjyDQvtGC0YDQuNGB0L7QstC60LAuXG4gICAqIEBwYXJhbSBjb3VudCAtINCa0L7Qu9C40YfQtdGB0YLQstC+INC+0YDQuNGB0L7QstGL0LLQsNC10LzRi9GFIEdMLdCy0LXRgNGI0LjQvS5cbiAgICovXG4gIHB1YmxpYyBkcmF3UG9pbnRzKGZpcnN0OiBudW1iZXIsIGNvdW50OiBudW1iZXIpOiB2b2lkIHtcbiAgICB0aGlzLmdsLmRyYXdBcnJheXModGhpcy5nbC5QT0lOVFMsIGZpcnN0LCBjb3VudClcbiAgfVxufVxuIiwiaW1wb3J0IHsgY29weU1hdGNoaW5nS2V5VmFsdWVzIH0gZnJvbSAnQC91dGlscydcbmltcG9ydCBTUGxvdENvbnRvbCBmcm9tICdAL3NwbG90LWNvbnRyb2wnXG5pbXBvcnQgU1Bsb3RXZWJHbCBmcm9tICdAL3NwbG90LXdlYmdsJ1xuaW1wb3J0IFNQbG90RGVidWcgZnJvbSAnQC9zcGxvdC1kZWJ1ZydcbmltcG9ydCBTUGxvdERlbW8gZnJvbSAnQC9zcGxvdC1kZW1vJ1xuaW1wb3J0IFNQbG90R2xzbCBmcm9tICdAL3NwbG90LWdsc2wnXG5cbi8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKlxuICog0JrQu9Cw0YHRgSBTUGxvdCAtINGA0LXQsNC70LjQt9GD0LXRgiDQs9GA0LDRhNC40Log0YLQuNC/0LAg0YHQutCw0YLRgtC10YDQv9C70L7RgiDRgdGA0LXQtNGB0YLQstCw0LzQuCBXZWJHTC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU1Bsb3Qge1xuXG4gIC8qKiDQpNGD0L3QutGG0LjRjyDQuNGC0LXRgNC40YDQvtCy0LDQvdC40Y8g0LjRgdGF0L7QtNC90YvRhSDQtNCw0L3QvdGL0YUuICovXG4gIHB1YmxpYyBpdGVyYXRvcjogU1Bsb3RJdGVyYXRvciA9IHVuZGVmaW5lZFxuXG4gIC8qKiDQlNCw0L3QvdGL0LUg0L7QsSDQvtCx0YrQtdC60YLQsNGFINCz0YDQsNGE0LjQutCwLiAqL1xuICBwdWJsaWMgZGF0YTogU1Bsb3RPYmplY3RbXSB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZFxuXG4gIC8qKiDQpdC10LvQv9C10YAg0YDQtdC20LjQvNCwINC+0YLQu9Cw0LTQutC4LiAqL1xuICBwdWJsaWMgZGVidWc6IFNQbG90RGVidWcgPSBuZXcgU1Bsb3REZWJ1Zyh0aGlzKVxuXG4gIC8qKiDQpdC10LvQv9C10YAsINGD0L/RgNCw0LLQu9GP0Y7RidC40LkgR0xTTC3QutC+0LTQvtC8INGI0LXQudC00LXRgNC+0LIuICovXG4gIHB1YmxpYyBnbHNsOiBTUGxvdEdsc2wgPSBuZXcgU1Bsb3RHbHNsKHRoaXMpXG5cbiAgLyoqINCl0LXQu9C/0LXRgCBXZWJHTC4gKi9cbiAgcHVibGljIHdlYmdsOiBTUGxvdFdlYkdsID0gbmV3IFNQbG90V2ViR2wodGhpcylcblxuICAvKiog0KXQtdC70L/QtdGAINGA0LXQttC40LzQsCDQtNC10LzQvi3QtNCw0L3QvdGL0YUuICovXG4gIHB1YmxpYyBkZW1vOiBTUGxvdERlbW8gPSBuZXcgU1Bsb3REZW1vKHRoaXMpXG5cbiAgLyoqINCf0YDQuNC30L3QsNC6INGE0L7RgNGB0LjRgNC+0LLQsNC90L3QvtCz0L4g0LfQsNC/0YPRgdC60LAg0YDQtdC90LTQtdGA0LAuICovXG4gIHB1YmxpYyBmb3JjZVJ1bjogYm9vbGVhbiA9IGZhbHNlXG5cbiAgLyoqINCe0LPRgNCw0L3QuNGH0LXQvdC40LUg0LrQvtC7LdCy0LAg0L7QsdGK0LXQutGC0L7QsiDQvdCwINCz0YDQsNGE0LjQutC1LiAqL1xuICBwdWJsaWMgZ2xvYmFsTGltaXQ6IG51bWJlciA9IDFfMDAwXzAwMF8wMDBcblxuICAvKiog0J7Qs9GA0LDQvdC40YfQtdC90LjQtSDQutC+0Lst0LLQsCDQvtCx0YrQtdC60YLQvtCyINCyINCz0YDRg9C/0L/QtS4gKi9cbiAgcHVibGljIGdyb3VwTGltaXQ6IG51bWJlciA9IDEwXzAwMFxuXG4gIC8qKiDQptCy0LXRgtC+0LLQsNGPINC/0LDQu9C40YLRgNCwINC+0LHRitC10LrRgtC+0LIuICovXG4gIHB1YmxpYyBjb2xvcnM6IHN0cmluZ1tdID0gW11cblxuICAvKiog0J/QsNGA0LDQvNC10YLRgNGLINC60L7QvtGA0LTQuNC90LDRgtC90L7QuSDQv9C70L7RgdC60L7RgdGC0LguICovXG4gIHB1YmxpYyBncmlkOiBTUGxvdEdyaWQgPSB7XG4gICAgYmdDb2xvcjogJyNmZmZmZmYnLFxuICAgIHJ1bGVzQ29sb3I6ICcjYzBjMGMwJ1xuICB9XG5cbiAgLyoqINCf0LDRgNCw0LzQtdGC0YDRiyDQvtCx0LvQsNGB0YLQuCDQv9GA0L7RgdC80L7RgtGA0LAuICovXG4gIHB1YmxpYyBjYW1lcmE6IFNQbG90Q2FtZXJhID0ge1xuICAgIHg6IDAsXG4gICAgeTogMCxcbiAgICB6b29tOiAxLFxuICAgIG1pblpvb206IDEsXG4gICAgbWF4Wm9vbTogMTBfMDAwXzAwMFxuICB9XG5cbiAgLyoqINCf0YDQuNC30L3QsNC6INC90LXQvtCx0YXQvtC00LjQvNC+0YHRgtC4INC30LDQs9GA0YPQt9C60Lgg0LTQsNC90L3Ri9GFINC+0LEg0L7QsdGK0LXQutGC0LDRhS4gKi9cbiAgcHVibGljIGxvYWREYXRhOiBib29sZWFuID0gdHJ1ZVxuXG4gIC8qKiDQn9GA0LjQt9C90LDQuiDQvdC10L7QsdGF0L7QtNC40LzQvtGB0YLQuCDQsdC10LfQvtGC0LvQsNCz0LDRgtC10LvRjNC90L7Qs9C+INC30LDQv9GD0YHQutCwINGA0LXQvdC00LXRgNCwLiAqL1xuICBwdWJsaWMgaXNSdW5uaW5nOiBib29sZWFuID0gZmFsc2VcblxuICAvKiog0JrQvtC70LjRh9C10YHRgtCy0L4g0YDQsNC30LvQuNGH0L3Ri9GFINGE0L7RgNC8INC+0LHRitC10LrRgtC+0LIuINCS0YvRh9C40YHQu9GP0LXRgtGB0Y8g0L/QvtC30LbQtSDQsiDRhdC10LvQv9C10YDQtSBnbHNsLiAqL1xuICBwdWJsaWMgc2hhcGVzQ291bnQ6IG51bWJlciB8IHVuZGVmaW5lZFxuXG4gIC8qKiDQodGC0LDRgtC40YHRgtC40YfQtdGB0LrQsNGPINC40L3RhNC+0YDQvNCw0YbQuNGPLiAqL1xuICBwdWJsaWMgc3RhdHMgPSB7XG4gICAgb2JqVG90YWxDb3VudDogMCxcbiAgICBncm91cHNDb3VudDogMCxcbiAgICBtZW1Vc2FnZTogMCxcbiAgICBtaW5PYmplY3RTaXplOiAxXzAwMF8wMDAsXG4gICAgbWF4T2JqZWN0U2l6ZTogMCxcbiAgfVxuXG4gIC8qKiDQntCx0YrQtdC60YIt0LrQsNC90LLQsNGBINC60L7QvdGC0LXQutGB0YLQsCDRgNC10L3QtNC10YDQuNC90LPQsCBXZWJHTC4gKi9cbiAgcHVibGljIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnRcblxuICAvKiog0J3QsNGB0YLRgNC+0LnQutC4LCDQt9Cw0L/RgNC+0YjQtdC90L3Ri9C1INC/0L7Qu9GM0LfQvtCy0LDRgtC10LvQtdC8INCyINC60L7QvdGB0YLRgNGD0LrRgtC+0YDQtSDQuNC70Lgg0L/RgNC4INC/0L7RgdC70LXQtNC90LXQvCDQstGL0LfQvtCy0LUgc2V0dXAuICovXG4gIHB1YmxpYyBsYXN0UmVxdWVzdGVkT3B0aW9uczogU1Bsb3RPcHRpb25zIHwgdW5kZWZpbmVkID0ge31cblxuICAvKiog0KXQtdC70L/QtdGAINCy0LfQsNC40LzQvtC00LXQudGB0YLQstC40Y8g0YEg0YPRgdGC0YDQvtC50YHRgtCy0L7QvCDQstCy0L7QtNCwLiAqL1xuICBwcm90ZWN0ZWQgY29udHJvbDogU1Bsb3RDb250b2wgPSBuZXcgU1Bsb3RDb250b2wodGhpcylcblxuICAvKiog0J/RgNC40LfQvdCw0Log0YLQvtCz0L4sINGH0YLQviDRjdC60LfQtdC80L/Qu9GP0YAg0LrQu9Cw0YHRgdCwINCx0YvQuyDQutC+0YDRgNC10LrRgtC90L4g0L/QvtC00LPQvtGC0L7QstC70LXQvSDQuiDRgNC10L3QtNC10YDRgy4gKi9cbiAgcHJpdmF0ZSBpc1NldHVwZWQ6IGJvb2xlYW4gPSBmYWxzZVxuXG4gIC8qKiDQn9C10YDQtdC80LXQvdC90LDRjyDQtNC70Y8g0L/QtdGA0LXQsdC+0YDQsCDQuNC90LTQtdC60YHQvtCyINC80LDRgdGB0LjQstCwINC00LDQvdC90YvRhSBkYXRhLiAqL1xuICBwcml2YXRlIGFycmF5SW5kZXg6IG51bWJlciA9IDBcblxuICBwdWJsaWMgYXJlYSA9IHtcbiAgICBncm91cHM6IFtdIGFzIGFueVtdLFxuICAgIHN0ZXA6IDAsXG4gICAgY291bnQ6IDAsXG4gICAgZHhWaXNpYmxlRnJvbTogMCxcbiAgICBkeFZpc2libGVUbzogMCxcbiAgICBkeVZpc2libGVGcm9tOiAwLFxuICAgIGR5VmlzaWJsZVRvOiAwLFxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0KHQvtC30LTQsNC10YIg0Y3QutC30LXQvNC/0LvRj9GAINC60LvQsNGB0YHQsCwg0LjQvdC40YbQuNCw0LvQuNC30LjRgNGD0LXRgiDQvdCw0YHRgtGA0L7QudC60LggKNC10YHQu9C4INC/0LXRgNC10LTQsNC90YspLlxuICAgKlxuICAgKiBAcmVtYXJrc1xuICAgKiDQldGB0LvQuCDQutCw0L3QstCw0YEg0YEg0LfQsNC00LDQvdC90YvQvCDQuNC00LXQvdGC0LjRhNC40LrQsNGC0L7RgNC+0Lwg0L3QtSDQvdCw0LnQtNC10L0gLSDQs9C10L3QtdGA0LjRgNGD0LXRgtGB0Y8g0L7RiNC40LHQutCwLiDQndCw0YHRgtGA0L7QudC60Lgg0LzQvtCz0YPRgiDQsdGL0YLRjCDQt9Cw0LTQsNC90Ysg0LrQsNC6INCyXG4gICAqINC60L7QvdGB0YLRgNGD0LrRgtC+0YDQtSwg0YLQsNC6INC4INCyINC80LXRgtC+0LTQtSB7QGxpbmsgc2V0dXB9LiDQkiDQu9GO0LHQvtC8INGB0LvRg9GH0LDQtSDQvdCw0YHRgtGA0L7QudC60Lgg0LTQvtC70LbQvdGLINCx0YvRgtGMINC30LDQtNCw0L3RiyDQtNC+INC30LDQv9GD0YHQutCwINGA0LXQvdC00LXRgNCwLlxuICAgKlxuICAgKiBAcGFyYW0gY2FudmFzSWQgLSDQmNC00LXQvdGC0LjRhNC40LrQsNGC0L7RgCDQutCw0L3QstCw0YHQsCwg0L3QsCDQutC+0YLQvtGA0L7QvCDQsdGD0LTQtdGCINGA0LjRgdC+0LLQsNGC0YzRgdGPINCz0YDQsNGE0LjQui5cbiAgICogQHBhcmFtIG9wdGlvbnMgLSDQn9C+0LvRjNC30L7QstCw0YLQtdC70YzRgdC60LjQtSDQvdCw0YHRgtGA0L7QudC60Lgg0Y3QutC30LXQvNC/0LvRj9GA0LAuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihjYW52YXNJZDogc3RyaW5nLCBvcHRpb25zPzogU1Bsb3RPcHRpb25zKSB7XG5cbiAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY2FudmFzSWQpKSB7XG4gICAgICB0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNhbnZhc0lkKSBhcyBIVE1MQ2FudmFzRWxlbWVudFxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ9Ca0LDQvdCy0LDRgSDRgSDQuNC00LXQvdGC0LjRhNC40LrQsNGC0L7RgNC+0LwgXCIjJyArIGNhbnZhc0lkICsgJ1wiINC90LUg0L3QsNC50LTQtdC9IScpXG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMpIHtcblxuICAgICAgLyoqINCV0YHQu9C4INC/0LXRgNC10LTQsNC90Ysg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GM0YHQutC40LUg0L3QsNGB0YLRgNC+0LnQutC4LCDRgtC+INC+0L3QuCDQv9GA0LjQvNC10L3Rj9GO0YLRgdGPLiAqL1xuICAgICAgY29weU1hdGNoaW5nS2V5VmFsdWVzKHRoaXMsIG9wdGlvbnMpXG4gICAgICB0aGlzLmxhc3RSZXF1ZXN0ZWRPcHRpb25zID0gb3B0aW9uc1xuXG4gICAgICAvKiog0JjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y8g0LLRgdC10YUg0L/QsNGA0LDQvNC10YLRgNC+0LIg0YDQtdC90LTQtdGA0LAsINC10YHQu9C4INC30LDQv9GA0L7RiNC10L0g0YTQvtGA0YHQuNGA0L7QstCw0L3QvdGL0Lkg0LfQsNC/0YPRgdC6LiAqL1xuICAgICAgaWYgKHRoaXMuZm9yY2VSdW4pIHtcbiAgICAgICAgdGhpcy5zZXR1cChvcHRpb25zKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCY0L3QuNGG0LjQsNC70LjQt9C40YDRg9C10YIg0L3QtdC+0LHRhdC+0LTQuNC80YvQtSDQtNC70Y8g0YDQtdC90LTQtdGA0LAg0L/QsNGA0LDQvNC10YLRgNGLINGN0LrQt9C10LzQv9C70Y/RgNCwLCDQstGL0L/QvtC70L3Rj9C10YIg0L/QvtC00LPQvtGC0L7QstC60YMg0Lgg0LfQsNC/0L7Qu9C90LXQvdC40LUg0LHRg9GE0LXRgNC+0LIgV2ViR0wuXG4gICAqXG4gICAqIEBwYXJhbSBvcHRpb25zIC0g0J3QsNGB0YLRgNC+0LnQutC4INGN0LrQt9C10LzQv9C70Y/RgNCwLlxuICAgKi9cbiAgcHVibGljIHNldHVwKG9wdGlvbnM/OiBTUGxvdE9wdGlvbnMpOiB2b2lkIHtcblxuICAgIGlmICghb3B0aW9ucykgb3B0aW9ucyA9IHt9XG5cbiAgICAvKiog0J/RgNC40LzQtdC90LXQvdC40LUg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GM0YHQutC40YUg0L3QsNGB0YLRgNC+0LXQui4gKi9cbiAgICBjb3B5TWF0Y2hpbmdLZXlWYWx1ZXModGhpcywgb3B0aW9ucylcbiAgICB0aGlzLmxhc3RSZXF1ZXN0ZWRPcHRpb25zID0gb3B0aW9uc1xuXG4gICAgdGhpcy5kZWJ1Zy5sb2coJ2ludHJvJylcblxuICAgIGlmIChvcHRpb25zLmRhdGEpIHtcbiAgICAgIHRoaXMuaXRlcmF0b3IgPSB0aGlzLmFycmF5SXRlcmF0b3JcbiAgICAgIHRoaXMuYXJyYXlJbmRleCA9IDBcbiAgICB9XG5cbiAgICAvKiog0J/QvtC00LPQvtGC0L7QstC60LAg0LLRgdC10YUg0YXQtdC70L/QtdGA0L7Qsi4g0J/QvtGB0LvQtdC00L7QstCw0YLQtdC70YzQvdC+0YHRgtGMINC/0L7QtNCz0L7RgtC+0LLQutC4INC40LzQtdC10YIg0LfQvdCw0YfQtdC90LjQtS4gKi9cbiAgICB0aGlzLmRlYnVnLnNldHVwKClcbiAgICB0aGlzLmdsc2wuc2V0dXAoKVxuICAgIHRoaXMud2ViZ2wuc2V0dXAoKVxuICAgIHRoaXMuY29udHJvbC5zZXR1cCgpXG4gICAgdGhpcy5kZW1vLnNldHVwKClcblxuICAgIHRoaXMuZGVidWcubG9nKCdpbnN0YW5jZScpXG5cbiAgICAvKiog0J7QsdGA0LDQsdC+0YLQutCwINCy0YHQtdGFINC00LDQvdC90YvRhSDQvtCxINC+0LHRitC10LrRgtCw0YUg0Lgg0LjRhSDQt9Cw0LPRgNGD0LfQutCwINCyINCx0YPRhNC10YDRiyDQstC40LTQtdC+0L/QsNC80Y/RgtC4LiAqL1xuICAgIGlmICh0aGlzLmxvYWREYXRhKSB7XG4gICAgICB0aGlzLmxvYWQoKVxuXG4gICAgICAvKiog0J/QviDRg9C80L7Qu9GH0LDQvdC40Y4g0L/RgNC4INC/0L7QstGC0L7RgNC90L7QvCDQstGL0LfQvtCy0LUg0LzQtdGC0L7QtNCwIHNldHVwINC90L7QstC+0LUg0YfRgtC10L3QuNC1INC+0LHRitC10LrRgtC+0LIg0L3QtSDQv9GA0L7QuNC30LLQvtC00LjRgtGB0Y8uICovXG4gICAgICB0aGlzLmxvYWREYXRhID0gZmFsc2VcbiAgICB9XG5cbiAgICB0aGlzLmNhbWVyYS56b29tID0gTWF0aC5taW4odGhpcy5jYW52YXMud2lkdGgsIHRoaXMuY2FudmFzLmhlaWdodCkgLSB0aGlzLnN0YXRzLm1heE9iamVjdFNpemVcbiAgICB0aGlzLmNhbWVyYS54ID0gMC41IC0gdGhpcy5jYW52YXMud2lkdGggLyAoMiAqIHRoaXMuY2FtZXJhLnpvb20pXG4gICAgdGhpcy5jYW1lcmEueSA9IDAuNVxuXG4gICAgLyoqINCU0LXQudGB0YLQstC40Y8sINC60L7RgtC+0YDRi9C1INCy0YvQv9C+0LvQvdGP0Y7RgtGB0Y8g0YLQvtC70YzQutC+INC/0YDQuCDQv9C10YDQstC+0Lwg0LLRi9C30L7QstC1INC80LXRgtC+0LTQsCBzZXR1cC4gKi9cbiAgICBpZiAoIXRoaXMuaXNTZXR1cGVkKSB7XG5cbiAgICAgIC8qKiDQodC+0LfQtNCw0L3QuNC1INC/0LXRgNC10LzQtdC90L3Ri9GFIFdlYkdsLiAqL1xuICAgICAgdGhpcy53ZWJnbC5jcmVhdGVWYXJpYWJsZXMoJ2FfcG9zaXRpb24nLCAnYV9jb2xvcicsICdhX3NpemUnLCAnYV9zaGFwZScsICd1X21hdHJpeCcpXG5cbiAgICAgIC8qKiDQn9GA0LjQt9C90LDQuiDRgtC+0LPQviwg0YfRgtC+INGN0LrQt9C10LzQv9C70Y/RgCDQutCw0Log0LzQuNC90LjQvNGD0Lwg0L7QtNC40L0g0YDQsNC3INCy0YvQv9C+0LvQvdC40Lsg0LzQtdGC0L7QtCBzZXR1cC4gKi9cbiAgICAgIHRoaXMuaXNTZXR1cGVkID0gdHJ1ZVxuICAgIH1cblxuICAgIC8qKiDQn9GA0L7QstC10YDQutCwINC60L7RgNGA0LXQutGC0L3QvtGB0YLQuCDQvdCw0YHRgtGA0L7QudC60Lgg0Y3QutC30LXQvNC/0LvRj9GA0LAuICovXG4gICAgdGhpcy5jaGVja1NldHVwKClcblxuICAgIGlmICh0aGlzLmZvcmNlUnVuKSB7XG4gICAgICAvKiog0KTQvtGA0YHQuNGA0L7QstCw0L3QvdGL0Lkg0LfQsNC/0YPRgdC6INGA0LXQvdC00LXRgNC40L3Qs9CwICjQtdGB0LvQuCDRgtGA0LXQsdGD0LXRgtGB0Y8pLiAqL1xuICAgICAgdGhpcy5ydW4oKVxuICAgIH1cbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCh0L7Qt9C00LDQtdGCINC4INC30LDQv9C+0LvQvdGP0LXRgiDQtNCw0L3QvdGL0LzQuCDQvtCx0L4g0LLRgdC10YUg0L7QsdGK0LXQutGC0LDRhSDQsdGD0YTQtdGA0YsgV2ViR0wuXG4gICAqL1xuICBwcm90ZWN0ZWQgbG9hZCgpOiB2b2lkIHtcblxuICAgIHRoaXMuZGVidWcubG9nKCdsb2FkaW5nJylcblxuICAgIHRoaXMuc3RhdHMgPSB7IG9ialRvdGFsQ291bnQ6IDAsIGdyb3Vwc0NvdW50OiAwLCBtZW1Vc2FnZTogMCwgbWluT2JqZWN0U2l6ZTogMV8wMDBfMDAwLCBtYXhPYmplY3RTaXplOiAwIH1cblxuICAgIGxldCBkeCwgZHkgPSAwXG4gICAgbGV0IG9iamVjdDogU1Bsb3RPYmplY3QgfCBudWxsXG4gICAgbGV0IGlzT2JqZWN0RW5kczogYm9vbGVhbiA9IGZhbHNlXG5cbiAgICB0aGlzLmFyZWEuc3RlcCA9IDAuMDJcbiAgICB0aGlzLmFyZWEuY291bnQgPSBNYXRoLnRydW5jKDEgLyB0aGlzLmFyZWEuc3RlcCkgKyAxXG5cbiAgICBsZXQgZ3JvdXBzOiBhbnlbXSA9IFtdXG5cbiAgICBmb3IgKGxldCBkeCA9IDA7IGR4IDwgdGhpcy5hcmVhLmNvdW50OyBkeCsrKSB7XG4gICAgICBncm91cHNbZHhdID0gW11cbiAgICAgIGZvciAobGV0IGR5ID0gMDsgZHkgPCB0aGlzLmFyZWEuY291bnQ7IGR5KyspIHtcbiAgICAgICAgZ3JvdXBzW2R4XVtkeV0gPSBbXVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDQ7IGkrKykgeyBncm91cHNbZHhdW2R5XVtpXSA9IFtdIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB3aGlsZSAoIWlzT2JqZWN0RW5kcykge1xuXG4gICAgICBvYmplY3QgPSB0aGlzLml0ZXJhdG9yISgpXG5cbiAgICAgIC8qKiDQntCx0YrQtdC60YLRiyDQt9Cw0LrQvtC90YfQuNC70LjRgdGMLCDQtdGB0LvQuCDQuNGC0LXRgNCw0YLQvtGAINCy0LXRgNC90YPQuyBudWxsINC40LvQuCDQtdGB0LvQuCDQtNC+0YHRgtC40LPQvdGD0YIg0LvQuNC80LjRgiDRh9C40YHQu9CwINC+0LHRitC10LrRgtC+0LIuICovXG4gICAgICBpc09iamVjdEVuZHMgPSAob2JqZWN0ID09PSBudWxsKSB8fCAodGhpcy5zdGF0cy5vYmpUb3RhbENvdW50ID49IHRoaXMuZ2xvYmFsTGltaXQpXG5cbiAgICAgIGlmICghaXNPYmplY3RFbmRzKSB7XG5cbiAgICAgICAgb2JqZWN0ID0gdGhpcy5jaGVja09iamVjdChvYmplY3QhKVxuXG4gICAgICAgIGR4ID0gTWF0aC50cnVuYyhvYmplY3QueCAvIHRoaXMuYXJlYS5zdGVwKVxuICAgICAgICBkeSA9IE1hdGgudHJ1bmMob2JqZWN0LnkgLyB0aGlzLmFyZWEuc3RlcClcblxuICAgICAgICBncm91cHNbZHhdW2R5XVswXS5wdXNoKG9iamVjdC54LCBvYmplY3QueSlcbiAgICAgICAgZ3JvdXBzW2R4XVtkeV1bMV0ucHVzaChvYmplY3Quc2hhcGUpXG4gICAgICAgIGdyb3Vwc1tkeF1bZHldWzJdLnB1c2gob2JqZWN0LmNvbG9yKVxuICAgICAgICBncm91cHNbZHhdW2R5XVszXS5wdXNoKG9iamVjdC5zaXplKVxuXG4gICAgICAgIGlmIChvYmplY3Quc2l6ZSA+IHRoaXMuc3RhdHMubWF4T2JqZWN0U2l6ZSkge1xuICAgICAgICAgIHRoaXMuc3RhdHMubWF4T2JqZWN0U2l6ZSA9IG9iamVjdC5zaXplXG4gICAgICAgIH1cblxuICAgICAgICBpZiAob2JqZWN0LnNpemUgPCB0aGlzLnN0YXRzLm1pbk9iamVjdFNpemUpIHtcbiAgICAgICAgICB0aGlzLnN0YXRzLm1pbk9iamVjdFNpemUgPSBvYmplY3Quc2l6ZVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zdGF0cy5vYmpUb3RhbENvdW50KytcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmFyZWEuZ3JvdXBzID0gZ3JvdXBzXG5cbiAgICB0aGlzLndlYmdsLmNsZWFyRGF0YSgpXG5cbiAgICAvKiog0JjRgtC10YDQuNGA0L7QstCw0L3QuNC1INC4INC30LDQvdC10YHQtdC90LjQtSDQtNCw0L3QvdGL0YUg0LIg0LHRg9GE0LXRgNGLIFdlYkdMLiAqL1xuICAgIGZvciAobGV0IGR4ID0gMDsgZHggPCB0aGlzLmFyZWEuY291bnQ7IGR4KyspIHtcbiAgICAgIGZvciAobGV0IGR5ID0gMDsgZHkgPCB0aGlzLmFyZWEuY291bnQ7IGR5KyspIHtcbiAgICAgICAgaWYgKGdyb3Vwc1tkeF1bZHldWzFdLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICB0aGlzLnN0YXRzLm1lbVVzYWdlICs9XG4gICAgICAgICAgICB0aGlzLndlYmdsLmNyZWF0ZUJ1ZmZlcihkeCwgZHksIDAsIG5ldyBGbG9hdDMyQXJyYXkoZ3JvdXBzW2R4XVtkeV1bMF0pKSArXG4gICAgICAgICAgICB0aGlzLndlYmdsLmNyZWF0ZUJ1ZmZlcihkeCwgZHksIDEsIG5ldyBVaW50OEFycmF5KGdyb3Vwc1tkeF1bZHldWzFdKSkgK1xuICAgICAgICAgICAgdGhpcy53ZWJnbC5jcmVhdGVCdWZmZXIoZHgsIGR5LCAyLCBuZXcgVWludDhBcnJheShncm91cHNbZHhdW2R5XVsyXSkpICtcbiAgICAgICAgICAgIHRoaXMud2ViZ2wuY3JlYXRlQnVmZmVyKGR4LCBkeSwgMywgbmV3IFVpbnQ4QXJyYXkoZ3JvdXBzW2R4XVtkeV1bM10pKVxuXG4gICAgICAgICAgdGhpcy5zdGF0cy5ncm91cHNDb3VudCArPSA0XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmRlYnVnLmxvZygnbG9hZGVkJylcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCf0YDQvtCy0LXRgNGP0LXRgiDQutC+0YDRgNC10LrRgtC90L7RgdGC0Ywg0L/QsNGA0LDQvNC10YLRgNC+0LIg0L7QsdGK0LXQutGC0LAg0Lgg0LIg0YHQu9GD0YfQsNC1INC90LXQvtCx0YXQvtC00LjQvNC+0YHRgtC4INCy0L3QvtGB0LjRgiDQsiDQvdC40YUg0LjQt9C80LXQvdC10L3QuNGPLlxuICAgKi9cbiAgY2hlY2tPYmplY3Qob2JqZWN0OiBTUGxvdE9iamVjdCk6IFNQbG90T2JqZWN0IHtcblxuICAgIC8qKiDQn9GA0L7QstC10YDQutCwINC60L7RgNGA0LXQutGC0L3QvtGB0YLQuCDRgNCw0YHQv9C+0LvQvtC20LXQvdC40Y8g0L7QsdGK0LXQutGC0LAuICovXG4gICAgaWYgKG9iamVjdC54ID4gMSkge1xuICAgICAgb2JqZWN0LnggPSAxXG4gICAgfSBlbHNlIGlmIChvYmplY3QueCA8IDApIHtcbiAgICAgIG9iamVjdC54ID0gMFxuICAgIH1cblxuICAgIGlmIChvYmplY3QueSA+IDEpIHtcbiAgICAgIG9iamVjdC55ID0gMVxuICAgIH0gZWxzZSBpZiAob2JqZWN0LnkgPCAwKSB7XG4gICAgICBvYmplY3QueSA9IDBcbiAgICB9XG5cbiAgICAvKiog0J/RgNC+0LLQtdGA0LrQsCDQutC+0YDRgNC10LrRgtC90L7RgdGC0Lgg0YTQvtGA0LzRiyDQuCDRhtCy0LXRgtCwINC+0LHRitC10LrRgtCwINC+0LHRitC10LrRgtCwLiAqL1xuICAgIGlmICgob2JqZWN0LnNoYXBlID49IHRoaXMuc2hhcGVzQ291bnQhKSB8fCAob2JqZWN0LnNoYXBlIDwgMCkpIG9iamVjdC5zaGFwZSA9IDBcbiAgICBpZiAoKG9iamVjdC5jb2xvciA+PSB0aGlzLmNvbG9ycy5sZW5ndGgpIHx8IChvYmplY3QuY29sb3IgPCAwKSkgb2JqZWN0LmNvbG9yID0gMFxuXG4gICAgcmV0dXJuIG9iamVjdFxuICB9XG5cbiAgdXBkYXRlVmlzaWJsZUFyZWEoKSB7XG4gICAgY29uc3Qga3ggPSB0aGlzLmNhbnZhcy53aWR0aCAvICgyICogdGhpcy5jYW1lcmEuem9vbSEpXG4gICAgY29uc3Qga3kgPSB0aGlzLmNhbnZhcy5oZWlnaHQgLyAoMiAqIHRoaXMuY2FtZXJhLnpvb20hKVxuICAgIGNvbnN0IGNhbWVyYUxlZnQgPSB0aGlzLmNhbWVyYS54IVxuICAgIGNvbnN0IGNhbWVyYVJpZ2h0ID0gdGhpcy5jYW1lcmEueCEgKyAyKmt4XG4gICAgY29uc3QgY2FtZXJhVG9wID0gdGhpcy5jYW1lcmEueSEgLSBreVxuICAgIGNvbnN0IGNhbWVyYUJvdHRvbSA9IHRoaXMuY2FtZXJhLnkhICsga3lcblxuICAgIGlmICggKGNhbWVyYUxlZnQgPCAxKSAmJiAoY2FtZXJhUmlnaHQgPiAwKSAmJiAoY2FtZXJhVG9wIDwgMSkgJiYgKGNhbWVyYUJvdHRvbSA+IDApICkge1xuICAgICAgdGhpcy5hcmVhLmR4VmlzaWJsZUZyb20gPSAoY2FtZXJhTGVmdCA8IDApID8gMCA6IE1hdGgudHJ1bmMoY2FtZXJhTGVmdCAvIHRoaXMuYXJlYS5zdGVwKVxuICAgICAgdGhpcy5hcmVhLmR4VmlzaWJsZVRvID0gKGNhbWVyYVJpZ2h0ID4gMSkgPyB0aGlzLmFyZWEuY291bnQgOiB0aGlzLmFyZWEuY291bnQgLSBNYXRoLnRydW5jKCgxIC0gY2FtZXJhUmlnaHQpIC8gdGhpcy5hcmVhLnN0ZXApXG4gICAgICB0aGlzLmFyZWEuZHlWaXNpYmxlRnJvbSA9IChjYW1lcmFUb3AgPCAwKSA/IDAgOiBNYXRoLnRydW5jKGNhbWVyYVRvcCAvIHRoaXMuYXJlYS5zdGVwKVxuICAgICAgdGhpcy5hcmVhLmR5VmlzaWJsZVRvID0gKGNhbWVyYUJvdHRvbSA+IDEpID8gdGhpcy5hcmVhLmNvdW50IDogdGhpcy5hcmVhLmNvdW50IC0gTWF0aC50cnVuYygoMSAtIGNhbWVyYUJvdHRvbSkgLyB0aGlzLmFyZWEuc3RlcClcblxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmFyZWEuZHhWaXNpYmxlRnJvbSA9IDFcbiAgICAgIHRoaXMuYXJlYS5keFZpc2libGVUbyA9IDBcbiAgICAgIHRoaXMuYXJlYS5keVZpc2libGVGcm9tID0gMVxuICAgICAgdGhpcy5hcmVhLmR5VmlzaWJsZVRvID0gMFxuICAgIH1cbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCf0YDQvtC40LfQstC+0LTQuNGCINGA0LXQvdC00LXRgNC40L3QsyDQs9GA0LDRhNC40LrQsCDQsiDRgdC+0L7RgtCy0LXRgtGB0YLQstC40Lgg0YEg0YLQtdC60YPRidC40LzQuCDQv9Cw0YDQsNC80LXRgtGA0LDQvNC4INGC0YDQsNC90YHRhNC+0YDQvNCw0YbQuNC4LlxuICAgKi9cbiAgcHVibGljIHJlbmRlcigpOiB2b2lkIHtcblxuICAgIC8qKiDQntGH0LjRgdGC0LrQsCDQvtCx0YrQtdC60YLQsCDRgNC10L3QtNC10YDQuNC90LPQsCBXZWJHTC4gKi9cbiAgICB0aGlzLndlYmdsLmNsZWFyQmFja2dyb3VuZCgpXG5cbiAgICAvKiog0J7QsdC90L7QstC70LXQvdC40LUg0LzQsNGC0YDQuNGG0Ysg0YLRgNCw0L3RgdGE0L7RgNC80LDRhtC40LguICovXG4gICAgdGhpcy5jb250cm9sLnVwZGF0ZVZpZXdQcm9qZWN0aW9uKClcblxuICAgIC8qKiDQn9GA0LjQstGP0LfQutCwINC80LDRgtGA0LjRhtGLINGC0YDQsNC90YHRhNC+0YDQvNCw0YbQuNC4INC6INC/0LXRgNC10LzQtdC90L3QvtC5INGI0LXQudC00LXRgNCwLiAqL1xuICAgIHRoaXMud2ViZ2wuc2V0VmFyaWFibGUoJ3VfbWF0cml4JywgdGhpcy5jb250cm9sLnRyYW5zZm9ybS52aWV3UHJvamVjdGlvbk1hdClcblxuICAgIHRoaXMudXBkYXRlVmlzaWJsZUFyZWEoKVxuXG4gICAgLy9sZXQgenogPSAwXG4gICAgLyoqINCY0YLQtdGA0LjRgNC+0LLQsNC90LjQtSDQuCDRgNC10L3QtNC10YDQuNC90LMg0LPRgNGD0L/QvyDQsdGD0YTQtdGA0L7QsiBXZWJHTC4gKi9cbiAgICBmb3IgKGxldCBkeCA9IHRoaXMuYXJlYS5keFZpc2libGVGcm9tOyBkeCA8IHRoaXMuYXJlYS5keFZpc2libGVUbzsgZHgrKykge1xuICAgICAgZm9yIChsZXQgZHkgPSB0aGlzLmFyZWEuZHlWaXNpYmxlRnJvbTsgZHkgPCB0aGlzLmFyZWEuZHlWaXNpYmxlVG87IGR5KyspIHtcbiAgICAgICAgaWYgKHRoaXMuYXJlYS5ncm91cHNbZHhdW2R5XVsxXS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgdGhpcy53ZWJnbC5zZXRCdWZmZXIoZHgsIGR5LCAwLCAnYV9wb3NpdGlvbicsIDIsIDAsIDApXG4gICAgICAgICAgdGhpcy53ZWJnbC5zZXRCdWZmZXIoZHgsIGR5LCAxLCAnYV9zaGFwZScsIDEsIDAsIDApXG4gICAgICAgICAgdGhpcy53ZWJnbC5zZXRCdWZmZXIoZHgsIGR5LCAyLCAnYV9jb2xvcicsIDEsIDAsIDApXG4gICAgICAgICAgdGhpcy53ZWJnbC5zZXRCdWZmZXIoZHgsIGR5LCAzLCAnYV9zaXplJywgMSwgMCwgMClcblxuICAgICAgICAgIHRoaXMud2ViZ2wuZHJhd1BvaW50cygwLCB0aGlzLmFyZWEuZ3JvdXBzW2R4XVtkeV1bMV0ubGVuZ3RoKVxuXG4gICAgICAgICAgLy96eisrXG4gICAgICAgICAgLy9jb25zb2xlLmxvZyhgeD0ke3RoaXMuY2FtZXJhLnh9LCB5PSR7dGhpcy5jYW1lcmEueX0sIHpvb209JHt0aGlzLmNhbWVyYS56b29tfWApXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgLy9jb25zb2xlLmxvZygnenogPSAnLCB6eik7XG4gICAgLy9jb25zb2xlLmxvZyhgeD0ke3RoaXMuY2FtZXJhLnh9LCB5PSR7dGhpcy5jYW1lcmEueX0sIHpvb209JHt0aGlzLmNhbWVyYS56b29tfWApXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQn9GA0L7QstC10YDRj9C10YIg0LrQvtGA0YDQtdC60YLQvdC+0YHRgtGMINC90LDRgdGC0YDQvtC10Log0Y3QutC30LXQvNC/0LvRj9GA0LAuXG4gICAqXG4gICAqIEByZW1hcmtzXG4gICAqINCY0YHQv9C+0LvRjNC30YPQtdGC0YHRjyDQtNC70Y8g0L/RgNC+0LLQtdGA0LrQuCDQutC+0YDRgNC10LrRgtC90L7RgdGC0Lgg0LvQvtCz0LjQutC4INGA0LDQsdC+0YLRiyDQv9C+0LvRjNC30L7QstCw0YLQtdC70Y8g0YEg0Y3QutC30LXQvNC/0LvRj9GA0L7QvC4g0J3QtSDQv9C+0LfQstC+0LvRj9C10YIg0YDQsNCx0L7RgtCw0YLRjCDRgVxuICAgKiDQvdC10L3QsNGB0YLRgNC+0LXQvdC90YvQvCDQuNC70Lgg0L3QtdC60L7RgNGA0LXQutGC0L3QviDQvdCw0YHRgtGA0L7QtdC90L3Ri9C8INGN0LrQt9C10LzQv9C70Y/RgNC+0LwuXG4gICAqL1xuICBjaGVja1NldHVwKCkge1xuXG4gICAgLyoqXG4gICAgICogINCf0L7Qu9GM0LfQvtCy0LDRgtC10LvRjCDQvNC+0LMg0L3QsNGB0YLRgNC+0LjRgtGMINGN0LrQt9C10LzQv9C70Y/RgCDQsiDQutC+0L3RgdGC0YDRg9C60YLQvtGA0LUg0Lgg0YHRgNCw0LfRgyDQt9Cw0L/Rg9GB0YLQuNGC0Ywg0YDQtdC90LTQtdGALCDQsiDRgtCw0LrQvtC8INGB0LvRg9GH0LDQtSDQvNC10YLQvtC0IHNldHVwXG4gICAgICogINCx0YPQtNC10YIg0LLRi9C30YvQstCw0LXRgtGB0Y8g0L3QtdGP0LLQvdC+LlxuICAgICAqL1xuICAgIGlmICghdGhpcy5pc1NldHVwZWQpIHtcbiAgICAgIHRoaXMuc2V0dXAoKVxuICAgIH1cblxuICAgIC8qKiDQndCw0LHQvtGAINC/0YDQvtCy0LXRgNC+0Log0LrQvtGA0YDQtdC60YLQvdC+0YHRgtC4INC90LDRgdGC0YDQvtC50LrQuCDRjdC60LfQtdC80L/Qu9GP0YDQsC4gKi9cbiAgICBpZiAoIXRoaXMuaXRlcmF0b3IpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcign0J3QtSDQt9Cw0LTQsNC90LAg0YTRg9C90LrRhtC40Y8g0LjRgtC10YDQuNGA0L7QstCw0L3QuNGPINC+0LHRitC10LrRgtC+0LIhJylcbiAgICB9XG4gIH1cblxuICBhcnJheUl0ZXJhdG9yKCkge1xuICAgIGlmICh0aGlzLmRhdGEhW3RoaXMuYXJyYXlJbmRleF0pIHtcbiAgICAgIHJldHVybiB0aGlzLmRhdGEhW3RoaXMuYXJyYXlJbmRleCsrXVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCX0LDQv9GD0YHQutCw0LXRgiDRgNC10L3QtNC10YDQuNC90LMg0Lgg0LrQvtC90YLRgNC+0LvRjCDRg9C/0YDQsNCy0LvQtdC90LjRjy5cbiAgICovXG4gIHB1YmxpYyBydW4oKTogdm9pZCB7XG5cbiAgICB0aGlzLmNoZWNrU2V0dXAoKVxuXG4gICAgaWYgKCF0aGlzLmlzUnVubmluZykge1xuICAgICAgdGhpcy5yZW5kZXIoKVxuICAgICAgdGhpcy5jb250cm9sLnJ1bigpXG4gICAgICB0aGlzLmlzUnVubmluZyA9IHRydWVcbiAgICAgIHRoaXMuZGVidWcubG9nKCdzdGFydGVkJylcbiAgICB9XG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQntGB0YLQsNC90LDQstC70LjQstCw0LXRgiDRgNC10L3QtNC10YDQuNC90LMg0Lgg0LrQvtC90YLRgNC+0LvRjCDRg9C/0YDQsNCy0LvQtdC90LjRjy5cbiAgICovXG4gIHB1YmxpYyBzdG9wKCk6IHZvaWQge1xuXG4gICAgdGhpcy5jaGVja1NldHVwKClcblxuICAgIGlmICh0aGlzLmlzUnVubmluZykge1xuICAgICAgdGhpcy5jb250cm9sLnN0b3AoKVxuICAgICAgdGhpcy5pc1J1bm5pbmcgPSBmYWxzZVxuICAgICAgdGhpcy5kZWJ1Zy5sb2coJ3N0b3BlZCcpXG4gICAgfVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0J7Rh9C40YnQsNC10YIg0YTQvtC9LlxuICAgKi9cbiAgcHVibGljIGNsZWFyKCk6IHZvaWQge1xuXG4gICAgdGhpcy5jaGVja1NldHVwKClcblxuICAgIHRoaXMud2ViZ2wuY2xlYXJCYWNrZ3JvdW5kKClcbiAgICB0aGlzLmRlYnVnLmxvZygnY2xlYXJlZCcpXG4gIH1cbn1cbiIsIlxuLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqXG4gKiDQn9GA0L7QstC10YDRj9C10YIg0Y/QstC70Y/QtdGC0YHRjyDQu9C4INC/0LXRgNC10LzQtdC90L3QsNGPINGN0LrQt9C10LzQv9C70Y/RgNC+0Lwg0LrQsNC60L7Qs9C+LdC70LjQsdC+0L4g0LrQu9Cw0YHRgdCwLlxuICpcbiAqIEBwYXJhbSB2YXJpYWJsZSAtINCf0YDQvtCy0LXRgNGP0LXQvNCw0Y8g0L/QtdGA0LXQvNC10L3QvdCw0Y8uXG4gKiBAcmV0dXJucyDQoNC10LfRg9C70YzRgtCw0YIg0L/RgNC+0LLQtdGA0LrQuC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzT2JqZWN0KHZhcmlhYmxlOiBhbnkpOiBib29sZWFuIHtcbiAgcmV0dXJuIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFyaWFibGUpID09PSAnW29iamVjdCBPYmplY3RdJylcbn1cblxuLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqXG4gKiDQn9C10YDQtdC+0L/RgNC10LTQtdC70Y/QtdGCINC30L3QsNGH0LXQvdC40Y8g0L/QvtC70LXQuSDQvtCx0YrQtdC60YLQsCB0YXJnZXQg0L3QsCDQt9C90LDRh9C10L3QuNGPINC/0L7Qu9C10Lkg0L7QsdGK0LXQutGC0LAgc291cmNlLlxuICpcbiAqIEByZW1hcmtzXG4gKiDQn9C10YDQtdC+0L/RgNC10LTQtdC70Y/RjtGC0YHRjyDRgtC+0LvRjNC60L4g0YLQtSDQv9C+0LvRjywg0LrQvtGC0L7RgNGL0LUg0YHRg9GJ0LXRgdGC0LLRg9C10Y7RgiDQsiB0YXJnZXQuINCV0YHQu9C4INCyIHNvdXJjZSDQtdGB0YLRjCDQv9C+0LvRjywg0LrQvtGC0L7RgNGL0YUg0L3QtdGCINCyIHRhcmdldCwg0YLQviDQvtC90LhcbiAqINC40LPQvdC+0YDQuNGA0YPRjtGC0YHRjy4g0JXRgdC70Lgg0LrQsNC60LjQtS3RgtC+INC/0L7Qu9GPINGB0LDQvNC4INGP0LLQu9GP0Y7RgtGB0Y8g0Y/QstC70Y/RjtGC0YHRjyDQvtCx0YrQtdC60YLQsNC80LgsINGC0L4g0YLQviDQvtC90Lgg0YLQsNC60LbQtSDRgNC10LrRg9GA0YHQuNCy0L3QviDQutC+0L/QuNGA0YPRjtGC0YHRjyAo0L/RgNC4INGC0L7QvCDQttC1XG4gKiDRg9GB0LvQvtCy0LjQuCwg0YfRgtC+INCyINGG0LXQu9C10LLQvtC8INC+0LHRitC10LrRgtC1INGB0YPRidC10YHRgtCy0YPRjtGCINC/0L7Qu9GPINC+0LHRitC10LrRgtCwLdC40YHRgtC+0YfQvdC40LrQsCkuXG4gKlxuICogQHBhcmFtIHRhcmdldCAtINCm0LXQu9C10LLQvtC5ICjQuNC30LzQtdC90Y/QtdC80YvQuSkg0L7QsdGK0LXQutGCLlxuICogQHBhcmFtIHNvdXJjZSAtINCe0LHRitC10LrRgiDRgSDQtNCw0L3QvdGL0LzQuCwg0LrQvtGC0L7RgNGL0LUg0L3Rg9C20L3QviDRg9GB0YLQsNC90L7QstC40YLRjCDRgyDRhtC10LvQtdCy0L7Qs9C+INC+0LHRitC10LrRgtCwLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY29weU1hdGNoaW5nS2V5VmFsdWVzKHRhcmdldDogYW55LCBzb3VyY2U6IGFueSk6IHZvaWQge1xuICBPYmplY3Qua2V5cyhzb3VyY2UpLmZvckVhY2goa2V5ID0+IHtcbiAgICBpZiAoa2V5IGluIHRhcmdldCkge1xuICAgICAgaWYgKGlzT2JqZWN0KHNvdXJjZVtrZXldKSkge1xuICAgICAgICBpZiAoaXNPYmplY3QodGFyZ2V0W2tleV0pKSB7XG4gICAgICAgICAgY29weU1hdGNoaW5nS2V5VmFsdWVzKHRhcmdldFtrZXldLCBzb3VyY2Vba2V5XSlcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCFpc09iamVjdCh0YXJnZXRba2V5XSkgJiYgKHR5cGVvZiB0YXJnZXRba2V5XSAhPT0gJ2Z1bmN0aW9uJykpIHtcbiAgICAgICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pXG59XG5cbi8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKlxuICog0JLQvtC30LLRgNCw0YnQsNC10YIg0YHQu9GD0YfQsNC50L3QvtC1INGG0LXQu9C+0LUg0YfQuNGB0LvQviDQsiDQtNC40LDQv9Cw0LfQvtC90LU6IFswLi4ucmFuZ2UtMV0uXG4gKlxuICogQHBhcmFtIHJhbmdlIC0g0JLQtdGA0YXQvdC40Lkg0L/RgNC10LTQtdC7INC00LjQsNC/0LDQt9C+0L3QsCDRgdC70YPRh9Cw0LnQvdC+0LPQviDQstGL0LHQvtGA0LAuXG4gKiBAcmV0dXJucyDQodC70YPRh9Cw0LnQvdC+0LUg0YfQuNGB0LvQvi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJhbmRvbUludChyYW5nZTogbnVtYmVyKTogbnVtYmVyIHtcbiAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHJhbmdlKVxufVxuXG4vKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICpcbiAqINCa0L7QvdCy0LXRgNGC0LjRgNGD0LXRgiDRhtCy0LXRgiDQuNC3IEhFWC3RhNC+0YDQvNCw0YLQsCDQsiBHTFNMLdGE0L7RgNC80LDRgi5cbiAqXG4gKiBAcGFyYW0gaGV4Q29sb3IgLSDQptCy0LXRgiDQsiBIRVgt0YTQvtGA0LzQsNGC0LUgKFwiI2ZmZmZmZlwiKS5cbiAqIEByZXR1cm5zINCc0LDRgdGB0LjQsiDQuNC3INGC0YDQtdGFINGH0LjRgdC10Lsg0LIg0LTQuNCw0L/QsNC30L7QvdC1INC+0YIgMCDQtNC+IDEuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb2xvckZyb21IZXhUb0dsUmdiKGhleENvbG9yOiBzdHJpbmcpOiBudW1iZXJbXSB7XG4gIGxldCBrID0gL14jPyhbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KSQvaS5leGVjKGhleENvbG9yKVxuICBsZXQgW3IsIGcsIGJdID0gW3BhcnNlSW50KGshWzFdLCAxNikgLyAyNTUsIHBhcnNlSW50KGshWzJdLCAxNikgLyAyNTUsIHBhcnNlSW50KGshWzNdLCAxNikgLyAyNTVdXG4gIHJldHVybiBbciwgZywgYl1cbn1cblxuLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqXG4gKiDQktC+0LfQstGA0LDRidCw0LXRgiDRgdGC0YDQvtC60L7QstGD0Y4g0LfQsNC/0LjRgdGMINGC0LXQutGD0YnQtdCz0L4g0LLRgNC10LzQtdC90LguXG4gKlxuICogQHJldHVybnMg0KHRgtGA0L7QutCwINCy0YDQtdC80LXQvdC4INCyINGE0L7RgNC80LDRgtC1IFwiaGg6bW06c3NcIi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEN1cnJlbnRUaW1lKCk6IHN0cmluZyB7XG5cbiAgbGV0IHRvZGF5ID0gbmV3IERhdGUoKVxuXG4gIHJldHVybiBbXG4gICAgdG9kYXkuZ2V0SG91cnMoKS50b1N0cmluZygpLnBhZFN0YXJ0KDIsICcwJyksXG4gICAgdG9kYXkuZ2V0TWludXRlcygpLnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgJzAnKSxcbiAgICB0b2RheS5nZXRTZWNvbmRzKCkudG9TdHJpbmcoKS5wYWRTdGFydCgyLCAnMCcpXG4gIF0uam9pbignOicpXG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IFNQbG90IGZyb20gJ0Avc3Bsb3QnXG5pbXBvcnQgJ0Avc3R5bGUnXG5cbi8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5cbmxldCBuID0gMTBfMDAwXzAwMFxubGV0IGNvbG9ycyA9IFsnI0Q4MUMwMScsICcjRTk5NjdBJywgJyNCQTU1RDMnLCAnI0ZGRDcwMCcsICcjRkZFNEI1JywgJyNGRjhDMDAnLCAnIzIyOEIyMicsICcjOTBFRTkwJywgJyM0MTY5RTEnLCAnIzAwQkZGRicsICcjOEI0NTEzJywgJyMwMENFRDEnXVxubGV0IGNvbG9yczIgPSBbJyMwMDAwMDAnLCAnI2ZmMDAwMCcsICcjMDBmZjAwJywgJyMwMDAwZmYnXVxuXG4vKiog0KHQuNC90YLQtdGC0LjRh9C10YHQutCw0Y8g0LjRgtC10YDQuNGA0YPRjtGJ0LDRjyDRhNGD0L3QutGG0LjRjy4gKi9cbmxldCBpID0gMFxuZnVuY3Rpb24gcmVhZE5leHRPYmplY3QoKSB7XG4gIGlmIChpIDwgbikge1xuICAgIGkrK1xuICAgIHJldHVybiB7XG4gICAgICB4OiBNYXRoLnJhbmRvbSgpLFxuICAgICAgeTogTWF0aC5yYW5kb20oKSxcbiAgICAgIHNoYXBlOiByYW5kb21JbnQoNSksXG4gICAgICBzaXplOiAzMCxcbiAgICAgIGNvbG9yOiByYW5kb21JbnQoY29sb3JzLmxlbmd0aClcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaSA9IDBcbiAgICByZXR1cm4gbnVsbCAgLy8g0JLQvtC30LLRgNCw0YnQsNC10LwgbnVsbCwg0LrQvtCz0LTQsCDQvtCx0YrQtdC60YLRiyBcItC30LDQutC+0L3Rh9C40LvQuNGB0YxcIi5cbiAgfVxufVxuXG5mdW5jdGlvbiByYW5kb21JbnQocmFuZ2UpIHtcbiAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHJhbmdlKVxufVxuXG5jb25zdCBzaXplID0gMzBcblxuY29uc3QgZGF0YSA9IFtcbiAgeyB4OiAwLCB5OiAwLCBzaGFwZTogMCwgc2l6ZTogc2l6ZSwgY29sb3I6IDAgfSxcbiAgeyB4OiAwLCB5OiAwLjUsIHNoYXBlOiAwLCBzaXplOiBzaXplLCBjb2xvcjogMSB9LFxuICB7IHg6IDAuNSwgeTogMC41LCBzaGFwZTogMCwgc2l6ZTogc2l6ZSwgY29sb3I6IDIgfSxcbiAgeyB4OiAwLjUsIHk6IDAsIHNoYXBlOiAwLCBzaXplOiBzaXplLCBjb2xvcjogMyB9LFxuXVxuXG4vKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuXG5sZXQgc2NhdHRlclBsb3QgPSBuZXcgU1Bsb3QoJ2NhbnZhczEnKVxuXG5zY2F0dGVyUGxvdC5zZXR1cCh7XG4gIGl0ZXJhdG9yOiByZWFkTmV4dE9iamVjdCxcbiAgLy9kYXRhOiBkYXRhLFxuICBjb2xvcnM6IGNvbG9ycyxcbiAgZGVidWc6IHtcbiAgICBpc0VuYWJsZTogdHJ1ZSxcbiAgfSxcbiAgZGVtbzoge1xuICAgIGlzRW5hYmxlOiBmYWxzZVxuICB9LFxuICB3ZWJnbDoge1xuICAgIGZhaWxJZk1ham9yUGVyZm9ybWFuY2VDYXZlYXQ6IHRydWVcbiAgfVxufSlcblxuc2NhdHRlclBsb3QucnVuKClcbiJdLCJzb3VyY2VSb290IjoiIn0=