import Property from 'cesium/Source/DataSources/Property'
import { Cesium } from '../outsource/LibManager'

class RenderSimple {

  /**
   * 带高程
   * @param {*} pointPrimitives PointPrimitiveCollection
   * @param {*} position 经度，纬度和高度值的列表。
   * @param {*} width 线宽
   * @param {*} color 颜色 "#FF0000"   Cesium.Color.fromCssColorString('#67ADDF')   Cesium.Color.fromAlpha(Cesium.Color.RED, 0.9); Cesium.Color.fromRgba(0x67ADDFFF);
   * @param {*} outlineWidth 外轮廓
   */
  static simplePointByPrimitives(PrimitiveCollection, position, width, color1, outlineWidth) {
    const pointPrimitive = PrimitiveCollection.add({
      show: true,
      position: position,
      pixelSize: width,
      color: color1 || Cesium.Color.WHITE,
      outlineColor: Cesium.Color.WHITE,
      outlineWidth: outlineWidth || 1.0,
      id: undefined,
    })
    return pointPrimitive
  }

  static simplePolygonByPrimitiveInstance(
    PrimitiveCollection,
    positions,
    color,
    DiffuseMapImage
  ) {
    let materialOption
    if (color) {
      materialOption = {
        fabric: {
          type: 'Color',
          uniforms: {
            color: color,
          },
        },
      }
    }
    if (DiffuseMapImage) {
      materialOption = {
        fabric: {
          type: 'DiffuseMap',
          uniforms: {
            image: DiffuseMapImage,
            repeat: { x: 1, y: 1 }, //不重复
          },
        },
      }
    }
    const polygonInstance = new Cesium.GeometryInstance({
      geometry: new Cesium.PolygonGeometry({
        polygonHierarchy: new Cesium.PolygonHierarchy(positions),
        perPositionHeight: true, //真实高度
      }),

      // attributes: { color: color }
    })
    PrimitiveCollection.add(
      new Cesium.Primitive({
        geometryInstances: [polygonInstance],
        appearance: new Cesium.MaterialAppearance({
          material: new Cesium.Material(materialOption),
        }),
      })
    )
  }

  /**
   * 带高程
   * @param {*} PrimitiveCollection PrimitiveCollection
   * @param {*} coordinates 经度，纬度和高度值的列表。
   * @param {*} width 点宽10
   * @param {*} color 颜色 "#FF0000"
   * @param {*} alpha 透明度
   */
  static simpleVolumeBox(
    PrimitiveCollection,
    coordinates,
    width,
    color,
    alpha
  ) {
    PrimitiveCollection.add({
      show: true,
      position: Cesium.Cartesian3.ZERO,
      pixelSize: width,
      color: Cesium.ColorGeometryInstanceAttribute.fromColor(
        Cesium.Color.fromCssColorString(color).withAlpha(alpha)
      ), //color  必须设置 不然没有效果,
      outlineColor: Cesium.Color.TRANSPARENT,
      outlineWidth: 0.0,
      id: undefined,
    })
  }

  /**
   *
   * @param {Cesium.PrimitiveCollection} PrimitiveCollection
   * @param {*} coordinates 经度和纬度值的列表。值交替显示[经度，纬度，经度，纬度...]。
   * @param {*} width 线宽
   * @param {*} color 颜色
   * @param {*} alpha 透明度
   */
  static simpleLineByPrimitive(
    PrimitiveCollection: Cesium.PrimitiveCollection,
    coordinates,
    width = 1.0,
    color: Cesium.Color,
    alpha: number
  ) {
    const boolAlpha = alpha !== null
    const linePrimitive = new Cesium.Primitive({
      geometryInstances: new Cesium.GeometryInstance({
        geometry: new Cesium.PolylineGeometry({
          positions: Cesium.Cartesian3.fromDegreesArray(coordinates),
          width: width, //线宽
          vertexFormat: Cesium.PolylineColorAppearance.VERTEX_FORMAT,
        }),
        attributes: {
          color: Cesium.ColorGeometryInstanceAttribute.fromColor(
            color.withAlpha(boolAlpha ? alpha : 1)
          ), //color  必须设置 不然没有效果
        },
      }),
      appearance: new Cesium.PolylineColorAppearance({
        translucent: boolAlpha,
      }),
    })

    // return linePrimitive
    PrimitiveCollection.add(linePrimitive)
  }

