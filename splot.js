/**
 *
 * Модуль, описывающий класс SPlot (S[catter]Plot, S[uper]Plot).
 * Класс использует высокопроизводительные графические средства WebGL с целью
 * отображения на графике типа скаттерплот максимально возмоожного количества
 * объектов (миллионы и десятки миллионов).
 *
 * @author Aydar Akhmetov <aydarkin@gmail.com>
 * @version 1.0.0
 * 09.05.2021
 *
 */

'use strict';

/**
 * Тип - Настройки экземпляра класса SPlot.
 *
 * @typedef {Object} SPlotOptions
 *
 * @property {function(): SPlotPolygonInfo} iterationCallback Функция итерирования
 *     исходных объектов. Каждый вызов должен возвращать информацию об очередном
 *     исходном объекте в виде структуры типа SplotPolygonInfo (координаты, форму
 *     и цвет полигона, соответствующие проитерированному объекту). Когда исходные
 *     объекты закончатся функция должна вернуть null. Этот параметр класса является
 *     единственным обязательным (при условии выключенного режима демо-данных).
 * @property {Array.<string>} polygonPalette Цветовая палитра полигонов. Задается
 *     массивом, каждый элемент которого является строкой с HEX-кодом цвета.
 * @property {SPlotGridSize} gridSize Размер координатной плоскости в пикселях.
 * @property {number} polygonSize Размер полигона на координатной плоскости в пикселях
 *     (сторона для квадрата, диаметр для круга и т.п.)
 * @property {number} circleApproxLevel Степень детализации круга - количество углов
 *     полигона, апроксимирующего окружность круга.
 * @property {SPlotDebugMode} debugMode Параметры режима отладки приложения.
 * @property {SPlotDemoMode} demoMode Параметры режима использования демонстрационных данных.
 * @property {boolean} forceRun Признак того, что рендеринг необходимо начать
 *     сразу после задания настроек экземпляра (по умолчанию рендеринг запускается
 *     только после вызова метода start).
 * @property {number} maxAmountOfPolygons Искусственное ограничение количества
 *     отображаемых полигонов. При достижении этого числа итерирование исходных
 *     объектов прерывается, даже если обработаны не все объекты.
 * @property {string} bgColor Фоновый цвет канваса в HEX-формате.
 * @property {string} rulesColor Цвет направляющих в HEX-формате.
 * @property {SPlotCameraView} camera Положение координатной плоскости в области
 *     просмотра.
 * @property {WebGLContextAttributes} webGlSettings Инициализирующие настройки контекста
 *     рендеринга WebGL, управляющие производительностью графической системы. По
 *     умолчанию производительность графической системы максимизируется и пользовательских
 *     предустановок не требуется.
 */

/**
 * Тип - полигон. Содержит информацию, необходимую для добавления полигона в группу
 *     полигонов. Полигон - это сплошная фигура на координатной плоскости, отображающая
 *     один исходный объект.
 *
 * @typedef {Object} SPlotPolygonInfo
 *
 * @property {number} x Координата центра полигона на оси абсцисс. Может быть
 *     как целым, так и вещественным числом.
 * @property {number} y Координата центра полигона на оси ординат. Может быть
 *     как целым, так и вещественным числом.
 * @property {number} shape Форма полигона. Форма - это целое число, представляющее
 *     собой индекс формы в предопределенном массиве форм. Основные формы:
 *     0 - треугольник, 1 - квадрат, 2 - круг.
 * @property {number} color Цвет полигона. Цвет - это целое число в диапазоне
 *     от 0 до 255, представляющее собой индекс цвета в предопределенном массиве цветов.
 */

/**
 * Тип - размер координатной плоскости.
 *
 * @typedef {Object} SPlotGridSize
 *
 * @property {number} width Ширина координатной плоскости в пикселях.
 * @property {number} height Высота координатноой плоскости в пикселях.
 */

/**
 * Тип - параметры режима отладки.
 *
 * @typedef {Object} SPlotDebugMode
 *
 * @property {boolean} isEnable Признак необходимости включения отладочного режима.
 * @property {string="console"} output Место вывода отладочной информации.
 */

/**
 * Тип - параметры демонстрационного режима.
 *
 * @typedef {Object} SPlotDemoMode
 *
 * @property {boolean} isEnable Признак необходимости включения демонстрационного
 *     режима. В этом режиме приложение вместо внешней функции итерирования
 *     исходных объектов использует внутренний метод, имитирующий итерирование.
 * @property {number} amount Количество имитируемых исходных объектов.
 * @property {Array.<number,number>} shapeQuota Частота появления в итерировании
 *     полигонов трех основных форм - треугольников[0], квадратов[1] и кругов[2].
 *     Пример: массив [3, 2, 5] означает, что частота появления треугольников
 *     = 3/(3+2+5) = 3/10, частота появления квадратов = 2/(3+2+5) = 2/10, частота
 *     появления кругов = 5/(3+2+5) = 5/10.
 * @property {number} index Этот параметр используется для имитации итерирования
 *     и установки пользовательского значения не требует.
 */

/**
 * Тип - положение координатной плоскости в области просмотра.
 *
 * @typedef {Object} SPlotCameraView
 *
 * @property {number} x Положение по оси абсцисс.
 * @property {number} y Положение по оси ординат.
 * @property {number} zoom - Степень "приближения" наблюдателя к координатной сетке
 *     (масштаб коодринатной плоскости в области просмотра).
 */

/**
 * Тип - трансформация. Содержит всю техническую информацию, необходимую для рассчета
 *     текущего положения координатной плоскости в области просмотра во время событий
 *     перемещения и зуммирования канваса.
 *
 * @typedef {Object} SPlotTransformationInfo
 *
 * @property {Array.<number>} matrix Основная матрица трансформации 3x3 в виде
 *     одномерного массива из 9 элементов.
 *
 * Вспомогательные матрицы и координаты, используемые для рассчетов во время составных
 *     событий (перемещение канваса):
 * @property {Array.<number>} startInvMatrix.
 * @property {number} startCameraX
 * @property {number} startCameraY
 * @property {number} startPosX
 * @property {number} startPosY
 */

/**
 * Тип - группа полигонов, которую можно отобразить на канвасе за один рендер.
 *
 * @typedef {Object} SPlotPolygonGroupInfo
 *
 * @property {Array.<number,number>} vertices Массив вершин всех полигонов группы.
 *     Каждая вершина - это пара чисел (координаты вершины на плоскости).
 *     Координаты могут быть как целыми, так и вещественными числами.
 * @property {Array.<number,number>} indices Массив индексов вершин полигонов группы.
 *     Каждый индекс - это номер вершины в массиве вершин. Индексы описывают все
 *     GL-треугольники, из которых состоят полигоны группы, т.е. каждая
 *     тройка индексов кодирует один GL-треугольник. Индексы - это целые
 *     числа в диапазоне от 0 до 65535, что накладывает ограничение на максимальное
 *     количество вершин, хранимых в группе полигонов (не более 32768 штук).
 * @property {Array.<number,number>} colors Массив цветов вершин полигонов группы. Каждое
 *     число задает цвет одной вершины в массиве вершин. Чтобы полигон был сплошного
 *     однородного цвета необходимо чтобы все вершины полигона имели одинаковый цвет.
 *     Цвет - это целое число в диапазоне от 0 до 255, представляющее собой
 *     индекс цвета в предопределенном массиве цветов.
 * @property {number} amountOfVertices Количество всех вершин в группе полигонов.
 * @property {number} amountOfPrimitiveVertices Количество вершин всех GL-треугольников
 *     группы полигонов.
 */

