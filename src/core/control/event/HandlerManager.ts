/**
 * HandlerManager
 * 事件管理器
 * @author Wangxu
 * @date 2021/5/6
 */
import { Cesium } from '../../outsource/LibManager';

/**
 * 事件管理器（提供统一的事件管理 单例）
 *
 * @class HandlerManager
 */
class HandlerManager {
    static Instance: HandlerManager;
    handlers: Map<string, Cesium.ScreenSpaceEventHandler>;
    constructor() {
        this.handlers = new Map()
    }
    static getInstance() {
        if (!this.Instance) {
            this.Instance = new HandlerManager();
        }
        return this.Instance;
    }

    set(id:string, viewer:Cesium.Viewer) {
        const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
        this.handlers.set(id, handler)
    }

}

export{HandlerManager}