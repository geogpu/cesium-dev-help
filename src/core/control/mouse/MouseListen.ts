import { Cesium } from '../../outsource/LibManager';
class MouseListen {
  private click_LEFT_CLICK_Time: Date
  private clickPositionsArrays: Cesium.Cartesian3[][]
  private handler: Cesium.ScreenSpaceEventHandler
  private clickPositionsStatic: Cesium.Cartesian3[]

  public viewer: Cesium.Viewer
  public clickPositions: Cesium.Cartesian3[]

  /**
   * 监听器 记录鼠标移动点选双击
   *
   * @param {*} viewer
   */
  constructor(viewer) {
    this.viewer = viewer
    this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas)
  }

  /**
   * 监听鼠标状态 鼠标场景位置集合
   * （自行继承组织点线面切面等几何图形）
   */
  stateStart() {
    this.clickPositionsArrays = [] //多次
    this.clickPositions = [new Cesium.Cartesian3()] //动态单次  使用数组最后一位记录移动标识
    this.click_LEFT_CLICK_Time = new Date()
  }

  drawListen() {
    this.stateStart()

    // 动态
    this.handler.setInputAction((movement) => {
      if (!movement.endPosition) {
        return
      }
      const clickScene = this.viewer.scene.pickPosition(movement.endPosition) //let clickWindow = click.position/movement.endPosition
      // if (clickScene) { this.clickPositions[this.clickPositions.length - 1] = clickScene }
      if (clickScene) {
        this.clickPositions[this.clickPositions.length - 1] = clickScene
      }
      this.clickMouseMove = this.clickPositions
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

    // 过程固定
    this.handler.setInputAction((click) => {
      const clickScene = this.viewer.scene.pickPosition(click.position) //防止空洞选取
      if (clickScene && this.singleLeftClickBool()) {

        //单击和双击第一次点击  直接保留最后
        this.click_LEFT_CLICK = this.clickPositions

        // 默认监move听到最后一点，随意加移动新点
        this.clickPositions.push(clickScene) //0
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

    // 固定
    this.handler.setInputAction((click) => {
      const clickWindow = click.position
      const clickScene = this.viewer.scene.pickPosition(clickWindow)
      if (clickScene) {

        // 剔除最后移动点
        this.clickPositions.pop()

        //位置集合 直接保留最后
        this.clickPositionsArrays.push(this.clickPositions)
        this.clickPositionsStatic = this.clickPositions.slice(0)
        this.click_LEFT_DOUBLE_CLICK = this.clickPositions

        /***********************************注意重置本次鼠标记录数组 添加移动点0****************************************** */
        this.clickPositions = [new Cesium.Cartesian3()]
      }
    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
  }

  // 监听
  set clickMouseMove(value: Cesium.Cartesian3[]) {
    this.test()
  }
  set click_LEFT_CLICK(value: Cesium.Cartesian3[]) {
    this.test()
  }
  set click_LEFT_DOUBLE_CLICK(value: Cesium.Cartesian3[]) {
    this.test()
  }

  removeAll() {
    if (this.handler) {
      this.handler.destroy()
      this.handler = null
    }
    this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas)
    this.clickPositionsArrays = null //多次集成
    this.clickPositions = null //动态单次
  }

  /**
   * 判断此次点击 单击true/双击false  默认双击包含最后一次单击
   * @returns
   */
  singleLeftClickBool() {
    const click_LEFT_CLICK_TimeNew = new Date()
    const leftClickTimeBool = click_LEFT_CLICK_TimeNew.getTime() - this.click_LEFT_CLICK_Time.getTime() > 300 //时间判定mm
    const leftClickDistanceBool =
      this.clickPositions.length < 2 || //第一次点选默认距离符合单击
      Cesium.Cartesian3.distance(
        this.clickPositions[this.clickPositions.length - 1],
        this.clickPositions[this.clickPositions.length - 2]
      ) > 0.1 //双击距离判定m
    this.click_LEFT_CLICK_Time = click_LEFT_CLICK_TimeNew

    return leftClickTimeBool || leftClickDistanceBool
  }

  test() {
    console.log(this.clickPositions)
    console.log(this.clickPositionsArrays)
  }
}
export { MouseListen }
