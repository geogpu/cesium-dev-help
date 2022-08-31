// ControlA0
import dat from 'dat.gui'
import { DatGuiHelp } from '../../DatGuiHelp'
import { viwerSettingFull } from './viwerSettingFull'

const development = import('../../../../../../../src/cesium-dev-help')
const production = import('cesium-dev-help')
const isDev = process.env.NODE_ENV === 'development'

let DefaultSettingControl = (params) => {
  const box = document.querySelector('#datGui')!
  const gui_0_root = new dat.GUI({ autoPlace: false })
  DatGuiHelp.addMouseDown(gui_0_root)
  box.appendChild(gui_0_root.domElement)
  let options_0 = {
    CONTROL: 'DefaultSettingControl',
  }
  // gui_0_root.domElement.style = 'position: absolute; top: 200px; left: 300px;'
  gui_0_root.domElement.setAttribute(
    'style',
    'position: absolute; top: 200px; left: 2px;'
  )
  gui_0_root.add(options_0, 'CONTROL')
  // --------测试
  // --------功能
  // --------
  // gui_0_root.closed = true
  let destroy = () => {
    gui_0_root.destroy()
    box.removeChild(gui_0_root.domElement)
  }


  test(gui_0_root,box)

  return { destroy: destroy }
}

let test = async (gui_0_root,box) => {
  const cdh = isDev ? await development : await production
  // cdh.CameraPro.cameraFlyToGraphic()

  const initViewer = cdh.InitViewer.getInstance(null)
  const viewer = initViewer.viewers.get('cesiumContainer')!

  let gui_0_f0 = gui_0_root.addFolder(viwerSettingFull.sceneParam.title)
  // --------------------------------------------场景参数---------------------------------------------------
  // 视角控制
  let cameras = gui_0_f0.add(
    viwerSettingFull.sceneParam,
    'cameraList',
    viwerSettingFull.sceneParam.cameraListFull
  )
  cdh.CameraPro.cameraSetViewGraphic(
    viwerSettingFull.sceneParam.cameras[viwerSettingFull.sceneParam.cameraList],
    viewer
  )
  cameras.onFinishChange((value) => {
    console.log('onChange:' + value)
    cdh.CameraPro.cameraSetViewGraphic(
      viwerSettingFull.sceneParam.cameras[value],
      viewer
    )
  })
  // 参数设置：抗锯齿 深度检测
  // viewer.scene.globe.depthTestAgainstTerrain = true;
  let depthTestAgainstTerrain = gui_0_f0.add(
    viwerSettingFull.sceneParam,
    'depthTestAgainstTerrain'
  )
  viewer.scene.globe.depthTestAgainstTerrain = true
  depthTestAgainstTerrain.onChange((value) => {
    console.log('depthTestAgainstTerrain:' + value)
    viewer.scene.globe.depthTestAgainstTerrain = value
  })
  let fxaa = gui_0_f0.add(viwerSettingFull.sceneParam, 'fxaa') //是否开启抗锯齿
  // viewer.scene.fxaa = true
  viewer.scene.postProcessStages.fxaa.enabled = true
  fxaa.onChange((value) => {
    console.log('fxaa:' + value)
    // viewer.scene.globe.fxaa = value
    viewer.scene.postProcessStages.fxaa.enabled = value
  })

  // --------------------------------------------时间监听---------------------------------------------------
  let gui_0_f2 = gui_0_root.addFolder(viwerSettingFull.timeCotrol.title)
  // 归零
  viwerSettingFull.timeCotrol.timeReturn = () => {
    viwerSettingFull.timeCotrol['timeMark⏲'] = 0
  }
  gui_0_f2.add(viwerSettingFull.timeCotrol, 'timeReturn')
  //监听开关
  let timeListen = gui_0_f2.add(viwerSettingFull.timeCotrol, 'timeListen')
  let timeMark
  timeListen.onChange((value) => {
    console.log('timeListen_onChange:' + value)
    if (value) {
      timeMark = setInterval(() => {
        viwerSettingFull.timeCotrol['timeMark⏲']++
      }, 1000)
    } else {
      clearInterval(timeMark)
    }
  })
  // 时间
  gui_0_f2.add(viwerSettingFull.timeCotrol, 'timeMark⏲').step(1).listen() // 增长的步长

 



}

export { DefaultSettingControl }
