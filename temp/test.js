console.log('test')
// let promise = new Promise(function (resolve, reject) {
//   console.log('1')
//   resolve()
// })
// setTimeout(() => console.log('2'), 0)
// // promise.then(() => console.log('3'))
// console.log('4')

// async function getData_1() {
//   return '100'
// }

// function getData_2() {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve('200')
//     }, 2000)
//   })
// }

// async function run() {
//   const data_2 = await getData_2()
//   console.log(data_2)

//   const data_1 = await getData_1()
//   console.log(data_1)
// }

// run()

// function* fn() {
//   var a = yield 'hello',
//     b = yield 'hello1'
//   yield
//   console.log(a + 1, b)
// }
// var iter = fn()
// var res = iter.next()
// console.log(res.value) //hello
// iter.next(2, 3)
// iter.next() //2

// E:/wangxu/project/gitFull/test/rollupExcel/temp/DividePolygonsIntoTriangles.js
import fs from 'fs'
import path from 'path'
import SMB2 from 'smb2'
// fs.readFile('E:/wangxu/project/gitFull/test/rollupExcel/temp/test copy.js', function (err, data) {
// fs.readFile(
//   'file://‪192.168.0.248/software/【14】其他备份/test.txt',
//   function (err, data) {
//     if (err) {
//       return console.error(err)
//     }
//     console.log('异步读取: ' + data.toString())
//   }
// )

var smb2Client = new SMB2({
  share: '\\\\192.168.0.173\\共享', //共享文件夹地址
  domain: 'DOMAIN',
  username: 'Administrator', //用户名
  password: '123', //密码
})
//[options],可选参数，可指定flag（文件操作选项，如r+ 读写；w+ 读写，文件不存在则创建）及encoding属性


smb2Client.mkdir('test00', function (err) {
  if (err) throw err;
  console.log('Folder created!');
});

  smb2Client.readFile('test1\\test.txt',{flag: 'r+', encoding: 'utf8'},(err, data)=>{   //设置编码格式
    if(err) throw err;
    console.log(data);     //data就是读取的字符
    smb2Client.writeFile('test0\\a.txt',data, (err)=> {
      if (err) throw err;
      console.log('It\'s saved!');
  })

});

// import ExcelJS from 'exceljs'

// const workbook = new ExcelJS.stream.xlsx.WorkbookReader(
//   'c:/Users/Administrator/Desktop/王旭实验数据.xlsx'
//   //  'c:\\Users\\Administrator\\Desktop\\王旭实验数据.xlsx'
// )

// let count = 0
// for await (const worksheet of workbook) {
//   console.log(worksheet.name)
//   for await (const row of worksheet) {
//     let infile = row.getCell(3).value + path.sep + row.getCell(2).value
//     let outfile = row.getCell(3).value + path.sep + row.getCell(4).value+ path.sep + row.getCell(2).value

//     smb2Client.readFile(
//       row.getCell(2).value,
//       { flag: 'r+', encoding: 'utf8' },
//       (err, data) => {
//         //设置编码格式
//         if (err) return 
//         // console.log(data) //data就是读取的字符
//         smb2Client.writeFile(row.getCell(4).value+ path.sep + row.getCell(2).value, data, (err) => {
//           if (err) return
//           console.log("It's saved!")
//         })
//       }
//     )

//     console.log(infile)
//     console.log(outfile)
//   }
// }

// const workbook1 = new ExcelJS.Workbook();
// await workbook1.xlsx.readFile('c:/Users/Administrator/Desktop/王旭实验数据.xlsx');
// workbook1.eachSheet(function(worksheet, sheetId) {
//   console.log('1',worksheet.name)
// });