/**
 * Тип - буферы данных для загрузки в видеопамять.
 *
 * @typedef {Object} SPlotBuffersInfo
 *
 * @property {Array.<WebGLBuffer>} vertexBuffers Массив буферов с информацией
 *     о вершинах полигонов.
 * @property {Array.<WebGLBuffer>} colorBuffers Массив буферов с информацией
 *     о цветах вершин полигонов.
 * @property {Array.<WebGLBuffer>} indexBuffers Массив буферов с индексами вершин полигонов.
 * @property {Array.<number,number>} amountOfPrimitiveVertices Количество вершин,
 *     образующих GL-треугольники каждого вершинного буфера.
 * @property {Array.<number,number>} amountOfShapes Количество полигонов каждой
 *     формы (сколько треугольников, квадратов, кругов).
 * @property {number} amountOfBufferGroups Количество буферных групп в массиве.
 *     Все указанные выше массивы буферов содержат одинаковое количество элементов.
 * @property {number} amountOfTotalVertices Общее количество вершин всех вершинных
 *     буферов (vertexBuffers).
 * @property {number} amountOfTotalPrimitiveVertices Общее количество вершин всех
 *     индексных буферов (indexBuffers).
 * @property {Array.<number,number>} sizeInBytes Размеры буферов каждого типа (для
 *     вершин, для цветов, для индексов) в байтах.
 */

/**
 * Класс, отображающий точечный график (скаттерплот) с использованием низкоуровневого
 * высокопроизводительного функционала WebGL для работы напрямую с видеокартой клиента.
 * Это позволяет существенно увеличить количество объектов на графике, используя
 * вычислительные мощности клиента максимально эффективно. Метод отрисовки класса SPlot
 * эффективнее стандартных средств рисования на канвасе более чем в 100 раз.
 *
 * Последовательность работы класса - перебор всех исходных объектов и формирование
 * для каждого объекта фигуры на графике (с определенными положением, формой и цветом).
 * Каждая фигура на графике представляет собой полигон - цветную замкнутую область,
 * ограниченную вершинами и соединяющими их прямыми линиями. Основных форм полигонов -
 * три (треугольник, квадрат и круг), однако их можно увеличить, дополнив класс
 * методами, создающими новые формы. График можно двигать и зумировать мышью/трекпадом.
 *
 * Каждый полигон при отрисовке кодируется набором примитивных треугольников (GL-
 * треугольников). Чем больше вершин в полигоне - тем больше GL-треугольников
 * используется для рендера. Поэтому наиболее эффективно использовать треугольные
 * формы полигонов, и наименее эффективно - круглые (круги в WebGL это апроксимирующие
 * окружность многоульники).
 *
 * Основной принцип рендера большого количества полигонов - определенное деление
 * их на группы, запись в видеопамять группами буферов и последовательный погрупповой
 * рендер с минимальным взаимодействием с объектами приложения.
 *
 * Для эффективной работы исходные объекты анализируются не в классе, а на уровне
 * исходного приложения. В класс передается только подготовленная информация о каждом
 * полигоне (координаты, форма, цвет). Передача происходит итерационно - по одному
 * полигону на один проанализированный исходный объект. Функция итерирования пишется
 * в коде исходного приложения и передается в класс параметром iterationCallback.
 *
 * Передать в класс опции и выполнить запуск рендера можно тремя способами:
 *
 *    1)   let x = new SPlot(<id канваса>);
 *         x.setup(<опции>);
 *         x.run();
 *
 *    2)   let x = new SPlot(<id канваса>, <опции>);
 *         x.run();
 *
 *    3)   let x = new SPlot(<id канваса>, <опции с параметром форсированного запуска>);
 *
 * Присвоение экземпляра класса переменной является необходимым условием.
 * Все возможные опции класса описаны в типе SPlotOptions.
 * После запуска рендер можно остановить (x.stop()), очистить (x.clear()), запустить
 * повторно и изменить опции (x.setup(<опции>) во время остановки рендера).
 *
 * @example
 * Примеры использования:
 *
 *    1) Запуск с минимальным количеством опций:
 *
 *         let x = new SPlot('canvas-id', {
 *           iterationCallback: readNextObject
 *         });
 *         x.run();
 *
 *    2) Запуск с минимальным количеством опций в демо-режиме:
 *
 *         let x = new SPlot('canvas-id', {
 *           demoMode: {
 *             isEnable: true
 *           }
 *         });
 *         x.run();
 *
 *    3) Запуск в демо-режиме и с выводом отладочной информации:
 *
 *         let x = new SPlot('canvas-id', {
 *           demoMode: {
 *             isEnable: true
 *           },
 *           debugMode: {
 *             isEnable: true
 *           }
 *         });
 *         x.run();
 *
 *    4) Запуск из конструктора (форсированный запуск) с указанием палитры цветов:
 *
 *         let x = new SPlot('canvas-id', {
 *           iterationCallback: readNextObject,
 *           polygonPalette: ['#ff0000', '00ffaa', '#123456', 'd0d0d0'],
 *           forceRun: true
 *         });
 *
 *    5) Запуск с заданием всех доступных опций (см. значение опций в типе SPlotOptions):
 *
 *         let x = new SPlot('canvas-id', {
 *           iterationCallback: readNextObject,
 *           polygonPalette: ['#ff0000', '00ffaa', '#123456', 'd0d0d0'],
 *           gridSize: {
 *             width: 20000,
 *             height: 20000
 *           },
 *           polygonSize: 10,
 *           circleApproxLevel: 14,
 *           debugMode: {
 *             isEnable: true,
 *             output: 'console'
 *           },
 *           demoMode: {
 *             isEnable: true,
 *             amount: 5000000,
 *             shapeQuota: [6, 3, 1]
 *           },
 *           forceRun: true,
 *           maxAmountOfPolygons: 1000000,
 *           bgColor: '#ffffff',
 *           camera: {
 *             x: 5000,
 *             y: 7000,
 *             zoom: 1
 *           },
 *           webGlSettings: {
 *             alpha: false,
 *             depth: false,
 *             stencil: false,
 *             antialias: false,
 *             premultipliedAlpha: false,
 *             preserveDrawingBuffer: false,
 *             powerPreference: 'high-performance',
 *             failIfMajorPerformanceCaveat: false,
 *             desynchronized: false
 *           }
 *         });
 *
 * @todo Реализовать отображение сетки (rules) с плавающей величиной ячейки.
 * @todo Реализовать отображение осей (axes) с плавающими делениями.
 * @todo Ограничить минимальный масштаб границами канваса.
 * @todo Реализовать альтернативный метод загрузки данных о полигонах способом
 *     однократной передачи массива данных.
 * @todo Реализовать альтернативные спосообы вывода отладочной информации (в DOM
 *     исходного приложения).
 * @todo Реализовать альтернативный метод, отбражающий только треугольные полигоны
 *     самым оптимальным способом для максимально возможной производительности
 *     в ущерб универсальности.
 * @todo Реализовать альтернативный метод отображения графика, состоящего только
 *     из GL-точек.
 * @todo Анализ работы алгоритмов на маломощных машинах.
 * @todo Сделать файл README
 */
class SPlot {

