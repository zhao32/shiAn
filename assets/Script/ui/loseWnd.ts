// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { audioConfig, GameMassage } from "../config/Config";
import { AudioMgr } from "../framework/AudioMgr";
import { E_GameData_Type, GameDataMgr } from "../framework/GameDataMgr";
import { ResourcesMgr } from "../framework/ResourcesMgr";
import { UIManager } from "../framework/UIManager";
import GameUtil from "./GameUtil";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    btnReplay: cc.Node = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.zIndex = 10;
    }

    start() {
        console.log("加载失败界面");
        this.btnReplay.on(cc.Node.EventType.TOUCH_END, () => {
            console.log('关闭失败窗口')
            // UIManager.closeUI(this.node.name);
            // let levNum = GameDataMgr.getDataByType(E_GameData_Type.ClickPassLv);
            // let lv = "level" + GameUtil.CURLEVEL;

            // console.log(this.node.parent);
            // let node = this.node.parent.getChildByName(lv);
            // node.destroy();
            // ResourcesMgr.loadPrefab(lv,function(){});
            // UIManager.openUI(lv);
            let str = "level" + GameUtil.CURLEVEL;
            cc.find("Canvas").getChildByName(str).destroy();
            
            GameUtil.instance.loadPage()
            this.node.destroy()
        }, this)

    }

    /**返回点击点击*/
    private backBtnClick(){
        this.node.destroy()
        let aa = "level" + GameUtil.CURLEVEL
        cc.find("Canvas").getChildByName(aa).destroy()
        // UIManager.closeUI(this.node.name);
        // UIManager.closeAllUI()
        // UIManager.closeUI("UI_Level");
    }

    /**音乐点击*/
    // private musicBool:boolean = true;
    private soundBtnClick(){
        AudioMgr.playAudioEffect(audioConfig.WordClick);
        if(GameMassage.musicBool){
            GameMassage.musicBool = false;
            // this.musicCloseBg.active = true;
            GameDataMgr.setDataByType(E_GameData_Type.IsHadAudio_BG, false);
            AudioMgr.pauseBGMusic();
        }else{
            GameMassage.musicBool = true;
            // this.musicCloseBg.active = false;
            GameDataMgr.setDataByType(E_GameData_Type.IsHadAudio_BG, true);
            AudioMgr.playBGMusic(audioConfig.M_BGMusic);
        }
    }

    // update (dt) {}
}