  /**
   * 带高程
   * @param {*} PrimitiveCollection PrimitiveCollection
   * @param {*} coordinates 经度，纬度和高度值的列表。值交替显示[经度，纬度，高度，经度，纬度，高度...]。
   * @param {*} width 线宽
   * @param {*} color 颜色 "#FF0000"
   * @param {*} alpha 透明度
   */
  static simpleLineHeightByPrimitive(
    PrimitiveCollection,
    positions,
    coordinates,
    width,
    color,
    alpha
  ) {
    const boolAlpha = alpha || false
    const linePrimitive = new Cesium.Primitive({
      geometryInstances: new Cesium.GeometryInstance({
        geometry: new Cesium.PolylineGeometry({
          positions:
            positions || Cesium.Cartesian3.fromDegreesArrayHeights(coordinates),
          width: width, //线宽
          vertexFormat: Cesium.PolylineColorAppearance.VERTEX_FORMAT,
        }),
        attributes: {
          color: Cesium.ColorGeometryInstanceAttribute.fromColor(
            Cesium.Color.fromCssColorString(color).withAlpha(alpha)
          ), //color  必须设置 不然没有效果
        },
      }),
      appearance: new Cesium.PolylineColorAppearance({
        translucent: boolAlpha,
      }),
    })
    PrimitiveCollection.add(linePrimitive)
  }

