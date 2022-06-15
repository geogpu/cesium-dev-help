#  cesium-dev-help
cesium开发辅助封装

## 打包流程 Packaging process
```sh
# 打包
gulp GULP_BUILD
# 声明
tsc --build tsconfig.json

```

## 外部依赖 External dependencies 

工具库：（只import引用不打包在内部）  
cesium,turf

开发环境依赖：  
globby,esbuild,eslint,gulp,mocha,typescript

[详情...](./Tools/doc/lib.md "依赖项描述")  

## 文件结构 File structure

[详情...](./Tools/doc/file.md "文件夹描述")  

    

