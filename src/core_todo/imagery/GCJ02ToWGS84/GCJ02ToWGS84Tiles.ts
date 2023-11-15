/**
 * @Author: Caven
 * @Date: 2021-01-31 22:07:05
 */

import CoordTransform from "../../transform/CoordTransform";
import * as Cesium from "cesium";
class GCJ02ToWGS84Tiles extends Cesium.WebMercatorTilingScheme {
  [x: string]: any;
  constructor(options?: any) {
    super(options);
    let projection = new Cesium.WebMercatorProjection();
    this._projection.project = function (
      cartographic: { longitude: number; latitude: number },
      result: number[] | Cesium.Cartesian3
    ) {
      result = CoordTransform.WGS84ToGCJ02(
        Cesium.Math.toDegrees(cartographic.longitude),
        Cesium.Math.toDegrees(cartographic.latitude)
      );
      result = projection.project(
        new Cesium.Cartographic(
          Cesium.Math.toRadians(result[0]),
          Cesium.Math.toRadians(result[1])
        )
      );
      return new Cesium.Cartesian2(result.x, result.y);
    };
    this._projection.unproject = function (
      cartesian: Cesium.Cartesian3,
      result: number[]
    ) {
      let cartographic = projection.unproject(cartesian);
      result = CoordTransform.GCJ02ToWGS84(
        Cesium.Math.toDegrees(cartographic.longitude),
        Cesium.Math.toDegrees(cartographic.latitude)
      );
      return new Cesium.Cartographic(
        Cesium.Math.toRadians(result[0]),
        Cesium.Math.toRadians(result[1])
      );
    };
  }
}

export default GCJ02ToWGS84Tiles;
