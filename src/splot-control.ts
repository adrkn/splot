import * as m3 from './m3'
import SPlot from './splot'

/** ****************************************************************************
 *
 * Класс-хелпер, реализующий обработку средств ввода (мыши, трекпада и т.п.) и математические расчеты технических данных,
 * соответсвующих трансформациям графика для класса Splot.
 */
export default class SPlotContol {

  /** Техническая информация, используемая приложением для расчета трансформаций. */
  public transform: SPlotTransform = {
    viewProjectionMat: [],
    startInvViewProjMat: [],
    startCamera: { x: 0, y: 0, zoom: 1 },
    startPos: [],
    startClipPos: [],
    startMousePos: []
  }

  /** Обработчики событий средств ввода с закрепленными контекстами. */
  protected handleMouseDownWithContext: EventListener = this.handleMouseDown.bind(this) as EventListener
  protected handleMouseWheelWithContext: EventListener = this.handleMouseWheel.bind(this) as EventListener
  protected handleMouseMoveWithContext: EventListener = this.handleMouseMove.bind(this) as EventListener
  protected handleMouseUpWithContext: EventListener = this.handleMouseUp.bind(this) as EventListener

  /** Хелпер будет иметь полный доступ к экземпляру SPlot. */
  constructor(
    private readonly splot: SPlot
  ) { }

  /** ****************************************************************************
   *
   * Подготавливает хелпер к использованию.
   */
  setup(): void {

  }

  /** ****************************************************************************
   *
   * Запускает прослушку событий мыши.
   */
  public run(): void {
    this.splot.canvas.addEventListener('mousedown', this.handleMouseDownWithContext)
    this.splot.canvas.addEventListener('wheel', this.handleMouseWheelWithContext)
  }

  /** ****************************************************************************
   *
   * Останавливает прослушку событий мыши.
   */
  public stop(): void {
    this.splot.canvas.removeEventListener('mousedown', this.handleMouseDownWithContext)
    this.splot.canvas.removeEventListener('wheel', this.handleMouseWheelWithContext)
    this.splot.canvas.removeEventListener('mousemove', this.handleMouseMoveWithContext)
    this.splot.canvas.removeEventListener('mouseup', this.handleMouseUpWithContext)
  }

  /** ****************************************************************************
   *
   *
   */
  protected makeCameraMatrix(): number[] {

    const zoomScale = 1 / this.splot.camera.zoom!

    let cameraMat = m3.identity()
    cameraMat = m3.translate(cameraMat, this.splot.camera.x!, this.splot.camera.y!)
    cameraMat = m3.scale(cameraMat, zoomScale, zoomScale)

    return cameraMat
  }

  /** ****************************************************************************
   *
   * Обновляет матрицу трансформации.
   */
  public updateViewProjection(): void {
    const projectionMat = m3.projection(this.splot.canvas.width, this.splot.canvas.height)
    const cameraMat = this.makeCameraMatrix()
    let viewMat = m3.inverse(cameraMat)
    this.transform.viewProjectionMat = m3.multiply(projectionMat, viewMat)
  }

  /** ****************************************************************************
   *
   * Преобразует координаты мыши в GL-координаты.
   */
  protected getClipSpaceMousePosition(event: MouseEvent): number[] {

    // get canvas relative css position
    const rect = this.splot.canvas.getBoundingClientRect()
    const cssX = event.clientX - rect.left
    const cssY = event.clientY - rect.top

    /** Нормализация координат [0..1] */
    const normX = cssX / this.splot.canvas.clientWidth
    const normY = cssY / this.splot.canvas.clientHeight

    /** Получение GL-координат [-1..1] */
    const clipX = normX * 2 - 1
    const clipY = normY * -2 + 1

    return [clipX, clipY]
  }

  /** ****************************************************************************
   *
   *
   */
  protected moveCamera(event: MouseEvent): void {

    const pos = m3.transformPoint(this.transform.startInvViewProjMat, this.getClipSpaceMousePosition(event))

    this.splot.camera.x = this.transform.startCamera.x! + this.transform.startPos[0] - pos[0]
    this.splot.camera.y = this.transform.startCamera.y! + this.transform.startPos[1] - pos[1]

    this.splot.render()
  }

  /** ****************************************************************************
   *
   * Реагирует на движение мыши в момент, когда ее клавиша удерживается нажатой. Метод перемещает область видимости на
   * плоскости вместе с движением мыши.
   */
  protected handleMouseMove(event: MouseEvent): void {
    this.moveCamera(event)
  }

  /** ****************************************************************************
   *
   * Реагирует на отжатие клавиши мыши. В момент отжатия клавиши анализ движения мыши с зажатой клавишей прекращается.
   */
  protected handleMouseUp(event: MouseEvent): void {
    this.splot.render()
    event.target!.removeEventListener('mousemove', this.handleMouseMoveWithContext)
    event.target!.removeEventListener('mouseup', this.handleMouseUpWithContext)
  }

  /** ****************************************************************************
   *
   * Реагирует на нажатие клавиши мыши. В момент нажатия и удержания клавиши запускается анализ движения мыши (с зажатой
   * клавишей).
   */
  protected handleMouseDown(event: MouseEvent): void {

    event.preventDefault()
    this.splot.canvas.addEventListener('mousemove', this.handleMouseMoveWithContext)
    this.splot.canvas.addEventListener('mouseup', this.handleMouseUpWithContext)

    this.transform.startInvViewProjMat = m3.inverse(this.transform.viewProjectionMat)
    this.transform.startCamera = Object.assign({}, this.splot.camera)
    this.transform.startClipPos = this.getClipSpaceMousePosition(event)
    this.transform.startPos = m3.transformPoint(this.transform.startInvViewProjMat, this.transform.startClipPos)
    this.transform.startMousePos = [event.clientX, event.clientY]

    this.splot.render()
  }

  /** ****************************************************************************
   *
   * Реагирует на зумирование мыши. В момент зумирования мыши происходит зумирование координатной плоскости.
   */
  protected handleMouseWheel(event: WheelEvent): void {

    event.preventDefault()
    const [clipX, clipY] = this.getClipSpaceMousePosition(event)

    // position before zooming
    const [preZoomX, preZoomY] = m3.transformPoint(m3.inverse(this.transform.viewProjectionMat), [clipX, clipY])

    // multiply the wheel movement by the current zoom level, so we zoom less when zoomed in and more when zoomed out
    const newZoom = this.splot.camera.zoom! * Math.pow(2, event.deltaY * -0.01)
    this.splot.camera.zoom = Math.max(0.002, Math.min(200, newZoom))

    this.updateViewProjection()

    // position after zooming
    const [postZoomX, postZoomY] = m3.transformPoint(m3.inverse(this.transform.viewProjectionMat), [clipX, clipY])

    // camera needs to be moved the difference of before and after
    this.splot.camera.x! += preZoomX - postZoomX
    this.splot.camera.y! += preZoomY - postZoomY

    this.splot.render()
  }
}
