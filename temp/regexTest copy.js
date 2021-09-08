let str =
  'http://192.168.4.4:1258{*}/3Dtiles/dalian_3dtiles/2016-2019/Bohai/Bohai_1_bu/Data/Tile_p069_p165/Tile_p069_p166.json'
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

let tile = {
  _contentResource: {
    _url: str,
  },
}
var patt = '{*}'
var thisResource = tile._contentResource
if (thisResource._url.search(patt)) {
  var codeHash = simpleHash(thisResource._url) % 6 //0-5
  thisResource._url = thisResource._url.replace(patt, codeHash)
}
console.log(thisResource._url)
