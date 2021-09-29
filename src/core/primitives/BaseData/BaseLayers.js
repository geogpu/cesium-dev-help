class BaseLayers {

  /**
   * 基础图层添加管理
   * 原始函数！
   * @param {*} viewer
   */
  constructor(viewer) {
    this.viewer = viewer
    this.layersIdConfig = new Map()
  }

  /**
   *
   * @param {*} name
   * @param {*} type
   * @param {*} index 叠加顺序 默认最高
   * @param {*} config 非默认图层配置 type url typename layer id
   *   {
                          "id": 0,
                          "pid": 0,
                          "name": "离线世界地图",
                          "icon": "/webjars/marsgis/widgets/manageBasemaps/img/basemaps/gaode_img.png",
                          "type": "tms",
                          "url": "http://192.168.0.253/DOM/ChinaMap",
                          "fileExtension": "jpeg",
                          "visible": true,
                          "order": 0
                      },
   * @returns
   */
  addLayer(config) {

    //请求设置
    Cesium.RequestScheduler.maximumRequests = 500
    Cesium.RequestScheduler.maximumRequestsPerServer = 500

    // Cesium.RequestScheduler.maximumRequestsPerServer= false
    let key
    let provider //图层
    switch (config.type) {
      case 'tms': //tms
        provider = new Cesium.TileMapServiceImageryProvider({
          url: config.url, //url为文件夹地址
        })
        break

      //配置
      //     "map_pipline_wms": {
      //     "url": "http://192.168.5.102:8080/geoserver/PipeBatch/wms",
      //         "typename": "PipeBatch:map_pipeline"
      // },
      //     "map_pipline_wmts": {
      //     "url": "http://192.168.5.102:8080/geoserver/gwc/service/wmts",
      //         "typename": "PipeBatch:map_pipeline"
      // },
      case 'geoserver_WMTS': //geoserver WMTS
        let matrixIds = [
          'EPSG:4326:0',
          'EPSG:4326:1',
          'EPSG:4326:2',
          'EPSG:4326:3',
          'EPSG:4326:4',
          'EPSG:4326:5',
          'EPSG:4326:6',
          'EPSG:4326:7',
          'EPSG:4326:8',
          'EPSG:4326:9',
          'EPSG:4326:10',
          'EPSG:4326:11',
          'EPSG:4326:12',
          'EPSG:4326:13',
          'EPSG:4326:14',
          'EPSG:4326:15',
          'EPSG:4326:16',
          'EPSG:4326:17',
          'EPSG:4326:18',
          'EPSG:4326:19',
          'EPSG:4326:20',
          'EPSG:4326:21',
        ]

        //1.新建ImageryProvider
        provider = new Cesium.WebMapTileServiceImageryProvider({
          url: config.url,
          layer: config.typename,
          style: '',
          format: 'image/png',
          tileMatrixSetID: 'EPSG:4326',
          tileMatrixLabels: matrixIds,
          tilingScheme: new Cesium.GeographicTilingScheme({
            numberOfLevelZeroTilesX: 2,
            numberOfLevelZeroTilesY: 1,
          }),
        })
        break
      case 'osm_vt': //矢量图
        provider = new Cesium.OpenStreetMapImageryProvider({
          url: 'https://a.tile.openstreetmap.org/',
        })
        break

      //天地图影像
      case 'tdt_img':
        key = config.key || '8a7a551905711535885142a660a10111'
        provider = new Cesium.WebMapTileServiceImageryProvider({
          url:
            'http://{s}.tianditu.gov.cn/img_c/wmts?service=wmts&request=GetTile&version=1.0.0' +
            '&LAYER=img&tileMatrixSet=c&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}' +
            '&style=default&format=tiles&tk=' +
            key,
          layer: 'tdtCva',
          style: 'default',
          format: 'tiles',
          tileMatrixSetID: 'c',
          subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
          tilingScheme: new Cesium.GeographicTilingScheme(),
          tileMatrixLabels: [
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '10',
            '11',
            '12',
            '13',
            '14',
            '15',
            '16',
            '17',
            '18',

            // , "19"
          ],
          maximumLevel: 18,
          show: false,
        })
        break

      //天地图标注
      case 'tdt_lb':
        key = config.key || '8a7a551905711535885142a660a10111'
        provider = new Cesium.WebMapTileServiceImageryProvider({
          url:
            'http://{s}.tianditu.gov.cn/cia_c/wmts?service=wmts&request=GetTile&version=1.0.0' +
            '&LAYER=cia&tileMatrixSet=c&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}' +
            '&style=default&format=tiles&tk=' +
            key,
          layer: 'tdtCva',
          style: 'default',
          format: 'tiles',
          tileMatrixSetID: 'c',
          subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
          tilingScheme: new Cesium.GeographicTilingScheme(),
          tileMatrixLabels: [
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '10',
            '11',
            '12',
            '13',
            '14',
            '15',
            '16',
            '17',
            '18',
          ],
          maximumLevel: 18,
          show: false,
        })
        break
      case 'bing_img': //bing 影像
        provider = Cesium.createWorldImagery({
          style: Cesium.IonWorldImageryStyle.AERIAL,
        })
        break
      case 'bing_lb': //bing影像附带标注
        provider = Cesium.createWorldImagery({
          style: Cesium.IonWorldImageryStyle.AERIAL_WITH_LABELS,
        })
        break

      case '3dtiles': //bing影像附带标注
        config.layer = this.viewer.scene.primitives.add(
          new Cesium.Cesium3DTileset({

            // url: '../../../data/freedata/SampleData/Cesium3DTiles/Classification/Photogrammetry/tileset.json'
            url: config.url,
            maximumScreenSpaceError: 2, //最大的屏幕空间误差
            maximumNumberOfLoadedTiles: 10000, //最大加载瓦片个数
            show: true,
          })
        )
        this.layersIdConfig.set(config.id, config)
        break

      case 'test3Dtiles': //ion 数据
        Cesium.Ion.defaultAccessToken =
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2MTRiM2IxYy1iZGZkLTRmOTktYWVhMi0xZTE2ZjU4NzliMDMiLCJpZCI6Mzc0NjAsImlhdCI6MTYwNTA3NzQ1MX0.GEvT_KwEV9MjAqyXHyS-ezcITyKc53X3MQDWBLPElI0'
        config.layer = this.viewer.scene.primitives.add(
          new Cesium.Cesium3DTileset({
            url: Cesium.IonResource.fromAssetId(354759), //测试3dtiles
            // url: Cesium.IonResource.fromAssetId(96188),
            maximumScreenSpaceError: 2, //最大的屏幕空间误差
            maximumNumberOfLoadedTiles: 10000, //最大加载瓦片个数
            show: true,
          })
        )
        this.layersIdConfig.set(config.id, config)
        break
      case 'terrain':
        this.viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
          url: config.url,

          // requestWaterMask: true
        })
        this.layersIdConfig.set(config.id, config)
        break
      case 'WorldTerrain': //ion 数据
        this.viewer.terrainProvider = Cesium.createWorldTerrain({

          //requestWaterMask: config.requestWaterMask,
          requestWaterMask: true, // required for water effects
          // requestVertexNormals: true, // required for terrain lighting
        })
        this.layersIdConfig.set(config.id, config)
        break
      default:
        break
    }

    if (provider) {

      //注意新加图层排序
      config.layer = this.viewer.imageryLayers.addImageryProvider(
        provider,
        config.order
      )
      this.layersIdConfig.set(config.id, config)
    }
  }

  remove(config) {
    let layer = this.layersIdConfig.get(config.id).layer

    switch (config.type) {
      case '3dtiles':
        this.viewer.scene.primitives.remove(layer)
        break
      case 'test3Dtiles':
        this.viewer.scene.primitives.remove(layer)
        break
      case 'terrain':
        if (this.viewer.terrainProvider._ready) {

          //清除原有地形
          this.viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider({})
        }
        break
      case 'WorldTerrain':
        if (this.viewer.terrainProvider._ready) {

          //清除原有地形
          this.viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider({})
        }
        break
      default:
        this.viewer.imageryLayers.remove(layer)
        break
    }

    this.layersIdConfig.delete(config.id)
  }

  removeAll() {
    this.layersIdConfig.forEach((config) => {
      this.remove(config)
    })
  }
}
export { BaseLayers }
