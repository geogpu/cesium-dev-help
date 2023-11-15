/**
 * @Author: Caven
 * @Date: 2020-01-15 20:31:46
 */
import * as Cesium from "cesium";

// // 天地图
// viewer.imageryLayers.addImageryProvider(
//   new TdtImageryXYZProvider({
//     style: "img", //style: vec、cva、img、cia、ter
//     key: "f29b5b0e3b72ecc4408c0ba8ae3074cc",
//   })
// );
const MAP_URL =
  "//t{s}.tianditu.gov.cn/DataServer?T={style}_w&x={x}&y={y}&l={z}&tk={key}";
class TdtImageryXYZProvider extends Cesium.UrlTemplateImageryProvider {
  constructor(options: any) {
    super({
      url: [
        options.protocol || "",
        MAP_URL.replace(/\{style\}/g, options.style || "vec").replace(
          /\{key\}/g,
          options.key || ""
        ),
      ].join(""),
      subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
      maximumLevel: 18,
    });
  }
}

// 	78872d82607509997e7ad7505dc714b9
// b97194d9a77e971f8f25f333c9f6c060

// viewer.imageryLayers.addImageryProvider(
//   new Cesium.WebMapTileServiceImageryProvider({
//       url: "http://{s}.tianditu.gov.cn/img_c/wmts?service=wmts&request=GetTile&version=1.0.0" +
//           "&LAYER=img&tileMatrixSet=c&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}" +
//           "&style=default&format=tiles&tk=f29b5b0e3b72ecc4408c0ba8ae3074cc",
//       layer: "tdtCva",
//       style: "default",
//       format: "tiles",
//       tileMatrixSetID: "c",
//       subdomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
//       tilingScheme: new Cesium.GeographicTilingScheme(),
//       tileMatrixLabels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18"],
//       // maximumLevel: 18,
//       // show: false
//   })
// );

//   let layer1 = new Cesium.WebMapTileServiceImageryProvider({               //全球矢量底图服务
//     url: "http://t0.tianditu.gov.cn/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk="+token,
//     subdomains: subdomains,
//         layer: "tdtImgLayer",
//         style: "default",
//         format: "image/jpeg",
//         tileMatrixSetID: "GoogleMapsCompatible",//使用谷歌的瓦片切片方式
//         show: true
// })

// 添加矢量底图注记：
// letlayer2 =  new Cesium.WebMapTileServiceImageryProvider({
//   url:"http://t0.tianditu.gov.cn/cva_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cva&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk="+token,
//   layer: "tdtCvaLayer", style: "default", format: "image/jpeg", tileMatrixSetID: "GoogleMapsCompatible", }),

export { TdtImageryXYZProvider };
