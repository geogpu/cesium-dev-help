import { Cesium } from '../outsource/LibManager';

/**
 *
 */
class RenderGlb {
  viewer:Cesium.Viewer;

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
  renderSimpleGlb(url, modelMatrix, primitiveModelCollection, modelPosition) {
    if (!primitiveModelCollection) {
      primitiveModelCollection = this.viewer.scene.primitives
    }

    // scene.primitives.removeAll(); // Remove previous model
    const model = primitiveModelCollection.add(Cesium.Model.fromGltf({
      url: url,
      modelMatrix: modelMatrix,

      // minimumPixelSize: 128
    }));

    // parentNode节点处理

    // 新模型非位置的其他参数设置
    if (!modelPosition) {
      return false
    }
    return model.readyPromise.then((modelInfo) => {
      modelInfo.color = modelPosition.color; //模型透明度包含在Cesium.Color的alpha内
      modelInfo.colorBlendMode = Cesium.ColorBlendMode.MIX; //混合方式
      modelInfo.colorBlendAmount = modelPosition.colorBlendAmount; //mix模式浓度 默认0.5
      // 边框
      modelInfo.silhouetteColor = modelPosition.silhouetteColor;
      modelInfo.silhouetteSize = modelPosition.silhouetteSize;

      // 动画开启
      // modelInfo.activeAnimations.addAll({
      //   speedup: 0.5,
      //   loop: Cesium.ModelAnimationLoop.REPEAT
      // });

      // const camera = this.viewer.camera;

      // window.modelTest = modelInfo//调试
      // // 跟踪模型
      // // let controller = this.viewer.scene.screenSpaceCameraController;
      // let r = 2.0 * Math.max(modelInfo.boundingSphere.radius, camera.frustum.near);
      // // controller.minimumZoomDistance = r * 0.5;//镜头最近距离

      // let center = Cesium.Matrix4.multiplyByPoint(modelInfo.modelMatrix, modelInfo.boundingSphere.center, new Cesium.Cartesian3());
      // let heading = Cesium.Math.toRadians(230.0);
      // let pitch = Cesium.Math.toRadians(-20.0);
      // // camera.lookAt(center, new Cesium.HeadingPitchRange(heading, pitch, r * 2.0)); //跟踪模型中心
      // // camera.lookAt(center); //跟踪模型中心

      // // camera.lookAtTransform(Cesium.Matrix4.IDENTITY) //单位矩阵，恢复跟踪地球中心
    })

  }

  //
  /**
   * 笛卡尔添加模型
   * @param {*} viewer
   * @param {*} url
   * @param {*} position
   * @param {*} diriction
   * @param {*} scale 尺寸
   */
  static renderGlbPositionGraphic(viewer, url, position, diriction, scale) {

    const modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(position);

    // // let modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(
    // //   position,
    // //   new Cesium.HeadingPitchRoll(heading, pitch, roll)
    // // );

    // 尺寸
    // let scaleXYZ = Cesium.Matrix4.fromScale(new Cesium.Cartesian3(modelScaleArray[1], modelScaleArray[0], modelScaleArray[2]));
    // Cesium.Matrix4.multiply(modelMatrix, scaleXYZ, modelMatrix);
    // 方向

    const model = Cesium.Model.fromGltf({
      url: url,
      modelMatrix: modelMatrix,
      scale: scale

      // minimumPixelSize: 128
    })
    viewer.scene.primitives.add(model)

    return model
  }

}

export {
  RenderGlb
}