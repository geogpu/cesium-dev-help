class RenderInstance {
  constructor(viewer) {
    this.viewer = viewer;
  }

  /**
   * 添加单模型
   * @param {*} url 
   * @param {*} modelMatrix 
   * @param {*} primitiveModelCollection  要添加的渲染集合
   * @param {*} modelPosition 混合样式 动画设置 
   */
  PolylineVolumeGeometryInstance(id, polylinePositions, PrimitiveCollection, shapePositions) {
    let polylinevolumeinstance = new Cesium.GeometryInstance({
      geometry: new Cesium.PolylineVolumeGeometry({
        vertexFormat: Cesium.MaterialAppearance.MaterialSupport.BASIC.vertexFormat,
        polylinePositions: polylinePositions,

        // Cesium.Cartesian3.fromDegreesArrayHeights(
        //   [
        //     90, 35, 50000,
        //     110, 35, 50000
        //   ]),
        shapePositions: shapePositions,

        // cornerType: Cesium.CornerType.MITERED
      }),

      id: id
    });

    PrimitiveCollection.add(new Cesium.Primitive({
      geometryInstances: [polylinevolumeinstance],
      appearance: new Cesium.MaterialAppearance({
        material: Cesium.Material.fromType('Color', {
          color: Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString('#79D9FF'), 0.4)
        }),

        // faceForward: true
        flat: true
      }) //PolylineColorAppearance/PolylineMaterialAppearance请区分使用场景
    }));
  }

}

export {
  
  RenderInstance
}