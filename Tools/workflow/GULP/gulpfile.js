/* eslint-disable no-unused-vars */
/*eslint-env node*/
// ******************************************************原生库
import fs from "fs";
import os from "os";
import path from "path";

// ******************************************************三方库
import { globby } from 'globby';
import { rollup } from 'rollup'
import { terser } from "rollup-plugin-terser";
import pkg from 'gulp';
const { gulp, series, parallel } = pkg

// ******************************************************工作流打包涉及工程信息
// const packageJson = require('../../../package.json')
const packageJson = JSON.parse(fs.readFileSync('package.json'))
let version = packageJson.version
console.log('当前版本：', version, os.EOL)
let name = packageJson.name
if (/\.0$/.test(version)) version = version.substring(0, version.length - 2)

/**
 * test测试工作流
 * 
 */

let gulpConnect = (cb) => {
  console.log('gulp connect succeed')
  cb()
}

///////////////////////////////////////////////////////////////待定
let coreBasePath = 'src/'
const sourceFiles = [coreBasePath + '/core/**/*.js', //core下所有js
];

let createEachPGJs = async(cb) => {
  console.log('gulp build list of out interface')
  let contents = `export let VERSION = '${version}';\n`;
  const fullPaths = await globby(sourceFiles, {});
  fullPaths.forEach(fullPath => {
    let file = path.relative(coreBasePath, fullPath) //core\math\ComputationalGeom.js 整体相对路径
    let moduleId = filePathToModuleId(file) //core/math/ComputationalGeom
    let assignmentName = path.basename(file, path.extname(file))
    assignmentName = assignmentName.replace(/(\.|-)/g, '_') //ComputationalGeom 单个类和文件名
    // console.log(assignmentName)
    // 抛出类
    contents += 'export { ' + assignmentName + " } from './" + moduleId + ".js';" + os.EOL
  });

  // console.log(contents)
  fs.writeFileSync(coreBasePath + name + '.js', contents);
  cb()
}

const inputOptions = { // 核心参数
  input: coreBasePath + name + '.js', // 唯一必填参数 
  plugins: [terser()], //压缩代码

  //  external, 
};

/**
 * esm – 将软件包保存为 ES 模块文件，在现代浏览器中可以通过 <script type=module> 标签引入
 * iife – 一个自动执行的功能，适合作为<script>标签。（如果要为应用程序创建一个捆绑包，您可能想要使用它，因为它会使文件大小变小。）
 * 
 */
const outputOptions = { // 核心参数
  format: 'esm', // 必填
  file: 'dist/' + name + '.mjs', //输出到指定的文件夹// 若有bundle.write，必填
  sourcemap: true,

  //  name, //  globals,
};

const outputOptionsOld = { // 核心参数
  format: 'iife', // 必填
  file: 'dist/' + name + '.js', //输出到指定的文件夹// 若有bundle.write，必填
  name: name, //iife必须提供

  //  globals,
};
let rollupES6 = async() => {
  const bundle = await rollup(inputOptions) // const bundle = await rollup.rollup(inputOptions);
  // console.log(bundle.imports); // an array of external dependencies
  // console.log(bundle.exports); // an array of names exported by the entry point
  // console.log(bundle.modules); // an array of module objects
  // generate code and a sourcemap
  // const { code, map } = await bundle.generate(outputOptions);

  // or write the bundle to disk
  await bundle.write(outputOptions);
  await bundle.write(outputOptionsOld);
}

// 斜杠替换 \to/
function filePathToModuleId(moduleId) {
  return moduleId.substring(0, moduleId.lastIndexOf(".")).replace(/\\/g, "/");
}

// gulp生效测试
let GULP_CONNECT = gulpConnect;
let GULP_PACKAGE = createEachPGJs;//生成文件头
let GULP_BUILD = series(createEachPGJs, rollupES6);//生成文件头并打包 mjs js

export { GULP_CONNECT, GULP_PACKAGE, GULP_BUILD }