  /**
   * Создает экземпляр класса, инициализирует настройки по умолчанию.
   *
   * @param {string} canvasId Идентификатор элемента <canvas>, на котором будет
   *     рисоваться скаттерплот.
   * @param {SPlotOptions} [options=false] Пользовательские настройки экземпляра.
   *     Их можно задать в конструкторе или позже - вызовом метода setup.
   */
  constructor(canvasId, options = false) {

    /**
     * Инициализирующие настройки экземпляров класса по умолчанию. Все поля в точности
     * соответствуют типу настроек SPlotOptions (описан выше). Пользователь может
     * переопределить любое из этих полей. Необходимым явлется только задание функции
     * итерирования - iterationCallback. Однако, если включен демо-режим, то задание
     * функции итерирования не требуется.
     *
     * @type {SPlotOptions}
     * @default
     * @public
     */

    this.iterationCallback = null;

    this.polygonPalette = [
      '#FF00FF', '#800080', '#FF0000', '#800000', '#FFFF00',
      '#00FF00', '#008000', '#00FFFF', '#0000FF', '#000080'
    ];

    this.gridSize = {
      width: 32000,
      height: 16000
    };

    this.polygonSize = 4;

    this.circleApproxLevel = 12;

    this.debugMode = {
      isEnable: false,
      output: 'console'
    };

    this.demoMode = {
      isEnable: false,
      amount: 1000000,
      shapeQuota: [3, 3, 3],
      index: 0
    };

    this.forceRun = false;

    this.maxAmountOfPolygons = 1000000000;

    this.bgColor = '#ffffff';

    this.rulesColor = '#c0c0c0';

    this.camera = {
      x: this.gridSize.width / 2,
      y: this.gridSize.height / 2,
      zoom: 1
    };

    this.webGlSettings = {
      alpha: false,
      depth: false,
      stencil: false,
      antialias: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
      powerPreference: 'high-performance',
      failIfMajorPerformanceCaveat: false,
      desynchronized: false
    };

    /**
     * Объект - канвас, на котором будет рисоваться скаттерплот.
     * @type {HTMLCanvasElement}
     * @private
     */
    this._canvas = null;

    /**
     * Объект - контекст рендеринга WebGL.
     * @type {WebGLRenderingContext}
     * @private
     */
    this._gl = null;

    /**
     * Объект - программа WebGL.
     * @type {WebGLProgram}
     * @private
     */
    this._gpuProgram = null;

    /**
     * Переменные программы WebGL для связи с приложением.
     * @type {Array.<string>}
     * @private
     */
    this._variables = ['a_position', 'a_color', 'u_matrix'];

    /**
     * Шаблон кода вершинного шейдера на языке GLSL. Содержит специальную строку
     *     'SET-VERTEX-COLOR-CODE', которая перед созданием шейдера заменяется на
     *     GLSL-код выбора цвета вершин.
     * @type {string}
     * @private
     */
    this._vertexShaderCodeTemplate =
      'attribute vec2 a_position;\n' +
      'attribute float a_color;\n' +
      'uniform mat3 u_matrix;\n' +
      'varying vec3 v_color;\n' +
      'void main() {\n' +
      '  gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0.0, 1.0);\n' +
      '  SET-VERTEX-COLOR-CODE' +
      '}\n';

    /**
     * Шаблон кода фрагментного шейдера.
     * @type {string}
     * @private
     */
    this._fragmentShaderCodeTemplate =
      'precision lowp float;\n' +
      'varying vec3 v_color;\n' +
      'void main() {\n' +
      '  gl_FragColor = vec4(v_color.rgb, 1.0);\n' +
      '}\n';

    /**
     * Количество готовых к рендерингу полигонов.
     * @type {number}
     * @private
     */
    this._amountOfPolygons = 0;

    /**
     * Стиль заголовочного текста в консоли браузера.
     * @type {string}
     * @private
     */
    this._debugStyle = 'font-weight: bold; color: #ffffff;';

    /**
     * Набор вспомогательных констант, ускоряющих производительность.
     * @type {Array.<number,number>}
     * @private
     */
    this._USEFUL_CONST = [];

    /**
     * Признак активного рендеринга.
     * @type {boolean}
     * @private
     */
    this._isRunning = false;

    /**
     * Данные трансформации.
     * @type {SPlotTransformationInfo}
     * @private
     */
    this._transormation = {
      matrix: [],
      startInvMatrix: [],
      startCameraX: 0,
      startCameraY: 0,
      startPosX: 0,
      startPosY: 0
    };

    /**
     * Предельное количество вершин в группе полигонов, которое еще допускает
     *     добавление одного самого многовершинного полигона.
     * @type {number}
     * @private
     */
    this._maxAmountOfVertexPerPolygonGroup = 32768 - (this.circleApproxLevel + 1);

    /**
     * Буферы WebGL и системная и статистическая информация.
     * @type {SPlotBuffersInfo}
     * @private
     */
    this._buffers = {
      vertexBuffers: [],
      colorBuffers: [],
      indexBuffers: [],
      amountOfPrimitiveVertices: [],
      amountOfShapes: [],
      amountOfBufferGroups: 0,
      amountOfTotalVertices: 0,
      amountOfTotalPrimitiveVertices: 0,
      sizeInBytes: [0, 0, 0]
    };

    /**
     * Набор функций, создающих полигоны.
     * @type {Array.<function()>}
     * @private
     */
    this._addPolygon = [];

    // Инициализация методов создания трех основных форм полигонов.
    this._addPolygon[0] = this._addPolygonTriangle;
    this._addPolygon[1] = this._addPolygonSquare;
    this._addPolygon[2] = this._addPolygonCircle;

    // Создание и инициализация объектов рендеринга WebGL.
    this._createWebGl(canvasId);

    /**
     * Канвас, на котором будет происходить рендеринг, получает ссылку на экземпляр
     * класса. Это дает возможность внешним обработчикам событий канваса обращаться
     * к методам экземпляра. В частности, обработчики событий мыши на канвасе могут
     * вызывать методы расчета трансформаций и метод рендера экземпляра. Объект this
     * внутри обработчиков событий недоступен.
     */
    this._canvas.scatterplot = this;

    // Если при создании экземпляра были заданы настройки, то они применяются.
    if (options) {
      this.setup(options);
    }
  }

  /**
   * Создает и инициализирует объекты рендеринга WebGL.
   *
   * @private
   * @param {string} canvasId Идентификатор элемента <canvas>.
   */
  _createWebGl(canvasId) {

    this._canvas = document.getElementById(canvasId);

    // Инициализация контекста рендеринга WebGL.
    this._gl = this._canvas.getContext('webgl', this.webGlSettings);

    // Выравнивание области рендеринга в соответствии с размером канваса.
    this._canvas.width = this._canvas.clientWidth;
    this._canvas.height = this._canvas.clientHeight;
    this._gl.viewport(0, 0, this._canvas.width, this._canvas.height);
  }

  /**
   * Устанавливает необходимые перед запуском рендера параметры экземпляра и WebGL.
   *
   * @public
   * @param {SPlotOtions} options Пользовательские настройки экземпляра.
   */
  setup(options) {

    // Применение пользовательских настроек.
    this._setOptions(options);

    // Обнуление счетчика полигонов.
    this._amountOfPolygons = 0;

    // Обнуление счетчиков форм полигонов.
    for (let i = 0; i < this._addPolygon.length; i++) {
      this._buffers.amountOfShapes[i] = 0;
    }

    /**
     * Предельное количество вершин в группе полигонов зависит от параметра
     * circleApproxLevel, который мог быть изменен пользовательскими настройками.
     */
    this._maxAmountOfVertexPerPolygonGroup = 32768 - (this.circleApproxLevel + 1);

    // Инициализация вспомогательных констант.
    this._setUsefulConstants();

    /**
     * Подготовка кодов шейдеров. Код фрагментного шейдера используется как есть.
     * В код вершинного шейдера вставляется код выбора цвета вершин.
     */
    let vertexShaderCode = this._vertexShaderCodeTemplate.replace(
      'SET-VERTEX-COLOR-CODE',
      this._genShaderColorCode()
    );
    let fragmentShaderCode = this._fragmentShaderCodeTemplate;

    // Создание шейдеров WebGL.
    let vertexShader = this._createWebGlShader('VERTEX_SHADER', vertexShaderCode);
    let fragmentShader = this._createWebGlShader('FRAGMENT_SHADER', fragmentShaderCode);

    // Создание программы WebGL.
    let gpuProgram = this._createWebGlProgram(vertexShader, fragmentShader);
    this._setWebGlProgram(gpuProgram);

    // Установка связей переменных приложения с программой WebGl.
    this._setWebGlVariable('attribute', 'a_position');
    this._setWebGlVariable('attribute', 'a_color');
    this._setWebGlVariable('uniform', 'u_matrix');

    // Создание и заполнение данными буферов WebGL.
    this._createWbGlBuffers();

    // Установка цвета очистки рендеринга
    let [r, g, b] = this._convertColor(this.bgColor);
    this._gl.clearColor(r, g, b, 0.0);
    this._gl.clear(this._gl.COLOR_BUFFER_BIT);

    // Если требуется - рендеринг запускается сразу после установки параметров экземпляра.
    if (this.forceRun) {
      this.run();
    }
  }

