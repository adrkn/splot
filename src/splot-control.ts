// @ts-ignore
import m3 from './m3'
import SPlot from './splot'

export default class SPlotContol {

  private canvas!: HTMLCanvasElement
  private camera!: SPlotCamera
  private render!: () => void

  // Техническая информация, используемая приложением для расчета трансформаций.
  public transform: SPlotTransform = {
    viewProjectionMat: [],
    startInvViewProjMat: [],
    startCamera: { x: 0, y: 0, zoom: 1 },
    startPos: [],
    startClipPos: [],
    startMousePos: []
  }

  protected handleMouseDownWithContext: EventListener = this.handleMouseDown.bind(this) as EventListener
  protected handleMouseWheelWithContext: EventListener = this.handleMouseWheel.bind(this) as EventListener
  protected handleMouseMoveWithContext: EventListener = this.handleMouseMove.bind(this) as EventListener
  protected handleMouseUpWithContext: EventListener = this.handleMouseUp.bind(this) as EventListener

  prepare(splot: SPlot) {
    this.canvas = splot.webgl.canvas
    this.camera = splot.camera
    this.render = splot.render.bind(splot)
  }

  public run() {
    this.canvas.addEventListener('mousedown', this.handleMouseDownWithContext)
    this.canvas.addEventListener('wheel', this.handleMouseWheelWithContext)
  }

  public stop() {
    this.canvas.removeEventListener('mousedown', this.handleMouseDownWithContext)
    this.canvas.removeEventListener('wheel', this.handleMouseWheelWithContext)
    this.canvas.removeEventListener('mousemove', this.handleMouseMoveWithContext)
    this.canvas.removeEventListener('mouseup', this.handleMouseUpWithContext)
  }

  protected makeCameraMatrix() {

    const zoomScale = 1 / this.camera.zoom!;

    let cameraMat = m3.identity();
    cameraMat = m3.translate(cameraMat, this.camera.x, this.camera.y);
    cameraMat = m3.scale(cameraMat, zoomScale, zoomScale);

    return cameraMat;
  }

  /**
   * Обновляет матрицу трансформации.
   *
   * @remarks
   * Существует два варианта вызова метода - из другого метода экземпляра ({@link render}) и из обработчика события мыши
   * ({@link handleMouseWheel}). Во втором варианте использование объекта this невозможно. Для универсальности вызова
   * метода - в него всегда явно необходимо передавать ссылку на экземпляр класса.
   */
  public updateViewProjection(): void {

    const projectionMat = m3.projection(this.canvas.width, this.canvas.height);
    const cameraMat = this.makeCameraMatrix();
    let viewMat = m3.inverse(cameraMat);
    this.transform.viewProjectionMat = m3.multiply(projectionMat, viewMat);
  }

  /**
   *
   */
  protected getClipSpaceMousePosition(event: MouseEvent) {

    // get canvas relative css position
    const rect = this.canvas.getBoundingClientRect();
    const cssX = event.clientX - rect.left;
    const cssY = event.clientY - rect.top;

    // get normalized 0 to 1 position across and down canvas
    const normalizedX = cssX / this.canvas.clientWidth;
    const normalizedY = cssY / this.canvas.clientHeight;

    // convert to clip space
    const clipX = normalizedX * 2 - 1;
    const clipY = normalizedY * -2 + 1;

    return [clipX, clipY];
  }

  /**
   *
   */
  protected moveCamera(event: MouseEvent): void {

    const pos = m3.transformPoint(
      this.transform.startInvViewProjMat,
      this.getClipSpaceMousePosition(event)
    );

    this.camera.x =
      this.transform.startCamera.x! + this.transform.startPos[0] - pos[0];

    this.camera.y =
      this.transform.startCamera.y! + this.transform.startPos[1] - pos[1];

    this.render();
  }

