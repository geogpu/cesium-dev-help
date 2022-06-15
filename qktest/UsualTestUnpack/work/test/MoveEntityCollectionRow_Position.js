/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import {
  ClippingPlanesByGeom,
  CameraPro,
  RenderGlb,
  LocalAndWorldTransform,
  RenderSimple,
} from '../../../../src/cesium-dev-help.js'

/**
 * 高度分层
 */
class MoveEntityCollectionRow_Position {

  /**
   * 同样动画
   * @param {*} viewer
   * @param {*} entities
   * @param {*} startTime
   * @param {*} endTime
   */
  constructor(viewer, entities, startTime, endTime, timenew) {
    this.viewer = viewer
    this.entities = entities
    this.startTime = startTime
    this.endTime = endTime
    this.timenew = timenew //不同
  }

  /**
   *
   * @param {*} geomPositionsDown
   * @param {*} oneFloorHeight  单层高度
   * @param {*} floors 楼层数
   * @param {*} precision 单层分割数（精度）  默认单层不分层1   （？多层三点贝塞尔？）
   */
   add(geomPositionsDown, oneFloorHeight, floors, precision) {

    // 默认单层1
    precision || (precision = 1)
    let realOneFloorHeight = oneFloorHeight / precision //纵向节点间高度
    for (let index = 0; index < floors; index++) {

      let thisEntity = this.entities.add({
        polygon: {
          hierarchy: new Cesium.PolygonHierarchy(geomPositionsDown),
          height: realOneFloorHeight * index + realOneFloorHeight, // 上表面
          extrudedHeight: realOneFloorHeight * index, // 下表面
          outline: true,
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 4,
        },
      })

      let colorProperty = new Cesium.SampledProperty(Cesium.Color)
  
      colorProperty.addSample(
        Cesium.JulianDate.fromIso8601('2019-01-01T00:00:00.00Z'),
        new Cesium.Color(0, 1, 0)
      )
  
      colorProperty.addSample(
        Cesium.JulianDate.fromIso8601('2019-01-01T00:01:00.00Z'),
        new Cesium.Color(0, 0, index)
      )
  
      thisEntity.polygon.material = new Cesium.ColorMaterialProperty(
        colorProperty
      )

    }

  }
}

export { MoveEntityCollectionRow_Position }