  /**
   * @discription 创建简单的立体模型
   * @param viewer Cesium.Viewer
   * @param jsonData json数据
   * @param cssColorString  颜色
   * @param height 高度
   * @param extrudedHeight  拉伸高度
   * @param callBack  回调函数
   * @param clickColorString  点击颜色
   * @returns
   *
   * @example
      let remove
      timeListen.onChange(async (value: string) => {
        console.log('renderSimple_onChange:' + value)
        if (value) {
          const data = await getJsonFromUrl('data/testBuilding.geojson')
          let callBack=entity=>{
            let array = entity.properties.propertyNames
            for (let index = 0; index < array.length; index++) {
              const element = array[index];
              console.log(element+':',entity.properties[element]._value)
            }
          }
          remove = await RenderSimple.simpleEntitiesGeojson( viewer, data, '#ff0000', 'dg', 'lg', callBack, '#000000' )
        } else {
          remove && remove()//去除模型和点选事件
          remove = null
        }
      })
   */
  static async simpleEntitiesGeojson(viewer, json, cssColorString, height?, extrudedHeight?, callBack?, clickColorString?) {
    const dataSource = await Cesium.GeoJsonDataSource.load(json)
    viewer.dataSources.add(dataSource)
    const color = Cesium.Color.fromCssColorString(cssColorString) as unknown as Cesium.MaterialProperty

    // 批量处理entity 效率较低
    const entities = dataSource.entities.values
    for (let i = 0; i < entities.length; i += 1) {
      const entity = entities[i]

      // const name = entity.name
      entity.polygon.material = color

      entity.polygon.outline = false as unknown as Property

      entity.polygon.height = entity.properties[height]
      entity.polygon.extrudedHeight = entity.properties[extrudedHeight]
    }

    //点选事件clickColorString
    if(!callBack) return
    if(!clickColorString) clickColorString = '#000000'
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    let lastSelectedEntity = null;

    handler.setInputAction((click) => {

      if(lastSelectedEntity)lastSelectedEntity.polygon.material = Cesium.Color.fromCssColorString(cssColorString) as unknown as Cesium.MaterialProperty

      // 当前选择的entity
      const pickedFeature = viewer.scene.pick(click.position)
      if (!pickedFeature || !(pickedFeature['id'] instanceof Cesium.Entity)) return //不存在认可点选就返回
      const thisEntity = pickedFeature['id']
      thisEntity.polygon.material = Cesium.Color.fromCssColorString(clickColorString) as unknown as Cesium.MaterialProperty
      lastSelectedEntity = thisEntity
      if(callBack)callBack(thisEntity)

    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

    const remove = ()=>{
      viewer.dataSources.remove(dataSource)
      handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }
    console.log('remove', remove)
    return remove
  }
}

export { RenderSimple }

// https://www.jianshu.com/p/a983160234ad 材质

// // 从url中获取业务code
// function getCodeFromUrl(url) {
//   const codes = url.split('/')
//   return codes[codes.length - 2]
// }

// 贴地 模型
// classificationType: Cesium.ClassificationType.BOTH,
// entity.polyline.clampToGround=true;

  /**
   *            // 创建材质，在MaterialAppearance中若不添加基础材质，模型将会透明
              var material = new Cesium.Material.fromType("Color");
                  material.uniforms.color =  Cesium.Color.WHITE;
              // 自定义材质
              const aper = new Cesium.MaterialAppearance({
                  material: material,
                  translucent: true,
                  closed: true,
              })
                     // 加载模型
              var p = viewer.scene.primitives.add(
                  new Cesium.Primitive({
                      geometryInstances: [instance, instance2],
                      appearance: aper,
                      releaseGeometryInstances: false,
                      compressVertices: false,
                  })
              )
   */

  //  labelByPrimitive(featuresCenter:Cesium.Cartesian3, text, fontSize, outlineWidth) {
  //   const primitiveName = {

  //       // position: Cesium.Cartesian3.fromDegrees(...featuresCenter),
  //       position: Cesium.Cartesian3.fromDegrees(featuresCenter),
  //       text: text,
  //       font: fontSize + "px Helvetica",
  //       fillColor: Cesium.Color.RED,

  //       // outlineColor: Cesium.Color.BLACK,
  //       outlineWidth: outlineWidth,
  //       style: Cesium.LabelStyle.FILL_AND_OUTLINE,
  //       horizontalOrigin: Cesium.HorizontalOrigin.CENTER
  //   }
  //   return primitiveName
  // }

  /**
   *            // 创建材质，在MaterialAppearance中若不添加基础材质，模型将会透明
              var material = new Cesium.Material.fromType("Color");
                  material.uniforms.color =  Cesium.Color.WHITE;
              // 自定义材质
              const aper = new Cesium.MaterialAppearance({
                  material: material,
                  translucent: true,
                  closed: true,
              })
                     // 加载模型
              var p = viewer.scene.primitives.add(
                  new Cesium.Primitive({
                      geometryInstances: [instance, instance2],
                      appearance: aper,
                      releaseGeometryInstances: false,
                      compressVertices: false,
                  })
              )

// 任意几何体
              var instance = new Cesium.GeometryInstance({
  geometry : new Cesium.RectangleGeometry({
    rectangle : Cesium.Rectangle.fromDegrees(-100.0, 20.0, -90.0, 30.0),
    vertexFormat : Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT
  })
});

scene.primitives.add(new Cesium.Primitive({
  geometryInstances : instance,
  appearance : new Cesium.EllipsoidSurfaceAppearance({
    material : Cesium.Material.fromType('Stripe')
  })
}));

   */

  // /**
  //  * 带高程
  //  * @param {*} PrimitiveCollection PrimitiveCollection
  //  * @param {*} positions
  //  * @param {*} width 线宽
  //  * @param {*} color 颜色 "#FF0000"
  //  * @param {*} alpha 透明度
  //  */
  // static simpleLineByPrimitive(
  //   PrimitiveCollection,
  //   positions,
  //   width,
  //   color,
  //   alpha
  // ) {
  //   debugger
  //   let linePrimitive = PrimitiveCollection.add({
  //     positions: positions,
  //     width: width,

  //     // https://www.jianshu.com/p/a983160234ad 材质
  //     material: Cesium.Material.fromType(Cesium.Material.PolylineGlowType, {
  //       glowPower: 0.2,
  //       taperPower: 0.9, //锥体
  //       color: color
  //     }),
  //   });
  //   return linePrimitive
  // }

  // static simplePolygonByPrimitive(
  //   PrimitiveCollection,
  //   positions,
  //   width,
  //   color,
  //   alpha) {}
