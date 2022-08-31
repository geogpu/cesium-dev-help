import { Cesium } from '../outsource/LibManager'
class RenderInstance {
  viewer: Cesium.Viewer
  constructor(viewer) {
    this.viewer = viewer
  }

  /**
   *
   * @param id 实体id
   * @param polylinePositions 线的坐标数组
   * @param PrimitiveCollection 实体集合
   * @param shapePositions 线的坐标数组
   */
  PolylineVolumeGeometryInstance(
    id,
    polylinePositions,
    PrimitiveCollection,
    shapePositions
  ) {
    const polylinevolumeinstance = new Cesium.GeometryInstance({
      geometry: new Cesium.PolylineVolumeGeometry({
        vertexFormat:
          Cesium.MaterialAppearance.MaterialSupport.BASIC.vertexFormat,
        polylinePositions: polylinePositions,
        shapePositions: shapePositions,

        // cornerType: Cesium.CornerType.MITERED
      }),

      id: id,
    })

    PrimitiveCollection.add(
      new Cesium.Primitive({
        geometryInstances: [polylinevolumeinstance],
        appearance: new Cesium.MaterialAppearance({
          material: Cesium.Material.fromType('Color', {
            color: Cesium.Color.fromAlpha(
              Cesium.Color.fromCssColorString('#79D9FF'),
              0.4
            ),
          }),

          // faceForward: true
          flat: true,
        }), //PolylineColorAppearance/PolylineMaterialAppearance请区分使用场景
      })
    )
  }

  /**
   *
   * @param geoJsonLine 线的geojson
   * @param width 线宽
   * @param color 线颜色
   * @param alpha 透明度
   * @returns
   */
  lineByPrimitive(geoJsonLine, width, color, alpha) {

    // const boolAlpha = alpha != null
    const linePrimitive = new Cesium.GroundPolylinePrimitive({
      geometryInstances: new Cesium.GeometryInstance({

        // geometry: new Cesium.PolylineGeometry({
        geometry: new Cesium.GroundPolylineGeometry({
          positions: Cesium.Cartesian3.fromDegreesArray(geoJsonLine),
          width: width, //线宽
          // vertexFormat: Cesium.PolylineColorAppearance.VERTEX_FORMAT
        }),

        // attributes: {
        //     color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromCssColorString(color).withAlpha(alpha)),//color  必须设置 不然没有效果
        // }
      }),

      // appearance: new Cesium.PolylineColorAppearance({
      //     translucent: boolAlpha
      // })

      appearance: new Cesium.PolylineMaterialAppearance({
        translucent: alpha !== null,
        material: Cesium.Material.fromType('Color', {

          // color: Cesium.Color.WHITE,
          color: color,
        }),
      }),
    })
    return linePrimitive
  }

}

export { RenderInstance }
