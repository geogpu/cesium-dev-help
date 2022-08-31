import fs from "fs";
import path from "path";


/**
 * @description 创建目录,可以创建多层目录，默认异步
 * @param {string} dirpath 
 * @param {string} callback 
 */
let mkdirs = (dirpath, callback) => { //默认同步
  fs.exists(dirpath, function (exists) {
    if (exists) {
      callback();
    } else {
      //尝试创建父目录，然后再创建当前目录
      mkdirs(path.dirname(dirpath), function () {
        fs.mkdir(dirpath, callback);
      });
    }
  });
  // let exists = fs.existsSync(dirpath)
  // if (exists) {
  //   callback();
  // } else {
  //   //尝试创建父目录，然后再创建当前目录
  //   mkdirs(path.dirname(dirpath), function () {
  //     fs.mkdirSync(dirpath);
  //     callback();
  //   });
  // }
}

/**
 * @description 拷贝文件
 * @param {string} src  源文件路径
 * @param {string} dst  目标文件路径
 */
let copy = (src, dst) => {
  //读取目录
  fs.readdir(src, function (err, paths) {
    console.log(paths)
    if (err) {
      throw err;
    }
    paths.forEach(function (path) {
      let _src = src + '/' + path;
      let _dst = dst + '/' + path;
      let readable, writable;
      fs.stat(_src, (err, st) => {
        if (err) throw err;
        if (st.isFile()) {
          readable = fs.createReadStream(_src); //创建读取流
          writable = fs.createWriteStream(_dst); //创建写入流
          readable.pipe(writable);
        } else if (st.isDirectory()) {
          exists(_src, _dst, copy);
        }
      });
    });
  });
}

let exists = (src, dst, callback) => {
  //测试某个路径下文件是否存在
  fs.exists(dst, function (exists) {
    if (exists) { //存在
      console.error('exists ' + dst);
      callback(src, dst);
    } else { //不存在
      // fs.mkdir(dst, function () { //创建目录
      mkdirs(dst, function () { //创建目录
        console.error('mkdir ' + dst);
        callback(src, dst)
      })
    }
  })
}



export { exists, copy, mkdirs }

// exists('../from','../to',copy)