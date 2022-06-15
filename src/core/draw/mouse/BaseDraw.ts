import { MouseListen } from "../../control/mouse/MouseListen"
import { RenderSimple } from '../../renderGeom/RenderSimple'
import { Cesium } from '../../outsource/LibManager';
class BaseDraw extends MouseListen {
  private pointDrawBool: boolean
  private lineDrawBool: boolean
  private polygonDrawBool: boolean
  lineGroundDrawBool: boolean
  polygonGroundDrawBool: boolean
  storeEntities: boolean
  linearr: any[]
  pointColor: Cesium.Color
  lineColor: Cesium.Color
  polygonColor: Cesium.Color
  PrimitiveAll: any
  entities: Cesium.EntityCollection
  mouseMovePointPrimitives: any
  mouseMovePointPrimitivesCollection: any
  pointPrimitives: any
  thisPpolylinePrimitive: any
  polygonPrimitives: any
  _polylineGroundPrimitive: any
  _polygonGroundPrimitive: any
  mouseLinePrimitive: any
  mousePolygonGroundEntity: any
  mouseLineGroundEntity: any
   clickPositions: any

  /**
   * 基础绘制类  点线面 （贴地点，贴地线,贴地面）
   * 自行继承组织点线面切面等几何图形
   * @param {*} viewer
   */
  constructor(viewer) {
    super(viewer)

    // 绘制开关  支持种类
    this.pointDrawBool = false
    this.lineDrawBool = false
    this.polygonDrawBool = false
    this.lineGroundDrawBool = false
    this.polygonGroundDrawBool = false

    this.storeEntities = false

    this.linearr = [];
  }
  randomColor() {
    this.pointColor = Cesium.Color.fromRandom()
    this.lineColor = Cesium.Color.fromAlpha(this.pointColor, 0.7)
    this.polygonColor = Cesium.Color.fromAlpha(this.pointColor, 0.3)
  }
  stateStart() {
    super.stateStart()
    this.randomColor()

    // 总绘制
    this.PrimitiveAll = this.PrimitiveAll ||
      this.viewer.scene.primitives.add(new Cesium.PrimitiveCollection())

    // entity 总绘制
    const myEntityCollection = new Cesium.CustomDataSource("clickEntityCollection");
    this.viewer.dataSources.add(myEntityCollection);
    this.entities = myEntityCollection.entities

    // 鼠标移动指示  监听指示
    if (!this.mouseMovePointPrimitives) {
      this.mouseMovePointPrimitivesCollection = this.viewer.scene.primitives.add(new Cesium.PointPrimitiveCollection());
      this.mouseMovePointPrimitives =
        RenderSimple.simplePointByPrimitives(this.mouseMovePointPrimitivesCollection, Cesium.Cartesian3.ZERO, 20, Cesium.Color.fromAlpha(Cesium.Color.RED, 0.5), 3.0)
    }

    /**
     * 图形状态
     * 绘制点线面和其他
     */
    this.pointPrimitives = this.PrimitiveAll.add(new Cesium.PointPrimitiveCollection()) //默认贴地
    this.thisPpolylinePrimitive = this.PrimitiveAll.add(new Cesium.PolylineCollection()) //真实悬空线
    this.polygonPrimitives = this.PrimitiveAll.add(new Cesium.PrimitiveCollection()) //真实纯粹多面  非顺序三角面（综合）
    this._polylineGroundPrimitive = this.PrimitiveAll.add(new Cesium.PrimitiveCollection()) //贴地线
    this._polygonGroundPrimitive = this.PrimitiveAll.add(new Cesium.PrimitiveCollection()) //贴地面

    // 活动线
    this.mouseLinePrimitive = null
    this.mousePolygonGroundEntity = null //贴地面
    this.mouseLineGroundEntity = null //贴地线

  }

  /**
   * 绘制点  多单点  双击一批次
   */
  drawPointStart() { this.pointDrawBool = !this.pointDrawBool }
  drawLineStart() { this.lineDrawBool = !this.lineDrawBool }
  drawPolygonStart() { this.polygonDrawBool = !this.polygonDrawBool }
  drawGroundLineStart() { this.lineGroundDrawBool = !this.lineGroundDrawBool }
  drawGroundPolygonStart() { this.polygonGroundDrawBool = !this.polygonGroundDrawBool }
  storeEntitiesStart() { this.storeEntities = !this.storeEntities }

  // 监听
  set click_MOUSE_MOVE(value) {

    // 开启监听提供指示
    this.mouseMovePointPrimitives.position = this.clickPositions[this.clickPositions.length - 1]

    // if (this.pointDrawBool) {}
    if (this.lineDrawBool && this.mouseLinePrimitive) { this.mouseLinePrimitive.positions = this.clickPositions } //更新线

    // if (this.polygonDrawBool) {}
    // if (this.lineGroundDrawBool && this.mouseLineGroundEntity) {}
    // if (this.polygonGroundDrawBool) {}
  }

