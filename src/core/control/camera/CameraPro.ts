import { Cesium, turf } from '../../outsource/LibManager'
class CameraPro {
  camera: Cesium.Camera

  /**
   * 相机状态
   * @param {*} camera
   */
  constructor(camera: Cesium.Camera) {
    this.camera = camera
  }

  /**
   * 相机视角 scene.camera.cancelFlight();
   * @param {Object} params {"lat":39.092423,"lon":121.990975,"h":87.84,"heading":23.4,"pitch":-51.9,"roll":0}
   */

  static cameraFlyToGraphic(
    params: {
      lon: number
      lat: number
      h: number
      heading: number
      pitch: number
      roll: number
    },
    viewer: Cesium.Viewer
  ) {
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        params.lon,
        params.lat,
        params.h
      ),
      orientation: {
        heading: Cesium.Math.toRadians(params.heading),
        pitch: Cesium.Math.toRadians(params.pitch),
        roll: Cesium.Math.toRadians(params.roll),
      },
    })
  }

  /**
   * 相机视角
   * @param {Object} params {"lon":121.990975,"lat":39.092423,"h":87.84,"heading":23.4,"pitch":-51.9,"roll":0}
   */
  static cameraSetViewGraphic(
    params: {
      lon: number
      lat: number
      h: number
      heading: number
      pitch: number
      roll: number
    },
    viewer: Cesium.Viewer
  ) {
    viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(
        params.lon,
        params.lat,
        params.h
      ),
      orientation: {
        heading: Cesium.Math.toRadians(params.heading),
        pitch: Cesium.Math.toRadians(params.pitch),
        roll: Cesium.Math.toRadians(params.roll),
      },
    })
  }

  /**
   * 相机视角
   * @param {Object} params {"lon":121.990975,"lat":39.092423,"h":87.84,"heading":23.4,"pitch":-51.9,"roll":0}
   */
  static cameraSetViewFeaturesBox(
    geojson,
    viewer: Cesium.Viewer,
    options = {
      xMultiples: 0.11, //东西尺度
      yMultiples: 0.11, //南北尺度
      west: 1.0,
      south: 1.0,
      east: 1.0,
      north: 2.0
    }
  ) {
    const featuresBox = turf.bbox(geojson)
    const featuresBoxXAdd = (featuresBox[2] - featuresBox[0]) * options.xMultiples
    const featuresBoxYAdd = (featuresBox[3] - featuresBox[1]) * options.yMultiples
    viewer.camera.flyTo({
      destination: Cesium.Rectangle.fromDegrees(

        //西南东北大地坐标 增加适合边距
        featuresBox[0] - options.west * featuresBoxXAdd,
        featuresBox[1] - options.south * featuresBoxYAdd,
        featuresBox[2] + options.east * featuresBoxXAdd,
        featuresBox[3] + options.north * featuresBoxYAdd
      ),
    })
  }
}

export { CameraPro }

// https://blog.csdn.net/u010447508/article/details/105562542
