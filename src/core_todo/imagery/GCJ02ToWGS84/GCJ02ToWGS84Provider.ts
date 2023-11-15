import GCJ02ToWGS84Tiles from "./GCJ02ToWGS84Tiles";
import * as Cesium from "cesium";

const TILE_URL_GAODE: any = {
  // 高德 影像/矢量/标注
  gaode_img: "//webst{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
  gaode_elec:
    "//webrd{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
  gaode_cva:
    "//webst{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
  argis_elec_blue:
    "http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}",
};
class GCJ02ToWGS84XYZProvider extends Cesium.UrlTemplateImageryProvider {
  /**
   * 国测局坐标系xyz地图加载
   * @param options
   */
  constructor(options: any) {
    options["url"] =
      options.url ||
      [
        options.protocol || "",
        TILE_URL_GAODE[options.style] || TILE_URL_GAODE["elec"],
      ].join("");
    if (!options.subdomains || !options.subdomains.length) {
      options["subdomains"] = ["01", "02", "03", "04"];
    }
    if (options.crs === "WGS84") {
      options["tilingScheme"] = new GCJ02ToWGS84Tiles();
    }
    super(options);
  }
}

// //用法
// viewer.imageryLayers.addImageryProvider(
//   new GCJ02ToWGS84XYZProvider({ style: "gaode_cva", crs: "WGS84" })
// );

export { GCJ02ToWGS84XYZProvider };
