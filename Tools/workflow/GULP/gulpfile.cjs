/*eslint-env node*/
'use strict'

// const fs = require("fs");
// const path = require("path");
// const os = require("os");
// const child_process = require("child_process");
// const crypto = require("crypto");
// const zlib = require("zlib");
// const readline = require("readline");
// const request = require("request");

// const globby = require("globby");
// const gulpTap = require("gulp-tap");
// const gulpUglify = require("gulp-uglify");
// const open = require("open");
// const rimraf = require("rimraf");
// const glslStripComments = require("glsl-strip-comments");
// const mkdirp = require("mkdirp");
// const mergeStream = require("merge-stream");
// const streamToPromise = require("stream-to-promise");
const gulp = require('gulp')
// const gulpInsert = require("gulp-insert");
// const gulpZip = require("gulp-zip");
// const gulpRename = require("gulp-rename");
// const gulpReplace = require("gulp-replace");
// const Promise = require("bluebird");
// const Karma = require("karma");
// const yargs = require("yargs");
// const AWS = require("aws-sdk");
// const mime = require("mime");
// const rollup = require("rollup");
// const rollupPluginStripPragma = require("rollup-plugin-strip-pragma");
// const rollupPluginExternalGlobals = require("rollup-plugin-external-globals");
// const rollupPluginUglify = require("rollup-plugin-uglify");
// const cleanCSS = require("gulp-clean-css");
// const typescript = require("typescript");

const packageJson = require('../../../package.json')
let version = packageJson.version
let name = packageJson.name
if (/\.0$/.test(version)) {
  version = version.substring(0, version.length - 2)
}

gulp.task('wx-test', function (test) {
  console.log('测试流')
  test()
})
// 打包文件头
gulp.task('pg-np', function (test) {
  console.log('打包文件头')
  test()
})

// "build-configTemplate0": "yarn rollup --c Tools/package/rollup.configTemplate0.js",
// "build-configTemplate1": "yarn rollup --c Tools/package/rollup.configTemplate1.js",
gulp.task('build-configTemplate0', function (test) {
  console.log('测试流')
  test()
})

function createEachPGJs() {
  let contents = `export var VERSION = '${version}';\n`
  contents += `export var NAME = '${name}';\n`
  globby.sync(sourceFiles).forEach(function (file) {
    file = path.relative('Source', file)

    let moduleId = file
    moduleId = filePathToModuleId(moduleId)

    let assignmentName = path.basename(file, path.extname(file))
    if (moduleId.indexOf('Shaders/') === 0) {
      assignmentName = '_shaders' + assignmentName
    }
    assignmentName = assignmentName.replace(/(\.|-)/g, '_')
    contents +=
      'export { default as ' +
      assignmentName +
      " } from './" +
      moduleId +
      ".js';" +
      os.EOL
  })

  // fs.writeFileSync('Source/Cesium.js', contents)
  fs.writeFileSync(name + '.js', contents)
}