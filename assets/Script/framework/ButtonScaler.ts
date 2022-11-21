/**
 * @ 按钮通用控制脚本
 * @ 使用方法：直接添加到按钮控件即可 缩放参数可以自己调整
 */

// import AudioManager from "./Manager/AudioManager";
// import EnumManager from "./Manager/EnumManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property
    pressedScale: number = 1.05;

    @property
    transDuration: number = 0.1;

    @property
    audio: number = 0;

    initScale: number = 0;

    onLoad() {
        var that = this;
        this.initScale = this.node.scale;
        // console.log('that.pressedScale:'+that.pressedScale)
        function onTouchDown(event) {
            let scaleDownAction = cc.scaleTo(that.transDuration, that.pressedScale * that.initScale);
            this.stopAllActions();
            // AudioManager.instance.playSound(EnumManager.AudioPath.click, false, 1)
            this.runAction(scaleDownAction);
        }

        function onTouchUp(event) {
            let scaleUpAction = cc.scaleTo(that.transDuration, that.initScale);
            this.stopAllActions();
            this.runAction(scaleUpAction);
        }

        this.node.on(cc.Node.EventType.TOUCH_START, onTouchDown, this.node);
        this.node.on(cc.Node.EventType.TOUCH_END, onTouchUp, this.node);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, onTouchUp, this.node);
    }
}
