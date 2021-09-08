/**加密凸多边形内部  插值和辅助计算 */
class DividePolygonsIntoTriangles {
  /**
   * DividePolygonsIntoTriangles 加密分割凸多边形为多个简单三角形
   * 不考虑凹
   */
  constructor() {
    this.precision = 1 //精度
    this.densityIncreaseCount = 2 //加密次数
    this.pointStartArray = [] //初始多边形点集[[x,y,z],[]...] z null时默认构建为0
  }

  /**
   * 加密点
   */
  densityIncrease() {
    console.log('加密点')
  }

  /**
   * 不规则三棱锥体积   下表面(水平基准面)提供  注意高程方向  TODO 完全点体积   体积含负数  底面比顶面高
   *
   * 三矢量混合积  https://qb.zuoyebang.com/xfe-question/question/49162efa571cb7da99451729ee9c9dec.html
   * https://www.sohu.com/a/452261560_99896109
   * @param {*} pointStartArray
   */
  static volumePyramidal(pointStartArray) {
    //点位  底面点
    let x0 = pointStartArray[0][0]
    let y0 = pointStartArray[0][1]
    let z0 = pointStartArray[0][2]
    let x1 = pointStartArray[1][0]
    let y1 = pointStartArray[1][1]
    let z1 = pointStartArray[1][2]
    let x2 = pointStartArray[2][0]
    let y2 = pointStartArray[2][1]
    let z2 = pointStartArray[2][2]
    // 矢量
    let x01 = x1 - x0
    let y01 = y1 - y0
    let z01 = z1 - z0
    let x02 = x2 - x0
    let y02 = y2 - y0
    let z02 = z2 - z0
    //高程方向
    let zUp =
      (pointStartArray[3][2] + pointStartArray[4][2] + pointStartArray[5][2]) /
      3
    let zDown = pointStartArray[0][2]

    let h = zUp - zDown

    // 叉乘的模的1/2  底面面积

    let s =
      (y01 * z02 +
        z01 * x02 +
        x01 * y02 -
        (y02 * z01 + z02 * x01 + x02 * y01)) /
      2

    s = Math.abs(s)

    // 边长海伦

    let v = s * h
    return v
  }

  test() {
    this.pointStartArray = [
      [0, 0, 0],
      [1, 0, 0],
      [0, 1, 0],
    ]
    this.densityIncrease()

    console.log(
      DividePolygonsIntoTriangles.volumePyramidal([
        [0, 0, 0],
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
        [1, 0, 1],
        [0, 1, 1],
      ])
    )
  }
}

let dividePolygonsIntoTriangles = new DividePolygonsIntoTriangles()
dividePolygonsIntoTriangles.test()
