// src/core/outsource/LibManager.ts
import * as Cesium from "cesium";
import * as turf from "@turf/turf";
var LibManager = class {
  static getCesium() {
    return Cesium;
  }
  static getTurf() {
    return turf;
  }
  static toString() {
    return "Cesium turf";
  }
};

// src/core/init/InitViewer.ts
var InitViewer = class {
  constructor(defaultAccessToken) {
    this.viewers = /* @__PURE__ */ new Map();
    Cesium.Ion.defaultAccessToken = defaultAccessToken || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2MTRiM2IxYy1iZGZkLTRmOTktYWVhMi0xZTE2ZjU4NzliMDMiLCJpZCI6Mzc0NjAsImlhdCI6MTYwNTA3NzQ1MX0.GEvT_KwEV9MjAqyXHyS-ezcITyKc53X3MQDWBLPElI0";
  }
  static getInstance(defaultAccessToken) {
    if (!this.Instance) {
      this.Instance = new InitViewer(defaultAccessToken);
    }
    return this.Instance;
  }
  addViewer(viewerId) {
    const viewer = new Cesium.Viewer(viewerId, {
      animation: true,
      baseLayerPicker: true,
      fullscreenButton: true,
      vrButton: false,
      geocoder: false,
      homeButton: false,
      infoBox: false,
      sceneModePicker: false,
      selectionIndicator: false,
      timeline: true,
      navigationHelpButton: false,
      navigationInstructionsInitiallyVisible: false
    });
    viewer.imageryLayers.removeAll();
    this.viewers.set(viewerId, viewer);
    return viewer;
  }
};

// src/core/init/ViwerSet.ts
function ViwerSet(viewer) {
  viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
  viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
  if (window.navigator.userAgent.toLowerCase().indexOf("msie") >= 0) {
    viewer.targetFrameRate = 20;
    viewer.requestRenderMode = true;
  }
  viewer.scene.logarithmicDepthBuffer = false;
  viewer.scene.postProcessStages.fxaa.enabled = false;
  console.log("--------", "postProcessStages.fxaa.enabled = true");
  viewer.scene.highDynamicRange = false;
  Cesium.RequestScheduler.maximumRequests = 100;
  Cesium.RequestScheduler.maximumRequestsPerServer = 100;
  if (viewer.sceneModePicker)
    viewer.sceneModePicker.viewModel.duration = 0;
  const supportsImageRenderingPixelated = viewer.cesiumWidget._supportsImageRenderingPixelated;
  if (supportsImageRenderingPixelated) {
    let vtxf_dpr = window.devicePixelRatio;
    while (vtxf_dpr >= 2) {
      vtxf_dpr /= 2;
    }
    viewer.resolutionScale = vtxf_dpr;
  }
}

// src/core/math/ComputationalGeom.ts
var ComputationalGeom = class {
  static getLerpByPoints(positionTwo, density) {
    const pointStart = positionTwo[0];
    const pointEnd = positionTwo[1];
    const positions = [pointStart];
    const countPoints = Math.ceil(density * Cesium.Cartesian3.distance(pointStart, pointEnd));
    for (let i = 1; i < countPoints; i++) {
      const ponitThis = Cesium.Cartesian3.lerp(pointStart, pointEnd, i / countPoints, new Cesium.Cartesian3());
      positions.push(ponitThis);
    }
    positions.push(pointEnd);
    return positions;
  }
  static polygonDirectionSet(clickPositions, polygonDirection) {
    const i = clickPositions.length - 1;
    const points = clickPositions;
    const directionLast = Cesium.Cartesian3.subtract(points[i - 1], points[i - 2], new Cesium.Cartesian3());
    const directionNow = Cesium.Cartesian3.subtract(points[i], points[i - 1], new Cesium.Cartesian3());
    const directionUpNow = Cesium.Cartesian3.cross(directionLast, directionNow, new Cesium.Cartesian3());
    const directionPointDirectionUpNowAngle = Cesium.Cartesian3.angleBetween(directionUpNow, points[i]);
    const directionEnd = Cesium.Cartesian3.subtract(points[i], points[0], new Cesium.Cartesian3());
    const directionUpEnd = Cesium.Cartesian3.cross(directionEnd, directionNow, new Cesium.Cartesian3());
    const directionPointDirectionUpEndAngle = Cesium.Cartesian3.angleBetween(directionUpEnd, points[i]);
    if (directionPointDirectionUpNowAngle < 1.57) {
      if (directionPointDirectionUpEndAngle > 1.57) {
      }
      console.log("\u9006\u65F6\u9488");
      polygonDirection = -1;
    } else {
      if (directionPointDirectionUpEndAngle < 1.57) {
      }
      console.log("\u987A\u65F6\u9488");
      polygonDirection = 1;
    }
    return polygonDirection;
  }
};

