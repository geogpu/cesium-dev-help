import { Cesium } from '../outsource/LibManager';

/**
 * 局部坐标系与世界坐标系转换，局部坐标系的轴方向由可选参数direction控制，默认是eastNorthUp北、东、上为轴线
 * 初始化转换用逆矩阵
 * @param {Number} RCSorigincenter 世界坐标系_笛卡尔
 * @param {Number} direction 坐标轴方向，值是"northEastDown","northUpEast","northWestUp","eastNorthUp"(默认)!!
 */
class LocalAndWorldTransform {
  RCSMatrix: Cesium.Matrix4
  RCSmatrixInverse: Cesium.Matrix4
  constructor(RCSorigincenter:Cesium.Cartesian3, direction:string|null) {

    // let RCSorigincenter = Cesium.Cartesian3.fromDegrees(longitude, latitude, height);
    switch(direction) {
      case 'northEastDown':
        this.RCSMatrix = Cesium.Transforms.northEastDownToFixedFrame(RCSorigincenter)
        break;
      case 'northUpEast':
        this.RCSMatrix = Cesium.Transforms.northUpEastToFixedFrame(RCSorigincenter)
        break;
      case 'northWestUp':
        this.RCSMatrix = Cesium.Transforms.northWestUpToFixedFrame(RCSorigincenter)
        break;
      default://eastNorthUp 北、东、上 为轴线 默认
        this.RCSMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(RCSorigincenter)
        break;
    }
    this.RCSmatrixInverse = Cesium.Matrix4.inverseTransformation(this.RCSMatrix, new Cesium.Matrix4())
  }

  /**
   * 局部坐标转换成对应的世界坐标
   * @param { Cesium.Cartesian3} localCoordinates 局部坐标系_笛卡尔，如 {x:1,y:1,z:1}
   * @param { Cesium.Cartesian3} result 世界坐标系_笛卡尔
   * @returns { Cesium.Cartesian3}
   */
  localToWorldCoordinates(localCoordinates: Cesium.Cartesian3, result: Cesium.Cartesian3) {
    if (!result) result = new Cesium.Cartesian3()
    Cesium.Matrix4.multiplyByPoint(this.RCSMatrix, localCoordinates, result)
    return result
  }

  /**
   * 世界坐标转换成对应的局部坐标
   * @param { Cesium.Cartesian3} WorldCoordinates 世界坐标系_笛卡尔
   * @param { Cesium.Cartesian3} result 局部坐标系_笛卡尔
   * @returns { Cesium.Cartesian3}
   */

  WorldCoordinatesTolocal(WorldCoordinates:Cesium.Cartesian3, result: Cesium.Cartesian3) {
    if (!result) result = new Cesium.Cartesian3()
    Cesium.Matrix4.multiplyByPoint(
      this.RCSmatrixInverse,
      WorldCoordinates,
      result
    )

    return result
  }
}

export { LocalAndWorldTransform }