export default {
  input: 'src/template1/index.js', //指定入口文件
  output: [
    // {
    //   //输出文件配置
    //   file: 'dist/test.js', //输出到指定的文件夹
    //   format: 'umd', //指定输出格式
    // },
    {
      format: 'esm',
      file: 'dist/template1.mjs', //输出到指定的文件夹
    },
  ],
}
