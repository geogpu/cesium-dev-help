/* eslint-disable no-unused-vars */
/*eslint-env node*/
// 'use strict'

// const fs = require("fs");
import fs from "fs";
import os from "os";

// const path = require("path");
// const os = require("os");
// const child_process = require("child_process");
// const crypto = require("crypto");
// const zlib = require("zlib");
// const readline = require("readline");
// const request = require("request");

// const globby = require("globby");
import {globby} from 'globby';

// const gulpTap = require("gulp-tap");
// const gulpUglify = require("gulp-uglify");
// const open = require("open");
// const rimraf = require("rimraf");
// const glslStripComments = require("glsl-strip-comments");
// const mkdirp = require("mkdirp");

// const mergeStream = require("merge-stream");
// const streamToPromise = require("stream-to-promise");
/**
 * series顺序组合exports.build = series(transpile, bundle);
 * parallel并发组合exports.build = parallel(transpile, bundle);
 */
// const { gulp, series, parallel } = require('gulp')
import pkg from 'gulp';
const { gulp, series, parallel } = pkg

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

/**
 * 工作流打包涉及工程信息
 */
// const packageJson = require('../../../package.json')
const packageJson = JSON.parse(fs.readFileSync('package.json'))
let version = packageJson.version
console.log('当前版本：', version, os.EOL)
let name = packageJson.name
if (/\.0$/.test(version)) {
  version = version.substring(0, version.length - 2)
}

/**
 * 正式流
 */

// function createEachPGJs() {
//   let contents = `export var VERSION = '${version}';\n`
//   contents += `export var NAME = '${name}';\n`
//   globby.sync(sourceFiles).forEach(function(file) {
//     file = path.relative('Source', file)

//     let moduleId = file
//     moduleId = filePathToModuleId(moduleId)

//     let assignmentName = path.basename(file, path.extname(file))
//     if (moduleId.indexOf('Shaders/') === 0) {
//       assignmentName = '_shaders' + assignmentName
//     }
//     assignmentName = assignmentName.replace(/(\.|-)/g, '_')
//     contents +=
//       'export { default as ' +
//       assignmentName +
//       " } from './" +
//       moduleId +
//       ".js';" +
//       os.EOL
//   })

//   // fs.writeFileSync('Source/Cesium.js', contents)
//   fs.writeFileSync(name + '.js', contents)
// }

/**
 * test测试工作流
 * 
 */

let gulpConnect = (cb)=> {
  console.log('gulp connect succeed')
  cb()
}

/**
 * 待定
 */
const sourceFiles = [
  "Source/**/*.js",
  "!Source/*.js",
  "!Source/Workers/**",
  "!Source/WorkersES6/**",
  "Source/WorkersES6/createTaskProcessorWorker.js",
  "!Source/ThirdParty/Workers/**",
  "!Source/ThirdParty/google-earth-dbroot-parser.js",
  "!Source/ThirdParty/_*",
];

let createEachPGJs = async(cb)=>{
  console.log('gulp build list of out interface')

    const paths = await globby(['*.js'], {
      expandDirectories: true
    });
    console.log(paths);
  cb()
}

let GULP_CONNECT = gulpConnect;
let GULP_BUILD = series(createEachPGJs);

export{GULP_CONNECT, GULP_BUILD}