import SPlot from '@/splot'

/** ****************************************************************************
 *
 * Класс-хелпер, реализующий обработку средств ввода (мыши, трекпада и т.п.) и математические расчеты технических данных,
 * соответсвующих трансформациям графика для класса Splot.
 */
export default class SPlotContol implements SPlotHelper {

  /** Техническая информация, используемая приложением для расчета трансформаций. */
  public transform: SPlotTransform = {
    viewProjectionMat: [],
    startInvViewProjMat: [],
    startCamera: { x: 0, y: 0, zoom: 1 },
    startPos: [],
  }

  /** Признак того, что хелпер уже настроен. */
  public isSetuped: boolean = false

  /** Обработчики событий с закрепленными контекстами. */
  protected handleMouseDownWithContext: EventListener = this.handleMouseDown.bind(this) as EventListener
  protected handleMouseWheelWithContext: EventListener = this.handleMouseWheel.bind(this) as EventListener
  protected handleMouseMoveWithContext: EventListener = this.handleMouseMove.bind(this) as EventListener
  protected handleMouseUpWithContext: EventListener = this.handleMouseUp.bind(this) as EventListener

  /** Хелпер будет иметь полный доступ к экземпляру SPlot. */
  constructor(
    readonly splot: SPlot
  ) { }

  /** ****************************************************************************
   *
   * Подготавливает хелпер к использованию.
   */
  setup(): void {
    if (!this.isSetuped) {
      this.isSetuped = true
    }
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
   * Обновляет матрицу трансформации.
   */
  public updateViewProjection(): void {

    const canvas = this.splot.canvas
    const camera = this.splot.camera

    const d0 = camera.zoom!
    const d1 = 2 / canvas.width * d0
    const d2 = 2 / canvas.height * d0

    this.transform.viewProjectionMat = [ d1, 0, 0, 0, -d2, 0, -d1 * camera.x! - 1, d2 * camera.y!, 1 ]
  }

  /** ****************************************************************************
   *
   * Преобразует координаты мыши в GL-координаты.
   */
  protected getClipSpaceMousePosition(event: MouseEvent): number[] {

    const canvas = this.splot.canvas

    const rect = canvas.getBoundingClientRect()

    const clipX =  2 * ((event.clientX - rect.left) / canvas.clientWidth) - 1
    const clipY = -2 * ((event.clientY - rect.top) / canvas.clientHeight) + 1

    return [clipX, clipY]
  }

  /** ****************************************************************************
   *
   * Реагирует на движение мыши в момент, когда ее клавиша удерживается нажатой. Метод перемещает область видимости на
   * плоскости вместе с движением мыши.
   */
  protected handleMouseMove(event: MouseEvent): void {

    const splot = this.splot
    const transform = this.transform
    const matrix = transform.startInvViewProjMat
    const [clipX, clipY] = this.getClipSpaceMousePosition(event)

    splot.camera.x = transform.startCamera.x! + transform.startPos[0] - clipX * matrix[0] - matrix[6]
    splot.camera.y = transform.startCamera.y! + transform.startPos[1] - clipY * matrix[4] - matrix[7]

    splot.render()
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

    const splot = this.splot
    const transform = this.transform

    splot.canvas.addEventListener('mousemove', this.handleMouseMoveWithContext)
    splot.canvas.addEventListener('mouseup', this.handleMouseUpWithContext)

    let matrix = transform.viewProjectionMat
    transform.startInvViewProjMat = [1 / matrix[0], 0, 0, 0, 1 / matrix[4], 0, -matrix[6] / matrix[0], -matrix[7] / matrix[4], 1]

    transform.startCamera = { x: splot.camera.x, y: splot.camera.y, zoom: splot.camera.zoom }

    const [clipX, clipY] = this.getClipSpaceMousePosition(event)
    matrix = transform.startInvViewProjMat
    transform.startPos[0] = clipX * matrix[0] + matrix[6]
    transform.startPos[1] = clipY * matrix[4] + matrix[7]

    splot.render()
  }

  /** ****************************************************************************
   *
   * Реагирует на зумирование мыши. В момент зумирования мыши происходит зумирование координатной плоскости.
   */
  protected handleMouseWheel(event: WheelEvent): void {

    event.preventDefault()

    const camera = this.splot.camera

    /** Вычисление позиции мыши в GL-координатах. */
    const [clipX, clipY] = this.getClipSpaceMousePosition(event)

    /** Позиция мыши до зумирования. */
    let matrix = this.transform.viewProjectionMat
    const preZoomX = (clipX - matrix[6]) / matrix[0]
    const preZoomY = (clipY  - matrix[7]) / matrix[4]

    /** Новое значение зума области просмотра экспоненциально зависит от величины зумирования мыши. */
    const newZoom = camera.zoom! * Math.pow(2, event.deltaY * -0.01)

    /** Максимальное и минимальное значения зума области просмотра. */
    camera.zoom = Math.max(0.002, Math.min(200, newZoom))

    /** Обновление матрицы трансформации. */
    this.updateViewProjection()

    /** Позиция мыши после зумирования. */
    matrix = this.transform.viewProjectionMat
    const postZoomX = (clipX - matrix[6]) / matrix[0]
    const postZoomY = (clipY - matrix[7]) / matrix[4]

    /** Вычисление нового положения области просмотра после зумирования. */
    camera.x! += preZoomX - postZoomX
    camera.y! += preZoomY - postZoomY

    this.splot.render()
  }
}
