import log from './js/logger.js'

import messages from './js/messages.js'
import { strUtils, simpleHash } from './js/regexTest.js'

// import { name, version } from '../package.json'

// 使用模块成员

const msg = messages.hi

log(msg)
log('test0')

function test01(params) {
  console.log('test011')
}

// log(name)

// log(version)

export const GUI = test01

export default {
  GUI,
}
let str =
  'http://192.168.4.4:12580/3Dtiles/dalian_3dtiles/2016-2019/Bohai/Bohai_1_bu/Data/Tile_p069_p165/Tile_p069_p165.json'
console.log(simpleHash(str) % 6)
