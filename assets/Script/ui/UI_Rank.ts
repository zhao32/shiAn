import { audioConfig, RankConfig } from "../config/Config";
import { AudioMgr } from "../framework/AudioMgr";
import { E_GameData_Type, GameDataMgr } from "../framework/GameDataMgr";
import { UIManager } from "../framework/UIManager";


const {ccclass, property} = cc._decorator;

@ccclass
export default class UI_Rank extends cc.Component {
    // LIFE-CYCLE CALLBACKS:
    @property({
        type: cc.Node,
        tooltip: "排名 "
    })
    private content: cc.Node = null;

    @property({
        type: cc.Prefab,
        tooltip: "排名Item "
    })
    private spItem: cc.Prefab = null;

    private shopLength:number = 0

    onLoad () {
        this.itemShow();
    }

    // start () {

    // }

    /**item显示 */
    itemShow(){

        this.shopLength = RankConfig.length;
        let contents = this.content;
        if(contents.childrenCount>0){
            contents.removeAllChildren();
        }
        // contents.height = 120* this.shopLength

        if(this.shopLength>0){
            for(let i = 0;i < this.shopLength ;i++){
                let item = cc.instantiate(this.spItem);
                contents.addChild(item);
                item.name ="ran" + i;
                let view = item.getComponent("rankItem");
                view.itemShow(i)
            }
        }
    }

    /**返回点击点击*/
    private backBtnClick(){
        UIManager.closeUI(this.node.name);
    }

    /**音乐点击*/
    private musicBool:boolean = true;
    private soundBtnClick(){
        AudioMgr.playAudioEffect(audioConfig.WordClick);
        if(this.musicBool){
            this.musicBool = false;
            // this.musicCloseBg.active = true;
            GameDataMgr.setDataByType(E_GameData_Type.IsHadAudio_BG, false);
            AudioMgr.pauseBGMusic();
        }else{
            this.musicBool = true;
            // this.musicCloseBg.active = false;
            GameDataMgr.setDataByType(E_GameData_Type.IsHadAudio_BG, true);
            AudioMgr.playBGMusic(audioConfig.M_BGMusic);
        }
    }

    // update (dt) {}
}