  /**
   * Применяет пользовательские настройки экземпляра.
   *
   * @private
   * @param {SPlotOtions} options Пользовательские настройки экземпляра.
   */
  _setOptions(options) {

    /**
     * Копирование пользовательских настроек в соответсвующие поля экземпляра.
     * Копируются только те пользовательские настройки, которым имеются соответствующие
     * эквиваленты в полях экземпляра. Копируется также первый уровень вложенных
     * настроек.
     */
    for (let option in options) {
      if (this.hasOwnProperty(option)) {
        if ((Object.prototype.toString.call(options[option]).slice(8, -1) === 'Object') &&
          (Object.prototype.toString.call(this[option]).slice(8, -1) === 'Object')) {
          for (let nestedOption in options[option]) {
            if (this[option].hasOwnProperty(nestedOption)) {
              this[option][nestedOption] = options[option][nestedOption];
            }
          }
        } else {
          this[option] = options[option];
        }
      }
    }

    /**
     * Если пользователь задает размер плоскости, но при этом на задает начальное
     * положение области просмотра, то область просмотра помещается в центр заданной
     * плоскости.
     */
    if (options.hasOwnProperty('gridSize') && !options.hasOwnProperty('camera')) {
      this.camera = {
        x: this.gridSize.width / 2,
        y: this.gridSize.height / 2,
        zoom: 1
      };
    }

    /**
     * Если запрошен режим демонстрационных данных, то для итерирования объектов
     * будет использоваться внутренний метод, имитирующий итерирование. При этом,
     * если была задана внешняя функция итерирования - она будет проигнорирована.
     */
    if (this.demoMode.isEnable) {
      this.iterationCallback = this._demoIterationCallback;
    }

    // Вывод отладочной информации.
    if (this.debugMode.isEnable) {
      this._reportMainInfo(options);
    }
  }

  /**
   * Вычисляет набор вспомогательных констант _USEFUL_CONST[].
   * Они хранят результаты алгебраических и тригонометрических вычислений,
   * используемых в расчетах вершин полигонов и матриц трансформации. Такие константы
   * позволяют вынести затратные для процессора операции за пределы многократно
   * используемых функций увеличивая производительность приложения на этапах
   * подготовки данных и рендеринга.
   *
   * @private
   */
  _setUsefulConstants() {

    // Константы, зависящие от размера полигона.
    this._USEFUL_CONST[0] = this.polygonSize / 2;
    this._USEFUL_CONST[1] = this._USEFUL_CONST[0] / Math.cos(Math.PI / 6);
    this._USEFUL_CONST[2] = this._USEFUL_CONST[0] * Math.tan(Math.PI / 6);

    // Константы, зависящие от степени детализации круга и размера полигона.
    this._USEFUL_CONST[3] = new Float32Array(this.circleApproxLevel);
    this._USEFUL_CONST[4] = new Float32Array(this.circleApproxLevel);

    for (let i = 0; i < this.circleApproxLevel; i++) {
      const angle = 2 * Math.PI * i / this.circleApproxLevel;
      this._USEFUL_CONST[3][i] = this._USEFUL_CONST[0] * Math.cos(angle);
      this._USEFUL_CONST[4][i] = this._USEFUL_CONST[0] * Math.sin(angle);
    }

    // Константы, зависящие от размера канваса.
    this._USEFUL_CONST[5] = 2 / this._canvas.width;
    this._USEFUL_CONST[6] = 2 / this._canvas.height;
    this._USEFUL_CONST[7] = 2 / this._canvas.clientWidth;
    this._USEFUL_CONST[8] = -2 / this._canvas.clientHeight;
    this._USEFUL_CONST[9] = this._canvas.getBoundingClientRect().left;
    this._USEFUL_CONST[10] = this._canvas.getBoundingClientRect().top;
  }

  /**
   * Создает шейдер WebGL.
   *
   * @private
   * @param {string="VERTEX_SHADER","FRAGMENT_SHADER"} shaderType Тип шейдера - вершинный или фрагментный.
   * @param {string} shaderCode Код шейдера на языке GLSL.
   * @return {WebGLShader} Созданный объект шейдера WebGL.
   */
  _createWebGlShader(shaderType, shaderCode) {

    // Создание, привязка кода и компиляция шейдера.
    const shader = this._gl.createShader(this._gl[shaderType]);
    this._gl.shaderSource(shader, shaderCode);
    this._gl.compileShader(shader);

    if (!this._gl.getShaderParameter(shader, this._gl.COMPILE_STATUS)) {
      throw new Error('Ошибка компиляции шейдера [' + shaderType + ']. ' + this._gl.getShaderInfoLog(shader));
    }

    // Вывод отладочной информации.
    if (this.debugMode.isEnable) {
      console.group('%cСоздан шейдер [' + shaderType + ']', this._debugStyle);
      console.log(shaderCode);
      console.groupEnd();
    }

    return shader;
  }

  /**
   * Создает программу WebGL.
   *
   * @private
   * @param {WebGLShader} vertexShader Вершинный шейдер.
   * @param {WebGLShader} fragmentShader Фрагментный шейдер.
   * @return {WebGLProgram} Созданный объект программы WebGL.
   */
  _createWebGlProgram(vertexShader, fragmentShader) {

    // Создание я привязка программы WebGL.
    let gpuProgram = this._gl.createProgram();
    this._gl.attachShader(gpuProgram, vertexShader);
    this._gl.attachShader(gpuProgram, fragmentShader);
    this._gl.linkProgram(gpuProgram);

    if (!this._gl.getProgramParameter(gpuProgram, this._gl.LINK_STATUS)) {
      throw new Error('Ошибка создания программы WebGL. ' + this._gl.getProgramInfoLog(gpuProgram));
    }

    return gpuProgram;
  }

  /**
   * Делает программу WebGL активной.
   *
   * @private
   * @param {WebGLProgram} gpuProgram Объект программы WebGL.
   */
  _setWebGlProgram(gpuProgram) {
    this._gl.useProgram(gpuProgram);
    this._gpuProgram = gpuProgram;
  }

  /**
   * Устанавливает связь переменной приложения с программой WebGl.
   *
   * @private
   * @param {string="uniform","attribute"} varType Тип переменной.
   * @param {string} varName Имя переменной.
   */
  _setWebGlVariable(varType, varName) {
    if (varType === 'uniform') {
      this._variables[varName] = this._gl.getUniformLocation(this._gpuProgram, varName);
    } else if (varType === 'attribute') {
      this._variables[varName] = this._gl.getAttribLocation(this._gpuProgram, varName);
    }
  }