  set click_LEFT_CLICK(value) {

    const clickScene = this.clickPositions[this.clickPositions.length - 1]
    if (this.pointDrawBool) { RenderSimple.simplePointByPrimitives(this.pointPrimitives, clickScene, 10, Cesium.Color.fromAlpha(this.pointColor, 0.5), 3.0) }
    if (this.lineDrawBool) {

      // 不存在->添加初始线
      this.mouseLinePrimitive = this.mouseLinePrimitive ||
      RenderSimple.simpleLineByPrimitive(this.thisPpolylinePrimitive, this.clickPositions, 10, this.lineColor, null)
    }

    // if (this.polygonDrawBool) { }
    if (this.lineGroundDrawBool) {

      if (!this.mouseLineGroundEntity) {
        this.mouseLineGroundEntity = this.entities.add({
          name: 'line',
          polyline: {
            positions: new Cesium.CallbackProperty(() => {
              return this.clickPositions;
            }, false),
            width: 3,
            material: Cesium.Color.fromAlpha(this.lineColor, 0.5),
            clampToGround: true,
          }
        });
      }

      // console.log(this.mouseLineGroundEntity.polyline)

    }

    if (this.polygonGroundDrawBool) {
      if (!this.mousePolygonGroundEntity) {
        console.log('绘制')
        console.log(this.clickPositions)

        this.mousePolygonGroundEntity = this.entities.add({

          // name: 'polygon',
          polygon: {
            hierarchy: new Cesium.CallbackProperty(() => {
              return new Cesium.PolygonHierarchy(this.clickPositions);
            }, false),

            // hierarchy: new Cesium.PolygonHierarchy(this.clickPositions),
            material: Cesium.Color.fromAlpha(this.lineColor, 0.3),
          }
        });

      }
    }
  }

  set click_LEFT_DOUBLE_CLICK(value) {

    // const clickScene = this.clickPositions[this.clickPositions.length - 1]
    if (this.pointDrawBool) { //无需绘制
    }
    if (this.lineDrawBool) {
      this.mouseLinePrimitive = null
    }
    if (this.lineGroundDrawBool) {
      console.log(this.mouseLineGroundEntity.polyline)

      // this.mouseLineGroundEntity.polyline._callback = null
      if (this.storeEntities) {
        this.mouseLineGroundEntity.polyline.positions = this.clickPositions
      }

      this.mouseLineGroundEntity = null
    }
    if (this.polygonDrawBool) {
      console.log('绘制真实面', this.clickPositions)
      const color = Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromAlpha(this.pointColor, 0.5))

      // let color = Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromAlpha(Cesium.Color.WHITE, 0.5))
      const polygonInstance = new Cesium.GeometryInstance({
        geometry: new Cesium.PolygonGeometry({
          polygonHierarchy: new Cesium.PolygonHierarchy(this.clickPositions),
          perPositionHeight: true,
        }),
        attributes: { color: color }
      });
      this.polygonPrimitives.add(new Cesium.Primitive({
        geometryInstances: [polygonInstance],
        appearance: new Cesium.PerInstanceColorAppearance()
      }));
    }

    if (this.polygonGroundDrawBool) {

      // let color = Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromAlpha(this.pointColor, 0.5))
      // let polygonInstance = new Cesium.GeometryInstance({
      //   geometry: new Cesium.PolygonGeometry({ polygonHierarchy: new Cesium.PolygonHierarchy(this.clickPositions) }), // id: 'polygon ',
      //   attributes: { color: color }
      // });
      // this._polygonGroundPrimitive.add(new Cesium.GroundPrimitive({ geometryInstances: [polygonInstance] }));

      // console.log('最终面', this.clickPositions)
      // this.mousePolygonGroundEntity = this.viewer.entities.add({
      //   name: 'polygon',
      //   polygon: {
      //     hierarchy: {
      //       positions: this.clickPositions
      //     },
      //     perPositionHeight: true, //对每个位置使用options.positions的height，而不使用options.height来确定高度
      //     extrudedHeight: 1,
      //     material: Cesium.Color.BLUE,
      //     outline: true,
      //     outlineColor: Cesium.Color.BLACK.withAlpha(1) //黑色轮廓线
      //   }
      // });
      if (this.storeEntities) {
        console.log(this.mouseLineGroundEntity)
        this.mousePolygonGroundEntity.polygon.hierarchy = new Cesium.PolygonHierarchy(this.clickPositions)
      }
      this.mousePolygonGroundEntity = null
    }

    this.randomColor()
  }

  removeAll() {
    super.removeAll()

    // 鼠标移动指示
    this.mouseMovePointPrimitivesCollection.remove(this.mouseMovePointPrimitives)
    this.mouseMovePointPrimitives = null

    // 图形
    this.PrimitiveAll.removeAll()
    this.entities.removeAll()
  }
}

export { BaseDraw }