  /**
   * Реагирует на движение мыши/трекпада в момент, когда ее/его клавиша удерживается нажатой.
   *
   * @remerks
   * Метод перемещает область видимости на плоскости вместе с движением мыши/трекпада. Вычисления внутри события сделаны
   * максимально производительными в ущерб читабельности логики действий. Во внешнем обработчике событий объект this
   * недоступен поэтому доступ к экземпляру класса реализуется через статический массив всех созданных экземпляров
   * класса и идентификатора канваса, выступающего индексом в этом массиве.
   *
   * @param event - Событие мыши/трекпада.
   */
  protected handleMouseMove(event: MouseEvent): void {
    this.moveCamera.call(this, event);
  }

  /**
   * Реагирует на отжатие клавиши мыши/трекпада.
   *
   * @remerks
   * В момент отжатия клавиши анализ движения мыши/трекпада с зажатой клавишей прекращается. Вычисления внутри события
   * сделаны максимально производительными в ущерб читабельности логики действий. Во внешнем обработчике событий объект
   * this недоступен поэтому доступ к экземпляру класса реализуется через статический массив всех созданных экземпляров
   * класса и идентификатора канваса, выступающего индексом в этом массиве.
   *
   * @param event - Событие мыши/трекпада.
   */
  protected handleMouseUp(event: MouseEvent): void {
    this.render();
    event.target!.removeEventListener('mousemove', this.handleMouseMoveWithContext);
    event.target!.removeEventListener('mouseup', this.handleMouseUpWithContext);
  }

  /**
   * Реагирует на нажатие клавиши мыши/трекпада.
   *
   * @remerks
   * В момент нажатия и удержания клавиши запускается анализ движения мыши/трекпада (с зажатой клавишей). Вычисления
   * внутри события сделаны максимально производительными в ущерб читабельности логики действий. Во внешнем обработчике
   * событий объект this недоступен поэтому доступ к экземпляру класса реализуется через статический массив всех
   * созданных экземпляров класса и идентификатора канваса, выступающего индексом в этом массиве.
   *
   * @param event - Событие мыши/трекпада.
   */
  protected handleMouseDown(event: MouseEvent): void {

    event.preventDefault();
    this.canvas.addEventListener('mousemove', this.handleMouseMoveWithContext);
    this.canvas.addEventListener('mouseup', this.handleMouseUpWithContext);

    this.transform.startInvViewProjMat = m3.inverse(this.transform.viewProjectionMat);
    this.transform.startCamera = Object.assign({}, this.camera);
    this.transform.startClipPos = this.getClipSpaceMousePosition.call(this, event);
    this.transform.startPos = m3.transformPoint(this.transform.startInvViewProjMat, this.transform.startClipPos);
    this.transform.startMousePos = [event.clientX, event.clientY];

    this.render();
  }

  /**
   * Реагирует на зумирование мыши/трекпада.
   *
   * @remerks
   * В момент зумирования мыши/трекпада происходит зумирование координатной плоскости. Вычисления внутри события
   * сделаны максимально производительными в ущерб читабельности логики действий. Во внешнем обработчике событий объект
   * this недоступен поэтому доступ к экземпляру класса реализуется через статический массив всех созданных экземпляров
   * класса и идентификатора канваса, выступающего индексом в этом массиве.
   *
   * @param event - Событие мыши/трекпада.
   */
  protected handleMouseWheel(event: WheelEvent): void {

    event.preventDefault();
    const [clipX, clipY] = this.getClipSpaceMousePosition.call(this, event);

    // position before zooming
    const [preZoomX, preZoomY] = m3.transformPoint(m3.inverse(this.transform.viewProjectionMat), [clipX, clipY]);

    // multiply the wheel movement by the current zoom level, so we zoom less when zoomed in and more when zoomed out
    const newZoom = this.camera.zoom! * Math.pow(2, event.deltaY * -0.01);
    this.camera.zoom = Math.max(0.002, Math.min(200, newZoom));

    this.updateViewProjection.call(this);

    // position after zooming
    const [postZoomX, postZoomY] = m3.transformPoint(m3.inverse(this.transform.viewProjectionMat), [clipX, clipY]);

    // camera needs to be moved the difference of before and after
    this.camera.x! += preZoomX - postZoomX;
    this.camera.y! += preZoomY - postZoomY;

    this.render();
  }
}
