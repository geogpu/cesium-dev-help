class strUtils {
  /**
   * 获取字符串hash(可部分重复)
   * hash = hash * 131 + ch;hash = hash << 7 + hash << 1 + hash + ch;没必要BKDR
   * @param {*} str
   * @returns
   */
  static simpleHash = (str) => {
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
  BKDRHash = (str) => {
    let i = 0,
      hash = 0,
      ch
    // 也可以乘以31、131 //hash = hash << 7 + hash << 1 + hash + ch;
    while ((ch = str.charCodeAt(i++))) hash = hash * 131 + ch
    return hash
  }
}

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
// console.log(hashCode(str) % 6)
export { strUtils, simpleHash }
