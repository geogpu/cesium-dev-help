/* eslint-disable no-unused-vars */
/*eslint-env node*/
// ******************************************************原生库******************************************************
import fs from "fs";
import os from "os";
import path from "path";
import child_process from 'child_process';

// ******************************************************三方库******************************************************
import { globby } from 'globby';
import esbuild from "esbuild";

// gulp
import pkg from 'gulp';
const { gulp, series, parallel } = pkg

// ******************************************************工作流打包涉及工程信息******************************************************
// 工程配置信息
const packageJson = JSON.parse(fs.readFileSync('package.json'))
let version = packageJson.version
let name = packageJson.name
console.log('当前版本：', version, os.EOL, '当前包名：', name)
if (/\.0$/.test(version)) version = version.substring(0, version.length - 2)

//test测试工作流
let gulpConnect = (cb) => {
  console.log('gulp connect succeed')
  cb()
}

///////////////////////////////////////////////////////////////待定///////////////////////////////////////////////////////////////
let coreBasePath = 'src/'
const sourceFiles = [coreBasePath + '/core/**/*.ts', //core下所有js
];

let createEachPGJs = async(cb) => { //生成文件头
  console.log('gulp build list of out interface')
  let contents = `export const VERSION = '${version}';\n`;
  const fullPaths = await globby(sourceFiles, {});
  fullPaths.forEach(fullPath => {
    let file = path.relative(coreBasePath, fullPath) //core\math\ComputationalGeom.ts 整体相对路径
    let moduleId = _filePathToModuleId(file) //core/math/ComputationalGeom
    let assignmentName = path.basename(file, path.extname(file))
    assignmentName = assignmentName.replace(/(\.|-)/g, '_') //ComputationalGeom 单个类和文件名
    // console.log(assignmentName)
    // 抛出类
    contents += 'export { ' + assignmentName + " } from './" + moduleId + "'" + os.EOL
  });

  // console.log(contents)
  fs.writeFileSync(coreBasePath + name + '.ts', contents);
  cb()
}

/**
 * esm – 将软件包保存为 ES 模块文件，在现代浏览器中可以通过 <script type=module> 标签引入
 * iife – 一个自动执行的功能，适合作为<script>标签。（如果要为应用程序创建一个捆绑包，您可能想要使用它，因为它会使文件大小变小。）
 * 
 */

let esbuildES6 = async() => { //打包
  console.log('esbuild es6')
  let out = esbuild.buildSync({
    entryPoints: [coreBasePath + name + '.ts'], //entryPoints: ['index.js'] 
    outfile: 'dist/' + name + '.js', //outfile: 'out.js',
    sourcemap: true, //调试关联
    bundle: true, //单一文件
    minify: true, //压缩
    format: 'esm',
    logLevel: 'info', //控制台信息
    external: ['cesium','@turf/turf'], //剔除外部依赖
    // tsconfig: 'tsconfig.json', //指定tsconfig.json
  })
}


// 非压缩
let esbuildES6NoMinify = async() => { //打包
  console.log('esbuild es6 nominify')
  let out = esbuild.buildSync({
    entryPoints: [coreBasePath + name + '.ts'], //entryPoints: ['index.js'] 
    outfile: 'distNoMinify/' + name + '.js', //outfile: 'out.js',
    sourcemap: true, //调试关联
    bundle: true, //单一文件
    minify: false, //压缩
    format: 'esm',
    logLevel: 'info', //控制台信息
    external: ['cesium','@turf/turf'], //剔除外部依赖
    // tsconfig: 'tsconfig.json', //指定tsconfig.json
  })
}

// 斜杠替换 \to/
let _filePathToModuleId = (moduleId) => {
  return moduleId.substring(0, moduleId.lastIndexOf(".")).replace(/\\/g, "/");
}

// ******************************************************gulp生效测试******************************************************
let GULP_CONNECT = gulpConnect;
let GULP_PACKAGE = createEachPGJs;//生成文件头
let GULP_BUILD = series(createEachPGJs, esbuildES6);//生成文件头并打包 mjs ts
let GULP_BUILD_NOMINI = series(createEachPGJs, esbuildES6NoMinify);//生成文件头并打包 非压缩js ts
export { GULP_CONNECT, GULP_PACKAGE, GULP_BUILD,GULP_BUILD_NOMINI }