  /**
   * Создает и заполняет данными обо всех полигонах буферы WebGL.
   *
   * @private
   */
  _createWbGlBuffers() {

    // Вывод отладочной информации.
    if (this.debugMode.isEnable) {

      console.log('%cЗапущен процесс загрузки данных [' +
        this._getCurrentTime() + ']...', this._debugStyle);

      /**
       * Запуск консольного таймера, подсчитывающего длительность процесса итерирования
       * исходных объектов и загрузки соответствующих данных в видеопамять.
       */
      console.time('Длительность');
    }

    /** @type {SPlotPolygonGroupInfo} */
    let polygonGroup;

    // Итерирование групп полигонов.
    while (polygonGroup = this._createPolygonGroup()) {

      // Создание и заполнение буферов данными о группе полигонов.

      this._addWbGlBuffer(this._buffers.vertexBuffers, 'ARRAY_BUFFER',
        new Float32Array(polygonGroup.vertices), 0);

      this._addWbGlBuffer(this._buffers.colorBuffers, 'ARRAY_BUFFER',
        new Uint8Array(polygonGroup.colors), 1);

      this._addWbGlBuffer(this._buffers.indexBuffers, 'ELEMENT_ARRAY_BUFFER',
        new Uint16Array(polygonGroup.indices), 2);

      // Счетчик количества буферов.
      this._buffers.amountOfBufferGroups++;

      // Определение количества вершин GL-треугольников текущей группы буферов.
      this._buffers.amountOfPrimitiveVertices.push(polygonGroup.amountOfPrimitiveVertices);

      // Определение общего количества вершин GL-треугольников.
      this._buffers.amountOfTotalPrimitiveVertices += polygonGroup.amountOfPrimitiveVertices;
    }

    // Вывод отладочной информации.
    if (this.debugMode.isEnable) {
      this._reportAboutObjectReading();
    }
  }

  /**
   * Считывает данные об исходных объектах и формирует соответсвующую этим объектам
   * группу полигонов. Группа формируется с учетом лимита на количество вершин
   * в группе и лимита на общее количество полигонов на канвасе.
   *
   * @private
   * @return {(SPlotPolygonGroupInfo|null)} Созданная группа полигонов или null,
   *     если формирование всех групп полигонов завершилось.
   */
  _createPolygonGroup() {

    /** @type {SPlotPolygonGroupInfo} */
    let polygonGroup = {
      vertices: [],
      indices: [],
      colors: [],
      amountOfVertices: 0,
      amountOfPrimitiveVertices: 0
    }

    /** @type {SPlotPolygonInfo} */
    let polygon;

    /**
     * Если количество полигонов канваса достигло допустимого максимума, то дальнейшая
     * обработка исходных объектов больше не требуется - формирование групп полигонов
     * завершается возвратом значения null (симуляция достижения последнего
     * обрабатываемого исходного объекта).
     */
    if (this._amountOfPolygons >= this.maxAmountOfPolygons) return null;

    // Итерирование исходных объектов.
    while (polygon = this.iterationCallback()) {

      // На основе формы полигона вызывается метод его добавления к группе полигонов.
      this._addPolygon[polygon.shape](polygonGroup, polygon, this);

      // Подсчитывается число применений каждой из форм полигонов.
      this._buffers.amountOfShapes[polygon.shape]++;

      // Счетчик общего количество полигонов.
      this._amountOfPolygons++;

      /**
       * Если количество полигонов канваса достигло допустимого максимума, то дальнейшая
       * обработка исходных объектов больше не требуется - формирование групп полигонов
       * завершается возвратом значения null (симуляция достижения последнего
       * обрабатываемого исходного объекта).
       */
      if (this._amountOfPolygons >= this.maxAmountOfPolygons) break;

      /**
       * Если общее количество всех вершин в группе полигонов превысило допустимое,
       * то группа полигонов считается сформированной и итерирование исходных
       * объектов прерывается.
       */
      if (polygonGroup.amountOfVertices >= this._maxAmountOfVertexPerPolygonGroup) break;
    }

    // Подсчитывается общее количество вершин всех вершинных буферов.
    this._buffers.amountOfTotalVertices += polygonGroup.amountOfVertices;

    // Если группа полигонов непустая, то возвращаем ее. Если пустая - возвращаем null.
    return (polygonGroup.amountOfVertices > 0) ? polygonGroup : null;
  }

  /**
   * Создает в массиве буферов WebGL новый буфер и записывает в него переданные данные.
   *
   * @private
   * @param {Array.<WebGLBuffer>} buffers Массив буферов WebGL, в который будет
   *     добавлен создаваемый буфер.
   * @param {string="ARRAY_BUFFER","ELEMENT_ARRAY_BUFFER"} type Тип создаваемого
   *     буфера - с информацией о вершинах, или с информацией об индексах вершин.
   * @param {TypedArray} data Данные в виде типизированного массива для записи
   *     в создаваемый буфер.
   * @param {number} key Ключ (индекс), идентифицирующий тип буфера (для вершин,
   *     для цветов, для индексов). Используется для раздельного подсчета памяти,
   *     занимаемой каждым типом буфера.
   */
  _addWbGlBuffer(buffers, type, data, key) {

    // Определение индекса нового элемента в массиве буферов WebGL.
    const index = this._buffers.amountOfBufferGroups;

    // Создание и заполнение данными нового буфера.
    buffers[index] = this._gl.createBuffer();
    this._gl.bindBuffer(this._gl[type], buffers[index]);
    this._gl.bufferData(this._gl[type], data, this._gl.STATIC_DRAW);

    // Подсчет памяти, занимаемой буферами данных (раздельно по каждому типу буферов)
    this._buffers.sizeInBytes[key] += data.length * data.BYTES_PER_ELEMENT;
  }

  /**
   * Создает и добавляет в группу полигонов новый полигон - треугольник.
   *
   * @private
   * @param {SPlotPolygonGroupInfo} polygonGroup Группа полигонов, в которую
   *     происходит добавление.
   * @param {SPlotPolygonInfo} polygon Информация о добавляемом полигоне.
   * @param {SPlot} $this Ссылка на экземпляр класса. Т.к. методы
   *     создания полигонов вызываются через массив функций создания полигонов
   *     по необходимому индексу, объект this внутри метода при таком вызове будет
   *     ссылаться на массив функций, а не на экземпляр класса. Чтобы метод создания
   *     полигона имел доступ к свойствам экземпляра, в этот метод ссылка на
   *     экземпляр класса передается явно - одним из аргументов.
   */
  _addPolygonTriangle(polygonGroup, polygon, $this) {

    // Нахождение координат вершин треугольника.
    const x1 = polygon.x - $this._USEFUL_CONST[0];
    const y1 = polygon.y + $this._USEFUL_CONST[2];
    const x2 = polygon.x;
    const y2 = polygon.y - $this._USEFUL_CONST[1];
    const x3 = polygon.x + $this._USEFUL_CONST[0];
    const y3 = polygon.y + $this._USEFUL_CONST[2];

    // Добавление данных о треугольнике в группу полигонов.
    polygonGroup.vertices.push(x1, y1, x2, y2, x3, y3);
    polygonGroup.colors.push(polygon.color, polygon.color, polygon.color);

    // Добавление индексов вершин, образующих GL-треугольник.
    polygonGroup.indices.push(
      polygonGroup.amountOfVertices,
      polygonGroup.amountOfVertices + 1,
      polygonGroup.amountOfVertices + 2
    );

    // Треугольник увеличивает количество вершин в группе полигонов на три.
    polygonGroup.amountOfVertices += 3;

    /**
     * Количество вершин GL-треугольников в случае добавления треугольника также
     * увеличивается на три.
     */
    polygonGroup.amountOfPrimitiveVertices += 3;
  }

