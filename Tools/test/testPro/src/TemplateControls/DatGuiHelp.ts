import dat from 'dat.gui'
class DatGuiHelp {
  constructor() {}
  static test() {
    console.log('DatGuiHelp')
  }
  /**
   * 创建
   * @param {*} datGuiDOM '#datGui'
   * @param {*} ControlName 'MainControl'
   * @param {*} top 2
   * @param {*} left 2
   * @returns
   */
  static createControl(
    datGuiDOM: string,
    ControlName: string,
    top: string,
    left: string
  ) {
    let options_0 = { CONTROL: ControlName }
    const box = document.querySelector(datGuiDOM)
    const gui_0_root = new dat.GUI({ autoPlace: false })
    box!.appendChild(gui_0_root.domElement)
    gui_0_root.domElement.setAttribute(
      'style',
      'position: absolute; top: ' + top + 'px; left: ' + left + 'px;'
    )
    gui_0_root.add(options_0, 'CONTROL')
    return {
      box: box,
      gui_0_root: gui_0_root,
    }
  }

  /**
   * 辅助开关附属控制面板
   * @param {*} gui_0_f0
   * @param {*} otherControlSetting
   * @param {string} openString
   * @param {*} newControl
   */
  static openSetting(gui_0_f0, otherControlSetting, openString:string, newControl) {
    let newControl_open = gui_0_f0.add(otherControlSetting, openString),thisNewControl
    // 默认开启
    if (otherControlSetting[openString]) thisNewControl = newControl()
    // 开关控制
    newControl_open.onChange((value) => {
      value ? (thisNewControl = newControl()) : thisNewControl.destroy()
    })
  }

  /**
   *
   * @param datGUI  dat.GUI
   */
  static addMouseDown(datGUI) {
    datGUI.domElement.onmousedown = function (Event) {
      Event = Event || window.Event
      // 获取滑块偏移量
      var left = Event.clientX - datGUI.domElement.offsetLeft
      var top = Event.clientY - datGUI.domElement.offsetTop
      if (Event.target.className === 'property-name') {
        // 限制，只有在控件左侧部分，也就是参数名部分拖动，才能拖动控件
        document.onmousemove = function (event) {
          event = event || window.event
          datGUI.domElement.style.left = event.clientX - left + 'px'
          datGUI.domElement.style.top = event.clientY - top + 'px'
        }
      }
      document.onmouseup = function () {
        document.onmousemove = null
        document.onmouseup = null
      }
      Event.preventDefault() //控件上有文字，在拖拽时会触发浏览器的默认事件，这里阻止默认事件
      // return false
    }
  }
}

export { DatGuiHelp }
