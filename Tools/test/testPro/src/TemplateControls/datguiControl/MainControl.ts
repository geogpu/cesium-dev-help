import dat from 'dat.gui'
import { DatGuiHelp } from '../DatGuiHelp'

import { ControlA0 } from './ControlA0'
import { ControlA1 } from './ControlA1'
import { CesiumDevHelpControl } from './cdnTest/CesiumDevHelpControl'
import { DefaultSettingControl } from './defaultSetting/DefaultSettingControl'

function MainControl() {
  //--------------------------------------------主控---------------------------------------------------
	let thisDiv= document.createElement('div');
  thisDiv.id='datGui';
  document.body.appendChild(thisDiv);
  let fullBox = DatGuiHelp.createControl('#datGui', 'MainControl', '2', '2')
  const box = fullBox.box
  const gui_0_root = fullBox.gui_0_root
  // 设置可以移动
  DatGuiHelp.addMouseDown(gui_0_root)

  

  // --------测试
  // --------功能

  // 新窗口控制
  let gui_0_f0 = gui_0_root.addFolder(otherControlSetting.title)
  DatGuiHelp.openSetting(gui_0_f0, otherControlSetting, 'ControlA0', ControlA0)
  DatGuiHelp.openSetting(gui_0_f0, otherControlSetting, 'ControlA1', ControlA1)


   // 新窗口控制
   let gui_0_f1 = gui_0_root.addFolder(otherControlSetting1.title)
   DatGuiHelp.openSetting(gui_0_f1, otherControlSetting1, 'DefaultSettingControl', DefaultSettingControl)
   DatGuiHelp.openSetting(gui_0_f1, otherControlSetting1, 'CesiumDevHelpControl', CesiumDevHelpControl)
  
}


// --------------------------------------------场景参数---------------------------------------------------


let otherControlSetting = {
  title: 'TemplateControls',
  ControlA0: false,
  ControlA1: false,
}

let otherControlSetting1 = {
  title: 'cesium-dev-help',
  DefaultSettingControl: !false,
  CesiumDevHelpControl: !false
}

// --------------------------------------------datgui控制面板---------------------------------------------------



export { MainControl }