  /**
   * Создает и добавляет в группу полигонов новый полигон - квадрат.
   *
   * @private
   * @param {SPlotPolygonGroupInfo} polygonGroup Группа полигонов, в которую
   *     происходит добавление.
   * @param {SPlotPolygonInfo} polygon Информация о добавляемом полигоне.
   * @param {SPlot} $this Ссылка на экземпляр класса. Т.к. методы
   *     создания полигонов вызываются через массив функций создания полигонов
   *     по необходимому индексу, объект this внутри метода при таком вызове будет
   *     ссылаться на массив функций, а не на экземпляр класса. Чтобы метод создания
   *     полигона имел доступ к свойствам экземпляра, в этот метод ссылка на
   *     экземпляр класса передается явно - одним из аргументов.
   */
  _addPolygonSquare(polygonGroup, polygon, $this) {

    // Нахождение координат двух ключевых вершин квадрата (верхний левый и правый нижний углы).
    const x1 = polygon.x - $this._USEFUL_CONST[0];
    const y1 = polygon.y - $this._USEFUL_CONST[0];
    const x2 = polygon.x + $this._USEFUL_CONST[0];
    const y2 = polygon.y + $this._USEFUL_CONST[0];

    // Добавление данных о квадрате в группу полигонов.
    polygonGroup.vertices.push(x1, y1, x2, y1, x2, y2, x1, y2);
    polygonGroup.colors.push(polygon.color, polygon.color, polygon.color, polygon.color);

    // Добавление индексов вершин, образующих GL-треугольники квадрата.
    polygonGroup.indices.push(
      polygonGroup.amountOfVertices,
      polygonGroup.amountOfVertices + 1,
      polygonGroup.amountOfVertices + 2,
      polygonGroup.amountOfVertices,
      polygonGroup.amountOfVertices + 2,
      polygonGroup.amountOfVertices + 3
    );

    // Квадрат увеличивает количество вершин в группе полигонов на четыре.
    polygonGroup.amountOfVertices += 4;

    // Количество вершин GL-треугольников в случае добавления квадрата увеличивается на шесть.
    polygonGroup.amountOfPrimitiveVertices += 6;
  }

  /**
   * Создает и добавляет в группу полигонов новый полигон - круг (апроксимирующий круг полигон).
   *
   * @private
   * @param {SPlotPolygonGroupInfo} polygonGroup Группа полигонов, в которую
   *     происходит добавление.
   * @param {SPlotPolygonInfo} polygon Информация о добавляемом полигоне.
   * @param {SPlot} $this Ссылка на экземпляр класса. Т.к. методы
   *     создания полигонов вызываются через массив функций создания полигонов
   *     по необходимому индексу, объект this внутри метода при таком вызове будет
   *     ссылаться на массив функций, а не на экземпляр класса. Чтобы метод создания
   *     полигона имел доступ к свойствам экземпляра, в этот метод ссылка на
   *     экземпляр класса передается явно - одним из аргументов.
   */
  _addPolygonCircle(polygonGroupData, polygon, $this) {

    // Добавление в группу полигонов центра круга.
    polygonGroupData.vertices.push(polygon.x, polygon.y);
    polygonGroupData.colors.push(polygon.color);

    // Добавление апроксимирующих окружность круга вершин в группу полигонов.
    for (let i = 0; i < $this.circleApproxLevel; i++) {

      polygonGroupData.vertices.push(
        polygon.x + $this._USEFUL_CONST[3][i],
        polygon.y + $this._USEFUL_CONST[4][i]
      );

      polygonGroupData.colors.push(polygon.color);

      // Добавление индексов вершин, образующих GL-треугольники апроксимирующего круг полигона.
      polygonGroupData.indices.push(
        polygonGroupData.amountOfVertices,
        polygonGroupData.amountOfVertices + i + 1,
        polygonGroupData.amountOfVertices + i + 2
      );
    }

    /**
     * Последняя вершина последнего GL-треугольника заменяется на первую апроксимирующую
     * окружность круга вершину, замыкая апроксимирущий круг полигон.
     */
    polygonGroupData.indices.pop();
    polygonGroupData.indices.push(polygonGroupData.amountOfVertices + 1);

    // В группу полигонов попали все апроксимирующие окружность круга вершины и центр круга
    polygonGroupData.amountOfVertices += ($this.circleApproxLevel + 1);

    /**
     * Количество GL-треугольников в случае добавления круга совпадает с количеством
     * апроксимирующих окружность круга вершин. Соответственно количество вершин
     * GL-треугольников в три раза больше количества GL-треугольников.
     */
    polygonGroupData.amountOfPrimitiveVertices += ($this.circleApproxLevel * 3);
  }

  /**
   * Выводит в консоль базовую часть отладочной информации.
   *
   * @private
   * @param {SPlotOtions} options Пользовательские настройки экземпляра.
   */
  _reportMainInfo(options) {

    console.log('%cВключен режим отладки ' + this.constructor.name +
      ' [#' + this._canvas.id + ']', this._debugStyle + ' background-color: #cc0000;');

    if (this.demoMode.isEnable) {
      console.log('%cВключен демонстрационный режим данных', this._debugStyle);
    }

    // Группа "Предупреждение".
    console.group('%cПредупреждение', this._debugStyle);

    console.dir('Открытая консоль браузера и другие активные средства контроля разработки существенно снижают производительность высоконагруженных приложений. Для объективного анализа производительности все подобные средства должны быть отключены, а консоль браузера закрыта. Некоторые данные отладочной информации в зависимости от используемого браузера могут не отображаться или отображаться некорректно. Средство отладки протестировано в браузере Google Chrome v.90');

    console.groupEnd();

    // Группа "Видеосистема".
    console.group('%cВидеосистема', this._debugStyle);

    let ext = this._gl.getExtension('WEBGL_debug_renderer_info');
    console.log('Графическая карта: ' + this._gl.getParameter(ext.UNMASKED_RENDERER_WEBGL));
    console.log('Версия GL: ' + this._gl.getParameter(this._gl.VERSION));

    console.groupEnd();

    // Группа "Настройка параметров экземпляра".
    console.group('%cНастройка параметров экземпляра', this._debugStyle);

    console.dir(this);
    console.log('Заданы параметры:\n', JSON.stringify(options, null, ' '));
    console.log('Канвас: #' + this._canvas.id);
    console.log('Размер канваса: ' + this._canvas.width + ' x ' + this._canvas.height + ' px');
    console.log('Размер плоскости: ' + this.gridSize.width + ' x ' + this.gridSize.height + ' px');
    console.log('Размер полигона: ' + this.polygonSize + ' px');
    console.log('Апроксимация окружности: ' + this.circleApproxLevel + ' углов');
    console.log('Функция перебора: ' + this.iterationCallback.name);

    console.groupEnd();
  }

