// @ts-ignore
import m3 from './m3'
import SPlot from './splot'

export default class SPlotContol {

  private splot: SPlot

  protected handleMouseDownWithContext: EventListener = this.handleMouseDown.bind(this) as EventListener
  protected handleMouseWheelWithContext: EventListener = this.handleMouseWheel.bind(this) as EventListener
  protected handleMouseMoveWithContext: EventListener = this.handleMouseMove.bind(this) as EventListener
  protected handleMouseUpWithContext: EventListener = this.handleMouseUp.bind(this) as EventListener

  constructor(splot: SPlot) {
    this.splot = splot
  }

  public run() {
    this.splot.webGl.canvas.addEventListener('mousedown', this.handleMouseDownWithContext)
    this.splot.webGl.canvas.addEventListener('wheel', this.handleMouseWheelWithContext)
  }

  public stop() {
    this.splot.webGl.canvas.removeEventListener('mousedown', this.handleMouseDownWithContext)
    this.splot.webGl.canvas.removeEventListener('wheel', this.handleMouseWheelWithContext)
    this.splot.webGl.canvas.removeEventListener('mousemove', this.handleMouseMoveWithContext)
    this.splot.webGl.canvas.removeEventListener('mouseup', this.handleMouseUpWithContext)
  }

  protected makeCameraMatrix() {

    const zoomScale = 1 / this.splot.camera.zoom!;

    let cameraMat = m3.identity();
    cameraMat = m3.translate(cameraMat, this.splot.camera.x, this.splot.camera.y);
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

    const projectionMat = m3.projection(this.splot.webGl.gl.canvas.width, this.splot.webGl.gl.canvas.height);
    const cameraMat = this.makeCameraMatrix();
    let viewMat = m3.inverse(cameraMat);
    this.splot.transform.viewProjectionMat = m3.multiply(projectionMat, viewMat);
  }

  /**
   *
   */
  protected getClipSpaceMousePosition(event: MouseEvent) {

    // get canvas relative css position
    const rect = this.splot.webGl.canvas.getBoundingClientRect();
    const cssX = event.clientX - rect.left;
    const cssY = event.clientY - rect.top;

    // get normalized 0 to 1 position across and down canvas
    const normalizedX = cssX / this.splot.webGl.canvas.clientWidth;
    const normalizedY = cssY / this.splot.webGl.canvas.clientHeight;

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
      this.splot.transform.startInvViewProjMat,
      this.getClipSpaceMousePosition(event)
    );

    this.splot.camera.x =
      this.splot.transform.startCamera.x! + this.splot.transform.startPos[0] - pos[0];

    this.splot.camera.y =
      this.splot.transform.startCamera.y! + this.splot.transform.startPos[1] - pos[1];

    this.splot.render();
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
    this.splot.render();
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
    this.splot.webGl.canvas.addEventListener('mousemove', this.handleMouseMoveWithContext);
    this.splot.webGl.canvas.addEventListener('mouseup', this.handleMouseUpWithContext);

    this.splot.transform.startInvViewProjMat = m3.inverse(this.splot.transform.viewProjectionMat);
    this.splot.transform.startCamera = Object.assign({}, this.splot.camera);
    this.splot.transform.startClipPos = this.getClipSpaceMousePosition.call(this, event);
    this.splot.transform.startPos = m3.transformPoint(this.splot.transform.startInvViewProjMat, this.splot.transform.startClipPos);
    this.splot.transform.startMousePos = [event.clientX, event.clientY];

    this.splot.render();
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
    const [preZoomX, preZoomY] = m3.transformPoint(m3.inverse(this.splot.transform.viewProjectionMat), [clipX, clipY]);

    // multiply the wheel movement by the current zoom level, so we zoom less when zoomed in and more when zoomed out
    const newZoom = this.splot.camera.zoom! * Math.pow(2, event.deltaY * -0.01);
    this.splot.camera.zoom = Math.max(0.002, Math.min(200, newZoom));

    this.updateViewProjection.call(this);

    // position after zooming
    const [postZoomX, postZoomY] = m3.transformPoint(m3.inverse(this.splot.transform.viewProjectionMat), [clipX, clipY]);

    // camera needs to be moved the difference of before and after
    this.splot.camera.x! += preZoomX - postZoomX;
    this.splot.camera.y! += preZoomY - postZoomY;

    this.splot.render();
  }
}
