// import { Viewer } from "cesium";
// import * as Cesium from 'cesium';
import * as turf from '@turf/turf'
import './css/main.css'
import { MainControl } from './TemplateControls/datguiControl/MainControl'

const development = import('../../../../src/cesium-dev-help')
const production = import('cesium-dev-help')
const isDev = process.env.NODE_ENV === 'development'
let main = async () => {
  console.log('环境',process.env.NODE_ENV)
  //区分依赖库 动态导入
  // const {InitViewer} = isDev ? await production : await production
  const cdh = isDev ? await development : await production
  const initViewer = cdh.InitViewer.getInstance(null)
  initViewer.addViewer('cesiumContainer')
  console.log(turf.point([1, 2]))

  // 初始viewer
  // let viewer = initViewer.viewers.get("cesiumContainer")


  MainControl()
}

main()