  /**
   * Выводит в консоль отладочную информацию о загрузке исходных объектов.
   *
   * @private
   */
  _reportAboutObjectReading() {

    // Группа "Загрузка данных завершена".
    console.group('%cЗагрузка данных завершена [' +
      this._getCurrentTime() + ']', this._debugStyle);

    console.timeEnd('Длительность');

    console.log('Результат: ' +
      ((this._amountOfPolygons >= this.maxAmountOfPolygons) ? 'достигнут заданный лимит (' +
        this.maxAmountOfPolygons.toLocaleString() + ')' : 'обработаны все объекты'));

    // Группа "Кол-во объектов".
    console.group('Кол-во объектов: ' + this._amountOfPolygons.toLocaleString());

    console.log('Треугольники: ' + this._buffers.amountOfShapes[0].toLocaleString() +
      ' [~' + Math.round(100 * this._buffers.amountOfShapes[0] / this._amountOfPolygons) + '%]');

    console.log('Квадраты: ' + this._buffers.amountOfShapes[1].toLocaleString() +
      ' [~' + Math.round(100 * this._buffers.amountOfShapes[1] / this._amountOfPolygons) + '%]');

    console.log('Круги: ' + this._buffers.amountOfShapes[2].toLocaleString() +
      ' [~' + Math.round(100 * this._buffers.amountOfShapes[2] / this._amountOfPolygons) + '%]');

    let amountOfOtherShape = this._amountOfPolygons -
      this._buffers.amountOfShapes[0] -
      this._buffers.amountOfShapes[1] -
      this._buffers.amountOfShapes[2];

    console.log('Прочие формы: ' + amountOfOtherShape.toLocaleString() +
      ' [~' + Math.round(100 * amountOfOtherShape / this._amountOfPolygons) + '%]');

    console.log('Палитра: ' + this.polygonPalette.length + ' цветов');

    console.groupEnd();

    let bytesUsedByBuffers = this._buffers.sizeInBytes[0] +
      this._buffers.sizeInBytes[1] + this._buffers.sizeInBytes[2];

    // Группа "Занято видеопамяти".
    console.group('Занято видеопамяти: ' +
      (bytesUsedByBuffers / 1000000).toFixed(2).toLocaleString() + ' МБ');

    console.log('Буферы вершин: ' +
      (this._buffers.sizeInBytes[0] / 1000000).toFixed(2).toLocaleString() + ' МБ' +
      ' [~' + Math.round(100 * this._buffers.sizeInBytes[0] / bytesUsedByBuffers) + '%]');

    console.log('Буферы цветов: '
      + (this._buffers.sizeInBytes[1] / 1000000).toFixed(2).toLocaleString() + ' МБ' +
      ' [~' + Math.round(100 * this._buffers.sizeInBytes[1] / bytesUsedByBuffers) + '%]');

    console.log('Буферы индексов: '
      + (this._buffers.sizeInBytes[2] / 1000000).toFixed(2).toLocaleString() + ' МБ' +
      ' [~' + Math.round(100 * this._buffers.sizeInBytes[2] / bytesUsedByBuffers) + '%]');

    console.groupEnd();

    console.log('Кол-во групп буферов: ' +
      this._buffers.amountOfBufferGroups.toLocaleString());

    console.log('Кол-во GL-треугольников: ' +
      (this._buffers.amountOfTotalPrimitiveVertices / 3).toLocaleString());

    console.log('Кол-во вершин: ' +
      this._buffers.amountOfTotalVertices.toLocaleString());

    console.groupEnd();
  }

  /**
   * Создает дополнение к коду на языке GLSL. Созданный код будет встроен в код
   * вершинного шейдера WebGL для задания цвета вершины в зависимости от индекса
   * цвета, присвоенного этой вершине. Т.к. шейдер не позволяет использовать в
   * качестве индексов переменные - для задания цвета используется перебор индексов.
   *
   * @private
   * @return {string} Код на языке GLSL.
   */
  _genShaderColorCode() {

    // Временно добавляем в палитру цветов вершин цвет для направляющих.
    this.polygonPalette.push(this.rulesColor);

    let code = '';

    for (let i = 0; i < this.polygonPalette.length; i++) {

      // Получение цвета в нужном формате.
      let [r, g, b] = this._convertColor(this.polygonPalette[i]);

      // Формировние строк GLSL-кода проверки индекса цвета.
      code += ((i === 0) ? '' : '  else ') +
        'if (a_color == ' + i + '.0) v_color = vec3(' +
        r.toString().slice(0, 9) + ',' +
        g.toString().slice(0, 9) + ',' +
        b.toString().slice(0, 9) + ');\n';
    }

    // Удаляем из палитры вершин временно добавленный цвет направляющих.
    this.polygonPalette.pop();

    return code;
  }

  /**
   * Конвертирует цвет из HEX-представления ("#ffffff") в представление цвета для
   * GLSL-кода (RGB с диапазонами значений от 0 до 1).
   *
   * @private
   * @param {string} hexColor Код шейдера в HEX-формате.
   * @return {Array.<number>} Массив из трех чисел в диапазоне от 0 до 1.
   */
  _convertColor(hexColor) {

    let k = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor);
    let [r, g, b] = [parseInt(k[1], 16) / 255, parseInt(k[2], 16) / 255, parseInt(k[3], 16) / 255];

