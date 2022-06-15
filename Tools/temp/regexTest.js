let str =
  'http://192.168.4.4:1258{*}/3Dtiles/dalian_3dtiles/2016-2019/Bohai/Bohai_1_bu/Data/Tile_p069_p165/Tile_p069_p165.json'
/**
 * 获取字符串hash(可部分重复)
 * hash = hash * 131 + ch;hash = hash << 7 + hash << 1 + hash + ch;没必要BKDR
 * @param {*} str
 * @returns
 */
let simpleHash = (str) => {
  let i = 0,
    hash = 0,
    ch
  while ((ch = str.charCodeAt(i++))) hash += ch
  return hash
}

/**
 * 获取字符串hash(UNICODE低重复)
 * @param {*} str
 * @returns
 */
let BKDRHash = (str) => {
  let i = 0,
    hash = 0,
    ch
  // 也可以乘以31、131 //hash = hash << 7 + hash << 1 + hash + ch;
  while ((ch = str.charCodeAt(i++))) hash = hash * 131 + ch
  return hash
}
console.log(simpleHash(str) % 6)
var patt = '{*}'
if (str.search(patt) > -1) {
  console.log(true)
}
console.log(str.search(patt))

class UrlTrans {
  constructor() {
    UrlTrans.patt = '{*}'
  }
  static url3dtiles(url) {
    if (url.search(UrlTrans.patt) > -1) {
      var codeHash = UrlTrans.simpleHash(url) % 6 //0-5
      url = url.replace(UrlTrans.patt, codeHash)
    }
    return url
  }

  /**
   * 获取字符串hash(可部分重复)
   * hash = hash * 131 + ch;hash = hash << 7 + hash << 1 + hash + ch;没必要BKDR
   * @param {*} str
   * @returns
   */
  static simpleHash(str) {
    var i = 0,
      hash = 0,
      ch
    while ((ch = str.charCodeAt(i++))) hash += ch
    return hash
  }
}

console.log('UrlTrans', UrlTrans.url3dtiles(str))
