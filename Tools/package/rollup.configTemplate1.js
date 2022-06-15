export default {
  input: 'src/cesium-dev-help/cesium-dev-help.js', //指定入口文件
  output: [

    // {
    //   //输出文件配置
    //   file: 'dist/test.js', //输出到指定的文件夹
    //   format: 'umd', //指定输出格式
    // },
    {
      format: 'esm',
      file: 'dist/cesium-dev-help.mjs', //输出到指定的文件夹
    },
  ],
}