    return [r, g, b];
  }

  /**
   * Вычисляет текущее время.
   *
   * @private
   * @retutn {string} Строковая форматированная запись текущего времени.
   */
  _getCurrentTime() {

    let today = new Date();

    let time =
      ((today.getHours() < 10 ? '0' : '') + today.getHours()) + ":" +
      ((today.getMinutes() < 10 ? '0' : '') + today.getMinutes()) + ":" +
      ((today.getSeconds() < 10 ? '0' : '') + today.getSeconds());

    return time;
  }

  /**
   * Создает и добавляет в группу полигонов новый полигон - квадрат.
   *
   * @private
   * @param {HTMLCanvasElement} canvas Объект-канвас необходим, чтобы метод имел
   *     возможность обращаться к матрице трансформации экземпляра независимо от
   *     того, из какого места был вызван метод. Существует два варианта вызова
   *     метода - из другого метода экземпляра (render) и из обработчика события
   *     мыши (_handleMouseWheel). Во втором варианте использование объекта this
   *     невозможно.
   */
  _updateTransMatrix(canvas) {

    // Хак получения доступа к объекту this.
    const $this = canvas.scatterplot;

    const t1 = $this.camera.zoom * $this._USEFUL_CONST[5];
    const t2 = $this.camera.zoom * $this._USEFUL_CONST[6];

    $this._transormation.matrix = [
      t1, 0, 0, 0, -t2, 0, -$this.camera.x * t1 - 1, $this.camera.y * t2 + 1, 1
    ];
  }

  /**
   * Реагирует на движение мыши/трекпада в момент, когда ее клавиша удерживается
   * нажатой. В этот момент область видимости перемещается на плоскости вместе
   * с движением мыши/трекпада. Вычисления внутри события сделаны максимально
   * производительными в ущерб читабельности логики производимых действий.
   *
   * @private
   * @param {MouseEvent} event Событие мыши/трекпада.
   */
  _handleMouseMove(event) {

    // Хак получения доступа к объекту this.
    const $this = event.target.scatterplot;

    $this.camera.x = $this._transormation.startCameraX + $this._transormation.startPosX -
      ((event.clientX - $this._USEFUL_CONST[9]) * $this._USEFUL_CONST[7] - 1) * $this._transormation.startInvMatrix[0] -
      $this._transormation.startInvMatrix[6];

    $this.camera.y = $this._transormation.startCameraY + $this._transormation.startPosY -
      ((event.clientY - $this._USEFUL_CONST[10]) * $this._USEFUL_CONST[8] + 1) * $this._transormation.startInvMatrix[4] -
      $this._transormation.startInvMatrix[7];

    // Рендеринг с новыми параметрами области видимости.
    $this._render();
  }

  /**
   * Реагирует на нажатие клавиши мыши/трекпада. В этот момент запускается анализ
   * движения мыши/трекпада (с зажатой клавишей). Вычисления внутри события сделаны
   * максимально производительными в ущерб читабельности логики производимых действий.
   *
   * @private
   * @param {MouseEvent} event Событие мыши/трекпада.
   */
  _handleMouseDown(event) {

    event.preventDefault();

    // Хак получения доступа к объекту this.
    const $this = event.target.scatterplot;

    event.target.addEventListener('mousemove', $this._handleMouseMove);
    event.target.addEventListener('mouseup', $this._handleMouseUp);

    $this._transormation.startInvMatrix = [
      1 / $this._transormation.matrix[0], 0, 0, 0, 1 / $this._transormation.matrix[4],
      0, -$this._transormation.matrix[6] / $this._transormation.matrix[0],
      -$this._transormation.matrix[7] / $this._transormation.matrix[4], 1
    ];

    $this._transormation.startCameraX = $this.camera.x;
    $this._transormation.startCameraY = $this.camera.y;

    $this._transormation.startPosX =
      ((event.clientX - $this._USEFUL_CONST[9]) * $this._USEFUL_CONST[7] - 1) *
      $this._transormation.startInvMatrix[0] + $this._transormation.startInvMatrix[6];

    $this._transormation.startPosY =
      ((event.clientY - $this._USEFUL_CONST[10]) * $this._USEFUL_CONST[8] + 1) *
      $this._transormation.startInvMatrix[4] + $this._transormation.startInvMatrix[7]
  }

  /**
   * Реагирует на отжатие клавиши мыши/трекпада. В этот момент анализ движения
   * мыши/трекпада с зажатой клавишей прекращается.
   *
   * @private
   * @param {MouseEvent} event Событие мыши/трекпада.
   */
  _handleMouseUp(event) {

    // Хак получения доступа к объекту this.
    const $this = event.target.scatterplot;

    event.target.removeEventListener('mousemove', $this._handleMouseMove);
    event.target.removeEventListener('mouseup', $this._handleMouseUp);
  }

  /**
   * Реагирует на зумирование мыши/трекпада. В этот момент происходит зумирование
   * координатной плоскости. Вычисления внутри события сделаны максимально
   * производительными в ущерб читабельности логики производимых действий.
   *
   * @private
   * @param {MouseEvent} event Событие мыши/трекпада.
   */
  _handleMouseWheel(event) {

    event.preventDefault();

    // Хак получения доступа к объекту this.
    const $this = event.target.scatterplot;

    const clipX = (event.clientX - $this._USEFUL_CONST[9]) * $this._USEFUL_CONST[7] - 1;
    const clipY = (event.clientY - $this._USEFUL_CONST[10]) * $this._USEFUL_CONST[8] + 1;

    const preZoomX = (clipX - $this._transormation.matrix[6]) / $this._transormation.matrix[0];
    const preZoomY = (clipY - $this._transormation.matrix[7]) / $this._transormation.matrix[4];

    const newZoom = $this.camera.zoom * Math.pow(2, event.deltaY * -0.01);
    $this.camera.zoom = Math.max(0.002, Math.min(200, newZoom));

    $this._updateTransMatrix(event.target);

    const postZoomX = (clipX - $this._transormation.matrix[6]) / $this._transormation.matrix[0];
    const postZoomY = (clipY - $this._transormation.matrix[7]) / $this._transormation.matrix[4];

    $this.camera.x += (preZoomX - postZoomX);
    $this.camera.y += (preZoomY - postZoomY);

    // Рендеринг с новыми параметрами области видимости.
    $this._render();
  }

  /**
   * Рисует плоскость в соответствии с текущими параметрами области видимости.
   *
   * @private
   */
  _render() {

    // Очистка объекта рендеринга WebGL.
    this._gl.clear(this._gl.COLOR_BUFFER_BIT);

    // Обновление матрицы трансформации.
    this._updateTransMatrix(this._canvas);

    // Привязка матрицы трансформации к переменной шейдера.
    this._gl.uniformMatrix3fv(this._variables['u_matrix'], false, this._transormation.matrix);

    // Итерирование и рендеринг всех буферов WebGL.
    for (let i = 0; i < this._buffers.amountOfBufferGroups; i++) {

      // Установка текущего буфера вершин и его привязка к переменной шейдера.
      this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._buffers.vertexBuffers[i]);
      this._gl.enableVertexAttribArray(this._variables['a_position']);
      this._gl.vertexAttribPointer(this._variables['a_position'],
        2, this._gl.FLOAT, false, 0, 0);

      // Установка текущего буфера цветов вершин и его привязка к переменной шейдера.
      this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._buffers.colorBuffers[i]);
      this._gl.enableVertexAttribArray(this._variables['a_color']);
      this._gl.vertexAttribPointer(this._variables['a_color'],
        1, this._gl.UNSIGNED_BYTE, false, 0, 0);

      // Установка текущего буфера индексов вершин.
      this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, this._buffers.indexBuffers[i]);

      // Отрисовка текущих буферов.
      this._gl.drawElements(this._gl.TRIANGLES, this._buffers.amountOfPrimitiveVertices[i],
        this._gl.UNSIGNED_SHORT, 0);
    }
  }

  /**
   * Генерирует случайное целое число в диапазоне от 0 до заданного предела. Сам
   * предел в диапазон не входит: [0...range-1].
   *
   * @private
   * @param {number} range Верхний предел диапазона случайного выбора.
   * @return {number} Сгенерированное случайное число.
   */
  _randomInt(range) {
    return Math.floor(Math.random() * range);
  }

  /**
   * Случайным образом возвращает одно из трех чисел - 0, 1 или 2. Несмотря на
   * случайность каждого конкретного вызова метода, числа возвращаются с
   * предопределенной частотой. Частота всех трех чисел задается массивом
   * demoMode.shapeQuota, каждый элемент которого задает частоту выпадания
   * соответствующего из чисел 0, 1 или 2 на большом количестве вызовов метода.
   *
   * @private
   * @return {number} Число 0, 1 или 2.
   */
  _randomShape() {

    let a = [
      this.demoMode.shapeQuota[0],
      this.demoMode.shapeQuota[0] + this.demoMode.shapeQuota[1],
      this.demoMode.shapeQuota[0] + this.demoMode.shapeQuota[1] + this.demoMode.shapeQuota[2]
    ];

    let r = Math.floor((Math.random() * a[2])) + 1;
    let [l, h] = [0, 2];

    while (l < h) {
      const m = l + ((h - l) >> 1);
      (r > a[m]) ? (l = m + 1) : (h = m);
    }

    return (a[l] >= r) ? l : -1;
  }

  /**
   * Имитирует итерирование исходных объектов. При каждом новом вызове возвращает
   * информацию о полигоне со случаным положением, случайной формой и случайным цветом.
   *
   * @private
   * @return {(SPlotPolygonInfo|null)} Информация о полигоне или null, если перебор
   *     исходных объектов закончился.
   */
  _demoIterationCallback() {
    if (this.demoMode.index < this.demoMode.amount) {
      this.demoMode.index++;
      return {
        x: this._randomInt(this.gridSize.width),
        y: this._randomInt(this.gridSize.height),
        shape: this._randomShape(),
        color: this._randomInt(this.polygonPalette.length)
      }
    }
    else
      return null;
  }

  /**
   * Запускает рендеринг и "прослушку" событий мыши на канвасе.
   *
   * @public
   */
  run() {
    if (!this._isRunning) {

      this._canvas.addEventListener('mousedown', this._handleMouseDown);
      this._canvas.addEventListener('wheel', this._handleMouseWheel);

      this._render();

      this._isRunning = true;
    }

    // Вывод отладочной информации.
    if (this.debugMode.isEnable) {
      console.log('%cРендеринг запущен', this._debugStyle);
    }
  }

  /**
   * Останавливает рендеринг и "прослушку" событий мыши на канвасе.
   *
   * @public
   * @param {boolean} clear Признак неообходимости вместе с остановкой рендеринга
   *     очистить канвас. Значение true очищает канвас, значение false - не очищает.
   *     По умолчанию очистка не происходит.
   */
  stop(clear = false) {

    if (this._isRunning) {

      this._canvas.removeEventListener('mousedown', this._handleMouseDown);
      this._canvas.removeEventListener('wheel', this._handleMouseWheel);
      this._canvas.removeEventListener('mousemove', this._handleMouseMove);
      this._canvas.removeEventListener('mouseup', this._handleMouseUp);

      if (clear) {
        this.clear();
      }

      this._isRunning = false;
    }

    // Вывод отладочной информации.
    if (this.debugMode.isEnable) {
      console.log('%cРендеринг остановлен', this._debugStyle);
    }
  }

  /**
   * Очищает канвас, закрашивая его в фоновый цвет.
   *
   * @public
   */
  clear() {

    this._gl.clear(this._gl.COLOR_BUFFER_BIT);

    // Вывод отладочной информации.
    if (this.debugMode.isEnable) {
      console.log('%cКонтекст рендеринга очищен [' + this.bgColor + ']', this._debugStyle);
    }
  }
}
