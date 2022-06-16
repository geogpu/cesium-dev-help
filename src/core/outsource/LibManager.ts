import * as Cesium from 'cesium'
import * as turf from '@turf/turf'
class LibManager {
  static getCesium() {
    return Cesium
  }
  static getTurf() {
    return turf
  }

  static toString() {
    return 'Cesium turf'
  }

}

export{LibManager, Cesium, turf}