// src/core/control/mouse/MouseListen.ts
var MouseListen = class {
  constructor(viewer) {
    this.viewer = viewer;
    this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
  }
  stateStart() {
    this.clickPositionsArrays = [];
    this.clickPositions = [new Cesium.Cartesian3()];
    this.click_LEFT_CLICK_Time = new Date();
  }
  drawListen() {
    this.stateStart();
    this.handler.setInputAction((movement) => {
      if (!movement.endPosition) {
        return;
      }
      const clickScene = this.viewer.scene.pickPosition(movement.endPosition);
      if (clickScene) {
        this.clickPositions[this.clickPositions.length - 1] = clickScene;
      }
      this.clickMouseMove = this.clickPositions;
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    this.handler.setInputAction((click) => {
      const clickScene = this.viewer.scene.pickPosition(click.position);
      if (clickScene && this.singleLeftClickBool()) {
        this.click_LEFT_CLICK = this.clickPositions;
        this.clickPositions.push(clickScene);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    this.handler.setInputAction((click) => {
      const clickWindow = click.position;
      const clickScene = this.viewer.scene.pickPosition(clickWindow);
      if (clickScene) {
        this.clickPositions.pop();
        this.clickPositionsArrays.push(this.clickPositions);
        this.clickPositionsStatic = this.clickPositions.slice(0);
        this.click_LEFT_DOUBLE_CLICK = this.clickPositions;
        this.clickPositions = [new Cesium.Cartesian3()];
      }
    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
  }
  set clickMouseMove(value) {
    this.test();
  }
  set click_LEFT_CLICK(value) {
    this.test();
  }
  set click_LEFT_DOUBLE_CLICK(value) {
    this.test();
  }
  removeAll() {
    if (this.handler) {
      this.handler.destroy();
      this.handler = null;
    }
    this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    this.clickPositionsArrays = null;
    this.clickPositions = null;
  }
  singleLeftClickBool() {
    const click_LEFT_CLICK_TimeNew = new Date();
    const leftClickTimeBool = click_LEFT_CLICK_TimeNew.getTime() - this.click_LEFT_CLICK_Time.getTime() > 300;
    const leftClickDistanceBool = this.clickPositions.length < 2 || Cesium.Cartesian3.distance(this.clickPositions[this.clickPositions.length - 1], this.clickPositions[this.clickPositions.length - 2]) > 0.1;
    this.click_LEFT_CLICK_Time = click_LEFT_CLICK_TimeNew;
    return leftClickTimeBool || leftClickDistanceBool;
  }
  test() {
    console.log(this.clickPositions);
    console.log(this.clickPositionsArrays);
  }
};

// src/core/mouse/HoleDraw.ts
var HoleDraw = class extends MouseListen {
};

// src/core/renderGeom/RenderInstance.ts
var RenderInstance = class {
  constructor(viewer) {
    this.viewer = viewer;
  }
  PolylineVolumeGeometryInstance(id, polylinePositions, PrimitiveCollection, shapePositions) {
    const polylinevolumeinstance = new Cesium.GeometryInstance({
      geometry: new Cesium.PolylineVolumeGeometry({
        vertexFormat: Cesium.MaterialAppearance.MaterialSupport.BASIC.vertexFormat,
        polylinePositions,
        shapePositions
      }),
      id
    });
    PrimitiveCollection.add(new Cesium.Primitive({
      geometryInstances: [polylinevolumeinstance],
      appearance: new Cesium.MaterialAppearance({
        material: Cesium.Material.fromType("Color", {
          color: Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString("#79D9FF"), 0.4)
        }),
        flat: true
      })
    }));
  }
};

// src/core/renderGeom/RenderSimple.ts
var RenderSimple = class {
  static simplePointByPrimitives(PrimitiveCollection, position, width, color1, outlineWidth) {
    const pointPrimitive = PrimitiveCollection.add({
      show: true,
      position,
      pixelSize: width,
      color: color1 || Cesium.Color.WHITE,
      outlineColor: Cesium.Color.WHITE,
      outlineWidth: outlineWidth || 1,
      id: void 0
    });
    return pointPrimitive;
  }
  static simplePolygonByPrimitiveInstance(PrimitiveCollection, positions, color, DiffuseMapImage) {
    let materialOption;
    if (color) {
      materialOption = {
        fabric: {
          type: "Color",
          uniforms: {
            color
          }
        }
      };
    }
    if (DiffuseMapImage) {
      materialOption = {
        fabric: {
          type: "DiffuseMap",
          uniforms: {
            image: DiffuseMapImage,
            repeat: { x: 1, y: 1 }
          }
        }
      };
    }
    const polygonInstance = new Cesium.GeometryInstance({
      geometry: new Cesium.PolygonGeometry({
        polygonHierarchy: new Cesium.PolygonHierarchy(positions),
        perPositionHeight: true
      })
    });
    PrimitiveCollection.add(new Cesium.Primitive({
      geometryInstances: [polygonInstance],
      appearance: new Cesium.MaterialAppearance({
        material: new Cesium.Material(materialOption)
      })
    }));
  }
  static simpleVolumeBox(PrimitiveCollection, coordinates, width, color, alpha) {
    PrimitiveCollection.add({
      show: true,
      position: Cesium.Cartesian3.ZERO,
      pixelSize: width,
      color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromCssColorString(color).withAlpha(alpha)),
      outlineColor: Cesium.Color.TRANSPARENT,
      outlineWidth: 0,
      id: void 0
    });
  }
  static simpleLineByPrimitive(PrimitiveCollection, coordinates, width, color, alpha) {
    const boolAlpha = alpha !== null;
    const linePrimitive = new Cesium.Primitive({
      geometryInstances: new Cesium.GeometryInstance({
        geometry: new Cesium.PolylineGeometry({
          positions: Cesium.Cartesian3.fromDegreesArray(coordinates),
          width,
          vertexFormat: Cesium.PolylineColorAppearance.VERTEX_FORMAT
        }),
        attributes: {
          color: Cesium.ColorGeometryInstanceAttribute.fromColor(color.withAlpha(boolAlpha ? alpha : 1))
        }
      }),
      appearance: new Cesium.PolylineColorAppearance({
        translucent: boolAlpha
      })
    });
    PrimitiveCollection.add(linePrimitive);
  }
  static simpleLineHeightByPrimitive(PrimitiveCollection, positions, coordinates, width, color, alpha) {
    const boolAlpha = alpha || false;
    const linePrimitive = new Cesium.Primitive({
      geometryInstances: new Cesium.GeometryInstance({
        geometry: new Cesium.PolylineGeometry({
          positions: positions || Cesium.Cartesian3.fromDegreesArrayHeights(coordinates),
          width,
          vertexFormat: Cesium.PolylineColorAppearance.VERTEX_FORMAT
        }),
        attributes: {
          color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromCssColorString(color).withAlpha(alpha))
        }
      }),
      appearance: new Cesium.PolylineColorAppearance({
        translucent: boolAlpha
      })
    });
    PrimitiveCollection.add(linePrimitive);
  }
};

// src/core/renderModel/RenderGlb.ts
var RenderGlb = class {
  constructor(viewer) {
    this.viewer = viewer;
  }
  renderSimpleGlb(url, modelMatrix, primitiveModelCollection, modelPosition) {
    if (!primitiveModelCollection) {
      primitiveModelCollection = this.viewer.scene.primitives;
    }
    const model = primitiveModelCollection.add(Cesium.Model.fromGltf({
      url,
      modelMatrix
    }));
    if (!modelPosition) {
      return false;
    }
    return model.readyPromise.then((modelInfo) => {
      modelInfo.color = modelPosition.color;
      modelInfo.colorBlendMode = Cesium.ColorBlendMode.MIX;
      modelInfo.colorBlendAmount = modelPosition.colorBlendAmount;
      modelInfo.silhouetteColor = modelPosition.silhouetteColor;
      modelInfo.silhouetteSize = modelPosition.silhouetteSize;
    });
  }
  static renderGlbPositionGraphic(viewer, url, position, diriction, scale) {
    const modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(position);
    const model = Cesium.Model.fromGltf({
      url,
      modelMatrix,
      scale
    });
    viewer.scene.primitives.add(model);
    return model;
  }
};

// src/core/renderModel/renderModelByprimitive.ts
var renderModelByprimitive = class {
};

// src/core/tiles/CesiumPrimitivesProvider.ts
var CesiumPrimitivesProvider = class {
  constructor(viewer) {
    this.viewer = viewer;
    this.camera = viewer.scene.camera;
  }
  setParams(levZ, tilesCountAdd, requestHeight, renderArrayHeight, startDlat) {
    this.tilesCountAdd = tilesCountAdd;
    this.tilesCount = 2 * this.tilesCountAdd + 1;
    this.tilesSize = Math.pow(this.tilesCount, 2);
    this.requestHeight = requestHeight;
    this.renderArrayHeight = renderArrayHeight;
    if (levZ) {
      this.levZ = levZ;
    } else if (startDlat) {
      this.levZ = Math.floor(Math.log(Math.PI / startDlat) / Math.log(2));
    }
    this.dlat = Math.PI / Math.pow(2, this.levZ);
    this.dlon = 2 * this.dlat;
    this.row = 0;
    this.col = 0;
    this.tilesIdArraysOld = [];
    this.tilesMapWillAdd = /* @__PURE__ */ new Map();
    this.tilesSetWillDelete = /* @__PURE__ */ new Set();
    this.tilesMapRenderNow = /* @__PURE__ */ new Map();
  }
  startListener(featureFunction) {
    this.cesiumParams = {
      viewer: this.viewer,
      camera: this.camera,
      endRender: false
    };
    this.featureFunction = featureFunction;
    if (!featureFunction) {
      this.featureFunction = this.testCameraBox;
    }
    this.batchRender();
    this.removeChanged = this.camera.changed.addEventListener(() => {
      this.batchRender();
    });
  }
  endListener() {
    this.removeChanged();
    this.destoryTiles();
  }
  destoryTiles() {
    this.tilesMapWillAdd.clear();
    this.cesiumParams.endRender = true;
    this.tilesIdArraysOld = [];
    this.tilesMapRenderNow.forEach((primitiveTileDestory, idDestory) => {
      this.viewer.scene.primitives.remove(primitiveTileDestory);
      this.tilesMapRenderNow.delete(idDestory);
    });
  }
  testCameraBox(cesiumParams, tilesMapRenderNow, positionArrays, id, renderArrayHeight) {
    const viewer = cesiumParams.viewer;
    let primitiveTile = null;
    const greenPolygonInstance = new Cesium.GeometryInstance({
      geometry: Cesium.PolygonGeometry.fromPositions({
        extrudedHeight: 10,
        positions: Cesium.Cartesian3.fromDegreesArray(positionArrays),
        vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT
      }),
      attributes: {
        distanceDisplayCondition: new Cesium.DistanceDisplayConditionGeometryInstanceAttribute(renderArrayHeight[0], renderArrayHeight[1]),
        color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromRandom({
          alpha: 0.5
        }))
      }
    });
    primitiveTile = new Cesium.Primitive({
      geometryInstances: [greenPolygonInstance],
      appearance: new Cesium.PerInstanceColorAppearance({
        closed: true,
        translucent: false
      })
    });
    viewer.scene.primitives.add(primitiveTile);
    tilesMapRenderNow.set(id, primitiveTile);
  }
  getTilesArrays(lon, lat) {
    const xLon = Math.PI + lon;
    const yLat = Math.PI / 2 - lat;
    const x = xLon / this.dlon;
    const y = yLat / this.dlat;
    const rowNew = Math.floor(y);
    const colNew = Math.floor(x);
    const rowChange = rowNew - this.row;
    const colChange = colNew - this.col;
    if (rowChange == 0 && colChange == 0) {
      return false;
    }
    const tilesArrays = [];
    const tilesIdArrays = [];
    const PI = Math.PI;
    const cc2rd = 180 / PI;
    for (let i = -this.tilesCountAdd; i <= this.tilesCountAdd; i++) {
      for (let j = -this.tilesCountAdd; j <= this.tilesCountAdd; j++) {
        const tile = {
          id: colNew + j + " " + (rowNew + i),
          positionArrays: []
        };
        tile.positionArrays = [
          ((colNew + j) * this.dlon - PI) * cc2rd,
          (PI / 2 - (rowNew + i) * this.dlat) * cc2rd,
          ((colNew + j + 1) * this.dlon - PI) * cc2rd,
          (PI / 2 - (rowNew + i) * this.dlat) * cc2rd,
          ((colNew + j + 1) * this.dlon - PI) * cc2rd,
          (PI / 2 - (rowNew + i + 1) * this.dlat) * cc2rd,
          ((colNew + j) * this.dlon - PI) * cc2rd,
          (PI / 2 - (rowNew + i + 1) * this.dlat) * cc2rd
        ];
        tilesArrays.push(tile);
        tilesIdArrays.push(tile.id);
      }
    }
    const tilesArraysDeleteNew = this.tilesIdArraysOld.filter((id) => !new Set(tilesIdArrays).has(id));
    const tilesArraysAddNew = tilesArrays.filter((item) => !new Set(this.tilesIdArraysOld).has(item.id));
    if (this.tilesIdArraysOld) {
      for (let i = 0; i < tilesArraysDeleteNew.length; i++) {
        this.tilesSetWillDelete.add(tilesArraysDeleteNew[i]);
        this.tilesMapWillAdd.delete(tilesArraysDeleteNew[i]);
      }
    }
    for (let i = 0; i < tilesArraysAddNew.length; i++) {
      this.tilesMapWillAdd.set(tilesArraysAddNew[i].id, tilesArraysAddNew[i].positionArrays);
    }
    this.tilesIdArraysOld = tilesIdArrays.slice();
    this.row = Math.floor(y);
    this.col = Math.floor(x);
    return true;
  }
  batchRender() {
    const cameraPosition = this.camera.positionCartographic;
    if (cameraPosition.height < this.requestHeight && this.getTilesArrays(cameraPosition.longitude, cameraPosition.latitude)) {
      this.tilesMapWillAdd.forEach((positionArrays, id) => {
        this.tilesMapWillAdd.delete(id);
        this.featureFunction(this.cesiumParams, this.tilesMapRenderNow, positionArrays, id, this.renderArrayHeight);
      });
      this.tilesSetWillDelete.forEach((tileDelete) => {
        if (this.tilesMapRenderNow.get(tileDelete)) {
          this.viewer.scene.primitives.remove(this.tilesMapRenderNow.get(tileDelete));
          this.tilesSetWillDelete.delete(tileDelete);
          this.tilesMapRenderNow.delete(tileDelete);
        }
      });
    }
  }
};

// src/core/tiles/Universal3DSceneInterface.ts
var Universal3DSceneInterface = class {
  constructor(viewer) {
    this.viewer = viewer;
    this.camera = viewer.scene.camera;
  }
  setParams(levZ, tilesCountAdd, requestHeight, renderArrayHeight, startDlat) {
    this.tilesCountAdd = tilesCountAdd;
    this.tilesCount = 2 * this.tilesCountAdd + 1;
    this.tilesSize = Math.pow(this.tilesCount, 2);
    this.requestHeight = requestHeight;
    this.renderArrayHeight = renderArrayHeight;
    if (levZ) {
      this.levZ = levZ;
    } else if (startDlat) {
      this.levZ = Math.floor(Math.log(Math.PI / startDlat) / Math.log(2));
    }
    this.dlat = Math.PI / Math.pow(2, this.levZ);
    this.dlon = 2 * this.dlat;
    this.row = 0;
    this.col = 0;
    this.tilesIdArraysOld = [];
    this.tilesMapWillAdd = /* @__PURE__ */ new Map();
    this.tilesSetWillDelete = /* @__PURE__ */ new Set();
    this.tilesMapRenderNow = /* @__PURE__ */ new Map();
  }
  startListener(featureFunction) {
    this.cesiumParams = {
      viewer: this.viewer,
      camera: this.camera,
      endRender: false
    };
    this.featureFunction = featureFunction;
    if (!featureFunction) {
      this.featureFunction = this.testCameraBox;
    }
    this.batchRender();
    this.removeChanged = this.camera.changed.addEventListener(() => {
      this.batchRender();
    });
  }
  endListener() {
    this.removeChanged();
    this.destoryTiles();
  }
  destoryTiles() {
    this.tilesMapWillAdd.clear();
    this.cesiumParams.endRender = true;
    this.tilesIdArraysOld = [];
    this.tilesMapRenderNow.forEach((primitiveTileDestory, idDestory) => {
      debugger;
      this.viewer.scene.primitives.remove(primitiveTileDestory);
      this.tilesMapRenderNow.delete(idDestory);
    });
  }
  testCameraBox(cesiumParams, tilesMapRenderNow, positionArrays, id, renderArrayHeight) {
    const viewer = cesiumParams.viewer;
    let primitiveTile = null;
    const greenPolygonInstance = new Cesium.GeometryInstance({
      geometry: Cesium.PolygonGeometry.fromPositions({
        extrudedHeight: 10,
        positions: Cesium.Cartesian3.fromDegreesArray(positionArrays),
        vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT
      }),
      attributes: {
        distanceDisplayCondition: new Cesium.DistanceDisplayConditionGeometryInstanceAttribute(renderArrayHeight[0], renderArrayHeight[1]),
        color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromRandom({
          alpha: 0.5
        }))
      }
    });
    primitiveTile = new Cesium.Primitive({
      geometryInstances: [greenPolygonInstance],
      appearance: new Cesium.PerInstanceColorAppearance({
        closed: true,
        translucent: false
      })
    });
    viewer.scene.primitives.add(primitiveTile);
    tilesMapRenderNow.set(id, primitiveTile);
  }
  getTilesArrays(lon, lat) {
    const xLon = Math.PI + lon;
    const yLat = Math.PI / 2 - lat;
    const x = xLon / this.dlon;
    const y = yLat / this.dlat;
    const rowNew = Math.floor(y);
    const colNew = Math.floor(x);
    const rowChange = rowNew - this.row;
    const colChange = colNew - this.col;
    if (rowChange == 0 && colChange == 0) {
      return false;
    }
    const tilesArrays = [];
    const tilesIdArrays = [];
    const PI = Math.PI;
    const cc2rd = 180 / PI;
    for (let i = -this.tilesCountAdd; i <= this.tilesCountAdd; i++) {
      for (let j = -this.tilesCountAdd; j <= this.tilesCountAdd; j++) {
        const tile = { id: colNew + j + " " + (rowNew + i), positionArrays: [] };
        tile.positionArrays = [
          ((colNew + j) * this.dlon - PI) * cc2rd,
          (PI / 2 - (rowNew + i) * this.dlat) * cc2rd,
          ((colNew + j + 1) * this.dlon - PI) * cc2rd,
          (PI / 2 - (rowNew + i) * this.dlat) * cc2rd,
          ((colNew + j + 1) * this.dlon - PI) * cc2rd,
          (PI / 2 - (rowNew + i + 1) * this.dlat) * cc2rd,
          ((colNew + j) * this.dlon - PI) * cc2rd,
          (PI / 2 - (rowNew + i + 1) * this.dlat) * cc2rd
        ];
        tilesArrays.push(tile);
        tilesIdArrays.push(tile.id);
      }
    }
    const tilesArraysDeleteNew = this.tilesIdArraysOld.filter((id) => !new Set(tilesIdArrays).has(id));
    const tilesArraysAddNew = tilesArrays.filter((item) => !new Set(this.tilesIdArraysOld).has(item.id));
    if (this.tilesIdArraysOld) {
      for (let i = 0; i < tilesArraysDeleteNew.length; i++) {
        this.tilesSetWillDelete.add(tilesArraysDeleteNew[i]);
        this.tilesMapWillAdd.delete(tilesArraysDeleteNew[i]);
      }
    }
    for (let i = 0; i < tilesArraysAddNew.length; i++) {
      this.tilesMapWillAdd.set(tilesArraysAddNew[i].id, tilesArraysAddNew[i].positionArrays);
    }
    this.tilesIdArraysOld = tilesIdArrays.slice();
    this.row = Math.floor(y);
    this.col = Math.floor(x);
    return true;
  }
  batchRender() {
    const cameraPosition = this.camera.positionCartographic;
    if (cameraPosition.height < this.requestHeight && this.getTilesArrays(cameraPosition.longitude, cameraPosition.latitude)) {
      this.tilesMapWillAdd.forEach((positionArrays, id) => {
        this.tilesMapWillAdd.delete(id);
        this.featureFunction(this.cesiumParams, this.tilesMapRenderNow, positionArrays, id, this.renderArrayHeight);
      });
      this.tilesSetWillDelete.forEach((tileDelete) => {
        if (this.tilesMapRenderNow.get(tileDelete)) {
          this.viewer.scene.primitives.remove(this.tilesMapRenderNow.get(tileDelete));
          this.tilesSetWillDelete.delete(tileDelete);
          this.tilesMapRenderNow.delete(tileDelete);
        }
      });
    }
  }
};

// src/core/translate/LocalAndWorldTransform.ts
var LocalAndWorldTransform = class {
  constructor(RCSorigincenter, direction) {
    switch (direction) {
      case "northEastDown":
        this.RCSMatrix = Cesium.Transforms.northEastDownToFixedFrame(RCSorigincenter);
        break;
      case "northUpEast":
        this.RCSMatrix = Cesium.Transforms.northUpEastToFixedFrame(RCSorigincenter);
        break;
      case "northWestUp":
        this.RCSMatrix = Cesium.Transforms.northWestUpToFixedFrame(RCSorigincenter);
        break;
      default:
        this.RCSMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(RCSorigincenter);
        break;
    }
    this.RCSmatrixInverse = Cesium.Matrix4.inverseTransformation(this.RCSMatrix, new Cesium.Matrix4());
  }
  localToWorldCoordinates(localCoordinates, result) {
    if (!result)
      result = new Cesium.Cartesian3();
    Cesium.Matrix4.multiplyByPoint(this.RCSMatrix, localCoordinates, result);
    return result;
  }
  WorldCoordinatesTolocal(WorldCoordinates, result) {
    if (!result)
      result = new Cesium.Cartesian3();
    Cesium.Matrix4.multiplyByPoint(this.RCSmatrixInverse, WorldCoordinates, result);
    return result;
  }
};

// src/core/translate/M4Translate.ts
var M4Translate = class {
};

// src/core/translate/MouseClickTrans.ts
var MouseClickTrans = class {
};

// src/core/translate/TranslateSevenParams.ts
var TranslateSevenParams = class {
};

// src/core/translate/WorldPositionTransform.ts
var WorldPositionTransform = class {
  static PositionByCartographicChange(positions, heightAdd, lonRadiansAdd, latRadiansAdd) {
    let positionResult;
    for (let i = 0; i < positions.length; i += 1) {
      const cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(positions[i]);
      if (heightAdd)
        cartographic.height += heightAdd;
      if (lonRadiansAdd)
        cartographic.longitude += lonRadiansAdd;
      if (latRadiansAdd)
        cartographic.latitude += latRadiansAdd;
      positionResult[i] = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height);
    }
    return positionResult;
  }
  static getPositionAndCartographic(coordinate, type, result) {
    let position;
    let cartographicRadians;
    let cartographicDegrees;
    switch (type) {
      case "position":
        position = coordinate;
        break;
      case "cartographicDegrees":
        cartographicRadians = coordinate;
        position = Cesium.Cartesian3.fromDegrees(coordinate.longitude, coordinate.latitude, coordinate.height);
        break;
      case "cartographicRadians":
        cartographicDegrees = coordinate;
        position = Cesium.Cartesian3.fromRadians(coordinate.longitude, coordinate.latitude, coordinate.height);
        break;
      default:
        break;
    }
    result.position = position;
    result.cartographicRadians = cartographicRadians = cartographicRadians || Cesium.Ellipsoid.WGS84.cartesianToCartographic(position);
    result.cartographicDegrees = cartographicDegrees || {
      longitude: Cesium.Math.toDegrees(cartographicRadians.longitude),
      latitude: Cesium.Math.toDegrees(cartographicRadians.latitude),
      height: cartographicRadians.height
    };
    return result;
  }
};

// src/core/draw/mouse/BaseDraw.ts
var BaseDraw = class extends MouseListen {
  constructor(viewer) {
    super(viewer);
    this.pointDrawBool = false;
    this.lineDrawBool = false;
    this.polygonDrawBool = false;
    this.lineGroundDrawBool = false;
    this.polygonGroundDrawBool = false;
    this.storeEntities = false;
    this.linearr = [];
  }
  randomColor() {
    this.pointColor = Cesium.Color.fromRandom();
    this.lineColor = Cesium.Color.fromAlpha(this.pointColor, 0.7);
    this.polygonColor = Cesium.Color.fromAlpha(this.pointColor, 0.3);
  }
  stateStart() {
    super.stateStart();
    this.randomColor();
    this.PrimitiveAll = this.PrimitiveAll || this.viewer.scene.primitives.add(new Cesium.PrimitiveCollection());
    const myEntityCollection = new Cesium.CustomDataSource("clickEntityCollection");
    this.viewer.dataSources.add(myEntityCollection);
    this.entities = myEntityCollection.entities;
    if (!this.mouseMovePointPrimitives) {
      this.mouseMovePointPrimitivesCollection = this.viewer.scene.primitives.add(new Cesium.PointPrimitiveCollection());
      this.mouseMovePointPrimitives = RenderSimple.simplePointByPrimitives(this.mouseMovePointPrimitivesCollection, Cesium.Cartesian3.ZERO, 20, Cesium.Color.fromAlpha(Cesium.Color.RED, 0.5), 3);
    }
    this.pointPrimitives = this.PrimitiveAll.add(new Cesium.PointPrimitiveCollection());
    this.thisPpolylinePrimitive = this.PrimitiveAll.add(new Cesium.PolylineCollection());
    this.polygonPrimitives = this.PrimitiveAll.add(new Cesium.PrimitiveCollection());
    this._polylineGroundPrimitive = this.PrimitiveAll.add(new Cesium.PrimitiveCollection());
    this._polygonGroundPrimitive = this.PrimitiveAll.add(new Cesium.PrimitiveCollection());
    this.mouseLinePrimitive = null;
    this.mousePolygonGroundEntity = null;
    this.mouseLineGroundEntity = null;
  }
  drawPointStart() {
    this.pointDrawBool = !this.pointDrawBool;
  }
  drawLineStart() {
    this.lineDrawBool = !this.lineDrawBool;
  }
  drawPolygonStart() {
    this.polygonDrawBool = !this.polygonDrawBool;
  }
  drawGroundLineStart() {
    this.lineGroundDrawBool = !this.lineGroundDrawBool;
  }
  drawGroundPolygonStart() {
    this.polygonGroundDrawBool = !this.polygonGroundDrawBool;
  }
  storeEntitiesStart() {
    this.storeEntities = !this.storeEntities;
  }
  set click_MOUSE_MOVE(value) {
    this.mouseMovePointPrimitives.position = this.clickPositions[this.clickPositions.length - 1];
    if (this.lineDrawBool && this.mouseLinePrimitive) {
      this.mouseLinePrimitive.positions = this.clickPositions;
    }
  }
  set click_LEFT_CLICK(value) {
    const clickScene = this.clickPositions[this.clickPositions.length - 1];
    if (this.pointDrawBool) {
      RenderSimple.simplePointByPrimitives(this.pointPrimitives, clickScene, 10, Cesium.Color.fromAlpha(this.pointColor, 0.5), 3);
    }
    if (this.lineDrawBool) {
      this.mouseLinePrimitive = this.mouseLinePrimitive || RenderSimple.simpleLineByPrimitive(this.thisPpolylinePrimitive, this.clickPositions, 10, this.lineColor, null);
    }
    if (this.lineGroundDrawBool) {
      if (!this.mouseLineGroundEntity) {
        this.mouseLineGroundEntity = this.entities.add({
          name: "line",
          polyline: {
            positions: new Cesium.CallbackProperty(() => {
              return this.clickPositions;
            }, false),
            width: 3,
            material: Cesium.Color.fromAlpha(this.lineColor, 0.5),
            clampToGround: true
          }
        });
      }
    }
    if (this.polygonGroundDrawBool) {
      if (!this.mousePolygonGroundEntity) {
        console.log("\u7ED8\u5236");
        console.log(this.clickPositions);
        this.mousePolygonGroundEntity = this.entities.add({
          polygon: {
            hierarchy: new Cesium.CallbackProperty(() => {
              return new Cesium.PolygonHierarchy(this.clickPositions);
            }, false),
            material: Cesium.Color.fromAlpha(this.lineColor, 0.3)
          }
        });
      }
    }
  }
  set click_LEFT_DOUBLE_CLICK(value) {
    if (this.pointDrawBool) {
    }
    if (this.lineDrawBool) {
      this.mouseLinePrimitive = null;
    }
    if (this.lineGroundDrawBool) {
      console.log(this.mouseLineGroundEntity.polyline);
      if (this.storeEntities) {
        this.mouseLineGroundEntity.polyline.positions = this.clickPositions;
      }
      this.mouseLineGroundEntity = null;
    }
    if (this.polygonDrawBool) {
      console.log("\u7ED8\u5236\u771F\u5B9E\u9762", this.clickPositions);
      const color = Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromAlpha(this.pointColor, 0.5));
      const polygonInstance = new Cesium.GeometryInstance({
        geometry: new Cesium.PolygonGeometry({
          polygonHierarchy: new Cesium.PolygonHierarchy(this.clickPositions),
          perPositionHeight: true
        }),
        attributes: { color }
      });
      this.polygonPrimitives.add(new Cesium.Primitive({
        geometryInstances: [polygonInstance],
        appearance: new Cesium.PerInstanceColorAppearance()
      }));
    }
    if (this.polygonGroundDrawBool) {
      if (this.storeEntities) {
        console.log(this.mouseLineGroundEntity);
        this.mousePolygonGroundEntity.polygon.hierarchy = new Cesium.PolygonHierarchy(this.clickPositions);
      }
      this.mousePolygonGroundEntity = null;
    }
    this.randomColor();
  }
  removeAll() {
    super.removeAll();
    this.mouseMovePointPrimitivesCollection.remove(this.mouseMovePointPrimitives);
    this.mouseMovePointPrimitives = null;
    this.PrimitiveAll.removeAll();
    this.entities.removeAll();
  }
};

