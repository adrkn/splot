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
        camera.zoom = Math.max(0.002, Math.min(200, newZoom));
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
            this.splot.camera.x = this.splot.grid.width / 2;
            this.splot.camera.y = this.splot.grid.height / 2;
        }
        /** Установка фонового цвета канваса (цвет очистки контекста рендеринга). */
        this.setBgColor(this.splot.grid.bgColor);
    };
    SPlotWebGl.prototype.clearData = function () {
        for (var dx = 0; dx < this.splot.area.dxCount; dx++) {
            this.data[dx] = [];
            for (var dy = 0; dy < this.splot.area.dyCount; dy++) {
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
        this.area = {
            groups: [],
            dxStep: 0,
            dyStep: 0,
            dxCount: 0,
            dyCount: 0
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
        this.stats = { objTotalCount: 0, objInGroupCount: [], groupsCount: 0, memUsage: 0 };
        var dx, dy, dz = 0;
        var object;
        var isObjectEnds = false;
        this.area.dxStep = 250.001;
        this.area.dyStep = 250.001;
        this.area.dxCount = Math.trunc(this.grid.width / this.area.dxStep) + 1;
        this.area.dyCount = Math.trunc(this.grid.height / this.area.dyStep) + 1;
        var groups = [];
        for (var dx_1 = 0; dx_1 < this.area.dxCount; dx_1++) {
            groups[dx_1] = [];
            for (var dy_1 = 0; dy_1 < this.area.dyCount; dy_1++) {
                groups[dx_1][dy_1] = [];
            }
        }
        while (!isObjectEnds) {
            object = this.iterator();
            /** Объекты закончились, если итератор вернул null или если достигнут лимит числа объектов. */
            isObjectEnds = (object === null) || (this.stats.objTotalCount >= this.globalLimit);
            if (!isObjectEnds) {
                object = this.checkObject(object);
                dx = Math.trunc(object.x / this.area.dxStep);
                dy = Math.trunc(object.y / this.area.dyStep);
                if (Array.isArray(groups[dx][dy][dz])) {
                    dz = groups[dx][dy].length - 1;
                    if (groups[dx][dy][dz][1].length >= this.groupLimit) {
                        dz++;
                        groups[dx][dy][dz] = [];
                        groups[dx][dy][dz][0] = []; // Массив вершин
                        groups[dx][dy][dz][1] = []; // Массив форм
                        groups[dx][dy][dz][2] = []; // Массив цветов
                        groups[dx][dy][dz][3] = []; // Массив размеров
                    }
                }
                else {
                    dz = 0;
                    groups[dx][dy][dz] = [];
                    groups[dx][dy][dz][0] = []; // Массив вершин
                    groups[dx][dy][dz][1] = []; // Массив форм
                    groups[dx][dy][dz][2] = []; // Массив цветов
                    groups[dx][dy][dz][3] = []; // Массив размеров
                }
                groups[dx][dy][dz][0].push(object.x, object.y);
                groups[dx][dy][dz][1].push(object.shape);
                groups[dx][dy][dz][2].push(object.color);
                groups[dx][dy][dz][3].push(object.size);
                this.stats.objTotalCount++;
            }
            // if ((count >= this.groupLimit) || isObjectEnds) {
            //   (this.stats.objInGroupCount[dx][dy][this.stats.groupsCount] as any) = count
            // }
            // if ((count >= this.groupLimit) && !isObjectEnds) {
            //   this.stats.groupsCount++
            //   count = 0
            //   dz++
            //   groups[0][0][dz] = []
            // }
        }
        this.area.groups = groups;
        this.webgl.clearData();
        /** Итерирование и занесение данных в буферы WebGL. */
        for (var dx_2 = 0; dx_2 < this.area.dxCount; dx_2++) {
            for (var dy_2 = 0; dy_2 < this.area.dyCount; dy_2++) {
                if (Array.isArray(groups[dx_2][dy_2])) {
                    for (var dz_1 = 0; dz_1 < groups[dx_2][dy_2].length; dz_1++) {
                        this.webgl.createBuffer(dx_2, dy_2, dz_1, 0, new Float32Array(groups[dx_2][dy_2][dz_1][0]));
                        this.webgl.createBuffer(dx_2, dy_2, dz_1, 1, new Uint8Array(groups[dx_2][dy_2][dz_1][1]));
                        this.webgl.createBuffer(dx_2, dy_2, dz_1, 2, new Uint8Array(groups[dx_2][dy_2][dz_1][2]));
                        this.webgl.createBuffer(dx_2, dy_2, dz_1, 3, new Float32Array(groups[dx_2][dy_2][dz_1][3]));
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
        if (object.x > this.grid.width)
            object.x = this.grid.width;
        if (object.y > this.grid.height)
            object.y = this.grid.height;
        if (object.x < 0)
            object.x = 0;
        if (object.y < 0)
            object.y = 0;
        /** Проверка корректности формы и цвета объекта объекта. */
        if ((object.shape >= this.shapesCount) || (object.shape < 0))
            object.shape = 0;
        if ((object.color >= this.colors.length) || (object.color < 0))
            object.color = 0;
        return object;
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
        for (var dx = 0; dx < this.area.dxCount; dx++) {
            for (var dy = 0; dy < this.area.dyCount; dy++) {
                if (Array.isArray(this.area.groups[dx][dy])) {
                    for (var dz = 0; dz < this.area.groups[dx][dy].length; dz++) {
                        this.webgl.setBuffer(dx, dy, dz, 0, 'a_position', 2, 0, 0);
                        this.webgl.setBuffer(dx, dy, dz, 1, 'a_shape', 1, 0, 0);
                        this.webgl.setBuffer(dx, dy, dz, 2, 'a_color', 1, 0, 0);
                        this.webgl.setBuffer(dx, dy, dz, 3, 'a_size', 1, 0, 0);
                        this.webgl.drawPoints(0, this.area.groups[dx][dy][dz][1].length);
                    }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zdHlsZS5jc3MiLCJ3ZWJwYWNrOi8vLy4vc2hhZGVycy50cyIsIndlYnBhY2s6Ly8vLi9zcGxvdC1jb250cm9sLnRzIiwid2VicGFjazovLy8uL3NwbG90LWRlYnVnLnRzIiwid2VicGFjazovLy8uL3NwbG90LWRlbW8udHMiLCJ3ZWJwYWNrOi8vLy4vc3Bsb3QtZ2xzbC50cyIsIndlYnBhY2s6Ly8vLi9zcGxvdC13ZWJnbC50cyIsIndlYnBhY2s6Ly8vLi9zcGxvdC50cyIsIndlYnBhY2s6Ly8vLi91dGlscy50cyIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vLy4vaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7QUNBYSx1QkFBZSxHQUM1Qix1WEFlQztBQUVZLHlCQUFpQixHQUM5QiwrS0FTQztBQUVZLGNBQU0sR0FBYSxFQUFFO0FBRWxDLGlCQUFTLEdBQUksVUFBVTtJQUN2QixJQUNDO0FBRUQsaUJBQVMsR0FBSSxPQUFPO0lBQ3BCLHFEQUVDO0FBRUQsaUJBQVMsR0FBSSxRQUFRO0lBQ3JCLDBPQU1DO0FBRUQsaUJBQVMsR0FBSSxjQUFjO0lBQzNCLDJOQUlDO0FBRUQsaUJBQVMsR0FBSSxhQUFhO0lBQzFCLCtNQU9DOzs7Ozs7Ozs7Ozs7O0FDL0REOzs7O0dBSUc7QUFDSDtJQW1CRSwyREFBMkQ7SUFDM0QscUJBQ1csS0FBWTtRQUFaLFVBQUssR0FBTCxLQUFLLENBQU87UUFuQnZCLGtGQUFrRjtRQUMzRSxjQUFTLEdBQW1CO1lBQ2pDLGlCQUFpQixFQUFFLEVBQUU7WUFDckIsbUJBQW1CLEVBQUUsRUFBRTtZQUN2QixXQUFXLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRTtZQUNwQyxRQUFRLEVBQUUsRUFBRTtTQUNiO1FBRUQsNkNBQTZDO1FBQ3RDLGNBQVMsR0FBWSxLQUFLO1FBRWpDLHVEQUF1RDtRQUM3QywrQkFBMEIsR0FBa0IsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFrQjtRQUM1RixnQ0FBMkIsR0FBa0IsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQWtCO1FBQzlGLCtCQUEwQixHQUFrQixJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQWtCO1FBQzVGLDZCQUF3QixHQUFrQixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQWtCO0lBSzlGLENBQUM7SUFFTDs7O09BR0c7SUFDSCwyQkFBSyxHQUFMO1FBQ0UsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDbkIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJO1NBQ3RCO0lBQ0gsQ0FBQztJQUVEOzs7T0FHRztJQUNJLHlCQUFHLEdBQVY7UUFDRSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLDBCQUEwQixDQUFDO1FBQ2hGLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsMkJBQTJCLENBQUM7SUFDL0UsQ0FBQztJQUVEOzs7T0FHRztJQUNJLDBCQUFJLEdBQVg7UUFDRSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLDBCQUEwQixDQUFDO1FBQ25GLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsMkJBQTJCLENBQUM7UUFDaEYsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsbUJBQW1CLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQywwQkFBMEIsQ0FBQztRQUNuRixJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLHdCQUF3QixDQUFDO0lBQ2pGLENBQUM7SUFFRDs7O09BR0c7SUFDSSwwQ0FBb0IsR0FBM0I7UUFFRSxJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU07UUFDaEMsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNO1FBRWhDLElBQU0sRUFBRSxHQUFHLE1BQU0sQ0FBQyxJQUFLO1FBQ3ZCLElBQU0sRUFBRSxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsS0FBSyxHQUFHLEVBQUU7UUFDaEMsSUFBTSxFQUFFLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEdBQUcsRUFBRTtRQUVqQyxJQUFJLENBQUMsU0FBUyxDQUFDLGlCQUFpQixHQUFHLENBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxNQUFNLENBQUMsQ0FBRSxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsTUFBTSxDQUFDLENBQUUsRUFBRSxDQUFDLENBQUU7SUFDcEcsQ0FBQztJQUVEOzs7T0FHRztJQUNPLCtDQUF5QixHQUFuQyxVQUFvQyxLQUFpQjtRQUVuRCxJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU07UUFFaEMsSUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLHFCQUFxQixFQUFFO1FBRTNDLElBQU0sS0FBSyxHQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUM7UUFDekUsSUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDO1FBRXpFLE9BQU8sQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDO0lBQ3ZCLENBQUM7SUFFRDs7OztPQUlHO0lBQ08scUNBQWUsR0FBekIsVUFBMEIsS0FBaUI7UUFFekMsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUs7UUFDeEIsSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVM7UUFDaEMsSUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLG1CQUFtQjtRQUN0QyxTQUFpQixJQUFJLENBQUMseUJBQXlCLENBQUMsS0FBSyxDQUFDLEVBQXJELEtBQUssVUFBRSxLQUFLLFFBQXlDO1FBRTVELEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBRSxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2pHLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBRSxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBRWpHLEtBQUssQ0FBQyxNQUFNLEVBQUU7SUFDaEIsQ0FBQztJQUVEOzs7T0FHRztJQUNPLG1DQUFhLEdBQXZCLFVBQXdCLEtBQWlCO1FBRXZDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFO1FBRW5CLEtBQUssQ0FBQyxNQUFPLENBQUMsbUJBQW1CLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQywwQkFBMEIsQ0FBQztRQUMvRSxLQUFLLENBQUMsTUFBTyxDQUFDLG1CQUFtQixDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsd0JBQXdCLENBQUM7SUFDN0UsQ0FBQztJQUVEOzs7O09BSUc7SUFDTyxxQ0FBZSxHQUF6QixVQUEwQixLQUFpQjtRQUV6QyxLQUFLLENBQUMsY0FBYyxFQUFFO1FBRXRCLElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLO1FBQ3hCLElBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTO1FBRWhDLEtBQUssQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQywwQkFBMEIsQ0FBQztRQUMzRSxLQUFLLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsd0JBQXdCLENBQUM7UUFFdkUsSUFBSSxNQUFNLEdBQUcsU0FBUyxDQUFDLGlCQUFpQjtRQUN4QyxTQUFTLENBQUMsbUJBQW1CLEdBQUcsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRTdILFNBQVMsQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRTtRQUVuRixTQUFpQixJQUFJLENBQUMseUJBQXlCLENBQUMsS0FBSyxDQUFDLEVBQXJELEtBQUssVUFBRSxLQUFLLFFBQXlDO1FBQzVELE1BQU0sR0FBRyxTQUFTLENBQUMsbUJBQW1CO1FBQ3RDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ3JELFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBRXJELEtBQUssQ0FBQyxNQUFNLEVBQUU7SUFDaEIsQ0FBQztJQUVEOzs7T0FHRztJQUNPLHNDQUFnQixHQUExQixVQUEyQixLQUFpQjtRQUUxQyxLQUFLLENBQUMsY0FBYyxFQUFFO1FBRXRCLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTTtRQUVoQyxnREFBZ0Q7UUFDMUMsU0FBaUIsSUFBSSxDQUFDLHlCQUF5QixDQUFDLEtBQUssQ0FBQyxFQUFyRCxLQUFLLFVBQUUsS0FBSyxRQUF5QztRQUU1RCxtQ0FBbUM7UUFDbkMsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxpQkFBaUI7UUFDN0MsSUFBTSxRQUFRLEdBQUcsQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNoRCxJQUFNLFFBQVEsR0FBRyxDQUFDLEtBQUssR0FBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBRWpELGtHQUFrRztRQUNsRyxJQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsSUFBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUM7UUFFaEUsa0VBQWtFO1FBQ2xFLE1BQU0sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFckQsd0NBQXdDO1FBQ3hDLElBQUksQ0FBQyxvQkFBb0IsRUFBRTtRQUUzQixzQ0FBc0M7UUFDdEMsTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsaUJBQWlCO1FBQ3pDLElBQU0sU0FBUyxHQUFHLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDakQsSUFBTSxTQUFTLEdBQUcsQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUVqRCx1RUFBdUU7UUFDdkUsTUFBTSxDQUFDLENBQUUsSUFBSSxRQUFRLEdBQUcsU0FBUztRQUNqQyxNQUFNLENBQUMsQ0FBRSxJQUFJLFFBQVEsR0FBRyxTQUFTO1FBRWpDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFO0lBQ3JCLENBQUM7SUFDSCxrQkFBQztBQUFELENBQUM7Ozs7Ozs7Ozs7Ozs7O0FDNUxELCtEQUF3QztBQUV4Qzs7O0dBR0c7QUFDSDtJQWNFLDJEQUEyRDtJQUMzRCxvQkFDVyxLQUFZO1FBQVosVUFBSyxHQUFMLEtBQUssQ0FBTztRQWR2Qix1Q0FBdUM7UUFDaEMsYUFBUSxHQUFZLEtBQUs7UUFFaEMsc0NBQXNDO1FBQy9CLGdCQUFXLEdBQVcsK0RBQStEO1FBRTVGLHlDQUF5QztRQUNsQyxlQUFVLEdBQVcsb0NBQW9DO1FBRWhFLDZDQUE2QztRQUN0QyxjQUFTLEdBQVksS0FBSztJQUs5QixDQUFDO0lBRUo7OztPQUdHO0lBQ0ksMEJBQUssR0FBWixVQUFhLFlBQTZCO1FBQTdCLG1EQUE2QjtRQUV4QyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUVuQixJQUFJLFlBQVksRUFBRTtnQkFDaEIsT0FBTyxDQUFDLEtBQUssRUFBRTthQUNoQjtZQUVELElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSTtTQUN0QjtJQUNILENBQUM7SUFFRDs7Ozs7Ozs7OztPQVVHO0lBQ0ksd0JBQUcsR0FBVjtRQUFBLGlCQVVDO1FBVlUsa0JBQXFCO2FBQXJCLFVBQXFCLEVBQXJCLHFCQUFxQixFQUFyQixJQUFxQjtZQUFyQiw2QkFBcUI7O1FBQzlCLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNqQixRQUFRLENBQUMsT0FBTyxDQUFDLGNBQUk7Z0JBQ25CLElBQUksT0FBUSxLQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssVUFBVSxFQUFFO29CQUM1QyxLQUFZLENBQUMsSUFBSSxDQUFDLEVBQUU7aUJBQ3RCO3FCQUFNO29CQUNMLE1BQU0sSUFBSSxLQUFLLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxHQUFHLGtCQUFrQixDQUFDO2lCQUNsRTtZQUNILENBQUMsQ0FBQztTQUNIO0lBQ0gsQ0FBQztJQUVEOzs7T0FHRztJQUNJLDBCQUFLLEdBQVosVUFBYSxPQUFlO1FBQzFCLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNqQixPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQztTQUN2QjtJQUNILENBQUM7SUFFRDs7O09BR0c7SUFDSSwwQkFBSyxHQUFaO1FBQ0UsT0FBTyxDQUFDLEdBQUcsQ0FBQyw4QkFBOEIsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQztRQUVwRixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUM1QixPQUFPLENBQUMsR0FBRyxDQUFDLHlDQUF5QyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUM7U0FDeEU7UUFFRCxPQUFPLENBQUMsS0FBSyxDQUFDLGtCQUFrQixFQUFFLElBQUksQ0FBQyxVQUFVLENBQUM7UUFDbEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzY0FBc2MsQ0FBQztRQUNuZCxPQUFPLENBQUMsUUFBUSxFQUFFO0lBQ3BCLENBQUM7SUFFRDs7O09BR0c7SUFDSSx3QkFBRyxHQUFWO1FBQ0UsT0FBTyxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDO1FBQ2hELE9BQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQztRQUNsRSxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDO1FBQzFELE9BQU8sQ0FBQyxRQUFRLEVBQUU7SUFDcEIsQ0FBQztJQUVEOzs7T0FHRztJQUNJLDZCQUFRLEdBQWY7UUFFRSxPQUFPLENBQUMsS0FBSyxDQUFDLG1DQUFtQyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUM7UUFDbkUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ3ZCLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ3BHLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBRWxHLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQzVCLE9BQU8sQ0FBQyxHQUFHLENBQUMsMkJBQTJCLEdBQUcsYUFBYSxDQUFDO1NBQ3pEO2FBQU07WUFDTCxPQUFPLENBQUMsR0FBRyxDQUFDLDJCQUEyQixHQUFHLGNBQWMsQ0FBQztTQUMxRDtRQUNELE9BQU8sQ0FBQyxRQUFRLEVBQUU7SUFDcEIsQ0FBQztJQUVEOzs7T0FHRztJQUNJLDRCQUFPLEdBQWQ7UUFDRSxPQUFPLENBQUMsS0FBSyxDQUFDLDZCQUE2QixFQUFFLElBQUksQ0FBQyxVQUFVLENBQUM7UUFDN0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztRQUM3QyxPQUFPLENBQUMsUUFBUSxFQUFFO1FBQ2xCLE9BQU8sQ0FBQyxLQUFLLENBQUMsK0JBQStCLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUMvRCxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDO1FBQzdDLE9BQU8sQ0FBQyxRQUFRLEVBQUU7SUFDcEIsQ0FBQztJQUVEOzs7T0FHRztJQUNJLDRCQUFPLEdBQWQ7UUFDRSxPQUFPLENBQUMsR0FBRyxDQUFDLHFDQUFxQyxHQUFHLHNCQUFjLEVBQUUsR0FBRyxNQUFNLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUMvRixPQUFPLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQztJQUM5QixDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksMkJBQU0sR0FBYjtRQUNFLE9BQU8sQ0FBQyxLQUFLLENBQUMsK0JBQStCLEdBQUcsc0JBQWMsRUFBRSxHQUFHLEdBQUcsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDO1FBQ3hGLE9BQU8sQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDO1FBQy9CLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsRUFBRSxHQUFHLEtBQUssQ0FBQztRQUMvRyxPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUNsRixPQUFPLENBQUMsR0FBRyxDQUFDLHdCQUF3QixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUNyRixPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsYUFBYSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUN2Riw0QkFBNEIsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxjQUFjLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQztZQUM5RSx3QkFBd0IsQ0FBQyxDQUFDO1FBQzVCLE9BQU8sQ0FBQyxRQUFRLEVBQUU7SUFDcEIsQ0FBQztJQUVEOzs7T0FHRztJQUNJLDRCQUFPLEdBQWQ7UUFDRSxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDbEQsQ0FBQztJQUVEOzs7T0FHRztJQUNJLDJCQUFNLEdBQWI7UUFDRSxPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixFQUFFLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDckQsQ0FBQztJQUVEOzs7T0FHRztJQUNJLDRCQUFPLEdBQWQsVUFBZSxLQUFhO1FBQzFCLE9BQU8sQ0FBQyxHQUFHLENBQUMsNkJBQTZCLEdBQUcsS0FBSyxHQUFHLEdBQUcsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDNUUsQ0FBQztJQUNILGlCQUFDO0FBQUQsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7QUNyTEQsK0RBQW1DO0FBRW5DOzs7R0FHRztBQUNIO0lBMEJFLDJEQUEyRDtJQUMzRCxtQkFDVyxLQUFZO1FBQVosVUFBSyxHQUFMLEtBQUssQ0FBTztRQTFCdkIscUNBQXFDO1FBQzlCLGFBQVEsR0FBWSxLQUFLO1FBRWhDLDBCQUEwQjtRQUNuQixXQUFNLEdBQVcsT0FBUztRQUVqQyxtQ0FBbUM7UUFDNUIsWUFBTyxHQUFXLEVBQUU7UUFFM0Isb0NBQW9DO1FBQzdCLFlBQU8sR0FBVyxFQUFFO1FBRTNCLGlDQUFpQztRQUMxQixXQUFNLEdBQWE7WUFDeEIsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTO1lBQ2hFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUztTQUNqRTtRQUVELDZDQUE2QztRQUN0QyxjQUFTLEdBQVksS0FBSztRQUVqQyxvQ0FBb0M7UUFDNUIsVUFBSyxHQUFXLENBQUM7SUFLdEIsQ0FBQztJQUVKOzs7T0FHRztJQUNJLHlCQUFLLEdBQVo7UUFFRSxrR0FBa0c7UUFDbEcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDbkIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJO1NBQ3RCO1FBRUQsb0NBQW9DO1FBQ3BDLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQztRQUVkLCtDQUErQztRQUMvQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUM1QixJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUN6RCxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNO1NBQzNDO0lBQ0gsQ0FBQztJQUVEOzs7T0FHRztJQUNJLDRCQUFRLEdBQWY7UUFDRSxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUM1QixJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ1osT0FBTztnQkFDTCxDQUFDLEVBQUUsaUJBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFNLENBQUM7Z0JBQ3BDLENBQUMsRUFBRSxpQkFBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU8sQ0FBQztnQkFDckMsS0FBSyxFQUFFLGlCQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFZLENBQUM7Z0JBQ3pDLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxHQUFHLGlCQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztnQkFDL0QsS0FBSyxFQUFFLGlCQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7YUFDckM7U0FDRjthQUNJO1lBQ0gsT0FBTyxJQUFJO1NBQ1o7SUFDSCxDQUFDO0lBQ0gsZ0JBQUM7QUFBRCxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM3RUQsaUZBQW9DO0FBQ3BDLCtEQUE2QztBQUU3Qzs7O0dBR0c7QUFDSDtJQVNFLDJEQUEyRDtJQUMzRCxtQkFDVyxLQUFZO1FBQVosVUFBSyxHQUFMLEtBQUssQ0FBTztRQVR2QixxQkFBcUI7UUFDZCxxQkFBZ0IsR0FBVyxFQUFFO1FBQzdCLHFCQUFnQixHQUFXLEVBQUU7UUFFcEMsNkNBQTZDO1FBQ3RDLGNBQVMsR0FBWSxLQUFLO0lBSzlCLENBQUM7SUFFSjs7O09BR0c7SUFDSSx5QkFBSyxHQUFaO1FBRUUsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFFbkIsNkJBQTZCO1lBQzdCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsb0JBQW9CLEVBQUU7WUFDbkQsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxvQkFBb0IsRUFBRTtZQUVuRCxxREFBcUQ7WUFDckQsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNO1lBRTlDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSTtTQUN0QjtJQUNILENBQUM7SUFFRDs7Ozs7Ozs7T0FRRztJQUNLLHdDQUFvQixHQUE1QjtRQUVFLGdFQUFnRTtRQUNoRSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVyxDQUFDO1FBRW5ELElBQUksSUFBSSxHQUFXLEVBQUU7UUFFckIsMkRBQTJEO1FBQzNELElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQUssRUFBRSxLQUFLO1lBQ2pDLFNBQVksMkJBQW1CLENBQUMsS0FBSyxDQUFDLEVBQXJDLENBQUMsVUFBRSxDQUFDLFVBQUUsQ0FBQyxRQUE4QjtZQUMxQyxJQUFJLElBQUkseUJBQXVCLEtBQUssMkJBQXNCLENBQUMsVUFBSyxDQUFDLFVBQUssQ0FBQyxTQUFNO1FBQy9FLENBQUMsQ0FBQztRQUVGLDJFQUEyRTtRQUMzRSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUU7UUFFdkIsK0VBQStFO1FBQy9FLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFakMsT0FBTyxPQUFPLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsRUFBRSxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUU7SUFDMUUsQ0FBQztJQUVEOzs7T0FHRztJQUNLLHdDQUFvQixHQUE1QjtRQUVFLElBQUksS0FBSyxHQUFXLEVBQUU7UUFDdEIsSUFBSSxLQUFLLEdBQVcsRUFBRTtRQUV0QixPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQUssRUFBRSxLQUFLO1lBRWxDLDZEQUE2RDtZQUM3RCxLQUFLLElBQUksV0FBUyxLQUFLLGFBQVEsS0FBSyxDQUFDLElBQUksRUFBRSxTQUFNO1lBRWpELDREQUE0RDtZQUM1RCxLQUFLLElBQUkseUJBQXVCLEtBQUssZUFBVSxLQUFLLFdBQVE7UUFDOUQsQ0FBQyxDQUFDO1FBRUYsZ0RBQWdEO1FBQ2hELEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUUxQiwrRUFBK0U7UUFDL0UsS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUVuQyxPQUFPLE9BQU8sQ0FBQyxpQkFBaUI7WUFDOUIsT0FBTyxDQUFDLG9CQUFvQixFQUFFLEtBQUssQ0FBQztZQUNwQyxPQUFPLENBQUMsbUJBQW1CLEVBQUUsS0FBSyxDQUFDO1lBQ25DLElBQUksRUFBRTtJQUNWLENBQUM7SUFDSCxnQkFBQztBQUFELENBQUM7Ozs7Ozs7Ozs7Ozs7O0FDcEdELCtEQUE2QztBQUU3Qzs7O0dBR0c7QUFDSDtJQXdDRSwyREFBMkQ7SUFDM0Qsb0JBQ1csS0FBWTtRQUFaLFVBQUssR0FBTCxLQUFLLENBQU87UUF4Q3ZCLDBEQUEwRDtRQUNuRCxVQUFLLEdBQVksS0FBSztRQUN0QixVQUFLLEdBQVksS0FBSztRQUN0QixZQUFPLEdBQVksS0FBSztRQUN4QixjQUFTLEdBQVksS0FBSztRQUMxQixtQkFBYyxHQUFZLElBQUk7UUFDOUIsdUJBQWtCLEdBQVksS0FBSztRQUNuQywwQkFBcUIsR0FBWSxLQUFLO1FBQ3RDLGlDQUE0QixHQUFZLElBQUk7UUFDNUMsb0JBQWUsR0FBeUIsa0JBQWtCO1FBRWpFLHNEQUFzRDtRQUMvQyxRQUFHLEdBQUcsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUU7UUFNN0MsMERBQTBEO1FBQ2xELGNBQVMsR0FBcUIsSUFBSSxHQUFHLEVBQUU7UUFFL0MsNkNBQTZDO1FBQ3RDLGNBQVMsR0FBWSxLQUFLO1FBRWpDLGdDQUFnQztRQUN6QixTQUFJLEdBQVUsRUFBRTtRQUVmLGNBQVMsR0FBYSxFQUFFO1FBRWhDLG1GQUFtRjtRQUMzRSxrQkFBYSxHQUF3QixJQUFJLEdBQUcsQ0FBQztZQUNuRCxDQUFDLFdBQVcsRUFBRSxNQUFNLENBQUM7WUFDckIsQ0FBQyxZQUFZLEVBQUUsTUFBTSxDQUFDO1lBQ3RCLENBQUMsWUFBWSxFQUFFLE1BQU0sQ0FBQztZQUN0QixDQUFDLGFBQWEsRUFBRSxNQUFNLENBQUM7WUFDdkIsQ0FBQyxjQUFjLEVBQUUsTUFBTSxDQUFDLENBQUssV0FBVztTQUN6QyxDQUFDO0lBS0UsQ0FBQztJQUVMOzs7T0FHRztJQUNJLDBCQUFLLEdBQVo7UUFFRSx1RUFBdUU7UUFDdkUsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFFbkIsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFO2dCQUM5QyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUs7Z0JBQ2pCLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztnQkFDakIsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPO2dCQUNyQixTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVM7Z0JBQ3pCLGNBQWMsRUFBRSxJQUFJLENBQUMsY0FBYztnQkFDbkMsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLGtCQUFrQjtnQkFDM0MscUJBQXFCLEVBQUUsSUFBSSxDQUFDLHFCQUFxQjtnQkFDakQsNEJBQTRCLEVBQUUsSUFBSSxDQUFDLDRCQUE0QjtnQkFDL0QsZUFBZSxFQUFFLElBQUksQ0FBQyxlQUFlO2FBQ3RDLENBQUU7WUFFSCxJQUFJLElBQUksQ0FBQyxFQUFFLEtBQUssSUFBSSxFQUFFO2dCQUNwQixNQUFNLElBQUksS0FBSyxDQUFDLDZDQUE2QyxDQUFDO2FBQy9EO1lBRUQsMERBQTBEO1lBQzFELElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLDJCQUEyQixDQUFDO1lBQzNELElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjO1lBQzlGLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDO1lBRXpELElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUM7WUFFM0IsZ0NBQWdDO1lBQ2hDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7WUFFdEYsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJO1NBQ3RCO1FBRUQsNkZBQTZGO1FBRTdGLCtDQUErQztRQUMvQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsV0FBVztRQUN2RCxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsWUFBWTtRQUN6RCxJQUFJLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFFekUsa0hBQWtIO1FBQ2xILElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxvQkFBcUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFO1lBQ2xHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFNLEdBQUcsQ0FBQztZQUNoRCxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTyxHQUFHLENBQUM7U0FDbEQ7UUFFRCw0RUFBNEU7UUFDNUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFRLENBQUM7SUFDM0MsQ0FBQztJQUVELDhCQUFTLEdBQVQ7UUFFRSxLQUFLLElBQUksRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUUsRUFBRSxFQUFFO1lBQ25ELElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRTtZQUNsQixLQUFLLElBQUksRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUUsRUFBRSxFQUFFO2dCQUNuRCxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUU7Z0JBQ3RCLEtBQUssSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsRUFBRSxFQUFFO29CQUNqRSxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUU7aUJBQzNCO2FBQ0Y7U0FDRjtJQUVILENBQUM7SUFFRDs7O09BR0c7SUFDSSwrQkFBVSxHQUFqQixVQUFrQixLQUFhO1FBQ3pCLFNBQVksMkJBQW1CLENBQUMsS0FBSyxDQUFDLEVBQXJDLENBQUMsVUFBRSxDQUFDLFVBQUUsQ0FBQyxRQUE4QjtRQUMxQyxJQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUM7SUFDbEMsQ0FBQztJQUVEOzs7T0FHRztJQUNJLG9DQUFlLEdBQXRCO1FBQ0UsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ0ksaUNBQVksR0FBbkIsVUFBb0IsSUFBeUMsRUFBRSxJQUFZO1FBRXpFLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUU7UUFDbkQsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQztRQUNsQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUM7UUFFN0IsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsa0JBQWtCLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsY0FBYyxDQUFDLEVBQUU7WUFDL0QsTUFBTSxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsR0FBRyxJQUFJLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDakc7UUFFRCxPQUFPLE1BQU07SUFDZixDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0ksNkNBQXdCLEdBQS9CLFVBQWdDLFVBQXVCLEVBQUUsVUFBdUI7UUFFOUUsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRztRQUMxQyxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQztRQUNqRCxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQztRQUNqRCxJQUFJLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO1FBQ3BDLElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDckMsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNJLGtDQUFhLEdBQXBCLFVBQXFCLGNBQXNCLEVBQUUsY0FBc0I7UUFFakUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQztRQUUvQixJQUFJLENBQUMsd0JBQXdCLENBQzNCLElBQUksQ0FBQyxZQUFZLENBQUMsZUFBZSxFQUFFLGNBQWMsQ0FBQyxFQUNsRCxJQUFJLENBQUMsWUFBWSxDQUFDLGlCQUFpQixFQUFFLGNBQWMsQ0FBQyxDQUNyRDtJQUNILENBQUM7SUFFRDs7Ozs7Ozs7OztPQVVHO0lBQ0ksbUNBQWMsR0FBckIsVUFBc0IsT0FBZTtRQUVuQyxJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFbkMsSUFBSSxPQUFPLEtBQUssSUFBSSxFQUFFO1lBQ3BCLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUM7U0FDbEY7YUFBTSxJQUFJLE9BQU8sS0FBSyxJQUFJLEVBQUU7WUFDM0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQztTQUNqRjthQUFNO1lBQ0wsTUFBTSxJQUFJLEtBQUssQ0FBQyxvREFBb0QsR0FBRyxPQUFPLENBQUM7U0FDaEY7SUFDSCxDQUFDO0lBRUQ7Ozs7Ozs7OztPQVNHO0lBQ0ksb0NBQWUsR0FBdEI7UUFBQSxpQkFFQztRQUZzQixrQkFBcUI7YUFBckIsVUFBcUIsRUFBckIscUJBQXFCLEVBQXJCLElBQXFCO1lBQXJCLDZCQUFxQjs7UUFDMUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxpQkFBTyxJQUFJLFlBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLEVBQTVCLENBQTRCLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBRUQ7Ozs7Ozs7Ozs7Ozs7O09BY0c7SUFDSSxpQ0FBWSxHQUFuQixVQUFvQixFQUFVLEVBQUUsRUFBVSxFQUFFLEVBQVUsRUFBRSxTQUFpQixFQUFFLElBQWdCO1FBRXpGLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFHO1FBQ3RDLElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLE1BQU0sQ0FBQztRQUNoRCxJQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUM7UUFFbkUsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxNQUFNO1FBRXpDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUU7UUFFMUUsT0FBTyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxpQkFBaUI7SUFDN0MsQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDSSxnQ0FBVyxHQUFsQixVQUFtQixPQUFlLEVBQUUsUUFBa0I7UUFDcEQsSUFBSSxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDO0lBQ3hFLENBQUM7SUFFRDs7Ozs7Ozs7Ozs7O09BWUc7SUFDSSw4QkFBUyxHQUFoQixVQUFpQixFQUFVLEVBQUUsRUFBVSxFQUFFLEVBQVUsRUFBRSxTQUFpQixFQUFFLE9BQWUsRUFBRSxJQUFZLEVBQUUsTUFBYyxFQUFFLE1BQWM7UUFFbkksSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDO1FBRTVDLElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDMUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQyxRQUFRLENBQUM7UUFDekMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUM7SUFDL0YsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNJLCtCQUFVLEdBQWpCLFVBQWtCLEtBQWEsRUFBRSxLQUFhO1FBQzVDLElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUM7SUFDbEQsQ0FBQztJQUNILGlCQUFDO0FBQUQsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM5U0QsK0RBQStDO0FBQy9DLHdHQUF5QztBQUN6QyxrR0FBc0M7QUFDdEMsa0dBQXNDO0FBQ3RDLCtGQUFvQztBQUNwQywrRkFBb0M7QUFFcEM7OztHQUdHO0FBQ0g7SUFpRkU7Ozs7Ozs7Ozs7T0FVRztJQUNILGVBQVksUUFBZ0IsRUFBRSxPQUFzQjtRQTFGcEQsNENBQTRDO1FBQ3JDLGFBQVEsR0FBa0IsU0FBUztRQUUxQyw2QkFBNkI7UUFDdEIsVUFBSyxHQUFlLElBQUkscUJBQVUsQ0FBQyxJQUFJLENBQUM7UUFFL0MsK0NBQStDO1FBQ3hDLFNBQUksR0FBYyxJQUFJLG9CQUFTLENBQUMsSUFBSSxDQUFDO1FBRTVDLG9CQUFvQjtRQUNiLFVBQUssR0FBZSxJQUFJLHFCQUFVLENBQUMsSUFBSSxDQUFDO1FBRS9DLGlDQUFpQztRQUMxQixTQUFJLEdBQWMsSUFBSSxvQkFBUyxDQUFDLElBQUksQ0FBQztRQUU1Qyw4Q0FBOEM7UUFDdkMsYUFBUSxHQUFZLEtBQUs7UUFFaEMsOENBQThDO1FBQ3ZDLGdCQUFXLEdBQVcsVUFBYTtRQUUxQyw0Q0FBNEM7UUFDckMsZUFBVSxHQUFXLEtBQU07UUFFbEMsaUNBQWlDO1FBQzFCLFdBQU0sR0FBYSxFQUFFO1FBRTVCLHdDQUF3QztRQUNqQyxTQUFJLEdBQWM7WUFDdkIsS0FBSyxFQUFFLEtBQU07WUFDYixNQUFNLEVBQUUsS0FBTTtZQUNkLE9BQU8sRUFBRSxTQUFTO1lBQ2xCLFVBQVUsRUFBRSxTQUFTO1NBQ3RCO1FBRUQsbUNBQW1DO1FBQzVCLFdBQU0sR0FBZ0I7WUFDM0IsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBTSxHQUFHLENBQUM7WUFDdkIsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTyxHQUFHLENBQUM7WUFDeEIsSUFBSSxFQUFFLENBQUM7U0FDUjtRQUVELHlEQUF5RDtRQUNsRCxhQUFRLEdBQVksSUFBSTtRQUUvQiwrREFBK0Q7UUFDeEQsY0FBUyxHQUFZLEtBQUs7UUFLakMsaUNBQWlDO1FBQzFCLFVBQUssR0FBRztZQUNiLGFBQWEsRUFBRSxDQUFDO1lBQ2hCLGVBQWUsRUFBRSxFQUFFO1lBQ25CLFdBQVcsRUFBRSxDQUFDO1lBQ2QsUUFBUSxFQUFFLENBQUM7U0FDWjtRQUtELDBGQUEwRjtRQUNuRix5QkFBb0IsR0FBNkIsRUFBRTtRQUUxRCxpREFBaUQ7UUFDdkMsWUFBTyxHQUFnQixJQUFJLHVCQUFXLENBQUMsSUFBSSxDQUFDO1FBRXRELDhFQUE4RTtRQUN0RSxjQUFTLEdBQVksS0FBSztRQUUzQixTQUFJLEdBQUc7WUFDWixNQUFNLEVBQUUsRUFBVztZQUNuQixNQUFNLEVBQUUsQ0FBQztZQUNULE1BQU0sRUFBRSxDQUFDO1lBQ1QsT0FBTyxFQUFFLENBQUM7WUFDVixPQUFPLEVBQUUsQ0FBQztTQUNYO1FBZUMsSUFBSSxRQUFRLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQ3JDLElBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQXNCO1NBQ3JFO2FBQU07WUFDTCxNQUFNLElBQUksS0FBSyxDQUFDLDZCQUE2QixHQUFHLFFBQVEsR0FBRyxjQUFjLENBQUM7U0FDM0U7UUFFRCxJQUFJLE9BQU8sRUFBRTtZQUVYLG9FQUFvRTtZQUNwRSw2QkFBcUIsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDO1lBQ3BDLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxPQUFPO1lBRW5DLGlGQUFpRjtZQUNqRixJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ2pCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDO2FBQ3BCO1NBQ0Y7SUFDSCxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSSxxQkFBSyxHQUFaLFVBQWEsT0FBc0I7UUFFakMsSUFBSSxDQUFDLE9BQU87WUFBRSxPQUFPLEdBQUcsRUFBRTtRQUUxQiw0Q0FBNEM7UUFDNUMsNkJBQXFCLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQztRQUNwQyxJQUFJLENBQUMsb0JBQW9CLEdBQUcsT0FBTztRQUVuQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUM7UUFFdkIsOEVBQThFO1FBQzlFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFO1FBQ2xCLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO1FBQ2pCLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFO1FBQ2xCLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFO1FBQ3BCLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO1FBRWpCLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQztRQUUxQiw0RUFBNEU7UUFDNUUsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2pCLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFFWCw0RkFBNEY7WUFDNUYsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLO1NBQ3RCO1FBRUQsMkVBQTJFO1FBQzNFLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO1lBRW5CLGlDQUFpQztZQUNqQyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxZQUFZLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsVUFBVSxDQUFDO1lBRXBGLDZFQUE2RTtZQUM3RSxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUk7U0FDdEI7UUFFRCxrREFBa0Q7UUFDbEQsSUFBSSxDQUFDLFVBQVUsRUFBRTtRQUVqQixJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDakIsd0RBQXdEO1lBQ3hELElBQUksQ0FBQyxHQUFHLEVBQUU7U0FDWDtJQUNILENBQUM7SUFFRDs7O09BR0c7SUFDTyxvQkFBSSxHQUFkO1FBRUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDO1FBRXpCLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxhQUFhLEVBQUUsQ0FBQyxFQUFFLGVBQWUsRUFBRSxFQUFFLEVBQUUsV0FBVyxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFFO1FBRW5GLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsQ0FBQztRQUNsQixJQUFJLE1BQTBCO1FBQzlCLElBQUksWUFBWSxHQUFZLEtBQUs7UUFFakMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTztRQUMxQixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPO1FBQzFCLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ3ZFLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDO1FBRXhFLElBQUksTUFBTSxHQUFVLEVBQUU7UUFFdEIsS0FBSyxJQUFJLElBQUUsR0FBRyxDQUFDLEVBQUUsSUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUUsRUFBRSxFQUFFO1lBQzdDLE1BQU0sQ0FBQyxJQUFFLENBQUMsR0FBRyxFQUFFO1lBQ2YsS0FBSyxJQUFJLElBQUUsR0FBRyxDQUFDLEVBQUUsSUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUUsRUFBRSxFQUFFO2dCQUM3QyxNQUFNLENBQUMsSUFBRSxDQUFDLENBQUMsSUFBRSxDQUFDLEdBQUcsRUFBRTthQUNwQjtTQUNGO1FBRUQsT0FBTyxDQUFDLFlBQVksRUFBRTtZQUVwQixNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVMsRUFBRTtZQUV6Qiw4RkFBOEY7WUFDOUYsWUFBWSxHQUFHLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQztZQUVsRixJQUFJLENBQUMsWUFBWSxFQUFFO2dCQUVqQixNQUFNLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFPLENBQUM7Z0JBRWxDLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7Z0JBQzVDLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7Z0JBRTVDLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRTtvQkFDckMsRUFBRSxHQUFHLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQztvQkFDOUIsSUFBSSxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7d0JBQ25ELEVBQUUsRUFBRTt3QkFDSixNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRTt3QkFDdkIsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBSSxnQkFBZ0I7d0JBQzlDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUksY0FBYzt3QkFDNUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBSSxnQkFBZ0I7d0JBQzlDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUksa0JBQWtCO3FCQUNqRDtpQkFDRjtxQkFBTTtvQkFDTCxFQUFFLEdBQUcsQ0FBQztvQkFDTixNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRTtvQkFDdkIsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBSSxnQkFBZ0I7b0JBQzlDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUksY0FBYztvQkFDNUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBSSxnQkFBZ0I7b0JBQzlDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUksa0JBQWtCO2lCQUNqRDtnQkFFRCxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDOUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO2dCQUN4QyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7Z0JBQ3hDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztnQkFFdkMsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUU7YUFDM0I7WUFFRCxvREFBb0Q7WUFDcEQsZ0ZBQWdGO1lBQ2hGLElBQUk7WUFFSixxREFBcUQ7WUFDckQsNkJBQTZCO1lBQzdCLGNBQWM7WUFDZCxTQUFTO1lBQ1QsMEJBQTBCO1lBQzFCLElBQUk7U0FDTDtRQUVELElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU07UUFFekIsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUU7UUFFdEIsc0RBQXNEO1FBQ3RELEtBQUssSUFBSSxJQUFFLEdBQUcsQ0FBQyxFQUFFLElBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFFLEVBQUUsRUFBRTtZQUM3QyxLQUFLLElBQUksSUFBRSxHQUFHLENBQUMsRUFBRSxJQUFFLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBRSxFQUFFLEVBQUU7Z0JBQzdDLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBRSxDQUFDLENBQUMsSUFBRSxDQUFDLENBQUMsRUFBRTtvQkFDakMsS0FBSyxJQUFJLElBQUUsR0FBRyxDQUFDLEVBQUUsSUFBRSxHQUFHLE1BQU0sQ0FBQyxJQUFFLENBQUMsQ0FBQyxJQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsSUFBRSxFQUFFLEVBQUU7d0JBRWpELElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLElBQUUsRUFBRSxJQUFFLEVBQUUsSUFBRSxFQUFFLENBQUMsRUFBRSxJQUFJLFlBQVksQ0FBQyxNQUFNLENBQUMsSUFBRSxDQUFDLENBQUMsSUFBRSxDQUFDLENBQUMsSUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDL0UsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsSUFBRSxFQUFFLElBQUUsRUFBRSxJQUFFLEVBQUUsQ0FBQyxFQUFFLElBQUksVUFBVSxDQUFDLE1BQU0sQ0FBQyxJQUFFLENBQUMsQ0FBQyxJQUFFLENBQUMsQ0FBQyxJQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUM3RSxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxJQUFFLEVBQUUsSUFBRSxFQUFFLElBQUUsRUFBRSxDQUFDLEVBQUUsSUFBSSxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUUsQ0FBQyxDQUFDLElBQUUsQ0FBQyxDQUFDLElBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQzdFLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLElBQUUsRUFBRSxJQUFFLEVBQUUsSUFBRSxFQUFFLENBQUMsRUFBRSxJQUFJLFlBQVksQ0FBQyxNQUFNLENBQUMsSUFBRSxDQUFDLENBQUMsSUFBRSxDQUFDLENBQUMsSUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFFaEY7aUJBQ0Y7YUFDRjtTQUNGO1FBRUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDO0lBQzFCLENBQUM7SUFFRDs7O09BR0c7SUFDSCwyQkFBVyxHQUFYLFVBQVksTUFBbUI7UUFFN0Isa0RBQWtEO1FBQ2xELElBQUksTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQU07WUFBRSxNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBTTtRQUM1RCxJQUFJLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFPO1lBQUUsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU87UUFDOUQsSUFBSSxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUM7WUFBRSxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUM7UUFDOUIsSUFBSSxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUM7WUFBRSxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUM7UUFFOUIsMkRBQTJEO1FBQzNELElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxXQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1lBQUUsTUFBTSxDQUFDLEtBQUssR0FBRyxDQUFDO1FBQy9FLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztZQUFFLE1BQU0sQ0FBQyxLQUFLLEdBQUcsQ0FBQztRQUVoRixPQUFPLE1BQU07SUFDZixDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksc0JBQU0sR0FBYjtRQUVFLHdDQUF3QztRQUN4QyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsRUFBRTtRQUU1Qix3Q0FBd0M7UUFDeEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsRUFBRTtRQUVuQywyREFBMkQ7UUFDM0QsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLGlCQUFpQixDQUFDO1FBRTVFLG9EQUFvRDtRQUNwRCxLQUFLLElBQUksRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRSxFQUFFLEVBQUU7WUFDN0MsS0FBSyxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUUsRUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUUsRUFBRSxFQUFFO2dCQUM3QyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRTtvQkFDM0MsS0FBSyxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUUsRUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLEVBQUUsRUFBRTt3QkFFM0QsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLFlBQVksRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQzt3QkFDMUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQzt3QkFDdkQsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQzt3QkFDdkQsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQzt3QkFFdEQsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztxQkFDakU7aUJBQ0Y7YUFDRjtTQUNGO0lBQ0gsQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDSCwwQkFBVSxHQUFWO1FBRUU7OztXQUdHO1FBQ0gsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDbkIsSUFBSSxDQUFDLEtBQUssRUFBRTtTQUNiO1FBRUQsd0RBQXdEO1FBQ3hELElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2xCLE1BQU0sSUFBSSxLQUFLLENBQUMsMENBQTBDLENBQUM7U0FDNUQ7SUFDSCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksbUJBQUcsR0FBVjtRQUVFLElBQUksQ0FBQyxVQUFVLEVBQUU7UUFFakIsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDbkIsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNiLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFO1lBQ2xCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSTtZQUNyQixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUM7U0FDMUI7SUFDSCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksb0JBQUksR0FBWDtRQUVFLElBQUksQ0FBQyxVQUFVLEVBQUU7UUFFakIsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2xCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFO1lBQ25CLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSztZQUN0QixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUM7U0FDekI7SUFDSCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0kscUJBQUssR0FBWjtRQUVFLElBQUksQ0FBQyxVQUFVLEVBQUU7UUFFakIsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLEVBQUU7UUFDNUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDO0lBQzNCLENBQUM7SUFDSCxZQUFDO0FBQUQsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7O0FDN1lEOzs7Ozs7R0FNRztBQUNILFNBQWdCLFFBQVEsQ0FBQyxRQUFhO0lBQ3BDLE9BQU8sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssaUJBQWlCLENBQUM7QUFDekUsQ0FBQztBQUZELDRCQUVDO0FBRUQ7Ozs7Ozs7Ozs7O0dBV0c7QUFDSCxTQUFnQixxQkFBcUIsQ0FBQyxNQUFXLEVBQUUsTUFBVztJQUM1RCxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFHO1FBQzdCLElBQUksR0FBRyxJQUFJLE1BQU0sRUFBRTtZQUNqQixJQUFJLFFBQVEsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTtnQkFDekIsSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUU7b0JBQ3pCLHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQ2hEO2FBQ0Y7aUJBQU07Z0JBQ0wsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLFVBQVUsQ0FBQyxFQUFFO29CQUNqRSxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQztpQkFDMUI7YUFDRjtTQUNGO0lBQ0gsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQWRELHNEQWNDO0FBRUQ7Ozs7OztHQU1HO0FBQ0gsU0FBZ0IsU0FBUyxDQUFDLEtBQWE7SUFDckMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxLQUFLLENBQUM7QUFDMUMsQ0FBQztBQUZELDhCQUVDO0FBRUQ7Ozs7OztHQU1HO0FBQ0gsU0FBZ0IsbUJBQW1CLENBQUMsUUFBZ0I7SUFDbEQsSUFBSSxDQUFDLEdBQUcsMkNBQTJDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUM5RCxTQUFZLENBQUMsUUFBUSxDQUFDLENBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBNUYsQ0FBQyxVQUFFLENBQUMsVUFBRSxDQUFDLFFBQXFGO0lBQ2pHLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNsQixDQUFDO0FBSkQsa0RBSUM7QUFFRDs7Ozs7R0FLRztBQUNILFNBQWdCLGNBQWM7SUFFNUIsSUFBSSxLQUFLLEdBQUcsSUFBSSxJQUFJLEVBQUU7SUFFdEIsT0FBTztRQUNMLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQztRQUM1QyxLQUFLLENBQUMsVUFBVSxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUM7UUFDOUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDO0tBQy9DLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztBQUNiLENBQUM7QUFURCx3Q0FTQzs7Ozs7OztVQy9FRDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsZ0NBQWdDLFlBQVk7V0FDNUM7V0FDQSxFOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0Esd0NBQXdDLHlDQUF5QztXQUNqRjtXQUNBO1dBQ0EsRTs7Ozs7V0NQQSx3Rjs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSxzREFBc0Qsa0JBQWtCO1dBQ3hFO1dBQ0EsK0NBQStDLGNBQWM7V0FDN0QsRTs7Ozs7Ozs7Ozs7Ozs7QUNOMkI7QUFDWDs7QUFFaEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxzQkFBc0IsK0NBQUs7O0FBRTNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRCIsImZpbGUiOiJzY3JpcHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCJleHBvcnQgY29uc3QgVkVSVEVYX1RFTVBMQVRFID1cbmBcbnByZWNpc2lvbiBsb3dwIGZsb2F0O1xuYXR0cmlidXRlIGxvd3AgdmVjMiBhX3Bvc2l0aW9uO1xuYXR0cmlidXRlIGZsb2F0IGFfY29sb3I7XG5hdHRyaWJ1dGUgZmxvYXQgYV9zaXplO1xuYXR0cmlidXRlIGZsb2F0IGFfc2hhcGU7XG51bmlmb3JtIGxvd3AgbWF0MyB1X21hdHJpeDtcbnZhcnlpbmcgbG93cCB2ZWMzIHZfY29sb3I7XG52YXJ5aW5nIGZsb2F0IHZfc2hhcGU7XG52b2lkIG1haW4oKSB7XG4gIGdsX1Bvc2l0aW9uID0gdmVjNCgodV9tYXRyaXggKiB2ZWMzKGFfcG9zaXRpb24sIDEpKS54eSwgMC4wLCAxLjApO1xuICBnbF9Qb2ludFNpemUgPSBhX3NpemU7XG4gIHZfc2hhcGUgPSBhX3NoYXBlO1xuICB7Q09MT1ItU0VMRUNUSU9OfVxufVxuYFxuXG5leHBvcnQgY29uc3QgRlJBR01FTlRfVEVNUExBVEUgPVxuYFxucHJlY2lzaW9uIGxvd3AgZmxvYXQ7XG52YXJ5aW5nIHZlYzMgdl9jb2xvcjtcbnZhcnlpbmcgZmxvYXQgdl9zaGFwZTtcbntTSEFQRVMtRlVOQ1RJT05TfVxudm9pZCBtYWluKCkge1xuICB7U0hBUEUtU0VMRUNUSU9OfVxuICBnbF9GcmFnQ29sb3IgPSB2ZWM0KHZfY29sb3IucmdiLCAxLjApO1xufVxuYFxuXG5leHBvcnQgY29uc3QgU0hBUEVTOiBzdHJpbmdbXSA9IFtdXG5cblNIQVBFU1swXSA9ICAvLyDQmtCy0LDQtNGA0LDRglxuYFxuYFxuXG5TSEFQRVNbMV0gPSAgLy8g0JrRgNGD0LNcbmBcbmlmIChsZW5ndGgoZ2xfUG9pbnRDb29yZCAtIDAuNSkgPiAwLjUpIGRpc2NhcmQ7XG5gXG5cblNIQVBFU1syXSA9ICAvLyDQmtGA0LXRgdGCXG5gXG5pZiAoKGFsbChsZXNzVGhhbihnbF9Qb2ludENvb3JkLCB2ZWMyKDAuMykpKSkgfHxcbiAgKChnbF9Qb2ludENvb3JkLnggPiAwLjcpICYmIChnbF9Qb2ludENvb3JkLnkgPCAwLjMpKSB8fFxuICAoYWxsKGdyZWF0ZXJUaGFuKGdsX1BvaW50Q29vcmQsIHZlYzIoMC43KSkpKSB8fFxuICAoKGdsX1BvaW50Q29vcmQueCA8IDAuMykgJiYgKGdsX1BvaW50Q29vcmQueSA+IDAuNykpXG4gICkgZGlzY2FyZDtcbmBcblxuU0hBUEVTWzNdID0gIC8vINCi0YDQtdGD0LPQvtC70YzQvdC40LpcbmBcbnZlYzIgcG9zID0gdmVjMihnbF9Qb2ludENvb3JkLngsIGdsX1BvaW50Q29vcmQueSAtIDAuMSkgLSAwLjU7XG5mbG9hdCBhID0gYXRhbihwb3MueCwgcG9zLnkpICsgMi4wOTQzOTUxMDIzOTtcbmlmIChzdGVwKDAuMjg1LCBjb3MoZmxvb3IoMC41ICsgYSAvIDIuMDk0Mzk1MTAyMzkpICogMi4wOTQzOTUxMDIzOSAtIGEpICogbGVuZ3RoKHBvcykpID4gMC45KSBkaXNjYXJkO1xuYFxuXG5TSEFQRVNbNF0gPSAgLy8g0KjQtdGB0YLQtdGA0LXQvdC60LBcbmBcbnZlYzIgcG9zID0gdmVjMigwLjUpIC0gZ2xfUG9pbnRDb29yZDtcbmZsb2F0IHIgPSBsZW5ndGgocG9zKSAqIDEuNjI7XG5mbG9hdCBhID0gYXRhbihwb3MueSwgcG9zLngpO1xuZmxvYXQgZiA9IGNvcyhhICogMy4wKTtcbmYgPSBzdGVwKDAuMCwgY29zKGEgKiAxMC4wKSkgKiAwLjIgKyAwLjU7XG5pZiAoIHN0ZXAoZiwgcikgPiAwLjUgKSBkaXNjYXJkO1xuYFxuIiwiaW1wb3J0IFNQbG90IGZyb20gJ0Avc3Bsb3QnXG5cbi8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKlxuICog0JrQu9Cw0YHRgS3RhdC10LvQv9C10YAsINGA0LXQsNC70LjQt9GD0Y7RidC40Lkg0L7QsdGA0LDQsdC+0YLQutGDINGB0YDQtdC00YHRgtCyINCy0LLQvtC00LAgKNC80YvRiNC4LCDRgtGA0LXQutC/0LDQtNCwINC4INGCLtC/Likg0Lgg0LzQsNGC0LXQvNCw0YLQuNGH0LXRgdC60LjQtSDRgNCw0YHRh9C10YLRiyDRgtC10YXQvdC40YfQtdGB0LrQuNGFINC00LDQvdC90YvRhSxcbiAqINGB0L7QvtGC0LLQtdGC0YHQstGD0Y7RidC40YUg0YLRgNCw0L3RgdGE0L7RgNC80LDRhtC40Y/QvCDQs9GA0LDRhNC40LrQsCDQtNC70Y8g0LrQu9Cw0YHRgdCwIFNwbG90LlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTUGxvdENvbnRvbCBpbXBsZW1lbnRzIFNQbG90SGVscGVyIHtcblxuICAvKiog0KLQtdGF0L3QuNGH0LXRgdC60LDRjyDQuNC90YTQvtGA0LzQsNGG0LjRjywg0LjRgdC/0L7Qu9GM0LfRg9C10LzQsNGPINC/0YDQuNC70L7QttC10L3QuNC10Lwg0LTQu9GPINGA0LDRgdGH0LXRgtCwINGC0YDQsNC90YHRhNC+0YDQvNCw0YbQuNC5LiAqL1xuICBwdWJsaWMgdHJhbnNmb3JtOiBTUGxvdFRyYW5zZm9ybSA9IHtcbiAgICB2aWV3UHJvamVjdGlvbk1hdDogW10sXG4gICAgc3RhcnRJbnZWaWV3UHJvak1hdDogW10sXG4gICAgc3RhcnRDYW1lcmE6IHsgeDogMCwgeTogMCwgem9vbTogMSB9LFxuICAgIHN0YXJ0UG9zOiBbXSxcbiAgfVxuXG4gIC8qKiDQn9GA0LjQt9C90LDQuiDRgtC+0LPQviwg0YfRgtC+INGF0LXQu9C/0LXRgCDRg9C20LUg0L3QsNGB0YLRgNC+0LXQvS4gKi9cbiAgcHVibGljIGlzU2V0dXBlZDogYm9vbGVhbiA9IGZhbHNlXG5cbiAgLyoqINCe0LHRgNCw0LHQvtGC0YfQuNC60Lgg0YHQvtCx0YvRgtC40Lkg0YEg0LfQsNC60YDQtdC/0LvQtdC90L3Ri9C80Lgg0LrQvtC90YLQtdC60YHRgtCw0LzQuC4gKi9cbiAgcHJvdGVjdGVkIGhhbmRsZU1vdXNlRG93bldpdGhDb250ZXh0OiBFdmVudExpc3RlbmVyID0gdGhpcy5oYW5kbGVNb3VzZURvd24uYmluZCh0aGlzKSBhcyBFdmVudExpc3RlbmVyXG4gIHByb3RlY3RlZCBoYW5kbGVNb3VzZVdoZWVsV2l0aENvbnRleHQ6IEV2ZW50TGlzdGVuZXIgPSB0aGlzLmhhbmRsZU1vdXNlV2hlZWwuYmluZCh0aGlzKSBhcyBFdmVudExpc3RlbmVyXG4gIHByb3RlY3RlZCBoYW5kbGVNb3VzZU1vdmVXaXRoQ29udGV4dDogRXZlbnRMaXN0ZW5lciA9IHRoaXMuaGFuZGxlTW91c2VNb3ZlLmJpbmQodGhpcykgYXMgRXZlbnRMaXN0ZW5lclxuICBwcm90ZWN0ZWQgaGFuZGxlTW91c2VVcFdpdGhDb250ZXh0OiBFdmVudExpc3RlbmVyID0gdGhpcy5oYW5kbGVNb3VzZVVwLmJpbmQodGhpcykgYXMgRXZlbnRMaXN0ZW5lclxuXG4gIC8qKiDQpdC10LvQv9C10YAg0LHRg9C00LXRgiDQuNC80LXRgtGMINC/0L7Qu9C90YvQuSDQtNC+0YHRgtGD0L8g0Log0Y3QutC30LXQvNC/0LvRj9GA0YMgU1Bsb3QuICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIHJlYWRvbmx5IHNwbG90OiBTUGxvdFxuICApIHsgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCf0L7QtNCz0L7RgtCw0LLQu9C40LLQsNC10YIg0YXQtdC70L/QtdGAINC6INC40YHQv9C+0LvRjNC30L7QstCw0L3QuNGOLlxuICAgKi9cbiAgc2V0dXAoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmlzU2V0dXBlZCkge1xuICAgICAgdGhpcy5pc1NldHVwZWQgPSB0cnVlXG4gICAgfVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JfQsNC/0YPRgdC60LDQtdGCINC/0YDQvtGB0LvRg9GI0LrRgyDRgdC+0LHRi9GC0LjQuSDQvNGL0YjQuC5cbiAgICovXG4gIHB1YmxpYyBydW4oKTogdm9pZCB7XG4gICAgdGhpcy5zcGxvdC5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5oYW5kbGVNb3VzZURvd25XaXRoQ29udGV4dClcbiAgICB0aGlzLnNwbG90LmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCd3aGVlbCcsIHRoaXMuaGFuZGxlTW91c2VXaGVlbFdpdGhDb250ZXh0KVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0J7RgdGC0LDQvdCw0LLQu9C40LLQsNC10YIg0L/RgNC+0YHQu9GD0YjQutGDINGB0L7QsdGL0YLQuNC5INC80YvRiNC4LlxuICAgKi9cbiAgcHVibGljIHN0b3AoKTogdm9pZCB7XG4gICAgdGhpcy5zcGxvdC5jYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5oYW5kbGVNb3VzZURvd25XaXRoQ29udGV4dClcbiAgICB0aGlzLnNwbG90LmNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKCd3aGVlbCcsIHRoaXMuaGFuZGxlTW91c2VXaGVlbFdpdGhDb250ZXh0KVxuICAgIHRoaXMuc3Bsb3QuY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMuaGFuZGxlTW91c2VNb3ZlV2l0aENvbnRleHQpXG4gICAgdGhpcy5zcGxvdC5jYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuaGFuZGxlTW91c2VVcFdpdGhDb250ZXh0KVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0J7QsdC90L7QstC70Y/QtdGCINC80LDRgtGA0LjRhtGDINGC0YDQsNC90YHRhNC+0YDQvNCw0YbQuNC4LlxuICAgKi9cbiAgcHVibGljIHVwZGF0ZVZpZXdQcm9qZWN0aW9uKCk6IHZvaWQge1xuXG4gICAgY29uc3QgY2FudmFzID0gdGhpcy5zcGxvdC5jYW52YXNcbiAgICBjb25zdCBjYW1lcmEgPSB0aGlzLnNwbG90LmNhbWVyYVxuXG4gICAgY29uc3QgZDAgPSBjYW1lcmEuem9vbSFcbiAgICBjb25zdCBkMSA9IDIgLyBjYW52YXMud2lkdGggKiBkMFxuICAgIGNvbnN0IGQyID0gMiAvIGNhbnZhcy5oZWlnaHQgKiBkMFxuXG4gICAgdGhpcy50cmFuc2Zvcm0udmlld1Byb2plY3Rpb25NYXQgPSBbIGQxLCAwLCAwLCAwLCAtZDIsIDAsIC1kMSAqIGNhbWVyYS54ISAtIDEsIGQyICogY2FtZXJhLnkhLCAxIF1cbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCf0YDQtdC+0LHRgNCw0LfRg9C10YIg0LrQvtC+0YDQtNC40L3QsNGC0Ysg0LzRi9GI0Lgg0LIgR0wt0LrQvtC+0YDQtNC40L3QsNGC0YsuXG4gICAqL1xuICBwcm90ZWN0ZWQgZ2V0Q2xpcFNwYWNlTW91c2VQb3NpdGlvbihldmVudDogTW91c2VFdmVudCk6IG51bWJlcltdIHtcblxuICAgIGNvbnN0IGNhbnZhcyA9IHRoaXMuc3Bsb3QuY2FudmFzXG5cbiAgICBjb25zdCByZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG5cbiAgICBjb25zdCBjbGlwWCA9ICAyICogKChldmVudC5jbGllbnRYIC0gcmVjdC5sZWZ0KSAvIGNhbnZhcy5jbGllbnRXaWR0aCkgLSAxXG4gICAgY29uc3QgY2xpcFkgPSAtMiAqICgoZXZlbnQuY2xpZW50WSAtIHJlY3QudG9wKSAvIGNhbnZhcy5jbGllbnRIZWlnaHQpICsgMVxuXG4gICAgcmV0dXJuIFtjbGlwWCwgY2xpcFldXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQoNC10LDQs9C40YDRg9C10YIg0L3QsCDQtNCy0LjQttC10L3QuNC1INC80YvRiNC4INCyINC80L7QvNC10L3Rgiwg0LrQvtCz0LTQsCDQtdC1INC60LvQsNCy0LjRiNCwINGD0LTQtdGA0LbQuNCy0LDQtdGC0YHRjyDQvdCw0LbQsNGC0L7QuS4g0JzQtdGC0L7QtCDQv9C10YDQtdC80LXRidCw0LXRgiDQvtCx0LvQsNGB0YLRjCDQstC40LTQuNC80L7RgdGC0Lgg0L3QsFxuICAgKiDQv9C70L7RgdC60L7RgdGC0Lgg0LLQvNC10YHRgtC1INGBINC00LLQuNC20LXQvdC40LXQvCDQvNGL0YjQuC5cbiAgICovXG4gIHByb3RlY3RlZCBoYW5kbGVNb3VzZU1vdmUoZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcblxuICAgIGNvbnN0IHNwbG90ID0gdGhpcy5zcGxvdFxuICAgIGNvbnN0IHRyYW5zZm9ybSA9IHRoaXMudHJhbnNmb3JtXG4gICAgY29uc3QgbWF0cml4ID0gdHJhbnNmb3JtLnN0YXJ0SW52Vmlld1Byb2pNYXRcbiAgICBjb25zdCBbY2xpcFgsIGNsaXBZXSA9IHRoaXMuZ2V0Q2xpcFNwYWNlTW91c2VQb3NpdGlvbihldmVudClcblxuICAgIHNwbG90LmNhbWVyYS54ID0gdHJhbnNmb3JtLnN0YXJ0Q2FtZXJhLnghICsgdHJhbnNmb3JtLnN0YXJ0UG9zWzBdIC0gY2xpcFggKiBtYXRyaXhbMF0gLSBtYXRyaXhbNl1cbiAgICBzcGxvdC5jYW1lcmEueSA9IHRyYW5zZm9ybS5zdGFydENhbWVyYS55ISArIHRyYW5zZm9ybS5zdGFydFBvc1sxXSAtIGNsaXBZICogbWF0cml4WzRdIC0gbWF0cml4WzddXG5cbiAgICBzcGxvdC5yZW5kZXIoKVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0KDQtdCw0LPQuNGA0YPQtdGCINC90LAg0L7RgtC20LDRgtC40LUg0LrQu9Cw0LLQuNGI0Lgg0LzRi9GI0LguINCSINC80L7QvNC10L3RgiDQvtGC0LbQsNGC0LjRjyDQutC70LDQstC40YjQuCDQsNC90LDQu9C40Lcg0LTQstC40LbQtdC90LjRjyDQvNGL0YjQuCDRgSDQt9Cw0LbQsNGC0L7QuSDQutC70LDQstC40YjQtdC5INC/0YDQtdC60YDQsNGJ0LDQtdGC0YHRjy5cbiAgICovXG4gIHByb3RlY3RlZCBoYW5kbGVNb3VzZVVwKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG5cbiAgICB0aGlzLnNwbG90LnJlbmRlcigpXG5cbiAgICBldmVudC50YXJnZXQhLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMuaGFuZGxlTW91c2VNb3ZlV2l0aENvbnRleHQpXG4gICAgZXZlbnQudGFyZ2V0IS5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5oYW5kbGVNb3VzZVVwV2l0aENvbnRleHQpXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQoNC10LDQs9C40YDRg9C10YIg0L3QsCDQvdCw0LbQsNGC0LjQtSDQutC70LDQstC40YjQuCDQvNGL0YjQuC4g0JIg0LzQvtC80LXQvdGCINC90LDQttCw0YLQuNGPINC4INGD0LTQtdGA0LbQsNC90LjRjyDQutC70LDQstC40YjQuCDQt9Cw0L/Rg9GB0LrQsNC10YLRgdGPINCw0L3QsNC70LjQtyDQtNCy0LjQttC10L3QuNGPINC80YvRiNC4ICjRgSDQt9Cw0LbQsNGC0L7QuVxuICAgKiDQutC70LDQstC40YjQtdC5KS5cbiAgICovXG4gIHByb3RlY3RlZCBoYW5kbGVNb3VzZURvd24oZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcblxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcblxuICAgIGNvbnN0IHNwbG90ID0gdGhpcy5zcGxvdFxuICAgIGNvbnN0IHRyYW5zZm9ybSA9IHRoaXMudHJhbnNmb3JtXG5cbiAgICBzcGxvdC5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5oYW5kbGVNb3VzZU1vdmVXaXRoQ29udGV4dClcbiAgICBzcGxvdC5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuaGFuZGxlTW91c2VVcFdpdGhDb250ZXh0KVxuXG4gICAgbGV0IG1hdHJpeCA9IHRyYW5zZm9ybS52aWV3UHJvamVjdGlvbk1hdFxuICAgIHRyYW5zZm9ybS5zdGFydEludlZpZXdQcm9qTWF0ID0gWzEgLyBtYXRyaXhbMF0sIDAsIDAsIDAsIDEgLyBtYXRyaXhbNF0sIDAsIC1tYXRyaXhbNl0gLyBtYXRyaXhbMF0sIC1tYXRyaXhbN10gLyBtYXRyaXhbNF0sIDFdXG5cbiAgICB0cmFuc2Zvcm0uc3RhcnRDYW1lcmEgPSB7IHg6IHNwbG90LmNhbWVyYS54LCB5OiBzcGxvdC5jYW1lcmEueSwgem9vbTogc3Bsb3QuY2FtZXJhLnpvb20gfVxuXG4gICAgY29uc3QgW2NsaXBYLCBjbGlwWV0gPSB0aGlzLmdldENsaXBTcGFjZU1vdXNlUG9zaXRpb24oZXZlbnQpXG4gICAgbWF0cml4ID0gdHJhbnNmb3JtLnN0YXJ0SW52Vmlld1Byb2pNYXRcbiAgICB0cmFuc2Zvcm0uc3RhcnRQb3NbMF0gPSBjbGlwWCAqIG1hdHJpeFswXSArIG1hdHJpeFs2XVxuICAgIHRyYW5zZm9ybS5zdGFydFBvc1sxXSA9IGNsaXBZICogbWF0cml4WzRdICsgbWF0cml4WzddXG5cbiAgICBzcGxvdC5yZW5kZXIoKVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0KDQtdCw0LPQuNGA0YPQtdGCINC90LAg0LfRg9C80LjRgNC+0LLQsNC90LjQtSDQvNGL0YjQuC4g0JIg0LzQvtC80LXQvdGCINC30YPQvNC40YDQvtCy0LDQvdC40Y8g0LzRi9GI0Lgg0L/RgNC+0LjRgdGF0L7QtNC40YIg0LfRg9C80LjRgNC+0LLQsNC90LjQtSDQutC+0L7RgNC00LjQvdCw0YLQvdC+0Lkg0L/Qu9C+0YHQutC+0YHRgtC4LlxuICAgKi9cbiAgcHJvdGVjdGVkIGhhbmRsZU1vdXNlV2hlZWwoZXZlbnQ6IFdoZWVsRXZlbnQpOiB2b2lkIHtcblxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcblxuICAgIGNvbnN0IGNhbWVyYSA9IHRoaXMuc3Bsb3QuY2FtZXJhXG5cbiAgICAvKiog0JLRi9GH0LjRgdC70LXQvdC40LUg0L/QvtC30LjRhtC40Lgg0LzRi9GI0Lgg0LIgR0wt0LrQvtC+0YDQtNC40L3QsNGC0LDRhS4gKi9cbiAgICBjb25zdCBbY2xpcFgsIGNsaXBZXSA9IHRoaXMuZ2V0Q2xpcFNwYWNlTW91c2VQb3NpdGlvbihldmVudClcblxuICAgIC8qKiDQn9C+0LfQuNGG0LjRjyDQvNGL0YjQuCDQtNC+INC30YPQvNC40YDQvtCy0LDQvdC40Y8uICovXG4gICAgbGV0IG1hdHJpeCA9IHRoaXMudHJhbnNmb3JtLnZpZXdQcm9qZWN0aW9uTWF0XG4gICAgY29uc3QgcHJlWm9vbVggPSAoY2xpcFggLSBtYXRyaXhbNl0pIC8gbWF0cml4WzBdXG4gICAgY29uc3QgcHJlWm9vbVkgPSAoY2xpcFkgIC0gbWF0cml4WzddKSAvIG1hdHJpeFs0XVxuXG4gICAgLyoqINCd0L7QstC+0LUg0LfQvdCw0YfQtdC90LjQtSDQt9GD0LzQsCDQvtCx0LvQsNGB0YLQuCDQv9GA0L7RgdC80L7RgtGA0LAg0Y3QutGB0L/QvtC90LXQvdGG0LjQsNC70YzQvdC+INC30LDQstC40YHQuNGCINC+0YIg0LLQtdC70LjRh9C40L3RiyDQt9GD0LzQuNGA0L7QstCw0L3QuNGPINC80YvRiNC4LiAqL1xuICAgIGNvbnN0IG5ld1pvb20gPSBjYW1lcmEuem9vbSEgKiBNYXRoLnBvdygyLCBldmVudC5kZWx0YVkgKiAtMC4wMSlcblxuICAgIC8qKiDQnNCw0LrRgdC40LzQsNC70YzQvdC+0LUg0Lgg0LzQuNC90LjQvNCw0LvRjNC90L7QtSDQt9C90LDRh9C10L3QuNGPINC30YPQvNCwINC+0LHQu9Cw0YHRgtC4INC/0YDQvtGB0LzQvtGC0YDQsC4gKi9cbiAgICBjYW1lcmEuem9vbSA9IE1hdGgubWF4KDAuMDAyLCBNYXRoLm1pbigyMDAsIG5ld1pvb20pKVxuXG4gICAgLyoqINCe0LHQvdC+0LLQu9C10L3QuNC1INC80LDRgtGA0LjRhtGLINGC0YDQsNC90YHRhNC+0YDQvNCw0YbQuNC4LiAqL1xuICAgIHRoaXMudXBkYXRlVmlld1Byb2plY3Rpb24oKVxuXG4gICAgLyoqINCf0L7Qt9C40YbQuNGPINC80YvRiNC4INC/0L7RgdC70LUg0LfRg9C80LjRgNC+0LLQsNC90LjRjy4gKi9cbiAgICBtYXRyaXggPSB0aGlzLnRyYW5zZm9ybS52aWV3UHJvamVjdGlvbk1hdFxuICAgIGNvbnN0IHBvc3Rab29tWCA9IChjbGlwWCAtIG1hdHJpeFs2XSkgLyBtYXRyaXhbMF1cbiAgICBjb25zdCBwb3N0Wm9vbVkgPSAoY2xpcFkgLSBtYXRyaXhbN10pIC8gbWF0cml4WzRdXG5cbiAgICAvKiog0JLRi9GH0LjRgdC70LXQvdC40LUg0L3QvtCy0L7Qs9C+INC/0L7Qu9C+0LbQtdC90LjRjyDQvtCx0LvQsNGB0YLQuCDQv9GA0L7RgdC80L7RgtGA0LAg0L/QvtGB0LvQtSDQt9GD0LzQuNGA0L7QstCw0L3QuNGPLiAqL1xuICAgIGNhbWVyYS54ISArPSBwcmVab29tWCAtIHBvc3Rab29tWFxuICAgIGNhbWVyYS55ISArPSBwcmVab29tWSAtIHBvc3Rab29tWVxuXG4gICAgdGhpcy5zcGxvdC5yZW5kZXIoKVxuICB9XG59XG4iLCJpbXBvcnQgU1Bsb3QgZnJvbSAnQC9zcGxvdCdcbmltcG9ydCB7IGdldEN1cnJlbnRUaW1lIH0gZnJvbSAnQC91dGlscydcblxuLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqXG4gKiDQmtC70LDRgdGBLdGF0LXQu9C/0LXRgCwg0YDQtdCw0LvQuNC30YPRjtGJ0LjQuSDQv9C+0LTQtNC10YDQttC60YMg0YDQtdC20LjQvNCwINC+0YLQu9Cw0LTQutC4INC00LvRjyDQutC70LDRgdGB0LAgU1Bsb3QuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNQbG90RGVidWcgaW1wbGVtZW50cyBTUGxvdEhlbHBlciB7XG5cbiAgLyoqINCf0YDQuNC30L3QsNC6INCw0LrRgtC40LLQsNGG0LjQuCDRgNC10LbQuNC8INC+0YLQu9Cw0LTQutC4LiAqL1xuICBwdWJsaWMgaXNFbmFibGU6IGJvb2xlYW4gPSBmYWxzZVxuXG4gIC8qKiDQodGC0LjQu9GMINC30LDQs9C+0LvQvtCy0LrQsCDRgNC10LbQuNC80LAg0L7RgtC70LDQtNC60LguICovXG4gIHB1YmxpYyBoZWFkZXJTdHlsZTogc3RyaW5nID0gJ2ZvbnQtd2VpZ2h0OiBib2xkOyBjb2xvcjogI2ZmZmZmZjsgYmFja2dyb3VuZC1jb2xvcjogI2NjMDAwMDsnXG5cbiAgLyoqINCh0YLQuNC70Ywg0LfQsNCz0L7Qu9C+0LLQutCwINCz0YDRg9C/0L/RiyDQv9Cw0YDQsNC80LXRgtGA0L7Qsi4gKi9cbiAgcHVibGljIGdyb3VwU3R5bGU6IHN0cmluZyA9ICdmb250LXdlaWdodDogYm9sZDsgY29sb3I6ICNmZmZmZmY7J1xuXG4gIC8qKiDQn9GA0LjQt9C90LDQuiDRgtC+0LPQviwg0YfRgtC+INGF0LXQu9C/0LXRgCDRg9C20LUg0L3QsNGB0YLRgNC+0LXQvS4gKi9cbiAgcHVibGljIGlzU2V0dXBlZDogYm9vbGVhbiA9IGZhbHNlXG5cbiAgLyoqINCl0LXQu9C/0LXRgCDQsdGD0LTQtdGCINC40LzQtdGC0Ywg0L/QvtC70L3Ri9C5INC00L7RgdGC0YPQvyDQuiDRjdC60LfQtdC80L/Qu9GP0YDRgyBTUGxvdC4gKi9cbiAgY29uc3RydWN0b3IoXG4gICAgcmVhZG9ubHkgc3Bsb3Q6IFNQbG90XG4gICkge31cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQn9C+0LTQs9C+0YLQsNCy0LvQuNCy0LDQtdGCINGF0LXQu9C/0LXRgCDQuiDQuNGB0L/QvtC70YzQt9C+0LLQsNC90LjRji5cbiAgICovXG4gIHB1YmxpYyBzZXR1cChjbGVhckNvbnNvbGU6IGJvb2xlYW4gPSBmYWxzZSk6IHZvaWQge1xuXG4gICAgaWYgKCF0aGlzLmlzU2V0dXBlZCkge1xuXG4gICAgICBpZiAoY2xlYXJDb25zb2xlKSB7XG4gICAgICAgIGNvbnNvbGUuY2xlYXIoKVxuICAgICAgfVxuXG4gICAgICB0aGlzLmlzU2V0dXBlZCA9IHRydWVcbiAgICB9XG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQktGL0LLQvtC00LjRgiDQsiDQutC+0L3RgdC+0LvRjCDQvtGC0LvQsNC00L7Rh9C90YPRjiDQuNC90YTQvtGA0LzQsNGG0LjRjiwg0LXRgdC70Lgg0LLQutC70Y7Rh9C10L0g0YDQtdC20LjQvCDQvtGC0LvQsNC00LrQuC5cbiAgICpcbiAgICogQHJlbWFya3NcbiAgICog0J7RgtC70LDQtNC+0YfQvdCw0Y8g0LjQvdGE0L7RgNC80LDRhtC40Y8g0LLRi9Cy0L7QtNC40YLRgdGPINCx0LvQvtC60LDQvNC4LiDQndCw0LfQstCw0L3QuNGPINCx0LvQvtC60L7QsiDQv9C10YDQtdC00LDRjtGC0YHRjyDQsiDQvNC10YLQvtC0INC/0LXRgNC10YfQuNGB0LvQtdC90LjQtdC8INGB0YLRgNC+0LouINCa0LDQttC00LDRjyDRgdGC0YDQvtC60LBcbiAgICog0LjQvdGC0LXRgNC/0YDQtdGC0LjRgNGD0LXRgtGB0Y8g0LrQsNC6INC40LzRjyDQvNC10YLQvtC00LAuINCV0YHQu9C4INC90YPQttC90YvQtSDQvNC10YLQvtC00Ysg0LLRi9Cy0L7QtNCwINCx0LvQvtC60LAg0YHRg9GJ0LXRgdGC0LLRg9GO0YIgLSDQvtC90Lgg0LLRi9C30YvQstCw0Y7RgtGB0Y8uINCV0YHQu9C4INC80LXRgtC+0LTQsCDRgSDQvdGD0LbQvdGL0LxcbiAgICog0L3QsNC30LLQsNC90LjQtdC8INC90LUg0YHRg9GJ0LXRgdGC0LLRg9C10YIgLSDQs9C10L3QtdGA0LjRgNGD0LXRgtGB0Y8g0L7RiNC40LHQutCwLlxuICAgKlxuICAgKiBAcGFyYW0gbG9nSXRlbXMgLSDQn9C10YDQtdGH0LjRgdC70LXQvdC40LUg0YHRgtGA0L7QuiDRgSDQvdCw0LfQstCw0L3QuNGP0LzQuCDQvtGC0LvQsNC00L7Rh9C90YvRhSDQsdC70L7QutC+0LIsINC60L7RgtC+0YDRi9C1INC90YPQttC90L4g0L7RgtC+0LHRgNCw0LfQuNGC0Ywg0LIg0LrQvtC90YHQvtC70LguXG4gICAqL1xuICBwdWJsaWMgbG9nKC4uLmxvZ0l0ZW1zOiBzdHJpbmdbXSk6IHZvaWQge1xuICAgIGlmICh0aGlzLmlzRW5hYmxlKSB7XG4gICAgICBsb2dJdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICBpZiAodHlwZW9mICh0aGlzIGFzIGFueSlbaXRlbV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAodGhpcyBhcyBhbnkpW2l0ZW1dKClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ9Ce0YLQu9Cw0LTQvtGH0L3QvtCz0L4g0LHQu9C+0LrQsCAnICsgaXRlbSArICdcIiDQvdC1INGB0YPRidC10YHRgtCy0YPQtdGCIScpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JLRi9Cy0L7QtNC40YIg0YHQvtC+0LHRidC10L3QuNC1INC+0LEg0L7RiNC40LHQutC1LlxuICAgKi9cbiAgcHVibGljIGVycm9yKG1lc3NhZ2U6IHN0cmluZyk6IHZvaWQge1xuICAgIGlmICh0aGlzLmlzRW5hYmxlKSB7XG4gICAgICBjb25zb2xlLmVycm9yKG1lc3NhZ2UpXG4gICAgfVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JLRi9Cy0L7QtNC40YIg0LLRgdGC0YPQv9C40YLQtdC70YzQvdGD0Y4g0YfQsNGB0YLRjCDQviDRgNC10LbQuNC80LUg0L7RgtC70LDQtNC60LguXG4gICAqL1xuICBwdWJsaWMgaW50cm8oKTogdm9pZCB7XG4gICAgY29uc29sZS5sb2coJyVj0J7RgtC70LDQtNC60LAgU1Bsb3Qg0L3QsCDQvtCx0YrQtdC60YLQtSAjJyArIHRoaXMuc3Bsb3QuY2FudmFzLmlkLCB0aGlzLmhlYWRlclN0eWxlKVxuXG4gICAgaWYgKHRoaXMuc3Bsb3QuZGVtby5pc0VuYWJsZSkge1xuICAgICAgY29uc29sZS5sb2coJyVj0JLQutC70Y7Rh9C10L0g0LTQtdC80L7QvdGB0YLRgNCw0YbQuNC+0L3QvdGL0Lkg0YDQtdC20LjQvCDQtNCw0L3QvdGL0YUnLCB0aGlzLmdyb3VwU3R5bGUpXG4gICAgfVxuXG4gICAgY29uc29sZS5ncm91cCgnJWPQn9GA0LXQtNGD0L/RgNC10LbQtNC10L3QuNC1JywgdGhpcy5ncm91cFN0eWxlKVxuICAgIGNvbnNvbGUubG9nKCfQntGC0LrRgNGL0YLQsNGPINC60L7QvdGB0L7Qu9GMINCx0YDQsNGD0LfQtdGA0LAg0Lgg0LTRgNGD0LPQuNC1INCw0LrRgtC40LLQvdGL0LUg0YHRgNC10LTRgdGC0LLQsCDQutC+0L3RgtGA0L7Qu9GPINGA0LDQt9GA0LDQsdC+0YLQutC4INGB0YPRidC10YHRgtCy0LXQvdC90L4g0YHQvdC40LbQsNGO0YIg0L/RgNC+0LjQt9Cy0L7QtNC40YLQtdC70YzQvdC+0YHRgtGMINCy0YvRgdC+0LrQvtC90LDQs9GA0YPQttC10L3QvdGL0YUg0L/RgNC40LvQvtC20LXQvdC40LkuINCU0LvRjyDQvtCx0YrQtdC60YLQuNCy0L3QvtCz0L4g0LDQvdCw0LvQuNC30LAg0L/RgNC+0LjQt9Cy0L7QtNC40YLQtdC70YzQvdC+0YHRgtC4INCy0YHQtSDQv9C+0LTQvtCx0L3Ri9C1INGB0YDQtdC00YHRgtCy0LAg0LTQvtC70LbQvdGLINCx0YvRgtGMINC+0YLQutC70Y7Rh9C10L3Riywg0LAg0LrQvtC90YHQvtC70Ywg0LHRgHrQsNGD0LfQtdGA0LAg0LfQsNC60YDRi9GC0LAuINCd0LXQutC+0YLQvtGA0YvQtSDQtNCw0L3QvdGL0LUg0L7RgtC70LDQtNC+0YfQvdC+0Lkg0LjQvdGE0L7RgNC80LDRhtC40Lgg0LIg0LfQsNCy0LjRgdC40LzQvtGB0YLQuCDQvtGCINC40YHQv9C+0LvRjNC30YPQtdC80L7Qs9C+INCx0YDQsNGD0LfQtdGA0LAg0LzQvtCz0YPRgiDQvdC1INC+0YLQvtCx0YDQsNC20LDRgtGM0YHRjyDQuNC70Lgg0L7RgtC+0LHRgNCw0LbQsNGC0YzRgdGPINC90LXQutC+0YDRgNC10LrRgtC90L4uINCh0YDQtdC00YHRgtCy0L4g0L7RgtC70LDQtNC60Lgg0L/RgNC+0YLQtdGB0YLQuNGA0L7QstCw0L3QviDQsiDQsdGA0LDRg9C30LXRgNC1IEdvb2dsZSBDaHJvbWUgdi45MCcpXG4gICAgY29uc29sZS5ncm91cEVuZCgpXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQktGL0LLQvtC00LjRgiDQuNC90YTQvtGA0LzQsNGG0LjRjiDQviDQs9GA0LDRhNC40YfQtdGB0LrQvtC5INGB0LjRgdGC0LXQvNC1INC60LvQuNC10L3RgtCwLlxuICAgKi9cbiAgcHVibGljIGdwdSgpOiB2b2lkIHtcbiAgICBjb25zb2xlLmdyb3VwKCclY9CS0LjQtNC10L7RgdC40YHRgtC10LzQsCcsIHRoaXMuZ3JvdXBTdHlsZSlcbiAgICBjb25zb2xlLmxvZygn0JPRgNCw0YTQuNGH0LXRgdC60LDRjyDQutCw0YDRgtCwOiAnICsgdGhpcy5zcGxvdC53ZWJnbC5ncHUuaGFyZHdhcmUpXG4gICAgY29uc29sZS5sb2coJ9CS0LXRgNGB0LjRjyBHTDogJyArIHRoaXMuc3Bsb3Qud2ViZ2wuZ3B1LnNvZnR3YXJlKVxuICAgIGNvbnNvbGUuZ3JvdXBFbmQoKVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JLRi9Cy0L7QtNC40YIg0LjQvdGE0L7RgNC80LDRhtC40Y8g0L4g0YLQtdC60YPRidC10Lwg0Y3QutC30LXQvNC/0LvRj9GA0LUg0LrQu9Cw0YHRgdCwIFNQbG90LlxuICAgKi9cbiAgcHVibGljIGluc3RhbmNlKCk6IHZvaWQge1xuXG4gICAgY29uc29sZS5ncm91cCgnJWPQndCw0YHRgtGA0L7QudC60LAg0L/QsNGA0LDQvNC10YLRgNC+0LIg0Y3QutC30LXQvNC/0LvRj9GA0LAnLCB0aGlzLmdyb3VwU3R5bGUpXG4gICAgY29uc29sZS5kaXIodGhpcy5zcGxvdClcbiAgICBjb25zb2xlLmxvZygn0KDQsNC30LzQtdGAINC60LDQvdCy0LDRgdCwOiAnICsgdGhpcy5zcGxvdC5jYW52YXMud2lkdGggKyAnIHggJyArIHRoaXMuc3Bsb3QuY2FudmFzLmhlaWdodCArICcgcHgnKVxuICAgIGNvbnNvbGUubG9nKCfQoNCw0LfQvNC10YAg0L/Qu9C+0YHQutC+0YHRgtC4OiAnICsgdGhpcy5zcGxvdC5ncmlkLndpZHRoICsgJyB4ICcgKyB0aGlzLnNwbG90LmdyaWQuaGVpZ2h0ICsgJyBweCcpXG5cbiAgICBpZiAodGhpcy5zcGxvdC5kZW1vLmlzRW5hYmxlKSB7XG4gICAgICBjb25zb2xlLmxvZygn0KHQv9C+0YHQvtCxINC/0L7Qu9GD0YfQtdC90LjRjyDQtNCw0L3QvdGL0YU6ICcgKyAn0LTQtdC80L4t0LTQsNC90L3Ri9C1JylcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ9Ch0L/QvtGB0L7QsSDQv9C+0LvRg9GH0LXQvdC40Y8g0LTQsNC90L3Ri9GFOiAnICsgJ9C40YLQtdGA0LjRgNC+0LLQsNC90LjQtScpXG4gICAgfVxuICAgIGNvbnNvbGUuZ3JvdXBFbmQoKVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JLRi9Cy0L7QtNC40YIg0LrQvtC00Ysg0YjQtdC50LTQtdGA0L7Qsi5cbiAgICovXG4gIHB1YmxpYyBzaGFkZXJzKCk6IHZvaWQge1xuICAgIGNvbnNvbGUuZ3JvdXAoJyVj0KHQvtC30LTQsNC9INCy0LXRgNGI0LjQvdC90YvQuSDRiNC10LnQtNC10YA6ICcsIHRoaXMuZ3JvdXBTdHlsZSlcbiAgICBjb25zb2xlLmxvZyh0aGlzLnNwbG90Lmdsc2wudmVydFNoYWRlclNvdXJjZSlcbiAgICBjb25zb2xlLmdyb3VwRW5kKClcbiAgICBjb25zb2xlLmdyb3VwKCclY9Ch0L7Qt9C00LDQvSDRhNGA0LDQs9C80LXQvdGC0L3Ri9C5INGI0LXQudC00LXRgDogJywgdGhpcy5ncm91cFN0eWxlKVxuICAgIGNvbnNvbGUubG9nKHRoaXMuc3Bsb3QuZ2xzbC5mcmFnU2hhZGVyU291cmNlKVxuICAgIGNvbnNvbGUuZ3JvdXBFbmQoKVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JLRi9Cy0L7QtNC40YIg0YHQvtC+0LHRidC10L3QuNC1INC+INC90LDRh9Cw0LvQtSDQv9GA0L7RhtC10YHRgdC1INC30LDQs9GA0YPQt9C60Lgg0LTQsNC90L3Ri9GFLlxuICAgKi9cbiAgcHVibGljIGxvYWRpbmcoKTogdm9pZCB7XG4gICAgY29uc29sZS5sb2coJyVj0JfQsNC/0YPRidC10L0g0L/RgNC+0YbQtdGB0YEg0LfQsNCz0YDRg9C30LrQuCDQtNCw0L3QvdGL0YUgWycgKyBnZXRDdXJyZW50VGltZSgpICsgJ10uLi4nLCB0aGlzLmdyb3VwU3R5bGUpXG4gICAgY29uc29sZS50aW1lKCfQlNC70LjRgtC10LvRjNC90L7RgdGC0YwnKVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JLRi9Cy0L7QtNC40YIg0YHRgtCw0YLQuNGB0YLQuNC60YMg0L/QviDQt9Cw0LLQtdGA0YjQtdC90LjQuCDQv9GA0L7RhtC10YHRgdCwINC30LDQs9GA0YPQt9C60Lgg0LTQsNC90L3Ri9GFLlxuICAgKi9cbiAgcHVibGljIGxvYWRlZCgpOiB2b2lkIHtcbiAgICBjb25zb2xlLmdyb3VwKCclY9CX0LDQs9GA0YPQt9C60LAg0LTQsNC90L3Ri9GFINC30LDQstC10YDRiNC10L3QsCBbJyArIGdldEN1cnJlbnRUaW1lKCkgKyAnXScsIHRoaXMuZ3JvdXBTdHlsZSlcbiAgICBjb25zb2xlLnRpbWVFbmQoJ9CU0LvQuNGC0LXQu9GM0L3QvtGB0YLRjCcpXG4gICAgY29uc29sZS5sb2coJ9Cg0LDRgdGF0L7QtCDQstC40LTQtdC+0L/QsNC80Y/RgtC4OiAnICsgKHRoaXMuc3Bsb3Quc3RhdHMubWVtVXNhZ2UgLyAxMDAwMDAwKS50b0ZpeGVkKDIpLnRvTG9jYWxlU3RyaW5nKCkgKyAnINCc0JEnKVxuICAgIGNvbnNvbGUubG9nKCfQmtC+0Lst0LLQviDQvtCx0YrQtdC60YLQvtCyOiAnICsgdGhpcy5zcGxvdC5zdGF0cy5vYmpUb3RhbENvdW50LnRvTG9jYWxlU3RyaW5nKCkpXG4gICAgY29uc29sZS5sb2coJ9Ca0L7Quy3QstC+INCz0YDRg9C/0L8g0LHRg9GE0LXRgNC+0LI6ICcgKyB0aGlzLnNwbG90LnN0YXRzLmdyb3Vwc0NvdW50LnRvTG9jYWxlU3RyaW5nKCkpXG4gICAgY29uc29sZS5sb2coJ9Cg0LXQt9GD0LvRjNGC0LDRgjogJyArICgodGhpcy5zcGxvdC5zdGF0cy5vYmpUb3RhbENvdW50ID49IHRoaXMuc3Bsb3QuZ2xvYmFsTGltaXQpID9cbiAgICAgICfQtNC+0YHRgtC40LPQvdGD0YIg0LvQuNC80LjRgiDQvtCx0YrQtdC60YLQvtCyICgnICsgdGhpcy5zcGxvdC5nbG9iYWxMaW1pdC50b0xvY2FsZVN0cmluZygpICsgJyknIDpcbiAgICAgICfQvtCx0YDQsNCx0L7RgtCw0L3RiyDQstGB0LUg0L7QsdGK0LXQutGC0YsnKSlcbiAgICBjb25zb2xlLmdyb3VwRW5kKClcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCS0YvQstC+0LTQuNGCINGB0L7QvtCx0YnQtdC90LjQtSDQviDQt9Cw0L/Rg9GB0LrQtSDRgNC10L3QtNC10YDQsC5cbiAgICovXG4gIHB1YmxpYyBzdGFydGVkKCk6IHZvaWQge1xuICAgIGNvbnNvbGUubG9nKCclY9Cg0LXQvdC00LXRgCDQt9Cw0L/Rg9GJ0LXQvScsIHRoaXMuZ3JvdXBTdHlsZSlcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCS0YvQstC+0LTQuNGCINGB0L7QvtCx0YnQtdC90LjQtSDQvtCxINC+0YHRgtCw0L3QvtCy0LrQtSDRgNC10L3QtNC10YDQsC5cbiAgICovXG4gIHB1YmxpYyBzdG9wZWQoKTogdm9pZCB7XG4gICAgY29uc29sZS5sb2coJyVj0KDQtdC90LTQtdGAINC+0YHRgtCw0L3QvtCy0LvQtdC9JywgdGhpcy5ncm91cFN0eWxlKVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JLRi9Cy0L7QtNC40YIg0YHQvtC+0LHRiNC10L3QuNC1INC+0LEg0L7Rh9C40YHRgtC60LUg0L7QsdC70LDRgdGC0Lgg0YDQtdC90LTQtdGA0LAuXG4gICAqL1xuICBwdWJsaWMgY2xlYXJlZChjb2xvcjogc3RyaW5nKTogdm9pZCB7XG4gICAgY29uc29sZS5sb2coJyVj0J7QsdC70LDRgdGC0Ywg0YDQtdC90LTQtdGA0LAg0L7Rh9C40YnQtdC90LAgWycgKyBjb2xvciArICddJywgdGhpcy5ncm91cFN0eWxlKTtcbiAgfVxufVxuIiwiaW1wb3J0IFNQbG90IGZyb20gJ0Avc3Bsb3QnXG5pbXBvcnQgeyByYW5kb21JbnQgfSBmcm9tICdAL3V0aWxzJ1xuXG4vKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICpcbiAqINCa0LvQsNGB0YEt0YXQtdC70L/QtdGALCDRgNC10LDQu9C40LfRg9GO0YnQuNC5INC/0L7QtNC00LXRgNC20LrRgyDRgNC10LbQuNC80LAg0LTQtdC80L7QvdGB0YLRgNCw0YbQuNC+0L3QvdGL0YUg0LTQsNC90L3Ri9GFINC00LvRjyDQutC70LDRgdGB0LAgU1Bsb3QuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNQbG90RGVtbyBpbXBsZW1lbnRzIFNQbG90SGVscGVyIHtcblxuICAvKiog0J/RgNC40LfQvdCw0Log0LDQutGC0LjQstCw0YbQuNC4INC00LXQvNC+LdGA0LXQttC40LzQsC4gKi9cbiAgcHVibGljIGlzRW5hYmxlOiBib29sZWFuID0gZmFsc2VcblxuICAvKiog0JrQvtC70LjRh9C10YHRgtCy0L4g0LHRitC10LrRgtC+0LIuICovXG4gIHB1YmxpYyBhbW91bnQ6IG51bWJlciA9IDFfMDAwXzAwMFxuXG4gIC8qKiDQnNC40L3QuNC80LDQu9GM0L3Ri9C5INGA0LDQt9C80LXRgCDQvtCx0YrQtdC60YLQvtCyLiAqL1xuICBwdWJsaWMgc2l6ZU1pbjogbnVtYmVyID0gMTBcblxuICAvKiog0JzQsNC60YHQuNC80LDQu9GM0L3Ri9C5INGA0LDQt9C80LXRgCDQvtCx0YrQtdC60YLQvtCyLiAqL1xuICBwdWJsaWMgc2l6ZU1heDogbnVtYmVyID0gMzBcblxuICAvKiog0KbQstC10YLQvtCy0LDRjyDQv9Cw0LvQuNGC0YDQsCDQvtCx0YrQtdC60YLQvtCyLiAqL1xuICBwdWJsaWMgY29sb3JzOiBzdHJpbmdbXSA9IFtcbiAgICAnI0Q4MUMwMScsICcjRTk5NjdBJywgJyNCQTU1RDMnLCAnI0ZGRDcwMCcsICcjRkZFNEI1JywgJyNGRjhDMDAnLFxuICAgICcjMjI4QjIyJywgJyM5MEVFOTAnLCAnIzQxNjlFMScsICcjMDBCRkZGJywgJyM4QjQ1MTMnLCAnIzAwQ0VEMSdcbiAgXVxuXG4gIC8qKiDQn9GA0LjQt9C90LDQuiDRgtC+0LPQviwg0YfRgtC+INGF0LXQu9C/0LXRgCDRg9C20LUg0L3QsNGB0YLRgNC+0LXQvS4gKi9cbiAgcHVibGljIGlzU2V0dXBlZDogYm9vbGVhbiA9IGZhbHNlXG5cbiAgLyoqINCh0YfQtdGC0YfQuNC6INC40YLQtdGA0LjRgNGD0LXQvNGL0YUg0L7QsdGK0LXQutGC0L7Qsi4gKi9cbiAgcHJpdmF0ZSBpbmRleDogbnVtYmVyID0gMFxuXG4gIC8qKiDQpdC10LvQv9C10YAg0LHRg9C00LXRgiDQuNC80LXRgtGMINC/0L7Qu9C90YvQuSDQtNC+0YHRgtGD0L8g0Log0Y3QutC30LXQvNC/0LvRj9GA0YMgU1Bsb3QuICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIHJlYWRvbmx5IHNwbG90OiBTUGxvdFxuICApIHt9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0J/QvtC00LPQvtGC0LDQstC70LjQstCw0LXRgiDRhdC10LvQv9C10YAg0Log0LjRgdC/0L7Qu9GM0LfQvtCy0LDQvdC40Y4uXG4gICAqL1xuICBwdWJsaWMgc2V0dXAoKTogdm9pZCB7XG5cbiAgICAvKiog0KXQtdC70L/QtdGAINC00LXQvNC+LdGA0LXQttC40LzQsCDQstGL0L/QvtC70L3Rj9C10YIg0L3QsNGB0YLRgNC+0LnQutGDINCy0YHQtdGFINGB0LLQvtC40YUg0L/QsNGA0LDQvNC10YLRgNC+0LIg0LTQsNC20LUg0LXRgdC70Lgg0L7QvdCwINGD0LbQtSDQstGL0L/QvtC70L3Rj9C70LDRgdGMLiAqL1xuICAgIGlmICghdGhpcy5pc1NldHVwZWQpIHtcbiAgICAgIHRoaXMuaXNTZXR1cGVkID0gdHJ1ZVxuICAgIH1cblxuICAgIC8qKiDQntCx0L3Rg9C70LXQvdC40LUg0YHRh9C10YLRh9C40LrQsCDQuNGC0LXRgNCw0YLQvtGA0LAuICovXG4gICAgdGhpcy5pbmRleCA9IDBcblxuICAgIC8qKiDQn9C+0LTQs9C+0YLQvtCy0LrQsCDQtNC10LzQvi3RgNC10LbQuNC80LAgKNC10YHQu9C4INGC0YDQtdCx0YPQtdGC0YHRjykuICovXG4gICAgaWYgKHRoaXMuc3Bsb3QuZGVtby5pc0VuYWJsZSkge1xuICAgICAgdGhpcy5zcGxvdC5pdGVyYXRvciA9IHRoaXMuc3Bsb3QuZGVtby5pdGVyYXRvci5iaW5kKHRoaXMpXG4gICAgICB0aGlzLnNwbG90LmNvbG9ycyA9IHRoaXMuc3Bsb3QuZGVtby5jb2xvcnNcbiAgICB9XG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQmNC80LjRgtC40YDRg9C10YIg0LjRgtC10YDQsNGC0L7RgCDQuNGB0YXQvtC00L3Ri9GFINC+0LHRitC10LrRgtC+0LIuXG4gICAqL1xuICBwdWJsaWMgaXRlcmF0b3IoKTogU1Bsb3RPYmplY3QgfCBudWxsIHtcbiAgICBpZiAodGhpcy5pbmRleCA8IHRoaXMuYW1vdW50KSB7XG4gICAgICB0aGlzLmluZGV4KytcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHg6IHJhbmRvbUludCh0aGlzLnNwbG90LmdyaWQud2lkdGghKSxcbiAgICAgICAgeTogcmFuZG9tSW50KHRoaXMuc3Bsb3QuZ3JpZC5oZWlnaHQhKSxcbiAgICAgICAgc2hhcGU6IHJhbmRvbUludCh0aGlzLnNwbG90LnNoYXBlc0NvdW50ISksXG4gICAgICAgIHNpemU6IHRoaXMuc2l6ZU1pbiArIHJhbmRvbUludCh0aGlzLnNpemVNYXggLSB0aGlzLnNpemVNaW4gKyAxKSxcbiAgICAgICAgY29sb3I6IHJhbmRvbUludCh0aGlzLmNvbG9ycy5sZW5ndGgpXG4gICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCBTUGxvdCBmcm9tICdAL3NwbG90J1xuaW1wb3J0ICogYXMgc2hhZGVycyBmcm9tICdAL3NoYWRlcnMnXG5pbXBvcnQgeyBjb2xvckZyb21IZXhUb0dsUmdiIH0gZnJvbSAnQC91dGlscydcblxuLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqXG4gKiDQmtC70LDRgdGBLdGF0LXQu9C/0LXRgCwg0YPQv9GA0LDQstC70Y/RjtGJ0LjQuSBHTFNMLdC60L7QtNC+0Lwg0YjQtdC50LTQtdGA0L7Qsi5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU1Bsb3RHbHNsIGltcGxlbWVudHMgU1Bsb3RIZWxwZXIge1xuXG4gIC8qKiDQmtC+0LTRiyDRiNC10LnQtNC10YDQvtCyLiAqL1xuICBwdWJsaWMgdmVydFNoYWRlclNvdXJjZTogc3RyaW5nID0gJydcbiAgcHVibGljIGZyYWdTaGFkZXJTb3VyY2U6IHN0cmluZyA9ICcnXG5cbiAgLyoqINCf0YDQuNC30L3QsNC6INGC0L7Qs9C+LCDRh9GC0L4g0YXQtdC70L/QtdGAINGD0LbQtSDQvdCw0YHRgtGA0L7QtdC9LiAqL1xuICBwdWJsaWMgaXNTZXR1cGVkOiBib29sZWFuID0gZmFsc2VcblxuICAvKiog0KXQtdC70L/QtdGAINCx0YPQtNC10YIg0LjQvNC10YLRjCDQv9C+0LvQvdGL0Lkg0LTQvtGB0YLRg9C/INC6INGN0LrQt9C10LzQv9C70Y/RgNGDIFNQbG90LiAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICByZWFkb25seSBzcGxvdDogU1Bsb3RcbiAgKSB7fVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCf0L7QtNCz0L7RgtCw0LLQu9C40LLQsNC10YIg0YXQtdC70L/QtdGAINC6INC40YHQv9C+0LvRjNC30L7QstCw0L3QuNGOLlxuICAgKi9cbiAgcHVibGljIHNldHVwKCk6IHZvaWQge1xuXG4gICAgaWYgKCF0aGlzLmlzU2V0dXBlZCkge1xuXG4gICAgICAvKiog0KHQsdC+0YDQutCwINC60L7QtNC+0LIg0YjQtdC50LTQtdGA0L7Qsi4gKi9cbiAgICAgIHRoaXMudmVydFNoYWRlclNvdXJjZSA9IHRoaXMubWFrZVZlcnRTaGFkZXJTb3VyY2UoKVxuICAgICAgdGhpcy5mcmFnU2hhZGVyU291cmNlID0gdGhpcy5tYWtlRnJhZ1NoYWRlclNvdXJjZSgpXG5cbiAgICAgIC8qKiDQktGL0YfQuNGB0LvQtdC90LjQtSDQutC+0LvQuNGH0LXRgdGC0LLQsCDRgNCw0LfQu9C40YfQvdGL0YUg0YTQvtGA0Lwg0L7QsdGK0LXQutGC0L7Qsi4gKi9cbiAgICAgIHRoaXMuc3Bsb3Quc2hhcGVzQ291bnQgPSBzaGFkZXJzLlNIQVBFUy5sZW5ndGhcblxuICAgICAgdGhpcy5pc1NldHVwZWQgPSB0cnVlXG4gICAgfVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0KHQvtC30LTQsNC10YIg0LrQvtC0INCy0LXRgNGI0LjQvdC90L7Qs9C+INGI0LXQudC00LXRgNCwLlxuICAgKlxuICAgKiBAcmVtYXJrc1xuICAgKiDQkiDRiNCw0LHQu9C+0L0g0LLQtdGA0YjQuNC90L3QvtCz0L4g0YjQtdC50LTQtdGA0LAg0LLRgdGC0LDQstC70Y/QtdGC0YHRjyDQutC+0LQg0LLRi9Cx0L7RgNCwINGG0LLQtdGC0LAg0L7QsdGK0LXQutGC0LAg0L/QviDQuNC90LTQtdC60YHRgyDRhtCy0LXRgtCwLiDQoi7Qui7RiNC10LnQtNC10YAg0L3QtSDQv9C+0LfQstC+0LvRj9C10YJcbiAgICog0LjRgdC/0L7Qu9GM0LfQvtCy0LDRgtGMINCyINC60LDRh9C10YHRgtCy0LUg0LjQvdC00LXQutGB0L7QsiDQv9C10YDQtdC80LXQvdC90YvQtSAtINC00LvRjyDQt9Cw0LTQsNC90LjRjyDRhtCy0LXRgtCwINC40YHQv9C+0LvRjNC30YPQtdGC0YHRjyDQv9C+0YHQu9C10LTQvtCy0LDRgtC10LvRjNC90YvQuSDQv9C10YDQtdCx0L7RgCDRhtCy0LXRgtC+0LLRi9GFXG4gICAqINC40L3QtNC10LrRgdC+0LIuXG4gICAqL1xuICBwcml2YXRlIG1ha2VWZXJ0U2hhZGVyU291cmNlKCkge1xuXG4gICAgLyoqINCS0YDQtdC80LXQvdC90L7QtSDQtNC+0LHQsNCy0LvQtdC90LjQtSDQsiDQv9Cw0LvQuNGC0YDRgyDQstC10YDRiNC40L0g0YbQstC10YLQsCDQvdCw0L/RgNCw0LLQu9GP0Y7RidC40YUuICovXG4gICAgdGhpcy5zcGxvdC5jb2xvcnMucHVzaCh0aGlzLnNwbG90LmdyaWQucnVsZXNDb2xvciEpXG5cbiAgICBsZXQgY29kZTogc3RyaW5nID0gJydcblxuICAgIC8qKiDQpNC+0YDQvNC40YDQvtCy0L3QuNC1INC60L7QtNCwINGD0YHRgtCw0L3QvtCy0LrQuCDRhtCy0LXRgtCwINC+0LHRitC10LrRgtCwINC/0L4g0LjQvdC00LXQutGB0YMuICovXG4gICAgdGhpcy5zcGxvdC5jb2xvcnMuZm9yRWFjaCgodmFsdWUsIGluZGV4KSA9PiB7XG4gICAgICBsZXQgW3IsIGcsIGJdID0gY29sb3JGcm9tSGV4VG9HbFJnYih2YWx1ZSlcbiAgICAgIGNvZGUgKz0gYGVsc2UgaWYgKGFfY29sb3IgPT0gJHtpbmRleH0uMCkgdl9jb2xvciA9IHZlYzMoJHtyfSwgJHtnfSwgJHtifSk7XFxuYFxuICAgIH0pXG5cbiAgICAvKiog0KPQtNCw0LvQtdC90LjQtSDQuNC3INC/0LDQu9C40YLRgNGLINCy0LXRgNGI0LjQvSDQstGA0LXQvNC10L3QvdC+INC00L7QsdCw0LLQu9C10L3QvdC+0LPQviDRhtCy0LXRgtCwINC90LDQv9GA0LDQstC70Y/RjtGJ0LjRhS4gKi9cbiAgICB0aGlzLnNwbG90LmNvbG9ycy5wb3AoKVxuXG4gICAgLyoqINCj0LTQsNC70LXQvdC40LUg0LvQuNGI0L3QtdCz0L4gXCJlbHNlXCIg0LIg0L3QsNGH0LDQu9C1INC60L7QtNCwINC4INC70LjRiNC90LXQs9C+INC/0LXRgNC10LLQvtC00LAg0YHRgtGA0L7QutC4INCyINC60L7QvdGG0LUuICovXG4gICAgY29kZSA9IGNvZGUuc2xpY2UoNSkuc2xpY2UoMCwgLTEpXG5cbiAgICByZXR1cm4gc2hhZGVycy5WRVJURVhfVEVNUExBVEUucmVwbGFjZSgne0NPTE9SLVNFTEVDVElPTn0nLCBjb2RlKS50cmltKClcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCh0L7Qt9C00LDQtdGCINC60L7QtCDRhNGA0LDQs9C80LXQvdGC0L3QvtCz0L4g0YjQtdC50LTQtdGA0LAuXG4gICAqL1xuICBwcml2YXRlIG1ha2VGcmFnU2hhZGVyU291cmNlKCkge1xuXG4gICAgbGV0IGNvZGUxOiBzdHJpbmcgPSAnJ1xuICAgIGxldCBjb2RlMjogc3RyaW5nID0gJydcblxuICAgIHNoYWRlcnMuU0hBUEVTLmZvckVhY2goKHZhbHVlLCBpbmRleCkgPT4ge1xuXG4gICAgICAvKiog0KTQvtGA0LzQuNGA0L7QstCw0L3QuNC1INC60L7QtNCwINGE0YPQvdC60YbQuNC5LCDQvtC/0LjRgdGL0LLQsNGO0YnQuNGFINGE0L7RgNC80Ysg0L7QsdGK0LXQutGC0L7Qsi4gKi9cbiAgICAgIGNvZGUxICs9IGB2b2lkIHMke2luZGV4fSgpIHsgJHt2YWx1ZS50cmltKCl9IH1cXG5gXG5cbiAgICAgIC8qKiDQpNC+0YDQvNC40YDQvtCy0LDQvdC40LUg0LrQvtC00LAg0YPRgdGC0LDQvdC+0LLQutC4INGE0L7RgNC80Ysg0L7QsdGK0LXQutGC0LAg0L/QviDQuNC90LTQtdC60YHRgy4gKi9cbiAgICAgIGNvZGUyICs9IGBlbHNlIGlmICh2X3NoYXBlID09ICR7aW5kZXh9LjApIHsgcyR7aW5kZXh9KCk7fVxcbmBcbiAgICB9KVxuXG4gICAgLyoqINCj0LTQsNC70LXQvdC40LUg0LvQuNGI0L3QtdCz0L4g0L/QtdGA0LXQstC+0LTQsCDRgdGC0YDQvtC60Lgg0LIg0LrQvtC90YbQtS4gKi9cbiAgICBjb2RlMSA9IGNvZGUxLnNsaWNlKDAsIC0xKVxuXG4gICAgLyoqINCj0LTQsNC70LXQvdC40LUg0LvQuNGI0L3QtdCz0L4gXCJlbHNlXCIg0LIg0L3QsNGH0LDQu9C1INC60L7QtNCwINC4INC70LjRiNC90LXQs9C+INC/0LXRgNC10LLQvtC00LAg0YHRgtGA0L7QutC4INCyINC60L7QvdGG0LUuICovXG4gICAgY29kZTIgPSBjb2RlMi5zbGljZSg1KS5zbGljZSgwLCAtMSlcblxuICAgIHJldHVybiBzaGFkZXJzLkZSQUdNRU5UX1RFTVBMQVRFLlxuICAgICAgcmVwbGFjZSgne1NIQVBFUy1GVU5DVElPTlN9JywgY29kZTEpLlxuICAgICAgcmVwbGFjZSgne1NIQVBFLVNFTEVDVElPTn0nLCBjb2RlMikuXG4gICAgICB0cmltKClcbiAgfVxufVxuIiwiaW1wb3J0IFNQbG90IGZyb20gJ0Avc3Bsb3QnXG5pbXBvcnQgeyBjb2xvckZyb21IZXhUb0dsUmdiIH0gZnJvbSAnQC91dGlscydcblxuLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqXG4gKiDQmtC70LDRgdGBLdGF0LXQu9C/0LXRgCwg0YDQtdCw0LvQuNC30YPRjtGJ0LjQuSDRg9C/0YDQsNCy0LvQtdC90LjQtSDQutC+0L3RgtC10LrRgdGC0L7QvCDRgNC10L3QtNC10YDQuNC90LPQsCBXZWJHTCDQutC70LDRgdGB0LAgU3Bsb3QuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNQbG90V2ViR2wgaW1wbGVtZW50cyBTUGxvdEhlbHBlciB7XG5cbiAgLyoqINCf0LDRgNCw0LzQtdGC0YDRiyDQuNC90LjRhtC40LDQu9C40LfQsNGG0LjQuCDQutC+0L3RgtC10LrRgdGC0LAg0YDQtdC90LTQtdGA0LjQvdCz0LAgV2ViR0wuICovXG4gIHB1YmxpYyBhbHBoYTogYm9vbGVhbiA9IGZhbHNlXG4gIHB1YmxpYyBkZXB0aDogYm9vbGVhbiA9IGZhbHNlXG4gIHB1YmxpYyBzdGVuY2lsOiBib29sZWFuID0gZmFsc2VcbiAgcHVibGljIGFudGlhbGlhczogYm9vbGVhbiA9IGZhbHNlXG4gIHB1YmxpYyBkZXN5bmNocm9uaXplZDogYm9vbGVhbiA9IHRydWVcbiAgcHVibGljIHByZW11bHRpcGxpZWRBbHBoYTogYm9vbGVhbiA9IGZhbHNlXG4gIHB1YmxpYyBwcmVzZXJ2ZURyYXdpbmdCdWZmZXI6IGJvb2xlYW4gPSBmYWxzZVxuICBwdWJsaWMgZmFpbElmTWFqb3JQZXJmb3JtYW5jZUNhdmVhdDogYm9vbGVhbiA9IHRydWVcbiAgcHVibGljIHBvd2VyUHJlZmVyZW5jZTogV2ViR0xQb3dlclByZWZlcmVuY2UgPSAnaGlnaC1wZXJmb3JtYW5jZSdcblxuICAvKiog0J3QsNC30LLQsNC90LjRjyDRjdC70LXQvNC10L3RgtC+0LIg0LPRgNCw0YTQuNGH0LXRgdC60L7QuSDRgdC40YHRgtC10LzRiyDQutC70LjQtdC90YLQsC4gKi9cbiAgcHVibGljIGdwdSA9IHsgaGFyZHdhcmU6ICctJywgc29mdHdhcmU6ICctJyB9XG5cbiAgLyoqINCa0L7QvdGC0LXQutGB0YIg0YDQtdC90LTQtdGA0LjQvdCz0LAg0Lgg0L/RgNC+0LPRgNCw0LzQvNCwIFdlYkdMLiAqL1xuICBwcml2YXRlIGdsITogV2ViR0xSZW5kZXJpbmdDb250ZXh0XG4gIHByaXZhdGUgZ3B1UHJvZ3JhbSE6IFdlYkdMUHJvZ3JhbVxuXG4gIC8qKiDQn9C10YDQtdC80LXQvdC90YvQtSDQtNC70Y8g0YHQstGP0LfQuCDQv9GA0LjQu9C+0LbQtdC90LjRjyDRgSDQv9GA0L7Qs9GA0LDQvNC80L7QuSBXZWJHTC4gKi9cbiAgcHJpdmF0ZSB2YXJpYWJsZXM6IE1hcDxzdHJpbmcsIGFueT4gPSBuZXcgTWFwKClcblxuICAvKiog0J/RgNC40LfQvdCw0Log0YLQvtCz0L4sINGH0YLQviDRhdC10LvQv9C10YAg0YPQttC1INC90LDRgdGC0YDQvtC10L0uICovXG4gIHB1YmxpYyBpc1NldHVwZWQ6IGJvb2xlYW4gPSBmYWxzZVxuXG4gIC8qKiDQkdGD0YTQtdGA0Ysg0LLQuNC00LXQvtC/0LDQvNGP0YLQuCBXZWJHTC4gKi9cbiAgcHVibGljIGRhdGE6IGFueVtdID0gW11cblxuICBwcml2YXRlIGdyb3VwVHlwZTogbnVtYmVyW10gPSBbXVxuXG4gIC8qKiDQn9GA0LDQstC40LvQsCDRgdC+0L7RgtCy0LXRgtGB0YLQstC40Y8g0YLQuNC/0L7QsiDRgtC40L/QuNC30LjRgNC+0LLQsNC90L3Ri9GFINC80LDRgdGB0LjQstC+0LIg0Lgg0YLQuNC/0L7QsiDQv9C10YDQtdC80LXQvdC90YvRhSBXZWJHTC4gKi9cbiAgcHJpdmF0ZSBnbE51bWJlclR5cGVzOiBNYXA8c3RyaW5nLCBudW1iZXI+ID0gbmV3IE1hcChbXG4gICAgWydJbnQ4QXJyYXknLCAweDE0MDBdLCAgICAgICAvLyBnbC5CWVRFXG4gICAgWydVaW50OEFycmF5JywgMHgxNDAxXSwgICAgICAvLyBnbC5VTlNJR05FRF9CWVRFXG4gICAgWydJbnQxNkFycmF5JywgMHgxNDAyXSwgICAgICAvLyBnbC5TSE9SVFxuICAgIFsnVWludDE2QXJyYXknLCAweDE0MDNdLCAgICAgLy8gZ2wuVU5TSUdORURfU0hPUlRcbiAgICBbJ0Zsb2F0MzJBcnJheScsIDB4MTQwNl0gICAgIC8vIGdsLkZMT0FUXG4gIF0pXG5cbiAgLyoqINCl0LXQu9C/0LXRgCDQsdGD0LTQtdGCINC40LzQtdGC0Ywg0L/QvtC70L3Ri9C5INC00L7RgdGC0YPQvyDQuiDRjdC60LfQtdC80L/Qu9GP0YDRgyBTUGxvdC4gKi9cbiAgY29uc3RydWN0b3IoXG4gICAgcmVhZG9ubHkgc3Bsb3Q6IFNQbG90XG4gICkgeyB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0J/QvtC00LPQvtGC0LDQstC70LjQstCw0LXRgiDRhdC10LvQv9C10YAg0Log0LjRgdC/0L7Qu9GM0LfQvtCy0LDQvdC40Y4uXG4gICAqL1xuICBwdWJsaWMgc2V0dXAoKTogdm9pZCB7XG5cbiAgICAvKiog0KfQsNGB0YLRjCDQv9Cw0YDQsNC80LXRgtGA0L7QsiDRhdC10LvQv9C10YDQsCBXZWJHTCDQuNC90LjRhtC40LDQu9C40LfQuNGA0YPQtdGC0YHRjyDRgtC+0LvRjNC60L4g0L7QtNC40L0g0YDQsNC3LiAqL1xuICAgIGlmICghdGhpcy5pc1NldHVwZWQpIHtcblxuICAgICAgdGhpcy5nbCA9IHRoaXMuc3Bsb3QuY2FudmFzLmdldENvbnRleHQoJ3dlYmdsJywge1xuICAgICAgICBhbHBoYTogdGhpcy5hbHBoYSxcbiAgICAgICAgZGVwdGg6IHRoaXMuZGVwdGgsXG4gICAgICAgIHN0ZW5jaWw6IHRoaXMuc3RlbmNpbCxcbiAgICAgICAgYW50aWFsaWFzOiB0aGlzLmFudGlhbGlhcyxcbiAgICAgICAgZGVzeW5jaHJvbml6ZWQ6IHRoaXMuZGVzeW5jaHJvbml6ZWQsXG4gICAgICAgIHByZW11bHRpcGxpZWRBbHBoYTogdGhpcy5wcmVtdWx0aXBsaWVkQWxwaGEsXG4gICAgICAgIHByZXNlcnZlRHJhd2luZ0J1ZmZlcjogdGhpcy5wcmVzZXJ2ZURyYXdpbmdCdWZmZXIsXG4gICAgICAgIGZhaWxJZk1ham9yUGVyZm9ybWFuY2VDYXZlYXQ6IHRoaXMuZmFpbElmTWFqb3JQZXJmb3JtYW5jZUNhdmVhdCxcbiAgICAgICAgcG93ZXJQcmVmZXJlbmNlOiB0aGlzLnBvd2VyUHJlZmVyZW5jZVxuICAgICAgfSkhXG5cbiAgICAgIGlmICh0aGlzLmdsID09PSBudWxsKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcign0J7RiNC40LHQutCwINGB0L7Qt9C00LDQvdC40Y8g0LrQvtC90YLQtdC60YHRgtCwINGA0LXQvdC00LXRgNC40L3Qs9CwIFdlYkdMIScpXG4gICAgICB9XG5cbiAgICAgIC8qKiDQn9C+0LvRg9GH0LXQvdC40LUg0LjQvdGE0L7RgNC80LDRhtC40Lgg0L4g0LPRgNCw0YTQuNGH0LXRgdC60L7QuSDRgdC40YHRgtC10LzQtSDQutC70LjQtdC90YLQsC4gKi9cbiAgICAgIGxldCBleHQgPSB0aGlzLmdsLmdldEV4dGVuc2lvbignV0VCR0xfZGVidWdfcmVuZGVyZXJfaW5mbycpXG4gICAgICB0aGlzLmdwdS5oYXJkd2FyZSA9IChleHQpID8gdGhpcy5nbC5nZXRQYXJhbWV0ZXIoZXh0LlVOTUFTS0VEX1JFTkRFUkVSX1dFQkdMKSA6ICdb0L3QtdC40LfQstC10YHRgtC90L5dJ1xuICAgICAgdGhpcy5ncHUuc29mdHdhcmUgPSB0aGlzLmdsLmdldFBhcmFtZXRlcih0aGlzLmdsLlZFUlNJT04pXG5cbiAgICAgIHRoaXMuc3Bsb3QuZGVidWcubG9nKCdncHUnKVxuXG4gICAgICAvKiog0KHQvtC30LTQsNC90LjQtSDQv9GA0L7Qs9GA0LDQvNC80YsgV2ViR0wuICovXG4gICAgICB0aGlzLmNyZWF0ZVByb2dyYW0odGhpcy5zcGxvdC5nbHNsLnZlcnRTaGFkZXJTb3VyY2UsIHRoaXMuc3Bsb3QuZ2xzbC5mcmFnU2hhZGVyU291cmNlKVxuXG4gICAgICB0aGlzLmlzU2V0dXBlZCA9IHRydWVcbiAgICB9XG5cbiAgICAvKiog0JTRgNGD0LPQsNGPINGH0LDRgdGC0Ywg0L/QsNGA0LDQvNC10YLRgNC+0LIg0YXQtdC70L/QtdGA0LAgV2ViR0wg0LjQvdC40YbQuNCw0LvQuNC30LjRgNGD0LXRgtGB0Y8g0L/RgNC4INC60LDQttC00L7QvCDQstGL0LfQvtCy0LUg0LzQtdGC0L7QtNCwIHNldHVwLiAqL1xuXG4gICAgLyoqINCa0L7QvtGA0LXQutGC0LjRgNC+0LLQutCwINGA0LDQt9C80LXRgNCwINC+0LHQu9Cw0YHRgtC4INC/0YDQvtGB0LzQvtGC0YDQsC4gKi9cbiAgICB0aGlzLnNwbG90LmNhbnZhcy53aWR0aCA9IHRoaXMuc3Bsb3QuY2FudmFzLmNsaWVudFdpZHRoXG4gICAgdGhpcy5zcGxvdC5jYW52YXMuaGVpZ2h0ID0gdGhpcy5zcGxvdC5jYW52YXMuY2xpZW50SGVpZ2h0XG4gICAgdGhpcy5nbC52aWV3cG9ydCgwLCAwLCB0aGlzLnNwbG90LmNhbnZhcy53aWR0aCwgdGhpcy5zcGxvdC5jYW52YXMuaGVpZ2h0KVxuXG4gICAgLyoqINCV0YHQu9C4INC30LDQtNCw0L0g0YDQsNC30LzQtdGAINC/0LvQvtGB0LrQvtGB0YLQuCwg0L3QviDQvdC1INC30LDQtNCw0L3QviDQv9C+0LvQvtC20LXQvdC40LUg0L7QsdC70LDRgdGC0Lgg0L/RgNC+0YHQvNC+0YLRgNCwLCDRgtC+INC+0L3QsCDQv9C+0LzQtdGJ0LDQtdGC0YHRjyDQsiDRhtC10L3RgtGAINC/0LvQvtGB0LrQvtGB0YLQuC4gKi9cbiAgICBpZiAoKCdncmlkJyBpbiB0aGlzLnNwbG90Lmxhc3RSZXF1ZXN0ZWRPcHRpb25zISkgJiYgISgnY2FtZXJhJyBpbiB0aGlzLnNwbG90Lmxhc3RSZXF1ZXN0ZWRPcHRpb25zKSkge1xuICAgICAgdGhpcy5zcGxvdC5jYW1lcmEueCA9IHRoaXMuc3Bsb3QuZ3JpZC53aWR0aCEgLyAyXG4gICAgICB0aGlzLnNwbG90LmNhbWVyYS55ID0gdGhpcy5zcGxvdC5ncmlkLmhlaWdodCEgLyAyXG4gICAgfVxuXG4gICAgLyoqINCj0YHRgtCw0L3QvtCy0LrQsCDRhNC+0L3QvtCy0L7Qs9C+INGG0LLQtdGC0LAg0LrQsNC90LLQsNGB0LAgKNGG0LLQtdGCINC+0YfQuNGB0YLQutC4INC60L7QvdGC0LXQutGB0YLQsCDRgNC10L3QtNC10YDQuNC90LPQsCkuICovXG4gICAgdGhpcy5zZXRCZ0NvbG9yKHRoaXMuc3Bsb3QuZ3JpZC5iZ0NvbG9yISlcbiAgfVxuXG4gIGNsZWFyRGF0YSgpIHtcblxuICAgIGZvciAobGV0IGR4ID0gMDsgZHggPCB0aGlzLnNwbG90LmFyZWEuZHhDb3VudDsgZHgrKykge1xuICAgICAgdGhpcy5kYXRhW2R4XSA9IFtdXG4gICAgICBmb3IgKGxldCBkeSA9IDA7IGR5IDwgdGhpcy5zcGxvdC5hcmVhLmR5Q291bnQ7IGR5KyspIHtcbiAgICAgICAgdGhpcy5kYXRhW2R4XVtkeV0gPSBbXVxuICAgICAgICBmb3IgKGxldCBkeiA9IDA7IGR6IDwgdGhpcy5zcGxvdC5hcmVhLmdyb3Vwc1tkeF1bZHldLmxlbmd0aDsgZHorKykge1xuICAgICAgICAgIHRoaXMuZGF0YVtkeF1bZHldW2R6XSA9IFtdXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCj0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdGCINGG0LLQtdGCINGE0L7QvdCwINC60L7QvdGC0LXQutGB0YLQsCDRgNC10L3QtNC10YDQuNC90LPQsCBXZWJHTC5cbiAgICovXG4gIHB1YmxpYyBzZXRCZ0NvbG9yKGNvbG9yOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBsZXQgW3IsIGcsIGJdID0gY29sb3JGcm9tSGV4VG9HbFJnYihjb2xvcilcbiAgICB0aGlzLmdsLmNsZWFyQ29sb3IociwgZywgYiwgMC4wKVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JfQsNC60YDQsNGI0LjQstCw0LXRgiDQutC+0L3RgtC10LrRgdGCINGA0LXQvdC00LXRgNC40L3Qs9CwIFdlYkdMINGG0LLQtdGC0L7QvCDRhNC+0L3QsC5cbiAgICovXG4gIHB1YmxpYyBjbGVhckJhY2tncm91bmQoKTogdm9pZCB7XG4gICAgdGhpcy5nbC5jbGVhcih0aGlzLmdsLkNPTE9SX0JVRkZFUl9CSVQpO1xuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0KHQvtC30LTQsNC10YIg0YjQtdC50LTQtdGAIFdlYkdMLlxuICAgKlxuICAgKiBAcGFyYW0gdHlwZSAtINCi0LjQvyDRiNC10LnQtNC10YDQsC5cbiAgICogQHBhcmFtIGNvZGUgLSBHTFNMLdC60L7QtCDRiNC10LnQtNC10YDQsC5cbiAgICogQHJldHVybnMg0KHQvtC30LTQsNC90L3Ri9C5INGI0LXQudC00LXRgC5cbiAgICovXG4gIHB1YmxpYyBjcmVhdGVTaGFkZXIodHlwZTogJ1ZFUlRFWF9TSEFERVInIHwgJ0ZSQUdNRU5UX1NIQURFUicsIGNvZGU6IHN0cmluZyk6IFdlYkdMU2hhZGVyIHtcblxuICAgIGNvbnN0IHNoYWRlciA9IHRoaXMuZ2wuY3JlYXRlU2hhZGVyKHRoaXMuZ2xbdHlwZV0pIVxuICAgIHRoaXMuZ2wuc2hhZGVyU291cmNlKHNoYWRlciwgY29kZSlcbiAgICB0aGlzLmdsLmNvbXBpbGVTaGFkZXIoc2hhZGVyKVxuXG4gICAgaWYgKCF0aGlzLmdsLmdldFNoYWRlclBhcmFtZXRlcihzaGFkZXIsIHRoaXMuZ2wuQ09NUElMRV9TVEFUVVMpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ9Ce0YjQuNCx0LrQsCDQutC+0LzQv9C40LvRj9GG0LjQuCDRiNC10LnQtNC10YDQsCBbJyArIHR5cGUgKyAnXS4gJyArIHRoaXMuZ2wuZ2V0U2hhZGVySW5mb0xvZyhzaGFkZXIpKVxuICAgIH1cblxuICAgIHJldHVybiBzaGFkZXJcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCh0L7Qt9C00LDQtdGCINC/0YDQvtCz0YDQsNC80LzRgyBXZWJHTCDQuNC3INGI0LXQudC00LXRgNC+0LIuXG4gICAqXG4gICAqIEBwYXJhbSBzaGFkZXJWZXJ0IC0g0JLQtdGA0YjQuNC90L3Ri9C5INGI0LXQudC00LXRgC5cbiAgICogQHBhcmFtIHNoYWRlckZyYWcgLSDQpNGA0LDQs9C80LXQvdGC0L3Ri9C5INGI0LXQudC00LXRgC5cbiAgICovXG4gIHB1YmxpYyBjcmVhdGVQcm9ncmFtRnJvbVNoYWRlcnMoc2hhZGVyVmVydDogV2ViR0xTaGFkZXIsIHNoYWRlckZyYWc6IFdlYkdMU2hhZGVyKTogdm9pZCB7XG5cbiAgICB0aGlzLmdwdVByb2dyYW0gPSB0aGlzLmdsLmNyZWF0ZVByb2dyYW0oKSFcbiAgICB0aGlzLmdsLmF0dGFjaFNoYWRlcih0aGlzLmdwdVByb2dyYW0sIHNoYWRlclZlcnQpXG4gICAgdGhpcy5nbC5hdHRhY2hTaGFkZXIodGhpcy5ncHVQcm9ncmFtLCBzaGFkZXJGcmFnKVxuICAgIHRoaXMuZ2wubGlua1Byb2dyYW0odGhpcy5ncHVQcm9ncmFtKVxuICAgIHRoaXMuZ2wudXNlUHJvZ3JhbSh0aGlzLmdwdVByb2dyYW0pXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQodC+0LfQtNCw0LXRgiDQv9GA0L7Qs9GA0LDQvNC80YMgV2ViR0wg0LjQtyBHTFNMLdC60L7QtNC+0LIg0YjQtdC50LTQtdGA0L7Qsi5cbiAgICpcbiAgICogQHBhcmFtIHNoYWRlckNvZGVWZXJ0IC0g0JrQvtC0INCy0LXRgNGI0LjQvdC90L7Qs9C+INGI0LXQudC00LXRgNCwLlxuICAgKiBAcGFyYW0gc2hhZGVyQ29kZUZyYWcgLSDQmtC+0LQg0YTRgNCw0LPQvNC10L3RgtC90L7Qs9C+INGI0LXQudC00LXRgNCwLlxuICAgKi9cbiAgcHVibGljIGNyZWF0ZVByb2dyYW0oc2hhZGVyQ29kZVZlcnQ6IHN0cmluZywgc2hhZGVyQ29kZUZyYWc6IHN0cmluZyk6IHZvaWQge1xuXG4gICAgdGhpcy5zcGxvdC5kZWJ1Zy5sb2coJ3NoYWRlcnMnKVxuXG4gICAgdGhpcy5jcmVhdGVQcm9ncmFtRnJvbVNoYWRlcnMoXG4gICAgICB0aGlzLmNyZWF0ZVNoYWRlcignVkVSVEVYX1NIQURFUicsIHNoYWRlckNvZGVWZXJ0KSxcbiAgICAgIHRoaXMuY3JlYXRlU2hhZGVyKCdGUkFHTUVOVF9TSEFERVInLCBzaGFkZXJDb2RlRnJhZylcbiAgICApXG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQodC+0LfQtNCw0LXRgiDRgdCy0Y/Qt9GMINC/0LXRgNC10LzQtdC90L3QvtC5INC/0YDQuNC70L7QttC10L3QuNGPINGBINC/0YDQvtCz0YDQsNC80LzQvtC5IFdlYkdsLlxuICAgKlxuICAgKiBAcmVtYXJrc1xuICAgKiDQn9C10YDQtdC80LXQvdC90YvQtSDRgdC+0YXRgNCw0L3Rj9GO0YLRgdGPINCyINCw0YHRgdC+0YbQuNCw0YLQuNCy0L3QvtC8INC80LDRgdGB0LjQstC1LCDQs9C00LUg0LrQu9GO0YfQuCAtINGN0YLQviDQvdCw0LfQstCw0L3QuNGPINC/0LXRgNC10LzQtdC90L3Ri9GFLiDQndCw0LfQstCw0L3QuNC1INC/0LXRgNC10LzQtdC90L3QvtC5INC00L7Qu9C20L3QvlxuICAgKiDQvdCw0YfQuNC90LDRgtGM0YHRjyDRgSDQv9GA0LXRhNC40LrRgdCwLCDQvtCx0L7Qt9C90LDRh9Cw0Y7RidC10LPQviDQtdC1IEdMU0wt0YLQuNC/LiDQn9GA0LXRhNC40LrRgSBcInVfXCIg0L7Qv9C40YHRi9Cy0LDQtdGCINC/0LXRgNC10LzQtdC90L3Rg9GOINGC0LjQv9CwIHVuaWZvcm0uINCf0YDQtdGE0LjQutGBIFwiYV9cIlxuICAgKiDQvtC/0LjRgdGL0LLQsNC10YIg0L/QtdGA0LXQvNC10L3QvdGD0Y4g0YLQuNC/0LAgYXR0cmlidXRlLlxuICAgKlxuICAgKiBAcGFyYW0gdmFyTmFtZSAtINCY0LzRjyDQv9C10YDQtdC80LXQvdC90L7QuSAo0YHRgtGA0L7QutCwKS5cbiAgICovXG4gIHB1YmxpYyBjcmVhdGVWYXJpYWJsZSh2YXJOYW1lOiBzdHJpbmcpOiB2b2lkIHtcblxuICAgIGNvbnN0IHZhclR5cGUgPSB2YXJOYW1lLnNsaWNlKDAsIDIpXG5cbiAgICBpZiAodmFyVHlwZSA9PT0gJ3VfJykge1xuICAgICAgdGhpcy52YXJpYWJsZXMuc2V0KHZhck5hbWUsIHRoaXMuZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHRoaXMuZ3B1UHJvZ3JhbSwgdmFyTmFtZSkpXG4gICAgfSBlbHNlIGlmICh2YXJUeXBlID09PSAnYV8nKSB7XG4gICAgICB0aGlzLnZhcmlhYmxlcy5zZXQodmFyTmFtZSwgdGhpcy5nbC5nZXRBdHRyaWJMb2NhdGlvbih0aGlzLmdwdVByb2dyYW0sIHZhck5hbWUpKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ9Cj0LrQsNC30LDQvSDQvdC10LLQtdGA0L3Ri9C5INGC0LjQvyAo0L/RgNC10YTQuNC60YEpINC/0LXRgNC10LzQtdC90L3QvtC5INGI0LXQudC00LXRgNCwOiAnICsgdmFyTmFtZSlcbiAgICB9XG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQodC+0LfQtNCw0LXRgiDRgdCy0Y/Qt9GMINC90LDQsdC+0YDQsCDQv9C10YDQtdC80LXQvdC90YvRhSDQv9GA0LjQu9C+0LbQtdC90LjRjyDRgSDQv9GA0L7Qs9GA0LDQvNC80L7QuSBXZWJHbC5cbiAgICpcbiAgICogQHJlbWFya3NcbiAgICog0JTQtdC70LDQtdGCINGC0L7QttC1INGB0LDQvNC+0LUsINGH0YLQviDQuCDQvNC10YLQvtC0IHtAbGluayBjcmVhdGVWYXJpYWJsZX0sINC90L4g0L/QvtC30LLQvtC70Y/QtdGCINC30LAg0L7QtNC40L0g0LLRi9C30L7QsiDRgdC+0LfQtNCw0YLRjCDRgdGA0LDQt9GDINC90LXRgdC60L7Qu9GM0LrQvlxuICAgKiDQv9C10YDQtdC80LXQvdC90YvRhS5cbiAgICpcbiAgICogQHBhcmFtIHZhck5hbWVzIC0g0J/QtdGA0LXRh9C40YHQu9C10L3QuNGPINC40LzQtdC9INC/0LXRgNC10LzQtdC90L3Ri9GFICjRgdGC0YDQvtC60LDQvNC4KS5cbiAgICovXG4gIHB1YmxpYyBjcmVhdGVWYXJpYWJsZXMoLi4udmFyTmFtZXM6IHN0cmluZ1tdKTogdm9pZCB7XG4gICAgdmFyTmFtZXMuZm9yRWFjaCh2YXJOYW1lID0+IHRoaXMuY3JlYXRlVmFyaWFibGUodmFyTmFtZSkpO1xuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0KHQvtC30LTQsNC10YIg0LIg0LPRgNGD0L/Qv9C1INCx0YPRhNC10YDQvtCyIFdlYkdMINC90L7QstGL0Lkg0LHRg9GE0LXRgCDQuCDQt9Cw0L/QuNGB0YvQstCw0LXRgiDQsiDQvdC10LPQviDQv9C10YDQtdC00LDQvdC90YvQtSDQtNCw0L3QvdGL0LUuXG4gICAqXG4gICAqIEByZW1hcmtzXG4gICAqINCa0L7Qu9C40YfQtdGB0YLQstC+INCz0YDRg9C/0L8g0LHRg9GE0LXRgNC+0LIg0Lgg0LrQvtC70LjRh9C10YHRgtCy0L4g0LHRg9GE0LXRgNC+0LIg0LIg0LrQsNC20LTQvtC5INCz0YDRg9C/0L/QtSDQvdC1INC+0LPRgNCw0L3QuNGH0LXQvdGLLiDQmtCw0LbQtNCw0Y8g0LPRgNGD0L/Qv9CwINC40LzQtdC10YIg0YHQstC+0LUg0L3QsNC30LLQsNC90LjQtSDQuFxuICAgKiBHTFNMLdGC0LjQvy4g0KLQuNC/INCz0YDRg9C/0L/RiyDQvtC/0YDQtdC00LXQu9GP0LXRgtGB0Y8g0LDQstGC0L7QvNCw0YLQuNGH0LXRgdC60Lgg0L3QsCDQvtGB0L3QvtCy0LUg0YLQuNC/0LAg0YLQuNC/0LjQt9C40YDQvtCy0LDQvdC90L7Qs9C+INC80LDRgdGB0LjQstCwLiDQn9GA0LDQstC40LvQsCDRgdC+0L7RgtCy0LXRgtGB0YLQstC40Y8g0YLQuNC/0L7QslxuICAgKiDQvtC/0YDQtdC00LXQu9GP0Y7RgtGB0Y8g0L/QtdGA0LXQvNC10L3QvdC+0Lkge0BsaW5rIGdsTnVtYmVyVHlwZXN9LlxuICAgKlxuICAgKiBAcGFyYW0gZ3JvdXBDb2RlIC0g0J3QsNC30LLQsNC90LjQtSDQs9GA0YPQv9C/0Ysg0LHRg9GE0LXRgNC+0LIsINCyINC60L7RgtC+0YDRg9GOINCx0YPQtNC10YIg0LTQvtCx0LDQstC70LXQvSDQvdC+0LLRi9C5INCx0YPRhNC10YAuXG4gICAqIEBwYXJhbSBkeCAtINCT0L7RgNC40LfQvtC90YLQsNC70YzQvdGL0Lkg0LjQvdC00LXQutGBINCx0YPRhNC10YDQvdC+0Lkg0LPRgNGD0L/Qv9GLLlxuICAgKiBAcGFyYW0gZHkgLSDQktC10YDRgtC40LrQsNC70YzQvdGL0Lkg0LjQvdC00LXQutGBINCx0YPRhNC10YDQvdC+0Lkg0LPRgNGD0L/Qv9GLLlxuICAgKiBAcGFyYW0gZGF0YSAtINCU0LDQvdC90YvQtSDQsiDQstC40LTQtSDRgtC40L/QuNC30LjRgNC+0LLQsNC90L3QvtCz0L4g0LzQsNGB0YHQuNCy0LAg0LTQu9GPINC30LDQv9C40YHQuCDQsiDRgdC+0LfQtNCw0LLQsNC10LzRi9C5INCx0YPRhNC10YAuXG4gICAqIEByZXR1cm5zINCe0LHRitC10Lwg0L/QsNC80Y/RgtC4LCDQt9Cw0L3Rj9GC0YvQuSDQvdC+0LLRi9C8INCx0YPRhNC10YDQvtC8ICjQsiDQsdCw0LnRgtCw0YUpLlxuICAgKi9cbiAgcHVibGljIGNyZWF0ZUJ1ZmZlcihkeDogbnVtYmVyLCBkeTogbnVtYmVyLCBkejogbnVtYmVyLCBncm91cENvZGU6IG51bWJlciwgZGF0YTogVHlwZWRBcnJheSk6IG51bWJlciB7XG5cbiAgICBjb25zdCBidWZmZXIgPSB0aGlzLmdsLmNyZWF0ZUJ1ZmZlcigpIVxuICAgIHRoaXMuZ2wuYmluZEJ1ZmZlcih0aGlzLmdsLkFSUkFZX0JVRkZFUiwgYnVmZmVyKVxuICAgIHRoaXMuZ2wuYnVmZmVyRGF0YSh0aGlzLmdsLkFSUkFZX0JVRkZFUiwgZGF0YSwgdGhpcy5nbC5TVEFUSUNfRFJBVylcblxuICAgIHRoaXMuZGF0YVtkeF1bZHldW2R6XVtncm91cENvZGVdID0gYnVmZmVyXG5cbiAgICB0aGlzLmdyb3VwVHlwZVtncm91cENvZGVdID0gdGhpcy5nbE51bWJlclR5cGVzLmdldChkYXRhLmNvbnN0cnVjdG9yLm5hbWUpIVxuXG4gICAgcmV0dXJuIGRhdGEubGVuZ3RoICogZGF0YS5CWVRFU19QRVJfRUxFTUVOVFxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0J/QtdGA0LXQtNCw0LXRgiDQt9C90LDRh9C10L3QuNC1INC80LDRgtGA0LjRhtGLIDMg0YUgMyDQsiDQv9GA0L7Qs9GA0LDQvNC80YMgV2ViR2wuXG4gICAqXG4gICAqIEBwYXJhbSB2YXJOYW1lIC0g0JjQvNGPINC/0LXRgNC10LzQtdC90L3QvtC5IFdlYkdMICjQuNC3INC80LDRgdGB0LjQstCwIHtAbGluayB2YXJpYWJsZXN9KSDQsiDQutC+0YLQvtGA0YPRjiDQsdGD0LTQtdGCINC30LDQv9C40YHQsNC90L4g0L/QtdGA0LXQtNCw0L3QvdC+0LUg0LfQvdCw0YfQtdC90LjQtS5cbiAgICogQHBhcmFtIHZhclZhbHVlIC0g0KPRgdGC0LDQvdCw0LLQu9C40LLQsNC10LzQvtC1INC30L3QsNGH0LXQvdC40LUg0LTQvtC70LbQvdC+INGP0LLQu9GP0YLRjNGB0Y8g0LzQsNGC0YDQuNGG0LXQuSDQstC10YnQtdGB0YLQstC10L3QvdGL0YUg0YfQuNGB0LXQuyDRgNCw0LfQvNC10YDQvtC8IDMg0YUgMywg0YDQsNC30LLQtdGA0L3Rg9GC0L7QuVxuICAgKiAgICAg0LIg0LLQuNC00LUg0L7QtNC90L7QvNC10YDQvdC+0LPQviDQvNCw0YHRgdC40LLQsCDQuNC3IDkg0Y3Qu9C10LzQtdC90YLQvtCyLlxuICAgKi9cbiAgcHVibGljIHNldFZhcmlhYmxlKHZhck5hbWU6IHN0cmluZywgdmFyVmFsdWU6IG51bWJlcltdKTogdm9pZCB7XG4gICAgdGhpcy5nbC51bmlmb3JtTWF0cml4M2Z2KHRoaXMudmFyaWFibGVzLmdldCh2YXJOYW1lKSwgZmFsc2UsIHZhclZhbHVlKVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0JTQtdC70LDQtdGCINCx0YPRhNC10YAgV2ViR2wgXCLQsNC60YLQuNCy0L3Ri9C8XCIuXG4gICAqXG4gICAqIEBwYXJhbSBncm91cENvZGUgLSDQndCw0LfQstCw0L3QuNC1INCz0YDRg9C/0L/RiyDQsdGD0YTQtdGA0L7Qsiwg0LIg0LrQvtGC0L7RgNC+0Lwg0YXRgNCw0L3QuNGC0YHRjyDQvdC10L7QsdGF0L7QtNC40LzRi9C5INCx0YPRhNC10YAuXG4gICAqIEBwYXJhbSBkeCAtINCT0L7RgNC40LfQvtC90YLQsNC70YzQvdGL0Lkg0LjQvdC00LXQutGBINCx0YPRhNC10YDQvdC+0Lkg0LPRgNGD0L/Qv9GLLlxuICAgKiBAcGFyYW0gZHkgLSDQktC10YDRgtC40LrQsNC70YzQvdGL0Lkg0LjQvdC00LXQutGBINCx0YPRhNC10YDQvdC+0Lkg0LPRgNGD0L/Qv9GLLlxuICAgKiBAcGFyYW0gZHogLSDQk9C70YPQsdC40L3QvdGL0Lkg0LjQvdC00LXQutGBINCx0YPRhNC10YDQsCDQsiDQs9GA0YPQv9C/0LUuXG4gICAqIEBwYXJhbSB2YXJOYW1lIC0g0JjQvNGPINC/0LXRgNC10LzQtdC90L3QvtC5ICjQuNC3INC80LDRgdGB0LjQstCwIHtAbGluayB2YXJpYWJsZXN9KSwg0YEg0LrQvtGC0L7RgNC+0Lkg0LHRg9C00LXRgiDRgdCy0Y/Qt9Cw0L0g0LHRg9GE0LXRgC5cbiAgICogQHBhcmFtIHNpemUgLSDQmtC+0LvQuNGH0LXRgdGC0LLQviDRjdC70LXQvNC10L3RgtC+0LIg0LIg0LHRg9GE0LXRgNC1LCDRgdC+0L7RgtCy0LXRgtGB0YLQstGD0Y7RidC40YUg0L7QtNC90L7QuSDCoEdMLdCy0LXRgNGI0LjQvdC1LlxuICAgKiBAcGFyYW0gc3RyaWRlIC0g0KDQsNC30LzQtdGAINGI0LDQs9CwINC+0LHRgNCw0LHQvtGC0LrQuCDRjdC70LXQvNC10L3RgtC+0LIg0LHRg9GE0LXRgNCwICjQt9C90LDRh9C10L3QuNC1IDAg0LfQsNC00LDQtdGCINGA0LDQt9C80LXRidC10L3QuNC1INGN0LvQtdC80LXQvdGC0L7QsiDQtNGA0YPQsyDQt9CwINC00YDRg9Cz0L7QvCkuXG4gICAqIEBwYXJhbSBvZmZzZXQgLSDQodC80LXRidC10L3QuNC1INC+0YLQvdC+0YHQuNGC0LXQu9GM0L3QviDQvdCw0YfQsNC70LAg0LHRg9GE0LXRgNCwLCDQvdCw0YfQuNC90LDRjyDRgSDQutC+0YLQvtGA0L7Qs9C+INCx0YPQtNC10YIg0L/RgNC+0LjRgdGF0L7QtNC40YLRjCDQvtCx0YDQsNCx0L7RgtC60LAg0Y3Qu9C10LzQtdC90YLQvtCyLlxuICAgKi9cbiAgcHVibGljIHNldEJ1ZmZlcihkeDogbnVtYmVyLCBkeTogbnVtYmVyLCBkejogbnVtYmVyLCBncm91cENvZGU6IG51bWJlciwgdmFyTmFtZTogc3RyaW5nLCBzaXplOiBudW1iZXIsIHN0cmlkZTogbnVtYmVyLCBvZmZzZXQ6IG51bWJlcik6IHZvaWQge1xuXG4gICAgY29uc3QgdmFyaWFibGUgPSB0aGlzLnZhcmlhYmxlcy5nZXQodmFyTmFtZSlcblxuICAgIHRoaXMuZ2wuYmluZEJ1ZmZlcih0aGlzLmdsLkFSUkFZX0JVRkZFUiwgdGhpcy5kYXRhW2R4XVtkeV1bZHpdW2dyb3VwQ29kZV0pXG4gICAgdGhpcy5nbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheSh2YXJpYWJsZSlcbiAgICB0aGlzLmdsLnZlcnRleEF0dHJpYlBvaW50ZXIodmFyaWFibGUsIHNpemUsIHRoaXMuZ3JvdXBUeXBlW2dyb3VwQ29kZV0sIGZhbHNlLCBzdHJpZGUsIG9mZnNldClcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCS0YvQv9C+0LvQvdGP0LXRgiDQvtGC0YDQuNGB0L7QstC60YMg0LrQvtC90YLQtdC60YHRgtCwINGA0LXQvdC00LXRgNC40L3Qs9CwIFdlYkdMINC80LXRgtC+0LTQvtC8INC/0YDQuNC80LjRgtC40LLQvdGL0YUg0YLQvtGH0LXQui5cbiAgICpcbiAgICogQHBhcmFtIGZpcnN0IC0g0JjQvdC00LXQutGBIEdMLdCy0LXRgNGI0LjQvdGLLCDRgSDQutC+0YLQvtGA0L7QuSDQvdCw0YfQvdC10YLRjyDQvtGC0YDQuNGB0L7QstC60LAuXG4gICAqIEBwYXJhbSBjb3VudCAtINCa0L7Qu9C40YfQtdGB0YLQstC+INC+0YDQuNGB0L7QstGL0LLQsNC10LzRi9GFIEdMLdCy0LXRgNGI0LjQvS5cbiAgICovXG4gIHB1YmxpYyBkcmF3UG9pbnRzKGZpcnN0OiBudW1iZXIsIGNvdW50OiBudW1iZXIpOiB2b2lkIHtcbiAgICB0aGlzLmdsLmRyYXdBcnJheXModGhpcy5nbC5QT0lOVFMsIGZpcnN0LCBjb3VudClcbiAgfVxufVxuIiwiaW1wb3J0IHsgY29weU1hdGNoaW5nS2V5VmFsdWVzIH0gZnJvbSAnQC91dGlscydcbmltcG9ydCBTUGxvdENvbnRvbCBmcm9tICdAL3NwbG90LWNvbnRyb2wnXG5pbXBvcnQgU1Bsb3RXZWJHbCBmcm9tICdAL3NwbG90LXdlYmdsJ1xuaW1wb3J0IFNQbG90RGVidWcgZnJvbSAnQC9zcGxvdC1kZWJ1ZydcbmltcG9ydCBTUGxvdERlbW8gZnJvbSAnQC9zcGxvdC1kZW1vJ1xuaW1wb3J0IFNQbG90R2xzbCBmcm9tICdAL3NwbG90LWdsc2wnXG5cbi8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKlxuICog0JrQu9Cw0YHRgSBTUGxvdCAtINGA0LXQsNC70LjQt9GD0LXRgiDQs9GA0LDRhNC40Log0YLQuNC/0LAg0YHQutCw0YLRgtC10YDQv9C70L7RgiDRgdGA0LXQtNGB0YLQstCw0LzQuCBXZWJHTC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU1Bsb3Qge1xuXG4gIC8qKiDQpNGD0L3QutGG0LjRjyDQuNGC0LXRgNC40YDQvtCy0LDQvdC40Y8g0LjRgdGF0L7QtNC90YvRhSDQtNCw0L3QvdGL0YUuICovXG4gIHB1YmxpYyBpdGVyYXRvcjogU1Bsb3RJdGVyYXRvciA9IHVuZGVmaW5lZFxuXG4gIC8qKiDQpdC10LvQv9C10YAg0YDQtdC20LjQvNCwINC+0YLQu9Cw0LTQutC4LiAqL1xuICBwdWJsaWMgZGVidWc6IFNQbG90RGVidWcgPSBuZXcgU1Bsb3REZWJ1Zyh0aGlzKVxuXG4gIC8qKiDQpdC10LvQv9C10YAsINGD0L/RgNCw0LLQu9GP0Y7RidC40LkgR0xTTC3QutC+0LTQvtC8INGI0LXQudC00LXRgNC+0LIuICovXG4gIHB1YmxpYyBnbHNsOiBTUGxvdEdsc2wgPSBuZXcgU1Bsb3RHbHNsKHRoaXMpXG5cbiAgLyoqINCl0LXQu9C/0LXRgCBXZWJHTC4gKi9cbiAgcHVibGljIHdlYmdsOiBTUGxvdFdlYkdsID0gbmV3IFNQbG90V2ViR2wodGhpcylcblxuICAvKiog0KXQtdC70L/QtdGAINGA0LXQttC40LzQsCDQtNC10LzQvi3QtNCw0L3QvdGL0YUuICovXG4gIHB1YmxpYyBkZW1vOiBTUGxvdERlbW8gPSBuZXcgU1Bsb3REZW1vKHRoaXMpXG5cbiAgLyoqINCf0YDQuNC30L3QsNC6INGE0L7RgNGB0LjRgNC+0LLQsNC90L3QvtCz0L4g0LfQsNC/0YPRgdC60LAg0YDQtdC90LTQtdGA0LAuICovXG4gIHB1YmxpYyBmb3JjZVJ1bjogYm9vbGVhbiA9IGZhbHNlXG5cbiAgLyoqINCe0LPRgNCw0L3QuNGH0LXQvdC40LUg0LrQvtC7LdCy0LAg0L7QsdGK0LXQutGC0L7QsiDQvdCwINCz0YDQsNGE0LjQutC1LiAqL1xuICBwdWJsaWMgZ2xvYmFsTGltaXQ6IG51bWJlciA9IDFfMDAwXzAwMF8wMDBcblxuICAvKiog0J7Qs9GA0LDQvdC40YfQtdC90LjQtSDQutC+0Lst0LLQsCDQvtCx0YrQtdC60YLQvtCyINCyINCz0YDRg9C/0L/QtS4gKi9cbiAgcHVibGljIGdyb3VwTGltaXQ6IG51bWJlciA9IDEwXzAwMFxuXG4gIC8qKiDQptCy0LXRgtC+0LLQsNGPINC/0LDQu9C40YLRgNCwINC+0LHRitC10LrRgtC+0LIuICovXG4gIHB1YmxpYyBjb2xvcnM6IHN0cmluZ1tdID0gW11cblxuICAvKiog0J/QsNGA0LDQvNC10YLRgNGLINC60L7QvtGA0LTQuNC90LDRgtC90L7QuSDQv9C70L7RgdC60L7RgdGC0LguICovXG4gIHB1YmxpYyBncmlkOiBTUGxvdEdyaWQgPSB7XG4gICAgd2lkdGg6IDMyXzAwMCxcbiAgICBoZWlnaHQ6IDE2XzAwMCxcbiAgICBiZ0NvbG9yOiAnI2ZmZmZmZicsXG4gICAgcnVsZXNDb2xvcjogJyNjMGMwYzAnXG4gIH1cblxuICAvKiog0J/QsNGA0LDQvNC10YLRgNGLINC+0LHQu9Cw0YHRgtC4INC/0YDQvtGB0LzQvtGC0YDQsC4gKi9cbiAgcHVibGljIGNhbWVyYTogU1Bsb3RDYW1lcmEgPSB7XG4gICAgeDogdGhpcy5ncmlkLndpZHRoISAvIDIsXG4gICAgeTogdGhpcy5ncmlkLmhlaWdodCEgLyAyLFxuICAgIHpvb206IDFcbiAgfVxuXG4gIC8qKiDQn9GA0LjQt9C90LDQuiDQvdC10L7QsdGF0L7QtNC40LzQvtGB0YLQuCDQt9Cw0LPRgNGD0LfQutC4INC00LDQvdC90YvRhSDQvtCxINC+0LHRitC10LrRgtCw0YUuICovXG4gIHB1YmxpYyBsb2FkRGF0YTogYm9vbGVhbiA9IHRydWVcblxuICAvKiog0J/RgNC40LfQvdCw0Log0L3QtdC+0LHRhdC+0LTQuNC80L7RgdGC0Lgg0LHQtdC30L7RgtC70LDQs9Cw0YLQtdC70YzQvdC+0LPQviDQt9Cw0L/Rg9GB0LrQsCDRgNC10L3QtNC10YDQsC4gKi9cbiAgcHVibGljIGlzUnVubmluZzogYm9vbGVhbiA9IGZhbHNlXG5cbiAgLyoqINCa0L7Qu9C40YfQtdGB0YLQstC+INGA0LDQt9C70LjRh9C90YvRhSDRhNC+0YDQvCDQvtCx0YrQtdC60YLQvtCyLiDQktGL0YfQuNGB0LvRj9C10YLRgdGPINC/0L7Qt9C20LUg0LIg0YXQtdC70L/QtdGA0LUgZ2xzbC4gKi9cbiAgcHVibGljIHNoYXBlc0NvdW50OiBudW1iZXIgfCB1bmRlZmluZWRcblxuICAvKiog0KHRgtCw0YLQuNGB0YLQuNGH0LXRgdC60LDRjyDQuNC90YTQvtGA0LzQsNGG0LjRjy4gKi9cbiAgcHVibGljIHN0YXRzID0ge1xuICAgIG9ialRvdGFsQ291bnQ6IDAsXG4gICAgb2JqSW5Hcm91cENvdW50OiBbXSxcbiAgICBncm91cHNDb3VudDogMCxcbiAgICBtZW1Vc2FnZTogMFxuICB9XG5cbiAgLyoqINCe0LHRitC10LrRgi3QutCw0L3QstCw0YEg0LrQvtC90YLQtdC60YHRgtCwINGA0LXQvdC00LXRgNC40L3Qs9CwIFdlYkdMLiAqL1xuICBwdWJsaWMgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudFxuXG4gIC8qKiDQndCw0YHRgtGA0L7QudC60LgsINC30LDQv9GA0L7RiNC10L3QvdGL0LUg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9C10Lwg0LIg0LrQvtC90YHRgtGA0YPQutGC0L7RgNC1INC40LvQuCDQv9GA0Lgg0L/QvtGB0LvQtdC00L3QtdC8INCy0YvQt9C+0LLQtSBzZXR1cC4gKi9cbiAgcHVibGljIGxhc3RSZXF1ZXN0ZWRPcHRpb25zOiBTUGxvdE9wdGlvbnMgfCB1bmRlZmluZWQgPSB7fVxuXG4gIC8qKiDQpdC10LvQv9C10YAg0LLQt9Cw0LjQvNC+0LTQtdC50YHRgtCy0LjRjyDRgSDRg9GB0YLRgNC+0LnRgdGC0LLQvtC8INCy0LLQvtC00LAuICovXG4gIHByb3RlY3RlZCBjb250cm9sOiBTUGxvdENvbnRvbCA9IG5ldyBTUGxvdENvbnRvbCh0aGlzKVxuXG4gIC8qKiDQn9GA0LjQt9C90LDQuiDRgtC+0LPQviwg0YfRgtC+INGN0LrQt9C10LzQv9C70Y/RgCDQutC70LDRgdGB0LAg0LHRi9C7INC60L7RgNGA0LXQutGC0L3QviDQv9C+0LTQs9C+0YLQvtCy0LvQtdC9INC6INGA0LXQvdC00LXRgNGDLiAqL1xuICBwcml2YXRlIGlzU2V0dXBlZDogYm9vbGVhbiA9IGZhbHNlXG5cbiAgcHVibGljIGFyZWEgPSB7XG4gICAgZ3JvdXBzOiBbXSBhcyBhbnlbXSxcbiAgICBkeFN0ZXA6IDAsXG4gICAgZHlTdGVwOiAwLFxuICAgIGR4Q291bnQ6IDAsXG4gICAgZHlDb3VudDogMFxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0KHQvtC30LTQsNC10YIg0Y3QutC30LXQvNC/0LvRj9GAINC60LvQsNGB0YHQsCwg0LjQvdC40YbQuNCw0LvQuNC30LjRgNGD0LXRgiDQvdCw0YHRgtGA0L7QudC60LggKNC10YHQu9C4INC/0LXRgNC10LTQsNC90YspLlxuICAgKlxuICAgKiBAcmVtYXJrc1xuICAgKiDQldGB0LvQuCDQutCw0L3QstCw0YEg0YEg0LfQsNC00LDQvdC90YvQvCDQuNC00LXQvdGC0LjRhNC40LrQsNGC0L7RgNC+0Lwg0L3QtSDQvdCw0LnQtNC10L0gLSDQs9C10L3QtdGA0LjRgNGD0LXRgtGB0Y8g0L7RiNC40LHQutCwLiDQndCw0YHRgtGA0L7QudC60Lgg0LzQvtCz0YPRgiDQsdGL0YLRjCDQt9Cw0LTQsNC90Ysg0LrQsNC6INCyXG4gICAqINC60L7QvdGB0YLRgNGD0LrRgtC+0YDQtSwg0YLQsNC6INC4INCyINC80LXRgtC+0LTQtSB7QGxpbmsgc2V0dXB9LiDQkiDQu9GO0LHQvtC8INGB0LvRg9GH0LDQtSDQvdCw0YHRgtGA0L7QudC60Lgg0LTQvtC70LbQvdGLINCx0YvRgtGMINC30LDQtNCw0L3RiyDQtNC+INC30LDQv9GD0YHQutCwINGA0LXQvdC00LXRgNCwLlxuICAgKlxuICAgKiBAcGFyYW0gY2FudmFzSWQgLSDQmNC00LXQvdGC0LjRhNC40LrQsNGC0L7RgCDQutCw0L3QstCw0YHQsCwg0L3QsCDQutC+0YLQvtGA0L7QvCDQsdGD0LTQtdGCINGA0LjRgdC+0LLQsNGC0YzRgdGPINCz0YDQsNGE0LjQui5cbiAgICogQHBhcmFtIG9wdGlvbnMgLSDQn9C+0LvRjNC30L7QstCw0YLQtdC70YzRgdC60LjQtSDQvdCw0YHRgtGA0L7QudC60Lgg0Y3QutC30LXQvNC/0LvRj9GA0LAuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihjYW52YXNJZDogc3RyaW5nLCBvcHRpb25zPzogU1Bsb3RPcHRpb25zKSB7XG5cbiAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY2FudmFzSWQpKSB7XG4gICAgICB0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNhbnZhc0lkKSBhcyBIVE1MQ2FudmFzRWxlbWVudFxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ9Ca0LDQvdCy0LDRgSDRgSDQuNC00LXQvdGC0LjRhNC40LrQsNGC0L7RgNC+0LwgXCIjJyArIGNhbnZhc0lkICsgJ1wiINC90LUg0L3QsNC50LTQtdC9IScpXG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMpIHtcblxuICAgICAgLyoqINCV0YHQu9C4INC/0LXRgNC10LTQsNC90Ysg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GM0YHQutC40LUg0L3QsNGB0YLRgNC+0LnQutC4LCDRgtC+INC+0L3QuCDQv9GA0LjQvNC10L3Rj9GO0YLRgdGPLiAqL1xuICAgICAgY29weU1hdGNoaW5nS2V5VmFsdWVzKHRoaXMsIG9wdGlvbnMpXG4gICAgICB0aGlzLmxhc3RSZXF1ZXN0ZWRPcHRpb25zID0gb3B0aW9uc1xuXG4gICAgICAvKiog0JjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y8g0LLRgdC10YUg0L/QsNGA0LDQvNC10YLRgNC+0LIg0YDQtdC90LTQtdGA0LAsINC10YHQu9C4INC30LDQv9GA0L7RiNC10L0g0YTQvtGA0YHQuNGA0L7QstCw0L3QvdGL0Lkg0LfQsNC/0YPRgdC6LiAqL1xuICAgICAgaWYgKHRoaXMuZm9yY2VSdW4pIHtcbiAgICAgICAgdGhpcy5zZXR1cChvcHRpb25zKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCY0L3QuNGG0LjQsNC70LjQt9C40YDRg9C10YIg0L3QtdC+0LHRhdC+0LTQuNC80YvQtSDQtNC70Y8g0YDQtdC90LTQtdGA0LAg0L/QsNGA0LDQvNC10YLRgNGLINGN0LrQt9C10LzQv9C70Y/RgNCwLCDQstGL0L/QvtC70L3Rj9C10YIg0L/QvtC00LPQvtGC0L7QstC60YMg0Lgg0LfQsNC/0L7Qu9C90LXQvdC40LUg0LHRg9GE0LXRgNC+0LIgV2ViR0wuXG4gICAqXG4gICAqIEBwYXJhbSBvcHRpb25zIC0g0J3QsNGB0YLRgNC+0LnQutC4INGN0LrQt9C10LzQv9C70Y/RgNCwLlxuICAgKi9cbiAgcHVibGljIHNldHVwKG9wdGlvbnM/OiBTUGxvdE9wdGlvbnMpOiB2b2lkIHtcblxuICAgIGlmICghb3B0aW9ucykgb3B0aW9ucyA9IHt9XG5cbiAgICAvKiog0J/RgNC40LzQtdC90LXQvdC40LUg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GM0YHQutC40YUg0L3QsNGB0YLRgNC+0LXQui4gKi9cbiAgICBjb3B5TWF0Y2hpbmdLZXlWYWx1ZXModGhpcywgb3B0aW9ucylcbiAgICB0aGlzLmxhc3RSZXF1ZXN0ZWRPcHRpb25zID0gb3B0aW9uc1xuXG4gICAgdGhpcy5kZWJ1Zy5sb2coJ2ludHJvJylcblxuICAgIC8qKiDQn9C+0LTQs9C+0YLQvtCy0LrQsCDQstGB0LXRhSDRhdC10LvQv9C10YDQvtCyLiDQn9C+0YHQu9C10LTQvtCy0LDRgtC10LvRjNC90L7RgdGC0Ywg0L/QvtC00LPQvtGC0L7QstC60Lgg0LjQvNC10LXRgiDQt9C90LDRh9C10L3QuNC1LiAqL1xuICAgIHRoaXMuZGVidWcuc2V0dXAoKVxuICAgIHRoaXMuZ2xzbC5zZXR1cCgpXG4gICAgdGhpcy53ZWJnbC5zZXR1cCgpXG4gICAgdGhpcy5jb250cm9sLnNldHVwKClcbiAgICB0aGlzLmRlbW8uc2V0dXAoKVxuXG4gICAgdGhpcy5kZWJ1Zy5sb2coJ2luc3RhbmNlJylcblxuICAgIC8qKiDQntCx0YDQsNCx0L7RgtC60LAg0LLRgdC10YUg0LTQsNC90L3Ri9GFINC+0LEg0L7QsdGK0LXQutGC0LDRhSDQuCDQuNGFINC30LDQs9GA0YPQt9C60LAg0LIg0LHRg9GE0LXRgNGLINCy0LjQtNC10L7Qv9Cw0LzRj9GC0LguICovXG4gICAgaWYgKHRoaXMubG9hZERhdGEpIHtcbiAgICAgIHRoaXMubG9hZCgpXG5cbiAgICAgIC8qKiDQn9C+INGD0LzQvtC70YfQsNC90LjRjiDQv9GA0Lgg0L/QvtCy0YLQvtGA0L3QvtC8INCy0YvQt9C+0LLQtSDQvNC10YLQvtC00LAgc2V0dXAg0L3QvtCy0L7QtSDRh9GC0LXQvdC40LUg0L7QsdGK0LXQutGC0L7QsiDQvdC1INC/0YDQvtC40LfQstC+0LTQuNGC0YHRjy4gKi9cbiAgICAgIHRoaXMubG9hZERhdGEgPSBmYWxzZVxuICAgIH1cblxuICAgIC8qKiDQlNC10LnRgdGC0LLQuNGPLCDQutC+0YLQvtGA0YvQtSDQstGL0L/QvtC70L3Rj9GO0YLRgdGPINGC0L7Qu9GM0LrQviDQv9GA0Lgg0L/QtdGA0LLQvtC8INCy0YvQt9C+0LLQtSDQvNC10YLQvtC00LAgc2V0dXAuICovXG4gICAgaWYgKCF0aGlzLmlzU2V0dXBlZCkge1xuXG4gICAgICAvKiog0KHQvtC30LTQsNC90LjQtSDQv9C10YDQtdC80LXQvdC90YvRhSBXZWJHbC4gKi9cbiAgICAgIHRoaXMud2ViZ2wuY3JlYXRlVmFyaWFibGVzKCdhX3Bvc2l0aW9uJywgJ2FfY29sb3InLCAnYV9zaXplJywgJ2Ffc2hhcGUnLCAndV9tYXRyaXgnKVxuXG4gICAgICAvKiog0J/RgNC40LfQvdCw0Log0YLQvtCz0L4sINGH0YLQviDRjdC60LfQtdC80L/Qu9GP0YAg0LrQsNC6INC80LjQvdC40LzRg9C8INC+0LTQuNC9INGA0LDQtyDQstGL0L/QvtC70L3QuNC7INC80LXRgtC+0LQgc2V0dXAuICovXG4gICAgICB0aGlzLmlzU2V0dXBlZCA9IHRydWVcbiAgICB9XG5cbiAgICAvKiog0J/RgNC+0LLQtdGA0LrQsCDQutC+0YDRgNC10LrRgtC90L7RgdGC0Lgg0L3QsNGB0YLRgNC+0LnQutC4INGN0LrQt9C10LzQv9C70Y/RgNCwLiAqL1xuICAgIHRoaXMuY2hlY2tTZXR1cCgpXG5cbiAgICBpZiAodGhpcy5mb3JjZVJ1bikge1xuICAgICAgLyoqINCk0L7RgNGB0LjRgNC+0LLQsNC90L3Ri9C5INC30LDQv9GD0YHQuiDRgNC10L3QtNC10YDQuNC90LPQsCAo0LXRgdC70Lgg0YLRgNC10LHRg9C10YLRgdGPKS4gKi9cbiAgICAgIHRoaXMucnVuKClcbiAgICB9XG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQodC+0LfQtNCw0LXRgiDQuCDQt9Cw0L/QvtC70L3Rj9C10YIg0LTQsNC90L3Ri9C80Lgg0L7QsdC+INCy0YHQtdGFINC+0LHRitC10LrRgtCw0YUg0LHRg9GE0LXRgNGLIFdlYkdMLlxuICAgKi9cbiAgcHJvdGVjdGVkIGxvYWQoKTogdm9pZCB7XG5cbiAgICB0aGlzLmRlYnVnLmxvZygnbG9hZGluZycpXG5cbiAgICB0aGlzLnN0YXRzID0geyBvYmpUb3RhbENvdW50OiAwLCBvYmpJbkdyb3VwQ291bnQ6IFtdLCBncm91cHNDb3VudDogMCwgbWVtVXNhZ2U6IDAgfVxuXG4gICAgbGV0IGR4LCBkeSwgZHogPSAwXG4gICAgbGV0IG9iamVjdDogU1Bsb3RPYmplY3QgfCBudWxsXG4gICAgbGV0IGlzT2JqZWN0RW5kczogYm9vbGVhbiA9IGZhbHNlXG5cbiAgICB0aGlzLmFyZWEuZHhTdGVwID0gMjUwLjAwMVxuICAgIHRoaXMuYXJlYS5keVN0ZXAgPSAyNTAuMDAxXG4gICAgdGhpcy5hcmVhLmR4Q291bnQgPSBNYXRoLnRydW5jKHRoaXMuZ3JpZC53aWR0aCEgLyB0aGlzLmFyZWEuZHhTdGVwKSArIDFcbiAgICB0aGlzLmFyZWEuZHlDb3VudCA9IE1hdGgudHJ1bmModGhpcy5ncmlkLmhlaWdodCEgLyB0aGlzLmFyZWEuZHlTdGVwKSArIDFcblxuICAgIGxldCBncm91cHM6IGFueVtdID0gW11cblxuICAgIGZvciAobGV0IGR4ID0gMDsgZHggPCB0aGlzLmFyZWEuZHhDb3VudDsgZHgrKykge1xuICAgICAgZ3JvdXBzW2R4XSA9IFtdXG4gICAgICBmb3IgKGxldCBkeSA9IDA7IGR5IDwgdGhpcy5hcmVhLmR5Q291bnQ7IGR5KyspIHtcbiAgICAgICAgZ3JvdXBzW2R4XVtkeV0gPSBbXVxuICAgICAgfVxuICAgIH1cblxuICAgIHdoaWxlICghaXNPYmplY3RFbmRzKSB7XG5cbiAgICAgIG9iamVjdCA9IHRoaXMuaXRlcmF0b3IhKClcblxuICAgICAgLyoqINCe0LHRitC10LrRgtGLINC30LDQutC+0L3Rh9C40LvQuNGB0YwsINC10YHQu9C4INC40YLQtdGA0LDRgtC+0YAg0LLQtdGA0L3Rg9C7IG51bGwg0LjQu9C4INC10YHQu9C4INC00L7RgdGC0LjQs9C90YPRgiDQu9C40LzQuNGCINGH0LjRgdC70LAg0L7QsdGK0LXQutGC0L7Qsi4gKi9cbiAgICAgIGlzT2JqZWN0RW5kcyA9IChvYmplY3QgPT09IG51bGwpIHx8ICh0aGlzLnN0YXRzLm9ialRvdGFsQ291bnQgPj0gdGhpcy5nbG9iYWxMaW1pdClcblxuICAgICAgaWYgKCFpc09iamVjdEVuZHMpIHtcblxuICAgICAgICBvYmplY3QgPSB0aGlzLmNoZWNrT2JqZWN0KG9iamVjdCEpXG5cbiAgICAgICAgZHggPSBNYXRoLnRydW5jKG9iamVjdC54IC8gdGhpcy5hcmVhLmR4U3RlcClcbiAgICAgICAgZHkgPSBNYXRoLnRydW5jKG9iamVjdC55IC8gdGhpcy5hcmVhLmR5U3RlcClcblxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShncm91cHNbZHhdW2R5XVtkel0pKSB7XG4gICAgICAgICAgZHogPSBncm91cHNbZHhdW2R5XS5sZW5ndGggLSAxXG4gICAgICAgICAgaWYgKGdyb3Vwc1tkeF1bZHldW2R6XVsxXS5sZW5ndGggPj0gdGhpcy5ncm91cExpbWl0KSB7XG4gICAgICAgICAgICBkeisrXG4gICAgICAgICAgICBncm91cHNbZHhdW2R5XVtkel0gPSBbXVxuICAgICAgICAgICAgZ3JvdXBzW2R4XVtkeV1bZHpdWzBdID0gW10gICAgLy8g0JzQsNGB0YHQuNCyINCy0LXRgNGI0LjQvVxuICAgICAgICAgICAgZ3JvdXBzW2R4XVtkeV1bZHpdWzFdID0gW10gICAgLy8g0JzQsNGB0YHQuNCyINGE0L7RgNC8XG4gICAgICAgICAgICBncm91cHNbZHhdW2R5XVtkel1bMl0gPSBbXSAgICAvLyDQnNCw0YHRgdC40LIg0YbQstC10YLQvtCyXG4gICAgICAgICAgICBncm91cHNbZHhdW2R5XVtkel1bM10gPSBbXSAgICAvLyDQnNCw0YHRgdC40LIg0YDQsNC30LzQtdGA0L7QslxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkeiA9IDBcbiAgICAgICAgICBncm91cHNbZHhdW2R5XVtkel0gPSBbXVxuICAgICAgICAgIGdyb3Vwc1tkeF1bZHldW2R6XVswXSA9IFtdICAgIC8vINCc0LDRgdGB0LjQsiDQstC10YDRiNC40L1cbiAgICAgICAgICBncm91cHNbZHhdW2R5XVtkel1bMV0gPSBbXSAgICAvLyDQnNCw0YHRgdC40LIg0YTQvtGA0LxcbiAgICAgICAgICBncm91cHNbZHhdW2R5XVtkel1bMl0gPSBbXSAgICAvLyDQnNCw0YHRgdC40LIg0YbQstC10YLQvtCyXG4gICAgICAgICAgZ3JvdXBzW2R4XVtkeV1bZHpdWzNdID0gW10gICAgLy8g0JzQsNGB0YHQuNCyINGA0LDQt9C80LXRgNC+0LJcbiAgICAgICAgfVxuXG4gICAgICAgIGdyb3Vwc1tkeF1bZHldW2R6XVswXS5wdXNoKG9iamVjdC54LCBvYmplY3QueSlcbiAgICAgICAgZ3JvdXBzW2R4XVtkeV1bZHpdWzFdLnB1c2gob2JqZWN0LnNoYXBlKVxuICAgICAgICBncm91cHNbZHhdW2R5XVtkel1bMl0ucHVzaChvYmplY3QuY29sb3IpXG4gICAgICAgIGdyb3Vwc1tkeF1bZHldW2R6XVszXS5wdXNoKG9iamVjdC5zaXplKVxuXG4gICAgICAgIHRoaXMuc3RhdHMub2JqVG90YWxDb3VudCsrXG4gICAgICB9XG5cbiAgICAgIC8vIGlmICgoY291bnQgPj0gdGhpcy5ncm91cExpbWl0KSB8fCBpc09iamVjdEVuZHMpIHtcbiAgICAgIC8vICAgKHRoaXMuc3RhdHMub2JqSW5Hcm91cENvdW50W2R4XVtkeV1bdGhpcy5zdGF0cy5ncm91cHNDb3VudF0gYXMgYW55KSA9IGNvdW50XG4gICAgICAvLyB9XG5cbiAgICAgIC8vIGlmICgoY291bnQgPj0gdGhpcy5ncm91cExpbWl0KSAmJiAhaXNPYmplY3RFbmRzKSB7XG4gICAgICAvLyAgIHRoaXMuc3RhdHMuZ3JvdXBzQ291bnQrK1xuICAgICAgLy8gICBjb3VudCA9IDBcbiAgICAgIC8vICAgZHorK1xuICAgICAgLy8gICBncm91cHNbMF1bMF1bZHpdID0gW11cbiAgICAgIC8vIH1cbiAgICB9XG5cbiAgICB0aGlzLmFyZWEuZ3JvdXBzID0gZ3JvdXBzXG5cbiAgICB0aGlzLndlYmdsLmNsZWFyRGF0YSgpXG5cbiAgICAvKiog0JjRgtC10YDQuNGA0L7QstCw0L3QuNC1INC4INC30LDQvdC10YHQtdC90LjQtSDQtNCw0L3QvdGL0YUg0LIg0LHRg9GE0LXRgNGLIFdlYkdMLiAqL1xuICAgIGZvciAobGV0IGR4ID0gMDsgZHggPCB0aGlzLmFyZWEuZHhDb3VudDsgZHgrKykge1xuICAgICAgZm9yIChsZXQgZHkgPSAwOyBkeSA8IHRoaXMuYXJlYS5keUNvdW50OyBkeSsrKSB7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGdyb3Vwc1tkeF1bZHldKSkge1xuICAgICAgICAgIGZvciAobGV0IGR6ID0gMDsgZHogPCBncm91cHNbZHhdW2R5XS5sZW5ndGg7IGR6KyspIHtcblxuICAgICAgICAgICAgdGhpcy53ZWJnbC5jcmVhdGVCdWZmZXIoZHgsIGR5LCBkeiwgMCwgbmV3IEZsb2F0MzJBcnJheShncm91cHNbZHhdW2R5XVtkel1bMF0pKVxuICAgICAgICAgICAgdGhpcy53ZWJnbC5jcmVhdGVCdWZmZXIoZHgsIGR5LCBkeiwgMSwgbmV3IFVpbnQ4QXJyYXkoZ3JvdXBzW2R4XVtkeV1bZHpdWzFdKSlcbiAgICAgICAgICAgIHRoaXMud2ViZ2wuY3JlYXRlQnVmZmVyKGR4LCBkeSwgZHosIDIsIG5ldyBVaW50OEFycmF5KGdyb3Vwc1tkeF1bZHldW2R6XVsyXSkpXG4gICAgICAgICAgICB0aGlzLndlYmdsLmNyZWF0ZUJ1ZmZlcihkeCwgZHksIGR6LCAzLCBuZXcgRmxvYXQzMkFycmF5KGdyb3Vwc1tkeF1bZHldW2R6XVszXSkpXG5cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmRlYnVnLmxvZygnbG9hZGVkJylcbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCf0YDQvtCy0LXRgNGP0LXRgiDQutC+0YDRgNC10LrRgtC90L7RgdGC0Ywg0L/QsNGA0LDQvNC10YLRgNC+0LIg0L7QsdGK0LXQutGC0LAg0Lgg0LIg0YHQu9GD0YfQsNC1INC90LXQvtCx0YXQvtC00LjQvNC+0YHRgtC4INCy0L3QvtGB0LjRgiDQsiDQvdC40YUg0LjQt9C80LXQvdC10L3QuNGPLlxuICAgKi9cbiAgY2hlY2tPYmplY3Qob2JqZWN0OiBTUGxvdE9iamVjdCk6IFNQbG90T2JqZWN0IHtcblxuICAgIC8qKiDQn9GA0L7QstC10YDQutCwINC60L7RgNGA0LXQutGC0L3QvtGB0YLQuCDRgNCw0YHQv9C+0LvQvtC20LXQvdC40Y8g0L7QsdGK0LXQutGC0LAuICovXG4gICAgaWYgKG9iamVjdC54ID4gdGhpcy5ncmlkLndpZHRoISkgb2JqZWN0LnggPSB0aGlzLmdyaWQud2lkdGghXG4gICAgaWYgKG9iamVjdC55ID4gdGhpcy5ncmlkLmhlaWdodCEpIG9iamVjdC55ID0gdGhpcy5ncmlkLmhlaWdodCFcbiAgICBpZiAob2JqZWN0LnggPCAwKSBvYmplY3QueCA9IDBcbiAgICBpZiAob2JqZWN0LnkgPCAwKSBvYmplY3QueSA9IDBcblxuICAgIC8qKiDQn9GA0L7QstC10YDQutCwINC60L7RgNGA0LXQutGC0L3QvtGB0YLQuCDRhNC+0YDQvNGLINC4INGG0LLQtdGC0LAg0L7QsdGK0LXQutGC0LAg0L7QsdGK0LXQutGC0LAuICovXG4gICAgaWYgKChvYmplY3Quc2hhcGUgPj0gdGhpcy5zaGFwZXNDb3VudCEpIHx8IChvYmplY3Quc2hhcGUgPCAwKSkgb2JqZWN0LnNoYXBlID0gMFxuICAgIGlmICgob2JqZWN0LmNvbG9yID49IHRoaXMuY29sb3JzLmxlbmd0aCkgfHwgKG9iamVjdC5jb2xvciA8IDApKSBvYmplY3QuY29sb3IgPSAwXG5cbiAgICByZXR1cm4gb2JqZWN0XG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQn9GA0L7QuNC30LLQvtC00LjRgiDRgNC10L3QtNC10YDQuNC90LMg0LPRgNCw0YTQuNC60LAg0LIg0YHQvtC+0YLQstC10YLRgdGC0LLQuNC4INGBINGC0LXQutGD0YnQuNC80Lgg0L/QsNGA0LDQvNC10YLRgNCw0LzQuCDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuC5cbiAgICovXG4gIHB1YmxpYyByZW5kZXIoKTogdm9pZCB7XG5cbiAgICAvKiog0J7Rh9C40YHRgtC60LAg0L7QsdGK0LXQutGC0LAg0YDQtdC90LTQtdGA0LjQvdCz0LAgV2ViR0wuICovXG4gICAgdGhpcy53ZWJnbC5jbGVhckJhY2tncm91bmQoKVxuXG4gICAgLyoqINCe0LHQvdC+0LLQu9C10L3QuNC1INC80LDRgtGA0LjRhtGLINGC0YDQsNC90YHRhNC+0YDQvNCw0YbQuNC4LiAqL1xuICAgIHRoaXMuY29udHJvbC51cGRhdGVWaWV3UHJvamVjdGlvbigpXG5cbiAgICAvKiog0J/RgNC40LLRj9C30LrQsCDQvNCw0YLRgNC40YbRiyDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuCDQuiDQv9C10YDQtdC80LXQvdC90L7QuSDRiNC10LnQtNC10YDQsC4gKi9cbiAgICB0aGlzLndlYmdsLnNldFZhcmlhYmxlKCd1X21hdHJpeCcsIHRoaXMuY29udHJvbC50cmFuc2Zvcm0udmlld1Byb2plY3Rpb25NYXQpXG5cbiAgICAvKiog0JjRgtC10YDQuNGA0L7QstCw0L3QuNC1INC4INGA0LXQvdC00LXRgNC40L3QsyDQs9GA0YPQv9C/INCx0YPRhNC10YDQvtCyIFdlYkdMLiAqL1xuICAgIGZvciAobGV0IGR4ID0gMDsgZHggPCB0aGlzLmFyZWEuZHhDb3VudDsgZHgrKykge1xuICAgICAgZm9yIChsZXQgZHkgPSAwOyBkeSA8IHRoaXMuYXJlYS5keUNvdW50OyBkeSsrKSB7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHRoaXMuYXJlYS5ncm91cHNbZHhdW2R5XSkpIHtcbiAgICAgICAgICBmb3IgKGxldCBkeiA9IDA7IGR6IDwgdGhpcy5hcmVhLmdyb3Vwc1tkeF1bZHldLmxlbmd0aDsgZHorKykge1xuXG4gICAgICAgICAgICB0aGlzLndlYmdsLnNldEJ1ZmZlcihkeCwgZHksIGR6LCAwLCAnYV9wb3NpdGlvbicsIDIsIDAsIDApXG4gICAgICAgICAgICB0aGlzLndlYmdsLnNldEJ1ZmZlcihkeCwgZHksIGR6LCAxLCAnYV9zaGFwZScsIDEsIDAsIDApXG4gICAgICAgICAgICB0aGlzLndlYmdsLnNldEJ1ZmZlcihkeCwgZHksIGR6LCAyLCAnYV9jb2xvcicsIDEsIDAsIDApXG4gICAgICAgICAgICB0aGlzLndlYmdsLnNldEJ1ZmZlcihkeCwgZHksIGR6LCAzLCAnYV9zaXplJywgMSwgMCwgMClcblxuICAgICAgICAgICAgdGhpcy53ZWJnbC5kcmF3UG9pbnRzKDAsIHRoaXMuYXJlYS5ncm91cHNbZHhdW2R5XVtkel1bMV0ubGVuZ3RoKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCf0YDQvtCy0LXRgNGP0LXRgiDQutC+0YDRgNC10LrRgtC90L7RgdGC0Ywg0L3QsNGB0YLRgNC+0LXQuiDRjdC60LfQtdC80L/Qu9GP0YDQsC5cbiAgICpcbiAgICogQHJlbWFya3NcbiAgICog0JjRgdC/0L7Qu9GM0LfRg9C10YLRgdGPINC00LvRjyDQv9GA0L7QstC10YDQutC4INC60L7RgNGA0LXQutGC0L3QvtGB0YLQuCDQu9C+0LPQuNC60Lgg0YDQsNCx0L7RgtGLINC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjyDRgSDRjdC60LfQtdC80L/Qu9GP0YDQvtC8LiDQndC1INC/0L7Qt9Cy0L7Qu9GP0LXRgiDRgNCw0LHQvtGC0LDRgtGMINGBXG4gICAqINC90LXQvdCw0YHRgtGA0L7QtdC90L3Ri9C8INC40LvQuCDQvdC10LrQvtGA0YDQtdC60YLQvdC+INC90LDRgdGC0YDQvtC10L3QvdGL0Lwg0Y3QutC30LXQvNC/0LvRj9GA0L7QvC5cbiAgICovXG4gIGNoZWNrU2V0dXAoKSB7XG5cbiAgICAvKipcbiAgICAgKiAg0J/QvtC70YzQt9C+0LLQsNGC0LXQu9GMINC80L7QsyDQvdCw0YHRgtGA0L7QuNGC0Ywg0Y3QutC30LXQvNC/0LvRj9GAINCyINC60L7QvdGB0YLRgNGD0LrRgtC+0YDQtSDQuCDRgdGA0LDQt9GDINC30LDQv9GD0YHRgtC40YLRjCDRgNC10L3QtNC10YAsINCyINGC0LDQutC+0Lwg0YHQu9GD0YfQsNC1INC80LXRgtC+0LQgc2V0dXBcbiAgICAgKiAg0LHRg9C00LXRgiDQstGL0LfRi9Cy0LDQtdGC0YHRjyDQvdC10Y/QstC90L4uXG4gICAgICovXG4gICAgaWYgKCF0aGlzLmlzU2V0dXBlZCkge1xuICAgICAgdGhpcy5zZXR1cCgpXG4gICAgfVxuXG4gICAgLyoqINCd0LDQsdC+0YAg0L/RgNC+0LLQtdGA0L7QuiDQutC+0YDRgNC10LrRgtC90L7RgdGC0Lgg0L3QsNGB0YLRgNC+0LnQutC4INGN0LrQt9C10LzQv9C70Y/RgNCwLiAqL1xuICAgIGlmICghdGhpcy5pdGVyYXRvcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCfQndC1INC30LDQtNCw0L3QsCDRhNGD0L3QutGG0LjRjyDQuNGC0LXRgNC40YDQvtCy0LDQvdC40Y8g0L7QsdGK0LXQutGC0L7QsiEnKVxuICAgIH1cbiAgfVxuXG4gIC8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqINCX0LDQv9GD0YHQutCw0LXRgiDRgNC10L3QtNC10YDQuNC90LMg0Lgg0LrQvtC90YLRgNC+0LvRjCDRg9C/0YDQsNCy0LvQtdC90LjRjy5cbiAgICovXG4gIHB1YmxpYyBydW4oKTogdm9pZCB7XG5cbiAgICB0aGlzLmNoZWNrU2V0dXAoKVxuXG4gICAgaWYgKCF0aGlzLmlzUnVubmluZykge1xuICAgICAgdGhpcy5yZW5kZXIoKVxuICAgICAgdGhpcy5jb250cm9sLnJ1bigpXG4gICAgICB0aGlzLmlzUnVubmluZyA9IHRydWVcbiAgICAgIHRoaXMuZGVidWcubG9nKCdzdGFydGVkJylcbiAgICB9XG4gIH1cblxuICAvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiDQntGB0YLQsNC90LDQstC70LjQstCw0LXRgiDRgNC10L3QtNC10YDQuNC90LMg0Lgg0LrQvtC90YLRgNC+0LvRjCDRg9C/0YDQsNCy0LvQtdC90LjRjy5cbiAgICovXG4gIHB1YmxpYyBzdG9wKCk6IHZvaWQge1xuXG4gICAgdGhpcy5jaGVja1NldHVwKClcblxuICAgIGlmICh0aGlzLmlzUnVubmluZykge1xuICAgICAgdGhpcy5jb250cm9sLnN0b3AoKVxuICAgICAgdGhpcy5pc1J1bm5pbmcgPSBmYWxzZVxuICAgICAgdGhpcy5kZWJ1Zy5sb2coJ3N0b3BlZCcpXG4gICAgfVxuICB9XG5cbiAgLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICog0J7Rh9C40YnQsNC10YIg0YTQvtC9LlxuICAgKi9cbiAgcHVibGljIGNsZWFyKCk6IHZvaWQge1xuXG4gICAgdGhpcy5jaGVja1NldHVwKClcblxuICAgIHRoaXMud2ViZ2wuY2xlYXJCYWNrZ3JvdW5kKClcbiAgICB0aGlzLmRlYnVnLmxvZygnY2xlYXJlZCcpXG4gIH1cbn1cbiIsIlxuLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqXG4gKiDQn9GA0L7QstC10YDRj9C10YIg0Y/QstC70Y/QtdGC0YHRjyDQu9C4INC/0LXRgNC10LzQtdC90L3QsNGPINGN0LrQt9C10LzQv9C70Y/RgNC+0Lwg0LrQsNC60L7Qs9C+LdC70LjQsdC+0L4g0LrQu9Cw0YHRgdCwLlxuICpcbiAqIEBwYXJhbSB2YXJpYWJsZSAtINCf0YDQvtCy0LXRgNGP0LXQvNCw0Y8g0L/QtdGA0LXQvNC10L3QvdCw0Y8uXG4gKiBAcmV0dXJucyDQoNC10LfRg9C70YzRgtCw0YIg0L/RgNC+0LLQtdGA0LrQuC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzT2JqZWN0KHZhcmlhYmxlOiBhbnkpOiBib29sZWFuIHtcbiAgcmV0dXJuIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFyaWFibGUpID09PSAnW29iamVjdCBPYmplY3RdJylcbn1cblxuLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqXG4gKiDQn9C10YDQtdC+0L/RgNC10LTQtdC70Y/QtdGCINC30L3QsNGH0LXQvdC40Y8g0L/QvtC70LXQuSDQvtCx0YrQtdC60YLQsCB0YXJnZXQg0L3QsCDQt9C90LDRh9C10L3QuNGPINC/0L7Qu9C10Lkg0L7QsdGK0LXQutGC0LAgc291cmNlLlxuICpcbiAqIEByZW1hcmtzXG4gKiDQn9C10YDQtdC+0L/RgNC10LTQtdC70Y/RjtGC0YHRjyDRgtC+0LvRjNC60L4g0YLQtSDQv9C+0LvRjywg0LrQvtGC0L7RgNGL0LUg0YHRg9GJ0LXRgdGC0LLRg9C10Y7RgiDQsiB0YXJnZXQuINCV0YHQu9C4INCyIHNvdXJjZSDQtdGB0YLRjCDQv9C+0LvRjywg0LrQvtGC0L7RgNGL0YUg0L3QtdGCINCyIHRhcmdldCwg0YLQviDQvtC90LhcbiAqINC40LPQvdC+0YDQuNGA0YPRjtGC0YHRjy4g0JXRgdC70Lgg0LrQsNC60LjQtS3RgtC+INC/0L7Qu9GPINGB0LDQvNC4INGP0LLQu9GP0Y7RgtGB0Y8g0Y/QstC70Y/RjtGC0YHRjyDQvtCx0YrQtdC60YLQsNC80LgsINGC0L4g0YLQviDQvtC90Lgg0YLQsNC60LbQtSDRgNC10LrRg9GA0YHQuNCy0L3QviDQutC+0L/QuNGA0YPRjtGC0YHRjyAo0L/RgNC4INGC0L7QvCDQttC1XG4gKiDRg9GB0LvQvtCy0LjQuCwg0YfRgtC+INCyINGG0LXQu9C10LLQvtC8INC+0LHRitC10LrRgtC1INGB0YPRidC10YHRgtCy0YPRjtGCINC/0L7Qu9GPINC+0LHRitC10LrRgtCwLdC40YHRgtC+0YfQvdC40LrQsCkuXG4gKlxuICogQHBhcmFtIHRhcmdldCAtINCm0LXQu9C10LLQvtC5ICjQuNC30LzQtdC90Y/QtdC80YvQuSkg0L7QsdGK0LXQutGCLlxuICogQHBhcmFtIHNvdXJjZSAtINCe0LHRitC10LrRgiDRgSDQtNCw0L3QvdGL0LzQuCwg0LrQvtGC0L7RgNGL0LUg0L3Rg9C20L3QviDRg9GB0YLQsNC90L7QstC40YLRjCDRgyDRhtC10LvQtdCy0L7Qs9C+INC+0LHRitC10LrRgtCwLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY29weU1hdGNoaW5nS2V5VmFsdWVzKHRhcmdldDogYW55LCBzb3VyY2U6IGFueSk6IHZvaWQge1xuICBPYmplY3Qua2V5cyhzb3VyY2UpLmZvckVhY2goa2V5ID0+IHtcbiAgICBpZiAoa2V5IGluIHRhcmdldCkge1xuICAgICAgaWYgKGlzT2JqZWN0KHNvdXJjZVtrZXldKSkge1xuICAgICAgICBpZiAoaXNPYmplY3QodGFyZ2V0W2tleV0pKSB7XG4gICAgICAgICAgY29weU1hdGNoaW5nS2V5VmFsdWVzKHRhcmdldFtrZXldLCBzb3VyY2Vba2V5XSlcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCFpc09iamVjdCh0YXJnZXRba2V5XSkgJiYgKHR5cGVvZiB0YXJnZXRba2V5XSAhPT0gJ2Z1bmN0aW9uJykpIHtcbiAgICAgICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pXG59XG5cbi8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKlxuICog0JLQvtC30LLRgNCw0YnQsNC10YIg0YHQu9GD0YfQsNC50L3QvtC1INGG0LXQu9C+0LUg0YfQuNGB0LvQviDQsiDQtNC40LDQv9Cw0LfQvtC90LU6IFswLi4ucmFuZ2UtMV0uXG4gKlxuICogQHBhcmFtIHJhbmdlIC0g0JLQtdGA0YXQvdC40Lkg0L/RgNC10LTQtdC7INC00LjQsNC/0LDQt9C+0L3QsCDRgdC70YPRh9Cw0LnQvdC+0LPQviDQstGL0LHQvtGA0LAuXG4gKiBAcmV0dXJucyDQodC70YPRh9Cw0LnQvdC+0LUg0YfQuNGB0LvQvi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJhbmRvbUludChyYW5nZTogbnVtYmVyKTogbnVtYmVyIHtcbiAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHJhbmdlKVxufVxuXG4vKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICpcbiAqINCa0L7QvdCy0LXRgNGC0LjRgNGD0LXRgiDRhtCy0LXRgiDQuNC3IEhFWC3RhNC+0YDQvNCw0YLQsCDQsiBHTFNMLdGE0L7RgNC80LDRgi5cbiAqXG4gKiBAcGFyYW0gaGV4Q29sb3IgLSDQptCy0LXRgiDQsiBIRVgt0YTQvtGA0LzQsNGC0LUgKFwiI2ZmZmZmZlwiKS5cbiAqIEByZXR1cm5zINCc0LDRgdGB0LjQsiDQuNC3INGC0YDQtdGFINGH0LjRgdC10Lsg0LIg0LTQuNCw0L/QsNC30L7QvdC1INC+0YIgMCDQtNC+IDEuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb2xvckZyb21IZXhUb0dsUmdiKGhleENvbG9yOiBzdHJpbmcpOiBudW1iZXJbXSB7XG4gIGxldCBrID0gL14jPyhbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KSQvaS5leGVjKGhleENvbG9yKVxuICBsZXQgW3IsIGcsIGJdID0gW3BhcnNlSW50KGshWzFdLCAxNikgLyAyNTUsIHBhcnNlSW50KGshWzJdLCAxNikgLyAyNTUsIHBhcnNlSW50KGshWzNdLCAxNikgLyAyNTVdXG4gIHJldHVybiBbciwgZywgYl1cbn1cblxuLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqXG4gKiDQktC+0LfQstGA0LDRidCw0LXRgiDRgdGC0YDQvtC60L7QstGD0Y4g0LfQsNC/0LjRgdGMINGC0LXQutGD0YnQtdCz0L4g0LLRgNC10LzQtdC90LguXG4gKlxuICogQHJldHVybnMg0KHRgtGA0L7QutCwINCy0YDQtdC80LXQvdC4INCyINGE0L7RgNC80LDRgtC1IFwiaGg6bW06c3NcIi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEN1cnJlbnRUaW1lKCk6IHN0cmluZyB7XG5cbiAgbGV0IHRvZGF5ID0gbmV3IERhdGUoKVxuXG4gIHJldHVybiBbXG4gICAgdG9kYXkuZ2V0SG91cnMoKS50b1N0cmluZygpLnBhZFN0YXJ0KDIsICcwJyksXG4gICAgdG9kYXkuZ2V0TWludXRlcygpLnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgJzAnKSxcbiAgICB0b2RheS5nZXRTZWNvbmRzKCkudG9TdHJpbmcoKS5wYWRTdGFydCgyLCAnMCcpXG4gIF0uam9pbignOicpXG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IFNQbG90IGZyb20gJ0Avc3Bsb3QnXG5pbXBvcnQgJ0Avc3R5bGUnXG5cbi8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5cbmxldCBuID0gMV8wMDBfMDAwXG5sZXQgY29sb3JzID0gWycjRDgxQzAxJywgJyNFOTk2N0EnLCAnI0JBNTVEMycsICcjRkZENzAwJywgJyNGRkU0QjUnLCAnI0ZGOEMwMCcsICcjMjI4QjIyJywgJyM5MEVFOTAnLCAnIzQxNjlFMScsICcjMDBCRkZGJywgJyM4QjQ1MTMnLCAnIzAwQ0VEMSddXG5sZXQgd2lkdGggPSAzMl8wMDBcbmxldCBoZWlnaHQgPSAxNl8wMDBcblxuLyoqINCh0LjQvdGC0LXRgtC40YfQtdGB0LrQsNGPINC40YLQtdGA0LjRgNGD0Y7RidCw0Y8g0YTRg9C90LrRhtC40Y8uICovXG5sZXQgaSA9IDBcbmZ1bmN0aW9uIHJlYWROZXh0T2JqZWN0KCkge1xuICBpZiAoaSA8IG4pIHtcbiAgICBpKytcbiAgICByZXR1cm4ge1xuICAgICAgeDogcmFuZG9tSW50KHdpZHRoKSxcbiAgICAgIHk6IHJhbmRvbUludChoZWlnaHQpLFxuICAgICAgc2hhcGU6IHJhbmRvbUludCg1KSxcbiAgICAgIHNpemU6IDEwICsgcmFuZG9tSW50KDIxKSxcbiAgICAgIGNvbG9yOiByYW5kb21JbnQoY29sb3JzLmxlbmd0aClcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaSA9IDBcbiAgICByZXR1cm4gbnVsbCAgLy8g0JLQvtC30LLRgNCw0YnQsNC10LwgbnVsbCwg0LrQvtCz0LTQsCDQvtCx0YrQtdC60YLRiyBcItC30LDQutC+0L3Rh9C40LvQuNGB0YxcIi5cbiAgfVxufVxuXG5mdW5jdGlvbiByYW5kb21JbnQocmFuZ2UpIHtcbiAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHJhbmdlKVxufVxuXG4vKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuXG5sZXQgc2NhdHRlclBsb3QgPSBuZXcgU1Bsb3QoJ2NhbnZhczEnKVxuXG5zY2F0dGVyUGxvdC5zZXR1cCh7XG4gIGl0ZXJhdG9yOiByZWFkTmV4dE9iamVjdCxcbiAgY29sb3JzOiBjb2xvcnMsXG4gIGdyaWQ6IHtcbiAgICB3aWR0aDogd2lkdGgsXG4gICAgaGVpZ2h0OiBoZWlnaHRcbiAgfSxcbiAgZGVidWc6IHtcbiAgICBpc0VuYWJsZTogdHJ1ZSxcbiAgfSxcbiAgZGVtbzoge1xuICAgIGlzRW5hYmxlOiBmYWxzZVxuICB9LFxuICB3ZWJnbDoge1xuICAgIGZhaWxJZk1ham9yUGVyZm9ybWFuY2VDYXZlYXQ6IHRydWVcbiAgfVxufSlcblxuc2NhdHRlclBsb3QucnVuKClcbiJdLCJzb3VyY2VSb290IjoiIn0=