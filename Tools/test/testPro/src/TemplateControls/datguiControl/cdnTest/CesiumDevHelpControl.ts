// ControlA0
import dat from 'dat.gui'
import { DatGuiHelp } from '../../DatGuiHelp'
import { SettingFull } from './SettingFull'
const development = import('../../../../../../../src/cesium-dev-help')
const production = import('cesium-dev-help')
const isDev = process.env.NODE_ENV === 'development'

function CesiumDevHelpControl() {
  const box = document.querySelector('#datGui')!
  const gui_0_root = new dat.GUI({ autoPlace: false })
  DatGuiHelp.addMouseDown(gui_0_root)
  box.appendChild(gui_0_root.domElement)
  let options_0 = {
    CONTROL: 'CesiumDevHelpControl',
  }
  // gui_0_root.domElement.style = 'position: absolute; top: 200px; left: 300px;'
  gui_0_root.domElement.setAttribute(
    'style',
    'position: absolute; top: 400px; left: 2px;'
  )
  gui_0_root.add(options_0, 'CONTROL')
  // --------测试
  // --------功能
  // --------
  // gui_0_root.closed = true
  function destroy() {
    gui_0_root.destroy()
    box.removeChild(gui_0_root.domElement)
  }

  test(gui_0_root, box)

  return { destroy: destroy }
}

let test = async (gui_0_root, box) => {
  const cdh = isDev ? await development : await production
  const { InitViewer, RenderSimple } = isDev
    ? await development
    : await production
  // cdh.CameraPro.cameraFlyToGraphic()

  const initViewer = InitViewer.getInstance(null)
  const viewer = initViewer.viewers.get('cesiumContainer')!

  let gui_0_f0 = gui_0_root.addFolder(SettingFull.renderGeom.title)
  //监听开关
  let timeListen = gui_0_f0.add(SettingFull.renderGeom, 'renderSimple')
  let remove
  timeListen.onChange(async (value: string) => {
    console.log('renderSimple_onChange:' + value)
    if (value) {
      const data = await getJsonFromUrl('data/testBuilding.geojson')
      let callBack=entity=>{
        let array = entity.properties.propertyNames
        for (let index = 0; index < array.length; index++) {
          const element = array[index];
          console.log(element+':',entity.properties[element]._value)
        }
        
      }
      remove = await RenderSimple.simpleEntitiesGeojson( viewer, data, '#ff0000', 'dg', 'lg', callBack, '#000000' )
      
    } else {
      remove && remove()//去除模型和点选事件
      remove = null
    }
  })
}


let getJsonFromUrl = async (url: string) => {
  const res = await fetch(url)
  const data = await res.json()
  return data
}

export { CesiumDevHelpControl }
