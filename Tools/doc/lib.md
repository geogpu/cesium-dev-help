## 快速上手
使用esbuild快速打包、gulp编排流程、tsc创建声明文件
```js
//项目初始化并且安装依赖
pnpm init -y
pnpm install esbuild --save-dev

//项目文件 index.js

import { log } from './logger'

import messages from './messages'

// 使用模块成员
const msg = messages.hi

log(msg)

//项目文件 logger.js

export const log = msg => {
  console.log('---------- INFO ----------')
  console.log(msg)
  console.log('--------------------------')
}

export const error = msg => {
  console.error('---------- ERROR ----------')
  console.error(msg)
  console.error('---------------------------')
}
//项目文件message.js
export default {
  hi: 'test rollup'
}

// 运行打包命令:
esbuild index.js --bundle --format=esm --minify --sourcemap --outfile=out4.js
// esbuild文档
// https://esbuild.github.io/api/#define
```

## 配置文件

```js
//rollup同样支持以配置文件的方式,运行打包

//rollup.config.js文件就是rollup配置文件 默认采用ESModule导出一个配置对象 配置文件如下

//使用ESModule模块化

export default {
    input: 'src/index.js', //指定入口文件
    output: { //输出文件配置
        file: 'dist/bundle.js', //输出到指定的文件夹
        format: 'iife' //指定输出格式
    }
}

使用rollup配置文件的时候需要注意 命令行命令有些变化

yarn rollup --config  //这样是使用配置运行打包
```

## 插件

```js
rollup自身的功能就是ESModule的合并打包,要实现其他功能需要使用插件,

加载其他类型的文件,导入common类型模块/编译ECMAScript新特性，使用插件扩展,是rollup唯一的扩展方法

//事先准备

yarn init -y //项目的初始化

yarn add rollup rollup-plugin-json --dev  //安装依赖

//默认导出的是一个函数
import json from 'rollup-plugin-json'

export default {
    input: 'src/index.js',
    output: {
        file: 'dist/bundle.js',
        format: 'iife'
    },
    plugins: [
        json() //把调用的结果放进数组中而不是将函数放进数组中
    ]
}

//项目入口文件index.js内容如下

// 导入模块成员
import { log } from './logger'

import messages from './messages'

import { name, version } from '../package.json'

// 使用模块成员

const msg = messages.hi

log(msg)

log(name)

log(version)

```

## rollup 加载 npm 模块

```js
rollup默认只能以文件路径的形式加载模块,那该怎么加载npm模块呢,请看我来揭晓

rollup官方推出了一款专用的插件: rollup-plugin-node-resolve

用于加载npm 模块,使用这款插件我们可以在代码当中直接使用模块名称导入模块

安装插件

yarn add rollup-plugin-node-resolve --dev

在rollup配置文件中使用 配置文件如下

import json from 'rollup-plugin-json'

import resolve from 'rollup-plugin-node-resolve'

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife'
  },
  plugins: [
    json(),
    resolve()
  ]
}
//在文件中使用你怕吗模块这里采用的lodash中ESModule版本（rollup默认只能处理ESModule模块）
// 导入模块成员
import _ from 'lodash-es'

import { log } from './logger'

const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];

log(_.first(arr)) //=> 1

```

## rollup 加载 Commonjs 模块

```js
正如一开所说在项目中导入commonjs模块默认是不支持的,这里呢可以通过插件来实现

但是现在呢还是有大量的commonjs模块导出成员,rollup官方推出了一款插件用来兼容

插件:rollup-plugin-commonjs

依赖:安装yarn add rolllup rollup-plugin-commonjs --dev

rollup配置如下:

import json from 'rollup-plugin-json'

import resolve from 'rollup-plugin-node-resolve'

import commonjs from 'rollup-plugin-commonjs'

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife'
  },
  plugins: [
    json(),
    resolve(),
    commonjs()
  ]
}

//项目中使用

//project1.js 采用commonjs导出成员

module.exports = {

  name: 'loki'

}

//项目文件引入

import cjs from 'project1.js';

consloe.log(cjs);=> name:loki
```

## rollup 代码拆分

```js
在rollup最新版本已经支持代码拆分了, 可以使用符合ESModule的标准实现按需加载

// rollup配置如下
export default {
  input: 'src/index.js',
  output: {
    dir: 'dist', //file只能指定单个文件,如果是多个文件的话需要使用dir
    format: 'amd', //由于是浏览器模式只能只能使用amd规范
  },
}


rollup也能实现多入口打包,文件中公共的部分能提取出单独的文件,rollup配置文件如下

export default {
  // input: ['src/index.js', 'src/album.js'],//可以使用数组的方式配置多入口打包
  input: {//也可以使用过想webpack的方式配置多入口打包
    foo: 'src/index.js',
    bar: 'src/album.js'
  },
  output: {
    dir: 'dist',
    format: 'amd'
  }
}

//有一点需要注意这里呢，配置多入口打包,内部呢会使用代码拆分,输出格式需要改变为amd

//amd标准的文件不能直接在浏览器中引用,必须实现amd标准的库去加载

//这里使用的requirejs库加载的 在HTML插入script标签文件

//data-main指的是引用的文件
<script src="https://unpkg.com/requirejs@2.3.6/require.js" data-main="foo.js"></script>



1、输出效果更佳扁平

2、自动移除未引用代码

3、打包结果依然完全可读

1、加载ESModule的第三方模块比较复杂，需要配置插件

2、模块最终都被打包到一个函数中,无法实现HMR

3、浏览器环境中,代码拆分功能依赖amd库


```

### gulp 流程

```bash
# 安装
pnpm install gulp --save-dev
# 执行
gulp wx-test

# 报错 ReferenceError: require is not defined
# This can now also happen in Node.js as of version 14.
# It happens when you declare your package type as module in your package.json. If you do this, certain CommonJS variables can't be used, including require.
# To fix this, remove "type": "module" from your package.json and make sure you don't have any files ending with .mjs.
```

### globby

globby 特性
相对于 glob，globby 有以下增强功能

Promise 接口
多模式匹配
否定模式匹配
扩展目录: dir → dir/\*_/_
支持 .gitignore

```bash
# 安装
npm install globby --save-dev
```

> eslint --init
> pnpm install @typescript-eslint/eslint-plugin@latest, @typescript-eslint/parser@latest --save-dev


```
这是因为之前npm使用了淘宝镜像，淘宝镜像只支持下载，不支持上传发布，需要将配置的registry重新指向npm官方registryhttps://registry.npmjs.org/：

npm config set registry https://registry.npmjs.org/
1
登录成功：

Logged in as qianmian on https://registry.npmjs.org/.
1
但是npm官方下载包很慢，再切换到淘宝镜像：

npm config set registry https://registry.npm.taobao.org 

```