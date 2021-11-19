// let fs = require("fs");
// import { fs } from "fs";
import * as fs from 'fs';

console.log("查看 /tmp 目录");
fs.readdir("./", function(err, files){
   if (err) {
       return console.error(err);
   }
   files.forEach(function(file){
       console.log(file);
   });
});