// src/core/control/camera/CameraPro.ts
var CameraPro = class {
  constructor(camera) {
    this.camera = camera;
  }
  static cameraFlyTo(params, viewer) {
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(params.x, params.y, params.z),
      orientation: {
        heading: Cesium.Math.toRadians(params.heading),
        pitch: Cesium.Math.toRadians(params.pitch),
        roll: Cesium.Math.toRadians(params.roll)
      }
    });
  }
  static cameraSetView(params, viewer) {
    viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(params.x, params.y, params.z),
      orientation: {
        heading: Cesium.Math.toRadians(params.heading),
        pitch: Cesium.Math.toRadians(params.pitch),
        roll: Cesium.Math.toRadians(params.roll)
      }
    });
  }
  static cameraSetViewGraphic(params, viewer) {
    viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(params.lon, params.lat, params.h),
      orientation: {
        heading: Cesium.Math.toRadians(params.heading),
        pitch: Cesium.Math.toRadians(params.pitch),
        roll: Cesium.Math.toRadians(params.roll)
      }
    });
  }
  static cameraSetViewCartesian3(params, viewer) {
    viewer.camera.setView({
      destination: new Cesium.Cartesian3(params.x, params.y, params.z),
      orientation: {
        heading: Cesium.Math.toRadians(params.heading),
        pitch: Cesium.Math.toRadians(params.pitch),
        roll: Cesium.Math.toRadians(params.roll)
      }
    });
  }
};
var a = /* @__PURE__ */ new Map();
a.set("1", "1");

// src/core/control/event/HandlerManager.ts
var HandlerManager = class {
  constructor() {
    this.handlers = /* @__PURE__ */ new Map();
  }
  static getInstance() {
    if (!this.Instance) {
      this.Instance = new HandlerManager();
    }
    return this.Instance;
  }
  set(id, viewer) {
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    this.handlers.set(id, handler);
  }
};

// src/cesium-dev-help.ts
var VERSION = "0.0.5";
export {
  BaseDraw,
  CameraPro,
  CesiumPrimitivesProvider,
  ComputationalGeom,
  HandlerManager,
  HoleDraw,
  InitViewer,
  LibManager,
  LocalAndWorldTransform,
  M4Translate,
  MouseClickTrans,
  MouseListen,
  RenderGlb,
  RenderInstance,
  RenderSimple,
  TranslateSevenParams,
  Universal3DSceneInterface,
  VERSION,
  ViwerSet,
  WorldPositionTransform,
  renderModelByprimitive
};
//# sourceMappingURL=cesium-dev-help.js.map
