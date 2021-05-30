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
    SPlot.prototype.getVisibleObjectsParams = function (totalCount, ratio) {
        var first = 0;
        var count = 0;
        // TODO: Изменить алгоритм расчета отображаемых в группе объектов. Возможно ориентироваться на количество объектов
        // на единицу площади группы.
        if (ratio > 0.1) {
            count = 20 / ratio;
        }
        else if (ratio > 0.05) {
            count = 40 / ratio;
        }
        else if (ratio > 0.03) {
            count = (totalCount - 40 / ratio) * (1 - 2 * ratio) + 40 / ratio;
        }
        else {
            count = totalCount;
        }
        count = Math.max(2, Math.min(totalCount, Math.trunc(count)));
        first = totalCount - count;
        return [first, count];
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
        this.updateVisibleArea();
        var ratioObjectGroup = this.stats.minObjectSize / (this.camera.zoom * this.area.step); // !!! max -> min
        var first = 0;
        var count = 0;
        //let zz = 0
        /** Итерирование и рендеринг групп буферов WebGL. */
        for (var dx = this.area.dxVisibleFrom; dx < this.area.dxVisibleTo; dx++) {
            for (var dy = this.area.dyVisibleFrom; dy < this.area.dyVisibleTo; dy++) {
                if (this.area.groups[dx][dy][1].length > 0) {
                    this.webgl.setBuffer(dx, dy, 0, 'a_position', 2, 0, 0);
                    this.webgl.setBuffer(dx, dy, 1, 'a_shape', 1, 0, 0);
                    this.webgl.setBuffer(dx, dy, 2, 'a_color', 1, 0, 0);
                    this.webgl.setBuffer(dx, dy, 3, 'a_size', 1, 0, 0);
                    _a = this.getVisibleObjectsParams(this.area.groups[dx][dy][1].length, ratioObjectGroup), first = _a[0], count = _a[1];
                    this.webgl.drawPoints(first, count);
                    //zz++
                    //console.log(`x=${this.camera.x}, y=${this.camera.y}, zoom=${this.camera.zoom}`)
                }
            }
        }
        //console.log('ratio = ' + ratioObjectGroup);
        //console.log('first = ' + first + '; count = ' + count);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zdHlsZS5jc3MiLCJ3ZWJwYWNrOi8vLy4vc2hhZGVycy50cyIsIndlYnBhY2s6Ly8vLi9zcGxvdC1jb250cm9sLnRzIiwid2VicGFjazovLy8uL3NwbG90LWRlYnVnLnRzIiwid2VicGFjazovLy8uL3NwbG90LWRlbW8udHMiLCJ3ZWJwYWNrOi8vLy4vc3Bsb3QtZ2xzbC50cyIsIndlYnBhY2s6Ly8vLi9zcGxvdC13ZWJnbC50cyIsIndlYnBhY2s6Ly8vLi9zcGxvdC50cyIsIndlYnBhY2s6Ly8vLi91dGlscy50cyIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vLy4vaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7QUNBYSx1QkFBZSxHQUM1QixpVkFjQztBQUVZLHlCQUFpQixHQUM5QixnTEFTQztBQUVZLGNBQU0sR0FBYSxFQUFFO0FBRWxDLGlCQUFTLEdBQUksVUFBVTtJQUN2QixJQUNDO0FBRUQsaUJBQVMsR0FBSSxPQUFPO0lBQ3BCLHFEQUVDO0FBRUQsaUJBQVMsR0FBSSxRQUFRO0lBQ3JCLDBPQU1DO0FBRUQsaUJBQVMsR0FBSSxjQUFjO0lBQzNCLDJOQUlDO0FBRUQsaUJBQVMsR0FBSSxhQUFhO0lBQzFCLCtNQU9DOzs7Ozs7Ozs7Ozs7O0FDOUREOzs7O0dBSUc7QUFDSDtJQW1CRSwyREFBMkQ7SUFDM0QscUJBQ1csS0FBWTtRQUFaLFVBQUssR0FB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LENBQUMsTUFBTSxHQUFHLE1BQU07UUFFekIsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUU7UUFFdEIsc0RBQXNEO1FBQ3RELEtBQUssSUFBSSxJQUFFLEdBQUcsQ0FBQyxFQUFFLElBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFFLEVBQUUsRUFBRTtZQUMzQyxLQUFLLElBQUksSUFBRSxHQUFHLENBQUMsRUFBRSxJQUFFLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBRSxFQUFFLEVBQUU7Z0JBQzNDLElBQUksTUFBTSxDQUFDLElBQUUsQ0FBQyxDQUFDLElBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7b0JBQ2hDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUTt3QkFDakIsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsSUFBRSxFQUFFLElBQUUsRUFBRSxDQUFDLEVBQUUsSUFBSSxZQUFZLENBQUMsTUFBTSxDQUFDLElBQUUsQ0FBQyxDQUFDLElBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQ3ZFLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLElBQUUsRUFBRSxJQUFFLEVBQUUsQ0FBQyxFQUFFLElBQUksVUFBVSxDQUFDLE1BQU0sQ0FBQyxJQUFFLENBQUMsQ0FBQyxJQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUNyRSxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxJQUFFLEVBQUUsSUFBRSxFQUFFLENBQUMsRUFBRSxJQUFJLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBRSxDQUFDLENBQUMsSUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDckUsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsSUFBRSxFQUFFLElBQUUsRUFBRSxDQUFDLEVBQUUsSUFBSSxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUUsQ0FBQyxD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OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsZ0NBQWdDLFlBQVk7V0FDNUM7V0FDQSxFOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0Esd0NBQXdDLHlDQUF5QztXQUNqRjtXQUNBO1dBQ0EsRTs7Ozs7V0NQQSx3Rjs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSxzREFBc0Qsa0JBQWtCO1dBQ3hFO1dBQ0EsK0NBQStDLGNBQWM7V0FDN0QsRTs7Ozs7Ozs7Ozs7Ozs7QUNOMkI7QUFDWDs7QUFFaEI7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxHQUFHLDZDQUE2QztBQUNoRCxHQUFHLCtDQUErQztBQUNsRCxHQUFHLGlEQUFpRDtBQUNwRCxHQUFHLCtDQUErQztBQUNsRDs7QUFFQTs7QUFFQSxzQkFBc0IsK0NBQUs7O0FBRTNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQiLCJmaWxlIjoic2NyaXB0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiZXhwb3J0IGNvbnN0IFZFUlRFWF9URU1QTEFURSA9XG5gXG5hdHRyaWJ1dGUgdmVjMiBhX3Bvc2l0aW9uO1xuYXR0cmlidXRlIGZsb2F0IGFfY29sb3I7XG5hdHRyaWJ1dGUgZmxvYXQgYV9zaXplO1xuYXR0cmlidXRlIGZsb2F0IGFfc2hhcGU7XG51bmlmb3JtIG1hdDMgdV9tYXRyaXg7XG52YXJ5aW5nIHZlYzMgdl9jb2xvcjtcbnZhcnlpbmcgZmxvYXQgdl9zaGFwZTtcbnZvaWQgbWFpbigpIHtcbiAgZ2xfUG9zaXRpb24gPSB2ZWM0KCh1X21hdHJpeCAqIHZlYzMoYV9wb3NpdGlvbiwgMSkpLnh5LCAwLjAsIDEuMCk7XG4gIGdsX1BvaW50U2l6ZSA9IGFfc2l6ZTtcbiAgdl9zaGFwZSA9IGFfc2hhcGU7XG4gIHtDT0xPUi1TRUxFQ1RJT059XG59XG5gXG5cbmV4cG9ydCBjb25zdCBGUkFHTUVOVF9URU1QTEFURSA9XG5gXG5wcmVjaXNpb24gaGlnaHAgZmxvYXQ7XG52YXJ5aW5nIHZlYzMgdl9jb2xvcjtcbnZhcnlpbmcgZmxvYXQgdl9zaGFwZTtcbntTSEFQRVMtRlVOQ1RJT05TfVxudm9pZCBtYWluKCkge1xuICB7U0hBUEUtU0VMRUNUSU9OfVxuICBnbF9GcmFnQ29sb3IgPSB2ZWM0KHZfY29sb3IucmdiLCAxLjApO1xufVxuYFxuXG5leHBvcnQgY29uc3QgU0hBUEVTOiBzdHJpbmdbXSA9IFtdXG5cblNIQVBFU1swXSA9ICAvLyDQmtCy0LDQtNGA0LDRglxuYFxuYFxuXG5TSEFQRVNbMV0gPSAgLy8g0JrRgNGD0LNcbmBcbmlmIChsZW5ndGgoZ2xfUG9pbnRDb29yZCAtIDAuNSkgPiAwLjUpIGRpc2NhcmQ7XG5gXG5cblNIQVBFU1syXSA9ICAvLyDQmtGA0LXRgdGCXG5gXG5pZiAoKGFsbChsZXNzVGhhbihnbF9Qb2ludENvb3JkLCB2ZWMyKDAuMykpKSkgfHxcbiAgKChnbF9Qb2ludENvb3JkLnggPiAwLjcpICYmIChnbF9Qb2ludENvb3JkLnkgPCAwLjMpKSB8fFxuICAoYWxsKGdyZWF0ZXJUaGFuKGdsX1BvaW50Q29vcmQsIHZlYzIoMC43KSkpKSB8fFxuICAoKGdsX1BvaW50Q29vcmQueCA8IDAuMykgJiYgKGdsX1BvaW50Q29vcmQueSA+IDAuNykpXG4gICkgZGlzY2FyZDtcbmBcblxuU0hBUEVTWzNdID0gIC8vINCi0YDQtdGD0LPQvtC70YzQvdC40LpcbmBcbnZlYzIgcG9zID0gdmVjMihnbF9Qb2ludENvb3JkLngsIGdsX1BvaW50Q29vcmQueSAtIDAuMSkgLSAwLjU7XG5mbG9hdCBhID0gYXRhbihwb3MueCwgcG9zLnkpICsgMi4wOTQzOTUxMDIzOTtcbmlmIChzdGVwKDAuMjg1LCBjb3MoZmxvb3IoMC41ICsgYSAvIDIuMDk0Mzk1MTAyMzkpICogMi4wOTQzOTUxMDIzOSAtIGEpICogbGVuZ3RoKHBvcykpID4gMC45KSBkaXNjYXJkO1xuYFxuXG5TSEFQRVNbNF0gPSAgLy8g0KjQtdGB0YLQtdGA0LXQvdC60LBcbmBcbnZlYzIgcG9zID0gdmVjMigwLjUpIC0gZ2xfUG9pbnRDb29yZDtcbmZsb2F0IHIgPSBsZW5ndGgocG9zKSAqIDEuNjI7XG5mbG9hdCBhID0gYXRhbihwb3MueSwgcG9zLngpO1xuZmxvYXQgZiA9IGNvcyhhICogMy4wKTtcbmYgPSBzdGVwKDAuMCwgY29zKGEgKiAxMC4wKSkgKiAwLjIgKyAwLjU7XG5pZiAoIHN0ZXAoZiwgcikgPiAwLjUgKSBkaXNjYXJkO1xuYFxuIiwiaW1wb3J0IFNQbG90IGZyb20gJ0Avc3Bsb3QnXG5cbi8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKlxuICog0JrQu9Cw0YHRgS3RhdC10LvQv9C10YAsINGA0LXQsNC70LjQt9GD0Y7RidC40Lkg0L7QsdGA0LDQsdC+0YLQutGDINGB0YDQtdC00YHRgtCyINCy0LLQvtC00LAgKNC80YvRiNC4LCDRgtGA0LXQutC/0LDQtNCwINC4INGCLtC/Likg0Lgg0LzQsNGC0LXQvNCw0YLQuNGH0LXRgdC60LjQtSDRgNCw0YHRh9C10YLRiyDRgtC10YXQvdC40YfQtdGB0LrQuNGFINC00LDQvdC90YvRhSxcbiAqINGB0L7QvtGC0LLQtdGC0YHQstGD0Y7RidC40YUg0YLRgNCw0L3RgdGE0L7RgNC80LDRhtC40Y/QvCDQs9GA0LDRhNC40LrQsCDQtNC70Y8g0LrQu9Cw0YHRgdCwIFNwbG90LlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTUGxvdENvbnRvbCBpbXBsZW1lbnRzIFNQbG90SGVscGVyIHtcblxuICAvKiog0KLQtdGF0L3QuNGH0LXRgdC60LDRjyDQuNC90YTQvtGA0LzQsNGG0LjRjywg0LjRgdC/0L7Qu9GM0LfRg9C10LzQsNGPINC/0YDQuNC70L7QttC10L3QuNC10Lwg0LTQu9GPINGA0LDRgdGH0LXRgtCwINGC0YDQsNC90YHRhNC+0YDQvNCw0YbQuNC5LiAqL1xuICBwdWJsaWMgdHJhbnNmb3JtOiBTUGxvdFRyYW5zZm9ybSA9IHtcbiAgICB2aWV3UHJvamVjdGlvbk1hdDogW10sXG4gICAgc3RhcnRJbnZWaWV3UHJvak1hdDogW10sXG4gICAgc3RhcnRDYW1lcmE6IHsgeDogMCwgeTogMCwgem9vbTogMSB9LFxuICAgIHN0YXJ0UG9zOiBbXSxcbiAgfVxuXG4gIC8qKiDQn9GA0LjQt9C90LDQuiDRgtC+0LPQviwg0YfRgtC+INGF0LXQu9C/0LXRgCDRg9C20LUg0L3QsNGB0YLRgNC+0LXQvS4gKi9cbiAgcHVibGljIGlzU2V0dXBlZDogYm9vbGVhbiA9IGZhbHNlXG5cbiAgLyoqINCe0LHRgNCw0LHQvtGC0YfQuNC60Lgg0YHQvtCx0YvRgtC40Lkg0YEg0LfQsNC60YDQtdC/0LvQtdC90L3Ri9C80Lgg0LrQvtC90YLQtdC60YHRgtCw0LzQuC4gKi9cbiAgcHJvdGVjdGVkIGhhbmRsZU1vdXNlRG93bldpdGhDb250ZXh0OiBFdmVudExpc3RlbmVyID0gdGhpcy5oYW5kbGVNb3VzZURvd24uYmluZCh0aGlzKSBhcyBFdmVudExpc3RlbmVyXG4gIHByb3RlY3RlZCBoYW5kbGVNb3VzZVdoZWVsV2l0aENvbnRleHQ6IEV2ZW50TGlzdGVuZXIgPSB0aGlzLmhhbmRsZU1vdXNlV2hlZWwuYmluZCh0aGlzKSBhcyBFdmVudExpc3RlbmVyXG4gIHByb3RlY3RlZCBoYW5kbGVNb3VzZU1vdmVXaXRoQ29udGV4dDogRXZlbnRMaXN0ZW5lciA9IHRoaXMuaGFuZGxlTW91c2VNb3ZlLmJpbmQodGhpcykgYXMgRXZlbnRMaXN0ZW5lclxuICBwcm90ZWN0ZWQgaGFuZGxlTW91c2VVcFdpdGhDb250ZXh0OiBFdmVudExpc3RlbmVyID0gdGhpcy5oYW5kbGVNb3VzZVVwLmJpbmQodGhpcykgYXMgRXZlbnRMaXN0ZW5lclxuXG4gIC8qKiDQpdC10LvQv9C10YAg0LHRg9C00LXRgiDQuNC80LXRgtGMINC/0L7Qu9C90YvQuSDQtNC+0YHRgtGD0L8g0Log0Y3QutC30LXQvNC/0LvRj9GA0YMgU1Bsb3QuICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIHJlYWRvbmx5IHNwbG90OiBTUGxvdFxuICApIHsgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCf0L7QtNCz0L7RgtCw0LLQu9C40LLQsNC10YIg0YXQtdC70L/QtdGAINC6INC40YHQv9C+0LvRjNC30L7QstCw0L3QuNGOLlxuICAgKi9cbiAgc2V0dXAoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmlzU2V0dXBlZCkge1xuICAgICAgdGhpcy5pc1NldHVwZWQgPSB0cnVlXG4gICAgfVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JfQsNC/0YPRgdC60LDQtdGCINC/0YDQvtGB0LvRg9GI0LrRgyDRgdC+0LHRi9GC0LjQuSDQvNGL0YjQuC5cbiAgICovXG4gIHB1YmxpYyBydW4oKTogdm9pZCB7XG4gICAgdGhpcy5zcGxvdC5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5oYW5kbGVNb3VzZURvd25XaXRoQ29udGV4dClcbiAgICB0aGlzLnNwbG90LmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCd3aGVlbCcsIHRoaXMuaGFuZGxlTW91c2VXaGVlbFdpdGhDb250ZXh0KVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0J7RgdGC0LDQvdCw0LLQu9C40LLQsNC10YIg0L/RgNC+0YHQu9GD0YjQutGDINGB0L7QsdGL0YLQuNC5INC80YvRiNC4LlxuICAgKi9cbiAgcHVibGljIHN0b3AoKTogdm9pZCB7XG4gICAgdGhpcy5zcGxvdC5jYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5oYW5kbGVNb3VzZURvd25XaXRoQ29udGV4dClcbiAgICB0aGlzLnNwbG90LmNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKCd3aGVlbCcsIHRoaXMuaGFuZGxlTW91c2VXaGVlbFdpdGhDb250ZXh0KVxuICAgIHRoaXMuc3Bsb3QuY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMuaGFuZGxlTW91c2VNb3ZlV2l0aENvbnRleHQpXG4gICAgdGhpcy5zcGxvdC5jYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuaGFuZGxlTW91c2VVcFdpdGhDb250ZXh0KVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0J7QsdC90L7QstC70Y/QtdGCINC80LDRgtGA0LjRhtGDINGC0YDQsNC90YHRhNC+0YDQvNCw0YbQuNC4LlxuICAgKi9cbiAgcHVibGljIHVwZGF0ZVZpZXdQcm9qZWN0aW9uKCk6IHZvaWQge1xuXG4gICAgY29uc3QgY2FudmFzID0gdGhpcy5zcGxvdC5jYW52YXNcbiAgICBjb25zdCBjYW1lcmEgPSB0aGlzLnNwbG90LmNhbWVyYVxuXG4gICAgY29uc3QgZDAgPSBjYW1lcmEuem9vbSFcbiAgICBjb25zdCBkMSA9IDIgLyBjYW52YXMud2lkdGggKiBkMFxuICAgIGNvbnN0IGQyID0gMiAvIGNhbnZhcy5oZWlnaHQgKiBkMFxuXG4gICAgdGhpcy50cmFuc2Zvcm0udmlld1Byb2plY3Rpb25NYXQgPSBbIGQxLCAwLCAwLCAwLCAtZDIsIDAsIC1kMSAqIGNhbWVyYS54ISAtIDEsIGQyICogY2FtZXJhLnkhLCAxIF1cbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCf0YDQtdC+0LHRgNCw0LfRg9C10YIg0LrQvtC+0YDQtNC40L3QsNGC0Ysg0LzRi9GI0Lgg0LIgR0wt0LrQvtC+0YDQtNC40L3QsNGC0YsuXG4gICAqL1xuICBwcm90ZWN0ZWQgZ2V0Q2xpcFNwYWNlTW91c2VQb3NpdGlvbihldmVudDogTW91c2VFdmVudCk6IG51bWJlcltdIHtcblxuICAgIGNvbnN0IGNhbnZhcyA9IHRoaXMuc3Bsb3QuY2FudmFzXG5cbiAgICBjb25zdCByZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG5cbiAgICBjb25zdCBjbGlwWCA9ICAyICogKChldmVudC5jbGllbnRYIC0gcmVjdC5sZWZ0KSAvIGNhbnZhcy5jbGllbnRXaWR0aCkgLSAxXG4gICAgY29uc3QgY2xpcFkgPSAtMiAqICgoZXZlbnQuY2xpZW50WSAtIHJlY3QudG9wKSAvIGNhbnZhcy5jbGllbnRIZWlnaHQpICsgMVxuXG4gICAgcmV0dXJuIFtjbGlwWCwgY2xpcFldXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQoNC10LDQs9C40YDRg9C10YIg0L3QsCDQtNCy0LjQttC10L3QuNC1INC80YvRiNC4INCyINC80L7QvNC10L3Rgiwg0LrQvtCz0LTQsCDQtdC1INC60LvQsNCy0LjRiNCwINGD0LTQtdGA0LbQuNCy0LDQtdGC0YHRjyDQvdCw0LbQsNGC0L7QuS4g0JzQtdGC0L7QtCDQv9C10YDQtdC80LXRidCw0LXRgiDQvtCx0LvQsNGB0YLRjCDQstC40LTQuNC80L7RgdGC0Lgg0L3QsFxuICAgKiDQv9C70L7RgdC60L7RgdGC0Lgg0LLQvNC10YHRgtC1INGBINC00LLQuNC20LXQvdC40LXQvCDQvNGL0YjQuC5cbiAgICovXG4gIHByb3RlY3RlZCBoYW5kbGVNb3VzZU1vdmUoZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcblxuICAgIGNvbnN0IHNwbG90ID0gdGhpcy5zcGxvdFxuICAgIGNvbnN0IHRyYW5zZm9ybSA9IHRoaXMudHJhbnNmb3JtXG4gICAgY29uc3QgbWF0cml4ID0gdHJhbnNmb3JtLnN0YXJ0SW52Vmlld1Byb2pNYXRcbiAgICBjb25zdCBbY2xpcFgsIGNsaXBZXSA9IHRoaXMuZ2V0Q2xpcFNwYWNlTW91c2VQb3NpdGlvbihldmVudClcblxuICAgIHNwbG90LmNhbWVyYS54ID0gdHJhbnNmb3JtLnN0YXJ0Q2FtZXJhLnghICsgdHJhbnNmb3JtLnN0YXJ0UG9zWzBdIC0gY2xpcFggKiBtYXRyaXhbMF0gLSBtYXRyaXhbNl1cbiAgICBzcGxvdC5jYW1lcmEueSA9IHRyYW5zZm9ybS5zdGFydENhbWVyYS55ISArIHRyYW5zZm9ybS5zdGFydFBvc1sxXSAtIGNsaXBZICogbWF0cml4WzRdIC0gbWF0cml4WzddXG5cbiAgICBzcGxvdC5yZW5kZXIoKVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0KDQtdCw0LPQuNGA0YPQtdGCINC90LAg0L7RgtC20LDRgtC40LUg0LrQu9Cw0LLQuNGI0Lgg0LzRi9GI0LguINCSINC80L7QvNC10L3RgiDQvtGC0LbQsNGC0LjRjyDQutC70LDQstC40YjQuCDQsNC90LDQu9C40Lcg0LTQstC40LbQtdC90LjRjyDQvNGL0YjQuCDRgSDQt9Cw0LbQsNGC0L7QuSDQutC70LDQstC40YjQtdC5INC/0YDQtdC60YDQsNGJ0LDQtdGC0YHRjy5cbiAgICovXG4gIHByb3RlY3RlZCBoYW5kbGVNb3VzZVVwKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG5cbiAgICB0aGlzLnNwbG90LnJlbmRlcigpXG5cbiAgICBldmVudC50YXJnZXQhLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMuaGFuZGxlTW91c2VNb3ZlV2l0aENvbnRleHQpXG4gICAgZXZlbnQudGFyZ2V0IS5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5oYW5kbGVNb3VzZVVwV2l0aENvbnRleHQpXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQoNC10LDQs9C40YDRg9C10YIg0L3QsCDQvdCw0LbQsNGC0LjQtSDQutC70LDQstC40YjQuCDQvNGL0YjQuC4g0JIg0LzQvtC80LXQvdGCINC90LDQttCw0YLQuNGPINC4INGD0LTQtdGA0LbQsNC90LjRjyDQutC70LDQstC40YjQuCDQt9Cw0L/Rg9GB0LrQsNC10YLRgdGPINCw0L3QsNC70LjQtyDQtNCy0LjQttC10L3QuNGPINC80YvRiNC4ICjRgSDQt9Cw0LbQsNGC0L7QuVxuICAgKiDQutC70LDQstC40YjQtdC5KS5cbiAgICovXG4gIHByb3RlY3RlZCBoYW5kbGVNb3VzZURvd24oZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcblxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcblxuICAgIGNvbnN0IHNwbG90ID0gdGhpcy5zcGxvdFxuICAgIGNvbnN0IHRyYW5zZm9ybSA9IHRoaXMudHJhbnNmb3JtXG5cbiAgICBzcGxvdC5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5oYW5kbGVNb3VzZU1vdmVXaXRoQ29udGV4dClcbiAgICBzcGxvdC5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuaGFuZGxlTW91c2VVcFdpdGhDb250ZXh0KVxuXG4gICAgbGV0IG1hdHJpeCA9IHRyYW5zZm9ybS52aWV3UHJvamVjdGlvbk1hdFxuICAgIHRyYW5zZm9ybS5zdGFydEludlZpZXdQcm9qTWF0ID0gWzEgLyBtYXRyaXhbMF0sIDAsIDAsIDAsIDEgLyBtYXRyaXhbNF0sIDAsIC1tYXRyaXhbNl0gLyBtYXRyaXhbMF0sIC1tYXRyaXhbN10gLyBtYXRyaXhbNF0sIDFdXG5cbiAgICB0cmFuc2Zvcm0uc3RhcnRDYW1lcmEgPSB7IHg6IHNwbG90LmNhbWVyYS54LCB5OiBzcGxvdC5jYW1lcmEueSwgem9vbTogc3Bsb3QuY2FtZXJhLnpvb20gfVxuXG4gICAgY29uc3QgW2NsaXBYLCBjbGlwWV0gPSB0aGlzLmdldENsaXBTcGFjZU1vdXNlUG9zaXRpb24oZXZlbnQpXG4gICAgbWF0cml4ID0gdHJhbnNmb3JtLnN0YXJ0SW52Vmlld1Byb2pNYXRcbiAgICB0cmFuc2Zvcm0uc3RhcnRQb3NbMF0gPSBjbGlwWCAqIG1hdHJpeFswXSArIG1hdHJpeFs2XVxuICAgIHRyYW5zZm9ybS5zdGFydFBvc1sxXSA9IGNsaXBZICogbWF0cml4WzRdICsgbWF0cml4WzddXG5cbiAgICBzcGxvdC5yZW5kZXIoKVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0KDQtdCw0LPQuNGA0YPQtdGCINC90LAg0LfRg9C80LjRgNC+0LLQsNC90LjQtSDQvNGL0YjQuC4g0JIg0LzQvtC80LXQvdGCINC30YPQvNC40YDQvtCy0LDQvdC40Y8g0LzRi9GI0Lgg0L/RgNC+0LjRgdGF0L7QtNC40YIg0LfRg9C80LjRgNC+0LLQsNC90LjQtSDQutC+0L7RgNC00LjQvdCw0YLQvdC+0Lkg0L/Qu9C+0YHQutC+0YHRgtC4LlxuICAgKi9cbiAgcHJvdGVjdGVkIGhhbmRsZU1vdXNlV2hlZWwoZXZlbnQ6IFdoZWVsRXZlbnQpOiB2b2lkIHtcblxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcblxuICAgIGNvbnN0IGNhbWVyYSA9IHRoaXMuc3Bsb3QuY2FtZXJhXG5cbiAgICAvKiog0JLRi9GH0LjRgdC70LXQvdC40LUg0L/QvtC30LjRhtC40Lgg0LzRi9GI0Lgg0LIgR0wt0LrQvtC+0YDQtNC40L3QsNGC0LDRhS4gKi9cbiAgICBjb25zdCBbY2xpcFgsIGNsaXBZXSA9IHRoaXMuZ2V0Q2xpcFNwYWNlTW91c2VQb3NpdGlvbihldmVudClcblxuICAgIC8qKiDQn9C+0LfQuNGG0LjRjyDQvNGL0YjQuCDQtNC+INC30YPQvNC40YDQvtCy0LDQvdC40Y8uICovXG4gICAgbGV0IG1hdHJpeCA9IHRoaXMudHJhbnNmb3JtLnZpZXdQcm9qZWN0aW9uTWF0XG4gICAgY29uc3QgcHJlWm9vbVggPSAoY2xpcFggLSBtYXRyaXhbNl0pIC8gbWF0cml4WzBdXG4gICAgY29uc3QgcHJlWm9vbVkgPSAoY2xpcFkgIC0gbWF0cml4WzddKSAvIG1hdHJpeFs0XVxuXG4gICAgLyoqINCd0L7QstC+0LUg0LfQvdCw0YfQtdC90LjQtSDQt9GD0LzQsCDQvtCx0LvQsNGB0YLQuCDQv9GA0L7RgdC80L7RgtGA0LAg0Y3QutGB0L/QvtC90LXQvdGG0LjQsNC70YzQvdC+INC30LDQstC40YHQuNGCINC+0YIg0LLQtdC70LjRh9C40L3RiyDQt9GD0LzQuNGA0L7QstCw0L3QuNGPINC80YvRiNC4LiAqL1xuICAgIGNvbnN0IG5ld1pvb20gPSBjYW1lcmEuem9vbSEgKiBNYXRoLnBvdygyLCBldmVudC5kZWx0YVkgKiAtMC4wMSlcblxuICAgIC8qKiDQnNCw0LrRgdC40LzQsNC70YzQvdC+0LUg0Lgg0LzQuNC90LjQvNCw0LvRjNC90L7QtSDQt9C90LDRh9C10L3QuNGPINC30YPQvNCwINC+0LHQu9Cw0YHRgtC4INC/0YDQvtGB0LzQvtGC0YDQsC4gKi9cbiAgICBjYW1lcmEuem9vbSA9IE1hdGgubWF4KGNhbWVyYS5taW5ab29tISwgTWF0aC5taW4oY2FtZXJhLm1heFpvb20hLCBuZXdab29tKSlcblxuICAgIC8qKiDQntCx0L3QvtCy0LvQtdC90LjQtSDQvNCw0YLRgNC40YbRiyDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuC4gKi9cbiAgICB0aGlzLnVwZGF0ZVZpZXdQcm9qZWN0aW9uKClcblxuICAgIC8qKiDQn9C+0LfQuNGG0LjRjyDQvNGL0YjQuCDQv9C+0YHQu9C1INC30YPQvNC40YDQvtCy0LDQvdC40Y8uICovXG4gICAgbWF0cml4ID0gdGhpcy50cmFuc2Zvcm0udmlld1Byb2plY3Rpb25NYXRcbiAgICBjb25zdCBwb3N0Wm9vbVggPSAoY2xpcFggLSBtYXRyaXhbNl0pIC8gbWF0cml4WzBdXG4gICAgY29uc3QgcG9zdFpvb21ZID0gKGNsaXBZIC0gbWF0cml4WzddKSAvIG1hdHJpeFs0XVxuXG4gICAgLyoqINCS0YvRh9C40YHQu9C10L3QuNC1INC90L7QstC+0LPQviDQv9C+0LvQvtC20LXQvdC40Y8g0L7QsdC70LDRgdGC0Lgg0L/RgNC+0YHQvNC+0YLRgNCwINC/0L7RgdC70LUg0LfRg9C80LjRgNC+0LLQsNC90LjRjy4gKi9cbiAgICBjYW1lcmEueCEgKz0gcHJlWm9vbVggLSBwb3N0Wm9vbVhcbiAgICBjYW1lcmEueSEgKz0gcHJlWm9vbVkgLSBwb3N0Wm9vbVlcblxuICAgIHRoaXMuc3Bsb3QucmVuZGVyKClcbiAgfVxufVxuIiwiaW1wb3J0IFNQbG90IGZyb20gJ0Avc3Bsb3QnXG5pbXBvcnQgeyBnZXRDdXJyZW50VGltZSB9IGZyb20gJ0AvdXRpbHMnXG5cbi8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKlxuICog0JrQu9Cw0YHRgS3RhdC10LvQv9C10YAsINGA0LXQsNC70LjQt9GD0Y7RidC40Lkg0L/QvtC00LTQtdGA0LbQutGDINGA0LXQttC40LzQsCDQvtGC0LvQsNC00LrQuCDQtNC70Y8g0LrQu9Cw0YHRgdCwIFNQbG90LlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTUGxvdERlYnVnIGltcGxlbWVudHMgU1Bsb3RIZWxwZXIge1xuXG4gIC8qKiDQn9GA0LjQt9C90LDQuiDQsNC60YLQuNCy0LDRhtC40Lgg0YDQtdC20LjQvCDQvtGC0LvQsNC00LrQuC4gKi9cbiAgcHVibGljIGlzRW5hYmxlOiBib29sZWFuID0gZmFsc2VcblxuICAvKiog0KHRgtC40LvRjCDQt9Cw0LPQvtC70L7QstC60LAg0YDQtdC20LjQvNCwINC+0YLQu9Cw0LTQutC4LiAqL1xuICBwdWJsaWMgaGVhZGVyU3R5bGU6IHN0cmluZyA9ICdmb250LXdlaWdodDogYm9sZDsgY29sb3I6ICNmZmZmZmY7IGJhY2tncm91bmQtY29sb3I6ICNjYzAwMDA7J1xuXG4gIC8qKiDQodGC0LjQu9GMINC30LDQs9C+0LvQvtCy0LrQsCDQs9GA0YPQv9C/0Ysg0L/QsNGA0LDQvNC10YLRgNC+0LIuICovXG4gIHB1YmxpYyBncm91cFN0eWxlOiBzdHJpbmcgPSAnZm9udC13ZWlnaHQ6IGJvbGQ7IGNvbG9yOiAjZmZmZmZmOydcblxuICAvKiog0J/RgNC40LfQvdCw0Log0YLQvtCz0L4sINGH0YLQviDRhdC10LvQv9C10YAg0YPQttC1INC90LDRgdGC0YDQvtC10L0uICovXG4gIHB1YmxpYyBpc1NldHVwZWQ6IGJvb2xlYW4gPSBmYWxzZVxuXG4gIC8qKiDQpdC10LvQv9C10YAg0LHRg9C00LXRgiDQuNC80LXRgtGMINC/0L7Qu9C90YvQuSDQtNC+0YHRgtGD0L8g0Log0Y3QutC30LXQvNC/0LvRj9GA0YMgU1Bsb3QuICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIHJlYWRvbmx5IHNwbG90OiBTUGxvdFxuICApIHt9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0J/QvtC00LPQvtGC0LDQstC70LjQstCw0LXRgiDRhdC10LvQv9C10YAg0Log0LjRgdC/0L7Qu9GM0LfQvtCy0LDQvdC40Y4uXG4gICAqL1xuICBwdWJsaWMgc2V0dXAoY2xlYXJDb25zb2xlOiBib29sZWFuID0gZmFsc2UpOiB2b2lkIHtcblxuICAgIGlmICghdGhpcy5pc1NldHVwZWQpIHtcblxuICAgICAgaWYgKGNsZWFyQ29uc29sZSkge1xuICAgICAgICBjb25zb2xlLmNsZWFyKClcbiAgICAgIH1cblxuICAgICAgdGhpcy5pc1NldHVwZWQgPSB0cnVlXG4gICAgfVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JLRi9Cy0L7QtNC40YIg0LIg0LrQvtC90YHQvtC70Ywg0L7RgtC70LDQtNC+0YfQvdGD0Y4g0LjQvdGE0L7RgNC80LDRhtC40Y4sINC10YHQu9C4INCy0LrQu9GO0YfQtdC9INGA0LXQttC40Lwg0L7RgtC70LDQtNC60LguXG4gICAqXG4gICAqIEByZW1hcmtzXG4gICAqINCe0YLQu9Cw0LTQvtGH0L3QsNGPINC40L3RhNC+0YDQvNCw0YbQuNGPINCy0YvQstC+0LTQuNGC0YHRjyDQsdC70L7QutCw0LzQuC4g0J3QsNC30LLQsNC90LjRjyDQsdC70L7QutC+0LIg0L/QtdGA0LXQtNCw0Y7RgtGB0Y8g0LIg0LzQtdGC0L7QtCDQv9C10YDQtdGH0LjRgdC70LXQvdC40LXQvCDRgdGC0YDQvtC6LiDQmtCw0LbQtNCw0Y8g0YHRgtGA0L7QutCwXG4gICAqINC40L3RgtC10YDQv9GA0LXRgtC40YDRg9C10YLRgdGPINC60LDQuiDQuNC80Y8g0LzQtdGC0L7QtNCwLiDQldGB0LvQuCDQvdGD0LbQvdGL0LUg0LzQtdGC0L7QtNGLINCy0YvQstC+0LTQsCDQsdC70L7QutCwINGB0YPRidC10YHRgtCy0YPRjtGCIC0g0L7QvdC4INCy0YvQt9GL0LLQsNGO0YLRgdGPLiDQldGB0LvQuCDQvNC10YLQvtC00LAg0YEg0L3Rg9C20L3Ri9C8XG4gICAqINC90LDQt9Cy0LDQvdC40LXQvCDQvdC1INGB0YPRidC10YHRgtCy0YPQtdGCIC0g0LPQtdC90LXRgNC40YDRg9C10YLRgdGPINC+0YjQuNCx0LrQsC5cbiAgICpcbiAgICogQHBhcmFtIGxvZ0l0ZW1zIC0g0J/QtdGA0LXRh9C40YHQu9C10L3QuNC1INGB0YLRgNC+0Log0YEg0L3QsNC30LLQsNC90LjRj9C80Lgg0L7RgtC70LDQtNC+0YfQvdGL0YUg0LHQu9C+0LrQvtCyLCDQutC+0YLQvtGA0YvQtSDQvdGD0LbQvdC+INC+0YLQvtCx0YDQsNC30LjRgtGMINCyINC60L7QvdGB0L7Qu9C4LlxuICAgKi9cbiAgcHVibGljIGxvZyguLi5sb2dJdGVtczogc3RyaW5nW10pOiB2b2lkIHtcbiAgICBpZiAodGhpcy5pc0VuYWJsZSkge1xuICAgICAgbG9nSXRlbXMuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZiAodGhpcyBhcyBhbnkpW2l0ZW1dID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgKHRoaXMgYXMgYW55KVtpdGVtXSgpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCfQntGC0LvQsNC00L7Rh9C90L7Qs9C+INCx0LvQvtC60LAgJyArIGl0ZW0gKyAnXCIg0L3QtSDRgdGD0YnQtdGB0YLQstGD0LXRgiEnKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCS0YvQstC+0LTQuNGCINGB0L7QvtCx0YnQtdC90LjQtSDQvtCxINC+0YjQuNCx0LrQtS5cbiAgICovXG4gIHB1YmxpYyBlcnJvcihtZXNzYWdlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5pc0VuYWJsZSkge1xuICAgICAgY29uc29sZS5lcnJvcihtZXNzYWdlKVxuICAgIH1cbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCS0YvQstC+0LTQuNGCINCy0YHRgtGD0L/QuNGC0LXQu9GM0L3Rg9GOINGH0LDRgdGC0Ywg0L4g0YDQtdC20LjQvNC1INC+0YLQu9Cw0LTQutC4LlxuICAgKi9cbiAgcHVibGljIGludHJvKCk6IHZvaWQge1xuICAgIGNvbnNvbGUubG9nKCclY9Ce0YLQu9Cw0LTQutCwIFNQbG90INC90LAg0L7QsdGK0LXQutGC0LUgIycgKyB0aGlzLnNwbG90LmNhbnZhcy5pZCwgdGhpcy5oZWFkZXJTdHlsZSlcblxuICAgIGlmICh0aGlzLnNwbG90LmRlbW8uaXNFbmFibGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKCclY9CS0LrQu9GO0YfQtdC9INC00LXQvNC+0L3RgdGC0YDQsNGG0LjQvtC90L3Ri9C5INGA0LXQttC40Lwg0LTQsNC90L3Ri9GFJywgdGhpcy5ncm91cFN0eWxlKVxuICAgIH1cblxuICAgIGNvbnNvbGUuZ3JvdXAoJyVj0J/RgNC10LTRg9C/0YDQtdC20LTQtdC90LjQtScsIHRoaXMuZ3JvdXBTdHlsZSlcbiAgICBjb25zb2xlLmxvZygn0J7RgtC60YDRi9GC0LDRjyDQutC+0L3RgdC+0LvRjCDQsdGA0LDRg9C30LXRgNCwINC4INC00YDRg9Cz0LjQtSDQsNC60YLQuNCy0L3Ri9C1INGB0YDQtdC00YHRgtCy0LAg0LrQvtC90YLRgNC+0LvRjyDRgNCw0LfRgNCw0LHQvtGC0LrQuCDRgdGD0YnQtdGB0YLQstC10L3QvdC+INGB0L3QuNC20LDRjtGCINC/0YDQvtC40LfQstC+0LTQuNGC0LXQu9GM0L3QvtGB0YLRjCDQstGL0YHQvtC60L7QvdCw0LPRgNGD0LbQtdC90L3Ri9GFINC/0YDQuNC70L7QttC10L3QuNC5LiDQlNC70Y8g0L7QsdGK0LXQutGC0LjQstC90L7Qs9C+INCw0L3QsNC70LjQt9CwINC/0YDQvtC40LfQstC+0LTQuNGC0LXQu9GM0L3QvtGB0YLQuCDQstGB0LUg0L/QvtC00L7QsdC90YvQtSDRgdGA0LXQtNGB0YLQstCwINC00L7Qu9C20L3RiyDQsdGL0YLRjCDQvtGC0LrQu9GO0YfQtdC90YssINCwINC60L7QvdGB0L7Qu9GMINCx0YB60LDRg9C30LXRgNCwINC30LDQutGA0YvRgtCwLiDQndC10LrQvtGC0L7RgNGL0LUg0LTQsNC90L3Ri9C1INC+0YLQu9Cw0LTQvtGH0L3QvtC5INC40L3RhNC+0YDQvNCw0YbQuNC4INCyINC30LDQstC40YHQuNC80L7RgdGC0Lgg0L7RgiDQuNGB0L/QvtC70YzQt9GD0LXQvNC+0LPQviDQsdGA0LDRg9C30LXRgNCwINC80L7Qs9GD0YIg0L3QtSDQvtGC0L7QsdGA0LDQttCw0YLRjNGB0Y8g0LjQu9C4INC+0YLQvtCx0YDQsNC20LDRgtGM0YHRjyDQvdC10LrQvtGA0YDQtdC60YLQvdC+LiDQodGA0LXQtNGB0YLQstC+INC+0YLQu9Cw0LTQutC4INC/0YDQvtGC0LXRgdGC0LjRgNC+0LLQsNC90L4g0LIg0LHRgNCw0YPQt9C10YDQtSBHb29nbGUgQ2hyb21lIHYuOTAnKVxuICAgIGNvbnNvbGUuZ3JvdXBFbmQoKVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JLRi9Cy0L7QtNC40YIg0LjQvdGE0L7RgNC80LDRhtC40Y4g0L4g0LPRgNCw0YTQuNGH0LXRgdC60L7QuSDRgdC40YHRgtC10LzQtSDQutC70LjQtdC90YLQsC5cbiAgICovXG4gIHB1YmxpYyBncHUoKTogdm9pZCB7XG4gICAgY29uc29sZS5ncm91cCgnJWPQktC40LTQtdC+0YHQuNGB0YLQtdC80LAnLCB0aGlzLmdyb3VwU3R5bGUpXG4gICAgY29uc29sZS5sb2coJ9CT0YDQsNGE0LjRh9C10YHQutCw0Y8g0LrQsNGA0YLQsDogJyArIHRoaXMuc3Bsb3Qud2ViZ2wuZ3B1LmhhcmR3YXJlKVxuICAgIGNvbnNvbGUubG9nKCfQktC10YDRgdC40Y8gR0w6ICcgKyB0aGlzLnNwbG90LndlYmdsLmdwdS5zb2Z0d2FyZSlcbiAgICBjb25zb2xlLmdyb3VwRW5kKClcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCS0YvQstC+0LTQuNGCINC40L3RhNC+0YDQvNCw0YbQuNGPINC+INGC0LXQutGD0YnQtdC8INGN0LrQt9C10LzQv9C70Y/RgNC1INC60LvQsNGB0YHQsCBTUGxvdC5cbiAgICovXG4gIHB1YmxpYyBpbnN0YW5jZSgpOiB2b2lkIHtcblxuICAgIGNvbnNvbGUuZ3JvdXAoJyVj0J3QsNGB0YLRgNC+0LnQutCwINC/0LDRgNCw0LzQtdGC0YDQvtCyINGN0LrQt9C10LzQv9C70Y/RgNCwJywgdGhpcy5ncm91cFN0eWxlKVxuICAgIGNvbnNvbGUuZGlyKHRoaXMuc3Bsb3QpXG4gICAgY29uc29sZS5sb2coJ9Cg0LDQt9C80LXRgCDQutCw0L3QstCw0YHQsDogJyArIHRoaXMuc3Bsb3QuY2FudmFzLndpZHRoICsgJyB4ICcgKyB0aGlzLnNwbG90LmNhbnZhcy5oZWlnaHQgKyAnIHB4JylcblxuICAgIGlmICh0aGlzLnNwbG90LmRlbW8uaXNFbmFibGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKCfQodC/0L7RgdC+0LEg0L/QvtC70YPRh9C10L3QuNGPINC00LDQvdC90YvRhTogJyArICfQtNC10LzQvi3QtNCw0L3QvdGL0LUnKVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZygn0KHQv9C+0YHQvtCxINC/0L7Qu9GD0YfQtdC90LjRjyDQtNCw0L3QvdGL0YU6ICcgKyAn0LjRgtC10YDQuNGA0L7QstCw0L3QuNC1JylcbiAgICB9XG4gICAgY29uc29sZS5ncm91cEVuZCgpXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQktGL0LLQvtC00LjRgiDQutC+0LTRiyDRiNC10LnQtNC10YDQvtCyLlxuICAgKi9cbiAgcHVibGljIHNoYWRlcnMoKTogdm9pZCB7XG4gICAgY29uc29sZS5ncm91cCgnJWPQodC+0LfQtNCw0L0g0LLQtdGA0YjQuNC90L3Ri9C5INGI0LXQudC00LXRgDogJywgdGhpcy5ncm91cFN0eWxlKVxuICAgIGNvbnNvbGUubG9nKHRoaXMuc3Bsb3QuZ2xzbC52ZXJ0U2hhZGVyU291cmNlKVxuICAgIGNvbnNvbGUuZ3JvdXBFbmQoKVxuICAgIGNvbnNvbGUuZ3JvdXAoJyVj0KHQvtC30LTQsNC9INGE0YDQsNCz0LzQtdC90YLQvdGL0Lkg0YjQtdC50LTQtdGAOiAnLCB0aGlzLmdyb3VwU3R5bGUpXG4gICAgY29uc29sZS5sb2codGhpcy5zcGxvdC5nbHNsLmZyYWdTaGFkZXJTb3VyY2UpXG4gICAgY29uc29sZS5ncm91cEVuZCgpXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQktGL0LLQvtC00LjRgiDRgdC+0L7QsdGJ0LXQvdC40LUg0L4g0L3QsNGH0LDQu9C1INC/0YDQvtGG0LXRgdGB0LUg0LfQsNCz0YDRg9C30LrQuCDQtNCw0L3QvdGL0YUuXG4gICAqL1xuICBwdWJsaWMgbG9hZGluZygpOiB2b2lkIHtcbiAgICBjb25zb2xlLmxvZygnJWPQl9Cw0L/Rg9GJ0LXQvSDQv9GA0L7RhtC10YHRgSDQt9Cw0LPRgNGD0LfQutC4INC00LDQvdC90YvRhSBbJyArIGdldEN1cnJlbnRUaW1lKCkgKyAnXS4uLicsIHRoaXMuZ3JvdXBTdHlsZSlcbiAgICBjb25zb2xlLnRpbWUoJ9CU0LvQuNGC0LXQu9GM0L3QvtGB0YLRjCcpXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQktGL0LLQvtC00LjRgiDRgdGC0LDRgtC40YHRgtC40LrRgyDQv9C+INC30LDQstC10YDRiNC10L3QuNC4INC/0YDQvtGG0LXRgdGB0LAg0LfQsNCz0YDRg9C30LrQuCDQtNCw0L3QvdGL0YUuXG4gICAqL1xuICBwdWJsaWMgbG9hZGVkKCk6IHZvaWQge1xuICAgIGNvbnNvbGUuZ3JvdXAoJyVj0JfQsNCz0YDRg9C30LrQsCDQtNCw0L3QvdGL0YUg0LfQsNCy0LXRgNGI0LXQvdCwIFsnICsgZ2V0Q3VycmVudFRpbWUoKSArICddJywgdGhpcy5ncm91cFN0eWxlKVxuICAgIGNvbnNvbGUudGltZUVuZCgn0JTQu9C40YLQtdC70YzQvdC+0YHRgtGMJylcbiAgICBjb25zb2xlLmxvZygn0KDQtdC30YPQu9GM0YLQsNGCOiAnICsgKCh0aGlzLnNwbG90LnN0YXRzLm9ialRvdGFsQ291bnQgPj0gdGhpcy5zcGxvdC5nbG9iYWxMaW1pdCkgP1xuICAgICAgJ9C00L7RgdGC0LjQs9C90YPRgiDQu9C40LzQuNGCINC+0LHRitC10LrRgtC+0LIgKCcgKyB0aGlzLnNwbG90Lmdsb2JhbExpbWl0LnRvTG9jYWxlU3RyaW5nKCkgKyAnKScgOlxuICAgICAgJ9C+0LHRgNCw0LHQvtGC0LDQvdGLINCy0YHQtSDQvtCx0YrQtdC60YLRiycpKVxuICAgIGNvbnNvbGUubG9nKCfQoNCw0YHRhdC+0LQg0LLQuNC00LXQvtC/0LDQvNGP0YLQuDogJyArICh0aGlzLnNwbG90LnN0YXRzLm1lbVVzYWdlIC8gMTAwMDAwMCkudG9GaXhlZCgyKS50b0xvY2FsZVN0cmluZygpICsgJyDQnNCRJylcbiAgICBjb25zb2xlLmxvZygn0JrQvtC7LdCy0L4g0L7QsdGK0LXQutGC0L7QsjogJyArIHRoaXMuc3Bsb3Quc3RhdHMub2JqVG90YWxDb3VudC50b0xvY2FsZVN0cmluZygpKVxuICAgIGNvbnNvbGUubG9nKCfQodC+0LfQtNCw0L3QviDQstC40LTQtdC+0LHRg9GE0LXRgNC+0LI6ICcgKyB0aGlzLnNwbG90LnN0YXRzLmdyb3Vwc0NvdW50LnRvTG9jYWxlU3RyaW5nKCkpXG4gICAgY29uc29sZS5sb2coYNCT0YDRg9C/0L/QuNGA0L7QstC60LAg0LLQuNC00LXQvtCx0YPRhNC10YDQvtCyOiAke3RoaXMuc3Bsb3QuYXJlYS5jb3VudH0geCAke3RoaXMuc3Bsb3QuYXJlYS5jb3VudH1gKVxuICAgIGNvbnNvbGUubG9nKGDQqNCw0LMg0LTQtdC70LXQvdC40Y8g0L3QsCDQs9GA0YPQv9C/0Ys6ICR7dGhpcy5zcGxvdC5hcmVhLnN0ZXB9YClcbiAgICBjb25zb2xlLmxvZygn0KDQsNC30LzQtdGA0Ysg0L7QsdGK0LXQutGC0L7QsjogbWluID0gJyArIHRoaXMuc3Bsb3Quc3RhdHMubWluT2JqZWN0U2l6ZSArICc7IG1heCA9ICcgKyB0aGlzLnNwbG90LnN0YXRzLm1heE9iamVjdFNpemUpXG4gICAgY29uc29sZS5ncm91cEVuZCgpXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQktGL0LLQvtC00LjRgiDRgdC+0L7QsdGJ0LXQvdC40LUg0L4g0LfQsNC/0YPRgdC60LUg0YDQtdC90LTQtdGA0LAuXG4gICAqL1xuICBwdWJsaWMgc3RhcnRlZCgpOiB2b2lkIHtcbiAgICBjb25zb2xlLmxvZygnJWPQoNC10L3QtNC10YAg0LfQsNC/0YPRidC10L0nLCB0aGlzLmdyb3VwU3R5bGUpXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQktGL0LLQvtC00LjRgiDRgdC+0L7QsdGJ0LXQvdC40LUg0L7QsSDQvtGB0YLQsNC90L7QstC60LUg0YDQtdC90LTQtdGA0LAuXG4gICAqL1xuICBwdWJsaWMgc3RvcGVkKCk6IHZvaWQge1xuICAgIGNvbnNvbGUubG9nKCclY9Cg0LXQvdC00LXRgCDQvtGB0YLQsNC90L7QstC70LXQvScsIHRoaXMuZ3JvdXBTdHlsZSlcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCS0YvQstC+0LTQuNGCINGB0L7QvtCx0YjQtdC90LjQtSDQvtCxINC+0YfQuNGB0YLQutC1INC+0LHQu9Cw0YHRgtC4INGA0LXQvdC00LXRgNCwLlxuICAgKi9cbiAgcHVibGljIGNsZWFyZWQoY29sb3I6IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnNvbGUubG9nKCclY9Ce0LHQu9Cw0YHRgtGMINGA0LXQvdC00LXRgNCwINC+0YfQuNGJ0LXQvdCwIFsnICsgY29sb3IgKyAnXScsIHRoaXMuZ3JvdXBTdHlsZSk7XG4gIH1cbn1cbiIsImltcG9ydCBTUGxvdCBmcm9tICdAL3NwbG90J1xuaW1wb3J0IHsgcmFuZG9tSW50IH0gZnJvbSAnQC91dGlscydcblxuLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqXG4gKiDQmtC70LDRgdGBLdGF0LXQu9C/0LXRgCwg0YDQtdCw0LvQuNC30YPRjtGJ0LjQuSDQv9C+0LTQtNC10YDQttC60YMg0YDQtdC20LjQvNCwINC00LXQvNC+0L3RgdGC0YDQsNGG0LjQvtC90L3Ri9GFINC00LDQvdC90YvRhSDQtNC70Y8g0LrQu9Cw0YHRgdCwIFNQbG90LlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTUGxvdERlbW8gaW1wbGVtZW50cyBTUGxvdEhlbHBlciB7XG5cbiAgLyoqINCf0YDQuNC30L3QsNC6INCw0LrRgtC40LLQsNGG0LjQuCDQtNC10LzQvi3RgNC10LbQuNC80LAuICovXG4gIHB1YmxpYyBpc0VuYWJsZTogYm9vbGVhbiA9IGZhbHNlXG5cbiAgLyoqINCa0L7Qu9C40YfQtdGB0YLQstC+INCx0YrQtdC60YLQvtCyLiAqL1xuICBwdWJsaWMgYW1vdW50OiBudW1iZXIgPSAxXzAwMF8wMDBcblxuICAvKiog0JzQuNC90LjQvNCw0LvRjNC90YvQuSDRgNCw0LfQvNC10YAg0L7QsdGK0LXQutGC0L7Qsi4gKi9cbiAgcHVibGljIHNpemVNaW46IG51bWJlciA9IDEwXG5cbiAgLyoqINCc0LDQutGB0LjQvNCw0LvRjNC90YvQuSDRgNCw0LfQvNC10YAg0L7QsdGK0LXQutGC0L7Qsi4gKi9cbiAgcHVibGljIHNpemVNYXg6IG51bWJlciA9IDMwXG5cbiAgLyoqINCm0LLQtdGC0L7QstCw0Y8g0L/QsNC70LjRgtGA0LAg0L7QsdGK0LXQutGC0L7Qsi4gKi9cbiAgcHVibGljIGNvbG9yczogc3RyaW5nW10gPSBbXG4gICAgJyNEODFDMDEnLCAnI0U5OTY3QScsICcjQkE1NUQzJywgJyNGRkQ3MDAnLCAnI0ZGRTRCNScsICcjRkY4QzAwJyxcbiAgICAnIzIyOEIyMicsICcjOTBFRTkwJywgJyM0MTY5RTEnLCAnIzAwQkZGRicsICcjOEI0NTEzJywgJyMwMENFRDEnXG4gIF1cblxuICAvKiog0J/RgNC40LfQvdCw0Log0YLQvtCz0L4sINGH0YLQviDRhdC10LvQv9C10YAg0YPQttC1INC90LDRgdGC0YDQvtC10L0uICovXG4gIHB1YmxpYyBpc1NldHVwZWQ6IGJvb2xlYW4gPSBmYWxzZVxuXG4gIC8qKiDQodGH0LXRgtGH0LjQuiDQuNGC0LXRgNC40YDRg9C10LzRi9GFINC+0LHRitC10LrRgtC+0LIuICovXG4gIHByaXZhdGUgaW5kZXg6IG51bWJlciA9IDBcblxuICAvKiog0KXQtdC70L/QtdGAINCx0YPQtNC10YIg0LjQvNC10YLRjCDQv9C+0LvQvdGL0Lkg0LTQvtGB0YLRg9C/INC6INGN0LrQt9C10LzQv9C70Y/RgNGDIFNQbG90LiAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICByZWFkb25seSBzcGxvdDogU1Bsb3RcbiAgKSB7fVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCf0L7QtNCz0L7RgtCw0LLQu9C40LLQsNC10YIg0YXQtdC70L/QtdGAINC6INC40YHQv9C+0LvRjNC30L7QstCw0L3QuNGOLlxuICAgKi9cbiAgcHVibGljIHNldHVwKCk6IHZvaWQge1xuXG4gICAgLyoqINCl0LXQu9C/0LXRgCDQtNC10LzQvi3RgNC10LbQuNC80LAg0LLRi9C/0L7Qu9C90Y/QtdGCINC90LDRgdGC0YDQvtC50LrRgyDQstGB0LXRhSDRgdCy0L7QuNGFINC/0LDRgNCw0LzQtdGC0YDQvtCyINC00LDQttC1INC10YHQu9C4INC+0L3QsCDRg9C20LUg0LLRi9C/0L7Qu9C90Y/Qu9Cw0YHRjC4gKi9cbiAgICBpZiAoIXRoaXMuaXNTZXR1cGVkKSB7XG4gICAgICB0aGlzLmlzU2V0dXBlZCA9IHRydWVcbiAgICB9XG5cbiAgICAvKiog0J7QsdC90YPQu9C10L3QuNC1INGB0YfQtdGC0YfQuNC60LAg0LjRgtC10YDQsNGC0L7RgNCwLiAqL1xuICAgIHRoaXMuaW5kZXggPSAwXG5cbiAgICAvKiog0J/QvtC00LPQvtGC0L7QstC60LAg0LTQtdC80L4t0YDQtdC20LjQvNCwICjQtdGB0LvQuCDRgtGA0LXQsdGD0LXRgtGB0Y8pLiAqL1xuICAgIGlmICh0aGlzLnNwbG90LmRlbW8uaXNFbmFibGUpIHtcbiAgICAgIHRoaXMuc3Bsb3QuaXRlcmF0b3IgPSB0aGlzLnNwbG90LmRlbW8uaXRlcmF0b3IuYmluZCh0aGlzKVxuICAgICAgdGhpcy5zcGxvdC5jb2xvcnMgPSB0aGlzLnNwbG90LmRlbW8uY29sb3JzXG4gICAgfVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JjQvNC40YLQuNGA0YPQtdGCINC40YLQtdGA0LDRgtC+0YAg0LjRgdGF0L7QtNC90YvRhSDQvtCx0YrQtdC60YLQvtCyLlxuICAgKi9cbiAgcHVibGljIGl0ZXJhdG9yKCk6IFNQbG90T2JqZWN0IHwgbnVsbCB7XG4gICAgaWYgKHRoaXMuaW5kZXggPCB0aGlzLmFtb3VudCkge1xuICAgICAgdGhpcy5pbmRleCsrXG4gICAgICByZXR1cm4ge1xuICAgICAgICB4OiBNYXRoLnJhbmRvbSgpLFxuICAgICAgICB5OiBNYXRoLnJhbmRvbSgpLFxuICAgICAgICBzaGFwZTogcmFuZG9tSW50KHRoaXMuc3Bsb3Quc2hhcGVzQ291bnQhKSxcbiAgICAgICAgc2l6ZTogdGhpcy5zaXplTWluICsgcmFuZG9tSW50KHRoaXMuc2l6ZU1heCAtIHRoaXMuc2l6ZU1pbiArIDEpLFxuICAgICAgICBjb2xvcjogcmFuZG9tSW50KHRoaXMuY29sb3JzLmxlbmd0aClcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IFNQbG90IGZyb20gJ0Avc3Bsb3QnXG5pbXBvcnQgKiBhcyBzaGFkZXJzIGZyb20gJ0Avc2hhZGVycydcbmltcG9ydCB7IGNvbG9yRnJvbUhleFRvR2xSZ2IgfSBmcm9tICdAL3V0aWxzJ1xuXG4vKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICpcbiAqINCa0LvQsNGB0YEt0YXQtdC70L/QtdGALCDRg9C/0YDQsNCy0LvRj9GO0YnQuNC5IEdMU0wt0LrQvtC00L7QvCDRiNC10LnQtNC10YDQvtCyLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTUGxvdEdsc2wgaW1wbGVtZW50cyBTUGxvdEhlbHBlciB7XG5cbiAgLyoqINCa0L7QtNGLINGI0LXQudC00LXRgNC+0LIuICovXG4gIHB1YmxpYyB2ZXJ0U2hhZGVyU291cmNlOiBzdHJpbmcgPSAnJ1xuICBwdWJsaWMgZnJhZ1NoYWRlclNvdXJjZTogc3RyaW5nID0gJydcblxuICAvKiog0J/RgNC40LfQvdCw0Log0YLQvtCz0L4sINGH0YLQviDRhdC10LvQv9C10YAg0YPQttC1INC90LDRgdGC0YDQvtC10L0uICovXG4gIHB1YmxpYyBpc1NldHVwZWQ6IGJvb2xlYW4gPSBmYWxzZVxuXG4gIC8qKiDQpdC10LvQv9C10YAg0LHRg9C00LXRgiDQuNC80LXRgtGMINC/0L7Qu9C90YvQuSDQtNC+0YHRgtGD0L8g0Log0Y3QutC30LXQvNC/0LvRj9GA0YMgU1Bsb3QuICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIHJlYWRvbmx5IHNwbG90OiBTUGxvdFxuICApIHt9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0J/QvtC00LPQvtGC0LDQstC70LjQstCw0LXRgiDRhdC10LvQv9C10YAg0Log0LjRgdC/0L7Qu9GM0LfQvtCy0LDQvdC40Y4uXG4gICAqL1xuICBwdWJsaWMgc2V0dXAoKTogdm9pZCB7XG5cbiAgICBpZiAoIXRoaXMuaXNTZXR1cGVkKSB7XG5cbiAgICAgIC8qKiDQodCx0L7RgNC60LAg0LrQvtC00L7QsiDRiNC10LnQtNC10YDQvtCyLiAqL1xuICAgICAgdGhpcy52ZXJ0U2hhZGVyU291cmNlID0gdGhpcy5tYWtlVmVydFNoYWRlclNvdXJjZSgpXG4gICAgICB0aGlzLmZyYWdTaGFkZXJTb3VyY2UgPSB0aGlzLm1ha2VGcmFnU2hhZGVyU291cmNlKClcblxuICAgICAgLyoqINCS0YvRh9C40YHQu9C10L3QuNC1INC60L7Qu9C40YfQtdGB0YLQstCwINGA0LDQt9C70LjRh9C90YvRhSDRhNC+0YDQvCDQvtCx0YrQtdC60YLQvtCyLiAqL1xuICAgICAgdGhpcy5zcGxvdC5zaGFwZXNDb3VudCA9IHNoYWRlcnMuU0hBUEVTLmxlbmd0aFxuXG4gICAgICB0aGlzLmlzU2V0dXBlZCA9IHRydWVcbiAgICB9XG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQodC+0LfQtNCw0LXRgiDQutC+0LQg0LLQtdGA0YjQuNC90L3QvtCz0L4g0YjQtdC50LTQtdGA0LAuXG4gICAqXG4gICAqIEByZW1hcmtzXG4gICAqINCSINGI0LDQsdC70L7QvSDQstC10YDRiNC40L3QvdC+0LPQviDRiNC10LnQtNC10YDQsCDQstGB0YLQsNCy0LvRj9C10YLRgdGPINC60L7QtCDQstGL0LHQvtGA0LAg0YbQstC10YLQsCDQvtCx0YrQtdC60YLQsCDQv9C+INC40L3QtNC10LrRgdGDINGG0LLQtdGC0LAuINCiLtC6LtGI0LXQudC00LXRgCDQvdC1INC/0L7Qt9Cy0L7Qu9GP0LXRglxuICAgKiDQuNGB0L/QvtC70YzQt9C+0LLQsNGC0Ywg0LIg0LrQsNGH0LXRgdGC0LLQtSDQuNC90LTQtdC60YHQvtCyINC/0LXRgNC10LzQtdC90L3Ri9C1IC0g0LTQu9GPINC30LDQtNCw0L3QuNGPINGG0LLQtdGC0LAg0LjRgdC/0L7Qu9GM0LfRg9C10YLRgdGPINC/0L7RgdC70LXQtNC+0LLQsNGC0LXQu9GM0L3Ri9C5INC/0LXRgNC10LHQvtGAINGG0LLQtdGC0L7QstGL0YVcbiAgICog0LjQvdC00LXQutGB0L7Qsi5cbiAgICovXG4gIHByaXZhdGUgbWFrZVZlcnRTaGFkZXJTb3VyY2UoKSB7XG5cbiAgICAvKiog0JLRgNC10LzQtdC90L3QvtC1INC00L7QsdCw0LLQu9C10L3QuNC1INCyINC/0LDQu9C40YLRgNGDINCy0LXRgNGI0LjQvSDRhtCy0LXRgtCwINC90LDQv9GA0LDQstC70Y/RjtGJ0LjRhS4gKi9cbiAgICB0aGlzLnNwbG90LmNvbG9ycy5wdXNoKHRoaXMuc3Bsb3QuZ3JpZC5ydWxlc0NvbG9yISlcblxuICAgIGxldCBjb2RlOiBzdHJpbmcgPSAnJ1xuXG4gICAgLyoqINCk0L7RgNC80LjRgNC+0LLQvdC40LUg0LrQvtC00LAg0YPRgdGC0LDQvdC+0LLQutC4INGG0LLQtdGC0LAg0L7QsdGK0LXQutGC0LAg0L/QviDQuNC90LTQtdC60YHRgy4gKi9cbiAgICB0aGlzLnNwbG90LmNvbG9ycy5mb3JFYWNoKCh2YWx1ZSwgaW5kZXgpID0+IHtcbiAgICAgIGxldCBbciwgZywgYl0gPSBjb2xvckZyb21IZXhUb0dsUmdiKHZhbHVlKVxuICAgICAgY29kZSArPSBgZWxzZSBpZiAoYV9jb2xvciA9PSAke2luZGV4fS4wKSB2X2NvbG9yID0gdmVjMygke3J9LCAke2d9LCAke2J9KTtcXG5gXG4gICAgfSlcblxuICAgIC8qKiDQo9C00LDQu9C10L3QuNC1INC40Lcg0L/QsNC70LjRgtGA0Ysg0LLQtdGA0YjQuNC9INCy0YDQtdC80LXQvdC90L4g0LTQvtCx0LDQstC70LXQvdC90L7Qs9C+INGG0LLQtdGC0LAg0L3QsNC/0YDQsNCy0LvRj9GO0YnQuNGFLiAqL1xuICAgIHRoaXMuc3Bsb3QuY29sb3JzLnBvcCgpXG5cbiAgICAvKiog0KPQtNCw0LvQtdC90LjQtSDQu9C40YjQvdC10LPQviBcImVsc2VcIiDQsiDQvdCw0YfQsNC70LUg0LrQvtC00LAg0Lgg0LvQuNGI0L3QtdCz0L4g0L/QtdGA0LXQstC+0LTQsCDRgdGC0YDQvtC60Lgg0LIg0LrQvtC90YbQtS4gKi9cbiAgICBjb2RlID0gY29kZS5zbGljZSg1KS5zbGljZSgwLCAtMSlcblxuICAgIHJldHVybiBzaGFkZXJzLlZFUlRFWF9URU1QTEFURS5yZXBsYWNlKCd7Q09MT1ItU0VMRUNUSU9OfScsIGNvZGUpLnRyaW0oKVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0KHQvtC30LTQsNC10YIg0LrQvtC0INGE0YDQsNCz0LzQtdC90YLQvdC+0LPQviDRiNC10LnQtNC10YDQsC5cbiAgICovXG4gIHByaXZhdGUgbWFrZUZyYWdTaGFkZXJTb3VyY2UoKSB7XG5cbiAgICBsZXQgY29kZTE6IHN0cmluZyA9ICcnXG4gICAgbGV0IGNvZGUyOiBzdHJpbmcgPSAnJ1xuXG4gICAgc2hhZGVycy5TSEFQRVMuZm9yRWFjaCgodmFsdWUsIGluZGV4KSA9PiB7XG5cbiAgICAgIC8qKiDQpNC+0YDQvNC40YDQvtCy0LDQvdC40LUg0LrQvtC00LAg0YTRg9C90LrRhtC40LksINC+0L/QuNGB0YvQstCw0Y7RidC40YUg0YTQvtGA0LzRiyDQvtCx0YrQtdC60YLQvtCyLiAqL1xuICAgICAgY29kZTEgKz0gYHZvaWQgcyR7aW5kZXh9KCkgeyAke3ZhbHVlLnRyaW0oKX0gfVxcbmBcblxuICAgICAgLyoqINCk0L7RgNC80LjRgNC+0LLQsNC90LjQtSDQutC+0LTQsCDRg9GB0YLQsNC90L7QstC60Lgg0YTQvtGA0LzRiyDQvtCx0YrQtdC60YLQsCDQv9C+INC40L3QtNC10LrRgdGDLiAqL1xuICAgICAgY29kZTIgKz0gYGVsc2UgaWYgKHZfc2hhcGUgPT0gJHtpbmRleH0uMCkgeyBzJHtpbmRleH0oKTt9XFxuYFxuICAgIH0pXG5cbiAgICAvKiog0KPQtNCw0LvQtdC90LjQtSDQu9C40YjQvdC10LPQviDQv9C10YDQtdCy0L7QtNCwINGB0YLRgNC+0LrQuCDQsiDQutC+0L3RhtC1LiAqL1xuICAgIGNvZGUxID0gY29kZTEuc2xpY2UoMCwgLTEpXG5cbiAgICAvKiog0KPQtNCw0LvQtdC90LjQtSDQu9C40YjQvdC10LPQviBcImVsc2VcIiDQsiDQvdCw0YfQsNC70LUg0LrQvtC00LAg0Lgg0LvQuNGI0L3QtdCz0L4g0L/QtdGA0LXQstC+0LTQsCDRgdGC0YDQvtC60Lgg0LIg0LrQvtC90YbQtS4gKi9cbiAgICBjb2RlMiA9IGNvZGUyLnNsaWNlKDUpLnNsaWNlKDAsIC0xKVxuXG4gICAgcmV0dXJuIHNoYWRlcnMuRlJBR01FTlRfVEVNUExBVEUuXG4gICAgICByZXBsYWNlKCd7U0hBUEVTLUZVTkNUSU9OU30nLCBjb2RlMSkuXG4gICAgICByZXBsYWNlKCd7U0hBUEUtU0VMRUNUSU9OfScsIGNvZGUyKS5cbiAgICAgIHRyaW0oKVxuICB9XG59XG4iLCJpbXBvcnQgU1Bsb3QgZnJvbSAnQC9zcGxvdCdcbmltcG9ydCB7IGNvbG9yRnJvbUhleFRvR2xSZ2IgfSBmcm9tICdAL3V0aWxzJ1xuXG4vKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICpcbiAqINCa0LvQsNGB0YEt0YXQtdC70L/QtdGALCDRgNC10LDQu9C40LfRg9GO0YnQuNC5INGD0L/RgNCw0LLQu9C10L3QuNC1INC60L7QvdGC0LXQutGB0YLQvtC8INGA0LXQvdC00LXRgNC40L3Qs9CwIFdlYkdMINC60LvQsNGB0YHQsCBTcGxvdC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU1Bsb3RXZWJHbCBpbXBsZW1lbnRzIFNQbG90SGVscGVyIHtcblxuICAvKiog0J/QsNGA0LDQvNC10YLRgNGLINC40L3QuNGG0LjQsNC70LjQt9Cw0YbQuNC4INC60L7QvdGC0LXQutGB0YLQsCDRgNC10L3QtNC10YDQuNC90LPQsCBXZWJHTC4gKi9cbiAgcHVibGljIGFscGhhOiBib29sZWFuID0gZmFsc2VcbiAgcHVibGljIGRlcHRoOiBib29sZWFuID0gZmFsc2VcbiAgcHVibGljIHN0ZW5jaWw6IGJvb2xlYW4gPSBmYWxzZVxuICBwdWJsaWMgYW50aWFsaWFzOiBib29sZWFuID0gZmFsc2VcbiAgcHVibGljIGRlc3luY2hyb25pemVkOiBib29sZWFuID0gdHJ1ZVxuICBwdWJsaWMgcHJlbXVsdGlwbGllZEFscGhhOiBib29sZWFuID0gZmFsc2VcbiAgcHVibGljIHByZXNlcnZlRHJhd2luZ0J1ZmZlcjogYm9vbGVhbiA9IGZhbHNlXG4gIHB1YmxpYyBmYWlsSWZNYWpvclBlcmZvcm1hbmNlQ2F2ZWF0OiBib29sZWFuID0gdHJ1ZVxuICBwdWJsaWMgcG93ZXJQcmVmZXJlbmNlOiBXZWJHTFBvd2VyUHJlZmVyZW5jZSA9ICdoaWdoLXBlcmZvcm1hbmNlJ1xuXG4gIC8qKiDQndCw0LfQstCw0L3QuNGPINGN0LvQtdC80LXQvdGC0L7QsiDQs9GA0LDRhNC40YfQtdGB0LrQvtC5INGB0LjRgdGC0LXQvNGLINC60LvQuNC10L3RgtCwLiAqL1xuICBwdWJsaWMgZ3B1ID0geyBoYXJkd2FyZTogJy0nLCBzb2Z0d2FyZTogJy0nIH1cblxuICAvKiog0JrQvtC90YLQtdC60YHRgiDRgNC10L3QtNC10YDQuNC90LPQsCDQuCDQv9GA0L7Qs9GA0LDQvNC80LAgV2ViR0wuICovXG4gIHB1YmxpYyBnbCE6IFdlYkdMUmVuZGVyaW5nQ29udGV4dFxuICBwcml2YXRlIGdwdVByb2dyYW0hOiBXZWJHTFByb2dyYW1cblxuICAvKiog0J/QtdGA0LXQvNC10L3QvdGL0LUg0LTQu9GPINGB0LLRj9C30Lgg0L/RgNC40LvQvtC20LXQvdC40Y8g0YEg0L/RgNC+0LPRgNCw0LzQvNC+0LkgV2ViR0wuICovXG4gIHByaXZhdGUgdmFyaWFibGVzOiBNYXA8c3RyaW5nLCBhbnk+ID0gbmV3IE1hcCgpXG5cbiAgLyoqINCf0YDQuNC30L3QsNC6INGC0L7Qs9C+LCDRh9GC0L4g0YXQtdC70L/QtdGAINGD0LbQtSDQvdCw0YHRgtGA0L7QtdC9LiAqL1xuICBwdWJsaWMgaXNTZXR1cGVkOiBib29sZWFuID0gZmFsc2VcblxuICAvKiog0JHRg9GE0LXRgNGLINCy0LjQtNC10L7Qv9Cw0LzRj9GC0LggV2ViR0wuICovXG4gIHB1YmxpYyBkYXRhOiBhbnlbXSA9IFtdXG5cbiAgcHJpdmF0ZSBncm91cFR5cGU6IG51bWJlcltdID0gW11cblxuICAvKiog0J/RgNCw0LLQuNC70LAg0YHQvtC+0YLQstC10YLRgdGC0LLQuNGPINGC0LjQv9C+0LIg0YLQuNC/0LjQt9C40YDQvtCy0LDQvdC90YvRhSDQvNCw0YHRgdC40LLQvtCyINC4INGC0LjQv9C+0LIg0L/QtdGA0LXQvNC10L3QvdGL0YUgV2ViR0wuICovXG4gIHByaXZhdGUgZ2xOdW1iZXJUeXBlczogTWFwPHN0cmluZywgbnVtYmVyPiA9IG5ldyBNYXAoW1xuICAgIFsnSW50OEFycmF5JywgMHgxNDAwXSwgICAgICAgLy8gZ2wuQllURVxuICAgIFsnVWludDhBcnJheScsIDB4MTQwMV0sICAgICAgLy8gZ2wuVU5TSUdORURfQllURVxuICAgIFsnSW50MTZBcnJheScsIDB4MTQwMl0sICAgICAgLy8gZ2wuU0hPUlRcbiAgICBbJ1VpbnQxNkFycmF5JywgMHgxNDAzXSwgICAgIC8vIGdsLlVOU0lHTkVEX1NIT1JUXG4gICAgWydGbG9hdDMyQXJyYXknLCAweDE0MDZdICAgICAvLyBnbC5GTE9BVFxuICBdKVxuXG4gIC8qKiDQpdC10LvQv9C10YAg0LHRg9C00LXRgiDQuNC80LXRgtGMINC/0L7Qu9C90YvQuSDQtNC+0YHRgtGD0L8g0Log0Y3QutC30LXQvNC/0LvRj9GA0YMgU1Bsb3QuICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIHJlYWRvbmx5IHNwbG90OiBTUGxvdFxuICApIHsgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCf0L7QtNCz0L7RgtCw0LLQu9C40LLQsNC10YIg0YXQtdC70L/QtdGAINC6INC40YHQv9C+0LvRjNC30L7QstCw0L3QuNGOLlxuICAgKi9cbiAgcHVibGljIHNldHVwKCk6IHZvaWQge1xuXG4gICAgLyoqINCn0LDRgdGC0Ywg0L/QsNGA0LDQvNC10YLRgNC+0LIg0YXQtdC70L/QtdGA0LAgV2ViR0wg0LjQvdC40YbQuNCw0LvQuNC30LjRgNGD0LXRgtGB0Y8g0YLQvtC70YzQutC+INC+0LTQuNC9INGA0LDQty4gKi9cbiAgICBpZiAoIXRoaXMuaXNTZXR1cGVkKSB7XG5cbiAgICAgIHRoaXMuZ2wgPSB0aGlzLnNwbG90LmNhbnZhcy5nZXRDb250ZXh0KCd3ZWJnbCcsIHtcbiAgICAgICAgYWxwaGE6IHRoaXMuYWxwaGEsXG4gICAgICAgIGRlcHRoOiB0aGlzLmRlcHRoLFxuICAgICAgICBzdGVuY2lsOiB0aGlzLnN0ZW5jaWwsXG4gICAgICAgIGFudGlhbGlhczogdGhpcy5hbnRpYWxpYXMsXG4gICAgICAgIGRlc3luY2hyb25pemVkOiB0aGlzLmRlc3luY2hyb25pemVkLFxuICAgICAgICBwcmVtdWx0aXBsaWVkQWxwaGE6IHRoaXMucHJlbXVsdGlwbGllZEFscGhhLFxuICAgICAgICBwcmVzZXJ2ZURyYXdpbmdCdWZmZXI6IHRoaXMucHJlc2VydmVEcmF3aW5nQnVmZmVyLFxuICAgICAgICBmYWlsSWZNYWpvclBlcmZvcm1hbmNlQ2F2ZWF0OiB0aGlzLmZhaWxJZk1ham9yUGVyZm9ybWFuY2VDYXZlYXQsXG4gICAgICAgIHBvd2VyUHJlZmVyZW5jZTogdGhpcy5wb3dlclByZWZlcmVuY2VcbiAgICAgIH0pIVxuXG4gICAgICBpZiAodGhpcy5nbCA9PT0gbnVsbCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ9Ce0YjQuNCx0LrQsCDRgdC+0LfQtNCw0L3QuNGPINC60L7QvdGC0LXQutGB0YLQsCDRgNC10L3QtNC10YDQuNC90LPQsCBXZWJHTCEnKVxuICAgICAgfVxuXG4gICAgICAvKiog0J/QvtC70YPRh9C10L3QuNC1INC40L3RhNC+0YDQvNCw0YbQuNC4INC+INCz0YDQsNGE0LjRh9C10YHQutC+0Lkg0YHQuNGB0YLQtdC80LUg0LrQu9C40LXQvdGC0LAuICovXG4gICAgICBsZXQgZXh0ID0gdGhpcy5nbC5nZXRFeHRlbnNpb24oJ1dFQkdMX2RlYnVnX3JlbmRlcmVyX2luZm8nKVxuICAgICAgdGhpcy5ncHUuaGFyZHdhcmUgPSAoZXh0KSA/IHRoaXMuZ2wuZ2V0UGFyYW1ldGVyKGV4dC5VTk1BU0tFRF9SRU5ERVJFUl9XRUJHTCkgOiAnW9C90LXQuNC30LLQtdGB0YLQvdC+XSdcbiAgICAgIHRoaXMuZ3B1LnNvZnR3YXJlID0gdGhpcy5nbC5nZXRQYXJhbWV0ZXIodGhpcy5nbC5WRVJTSU9OKVxuXG4gICAgICB0aGlzLnNwbG90LmRlYnVnLmxvZygnZ3B1JylcblxuICAgICAgLyoqINCh0L7Qt9C00LDQvdC40LUg0L/RgNC+0LPRgNCw0LzQvNGLIFdlYkdMLiAqL1xuICAgICAgdGhpcy5jcmVhdGVQcm9ncmFtKHRoaXMuc3Bsb3QuZ2xzbC52ZXJ0U2hhZGVyU291cmNlLCB0aGlzLnNwbG90Lmdsc2wuZnJhZ1NoYWRlclNvdXJjZSlcblxuICAgICAgdGhpcy5pc1NldHVwZWQgPSB0cnVlXG4gICAgfVxuXG4gICAgLyoqINCU0YDRg9Cz0LDRjyDRh9Cw0YHRgtGMINC/0LDRgNCw0LzQtdGC0YDQvtCyINGF0LXQu9C/0LXRgNCwIFdlYkdMINC40L3QuNGG0LjQsNC70LjQt9C40YDRg9C10YLRgdGPINC/0YDQuCDQutCw0LbQtNC+0Lwg0LLRi9C30L7QstC1INC80LXRgtC+0LTQsCBzZXR1cC4gKi9cblxuICAgIC8qKiDQmtC+0L7RgNC10LrRgtC40YDQvtCy0LrQsCDRgNCw0LfQvNC10YDQsCDQvtCx0LvQsNGB0YLQuCDQv9GA0L7RgdC80L7RgtGA0LAuICovXG4gICAgdGhpcy5zcGxvdC5jYW52YXMud2lkdGggPSB0aGlzLnNwbG90LmNhbnZhcy5jbGllbnRXaWR0aFxuICAgIHRoaXMuc3Bsb3QuY2FudmFzLmhlaWdodCA9IHRoaXMuc3Bsb3QuY2FudmFzLmNsaWVudEhlaWdodFxuICAgIHRoaXMuZ2wudmlld3BvcnQoMCwgMCwgdGhpcy5zcGxvdC5jYW52YXMud2lkdGgsIHRoaXMuc3Bsb3QuY2FudmFzLmhlaWdodClcblxuICAgIC8qKiDQldGB0LvQuCDQt9Cw0LTQsNC9INGA0LDQt9C80LXRgCDQv9C70L7RgdC60L7RgdGC0LgsINC90L4g0L3QtSDQt9Cw0LTQsNC90L4g0L/QvtC70L7QttC10L3QuNC1INC+0LHQu9Cw0YHRgtC4INC/0YDQvtGB0LzQvtGC0YDQsCwg0YLQviDQvtC90LAg0L/QvtC80LXRidCw0LXRgtGB0Y8g0LIg0YbQtdC90YLRgCDQv9C70L7RgdC60L7RgdGC0LguICovXG4gICAgaWYgKCgnZ3JpZCcgaW4gdGhpcy5zcGxvdC5sYXN0UmVxdWVzdGVkT3B0aW9ucyEpICYmICEoJ2NhbWVyYScgaW4gdGhpcy5zcGxvdC5sYXN0UmVxdWVzdGVkT3B0aW9ucykpIHtcbiAgICAgIHRoaXMuc3Bsb3QuY2FtZXJhLnggPSAwLjVcbiAgICAgIHRoaXMuc3Bsb3QuY2FtZXJhLnkgPSAwLjVcbiAgICB9XG5cbiAgICAvKiog0KPRgdGC0LDQvdC+0LLQutCwINGE0L7QvdC+0LLQvtCz0L4g0YbQstC10YLQsCDQutCw0L3QstCw0YHQsCAo0YbQstC10YIg0L7Rh9C40YHRgtC60Lgg0LrQvtC90YLQtdC60YHRgtCwINGA0LXQvdC00LXRgNC40L3Qs9CwKS4gKi9cbiAgICB0aGlzLnNldEJnQ29sb3IodGhpcy5zcGxvdC5ncmlkLmJnQ29sb3IhKVxuICB9XG5cbiAgY2xlYXJEYXRhKCkge1xuICAgIGZvciAobGV0IGR4ID0gMDsgZHggPCB0aGlzLnNwbG90LmFyZWEuY291bnQ7IGR4KyspIHtcbiAgICAgIHRoaXMuZGF0YVtkeF0gPSBbXVxuICAgICAgZm9yIChsZXQgZHkgPSAwOyBkeSA8IHRoaXMuc3Bsb3QuYXJlYS5jb3VudDsgZHkrKykge1xuICAgICAgICB0aGlzLmRhdGFbZHhdW2R5XSA9IFtdXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0KPRgdGC0LDQvdCw0LLQu9C40LLQsNC10YIg0YbQstC10YIg0YTQvtC90LAg0LrQvtC90YLQtdC60YHRgtCwINGA0LXQvdC00LXRgNC40L3Qs9CwIFdlYkdMLlxuICAgKi9cbiAgcHVibGljIHNldEJnQ29sb3IoY29sb3I6IHN0cmluZyk6IHZvaWQge1xuICAgIGxldCBbciwgZywgYl0gPSBjb2xvckZyb21IZXhUb0dsUmdiKGNvbG9yKVxuICAgIHRoaXMuZ2wuY2xlYXJDb2xvcihyLCBnLCBiLCAwLjApXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQl9Cw0LrRgNCw0YjQuNCy0LDQtdGCINC60L7QvdGC0LXQutGB0YIg0YDQtdC90LTQtdGA0LjQvdCz0LAgV2ViR0wg0YbQstC10YLQvtC8INGE0L7QvdCwLlxuICAgKi9cbiAgcHVibGljIGNsZWFyQmFja2dyb3VuZCgpOiB2b2lkIHtcbiAgICB0aGlzLmdsLmNsZWFyKHRoaXMuZ2wuQ09MT1JfQlVGRkVSX0JJVCk7XG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQodC+0LfQtNCw0LXRgiDRiNC10LnQtNC10YAgV2ViR0wuXG4gICAqXG4gICAqIEBwYXJhbSB0eXBlIC0g0KLQuNC/INGI0LXQudC00LXRgNCwLlxuICAgKiBAcGFyYW0gY29kZSAtIEdMU0wt0LrQvtC0INGI0LXQudC00LXRgNCwLlxuICAgKiBAcmV0dXJucyDQodC+0LfQtNCw0L3QvdGL0Lkg0YjQtdC50LTQtdGALlxuICAgKi9cbiAgcHVibGljIGNyZWF0ZVNoYWRlcih0eXBlOiAnVkVSVEVYX1NIQURFUicgfCAnRlJBR01FTlRfU0hBREVSJywgY29kZTogc3RyaW5nKTogV2ViR0xTaGFkZXIge1xuXG4gICAgY29uc3Qgc2hhZGVyID0gdGhpcy5nbC5jcmVhdGVTaGFkZXIodGhpcy5nbFt0eXBlXSkhXG4gICAgdGhpcy5nbC5zaGFkZXJTb3VyY2Uoc2hhZGVyLCBjb2RlKVxuICAgIHRoaXMuZ2wuY29tcGlsZVNoYWRlcihzaGFkZXIpXG5cbiAgICBpZiAoIXRoaXMuZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKHNoYWRlciwgdGhpcy5nbC5DT01QSUxFX1NUQVRVUykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcign0J7RiNC40LHQutCwINC60L7QvNC/0LjQu9GP0YbQuNC4INGI0LXQudC00LXRgNCwIFsnICsgdHlwZSArICddLiAnICsgdGhpcy5nbC5nZXRTaGFkZXJJbmZvTG9nKHNoYWRlcikpXG4gICAgfVxuXG4gICAgcmV0dXJuIHNoYWRlclxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0KHQvtC30LTQsNC10YIg0L/RgNC+0LPRgNCw0LzQvNGDIFdlYkdMINC40Lcg0YjQtdC50LTQtdGA0L7Qsi5cbiAgICpcbiAgICogQHBhcmFtIHNoYWRlclZlcnQgLSDQktC10YDRiNC40L3QvdGL0Lkg0YjQtdC50LTQtdGALlxuICAgKiBAcGFyYW0gc2hhZGVyRnJhZyAtINCk0YDQsNCz0LzQtdC90YLQvdGL0Lkg0YjQtdC50LTQtdGALlxuICAgKi9cbiAgcHVibGljIGNyZWF0ZVByb2dyYW1Gcm9tU2hhZGVycyhzaGFkZXJWZXJ0OiBXZWJHTFNoYWRlciwgc2hhZGVyRnJhZzogV2ViR0xTaGFkZXIpOiB2b2lkIHtcblxuICAgIHRoaXMuZ3B1UHJvZ3JhbSA9IHRoaXMuZ2wuY3JlYXRlUHJvZ3JhbSgpIVxuICAgIHRoaXMuZ2wuYXR0YWNoU2hhZGVyKHRoaXMuZ3B1UHJvZ3JhbSwgc2hhZGVyVmVydClcbiAgICB0aGlzLmdsLmF0dGFjaFNoYWRlcih0aGlzLmdwdVByb2dyYW0sIHNoYWRlckZyYWcpXG4gICAgdGhpcy5nbC5saW5rUHJvZ3JhbSh0aGlzLmdwdVByb2dyYW0pXG4gICAgdGhpcy5nbC51c2VQcm9ncmFtKHRoaXMuZ3B1UHJvZ3JhbSlcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCh0L7Qt9C00LDQtdGCINC/0YDQvtCz0YDQsNC80LzRgyBXZWJHTCDQuNC3IEdMU0wt0LrQvtC00L7QsiDRiNC10LnQtNC10YDQvtCyLlxuICAgKlxuICAgKiBAcGFyYW0gc2hhZGVyQ29kZVZlcnQgLSDQmtC+0LQg0LLQtdGA0YjQuNC90L3QvtCz0L4g0YjQtdC50LTQtdGA0LAuXG4gICAqIEBwYXJhbSBzaGFkZXJDb2RlRnJhZyAtINCa0L7QtCDRhNGA0LDQs9C80LXQvdGC0L3QvtCz0L4g0YjQtdC50LTQtdGA0LAuXG4gICAqL1xuICBwdWJsaWMgY3JlYXRlUHJvZ3JhbShzaGFkZXJDb2RlVmVydDogc3RyaW5nLCBzaGFkZXJDb2RlRnJhZzogc3RyaW5nKTogdm9pZCB7XG5cbiAgICB0aGlzLnNwbG90LmRlYnVnLmxvZygnc2hhZGVycycpXG5cbiAgICB0aGlzLmNyZWF0ZVByb2dyYW1Gcm9tU2hhZGVycyhcbiAgICAgIHRoaXMuY3JlYXRlU2hhZGVyKCdWRVJURVhfU0hBREVSJywgc2hhZGVyQ29kZVZlcnQpLFxuICAgICAgdGhpcy5jcmVhdGVTaGFkZXIoJ0ZSQUdNRU5UX1NIQURFUicsIHNoYWRlckNvZGVGcmFnKVxuICAgIClcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCh0L7Qt9C00LDQtdGCINGB0LLRj9C30Ywg0L/QtdGA0LXQvNC10L3QvdC+0Lkg0L/RgNC40LvQvtC20LXQvdC40Y8g0YEg0L/RgNC+0LPRgNCw0LzQvNC+0LkgV2ViR2wuXG4gICAqXG4gICAqIEByZW1hcmtzXG4gICAqINCf0LXRgNC10LzQtdC90L3Ri9C1INGB0L7RhdGA0LDQvdGP0Y7RgtGB0Y8g0LIg0LDRgdGB0L7RhtC40LDRgtC40LLQvdC+0Lwg0LzQsNGB0YHQuNCy0LUsINCz0LTQtSDQutC70Y7Rh9C4IC0g0Y3RgtC+INC90LDQt9Cy0LDQvdC40Y8g0L/QtdGA0LXQvNC10L3QvdGL0YUuINCd0LDQt9Cy0LDQvdC40LUg0L/QtdGA0LXQvNC10L3QvdC+0Lkg0LTQvtC70LbQvdC+XG4gICAqINC90LDRh9C40L3QsNGC0YzRgdGPINGBINC/0YDQtdGE0LjQutGB0LAsINC+0LHQvtC30L3QsNGH0LDRjtGJ0LXQs9C+INC10LUgR0xTTC3RgtC40L8uINCf0YDQtdGE0LjQutGBIFwidV9cIiDQvtC/0LjRgdGL0LLQsNC10YIg0L/QtdGA0LXQvNC10L3QvdGD0Y4g0YLQuNC/0LAgdW5pZm9ybS4g0J/RgNC10YTQuNC60YEgXCJhX1wiXG4gICAqINC+0L/QuNGB0YvQstCw0LXRgiDQv9C10YDQtdC80LXQvdC90YPRjiDRgtC40L/QsCBhdHRyaWJ1dGUuXG4gICAqXG4gICAqIEBwYXJhbSB2YXJOYW1lIC0g0JjQvNGPINC/0LXRgNC10LzQtdC90L3QvtC5ICjRgdGC0YDQvtC60LApLlxuICAgKi9cbiAgcHVibGljIGNyZWF0ZVZhcmlhYmxlKHZhck5hbWU6IHN0cmluZyk6IHZvaWQge1xuXG4gICAgY29uc3QgdmFyVHlwZSA9IHZhck5hbWUuc2xpY2UoMCwgMilcblxuICAgIGlmICh2YXJUeXBlID09PSAndV8nKSB7XG4gICAgICB0aGlzLnZhcmlhYmxlcy5zZXQodmFyTmFtZSwgdGhpcy5nbC5nZXRVbmlmb3JtTG9jYXRpb24odGhpcy5ncHVQcm9ncmFtLCB2YXJOYW1lKSlcbiAgICB9IGVsc2UgaWYgKHZhclR5cGUgPT09ICdhXycpIHtcbiAgICAgIHRoaXMudmFyaWFibGVzLnNldCh2YXJOYW1lLCB0aGlzLmdsLmdldEF0dHJpYkxvY2F0aW9uKHRoaXMuZ3B1UHJvZ3JhbSwgdmFyTmFtZSkpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcign0KPQutCw0LfQsNC9INC90LXQstC10YDQvdGL0Lkg0YLQuNC/ICjQv9GA0LXRhNC40LrRgSkg0L/QtdGA0LXQvNC10L3QvdC+0Lkg0YjQtdC50LTQtdGA0LA6ICcgKyB2YXJOYW1lKVxuICAgIH1cbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCh0L7Qt9C00LDQtdGCINGB0LLRj9C30Ywg0L3QsNCx0L7RgNCwINC/0LXRgNC10LzQtdC90L3Ri9GFINC/0YDQuNC70L7QttC10L3QuNGPINGBINC/0YDQvtCz0YDQsNC80LzQvtC5IFdlYkdsLlxuICAgKlxuICAgKiBAcmVtYXJrc1xuICAgKiDQlNC10LvQsNC10YIg0YLQvtC20LUg0YHQsNC80L7QtSwg0YfRgtC+INC4INC80LXRgtC+0LQge0BsaW5rIGNyZWF0ZVZhcmlhYmxlfSwg0L3QviDQv9C+0LfQstC+0LvRj9C10YIg0LfQsCDQvtC00LjQvSDQstGL0LfQvtCyINGB0L7Qt9C00LDRgtGMINGB0YDQsNC30YMg0L3QtdGB0LrQvtC70YzQutC+XG4gICAqINC/0LXRgNC10LzQtdC90L3Ri9GFLlxuICAgKlxuICAgKiBAcGFyYW0gdmFyTmFtZXMgLSDQn9C10YDQtdGH0LjRgdC70LXQvdC40Y8g0LjQvNC10L0g0L/QtdGA0LXQvNC10L3QvdGL0YUgKNGB0YLRgNC+0LrQsNC80LgpLlxuICAgKi9cbiAgcHVibGljIGNyZWF0ZVZhcmlhYmxlcyguLi52YXJOYW1lczogc3RyaW5nW10pOiB2b2lkIHtcbiAgICB2YXJOYW1lcy5mb3JFYWNoKHZhck5hbWUgPT4gdGhpcy5jcmVhdGVWYXJpYWJsZSh2YXJOYW1lKSk7XG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQodC+0LfQtNCw0LXRgiDQsiDQs9GA0YPQv9C/0LUg0LHRg9GE0LXRgNC+0LIgV2ViR0wg0L3QvtCy0YvQuSDQsdGD0YTQtdGAINC4INC30LDQv9C40YHRi9Cy0LDQtdGCINCyINC90LXQs9C+INC/0LXRgNC10LTQsNC90L3Ri9C1INC00LDQvdC90YvQtS5cbiAgICpcbiAgICogQHJlbWFya3NcbiAgICog0JrQvtC70LjRh9C10YHRgtCy0L4g0LPRgNGD0L/QvyDQsdGD0YTQtdGA0L7QsiDQuCDQutC+0LvQuNGH0LXRgdGC0LLQviDQsdGD0YTQtdGA0L7QsiDQsiDQutCw0LbQtNC+0Lkg0LPRgNGD0L/Qv9C1INC90LUg0L7Qs9GA0LDQvdC40YfQtdC90YsuINCa0LDQttC00LDRjyDQs9GA0YPQv9C/0LAg0LjQvNC10LXRgiDRgdCy0L7QtSDQvdCw0LfQstCw0L3QuNC1INC4XG4gICAqIEdMU0wt0YLQuNC/LiDQotC40L8g0LPRgNGD0L/Qv9GLINC+0L/RgNC10LTQtdC70Y/QtdGC0YHRjyDQsNCy0YLQvtC80LDRgtC40YfQtdGB0LrQuCDQvdCwINC+0YHQvdC+0LLQtSDRgtC40L/QsCDRgtC40L/QuNC30LjRgNC+0LLQsNC90L3QvtCz0L4g0LzQsNGB0YHQuNCy0LAuINCf0YDQsNCy0LjQu9CwINGB0L7QvtGC0LLQtdGC0YHRgtCy0LjRjyDRgtC40L/QvtCyXG4gICAqINC+0L/RgNC10LTQtdC70Y/RjtGC0YHRjyDQv9C10YDQtdC80LXQvdC90L7QuSB7QGxpbmsgZ2xOdW1iZXJUeXBlc30uXG4gICAqXG4gICAqIEBwYXJhbSBncm91cENvZGUgLSDQndCw0LfQstCw0L3QuNC1INCz0YDRg9C/0L/RiyDQsdGD0YTQtdGA0L7Qsiwg0LIg0LrQvtGC0L7RgNGD0Y4g0LHRg9C00LXRgiDQtNC+0LHQsNCy0LvQtdC9INC90L7QstGL0Lkg0LHRg9GE0LXRgC5cbiAgICogQHBhcmFtIGR4IC0g0JPQvtGA0LjQt9C+0L3RgtCw0LvRjNC90YvQuSDQuNC90LTQtdC60YEg0LHRg9GE0LXRgNC90L7QuSDQs9GA0YPQv9C/0YsuXG4gICAqIEBwYXJhbSBkeSAtINCS0LXRgNGC0LjQutCw0LvRjNC90YvQuSDQuNC90LTQtdC60YEg0LHRg9GE0LXRgNC90L7QuSDQs9GA0YPQv9C/0YsuXG4gICAqIEBwYXJhbSBkYXRhIC0g0JTQsNC90L3Ri9C1INCyINCy0LjQtNC1INGC0LjQv9C40LfQuNGA0L7QstCw0L3QvdC+0LPQviDQvNCw0YHRgdC40LLQsCDQtNC70Y8g0LfQsNC/0LjRgdC4INCyINGB0L7Qt9C00LDQstCw0LXQvNGL0Lkg0LHRg9GE0LXRgC5cbiAgICogQHJldHVybnMg0J7QsdGK0LXQvCDQv9Cw0LzRj9GC0LgsINC30LDQvdGP0YLRi9C5INC90L7QstGL0Lwg0LHRg9GE0LXRgNC+0LwgKNCyINCx0LDQudGC0LDRhSkuXG4gICAqL1xuICBwdWJsaWMgY3JlYXRlQnVmZmVyKGR4OiBudW1iZXIsIGR5OiBudW1iZXIsIGdyb3VwQ29kZTogbnVtYmVyLCBkYXRhOiBUeXBlZEFycmF5KTogbnVtYmVyIHtcblxuICAgIGNvbnN0IGJ1ZmZlciA9IHRoaXMuZ2wuY3JlYXRlQnVmZmVyKCkhXG4gICAgdGhpcy5nbC5iaW5kQnVmZmVyKHRoaXMuZ2wuQVJSQVlfQlVGRkVSLCBidWZmZXIpXG4gICAgdGhpcy5nbC5idWZmZXJEYXRhKHRoaXMuZ2wuQVJSQVlfQlVGRkVSLCBkYXRhLCB0aGlzLmdsLlNUQVRJQ19EUkFXKVxuXG4gICAgdGhpcy5kYXRhW2R4XVtkeV1bZ3JvdXBDb2RlXSA9IGJ1ZmZlclxuXG4gICAgdGhpcy5ncm91cFR5cGVbZ3JvdXBDb2RlXSA9IHRoaXMuZ2xOdW1iZXJUeXBlcy5nZXQoZGF0YS5jb25zdHJ1Y3Rvci5uYW1lKSFcbiAgICAvL2NvbnNvbGUubG9nKCdCVUZGRVJfU0laRSA9ICcsIHRoaXMuZ2wuZ2V0QnVmZmVyUGFyYW1ldGVyKHRoaXMuZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLmdsLkJVRkZFUl9TSVpFKSk7XG5cbiAgICByZXR1cm4gZGF0YS5sZW5ndGggKiBkYXRhLkJZVEVTX1BFUl9FTEVNRU5UXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQn9C10YDQtdC00LDQtdGCINC30L3QsNGH0LXQvdC40LUg0LzQsNGC0YDQuNGG0YsgMyDRhSAzINCyINC/0YDQvtCz0YDQsNC80LzRgyBXZWJHbC5cbiAgICpcbiAgICogQHBhcmFtIHZhck5hbWUgLSDQmNC80Y8g0L/QtdGA0LXQvNC10L3QvdC+0LkgV2ViR0wgKNC40Lcg0LzQsNGB0YHQuNCy0LAge0BsaW5rIHZhcmlhYmxlc30pINCyINC60L7RgtC+0YDRg9GOINCx0YPQtNC10YIg0LfQsNC/0LjRgdCw0L3QviDQv9C10YDQtdC00LDQvdC90L7QtSDQt9C90LDRh9C10L3QuNC1LlxuICAgKiBAcGFyYW0gdmFyVmFsdWUgLSDQo9GB0YLQsNC90LDQstC70LjQstCw0LXQvNC+0LUg0LfQvdCw0YfQtdC90LjQtSDQtNC+0LvQttC90L4g0Y/QstC70Y/RgtGM0YHRjyDQvNCw0YLRgNC40YbQtdC5INCy0LXRidC10YHRgtCy0LXQvdC90YvRhSDRh9C40YHQtdC7INGA0LDQt9C80LXRgNC+0LwgMyDRhSAzLCDRgNCw0LfQstC10YDQvdGD0YLQvtC5XG4gICAqICAgICDQsiDQstC40LTQtSDQvtC00L3QvtC80LXRgNC90L7Qs9C+INC80LDRgdGB0LjQstCwINC40LcgOSDRjdC70LXQvNC10L3RgtC+0LIuXG4gICAqL1xuICBwdWJsaWMgc2V0VmFyaWFibGUodmFyTmFtZTogc3RyaW5nLCB2YXJWYWx1ZTogbnVtYmVyW10pOiB2b2lkIHtcbiAgICB0aGlzLmdsLnVuaWZvcm1NYXRyaXgzZnYodGhpcy52YXJpYWJsZXMuZ2V0KHZhck5hbWUpLCBmYWxzZSwgdmFyVmFsdWUpXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQlNC10LvQsNC10YIg0LHRg9GE0LXRgCBXZWJHbCBcItCw0LrRgtC40LLQvdGL0LxcIi5cbiAgICpcbiAgICogQHBhcmFtIGdyb3VwQ29kZSAtINCd0LDQt9Cy0LDQvdC40LUg0LPRgNGD0L/Qv9GLINCx0YPRhNC10YDQvtCyLCDQsiDQutC+0YLQvtGA0L7QvCDRhdGA0LDQvdC40YLRgdGPINC90LXQvtCx0YXQvtC00LjQvNGL0Lkg0LHRg9GE0LXRgC5cbiAgICogQHBhcmFtIGR4IC0g0JPQvtGA0LjQt9C+0L3RgtCw0LvRjNC90YvQuSDQuNC90LTQtdC60YEg0LHRg9GE0LXRgNC90L7QuSDQs9GA0YPQv9C/0YsuXG4gICAqIEBwYXJhbSBkeSAtINCS0LXRgNGC0LjQutCw0LvRjNC90YvQuSDQuNC90LTQtdC60YEg0LHRg9GE0LXRgNC90L7QuSDQs9GA0YPQv9C/0YsuXG4gICAqIEBwYXJhbSB2YXJOYW1lIC0g0JjQvNGPINC/0LXRgNC10LzQtdC90L3QvtC5ICjQuNC3INC80LDRgdGB0LjQstCwIHtAbGluayB2YXJpYWJsZXN9KSwg0YEg0LrQvtGC0L7RgNC+0Lkg0LHRg9C00LXRgiDRgdCy0Y/Qt9Cw0L0g0LHRg9GE0LXRgC5cbiAgICogQHBhcmFtIHNpemUgLSDQmtC+0LvQuNGH0LXRgdGC0LLQviDRjdC70LXQvNC10L3RgtC+0LIg0LIg0LHRg9GE0LXRgNC1LCDRgdC+0L7RgtCy0LXRgtGB0YLQstGD0Y7RidC40YUg0L7QtNC90L7QuSDCoEdMLdCy0LXRgNGI0LjQvdC1LlxuICAgKiBAcGFyYW0gc3RyaWRlIC0g0KDQsNC30LzQtdGAINGI0LDQs9CwINC+0LHRgNCw0LHQvtGC0LrQuCDRjdC70LXQvNC10L3RgtC+0LIg0LHRg9GE0LXRgNCwICjQt9C90LDRh9C10L3QuNC1IDAg0LfQsNC00LDQtdGCINGA0LDQt9C80LXRidC10L3QuNC1INGN0LvQtdC80LXQvdGC0L7QsiDQtNGA0YPQsyDQt9CwINC00YDRg9Cz0L7QvCkuXG4gICAqIEBwYXJhbSBvZmZzZXQgLSDQodC80LXRidC10L3QuNC1INC+0YLQvdC+0YHQuNGC0LXQu9GM0L3QviDQvdCw0YfQsNC70LAg0LHRg9GE0LXRgNCwLCDQvdCw0YfQuNC90LDRjyDRgSDQutC+0YLQvtGA0L7Qs9C+INCx0YPQtNC10YIg0L/RgNC+0LjRgdGF0L7QtNC40YLRjCDQvtCx0YDQsNCx0L7RgtC60LAg0Y3Qu9C10LzQtdC90YLQvtCyLlxuICAgKi9cbiAgcHVibGljIHNldEJ1ZmZlcihkeDogbnVtYmVyLCBkeTogbnVtYmVyLCBncm91cENvZGU6IG51bWJlciwgdmFyTmFtZTogc3RyaW5nLCBzaXplOiBudW1iZXIsIHN0cmlkZTogbnVtYmVyLCBvZmZzZXQ6IG51bWJlcik6IHZvaWQge1xuXG4gICAgY29uc3QgdmFyaWFibGUgPSB0aGlzLnZhcmlhYmxlcy5nZXQodmFyTmFtZSlcblxuICAgIHRoaXMuZ2wuYmluZEJ1ZmZlcih0aGlzLmdsLkFSUkFZX0JVRkZFUiwgdGhpcy5kYXRhW2R4XVtkeV1bZ3JvdXBDb2RlXSlcbiAgICB0aGlzLmdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KHZhcmlhYmxlKVxuICAgIHRoaXMuZ2wudmVydGV4QXR0cmliUG9pbnRlcih2YXJpYWJsZSwgc2l6ZSwgdGhpcy5ncm91cFR5cGVbZ3JvdXBDb2RlXSwgZmFsc2UsIHN0cmlkZSwgb2Zmc2V0KVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JLRi9C/0L7Qu9C90Y/QtdGCINC+0YLRgNC40YHQvtCy0LrRgyDQutC+0L3RgtC10LrRgdGC0LAg0YDQtdC90LTQtdGA0LjQvdCz0LAgV2ViR0wg0LzQtdGC0L7QtNC+0Lwg0L/RgNC40LzQuNGC0LjQstC90YvRhSDRgtC+0YfQtdC6LlxuICAgKlxuICAgKiBAcGFyYW0gZmlyc3QgLSDQmNC90LTQtdC60YEgR0wt0LLQtdGA0YjQuNC90YssINGBINC60L7RgtC+0YDQvtC5INC90LDRh9C90LXRgtGPINC+0YLRgNC40YHQvtCy0LrQsC5cbiAgICogQHBhcmFtIGNvdW50IC0g0JrQvtC70LjRh9C10YHRgtCy0L4g0L7RgtGA0LjRgdC+0LLRi9Cy0LDQtdC80YvRhSBHTC3QstC10YDRiNC40L0uXG4gICAqL1xuICBwdWJsaWMgZHJhd1BvaW50cyhmaXJzdDogbnVtYmVyLCBjb3VudDogbnVtYmVyKTogdm9pZCB7XG4gICAgdGhpcy5nbC5kcmF3QXJyYXlzKHRoaXMuZ2wuUE9JTlRTLCBmaXJzdCwgY291bnQpXG4gIH1cbn1cbiIsImltcG9ydCB7IGNvcHlNYXRjaGluZ0tleVZhbHVlcyB9IGZyb20gJ0AvdXRpbHMnXG5pbXBvcnQgU1Bsb3RDb250b2wgZnJvbSAnQC9zcGxvdC1jb250cm9sJ1xuaW1wb3J0IFNQbG90V2ViR2wgZnJvbSAnQC9zcGxvdC13ZWJnbCdcbmltcG9ydCBTUGxvdERlYnVnIGZyb20gJ0Avc3Bsb3QtZGVidWcnXG5pbXBvcnQgU1Bsb3REZW1vIGZyb20gJ0Avc3Bsb3QtZGVtbydcbmltcG9ydCBTUGxvdEdsc2wgZnJvbSAnQC9zcGxvdC1nbHNsJ1xuXG4vKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICpcbiAqINCa0LvQsNGB0YEgU1Bsb3QgLSDRgNC10LDQu9C40LfRg9C10YIg0LPRgNCw0YTQuNC6INGC0LjQv9CwINGB0LrQsNGC0YLQtdGA0L/Qu9C+0YIg0YHRgNC10LTRgdGC0LLQsNC80LggV2ViR0wuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNQbG90IHtcblxuICAvKiog0KTRg9C90LrRhtC40Y8g0LjRgtC10YDQuNGA0L7QstCw0L3QuNGPINC40YHRhdC+0LTQvdGL0YUg0LTQsNC90L3Ri9GFLiAqL1xuICBwdWJsaWMgaXRlcmF0b3I6IFNQbG90SXRlcmF0b3IgPSB1bmRlZmluZWRcblxuICAvKiog0JTQsNC90L3Ri9C1INC+0LEg0L7QsdGK0LXQutGC0LDRhSDQs9GA0LDRhNC40LrQsC4gKi9cbiAgcHVibGljIGRhdGE6IFNQbG90T2JqZWN0W10gfCB1bmRlZmluZWQgPSB1bmRlZmluZWRcblxuICAvKiog0KXQtdC70L/QtdGAINGA0LXQttC40LzQsCDQvtGC0LvQsNC00LrQuC4gKi9cbiAgcHVibGljIGRlYnVnOiBTUGxvdERlYnVnID0gbmV3IFNQbG90RGVidWcodGhpcylcblxuICAvKiog0KXQtdC70L/QtdGALCDRg9C/0YDQsNCy0LvRj9GO0YnQuNC5IEdMU0wt0LrQvtC00L7QvCDRiNC10LnQtNC10YDQvtCyLiAqL1xuICBwdWJsaWMgZ2xzbDogU1Bsb3RHbHNsID0gbmV3IFNQbG90R2xzbCh0aGlzKVxuXG4gIC8qKiDQpdC10LvQv9C10YAgV2ViR0wuICovXG4gIHB1YmxpYyB3ZWJnbDogU1Bsb3RXZWJHbCA9IG5ldyBTUGxvdFdlYkdsKHRoaXMpXG5cbiAgLyoqINCl0LXQu9C/0LXRgCDRgNC10LbQuNC80LAg0LTQtdC80L4t0LTQsNC90L3Ri9GFLiAqL1xuICBwdWJsaWMgZGVtbzogU1Bsb3REZW1vID0gbmV3IFNQbG90RGVtbyh0aGlzKVxuXG4gIC8qKiDQn9GA0LjQt9C90LDQuiDRhNC+0YDRgdC40YDQvtCy0LDQvdC90L7Qs9C+INC30LDQv9GD0YHQutCwINGA0LXQvdC00LXRgNCwLiAqL1xuICBwdWJsaWMgZm9yY2VSdW46IGJvb2xlYW4gPSBmYWxzZVxuXG4gIC8qKiDQntCz0YDQsNC90LjRh9C10L3QuNC1INC60L7Quy3QstCwINC+0LHRitC10LrRgtC+0LIg0L3QsCDQs9GA0LDRhNC40LrQtS4gKi9cbiAgcHVibGljIGdsb2JhbExpbWl0OiBudW1iZXIgPSAxXzAwMF8wMDBfMDAwXG5cbiAgLyoqINCe0LPRgNCw0L3QuNGH0LXQvdC40LUg0LrQvtC7LdCy0LAg0L7QsdGK0LXQutGC0L7QsiDQsiDQs9GA0YPQv9C/0LUuICovXG4gIHB1YmxpYyBncm91cExpbWl0OiBudW1iZXIgPSAxMF8wMDBcblxuICAvKiog0KbQstC10YLQvtCy0LDRjyDQv9Cw0LvQuNGC0YDQsCDQvtCx0YrQtdC60YLQvtCyLiAqL1xuICBwdWJsaWMgY29sb3JzOiBzdHJpbmdbXSA9IFtdXG5cbiAgLyoqINCf0LDRgNCw0LzQtdGC0YDRiyDQutC+0L7RgNC00LjQvdCw0YLQvdC+0Lkg0L/Qu9C+0YHQutC+0YHRgtC4LiAqL1xuICBwdWJsaWMgZ3JpZDogU1Bsb3RHcmlkID0ge1xuICAgIGJnQ29sb3I6ICcjZmZmZmZmJyxcbiAgICBydWxlc0NvbG9yOiAnI2MwYzBjMCdcbiAgfVxuXG4gIC8qKiDQn9Cw0YDQsNC80LXRgtGA0Ysg0L7QsdC70LDRgdGC0Lgg0L/RgNC+0YHQvNC+0YLRgNCwLiAqL1xuICBwdWJsaWMgY2FtZXJhOiBTUGxvdENhbWVyYSA9IHtcbiAgICB4OiAwLFxuICAgIHk6IDAsXG4gICAgem9vbTogMSxcbiAgICBtaW5ab29tOiAxLFxuICAgIG1heFpvb206IDEwXzAwMF8wMDBcbiAgfVxuXG4gIC8qKiDQn9GA0LjQt9C90LDQuiDQvdC10L7QsdGF0L7QtNC40LzQvtGB0YLQuCDQt9Cw0LPRgNGD0LfQutC4INC00LDQvdC90YvRhSDQvtCxINC+0LHRitC10LrRgtCw0YUuICovXG4gIHB1YmxpYyBsb2FkRGF0YTogYm9vbGVhbiA9IHRydWVcblxuICAvKiog0J/RgNC40LfQvdCw0Log0L3QtdC+0LHRhdC+0LTQuNC80L7RgdGC0Lgg0LHQtdC30L7RgtC70LDQs9Cw0YLQtdC70YzQvdC+0LPQviDQt9Cw0L/Rg9GB0LrQsCDRgNC10L3QtNC10YDQsC4gKi9cbiAgcHVibGljIGlzUnVubmluZzogYm9vbGVhbiA9IGZhbHNlXG5cbiAgLyoqINCa0L7Qu9C40YfQtdGB0YLQstC+INGA0LDQt9C70LjRh9C90YvRhSDRhNC+0YDQvCDQvtCx0YrQtdC60YLQvtCyLiDQktGL0YfQuNGB0LvRj9C10YLRgdGPINC/0L7Qt9C20LUg0LIg0YXQtdC70L/QtdGA0LUgZ2xzbC4gKi9cbiAgcHVibGljIHNoYXBlc0NvdW50OiBudW1iZXIgfCB1bmRlZmluZWRcblxuICAvKiog0KHRgtCw0YLQuNGB0YLQuNGH0LXRgdC60LDRjyDQuNC90YTQvtGA0LzQsNGG0LjRjy4gKi9cbiAgcHVibGljIHN0YXRzID0ge1xuICAgIG9ialRvdGFsQ291bnQ6IDAsXG4gICAgZ3JvdXBzQ291bnQ6IDAsXG4gICAgbWVtVXNhZ2U6IDAsXG4gICAgbWluT2JqZWN0U2l6ZTogMV8wMDBfMDAwLFxuICAgIG1heE9iamVjdFNpemU6IDAsXG4gIH1cblxuICAvKiog0J7QsdGK0LXQutGCLdC60LDQvdCy0LDRgSDQutC+0L3RgtC10LrRgdGC0LAg0YDQtdC90LTQtdGA0LjQvdCz0LAgV2ViR0wuICovXG4gIHB1YmxpYyBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50XG5cbiAgLyoqINCd0LDRgdGC0YDQvtC50LrQuCwg0LfQsNC/0YDQvtGI0LXQvdC90YvQtSDQv9C+0LvRjNC30L7QstCw0YLQtdC70LXQvCDQsiDQutC+0L3RgdGC0YDRg9C60YLQvtGA0LUg0LjQu9C4INC/0YDQuCDQv9C+0YHQu9C10LTQvdC10Lwg0LLRi9C30L7QstC1IHNldHVwLiAqL1xuICBwdWJsaWMgbGFzdFJlcXVlc3RlZE9wdGlvbnM6IFNQbG90T3B0aW9ucyB8IHVuZGVmaW5lZCA9IHt9XG5cbiAgLyoqINCl0LXQu9C/0LXRgCDQstC30LDQuNC80L7QtNC10LnRgdGC0LLQuNGPINGBINGD0YHRgtGA0L7QudGB0YLQstC+0Lwg0LLQstC+0LTQsC4gKi9cbiAgcHJvdGVjdGVkIGNvbnRyb2w6IFNQbG90Q29udG9sID0gbmV3IFNQbG90Q29udG9sKHRoaXMpXG5cbiAgLyoqINCf0YDQuNC30L3QsNC6INGC0L7Qs9C+LCDRh9GC0L4g0Y3QutC30LXQvNC/0LvRj9GAINC60LvQsNGB0YHQsCDQsdGL0Lsg0LrQvtGA0YDQtdC60YLQvdC+INC/0L7QtNCz0L7RgtC+0LLQu9C10L0g0Log0YDQtdC90LTQtdGA0YMuICovXG4gIHByaXZhdGUgaXNTZXR1cGVkOiBib29sZWFuID0gZmFsc2VcblxuICAvKiog0J/QtdGA0LXQvNC10L3QvdCw0Y8g0LTQu9GPINC/0LXRgNC10LHQvtGA0LAg0LjQvdC00LXQutGB0L7QsiDQvNCw0YHRgdC40LLQsCDQtNCw0L3QvdGL0YUgZGF0YS4gKi9cbiAgcHJpdmF0ZSBhcnJheUluZGV4OiBudW1iZXIgPSAwXG5cbiAgcHVibGljIGFyZWEgPSB7XG4gICAgZ3JvdXBzOiBbXSBhcyBhbnlbXSxcbiAgICBzdGVwOiAwLFxuICAgIGNvdW50OiAwLFxuICAgIGR4VmlzaWJsZUZyb206IDAsXG4gICAgZHhWaXNpYmxlVG86IDAsXG4gICAgZHlWaXNpYmxlRnJvbTogMCxcbiAgICBkeVZpc2libGVUbzogMCxcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCh0L7Qt9C00LDQtdGCINGN0LrQt9C10LzQv9C70Y/RgCDQutC70LDRgdGB0LAsINC40L3QuNGG0LjQsNC70LjQt9C40YDRg9C10YIg0L3QsNGB0YLRgNC+0LnQutC4ICjQtdGB0LvQuCDQv9C10YDQtdC00LDQvdGLKS5cbiAgICpcbiAgICogQHJlbWFya3NcbiAgICog0JXRgdC70Lgg0LrQsNC90LLQsNGBINGBINC30LDQtNCw0L3QvdGL0Lwg0LjQtNC10L3RgtC40YTQuNC60LDRgtC+0YDQvtC8INC90LUg0L3QsNC50LTQtdC9IC0g0LPQtdC90LXRgNC40YDRg9C10YLRgdGPINC+0YjQuNCx0LrQsC4g0J3QsNGB0YLRgNC+0LnQutC4INC80L7Qs9GD0YIg0LHRi9GC0Ywg0LfQsNC00LDQvdGLINC60LDQuiDQslxuICAgKiDQutC+0L3RgdGC0YDRg9C60YLQvtGA0LUsINGC0LDQuiDQuCDQsiDQvNC10YLQvtC00LUge0BsaW5rIHNldHVwfS4g0JIg0LvRjtCx0L7QvCDRgdC70YPRh9Cw0LUg0L3QsNGB0YLRgNC+0LnQutC4INC00L7Qu9C20L3RiyDQsdGL0YLRjCDQt9Cw0LTQsNC90Ysg0LTQviDQt9Cw0L/Rg9GB0LrQsCDRgNC10L3QtNC10YDQsC5cbiAgICpcbiAgICogQHBhcmFtIGNhbnZhc0lkIC0g0JjQtNC10L3RgtC40YTQuNC60LDRgtC+0YAg0LrQsNC90LLQsNGB0LAsINC90LAg0LrQvtGC0L7RgNC+0Lwg0LHRg9C00LXRgiDRgNC40YHQvtCy0LDRgtGM0YHRjyDQs9GA0LDRhNC40LouXG4gICAqIEBwYXJhbSBvcHRpb25zIC0g0J/QvtC70YzQt9C+0LLQsNGC0LXQu9GM0YHQutC40LUg0L3QsNGB0YLRgNC+0LnQutC4INGN0LrQt9C10LzQv9C70Y/RgNCwLlxuICAgKi9cbiAgY29uc3RydWN0b3IoY2FudmFzSWQ6IHN0cmluZywgb3B0aW9ucz86IFNQbG90T3B0aW9ucykge1xuXG4gICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNhbnZhc0lkKSkge1xuICAgICAgdGhpcy5jYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChjYW52YXNJZCkgYXMgSFRNTENhbnZhc0VsZW1lbnRcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCfQmtCw0L3QstCw0YEg0YEg0LjQtNC10L3RgtC40YTQuNC60LDRgtC+0YDQvtC8IFwiIycgKyBjYW52YXNJZCArICdcIiDQvdC1INC90LDQudC00LXQvSEnKVxuICAgIH1cblxuICAgIGlmIChvcHRpb25zKSB7XG5cbiAgICAgIC8qKiDQldGB0LvQuCDQv9C10YDQtdC00LDQvdGLINC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjNGB0LrQuNC1INC90LDRgdGC0YDQvtC50LrQuCwg0YLQviDQvtC90Lgg0L/RgNC40LzQtdC90Y/RjtGC0YHRjy4gKi9cbiAgICAgIGNvcHlNYXRjaGluZ0tleVZhbHVlcyh0aGlzLCBvcHRpb25zKVxuICAgICAgdGhpcy5sYXN0UmVxdWVzdGVkT3B0aW9ucyA9IG9wdGlvbnNcblxuICAgICAgLyoqINCY0L3QuNGG0LjQsNC70LjQt9Cw0YbQuNGPINCy0YHQtdGFINC/0LDRgNCw0LzQtdGC0YDQvtCyINGA0LXQvdC00LXRgNCwLCDQtdGB0LvQuCDQt9Cw0L/RgNC+0YjQtdC9INGE0L7RgNGB0LjRgNC+0LLQsNC90L3Ri9C5INC30LDQv9GD0YHQui4gKi9cbiAgICAgIGlmICh0aGlzLmZvcmNlUnVuKSB7XG4gICAgICAgIHRoaXMuc2V0dXAob3B0aW9ucylcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQmNC90LjRhtC40LDQu9C40LfQuNGA0YPQtdGCINC90LXQvtCx0YXQvtC00LjQvNGL0LUg0LTQu9GPINGA0LXQvdC00LXRgNCwINC/0LDRgNCw0LzQtdGC0YDRiyDRjdC60LfQtdC80L/Qu9GP0YDQsCwg0LLRi9C/0L7Qu9C90Y/QtdGCINC/0L7QtNCz0L7RgtC+0LLQutGDINC4INC30LDQv9C+0LvQvdC10L3QuNC1INCx0YPRhNC10YDQvtCyIFdlYkdMLlxuICAgKlxuICAgKiBAcGFyYW0gb3B0aW9ucyAtINCd0LDRgdGC0YDQvtC50LrQuCDRjdC60LfQtdC80L/Qu9GP0YDQsC5cbiAgICovXG4gIHB1YmxpYyBzZXR1cChvcHRpb25zPzogU1Bsb3RPcHRpb25zKTogdm9pZCB7XG5cbiAgICBpZiAoIW9wdGlvbnMpIG9wdGlvbnMgPSB7fVxuXG4gICAgLyoqINCf0YDQuNC80LXQvdC10L3QuNC1INC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjNGB0LrQuNGFINC90LDRgdGC0YDQvtC10LouICovXG4gICAgY29weU1hdGNoaW5nS2V5VmFsdWVzKHRoaXMsIG9wdGlvbnMpXG4gICAgdGhpcy5sYXN0UmVxdWVzdGVkT3B0aW9ucyA9IG9wdGlvbnNcblxuICAgIHRoaXMuZGVidWcubG9nKCdpbnRybycpXG5cbiAgICBpZiAob3B0aW9ucy5kYXRhKSB7XG4gICAgICB0aGlzLml0ZXJhdG9yID0gdGhpcy5hcnJheUl0ZXJhdG9yXG4gICAgICB0aGlzLmFycmF5SW5kZXggPSAwXG4gICAgfVxuXG4gICAgLyoqINCf0L7QtNCz0L7RgtC+0LLQutCwINCy0YHQtdGFINGF0LXQu9C/0LXRgNC+0LIuINCf0L7RgdC70LXQtNC+0LLQsNGC0LXQu9GM0L3QvtGB0YLRjCDQv9C+0LTQs9C+0YLQvtCy0LrQuCDQuNC80LXQtdGCINC30L3QsNGH0LXQvdC40LUuICovXG4gICAgdGhpcy5kZWJ1Zy5zZXR1cCgpXG4gICAgdGhpcy5nbHNsLnNldHVwKClcbiAgICB0aGlzLndlYmdsLnNldHVwKClcbiAgICB0aGlzLmNvbnRyb2wuc2V0dXAoKVxuICAgIHRoaXMuZGVtby5zZXR1cCgpXG5cbiAgICB0aGlzLmRlYnVnLmxvZygnaW5zdGFuY2UnKVxuXG4gICAgLyoqINCe0LHRgNCw0LHQvtGC0LrQsCDQstGB0LXRhSDQtNCw0L3QvdGL0YUg0L7QsSDQvtCx0YrQtdC60YLQsNGFINC4INC40YUg0LfQsNCz0YDRg9C30LrQsCDQsiDQsdGD0YTQtdGA0Ysg0LLQuNC00LXQvtC/0LDQvNGP0YLQuC4gKi9cbiAgICBpZiAodGhpcy5sb2FkRGF0YSkge1xuICAgICAgdGhpcy5sb2FkKClcblxuICAgICAgLyoqINCf0L4g0YPQvNC+0LvRh9Cw0L3QuNGOINC/0YDQuCDQv9C+0LLRgtC+0YDQvdC+0Lwg0LLRi9C30L7QstC1INC80LXRgtC+0LTQsCBzZXR1cCDQvdC+0LLQvtC1INGH0YLQtdC90LjQtSDQvtCx0YrQtdC60YLQvtCyINC90LUg0L/RgNC+0LjQt9Cy0L7QtNC40YLRgdGPLiAqL1xuICAgICAgdGhpcy5sb2FkRGF0YSA9IGZhbHNlXG4gICAgfVxuXG4gICAgdGhpcy5jYW1lcmEuem9vbSA9IE1hdGgubWluKHRoaXMuY2FudmFzLndpZHRoLCB0aGlzLmNhbnZhcy5oZWlnaHQpIC0gdGhpcy5zdGF0cy5tYXhPYmplY3RTaXplXG4gICAgdGhpcy5jYW1lcmEueCA9IDAuNSAtIHRoaXMuY2FudmFzLndpZHRoIC8gKDIgKiB0aGlzLmNhbWVyYS56b29tKVxuICAgIHRoaXMuY2FtZXJhLnkgPSAwLjVcblxuICAgIC8qKiDQlNC10LnRgdGC0LLQuNGPLCDQutC+0YLQvtGA0YvQtSDQstGL0L/QvtC70L3Rj9GO0YLRgdGPINGC0L7Qu9GM0LrQviDQv9GA0Lgg0L/QtdGA0LLQvtC8INCy0YvQt9C+0LLQtSDQvNC10YLQvtC00LAgc2V0dXAuICovXG4gICAgaWYgKCF0aGlzLmlzU2V0dXBlZCkge1xuXG4gICAgICAvKiog0KHQvtC30LTQsNC90LjQtSDQv9C10YDQtdC80LXQvdC90YvRhSBXZWJHbC4gKi9cbiAgICAgIHRoaXMud2ViZ2wuY3JlYXRlVmFyaWFibGVzKCdhX3Bvc2l0aW9uJywgJ2FfY29sb3InLCAnYV9zaXplJywgJ2Ffc2hhcGUnLCAndV9tYXRyaXgnKVxuXG4gICAgICAvKiog0J/RgNC40LfQvdCw0Log0YLQvtCz0L4sINGH0YLQviDRjdC60LfQtdC80L/Qu9GP0YAg0LrQsNC6INC80LjQvdC40LzRg9C8INC+0LTQuNC9INGA0LDQtyDQstGL0L/QvtC70L3QuNC7INC80LXRgtC+0LQgc2V0dXAuICovXG4gICAgICB0aGlzLmlzU2V0dXBlZCA9IHRydWVcbiAgICB9XG5cbiAgICAvKiog0J/RgNC+0LLQtdGA0LrQsCDQutC+0YDRgNC10LrRgtC90L7RgdGC0Lgg0L3QsNGB0YLRgNC+0LnQutC4INGN0LrQt9C10LzQv9C70Y/RgNCwLiAqL1xuICAgIHRoaXMuY2hlY2tTZXR1cCgpXG5cbiAgICBpZiAodGhpcy5mb3JjZVJ1bikge1xuICAgICAgLyoqINCk0L7RgNGB0LjRgNC+0LLQsNC90L3Ri9C5INC30LDQv9GD0YHQuiDRgNC10L3QtNC10YDQuNC90LPQsCAo0LXRgdC70Lgg0YLRgNC10LHRg9C10YLRgdGPKS4gKi9cbiAgICAgIHRoaXMucnVuKClcbiAgICB9XG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQodC+0LfQtNCw0LXRgiDQuCDQt9Cw0L/QvtC70L3Rj9C10YIg0LTQsNC90L3Ri9C80Lgg0L7QsdC+INCy0YHQtdGFINC+0LHRitC10LrRgtCw0YUg0LHRg9GE0LXRgNGLIFdlYkdMLlxuICAgKi9cbiAgcHJvdGVjdGVkIGxvYWQoKTogdm9pZCB7XG5cbiAgICB0aGlzLmRlYnVnLmxvZygnbG9hZGluZycpXG5cbiAgICB0aGlzLnN0YXRzID0geyBvYmpUb3RhbENvdW50OiAwLCBncm91cHNDb3VudDogMCwgbWVtVXNhZ2U6IDAsIG1pbk9iamVjdFNpemU6IDFfMDAwXzAwMCwgbWF4T2JqZWN0U2l6ZTogMCB9XG5cbiAgICBsZXQgZHgsIGR5ID0gMFxuICAgIGxldCBvYmplY3Q6IFNQbG90T2JqZWN0IHwgbnVsbFxuICAgIGxldCBpc09iamVjdEVuZHM6IGJvb2xlYW4gPSBmYWxzZVxuXG4gICAgdGhpcy5hcmVhLnN0ZXAgPSAwLjAyXG4gICAgdGhpcy5hcmVhLmNvdW50ID0gTWF0aC50cnVuYygxIC8gdGhpcy5hcmVhLnN0ZXApICsgMVxuXG4gICAgbGV0IGdyb3VwczogYW55W10gPSBbXVxuXG4gICAgZm9yIChsZXQgZHggPSAwOyBkeCA8IHRoaXMuYXJlYS5jb3VudDsgZHgrKykge1xuICAgICAgZ3JvdXBzW2R4XSA9IFtdXG4gICAgICBmb3IgKGxldCBkeSA9IDA7IGR5IDwgdGhpcy5hcmVhLmNvdW50OyBkeSsrKSB7XG4gICAgICAgIGdyb3Vwc1tkeF1bZHldID0gW11cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA0OyBpKyspIHsgZ3JvdXBzW2R4XVtkeV1baV0gPSBbXSB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgd2hpbGUgKCFpc09iamVjdEVuZHMpIHtcblxuICAgICAgb2JqZWN0ID0gdGhpcy5pdGVyYXRvciEoKVxuXG4gICAgICAvKiog0J7QsdGK0LXQutGC0Ysg0LfQsNC60L7QvdGH0LjQu9C40YHRjCwg0LXRgdC70Lgg0LjRgtC10YDQsNGC0L7RgCDQstC10YDQvdGD0LsgbnVsbCDQuNC70Lgg0LXRgdC70Lgg0LTQvtGB0YLQuNCz0L3Rg9GCINC70LjQvNC40YIg0YfQuNGB0LvQsCDQvtCx0YrQtdC60YLQvtCyLiAqL1xuICAgICAgaXNPYmplY3RFbmRzID0gKG9iamVjdCA9PT0gbnVsbCkgfHwgKHRoaXMuc3RhdHMub2JqVG90YWxDb3VudCA+PSB0aGlzLmdsb2JhbExpbWl0KVxuXG4gICAgICBpZiAoIWlzT2JqZWN0RW5kcykge1xuXG4gICAgICAgIG9iamVjdCA9IHRoaXMuY2hlY2tPYmplY3Qob2JqZWN0ISlcblxuICAgICAgICBkeCA9IE1hdGgudHJ1bmMob2JqZWN0LnggLyB0aGlzLmFyZWEuc3RlcClcbiAgICAgICAgZHkgPSBNYXRoLnRydW5jKG9iamVjdC55IC8gdGhpcy5hcmVhLnN0ZXApXG5cbiAgICAgICAgZ3JvdXBzW2R4XVtkeV1bMF0ucHVzaChvYmplY3QueCwgb2JqZWN0LnkpXG4gICAgICAgIGdyb3Vwc1tkeF1bZHldWzFdLnB1c2gob2JqZWN0LnNoYXBlKVxuICAgICAgICBncm91cHNbZHhdW2R5XVsyXS5wdXNoKG9iamVjdC5jb2xvcilcbiAgICAgICAgZ3JvdXBzW2R4XVtkeV1bM10ucHVzaChvYmplY3Quc2l6ZSlcblxuICAgICAgICBpZiAob2JqZWN0LnNpemUgPiB0aGlzLnN0YXRzLm1heE9iamVjdFNpemUpIHtcbiAgICAgICAgICB0aGlzLnN0YXRzLm1heE9iamVjdFNpemUgPSBvYmplY3Quc2l6ZVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9iamVjdC5zaXplIDwgdGhpcy5zdGF0cy5taW5PYmplY3RTaXplKSB7XG4gICAgICAgICAgdGhpcy5zdGF0cy5taW5PYmplY3RTaXplID0gb2JqZWN0LnNpemVcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc3RhdHMub2JqVG90YWxDb3VudCsrXG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5hcmVhLmdyb3VwcyA9IGdyb3Vwc1xuXG4gICAgdGhpcy53ZWJnbC5jbGVhckRhdGEoKVxuXG4gICAgLyoqINCY0YLQtdGA0LjRgNC+0LLQsNC90LjQtSDQuCDQt9Cw0L3QtdGB0LXQvdC40LUg0LTQsNC90L3Ri9GFINCyINCx0YPRhNC10YDRiyBXZWJHTC4gKi9cbiAgICBmb3IgKGxldCBkeCA9IDA7IGR4IDwgdGhpcy5hcmVhLmNvdW50OyBkeCsrKSB7XG4gICAgICBmb3IgKGxldCBkeSA9IDA7IGR5IDwgdGhpcy5hcmVhLmNvdW50OyBkeSsrKSB7XG4gICAgICAgIGlmIChncm91cHNbZHhdW2R5XVsxXS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgdGhpcy5zdGF0cy5tZW1Vc2FnZSArPVxuICAgICAgICAgICAgdGhpcy53ZWJnbC5jcmVhdGVCdWZmZXIoZHgsIGR5LCAwLCBuZXcgRmxvYXQzMkFycmF5KGdyb3Vwc1tkeF1bZHldWzBdKSkgK1xuICAgICAgICAgICAgdGhpcy53ZWJnbC5jcmVhdGVCdWZmZXIoZHgsIGR5LCAxLCBuZXcgVWludDhBcnJheShncm91cHNbZHhdW2R5XVsxXSkpICtcbiAgICAgICAgICAgIHRoaXMud2ViZ2wuY3JlYXRlQnVmZmVyKGR4LCBkeSwgMiwgbmV3IFVpbnQ4QXJyYXkoZ3JvdXBzW2R4XVtkeV1bMl0pKSArXG4gICAgICAgICAgICB0aGlzLndlYmdsLmNyZWF0ZUJ1ZmZlcihkeCwgZHksIDMsIG5ldyBVaW50OEFycmF5KGdyb3Vwc1tkeF1bZHldWzNdKSlcblxuICAgICAgICAgIHRoaXMuc3RhdHMuZ3JvdXBzQ291bnQgKz0gNFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5kZWJ1Zy5sb2coJ2xvYWRlZCcpXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQn9GA0L7QstC10YDRj9C10YIg0LrQvtGA0YDQtdC60YLQvdC+0YHRgtGMINC/0LDRgNCw0LzQtdGC0YDQvtCyINC+0LHRitC10LrRgtCwINC4INCyINGB0LvRg9GH0LDQtSDQvdC10L7QsdGF0L7QtNC40LzQvtGB0YLQuCDQstC90L7RgdC40YIg0LIg0L3QuNGFINC40LfQvNC10L3QtdC90LjRjy5cbiAgICovXG4gIGNoZWNrT2JqZWN0KG9iamVjdDogU1Bsb3RPYmplY3QpOiBTUGxvdE9iamVjdCB7XG5cbiAgICAvKiog0J/RgNC+0LLQtdGA0LrQsCDQutC+0YDRgNC10LrRgtC90L7RgdGC0Lgg0YDQsNGB0L/QvtC70L7QttC10L3QuNGPINC+0LHRitC10LrRgtCwLiAqL1xuICAgIGlmIChvYmplY3QueCA+IDEpIHtcbiAgICAgIG9iamVjdC54ID0gMVxuICAgIH0gZWxzZSBpZiAob2JqZWN0LnggPCAwKSB7XG4gICAgICBvYmplY3QueCA9IDBcbiAgICB9XG5cbiAgICBpZiAob2JqZWN0LnkgPiAxKSB7XG4gICAgICBvYmplY3QueSA9IDFcbiAgICB9IGVsc2UgaWYgKG9iamVjdC55IDwgMCkge1xuICAgICAgb2JqZWN0LnkgPSAwXG4gICAgfVxuXG4gICAgLyoqINCf0YDQvtCy0LXRgNC60LAg0LrQvtGA0YDQtdC60YLQvdC+0YHRgtC4INGE0L7RgNC80Ysg0Lgg0YbQstC10YLQsCDQvtCx0YrQtdC60YLQsCDQvtCx0YrQtdC60YLQsC4gKi9cbiAgICBpZiAoKG9iamVjdC5zaGFwZSA+PSB0aGlzLnNoYXBlc0NvdW50ISkgfHwgKG9iamVjdC5zaGFwZSA8IDApKSBvYmplY3Quc2hhcGUgPSAwXG4gICAgaWYgKChvYmplY3QuY29sb3IgPj0gdGhpcy5jb2xvcnMubGVuZ3RoKSB8fCAob2JqZWN0LmNvbG9yIDwgMCkpIG9iamVjdC5jb2xvciA9IDBcblxuICAgIHJldHVybiBvYmplY3RcbiAgfVxuXG4gIHVwZGF0ZVZpc2libGVBcmVhKCkge1xuICAgIGNvbnN0IGt4ID0gdGhpcy5jYW52YXMud2lkdGggLyAoMiAqIHRoaXMuY2FtZXJhLnpvb20hKVxuICAgIGNvbnN0IGt5ID0gdGhpcy5jYW52YXMuaGVpZ2h0IC8gKDIgKiB0aGlzLmNhbWVyYS56b29tISlcbiAgICBjb25zdCBjYW1lcmFMZWZ0ID0gdGhpcy5jYW1lcmEueCFcbiAgICBjb25zdCBjYW1lcmFSaWdodCA9IHRoaXMuY2FtZXJhLnghICsgMipreFxuICAgIGNvbnN0IGNhbWVyYVRvcCA9IHRoaXMuY2FtZXJhLnkhIC0ga3lcbiAgICBjb25zdCBjYW1lcmFCb3R0b20gPSB0aGlzLmNhbWVyYS55ISArIGt5XG5cbiAgICBpZiAoIChjYW1lcmFMZWZ0IDwgMSkgJiYgKGNhbWVyYVJpZ2h0ID4gMCkgJiYgKGNhbWVyYVRvcCA8IDEpICYmIChjYW1lcmFCb3R0b20gPiAwKSApIHtcbiAgICAgIHRoaXMuYXJlYS5keFZpc2libGVGcm9tID0gKGNhbWVyYUxlZnQgPCAwKSA/IDAgOiBNYXRoLnRydW5jKGNhbWVyYUxlZnQgLyB0aGlzLmFyZWEuc3RlcClcbiAgICAgIHRoaXMuYXJlYS5keFZpc2libGVUbyA9IChjYW1lcmFSaWdodCA+IDEpID8gdGhpcy5hcmVhLmNvdW50IDogdGhpcy5hcmVhLmNvdW50IC0gTWF0aC50cnVuYygoMSAtIGNhbWVyYVJpZ2h0KSAvIHRoaXMuYXJlYS5zdGVwKVxuICAgICAgdGhpcy5hcmVhLmR5VmlzaWJsZUZyb20gPSAoY2FtZXJhVG9wIDwgMCkgPyAwIDogTWF0aC50cnVuYyhjYW1lcmFUb3AgLyB0aGlzLmFyZWEuc3RlcClcbiAgICAgIHRoaXMuYXJlYS5keVZpc2libGVUbyA9IChjYW1lcmFCb3R0b20gPiAxKSA/IHRoaXMuYXJlYS5jb3VudCA6IHRoaXMuYXJlYS5jb3VudCAtIE1hdGgudHJ1bmMoKDEgLSBjYW1lcmFCb3R0b20pIC8gdGhpcy5hcmVhLnN0ZXApXG5cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5hcmVhLmR4VmlzaWJsZUZyb20gPSAxXG4gICAgICB0aGlzLmFyZWEuZHhWaXNpYmxlVG8gPSAwXG4gICAgICB0aGlzLmFyZWEuZHlWaXNpYmxlRnJvbSA9IDFcbiAgICAgIHRoaXMuYXJlYS5keVZpc2libGVUbyA9IDBcbiAgICB9XG4gIH1cblxuICBnZXRWaXNpYmxlT2JqZWN0c1BhcmFtcyh0b3RhbENvdW50OiBudW1iZXIsIHJhdGlvOiBudW1iZXIpOiBudW1iZXJbXSB7XG5cbiAgICBsZXQgZmlyc3Q6IG51bWJlciA9IDBcbiAgICBsZXQgY291bnQ6IG51bWJlciA9IDBcblxuICAgIC8vIFRPRE86INCY0LfQvNC10L3QuNGC0Ywg0LDQu9Cz0L7RgNC40YLQvCDRgNCw0YHRh9C10YLQsCDQvtGC0L7QsdGA0LDQttCw0LXQvNGL0YUg0LIg0LPRgNGD0L/Qv9C1INC+0LHRitC10LrRgtC+0LIuINCS0L7Qt9C80L7QttC90L4g0L7RgNC40LXQvdGC0LjRgNC+0LLQsNGC0YzRgdGPINC90LAg0LrQvtC70LjRh9C10YHRgtCy0L4g0L7QsdGK0LXQutGC0L7QslxuICAgIC8vINC90LAg0LXQtNC40L3QuNGG0YMg0L/Qu9C+0YnQsNC00Lgg0LPRgNGD0L/Qv9GLLlxuICAgIGlmIChyYXRpbyA+IDAuMSkge1xuICAgICAgY291bnQgPSAyMCAvIHJhdGlvXG4gICAgfSBlbHNlIGlmIChyYXRpbyA+IDAuMDUpIHtcbiAgICAgIGNvdW50ID0gNDAgLyByYXRpb1xuICAgIH0gZWxzZSBpZiAocmF0aW8gPiAwLjAzKSB7XG4gICAgICBjb3VudCA9ICh0b3RhbENvdW50IC0gNDAgLyByYXRpbykgKiAoMSAtIDIgKiByYXRpbykgKyA0MCAvIHJhdGlvXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvdW50ID0gdG90YWxDb3VudFxuICAgIH1cblxuICAgIGNvdW50ID0gTWF0aC5tYXgoMiwgTWF0aC5taW4odG90YWxDb3VudCwgTWF0aC50cnVuYyhjb3VudCkpKVxuXG4gICAgZmlyc3QgPSB0b3RhbENvdW50IC0gY291bnRcblxuICAgIHJldHVybiBbZmlyc3QsIGNvdW50XVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0J/RgNC+0LjQt9Cy0L7QtNC40YIg0YDQtdC90LTQtdGA0LjQvdCzINCz0YDQsNGE0LjQutCwINCyINGB0L7QvtGC0LLQtdGC0YHRgtCy0LjQuCDRgSDRgtC10LrRg9GJ0LjQvNC4INC/0LDRgNCw0LzQtdGC0YDQsNC80Lgg0YLRgNCw0L3RgdGE0L7RgNC80LDRhtC40LguXG4gICAqL1xuICBwdWJsaWMgcmVuZGVyKCk6IHZvaWQge1xuXG4gICAgLyoqINCe0YfQuNGB0YLQutCwINC+0LHRitC10LrRgtCwINGA0LXQvdC00LXRgNC40L3Qs9CwIFdlYkdMLiAqL1xuICAgIHRoaXMud2ViZ2wuY2xlYXJCYWNrZ3JvdW5kKClcblxuICAgIC8qKiDQntCx0L3QvtCy0LvQtdC90LjQtSDQvNCw0YLRgNC40YbRiyDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuC4gKi9cbiAgICB0aGlzLmNvbnRyb2wudXBkYXRlVmlld1Byb2plY3Rpb24oKVxuXG4gICAgLyoqINCf0YDQuNCy0Y/Qt9C60LAg0LzQsNGC0YDQuNGG0Ysg0YLRgNCw0L3RgdGE0L7RgNC80LDRhtC40Lgg0Log0L/QtdGA0LXQvNC10L3QvdC+0Lkg0YjQtdC50LTQtdGA0LAuICovXG4gICAgdGhpcy53ZWJnbC5zZXRWYXJpYWJsZSgndV9tYXRyaXgnLCB0aGlzLmNvbnRyb2wudHJhbnNmb3JtLnZpZXdQcm9qZWN0aW9uTWF0KVxuXG4gICAgdGhpcy51cGRhdGVWaXNpYmxlQXJlYSgpXG5cbiAgICBjb25zdCByYXRpb09iamVjdEdyb3VwID0gdGhpcy5zdGF0cy5taW5PYmplY3RTaXplIC8gKHRoaXMuY2FtZXJhLnpvb20hICogdGhpcy5hcmVhLnN0ZXApIC8vICEhISBtYXggLT4gbWluXG4gICAgbGV0IGZpcnN0OiBudW1iZXIgPSAwXG4gICAgbGV0IGNvdW50OiBudW1iZXIgPSAwXG5cbiAgICAvL2xldCB6eiA9IDBcbiAgICAvKiog0JjRgtC10YDQuNGA0L7QstCw0L3QuNC1INC4INGA0LXQvdC00LXRgNC40L3QsyDQs9GA0YPQv9C/INCx0YPRhNC10YDQvtCyIFdlYkdMLiAqL1xuICAgIGZvciAobGV0IGR4ID0gdGhpcy5hcmVhLmR4VmlzaWJsZUZyb207IGR4IDwgdGhpcy5hcmVhLmR4VmlzaWJsZVRvOyBkeCsrKSB7XG4gICAgICBmb3IgKGxldCBkeSA9IHRoaXMuYXJlYS5keVZpc2libGVGcm9tOyBkeSA8IHRoaXMuYXJlYS5keVZpc2libGVUbzsgZHkrKykge1xuICAgICAgICBpZiAodGhpcy5hcmVhLmdyb3Vwc1tkeF1bZHldWzFdLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICB0aGlzLndlYmdsLnNldEJ1ZmZlcihkeCwgZHksIDAsICdhX3Bvc2l0aW9uJywgMiwgMCwgMClcbiAgICAgICAgICB0aGlzLndlYmdsLnNldEJ1ZmZlcihkeCwgZHksIDEsICdhX3NoYXBlJywgMSwgMCwgMClcbiAgICAgICAgICB0aGlzLndlYmdsLnNldEJ1ZmZlcihkeCwgZHksIDIsICdhX2NvbG9yJywgMSwgMCwgMClcbiAgICAgICAgICB0aGlzLndlYmdsLnNldEJ1ZmZlcihkeCwgZHksIDMsICdhX3NpemUnLCAxLCAwLCAwKTtcblxuICAgICAgICAgIFtmaXJzdCwgY291bnRdID0gdGhpcy5nZXRWaXNpYmxlT2JqZWN0c1BhcmFtcyh0aGlzLmFyZWEuZ3JvdXBzW2R4XVtkeV1bMV0ubGVuZ3RoLCByYXRpb09iamVjdEdyb3VwKVxuICAgICAgICAgIHRoaXMud2ViZ2wuZHJhd1BvaW50cyhmaXJzdCwgY291bnQpXG5cbiAgICAgICAgICAvL3p6KytcbiAgICAgICAgICAvL2NvbnNvbGUubG9nKGB4PSR7dGhpcy5jYW1lcmEueH0sIHk9JHt0aGlzLmNhbWVyYS55fSwgem9vbT0ke3RoaXMuY2FtZXJhLnpvb219YClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICAvL2NvbnNvbGUubG9nKCdyYXRpbyA9ICcgKyByYXRpb09iamVjdEdyb3VwKTtcbiAgICAvL2NvbnNvbGUubG9nKCdmaXJzdCA9ICcgKyBmaXJzdCArICc7IGNvdW50ID0gJyArIGNvdW50KTtcbiAgICAvL2NvbnNvbGUubG9nKCd6eiA9ICcsIHp6KTtcbiAgICAvL2NvbnNvbGUubG9nKGB4PSR7dGhpcy5jYW1lcmEueH0sIHk9JHt0aGlzLmNhbWVyYS55fSwgem9vbT0ke3RoaXMuY2FtZXJhLnpvb219YClcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCf0YDQvtCy0LXRgNGP0LXRgiDQutC+0YDRgNC10LrRgtC90L7RgdGC0Ywg0L3QsNGB0YLRgNC+0LXQuiDRjdC60LfQtdC80L/Qu9GP0YDQsC5cbiAgICpcbiAgICogQHJlbWFya3NcbiAgICog0JjRgdC/0L7Qu9GM0LfRg9C10YLRgdGPINC00LvRjyDQv9GA0L7QstC10YDQutC4INC60L7RgNGA0LXQutGC0L3QvtGB0YLQuCDQu9C+0LPQuNC60Lgg0YDQsNCx0L7RgtGLINC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjyDRgSDRjdC60LfQtdC80L/Qu9GP0YDQvtC8LiDQndC1INC/0L7Qt9Cy0L7Qu9GP0LXRgiDRgNCw0LHQvtGC0LDRgtGMINGBXG4gICAqINC90LXQvdCw0YHRgtGA0L7QtdC90L3Ri9C8INC40LvQuCDQvdC10LrQvtGA0YDQtdC60YLQvdC+INC90LDRgdGC0YDQvtC10L3QvdGL0Lwg0Y3QutC30LXQvNC/0LvRj9GA0L7QvC5cbiAgICovXG4gIGNoZWNrU2V0dXAoKSB7XG5cbiAgICAvKipcbiAgICAgKiAg0J/QvtC70YzQt9C+0LLQsNGC0LXQu9GMINC80L7QsyDQvdCw0YHRgtGA0L7QuNGC0Ywg0Y3QutC30LXQvNC/0LvRj9GAINCyINC60L7QvdGB0YLRgNGD0LrRgtC+0YDQtSDQuCDRgdGA0LDQt9GDINC30LDQv9GD0YHRgtC40YLRjCDRgNC10L3QtNC10YAsINCyINGC0LDQutC+0Lwg0YHQu9GD0YfQsNC1INC80LXRgtC+0LQgc2V0dXBcbiAgICAgKiAg0LHRg9C00LXRgiDQstGL0LfRi9Cy0LDQtdGC0YHRjyDQvdC10Y/QstC90L4uXG4gICAgICovXG4gICAgaWYgKCF0aGlzLmlzU2V0dXBlZCkge1xuICAgICAgdGhpcy5zZXR1cCgpXG4gICAgfVxuXG4gICAgLyoqINCd0LDQsdC+0YAg0L/RgNC+0LLQtdGA0L7QuiDQutC+0YDRgNC10LrRgtC90L7RgdGC0Lgg0L3QsNGB0YLRgNC+0LnQutC4INGN0LrQt9C10LzQv9C70Y/RgNCwLiAqL1xuICAgIGlmICghdGhpcy5pdGVyYXRvcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCfQndC1INC30LDQtNCw0L3QsCDRhNGD0L3QutGG0LjRjyDQuNGC0LXRgNC40YDQvtCy0LDQvdC40Y8g0L7QsdGK0LXQutGC0L7QsiEnKVxuICAgIH1cbiAgfVxuXG4gIGFycmF5SXRlcmF0b3IoKSB7XG4gICAgaWYgKHRoaXMuZGF0YSFbdGhpcy5hcnJheUluZGV4XSkge1xuICAgICAgcmV0dXJuIHRoaXMuZGF0YSFbdGhpcy5hcnJheUluZGV4KytdXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JfQsNC/0YPRgdC60LDQtdGCINGA0LXQvdC00LXRgNC40L3QsyDQuCDQutC+0L3RgtGA0L7Qu9GMINGD0L/RgNCw0LLQu9C10L3QuNGPLlxuICAgKi9cbiAgcHVibGljIHJ1bigpOiB2b2lkIHtcblxuICAgIHRoaXMuY2hlY2tTZXR1cCgpXG5cbiAgICBpZiAoIXRoaXMuaXNSdW5uaW5nKSB7XG4gICAgICB0aGlzLnJlbmRlcigpXG4gICAgICB0aGlzLmNvbnRyb2wucnVuKClcbiAgICAgIHRoaXMuaXNSdW5uaW5nID0gdHJ1ZVxuICAgICAgdGhpcy5kZWJ1Zy5sb2coJ3N0YXJ0ZWQnKVxuICAgIH1cbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCe0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdGCINGA0LXQvdC00LXRgNC40L3QsyDQuCDQutC+0L3RgtGA0L7Qu9GMINGD0L/RgNCw0LLQu9C10L3QuNGPLlxuICAgKi9cbiAgcHVibGljIHN0b3AoKTogdm9pZCB7XG5cbiAgICB0aGlzLmNoZWNrU2V0dXAoKVxuXG4gICAgaWYgKHRoaXMuaXNSdW5uaW5nKSB7XG4gICAgICB0aGlzLmNvbnRyb2wuc3RvcCgpXG4gICAgICB0aGlzLmlzUnVubmluZyA9IGZhbHNlXG4gICAgICB0aGlzLmRlYnVnLmxvZygnc3RvcGVkJylcbiAgICB9XG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQntGH0LjRidCw0LXRgiDRhNC+0L0uXG4gICAqL1xuICBwdWJsaWMgY2xlYXIoKTogdm9pZCB7XG5cbiAgICB0aGlzLmNoZWNrU2V0dXAoKVxuXG4gICAgdGhpcy53ZWJnbC5jbGVhckJhY2tncm91bmQoKVxuICAgIHRoaXMuZGVidWcubG9nKCdjbGVhcmVkJylcbiAgfVxufVxuIiwiXG4vKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICpcbiAqINCf0YDQvtCy0LXRgNGP0LXRgiDRj9Cy0LvRj9C10YLRgdGPINC70Lgg0L/QtdGA0LXQvNC10L3QvdCw0Y8g0Y3QutC30LXQvNC/0LvRj9GA0L7QvCDQutCw0LrQvtCz0L4t0LvQuNCx0L7QviDQutC70LDRgdGB0LAuXG4gKlxuICogQHBhcmFtIHZhcmlhYmxlIC0g0J/RgNC+0LLQtdGA0Y/QtdC80LDRjyDQv9C10YDQtdC80LXQvdC90LDRjy5cbiAqIEByZXR1cm5zINCg0LXQt9GD0LvRjNGC0LDRgiDQv9GA0L7QstC10YDQutC4LlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNPYmplY3QodmFyaWFibGU6IGFueSk6IGJvb2xlYW4ge1xuICByZXR1cm4gKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YXJpYWJsZSkgPT09ICdbb2JqZWN0IE9iamVjdF0nKVxufVxuXG4vKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICpcbiAqINCf0LXRgNC10L7Qv9GA0LXQtNC10LvRj9C10YIg0LfQvdCw0YfQtdC90LjRjyDQv9C+0LvQtdC5INC+0LHRitC10LrRgtCwIHRhcmdldCDQvdCwINC30L3QsNGH0LXQvdC40Y8g0L/QvtC70LXQuSDQvtCx0YrQtdC60YLQsCBzb3VyY2UuXG4gKlxuICogQHJlbWFya3NcbiAqINCf0LXRgNC10L7Qv9GA0LXQtNC10LvRj9GO0YLRgdGPINGC0L7Qu9GM0LrQviDRgtC1INC/0L7Qu9GPLCDQutC+0YLQvtGA0YvQtSDRgdGD0YnQtdGB0YLQstGD0LXRjtGCINCyIHRhcmdldC4g0JXRgdC70Lgg0LIgc291cmNlINC10YHRgtGMINC/0L7Qu9GPLCDQutC+0YLQvtGA0YvRhSDQvdC10YIg0LIgdGFyZ2V0LCDRgtC+INC+0L3QuFxuICog0LjQs9C90L7RgNC40YDRg9GO0YLRgdGPLiDQldGB0LvQuCDQutCw0LrQuNC1LdGC0L4g0L/QvtC70Y8g0YHQsNC80Lgg0Y/QstC70Y/RjtGC0YHRjyDRj9Cy0LvRj9GO0YLRgdGPINC+0LHRitC10LrRgtCw0LzQuCwg0YLQviDRgtC+INC+0L3QuCDRgtCw0LrQttC1INGA0LXQutGD0YDRgdC40LLQvdC+INC60L7Qv9C40YDRg9GO0YLRgdGPICjQv9GA0Lgg0YLQvtC8INC20LVcbiAqINGD0YHQu9C+0LLQuNC4LCDRh9GC0L4g0LIg0YbQtdC70LXQstC+0Lwg0L7QsdGK0LXQutGC0LUg0YHRg9GJ0LXRgdGC0LLRg9GO0YIg0L/QvtC70Y8g0L7QsdGK0LXQutGC0LAt0LjRgdGC0L7Rh9C90LjQutCwKS5cbiAqXG4gKiBAcGFyYW0gdGFyZ2V0IC0g0KbQtdC70LXQstC+0LkgKNC40LfQvNC10L3Rj9C10LzRi9C5KSDQvtCx0YrQtdC60YIuXG4gKiBAcGFyYW0gc291cmNlIC0g0J7QsdGK0LXQutGCINGBINC00LDQvdC90YvQvNC4LCDQutC+0YLQvtGA0YvQtSDQvdGD0LbQvdC+INGD0YHRgtCw0L3QvtCy0LjRgtGMINGDINGG0LXQu9C10LLQvtCz0L4g0L7QsdGK0LXQutGC0LAuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb3B5TWF0Y2hpbmdLZXlWYWx1ZXModGFyZ2V0OiBhbnksIHNvdXJjZTogYW55KTogdm9pZCB7XG4gIE9iamVjdC5rZXlzKHNvdXJjZSkuZm9yRWFjaChrZXkgPT4ge1xuICAgIGlmIChrZXkgaW4gdGFyZ2V0KSB7XG4gICAgICBpZiAoaXNPYmplY3Qoc291cmNlW2tleV0pKSB7XG4gICAgICAgIGlmIChpc09iamVjdCh0YXJnZXRba2V5XSkpIHtcbiAgICAgICAgICBjb3B5TWF0Y2hpbmdLZXlWYWx1ZXModGFyZ2V0W2tleV0sIHNvdXJjZVtrZXldKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoIWlzT2JqZWN0KHRhcmdldFtrZXldKSAmJiAodHlwZW9mIHRhcmdldFtrZXldICE9PSAnZnVuY3Rpb24nKSkge1xuICAgICAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSlcbn1cblxuLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqXG4gKiDQktC+0LfQstGA0LDRidCw0LXRgiDRgdC70YPRh9Cw0LnQvdC+0LUg0YbQtdC70L7QtSDRh9C40YHQu9C+INCyINC00LjQsNC/0LDQt9C+0L3QtTogWzAuLi5yYW5nZS0xXS5cbiAqXG4gKiBAcGFyYW0gcmFuZ2UgLSDQktC10YDRhdC90LjQuSDQv9GA0LXQtNC10Lsg0LTQuNCw0L/QsNC30L7QvdCwINGB0LvRg9GH0LDQudC90L7Qs9C+INCy0YvQsdC+0YDQsC5cbiAqIEByZXR1cm5zINCh0LvRg9GH0LDQudC90L7QtSDRh9C40YHQu9C+LlxuICovXG5leHBvcnQgZnVuY3Rpb24gcmFuZG9tSW50KHJhbmdlOiBudW1iZXIpOiBudW1iZXIge1xuICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcmFuZ2UpXG59XG5cbi8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKlxuICog0JrQvtC90LLQtdGA0YLQuNGA0YPQtdGCINGG0LLQtdGCINC40LcgSEVYLdGE0L7RgNC80LDRgtCwINCyIEdMU0wt0YTQvtGA0LzQsNGCLlxuICpcbiAqIEBwYXJhbSBoZXhDb2xvciAtINCm0LLQtdGCINCyIEhFWC3RhNC+0YDQvNCw0YLQtSAoXCIjZmZmZmZmXCIpLlxuICogQHJldHVybnMg0JzQsNGB0YHQuNCyINC40Lcg0YLRgNC10YUg0YfQuNGB0LXQuyDQsiDQtNC40LDQv9Cw0LfQvtC90LUg0L7RgiAwINC00L4gMS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbG9yRnJvbUhleFRvR2xSZ2IoaGV4Q29sb3I6IHN0cmluZyk6IG51bWJlcltdIHtcbiAgbGV0IGsgPSAvXiM/KFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pJC9pLmV4ZWMoaGV4Q29sb3IpXG4gIGxldCBbciwgZywgYl0gPSBbcGFyc2VJbnQoayFbMV0sIDE2KSAvIDI1NSwgcGFyc2VJbnQoayFbMl0sIDE2KSAvIDI1NSwgcGFyc2VJbnQoayFbM10sIDE2KSAvIDI1NV1cbiAgcmV0dXJuIFtyLCBnLCBiXVxufVxuXG4vKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICpcbiAqINCS0L7Qt9Cy0YDQsNGJ0LDQtdGCINGB0YLRgNC+0LrQvtCy0YPRjiDQt9Cw0L/QuNGB0Ywg0YLQtdC60YPRidC10LPQviDQstGA0LXQvNC10L3QuC5cbiAqXG4gKiBAcmV0dXJucyDQodGC0YDQvtC60LAg0LLRgNC10LzQtdC90Lgg0LIg0YTQvtGA0LzQsNGC0LUgXCJoaDptbTpzc1wiLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q3VycmVudFRpbWUoKTogc3RyaW5nIHtcblxuICBsZXQgdG9kYXkgPSBuZXcgRGF0ZSgpXG5cbiAgcmV0dXJuIFtcbiAgICB0b2RheS5nZXRIb3VycygpLnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgJzAnKSxcbiAgICB0b2RheS5nZXRNaW51dGVzKCkudG9TdHJpbmcoKS5wYWRTdGFydCgyLCAnMCcpLFxuICAgIHRvZGF5LmdldFNlY29uZHMoKS50b1N0cmluZygpLnBhZFN0YXJ0KDIsICcwJylcbiAgXS5qb2luKCc6Jylcbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgU1Bsb3QgZnJvbSAnQC9zcGxvdCdcbmltcG9ydCAnQC9zdHlsZSdcblxuLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cblxubGV0IG4gPSAxXzAwMF8wMDBcbmxldCBjb2xvcnMgPSBbJyNEODFDMDEnLCAnI0U5OTY3QScsICcjQkE1NUQzJywgJyNGRkQ3MDAnLCAnI0ZGRTRCNScsICcjRkY4QzAwJywgJyMyMjhCMjInLCAnIzkwRUU5MCcsICcjNDE2OUUxJywgJyMwMEJGRkYnLCAnIzhCNDUxMycsICcjMDBDRUQxJ11cbmxldCBjb2xvcnMyID0gWycjMDAwMDAwJywgJyNmZjAwMDAnLCAnIzAwZmYwMCcsICcjMDAwMGZmJ11cblxuLyoqINCh0LjQvdGC0LXRgtC40YfQtdGB0LrQsNGPINC40YLQtdGA0LjRgNGD0Y7RidCw0Y8g0YTRg9C90LrRhtC40Y8uICovXG5sZXQgaSA9IDBcbmZ1bmN0aW9uIHJlYWROZXh0T2JqZWN0KCkge1xuICBpZiAoaSA8IG4pIHtcbiAgICBpKytcbiAgICByZXR1cm4ge1xuICAgICAgeDogTWF0aC5yYW5kb20oKSxcbiAgICAgIHk6IE1hdGgucmFuZG9tKCksXG4gICAgICBzaGFwZTogcmFuZG9tSW50KDUpLFxuICAgICAgc2l6ZTogMTAgKyByYW5kb21JbnQoMjEpLFxuICAgICAgY29sb3I6IHJhbmRvbUludChjb2xvcnMubGVuZ3RoKVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpID0gMFxuICAgIHJldHVybiBudWxsICAvLyDQktC+0LfQstGA0LDRidCw0LXQvCBudWxsLCDQutC+0LPQtNCwINC+0LHRitC10LrRgtGLIFwi0LfQsNC60L7QvdGH0LjQu9C40YHRjFwiLlxuICB9XG59XG5cbmZ1bmN0aW9uIHJhbmRvbUludChyYW5nZSkge1xuICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcmFuZ2UpXG59XG5cbmNvbnN0IHNpemUgPSAzMFxuXG5jb25zdCBkYXRhID0gW1xuICB7IHg6IDAsIHk6IDAsIHNoYXBlOiAwLCBzaXplOiBzaXplLCBjb2xvcjogMCB9LFxuICB7IHg6IDAsIHk6IDAuNSwgc2hhcGU6IDAsIHNpemU6IHNpemUsIGNvbG9yOiAxIH0sXG4gIHsgeDogMC41LCB5OiAwLjUsIHNoYXBlOiAwLCBzaXplOiBzaXplLCBjb2xvcjogMiB9LFxuICB7IHg6IDAuNSwgeTogMCwgc2hhcGU6IDAsIHNpemU6IHNpemUsIGNvbG9yOiAzIH0sXG5dXG5cbi8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5cbmxldCBzY2F0dGVyUGxvdCA9IG5ldyBTUGxvdCgnY2FudmFzMScpXG5cbnNjYXR0ZXJQbG90LnNldHVwKHtcbiAgaXRlcmF0b3I6IHJlYWROZXh0T2JqZWN0LFxuICAvL2RhdGE6IGRhdGEsXG4gIGNvbG9yczogY29sb3JzLFxuICBkZWJ1Zzoge1xuICAgIGlzRW5hYmxlOiB0cnVlLFxuICB9LFxuICBkZW1vOiB7XG4gICAgaXNFbmFibGU6IGZhbHNlXG4gIH0sXG4gIHdlYmdsOiB7XG4gICAgZmFpbElmTWFqb3JQZXJmb3JtYW5jZUNhdmVhdDogdHJ1ZVxuICB9XG59KVxuXG5zY2F0dGVyUGxvdC5ydW4oKVxuIl0sInNvdXJjZVJvb3QiOiIifQ==