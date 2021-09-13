export default {
  input: 'src/cesiumplugin/cesiumplugin.js', //指定入口文件
  output: [

    // {
    //   //输出文件配置
    //   file: 'dist/test.js', //输出到指定的文件夹
    //   format: 'umd', //指定输出格式
    // },
    {
      format: 'esm',
      file: 'dist/cesiumplugin.mjs', //输出到指定的文件夹
    },
  ],
}
